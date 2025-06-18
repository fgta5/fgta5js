const CLS_HIDDEN = 'hidden'
const CLS_SECTION = 'fgta5-app-section'

const ATTR_ACTIVE = 'data-active'


export default class Section {
	#element
	#index
	#name
	#previoussection
	#fn_getActiveSection

	static get ATTR_ACTIVE() { return ATTR_ACTIVE }


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

	get Index() { return this.#index }
	get Name() { return this.#name }
	get Element() { return this.#element }
	get PreviousSection() { return this.#previoussection}
	get getActiveSection() { return this.#fn_getActiveSection }

	async Show(args, fn_callback) {
		const currSection = self.getActiveSection()
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


async function Secion_Back() {

}

async function Section_Show(self, args, fn_callback) {
	if (typeof fn_callback==='function') {
		await fn_callback()
	}
	
	let animation
	const commingSection = self
	const comming = commingSection.Element
	const currSection = self.PreviousSection()
	if (currSection!=null) {
		if (commingSection.Name==currSection.Name) {
			return
		}

		self.SetPreviousSection


		if (commingSection.Index>currSection.Index) {
			// arah ke kiri
			// taruh comming di sebelah kanan
			comming.classList.add('taruh-kanan')
			animation = 'geserKiri'
		} else {
			// arah ke kanan
			comming.classList.add('taruh-kiri')
			animation = 'geserKanan'
		}
		
		console.log(animation)
	
		// sembunyikan current section
		const curr = currSection.Element
		curr.style.animation = `${animation} 1s forwards`
		comming.style.animation = `${animation} 1s forwards`
		setTimeout(()=>{
			curr.classList.add(CLS_HIDDEN)
			curr.removeAttribute(ATTR_ACTIVE)
			curr.style.animation = ''
			

			comming.setAttribute(ATTR_ACTIVE, '')
			comming.classList.remove(CLS_HIDDEN)
			comming.style.animation = `${animation} 1sec forwards`
			setTimeout(()=>{
				comming.style.animation = ''
			}, 1000)
		}, 1000)
		
	} else {
		// langsung munculkan tanpa animasi
		comming.classList.remove(CLS_HIDDEN)
		comming.setAttribute(ATTR_ACTIVE, '')
	}

	
	
	
}