import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";


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
          { "src": "logo512.png", 
            "sizes": "512x512", "type": "image/png" },
        ],
      },
    }),
  ],

  base: "/FrontendRIPBackeven",

  server: {
   // https: {
    //  key: fs.readFileSync(path.resolve(__dirname, "cert.key")),
     // cert: fs.readFileSync(path.resolve(__dirname, "cert.crt")),
   // },
    port: 3000,
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:8082",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api/v1"),
      },
    },
  },
});
