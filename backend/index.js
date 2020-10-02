require('dotenv').config();
const express = require('express');
const app = express();
const serveStatic = require('serve-static');
const cors = require('cors');

const port = 3000;

app.use(cors());

app.get('/api/rewrite', require('./api/rewrite'));
app.use(serveStatic('../web/public', { index: ['index.html'] }));

app.listen(port, () => {
  console.log(`Example app listening at http://0.0.0.0:${port}`);
});
