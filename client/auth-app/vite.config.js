import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "auth",
      filename: "auth.js",
      exposes: {
        "./App": "./src/App.jsx"
      },
      shared: ["react", "react-dom", "react-router-dom", "@apollo/client"]
    })
  ],
  server: {
    port: 3001
  },
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false
  }
});
