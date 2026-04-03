<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Math Tools</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: #ffffff;
      font-family: 'Poppins', sans-serif;
    }
    .box {
      background-color: #FFD700;
      padding: 30px 60px;
      border-radius: 12px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      text-align: center;
    }
    .title {
      color: #000000;
      font-size: 32px;
      font-weight: 600;
      margin-bottom: 20px;
    }
    .pdf-button {
      background-color: #FFD700;
      color: black;
      padding: 12px 25px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 18px;
      margin-top: 15px;
      display: inline-block;
    }
    iframe.pdf-viewer {
      width: 90%;
      height: 600px;
      border: 2px solid #FFD700;
      border-radius: 12px;
      margin-top: 30px;
    }
  </style>
</head>
<body>

  <div class="box">
    <div class="title">Math Tools</div>
    
    <!-- ปุ่มเปิด PDF -->
    <a href="file.pdf" target="_blank" class="pdf-button">เปิด PDF</a>
    
    <!-- ฝัง PDF (ถ้าต้องการให้แสดงตรงหน้าเว็บ) -->
    <iframe src="file.pdf" class="pdf-viewer"></iframe>
  </div>

</body>
</html>
