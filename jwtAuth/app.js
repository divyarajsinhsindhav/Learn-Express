require('dotenv/config')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { hash, compare } = require('bcryptjs')
const db = require('./db.json')
const fs = require('fs')
const { createAccessToken, createRefreshToken, sendRefreshToken, sendAccessToken } = require('./auth')
const { authantication } = require('./middleware/auth')
const { verify } = require('jsonwebtoken')
const app = express()

app.use(cookieParser())

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}))

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

//Register user
app.post('/api/register', async (req, res) => {
    try {
        const { email, password } = req.body
        const exist = db.find((user) => user.email === email)
        if (exist) {
            res.json({ message: 'User with this emailId already exist' })
        } else {
            const hashPassword = await hash(password, 8)
            db.push({ email, hashPassword })
            fs.writeFile('./db.json', JSON.stringify(db), (err, data) => {
                res.json({ status: 'Success', email: req.body.email })
            });
        }
    } catch (e) {
        throw Error('Something missing')
    }
});

//Login user
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const userData = db.find((user) => user.email === email)
        // console.log(userData)
        if (!userData) {
            res.json({ message: 'User with this emailId is not valid' })
        } else {
            const validate = await compare(password, userData.password)
            if (validate) {
                const accessToken = createAccessToken(userData.id)
                const refreshToken = createRefreshToken(userData.id)
                userData.refreshtoken = refreshToken;
                sendRefreshToken(res, refreshToken)
                sendAccessToken(req, res, accessToken)
                console.log(userData)
            } else {
                res.json({ message: 'Password is wrong!' })
            }
        }
    } catch (e) {
        throw Error(e.message)
    }
});

//GET - login user data
//Protected route
app.get('/api/user/', authantication,async (req, res) => {
    try {
        const id = Number(req.userId)
        const userData = db.find((user) => user.id === id)
        return res.json(userData)
    } catch (e) {
        res.send({ error: `${e.message}` })
    }
})

//Logout user
app.post('/api/logout', (req, res) => {
    res.clearCookie('refreshtoken', { path: '/api/refresh_token' })
    return res.send({ message: 'Logged Out' })
})

//New accessToken
app.post('/api/refresh_token', (req, res) => {
    const token = req.cookies.refreshtoken;
    //If don't have a token in our request
    if (!token) {
        console.log('hr')
        return res.send({ accesstoken: ' ' })
    }
    //Else, verify it!!
    let payload = null;
    try {
        payload = verify(token, process.env.REFRESH_TOKEN_SECRET)
    } catch (e) {
        return res.send({ accesstoken: ' ' })
    }
    //Token is valid, check if user exist
    const user = db.find((user) => user.id === payload.userId)
    if (!user) {
        return res.send({ accesstoken: ' ' })
    }
    //User exist, check if refreshtoken exist on user
    if (user.refreshtoken !== token) {
        return res.send({ accesstoken: ' ' })
    }
    //Token exist, create new Refresh and Access Token
    const accesstoken = createAccessToken(user.id)
    const refreshtoken = createRefreshToken(user.id)
    user.refreshtoken = refreshtoken
    sendRefreshToken(res, refreshtoken);
    return res.send({ accesstoken })
})


app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`)
})