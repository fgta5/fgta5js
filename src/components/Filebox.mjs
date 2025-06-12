import Input from "./Input.mjs"


const button_icon = `<?xml version="1.0" encoding="UTF-8"?>
<svg transform="translate(0 3)" width="12" height="12" stroke="currentColor" version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="m3.0207 17.447v3.9708h18.328v-3.9708" fill="none" stroke-linecap="square" stroke-width="4"/>
<path d="m18.595 8.3606-6.4542-4.0017-6.3622 4.0017m6.3622-1.8991v7.1708" fill="none" stroke-linecap="square" stroke-width="4"/>
</svg>
`


export default class Filebox extends Input {
	constructor(id) {
		super(id)
		Filebox_construct(this, id)
	}


	get Value() { 
		if (this.Element.files.length===0) {
			return ''
		} else {
			return this.Element.files[0].name
		}
	}
	


	get Disabled() { return this.Element.disabled }
	set Disabled(v) { 
		this.Element.disabled = v 
		Filebox_setDisabled(this, v)
	}

	#_ineditmode = true
	get InEditMode() { return this.#_ineditmode }
	SetEditingMode(ineditmode) {
		this.#_ineditmode = ineditmode
		Filebox_SetEditingMode(this, ineditmode)
	}

	NewData() {
		Filebox_NewData(this)
	}

	AcceptChanges() {
		Filebox_AcceptChanges(this)
	}

	Reset() {
		Filebox_Reset(this)
	}

	IsChanged() { 
		return Filebox_IsChanged(this)
	}

	SetError(msg) {
		super.SetError(msg)
		Filebox_SetError(this, msg)
	}



}

function Filebox_construct(self, id) {
	const container = self.Nodes.Container
	const lastvalue = self.Nodes.LastValue
	const input = self.Nodes.Input
	const wrapinput = document.createElement('div')
	const display = document.createElement('input')
	const button = document.createElement('button')
	const label = document.querySelector(`label[for="${id}"]`)

	// setup container, (harus di awal seblum yang lain-lain)
	// diperlukan untuk menampung semua element yang akan ditampilkan
	input.parentNode.insertBefore(container, input)
	


	// tambahkan elemen-element ke container
	// penambahakn container ke body document pada saat Input_construct di parent class Input
	wrapinput.appendChild(display)
	wrapinput.appendChild(button)
	button.appendChild(input)
	container.appendChild(wrapinput)
	container.appendChild(lastvalue)


	// tambahkan referensi elemen ke Nodes
	self.Nodes.InputWrapper = wrapinput
	self.Nodes.Label = label 
	self.Nodes.Display = display
	self.Nodes.Button = button


	// setup container
	container.setAttribute('fgta5-component', 'Filebox')


	// setup wrapper
	wrapinput.classList.add('fgta5-entry-input-wrapper')


	// display
	display.setAttribute('id', `${id}-display`)
	display.setAttribute('type', 'text')
	display.setAttribute('picker', 'file')
	display.setAttribute('fgta5-component', 'Filebox')
	display.setAttribute('readonly', 'true')
	display.classList.add('fgta5-entry-display')
	display.classList.add('fgta5-entry-display-filebox')
	var placeholder = input.getAttribute('placeholder')
	if (placeholder!=null && placeholder !='') {
		display.setAttribute('placeholder', placeholder)
	}
	var cssclass = input.getAttribute('class')
	if (cssclass!=null && cssclass !='') {
		display.setAttribute('class', cssclass)
	}
	var cssstyle = input.getAttribute('style')
	if (cssstyle!=null && cssstyle !='') {
		display.setAttribute('style', cssstyle)
	}


		// main input
	input.setAttribute('type', 'file')
	input.setAttribute('picker', 'file')
	input.removeAttribute('class')
	input.removeAttribute('style')
	input.classList.add('fgta5-entry-input')
	input.classList.add('fgta5-entry-input-filebox')
	input.getInputCaption = () => {
		return label.innerHTML
	}

	
	// picker button
	button.id = self.Id + '-button'
	button.insertAdjacentHTML("beforeend", button_icon)
	button.classList.add('fgta5-entry-button-filebox')	

	// label
	label.setAttribute('for', button.id)
	label.classList.add('fgta5-entry-label')




	// additional property setup

	// required field
	var required = input.getAttribute('required')
	if (required != null) {
		self.MarkAsRequired(true)
	}

	self._setLastValue(input.value)
	self.AcceptChanges()


	// set input description
	self._setupDescription()


	input.addEventListener('change', (e)=>{
		Filebox_changed(self)
	})


}


function Filebox_setDisabled(self, v) {
	var display = self.Nodes.Display
	var button = self.Nodes.Button
	if (v) {
		display.disabled = true
		button.disabled = true
	} else {
		display.disabled = false
		button.disabled = false
	}
}


function Filebox_SetEditingMode(self, ineditmode) {
	var display = self.Nodes.Display
	var input = self.Nodes.Input
	var attrval = ineditmode ? 'true' : 'false'

	display.setAttribute('editmode', attrval)
	input.setAttribute('editmode', attrval)
	self.Nodes.InputWrapper.setAttribute('editmode', attrval)

	if (ineditmode) {
		input.disabled = false
	} else {
		input.disabled = true
		self.SetError(null)
	}
}


function Filebox_changed(self) {
	var input = self.Nodes.Input

	if (input.files.length === 0) {
		return
	}

	self.Nodes.Display.value = input.files[0].name
	Filebox_markChanged(self)
	if (self.InEditMode) {
		self.SetError(null)
		self.Validate()
	}
}

function Filebox_markChanged(self) {
	var display = self.Nodes.Display
	if (self.Value!=self.GetLastValue()) {
		display.setAttribute('changed', 'true')
	} else {
		display.removeAttribute('changed')
	}
}



function Filebox_SetError(self, msg) {
	var display = self.Nodes.Display
	if (msg!== null && msg !== '') {
		display.setAttribute('invalid', 'true')
	} else {
		display.removeAttribute('invalid')
	}
}

function Filebox_NewData(self) {
	self.Nodes.Input.value = ''
	self.Nodes.Display.value = ''
	self.AcceptChanges()
}


function Filebox_Reset(self) {
	// let newFileInput = self.Nodes.Input.cloneNode();
	// newFileInput.addEventListener('change', (e)=>{
	// 	Filebox_changed(self)
	// })
	
	// self.Nodes.Input.replaceWith(newFileInput)
	// self.Nodes.Input = newFileInput
	self.Nodes.Input.value = ''
	
	var lastvalue = self.GetLastValue()
	self.Nodes.Display.value = lastvalue
	self.AcceptChanges()
}

function Filebox_AcceptChanges(self) {
	var display = self.Nodes.Display
	var input = self.Nodes.Input
	var currentvalue = ''
	if (input.files.length>0) {
		currentvalue = input.files[0].name
	}
	
	self._setLastValue(currentvalue)
	input.removeAttribute('changed')
	display.removeAttribute('changed')
	self.SetError(null)
}


function Filebox_IsChanged(self) {
	var lastvalue = self.Nodes.LastValue.value
	var currentvalue = self.Value
	if (currentvalue!=lastvalue) {
		console.log(`Input '${self.Id}' is changed from '${lastvalue}' to '${currentvalue}'`)
		return true
	} else {
		return false
	}
}