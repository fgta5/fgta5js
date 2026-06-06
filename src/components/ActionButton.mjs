
/* HTML Attribute
=================
- data-action : Nama aksi (action name) untuk mengelompokkan beberapa tombol agar dapat dikontrol bersamaan oleh satu instance ActionButton.
*/

/**
 * Komponen ActionButton untuk mengontrol satu atau sekelompok tombol aksi (HTML Button) secara terpadu.
 */
export default class ActionButton {

	#ids = []
	#elements = []
	#atributes = []

	/**
	 * Membuat instans baru dari ActionButton.
	 * @param {string|null} id - ID elemen HTML tombol utama.
	 * @param {string|null} [actionname=null] - Nama aksi (value data-action) untuk mencari elemen tombol lain dengan aksi yang sama.
	 */
	constructor(id, actionname = null) {
		/**
		 * Target event kustom untuk ActionButton.
		 * @type {EventTarget}
		 */
		this.Listener = new EventTarget()


		// pertama ambil element dengan id. 
		// Jika ada element pertama akan berisi element dengan id tersebut
		// berukutnya akan dicari element dengan data-action
		if (id != null) {
			const el = document.getElementById(id)
			if (el != null) {
				this.#elements.push(el)
			}
		}

		if (actionname != null) {
			const selector = (id == null) ? `[data-action="${actionname}"]` : `[data-action="${actionname}"]:not(#${id})`
			const elements = document.querySelectorAll(selector)
			this.#elements = [...this.#elements, ...Array.from(elements)]
		}


		// setup button yang diasosiasikan untuk action ini		
		this.#elements.forEach(element => {

			// id
			const id = element.id
			this.#ids.push(id)

			// disable tab
			element.setAttribute('tabindex', '-1')

			// handle default event click, yang berfungsi untuk mengamabkan tombol saat disable / hidden
			element.addEventListener('click', (evt) => {
				if (this.#disabled || this.#hidden) {
					console.warn('action is not allowed!')
					evt.stopImmediatePropagation()
				}
			})
		})
	}


	/**
	 * Mendapatkan daftar elemen HTML tombol yang dikontrol.
	 * @returns {HTMLElement[]}
	 */
	get Elements() {
		return this.#elements
	}

	/**
	 * Status penonaktifan tombol.
	 * @type {boolean}
	 * @private
	 */
	#disabled = false

	/**
	 * Mendapatkan status penonaktifan tombol.
	 * @returns {boolean} True jika dinonaktifkan.
	 */
	get disabled() { return this.#disabled }

	/**
	 * Mengeset status penonaktifan tombol.
	 * @param {boolean} disable - True untuk menonaktifkan, false untuk mengaktifkan.
	 */
	set disabled(disable) {
		if (!disable && this.#suspended) {
			// jika suspended, tombol tidak bisa dinyalakan
			console.warn('suspended action button cannot be enabled!', this.#ids)
			return
		}

		this.#disabled = disable
		this.#elements.forEach(element => {
			if (disable) {
				element.setAttribute('disabled', true)
			} else {
				element.removeAttribute('disabled')
			}
		})

	}

	/**
	 * Status penyembunyian tombol.
	 * @type {boolean}
	 * @private
	 */
	#hidden = false

	/**
	 * Memeriksa apakah tombol sedang disembunyikan.
	 * @returns {boolean} True jika disembunyikan.
	 */
	isHidden() { return this.#hidden }

	/**
	 * Menyembunyikan atau menampilkan tombol.
	 * @param {boolean} [hidden=true] - True jika ingin menyembunyikan, false untuk menampilkan.
	 */
	hide(hidden = true) {
		this.#elements.forEach(element => {
			if (hidden) {
				element.classList.add('hidden')
			} else {
				element.classList.remove('hidden')
			}
		})
	}

	/**
	 * Mengubah teks (innerHTML) seluruh tombol yang dikontrol.
	 * @param {string} text - Teks HTML baru.
	 */
	setText(text) {
		this.#elements.forEach(element => {
			element.innerHTML = text
		})
	}

	/**
	 * Menambahkan event listener ke semua tombol yang dikontrol.
	 * @param {string} event - Nama event (misal: 'click').
	 * @param {Function} callback - Callback function.
	 */
	addEventListener(event, callback) {
		this.#elements.forEach(element => {
			element.addEventListener(event, callback)
		})
	}


	/**
	 * Memicu event klik secara programatik pada tombol utama jika tidak dinonaktifkan.
	 */
	click() {
		if (this.#disabled) {
			return
		}
		this.#elements[0].click()
	}


	/**
	 * Status suspensi (penangguhan sementara) tombol.
	 * @type {boolean}
	 * @private
	 */
	#suspended = false

	/**
	 * Menangguhkan (suspend) atau memulihkan tombol dari penangguhan.
	 * @param {boolean} [doSuspend=true] - True jika ingin menangguhkan, false untuk memulihkan.
	 * @param {boolean} [keepState=false] - Jika true, status `disabled` tombol tidak akan ikut diubah saat ditangguhkan/dipulihkan.
	 */
	suspend(doSuspend = true, keepState = false) {
		this.#suspended = doSuspend
		if (!keepState) {
			if (doSuspend) {
				this.disabled = true
			} else {
				this.disabled = false
			}
		}
	}

	/**
	 * Memeriksa apakah tombol sedang ditangguhkan (suspended).
	 * @returns {boolean}
	 */
	isSuspended() {
		return this.#suspended
	}


	/**
	 * Mengeset nilai atribut HTML pada seluruh elemen tombol yang dikontrol.
	 * @param {string} name - Nama atribut.
	 * @param {string} value - Nilai atribut.
	 */
	setAttribute(name, value) {
		this.#atributes[name] = value
		this.#elements.forEach(element => {
			element.setAttribute(name, value)
		})
	}

	/**
	 * Mendapatkan nilai atribut yang tersimpan.
	 * @param {string} name - Nama atribut.
	 * @returns {string|undefined} Nilai atribut.
	 */
	getAttribute(name) {
		return this.#atributes[name]
	}

	/**
	 * Menghapus atribut HTML dari seluruh elemen tombol yang dikontrol.
	 * @param {string} name - Nama atribut.
	 */
	removeAttribute(name) {
		delete this.#atributes[name]
		this.#elements.forEach(element => {
			element.removeAttribute(name)
		})
	}

}
