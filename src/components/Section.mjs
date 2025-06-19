const CLS_HIDDEN = 'hidden'
const CLS_SECTION = 'fgta5-app-section'

const ATTR_ACTIVE = 'data-active'


const DIR_LEFT = 0
const DIR_RIGHT = 1


export default class Section {
	#element
	#index
	#name
	#previoussection
	#fn_getActiveSection

	static get ATTR_ACTIVE() { return ATTR_ACTIVE }
	static get DIR_LEFT() { return DIR_LEFT }
	static get DIR_RIGHT() { return DIR_RIGHT }


	get Index() { return this.#index }
	get Name() { return this.#name }
	get Element() { return this.#element }
	get PreviousSection() { return this.#previoussection}
	get getActiveSection() { return this.#fn_getActiveSection }


	constructor(el, args) {
		const name = el.getAttribute('name')

		this.#element = el
		this.#name = name

		if (args!=null) {
			if (args.index!=null) {
				this.#index = args.index
			}

			if (typeof args.fn_getActiveSection === 'function') {
				this.#fn_getActiveSection = args.fn_getActiveSection
			} else {
				this.#fn_getActiveSection = ()=>{return null}
			}
		}

		SectionConstruct(this, args)



	}


	async Show(args, fn_callback) {
		const currSection = this.getActiveSection()
		this.#previoussection = currSection // set current session ke previous untuk keperluan back
		await Section_Show(this, args, fn_callback)
	}
}

function SectionConstruct(self, args) {
	const el = self.Element
	
	el.classList.add(CLS_SECTION)
	if (self.Index==0) {
		// jadikan index section pertama yang active
		el.setAttribute(ATTR_ACTIVE, '')
	} else {
		// sembunyikan semua section berikutnya
		el.classList.add(CLS_HIDDEN)
	}


}


async function Section_Show(self, args, fn_callback) {
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