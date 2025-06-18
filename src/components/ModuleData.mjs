const ICON_DEFAULT = `<svg version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
<g fill="currentColor">
<path d="m20.019 2c-2.9332 0-5.2348 2.3057-5.2348 5.2389v3.1417h-8.3806c-2.3047 0-4.1903 1.8856-4.1903 4.1903v7.9628h3.1417c3.1427 0 5.6567 2.514 5.6567 5.6567 0 3.1427-2.514 5.6567-5.6567 5.6567h-3.3547v7.9628c0 2.3047 1.8856 4.1903 4.1903 4.1903h7.9628v-3.1458c0-3.1427 2.514-5.6567 5.6567-5.6567 3.1427 0 5.6567 2.514 5.6567 5.6567v3.1458h7.9628c2.3047 0 4.1903-1.8856 4.1903-4.1903v-8.3806h3.1417c2.9332 0 5.2389-2.3057 5.2389-5.2389 0-2.9332-2.3057-5.2389-5.2389-5.2389h-3.1417v-8.3806c0-2.3047-1.8856-4.1903-4.1903-4.1903h-8.3806v-3.1417c0.20951-2.9332-2.0968-5.2389-5.03-5.2389z"/>
</g>
</svg>`



export default class {
	constructor(param) {
		this.#name = param.name
		this.#title = param.title
		this.#disabled = param.disabled
		this.#icon = param.icon
		this.#url = param.url
	}

	static get ICON_DEFAULT() { return ICON_DEFAULT }

	#name
	get name() { return this.#name }

	#title
	get title() { return this.#title }

	#disabled
	get disabled() { return this.#disabled===true ? true : false}

	#icon
	get icon() { return this.#icon }

	#url 
	get url() { return this.#url }
}