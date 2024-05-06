const db = require('../db.json')
const bcrypt = require('bcrypt')
const {v4 : uuidv4} = require('uuid')
const fs = require('fs')

const auth = require('../services/auth.services')

exports.showLogin = (req, res) => {
    res.render('login')
}

exports.showRegister = (req, res) =>  {
    res.render('register')
}

exports.register = async (req, res) => {
    try {
        const user = req.body;
        const userEmail = req.body.email;
        const exist = db.find((user) => user.email === userEmail)
        if (exist) {
            return res.json({ message: 'User with this email already exist!' })
        } else {
            const password = await (bcrypt.hash(user.password, 10))
            const data = {
                'id': uuidv4(),
                'email': user.email,
                'password': password,
                'firstName': user.firstName,
                'lastName': user.lastName,
                'jobTitle': user.jobtitle
            }
            db.push(data)
            console.log(data)
            fs.writeFile('./db.js', JSON.stringify(db), (err, data) => {
                res.json({ status: 'Success', email: req.body.email })
            });
            return res.redirect('/login');
        }
    } catch (e) {
        throw Error('Something went wrong')
    }
}

exports.login = async (req, res) => {
    const email = req.body.email;
    const reqPassword = req.body.password;
    const user = db.find((user) => user.email === email)
    
    if (!user) {
        return res.json({ message: "User doesn't exist" });
    }

    const password = user.password;
    const check = await bcrypt.compare(reqPassword, password);

    if (!check) {
        return res.json({ message: "Incorrect password" });
    }

    try {
        const token = auth.createAccessToken(user.id); // Assuming createAccessToken takes only user ID as argument
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/profile')
    } catch (error) {
        console.error("Token generation or storage error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


exports.profile = (req, res) => {
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    const userData = db.find(user => user.id === req.userId);
  
    if (!userData) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.render('profile', { userData });
  };

exports.logut = (req, res) => {
    try {
        res.clearCookie('token').redirect('/login')
    } catch (error) {
        
    }
}