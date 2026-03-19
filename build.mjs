import { execSync } from "child_process";
import { copyFileSync, mkdirSync } from "fs";
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

// copy built site files to root (adjust filenames if different)
copyFileSync(join(siteDir, "dist", "index.html"), join(root, "index.html"));
copyFileSync(join(siteDir, "dist", "main.js"), join(root, "main.js"));

console.log("Done: Root index.html and main.js are ready.");