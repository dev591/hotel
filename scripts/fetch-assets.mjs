// Downloads CC0 assets from Poly Haven into /public so the site never depends on external hosts at runtime.
// Usage: node scripts/fetch-assets.mjs [--dry]
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const PUBLIC = path.join(ROOT, "public");
const DRY = process.argv.includes("--dry");

export const MODELS = [
  // exterior
  "large_iron_gate",
  "large_castle_door",
  "street_lamp_01",
  "jacaranda_tree",
  "island_tree_01",
  "wild_rooibos_bush",
  "planter_box_01",
  "horse_statue_01",
  "Lantern_01",
  // lobby
  "Chandelier_01",
  "ClassicConsole_01",
  "Sofa_01",
  "ArmChair_01",
  "coffee_table_round_01",
  "ornate_mirror_01",
  "fancy_picture_frame_01",
  "potted_plant_02",
  "potted_plant_04",
  "brass_vase_01",
  // rooms
  "GothicBed_01",
  "ClassicNightstand_01",
  "Chandelier_03",
  "sofa_02",
  "modern_arm_chair_01",
  "dining_table",
  "Ottoman_01",
  "fancy_picture_frame_02",
];

export const TEXTURES = [
  "marble_tiles",
  "white_sandstone_bricks",
  "cobblestone_floor_01",
  "grass_ground",
  "white_plaster_02",
  "herringbone_parquet",
];

export const HDRIS = [
  { id: "belfast_sunset_puresky", res: "2k" },
  { id: "gothic_manor_01", res: "1k" },
];

async function api(id) {
  const res = await fetch(`https://api.polyhaven.com/files/${id}`);
  if (!res.ok) throw new Error(`api ${id}: ${res.status}`);
  return res.json();
}

async function download(url, dest) {
  try {
    await fs.access(dest);
    return;
  } catch {}
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download ${url}: ${res.status}`);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, Buffer.from(await res.arrayBuffer()));
}

const mb = (n) => (n / 1024 / 1024).toFixed(1) + "MB";

async function main() {
  let total = 0;

  for (const id of MODELS) {
    const files = await api(id);
    const entry = files.gltf?.["1k"]?.gltf;
    if (!entry) {
      console.warn(`skip ${id}: no 1k gltf`);
      continue;
    }
    const size =
      entry.size +
      Object.values(entry.include ?? {}).reduce((s, f) => s + f.size, 0);
    total += size;
    console.log(`model ${id.padEnd(26)} ${mb(size)}`);
    if (DRY) continue;
    const dir = path.join(ROOT, "assets-src", "models", id);
    await download(entry.url, path.join(dir, `${id}.gltf`));
    for (const [rel, f] of Object.entries(entry.include ?? {})) {
      await download(f.url, path.join(dir, rel));
    }
  }

  for (const id of TEXTURES) {
    const files = await api(id);
    const maps = {
      diff: files.Diffuse?.["1k"]?.jpg,
      nor: files.nor_gl?.["1k"]?.jpg,
      arm: files.arm?.["1k"]?.jpg,
    };
    const size = Object.values(maps).reduce((s, f) => s + (f?.size ?? 0), 0);
    total += size;
    console.log(`texture ${id.padEnd(24)} ${mb(size)}`);
    if (DRY) continue;
    for (const [name, f] of Object.entries(maps)) {
      if (f) await download(f.url, path.join(PUBLIC, "textures", id, `${name}.jpg`));
    }
  }

  for (const { id, res } of HDRIS) {
    const files = await api(id);
    const f = files.hdri?.[res]?.hdr;
    total += f.size;
    console.log(`hdri ${id.padEnd(27)} ${mb(f.size)}`);
    if (DRY) continue;
    await download(f.url, path.join(PUBLIC, "hdri", `${id}.hdr`));
  }

  console.log(`TOTAL ${mb(total)}${DRY ? " (dry run)" : ""}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
