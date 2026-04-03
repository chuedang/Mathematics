<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>Character Dress-Up Test</title>
  <style>
    body { font-family: sans-serif; text-align: center; margin-top: 50px; }
    #character { width: 200px; height: 300px; margin: 0 auto; position: relative; }

    /* กำหนด layer ให้เรียงลำดับ base < shirt < hat */
    #base { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; }
    #shirt { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2; }
    #hat { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 3; }

    button { margin: 5px; padding: 10px; }
  </style>
</head>
<body>

<h1>ทดลองแต่งตัวตัวละคร</h1>
<div id="character">
  <img id="base" src="image/base.png" alt="Base">
  <img id="shirt" src="" alt="Shirt">
  <img id="hat" src="" alt="Hat">
</div>

<h2>Inventory</h2>
<div>
  <!-- ปุ่ม Base -->
  <button onclick="equip('base', 'image/base.png')">Base ปกติ</button>
  <button onclick="equip('base', 'image/base2.png')">Base 2</button>
  
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
    // ดึงชื่อไฟล์ไม่ sensitive
    const itemName = src.split('/').pop().split('.')[0].toLowerCase();

    if(type === 'base' || studentData.unlockedItems.includes(itemName)) {
      const img = document.getElementById(type);
      img.src = src;

      // ถ้า hat หรือ shirt ยังไม่มีค่า จะใส่ visibility ให้แสดง
      img.style.visibility = 'visible';
    } else {
      alert("ไอเทมนี้ยังไม่ปลดล็อค!");
    }
  }

  // เริ่มต้นให้ทุก layer ซ่อน hat/shirt
  document.getElementById('hat').style.visibility = 'hidden';
  document.getElementById('shirt').style.visibility = 'hidden';
</script>

</body>
</html>
