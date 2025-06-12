import Input from "./Input.mjs"

const InputEvent = (data)=>{ return new CustomEvent('input', data) }
const BlurEvent = (data)=>{ return new CustomEvent('blur', data) }
const KeydownEvent = (data)=> { return new KeyboardEvent('keydown', data) }




export default class Textbox extends Input {

	constructor(id) {
		super(id)
		Textbox_construct(this, id)
	}

	get Value() { return Textbox_GetValue(this) }
	set Value(v) { Textbox_SetValue(this, v) }


	#_ineditmode = true
	get InEditMode() { return this.#_ineditmode }
	SetEditingMode(ineditmode) {
		this.#_ineditmode = ineditmode
		Textbox_SetEditingMode(this, ineditmode)
	}

	NewData(initialvalue) {
		super.NewData(initialvalue)
	}

	GetLastValue() {
		return Textbox_GetLastValue(this)
	} 

	IsChanged() { 
		return Textbox_IsChanged(this)
	}


}



function Textbox_construct(self, id) {
	const container = self.Nodes.Container
	const lastvalue = self.Nodes.LastValue
	const input = self.Nodes.Input
	const wrapinput = document.createElement('div')
	const label = document.querySelector(`label[for="${id}"]`)
	

	// setup container, (harus di awal seblum yang lain-lain)
	// diperlukan untuk menampung semua element yang akan ditampilkan
	input.parentNode.insertBefore(container, input)


	// tambahkan elemen-element ke container
	// penambahakn container ke body document pada saat Input_construct di parent class Input
	wrapinput.appendChild(input)
	container.appendChild(wrapinput)
	container.appendChild(lastvalue)


	// tambahkan referensi elemen ke Nodes
	self.Nodes.InputWrapper = wrapinput
	self.Nodes.Label = label 


	// setup container
	container.setAttribute('fgta5-component', 'Textbox')
	

	// setup wrapper
	wrapinput.classList.add('fgta5-entry-input-wrapper')


	// setup input
	input.classList.add('fgta5-entry-input')
	input.getInputCaption = () => {
		return label.innerHTML
	}

	// label
	label.classList.add('fgta5-entry-label')

	// set input value
	self._setLastValue(self.Value)

	// set input description
	self._setupDescription()

	
	// aditional property setup
	// background
	if (input.style.backgroundColor !== '') {
		wrapinput.style.backgroundColor = input.style.backgroundColor
		input.style.backgroundColor = 'transparent'
	}

	// character casing
	var charCase = input.getAttribute('character-case') 
	if (charCase !== null && charCase.trim() !== '') {
		input.charCase = charCase.trim().toLowerCase()
	}

	// required field
	var required = input.getAttribute('required')
	if (required != null) {
		self.MarkAsRequired(true)
	}


	// internal event listener
	input.addEventListener("input", (evt)=>{
		if (self.GetLastValue() != self.Value) {
			input.setAttribute('changed', 'true')
		} else {
			input.removeAttribute('changed')
		}

		self.Listener.dispatchEvent(InputEvent({}))
	})

	input.addEventListener('blur', (evt)=> {
		Textbox_blur(self, evt)
		self.Listener.dispatchEvent(BlurEvent({}))
	})	

	input.addEventListener('keydown', (evt)=>{
		const e = KeydownEvent({
			cancelable: true,
			key: evt.key,
			code: evt.code,
			ctrlKey: evt.ctrlKey,
			altKey: evt.altKey,
			shiftKey: evt.shiftKey,
			srcElement: evt.srcElement,
			target: evt.target
		})
		self.Listener.dispatchEvent(e)

		if (e.defaultPrevented) {
			evt.preventDefault()
		}
	})
	
}

function Textbox_getValueCased(self, v) {
	var value = v
	var input = self.Nodes.Input
	if (input.charCase === 'uppercase') {
		value = v.toUpperCase()
	} else if (input.charCase === 'lowercase') {
		value = v.toLowerCase()
	}
	return value
}


function Textbox_GetValue(self) {
	var input = self.Nodes.Input
	var value = Textbox_getValueCased(self, input.value)
	return value
}

function Textbox_SetValue(self, v) {
	if (v===null || v===undefined) {
		v=''
	}
	self.Element.value = Textbox_getValueCased(self, v)
}



function Textbox_IsChanged(self) {
	var lastvalue = self.GetLastValue()
	var currentvalue = self.Value
	if (currentvalue!=lastvalue) {
		console.log(`Textbox '${self.Id}' is changed from '${lastvalue}' to '${currentvalue}'`)
		return true
	} else {
		return false
	}
}

function Textbox_GetLastValue(self) {
	var lastvalue = self.Nodes.LastValue.value
	return Textbox_getValueCased(self, lastvalue)
}

function Textbox_SetEditingMode(self, ineditmode) {
	var attrval = ineditmode ? 'true' : 'false'
	self.Nodes.Input.setAttribute('editmode', attrval)
	self.Nodes.InputWrapper.setAttribute('editmode', attrval)

	if (ineditmode) {
		self.Nodes.Input.removeAttribute('readonly')
	} else {
		self.Nodes.Input.setAttribute('readonly', 'true')
		self.SetError(null)
	}
}


function Textbox_blur(self, e) {
	if (self.InEditMode) {
		self.SetError(null)
		self.Validate()
	}
}

