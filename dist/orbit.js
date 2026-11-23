const canvas = document.querySelector("#space");
const ctx = canvas.getContext("2d");
const motion = matchMedia("(prefers-reduced-motion: reduce)");

let seed = 26394;
function random() {
  seed = (Math.imul(1664525, seed) + 1013904223) >>> 0;
  return seed / 4294967296;
}
const stars = Array.from({length: 170}, () => ({
  x: random(), y: random(), size: random(), glow: random()
}));
const grit = Array.from({length: 240}, () => [random(), random(), random()]);
const particles = [];
let shakeUntil = 0;
let boostUntil = 0;
let shipX = 0;
let shipY = 0;
let drawnProgress = 0;
let lastTime = 0;

function ellipse(x,y,rx,ry,color,width=1) {
  ctx.beginPath(); ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2); ctx.strokeStyle=color; ctx.lineWidth=width; ctx.stroke();
}
function path(points, fill, stroke, width=1) {
  ctx.beginPath();
  points.forEach(([x,y],i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y));
  if (fill) { ctx.closePath(); ctx.fillStyle=fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle=stroke; ctx.lineWidth=width; ctx.stroke(); }
}
function glow(x,y,r,color) {
  const gradient=ctx.createRadialGradient(x,y,0,x,y,r);
  gradient.addColorStop(0,color);
  gradient.addColorStop(1,"transparent");
  ctx.fillStyle=gradient;
  ctx.fillRect(x-r,y-r,r*2,r*2);
}
function planet(x,y,r,tint) {
  glow(x,y,r*1.55,tint.glow);
  ctx.save();
  ctx.translate(x,y); ctx.rotate(-.28);
  for (let i=0;i<8;i++) ellipse(0,0,r*(1.23+i*.071),r*(.37+i*.033),i===2 || i===5?tint.ring:"#9599dc35",i===2?1.8:1);
  ctx.restore();
  const surface=ctx.createRadialGradient(x-r*.34,y-r*.5,r*.02,x+r*.09,y+r*.36,r*1.22);
  surface.addColorStop(0,tint.light);surface.addColorStop(.42,tint.mid);surface.addColorStop(.78,"#29284e");surface.addColorStop(1,"#10142b");
  ctx.save();
  ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.clip();
  ctx.fillStyle=surface;ctx.fillRect(x-r,y-r,r*2,r*2);
  for(let i=0;i<16;i++){
    const sy=y-r+i*r*.135;
    ctx.beginPath();ctx.moveTo(x-r,sy);
    ctx.bezierCurveTo(x-r*.05,sy+r*.28,x+r*.18,sy-r*.32,x+r,sy-r*.22);
    ctx.strokeStyle=i%3===0?"#dde1ff27":"#13182e40";
    ctx.lineWidth=i%3===0?2:1;ctx.stroke();
  }
  for(const [gx,gy,alpha] of grit){
    ctx.fillStyle=alpha>.55?"#fff2":"#0002";ctx.fillRect(x-r+gx*r*2,y-r+gy*r*2,1.2,1.2);
  }
  ctx.restore();
  ellipse(x,y,r,r,tint.ring,1);
  ctx.save();
  ctx.translate(x,y);ctx.rotate(-.28);
  for(let i=0;i<8;i++){
    ctx.beginPath();ctx.ellipse(0,0,r*(1.23+i*.071),r*(.37+i*.033),0,.20,Math.PI-.10);
    ctx.strokeStyle=i===2 || i===5?tint.ring:"#a4a9df55";ctx.lineWidth=i===2?1.8:1;ctx.stroke();
  }
  ctx.restore();
}
const palettes=[
  {light:"#c5bdf4",mid:"#7772b7",glow:"#8375e656",ring:"#b7aff3a0"},
  {light:"#9ce6e3",mid:"#4e8aaf",glow:"#60cfd455",ring:"#a1e9dfa0"},
  {light:"#ffc1bb",mid:"#a86b8c",glow:"#ed818e55",ring:"#ffc1bea0"}
];

function ship(x,y,scale,t,hot,ghost=false){
  ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
  if (ghost) ctx.globalAlpha=.5;
  const accent=ghost?"#beabff":"#ddfc82";
  const exhaust=ctx.createLinearGradient(-101,0,-31,0);
  exhaust.addColorStop(0,"transparent");exhaust.addColorStop(.65,ghost?"#a188ef60":"#9eaaff90");exhaust.addColorStop(1,accent);
  glow(-39,0,hot?54:33,ghost?"#9b83ff88":"#a2a0fe94");
  const flame=hot?93:62;
  const pulse=motion.matches?0:Math.sin(t/39)*6;
  path([[-33,-6],[-flame-pulse,0],[-33,6]],exhaust);
  path([[-34,-4],[-flame*.66-pulse,0],[-34,4]],accent);
  path([[-34,-8],[-26,-13],[4,-14],[27,-7],[46,0],[27,7],[4,14],[-26,13],[-34,8]],"#5b628c","#c4c9ee");
  path([[-30,-11],[-17,-27],[6,-27],[1,-13],[28,-7],[36,0],[6,-4]],"#a7aadc","#e5e1ff",1.2);
  path([[-30,11],[-17,27],[6,27],[1,13],[28,7],[36,0],[6,4]],"#666e9f","#b9bfea",1.2);
  path([[-28,0],[-18,-8],[10,-10],[36,-4],[46,0],[35,4],[10,8],[-18,7]],"#c9ceef","#f8f7ff");
  path([[-1,-4],[13,-6],[30,-2],[35,0],[28,2],[3,3]],"#323d68","#797fbc");
  path([[7,-3],[16,-4],[27,-1]],null,"#b3caff");
  path([[-25,-25],[-17,-30],[-14,-28],[-22,-25]],accent);
  path([[-25,25],[-17,30],[-14,28],[-22,25]],accent);
  path([[-27,-1],[-15,-1]],null,"#424b78",2);
  path([[-34,-5],[-34,5]],null,accent,3);
  ctx.restore();
}

export function burst(type) {
  const now=performance.now();
  if(type==="error") shakeUntil=now+260;
  if(type==="boost" || type==="finish") boostUntil=now+600;
  if(motion.matches) return;
  const count=type==="finish"?38:type==="boost"?17:type==="error"?12:5;
  for(let i=0;i<count;i++){
    const life=270+random()*460;
    particles.push({x:shipX-25,y:shipY+(random()-.5)*15,vx:-22-random()*170,vy:(random()-.5)*92,born:now,life,color:type==="error"?"#ff8ca7":i%3?"#dcfc79":"#b9a6ff"});
  }
}

export function drawOrbit(t,{progress=0,ghost=null,active=false,route=0}={}) {
  const box=canvas.getBoundingClientRect();
  if (!box.width || !box.height) return;
  const ratio=Math.min(devicePixelRatio||1,2);
  const cw=Math.round(box.width*ratio), ch=Math.round(box.height*ratio);
  if (canvas.width!==cw || canvas.height!==ch) {canvas.width=cw;canvas.height=ch;}
  const w=box.width,h=box.height;
  ctx.setTransform(ratio,0,0,ratio,0,0);
  const palette=palettes[route%palettes.length];
  const bg=ctx.createLinearGradient(0,0,w,h);
  bg.addColorStop(0,"#0d1022");bg.addColorStop(.5,"#181831");bg.addColorStop(1,"#27234b");
  ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
  glow(w*.72,h*.58,w*.49,palette.glow);
  glow(w*.18,h*.79,h*.57,"#596d9f48");
  const dt=lastTime?Math.min(50,t-lastTime):16;lastTime=t;
  drawnProgress=motion.matches?progress:drawnProgress+(progress-drawnProgress)*Math.min(1,dt/80);
  if(progress===0 && !active) drawnProgress=0;
  const hot=t<boostUntil;
  const pan=motion.matches?0:drawnProgress*72;
  for(const star of stars){
    const x=((star.x*w-pan*(.25+star.size))%w+w)%w,y=star.y*h;
    ctx.fillStyle=star.glow>.83?"#f0eaffac":star.glow>.38?"#a2b2e681":"#9da2cb50";
    const s=star.size>.96?2:star.size>.6?1.3:.75;
    ctx.fillRect(x,y,s,s);
    if(star.size>.985){path([[x-4,y+1],[x+5,y+1]],null,"#b8c3ea6b");path([[x+1,y-4],[x+1,y+5]],null,"#b8c3ea6b");}
  }
  const py=h*.53, px=w*.71-pan*.36, radius=Math.min(h*.29,w*.205);
  planet(px,py,radius,palette);
  const horizon=h*.67;
  for(let i=-9;i<=9;i++)path([[w*.51+i*w*.038,horizon],[w*.51+i*w*.149,h]],null,"#a7abf31b");
  for(const depth of [.025,.075,.15,.24,.37,.54,.77,1])path([[0,horizon+depth*(h-horizon)],[w,horizon+depth*(h-horizon)]],null,"#a7abf325");
  path([[0,horizon],[w,horizon]],null,"#c5b3ff2d");
  ctx.save();ctx.setLineDash([3,7]);
  path([[w*.11,h*.57],[w*.85,h*.57]],null,"#d8d3ff48");
  ctx.restore();
  for(const x of [w*.11,w*.85]){
    const y=h*.57;
    path([[x-5,y],[x,y-5],[x+5,y],[x,y+5],[x-5,y]],null,"#d7d5f9aa");
  }
  const size=Math.min(1.3,w/570+.4,h/220);
  const bob=motion.matches?0:Math.sin(t/480)*2.7;
  shipX=w*(.26+drawnProgress*.56);
  shipY=h*.55+bob;
  if(t<shakeUntil && !motion.matches) shipY+=Math.sin(t/12)*4;
  if(ghost!==null) ship(w*(.26+ghost*.56),h*.72,size*.74,t,false,true);
  for(let i=particles.length-1;i>=0;i--){
    const p=particles[i],elapsed=t-p.born;
    if(elapsed>p.life){particles.splice(i,1);continue;}
    ctx.globalAlpha=Math.max(0,1-elapsed/p.life);
    ctx.fillStyle=p.color;ctx.fillRect(p.x+p.vx*elapsed/1000,p.y+p.vy*elapsed/1000,3,1.7);
  }
  ctx.globalAlpha=1;
  ship(shipX,shipY,size,t,hot);
  if(hot && !motion.matches){
    const intensity=(boostUntil-t)/600;
    for(const star of stars.slice(0,24)){
      const x=((star.x*w-(1-intensity)*w*.3)%w+w)%w,y=star.y*h;
      path([[x,y],[x+intensity*(18+star.size*27),y]],null,`rgba(217,213,255,${intensity*.55})`);
    }
  }
}
