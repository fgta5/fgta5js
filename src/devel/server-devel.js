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
app.set('views', path.join(__dirname));

// serve static files
app.use('/fgta5/components', express.static(path.join(__dirname, '..', 'components')));
app.use('/fgta5/styles', express.static(path.join(__dirname, '..', '..', 'styles')));




app.get('/form', (req, res) => {
	res.render('dev-form', {});
});

app.get('/textbox', (req, res) => {
	res.render('dev-textbox', {});
});

app.get('/numberbox', (req, res) => {
	res.render('dev-numberbox', {});
});

app.get('/datepicker', (req, res) => {
	res.render('dev-datepicker', {});
});

app.get('/timepicker', (req, res) => {
	res.render('dev-timepicker', {});
});

app.get('/checkbox', (req, res) => {
	res.render('dev-checkbox', {});
});

app.get('/selector', (req, res) => {
	res.render('dev-selector', {});
});

app.get('/fileupload', (req, res) => {
	res.render('dev-fileupload', {});
});

app.get('/applicationmanager', (req, res) => {
	res.render('dev-applicationmanager', {});
});





app.listen(3030);
console.log('Server is listening on port 3030');