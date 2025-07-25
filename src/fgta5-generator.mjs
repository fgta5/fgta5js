import UIGenerator from "./fgta5-generator-ui.mjs"

const appname = 'appgenerator'
const app = new $fgta5.Application(appname)
const SectionCarousell = $fgta5.SectionCarousell
const Section = $fgta5.Section

const EVT_CLICK = 'click'

const mod = {} // menampung variabel2 module yang akan di share 
const obj = {} // menampung object2 form


// untuk menampung semua button
const btn = {} 

const SECTION_MODULELIST = 'modulelist'
const SECTION_DATADESIGN = 'datadesign'
const SECTION_UIDESIGN = 'uidesign'

const ATTR_HIDDEN = 'hidden'

export default class AppGenerator  {
	async main(args) {
		await main(this, args)
	}
}


function render_template(self) {
	const tpl = document.querySelector('template')
	const clone = tpl.content.cloneNode(true); // salin isi template
	
	// remder footer
	const footer = app.Nodes.Footer
	const footerButton = clone.querySelector('#footer-button');
	const btnnewall = app.Nodes.Main.querySelectorAll('.generator-button-new')

	footer.innerHTML = '' // reset content footer
	footer.appendChild(footerButton)

	// siapkan section carousel
	mod.scar = new SectionCarousell(app.Nodes.Main)
	
	mod.scar.Items[SECTION_DATADESIGN].addEventListener(Section.EVT_BACKBUTTONCLICK, async (evt)=>{
		evt.detail.fn_ShowNextSection()
	})

	mod.scar.Items[SECTION_UIDESIGN].addEventListener(Section.EVT_BACKBUTTONCLICK, async (evt)=>{
		evt.detail.fn_ShowNextSection()
	})

	mod.scar.addEventListener(SectionCarousell.EVT_SECTIONSHOWING, (evt)=>{
		btnnewall.forEach(el => {
			el.classList.add(ATTR_HIDDEN)
		});
		setTimeout(()=>{
			btnnewall.forEach(el => {
				el.classList.remove(ATTR_HIDDEN)
				el.style.animation = 'dropped 0.3s forwards'
				setTimeout(()=>{
					el.style.animation = 'unset'	
				}, 300)
			});
		}, 500)
	})


	// setup button new
	btnnewall.forEach(el => {
		el.addEventListener('click', (evt)=>{
			AppGenerator_NewData(self, evt)
		})
	})
}

async function main(self, args) {
	render_template(self)


	btn.section1 = new $fgta5.Button('btn_section1')
	btn.section2 = new $fgta5.Button('btn_section2')
	btn.section3 = new $fgta5.Button('btn_section3')

	btn.section1.addEventListener(EVT_CLICK, (evt)=>{
		mod.scar.Items[SECTION_MODULELIST].show({direction:$fgta5.Section.DIR_RIGHT})
	})

	btn.section2.addEventListener(EVT_CLICK, (evt)=>{
		mod.scar.Items[SECTION_DATADESIGN].show()
	})
	
	btn.section3.addEventListener(EVT_CLICK, (evt)=>{
		mod.scar.Items[SECTION_UIDESIGN].show()
	})


	app.showFooter(true)

	const ui = new UIGenerator()
	ui.init()
}


function AppGenerator_NewData(self, evt) {
	// caro section dari tombol ini
	const section = evt.target.closest('section')
	const sectionname = section.getAttribute('name')
	if (sectionname!=SECTION_DATADESIGN) {
		// tampilkan section 2
		mod.scar.Items[SECTION_DATADESIGN].show()
	}
}
