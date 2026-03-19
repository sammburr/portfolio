import esbuild from "esbuild";
import { cpSync } from "fs";

cpSync("src/index.html", "dist/index.html");

await esbuild.build({
  entryPoints: ["src/main.ts"],
  bundle: true,
  format: "iife",
  outfile: "dist/main.js",
  alias: {
    "lib": "../lib/src/index.ts",
  },
});