import Section from './Section.mjs'

const EVT_SECTIONSHOWING = 'sectionshowing'

const SectionShowingEvent = (data) => { return new CustomEvent(EVT_SECTIONSHOWING, data) }


/**
 * Kelas SectionCarousell untuk mengelola sekelompok section (halaman) dalam container carousel.
 * Menghubungkan navigasi antar section, menyimpan referensi section aktif, dan meneruskan event transisi.
 */
export default class SectionCarousell {
	/**
	 * Map dari nama section ke instans Section yang terdaftar.
	 * @type {Object<string, Section>}
	 * @private
	 */
	#items = {}

	/**
	 * Target event kustom untuk carousel.
	 * @type {EventTarget}
	 * @private
	 */
	#listener = new EventTarget()

	/**
	 * Section yang saat ini sedang aktif ditampilkan.
	 * @type {Section|null}
	 * @private
	 */
	#currentsection 

	/**
	 * URL gambar ikon default untuk carousel ini.
	 * @type {string|null}
	 * @private
	 */
	#iconUrl

	/**
	 * Instans Section pertama (indeks 0).
	 * @type {Section|null}
	 * @private
	 */
	#firstSection

	/**
	 * Nama event ketika transisi perpindahan section dimulai.
	 * @type {string}
	 */
	static get EVT_SECTIONSHOWING() { return EVT_SECTIONSHOWING }

	/**
	 * Membuat instans baru dari SectionCarousell.
	 * @param {HTMLElement} el - Elemen HTML container carousel.
	 */
	constructor(el) {
		scar_Construct(this, el)
	}

	/**
	 * Mendapatkan daftar map section.
	 * @returns {Object<string, Section>}
	 */
	get Items() { return this.#items}

	/**
	 * Mendapatkan EventTarget listener.
	 * @returns {EventTarget}
	 */
	get Listener() { return this.#listener }

	/**
	 * Mendapatkan section yang aktif saat ini.
	 * @returns {Section|null}
	 */
	get CurrentSection() { return this.#currentsection }

	/**
	 * Mendapatkan URL ikon.
	 * @returns {string|null}
	 */
	get IconUrl() { return this.#iconUrl }

	/**
	 * Menambahkan listener event.
	 * @param {string} eventname - Nama event.
	 * @param {Function} callback - Callback function.
	 */
	addEventListener(eventname, callback) {
		this.Listener.addEventListener(eventname, callback)
	}	

	/**
	 * Menetapkan section tertentu sebagai yang aktif saat ini.
	 * @param {Section} section - Instans Section.
	 */
	setCurrentSection(section) {
		this.#currentsection = section
	}


	/**
	 * Menetapkan section pertama.
	 * @param {Section} section - Instans Section.
	 */
	setFirstSection(section) {
		this.#firstSection = section
	}

	/**
	 * Mengeset URL ikon untuk carousel dan meneruskannya ke section pertama.
	 * @param {string} iconUrl - URL gambar ikon.
	 */
	setIconUrl(iconUrl) {
		this.#iconUrl = iconUrl
		this.#firstSection.setIconUrl(iconUrl)
	}

	/**
	 * Memicu event sectionshowing untuk carousel.
	 * @param {Section} currSection - Section saat ini.
	 * @param {Section} commingSection - Section baru yang akan datang.
	 */
	dispatchSectionShowing(currSection, commingSection) {
		this.Listener.dispatchEvent(SectionShowingEvent({
			// currSection: currSection,
			// commingSection: commingSection,
			detail: {
				currSection: currSection,
				commingSection: commingSection,
			}
		}))
	}
}

/**
 * Fungsi pembantu inisialisasi container carousel dan mendeteksi/memetakan semua elemen `<section>` di dalamnya.
 * @param {SectionCarousell} self - Instans SectionCarousell.
 * @param {HTMLElement} el - Elemen HTML container.
 * @private
 */
function scar_Construct(self, el) {

	el.classList.add('fgta5-carousellcontainer')

	// ambil semua section yang terdapat di element
	const nodes = el.querySelectorAll('section[class="fgta5-carousell"]') 
	let i = 0;
	for (let node of nodes) {
		const section = new Section(node, {
			index: i,
			carousell: self,
			fn_getActiveSection: ()=>{
				return scar_getActiveSection(self, el)
			}
		})
		const name = section.Name
		
		if (i==0) {
			// set first section
			self.setFirstSection(section)
		}

		if (self.CurrentSection==null) {
			self.setCurrentSection(section)
		}

		// masukkan panel ini ke items
		self.Items[name] = section
		++i
	}
}


/**
 * Mengambil objek Section yang saat ini sedang aktif di dalam container carousel (internal helper).
 * @param {SectionCarousell} self - Instans SectionCarousell.
 * @param {HTMLElement} el - Elemen HTML container.
 * @returns {Section} Instans Section yang sedang aktif.
 * @private
 */
function scar_getActiveSection(self, el) {
	// ambil section yang sedang aktif yang ada di el
	const cs = el.querySelector(`section[${Section.ATTR_ACTIVE}]`)

	// name dari section yang aktif
	const name = cs.getAttribute('name')

	// kembalikan object section yang saat ini aktif
	return self.Items[name]
}