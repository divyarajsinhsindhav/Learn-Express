const db = require('../db.json')
const fs = require('fs')

const auth = require('../middleware/authantication');

exports.getAllUser = (req, res) => {
  return res.send({ user: db });
}

exports.login = async (req, res) => {
    const email = req.body.email;
    const inputPassword = req.body.password;
    const user = db.find((user) => user.email === email)
    if (!user) {
      return res.send('User not found');
    }

    const password = user.password;
    if (password !== inputPassword) {
      return res.send("Your password is wrong");
    }    
    try {
        const token = auth.createAccessToken(user.id, user.role);
        res.send({ token: token, status: 'Login Successfully' })
    } catch (error) {
        console.error("Token generation or storage error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


exports.profile = (req, res) => {
    if (!req.user.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    const userData = db.find(user => user.id === req.user.userId);
  
    if (!userData) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.send({ userData })
  };
