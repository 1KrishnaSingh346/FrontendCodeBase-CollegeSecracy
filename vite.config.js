import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  base: "/", // 🔥 Important to keep root-relative paths for assets

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // ✅ Used only in dev
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    outDir: "dist", // This must match backend static path
  },
});
