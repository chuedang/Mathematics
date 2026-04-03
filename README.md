<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <title>Character Dress-Up Test</title>
    <style>
        body { font-family: sans-serif; text-align: center; margin-top: 50px; background-color: #f0f0f0; }

        #character-wrapper {
            position: relative;
            width: 200px; /* ขนาดของ base */
            height: 300px;
            margin: 0 auto;
            border: 2px solid #ccc;
            background-color: #fff;
            overflow: hidden; /* เพื่อให้แน่ใจว่าไม่มีส่วนไหนเกินออกมา */
        }

        /* กำหนดสไตล์ให้กับ base (ตัวละครหลัก) */
        #base {
            width: 100%;
            height: 100%;
            display: block; /* เพื่อไม่ให้มีช่องว่างด้านล่าง */
        }

        /* กำหนดสไตล์ให้กับ hat และ shirt (ของตกแต่ง) */
        .decoration {
            position: absolute; /* เพื่อให้สามารถจัดตำแหน่งได้เทียบกับ #character-wrapper */
            /* z-index สำหรับเครื่องแต่งกาย */
        }

        #shirt {
            z-index: 2;
            display: none; /* ซ่อนไว้ก่อน */
            /* จัดตำแหน่ง shirt (ตัวอย่าง) */
            top: 100px; 
            left: 50px;
            width: 100px; 
            height: 100px;
        }

        #hat {
            z-index: 3;
            display: none; /* ซ่อนไว้ก่อน */
            /* จัดตำแหน่ง hat (ตัวอย่าง) */
            top: 20px;
            left: 60px;
            width: 80px;
            height: 80px;
        }

        .controls { margin-top: 20px; }
        .group { margin-bottom: 10px; }
        button { margin: 5px; padding: 10px; cursor: pointer; }
    </style>
</head>
<body>

<h1>ทดลองแต่งตัวตัวละคร</h1>

<div id="character-wrapper">
    <img id="base" src="image/base.png" alt="Base">
    <img id="shirt" class="decoration" src="" alt="Shirt">
    <img id="hat" class="decoration" src="" alt="Hat">
</div>

<div class="controls">
    <div class="group">
        <button onclick="resetItems()">เริ่มใหม่</button>
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
    const studentData = {
        unlockedItems: ["hat1","shirt1","shirt2"] // ไอเทมที่ปลดล็อค
    };

    function equip(type, src) {
        // ดึงชื่อไฟล์ออกมา
        const itemName = src.split('/').pop().split('.')[0].toLowerCase();

        if(studentData.unlockedItems.includes(itemName)) {
            const img = document.getElementById(type);
            img.src = src;
            img.style.display = 'block'; // แสดงเครื่องแต่งกาย
        } else {
            alert("ไอเทมนี้ยังไม่ปลดล็อค!");
        }
    }

    // ฟังก์ชันสำหรับรีเซ็ตเครื่องแต่งกาย
    function resetItems() {
        document.getElementById('hat').style.display = 'none';
        document.getElementById('shirt').style.display = 'none';
        // คุณอาจจะต้องรีเซ็ต src ด้วย ถ้าต้องการ
        // document.getElementById('hat').src = '';
        // document.getElementById('shirt').src = '';
    }

</script>

</body>
</html>
