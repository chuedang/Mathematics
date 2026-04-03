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
  <img id="base" class="layer" src="image/base.png" alt="Base">
  <img id="hat" class="layer" src="" alt="Hat">
  <img id="shirt" class="layer" src="" alt="Shirt">
</div>

<h2>Inventory</h2>
<div>
  <!-- ปุ่ม Base -->
  <button onclick="equip('base', 'image/base.png')">Base</button>
  <!-- ปุ่ม Hat -->
  <button onclick="equip('hat', 'image/hat1.png')">หมวกแดง</button>
  <button onclick="equip('hat', 'image/hat2.png')">หมวกฟ้า</button>
  <!-- ปุ่ม Shirt -->
  <button onclick="equip('shirt', 'image/shirt1.png')">เสื้อเหลือง</button>
  <button onclick="equip('shirt', 'image/shirt2.png')">เสื้อเขียว</button>
</div>

<script>
  const studentData = {
    unlockedItems: ["hat1","shirt1","shirt2"] // ไอเทมที่ปลดล็อค
  };

  function equip(type, src) {
    const itemName = src.split('/').pop().split('.')[0].toLowerCase(); // ดึงชื่อไฟล์ไม่ sensitive
    if(type === 'base' || studentData.unlockedItems.includes(itemName)) {
      document.getElementById(type).src = src;
    } else {
      alert("ไอเทมนี้ยังไม่ปลดล็อค!");
    }
  }
</script>

</body>
</html>
