const API_URL = "https://script.google.com/macros/s/AKfycbzTMBFqzbRJNZDIu4lJVUoxs5eTPdjx_YBMgVLxDZGO9sf0abToJgqOgyxwTsbQI0wmYQ/exec";

  // ⭐ สัตว์จะตาย (dead:true) เมื่อไม่ได้กินอาหารเกินกี่วัน (นับจากวันที่หมดอิ่ม = validUntil)
  //    ถ้ายังไม่เคยให้อาหารเลย จะนับจากวันที่สัตว์ตัวนั้นเกิด/ซื้อมาแทน
  const PET_DEAD_AFTER_DAYS = 10;

  // ⭐ การสุ่มป่วย: สัตว์จะเริ่มเสี่ยงป่วยเมื่อไม่ได้ให้น้ำครบ PET_SICK_NEGLECT_DAYS วัน
  //    สุ่มแยกทีละตัว วันละ 1 ครั้ง/ตัว (โอกาส PET_SICK_CHANCE_PER_DAY ต่อวันที่ละเลย) จึงไม่ป่วยพร้อมกันหมด
  const PET_SICK_NEGLECT_DAYS = 3;
  const PET_SICK_CHANCE_PER_DAY = 0.25;

  // ⭐ น้ำหนักการสุ่มชนิดสัตว์ตอนผสมพันธุ์ (ไม่ใส่ = 1) ตอนนี้ทุกชนิดมีโอกาสเท่ากัน
  const BREED_WEIGHTS = {};

  // ⭐ ข้อมูลสัตว์แต่ละชนิด: ชื่อ, ไฟล์ภาพ (โฟลเดอร์ Animals/), ชื่อไฟล์สกิล (โฟลเดอร์ Skills/)
  const PET_INFO = {
    cat:           { name: "แมว",              body: "cat_body.png",           leg: "cat_leg.png",           skill: "cat" },
    dog:           { name: "หมา",              body: "dog_body.png",           leg: "dog_leg.png",           skill: "dog" },
    giraffe:       { name: "ยีราฟ",            body: "giraffe_body.png",       leg: "giraffe_leg.png",       skill: "giraffe" },
    sheep:         { name: "แกะ",              body: "sheep_body.png",         leg: "sheep_leg.png",         skill: "sheep" },
    deer:          { name: "กวาง",             body: "deer_body.png",          leg: "deer_leg.png",          skill: "deer" },
    siberianhusky: { name: "ไซบีเรียนฮัสกี้",  body: "SiberianHusky_body.png", leg: "SiberianHusky_leg.png", skill: "siberianhusky" },
    elepant:       { name: "ช้าง",             body: "Elepant_body.png",       leg: "Elepant_leg.png",       skill: "Elepant" },
    bear:          { name: "หมี",              body: "bear_body.png",          leg: "bear_leg.png",          skill: "bear" },
    shiba:         { name: "ชิบะ",             body: "shiba_body.png",         leg: "shiba_leg.png",         skill: "shiba" },
    littledragon:  { name: "มังกรน้อย",        body: "littledragon_body.png",  leg: "littledragon_leg.png",  skill: "littledragon" },
    firedragon:    { name: "มังกรไฟ",          body: "firedragon_body.png",    leg: "firedragon_leg.png",    skill: "firedragon" }
  };

  // ⭐ ปรับขนาด/ตำแหน่งขา "แยกรายตัว" (ใช้ได้ทั้งในบ้านและหน้าต่อสู้)
  //    ค่าที่ไม่ใส่ = ค่าเริ่มต้นด้านล่าง   bl/br/fl/fr = ขาหลังซ้าย/หลังขวา/หน้าซ้าย/หน้าขวา เป็น [left, top] (px)
  //    scale = ขยายทั้งตัว (เฉพาะในบ้าน) legSize = [กว้าง, สูง] ของขา   ลองปรับด้วย pet-leg-editor.html แล้วก๊อปบรรทัดมาวางแทนได้เลย
  //    🧚 fairy = [x, y] ตำแหน่งมุมบนซ้ายของภูติในกรอบ 100x90 ของสัตว์ (สัตว์หันขวา) / fairySize = ขนาดภูติ (px)
  //       ใช้ในหน้าต่อสู้ — ฝั่งเพื่อน (กลับด้าน) จะสะท้อนตำแหน่ง x ให้อัตโนมัติ   ปรับด้วย pet-leg-editor.html
  const PET_LAYOUT_DEFAULT = { scale: 1, legSize: [34, 28], bl: [14, 65], br: [42, 65], fl: [10, 65], fr: [38, 65], fairy: [30, -28], fairySize: 40 };
  const PET_LAYOUT = {
    cat:           {fairy: [-33,-43], fairySize: 66},
    dog:           {fairy: [-33,-43], fairySize: 66},
    giraffe:       {legSize: [46,43], bl: [14,70], br: [42,70], fl: [10,70], fr: [38,70], fairy: [-33,-43], fairySize: 66},
    sheep:         {fairy: [-33,-43], fairySize: 66},
    deer:          {fairy: [-33,-43], fairySize: 66},
    siberianhusky: {legSize: [39,27], bl: [14,75], br: [42,75], fl: [10,75], fr: [38,75],fairy: [-33,-43], fairySize: 66},
    elepant:       {fairy: [-33,-43], fairySize: 66},
    bear:          {legSize: [33,41], bl: [9,50], br: [46,50], fl: [2,50], fr: [41,50],fairy: [-33,-43], fairySize: 66},
    shiba:         {fairy: [-33,-43], fairySize: 66},
    littledragon:  {legSize: [76,34], bl: [15,59], br: [39,59], fl: [10,59], fr: [35,59],fairy: [-33,-43], fairySize: 66},
    firedragon:    {scale: 2.2, legSize: [64,37], bl: [14,59], br: [42,59], fl: [10,59], fr: [38,59],fairy: [-33,-43], fairySize: 66}
  };

  function applyPetLayout(el, type) {
    if (!el) return;
    const L = Object.assign({}, PET_LAYOUT_DEFAULT, PET_LAYOUT[type] || {});
    const set = (k, v) => el.style.setProperty(k, v + "px");
    set("--leg-w", L.legSize[0]); set("--leg-h", L.legSize[1]);
    set("--bl-x", L.bl[0]); set("--bl-y", L.bl[1]);
    set("--br-x", L.br[0]); set("--br-y", L.br[1]);
    set("--fl-x", L.fl[0]); set("--fl-y", L.fl[1]);
    set("--fr-x", L.fr[0]); set("--fr-y", L.fr[1]);
    set("--fairy-size", L.fairySize);
    set("--fairy-x", L.fairy[0]); set("--fairy-y", L.fairy[1]);
    set("--fairy-xm", 100 - L.fairy[0] - L.fairySize);   // ตำแหน่ง x เมื่อกลับด้าน (ฝั่งเพื่อน)
    if (L.scale !== 1) { el.style.setProperty("--pet-scale", L.scale); el.style.transformOrigin = "50% 100%"; }
  }

  let SHOP_ITEMS = [
    { id: "cat", type: "pet", name: "น้องแมวสุดน่ารัก", price: 500, img: "Shop/cat_shop.png" },
    { id: "dog", type: "pet", name: "น้องหมาแสนรู้", price: 500, img: "Shop/dog_shop.png" },
    { id: "siberianhusky", type: "pet", name: "ไซบีเรียนฮัสกี้", price: 700, img: "Shop/SiberianHusky_shop.png" },
    { id: "shiba", type: "pet", name: "ชิบะอินุจอมซน", price: 700, img: "Shop/shiba_shop.png" },
    { id: "bear", type: "pet", name: "น้องหมีใจดี", price: 800, img: "Shop/bear_shop.png" },
    { id: "littledragon", type: "pet", name: "มังกรน้อยจอมพลัง", price: 900, img: "Shop/littledragon_shop.png" },
    // ช้าง (elepant) ไม่ขายในร้าน ได้จากการสุ่มผสมพันธุ์เท่านั้น
    // มังกรไฟ (firedragon) ไม่ขายในร้าน และผสมพันธุ์ไม่ได้ ได้จากวงล้อมินิเกมเท่านั้น
    { id: "vaccine", type: "medicine", name: "วัคซีนรักษาโรค", price: 150, img: "Shop/vaccine.png" },
    { id: "potion", type: "medicine", name: "ยาเร่งโตเต็มวัย", price: 200, img: "Shop/potion.png" },
    { id: "custard.png", type: "food", name: "คัสตาร์ด", price: 50, days: 1, img: "Foods/custard.png" },
    { id: "icecream.png", type: "food", name: "ไอศกรีม", price: 50, days: 1, img: "Foods/icecream.png" },
    { id: "pie.png", type: "food", name: "พาย", price: 90, days: 2, img: "Foods/pie.png" },
    { id: "chocolate.png", type: "food", name: "ช็อกโกแลต", price: 60, days: 1, img: "Foods/chocolate.png" },
    { id: "cake.png", type: "food", name: "เค้ก", price: 100, days: 2, img: "Foods/cake.png" },
    { id: "bread.png", type: "food", name: "ขนมปัง", price: 40, days: 1, img: "Foods/bread.png" },
    { id: "soup.png", type: "food", name: "ซุปอุ่นๆ", price: 80, days: 2, img: "Foods/soup.png" },
    { id: "pizza.png", type: "food", name: "พิซซ่า", price: 120, days: 3, img: "Foods/pizza.png" },
    { id: "salad.png", type: "food", name: "สลัดผัก", price: 50, days: 1, img: "Foods/salad.png" },
    { id: "grilchicken.png", type: "food", name: "ไก่ย่าง", price: 130, days: 3, img: "Foods/grilchicken.png" },
    { id: "pancake.png", type: "food", name: "แพนเค้ก", price: 90, days: 2, img: "Foods/pancake.png" },
    { id: "macaron.png", type: "food", name: "มาการอง", price: 70, days: 1, img: "Foods/macaron.png" },
    // 🇹🇭 อาหารไทย: ไม่มีขายในร้าน (noShop) ได้จากวงล้อมินิเกมเท่านั้น
    { id: "Somtum.png", type: "food", name: "ส้มตำ", price: 80, days: 2, img: "Foods/Somtum.png", noShop: true },
    { id: "Basil.png", type: "food", name: "กระเพราหมูกรอบไข่ดาว", price: 120, days: 3, img: "Foods/Basil.png", noShop: true },
    { id: "Homok.png", type: "food", name: "ห่อหมก", price: 110, days: 3, img: "Foods/Homok.png", noShop: true },
    { id: "LegporkRice.png", type: "food", name: "ข้าวขาหมู", price: 130, days: 3, img: "Foods/LegporkRice.png", noShop: true },
    { id: "KanomCrok.png", type: "food", name: "ขนมครก", price: 60, days: 1, img: "Foods/KanomCrok.png", noShop: true },
    { id: "Padthai.png", type: "food", name: "ผัดไทยกุ้งสด", price: 140, days: 3, img: "Foods/Padthai.png", noShop: true },
    { id: "StickyRice.png", type: "food", name: "ข้าวเหนียวมะม่วง", price: 90, days: 2, img: "Foods/StickyRice.png", noShop: true },
    { id: "Tomyumkung.png", type: "food", name: "ต้มยำกุ้ง", price: 160, days: 4, img: "Foods/Tomyumkung.png", noShop: true },
    { id: "MooStak.png", type: "food", name: "หมูสเต๊ะ", price: 100, days: 2, img: "Foods/MooStak.png", noShop: true },
    { id: "GreenCerry.png", type: "food", name: "แกงเขียวหวาน", price: 120, days: 3, img: "Foods/GreenCerry.png", noShop: true },
    // 🏝️ เกาะลอยฟ้า (id ต้องตรงกับชื่อไฟล์และ ISLANDS ใน island.js) — พื้นหลังด้านหลังเกาะคือ Background/back.png เสมอ
    { id: "Grass.png", type: "bg", name: "เกาะทุ่งหญ้า", price: 0, img: "Background/Grass.png" },
    { id: "Cherry.png", type: "bg", name: "เกาะซากุระ", price: 1500, img: "Background/Cherry.png" },
    { id: "Stone.png", type: "bg", name: "เกาะหิน", price: 700, img: "Background/Stone.png" },
    { id: "Ice.png", type: "bg", name: "เกาะน้ำแข็ง", price: 900, img: "Background/Ice.png" },
    { id: "Pirate.png", type: "bg", name: "เกาะโจรสลัด", price: 1500, img: "Background/Pirate.png" },
    { id: "Candy.png", type: "bg", name: "เกาะขนม", price: 2000, img: "Background/Candy.png" },
    { id: "Gem.png", type: "bg", name: "เกาะอัญมณี", price: 3000, img: "Background/Gem.png" },
    { id: "Celestial.png", type: "bg", name: "เกาะสวรรค์", price: 9000, img: "Background/Celestial.png" },
    { id: "Hell.png", type: "bg", name: "เกาะนรก", price: 9000, img: "Background/Hell.png" }
  ];

  let currentStudent = null;
  let extraStudentMission = null; 
  let currentMissionTab = 'main'; 
  let studentKey = null;
  let wallet = { coins:0, exp:0, level:1 };
  let inventory = {};
  let purchasedItems = []; 
  let petInstances = [];
  let serverTimeOffsetMs = 0;
  let activeTool = null; 
  let currentShopTab = 'pet';
  let currentBackground = 'Grass.png';

  let breedSelectedPets = [null, null];
  let activeBreedSlotIndex = 0;
  let breedTimerInterval = null;

  let battleData = {count: 3, resetTime: 0};
  let battleLockedMyPetIndex = null;
  let battleTargetFriend = null;
  let battleCurrentHP = 0;
  let battleMaxHP = 0;
  let battleFriendHP = 0;
  let battleFriendMaxHP = 0;
  let mathChallengeAnswer = 0;
  let mathChallengeInput = "";
  let pendingSkillNum = null;
  let allFriendsCache = [];
  const MATH_CHALLENGE_TIME_LIMIT = 10; // วินาที
  let mathChallengeTimeLeft = MATH_CHALLENGE_TIME_LIMIT;
  let mathChallengeTimerInterval = null;


/* =========================================
   Battle Result State
   เพิ่มตรงนี้
========================================= */

let battleResultAfterClose = null;


/* =========================================
   เปิด Result Card
========================================= */

function showBattleResult({
  type,
  title,
  message,
  rewards = [],
  onConfirm = null
}) {

  const overlay =
    document.getElementById("battleResultOverlay");

  const card =
    document.getElementById("battleResultCard");

  const icon =
    document.getElementById("battleResultIcon");

  const titleEl =
    document.getElementById("battleResultTitle");

  const messageEl =
    document.getElementById("battleResultMessage");

  const rewardBox =
    document.getElementById("battleRewardBox");


  /* ล้าง style เดิม */

  card.classList.remove("defeat");


  /* =========================================
     ชนะ
  ========================================== */

  if (type === "victory") {

    icon.textContent = "🏆";

    card.classList.remove("defeat");

  }


  /* =========================================
     แพ้
  ========================================== */

  else {

    icon.textContent = "💔";

    card.classList.add("defeat");

  }


  titleEl.textContent = title;

  messageEl.textContent = message;


  /* =========================================
     แสดง Reward
  ========================================== */

  rewardBox.innerHTML = rewards.map(reward => {

    return `
      <div class="battle-reward-item">
        ${reward}
      </div>
    `;

  }).join("");


  /* ถ้าแพ้ไม่มีรางวัล */

  if (rewards.length === 0) {

    rewardBox.innerHTML = `
      <div class="battle-reward-item">
        พักฟื้นก่อนกลับมาต่อสู้อีกครั้งนะ
      </div>
    `;

  }


  /* เก็บสิ่งที่จะทำหลังผู้เล่นกดตกลง */

  battleResultAfterClose = onConfirm;


  /* แสดง Card */

  overlay.classList.add("show");
}


/* แสดงผลต่อสู้ผ่านหน้าโหลด (แสงประจบ "ตู้ม") — ถ้าไม่มี battle-loading.js ก็แสดงผลทันทีเหมือนเดิม */
function showBattleResultFx(opts) {
  if (window.BattleLoading) {
    BattleLoading.finish(() => showBattleResult(opts));
  } else {
    showBattleResult(opts);
  }
}

/* =========================================
   ปิด Result Card
========================================= */

function closeBattleResult() {

  const overlay =
    document.getElementById("battleResultOverlay");


  overlay.classList.remove("show");


  /* ทำงานหลังจากกดตกลง */

  if (typeof battleResultAfterClose === "function") {

    const callback = battleResultAfterClose;

    battleResultAfterClose = null;

    callback();

  }

}

  /* =====================================================================
     🧚 FAIRY (ภูติ) — ภูติตัวช่วยต่อสู้ + สมุดสะสม
     ข้อมูลมาจาก Google Sheet:
       • ชีท "Fairy" (ID, Name, JSON, Describe) → fairyCatalog  (ภาพ = Fairy/<Name>.png)
       • คอลัมน์ "Fairy" ของนักเรียน เช่น {S001, S002:true, S003}
           → ownedFairyIds = ภูติที่มี, equippedFairyId = ตัวที่ต่อท้าย :true
     เข้าต่อสู้ได้ครั้งละ 1 ตัว (ตัวที่ตั้งไว้ ล็อกไว้จนกว่าจะเปลี่ยน)
     ฝั่งเพื่อนใช้ภูติที่เพื่อนตั้งไว้ (ไม่สุ่ม)
     ทอยโอกาสใหม่ทุกครั้งที่โจมตี (Cri/Steal/Heal) และทุกครั้งที่ถูกโจมตี (Dodge/Protect)
     ค่า chance / reduction / healPercent / stealPercent = 0–100 (เปอร์เซ็นต์)
     ค่า multiplier = ตัวคูณ (2 = สองเท่า, 1.5 = หนึ่งเท่าครึ่ง)
  ===================================================================== */
  let fairyCatalog = [];       // [{ id, name, skills, describe, tier }]
  let ownedFairyIds = [];      // ["S001", ...]
  let equippedFairyId = "";    // ภูติที่ตั้งไว้ใช้ต่อสู้ ("" = ไม่ได้ตั้ง)
  let battleFairy = null;      // ภูติฝั่งเรา ในการต่อสู้รอบนี้
  let battleFoeFairy = null;   // ภูติฝั่งเพื่อน ในการต่อสู้รอบนี้

  // params = ค่าเสริมของแต่ละสกิล (def = ค่าเริ่มต้นถ้าในชีทไม่ได้ใส่, min/max = ช่วงที่ยอมรับ)
  const FAIRY_SKILL_META = {
    cri:     { icon: "💥", color: "#ff7a45", label: "คริติคอล",   fx: "คริติคอล!",
               params: { multiplier: { def: 2, min: 1 } },
               desc: s => `${fairyFmt(s.chance)}% ดาเมจ ×${fairyFmt(s.multiplier)}` },
    protect: { icon: "🛡️", color: "#4a90e2", label: "ป้องกัน",    fx: "ป้องกัน!",
               params: { reduction: { def: 0, min: 0, max: 100 } },
               desc: s => `${fairyFmt(s.chance)}% ลดดาเมจ ${fairyFmt(s.reduction)}%` },
    dodge:   { icon: "🌀", color: "#8e6bd8", label: "หลบหลีก",    fx: "หลบ!",
               params: {},
               desc: s => `${fairyFmt(s.chance)}% หลบการโจมตีทั้งหมด` },
    heal:    { icon: "💚", color: "#2fb36d", label: "ฟื้นฟู",      fx: "ฟื้นฟู!",
               params: { healPercent: { def: 0, min: 0, max: 100 } },
               desc: s => `${fairyFmt(s.chance)}% ฟื้น HP ${fairyFmt(s.healPercent)}% ของ HP สูงสุด` },
    luck:    { icon: "🍀", color: "#e7a92e", label: "โชคลาภ",     fx: "โชคดี!",
               params: { multiplier: { def: 1.5, min: 1 } },
               desc: s => `${fairyFmt(s.chance)}% เหรียญรางวัล ×${fairyFmt(s.multiplier)}` },
    xp:      { icon: "✨", color: "#d86bb8", label: "โบนัส EXP",  fx: "EXP+!",
               params: { multiplier: { def: 1.5, min: 1 } },
               desc: s => `${fairyFmt(s.chance)}% EXP ×${fairyFmt(s.multiplier)}` },
    steal:   { icon: "🧛", color: "#c0392b", label: "ดูดเลือด",   fx: "ดูดเลือด!",
               params: { stealPercent: { def: 0, min: 0, max: 100 } },
               desc: s => `${fairyFmt(s.chance)}% ดูด HP ${fairyFmt(s.stealPercent)}% ของ HP สูงสุดคู่ต่อสู้` }
  };

  function fairyFmt(n) { return String(Math.round((Number(n) || 0) * 100) / 100); }
  function fairyEsc(t) { return String(t).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
  function fairyImg(f) { return "Fairy/" + encodeURIComponent(f.name) + ".png"; }
  function fairyImgError(img) {
    const span = document.createElement("span");
    span.textContent = "🧚";
    span.style.fontSize = "calc(var(--fairy-size, 40px) * 0.8)";
    if (img.parentNode) img.parentNode.replaceChild(span, img);
  }

  // รับ {"Cri": {...}} (object หรือข้อความ JSON) แล้วคืนสกิลที่ตรวจสอบค่าแล้ว คีย์เป็นตัวพิมพ์เล็ก
  function normalizeFairySkills(raw) {
    if (typeof raw === "string") {
      try { raw = JSON.parse(raw); } catch (e) { raw = null; }
    }
    const out = {};
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return out;

    Object.keys(raw).forEach(k => {
      const key = String(k).trim().toLowerCase();
      const meta = FAIRY_SKILL_META[key];
      const v = raw[k];
      if (!meta || !v || typeof v !== "object") return;

      const num = (x, def) => { const n = parseFloat(x); return isNaN(n) ? def : n; };
      const sk = { chance: Math.min(100, Math.max(0, num(v.chance, 0))) };

      Object.keys(meta.params).forEach(pName => {
        const spec = meta.params[pName];
        let val = num(v[pName], spec.def);
        if (spec.min !== undefined) val = Math.max(spec.min, val);
        if (spec.max !== undefined) val = Math.min(spec.max, val);
        sk[pName] = val;
      });
      out[key] = sk;
    });
    return out;
  }

  const FAIRY_TIERS = ["D", "C", "B", "A", "S"];
  const FAIRY_ROLL_COST = 1000;                                   // ราคาต่อการสุ่ม 1 ตัว
  const FAIRY_ROLL_COUNTS = [1, 5, 10];                           // ตัวเลือกสุ่มทีละกี่ตัว
  const FAIRY_SHARD_BET_MAX = 50;                                  // ใส่เศษเพิ่มโอกาสได้สูงสุดกี่ชิ้นต่อครั้ง (ต้องตรงกับ FAIRY_SHARD_BOOST_MAX ใน Apps Script) — ไม่แสดงโอกาสให้ผู้เล่นเห็น
  const SHARD_IMG = "Icon/shard.png";                              // ถ้าเก็บรูปไว้ที่อื่น แก้ path ตรงนี้

  function normalizeFairyTier(t) {
    const c = String(t ?? "").trim().toUpperCase().charAt(0);
    return FAIRY_TIERS.includes(c) ? c : "D";
  }

  // ลำดับแรงค์: S = 4 (สูงสุด) … D = 0
  function fairyTierRank(t) { return FAIRY_TIERS.indexOf(normalizeFairyTier(t)); }

  // เรียงจาก S → A → B → C → D (แรงค์เดียวกันคงลำดับเดิมตามชีท)
  function sortFairiesByTier(list) {
    return list
      .map((f, i) => ({ f, i }))
      .sort((a, b) => fairyTierRank(b.f.tier) - fairyTierRank(a.f.tier) || a.i - b.i)
      .map(x => x.f);
  }

  // ป้ายแรงค์วงกลม มีตัวอักษรตรงกลาง (S = สีรุ้ง)
  function fairyTierBadge(tier, extraClass = "") {
    const t = normalizeFairyTier(tier);
    return `<span class="fairy-tier tier-${t} ${extraClass}" title="แรงค์ ${t}">${t}</span>`;
  }

  function parseFairyIdList(value) {
    let items = [];
    if (Array.isArray(value)) items = value;
    else if (typeof value === "string") items = value.replace(/[\[\]{}"'“”‘’]/g, "").replace(/\s*:\s*/g, ":").split(/[,;\s]+/);
    const seen = new Set(), out = [];
    items.forEach(i => {
      const id = String(i).split(":")[0].trim();
      if (id && !seen.has(id.toLowerCase())) { seen.add(id.toLowerCase()); out.push(id); }
    });
    return out;
  }

  function loadFairyData(catalog, ownedRaw, equippedRaw) {
    fairyCatalog = (Array.isArray(catalog) ? catalog : [])
      .map(f => ({
        id: String((f && f.id) ?? "").trim(),
        name: String((f && f.name) ?? "").trim(),
        skills: normalizeFairySkills(f && f.skills),
        describe: String((f && f.describe) ?? "").trim(),
        tier: normalizeFairyTier(f && f.tier)
      }))
      .filter(f => f.id && f.name);
    ownedFairyIds = parseFairyIdList(ownedRaw);

    const eq = String(equippedRaw || "").trim().toLowerCase();
    const ownedEq = ownedFairyIds.find(id => id.toLowerCase() === eq);
    equippedFairyId = eq && ownedEq ? ownedEq : "";
  }

  function getFairyById(id) {
    const key = String(id || "").trim().toLowerCase();
    if (!key) return null;
    return fairyCatalog.find(f => f.id.toLowerCase() === key) || null;
  }

  function isFairyOwned(f) {
    return ownedFairyIds.some(id => id.toLowerCase() === f.id.toLowerCase());
  }

  function isFairyEquipped(f) {
    return !!equippedFairyId && equippedFairyId.toLowerCase() === f.id.toLowerCase();
  }

  function getOwnedFairies() { return fairyCatalog.filter(isFairyOwned); }

  // ภูติที่ตั้งไว้ใช้ต่อสู้ (ต้องมีอยู่ในแคตตาล็อกและเป็นของเรา)
  function getEquippedFairy() {
    const f = getFairyById(equippedFairyId);
    return f && isFairyOwned(f) ? f : null;
  }

  // ---------- สมุดสะสม ----------
  function openFairyBook() {
    renderFairyBook();
    document.getElementById("fairyModal").style.display = "flex";
  }

  function renderFairyBook() {
    const grid = document.getElementById("fairyBookGrid");
    const prog = document.getElementById("fairyProgress");
    if (!grid || !prog) return;

    const total = fairyCatalog.length;
    const have = fairyCatalog.filter(isFairyOwned).length;
    const eqF = getEquippedFairy();
    prog.innerHTML = `🧚 สะสมแล้ว ${have}/${total} ตัว` +
      (have > 0 ? `<br><span style="font-weight:500;">⚔️ ภูติที่ใช้ต่อสู้: ${eqF ? `<b>${fairyEsc(eqF.name)}</b>` : "ยังไม่ได้เลือก (แตะการ์ดภูติเพื่อเลือก)"}</span>` : "");

    renderFairyGachaBar();
    renderFairyFilterRow();

    if (total === 0) {
      grid.innerHTML = `<div class="fairy-empty">ยังไม่มีภูติในระบบ</div>`;
      return;
    }

    const shown = sortFairiesByTier(isFairyOwnedOnly() ? fairyCatalog.filter(isFairyOwned) : fairyCatalog);
    if (shown.length === 0) {
      grid.innerHTML = `<div class="fairy-empty">ยังไม่มีภูติที่ครอบครอง ลองสุ่มดูสิ! 🎲</div>`;
      return;
    }

    grid.innerHTML = shown.map(f => {
      const src = fairyImg(f);

      if (!isFairyOwned(f)) {
        return `
          <div class="fairy-card locked">
            <div class="fairy-card-img">
              <span class="fairy-fallback">🧚</span>
              <img src="${src}" alt="" onerror="this.style.display='none'">
              <div class="fairy-card-q">?</div>
            </div>
            <div class="fairy-card-name">???</div>
          </div>`;
      }

      // ใช้ข้อความจากคอลัมน์ Describe ถ้ามี ไม่งั้นสรุปจาก JSON ให้อัตโนมัติ
      let info;
      if (f.describe) {
        info = `<div class="fairy-describe">${fairyEsc(f.describe)}</div>`;
      } else {
        info = Object.keys(f.skills).map(key => {
          const meta = FAIRY_SKILL_META[key];
          return `<div class="fairy-skill-chip">${meta.icon} <b>${meta.label}</b> ${meta.desc(f.skills[key])}</div>`;
        }).join("");
      }

      const eq = isFairyEquipped(f);
      return `
        <div class="fairy-card owned ${eq ? "equipped" : ""}">
          ${fairyTierBadge(f.tier, "on-card")}
          <div class="fairy-card-img">
            <span class="fairy-fallback">🧚</span>
            <img src="${src}" alt="${fairyEsc(f.name)}" onerror="this.style.display='none'">
          </div>
          <div class="fairy-card-name">${fairyEsc(f.name)}</div>
          <div class="fairy-card-skills">${info}</div>
          <button class="fairy-equip-btn ${eq ? "on" : ""}" data-fid="${fairyEsc(f.id)}" onclick="equipFairy(this.dataset.fid)">
            ${eq ? "✅ ใช้อยู่ (แตะเพื่อถอด)" : "⚔️ ใช้ต่อสู้"}
          </button>
        </div>`;
    }).join("");
  }

  // ---------- ตัวกรอง: แสดงเฉพาะภูติที่ครอบครอง ----------
  function isFairyOwnedOnly() {
    try { return localStorage.getItem(`pet_fairy_owned_only_${studentKey}`) === "1"; } catch (e) { return false; }
  }

  function toggleFairyOwnedOnly() {
    try { localStorage.setItem(`pet_fairy_owned_only_${studentKey}`, isFairyOwnedOnly() ? "0" : "1"); } catch (e) {}
    renderFairyBook();
  }

  function renderFairyFilterRow() {
    const el = document.getElementById("fairyFilterRow");
    if (!el) return;
    const on = isFairyOwnedOnly();
    el.innerHTML = `
      <button type="button" class="fairy-filter-btn ${on ? "on" : ""}" onclick="toggleFairyOwnedOnly()">
        <span class="fairy-filter-box">${on ? "✓" : ""}</span> แสดงเฉพาะที่ครอบครอง
      </button>`;
  }

  // ---------- สุ่มภูติ ----------
  let _fairyRolling = false;
  let fairyShardBet = 0;   // จำนวนเศษภูติที่ใส่เพิ่มโอกาสในการสุ่มครั้งถัดไป (ผลต่อโอกาสคำนวณที่ Apps Script ไม่บอกผู้เล่น)

  function fairyBetLimit() {
    return Math.max(0, Math.min(FAIRY_SHARD_BET_MAX, parseInt(inventory.shard) || 0));
  }

  function fairyBetAdjust(delta) {
    if (_fairyRolling) return;
    fairyShardBet = Math.max(0, Math.min(fairyBetLimit(), fairyShardBet + delta));
    renderFairyGachaBar();
  }

  function fairyBetMax() {
    if (_fairyRolling) return;
    fairyShardBet = fairyBetLimit();
    renderFairyGachaBar();
  }

  function shardImgHTML(cls = "shard-ico") {
    return `<img class="${cls}" src="${SHARD_IMG}" alt="เศษภูติ" onerror="this.replaceWith(document.createTextNode('💎'))">`;
  }

  function renderFairyGachaBar() {
    const el = document.getElementById("fairyGachaBar");
    if (!el) return;
    const shards = parseInt(inventory.shard) || 0;
    const canPay = wallet.coins >= FAIRY_ROLL_COST;
    const limit = fairyBetLimit();
    if (fairyShardBet > limit) fairyShardBet = limit;
    const lock = _fairyRolling ? "disabled" : "";

    // ปุ่มสุ่ม n ตัว (ปิดเมื่อเหรียญไม่พอสำหรับ n ครั้ง)
    const rollBtn = n => {
      const cost = FAIRY_ROLL_COST * n;
      const off = _fairyRolling || fairyCatalog.length === 0 || wallet.coins < cost;
      return `<button class="fairy-roll-btn" onclick="rollFairy(${n})" ${off ? "disabled" : ""}>
          <span class="fairy-roll-n">🎲 สุ่ม ${n} ตัว</span><span class="fairy-roll-price">${cost.toLocaleString()} 💰</span>
        </button>`;
    };

    el.innerHTML = `
      <div class="fairy-bet-box">
        <div class="fairy-bet-title">${shardImgHTML()} ใส่เศษภูติต่อการสุ่ม 1 ครั้ง เพื่อเพิ่มโอกาสได้แรงค์สูง</div>
        <div class="fairy-bet-row">
          <button type="button" class="fairy-bet-btn" onclick="fairyBetAdjust(-1)" ${lock || (fairyShardBet <= 0 ? "disabled" : "")}>−</button>
          <div class="fairy-bet-val num">${fairyShardBet}</div>
          <button type="button" class="fairy-bet-btn" onclick="fairyBetAdjust(1)" ${lock || (fairyShardBet >= limit ? "disabled" : "")}>+</button>
          <button type="button" class="fairy-bet-btn max" onclick="fairyBetMax()" ${lock || (limit <= 0 ? "disabled" : "")}>สูงสุด</button>
        </div>
        <div class="fairy-bet-note">${limit <= 0 ? "ยังไม่มีเศษภูติ (ได้จากการสุ่มได้ภูติซ้ำ)" : "ยิ่งใส่เศษมาก ยิ่งมีลุ้นแรงค์สูง · เศษที่ใส่จะถูกใช้ไปเมื่อสุ่ม (สุ่มหลายตัวจะใช้เศษเท่ากันทุกครั้ง)"}</div>
      </div>
      <div class="fairy-roll-row">${FAIRY_ROLL_COUNTS.map(rollBtn).join("")}</div>
      ${_fairyRolling ? `<div class="fairy-roll-hint rolling">กำลังสุ่ม...</div>` : ""}
      ${!canPay && !_fairyRolling ? `<div class="fairy-roll-hint">เหรียญไม่พอ (มี ${wallet.coins.toLocaleString()} 💰)</div>` : ""}
      <div class="fairy-shard-chip">${shardImgHTML()} เศษภูติ <b class="num">x${shards}</b></div>`;
  }

  async function postFairyRoll(shardsUsed) {
    // ไม่ลองซ้ำอัตโนมัติ เพราะถ้าคำขอแรกสำเร็จแล้วแต่คำตอบไม่ถึง จะถูกหักเหรียญซ้ำ
    const payload = new URLSearchParams({ action: "rollFairy", id: studentKey, shardsUsed: String(shardsUsed || 0) });
    const response = await fetch(API_URL, { method: "POST", body: payload });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  }

  // สุ่มภูติ count ตัว: เรียกเซิร์ฟเวอร์ทีละตัวต่อเนื่องกัน (ตัวละ FAIRY_ROLL_COST) แล้วสรุปผลทีเดียว
  // เศษภูติที่ใส่ = ต่อการสุ่ม 1 ครั้ง (ถ้าเศษที่เหลือไม่พอ ใช้เท่าที่มี)
  async function rollFairy(count = 1) {
    if (_fairyRolling) return;
    count = Math.max(1, parseInt(count) || 1);
    if (fairyCatalog.length === 0) { popMessage("ยังไม่มีภูติในระบบ"); return; }
    const totalCost = FAIRY_ROLL_COST * count;
    if (wallet.coins < totalCost) {
      popMessage(`เหรียญไม่พอ! ต้องใช้ ${totalCost.toLocaleString()} เหรียญ`);
      return;
    }

    _fairyRolling = true;
    renderFairyGachaBar();

    const results = [];   // [{ result, f }]
    let stopMsg = "";     // เหตุผลที่หยุดก่อนครบ (ถ้ามี)

    try {
      // ให้ข้อมูลฝั่งเว็บเซฟเสร็จก่อน เพื่อให้เหรียญในชีทตรงกับที่เห็นบนหน้าจอ
      if (_saveInFlight) { try { await _saveInFlight; } catch (e) {} }
      await saveWalletAndData();

      showFairyRollAnimation(count);
      const minDelay = new Promise(r => setTimeout(r, 1500));

      for (let i = 0; i < count; i++) {
        if (wallet.coins < FAIRY_ROLL_COST) { stopMsg = "เหรียญไม่พอสำหรับสุ่มต่อ"; break; }
        const betShards = Math.min(fairyShardBet, fairyBetLimit());   // เซิร์ฟเวอร์ตรวจซ้ำกับค่าในชีทอีกที

        let result;
        try {
          result = await postFairyRoll(betShards);
        } catch (e) {
          stopMsg = (e && e.message) || "สุ่มภูติไม่สำเร็จ";
          break;
        }

        if (!result || result.success !== true) {
          if (result && typeof result.coin === "number") { wallet.coins = result.coin; updateWalletUI(); }
          stopMsg = (result && result.message) || "สุ่มภูติไม่สำเร็จ";
          break;
        }

        // อัปเดตข้อมูลฝั่งเว็บให้ตรงกับชีททุกครั้ง (กันการเซฟครั้งถัดไปเขียนทับ)
        wallet.coins = result.coin;
        inventory.shard = result.shards;
        currentStudent.items = { ...inventory };
        fairyShardBet = Math.min(fairyShardBet, fairyBetLimit());
        const f = getFairyById(result.fairyId);
        if (result.isNew && f && !isFairyOwned(f)) ownedFairyIds.push(f.id);
        results.push({ result, f });

        updateWalletUI();
        const prog = document.getElementById("fairyRollProgress");
        if (prog) prog.textContent = `${results.length}/${count}`;
      }

      await minDelay;
      if (results.length === 0) throw new Error(stopMsg || "สุ่มภูติไม่สำเร็จ");

      if (count === 1) showFairyRollResult(results[0].result, results[0].f);
      else showFairyMultiResult(results, count, stopMsg);
    } catch (err) {
      console.error("❌ สุ่มภูติไม่สำเร็จ:", err);
      closeFairyRoll();
      popMessage("⚠️ " + (err && err.message ? err.message : "สุ่มภูติไม่สำเร็จ"));
    } finally {
      _fairyRolling = false;
      renderFairyBook();
      refreshFairyPickBar();
    }
  }

  function showFairyRollAnimation(count = 1) {
    document.getElementById("fairyRollCard").className = "fairy-roll-card rolling";
    document.getElementById("fairyRollBody").innerHTML = `
      <div class="fairy-orb">🔮</div>
      <div class="fairy-roll-title">กำลังเรียกภูติ...</div>
      ${count > 1 ? `<div class="fairy-roll-sub" id="fairyRollProgress">0/${count}</div>` : ""}`;
    document.getElementById("fairyRollOk").style.display = "none";
    document.getElementById("fairyRollModal").style.display = "flex";
  }

  function showFairyRollResult(result, f) {
    const tier = normalizeFairyTier(result.tier);
    document.getElementById("fairyRollCard").className = `fairy-roll-card result tier-${tier}`;

    const name = f ? fairyEsc(f.name) : "ภูติปริศนา";
    const img = f
      ? `<img src="${fairyImg(f)}" alt="${name}" onerror="this.replaceWith(document.createTextNode('🧚'))">`
      : "🧚";

    let extra;
    if (result.isNew) {
      extra = `<div class="fairy-roll-title">🎉 ได้ภูติตัวใหม่!</div>`;
    } else {
      extra = `
        <div class="fairy-roll-title">ได้ตัวซ้ำ! แปลงเป็นเศษภูติ</div>
        <div class="fairy-roll-shard">${shardImgHTML("shard-ico big")} <b class="num">+${result.shardGained}</b>
          <span class="sub">(มีทั้งหมด ${result.shards})</span></div>`;
    }

    document.getElementById("fairyRollBody").innerHTML = `
      <div class="fairy-roll-img ${result.isNew ? "" : "dup"}">${img}${fairyTierBadge(tier, "on-result")}</div>
      <div class="fairy-roll-name">${name}</div>
      ${extra}`;
    document.getElementById("fairyRollOk").style.display = "";
    document.getElementById("fairyRollModal").style.display = "flex";
  }

  // สรุปผลสุ่มหลายตัว (5 / 10): เรียงแรงค์สูงสุดก่อน
  function showFairyMultiResult(items, requested, stopMsg) {
    const sorted = items
      .map((it, i) => ({ ...it, i }))
      .sort((a, b) => fairyTierRank(b.result.tier) - fairyTierRank(a.result.tier) || a.i - b.i);
    const best = normalizeFairyTier(sorted[0].result.tier);
    document.getElementById("fairyRollCard").className = `fairy-roll-card result multi tier-${best}`;

    const newCount = items.filter(x => x.result.isNew).length;
    const dupCount = items.length - newCount;
    const shardGain = items.reduce((s, x) => s + (x.result.isNew ? 0 : (parseInt(x.result.shardGained) || 0)), 0);
    const shardsNow = items[items.length - 1].result.shards;

    const tiles = sorted.map((it, k) => {
      const { result, f } = it;
      const tier = normalizeFairyTier(result.tier);
      const name = f ? fairyEsc(f.name) : "ภูติปริศนา";
      const img = f
        ? `<img src="${fairyImg(f)}" alt="${name}" onerror="this.replaceWith(document.createTextNode('🧚'))">`
        : "🧚";
      const tag = result.isNew
        ? `<span class="fairy-multi-tag new">NEW</span>`
        : `<span class="fairy-multi-tag dup">${shardImgHTML("shard-ico mini")}+${result.shardGained}</span>`;
      return `
        <div class="fairy-multi-item tier-${tier}" style="--i:${k}">
          ${fairyTierBadge(tier, "on-multi")}
          <div class="fairy-multi-img">${img}</div>
          <div class="fairy-multi-name">${name}</div>
          ${tag}
        </div>`;
    }).join("");

    const warn = items.length < requested
      ? `<div class="fairy-roll-warn">⚠️ สุ่มได้ ${items.length}/${requested} ตัว${stopMsg ? " — " + fairyEsc(stopMsg) : ""}</div>`
      : "";

    document.getElementById("fairyRollBody").innerHTML = `
      <div class="fairy-roll-title">🎉 สุ่มได้ ${items.length} ตัว</div>
      <div class="fairy-multi-grid">${tiles}</div>
      <div class="fairy-roll-sum">ภูติใหม่ <b class="num">${newCount}</b> ตัว${dupCount ? ` · ซ้ำ <b class="num">${dupCount}</b> ตัว` : ""}</div>
      ${dupCount ? `<div class="fairy-roll-shard">${shardImgHTML("shard-ico big")} <b class="num">+${shardGain}</b>
        <span class="sub">(มีทั้งหมด ${shardsNow})</span></div>` : ""}
      ${warn}`;
    document.getElementById("fairyRollOk").style.display = "";
    document.getElementById("fairyRollModal").style.display = "flex";
  }

  function closeFairyRoll() {
    document.getElementById("fairyRollModal").style.display = "none";
  }

  // ---------- เลือกภูติเข้าต่อสู้ (1 ตัว) ----------
  let _fairySaving = false;

  async function saveFairyEquip(id) {
    const payload = new URLSearchParams({ action: "setFairy", id: studentKey, fairyEquipped: id });
    let lastError = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await fetch(API_URL, { method: "POST", body: payload });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const result = await response.json();
        if (!result || result.success !== true) throw new Error((result && result.message) || "บันทึกภูติไม่สำเร็จ");
        return result;
      } catch (err) {
        lastError = err;
        if (attempt < 3) await new Promise(r => setTimeout(r, 1200));
      }
    }
    throw lastError;
  }

  async function equipFairy(id) {
    if (_fairySaving) return;
    const f = getFairyById(id);
    if (!f || !isFairyOwned(f)) return;

    const prev = equippedFairyId;
    const next = isFairyEquipped(f) ? "" : f.id;

    equippedFairyId = next;
    renderFairyBook();
    refreshFairyPickBar();

    _fairySaving = true;
    try {
      await saveFairyEquip(next);
      popMessage(next ? `🧚 ตั้ง ${f.name} เป็นภูติต่อสู้แล้ว` : "🧚 ถอดภูติออกแล้ว");
    } catch (err) {
      console.error("❌ บันทึกภูติไม่สำเร็จ:", err);
      equippedFairyId = prev;
      renderFairyBook();
      refreshFairyPickBar();
      popMessage("⚠️ บันทึกภูติไม่สำเร็จ ลองใหม่อีกครั้ง");
    } finally {
      _fairySaving = false;
    }
  }

  // แถบแสดงภูติที่ใช้อยู่ ในหน้าเลือกสัตว์ก่อนต่อสู้
  function fairyPickBarInner() {
    if (getOwnedFairies().length === 0) {
      return `<div class="fairy-pick-text"><span class="fairy-pick-sub">🧚 ยังไม่มีภูติตัวช่วย</span></div>`;
    }
    const f = getEquippedFairy();
    if (!f) {
      return `
        <div class="fairy-pick-img">🧚</div>
        <div class="fairy-pick-text"><b>ยังไม่ได้เลือกภูติ</b><span class="fairy-pick-sub">เลือกได้ 1 ตัวเพื่อช่วยต่อสู้</span></div>
        <button class="buy-btn" onclick="openFairyBook()">เลือก</button>`;
    }
    return `
      <div class="fairy-pick-img"><img src="${fairyImg(f)}" alt="" onerror="this.replaceWith(document.createTextNode('🧚'))"></div>
      <div class="fairy-pick-text"><b>${fairyEsc(f.name)}</b><span class="fairy-pick-sub">ภูติที่ใช้ต่อสู้</span></div>
      <button class="buy-btn" onclick="openFairyBook()">เปลี่ยน</button>`;
  }

  function buildFairyPickBarHTML() {
    return `<div id="fairyPickBar" class="fairy-pick-bar">${fairyPickBarInner()}</div>`;
  }

  function refreshFairyPickBar() {
    const el = document.getElementById("fairyPickBar");
    if (el) el.innerHTML = fairyPickBarInner();
  }

  // ---------- ภูติในสนามต่อสู้ (side = "my" ฝั่งเรา / "foe" ฝั่งเพื่อน) ----------
  // ช่องว่างเหนือสัตว์ (คงไว้เพื่อให้เลย์เอาต์เดิมไม่ขยับ) — ตัวภูติจริงอยู่ใน buildFairyUnitHTML
  function buildFairyLaneHTML() {
    return `<div class="fairy-lane"></div>`;
  }

  // ตัวภูติ: วางใน .fighter-assembly-container ของสัตว์ ตำแหน่ง/ขนาดมาจาก PET_LAYOUT (fairy / fairySize)
  function buildFairyUnitHTML(fairy, side) {
    if (!fairy) return "";
    return `
      <div class="fairy-unit" id="fairyUnit_${side}">
        <img src="${fairyImg(fairy)}" alt="${fairyEsc(fairy.name)}" onerror="fairyImgError(this)">
      </div>`;
  }

  function showFairyFx(side, skillKey, delayMs = 0) {
    setTimeout(() => {
      const unit = document.getElementById(`fairyUnit_${side}`);
      const meta = FAIRY_SKILL_META[skillKey];
      if (!unit || !meta) return;

      unit.style.setProperty("--fx-color", meta.color);
      unit.classList.remove("fairy-fire");
      void unit.offsetWidth;
      unit.classList.add("fairy-fire");

      const label = document.createElement("div");
      label.className = "fairy-fx-label";
      label.textContent = `${meta.icon} ${meta.fx}`;
      unit.appendChild(label);

      setTimeout(() => unit.classList.remove("fairy-fire"), 750);
      setTimeout(() => label.remove(), 1250);
    }, delayMs);
  }

  function fairyRoll(pct) { return Math.random() * 100 < pct; }

  // ทอยตอน "ผู้โจมตี" ลงมือ: Cri (คูณดาเมจ), Steal (ดูด HP คู่ต่อสู้มาเติมให้ตัวเอง), Heal (ฟื้น HP ตัวเอง)
  // side = ฝั่งของผู้โจมตี
  function applyFairyOffense(side, baseDamage) {
    const fairy = side === "my" ? battleFairy : battleFoeFairy;
    const attackerMax = side === "my" ? battleMaxHP : battleFriendMaxHP;
    const defenderMax = side === "my" ? battleFriendMaxHP : battleMaxHP;
    const r = { damage: baseDamage, crit: 1, steal: 0, heal: 0 };
    if (!fairy) return r;

    const sk = fairy.skills;
    let t = 0;
    const fire = k => { showFairyFx(side, k, t); t += 220; };

    if (sk.cri && fairyRoll(sk.cri.chance)) {
      r.crit = sk.cri.multiplier;
      fire("cri");
    }
    if (sk.steal && sk.steal.stealPercent > 0 && fairyRoll(sk.steal.chance)) {
      r.steal = Math.max(1, Math.round(defenderMax * sk.steal.stealPercent / 100));
      fire("steal");
    }
    if (sk.heal && sk.heal.healPercent > 0 && fairyRoll(sk.heal.chance)) {
      r.heal = Math.max(1, Math.round(attackerMax * sk.heal.healPercent / 100));
      fire("heal");
    }

    r.damage = Math.max(1, Math.round(baseDamage * r.crit));
    return r;
  }

  // ทอยตอน "ผู้ป้องกัน" ถูกโจมตี: Dodge (หลบหมด) ก่อน แล้วค่อย Protect (ลดดาเมจ)
  // side = ฝั่งของผู้ป้องกัน
  function applyFairyDefense(side, damage) {
    const fairy = side === "my" ? battleFairy : battleFoeFairy;
    const r = { damage, dodged: false, reduction: 0 };
    if (!fairy) return r;

    const sk = fairy.skills;
    let t = 0;
    const fire = k => { showFairyFx(side, k, t); t += 220; };

    if (sk.dodge && fairyRoll(sk.dodge.chance)) {
      r.dodged = true;
      r.damage = 0;
      fire("dodge");
      return r;
    }
    if (sk.protect && sk.protect.reduction > 0 && fairyRoll(sk.protect.chance)) {
      r.reduction = sk.protect.reduction;
      r.damage = Math.max(1, Math.round(damage * (1 - r.reduction / 100)));
      fire("protect");
    }
    return r;
  }

  // ตอนเราชนะ: Luck (คูณเหรียญรางวัล) และ XP (คูณ EXP) — ใช้ภูติฝั่งเรา
  function rollFairyWinBonus() {
    const r = { coinMult: 1, expMult: 1, notes: [] };
    if (!battleFairy) return r;

    const sk = battleFairy.skills;
    const name = fairyEsc(battleFairy.name);
    let t = 0;
    const fire = k => { showFairyFx("my", k, t); t += 220; };

    if (sk.luck && fairyRoll(sk.luck.chance)) {
      r.coinMult = sk.luck.multiplier;
      r.notes.push(`🍀 ${name} ช่วยให้เหรียญรางวัล ×${fairyFmt(sk.luck.multiplier)}`);
      fire("luck");
    }
    if (sk.xp && fairyRoll(sk.xp.chance)) {
      r.expMult = sk.xp.multiplier;
      r.notes.push(`✨ ${name} ช่วยให้ EXP ×${fairyFmt(sk.xp.multiplier)}`);
      fire("xp");
    }
    return r;
  }

  function safeParse(value, fallback = []) {
    if (Array.isArray(value)) return value;
    if (!value) return fallback;
    try { const parsed = JSON.parse(value); return parsed ?? fallback; } catch(e) { return fallback; }
  }

  // ⭐ กรองรายการ ClaimedRewards ให้เหลือเฉพาะรูปแบบที่ถูกต้อง เช่น "main_quest_0", "extra_quest_3"
  // เก็บเป็นสตริงตามที่บันทึกจริงใน Google Sheet (ห้ามแปลงเป็น Number)
  function sanitizeClaimedRewards(list, prefix) {
    if (!Array.isArray(list)) return [];
    const re = new RegExp(`^${prefix}_(\\d+)$`);
    return list
      .map(v => String(v).trim())
      .filter(v => re.test(v));
  }

  // ⭐ รางวัลของแต่ละภารกิจ เพิ่มขึ้นเรื่อยๆ แบบลำดับเลขคณิต 50, 60, 70, ...
  const MISSION_REWARD_BASE = 50;
  const MISSION_REWARD_STEP = 10;
  function getMissionReward(idx) {
    return MISSION_REWARD_BASE + MISSION_REWARD_STEP * idx;
  }

  async function fetchWithRetry(url, options = {}, retries = 3, delay = 1500, onRetry = null) {
    for (let i = 0; i < retries; i++) {
      try {
        if (i > 0 && onRetry) onRetry(i + 1, retries);
        const response = await fetch(url, options);
        if (!response.ok) throw new Error("Network response was not ok");
        return await response.json();
      } catch (err) {
        if (i === retries - 1) throw err;
        await new Promise(res => setTimeout(res, delay));
      }
    }
  }

  async function handleLogin() {
    const u = document.getElementById("username").value.trim();
    const p = document.getElementById("password").value.trim();
    const loginBtn = document.getElementById("loginBtn");
    if (!u || !p) { alert("กรุณากรอกรหัสนักเรียนและรหัสผ่าน!"); return; }

    loginBtn.disabled = true;
    loginBtn.textContent = "กำลังเชื่อมต่อกับเซิร์ฟเวอร์...";

    try {
      const targetUrl = `${API_URL}?action=login&id=${encodeURIComponent(u)}&password=${encodeURIComponent(p)}`;
      const data = await fetchWithRetry(targetUrl, {}, 3, 1500, (attempt, max) => {
        loginBtn.textContent = `กำลังเชื่อมต่อใหม่ (ครั้งที่ ${attempt}/${max})...`;
      });

      if (!data.success) {
        alert(data.message || "รหัสนักเรียนหรือรหัสผ่านไม่ถูกต้อง");
        loginBtn.disabled = false;
        loginBtn.textContent = "เข้าบ้านสัตว์เลี้ยง";
        return;
      }

      if (data.serverTime) serverTimeOffsetMs = new Date(data.serverTime).getTime() - Date.now();

      const student = data.student;
      extraStudentMission = data.extraMission || null;
      
      const scoreVal = parseFloat(student["คะแนน"]) || 0;
      let filteredMissions = safeParse(student["ภารกิจ"]).filter(m => {
        const mName = String(m.name || "").trim().toLowerCase();
        return mName !== "xp" && mName !== "fairy";
      });

      let rawLastFed = student["LastFed"];
      let parsedLastFed = { food: "", water: "", validUntil: "" };
      try {
        if (rawLastFed) {
          parsedLastFed = typeof rawLastFed === "string" && rawLastFed.startsWith("{") ? JSON.parse(rawLastFed) : { food: rawLastFed, water: "", validUntil: "" };
        }
      } catch(e) { parsedLastFed = { food: "", water: "", validUntil: "" }; }

      let rawXpCol = student["xp"];
      let parsedXp = 0;
      try {
        if (typeof rawXpCol === "string" && rawXpCol.startsWith("{")) {
          let xpObj = JSON.parse(rawXpCol);
          parsedXp = parseInt(xpObj.xp) || 0;
        } else {
          parsedXp = parseInt(rawXpCol) || 0;
        }
      } catch(e) { parsedXp = parseInt(rawXpCol) || 0; }

      let parsedPets = safeParse(student["pets"]);
      let nowTimeMs = getReferenceDate().getTime();
      parsedPets.forEach(pet => {
        if (pet.power === undefined) pet.power = 10;
        if (pet.battle === undefined) pet.battle = false;
        
        if (typeof pet.battle === "string" && pet.battle.startsWith("rest_")) {
          let wakeTime = parseInt(pet.battle.split("_")[1]);
          const MAX_REST_MS = 3 * 60 * 60 * 1000;
          if (!isNaN(wakeTime) && nowTimeMs >= wakeTime) {
            pet.battle = false;
          } else if (!isNaN(wakeTime) && (wakeTime - nowTimeMs) > MAX_REST_MS) {
            // ค่าพักเก่าที่เกินจากบัคเวลาแช่แข็ง เกินสูงสุด 3 ชม. ให้ตัดกลับมาไม่เกิน 3 ชม.
            pet.battle = `rest_${nowTimeMs + MAX_REST_MS}`;
          }
        }
        // สิทธิ์โจมตี แยกเก็บของแต่ละตัว
         if (pet.atk === undefined) pet.atk = 10;
         if (pet.atkReset === undefined) pet.atkReset = 0;
         if (pet.atkReset && nowTimeMs >= pet.atkReset) {
          pet.atk = 10;
          pet.atkReset = 0;
        } else if (pet.atkReset) {
          const MAX_ATK_RESET_MS = 6 * 60 * 60 * 1000;
          if ((pet.atkReset - nowTimeMs) > MAX_ATK_RESET_MS) {
            // ค่ารีเซ็ตสิทธิ์เก่าที่เกินจากบัคเวลาแช่แข็ง ให้รีเซ็ตสิทธิ์คืนทันที
            pet.atk = 10;
            pet.atkReset = 0;
          }
        }
      });

      // ==========================
      // LOAD ITEMS FROM SERVER
      // ==========================
      const itemsKey = Object.keys(student).find(key => String(key).trim().toLowerCase() === "items");
      const rawItems = itemsKey ? student[itemsKey] : null;
      let parsedItems = {};

      try {
        if (rawItems !== undefined && rawItems !== null && String(rawItems).trim() !== "") {
          if (typeof rawItems === "string") {
            parsedItems = JSON.parse(rawItems.trim());
          } else if (typeof rawItems === "object" && !Array.isArray(rawItems)) {
            parsedItems = { ...rawItems };
          }
        }
      } catch (e) {
        console.error("❌ ไม่สามารถอ่าน items ได้:", e);
        parsedItems = {};
      }

      if (!parsedItems || typeof parsedItems !== "object" || Array.isArray(parsedItems)) {
        parsedItems = {};
      }

      // แปลงจำนวน item ทุกชิ้นเป็นตัวเลข
      Object.keys(parsedItems).forEach(itemId => {
        parsedItems[itemId] = parseInt(parsedItems[itemId], 10) || 0;
      });
      
let parsedClaimedRewards = safeParse(student["ClaimedRewards"]);

if (!Array.isArray(parsedClaimedRewards)) {
  parsedClaimedRewards = [];
}

// ⭐ เก็บเป็นสตริงรูปแบบ "main_quest_N" ตามที่บันทึกไว้ใน Google Sheet
// (ห้ามแปลงเป็น Number เพราะ "main_quest_0" ไม่ใช่ตัวเลข จะกลายเป็น NaN แล้วโดนกรองทิ้งหมด
//  ทำให้ระบบลืมว่าเคยรับรางวัลไปแล้ว และกดรับซ้ำได้เรื่อยๆ)
parsedClaimedRewards = sanitizeClaimedRewards(parsedClaimedRewards, "main_quest");

      let parsedHistory = safeParse(student["history"]);
      currentStudent = {
        "รหัสนักเรียน": String(student["รหัสนักเรียน"]).trim(),
        "ชื่อ": student["ชื่อ"] || "-",
        "คะแนน": scoreVal,
        "coin": parseInt(student["coin"]) || 0,
        "xp": parsedXp,
        "pets": parsedPets,
        "ClaimedRewards": parsedClaimedRewards,
        "lastFed": parsedLastFed,
        "ชั้น": student["ชั้น"] || "-",
        "ภารกิจ": filteredMissions,
        "items": parsedItems,
        "history": parsedHistory
      };

      if (extraStudentMission) {

  let parsedExtraClaimed =
    safeParse(extraStudentMission.ClaimedRewards);

  if (!Array.isArray(parsedExtraClaimed)) {
    parsedExtraClaimed = [];
  }

  // ⭐ เช่นเดียวกับด้านบน ต้องเก็บเป็นสตริง "extra_quest_N" ห้ามแปลงเป็น Number
  extraStudentMission.ClaimedRewards =
    sanitizeClaimedRewards(parsedExtraClaimed, "extra_quest");


  let extraFilteredMissions =
    safeParse(extraStudentMission.ภารกิจ)
      .filter(m =>
        String(m.name || "")
          .trim()
          .toLowerCase() !== "xp"
      );

  extraStudentMission.ภารกิจ =
    extraFilteredMissions;
}

      studentKey = currentStudent["รหัสนักเรียน"];
      loadFairyData(data.fairyCatalog, student["Fairy"], student["fairyEquipped"]);
      
      // 🏝️ พื้นหลังอ่านจาก items (0=ไม่มี 1=มี 9=กำลังใช้) → ตั้งค่าหลัง loadWalletAndInventory ด้านล่าง
      currentBackground = "Grass.png";

      document.getElementById("loginPage").style.display = "none";
      document.getElementById("dashboard").style.display = "block";

      document.getElementById("displayName").textContent = currentStudent["ชื่อ"];
      document.getElementById("displayScore").textContent = currentStudent["คะแนน"];
      const classText = document.getElementById("displaySheet");
      if(classText) classText.textContent = currentStudent["ชั้น"];

      loadWalletAndInventory(student);
      // เกาะที่ใช้อยู่ = ค่า 9 ใน items (normalizeBgState ทำใน loadWalletAndInventory แล้ว)
      currentBackground = getEquippedBg();
      applyBackground(currentBackground);
      checkAndInitPets();
      renderPetsDOM();
      refreshHungerState();
      renderMissions();
      renderShopList('pet');
      renderFoodGrid();
      startWanderLoop();
      startPetDepthLoop();
      startDayWatcher();
      checkAwayAttacks();

    } catch (err) {
      console.error("Login Error:", err);
      alert("เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ กรุณาลองใหม่");
      loginBtn.disabled = false;
      loginBtn.textContent = "เข้าบ้านสัตว์เลี้ยง";
    }
  }

  function getReferenceDate() { return new Date(Date.now() + serverTimeOffsetMs); }
  function todayStr(){ const d = getReferenceDate(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
  function yesterdayStr(){ const d = new Date(getReferenceDate().getTime()); d.setDate(d.getDate()-1); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
  function calculateFutureDate(days) { const d = getReferenceDate(); d.setDate(d.getDate() + days); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
  function diffDays(dateStr1, dateStr2) { return Math.floor((new Date(dateStr1) - new Date(dateStr2)) / (1000 * 60 * 60 * 24)); }

  function loadWalletAndInventory(student) {
    wallet.coins = parseInt(student["coin"]) || 0;
    wallet.exp = currentStudent.xp;

    inventory = { ...(currentStudent.items || {}) };

    if (typeof inventory !== "object" || Array.isArray(inventory)) {
      inventory = {};
    }

    Object.keys(inventory).forEach(itemId => {
      inventory[itemId] = parseInt(inventory[itemId]) || 0;
    });

    if (inventory.vaccine === undefined) inventory.vaccine = 0;
    if (inventory.potion === undefined) inventory.potion = 0;

    currentStudent.items = { ...inventory };

    // ⭐ ซิงก์รายการที่ "ซื้อแล้ว" (เช่น ฉากหลัง) กลับมาจาก inventory ที่โหลดจาก server
    // ถ้าไม่ทำขั้นนี้ purchasedItems จะว่างเปล่าทุกครั้งที่เข้าใหม่ ทำให้ของที่ซื้อแล้วกลายเป็นให้ซื้อซ้ำ
    normalizeBgState();
    purchasedItems = Object.keys(inventory).filter(id => (parseInt(inventory[id]) || 0) > 0);
    if (!purchasedItems.includes("Grass.png")) purchasedItems.push("Grass.png");

    updateLevelFromExp();

    document.getElementById("displayStreak").textContent = localStorage.getItem(`pet_streak_${studentKey}`) || 0;

    updateWalletUI();
  }

function isMissionDone(mission) {

  // ถ้ามีฟิลด์สถานะเป็นข้อความ (เผื่ออนาคตเปลี่ยนมาใช้คำ เช่น "ส่งแล้ว")
  const rawStatus =
    mission?.status ??
    mission?.Status ??
    mission?.["สถานะ"] ??
    mission?.missionStatus ??
    "";

  const status = String(rawStatus)
    .trim()
    .replace(/\s+/g, "")
    .toLowerCase();

  if ([
    "ส่งแล้ว",
    "ส่งงานแล้ว",
    "submitted",
    "done",
    "complete",
    "completed"
  ].includes(status)) {
    return true;
  }

  // ⭐ ในชีทจริงคอลัมน์ภารกิจเก็บเป็น "คะแนน" (ตัวเลข) เช่น 5, 10
  // ถ้ามีคะแนนมากกว่า 0 แปลว่าส่งงาน/ทำภารกิจนี้เสร็จแล้ว
  const scoreVal = parseFloat(mission?.score);
  if (!isNaN(scoreVal) && scoreVal > 0) {
    return true;
  }

  return false;
}

  function updateLevelFromExp() {
    let exp = wallet.exp, lvl = 1, requiredExp = 300, increment = 320; 
    if (exp >= requiredExp) {
      lvl = 2;
      while (exp >= requiredExp) { requiredExp += increment; increment += 35; lvl++; }
      wallet.level = lvl - 1;
    } else { wallet.level = 1; }

    let prevReq = 0, currReq = 300, inc = 320;
    for(let i = 1; i < wallet.level; i++) { prevReq = currReq; currReq += inc; inc += 35; }
    const currentLevelProgress = exp - prevReq, spanNeeded = currReq - prevReq;
    const percent = Math.min(100, Math.max(0, (currentLevelProgress / spanNeeded) * 100));

    document.getElementById("displayLevel").textContent = wallet.level;
    document.getElementById("currentLevelExp").textContent = currentLevelProgress;
    document.getElementById("nextLevelExp").textContent = spanNeeded;
    document.getElementById("xpFillBar").style.width = percent + "%";
  }

  function getMaxAllowedPets() { return Math.floor((wallet.level - 1) / 3) + 1; }

  function addHistoryLog(actionType, detailText) {
    if (!Array.isArray(currentStudent.history)) {
      currentStudent.history = [];
    }

    // สร้างข้อมูลประวัติใหม่
    const logEntry = {
      timestamp: new Date().toISOString(),
      dateStr: todayStr(),
      type: actionType, // เช่น "battle_win", "battle_lose", "breed", "feed"
      detail: detailText
    };

    // เพิ่มไว้ด้านบนสุดของอาร์เรย์
    currentStudent.history.unshift(logEntry);

    // จำกัดจำนวนประวัติไม่ให้ยาวเกินไป (เช่น เก็บไว้ 50 รายการล่าสุด)
    if (currentStudent.history.length > 50) {
      currentStudent.history = currentStudent.history.slice(0, 50);
    }
  }

  // ⭐ แก้บั๊ก "ให้น้ำ/ให้อาหารแล้ว กลับมาหิวใหม่": เดิมเซฟหลายคำขอพร้อมกันได้
  //    ฝั่ง Google Apps Script ประมวลผลไม่เรียงลำดับ → คำขอเก่า (ยังไม่มี water/food ใหม่) อาจเขียนทับคำขอใหม่
  //    ตอนนี้เซฟทีละคำขอเสมอ และถ้ามีการเปลี่ยนข้อมูลระหว่างเซฟ จะส่งสถานะล่าสุดซ้ำอีกรอบทันที
  let _saveInFlight = null;
  let _saveDirty = false;
  function saveWalletAndData() {
    _saveDirty = true;
    if (_saveInFlight) return _saveInFlight;
    _saveInFlight = (async () => {
      try {
        while (_saveDirty) {
          _saveDirty = false;
          await _saveWalletAndDataNow();
        }
      } catch (err) {
        _saveDirty = false;
        popMessage("⚠️ บันทึกข้อมูลไม่สำเร็จ กรุณาตรวจสอบอินเทอร์เน็ต");
        throw err;
      } finally {
        _saveInFlight = null;
      }
    })();
    return _saveInFlight;
  }

  async function _saveWalletAndDataNow() {

  currentStudent.items = {
    ...(inventory || {})
  };

  Object.keys(currentStudent.items).forEach(key => {
    currentStudent.items[key] =
      parseInt(currentStudent.items[key]) || 0;
  });

  inventory = {
    ...currentStudent.items
  };

  updateWalletUI();

  const payload = new URLSearchParams({
    action: "saveGameData",
    id: studentKey,
    coin: String(wallet.coins),
    xp: String(wallet.exp),
    pets: JSON.stringify(
      currentStudent.pets || []
    ),
    claimed: JSON.stringify(
      currentStudent.ClaimedRewards || []
    ),
    extraClaimed:
      extraStudentMission
        ? JSON.stringify(
            extraStudentMission.ClaimedRewards || []
          )
        : JSON.stringify([]),

    lastFed: JSON.stringify(
      currentStudent.lastFed || {
        food: "",
        water: "",
        validUntil: ""
      }
    ),

    items: JSON.stringify(
      currentStudent.items || {}
    ),
    history: JSON.stringify(currentStudent.history || [])
  });

  let lastError = null;

  // ⭐ ลองบันทึกสูงสุด 3 ครั้ง
  for (let attempt = 1; attempt <= 3; attempt++) {

    try {

      console.log(
        `💾 SAVE MY DATA attempt ${attempt}/3`
      );

      const response = await fetch(
        API_URL,
        {
          method: "POST",
          body: payload
        }
      );

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}`
        );
      }

      const result =
        await response.json();

      console.log(
        "📥 SAVE MY DATA RESULT:",
        result
      );

      // ⭐ สำคัญ
      // API ตอบ success:false ต้องถือว่าเซฟไม่สำเร็จ
      if (!result || result.success !== true) {

        throw new Error(
          result?.message ||
          "บันทึกข้อมูลไม่สำเร็จ"
        );
      }

      console.log(
        "✅ SAVE MY DATA SUCCESS"
      );

      return result;

    } catch (err) {

      lastError = err;

      console.error(
        `❌ SAVE MY DATA FAILED attempt ${attempt}/3:`,
        err
      );

      // ถ้ายังเหลือรอบ ให้รอ 1.5 วินาที
      if (attempt < 3) {

        await new Promise(
          resolve =>
            setTimeout(resolve, 1500)
        );
      }
    }
  }

  // ⭐ ล้มเหลวทั้ง 3 ครั้ง
  throw new Error(
    "ไม่สามารถบันทึกข้อมูลผู้เล่นได้หลังจากลอง 3 ครั้ง: " +
    (lastError?.message || "Unknown error")
  );
}

  function updateWalletUI(){
    document.getElementById("displayCoins").textContent = wallet.coins;
    renderBagInventory();
    updateLevelFromExp();
  }

  function checkAndInitPets(){
    if(!Array.isArray(currentStudent.pets)) currentStudent.pets = [];
    const nowStr = todayStr();
    const lastWater = currentStudent.lastFed ? currentStudent.lastFed.water : "";
    const validUntil = currentStudent.lastFed ? currentStudent.lastFed.validUntil : "";

    currentStudent.pets.forEach(pet => {
      if(pet.sick === undefined) pet.sick = false;
      if(pet.dead === undefined) pet.dead = false;
      if(pet.power === undefined) pet.power = 10;
      if(pet.battle === undefined) pet.battle = false;
      if(!pet.born) pet.born = nowStr; 

      // 🤒 สุ่มป่วยแยกรายตัว (วันละครั้ง/ตัว) เมื่อละเลยการให้น้ำ
      const waterGap = lastWater ? diffDays(nowStr, lastWater) : 0;
      const neglectDays = waterGap - (PET_SICK_NEGLECT_DAYS - 1);   // จำนวนวันที่เลยเกณฑ์มา
      if (!pet.dead && !pet.sick && neglectDays > 0 && pet.sickRoll !== nowStr) {
        // ถ้าไม่ได้เปิดเกมหลายวัน ให้สุ่มรวมเฉพาะวันที่ยังไม่เคยสุ่ม
        const rollDays = pet.sickRoll ? Math.min(neglectDays, Math.max(1, diffDays(nowStr, pet.sickRoll))) : neglectDays;
        const chance = 1 - Math.pow(1 - PET_SICK_CHANCE_PER_DAY, rollDays);
        pet.sickRoll = nowStr;
        if (Math.random() < chance) pet.sick = true;
      }

      // 💀 ตายเมื่อไม่ได้กินอาหารเกิน PET_DEAD_AFTER_DAYS วัน (นับจากหมดอิ่ม หรือวันเกิดของตัวนั้น ถ้าใหม่กว่า)
      const hungerStart = (validUntil && validUntil > pet.born) ? validUntil : pet.born;
      if (!pet.dead && diffDays(nowStr, hungerStart) > PET_DEAD_AFTER_DAYS) pet.dead = true;
    });
  }

  function getPetImage(type, isLeg = false) {
    const info = PET_INFO[type] || PET_INFO.cat;
    return "Animals/" + (isLeg ? info.leg : info.body);
  }

  // ⭐ ภาพไอคอนสัตว์สำหรับหน้าเลือกสัตว์ต่อสู้ = Shop/ชื่อสัตว์_shop.png (ชื่อไฟล์อิงจาก body ใน PET_INFO)
  function getPetShopImage(type) {
    const info = PET_INFO[type] || PET_INFO.cat;
    return "Shop/" + info.body.replace("_body.png", "_shop.png");
  }

  function getPetSkillPrefix(type) {
    return (PET_INFO[type] || PET_INFO.cat).skill;
  }

  function getPetName(type) {
    const shopPet = SHOP_ITEMS.find(si => si.type === 'pet' && si.id === type);
    if (shopPet) return shopPet.name;
    return (PET_INFO[type] && PET_INFO[type].name) || type;
  }

  function renderPetsDOM(){
    const hasIsland = !!(window.Island && Island.ready());   // 🏝️ โหมดเกาะลอยฟ้า (island.js)
    if (hasIsland) Island.stopAll();                          // กันตัวเดินเก่าไปขยับ element ใหม่
    const container = document.getElementById("petsContainer");
    container.innerHTML = "";
    petInstances = [];
    const sceneW = document.getElementById("scene") ? document.getElementById("scene").clientWidth : 380;

    currentStudent.pets.forEach((pet, index) => {
      if (pet.breed) return;

      const isBaby = isPetBaby(pet.born);
      let x, y;
      if (hasIsland) { const sp = Island.spawnPos(index); x = sp.x; y = sp.y; }   // พิกัดโลก (พิกเซลของ Grass.png)
      else { x = sceneW * 0.2 + (index * 60) % (sceneW * 0.6); y = 45 + (index * 10) % 20; }

      petInstances[index] = ({ index: index, type: pet.type, born: pet.born, sick: pet.sick, dead: pet.dead, x: x, y: y, targetX: x, targetY: y, isWalking: false });

      const el = document.createElement("div");
      el.className = `avatar-container pet-${pet.type} ${isBaby ? 'baby' : ''} ${pet.dead ? 'dead' : ''}`;
      el.id = `pet_el_${index}`;
      if (hasIsland) Island.place(index, petInstances[index], el);
      else { el.style.left = x + "px"; el.style.top = y + "%"; }
      el.onclick = (e) => tapPet(e, index);
      applyPetLayout(el, pet.type);

      let bodyImg = getPetImage(pet.type, false), legImg = getPetImage(pet.type, true);
      let iconHTML = pet.dead ? `<img src="Icon/ghost.png" class="pet-icon-status" alt="วิญญาณ">` : (pet.sick ? `<img src="Icon/sick.png" class="pet-icon-status" alt="ป่วย">` : (isBaby ? `<img src="Icon/baby.png" class="pet-icon-status" alt="เด็ก">` : ''));

      el.innerHTML = `
        ${iconHTML}
        <div class="pet-flip" id="pet_flip_${index}">
          <div class="pet-assembly">
            <img src="${legImg}" class="leg leg-back leg-back-left" alt="ขาหลังซ้าย">
            <img src="${legImg}" class="leg leg-back leg-back-right" alt="ขาหลังขวา">
            <img src="${bodyImg}" class="body-img" alt="${pet.type}">
            <img src="${legImg}" class="leg leg-front leg-front-left" alt="ขาหน้าซ้าย">
            <img src="${legImg}" class="leg leg-front leg-front-right" alt="ขาหน้าขวา">
          </div>
        </div>
      `;
      container.appendChild(el);
    });
    updatePetDepth();
  }

  // ⭐ เรียงชั้นภาพ (z-index) ตามตำแหน่งแนวตั้ง: ตัวที่อยู่ต่ำกว่า (ใกล้คนดูกว่า) จะอยู่ข้างหน้าเสมอ
  //    ใช้ offsetTop ซึ่งเปลี่ยนตามตำแหน่งจริงระหว่างเดิน (ไม่รวม scale/baby) จึงสลับชั้นกลางทางได้
  //    ช่วง z-index ที่ใช้ = PET_Z_MIN ถึง PET_Z_MAX (ต้องต่ำกว่าปุ่มชามน้ำ/แถบด้านบน) ถ้ามีสัตว์มากกว่าช่วงนี้ ตัวที่ใกล้กันจะเรียงตามลำดับเดิม
  const PET_Z_MIN = 5, PET_Z_MAX = 9;
  function updatePetDepth() {
    const els = Array.from(document.querySelectorAll("#petsContainer .avatar-container"));
    if (els.length === 0) return;
    // 🏝️ บนเกาะ: ชามอาหาร/น้ำเรียงชั้นร่วมกับสัตว์ตามตำแหน่งเท้า (ตัวที่อยู่ต่ำกว่าอยู่ข้างหน้า)
    const bowls = Array.from(document.querySelectorAll("#world .world-bowl"));
    if (bowls.length) {
      const all = els.map(el => ({ el, y: el.offsetTop + el.offsetHeight })).concat(bowls.map(el => ({ el, y: el.offsetTop })));
      all.sort((a, b) => a.y - b.y);
      all.forEach((o, i) => { const z = PET_Z_MIN + i; if (o.el.style.zIndex !== String(z)) o.el.style.zIndex = z; });   // อยู่ในโลก (stacking context ของตัวเอง) จึงเกิน 9 ได้
      return;
    }
    els.sort((a, b) => a.offsetTop - b.offsetTop);
    const span = PET_Z_MAX - PET_Z_MIN;
    els.forEach((el, i) => {
      const z = els.length > 1 ? PET_Z_MIN + Math.round(i * span / (els.length - 1)) : PET_Z_MIN;
      if (el.style.zIndex !== String(z)) el.style.zIndex = z;
    });
  }
  let _petDepthTimer = null;
  function startPetDepthLoop() {
    if (_petDepthTimer) return;
    _petDepthTimer = setInterval(updatePetDepth, 120);
  }

  function isPetBaby(bornDateStr){
    if(!bornDateStr) return false;
    return (getReferenceDate() - new Date(bornDateStr)) / (1000 * 60 * 60 * 24) < 3;
  }

  function refreshHungerState(){
    const lastWater = currentStudent.lastFed ? currentStudent.lastFed.water : "";
    const validUntil = currentStudent.lastFed ? currentStudent.lastFed.validUntil : "";
    const isWaterNeeded = (lastWater !== todayStr());
    const isFoodNeeded = !validUntil || todayStr() > validUntil;

    petInstances.forEach((pInst, idx) => {
      const el = document.getElementById(`pet_el_${idx}`);
      if(!el) return;
      const petData = currentStudent.pets[idx];
      if(petData){ pInst.sick = !!petData.sick; pInst.dead = !!petData.dead; }
      const oldIcon = el.querySelector('.pet-icon-status');
      if(oldIcon) oldIcon.remove();

      let iconToUse = pInst.dead ? 'Icon/ghost.png' : (pInst.sick ? 'Icon/sick.png' : (isWaterNeeded ? 'Icon/drink.png' : (isFoodNeeded ? 'Icon/hungry.png' : (isPetBaby(pInst.born) ? 'Icon/baby.png' : ''))));
      if(iconToUse) {
        const ic = document.createElement("img");
        ic.src = iconToUse; ic.className = "pet-icon-status";
        el.insertBefore(ic, el.firstChild);
      }
    });
  }

  function updateHoldingUI() {
    const badge = document.getElementById("holdingStatusBadge");
    if (!activeTool) { badge.style.display = "none"; return; }
    badge.style.display = "flex";
    document.getElementById("holdingIconImg").src = `Shop/${activeTool}.png`;
    document.getElementById("holdingText").textContent = activeTool === 'vaccine' ? "กำลังถือวัคซีน" : "กำลังถือยาเร่งโต";
  }

  function cancelHoldingTool(e) { e.stopPropagation(); activeTool = null; updateHoldingUI(); popMessage("ยกเลิกการถือไอเทมแล้ว"); }

  function switchShopTab(tabType, btnEl) {
    currentShopTab = tabType;
    document.querySelectorAll('#shopModal .shop-tab-btn').forEach(btn => btn.classList.remove('active'));
    btnEl.classList.add('active');
    document.getElementById("shopQuotaBox").style.display = (tabType === 'pet') ? "block" : "none";
    if(tabType === 'pet') updateShopQuotaDisplay();
    renderShopList(tabType);
  }

  function switchMissionTab(tabType, btnEl) {
    currentMissionTab = tabType;
    document.querySelectorAll('#missionModal .shop-tab-btn').forEach(btn => btn.classList.remove('active'));
    btnEl.classList.add('active');
    renderMissions();
  }

  // เกาะที่ "เป็นเจ้าของแล้ว" = เกาะฟรี หรือมีใน inventory (ไม่พึ่ง purchasedItems ที่อาจค้าง/ว่าง → กันซื้อซ้ำเสียเหรียญสองรอบ)
  function ownsBg(id){
    const it = SHOP_ITEMS.find(i => i.id === id && i.type === 'bg');
    if(!it) return false;
    return it.price === 0 || bgState(id) > 0;
  }

  // 🏝️ สถานะพื้นหลังเก็บใน items: 0 = ไม่มี · 1 = มี · 9 = กำลังใช้อยู่ (มีได้แค่ 1 เกาะ)
  const BG_NONE = 0, BG_OWNED = 1, BG_EQUIPPED = 9;
  function bgIds(){ return SHOP_ITEMS.filter(i => i.type === 'bg').map(i => i.id); }
  function bgState(id){ return parseInt(inventory[id]) || 0; }

  function getEquippedBg(){
    const eq = bgIds().find(id => bgState(id) === BG_EQUIPPED);
    return eq || "Grass.png";
  }

  // ตั้งเกาะที่ใช้: เกาะเดิมที่เป็น 9 ลดเหลือ 1, เกาะใหม่เป็น 9 (ต้องเรียก saveWalletAndData() เองหลังเรียก)
  function setEquippedBg(id){
    bgIds().forEach(b => { if(bgState(b) === BG_EQUIPPED) inventory[b] = BG_OWNED; });
    inventory[id] = BG_EQUIPPED;
    currentBackground = id;
    currentStudent.items = { ...inventory };
    purchasedItems = Object.keys(inventory).filter(k => bgState(k) > 0);
  }

  // เรียกตอนโหลดข้อมูล: เติมคีย์ที่ขาดเป็น 0, Grass.png (ฟรี) = อย่างน้อย 1, และให้มี 9 เพียงเกาะเดียว
  // ผู้เล่นเก่าที่ยังไม่มี 9 → ย้ายค่าจาก localStorage เดิม (pet_bg_...) มาให้ครั้งเดียว
  function normalizeBgState(){
    const ids = bgIds();
    ids.forEach(id => {
      let v = bgState(id);
      if(v !== BG_NONE && v !== BG_OWNED && v !== BG_EQUIPPED) v = v > 0 ? BG_OWNED : BG_NONE;   // ค่าเก่าแบบนับจำนวน (2,3...) → 1
      inventory[id] = v;
    });
    if(bgState("Grass.png") === BG_NONE) inventory["Grass.png"] = BG_OWNED;

    const equipped = ids.filter(id => bgState(id) === BG_EQUIPPED);
    let pick = equipped[0];
    if(!pick){
      let legacy = null;
      try { legacy = localStorage.getItem(`pet_bg_${studentKey}`); } catch(e) {}
      pick = (legacy && ownsBg(legacy)) ? legacy : "Grass.png";
    }
    ids.forEach(id => { if(bgState(id) === BG_EQUIPPED) inventory[id] = BG_OWNED; });
    inventory[pick] = BG_EQUIPPED;
    currentBackground = pick;
    currentStudent.items = { ...inventory };
  }

  function buyItem(itemObj){
    if(itemObj.type === 'pet' || itemObj.type === 'medicine' || itemObj.type === 'food' || (itemObj.type === 'bg' && !ownsBg(itemObj.id))){
      if(wallet.coins < itemObj.price){
        popMessage("เหรียญไม่พอจ้า!");
        return;
      }

      if(itemObj.type === 'pet' && currentStudent.pets.length >= getMaxAllowedPets()){
        popMessage(`เลเวล ${wallet.level} เลี้ยงสัตว์ได้สูงสุด ${getMaxAllowedPets()} ตัวเท่านั้น!`);
        return;
      }

      wallet.coins -= itemObj.price;

      if(itemObj.type === 'pet'){
        currentStudent.pets.push({
          type: itemObj.id,
          born: todayStr(),
          sick: false,
          dead: false,
          power: 10,
          battle: false,
          breed: false
        });
      } else {
        if(itemObj.type === 'bg'){
          // ซื้อเสร็จ → ใช้เกาะนั้นทันที (items: ใช้อยู่ = 9, เกาะเดิมที่ใช้อยู่ → 1)
          setEquippedBg(itemObj.id);
          applyBackground(currentBackground, true);
        } else {
          inventory[itemObj.id] = (parseInt(inventory[itemObj.id]) || 0) + 1;
          currentStudent.items = { ...inventory };
        }
      }

      saveWalletAndData();

      if(itemObj.type === 'pet'){
        renderPetsDOM();
        refreshHungerState();
      }

      if(itemObj.type === 'food'){
        renderFoodGrid();
      }

      updateWalletUI();

      if(itemObj.type === 'pet'){
        updateShopQuotaDisplay();
      }

      renderShopList(currentShopTab);
      popMessage(itemObj.type === 'bg' ? `ซื้อและเปลี่ยนเป็น ${itemObj.name} แล้ว! 🎉` : "ซื้อสำเร็จ! 🎉");
      return;
    }

    if(itemObj.type === 'bg' && ownsBg(itemObj.id)){
      setEquippedBg(itemObj.id);
      saveWalletAndData();
      applyBackground(currentBackground, true);
      popMessage(`เปลี่ยนเป็น ${itemObj.name} แล้ว!`);
      renderShopList(currentShopTab);
    }
  }

  // 🏝️ bgFilename = id เกาะ (Grass.png / Cherry.png) · ฉากหลังด้านหลังเกาะคือ back.png เสมอ
  //    rerender=true เมื่อสลับเกาะกลางเกม → วางสัตว์ใหม่บนเกาะนั้น
  function applyBackground(bgFilename, rerender) {
    const sceneEl = document.getElementById("scene");
    const hasIsland = !!(window.Island && Island.ready());
    if(sceneEl) sceneEl.style.backgroundImage = `url("Background/${hasIsland ? 'back.png' : bgFilename}")`;
    if(hasIsland && Island.setIsland(bgFilename) && rerender){
      renderPetsDOM();
      refreshHungerState();
    }
  }

  function renderShopList(tabType = 'pet'){
    const container = document.getElementById("shopListContainer");
    if(!container) return;
    container.innerHTML = SHOP_ITEMS.filter(item => item.type === tabType && !item.noShop).map(item => {
      let btnText = "ซื้อ", btnClass = "buy-btn";
      if(item.type === 'bg') {
        if(currentBackground === item.id) { btnText = "ใช้อยู่"; btnClass = "buy-btn equipped"; }
        else if(ownsBg(item.id)) { btnText = "ใช้"; }
      }
      return `
        <div class="shop-item">
          <img src="${item.img}" class="shop-img" alt="${item.name}">
          <div class="shop-info">
            <div class="shop-name">${item.name}</div>
            <div class="shop-price">
              ${item.price > 0 ? `💰 ${item.price} เหรียญ` : 'ฟรี'}
              ${item.days ? `(อิ่ม ${item.days} วัน)` : ''}
              ${item.type === 'medicine' || item.type === 'food' ? ` | มี ${inventory[item.id] || 0} ชิ้น` : ''}
            </div>
          </div>
          <button class="${btnClass}" onclick='buyItem(${JSON.stringify(item)})'>${btnText}</button>
        </div>
      `;
    }).join('');
  }

  function updateShopQuotaDisplay() {
    const quotaText = document.getElementById("shopPetQuotaText"), currentLvlText = document.getElementById("shopCurrentLevel");
    if(quotaText && currentLvlText) {
      quotaText.textContent = `${currentStudent.pets.length}/${getMaxAllowedPets()} ตัว`;
      currentLvlText.textContent = wallet.level;
    }
  }

  function openBagModal(){ updateWalletUI(); document.getElementById("bagModal").style.display = "flex"; }

  // เมนูหลักในกระเป๋า: ปิดกระเป๋าก่อน แล้วเปิดหน้าที่เลือก
  function menuGo(target){
    if (target === 'exit') { location.reload(); return; }
    closeModal('bagModal');
    activeTool = null; updateHoldingUI();
    const actions = {
      battle: openBattleScreen,
      breed: openBreedModal,
      shop: openShopModal,
      rank: openRankModal,
      mission: openMissionModal,
      fairy: openFairyBook,
      minigame: () => openMgHub()
    };
    if (actions[target]) actions[target]();
  }

  // แสดงของในกระเป๋า: ยา (กดใช้ได้) + อาหารที่มี
  function renderBagInventory(){
    const el = document.getElementById("bagInventoryList");
    if (!el) return;
    const cards = [];
    const meds = [
      { id: 'vaccine', name: 'วัคซีนรักษาโรค', img: 'Shop/vaccine.png' },
      { id: 'potion',  name: 'ยาเร่งโต',       img: 'Shop/potion.png' }
    ];
    meds.forEach(m => {
      const n = parseInt(inventory[m.id]) || 0;
      cards.push(`
        <div class="bag-inv-item ${n > 0 ? 'usable' : 'empty'}" ${n > 0 ? `onclick="useItemFromBag('${m.id}')"` : ''}>
          <img src="${m.img}" alt="${m.name}">
          <div class="bag-inv-name">${m.name}</div>
          <div class="bag-inv-count num">x${n}</div>
          ${n > 0 ? '<div class="bag-inv-use">แตะเพื่อใช้</div>' : ''}
        </div>`);
    });
    SHOP_ITEMS.filter(i => i.type === 'food' && (parseInt(inventory[i.id]) || 0) > 0).forEach(f => {
      cards.push(`
        <div class="bag-inv-item">
          <img src="${f.img}" alt="${f.name}">
          <div class="bag-inv-name">${f.name}</div>
          <div class="bag-inv-count num">x${inventory[f.id]}</div>
        </div>`);
    });
    el.innerHTML = cards.join('');
  }

  function useItemFromBag(itemType){
    if(inventory[itemType] <= 0){ popMessage("ไอเทมในกระเป๋าหมดแล้ว!"); return; }
    activeTool = itemType;
    closeModal('bagModal');
    updateHoldingUI();
    popMessage(itemType === 'vaccine' ? "💉 เลือกตัวน้องที่ต้องการฉีดยาเลย!" : "🧪 เลือกตัวน้องที่ต้องการเร่งโตเลย!");
  }

  function openBreedModal() {
    if (currentStudent.pets.length < 2) { 
      popMessage("คุณต้องมีสัตว์เลี้ยงอย่างน้อย 2 ตัวจึงจะสามารถผสมพันธุ์ได้!"); 
      return; 
    }

    const activeBreedingPets = currentStudent.pets.filter(p => p.breed && !p.isPendingBreedResult);
    const pendingChild = currentStudent.pets.find(p => p.isPendingBreedResult);

    if (activeBreedingPets.length >= 2 || pendingChild) {
      if (activeBreedingPets.length >= 2) {
        breedSelectedPets = [
          currentStudent.pets.indexOf(activeBreedingPets[0]),
          currentStudent.pets.indexOf(activeBreedingPets[1])
        ];
      }
      updateBreedSlotsUI(true);
      startBreedCountdownTimer();
    } else {
      breedSelectedPets = [null, null];
      updateBreedSlotsUI(false);
    }

    document.getElementById("breedModal").style.display = "flex";
  }

  function openBreedSelector(slotIndex) {
    activeBreedSlotIndex = slotIndex;
    const listEl = document.getElementById("breedSelectorList");
    const otherSlotPetIndex = slotIndex === 0 ? breedSelectedPets[1] : breedSelectedPets[0];
    let html = "";

    currentStudent.pets.forEach((pet, idx) => {
      if (pet.dead || idx === otherSlotPetIndex || isPetBaby(pet.born)) return;
      
      const shopItemRef = SHOP_ITEMS.find(si => si.id === pet.type);
      html += `
        <div class="breed-candidate-item" onclick="selectPetForBreed(${idx})">
          <img src="${getPetImage(pet.type, false)}" class="breed-candidate-img" alt="${pet.type}">
          <div>
            <div style="font-weight:600; font-size:13px; color:var(--ink);">${getPetName(pet.type)}</div>
            <div style="font-size:10px; color:var(--ink-soft);">เกิดเมื่อ: ${pet.born} (โตเต็มวัยแล้ว) | พลัง: ${pet.power || 10}</div>
          </div>
        </div>
      `;
    });
    
    listEl.innerHTML = html || `<div style="text-align:center; padding:15px; color:var(--ink-soft); font-size:12px;">ไม่มีสัตว์เลี้ยงที่โตเต็มวัยสำหรับผสมพันธุ์</div>`;
    document.getElementById("breedSelectorModal").style.display = "flex";
  }

  function selectPetForBreed(petIndex) { 
    breedSelectedPets[activeBreedSlotIndex] = petIndex; 
    closeModal('breedSelectorModal'); 
    updateBreedSlotsUI(); 
  }

  function updateBreedSlotsUI(isLocked = false) {
    for (let i = 0; i < 2; i++) {
      const slotEl = document.getElementById(`breedSlot${i+1}`);
      const petIdx = breedSelectedPets[i];
      
      if (petIdx !== null && currentStudent.pets[petIdx]) {
        slotEl.className = "breed-slot filled";
        slotEl.innerHTML = `<img src="${getPetImage(currentStudent.pets[petIdx].type, false)}" alt="">`;
      } else {
        slotEl.className = "breed-slot";
        slotEl.innerHTML = `<span class="breed-plus">+</span>`;
      }
      
      if (isLocked) {
        slotEl.onclick = null;
        slotEl.style.cursor = "default";
      } else {
        slotEl.onclick = () => openBreedSelector(i);
        slotEl.style.cursor = "pointer";
      }
    }

    const actionArea = document.getElementById("breedActionArea");
    const descText = document.getElementById("breedDescText");
    const activeBreedingPets = currentStudent.pets.filter(p => p.breed && !p.isPendingBreedResult);
    const pendingChild = currentStudent.pets.find(p => p.isPendingBreedResult);

    if (activeBreedingPets.length >= 2 || pendingChild) {
      descText.textContent = "🐾 คู่ผสมพันธุ์นี้กำลังปฏิบัติภารกิจ กรุณารอเวลาให้เสร็จสิ้น!";
    } else {
      descText.textContent = "เลือกสัตว์ 2 ตัวมาผสมพันธุ์เพื่อสุ่มรับสมาชิกใหม่!";
      const isValid = (breedSelectedPets[0] !== null && breedSelectedPets[1] !== null);
      actionArea.innerHTML = `
        <button id="startBreedBtn" onclick="executeBreed()" class="buy-btn" style="width:100%; padding:12px; font-size:14px; background:var(--berry); color:#fff; box-shadow:0 3px 0 var(--berry-dark); margin-top:5px; opacity:${isValid ? '1' : '0.5'};" ${isValid ? '' : 'disabled'}>
          เริ่มผสมพันธุ์ (6 ชม.)
        </button>`;
    }
  }

  async function executeBreed() {
    if (breedSelectedPets[0] === null || breedSelectedPets[1] === null) return;
    
    const activePetsCount = currentStudent.pets.filter(p => !p.dead).length;
    if (activePetsCount + 1 > getMaxAllowedPets()) { 
      popMessage(`พื้นที่เลี้ยงสัตว์ไม่พอสำหรับสัตว์ใหม่! (สูงสุด ${getMaxAllowedPets()} ตัว)`); 
      return; 
    }

    const p1 = currentStudent.pets[breedSelectedPets[0]];
    const p2 = currentStudent.pets[breedSelectedPets[1]];

    if (isPetBaby(p1.born) || isPetBaby(p2.born)) {
      popMessage("สัตว์เลี้ยงต้องโตเต็มวัย (ไม่ใช่ Baby) ถึงจะผสมพันธุ์ได้!");
      return;
    }

    const endTimeMs = getReferenceDate().getTime() + 6 * 60 * 60 * 1000;
    const endTimeIso = new Date(endTimeMs).toISOString();

    p1.breed = true;
    p2.breed = true;
    p1.breedEndTime = endTimeIso;
    p2.breedEndTime = endTimeIso;

    const possibleTypes = ["dog", "cat", "giraffe", "sheep", "deer", "siberianhusky", "elepant", "bear", "shiba", "littledragon"];   // ไม่มี firedragon (ได้จากวงล้อมินิเกมเท่านั้น)
    const totalWeight = possibleTypes.reduce((sum, t) => sum + (BREED_WEIGHTS[t] ?? 1), 0);
    let breedRoll = Math.random() * totalWeight;
    let babyType = possibleTypes[possibleTypes.length - 1];
    for (const t of possibleTypes) {
      breedRoll -= (BREED_WEIGHTS[t] ?? 1);
      if (breedRoll < 0) { babyType = t; break; }
    }
    
    currentStudent.pets.push({
      type: babyType,
      born: todayStr(),
      sick: false,
      dead: false,
      power: 10,
      battle: false,
      breed: true,
      isPendingBreedResult: true,
      breedEndTime: endTimeIso
    });

    renderPetsDOM();
    refreshHungerState();
    await saveWalletAndData();

    updateBreedSlotsUI(true);
    startBreedCountdownTimer();
    popMessage(`💖 เริ่มผสมพันธุ์สำเร็จ! สัตว์ทั้งสองตัวหลบไปผสมพันธุ์แล้ว (ใช้เวลา 6 ชม.)`);
  }

  function startBreedCountdownTimer() {
    if (breedTimerInterval) clearInterval(breedTimerInterval);

    const actionArea = document.getElementById("breedActionArea");

    function updateTimer() {
      const pendingChild = currentStudent.pets.find(p => p.isPendingBreedResult);
      if (!pendingChild) {
        clearInterval(breedTimerInterval);
        return;
      }

      const now = new Date().getTime();
      const endTime = new Date(pendingChild.breedEndTime).getTime();
      const diffTime = endTime - now;

      if (diffTime <= 0) {
        clearInterval(breedTimerInterval);
        actionArea.innerHTML = `
          <button onclick="claimBreedResult()" class="buy-btn" style="background:var(--leaf); color:#fff; width:100%; padding:12px; font-size:14px; box-shadow:0 3px 0 #2c7048; margin-top:5px;">
            🎉 ผสมพันธุ์เสร็จสิ้น! กดรับลูกสัตว์
          </button>`;
      } else {
        const hours = Math.floor(diffTime / (1000 * 60 * 60));
        const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);

        actionArea.innerHTML = `
          <div style="background:#fff3e6; border:1.5px solid var(--sun-dark); padding:10px; border-radius:12px; text-align:center; margin-top:8px;">
            <div style="font-size:11px; color:var(--ink-soft);">⏳ กำลังผสมพันธุ์...</div>
            <div class="num" style="font-size:18px; font-weight:700; color:var(--berry-dark);">${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}</div>
          </div>`;
      }
    }

    updateTimer();
    breedTimerInterval = setInterval(updateTimer, 1000);
  }

  async function claimBreedResult() {
    if (breedTimerInterval) clearInterval(breedTimerInterval);

    currentStudent.pets.forEach(p => {
      if (p.breed) {
        delete p.breed;
        delete p.breedEndTime;
      }
      if (p.isPendingBreedResult) {
        delete p.isPendingBreedResult;
      }
    });

    breedSelectedPets = [null, null];
    renderPetsDOM();
    refreshHungerState();
    updateShopQuotaDisplay();
    await saveWalletAndData();
    closeBreedModal('breedModal');
    spawnHeartsForAll(3);
    popMessage("✨ รับสมาชิกใหม่เข้าบ้านสำเร็จ!");
  }

  async function closeBreedModal(modalId) {
    closeModal(modalId);
    if (breedTimerInterval) {
      clearInterval(breedTimerInterval);
      breedTimerInterval = null;
    }
  }

  async function giveWater(e){
    e.stopPropagation();
    if (currentStudent.pets.length === 0) { popMessage("คุณยังไม่มีสัตว์เลี้ยงในบ้าน!"); return; }
    activeTool = null; updateHoldingUI();
    if (currentStudent.lastFed.water === todayStr()) { popMessage("น้องๆ ดื่มน้ำสะอาดอิ่มแล้วจ้า"); return; }

    currentStudent.lastFed.water = todayStr();
    currentStudent.pets.forEach(pet => { if(!pet.dead) pet.sick = false; });
    moveAllPetsToBowl(); refreshHungerState(); spawnHeartsForAll(2);          
    await saveWalletAndData();
    popMessage("เติมน้ำสะอาดให้แล้ว สัตว์ๆ ชื่นใจมาก!");
  }

  function openFoodModal(e){
    e.stopPropagation();
    if (currentStudent.pets.length === 0) { popMessage("คุณยังไม่มีสัตว์เลี้ยงในบ้าน!"); return; }
    activeTool = null; updateHoldingUI();
    if (currentStudent.lastFed.water !== todayStr()) { popMessage("ต้องให้น้ำดื่มก่อน ให้น้องกินข้าวนะ!"); return; }
    if (currentStudent.lastFed.validUntil && todayStr() <= currentStudent.lastFed.validUntil) { popMessage("น้องยังอิ่มอยู่ ยังไม่หิวในตอนนี้จ้า!"); return; }

    renderFoodGrid();
    document.getElementById("foodModal").style.display = "flex";
  }

  function renderFoodGrid(){
    const container = document.getElementById("foodGridContainer");
    if(!container) return;

    const availableFoods = SHOP_ITEMS.filter(item => item.type === 'food' && (parseInt(inventory[item.id]) || 0) > 0);

    if(availableFoods.length === 0) {
      container.innerHTML = `
        <div style="grid-column: span 3; text-align:center; padding:20px; font-size:13px; color:var(--ink-soft);">
          ยังไม่มีอาหารในกระเป๋า<br>
          ไปซื้ออาหารที่ร้านค้าก่อนนะ! 🛒
        </div>`;
      return;
    }

    container.innerHTML = availableFoods.map(f => `
      <div class="food-card" onclick="feedWithFood('${f.id}', ${f.days})">
        <img src="${f.img}" alt="${f.name}">
        <div class="f-name">${f.name}</div>
        <div class="f-duration">
          อิ่ม ${f.days} วัน | มี ${inventory[f.id] || 0} ชิ้น
        </div>
      </div>
    `).join('');
  }

  async function feedWithFood(foodId, durationDays){
    const currentCount = parseInt(inventory[foodId]) || 0;

    if(currentCount <= 0){
      popMessage("อาหารชนิดนี้หมดแล้ว!");
      renderFoodGrid();
      return;
    }

    inventory[foodId] = currentCount - 1;
    closeModal('foodModal');

    let streak = parseInt(localStorage.getItem(`pet_streak_${studentKey}`) || "0");
    streak = (currentStudent.lastFed.food === yesterdayStr()) ? streak + 1 : 1;
    localStorage.setItem(`pet_streak_${studentKey}`, streak);

    currentStudent.lastFed = {
      ...currentStudent.lastFed,   // เก็บ Q1..Q6 (สถานะแปลงผัก) ไว้ด้วย
      food: foodId,
      water: currentStudent.lastFed.water,
      validUntil: calculateFutureDate(durationDays)
    };

    document.getElementById("displayStreak").textContent = streak;

    moveAllPetsToBowl();
    refreshHungerState();
    spawnHeartsForAll(3);

    await saveWalletAndData();
    popMessage(`ให้อาหารสำเร็จ! เหลือ ${inventory[foodId]} ชิ้น`);
  }

  function moveAllPetsToBowl(){
    if (window.Island && Island.ready()) {          // 🏝️ วิ่งไปรวมกันที่จุดชามบนเกาะ แล้วพากล้องไปดู
      petInstances.forEach((pInst, idx) => {
        if (!pInst || currentStudent.pets[idx].dead) return;
        const t = Island.bowlTarget();
        Island.walkTo(idx, pInst, t.x, t.y, Island.RUN_SPEED);
      });
      Island.focusBowl();
      return;
    }
    const sceneW = document.getElementById("scene") ? document.getElementById("scene").clientWidth : 380;
    const bowlX = sceneW * 0.45;
    petInstances.forEach((pInst, idx) => {
      if(currentStudent.pets[idx].dead) return;
      pInst.targetX = bowlX + (Math.random() * 60 - 30); pInst.targetY = 75;
      animatePetMove(idx);
    });
  }

  async function animatePetMove(idx){
    const pInst = petInstances[idx], el = document.getElementById(`pet_el_${idx}`);
    if(!el) return;
    if(pInst.targetX < (parseFloat(el.style.left) || pInst.x)) el.classList.add("facing-left"); else el.classList.remove("facing-left");
    el.classList.add("walking");
    el.style.transition = "left 1.8s ease-in-out, top 1.8s ease-in-out";
    el.style.left = pInst.targetX + "px"; el.style.top = pInst.targetY + "%";
    pInst.x = pInst.targetX; pInst.y = pInst.targetY;
    setTimeout(() => el.classList.remove("walking"), 1800);
  }

  async function tapPet(e, idx){
    e.stopPropagation();

    const pet = currentStudent.pets[idx];

    if(pet.dead){
      currentStudent.pets.splice(idx, 1);
      await saveWalletAndData();
      renderPetsDOM();
      refreshHungerState();
      popMessage("สัตว์เลี้ยงได้จากไปสู่สุคติแล้ว... 👻");
      return;
    }

    if(activeTool === 'vaccine'){
      if(pet.sick){
        if((parseInt(inventory.vaccine) || 0) <= 0){
          activeTool = null;
          updateHoldingUI();
          popMessage("วัคซีนหมดแล้ว!");
          return;
        }

        pet.sick = false;
        inventory.vaccine = Math.max(0, (parseInt(inventory.vaccine) || 0) - 1);

        activeTool = null;
        updateHoldingUI();

        await saveWalletAndData();

        renderPetsDOM();
        refreshHungerState();
        spawnHearts(idx, 3);
        popMessage("ฉีดวัคซีนรักษาน้องหายป่วยแล้ว! 💉✨");
      } else {
        popMessage("ตัวนี้ยังแข็งแรงดีนะ ไม่ต้องใช้วัคซีนจ้า!");
      }
      return;
    }

    if(activeTool === 'potion'){
      if(isPetBaby(pet.born)){
        if((parseInt(inventory.potion) || 0) <= 0){
          activeTool = null;
          updateHoldingUI();
          popMessage("โพชั่นหมดแล้ว!");
          return;
        }

        const bornDate = new Date(pet.born);
        bornDate.setDate(bornDate.getDate() - 3);

        pet.born = `${bornDate.getFullYear()}-${String(bornDate.getMonth()+1).padStart(2,'0')}-${String(bornDate.getDate()).padStart(2,'0')}`;
        inventory.potion = Math.max(0, (parseInt(inventory.potion) || 0) - 1);

        activeTool = null;
        updateHoldingUI();

        await saveWalletAndData();

        renderPetsDOM();
        refreshHungerState();
        spawnHearts(idx, 3);
        popMessage("ให้น้องกินยาเร่งโต โตเต็มวัยทันที! ✨🧪");
      } else {
        popMessage("ตัวนี้โตเต็มวัยแล้ว ไม่จำเป็นต้องใช้ยาเร่งโตจ้า!");
      }
      return;
    }

    spawnHearts(idx, 1);
  }

  function spawnHearts(idx, count){
    const el = document.getElementById(`pet_el_${idx}`);
    if(!el) return;
    for(let i=0; i<count; i++){
      const h = document.createElement("div");
      h.className = "heart-pop"; h.textContent = "💕";
      h.style.left = (20 + Math.random()*40) + "px"; h.style.top = (0 + Math.random()*15) + "px"; h.style.animationDelay = (i*0.12) + "s";
      el.appendChild(h); setTimeout(() => h.remove(), 1100);
    }
  }

  function spawnHeartsForAll(count){ petInstances.forEach((_, idx) => { if(!currentStudent.pets[idx].dead) spawnHearts(idx, count); }); }

  let msgTimer = null;
  function popMessage(text){
    const bubble = document.getElementById("toastMsg");
    bubble.textContent = text; bubble.style.display = "block";
    clearTimeout(msgTimer); msgTimer = setTimeout(() => { bubble.style.display = "none"; }, 1800);
  }

  function openShopModal(){ 
    currentShopTab = 'pet';
    document.querySelectorAll('#shopModal .shop-tab-btn').forEach((b, i) => { if(i === 0) b.classList.add('active'); else b.classList.remove('active'); });
    document.getElementById("shopQuotaBox").style.display = "block";
    updateShopQuotaDisplay(); renderShopList('pet');
    document.getElementById("shopModal").style.display = "flex"; 
  }

  function openMissionModal(){ 
    currentMissionTab = 'main';
    document.querySelectorAll('#missionModal .shop-tab-btn').forEach((b, i) => { if(i === 0) b.classList.add('active'); else b.classList.remove('active'); });
    renderMissions();
    document.getElementById("missionModal").style.display = "flex"; 
  }
  
  async function openRankModal(){ 
    document.getElementById("rankModal").style.display = "flex";
    document.getElementById("rank-list").innerHTML = window.LoadingFX
      ? LoadingFX.balls("กำลังโหลดอันดับ...", { color:"#ff6b81", textStyle:"color:#7f8c8d;" })
      : "<p style='text-align:center; color:#7f8c8d;'>กำลังโหลดอันดับ...</p>";
    try {
      const data = await fetchWithRetry(`${API_URL}?action=ranking`);
      if(data.success && Array.isArray(data.ranking)) renderRankList(data.ranking);
      else document.getElementById("rank-list").innerHTML = "<p style='text-align:center; color:#e74f66;'>ไม่สามารถโหลดข้อมูลอันดับได้</p>";
    } catch(err) {
      document.getElementById("rank-list").innerHTML = "<p style='text-align:center; color:#e74f66;'>เกิดข้อผิดพลาดในการเชื่อมต่อ</p>";
    }
  }

  function closeModal(id){ document.getElementById(id).style.display = "none"; }

  function checkAwayAttacks() {
    // ⭐ เดิมใช้ localStorage เก็บเวลาที่เข้าเล่นล่าสุด ซึ่งพัง(ไม่แจ้งเตือน) ถ้าเปลี่ยนเครื่อง/ล้าง cache
    // เปลี่ยนมาเช็คจาก flag "notified" ที่เก็บอยู่ใน history แต่ละรายการแทน แล้วเซฟกลับขึ้น server
    // ทำให้แจ้งเตือนถูกต้องไม่ว่าจะเข้าเล่นจากเครื่อง/เบราว์เซอร์ไหนก็ตาม
    let history = Array.isArray(currentStudent.history) ? currentStudent.history : [];
    let awayAttacks = history.filter(h => h.type === "attacked_by" && !h.notified);

    if (awayAttacks.length === 0) return;

    let totalLost = awayAttacks.reduce((sum, h) => sum + (h.coins || 0), 0);
    const listEl = document.getElementById("away-report-list");
    if (listEl) {
      listEl.innerHTML = `
        <div style="text-align:center; font-size:13px; color:var(--berry-dark); font-weight:600; margin-bottom:10px;">
          ถูกโจมตี ${awayAttacks.length} ครั้ง | เสียเหรียญรวม ${totalLost} 🪙
        </div>
        ${awayAttacks.map(h => `
          <div style="padding:8px 4px; border-bottom:1px solid #f0e6d2; font-size:12px; color:var(--ink);">
            ${h.detail}
          </div>
        `).join("")}
      `;
    }

    // ทำเครื่องหมายว่าแจ้งเตือนแล้ว กันไม่ให้เด้งซ้ำในครั้งถัดไป แล้วเซฟกลับขึ้น server
    history.forEach(h => {
      if (h.type === "attacked_by" && !h.notified) h.notified = true;
    });
    currentStudent.history = history;
    saveWalletAndData();

    setTimeout(() => {
      document.getElementById("awayReportModal").style.display = "flex";
    }, 500);
  }

  function openBattleHistoryModal() {
    renderBattleHistoryList();
    document.getElementById("battleHistoryModal").style.display = "flex";
  }

  function renderBattleHistoryList() {
    const container = document.getElementById("battle-history-list");
    if (!container) return;

    let history = Array.isArray(currentStudent.history) ? currentStudent.history : [];
    let battleHistory = history.filter(h => ["battle_win", "battle_lose", "attacked_by"].includes(h.type));

    if (battleHistory.length === 0) {
      container.innerHTML = `<div style="text-align:center; color:var(--ink-soft); font-size:12px; padding:20px;">ยังไม่มีประวัติการต่อสู้</div>`;
      return;
    }

    container.innerHTML = battleHistory.map(entry => {
      let icon = entry.type === "attacked_by" ? "🛡️" : (entry.type === "battle_win" ? "🏆" : "💔");
      let color = entry.type === "battle_win" ? "var(--leaf)" : "var(--berry-dark)";
      let d = new Date(entry.timestamp);
      let timeText = `${d.getDate()}/${d.getMonth()+1} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;

      return `
        <div style="display:flex; align-items:flex-start; gap:8px; padding:8px 4px; border-bottom:1px solid #f0e6d2;">
          <div style="font-size:16px;">${icon}</div>
          <div style="flex:1;">
            <div style="font-size:12px; color:${color}; font-weight:600;">${entry.detail}</div>
            <div style="font-size:10px; color:var(--ink-soft);">${timeText}</div>
          </div>
        </div>
      `;
    }).join("");
  }

  function setBattleFieldBackground(active) {
    const battleScreenEl = document.getElementById("battleScreen");
    const vid = document.getElementById("battleBgVideo");
    if (!battleScreenEl) return;

    if (active) {
      battleScreenEl.style.backgroundImage = `url("Background/battle_field.png")`;
      if (vid) { vid.style.display = "none"; vid.pause(); }
    } else {
      battleScreenEl.style.backgroundImage = "";
      if (vid) {
        vid.style.display = "";
        vid.currentTime = 0;
        vid.play().catch(e => console.log("Video autoplay blocked:", e));
      }
    }
  }

  function openBattleScreen() {
    document.getElementById("dashboard").style.display = "block";
    const battleScreenEl = document.getElementById("battleScreen");
    battleScreenEl.style.display = "flex";
    setBattleFieldBackground(false);   // หน้าเลือกสัตว์/เพื่อน ใช้วิดีโอปกติ

    renderBattleSelectLockedPet();
  }

  function closeBattleScreen() {
    const battleScreenEl = document.getElementById("battleScreen");
    battleScreenEl.style.display = "none";
    setBattleFieldBackground(false);   // คืนวิดีโอไว้เสมอตอนออกจากห้องต่อสู้ทั้งหมด

    document.getElementById("dashboard").style.display = "block";
  }

  function getPetAttackStatus(petIndex) {
  let pet = currentStudent.pets[petIndex];
  if (!pet) return { count: 0, resetTime: 0 };

  let nowMS = getReferenceDate().getTime();
  if (pet.atk === undefined) pet.atk = 10;
  if (pet.atkReset === undefined) pet.atkReset = 0;

  if (pet.atkReset && nowMS >= pet.atkReset) {
    pet.atk = 10;
    pet.atkReset = 0;
    saveWalletAndData();
  } else if (pet.atkReset) {
    const MAX_ATK_RESET_MS = 6 * 60 * 60 * 1000;
    if ((pet.atkReset - nowMS) > MAX_ATK_RESET_MS) {
      pet.atk = 10;
      pet.atkReset = 0;
      saveWalletAndData();
    }
  }

  return { count: pet.atk, resetTime: pet.atkReset };
}

  function syncAttackStatusToPets() {
  if (!currentStudent.pets || currentStudent.pets.length === 0) return;
  currentStudent.pets[0].atk = battleData.count;
  currentStudent.pets[0].atkReset = battleData.resetTime;
  saveWalletAndData();   // ใช้ฟังก์ชันเซฟที่มีอยู่แล้ว ไม่ต้องเพิ่ม endpoint ใหม่
  }

  function renderBattleSelectLockedPet() {
    setBattleFieldBackground(false);
    const area = document.getElementById("battleContentArea");
    let petsHtml = "";
    let nowMS = getReferenceDate().getTime();

    currentStudent.pets.forEach((pet, idx) => {
      let breedEndTime = pet.breedEndTime ? new Date(pet.breedEndTime).getTime() : null;
      let isStillBreeding = pet.breed && breedEndTime && (nowMS < breedEndTime);

      if (pet.dead || isPetBaby(pet.born) || isStillBreeding) return;

      let isResting = false;
      let restText = "";
      
      if (typeof pet.battle === "string" && pet.battle.startsWith("rest_")) {
        let wakeTime = parseInt(pet.battle.split("_")[1]);
        const MAX_REST_MS = 3 * 60 * 60 * 1000;
        if (!isNaN(wakeTime) && (wakeTime - nowMS) > MAX_REST_MS) {
          wakeTime = nowMS + MAX_REST_MS;
          pet.battle = `rest_${wakeTime}`;
        }
        if (!isNaN(wakeTime) && nowMS < wakeTime) {
          isResting = true;
          let diffHours = Math.ceil((wakeTime - nowMS) / (1000 * 60 * 60));
          restText = `พักฟื้นอีก ~${diffHours} ชม.`;
        } else {
          pet.battle = false;
        }
      }

      let atkStatus = getPetAttackStatus(idx);
      let attackInfoText = "";
      if (atkStatus.count > 0) {
        attackInfoText = `⚔️ โจมตีได้วันนี้: ${atkStatus.count}/10 ครั้ง`;
      } else {
        let waitHours = Math.ceil((atkStatus.resetTime - nowMS) / (1000 * 60 * 60));
        attackInfoText = `⏳ โจมตีครบแล้ว (รออีก ${Math.max(1, waitHours)} ชม.)`;
      }

      const shopItemRef = SHOP_ITEMS.find(si => si.id === pet.type);
      const namePet = getPetName(pet.type);
      const isSelected = (battleLockedMyPetIndex === idx);

      petsHtml += `
        <div class="friend-battle-card ${isSelected ? 'selected-pet-highlight' : ''}" style="${isResting ? 'opacity:0.6; background:#f5f5f5;' : ''}" onclick="${isResting ? `popMessage('สัตว์ตัวนี้กำลังพักฟื้นอยู่!')` : `lockMyBattlePet(${idx})`}">
          <img src="${getPetShopImage(pet.type)}" style="width:45px; height:45px; object-fit:contain;" alt="" onerror="this.onerror=null;this.src='${getPetImage(pet.type, false)}'">
          <div style="flex:1; text-align:left; margin-left:10px;">
            <div style="font-weight:600; font-size:13px; color:var(--ink);">${namePet} ${isSelected ? '✨ (เลือกแล้ว)' : ''}</div>
            <div style="font-size:10px; color:var(--ink-soft);">Power: ${pet.power || 10} | ${attackInfoText}</div>
            ${isResting ? `<div style="font-size:9px; color:var(--berry-dark); font-weight:600;">💤 ${restText}</div>` : `<div style="font-size:9px; color:${isSelected ? 'var(--sun-dark)' : 'var(--leaf)'}; font-weight:600;">${isSelected ? '🌟 กำลังใช้งานตัวนี้' : '✨ กดเพื่อเลือกตัวนี้'}</div>`}
          </div>
        </div>
      `;
    });

    area.innerHTML = `
      <div class="battle-select-pet-container">
        <h3 style="margin:0 0 10px; font-size:15px; color:#fff; text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;">เลือกสัตว์ตัวหลัก</h3>
        <p style="font-size:11px; color:#fff; margin-bottom:10px; opacity: 0.9; text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;">เลือกตัวละครเพื่อใช้เป็นตัวหลักในการบุกโจมตี</p>
        <div style="max-height: 45vh; overflow-y: auto; display:flex; flex-direction:column; gap:6px;">
          ${petsHtml || '<div style="color:var(--ink-soft); font-size:12px; padding:20px;">ไม่มีสัตว์เลี้ยงโตเต็มวัยพร้อมรบในคอก</div>'}
        </div>
        ${buildFairyPickBarHTML()}
        <button class="buy-btn" onclick="fetchFriendsForBattle()" style="width:100%; margin-top:12px; background:var(--berry); color:#fff; box-shadow:0 3px 0 var(--berry-dark);">
          โจมตีเพื่อน ⚔️
        </button>
      </div>
    `;
  }

// เพิ่มฟังก์ชันใหม่ สำหรับเซฟข้อมูลสัตว์ของเพื่อนกลับไปที่ Sheet
async function saveFriendPetRest(stolenCoins = 0) {

  console.log("========== SAVE FRIEND BATTLE ==========");
  console.log("FRIEND:", battleTargetFriend);
  console.log("RAW COIN:", battleTargetFriend["coin"]);
  console.log("STOLEN:", stolenCoins);


  // ==============================
  // ตรวจสอบข้อมูลเงิน
  // ==============================

  const rawCoin = battleTargetFriend["coin"];

  if (
    rawCoin === undefined ||
    rawCoin === null ||
    rawCoin === ""
  ) {

    console.error(
      "❌ ไม่พบค่า coin ของเพื่อน",
      battleTargetFriend
    );

    throw new Error("Friend coin is missing");

  }


  let friendCoins = Number(rawCoin);

  if (Number.isNaN(friendCoins)) {

    console.error(
      "❌ coin ของเพื่อนไม่ใช่ตัวเลข:",
      rawCoin
    );

    throw new Error("Friend coin is invalid");

  }


  // ==============================
  // หักเงินเพื่อน
  // ==============================

  const stealAmount = Number(stolenCoins) || 0;

  friendCoins = Math.max(
    0,
    friendCoins - stealAmount
  );


  console.log(
    "💰 COIN AFTER STEAL:",
    friendCoins
  );


  // ==============================
  // ข้อมูลสัตว์
  // ==============================

  let friendPets =
    safeParse(
      battleTargetFriend["pets"],
      []
    );


  const targetPetIndex =
    battleTargetFriend.selectedPetIndex;


  if (
    targetPetIndex === undefined ||
    !friendPets[targetPetIndex]
  ) {

    throw new Error(
      "ไม่พบสัตว์ที่ถูกโจมตี"
    );

  }


  // ==============================
  // ให้สัตว์พัก 3 ชั่วโมง
  // ==============================

  const restWakeTime =
    getReferenceDate().getTime() +
    3 * 60 * 60 * 1000;


  friendPets[targetPetIndex].battle =
    `rest_${restWakeTime}`;


  // ==============================
  // อัปเดตประวัติของเพื่อน (ต่อท้ายของเดิม ไม่ทับ)
  // ==============================

  let friendHistory =
    safeParse(
      battleTargetFriend["history"],
      []
    );

  friendHistory.unshift({
    timestamp: new Date().toISOString(),
    dateStr: todayStr(),
    type: "attacked_by",
    result: "lose",
    coins: stealAmount,
    notified: false,
    detail: `ถูกโจมตีโดย ${currentStudent["ชื่อ"] || "เพื่อน"} (แพ้ เสียเหรียญ ${stealAmount} 🪙)`
  });

  if (friendHistory.length > 50) {
    friendHistory = friendHistory.slice(0, 50);
  }

  battleTargetFriend["history"] =
    JSON.stringify(friendHistory);


  // ==============================
  // อัปเดต cache
  // ==============================

  battleTargetFriend["coin"] =
    friendCoins;

  battleTargetFriend["pets"] =
    JSON.stringify(friendPets);


  // ==============================
  // ส่งข้อมูลไป API
  // ==============================

  const payload =
    new URLSearchParams({

      action: "saveGameData",

      id:
        battleTargetFriend["รหัสนักเรียน"],

      pets:
        JSON.stringify(friendPets),

      coin:
        String(friendCoins),

      history:
        JSON.stringify(friendHistory)

    });


  console.log(
    "📤 SAVE FRIEND:",
    Object.fromEntries(payload)
  );


  let lastError = null;

// ⭐ ลองบันทึกข้อมูลเพื่อนสูงสุด 3 ครั้ง
for (let attempt = 1; attempt <= 3; attempt++) {

  try {

    console.log(
      `💾 SAVE FRIEND attempt ${attempt}/3`
    );

    const response =
      await fetch(
        API_URL,
        {
          method: "POST",
          body: payload
        }
      );

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}`
      );
    }

    const result =
      await response.json();

    console.log(
      "📥 SAVE FRIEND RESULT:",
      result
    );

    if (
      !result ||
      result.success !== true
    ) {

      throw new Error(
        result?.message ||
        "Save friend failed"
      );
    }

    console.log(
      "✅ SAVE FRIEND SUCCESS"
    );

    return result;

  } catch (err) {

    lastError = err;

    console.error(
      `❌ SAVE FRIEND FAILED attempt ${attempt}/3:`,
      err
    );

    if (attempt < 3) {

      await new Promise(
        resolve =>
          setTimeout(resolve, 1500)
      );
    }
  }
}

throw new Error(
  "ไม่สามารถบันทึกข้อมูลเพื่อนได้หลังจากลอง 3 ครั้ง: " +
  (lastError?.message || "Unknown error")
);

}

  function lockMyBattlePet(idx) {
    battleLockedMyPetIndex = idx;
    popMessage("เลือกและไฮไลต์ตัวละครสำเร็จ!");
    renderBattleSelectLockedPet();
  }

  async function fetchFriendsForBattle() {
    if (battleLockedMyPetIndex === null) {
      const readyIdx = currentStudent.pets.findIndex(p => !p.dead && !isPetBaby(p.born));
      if (readyIdx !== -1) battleLockedMyPetIndex = readyIdx;
      else { popMessage("กรุณามีสัตว์โตเต็มวัยอย่างน้อย 1 ตัว!"); return; }
    }

    let atkStatus = getPetAttackStatus(battleLockedMyPetIndex);
    let nowMS = getReferenceDate().getTime();
    let attackInfoText = "";

    if (atkStatus.count <= 0) {
    let waitHours = Math.ceil((atkStatus.resetTime - nowMS) / (1000 * 60 * 60));
    popMessage(`สัตว์ตัวนี้ใช้สิทธิ์บุกครบ 10 ครั้งแล้ว! ต้องรออีก ${Math.max(1, waitHours)} ชม.`);
    return;
  }

    document.getElementById("battleHeaderTitle").textContent = "⚔️ เลือกโจมตีเพื่อน";
    const area = document.getElementById("battleContentArea");
    area.innerHTML = window.LoadingFX
      ? LoadingFX.balls("กำลังค้นหาเพื่อนๆ ในระบบ...", { color:"#fff", textStyle:"color:#fff; text-shadow:0 1px 3px rgba(0,0,0,.6);" })
      : `<div style="color:#fff; font-size:14px;">กำลังค้นหาเพื่อนๆ ในระบบ...</div>`;

    try {
      const data = await fetchWithRetry(`${API_URL}?action=ranking`);
      if (data.success && Array.isArray(data.ranking)) {
        allFriendsCache = data.ranking.filter(s => String(s["รหัสนักเรียน"] || "").trim() !== studentKey);
        renderFriendListUI();
      } else {
        area.innerHTML = `<div style="color:#e74f66; font-size:13px;">ไม่สามารถโหลดรายชื่อเพื่อนได้</div>`;
      }
    } catch(err) {
      area.innerHTML = `<div style="color:#e74f66; font-size:13px;">เกิดข้อผิดพลาดในการเชื่อมต่อเพื่อน</div>`;
    }
  }

  function isFriendPetReadyForBattle(pet) {
    if (!pet) return false;
    if (pet.dead) {return false;}
    if (isPetBaby(pet.born)) {return false;}
    const nowMS = getReferenceDate().getTime();
    const breedEndTime = pet.breedEndTime
      ? new Date(pet.breedEndTime).getTime(): null;
    const isStillBreeding = pet.breed === true && breedEndTime && nowMS < breedEndTime;
    if (isStillBreeding) {return false;}
    if (typeof pet.battle === "string" && pet.battle.startsWith("rest_")
  ) {
    const wakeTime = parseInt(pet.battle.split("_")[1]);
    if (!isNaN(wakeTime) && nowMS < wakeTime
  ) {return false;
  }
  }
  return true;
  }


  // สร้างการ์ดเพื่อนตามคำค้นหา (ค้นได้ทั้งชื่อและรหัสนักเรียน) โดยยังใช้ index เดิมของ allFriendsCache
  function buildFriendCardsHTML(query = "") {
    const q = String(query || "").trim().toLowerCase();
    let html = "";

    allFriendsCache.forEach((friend, idx) => {
      const name = String(friend["ชื่อ"] || "");
      const sid = String(friend["รหัสนักเรียน"] || "");
      if (q && !name.toLowerCase().includes(q) && !sid.toLowerCase().includes(q)) return;

      let friendPets = safeParse(friend["pets"]);
      let availablePetsCount = friendPets.filter(pet => isFriendPetReadyForBattle(pet)).length;

      html += `
        <div class="friend-battle-card" style="${availablePetsCount === 0 ? 'opacity:0.6; background:#f5f5f5;' : ''}" onclick="${availablePetsCount === 0 ? `popMessage('เพื่อนคนนี้ไม่มีสัตว์ที่พร้อมต่อสู้!')` : `selectFriendTargetByIndex(${idx})`}">
          <div style="flex:1; text-align:left;">
            <div style="font-weight:600; font-size:13px; color:var(--ink);">${name || sid}</div>
            <div style="font-size:10px; color:var(--ink-soft);">คะแนน: ${friend["คะแนน"] || 0} | พร้อมรบ: ${availablePetsCount} ตัว</div>
          </div>
          <button class="buy-btn" style="padding:6px 12px; font-size:11px; white-space:nowrap; ${availablePetsCount === 0 ? 'opacity:0.6; cursor:default; pointer-events:none;' : ''}">
            ${availablePetsCount > 0 ? '⚔️ กดท้าดวล' : '💤 พักผ่อน'}
          </button>
        </div>
      `;
    });

    if (html) return html;
    return q
      ? `<div style="color:var(--ink-soft); font-size:12px; padding:20px; text-align:center;">ไม่พบชื่อที่ตรงกับ "${q.replace(/[<>&"]/g, "")}"</div>`
      : '<div style="color:var(--ink-soft); font-size:12px; padding:20px; text-align:center;">ไม่พบรายชื่อเพื่อนในระบบ</div>';
  }

  // อัปเดตเฉพาะรายการ (ไม่วาดช่องพิมพ์ใหม่ เพื่อไม่ให้แป้นพิมพ์หลุด/เคอร์เซอร์เด้ง)
  function filterFriendList(query) {
    const listEl = document.getElementById("friendListItems");
    if (listEl) listEl.innerHTML = buildFriendCardsHTML(query);
    const clearBtn = document.getElementById("friendSearchClear");
    if (clearBtn) clearBtn.style.display = query ? "flex" : "none";
  }

  function clearFriendSearch() {
    const input = document.getElementById("friendSearchInput");
    if (input) { input.value = ""; input.focus(); }
    filterFriendList("");
  }

  function renderFriendListUI() {
    const area = document.getElementById("battleContentArea");

    area.innerHTML = `
      <div class="battle-friend-list-container">
        <h3 style="margin:0 0 10px; font-size:15px; color:var(--ink); text-align:center;">👥 เลือกเพื่อนที่จะต่อสู้</h3>
        <div class="friend-search-box">
          <span class="friend-search-icon">🔍</span>
          <input type="text" id="friendSearchInput" class="friend-search-input" placeholder="พิมพ์ค้นหาชื่อหรือรหัสนักเรียน..." autocomplete="off" oninput="filterFriendList(this.value)">
          <button type="button" id="friendSearchClear" class="friend-search-clear" onclick="clearFriendSearch()" aria-label="ล้างคำค้นหา">✕</button>
        </div>
        <div id="friendListItems" style="display:flex; flex-direction:column; gap:6px;">
          ${buildFriendCardsHTML("")}
        </div>
      </div>
    `;
  }

function selectFriendTargetByIndex(idx) {
  const friend = allFriendsCache[idx];
  if (!friend) return;
  selectFriendTarget(friend);
}

// ฟังก์ชันเลือกเพื่อนเป้าหมายและตรวจสอบเงื่อนไขสัตว์เลี้ยง (ปรับปรุงส่วนสุ่มสัตว์และเก็บ Index)
let battleEntering = false; // กันกดรัวตอนกำลังเข้าต่อสู้ (ไม่ให้หักสิทธิ์ซ้ำ)
async function selectFriendTarget(friendObj) {
  if (battleEntering) return;
  battleEntering = true;
  try {
    await selectFriendTargetImpl(friendObj);
  } finally {
    battleEntering = false;
  }
}

async function selectFriendTargetImpl(friendObj) {
  let friendPets = safeParse(friendObj["pets"]);
  if (!friendPets || friendPets.length === 0) {
    popMessage("เพื่อนคนนี้ไม่มีสัตว์เลี้ยงในคอก ไม่สามารถโจมตีได้!");
    return;
  }

  let availablePetIndexes = friendPets.map((pet, index) => {
    return isFriendPetReadyForBattle(pet) ? index : -1;
  })
  .filter(index => index !== -1);

  if (availablePetIndexes.length === 0) {
    popMessage("พื่อนคนนี้ไม่มีสัตว์ที่พร้อมต่อสู้! (กำลังพักฟื้น เป็นวัยเด็ก หรือผสมพันธุ์อยู่)");
    return;
  }

  const atkStatus = getPetAttackStatus(battleLockedMyPetIndex);
  if (atkStatus.count <= 0) {popMessage("สัตว์ตัวนี้ใช้สิทธิ์โจมตีหมดแล้ว!"); return;}
  let lockedPet = currentStudent.pets[battleLockedMyPetIndex];
  lockedPet.atk--;

if (lockedPet.atk === 0) {

  lockedPet.atkReset =
    getReferenceDate().getTime() +
    6 * 60 * 60 * 1000;

}

if (window.ArenaDash) ArenaDash.start();   // 🚀 กดท้าดวลแล้ว → พุ่งเข้าสนามระหว่างรอระบบ

try {

  await saveWalletAndData();

} catch (err) {

  if (window.ArenaDash) ArenaDash.cancel();

  console.error(
    "❌ ไม่สามารถบันทึกสิทธิ์โจมตี:",
    err
  );

  // คืนสิทธิ์กลับ เพราะเซฟไม่สำเร็จ
  lockedPet.atk++;

  if (lockedPet.atk > 0) {
    lockedPet.atkReset = 0;
  }

  popMessage(
    "⚠️ บันทึกการใช้สิทธิ์ไม่สำเร็จ กรุณาลองใหม่"
  );

  return;
}
  battleTargetFriend = friendObj;

let chosenFriendPetIndex =

  availablePetIndexes[
    Math.floor(
      Math.random()
      * availablePetIndexes.length
    )
  ];

  let chosenFriendPet = friendPets[chosenFriendPetIndex];

  if (chosenFriendPet.power === undefined) {
    chosenFriendPet.power = 10;
  }

  battleTargetFriend.selectedPet = chosenFriendPet;
  battleTargetFriend.selectedPetIndex = chosenFriendPetIndex;

  // ใช้สัตว์ตั้งต้นที่ล็อคไว้
  let myPet = currentStudent.pets[battleLockedMyPetIndex];
  let myPower = myPet.power || 10;
  battleMaxHP = myPower * 10;
  battleCurrentHP = battleMaxHP;

  let friendPower = chosenFriendPet.power || 10;
  battleFriendMaxHP = friendPower * 10;
  battleFriendHP = battleFriendMaxHP;

  // แสงประตูสนามกลืนจอแล้วค่อยแสดงสนามต่อสู้ (เปลี่ยนหน้าตอนจอขาวเต็ม)
  if (window.ArenaDash) await ArenaDash.finish(() => renderBattleArenaScreen());
  else renderBattleArenaScreen();
}

  function renderBattleArenaScreen() {
    setBattleFieldBackground(true);
    let myPet = currentStudent.pets[battleLockedMyPetIndex];
    let atkStatus = getPetAttackStatus(battleLockedMyPetIndex);

    document.getElementById("battleHeaderTitle").textContent = `⚔️ บุกโจมตี! (สิทธิ์เหลือ: ${atkStatus.count}/10)`;
    const area = document.getElementById("battleContentArea");

    let friendPet = battleTargetFriend.selectedPet;
    let myName = currentStudent["ชื่อ"] || "ฉัน";
    let friendName = battleTargetFriend["ชื่อ"] || "เพื่อน";

    battleFairy = getEquippedFairy();
    battleFoeFairy = getFairyById(battleTargetFriend && battleTargetFriend["fairyEquipped"]);
    let myBodyImg = getPetImage(myPet.type, false);
    let myLegImg = getPetImage(myPet.type, true);
    let friendBodyImg = getPetImage(friendPet.type, false);
    let friendLegImg = getPetImage(friendPet.type, true);

    area.innerHTML = `
      <div class="battle-arena-stage">
        <div class="fighter-side">
          <div class="fighter-box-header">
            <div class="fighter-name">${myName} (${myPet.type})</div>
            <div style="font-size:10px; color:var(--berry-dark);">Power: ${myPet.power || 10}</div>
            <div class="hp-track-bar">
              <div class="hp-fill-bar" id="myHpFill" style="width: 100%;"></div>
            </div>
            <div style="font-size:9px; color:var(--ink-soft); text-align:right;"><span id="myHpText">${battleCurrentHP}</span>/${battleMaxHP} HP</div>
          </div>
          ${buildFairyLaneHTML(battleFairy, "my")}
          <div class="fighter-assembly-container" id="myFighter">
            <div class="fighter-flip">
              <img src="${myLegImg}" class="fighter-leg fighter-leg-back fighter-leg-back-left" alt="">
              <img src="${myLegImg}" class="fighter-leg fighter-leg-back fighter-leg-back-right" alt="">
              <img src="${myBodyImg}" class="fighter-body-img" alt="">
              <img src="${myLegImg}" class="fighter-leg fighter-leg-front fighter-leg-front-left" alt="">
              <img src="${myLegImg}" class="fighter-leg fighter-leg-front fighter-leg-front-right" alt="">
            </div>
            ${buildFairyUnitHTML(battleFairy, "my")}
            <div class="skill-hit-effect" id="myHitEffect"></div>
          </div>
        </div>

        <div class="fighter-side right">
          <div class="fighter-box-header">
            <div class="fighter-name">${friendName} (${friendPet.type})</div>
            <div style="font-size:10px; color:var(--berry-dark);">Power: ${friendPet.power || 10}</div>
            <div class="hp-track-bar">
              <div class="hp-fill-bar" id="friendHpFill" style="width: 100%;"></div>
            </div>
            <div style="font-size:9px; color:var(--ink-soft); text-align:right;"><span id="friendHpText">${battleFriendHP}</span>/${battleFriendMaxHP} HP</div>
          </div>
          ${buildFairyLaneHTML(battleFoeFairy, "foe")}
          <div class="fighter-assembly-container" id="friendFighter">
            <div class="fighter-flip">
              <img src="${friendLegImg}" class="fighter-leg fighter-leg-back fighter-leg-back-left" alt="">
              <img src="${friendLegImg}" class="fighter-leg fighter-leg-back fighter-leg-back-right" alt="">
              <img src="${friendBodyImg}" class="fighter-body-img" alt="">
              <img src="${friendLegImg}" class="fighter-leg fighter-leg-front fighter-leg-front-left" alt="">
              <img src="${friendLegImg}" class="fighter-leg fighter-leg-front fighter-leg-front-right" alt="">
            </div>
            ${buildFairyUnitHTML(battleFoeFairy, "foe")}
            <div class="skill-hit-effect" id="friendHitEffect"></div>
          </div>
        </div>
      </div>

      <div class="battle-skills-footer">
        <div style="font-size:11px; color:#fff; font-weight:600; text-shadow:0 1px 3px rgba(0,0,0,0.8);">สิทธิ์โจมตีวันนี้: <span id="remainingAttackDisplay">${atkStatus.count}</span>/10 ครั้ง</div>
        <div class="skill-buttons-row">
          <button class="skill-btn" id="skillBtn1" onclick="useBattleSkill(1)">
            <img src="Skills/${getPetSkillPrefix(myPet.type)}_skill1.png" alt="Skill 1" onerror="this.onerror=null;this.src='Skills/cat_skill1.png'">
          </button>
          <button class="skill-btn" id="skillBtn2" onclick="useBattleSkill(2)">
            <img src="Skills/${getPetSkillPrefix(myPet.type)}_skill2.png" alt="Skill 2" onerror="this.onerror=null;this.src='Skills/cat_skill2.png'">
          </button>
          <button class="skill-btn" id="skillBtn3" onclick="useBattleSkill(3)">
            <img src="Skills/${getPetSkillPrefix(myPet.type)}_skill3.png" alt="Skill 3" onerror="this.onerror=null;this.src='Skills/cat_skill3.png'">
          </button>
        </div>
      </div>
    `;
    applyPetLayout(document.getElementById("myFighter"), myPet.type);
    applyPetLayout(document.getElementById("friendFighter"), friendPet.type);
  }

  function useBattleSkill(skillNum) {
    const skillButtons = document.querySelectorAll(".skill-btn");
    skillButtons.forEach(btn => btn.disabled = true);

    if (skillNum === 2 || skillNum === 3) {
      openMathChallenge(skillNum);
      return;
    }

    executeSkillAttack(skillNum);
  }

  function playSkillHitEffect(elId, petType) {
    const el = document.getElementById(elId);
    if (!el) return;
    // ⭐ Elepant_effect_skill.png ใช้เฉพาะสกิล 3 ของช้างเท่านั้น
    // ⭐ siberianhusky_effect_skill.png ใช้เฉพาะสกิล 3 ของไซบีเรียนเท่านั้น (เช่นเดียวกับช้าง)
    el.classList.toggle("siberianhusky-fx", petType === "siberianhusky");
    el.classList.toggle("elepant-fx", petType === "elepant");
    el.classList.remove("playing");
    void el.offsetWidth; // force reflow เพื่อรีสตาร์ท animation ได้ทุกครั้ง
    el.classList.add("playing");
    el.addEventListener("animationend", () => {
      el.classList.remove("playing");
    }, { once: true });
  }

  function executeSkillAttack(skillNum) {
    const fighter = document.getElementById("myFighter");
    if (fighter) {
      fighter.classList.remove("attack-animate");
      void fighter.offsetWidth;
      fighter.classList.add("attack-animate");
    }

    setTimeout(() => {
      let myPet = currentStudent.pets[battleLockedMyPetIndex];
      let myPower = myPet.power || 10;

      let damageToFriend = Math.max(1, myPower * skillNum);

      // 🧚 ภูติ: ฝั่งเรา Cri / Steal / Heal — ฝั่งเพื่อน Dodge / Protect (ทอยใหม่ทุกครั้งที่โจมตี)
      const fairyOff = applyFairyOffense("my", damageToFriend);
      const fairyDef = applyFairyDefense("foe", fairyOff.damage);
      damageToFriend = fairyDef.damage;
      battleFriendHP = Math.max(0, battleFriendHP - damageToFriend);
      const stolenHp = Math.min(fairyDef.dodged ? 0 : fairyOff.steal, battleFriendHP);
      battleFriendHP -= stolenHp;
      const fairyHealed = fairyOff.heal + stolenHp;
      if (fairyHealed > 0) {
        battleCurrentHP = Math.min(battleMaxHP, battleCurrentHP + fairyHealed);
        const myHpFillF = document.getElementById("myHpFill");
        const myHpTextF = document.getElementById("myHpText");
        if (myHpFillF) myHpFillF.style.width = `${(battleCurrentHP / battleMaxHP) * 100}%`;
        if (myHpTextF) myHpTextF.textContent = battleCurrentHP;
      }

      // ⭐ ท่า skill3 (ตอบเลขคณิตถูก) → ขึ้นเอฟเฟกต์ระเบิดที่ตัวอีกฝ่าย (friendFighter)
      if (skillNum === 3 && !fairyDef.dodged) {
        playSkillHitEffect("friendHitEffect", myPet.type);
      }

      const friendHpFill = document.getElementById("friendHpFill");
      const friendHpText = document.getElementById("friendHpText");
      if (friendHpFill) friendHpFill.style.width = `${(battleFriendHP / battleFriendMaxHP) * 100}%`;
      if (friendHpText) friendHpText.textContent = battleFriendHP;

      let atkMsg;
      if (fairyDef.dodged) {
        atkMsg = `🌀 ภูติของเพื่อนช่วยหลบการโจมตี!`;
      } else {
        atkMsg = fairyOff.crit > 1
          ? `💥 คริติคอล ×${fairyFmt(fairyOff.crit)}! ความเสียหาย ${damageToFriend} HP!`
          : `💥 โจมตีใส่เพื่อนสร้างความเสียหาย ${damageToFriend} HP!`;
        if (fairyDef.reduction > 0) atkMsg += ` 🛡️-${fairyFmt(fairyDef.reduction)}%`;
        if (stolenHp > 0) atkMsg += ` 🧛+${stolenHp}`;
      }
      if (fairyOff.heal > 0) atkMsg += ` 💚+${fairyOff.heal}`;
      popMessage(atkMsg);

      if (battleFriendHP <= 0) {

  setTimeout(async () => {

    if (window.BattleLoading) BattleLoading.start();

    try {

      // ==========================================
      // 1. คำนวณรางวัล
      // ==========================================

      // 🧚 ภูติ: Luck / XP (ทอยตอนชนะ)
      const fairyBonus = rollFairyWinBonus();
      const rewardCoins = Math.round(50 * fairyBonus.coinMult);
      const rewardExp = Math.round(60 * fairyBonus.expMult);
      
      const friendCoins =
        parseInt(
          battleTargetFriend["coin"]
        ) || 0;

      const stolenCoins =
        Math.floor(
          friendCoins * 0.05
        );


      // ==========================================
      // 2. สัตว์ของเรา
      // ==========================================

      const myWinPet =
        currentStudent.pets[
          battleLockedMyPetIndex
        ];

      if (!myWinPet) {
        throw new Error(
          "ไม่พบสัตว์ของผู้ชนะ"
        );
      }


      // ==========================================
      // 3. อัปเดตข้อมูลเรา
      // ==========================================

      myWinPet.power =
        (myWinPet.power || 10) + 1;

      wallet.coins +=
        rewardCoins + stolenCoins;

      wallet.exp += rewardExp;


      // ==========================================
      // 4. เตรียมข้อมูลเพื่อน
      // ==========================================

      const friendPets =
        safeParse(
          battleTargetFriend["pets"],
          []
        );

      const targetPetIndex =
        battleTargetFriend
          .selectedPetIndex;


      if (
        targetPetIndex === undefined ||
        !friendPets[targetPetIndex]
      ) {

        throw new Error(
          "ไม่พบสัตว์ที่ถูกโจมตี"
        );
      }


      // ==========================================
      // 5. ให้สัตว์เพื่อนพัก 3 ชั่วโมง
      // ==========================================

      const restWakeTime =
        getReferenceDate().getTime() +
        3 * 60 * 60 * 1000;

      friendPets[targetPetIndex].battle =
        `rest_${restWakeTime}`;


      // ==========================================
      // 6. อัปเดตเงินเพื่อนใน cache
      // ==========================================

      const newFriendCoins =
        Math.max(
          0,
          friendCoins - stolenCoins
        );

      battleTargetFriend["coin"] =
        newFriendCoins;

      battleTargetFriend["pets"] =
        JSON.stringify(
          friendPets
        );


      // ==========================================
      // 6.5 ⭐ บันทึกประวัติของเรา
      // ==========================================

      addHistoryLog(
        "battle_win",
        `โจมตี ${battleTargetFriend["ชื่อ"] || "เพื่อน"} ชนะ! ได้ 🪙${rewardCoins + stolenCoins} EXP+${rewardExp}`
      );


      // ==========================================
      // 7. ⭐ เซฟเพื่อน
      // ==========================================

      await saveFriendPetRest(
        stolenCoins
      );


      // ==========================================
      // 8. ⭐ เซฟข้อมูลเรา
      // ==========================================

      await saveWalletAndData();


      // ==========================================
      // 9. สำเร็จจริงทั้งสองฝั่ง
      // ==========================================

      console.log(
        "🎉 BATTLE SAVE COMPLETE"
      );

      console.log(
        "Reward:",
        rewardCoins
      );

      console.log(
        "Stolen:",
        stolenCoins
      );


      showBattleResultFx({

        type: "victory",

        title:
          "🎉 คุณชนะแล้ว!",

        message:
          "การโจมตีของคุณเอาชนะคู่ต่อสู้ได้สำเร็จ!",

        rewards: [

          `🪙 ได้รับเหรียญ +${rewardCoins}`,

          `💰 ขโมยเงินเพื่อน +${stolenCoins}`,

          `💪 ${myWinPet.type} Power +1`,

          `✨ EXP +${rewardExp}`,

          ...fairyBonus.notes

        ],

        onConfirm: () => {

          closeBattleScreen();

        }

      });


    } catch (err) {

      console.error(
        "❌ BATTLE SAVE ERROR:",
        err
      );


      // ==========================================
      // ⭐ สำคัญ
      // อย่าแสดงว่าได้รางวัลถ้ายังเซฟไม่ครบ
      // ==========================================

      showBattleResultFx({

        type: "victory",

        title:
          "⚠️ ชนะการต่อสู้แล้ว",

        message:
          "การต่อสู้ชนะแล้ว แต่ระบบยังบันทึกข้อมูลไม่สำเร็จ กรุณาอย่าเพิ่งปิดหรือรีเฟรชหน้านี้",

        rewards: [

          "🏆 ผลการต่อสู้: ชนะ",

          "⏳ ระบบกำลังมีปัญหาในการบันทึกข้อมูล",

          "❗ รางวัลจะยังไม่ถูกยืนยันจนกว่าจะบันทึกสำเร็จ"

        ],

        onConfirm: () => {

          // ไม่ปิด battle ทันที
          // เพื่อไม่ให้ผู้เล่นคิดว่าทุกอย่างสำเร็จแล้ว

          popMessage(
            "⚠️ บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่"
          );

        }

      });

    }

  }, 500);

  return;
}

      executeEnemyTurn();

    }, 600);
  }

  function pickEnemySkillNum() {
    const r = Math.random() * 9;
    if (r < 4) return 1;
    if (r < 7) return 2;
    return 3;
  }

  function executeEnemyTurn() {
    const skillButtons = document.querySelectorAll(".skill-btn");
    const skillLabel = { 1: "เบา", 2: "กลาง", 3: "แรง" };

    setTimeout(() => {
      const friendFighter = document.getElementById("friendFighter");
      if (friendFighter) {
        friendFighter.classList.remove("attack-animate");
        void friendFighter.offsetWidth;
        friendFighter.classList.add("attack-animate");
      }

      let friendPet = battleTargetFriend.selectedPet;
      let friendPower = friendPet.power || 10;
      let enemySkillNum = pickEnemySkillNum();
      let damageToMe = Math.max(1, friendPower * enemySkillNum);

      // 🧚 ภูติ: ฝั่งเพื่อน Cri / Steal / Heal (ใช้ภูติที่เพื่อนตั้งไว้) — ฝั่งเรา Dodge / Protect (ทอยใหม่ทุกครั้งที่ถูกโจมตี)
      const foeOff = applyFairyOffense("foe", damageToMe);
      const fairyDef = applyFairyDefense("my", foeOff.damage);
      damageToMe = fairyDef.damage;
      battleCurrentHP = Math.max(0, battleCurrentHP - damageToMe);
      const foeStolen = Math.min(fairyDef.dodged ? 0 : foeOff.steal, battleCurrentHP);
      battleCurrentHP -= foeStolen;
      const foeHealed = foeOff.heal + foeStolen;
      if (foeHealed > 0) {
        battleFriendHP = Math.min(battleFriendMaxHP, battleFriendHP + foeHealed);
        const foeHpFillF = document.getElementById("friendHpFill");
        const foeHpTextF = document.getElementById("friendHpText");
        if (foeHpFillF) foeHpFillF.style.width = `${(battleFriendHP / battleFriendMaxHP) * 100}%`;
        if (foeHpTextF) foeHpTextF.textContent = battleFriendHP;
      }

      // ⭐ ถ้าเพื่อนสุ่มได้ท่า 3 (แรง) → ขึ้นเอฟเฟกต์ระเบิดที่ตัวเรา (myFighter)
      if (enemySkillNum === 3 && !fairyDef.dodged) {
        playSkillHitEffect("myHitEffect", friendPet.type);
      }

      const myHpFill = document.getElementById("myHpFill");
      const myHpText = document.getElementById("myHpText");
      if (myHpFill) myHpFill.style.width = `${(battleCurrentHP / battleMaxHP) * 100}%`;
      if (myHpText) myHpText.textContent = battleCurrentHP;

      if (fairyDef.dodged) {
        popMessage(`🌀 ภูติช่วยหลบท่า${skillLabel[enemySkillNum]} ของเพื่อนได้!`);
      } else {
        let defMsg = foeOff.crit > 1
          ? `💥 เพื่อนใช้ท่า${skillLabel[enemySkillNum]} คริติคอล ×${fairyFmt(foeOff.crit)}! ${damageToMe} HP!`
          : `💥 เพื่อนใช้ท่า${skillLabel[enemySkillNum]} สร้างความเสียหาย ${damageToMe} HP!`;
        if (fairyDef.reduction > 0) defMsg += ` 🛡️-${fairyFmt(fairyDef.reduction)}%`;
        if (foeStolen > 0) defMsg += ` 🧛-${foeStolen}`;
        popMessage(defMsg);
      }

      if (battleCurrentHP <= 0) {

  setTimeout(async () => {

    if (window.BattleLoading) BattleLoading.start();

    // ⭐ สัตว์ของเราแพ้ → เข้าโหมดพักฟื้น 3 ชั่วโมง (เหมือนสัตว์เพื่อนที่โดนโจมตี)
    const myLostPet = currentStudent.pets[battleLockedMyPetIndex];
    if (myLostPet) {
      myLostPet.battle =
        `rest_${getReferenceDate().getTime() + 3 * 60 * 60 * 1000}`;
    }

    addHistoryLog(
      "battle_lose",
      `พ่ายแพ้ให้ ${battleTargetFriend["ชื่อ"] || "เพื่อน"}`
    );

    try {
      await saveWalletAndData();
    } catch (err) {
      console.error("Save history on defeat failed:", err);
    }

    /* =========================================
       แสดง Card แพ้
    ========================================== */

    showBattleResultFx({

      type: "defeat",

      title: "💔 คุณพ่ายแพ้",

      message:
        "สัตว์เลี้ยงของคุณหมดพลังในการต่อสู้ครั้งนี้",


      rewards: [],


      onConfirm: () => {

        closeBattleScreen();

      }

    });


  }, 500);

} else {

  skillButtons.forEach(btn => btn.disabled = false);

}
    }, 800);
  }

  function generateMathChallenge(numCount) {
    const opsPool = ['+', '-', '*', '/'];
    let numbers, operators, result;
    let attempts = 0;

    do {
      numbers = [];
      for (let i = 0; i < numCount; i++) numbers.push(Math.floor(Math.random() * 9) + 1);
      operators = [];
      for (let i = 0; i < numCount - 1; i++) operators.push(opsPool[Math.floor(Math.random() * opsPool.length)]);

      let terms = [numbers[0]];
      for (let i = 0; i < operators.length; i++) {
        const op = operators[i];
        const num = numbers[i + 1];
        if (op === '*') terms[terms.length - 1] *= num;
        else if (op === '/') terms[terms.length - 1] /= num;
        else if (op === '+') terms.push(num);
        else terms.push(-num);
      }
      result = terms.reduce((a, b) => a + b, 0);
      attempts++;
    } while ((!Number.isInteger(result) || result < 0) && attempts < 100);

    if (!Number.isInteger(result) || result < 0) {
      numbers = Array.from({ length: numCount }, () => Math.floor(Math.random() * 9) + 1);
      operators = Array(numCount - 1).fill('+');
      result = numbers.reduce((a, b) => a + b, 0);
    }

    const displaySymbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };
    let equationText = numbers[0].toString();
    for (let i = 0; i < operators.length; i++) {
      equationText += ` ${displaySymbols[operators[i]]} ${numbers[i + 1]}`;
    }

    return { equationText, answer: result };
  }

  function openMathChallenge(skillNum) {
    pendingSkillNum = skillNum;
    const numCount = skillNum === 2 ? 3 : 4;
    const challenge = generateMathChallenge(numCount);
    mathChallengeAnswer = challenge.answer;
    mathChallengeInput = "";

    document.getElementById("mathEquationDisplay").textContent = `${challenge.equationText} = ?`;
    document.getElementById("mathAnswerDisplay").innerHTML = "&nbsp;";
    document.getElementById("mathChallengeModal").style.display = "flex";

    startMathChallengeTimer();
  }

  function startMathChallengeTimer() {
    clearMathChallengeTimer();
    mathChallengeTimeLeft = MATH_CHALLENGE_TIME_LIMIT;
    updateMathTimerUI(true);

    mathChallengeTimerInterval = setInterval(() => {
      mathChallengeTimeLeft -= 1;
      updateMathTimerUI(false);
      if (mathChallengeTimeLeft <= 0) {
        clearMathChallengeTimer();
        handleMathChallengeTimeout();
      }
    }, 1000);
  }

  function clearMathChallengeTimer() {
    if (mathChallengeTimerInterval) {
      clearInterval(mathChallengeTimerInterval);
      mathChallengeTimerInterval = null;
    }
  }

  function updateMathTimerUI(isReset) {
    const fill = document.getElementById("mathTimerFill");
    const text = document.getElementById("mathTimerText");
    const timeShown = Math.max(0, mathChallengeTimeLeft);
    const pct = Math.max(0, (timeShown / MATH_CHALLENGE_TIME_LIMIT) * 100);

    if (fill) {
      if (isReset) {
        // ตัด transition ชั่วคราวตอนรีเซ็ตแถบ ไม่ให้มันไล่จาก 0% กลับไป 100%
        fill.style.transition = "none";
        fill.style.width = "100%";
        void fill.offsetWidth;
        fill.style.transition = "width 1s linear";
      } else {
        fill.style.width = `${pct}%`;
      }
      fill.style.background = timeShown <= 3
        ? "linear-gradient(90deg, #e74f66, #c0392b)"
        : "linear-gradient(90deg, #2ecc71, #e74f66)";
    }
    if (text) text.textContent = `เหลือเวลา ${timeShown} วินาที`;
  }

  function handleMathChallengeTimeout() {
    document.getElementById("mathChallengeModal").style.display = "none";
    pendingSkillNum = null;
    popMessage(`⏰ หมดเวลา! ตอบไม่ทัน ข้ามตาให้อีกฝ่ายโจมตี`);
    executeEnemyTurn();
  }

  function mathKeypadPress(digit) {
    if (mathChallengeInput.length >= 4) return;
    mathChallengeInput += digit;
    document.getElementById("mathAnswerDisplay").textContent = mathChallengeInput;
  }

  function mathKeypadBackspace() {
    mathChallengeInput = mathChallengeInput.slice(0, -1);
    document.getElementById("mathAnswerDisplay").innerHTML = mathChallengeInput || "&nbsp;";
  }

  function mathKeypadSubmit() {
    clearMathChallengeTimer();
    const userAnswer = parseInt(mathChallengeInput, 10);
    document.getElementById("mathChallengeModal").style.display = "none";

    const skillNum = pendingSkillNum;
    pendingSkillNum = null;

    if (!isNaN(userAnswer) && userAnswer === mathChallengeAnswer) {
      popMessage("✅ ตอบถูก! ใช้ท่าสำเร็จ");
      executeSkillAttack(skillNum);
    } else {
      popMessage(`❌ ตอบผิด! (เฉลย: ${mathChallengeAnswer}) ข้ามตาให้อีกฝ่ายโจมตี`);
      executeEnemyTurn();
    }
  }

  function renderRankList(ranking) {
    const container = document.getElementById("rank-list");
    if(!container) return;

    // ⭐ เรียงลำดับตามคะแนนจากมากไปน้อยเสมอ (กันกรณี backend ส่งข้อมูลมาไม่เรียง)
    const sortedRanking = [...ranking].sort((a, b) => {
      const scoreA = parseFloat(a["คะแนน"]) || 0;
      const scoreB = parseFloat(b["คะแนน"]) || 0;
      return scoreB - scoreA;
    });

    container.innerHTML = sortedRanking.map((item, idx) => {
      const medalEmoji = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : null;
      const rankDisplay = medalEmoji ? medalEmoji : (idx + 1);
      return `
      <div class="rank-item ${item["รหัสนักเรียน"] == studentKey ? 'is-me' : ''}">
        <div class="rank-num">${rankDisplay}</div>
        <div class="rank-name">${item["ชื่อ"] || "-"}</div>
        <div class="rank-score">${item["คะแนน"]} คะแนน</div>
      </div>
    `;
    }).join('');
  }

  function renderMissions() {
    const container = document.getElementById("mission-list");
    if(!container) return;
    
    let missionDataList = [];
    let claimedList = [];
    // ⭐ prefix ของ key ที่ใช้เก็บใน ClaimedRewards ต้องตรงกับ tab ที่กำลังแสดงอยู่
    const keyPrefix = currentMissionTab === 'main' ? 'main_quest' : 'extra_quest';
    
    if (currentMissionTab === 'main') {
      missionDataList = currentStudent.ภารกิจ || [];
      claimedList = currentStudent.ClaimedRewards || [];
    } else {
      if (extraStudentMission) {
        missionDataList = extraStudentMission.ภารกิจ || [];
        claimedList = extraStudentMission.ClaimedRewards || [];
      } else {
        container.innerHTML = `<div style="text-align:center; color:var(--ink-soft); font-size:12px; padding:20px;">ไม่มีข้อมูลวิชาเพิ่มเติม</div>`;
        return;
      }
    }

    if(missionDataList.length === 0) {
      container.innerHTML = `<div style="text-align:center; color:var(--ink-soft); font-size:12px; padding:20px;">ไม่มีภารกิจในขณะนี้</div>`;
      return;
    }

    container.innerHTML = missionDataList.map((m, idx) => {
      // ⭐ เช็คจาก key แบบ "main_quest_0" / "extra_quest_0" ให้ตรงกับที่เก็บใน Google Sheet จริงๆ
      const rewardKey = `${keyPrefix}_${idx}`;
      const isClaimed = claimedList.includes(rewardKey);
      const isDone = isMissionDone(m);
      // ⭐ รางวัลเพิ่มขึ้นเรื่อยๆ แบบลำดับเลขคณิต (50, 60, 70, ...) ตามลำดับภารกิจ
      const rewardVal = getMissionReward(idx);
      
      let statusBadge = isDone 
        ? `<span class="status-badge done-bg">เสร็จสิ้น</span>` 
        : `<span class="status-badge wait-bg">รอดำเนินการ</span>`;
        
      let actionBtn = "";
      if (isClaimed) {
        actionBtn = `<div class="claimed-tag">รับรางวัลแล้ว ✔️</div>`;
      } else if (isDone) {
        actionBtn = `<button class="claim-btn" onclick="claimMissionReward(${idx})">🎁 รับรางวัล (+${rewardVal} Coin/XP)</button>`;
      }

      return `
        <div class="mission-item" style="border-left-color: ${isDone ? 'var(--leaf)' : '#ccc'};">
          ${statusBadge}
          <div style="font-weight:600; color:var(--ink);">${m.name || 'ภารกิจ'}</div>
          <div style="font-size:11px; color:var(--ink-soft); margin-top:3px;">รางวัล: 💰 ${rewardVal} เหรียญ | ⭐ ${rewardVal} XP</div>
          ${actionBtn}
        </div>
      `;
    }).join('');
  }

  async function claimMissionReward(missionIdx) {
    let mission = null;
    let claimedList = null;
    // ⭐ ต้องใช้ key รูปแบบเดียวกับที่เก็บจริงใน Google Sheet เช่น "main_quest_0" / "extra_quest_0"
    const keyPrefix = currentMissionTab === 'main' ? 'main_quest' : 'extra_quest';
    const rewardKey = `${keyPrefix}_${missionIdx}`;

    if (currentMissionTab === 'main') {
      if (!Array.isArray(currentStudent.ClaimedRewards)) currentStudent.ClaimedRewards = [];
      claimedList = currentStudent.ClaimedRewards;
      mission = (currentStudent.ภารกิจ || [])[missionIdx];
    } else {
      if (!extraStudentMission) {
        popMessage("ไม่มีข้อมูลวิชาเพิ่มเติม");
        return;
      }
      if (!Array.isArray(extraStudentMission.ClaimedRewards)) extraStudentMission.ClaimedRewards = [];
      claimedList = extraStudentMission.ClaimedRewards;
      mission = (extraStudentMission.ภารกิจ || [])[missionIdx];
    }

    // ⭐ กันรับรางวัลซ้ำ / รับก่อนภารกิจเสร็จ / ภารกิจไม่มีอยู่จริง
    if (!mission) {
      popMessage("ไม่พบภารกิจนี้");
      return;
    }
    if (claimedList.includes(rewardKey)) {
      popMessage("รับรางวัลภารกิจนี้ไปแล้ว");
      return;
    }
    if (!isMissionDone(mission)) {
      popMessage("ภารกิจนี้ยังไม่เสร็จสิ้น ไม่สามารถรับรางวัลได้");
      return;
    }

    claimedList.push(rewardKey);
    // ⭐ รางวัลเพิ่มขึ้นเรื่อยๆ แบบลำดับเลขคณิต (50, 60, 70, ...) ตามลำดับภารกิจ
    const rewardVal = getMissionReward(missionIdx);

    wallet.coins += rewardVal;
    wallet.exp += rewardVal;

    renderMissions();
    updateWalletUI();
    await saveWalletAndData();
    popMessage(`🎉 รับรางวัลภารกิจสำเร็จ! (+${rewardVal} Coin/XP)`);
  }

  // ⭐ ถ้าเปิดเกมค้างข้ามเที่ยงคืน ให้ประเมินสถานะน้ำ/อาหาร/ป่วย/ตายใหม่ทันที (ไม่ต้องรีเฟรช)
  let _lastDayKey = null;
  function startDayWatcher() {
    _lastDayKey = todayStr();
    setInterval(() => {
      const t = todayStr();
      if (t === _lastDayKey) return;
      _lastDayKey = t;
      checkAndInitPets();
      renderPetsDOM();
      refreshHungerState();
    }, 30000);
  }

  let _wanderTimer = null;
  function startWanderLoop() {
    if (_wanderTimer) return;                        // กัน interval ซ้อนเวลา login ซ้ำ
    _wanderTimer = setInterval(() => {
      const useIsland = !!(window.Island && Island.ready());
      const sceneW = document.getElementById("scene") ? document.getElementById("scene").clientWidth : 380;
      petInstances.forEach((pInst, idx) => {
        if(!pInst || !currentStudent.pets[idx] || currentStudent.pets[idx].dead) return;
        if (useIsland) {
          if (Island.isMoving(idx) || Math.random() > 0.5) return;
          const t = Island.pickWander(pInst.x, pInst.y);   // จุดเดินเล่นบนสนามหญ้า ระยะ 140-420px
          if (t) Island.walkTo(idx, pInst, t.x, t.y, Island.WALK_SPEED);
          return;
        }
        if(Math.random() > 0.4) return;
        pInst.targetX = Math.max(30, Math.min(sceneW - 130, pInst.x + (Math.random() * 80 - 40)));
        pInst.targetY = Math.max(35, Math.min(65, pInst.y + (Math.random() * 20 - 10)));
        animatePetMove(idx);
      });
    }, 4500);
  }


/* =========================================================
   🏡 เยี่ยมบ้านเพื่อน (ปุ่ม Icon/Search.png)
   รายชื่อใช้ action=ranking · ตอนกดเข้าบ้านใช้ action=visit (ดึงสด)
   ========================================================= */
let visitFriends = [];

function visitEsc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
}

async function openVisitModal() {
  document.getElementById("visitModal").style.display = "flex";
  const body = document.getElementById("visitBody");
  body.innerHTML = window.LoadingFX
    ? LoadingFX.balls("กำลังค้นหาบ้านเพื่อนๆ...", { color: "#ff6b81", textStyle: "color:#7f8c8d;" })
    : "<p style='text-align:center; color:#7f8c8d;'>กำลังค้นหาบ้านเพื่อนๆ...</p>";
  try {
    const data = await fetchWithRetry(`${API_URL}?action=ranking`);
    if (data.success && Array.isArray(data.ranking)) {
      visitFriends = data.ranking.filter(s => String(s["รหัสนักเรียน"] || "").trim() !== String(studentKey || "").trim());
      renderVisitList();
    } else {
      body.innerHTML = "<p style='text-align:center; color:#e74f66;'>ไม่สามารถโหลดรายชื่อบ้านได้</p>";
    }
  } catch (err) {
    body.innerHTML = "<p style='text-align:center; color:#e74f66;'>เกิดข้อผิดพลาดในการเชื่อมต่อ</p>";
  }
}

function buildVisitTilesHTML(query = "") {
  const q = String(query || "").trim().toLowerCase();
  let html = "";
  visitFriends.forEach((f, idx) => {
    const name = String(f["ชื่อ"] || "");
    const sid = String(f["รหัสนักเรียน"] || "");
    if (q && !name.toLowerCase().includes(q) && !sid.toLowerCase().includes(q)) return;
    html += `<button class="visit-row" onclick="visitFriendHouse(${idx})">
      <img src="Icon/Plant.png" alt="">
      <span class="visit-row-text">
        <b>${visitEsc(name || sid)}</b>
        <small>รหัส ${visitEsc(sid)}</small>
      </span>
      <span class="visit-row-go">›</span>
    </button>`;
  });
  if (html) return `<div class="visit-list">${html}</div>`;
  return `<div class="visit-empty">${q ? "ไม่พบบ้านที่ตรงกับ \"" + visitEsc(q) + "\"" : "ยังไม่มีบ้านเพื่อนในระบบ"}</div>`;
}

function renderVisitList() {
  document.getElementById("visitBody").innerHTML = `
    <div class="friend-search-box">
      <span class="friend-search-icon">🔍</span>
      <input type="text" id="visitSearchInput" class="friend-search-input" placeholder="ค้นหาชื่อหรือรหัสนักเรียน..." autocomplete="off" oninput="filterVisitList(this.value)">
      <button type="button" id="visitSearchClear" class="friend-search-clear" onclick="clearVisitSearch()" aria-label="ล้างคำค้นหา">✕</button>
    </div>
    <div id="visitListItems">${buildVisitTilesHTML("")}</div>`;
}

function filterVisitList(query) {
  const el = document.getElementById("visitListItems");
  if (el) el.innerHTML = buildVisitTilesHTML(query);
  const clr = document.getElementById("visitSearchClear");
  if (clr) clr.style.display = query ? "flex" : "none";
}

function clearVisitSearch() {
  const input = document.getElementById("visitSearchInput");
  if (input) { input.value = ""; input.focus(); }
  filterVisitList("");
}

// เข้าชมบ้านเพื่อน (ดูอย่างเดียว ไม่มีผลกับข้อมูลใคร)
// ดึงข้อมูลสดของเพื่อนคนนั้นจากชีทตอนกดเข้าไป (action=visit) ไม่ใช้ข้อมูลเก่าจากตอนโหลดรายชื่อ
// หน้าเยี่ยมบ้าน = เต็มจอเหมือนบ้านเรา ใช้เกาะ/การเดินชุดเดียวกัน (island.js สร้างอีกชุดแยกจากบ้านเรา)
// ไม่มีปุ่มอะไรเลยนอกจากย้อนกลับ · ด้านบนบอกแค่ชื่อบ้าน + จำนวนสัตว์ (ไม่แสดงเงิน/XP/คะแนน)
let visitIsland = null;           // Island ชุดที่ 2 (สร้างตอนเยี่ยมบ้านครั้งแรก)
let visitPetInstances = [];
let visitWanderTimer = null;
let visitDepthTimer = null;
let visitToken = 0;               // กันผลเก่าวาดทับ เมื่อกดบ้านอื่น/ย้อนกลับระหว่างรอโหลด
let visitCurrentIdx = -1;         // ลำดับเพื่อนที่กำลังเยี่ยมอยู่ (ใช้กับปุ่มท้าดวลขวาบน)

function getVisitIsland() {
  if (visitIsland) return visitIsland;
  if (!window.createIsland) return null;
  visitIsland = createIsland({
    sceneId: "visitScene", petsId: "visitPetsContainer", prefix: "visitWorld", worldId: "visitWorld",
    petPrefix: "vpet_el_", controls: false, bowls: false
  });
  return visitIsland;
}

function stopVisitLoops() {
  if (visitWanderTimer) { clearInterval(visitWanderTimer); visitWanderTimer = null; }
  if (visitDepthTimer) { clearInterval(visitDepthTimer); visitDepthTimer = null; }
}

// ชั้นภาพ: ตัวที่อยู่ต่ำกว่า (ใกล้คนดู) อยู่ข้างหน้า
function updateVisitDepth() {
  const els = Array.from(document.querySelectorAll("#visitPetsContainer .avatar-container"));
  if (!els.length) return;
  els.map(el => ({ el, y: el.offsetTop + el.offsetHeight }))
    .sort((a, b) => a.y - b.y)
    .forEach((o, i) => { const z = 5 + i; if (o.el.style.zIndex !== String(z)) o.el.style.zIndex = z; });
}

function buildVisitPets(pets) {
  const isl = visitIsland;
  const container = document.getElementById("visitPetsContainer");
  isl.stopAll();
  isl.resetPets();             // บ้านใหม่ = เริ่มวางตำแหน่งใหม่ ไม่ใช้ตำแหน่งค้างจากบ้านก่อนหน้า
  container.innerHTML = "";
  visitPetInstances = [];

  pets.forEach((pet, index) => {
    const isBaby = isPetBaby(pet.born);
    const sp = isl.spawnPos(index);
    const inst = { index, type: pet.type, born: pet.born, sick: pet.sick, dead: pet.dead, x: sp.x, y: sp.y, targetX: sp.x, targetY: sp.y };
    visitPetInstances[index] = inst;

    const el = document.createElement("div");
    el.className = `avatar-container pet-${pet.type} ${isBaby ? "baby" : ""} ${pet.dead ? "dead" : ""}`;
    el.id = `vpet_el_${index}`;
    el.style.cursor = "default";
    isl.place(index, inst, el);
    applyPetLayout(el, pet.type);

    const bodyImg = getPetImage(pet.type, false), legImg = getPetImage(pet.type, true);
    const iconHTML = pet.dead ? `<img src="Icon/ghost.png" class="pet-icon-status" alt="">`
      : (pet.sick ? `<img src="Icon/sick.png" class="pet-icon-status" alt="">`
      : (isBaby ? `<img src="Icon/baby.png" class="pet-icon-status" alt="">` : ""));
    el.innerHTML = `
      ${iconHTML}
      <div class="pet-flip">
        <div class="pet-assembly">
          <img src="${legImg}" class="leg leg-back leg-back-left" alt="">
          <img src="${legImg}" class="leg leg-back leg-back-right" alt="">
          <img src="${bodyImg}" class="body-img" alt="">
          <img src="${legImg}" class="leg leg-front leg-front-left" alt="">
          <img src="${legImg}" class="leg leg-front leg-front-right" alt="">
        </div>
      </div>`;
    container.appendChild(el);
  });
  updateVisitDepth();
}

function startVisitLoops() {
  stopVisitLoops();
  visitDepthTimer = setInterval(updateVisitDepth, 120);
  visitWanderTimer = setInterval(() => {
    const isl = visitIsland;
    if (!isl) return;
    visitPetInstances.forEach((inst, idx) => {
      if (!inst || inst.dead) return;                       // ตัวที่ตายไม่เดิน (เหมือนบ้านเรา)
      if (isl.isMoving(idx) || Math.random() > 0.5) return;
      const t = isl.pickWander(inst.x, inst.y);
      if (t) isl.walkTo(idx, inst, t.x, t.y, isl.WALK_SPEED);
    });
  }, 4500);
}

async function visitFriendHouse(idx) {
  const base = visitFriends[idx];
  if (!base) return;
  const sid = String(base["รหัสนักเรียน"] || "");
  const token = ++visitToken;
  visitCurrentIdx = idx;
  const screen = document.getElementById("visitScreen");
  const loading = document.getElementById("visitLoading");

  document.getElementById("visitHouseTitle").textContent = `บ้านของ ${base["ชื่อ"] || sid || "เพื่อน"}`;
  document.getElementById("visitPetCount").textContent = "-";
  loading.style.display = "flex";
  loading.innerHTML = window.LoadingFX
    ? LoadingFX.balls("กำลังเข้าไปเยี่ยมบ้าน...", { color: "#ff6b81", textStyle: "color:#fff;" })
    : "<p style='color:#fff;'>กำลังเข้าไปเยี่ยมบ้าน...</p>";
  screen.style.display = "block";

  const isl = getVisitIsland();
  if (!isl || !isl.ready()) { closeVisitHouse(); return; }

  let f = base;
  try {
    const data = await fetchWithRetry(`${API_URL}?action=visit&id=${encodeURIComponent(sid)}`);
    if (data && data.success && data.student) f = data.student;
  } catch (err) { /* ใช้ข้อมูลจากรายชื่อแทน */ }

  // ผู้ใช้กดย้อนกลับ/เลือกบ้านอื่นระหว่างรอ → ไม่ต้องวาดทับ
  if (token !== visitToken || screen.style.display === "none") return;

  const name = String(f["ชื่อ"] || f["รหัสนักเรียน"] || "เพื่อน");
  const pets = safeParse(f["pets"]).filter(p => p && !p.breed);

  let fItems = {};
  try { fItems = typeof f["items"] === "string" ? JSON.parse(f["items"] || "{}") : (f["items"] || {}); } catch (e) { fItems = {}; }
  const fBg = bgIds().find(id => parseInt(fItems[id]) === 9) || "Grass.png";   // 9 = เกาะที่เพื่อนใช้อยู่

  document.getElementById("visitHouseTitle").textContent = `บ้านของ ${name}`;
  document.getElementById("visitPetCount").textContent = pets.length;

  isl.setIsland(fBg);          // เปลี่ยนเกาะ (ล้างตำแหน่งสัตว์เก่า) แล้ววางสัตว์ของเพื่อน
  buildVisitPets(pets);
  isl.recenter();
  loading.style.display = "none";
  startVisitLoops();
}

function closeVisitHouse() {
  visitToken++;
  stopVisitLoops();
  if (visitIsland) visitIsland.stopAll();
  document.getElementById("visitScreen").style.display = "none";
  document.getElementById("visitLoading").style.display = "none";
  const c = document.getElementById("visitPetsContainer");
  if (c) c.innerHTML = "";
  visitPetInstances = [];
}
// ⚔️ ปุ่มขวาบนในหน้าเยี่ยมบ้าน → ท้าดวลเจ้าของบ้านนี้ได้ทันที (ข้ามหน้าเลือกเพื่อน)
let visitToastTimer = null;
function visitToast(text) {
  const el = document.getElementById("visitToast");
  if (!el) { popMessage(text); return; }
  el.textContent = text; el.style.display = "block";
  clearTimeout(visitToastTimer);
  visitToastTimer = setTimeout(() => { el.style.display = "none"; }, 2200);
}

async function challengeFromVisit() {
  if (battleEntering) return;
  const base = visitFriends[visitCurrentIdx];
  if (!base) return;
  const btn = document.getElementById("visitBattleBtn");
  const btnText = document.getElementById("visitBattleBtnText");
  const setBusy = busy => { if (btn) btn.disabled = busy; if (btnText) btnText.textContent = busy ? "กำลังเตรียม..." : "ท้าดวล"; };
  setBusy(true);

  // ดึงข้อมูลเพื่อนสดๆ ก่อนสู้ (การชนะมีการหักเหรียญ/บันทึกข้อมูลเพื่อน จึงไม่ควรใช้ข้อมูลเก่าจากตอนโหลดรายชื่อ)
  let friend = base;
  try {
    const data = await fetchWithRetry(`${API_URL}?action=ranking`);
    if (data && data.success && Array.isArray(data.ranking)) {
      const sid = String(base["รหัสนักเรียน"] || "").trim();
      const fresh = data.ranking.find(s => String(s["รหัสนักเรียน"] || "").trim() === sid);
      if (fresh) friend = fresh;
    }
  } catch (err) { /* ใช้ข้อมูลจากรายชื่อแทน */ }
  setBusy(false);

  // กดย้อนกลับหรือเปลี่ยนบ้านระหว่างรอ → ไม่ต้องทำต่อ
  if (document.getElementById("visitScreen").style.display === "none" || visitFriends[visitCurrentIdx] !== base) return;

  // เลือกสัตว์ของเรา: ใช้ตัวที่ล็อคไว้ ถ้าใช้ไม่ได้ก็หาตัวแรกที่พร้อมรบ
  const pets = (currentStudent && currentStudent.pets) || [];
  const nowMS = getReferenceDate().getTime();
  const isAdultReady = p => {
    if (!p || p.dead || isPetBaby(p.born)) return false;
    const be = p.breedEndTime ? new Date(p.breedEndTime).getTime() : null;
    return !(p.breed === true && be && nowMS < be);
  };
  const canAttack = i => isAdultReady(pets[i]) && getPetAttackStatus(i).count > 0;

  let myIdx = -1;
  if (battleLockedMyPetIndex !== null && canAttack(battleLockedMyPetIndex)) myIdx = battleLockedMyPetIndex;
  else myIdx = pets.findIndex((p, i) => canAttack(i));

  if (myIdx === -1) {
    visitToast(pets.some((p, i) => isAdultReady(p))
      ? "สัตว์ของคุณใช้สิทธิ์บุกครบแล้ว! รอสักพักนะ"
      : "กรุณามีสัตว์โตเต็มวัยอย่างน้อย 1 ตัว!");
    return;
  }
  if (!safeParse(friend["pets"]).some(p => isFriendPetReadyForBattle(p))) {
    visitToast("เพื่อนคนนี้ไม่มีสัตว์ที่พร้อมต่อสู้!");
    return;
  }

  battleLockedMyPetIndex = myIdx;
  closeVisitHouse();
  closeModal("visitModal");
  openBattleScreen();                 // เตรียมหน้าต่อสู้ไว้ข้างหลัง แล้วเข้าสู่ขั้นตอนท้าดวลเดิม (ArenaDash เต็มจอทันที)
  await selectFriendTarget(friend);
}
