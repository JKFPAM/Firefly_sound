import { cp, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const AUDIO_EXTENSIONS = new Set([".wav", ".mp3", ".aif", ".aiff"]);

function toPosixPath(value) {
  return value.split(path.sep).join("/");
}

function toWebPath(relativePath) {
  return relativePath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

async function listFilesRecursive(rootDir) {
  const entries = await readdir(rootDir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      const nested = await listFilesRecursive(absolutePath);
      files.push(...nested);
      continue;
    }

    files.push(absolutePath);
  }

  return files;
}

function makeId(relativePath, index) {
  const base = relativePath
    .replace(/\.[^/.]+$/u, "")
    .replace(/[^a-zA-Z0-9]+/gu, "-")
    .replace(/^-+|-+$/gu, "")
    .toLowerCase();

  return `${base || "sound"}-${index}`;
}

async function main() {
  const workspaceRoot = process.cwd();
  const sourceRoot = path.join(workspaceRoot, "Selection_sounds_clean");
  const publicRoot = path.join(workspaceRoot, "public");
  const targetRoot = path.join(publicRoot, "sounds");
  const manifestPath = path.join(publicRoot, "sounds-manifest.json");

  await mkdir(publicRoot, { recursive: true });
  await rm(targetRoot, { recursive: true, force: true });
  await cp(sourceRoot, targetRoot, { recursive: true });

  const allFiles = await listFilesRecursive(targetRoot);
  const sounds = allFiles
    .map((absolutePath) => {
      const extension = path.extname(absolutePath).toLowerCase();
      if (!AUDIO_EXTENSIONS.has(extension)) {
        return null;
      }

      const relativeNative = path.relative(targetRoot, absolutePath);
      const relativePath = toPosixPath(relativeNative);
      const parts = relativePath.split("/");
      const filename = parts.at(-1) || "";
      const category = parts.length > 1 ? parts[0] : "uncategorized";

      return {
        relativePath,
        filename,
        category,
        label: filename.replace(/\.[^/.]+$/u, "").replace(/\s{2,}/gu, " ").trim(),
        file: filename,
        url: `/sounds/${toWebPath(relativePath)}`
      };
    })
    .filter((entry) => entry !== null)
    .sort((left, right) => {
      const categoryCompare = left.category.localeCompare(right.category);
      if (categoryCompare !== 0) {
        return categoryCompare;
      }
      return left.filename.localeCompare(right.filename);
    })
    .map((entry, index) => ({
      id: makeId(entry.relativePath, index),
      ...entry
    }));

  const categoryMap = new Map();
  for (const sound of sounds) {
    categoryMap.set(sound.category, (categoryMap.get(sound.category) || 0) + 1);
  }

  const categories = Array.from(categoryMap.entries()).map(([name, count]) => ({
    name,
    count
  }));

  const manifest = {
    generatedAt: new Date().toISOString(),
    source: "Selection_sounds_clean",
    soundCount: sounds.length,
    categories,
    sounds
  };

  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  console.log(`Synced ${sounds.length} sounds in ${categories.length} categories.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
