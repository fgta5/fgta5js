// server yang akan dipublish

import fs from 'node:fs';
import express from 'express';
import { fileURLToPath } from 'node:url';
import * as path from 'node:path';
import loaderDataCity from './loader-data-city.js'
import errorHandler, { notFoundHandler } from './error-handler.js';


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


app.use('/dist', express.static(path.join(__dirname, '..', 'dist')));



app.get('/', (req, res) => {
	res.render('index', {});
});






app.get('/application/:module', (req, res) => {
	const module = req.params.module;
	res.render('demo-application', { module });
});


app.get('/demo-:module', (req, res) => {
	const module = req.params.module;
	res.render(`demo-${module}`, {});
});


app.get('/getting-started-:module', (req, res) => {
	const module = req.params.module;
	res.render(`getting-started-${module}`, {});
});


app.get('/dev', (req, res) => {
	res.render(path.join(__dirname, 'dev', 'index-dev.ejs'), {});
});


const componentMetadata = {
	'ActionButton': {
		description: 'Interactive action button component for initiating processes, state transitions, and triggering form submissions.',
		route: '/actionbutton',
		icon: '<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M12 8v8M8 12h8"></path></svg>'
	},
	'AppManager': {
		description: 'Lifecycle and routing manager for rendering multiple sub-applications dynamically within a single-page view.',
		route: '/applicationmanager',
		icon: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>'
	},
	'Application': {
		description: 'Core application controller responsible for setting up scope, handling events, and managing module-level states.',
		route: '/application',
		icon: '<svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>'
	},
	'Checkbox': {
		description: 'Modern binary or multi-option checkboxes supporting checked, unchecked, and indeterminate states.',
		route: '/checkbox',
		icon: '<svg viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>'
	},
	'Combobox': {
		description: 'Dynamic combobox dropdown with incremental text searching, recommendations, and backend data loading.',
		route: '/combobox',
		icon: '<svg viewBox="0 0 24 24"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>'
	},
	'Datepicker': {
		description: 'Interactive calendar-based date selector designed for seamless and precise date inputs.',
		route: '/datepicker',
		icon: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>'
	},
	'Filebox': {
		description: 'File selector and uploader featuring upload progress, file type constraints, and drag-and-drop support.',
		route: '/filebox',
		icon: '<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>'
	},
	'Form': {
		description: 'A comprehensive form component integrating various inputs, action handlers, state management, and validation flows.',
		route: '/form',
		icon: '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>'
	},
	'Gridview': {
		description: 'Data grid table view for presenting tabbed list data, inline actions, pagination, sorting, and item selection.',
		route: '/gridview',
		icon: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line></svg>'
	},
	'Input': {
		description: 'Abstract base component class managing validation styles, focus/blur listeners, value bindings, and dirty state.',
		route: '/input',
		icon: '<svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-4h11v4zm0-5H4V9h11v4zm5 5h-4V9h4v9z"></path></svg>'
	},
	'MessageBox': {
		description: 'Modern promise-based modal dialog for alerts, confirmations, status messages, and customized prompts.',
		route: '/messagebox',
		icon: '<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>'
	},
	'Numberbox': {
		description: 'Numeric-only input field with thousands separators, minimum/maximum range constraints, and precise decimal control.',
		route: '/numberbox',
		icon: '<svg viewBox="0 0 24 24"><line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line></svg>'
	},
	'Textbox': {
		description: 'Single-line text input component supporting placeholders, type-based validation, and responsive event hooks.',
		route: '/textbox',
		icon: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" ry="2"></rect><line x1="7" y1="12" x2="17" y2="12"></line></svg>'
	},
	'Timepicker': {
		description: 'Time selector field supporting custom hour and minute intervals, optimized for user experience.',
		route: '/timepicker',
		icon: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>'
	}
};

app.get(['/components', '/doc-components'], (req, res) => {
	const componentsDir = path.join(__dirname, 'components');
	fs.readdir(componentsDir, (err, files) => {
		if (err) {
			return res.status(500).send('Error reading components directory');
		}
		const components = files
			.filter(file => file.endsWith('.mjs'))
			.map(file => file.replace('.mjs', ''))
			.filter(name => componentMetadata[name] !== undefined)
			.map(name => ({
				name,
				description: componentMetadata[name].description,
				route: componentMetadata[name].route,
				icon: componentMetadata[name].icon
			}));
		res.render('doc-components', { components });
	});
});

app.get('/:module', (req, res) => {
	const module = req.params.module;
	res.render(`doc-${module}`, {});
});








app.use('/dev', (req, res, next) => {
	if (req.path.endsWith('.ejs')) {
		return res.status(403).send('Forbidden');
	}
	next();
});
app.use('/dev', express.static(path.join(__dirname, 'dev')));


app.get('/dev/:module', (req, res) => {
	const module = req.params.module;
	res.render(path.join(__dirname, 'dev', `${module}-dev.ejs`), {});
});


app.get('/fgta5/main.mjs', (req, res) => {
	res.type('application/javascript');
	res.sendFile(path.join(__dirname, 'main.mjs'));
});

app.use('/fgta5/styles', express.static(path.join(__dirname, '..', 'styles')));
app.use('/fgta5/components', express.static(path.join(__dirname, 'components')));




app.post('/data/city', (req, res) => {
	loaderDataCity(req, res)
})



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

app.use(notFoundHandler);

// custom error handling middleware
app.use(errorHandler);

app.listen(3000);
console.log('Server is listening on port 3000');