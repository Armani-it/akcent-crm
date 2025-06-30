const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Получить все заявки
app.get('/api/entries', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM entries ORDER BY "createdAt" DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Добавить новую заявку
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
    res.status(500).send("Server Error");
  }
});

// Обновить заявку (НОВЫЙ МАРШРУТ)
app.put('/api/entries/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, trialDate, assignedTeacher, assignedTime, paymentType, packageType, paymentAmount } = req.body;

        const updatedEntry = await pool.query(
            `UPDATE entries SET 
                status = $1, 
                "trialDate" = $2, 
                "assignedTeacher" = $3, 
                "assignedTime" = $4, 
                "paymentType" = $5, 
                "packageType" = $6, 
                "paymentAmount" = $7 
            WHERE id = $8 RETURNING *`,
            [status, trialDate, assignedTeacher, assignedTime, paymentType, packageType, paymentAmount, id]
        );

        if (updatedEntry.rows.length > 0) {
            res.json(updatedEntry.rows[0]);
        } else {
            res.status(404).send("Entry not found");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

app.get('/', (req, res) => {
    res.send('Backend for Akcent CRM is working!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});