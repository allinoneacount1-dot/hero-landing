import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "wallet-adapter": [
            "@solana/wallet-adapter-base",
            "@solana/wallet-adapter-phantom",
            "@solana/wallet-adapter-react",
            "@solana/wallet-adapter-react-ui",
            "@solana/web3.js",
          ],
          "vendor": [
            "react",
            "react-dom",
            "react-router-dom",
          ],
          "lucide": ["lucide-react"],
        },
      },
    },
  },
});
