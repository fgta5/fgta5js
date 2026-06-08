import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read HTML templates once at startup
const notFoundHtml = fs.readFileSync(path.join(__dirname, 'templates', '404.html'), 'utf-8');
const errorHtmlTemplate = fs.readFileSync(path.join(__dirname, 'templates', '500.html'), 'utf-8');

/**
 * Custom 404 Middleware
 */
export function notFoundHandler(req, res) {
	res.status(404).send(notFoundHtml);
}

/**
 * Custom Error Handling Middleware for Express
 */
export default function errorHandler(err, req, res, next) {
	console.error(err);

	if (process.env.NODE_ENV === 'production') {
		return res.status(404).send(notFoundHtml);
	}

	const escapeHtml = (unsafe) => {
		if (typeof unsafe !== 'string') return unsafe ? String(unsafe) : '';
		return unsafe
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	};

	const safeMessage = escapeHtml(err.message || err);
	const safeStack = escapeHtml(err.stack || 'No stack trace available');

	// Inject dynamic values into the 500 template
	const renderedHtml = errorHtmlTemplate
		.replace('{{message}}', safeMessage)
		.replace('{{stack}}', safeStack);

	res.status(500).send(renderedHtml);
}
