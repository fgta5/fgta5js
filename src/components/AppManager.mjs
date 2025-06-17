import Component from "./Component.mjs"

const ATTR_NAVSHOWED = 'showed'
const ATTR_MODULENAME = 'data-module'
const ATTR_FAVOURITE = "data-favourite"
const ATTR_OPENEDMODULE = 'data-openedmodule'
const ATTR_CURRENTUSER = 'data-currentuser'
const ATTR_MENUICONCONTAINER = 'data-iconcontainer'
const ATTR_MENUICONIMAGE = 'data-iconimage'
const ATTR_MENUICONTEXT = 'data-icontext'
const ATTR_GRIDAREA = 'data-gridarea'
const ATTR_SHORTCUT_ICON = 'data-icon'
const ATTR_SHORTCUT_TITLE = 'data-title'
const ATTR_SHORTCUT_INFO = 'data-info'
const ATTR_SHORTCUT_CLOSE = 'data-buttonclose'

const CLS_BUTTONHEAD = 'fgta5-button-head'
const CLS_BUTTONMENU = 'fgta5-button-menu'
const CLS_SHORTCUTBUTTONCLOSE = 'fgta5-button-shorcutclose'

const TXT_FAVOURITE = 'Favourite Programs'
const TXT_OPENED = 'Opened Programs'

const C_SHORTCUT_PREFIX = 'fgta5-sch-mod-'

const ICON_DIRDEF = '<svg width="32" height="32" version="1.1" viewBox="0 0 8.4667 8.4667" xmlns="http://www.w3.org/2000/svg"><rect x=".4961" y="3.9307" width="7.5035" height="4.0689"/><path d="m0.4961 3.2521h7.5035l1e-7 -0.71184h-4.2386l-0.87664-1.3525h-2.3883z"/><rect x="5.8727" y="5.303" width="1.2058" height="1.1077" fill="#fff"/></svg>'


const ActionEvent = (data) => { return new CustomEvent('action', data) }
const LogoutEvent = (data) => { return new CustomEvent('logout', data) }
const OpenProfileEvent = (data) => { return new CustomEvent('openprofile', data) }
const OpenSettingEvent = (data) => { return new CustomEvent('opensetting', data) }


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
		AppManager_closeMenu(this)
	}

	#userdata
	get User() { return this.#userdata }
	SetUser(data) {
		this.#userdata = data
		AppManager_SetUser(this, data)
	}
	

	addEventListener(evt, callback) {
		this.Listener.addEventListener(evt, callback)
	}
}

function AppManager_construct(self) {
	console.log('constructiong application manager')

	const main = self.Element  
	const head = document.createElement('header')
	const iframes = document.createElement('div')
	const nav = document.createElement('nav')
	const favourite = main.querySelector(`div[${ATTR_FAVOURITE}]`)
	
	const currentuser = main.querySelector(`div[${ATTR_CURRENTUSER}]`)
	
	main.after(head)
	head.after(iframes)
	iframes.after(nav)
	

	head.classList.add('fgta5-app-head')

	main.classList.add('fgta5-app-main')

	nav.classList.add('fgta5-appmanager-nav')

	AppManager_createHeader(self, head)
	const {Opened} = AppManager_createOpenedBoard(self, main)
	const {MenuBoard, MenuFooter, ProfileButton, LogoutButton, MenuResetButton} = AppManager_createMenuBoard(self, nav)



	self.Listener = new EventTarget()
	self.Nodes = {
		Head: head,
		Nav: nav,
		Main: main,
		IFrames: iframes,
		Favourite: favourite,
		Opened: Opened,
		Currentuser: currentuser,
		MenuBoard: MenuBoard,
		MenuFooter: MenuFooter, 
		ProfileButton: ProfileButton,
		LogoutButton: LogoutButton,
		MenuResetButton: MenuResetButton
	}

}

function AppManager_listenMessage(self) {
	window.addEventListener("message", (evt) => {
		if (evt.data.action!=undefined) {
			var action = evt.data.action
			if (action==Component.ACTION_SHOWMENU) {
				AppManager_ShowMenu(self)
			} else if (action==Component.ACTION_SHOWHOME) {
				AppManager_showHome(self)
			} else if (action==Component.ACTION_APPLICATIONLOADED) {
				// applikasi client di iframe terbuka
			}
		}
	})


	window.history.pushState(null, "", window.location.href);
	window.addEventListener("popstate", function(evt) {
		evt.preventDefault()
		window.history.pushState(null, "", window.location.href);
	});
}




function AppManager_createHeadButton(self, svg, fn_click) {
	return self.CreateSvgButton(svg, CLS_BUTTONHEAD, fn_click )
}

function AppManager_createHeader(self, head) {
	const title = document.createElement('span')
	const btnmenu = AppManager_createHeadButton(self, Component.ICON_MENU, ()=>{
		AppManager_ShowMenu(self)
	})

	title.innerHTML = 'header'

	head.appendChild(title)
	head.appendChild(btnmenu)
}

function AppManager_createMenuBoard(self, nav) {
	const menuhead = document.createElement('div')
	const btnmenureset = AppManager_createHeadButton(self, Component.ICON_MENU, ()=>{ AppManager_ResetMenu(self) })
	const divcenter = document.createElement('div')
	const btnclose = AppManager_createHeadButton(self, Component.ICON_CLOSE, ()=>{ AppManager_closeMenu(self) })
	const main = document.createElement('div')
	const toppanel = document.createElement('div')
	const toppanel_left = document.createElement('div')
	const toppanel_center = document.createElement('div')
	const toppanel_right = document.createElement('div')
	const txtsearch = document.createElement('input')
	const btnsearch = document.createElement('button')
	const btnlogout = document.createElement('a')
	
	
	const menuboard = document.createElement('div')
	const footer = document.createElement('div')
	const divleft = document.createElement('div')

	
	// divleft untuk button reset
	divleft.appendChild(btnmenureset)

	// header
	menuhead.setAttribute('header', '')
	menuhead.appendChild(divleft)
	menuhead.appendChild(divcenter)
	menuhead.appendChild(btnclose)
	divcenter.innerHTML = 'Menu'


	// footer
	footer.classList.add('hidden')
	footer.classList.add('fgta5-menu-footer')
	footer.appendChild(btnlogout)



	// main
	main.setAttribute('main', '')
	main.appendChild(toppanel)
	main.appendChild(menuboard)
	main.appendChild(footer)
	main.addEventListener('scroll', ()=>{
		 if (main.scrollTop > 10) {
			menuhead.classList.add('fgta5-fixheader-scrolled')
		 } else {
			menuhead.classList.remove('fgta5-fixheader-scrolled')
		 }
	})


	// top panel: home, search, logout, profile
	toppanel.classList.add('fgta5-menu-toppanel')
	toppanel.appendChild(toppanel_left)
	toppanel.appendChild(toppanel_center)
	toppanel.appendChild(toppanel_right)


	// home
	const btnhome = self.CreateSvgButton(Component.ICON_HOME, CLS_BUTTONMENU, ()=>{
		AppManager_showHome(self)
	})

	// setting
	const btnsetting = self.CreateSvgButton(Component.ICON_SETTING, CLS_BUTTONMENU, ()=>{
		AppManager_openSetting(self)
	})
	
	
	// search
	const menusearch = document.createElement('div')
	menusearch.classList.add('fgta5-menu-search')
	menusearch.appendChild(txtsearch)
	menusearch.appendChild(btnsearch)

	txtsearch.classList.add('fgta5-menu-search')
	txtsearch.setAttribute('name', 'menusearch')
	txtsearch.setAttribute('placeholder', 'search module')
	txtsearch.addEventListener('keydown', (evt)=>{
		if (evt.key=='Enter') {
			AppManager_searchModule(self, txtsearch.value)
		}
	})

	btnsearch.classList.add('fgta5-menu-search')
	btnsearch.innerHTML = Component.ICON_SEARCH
	btnsearch.addEventListener('click', (evt)=>{
		txtsearch.focus()
		AppManager_searchModule(self, txtsearch.value)
	})


	// user
	const btnprofile = self.CreateSvgButton(Component.ICON_USER, CLS_BUTTONMENU)
	btnprofile.classList.add('hidden')
	

	// toppanel content
	toppanel_left.setAttribute(ATTR_GRIDAREA, 'left')
	toppanel_left.appendChild(btnhome)
	toppanel_left.appendChild(btnsetting)
	
	toppanel_center.setAttribute(ATTR_GRIDAREA, 'center')
	toppanel_center.appendChild(menusearch)


	toppanel_right.setAttribute(ATTR_GRIDAREA, 'right')
	toppanel_right.appendChild(btnprofile)


	// main menuboard
	menuboard.classList.add('fgta5-menu')


	// button logout
	btnlogout.innerHTML = `<div icon>${Component.ICON_LOGOUT}</div><div>Sign Out</div>`
	btnlogout.setAttribute('href', 'javascript:void(0)')


	// setup nav
	nav.appendChild(main)
	nav.appendChild(menuhead)




	return {
		MenuBoard: menuboard,
		MenuFooter: footer,
		ProfileButton: btnprofile,
		LogoutButton: btnlogout,
		MenuResetButton: btnmenureset
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


function AppManager_iframeLoaded(self, iframe, module) {
	// client iframe kirim message ke parent window
	// informasi bahwa client sudah selesai di load
	iframe.contentWindow.postMessage({
		action: Component.ACTION_APPLICATIONLOADED,
		module: {
			title: module.title,
			name: module.name
		}
	}, '*')

	// saat module pertama di load
	self.Listener.dispatchEvent(ActionEvent({
		detail: {
			name: 'moduleloaded',
			modulename: module.name,
			title: module.title,
			iframe: iframe
		}
	}))

	// module terbuka
	self.Listener.dispatchEvent(ActionEvent({
		detail: {
			name: 'moduleopened',
			modulename: module.name,
			title: module.title,
			iframe: iframe
		}
	}))

	// tambahkan di recent app
	AppManager_addOpenedModule(self, iframe, module)
}

function AppManager_iframeReOpen(self, iframe, module) {
	// tampilkan iframe
	iframe.classList.remove('hidden')

	// module terbuka
	self.Listener.dispatchEvent(ActionEvent({
		detail: {
			name: 'moduleopened',
			modulename: module.name,
			title: module.title,
			iframe: iframe
		}
	}))

	// untuk geser shortcut ke awal
	AppManager_addOpenedModule(self, iframe, module)
}



async function AppManager_OpenModule(self, module) {
	const iframes = self.Nodes.IFrames
	const modulename = module.name

	

	const qry = `iframe[${ATTR_MODULENAME}="${modulename}"]`
	const ifr = iframes.querySelector(qry)
	if (ifr==null) {
		// buka iframe baru
		const mask = $fgta5.Modal.Mask('Please wait...')

		var url = module.url ?? 'demo-application'
		let newframe = document.createElement('iframe')
		newframe.classList.add('fgta5-iframe')
		newframe.classList.add('hidden')
		newframe.setAttribute(ATTR_MODULENAME, modulename)
		
		newframe.onload = (evt) => {
			AppManager_iframeLoaded(self, newframe, module)
			newframe.classList.remove('hidden')
			mask.close()
		}

		fetch(url)
			.then(response => {
				if (!response.ok) {
					throw new Error(`HTTP Error: ${response.status}`);
				}
				newframe.src = url
				iframes.appendChild(newframe)
				self.Nodes.IFrames.classList.remove('hidden')
			}).catch(error => {
				$fgta5.MessageBox.Error(error)
				mask.close()
			});
	} else {	
		// tampilkan iframe
		// hide semua iframe kecuali iframe yang akan dibuka
		var frames = iframes.querySelectorAll('iframe')
		for (var f of frames) {
			var fname = f.getAttribute(ATTR_MODULENAME)
			if (fname==modulename) {
				AppManager_iframeReOpen(self, f, module)
			} else {
				f.classList.add('hidden')
			}
		} 
		self.Nodes.IFrames.classList.remove('hidden')
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
			AppManager_PopulateMenuIcons(self, group.icons, group.parent)
		}, 200)
	})



	return container
}


function AppManager_SetMenu(self, data) {
	self.RootIcons = AppManager_ReadMenu(self, data)
	AppManager_PopulateMenuIcons(self, self.RootIcons)
}


function AppManager_ResetMenu(self) {
	AppManager_PopulateMenuIcons(self, self.RootIcons)

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

function AppManager_PopulateMenuIcons(self, icons, parent) {
	const menuboard = self.Nodes.MenuBoard
	const menureset = self.Nodes.MenuResetButton

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

		// munculkan tombol reset menu kiri atas
		menureset.classList.remove('hidden')

	} else {
		// sembunyikan tombol reset menu kiri atas
		menureset.classList.add('hidden')

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
		if (self.previousSearch===undefined) {
			self.previousSearch=''
			return
		}

		if (searchtext==self.previousSearch) {
			return
		}

		self.previousSearch=''
		AppManager_ResetMenu(self)
		return
	}

	self.previousSearch=searchtext

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

function AppManager_SetUser(self, data) {
	const btnprofile = self.Nodes.ProfileButton
	const btnlogout = self.Nodes.LogoutButton

	// munculkan footer menu untuk logout
	self.Nodes.MenuFooter.classList.remove('hidden')

	// munculkan profile icon
	btnprofile.classList.remove('hidden')
	btnprofile.addEventListener('click', (evt)=>{
		AppManager_profileClick(self)
	})


	btnlogout.addEventListener('click', (evt)=>{
		AppManager_logout(self)
	})
	// munculkan nama di home
	self.Nodes.Currentuser.innerHTML = data.displayname

}

function AppManager_profileClick(self) {
	self.Listener.dispatchEvent(OpenProfileEvent({
		detail: {
			user: self.User,
		}
	}))
}

async function AppManager_logout(self) {
	var ret = await $fgta5.MessageBox.Confirm("are you sure to log out ?")
	if (ret=='ok') {
		self.Listener.dispatchEvent(LogoutEvent({
			detail: {
				user: self.User,
			}
		}))
	}
}

async function AppManager_openSetting(self) {
	self.Listener.dispatchEvent(OpenSettingEvent({
		detail: {
			user: self.User,
		}
	}))
}

function AppManager_createOpenedBoard(self, main) {
	const opened = main.querySelector(`div[${ATTR_OPENEDMODULE}]`)
	const title = document.createElement('div')
	

	opened.classList.add('fgta5-openedmodule')

	title.innerHTML = `${TXT_OPENED}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`
	title.classList.add('fgta5-appmanager-home-subtitle')
	title.classList.add('hidden')

	opened.classList.add('hidden')
	opened.before(title)
	opened.hide = () => {
		title.classList.add('hidden')
		opened.classList.add('hidden')
	}

	opened.show = () => {
		title.classList.remove('hidden')
		opened.classList.remove('hidden')
	}

	return {
		Opened: opened
	}
}

function AppManager_addOpenedModule(self, iframe, module) {
	const opened = self.Nodes.Opened
	const id = `${C_SHORTCUT_PREFIX}-${module.name}`
	const shortcut = document.getElementById(id)
	if (shortcut==null) {
		// tambahkan di awal
		const newshortcut = AppManager_createOpenedShortcut(self, module, iframe, id)
		opened.prepend(newshortcut)
	} else {
		// geser di awal
		opened.prepend(shortcut);
	}

	opened.show()
}


function AppManager_createOpenedShortcut(self, module, iframe, id) {
	const opened = self.Nodes.Opened
	const shortcut = document.createElement('div')
	const icon = document.createElement('div') 
	const title = document.createElement('div')
	const info = document.createElement('div')
	const closebutton = document.createElement('a')

	shortcut.id = id
	shortcut.classList.add('fgta5-openedmodule-shortcut')
	shortcut.appendChild(icon)
	shortcut.appendChild(title)
	shortcut.appendChild(info)
	shortcut.appendChild(closebutton)
	shortcut.addEventListener('click', (evt)=>{ AppManager_OpenModule(self, module) })


	icon.setAttribute(ATTR_SHORTCUT_ICON, '')
	icon.innerHTML = '&nbsp;'
	if (module.icon!=null) {
		icon.style.backgroundImage = `url('${module.icon}')`
	}

	title.setAttribute(ATTR_SHORTCUT_TITLE, '')	
	title.innerHTML = module.title

	info.setAttribute(ATTR_SHORTCUT_INFO, '')
	info.innerHTML = 'idle'


	var btn = self.CreateSvgButton(Component.ICON_CLOSE, CLS_SHORTCUTBUTTONCLOSE, (evt)=>{
		evt.stopPropagation()
		iframe.remove()
		shortcut.remove()

		if (opened.childNodes.length==0) {
			opened.hide()
		}
	})

	closebutton.setAttribute(ATTR_SHORTCUT_CLOSE, '')
	closebutton.appendChild(btn)

	return shortcut
}