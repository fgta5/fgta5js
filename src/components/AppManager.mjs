import Component from "./Component.mjs"

const ATTR_NAVSHOWED = 'showed'
const ATTR_MODULENAME = 'data-module'

const CLS_BUTTONHEAD = 'fgta5-button-head'

const ICON_HOME = `<svg version="1.1" viewBox="0 0 8.4667 8.4667" xmlns="http://www.w3.org/2000/svg">
<g fill="currentColor">
<rect x="4.2337" y="3.9367" width="3.0541" height="4.063"/>
<rect x="1.2121" y="3.9367" width=".9332" height="4.0184"/>
<path d="m4.2479 1.0276 3.7518 3.4383-7.5035-1e-7z"/>
<rect x="1.6787" y="3.9367" width="3.2135" height="1.4646"/>
</g>`



export default class AppManager extends Component {
	constructor(id) {
		super(id)
		AppManager_construct(this)
		AppManager_listenMessage(this)
	}

	ShowMenu() {
		AppManager_ShowMenu(this)	
	}

	SetMenu(menus) {
		// AppManager_ShowMenu(this, menus)
	}

	OpenModule(param) {
		AppManager_OpenModule(this, param)
	}

	
}

function AppManager_construct(self) {
	console.log('constructiong application manager')

	const main = self.Element  
	const head = document.createElement('header')
	const iframes = document.createElement('div')
	const nav = document.createElement('nav')
	
	main.after(head)
	head.after(iframes)
	iframes.after(nav)
	

	head.classList.add('fgta5-app-head')

	main.classList.add('fgta5-app-main')

	nav.classList.add('fgta5-appmanager-nav')


	AppManager_createHeader(self, head)
	AppManager_createMenu(self, nav)

	self.Nodes = {
		Head: head,
		Nav: nav,
		Main: main,
		IFrames: iframes
	}

}

function AppManager_listenMessage(self) {
	window.addEventListener("message", (evt) => {
		if (evt.data.action!=undefined) {
			var action = evt.data.action
			if (action==Component.ACTION_SHOWMENU) {
				AppManager_ShowMenu(self)
			}
		}
	})
}


function headButton(self, svg, fn_click) {
	return self.CreateSvgButton(svg, CLS_BUTTONHEAD, fn_click )
}

function AppManager_createHeader(self, head) {
	const title = document.createElement('span')
	const btnmenu = headButton(self, Component.ICON_MENU, ()=>{
		AppManager_ShowMenu(self)
	})

	title.innerHTML = 'header'

	head.appendChild(title)
	head.appendChild(btnmenu)
}

function AppManager_createMenu(self, nav) {
	const menuhead = document.createElement('div')
	const btnhome = headButton(self, ICON_HOME, ()=>{ AppManager_showHome(self) })
	const divcenter = document.createElement('div')
	const btnclose = headButton(self, Component.ICON_CLOSE, ()=>{ AppManager_closeMenu(self) })

	menuhead.setAttribute('header', '')
	menuhead.appendChild(btnhome)
	menuhead.appendChild(divcenter)
	menuhead.appendChild(btnclose)
	
	divcenter.innerHTML = 'Menu'

	nav.appendChild(menuhead)
}	


function AppManager_ShowMenu(self) {
	console.log('show menu')
	const nav = self.Nodes.Nav

	nav.setAttribute(ATTR_NAVSHOWED, '')
}

function AppManager_showHome(self) {
	AppManager_closeMenu(self)
	console.log('show home')

	self.Nodes.IFrames.style.display = 'none'
}

function AppManager_closeMenu(self) {
	const nav = self.Nodes.Nav
	nav.removeAttribute(ATTR_NAVSHOWED)
}

function AppManager_OpenModule(self, param) {
	console.log(param)

	const iframes = self.Nodes.IFrames
	const modulename = param.module

	self.Nodes.IFrames.style.display = 'block'

	var ifr = iframes.querySelector(`iframe [${ATTR_MODULENAME}="${modulename}"]`)
	if (ifr==null) {
		// buka iframe baru
		ifr = document.createElement('iframe')
		ifr.classList.add('fgta5-iframe')
		ifr.setAttribute(ATTR_MODULENAME, modulename)
		ifr.title = param.title
		iframes.appendChild(ifr)

		ifr.src = 'demo-application'
	} else {	
		// tampilkan iframe
	}


}