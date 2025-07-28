import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  server: {
    host: false,
    port: 8083,
    proxy: {
      // Forward all requests starting with /api to your backend
      '/api': {
        target: 'http://62.171.169.191:5000',
        changeOrigin: true,
        secure: false, // Allow self-signed or insecure certificates (if HTTPS is used)
        rewrite: (path) => path.replace(/^\/api/, '') // optional: strip /api from the URL
      }
    }
  },
  plugins: [
    react(),
    mode === 'development'
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
