const express = require('express');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const router = require('./routes/routes')
const app = express();

const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use(cookieParser())
app.use('/', router)

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
});

