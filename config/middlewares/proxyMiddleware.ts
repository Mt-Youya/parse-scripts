// middleware/proxy-cache.js
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { defineConfig } from "vite";
import { brotliDecompress, gunzip } from "zlib";

export const CACHE_DIR = ".cache";
export class ProxyCacheMiddleware {
  cacheDir = CACHE_DIR;
  defaultTTL = 30 * 60 * 1000;
  maxCacheSize = 500;
  enabledPatterns = [];
  configs = new Map();

  constructor(options = {}) {
    this.cacheDir = options.cacheDir || ".cache";
    this.defaultTTL = options.defaultTTL || 30 * 60 * 1000; // 30分钟
    this.maxCacheSize = options.maxCacheSize || 500; // 最大缓存文件数
    this.enabledPatterns = options.enabledPatterns || []; // 启用缓存的路径模式

    this.ensureCacheDir()
  }

  // 确保缓存目录存在
  ensureCacheDir() {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  // 默认缓存键生成
  defaultCacheKey(req, body) {
    let key = `${req.method}:${req.url}`;
    if (body && typeof body === "object") {
      key += `:${JSON.stringify(body)}`;
    }
    return crypto.createHash("md5").update(key).digest("hex");
  }

  // 获取缓存文件路径
  getCacheFilePath(serviceName, cacheKey) {
    return path.join(this.cacheDir, `${serviceName}_${cacheKey}.json`);
  }

  // 检查缓存是否有效
  isCacheValid(filePath, ttl) {
    try {
      if (!fs.existsSync(filePath)) {
        return false;
      }
      const stats = fs.statSync(filePath);
      return Date.now() - stats.mtime.getTime() < ttl;
    } catch (error) {
      return false;
    }
  }

  // 读取缓存
  readCache(filePath) {
    try {
      const data = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error("读取缓存失败:", error?.message ?? error);
      // 删除损坏的缓存文件
      try {
        fs.unlinkSync(filePath);
      } catch { }
      return null;
    }
  }

  // 写入缓存
  writeCache(filePath, data) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
      return true;
    } catch (error) {
      console.error("写入缓存失败:", error?.message ?? error);
      return false;
    }
  }

  // 清理过期缓存
  cleanupCache() {
    try {
      const files = fs.readdirSync(this.cacheDir);
      let cleanedCount = 0;
      let totalFiles = files.length;

      // 按修改时间排序，删除最旧的文件
      const fileStats = files
        .map((file) => ({
          name: file,
          path: path.join(this.cacheDir, file),
          mtime: fs.statSync(path.join(this.cacheDir, file)).mtime.getTime(),
        }))
        .sort((a, b) => b.mtime - a.mtime);

      // 如果文件数超过限制，删除最旧的
      if (totalFiles > this.maxCacheSize) {
        const filesToDelete = fileStats.slice(this.maxCacheSize);
        for (const { path: filePath } of filesToDelete) {
          fs.unlinkSync(filePath);
          cleanedCount++;
        }
      }

      // 删除所有服务的过期缓存
      for (const [serviceName, config] of this.configs.entries()) {
        const serviceFiles = fileStats.filter((f) => f.name.startsWith(`${serviceName}_`));
        for (const { path: filePath } of serviceFiles) {
          if (!this.isCacheValid(filePath, config.ttl)) {
            fs.unlinkSync(filePath);
            cleanedCount++;
          }
        }
      }

      if (cleanedCount > 0) {
        console.log(`🗑️ 清理了 ${cleanedCount} 个过期/多余的缓存文件`);
      }
    } catch (error) {
      console.error("清理缓存时出错:", error?.message ?? error);
    }
  }

  // 启动定时清理
  startCleanupInterval() {
    setInterval(() => {
      this.cleanupCache();
    }, this.defaultTTL); // 每10分钟清理一次
  }

  processGzipResponse(response) {
    return new Promise((resolve, reject) => {
      gunzip(response, (err, decompressed) => {
        if (err) {
          return reject(err);
        }
        resolve(decompressed.toString("utf-8"));
      });
    });
  }

  processBrotliResponse(response) {
    return new Promise((resolve, reject) => {
      brotliDecompress(response, (err, decompressed) => {
        if (err) {
          return reject(err);
        }
        resolve(decompressed.toString("utf-8"));
      });
    });
  }

  request(serviceName, req, res, body) {
    const config = this.configs.get(serviceName);

    if (!config.cacheKey) {
      config.cacheKey = config.generateCacheKey?.(req, req?.body) || this.defaultCacheKey(req, req?.body);
    }
    const cacheKey = config.cacheKey;

    const cacheFilePath = this.getCacheFilePath(serviceName, cacheKey);

    // 检查缓存
    if (this.isCacheValid(cacheFilePath, config.ttl)) {
      const cachedData = this.readCache(cacheFilePath);

      if (cachedData) {
        try {
          const responseData = cachedData.data;
          res.writeHead(cachedData.statusCode || 200, { "Content-Type": "application/json" });
          res.write(JSON.stringify(responseData));
          res.end();
          console.log("读取缓存: ", serviceName);
        } catch (err) {
          console.log("responseData err", serviceName, err);
          return false;
        }
        return false; // 拦截请求
      }
      return true;
    }

    // 将请求体重新注入（如果需要）
    if (body !== null) {
      req.body = body;
    }

    return true; // 继续代理请求
  }

  // 创建 configure 函数
  createConfigure(serviceName) {
    return (proxy, options) => {
      const config = this.configs.get(serviceName);

      if (!config) return;
      proxy.on("proxyReq", (proxyRes, req, res) => {
        config.cacheKey = config.cacheKey || config.generateCacheKey(req, req.body) || this.defaultCacheKey(req, req?.body);
      });

      proxy.on("proxyRes", (proxyRes, req, res) => {
        const chunks: Uint8Array<ArrayBufferLike>[] = [];

        proxyRes.on("data", (chunk) => {
          chunks.push(chunk);
        });

        proxyRes.on("end", async () => {
          try {
            const bodyBuffer = Buffer.concat(chunks);
            const encoding = proxyRes.headers["content-encoding"];

            let result = "";

            switch (encoding) {
              case "gzip":
                result = await this.processGzipResponse(bodyBuffer);
                break;
              case "br":
                result = await this.processBrotliResponse(bodyBuffer);
                break;
              default:
                result = JSON.stringify({});
                break;
            }
            // 尝试解析响应
            const parsedData = JSON.parse(result);

            // 准备缓存数据
            const cacheData = {
              statusCode: proxyRes.statusCode,
              headers: { ...proxyRes.headers },
              data: parsedData,
              timestamp: Date.now(),
              url: req.url,
              method: req.method,
              service: serviceName,
            };

            const cacheKey = config.cacheKey;
            const cacheFilePath = this.getCacheFilePath(serviceName, cacheKey);

            this.writeCache(cacheFilePath, cacheData);
          } catch (error) {
            console.error(`❌ ${serviceName} 缓存处理失败:`, error?.message ?? error);
          }
        });

        console.log(`${serviceName} ✅ 代理响应:`, proxyRes.statusCode, req.url);
      });

      proxy.on("error", (err, req, res) => {
        console.error(`${serviceName} ❌ 代理错误:`, err.message, req.url);
      });
    };
  }

  // 注册服务配置
  registerService(name: string, config) {
    const defaultConfig = {
      ttl: this.defaultTTL,
    };

    this.configs.set(name, { ...defaultConfig, ...config });
    return this;
  }

  // 获取缓存统计信息
  getStats() {
    try {
      const files = fs.readdirSync(this.cacheDir);
      const stats = {};

      for (const [serviceName] of this.configs.entries()) {
        const serviceFiles = files.filter((f) => f.startsWith(`${serviceName}_`));
        stats[serviceName] = {
          count: serviceFiles.length,
          totalSize: serviceFiles.reduce((size, file) => {
            try {
              return size + fs.statSync(path.join(this.cacheDir, file)).size;
            } catch {
              return size;
            }
          }, 0),
        };
      }

      return {
        totalFiles: files.length,
        services: stats,
        cacheDir: this.cacheDir,
      };
    } catch (error) {
      return { error: error?.message ?? error };
    }
  }
}

export function registerMiddleware() {
  // 创建缓存中间件实例
  const cacheMiddleware = new ProxyCacheMiddleware({
    cacheDir: ".cache/game-stores",
    defaultTTL: 30 * 60 * 1000, // 30分钟
    maxCacheSize: 1000, // 最大1000个缓存文件
  });

  // 配置 Epic Games Store
  cacheMiddleware.registerService("epic", {
    ttl: 60 * 60 * 1000, // Epic 缓存1小时
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
    generateCacheKey: (req, body) => {
      // Epic GraphQL 的特殊缓存键生成
      let key = `${req.method}:${req.url}`;
      if (body && body.variables) {
        const { count, start, category, sortBy } = body.variables;
        key += `:${count || 40}:${start || 0}:${category || "all"}:${sortBy || "relevancy"}`;
      }
      return crypto.createHash("md5").update(key).digest("hex");
    },
    cacheKey: "",
  });

  cacheMiddleware.registerService("gog", {
    ttl: 45 * 60 * 1000, // GOG 缓存45分钟
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
    cacheKey: "",
  });

  cacheMiddleware.registerService("steam", {
    ttl: 20 * 60 * 1000,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
    cacheKey: "",
  });

  cacheMiddleware.registerService("freetogame", {
    ttl: 20 * 60 * 1000,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
    cacheKey: "",
  });

  cacheMiddleware.registerService("cheapshark", {
    ttl: 20 * 60 * 1000,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
    cacheKey: "",
  });

  return cacheMiddleware;
}

export default function (cacheMiddleware: ReturnType<typeof registerMiddleware>) {
  return defineConfig({
    plugins: [
      {
        name: "cache-stats",
        configureServer(server) {
          server.middlewares.use("/api/cache-stats", (req, res, next) => {
            if (req.method === "GET") {
              const stats = cacheMiddleware.getStats();
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(stats, null, 2));
            } else {
              next();
            }
          });
        },
      },
    ],
  });
}
