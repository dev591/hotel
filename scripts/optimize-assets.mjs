// Converts raw Poly Haven glTFs (assets-src/models) into compact meshopt + WebP .glb files in public/m.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const SRC = path.join(ROOT, "assets-src", "models");
const OUT = path.join(ROOT, "public", "m");

const TREES = new Set(["jacaranda_tree", "island_tree_01"]);
// Keep separate leaf nodes so doors/gates can swing on hinges.
const HINGED = new Set(["large_iron_gate", "large_castle_door"]);

fs.mkdirSync(OUT, { recursive: true });

for (const id of fs.readdirSync(SRC)) {
  const input = path.join(SRC, id, `${id}.gltf`);
  const output = path.join(OUT, `${id}.glb`);
  if (!fs.existsSync(input) || fs.existsSync(output)) continue;

  const args = [
    "@gltf-transform/cli", "optimize", input, output,
    "--compress", "meshopt",
    "--texture-compress", "webp",
    "--texture-size", "1024",
  ];
  if (TREES.has(id)) args.push("--simplify-ratio", "0.04", "--simplify-error", "0.02");
  if (HINGED.has(id)) args.push("--flatten", "false", "--join", "false");

  console.log(`optimizing ${id}...`);
  execFileSync("npx", args, { stdio: ["ignore", "ignore", "inherit"] });
  console.log(`  ${(fs.statSync(output).size / 1048576).toFixed(2)}MB`);
}
