import { VitePWA } from "vite-plugin-pwa";
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), VitePWA({ registerType: "autoUpdate" })],
});
