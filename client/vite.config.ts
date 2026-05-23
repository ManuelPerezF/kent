import { defineConfig, loadEnv } from "vite";
import path from "node:path";
import electron from "vite-plugin-electron/simple";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const backendUrl = env.VITE_BACKEND_URL ?? "http://localhost:3000";

  return {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: backendUrl,
          changeOrigin: true,
        },
      },
    },
    plugins: [
      react(),
      tailwindcss(),
      electron({
        main: {
          entry: "electron/main.ts",
        },
        preload: {
          input: path.join(__dirname, "electron/preload.ts"),
        },
        renderer:
          process.env.NODE_ENV === "test"
            ? undefined
            : {},
      }),
    ],
  };
});
