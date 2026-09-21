import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const distDir = path.join(projectRoot, "node_modules", "maplibre-gl", "dist");
const publicDir = path.join(projectRoot, "public");

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const filesToCopy = [
  { src: "maplibre-gl-worker.mjs", dest: ["maplibre-gl-worker.mjs", "maplibre-gl-worker.js"] },
  { src: "maplibre-gl-shared.mjs", dest: ["maplibre-gl-shared.mjs", "maplibre-gl-shared.js"] },
];

let copied = 0;

for (const item of filesToCopy) {
  const srcPath = path.join(distDir, item.src);
  if (fs.existsSync(srcPath)) {
    for (const destName of item.dest) {
      const destPath = path.join(publicDir, destName);
      fs.copyFileSync(srcPath, destPath);
      copied++;
    }
  } else {
    console.warn(`[copy-maplibre-worker] Warning: ${srcPath} not found.`);
  }
}

console.log(`[copy-maplibre-worker] Successfully copied ${copied} worker assets to public/`);
