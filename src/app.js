require('dotenv').config();
const express = require('express');

const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());

// creating route
app.get('/test', (req, res) => {
  res.json('test page');
});

app.listen(PORT, HOST, () => {
  console.log(`Server berjalan di ${HOST}:${PORT}`);
});
