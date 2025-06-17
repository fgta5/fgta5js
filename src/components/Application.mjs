import Component from "./Component.mjs"

const CLS_BUTTONHEAD = 'fgta5-button-head'
const ID_TITLE = 'application-title'
const ATTR_WITHFOOTER = 'data-withfooter'


export default class App extends Component {
	constructor(id) {
		super(id)
		App_construct(this)
	}

	ShowFooter(show) {
		App_ShowFooter(this, show)
	}
}

function App_construct(self) {
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

	App_createHeader(self, head)
	App_createFooter(self, footer)

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
				document.title = args.module.title
				document.getElementById(ID_TITLE).innerHTML =  args.module.title
			}
		}
	})
}

function App_createHeader(self, head) {
	const divleft = document.createElement('div')
	const title = document.createElement('span')

	const btnmenu = self.CreateSvgButton(Component.ICON_MENU, CLS_BUTTONHEAD, ()=>{
		App_ShowMenu(self)
	})

	const btnhome = self.CreateSvgButton(Component.ICON_HOME, CLS_BUTTONHEAD, ()=>{
		App_ShowHome(self)
	})

	divleft.appendChild(btnhome)

	title.id = ID_TITLE
	title.innerHTML = 'loading ...'

	head.appendChild(divleft)
	head.appendChild(title)
	head.appendChild(btnmenu)
}

function App_createFooter(self, footer) {
	footer.innerHTML = 'footer'
}


function App_ShowFooter(self, show) {
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

function App_ShowMenu(self) {
	window.parent.postMessage({
		action: Component.ACTION_SHOWMENU
	}, '*')
}

function App_ShowHome(self) {
	window.parent.postMessage({
		action: Component.ACTION_SHOWHOME
	}, '*')	
}