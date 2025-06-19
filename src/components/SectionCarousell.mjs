import Section from './Section.mjs'



export default class SectionCarousell {

	constructor(el) {
		SectionCarousell_Construct(this, el)
	}

	#items = {}
	get Items() { return this.#items}
}

function SectionCarousell_Construct(self, el) {

	el.classList.add('fgta5-sectioncarousell')

	// ambil semua section yang terdapat di element
	const nodes = el.querySelectorAll('section[name]') 
	let i = 0;
	for (let node of nodes) {
		const section = new Section(node, {
			index: i,
			fn_getActiveSection: ()=>{
				return SectionCarousell_getActiveSection(self, el)
			}
		})
		const name = section.Name

		// masukkan panel ini ke items
		self.Items[name] = section
		++i
	}
}


function SectionCarousell_getActiveSection(self, el) {
	// ambil section yang sedang aktif yang ada di el
	const cs = el.querySelector(`section[${Section.ATTR_ACTIVE}]`)

	// name dari section yang aktif
	const name = cs.getAttribute('name')

	// kembalikan object section yang saat ini aktif
	return self.Items[name]
}