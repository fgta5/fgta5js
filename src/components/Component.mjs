let counter = 0;


/**
 * Kelas dasar Component untuk semua elemen antarmuka fgta5.
 */
export default class Component {
	/**
	 * ID elemen HTML komponen.
	 * @type {string}
	 */
	Id;

	/**
	 * Elemen HTML dari komponen ini.
	 * @type {HTMLElement}
	 */
	Element;

	/**
	 * Aksi pesan untuk menampilkan menu.
	 * @type {string}
	 */
	static get ACTION_SHOWMENU() { return 'showmenu' }

	/**
	 * Aksi pesan untuk kembali ke home.
	 * @type {string}
	 */
	static get ACTION_SHOWHOME() { return 'showhome' }

	/**
	 * Aksi pesan bahwa aplikasi telah dimuat.
	 * @type {string}
	 */
	static get ACTION_APPLICATIONLOADED() { return 'applicationloaded' }

	/**
	 * Membuat instans baru dari Component.
	 * @param {string} id - ID elemen HTML.
	 */
	constructor(id) {
		if (id == undefined) {
			console.error('id component belum didefinisikan')
		}

		const el = document.getElementById(id)
		if (el == null) {
			console.error(`element dengan id: '${id}' tidak ditemukan di halaman`)
		}

		this.Id = id
		this.Element = el
	}

	/**
	 * Membuat elemen tombol jangkar (anchor) berisi SVG.
	 * @param {string} svg - String HTML tag/content SVG.
	 * @param {string} classname - Kelas CSS untuk tombol.
	 * @param {Function} fn_click - Callback function saat tombol diklik.
	 * @returns {HTMLAnchorElement} Elemen tombol jangkar baru.
	 */
	static createSvgButton(svg, classname, fn_click) {
		return comp_createSvgButton(svg, classname, fn_click)
	}

	/**
	 * Menghasilkan ID unik untuk komponen baru.
	 * @returns {string} ID unik baru.
	 */
	static generateId() {
		return `comp-${++counter}`;
	}

	/**
	 * Menunda eksekusi selama milidetik tertentu.
	 * @param {number} ms - Waktu tunda dalam milidetik.
	 * @returns {Promise<void>} Promise yang diselesaikan setelah waktu tunda.
	 */
	static sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms))
	}


	/**
	 * Memeriksa apakah perangkat yang mengakses adalah perangkat seluler (mobile).
	 * @returns {boolean} True jika perangkat seluler.
	 */
	static isMobileDevice() {
		return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|Opera Mini|IEMobile/i.test(navigator.userAgent);
	}

	/**
	 * Memeriksa apakah halaman web saat ini berada di dalam container iframe.
	 * @returns {boolean} True jika berada di dalam container iframe.
	 */
	static isInContainer() {
		return window.self !== window.top;
	}

}


/**
 * Membuat elemen tombol jangkar dengan tag SVG dan mendaftarkan event handler klik.
 * @param {string} svg - Konten SVG.
 * @param {string} classname - Kelas CSS tombol.
 * @param {Function} fn_click - Handler klik.
 * @returns {HTMLAnchorElement} Elemen tombol baru.
 * @private
 */
function comp_createSvgButton(svg, classname, fn_click) {
	const btn = document.createElement('a')
	btn.innerHTML = svg

	if (classname != '' && classname != null) {
		btn.classList.add(classname)
	}

	btn.setAttribute('tabindex', '-1')
	btn.setAttribute('href', 'javascript:void(0)')

	if (typeof fn_click === 'function') {
		btn.addEventListener('click', (evt) => {
			fn_click(evt)
		})
	}


	return btn
}
