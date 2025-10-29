import express from 'express';
import bcrypt from 'bcrypt';

const router = express.Router();

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
    res.json({ message: 'User registered' });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Username already taken' });
    }
    res.status(500).json({ error: 'Registration failed', detail: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body ?? {};
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' });
  }

  try {
    const pool = req.app.get('pool');
    const result = await pool.query(
      'SELECT id, username, password FROM users WHERE username = $1',
      [username]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful', user: { id: user.id, username: user.username } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed', detail: error.message });
  }
});

export default router;
