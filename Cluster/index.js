const express = require('express')

const app = express()

const PORT = 3000

app.get('/', (req, res) => {
    res.status(200).json({
        message: `Hello, from node.js where process id is ${process.pid}`
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})