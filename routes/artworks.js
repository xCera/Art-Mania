// ================== ARTWORKS ROUTE ======================
const express = require('express'),
	router = express.Router(),
	middlewareObject = require('../middleware/index.js'),
	Artwork = require('../models/artwork'),
	User = require('../models/user');

//	INDEX ROUTE - Show all artworks on page

router.get('/', (req, res) => res.redirect('/artworks'));

router.get('/artworks', (req, res) => {
	Artwork.find({})
		.then((allArtworks) => {
			res.render('artworks/artworks', { artworks: allArtworks, user: req.user, success: req.flash('success') });
		})
		.catch((err) => console.log(err));
});

//	CREATE ROUTE - Get data from form then create new Artwork

router.post('/artworks', (req, res) => {
	Artwork.create({
		title: req.body.title,
		thumbnail: req.body.thumbnail,
		desc: req.body.desc,
		author: {
			_id: req.user._id,
			userName: req.user.userName,
			firstName: req.user.firstName,
			lastName: req.user.lastName,
			avatar: req.user.avatar
		}
	})
		.then((newArtwork) => {
			console.log('New artwork succesfuly created');
			console.log(newArtwork);
			res.redirect('/artworks');
		})
		.catch((err) => console.log(err));
});

// NEW ROUTE - Show form to create new Artwork

router.get('/artworks/new', middlewareObject.loginRequired, (req, res) => {
	res.render('artworks/newArtwork', { user: req.user });
});

// SHOW ROUTE - Show info about one specific artwork

router.get('/artworks/:id', (req, res) => {
	let id = req.params.id;
	Artwork.findById(id)
		.populate('comments')
		.then((artwork) => {
			let checkOwnership = false;
			if (req.user) {
				if (artwork.author._id.equals(req.user._id)) {
					checkOwnership = true;
				} else {
					checkOwnership = false;
				}
			}
			return res.render('artworks/showArtwork', {
				artwork: artwork,
				user: req.user,
				isOwner: checkOwnership
			});
		})
		.catch((err) => console.log(err));
});

// EDIT ROUTE - Show form to edit artwork
router.get('/artworks/:id/edit', (req, res) => {
	let id = req.params.id;
	Artwork.findById(id)
		.then((artwork) => {
			if (artwork.author._id.equals(req.user._id)) {
				res.render('artworks/editArtwork', { artwork: artwork, user: req.user });
			} else {
				res.redirect('/artworks');
			}
		})
		.catch((err) => console.log(err));
});

// UPDATE ROUTE - Get infro from form and update artowrk

router.put('/artworks/:id', (req, res) => {
	let id = req.params.id;
	Artwork.findByIdAndUpdate(id, req.body, { new: true })
		.then((updatedArtowrk) => {
			res.redirect(`/artworks/${id}`);
		})
		.catch((err) => console.log(err));
});

//// DELETE ROUTE - Delete artwork

router.delete('/artworks/:id', (req, res) => {
	let id = req.params.id;
	Artwork.findByIdAndDelete(id)
		.then(() => {
			console.log('Artwork successfully deleted!');
			return res.redirect('/artworks');
		})
		.catch((err) => console.log(err));
});

//SEARCH
function escapeRegex(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

router.search('/artworks', (req, res) => {
	const regex = new RegExp(escapeRegex(req.body.search), 'gi');
	Artwork.find({ title: regex })
		.then((foundArtworks) => {
			res.render('artworks/artworks', { artworks: foundArtworks, user: req.user });
		})
		.catch((err) => console.log(err));
});

module.exports = router;
