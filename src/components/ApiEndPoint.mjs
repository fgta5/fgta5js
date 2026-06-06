/**
 * Kelas ApiEndpoint untuk menangani pemanggilan API HTTP Fetch dengan dukungan abort signal dan penanganan error terpadu.
 */
export default class ApiEndpoint {

	/**
	 * Metode HTTP yang digunakan untuk request.
	 * @type {string}
	 * @private
	 */
	#method = 'POST'

	/**
	 * Header HTTP yang dikirimkan bersama request.
	 * @type {Object<string, string>}
	 * @private
	 */
	#headers = {
		'Content-Type': 'application/json'
	}	

	/**
	 * AbortController untuk membatalkan request jika diperlukan.
	 * @type {AbortController}
	 * @private
	 */
	#controller;

	/**
	 * Path atau URL target API.
	 * @type {string}
	 * @private
	 */
	#path

	/**
	 * Membuat instans baru dari ApiEndpoint.
	 * @param {string} path - URL atau path API.
	 */
	constructor(path) {
		this.#controller = new AbortController();
		this.#path = path
	}

	/**
	 * Mendapatkan header HTTP request saat ini.
	 * @returns {Object<string, string>}
	 */
	get headers() { return this.#headers }

	/**
	 * Mendapatkan metode HTTP.
	 * @returns {string}
	 */
	get method() {return this.#method }

	/**
	 * Mengatur metode HTTP request.
	 * @param {string} v - Metode HTTP (misal: 'GET', 'POST', 'PUT', 'DELETE').
	 */
	set method(v) {
		this.#method = v
	}   

	/**
	 * Membatalkan request API yang sedang berjalan.
	 */
	abort() {
		this.#controller.abort();
	}

	/**
	 * Membebaskan sumber daya pengontrol request.
	 */
	dispose() {
		this.#controller = null
	}

	/**
	 * Mengeset/menambahkan header HTTP kustom.
	 * @param {string} name - Nama header.
	 * @param {string} value - Nilai header.
	 */
	setHeader(name, value) {
		this.#headers[name] = value
	}

	/**
	 * Mengeksekusi request ke endpoint API secara asinkron.
	 * @param {Object} [args] - Argumen/data JSON yang dikirimkan dalam request body.
	 * @param {FormData} [formData] - Objek FormData jika mengirimkan data multipart/form-data (misal upload berkas).
	 * @returns {Promise<any>} Response hasil eksekusi dari API.
	 * @throws {Error} Mengeluarkan error jika request gagal, status tidak ok, atau ada error kode API.
	 */
	async execute(args, formData) {
		const signal = this.#controller.signal;
		const url = this.#path
		const method = this.#method
		const headers = this.#headers

		if (args==null) {
			args={}
		}

		let body
		if (formData==null) {
			body = JSON.stringify(args)
		} else {
			delete headers['Content-Type'] // fetch akan otomatis set, jika diisi akan error boundary
			formData.append('form-body-jsondata', new Blob(
				[JSON.stringify(args)],
				{ type: 'application/json' }
			));
			body = formData
		}

		const options = {
			method,
			headers,
			body,
			credentials: 'include'
		}

		const opt = Object.assign({ signal }, options)

		try {
			const response = await fetch(url, opt);
			if (!response.ok) {
				const status = response.status
				const statustext = response.statusText
				const text = await response.text();
				let errorMessage = `${status} ${statustext}: ${text}`
				if (status==401) {
					// belum login, hapus session login
					sessionStorage.removeItem('login');
					sessionStorage.removeItem('login_nexturl');
					errorMessage = 'authentication is needed to access resource'
				} 

				let apiErrorMessage = errorMessage
				let apiErrorCode = status

				try {
					const jsonPart = errorMessage.split(' : ')[1];
					const obj = JSON.parse(jsonPart);
					let { code, message } = obj;    // appName, moduleName,
					apiErrorMessage = message
					apiErrorCode = code
				} catch (err) {
					apiErrorMessage = errorMessage
					apiErrorCode = 1
				}

				const err = new Error(apiErrorMessage)
				err.status = status
				err.code = apiErrorCode || 1
				throw err
			}

			const res = await response.json();
			if (res.code!=0) {
				const err = new Error(res.message)
				err.code = res.code
				throw err
			}

			return res.result 
		} catch (err) {
			if (err.name === "AbortError") {
				console.warn("Request dibatalkan!");
			} else {
				throw err
			}
		}
	}
}