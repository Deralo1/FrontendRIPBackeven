import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { api_proxy_addr, img_proxy_addr, dest_root } from "./src/target_config";
import fs from "fs";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: "my-app",
        short_name: "my-app",
        start_url: "/FrontendRIPBackeven/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        icons: [
          {
            src: "logo512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],

  // ВАЖНО: base должен заканчиваться слэшем
base: dest_root,


  server: {
    https: {
      key: fs.readFileSync(
        path.resolve(__dirname, "certs/10.205.157.61-key.pem"),
      ),
      cert: fs.readFileSync(path.resolve(__dirname, "certs/10.205.157.61.pem")),
    },
    host: "0.0.0.0", // обязательно, иначе ZeroTier не увидит сервер 
    port: 3000,
    open: true,

    proxy: {
  "/api": {
    target: api_proxy_addr,
    changeOrigin: true,
    secure: false,
    rewrite: (path) => path.replace(/^\/api/, "/api/v1"),


  },

  "/img-proxy": {
    target: img_proxy_addr,
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/img-proxy/, ""),
secure: false

    
  },
}

  },
});
