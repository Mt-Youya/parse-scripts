import { defineConfig, mergeConfig } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import AutoImport from "unplugin-auto-import/vite";
import Inspect from "vite-plugin-inspect";
import ProxyConf from "./config/proxyConf";

const defaultConf = defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    Inspect({ build: true, outputDir: ".vite-inspect" }),
    AutoImport({
      imports: ["react", "react-router", "react-router-dom"],
      include: [/\.[tj]sx?$/],
      dts: true,
    }),
  ],
  server: {
    host: true, // 允许外部访问
    port: 5173,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // 预览服务器配置（用于预览构建结果）
  preview: {
    port: 4173,
    host: true,
  },
});

export default mergeConfig(defaultConf, ProxyConf, true);
