import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors'; // импортируем CORS

// Определяем __dirname в ES модулях
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 5000;

// Разрешаем CORS запросы от фронтенда
app.use(cors({
  origin: 'http://localhost:3000', // Разрешаем доступ с фронтенда
  methods: ['GET', 'POST'], // Разрешаем только GET и POST запросы
  allowedHeaders: ['Content-Type', 'Authorization'], // Разрешаем заголовки
}));

// Даем доступ к папке с изображениями
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Хранилище для загрузок
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    // Если папка не существует, создаем её
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Генерируем уникальное имя файла
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Создаем объект для обработки загрузки
const upload = multer({ storage });

// Роут для загрузки изображений
app.post('/upload', upload.single('image'), (req, res) => {
  res.json({ message: 'Image uploaded successfully!', file: req.file });
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
