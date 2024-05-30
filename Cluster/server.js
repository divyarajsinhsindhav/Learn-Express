const cluster = require("cluster")
const os = require('os')
const express = require('express')

const totalCPUs = os.cpus().length;

if(cluster.isPrimary) {
    for (let index = 0; index < totalCPUs; index++) {
        cluster.fork()
    }
} else {
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
}