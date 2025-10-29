import express from 'express';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.type('html').send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>POST demo</title>
</head>
<body>
  <h1>POST demo</h1>
  <form method="POST">
    <label>
      Name:
      <input name="name" placeholder="Enter name" />
    </label>
    <button type="submit">Submit</button>
  </form>
</body>
</html>`);
});

app.post('/', (req, res) => {
  const { name } = req.body ?? {};
  const message = name ? `Hello, ${name}` : 'Please supply a name!';
  res.type('text/plain').send(message);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
