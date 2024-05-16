const express = require('express')
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
const fs = require('fs')
const db = require('./db.json')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')

const app = express();

const JWT_SECRET = 'fnk90nco9nni90190cnjkqanc'

app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs');

const PORT = 4000

app.post('/signup', async (req, res) => {
    try {
        const body = req.body; //request body
        const email = body.email;
        const password = body.password;
        const hashPassword = await bcrypt.hash(password, 8)
        db.push({ id : db.length+1, email: email, password: hashPassword}) //push body into user
        fs.writeFile('./db.json', JSON.stringify(db), (err, data) => {
            return res.status(201).json({ status: "Success", id: db.length}); 
        });
    } catch(e) {
        throw Error('Error while create the user')
    }
})

app.post('/login', async (req, res) => {
    try {
        const body = req.body;
        const email = body.email;
        const user = db.find(user => user.email === email);
        if (!user) return res.send({ message: "User not found" });
        const password = await bcrypt.compare(body.password, user.password)
        if(!password) return res.send({ message: "Password is wrong!" });
        return res.send({ data: user });
    } catch (e) {
        throw Error("Error while login the user")
    }
});

app.post('/login/forgetpass', async (req, res) => {
    try {
        
        const auth = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: "your-gmail-id",
                pass: "your-mail-password"
            }
        })
        const body = req.body;
        const email = body.email
        const user = db.find(user => user.email === body.email);
        if (!user) return res.send({ message: "User not found" });
        
        const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });

        const recevier = {
            from: "your-gmail-id",
            to: email,
            subject: "Change your password",
            html: `<p>You have requested a password reset. Click <a href="http://localhost:4000/reset-password?token=${token}">here</a> to reset your password.</p>`
        }
        auth.sendMail(recevier, (error, emailResponse) => {
            if (error) throw error
            console.log("Success!")
            res.end();
        })
    } catch (e) {
        throw Error("Error while test mail." + e)
    }
})

app.get('/reset-password', (req, res) => {
    try {
        const { token } = req.query;
        console.log(token)
        res.render('reset_password', { token: token })
    } catch (e) {
        throw Error("Error while rendering reset password")
    }
})

app.post('/reset-password', async (req, res) => {
    try {
        const { token , newPassword } = req.body;
        // Verify JWT token
        const decoded = jwt.verify(token, JWT_SECRET);
        const email = decoded.email;

        // Find user by email
        const userIndex = db.findIndex(user => user.email === email);

        if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Hash the new password
        const hashPassword = await bcrypt.hash(newPassword, 10);

        // Update user's password in the database
        db[userIndex].password = hashPassword;

        // Write updated user data to the database file
        fs.writeFile('./db.json', JSON.stringify(db), (err) => {
            if (err) {
                console.error('Error writing to database:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            return res.status(200).json({ status: 'Password reset successfully' });
        });
    } catch (error) {
        console.error('Error resetting password:', error);
        return res.status(400).json({ error: 'Invalid or expired token' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})