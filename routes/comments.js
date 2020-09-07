const { find, findById } = require('../models/artwork');

// ================== ARTWORKS ROUTE ======================
const express = require('express'),
	router = express.Router(),
	middlewareObject = require('../middleware/index.js'),
	Artwork = require('../models/artwork'),
	User = require('../models/user'),
	Comment = require('../models/comment');

// ================ CREATE A NEW COMMENT =======================
router.post('/artworks/:id/comment', middlewareObject.loginRequired, (req, res) => {
	let id = req.params.id;
	Artwork.findById(id)
		.then((foundArtwork) => {
			Comment.create({
				text: req.body.text,
				author: {
					_id: req.user._id,
					userName: req.user.userName,
					avatar: req.user.avatar
				}
			})
				.then((newComment) => {
					newComment.save();
					foundArtwork.comments.push(newComment);
					foundArtwork.save();
					console.log(foundArtwork);
					res.redirect(`/artworks/${id}`);
				})
				.catch((err) => console.log(err));
		})
		.catch((err) => console.log(err));
});

// =========================== EDIT COMMENT ==============================
router.put('/artworks/:id/comment/:comId', middlewareObject.loginRequired, (req, res) => {
	let artworkId = req.params.id;
	let comId = req.params.comId;
	Comment.findByIdAndUpdate(comId, req.body, { new: true })
		.then(() => {
			res.redirect(`/artworks/${artworkId}`);
		})
		.catch((err) => console.log(err));
});

// ========================== DELETE COMMENT ============================

router.delete('/artworks/:id/comment/:comId', middlewareObject.loginRequired, (req, res) => {
	let artworkId = req.params.id;
	let commentId = req.params.comId;
	console.log(req.body);
	Comment.findById(commentId).then((foundComment) => {
		if (foundComment.author._id.equals(req.user._id)) {
			foundComment
				.remove()
				.then(() => {
					console.log('comment succesfully removed');
					res.redirect(`/artworks/${artworkId}`);
				})
				.catch((err) => console.log(err));
		}
	});
});

module.exports = router;
