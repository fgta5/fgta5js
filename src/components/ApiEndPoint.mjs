export default class ApiEndpoint {

	#method = 'POST'
	#headers = {
		'Content-Type': 'application/json'
	}	

	#controller;
	#path
	constructor(path) {
		this.#controller = new AbortController();
		this.#path = path
	}

	get headers() { return this.#headers }

	get method() {return this.#method }
	set method(v) {
		this.#method = v
	}   

	abort() {
		this.#controller.abort();
	}

	dispose() {
		this.#controller = null
	}

	setHeader(name, value) {
		this.#headers[name] = value
	}

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