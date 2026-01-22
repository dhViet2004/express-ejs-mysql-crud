const db = require('../config/db');

exports.list = (req, res) => {
    db.query('SELECT * FROM products', (err, rows) => {
        if (err) {
            console.log(err);
            return res.status(500).render('products', {
                message: 'An error occurred'
            });
        }
        res.render('products', { products: rows });
    });
};

exports.addPage = (req, res) => {
    res.render('add');
};

exports.add = (req, res) => {
    const { name, price, quantity } = req.body;

    if (!name || !price || !quantity) {
        return res.status(400).render('add', {
            message: 'Please provide product name, price, and quantity'
        });
    }

    db.query(
        'INSERT INTO products SET ?', { name: name, price: price, quantity: quantity },
        (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).render('add', {
                    message: 'An error occurred'
                });
            }
            return res.status(201).render('add', {
                message: 'Product added successfully'
            });
        }
    );
};

exports.editPage = (req, res) => {
    const id = req.params.id;

    db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).render('edit', {
                message: 'An error occurred'
            });
        }
        if (!results || results.length === 0) {
            return res.status(404).render('edit', {
                message: 'Product not found'
            });
        }
        res.render('edit', { product: results[0] });
    });
};

exports.update = (req, res) => {
    const id = req.params.id;
    const { name, price, quantity } = req.body;

    if (!name || !price || !quantity) {
        return res.status(400).render('edit', {
            message: 'Please provide product name, price, and quantity'
        });
    }

    db.query(
        'UPDATE products SET ? WHERE id = ?', [{ name: name, price: price, quantity: quantity }, id],
        (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).render('edit', {
                    message: 'An error occurred'
                });
            }
            return res.status(200).render('edit', {
                message: 'Product updated successfully'
            });
        }
    );
};

exports.delete = (req, res) => {
    const id = req.params.id;

    db.query('DELETE FROM products WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).redirect('/products');
        }
        return res.status(200).redirect('/products');
    });
};