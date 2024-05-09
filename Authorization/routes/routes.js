const express = require('express');
const router = express.Router();

const user = require('../controller/user.controller');
const { authantication } = require('../middleware/authantication');
const { authorization } = require('../middleware/authorization');

router.get('/admin/user', authantication, authorization(["admin"]), user.getAllUser);

router.get('/profile', authantication, user.profile);
router.post('/login', user.login);

module.exports = router;
