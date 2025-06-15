import Component from "./Component.mjs"

const ATTR_NAVSHOWED = 'showed'
const ATTR_MODULENAME = 'data-module'
const ATTR_FAVOURITE = "data-favourite"
const ATTR_RECENTMODULE = 'data-recentmodule'
const ATTR_CURRENTUSER = 'data-currentuser'
const ATTR_MENUICONCONTAINER = 'data-iconcontainer'
const ATTR_MENUICONIMAGE = 'data-iconimage'
const ATTR_MENUICONTEXT = 'data-icontext'


const CLS_BUTTONHEAD = 'fgta5-button-head'

const TXT_FAVOURITE = 'Favourite Programs'
const TXT_RECENT = 'Recent Programs'


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

	SetMenu(data) {
		AppManager_SetMenu(this, data)
	}

	SetFavourite(data) {
		AppManager_SetFavourite(this, data)
	}

	OpenModule(module) {
		AppManager_OpenModule(this, module)
	}


	
}

function AppManager_construct(self) {
	console.log('constructiong application manager')

	const main = self.Element  
	const head = document.createElement('header')
	const iframes = document.createElement('div')
	const nav = document.createElement('nav')
	const favourite = main.querySelector(`div[${ATTR_FAVOURITE}]`)
	const recent = main.querySelector(`div[${ATTR_RECENTMODULE}]`)
	const currentuser = main.querySelector(`div[${ATTR_CURRENTUSER}]`)
	
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
		IFrames: iframes,
		Favourite: favourite,
		Recent: recent,
		Currentuser: currentuser
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

	self.Nodes.IFrames.classList.add('hidden')
}

function AppManager_closeMenu(self) {
	const nav = self.Nodes.Nav
	nav.removeAttribute(ATTR_NAVSHOWED)
}

function AppManager_OpenModule(self, module) {
	const iframes = self.Nodes.IFrames
	const modulename = module.name

	self.Nodes.IFrames.classList.remove('hidden')

	const qry = `iframe[${ATTR_MODULENAME}="${modulename}"]`
	const ifr = iframes.querySelector(qry)
	if (ifr==null) {
		// buka iframe baru
		let newframe = document.createElement('iframe')
		newframe.classList.add('fgta5-iframe')
		newframe.setAttribute(ATTR_MODULENAME, modulename)
		newframe.src = 'demo-application'
		newframe.onload = () => {
			newframe.contentWindow.postMessage({
				action: Component.ACTION_APPLICATIONLOADED,
				module: {
					title: module.title
				}
			}, '*')
		}

		iframes.appendChild(newframe)
		
	} else {	
		// tampilkan iframe
		// hide semua iframe kecuali iframe yang akan dibuka
		var frames = iframes.querySelectorAll('iframe')
		for (var f of frames) {
			var fname = f.getAttribute(ATTR_MODULENAME)
			if (fname==modulename) {
				f.classList.remove('hidden')
			} else {
				f.classList.add('hidden')
			}
		} 
	}


}


function AppManager_SetFavourite(self, data)	 {
	if (self.Nodes.Favourite==null) {
		return
	}

	const favourite = self.Nodes.Favourite

	// tambahkan judul
	const title = document.createElement('div')
	title.innerHTML = `${TXT_FAVOURITE}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`
	title.classList.add('fgta5-appmanager-home-subtitle')

	favourite.before(title)
	favourite.classList.add('fgta5-menu')

	for (var m of data) {
		if (m instanceof $fgta5.ModuleData) {
			let icon = AppManager_CreateModuleIcon(self, m)
			favourite.appendChild(icon)
		}
	}

}


function AppManager_SetMenu(self, data) {

}

function AppManager_CreateModuleIcon(self, module) {
	const container = document.createElement('div')
	const icon = document.createElement('div')
	const text = document.createElement('div')
	
	container.setAttribute(ATTR_MENUICONCONTAINER, '')
	if (module.disabled) {
		container.setAttribute('disabled', '')
	}

	icon.setAttribute(ATTR_MENUICONIMAGE, '')
	icon.style.backgroundImage = `url('${module.icon}')`

	text.innerHTML = module.title
	text.setAttribute(ATTR_MENUICONTEXT, '')


	container.appendChild(icon)
	container.appendChild(text)

	icon.addEventListener('click', ()=>{
		self.OpenModule(module)
	})
	return container
}