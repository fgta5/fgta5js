import AppGenUI from './appgen-ui.mjs'

const app = new $fgta5.Application(window.APPLICATION_NAME)
const ui = new AppGenUI(app)
const SectionCarousell = $fgta5.SectionCarousell
const Section = $fgta5.Section



const ID_TEMPLATE = 'TEMPLATE'

const SECTION_MODULELIST = 'appgen-list'
const SECTION_DATADESIGN = 'appgen-datadesign'
const SECTION_UIDESIGN = 'appgen-uidesign'

const ATTR_HIDDEN = 'hidden'

const mod = {} // menampung variabel2 module yang akan di share 


export default class AppGen  {
	async main(args) {
		app.SetTitle("Generator")


		// ambil semua file-file yang diperlukan
		await ui.FetchAll({
			tpl: document.getElementById(ID_TEMPLATE)
		})

		await AppGen_main(this, args)
	}
}



async function AppGen_main(self, args) {
	mod.btnnewall = AppGen_setupButtonNew(self)
	mod.scar = AppGen_setupSectionCarousell(self)
	
}


function AppGen_setupSectionCarousell(self) {
	// siapkan section carousel
	const scar = new SectionCarousell(app.Nodes.Main)

	scar.Items[SECTION_DATADESIGN].addEventListener(Section.EVT_BACKBUTTONCLICK, async (evt)=>{
		evt.detail.fn_ShowNextSection()
	})

	scar.Items[SECTION_UIDESIGN].addEventListener(Section.EVT_BACKBUTTONCLICK, async (evt)=>{
		evt.detail.fn_ShowNextSection()
	})

	scar.addEventListener(SectionCarousell.EVT_SECTIONSHOWING, (evt)=>{
		mod.btnnewall.forEach(el => {
			el.classList.add(ATTR_HIDDEN)
		});
		setTimeout(()=>{
			mod.btnnewall.forEach(el => {
				el.classList.remove(ATTR_HIDDEN)
				el.style.animation = 'dropped 0.3s forwards'
				setTimeout(()=>{
					el.style.animation = 'unset'	
				}, 300)
			});
		}, 500)
	})

	return scar
}

function AppGen_setupButtonNew(self) {
	const btnnewall = app.Nodes.Main.querySelectorAll('.generator-button-new')
	btnnewall.forEach(el => {
		el.addEventListener('click', (evt)=>{
			const section = evt.target.closest('section')
			const sectionname = section.getAttribute('name')
			if (sectionname!=SECTION_DATADESIGN) {
				// tampilkan section 2
				mod.scar.Items[SECTION_DATADESIGN].Show()
			}
		})
	})
	return btnnewall
}
