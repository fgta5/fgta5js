const appname = 'appgenerator'
const app = new $fgta5.Application(appname)

const EVT_CLICK = 'click'

const obj = {}
const btn = {}

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
	footer.innerHTML = ''
	footer.appendChild(footerButton)

	const crs = new $fgta5.SectionCarousell(app.Nodes.Main)
	// app.RenderSection(new $fgta5.SectionCarousell(appname))

}

async function main(self, args) {
	render_template(self)


	btn.section1 = new $fgta5.Button('btn_section1')
	btn.section2 = new $fgta5.Button('btn_section2')
	btn.section3 = new $fgta5.Button('btn_section3')

	btn.section1.addEventListener(EVT_CLICK, (evt)=>{
		app.Sections['section1'].Show()
	})

	btn.section2.addEventListener(EVT_CLICK, (evt)=>{
		app.Sections['section2'].Show()
	})
	
	btn.section3.addEventListener(EVT_CLICK, (evt)=>{
		app.Sections['section3'].Show()
	})


	app.ShowFooter(true)
}

async function btn_new_click(self, evt) {
}

async function btn_save_click(self, evt) {
	console.log('save')
}

async function btn_delete_click(self, evt) {
}