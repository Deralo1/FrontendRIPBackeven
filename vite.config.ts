import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import {api_proxy_addr, img_proxy_addr, dest_root} from "./src/target_config"


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
   // https: {
    //  key: fs.readFileSync(path.resolve(__dirname, "cert.key")),
     // cert: fs.readFileSync(path.resolve(__dirname, "cert.crt")),
   // },
    host: true, // позволяет открывать сайт по локальному IP
    port: 3000,
    open: true,

    proxy: {
      "/api": {
        target: api_proxy_addr,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api/v1"),
      },
      "/img-proxy": {
        target: img_proxy_addr,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/img-proxy/, ""),
      },
    },
  },
});
