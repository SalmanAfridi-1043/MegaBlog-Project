import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Raise the warning threshold to 800 KB
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        // Split large vendor libraries into separate chunks
        manualChunks: {
          "vendor-react":   ["react", "react-dom", "react-router-dom"],
          "vendor-redux":   ["@reduxjs/toolkit", "react-redux"],
          "vendor-appwrite": ["appwrite"],
          "vendor-tinymce": ["@tinymce/tinymce-react"],
        },
      },
    },
  },
});
