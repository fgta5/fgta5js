import ICONS from './Icons.mjs'
import Component from "./Component.mjs"

const CLS_HIDDEN = 'hidden'
const CLS_SECTION = 'fgta5-app-section'


const ATTR_ACTIVE = 'data-active'
const ATTR_TITLE = 'data-title'
const ATTR_TOPBAR = 'data-topbar'
const ATTR_BACKBUTTON = 'data-backbutton'

const DIR_LEFT = 0
const DIR_RIGHT = 1

const EVT_BACKBUTTONCLICK = 'backbuttonclick'
const EVT_SECTIONSHOWING = 'sectionshowing'

const BackButtonClickEvent = (data) => { return new CustomEvent(EVT_BACKBUTTONCLICK, data) }
const SectionShowingEvent = (data) => { return new CustomEvent(EVT_SECTIONSHOWING, data) }


/**
 * Komponen Section untuk merender dan mengelola satu halaman/bagian (section) di dalam aplikasi.
 * Mendukung navigasi transisi geser (kiri/kanan), judul halaman, ikon, dan tombol kembali (back).
 */
export default class Section {
	/**
	 * ID unik dari section.
	 * @type {string}
	 * @private
	 */
	#id

	/**
	 * Elemen HTML dari section.
	 * @type {HTMLElement}
	 * @private
	 */
	#element

	/**
	 * Indeks urutan pemuatan section.
	 * @type {number}
	 * @private
	 */
	#index

	/**
	 * Nama section.
	 * @type {string}
	 * @private
	 */
	#name

	/**
	 * Judul dari section.
	 * @type {string}
	 * @private
	 */
	#title

	/**
	 * Section sebelumnya untuk keperluan navigasi back.
	 * @type {Section|null}
	 * @private
	 */
	#previoussection

	/**
	 * Instans SectionCarousell pembungkus yang menampung section ini.
	 * @type {SectionCarousell}
	 * @private
	 */
	#carousell

	/**
	 * Fungsi pembantu untuk mendapatkan section yang aktif saat ini.
	 * @type {Function}
	 * @private
	 */
	#fn_getActiveSection

	/**
	 * Target event kustom untuk Section.
	 * @type {EventTarget}
	 * @private
	 */
	#listener = new EventTarget()

	/**
	 * Nama atribut HTML untuk menandai section aktif.
	 * @type {string}
	 */
	static get ATTR_ACTIVE() { return ATTR_ACTIVE }

	/**
	 * Konstanta arah geser ke kiri (masuk data baru).
	 * @type {number}
	 */
	static get DIR_LEFT() { return DIR_LEFT }

	/**
	 * Konstanta arah geser ke kanan (navigasi kembali).
	 * @type {number}
	 */
	static get DIR_RIGHT() { return DIR_RIGHT }

	/**
	 * Nama event saat tombol kembali (back) diklik.
	 * @type {string}
	 */
	static get EVT_BACKBUTTONCLICK() { return EVT_BACKBUTTONCLICK }

	/**
	 * Nama event saat section mulai ditampilkan.
	 * @type {string}
	 */
	static get EVT_SECTIONSHOWING() { return EVT_SECTIONSHOWING }


	/**
	 * Mendapatkan ID section.
	 * @returns {string}
	 */
	get Id() { return this.#id } 

	/**
	 * Mendapatkan indeks section.
	 * @returns {number}
	 */
	get Index() { return this.#index }

	/**
	 * Mendapatkan nama section.
	 * @returns {string}
	 */
	get Name() { return this.#name }

	/**
	 * Mendapatkan judul section.
	 * @returns {string}
	 */
	get Title()  { return this.#title }

	/**
	 * Mendapatkan elemen HTML section.
	 * @returns {HTMLElement}
	 */
	get Element() { return this.#element }

	/**
	 * Mendapatkan section sebelumnya.
	 * @returns {Section|null}
	 */
	get PreviousSection() { return this.#previoussection}

	/**
	 * Mendapatkan fungsi pemanggil section aktif.
	 * @returns {Function}
	 */
	get getActiveSection() { return this.#fn_getActiveSection }

	/**
	 * Mendapatkan EventTarget listener.
	 * @returns {EventTarget}
	 */
	get Listener() { return this.#listener }

	/**
	 * Mendapatkan instans SectionCarousell pembungkus.
	 * @returns {SectionCarousell}
	 */
	get Carousell() { return this.#carousell } 

	/**
	 * Mengeset judul baru untuk section dan meng-update header DOM.
	 * @param {string} v - Judul baru.
	 */
	set Title(v) {
		this.#title = v
		sec_setTitle(this, v)
	}


	/**
	 * Membuat instans baru dari Section.
	 * @param {HTMLElement} el - Elemen HTML section.
	 * @param {Object} args - Parameter inisialisasi section.
	 * @param {number} args.index - Indeks section.
	 * @param {SectionCarousell} args.carousell - Instans SectionCarousell.
	 * @param {Function} args.fn_getActiveSection - Callback untuk mendapat section yang aktif.
	 */
	constructor(el, args) {
		const id = el.id
		const name = id
		const title = el.getAttribute(ATTR_TITLE)

		this.#element = el
		this.#id = id
		this.#name = name
		this.#title = title ?? 'section'
		
		if (args!=null) {
			if (args.index!=null) {
				this.#index = args.index
			}

			this.#carousell = args.carousell

			if (typeof args.fn_getActiveSection === 'function') {
				this.#fn_getActiveSection = args.fn_getActiveSection
			} else {
				this.#fn_getActiveSection = ()=>{return null}
			}
		}
		sec_construct(this, args) 
	}




	/**
	 * Menampilkan section ini dengan transisi animasi geser secara asinkron.
	 * @param {Object} [args] - Argumen transisi (misal: direction).
	 * @param {Function} [fn_callback] - Callback yang dipanggil sesaat sebelum transisi.
	 */
	async show(args, fn_callback) {
		const currSection = this.getActiveSection()
		this.#previoussection = currSection // set current session ke previous untuk keperluan back
		await sec_show(this, args, fn_callback)
	}


	/**
	 * Section kustom tujuan ketika melakukan navigasi kembali.
	 * @type {Section|null}
	 */
	sectionReturn

	/**
	 * Menetapkan section tertentu sebagai tujuan navigasi kembali.
	 * @param {Section|null} section - Section tujuan.
	 */
	setSectionReturn(section) {
		this.sectionReturn = section
	}

	/**
	 * Mengatur ikon visual pada header section.
	 * @param {string|null} iconUrl - URL gambar ikon, atau null untuk menggunakan ikon program default.
	 */
	setIconUrl(iconUrl) {
		sec_setIconUrl(this, iconUrl)
	}

	/**
	 * Menambahkan listener event.
	 * @param {string} eventname - Nama event.
	 * @param {Function} callback - Callback function.
	 */
	addEventListener(eventname, callback) {
		this.Listener.addEventListener(eventname, callback)
	}	

	/**
	 * Melakukan navigasi kembali ke section return secara terprogram.
	 */
	back() {
		if (this.sectionReturn!=null) {
			this.sectionReturn.show({direction:1})
		}
	}
}


/**
 * Mengeset gambar ikon atau ikon program default pada panel header section.
 * @param {Section} self - Instans Section.
 * @param {string|null} iconUrl - URL gambar ikon.
 * @private
 */
function sec_setIconUrl(self, iconUrl) {
	const iconDiv = self.Nodes.iconDiv
	iconDiv.style.display = 'unset'
	if (iconUrl==null || iconUrl=='') {
		iconDiv.innerHTML = ICONS.PROGRAM
	} else {
		iconDiv.style.backgroundImage = `url('${iconUrl}')`;
		iconDiv.style.backgroundSize = "cover";
		iconDiv.style.backgroundRepeat = "no-repeat";
		iconDiv.style.backgroundPosition = "center";

	}
}

/**
 * Fungsi pembantu inisialisasi elemen HTML section, menambahkan topbar header, judul, dan tombol back.
 * @param {Section} self - Instans Section.
 * @param {Object} args - Parameter inisialisasi.
 * @private
 */
function sec_construct(self, args) {
	const el = self.Element
	
	el.setAttribute('name', self.Name)
	el.classList.add(CLS_SECTION)
	if (self.Index==0) {
		// jadikan index section pertama yang active
		el.setAttribute(ATTR_ACTIVE, '')
	} else {
		// sembunyikan semua section berikutnya
		el.classList.add(CLS_HIDDEN)
	}


	// set title
	const topbar = document.createElement('div')
	const title = document.createElement('div')
	const backbutton = Component.createSvgButton(ICONS.BACK, '', ()=>{
		// back ke previous section
		sec_backButtonClick(self)
	})
	const iconDiv = document.createElement('div')
	


	topbar.setAttribute(ATTR_TOPBAR, '')
	topbar.appendChild(backbutton)
	topbar.appendChild(iconDiv)
	topbar.appendChild(title)
	

	backbutton.setAttribute(ATTR_BACKBUTTON, '')
	if (self.Index==0) {
		backbutton.classList.add('hidden')
	}


	iconDiv.classList.add('fgta5-app-section-icondiv')
	iconDiv.style.display = 'none'



	title.setAttribute(ATTR_TITLE, self.Title)
	title.innerHTML = self.Title


	
	el.prepend(topbar)

	self.Nodes = {
		BackButton: backbutton,
		Title: title,
		iconDiv: iconDiv
	}

}


/**
 * Menampilkan section tujuan dengan transisi efek animasi slide geser (internal helper).
 * @param {Section} self - Instans Section.
 * @param {Object} args - Argumen opsi transisi.
 * @param {Function} [fn_callback] - Callback prapemrosesan.
 * @private
 */
async function sec_show(self, args, fn_callback) {
	if (typeof fn_callback==='function') {
		await fn_callback()
	}

	let direction = DIR_LEFT // Geser ke kiri
	if (args!=undefined) {
		direction = args.direction ?? DIR_LEFT
	}

	let moving = [
		{curr:'fadeOutLeft 0.1s forwards', comming:'fadeInRight 0.3s forwards'}, // geser kiri
		{curr:'fadeOutRight 0.1s forwards', comming:'fadeInLeft 0.3s forwards'} // geser kanan
	]
	

	const commingSection = self
	const comming = commingSection.Element
	const currSection = self.PreviousSection
	if (currSection!=null) {
		if (commingSection.Name==currSection.Name) {
			return
		}

		// CATATAN:
		// untuk showing section, selalu arah akan ke kiri (arah kanan digunakan saat back)
		// curr: fadeOutLeft // yang saat ini muncul, buang ke kiri
		// comming: fadeInRight // yang baru akan muncul dari kanan

		const curr = currSection.Element


		// trigger event showing
		self.Carousell.setCurrentSection(commingSection)
		self.Carousell.dispatchSectionShowing(currSection, commingSection)
		self.Listener.dispatchEvent(SectionShowingEvent({
			data: {
				// currSection: currSection,
				// commingSection: commingSection,
				detail: {
					currSection: currSection,
					commingSection: commingSection,
				}
			}
		}))
		

		// taruh dulu yang akan data ke kanan, posisi hiden
		comming.style.animation = 'unset'

		// lalu keluarkan curr, buang ke kiri (fadeOutLeft)
		curr.style.animation = moving[direction].curr // `fadeOutLeft 0.3s forwards` 
		setTimeout(()=>{
			curr.classList.add(CLS_HIDDEN) // sembunyikan current
			curr.style.animation = 'unset'
			curr.removeAttribute(ATTR_ACTIVE)

			// tarik comming masuk dari kanan
			comming.classList.remove(CLS_HIDDEN)
			comming.style.animation = moving[direction].comming //  'fadeInRight 0.3s forwards' 
			setTimeout(()=>{
				comming.style.animation = 'unset'
				comming.setAttribute(ATTR_ACTIVE, '')
			}, 300)
		}, 100)		


	} else {
		// langsung munculkan tanpa animasi
		comming.classList.remove(CLS_HIDDEN)
		comming.setAttribute(ATTR_ACTIVE, '')
	}
	
}


/**
 * Handler internal ketika tombol kembali diklik (mengirimkan event backbuttonclick).
 * @param {Section} self - Instans Section.
 * @private
 */
function sec_backButtonClick(self) {
	// back to self.PreviousSection
	self.Listener.dispatchEvent(BackButtonClickEvent({
		cancelable: true,
		detail: {
			fn_ShowNextSection: ()=>{
				if (self.sectionReturn!=null) {
					self.sectionReturn.show({direction:DIR_RIGHT})
				} else {
					self.PreviousSection.show({direction:DIR_RIGHT})
				}
			}
		}
	}))
}


/**
 * Mengubah teks judul di panel header DOM section.
 * @param {Section} self - Instans Section.
 * @param {string} v - Judul baru.
 * @private
 */
function sec_setTitle(self, v) {
	self.Nodes.Title.innerHTML = v
}