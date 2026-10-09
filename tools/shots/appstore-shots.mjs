// App Store 用のスクショ（6.9インチ 1320×2868）を Web 版から撮る。
// パソコンの Chrome を画面なしで動かし、iPhone の大きさで表示して場面ごとに保存する。
// 使い方：先に手元のサーバーを動かしておく（例：python -m http.server 8770 --bind 127.0.0.1）
//   node tools/shots/appstore-shots.mjs [出力フォルダ] [URL]
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const OUT = process.argv[2] || 'shots-out';
const URL = process.argv[3] || 'http://127.0.0.1:8770/';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9333;
// 既定は 6.3インチ（1206×2622）。SIZE=6.9 で 1320×2868
const [W, H] = process.env.SIZE === "6.9" ? [440, 956] : [402, 874], DPR = 3;
const sleep = ms => new Promise(r => setTimeout(r, ms));
mkdirSync(OUT, { recursive: true });

const prof = join(tmpdir(), 'tenrakuhai-shots-profile');
rmSync(prof, { recursive: true, force: true });
const chrome = spawn(CHROME, [
  '--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${prof}`,
  '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio', '--no-first-run',
  '--hide-scrollbars', 'about:blank',
], { stdio: 'ignore' });

let ws, id = 0; const pend = {};
async function connect() {
  for (let i = 0; i < 50; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json();
      const page = list.find(t => t.type === 'page');
      if (page) { ws = new WebSocket(page.webSocketDebuggerUrl); break; }
    } catch (e) {}
    await sleep(200);
  }
  await new Promise(r => ws.addEventListener('open', r));
  ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; } });
}
const send = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async expr => {
  const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
  if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || 'eval error');
  return r.result?.result?.value;
};
const shot = async name => {
  await ev(`document.fonts.ready.then(()=>Promise.all([...document.fonts].filter(f=>f.status!=='loaded').map(f=>f.load().catch(()=>0)))).then(()=>1)`);
  await sleep(400);
  const r = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync(join(OUT, name + '.png'), Buffer.from(r.result.data, 'base64'));
  console.log('saved', name);
};
const waitFor = async (expr, ms = 15000) => { const t = Date.now(); while (Date.now() - t < ms) { if (await ev(expr)) return true; await sleep(150); } return false; };
const mouse = (type, x, y) => send('Input.dispatchMouseEvent', { type, x, y, button: 'left', buttons: type === 'mouseReleased' ? 0 : 1, clickCount: 1, pointerType: 'mouse' });
async function load(setup) {
  await send('Page.navigate', { url: URL });
  await sleep(800);
  await ev(`localStorage.clear();${setup || ''};'ok'`);
  await send('Page.reload', { ignoreCache: true });
  await waitFor(`!!document.getElementById('startBtn') && !document.getElementById('startBtn').disabled`, 20000);
  await sleep(1200);
}
// 案内の吹き出しは出さない（スクショ用）
const NO_COACH = `localStorage.setItem('tenraku-coach',JSON.stringify({pick:1,aim:1,stack:1,tenpai:1,tsumo:1}))`;
// 1枚選んで、台の上の (dx, dy) のあたりに落とす
async function dropOne(dx = 0, dy = 0, pickIndex = 0) {
  if (!await waitFor(`!!document.querySelector('#ctrl .pick')`, 45000)) return false;
  await ev(`document.querySelectorAll('#ctrl .pick')[${pickIndex}]?.click()`);
  await sleep(350);
  const cx = W / 2, cy = H * 0.42;
  await mouse('mousePressed', cx, cy); await sleep(60);
  for (let i = 1; i <= 6; i++) { await mouse('mouseMoved', cx + dx * i / 6, cy + dy * i / 6); await sleep(40); }
  await sleep(250);
  await mouse('mouseReleased', cx + dx, cy + dy);
  return true;
}

await connect();
await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: DPR, mobile: true });

// 1. タイトル
if (!process.env.SCENE || process.env.SCENE.split(',').includes('title')) {
await load(`localStorage.setItem('ponpon-pai-best','48200');localStorage.setItem('tenraku-endless','1');localStorage.setItem('tenraku-musicbox','1')`);
await sleep(2500);
await shot('1-title');
}

// 2. 積み上げているところ（ハートが減らず、知らせも出ていないときに撮る。うまくいくまで数回やり直す）
const ONLY = process.env.SCENE || '';
const want = n => !ONLY || ONLY.split(',').includes(n);
if (want('stack')) {
  for (let attempt = 1; attempt <= 5; attempt++) {
    await load(NO_COACH);
    await ev(`document.getElementById('startBtn').click()`);
    const spots = [[0, 0], [-14, 0], [14, 0], [0, 6], [-8, -4], [8, 4], [0, 0], [-12, 4], [12, -4], [0, 0]];
    for (const [dx, dy] of spots) { await dropOne(dx, dy); await sleep(400); }
    await waitFor(`!!document.querySelector('#ctrl .pick')`, 12000);
    await waitFor(`document.getElementById('toast').innerHTML===''`, 6000);
    await sleep(500);
    const full = await ev(`document.querySelectorAll('#hearts use[href="#i-heart-empty"]').length===0`);
    const n = await ev(`document.querySelectorAll('#hand .t').length`);
    console.log('stack attempt', attempt, 'hearts full', full, 'tiles', n);
    await waitFor(`!!document.querySelector('#ctrl .pick') && document.getElementById('toast').innerHTML===''`, 45000);
    if (full && n >= 8) { await shot('2-stack'); break; }
  }
}

// 3. あと1枚（役満モードは最初から大三元の一歩手前。バッジは隠す）
if (want('tenpai')) {
await load(NO_COACH);
await ev(`(()=>{const ht=k=>document.querySelector('#startOv .ht.'+k);for(let i=0;i<5;i++)for(const k of['a','b','c'])ht(k).click();})()`);
await sleep(300);
await ev(`document.getElementById('startBtn').click()`);
await waitFor(`!!document.querySelector('#ctrl .pick')`);
await ev(`document.getElementById('dbgBadge').style.display='none'`);
await sleep(1500);
await shot('3-tenpai');

// 4. 役満の演出 → 5. 和了の画面
await dropOne(0, 0, 0);
await waitFor(`!!document.getElementById('bTsumo')`, 15000);
await sleep(400);
await ev(`document.getElementById('bTsumo').click()`);
await sleep(2300);
await shot('4-yakuman');
await waitFor(`document.getElementById('winOv').classList.contains('show')`, 15000);
await sleep(4200);
await shot('5-win');
}

// 6. 役コレクション（いくつか作った状態で、三色同順の作り方を開く）
if (want('collection')) {
const col = { '門前清自摸和': 42, '断么九': 18, '平和': 11, '一盃口': 4, '役牌 白': 6, '役牌 中': 5, '三色同順': 2, '七対子': 3, '混一色': 2, '大三元': 1 };
await load(`localStorage.setItem('tenraku-yaku',JSON.stringify(${JSON.stringify(col)}))`);
await ev(`document.getElementById('colBtn').click()`);
await sleep(600);
await ev(`document.querySelector('#colList .ci[data-n="三色同順"]').click()`);
await sleep(900);
await ev(`document.getElementById('colOv').scrollTop=0`);
await sleep(300);
await shot('6-collection');
}

ws.close(); chrome.kill();
console.log('done');
