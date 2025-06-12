import Component from "./Component.mjs"

export default class Button extends Component {
	constructor(id) {
		super(id)
		Construct(this, id)
	}

	#_disabled = false
	get Disabled() { return this.#_disabled }
	set Disabled(v) {
		this.#_disabled = v
		Button_setDisabled(this, v)
	}

	addEventListener(event, callback) {
		this.Element.addEventListener(event, callback)
	}

}

function Construct(self, id) {
	// console.log(`construct button ${id}`)
	self.Element.classList.add('fgta5-button')
	self.Element.setAttribute('type', 'button') // tambahkan attribut type=button untuk menghindari trigger button click saat tombol enter ditekan 
}

function Button_setDisabled(self, disabled) {
	self.Element.disabled = disabled
}