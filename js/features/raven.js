import { KIVAT_MESH_DATA, KIVAT_META } from './kivat-mesh-data.js?v=1.2';

const VERSION='raven-kivat-v2.1';
const DURATION=8.55;
let current=null;
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const smooth=t=>t*t*(3-2*t);
const easeOut=t=>1-Math.pow(1-t,3);
const easeIn=t=>t*t*t;
const smoother=t=>t*t*t*(t*(t*6-15)+10);
const easeInOutCubic=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const bez3=(p0,p1,p2,p3,t)=>{const u=1-t,uu=u*u,tt=t*t;return [uu*u*p0[0]+3*uu*t*p1[0]+3*u*tt*p2[0]+tt*t*p3[0],uu*u*p0[1]+3*uu*t*p1[1]+3*u*tt*p2[1]+tt*t*p3[1]]};
const flapWave=(time,hz,amp)=>{const s=Math.sin(time*Math.PI*2*hz);return Math.sign(s)*Math.pow(Math.abs(s),.72)*amp};

const CSS=`
:host{all:initial}*{box-sizing:border-box}.layer{position:fixed;inset:0;z-index:2147482000;overflow:hidden;isolation:isolate;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;color:#fff;touch-action:none}.backdrop{position:absolute;inset:0;background:radial-gradient(circle at 50% 52%,rgba(72,8,22,.32),rgba(4,3,7,.93) 58%,#020205 100%);opacity:0;animation:bgIn .48s ease forwards;backdrop-filter:brightness(.34) saturate(.6)}.backdrop:after{content:"";position:absolute;inset:0;background:radial-gradient(circle at 50% 50%,transparent 24%,rgba(0,0,0,.64) 92%)}canvas{position:absolute;inset:0;width:100%;height:100%;display:block;z-index:4}.avatar{position:absolute;z-index:3;border-radius:50%;overflow:hidden;box-shadow:0 0 0 1px #fff3,0 0 30px #d22a3a40;opacity:.95;transform-origin:center}.avatar img{display:block;width:100%;height:100%;object-fit:cover;background:#17151a}.avatar.bitten{animation:biteHit .34s cubic-bezier(.2,.8,.2,1)}.avatar:after{content:"";position:absolute;inset:-18%;border:2px solid transparent;border-radius:50%}.avatar.bitten:after{animation:biteRing .4s ease-out}.hud{position:absolute;z-index:20;top:max(14px,env(safe-area-inset-top));left:max(14px,env(safe-area-inset-left));right:max(14px,env(safe-area-inset-right));display:flex;justify-content:space-between;align-items:center;pointer-events:none}.hud b{font:800 10px/1.2 inherit;letter-spacing:.16em;color:#e6dadd;text-shadow:0 1px 12px #000}.hud button{pointer-events:auto;border:1px solid #fff3;background:#0b080bc4;color:#f7ecee;padding:9px 12px;border-radius:999px;font:700 10px/1 inherit;letter-spacing:.08em}.status{position:absolute;z-index:7;left:50%;bottom:max(18px,env(safe-area-inset-bottom));transform:translateX(-50%);font:700 9px/1.2 inherit;letter-spacing:.18em;color:#c0b2b5;white-space:nowrap;text-shadow:0 1px 10px #000}.impact{position:absolute;z-index:9;left:50%;top:50%;width:44vmin;aspect-ratio:1;border:2px solid #ff5266;border-radius:50%;box-shadow:0 0 90px #ed203cb0,inset 0 0 60px #ffe1ab24;opacity:0;transform:translate(-50%,-50%) scale(.18);pointer-events:none}.impact.go{animation:impact .34s ease-out}.flash{position:absolute;inset:0;z-index:11;background:#fff;opacity:0;mix-blend-mode:screen;pointer-events:none}.flash.go{animation:flash .24s ease-out}.chains{position:absolute;inset:0;z-index:13;pointer-events:none;opacity:0;overflow:hidden;transform-origin:center}.chains::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 50% 50%,rgba(7,3,6,.04),rgba(2,1,3,.26));opacity:0;transition:opacity .14s ease}.chains.lock{opacity:1}.chains.lock::before{opacity:1}.slot{position:absolute;left:50%;top:50%;width:136vmax;height:136vmax;transform:translate(-50%,-50%);transform-origin:center}.slot img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;opacity:0;will-change:transform,opacity;transform:translate(calc(var(--fx) + var(--sx)),calc(var(--fy) + var(--sy))) scaleX(var(--flip)) scale(1.035)}.chains.lock .slot img{animation:rushGrid .72s cubic-bezier(.16,.78,.2,1) var(--d) both}.chains.tight{animation:chainSqueeze .22s cubic-bezier(.45,0,.2,1) 0s 2 alternate}.chains.break .slot img{animation:snapGrid .42s cubic-bezier(.22,.72,.18,1) forwards!important}.slot:nth-child(1){--flip:1;--fx:-72vmin;--fy:-72vmin;--sx:-64vw;--sy:64vh;--bx:-24vw;--by:24vh;--br:-8deg;--d:0s}.slot:nth-child(2){--flip:1;--fx:-43vmin;--fy:-43vmin;--sx:-64vw;--sy:64vh;--bx:-20vw;--by:20vh;--br:-6deg;--d:.035s}.slot:nth-child(3){--flip:1;--fx:-14vmin;--fy:-14vmin;--sx:-64vw;--sy:64vh;--bx:-17vw;--by:17vh;--br:-5deg;--d:.07s}.slot:nth-child(4){--flip:1;--fx:15vmin;--fy:15vmin;--sx:-64vw;--sy:64vh;--bx:-15vw;--by:15vh;--br:-4deg;--d:.105s}.slot:nth-child(5){--flip:1;--fx:44vmin;--fy:44vmin;--sx:-64vw;--sy:64vh;--bx:-13vw;--by:13vh;--br:-3deg;--d:.14s}.slot:nth-child(6){--flip:1;--fx:73vmin;--fy:73vmin;--sx:-64vw;--sy:64vh;--bx:-11vw;--by:11vh;--br:-2deg;--d:.175s}.slot:nth-child(7){--flip:-1;--fx:72vmin;--fy:-72vmin;--sx:64vw;--sy:-64vh;--bx:24vw;--by:-24vh;--br:8deg;--d:.018s}.slot:nth-child(8){--flip:-1;--fx:43vmin;--fy:-43vmin;--sx:64vw;--sy:-64vh;--bx:20vw;--by:-20vh;--br:6deg;--d:.053s}.slot:nth-child(9){--flip:-1;--fx:14vmin;--fy:-14vmin;--sx:64vw;--sy:-64vh;--bx:17vw;--by:-17vh;--br:5deg;--d:.088s}.slot:nth-child(10){--flip:-1;--fx:-15vmin;--fy:15vmin;--sx:64vw;--sy:-64vh;--bx:15vw;--by:-15vh;--br:4deg;--d:.123s}.slot:nth-child(11){--flip:-1;--fx:-44vmin;--fy:44vmin;--sx:64vw;--sy:-64vh;--bx:13vw;--by:-13vh;--br:3deg;--d:.158s}.slot:nth-child(12){--flip:-1;--fx:-73vmin;--fy:73vmin;--sx:64vw;--sy:-64vh;--bx:11vw;--by:-11vh;--br:2deg;--d:.193s}.shards{position:absolute;inset:0;z-index:14;pointer-events:none}.shard{position:absolute;left:50%;top:50%;width:7px;height:16px;border-radius:3px;background:linear-gradient(#e2e2e2,#676767);opacity:0;box-shadow:0 0 5px #fff3;transform:translate(-50%,-50%) rotate(var(--r))}.shards.go .shard{animation:shard .5s cubic-bezier(.1,.74,.15,1) var(--d) forwards}.shard:nth-child(1){--x:-42vw;--y:-32vh;--r:48deg;--d:0s}.shard:nth-child(2){--x:39vw;--y:-30vh;--r:-51deg;--d:.02s}.shard:nth-child(3){--x:-47vw;--y:20vh;--r:95deg;--d:.04s}.shard:nth-child(4){--x:45vw;--y:24vh;--r:18deg;--d:.06s}.shard:nth-child(5){--x:-18vw;--y:-42vh;--r:120deg;--d:.08s}.shard:nth-child(6){--x:17vw;--y:43vh;--r:-102deg;--d:.1s}.shard:nth-child(7){--x:-32vw;--y:37vh;--r:66deg;--d:.04s}.shard:nth-child(8){--x:34vw;--y:-38vh;--r:-76deg;--d:.07s}.layer.exit{animation:out .42s ease forwards}@keyframes bgIn{to{opacity:1}}@keyframes biteHit{0%{transform:scale(1)}35%{transform:scale(.91) translateX(-2px);filter:brightness(1.35)}70%{transform:scale(1.04) translateX(2px)}100%{transform:scale(1)}}@keyframes biteRing{0%{border-color:#ff384f;transform:scale(.72);opacity:1}100%{border-color:#ff384f00;transform:scale(1.38);opacity:0}}@keyframes impact{0%{opacity:0;transform:translate(-50%,-50%) scale(.18)}20%{opacity:.96}100%{opacity:0;transform:translate(-50%,-50%) scale(1.35)}}@keyframes flash{0%{opacity:0}25%{opacity:.8}100%{opacity:0}}@keyframes rushGrid{0%{opacity:0;transform:translate(calc(var(--fx) + var(--sx)),calc(var(--fy) + var(--sy))) scaleX(var(--flip)) scale(1.035)}7%{opacity:.28}18%{opacity:.82}100%{opacity:1;transform:translate(var(--fx),var(--fy)) scaleX(var(--flip)) scale(1.035)}}@keyframes chainSqueeze{from{transform:scale(1)}to{transform:scale(.972)}}@keyframes snapGrid{0%{opacity:1;transform:translate(var(--fx),var(--fy)) scaleX(var(--flip)) scale(1.035)}20%{opacity:1}100%{opacity:0;transform:translate(calc(var(--fx) + var(--bx)),calc(var(--fy) + var(--by))) rotate(var(--br)) scaleX(var(--flip)) scale(.99)}}@keyframes shard{0%{opacity:0;transform:translate(-50%,-50%) rotate(var(--r)) scale(.6)}10%{opacity:1}100%{opacity:0;transform:translate(calc(-50% + var(--x)),calc(-50% + var(--y))) rotate(calc(var(--r) + 240deg)) scale(1.3)}}@keyframes out{to{opacity:0}}@media(max-width:720px){.hud b{font-size:9px}.status{font-size:8px;bottom:max(12px,env(safe-area-inset-bottom))}.slot{width:150vmax;height:150vmax}}
`;

function html(chain,src,rect){const size=Math.max(46,Math.min(92,rect.width||58)),left=Math.max(12,rect.left),top=Math.max(12,rect.top);return `<div class="layer"><div class="backdrop"></div><div class="avatar" style="left:${left}px;top:${top}px;width:${size}px;height:${size}px"><img src="${src}" alt=""></div><canvas></canvas><div class="impact"></div><div class="flash"></div><div class="chains">${Array.from({length:12},()=>`<span class="slot"><img src="${chain}" alt=""></span>`).join('')}</div><div class="shards">${Array.from({length:8},()=>'<i class="shard"></i>').join('')}</div><header class="hud"><b>RAVEN LIN // KIVAT EASTER EGG</b><button data-skip type="button">BỎ QUA ↗</button></header><div class="status">KIVAT BELT // ORIGINAL FBX GEOMETRY</div></div>`}

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
 constructor(canvas){this.cv=canvas;this.gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:true,powerPreference:'high-performance'});if(!this.gl)throw new Error('WebGL unavailable');this.mesh={};this.aspect=1;this.init();this.resize();this.ro=new ResizeObserver(()=>this.resize());this.ro.observe(canvas)}
 init(){const g=this.gl,vs=`attribute vec3 p;attribute vec3 n;attribute float k;uniform mat4 mvp;uniform mat3 nm;varying vec3 vn;varying float vk;void main(){gl_Position=mvp*vec4(p,1.);vn=normalize(nm*n);vk=k;}`,fs=`precision mediump float;varying vec3 vn;varying float vk;uniform vec3 pal[8];uniform float eye;uniform float alpha;vec3 C(float k){if(k<.5)return pal[0];if(k<1.5)return pal[1];if(k<2.5)return pal[2];if(k<3.5)return pal[3];if(k<4.5)return pal[4];if(k<5.5)return pal[5];if(k<6.5)return pal[6];return pal[7];}void main(){vec3 c=C(vk),L=normalize(vec3(-.34,.72,.62));float d=.34+.66*max(0.,dot(normalize(vn),L));if(vk>.5&&vk<1.5)c*=1.+eye*1.8;gl_FragColor=vec4(c*d,alpha);}`;const sh=(t,s)=>{const x=g.createShader(t);g.shaderSource(x,s);g.compileShader(x);if(!g.getShaderParameter(x,g.COMPILE_STATUS))throw new Error(g.getShaderInfoLog(x));return x};this.pr=g.createProgram();g.attachShader(this.pr,sh(g.VERTEX_SHADER,vs));g.attachShader(this.pr,sh(g.FRAGMENT_SHADER,fs));g.linkProgram(this.pr);g.useProgram(this.pr);this.A={p:g.getAttribLocation(this.pr,'p'),n:g.getAttribLocation(this.pr,'n'),k:g.getAttribLocation(this.pr,'k')};this.U={mvp:g.getUniformLocation(this.pr,'mvp'),nm:g.getUniformLocation(this.pr,'nm'),pal:g.getUniformLocation(this.pr,'pal[0]'),eye:g.getUniformLocation(this.pr,'eye'),alpha:g.getUniformLocation(this.pr,'alpha')};const pal=KIVAT_META.palette.flatMap(h=>[parseInt(h.slice(1,3),16)/255,parseInt(h.slice(3,5),16)/255,parseInt(h.slice(5,7),16)/255]);g.uniform3fv(this.U.pal,new Float32Array(pal));for(const [name,d] of Object.entries(KIVAT_MESH_DATA)){const m={count:d.count};for(const [key,a,size,type] of [['p',decode(d.p,Float32Array),3,g.FLOAT],['n',decode(d.n,Float32Array),3,g.FLOAT],['k',decode(d.k,Uint8Array),1,g.UNSIGNED_BYTE]]){const b=g.createBuffer();g.bindBuffer(g.ARRAY_BUFFER,b);g.bufferData(g.ARRAY_BUFFER,a,g.STATIC_DRAW);m[key]={b,size,type}}this.mesh[name]=m}g.enable(g.DEPTH_TEST);g.depthFunc(g.LEQUAL);g.enable(g.BLEND);g.blendFunc(g.SRC_ALPHA,g.ONE_MINUS_SRC_ALPHA);g.disable(g.CULL_FACE)}
 resize(){const r=this.cv.getBoundingClientRect(),cap=innerWidth<720?1.35:1.65,d=Math.min(devicePixelRatio||1,cap);this.cv.width=Math.max(1,Math.round(r.width*d));this.cv.height=Math.max(1,Math.round(r.height*d));this.gl.viewport(0,0,this.cv.width,this.cv.height);this.aspect=r.width/Math.max(1,r.height);this.proj=ortho(-this.aspect,this.aspect,-1,1,-12,12)}
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
  const dS=Math.min(mobile?.102:.155,(2*a*.92)/8.81,.84/2.10);
  const dX=0,dY=mobile?-.035:-.105,[ax,ay]=target;
  const pcY=KIVAT_META.dockPivot[1]-KIVAT_META.kivatCenter[1];
  const db=KIVAT_MESH_DATA.driver?.bounds;
  const driverTopLocal=db ? (db.max[1]-KIVAT_META.driverCenter[1]) : 1.04244;
  const contactInset=mobile?.006:.008;
  const anchorY=dY+dS*driverTopLocal-contactInset;
  const uprightCenterY=anchorY-kS*pcY;
  let P={driverAlpha:0,driverX:dX,driverY:dY,driverScale:dS,driverRot:0,driverYaw:0,kivatAlpha:0,kx:a+.62,ky:.32,kscale:kS,krot:0,kyaw:0,kpitch:0,dockPitch:0,flap:0,mouth:0,eyeGlow:0};

  // Driver: soft rise, tiny settle instead of a hard linear pop.
  if(t>=.46){
    const u=clamp((t-.46)/.82),q=smoother(u);
    P.driverAlpha=smooth(clamp(u/.72));
    P.driverScale=dS*(.78+.22*q);
    P.driverY=dY+.27*(1-q)-.008*Math.sin(Math.PI*q);
    P.driverYaw=.34*(1-q);
  }
  if(t<1.26)return P;

  P.kivatAlpha=1;
  const start=[a+.64,.30],bite=[ax+(mobile?.105:.145),ay-.018];

  if(t<2.62){
    // Arrival uses a shallow cubic arc so Kivat glides rather than sliding on a straight line.
    const raw=clamp((t-1.26)/1.36),u=smoother(raw);
    const c1=[lerp(start[0],bite[0],.30),start[1]+.13];
    const c2=[lerp(start[0],bite[0],.80),bite[1]+.085];
    const p=bez3(start,c1,c2,bite,u);
    P.kx=p[0];P.ky=p[1]+Math.sin((t-1.26)*Math.PI*3.2)*.008*(1-raw);
    P.krot=lerp(-.18,.025,u)+Math.sin(raw*Math.PI)*.025;
    P.kyaw=lerp(-.46,.035,smoother(raw));
    P.kscale=kS*(.80+.20*smooth(raw));
    const env=.55+.45*Math.sin(Math.PI*clamp(raw/.92));
    P.flap=flapWave(t-1.26,3.35,.30*env);
  }else if(t<3.32){
    // Bite has anticipation -> snap -> recoil; no constant buzzing around the avatar.
    const u=clamp((t-2.62)/.70);
    P.kx=bite[0];P.ky=bite[1];P.krot=.018;P.kyaw=.025;
    if(u<.22){const q=smoother(u/.22);P.mouth=.92*q;P.kx-=.018*q;P.ky+=.008*q;}
    else if(u<.43){const q=smoother((u-.22)/.21);P.mouth=.92*(1-q);P.kx+=.026*q;P.ky-=.011*q;}
    else {const q=smoother((u-.43)/.57);P.mouth=0;P.kx+=.026*(1-q);P.ky-=.011*(1-q);P.krot+=Math.sin(q*Math.PI)*.025;}
    P.flap=flapWave(t,2.1,.075*(1-smooth(u)));
  }else if(t<4.74){
    // Return follows a second curved path while yawing its back toward the viewer.
    const raw=clamp((t-3.32)/1.42),u=smoother(raw),end=[dX,uprightCenterY+.125];
    const c1=[lerp(bite[0],end[0],.25),bite[1]+.11];
    const c2=[lerp(bite[0],end[0],.78),end[1]+.09];
    const p=bez3(bite,c1,c2,end,u);
    P.kx=p[0];P.ky=p[1]+Math.sin(raw*Math.PI*2.4)*.008*(1-raw);
    P.krot=.035*(1-u);
    P.kyaw=lerp(.03,Math.PI,smoother(clamp((raw-.08)/.82)));
    P.flap=flapWave(t-3.32,3.25,.27*(1-.55*smooth(raw)));
  }else if(t<5.37){
    // Landing eases vertically onto the geometry-derived perch and lets the wings die away.
    const raw=clamp((t-4.74)/.63),u=smoother(raw);
    P.kx=dX;P.ky=lerp(uprightCenterY+.125,uprightCenterY,u);
    P.krot=0;P.kyaw=Math.PI;P.kpitch=0;
    P.flap=flapWave(t-4.74,2.35,.11*(1-u));
    P.kscale=kS*(1-.008*u);
  }else if(t<5.56){
    P.kx=dX;P.ky=uprightCenterY;P.krot=0;P.kyaw=Math.PI;P.flap=0;
  }else if(t<6.42){
    // Heavy-door backward hinge: slow start, weight through the middle, soft mechanical seat.
    const u=clamp((t-5.56)/.86);
    let q=easeInOutCubic(u);
    if(u>.86)q+=Math.sin((u-.86)/.14*Math.PI)*.008;
    P.kx=dX;P.ky=uprightCenterY;P.krot=0;P.kyaw=Math.PI;P.flap=0;
    P.dockPitch=-Math.PI*q;
    P.ky+=.004*Math.sin(Math.PI*u);
  }else{
    P.kx=dX;P.ky=uprightCenterY;P.kyaw=Math.PI;P.dockPitch=-Math.PI;P.flap=0;
    const slam=clamp((t-6.42)/.14);P.ky+=.010*(1-smoother(slam));
    if(t>=6.42&&t<6.72){const f=(t-6.42)/.30;P.eyeGlow=Math.pow(Math.sin(Math.PI*clamp(f)),.72)*1.18;P.ky+=Math.sin((t-6.42)*Math.PI*34)*.0028*(1-f)}
    if(t>=6.72)P.eyeGlow=.08;
  }
  return P
}
const _imgWarm=new Map();
function warmImage(src){if(_imgWarm.has(src))return _imgWarm.get(src);const p=new Promise(resolve=>{const im=new Image();im.decoding='async';im.onload=()=>{const d=im.decode?.();d&&typeof d.then==='function'?d.catch(()=>{}).finally(resolve):resolve()};im.onerror=()=>resolve();im.src=src});_imgWarm.set(src,p);return p}


export function initRaven(){const chain=new URL('../../assets/easter/raven-chain.png',import.meta.url).href;const api={preload:()=>warmImage(chain).then(()=>true),launch(trigger){warmImage(chain);api.stop('replaced');const info=avatarInfo(trigger),host=document.createElement('div');host.style.cssText='position:fixed;inset:0;z-index:2147482000;';const shadow=host.attachShadow({mode:'open'});shadow.innerHTML=`<style>${CSS}</style>${html(chain,info.src,info.rect)}`;document.body.append(host);const layer=shadow.querySelector('.layer'),canvas=shadow.querySelector('canvas'),av=shadow.querySelector('.avatar'),chains=shadow.querySelector('.chains'),shards=shadow.querySelector('.shards'),impact=shadow.querySelector('.impact'),flash=shadow.querySelector('.flash'),R=new KivatRenderer(canvas),prev=document.body.style.overflow;document.body.style.overflow='hidden';const center=[info.rect.left+info.rect.width/2,info.rect.top+info.rect.height/2],target=R.screen(...center),state={host,trigger,renderer:R,prev,raf:0};current=state;shadow.querySelector('[data-skip]')?.addEventListener('click',()=>api.stop('skipped'));let start=performance.now(),last='';const phase=t=>t<.46?'dark':t<1.26?'driver':t<2.62?'fly':t<3.32?'bite':t<4.74?'return':t<5.37?'land':t<5.56?'hold':t<6.42?'hinge':t<6.66?'flash':t<7.46?'chain':t<7.72?'tight':t<8.12?'break':'exit';const loop=now=>{if(current!==state)return;const t=(now-start)/1000,p=phase(t);if(p!==last){last=p;if(p==='bite')av.classList.add('bitten');if(p==='flash'){impact.classList.add('go');flash.classList.add('go')}if(p==='chain')chains.classList.add('lock');if(p==='tight')chains.classList.add('tight');if(p==='break'){chains.classList.add('break');shards.classList.add('go')}if(p==='exit')layer.classList.add('exit')}R.render(pose(t,R,target));if(t<DURATION)state.raf=requestAnimationFrame(loop);else api.stop('complete')};state.raf=requestAnimationFrame(loop);document.dispatchEvent(new CustomEvent('club:raven',{detail:{active:true,duration:DURATION,version:VERSION,renderer:'user-fbx-webgl'}}));return true},stop(reason='cancelled'){if(!current)return;const s=current;current=null;cancelAnimationFrame(s.raf);s.renderer?.dispose();try{s.host.remove()}catch{}document.body.style.overflow=s.prev||'';if(reason!=='complete'&&reason!=='hidden')s.trigger?.focus?.({preventScroll:true});document.dispatchEvent(new CustomEvent('club:raven',{detail:{active:false,reason,version:VERSION}}))},get state(){return{active:!!current,duration:DURATION,version:VERSION,renderer:'user-fbx-webgl',lastError:''}}};window.ClubRaven=api;if(!window.__kivatEscapeBound){window.__kivatEscapeBound=true;document.addEventListener('keydown',e=>{if(e.key==='Escape'&&current){e.preventDefault();api.stop('escape')}});document.addEventListener('visibilitychange',()=>{if(document.hidden)api.stop('hidden')});window.addEventListener('pagehide',()=>api.stop('hidden'))}return api}
