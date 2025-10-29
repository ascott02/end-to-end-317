import express from 'express';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.get('/', (req, res) => {
  const name = req.query.name ?? 'stranger';
  res.type('text/plain').send(`Hello, ${name}!`);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
