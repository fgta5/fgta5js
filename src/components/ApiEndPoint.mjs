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
				throw new Error(`${status} ${statustext}: ${options.method} ${url}`)
			}

			const res = await response.json();
			if (res.code!=0) {
				throw new Error(res.message)
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