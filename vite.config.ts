import { defineConfig } from "vite"
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react-swc"
import AutoImport from "unplugin-auto-import/vite"
import Inspect from "vite-plugin-inspect"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), tailwindcss(),
    Inspect({ build: true, outputDir: ".vite-inspect" }),
    AutoImport({
      imports: ["react", "react-router", "react-router-dom"],
      include: [/\.[tj]sx?$/],
      dts: true,
    }),
  ],
  server: {
    host: true, // 允许外部访问
    proxy: {
      // Epic Games API 代理
      '/api/epic': {
        target: 'https://store-site-backend-static-ipv4.ak.epicgames.com',
        changeOrigin: true,
        rewrite: (path) => {
          // 将 /api/epic 重写为目标API路径
          if (path.includes('/api/epic/')) {
            return path.replace('/api/epic/', '/');
          }
          return '/freeGamesPromotions' + path.replace('/api/epic', '');
        },
        secure: true,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('🔄 代理请求:', req.url);
            // 添加必要的请求头
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('✅ 代理响应:', proxyRes.statusCode, req.url);
          });
          proxy.on('error', (err, req, res) => {
            console.error('❌ 代理错误:', err.message, req.url);
          });
        }
      },

      // Steam API 代理（如果需要）
      '/api/steam': {
        target: 'https://store.steampowered.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/steam/, ''),
        secure: true,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      },

      // 第三方免费游戏API代理
      '/api/freetogame': {
        target: 'https://www.freetogame.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/freetogame/, '/api'),
        secure: true
      },

      // CheapShark API 代理
      '/api/cheapshark': {
        target: 'https://www.cheapshark.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/cheapshark/, '/api/1.0'),
        secure: true
      },

      // GOG API 代理
      '/api/gog': {
        target: 'https://www.gog.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/gog/, ''),
        secure: true,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'X-Requested-With': 'XMLHttpRequest'
        },
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('🔄 GOG 代理请求:', req.url);
          });
          proxy.on('error', (err, req, res) => {
            console.error('❌ GOG 代理错误:', err.message);
          });
        }
      },
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // 环境变量
  define: {
    __DEV__: JSON.stringify(true)
  },

  // 预览服务器配置（用于预览构建结果）
  preview: {
    port: 4173,
    host: true
  }
})
