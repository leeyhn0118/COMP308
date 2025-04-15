import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "shell",
      remotes: {
        auth: "http://localhost:3001/assets/auth.js",
        community: "http://localhost:3002/assets/community.js"
      },
      shared: ["react", "react-dom", "react-router-dom", "@apollo/client"]
    })
  ],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
        cookiePathRewrite: { "*": "/" }
      }
    }
  },
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false
  }
});
