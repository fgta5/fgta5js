import Component from "./Component.mjs"

const ATTR_NAVSHOWED = 'showed'
const ATTR_MODULENAME = 'data-module'
const ATTR_FAVOURITE = "data-favourite"
const ATTR_RECENTMODULE = 'data-recentmodule'
const ATTR_CURRENTUSER = 'data-currentuser'
const ATTR_MENUICONCONTAINER = 'data-iconcontainer'
const ATTR_MENUICONIMAGE = 'data-iconimage'
const ATTR_MENUICONTEXT = 'data-icontext'
const ATTR_GRIDAREA = 'data-gridarea'

const CLS_BUTTONHEAD = 'fgta5-button-head'
const CLS_BUTTONMENU = 'fgta5-button-menu'

const TXT_FAVOURITE = 'Favourite Programs'
const TXT_RECENT = 'Recent Programs'


const ICON_HOME = `<svg version="1.1" viewBox="0 0 8.4667 8.4667" xmlns="http://www.w3.org/2000/svg">
<g fill="currentColor">
<rect x="4.2337" y="3.9367" width="3.0541" height="4.063"/>
<rect x="1.2121" y="3.9367" width=".9332" height="4.0184"/>
<path d="m4.2479 1.0276 3.7518 3.4383-7.5035-1e-7z"/>
<rect x="1.6787" y="3.9367" width="3.2135" height="1.4646"/>
</g>`

const ICON_DIRDEF = '<svg width="32" height="32" version="1.1" viewBox="0 0 8.4667 8.4667" xmlns="http://www.w3.org/2000/svg"><rect x=".4961" y="3.9307" width="7.5035" height="4.0689"/><path d="m0.4961 3.2521h7.5035l1e-7 -0.71184h-4.2386l-0.87664-1.3525h-2.3883z"/><rect x="5.8727" y="5.303" width="1.2058" height="1.1077" fill="#fff"/></svg>'


export default class AppManager extends Component {
	constructor(id) {
		super(id)
		AppManager_construct(this)
		AppManager_listenMessage(this)
	}


	RootIcons

	#modules = {}
	get Modules() { return this.#modules }


	SetMenu(data) {
		AppManager_SetMenu(this, data)
	}

	ShowMenu() {
		AppManager_ShowMenu(this)	
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
	const {MenuBoard} = AppManager_createMenu(self, nav)

	self.Nodes = {
		Head: head,
		Nav: nav,
		Main: main,
		IFrames: iframes,
		Favourite: favourite,
		Recent: recent,
		Currentuser: currentuser,
		MenuBoard: MenuBoard
	}

}

function AppManager_listenMessage(self) {
	window.addEventListener("message", (evt) => {
		if (evt.data.action!=undefined) {
			var action = evt.data.action
			if (action==Component.ACTION_SHOWMENU) {
				AppManager_ShowMenu(self)
			} if (action==Component.ACTION_APPLICATIONLOADED) {
				// applikasi di iframe terbuka
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
	const btnmenureset = headButton(self, Component.ICON_MENU, ()=>{ AppManager_ResetMenu(self) })
	const divcenter = document.createElement('div')
	const btnclose = headButton(self, Component.ICON_CLOSE, ()=>{ AppManager_closeMenu(self) })
	const main = document.createElement('div')
	const toppanel = document.createElement('div')
	const toppanel_left = document.createElement('div')
	const toppanel_center = document.createElement('div')
	const toppanel_right = document.createElement('div')
	const txtsearch = document.createElement('input')
	const btnsearch = document.createElement('button')
	
	
	const menuboard = document.createElement('div')
	

	// header
	menuhead.setAttribute('header', '')
	menuhead.appendChild(btnmenureset)
	menuhead.appendChild(divcenter)
	menuhead.appendChild(btnclose)
	divcenter.innerHTML = 'Menu'


	// main
	main.setAttribute('main', '')
	main.appendChild(toppanel)
	main.appendChild(menuboard)




	// top panel: home, search, logout, profile
	toppanel.classList.add('fgta5-menu-toppanel')
	toppanel.appendChild(toppanel_left)
	toppanel.appendChild(toppanel_center)
	toppanel.appendChild(toppanel_right)


	// home
	const btnhome = self.CreateSvgButton(ICON_HOME, CLS_BUTTONMENU, ()=>{
		AppManager_showHome(self)
	})

	toppanel_left.appendChild(btnhome)
	
	// search
	txtsearch.setAttribute('placeholder', 'search module')
	txtsearch.addEventListener('keydown', (evt)=>{
		if (evt.key=='Enter') {
			AppManager_searchModule(self, txtsearch.value)
		}
	})

	btnsearch.innerHTML = 'Search'
	btnsearch.addEventListener('click', (evt)=>{
		AppManager_searchModule(self, txtsearch.value)
	})

	// toppanel content
	toppanel_left.setAttribute(ATTR_GRIDAREA, 'left')
	
	
	toppanel_center.setAttribute(ATTR_GRIDAREA, 'center')
	toppanel_center.appendChild(txtsearch)
	toppanel_center.appendChild(btnsearch)

	toppanel_right.setAttribute(ATTR_GRIDAREA, 'right')




	// main menuboard
	menuboard.classList.add('fgta5-menu')
	


	// footer



	// setup nav
	nav.appendChild(main)
	nav.appendChild(menuhead)

	return {
		MenuBoard: menuboard
	}
}	


function AppManager_ShowMenu(self) {
	console.log('show menu')
	const nav = self.Nodes.Nav

	nav.setAttribute(ATTR_NAVSHOWED, '')
}

function AppManager_showHome(self) {
	AppManager_closeMenu(self)
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
	// apakah div untuk favourite sudah didefinisikan
	if (self.Nodes.Favourite==null) {
		return
	}

	const favourite = self.Nodes.Favourite
	const title = document.createElement('div')
	
	title.innerHTML = `${TXT_FAVOURITE}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`
	title.classList.add('fgta5-appmanager-home-subtitle')

	favourite.before(title)
	favourite.classList.add('fgta5-menu')

	for (var modulename of data) {
		var module = self.Modules[modulename]
		if (module!=null) {
			var mi = AppManager_CreateModuleIcon(self, module.data)
			favourite.appendChild(mi)
		}
	}
}



function AppManager_CreateModuleIcon(self, module) {
	const container = document.createElement('div')
	const icon = document.createElement('div')
	const text = document.createElement('div')
	
	container.setAttribute(ATTR_MENUICONCONTAINER, '')
	if (module.disabled) {
		container.setAttribute('disabled', '')
	}

	if (module.icon!=null) {
		icon.setAttribute(ATTR_MENUICONIMAGE, '')
		icon.style.backgroundImage = `url('${module.icon}')`
	}

	text.innerHTML = module.title
	text.setAttribute(ATTR_MENUICONTEXT, '')


	container.appendChild(icon)
	container.appendChild(text)

	icon.addEventListener('click', ()=>{
		self.OpenModule(module)
		icon.style.animation = 'iconClicked 0.2s forwards'
		setTimeout(()=>{
			icon.style.animation = 'unset'
			AppManager_closeMenu(self)
		}, 300)
	})
	return container
}


function AppManager_CreateGroupIcon(self, group) {
	const container = document.createElement('div')
	const icon = document.createElement('div')
	const text = document.createElement('div')
	
	container.setAttribute(ATTR_MENUICONCONTAINER, '')
	if (group.disabled) {
		container.setAttribute('disabled', '')
	}


	icon.setAttribute(ATTR_MENUICONIMAGE, '')
	if (group.icon!=null) {
		// tampilkan icon sesuai data
		icon.style.backgroundImage = `url('${group.icon}')`
	} else {
		// tampilkan icon standard
		icon.style.backgroundImage = `url('data:image/svg+xml,${encodeURIComponent(ICON_DIRDEF)}')`
	}

	text.innerHTML = group.title
	text.setAttribute(ATTR_MENUICONTEXT, '')


	container.appendChild(icon)
	container.appendChild(text)

	icon.addEventListener('click', ()=>{
		icon.style.animation = 'iconClicked 0.4s forwards'
		
		setTimeout(()=>{
			icon.style.animation = 'unset'
		}, 400)

		setTimeout(()=>{
			AppManager_PopulageMenuIcons(self, group.icons, group.parent)
		}, 200)
	})



	return container
}


function AppManager_CreateActionIcon(self, buttondata, fn_action) {
	const container = document.createElement('div')
	const icon = document.createElement('div')
	const text = document.createElement('div')
	
	container.setAttribute(ATTR_MENUICONCONTAINER, '')
	if (buttondata.disabled) {
		container.setAttribute('disabled', '')
	}


	icon.setAttribute(ATTR_MENUICONIMAGE, '')
	if (buttondata.icon!=null) {
		// tampilkan icon sesuai data
		icon.style.backgroundImage = `url('${buttondata.icon}')`
	} else {
		// tampilkan icon standard
		icon.style.backgroundImage = `url('data:image/svg+xml,${encodeURIComponent(Component.ICON_ACTION)}')`
	}

	text.innerHTML = buttondata.title
	text.setAttribute(ATTR_MENUICONTEXT, '')


	container.appendChild(icon)
	container.appendChild(text)

	icon.addEventListener('click', ()=>{
		icon.style.animation = 'iconClicked 0.4s forwards'
		setTimeout(()=>{
			icon.style.animation = 'unset'
		}, 400)
		setTimeout(()=>{
			if (typeof fn_action === 'function') {
				fn_action()
			}
		}, 200)
	})

	return container
}



function AppManager_SetMenu(self, data) {
	self.RootIcons = AppManager_ReadMenu(self, data)
	AppManager_PopulageMenuIcons(self, self.RootIcons)
}


function AppManager_ResetMenu(self) {
	AppManager_PopulageMenuIcons(self, self.RootIcons)

}

function AppManager_ReadMenu(self, data) {
	let icons = []
	for (var node of data) {
		if (node instanceof $fgta5.ModuleData) {
			// module
			var module = node
			var mi = AppManager_CreateModuleIcon(self, module)
			icons.push(mi)

			// set keyword
			var keyword
			if (node.keyword!=null) {
				keyword = `${node.name} : ${node.keyword}`
			} else {
				keyword = node.name
			}

			// add moduledata to library
			self.Modules[node.name] = {
				keyword: keyword,
				data: node
			}
		} else {
			// direktory
			var groupicons = AppManager_ReadMenu(self, node.items)
			var di = AppManager_CreateGroupIcon(self, {
				title: node.title,
				icon: node.icon,
				icons: groupicons,
				parent: icons
			})
			if (node.border!==false) {
				di.classList.add('fgta5-icongroup')
			}
			icons.push(di)
		}
		
	}
	return icons
}

function AppManager_PopulageMenuIcons(self, icons, parent) {
	const menuboard = self.Nodes.MenuBoard


	/* tambahkan back icon jika belum ada */
	if (parent!=null) {
		if (icons[0].isbackIcon!==true) {
			var backicon = {
				title: '',
				icon: `data:image/svg+xml,${encodeURIComponent(Component.ICON_BACK)}`,
				icons: parent,
				parent: parent.parent
			}
			var di = AppManager_CreateGroupIcon(self, backicon)
			di.isbackIcon = true
			icons.unshift(di)
		}
	}
	

	menuboard.style.animation = "fadeOutLeft 0.05s forwards";
	setTimeout(()=>{
		menuboard.innerHTML = ''
		menuboard.style.animation = "fadeInRight 0.3s forwards";
		for (var icon of icons) {
			menuboard.appendChild(icon)
		}
	}, 50)
} 

async function AppManager_searchModule(self, searchtext) {
	if (searchtext.trim()=='') {
		return
	}

	const menuboard = self.Nodes.MenuBoard
	const modules = self.Modules

	menuboard.innerHTML = ''
	var i = 0
	for (var modulename in modules) {
		if (modulename.toLowerCase().includes(searchtext)) {
			i++
			var module = modules[modulename]
			if (module!=null) {
				var mi = AppManager_CreateModuleIcon(self, module.data)
				mi.style.animation = 'dropped 0.3s forwards'
				menuboard.appendChild(mi)
				if (i<10) {
					await Component.Sleep(100)
				}
				
			}
		}
	}
}