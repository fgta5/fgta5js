/**
 * Kelas Dataloader untuk menangani proses pemuatan data jarak jauh secara asinkron dengan fetch API dan dukungan pembatalan (abort).
 */
export default class Dataloader {

	/**
	 * AbortController untuk membatalkan request load.
	 * @type {AbortController}
	 * @private
	 */
	#controller;

	/**
	 * Membuat instans baru dari Dataloader.
	 */
	constructor() {
		this.#controller = new AbortController();
	}

	/**
	 * Membatalkan proses pemuatan data yang sedang berjalan.
	 */
	abort() {
		this.#controller.abort();
	}

	/**
	 * Membebaskan sumber daya.
	 */
	dispose() {
		
	}

	/**
	 * Memuat data secara asinkron dari URL tertentu.
	 * @param {string} url - URL API/sumber data.
	 * @param {Object} [options] - Opsi request fetch (method, headers, body, dll).
	 * @param {Function} [loadedCallback] - Callback function setelah data selesai dimuat, dengan signature `(err, data)`.
	 * @returns {Promise<any>} Hasil parsing data JSON dari response.
	 * @throws {Error} Mengeluarkan error jika pemuatan gagal dan tidak ada loadedCallback yang diberikan.
	 */
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