export default class Dataloader {

	#controller;

	constructor() {
		this.#controller = new AbortController();
	}

	Abort() {
		this.#controller.abort()
	}


	async Load(url, options, loadedCallback) {
		const signal = this.#controller.signal;

		
		/*
		// contoh parameter options
		options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer your-token-here' // jika perlu autentikasi
			},
			body: JSON.stringify({
				key1: 'value1',
				key2: 'value2'
			})
		}
		*/

		if (options==null) {
			options={}
		}

		const opt = Object.assign({ signal }, options)
		try {
			const response = await fetch(url, opt);
			const data = await response.json();
			if (typeof loadedCallback == 'function') {
				loadedCallback(null, data)
			}
		} catch (err) {
			if (err.name === "AbortError") {
				console.log("Request dibatalkan!");
			} else {
				if (typeof loadedCallback == 'function') {
					loadedCallback(err, null)
				}
			}
		}
	}

}