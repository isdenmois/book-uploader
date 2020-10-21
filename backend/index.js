require('dotenv').config();
const express = require('express');
const app = express();
const serveStatic = require('serve-static');
const cors = require('cors');

const port = 3000;

app.use(cors());

app.get('/api/rewrite', require('./api/rewrite'));
app.post('/api/rewrite', require('./api/rewrite'));
app.use(serveStatic('../web/public', { index: ['index.html'] }));

app.listen(port, () => {
  console.log(`Book search app listening at http://localhost:${port}`);
});
