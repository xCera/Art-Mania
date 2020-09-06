// =========== AUTH ROUTE =================
const express = require('express'),
	router = express.Router(),
	bcrypt = require('bcryptjs'),
	middlewareObject = require('../middleware/index.js'),
	Artwork = require('../models/artwork'),
	User = require('../models/user');

require('dotenv').config();

// ====================== REGISTER ========================
router.get('/user/register', (req, res) => {
	res.render('user/register', { user: req.user });
});

router.post('/user/register', (req, res) => {
	let hash = bcrypt.hashSync(req.body.password, Number(process.env.numFactor));
	req.body.password = hash;
	let newUser = new User(req.body);
	newUser
		.save()
		.then((user) => {
			console.log(user);
			return res.redirect('/user/dashboard');
		})
		.catch((err) => {
			let error = 'Something bad happend! Please try again.';
			if (err.code === 11000) {
				error = 'That email is already taken, please try another.';
				console.log(error);
			}

			return res.render('user/register', { error: error });
		});
});

//===================== LOGIN ===========================

router.get('/user/login', (req, res) => {
	res.render('user/login', { user: req.user });
});

router.post('/user/login', (req, res) => {
	User.findOne({ email: req.body.email }, (err, user) => {
		if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
			return res.render('user/login', { error: 'Incorrect password or email' });
		}

		req.session.userId = user._id;
		res.redirect('/user/dashboard');
	});
});

router.get('/user/dashboard', middlewareObject.loginRequired, (req, res, next) => {
	User.findById(req.session.userId, (err, user) => {
		if (err) {
			return next(err);
		}

		if (!user) {
			return res.redirect('/user/login');
		}
		Artwork.find().where('author._id').equals(user._id).then((artworks) => {
			return res.render('user/dashboard', { user: user, artworks: artworks });
		});
	});
});

//===================== LOGOUT ===========================

router.get('/user/logout', middlewareObject.loginRequired, (req, res) => {
	req.session.userId = null;
	res.redirect('/artworks');
});

module.exports = router;
