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

app.get('/artworks', (req, res) => {
	Artwork.find({})
		.then((allArtworks) => {
			res.render('artworks', { artworks: allArtworks });
		})
		.catch((err) => console.log(err));
});

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

app.get('/artworks/new', (req, res) => {
	res.render('newArtwork');
});

app.listen(port, () => console.log(`listening!`));
