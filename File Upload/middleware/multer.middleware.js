const multer = require('multer')
const express = require('express')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '-' + file.originalname
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })

  exports.upload = multer({ storage: storage })