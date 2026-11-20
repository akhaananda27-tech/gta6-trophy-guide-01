// main.ts: hand the Leonida Trophy Guide in.
// Copies app/ and screenshots/ from beside this file into the output
// directory (MAKEFUN_OUTPUT_DIR when set, else /output), then writes
// /output/dossier.json with buildDossier from vendor/makefun-frontend.ts.
// Node 22, standard library only. Runs twice; both runs write the same bytes.
// NOTE: never remove the output directory itself — the grader mounts it
// (as /output) and its owner cannot rmdir a mount point (EPERM). Clear
// only its contents instead.
import { cpSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';

function clearDir(dir) {
  mkdirSync(dir, { recursive: true });
  for (const entry of readdirSync(dir)) {
    rmSync(join(dir, entry), { recursive: true, force: true });
  }
}

function copyTree(name) {
  cpSync(join(repoRoot, name), join(outDir, name), { recursive: true });
}

function main() {
  clearDir(outDir);
  copyTree('app');
  copyTree('screenshots');
  const dossier = buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  });
  // buildDossier returns the dossier bytes (a Uint8Array) or a string:
  // write them as-is, never through JSON.stringify (that would inflate bytes).
  writeFileSync(join(outDir, 'dossier.json'), dossier);
  const bytes = typeof dossier === 'string' ? Buffer.byteLength(dossier) : dossier.length;
  console.log(`Wrote ${outDir}/dossier.json (${bytes} bytes) from app/ and screenshots/.`);
}

main();
