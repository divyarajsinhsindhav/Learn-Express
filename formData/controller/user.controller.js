const db = require('../db.json')
const {v4 : uuidv4} = require('uuid')
const { validationResult } = require('express-validator');
const fs = require('fs')

const auth = require('../services/auth.services');

exports.showLogin = (req, res) => {
    res.render('login', { errors: [] })
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
            fs.writeFile('./db.json', JSON.stringify(db), (err, data) => {
                if (err) {
                    throw err
                }
            });
            return res.redirect('/login');
        }
    } catch (e) {
        throw Error('Something went wrong')
    }
}

exports.login = async (req, res) => {
    const email = req.body.email;
    const user = db.find((user) => user.email === email)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // console.log(errors)
        return res.render('login', { errors: errors.array() });
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
    res.render('profile', { userData, userId: req.userId } )
  };

exports.logut = (req, res) => {
    try {
        res.clearCookie('token').redirect('/login')
    } catch (error) {
        throw error
    }
}