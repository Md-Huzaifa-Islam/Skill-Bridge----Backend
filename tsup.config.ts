import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/app.ts"],
  format: ["esm"],
  outDir: "api",
  outExtension: () => ({ js: ".mjs" }),
  clean: true,
  dts: false,
  splitting: false,
  sourcemap: false,
  minify: false,
  bundle: true,
  skipNodeModulesBundle: true,
  target: "node18",
  platform: "node",
  noExternal: [],
  esbuildOptions(options) {
    options.banner = {
      js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`,
    };
  },
});
