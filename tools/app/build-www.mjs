// Copies only the files the game needs into www/ for the iPhone app (Capacitor).
// The web version on GitHub Pages keeps using the repository root as-is.
// Usage: npm run build
import { cpSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const out = join(root, 'www');
const include = ['index.html', 'css', 'js', 'assets'];

rmSync(out, { recursive: true, force: true });
mkdirSync(out);
for (const p of include) cpSync(join(root, p), join(out, p), { recursive: true });

let bytes = 0, files = 0;
for (const e of readdirSync(out, { recursive: true, withFileTypes: true })) {
  if (e.isFile()) { bytes += statSync(join(e.parentPath, e.name)).size; files++; }
}
console.log(`www/: ${files} files, ${(bytes / 1024 / 1024).toFixed(1)} MB`);
