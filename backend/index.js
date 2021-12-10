require('dotenv').config()
const serveStatic = require('serve-static')
const cors = require('cors')
const app = require('polka')()

const port = process.env.PORT || 3000

app.use(cors())

app.get('/api/rewrite', require('./api/rewrite'))
app.post('/api/rewrite', require('./api/rewrite'))
app.use(serveStatic('../web/dist', { index: ['index.html'] }))

app.listen(port, () => {
  console.log(`Book search app listening at *:${port}`)
})
