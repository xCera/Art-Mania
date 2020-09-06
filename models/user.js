const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	userName: { type: String, unique: true, required: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	avatar: {
		type: String,
		default:
			'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fcnaca.ca%2Fwp-content%2Fuploads%2F2018%2F10%2Fuser-icon-image-placeholder.jpg&f=1&nofb=1'
	},
	email: { type: String, unique: true, required: true },
	password: String
});

module.exports = mongoose.model('User', userSchema);
