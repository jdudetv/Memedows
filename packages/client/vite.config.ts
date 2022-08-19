import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import commonJsExternals from "vite-plugin-commonjs-externals";
import path from "path";

import { builtins } from "./config/externals";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3002,
  },
  esbuild: {
    jsxInject: `import React from "react"`,
  },
  plugins: [
    reactRefresh(),
    commonJsExternals({
      externals: builtins,
    }),
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    "process.env.FLUENTFFMPEG_COV": '""',
  },
  optimizeDeps: {
    exclude: builtins,
  },
});
