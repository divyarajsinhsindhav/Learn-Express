const { verify } = require('jsonwebtoken')

exports.authenticate = (req, res, next) => {
    try {
        // const authorization = req.headers['Authorization'];
        // if (!authorization) {
        //     console.log('error')
        //     return res.status(401).redirect('/login')
        // }
        // const token = authorization.split(' ')[1]
        const token = req.cookies['token']
        if (!token) {
            return res.status(401).redirect('/login')
        }
        const decodedToken  = verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.userId = decodedToken.userId;
        next();
    } catch (e) {
        next(e); // Pass the error to Express's error handling middleware
    }
}