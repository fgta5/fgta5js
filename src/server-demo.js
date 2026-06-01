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

// serve favicon
app.get('/favicon.ico', (req, res) => {
	res.sendFile(path.join(__dirname, 'demo', 'images', 'ferrine-icon.ico'));
});

// gunakan EJS template engine
app.set('view engine', 'ejs');

// set direktori view
app.set('views', path.join(__dirname, 'demo', 'views'));



// di static direcory /demo, reject akses ke file *.ejs
app.use('/demo', (req, res, next) => {
	if (req.path.endsWith('.ejs')) {
		return res.status(403).send('Forbidden');
	}
	next();
});
app.use('/demo', express.static(path.join(__dirname, 'demo')));




app.get('/', (req, res) => {
	res.render('index', {});
});

app.get('/demo-form', (req, res) => {
	res.render('demo-form', {});
});


app.get('/input', (req, res) => {
	res.render('doc-input', {});
});

app.get('/textbox', (req, res) => {
	res.render('doc-textbox', {});
});

app.get('/numberbox', (req, res) => {
	res.render('doc-numberbox', {});
});

app.get('/datepicker', (req, res) => {
	res.render('doc-datepicker', {});
});

app.get('/timepicker', (req, res) => {
	res.render('doc-timepicker', {});
});

app.get('/checkbox', (req, res) => {
	res.render('doc-checkbox', {});
});

app.get('/combobox', (req, res) => {
	res.render('doc-combobox', {});
});

app.get('/fileupload', (req, res) => {
	res.render('doc-fileupload', {});
});

app.get('/applicationmanager', (req, res) => {
	res.render('doc-applicationmanager', {});
});


// demo aplikasi, buat akses /application/<nama-module>
app.get('/application/:module', (req, res) => {
	const module = req.params.module;
	res.render('demo-application', { module });
});

app.get('/demo-applicationmanager', (req, res) => {
	res.render('demo-applicationmanager', {});
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