export default class {
	constructor(param) {
		this.#name = param.name
		this.#title = param.title
		this.#disabled = param.disabled
		this.#icon = param.icon
	}

	#name
	get name() { return this.#name }

	#title
	get title() { return this.#title }

	#disabled
	get disabled() { return this.#disabled===true ? true : false}

	#icon
	get icon() { return this.#icon==null ? 'images/iconprograms/www.png' : this.#icon }
}