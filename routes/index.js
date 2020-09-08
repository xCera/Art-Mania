const { route } = require('./comments.js');

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
	res.render('user/register', { user: req.user, error: req.flash('error') });
});

router.post('/user/register', (req, res) => {
	let hash = bcrypt.hashSync(req.body.password, Number(process.env.numFactor));
	req.body.password = hash;
	let newUser = new User(req.body);
	newUser.save((err) => {
		if (err) {
			let error = 'Something bad happend! Please try again.';
			if (err.code === 11000) {
				error = 'That email or username is already taken, please try another.';
				console.log(error);
			}
			req.flash('error', `${error}`);
			return res.redirect('/user/register');
		} else {
			req.flash('success', 'Successfully created account, please log in now!');
			return res.redirect('/user/login');
		}
	});
});

//===================== LOGIN ===========================

router.get('/user/login', (req, res) => {
	res.render('user/login', { user: req.user, error: req.flash('error'), success: req.flash('success') });
});

router.post('/user/login', (req, res) => {
	User.findOne({ email: req.body.email }, (err, user) => {
		if (err || !user || !bcrypt.compareSync(req.body.password, user.password)) {
			return res.render('user/login', { user: req.user, error: 'Incorrect password or email' });
		}
		req.session.userId = user._id;
		req.flash('success', 'Successfully logged in! Welcome!');
		res.redirect('/user/dashboard');
	});
});

// DASHBOARD
router.get('/user/dashboard', middlewareObject.loginRequired, (req, res, next) => {
	User.findById(req.session.userId, (err, user) => {
		if (err) {
			return next(err);
		}

		if (!user) {
			return res.redirect('/user/login');
		}
		Artwork.find().where('author._id').equals(user._id).then((artworks) => {
			return res.render('user/dashboard', {
				user: req.user,
				artworks: artworks,
				success: req.flash('success')
			});
		});
	});
});

// PROFILE

router.get('/user/profile/:id', (req, res) => {
	let id = req.params.id;
	User.findById(id, (err, user) => {
		if (err) {
			return next(err);
		}

		Artwork.find().where('author._id').equals(user._id).then((artworks) => {
			return res.render('user/userProfile', { user: user, artworks: artworks });
		});
	});
});

//===================== LOGOUT ===========================

router.get('/user/logout', middlewareObject.loginRequired, (req, res) => {
	req.session.userId = null;
	res.redirect('/artworks');
});

module.exports = router;
