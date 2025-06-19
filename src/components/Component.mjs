let counter = 0;


export default class Component {
	Id;
	Element;

	static get ACTION_SHOWMENU()  { return 'showmenu' }
	static get ACTION_SHOWHOME() { return 'showhome' }
	static get ACTION_APPLICATIONLOADED() { return 'applicationloaded' }

	constructor(id) {
		if (id!=undefined) {
			this.Id = id
			this.Element = document.getElementById(id)
		}
	}

	static CreateSvgButton(svg, classname, fn_click) {
		return Component_CreateSvgButton(svg, classname, fn_click)
	}

	static GenerateId() {
		return `comp-${++counter}`;
	}

	static Sleep(ms) {
 		return new Promise(resolve => setTimeout(resolve, ms))
	}
}


function Component_CreateSvgButton(svg, classname, fn_click) {
	const btn = document.createElement('a')
	btn.innerHTML = svg

	if (classname!='' && classname !=null) {
		btn.classList.add(classname)
	}
	
	btn.setAttribute('href', 'javascript:void(0)')

	if (typeof fn_click === 'function') {
		btn.addEventListener('click', (evt)=>{
			fn_click(evt)
		})
	}
	

	return btn
}
