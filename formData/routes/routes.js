const express = require('express')
const router = express.Router()

const user = require('../controller/user.controller')
const { authenticate } = require('../middleware/authantication')
const { validateLogin } = require('../middleware/validator')

router.get('/login', user.showLogin);
router.get('/register', user.showRegister);

router.get('/profile', authenticate, user.profile);

router.post('/register', user.register);
router.post('/login', validateLogin, user.login)
router.post('/logout', user.logut);

module.exports = router