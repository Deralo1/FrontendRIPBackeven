import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    port: 3000,
    open: true,

    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,

        // /api/expenses → http://localhost:8082/api/v1/expenses
        rewrite: (path) => path.replace(/^\/api/, "/api/v1"),
      },
    },
  },
});
