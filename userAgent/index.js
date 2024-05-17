const express = require('express')
// const useragent = require('express-useragent')
const UAParser = require('ua-parser-js')

const app = express();

const PORT = 4000

// app.use(useragent.express())
// app.get('/', (req, res) => {
//     console.log(req.useragent)
// })

app.get('/', (req, res) => {
    const parser = new UAParser();
    const userAgent = req.headers['user-agent'];
    const uaResult = parser.setUA(userAgent).getResult();
    console.log(uaResult)
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})