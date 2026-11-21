import express from 'express';

const app = express();
const PORT = 3000;

// เปิดให้ Express อ่าน JSON จาก Body (ต้องอยู่ก่อนทุก Route)
app.use(express.json());

// ---------- ข้อมูล (เก็บใน RAM ข้อมูลหายเมื่อ Server รีสตาร์ต) ----------
const equipment = [
  { id: 101, name: 'Notebook', category: 'computer', quantity: 5 },
  { id: 102, name: 'Projector', category: 'display', quantity: 2 },
  { id: 103, name: 'PC', category: 'computer', quantity: 10 }
];

// ตัวนับ ID: ใช้ค่าปัจจุบันแล้วบวก 1 ไม่ซ้ำแม้อนาคตจะลบข้อมูล
let nextId = 104;

// ---------- ฟังก์ชันช่วยตรวจข้อมูล ----------

// ต้องเป็นข้อความ และไม่ว่างหลังตัดช่องว่างหัวท้าย
function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim() !== '';
}

// แปลง ID จากข้อความเป็นจำนวนเต็มบวก ถ้าไม่ถูกต้องคืน null
function parseId(value) {
  if (!/^\d+$/.test(value)) return null;   // ต้องเป็นตัวเลขล้วน
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

// quantity ต้องเป็นจำนวนเต็มที่ปลอดภัย ตั้งแต่ 0 ขึ้นไป
function isValidQuantity(value) {
  return Number.isSafeInteger(value) && value >= 0;
}

// Body ต้องเป็น Object ธรรมดา (ไม่ใช่ null, ไม่ใช่ Array)
function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

// ---------- Route (ที่พาธตายตัวต้องอยู่ก่อน Route ที่มี :param) ----------

app.get('/', (req, res) => {
  res.send('Hello, Backend!');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// แสดงทั้งหมด หรือกรองตาม ?category=
app.get('/api/equipment', (req, res) => {
  const { category } = req.query;

  if (category === undefined) {
    return res.json(equipment);
  }

  if (!isNonEmptyString(category)) {
    return res.status(400).json({ message: 'category ต้องเป็นข้อความที่ไม่ว่าง' });
  }

  const keyword = category.trim().toLowerCase();
  const result = equipment.filter(item => item.category.toLowerCase() === keyword);
  res.json(result);
});

// ต้องอยู่ก่อน /:id ไม่เช่นนั้น "count" จะถูกมองเป็น ID
app.get('/api/equipment/count', (req, res) => {
  res.json({ total: equipment.length });
});

app.get('/api/equipment/:id', (req, res) => {
  const id = parseId(req.params.id);

  if (id === null) {
    return res.status(400).json({ message: 'ID ต้องเป็นจำนวนเต็มบวก' });
  }

  const item = equipment.find(e => e.id === id);

  if (!item) {
    return res.status(404).json({ message: `ไม่พบอุปกรณ์ ID ${id}` });
  }

  res.json(item);
});

app.post('/api/equipment', (req, res) => {
  const body = req.body;

  // Express 5: ถ้าไม่ส่ง Body มา req.body จะเป็น undefined
  if (!isPlainObject(body)) {
    return res.status(400).json({ message: 'Body ต้องเป็น JSON Object' });
  }

  const { name, category, quantity } = body;

  if (!isNonEmptyString(name)) {
    return res.status(400).json({ message: 'name ต้องเป็นข้อความที่ไม่ว่าง' });
  }
  if (!isNonEmptyString(category)) {
    return res.status(400).json({ message: 'category ต้องเป็นข้อความที่ไม่ว่าง' });
  }
  if (!isValidQuantity(quantity)) {
    return res.status(400).json({ message: 'quantity ต้องเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป' });
  }

  const newItem = {
    id: nextId++,
    name: name.trim(),
    category: category.trim(),
    quantity
  };

  equipment.push(newItem);
  res.status(201).json(newItem);
});

// ---------- Error handler (ต้องอยู่หลัง Route ทั้งหมด และมี 4 พารามิเตอร์) ----------
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'รูปแบบ JSON ไม่ถูกต้อง' });
  }
  console.error(err);
  res.status(500).json({ message: 'เกิดข้อผิดพลาดที่ Server' });
});

app.patch('/api/equipment:id',(req,res)=>{
  const id = Number(req.params.id)
  if(id===null){
    return res.status(400).json({
      message: "ต้องระบุ ID ที่จะแก่ไข"
    })
  }
const item =equipment.find(e=>.id===id)
if (!item){
  return res.status(400).json({
    message:"ไม่พบข้อมูลที่ต้องการแก้ไข"
  })
}
if(0bject,has0wn(body,'name')
  &&0bject.has0wn(body,'quantit')
  &&0bject.has0wn(body,'quantit')

  }


})

app.delete('/api/equipment/id'),(req,res)=>{
  const id = Number(req.params.id)
  if(id===null){
    return res.status(404).json({
      message:"ไม่พบ ID ที่ต้องการลบ"
    })
  }
  const [deleted] = equipment.splice(index,1)
  res.status(200).json({
    message:"ลบข้อมูลอุปกรณ์แล้ว"
  })
}

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
