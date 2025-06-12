import Input from "./Input.mjs"

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const button_icon = `<?xml version="1.0" encoding="UTF-8"?>
<svg transform="translate(0 3)" width="12" height="12" stroke="currentColor" stroke-linecap="round" version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="m12.339 12.142 0.01403-6.5322" fill="none" stroke-width="2"/>
<path d="m8.4232 14.469 3.7103-1.9861" fill="none" stroke-width="2.4"/>
<ellipse cx="12.004" cy="11.983" rx="10.102" ry="9.9964" fill="none" stroke-width="2.4"/>
</svg>

`


/*
 * https://weblog.west-wind.com/posts/2023/Feb/06/A-Button-Only-Date-Picker-and-JavaScript-Date-Control-Binding
 */
export default class Timepicker extends Input {
	constructor(id) {
		super(id)
		Timepicker_construct(this, id)
	}

	get Min() { return this.Element.min }
	set Min(v) { this.Element.min = v }

	get Max() { return this.Element.max }
	set Max(v) { this.Element.max = v }


	get Value() { return Timepicker_getValue(this) }
	set Value(v) { Timepicker_setValue(this, v) }

	get Disabled() { return this.Element.disabled }
	set Disabled(v) { 
		this.Element.disabled = v 
		Timepicker_setDisabled(this, v)
	}

	#_ineditmode = true
	get InEditMode() { return this.#_ineditmode }
	SetEditingMode(ineditmode) {
		this.#_ineditmode = ineditmode
		Timepicker_SetEditingMode(this, ineditmode)
	}

	
	NewData(initialvalue) {
		if (initialvalue=='' || initialvalue==null) {
			initialvalue = '00:00'
		}
		super.NewData(initialvalue)
		// Timepicker_Newdata(this, initialvalue)
	}

	AcceptChanges() {
		super.AcceptChanges()
		Timepicker_AcceptChanges(this)
		
	}

	Reset() {
		super.Reset()
		Timepicker_Reset(this)
	}
	

	SetError(msg) {
		super.SetError(msg)
		Timepicker_SetError(this, msg)
	}

	GetLastValue() {
		return Timepicker_GetLastValue(this)
	} 

}




function Timepicker_construct(self, id) {
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
	container.setAttribute('fgta5-component', 'Timepicker')


	// setup wrapper
	wrapinput.classList.add('fgta5-entry-input-wrapper')


	// display
	display.setAttribute('id', `${id}-display`)
	display.setAttribute('type', 'text')
	display.setAttribute('picker', 'time')
	display.setAttribute('fgta5-component', 'Timepicker')
	display.setAttribute('readonly', 'true')
	display.classList.add('fgta5-entry-display')
	display.classList.add('fgta5-entry-display-datepicker')
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
	input.setAttribute('type', 'time')
	input.setAttribute('picker', 'time')
	input.removeAttribute('class')
	input.removeAttribute('style')
	input.classList.add('fgta5-entry-input')
	input.classList.add('fgta5-entry-input-datepicker')
	input.getInputCaption = () => {
		return label.innerHTML
	}

	
	// picker button
	button.id = self.Id + '-button'
	button.insertAdjacentHTML("beforeend", button_icon)
	button.classList.add('fgta5-entry-button-datepicker')	


	// label
	label.setAttribute('for', button.id)
	label.classList.add('fgta5-entry-label')




	// additional property setup

	// required field
	var required = input.getAttribute('required')
	if (required != null) {
		self.MarkAsRequired(true)
	}

	if (input.value == null || input.value == '') {
		input.value = '00:00'
	}
	self.Value = input.value
	self._setLastValue(input.value)
	self.AcceptChanges()


	// set input description
	self._setupDescription()


	input.addEventListener('change', (e)=>{
		Timepicker_changed(self)
	})
}


function Timepicker_setDisabled(self, v) {
	var display = self.Nodes.Display
	var inputwrap = self.Nodes.InputWrapper
	var button = self.Nodes.Button

	if (v) {
		display.disabled = true
		inputwrap.setAttribute('disabled', 'true')
		button.setAttribute('disabled', 'true')
	} else {
		display.disabled = false
		inputwrap.removeAttribute('disabled')
		button.removeAttribute('disabled')
	}
}


function Timepicker_SetEditingMode(self, ineditmode) {
	var attrval = ineditmode ? 'true' : 'false'
	var input = self.Nodes.Input
	var display = self.Nodes.Display
	var inputwrap = self.Nodes.InputWrapper

	display.setAttribute('editmode', attrval)
	input.setAttribute('editmode', attrval)
	inputwrap.setAttribute('editmode', attrval)

	if (ineditmode) {
		input.removeAttribute('readonly')
	} else {
		input.setAttribute('readonly', 'true')
		self.SetError(null)
	}
}


function Timepicker_AcceptChanges(self) {
	self.Nodes.Display.removeAttribute('changed')
}

function Timepicker_Reset(self) {
	var lastvalue = self.GetLastValue()
	if (lastvalue==null) {
		self.Value = ''
	} else {
		self.Value = lastvalue
	}
}


function Timepicker_changed(self) {
	var input = self.Nodes.Input
	Timepicker_setDisplay(self, input.value)
	
	Timepicker_markChanged(self)
	if (self.InEditMode) {
		self.SetError(null)
		self.Validate()
	}
}


function Timepicker_markChanged(self) {
	var display = self.Nodes.Display
	if (self.Value!=self.GetLastValue()) {
		display.setAttribute('changed', 'true')
	} else {
		display.removeAttribute('changed')
	}
}



function Timepicker_getValue(self) {
	var input = self.Nodes.Input
	if (input.value=='') {
		return null
	} else {
		return input.value
	}
}



function Timepicker_setValue(self, dt) {
    if (!timeRegex.test(dt)) {
		throw new Error(`invalid HH:ss format for '${dt}'`)
	}

	self.Nodes.Input.value = dt
	Timepicker_setDisplay(self, dt)
	Timepicker_markChanged(self)
}


function Timepicker_setDisplay(self, tm) {
	self.Nodes.Display.value = tm
}

function Timepicker_SetError(self, msg) {
	var display = self.Nodes.Display
	if (msg!== null && msg !== '') {
		display.setAttribute('invalid', 'true')
	} else {
		display.removeAttribute('invalid')
	}
}


function Timepicker_GetLastValue(self) {
	var lastvalue = self.Nodes.LastValue.value
	if (lastvalue=='') {
		return null
	} else {
		return lastvalue
	}
}
