<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>Character Dress-Up Test</title>
  <style>
    body { font-family: sans-serif; text-align: center; margin-top: 50px; }
    #character { width: 200px; height: 300px; margin: 0 auto; position: relative; }
    .layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
    button { margin: 5px; padding: 10px; }
  </style>
</head>
<body>

<h1>ทดลองแต่งตัวตัวละคร</h1>
<div id="character">
  <img id="base" class="layer" src="images/base.png" alt="Base">
  <img id="hat" class="layer" src="" alt="Hat">
  <img id="shirt" class="layer" src="" alt="Shirt">
</div>

<h2>Inventory</h2>
<div>
  <button onclick="equip('hat', 'images/hat1.png')">หมวกแดง</button>
  <button onclick="equip('hat', 'images/hat2.png')">หมวกฟ้า</button>
  <button onclick="equip('shirt', 'images/shirt1.png')">เสื้อเหลือง</button>
  <button onclick="equip('shirt', 'images/shirt2.png')">เสื้อเขียว</button>
</div>

<script>
  // ตัวอย่าง Database จำลอง
  const studentData = {
    name: "นักเรียนA",
    totalScore: 25,    // คะแนนที่ครูใส่
    level: 2,          // กำหนดจากคะแนน
    unlockedItems: ["hat1","shirt1","shirt2"]  // รายการไอเทมที่ปลดล็อค
  };

  // ฟังก์ชันเช็คว่าไอเทมปลดล็อคไหม
  function equip(type, src) {
    const itemName = src.match(/\/(\w+)\.png$/)[1]; // ดึงชื่อไฟล์
    if(studentData.unlockedItems.includes(itemName)) {
      document.getElementById(type).src = src;
    } else {
      alert("ไอเทมนี้ยังไม่ปลดล็อค!");
    }
  }
</script>

</body>
</html>
