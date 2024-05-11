const express = require('express')
const router = express.Router()
const multer = require('multer');
const uploadFile = require('../controllers/upload.controllers')
const { upload } = require('../middleware/multer.middleware')

router.get('/upload', uploadFile.showUpload)
router.post('/upload', upload.single("file"), uploadFile.upload);

module.exports = router