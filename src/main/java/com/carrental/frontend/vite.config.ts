import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // ✅ Combine both server configurations into one object
  server: {
    host: "::",
    port: 5173,
    proxy: {
      '/api': { // Proxy all requests starting with '/api'
        target: 'http://localhost:8080', // Your Spring Boot backend
        changeOrigin: true, // Needed for virtual hosted sites
        secure: false, // Set to true if using HTTPS on the target
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Remove the duplicate server object here
}));