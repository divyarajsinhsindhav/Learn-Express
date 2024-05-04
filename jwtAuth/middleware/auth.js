const { verify } = require('jsonwebtoken')

const isAuth = (req, res) => {
    try {
        const authorization = req.headers['authorization']
        if(!authorization) {
            throw new Error('You need to login')
        }
        const token = authorization.split(' ')[1];
        const { userId } = verify(token, process.env.ACCESS_TOKEN_SECRET)
        return userId
    } catch (e) {
        throw new Error(e.message);
    }
}


exports.authantication = (req, res, next) => {
    try {
        const userId = isAuth(req)
        if (userId) {
            req.userId = userId;
            next();
        } else {
            res.status(401).json({ error: 'Authentication failed. Please login again.' });
        }
    } catch (e) {
        res.status(401).json({ error: `${e.message}` });
    }
}