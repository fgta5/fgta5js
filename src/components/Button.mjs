import Component from "./Component.mjs"

export default class Button extends Component {
	constructor(id) {
		super(id)
		btn_construct(this, id)
	}

	#_disabled = false
	get disabled() { return this.#_disabled }
	set disabled(v) {
		this.#_disabled = v
		btn_setDisabled(this, v)
	}

	addEventListener(event, callback) {
		this.Element.addEventListener(event, callback)
	}

	click() {
		this.Element.click()
	}

}

function btn_construct(self, id) {
	// console.log(`construct button ${id}`)
	self.Element.classList.add('fgta5-button')
	self.Element.setAttribute('type', 'button') // tambahkan attribut type=button untuk menghindari trigger button click saat tombol enter ditekan 
}

function btn_setDisabled(self, disabled) {
	self.Element.disabled = disabled
}