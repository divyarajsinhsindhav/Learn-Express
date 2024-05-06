const express = require('express')
const bodyParser = require('body-parser')
const router = require('./routes/routes')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = express()

const port = 3000

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.set('view engine', 'ejs');

app.use('/', router)

app.listen(port, () => {
    console.log(`Server is running on ${port}`)
})