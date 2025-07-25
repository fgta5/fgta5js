export default class Dataloader {

#controller;

	constructor() {
		this.#controller = new AbortController();
	}

	abort() {
		this.#controller.abort();
	}

	dispose() {
		
	}

	async load(url, options, loadedCallback) {
		const signal = this.#controller.signal;

		if (options==null) {
			options={};
		}

		const opt = Object.assign({ signal }, options);
		try {
			const response = await fetch(url, opt);
			if (!response.ok) {
				const status = response.status
				const statustext = response.statusText
				throw new Error(`${status} ${statustext}: ${options.method} ${url}`)
			}

			const data = await response.json();
			if (typeof loadedCallback == 'function') {
				try {
					loadedCallback(null, data);
				} catch (err) {
					console.error(err);
				}
			}
			return data

		} catch (err) {
			if (err.name === "AbortError") {
				console.log("Request dibatalkan!");
			} else {
				if (typeof loadedCallback == 'function') {
					try {
						loadedCallback(err, null);
					} catch (err) {
						console.error(err);
					}
				} else {
					throw err
				}
			}
		}
	}
}