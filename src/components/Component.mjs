let counter = 0;



const ICON_MENU = `<svg version="1.1" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <g stroke-linecap="square">
	<rect x="19.5" y="19.5" width="12" height="12" fill="currentColor"/>
	<rect x="2" y="20" width="12" height="12" fill="currentColor"/>
	<rect x="20" y="2" width="12" height="12" fill="currentColor"/>
	<rect x="2" y="2" width="12" height="12" fill="currentColor"/>
  </g>
</svg>`

const ICON_CLOSE = `<svg version="1.1" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <g stroke="currentColor" stroke-linecap="round" stroke-width="5">
	<path d="M4 4 L28 28"/>
	<path d="M4 28 L28 4"/>
  </g>
</svg>`

const ICON_BACK = `<svg width="32" height="32" version="1.1" viewBox="0 0 8.4667 8.4667" xmlns="http://www.w3.org/2000/svg">
<path d="m5.5873 1.1684-2.515 3.0773 2.515 3.0773" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.3229"/>
</svg>`



export default class Component {
	Id;
	Element;

	static get ICON_MENU() { return ICON_MENU }
	static get ICON_CLOSE() { return ICON_CLOSE }
	static get ICON_BACK() { return ICON_BACK }

	static get ACTION_SHOWMENU()  { return 'showmenu' }
	static get ACTION_APPLICATIONLOADED() { return 'applicationloaded' }

	constructor(id) {
		if (id!=undefined) {
			this.Id = id
			this.Element = document.getElementById(id)
		}
	}


	CreateSvgButton(svg, classname, fn_click) {
		return Component_CreateSvgButton(this, svg, classname, fn_click)
	}

	static GenerateId() {
		return `comp-${++counter}`;
	}

	static Sleep(ms) {
 		return new Promise(resolve => setTimeout(resolve, ms))
	}
}


function Component_CreateSvgButton(self, svg, classname, fn_click) {
	const btn = document.createElement('a')
	btn.innerHTML = svg
	btn.classList.add(classname)
	btn.setAttribute('href', 'javascript:void(0)')
	btn.addEventListener('click', ()=>{
		fn_click()
	})

	return btn
}
