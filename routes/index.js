// =========== AUTH ROUTE =================
const express = require('express'),
	router = express.Router(),
	bcrypt = require('bcryptjs'),
	User = require('../models/user');

require('dotenv').config();

//======================== MIDDLEWARE ====================

router.use((req, res, next) => {
	if (!(req.session && req.session.userId)) {
		return next();
	}

	User.findById(req.session.userId, (err, user) => {
		if (err) {
			return next(err);
		}
		if (!user) {
			return next();
		}
		user.password = undefined;
		req.user = user;
		res.locals.user = user;
		next();
	});
});

const loginRequired = function(req, res, next) {
	if (!req.user) {
		return res.redirect('/login');
	}

	next();
};

// ====================== REGISTER ========================
router.get('/register', (req, res) => {
	res.render('user/register');
});

router.post('/register', (req, res) => {
	let hash = bcrypt.hashSync(req.body.password, Number(process.env.numFactor));
	req.body.password = hash;
	let newUser = new User(req.body);
	newUser
		.save()
		.then((user) => {
			console.log(user);
			return res.redirect('/dashboard');
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

router.get('/login', (req, res) => {
	res.render('user/login');
});

router.post('/login', (req, res) => {
	User.findOne({ email: req.body.email }, (err, user) => {
		if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
			return res.render('user/login', { error: 'Incorrect password or email' });
		}
		req.session.userId = user._id;
		res.redirect('/dashboard');
	});
});

router.get('/dashboard', loginRequired, (req, res, next) => {
	User.findById(req.session.userId, (err, user) => {
		if (err) {
			return next(err);
		}

		if (!user) {
			return res.redirect('/login');
		}

		res.render('user/dashboard', { currentUser: req.user });
	});
});

module.exports = router;
