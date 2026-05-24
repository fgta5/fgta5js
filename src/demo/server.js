// server untuk test dan develop komponen

import express from 'express';
import { fileURLToPath } from 'node:url';
import * as path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

const sleep = (ms) => { return new Promise(resolve => setTimeout(resolve, ms)) };

// parse json request body
app.use(express.json());

// gunakan EJS template engine
app.set('view engine', 'ejs');

// set direktori view
app.set('views', path.join(__dirname, 'views'));

// serve static files
app.use('/styles', express.static(path.join(__dirname, 'styles'))); // demo styles (first priority)
app.use('/styles', express.static(path.join(__dirname, '../../styles'))); // lib styles
app.use('/src', express.static(path.join(__dirname, '../../src')));
app.use('/fonts', express.static(path.join(__dirname, '../../fonts')));
app.use('/images', express.static(path.join(__dirname, '../../images')));

app.get('/', (req, res) => {
	res.render('index', {});
});

app.get('/form', (req, res) => {
	res.render('demoform', {});
});

// data endpoint for combobox selecting
app.post('/getdata', async (req, res) => {
	var test_max_row = 20;

	// siapkan template data untuk result
	var jsonresult = {
		searchtext: '',
		nextoffset: 0,
		limit: 30,
		data: []
	};

	// ambil parameter dari request body
	const { searchtext, limit, offset, test_delay, test_stop_at } = req.body;

	var max_row = test_stop_at != undefined ? test_stop_at : test_max_row;
	var endofresult = false;
	for (var i = offset; i < (offset + limit); i++) {
		if (i >= max_row) {
			endofresult = true;
			break;
		}

		if (test_delay !== undefined) {
			await sleep(test_delay);
		}

		var nama = `${searchtext != '' ? searchtext : 'data'}-${i}`;
		var alamat = `alamat-${nama}`;

		jsonresult.data.push({ value: nama, text: nama, nama: nama, alamat: alamat });
	}

	jsonresult.nextoffset = !endofresult ? offset + limit : null;
	jsonresult.limit = limit;

	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify(jsonresult));
});

app.listen(3000);
console.log('Server is listening on port 3000');