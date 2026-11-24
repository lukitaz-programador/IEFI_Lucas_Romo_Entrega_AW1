import { readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const files = [];
async function walk(dir) {
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const path = resolve(dir, item.name);
    if (item.isDirectory()) await walk(path);
    else if (path.endsWith('.js') || path.endsWith('.mjs')) files.push(path);
  }
}
await walk(resolve(root, 'site/assets/js'));
await walk(resolve(root, 'scripts'));
await walk(resolve(root, 'tests'));
let failures = 0;
for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) {
    failures++;
    console.error(`ERROR ${relative(root, file)}\n${result.stderr}`);
  }
}
if (failures) process.exitCode = 1;
else console.log(`Sintaxis verificada: ${files.length} archivos JavaScript.`);
