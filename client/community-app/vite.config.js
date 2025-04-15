import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "community",
      filename: "community.js",
      exposes: {
        "./App": "./src/App.jsx"
      },
      shared: ["react", "react-dom", "react-router-dom", "@apollo/client"]
    })
  ],
  server: {
    port: 3002,
    proxy: {
      "/graphql": {
        target: "http://localhost:4002", // Community Service GraphQL endpoint
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/graphql/, "")
      }
    },
    historyApiFallback: true
  },
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false
  }
});
