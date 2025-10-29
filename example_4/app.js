import express from 'express';
import dotenv from 'dotenv';
import pkg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';
import userRoutes from './routes/users.js';

dotenv.config();

const { Pool } = pkg;
const app = express();
const pool = new Pool();
const PORT = process.env.PORT ?? 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.set('pool', pool);

app.use('/users', userRoutes);

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
