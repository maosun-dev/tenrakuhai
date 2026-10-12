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
    'muteAria':'Sound effects on/off'
  };

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
    document.querySelectorAll('[data-i18n-aria]').forEach(el=>{const v=EN[el.dataset.i18nAria];if(v!=null)el.setAttribute('aria-label',v);});
  }

  function setLang(l){
    if(l===lang)return;
    try{localStorage.setItem(KEY,l);}catch(e){}
    location.reload();
  }

  window.I18N={lang,T,setLang};
  window.T=T;
  apply();
})();
