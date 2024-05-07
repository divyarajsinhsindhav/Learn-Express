const express = require('express')
const router = express.Router();
const user = require('../controller/index.controller')

router.post('/user', user.createUser)
router.get('/user', user.getUser)
router.get('/user/:id', user.getUserProfile)
router.put('/user/:id', user.updateUser)
router.delete('/user/:id', user.deleteUser);

module.exports = router