import express from 'express';

const app = express();
const PORT = 3000;

// เปิดให้ Express อ่าน JSON จาก Body (ต้องอยู่ก่อนทุก Route)
app.use(express.json());

// ---------- ข้อมูล (เก็บใน RAM ข้อมูลหายเมื่อ Server รีสตาร์ต) ----------
const students = [
  { stdID: '69319010007', stdName: 'นาย กฤษดา บุญเหลือ' },
  { stdID: '69319010008', stdName: 'นาย ญาณวุฒิ จันเพ็ง' },
  { stdID: '69319010009', stdName: 'นาย ณภัทร โสธรรมมงคล' },
  { stdID: '69319010010', stdName: 'นาย ธนดล คล้ายรัศมี' },
  { stdID: '69319010011', stdName: 'นาย ธีทัต จันทร์สว่าง' },
  { stdID: '69319010012', stdName: 'นาย นัฐพนธ์ ใจเย็น' },
  { stdID: '69319010013', stdName: 'นาย ปกรณ์เกียรติ อยู่พิทักษ์สกุล' },
  { stdID: '69319010014', stdName: 'นาย ปฏิพล เรืองชัย' },
  { stdID: '69319010015', stdName: 'นาย ปิยะพงษ์ เหล่าประชาวิทย์' },
  { stdID: '69319010018', stdName: 'นางสาว ภัทราวรินทร์ ศรีน้อย' },
  { stdID: '69319010019', stdName: 'นาย ภูริพัฒน์ สุธรรมมา' },
  { stdID: '69319010020', stdName: 'นาย ภูวดล พลจารย์' },
  { stdID: '69319010022', stdName: 'นาย ศาศวัต แสงคําฉาย' },
  { stdID: '69319010023', stdName: 'นาย อภิรักษ ศรีวัดทานัง' }
];

// ---------- ฟังก์ชันช่วยตรวจข้อมูล ----------

// ต้องเป็นข้อความ และไม่ว่างหลังตัดช่องว่างหัวท้าย
function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim() !== '';
}

// Body ต้องเป็น Object ธรรมดา (ไม่ใช่ null, ไม่ใช่ Array)
function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

// ค้นหานักศึกษาจากรหัส ถ้าไม่พบคืน -1
function findIndexById(stdID) {
  return students.findIndex(s => s.stdID === stdID);
}

// ---------- Route ----------

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// READ: ดูนักศึกษาทั้งหมด
app.get('/api/students', (req, res) => {
  res.json(students);
});

// READ: ดูนักศึกษารายคน
app.get('/api/students/:stdID', (req, res) => {
  const stdID = req.params.stdID.trim();
  const index = findIndexById(stdID);

  if (index === -1) {
    return res.status(404).json({ message: `ไม่พบนักศึกษารหัส ${stdID}` });
  }

  res.json(students[index]);
});

// CREATE: เพิ่มนักศึกษา
app.post('/api/students', (req, res) => {
  const body = req.body;

  // Express 5: ถ้าไม่ส่ง Body มา req.body จะเป็น undefined
  if (!isPlainObject(body)) {
    return res.status(400).json({ message: 'Body ต้องเป็น JSON Object' });
  }

  const { stdID, stdName } = body;

  if (!isNonEmptyString(stdID)) {
    return res.status(400).json({ message: 'stdID ต้องเป็นข้อความที่ไม่ว่าง' });
  }
  if (!isNonEmptyString(stdName)) {
    return res.status(400).json({ message: 'stdName ต้องเป็นข้อความที่ไม่ว่าง' });
  }

  const newStudent = { stdID: stdID.trim(), stdName: stdName.trim() };

  if (findIndexById(newStudent.stdID) !== -1) {
    return res.status(409).json({ message: `รหัสนักศึกษา ${newStudent.stdID} มีอยู่แล้ว` });
  }

  students.push(newStudent);
  res.status(201).json(newStudent);
});

// UPDATE: แก้ไขชื่อนักศึกษา (stdID เป็นคีย์หลัก จึงไม่ให้แก้)
app.put('/api/students/:stdID', (req, res) => {
  const stdID = req.params.stdID.trim();
  const index = findIndexById(stdID);

  if (index === -1) {
    return res.status(404).json({ message: `ไม่พบนักศึกษารหัส ${stdID}` });
  }

  const body = req.body;

  if (!isPlainObject(body)) {
    return res.status(400).json({ message: 'Body ต้องเป็น JSON Object' });
  }

  if (!isNonEmptyString(body.stdName)) {
    return res.status(400).json({ message: 'stdName ต้องเป็นข้อความที่ไม่ว่าง' });
  }

  students[index].stdName = body.stdName.trim();
  res.json(students[index]);
});

// DELETE: ลบนักศึกษา
app.delete('/api/students/:stdID', (req, res) => {
  const stdID = req.params.stdID.trim();
  const index = findIndexById(stdID);

  if (index === -1) {
    return res.status(404).json({ message: `ไม่พบนักศึกษารหัส ${stdID}` });
  }

  const [removed] = students.splice(index, 1);
  res.json(removed);
});

// ---------- Error handler (ต้องอยู่หลัง Route ทั้งหมด และมี 4 พารามิเตอร์) ----------
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'รูปแบบ JSON ไม่ถูกต้อง' });
  }
  console.error(err);
  res.status(500).json({ message: 'เกิดข้อผิดพลาดที่ Server' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
