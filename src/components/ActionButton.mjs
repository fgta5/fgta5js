
export default class ActionButton {
	constructor(name) {
		this.Listener = new EventTarget()

		// ambil semua element dengan name
		const elements = document.getElementsByName(name)
		this.#elements = elements
		
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

	#disabled
	get disabled() { return this.#disabled }
	set disabled(disable) {
		this.#elements.forEach(element => {
			if (disable) {
				element.setAttribute('disabled', true)
			} else {
				element.removeAttribute('disabled')
			}
		})
	}

	#hidden = true
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


	#elements = []
	addEventListener(event, callback) {
		this.#elements.forEach(element => {
			element.addEventListener(event, callback)
		})		
	}
}
