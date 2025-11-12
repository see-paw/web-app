import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as fs from "node:fs";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
        https: {
            key: fs.readFileSync("./certs/WebAPI.key"),
            cert: fs.readFileSync("./certs/WebAPI.crt"),
        },
        port: 3000,
    }
})
