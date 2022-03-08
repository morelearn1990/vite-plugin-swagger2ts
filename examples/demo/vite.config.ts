import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Swagger2Ts from "vite-plugin-swagger2ts";
import Restart from "vite-plugin-restart";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Swagger2Ts({ swaggerUrl: "http://test.com", output: "./src/swagger.ts" }),
    Restart({
      restart: ["../../dist/*.js"]
    })
  ]
});
