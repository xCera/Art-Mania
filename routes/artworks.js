// ================== ARTWORKS ROUTE ======================
const express = require('express'),
	router = express.Router(),
	Artwork = require('../models/artwork');

//	INDEX ROUTE - Show all artworks on page

router.get('/', (req, res) => res.redirect('/artworks'));

router.get('/artworks', (req, res) => {
	Artwork.find({})
		.then((allArtworks) => {
			res.render('artworks/artworks', { artworks: allArtworks, user: req.user });
		})
		.catch((err) => console.log(err));
});

//	CREATE ROUTE - Get data from form then create new Artwork

router.post('/artworks', (req, res) => {
	Artwork.create({
		title: req.body.title,
		thumbnail: req.body.thumbnail,
		desc: req.body.desc
	})
		.then((newArtwork) => {
			console.log('New artwork succesfuly created');
			console.log(newArtwork);
		})
		.catch((err) => console.log(err));
	res.redirect('/artworks');
});

// NEW ROUTE - Show form to create new Artwork

router.get('/artworks/new', (req, res) => {
	res.render('artworks/newArtwork', { user: req.user });
});

// SHOW ROUTE - Show info about one specific artwork

router.get('/artworks/:id', (req, res) => {
	let id = req.params.id;
	Artwork.findById(id)
		.then((artwork) => {
			res.render('artworks/showArtwork', { artwork: artwork, user: req.user });
		})
		.catch((err) => console.log(err));
});

// EDIT ROUTE - Show form to edit artwork
router.get('/artworks/:id/edit', (req, res) => {
	let id = req.params.id;
	Artwork.findById(id)
		.then((artwork) => {
			res.render('artworks/editArtwork', { artwork: artwork, user: req.user });
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

module.exports = router;
