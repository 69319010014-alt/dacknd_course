import express from 'express';

const app = express();
const PORT = 3000;

// แปลงข้อความเป็นตัวเลขที่มากกว่า 0 (รับทศนิยมได้) ถ้าไม่ถูกต้องคืน null
function parsePositiveNumber(value) {
  if (typeof value !== 'string' || !/^\d+(\.\d+)?$/.test(value)) return null;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

// 1. ตรวจสอบการทำงานของเซิร์ฟเวอร์
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 2. สูตรคณิตศาสตร์ 1 ส่งพารามิเตอร์แบบ query (2 ตัว)
//    พื้นที่สามเหลี่ยม = 1/2 x ฐาน x สูง
//    ตัวอย่าง: GET /api/formula1?base=10&height=5
app.get('/api/formula1', (req, res) => {
  const base = parsePositiveNumber(req.query.base);
  const height = parsePositiveNumber(req.query.height);

  if (base === null || height === null) {
    return res.status(400).json({
      message: 'ต้องส่ง base และ height เป็นตัวเลขที่มากกว่า 0 เช่น ?base=10&height=5'
    });
  }

  res.json({
    formula: 'พื้นที่สามเหลี่ยม = 1/2 x ฐาน x สูง',
    base,
    height,
    result: 0.5 * base * height
  });
});

// 3. สูตรคณิตศาสตร์ 2 ส่งพารามิเตอร์แบบ path (2 ตัว)
//    พื้นที่สี่เหลี่ยมผืนผ้า = กว้าง x ยาว
//    ตัวอย่าง: GET /api/formula2/4/6
app.get('/api/formula2/:width/:length', (req, res) => {
  const width = parsePositiveNumber(req.params.width);
  const length = parsePositiveNumber(req.params.length);

  if (width === null || length === null) {
    return res.status(400).json({
      message: 'width และ length ต้องเป็นตัวเลขที่มากกว่า 0 เช่น /api/formula2/4/6'
    });
  }

  res.json({
    formula: 'พื้นที่สี่เหลี่ยมผืนผ้า = กว้าง x ยาว',
    width,
    length,
    result: width * length
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
