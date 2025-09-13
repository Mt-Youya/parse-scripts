import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      '/api/epic': {
        target: 'https://store-site-backend-static-ipv4.ak.epicgames.com',
        changeOrigin: true,
        rewrite: (path) => path.replace('/api/epic/', '/'),
        secure: true,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('epic 🔄 代理请求:', req.url);
            // 添加必要的请求头
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('epic ✅ 代理响应:', proxyRes.statusCode, req.url);
          });
          proxy.on('error', (err, req, res) => {
            console.error('epic ❌ 代理错误:', err.message, req.url);
          });
        }
      },

      '/api/steam': {
        target: 'https://store.steampowered.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/steam/, ''),
        secure: true,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      },

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
  }
})
