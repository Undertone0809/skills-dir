import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: {
      entry: {
        index: "src/index.ts"
      }
    },
    clean: true,
    sourcemap: true,
    splitting: false,
    outDir: "dist",
    target: "node18"
  },
  {
    entry: ["src/cli.ts"],
    format: ["esm"],
    clean: false,
    sourcemap: true,
    splitting: false,
    outDir: "dist",
    target: "node18",
    banner: {
      js: "#!/usr/bin/env node"
    }
  }
]);
