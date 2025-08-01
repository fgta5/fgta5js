import Input from "./Input.mjs"


const ChangeEvent = (data)=>{ return new CustomEvent('change', data) }


export default class Numberbox extends Input {

	constructor(id) {
		super(id)

		this.formatterFixed = new Intl.NumberFormat('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		});

		nmb_construct(this, id)
	}

	get value() { return nmb_getValue(this) }
	set value(v) { nmb_setValue(this, v) }
		
		


	get disabled() { return this.Element.disabled }
	set disabled(v) { 
		this.Element.disabled = v 
		nmb_setDisabled(this, v)
	}

	#_ineditmode = true
	get InEditMode() { return this.#_ineditmode }
	setEditingMode(ineditmode) {
		this.#_ineditmode = ineditmode
		nmb_setEditingMode(this, ineditmode)
	}


	newData(initialvalue) {
		if (initialvalue===undefined || initialvalue===null) {
			initialvalue = 0
		}
		super.newData(initialvalue)
	}


	acceptChanges() {
		super.acceptChanges()
		nmb_acceptChanges(this)
		
	}

	reset() {
		super.reset()
		nmb_Reset(this)
	}

	setError(msg) {
		super.setError(msg)
		nmb_setError(this, msg)
	}


	getLastValue() {
		return nmb_getLastValue(this)
	} 

}



function nmb_construct(self, id) {
	const container = self.Nodes.Container
	const lastvalue = self.Nodes.LastValue
	const input = self.Nodes.Input
	const wrapinput = document.createElement('div')
	const display = document.createElement('input')
	const label = document.querySelector(`label[for="${id}"]`)


	// setup container, (harus di awal seblum yang lain-lain)
	// diperlukan untuk menampung semua element yang akan ditampilkan
	input.parentNode.insertBefore(container, input)


	// tambahkan elemen-element ke container
	// penambahakn container ke body document pada saat Input_construct di parent class Input
	wrapinput.appendChild(display)
	wrapinput.appendChild(input)
	container.appendChild(wrapinput)
	container.appendChild(lastvalue)


	// tambahkan referensi elemen ke Nodes
	self.Nodes.InputWrapper = wrapinput
	self.Nodes.Label = label 
	self.Nodes.Display = display


	// setup container
	container.setAttribute('fgta5-component', 'Numberbox')


	// setup wrapper
	wrapinput.classList.add('fgta5-entry-input-wrapper')
	
	
	// precission and step
	var {precision, step} = getPrecission(self.Element.getAttribute('precision'))
	self.formatterFixed.minimumFractionDigits = precision
	self.formatterFixed.maximumFractionDigits = precision

	// setup input
	input.classList.add('fgta5-entry-input')
	input.maxlength = input.getAttribute('maxlength') 
	input.precision = precision
	input.setAttribute('type', 'hidden')
	input.setAttribute('step', step)
	input.getInputCaption = () => { return label.innerHTML }
	

	// setup display
	display.id = self.Id + '-display'
	display.min = input.min
	display.max = input.max
	display.maxlength = input.maxlength
	display.required = input.required
	display.value = self.formatterFixed.format(input.value)
	display.classList.add('fgta5-entry-display')
	display.setAttribute('precision', precision)
	display.setAttribute('step', step)
	display.setAttribute('style', input.getAttribute('style') || '')
	display.setAttribute('type', 'text')
	display.setAttribute('fgta5-component', 'Numberbox')

	
	// label
	label.setAttribute('for', display.id)
	label.classList.add('fgta5-entry-label')


	// additional property setup
	var required = input.getAttribute('required')
	if (required != null) {
		self.markAsRequired(true)
	}


	if (input.value === null || input.value === '') {
		input.value = 0
	}

	self._setLastValue(input.value)
	self._setupDescription()


	// internal event listener
	display.addEventListener('focus', (e)=>{
		nmb_displayFocus(self, e)
	})

	display.addEventListener('blur', (e)=>{
		nmb_displayBlur(self, e)
	})

	display.addEventListener("input", (e)=>{
		if (display.value !== lastvalue.value) {
			display.setAttribute('changed', 'true')
		} else {
			display.removeAttribute('changed')
		}
	})

	display.addEventListener("keydown", (e)=>{
		if (display.type === "number" && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
        	e.preventDefault();
    	}
	})


	// batasi panjang entri data sesuai maxlength yang di set
	var maxlegth = display.maxlength
	if (maxlegth !== null && maxlegth.trim() !== '') {
		maxlegth = parseInt(maxlegth.trim())
		if (!isNaN(maxlegth) && maxlegth > 0) {
			display.addEventListener('beforeinput', (e)=>{
				if (e.target.value.length >= maxlegth && e.inputType !== "deleteContentBackward" && e.inputType !== "deleteContentForward") {
					e.preventDefault()
				}
			})
		}
	}

}


function getPrecission(precision) {
	// var precision = self.Element.getAttribute('precision')
	if (precision !== null && precision.trim() !== '') {
		precision = parseInt(precision.trim())
		if (isNaN(precision) || precision < 0) {
			precision = 0
		}
	} else {
		precision = 0
	}
	var step = Math.pow(10, -precision);

	return {
		precision: precision,
		step: step
	}
}


function nmb_getValue(self) {
	var num = Number(self.Nodes.Input.value)
	return num
}


function nmb_setValue(self, v) {
	self.Nodes.Input.value = v

	if (isNaN(v)) {
		v = Number(v) // v buka Angka, ubah dulu ke angka
	}
	var formattedValue = self.formatterFixed.format(v)
	if (self.Nodes.Display.type === 'text') {
		self.Nodes.Display.value = formattedValue
	} else {
		self.Nodes.Display.value = num
	}

	nmb_markChanged(self)
}


function nmb_setDisabled(self, v) {
	if (v) {
		self.Nodes.Display.disabled = true
	} else {
		self.Nodes.Display.disabled = false
	}
}

function nmb_setEditingMode(self, ineditmode) {
	var attrval = ineditmode ? 'true' : 'false'

	self.Nodes.Display.setAttribute('editmode', attrval)
	self.Nodes.Input.setAttribute('editmode', attrval)
	self.Nodes.InputWrapper.setAttribute('editmode', attrval)

	if (ineditmode) {
		self.Nodes.Input.removeAttribute('readonly')
		self.Nodes.Display.removeAttribute('readonly')
	} else {
		self.Nodes.Input.setAttribute('readonly', 'true')
		self.Nodes.Display.setAttribute('readonly', 'true')
		self.setError(null)
	}
}

function nmb_displayFocus(self, e) {
	var display = self.Nodes.Display
	var input = self.Nodes.Input
	
	if (self.InEditMode) {
		display.setAttribute('type', 'number')
	
		var num = Number(input.value)
		display.value = num
	}
}

function nmb_displayBlur(self, e) {
	var display = self.Nodes.Display
	var input = self.Nodes.Input
	
	if (self.InEditMode) {
		var num = Number(display.value)
		if (isNaN(num)) {
			self.Listener.dispatchEvent(ChangeEvent({detail: {invalid:true}}))
			self.setError('Invalid number')
		} else {
			self.setError(null)
			
			input.value = num
			var invalid = !self.validate()
			var formattedValue = self.formatterFixed.format(num)
			display.setAttribute('type', 'text')
			display.value = formattedValue

			self.Listener.dispatchEvent(ChangeEvent({detail: {invalid:invalid, value:num, formatted:formattedValue}}))
		}

	}
}


function nmb_acceptChanges(self) {
	self.Nodes.Display.removeAttribute('changed')
}

function nmb_Reset(self) {
	self.value = self.getLastValue()
}

function nmb_setError(self, msg) {
	var display = self.Nodes.Display
	if (msg!== null && msg !== '') {
		display.setAttribute('invalid', 'true')
	} else {
		display.removeAttribute('invalid')
	}
}


function nmb_markChanged(self) {
	var input = self.Nodes.Input
	var display = self.Nodes.Display
	
	if (self.value!=self.getLastValue()) {
		input.setAttribute('changed', 'true')
		display.setAttribute('changed', 'true')
	} else {
		input.removeAttribute('changed')
		display.removeAttribute('changed')
	}
}

function nmb_getLastValue(self) {
	var lastvalue = Number(self.Nodes.LastValue.value)
	return lastvalue
}
