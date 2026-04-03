<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>Character Dress-Up Test</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center; margin-top: 50px; background-color: #f4f4f9; }
    
    #character-container { 
      width: 200px; 
      height: 300px; 
      margin: 0 auto; 
      position: relative; 
      background-color: #fff;
      border: 2px solid #ddd;
      border-radius: 10px;
      overflow: hidden;
    }

    /* Layering: base (1) < shirt (2) < hat (3) */
    .layer { 
      position: absolute; 
      top: 0; 
      left: 0; 
      width: 100%; 
      height: 100%; 
      object-fit: contain;
    }
    
    #base { z-index: 1; }
    #shirt { z-index: 2; visibility: hidden; }
    #hat { z-index: 3; visibility: hidden; }

    .controls { margin-top: 20px; padding: 20px; }
    .group { margin-bottom: 15px; }
    button { 
      margin: 5px; 
      padding: 10px 15px; 
      cursor: pointer; 
      border-radius: 5px; 
      border: 1px solid #ccc;
      background: white;
    }
    button:hover { background: #e2e2e2; }
  </style>
</head>
<body>

<h1>ทดลองแต่งตัวตัวละคร</h1>

<div id="character-container">
  <img id="base" class="layer" src="image/base.png" alt="Base">
  <img id="shirt" class="layer" src="" alt="Shirt">
  <img id="hat" class="layer" src="" alt="Hat">
</div>

<div class="controls">
  <div class="group">
    <strong>ตัวละคร:</strong>
    <button onclick="equip('base', 'image/base.png')">Base ปกติ</button>
    <button onclick="equip('base', 'image/base2.png')">Base 2</button>
  </div>
  
  <div class="group">
    <strong>หมวก:</strong>
    <button onclick="equip('hat', 'image/hat1.png')">หมวกแดง</button>
    <button onclick="equip('hat', 'image/hat2.png')">หมวกฟ้า</button>
  </div>
  
  <div class="group">
    <strong>เสื้อ:</strong>
    <button onclick="equip('shirt', 'image/shirt1.png')">เสื้อเหลือง</button>
    <button onclick="equip('shirt', 'image/shirt2.png')">เสื้อเขียว</button>
  </div>
</div>

<script>
  // ข้อมูลไอเทมที่ปลดล็อค (ต้องตรงกับชื่อไฟล์ในโฟลเดอร์ image)
  const studentData = {
    unlockedItems: ["hat1", "shirt1", "shirt2", "hat2"] 
  };

  function equip(type, src) {
    // ดึงชื่อไฟล์ออกมา เช่น 'hat1'
    const fileName = src.split('/').pop().split('.')[0].toLowerCase();

    // เช็คว่าเป็นตัวละครหลัก หรือเป็นไอเทมที่ปลดล็อคแล้ว
    if (type === 'base' || studentData.unlockedItems.includes(fileName)) {
      const img = document.getElementById(type);
      img.src = src;
      img.style.visibility = 'visible';

      // เช็คเผื่อโหลดภาพไม่ขึ้น (Path ผิด หรือชื่อไฟล์ผิด)
      img.onerror = function() {
        console.error("ไม่สามารถโหลดภาพได้ที่ Path: " + src);
        alert("หาไฟล์ภาพไม่เจอ: " + src);
      };
    } else {
      alert("ไอเทมนี้ยังไม่ปลดล็อค!");
    }
  }
</script>

</body>
</html>
