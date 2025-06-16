import Component from "./Component.mjs"

const CLS_BUTTONHEAD = 'fgta5-button-head'
const ID_TITLE = 'application-title'

export default class Application extends Component {
	constructor(id) {
		super(id)
		Application_construct(this)
	}

	
}

function Application_construct(self) {
	console.log('constructiong application')

	const main = self.Element  
	const head = document.createElement('header')

	main.after(head)

	head.classList.add('fgta5-app-head')

	main.classList.add('fgta5-app-main')

	Application_createHeader(self, head)

	self.Nodes = {
		Head: head,
		Main: main,
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


function Application_createHeader(self, head) {
	const title = document.createElement('span')
	const btnmenu = self.CreateSvgButton(Component.ICON_MENU, CLS_BUTTONHEAD, ()=>{
		Application_ShowMenu(self)
	})

	title.id = ID_TITLE
	title.innerHTML = 'loading ...'

	head.appendChild(title)
	head.appendChild(btnmenu)
}

function Application_ShowMenu(self) {
	window.parent.postMessage({
		action: Component.ACTION_SHOWMENU
	}, '*')
}