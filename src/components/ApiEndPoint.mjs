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

	async execute(args) {
		const signal = this.#controller.signal;
		const url = this.#path
		const method = this.#method
		const headers = this.#headers

		if (args==null) {
			args={}
		}

		const options = {
			method: method,
			headers: headers,
			body: JSON.stringify(args)
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
				const err = new Error(errorMessage)
				err.status = status
				err.code = response.code || 1
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