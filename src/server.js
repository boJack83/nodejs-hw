// src/server.js
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import 'dotenv/config';
import { connectMongoDB } from './db/connectMongoDB.js';

const app = express();

// Використовуємо значення з .env або дефолтний порт 3030
const PORT = process.env.PORT ?? 3030;

// Middleware для парсингу JSON
app.use(express.json());
app.use(cors());

app.use(
  pino({
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
        messageFormat: '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
        hideObject: true,
      },
    },
  }),
);


// Middleware для логування
app.use((req, res, next) => {
  console.log(`Time: ${new Date().toLocaleString()}`);
  next();
});

// // Перший маршрут
// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'Hello world!' });
// });

// Маршрут, який буде повертати всі нотатки:
app.get('/notes', (req, res) => {
  res.status(200).json({ message: "Retrieved all notes" });
});

// Маршрут, який буде повертати одну нотатку за її ідентифікатором
app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;
  res.status(200).json({ message: `Retrieved note with ID: ${noteId}` });
});

// Cпеціальний тестовий маршрут для імітації виникнення помилки
app.get('/test-error', () => {
  throw new Error('Simulated server error');
});

// Додано middleware для 404 (після всіх маршрутів) для обробки всіх запитів, що не відповідають жодному наявному маршруту
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Додано middleware для помилок 500
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ message: err.message });
});





// підключення до MongoDB
await connectMongoDB();

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
