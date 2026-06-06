import ICONS from './Icons.mjs'
import Component from "./Component.mjs"

const CLS_BUTTONHEAD = 'fgta5-button-head'


const ID_TITLE = 'application-title'
const ATTR_WITHFOOTER = 'data-withfooter'


/**
 * Komponen utama Aplikasi (App) untuk mengatur layout header, footer, judul halaman, dan komunikasi dengan container induk.
 * @extends Component
 */
export default class App extends Component {
	/**
	 * Membuat instans baru dari App.
	 * @param {string} id - ID elemen HTML utama aplikasi.
	 */
	constructor(id) {
		super(id)
		app_construct(this)
	}

	// #sections = {}
	// get Sections() { return this.#sections}
	// RenderSection() {
	// App_RenderSection(this)
	// }

	/**
	 * Mengatur judul halaman aplikasi dan judul dokumen browser.
	 * @param {string} title - Judul aplikasi.
	 */
	setTitle(title) {
		app_setTitle(this, title)
	}


	/**
	 * Menampilkan atau menyembunyikan bagian footer aplikasi.
	 * @param {boolean} show - True untuk menampilkan footer, false untuk menyembunyikan.
	 */
	showFooter(show) {
		app_showFooter(this, show)
	}


	/**
	 * Mengeset URL gambar ikon tombol menu aplikasi.
	 * @param {string} url - URL ikon menu.
	 */
	setMenuIcon(url) {
		app_setMenuIcon(this, url)
	}

	/**
	 * Memfinalisasi inisialisasi aplikasi dengan mengirimkan event/message pemuatan selesai ke parent container.
	 */
	finalize() {
		console.log('application loaded.')
		window.parent.postMessage({
			action: Component.ACTION_APPLICATIONLOADED
		}, '*')

		if (typeof window.parent.applicationLoaded === 'function') {
			window.parent.applicationLoaded(this);
		}

	}
}


/**
 * Mengatur ikon menu tombol aplikasi menggunakan URL gambar.
 * @param {App} self - Instans App.
 * @param {string} url - URL gambar ikon.
 * @private
 */
function app_setMenuIcon(self, url) {
	const el = document.getElementById('fgta5-appmanager-btn-menu')
	el.innerHTML = ''
	el.style.backgroundImage = `url(${url})`
}

/**
 * Menginisialisasi tata letak header, main content, dan footer, serta mendengarkan pesan dari luar.
 * @param {App} self - Instans App.
 * @private
 */
function app_construct(self) {
	console.log('constructiong application')

	const main = self.Element
	const head = document.createElement('header')
	const footer = document.createElement('footer')

	main.after(head)
	head.after(footer)

	head.classList.add('fgta5-app-head')

	main.classList.add('fgta5-app-main')

	footer.classList.add('fgta5-app-footer')
	footer.classList.add('hidden')

	app_createHeader(self, head)
	app_createFooter(self, footer)

	self.Nodes = {
		Head: head,
		Main: main,
		Footer: footer
	}

	window.addEventListener("message", (evt) => {
		const args = evt.data
		if (args.action != undefined) {
			var action = args.action
			if (action == Component.ACTION_APPLICATIONLOADED) {
				if (args.module != null) {
					if (args.module.title != null) {
						app_setTitle(self, args.module.title)
					}
				}
			} else if (action == 'REDIRECT_TO_LOGIN') {
				console.log('BUAT PROGRAM UNTUK REDIRECT KE LOGIN')
			}
		}
	})
}

/**
 * Mengubah judul pada dokumen dan elemen header aplikasi.
 * @param {App} self - Instans App.
 * @param {string} title - Judul baru.
 * @private
 */
function app_setTitle(self, title) {
	document.title = title
	document.getElementById(ID_TITLE).innerHTML = title
}

/**
 * Membuat elemen header aplikasi beserta tombol navigasi Home dan Menu.
 * @param {App} self - Instans App.
 * @param {HTMLElement} head - Elemen header HTML.
 * @private
 */
function app_createHeader(self, head) {
	const divleft = document.createElement('div')
	const title = document.createElement('span')
	const divright = document.createElement('div')


	const btnhome = Component.createSvgButton(ICONS.HOME, CLS_BUTTONHEAD, () => {
		app_showHome(self)
	})


	const btnmenu = Component.createSvgButton(ICONS.MENU, CLS_BUTTONHEAD, () => {
		app_showMenu(self)
	})



	divleft.appendChild(btnhome)
	divright.appendChild(btnmenu)


	btnmenu.id = 'fgta5-appmanager-btn-menu'
	if (!Component.isInContainer()) {
		// jika tidak di dalam container,  
		// sembunyikan tombol home dan menu
		btnhome.classList.add('hidden')
		btnmenu.classList.add('hidden')
	}


	title.id = ID_TITLE
	title.innerHTML = 'loading ...'

	head.appendChild(divleft)
	head.appendChild(title)
	head.appendChild(divright)
}

/**
 * Membuat struktur awal elemen footer aplikasi.
 * @param {App} self - Instans App.
 * @param {HTMLElement} footer - Elemen footer HTML.
 * @private
 */
function app_createFooter(self, footer) {
	footer.innerHTML = 'empty footer content'
}


/**
 * Menampilkan atau menyembunyikan footer serta mengatur atribut status layout pada elemen utama aplikasi.
 * @param {App} self - Instans App.
 * @param {boolean} show - True jika footer ditampilkan.
 * @private
 */
function app_showFooter(self, show) {
	const main = self.Nodes.Main
	const footer = self.Nodes.Footer
	if (show) {
		main.setAttribute(ATTR_WITHFOOTER, '')
		footer.classList.remove('hidden')
	} else {
		main.removeAttribute(ATTR_WITHFOOTER)
		footer.classList.add('hidden')
	}
}

/**
 * Mengirim pesan ke container induk untuk menampilkan menu navigasi aplikasi.
 * @param {App} self - Instans App.
 * @private
 */
function app_showMenu(self) {
	window.parent.postMessage({
		action: Component.ACTION_SHOWMENU
	}, '*')
}

/**
 * Mengirim pesan ke container induk untuk kembali ke halaman utama (Home).
 * @param {App} self - Instans App.
 * @private
 */
function app_showHome(self) {
	window.parent.postMessage({
		action: Component.ACTION_SHOWHOME
	}, '*')
}

