import ICONS from './Icons.mjs'
import Component from "./Component.mjs"
import Section from './Section.mjs'

const CLS_BUTTONHEAD = 'fgta5-button-head'


const ID_TITLE = 'application-title'
const ATTR_WITHFOOTER = 'data-withfooter'


export default class App extends Component {
	constructor(id) {
		super(id)
		app_construct(this)
	}

	// #sections = {}
	// get Sections() { return this.#sections}
	// RenderSection() {
		// App_RenderSection(this)
	// }
	setTitle(title) {
		app_setTitle(this, title)
	}


	showFooter(show) {
		app_showFooter(this, show)
	}
}

function app_construct(self) {
	console.log('constructiong application')

	const main = self.Element  
	const head = document.createElement('header')
	const footer = document.createElement('footer')

	main.after(head)
	head.after(footer)

	head.classList.add('fgta5-app-head')

	main.classList.add('fgta5-app-main')

	footer.classList.add('fgta5-app-footer')
	footer.classList.add('hidden')

	app_createHeader(self, head)
	app_createFooter(self, footer)

	self.Nodes = {
		Head: head,
		Main: main,
		Footer: footer
	}

	window.addEventListener("load", (event) => {
		console.log('application loaded.')
		window.parent.postMessage({
			action: Component.ACTION_APPLICATIONLOADED
		}, '*')

	})

	window.addEventListener("message", (evt) => {
		const args = evt.data
		if (args.action!=undefined) {
			var action = args.action
			if (action==Component.ACTION_APPLICATIONLOADED) {
				if (args.module!=null) {
					if (args.module.title!=null) {
						app_setTitle(self, args.module.title)
					}
				}
				
			}
		}
	})
}

function app_setTitle(self, title) {
	document.title = title
	document.getElementById(ID_TITLE).innerHTML =  title
}

function app_createHeader(self, head) {
	const divleft = document.createElement('div')
	const title = document.createElement('span')

	const btnmenu = Component.createSvgButton(ICONS.MENU, CLS_BUTTONHEAD, ()=>{
		app_showMenu(self)
	})

	const btnhome = Component.createSvgButton(ICONS.HOME, CLS_BUTTONHEAD, ()=>{
		app_showHome(self)
	})

	divleft.appendChild(btnhome)

	title.id = ID_TITLE
	title.innerHTML = 'loading ...'

	head.appendChild(divleft)
	head.appendChild(title)
	head.appendChild(btnmenu)
}

function app_createFooter(self, footer) {
	footer.innerHTML = 'empty footer content'
}


function app_showFooter(self, show) {
	const main = self.Nodes.Main
	const footer = self.Nodes.Footer
	if (show) {
		main.setAttribute(ATTR_WITHFOOTER, '')
		footer.classList.remove('hidden')
	} else {
		main.removeAttribute(ATTR_WITHFOOTER)
		footer.classList.add('hidden')
	}
}

function app_showMenu(self) {
	window.parent.postMessage({
		action: Component.ACTION_SHOWMENU
	}, '*')
}

function app_showHome(self) {
	window.parent.postMessage({
		action: Component.ACTION_SHOWHOME
	}, '*')	
}

