const artwork = require('./models/artwork');

const express = require('express'),
	app = express(),
	port = 3000,
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	Artwork = require('./models/artwork');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

//======================== DATABASE SETUP =========================================
mongoose
	.connect('mongodb://localhost:27017/art_mania', {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => console.log('Connected to DB!'))
	.catch((error) => console.log(error.message));

//================================== ROUTES =========================================

app.get('/', (req, res) => {
	res.render('landing');
});

//	INDEX ROUTE - Show all artworks on page

app.get('/artworks', (req, res) => {
	Artwork.find({})
		.then((allArtworks) => {
			res.render('artworks', { artworks: allArtworks });
		})
		.catch((err) => console.log(err));
});

//	CREATE ROUTE - Get data from form then create new Artwork

app.post('/artworks', (req, res) => {
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

app.get('/artworks/new', (req, res) => {
	res.render('newArtwork');
});

// SHOW ROUTE - Show info about one specific artwork

app.get('/artworks/:id', (req, res) => {
	let id = req.params.id;
	Artwork.findById(id)
		.then((artwork) => {
			console.log(artwork);
			res.render('showArtwork', { artwork: artwork });
		})
		.catch((err) => console.log(err));
});

app.listen(port, () => console.log(`listening!`));
