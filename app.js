const express = require('express'),
	app = express(),
	port = 3000,
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	methodOverride = require('method-override');

// REQUIRING ROUTES

const artworksRoutes = require('./routes/artworks');

// ===================== APPLICATIONS SETUP ============================

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
mongoose.set('useFindAndModify', false);

//======================== DATABASE SETUP =========================================
mongoose
	.connect('mongodb://localhost:27017/art_mania', {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => console.log('Connected to DB!'))
	.catch((error) => console.log(error.message));

//================================== ROUTES =========================================

app.use(artworksRoutes);

app.listen(port, () => console.log(`listening!`));
