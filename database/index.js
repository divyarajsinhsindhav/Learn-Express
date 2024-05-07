const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const router = require('./routes/routes')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()

const PORT = 3000

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())
app.use('/', router);
app.use(cors());

app.set('view engine', 'ejs')

mongoose
    .connect('mongodb://localhost:27017/databaseProject')
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("MongoDB error: ", err));

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})