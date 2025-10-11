
export default class ActionButton {
	
	#ids = []
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


		// setup button yang diasosiasikan untuk action ini		
		this.#elements.forEach(element => {

			// id
			const id = element.id
			this.#ids.push(id) 

			// disable tab
			element.setAttribute('tabindex', '-1')

			// handle default event click, yang berfungsi untuk mengamabkan tombol saat disable / hidden
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
			if (!disable && this.#suspended) {
				// jika suspended, tombol tidak bisa dinyalakan
				console.warn('suspended action button cannot be enabled!', this.#ids)
				return
			}

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


	click() {
		if (this.#disabled) {
			return
		}
		this.#elements[0].click()
	}


	#suspended = false
	suspend(s) {
		if (s) {
			this.disabled = true
		} 
		this.#suspended = s
	}

	isSuspended() {
		return this.#suspended
	}


}
