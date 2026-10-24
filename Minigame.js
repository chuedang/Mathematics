/* 🎮 Minigame.js — มินิเกมทั้งหมดอยู่ไฟล์นี้ (ต้องโหลดหลัง script.js และใช้ Minigame.css)
   1) หน้ารวมมินิเกม (ปุ่ม Icon/Minigame.png ในเมนูกระเป๋า → menuGo('minigame') → openMgHub)
   2) 🧮 คิดเลข  3) 🎰 สุ่มของ  4) 📐 แก้สมการ  5) 🧩 แยกตัวประกอบ
   6) 🌱 แปลงผัก (2.5D)      7) 🚀 ลงจอดยานอวกาศ      8) 🔺 ภาคตัดกรวย
   ใช้ตัวแปร/ฟังก์ชันส่วนกลางของ script.js: wallet, inventory, popMessage, updateWalletUI, saveWalletAndData ฯลฯ */

/* ---------- วาง HTML ของหน้าจอเกมทั้งหมดลงใน #dashboard ---------- */
(function(){
  const host = document.getElementById('dashboard') || document.body;
  host.insertAdjacentHTML('beforeend', `
    <!-- 🎮 หน้ารวมมินิเกม -->
    <div class="mghub-screen" id="mgHubScreen">
      <div class="mg-top-bar">
        <button class="back-btn" onclick="closeMgHub()" aria-label="ย้อนกลับ">
          <img src="Icon/back.png" alt="ย้อนกลับ">
        </button>
        <div class="mg-title">🎮 มินิเกม</div>
        <div class="mg-coin-chip">💰 <span id="mgHubCoins" class="num">0</span></div>
      </div>
      <div class="mghub-grid">
        <button class="mghub-card" onclick="mgHubGo('math')"><img src="Icon/cal.png" alt=""><b>บวก ลบ คูณ หาร</b><small>ตอบถูกข้อละ +1 💰</small></button>
        <button class="mghub-card" onclick="mgHubGo('factor')"><img src="Icon/factor.png" alt=""><b>แยกตัวประกอบ</b><small>ลากกล่องไปวางให้ครบ</small></button>
        <button class="mghub-card" onclick="mgHubGo('equation')"><img src="Icon/equation.png" alt=""><b>แก้สมการ</b><small>หาค่า x และ y</small></button>
        <button class="mghub-card" onclick="mgHubGo('plant')"><img src="Icon/Plant.png" alt=""><b>แปลงผัก</b><small>ซ่อมเครื่องจักรด้วยคณิตศาสตร์</small></button>
        <button class="mghub-card" onclick="mgHubGo('roulette')"><img src="Icon/random.png" alt=""><b>สุ่มของ</b><small>หมุนวงล้อ 200 💰</small></button>
        <button class="mghub-card" onclick="mgHubGo('landing')"><span class="mghub-emoji">🚀</span><b>ลงจอดยานอวกาศ</b><small>ใช้สูตรระยะห่างสองจุด</small></button>
        <button class="mghub-card" onclick="mgHubGo('conic')"><span class="mghub-new">ใหม่!</span><span class="mghub-emoji">🔺</span><b>ภาคตัดกรวย</b><small>ตัดกรวยเป็นวงกลม วงรี พาราโบลา ไฮเพอร์โบลา</small></button>
      </div>
    </div>


    <!-- 🎮 Minigame -->
    <div class="minigame-screen" id="minigameScreen">
      <div class="mg-top-bar">
        <button class="back-btn" onclick="mgBack()" aria-label="ย้อนกลับ">
          <img src="Icon/back.png" alt="ย้อนกลับ">
        </button>
        <div class="mg-title" id="mgTitle">🎮 มินิเกม</div>
        <div class="mg-coin-chip">💰 <span id="mgCoins" class="num">0</span></div>
      </div>

      <!-- โหมดตอบโจทย์เลข -->
      <div class="mg-pane" id="mgMathPane">
        <div class="mg-card">
          <div class="mg-reward-line">ตอบถูกข้อละ <b>+1 💰 เหรียญ</b> และ <b>+1 ⭐ EXP</b></div>
          <div class="mg-timer-track"><div class="mg-timer-fill" id="mgTimerFill"></div></div>
          <div class="mg-timer-text" id="mgTimerText">เหลือเวลา 10 วินาที</div>
          <div class="mg-equation" id="mgEquation">-</div>
          <div class="mg-answer-row">
            <span>คำตอบ</span>
            <div class="mg-answer-box" id="mgAnswerBox">&nbsp;</div>
          </div>
          <div class="mg-feedback" id="mgFeedback"></div>
          <div class="mg-keypad">
            <button class="mg-key" onclick="mgPress('7')">7</button>
            <button class="mg-key" onclick="mgPress('8')">8</button>
            <button class="mg-key" onclick="mgPress('9')">9</button>
            <button class="mg-key" onclick="mgPress('4')">4</button>
            <button class="mg-key" onclick="mgPress('5')">5</button>
            <button class="mg-key" onclick="mgPress('6')">6</button>
            <button class="mg-key" onclick="mgPress('1')">1</button>
            <button class="mg-key" onclick="mgPress('2')">2</button>
            <button class="mg-key" onclick="mgPress('3')">3</button>
            <button class="mg-key back" onclick="mgBackspace()">⌫</button>
            <button class="mg-key" onclick="mgPress('0')">0</button>
            <button class="mg-key ok" onclick="mgSubmit()">✓</button>
          </div>
        </div>
        <div class="mg-session" id="mgSessionStats"></div>
      </div>

      <!-- โหมดแยกตัวประกอบ -->
      <div class="mg-pane" id="mgFactorPane">
        <div class="mg-card">
          <div class="mg-reward-line">ลากกล่องไปวางให้ครบ 6 ช่อง แล้วกด <b>ตอบ</b> · ถูกข้อละ <b>+3 💰</b> และ <b>+3 ⭐ EXP</b></div>
          <div id="fcPlay">
            <div class="mg-timer-track"><div class="mg-timer-fill" id="fcTimerFill"></div></div>
            <div class="mg-timer-text" id="fcTimerText">เหลือเวลา 3:00</div>
            <div class="mg-equation fc-equation" id="fcEquation">-</div>
            <div class="fc-slots" id="fcSlots"></div>
            <div class="mg-feedback" id="fcFeedback"></div>
            <div class="fc-palette">
              <div class="fc-ops" id="fcOps"></div>
              <div class="fc-nums" id="fcNums"></div>
            </div>
            <div class="fc-actions">
              <button class="fc-clear-btn" onclick="fcClear()">🗑 ล้าง</button>
              <button class="fc-submit-btn" id="fcSubmitBtn" onclick="fcSubmit()" disabled>✓ ตอบ</button>
            </div>
            <div class="mg-session" id="fcScore"></div>
          </div>
        </div>
      </div>

      <!-- โหมดแก้สมการ (จับเวลา 3 นาที/ข้อ) -->
      <div class="mg-pane" id="mgEquationPane">
        <div class="mg-card">
          <div class="mg-reward-line">ถูกข้อละ <b>+5 💰</b> <b>+5 ⭐</b> · แบบ 2 ตัวแปร <b>+6 💰</b> <b>+6 ⭐</b> · ข้อละ 10 นาที</div>
          <div class="mg-timer-track"><div class="mg-timer-fill" id="eqTimerFill"></div></div>
          <div class="mg-timer-text" id="eqTimerText">เหลือเวลา 3:00</div>
          <div class="mg-equation" id="eqEquation">-</div>
          <div class="mg-answer-row">
            <span class="eq-var">x =</span>
            <div class="mg-answer-box" id="eqAnswerBox" onclick="eqSelect('x')">&nbsp;</div>
          </div>
          <div class="mg-answer-row" id="eqRowY" style="display:none;">
            <span class="eq-var">y =</span>
            <div class="mg-answer-box" id="eqAnswerBoxY" onclick="eqSelect('y')">&nbsp;</div>
          </div>
          <div class="mg-feedback" id="eqFeedback"></div>
          <div class="mg-keypad">
            <button class="mg-key" onclick="eqPress('7')">7</button>
            <button class="mg-key" onclick="eqPress('8')">8</button>
            <button class="mg-key" onclick="eqPress('9')">9</button>
            <button class="mg-key" onclick="eqPress('4')">4</button>
            <button class="mg-key" onclick="eqPress('5')">5</button>
            <button class="mg-key" onclick="eqPress('6')">6</button>
            <button class="mg-key" onclick="eqPress('1')">1</button>
            <button class="mg-key" onclick="eqPress('2')">2</button>
            <button class="mg-key" onclick="eqPress('3')">3</button>
            <button class="mg-key back" onclick="eqBackspace()">⌫</button>
            <button class="mg-key" onclick="eqPress('0')">0</button>
            <button class="mg-key" onclick="eqToggleSign()">+/−</button>
          </div>
          <button class="fc-submit-btn" style="width:100%; margin-top:10px;" onclick="eqSubmit()">✓ ตอบ</button>
        </div>
        <div class="mg-session" id="eqSessionStats"></div>
      </div>

      <!-- โหมดวงล้อสุ่มไอเทม -->
      <div class="mg-pane" id="mgRoulettePane">
        <div class="rl-hint">หมุนวงล้อครั้งละ <b>200 💰</b> ลุ้นอาหาร วัคซีน และ <b>มังกรไฟ</b>!</div>
        <div class="rl-stage" id="rlStage">
          <div class="rl-window" id="rlWindow">
            <div class="rl-track" id="rlTrack"></div>
            <div class="rl-fade left"></div>
            <div class="rl-fade right"></div>
            <div class="rl-marker" id="rlMarker"></div>
          </div>
        </div>
        <button class="rl-spin-btn" id="rlSpinBtn" onclick="spinRoulette()">🎰 หมุนเลย! (200 💰)</button>
        <div class="rl-prize-title" style="margin-top:14px;">ของรางวัลที่ลุ้นได้</div>
        <div class="rl-prize-list" id="rlPrizeList"></div>
      </div>

      <!-- ผลรางวัล -->
      <div class="mg-result-overlay" id="mgResultOverlay">
        <div class="mg-result-card" id="mgResultCard">
          <img id="mgResultImg" src="" alt="รางวัล">
          <h3 id="mgResultTitle"></h3>
          <p id="mgResultDesc"></p>
          <button class="claim-btn" onclick="closeMgResult()">เยี่ยมเลย!</button>
        </div>
      </div>
    </div>

`);
})();

/* =====================================================================
   🏠 หน้ารวมมินิเกม + สะพานเชื่อมกับเกมหลัก
===================================================================== */
  // 🎮 หน้ารวมมินิเกม: เลือกเกม → เล่น → ย้อนกลับแล้วกลับมาหน้ารวมนี้
  let mgFromHub = false;
  function openMgHub(){
    mgFromHub = false;
    const c = document.getElementById('mgHubCoins'); if (c) c.textContent = wallet.coins;
    document.getElementById('mgHubScreen').style.display = 'flex';
  }
  function closeMgHub(){ mgFromHub = false; document.getElementById('mgHubScreen').style.display = 'none'; updateWalletUI(); }
  function mgHubGo(game){
    document.getElementById('mgHubScreen').style.display = 'none';
    mgFromHub = true;
    if (game === 'plant'){ if (window.openPlantScreen) window.openPlantScreen(); else { popMessage('แปลงผักยังโหลดไม่เสร็จ ลองใหม่อีกครั้งนะ 🌱'); openMgHub(); } }
    else if (game === 'landing'){ if (window.openLandingScreen) window.openLandingScreen(); else { popMessage('เกมลงจอดยังโหลดไม่เสร็จ ลองใหม่อีกครั้งนะ 🚀'); openMgHub(); } }
    else if (game === 'conic'){ if (window.openConicScreen) window.openConicScreen(); else { popMessage('เกมภาคตัดกรวยยังโหลดไม่เสร็จ ลองใหม่อีกครั้งนะ 🔺'); openMgHub(); } }
    else openMinigame(game);
  }
  // เกมปิดแล้ว → ถ้าเข้ามาจากหน้ารวม ให้กลับไปหน้ารวม
  function mgHubReturn(){ if (mgFromHub) openMgHub(); }
  window.openMgHub = openMgHub; window.closeMgHub = closeMgHub; window.mgHubGo = mgHubGo; window.mgHubReturn = mgHubReturn;

  // 🌱 สะพานเชื่อมให้ plant.js ใช้เหรียญ/EXP/ข้อความของเกมหลัก
  window.PlantHost = {
    id:    () => (currentStudent && currentStudent["รหัสนักเรียน"]) || 'guest',
    today: () => todayStr(),
    coins: () => wallet.coins,
    reward(coin, xp){
      const levelBefore = wallet.level;
      wallet.coins += coin; wallet.exp += xp;
      updateWalletUI();
      if (wallet.level > levelBefore) popMessage(`🎉 เลเวลอัป! ตอนนี้ Lv.${wallet.level}`);
      saveWalletAndData().catch(() => {});
    },
    // LastFed.Q1..Q6 = วันที่ซ่อมจุดนั้นสำเร็จล่าสุด (i เริ่มที่ 0)
    getQ: i => (currentStudent && currentStudent.lastFed && currentStudent.lastFed['Q' + (i+1)]) || '',
    setQ(i, dateStr){
      if (!currentStudent) return;
      if (!currentStudent.lastFed) currentStudent.lastFed = { food:"", water:"", validUntil:"" };
      currentStudent.lastFed['Q' + (i+1)] = dateStr;
    },
    pop: text => popMessage(text),
    closed: () => { updateWalletUI(); mgHubReturn(); }
  };

  // 🚀 สะพานเชื่อมให้ landing.js ใช้เหรียญ/EXP/ข้อความของเกมหลัก
  window.LandingHost = {
    coins: () => wallet.coins,
    reward(coin, xp){
      const levelBefore = wallet.level;
      wallet.coins += coin; wallet.exp += xp;
      updateWalletUI();
      if (wallet.level > levelBefore) popMessage(`🎉 เลเวลอัป! ตอนนี้ Lv.${wallet.level}`);
      saveWalletAndData().catch(() => {});
    },
    pop: text => popMessage(text),
    closed: () => { updateWalletUI(); mgHubReturn(); }
  };

/* =====================================================================
   🎮 MINIGAME  (ไอคอน Icon/Minigame.png) → เกม 4 ช่องอยู่ในเมนูกระเป๋าเลย กดแล้วเข้าเกมตรงๆ
   1) 🧮 คิดเลข (Icon/cal.png)  บวก ลบ คูณ หาร (ใช้ generateMathChallenge ตัวเดียวกับตอนต่อสู้)
        ตอบถูกข้อละ +1 เหรียญ +1 EXP
   2) 🎰 สุ่มของ (Icon/random.png)  วงล้อสุ่มไอเทม ราคา 200 เหรียญ / ครั้ง
        รางวัล: อาหาร, วัคซีน, มังกรไฟ (ถ้าสัตว์เต็มคอก → แปลงเป็นเงิน 1,000 เหรียญแทน)
   3) 📐 แก้สมการ (Icon/equation.png)  แบบ 1) ax + b = c  2) a + bx = c  3) ระบบสมการ 2 ตัวแปร  จับเวลา 3 นาที/ข้อ
        แบบ 1,2 ตอบถูก +5 เหรียญ +5 EXP / แบบ 3 ตอบถูก +6 เหรียญ +6 EXP  (โอกาสออก 1:1:3)
   4) 🧩 แยกตัวประกอบ (Icon/factor.png)  x² ± ax ± b ลากกล่องใส่ช่อง ( )( ) จับเวลา 3 นาที/ข้อ (ตอบถูก=นับใหม่, หมดเวลา=เปลี่ยนโจทย์)
        ตอบถูกข้อละ +3 เหรียญ +3 EXP
===================================================================== */

const MG_REWARD_COIN = 1;          // เหรียญต่อ 1 ข้อที่ตอบถูก
const MG_REWARD_EXP  = 1;          // EXP ต่อ 1 ข้อที่ตอบถูก
const MG_MATH_NUM_COUNT = 3;       // จำนวนตัวเลขในโจทย์ (3 ตัว เท่ากับสกิล 2 ตอนต่อสู้)
const ROULETTE_COST = 200;         // ราคาต่อการหมุน 1 ครั้ง
const ROULETTE_FULL_COINS = 1000;  // เงินที่ได้แทนมังกรไฟ เมื่อสัตว์เต็มคอก

// น้ำหนักโอกาสสุ่ม (รวม = 100 → เท่ากับ % พอดี)
const ROULETTE_WEIGHT_FIREDRAGON = 2;   // มังกรไฟ 2%
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

const MG_TITLES = { math: '🧮 คิดเลข', roulette: '🎰 สุ่มของ', equation: '📐 แก้สมการ', factor: '🧩 แยกตัวประกอบ' };
const MG_PANES  = { math: 'mgMathPane', roulette: 'mgRoulettePane', equation: 'mgEquationPane', factor: 'mgFactorPane' };

function openMinigame(game) {
  mgCorrectCount = 0;
  eqCorrectCount = 0;
  eqTotalCoin = 0;
  eqTotalExp = 0;
  document.getElementById("minigameScreen").style.display = "flex";
  mgRefreshCoins();
  mgUpdateSessionStats();
  renderRoulettePrizeList();
  rlPrepareIdleTrack();
  switchMinigameTab(game || 'math');
  document.addEventListener("keydown", mgKeyHandler);
}

function closeMinigame() {
  if (rlSpinning) { popMessage("รอวงล้อหยุดก่อนนะ! 🎰"); return; }
  mgStopTimer();
  clearTimeout(mgNextTimeout);
  eqStop();
  fcStop();
  document.getElementById("minigameScreen").style.display = "none";
  document.getElementById("mgResultOverlay").style.display = "none";
  document.removeEventListener("keydown", mgKeyHandler);
  updateWalletUI();
  if (window.mgHubReturn) window.mgHubReturn();
}

// ปุ่มย้อนกลับ: ออกจากเกมกลับหน้าหลักเลย (เลือกเกมจากเมนูในกระเป๋าแล้ว)
function mgBack() {
  closeMinigame();
}

function switchMinigameTab(tab) {
  if (rlSpinning) { popMessage("รอวงล้อหยุดก่อนนะ! 🎰"); return; }
  mgStopTimer();
  clearTimeout(mgNextTimeout);
  eqStop();
  fcStop();
  mgActiveTab = tab;
  Object.keys(MG_PANES).forEach(k => {
    document.getElementById(MG_PANES[k]).classList.toggle('active', k === tab);
  });
  document.getElementById("mgTitle").textContent = MG_TITLES[tab] || '🎮 มินิเกม';

  if (tab === 'math') mgNewQuestion();
  else if (tab === 'roulette') rlUpdateSpinBtn();
  else if (tab === 'equation') { eqUpdateSessionStats(); eqNewQuestion(); }
  else if (tab === 'factor') fcStart();
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
  if (!screen || screen.style.display !== "flex") return;
  if (mgActiveTab === 'math') {
    if (e.key >= '0' && e.key <= '9') mgPress(e.key);
    else if (e.key === 'Backspace') mgBackspace();
    else if (e.key === 'Enter') mgSubmit();
  } else if (mgActiveTab === 'equation') {
    if (e.key >= '0' && e.key <= '9') eqPress(e.key);
    else if (e.key === '-' || e.key === '+') eqToggleSign();
    else if (e.key === 'Backspace') eqBackspace();
    else if (e.key === 'Tab' && eqForm === 3) { e.preventDefault(); eqSelect(eqActive === 'x' ? 'y' : 'x'); }
    else if (e.key === 'Enter') eqSubmit();
  }
}

/* ---------- 📐 โหมดแก้สมการ (จับเวลา 3 นาที/ข้อ) ---------- */
/*  โอกาสออกแบบที่ 1 : 2 : 3 = 1 : 1 : 3  (20% / 20% / 60%)
    แบบที่ 1)  ax + b = c      สุ่ม x ∈ [-10, 10], a ∈ [-5, 5] (ไม่เอา 0), b ∈ [-20, 20]
    แบบที่ 2)  a + bx = c      สุ่ม x ∈ [-10, 10], b ∈ [-5, 5] (ไม่เอา 0), a ∈ [-20, 20] (ไม่เอา 0)
    แบบที่ 3)  ax + by = c  /  ix + jy = k
               สุ่ม x, y ∈ [-9, 9]  → สุ่ม a, i ∈ [1, 5]  → สุ่ม b, j ∈ [-9, 9]
               → คำนวณ c = ax + by,  k = ix + jy   (สุ่มใหม่ถ้า a·j − b·i = 0 เพราะจะหาคำตอบเดียวไม่ได้)
    รางวัล: แบบ 1, 2 → +5 เหรียญ +5 EXP    แบบ 3 → +6 เหรียญ +6 EXP
    เวลา: 3 นาทีต่อข้อ (ตอบถูก/ตอบผิด = ขึ้นข้อใหม่แล้วนับใหม่, หมดเวลา = เฉลยแล้วเปลี่ยนโจทย์) */

const EQ_TIME_LIMIT   = 600;   // วินาที ต่อ 1 โจทย์
const EQ_REWARD_COIN  = 5;     // แบบที่ 1, 2
const EQ_REWARD_EXP   = 5;
const EQ3_REWARD_COIN = 6;     // แบบที่ 3 (2 ตัวแปร)
const EQ3_REWARD_EXP  = 6;
const EQ_FORM_WEIGHTS = [1, 1, 3];   // แบบที่ 1 : 2 : 3

let eqForm = 1;
let eqX = 0, eqY = 0;
let eqVals = { x: "", y: "" };
let eqActive = 'x';
let eqLocked = false;
let eqRunning = false;
let eqNextTimeout = null;
let eqTimerInterval = null;
let eqTimeLeft = EQ_TIME_LIMIT;
let eqCorrectCount = 0;
let eqTotalCoin = 0;
let eqTotalExp = 0;

function eqRand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function eqPickForm() {
  const total = EQ_FORM_WEIGHTS.reduce((p, w) => p + w, 0);
  let r = Math.random() * total;
  for (let i = 0; i < EQ_FORM_WEIGHTS.length; i++) {
    if (r < EQ_FORM_WEIGHTS[i]) return i + 1;
    r -= EQ_FORM_WEIGHTS[i];
  }
  return 3;
}

// ข้อความพจน์ตัวแปร เช่น 1 → "x", -1 → "-x", 3 → "3x"
function eqTerm(coef, v) {
  return coef === 1 ? v : (coef === -1 ? '-' + v : coef + v);
}
// พจน์ตัวแปรตัวที่สอง (ต่อท้าย) เช่น " + 3y", " - y"  (ค่า 0 ไม่แสดง)
function eqTail(coef, v) {
  if (coef === 0) return '';
  const abs = Math.abs(coef) === 1 ? '' : Math.abs(coef);
  return (coef < 0 ? ' - ' : ' + ') + abs + v;
}
// สมการ 2 ตัวแปร  p x + q y = r
function eqLine(p, q, r) { return `${eqTerm(p, 'x')}${eqTail(q, 'y')} = ${r}`; }

function eqGenerate() {
  const form = eqPickForm();

  if (form === 1) {
    const x = eqRand(-10, 10);
    let a;
    do { a = eqRand(-5, 5); } while (a === 0);       // สัมประสิทธิ์หน้า x
    const b = eqRand(-20, 20);
    const c = a * x + b;
    const bText = b < 0 ? ` - ${Math.abs(b)}` : (b > 0 ? ` + ${b}` : '');
    return { form, x, y: 0, text: `${eqTerm(a, 'x')}${bText} = ${c}` };
  }

  if (form === 2) {
    const x = eqRand(-10, 10);
    let a, b;
    do { a = eqRand(-20, 20); } while (a === 0);     // ค่าคงที่นำหน้า
    do { b = eqRand(-5, 5); } while (b === 0);       // สัมประสิทธิ์หน้า x
    const c = a + b * x;
    return { form, x, y: 0, text: `${a}${eqTail(b, 'x')} = ${c}` };
  }

  // แบบที่ 3: ax + by = c , ix + jy = k
  const x = eqRand(-9, 9), y = eqRand(-9, 9);
  let a, b, i, j;
  do {
    a = eqRand(1, 5);  i = eqRand(1, 5);
    b = eqRand(-9, 9); j = eqRand(-9, 9);
  } while (a * j - b * i === 0);
  const c = a * x + b * y;
  const k = i * x + j * y;
  return { form, x, y, text: `${eqLine(a, b, c)}\n${eqLine(i, j, k)}` };
}

function eqFmt(v) { return String(v).replace('-', '−'); }

function eqSetFeedback(text, kind) {
  const el = document.getElementById("eqFeedback");
  el.textContent = text;
  el.className = "mg-feedback" + (kind ? " " + kind : "");
}

function eqUpdateSessionStats() {
  const el = document.getElementById("eqSessionStats");
  if (el) el.innerHTML = `รอบนี้ตอบถูก <b class="num">${eqCorrectCount}</b> ข้อ → 💰 +${eqTotalCoin} | ⭐ +${eqTotalExp}`;
}

function eqShowInput() {
  ['x', 'y'].forEach(k => {
    const box = document.getElementById(k === 'x' ? "eqAnswerBox" : "eqAnswerBoxY");
    if (!box) return;
    box.innerHTML = eqVals[k] === "" ? "&nbsp;" : eqFmt(eqVals[k]);
    box.classList.toggle("active", eqForm === 3 && eqActive === k);
  });
}

function eqSelect(k) {
  if (eqLocked || eqForm !== 3) return;
  eqActive = k;
  eqShowInput();
}

function eqStartTimer() {
  if (eqTimerInterval) { clearInterval(eqTimerInterval); eqTimerInterval = null; }
  eqTimeLeft = EQ_TIME_LIMIT;
  eqUpdateTimerUI(true);
  eqTimerInterval = setInterval(() => {
    eqTimeLeft -= 1;
    eqUpdateTimerUI(false);
    if (eqTimeLeft <= 0) eqHandleTimeout();
  }, 1000);
}

function eqStopTimer() {
  if (eqTimerInterval) { clearInterval(eqTimerInterval); eqTimerInterval = null; }
}

function eqStop() {
  eqStopTimer();
  clearTimeout(eqNextTimeout);
  eqRunning = false;
}

function eqUpdateTimerUI(isReset) {
  const fill = document.getElementById("eqTimerFill");
  const text = document.getElementById("eqTimerText");
  const shown = Math.max(0, eqTimeLeft);
  const mm = Math.floor(shown / 60), ss = String(shown % 60).padStart(2, '0');
  if (fill) {
    if (isReset) {
      fill.style.transition = "none";
      fill.style.width = "100%";
      void fill.offsetWidth;
      fill.style.transition = "width 1s linear";
    } else {
      fill.style.width = (shown / EQ_TIME_LIMIT * 100) + "%";
    }
    fill.style.background = shown <= 30
      ? "linear-gradient(90deg, #e74f66, #c0392b)"
      : "linear-gradient(90deg, #2ecc71, #e74f66)";
  }
  if (text) text.textContent = `เหลือเวลา ${mm}:${ss}`;
}

function eqAnswerText() {
  return eqForm === 3 ? `x = ${eqFmt(eqX)}, y = ${eqFmt(eqY)}` : `x = ${eqFmt(eqX)}`;
}

// หมดเวลา = เฉลยแล้วเปลี่ยนโจทย์
function eqHandleTimeout() {
  if (!eqRunning || eqLocked) return;
  eqStopTimer();
  eqLocked = true;
  eqSetFeedback(`⏰ หมดเวลา! เฉลย: ${eqAnswerText()}`, "bad");
  eqNextTimeout = setTimeout(eqNewQuestion, 1800);
}

function eqNewQuestion() {
  clearTimeout(eqNextTimeout);
  const q = eqGenerate();
  eqForm = q.form;
  eqX = q.x; eqY = q.y;
  eqVals = { x: "", y: "" };
  eqActive = 'x';
  eqLocked = false;
  eqRunning = true;

  const eqEl = document.getElementById("eqEquation");
  eqEl.textContent = q.text;
  eqEl.classList.toggle("multi", q.form === 3);
  document.getElementById("eqRowY").style.display = q.form === 3 ? "flex" : "none";

  eqShowInput();
  eqSetFeedback("", "");
  eqStartTimer();
}

function eqPress(d) {
  if (eqLocked || !eqRunning) return;
  if (eqVals[eqActive].replace('-', '').length >= 3) return;
  eqVals[eqActive] += d;
  eqShowInput();
}

function eqToggleSign() {
  if (eqLocked || !eqRunning) return;
  const cur = eqVals[eqActive];
  eqVals[eqActive] = cur.startsWith('-') ? cur.slice(1) : '-' + cur;
  eqShowInput();
}

function eqBackspace() {
  if (eqLocked || !eqRunning) return;
  eqVals[eqActive] = eqVals[eqActive].slice(0, -1);
  eqShowInput();
}

function eqValid(str) {
  return str !== "" && str !== "-" && !isNaN(parseInt(str, 10));
}

function eqSubmit() {
  if (eqLocked || !eqRunning) return;
  if (!eqValid(eqVals.x)) { if (eqForm === 3) eqSelect('x'); return; }
  if (eqForm === 3 && !eqValid(eqVals.y)) { eqSelect('y'); return; }
  eqLocked = true;
  eqStopTimer();

  const vx = parseInt(eqVals.x, 10);
  const vy = eqForm === 3 ? parseInt(eqVals.y, 10) : 0;
  const ok = vx === eqX && (eqForm !== 3 || vy === eqY);

  if (ok) {
    const coin = eqForm === 3 ? EQ3_REWARD_COIN : EQ_REWARD_COIN;
    const exp  = eqForm === 3 ? EQ3_REWARD_EXP  : EQ_REWARD_EXP;
    const levelBefore = wallet.level;
    wallet.coins += coin;
    wallet.exp += exp;
    eqCorrectCount++;
    eqTotalCoin += coin;
    eqTotalExp += exp;

    updateWalletUI();
    mgRefreshCoins();
    eqUpdateSessionStats();
    eqSetFeedback(`✅ ถูกต้อง! +${coin} 💰  +${exp} ⭐`, "good");
    if (wallet.level > levelBefore) popMessage(`🎉 เลเวลอัป! ตอนนี้ Lv.${wallet.level}`);

    saveWalletAndData().catch(() => {});
    eqNextTimeout = setTimeout(eqNewQuestion, 900);
  } else {
    eqSetFeedback(`❌ ผิด! เฉลย: ${eqAnswerText()}`, "bad");
    eqNextTimeout = setTimeout(eqNewQuestion, 1800);
  }
}

/* ---------- 🧩 โหมดแยกตัวประกอบ ---------- */
/*  โจทย์ x² ± ax ± b  (สัมประสิทธิ์หน้า x² = 1)
    สุ่ม m, n ∈ [-13, 13] แล้ว a = m + n, b = m × n  → เฉลย (x + m)(x + n)
    ตัด 0 ออก เพราะไม่มีกล่องเลข 0 ให้ลาก และตัดกรณี a = 0 เพื่อให้โจทย์อยู่ในรูป x² ± ax ± b เสมอ */

const FC_TIME_LIMIT  = 180;   // วินาที ต่อ 1 โจทย์ (ตอบถูก/หมดเวลา → เริ่มนับใหม่ที่โจทย์ถัดไป)
const FC_REWARD_COIN = 3;     // เหรียญต่อข้อที่ถูก
const FC_REWARD_EXP  = 3;     // EXP ต่อข้อที่ถูก
const FC_MAX_NUM     = 13;    // กล่องเลข 1 – 13
const FC_SLOT_COUNT  = 6;     // ( x ± n )( x ± n )

let fcRunning = false;
let fcLocked = false;
let fcTimeLeft = FC_TIME_LIMIT;
let fcTimerInterval = null;
let fcNextTimeout = null;
let fcM = 0, fcN = 0;
let fcSlots = new Array(FC_SLOT_COUNT).fill(null);   // แต่ละช่อง: {t:'x'|'sign'|'num', v}
let fcDrag = null;
let fcSelected = null;          // แตะกล่องแล้วแตะช่อง (เผื่อลากไม่ถนัด)
let fcCorrect = 0;
let fcBound = false;
let fcPaletteBuilt = false;

function fcRand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function fcLabel(item) {
  if (item.t === 'sign') return item.v === '-' ? '−' : '+';
  return String(item.v);
}

function fcSignedText(v) { return (v < 0 ? '−' : '+') + ' ' + Math.abs(v); }

function fcSolutionText() { return `(x ${fcSignedText(fcM)})(x ${fcSignedText(fcN)})`; }

function fcGenerate() {
  let m, n;
  do {
    m = fcRand(-FC_MAX_NUM, FC_MAX_NUM);
    n = fcRand(-FC_MAX_NUM, FC_MAX_NUM);
  } while (m === 0 || n === 0 || m + n === 0);
  const a = m + n, b = m * n;
  const aText = (a < 0 ? '−' : '+') + ' ' + (Math.abs(a) === 1 ? '' : Math.abs(a)) + 'x';
  const bText = (b < 0 ? '−' : '+') + ' ' + Math.abs(b);
  return { m, n, text: `x² ${aText} ${bText} = 0` };
}

function fcBuildPalette() {
  if (fcPaletteBuilt) return;
  fcPaletteBuilt = true;
  const mk = (t, v, label) => `<div class="fc-tile t-${t}" data-t="${t}" data-v="${v}">${label}</div>`;
  document.getElementById("fcOps").innerHTML = mk('x', 'x', 'x') + mk('sign', '+', '+') + mk('sign', '-', '−');
  let nums = '';
  for (let i = 1; i <= FC_MAX_NUM; i++) nums += mk('num', i, i);
  document.getElementById("fcNums").innerHTML = nums;
}

function fcStart() {
  fcBuildPalette();
  fcBindDnD();
  fcStop();
  fcCorrect = 0;
  fcRunning = true;
  fcUpdateScore();
  fcNewQuestion();
}

// เริ่มจับเวลาใหม่ทุกครั้งที่ขึ้นโจทย์ใหม่
function fcStartTimer() {
  if (fcTimerInterval) { clearInterval(fcTimerInterval); fcTimerInterval = null; }
  fcTimeLeft = FC_TIME_LIMIT;
  fcUpdateTimerUI(true);
  fcTimerInterval = setInterval(() => {
    fcTimeLeft -= 1;
    fcUpdateTimerUI(false);
    if (fcTimeLeft <= 0) fcHandleTimeout();
  }, 1000);
}

function fcStopTimer() {
  if (fcTimerInterval) { clearInterval(fcTimerInterval); fcTimerInterval = null; }
}

// หมดเวลา = เปลี่ยนโจทย์
function fcHandleTimeout() {
  if (!fcRunning || fcLocked) return;
  fcStopTimer();
  fcLocked = true;
  fcCancelDrag();
  fcRender();
  fcSetFeedback(`⏰ หมดเวลา! เฉลย: ${fcSolutionText()}`, "bad");
  fcNextTimeout = setTimeout(fcNewQuestion, 1800);
}

function fcStop() {
  if (fcTimerInterval) { clearInterval(fcTimerInterval); fcTimerInterval = null; }
  clearTimeout(fcNextTimeout);
  fcRunning = false;
  fcCancelDrag();
}

function fcUpdateTimerUI(isReset) {
  const fill = document.getElementById("fcTimerFill");
  const text = document.getElementById("fcTimerText");
  const shown = Math.max(0, fcTimeLeft);
  const mm = Math.floor(shown / 60), ss = String(shown % 60).padStart(2, '0');
  if (fill) {
    if (isReset) {
      fill.style.transition = "none";
      fill.style.width = "100%";
      void fill.offsetWidth;
      fill.style.transition = "width 1s linear";
    } else {
      fill.style.width = (shown / FC_TIME_LIMIT * 100) + "%";
    }
    fill.style.background = shown <= 30
      ? "linear-gradient(90deg, #e74f66, #c0392b)"
      : "linear-gradient(90deg, #2ecc71, #e74f66)";
  }
  if (text) text.textContent = `เหลือเวลา ${mm}:${ss}`;
}

function fcUpdateScore() {
  const el = document.getElementById("fcScore");
  if (el) el.innerHTML = `รอบนี้ตอบถูก <b class="num">${fcCorrect}</b> ข้อ → 💰 +${fcCorrect * FC_REWARD_COIN} | ⭐ +${fcCorrect * FC_REWARD_EXP}`;
}

function fcSetFeedback(text, kind) {
  const el = document.getElementById("fcFeedback");
  el.textContent = text;
  el.className = "mg-feedback" + (kind ? " " + kind : "");
}

function fcNewQuestion() {
  clearTimeout(fcNextTimeout);
  const q = fcGenerate();
  fcM = q.m; fcN = q.n;
  fcSlots = new Array(FC_SLOT_COUNT).fill(null);
  fcSelected = null;
  fcLocked = false;
  document.getElementById("fcEquation").textContent = q.text;
  fcSetFeedback("", "");
  fcRender();
  fcStartTimer();
}

function fcRender() {
  const host = document.getElementById("fcSlots");
  const slotHTML = i => {
    const s = fcSlots[i];
    return `<div class="fc-slot ${s ? 'filled t-' + s.t : ''}" data-i="${i}">${s ? fcLabel(s) : ''}</div>`;
  };
  host.innerHTML =
    `<span class="fc-paren">(</span><div class="fc-group">${[0, 1, 2].map(slotHTML).join('')}</div><span class="fc-paren">)</span>` +
    `<span class="fc-paren">(</span><div class="fc-group">${[3, 4, 5].map(slotHTML).join('')}</div><span class="fc-paren">)</span>`;

  document.querySelectorAll("#fcPlay .fc-tile").forEach(t => {
    const on = fcSelected && t.dataset.t === fcSelected.t && String(t.dataset.v) === String(fcSelected.v);
    t.classList.toggle("selected", !!on);
  });

  const btn = document.getElementById("fcSubmitBtn");
  if (btn) btn.disabled = !fcRunning || fcLocked || fcSlots.some(s => !s);
}

function fcClear() {
  if (!fcRunning || fcLocked) return;
  fcSlots = new Array(FC_SLOT_COUNT).fill(null);
  fcSelected = null;
  fcRender();
}

// อ่านตัวประกอบ (x ± n) จากช่อง start..start+2 → คืนค่า ±n หรือ null ถ้าเรียงผิดรูปแบบ
function fcParseFactor(start) {
  const [a, b, c] = [fcSlots[start], fcSlots[start + 1], fcSlots[start + 2]];
  if (!a || !b || !c) return null;
  if (a.t !== 'x' || b.t !== 'sign' || c.t !== 'num') return null;
  return (b.v === '-' ? -1 : 1) * Number(c.v);
}

function fcSubmit() {
  if (!fcRunning || fcLocked || fcSlots.some(s => !s)) return;
  fcLocked = true;
  fcStopTimer();
  fcRender();

  const p = fcParseFactor(0), q = fcParseFactor(3);
  const ok = p !== null && q !== null && ((p === fcM && q === fcN) || (p === fcN && q === fcM));

  if (ok) {
    const levelBefore = wallet.level;
    wallet.coins += FC_REWARD_COIN;
    wallet.exp += FC_REWARD_EXP;
    fcCorrect++;

    updateWalletUI();
    mgRefreshCoins();
    fcUpdateScore();
    fcSetFeedback(`✅ ถูกต้อง! +${FC_REWARD_COIN} 💰  +${FC_REWARD_EXP} ⭐`, "good");
    if (wallet.level > levelBefore) popMessage(`🎉 เลเวลอัป! ตอนนี้ Lv.${wallet.level}`);

    saveWalletAndData().catch(() => {});
    fcNextTimeout = setTimeout(fcNewQuestion, 700);
  } else {
    fcSetFeedback(`❌ ผิด! เฉลย: ${fcSolutionText()}`, "bad");
    fcNextTimeout = setTimeout(fcNewQuestion, 1800);
  }
}

/* ---- ลากวาง (Pointer Events: ใช้ได้ทั้งนิ้วและเมาส์) ---- */

function fcBindDnD() {
  if (fcBound) return;
  fcBound = true;
  const play = document.getElementById("fcPlay");
  play.addEventListener("pointerdown", fcPointerDown);
  play.addEventListener("contextmenu", e => e.preventDefault());
  window.addEventListener("pointermove", fcPointerMove, { passive: false });
  window.addEventListener("pointerup", fcPointerUp);
  window.addEventListener("pointercancel", fcPointerUp);
}

function fcPointerDown(e) {
  if (!fcRunning || fcLocked || fcDrag) return;
  const slotEl = e.target.closest(".fc-slot");
  const tileEl = e.target.closest(".fc-tile");

  // แตะกล่องค้างไว้ แล้วแตะช่อง → วางเลย
  if (slotEl && fcSelected) {
    e.preventDefault();
    fcSlots[Number(slotEl.dataset.i)] = { ...fcSelected };
    fcSelected = null;
    fcRender();
    return;
  }

  let item = null, fromSlot = -1;
  if (tileEl) item = { t: tileEl.dataset.t, v: tileEl.dataset.v };
  else if (slotEl && fcSlots[Number(slotEl.dataset.i)]) {
    fromSlot = Number(slotEl.dataset.i);
    item = fcSlots[fromSlot];
  }
  if (!item) return;

  e.preventDefault();
  fcDrag = { item, fromSlot, id: e.pointerId, sx: e.clientX, sy: e.clientY, moved: false, ghost: null };
}

function fcPointerMove(e) {
  if (!fcDrag || e.pointerId !== fcDrag.id) return;
  if (!fcDrag.moved) {
    if (Math.hypot(e.clientX - fcDrag.sx, e.clientY - fcDrag.sy) < 6) return;
    fcDrag.moved = true;
    const g = document.createElement("div");
    g.className = "fc-ghost t-" + fcDrag.item.t;
    g.textContent = fcLabel(fcDrag.item);
    document.body.appendChild(g);
    fcDrag.ghost = g;
    if (fcDrag.fromSlot >= 0) {
      const src = document.querySelector(`#fcSlots .fc-slot[data-i="${fcDrag.fromSlot}"]`);
      if (src) src.classList.add("dragging");
    }
  }
  e.preventDefault();
  fcDrag.ghost.style.left = e.clientX + "px";
  fcDrag.ghost.style.top = e.clientY + "px";

  document.querySelectorAll("#fcSlots .fc-slot.over").forEach(s => s.classList.remove("over"));
  const el = document.elementFromPoint(e.clientX, e.clientY);
  const slot = el && el.closest ? el.closest(".fc-slot") : null;
  if (slot) slot.classList.add("over");
}

function fcPointerUp(e) {
  if (!fcDrag || e.pointerId !== fcDrag.id) return;
  const d = fcDrag;
  fcDrag = null;
  if (d.ghost) d.ghost.remove();

  if (!d.moved) {
    // แค่แตะ: กล่อง → เลือก/ยกเลิกเลือก, ช่องที่มีของ → เอาออก
    if (d.fromSlot >= 0) fcSlots[d.fromSlot] = null;
    else {
      const same = fcSelected && fcSelected.t === d.item.t && String(fcSelected.v) === String(d.item.v);
      fcSelected = same ? null : d.item;
    }
    fcRender();
    return;
  }

  let target = -1;
  if (e.type === "pointerup") {
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const slot = el && el.closest ? el.closest(".fc-slot") : null;
    if (slot) target = Number(slot.dataset.i);
  }

  if (target >= 0) {
    if (d.fromSlot >= 0) {                       // ลากสลับช่อง
      const tmp = fcSlots[target];
      fcSlots[target] = d.item;
      fcSlots[d.fromSlot] = tmp;
    } else {
      fcSlots[target] = d.item;
    }
    fcSelected = null;
  } else if (d.fromSlot >= 0 && e.type === "pointerup") {
    fcSlots[d.fromSlot] = null;                  // ลากออกนอกช่อง = เอาออก
  }
  fcRender();
}

function fcCancelDrag() {
  if (fcDrag && fcDrag.ghost) fcDrag.ghost.remove();
  fcDrag = null;
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
  pool.push({ kind: 'firedragon', id: 'firedragon', name: 'มังกรไฟ', img: 'Shop/firedragon_shop.png', weight: ROULETTE_WEIGHT_FIREDRAGON, rarity: 'legend' });
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

  if (prize.kind === 'firedragon') {
    if (currentStudent.pets.length >= getMaxAllowedPets()) {
      wallet.coins += ROULETTE_FULL_COINS;
      info.converted = true;
      info.coinsGained = ROULETTE_FULL_COINS;
    } else {
      currentStudent.pets.push({
        type: 'firedragon',
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

  if (prize.kind === 'firedragon') {
    if (info.converted) {
      title.textContent = "🐉 ได้มังกรไฟ! แต่สัตว์เต็มคอก";
      desc.innerHTML = `สัตว์เต็มคุณได้เงินแทน <b>${ROULETTE_FULL_COINS.toLocaleString()} เหรียญ</b> 💰`;
      popMessage(`สัตว์เต็มคุณได้เงินแทน ${ROULETTE_FULL_COINS.toLocaleString()} เหรียญ 💰`);
    } else {
      title.textContent = "🎉 ยินดีด้วย! ได้มังกรไฟ";
      desc.textContent = "มังกรไฟเข้ามาอยู่ในบ้านของคุณแล้ว 🐉";
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


/* ======================= 🌱 แปลงผัก (เดิม plant.js) ======================= */
/* 🌱 แปลงผัก 2.5D — ใช้คณิตศาสตร์ควบคุมเครื่องจักร (ม.ปลาย)
   หน้าจอคือแปลงผักเต็มจอ แตะจุดที่เสีย (❗) จึงมีโจทย์เลื่อนขึ้นมา · สถานะเก็บใน LastFed เป็น Q1..Q6
   จุด 1 สปริงเกลอร์ (ฟังก์ชันกำลังสอง)      จุด 2 ตัวตรวจความชื้น (เอกซ์โปเนนเชียล/ลอการิทึม)
   จุด 3 ถังผสมปุ๋ย (ระบบสมการ 3 ตัวแปร)     จุด 4 ท่อลำเลียงน้ำ (เวกเตอร์ 3 มิติ)
   จุด 5 เรือนกระจก (ตรีโกณมิติ)             จุด 6 รั้วและถังน้ำ (อนุพันธ์ ค่าสูงสุด)
   ต้องมี window.PlantHost (ประกาศใน script.js) */
(function(){
'use strict';
const $ = id => document.getElementById(id);
let RNG = Math.random;           // ตอนสร้างโจทย์จะสลับเป็นตัวสุ่มแบบ seed (โจทย์รายวันคงเดิมทั้งวัน)
const rnd = (a,b) => a + Math.floor(RNG()*(b-a+1));
const pick = a => a[Math.floor(RNG()*a.length)];
const clamp = (x,a,b) => Math.max(a, Math.min(b, x));
const TAU = Math.PI*2;
const TRIES = 3;

const STATIONS = [
  { id:'spr',  name:'สปริงเกลอร์',     icon:'🚿', topic:'ฟังก์ชันกำลังสอง',            veg:'carrot',  bonus:0 },
  { id:'moi',  name:'ตัวตรวจความชื้น', icon:'📟', topic:'เอกซ์โปเนนเชียล / ลอการิทึม', veg:'tomato',  bonus:0 },
  { id:'mix',  name:'ถังผสมปุ๋ย',      icon:'🧪', topic:'ระบบสมการ 3 ตัวแปร',          veg:'cabbage', bonus:3 },
  { id:'pipe', name:'ท่อลำเลียงน้ำ',   icon:'🛠️', topic:'เวกเตอร์ 3 มิติ (บวก · ขนาด · dot · cross)',             veg:'carrot',  bonus:2 },
  { id:'gh',   name:'เรือนกระจก',      icon:'🏠', topic:'ตรีโกณมิติ (สมการตรีโกณมิติ)',      veg:'tomato',  bonus:3 },
  { id:'fence',name:'รั้วและถังน้ำ',   icon:'📦', topic:'อนุพันธ์ หาค่าสูงสุด',        veg:'cabbage', bonus:3 }
];

const S = { sel:-1, lvl:1, pz:null, tries:TRIES, field:0, vals:[], busy:false, done:false, ok:false,
            anim:null, traces:[], reveal:false, spray:0, flash:0, fxIdx:-1, save:null, raf:0, open:false, slopeAt:null, hit:{} };

/* ---------- ตัวสุ่มแบบ seed (โจทย์/ระดับ/การเสีย ต้องเหมือนเดิมทั้งวัน) ---------- */
function hashStr(s){
  let h = 1779033703 ^ s.length;
  for (let i=0;i<s.length;i++){ h = Math.imul(h ^ s.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
  h = Math.imul(h ^ (h>>>16), 2246822507); h = Math.imul(h ^ (h>>>13), 3266489909);
  return (h ^ (h>>>16)) >>> 0;
}
function seedRng(str){
  let a = hashStr(str);
  return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a>>>15, 1|a);
    t = t + Math.imul(t ^ t>>>7, 61|t) ^ t; return ((t ^ t>>>14) >>> 0) / 4294967296; };
}

/* ---------- สถานะแต่ละจุด ----------
   เก็บใน LastFed ของนักเรียน: "Q1".."Q6" = วันที่ซ่อมจุดนั้นสำเร็จล่าสุด (ว่าง = ยังไม่เคยซ่อม = เสียอยู่)
   หลังซ่อมแล้ว แต่ละวันที่ผ่านไปมีโอกาส 50% ที่จะเสียอีก (สุ่มแบบ seed จึงตรงกันทุกครั้งที่เปิด) */
const addDay = s => { const [y,m,d] = s.split('-').map(Number), t = new Date(y, m-1, d+1);
  return `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,'0')}-${String(t.getDate()).padStart(2,'0')}`; };
function isBroken(i){
  const H = window.PlantHost, today = H.today(), q = H.getQ(i);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(q || '')) return true;
  if (q >= today) return false;
  let d = q;
  for (let n=0; n<400; n++){
    d = addDay(d);
    if (seedRng(`brk|${H.id()}|${d}|${i}`)() < 0.5) return true;
    if (d >= today) return false;
  }
  return true;
}
function levelOf(i){ const H = window.PlantHost, r = seedRng(`lvl|${H.id()}|${H.today()}|${i}`)();
  return STATIONS[i].id === 'gh' ? 2 + Math.floor(r*2) : 1 + Math.floor(r*3); }   // เรือนกระจกมีแค่ระดับ 2 (กลาง) กับ 3 (ยาก)
const brokenCount = () => STATIONS.reduce((n,_,i) => n + (isBroken(i) ? 1 : 0), 0);

/* ---------- บันทึกในเครื่อง: จำนวนหยดน้ำที่ใช้ไป/จำนวนครั้งที่ตอบพลาดจนน้ำหมด (กันรีโหลดเพื่อรีเซ็ต) ---------- */
function loadSave(){
  const H = window.PlantHost; let o = null;
  try { o = JSON.parse(localStorage.getItem('plantState_' + H.id())); } catch(e){}
  if (!o || o.date !== H.today() || !o.fails) o = { date:H.today(), fails:{}, used:{} };
  S.save = o;
}
function writeSave(){ try { localStorage.setItem('plantState_' + window.PlantHost.id(), JSON.stringify(S.save)); } catch(e){} }

/* ---------- เวกเตอร์ช่วยคำนวณ ---------- */
const dot   = (u,v) => u[0]*v[0] + u[1]*v[1] + u[2]*v[2];
const cross = (u,v) => [u[1]*v[2]-u[2]*v[1], u[2]*v[0]-u[0]*v[2], u[0]*v[1]-u[1]*v[0]];
const det3  = (a,b,c) => dot(a, cross(b,c));
const vadd  = (a,b) => [a[0]+b[0], a[1]+b[1], a[2]+b[2]];
const vlen  = v => Math.sqrt(dot(v,v));
const isZero = v => v[0]===0 && v[1]===0 && v[2]===0;
const fmtV  = v => `(${v[0]}, ${v[1]}, ${v[2]})`;
const nz = x => x === 0 ? 0 : x;           // กัน -0

/* ---------- ตัวสร้างโจทย์ (ค่าเป็นจำนวนเต็มสวย ๆ) ---------- */
/* จุด 1: สปริงเกลอร์ */
function genSprinkler(lvl){
  for (let guard=0; guard<200; guard++){
    let a, b, D=null, hoops=[];
    if (lvl < 3){
      a = lvl===1 ? 1 : rnd(1,3);
      D = lvl===1 ? rnd(4,8) : rnd(3,7);
      const m = rnd(1, D-1);
      b = a*D;
      hoops = [{ x:m, y:a*m*(D-m) }];
    } else {
      a = rnd(1,3);
      let m1 = rnd(1,5), m2 = rnd(1,5); if (m1===m2) continue;
      if (m1>m2) [m1,m2] = [m2,m1];
      b = rnd(a*m2+1, 10);
      hoops = [m1,m2].map(m => ({ x:m, y:-a*m*m + b*m }));
    }
    const apex = b*b/(4*a);
    if (apex > 36) continue;
    if (hoops.some(h => h.y < 1)) continue;
    const tiers = [10,20,30,40];
    const yMax = lvl===3 ? 28 : tiers.find(t => t >= apex+1);
    const xMax = lvl===3 ? 11 : D+2;
    return { type:'spr', a, b, D, hoops, xMax, yMax, fields:2,
      answerText:`a = ${a}, b = ${b}`,
      judge(v){
        const [ea,eb] = v, notes = []; let ok = true;
        if (D !== null && Math.abs(eb/ea - D) > 1e-9){ ok = false; notes.push(eb/ea < D ? 'น้ำตกก่อนถึงต้นไม้' : 'น้ำตกเลยต้นไม้'); }
        hoops.forEach((h,i) => {
          const y = -ea*h.x*h.x + eb*h.x;
          if (Math.abs(y - h.y) > 1e-9){ ok = false; notes.push(`ลำน้ำ${y < h.y ? 'ต่ำกว่า' : 'สูงกว่า'}ห่วง${hoops.length>1 ? ' '+(i+1) : ''}`); }
        });
        return { ok, notes };
      }
    };
  }
}

/* จุด 2: ตัวตรวจความชื้น */
function genMoisture(lvl){
  let base, h, n, L, readT;
  h = rnd(1,3);
  if (lvl === 1){ base=2; n=rnd(2,3); L=pick([5,10]); readT=[0,h]; }
  else if (lvl === 2){
    base = pick([2,3]);
    if (base===2){ n=rnd(2,4); L=pick([5,10]); } else { n=rnd(2,3); L=pick([2,3,4,5]); }
    const j = n===2 ? 1 : rnd(1,2); readT=[0,h*j];
  } else {
    base = pick([2,3]);
    if (base===2){ n=4; L=pick([5,10]); readT = pick([[1,2],[1,3],[2,3]]).map(j=>j*h); }
    else { n=3; L=pick([2,3,4]); readT = [h,2*h]; }
  }
  const M0 = L*Math.pow(base,n);
  const f = t => M0*Math.pow(base, -t/h);
  const readings = readT.map(t => ({ t, m:Math.round(f(t)) }));
  const ans = h*n;
  return { type:'moi', base, h, n, L, M0, f, readings, ans, fields:1,
    tMax: ans+2, yMax: Math.ceil(M0*1.05/10)*10,
    answerText:`t = ${ans} ชั่วโมง`,
    judge(v){
      const t = v[0];
      if (t === ans) return { ok:true, notes:[] };
      return { ok:false, notes:[ t < ans ? 'รดเร็วเกินไป ดินยังชื้นอยู่ น้ำล้นแปลง' : 'รดช้าเกินไป ต้นเริ่มเหี่ยวแล้ว' ] };
    }
  };
}

/* จุด 3: ผสมปุ๋ย 3 ถัง — แก้ระบบสมการเชิงเส้น 3 ตัวแปร (ระดับ 3 บางข้อไม่มีคำตอบ) */
function genMix(lvl){
  for (let guard=0; guard<500; guard++){
    let T, sol, none = false, target;
    if (lvl === 1){          // สามเหลี่ยม แก้ทีละตัวได้
      T = [[rnd(1,3),rnd(0,2),rnd(0,2)], [0,rnd(1,3),rnd(0,2)], [0,0,rnd(1,3)]];
      sol = [rnd(1,3),rnd(1,3),rnd(1,3)];
    } else if (lvl === 2){
      T = [0,1,2].map(() => [rnd(0,4),rnd(0,4),rnd(0,4)]);
      sol = [rnd(1,4),rnd(1,4),rnd(1,4)];
    } else {
      T = [0,1,2].map(() => [rnd(0,5),rnd(0,5),rnd(0,5)]);
      sol = [rnd(0,5),rnd(0,5),rnd(0,5)];
      none = RNG() < .35;
    }
    if (T.some(isZero)) continue;
    if (none){
      // ถังพึ่งพากัน: C = A + B หรือ B เหมือน A แล้วสูตรเป้าหมายอยู่นอกระนาบ
      const A = T[0];
      if (RNG() < .5){ T[1] = [rnd(0,4),rnd(0,4),rnd(0,4)]; T[2] = vadd(A, T[1]); }
      else { T[1] = A.slice(); }
      if (T.some(isZero)) continue;
      if (det3(T[0],T[1],T[2]) !== 0) continue;
      let p = null, q = null;
      for (const [i,j] of [[0,1],[0,2],[1,2]]) if (!isZero(cross(T[i],T[j]))){ p=T[i]; q=T[j]; break; }
      if (!p) continue;
      target = [rnd(3,20),rnd(3,20),rnd(3,20)];
      if (dot(target, cross(p,q)) === 0) continue;
    } else {
      if (det3(T[0],T[1],T[2]) === 0) continue;
      if (sol.every(x => x===0)) continue;
      target = [0,1,2].map(j => sol[0]*T[0][j] + sol[1]*T[1][j] + sol[2]*T[2][j]);
      if (target.some(x => x > 60)) continue;
    }
    const mixOf = v => [0,1,2].map(j => v[0]*T[0][j] + v[1]*T[1][j] + v[2]*T[2][j]);
    return { type:'mix', tanks:T, target, sol, none, fields:3, neg:false, hasNone: lvl===3, mixOf,
      answerText: none ? 'ผสมไม่ได้ (ถังพึ่งพากัน ไม่มีคำตอบ)' : `A = ${sol[0]}, B = ${sol[1]}, C = ${sol[2]}`,
      valid: () => null,
      judge(v){
        if (none) return { ok:false, notes:['ตั้งยังไงก็ไม่ตรงสูตร — ลองสังเกตถังทั้งสามให้ดี'] };
        const m = mixOf(v), notes = [];
        m.forEach((x,j) => { if (x !== target[j]) notes.push(`ธาตุ ${'NPK'[j]} ${x < target[j] ? 'ขาด' : 'เกิน'}`); });
        return { ok: notes.length === 0, notes };
      },
      judgeNone(){
        return none ? { ok:true, notes:[] } : { ok:false, notes:['จริง ๆ แล้วผสมได้ ลองหาอัตราไหลใหม่'] };
      }
    };
  }
}

/* จุด 4: ท่อลำเลียงน้ำ — เวกเตอร์ 3 มิติ (ไล่ระดับตามเนื้อหา ม.4–6)
   ระดับ 1 (ม.4)   บวก/ลบเวกเตอร์ในรูปองค์ประกอบ — หาท่อนที่หายไปให้ปลายท่อถึงเป้าหมาย
   ระดับ 2 (ม.5)   ผลบวกของ 3 ท่อน (ท่อนที่หายไปอยู่ตำแหน่งใดก็ได้) หรือ ขนาด + เวกเตอร์หนึ่งหน่วย (v = L·w/|w|)
   ระดับ 3 (ม.5–6) ผลคูณเชิงสเกลาร์ (ตั้งฉาก a·b = 0 หาค่า k) หรือ ผลคูณเชิงเวกเตอร์ (a × b) */
function genPipe(lvl){
  const W = [[1,2,2],[2,1,2],[2,2,1],[2,3,6]];
  const zOK = segs => { let z = 0; return segs.every(s => (z += s[2]) >= 0); };
  const smallOK = v => v.every(c => Math.abs(c) <= 12);
  const rv = () => lvl===1 ? [rnd(0,6),rnd(0,6),rnd(0,3)] : [rnd(-4,6),rnd(-4,6),rnd(-3,4)];
  const rvSmall = () => [rnd(-3,4), rnd(-3,4), rnd(-2,3)];
  const zeroMsg = v => isZero(v) ? 'ท่อต้องมีความยาว (ห้ามเป็น 0,0,0)' : null;
  const kind = lvl===1 ? 'tar' : lvl===2 ? (RNG() < .5 ? 'tar' : 'dir') : (RNG() < .5 ? 'perp' : 'cross');
  for (let guard=0; guard<3000; guard++){

    if (kind === 'tar'){
      const nSeg = lvl===1 ? 2 : 3;
      const segs = Array.from({length:nSeg}, rv);
      if (segs.some(isZero) || !zOK(segs)) continue;
      const unk = lvl===1 ? nSeg-1 : rnd(0,nSeg-1);
      const target = segs.reduce(vadd, [0,0,0]);
      if (!smallOK(target)) continue;
      const fullSegs = v => segs.map((s,i) => i===unk ? v : s);
      return { type:'pipe', mode:'tar', segs, unk, target, fields:3, neg:true, ansV:segs[unk],
        answerText:`ท่อนที่ ${unk+1} = ${fmtV(segs[unk])}`,
        valid: zeroMsg, fullSegs,
        judge(v){
          const end = fullSegs(v).reduce(vadd,[0,0,0]), notes = [];
          ['x','y','z'].forEach((ax,k) => { const d = end[k] - target[k]; if (d !== 0) notes.push(`ปลายท่อ${d<0?'สั้นไป':'เลยไป'}ในแกน ${ax}`); });
          return { ok: notes.length === 0, notes };
        }
      };
    }

    if (kind === 'dir'){
      // ท่อนที่ 3: ยาว L ในทิศเดียวกับ (หรือตรงข้ามกับ) w  ⇒  v = ±L·(w/|w|)
      const given = Array.from({length:2}, rv);
      if (given.some(isZero) || !zOK(given)) continue;
      const w = pick(W).slice().sort(() => RNG()-.5).map(c => c * pick([1,-1]));
      const sgn = RNG() < .75 ? 1 : -1;
      const k = w.some(c => Math.abs(c) === 6) ? rnd(1,2) : rnd(1,3);
      const L = k * Math.round(vlen(w));
      const ans = w.map(c => nz(sgn*k*c));
      if (!smallOK(ans) || !zOK(given.concat([ans]))) continue;
      return { type:'pipe', mode:'dir', segs:given, unk:2, w, L, sgn, fields:3, neg:true, ansV:ans,
        answerText:`ท่อนที่ 3 = ${fmtV(ans)}  (${sgn>0?'':'−'}${L} · w/|w|, |w| = ${Math.round(vlen(w))})`,
        valid: zeroMsg,
        fullSegs: v => given.concat([v]),
        judge(v){
          const notes = [];
          if (!isZero(cross(v,w))) notes.push('ท่อไม่ขนานกับ w');
          else {
            const l2 = dot(v,v);
            if (l2 !== L*L) notes.push(l2 < L*L ? 'ท่อสั้นกว่าที่กำหนด' : 'ท่อยาวกว่าที่กำหนด');
            else if (dot(v,w)*sgn < 0) notes.push(sgn > 0 ? 'ท่อชี้ทิศตรงข้ามกับ w' : 'โจทย์ให้ไปทิศตรงข้ามกับ w แต่ท่อชี้ทิศเดียวกัน');
          }
          return { ok: notes.length === 0, notes };
        }
      };
    }

    if (kind === 'perp'){
      // ท่อนที่ 2 = (…k…) ต้องตั้งฉากกับท่อนที่ 1  ⇒  a·b = 0 แล้วแก้สมการเชิงเส้นหา k
      const a = rv(); if (isZero(a)) continue;
      const j = rnd(0,1);                                   // k อยู่ที่องค์ประกอบ x หรือ y
      if (a[j] === 0) continue;
      const b = [rnd(-4,6), rnd(-4,6), rnd(-3,4)];
      const rest = [0,1,2].filter(i => i !== j).reduce((s,i) => s + a[i]*b[i], 0);
      if (rest % a[j] !== 0) continue;
      const kk = nz(-rest / a[j]);
      if (kk === 0 || Math.abs(kk) > 9) continue;
      b[j] = kk;
      if (dot(a,b) !== 0 || !zOK([a,b])) continue;
      const fullSegs = v => { const bb = b.slice(); bb[j] = (v[0] === undefined || isNaN(v[0])) ? 0 : v[0]; return [a, bb]; };
      return { type:'pipe', mode:'perp', segs:[a,b], unk:1, j, kk, fields:1, neg:true, ansV:[kk],
        answerText:`k = ${kk}  (ท่อนที่ 2 = ${fmtV(b)})`,
        valid: () => null, fullSegs,
        judge(v){
          const d = dot(a, fullSegs(v)[1]);
          if (d === 0) return { ok:true, notes:[] };
          return { ok:false, notes:[ d > 0 ? `มุมระหว่างสองท่อนเป็นมุมแหลม (v₁·v₂ = ${d} > 0)` : `มุมระหว่างสองท่อนเป็นมุมป้าน (v₁·v₂ = ${d} < 0)` ] };
        }
      };
    }

    // kind === 'cross': ท่อนที่ 3 = v₁ × v₂
    const a = rvSmall(), b = rvSmall();
    if (isZero(a) || isZero(b)) continue;
    const c = cross(a,b);
    if (isZero(c) || !smallOK(c) || !zOK([a,b,c])) continue;
    return { type:'pipe', mode:'cross', segs:[a,b], unk:2, c, fields:3, neg:true, ansV:c,
      answerText:`ท่อนที่ 3 = ท่อนที่ 1 × ท่อนที่ 2 = ${fmtV(c)}`,
      valid: zeroMsg,
      fullSegs: v => [a,b,v],
      judge(v){
        const notes = [];
        if (dot(v,a) !== 0) notes.push('ท่อนที่ 3 ไม่ตั้งฉากกับท่อนที่ 1 (v·v₁ ≠ 0)');
        if (dot(v,b) !== 0) notes.push('ท่อนที่ 3 ไม่ตั้งฉากกับท่อนที่ 2 (v·v₂ ≠ 0)');
        if (!notes.length){
          const t = dot(v,c) / dot(c,c);
          if (t < 0) notes.push('ทิศกลับด้าน — ใช้ v₁ × v₂ (กฎมือขวา) ไม่ใช่ v₂ × v₁');
          else if (t !== 1) notes.push(t < 1 ? 'ท่อนสั้นกว่า |v₁ × v₂|' : 'ท่อนยาวกว่า |v₁ × v₂|');
        }
        return { ok: notes.length === 0, notes };
      }
    };
  }
}

/* จุด 5: เรือนกระจก — สมการตรีโกณมิติ (มี 2 ระดับ: ระดับ 2 = กลาง · ระดับ 3 = ยาก)
   ระดับ 2  f(a·x) = b          f ∈ sin cos tan cosec sec cot · a ∈ {1,2,3} · b เป็นค่ามุมพิเศษ (± 0, 1/2, √2/2, √3/2, 1 · tan/cot ± 0, 1/√3, 1, √3 · cosec/sec ± 1, 2/√3, √2, 2)
   ระดับ 3  p·f²x + q·f x + r = 0  แยกตัวประกอบเป็นสมการพื้นฐาน (บางข้อมีรากที่เป็นไปไม่ได้ เช่น cos x = 2)
   ช่วงของ x สุ่มจาก 0 ≤ x ≤ 2π · 0 ≤ x ≤ π · −π ≤ x ≤ π — ผู้เล่นกรอก x ทุกค่าเป็นพหุคูณของ π (กด ÷ ใส่เศษส่วน) */
const GH_DOMS = [[0,2],[0,1],[-1,1]];
const gcd = (a,b) => { a = Math.abs(a); b = Math.abs(b); while (b){ const t = a % b; a = b; b = t; } return a; };
function piStr(n, d){                                           // เศษส่วน n/d ของ π → ข้อความ เช่น 5π/6
  const g = gcd(n, d) || 1; n /= g; d /= g;
  if (n === 0) return '0';
  const sg = n < 0 ? '−' : '', an = Math.abs(n), co = an === 1 ? '' : an;
  return d === 1 ? `${sg}${co}π` : `${sg}${co}π/${d}`;
}
const TF = {
  sin: t => Math.sin(t), cos: t => Math.cos(t),
  tan:   t => { const c = Math.cos(t); return Math.abs(c) < 1e-9 ? NaN : Math.sin(t)/c; },
  cosec: t => { const s = Math.sin(t); return Math.abs(s) < 1e-9 ? NaN : 1/s; },
  sec:   t => { const c = Math.cos(t); return Math.abs(c) < 1e-9 ? NaN : 1/c; },
  cot:   t => { const s = Math.sin(t); return Math.abs(s) < 1e-9 ? NaN : Math.cos(t)/s; }
};
const GH_B = {
  sc:  [['0',0], ['1/2',.5], ['√2/2',Math.SQRT1_2], ['√3/2',Math.sqrt(3)/2], ['1',1]],
  tc:  [['0',0], ['1/√3',1/Math.sqrt(3)], ['1',1], ['√3',Math.sqrt(3)]],
  sec: [['1',1], ['2/√3',2/Math.sqrt(3)], ['√2',Math.SQRT2], ['2',2]]
};
const ghB = fn => fn==='sin' || fn==='cos' ? GH_B.sc : fn==='tan' || fn==='cot' ? GH_B.tc : GH_B.sec;

function ghSolve(test, dom, den){                               // หา x = (k/den)π ทั้งหมดในช่วง ที่ test(x) เป็นจริง (คืนเศษส่วนย่อแล้ว)
  const out = [];
  for (let k = dom[0]*den; k <= dom[1]*den; k++){
    if (!test(Math.PI*k/den)) continue;
    const g = gcd(k, den) || den;
    out.push({ n:k/g, d:den/g, v:k/den });
  }
  return out;
}
function ghPuzzle(lvl, dom, o){                                 // o: fn(x) = ฝั่งซ้ายของสมการ · target = ค่าฝั่งขวา · yFixed = ช่วงแกน y (ถ้ากราฟมีเส้นกำกับ)
  const test = x => { const y = o.fn(x); return isFinite(y) && Math.abs(y - o.target) < 1e-9; };
  const sols = ghSolve(test, dom, o.den);
  if (sols.length < 2 || sols.length > 6) return null;
  const isSol = v => v >= dom[0]-1e-9 && v <= dom[1]+1e-9 && test(v*Math.PI);
  let yMin, yMax;
  if (o.yFixed) [yMin, yMax] = o.yFixed;
  else {
    let lo = 1e9, hi = -1e9;
    for (let i=0; i<=240; i++){ const y = o.fn(Math.PI*(dom[0] + (dom[1]-dom[0])*i/240)); if (isFinite(y)){ lo = Math.min(lo, y); hi = Math.max(hi, y); } }
    yMin = Math.floor(Math.min(lo, o.target) - .5); yMax = Math.ceil(Math.max(hi, o.target) + .5);
  }
  return { type:'gh', lvl, lo:dom[0], hi:dom[1], sols, fields:sols.length, frac:true, neg:true,
    eqText:o.eqText, curveLabel:o.curveLabel, targetText:o.targetText, fn:o.fn, target:o.target, yMin, yMax, isSol,
    domTxt: `${dom[0] < 0 ? '−π' : '0'} ≤ x ≤ ${dom[1] === 2 ? '2π' : 'π'}`,
    answerText: `x = ${sols.map(s => piStr(s.n, s.d)).join(', ')}`,
    valid(v){
      for (let i=0; i<v.length; i++) for (let j=i+1; j<v.length; j++)
        if (Math.abs(v[i]-v[j]) < 1e-9) return 'มีคำตอบซ้ำกัน — ค่า x ต้องต่างกันทุกช่อง';
      return null;
    },
    judge(v){
      let good = 0, out = 0, bad = 0;
      v.forEach(x => { if (x < dom[0]-1e-9 || x > dom[1]+1e-9) out++; else if (isSol(x)) good++; else bad++; });
      if (good === v.length) return { ok:true, notes:[] };
      const notes = [`ถูก ${good} จาก ${v.length} ค่า`];
      if (out) notes.push(`มี ${out} ค่าอยู่นอกช่วงที่กำหนด`);
      if (bad) notes.push(`มี ${bad} ค่าที่แทนแล้วไม่ตรงสมการ`);
      return { ok:false, notes };
    }
  };
}

/* ระดับ 2: f(a·x) = b */
function ghLevel2(){
  for (let guard=0; guard<300; guard++){
    const dom = pick(GH_DOMS), fn = pick(['sin','cos','tan','cosec','sec','cot']), a = pick([1,2,3]);
    const [bt, b0] = pick(ghB(fn)), sg = b0 === 0 ? 1 : pick([1,-1]), b = sg*b0, g = TF[fn];
    const bText = `${sg < 0 ? '−' : ''}${bt}`;
    const pz = ghPuzzle(2, dom, { fn: x => g(a*x), target:b, den:72, yFixed: (fn==='sin' || fn==='cos') ? null : [-4,4],
      eqText: `${a === 1 ? `${fn} x` : `${fn}(${a}x)`} = ${bText}`, curveLabel: `y = ${a === 1 ? `${fn} x` : `${fn} ${a}x`}`, targetText: `y = ${bText}` });
    if (pz) return pz;
  }
  return ghPuzzle(2, [0,2], { fn: x => Math.sin(x), target:.5, den:72, yFixed:null, eqText:'sin x = 1/2', curveLabel:'y = sin x', targetText:'y = 1/2' });
}

/* ระดับ 3: สมการกำลังสองของ sin / cos / tan */
function ghLevel3(){
  const mk = (A,B) => [A[1]*B[1], -(A[1]*B[0] + B[1]*A[0]), A[0]*B[0]];      // (n₁u − m₁)(n₂u − m₂) · A = [m,n] แทนราก m/n
  const poly = (p,q,r,fn) => {
    let t = `${p === 1 ? '' : p}${fn}²x`;
    if (q) t += ` ${q < 0 ? '−' : '+'} ${Math.abs(q) === 1 ? '' : Math.abs(q)}${fn} x`;
    if (r) t += ` ${r < 0 ? '−' : '+'} ${Math.abs(r)}`;
    return t;
  };
  for (let guard=0; guard<400; guard++){
    const dom = pick(GH_DOMS), fn = pick(['sin','cos','sin','cos','tan']), g = TF[fn];
    const rat = fn === 'tan' ? [[-1,1],[0,1],[1,1]] : [[-1,1],[-1,2],[0,1],[1,2],[1,1]];
    const mode = rnd(1,10);
    let c;
    if (mode <= 6){ const A = pick(rat), B = pick(rat); if (A[0]===B[0] && A[1]===B[1]) continue; c = mk(A,B); }
    else if (mode <= 8) c = fn === 'tan' ? pick([[1,0,-3],[3,0,-1],[1,0,-1]]) : pick([[2,0,-1],[4,0,-3],[4,0,-1],[1,0,-1]]);
    else if (fn !== 'tan') c = mk(pick(rat), pick([[2,1],[-2,1],[3,2],[-3,2]]));   // มีรากที่เป็นไปไม่ได้ (เกิน ±1)
    else continue;
    const [p,q,r] = c, lhs = poly(p,q,r,fn);
    const pz = ghPuzzle(3, dom, { fn: x => { const u = g(x); return p*u*u + q*u + r; }, target:0, den:12, yFixed: fn === 'tan' ? [-6,6] : null,
      eqText: `${lhs} = 0`, curveLabel: `y = ${lhs}`, targetText: 'y = 0' });
    if (pz) return pz;
  }
  return ghPuzzle(3, [0,2], { fn: x => { const u = Math.cos(x); return 2*u*u - 3*u + 1; }, target:0, den:12, yFixed:null,
    eqText:'2cos²x − 3cos x + 1 = 0', curveLabel:'y = 2cos²x − 3cos x + 1', targetText:'y = 0' });
}
function genGreenhouse(lvl){ return lvl >= 3 ? ghLevel3() : ghLevel2(); }

/* จุด 6: รั้วและถังน้ำ — อนุพันธ์ หาค่าสูงสุด */
function genFence(lvl){
  if (lvl === 1){
    const L = 4*rnd(4,10), ans = L/4, A = x => x*(L-2*x);
    return { type:'fence', kind:'wall3', L, ans, fields:1, neg:false, area:A,
      slopeName:'dA/dx', slope: x => L - 4*x,
      answerText:`x = ${ans} ม. (พื้นที่สูงสุด ${A(ans)} ตร.ม.)`,
      valid: v => v[0] <= 0 ? 'ค่าต้องมากกว่า 0' : null,
      judge(v){
        const x = v[0];
        if (2*x >= L) return { ok:false, notes:['รั้วไม่พอ ด้านขนานโรงนาเหลือไม่ถึงศูนย์'] };
        if (x === ans) return { ok:true, notes:[] };
        return { ok:false, notes:[`ได้พื้นที่ ${A(x)} ตร.ม. — ยังมีขนาดที่ให้พื้นที่มากกว่านี้`] };
      }
    };
  }
  if (lvl === 2){
    const m = rnd(1,4), S0 = 12*m*m, ax = 2*m, ah = m;
    const used = (x,h) => x*x + 4*x*h, vol = (x,h) => x*x*h;
    return { type:'fence', kind:'tank', S0, ax, ah, fields:2, neg:false, used, vol,
      slopeName:'dV/dx', slope: x => (S0 - 3*x*x)/4,
      answerText:`ฐาน x = ${ax} ม., สูง h = ${ah} ม. (จุได้ ${vol(ax,ah)} ลบ.ม.)`,
      valid: v => (v[0] <= 0 || v[1] <= 0) ? 'ค่าต้องมากกว่า 0' : null,
      judge(v){
        const [x,h] = v, u = used(x,h);
        if (u > S0) return { ok:false, notes:[`แผ่นโลหะไม่พอ ต้องใช้ ${u} แต่มี ${S0} ตร.ม.`] };
        if (x === ax && h === ah) return { ok:true, notes:[] };
        return { ok:false, notes:[`ใช้แผ่นโลหะ ${u}/${S0} ตร.ม. ได้ความจุ ${vol(x,h)} ลบ.ม. — ยังมีแบบที่จุได้มากกว่า`] };
      }
    };
  }
  // ระดับ 3: รั้วมีเส้นแบ่งกลาง และบางข้อที่ดินกว้างจำกัด (ค่าสูงสุดอยู่ที่ขอบ)
  const L = 6*rnd(3,8), peak = L/6;
  const cap = (peak > 1 && RNG() < .45) ? rnd(1, peak-1) : null;
  const ans = cap !== null ? cap : peak, A = x => x*(L-3*x);
  return { type:'fence', kind:'split', L, cap, ans, fields:1, neg:false, area:A,
    slopeName:'dA/dx', slope: x => L - 6*x,
    answerText:`x = ${ans} ม. (พื้นที่สูงสุด ${A(ans)} ตร.ม.)${cap!==null ? ' — ค่าสูงสุดอยู่ที่ขอบที่ดิน' : ''}`,
    valid: v => v[0] <= 0 ? 'ค่าต้องมากกว่า 0' : null,
    judge(v){
      const x = v[0];
      if (cap !== null && x > cap) return { ok:false, notes:[`ที่ดินกว้างได้ไม่เกิน ${cap} ม.`] };
      if (3*x >= L) return { ok:false, notes:['รั้วไม่พอ ด้านขนานโรงนาเหลือไม่ถึงศูนย์'] };
      if (x === ans) return { ok:true, notes:[] };
      return { ok:false, notes:[`ได้พื้นที่ ${A(x)} ตร.ม. — ยังมีขนาดที่ให้พื้นที่มากกว่านี้`] };
    }
  };
}

const GENS = { spr:genSprinkler, moi:genMoisture, mix:genMix, pipe:genPipe, gh:genGreenhouse, fence:genFence };

function newPuzzle(){
  const st = STATIONS[S.sel], H = window.PlantHost, fails = S.save.fails[S.sel] || 0;
  S.lvl = levelOf(S.sel);
  S.pz = null;
  for (let k=0; k<6 && !S.pz; k++){
    RNG = seedRng(`pz|${H.id()}|${H.today()}|${S.sel}|${fails}|${k}`);
    try { S.pz = GENS[st.id](S.lvl); } finally { RNG = Math.random; }
  }
  S.tries = Math.max(1, TRIES - (S.save.used[S.sel] || 0));
  S.field = 0; S.vals = Array(S.pz.fields).fill('');
  S.busy = false; S.done = false; S.ok = false; S.traces = []; S.reveal = false; S.anim = null; S.slopeAt = null;
}
function spend(){ S.tries--; S.save.used[S.sel] = TRIES - S.tries; writeSave(); updateWater(); }

/* ---------- แผงควบคุม ---------- */
function msg(text, cls){ const el = $('plMsg'); if (el){ el.textContent = text; el.className = 'pl-msg ' + (cls||'info'); } }

function helpHTML(pz){
  switch (pz.type){
    case 'spr': return 'ลำน้ำเป็นพาราโบลา <b>y = −a·x² + b·x</b><br>• ตัดแกน x ที่ x = 0 และ x = b/a<br>• ถ้าผ่านจุด (m, H) ต้องได้ H = −a·m² + b·m';
    case 'moi': return 'ความชื้นลดแบบเอกซ์โปเนนเชียล <b>M(t) = M₀ · r<sup>−t/h</sup></b><br>• r = ฐาน (เช่น 2 = ลดครึ่งหนึ่งทุก h ชม.)<br>• หาเวลา: t = h · log<sub>r</sub>(M₀ / L)';
    case 'mix': return 'ปุ๋ยที่ได้ = (ไหล A)·(สูตรถัง A) + (ไหล B)·(สูตรถัง B) + (ไหล C)·(สูตรถัง C)<br>• แยกเป็นสมการ N, P, K ได้ 3 สมการ 3 ตัวแปร (กำจัดตัวแปรหรือใช้เมทริกซ์)<br>• ถ้าถังหนึ่งเกิดจากถังอื่นรวมกัน (det = 0) อาจไม่มีคำตอบ';
    case 'pipe':
      if (pz.mode==='tar') return 'ปลายท่อ = ผลบวกเวกเตอร์ของทุกท่อน: <b>v₁ + v₂ (+ v₃) = เป้าหมาย</b><br>• ท่อนที่หายไป = เป้าหมาย − ท่อนที่เหลือ (ลบทีละองค์ประกอบ x, y, z)<br>• ขนาด |v| = √(a² + b² + c²)';
      if (pz.mode==='dir') return 'เวกเตอร์หนึ่งหน่วยในทิศของ w คือ <b>ŵ = w/|w|</b> เมื่อ |w| = √(a²+b²+c²)<br>• ท่อนที่ยาว L ทิศเดียวกับ w: <b>v = L·ŵ</b> · ทิศตรงข้ามให้ใช้ −L·ŵ<br>• ขนานกับ w ⇔ v = k·w';
      if (pz.mode==='perp') return 'เวกเตอร์ตั้งฉากกัน ⇔ ผลคูณเชิงสเกลาร์เป็นศูนย์: <b>a·b = a₁b₁ + a₂b₂ + a₃b₃ = 0</b><br>• แทนค่า k แล้วแก้สมการเชิงเส้น<br>• cos θ = (a·b)/(|a||b|) : a·b > 0 มุมแหลม, a·b < 0 มุมป้าน';
      return '<b>a × b = (a₂b₃ − a₃b₂, a₃b₁ − a₁b₃, a₁b₂ − a₂b₁)</b><br>• a × b ตั้งฉากกับทั้ง a และ b (ตรวจด้วย (a×b)·a = 0) · ทิศตามกฎมือขวา<br>• สลับลำดับเป็น b × a เครื่องหมายจะกลับ';
    case 'gh':
      if (pz.lvl === 3) return 'ให้ u = sin x (หรือ cos x, tan x) แล้วแก้สมการกำลังสองของ u โดยแยกตัวประกอบ<br>• sin x และ cos x ต้องอยู่ในช่วง −1 ≤ u ≤ 1 — รากที่เกินช่วงนี้ <b>ไม่มี x ที่เป็นไปได้</b> ให้ตัดทิ้ง<br>• แล้วแก้ sin x = u₁ และ sin x = u₂ ในช่วงที่กำหนด<br>• อย่าหารตลอดด้วย sin x / cos x เพราะคำตอบจะหายไป (เช่น ย้ายข้างแล้วแยกตัวประกอบแทน)';
      return '<b>sin x = sin α ⇒ x = α + 2kπ หรือ π − α + 2kπ</b> · <b>cos x = cos α ⇒ x = ±α + 2kπ</b> · <b>tan x = tan α ⇒ x = α + kπ</b><br>• cosec = 1/sin · sec = 1/cos · cot = 1/tan → กลับเป็น sin, cos, tan แล้วแก้<br>• f(ax) = b: หา ax ก่อน แล้วหารด้วย a — ช่วงของ ax กว้าง a เท่า (เช่น 0 ≤ x ≤ 2π, a = 2 ⇒ 0 ≤ 2x ≤ 4π)<br>• มุมพิเศษ: sin(π/6) = 1/2 · sin(π/4) = √2/2 · sin(π/3) = √3/2 · tan(π/6) = 1/√3 · tan(π/3) = √3';
    case 'fence':
      if (pz.kind==='wall3') return 'ตั้งฟังก์ชันพื้นที่ A(x) แล้วหา <b>A′(x) = 0</b><br>• ด้านขนานโรงนา y = L − 2x ⇒ A = x(L − 2x)<br>• สูงสุดเมื่อ A′ เปลี่ยนจากบวกเป็นลบ';
      if (pz.kind==='tank') return 'ใช้แผ่นโลหะ x² + 4xh = S ⇒ h = (S − x²)/(4x)<br>• ความจุ V(x) = x²h = x(S − x²)/4 แล้วหา <b>V′(x) = 0</b>';
      return 'รั้วทั้งหมด 3x + y = L ⇒ A(x) = x(L − 3x) แล้วหา <b>A′(x) = 0</b><br>• ถ้ามีข้อจำกัดของ x ให้ตรวจที่ขอบด้วย — บางครั้งความชันไม่เป็นศูนย์เลย';
  }
  return '';
}

function infoHTML(pz){
  const tr = (cells, cls) => `<tr${cls?` class="${cls}"`:''}>${cells.map(c=>`<td>${c}</td>`).join('')}</tr>`;
  if (pz.type === 'mix'){
    const names = ['A','B','C'];
    return `<table class="pl-tbl"><tr><th>ป้ายบนถัง</th><th>N</th><th>P</th><th>K</th></tr>`
      + pz.tanks.map((t,i) => tr([`ถัง ${names[i]}`, t[0], t[1], t[2]])).join('')
      + tr(['สูตรที่แปลงต้องการ', pz.target[0], pz.target[1], pz.target[2]], 'tg') + `</table>`;
  }
  if (pz.type === 'pipe'){
    const known = i => `ท่อนที่ ${i+1} = <b>${fmtV(pz.segs[i])}</b>`;
    const lines = [];
    if (pz.mode === 'tar'){
      pz.segs.forEach((sg,i) => lines.push(i===pz.unk ? `ท่อนที่ ${i+1} = <b>❓</b> (ต้องหา)` : known(i)));
      lines.push(`ปลายท่อต้องถึงถังที่ <b>${fmtV(pz.target)}</b>`);
    } else if (pz.mode === 'dir'){
      lines.push(known(0), known(1));
      lines.push(`ท่อนที่ 3 = <b>❓</b> ขนานกับ <b>w = ${fmtV(pz.w)}</b> ยาว <b>${pz.L}</b> ม. ไปทิศ<b>${pz.sgn>0 ? 'เดียวกับ' : 'ตรงข้ามกับ'}</b> w`);
    } else if (pz.mode === 'perp'){
      lines.push(known(0));
      lines.push(`ท่อนที่ 2 = <b>(${pz.segs[1].map((c,i) => i===pz.j ? 'k' : c).join(', ')})</b>`);
      lines.push('ท่อนที่ 2 ต้อง<b>ตั้งฉาก</b>กับท่อนที่ 1 — หาค่า k');
    } else {
      lines.push(known(0), known(1));
      lines.push('ท่อนที่ 3 = <b>❓</b> ตั้งฉากกับทั้งท่อนที่ 1 และ 2 · ใช้ผลคูณเชิงเวกเตอร์ <b>v₁ × v₂</b>');
    }
    return lines.join('<br>');
  }
  if (pz.type === 'gh') return pz.lvl === 3
    ? `⚙️ วาล์วสมดุลของเรือนกระจกทำงานเมื่อ <b>${pz.eqText}</b><br>หมุนมุม x (เรเดียน) ได้ในช่วง <b>${pz.domTxt}</b> · หาค่า x <b>ทุกค่า</b> ที่ทำให้สมการเป็นจริง (มี ${pz.sols.length} ค่า)`
    : `🎛️ พัดลมเรือนกระจกจะเดินเครื่องเมื่อสัญญาณ <b>${pz.eqText}</b><br>หมุนมุม x (เรเดียน) ได้ในช่วง <b>${pz.domTxt}</b> · หาค่า x <b>ทุกค่า</b> ที่ทำให้สมการเป็นจริง (มี ${pz.sols.length} ค่า)`;
  if (pz.type === 'fence'){
    if (pz.kind==='wall3') return `รั้วยาว <b>${pz.L}</b> ม. ล้อม 3 ด้านติดผนังโรงนา · x = ด้านที่ตั้งฉากโรงนา · ต้องการพื้นที่มากสุด`;
    if (pz.kind==='tank') return `แผ่นโลหะ <b>${pz.S0}</b> ตร.ม. ทำถังฐานสี่เหลี่ยมจัตุรัสไม่มีฝา (พื้น + 4 ด้าน) · ต้องการความจุมากสุด`;
    return `รั้วยาว <b>${pz.L}</b> ม. ล้อม 2 คอก (มีรั้วกั้นกลาง ตั้งฉากโรงนา) · x = ด้านตั้งฉากโรงนา`
      + (pz.cap!==null ? `<br>⚠️ ที่ดินกว้างได้ไม่เกิน <b>${pz.cap}</b> ม.` : '') + ` · ต้องการพื้นที่รวมมากสุด`;
  }
  return '';
}

function eqHTML(pz, st){
  const F = i => `<span class="pl-field" data-f="${i}" id="plF${i}"></span>`;
  switch (pz.type){
    case 'spr': return `<span>y = −</span>${F(0)}<span>x² +</span>${F(1)}<span>x</span>`;
    case 'moi': return `<span>ตั้งเวลารดน้ำ t =</span>${F(0)}<span>ชั่วโมง</span>`;
    case 'mix': return `<span>ถัง A</span>${F(0)}<span>ถัง B</span>${F(1)}<span>ถัง C</span>${F(2)}<span>ส่วน/นาที</span>`;
    case 'pipe':
      if (pz.mode==='perp'){
        const cm = i => i===pz.j ? F(0) : `<span>${pz.segs[1][i]}</span>`;
        return `<span>ท่อนที่ 2 = (</span>${cm(0)}<span>,</span>${cm(1)}<span>,</span>${cm(2)}<span>) → ค่า k</span>`;
      }
      return `<span>ท่อนที่ ${pz.unk+1}</span><span>(</span>${F(0)}<span>,</span>${F(1)}<span>,</span>${F(2)}<span>)</span>`;
    case 'gh': return `<span>x =</span>` + pz.sols.map((_,i) => `${F(i)}<span>π${i < pz.sols.length-1 ? ' ,' : ''}</span>`).join('');
    case 'fence': return pz.kind==='tank'
      ? `<span>ฐาน x =</span>${F(0)}<span>ม. สูง h =</span>${F(1)}<span>ม.</span>`
      : `<span>ความกว้าง x =</span>${F(0)}<span>ม.</span>`;
  }
  return '';
}

function startMsg(pz){
  switch (pz.type){
    case 'spr': return 'ตั้งค่า a และ b ให้น้ำผ่านห่วงและตกที่ต้นไม้';
    case 'moi': return 'หาเวลาที่ความชื้นลดลงถึงเส้นสีแดง แล้วตั้งเวลารดน้ำ';
    case 'mix': return 'หาอัตราไหลของวาล์วทั้ง 3 ให้ปุ๋ยที่ผสมได้ตรงสูตรของแปลง';
    case 'pipe':
      if (pz.mode==='dir') return 'หาเวกเตอร์ท่อนที่ 3 จากความยาวและทิศของ w (ใช้เวกเตอร์หนึ่งหน่วย) แล้วพิมพ์ค่า (a, b, c) — กด ± เพื่อใส่เครื่องหมายลบ';
      if (pz.mode==='perp') return 'หาค่า k ที่ทำให้ท่อนที่ 2 ตั้งฉากกับท่อนที่ 1 (ใช้ผลคูณเชิงสเกลาร์) — กด ± เพื่อใส่เครื่องหมายลบ';
      if (pz.mode==='cross') return 'หาท่อนที่ 3 ที่ตั้งฉากกับท่อนที่ 1 และ 2 ด้วยผลคูณเชิงเวกเตอร์ แล้วพิมพ์ค่า (a, b, c)';
      return 'หาเวกเตอร์ของท่อนที่หายไป แล้วพิมพ์ค่า (a, b, c) — กด ± เพื่อใส่เครื่องหมายลบ';
    case 'gh': return 'หาค่า x ทุกค่าในช่วงที่กำหนด แล้วพิมพ์เป็นพหุคูณของ π — กด ÷ เพื่อใส่เศษส่วน (เช่น 5 ÷ 6 = 5π/6) · กด ± ใส่เครื่องหมายลบ';
    case 'fence': return 'ใส่ขนาดแล้วดูแปลงงอกตามจริง — ตั้งฟังก์ชันและหาอนุพันธ์เพื่อหาค่าที่ดีที่สุด';
  }
  return '';
}

function spriteIcon(name){                                      // ภาพเครื่องจักรเล็ก ๆ ที่หัวแผ่นโจทย์ (ครอปด้วย CSS ไม่ใช้ canvas จึงไม่พังเมื่อเปิดจากไฟล์)
  try {
    const sh = SHEETS.find(x => x.rects[name]); if (!sh) return '';
    const [sx, sy, sw, sh2] = sh.rects[name], k = 38 / Math.max(sw, sh2);
    const ox = -sx*k + (40 - sw*k)/2, oy = -sy*k + (40 - sh2*k)/2;
    return `<span class="pl-ico" style="background:url('${sh.src}') no-repeat ${ox.toFixed(1)}px ${oy.toFixed(1)}px / ${(1536*k).toFixed(1)}px ${(1024*k).toFixed(1)}px"></span>`;
  } catch(e){ return ''; }
}
function renderPanel(){
  const p = $('plPanel');
  const st = STATIONS[S.sel], pz = S.pz;
  const keys = [7,8,9,4,5,6,1,2,3].map(n => `<button class="pl-key" data-k="${n}">${n}</button>`);
  keys.push('<button class="pl-key" data-k="back">⌫</button><button class="pl-key" data-k="0">0</button><button class="pl-key" data-k="clear">C</button>');
  if (pz.fields > 1 || pz.neg){
    keys.push(pz.neg ? '<button class="pl-key alt" data-k="sign">±</button>' : '<span></span>');
    keys.push(pz.fields > 1 ? '<button class="pl-key alt" data-k="next">⇄ ช่องถัดไป</button>' : '<span></span>');
    keys.push(pz.frac ? '<button class="pl-key alt" data-k="frac">÷ เศษส่วน</button>' : '<span></span>');
  }
  const extras = [];
  if (pz.type==='mix' && pz.hasNone) extras.push('<button class="pl-extra" id="plNone">🚫 ผสมไม่ได้</button>');
  if (pz.type==='fence') extras.push('<button class="pl-extra" id="plSlope">📈 ตรวจความชัน (−1 💧)</button>');
  p.innerHTML = `
    <div class="pl-grab"></div>
    <div class="pl-head">
      <div class="pl-id">${spriteIcon(st.id + '_bad') || `<span class="pl-ico">${st.icon}</span>`}<div><div class="pl-name">จุด ${S.sel+1}: ${st.name}</div><div class="pl-topic">${st.topic}</div></div></div>
      <div class="pl-headr"><div class="pl-water" id="plWater"></div><button class="pl-close" id="plClose" aria-label="ปิด">✕</button></div>
    </div>
    <div class="pl-lvls"><span class="pl-diff d${S.lvl}">${'⭐'.repeat(S.lvl)} ระดับ ${S.lvl}${S.lvl===3 ? ' (ยาก)' : (st.id==='gh' ? ' (กลาง)' : '')}</span>
      <span class="pl-badge">🔧 เครื่องขัดข้อง ซ่อมให้ได้เพื่อรับรางวัล</span></div>
    <canvas id="plGraph"></canvas>
    ${infoHTML(pz) ? `<div class="pl-info">${infoHTML(pz)}</div>` : ''}
    <details class="pl-help"><summary>📘 สูตรช่วยจำ</summary><div>${helpHTML(pz)}</div></details>
    <div class="pl-eq">${eqHTML(pz, st)}</div>
    <div class="pl-msg info" id="plMsg"></div>
    <div class="pl-keys">${keys.join('')}</div>
    ${extras.length ? `<div class="pl-extras">${extras.join('')}</div>` : ''}
    <div class="pl-actions"><button class="pl-run" id="plRun">▶ เดินเครื่อง</button><button class="pl-new" id="plNew" style="display:none">🔄 ลองโจทย์ใหม่</button></div>`;
  $('plSheet').classList.add('open');
  p.scrollTop = 0;
  updateFields(); updateWater();
  msg(startMsg(pz), 'info');
}

function updateFields(){
  for (let i=0;i<8;i++){
    const el = $('plF'+i); if (!el) continue;
    el.textContent = S.vals[i] === '' || S.vals[i] === undefined ? '?' : S.vals[i];
    el.classList.toggle('on', i === S.field);
  }
}
function updateWater(){
  const el = $('plWater'); if (!el) return;
  el.textContent = '💧'.repeat(Math.max(0,S.tries)) + '🥀'.repeat(TRIES - Math.max(0,S.tries));
}

function press(k){
  if (S.busy || S.done || !S.pz) return;
  const f = S.field, fr = !!S.pz.frac;
  let s = S.vals[f] === undefined ? '' : S.vals[f];
  if (k === 'back') s = s.slice(0,-1);
  else if (k === 'clear') s = '';
  else if (k === 'next'){ if (S.pz.fields > 1) S.field = (f+1) % S.pz.fields; updateFields(); return; }
  else if (k === 'sign'){ if (S.pz.neg) s = s.startsWith('-') ? s.slice(1) : '-' + s; }
  else if (k === 'frac'){ if (fr && /^-?\d+$/.test(s)) s += '/'; }
  else if (fr){                                                   // ช่องเศษส่วน (คูณ π): ตัวเศษ/ตัวส่วน ส่วนละไม่เกิน 2 หลัก
    const i = s.indexOf('/'), head = i < 0 ? '' : s.slice(0, i+1);
    let part = i < 0 ? s : s.slice(i+1);
    if (part.replace('-','').length < 2){
      if (part === '0') part = k;
      else if (part === '-' && k === '0') { /* ไม่รับ -0 */ }
      else part += k;
    }
    s = head + part;
  }
  else if (s.replace('-','').length < 3){
    if (s === '0') s = k;
    else if (s === '-' && k === '0') { /* ไม่รับ -0 */ }
    else s += k;
  }
  S.vals[f] = s;
  updateFields();
}

const parseFracPi = x => { const m = /^(-?\d+)(?:\/(\d+))?$/.exec(x || ''); if (!m) return NaN; const d = m[2] === undefined ? 1 : +m[2]; return d === 0 ? NaN : (+m[1]) / d; };
function parseVals(){
  if (S.pz && S.pz.frac) return S.vals.map(parseFracPi);          // ช่องเศษส่วน: ค่าเป็นจำนวนเท่าของ π
  return S.vals.map(x => (x === '' || x === '-' || x === undefined) ? NaN : parseInt(x,10));
}

function startRun(v, r){
  spend();
  S.busy = true; msg('⚙️ เครื่องกำลังทำงาน...', 'info');
  S.anim = { t0:performance.now(), dur:1400, v, ok:r.ok };
  setTimeout(() => finish(v, r), 1500);
}

function run(){
  if (S.busy || S.done || !S.pz) return;
  const v = parseVals();
  if (v.some(isNaN)){ msg('ใส่ค่าให้ครบก่อนนะ', 'bad'); return; }
  const err = S.pz.valid ? S.pz.valid(v) : (v.some(x => x <= 0) ? 'ค่าต้องมากกว่า 0' : null);
  if (err){ msg(err, 'bad'); return; }
  startRun(v, S.pz.judge(v));
}

function runNone(){
  if (S.busy || S.done || !S.pz || !S.pz.judgeNone) return;
  startRun([0,0,0], S.pz.judgeNone());
}

function slopeCheck(){
  if (S.busy || S.done || !S.pz || S.pz.type !== 'fence') return;
  const x = parseInt(S.vals[0], 10);
  if (isNaN(x) || x <= 0){ msg('ใส่ x ก่อน แล้วค่อยตรวจความชัน', 'bad'); return; }
  if (S.tries <= 1){ msg('น้ำเหลือน้อยเกินไป ตรวจความชันไม่ได้แล้ว', 'bad'); return; }
  spend();
  const sl = S.pz.slope(x), nm = S.pz.slopeName;
  S.slopeAt = { x, sl };
  const txt = Math.abs(sl) < 1e-9 ? 'ราบ = จุดสูงสุดตามสมการ ✔️' : (sl > 0 ? 'ยังเพิ่มขึ้น ↗ (ขยายต่อได้)' : 'เริ่มลดลง ↘ (เกินจุดดีที่สุดแล้ว)');
  msg(`📈 ที่ x = ${x}: ${nm} = ${Number.isInteger(sl) ? sl : sl.toFixed(2)}  ${txt}`, 'info');
}

function finish(v, r){
  if (!S.open) return;
  S.busy = false; S.anim = null; S.ok = r.ok;
  S.traces.push({ v, ok:r.ok, mix: S.pz.type==='mix' ? S.pz.mixOf(v) : null });
  const st = STATIONS[S.sel], H = window.PlantHost;
  const lock = () => { $('plRun').disabled = true; const nb = $('plNone'); if (nb) nb.disabled = true; const sb = $('plSlope'); if (sb) sb.disabled = true; };
  if (r.ok){
    S.done = true; S.flash = performance.now();
    const left = S.tries;
    const coin = 4 + 3*S.lvl + 2*left + st.bonus, xp = 3 + 2*S.lvl + left + Math.round(st.bonus/2);
    H.setQ(S.sel, H.today());          // บันทึก Qn = วันนี้ (ลง LastFed) แล้วค่อยให้รางวัล/เซฟ
    H.reward(coin, xp);
    S.save.used[S.sel] = 0; writeSave();
    S.reveal = true;
    msg(`✅ ซ่อมสำเร็จ! +${coin} 💰  +${xp} ⭐  (น้ำเหลือ ${left} หยด)`, 'good');
    const nb = $('plNew'); nb.textContent = '🌾 กลับไปแปลงผัก'; nb.style.display = ''; lock();
    refreshCoins(); updateFoot();
  } else if (S.tries <= 0){
    S.done = true; S.reveal = true;
    S.save.fails[S.sel] = (S.save.fails[S.sel] || 0) + 1; S.save.used[S.sel] = 0; writeSave();   // ครั้งหน้าได้โจทย์ใหม่
    msg(`❌ น้ำหมดแล้ว! ${r.notes.join(' / ')}\nเฉลย: ${S.pz.answerText}`, 'bad');
    const nb = $('plNew'); nb.textContent = '🔄 ลองโจทย์ใหม่'; nb.style.display = ''; lock();
  } else {
    msg('❌ ' + r.notes.join(' / '), 'bad');
  }
}

function refreshCoins(){ const el = $('plCoins'); if (el) el.textContent = window.PlantHost.coins(); }
function updateFoot(){
  const el = $('plFoot'); if (!el) return;
  const n = brokenCount();
  el.innerHTML = n ? `🔧 ต้องซ่อมอีก <b>${n}</b> จุด · แตะเครื่องที่มี <b>❗</b>` : '🌈 ทุกจุดทำงานดี! พรุ่งนี้มาตรวจแปลงอีกนะ';
  el.classList.toggle('ok', !n);
}

/* ---------- กราฟ / เซนเซอร์ (canvas ด้านล่าง) ---------- */
function niceStep(max, ticks){ const raw = max/ticks; return [1,2,5,10,20,50,100].find(s => s >= raw) || 100; }
function gctx(){
  const c = $('plGraph'); if (!c) return null;
  const dpr = window.devicePixelRatio || 1, w = c.clientWidth, h = c.clientHeight;
  if (!w || !h) return null;
  if (c.width !== Math.round(w*dpr) || c.height !== Math.round(h*dpr)){ c.width = Math.round(w*dpr); c.height = Math.round(h*dpr); }
  const g = c.getContext('2d'); g.setTransform(dpr,0,0,dpr,0,0); g.clearRect(0,0,w,h);
  return { g, w, h };
}
const pathPts = segs => segs.reduce((a,s) => { a.push(vadd(a[a.length-1], s)); return a; }, [[0,0,0]]);
const easeOut = p => 1 - Math.pow(1-p, 3);

function axes(g, w, h, o){
  const padL=34, padR=12, padT=12, padB=24;
  const X = x => padL + (x-o.xMin)/(o.xMax-o.xMin)*(w-padL-padR);
  const Y = y => h-padB - (y-o.yMin)/(o.yMax-o.yMin)*(h-padT-padB);
  g.font = '10px sans-serif'; g.strokeStyle = '#e1eedb'; g.lineWidth = 1; g.fillStyle = '#6b7f70';
  g.textAlign = 'center'; g.textBaseline = 'top';
  for (let x=Math.ceil(o.xMin/o.xs)*o.xs; x<=o.xMax+1e-9; x+=o.xs){ g.beginPath(); g.moveTo(X(x),padT); g.lineTo(X(x),h-padB); g.stroke(); g.fillText(x, X(x), h-padB+4); }
  g.textAlign = 'right'; g.textBaseline = 'middle';
  for (let y=Math.ceil(o.yMin/o.ys)*o.ys; y<=o.yMax+1e-9; y+=o.ys){ g.beginPath(); g.moveTo(padL,Y(y)); g.lineTo(w-padR,Y(y)); g.stroke(); g.fillText(y, padL-4, Y(y)); }
  g.strokeStyle = '#4a6b52'; g.lineWidth = 2;
  g.beginPath(); g.moveTo(padL,padT); g.lineTo(padL,h-padB); g.lineTo(w-padR,h-padB); g.stroke();
  g.textAlign = 'left'; g.textBaseline = 'alphabetic'; g.fillStyle = '#4a6b52'; g.font = '10px sans-serif';
  g.fillText(o.yl, padL+4, padT+8);
  g.textAlign = 'right'; g.fillText(o.xl, w-padR, h-padB-4);
  return { X, Y, padL, padR, padT, padB };
}

function drawGraph(now){
  const G = gctx(); if (!G || !S.pz) return;
  const { g, w, h } = G;
  ({ spr:drawSpr, moi:drawMoi, mix:drawMix, pipe:drawPipe, gh:drawGH, fence:drawFence })[S.pz.type](g, w, h, now);
}

/* จุด 1 */
function drawSpr(g, w, h, now){
  const pz = S.pz;
  const A = axes(g, w, h, { xMin:0, xMax:pz.xMax, yMin:0, yMax:pz.yMax, xs:niceStep(pz.xMax,10), ys:niceStep(pz.yMax,6), xl:'ระยะ x', yl:'ความสูง y' });
  const { X, Y } = A, xMax = pz.xMax;
  const jet = (a,b,p,color,dash,lw) => {
    const xEnd = Math.min(b/a, xMax) * p;
    g.strokeStyle = color; g.lineWidth = lw||3; g.setLineDash(dash||[]); g.beginPath();
    for (let i=0;i<=60;i++){ const x = xEnd*i/60, y = -a*x*x + b*x; const px = X(x), py = Y(y); i ? g.lineTo(px,py) : g.moveTo(px,py); }
    g.stroke(); g.setLineDash([]);
    return { x:xEnd, y:-a*xEnd*xEnd + b*xEnd };
  };
  g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '16px sans-serif';
  if (!drawSprite(g, 'spr_ok', X(0)+16, Y(0)+5, 30)) g.fillText('🚿', X(0)+2, Y(0)-10);
  if (pz.D !== null){
    if (!drawSprite(g, 'carrot_ok', X(pz.D), Y(0)+4, 22)) g.fillText('🌱', X(pz.D), Y(0)-10);
    g.font='10px sans-serif'; g.fillStyle='#2d5a3a'; g.textBaseline='top'; g.fillText('x = '+pz.D, X(pz.D), Y(0)-44);
  }
  pz.hoops.forEach(hp => {
    g.strokeStyle = '#f0a020'; g.lineWidth = 3; g.beginPath(); g.ellipse(X(hp.x), Y(hp.y), 5, 10, 0, 0, Math.PI*2); g.stroke();
    g.fillStyle = '#b87400'; g.font = 'bold 10px sans-serif'; g.textAlign='left'; g.textBaseline='bottom';
    g.fillText(`(${hp.x}, ${hp.y})`, X(hp.x)+8, Y(hp.y)-6);
  });
  S.traces.forEach(tr => jet(tr.v[0], tr.v[1], 1, tr.ok ? 'rgba(42,141,224,.55)' : 'rgba(224,90,74,.35)', [4,4], 2));
  if (S.reveal) jet(pz.a, pz.b, 1, '#2a9d55', [6,3], 3);
  if (S.anim){
    const p = clamp((now - S.anim.t0)/S.anim.dur, 0, 1);
    const tip = jet(S.anim.v[0], S.anim.v[1], p, S.anim.ok ? '#2a8de0' : '#e05a4a', [], 3);
    g.fillStyle = '#7cc7ff'; g.beginPath(); g.arc(X(tip.x), Y(tip.y), 4, 0, Math.PI*2); g.fill();
  }
}

/* จุด 2 */
function drawMoi(g, w, h, now){
  const pz = S.pz;
  const A = axes(g, w, h, { xMin:0, xMax:pz.tMax, yMin:0, yMax:pz.yMax, xs:niceStep(pz.tMax,10), ys:niceStep(pz.yMax,6), xl:'เวลา t (ชม.)', yl:'ความชื้น M (%)' });
  const { X, Y, padL, padR, padT, padB } = A;
  g.globalAlpha = .9; drawSprite(g, 'moi_ok', w-padR-20, h-padB-3, 30); g.globalAlpha = 1;   // เซนเซอร์เป็นฉากหลัง
  g.strokeStyle = '#e05a4a'; g.lineWidth = 2; g.setLineDash([6,4]);
  g.beginPath(); g.moveTo(padL, Y(pz.L)); g.lineTo(w-padR, Y(pz.L)); g.stroke(); g.setLineDash([]);
  g.fillStyle = '#c4493a'; g.font = 'bold 10px sans-serif'; g.textAlign = 'right'; g.textBaseline = 'bottom';
  g.fillText(`ต้องรดเมื่อความชื้น ≤ ${pz.L}%`, w-padR-2, Y(pz.L)-3);
  pz.readings.forEach(rd => {
    g.fillStyle = '#2a8de0'; g.beginPath(); g.arc(X(rd.t), Y(rd.m), 5, 0, Math.PI*2); g.fill();
    g.fillStyle = '#1d5fa0'; g.font = 'bold 10px sans-serif'; g.textAlign = 'left'; g.textBaseline = 'bottom';
    g.fillText(`t=${rd.t}, M=${rd.m}`, X(rd.t)+7, Y(rd.m)-4);
  });
  S.traces.forEach(tr => { g.strokeStyle='rgba(224,90,74,.45)'; g.lineWidth=2; g.setLineDash([3,3]); g.beginPath(); g.moveTo(X(tr.v[0]),padT); g.lineTo(X(tr.v[0]),h-padB); g.stroke(); g.setLineDash([]); });
  if (S.reveal){ g.strokeStyle='#2a9d55'; g.lineWidth=2; g.setLineDash([6,3]); g.beginPath(); g.moveTo(X(pz.ans),padT); g.lineTo(X(pz.ans),h-padB); g.stroke(); g.setLineDash([]); }
  if (S.anim){
    const p = clamp((now - S.anim.t0)/S.anim.dur, 0, 1), tEnd = S.anim.v[0]*p;
    g.strokeStyle = S.anim.ok ? '#2a8de0' : '#e05a4a'; g.lineWidth = 3; g.beginPath();
    for (let i=0;i<=80;i++){ const t = tEnd*i/80, y = pz.f(t); i ? g.lineTo(X(t),Y(y)) : g.moveTo(X(t),Y(y)); }
    g.stroke();
    g.fillStyle = '#7cc7ff'; g.beginPath(); g.arc(X(tEnd), Y(pz.f(tEnd)), 4, 0, Math.PI*2); g.fill();
  }
}

/* จุด 3: ถังผสมปุ๋ย */
function drawMix(g, w, h, now){
  const pz = S.pz, cols = ['#3b82f6','#f59e0b','#a855f7'], nm = ['N','P','K'], tn = ['A','B','C'];
  const last = S.traces.length ? S.traces[S.traces.length-1] : null;
  const vShow = S.anim ? S.anim.v : (last ? last.v : null);
  const p = S.anim ? easeOut(clamp((now - S.anim.t0)/S.anim.dur, 0, 1)) : 1;
  g.textAlign = 'center';
  if (SPRITES.mix_ok && SPRITES.mix_ok.sw){                    // ถัง 3 ใบจาก Farms.png
    drawSprite(g, 'mix_ok', 84, 150, 156);
    const fxs = [.17,.5,.83];
    for (let i=0;i<3;i++){
      const cx = 6 + fxs[i]*156;
      g.font = 'bold 10px sans-serif'; g.textBaseline = 'middle'; g.lineJoin = 'round'; g.lineWidth = 3; g.strokeStyle = 'rgba(25,40,55,.8)'; g.fillStyle = '#fff';
      const row = (t, yy) => { g.strokeText(t, cx, yy); g.fillText(t, cx, yy); };
      row('ถัง '+tn[i], 66);
      for (let j=0;j<3;j++) row(`${nm[j]} ${pz.tanks[i][j]}`, 79 + j*12);
      row(vShow ? `💧${vShow[i]}` : '💧?', 120);
    }
  } else {
  for (let i=0;i<3;i++){
    const x = 6 + i*52, y = 26, tw = 46, th = 76;
    g.fillStyle = '#2d5a3a'; g.font = 'bold 11px sans-serif'; g.textBaseline = 'alphabetic'; g.fillText('ถัง '+tn[i], x+tw/2, 18);
    g.fillStyle = '#eaf6ff'; g.strokeStyle = '#6b97b8'; g.lineWidth = 2;
    g.beginPath(); g.roundRect ? g.roundRect(x,y,tw,th,8) : g.rect(x,y,tw,th); g.fill(); g.stroke();
    g.fillStyle = 'rgba(120,190,240,.35)'; g.fillRect(x+2, y+th*.28, tw-4, th*.72-2);
    g.font = 'bold 10px sans-serif'; g.textBaseline = 'middle';
    for (let j=0;j<3;j++){ g.fillStyle = cols[j]; g.fillText(`${nm[j]} ${pz.tanks[i][j]}`, x+tw/2, y+16+j*19); }
    g.fillStyle = '#4a6b52'; g.font = '11px sans-serif';
    g.fillText(vShow ? `💧${vShow[i]}` : '💧?', x+tw/2, y+th+14);
  }
  }
  const bx = 172, bw = w - bx - 10;
  const mixNow = vShow ? pz.mixOf(vShow) : null;
  const mx = Math.max(10, Math.max(...pz.target)*1.35, mixNow ? Math.max(...mixNow)*1.05 : 0);
  for (let j=0;j<3;j++){
    const y = 22 + j*46;
    g.textAlign = 'left'; g.textBaseline = 'alphabetic'; g.font = 'bold 11px sans-serif'; g.fillStyle = cols[j];
    g.fillText(nm[j], bx, y+8);
    g.fillStyle = '#4a5a50'; g.font = '10px sans-serif'; g.textAlign = 'right';
    g.fillText(`${mixNow ? Math.round(mixNow[j]*p) : '?'} / เป้า ${pz.target[j]}`, bx+bw, y+8);
    g.fillStyle = '#e8f1e3'; g.fillRect(bx, y+13, bw, 14);
    if (mixNow){ g.fillStyle = cols[j]; g.fillRect(bx, y+13, clamp(mixNow[j]/mx,0,1)*bw*p, 14); }
    g.strokeStyle = '#2d4a37'; g.lineWidth = 2;
    const tx = bx + pz.target[j]/mx*bw; g.beginPath(); g.moveTo(tx,y+9); g.lineTo(tx,y+31); g.stroke();
  }
  if (S.reveal && pz.none){
    g.textAlign = 'center'; g.textBaseline = 'alphabetic'; g.font = 'bold 12px sans-serif'; g.fillStyle = '#c4493a';
    g.fillText('🚫 ถังพึ่งพากัน — ผสมให้ตรงสูตรไม่ได้', w/2, h-10);
  } else if (!mixNow){
    g.textAlign = 'center'; g.textBaseline = 'alphabetic'; g.font = '11px sans-serif'; g.fillStyle = '#7c8f82';
    g.fillText('กด “เดินเครื่อง” เพื่อดูว่าปุ๋ยที่ผสมได้ใกล้สูตรแค่ไหน', w/2, h-8);
  }
}

/* จุด 4: ท่อลำเลียงน้ำ (ไอโซเมตริก) */
function drawPipe(g, w, h, now){
  const pz = S.pz;
  const raw = S.anim ? S.anim.v : parseVals().map(x => isNaN(x) ? 0 : x);
  const cur = pz.fullSegs(raw), ans = pz.fullSegs(pz.ansV);
  const ptsNow = pathPts(cur), ptsAns = pathPts(ans);
  const all = ptsAns.concat(ptsNow).concat(pz.target ? [pz.target] : []);
  const x0 = Math.min(0, ...all.map(p=>p[0])) - 1, x1 = Math.max(0, ...all.map(p=>p[0])) + 1;
  const y0 = Math.min(0, ...all.map(p=>p[1])) - 1, y1 = Math.max(0, ...all.map(p=>p[1])) + 1;
  const pr = p => [(p[0]-p[1])*.866, (p[0]+p[1])*.5 - p[2]];
  const corners = [[x0,y0,0],[x1,y0,0],[x1,y1,0],[x0,y1,0]];
  const proj = all.concat(corners).map(pr);
  const mnx = Math.min(...proj.map(p=>p[0])), mxx = Math.max(...proj.map(p=>p[0]));
  const mny = Math.min(...proj.map(p=>p[1])), mxy = Math.max(...proj.map(p=>p[1]));
  const sc = Math.min((w-20)/(mxx-mnx||1), (h-24)/(mxy-mny||1), 30);
  const cx = w/2 - (mnx+mxx)/2*sc, cy = h/2 + 2 - (mny+mxy)/2*sc;
  const P = p => { const q = pr(p); return [cx+q[0]*sc, cy+q[1]*sc]; };
  const line = (a,b) => { const A = P(a), B = P(b); g.beginPath(); g.moveTo(A[0],A[1]); g.lineTo(B[0],B[1]); g.stroke(); };
  // พื้น
  g.fillStyle = '#e4f4d4'; g.strokeStyle = '#b9d9a4'; g.lineWidth = 1.5;
  g.beginPath(); corners.forEach((c,i) => { const q = P(c); i ? g.lineTo(q[0],q[1]) : g.moveTo(q[0],q[1]); }); g.closePath(); g.fill(); g.stroke();
  g.strokeStyle = 'rgba(120,170,100,.3)'; g.lineWidth = 1;
  if (x1-x0 <= 16 && y1-y0 <= 16){
    for (let x=Math.ceil(x0); x<=x1; x++) line([x,y0,0],[x,y1,0]);
    for (let y=Math.ceil(y0); y<=y1; y++) line([x0,y,0],[x1,y,0]);
  }
  // แกน
  const ax = [[[2,0,0],'x','#d9534f'],[[0,2,0],'y','#2f7dd1'],[[0,0,2],'z','#2a9d55']];
  g.font = 'bold 10px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineWidth = 2;
  ax.forEach(([e,n,c]) => { g.strokeStyle = c; g.fillStyle = c; line([0,0,0], e); const q = P([e[0]*1.18,e[1]*1.18,e[2]*1.18]); g.fillText(n, q[0], q[1]); });
  // เฉลย (ถ้าจบเกมแล้ว)
  const segCol = ['#3f8fe0','#26a69a','#8e6fd8'];
  const drawPath = (pts, dashUnk, alpha) => {
    for (let i=0;i<pts.length-1;i++){
      const unk = (i === pz.unk);
      g.globalAlpha = alpha; g.lineCap = 'round';
      g.strokeStyle = unk ? '#f0a020' : segCol[i%3]; g.lineWidth = 6; g.setLineDash(unk && dashUnk ? [7,5] : []);
      line(pts[i], pts[i+1]);
    }
    g.setLineDash([]); g.globalAlpha = 1;
  };
  // เส้นหย่อนลงพื้น
  g.strokeStyle = 'rgba(80,80,80,.25)'; g.lineWidth = 1; g.setLineDash([2,3]);
  ptsNow.forEach(p => { if (p[2] !== 0) line(p, [p[0],p[1],0]); });
  g.setLineDash([]);
  if (S.reveal && !S.traces.some(t => t.ok)){
    g.strokeStyle = '#2a9d55'; g.lineWidth = 4; g.setLineDash([4,5]); g.lineCap = 'round';
    const a = ptsAns; for (let i=pz.unk; i<=pz.unk; i++) line(a[i], a[i+1]); g.setLineDash([]);
  }
  drawPath(ptsNow, !S.anim, 1);
  // ป้ายเวกเตอร์
  g.font = '9px sans-serif'; g.fillStyle = '#2d4a37';
  ptsNow.slice(0,-1).forEach((p,i) => {
    if (i === pz.unk) return;
    const q = P([(p[0]+ptsNow[i+1][0])/2,(p[1]+ptsNow[i+1][1])/2,(p[2]+ptsNow[i+1][2])/2]);
    const t = fmtV(cur[i]), tw = g.measureText(t).width + 6;
    g.fillStyle = 'rgba(255,255,255,.85)'; g.fillRect(q[0]-tw/2, q[1]-14, tw, 12);
    g.fillStyle = '#2d4a37'; g.fillText(t, q[0], q[1]-8);
  });
  // มุมระหว่างท่อ (ผลคูณเชิงสเกลาร์) — แสดงหลังจากเดินเครื่องแล้วเท่านั้น
  if (pz.mode === 'perp'){
    const vv = S.anim ? S.anim.v : (S.traces.length ? S.traces[S.traces.length-1].v : null);
    if (vv){
      const sg = pz.fullSegs(vv), d = dot(sg[0], sg[1]), mm = vlen(sg[0])*vlen(sg[1]);
      const ang = mm ? Math.acos(clamp(d/mm, -1, 1))*180/Math.PI : 0;
      g.font = 'bold 10px sans-serif'; g.textAlign = 'left'; g.textBaseline = 'top';
      g.fillStyle = d === 0 ? '#2a9d55' : '#c4493a';
      g.fillText(`v₁·v₂ = ${d}   มุมระหว่างท่อ ≈ ${ang.toFixed(1)}°`, 8, 6);
    }
  }
  // ทิศ w
  if (pz.mode === 'dir'){
    const s0 = ptsNow[2], e = vadd(s0, pz.w);
    g.strokeStyle = '#d9534f'; g.lineWidth = 2; g.setLineDash([3,3]); line(s0, e); g.setLineDash([]);
    const q = P(e); g.fillStyle = '#d9534f'; g.font = 'bold 10px sans-serif'; g.fillText('w', q[0]+8, q[1]);
  }
  // เป้าหมาย / ปั๊ม
  g.font = '16px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  const o = P([0,0,0]); if (!drawSprite(g, 'pipe_ok', o[0], o[1]+5, 38)) g.fillText('🚰', o[0], o[1]-8);
  if (pz.target){
    const tq = P(pz.target); g.fillText('🎯', tq[0], tq[1]-6);
    g.font = 'bold 9px sans-serif'; g.fillStyle = '#b3261e'; g.fillText(fmtV(pz.target), tq[0], tq[1]+9);
  } else if (S.reveal){
    const tq = P(ptsAns[ptsAns.length-1]); g.fillText('🪣', tq[0], tq[1]-6);
  }
  // น้ำไหล
  if (S.anim){
    const p = clamp((now - S.anim.t0)/S.anim.dur, 0, 1);
    const sp = ptsNow.map(P); let tot = 0; const lens = [];
    for (let i=0;i<sp.length-1;i++){ const d = Math.hypot(sp[i+1][0]-sp[i][0], sp[i+1][1]-sp[i][1]); lens.push(d); tot += d; }
    let rem = tot*p, tip = sp[0];
    g.strokeStyle = S.anim.ok ? '#7cd0ff' : '#ff8a7a'; g.lineWidth = 3; g.lineCap = 'round';
    g.beginPath(); g.moveTo(sp[0][0], sp[0][1]);
    for (let i=0;i<lens.length;i++){
      if (rem >= lens[i]){ g.lineTo(sp[i+1][0], sp[i+1][1]); rem -= lens[i]; tip = sp[i+1]; }
      else { const f = rem/lens[i]; tip = [sp[i][0]+(sp[i+1][0]-sp[i][0])*f, sp[i][1]+(sp[i+1][1]-sp[i][1])*f]; g.lineTo(tip[0],tip[1]); break; }
    }
    g.stroke();
    g.fillStyle = '#fff'; g.beginPath(); g.arc(tip[0], tip[1], 3.5, 0, Math.PI*2); g.fill();
  }
}

/* จุด 5: เรือนกระจก — กราฟของสมการ จุดที่กราฟตัดเส้นเป้าหมาย = คำตอบ x */
function drawGH(g, w, h, now){
  const pz = S.pz, PI = Math.PI;
  const xMin = pz.lo*PI, xMax = pz.hi*PI, yMin = pz.yMin, yMax = pz.yMax;
  const padL = 34, padR = 12, padT = 12, padB = 24;
  const X = x => padL + (x - xMin)/(xMax - xMin)*(w-padL-padR);
  const Y = y => h-padB - (y - yMin)/(yMax - yMin)*(h-padT-padB);
  g.font = '10px sans-serif'; g.strokeStyle = '#e1eedb'; g.lineWidth = 1; g.fillStyle = '#6b7f70';
  g.textAlign = 'center'; g.textBaseline = 'top';
  for (let k=Math.ceil(pz.lo*2); k<=pz.hi*2; k++){ const x = k*PI/2; g.beginPath(); g.moveTo(X(x),padT); g.lineTo(X(x),h-padB); g.stroke(); g.fillText(piStr(k,2), X(x), h-padB+4); }
  const ys = [0.5,1,2,5,10].find(s => (yMax-yMin)/s <= 8) || 10;
  g.textAlign = 'right'; g.textBaseline = 'middle';
  for (let y=Math.ceil(yMin/ys)*ys; y<=yMax+1e-9; y+=ys){ g.beginPath(); g.moveTo(padL,Y(y)); g.lineTo(w-padR,Y(y)); g.stroke(); g.fillText(Number.isInteger(y) ? y : y.toFixed(1), padL-4, Y(y)); }
  g.strokeStyle = '#9aa5a0'; g.lineWidth = 1.5;
  if (yMin < 0 && yMax > 0){ g.beginPath(); g.moveTo(padL,Y(0)); g.lineTo(w-padR,Y(0)); g.stroke(); }
  if (pz.lo < 0){ g.beginPath(); g.moveTo(X(0),padT); g.lineTo(X(0),h-padB); g.stroke(); }
  g.strokeStyle = '#4a6b52'; g.lineWidth = 2;
  g.beginPath(); g.moveTo(padL,padT); g.lineTo(padL,h-padB); g.lineTo(w-padR,h-padB); g.stroke();
  g.textAlign = 'right'; g.textBaseline = 'alphabetic'; g.fillStyle = '#4a6b52'; g.fillText('x (เรเดียน)', w-padR, h-padB-4);
  g.globalAlpha = .88; drawSprite(g, 'gh_ok', w-padR-30, 58, 54); g.globalAlpha = 1;   // เรือนกระจกเป็นฉากหลัง

  g.save(); g.beginPath(); g.rect(padL, padT, w-padL-padR, h-padT-padB); g.clip();
  g.setLineDash([6,4]); g.lineWidth = 2; g.strokeStyle = '#2a9d55';
  g.beginPath(); g.moveTo(padL, Y(pz.target)); g.lineTo(w-padR, Y(pz.target)); g.stroke(); g.setLineDash([]);
  g.strokeStyle = '#e0662a'; g.lineWidth = 3; g.beginPath();
  let pen = false, py = 0;
  for (let i=0; i<=360; i++){                                    // ตัดเส้นที่แกว่งทะลุเส้นกำกับ (tan / cot / sec / cosec)
    const x = xMin + (xMax-xMin)*i/360, y = pz.fn(x);
    if (!isFinite(y) || y < yMin-1.5 || y > yMax+1.5 || (pen && Math.abs(y-py) > (yMax-yMin)*.7)){ pen = false; continue; }
    pen ? g.lineTo(X(x),Y(y)) : g.moveTo(X(x),Y(y)); pen = true; py = y;
  }
  g.stroke();
  g.restore();
  g.fillStyle = '#2a8a4a'; g.font = 'bold 10px sans-serif'; g.textAlign = 'right'; g.textBaseline = 'bottom';
  g.fillText(pz.targetText, w-padR-2, Y(pz.target)-3);

  const lastTr = S.traces.length ? S.traces[S.traces.length-1] : null;
  const marks = []; let sweep = null;
  if (S.anim){                                                   // เครื่องกวาดตามแกน x แล้วทำเครื่องหมายค่าที่ผู้เล่นตั้งไว้
    const p = clamp((now - S.anim.t0)/S.anim.dur, 0, 1); sweep = xMin + (xMax-xMin)*p;
    S.anim.v.forEach(v => { if (v*PI <= sweep) marks.push({ v, ok: pz.isSol(v) }); });
  } else if (lastTr) lastTr.v.forEach(v => marks.push({ v, ok: pz.isSol(v) }));
  if (sweep !== null){ g.strokeStyle = 'rgba(142,88,200,.55)'; g.lineWidth = 2; g.beginPath(); g.moveTo(X(sweep),padT); g.lineTo(X(sweep),h-padB); g.stroke(); }
  marks.forEach(m => {
    if (m.v < pz.lo-1e-9 || m.v > pz.hi+1e-9) return;
    g.fillStyle = m.ok ? '#2a9d55' : '#e03c3c'; g.strokeStyle = '#fff'; g.lineWidth = 2;
    g.beginPath(); g.arc(X(m.v*PI), Y(pz.target), 5, 0, Math.PI*2); g.fill(); g.stroke();
  });
  if (S.reveal){                                                 // เฉลย: วงกลมเขียวพร้อมค่า x ทุกจุด
    g.font = 'bold 10px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    pz.sols.forEach((s,i) => {
      const cx = X(s.v*PI), cy = Y(pz.target);
      g.strokeStyle = '#2a9d55'; g.fillStyle = '#fff'; g.lineWidth = 2.5;
      g.beginPath(); g.arc(cx, cy, 7, 0, Math.PI*2); g.fill(); g.stroke();
      g.fillStyle = '#1f7a41'; g.fillText(piStr(s.n, s.d), cx, cy + (i % 2 ? 17 : -15));
    });
  }
  g.textAlign = 'left'; g.textBaseline = 'alphabetic'; g.font = '10px sans-serif';
  const l1 = '━ ' + pz.curveLabel; g.fillStyle = '#e0662a'; g.fillText(l1, padL+8, 22);
  g.fillStyle = '#2a8a4a'; g.fillText('┅ ' + pz.targetText, padL+8+g.measureText(l1).width+14, 22);
}

/* จุด 6: รั้วและถังน้ำ */
function drawFence(g, w, h, now){
  const pz = S.pz, v = parseVals();
  const grow = S.anim ? easeOut(clamp((now - S.anim.t0)/S.anim.dur, 0, 1)) : 1;
  g.textAlign = 'center'; g.textBaseline = 'alphabetic';
  if (pz.kind === 'tank'){ drawTank(g, w, h, v, grow); return; }
  const L = pz.L, maxX = pz.kind==='wall3' ? L/2 : L/3;
  const sc = Math.min((w-28)/L, (h-56)/maxX), ox = (w - L*sc)/2, wy = 24;
  const k = pz.kind==='wall3' ? 2 : 3;
  g.fillStyle = '#b08968'; g.fillRect(ox-6, wy-16, L*sc+12, 16);
  g.fillStyle = '#fff'; g.font = 'bold 10px sans-serif'; g.fillText('🏚️ โรงนา (ผนัง)', w/2, wy-4);
  const plot = (x, fill, stroke, dash) => {
    const y = L - k*x; if (y <= 0 || x <= 0) return false;
    const rx = ox + (L*sc - y*sc)/2, rw = y*sc, rh = Math.min(x, maxX)*sc;
    g.fillStyle = fill; g.fillRect(rx, wy, rw, rh);
    if (fill !== 'transparent'){
      g.strokeStyle = 'rgba(60,130,50,.35)'; g.lineWidth = 1;
      for (let i=1;i<6;i++){ const yy = wy + rh*i/6; g.beginPath(); g.moveTo(rx,yy); g.lineTo(rx+rw,yy); g.stroke(); }
    }
    if (fill !== 'transparent' && SPRITES.cabbage_ok && SPRITES.cabbage_ok.sw){   // ผักงอกในแปลง จำนวนตามพื้นที่
      let nx = Math.max(1, Math.floor(rw/20)), ny = Math.max(1, Math.floor(rh/15)); while (nx*ny > 70){ if (nx > ny) nx--; else ny--; }
      const cw = Math.min(18, rw/nx*1.05);
      for (let j=0;j<ny;j++) for (let i=0;i<nx;i++) drawSprite(g, 'cabbage_ok', rx + (i+.5)*rw/nx, wy + (j+.95)*rh/ny, cw);
    }
    g.strokeStyle = stroke; g.lineWidth = 3; g.setLineDash(dash||[]); g.strokeRect(rx, wy, rw, rh);
    if (fill !== 'transparent' && SPRITES.fence_ok && SPRITES.fence_ok.sw){                // รั้วเล็กตามขอบล่าง
      const fw = 26, fn = Math.max(1, Math.round(rw/(fw*.85)));
      for (let i=0;i<fn;i++) drawSprite(g, 'fence_ok', rx + (i+.5)*rw/fn, wy + rh + 4, fw);
    }
    if (pz.kind==='split'){ g.beginPath(); g.moveTo(rx+rw/2, wy); g.lineTo(rx+rw/2, wy+rh); g.stroke(); }
    g.setLineDash([]);
    return { rx, rw, rh, y };
  };
  if (S.reveal) plot(pz.ans, 'transparent', '#2a9d55', [6,4]);
  const xv = isNaN(v[0]) ? 0 : v[0];
  const xs = xv * grow;
  const r = plot(xs, '#9be07a', '#7a5a2e');
  if (pz.cap !== null){
    g.strokeStyle = '#d9534f'; g.lineWidth = 2; g.setLineDash([5,4]);
    g.beginPath(); g.moveTo(ox, wy+pz.cap*sc); g.lineTo(ox+L*sc, wy+pz.cap*sc); g.stroke(); g.setLineDash([]);
    g.fillStyle = '#d9534f'; g.font = '10px sans-serif'; g.textAlign = 'right'; g.fillText(`ขอบที่ดิน x = ${pz.cap}`, ox+L*sc, wy+pz.cap*sc-3);
  }
  g.textAlign = 'center'; g.font = 'bold 11px sans-serif';
  if (r){
    g.fillStyle = '#2d4a37';
    g.fillText(`y = ${L - k*xv}`, w/2, wy + Math.min(r.rh, h-50) + 14);
    g.textAlign = 'left'; g.fillText(`x = ${xv}`, r.rx + r.rw + 4, wy + r.rh/2);
    g.textAlign = 'center'; g.fillStyle = '#1d6b3a'; g.font = 'bold 13px sans-serif';
    g.fillText(`พื้นที่ = ${xv*(L-k*xv)} ตร.ม.`, w/2, h-6);
  } else {
    g.fillStyle = '#7c8f82'; g.font = '12px sans-serif';
    g.fillText(xv > 0 ? '🚫 รั้วไม่พอสำหรับขนาดนี้' : 'พิมพ์ค่า x เพื่อดูแปลงงอกขึ้นมา', w/2, h/2+10);
  }
}

function drawTank(g, w, h, v, grow){
  const pz = S.pz;
  const xv = (isNaN(v[0]) ? 0 : v[0]) * grow, hv = (isNaN(v[1]) ? 0 : v[1]) * grow;
  const u = Math.min((w*.42)/(pz.ax*2.4), (h-52)/(pz.ax*.9 + pz.ah*2.4));
  const bx = w*.28, by = h-30;
  const cl = n => Math.min(n, pz.ax*2.2), ch = n => Math.min(n, pz.ah*2.4);
  const a = cl(xv), c = ch(hv);
  const P = (x,y,z) => [bx + (x-y)*u*.866, by + (x+y)*u*.5 - z*u - a*u*.5];
  const poly = (pts, fill, stroke) => {
    g.beginPath(); pts.forEach((p,i) => { const q = P(...p); i ? g.lineTo(q[0],q[1]) : g.moveTo(q[0],q[1]); }); g.closePath();
    g.fillStyle = fill; g.fill(); g.strokeStyle = stroke; g.lineWidth = 2; g.stroke();
  };
  if (a > 0 && c > 0){
    poly([[a,0,0],[a,a,0],[a,a,c],[a,0,c]], '#9aa5b1', '#5f6b76');
    poly([[0,a,0],[a,a,0],[a,a,c],[0,a,c]], '#b7c1cb', '#5f6b76');
    poly([[0,0,c],[a,0,c],[a,a,c],[0,a,c]], '#6fb3e0', '#5f6b76');
  } else {
    g.fillStyle = '#7c8f82'; g.font = '12px sans-serif'; g.textAlign = 'center';
    g.fillText('พิมพ์ x และ h เพื่อขึ้นรูปถัง', bx+10, h/2+10);
  }
  const used = pz.used(xv, hv), vol = pz.vol(xv, hv), tx = w*.56, bw = w - tx - 12;
  g.textAlign = 'left'; g.font = 'bold 11px sans-serif'; g.fillStyle = '#2d4a37';
  g.fillText(`ฐาน ${Math.round(xv*10)/10} × ${Math.round(xv*10)/10} ม.   สูง ${Math.round(hv*10)/10} ม.`, tx, 26);
  g.font = '10px sans-serif'; g.fillStyle = '#4a5a50'; g.fillText('แผ่นโลหะที่ใช้ x² + 4xh', tx, 52);
  g.fillStyle = '#e8f1e3'; g.fillRect(tx, 58, bw, 14);
  const mx = pz.S0*1.5; g.fillStyle = used > pz.S0 ? '#e05a4a' : '#4fae55'; g.fillRect(tx, 58, clamp(used/mx,0,1)*bw, 14);
  g.strokeStyle = '#2d4a37'; g.lineWidth = 2; const lx = tx + pz.S0/mx*bw; g.beginPath(); g.moveTo(lx,55); g.lineTo(lx,76); g.stroke();
  g.fillStyle = '#4a5a50'; g.fillText(`${Math.round(used*10)/10} / ${pz.S0} ตร.ม.`, tx, 90);
  g.font = 'bold 14px sans-serif'; g.fillStyle = '#1d6b3a';
  g.fillText(`ความจุ V = ${Math.round(vol*10)/10} ลบ.ม.`, tx, 118);
  if (used > pz.S0){ g.font = 'bold 11px sans-serif'; g.fillStyle = '#d9534f'; g.fillText('⚠️ แผ่นโลหะไม่พอ', tx, 138); }
  drawSprite(g, 'barrel', w-26, h-4, 32);
}

/* ---------- แปลง 2.5D สไตล์ diorama (ก้อนสวนลอยบนพื้นเขียวอ่อน) ---------- */
const COLS = 3, ROWS = 2, LIFT = 6, SIDE = 24;
const CS = [.34,.54,.74], RS = [.36,.68];                    // ตำแหน่งต้นผักในแปลง (พิกัดภายในช่อง)
const ANCH = { spr:[.14,.7], moi:[.86,.26], mix:[.2,.22], pipe:[.14,.72], gh:[.9,.46], fence:[.5,.92] };
const X0 = -.8, Y0 = -.8, X1 = COLS+.3, Y1 = ROWS+.3;        // ขอบฐาน (พิกัดช่อง) — ด้านหลังเผื่อที่ให้บ้านกับต้นไม้
const STONES = [[1,.5],[1,1.5],[2,.5],[2,1.5],[.5,1],[1.5,1],[2.5,1],[.5,2.12],[1.5,2.12],[2.5,2.12],[-.16,.5],[-.16,1.5]];

function isoGeom(){
  const c = $('plIso'), w = c.clientWidth, h = c.clientHeight;
  const tw = Math.min(140, (w-14)/3.6), th = tw/2;
  const oy = Math.max(190, h*.52 - 36);
  return { w, h, tw, th, ox: w/2 - tw*.25, oy };
}
function shade(hex, f){
  const n = parseInt(hex.slice(1),16);
  return `rgb(${Math.min(255,Math.round(((n>>16)&255)*f))},${Math.min(255,Math.round(((n>>8)&255)*f))},${Math.min(255,Math.round((n&255)*f))})`;
}
function rrect(g, x, y, w, h, r){ g.beginPath(); if (g.roundRect) g.roundRect(x,y,w,h,r); else g.rect(x,y,w,h); }

/* ผัก: stage 0 = เหี่ยว, 3 = โตเต็มที่ */
function drawPlantOld(g, x, y, stage, kind, s, sway){
  g.lineCap = 'round'; g.lineJoin = 'round';
  g.fillStyle = 'rgba(30,18,8,.28)'; g.beginPath(); g.ellipse(x, y+1, s*.38, s*.14, 0, 0, 7); g.fill();
  if (stage <= 0){
    g.strokeStyle = '#8c7a42'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(x,y); g.quadraticCurveTo(x+s*.05, y-s*.36, x+s*.34, y-s*.2); g.stroke();
    g.beginPath(); g.moveTo(x,y); g.quadraticCurveTo(x-s*.05, y-s*.3, x-s*.3, y-s*.1); g.stroke();
    g.fillStyle = '#b8a24e'; g.beginPath(); g.ellipse(x+s*.36, y-s*.17, s*.13, s*.06, .6, 0, 7); g.fill();
    g.fillStyle = '#9c8a45'; g.beginPath(); g.ellipse(x-s*.32, y-s*.08, s*.11, s*.05, -.5, 0, 7); g.fill();
    return;
  }
  const sx = x + sway;
  if (kind === 'carrot'){
    g.fillStyle = '#f08a24'; g.beginPath(); g.moveTo(x-s*.2,y); g.quadraticCurveTo(x, y-s*.12, x+s*.2, y); g.quadraticCurveTo(x, y+s*.1, x-s*.2, y); g.fill();
    g.strokeStyle = '#3f9a4a'; g.lineWidth = 2.2;
    for (let i=0;i<5;i++){
      const a = (i-2)*.42, ex = sx + Math.sin(a)*s*.75, ey = y - Math.cos(a)*s*.8;
      g.beginPath(); g.moveTo(x, y-s*.04); g.quadraticCurveTo(x+Math.sin(a)*s*.2, y-s*.5, ex, ey); g.stroke();
      g.fillStyle = i%2 ? '#56b85c' : '#3f9a4a'; g.beginPath(); g.ellipse(ex, ey, s*.09, s*.06, a, 0, 7); g.fill();
    }
  } else if (kind === 'tomato'){
    g.strokeStyle = '#a07a4a'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x+s*.28,y); g.lineTo(x+s*.28,y-s*.95); g.stroke();
    g.strokeStyle = '#3f9a4a'; g.lineWidth = 2.6; g.beginPath(); g.moveTo(x,y); g.quadraticCurveTo(sx+s*.1, y-s*.4, sx, y-s*.85); g.stroke();
    g.fillStyle = '#4fae55';
    [[-.26,.55,-.5],[.26,.68,.5],[-.2,.82,-.3]].forEach(([ox,oy,r]) => { g.beginPath(); g.ellipse(sx+ox*s, y-oy*s, s*.2, s*.1, r, 0, 7); g.fill(); });
    [[-.2,.32,.17],[.18,.46,.15],[-.02,.2,.13]].forEach(([ox,oy,r]) => {
      g.fillStyle = '#e0432f'; g.beginPath(); g.arc(sx+ox*s, y-oy*s, s*r, 0, 7); g.fill();
      g.fillStyle = 'rgba(255,255,255,.55)'; g.beginPath(); g.arc(sx+ox*s-s*r*.3, y-oy*s-s*r*.3, s*r*.28, 0, 7); g.fill();
      g.fillStyle = '#2f8a3a'; g.beginPath(); g.arc(sx+ox*s, y-oy*s-s*r*.9, s*.05, 0, 7); g.fill();
    });
  } else {
    const r = s*.52;
    g.fillStyle = '#3f9a4a'; g.beginPath(); g.ellipse(sx, y-r*.55, r*1.1, r*.7, 0, 0, 7); g.fill();
    g.fillStyle = '#62bd5a'; g.beginPath(); g.ellipse(sx, y-r*.7, r*.85, r*.62, 0, 0, 7); g.fill();
    g.fillStyle = '#8fd57e'; g.beginPath(); g.ellipse(sx, y-r*.85, r*.5, r*.4, 0, 0, 7); g.fill();
    g.strokeStyle = 'rgba(40,110,50,.5)'; g.lineWidth = 1;
    g.beginPath(); g.moveTo(sx, y-r*.2); g.lineTo(sx, y-r*1.1); g.stroke();
    g.beginPath(); g.arc(sx, y-r*.8, r*.62, .3, 2.8); g.stroke();
  }
}

/* เครื่องจักร: (x,y) = จุดวางบนพื้น, k = สเกล, broken = เสีย */
function drawMachineSprite(g, id, x, y, k, now, broken){
  const r = SPRITES[id + (broken ? '_bad' : '_ok')]; if (!r) return false;
  const tw = k * 124.2, w = MACH_W[id] * tw, h = w * r.cv.height / r.cv.width;
  g.save(); g.translate(x, y);
  g.fillStyle = 'rgba(30,18,8,.18)'; g.beginPath(); g.ellipse(0, -1, w*.42, w*.1, 0, 0, 7); g.fill();
  g.drawImage(r.cv, -w/2, -h*.97, w, h);
  const P = (fx, fy) => [-w/2 + fx*w, -h*.97 + fy*h];
  if (id === 'moi'){                                          // ตัวอักษรบนหน้าจอเซนเซอร์ (ภาพเว้นจอว่างไว้)
    const c = P(broken ? .54 : .44, broken ? .30 : .29), on = Math.floor(now/(broken ? 350 : 800)) % 2;
    g.fillStyle = broken ? '#ff7a6a' : '#7dffa8'; g.font = 'bold ' + Math.max(7, w*.2) + 'px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.save(); if (broken) g.rotate(.18); g.fillText(broken ? 'ERR' : 'OK', c[0], c[1]); g.restore();
    g.fillStyle = broken ? (on ? '#ff5a4a' : '#7a2a24') : (on ? '#53e07b' : '#2a8a4a');
    g.beginPath(); g.arc(c[0] + w*.2, c[1] - w*.2, Math.max(1.6, w*.035), 0, 7); g.fill();
  } else if (id === 'gh'){                                     // พัดลมหมุนในเรือนกระจก (ภาพไม่มีพัดลม)
    const c = P(.5, .55), L = w*.07, a = broken ? .6 : now/110;
    g.strokeStyle = '#e0662a'; g.lineWidth = Math.max(1.5, w*.012); g.lineCap = 'round';
    g.beginPath(); g.moveTo(c[0]+Math.cos(a)*L, c[1]+Math.sin(a)*L*.5); g.lineTo(c[0]-Math.cos(a)*L, c[1]-Math.sin(a)*L*.5); g.stroke();
  } else if (id === 'spr' && !broken){                         // น้ำพ่นจากหัวสปริงเกลอร์
    const c = P(.5, .16); g.fillStyle = 'rgba(110,190,255,.85)';
    for (let j=0;j<10;j++){ const ph = (now/900 + j/10) % 1, d = j%2 ? 1 : -1, px = c[0] + d*(w*.2 + ph*w*1.0), py = c[1] - w*.3*ph + w*1.3*ph*ph;
      g.globalAlpha = 1 - ph*.7; g.beginPath(); g.arc(px, py, Math.max(1.2, w*.03), 0, 7); g.fill(); }
    g.globalAlpha = 1;
  } else if (id === 'pipe'){                                   // หยดน้ำ: ปกติที่ปลายท่อ / เสียที่รอยแตก
    const c = broken ? P(.52,.12) : P(.93,.3);
    g.fillStyle = 'rgba(110,190,255,.9)';
    for (let j=0;j<2;j++){ const ph = (now/(broken ? 450 : 700) + j*.5) % 1; g.globalAlpha = 1-ph*.6; g.beginPath(); g.ellipse(c[0], c[1] + ph*w*.25, 1.5, 2.6, 0, 0, 7); g.fill(); }
    g.globalAlpha = 1;
  }
  if (broken){                                                // ควัน + ประกายไฟ ที่จุดเสีย
    const f = MACH_FX[id] || [.5,.2], c = P(f[0], f[1]);
    for (let j=0;j<3;j++){ const ph = (now/1500 + j/3) % 1;
      g.fillStyle = `rgba(80,80,80,${.45*(1-ph)})`; g.beginPath(); g.arc(c[0] + Math.sin(now/400+j*2)*3, c[1] - 4 - ph*24, 3 + ph*6, 0, 7); g.fill(); }
    if (Math.floor(now/160) % 3 === 0){ g.strokeStyle = '#ffd23f'; g.lineWidth = 1.6;
      for (let j=0;j<4;j++){ const a = j*1.7 + Math.floor(now/160); g.beginPath(); g.moveTo(c[0]+Math.cos(a)*3, c[1]+Math.sin(a)*3); g.lineTo(c[0]+Math.cos(a)*8, c[1]+Math.sin(a)*8); g.stroke(); } }
  }
  g.restore(); return true;
}
function drawMachine(g, id, x, y, k, now, broken){
  if (drawMachineSprite(g, id, x, y, k, now, broken)) return;
  g.save(); g.translate(x, y); g.scale(k, k); g.lineCap = 'round'; g.lineJoin = 'round';
  g.fillStyle = 'rgba(30,18,8,.25)'; g.beginPath(); g.ellipse(0, 1, 13, 4, 0, 0, 7); g.fill();
  let sx = 0, sy = -24;                                       // จุดที่ควัน/ประกายออก
  if (id === 'spr'){
    g.fillStyle = '#5b6670'; g.fillRect(-6, -3, 12, 4);
    g.fillStyle = '#8a929c'; g.fillRect(-2, -22, 4, 20);
    g.fillStyle = '#c9d0d8'; g.beginPath(); g.arc(0, -23, 6, 0, 7); g.fill();
    g.fillStyle = '#e8edf2'; g.beginPath(); g.arc(-1.5, -24.5, 2.2, 0, 7); g.fill();
    if (!broken){
      g.fillStyle = 'rgba(110,190,255,.85)';
      for (let j=0;j<10;j++){ const ph = (now/900 + j/10) % 1, d = j%2 ? 1 : -1, px = d*(4 + ph*26), py = -23 - 15*ph + 34*ph*ph;
        g.globalAlpha = 1 - ph*.7; g.beginPath(); g.arc(px, py, 1.7, 0, 7); g.fill(); }
      g.globalAlpha = 1;
    } else { g.fillStyle = 'rgba(110,190,255,.9)'; g.beginPath(); g.ellipse(7, -14 + ((now/500)%1)*10, 1.4, 2.2, 0, 0, 7); g.fill(); }
  } else if (id === 'moi'){
    g.fillStyle = '#8a929c'; g.fillRect(-2, -16, 4, 16);
    g.fillStyle = '#2e3d47'; rrect(g, -12, -34, 24, 19, 4); g.fill();
    g.fillStyle = broken ? '#3b2b2b' : '#1f6f50'; rrect(g, -9.5, -31.5, 19, 9, 2); g.fill();
    g.fillStyle = '#fff'; g.font = 'bold 7px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(broken ? 'ERR' : 'OK', 0, -27);
    const on = Math.floor(now/(broken ? 350 : 800)) % 2;
    g.fillStyle = broken ? (on ? '#ff5a4a' : '#7a2a24') : (on ? '#53e07b' : '#2a8a4a'); g.beginPath(); g.arc(0, -19, 2.4, 0, 7); g.fill();
    sy = -34;
  } else if (id === 'mix'){
    ['#3b82f6','#f59e0b','#a855f7'].forEach((c,i) => {
      const bx = -17 + i*17, by = -(i===1 ? 3 : 0);
      g.fillStyle = '#dfe7ee'; rrect(g, bx-7, by-24, 14, 24, 3); g.fill();
      g.fillStyle = c; g.fillRect(bx-7, by-15, 14, 15);
      g.strokeStyle = '#6b7885'; g.lineWidth = 1.2; rrect(g, bx-7, by-24, 14, 24, 3); g.stroke();
      if (!broken){ const ph = (now/1000 + i*.33) % 1; g.fillStyle = 'rgba(255,255,255,.7)'; g.beginPath(); g.arc(bx + Math.sin(now/300+i)*2, by-3-ph*11, 1.5, 0, 7); g.fill(); }
    });
    g.strokeStyle = '#7d8b97'; g.lineWidth = 3; g.beginPath(); g.moveTo(-17,-24); g.lineTo(-17,-30); g.lineTo(17,-30); g.lineTo(17,-24); g.stroke();
    sy = -30;
  } else if (id === 'pipe'){
    g.fillStyle = '#c0504a'; rrect(g, -22, -16, 15, 16, 3); g.fill();
    g.fillStyle = '#e8d4c8'; g.fillRect(-19, -13, 9, 4);
    g.strokeStyle = '#7d8b97'; g.lineWidth = 5; g.beginPath(); g.moveTo(-7,-8); g.lineTo(12,-8); g.lineTo(12,2); g.stroke();
    g.fillStyle = '#a8b4bf'; g.beginPath(); g.arc(12, 3, 3.5, 0, 7); g.fill();
    if (!broken){ g.strokeStyle = '#8fd8ff'; g.lineWidth = 2; g.setLineDash([3,5]); g.lineDashOffset = -now/60;
      g.beginPath(); g.moveTo(-7,-8); g.lineTo(12,-8); g.lineTo(12,2); g.stroke(); g.setLineDash([]); }
    else { g.strokeStyle = '#2e3d47'; g.lineWidth = 2; g.beginPath(); g.moveTo(2,-12); g.lineTo(4,-8); g.lineTo(1,-5); g.stroke();
      g.fillStyle = 'rgba(110,190,255,.9)'; g.beginPath(); g.ellipse(3, -4 + ((now/450)%1)*8, 1.3, 2, 0, 0, 7); g.fill(); }
    sx = -14; sy = -16;
  } else if (id === 'gh'){
    const gw = 38, gh = 24;
    g.fillStyle = 'rgba(190,235,255,.6)'; g.strokeStyle = '#6fa8c6'; g.lineWidth = 1.6;
    g.fillRect(-gw/2, -gh, gw, gh); g.strokeRect(-gw/2, -gh, gw, gh);
    g.beginPath(); g.moveTo(-gw/2-3, -gh); g.lineTo(0, -gh-14); g.lineTo(gw/2+3, -gh); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = 'rgba(80,170,90,.8)'; [-10,0,10].forEach(px => { g.beginPath(); g.ellipse(px, -5, 4, 5, 0, 0, 7); g.fill(); });
    const fan = broken ? .6 : now/110; g.strokeStyle = '#e0662a'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(Math.cos(fan)*6, -gh*.55+Math.sin(fan)*6); g.lineTo(-Math.cos(fan)*6, -gh*.55-Math.sin(fan)*6); g.stroke();
    if (broken){ g.strokeStyle = 'rgba(60,90,110,.8)'; g.lineWidth = 1.3; g.beginPath(); g.moveTo(8,-gh); g.lineTo(5,-gh*.6); g.lineTo(10,-gh*.3); g.stroke(); }
    sy = -gh-14;
  }
  if (broken){                                                // ควัน + ประกายไฟ
    for (let j=0;j<3;j++){ const ph = (now/1500 + j/3) % 1;
      g.fillStyle = `rgba(80,80,80,${.45*(1-ph)})`; g.beginPath(); g.arc(sx + Math.sin(now/400+j*2)*3, sy - 4 - ph*24, 3 + ph*6, 0, 7); g.fill(); }
    if (Math.floor(now/160) % 3 === 0){ g.strokeStyle = '#ffd23f'; g.lineWidth = 1.6;
      for (let j=0;j<4;j++){ const a = j*1.7 + Math.floor(now/160); g.beginPath(); g.moveTo(sx+Math.cos(a)*3, sy+Math.sin(a)*3); g.lineTo(sx+Math.cos(a)*8, sy+Math.sin(a)*8); g.stroke(); } }
  }
  g.restore();
}


/* ---------- ชิ้นส่วนประกอบฉาก (sprite) ----------
   ทุกชิ้นมี SVG ฝังไว้เป็นค่าเริ่มต้น  แต่ถ้ามีไฟล์ Plant/<ชื่อ>.png จะใช้ไฟล์นั้นแทนอัตโนมัติ
   ชื่อชิ้น: tree house barrel bush flowers  carrot_ok carrot_bad tomato_ok tomato_bad cabbage_ok cabbage_bad
   (PNG พื้นหลังโปร่งใส จุดวางคือกึ่งกลางขอบล่างของภาพ) */
const SPRITES = {}, USE_PNG_OVERRIDE = true;
const svgDoc = (w,h,defs,inner) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs>${defs}</defs>${inner}</svg>`;
const rGrad = (id,a,b,cx,cy) => `<radialGradient id="${id}" cx="${cx||38}%" cy="${cy||30}%" r="78%"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></radialGradient>`;
const lGrad = (id,a,b,x2,y2) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2||1}" y2="${y2||0}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
const SOFT = 'stroke="rgba(30,80,35,.28)" stroke-width="1"';
const ell = (x,y,rx,ry,rot,fill) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(${rot} ${x} ${y})" fill="${fill}" ${SOFT}/>`;
const cir = (x,y,r,fill) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${SOFT}/>`;
const plg = (pts,fill,extra) => `<polygon points="${pts.map(p=>p.join(',')).join(' ')}" fill="${fill}" ${extra||''}/>`;

function svgTree(){
  const defs = rGrad('f1','#d2f08e','#58a342') + rGrad('f2','#a6da6c','#3c8433') + lGrad('tk','#a8754a','#5a3720');
  let s = `<ellipse cx="100" cy="247" rx="58" ry="11" fill="rgba(30,60,25,.22)"/>`
    + `<path d="M82 250 Q92 214 90 168 L113 168 Q110 214 120 250 Q101 244 82 250Z" fill="url(#tk)" stroke="rgba(60,30,10,.35)"/>`
    + `<path d="M98 250 Q99 214 99 176" stroke="rgba(60,30,10,.3)" stroke-width="2" fill="none"/>`;
  [[100,112,58],[56,128,40],[146,126,42],[100,158,38],[72,78,36],[130,80,36],[100,56,32]].forEach(([x,y,r]) => { s += cir(x,y,r,'url(#f2)'); });
  [[96,100,46],[62,118,30],[142,116,32],[100,148,26],[72,70,26],[128,72,26],[100,48,22],[82,56,14],[124,100,14]].forEach(([x,y,r]) => { s += `<circle cx="${x-r*.18}" cy="${y-r*.2}" r="${r}" fill="url(#f1)" opacity=".92"/>`; });
  return svgDoc(200,260,defs,s);
}
function svgHouse(){
  const defs = lGrad('rf','#c9744a','#a4512f',0,1) + lGrad('rb','#a85a38','#7e3f25',0,1);
  const L=[20,150], F=[110,195], R=[200,150], Lh=[20,90], Fh=[110,135], Rh=[200,90], Bh=[110,45], A1=[65,22.5], A2=[155,67.5];
  const fp = (o,u,v,a,b) => [Math.round(o[0]+u[0]*a+v[0]*b), Math.round(o[1]+u[1]*a+v[1]*b)];
  const lf = (a0,a1,b0,b1) => [fp(L,[90,45],[0,-60],a0,b0),fp(L,[90,45],[0,-60],a1,b0),fp(L,[90,45],[0,-60],a1,b1),fp(L,[90,45],[0,-60],a0,b1)];
  const rt = (a0,a1,b0,b1) => [fp(F,[90,-45],[0,-60],a0,b0),fp(F,[90,-45],[0,-60],a1,b0),fp(F,[90,-45],[0,-60],a1,b1),fp(F,[90,-45],[0,-60],a0,b1)];
  const lerp = (p,q,t) => [p[0]+(q[0]-p[0])*t, p[1]+(q[1]-p[1])*t];
  let s = `<ellipse cx="112" cy="196" rx="96" ry="22" fill="rgba(30,60,25,.2)"/>`;
  s += plg([L,F,Fh,Lh],'#f7eed8','stroke="rgba(120,90,50,.35)"');
  s += plg([F,R,Rh,A2,Fh],'#dccaa4','stroke="rgba(120,90,50,.35)"');
  s += plg(rt(.3,.58,0,.68),'#7a4a2a','stroke="#4a2a14" stroke-width="1.5"') + plg(rt(.33,.55,.04,.64),'#94603a');
  const kn = fp(F,[90,-45],[0,-60],.5,.3); s += `<circle cx="${kn[0]}" cy="${kn[1]}" r="1.8" fill="#f1d27a"/>`;
  s += plg(lf(.26,.64,.34,.8),'#8a5a3a','stroke="#5a3418" stroke-width="1.2"') + plg(lf(.31,.59,.4,.75),'#bfe3ee');
  s += plg(lf(.22,.68,.8,.9),'#c0453a','stroke="#7a2a22" stroke-width="1"');
  s += plg([Bh,Rh,A2,A1],'url(#rb)','stroke="#5a2a14" stroke-width="1.2"');
  s += plg([Lh,Fh,A2,A1],'url(#rf)','stroke="#5a2a14" stroke-width="1.4"');
  for (let k=1;k<6;k++){ const t=k/6, a=lerp(Lh,A1,t), b=lerp(Fh,A2,t);
    s += `<path d="M${a[0]} ${a[1]} L${b[0]} ${b[1]}" stroke="rgba(70,28,12,.45)" stroke-width="1.3"/>`;
    for (let j=0;j<8;j++){ const m=lerp(a,b,(j+.5)/8); s += `<path d="M${m[0]} ${m[1]} q4 5 8 2" stroke="rgba(70,28,12,.3)" fill="none" stroke-width="1"/>`; } }
  s += `<path d="M${Lh[0]} ${Lh[1]} L${Fh[0]} ${Fh[1]} L${A2[0]} ${A2[1]}" stroke="rgba(255,235,200,.55)" stroke-width="2" fill="none"/>`;
  s += plg([[98,52],[120,63],[120,38],[98,28]],'#e8dcc8','stroke="#9a8a6a"') + plg([[95,30],[123,41],[123,34],[95,23]],'#f4ede0','stroke="#9a8a6a"');
  return svgDoc(220,215,defs,s);
}
function svgBarrel(){
  const defs = lGrad('bw','#d9a866','#a56d32');
  return svgDoc(60,72,defs,
    `<ellipse cx="30" cy="66" rx="24" ry="6" fill="rgba(30,60,25,.22)"/>`
    + `<path d="M8 20 Q2 44 8 62 Q30 70 52 62 Q58 44 52 20Z" fill="url(#bw)" stroke="#6b4220"/>`
    + `<path d="M5 30 Q30 38 55 30 M4 50 Q30 58 56 50" stroke="#6b4220" stroke-width="3" fill="none"/>`
    + `<ellipse cx="30" cy="20" rx="22" ry="8" fill="#f3d9a0" stroke="#6b4220"/><ellipse cx="30" cy="20" rx="14" ry="4.5" fill="#bfe3ee" opacity=".8"/>`);
}
function svgBush(){
  const defs = rGrad('b1','#b6e47c','#4a9a3c');
  let s = `<ellipse cx="50" cy="62" rx="42" ry="8" fill="rgba(30,60,25,.2)"/>`;
  [[30,46,22],[66,46,22],[48,34,26],[48,52,20]].forEach(([x,y,r]) => { s += cir(x,y,r,'url(#b1)'); });
  [[26,38],[60,28],[72,44],[40,50],[52,40]].forEach(([x,y],i) => { s += `<circle cx="${x}" cy="${y}" r="4" fill="${['#ff7aa8','#ffd23f','#fff'][i%3]}"/><circle cx="${x}" cy="${y}" r="1.6" fill="#ffb300"/>`; });
  return svgDoc(100,70,defs,s);
}
function svgFlowers(){
  let s = `<ellipse cx="50" cy="44" rx="40" ry="6" fill="rgba(30,60,25,.18)"/>`;
  [[14,20,'#ff7aa8'],[30,12,'#ffd23f'],[48,22,'#ffffff'],[66,10,'#b58cff'],[82,22,'#ff9f5a'],[40,6,'#ff7aa8']].forEach(([x,y,c]) => {
    s += `<path d="M${x} 44 Q${x+2} ${(44+y)/2} ${x} ${y}" stroke="#3f9a4a" stroke-width="2" fill="none"/><ellipse cx="${x-4}" cy="38" rx="5" ry="2.4" fill="#58b552" transform="rotate(-25 ${x-4} 38)"/>`;
    for (let j=0;j<5;j++){ const a = j*1.2566; s += `<circle cx="${x+Math.cos(a)*4.2}" cy="${y+Math.sin(a)*4.2}" r="3.2" fill="${c}"/>`; }
    s += `<circle cx="${x}" cy="${y}" r="2.4" fill="#ffb300"/>`; });
  return svgDoc(96,48,'',s);
}
function svgVeg(kind, ok){
  const defs = rGrad('g1','#c4ec92','#4c9d44') + rGrad('g2','#e45a44','#b82a1e',35,28) + rGrad('g3','#a6de78','#3e8c3a') + rGrad('gw','#cfc27a','#8d7f3a');
  let s = `<ellipse cx="50" cy="98" rx="24" ry="5" fill="rgba(30,18,8,.28)"/>`;
  if (kind === 'cabbage'){
    if (ok){
      [[-60,34],[-20,38],[20,38],[60,34],[100,34],[-100,34]].forEach(([a,r],i) => { const x=50+Math.cos((a-90)*Math.PI/180)*r*.6, y=84+Math.sin((a-90)*Math.PI/180)*r*.22; s += ell(x,y,24,12,a/3,'url(#g3)'); });
      s += ell(50,80,28,19,0,'url(#g1)') + ell(50,74,19,14,0,'url(#g1)') + `<path d="M50 90 L50 64 M50 78 Q40 72 36 66 M50 78 Q60 72 64 66" stroke="rgba(40,110,50,.5)" stroke-width="1.4" fill="none"/>`;
    } else { [[-40],[0],[40]].forEach(([a]) => { s += ell(50+a*.9,92,22,7,a/2,'url(#gw)'); }); s += ell(50,88,12,6,0,'#b8a24e'); }
  } else if (kind === 'carrot'){
    if (ok){
      s += `<path d="M36 98 Q50 86 64 98Z" fill="#f08a24" stroke="rgba(140,70,10,.5)"/>`;
      [[-30,66],[-14,58],[0,52],[14,58],[30,66]].forEach(([dx,ey],i) => { const ex=50+dx, ey2=ey+(i%2?4:0);
        s += `<path d="M50 94 Q${50+dx*.2} ${(94+ey2)/2} ${ex} ${ey2}" stroke="#3f9a4a" stroke-width="3" fill="none" stroke-linecap="round"/>`
          + ell(ex,ey2-4,5,10,dx*1.5,'url(#g3)') + ell(50+dx*.55,(94+ey2)/2,6,3.4,dx*2,'url(#g1)'); });
    } else { [[-26,84],[26,86]].forEach(([dx,ey]) => { s += `<path d="M50 96 Q${50+dx*.3} 78 ${50+dx} ${ey}" stroke="#8c7a42" stroke-width="2.5" fill="none" stroke-linecap="round"/>` + ell(50+dx+Math.sign(dx)*3,ey+2,7,3,dx*2,'url(#gw)'); }); }
  } else {
    if (ok){
      s += `<path d="M70 98 L70 22" stroke="#a07a4a" stroke-width="2.4" stroke-linecap="round"/><path d="M50 98 Q46 60 58 26" stroke="#3f9a4a" stroke-width="3.4" fill="none" stroke-linecap="round"/>`;
      [[34,62,-30],[68,50,25],[40,36,-20],[64,30,20]].forEach(([x,y,r]) => { s += ell(x,y,14,6.5,r,'url(#g3)'); });
      [[38,82,11],[62,70,10],[48,56,8.5]].forEach(([x,y,r]) => { s += `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#g2)" stroke="rgba(120,20,10,.4)"/><circle cx="${x-r*.35}" cy="${y-r*.35}" r="${r*.3}" fill="rgba(255,255,255,.6)"/><path d="M${x-4} ${y-r+1} l4 -3 l4 3" stroke="#2f8a3a" stroke-width="2" fill="none"/>`; });
    } else { s += `<path d="M50 98 Q50 64 78 74" stroke="#8c7a42" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M50 98 Q42 70 24 80" stroke="#8c7a42" stroke-width="2.4" fill="none" stroke-linecap="round"/>` + ell(80,80,8,3.4,40,'url(#gw)') + ell(22,86,7,3,-30,'url(#gw)') + `<circle cx="64" cy="84" r="5" fill="#9b5a3a"/>`; }
  }
  return svgDoc(100,104,defs,s);
}
function loadSprite(name, svg){
  const rec = SPRITES[name] = { cv:null };
  if (typeof Image === 'undefined') return;
  const done = im => { const k = 2, cw = Math.round((im.naturalWidth||im.width)*(im.naturalWidth ? 1 : 1)*k), ch = Math.round(cw*(im.naturalHeight||im.height)/(im.naturalWidth||im.width));
    const cv = document.createElement('canvas'); cv.width = cw; cv.height = ch; cv.getContext('2d').drawImage(im, 0, 0, cw, ch); rec.cv = cv; };
  const useSvg = () => { const im = new Image(); im.onload = () => done(im); im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); };
  if (USE_PNG_OVERRIDE){ const im = new Image(); im.onload = () => done(im); im.onerror = useSvg; im.src = 'Plant/' + name + '.png'; }
  else useSvg();
}
function initSprites(){
  if (SPRITES.tree) return;
  loadSprite('tree', svgTree()); loadSprite('house', svgHouse()); loadSprite('barrel', svgBarrel());
  loadSprite('bush', svgBush()); loadSprite('flowers', svgFlowers());
  ['carrot','tomato','cabbage'].forEach(k => { loadSprite(k+'_ok', svgVeg(k,true)); loadSprite(k+'_bad', svgVeg(k,false)); });
  loadSheet();
}
/* ---------- Garden.png: สไปรต์ชีตวางไว้ข้าง plant.js — ครอปชิ้นส่วนด้วยพิกัดตรงนี้ ----------
   [x, y, w, h] ในภาพ 1536x1024 (ปรับตัวเลขได้ถ้าตัดไม่พอดี) / maxW = ความกว้างสูงสุดที่ย่อเก็บไว้ (px) */
const SHEETS = [
  { src:'Garden.png', rects:{
    tree:        [372,  85, 280, 374, 280],
    house:       [ 21, 117, 366, 373, 340],
    barrel:      [1292, 187, 221, 277, 160],
    flowers:     [ 953, 206, 293, 253, 240],
    bush:        [ 644, 219, 286, 248, 240],
    cabbage_ok:  [  23, 605, 257, 287, 140],
    cabbage_bad: [ 286, 642, 224, 239, 140],
    carrot_ok:   [ 518, 539, 222, 351, 140],
    carrot_bad:  [ 748, 652, 187, 243, 140],
    tomato_ok:   [ 993, 526, 251, 387, 140],
    tomato_bad:  [1285, 553, 204, 363, 140] } },
  { src:'Farms.png', rects:{                                   // เครื่องจักร 6 จุด (ปกติ/เสีย) + ของตกแต่ง
    spr_ok:  [ 105,  54, 162, 231, 150],  spr_bad:  [ 449,  61, 195, 225, 150],
    pipe_ok: [ 814,  41, 290, 269, 220],  pipe_bad: [1192,  45, 295, 263, 220],
    moi_ok:  [ 114, 320, 160, 245, 150],  moi_bad:  [ 468, 331, 165, 234, 150],
    gh_ok:   [ 791, 307, 286, 284, 230],  gh_bad:   [1174, 308, 284, 287, 230],
    mix_ok:  [  46, 580, 310, 250, 240],  mix_bad:  [ 410, 583, 305, 247, 240],
    fence_ok:[ 788, 612, 275, 208, 220],  fence_bad:[1170, 619, 274, 190, 220],
    bed_ok:  [  25, 810, 260, 192, 240],  bed_bad:  [ 285, 810, 255, 190, 240],
    sign:    [ 571, 851, 106, 131, 100],  grass:    [ 699, 862, 139, 128, 120],
    pebbles: [ 872, 879, 120,  98, 100],  bird:     [1170, 851, 147, 130, 110],
    can:     [1334, 856, 178, 132, 140] } }
];
/* ความกว้างบนจอ (เทียบกับ tw) ของเครื่องจักรแต่ละจุด — ปรับขนาดที่นี่ */
const MACH_W = { spr:.26, moi:.22, mix:.42, pipe:.38, gh:.40, fence:.42 };
const BED_W = .84;                                              // ความกว้างแปลงดินสไปรต์ (เทียบ tw)
/* จุดที่ควัน/ประกายออกของเครื่องที่เสีย [สัดส่วนกว้าง, สัดส่วนสูง] ของสไปรต์ */
const MACH_FX = { spr:[.77,.12], moi:[.54,.12], mix:[.71,.17], pipe:[.52,.06], gh:[.52,.05], fence:[.5,.3] };
function dropStray(cg, W, H){                                   // ลบกลุ่มพิกเซลเล็ก ๆ ที่แยกจากตัวภาพหลัก (เศษจากชิ้นอื่น)
  try {
    const im = cg.getImageData(0, 0, W, H), d = im.data, seen = new Uint8Array(W*H), comps = [];
    for (let i0=0;i0<W*H;i0++){
      if (seen[i0] || d[i0*4+3] < 24) continue;
      const st = [i0], cells = []; seen[i0] = 1;
      while (st.length){ const i = st.pop(); cells.push(i); const x = i % W, y = (i - x) / W;
        for (let dy=-1;dy<=1;dy++) for (let dx=-1;dx<=1;dx++){ const nx = x+dx, ny = y+dy; if (nx<0||ny<0||nx>=W||ny>=H) continue;
          const j = ny*W+nx; if (!seen[j] && d[j*4+3] >= 24){ seen[j] = 1; st.push(j); } } }
      comps.push(cells);
    }
    const big = comps.reduce((m,c) => Math.max(m, c.length), 0);
    comps.forEach(c => { if (c.length < big*.06) c.forEach(i => { d[i*4+3] = 0; }); });
    cg.putImageData(im, 0, 0);
  } catch(e){}                                                  // เปิดจาก file:// แล้วอ่านพิกเซลไม่ได้ → ข้ามไป
}
function loadSheet(){
  if (typeof Image === 'undefined') return;
  SHEETS.forEach(sh => {
    const im = new Image();
    im.onload = () => {
      Object.keys(sh.rects).forEach(name => {
        const [sx, sy, sw, sh2, maxW] = sh.rects[name], k = Math.min(1, maxW / sw);
        const cv = document.createElement('canvas'); cv.width = Math.round(sw*k); cv.height = Math.round(sh2*k);
        const cg = cv.getContext('2d'); cg.imageSmoothingEnabled = true; cg.imageSmoothingQuality = 'high';
        cg.drawImage(im, sx, sy, sw, sh2, 0, 0, cv.width, cv.height);
        dropStray(cg, cv.width, cv.height);                       // ตัดเศษของชิ้นข้างเคียงที่ติดมาตามขอบครอป
        SPRITES[name] = { cv, sw };
      });
    };
    im.src = sh.src;                                            // โหลดไม่ได้ → ใช้แบบวาดด้วยโค้ดเดิมต่อไป
  });
}
function drawSprite(g, name, x, y, w, rot){
  const r = SPRITES[name]; if (!r || !r.cv) return false;
  const h = w * r.cv.height / r.cv.width;
  g.save(); g.translate(x, y); if (rot) g.rotate(rot); g.drawImage(r.cv, -w/2, -h*.97, w, h); g.restore();
  return true;
}
function drawPlant(g, x, y, stage, kind, s, sway){
  const nm = kind + (stage > 0 ? '_ok' : '_bad'), okR = SPRITES[kind + '_ok'], badR = SPRITES[kind + '_bad'];
  let w = s*3.1;
  if (okR && okR.sw){                                          // สไปรต์จาก Garden.png: ปรับขนาดต่อชนิดผัก และให้ต้นเหี่ยวเล็กตามจริง
    w *= ({cabbage:.98, carrot:.74, tomato:.74})[kind] || 1;
    if (stage <= 0 && badR && badR.sw) w *= badR.sw / okR.sw;
  }
  if (drawSprite(g, nm, x, y + 1, w, sway*.018)) return;
  drawPlantOld(g, x, y, stage, kind, s, sway);
}

/* ---------- พื้นหลังเรียบ + ก้อนฐานสวน ---------- */
function drawBG(g, G){
  const gr = g.createLinearGradient(0,0,0,G.h); gr.addColorStop(0,'#dff3d6'); gr.addColorStop(1,'#bde4b6');
  g.fillStyle = gr; g.fillRect(0,0,G.w,G.h);
  const v = g.createRadialGradient(G.w/2, G.h*.46, 20, G.w/2, G.h*.46, Math.max(G.w,G.h)*.7);
  v.addColorStop(0,'rgba(255,255,255,.55)'); v.addColorStop(1,'rgba(255,255,255,0)');
  g.fillStyle = v; g.fillRect(0,0,G.w,G.h);
}
function drawButterflies(g, G, now){
  [['#ff8fb8',0],['#ffd54f',2.4]].forEach(([c,o]) => {
    const t = now/1000 + o, x = G.w*(.5 + .4*Math.sin(t*.35+o)), y = G.h*(.5 + .16*Math.sin(t*.5+o*2)) + Math.sin(t*6)*3, f = Math.abs(Math.sin(t*9))*5+1;
    g.fillStyle = c; g.beginPath(); g.ellipse(x-3, y, f, 4, -.5, 0, 7); g.fill(); g.beginPath(); g.ellipse(x+3, y, f, 4, .5, 0, 7); g.fill();
    g.fillStyle = '#5a3a22'; g.fillRect(x-.7, y-3, 1.4, 6);
  });
}

function drawIso(now){
  const c = $('plIso'); if (!c) return;
  const dpr = window.devicePixelRatio || 1, G = isoGeom();
  if (!G.w || !G.h) return;
  if (c.width !== Math.round(G.w*dpr) || c.height !== Math.round(G.h*dpr)){ c.width = Math.round(G.w*dpr); c.height = Math.round(G.h*dpr); }
  const g = c.getContext('2d'); g.setTransform(dpr,0,0,dpr,0,0); g.clearRect(0,0,G.w,G.h);
  drawBG(g, G);
  const Pg = (cc, rr, z) => [G.ox + (cc-rr)*G.tw/2, G.oy + (cc+rr)*G.th/2 - (z||0)];
  const poly = (pts, fill, stroke, lw) => {
    g.beginPath(); pts.forEach((p,i) => i ? g.lineTo(p[0],p[1]) : g.moveTo(p[0],p[1])); g.closePath();
    if (fill){ g.fillStyle = fill; g.fill(); } if (stroke){ g.strokeStyle = stroke; g.lineWidth = lw||1; g.stroke(); }
  };
  const prism = (c0,r0,c1,r1,z0,z1,top,left,right,stroke) => {
    poly([Pg(c0,r1,z0),Pg(c1,r1,z0),Pg(c1,r1,z1),Pg(c0,r1,z1)], left);
    poly([Pg(c1,r1,z0),Pg(c1,r0,z0),Pg(c1,r0,z1),Pg(c1,r1,z1)], right);
    poly([Pg(c0,r0,z1),Pg(c1,r0,z1),Pg(c1,r1,z1),Pg(c0,r1,z1)], top, stroke, 1.2);
  };
  // เงาใต้ก้อนสวน
  const sc = Pg((X0+X1)/2, (Y0+Y1)/2, -SIDE);
  g.save(); g.translate(sc[0], sc[1]+8); g.scale(1, .42);
  const sh = g.createRadialGradient(0,0,10,0,0,G.tw*2.5); sh.addColorStop(0,'rgba(60,110,55,.4)'); sh.addColorStop(1,'rgba(60,110,55,0)');
  g.fillStyle = sh; g.beginPath(); g.arc(0,0,G.tw*2.5,0,7); g.fill(); g.restore();

  // ด้านข้างดิน: แผ่นไม้/ดินเรียงเป็นแท่งยาวไม่เท่ากัน
  const planks = (A, B, base, seed) => {
    const R = seedRng(seed), len = Math.hypot(B[0]-A[0], B[1]-A[1]), n = Math.max(6, Math.round(len/8));
    g.fillStyle = shade(base, .55); g.beginPath(); g.moveTo(A[0],A[1]); g.lineTo(B[0],B[1]); g.lineTo(B[0],B[1]+SIDE); g.lineTo(A[0],A[1]+SIDE); g.closePath(); g.fill();
    for (let k=0;k<n;k++){
      const t0 = k/n, t1 = (k+.92)/n, x0 = A[0]+(B[0]-A[0])*t0, y0 = A[1]+(B[1]-A[1])*t0, x1 = A[0]+(B[0]-A[0])*t1, y1 = A[1]+(B[1]-A[1])*t1, d = SIDE*(.78+R()*.22);
      g.fillStyle = shade(base, .74+R()*.34);
      g.beginPath(); g.moveTo(x0,y0); g.lineTo(x1,y1); g.lineTo(x1,y1+d-2); g.quadraticCurveTo((x0+x1)/2,y1+d+1,x0,y0+d-2); g.closePath(); g.fill();
    }
  };
  planks(Pg(X0,Y1,0), Pg(X1,Y1,0), '#935f34', 'sideL');
  planks(Pg(X1,Y1,0), Pg(X1,Y0,0), '#a86f3d', 'sideR');
  // พื้นหญ้า
  poly([Pg(X0,Y0,0),Pg(X1,Y0,0),Pg(X1,Y1,0),Pg(X0,Y1,0)], '#8fd15f');
  const lawn = g.createLinearGradient(0, Pg(X0,Y0,0)[1], 0, Pg(X1,Y1,0)[1]); lawn.addColorStop(0,'rgba(255,255,200,.18)'); lawn.addColorStop(1,'rgba(40,120,40,.12)');
  poly([Pg(X0,Y0,0),Pg(X1,Y0,0),Pg(X1,Y1,0),Pg(X0,Y1,0)], lawn);
  const TR = seedRng('tufts'); g.lineCap = 'round';
  for (let k=0;k<110;k++){ const cc = X0+TR()*(X1-X0), rr = Y0+TR()*(Y1-Y0), p = Pg(cc,rr,0), light = TR()>.5;
    g.strokeStyle = light ? 'rgba(200,240,130,.8)' : 'rgba(80,160,60,.55)'; g.lineWidth = 1.5;
    g.beginPath(); g.moveTo(p[0]-3,p[1]); g.lineTo(p[0]-2,p[1]-5); g.moveTo(p[0],p[1]); g.lineTo(p[0],p[1]-6); g.moveTo(p[0]+3,p[1]); g.lineTo(p[0]+2,p[1]-5); g.stroke(); }
  // ขอบหญ้าฟู ๆ ตามขอบหน้า
  const fringe = (A, B, seed) => {
    const R = seedRng(seed), len = Math.hypot(B[0]-A[0], B[1]-A[1]), n = Math.round(len/5);
    for (let k=0;k<=n;k++){ const t = k/n, x = A[0]+(B[0]-A[0])*t, y = A[1]+(B[1]-A[1])*t + 1 + R()*4, r = 3 + R()*3.2;
      g.fillStyle = R()>.5 ? '#6db84a' : '#8fd05d'; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
  };
  fringe(Pg(X0,Y1,0), Pg(X1,Y1,0), 'fL'); fringe(Pg(X1,Y1,0), Pg(X1,Y0,0), 'fR');
  // หินปูทาง
  STONES.forEach(([cc,rr],k) => { const p = Pg(cc,rr,0), s = 1 + (k%3)*.12;
    g.fillStyle = 'rgba(90,70,40,.25)'; g.beginPath(); g.ellipse(p[0], p[1]+2, G.tw*.085*s, G.th*.085*s, 0, 0, 7); g.fill();
    g.fillStyle = '#f1e6c6'; g.beginPath(); g.ellipse(p[0], p[1], G.tw*.085*s, G.th*.085*s, 0, 0, 7); g.fill();
    g.strokeStyle = '#d3c59c'; g.lineWidth = 1; g.stroke(); });
  // ของตกแต่งด้านหลัง (บ้าน ต้นไม้ พุ่มไม้)
  const hp = Pg(-.2,-.2,0); drawSprite(g, 'house', hp[0], hp[1]+G.th*.34, G.tw*1.22);
  const bp = Pg(-.62,1.45,0); drawSprite(g, 'bush', bp[0], bp[1], G.tw*.5);
  const t1 = Pg(1.95,-.55,0); drawSprite(g, 'tree', t1[0], t1[1]+4, G.tw*1.05);
  const t2 = Pg(2.9,-.25,0);  drawSprite(g, 'tree', t2[0], t2[1]+4, G.tw*.8);

  S.hit = {};
  const order = [];
  for (let r=0;r<ROWS;r++) for (let col=0;col<COLS;col++) order.push({ r, col, i:r*COLS+col });
  order.sort((a,b) => (a.col+a.r) - (b.col+b.r));
  const k = G.tw/118*.95;
  order.forEach(({ r, col, i }) => {
    const st = STATIONS[i], bad = isBroken(i), I = .1;
    const bedR = SPRITES[bad ? 'bed_bad' : 'bed_ok'];
    if (bedR){                                                  // แปลงดินจาก Farms.png (จุดกึ่งกลางหน้าดิน ≈ 43% จากบนของภาพ)
      const bw = G.tw*BED_W, bh = bw*bedR.cv.height/bedR.cv.width, bc = Pg(col+.5, r+.5, LIFT);
      g.drawImage(bedR.cv, bc[0]-bw/2, bc[1]-bh*.435, bw, bh);
    } else {
    prism(col+I,r+I,col+1-I,r+1-I, 0, LIFT, '#c28b53', '#8a5a30', '#a56f3b', '#6b4220');
    poly([Pg(col+I+.07,r+I+.07,LIFT),Pg(col+1-I-.07,r+I+.07,LIFT),Pg(col+1-I-.07,r+1-I-.07,LIFT),Pg(col+I+.07,r+1-I-.07,LIFT)], bad ? '#a98757' : '#6a3f21', bad ? '#8b6a40' : '#4a2e19', 1.2);
    g.lineWidth = 3; g.lineCap = 'round';
    RS.forEach(rr => { const a = Pg(col+.2,r+rr,LIFT), b = Pg(col+.8,r+rr,LIFT); g.strokeStyle = bad ? 'rgba(110,80,45,.5)' : 'rgba(35,20,10,.55)'; g.beginPath(); g.moveTo(a[0],a[1]); g.lineTo(b[0],b[1]); g.stroke(); });
    }
    if (bad && !bedR){
      g.strokeStyle = 'rgba(80,55,30,.55)'; g.lineWidth = 1;
      for (let j=0;j<4;j++){ const q = seedRng('crack'+i+j), p0 = Pg(col+.22+q()*.56, r+.22+q()*.56, LIFT); g.beginPath(); g.moveTo(p0[0],p0[1]); g.lineTo(p0[0]+(q()-.5)*14, p0[1]+(q()-.3)*8); g.lineTo(p0[0]+(q()-.5)*20, p0[1]+q()*10); g.stroke(); }
    }
    const items = [];
    RS.forEach((rr,ri) => CS.forEach((cc,ci) => items.push({ key:(col+cc)+(r+rr), p:Pg(col+cc, r+rr, LIFT), n:ri*3+ci })));
    const an = ANCH[st.id];
    if (st.id !== 'fence') items.push({ key:(col+an[0])+(r+an[1]), p:Pg(col+an[0], r+an[1], LIFT), mach:true });
    items.sort((a,b) => a.key - b.key);
    items.forEach(it => {
      if (it.mach) drawMachine(g, st.id, it.p[0], it.p[1], k, now, bad);
      else drawPlant(g, it.p[0], it.p[1], bad ? 0 : 3, st.veg, G.tw*(.1 + (it.n%3)*.004), Math.sin(now/500 + it.n*1.7 + i)*1.6);
    });
    const fenceR = st.id === 'fence' && SPRITES[bad ? 'fence_bad' : 'fence_ok'];
    if (fenceR) drawMachineSprite(g, 'fence', Pg(col+.5, r+.9, LIFT)[0], Pg(col+.5, r+.9, LIFT)[1], k, now, bad);
    else if (st.id === 'fence'){                                    // รั้วไม้เล็กหน้าแปลง (เครื่องของจุดนี้)
      const rr = .9, posts = [.16,.33,.5,.67,.84].map(cc => Pg(col+cc, r+rr, LIFT));
      g.strokeStyle = '#8a5a3a'; g.lineWidth = 2.4;
      posts.forEach((p,j) => { const lean = bad && j%2 ? 4 : 0; g.beginPath(); g.moveTo(p[0],p[1]); g.lineTo(p[0]+lean,p[1]-15*k); g.stroke(); });
      [5,10].forEach(hh => { g.beginPath(); posts.forEach((p,j) => { const lean = bad && j%2 ? 4*hh/15 : 0, y = p[1]-hh*k + (bad && j===3 ? 5 : 0); j ? g.lineTo(p[0]+lean,y) : g.moveTo(p[0]+lean,y); }); g.stroke(); });
      if (bad){ const p = Pg(col+.67,r+rr,LIFT); g.fillStyle = 'rgba(80,80,80,.35)'; g.beginPath(); g.arc(p[0], p[1]-20*k - ((now/40)%14), 4, 0, 7); g.fill(); }
    }
    if (i === S.fxIdx && S.spray > now){
      const cp = Pg(col+.5, r+.5, LIFT); g.fillStyle = 'rgba(80,170,255,.85)';
      for (let j=0;j<16;j++){ const ph = ((now/650) + j*.29) % 1;
        g.beginPath(); g.ellipse(cp[0] + Math.sin(j*12.9)*G.tw*.28, cp[1] - 52 + ph*52, 1.8, 3.2, 0, 0, 7); g.fill(); }
    }
    const ring = [Pg(col+I,r+I,LIFT),Pg(col+1-I,r+I,LIFT),Pg(col+1-I,r+1-I,LIFT),Pg(col+I,r+1-I,LIFT)];
    if (i === S.fxIdx && now - S.flash < 1200){ const a = 1 - (now - S.flash)/1200; poly(ring, `rgba(255,240,140,${.5*a})`); }
    if (i === S.sel) poly(ring, null, '#ffb300', 3 + Math.sin(now/200)*.7);
    else if (bad) poly(ring, null, `rgba(255,80,60,${.35 + .3*Math.sin(now/300 + i)})`, 3);
  });
  // ของตกแต่งด้านหน้า: ดอกไม้ ถังไม้ รั้วไม้ขอบฐาน
  const fp1 = Pg(-.45,2.05,0); drawSprite(g, 'flowers', fp1[0], fp1[1]+2, G.tw*.4);
  const bar = Pg(3.1,1.2,0);   drawSprite(g, 'barrel', bar[0], bar[1]+2, G.tw*.27);
  const gp1 = Pg(-.5,.25,0), gp2 = Pg(3.15,.55,0), pb = Pg(1.55,2.1,0), cn = Pg(2.7,2.1,0), bd = Pg(2.45,-.15,0);
  drawSprite(g, 'grass', gp1[0], gp1[1]+2, G.tw*.16); drawSprite(g, 'grass', gp2[0], gp2[1]+2, G.tw*.14);
  drawSprite(g, 'pebbles', pb[0], pb[1]+1, G.tw*.14); drawSprite(g, 'can', cn[0], cn[1]+2, G.tw*.18);
  drawSprite(g, 'bird', bd[0], bd[1]+1, G.tw*.12 + Math.abs(Math.sin(now/700))*0);
  const picket = (A, B) => {
    const len = Math.hypot(B[0]-A[0], B[1]-A[1]), n = Math.round(len/9), h = G.tw*.13;
    g.strokeStyle = '#7a4f2a'; g.lineWidth = 1;
    [.35,.7].forEach(f => { g.strokeStyle = '#a06d3a'; g.lineWidth = 2.4; g.beginPath(); g.moveTo(A[0],A[1]-h*f); g.lineTo(B[0],B[1]-h*f); g.stroke(); });
    for (let j=0;j<=n;j++){ const t = j/n, x = A[0]+(B[0]-A[0])*t, y = A[1]+(B[1]-A[1])*t;
      g.fillStyle = j%2 ? '#c9945a' : '#b9824b'; g.strokeStyle = '#6b4220'; g.lineWidth = 1;
      g.beginPath(); g.moveTo(x-2.6,y); g.lineTo(x-2.6,y-h+2); g.lineTo(x,y-h-2); g.lineTo(x+2.6,y-h+2); g.lineTo(x+2.6,y); g.closePath(); g.fill(); g.stroke(); }
  };
  const fenceRow = (A, B, flip) => {                           // รั้วขอบสวนจาก Farms.png เรียงต่อกัน
    const fr = SPRITES.fence_ok; if (!fr || !fr.sw){ picket(A, B); return; }
    const tw2 = G.tw*.2, len = Math.hypot(B[0]-A[0], B[1]-A[1]), n = Math.max(1, Math.round(len/(tw2*.82)));
    for (let j=0;j<n;j++){ const t = (j+.5)/n, x = A[0]+(B[0]-A[0])*t, y = A[1]+(B[1]-A[1])*t, h2 = tw2*fr.cv.height/fr.cv.width;
      g.save(); g.translate(x, y+2); if (flip) g.scale(-1,1); g.drawImage(fr.cv, -tw2/2, -h2*.9, tw2, h2); g.restore(); }
  };
  fenceRow(Pg(X0+.1,Y1-.12,0), Pg(-.05,Y1-.12,0), false);
  fenceRow(Pg(X1-.12,Y0+.1,0), Pg(X1-.12,.05,0), true);
  drawButterflies(g, G, now);
  // ป้ายชื่อ + ป้ายเตือน (วาดทับทีหลัง)
  order.forEach(({ r, col, i }) => {
    const st = STATIONS[i], bad = isBroken(i), base = Pg(col+.5, r+1.04, 0), hits = [];
    g.textAlign = 'center'; g.textBaseline = 'middle';          // ไม่วาดป้ายชื่อใต้แปลงแล้ว (บังภาพ) — แตะที่แปลงหรือ ❗ ได้เหมือนเดิม
    if (bad){
      const top = Pg(col+.5, r+.5, LIFT+46*k), by = top[1] - 4 + Math.sin(now/250 + i)*3, bx = top[0];
      g.fillStyle = '#e8402c'; g.beginPath(); g.arc(bx, by, 11, 0, 7); g.fill();
      g.beginPath(); g.moveTo(bx-5,by+8); g.lineTo(bx,by+16); g.lineTo(bx+5,by+8); g.fill();
      g.strokeStyle = '#fff'; g.lineWidth = 2; g.beginPath(); g.arc(bx, by, 11, 0, 7); g.stroke();
      g.fillStyle = '#fff'; g.font = 'bold 15px sans-serif'; g.fillText('!', bx, by+1);
      hits.push({ x:bx-14, y:by-14, w:28, h:34 });
    }
    S.hit[i] = hits;
  });
}


function pickPlot(ev){
  if (S.sel >= 0) return;
  const c = $('plIso'), rect = c.getBoundingClientRect();
  const x = ev.clientX - rect.left, y = ev.clientY - rect.top, G = isoGeom();
  for (const i in S.hit) if (S.hit[i].some(r => x>=r.x && x<=r.x+r.w && y>=r.y && y<=r.y+r.h)){ selectPlot(+i); return; }
  const u = (x - G.ox)/(G.tw/2), v = (y + LIFT - G.oy)/(G.th/2);
  const col = Math.floor((u+v)/2), row = Math.floor((v-u)/2);
  if (col<0 || col>=COLS || row<0 || row>=ROWS) return;
  selectPlot(row*COLS + col);
}

function selectPlot(i){
  if (S.busy) return;
  if (!isBroken(i)){ window.PlantHost.pop(`${STATIONS[i].icon} ${STATIONS[i].name} ทำงานปกติดี 🌿 ไปดูจุดที่มี ❗ แทนนะ`); return; }
  S.sel = i; S.fxIdx = -1;
  newPuzzle(); renderPanel();
}
function closeSheet(){
  if (S.busy){ window.PlantHost.pop('รอเครื่องทำงานเสร็จก่อนนะ 🌱'); return; }
  if (S.sel >= 0 && S.done && S.ok){ const now = performance.now(); S.fxIdx = S.sel; S.flash = now; S.spray = now + 2500; }
  S.sel = -1; S.pz = null;
  const sh = $('plSheet'); if (sh) sh.classList.remove('open');
  updateFoot();
}

function loop(now){
  if (!S.open) return;
  drawIso(now); if (S.sel >= 0) drawGraph(now);
  S.raf = requestAnimationFrame(loop);
}

/* ---------- เปิด/ปิด ---------- */
function onKey(e){
  if (!S.open || S.sel < 0) return;
  if (e.key >= '0' && e.key <= '9') press(e.key);
  else if (e.key === 'Backspace') press('back');
  else if (e.key === '-') press('sign');
  else if (e.key === '/') press('frac');
  else if (e.key === 'Tab' || e.key === 'ArrowRight'){ e.preventDefault(); press('next'); }
  else if (e.key === 'Enter') run();
  else if (e.key === 'Escape') closeSheet();
}

function build(){
  if ($('plantScreen')) return;
  const el = document.createElement('div');
  el.className = 'plant-screen'; el.id = 'plantScreen';
  el.innerHTML = `
    <canvas id="plIso"></canvas>
    <div class="pl-top">
      <button class="back-btn" id="plBack" aria-label="ย้อนกลับ"><img src="Icon/back.png" alt="ย้อนกลับ"></button>
      <div class="pl-title">🌱 แปลงผัก</div>
      <div class="mg-coin-chip">💰 <span id="plCoins" class="num">0</span></div>
    </div>
    <div class="pl-foot" id="plFoot"></div>
    <div class="pl-sheet" id="plSheet"><div class="pl-dim" id="plDim"></div><div class="pl-panel" id="plPanel"></div></div>`;
  (document.getElementById('dashboard') || document.body).appendChild(el);
  $('plBack').addEventListener('click', closePlantScreen);
  $('plDim').addEventListener('click', closeSheet);
  $('plIso').addEventListener('pointerdown', pickPlot);
  $('plPanel').addEventListener('click', e => {
    const t = e.target.closest('[data-k],[data-f],#plRun,#plNew,#plNone,#plSlope,#plClose'); if (!t || t.disabled) return;
    if (t.dataset.k !== undefined) press(t.dataset.k);
    else if (t.dataset.f !== undefined){ if (!S.busy && !S.done){ S.field = +t.dataset.f; updateFields(); } }
    else if (t.id === 'plRun') run();
    else if (t.id === 'plNone') runNone();
    else if (t.id === 'plSlope') slopeCheck();
    else if (t.id === 'plClose') closeSheet();
    else if (t.id === 'plNew'){ if (S.busy) return; if (S.done && S.ok) closeSheet(); else { newPuzzle(); renderPanel(); } }
  });
}

function openPlantScreen(){
  build(); initSprites(); loadSave();
  S.open = true; S.sel = -1; S.pz = null; S.busy = false; S.anim = null; S.fxIdx = -1; S.spray = 0;
  $('plantScreen').style.display = 'block';
  $('plSheet').classList.remove('open');
  refreshCoins(); updateFoot();
  document.addEventListener('keydown', onKey);
  cancelAnimationFrame(S.raf); S.raf = requestAnimationFrame(loop);
}
function closePlantScreen(){
  if (S.busy){ window.PlantHost.pop('รอเครื่องทำงานเสร็จก่อนนะ 🌱'); return; }
  S.open = false; cancelAnimationFrame(S.raf);
  document.removeEventListener('keydown', onKey);
  $('plantScreen').style.display = 'none';
  if (window.PlantHost.closed) window.PlantHost.closed();
}
window.openPlantScreen = openPlantScreen;
window.closePlantScreen = closePlantScreen;
window.__plantDebug = { S, GENS, STATIONS, drawGraph, drawIso, newPuzzle, renderPanel, press, run, runNone, slopeCheck, finish, selectPlot, parseVals, isBroken, levelOf };
})();

/* ======================= 🚀 ลงจอดยานอวกาศ ======================= */
/* ใช้สูตรระยะห่างระหว่างจุดสองจุด d = √((x₂−x₁)² + (y₂−y₁)²) และสูตรจุดกึ่งกลาง
   พิกัดโจทย์อยู่ในช่วง −8 … 8 (หน่วยเมตร) · เวทีซูมอัตโนมัติให้พอดีกับจุดของแต่ละโจทย์ · เชื้อเพลิง 1 ถังบินได้ 0.5 / 1 / 1.5 / 2 เมตร
   สร้างโจทย์แบบสุ่มย้อนกลับจากคู่อันดับ (3,4) (5,12) (6,8) · มี 2 แบบโจทย์: (1) ให้พิกัด A กับ B ตรงๆ  (2) ให้พิกัด A กับ "ก้อนหิน" แล้ว B คือจุดกึ่งกลางของสองจุดนั้น (ไม่บอกพิกัด B)
   (3) โจทย์ "อัตราส่วนของเส้นตรง" (kind 'rt'): มียานแม่ M อยู่ไกลๆ ต้องแวะ "เติมเชื้อเพลิง" ที่จุด P บนเส้นตรง A→M ซึ่งแบ่งเส้นเป็น AP : PM = m : n (เช่น 2 : 3)
       สูตร P = ( (n·x₁ + m·x₂)/(m+n) , (n·y₁ + m·y₂)/(m+n) ) → เลื่อนเป้า 🎯 ด้วยปุ่มลูกศรไปที่ P แล้วกดปล่อยยาน (ใช้ระบบเลือกพิกัดเหมือนโจทย์จุดกึ่งกลาง)
   ลากนิ้วบนเวทีเพื่อเลือกทิศ (ลูกศร) · คำนวณระยะ · ใส่เชื้อเพลิงให้พอดี · กดปล่อยยาน

   🎞️ ด่านต่อเนื่อง: ลงจอดสำเร็จแล้วกด "ภารกิจต่อไป" → จรวดอยู่ที่เดิมในอวกาศ แต่ "ระนาบพิกัด" ถูกย้ายจุดกำเนิด
      (พิกัดของจรวดเปลี่ยน ตัวเลขแกน/กริดเปลี่ยน) → จุดหมายใหม่ปรากฏ → กล้องซูมออกแล้วเลื่อนไปซูมเข้าที่ภารกิจถัดไป
   ภายในเก็บตำแหน่งจริงเป็น "พิกัดโลก" (world) และพิกัดที่แสดง/ที่ใช้คำนวณ (local) = world − (ox, oy)
   ต้องมี window.LandingHost: coins(), reward(coin, xp), pop(text), closed() */
(function(){
'use strict';
const $ = id => document.getElementById(id);
const rnd = (a,b) => a + Math.floor(Math.random()*(b-a+1));
const pick = a => a[Math.floor(Math.random()*a.length)];
const fmt = n => String(Math.round(n*10)/10).replace('-','−');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const R2D = 180/Math.PI;

const LO = -8, HI = 8;                      // พิกัดที่ใช้สุ่มโจทย์ = −8..8 เมตร ทั้งแกน x และ y
const MARGIN = 2;                           // ขอบที่เผื่อรอบจุดทั้งหมด (เมตร) กันจรวด/ก้อนหินที่อยู่ริมหลุดเฟรม
const MIN_VIEW = 8;                         // เวทีเล็กสุดที่ซูมเข้าไปได้ (เมตร)

// 🔍 กล้อง (พิกัดโลก): VX0,VY0 = มุมซ้ายล่างของเวที, VSPAN = ความกว้าง=ความสูงของเวที (เมตร)
let VX0 = LO - MARGIN, VY0 = LO - MARGIN, VSPAN = (HI - LO) + 2*MARGIN;
// ตำแหน่ง local (พิกัดที่ผู้เล่นเห็น) → เปอร์เซ็นต์บนเวที   (world = local + origin)
const PX = x => (x + S.ox - VX0) / VSPAN * 100;
const PY = y => (VY0 + VSPAN - (y + S.oy)) / VSPAN * 100;
function targetView(m){                     // กล้องที่พอดีกับจุดทั้งหมดของภารกิจ (คืนค่าเป็นพิกัดโลก)
  const xs = [m.sx, m.gx], ys = [m.sy, m.gy];
  if (m.sel){ xs.push(m.rx); ys.push(m.ry); }
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  let span = Math.max(x1 - x0, y1 - y0) + 2*MARGIN;
  span = Math.max(MIN_VIEW, Math.ceil(span / 2) * 2);                 // จำนวนเต็มคู่ → เส้นกริดตรงกับจำนวนเต็มพอดี
  return { x0: Math.round((x0 + x1) / 2 - span / 2) + S.ox, y0: Math.round((y0 + y1) / 2 - span / 2) + S.oy, span };
}
function setViewTo(v){ VX0 = v.x0; VY0 = v.y0; VSPAN = v.span; }
const sg = n => String(n).replace('-','−'); // ใส่เครื่องหมายลบให้สวย
const pt = (x,y) => `(${sg(x)}, ${sg(y)})`;
const sq = v => v < 0 ? `(${sg(v)})²` : `${v}²`;

const MAX_TANKS = 16;
const PER_CHOICES = [0.5, 1, 1.5, 2];      // เชื้อเพลิง 1 ถังบินได้ไกลกี่เมตร
const SNAP_DEG = 6;                         // ลากให้ใกล้ทิศเป้าหมายในช่วงนี้ → ลูกศรล็อกเป้าให้
const REWARD_FIRST = 5, REWARD_RETRY = 3;
const SOLVED_EASY = 2;                      // 2 ข้อแรก: ให้พิกัด A, B ตรงๆ ก่อน
const PAIRS     = [[3,4],[5,12],[6,8]];     // คู่อันดับผลต่างพิกัด (ระยะ 5, 13, 10)
const SOLVED_BRIDGE   = 4;                 // ผ่านครบ 4 ด่าน → ด่านถัดไปเจอ "สะพานอวกาศ" ครั้งแรก (ระยะจากจุดถึงเส้นตรง)
const SOLVED_PARALLEL = 6;                 // อีก 2 ด่านต่อมา → เจอ "สะพานคู่ขนาน" ครั้งแรก (ระยะระหว่างเส้นตรงคู่ขนาน)
const SOLVED_RATIO = 3;                    // ผ่านครบ 3 ด่าน → ด่านถัดไปเจอ "อัตราส่วนของเส้นตรง (ยานแม่)" ครั้งแรก
const RATIOS = [[1,2],[2,1],[1,3],[3,1],[2,3],[3,2],[1,4],[4,1],[3,4],[4,3]];   // AP : PM = m : n
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const lineEq = L => `${sg(L.a)}x ${L.b < 0 ? '−' : '+'} ${Math.abs(L.b)}y${L.c ? (L.c < 0 ? ' − ' : ' + ') + Math.abs(L.c) : ''} = 0`;
const PAIRS_MID = [[3,4],[6,8]];            // แบบกึ่งกลาง: หินอยู่ไกลเป็น 2 เท่า (5,12 จะเกินเวที −8..8)

const S = { m:null, tanks:1, aim:null, lock:false, busy:false, done:false, tries:0, solved:0, raf:0, open:false, drag:false,
            ox:0, oy:0,        // จุดกำเนิดของระนาบพิกัดในพิกัดโลก
            rw:{x:0,y:0},      // ตำแหน่งจริงของจรวด (พิกัดโลก)
            sp:null,         // ตำแหน่ง/ทิศของจรวดบนจอ (local)
            tx:0, ty:0 };  // เป้าลงจอดที่ผู้เล่นบังคับ (โจทย์จุดกึ่งกลาง)         // ตำแหน่ง/ทิศของจรวดบนจอ (local)

/* ---------- สร้างภารกิจ (สุ่มย้อนกลับ) ----------
   เริ่มจากคู่อันดับที่ใช้เป็น "ผลต่างของพิกัด" (x₂−x₁, y₂−y₁) → ระยะ d ได้ 5, 13, 10 เป๊ะ
   สลับตำแหน่งได้ ติดลบได้ แล้วค่อยสุ่มพิกัดจุดเริ่ม A ให้ผลต่างออกมาเป็นคู่นั้นพอดี (และอยู่ในเวที) */
function perFor(d){                          // เลือกระยะต่อถังที่หารระยะลงตัว
  const opts = PER_CHOICES.filter(p => { const n = d / p; return Math.abs(n - Math.round(n)) < 1e-9 && n >= 2 && n <= MAX_TANKS; });
  return opts.length ? pick(opts) : 0;
}
function pickKind(){
  const s = S.solved;
  if (s === SOLVED_PARALLEL) return 'll';          // เจอครั้งแรกแน่นอน
  if (s === SOLVED_BRIDGE) return 'pl';
  if (s === SOLVED_RATIO) return 'rt';
  const pool = ['ab'];
  if (s >= SOLVED_EASY) pool.push('mid');
  if (s > SOLVED_RATIO) pool.push('rt');
  if (s > SOLVED_BRIDGE) pool.push('pl');
  if (s > SOLVED_PARALLEL) pool.push('ll');
  return pick(pool);
}
function genMission(){                       // คืนภารกิจใหม่ (พิกัด local) ยังไม่แตะสถานะเกม
  // ชนิดโจทย์: ab = ให้ A,B · mid = จุดกึ่งกลาง · pl = สะพาน (จุด→เส้นตรง) · ll = สะพานคู่ขนาน (เส้นตรง→เส้นตรง)
  const kind = pickKind(), mid = kind === 'mid';
  if (kind === 'rt'){
    // ยานแม่ M อยู่ที่ A + (m+n)·k  →  จุดเติมเชื้อเพลิง P = A + m·k  (AP : PM = m : n พอดี และพิกัดเป็นจำนวนเต็มเสมอ)
    for (;;){
      const [rm, rn] = pick(RATIOS), s = rm + rn, kmax = Math.floor((HI - LO) / s);
      const kx = rnd(-kmax, kmax), ky = rnd(-kmax, kmax);
      if (!kx && !ky) continue;
      const dx = s*kx, dy = s*ky;
      const sx = rnd(Math.max(LO, LO - dx), Math.min(HI, HI - dx));
      const sy = rnd(Math.max(LO, LO - dy), Math.min(HI, HI - dy));
      const gx = sx + rm*kx, gy = sy + rm*ky;
      return { kind, mid:false, sel:true, rm, rn, sx, sy, gx, gy, rx: sx + dx, ry: sy + dy,
               d: Math.hypot(rm*kx, rm*ky), per:1, tol:0.45, vis:0.6, ln:null, h:0 };
    }
  }
  const mul = mid ? 2 : 1;                                          // แบบกึ่งกลาง: A→หิน ยาวเป็น 2 เท่าของ A→B
  for (;;){
    const pr = pick(mid ? PAIRS_MID : PAIRS);                       // คู่อันดับ (a, b)
    let [dx, dy] = Math.random() < .5 ? [pr[0], pr[1]] : [pr[1], pr[0]];   // สลับตำแหน่ง
    if (Math.random() < .5) dx = -dx;                               // ติดลบได้
    if (Math.random() < .5) dy = -dy;
    const d = Math.hypot(dx, dy), per = perFor(d);
    if (!per) continue;
    const ex = dx*mul, ey = dy*mul;                                 // เวกเตอร์ A → จุดปลาย (B หรือหิน)
    const sx = rnd(Math.max(LO, LO - ex), Math.min(HI, HI - ex));  // สุ่มจุดเริ่มที่ทำให้ทุกจุดอยู่ในเวที
    const sy = rnd(Math.max(LO, LO - ey), Math.min(HI, HI - ey));
    const tol = per*0.45;                                           // ผิดไป 1 ถังเมื่อไหร่ก็ไม่ถึง/เลยแท่น
    const m = { kind, mid, sel: mid, sx, sy, gx: sx + dx, gy: sy + dy, rx: sx + ex, ry: sy + ey, d, per, tol, vis: Math.max(0.6, tol), ln: null, h: 0 };
    if (kind === 'pl' || kind === 'll'){
      // สะพาน = เส้นตรงที่ตั้งฉากกับ A→B และผ่าน B (pl) / เส้นขนานอีกเส้นที่ผ่าน A (ll) · เวกเตอร์ปกติ = (dx,dy) ย่อด้วย ห.ร.ม.
      const g0 = gcd(dx, dy), sgn = dx < 0 ? -1 : 1, a = sgn*dx/g0, b = sgn*dy/g0;
      const cOf = (x, y) => -(a*x + b*y);
      const lnB = { a, b, c: cOf(m.gx, m.gy) };
      m.ln = kind === 'pl' ? [lnB] : [{ a, b, c: cOf(m.sx, m.sy) }, lnB];
      m.h = Math.hypot(a, b);
    }
    return m;
  }
}
function applyMission(m){                    // ตั้งภารกิจ (ต้องตั้ง S.ox/S.oy ก่อน) — จรวดอยู่ที่จุดเริ่ม A
  S.m = m; S.tanks = 1; S.aim = null; S.lock = false; S.done = false; S.tries = 0;
  S.rw = { x: m.sx + S.ox, y: m.sy + S.oy };
  S.tx = m.sx; S.ty = m.sy;                 // เป้าลงจอด (ใช้ในโจทย์จุดกึ่งกลาง) เริ่มที่ A
}
function newMission(){                       // ภารกิจแรก (ตอนเปิดเกม): ระนาบพิกัดปกติ จุดกำเนิดที่ (0,0)
  S.ox = 0; S.oy = 0; S.busy = false;
  applyMission(genMission());
  setViewTo(targetView(S.m));
}

/* ---------- วาดฉาก ---------- */
function build(){
  if ($('landScreen')) return;
  const el = document.createElement('div');
  el.className = 'ld-screen'; el.id = 'landScreen';
  el.innerHTML = `
    <div class="ld-top">
      <button class="back-btn" id="ldBack" aria-label="ย้อนกลับ"><img src="Icon/back.png" alt="ย้อนกลับ"></button>
      <div class="ld-title">🚀 ลงจอดยานอวกาศ</div>
      <div class="mg-coin-chip">💰 <span id="ldCoins" class="num">0</span></div>
    </div>
    <div class="ld-mid">
      <div class="ld-stage" id="ldStage">
        <div class="ld-planet"></div><div class="ld-grid"></div>
        <div class="ld-axis h" id="ldAxH"></div><div class="ld-axis v" id="ldAxV"></div><div class="ld-ticks" id="ldTicks"></div>
        <div class="ld-seg" id="ldSeg"></div><div class="ld-bridge" id="ldBr1"></div><div class="ld-bridge b2" id="ldBr2"></div>
        <div class="ld-pad start" id="ldPadA"></div><div class="ld-lbl a" id="ldLblA"></div>
        <div class="ld-pad goal" id="ldPadB"></div><div class="ld-lbl b" id="ldLblB"></div>
        <div class="ld-rock" id="ldRock"></div><div class="ld-lbl r" id="ldLblR"></div>
        <div class="ld-lbl l1" id="ldLblL1"></div><div class="ld-lbl l2" id="ldLblL2"></div>
        <div class="ld-target" id="ldTarget"></div>
        <div class="ld-arrow" id="ldArrow"><i></i><b></b></div>
        <div class="ld-ship" id="ldShip"><div class="ld-rocket" id="ldRocket">
          <div class="flame"></div><div class="fin l"></div><div class="fin r"></div><div class="body"></div><div class="nose"></div><div class="win"></div>
        </div></div>
      </div>
      <div class="ld-hint" id="ldHint"></div>
    </div>
    <div class="ld-panel">
      <div class="ld-info">
        <div class="cell">🛫 จุดเริ่ม A<br><b id="ldA"></b></div>
        <div class="cell"><span id="ldBLbl"></span><br><b id="ldB"></b></div>
      </div>
      <div class="ld-info" id="ldPerRow" style="margin-top:6px"><div class="cell" id="ldPer"></div></div>
      <details class="ld-formula"><summary>💡 สูตรที่ใช้</summary><div id="ldFormula"></div></details>
      <div id="ldFuelBox">
        <div class="ld-fuel">
          <button class="ld-step" id="ldMinus" aria-label="ลดถัง">−</button>
          <div class="ld-tanks" id="ldTanks"></div>
          <button class="ld-step" id="ldPlus" aria-label="เพิ่มถัง">+</button>
        </div>
        <div class="ld-tank-n" id="ldTankN"></div>
      </div>
      <div class="ld-ctrl" id="ldCtrl" style="display:none">
        <div class="ld-dpad">
          <button class="ld-dk up" data-dx="0" data-dy="1" aria-label="ขึ้น">▲</button>
          <button class="ld-dk left" data-dx="-1" data-dy="0" aria-label="ซ้าย">◀</button>
          <button class="ld-dk down" data-dx="0" data-dy="-1" aria-label="ลง">▼</button>
          <button class="ld-dk right" data-dx="1" data-dy="0" aria-label="ขวา">▶</button>
        </div>
        <div class="ld-tgt">🎯 เป้าลงจอด<br><b id="ldTgt"></b></div>
      </div>
      <div class="ld-msg info" id="ldMsg"></div>
      <div class="ld-actions">
        <button class="ld-go" id="ldGo">🚀 ปล่อยยาน!</button>
        <button class="ld-new" id="ldNew">🎲 ภารกิจใหม่</button>
      </div>
    </div>`;
  (document.getElementById('dashboard') || document.body).appendChild(el);

  [['ระยะห่างสองจุด', 'd=\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}', 'd = √[(x₂ − x₁)² + (y₂ − y₁)²]'],
   ['จุดกึ่งกลาง', 'M=\\left(\\dfrac{x_1+x_2}{2},\\ \\dfrac{y_1+y_2}{2}\\right)', 'M = ((x₁ + x₂)/2 , (y₁ + y₂)/2)'],
   ['จุดแบ่งส่วนของเส้นตรง ถ้า AP : PM = m : n', 'P=\\left(\\dfrac{nx_1+mx_2}{m+n},\\ \\dfrac{ny_1+my_2}{m+n}\\right)', 'P = ((n·x₁ + m·x₂)/(m + n) , (n·y₁ + m·y₂)/(m + n))'],
   ['ระยะจากจุด (x₀, y₀) ถึงเส้นตรง', 'ax+by+c=0:\\quad d=\\dfrac{|ax_0+by_0+c|}{\\sqrt{a^2+b^2}}', 'ax + by + c = 0 : d = |ax₀ + by₀ + c| / √(a² + b²)'],
   ['ระยะระหว่างเส้นขนาน', 'd=\\dfrac{|c_1-c_2|}{\\sqrt{a^2+b^2}}', 'd = |c₁ − c₂| / √(a² + b²)']
  ].forEach(([lb, tx, pl]) => {
    const row = document.createElement('span'); row.className = 'ldf';
    row.innerHTML = '<span class="l"></span> <span class="k"></span>'; row.firstChild.textContent = lb + ' ';
    $('ldFormula').appendChild(row); window.mgTex(row.querySelector('.k'), tx, pl);
  });
  { const row = document.createElement('span'); row.className = 'ldf'; row.textContent = 'จำนวนถัง = ระยะ ÷ ระยะต่อ 1 ถัง'; $('ldFormula').appendChild(row); }

  $('ldBack').addEventListener('click', closeLanding);
  $('ldMinus').addEventListener('click', () => setTanks(S.tanks - 1));
  $('ldPlus').addEventListener('click', () => setTanks(S.tanks + 1));
  $('ldGo').addEventListener('click', onGo);
  $('ldNew').addEventListener('click', () => { if (!S.busy) goNext(); });
  const st = $('ldStage');
  st.addEventListener('pointerdown', e => { if (S.busy || S.done || S.m.sel) return; S.drag = true; try { st.setPointerCapture(e.pointerId); } catch(_){} aimFrom(e); });
  st.addEventListener('pointermove', e => { if (S.drag) aimFrom(e); });
  const end = () => { S.drag = false; };
  st.addEventListener('pointerup', end); st.addEventListener('pointercancel', end);
  // ปุ่มบังคับเป้า: กดครั้งเดียวเลื่อน 1 หน่วย กดค้างเลื่อนต่อเนื่อง
  let holdT = 0, holdI = 0;
  const stopHold = () => { clearTimeout(holdT); clearInterval(holdI); };
  document.querySelectorAll('#ldCtrl .ld-dk').forEach(b => {
    const mv = () => moveTarget(+b.dataset.dx, +b.dataset.dy);
    b.addEventListener('pointerdown', e => { e.preventDefault(); stopHold(); mv(); holdT = setTimeout(() => { holdI = setInterval(mv, 110); }, 350); });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => b.addEventListener(ev, stopHold));
  });
}
function moveTarget(dx, dy){
  if (!S.open || S.busy || S.done || !S.m || !S.m.sel) return;
  S.tx = Math.max(LO, Math.min(HI, S.tx + dx)); S.ty = Math.max(LO, Math.min(HI, S.ty + dy));
  layout(); updateTgt();
  const h = $('ldHint'); if (h) h.textContent = S.m.kind === 'rt' ? 'เลื่อนเป้า 🎯 ไปที่จุดเติมเชื้อเพลิง P แล้วกดปล่อยยาน' : 'เลื่อนเป้า 🎯 ไปที่จุดกึ่งกลาง แล้วกดปล่อยยาน';
}
function updateTgt(){ const t = $('ldTgt'); if (t) t.textContent = pt(S.tx, S.ty); }
function ldKey(e){
  if (!S.open || !S.m || !S.m.sel) return;
  const k = { ArrowUp:[0,1], ArrowDown:[0,-1], ArrowLeft:[-1,0], ArrowRight:[1,0] }[e.key];
  if (k){ e.preventDefault(); moveTarget(k[0], k[1]); }
}

function setMsg(t, kind){ const m = $('ldMsg'); m.textContent = t || ''; m.className = 'ld-msg ' + (kind || 'info'); }
function setShip(x, y, rot){
  S.sp = { x, y, rot };
  const s = $('ldShip'); s.style.left = PX(x) + '%'; s.style.top = PY(y) + '%';
  $('ldRocket').style.transform = `rotate(${rot}deg)`;
}
function bearing(){ return Math.atan2(S.m.gy - S.m.sy, S.m.gx - S.m.sx); }   // ทิศที่ถูกต้อง (เรเดียน)
function restShip(){ setShip(S.m.sx, S.m.sy, S.aim == null ? 0 : 90 - S.aim*R2D); }
function placeLbl(el, x, y, textOff){        // วางป้ายใต้จุด (ถ้าชิดขอบล่างให้ย้ายไปไว้บน · ถ้าจุดอยู่นอกกล้องให้ซ่อน)
  const px = PX(x), py = PY(y);
  el.style.visibility = (px < -3 || px > 103 || py < -3 || py > 103) ? 'hidden' : '';
  let top = py + textOff;
  if (top > 92) top = py - textOff - 5;
  el.style.left = Math.max(14, Math.min(86, px)) + '%'; el.style.top = top + '%';
}

const NICE = [1, 2, 5, 10, 20, 50, 100, 200];
const niceStep = (span, maxN) => NICE.find(s => span / s <= maxN) || 200;

function renderView(){                       // วาดกริด แกน และตัวเลขแกนตามกล้องตอนนี้ (ใช้ได้ทั้งตอนนิ่งและตอนกล้องเคลื่อนที่)
  const st = $('ldStage'), W = st.clientWidth || 300, H = st.clientHeight || W;
  const LX0 = VX0 - S.ox, LY0 = VY0 - S.oy, LYT = LY0 + VSPAN;       // กล้องในพิกัด local
  const gs = niceStep(VSPAN, W / 14), ts = niceStep(VSPAN, 8);
  const gr = document.querySelector('#ldStage .ld-grid');
  gr.style.backgroundSize = (W * gs / VSPAN) + 'px ' + (H * gs / VSPAN) + 'px';
  gr.style.backgroundPosition = ((Math.ceil(LX0 / gs) * gs - LX0) / VSPAN * W) + 'px ' + ((LYT - Math.floor(LYT / gs) * gs) / VSPAN * H) + 'px';
  const axH = $('ldAxH'), axV = $('ldAxV');
  axH.style.display = (0 >= LY0 && 0 <= LYT) ? 'block' : 'none'; axH.style.top = PY(0) + '%';
  axV.style.display = (0 >= LX0 && 0 <= LX0 + VSPAN) ? 'block' : 'none'; axV.style.left = PX(0) + '%';
  let t = '';
  for (let v = Math.ceil(LX0 / ts) * ts; v <= LX0 + VSPAN; v += ts)
    t += `<span class="ld-tick x" style="left:${PX(v)}%">${sg(v)}</span>`;
  for (let v = Math.ceil(LY0 / ts) * ts; v <= LYT; v += ts)
    if (v > LY0) t += `<span class="ld-tick y" style="top:${PY(v)}%">${sg(v)}</span>`;
  $('ldTicks').innerHTML = t;
}

function layout(){                           // วางทุกอย่างบนเวทีตามกล้องตอนนี้ (เรียกทุกเฟรมตอนกล้องเคลื่อนที่)
  const m = S.m; if (!m) return;
  renderView();
  const a = $('ldPadA'); a.style.left = PX(m.sx) + '%'; a.style.top = PY(m.sy) + '%';
  const g = $('ldPadB'); g.style.left = PX(m.gx) + '%'; g.style.top = PY(m.gy) + '%';
  g.style.width = g.style.height = (m.vis*2 / VSPAN * 100) + '%';
  placeLbl($('ldLblA'), m.sx, m.sy, 4.5);
  placeLbl($('ldLblB'), m.gx, m.gy, m.vis / VSPAN * 100 + 1.5);
  const rk = $('ldRock'); rk.style.left = PX(m.rx) + '%'; rk.style.top = PY(m.ry) + '%';
  placeLbl($('ldLblR'), m.rx, m.ry, 4.5);
  const seg = $('ldSeg');                                            // เส้นประ A → ยานแม่ (เฉพาะโจทย์อัตราส่วน)
  if (m.kind === 'rt'){
    seg.style.display = 'block'; seg.style.left = PX(m.sx) + '%'; seg.style.top = PY(m.sy) + '%';
    seg.style.width = (Math.hypot(m.rx - m.sx, m.ry - m.sy) / VSPAN * 100) + '%';
    seg.style.transform = `rotate(${-Math.atan2(m.ry - m.sy, m.rx - m.sx) * R2D}deg)`;
  } else seg.style.display = 'none';
  [['ldBr1','ldLblL1'], ['ldBr2','ldLblL2']].forEach(([bid, lid], i) => {
    const br = $(bid), lb = $(lid), L = m.ln && m.ln[i];
    if (!L){ br.style.display = lb.style.display = 'none'; return; }
    br.style.display = lb.style.display = 'block';
    const P = (m.kind === 'll' && i === 0) ? { x:m.sx, y:m.sy } : { x:m.gx, y:m.gy };   // จุดที่สะพานพาดผ่าน
    br.style.left = PX(P.x) + '%'; br.style.top = PY(P.y) + '%';
    br.style.width = (60 / VSPAN * 100) + '%'; br.style.height = (0.9 / VSPAN * 100) + '%';
    br.style.transform = `translate(-50%,-50%) rotate(${Math.atan2(L.a, L.b) * R2D}deg)`;
    const h = Math.hypot(L.a, L.b); let ux = -L.b / h, uy = L.a / h; if (ux < 0){ ux = -ux; uy = -uy; }
    placeLbl(lb, P.x + ux*2.4, P.y + uy*2.4, 3.2);
  });
  const tg = $('ldTarget'); tg.style.left = PX(S.tx) + '%'; tg.style.top = PY(S.ty) + '%';
  if (S.sp) setShip(S.sp.x, S.sp.y, S.sp.rot);
  const ar = $('ldArrow'); ar.style.left = PX(m.sx) + '%'; ar.style.top = PY(m.sy) + '%';
}

function renderAll(){
  const m = S.m;
  const la = $('ldLblA'), lb = $('ldLblB'), lr = $('ldLblR'), rk = $('ldRock'), g = $('ldPadB');
  la.textContent = `A ${pt(m.sx, m.sy)}`;
  // แบบกึ่งกลาง: ซ่อนแท่น B ไว้ก่อน (ไม่บอกพิกัด) แล้วโชว์หินพร้อมพิกัดแทน
  g.style.display = lb.style.display = m.kind === 'ab' ? 'block' : 'none';
  rk.style.display = lr.style.display = m.sel ? 'block' : 'none';
  rk.classList.toggle('mother', m.kind === 'rt'); lr.classList.toggle('mother', m.kind === 'rt');   // โจทย์อัตราส่วน: เปลี่ยนก้อนหินเป็นยานแม่ 🛸
  $('ldB').innerHTML = '';
  if (m.ln){
    $('ldLblL1').textContent = m.kind === 'll' ? `L₁: ${lineEq(m.ln[0])}` : `สะพาน: ${lineEq(m.ln[0])}`;
    $('ldLblL2').textContent = `L₂: ${lineEq(m.ln[1] || m.ln[0])}`;
    lb.textContent = `B ${pt(m.gx, m.gy)}`;                      // ใช้เฉลยตอนลงจอดสำเร็จ
    if (m.kind === 'pl'){
      $('ldBLbl').textContent = '🌉 สะพานอวกาศ (เส้นตรง)'; $('ldB').textContent = lineEq(m.ln[0]);
    } else {
      $('ldBLbl').textContent = '🌉 สะพานคู่ขนาน 2 เส้น';
      $('ldB').innerHTML = `<span class="ld-eqs">L₁: ${lineEq(m.ln[0])}<br>L₂: ${lineEq(m.ln[1])}</span>`;
    }
  } else if (m.kind === 'rt'){
    lr.textContent = `ยานแม่ M ${pt(m.rx, m.ry)}`;
    $('ldBLbl').textContent = '🛸 ยานแม่ M'; $('ldB').innerHTML = `${pt(m.rx, m.ry)}<span class="ld-eqs">AP : PM = ${m.rm} : ${m.rn}</span>`;
  } else if (m.mid){
    lr.textContent = `หิน ${pt(m.rx, m.ry)}`;
    $('ldBLbl').textContent = '🪨 ก้อนหิน'; $('ldB').textContent = pt(m.rx, m.ry);
  } else {
    lb.textContent = `B ${pt(m.gx, m.gy)}`;
    $('ldBLbl').textContent = '🛬 จุดลงจอด B'; $('ldB').textContent = pt(m.gx, m.gy);
  }
  $('ldA').textContent = pt(m.sx, m.sy);
  $('ldPer').innerHTML = `⛽ เชื้อเพลิง 1 ถัง บินได้ไกล <b>${fmt(m.per)}</b> เมตร`;
  $('ldShip').className = 'ld-ship';
  document.querySelectorAll('.ld-boom').forEach(n => n.remove());
  $('ldArrow').style.display = 'none';
  // โจทย์จุดกึ่งกลาง: ไม่ใช้เชื้อเพลิง/ลากทิศ → ใช้ปุ่มบังคับเป้าลงจอดแทน
  $('ldFuelBox').style.display = m.sel ? 'none' : '';
  $('ldPerRow').style.display = m.sel ? 'none' : '';
  $('ldCtrl').style.display = m.sel ? 'flex' : 'none';
  $('ldTarget').style.display = m.sel ? 'block' : 'none';
  updateTgt();
  restShip(); layout(); renderTanks(); renderGo();
  $('ldHint').textContent = m.sel ? `ภารกิจที่สำเร็จ ${S.solved} · กดปุ่มลูกศรเพื่อเลื่อนเป้า 🎯` : `ภารกิจที่สำเร็จ ${S.solved} · ลากนิ้วบนจอเพื่อเลือกทิศบิน`;
  setMsg(m.kind === 'pl' ? 'สะพานอวกาศพาดผ่านมา! 🌉 ลงจอดบนสะพานที่จุดใกล้ที่สุด\nหาระยะห่างจาก A ถึงเส้นตรง แล้วใส่เชื้อเพลิงให้พอดี'
    : m.kind === 'll' ? 'จรวดจอดอยู่บนสะพาน L₁ 🌉 ลงจอดบนสะพาน L₂ ที่ใกล้ที่สุด\nหาระยะห่างระหว่างเส้นขนาน แล้วใส่เชื้อเพลิงให้พอดี'
    : m.kind === 'rt' ? `ยานแม่ 🛸 รออยู่ไกลๆ! ต้องแวะเติมเชื้อเพลิง ⛽ ที่จุด P บนเส้นตรง A → ยานแม่\nให้ AP : PM = ${m.rm} : ${m.rn} หาพิกัด P แล้วกดลูกศรเลื่อนเป้า 🎯 ไปที่นั่น จากนั้นกดปล่อยยาน`
    : m.mid ? 'จุดลงจอด B อยู่ตรงกึ่งกลางระหว่าง A กับก้อนหิน 🪨\nหาพิกัด B แล้วกดลูกศรเลื่อนเป้า 🎯 ไปที่นั่น จากนั้นกดปล่อยยาน' : 'คำนวณระยะ A → B แล้วใส่เชื้อเพลิงให้พอดี', 'info');
}
function renderTanks(){
  $('ldTanks').innerHTML = '<i class="ld-tank"></i>'.repeat(S.tanks);
  $('ldTankN').textContent = `ใส่เชื้อเพลิง ${S.tanks} ถัง`;
  $('ldMinus').disabled = S.busy || S.done || S.tanks <= 1;
  $('ldPlus').disabled  = S.busy || S.done || S.tanks >= MAX_TANKS;
}
function renderGo(){
  const b = $('ldGo');
  b.textContent = S.done ? '▶ ภารกิจต่อไป' : '🚀 ปล่อยยาน!';
  b.disabled = S.busy;
  $('ldNew').disabled = S.busy;
  document.querySelectorAll('#ldCtrl .ld-dk').forEach(k => { k.disabled = S.busy || S.done; });
}
function setTanks(n){ if (S.busy || S.done) return; S.tanks = Math.max(1, Math.min(MAX_TANKS, n)); renderTanks(); }

/* ---------- ไปภารกิจถัดไป: จรวดอยู่ที่เดิม → ระนาบพิกัดเปลี่ยน → จุดหมายใหม่ → กล้องซูมออกแล้วเคลื่อนไป ---------- */
function easeInOut(t){ return t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2; }

function tweenView(to, ms){
  return new Promise(resolve => {
    const f = { cx: VX0 + VSPAN/2, cy: VY0 + VSPAN/2, s: VSPAN };
    const tcx = to.x0 + to.span/2, tcy = to.y0 + to.span/2;
    const D = Math.hypot(tcx - f.cx, tcy - f.cy);
    const bump = D + 0.25*Math.max(f.s, to.span);          // ยิ่งไกลยิ่งซูมออกกว้าง
    const t0 = performance.now();
    cancelAnimationFrame(S.raf);
    const step = now => {
      if (!S.open){ resolve(); return; }
      const t = Math.min(1, (now - t0) / ms), e = easeInOut(t);
      const cx = f.cx + (tcx - f.cx)*e, cy = f.cy + (tcy - f.cy)*e;
      const s = Math.exp(Math.log(f.s) + (Math.log(to.span) - Math.log(f.s))*e) + bump*Math.sin(Math.PI*e);
      VSPAN = s; VX0 = cx - s/2; VY0 = cy - s/2;
      if (t >= 1) setViewTo(to);
      layout();
      if (t < 1) S.raf = requestAnimationFrame(step); else resolve();
    };
    S.raf = requestAnimationFrame(step);
  });
}

async function goNext(){
  if (S.busy) return;
  S.busy = true; renderTanks(); renderGo();
  $('ldArrow').style.display = 'none';
  const st = $('ldStage'), rw = { x: S.rw.x, y: S.rw.y }, oldOx = S.ox, oldOy = S.oy;
  setMsg('🛰️ กำลังย้ายระนาบพิกัด…', 'info');
  $('ldHint').textContent = 'จรวดอยู่ที่เดิม — แต่พิกัดของจรวดกำลังเปลี่ยน';
  st.classList.add('ld-swap'); await sleep(600);                      // 1) กริด/แกน/จุดเก่า เลือนหาย
  if (!S.open) return;

  let m;                                                              // 2) ตั้งจุดกำเนิดใหม่ ให้จรวดได้พิกัดใหม่ ณ ตำแหน่งเดิม
  do {
    m = genMission();
    S.ox = rw.x - m.sx; S.oy = rw.y - m.sy;
  } while (S.ox === oldOx && S.oy === oldOy);
  applyMission(m);
  $('ldRocket').classList.add('ld-turn');
  renderAll();                                                        //    กล้องยังอยู่ที่เดิม จรวดอยู่ที่เดิมบนจอ
  setMsg(`📍 ระนาบพิกัดเปลี่ยนแล้ว! จรวดอยู่ที่ A ${pt(m.sx, m.sy)}\nจุดหมายใหม่ปรากฏแล้ว…`, 'info');
  st.classList.remove('ld-swap');                                     // 3) กริดใหม่/จุดหมายใหม่ ค่อยๆ ปรากฏ
  await sleep(1300);
  if (!S.open) return;

  $('ldHint').textContent = '🎥 กล้องกำลังซูมออกไปยังจุดถัดไป…';
  await tweenView(targetView(m), 2400);                               // 4) ซูมออก → เลื่อน → ซูมเข้า
  if (!S.open) return;
  $('ldRocket').classList.remove('ld-turn');
  S.busy = false;
  renderAll();
}

/* ---------- ลากเลือกทิศ ---------- */
function aimFrom(e){
  const st = $('ldStage'), r = st.getBoundingClientRect();
  const px = VX0 + (e.clientX - r.left) / r.width * VSPAN - S.ox, py = VY0 + VSPAN - (e.clientY - r.top) / r.height * VSPAN - S.oy;
  const dx = px - S.m.sx, dy = py - S.m.sy;
  if (Math.hypot(dx, dy) < 0.4) return;
  let a = Math.atan2(dy, dx), lock = false;
  let diff = Math.abs(a - bearing()); if (diff > Math.PI) diff = 2*Math.PI - diff;
  if (diff * R2D <= SNAP_DEG){ a = bearing(); lock = true; }
  S.aim = a; S.lock = lock;
  const ar = $('ldArrow'), w = r.width;
  ar.style.display = 'block'; ar.className = 'ld-arrow' + (lock ? ' lock' : '');
  ar.style.left = PX(S.m.sx) + '%'; ar.style.top = PY(S.m.sy) + '%';
  ar.style.transform = `rotate(${-a*R2D}deg) translateX(${w*0.07}px)`;
  ar.style.setProperty('--len', (w*0.26) + 'px');
  restShip();
  $('ldHint').textContent = lock ? '🎯 ลูกศรชี้ตรงทิศแล้ว!' : (S.m.kind === 'ab' ? 'ลากต่อเพื่อปรับทิศ — ให้ชี้ไปที่ B' : 'ลากต่อเพื่อปรับทิศ — ให้ตั้งฉากกับสะพาน (ทางที่สั้นที่สุด)');
}

/* ---------- ปล่อยยาน ---------- */
function onGo(){
  if (S.busy) return;
  if (S.done){ goNext(); return; }
  const m = S.m;
  let ang, range, fx, fy;
  if (m.sel){                                      // บินตรงไปที่เป้าลงจอดที่ผู้เล่นบังคับ
    fx = S.tx; fy = S.ty; range = Math.hypot(fx - m.sx, fy - m.sy);
    if (range < 1e-9){ setMsg('เลื่อนเป้า 🎯 ไปที่จุดลงจอดก่อนนะ', 'bad'); return; }
    ang = Math.atan2(fy - m.sy, fx - m.sx);
  } else {
    if (S.aim == null){ setMsg('ลากนิ้วบนจอให้ลูกศรชี้ไปทางจุดลงจอดก่อนนะ 👆', 'bad'); return; }
    ang = S.aim; range = S.tanks * m.per;
    fx = m.sx + Math.cos(ang)*range; fy = m.sy + Math.sin(ang)*range;
  }
  S.busy = true; S.tries++; renderTanks(); renderGo();
  $('ldArrow').style.display = 'none';
  setMsg('', 'info');
  const ship = $('ldShip'); ship.className = 'ld-ship fly';
  const dur = Math.min(2600, 1000 + range*110), t0 = performance.now();
  cancelAnimationFrame(S.raf);
  const step = now => {
    if (!S.open) return;
    const t = Math.min(1, (now - t0) / dur), e = t < .5 ? 2*t*t : 1 - Math.pow(-2*t + 2, 2)/2;
    setShip(m.sx + (fx - m.sx)*e, m.sy + (fy - m.sy)*e, 90 - ang*R2D);
    if (t < 1) S.raf = requestAnimationFrame(step); else finish(fx, fy, range);
  };
  S.raf = requestAnimationFrame(step);
}

// คำใบ้โจทย์อัตราส่วน (ไม่เฉลยพิกัด): ไม่อยู่บนเส้นตรง / ใกล้ A เกินไป / ไกลจาก A เกินไป
function rtWhy(fx, fy){
  const m = S.m, ax = m.rx - m.sx, ay = m.ry - m.sy, px = fx - m.sx, py = fy - m.sy;
  if (Math.abs(ax*py - ay*px) > 1e-9) return 'จุดนี้ไม่อยู่บนเส้นตรง A → ยานแม่ 🛸 ลองใช้สูตรแบ่งส่วนของเส้นตรงใหม่';
  const t = (px*ax + py*ay) / (ax*ax + ay*ay), want = m.rm / (m.rm + m.rn);
  if (t < 0) return 'จุดนี้อยู่ฝั่งตรงข้ามกับยานแม่ 🛸 ลองคิด AP : PM = ' + m.rm + ' : ' + m.rn + ' ใหม่';
  return t < want ? 'จุดนี้อยู่ใกล้ A เกินไป (AP สั้นไป) ⛽ ลองขยับไปทางยานแม่' : 'จุดนี้ไกลจาก A เกินไป (AP ยาวไป) ⛽ ลองขยับกลับมาทาง A';
}

function finish(fx, fy, range){
  const m = S.m, miss = Math.hypot(fx - m.gx, fy - m.gy), ship = $('ldShip');
  S.busy = false;
  if (m.sel ? miss < 1e-9 : miss <= m.tol + 1e-9){
    ship.className = 'ld-ship';
    setShip(m.gx, m.gy, 0);
    S.rw = { x: m.gx + S.ox, y: m.gy + S.oy };    // จรวดจอดอยู่ที่ B แล้ว (ด่านถัดไปเริ่มจากตรงนี้)
    S.done = true; S.solved++;
    if (m.kind !== 'ab'){                         // เฉลยแท่น B (จุดกึ่งกลาง / จุดบนสะพานที่ใกล้ที่สุด)
      const g = $('ldPadB'), lb = $('ldLblB');
      g.style.display = lb.style.display = 'block';
      lb.textContent = (m.kind === 'rt' ? '⛽ P ' : 'B ') + pt(m.gx, m.gy); placeLbl(lb, m.gx, m.gy, m.vis / VSPAN * 100 + 1.5);
    }
    const coin = S.tries === 1 ? REWARD_FIRST : REWARD_RETRY;
    const dx = m.gx - m.sx, dy = m.gy - m.sy;
    const midLine = `B = ((${sg(m.sx)}+${sg(m.rx)})/2 , (${sg(m.sy)}+${sg(m.ry)})/2) = ${pt(m.gx, m.gy)}`;
    const rs = m.rm + m.rn;
    const rtLine = `P = ((${m.rn}(${sg(m.sx)}) + ${m.rm}(${sg(m.rx)}))/${rs} , (${m.rn}(${sg(m.sy)}) + ${m.rm}(${sg(m.ry)}))/${rs}) = ${pt(m.gx, m.gy)}`;
    let dLine = `d = √(${sq(dx)} + ${sq(dy)}) = √${dx*dx + dy*dy} ≈ ${fmt(m.d)} เมตร`;
    if (m.kind === 'pl'){
      const L = m.ln[0], v = L.a*m.sx + L.b*m.sy + L.c;
      dLine = `d = |${L.a}(${sg(m.sx)}) + ${sg(L.b)}(${sg(m.sy)}) + ${sg(L.c)}| / √(${L.a}² + ${L.b}²) = ${Math.abs(v)} / ${fmt(m.h)} = ${fmt(m.d)} เมตร`;
    } else if (m.kind === 'll'){
      const L1 = m.ln[0], L2 = m.ln[1];
      dLine = `d = |c₁ − c₂| / √(a² + b²) = |${sg(L1.c)} − (${sg(L2.c)})| / ${fmt(m.h)} = ${Math.abs(L1.c - L2.c)} / ${fmt(m.h)} = ${fmt(m.d)} เมตร`;
    }
    setMsg(`🎉 ลงจอดสำเร็จ!${m.kind === 'rt' ? ' เติมเชื้อเพลิงเรียบร้อย ⛽' : ''} +${coin} 💰 +${coin} ⭐\n${m.kind === 'rt' ? rtLine : m.mid ? midLine : dLine}`, 'good');
    $('ldHint').textContent = `ภารกิจที่สำเร็จ ${S.solved} · กด “ภารกิจต่อไป” เพื่อบินต่อจากจุดนี้`;
    try { window.LandingHost.reward(coin, coin); } catch(_){}
    refreshCoins();
  } else {
    ship.className = 'ld-ship crash';
    const wx = Math.max(VX0 + 0.5, Math.min(VX0 + VSPAN - 0.5, fx + S.ox)), wy = Math.max(VY0 + 0.5, Math.min(VY0 + VSPAN - 0.5, fy + S.oy));
    const boom = document.createElement('div'); boom.className = 'ld-boom'; boom.textContent = '💥';
    boom.style.left = ((wx - VX0) / VSPAN * 100) + '%'; boom.style.top = ((VY0 + VSPAN - wy) / VSPAN * 100) + '%';
    $('ldStage').appendChild(boom);
    // บอกใบ้ว่าพลาดเพราะอะไร (ไม่เฉลยค่าที่ถูก)
    const off = Math.abs(Math.atan2(fy - m.sy, fx - m.sx) - bearing());
    let why;
    if (m.kind === 'rt') why = rtWhy(fx, fy);
    else if (m.mid) why = 'ลงไม่ตรงจุดกึ่งกลาง 🎯 ลองคิด ((x₁+x₂)/2 , (y₁+y₂)/2) ใหม่แล้วเลื่อนเป้า';
    else if (!S.lock || off > 0.01) why = m.mid ? 'ยานบินผิดทิศ ลองลากลูกศรให้ชี้ไปทางก้อนหิน 🎯' : (m.kind === 'ab' ? 'ยานบินผิดทิศ ลองลากลูกศรให้ชี้ตรงไปที่ B 🎯' : 'ยานบินผิดทิศ ระยะที่สั้นที่สุดต้อง “ตั้งฉาก” กับสะพาน ลองลากลูกศรใหม่ 🎯');
    else if (range < m.d) why = `เชื้อเพลิงหมดก่อนถึง${m.kind === 'ab' ? ' B' : 'สะพาน'} 😢 (บินไปได้ ${fmt(range)} เมตร) ลองเพิ่มถัง`;
    else why = `บินเลย${m.kind === 'ab' ? ' B ' : 'สะพาน'}ไป 😵 (บินไป ${fmt(range)} เมตร) ลองลดถัง`;
    setMsg(`ยานตก! ${why}`, 'bad');
    setTimeout(() => {
      if (!S.open || S.done || S.busy) return;
      ship.className = 'ld-ship'; document.querySelectorAll('.ld-boom').forEach(n => n.remove());
      restShip();
      if (S.aim != null && !m.sel) $('ldArrow').style.display = 'block';
      renderTanks(); renderGo();
    }, 1400);
  }
  renderTanks(); renderGo();
}

function refreshCoins(){ const el = $('ldCoins'); if (el) el.textContent = window.LandingHost.coins(); }

function openLandingScreen(){
  build();
  S.open = true; S.sp = null;
  document.addEventListener('keydown', ldKey);
  $('landScreen').style.display = 'flex';
  $('ldStage').classList.remove('ld-swap'); $('ldRocket').classList.remove('ld-turn');
  newMission();
  refreshCoins(); renderAll();
}
function closeLanding(){
  if (S.busy){ window.LandingHost.pop('รอสักครู่นะ 🚀'); return; }
  S.open = false; cancelAnimationFrame(S.raf);
  document.removeEventListener('keydown', ldKey);
  $('landScreen').style.display = 'none';
  if (window.LandingHost.closed) window.LandingHost.closed();
}
window.openLandingScreen = openLandingScreen;
window.closeLandingScreen = closeLanding;
})();


/* =====================================================================
   ➗ ตัวช่วยแสดงสมการแบบ LaTeX (KaTeX จาก CDN — โหลดเองอัตโนมัติ ไม่ต้องแก้ index.html)
   window.mgTex(element, latex, ข้อความสำรอง)  → โหลด KaTeX ไม่ได้ (ออฟไลน์) จะแสดงข้อความสำรองแทน เกมไม่พัง
===================================================================== */
(function(){
  const B = 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/';
  let p = null;
  function load(){
    if (p) return p;
    p = new Promise(res => {
      if (window.katex) return res(true);
      const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = B + 'katex.min.css'; document.head.appendChild(l);
      const sc = document.createElement('script'); sc.src = B + 'katex.min.js';
      sc.onload = () => res(true); sc.onerror = () => res(false); document.head.appendChild(sc);
    });
    return p;
  }
  window.mgTex = function(el, latex, plain){
    if (!el) return;
    el.textContent = plain != null ? plain : latex;     // แสดงข้อความสำรองไว้ก่อน
    el.dataset.tex = latex;
    load().then(ok => {
      if (!ok || !window.katex || el.dataset.tex !== latex) return;
      try { window.katex.render(latex, el, { throwOnError:false }); } catch(_){}
    });
  };
  load();   // โหลดล่วงหน้าตั้งแต่เปิดเกม
})();


/* =====================================================================
   🔺 เกมภาคตัดกรวย (Conic Sections)
   กรวยคู่ 3 มิติ (วาดด้วย canvas) + ระนาบตัดที่เลื่อน/เอียงได้ → เห็นหน้าตัดเป็น วงกลม / วงรี / พาราโบลา / ไฮเพอร์โบลา
   • กดปุ่มรูปร่าง → ระนาบเอียงไปมุมที่ถูกต้องแล้วตัดกรวยให้ดู   • สไลเดอร์ปรับมุมเองได้   • ลากนิ้วเพื่อหมุนกรวย
   • คณิตศาสตร์จริง: เส้นกำเนิดกรวยทำมุม α = 35° กับแกน, ระนาบเอียง θ จากแนวนอน
       θ = 0 → วงกลม · θ < 90°−α → วงรี · θ = 90°−α (= 55°) → พาราโบลา · θ > 90°−α → ไฮเพอร์โบลา      e = sin θ / cos α
   ต้องมี window.mgHubReturn() จากหน้ารวมมินิเกม (ไม่ให้เหรียญ/EXP เพราะเป็นเกมสำรวจ)
   • ปุ่ม "เล่นเกม!" มุมขวาบน → เกมประกอบยานอวกาศด้วยสมการวงกลม (ดูบล็อก GP / gdraw ด้านล่าง)
===================================================================== */
(function(){
'use strict';
const $ = id => document.getElementById(id);
const TAU = Math.PI * 2;
const AL = 35 * Math.PI / 180;           // มุมระหว่างเส้นกำเนิดกับแกนกรวย
const TH_PAR = 90 - 35;                  // องศาที่ระนาบขนานเส้นกำเนิด (พาราโบลา) = 55°
const H = 2.2;                           // กรวยสูงจาก z = −H ถึง +H
const Z0 = 1.0;                          // ระนาบตัดผ่านแกนที่ความสูง z = Z0
const PRESET = { circle: 0, ellipse: 30, parabola: TH_PAR, hyperbola: 74 };

const TY = {
  circle:    { n:'⭕ วงกลม',      c:'#4ade80', e:'e = 0', etex:'e=0', tex:'x^2+y^2=r^2',
               rule:'ระนาบ “ขนานกับฐาน” (ตั้งฉากกับแกนกรวย) ตัดเส้นกำเนิดทุกเส้นที่ระยะเท่ากัน จึงได้วงกลม',
               eq:'x² + y² = r²' },
  ellipse:   { n:'🥚 วงรี',        c:'#fbbf24', e:'0 < e < 1', etex:'0<e<1', tex:'\\dfrac{x^2}{a^2}+\\dfrac{y^2}{b^2}=1',
               rule:'ระนาบเอียง แต่ยังชันน้อยกว่าเส้นกำเนิด ตัดเส้นกำเนิดครบทุกเส้นในกรวยฝั่งเดียว ได้เส้นโค้งปิด',
               eq:'x²/a² + y²/b² = 1' },
  parabola:  { n:'🌈 พาราโบลา',    c:'#f472b6', e:'e = 1', etex:'e=1', tex:'y^2=4px',
               rule:'ระนาบ “ขนานกับเส้นกำเนิด” ของกรวย 1 เส้น จึงตัดแล้วเส้นโค้งเปิดออกไม่ปิดตัว (ตัดกรวยฝั่งเดียว)',
               eq:'y² = 4px' },
  hyperbola: { n:'🪁 ไฮเพอร์โบลา', c:'#60a5fa', e:'e > 1', etex:'e>1', tex:'\\dfrac{x^2}{a^2}-\\dfrac{y^2}{b^2}=1',
               rule:'ระนาบชันกว่าเส้นกำเนิด จึงตัดกรวย “ทั้งสองฝั่ง” ได้เส้นโค้ง 2 กิ่ง',
               eq:'x²/a² − y²/b² = 1' }
};

const S = { th:0, yaw:.6, pit:.34, open:false, raf:0, last:0, idle:0, spin:false, spinV:0, drag:null, tw:null, type:'', dpr:1 };
const classify = d => d < .5 ? 'circle' : Math.abs(d - TH_PAR) < .6 ? 'parabola' : d < TH_PAR ? 'ellipse' : 'hyperbola';

/* ---------- คำนวณเส้นตัดจริง: ยิงเส้นกำเนิดทุกทิศ φ แล้วหาจุดที่ชนระนาบ ---------- */
function section(th){
  const ct = Math.cos(th), st = Math.sin(th), ca = Math.cos(AL), sa = Math.sin(AL), N = 720, out = [];
  for (let i = 0; i < N; i++){
    const ph = i / N * TAU, D = ct * ca + st * sa * Math.cos(ph);
    let q = null;
    if (Math.abs(D) > 1e-6){
      const t = ct * Z0 / D, z = t * ca;          // t < 0 = กรวยฝั่งล่าง
      if (Math.abs(z) <= H) q = { p:[t * sa * Math.cos(ph), t * sa * Math.sin(ph), z], s: D > 0 ? 1 : -1 };
    }
    out.push(q);
  }
  return out;
}
function runs(pts){                                // แบ่งเป็นช่วงต่อเนื่อง (1 วง หรือ 1–2 กิ่ง)
  const N = pts.length, k0 = pts.findIndex(q => !q);
  if (k0 < 0) return [{ closed:true, a:pts.slice() }];
  const out = []; let cur = null;
  for (let j = 1; j <= N; j++){
    const q = pts[(k0 + j) % N];
    if (q && cur && cur.s === q.s) cur.a.push(q);
    else { if (cur) out.push(cur); cur = q ? { s:q.s, a:[q], closed:false } : null; }
  }
  if (cur) out.push(cur);
  return out;
}
function proj(p, W, Hh, sc){
  const c = Math.cos(S.yaw), s = Math.sin(S.yaw), cp = Math.cos(S.pit), sp = Math.sin(S.pit);
  const x1 = p[0] * c - p[1] * s, y1 = p[0] * s + p[1] * c;
  return [W / 2 + sc * x1, Hh / 2 - sc * (y1 * sp + p[2] * cp), -y1 * cp + p[2] * sp];
}
function fit(cv){
  S.dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = cv.clientWidth, h = cv.clientHeight;
  if (cv.width !== Math.round(w * S.dpr) || cv.height !== Math.round(h * S.dpr)){ cv.width = Math.round(w * S.dpr); cv.height = Math.round(h * S.dpr); }
}
const path = (g, pts, close) => { g.beginPath(); pts.forEach((v, i) => i ? g.lineTo(v[0], v[1]) : g.moveTo(v[0], v[1])); if (close) g.closePath(); };

/* ---------- วาดโมเดล 3 มิติ ---------- */
function draw(){
  const cv = $('cnCv'); fit(cv);
  const g = cv.getContext('2d'), W = cv.clientWidth, Hh = cv.clientHeight, sc = Math.min(W, Hh) / 6.4;
  g.setTransform(S.dpr, 0, 0, S.dpr, 0, 0); g.clearRect(0, 0, W, Hh);
  const P = p => proj(p, W, Hh, sc), th = S.th * Math.PI / 180, ct = Math.cos(th), st = Math.sin(th), ta = Math.tan(AL);
  const col = TY[S.type].c;

  // ผิวกรวย (กระจกใส เรียงตามความลึก)
  const K = 36, R = 8, quads = [];
  for (const sg of [1, -1]) for (let r = 0; r < R; r++) for (let k = 0; k < K; k++){
    const z1 = H * r / R, z2 = H * (r + 1) / R, a1 = k / K * TAU, a2 = (k + 1) / K * TAU;
    const c = [[z1,a1],[z1,a2],[z2,a2],[z2,a1]].map(([z, a]) => P([z * ta * Math.cos(a), z * ta * Math.sin(a), sg * z]));
    quads.push({ c, d:(c[0][2] + c[1][2] + c[2][2] + c[3][2]) / 4 });
  }
  quads.sort((a, b) => a.d - b.d);
  g.lineWidth = .6; g.fillStyle = 'rgba(110,150,255,.13)'; g.strokeStyle = 'rgba(170,195,255,.26)';
  for (const o of quads){ path(g, o.c, true); g.fill(); g.stroke(); }
  g.strokeStyle = 'rgba(190,210,255,.75)'; g.lineWidth = 1.6;                        // ขอบปากกรวยบน/ล่าง
  for (const sg of [1, -1]){ const ring = []; for (let k = 0; k <= 72; k++){ const a = k / 72 * TAU; ring.push(P([H * ta * Math.cos(a), H * ta * Math.sin(a), sg * H])); } path(g, ring); g.stroke(); }
  g.setLineDash([5, 5]); g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 1;   // แกนกรวย
  path(g, [P([0, 0, -H - .3]), P([0, 0, H + .3])]); g.stroke(); g.setLineDash([]);
  const ap = P([0, 0, 0]); g.fillStyle = '#fff'; g.beginPath(); g.arc(ap[0], ap[1], 3, 0, TAU); g.fill();

  // ระนาบตัด
  const pl = [[-1,-1],[1,-1],[1,1],[-1,1]].map(([a, b]) => P([a * 2.3 * ct, b * 1.8, Z0 - a * 2.3 * st]));
  g.fillStyle = 'rgba(255,255,255,.07)'; path(g, pl, true); g.fill();

  // หน้าตัด
  const rs = runs(section(th));
  for (const r of rs){
    const pp = r.a.map(q => P(q.p));
    g.globalAlpha = .55; g.fillStyle = col; path(g, pp, true); g.fill(); g.globalAlpha = 1;
    g.strokeStyle = col; g.lineWidth = 3.5; g.lineJoin = 'round'; path(g, pp, r.closed); g.stroke();
  }
  g.setLineDash([6, 4]); g.strokeStyle = 'rgba(255,255,255,.6)'; g.lineWidth = 1.4; path(g, pl, true); g.stroke(); g.setLineDash([]);

  drawFlat(rs, th, col);
}

/* ---------- หน้าตัดที่ถูกวางแบนให้ดูรูปร่างจริง ---------- */
function drawFlat(rs, th, col){
  const cv = $('cnFlat'); fit(cv);
  const g = cv.getContext('2d'), W = cv.clientWidth, Hh = cv.clientHeight, ct = Math.cos(th), st = Math.sin(th);
  g.setTransform(S.dpr, 0, 0, S.dpr, 0, 0); g.clearRect(0, 0, W, Hh);
  const uv = rs.map(r => r.a.map(q => [q.p[0] * ct - (q.p[2] - Z0) * st, q.p[1]]));
  let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
  uv.forEach(a => a.forEach(([u, v]) => { x0 = Math.min(x0, u); x1 = Math.max(x1, u); y0 = Math.min(y0, v); y1 = Math.max(y1, v); }));
  const s = .78 * Math.min(W, Hh) / Math.max(x1 - x0, y1 - y0, .3), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  const T = ([u, v]) => [W / 2 + (u - cx) * s, Hh / 2 - (v - cy) * s];
  g.strokeStyle = 'rgba(160,180,255,.3)'; g.lineWidth = 1;
  const o = T([0, 0]); path(g, [[0, o[1]], [W, o[1]]]); g.stroke(); path(g, [[o[0], 0], [o[0], Hh]]); g.stroke();
  uv.forEach((a, i) => {
    const pp = a.map(T);
    g.globalAlpha = .5; g.fillStyle = col; path(g, pp, true); g.fill(); g.globalAlpha = 1;
    g.strokeStyle = col; g.lineWidth = 3; path(g, pp, rs[i].closed); g.stroke();
  });
}

/* ---------- ข้อความอธิบาย + ปุ่ม ---------- */
function setInfo(){
  const t = TY[S.type];
  $('cnName').textContent = t.n; $('cnName').style.color = t.c;
  $('cnRule').textContent = t.rule; window.mgTex($('cnEqK'), t.tex, t.eq);
  document.querySelectorAll('#conicScreen .cn-btn').forEach(b => b.classList.toggle('on', b.dataset.t === S.type));
}
function goTo(deg){ S.tw = { a:S.th, b:deg, t0:performance.now(), d:1000 }; S.idle = performance.now(); }

function frame(now){
  if (!S.open) return;
  S.raf = requestAnimationFrame(frame);
  const dt = Math.min(50, now - (S.last || now)); S.last = now;
  if (S.tw){
    const k = Math.min(1, (now - S.tw.t0) / S.tw.d), e = k < .5 ? 2 * k * k : 1 - 2 * (1 - k) * (1 - k);
    S.th = S.tw.a + (S.tw.b - S.tw.a) * e; $('cnRange').value = S.th;
    if (k >= 1) S.tw = null;
  }
  if (S.spin && !S.drag){                                              // จิ้ม 2 ที → หมุนโชว์อัตโนมัติ (ค่อย ๆ เร่ง)
    S.spinV = Math.min(.0016, (S.spinV || 0) + dt * .000006);
    S.yaw += dt * S.spinV;
  } else if (!S.drag && now - S.idle > 2500) S.yaw += dt * .0002;
  const ty = classify(S.th); if (ty !== S.type){ S.type = ty; setInfo(); }
  $('cnDeg').textContent = (Math.round(S.th * 10) / 10) + '°';
  const ev = (Math.sin(S.th * Math.PI / 180) / Math.cos(AL)).toFixed(2), ek = ty + ev;
  if (ek !== S.ek){ S.ek = ek; window.mgTex($('cnE'), TY[ty].etex + '\\quad(e\\approx ' + ev + ')', TY[ty].e + '  (e ≈ ' + ev + ')'); }
  draw();
}

function build(){
  if ($('conicScreen')) return;
  const el = document.createElement('div');
  el.className = 'cn-screen'; el.id = 'conicScreen';
  el.innerHTML = `
    <div class="cn-top">
      <button class="back-btn" id="cnBack" aria-label="ย้อนกลับ"><img src="Icon/back.png" alt="ย้อนกลับ"></button>
      <div class="cn-title">🔺 ภาคตัดกรวย</div>
      <button class="cn-play" id="cnPlay">🎮 เล่นเกม!</button>
    </div>
    <div class="cn-view"><canvas id="cnCv"></canvas><div class="cn-hint" id="cnHint">👆 ลากนิ้วเพื่อหมุนดู · จิ้ม 2 ทีให้หมุนโชว์อัตโนมัติ</div></div>
    <div class="cn-panel">
      <div class="cn-btns">
        <button class="cn-btn" data-t="circle" style="--c:#4ade80">วงกลม</button>
        <button class="cn-btn" data-t="ellipse" style="--c:#fbbf24">วงรี</button>
        <button class="cn-btn" data-t="parabola" style="--c:#f472b6">พาราโบลา</button>
        <button class="cn-btn" data-t="hyperbola" style="--c:#60a5fa">ไฮเพอร์โบลา</button>
      </div>
      <div class="cn-slide"><span>เอียงระนาบ</span><input type="range" id="cnRange" min="0" max="80" step="0.5" value="0"><b id="cnDeg">0°</b></div>
      <div class="cn-note">เส้นกำเนิดทำมุม <span id="cnN1"></span> กับแกน · ระนาบขนานเส้นกำเนิดเมื่อเอียง <span id="cnN2"></span></div>
      <div class="cn-info">
        <canvas id="cnFlat" class="cn-flat"></canvas>
        <div class="cn-txt">
          <div class="cn-name" id="cnName"></div>
          <div id="cnRule"></div>
          <div class="cn-eq cn-eqrow">สมการมาตรฐาน: <span id="cnEqK"></span></div>
          <div class="cn-eq cn-erow"><span id="cnE"></span></div>
        </div>
      </div>
    </div>`;
  (document.getElementById('dashboard') || document.body).appendChild(el);

  window.mgTex($('cnN1'), '\\alpha=35^\\circ', 'α = 35°'); window.mgTex($('cnN2'), '90^\\circ-35^\\circ=55^\\circ', '90° − 35° = 55°');
  $('cnBack').addEventListener('click', closeConic);
  $('cnPlay').addEventListener('click', openGame);
  el.querySelectorAll('.cn-btn').forEach(b => b.addEventListener('click', () => goTo(PRESET[b.dataset.t])));
  $('cnRange').addEventListener('input', e => { S.tw = null; S.th = +e.target.value; S.idle = performance.now(); });

  const cv = $('cnCv');
  const setSpin = on => {
    S.spin = on; S.spinV = 0; S.idle = performance.now();
    $('cnHint').textContent = on ? '🔄 กำลังหมุนโชว์ · จิ้ม 2 ทีอีกครั้งหรือลากนิ้วเพื่อหยุด'
                                 : '👆 ลากนิ้วเพื่อหมุนดู · จิ้ม 2 ทีให้หมุนโชว์อัตโนมัติ';
  };
  S.setSpin = setSpin;
  let lastTap = 0, tapX = 0, tapY = 0, moved = 0;
  cv.addEventListener('pointerdown', e => {
    S.drag = { x:e.clientX, y:e.clientY }; moved = 0; cv.setPointerCapture(e.pointerId);
  });
  cv.addEventListener('pointermove', e => {
    if (!S.drag) return;
    moved += Math.abs(e.clientX - S.drag.x) + Math.abs(e.clientY - S.drag.y);
    if (moved > 8 && S.spin) setSpin(false);                           // ลากเองเมื่อไหร่ → หยุดหมุนอัตโนมัติ
    S.yaw += (e.clientX - S.drag.x) * .01;
    S.pit = Math.max(.05, Math.min(1.2, S.pit + (e.clientY - S.drag.y) * .008));
    S.drag = { x:e.clientX, y:e.clientY }; S.idle = performance.now();
  });
  const up = () => { S.drag = null; S.idle = performance.now(); };
  cv.addEventListener('pointerup', e => {
    up();
    if (moved > 8) { lastTap = 0; return; }                            // เป็นการลาก ไม่ใช่การจิ้ม
    const now = performance.now();
    if (now - lastTap < 350 && Math.hypot(e.clientX - tapX, e.clientY - tapY) < 30){ lastTap = 0; setSpin(!S.spin); }
    else { lastTap = now; tapX = e.clientX; tapY = e.clientY; }
  });
  cv.addEventListener('pointercancel', up);
}

function openConicScreen(){
  build();
  S.open = true; S.th = 0; S.tw = null; S.type = ''; S.ek = ''; S.last = 0; S.idle = performance.now(); S.yaw = .6; S.pit = .34;
  $('cnRange').value = 0;
  if (S.setSpin) S.setSpin(false); else S.spin = false;
  $('conicScreen').style.display = 'flex';
  cancelAnimationFrame(S.raf); S.raf = requestAnimationFrame(frame);
}
function closeConic(){
  S.open = false; cancelAnimationFrame(S.raf);
  $('conicScreen').style.display = 'none';
  if (window.mgHubReturn) window.mgHubReturn();
}

/* =====================================================================
   🚀 ปุ่ม "เล่นเกม!" มุมขวาบน → เกมประกอบยานอวกาศ (โหมดวงกลม + วงรี)
   • เริ่มด้วยมุมมอง 2D มองจากด้านบนของยาน มีเส้นประสีฟ้าบอกชิ้นส่วนที่ต้องประกอบ
   • เติมสมการให้ถูก → กล้องเอียงเป็น 3D หมุนรอบยาน แล้ววงแหวนหล่นลงมาครอบชิ้นส่วนพอดี
       วงกลม  (x − h)² + (y − k)² = r²           (ช่อง h, k, r²)
       วงรี   (x − h)²/a² + (y − k)²/b² = 1       (ช่อง h, a², k, b²  เรียงตามที่เห็นบนจอ)
   • ลำตัวยาน (วงกลมรัศมี 2 กลางจอ) ประกอบไว้แล้ว · 5 ชิ้นส่วนที่ผู้เล่นต้องประกอบ (กล้องซูมเข้าหาชิ้นที่ทำ แล้วซูมออกก่อนไปชิ้นถัดไป)
       1) ไอพ่นซ้าย  วงกลม รัศมี 2 จุดศูนย์กลาง C(−6, 0)      2) ไอพ่นขวา  สมการวงกลมเดิม เปลี่ยนแค่จุดศูนย์กลางเป็น C(6, 0)
       3) เกราะป้องกัน  วงรี x²/16 + y²/9 = 1 ครอบตัวยาน แตะไอพ่นสองข้างที่ (±4, 0)
       4) ฐานโค้ง  พาราโบลา x² = 4(y + 4) ผ่านจุดที่ยานต่อกับไอพ่น ลากลงตามแกน z ยาวเท่าไอพ่น (1.7)
       5) ปีกข้าง  ไฮเพอร์โบลา x²/64 − y²/16 = 1 อยู่ข้างไอพ่นทั้งสอง )o0o(
   • หน้าตายาน: จรวดมีครีบ แถบสี ช่องหน้าต่าง หัวกรวย+เสาอากาศ / ถังเชื้อเพลิงมีแถบ / เครื่องยนต์มีท่อพ่นไฟ /
                ห้องสื่อสารมีเสา / แผงโซลาร์และจานเรดาร์เป็นแผ่นวงรี · ประกอบครบแล้วเครื่องยนต์พ่นไฟ
===================================================================== */
const GP = [   // ชิ้นส่วนของยาน: c = จุดศูนย์กลาง, r2 (วงกลม) / a2,b2 (วงรี, ไฮเพอร์โบลา) / par (พาราโบลา), hz = ความสูง, fitz = ความสูงที่วงแหวนมาครอบ, cam = มุมกล้อง [x, y, ซูม]
  { n:'ลำตัวยาน',   kind:'hull',   c:[0, 0],  r2:4, hz:5.4, fitz:1.3, col:'#dfe7ff', mode:'graph', pre:true, cam:[0, 0, 1],      // ประกอบไว้แล้วตั้งแต่เริ่ม (ไม่ใช่โจทย์)
    bands:[[0, .32, '#59627c'], [.32, 3.2, '#dfe7ff'], [3.2, 3.7, '#e74f66'], [3.7, 5.4, '#dfe7ff']] },
  // ไอพ่น 2 ตัว: วงกลมรัศมี 2 (r² = 4) สมการเหมือนกัน เปลี่ยนแค่จุดศูนย์กลาง · ขอบในอยู่ที่ x = ±4 ขอบนอกที่ x = ±8
  { n:'ไอพ่นซ้าย',  kind:'engine', c:[-6, 0], r2:4, hz:1.7, fitz:.7, col:'#ff9f68', mode:'radius', cam:[-6, 0, 2.4] },
  { n:'ไอพ่นขวา',   kind:'engine', c:[6, 0],  r2:4, hz:1.7, fitz:.7, col:'#ff9f68', mode:'radius', cam:[6, 0, 2.4], note:'สมการวงกลมเหมือนไอพ่นซ้าย เปลี่ยนแค่จุดศูนย์กลาง' },
  // เกราะ: วงรี x²/16 + y²/9 = 1 ครอบตัวยาน ปลายแกนนอน (±4, 0) แตะขอบในของไอพ่นทั้งสองพอดี
  { n:'เกราะป้องกัน', kind:'shield', c:[0, 0],  a2:16, b2:9, hz:.3, fitz:.05, col:'#7df9ff', mode:'evtx', pts:[[-4, 0], [4, 0], [0, 3]], cam:[0, 0, 2] },
  // ฐานโค้ง: พาราโบลา (x − h)² = 4p(y − k) จุดยอด (0, −4) ผ่านจุดต่อยาน-ไอพ่น (±4, 0) → p = 1  (x² = 4(y + 4)) ลากลงตามแกน z สูงเท่าไอพ่น
  { n:'ฐานโค้ง',    kind:'base',   c:[0, -4], par:{ h:0, k:-4, p:1 }, hz:1.7, fitz:.7, col:'#9aa7e0', mode:'para', v:[0, -4], pts:[[-4, 0], [4, 0]], cam:[0, -1.5, 2] },
  // ปีกข้าง: ไฮเพอร์โบลา (x − h)²/a² − (y − k)²/b² = 1 จุดยอด (±8, 0) แตะขอบนอกไอพ่น ผ่านจุด (10, 3) → x²/64 − y²/16 = 1  รูป )o0o(
  { n:'ปีกข้าง',    kind:'wing',   c:[0, 0],  a2:64, b2:16, hyp:true, hz:1.7, fitz:.7, col:'#c4a2ff', mode:'hv', p:[10, 3], pts:[[-8, 0], [8, 0]], cam:[0, 0, 1.05] }
];
GP.forEach(m => {                                   // ครึ่งแกนตามแนวนอน rx และแนวตั้ง ry (วงกลม: เท่ากัน)
  m.ell = m.a2 != null;
  m.shape = m.hyp ? 'hyper' : m.ell ? 'ellipse' : m.par ? 'parab' : 'circle';
  m.rx = Math.sqrt(m.ell ? m.a2 : m.par ? 1 : m.r2); m.ry = Math.sqrt(m.ell ? m.b2 : m.par ? 1 : m.r2);
});
/* ---------- เส้นโค้งของฐาน (พาราโบลา) และปีก (ไฮเพอร์โบลา) ---------- */
function hypBranches(h, a2, k, b2, yr, n){          // ไฮเพอร์โบลาเปิดซ้าย-ขวา: คืน [กิ่งซ้าย, กิ่งขวา] แต่ละกิ่งคือ [[x,y],...] (ไล่ y จาก k−yr ถึง k+yr)
  const a = Math.sqrt(a2), L = [], R = [];
  for (let i = 0; i <= n; i++){ const y = k - yr + 2 * yr * i / n, d = a * Math.sqrt(1 + (y - k) * (y - k) / b2); L.push([h - d, y]); R.push([h + d, y]); }
  return [L, R];
}
function parabPts(h, p, k, xr, n){                  // พาราโบลาเปิดขึ้น/ลง (x − h)² = 4p(y − k) ไล่ x จาก h−xr ถึง h+xr
  const out = [];
  for (let i = 0; i <= n; i++){ const x = h - xr + 2 * xr * i / n; out.push([x, k + (x - h) * (x - h) / (4 * p)]); }
  return out;
}
function clipSegs(brs, lim, ox = 0, oy = 0){                        // ตัดช่วงที่ล้นพื้นแท่น (ใช้กับสมการผิดที่เส้นพุ่งออกไปไกล)
  const out = [];
  brs.forEach(br => { let cur = []; br.forEach(q => { if (Math.abs(q[0] - ox) <= lim && Math.abs(q[1] - oy) <= lim){ cur.push(q); } else { if (cur.length > 1) out.push(cur); cur = []; } }); if (cur.length > 1) out.push(cur); });
  return out;
}
const splitMid = br => { const m = br.length >> 1; return [br.slice(0, m + 1), br.slice(m)]; };   // แบ่งกิ่งครึ่งหนึ่ง เพื่อเรียงความลึกตอนวาด
const FLOOR = 12;                                   // พื้นแท่นกว้าง ±12 (ไฮเพอร์โบลาต้องมีที่ให้กางออกข้างไอพ่น)
const PARA_SEGS = (() => { const pts = parabPts(0, 1, -4, 4, 48); return [pts.slice(0, 17), pts.slice(16, 33), pts.slice(32)]; })();   // x จาก −4 ถึง 4 (ปลายสองข้างแตะไอพ่นพอดี)
const HYP_SEGS = hypBranches(0, 64, 0, 16, 4.2, 40).flatMap(splitMid);                                                              // y ±4.2 → x ≈ ±11.6
GP.find(m => m.kind === 'base').segs = PARA_SEGS;
GP.find(m => m.kind === 'wing').segs = HYP_SEGS;
/* ---------- สุ่มเลื่อน “ทั้งยาน” ไปพิกัดอื่นทุกครั้งที่เริ่มเล่น (ทุกชิ้นเลื่อนเท่ากัน รูปทรงและระยะห่างเหมือนเดิม) ---------- */
const GBASE = GP.map(m => ({ c:m.c.slice(), p:m.p && m.p.slice(), v:m.v && m.v.slice(), pts:m.pts && m.pts.map(q => q.slice()),
  par:m.par && { ...m.par }, cam:m.cam.slice(), segs:m.segs && m.segs.map(sg => sg.map(q => q.slice())) }));   // ค่าตั้งต้น (ลำตัวยานอยู่ที่ (0, 0))
const GOFF = { x:0, y:0 };                                       // ตำแหน่งจุดศูนย์กลางลำตัวยานตอนนี้
function gShift(ox, oy){
  GOFF.x = ox; GOFF.y = oy;
  GP.forEach((m, i) => { const b = GBASE[i];
    m.c = [b.c[0] + ox, b.c[1] + oy];
    if (b.p) m.p = [b.p[0] + ox, b.p[1] + oy];
    if (b.v) m.v = [b.v[0] + ox, b.v[1] + oy];
    if (b.pts) m.pts = b.pts.map(q => [q[0] + ox, q[1] + oy]);
    if (b.par) m.par = { h:b.par.h + ox, k:b.par.k + oy, p:b.par.p };      // จุดยอดเลื่อน แต่ p เท่าเดิม
    m.cam = [b.cam[0] + ox, b.cam[1] + oy, b.cam[2]];
    if (b.segs) m.segs = b.segs.map(sg => sg.map(q => [q[0] + ox, q[1] + oy]));
  });
}
function gRandShift(){                                           // สุ่มจำนวนเต็ม −6…6 ทั้ง x และ y ไม่ซ้ำ (0, 0) และไม่ซ้ำรอบก่อน
  const r = () => Math.floor(Math.random() * 13) - 6; let x, y;
  do { x = r(); y = r(); } while ((!x && !y) || (x === GOFF.x && y === GOFF.y));
  gShift(x, y);
}
const G = { shake:0, fl:null, bad:null, why:'', open:false, i:1, f:0, v:['', '', ''], phase:'2d', done:[true], pitch:Math.PI / 2, yaw:0, ringZ:0, ringA:0, flash:0, an:null, raf:0, last:0, drag:null, pk:'', zoom:1, cx:0, cy:0, ct:null };
const PI2 = Math.PI / 2, RING_H = .42, LIGHT = 2.2, KS = 44;
const gsg = n => String(n).replace('-', '−');
const gpt = p => `(${gsg(p[0])}, ${gsg(p[1])})`;
const ease = k => k < .5 ? 2 * k * k : 1 - 2 * (1 - k) * (1 - k);
const lerp = (a, b, t) => a + (b - a) * t;
const shade = (h, f) => { const n = parseInt(h.slice(1), 16); const c = x => Math.min(255, Math.round(x * f)); return `rgb(${c((n >> 16) & 255)},${c((n >> 8) & 255)},${c(n & 255)})`; };
const STARS = Array.from({ length:46 }, (_, i) => { const f = x => x - Math.floor(x); return [f(Math.sin(i * 12.9898) * 43758.5453), f(Math.sin(i * 78.233) * 12345.678)]; });
const nang = (t, rx, ry) => Math.atan2(Math.sin(t) / ry, Math.cos(t) / rx);          // ทิศตั้งฉากของผิวที่พารามิเตอร์ t (ใช้กับวงรี)
function bandsOf(m){                                                                  // แถบสีรอบตัวชิ้นส่วน [z0, z1, สี]
  if (m.bands) return m.bands;
  if (m.kind === 'panel') return [[0, m.hz, '#26356e']];
  if (m.kind === 'dish')  return [[0, m.hz, '#8c97b8']];
  if (m.kind === 'tank')  return [[0, .2, '#59627c'], [.2, .62, m.col], [.62, .98, '#fff1de'], [.98, m.hz - .2, m.col], [m.hz - .2, m.hz, '#e9efff']];
  return [[0, .2, '#59627c'], [.2, m.hz - .2, m.col], [m.hz - .2, m.hz, '#e9efff']];
}

/* ---------- วาดฉาก (กล้องปรับ pitch/yaw ได้: pitch = 90° คือมองตรงจากด้านบน) ---------- */
function gdraw(){
  const cv = $('cgCv'); fit(cv);
  const g = cv.getContext('2d'), W = cv.clientWidth, Hh = cv.clientHeight, sc = Math.min(W, Hh) / 27 * G.zoom;
  g.setTransform(S.dpr, 0, 0, S.dpr, 0, 0);
  const bg = g.createLinearGradient(0, 0, 0, Hh); bg.addColorStop(0, '#070b26'); bg.addColorStop(1, '#1a2260');
  g.fillStyle = bg; g.fillRect(0, 0, W, Hh);
  g.fillStyle = '#fff'; g.globalAlpha = .5; for (const [sx, sy] of STARS) g.fillRect(sx * W, sy * Hh, 1.5, 1.5); g.globalAlpha = 1;
  const now = performance.now();

  const cp = Math.cos(G.pitch), sp = Math.sin(G.pitch), cw = Math.cos(G.yaw), sw = Math.sin(G.yaw);
  const P = (x, y, z) => { x -= G.cx; y -= G.cy; const x1 = x * cw - y * sw, y1 = x * sw + y * cw; return [W / 2 + sc * x1, Hh / 2 - sc * (y1 * sp + (z - 3) * cp), -y1 * cp + z * sp]; };
  const facing = na => cp > .02 && -cp * Math.sin(na + G.yaw) > 0;     // ผนังด้านนอกที่หันเข้าหากล้อง (na = ทิศตั้งฉากของผนัง)
  const quad = (pts, fill) => { path(g, pts, true); g.fillStyle = fill; g.strokeStyle = fill; g.lineWidth = .7; g.fill(); g.stroke(); };
  const GOLD = { o:'#ffd84a', i:'#c9a21c', t:'#fff0a0' }, RED = { o:'#ff5a5a', i:'#a02828', t:'#ffc4c4' };
  const rp = (cx, cy, rx, ry, z, a) => P(cx + rx * Math.cos(a), cy + ry * Math.sin(a), z);
  const ringBack = (cx, cy, rx, ry, rz, al, B) => {                  // ผนังด้านในฝั่งไกล (วาดก่อนโมดูล)
    if (cp <= .02) return;
    const ex = rx + .03, ey = ry + .03;
    g.globalAlpha = al;
    for (let k = 0; k < KS; k++){ const a1 = k / KS * TAU, a2 = (k + 1) / KS * TAU, am = (a1 + a2) / 2;
      if (!facing(nang(am, rx, ry))) quad([rp(cx, cy, ex, ey, rz, a1), rp(cx, cy, ex, ey, rz, a2), rp(cx, cy, ex, ey, rz + RING_H, a2), rp(cx, cy, ex, ey, rz + RING_H, a1)], shade(B.i, .55)); }
    g.globalAlpha = 1;
  };
  const ringFront = (cx, cy, rx, ry, rz, al, B, hz) => {             // ผนังด้านนอกฝั่งใกล้ + หน้าบน
    const ix = rx + .03, iy = ry + .03, ox = rx + .17, oy = ry + .17, above = rz + RING_H >= hz;
    g.globalAlpha = al;
    for (let k = 0; k < KS; k++){ const a1 = k / KS * TAU, a2 = (k + 1) / KS * TAU, am = (a1 + a2) / 2, na = nang(am, rx, ry), fc = facing(na);
      if (fc) quad([rp(cx, cy, ox, oy, rz, a1), rp(cx, cy, ox, oy, rz, a2), rp(cx, cy, ox, oy, rz + RING_H, a2), rp(cx, cy, ox, oy, rz + RING_H, a1)], shade(B.o, .55 + .6 * (.5 + .5 * Math.cos(na - LIGHT))));
      if (cp <= .05 || above || fc) quad([rp(cx, cy, ix, iy, rz + RING_H, a1), rp(cx, cy, ox, oy, rz + RING_H, a1), rp(cx, cy, ox, oy, rz + RING_H, a2), rp(cx, cy, ix, iy, rz + RING_H, a2)], shade(B.t, .85 + .2 * Math.cos(na - LIGHT)));
    }
    g.globalAlpha = 1;
  };

  // ริบบิ้นสีทองที่หล่นลงมาครอบเส้นโค้งไฮเพอร์โบลา (กำแพงบางๆ ตามแนวเส้นโค้ง เรียงตามความลึก)
  const ribbonSegs = (segs, z, al, B, dx) => {
    if (z == null || al <= 0) return;
    const Q = [], w = .18, ox = dx || 0;
    for (const sgm of segs) for (let i = 0; i < sgm.length - 1; i++){
      const x0 = sgm[i][0] + ox, y0 = sgm[i][1], x1 = sgm[i + 1][0] + ox, y1 = sgm[i + 1][1], ddx = x1 - x0, ddy = y1 - y0, L = Math.hypot(ddx, ddy) || 1;
      const nx = -ddy / L * w, ny = ddx / L * w, na = Math.atan2(ddx, -ddy), f = .62 + .5 * Math.abs(Math.cos(na - LIGHT));
      const at = (x, y, zz, sgn) => P(x + sgn * nx, y + sgn * ny, zz), zt = z + RING_H;
      const A1 = at(x0, y0, z, 1), A2 = at(x1, y1, z, 1), A3 = at(x1, y1, zt, 1), A4 = at(x0, y0, zt, 1);
      const B1 = at(x0, y0, z, -1), B2 = at(x1, y1, z, -1), B3 = at(x1, y1, zt, -1), B4 = at(x0, y0, zt, -1);
      Q.push({ q:[A1, A2, A3, A4], d:(A1[2] + A2[2] + A3[2] + A4[2]) / 4, c:shade(B.o, f) });
      Q.push({ q:[B1, B2, B3, B4], d:(B1[2] + B2[2] + B3[2] + B4[2]) / 4, c:shade(B.o, f * .9) });
      Q.push({ q:[B4, B3, A3, A4], d:(A3[2] + A4[2] + B3[2] + B4[2]) / 4 + .02, c:shade(B.t, .9 + .15 * Math.cos(na - LIGHT)) });
    }
    Q.sort((a, b) => a.d - b.d);
    g.globalAlpha = al; for (const o of Q) quad(o.q, o.c); g.globalAlpha = 1;
  };
  // กำแพงโค้ง: เส้นโค้งที่ลากลงตามแกน z (ฐานพาราโบลา / ปีกไฮเพอร์โบลา) สูง hz เท่าไอพ่น หนาเล็กน้อย
  const curveWall = (seg, m) => {
    const Q = [], w = .13, z0 = 0, z1 = m.hz;
    for (let i = 0; i < seg.length - 1; i++){
      const x0 = seg[i][0], y0 = seg[i][1], x1 = seg[i + 1][0], y1 = seg[i + 1][1], ddx = x1 - x0, ddy = y1 - y0, L = Math.hypot(ddx, ddy) || 1;
      const nx = -ddy / L * w, ny = ddx / L * w, na = Math.atan2(ddx, -ddy), f = .5 + .5 * Math.abs(Math.cos(na - LIGHT));
      const at = (x, y, z, sg) => P(x + sg * nx, y + sg * ny, z);
      const A1 = at(x0, y0, z0, 1), A2 = at(x1, y1, z0, 1), A3 = at(x1, y1, z1, 1), A4 = at(x0, y0, z1, 1);
      const B1 = at(x0, y0, z0, -1), B2 = at(x1, y1, z0, -1), B3 = at(x1, y1, z1, -1), B4 = at(x0, y0, z1, -1);
      Q.push({ q:[A1, A2, A3, A4], d:(A1[2] + A2[2] + A3[2] + A4[2]) / 4, c:shade(m.col, .55 + .6 * f) });
      Q.push({ q:[B1, B2, B3, B4], d:(B1[2] + B2[2] + B3[2] + B4[2]) / 4, c:shade(m.col, .5 + .5 * f) });
      Q.push({ q:[B4, B3, A3, A4], d:(A3[2] + A4[2] + B3[2] + B4[2]) / 4 + .02, c:shade('#e9efff', .85 + .15 * f) });
    }
    Q.sort((a, b) => a.d - b.d);
    for (const o of Q) quad(o.q, o.c);
  };

  // พื้นแท่นประกอบ (เลื่อนตามยาน) + ตารางพิกัด · แกน x, y ยังอยู่ที่ (0, 0) จริง ผู้เล่นต้องอ่านพิกัดที่เลื่อนไปเอง
  const FX = GOFF.x, FY = GOFF.y;
  path(g, [[FX - FLOOR, FY - FLOOR], [FX + FLOOR, FY - FLOOR], [FX + FLOOR, FY + FLOOR], [FX - FLOOR, FY + FLOOR]].map(([x, y]) => P(x, y, 0)), true);
  g.fillStyle = 'rgba(28,40,110,.78)'; g.fill(); g.strokeStyle = '#3a4a9a'; g.lineWidth = 2; g.stroke();
  for (let i = -FLOOR; i <= FLOOR; i++){
    const gx = FX + i, gy = FY + i;
    g.strokeStyle = gx ? 'rgba(140,170,255,.16)' : 'rgba(180,200,255,.6)'; g.lineWidth = gx ? 1 : 1.6;
    path(g, [P(gx, FY - FLOOR, 0), P(gx, FY + FLOOR, 0)]); g.stroke();
    g.strokeStyle = gy ? 'rgba(140,170,255,.16)' : 'rgba(180,200,255,.6)'; g.lineWidth = gy ? 1 : 1.6;
    path(g, [P(FX - FLOOR, gy, 0), P(FX + FLOOR, gy, 0)]); g.stroke();
  }
  const la = Math.max(0, Math.min(1, (G.pitch - 1.0) / .45));
  const drawAxisNums = () => {                                         // ตัวเลขบนแกน x, y — วาดเป็นชั้นบนสุดของฉาก (มีขอบเข้มกันกลืนกับชิ้นส่วน)
    if (la <= 0) return;
    g.save(); g.globalAlpha = la; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round';
    const tx = (t, q, fill) => { g.strokeStyle = 'rgba(6,10,40,.92)'; g.lineWidth = 3.2; g.strokeText(t, q[0], q[1]); g.fillStyle = fill; g.fillText(t, q[0], q[1]); };
    g.font = '700 10px "Baloo 2", sans-serif';
    const stp = sc >= 20 ? 1 : 2;                                       // ซูมออกแล้วตัวเลขแน่น → เว้นทีละ 2
    for (let i = -FLOOR; i <= FLOOR; i++){ const gx = FX + i, gy = FY + i;
      if (gx && !(gx % stp)) tx(gsg(gx), P(gx, -.6, 0), '#d6dfff');
      if (gy && !(gy % stp)) tx(gsg(gy), P(-.7, gy, 0), '#d6dfff'); }
    tx('O', P(-.6, -.6, 0), '#d6dfff');
    g.font = '700 12px "Baloo 2", sans-serif'; tx('x', P(FX + FLOOR + .8, .7, 0), '#ffd84a'); tx('y', P(.7, FY + FLOOR + .8, 0), '#ffd84a');
    g.restore();
  };

  // ชิ้นส่วนที่ยังไม่ถึงคิวจะซ่อนไว้ (เห็นแค่เส้นประเป้าหมาย) · โผล่ออกมาเมื่อตอบถูกและวงแหวนหล่นลงมาถึงครึ่งทาง
  const shown = i => GP[i].pre || G.done[i] || !!(G.an && G.an.type === 'up' && i === G.i && (now - G.an.t0) / G.an.d >= .45);
  // โครงเชื่อมระหว่างโมดูล (ท่อโลหะ)
  g.lineCap = 'round';
  for (let i = 1; i < GP.length; i++){
    if (GP[i].kind !== 'engine' || !shown(i)) continue;
    const z = Math.min(.45, GP[i].hz * .7), a = P(GP[0].c[0], GP[0].c[1], z), b = P(GP[i].c[0], GP[i].c[1], z);
    g.strokeStyle = '#2c3668'; g.lineWidth = sc * .38; path(g, [a, b]); g.stroke();
    g.strokeStyle = '#7f8fd0'; g.lineWidth = sc * .22; path(g, [a, b]); g.stroke();
    g.strokeStyle = 'rgba(255,255,255,.38)'; g.lineWidth = sc * .06; path(g, [[a[0], a[1] - sc * .05], [b[0], b[1] - sc * .05]]); g.stroke();
  }

  // เปลวไฟท้ายจรวดและไอพ่น — ขึ้นเมื่อประกอบครบทุกชิ้น
  if (GP.every((_, i) => G.done[i])){
    GP.forEach((part, pi) => {
      if (part.kind !== 'hull' && part.kind !== 'engine') return;
      const fl = (part.kind === 'hull' ? 1.8 : 1.4) + .45 * Math.sin(now / 70 + pi) + .25 * Math.sin(now / 33 + pi);
      for (const [rf, zf, col] of [[.62, fl, 'rgba(255,120,40,.55)'], [.4, fl * .78, 'rgba(255,190,70,.8)'], [.2, fl * .5, 'rgba(255,250,200,.95)']]){
        const tip = P(part.c[0], part.c[1], -zf), pts = [];
        for (let k = 0; k < 24; k++){ const a = k / 24 * TAU; pts.push(P(part.c[0] + part.rx * rf * Math.cos(a), part.c[1] + part.ry * rf * Math.sin(a), .05)); }
        for (let k = 0; k < 24; k++) quad([pts[k], pts[(k + 1) % 24], tip], col);
      }
    });
  }

  // โมดูลทั้งหมด (เรียงไกล → ใกล้)
  const shi = GP.findIndex(m => m.kind === 'shield'), sh = GP[shi];            // เกราะวงรี: วงแหวนครอบทั้งยาน วาดแยกจากชิ้นอื่น
  const sRz = G.done[shi] ? sh.fitz : (G.an && G.an.type === 'up' && shi === G.i && G.ringA > 0 ? G.ringZ : null), sRa = G.done[shi] ? 1 : G.ringA;
  if (sRz != null) ringBack(sh.c[0], sh.c[1], sh.rx, sh.ry, sRz, sRa, GOLD);
  const order = GP.map((m, i) => ({ m, i, d:P(m.c[0], m.c[1], m.hz / 2)[2] })).filter(o => o.m.kind !== 'shield' && !o.m.segs);
  GP.forEach((m, i) => { if (m.segs) m.segs.forEach((sg, j) => { const q = sg[sg.length >> 1]; order.push({ m, i, br:j, d:P(q[0], q[1], m.hz / 2)[2] }); }); });   // เส้นโค้งแต่ละท่อนเข้าคิวเรียงความลึกด้วย
  order.sort((a, b) => a.d - b.d);
  const fins = (m, far) => {                                         // ครีบหาง 4 ด้านของลำตัว (far = ครีบฝั่งไกลวาดก่อนผนัง)
    for (let k = 0; k < 4; k++){
      const a = k * PI2; if ((Math.sin(a + G.yaw) > 0) !== far) continue;
      const ca = Math.cos(a), sa = Math.sin(a), r = m.rx, L = .8, t = .1, f = .75 + .35 * Math.cos(a - LIGHT);
      const at = (d, z, o) => P(m.c[0] + ca * d - sa * o, m.c[1] + sa * d + ca * o, z);
      const A = [at(r - .05, .12, t), at(r + L, .12, t), at(r - .05, 2.1, t)], B = [at(r - .05, .12, -t), at(r + L, .12, -t), at(r - .05, 2.1, -t)];
      quad(B, shade('#b93a50', f * .8)); quad([A[1], B[1], B[2], A[2]], shade('#ff7b8f', f)); quad(A, shade('#e74f66', f));
    }
  };
  for (const { m, i, br } of order){
    if (br != null){ if (shown(i)) curveWall(m.segs[br], m); continue; }
    const rx = m.rx, ry = m.ry, cx = m.c[0], cy = m.c[1];
    const rz = m.pre ? null : G.done[i] ? m.fitz : (G.an && G.an.type === 'up' && i === G.i && G.ringA > 0 ? G.ringZ : null);
    const ra = G.done[i] ? 1 : G.ringA;
    if (!shown(i)){ if (rz != null){ ringBack(cx, cy, rx, ry, rz, ra, GOLD); ringFront(cx, cy, rx, ry, rz, ra, GOLD, m.hz); } continue; }   // ชิ้นที่ยังไม่โผล่: เห็นแค่วงแหวนที่กำลังหล่นลงมา
    const wp = (fx, fy, z, a) => P(cx + fx * Math.cos(a), cy + fy * Math.sin(a), z);

    if (m.kind === 'hull') fins(m, true);
    if (rz != null) ringBack(cx, cy, rx, ry, rz, ra, GOLD);
    const bands = bandsOf(m);
    for (let k = 0; k < KS; k++){                                   // ผนังข้างของโมดูล (แยกเป็นแถบสี)
      const a1 = k / KS * TAU, a2 = (k + 1) / KS * TAU, am = (a1 + a2) / 2, na = nang(am, rx, ry);
      if (!facing(na)) continue;
      const lf = .4 + .75 * (.5 + .5 * Math.cos(na - LIGHT));
      for (const [z0, z1, c] of bands) quad([wp(rx, ry, z0, a1), wp(rx, ry, z0, a2), wp(rx, ry, z1, a2), wp(rx, ry, z1, a1)], shade(c, lf));
    }
    if (m.kind === 'hull'){
      fins(m, false);
      for (let j = 0; j < 8; j++){                                  // ช่องหน้าต่างกลมรอบลำตัว
        const t = j * TAU / 8 + .2, fv = -Math.sin(t + G.yaw);
        if (cp <= .15 || fv <= .12) continue;
        const q = wp(rx, ry, 4.5, t), wr = .42 * sc, hx = wr * fv, hy = wr * cp;
        g.beginPath(); g.ellipse(q[0], q[1], hx * 1.2, hy * 1.2, 0, 0, TAU); g.fillStyle = '#2a3556'; g.fill();
        const gl = g.createRadialGradient(q[0] - hx * .3, q[1] - hy * .3, 1, q[0], q[1], Math.max(hx, hy));
        gl.addColorStop(0, '#d8f2ff'); gl.addColorStop(1, '#2a7fd0');
        g.beginPath(); g.ellipse(q[0], q[1], hx, hy, 0, 0, TAU); g.fillStyle = gl; g.fill();
      }
      const tri = [], ap = P(cx, cy, m.hz + 2.6);                   // หัวจรวด (กรวย) + เสาอากาศ
      for (let k = 0; k < KS; k++){ const a1 = k / KS * TAU, a2 = (k + 1) / KS * TAU, p1 = wp(rx, ry, m.hz, a1), p2 = wp(rx, ry, m.hz, a2);
        tri.push({ pts:[p1, p2, ap], d:(p1[2] + p2[2] + ap[2]) / 3, f:.4 + .8 * (.5 + .5 * Math.cos((a1 + a2) / 2 - LIGHT)) }); }
      tri.sort((a, b) => a.d - b.d);
      for (const t of tri) quad(t.pts, shade('#e74f66', t.f));
      const ant = P(cx, cy, m.hz + 3.5); g.strokeStyle = '#f2f5ff'; g.lineWidth = 2; path(g, [ap, ant]); g.stroke();
      g.fillStyle = '#ffd84a'; g.beginPath(); g.arc(ant[0], ant[1], 2.6, 0, TAU); g.fill();
    } else {                                                        // ฝาบนของโมดูล
      const top = []; for (let k = 0; k < KS; k++) top.push(wp(rx, ry, m.hz, k / KS * TAU));
      const c0 = P(cx, cy, m.hz), rs = Math.max(rx, ry) * sc;
      if (m.kind === 'panel'){                                      // แผงโซลาร์: ช่องเซลล์สีฟ้า
        const p1 = P(cx - rx, cy, m.hz), p2 = P(cx + rx, cy, m.hz), lg = g.createLinearGradient(p1[0], p1[1], p2[0], p2[1]);
        lg.addColorStop(0, shade(m.col, 1.3)); lg.addColorStop(1, shade(m.col, .62));
        path(g, top, true); g.fillStyle = lg; g.fill();
        g.strokeStyle = 'rgba(255,255,255,.4)'; g.lineWidth = 1;
        for (const u of [-.75, -.5, -.25, 0, .25, .5, .75]){ const d = Math.sqrt(1 - u * u); path(g, [P(cx + u * rx, cy - ry * d, m.hz), P(cx + u * rx, cy + ry * d, m.hz)]); g.stroke(); }
        for (const v of [-.5, 0, .5]){ const d = Math.sqrt(1 - v * v); path(g, [P(cx - rx * d, cy + v * ry, m.hz), P(cx + rx * d, cy + v * ry, m.hz)]); g.stroke(); }
        path(g, top, true); g.strokeStyle = '#e9efff'; g.lineWidth = 1.8; g.stroke();
      } else {
        const gr = g.createRadialGradient(c0[0] - rs * .3, c0[1] - rs * .3, 2, c0[0], c0[1], rs * 1.05);
        gr.addColorStop(0, shade(m.col, 1.3)); gr.addColorStop(1, shade(m.col, .72));
        path(g, top, true); g.fillStyle = gr; g.fill(); g.strokeStyle = shade(m.col, .55); g.lineWidth = 1.2; g.stroke();
        if (m.kind === 'dish'){                                     // จานเรดาร์: วงซ้อนกัน + ก้านรับสัญญาณ
          for (const f of [.74, .48, .22]){ const ring = []; for (let k = 0; k <= KS; k++) ring.push(wp(rx * f, ry * f, m.hz, k / KS * TAU)); path(g, ring); g.strokeStyle = 'rgba(40,50,100,.35)'; g.lineWidth = 1.4; g.stroke(); }
          const feed = P(cx, cy, m.hz + 1); g.strokeStyle = '#e9efff'; g.lineWidth = 2; path(g, [c0, feed]); g.stroke();
          g.fillStyle = '#ff5a5a'; g.beginPath(); g.arc(feed[0], feed[1], 3, 0, TAU); g.fill();
        } else {
          const inner = []; for (let k = 0; k <= KS; k++) inner.push(wp(rx * .55, ry * .55, m.hz, k / KS * TAU));
          path(g, inner); g.strokeStyle = 'rgba(0,0,0,.28)'; g.lineWidth = 1.4; g.stroke();
          if (m.kind === 'engine'){                                 // ท่อพ่นไฟ: ปากท่อสีดำ + ขอบส้มเรืองแสง
            const hole = []; for (let k = 0; k < KS; k++) hole.push(wp(rx * .6, ry * .6, m.hz, k / KS * TAU));
            const hg = g.createRadialGradient(c0[0], c0[1], 1, c0[0], c0[1], rs * .62); hg.addColorStop(0, '#ffb347'); hg.addColorStop(.45, '#2a1420'); hg.addColorStop(1, '#0d0a14');
            path(g, hole, true); g.fillStyle = hg; g.fill(); g.strokeStyle = '#ff8a2a'; g.lineWidth = 2; g.stroke();
          } else if (m.kind === 'power'){                           // โมดูลพลังงาน: สายฟ้า
            g.font = `${Math.round(rs * 1.05)}px sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#fff8c4'; g.fillText('⚡', c0[0], c0[1] + 1);
          } else {
            const hub = []; for (let k = 0; k <= 20; k++) hub.push(wp(rx * .16, ry * .16, m.hz, k / 20 * TAU));
            path(g, hub, true); g.fillStyle = 'rgba(0,0,0,.35)'; g.fill();
          }
          if (m.kind === 'comm'){                                   // ห้องสื่อสาร: เสาอากาศ
            const mast = P(cx, cy, m.hz + 1.9); g.strokeStyle = '#e9efff'; g.lineWidth = 2.2; path(g, [c0, mast]); g.stroke();
            g.fillStyle = '#ff5a5a'; g.beginPath(); g.arc(mast[0], mast[1], 3.2, 0, TAU); g.fill();
            const arm = [P(cx - .6, cy, m.hz + 1.3), P(cx + .6, cy, m.hz + 1.3)]; g.lineWidth = 1.6; path(g, arm); g.stroke();
          }
        }
      }
    }
    if (rz != null) ringFront(cx, cy, rx, ry, rz, ra, GOLD, m.hz);
  }

  if (sRz != null) ringFront(sh.c[0], sh.c[1], sh.rx, sh.ry, sRz, sRa, GOLD, sh.hz);
  GP.forEach((m, i) => {                                             // ริบบิ้นทองบนฐานโค้ง / ปีกข้าง
    if (!m.segs) return;
    const z = G.done[i] ? m.fitz : (G.an && G.an.type === 'up' && i === G.i && G.ringA > 0 ? G.ringZ : null);
    if (z != null) ribbonSegs(m.segs, z, G.done[i] ? 1 : G.ringA, GOLD);
  });
  if (G.done[shi]){                                                  // โดมเกราะเรืองแสงครอบยาน (ขึ้นเมื่อประกอบเกราะแล้ว)
    const Hd = 9, pl = .5 + .2 * Math.sin(now / 400), dp = (ph, a) => P(sh.c[0] + sh.rx * Math.cos(ph) * Math.cos(a), sh.c[1] + sh.ry * Math.cos(ph) * Math.sin(a), Hd * Math.sin(ph));
    const base = []; for (let k = 0; k < 48; k++) base.push(dp(0, k / 48 * TAU));
    path(g, base, true); g.fillStyle = 'rgba(125,249,255,.07)'; g.fill();
    g.strokeStyle = `rgba(125,249,255,${pl})`; g.lineWidth = 1.2;
    for (const ph of [0, .4, .8, 1.2]){ const rg = []; for (let k = 0; k <= 48; k++) rg.push(dp(ph, k / 48 * TAU)); path(g, rg); g.stroke(); }
    for (let j = 0; j < 8; j++){ const mer = []; for (let k = 0; k <= 12; k++) mer.push(dp(k / 12 * PI2, j * TAU / 8)); path(g, mer); g.stroke(); }
  }

  if (G.bad && G.bad.a > 0){                                         // วงแหวนจากสมการที่ผิด (สีแดง) ครอบลงมาแล้วเข้าไม่พอดี
    const b = G.bad, jx = Math.sin(now / 35) * .22 * G.shake;
    if (b.wing) ribbonSegs(b.segs, b.z, b.a, RED, jx);
    else { ringBack(b.cx + jx, b.cy, b.rx, b.ry, b.z, b.a, RED); ringFront(b.cx + jx, b.cy, b.rx, b.ry, b.z, b.a, RED, -1); }
    if (G.phase === 'fail' || b.z <= GP[G.i].fitz + .01){
      const q = P(b.cx, b.cy, b.z + RING_H + .9); g.font = '700 13px "Mitr", sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillStyle = '#ff8a8a'; g.fillText('✖ ไม่พอดี', q[0], q[1]);
    }
  }
  // เส้นประเป้าหมาย (สีฟ้า) — เห็นเฉพาะมุมมอง 2D
  const m = GP[G.i];
  const ta = (G.phase === '3d' || G.phase === 'fail') ? 0 : Math.max(0, Math.min(1, (G.pitch - 1.0) / .45));
  if (ta > 0 && !G.done[G.i]){
    const ring = []; for (let k = 0; k <= 72; k++){ const a = k / 72 * TAU; ring.push(P(m.c[0] + m.rx * Math.cos(a), m.c[1] + m.ry * Math.sin(a), m.hz)); }
    g.globalAlpha = ta * (.7 + .3 * Math.sin(now / 220));
    g.setLineDash([8, 5]); g.strokeStyle = '#7df9ff'; g.lineWidth = 3;
    if (m.segs) m.segs.forEach(sgm => { path(g, sgm.map(q => P(q[0], q[1], m.hz))); g.stroke(); }); else { path(g, ring); g.stroke(); }
    g.setLineDash([]);
    g.globalAlpha = ta;
    g.font = '700 12px "Baloo 2", sans-serif'; g.textAlign = 'left'; g.textBaseline = 'middle';
    if (m.mode !== 'evtx' && m.mode !== 'para'){                                          // ปลายแกนแบบ evtx ไม่บอกจุดศูนย์กลาง ให้ผู้เล่นหาเอง
      const c0 = P(m.c[0], m.c[1], m.hz); g.fillStyle = '#7df9ff';
      g.strokeStyle = '#7df9ff'; g.lineWidth = 1.6; path(g, [[c0[0] - 6, c0[1]], [c0[0] + 6, c0[1]]]); g.stroke(); path(g, [[c0[0], c0[1] - 6], [c0[0], c0[1] + 6]]); g.stroke();
      g.fillText('C', c0[0] + 8, c0[1] - 9);
    }
    if (m.mode === 'point'){ const q = P(m.p[0], m.p[1], m.hz); g.fillStyle = '#ffd84a'; g.beginPath(); g.arc(q[0], q[1], 4.5, 0, TAU); g.fill(); g.fillText('P', q[0] + 8, q[1] - 9); }
    if (m.mode === 'evtx') m.pts.forEach((p, j) => { const q = P(p[0], p[1], m.hz); g.fillStyle = '#ffd84a'; g.beginPath(); g.arc(q[0], q[1], 4.5, 0, TAU); g.fill(); g.fillText(['V₁', 'V₂', 'W'][j], q[0] + 8, q[1] - 9); });
    if (m.mode === 'hv') [[m.p, 'P'], [m.pts[0], 'V₁'], [m.pts[1], 'V₂']].forEach(([p, nm]) => { const q = P(p[0], p[1], m.hz); g.fillStyle = '#ffd84a'; g.beginPath(); g.arc(q[0], q[1], 4.5, 0, TAU); g.fill(); g.fillText(nm, q[0] + 8, q[1] - 9); });
    if (m.mode === 'para') [[m.v, 'V'], [m.pts[0], 'A'], [m.pts[1], 'B']].forEach(([p, nm]) => { const q = P(p[0], p[1], m.hz); g.fillStyle = '#ffd84a'; g.beginPath(); g.arc(q[0], q[1], 4.5, 0, TAU); g.fill(); g.fillText(nm, q[0] + 8, q[1] - 9); });
    g.globalAlpha = 1;
  }
  if (G.flash > 0 && G.fl){                                          // แสงวาบตอนวงแหวนลงถึงที่ (ขาว = พอดี / แดง = ไม่พอดี)
    const f = G.fl, e = (1 - G.flash) * 1.6, fl = []; for (let k = 0; k <= 72; k++){ const a = k / 72 * TAU; fl.push(P(f.cx + (f.rx + e) * Math.cos(a), f.cy + (f.ry + e) * Math.sin(a), f.z)); }
    if (f.wing){ g.globalAlpha = G.flash; g.strokeStyle = f.col; g.lineWidth = 3 + (1 - G.flash) * 8; f.segs.forEach(sgm => { path(g, sgm.map(q => P(q[0], q[1], f.z))); g.stroke(); }); g.globalAlpha = 1; }
    else { g.globalAlpha = G.flash; g.strokeStyle = f.col; g.lineWidth = 4; path(g, fl); g.stroke(); g.globalAlpha = 1; }
  }
  drawAxisNums();                                                    // ตัวเลขบนแกนอยู่ชั้นบนสุดเสมอ
}

/* ---------- แอนิเมชันกล้อง + วงแหวนหล่นลงมา ---------- */
function gstep(now, dt){
  const a = G.an, m = GP[G.i], c = G.ct;
  if (c){                                                            // กล้อง: เลื่อน/ซูม (via = ซูมออกให้เห็นทั้งยานก่อน แล้วซูมเข้าหาชิ้นใหม่)
    const k = Math.min(1, (now - c.t0) / c.d); let x, y, z;
    if (c.via && k < .5){ const u = ease(k * 2); x = lerp(c.f[0], GOFF.x, u); y = lerp(c.f[1], GOFF.y, u); z = lerp(c.f[2], 1, u); }
    else if (c.via){ const u = ease((k - .5) * 2); x = lerp(GOFF.x, c.t[0], u); y = lerp(GOFF.y, c.t[1], u); z = lerp(1, c.t[2], u); }
    else { const u = ease(k); x = lerp(c.f[0], c.t[0], u); y = lerp(c.f[1], c.t[1], u); z = lerp(c.f[2], c.t[2], u); }
    G.cx = x; G.cy = y; G.zoom = z; if (k >= 1) G.ct = null;
  }
  if (a){
    const k = Math.min(1, (now - a.t0) / a.d);
    if (a.type === 'up' || a.type === 'fail'){
      G.pitch = lerp(PI2, .58, ease(Math.min(1, k / .45))); G.yaw = a.y0 + 2.4 * ease(k);
      const ok = a.type === 'up', top = m.hz + 3.4;
      let z, al;
      if (k < .3){ al = k / .3; z = top; }
      else if (k < .8){ const u = (k - .3) / .5; al = 1; z = lerp(top, m.fitz, u * u); }
      else {
        al = 1; z = m.fitz;
        if (!a.fit){ a.fit = true; G.flash = 1;
          G.fl = m.segs ? { wing:true, segs: ok ? m.segs : G.bad.segs, z:m.fitz + RING_H, col: ok ? '#fff6b0' : '#ff6a6a' }
               : ok ? { cx:m.c[0], cy:m.c[1], rx:m.rx + .17, ry:m.ry + .17, z:m.fitz + RING_H, col:'#fff6b0' } : { cx:G.bad.cx, cy:G.bad.cy, rx:G.bad.rx + .17, ry:G.bad.ry + .17, z:m.fitz + RING_H, col:'#ff6a6a' };
          if (!ok) G.shake = 1; }
      }
      if (ok){ G.ringA = al; G.ringZ = z; } else { G.bad.a = al; G.bad.z = z; }
      if (k >= 1){
        G.an = null;
        if (ok){ G.done[G.i] = true; G.ringA = 0; G.phase = '3d'; gAssembled(); } else { G.phase = 'fail'; gFailed(); }
      }
    } else {
      G.pitch = lerp(a.p0, PI2, ease(k)); G.yaw = lerp(a.y0, 0, ease(k));
      if (k >= 1){ G.an = null; G.phase = '2d'; }
    }
  }
  if (G.flash > 0) G.flash = Math.max(0, G.flash - dt / 600);
  if (G.shake > 0) G.shake = Math.max(0, G.shake - dt / 900);
}
function gframe(now){
  if (!G.open) return;
  G.raf = requestAnimationFrame(gframe);
  const dt = Math.min(50, now - (G.last || now)); G.last = now;
  gstep(now, dt);
  if ((G.phase === '3d' || G.phase === 'fail') && !G.drag) G.yaw += dt * .00035;
  gdraw();
}

/* ---------- ส่วนหน้าจอ: โจทย์ ช่องกรอก ปุ่มตัวเลข ---------- */
function gMsg(text, cls){ const el = $('cgMsg'); el.textContent = text; el.className = 'cg-msg ' + (cls || ''); }
function gNum(s){ return (s === '' || s === '-') ? NaN : Number(s); }
function gTexPart(s, v){ const n = gNum(v); return isNaN(n) ? [`(${s}-\\square)^2`, `(${s} − ▢)²`] : n === 0 ? [`${s}^2`, `${s}²`] : n > 0 ? [`(${s}-${n})^2`, `(${s} − ${n})²`] : [`(${s}+${-n})^2`, `(${s} + ${-n})²`]; }
/* สมการที่ผู้เล่นกรอก → [LaTeX, ข้อความสำรอง]   วงกลม: [h, k, r²]   วงรี/ไฮเพอร์โบลา: [h, a², k, b²]   พาราโบลา: [h, p, k] */
function gEqTex(shape, nums){
  const t = v => isNaN(v) ? '\\square' : v, p = v => isNaN(v) ? '▢' : v;
  if (shape === 'hyper'){                                            // ไฮเพอร์โบลาเปิดซ้าย-ขวา: nums = [h, a², k, b²]
    const [hx, hp] = gTexPart('x', nums[0]), [ky, kp] = gTexPart('y', nums[2]);
    return [`\\dfrac{${hx}}{${t(nums[1])}}-\\dfrac{${ky}}{${t(nums[3])}}=1`, `${hp}/${p(nums[1])} − ${kp}/${p(nums[3])} = 1`];
  }
  if (shape === 'parab'){                                            // พาราโบลาเปิดขึ้น: nums = [h, p, k]   (x − h)² = 4p(y − k)
    const [hx, hp] = gTexPart('x', nums[0]), k = nums[2], pv = nums[1];
    const yl = isNaN(k) ? ['(y-\\square)', '(y − ▢)'] : k === 0 ? ['y', 'y'] : k > 0 ? [`(y-${k})`, `(y − ${k})`] : [`(y+${-k})`, `(y + ${-k})`];
    const pl = isNaN(pv) ? ['\\square', '▢'] : pv < 0 ? [`(${pv})`, `(${gsg(pv)})`] : [`${pv}`, `${pv}`];
    return [`${hx}=4\\cdot ${pl[0]}\\cdot ${yl[0]}`, `${hp} = 4·${pl[1]}·${yl[1]}`];
  }
  if (shape === 'ellipse'){
    const [hx, hp] = gTexPart('x', nums[0]), [ky, kp] = gTexPart('y', nums[2]);
    return [`\\dfrac{${hx}}{${t(nums[1])}}+\\dfrac{${ky}}{${t(nums[3])}}=1`, `${hp}/${p(nums[1])} + ${kp}/${p(nums[3])} = 1`];
  }
  const [hx, hp] = gTexPart('x', nums[0]), [ky, kp] = gTexPart('y', nums[1]);
  return [`${hx}+${ky}=${t(nums[2])}`, `${hp} + ${kp} = ${p(nums[2])}`];
}
function gRefresh(){
  const m = GP[G.i], labels = m.ell ? ['h', 'a²', 'k', 'b²'] : m.par ? ['h', 'p', 'k'] : ['h', 'k', 'r²'];
  document.querySelectorAll('#cgScreen .cg-f').forEach(b => {
    const f = +b.dataset.f, v = G.v[f];
    b.textContent = v === '' ? labels[f] : gsg(v);
    b.classList.toggle('on', f === G.f); b.classList.toggle('empty', v === '');
  });
  const key = G.v.join('|');
  if (key !== G.pk){ G.pk = key; const [tex, pl] = gEqTex(m.shape, G.v.map(gNum)); window.mgTex($('cgPrev'), tex, pl); }
}
function gSetMission(){
  const m = GP[G.i], c = `C(${gsg(m.c[0])}, ${gsg(m.c[1])})`;
  G.nf = m.ell ? 4 : 3; G.v = Array(G.nf).fill(''); G.f = 0; G.pk = ''; G.bad = null;
  const F = i => `<button class="cg-f" data-f="${i}"></button>`;
  $('cgEq').className = 'cg-eq' + (m.ell ? ' ell' : '');
  $('cgEq').innerHTML = m.hyp
    ? `( x − ${F(0)} )² <span class="cg-sl">/</span> ${F(1)} − ( y − ${F(2)} )² <span class="cg-sl">/</span> ${F(3)} = 1`
    : m.ell
    ? `( x − ${F(0)} )² <span class="cg-sl">/</span> ${F(1)} + ( y − ${F(2)} )² <span class="cg-sl">/</span> ${F(3)} = 1`
    : m.par
    ? `( x − ${F(0)} )² = 4 · ${F(1)} · ( y − ${F(2)} )`
    : `( x − ${F(0)} )² + ( y − ${F(1)} )² = ${F(2)}`;
  const pt = p => `(${gsg(p[0])}, ${gsg(p[1])})`;
  let txt;
  if (m.mode === 'graph')       txt = `ชิ้นส่วน “${m.n}” · อ่านจากกราฟ: วงกลมประสีฟ้ามีจุดศูนย์กลาง C และรัศมีเท่าไร? เติมสมการให้ถูกเพื่อประกอบ`;
  else if (m.mode === 'radius') txt = `ชิ้นส่วน “${m.n}” · วงกลมมีจุดศูนย์กลาง ${c} และรัศมี ${m.rtxt || m.rx} หน่วย`;
  else if (m.mode === 'point')  txt = `ชิ้นส่วน “${m.n}” · วงกลมมีจุดศูนย์กลาง ${c} และผ่านจุด P${pt(m.p)}`;
  else if (m.mode === 'para')   txt = `ชิ้นส่วน “${m.n}” · พาราโบลาเปิดขึ้น (แกนสมมาตรอยู่แนวตั้ง) มีจุดยอด V${pt(m.v)} และผ่านจุดเชื่อมระหว่างตัวยานกับไอพ่นทั้งสอง A${pt(m.pts[0])}, B${pt(m.pts[1])} (หา p ให้ได้ ฐานจะเลื่อนลงตามแกน z ยาวเท่าไอพ่น)`;
  else if (m.mode === 'hv')     txt = `ชิ้นส่วน “${m.n}” · ไฮเพอร์โบลาเปิดซ้าย-ขวา อยู่ข้างไอพ่นทั้งสอง )o0o( มีจุดศูนย์กลาง ${c} จุดยอด V₁${pt(m.pts[0])}, V₂${pt(m.pts[1])} แตะขอบนอกของไอพ่นพอดี และกิ่งโค้งผ่านจุด P${pt(m.p)}`;
  else if (m.mode === 'egraph') txt = `ชิ้นส่วน “${m.n}” · อ่านจากกราฟ: วงรีประสีฟ้ามีจุดศูนย์กลาง C ครึ่งแกนนอน a และครึ่งแกนตั้ง b เท่าไร? เติมสมการวงรีให้ถูก`;
  else if (m.mode === 'eab')    txt = `ชิ้นส่วน “${m.n}” · วงรีมีจุดศูนย์กลาง ${c} แกนนอนยาว ${2 * m.rx} หน่วย และแกนตั้งยาว ${2 * m.ry} หน่วย`;
  else                          txt = `ชิ้นส่วน “${m.n}” · วงรีครอบตัวยาน แตะไอพ่นซ้ายและขวาพอดีที่จุด V₁${pt(m.pts[0])}, V₂${pt(m.pts[1])} (ปลายแกนนอน) และผ่านจุด W${pt(m.pts[2])} (ปลายแกนตั้งข้างบน) · หาจุดศูนย์กลางก่อน`;
  if (m.note) txt += ` · ${m.note}`;
  $('cgMission').textContent = txt;
  $('cgProg').textContent = `ชิ้นส่วน ${G.i}/${GP.length - 1}`;
  $('cgHint').textContent = '👁️ มุมมอง 2D จากด้านบนของยาน';
  $('cgKeys').style.display = 'grid'; $('cgNext').style.display = 'none';
  gMsg(m.ell ? 'พิมพ์ตัวเลขลงช่อง h, a², k และ b² (แตะช่องเพื่อเลือก)' : m.par ? 'พิมพ์ตัวเลขลงช่อง h, p และ k (แตะช่องเพื่อเลือก)' : 'พิมพ์ตัวเลขลงช่อง h, k และ r² (แตะช่องเพื่อเลือก)', 'info'); gRefresh();
}
function gPress(k){
  if (G.phase !== '2d') return;
  if (k === 'ok') return gCheck();
  if (k === 'next'){ G.f = (G.f + 1) % G.nf; return gRefresh(); }
  let v = G.v[G.f];
  if (k === 'back') v = v.slice(0, -1);
  else if (k === 'neg') v = v.startsWith('-') ? v.slice(1) : '-' + v;
  else if (v.replace('-', '').length < 3) v += k;
  G.v[G.f] = v; gRefresh();
}
function gCheck(){
  const m = GP[G.i], nums = G.v.map(gNum);
  if (nums.some(isNaN)){ gMsg(`กรอกให้ครบทั้ง ${nums.length} ช่องก่อนนะ ✏️`, 'info'); return; }
  let h, k, A, B, p, ok, okC;
  if (m.ell){ [h, A, k, B] = nums; okC = h === m.c[0] && k === m.c[1]; ok = okC && A === m.a2 && B === m.b2; }      // วงรี และไฮเพอร์โบลาเปิดซ้าย-ขวา (ช่องเรียงเหมือนกัน)
  else if (m.par){ [h, p, k] = nums; okC = h === m.par.h && k === m.par.k; ok = okC && p === m.par.p; }
  else      { [h, k, A] = nums;    okC = h === m.c[0] && k === m.c[1]; ok = okC && A === m.r2; B = A; }
  if (!ok && m.par && p === 0){ gMsg('p ต้องไม่เป็นศูนย์นะ (ถ้า p = 0 จะไม่เกิดพาราโบลา) 🙂', 'bad'); return; }
  if (!ok && !m.par && (A <= 0 || B <= 0)){ gMsg(m.ell ? 'a² และ b² ต้องเป็นจำนวนบวกนะ (ครึ่งแกนยกกำลังสองติดลบหรือเป็นศูนย์ไม่ได้) 🙂' : 'r² ต้องเป็นจำนวนบวกนะ (รัศมียกกำลังสองติดลบหรือเป็นศูนย์ไม่ได้) 🙂', 'bad'); return; }
  if (ok){
    $('cgMsg').className = 'cg-msg good'; $('cgMsg').innerHTML = '🎉 ถูกต้อง! <span id="cgOK"></span>';
    const [tex, pl] = gEqTex(m.shape, nums); window.mgTex($('cgOK'), tex, pl);
    $('cgKeys').style.display = 'none'; $('cgHint').textContent = '🔧 กำลังประกอบชิ้นส่วน…';
    G.phase = 'anim'; G.an = { type:'up', t0:performance.now(), d:3000, y0:G.yaw, fit:false };
    return;
  }
  let why = 'ยังไม่ถูกนะ ลองอ่านจุดศูนย์กลางและรัศมีอีกครั้ง 🔍';
  if (m.hyp){
    why = 'ยังไม่ถูกนะ ลองหาจุดศูนย์กลางจากจุดยอด V₁, V₂ แล้วหา a² จากระยะศูนย์กลาง→จุดยอด ส่วน b² ให้แทนจุด P 🔍';
    if (okC && A === m.b2 && B === m.a2) why = 'จุดศูนย์กลางถูกแล้ว! แต่ a² กับ b² สลับกัน — ไฮเพอร์โบลานี้เปิดซ้าย-ขวา จึงให้ a² อยู่ใต้ (x − h)² และ b² อยู่ใต้ (y − k)² 💡';
    else if (okC && (A === Math.sqrt(m.a2) || B === Math.sqrt(m.b2))) why = 'จุดศูนย์กลางถูกแล้ว! แต่ใต้เศษส่วนต้องเป็น a² และ b² (ยกกำลังสองแล้ว) ไม่ใช่ a กับ b 💡';
    else if (okC && A === m.a2) why = 'a² ถูกแล้ว! ลองแทนจุด P ลงในสมการเพื่อหา b² 💡';
    else if (okC && B === m.b2) why = 'b² ถูกแล้ว! ลองดู a² จากระยะระหว่างจุดศูนย์กลางกับจุดยอด (แล้วยกกำลังสอง) 💡';
    else if (okC) why = 'จุดศูนย์กลางถูกแล้ว! a คือระยะจากศูนย์กลางถึงจุดยอด ส่วน b² หาได้จากการแทนจุด P 💡';
    else why = 'จุดศูนย์กลางต้องอยู่กึ่งกลางระหว่างจุดยอด V₁ กับ V₂ — ใช้สูตรจุดกึ่งกลาง 💡';
  } else if (m.par){
    why = 'ยังไม่ถูกนะ จุดยอดคือ (h, k) ส่วน p หาได้จากการแทนจุด A หรือ B ลงใน (x − h)² = 4p(y − k) 🔍';
    if (okC && p === 4 * m.par.p) why = 'จุดยอดถูกแล้ว! แต่ช่องนี้คือ p ไม่ใช่ 4p (สมการเขียน 4 · p อยู่แล้ว) ลองหารด้วย 4 💡';
    else if (okC && p === -m.par.p) why = 'จุดยอดถูกแล้ว! แต่พาราโบลานี้เปิดขึ้น p จึงต้องเป็นบวก 💡';
    else if (okC) why = `จุดยอดถูกแล้ว! แทนจุด A${gpt(m.pts[1])} ลงใน (x − h)² = 4p(y − k) แล้วแก้สมการหา p 💡`;
    else if (h === -m.par.h && k === -m.par.k) why = 'เครื่องหมายของ h, k สลับกัน ช่อง h, k คือพิกัดจุดยอดตรงๆ (สมการจะเขียน x − h) 💡';
    else if (h === m.par.k && k === m.par.h) why = 'h กับ k สลับกัน h คือค่า x ของจุดยอด และ k คือค่า y 💡';
    else why = `จุดยอดต้องเป็นไปตามโจทย์ V${gpt(m.v)}: h คือค่า x และ k คือค่า y ของจุดยอด 💡`;
  } else if (m.ell){
    why = 'ยังไม่ถูกนะ ลองหาจุดศูนย์กลาง ครึ่งแกนนอน a และครึ่งแกนตั้ง b อีกครั้ง 🔍';
    if (okC && A === m.b2 && B === m.a2 && m.a2 !== m.b2) why = 'จุดศูนย์กลางถูกแล้ว! แต่ a² กับ b² สลับกัน — a² อยู่ใต้ (x − h)² (แนวนอน) และ b² อยู่ใต้ (y − k)² (แนวตั้ง) 💡';
    else if (okC && m.mode === 'eab' && (A === (2 * m.rx) ** 2 || B === (2 * m.ry) ** 2 || A === 2 * m.rx || B === 2 * m.ry)) why = 'จุดศูนย์กลางถูกแล้ว! แต่โจทย์ให้ความยาวของแกนทั้งเส้น (2a, 2b) ต้องแบ่งครึ่งเป็น a, b ก่อน แล้วค่อยยกกำลังสอง 💡';
    else if (okC && A === m.rx && B === m.ry && (A !== m.a2 || B !== m.b2)) why = 'จุดศูนย์กลางถูกแล้ว! แต่ใต้เศษส่วนต้องเป็น a² และ b² (ยกกำลังสองแล้ว) ไม่ใช่ a กับ b 💡';
    else if (okC) why = 'จุดศูนย์กลางถูกแล้ว! ลองดูครึ่งแกนนอน a และครึ่งแกนตั้ง b อีกครั้ง แล้วยกกำลังสอง 💡';
    else if (h === -m.c[0] && k === -m.c[1] && (m.c[0] || m.c[1])) why = 'เครื่องหมายของ h, k สลับกัน ช่อง h, k คือพิกัดจุดศูนย์กลางตรงๆ (สมการจะเขียน x − h) ดูตัวอย่างสมการด้านล่างช่วยเช็กได้ 💡';
    else if (m.mode === 'evtx') why = 'จุดศูนย์กลางต้องอยู่กึ่งกลางระหว่าง V₁ กับ V₂ — ใช้สูตรจุดกึ่งกลาง ((x₁+x₂)/2 , (y₁+y₂)/2) แล้ว a = ครึ่งหนึ่งของ V₁V₂ และ b = ระยะจากศูนย์กลางถึง W 💡';
  } else {
    const r = m.rx;
    if (okC && Number.isInteger(r) && A === r && r !== m.r2) why = 'จุดศูนย์กลางถูกแล้ว! แต่ฝั่งขวาของสมการคือ r² (รัศมียกกำลังสอง) ไม่ใช่ r 💡';
    else if (okC) why = m.mode === 'point' ? 'จุดศูนย์กลางถูกแล้ว! ลองหา r² จาก (x_P − h)² + (y_P − k)² 💡' : 'จุดศูนย์กลางถูกแล้ว! ลองดูรัศมีอีกครั้ง แล้วยกกำลังสอง 💡';
    else if (h === -m.c[0] && k === -m.c[1] && (m.c[0] || m.c[1])) why = 'เครื่องหมายของ h, k สลับกัน ช่อง h, k คือพิกัดจุดศูนย์กลางตรงๆ (สมการจะเขียน x − h) ดูตัวอย่างสมการด้านล่างช่วยเช็กได้ 💡';
  }
  G.why = why;
  const ox = GOFF.x, oy = GOFF.y, cl = v => Math.max(-11, Math.min(11, v)), clx = v => ox + cl(v - ox), cly = v => oy + cl(v - oy);   // หน่วงให้อยู่ในพื้นแท่นรอบตัวยาน
  if (m.hyp) G.bad = { wing:true, segs: clipSegs(hypBranches(clx(h), A, cly(k), B, 10, 120), FLOOR + .4, ox, oy), cx:ox, cy:oy + 6.5, z:m.hz + 3.4, a:0 };
  else if (m.par) G.bad = { wing:true, segs: clipSegs([parabPts(clx(h), p, cly(k), 14, 140)], FLOOR + .4, ox, oy), cx:ox, cy:oy - 6.5, z:m.hz + 3.4, a:0 };
  else G.bad = { cx:clx(h), cy:cly(k), rx:Math.min(11, Math.sqrt(A)), ry:Math.min(11, Math.sqrt(B)), z:m.hz + 3.4, a:0 };
  $('cgKeys').style.display = 'none'; $('cgHint').textContent = '🔧 กำลังประกอบตามสมการที่กรอก…'; gMsg('🔧 กำลังประกอบตามสมการที่กรอก…', 'info');
  G.phase = 'anim'; G.an = { type:'fail', t0:performance.now(), d:3000, y0:G.yaw, fit:false };
}
function gFailed(){
  gMsg('❌ ผิดพลาด! วงแหวนประกอบเข้าไม่พอดี\n' + G.why, 'bad');
  $('cgHint').textContent = '🌀 ลากนิ้วหมุนดูว่าวงแหวนเข้าไม่พอดีตรงไหน';
  $('cgNext').textContent = '🔧 แก้สมการแล้วลองใหม่'; $('cgNext').style.display = 'block';
}
function gAssembled(){
  const last = G.i === GP.length - 1;
  $('cgHint').textContent = '🌀 ลากนิ้วเพื่อหมุนดูยาน (3D)';
  if (last) gMsg('🏆 ประกอบยานอวกาศครบทุกชิ้นส่วนแล้ว! เครื่องยนต์ติดแล้ว ลากหมุนดูยานของเราได้เลย', 'good');
  $('cgNext').textContent = last ? '🔄 เล่นใหม่' : 'ชิ้นส่วนต่อไป ▶'; $('cgNext').style.display = 'block';
}
function gGoCam(to, d, via){ G.ct = { f:[G.cx, G.cy, G.zoom], t:to, t0:performance.now(), d, via }; }
function gNext(){
  if (G.phase === 'fail'){                                           // กลับมุมมอง 2D แล้วแก้สมการต่อ (ค่าที่กรอกยังอยู่)
    G.bad = null; G.yaw = G.yaw - Math.round(G.yaw / TAU) * TAU;
    G.phase = 'anim'; G.an = { type:'down', t0:performance.now(), d:900, p0:G.pitch, y0:G.yaw };
    $('cgKeys').style.display = 'grid'; $('cgNext').style.display = 'none';
    $('cgHint').textContent = '👁️ มุมมอง 2D จากด้านบนของยาน'; gMsg('ลองแก้สมการแล้วตรวจใหม่อีกครั้ง', 'info'); gRefresh();
    return;
  }
  if (G.i === GP.length - 1){ G.i = 1; G.done = [true]; gRandShift(); } else G.i++;      // เล่นใหม่ → สุ่มพิกัดใหม่ทั้งยาน (ลำตัวยานชิ้นที่ 0 ประกอบไว้แล้วเสมอ)
  G.yaw = G.yaw - Math.round(G.yaw / TAU) * TAU;
  G.phase = 'anim'; G.an = { type:'down', t0:performance.now(), d:1800, p0:G.pitch, y0:G.yaw };
  gGoCam(GP[G.i].cam, 1800, true);                                   // ซูมออกให้เห็นทั้งยาน แล้วซูมเข้าหาชิ้นถัดไป
  gSetMission();
}

function gBuild(){
  if ($('cgScreen')) return;
  const el = document.createElement('div');
  el.className = 'cn-screen cg-screen'; el.id = 'cgScreen';
  const keys = ['7', '8', '9', 'back', '4', '5', '6', 'neg', '1', '2', '3', 'next'].map(k =>
    `<button class="cg-key${k.length > 1 ? ' fn' : ''}" data-k="${k}">${{ back:'⌫', neg:'±', next:'ช่องถัดไป ▶' }[k] || k}</button>`).join('');
  el.innerHTML = `
    <div class="cn-top">
      <button class="back-btn" id="cgBack" aria-label="ย้อนกลับ"><img src="Icon/back.png" alt="ย้อนกลับ"></button>
      <div class="cn-title">🚀 ประกอบยานอวกาศ</div>
      <div class="cg-chip" id="cgProg"></div>
    </div>
    <div class="cn-view"><canvas id="cgCv"></canvas><div class="cn-hint" id="cgHint"></div></div>
    <div class="cn-panel">
      <div class="cg-mission" id="cgMission"></div>
      <div class="cg-eq" id="cgEq"></div>
      <div class="cg-prev"><span id="cgPrev"></span></div>
      <div class="cg-msg info" id="cgMsg"></div>
      <div class="cg-keys" id="cgKeys">${keys}<button class="cg-key zero" data-k="0">0</button><button class="cg-key ok" data-k="ok">✓ ตรวจคำตอบ</button></div>
      <button class="cg-next" id="cgNext" style="display:none"></button>
    </div>`;
  (document.getElementById('dashboard') || document.body).appendChild(el);
  $('cgBack').addEventListener('click', closeGame);
  $('cgNext').addEventListener('click', gNext);
  $('cgEq').addEventListener('click', e => { const b = e.target.closest('.cg-f'); if (b && G.phase === '2d'){ G.f = +b.dataset.f; gRefresh(); } });   // ช่องถูกสร้างใหม่ทุกชิ้นส่วน จึงใช้ delegation
  $('cgKeys').addEventListener('click', e => { const b = e.target.closest('.cg-key'); if (b) gPress(b.dataset.k); });
  const cv = $('cgCv');
  cv.addEventListener('pointerdown', e => { if (G.phase === '3d' || G.phase === 'fail'){ G.drag = { x:e.clientX, y:e.clientY }; cv.setPointerCapture(e.pointerId); } });
  cv.addEventListener('pointermove', e => {
    if (!G.drag) return;
    G.yaw += (e.clientX - G.drag.x) * .01; G.pitch = Math.max(.25, Math.min(1.25, G.pitch + (e.clientY - G.drag.y) * .006));
    G.drag = { x:e.clientX, y:e.clientY };
  });
  const up = () => { G.drag = null; };
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
}
function openGame(){
  gBuild();
  cancelAnimationFrame(S.raf);                                       // พักกรวย 3 มิติไว้ก่อน
  gRandShift();                                                      // สุ่มพิกัดใหม่ทุกครั้งที่เริ่มเกม
  Object.assign(G, { open:true, i:1, done:[true], pitch:PI2, yaw:0, phase:'2d', an:null, ringA:0, flash:0, shake:0, fl:null, bad:null, drag:null, last:0, zoom:1, cx:GOFF.x, cy:GOFF.y, ct:null });
  $('cgScreen').style.display = 'flex';
  gSetMission();
  gGoCam(GP[1].cam, 1400, false);                                    // เริ่มจากเห็นทั้งยาน แล้วซูมเข้าหาไอพ่นตัวแรก
  cancelAnimationFrame(G.raf); G.raf = requestAnimationFrame(gframe);
}
function closeGame(){
  G.open = false; cancelAnimationFrame(G.raf);
  $('cgScreen').style.display = 'none';
  if (S.open){ S.last = 0; S.raf = requestAnimationFrame(frame); }
}

window.openConicScreen = openConicScreen;
window.closeConicScreen = closeConic;
})();
