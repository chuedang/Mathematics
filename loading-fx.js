/* ✨ LoadingFX — เอฟเฟคหน้าโหลดทั้งหมดของเกม รวมไว้ไฟล์เดียว (แทน battle-loading.js + bounce-loading.js)
   ไม่ต้องแก้ index.html / style.css — โมดูลฉีด CSS และสร้างหน้าจอเองใน #battleScreen

   1) ⚪⚪⚪ ลูกบอลเด้ง 3 ลูก (ฝังในหน้า วางไว้เหนือข้อความ ไม่บังข้อความ)
        el.innerHTML = LoadingFX.balls('กำลังโหลดอันดับ...', { color:'#ff6b81', textStyle:'color:#7f8c8d' });
        // opts: color (สีบอล, ค่าเริ่มต้นขาว) | textStyle (CSS ของข้อความ) | size ('sm' | 'md')

   2) 💡 แสงชมพู/ฟ้าวิ่งไล่จับกัน → ประจบ "ตู้ม" → ขึ้นผลการต่อสู้  (ใช้ตอนรอผลการต่อสู้ — API เดิมไม่เปลี่ยน)
        BattleLoading.start();  BattleLoading.finish(() => {...});  BattleLoading.cancel();
        BattleLoading.run(promise, res => ..., err => ...);

   3) 🚀 พุ่งเข้าสนาม มุมมองบุคคลที่ 1 ความเร็วสูง (ใช้ตอนกดท้าดวล แล้วรอเข้าสนาม) — API เหมือนกันกับข้อ 2
        ArenaDash.start();  await ArenaDash.finish(() => { แสดงสนาม });  ArenaDash.cancel();
        ArenaDash.run(promise, res => ..., err => ...);

   finish() คืน Promise ที่ resolve เมื่อแสงจางหมดแล้ว และเรียก callback ตอนจอขาวเต็ม (ตอนนั้นเปลี่ยนหน้าข้างหลังได้เนียน) */
(function(){
'use strict';

/* ================= ค่าที่ใช้ร่วมกัน ================= */
const COL_A = [255,107,129];            // ชมพู
const COL_B = [77,210,255];             // ฟ้า
const T_HOLD = 120;                     // ms ค้างขาว
const T_FADE = 650;                     // ms แสงจางหาย เผยหน้าจอข้างหลัง

const rgba  = (c,a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const clamp = (x,a,b) => Math.max(a, Math.min(b, x));
const easeIn  = p => p*p*p;
const easeOut = p => 1 - Math.pow(1-p, 3);
const wrapPi  = a => Math.atan2(Math.sin(a), Math.cos(a));

/* ================= 1) ลูกบอลเด้ง 3 ลูก (inline) ================= */
const BALL_CSS = `
.lfx-loader{ --lfx-color:#fff; --lfx-d:20px; --lfx-h:44px; --lfx-t:1s;
  display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; padding:10px 0; }
.lfx-loader.sm{ --lfx-d:14px; --lfx-h:30px; }
.lfx-balls{ display:flex; gap:20px; align-items:flex-end; }
.lfx-col{ position:relative; width:var(--lfx-d); height:calc(var(--lfx-h) + var(--lfx-d)); }
.lfx-ball{ position:absolute; left:0; bottom:0; width:100%; height:var(--lfx-d); border-radius:50%;
  background:var(--lfx-color); box-shadow:0 2px 8px rgba(0,0,0,.28), 0 0 0 1px rgba(0,0,0,.06);
  transform-origin:50% 100%; will-change:transform;
  animation:lfx-hop var(--lfx-t) infinite backwards; animation-delay:calc(var(--i) * .13s); }
.lfx-shadow{ position:absolute; left:0; right:0; bottom:-7px; height:6px; border-radius:50%;
  background:rgba(0,0,0,.35); filter:blur(1.5px);
  animation:lfx-shadow var(--lfx-t) infinite backwards; animation-delay:calc(var(--i) * .13s); }
.lfx-text{ font-size:14px; text-align:center; }
@keyframes lfx-hop{
  0%  { transform:translateY(0) scale(1.45,.6); animation-timing-function:cubic-bezier(.2,.75,.35,1); }
  46% { transform:translateY(calc(var(--lfx-h) * -1)) scale(1,1); animation-timing-function:cubic-bezier(.6,0,.85,.4); }
  90% { transform:translateY(0) scale(.9,1.12); animation-timing-function:cubic-bezier(.3,.6,.5,1); }
  100%{ transform:translateY(0) scale(1.45,.6); }
}
@keyframes lfx-shadow{
  0%  { transform:scale(1.35,1); opacity:.4;  animation-timing-function:cubic-bezier(.2,.75,.35,1); }
  46% { transform:scale(.45,.7); opacity:.12; animation-timing-function:cubic-bezier(.6,0,.85,.4); }
  90% { transform:scale(1,1);    opacity:.32; animation-timing-function:cubic-bezier(.3,.6,.5,1); }
  100%{ transform:scale(1.35,1); opacity:.4; }
}
@keyframes lfx-fade{ 0%,100%{ opacity:.35; } 50%{ opacity:1; } }
@media (prefers-reduced-motion:reduce){
  .lfx-ball{ animation:lfx-fade 1.2s ease-in-out infinite; animation-delay:calc(var(--i) * .2s); }
  .lfx-shadow{ display:none; }
}`;

function injectCss(){
  if (document.getElementById('lfxCss')) return;
  const s = document.createElement('style');
  s.id = 'lfxCss'; s.textContent = BALL_CSS;
  (document.head || document.documentElement).appendChild(s);
}

function balls(text, opts){
  injectCss();
  opts = opts || {};
  const cols = [0,1,2].map(i => `<div class="lfx-col" style="--i:${i}"><i class="lfx-ball"></i><i class="lfx-shadow"></i></div>`).join('');
  return `<div class="lfx-loader${opts.size === 'sm' ? ' sm' : ''}" role="status" style="--lfx-color:${opts.color || '#fff'}">` +
           `<div class="lfx-balls">${cols}</div>` +
           (text ? `<div class="lfx-text" style="${opts.textStyle || ''}">${text}</div>` : '') +
         `</div>`;
}

/* ================= เครื่องยนต์หน้าจอ canvas (ใช้ร่วมกัน 2 โหมด: chase / dash) ================= */
let root = null, cv = null, g = null, raf = 0, st = null;

function reduced(){
  try { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }
  catch(e){ return false; }
}

function ensure(){
  if (root && root.isConnected) return;
  root = document.createElement('div');
  root.id = 'battleLoadOverlay';
  const host = document.getElementById('battleScreen');
  // z-index สูงกว่าการ์ดผล (200) เพื่อให้แสงขาวบังการ์ดตอนที่ผลโผล่ขึ้นมา แล้วค่อยจางเผยผล
  // (ชั้นนี้รับการแตะไว้ด้วย → ระหว่างโหลดกดซ้ำไม่ได้)
  root.style.cssText = `position:${host ? 'absolute' : 'fixed'};inset:0;z-index:300;touch-action:none;display:none;`;
  cv = document.createElement('canvas');
  cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';
  root.appendChild(cv);
  (host || document.body).appendChild(root);
  g = cv.getContext('2d');
}

function resize(){
  const dpr = window.devicePixelRatio || 1, w = root.clientWidth || 480, h = root.clientHeight || 800;
  const pw = Math.round(w*dpr), ph = Math.round(h*dpr);
  if (cv.width !== pw || cv.height !== ph){ cv.width = pw; cv.height = ph; }
  g.setTransform(dpr,0,0,dpr,0,0);
  return { w, h };
}

function settle(){                      // ปิดหน้าโหลดแล้ว resolve promise ของ finish()
  cancelAnimationFrame(raf); raf = 0;
  if (root) root.style.display = 'none';
  const req = st && st.req; st = null;
  if (req) req.resolve();
}

function start(mode){
  if (st && !st.req) return;            // กำลังโหลดอยู่แล้ว
  if (st) settle();
  ensure();
  root.style.display = 'block';
  const now = performance.now();
  st = { mode, t0:now, last:now, tp:now, phase:'load', parts:[], req:null, cbDone:false, reduce:reduced() };
  if (st.reduce){                       // ผู้ใช้ปิดแอนิเมชัน: แค่หรี่จอ ไม่มีเอฟเฟค
    root.style.background = 'rgba(4,6,18,.85)';
    return;
  }
  root.style.background = 'transparent';
  const { w, h } = resize();
  MODES[mode].init(w, h);
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(frame);
}

function finish(cb){
  return new Promise(resolve => {
    if (!st){ try { cb && cb(); } catch(e){ console.error(e); } resolve(); return; }
    if (st.req){ resolve(); return; }
    st.req = { cb, resolve };
    if (st.reduce){
      try { cb && cb(); } catch(e){ console.error(e); }
      settle();
    }
  });
}

function cancel(){
  if (!st) { if (root) root.style.display = 'none'; return; }
  settle();
}

function runTask(mode, task, onResult, onError){
  start(mode);
  return Promise.resolve(task).then(
    res => finish(() => { if (onResult) onResult(res); }),
    err => { cancel(); if (onError) onError(err); else throw err; }
  );
}

function whiteWash(a, w, h){ g.fillStyle = `rgba(255,255,255,${clamp(a,0,1)})`; g.fillRect(0,0,w,h); }

function spawnBurst(){
  st.parts = [];
  for (let i=0;i<44;i++){
    const a = Math.random()*Math.PI*2, sp = .25 + Math.random()*.9;
    st.parts.push({ a, sp, r:0, col: i%2 ? COL_A : COL_B, size:2 + Math.random()*3 });
  }
}

/* ================= โหมด chase: แสงชมพู/ฟ้าวิ่งไล่จับกันทั่วจอ ================= */
const SPEED   = .0009;                  // ความเร็วพื้นฐาน (เท่าของด้านสั้นของจอ ต่อ ms)
const TURN    = .0062;                  // อัตราเลี้ยว rad/ms
const CHASE_K = 1.12;                   // ผู้ไล่เร็วกว่าผู้หนีกี่เท่า
const CATCH_R = .045;                   // ระยะที่ถือว่า "จับได้" (เท่าของด้านสั้นของจอ)
const TAG_COOL = 900;                   // ms หลังจับได้ ห้ามจับซ้ำทันที
const N_TRAIL = 46;                     // จำนวนจุดหางของแสง

function initChase(w, h){
  const cx = w/2, cy = h/2, R = Math.min(w,h)*.15;
  st.ag = [COL_A, COL_B].map((col, i) => {
    const a = -Math.PI/2 + i*Math.PI;
    return { col, x:cx + Math.cos(a)*R, y:cy + Math.sin(a)*R, hd:a + Math.PI/2,
             boost:1, trail:[], seed:Math.random()*100, mr:0, ma:0, md:1 };
  });
  st.runner = 0; st.cool = 500; st.chaseT = 0; st.sparks = [];
}

function pushTrail(a){
  a.trail.push({ x:a.x, y:a.y });
  if (a.trail.length > N_TRAIL) a.trail.shift();
}

function steer(a, ang, spd, dt, w, h, m){
  const diff = wrapPi(ang - a.hd);
  a.hd += clamp(diff, -TURN*dt, TURN*dt);
  a.x = clamp(a.x + Math.cos(a.hd)*spd*dt, m, w - m);
  a.y = clamp(a.y + Math.sin(a.hd)*spd*dt, m, h - m);
  pushTrail(a);
}

function stepChase(dt, el, w, h){
  const S = Math.min(w,h), m = S*.04, cx = w/2, cy = h/2;
  const base = S*SPEED*(1 + clamp(el/4000,0,1)*.45);
  const run = st.ag[st.runner], chs = st.ag[1 - st.runner];
  st.cool = Math.max(0, st.cool - dt);
  st.chaseT += dt;
  st.ag.forEach(a => { a.boost += (1 - a.boost)*clamp(dt/450, 0, 1); });

  const dx = run.x - chs.x, dy = run.y - chs.y, dist = Math.hypot(dx,dy) || 1;

  const spdC = base*CHASE_K*(1 + clamp(st.chaseT/5000, 0, .5))*chs.boost;
  const lead = clamp(dist/spdC, 0, 450)*.35;
  const tx = run.x + Math.cos(run.hd)*base*lead, ty = run.y + Math.sin(run.hd)*base*lead;
  steer(chs, Math.atan2(ty - chs.y, tx - chs.x), spdC, dt, w, h, m);

  const wd = run.hd + Math.sin(el/310 + run.seed)*.8 + Math.sin(el/730 + run.seed*2)*.6;
  const away = Math.atan2(-dy, -dx);
  const fw = clamp(1 - dist/(S*.55), 0, 1)*1.8;
  const px = clamp((m*4 - Math.min(run.x, w - run.x))/(m*4), 0, 1);
  const py = clamp((m*4 - Math.min(run.y, h - run.y))/(m*4), 0, 1);
  const ww = Math.max(px,py)*3, tc = Math.atan2(cy - run.y, cx - run.x);
  const vx = Math.cos(wd) + Math.cos(away)*fw + Math.cos(tc)*ww;
  const vy = Math.sin(wd) + Math.sin(away)*fw + Math.sin(tc)*ww;
  steer(run, Math.atan2(vy, vx), base*run.boost, dt, w, h, m);

  if (dist < S*CATCH_R && st.cool <= 0){          // จับได้! สลับบท
    st.sparks.push({ x:(run.x + chs.x)/2, y:(run.y + chs.y)/2, t:0 });
    st.runner = 1 - st.runner;
    st.cool = TAG_COOL; st.chaseT = 0;
    st.ag[st.runner].boost = 1.7;
    st.ag[1 - st.runner].boost = .5;
  }
}

function drawSparks(dt, S){
  st.sparks = st.sparks.filter(s => (s.t += dt) < 450);
  st.sparks.forEach(s => {
    const q = s.t/450, rr = easeOut(q)*S*.13;
    g.strokeStyle = `rgba(255,255,255,${(1-q)*.85})`; g.lineWidth = 1 + 4*(1-q);
    g.beginPath(); g.arc(s.x, s.y, Math.max(1, rr), 0, 7); g.stroke();
    const sg = g.createRadialGradient(s.x,s.y,0,s.x,s.y,S*.07);
    sg.addColorStop(0, `rgba(255,255,255,${(1-q)*.8})`); sg.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = sg; g.beginPath(); g.arc(s.x, s.y, S*.07, 0, 7); g.fill();
  });
}

function drawLight(a, headK){
  const t = a.trail, n = t.length;
  if (!n) return;
  g.lineCap = 'round';
  for (let i=1; i<n; i++){
    const f = i/(n-1);
    g.strokeStyle = rgba(a.col, .8*f*f);
    g.lineWidth = Math.max(1.2, (2 + 4.5*f)*headK*(.6 + .4*f)*1.6);
    g.beginPath(); g.moveTo(t[i-1].x, t[i-1].y); g.lineTo(t[i].x, t[i].y); g.stroke();
  }
  const hx = t[n-1].x, hy = t[n-1].y, hr = 16*headK;
  const hg = g.createRadialGradient(hx,hy,0,hx,hy,hr);
  hg.addColorStop(0, 'rgba(255,255,255,.95)'); hg.addColorStop(.25, rgba(a.col,.8)); hg.addColorStop(1, rgba(a.col,0));
  g.fillStyle = hg; g.beginPath(); g.arc(hx, hy, hr, 0, 7); g.fill();
}

function drawChase(c){
  let headK = 1;
  if (c.phase === 'load'){
    stepChase(c.dt, c.el, c.w, c.h);
  } else if (c.phase === 'merge'){
    const p = clamp(c.pe/this.tMerge, 0, 1), k = p*p*(3 - 2*p);
    const om = (Math.PI*2/1500)*(1 + 5*p);
    st.ag.forEach(a => {
      a.ma += a.md*om*c.dt;
      const r = a.mr*(1 - k);
      a.x = c.cx + Math.cos(a.ma)*r; a.y = c.cy + Math.sin(a.ma)*r;
      pushTrail(a);
    });
    headK = 1 + 1.4*p;
  }
  g.globalCompositeOperation = 'lighter';
  if (c.phase === 'load') drawSparks(c.dt, c.S);
  st.ag.forEach(a => drawLight(a, headK));
}

/* ================= โหมด dash: พุ่งเข้าสนาม มุมมองบุคคลที่ 1 ความเร็วสูง =================
   อุโมงค์กรอบนีออนสลับชมพู/ฟ้าพุ่งผ่านกล้อง + ดาวแสงเป็นเส้นพุ่งออกจากจุดหายตา
   + แสงประตูสนามที่ปลายอุโมงค์ ตอนโหลดเสร็จจะเร่งสุดแรงแล้วแสงประตูขยายกลืนทั้งจอ */
const N_RINGS = 10, N_STARS = 90;
const DASH_V  = .00062;                 // ความเร็วพุ่งพื้นฐาน (หน่วยความลึก z ต่อ ms)

function newStar(spread){
  return { a:Math.random()*Math.PI*2, r:.04 + Math.random()*.26, c:Math.random() < .5 ? COL_A : COL_B,
           z: spread ? .05 + Math.random()*.95 : 1 };
}

function initDash(){
  st.stars = Array.from({ length:N_STARS }, () => newStar(true));
  st.rings = Array.from({ length:N_RINGS }, (_, i) => ({ z:(i + 1)/N_RINGS, c:i % 2 ? COL_B : COL_A }));
}

function drawDash(c){
  const { w, h, cx, cy, S, diag, dt, el } = c;
  const merging = c.phase === 'merge';
  const p = merging ? clamp(c.pe/this.tMerge, 0, 1) : 0;

  // ความเร็ว: ออกตัวพุ่งจากนิ่ง ค่อย ๆ เร็วขึ้น แล้วเร่งสุดแรงตอนประจบ
  const acc = .4 + .6*easeOut(clamp(el/600, 0, 1));
  const boost = 1 + 5*p*p;
  const v = DASH_V*acc*(1 + clamp(el/4000, 0, 1)*.4)*boost;

  // กล้องสั่น/โคลงตัวตอนวิ่ง (ยิ่งเร็วยิ่งสั่น)
  const shk = (1 + boost*.5)*S*.0035;
  const ox = Math.sin(el/83)*shk + Math.sin(el/41)*shk*.5;
  const oy = Math.sin(el/121)*S*.007 + Math.sin(el/57)*shk*.5;
  const roll = Math.sin(el/900)*.018*(1 + p*2);

  g.save();
  g.translate(cx + ox, cy + oy); g.rotate(roll);           // จุดหายตา = (0,0) ใหม่
  g.globalCompositeOperation = 'lighter';
  g.lineCap = 'round'; g.lineJoin = 'round';

  // --- กรอบอุโมงค์ ---
  const Hh = S*.12;
  st.rings.forEach(r => {
    r.z -= v*dt;
    if (r.z < .05) r.z += 1;
    const sc = 1/r.z, half = Hh*sc;
    const a = clamp((1.04 - r.z)*3, 0, 1)*clamp(r.z/.09, 0, 1);
    if (a <= .01) return;
    const lw = 1.2 + 6*Math.pow(1 - r.z, 2);
    g.strokeStyle = rgba(r.c, a*.28); g.lineWidth = lw*2.8; g.strokeRect(-half, -half, half*2, half*2);
    g.strokeStyle = rgba(r.c, a*.95);  g.lineWidth = lw;     g.strokeRect(-half, -half, half*2, half*2);
  });

  // --- เส้นขอบอุโมงค์ (มุมทั้ง 4) ---
  g.lineWidth = 1;
  [[-1,-1],[1,-1],[1,1],[-1,1]].forEach(([sx, sy], i) => {
    g.strokeStyle = rgba(i % 2 ? COL_B : COL_A, .22);
    g.beginPath(); g.moveTo(sx*Hh, sy*Hh); g.lineTo(sx*Hh/.07, sy*Hh/.07); g.stroke();
  });

  // --- ดาวแสงพุ่งออกจากจุดหายตา (เส้นยาวตามความเร็ว) ---
  const trailMs = 110;
  st.stars.forEach((s, i) => {
    s.z -= v*dt;
    if (s.z < .03){ st.stars[i] = newStar(false); return; }
    const cs = Math.cos(s.a), sn = Math.sin(s.a), R = s.r*S;
    const z2 = Math.min(1.2, s.z + v*trailMs);
    const x1 = cs*R/z2, y1 = sn*R/z2, x2 = cs*R/s.z, y2 = sn*R/s.z;
    const al = Math.pow(1 - s.z, 1.2)*.95;
    g.strokeStyle = rgba(s.c, al); g.lineWidth = 1 + 2.5*(1 - s.z);
    g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke();
    g.strokeStyle = `rgba(255,255,255,${al*.6})`; g.lineWidth = Math.max(.8, (1 + 2.5*(1 - s.z))*.45);
    g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke();
  });

  // --- แสงประตูสนามที่ปลายอุโมงค์ (ตอนประจบ ขยายกลืนทั้งจอ) ---
  const g0 = S*.05*(1 + .15*Math.sin(el/160));
  const gr = g0 + (diag*1.15 - g0)*easeIn(p);
  const gg = g.createRadialGradient(0, 0, 0, 0, 0, gr);
  gg.addColorStop(0, 'rgba(255,255,255,1)');
  gg.addColorStop(.55, `rgba(${p > 0 ? '255,255,255' : '200,190,255'},${.95*(p > 0 ? 1 : .6)})`);
  gg.addColorStop(1, 'rgba(190,170,255,0)');
  g.fillStyle = gg; g.beginPath(); g.arc(0, 0, gr, 0, 7); g.fill();
  g.restore();

  // --- ขอบจอมืด (vignette) เพิ่มความรู้สึกพุ่ง จางหายตอนประจบ ---
  g.globalCompositeOperation = 'source-over';
  const vg = g.createRadialGradient(cx, cy, diag*.18, cx, cy, diag*.55);
  vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, `rgba(0,0,0,${.55*(1 - p)})`);
  g.fillStyle = vg; g.fillRect(0, 0, w, h);
}

/* ================= ตารางโหมด ================= */
const MODES = {
  chase: {
    tDark:700, tMin:1500, tMerge:800, tFlash:380,
    init: initChase,
    onMerge(c){                         // จดตำแหน่งเป็นพิกัดเชิงขั้ว เพื่อพุ่งก้นหอยเข้าศูนย์กลาง
      st.sparks = [];
      st.ag.forEach(a => {
        a.mr = Math.hypot(a.x - c.cx, a.y - c.cy);
        a.ma = Math.atan2(a.y - c.cy, a.x - c.cx);
        const tang = Math.cos(a.hd)*(-Math.sin(a.ma)) + Math.sin(a.hd)*Math.cos(a.ma);
        a.md = tang >= 0 ? 1 : -1;
      });
    },
    draw: drawChase,
    flash(c){                           // ตู้ม: แสงระเบิดจากจุดศูนย์กลางจนขาวเต็มจอ
      const { w, h, cx, cy, diag, dt } = c;
      const p = clamp(c.pe/this.tFlash, 0, 1), e = easeOut(p), rad = Math.max(1, e*diag*.9);
      const fg = g.createRadialGradient(cx,cy,0,cx,cy,rad);
      fg.addColorStop(0, 'rgba(255,255,255,1)'); fg.addColorStop(.7, 'rgba(255,255,255,.9)'); fg.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = fg; g.fillRect(0,0,w,h);
      [[COL_A,0],[COL_B,.08]].forEach(([col, lag]) => {            // คลื่นกระแทก 2 สี
        const q = clamp(p - lag, 0, 1), rr = easeOut(q)*diag*.55;
        g.strokeStyle = rgba(col, (1-q)*.9); g.lineWidth = 2 + 9*(1-q);
        g.beginPath(); g.arc(cx, cy, Math.max(1, rr), 0, 7); g.stroke();
      });
      st.parts.forEach(pt => {                                      // ประกายกระจาย
        pt.r += pt.sp*dt*(1.2 - p*.6);
        g.fillStyle = rgba(pt.col, (1-p)*.9);
        g.beginPath(); g.arc(cx + Math.cos(pt.a)*pt.r, cy + Math.sin(pt.a)*pt.r, pt.size*(1-p*.5), 0, 7); g.fill();
      });
      if (p > .75) whiteWash((p-.75)/.25, w, h);
    }
  },
  dash: {
    tDark:300, tMin:900, tMerge:650, tFlash:140,
    init: initDash,
    draw: drawDash,
    flash(c){ whiteWash(1, c.w, c.h); } // ประตูสนามกลืนจอไปแล้ว → ขาวเต็มจอทันที
  }
};

/* ================= ลูปหลัก ================= */
function frame(now){
  if (!st || st.reduce) return;
  const M = MODES[st.mode];
  const dt = Math.min(50, now - st.last); st.last = now;
  const { w, h } = resize();
  g.clearRect(0,0,w,h);
  const cx = w/2, cy = h/2, S = Math.min(w,h), R0 = S*.15, diag = Math.hypot(w,h);
  const el = now - st.t0;

  // ---- เลื่อนเฟส ----
  if (st.phase === 'load' && st.req && el >= M.tMin){
    st.phase = 'merge'; st.tp = now;
    if (M.onMerge) M.onMerge({ cx, cy, w, h });
  }
  if (st.phase === 'merge' && now - st.tp >= M.tMerge){ st.phase = 'flash'; st.tp = now; spawnBurst(); }
  if (st.phase === 'flash' && now - st.tp >= M.tFlash){
    st.phase = 'hold'; st.tp = now;
    if (!st.cbDone){ st.cbDone = true; try { st.req && st.req.cb && st.req.cb(); } catch(e){ console.error(e); } }
  }
  if (st.phase === 'hold' && now - st.tp >= T_HOLD){ st.phase = 'fade'; st.tp = now; }
  const pe = now - st.tp;

  // ---- ขั้นหลังแสงประจบ: มีแต่แสงขาว ----
  if (st.phase === 'hold'){ whiteWash(1, w, h); raf = requestAnimationFrame(frame); return; }
  if (st.phase === 'fade'){
    const p = clamp(pe/T_FADE, 0, 1);
    if (p >= 1){ settle(); return; }
    whiteWash(Math.pow(1-p, 1.6), w, h);
    raf = requestAnimationFrame(frame); return;
  }

  // ---- พื้นหลังมืดลง ----
  const dark = easeOut(clamp(el/M.tDark, 0, 1));
  g.fillStyle = `rgba(4,6,18,${.9*dark})`; g.fillRect(0,0,w,h);
  const glow = g.createRadialGradient(cx,cy,0,cx,cy,R0*3);
  glow.addColorStop(0, `rgba(120,110,255,${.16*dark})`); glow.addColorStop(1, 'rgba(120,110,255,0)');
  g.fillStyle = glow; g.fillRect(0,0,w,h);

  const c = { w, h, cx, cy, S, R0, diag, el, dt, now, pe, phase:st.phase };
  if (st.phase === 'flash'){
    g.globalCompositeOperation = 'lighter';
    M.flash(c);
  } else {
    M.draw.call(M, c);
  }
  g.globalCompositeOperation = 'source-over';
  raf = requestAnimationFrame(frame);
}

/* ================= ส่งออก ================= */
const BattleLoading = {                 // API เดิม (รอผลการต่อสู้) — ไม่ต้องแก้โค้ดที่เรียกใช้อยู่
  start:  () => start('chase'),
  finish, cancel,
  run: (task, ok, err) => runTask('chase', task, ok, err)
};
const ArenaDash = {                     // ใหม่: พุ่งเข้าสนามตอนกดท้าดวล
  start:  () => start('dash'),
  finish, cancel,
  run: (task, ok, err) => runTask('dash', task, ok, err)
};

injectCss();
window.BattleLoading = BattleLoading;
window.ArenaDash = ArenaDash;
window.LoadingFX = { balls, battle:BattleLoading, dash:ArenaDash };
})();
