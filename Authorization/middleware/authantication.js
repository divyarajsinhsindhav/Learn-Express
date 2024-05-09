require('dotenv').config()
const jwt = require('jsonwebtoken')

exports.createAccessToken = (userId, role) => {
    return jwt.sign({ userId, role }, process.env.ACCESS_TOKEN_SECRET);
}


exports.authantication = (req, res, next) => {
    try {
        const authorization = req.headers['authorization'];
        if (!authorization) {
            return res.send({ status: 'You need to login' });
        }
        const token = authorization.split(' ')[1]
        const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = user
        next();
    } catch (e) {
        throw Error(e);
    }
}