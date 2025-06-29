// Подключаем установленные пакеты
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

// Создаем приложение Express
const app = express();
const port = process.env.PORT || 3001;

// Эти строки нужны, чтобы сервер мог принимать данные в формате JSON
app.use(cors());
app.use(express.json());

// --- ПОДКЛЮЧЕНИЕ К БАЗЕ ДАННЫХ ---
// Express будет автоматически использовать переменную окружения DATABASE_URL,
// которую мы добавим на Render.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// --- МАРШРУТЫ (API) ---

// Маршрут для получения всех заявок
app.get('/api/entries', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM entries ORDER BY "createdAt" DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Ошибка на сервере");
  }
});

// Маршрут для добавления новой заявки
app.post('/api/entries', async (req, res) => {
  try {
    const { clientName, phone, trialDate, trialTime, rop, source, comment, status, createdAt } = req.body;
    const newEntry = await pool.query(
      'INSERT INTO entries ("clientName", phone, "trialDate", "trialTime", rop, source, comment, status, "createdAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [clientName, phone, trialDate, trialTime, rop, source, comment, status, createdAt]
    );
    res.json(newEntry.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Ошибка на сервере");
  }
});

// Тестовый маршрут для проверки работы сервера
app.get('/', (req, res) => {
    res.send('Сервер Akcent CRM работает!');
});


// Запускаем сервер
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});