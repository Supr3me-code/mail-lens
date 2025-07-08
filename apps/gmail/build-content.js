const esbuild = require("esbuild");
const cssModulesPlugin = require("esbuild-css-modules-plugin");
const svgrPlugin = require("esbuild-plugin-svgr");
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
    plugins: [cssModulesPlugin({ inject: true })],
    metafile: true,
  })
  .catch(() => process.exit(1));
