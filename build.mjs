import { execSync } from "child_process";
import { mkdirSync, cpSync } from "fs";
import { join } from "path";
import esbuild from "esbuild";

const root = new URL(".", import.meta.url).pathname;
const siteDir = new URL("./site/", import.meta.url).pathname;
const libDir = new URL("./lib/", import.meta.url).pathname;
const outDist = join(root, "dist");

mkdirSync(outDist, { recursive: true });

console.log("Running lib build...");
execSync("npm run build", { cwd: libDir, stdio: "inherit" });

console.log("Running site build...");
execSync("npm run build", { cwd: siteDir, stdio: "inherit" });

cpSync(join(siteDir, "dist"), outDist, { recursive: true });

console.log("Bundling worker...");
await esbuild.build({
  entryPoints: [join(siteDir, "src/worker.ts")],
  bundle: true,
  format: "esm",
  outfile: join(root, "_worker.js"),
  alias: { "lib": join(libDir, "src/index.ts") },
  platform: "browser",
  minify: true,
});

console.log("Done: dist/ is ready to deploy.");