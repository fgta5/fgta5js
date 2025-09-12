import ICONS from "./Icons.mjs"
import Component from "./Component.mjs"
import ModuleData from "./ModuleData.mjs"

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
const ATTR_DRAGOVER = 'data-dragover'
const ATTR_LABEL = 'data-label'
const ATTR_ICON = 'data-icon'
const ATTR_MAINBUTTON = 'data-mainbutton'
const ATTR_DRAGGABLE = 'draggable'

const CLS_BUTTONHEAD = 'fgta5-button-head'
const CLS_BUTTONMENU = 'fgta5-button-menu'
const CLS_SHORTCUTBUTTONCLOSE = 'fgta5-button-shorcutclose'
const CLS_HIDDEN = 'hidden'

const EVT_CLICK = 'click'
const EVT_DBLCLICK = 'dblclick'
const EVT_DRAGSTART = 'dragstart'

const TXT_FAVOURITE = 'Favourite Programs'
const TXT_OPENED = 'Opened Programs'

const C_SHORTCUT_PREFIX = 'fgta5-sch-mod-'



const actionEvent = (data) => { return new CustomEvent('action', data) }
const logoutEvent = (data) => { return new CustomEvent('logout', data) }
const openProfileEvent = (data) => { return new CustomEvent('openprofile', data) }
const openSettingEvent = (data) => { return new CustomEvent('opensetting', data) }
const addToFavouriteEvent = (data) => { return new CustomEvent('addtofavourite', data) }
const removeFromFavouriteEvent = (data) => { return new CustomEvent('removefavourite', data) }


let current_dragged_modulename
let current_drag_action
let drop_valid = false

export default class AppManager extends Component {
	constructor(id) {
		super(id)
		appmgr_construct(this)
		appmgr_listenMessage(this)
	}


	RootIcons

	#modules = {}
	get Modules() { return this.#modules }


	#title
	get Title() { return this.#title }
	setTitle(title) {
		this.#title = title
		appmgr_setTitle(this, title)
	}

	setMenu(data) {
		appmgr_setMenu(this, data)
	}

	showMenu() {
		appmgr_showMenu(this)	
	}

	

	setFavourite(data) {
		appmgr_setFavourite(this, data)
	}

	async openModule(module) {
		await appmgr_openModule(this, module)
		appmgr_closeMenu(this)
	}

	#userdata
	get User() { return this.#userdata }
	setUser(data) {
		this.#userdata = data
		appmgr_setUser(this, data)
	}
	

	addEventListener(evt, callback) {
		this.Listener.addEventListener(evt, callback)
	}
}

function appmgr_construct(self) {
	console.log('constructiong application manager')

	const title = document.createElement('span')
	const main = self.Element  
	const head = document.createElement('header')
	const iframes = document.createElement('div')
	const nav = document.createElement('nav')
	const favourite = main.querySelector(`div[${ATTR_FAVOURITE}]`)
	const trahsbox = document.createElement('div')
	const currentuser = main.querySelector(`div[${ATTR_CURRENTUSER}]`)
	const btnmenu = appmgr_createHeadButton(self, ICONS.MENU, ()=>{
		appmgr_showMenu(self)
	})
	
	main.after(head)
	head.after(iframes)
	iframes.after(nav)

	title.innerHTML = 'Application Manager' // default title, nanti diganti dengan SetTitle


	head.classList.add('fgta5-app-head')
	head.appendChild(title)
	head.appendChild(btnmenu)

	main.classList.add('fgta5-app-main')
	nav.classList.add('fgta5-appmanager-nav')

	const {Opened} = appmgr_createOpenedBoard(self, main)
	const {MenuBoard, MenuFooter, ProfileButton, LogoutButton, MenuResetButton} = appmgr_createMenuBoard(self, nav)


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
		MenuResetButton: MenuResetButton,
		TrashBox: trahsbox,
		Title: title
	}

}

function appmgr_listenMessage(self) {
	window.addEventListener("message", (evt) => {
		if (evt.data.action!=undefined) {
			var action = evt.data.action
			if (action==Component.ACTION_SHOWMENU) {
				appmgr_showMenu(self)
			} else if (action==Component.ACTION_SHOWHOME) {
				appmgr_showHome(self)
			} else if (action==Component.ACTION_APPLICATIONLOADED) {
				// applikasi client di iframe terbuka
			} else if (action=='REDIRECT_TO_LOGIN') {
				// ke halaman login
				const nexturl = window.location.href // login dari container akan diredirect kembali ke container
				const nextmodule = evt.data.nexturl // next url yang dikirim dari client adalah url untuk module
				const url = `evt.data.href?nexturl=${nexturl}&nextmodule=${nextmodule}`
				location.href = url
			}
		}
	})


	window.history.pushState(null, "", window.location.href);
	window.addEventListener("popstate", function(evt) {
		evt.preventDefault()
		window.history.pushState(null, "", window.location.href);
	});
}




function appmgr_createHeadButton(self, svg, fn_click) {
	return Component.createSvgButton(svg, CLS_BUTTONHEAD, fn_click )
}

function appmgr_setTitle(self, title) {
	self.Nodes.Title.innerHTML = title
}


function appmgr_createMenuBoard(self, nav) {
	const menuhead = document.createElement('div')
	const btnmenureset = appmgr_createHeadButton(self, ICONS.MENU, ()=>{ appmgr_resetMenu(self) })
	const divcenter = document.createElement('div')
	const btnclose = appmgr_createHeadButton(self, ICONS.CLOSE, ()=>{ appmgr_closeMenu(self) })
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
	footer.classList.add(CLS_HIDDEN)
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
	const btnhome = Component.createSvgButton(ICONS.HOME, CLS_BUTTONMENU, ()=>{
		appmgr_showHome(self)
	})

	// setting
	const btnsetting = Component.createSvgButton(ICONS.SETTING, CLS_BUTTONMENU, ()=>{
		appmgr_openSetting(self)
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
			appmgr_searchModule(self, txtsearch.value)
		}
	})

	btnsearch.classList.add('fgta5-menu-search')
	btnsearch.innerHTML = ICONS.SEARCH
	btnsearch.addEventListener(EVT_CLICK, (evt)=>{
		txtsearch.focus()
		appmgr_searchModule(self, txtsearch.value)
	})


	// user
	const btnprofile = Component.createSvgButton(ICONS.USER, CLS_BUTTONMENU)
	btnprofile.classList.add(CLS_HIDDEN)
	

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
	btnlogout.innerHTML = `<div icon>${ICONS.LOGOUT}</div><div>Sign Out</div>`
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


function appmgr_showMenu(self) {
	console.log('show menu')
	const nav = self.Nodes.Nav

	nav.setAttribute(ATTR_NAVSHOWED, '')
}

function appmgr_showHome(self) {
	appmgr_closeMenu(self)
	self.Nodes.IFrames.classList.add(CLS_HIDDEN)
}

function appmgr_closeMenu(self) {
	const nav = self.Nodes.Nav
	nav.removeAttribute(ATTR_NAVSHOWED)
}


function appmgr_iframeLoaded(self, iframe, module) {
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
	self.Listener.dispatchEvent(actionEvent({
		detail: {
			name: 'moduleloaded',
			modulename: module.name,
			title: module.title,
			iframe: iframe
		}
	}))

	// module terbuka
	self.Listener.dispatchEvent(actionEvent({
		detail: {
			name: 'moduleopened',
			modulename: module.name,
			title: module.title,
			iframe: iframe
		}
	}))

	// tambahkan di recent app
	appmgr_addOpenedModule(self, iframe, module)
}

function appmgr_iframeReOpen(self, iframe, module) {
	// tampilkan iframe
	iframe.classList.remove(CLS_HIDDEN)

	// module terbuka
	self.Listener.dispatchEvent(actionEvent({
		detail: {
			name: 'moduleopened',
			modulename: module.name,
			title: module.title,
			iframe: iframe
		}
	}))

	// untuk geser shortcut ke awal
	appmgr_addOpenedModule(self, iframe, module)
}



async function appmgr_openModule(self, module) {
	const iframes = self.Nodes.IFrames
	const modulename = module.name

	

	const qry = `iframe[${ATTR_MODULENAME}="${modulename}"]`
	const ifr = iframes.querySelector(qry)
	if (ifr==null) {
		// buka iframe baru
		const mask = $fgta5.Modal.createMask('Please wait...')

		var url = module.url ?? 'demo-application'
		let newframe = document.createElement('iframe')
		newframe.classList.add('fgta5-iframe')
		newframe.classList.add(CLS_HIDDEN)
		newframe.setAttribute(ATTR_MODULENAME, modulename)
		
		newframe.onload = (evt) => {
			appmgr_iframeLoaded(self, newframe, module)
			newframe.classList.remove(CLS_HIDDEN)
			mask.close()
		}

		fetch(url)
			.then(response => {
				if (!response.ok) {
					throw new Error(`HTTP Error: ${response.status}`);
				}
				newframe.src = url
				iframes.appendChild(newframe)
				self.Nodes.IFrames.classList.remove(CLS_HIDDEN)
			}).catch(error => {
				console.error(error)
				$fgta5.MessageBox.error(error)
				mask.close()
			});
	} else {	
		// tampilkan iframe
		// hide semua iframe kecuali iframe yang akan dibuka
		var frames = iframes.querySelectorAll('iframe')
		for (var f of frames) {
			var fname = f.getAttribute(ATTR_MODULENAME)
			if (fname==modulename) {
				appmgr_iframeReOpen(self, f, module)
			} else {
				f.classList.add(CLS_HIDDEN)
			}
		} 
		self.Nodes.IFrames.classList.remove(CLS_HIDDEN)
	}
}


function appmgr_setFavourite(self, data)	 {
	// apakah div untuk favourite sudah didefinisikan
	if (self.Nodes.Favourite==null) {
		return
	}
	
	const favourite = self.Nodes.Favourite
	const title = document.createElement('div')
	const trahscontainer = self.Nodes.TrashBox
	const trashbox = document.createElement('div')
	const trashicon = document.createElement('div')
	const trashlabel = document.createElement('div')
	
	// <div class='fgta5-roundbox'>?</div>
	title.innerHTML = `${TXT_FAVOURITE}&nbsp;&nbsp;&nbsp;&nbsp;`
	title.classList.add('fgta5-appmanager-home-subtitle')

	trashicon.setAttribute(ATTR_ICON, '')
	trashicon.innerHTML = ICONS.TRASH
	
	trashicon.setAttribute(ATTR_LABEL, '')
	trashlabel.innerHTML = 'Delete'

	trashbox.setAttribute(ATTR_MAINBUTTON,'')
	trashbox.appendChild(trashicon)
	trashbox.appendChild(trashlabel)

	trahscontainer.classList.add('fgta5-favourite-trashcontainer')
	trahscontainer.classList.add(CLS_HIDDEN)
	trahscontainer.appendChild(trashbox)
	self.Nodes.Head.after(trahscontainer)


	favourite.before(title)
	favourite.classList.add('fgta5-menu')
	favourite.classList.add('fgta5-favourite')
	favourite.addEventListener('dragover', (evt)=>{ appmgr_FavouriteDragOver(self, evt, favourite) })
	favourite.addEventListener('dragleave', (evt)=>{ appmgr_FavouriteDragLeave(self, evt, favourite) })
	favourite.addEventListener('drop', (evt)=>{ appmgr_FavouriteDrop(self, evt, favourite)  })

	for (let modulename of data) {
		let module = self.Modules[modulename]
		if (module!=null) {
			let mi = appmgr_createModuleIcon(self, module.data)
			appmgr_setAsFavouriteIcon(self, mi, modulename, favourite)
			favourite.appendChild(mi)
		}
	}
}



function appmgr_createModuleIcon(self, module) {
	const container = document.createElement('div')
	const icon = document.createElement('div')
	const text = document.createElement('div')
	
	container.setAttribute('name', module.name)
	container.setAttribute(ATTR_MENUICONCONTAINER, '')
	if (module.disabled) {
		container.setAttribute('disabled', '')
	}

	icon.setAttribute(ATTR_MENUICONIMAGE, '')
	if (module.icon!=null) {
		icon.setAttribute(ATTR_MENUICONIMAGE, '')
		icon.style.backgroundImage = `url('${module.icon}')`
	} else {
		icon.innerHTML = ModuleData.ICON_DEFAULT
	}

	text.innerHTML = module.title
	text.setAttribute(ATTR_MENUICONTEXT, '')


	container.appendChild(icon)
	container.appendChild(text)


	const clickEventName = Component.isMobileDevice() ? EVT_CLICK : EVT_DBLCLICK;
	icon.addEventListener(clickEventName, ()=>{
		self.openModule(module)
		icon.style.animation = 'iconClicked 0.2s forwards'
		setTimeout(()=>{
			icon.style.animation = 'unset'
			appmgr_closeMenu(self)
		}, 300)
	})
	return container
}


function appmgr_createGroupIcon(self, group) {
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
		icon.style.backgroundImage = `url('data:image/svg+xml,${encodeURIComponent(ICONS.DIRDEF)}')`
	}

	text.innerHTML = group.title
	text.setAttribute(ATTR_MENUICONTEXT, '')


	container.appendChild(icon)
	container.appendChild(text)

	icon.addEventListener(EVT_CLICK, ()=>{
		icon.style.animation = 'iconClicked 0.4s forwards'
		
		setTimeout(()=>{
			icon.style.animation = 'unset'
		}, 400)

		setTimeout(()=>{
			appmgr_populateMenuIcons(self, group.icons, group.parent)
		}, 200)
	})



	return container
}


function appmgr_setMenu(self, data) {
	self.RootIcons = appmgr_readMenu(self, data)
	appmgr_populateMenuIcons(self, self.RootIcons)
}


function appmgr_resetMenu(self) {
	appmgr_populateMenuIcons(self, self.RootIcons)

}

function appmgr_readMenu(self, data) {
	let icons = []
	for (var node of data) {
		if (node instanceof $fgta5.ModuleData || node.type=='program') {
			// module
			let module = (node instanceof $fgta5.ModuleData) ? node : new $fgta5.ModuleData(node)
			let mi = appmgr_createModuleIcon(self, module)
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
			var groupicons = appmgr_readMenu(self, node.items)
			var di = appmgr_createGroupIcon(self, {
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

function appmgr_populateMenuIcons(self, icons, parent) {
	const menuboard = self.Nodes.MenuBoard
	const menureset = self.Nodes.MenuResetButton

	/* tambahkan back icon jika belum ada */
	if (parent!=null) {
		if (icons[0].isbackIcon!==true) {
			var backicon = {
				title: '',
				icon: `data:image/svg+xml,${encodeURIComponent(ICONS.BACK)}`,
				icons: parent,
				parent: parent.parent
			}
			var di = appmgr_createGroupIcon(self, backicon)
			di.isbackIcon = true
			icons.unshift(di)
		}

		// munculkan tombol reset menu kiri atas
		menureset.classList.remove(CLS_HIDDEN)

	} else {
		// sembunyikan tombol reset menu kiri atas
		menureset.classList.add(CLS_HIDDEN)

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

async function appmgr_searchModule(self, searchtext) {
	if (searchtext.trim()=='') {
		if (self.previousSearch===undefined) {
			self.previousSearch=''
			return
		}

		if (searchtext==self.previousSearch) {
			return
		}

		self.previousSearch=''
		appmgr_resetMenu(self)
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
				var mi = appmgr_createModuleIcon(self, module.data)
				mi.style.animation = 'dropped 0.3s forwards'
				menuboard.appendChild(mi)
				if (i<10) {
					await Component.Sleep(100)
				}
				
			}
		}
	}
}

function appmgr_setUser(self, data) {
	const btnprofile = self.Nodes.ProfileButton
	const btnlogout = self.Nodes.LogoutButton

	// munculkan footer menu untuk logout
	self.Nodes.MenuFooter.classList.remove(CLS_HIDDEN)

	// munculkan profile icon
	btnprofile.classList.remove(CLS_HIDDEN)
	btnprofile.addEventListener(EVT_CLICK, (evt)=>{
		appmgr_profileClick(self)
	})


	btnlogout.addEventListener(EVT_CLICK, (evt)=>{
		appmgr_logout(self)
	})
	// munculkan nama di home
	self.Nodes.Currentuser.innerHTML = data.displayname

}

function appmgr_profileClick(self) {
	self.Listener.dispatchEvent(openProfileEvent({
		detail: {
			user: self.User,
		}
	}))
}

async function appmgr_logout(self) {
	var ret = await $fgta5.MessageBox.confirm("are you sure to log out ?")
	if (ret=='ok') {
		self.Listener.dispatchEvent(logoutEvent({
			detail: {
				user: self.User,
			}
		}))
	}
}

async function appmgr_openSetting(self) {
	self.Listener.dispatchEvent(openSettingEvent({
		detail: {
			user: self.User,
		}
	}))
}

function appmgr_createOpenedBoard(self, main) {
	const opened = main.querySelector(`div[${ATTR_OPENEDMODULE}]`)
	const title = document.createElement('div')
	

	opened.classList.add('fgta5-openedmodule')

	title.innerHTML = `${TXT_OPENED}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`
	title.classList.add('fgta5-appmanager-home-subtitle')
	title.classList.add(CLS_HIDDEN)

	opened.classList.add(CLS_HIDDEN)
	opened.before(title)
	opened.hide = () => {
		title.classList.add(CLS_HIDDEN)
		opened.classList.add(CLS_HIDDEN)
	}

	opened.show = () => {
		title.classList.remove(CLS_HIDDEN)
		opened.classList.remove(CLS_HIDDEN)
	}

	return {
		Opened: opened
	}
}

function appmgr_addOpenedModule(self, iframe, module) {
	const opened = self.Nodes.Opened
	const id = `${C_SHORTCUT_PREFIX}-${module.name}`
	const shortcut = document.getElementById(id)
	if (shortcut==null) {
		// tambahkan di awal
		const newshortcut = appmgr_createOpenedShortcut(self, module, iframe, id)
		opened.prepend(newshortcut)
	} else {
		// geser di awal
		opened.prepend(shortcut);
	}

	opened.show()
}


function appmgr_createOpenedShortcut(self, module, iframe, id) {
	const opened = self.Nodes.Opened
	const shortcut = document.createElement('div')
	const icon = document.createElement('div') 
	const title = document.createElement('div')
	const info = document.createElement('div')
	const closebutton = document.createElement('a')
	const clickEventName = Component.isMobileDevice() ? EVT_CLICK : EVT_DBLCLICK;

	shortcut.id = id
	shortcut.classList.add('fgta5-openedmodule-shortcut')
	shortcut.setAttribute(ATTR_DRAGGABLE, 'true')
	shortcut.appendChild(icon)
	shortcut.appendChild(title)
	shortcut.appendChild(info)
	shortcut.appendChild(closebutton)

	shortcut.addEventListener(clickEventName, async (evt)=>{ await appmgr_openModule(self, module) })
	shortcut.addEventListener(EVT_DRAGSTART, (evt)=>{ appmgr_DragModule(self, evt, module) })


	icon.setAttribute(ATTR_SHORTCUT_ICON, '')
	if (module.icon!=null) {
		icon.style.backgroundImage = `url('${module.icon}')`
	} else {
		icon.innerHTML = ModuleData.ICON_DEFAULT
	}

	title.setAttribute(ATTR_SHORTCUT_TITLE, '')	
	title.innerHTML = module.title

	info.setAttribute(ATTR_SHORTCUT_INFO, '')
	info.innerHTML = 'idle'


	var btn = Component.createSvgButton(ICONS.CLOSE, CLS_SHORTCUTBUTTONCLOSE, (evt)=>{
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

function appmgr_DragModule(self, evt, module) {
	current_drag_action = 'addtofave'
	evt.dataTransfer.setData('modulename', module.name);
	current_dragged_modulename = module.name
}

function appmgr_FavouriteDragOver(self, evt, favourite) {
	if (current_drag_action=='addtofave') {
		var exist = favourite.querySelector(`[name="${current_dragged_modulename}"]`)
		if (exist==null) {
			evt.preventDefault()
			favourite.setAttribute(ATTR_DRAGOVER, '')
		}
	} 
	// else if (current_drag_action=='removefromfave') {
	// 	favourite.setAttribute(ATTR_DRAGOVER, '')
	// }

}

function appmgr_FavouriteDragLeave(self, evt, favourite) {
	favourite.removeAttribute(ATTR_DRAGOVER)
}

function appmgr_FavouriteDrop(self, evt, favourite) {
	favourite.removeAttribute(ATTR_DRAGOVER)

	const modulename = evt.dataTransfer.getData('modulename');
	if (modulename=='') {
		return
	}

	var exist = favourite.querySelector(`[name="${modulename}"]`)
	if (exist==null) {
		evt.preventDefault()
		const module = self.Modules[modulename]
		let mi = appmgr_createModuleIcon(self, module.data)
		appmgr_setAsFavouriteIcon(self, mi, modulename, favourite)
		favourite.prepend(mi)
		self.Listener.dispatchEvent(addToFavouriteEvent({
			detail: {
				modulename: modulename,
			}
		}))
	}
}

function appmgr_setAsFavouriteIcon(self, mi, modulename, favourite) {
	const trahsbox = self.Nodes.TrashBox
	const trashbutton = trahsbox.querySelector(`[${ATTR_MAINBUTTON}]`)

	mi.setAttribute(ATTR_DRAGGABLE, 'true')
	mi.addEventListener(EVT_DRAGSTART, (evt)=>{
		drop_valid = false
		current_drag_action = 'removefromfave'
		evt.dataTransfer.setData('modulename', modulename);
		trahsbox.classList.remove(CLS_HIDDEN)
	})

	mi.addEventListener('dragend', (evt)=>{
		setTimeout(()=>{
			trahsbox.classList.add(CLS_HIDDEN)
			trashbutton.removeAttribute(ATTR_DRAGOVER)
		}, 100)
	})
	

	trashbutton.addEventListener('dragover', (evt)=>{
		if (current_drag_action=='removefromfave') {
			evt.preventDefault()
			trashbutton.setAttribute(ATTR_DRAGOVER, '')
		}
	})

	trashbutton.addEventListener('dragleave', (evt)=>{
		trashbutton.removeAttribute(ATTR_DRAGOVER)
	})

	trashbutton.addEventListener('drop', (evt)=>{
		if (current_drag_action=='removefromfave') {
			const modulename = evt.dataTransfer.getData('modulename');
			if (modulename=='') {
				return
			}

			var icon = favourite.querySelector(`[name="${modulename}"]`)
			if (icon!=null) {
				icon.style.animation = 'removing 0.3s forwards'
				setTimeout(()=>{
					icon.remove()
				}, 300)
				
				self.Listener.dispatchEvent(removeFromFavouriteEvent({
					detail: {
						modulename: modulename,
					}
				}))
			}
			evt.preventDefault()
			current_drag_action = ''
		}
	})	
}

