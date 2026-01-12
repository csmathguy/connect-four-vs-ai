import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const serverPort = Number(process.env.PORT ?? "4444");

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4445,
    proxy: {
      "/api": {
        target: `http://localhost:${serverPort}`,
        changeOrigin: true
      }
    }
  }
});

