import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as fs from "node:fs";
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
        https: {
            key: fs.readFileSync("./certs/WebAPI.key"),
            cert: fs.readFileSync("./certs/WebAPI.crt"),
        },
        port: 3000,
    },
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
