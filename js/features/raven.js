import { KIVAT_MESH_DATA, KIVAT_META } from './kivat-mesh-data.js?v=1.2';

const VERSION='raven-kivat-v1.8';
const DURATION=8.15;
let current=null;
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const smooth=t=>t*t*(3-2*t);
const easeOut=t=>1-Math.pow(1-t,3);
const easeIn=t=>t*t*t;

const CSS=`
:host{all:initial}*{box-sizing:border-box}.layer{position:fixed;inset:0;z-index:2147482000;overflow:hidden;isolation:isolate;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;color:#fff;touch-action:none}.backdrop{position:absolute;inset:0;background:radial-gradient(circle at 50% 52%,rgba(72,8,22,.32),rgba(4,3,7,.93) 58%,#020205 100%);opacity:0;animation:bgIn .48s ease forwards;backdrop-filter:brightness(.34) saturate(.6)}.backdrop:after{content:"";position:absolute;inset:0;background:radial-gradient(circle at 50% 50%,transparent 24%,rgba(0,0,0,.64) 92%)}canvas{position:absolute;inset:0;width:100%;height:100%;display:block;z-index:4}.avatar{position:absolute;z-index:3;border-radius:50%;overflow:hidden;box-shadow:0 0 0 1px #fff3,0 0 30px #d22a3a40;opacity:.95;transform-origin:center}.avatar img{display:block;width:100%;height:100%;object-fit:cover;background:#17151a}.avatar.bitten{animation:biteHit .34s cubic-bezier(.2,.8,.2,1)}.avatar:after{content:"";position:absolute;inset:-18%;border:2px solid transparent;border-radius:50%}.avatar.bitten:after{animation:biteRing .4s ease-out}.hud{position:absolute;z-index:20;top:max(14px,env(safe-area-inset-top));left:max(14px,env(safe-area-inset-left));right:max(14px,env(safe-area-inset-right));display:flex;justify-content:space-between;align-items:center;pointer-events:none}.hud b{font:800 10px/1.2 inherit;letter-spacing:.16em;color:#e6dadd;text-shadow:0 1px 12px #000}.hud button{pointer-events:auto;border:1px solid #fff3;background:#0b080bc4;color:#f7ecee;padding:9px 12px;border-radius:999px;font:700 10px/1 inherit;letter-spacing:.08em}.status{position:absolute;z-index:7;left:50%;bottom:max(18px,env(safe-area-inset-bottom));transform:translateX(-50%);font:700 9px/1.2 inherit;letter-spacing:.18em;color:#c0b2b5;white-space:nowrap;text-shadow:0 1px 10px #000}.impact{position:absolute;z-index:9;left:50%;top:50%;width:44vmin;aspect-ratio:1;border:2px solid #ff5266;border-radius:50%;box-shadow:0 0 90px #ed203cb0,inset 0 0 60px #ffe1ab24;opacity:0;transform:translate(-50%,-50%) scale(.18);pointer-events:none}.impact.go{animation:impact .34s ease-out}.flash{position:absolute;inset:0;z-index:11;background:#fff;opacity:0;mix-blend-mode:screen;pointer-events:none}.flash.go{animation:flash .24s ease-out}.chains{position:absolute;inset:0;z-index:13;pointer-events:none;opacity:0}.chains::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at center,rgba(14,8,10,.08),rgba(5,2,4,.42));opacity:0;transition:opacity .12s ease}.chains.lock{opacity:1}.chains.lock::before{opacity:1}.slot{position:absolute;left:50%;top:50%;width:132vmax;height:132vmax;transform:translate(-50%,-50%) rotate(var(--r));transform-origin:center}.slot img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;opacity:0;filter:drop-shadow(0 4px 5px #000) drop-shadow(0 0 10px #e52b3d3a);transform:translate(var(--ix),var(--iy)) scale(1.18)}.chains.lock .slot img{animation:rush .66s cubic-bezier(.12,.82,.18,1) var(--d) both}.chains.tight .slot{animation:tight .22s ease-in-out infinite alternate}.chains.break .slot img{animation:snap .44s cubic-bezier(.22,.75,.2,1) forwards!important}.slot:nth-child(1){--r:45deg;--ix:-118vw;--iy:-118vh;--bx:-92vw;--by:-92vh;--br:-12deg;--d:0s}.slot:nth-child(2){--r:45deg;--ix:-108vw;--iy:-108vh;--bx:-84vw;--by:-84vh;--br:-11deg;--d:.015s}.slot:nth-child(3){--r:45deg;--ix:-98vw;--iy:-98vh;--bx:-76vw;--by:-76vh;--br:-10deg;--d:.03s}.slot:nth-child(4){--r:45deg;--ix:-88vw;--iy:-88vh;--bx:-68vw;--by:-68vh;--br:-9deg;--d:.045s}.slot:nth-child(5){--r:45deg;--ix:-78vw;--iy:-78vh;--bx:-60vw;--by:-60vh;--br:-8deg;--d:.06s}.slot:nth-child(6){--r:45deg;--ix:-68vw;--iy:-68vh;--bx:-52vw;--by:-52vh;--br:-7deg;--d:.075s}.slot:nth-child(7){--r:45deg;--ix:-58vw;--iy:-58vh;--bx:-44vw;--by:-44vh;--br:-6deg;--d:.09s}.slot:nth-child(8){--r:45deg;--ix:-48vw;--iy:-48vh;--bx:-36vw;--by:-36vh;--br:-5deg;--d:.105s}.slot:nth-child(9){--r:45deg;--ix:-38vw;--iy:-38vh;--bx:-28vw;--by:-28vh;--br:-4deg;--d:.12s}.slot:nth-child(10){--r:45deg;--ix:-28vw;--iy:-28vh;--bx:-20vw;--by:-20vh;--br:-3deg;--d:.135s}.slot:nth-child(11){--r:45deg;--ix:-18vw;--iy:-18vh;--bx:-13vw;--by:-13vh;--br:-2deg;--d:.15s}.slot:nth-child(12){--r:45deg;--ix:-8vw;--iy:-8vh;--bx:-6vw;--by:-6vh;--br:-1deg;--d:.165s}.slot:nth-child(13){--r:45deg;--ix:2vw;--iy:2vh;--bx:1vw;--by:1vh;--br:1deg;--d:.18s}.slot:nth-child(14){--r:45deg;--ix:12vw;--iy:12vh;--bx:9vw;--by:9vh;--br:2deg;--d:.195s}.slot:nth-child(15){--r:45deg;--ix:22vw;--iy:22vh;--bx:17vw;--by:17vh;--br:3deg;--d:.21s}.slot:nth-child(16){--r:45deg;--ix:32vw;--iy:32vh;--bx:25vw;--by:25vh;--br:4deg;--d:.225s}.slot:nth-child(17){--r:-45deg;--ix:118vw;--iy:-118vh;--bx:92vw;--by:-92vh;--br:12deg;--d:.008s}.slot:nth-child(18){--r:-45deg;--ix:108vw;--iy:-108vh;--bx:84vw;--by:-84vh;--br:11deg;--d:.023s}.slot:nth-child(19){--r:-45deg;--ix:98vw;--iy:-98vh;--bx:76vw;--by:-76vh;--br:10deg;--d:.038s}.slot:nth-child(20){--r:-45deg;--ix:88vw;--iy:-88vh;--bx:68vw;--by:-68vh;--br:9deg;--d:.053s}.slot:nth-child(21){--r:-45deg;--ix:78vw;--iy:-78vh;--bx:60vw;--by:-60vh;--br:8deg;--d:.068s}.slot:nth-child(22){--r:-45deg;--ix:68vw;--iy:-68vh;--bx:52vw;--by:-52vh;--br:7deg;--d:.083s}.slot:nth-child(23){--r:-45deg;--ix:58vw;--iy:-58vh;--bx:44vw;--by:-44vh;--br:6deg;--d:.098s}.slot:nth-child(24){--r:-45deg;--ix:48vw;--iy:-48vh;--bx:36vw;--by:-36vh;--br:5deg;--d:.113s}.slot:nth-child(25){--r:-45deg;--ix:38vw;--iy:-38vh;--bx:28vw;--by:-28vh;--br:4deg;--d:.128s}.slot:nth-child(26){--r:-45deg;--ix:28vw;--iy:-28vh;--bx:20vw;--by:-20vh;--br:3deg;--d:.143s}.slot:nth-child(27){--r:-45deg;--ix:18vw;--iy:-18vh;--bx:13vw;--by:-13vh;--br:2deg;--d:.158s}.slot:nth-child(28){--r:-45deg;--ix:8vw;--iy:-8vh;--bx:6vw;--by:-6vh;--br:1deg;--d:.173s}.slot:nth-child(29){--r:-45deg;--ix:-2vw;--iy:2vh;--bx:-1vw;--by:1vh;--br:-1deg;--d:.188s}.slot:nth-child(30){--r:-45deg;--ix:-12vw;--iy:12vh;--bx:-9vw;--by:9vh;--br:-2deg;--d:.203s}.slot:nth-child(31){--r:-45deg;--ix:-22vw;--iy:22vh;--bx:-17vw;--by:17vh;--br:-3deg;--d:.218s}.slot:nth-child(32){--r:-45deg;--ix:-32vw;--iy:32vh;--bx:-25vw;--by:25vh;--br:-4deg;--d:.233s}.shards{position:absolute;inset:0;z-index:14;pointer-events:none}.shard{position:absolute;left:50%;top:50%;width:7px;height:16px;border-radius:3px;background:linear-gradient(#e2e2e2,#676767);opacity:0;box-shadow:0 0 5px #fff3;transform:translate(-50%,-50%) rotate(var(--r))}.shards.go .shard{animation:shard .5s cubic-bezier(.1,.74,.15,1) var(--d) forwards}.shard:nth-child(1){--x:-42vw;--y:-32vh;--r:48deg;--d:0s}.shard:nth-child(2){--x:39vw;--y:-30vh;--r:-51deg;--d:.02s}.shard:nth-child(3){--x:-47vw;--y:20vh;--r:95deg;--d:.04s}.shard:nth-child(4){--x:45vw;--y:24vh;--r:18deg;--d:.06s}.shard:nth-child(5){--x:-18vw;--y:-42vh;--r:120deg;--d:.08s}.shard:nth-child(6){--x:17vw;--y:43vh;--r:-102deg;--d:.1s}.shard:nth-child(7){--x:-32vw;--y:37vh;--r:66deg;--d:.04s}.shard:nth-child(8){--x:34vw;--y:-38vh;--r:-76deg;--d:.07s}.layer.exit{animation:out .42s ease forwards}@keyframes bgIn{to{opacity:1}}@keyframes biteHit{0%{transform:scale(1)}35%{transform:scale(.91) translateX(-2px);filter:brightness(1.35)}70%{transform:scale(1.04) translateX(2px)}100%{transform:scale(1)}}@keyframes biteRing{0%{border-color:#ff384f;transform:scale(.72);opacity:1}100%{border-color:#ff384f00;transform:scale(1.38);opacity:0}}@keyframes impact{0%{opacity:0;transform:translate(-50%,-50%) scale(.18)}20%{opacity:.96}100%{opacity:0;transform:translate(-50%,-50%) scale(1.35)}}@keyframes flash{0%{opacity:0}25%{opacity:.8}100%{opacity:0}}@keyframes rush{0%{opacity:0;transform:translate(var(--ix),var(--iy)) scale(1.2)}15%{opacity:1}100%{opacity:1;transform:translate(0,0) scale(1)}}@keyframes tight{from{transform:translate(-50%,-50%) rotate(var(--r)) scale(1)}to{transform:translate(-50%,-50%) rotate(var(--r)) scale(.965)}}@keyframes snap{0%{opacity:1;transform:translate(0,0) rotate(0) scale(1)}18%{filter:brightness(2.1) drop-shadow(0 0 14px #fff7)}100%{opacity:0;transform:translate(var(--bx),var(--by)) rotate(var(--br)) scale(.96)}}@keyframes shard{0%{opacity:0;transform:translate(-50%,-50%) rotate(var(--r)) scale(.6)}10%{opacity:1}100%{opacity:0;transform:translate(calc(-50% + var(--x)),calc(-50% + var(--y))) rotate(calc(var(--r) + 240deg)) scale(1.3)}}@keyframes out{to{opacity:0}}@media(max-width:720px){.hud b{font-size:9px}.status{font-size:8px;bottom:max(12px,env(safe-area-inset-bottom))}.slot{width:145vmax;height:145vmax}}
`;

function html(chain,src,rect){const size=Math.max(46,Math.min(92,rect.width||58)),left=Math.max(12,rect.left),top=Math.max(12,rect.top);return `<div class="layer"><div class="backdrop"></div><div class="avatar" style="left:${left}px;top:${top}px;width:${size}px;height:${size}px"><img src="${src}" alt=""></div><canvas></canvas><div class="impact"></div><div class="flash"></div><div class="chains">${Array.from({length:32},()=>`<span class="slot"><img src="${chain}" alt=""></span>`).join('')}</div><div class="shards">${Array.from({length:8},()=>'<i class="shard"></i>').join('')}</div><header class="hud"><b>RAVEN LIN // KIVAT EASTER EGG</b><button data-skip type="button">BỎ QUA ↗</button></header><div class="status">KIVAT BELT // ORIGINAL FBX GEOMETRY</div></div>`}

function decode(s,T){const b=atob(s),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return new T(u.buffer)}
function id(){const o=new Float32Array(16);o[0]=o[5]=o[10]=o[15]=1;return o}
function mul(a,b){const o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)o[c*4+r]=a[r]*b[c*4]+a[4+r]*b[c*4+1]+a[8+r]*b[c*4+2]+a[12+r]*b[c*4+3];return o}
function tr(x,y,z){const o=id();o[12]=x;o[13]=y;o[14]=z;return o}
function sc(x,y=x,z=x){const o=id();o[0]=x;o[5]=y;o[10]=z;return o}
function rx(a){const o=id(),c=Math.cos(a),s=Math.sin(a);o[5]=c;o[6]=s;o[9]=-s;o[10]=c;return o}
function ry(a){const o=id(),c=Math.cos(a),s=Math.sin(a);o[0]=c;o[2]=-s;o[8]=s;o[10]=c;return o}
function rz(a){const o=id(),c=Math.cos(a),s=Math.sin(a);o[0]=c;o[1]=s;o[4]=-s;o[5]=c;return o}
function ortho(l,r,b,t,n,f){const o=id();o[0]=2/(r-l);o[5]=2/(t-b);o[10]=-2/(f-n);o[12]=-(r+l)/(r-l);o[13]=-(t+b)/(t-b);o[14]=-(f+n)/(f-n);return o}
const comp=(...m)=>m.reduce((a,b)=>mul(a,b),id());
const m3=m=>new Float32Array([m[0],m[1],m[2],m[4],m[5],m[6],m[8],m[9],m[10]]);

class KivatRenderer{
 constructor(canvas){this.cv=canvas;this.gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:true});if(!this.gl)throw new Error('WebGL unavailable');this.mesh={};this.aspect=1;this.init();this.resize();this.ro=new ResizeObserver(()=>this.resize());this.ro.observe(canvas)}
 init(){const g=this.gl,vs=`attribute vec3 p;attribute vec3 n;attribute float k;uniform mat4 mvp;uniform mat3 nm;varying vec3 vn;varying float vk;void main(){gl_Position=mvp*vec4(p,1.);vn=normalize(nm*n);vk=k;}`,fs=`precision mediump float;varying vec3 vn;varying float vk;uniform vec3 pal[8];uniform float eye;uniform float alpha;vec3 C(float k){if(k<.5)return pal[0];if(k<1.5)return pal[1];if(k<2.5)return pal[2];if(k<3.5)return pal[3];if(k<4.5)return pal[4];if(k<5.5)return pal[5];if(k<6.5)return pal[6];return pal[7];}void main(){vec3 c=C(vk),L=normalize(vec3(-.34,.72,.62));float d=.34+.66*max(0.,dot(normalize(vn),L));if(vk>.5&&vk<1.5)c*=1.+eye*1.8;gl_FragColor=vec4(c*d,alpha);}`;const sh=(t,s)=>{const x=g.createShader(t);g.shaderSource(x,s);g.compileShader(x);if(!g.getShaderParameter(x,g.COMPILE_STATUS))throw new Error(g.getShaderInfoLog(x));return x};this.pr=g.createProgram();g.attachShader(this.pr,sh(g.VERTEX_SHADER,vs));g.attachShader(this.pr,sh(g.FRAGMENT_SHADER,fs));g.linkProgram(this.pr);g.useProgram(this.pr);this.A={p:g.getAttribLocation(this.pr,'p'),n:g.getAttribLocation(this.pr,'n'),k:g.getAttribLocation(this.pr,'k')};this.U={mvp:g.getUniformLocation(this.pr,'mvp'),nm:g.getUniformLocation(this.pr,'nm'),pal:g.getUniformLocation(this.pr,'pal[0]'),eye:g.getUniformLocation(this.pr,'eye'),alpha:g.getUniformLocation(this.pr,'alpha')};const pal=KIVAT_META.palette.flatMap(h=>[parseInt(h.slice(1,3),16)/255,parseInt(h.slice(3,5),16)/255,parseInt(h.slice(5,7),16)/255]);g.uniform3fv(this.U.pal,new Float32Array(pal));for(const [name,d] of Object.entries(KIVAT_MESH_DATA)){const m={count:d.count};for(const [key,a,size,type] of [['p',decode(d.p,Float32Array),3,g.FLOAT],['n',decode(d.n,Float32Array),3,g.FLOAT],['k',decode(d.k,Uint8Array),1,g.UNSIGNED_BYTE]]){const b=g.createBuffer();g.bindBuffer(g.ARRAY_BUFFER,b);g.bufferData(g.ARRAY_BUFFER,a,g.STATIC_DRAW);m[key]={b,size,type}}this.mesh[name]=m}g.enable(g.DEPTH_TEST);g.depthFunc(g.LEQUAL);g.enable(g.BLEND);g.blendFunc(g.SRC_ALPHA,g.ONE_MINUS_SRC_ALPHA);g.disable(g.CULL_FACE)}
 resize(){const r=this.cv.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);this.cv.width=Math.max(1,Math.round(r.width*d));this.cv.height=Math.max(1,Math.round(r.height*d));this.gl.viewport(0,0,this.cv.width,this.cv.height);this.aspect=r.width/Math.max(1,r.height);this.proj=ortho(-this.aspect,this.aspect,-1,1,-12,12)}
 screen(px,py){const r=this.cv.getBoundingClientRect();return[(px/r.width*2-1)*this.aspect,1-py/r.height*2]}
 drawMesh(name,M,alpha,eye){const g=this.gl,m=this.mesh[name];if(!m||alpha<.002)return;g.useProgram(this.pr);for(const a of ['p','n','k']){const q=m[a];g.bindBuffer(g.ARRAY_BUFFER,q.b);g.enableVertexAttribArray(this.A[a]);g.vertexAttribPointer(this.A[a],q.size,q.type,false,0,0)}g.uniformMatrix4fv(this.U.mvp,false,mul(this.proj,M));g.uniformMatrix3fv(this.U.nm,false,m3(M));g.uniform1f(this.U.eye,eye);g.uniform1f(this.U.alpha,alpha);g.drawArrays(g.TRIANGLES,0,m.count)}
 render(P){
  const g=this.gl;g.clearColor(0,0,0,0);g.clear(g.COLOR_BUFFER_BIT|g.DEPTH_BUFFER_BIT);
  const dc=KIVAT_META.driverCenter,kc=KIVAT_META.kivatCenter;
  if(P.driverAlpha){
    const R=comp(tr(P.driverX,P.driverY,.4),rz(P.driverRot||0),ry(P.driverYaw||0),sc(P.driverScale));
    this.drawMesh('driver',mul(R,tr(-dc[0],-dc[1],-dc[2])),P.driverAlpha,0)
  }
  if(!P.kivatAlpha)return;
  // Kivat is physically in front of the belt throughout the approach/docking shot.
  // Reset depth after drawing the Driver so the Kivat assembly cannot disappear behind it.
  g.clear(g.DEPTH_BUFFER_BIT);
  const C=tr(-kc[0],-kc[1],-kc[2]);
  const dp=KIVAT_META.dockPivot,pc=[dp[0]-kc[0],dp[1]-kc[1],dp[2]-kc[2]];
  // Reference clip: Kivat lands with its BACK toward the viewer, then hinges over the feet
  // around a horizontal left-right axis. It does NOT roll head-first in screen space.
  const H=P.dockPitch?comp(tr(pc[0],pc[1],pc[2]),rx(P.dockPitch),tr(-pc[0],-pc[1],-pc[2])):id();
  const R=comp(tr(P.kx,P.ky,0),rz(P.krot||0),ry(P.kyaw||0),rx(P.kpitch||0),sc(P.kscale),H);
  this.drawMesh('main',mul(R,C),P.kivatAlpha,P.eyeGlow||0);
  const mp=KIVAT_META.mouthPivot;
  const Mm=comp(C,tr(mp[0],mp[1],mp[2]),tr(0,-.08*(P.mouth||0),.02*(P.mouth||0)),rx(-.42*(P.mouth||0)),tr(-mp[0],-mp[1],-mp[2]));
  this.drawMesh('mouth',mul(R,Mm),P.kivatAlpha,P.eyeGlow||0);
  const l=KIVAT_META.wingPivotL,r=KIVAT_META.wingPivotR,a=P.flap||0;
  const WL=comp(C,tr(l[0],l[1],l[2]),rz(a),tr(-l[0],-l[1],-l[2]));
  const WR=comp(C,tr(r[0],r[1],r[2]),rz(-a),tr(-r[0],-r[1],-r[2]));
  // Entire left/right assemblies move together: root + connector + claw + full wing mesh.
  this.drawMesh('wingRootL',mul(R,WL),P.kivatAlpha,P.eyeGlow||0);
  this.drawMesh('wingL',mul(R,WL),P.kivatAlpha,P.eyeGlow||0);
  this.drawMesh('wingRootR',mul(R,WR),P.kivatAlpha,P.eyeGlow||0);
  this.drawMesh('wingR',mul(R,WR),P.kivatAlpha,P.eyeGlow||0)
 }
 dispose(){this.ro?.disconnect()}
}

function avatarInfo(trigger){const img=trigger?.querySelector?.('.artist-chip-avatar img')||trigger?.querySelector?.('img'),box=(img?.parentElement||trigger)?.getBoundingClientRect?.()||{left:innerWidth*.2,top:innerHeight*.35,width:58,height:58};return{src:img?.currentSrc||img?.src||'',rect:{left:box.left,top:box.top,width:box.width,height:box.height}}}
function pose(t,R,target){
  const a=R.aspect,mobile=innerWidth<720;
  const kS=Math.min(mobile?.145:.245,(2*a*(mobile?.76:.62))/4.82,1.28/2.46);
  // Keep the Driver visually substantial. Previous patch made the belt feel undersized
  // next to Kivat, especially on narrow screens.
  const dS=Math.min(mobile?.102:.155,(2*a*.92)/8.81,.84/2.10);
  const dX=0,dY=mobile?-.035:-.105,[ax,ay]=target;
  const pcY=KIVAT_META.dockPivot[1]-KIVAT_META.kivatCenter[1];
  // Contact is geometry-driven: use the actual top of the FBX Driver mesh instead
  // of a hand-tuned screen offset. A tiny inset removes any visible air gap.
  const db=KIVAT_MESH_DATA.driver?.bounds;
  const driverTopLocal=db ? (db.max[1]-KIVAT_META.driverCenter[1]) : 1.04244;
  const contactInset=mobile?.006:.008;
  const anchorY=dY+dS*driverTopLocal-contactInset;
  const uprightCenterY=anchorY-kS*pcY;
  let P={driverAlpha:0,driverX:dX,driverY:dY,driverScale:dS,driverRot:0,driverYaw:0,kivatAlpha:0,kx:a+.55,ky:.3,kscale:kS,krot:0,kyaw:0,kpitch:0,dockPitch:0,flap:0,mouth:0,eyeGlow:0};
  if(t>=.48){
    const u=clamp((t-.48)/.78);P.driverAlpha=easeOut(u);P.driverScale=dS*(.70+.30*easeOut(u));P.driverY=dY+.32*(1-easeOut(u));P.driverYaw=.45*(1-easeOut(u));
  }
  if(t<1.24)return P;
  P.kivatAlpha=1;
  const start=[a+.58,.24],bite=[ax+(mobile?.11:.15),ay-.02];
  if(t<2.48){
    const u=easeOut(clamp((t-1.24)/1.24));P.kx=lerp(start[0],bite[0],u);P.ky=lerp(start[1],bite[1],u)+Math.sin((t-1.24)*Math.PI*5)*.025;P.krot=lerp(-.24,.035,u);P.kyaw=lerp(-.55,.08,u);P.kscale=kS*(.78+.22*u);P.flap=Math.sin((t-1.24)*Math.PI*7.2)*.31;
  }else if(t<3.18){
    const u=(t-2.48)/.70;P.kx=bite[0]-.035*Math.sin(Math.PI*clamp(u));P.ky=bite[1]+.012*Math.sin(u*Math.PI*4);P.krot=.02;P.kyaw=.03;P.flap=Math.sin(t*Math.PI*3.5)*.10;P.mouth=u<.28?smooth(u/.28):u<.58?1-smooth((u-.28)/.30):0;
  }else if(t<4.42){
    // RETURN: while flying back, Kivat turns 180° around the vertical axis.
    // By the time it reaches the belt, its BACK is facing the viewer, matching the reference clip.
    const raw=clamp((t-3.18)/1.24),u=easeOut(raw),turn=smooth(clamp((raw-.16)/.70));
    P.kx=lerp(bite[0],dX,u);
    P.ky=lerp(bite[1],uprightCenterY+.11,u)+Math.sin((t-3.18)*Math.PI*4.8)*.016;
    P.krot=lerp(.05,0,u);
    P.kyaw=lerp(.12,Math.PI,turn);
    P.flap=Math.sin((t-3.18)*Math.PI*7.2)*.28*(1-.25*u);
  }else if(t<5.18){
    // LAND FIRST: back-facing, upright, feet settle onto the top perch.
    // No inversion happens during the approach itself.
    const u=smooth((t-4.42)/.76);
    P.kx=dX;P.ky=lerp(uprightCenterY+.10,uprightCenterY,u);
    P.krot=0;P.kyaw=Math.PI;P.kpitch=0;
    P.flap=Math.sin((t-4.42)*Math.PI*3)*.12*(1-u);
    P.kscale=kS*(1-.015*u);
  }else if(t<5.38){
    // Readable pause: Kivat is perched upright with its back toward us.
    P.kx=dX;P.ky=uprightCenterY;P.krot=0;P.kyaw=Math.PI;P.flap=0;
  }else if(t<6.16){
    // HINGE BACKWARD: feet stay planted on the perch while the whole body falls BACKWARD.
    // Use the negative X rotation path so Kivat arches its back away from the viewer/over the Driver,
    // then continues underneath into the final front-facing upside-down pose. Never somersault head-first forward.
    const u=clamp((t-5.38)/.78),q=smooth(u);
    P.kx=dX;P.ky=uprightCenterY;P.krot=0;P.kyaw=Math.PI;P.flap=0;
    P.dockPitch=-Math.PI*q;
    // Heavy-door resistance at the end, then a tiny latch rebound.
    if(u>.78)P.ky+=.007*Math.sin((u-.78)/.22*Math.PI);
  }else{
    P.kx=dX;P.ky=uprightCenterY;P.kyaw=Math.PI;P.dockPitch=-Math.PI;P.flap=0;
    const slam=clamp((t-6.16)/.12);P.ky+=.014*(1-slam);
    if(t>=6.16&&t<6.41){const f=(t-6.16)/.25;P.eyeGlow=Math.sin(Math.PI*clamp(f))*1.15;P.ky+=Math.sin((t-6.16)*Math.PI*44)*.004*(1-f)}
    if(t>=6.41)P.eyeGlow=.10;
  }
  return P
}

export function initRaven(){const chain=new URL('../../assets/easter/raven-chain.png',import.meta.url).href;const api={preload:()=>Promise.resolve(true),launch(trigger){api.stop('replaced');const info=avatarInfo(trigger),host=document.createElement('div');host.style.cssText='position:fixed;inset:0;z-index:2147482000;';const shadow=host.attachShadow({mode:'open'});shadow.innerHTML=`<style>${CSS}</style>${html(chain,info.src,info.rect)}`;document.body.append(host);const layer=shadow.querySelector('.layer'),canvas=shadow.querySelector('canvas'),av=shadow.querySelector('.avatar'),chains=shadow.querySelector('.chains'),shards=shadow.querySelector('.shards'),impact=shadow.querySelector('.impact'),flash=shadow.querySelector('.flash'),R=new KivatRenderer(canvas),prev=document.body.style.overflow;document.body.style.overflow='hidden';const center=[info.rect.left+info.rect.width/2,info.rect.top+info.rect.height/2],target=R.screen(...center),state={host,trigger,renderer:R,prev,raf:0};current=state;shadow.querySelector('[data-skip]')?.addEventListener('click',()=>api.stop('skipped'));let start=performance.now(),last='';const phase=t=>t<.48?'dark':t<1.24?'driver':t<2.48?'fly':t<3.18?'bite':t<4.42?'return':t<5.18?'land':t<5.38?'hold':t<6.16?'hinge':t<6.41?'flash':t<7.18?'chain':t<7.52?'tight':t<7.88?'break':'exit';const loop=now=>{if(current!==state)return;const t=(now-start)/1000,p=phase(t);if(p!==last){last=p;if(p==='bite')av.classList.add('bitten');if(p==='flash'){impact.classList.add('go');flash.classList.add('go')}if(p==='chain')chains.classList.add('lock');if(p==='tight')chains.classList.add('tight');if(p==='break'){chains.classList.add('break');shards.classList.add('go')}if(p==='exit')layer.classList.add('exit')}R.render(pose(t,R,target));if(t<DURATION)state.raf=requestAnimationFrame(loop);else api.stop('complete')};state.raf=requestAnimationFrame(loop);document.dispatchEvent(new CustomEvent('club:raven',{detail:{active:true,duration:DURATION,version:VERSION,renderer:'user-fbx-webgl'}}));return true},stop(reason='cancelled'){if(!current)return;const s=current;current=null;cancelAnimationFrame(s.raf);s.renderer?.dispose();try{s.host.remove()}catch{}document.body.style.overflow=s.prev||'';if(reason!=='complete'&&reason!=='hidden')s.trigger?.focus?.({preventScroll:true});document.dispatchEvent(new CustomEvent('club:raven',{detail:{active:false,reason,version:VERSION}}))},get state(){return{active:!!current,duration:DURATION,version:VERSION,renderer:'user-fbx-webgl',lastError:''}}};window.ClubRaven=api;if(!window.__kivatEscapeBound){window.__kivatEscapeBound=true;document.addEventListener('keydown',e=>{if(e.key==='Escape'&&current){e.preventDefault();api.stop('escape')}});document.addEventListener('visibilitychange',()=>{if(document.hidden)api.stop('hidden')});window.addEventListener('pagehide',()=>api.stop('hidden'))}return api}
