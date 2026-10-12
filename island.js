/* 🏝️ Island — แผนที่เกาะลอยฟ้า (Background/Grass.png) ให้สัตว์เลี้ยงเดินเล่น
   - ซูมเข้า/ออก: บีบนิ้ว 2 นิ้ว, ล้อเมาส์, หรือปุ่ม ＋ － ด้านขวา
   - เลื่อนแผนที่: ลากนิ้ว/เมาส์ (มีแรงเฉื่อยตอนปล่อย) ปุ่ม ◎ = กลับมากึ่งกลางเกาะ
   - สัตว์เดินด้วยความเร็วคงที่ เฉพาะบนสนามหญ้าเท่านั้น (ใช้แผนที่ตารางที่ทำจากภาพ เลี่ยงต้นไม้ รั้ว บ่อน้ำ ขอบเกาะ)
   - พิกัดทั้งหมดเป็นพิกัด "โลก" = พิกัดพิกเซลของ Grass.png (1536x1024); สัตว์อ้างอิงที่ตำแหน่งเท้า
   ไม่ต้องแก้ style.css — โมดูลฉีด CSS และสร้างแผนที่เองใน #scene (ย้าย #petsContainer เข้าไปในโลก) */
(function(){
'use strict';

const W = 1536, H = 1024;               // ขนาดโลก = ขนาดภาพ
const CELL = 16, GW = 96, GH = 64;      // แผนที่เดินได้: ตาราง 96x64 ช่อง ช่องละ 16px

/* ====== ปรับแต่งได้ ====== */
const PET_K     = 1.5;                  // ขนาดสัตว์เทียบกับของเดิม (ใหญ่ขึ้น = เกาะดูเล็กลง)
const Z_INIT    = .55;                  // ระดับซูมตอนเริ่ม
const Z_MAX     = 1.3;                  // ซูมเข้าได้สูงสุด (ซูมออกสุด = เห็นทั้งเกาะ)
const WALK_SPEED = 62;                  // ความเร็วเดินเล่น (px โลก ต่อวินาที)
const RUN_SPEED  = 130;                 // ความเร็วตอนวิ่งไปกินข้าว/น้ำ

// 1 = เดินได้ — ทำจากสีสนามหญ้าของ Grass.png เว้นระยะจากขอบ/ต้นไม้/พุ่มไม้/บ่อน้ำ (แถวละ 96 บิต = hex 24 ตัว)
const ROWS = [
  '000000000000000000000000','000000000000000000000000','000000000000000000000000','000000000000000000000000',
  '000000000000000000000000','000000000000000000000000','000000000000000000000000','000000000000000000000000',
  '000000000000000000000000','000000000000000000000000','000000000000000000000000','000000000000000000000000',
  '00000000003fff8000000000','0000000001ffffe000000000','0000000007fffff000000000','000000007ffffff800000000',
  '0000000ffffffff804000000','0000301ffffffffc0f000000','0000ffffffffffff3e000000','0000fffffffffffffc000000',
  '0000fffffffffffffc000000','0000fffffffffffffe000000','0001fffffffffffffe000000','0007ffffffffffffff000000',
  '000fffffffffffffffc00000','0007ffffffffffffffe00000','0001fffffffffffffff80000','00007fffffffffffffff0000',
  '00007fffffffffffffffe000','00007ffffffffffffffff800','000000fffffffffffffffe00','0000007ffffffffffffffe00',
  '0000003ffffffffffffffe00','0000001ffffffffffffffc00','0000000ffffffffffffff800','0000000fffffffffffff8000',
  '0000000ffffffffffffe0000','0000000ffffffffffffe0000','0000000ffffffffffff80000','0000000ffffffffffe300000',
  '00000003fffffffffc000000','000000010ffffffff8000000','0000000007fffffff0000000','0000000003fffffff0000000',
  '0000000001ffffffe0000000','0000000001ffffffe0000000','0000000001ffffffe0000000','0000000001ffc1fc00000000',
  '00000000007f81f000000000','00000000003f800000000000','00000000000c000000000000','000000000000000000000000',
  '000000000000000000000000','000000000000000000000000','000000000000000000000000','000000000000000000000000',
  '000000000000000000000000','000000000000000000000000','000000000000000000000000','000000000000000000000000',
  '000000000000000000000000','000000000000000000000000','000000000000000000000000','000000000000000000000000'
];
function decodeRows(rows){
  const g = new Uint8Array(GW*GH);
  rows.forEach((hex, y) => {
    for (let i=0; i<24; i++){
      const v = parseInt(hex[i], 16);
      for (let b=0; b<4; b++) g[y*GW + i*4 + b] = (v >> (3 - b)) & 1;
    }
  });
  return g;
}

/* ====== เกาะที่มีให้เลือก (id = ชื่อไฟล์ = id ไอเท็มในร้านค้า) ======
   เพิ่มเกาะใหม่: วางรูปไว้ใน Background/ แล้วเพิ่มบรรทัดที่นี่ + ไอเท็มใน SHOP_ITEMS (script.js)
   rows = แผนที่เดินได้ของเกาะนั้น, center = จุดกึ่งกลางสนาม/จุดเกิด, bowl = จุดรวมตัวตอนให้อาหาร/น้ำ */
// ตำแหน่งชามอาหาร/น้ำบนเกาะ (พิกัดโลก = จุดกึ่งกลางด้านล่างของชาม) — bowl = จุดที่สัตว์มายืนรวมกัน (อยู่หลังชามเล็กน้อย)
const BOWLS_DEFAULT = { food:{ x:712, y:664 }, water:{ x:848, y:664 } };
const ISLANDS = {
  'Grass.png':  { img:'Background/Grass.png',  rows:ROWS, center:{ x:760, y:470 }, bowl:{ x:780, y:590 }, bowls:BOWLS_DEFAULT },
  // ⚠️ Cherry: ตอนนี้ยืมแผนที่เดินได้ของ Grass ไปก่อน (ยังไม่มีรูป Cherry.png ให้ทำแผนที่จริง) → ต้องเปลี่ยน rows ให้ตรงรูป
  'Cherry.png': { img:'Background/Cherry.png', rows:ROWS, center:{ x:760, y:470 }, bowl:{ x:780, y:590 }, bowls:BOWLS_DEFAULT },
  // ⚠️ เกาะใหม่ทุกเกาะ: ยืมแผนที่เดินได้ของ Grass ไปก่อน (ขนาดภาพต้อง 1536x1024 เท่ากันหมด) → ถ้าผังเกาะต่างจาก Grass ให้ทำ rows/center/bowl ใหม่ให้ตรงรูป
  'Stone.png':   { img:'Background/Stone.png', rows:ROWS, center:{ x:760, y:470 }, bowl:{ x:780, y:590 }, bowls:BOWLS_DEFAULT },
  'Ice.png':     { img:'Background/Ice.png', rows:ROWS, center:{ x:760, y:470 }, bowl:{ x:780, y:590 }, bowls:BOWLS_DEFAULT },
  'Pirate.png':  { img:'Background/Pirate.png', rows:ROWS, center:{ x:760, y:470 }, bowl:{ x:780, y:590 }, bowls:BOWLS_DEFAULT },
  'Candy.png':   { img:'Background/Candy.png', rows:ROWS, center:{ x:760, y:470 }, bowl:{ x:780, y:590 }, bowls:BOWLS_DEFAULT },
  'Gem.png':     { img:'Background/Gem.png', rows:ROWS, center:{ x:760, y:470 }, bowl:{ x:780, y:590 }, bowls:BOWLS_DEFAULT },
  'Celestial.png':{ img:'Background/Celestial.png', rows:ROWS, center:{ x:760, y:470 }, bowl:{ x:780, y:590 }, bowls:BOWLS_DEFAULT },
  'Hell.png':    { img:'Background/Hell.png', rows:ROWS, center:{ x:760, y:470 }, bowl:{ x:780, y:590 }, bowls:BOWLS_DEFAULT }
};
const DEFAULT_ISLAND = 'Grass.png';

const CSS = `
.islandView{ position:absolute; inset:0; overflow:hidden; touch-action:none; cursor:grab; -webkit-user-select:none; user-select:none; }
.islandView.dragging{ cursor:grabbing; }
#scene::before, #visitScene::before{ z-index:1; }
.islandWorld{ position:absolute; left:0; top:0; width:${W}px; height:${H}px; transform-origin:0 0; will-change:transform; }
.islandImg{ position:absolute; inset:0; width:100%; height:100%; display:block; pointer-events:none; -webkit-user-drag:none; user-select:none; }
.islandWorld .avatar-container{
  transform:scale(calc(var(--pet-scale,1) * var(--depth-scale,${PET_K})));
  transform-origin:50% 100%; transition:transform .3s;
}
.islandWorld .avatar-container.baby{ transform:scale(calc(var(--pet-scale,1) * var(--depth-scale,${PET_K}) * .7)); }
.islandWorld .world-bowl{ position:absolute; z-index:6; margin:0; transform:translate(-50%,-100%); transform-origin:50% 100%; touch-action:none; -webkit-tap-highlight-color:transparent; }
.islandWorld .world-bowl img{ width:112px; height:auto; display:block; -webkit-user-drag:none; filter:drop-shadow(0 5px 5px rgba(0,0,0,.28)); }
.islandWorld .world-bowl:active{ transform:translate(-50%,-100%) scale(.9); }
.islandCtl{ position:absolute; right:10px; top:50%; transform:translateY(-50%); z-index:12; display:flex; flex-direction:column; gap:8px; }
.islandCtl button{
  width:40px; height:40px; border-radius:50%; border:2px solid rgba(255,255,255,.9); cursor:pointer;
  background:rgba(255,249,238,.88); color:#3b3a45; font-size:20px; font-weight:600; line-height:1; padding:0;
  box-shadow:0 3px 8px rgba(0,0,0,.3); font-family:inherit;
}
.islandCtl button:active{ transform:scale(.9); }`;
let cssDone = false;
function injectCss(){
  if (cssDone || document.getElementById('islandCss')) { cssDone = true; return; }
  const st = document.createElement('style');
  st.id = 'islandCss'; st.textContent = CSS;
  (document.head || document.documentElement).appendChild(st);
  cssDone = true;
}

function createIsland(cfg){
cfg = Object.assign({ sceneId:'scene', petsId:'petsContainer', prefix:'world', worldId:'world', petPrefix:'pet_el_', controls:true, bowls:true }, cfg || {});
const PETP = cfg.petPrefix;
let curId = cfg.island || DEFAULT_ISLAND;
let grid = decodeRows(ISLANDS[curId].rows);
let CENTER = ISLANDS[curId].center, BOWL = ISLANDS[curId].bowl;

const clamp = (x,a,b) => Math.max(a, Math.min(b, x));
const $ = id => document.getElementById(id);

/* ================= แผนที่เดินได้ ================= */
function walkable(x, y){
  const cx = Math.floor(x/CELL), cy = Math.floor(y/CELL);
  if (cx < 0 || cy < 0 || cx >= GW || cy >= GH) return false;
  return grid[cy*GW + cx] === 1;
}

function clearLine(x0, y0, x1, y1){     // เส้นทางตรงต้องเดินได้ตลอด
  const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0)/10));
  for (let i=1; i<=n; i++){
    if (!walkable(x0 + (x1 - x0)*i/n, y0 + (y1 - y0)*i/n)) return false;
  }
  return true;
}

function nearestWalkable(x, y){
  if (walkable(x, y)) return { x, y };
  for (let r=12; r<=700; r+=12){
    for (let k=0; k<16; k++){
      const a = k/16*Math.PI*2, px = x + Math.cos(a)*r, py = y + Math.sin(a)*r;
      if (walkable(px, py)) return { x:px, y:py };
    }
  }
  return { x:CENTER.x, y:CENTER.y };
}

function pickWander(x, y, minD, maxD){  // สุ่มจุดเดินเล่นที่ไปถึงได้ด้วยเส้นตรง (แนวตั้งสั้นกว่าเพราะภาพเอียง)
  minD = minD || 140; maxD = maxD || 420;
  for (let t=0; t<18; t++){
    const a = Math.random()*Math.PI*2, d = minD + Math.random()*(maxD - minD);
    const tx = x + Math.cos(a)*d, ty = y + Math.sin(a)*d*.7;
    if (walkable(tx, ty) && clearLine(x, y, tx, ty)) return { x:tx, y:ty };
  }
  for (let t=0; t<10; t++){             // ติดมุมแคบ → ลองก้าวสั้น ๆ
    const a = Math.random()*Math.PI*2, d = 50 + Math.random()*70;
    const tx = x + Math.cos(a)*d, ty = y + Math.sin(a)*d*.7;
    if (walkable(tx, ty) && clearLine(x, y, tx, ty)) return { x:tx, y:ty };
  }
  return null;
}

function bowlTarget(){                  // จุดรอบ ๆ ชามอาหาร/น้ำ (ยืนหลังชาม ไม่ทับตัวชาม)
  for (let t=0; t<20; t++){
    const x = BOWL.x + (Math.random()*2 - 1)*105, y = BOWL.y + (Math.random()*2 - 1)*32;
    if (walkable(x, y)) return { x, y };
  }
  return nearestWalkable(BOWL.x, BOWL.y);
}

/* ================= สัตว์: ตำแหน่ง + การเดิน ================= */
const posCache = new Map();             // จำตำแหน่งสัตว์ไว้ เวลา renderPetsDOM ใหม่จะไม่วาร์ปกลับจุดเริ่ม
const movers = new Map();
let mvRaf = 0, mvLast = 0;

function spawnPos(index){
  const c = posCache.get(index);
  if (c && walkable(c.x, c.y)) return { x:c.x, y:c.y };
  const a = index*2.4 + .5, rad = 50 + (index*47) % 200;
  const p = nearestWalkable(CENTER.x + Math.cos(a)*rad, CENTER.y + Math.sin(a)*rad*.6);
  posCache.set(index, p);
  return { x:p.x, y:p.y };
}

function depthScale(y){                 // ไกล (บน) เล็กกว่า ใกล้ (ล่าง) ใหญ่กว่าเล็กน้อย ให้ดู 2.5D
  const t = clamp((y - 200)/600, 0, 1);
  return PET_K*(.86 + .26*t);
}

function place(idx, pInst, el){
  el = el || $(PETP + idx);
  if (!el) return;
  el.style.left = (pInst.x - 50) + 'px';   // กล่องสัตว์ 100x90 อ้างอิงที่เท้า (กึ่งกลางด้านล่าง)
  el.style.top  = (pInst.y - 90) + 'px';
  el.style.setProperty('--depth-scale', depthScale(pInst.y).toFixed(3));
  posCache.set(idx, { x:pInst.x, y:pInst.y });
}

function walkTo(idx, pInst, tx, ty, speed){
  const el = $(PETP + idx);
  if (!el || !pInst) return;
  pInst.targetX = tx; pInst.targetY = ty;
  let queue = [];
  if (!clearLine(pInst.x, pInst.y, tx, ty) && clearLine(pInst.x, pInst.y, CENTER.x, CENTER.y) && clearLine(CENTER.x, CENTER.y, tx, ty)){
    queue = [{ x:tx, y:ty }]; tx = CENTER.x; ty = CENTER.y;   // เส้นตรงชนต้นไม้/บ่อ → อ้อมผ่านกลางสนามก่อน
  }
  movers.set(idx, { pInst, tx, ty, queue, speed: speed || WALK_SPEED });
  el.classList.toggle('facing-left', tx < pInst.x);
  el.classList.add('walking');
  if (!mvRaf){ mvLast = performance.now(); mvRaf = requestAnimationFrame(tick); }
}

function tick(now){
  const dt = Math.min(.05, (now - mvLast)/1000); mvLast = now;
  movers.forEach((m, idx) => {
    const p = m.pInst, el = $(PETP + idx);
    if (!el){ movers.delete(idx); return; }
    const dx = m.tx - p.x, dy = m.ty - p.y, d = Math.hypot(dx, dy), step = m.speed*dt;
    if (d <= step){
      p.x = m.tx; p.y = m.ty;
      if (m.queue && m.queue.length){
        const n = m.queue.shift(); m.tx = n.x; m.ty = n.y;
        el.classList.toggle('facing-left', n.x < p.x);
      } else { movers.delete(idx); el.classList.remove('walking'); }
    } else {
      p.x += dx/d*step; p.y += dy/d*step;
    }
    place(idx, p, el);
  });
  mvRaf = movers.size ? requestAnimationFrame(tick) : 0;
}

function stopAll(){ movers.clear(); }
function isMoving(idx){ return movers.has(idx); }

/* ================= กล้อง (เลื่อน/ซูม) ================= */
let worldImg = null, scene = null, petsBox = null, view = null, world = null, built = false, camInit = false;
const cam = { x:0, y:0, z:Z_INIT };

function vp(){ return { w:scene.clientWidth, h:scene.clientHeight }; }
function zMin(){ const v = vp(); return Math.max(.05, Math.min(v.w/W, v.h/H)); }   // ซูมออกสุด = เห็นทั้งเกาะ

function clampCam(){
  const { w, h } = vp();
  cam.z = clamp(cam.z, zMin(), Z_MAX);
  const ww = W*cam.z, wh = H*cam.z, px = w*.12, py = h*.12;     // เผื่อขอบให้เห็นท้องฟ้านิดหน่อย
  cam.x = ww + 2*px <= w ? (w - ww)/2 : clamp(cam.x, w - ww - px, px);
  cam.y = wh + 2*py <= h ? (h - wh)/2 : clamp(cam.y, h - wh - py, py);
}

function apply(){
  clampCam();
  world.style.transform = `translate3d(${cam.x}px,${cam.y}px,0) scale(${cam.z})`;
}

function zoomAt(sx, sy, nz){            // ซูมโดยให้จุดใต้นิ้ว/เมาส์อยู่ที่เดิม
  nz = clamp(nz, zMin(), Z_MAX);
  const wx = (sx - cam.x)/cam.z, wy = (sy - cam.y)/cam.z;
  cam.z = nz; cam.x = sx - wx*nz; cam.y = sy - wy*nz;
  apply();
}

function centerOn(wx, wy, z){
  const { w, h } = vp();
  if (z) cam.z = z;
  clampCam();
  cam.x = w/2 - wx*cam.z; cam.y = h/2 - wy*cam.z;
  apply();
}

let anim = 0, glide = 0;
function cancelMotion(){ cancelAnimationFrame(anim); anim = 0; cancelAnimationFrame(glide); glide = 0; }

function animateTo(wx, wy, z, ms){      // เลื่อน+ซูมกล้องแบบนุ่ม ๆ
  cancelMotion();
  const { w, h } = vp();
  const z0 = cam.z, cx0 = (w/2 - cam.x)/cam.z, cy0 = (h/2 - cam.y)/cam.z, t0 = performance.now();
  z = clamp(z, zMin(), Z_MAX);
  (function step(now){
    const p = clamp((now - t0)/ms, 0, 1), e = p < .5 ? 2*p*p : 1 - Math.pow(-2*p + 2, 2)/2;
    cam.z = z0 + (z - z0)*e;
    const cx = cx0 + (wx - cx0)*e, cy = cy0 + (wy - cy0)*e;
    cam.x = w/2 - cx*cam.z; cam.y = h/2 - cy*cam.z;
    apply();
    anim = p < 1 ? requestAnimationFrame(step) : 0;
  })(t0);
}

function zoomButton(factor){
  const { w, h } = vp();
  animateTo((w/2 - cam.x)/cam.z, (h/2 - cam.y)/cam.z, cam.z*factor, 280);
}

function focusBowl(){                   // ตอนให้น้ำ/อาหาร พากล้องไปดูสัตว์ที่วิ่งมารวมกัน
  animateTo(BOWL.x, BOWL.y + 30, clamp(cam.z, .55, .9), 700);
}

function resetCamera(){ animateTo(CENTER.x, CENTER.y, Z_INIT, 450); }

/* ================= ท่าทางสัมผัส ================= */
function attachGestures(){
  const ptrs = new Map();
  let drag = null, pinch = null, moved = false, movedTimer = 0;

  const rect = () => view.getBoundingClientRect();

  view.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    cancelMotion();
    if (ptrs.size === 0){ moved = false; clearTimeout(movedTimer); }
    ptrs.set(e.pointerId, { x:e.clientX, y:e.clientY });
    if (ptrs.size === 1){
      drag = { id:e.pointerId, sx:e.clientX, sy:e.clientY, lx:e.clientX, ly:e.clientY, lt:performance.now(), vx:0, vy:0, active:false };
    } else if (ptrs.size === 2){
      const [a, b] = [...ptrs.values()], r = rect();
      const mx = (a.x + b.x)/2 - r.left, my = (a.y + b.y)/2 - r.top;
      pinch = { d0:Math.hypot(a.x - b.x, a.y - b.y) || 1, z0:cam.z, wx:(mx - cam.x)/cam.z, wy:(my - cam.y)/cam.z };
      drag = null; moved = true;
    }
  });

  view.addEventListener('pointermove', e => {
    if (!ptrs.has(e.pointerId)) return;
    ptrs.set(e.pointerId, { x:e.clientX, y:e.clientY });

    if (pinch && ptrs.size >= 2){
      const [a, b] = [...ptrs.values()], r = rect();
      const mx = (a.x + b.x)/2 - r.left, my = (a.y + b.y)/2 - r.top;
      const nz = clamp(pinch.z0*Math.hypot(a.x - b.x, a.y - b.y)/pinch.d0, zMin(), Z_MAX);
      cam.z = nz; cam.x = mx - pinch.wx*nz; cam.y = my - pinch.wy*nz;
      apply();
      return;
    }
    if (!drag || drag.id !== e.pointerId) return;
    if (!drag.active){
      if (Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) < 6) return;   // ขยับน้อยกว่านี้ = แค่แตะ
      drag.active = true; moved = true;
      view.classList.add('dragging');
      try { view.setPointerCapture(e.pointerId); } catch(_){}
    }
    const now = performance.now(), dt = Math.max(1, now - drag.lt);
    const dx = e.clientX - drag.lx, dy = e.clientY - drag.ly;
    cam.x += dx; cam.y += dy; apply();
    drag.vx = drag.vx*.6 + (dx/dt)*.4; drag.vy = drag.vy*.6 + (dy/dt)*.4;
    drag.lx = e.clientX; drag.ly = e.clientY; drag.lt = now;
  });

  function release(e){
    if (!ptrs.has(e.pointerId)) return;
    ptrs.delete(e.pointerId);
    if (pinch && ptrs.size < 2) pinch = null;
    if (ptrs.size === 1){               // ปล่อยนิ้วหนึ่งตอนบีบ → ลากต่อด้วยอีกนิ้วโดยไม่กระโดด
      const [id, p] = [...ptrs.entries()][0];
      drag = { id, sx:p.x, sy:p.y, lx:p.x, ly:p.y, lt:performance.now(), vx:0, vy:0, active:true };
    } else if (ptrs.size === 0){
      view.classList.remove('dragging');
      const d = drag; drag = null;
      if (d && d.active && Math.hypot(d.vx, d.vy) > .05) startGlide(d.vx, d.vy);
      movedTimer = setTimeout(() => { moved = false; }, 60);
    }
  }
  view.addEventListener('pointerup', release);
  view.addEventListener('pointercancel', release);

  // ลากแล้วปล่อยตรงสัตว์ → อย่าให้นับเป็นการแตะสัตว์ (ไม่งั้นหัวใจเด้ง/ใช้ไอเทมโดยไม่ตั้งใจ)
  view.addEventListener('click', e => { if (moved){ e.stopPropagation(); e.preventDefault(); } }, true);

  view.addEventListener('wheel', e => {
    e.preventDefault();
    cancelMotion();
    const r = rect();
    zoomAt(e.clientX - r.left, e.clientY - r.top, cam.z*Math.exp(-e.deltaY*.0016));
  }, { passive:false });

  view.addEventListener('dblclick', e => {   // ดับเบิลคลิกพื้นที่ว่าง (เมาส์) = ซูมเข้าตรงนั้น
    if (e.target.closest && e.target.closest('.avatar-container')) return;
    const r = rect();
    animateTo((e.clientX - r.left - cam.x)/cam.z, (e.clientY - r.top - cam.y)/cam.z, cam.z*1.5, 300);
  });
}

function startGlide(vx, vy){            // แรงเฉื่อยหลังลากแล้วปล่อย
  cancelAnimationFrame(glide);
  let last = performance.now();
  (function step(now){
    const dt = Math.min(40, now - last); last = now;
    cam.x += vx*dt; cam.y += vy*dt;
    const k = Math.exp(-dt/260); vx *= k; vy *= k;
    apply();
    glide = Math.hypot(vx, vy) > .02 ? requestAnimationFrame(step) : 0;
  })(last);
}

/* ================= สร้างหน้าจอ ================= */


function build(){
  if (built) return true;
  scene = $(cfg.sceneId); petsBox = $(cfg.petsId);
  if (!scene || !petsBox) return false;

  injectCss();

  view = document.createElement('div'); view.id = cfg.prefix + 'View'; view.className = 'islandView';
  world = document.createElement('div'); world.id = cfg.worldId; world.className = 'islandWorld';
  const img = new Image();
  img.className = 'islandImg'; worldImg = img; img.src = ISLANDS[curId].img; img.alt = ''; img.draggable = false;
  world.appendChild(img);
  world.appendChild(petsBox);           // ย้ายคอกสัตว์เข้าไปอยู่ในโลก (ซูม/เลื่อนไปพร้อมแผนที่)
  const props = cfg.bowls ? scene.querySelector('.pet-props') : null;   // ปุ่มชามเดิม (อาหาร, น้ำ ตามลำดับใน HTML) → ย้ายมาวางบนเกาะ
  if (props){
    const btns = props.querySelectorAll('.bowl-btn');
    if (btns[0]){ btns[0].classList.add('world-bowl'); btns[0].dataset.bowl = 'food';  world.appendChild(btns[0]); }
    if (btns[1]){ btns[1].classList.add('world-bowl'); btns[1].dataset.bowl = 'water'; world.appendChild(btns[1]); }
    props.style.display = 'none';
  }
  view.appendChild(world);
  scene.insertBefore(view, scene.firstChild);

  const ctl = document.createElement('div'); ctl.className = 'islandCtl';
  [['＋', 'ซูมเข้า', () => zoomButton(1.35)], ['－', 'ซูมออก', () => zoomButton(1/1.35)], ['◎', 'กลับกึ่งกลางเกาะ', resetCamera]]
    .forEach(([txt, label, fn]) => {
      const b = document.createElement('button');
      b.type = 'button'; b.textContent = txt; b.setAttribute('aria-label', label);
      b.addEventListener('click', e => { e.stopPropagation(); fn(); });
      ctl.appendChild(b);
    });
  if (cfg.controls) scene.appendChild(ctl);

  placeBowls();
  attachGestures();

  const onSize = () => {
    if (!scene.clientWidth) return;
    if (!camInit){ camInit = true; centerOn(CENTER.x, CENTER.y, Z_INIT); }
    else apply();
  };
  if (window.ResizeObserver) new ResizeObserver(onSize).observe(scene);
  window.addEventListener('resize', onSize);
  onSize();

  built = true;
  return true;
}

function ready(){ return build(); }

function placeBowls(){
  const b = ISLANDS[curId].bowls || BOWLS_DEFAULT;
  ['food', 'water'].forEach(k => {
    const el = world && world.querySelector('.world-bowl[data-bowl="' + k + '"]');
    if (el && b[k]){ el.style.left = b[k].x + 'px'; el.style.top = b[k].y + 'px'; }
  });
}

function setIsland(id){                 // เปลี่ยนเกาะ → true ถ้าเปลี่ยนจริง (ผู้เรียกควร render สัตว์ใหม่)
  if (!ISLANDS[id]) id = DEFAULT_ISLAND;
  if (id === curId) return false;
  curId = id;
  const c = ISLANDS[id];
  grid = decodeRows(c.rows); CENTER = c.center; BOWL = c.bowl;
  posCache.clear(); movers.clear();     // ตำแหน่งเดิมใช้กับเกาะใหม่ไม่ได้
  if (built){
    worldImg.src = c.img;
    placeBowls();
    cancelMotion();
    if (scene.clientWidth) centerOn(CENTER.x, CENTER.y, Z_INIT); else camInit = false;
  }
  return true;
}

function current(){ return curId; }


function resetPets(){ posCache.clear(); movers.clear(); }
function recenter(){ if (built && scene.clientWidth) centerOn(CENTER.x, CENTER.y, Z_INIT); else camInit = false; }
return {
  ready, place, spawnPos, walkTo, stopAll, isMoving,
  pickWander, bowlTarget, nearestWalkable, walkable,
  focusBowl, resetCamera, centerOn, recenter, resetPets, setIsland, bowlFoot:() => (ISLANDS[curId].bowls || BOWLS_DEFAULT), current, ISLAND_IDS:Object.keys(ISLANDS),
  RUN_SPEED, WALK_SPEED
};
}   // end createIsland

/* ชุดหลัก = เกาะบ้านเรา (#scene) · ชุดเยี่ยมบ้านสร้างตอนเปิดดูบ้านเพื่อนครั้งแรก (ไม่มีปุ่มซูม/ชาม) */
window.createIsland = createIsland;
window.Island = createIsland({ sceneId:'scene', petsId:'petsContainer', prefix:'world', worldId:'world', petPrefix:'pet_el_', controls:true, bowls:true });

})();