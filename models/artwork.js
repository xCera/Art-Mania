const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({
	title: String,
	thumbnail: String,
	desc: String,
	date: {
		type: Date,
		default: Date.now()
	},
	author: {},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment'
		}
	]
});

module.exports = mongoose.model('Artwork', artworkSchema);
