// ================== ARTWORKS ROUTE ======================
const express = require('express'),
	router = express.Router(),
	middlewareObject = require('../middleware/index.js'),
	Artwork = require('../models/artwork'),
	User = require('../models/user'),
	Comment = require('../models/comment');

module.exports = router;
