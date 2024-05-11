require('dotenv').config()
const multer = require('multer')
const { uploadOnCloudinary } = require('../services/cloudinary.services')

exports.showUpload = async (req, res) => {
    return res.render('upload')
}

exports.upload = async (req, res) => {
    console.log(req.body)
    console.log(req.file)
    try {
        const uploadResult = await uploadOnCloudinary('./' + req.file.path);

        console.log(uploadResult)
    } catch (e) {
        throw Error(e)
    }
    return res.redirect('/upload')
}