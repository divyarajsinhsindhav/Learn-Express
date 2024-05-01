const express = require('express')
const path = require('path')
const app = express()

const port = 3000

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    try {
        res.status(200).sendFile(path.join(__dirname, 'public/templates', 'index.html'))
    } catch(e) {
        throw Error('Something missing!')
    }
});

app.get('/project', (req, res) => {
    try {
        res.status(200).sendFile(path.join(__dirname, 'public/templates', 'project.html'))
    } catch (e) {
        throw Error('Something missing!')
    }
});

app.get('/resume', (req, res) => {
    try {
        res.status(200).sendFile(path.join(__dirname, 'public/templates', 'resume.html'))
    } catch (e) {
        throw Error('Something missing!')
    }
});

app.get('/contact', (req, res) => {
    try {
        res.status(200).sendFile(path.join(__dirname, 'public/templates', 'contact.html'))
    } catch (e) {
        throw Error('Something missing!')
    }
});

app.get('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public/templates', '404.html'))
})

app.listen(port, () => {
    console.log(`App listen on port ${port}`)
});