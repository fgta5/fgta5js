import { fileURLToPath } from 'node:url';
import * as path from 'node:path';
import express from 'express';
import favicon from 'serve-favicon';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();



app.set('view engine', 'ejs');

app.use(favicon('favicon.ico'))
app.use(express.json()); 


app.use('/dist', express.static('dist'))
app.use('/images', express.static('images'))
app.use('/src', express.static('src'))
app.use('/styles', express.static('styles'))


app.use('/:env/dist', express.static('dist'))
app.use('/:env/images', express.static('images'))
app.use('/:env/src', express.static('src'))
app.use('/:env/styles', express.static('styles'))


app.get('/', function(req, res) {
	res.render('index', {
		title: 'Fgta5js Development',
	});
})


/* Debug Test */
app.get('/debug/:page', function(req, res) {
	const pageName = req.params.page;
	res.render(pageName, {
		title: pageName + ' - fgta5js Debug',
		script: 'head-script-dev.ejs',
		style: 'head-style-dev.ejs'
	}, (err, html)=>{
		if (err) {
			console.error('Error rendering EJS:', err.message);
			return res.status(404).send('Halaman tidak ditemukan');
		}
		res.send(html);
	});
});


/* Release */
app.get('/release/:page', function(req, res) {
	const pageName = req.params.page;
	res.render(pageName, {
		title: pageName + ' - fgta5form Build',
		script: 'head-script-build.ejs',
		style: 'head-style-build.ejs'
	}, (err, html)=>{
		if (err) {
			console.error('Error rendering EJS:', err.message);
			return res.status(404).send('Halaman tidak ditemukan');
		}
		res.send(html);
	});
});

app.post('/getdata', async (req, res) => {
	
	var test_max_row = 20
	var sleep = (ms) => { return new Promise(resolve => setTimeout(resolve, ms)) };
	
	// siapkan template data untuk result
	var jsonresult = {
		searchtext: '',
		nextoffset: 0,
		limit: 30,
		data: []
	}

	// jika req.body kosong, berarti saat pertama search tanpa parameter apa2



	// ambil parameter dari request body
	const { searchtext, limit, offset, test_delay, test_stop_at } = req.body;


	var test_max_row = test_stop_at!=undefined?test_stop_at : test_max_row
	var endofresult = false
	for (var i=offset; i<(offset+limit); i++) {
		
		// test maksimal data di test_max_row
		if (i>=test_max_row) {
			endofresult = true
			break
		}

		if (test_delay!==undefined) {
			await sleep(test_delay)
		}
		
		var nama = `${searchtext!=''?searchtext:'data'}-${i}`
		var alamat = `alamat-${nama}`

		jsonresult.data.push({value:nama, text:nama, nama:nama, alamat:alamat})
	}

	jsonresult.nextoffset = !endofresult ? offset+limit : null
	jsonresult.limit = limit

	res.send(JSON.stringify(jsonresult))
})


app.listen(3000);
console.log('Server is listening on port 3000');