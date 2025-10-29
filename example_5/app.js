import express from 'express';
import dotenv from 'dotenv';
import pkg from 'pg';
import authRoutes from './routes/auth.js';

dotenv.config();

const { Pool } = pkg;
const app = express();
const pool = new Pool();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('pool', pool);

app.use('/auth', authRoutes);

app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
