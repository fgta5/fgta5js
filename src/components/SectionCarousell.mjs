import Section from './Section.mjs'

const EVT_SECTIONSHOWING = 'sectionshowing'

const SectionShowingEvent = (data) => { return new CustomEvent(EVT_SECTIONSHOWING, data) }


export default class SectionCarousell {
	#items = {}
	#listener = new EventTarget()
	#currentsection 

	static get EVT_SECTIONSHOWING() { return EVT_SECTIONSHOWING }

	constructor(el) {
		scar_Construct(this, el)
	}

	get Items() { return this.#items}
	get Listener() { return this.#listener }
	get CurrentSection() { return this.#currentsection }

	addEventListener(eventname, callback) {
		this.Listener.addEventListener(eventname, callback)
	}	

	setCurrentSection(section) {
		this.#currentsection = section
	}

	dispatchSectionShowing(currSection, commingSection) {
		this.Listener.dispatchEvent(SectionShowingEvent({
			currSection: currSection,
			commingSection: commingSection
		}))
	}
}

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

		if (self.CurrentSection==null) {
			self.setCurrentSection(section)
		}

		// masukkan panel ini ke items
		self.Items[name] = section
		++i
	}
}


function scar_getActiveSection(self, el) {
	// ambil section yang sedang aktif yang ada di el
	const cs = el.querySelector(`section[${Section.ATTR_ACTIVE}]`)

	// name dari section yang aktif
	const name = cs.getAttribute('name')

	// kembalikan object section yang saat ini aktif
	return self.Items[name]
}