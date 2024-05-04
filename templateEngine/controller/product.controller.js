const connection = require('../connection');

exports.getProduct = (req, res) => {
    try {
        let sql = "SELECT * FROM products";
        const category = req.query.category;
        if (category) {
            sql += " WHERE category=?"
            connection.query(sql, [category], (err, rows) => {
                if (err) {
                    return res.send({ message: err });
                }
                res.render('product', { title: category, product: rows });
            });
        } else {
            connection.query(sql, (err, rows) => {
                if (err) {
                    return res.send({ message: err });
                }
                res.render('product', { title: 'Products', product: rows });
            });
        }
    } catch (e) {
        console.error('Error:', e);
        return res.status(500).send({ message: 'Internal server error' });
    }
}

exports.getProductId = (req, res) => {
    try {
        const id = req.params.id;
        connection.query("SELECT * FROM products WHERE id=?", [id], (err, rows) => {
            if (err) {
                return res.send({ message: err });
            }
            if (rows.length === 0) {
                return res.status(404).send({ message: 'Product not found' });
            }
            const product = rows[0];
            res.render('productPage', { title: product.name, product: product });
        });
    } catch (e) {
        console.error('Error:', e);
        return res.status(500).send({ message: 'Internal server error' });
    }
}
