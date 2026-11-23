const canvas = document.querySelector("#space");
const ctx = canvas.getContext("2d");
const motion = matchMedia("(prefers-reduced-motion: reduce)");

let seed = 26394;
function random() {
  seed = (Math.imul(1664525, seed) + 1013904223) >>> 0;
  return seed / 4294967296;
}
const stars = Array.from({length: 320}, () => ({
  x: random(), y: random(), size: random(), glow: random()
}));
const dust = Array.from({length: 420}, () => {
  const x=random();
  return {x,y:.81-x*.61+(random()+random()+random()-1.5)*.36,alpha:.06+random()*.24};
});
const planetCache=new WeakMap();
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
const palettes=[
  {light:[224,214,247],mid:[140,139,201],dark:[27,34,70],glow:"#ada0ee66",ring:"#c7bbedab"},
  {light:[207,242,235],mid:[96,162,179],dark:[22,47,75],glow:"#77c9d05c",ring:"#bcdfebc2"},
  {light:[252,219,190],mid:[176,122,151],dark:[46,33,67],glow:"#df9da771",ring:"#efc9c9b2"}
];
function planetTexture(tint){
  const cached=planetCache.get(tint);
  if(cached) return cached;
  const dim=384;
  const sprite=document.createElement("canvas");
  sprite.width=dim;sprite.height=dim;
  const paint=sprite.getContext("2d");
  const pixels=paint.createImageData(dim,dim);
  for(let py=0;py<dim;py++){
    const y=(py+.5)/dim*2-1;
    for(let px=0;px<dim;px++){
      const x=(px+.5)/dim*2-1;
      const radius=x*x+y*y;
      if(radius>=1) continue;
      const z=Math.sqrt(1-radius);
      const lat=(y+x*.25)*.93;
      const longitude=Math.atan2(x,z);
      const ripples=.069*Math.sin(longitude*4+y*11)+.035*Math.sin(longitude*13-y*16);
      const stream=lat+ripples;
      const bands=.5+.22*Math.sin(stream*37)+.115*Math.sin(stream*71+.7)+.065*Math.sin(stream*157)+.05*Math.sin(stream*211+longitude*25);
      const cloud=.12*Math.sin(longitude*17+stream*80)*Math.sin(stream*24-longitude*8);
      const scatter=((Math.imul(px+59,py+87)*769) % 31-15)*.15;
      const light=Math.max(0,Math.min(1,-.49*x-.55*y+.69*z));
      const atmosphere=(1-z)**3*.23*(light+.15);
      const ringShadow=y+x*.22-.07;
      const silhouette=Math.abs(ringShadow)<.09 && y>-.09?.10*(1-Math.abs(ringShadow)/.09):0;
      const amount=(.15+light*.85)*(1-silhouette);
      const index=(px+py*dim)*4;
      for(let c=0;c<3;c++){
        const color=tint.mid[c]+(tint.light[c]-tint.mid[c])*Math.max(0,Math.min(1,bands+cloud));
        pixels.data[index+c]=tint.dark[c]+(color-tint.dark[c])*amount+(tint.light[c]-color)*atmosphere+scatter;
      }
      pixels.data[index+3]=Math.min(255,(1-radius)*dim*128);
    }
  }
  paint.putImageData(pixels,0,0);
  planetCache.set(tint,sprite);
  return sprite;
}
const rings=[
  [1.22,.28,.6],[1.27,.31,2],[1.31,.327,4],[1.36,.348,1.1],
  [1.44,.382,2],[1.46,.395,.7],[1.55,.43,2.6],[1.61,.456,1.3],[1.69,.489,.6],[1.77,.515,.6]
];
function drawRings(x,y,r,tint,front){
  ctx.save();
  ctx.translate(x,y);ctx.rotate(-.20);
  for(const [rx,ry,width] of rings){
    ctx.beginPath();
    ctx.ellipse(0,0,r*rx,r*ry,0,front?.06:0,front?Math.PI-.04:Math.PI*2);
    ctx.strokeStyle=width>1.5?tint.ring:"#c9c7ef50";
    ctx.lineWidth=width*(front?1.09:.79);
    ctx.stroke();
  }
  ctx.restore();
}
function planet(x,y,r,tint){
  glow(x,y,r*1.62,tint.glow);
  drawRings(x,y,r,tint,false);
  ctx.drawImage(planetTexture(tint),x-r,y-r,r*2,r*2);
  ellipse(x,y,r,r,"#c6c5f167",1.1);
  ctx.beginPath();ctx.arc(x,y,r,-Math.PI*1.12,-Math.PI*.26);
  ctx.strokeStyle="#f3e3f4bd";ctx.lineWidth=1.3;ctx.stroke();
  drawRings(x,y,r,tint,true);
}
function ship(x,y,scale,t,hot,ghost=false){
  ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
  if (ghost) ctx.globalAlpha=.5;
  const accent=ghost?"#d0baff":"#f2ebb1";
  const exhaust=ctx.createLinearGradient(-131,0,-31,0);
  exhaust.addColorStop(0,"transparent");exhaust.addColorStop(.65,ghost?"#a188ef60":"#9eaaff90");exhaust.addColorStop(1,accent);
  glow(-39,0,hot?54:33,ghost?"#9b83ff88":"#a2a0fe94");
  const flame=hot?126:82;
  const pulse=motion.matches?0:Math.sin(t/39)*6;
  ctx.beginPath();
  ctx.moveTo(-35,-7);
  ctx.bezierCurveTo(-58,-9,-65,-4,-flame-pulse,0);
  ctx.bezierCurveTo(-64,4,-58,9,-35,7);
  ctx.fillStyle=exhaust;ctx.fill();
  const shell=ctx.createLinearGradient(0,-26,0,22);
  shell.addColorStop(0,"#f4f3ff");shell.addColorStop(.46,"#afb8d7");shell.addColorStop(.56,"#dce2f2");shell.addColorStop(1,"#59688d");
  path([[-34,-4],[-flame*.66-pulse,0],[-34,4]],accent);
  path([[-34,-8],[-26,-13],[4,-14],[27,-7],[46,0],[27,7],[4,14],[-26,13],[-34,8]],"#5b628c","#c4c9ee");
  path([[-30,-11],[-17,-27],[6,-27],[1,-13],[28,-7],[36,0],[6,-4]],shell,"#f1e9ff",1.0);
  path([[-30,11],[-17,27],[6,27],[1,13],[28,7],[36,0],[6,4]],"#666e9f","#b9bfea",1.2);
  path([[-28,0],[-18,-8],[10,-10],[36,-4],[46,0],[35,4],[10,8],[-18,7]],shell,"#f8f7ff");
  path([[-1,-4],[13,-6],[30,-2],[35,0],[28,2],[3,3]],"#323d68","#797fbc");
  path([[7,-3],[16,-4],[27,-1]],null,"#d2e8ff");
  path([[-21,-14],[-12,-23],[-1,-23],[-10,-12]],"#404d75","#687b9f");
  path([[-21,14],[-12,23],[-1,23],[-10,12]],"#3a466c","#687b9f");
  path([[-21,-17],[-16,-23]],null,accent,1.5);
  path([[-21,17],[-16,23]],null,accent,1.5);
  for(let i=0;i<3;i++) path([[-27+i*3,-4],[-27+i*3,4]],null,"#536588",.85);
  path([[4,8],[18,6],[29,3]],null,"#3e4c77",.9);
  path([[7,-10],[17,-9],[24,-7]],null,"#fff8",.8);
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
  bg.addColorStop(0,"#151e37");bg.addColorStop(.44,"#293253");bg.addColorStop(1,"#413958");
  ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
  glow(w*.72,h*.58,w*.43,palette.glow);
  glow(w*.22,h*.59,h*.93,"#97a7df35");
  glow(w*.49,h*.38,h*.92,"#b5a4e736");
  glow(w*.92,h*.13,h*.78,"#d6adc52f");
  const dt=lastTime?Math.min(50,t-lastTime):16;lastTime=t;
  drawnProgress=motion.matches?progress:drawnProgress+(progress-drawnProgress)*Math.min(1,dt/80);
  if(progress===0 && !active) drawnProgress=0;
  const hot=t<boostUntil;
  const pan=motion.matches?0:drawnProgress*w*.09;
  for(const fine of dust){
    const x=((fine.x*w-pan*.8)%w+w)%w;
    ctx.fillStyle=`rgba(215,207,246,${fine.alpha})`;
    ctx.fillRect(x,fine.y*h,1,1);
  }
  for(const star of stars){
    const x=((star.x*w-pan*(.25+star.size))%w+w)%w,y=star.y*h;
    ctx.fillStyle=star.glow>.83?"#f0eaffac":star.glow>.38?"#a2b2e681":"#9da2cb50";
    const s=star.size>.96?2:star.size>.6?1.3:.75;
    ctx.fillRect(x,y,s,s);
    if(star.size>.985){path([[x-4,y+1],[x+5,y+1]],null,"#b8c3ea6b");path([[x+1,y-4],[x+1,y+5]],null,"#b8c3ea6b");}
  }
  const py=h*.49, px=w*.72-pan*.55, radius=Math.min(h*.32,w*.195)*(1+drawnProgress*.18);
  planet(px,py,radius,palette);
  const horizon=h*.72;
  for(let i=-9;i<=9;i++)path([[w*.51+i*w*.038,horizon],[w*.51+i*w*.149,h]],null,"#a7abf31a");
  for(const depth of [.05,.14,.27,.45,.69,1])path([[0,horizon+depth*(h-horizon)],[w,horizon+depth*(h-horizon)]],null,"#a7abf323");
  const flightY=h*.60;
  ctx.save();ctx.setLineDash([2,7]);
  path([[w*.105,flightY],[w*.91,flightY]],null,"#e4ddfb64");
  ctx.restore();
  for(const x of [w*.105,w*.91]){
    path([[x-5,flightY],[x,flightY-5],[x+5,flightY],[x,flightY+5],[x-5,flightY]],null,"#ded9ffbc");
  }
  const size=Math.min(1.63,w/610+.38,h/200+.11);
  const bob=motion.matches?0:Math.sin(t/480)*2.7;
  shipX=w*(.30+drawnProgress*.52);
  shipY=h*.585+bob;
  if(t<shakeUntil && !motion.matches) shipY+=Math.sin(t/12)*4;
  if(ghost!==null) ship(w*(.30+ghost*.52),h*.74,size*.74,t,false,true);
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
