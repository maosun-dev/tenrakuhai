// 言語の切り替え。日本語は HTML・main.js にそのまま書き、ここには英語の訳だけを持つ。
// 決め方：保存した選択 → なければ端末の言語（日本語以外は英語）。切り替えたら読み込み直す。
(function(){
  const KEY='tenraku-lang';
  let lang=null;
  try{lang=localStorage.getItem(KEY);}catch(e){}
  if(lang!=='ja'&&lang!=='en')lang=/^ja\b/i.test(navigator.language||'')?'ja':'en';

  // 訳語の表（キー → 英語）。HTML 側は data-i18n="キー"（中身）／data-i18n-aria="キー"（読み上げ名）
  const EN={
    // タイトル画面
    'title':'Dropjong',
    'catch':'Stack, match,<br>don’t drop.',
    'kana':'DROPJONG',
    'loading':'Loading…',
    'play':'Play',
    'endless':'∞ Endless<small>Keeps going after the wall runs out</small>',
    'endlessLocked':'Endless<small>Clear a game to unlock</small>',
    'endlessHint':'Finish a game to unlock this mode',
    'how':'How to play',
    'rank':'Ranking',
    'col':'Hand collection',
    'mb':'Music box',
    'best':'Best {n} pts',
    'bestEndless':'Endless {n} pts',
    'lang':'Language',
    // 上の帯
    'pts':'pts',
    'wall':'Wall',
    'quitAria':'Pause game',
    'musicAria':'Music on/off',
    'muteAria':'Sound effects on/off',
    // 下の枠
    'canWin':'Ready to win!',
    'oneAway':'One away!',
    'waitAny':'Stack any of these to win',
    'waitOne':'Stack this to win',
    'onTable':'On the table',
    'tilesN':'{n} tiles',
    'tileN':'{n} tile',
    'from14':'You can win from 14 tiles',
    'tsumoBtn':'Tsumo! Claim {n} pts',
    'which':'Which one<br>to stack?',
    'ptsUp':'More pts',
    'wins':'Wins!',
    'nPts':'{n} pts',
    'finish':'Finish the run',
    'dragHint':'Drag to move, let go to drop',
    'rotate':'⟲ Rotate',
    'layFlat':'↓ Lay flat',
    'standUp':'↑ Stand up',
    'settle':'Waiting for the tiles to settle…',
    // はじめての案内
    'coachPick':'First, tap one of the two tiles to pick it',
    'coachAim':'Drag to choose where it lands. The pink square shows the spot. Let go to drop',
    'coachStack':'Keep stacking! When the tiles on the table form a hand, you can win',
    'coachTenpai':'One away! Stack a tile shown above to win',
    'coachTsumo':'You made a hand! Press “Tsumo!” to score. The tiles you used disappear',
    // 知らせ
    'refill':'Wall refilled!',
    'lapN':'Lap {n}',
    'heartUp':'Heart +1',
    'heartDown':'Heart −1',
    'towerRec':'New tower record!',
    'handMade':'Hand complete!',
    'outHearts':'Out of hearts',
    'revived':'Heart restored!',
    'fell':'It fell…',
    'skyAurora':'Into the aurora!',
    'skyStar':'Stardust night!',
    'skyDusk':'Back to dusk!',
    'passedN':'{n} pts reached',
    'mbUnlocked':'Music box unlocked!',
    'mbFromTitle':'Listen from the title screen',
    'mbLocked':'Unlocks when you pass 36,000 pts',
    'runDone':'Run complete!',
    'runBonus':'Finish bonus +8,000 pts',
    'gcSignIn':'Sign in to Game Center to see this',
    'gcWhere':'Settings app → Game Center',
    // 和了画面
    'tsumo':'Tsumo!',
    'new':'NEW',
    'hanN':'{n} han',
    'yakuman':'Yakuman',
    'yakumanN':'{n}× Yakuman',
    'kazoe':'Counted Yakuman',
    'sanbaiman':'Sanbaiman',
    'baiman':'Baiman',
    'haneman':'Haneman',
    'mangan':'Mangan',
    'ptsSmall':'pts',
    'clearGo':'Clear tiles and continue',
    // おしまい
    'over':'Game over',
    'again':'Play again',
    'toTitle':'Back to title',
    'reviveText':'Watch a video ad to get 1 heart back<br>and keep playing (once per game)',
    'reviveYes':'▶︎ Watch and continue',
    'reviveNo':'No thanks, see results',
    'allUsed':'You used up the whole wall (finish bonus 8,000 pts)',
    'endlessOpen':'  ∞ Endless mode unlocked!',
    'leftHand':' (includes the {n} pts hand left on the table)',
    'quitMid':'You quit partway',
    'stScore':'Score <b>{n}</b> pts',
    'stBest':'New best!',
    'stWins':'Wins <b>{n}</b>',
    'stStreak':'Best win streak <b>{n}</b>',
    'stTower':'Tallest tower <b>{n}</b> cm',
    'stHand':'Best hand <b>{n}</b>',
    'tsumoOnly':'Tsumo only',
    'stRec':'Personal best {n} pts',
    'stPlace':'Ranking <b>#{n}</b>!',
    'stDebug':'Yakuman mode, so this isn’t recorded',
    // やめる・カスタム
    'quitQ':'Quit the game?',
    'rest':'Take a break',
    'quitGame':'Quit game',
    'quit':'Quit',
    'keepOn':'Keep playing',
    'quitNote':'Your score so far goes into the ranking',
    'quitNoteDbg':'Yakuman mode, so nothing is recorded',
    'bg':'Background<small>(Auto switches to Stardust at 12,000 pts, Aurora at 36,000, then every 12,000 pts)</small>',
    'song':'Music<small>(Auto switches at 12,000 and 36,000 pts, then every 12,000 pts)</small>',
    'auto':'Auto',
    'dusk':'Dusk',
    'stardust':'Stardust',
    'aurora':'Aurora',
    // あそびかた
    'how1':'Pick one of the two tiles and drop it from above to stack it.',
    'how2':'Drag to aim, then let go to drop. The pink square shows where it lands.',
    'how3':'When the tiles on the table form a hand, press “Tsumo!” to score. The tiles you used disappear.',
    'how4':'If a tile falls off the table you lose a heart. The game ends when all 3 are gone or the wall runs out.',
    'close':'Close',
    'credits':'Some sound effects: free assets from “Pachinko GARO Archive” (Sansei R&amp;D Co., Ltd.)<br>CR GARO GOLDSTORM Sho: Garo hold sound (red), P.F.O.G. appearance sound, GARO sword success sound',
    // ランキング
    'normal':'Normal',
    'endlessTab':'∞ Endless',
    'score':'Score',
    'height':'Height',
    'streak':'Streak',
    'date':'Date',
    'noRec':'No records yet. Go play a round!',
    'rankNote':'Records are saved in this browser on this device',
    'rankNoteApp':'This list shows records on this device',
    'gc':'World ranking (Game Center)',
    // 役コレクション
    'colHint':'Tap a hand to see how to make it, with example tiles',
    'notYet':'Not yet',
    'timesN':'<b>{n}</b>×',
    'colProg':'{a} / {b} hands  ·  {t} wins in total',
    // ミュージックボックス
    'stream':'Now on Apple Music and Spotify!',
    'amAlbum':'Open the album “Dropjong” on Apple Music',
    'scene0':'Title · 0–11,999 pts',
    'scene1':'12,000–35,999 pts',
    'scene2':'36,000 pts and up',
    'playT':'Play {t}',
    'stopT':'Stop {t}',
    'amT':'Listen to {t} on Apple Music',
    'skip':'Tap to skip',
    // 隠しモード（テスト用）
    'dbgBadge':'Yakuman mode!',
    'dbgBadge2':'Double yakuman mode!',
    'dbgBoom':'Explosion test mode'
  };

  // 役の名前（ローマ字・英語の言い換え）と作り方。キーはゲーム内部で使う日本語の役名
  const YAKU={
    '門前清自摸和':['Menzen Tsumo','Self-draw','Win with tiles you stacked yourself. In this game it always applies'],
    '断么九':['Tanyao','All Simples','Use only tiles 2–8, with no 1s, 9s or honor tiles'],
    '平和':['Pinfu','All Sequences','All four sets are runs and the pair isn’t a value tile. Only when the last tile finishes a two-sided wait'],
    '一盃口':['Iipeikou','Pure Double Run','Make the same run twice (e.g. 2-3-4 Man two times)'],
    '役牌 白':['Haku','White Dragon','Three White Dragons'],
    '役牌 發':['Hatsu','Green Dragon','Three Green Dragons'],
    '役牌 中':['Chun','Red Dragon','Three Red Dragons'],
    '役牌 東':['Ton','East Wind','Three East Winds'],
    '三色同順':['Sanshoku','Mixed Triple Run','The same run in Man, Pin and Sou (e.g. 3-4-5 in all three suits)'],
    '一気通貫':['Ittsu','Pure Straight','1-2-3, 4-5-6 and 7-8-9 in one suit'],
    '三暗刻':['San Ankou','Three Triplets','Make three sets of three identical tiles'],
    '小三元':['Shousangen','Little Three Dragons','Triplets of two dragons, and the third dragon as the pair'],
    '七対子':['Chiitoitsu','Seven Pairs','Make seven pairs (a special shape)'],
    '混老頭':['Honroutou','All Terminals & Honors','Use only 1s, 9s and honor tiles'],
    '混全帯么九':['Chanta','Outside Hand','Every set and the pair includes a 1, 9 or honor tile (with honors)'],
    '混一色':['Honitsu','Half Flush','Use one suit plus honor tiles only'],
    '純全帯么九':['Junchan','Pure Outside Hand','Every set and the pair includes a 1 or 9 (no honors)'],
    '二盃口':['Ryanpeikou','Twice Pure Double Run','Make Iipeikou twice'],
    '清一色':['Chinitsu','Full Flush','Use one suit only, with no honor tiles'],
    '大三元':['Daisangen','Big Three Dragons','Triplets of White, Green and Red Dragons'],
    '四暗刻':['Suuankou','Four Triplets','Make four sets of three identical tiles'],
    '字一色':['Tsuuiisou','All Honors','Use honor tiles only'],
    '国士無双':['Kokushi Musou','Thirteen Orphans','One each of the 13 kinds of 1s, 9s and honors, plus one more of any of them'],
    '緑一色':['Ryuuiisou','All Green','Use only 2, 3, 4, 6, 8 Sou and Green Dragons (the all-green tiles)'],
    '清老頭':['Chinroutou','All Terminals','Use only 1s and 9s'],
    '小四喜':['Shousuushii','Little Four Winds','Triplets of three winds, and the fourth wind as the pair'],
    '大四喜':['Daisuushii','Big Four Winds','Triplets of all four winds'],
    '九蓮宝燈':['Chuuren Poutou','Nine Gates','In one suit: 1-1-1-2-3-4-5-6-7-8-9-9-9 plus any one more'],
    '数え役満':['Kazoe Yakuman','Counted Yakuman','When your han add up to 13 or more, it counts as yakuman']
  };
  // 役の表示名（英語ならローマ字）、英語の言い換え（日本語では空）、作り方
  const YN=n=>lang==='en'&&YAKU[n]?YAKU[n][0]:n;
  const YE=n=>lang==='en'&&YAKU[n]?YAKU[n][1]:'';
  const YD=(n,ja)=>lang==='en'&&YAKU[n]?YAKU[n][2]:ja;
  // 牌の名前（英語は 3 Man / 5 Pin / 7 Sou / East …）
  const HON_EN=['East','South','West','North','White','Green','Red'];
  const TILE=(k,ja)=>lang!=='en'?ja:k<27?(k%9+1)+' '+['Man','Pin','Sou'][Math.floor(k/9)]:HON_EN[k-27];

  const T=(ja,key,vars)=>{
    let s=lang==='en'&&EN[key]!=null?EN[key]:ja;
    if(vars)for(const k in vars)s=s.split('{'+k+'}').join(vars[k]);
    return s;
  };

  function apply(){
    document.documentElement.lang=lang;
    document.querySelectorAll('.langbtn').forEach(b=>b.classList.toggle('en',lang==='en'));
    if(lang!=='en')return;
    document.title=EN.title;
    document.querySelectorAll('[data-i18n]').forEach(el=>{const v=EN[el.dataset.i18n];if(v!=null)el.innerHTML=v;});
    document.querySelectorAll('[data-i18n-alt]').forEach(el=>{const v=EN[el.dataset.i18nAlt];if(v!=null)el.setAttribute('alt',v);});
    document.querySelectorAll('[data-i18n-aria]').forEach(el=>{const v=EN[el.dataset.i18nAria];if(v!=null)el.setAttribute('aria-label',v);});
  }

  function setLang(l){
    if(l===lang)return;
    try{localStorage.setItem(KEY,l);}catch(e){}
    location.reload();
  }

  window.I18N={lang,T,setLang,YN,YE,YD,TILE};
  window.T=T;
  apply();
})();
