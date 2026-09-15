const VERSION = 'raven-kivat-easter-v0.1';
const DUR = 8250;

const asset = name => new URL(`../../assets/easter/${name}`, import.meta.url).href;
const ASSETS = {
  body: asset('kivat-body.png'),
  wingL: asset('kivat-wing-left.png'),
  wingR: asset('kivat-wing-right.png'),
  full: asset('kivat-full.png'),
  belt: asset('kiva-belt.png'),
  chain: asset('raven-chain.png')
};

const CSS = `
:host{all:initial}
*{box-sizing:border-box}
.layer{position:fixed;inset:0;z-index:2147483000;overflow:hidden;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;color:#f8ede6;isolation:isolate;touch-action:none}
.dim{position:absolute;inset:0;background:radial-gradient(circle at 50% 48%,rgba(44,8,13,.52),rgba(2,2,5,.94) 62%,#000 100%);opacity:0;backdrop-filter:blur(1.2px);transition:opacity .5s ease}
.layer.run .dim{opacity:1}
.grain{position:absolute;inset:-20%;opacity:.13;mix-blend-mode:screen;background-image:radial-gradient(circle,#fff 0 1px,transparent 1px);background-size:18px 18px;transform:rotate(12deg);pointer-events:none}
.stage{position:absolute;inset:0;overflow:hidden}
.hud{position:absolute;z-index:30;top:max(14px,env(safe-area-inset-top));right:max(14px,env(safe-area-inset-right));display:flex;gap:8px}
.skip{border:1px solid #d8b6b944;background:#120a0dcc;color:#e8dadd;padding:8px 11px;border-radius:999px;font:700 9px/1 system-ui;letter-spacing:.12em;cursor:pointer}
.scene{position:absolute;left:50%;top:50%;width:min(92vw,1100px);height:min(76vh,720px);transform:translate(-50%,-50%);pointer-events:none}
.driver{position:absolute;left:50%;top:57%;width:min(72vw,760px);transform:translate(-50%,-44%) translateY(45px) scale(.9);opacity:0;filter:drop-shadow(0 28px 28px #000c) drop-shadow(0 0 22px #7b151933);will-change:transform,opacity}
.driver img{display:block;width:100%;height:auto}
.driver::after{content:"";position:absolute;left:50%;top:47%;width:24%;aspect-ratio:1;border-radius:50%;transform:translate(-50%,-50%);background:radial-gradient(circle,#bd17264f,transparent 66%);opacity:0}
.avatar{position:absolute;left:18%;top:45%;width:clamp(78px,10vw,126px);aspect-ratio:1;border-radius:50%;overflow:hidden;border:2px solid #d7b4b788;box-shadow:0 0 0 8px #16090eb5,0 18px 38px #000b,0 0 34px #a7162755;opacity:0;transform:translate(-50%,-50%) scale(.82);background:#171218;will-change:transform,opacity}
.avatar img{width:100%;height:100%;object-fit:cover;display:block}
.avatar::after{content:"";position:absolute;inset:-25%;border:1px solid #d921386e;border-radius:50%;animation:avatarPulse 1.2s ease-in-out infinite}
@keyframes avatarPulse{0%,100%{transform:scale(.8);opacity:.15}50%{transform:scale(1.05);opacity:.75}}
.kivat{position:absolute;left:0;top:0;width:clamp(260px,32vw,430px);aspect-ratio:1200/760;transform-origin:50% 50%;opacity:0;will-change:transform,opacity;filter:drop-shadow(0 22px 20px #000c) drop-shadow(0 0 12px #94121f33)}
.flight,.docked{position:absolute;inset:0}
.flight img,.docked img{position:absolute;display:block;user-select:none;-webkit-user-drag:none}
.body{left:20.833%;top:11.97%;width:58.333%;height:76.05%;object-fit:fill;z-index:4}
.wingL{left:2.916%;top:21.05%;width:31.25%;height:59.34%;transform-origin:96% 36%;z-index:2;will-change:transform}
.wingR{left:65.833%;top:21.05%;width:31.333%;height:59.34%;transform-origin:4% 36%;z-index:2;will-change:transform}
.docked{opacity:0}
.docked>img{inset:0;width:100%;height:100%;object-fit:contain}
.eyeGlow{position:absolute;inset:0;opacity:0;mix-blend-mode:screen;z-index:8;background:
 radial-gradient(circle at 40.4% 52.2%,#fff 0 1.8%,#ff2237 4.2%,#ff132e88 9%,transparent 16%),
 radial-gradient(circle at 59.3% 52.2%,#fff 0 1.8%,#ff2237 4.2%,#ff132e88 9%,transparent 16%);filter:blur(.2px) drop-shadow(0 0 17px #ff122f)}
.biteFlash{position:absolute;width:120px;aspect-ratio:1;border-radius:50%;opacity:0;background:radial-gradient(circle,#fff 0 5%,#e31e35 13%,#e31e354d 28%,transparent 68%);mix-blend-mode:screen;filter:drop-shadow(0 0 15px #d81529)}
.impact{position:absolute;left:50%;top:57%;width:100px;aspect-ratio:1;transform:translate(-50%,-50%);border:2px solid #e23243;border-radius:50%;opacity:0;box-shadow:0 0 45px #e2324377}
.chainLayer{position:absolute;inset:0;z-index:20;opacity:0;pointer-events:none;will-change:transform,opacity}
.chain{position:absolute;left:50%;top:50%;width:145vmax;max-width:none;height:auto;transform-origin:center;filter:drop-shadow(0 5px 5px #000d) contrast(1.08);opacity:0;will-change:transform,opacity}
.chain.c1{--r:0deg;--sx:-37vw;--sy:-28vh;--bx:-24vw;--by:-18vh}
.chain.c2{--r:90deg;--sx:38vw;--sy:-30vh;--bx:26vw;--by:-18vh}
.chain.c3{--r:45deg;--sx:-42vw;--sy:28vh;--bx:-27vw;--by:19vh}
.chain.c4{--r:-45deg;--sx:42vw;--sy:27vh;--bx:27vw;--by:18vh}
.chain.c5{--r:18deg;--sx:0vw;--sy:-54vh;--bx:-8vw;--by:-31vh}
.chain.c6{--r:-18deg;--sx:0vw;--sy:55vh;--bx:8vw;--by:31vh}
.chain.lock{animation:chainLock .8s cubic-bezier(.12,.82,.14,1) both}
@keyframes chainLock{0%{opacity:0;transform:translate(calc(-50% + var(--sx)),calc(-50% + var(--sy))) rotate(var(--r)) scale(1.35)}25%{opacity:.95}72%{opacity:1;transform:translate(-50%,-50%) rotate(var(--r)) scale(.94)}100%{opacity:1;transform:translate(-50%,-50%) rotate(var(--r)) scale(.82)}}
.chain.break{animation:chainBreak .52s cubic-bezier(.2,.7,.3,1) both}
@keyframes chainBreak{0%{opacity:1;transform:translate(-50%,-50%) rotate(var(--r)) scale(.82)}20%{transform:translate(-50%,-50%) rotate(calc(var(--r) + 2deg)) scale(.78)}100%{opacity:0;transform:translate(calc(-50% + var(--bx)),calc(-50% + var(--by))) rotate(calc(var(--r) + 17deg)) scale(1.08)}}
.crack{position:absolute;left:50%;top:50%;width:min(88vw,720px);aspect-ratio:1;transform:translate(-50%,-50%) scale(.2);opacity:0;background:conic-gradient(from 7deg at 50% 50%,transparent 0 11deg,#fff 12deg 12.5deg,transparent 13deg 47deg,#fff 48deg 48.7deg,transparent 49deg 91deg,#fff 92deg 92.6deg,transparent 93deg 128deg,#fff 129deg 129.5deg,transparent 130deg 360deg);mix-blend-mode:screen;filter:drop-shadow(0 0 8px #fff) drop-shadow(0 0 18px #da1b31)}
.flash{position:absolute;inset:0;background:#fff;opacity:0;mix-blend-mode:screen;z-index:25;pointer-events:none}
.label{position:absolute;left:50%;bottom:max(28px,calc(env(safe-area-inset-bottom) + 18px));transform:translateX(-50%);font:700 10px/1 system-ui;letter-spacing:.2em;color:#cfb9bd;opacity:0;white-space:nowrap;text-shadow:0 2px 8px #000}
@media(max-width:700px){
 .scene{top:52%;width:100vw;height:68vh}
 .driver{top:58%;width:min(90vw,560px)}
 .avatar{left:20%;top:42%;width:82px}
 .kivat{width:min(74vw,350px)}
 .label{font-size:8px;bottom:max(20px,calc(env(safe-area-inset-bottom) + 12px))}
}
`;

let current = null;
let timers = [];
let anims = [];
const later = (fn, ms) => { const id = setTimeout(fn, ms); timers.push(id); return id; };
const animate = (el, frames, options) => { const a = el.animate(frames, options); anims.push(a); return a; };

function clearAll(){
  timers.forEach(clearTimeout); timers=[];
  anims.forEach(a=>{ try{a.cancel()}catch{} }); anims=[];
}

function stop(reason='cancelled'){
  if(!current) return;
  clearAll();
  const {host, trigger, prevOverflow} = current;
  current = null;
  try{host.remove()}catch{}
  document.body.style.overflow = prevOverflow;
  if(reason !== 'hidden' && reason !== 'complete') trigger?.focus?.({preventScroll:true});
  document.dispatchEvent(new CustomEvent('club:raven',{detail:{active:false,reason,version:VERSION}}));
}

function buildAvatarSource(trigger){
  const preferred = document.querySelector('.artist-chip[data-artist="raven-lin"] .artist-chip-avatar img');
  const img = preferred || trigger?.querySelector?.('img');
  return img?.currentSrc || img?.src || asset('../raven/final.webp');
}

function shell(avatarSrc){
  const chains = Array.from({length:6},(_,i)=>`<img class="chain c${i+1}" src="${ASSETS.chain}" alt="">`).join('');
  return `<div class="layer" role="dialog" aria-modal="true" aria-label="Raven Lin Kivat Easter egg">
    <div class="dim"></div><div class="grain"></div><div class="stage">
      <div class="scene">
        <div class="driver"><img src="${ASSETS.belt}" alt=""><i></i></div>
        <div class="avatar"><img src="${avatarSrc}" alt=""></div>
        <div class="kivat">
          <div class="flight"><img class="wingL" src="${ASSETS.wingL}" alt=""><img class="wingR" src="${ASSETS.wingR}" alt=""><img class="body" src="${ASSETS.body}" alt=""></div>
          <div class="docked"><img src="${ASSETS.full}" alt=""><div class="eyeGlow"></div></div>
        </div>
        <div class="biteFlash"></div><div class="impact"></div>
      </div>
      <div class="chainLayer">${chains}<div class="crack"></div></div>
      <div class="flash"></div><div class="label">RAVEN LIN // SECRET TRANSFORMATION</div>
    </div>
    <div class="hud"><button class="skip" type="button">BỎ QUA ↗</button></div>
  </div>`;
}

function play(el){
  const scene = el.querySelector('.scene');
  const driver = el.querySelector('.driver');
  const avatar = el.querySelector('.avatar');
  const kivat = el.querySelector('.kivat');
  const flight = el.querySelector('.flight');
  const docked = el.querySelector('.docked');
  const wingL = el.querySelector('.wingL');
  const wingR = el.querySelector('.wingR');
  const eyes = el.querySelector('.eyeGlow');
  const biteFlash = el.querySelector('.biteFlash');
  const impact = el.querySelector('.impact');
  const chainLayer = el.querySelector('.chainLayer');
  const chains = [...el.querySelectorAll('.chain')];
  const crack = el.querySelector('.crack');
  const flash = el.querySelector('.flash');
  const label = el.querySelector('.label');

  const sr = scene.getBoundingClientRect();
  const ar = avatar.getBoundingClientRect();
  const dr = driver.getBoundingClientRect();
  const kv = kivat.getBoundingClientRect();
  const rootW = kv.width, rootH = kv.height;
  const biteX = (ar.left + ar.width/2) - sr.left - rootW/2;
  const biteY = (ar.top + ar.height/2) - sr.top - rootH*.54;
  const dockX = (dr.left + dr.width/2) - sr.left - rootW/2;
  const dockY = (dr.top + dr.height*.46) - sr.top - rootH*.52;
  const startX = sr.width + rootW*.25;
  const startY = sr.height*.18;

  animate(driver,[
    {opacity:0,transform:'translate(-50%,-44%) translateY(45px) scale(.9)'},
    {opacity:1,transform:'translate(-50%,-44%) translateY(0) scale(1)'}
  ],{duration:700,delay:420,fill:'forwards',easing:'cubic-bezier(.16,.85,.2,1)'});
  animate(avatar,[{opacity:0,transform:'translate(-50%,-50%) scale(.82)'},{opacity:1,transform:'translate(-50%,-50%) scale(1)'}],{duration:450,delay:620,fill:'forwards',easing:'ease-out'});
  animate(label,[{opacity:0},{opacity:.72},{opacity:0}],{duration:1700,delay:500,fill:'forwards'});

  const flapL = animate(wingL,[
    {transform:'rotate(8deg) translateY(1%)'},
    {transform:'rotate(-17deg) translateY(-5%)'},
    {transform:'rotate(8deg) translateY(1%)'}
  ],{duration:260,iterations:Infinity,easing:'ease-in-out'});
  const flapR = animate(wingR,[
    {transform:'rotate(-8deg) translateY(1%)'},
    {transform:'rotate(17deg) translateY(-5%)'},
    {transform:'rotate(-8deg) translateY(1%)'}
  ],{duration:260,iterations:Infinity,easing:'ease-in-out'});

  kivat.style.opacity='1';
  animate(kivat,[
    {opacity:0,transform:`translate(${startX}px,${startY}px) rotate(-10deg) scale(.68)`},
    {opacity:1,offset:.16,transform:`translate(${sr.width*.72}px,${sr.height*.12}px) rotate(-4deg) scale(.72)`},
    {offset:.56,transform:`translate(${biteX + rootW*.16}px,${biteY - rootH*.14}px) rotate(5deg) scale(.72)`},
    {transform:`translate(${biteX}px,${biteY}px) rotate(-2deg) scale(.78)`}
  ],{duration:1450,delay:1150,fill:'forwards',easing:'cubic-bezier(.2,.72,.18,1)'});

  later(()=>{
    animate(kivat,[
      {transform:`translate(${biteX}px,${biteY}px) rotate(-2deg) scale(.78)`},
      {offset:.35,transform:`translate(${biteX-rootW*.045}px,${biteY+rootH*.035}px) rotate(2deg) scale(.81)`},
      {transform:`translate(${biteX}px,${biteY}px) rotate(-2deg) scale(.78)`}
    ],{duration:600,fill:'forwards',easing:'cubic-bezier(.2,.9,.25,1)'});
    const x=ar.left+ar.width/2, y=ar.top+ar.height/2;
    biteFlash.style.left=`${x-60}px`; biteFlash.style.top=`${y-60}px`;
    animate(biteFlash,[{opacity:0,transform:'scale(.25)'},{opacity:1,offset:.28,transform:'scale(.85)'},{opacity:0,transform:'scale(1.45)'}],{duration:480,fill:'forwards'});
    animate(avatar,[
      {transform:'translate(-50%,-50%) rotate(0)'},
      {transform:'translate(calc(-50% - 6px),-50%) rotate(-4deg)'},
      {transform:'translate(calc(-50% + 6px),-50%) rotate(4deg)'},
      {transform:'translate(-50%,-50%) rotate(0)'}
    ],{duration:360,fill:'forwards'});
  },2580);

  later(()=>{
    animate(kivat,[
      {transform:`translate(${biteX}px,${biteY}px) rotate(-2deg) scale(.78)`},
      {offset:.32,transform:`translate(${sr.width*.52}px,${sr.height*.24}px) rotate(10deg) scale(.76)`},
      {offset:.72,transform:`translate(${dockX}px,${dockY-rootH*.2}px) rotate(2deg) scale(.76)`},
      {transform:`translate(${dockX}px,${dockY}px) rotate(0deg) scale(.78)`}
    ],{duration:1500,fill:'forwards',easing:'cubic-bezier(.16,.72,.16,1)'});
  },3200);

  later(()=>{
    flapL.cancel(); flapR.cancel();
    wingL.style.transform='rotate(0deg)'; wingR.style.transform='rotate(0deg)';
    animate(flight,[{opacity:1},{opacity:0}],{duration:130,fill:'forwards'});
    animate(docked,[{opacity:0},{opacity:1}],{duration:130,fill:'forwards'});
    animate(kivat,[
      {transform:`translate(${dockX}px,${dockY}px) rotate(0deg) scale(.78)`},
      {offset:.70,transform:`translate(${dockX}px,${dockY+rootH*.08}px) rotate(166deg) scale(.79)`},
      {offset:.90,transform:`translate(${dockX}px,${dockY+rootH*.11}px) rotate(184deg) scale(.80)`},
      {transform:`translate(${dockX}px,${dockY+rootH*.10}px) rotate(180deg) scale(.80)`}
    ],{duration:1050,fill:'forwards',easing:'cubic-bezier(.16,.68,.18,1)'});
  },4720);

  later(()=>{
    animate(driver,[
      {transform:'translate(-50%,-44%) scale(1)'},
      {transform:'translate(-50%,-43%) scale(.992)'},
      {transform:'translate(-50%,-44%) scale(1)'}
    ],{duration:220,fill:'forwards'});
    animate(impact,[{opacity:.95,transform:'translate(-50%,-50%) scale(.2)'},{opacity:0,transform:'translate(-50%,-50%) scale(3.8)'}],{duration:430,fill:'forwards'});
  },5670);

  later(()=>{
    animate(eyes,[{opacity:0},{opacity:1,offset:.2},{opacity:1,offset:.48},{opacity:0}],{duration:430,fill:'forwards'});
    animate(flash,[{opacity:0},{opacity:.72,offset:.2},{opacity:0}],{duration:300,fill:'forwards'});
  },5920);

  later(()=>{
    chainLayer.style.opacity='1';
    chains.forEach((c,i)=>later(()=>c.classList.add('lock'),i*38));
  },6110);

  later(()=>{
    animate(scene,[
      {transform:'translate(0,0)'},{transform:'translate(-4px,2px)'},{transform:'translate(5px,-2px)'},{transform:'translate(-2px,1px)'},{transform:'translate(0,0)'}
    ],{duration:220,fill:'forwards'});
  },6810);

  later(()=>{
    animate(crack,[{opacity:0,transform:'translate(-50%,-50%) scale(.2)'},{opacity:1,offset:.3,transform:'translate(-50%,-50%) scale(.9)'},{opacity:0,transform:'translate(-50%,-50%) scale(1.15)'}],{duration:440,fill:'forwards'});
    chains.forEach(c=>{c.classList.remove('lock');c.classList.add('break')});
    animate(flash,[{opacity:0},{opacity:.9,offset:.13},{opacity:0}],{duration:330,fill:'forwards'});
  },7140);

  later(()=>{
    animate(el,[{opacity:1},{opacity:0}],{duration:600,fill:'forwards',easing:'ease-in'});
  },7550);
}

async function preload(){
  const urls=Object.values(ASSETS);
  await Promise.all(urls.map(src=>new Promise(resolve=>{const im=new Image();im.onload=im.onerror=resolve;im.src=src})));
  return true;
}

async function launch(trigger,{explicit=false}={}){
  stop('replaced');
  await preload();
  const host=document.createElement('div');
  host.dataset.ravenKivat='';
  host.style.cssText='position:fixed;inset:0;z-index:2147483000;display:block;';
  const shadow=host.attachShadow({mode:'open'});
  const avatarSrc=buildAvatarSource(trigger);
  shadow.innerHTML=`<style>${CSS}</style>${shell(avatarSrc)}`;
  document.body.append(host);
  const el=shadow.querySelector('.layer');
  const prevOverflow=document.body.style.overflow;
  current={host,shadow,el,trigger,prevOverflow};
  document.body.style.overflow='hidden';
  shadow.querySelector('.skip')?.addEventListener('click',()=>stop('skipped'));
  requestAnimationFrame(()=>requestAnimationFrame(()=>{ if(!current||current.host!==host)return; el.classList.add('run'); play(el); }));
  later(()=>stop('complete'),DUR);
  document.dispatchEvent(new CustomEvent('club:raven',{detail:{active:true,duration:DUR,version:VERSION,renderer:'kivat-sprite-easter'}}));
  return true;
}

export function initRaven(){
  const api={launch,stop,preload,get state(){return{active:!!current,duration:DUR,version:VERSION,renderer:'kivat-sprite-easter',lastError:''}}};
  window.ClubRaven=api;
  if(!window.__ravenKivatKeybound){
    window.__ravenKivatKeybound=true;
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&current){e.preventDefault();stop('escape')}});
    document.addEventListener('visibilitychange',()=>{if(document.hidden&&current)stop('hidden')});
    window.addEventListener('pagehide',()=>{if(current)stop('hidden')});
  }
  return api;
}
