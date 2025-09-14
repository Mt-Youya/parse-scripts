import { defineConfig, mergeConfig } from "vite";
import ProxyMiddleware, { registerMiddleware } from "./middlewares/proxyMiddleware";

const cacheMiddleware = registerMiddleware();

const defaultConfig = defineConfig({
  server: {
    proxy: {
      "/api/epic": {
        target: "https://store-site-backend-static-ipv4.ak.epicgames.com",
        changeOrigin: true,
        rewrite: (path) => path.replace("/api/epic/", "/"),
        secure: true,
        bypass: (...args) => cacheMiddleware.request("epic", ...args),
        configure: cacheMiddleware.createConfigure("epic"),
        // configure(proxy, options) {
        //   proxy.on("proxyRes", (proxyReq, req, res) => {
        //     const chunks = [];
        //     proxyReq.on("data", (chunk) => chunks.push(chunk));
        //     // setCache("epic", res);
        //     proxyReq.on("end", async () => {
        //       const completeBuffer = Buffer.concat(chunks);
        //       const encoding = proxyReq.headers["content-encoding"];
        //       // 根据内容编码进行解压
        //       if (encoding === "gzip") {
        //         gunzip(completeBuffer, (err, decompressed) => {
        //           if (err) {
        //             console.log("gunzip err:", err);
        //             return;
        //           }
        //           const response = decompressed.toString("utf8");
        //           const result = JSON.parse(response);

        //           res.end(result);
        //         });
        //       } else if (encoding === "br") {
        //         brotliDecompress(completeBuffer, (err, decompressed) => {
        //           if (err) {
        //             console.log("brotliDecompress err:", err);
        //             return;
        //           }
        //           const response = decompressed.toString("utf8");
        //           const result = JSON.parse(response);
        //           writeFileSync("./.cache/demo.json", JSON.stringify(result, null, 2), "utf8");
        //           res.end(result);
        //         });
        //       }
        //     });
        //   });
        // },
      },

      "/api/steam": {
        target: "https://store.steampowered.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/steam/, ""),
        secure: true,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        bypass: (...args) => cacheMiddleware.request("steam", ...args),
        configure: cacheMiddleware.createConfigure("steam"),
      },

      "/api/freetogame": {
        target: "https://www.freetogame.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/freetogame/, "/api"),
        secure: true,
        bypass: (...args) => cacheMiddleware.request("freetogame", ...args),
        configure: cacheMiddleware.createConfigure("freetogame"),
      },

      // CheapShark API 代理
      "/api/cheapshark": {
        target: "https://www.cheapshark.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/cheapshark/, "/api/1.0"),
        secure: true,
        bypass: (...args) => cacheMiddleware.request("cheapshark", ...args),
        configure: cacheMiddleware.createConfigure("cheapshark"),
      },

      "/api/gog": {
        target: "https://www.gog.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/gog/, ""),
        secure: true,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "X-Requested-With": "XMLHttpRequest",
        },
        bypass: (...args) => cacheMiddleware.request("gog", ...args),
        configure: cacheMiddleware.createConfigure("gog"),
      },
    },
  },
});

export default mergeConfig(defaultConfig, ProxyMiddleware(cacheMiddleware));
