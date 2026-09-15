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
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false, // Allow self-signed or insecure certificates (if HTTPS is used)
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
