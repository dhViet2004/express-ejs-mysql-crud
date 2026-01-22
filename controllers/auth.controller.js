const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.loginPage = (req, res) => {
    // If already logged in, redirect to products
    if (req.session.user) {
        return res.redirect('/products');
    }
    res.render('login');
};

exports.login = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).render('login', {
            message: 'Please provide username and password'
        });
    }

    db.query('SELECT username, password FROM users WHERE username = ?', [username], async(error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).render('login', {
                message: 'An error occurred during login'
            });
        }

        if (!results || results.length === 0 || !(await bcrypt.compare(password, results[0].password))) {
            return res.status(401).render('login', {
                message: 'Username or password is incorrect'
            });
        }

        // Set session
        req.session.user = username;
        req.session.loginTime = new Date();
        
        console.log(`User ${username} logged in successfully`);
        res.status(200).redirect('/products');
    });
};

exports.registerPage = (req, res) => {
    res.render('register');
};

exports.register = (req, res) => {
    const { username, password, passwordConfirm } = req.body;

    if (!username || !password || !passwordConfirm) {
        return res.status(400).render('register', {
            message: 'Please provide all required fields'
        });
    }

    if (password !== passwordConfirm) {
        return res.status(400).render('register', {
            message: 'Passwords do not match'
        });
    }

    db.query('SELECT username FROM users WHERE username = ?', [username], async(error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).render('register', {
                message: 'An error occurred'
            });
        }

        if (results.length > 0) {
            return res.status(400).render('register', {
                message: 'Username is already in use'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 8);

        db.query('INSERT INTO users SET ?', { username: username, password: hashedPassword }, (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).render('register', {
                    message: 'An error occurred'
                });
            }

            return res.status(201).render('register', {
                message: 'User created successfully'
            });
        });
    });
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/');
    });
};