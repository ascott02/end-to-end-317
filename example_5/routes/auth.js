import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

function signToken(userId) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not set');
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

router.post('/register', async (req, res) => {
  const { username, password } = req.body ?? {};
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const pool = req.app.get('pool');
    await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2)',
      [username, hash]
    );
    res.json({ success: true, message: 'User registered' });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, error: 'Username already taken' });
    }
    res.status(500).json({ success: false, error: 'Registration failed', detail: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body ?? {};
  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'username and password are required' });
  }

  try {
    const pool = req.app.get('pool');
    const result = await pool.query(
      'SELECT id, username, password FROM users WHERE username = $1',
      [username]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = signToken(user.id);
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Login failed', detail: error.message });
  }
});

router.get('/profile', verifyToken, async (req, res) => {
  try {
    const pool = req.app.get('pool');
    const result = await pool.query('SELECT id, username FROM users WHERE id = $1', [req.user.id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Profile lookup failed', detail: error.message });
  }
});

export default router;
