const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

const artworks = [
	{
		title: 'Dark City',
		thumbnail:
			'https://images.unsplash.com/photo-1525838808082-a422ecbce2ff?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80',
		desc: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit.',
		author: {
			name: 'Alexandre Trouvé',
			image:
				'https://images.unsplash.com/photo-1561903912-87c9615f2b35?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
		}
	}
];

app.get('/', (req, res) => {
	res.render('landing');
});

app.get('/artworks', (req, res) => {
	res.render('artworks', { artworks: artworks });
});

app.listen(port, () => console.log(`listening!`));
