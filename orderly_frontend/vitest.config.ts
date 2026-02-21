import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],

  // ✅ ADD THIS BLOCK
  server: {
    port: 8080,
    hmr: {
      protocol: "ws",
      host: "localhost",
      port: 8080,
    },
  },

  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },

  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
