<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>Character Dress-Up Custom Size</title>
  <style>
    body { font-family: sans-serif; text-align: center; margin-top: 50px; background-color: #f0f0f0; }

    /* พื้นที่แสดงตัวละคร */
    #character-container {
      position: relative;
      width: 300px;  /* ขนาดกรอบแสดงผล */
      height: 400px;
      margin: 0 auto;
      background-color: white;
      border: 2px solid #ddd;
      overflow: hidden; /* กันส่วนเกินล้นออกนอกกรอบ */
    }

    /* Base: ตัวละครหลัก (ขนาดเต็มกรอบ) */
    #base {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
      z-index: 1;
    }

    /* สไตล์รวมสำหรับของตกแต่ง */
    .item-layer {
      position: absolute;
      left: 50%; /* จัดให้อยู่กึ่งกลางแนวนอน */
      transform: translateX(-50%); /* เทคนิคทำให้กึ่งกลางเป๊ะ */
      object-fit: contain;
      display: none; /* ซ่อนไว้ก่อนเริ่ม */
    }

    /* --- ปรับแต่งตำแหน่งและขนาดที่นี่ --- */

    #hat {
      z-index: 3;    /* อยู่บนสุด */
      width: 40%;    /* ปรับขนาดหมวกให้เล็กลง (เหลือ 40% ของกรอบ) */
      top: 10%;      /* ขยับลงมาจากด้านบน 10% (ให้อยู่บนหัว) */
    }

    #shirt {
      z-index: 2;    /* อยู่ระหว่าง Base กับ Hat */
      width: 60%;    /* ปรับขนาดเสื้อให้ใหญ่กว่าหมวกนิดหน่อย */
      top: 35%;      /* ขยับลงมาให้อยู่ช่วงตัว (ใต้หมวก) */
    }

    /* ---------------------------------- */

    .controls { margin-top: 20px; }
    button { padding: 10px; margin: 5px; cursor: pointer; border-radius: 8px; border: 1px solid #bbb; }
    button:hover { background: #e0e0e0; }
  </style>
</head>
<body>

<h1>ระบบแต่งตัวแบบกำหนดตำแหน่ง</h1>

<div id="character-container">
  <img id="base" src="image/base.png" alt="Base">
  <img id="shirt" class="item-layer" src="" alt="Shirt">
  <img id="hat" class="item-layer" src="" alt="Hat">
</div>

<div class="controls">
  <div>
    <strong>หมวก:</strong>
    <button onclick="equip('hat', 'image/hat1.png')">หมวกแดง</button>
    <button onclick="equip('hat', 'image/hat2.png')">หมวกฟ้า</button>
    <button onclick="removeItem('hat')">ถอดหมวก</button>
  </div>
  <br>
  <div>
    <strong>เสื้อ:</strong>
    <button onclick="equip('shirt', 'image/shirt1.png')">เสื้อเหลือง</button>
    <button onclick="equip('shirt', 'image/shirt2.png') :">เสื้อเขียว</button>
    <button onclick="removeItem('shirt')">ถอดเสื้อ</button>
  </div>
</div>

<script>
  const studentData = {
    unlockedItems: ["hat1", "hat2", "shirt1", "shirt2"]
  };

  function equip(type, src) {
    const itemName = src.split('/').pop().split('.')[0].toLowerCase();
    
    if(studentData.unlockedItems.includes(itemName)) {
      const img = document.getElementById(type);
      img.src = src;
      img.style.display = 'block';
    } else {
      alert("ไอเทมนี้ยังไม่ปลดล็อค!");
    }
  }

  function removeItem(type) {
    document.getElementById(type).style.display = 'none';
  }
</script>

</body>
</html>
