import { execSync } from "child_process";
import { mkdirSync, cpSync } from "fs";
import { join } from "path";

const root = new URL(".", import.meta.url).pathname;
const siteDir = new URL("./site/", import.meta.url).pathname;
const libDir = new URL("./lib/", import.meta.url).pathname;
const outDist = join(root, "dist");

// optional - ensure root dist exists
mkdirSync(outDist, { recursive: true });

// run the per-package build scripts
console.log("Running lib build...");
execSync("npm run build", { cwd: libDir, stdio: "inherit" });

console.log("Running site build...");
execSync("npm run build", { cwd: siteDir, stdio: "inherit" });

cpSync(join(siteDir, "dist"), outDist, { recursive: true });

console.log("Done: Root index.html and main.js are ready.");