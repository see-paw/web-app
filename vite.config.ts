import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as fs from "node:fs";
import path from "path"

const isCI = process.env.CI === "true";

const serverConfig = isCI
    ? {
        port: 3000
    }
    : {
        https: {
            key: fs.readFileSync("./certs/WebAPI.key"),
            cert: fs.readFileSync("./certs/WebAPI.crt"),
        },
        port: 3000}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    server: serverConfig,
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    css: {
        modules: {
            localsConvention: 'camelCase'
        }
    }
})
