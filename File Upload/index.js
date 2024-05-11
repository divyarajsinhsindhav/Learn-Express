const express = require('express')
const router  = require('./routes/routes')
const cors = require('cors')

const app = express()

const port = 3000

app.use(cors())

app.set('view engine', 'ejs')
app.use('/', router)

app.listen(port, () => {
    console.log(`Server is running on ${port}`)
});