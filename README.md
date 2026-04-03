<!DOCTYPE html>
<html>
<head>
  <title>RPG นักเรียน</title>
</head>
<body>
<h1>RPG นักเรียน</h1>
<div id="students"></div>

<script>
const API_URL = "https://script.google.com/macros/s/AKfycbx0c3-4rg-8zlecIsmMCAh6J2KmC1QxGYOsEPoLeB-lTKv6t_7KxhVkJiOwry8dacN7-Q/exec";

// โหลดข้อมูลนักเรียน
async function loadStudents() {
  const res = await fetch(API_URL);
  const students = await res.json();
  
  const container = document.getElementById("students");
  container.innerHTML = "";
  students.forEach(s => {
    const div = document.createElement("div");
    div.innerHTML = `
      <b>${s.ชื่อ}</b> | คะแนน: ${s.คะแนน} | เลเวล: ${s.เลเวล}
      <button onclick="addScore('${s.ชื่อ}')">+10 คะแนน</button>
    `;
    container.appendChild(div);
  });
}

// เพิ่มคะแนนนักเรียน
async function addScore(name) {
  // ดึงข้อมูลเก่า, เพิ่ม 10
  const res = await fetch(API_URL);
  const students = await res.json();
  const student = students.find(s => s.ชื่อ === name);
  const newScore = Number(student.คะแนน) + 10;
  
  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ ชื่อ: name, คะแนน: newScore }),
    headers: { "Content-Type": "application/json" }
  });
  
  loadStudents(); // รีโหลดข้อมูล
}

loadStudents();
</script>
</body>
</html>
