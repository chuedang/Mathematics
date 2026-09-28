const API_URL = "https://script.google.com/macros/s/AKfycbzTMBFqzbRJNZDIu4lJVUoxs5eTPdjx_YBMgVLxDZGO9sf0abToJgqOgyxwTsbQI0wmYQ/exec";

  // ⭐ สัตว์จะตาย (dead:true) เมื่อเลยวันที่อิ่มสุดท้าย (validUntil) มาแล้วครบกี่วัน
  const PET_DEAD_AFTER_DAYS = 10;

  // ⭐ ข้อมูลสัตว์แต่ละชนิด: ชื่อ, ไฟล์ภาพ (โฟลเดอร์ Animals/), ชื่อไฟล์สกิล (โฟลเดอร์ Skills/)
  const PET_INFO = {
    cat:           { name: "แมว",              body: "cat_body.png",           leg: "cat_leg.png",           skill: "cat" },
    dog:           { name: "หมา",              body: "dog_body.png",           leg: "dog_leg.png",           skill: "dog" },
    giraffe:       { name: "ยีราฟ",            body: "giraffe_body.png",       leg: "giraffe_leg.png",       skill: "giraffe" },
    sheep:         { name: "แกะ",              body: "sheep_body.png",         leg: "sheep_leg.png",         skill: "sheep" },
    deer:          { name: "กวาง",             body: "deer_body.png",          leg: "deer_leg.png",          skill: "deer" },
    siberianhusky: { name: "ไซบีเรียนฮัสกี้",  body: "SiberianHusky_body.png", leg: "SiberianHusky_leg.png", skill: "siberianhusky" },
    elepant:       { name: "ช้าง",             body: "Elepant_body.png",       leg: "Elepant_leg.png",       skill: "Elepant" }
  };

  let SHOP_ITEMS = [
    { id: "cat", type: "pet", name: "น้องแมวสุดน่ารัก", price: 500, img: "Shop/cat_shop.png" },
    { id: "dog", type: "pet", name: "น้องหมาแสนรู้", price: 500, img: "Shop/dog_shop.png" },
    { id: "siberianhusky", type: "pet", name: "ไซบีเรียนฮัสกี้", price: 700, img: "Shop/SiberianHusky_shop.png" },
    // ช้าง (elepant) ไม่ขายในร้าน ได้จากการสุ่มผสมพันธุ์ / วงล้อมินิเกมเท่านั้น
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
    { id: "BG.png", type: "bg", name: "ฉากหลังเริ่มต้น", price: 0, img: "Background/BG.png" },
    { id: "pinkBG.png", type: "bg", name: "ฉากหลังสีชมพูหวาน", price: 1000, img: "Background/pinkBG.png" },
    { id: "grayBG.png", type: "bg", name: "ฉากหลังเทาสุดเท่", price: 1500, img: "Background/grayBG.png" },
    { id: "whiteBG.png", type: "bg", name: "ฉากหลังขาวสะอาด", price: 2000, img: "Background/whiteBG.png" }
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
  let currentBackground = 'BG.png';

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
      let filteredMissions = safeParse(student["ภารกิจ"]).filter(m => String(m.name || "").trim().toLowerCase() !== "xp");

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
      
      const savedBg = localStorage.getItem(`pet_bg_${studentKey}`);
      currentBackground = savedBg ? savedBg : "BG.png";
      if(!purchasedItems.includes("BG.png")) purchasedItems.push("BG.png");
      applyBackground(currentBackground);

      document.getElementById("loginPage").style.display = "none";
      document.getElementById("dashboard").style.display = "block";

      document.getElementById("displayName").textContent = currentStudent["ชื่อ"];
      document.getElementById("displayScore").textContent = currentStudent["คะแนน"];
      const classText = document.getElementById("displaySheet");
      if(classText) classText.textContent = currentStudent["ชั้น"];

      loadWalletAndInventory(student);
      checkAndInitPets();
      renderPetsDOM();
      refreshHungerState();
      renderMissions();
      renderShopList('pet');
      renderFoodGrid();
      startWanderLoop();
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
    purchasedItems = Object.keys(inventory).filter(id => (parseInt(inventory[id]) || 0) > 0);
    if (!purchasedItems.includes("BG.png")) purchasedItems.push("BG.png");

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
    document.getElementById("bagVaccineCount").textContent = inventory.vaccine || 0;
    document.getElementById("bagPotionCount").textContent = inventory.potion || 0;
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
      if (lastWater && !pet.dead && diffDays(nowStr, lastWater) >= 3) pet.sick = true;
      if (validUntil && !pet.dead && diffDays(nowStr, validUntil) >= PET_DEAD_AFTER_DAYS) pet.dead = true;
    });
  }

  function getPetImage(type, isLeg = false) {
    const info = PET_INFO[type] || PET_INFO.cat;
    return "Animals/" + (isLeg ? info.leg : info.body);
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
    const container = document.getElementById("petsContainer");
    container.innerHTML = "";
    petInstances = [];
    const sceneW = document.getElementById("scene") ? document.getElementById("scene").clientWidth : 380;

    currentStudent.pets.forEach((pet, index) => {
      if (pet.breed) return;

      const isBaby = isPetBaby(pet.born);
      const x = sceneW * 0.2 + (index * 60) % (sceneW * 0.6);
      const y = 45 + (index * 10) % 20;

      petInstances[index] = ({ index: index, type: pet.type, born: pet.born, sick: pet.sick, dead: pet.dead, x: x, y: y, targetX: x, targetY: y, isWalking: false });

      const el = document.createElement("div");
      el.className = `avatar-container ${isBaby ? 'baby' : ''} ${pet.dead ? 'dead' : ''}`;
      el.id = `pet_el_${index}`;
      el.style.left = x + "px";
      el.style.top = y + "%";
      el.onclick = (e) => tapPet(e, index);

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

  function buyItem(itemObj){
    if(itemObj.type === 'pet' || itemObj.type === 'medicine' || itemObj.type === 'food' || (itemObj.type === 'bg' && !purchasedItems.includes(itemObj.id))){
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
        inventory[itemObj.id] = (parseInt(inventory[itemObj.id]) || 0) + 1;
        currentStudent.items = { ...inventory };

        if(itemObj.type === 'bg'){
          purchasedItems = Object.keys(inventory).filter(id => (parseInt(inventory[id]) || 0) > 0);
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
      popMessage("ซื้อสำเร็จ! 🎉");
      return;
    }

    if(itemObj.type === 'bg' && purchasedItems.includes(itemObj.id)){
      currentBackground = itemObj.id;
      localStorage.setItem(`pet_bg_${studentKey}`, currentBackground);
      applyBackground(currentBackground);
      popMessage(`เปลี่ยนฉากหลังเป็น ${itemObj.name} แล้ว!`);
      renderShopList(currentShopTab);
    }
  }

  function applyBackground(bgFilename) {
    const sceneEl = document.getElementById("scene");
    if(sceneEl) sceneEl.style.backgroundImage = `url("Background/${bgFilename}")`;
  }

  function renderShopList(tabType = 'pet'){
    const container = document.getElementById("shopListContainer");
    if(!container) return;
    container.innerHTML = SHOP_ITEMS.filter(item => item.type === tabType && !item.noShop).map(item => {
      let btnText = "ซื้อ", btnClass = "buy-btn";
      if(item.type === 'bg') {
        if(currentBackground === item.id) { btnText = "ใช้อยู่"; btnClass = "buy-btn equipped"; }
        else if(purchasedItems.includes(item.id)) { btnText = "ใช้"; }
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

    const possibleTypes = ["dog", "cat", "giraffe", "sheep", "deer", "siberianhusky", "elepant"];
    const babyType = possibleTypes[Math.floor(Math.random() * possibleTypes.length)];
    
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
    document.getElementById("rank-list").innerHTML = "<p style='text-align:center; color:#7f8c8d;'>กำลังโหลดอันดับ...</p>";
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
          <img src="${getPetImage(pet.type, false)}" style="width:45px; height:45px; object-fit:contain;" alt="">
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
    area.innerHTML = `<div style="color:#fff; font-size:14px;">กำลังค้นหาเพื่อนๆ ในระบบ...</div>`;

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

try {

  await saveWalletAndData();

} catch (err) {

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

  renderBattleArenaScreen();
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
          <div class="fighter-assembly-container" id="myFighter">
            <div class="fighter-flip">
              <img src="${myLegImg}" class="fighter-leg fighter-leg-back fighter-leg-back-left" alt="">
              <img src="${myLegImg}" class="fighter-leg fighter-leg-back fighter-leg-back-right" alt="">
              <img src="${myBodyImg}" class="fighter-body-img" alt="">
              <img src="${myLegImg}" class="fighter-leg fighter-leg-front fighter-leg-front-left" alt="">
              <img src="${myLegImg}" class="fighter-leg fighter-leg-front fighter-leg-front-right" alt="">
            </div>
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
          <div class="fighter-assembly-container" id="friendFighter">
            <div class="fighter-flip">
              <img src="${friendLegImg}" class="fighter-leg fighter-leg-back fighter-leg-back-left" alt="">
              <img src="${friendLegImg}" class="fighter-leg fighter-leg-back fighter-leg-back-right" alt="">
              <img src="${friendBodyImg}" class="fighter-body-img" alt="">
              <img src="${friendLegImg}" class="fighter-leg fighter-leg-front fighter-leg-front-left" alt="">
              <img src="${friendLegImg}" class="fighter-leg fighter-leg-front fighter-leg-front-right" alt="">
            </div>
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
      battleFriendHP = Math.max(0, battleFriendHP - damageToFriend);

      // ⭐ ท่า skill3 (ตอบเลขคณิตถูก) → ขึ้นเอฟเฟกต์ระเบิดที่ตัวอีกฝ่าย (friendFighter)
      if (skillNum === 3) {
        playSkillHitEffect("friendHitEffect", myPet.type);
      }

      const friendHpFill = document.getElementById("friendHpFill");
      const friendHpText = document.getElementById("friendHpText");
      if (friendHpFill) friendHpFill.style.width = `${(battleFriendHP / battleFriendMaxHP) * 100}%`;
      if (friendHpText) friendHpText.textContent = battleFriendHP;

      popMessage(`💥 โจมตีใส่เพื่อนสร้างความเสียหาย ${damageToFriend} HP!`);

      if (battleFriendHP <= 0) {

  setTimeout(async () => {

    try {

      // ==========================================
      // 1. คำนวณรางวัล
      // ==========================================

      const rewardCoins = 50;
      
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

      wallet.exp += 60;


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
        `โจมตี ${battleTargetFriend["ชื่อ"] || "เพื่อน"} ชนะ! ได้ 🪙${rewardCoins + stolenCoins} EXP+60`
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


      showBattleResult({

        type: "victory",

        title:
          "🎉 คุณชนะแล้ว!",

        message:
          "การโจมตีของคุณเอาชนะคู่ต่อสู้ได้สำเร็จ!",

        rewards: [

          `🪙 ได้รับเหรียญ +${rewardCoins}`,

          `💰 ขโมยเงินเพื่อน +${stolenCoins}`,

          `💪 ${myWinPet.type} Power +1`,

          `✨ EXP +60`

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

      showBattleResult({

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
      battleCurrentHP = Math.max(0, battleCurrentHP - damageToMe);

      // ⭐ ถ้าเพื่อนสุ่มได้ท่า 3 (แรง) → ขึ้นเอฟเฟกต์ระเบิดที่ตัวเรา (myFighter)
      if (enemySkillNum === 3) {
        playSkillHitEffect("myHitEffect", friendPet.type);
      }

      const myHpFill = document.getElementById("myHpFill");
      const myHpText = document.getElementById("myHpText");
      if (myHpFill) myHpFill.style.width = `${(battleCurrentHP / battleMaxHP) * 100}%`;
      if (myHpText) myHpText.textContent = battleCurrentHP;

      popMessage(`💥 เพื่อนใช้ท่า${skillLabel[enemySkillNum]} สร้างความเสียหาย ${damageToMe} HP!`);

      if (battleCurrentHP <= 0) {

  setTimeout(async () => {

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

    showBattleResult({

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

  function startWanderLoop() {
    setInterval(() => {
      const sceneW = document.getElementById("scene") ? document.getElementById("scene").clientWidth : 380;
      petInstances.forEach((pInst, idx) => {
        if(currentStudent.pets[idx].dead || Math.random() > 0.4) return;
        pInst.targetX = Math.max(30, Math.min(sceneW - 130, pInst.x + (Math.random() * 80 - 40)));
        pInst.targetY = Math.max(35, Math.min(65, pInst.y + (Math.random() * 20 - 10)));
        animatePetMove(idx);
      });
    }, 4500);
  }


/* =====================================================================
   🎮 MINIGAME  (ไอคอน Icon/Minigame.png)
   1) 🧮 ตอบโจทย์บวก ลบ คูณ หารเลข (ใช้ generateMathChallenge ตัวเดียวกับตอนต่อสู้)
        ตอบถูกข้อละ +1 เหรียญ +1 EXP
   2) 🎰 วงล้อสุ่มไอเทม ราคา 200 เหรียญ / ครั้ง
        รางวัล: อาหาร, วัคซีน, ช้าง (ถ้าสัตว์เต็มคอก → แปลงเป็นเงิน 1,000 เหรียญแทน)
===================================================================== */

const MG_REWARD_COIN = 1;          // เหรียญต่อ 1 ข้อที่ตอบถูก
const MG_REWARD_EXP  = 1;          // EXP ต่อ 1 ข้อที่ตอบถูก
const MG_MATH_NUM_COUNT = 3;       // จำนวนตัวเลขในโจทย์ (3 ตัว เท่ากับสกิล 2 ตอนต่อสู้)
const ROULETTE_COST = 200;         // ราคาต่อการหมุน 1 ครั้ง
const ROULETTE_FULL_COINS = 1000;  // เงินที่ได้แทนช้าง เมื่อสัตว์เต็มคอก

// น้ำหนักโอกาสสุ่ม (รวม = 100 → เท่ากับ % พอดี)
const ROULETTE_WEIGHT_ELEPANT   = 2;     // ช้าง 2%
const ROULETTE_WEIGHT_VACCINE   = 14;    // วัคซีน 14%
const ROULETTE_WEIGHT_SHOP_FOOD = 3.5;   // อาหารทั่วไป 12 เมนู × 3.5 = 42%
const ROULETTE_WEIGHT_THAI_FOOD = 4.2;   // อาหารไทย 10 เมนู × 4.2 = 42%

// ค่าจัดวางของแถบวงล้อ (ต้องตรงกับ CSS .rl-card)
const RL_CARD_W = 92, RL_STEP = 100, RL_COUNT = 60, RL_START_IDX = 3;
const RL_SPIN_MS = 6200;

let mgActiveTab = 'math';
let mgAnswer = 0;
let mgInput = "";
let mgLocked = false;
let mgTimeLeft = MATH_CHALLENGE_TIME_LIMIT;
let mgTimerInterval = null;
let mgNextTimeout = null;
let mgCorrectCount = 0;

let rlSpinning = false;
let rlPoolCache = null;
let rlRafId = null;

/* ---------- เปิด / ปิด ---------- */

function openMinigame() {
  mgCorrectCount = 0;
  document.getElementById("minigameScreen").style.display = "flex";
  mgRefreshCoins();
  mgUpdateSessionStats();
  renderRoulettePrizeList();
  rlPrepareIdleTrack();
  switchMinigameTab('math');
  document.addEventListener("keydown", mgKeyHandler);
}

function closeMinigame() {
  if (rlSpinning) { popMessage("รอวงล้อหยุดก่อนนะ! 🎰"); return; }
  mgStopTimer();
  clearTimeout(mgNextTimeout);
  document.getElementById("minigameScreen").style.display = "none";
  document.getElementById("mgResultOverlay").style.display = "none";
  document.removeEventListener("keydown", mgKeyHandler);
  updateWalletUI();
}

function switchMinigameTab(tab) {
  if (rlSpinning) { popMessage("รอวงล้อหยุดก่อนนะ! 🎰"); return; }
  mgActiveTab = tab;
  document.getElementById("mgTabMath").classList.toggle("active", tab === 'math');
  document.getElementById("mgTabRoulette").classList.toggle("active", tab === 'roulette');
  document.getElementById("mgMathPane").classList.toggle("active", tab === 'math');
  document.getElementById("mgRoulettePane").classList.toggle("active", tab === 'roulette');

  if (tab === 'math') {
    mgNewQuestion();
  } else {
    mgStopTimer();
    clearTimeout(mgNextTimeout);
    rlUpdateSpinBtn();
  }
}

function mgRefreshCoins() {
  const el = document.getElementById("mgCoins");
  if (el) el.textContent = wallet.coins;
  rlUpdateSpinBtn();
}

function mgUpdateSessionStats() {
  const el = document.getElementById("mgSessionStats");
  if (el) el.innerHTML = `รอบนี้ตอบถูก <b class="num">${mgCorrectCount}</b> ข้อ → 💰 +${mgCorrectCount * MG_REWARD_COIN} | ⭐ +${mgCorrectCount * MG_REWARD_EXP}`;
}

/* ---------- 🧮 โหมดตอบโจทย์เลข ---------- */

function mgNewQuestion() {
  clearTimeout(mgNextTimeout);
  const ch = generateMathChallenge(MG_MATH_NUM_COUNT);
  mgAnswer = ch.answer;
  mgInput = "";
  mgLocked = false;
  document.getElementById("mgEquation").textContent = `${ch.equationText} = ?`;
  document.getElementById("mgAnswerBox").innerHTML = "&nbsp;";
  mgSetFeedback("", "");
  mgStartTimer();
}

function mgSetFeedback(text, kind) {
  const el = document.getElementById("mgFeedback");
  el.textContent = text;
  el.className = "mg-feedback" + (kind ? " " + kind : "");
}

function mgStartTimer() {
  mgStopTimer();
  mgTimeLeft = MATH_CHALLENGE_TIME_LIMIT;
  mgUpdateTimerUI(true);
  mgTimerInterval = setInterval(() => {
    mgTimeLeft -= 1;
    mgUpdateTimerUI(false);
    if (mgTimeLeft <= 0) {
      mgStopTimer();
      mgHandleTimeout();
    }
  }, 1000);
}

function mgStopTimer() {
  if (mgTimerInterval) { clearInterval(mgTimerInterval); mgTimerInterval = null; }
}

function mgUpdateTimerUI(isReset) {
  const fill = document.getElementById("mgTimerFill");
  const text = document.getElementById("mgTimerText");
  const shown = Math.max(0, mgTimeLeft);
  const pct = Math.max(0, (shown / MATH_CHALLENGE_TIME_LIMIT) * 100);
  if (fill) {
    if (isReset) {
      fill.style.transition = "none";
      fill.style.width = "100%";
      void fill.offsetWidth;
      fill.style.transition = "width 1s linear";
    } else {
      fill.style.width = pct + "%";
    }
    fill.style.background = shown <= 3
      ? "linear-gradient(90deg, #e74f66, #c0392b)"
      : "linear-gradient(90deg, #2ecc71, #e74f66)";
  }
  if (text) text.textContent = `เหลือเวลา ${shown} วินาที`;
}

function mgHandleTimeout() {
  if (mgLocked) return;
  mgLocked = true;
  mgSetFeedback(`⏰ หมดเวลา! เฉลย: ${mgAnswer}`, "bad");
  mgNextTimeout = setTimeout(mgNewQuestion, 1300);
}

function mgPress(digit) {
  if (mgLocked || mgInput.length >= 4) return;
  mgInput += digit;
  document.getElementById("mgAnswerBox").textContent = mgInput;
}

function mgBackspace() {
  if (mgLocked) return;
  mgInput = mgInput.slice(0, -1);
  document.getElementById("mgAnswerBox").innerHTML = mgInput || "&nbsp;";
}

function mgSubmit() {
  if (mgLocked || mgInput === "") return;
  mgLocked = true;
  mgStopTimer();

  const userAnswer = parseInt(mgInput, 10);

  if (userAnswer === mgAnswer) {
    const levelBefore = wallet.level;
    wallet.coins += MG_REWARD_COIN;
    wallet.exp += MG_REWARD_EXP;
    mgCorrectCount++;

    updateWalletUI();          // อัปเดตเหรียญ/EXP/เลเวลในหน้าหลักด้วย
    mgRefreshCoins();
    mgUpdateSessionStats();
    mgSetFeedback(`✅ ถูกต้อง! +${MG_REWARD_COIN} 💰  +${MG_REWARD_EXP} ⭐`, "good");
    if (wallet.level > levelBefore) popMessage(`🎉 เลเวลอัป! ตอนนี้ Lv.${wallet.level}`);

    saveWalletAndData().catch(() => {});   // เซฟแบบต่อคิว ไม่ซ้อนกัน
    mgNextTimeout = setTimeout(mgNewQuestion, 700);
  } else {
    mgSetFeedback(`❌ ผิด! เฉลย: ${mgAnswer}`, "bad");
    mgNextTimeout = setTimeout(mgNewQuestion, 1400);
  }
}

function mgKeyHandler(e) {
  const screen = document.getElementById("minigameScreen");
  if (!screen || screen.style.display !== "flex" || mgActiveTab !== 'math') return;
  if (e.key >= '0' && e.key <= '9') mgPress(e.key);
  else if (e.key === 'Backspace') mgBackspace();
  else if (e.key === 'Enter') mgSubmit();
}

/* ---------- 🎰 วงล้อสุ่มไอเทม ---------- */

function getRoulettePool() {
  if (rlPoolCache) return rlPoolCache;
  const pool = [];
  SHOP_ITEMS.filter(i => i.type === 'food').forEach(f => {
    pool.push({
      kind: 'food', id: f.id, name: f.name, img: f.img, days: f.days,
      weight: f.noShop ? ROULETTE_WEIGHT_THAI_FOOD : ROULETTE_WEIGHT_SHOP_FOOD,
      rarity: f.noShop ? 'rare' : 'common'
    });
  });
  pool.push({ kind: 'vaccine', id: 'vaccine', name: 'วัคซีนรักษาโรค', img: 'Shop/vaccine.png', weight: ROULETTE_WEIGHT_VACCINE, rarity: 'uncommon' });
  pool.push({ kind: 'elepant', id: 'elepant', name: 'ช้าง', img: 'Shop/Elepant_shop.png', weight: ROULETTE_WEIGHT_ELEPANT, rarity: 'legend' });
  rlPoolCache = pool;
  return pool;
}

function rlWeightedPick(pool) {
  const total = pool.reduce((s, p) => s + p.weight, 0);
  let r = Math.random() * total;
  for (const p of pool) {
    r -= p.weight;
    if (r < 0) return p;
  }
  return pool[pool.length - 1];
}

function rlCardHTML(p) {
  return `<div class="rl-card r-${p.rarity}"><img src="${p.img}" alt=""><span>${p.name}</span></div>`;
}

function renderRoulettePrizeList() {
  const pool = getRoulettePool();
  const listEl = document.getElementById("rlPrizeList");
  if (listEl) {
    const order = { legend: 0, uncommon: 1, rare: 2, common: 3 };
    listEl.innerHTML = [...pool]
      .sort((a, b) => order[a.rarity] - order[b.rarity])
      .map(p => `<div class="rl-mini r-${p.rarity}" title="${p.name}"><img src="${p.img}" alt="${p.name}"></div>`)
      .join("");
  }
}

// แถบเริ่มต้น (ก่อนหมุนครั้งแรก) ให้มีไอเทมโชว์เต็มหน้าต่าง
function rlPrepareIdleTrack() {
  const track = document.getElementById("rlTrack");
  if (!track || rlSpinning) return;
  const pool = getRoulettePool();
  let html = "";
  for (let i = 0; i < 14; i++) html += rlCardHTML(rlWeightedPick(pool));
  track.innerHTML = html;
  track.style.transition = "none";
  track.style.transform = "translateX(8px)";
}

function rlUpdateSpinBtn() {
  const btn = document.getElementById("rlSpinBtn");
  if (!btn) return;
  const cantAfford = wallet.coins < ROULETTE_COST;
  btn.disabled = rlSpinning || cantAfford;
  btn.textContent = rlSpinning
    ? "🎰 กำลังหมุน..."
    : (cantAfford ? `เหรียญไม่พอ (ต้องใช้ ${ROULETTE_COST} 💰)` : `🎰 หมุนเลย! (${ROULETTE_COST} 💰)`);
}

// ให้รางวัลจริงทันทีที่กดหมุน (กันปิดเกม/รีเฟรชระหว่างหมุนแล้วรางวัลหาย) แล้วค่อยเล่นแอนิเมชันเปิดผล
function rlApplyPrize(prize) {
  const info = { converted: false, coinsGained: 0, countAfter: 0 };

  if (prize.kind === 'elepant') {
    if (currentStudent.pets.length >= getMaxAllowedPets()) {
      wallet.coins += ROULETTE_FULL_COINS;
      info.converted = true;
      info.coinsGained = ROULETTE_FULL_COINS;
    } else {
      currentStudent.pets.push({
        type: 'elepant',
        born: todayStr(),
        sick: false,
        dead: false,
        power: 10,
        battle: false,
        breed: false
      });
      renderPetsDOM();
      refreshHungerState();
      updateShopQuotaDisplay();
    }
  } else {
    // อาหาร / วัคซีน → เข้ากระเป๋า
    inventory[prize.id] = (parseInt(inventory[prize.id]) || 0) + 1;
    currentStudent.items = { ...inventory };
    info.countAfter = inventory[prize.id];
    if (prize.kind === 'food') renderFoodGrid();
  }
  return info;
}

async function spinRoulette() {
  if (rlSpinning) return;
  if (wallet.coins < ROULETTE_COST) {
    popMessage(`เหรียญไม่พอ! ต้องใช้ ${ROULETTE_COST} เหรียญ`);
    return;
  }

  rlSpinning = true;
  wallet.coins -= ROULETTE_COST;

  const pool = getRoulettePool();
  const prize = rlWeightedPick(pool);
  const info = rlApplyPrize(prize);

  updateWalletUI();
  mgRefreshCoins();
  saveWalletAndData().catch(() => {});

  // ---- เตรียมแถบ: ใส่ไอเทมที่สุ่มได้ไว้ที่ตำแหน่ง winIdx ----
  const track = document.getElementById("rlTrack");
  const win = document.getElementById("rlWindow");
  const winIdx = 48 + Math.floor(Math.random() * 8);
  const cards = [];
  for (let i = 0; i < RL_COUNT; i++) cards.push(i === winIdx ? prize : rlWeightedPick(pool));
  track.innerHTML = cards.map(rlCardHTML).join("");
  win.classList.remove("rl-flash");

  const center = win.clientWidth / 2;
  track.style.transition = "none";
  track.style.transform = `translateX(${center - (RL_START_IDX * RL_STEP + RL_CARD_W / 2)}px)`;
  void track.offsetWidth;

  const jitter = (Math.random() * 2 - 1) * (RL_CARD_W * 0.32);   // หยุดไม่ตรงกลางการ์ดเป๊ะ ๆ ให้ดูสมจริง
  const endX = center - (winIdx * RL_STEP + RL_CARD_W / 2) + jitter;

  // เริ่มเร็วแล้วค่อยๆ ช้าลงจนหยุด
  track.style.transition = `transform ${RL_SPIN_MS}ms cubic-bezier(0.1, 0.72, 0.1, 1)`;
  track.style.transform = `translateX(${endX}px)`;

  await rlWatchSpin(track, win, winIdx);

  rlBurst(prize.rarity === 'legend' ? 40 : 22);
  if (prize.rarity === 'legend' || prize.rarity === 'uncommon') win.classList.add("rl-flash");

  await new Promise(r => setTimeout(r, 900));
  rlShowResult(prize, info);
  rlSpinning = false;
  rlUpdateSpinBtn();
}

// ติดตามการ์ดที่อยู่ใต้เส้นกลางทุกเฟรม → ไฮไลต์ + เส้นกลางสั่นทุกครั้งที่ผ่านการ์ดใบใหม่
function rlWatchSpin(track, win, winIdx) {
  return new Promise(resolve => {
    const marker = document.getElementById("rlMarker");
    const center = win.clientWidth / 2;
    const start = performance.now();
    let lastIdx = -1;

    function frame(now) {
      const tx = new DOMMatrix(getComputedStyle(track).transform).m41;
      const idx = Math.round((center - tx - RL_CARD_W / 2) / RL_STEP);
      if (idx !== lastIdx) {
        if (track.children[lastIdx]) track.children[lastIdx].classList.remove("rl-hot");
        if (track.children[idx]) track.children[idx].classList.add("rl-hot");
        if (marker) { marker.classList.remove("tick"); void marker.offsetWidth; marker.classList.add("tick"); }
        lastIdx = idx;
      }
      if (now - start < RL_SPIN_MS + 250) {
        rlRafId = requestAnimationFrame(frame);
      } else {
        for (const c of track.children) c.classList.remove("rl-hot");
        if (track.children[winIdx]) track.children[winIdx].classList.add("rl-winner");
        resolve();
      }
    }
    rlRafId = requestAnimationFrame(frame);
  });
}

function rlBurst(count) {
  const stage = document.getElementById("rlStage");
  if (!stage) return;
  const emojis = ["✨", "🎉", "⭐", "💛"];
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.className = "rl-confetti";
    s.textContent = emojis[i % emojis.length];
    const ang = Math.random() * Math.PI * 2;
    const dist = 60 + Math.random() * 110;
    s.style.setProperty("--dx", Math.cos(ang) * dist + "px");
    s.style.setProperty("--dy", Math.sin(ang) * dist * 0.7 + "px");
    stage.appendChild(s);
    setTimeout(() => s.remove(), 1200);
  }
}

function rlShowResult(prize, info) {
  const img = document.getElementById("mgResultImg");
  const title = document.getElementById("mgResultTitle");
  const desc = document.getElementById("mgResultDesc");
  const card = document.getElementById("mgResultCard");

  img.src = prize.img;
  card.className = "mg-result-card r-" + prize.rarity;

  if (prize.kind === 'elepant') {
    if (info.converted) {
      title.textContent = "🐘 ได้ช้าง! แต่สัตว์เต็มคอก";
      desc.innerHTML = `สัตว์เต็มคุณได้เงินแทน <b>${ROULETTE_FULL_COINS.toLocaleString()} เหรียญ</b> 💰`;
      popMessage(`สัตว์เต็มคุณได้เงินแทน ${ROULETTE_FULL_COINS.toLocaleString()} เหรียญ 💰`);
    } else {
      title.textContent = "🎉 ยินดีด้วย! ได้ช้าง";
      desc.textContent = "ช้างน้อยเข้ามาอยู่ในบ้านของคุณแล้ว 🐘";
    }
  } else if (prize.kind === 'vaccine') {
    title.textContent = "💉 ได้วัคซีนรักษาโรค";
    desc.innerHTML = `เก็บเข้ากระเป๋าแล้ว (มี <b>${info.countAfter}</b> อัน)`;
  } else {
    title.textContent = `🍲 ได้ ${prize.name}`;
    desc.innerHTML = `อิ่ม ${prize.days} วัน | เก็บเข้ากระเป๋าแล้ว (มี <b>${info.countAfter}</b> ชิ้น)`;
  }

  document.getElementById("mgResultOverlay").style.display = "flex";
}

function closeMgResult() {
  document.getElementById("mgResultOverlay").style.display = "none";
  const track = document.getElementById("rlTrack");
  if (track) for (const c of track.children) c.classList.remove("rl-winner");
  document.getElementById("rlWindow").classList.remove("rl-flash");
}