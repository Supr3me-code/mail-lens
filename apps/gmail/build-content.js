const esbuild = require("esbuild");
const cssModulesPlugin = require("esbuild-css-modules-plugin");
const path = require("path");

esbuild
  .build({
    entryPoints: ["apps/gmail/src/content-script.tsx"],
    bundle: true,
    outfile: "apps/gmail/dist/content-script.js",
    platform: "browser",
    target: "esnext",
    format: "iife",
    absWorkingDir: path.resolve(__dirname, "..", ".."),
    plugins: [cssModulesPlugin({ inject: true })], // <-- this is critical
    metafile: true,
  })
  .catch(() => process.exit(1));
