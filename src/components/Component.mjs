let counter = 0;


export default class Component {
	Id;
	Element;

	static get ACTION_SHOWMENU()  { return 'showmenu' }
	static get ACTION_SHOWHOME() { return 'showhome' }
	static get ACTION_APPLICATIONLOADED() { return 'applicationloaded' }

	constructor(id) {
		if (id==undefined) {
			console.error('id component belum didefinisikan')
		}

		const el =  document.getElementById(id)
		if (el==null) {
			console.error(`element dengan id: '$id' tidak ditemukan di halaman`)
		}

		this.Id = id
		this.Element = el
	}

	static createSvgButton(svg, classname, fn_click) {
		return comp_createSvgButton(svg, classname, fn_click)
	}

	static generateId() {
		return `comp-${++counter}`;
	}

	static sleep(ms) {
 		return new Promise(resolve => setTimeout(resolve, ms))
	}


	static isMobileDevice() {
		return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|Opera Mini|IEMobile/i.test(navigator.userAgent);
	}
}


function comp_createSvgButton(svg, classname, fn_click) {
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
