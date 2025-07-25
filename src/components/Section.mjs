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


export default class Section {
	#id
	#element
	#index
	#name
	#title
	#previoussection
	#carousell
	#fn_getActiveSection
	#listener = new EventTarget()

	static get ATTR_ACTIVE() { return ATTR_ACTIVE }
	static get DIR_LEFT() { return DIR_LEFT }
	static get DIR_RIGHT() { return DIR_RIGHT }
	static get EVT_BACKBUTTONCLICK() { return EVT_BACKBUTTONCLICK }
	static get EVT_SECTIONSHOWING() { return EVT_SECTIONSHOWING }


	get Id() { return this.#id } 
	get Index() { return this.#index }
	get Name() { return this.#name }
	get Title()  { return this.#title }
	get Element() { return this.#element }
	get PreviousSection() { return this.#previoussection}
	get getActiveSection() { return this.#fn_getActiveSection }
	get Listener() { return this.#listener }
	get Carousell() { return this.#carousell } 

	set Title(v) {
		this.#title = v
		sec_setTitle(this, v)
	}


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




	async show(args, fn_callback) {
		const currSection = this.getActiveSection()
		this.#previoussection = currSection // set current session ke previous untuk keperluan back
		await sec_show(this, args, fn_callback)
	}

	addEventListener(eventname, callback) {
		this.Listener.addEventListener(eventname, callback)
	}	
}



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


	topbar.setAttribute(ATTR_TOPBAR, '')
	topbar.appendChild(backbutton)
	topbar.appendChild(title)
	

	backbutton.setAttribute(ATTR_BACKBUTTON, '')
	if (self.Index==0) {
		backbutton.classList.add('hidden')
	}

	title.setAttribute(ATTR_TITLE, self.Title)
	title.innerHTML = self.Title


	
	el.prepend(topbar)

	self.Nodes = {
		BackButton: backbutton,
		Title: title
	}

}


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
				currSection: currSection,
				commingSection: commingSection
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


function sec_backButtonClick(self) {
	// back to self.PreviousSection
	self.Listener.dispatchEvent(BackButtonClickEvent({
		cancelable: true,
		detail: {
			fn_ShowNextSection: ()=>{
				self.PreviousSection.show({direction:DIR_RIGHT})
			}
		}
	}))
}


function sec_setTitle(self, v) {
	self.Nodes.Title.innerHTML = v
}