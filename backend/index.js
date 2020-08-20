require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;

app.get('/api/rewrite', require('./api/rewrite'));

app.listen(port, () => {
  console.log(`Example app listening at http://0.0.0.0:${port}`);
});
