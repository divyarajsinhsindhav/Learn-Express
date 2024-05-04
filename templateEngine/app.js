const express = require('express')
const bodyParser = require('body-parser')
const router = require('./routes/routes')

const app = express()

const port = 3000

app.set('view engine', 'ejs')

app.use('/', router)
app.use(bodyParser.urlencoded({ extended: false }))



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})
