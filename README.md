<style>
    /* พื้นที่แสดงตัวละคร */
    #character-container {
      position: relative;
      width: 300px;  
      height: 400px;
      margin: 0 auto;
      background-color: #fff;
      border: 2px solid #333;
      overflow: hidden;
    }

    /* Base: ตัวละครหลัก */
    #base {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%; /* ให้ Base เต็มกรอบเป็นหลัก */
      height: 100%;
      object-fit: contain;
      z-index: 1;
    }

    /* --- ส่วนที่แก้ไข: บังคับขนาดของตกแต่ง --- */
    .item-layer {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      display: none; 
      /* บังคับไม่ให้ใช้ขนาดจริงของไฟล์ภาพ */
      height: auto !important; 
    }

    #hat {
      z-index: 10;
      width: 120px !important; /* ใช้ px จะคุมง่ายกว่า % ในกรณีนี้ */
      top: 20px;               /* ปรับระยะจากขอบบนของกรอบลงมาที่หัว */
    }

    #shirt {
      z-index: 5;
      width: 180px !important; /* ปรับขนาดเสื้อให้กว้างกว่าหมวก */
      top: 120px;              /* ปรับระยะลงมาให้ตรงช่วงตัว */
    }
</style>
