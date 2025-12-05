import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(() => {
  const env = loadEnv("", process.cwd(), "");

  return {
    define: {
      "import.meta.env.VITE_API_URL": JSON.stringify(env.VITE_API_BASE),
    },
    plugins: [react(), tailwindcss()],
    server: {
      host: "0.0.0.0",
      port: 5173,
      strictPort: true,
      hmr: {
        host: "localhost",
        port: 5173,
      },
      allowedHosts: true,
      proxy: {
        "/api": "http://localhost:3000",
      },
    },

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
