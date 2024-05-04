const express = require('express');
const router = express.Router();

const productController = require('../controller/product.controller')

router.get('/', (req, res) => {
    res.render('index', { title: 'Express' });
});

router.get('/product', productController.getProduct);
router.get('/product/:id', productController.getProductId);

module.exports = router