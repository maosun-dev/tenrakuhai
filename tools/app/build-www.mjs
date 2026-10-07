// Copies only the files the game needs into www/ for the iPhone app (Capacitor).
// The web version on GitHub Pages keeps using the repository root as-is.
//
// App-only additions (the web version never loads these):
//   - js/vendor/capacitor.js and js/vendor/admob.js (the AdMob plugin's browser side)
//   - js/ads-config.js: whether to use real ads. Real ads only when ADS_PRODUCTION=1
//     (set by the store build); otherwise Google's test ads. The store build also hides
//     the secret title-tile modes (see main.js).
//   - js/vendor/preferences.js and js/app-save.js: keeps the records in the app's own
//     storage too, and loads main.js after restoring them.
//   - js/gamecenter.js: the world ranking (Game Center, see ios/App/App/GameCenter.swift).
// Usage: npm run build            (test ads)
//        ADS_PRODUCTION=1 npm run build   (real ads)
import { copyFileSync, cpSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const out = join(root, 'www');
const include = ['index.html', 'css', 'js', 'assets'];

rmSync(out, { recursive: true, force: true });
mkdirSync(out);
for (const p of include) cpSync(join(root, p), join(out, p), { recursive: true });

const production = process.env.ADS_PRODUCTION === '1';
copyFileSync(join(root, 'node_modules/@capacitor/core/dist/capacitor.js'), join(out, 'js/vendor/capacitor.js'));
copyFileSync(join(root, 'node_modules/@capacitor-community/admob/dist/plugin.js'), join(out, 'js/vendor/admob.js'));
copyFileSync(join(root, 'node_modules/@capacitor/preferences/dist/plugin.js'), join(out, 'js/vendor/preferences.js'));
writeFileSync(join(out, 'js/ads-config.js'), `window.ADS_CONFIG = ${JSON.stringify({ production })};\n`);

const indexPath = join(out, 'index.html');
let html = readFileSync(indexPath, 'utf8');
const replaceTag = (marker, to) => {
  if (!html.includes(marker)) throw new Error(`index.html: ${marker} not found`);
  html = html.replace(marker, to);
};
replaceTag('<script src="js/ads.js"></script>',
  '<script src="js/vendor/capacitor.js"></script>\n<script src="js/vendor/admob.js"></script>\n<script src="js/vendor/preferences.js"></script>\n<script src="js/ads-config.js"></script>\n<script src="js/ads.js"></script>\n<script src="js/gamecenter.js"></script>');
replaceTag('<script src="js/main.js"></script>', '<script src="js/app-save.js"></script>');
writeFileSync(indexPath, html);

let bytes = 0, files = 0;
for (const e of readdirSync(out, { recursive: true, withFileTypes: true })) {
  if (e.isFile()) { bytes += statSync(join(e.parentPath, e.name)).size; files++; }
}
console.log(`www/: ${files} files, ${(bytes / 1024 / 1024).toFixed(1)} MB, ads: ${production ? 'REAL' : 'test'}`);
