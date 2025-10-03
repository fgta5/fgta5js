
export default class ActionButton {
	
	#elements = []
	constructor(id, actionname=null) {
		this.Listener = new EventTarget()


		// pertama ambil element dengan id. 
		// Jika ada element pertama akan berisi element dengan id tersebut
		// berukutnya akan dicari element dengan data-action
		if (id!=null) {
			const el = document.getElementById(id)
			if (el!=null) {
				this.#elements.push(el)
			} 
		}
	
		if (actionname!=null) {
			const selector = (id==null) ? `[data-action="${actionname}"]` : `[data-action="${actionname}"]:not(#${id})`
			const elements = document.querySelectorAll(selector)
			this.#elements = [...this.#elements, ...Array.from(elements)]
		}


		
		// handle default event click, yang berfungsi untuk mengamabkan tombol saat disable / hidden
		this.#elements.forEach(element => {
			element.addEventListener('click', (evt)=>{
				if (this.#disabled || this.#hidden) {
					console.warn('action is not allowed!')
					evt.stopImmediatePropagation()
				}
			})
		})
	}

	#disabled = false
	get disabled() { return this.#disabled }
	set disabled(disable) {
		this.#disabled = disable
		this.#elements.forEach(element => {
			if (disable) {
				element.setAttribute('disabled', true)
			} else {
				element.removeAttribute('disabled')
			}
		})
	}

	#hidden = false
	isHidden() { return this.#hidden }
	hide(hidden=true) {
		this.#elements.forEach(element => {
			if (hidden) {
				element.classList.add('hidden')
			} else {
				element.classList.remove('hidden')
			}
		})
	}

	setText(text) {
		this.#elements.forEach(element => {
			element.innerHTML = text
		})
	}
	
	addEventListener(event, callback) {
		this.#elements.forEach(element => {
			element.addEventListener(event, callback)
		})		
	}
}
