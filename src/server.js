// src/server.js

import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { errors } from "celebrate";
import { connectMongoDB } from './db/connectMongoDB.js';

import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRoutes from './routes/notesRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT ?? 3030; // Використовуємо значення з .env або дефолтний порт 3030

// Глобальні middleware
app.use(logger);         // 1. Логер першим — бачить усі запити
app.use(express.json()); // 2. Парсинг JSON-тіла
app.use(cors());         // 3. Дозвіл для запитів з інших доменів

app.use(notesRoutes);    // 4. Підключаємо групу маршрутів
app.use(authRoutes);

app.use(notFoundHandler); // 404 — якщо маршрут не знайдено

app.use(errors()); // обробка помилок від celebrate (валідація)

app.use(errorHandler); // Error handler → якщо трапилась помилка на будь-якому етапі

await connectMongoDB();  // підключення до MongoDB

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
