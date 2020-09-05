const express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	methodOverride = require('method-override'),
	sessions = require('client-sessions');
require('dotenv').config();

// REQUIRING ROUTES

const artworksRoutes = require('./routes/artworks'),
	indexRoutes = require('./routes/index');

// ===================== APPLICATIONS SETUP ============================

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(
	sessions({
		cookieName: 'session',
		secret: `${process.env.secret}`,
		duration: 30 * 60 * 100
	})
);

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

//======================== DATABASE SETUP =========================================
mongoose
	.connect(`${process.env.DB_URL}`, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => console.log('Connected to DB!'))
	.catch((error) => console.log(error.message));

//================================== ROUTES =========================================

app.use(artworksRoutes);
app.use(indexRoutes);

app.listen(process.env.port, () => console.log(`listening!`));
