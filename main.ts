// main.ts: hand the Leonida Trophy Guide in.
// Copies app/ and screenshots/ from beside this file into the output
// directory (MAKEFUN_OUTPUT_DIR when set, else /output), then writes
// /output/dossier.json with buildDossier from vendor/makefun-frontend.ts.
// Node 22, standard library only. Runs twice; both runs write the same bytes.
import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';

function copyTree(name) {
  cpSync(join(repoRoot, name), join(outDir, name), { recursive: true });
}

function main() {
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
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
