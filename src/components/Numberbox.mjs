import Input from "./Input.mjs"


const ChangeEvent = (data)=>{ return new CustomEvent('changed', data) }


export default class Numberbox extends Input {

	constructor(id) {
		super(id)


		// default formatter angka
		// apabila akan diubah, lakukan di fungsi: nmb_formatValue(self, value)
		this.formatterFixed = new Intl.NumberFormat('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
			useGrouping: true // apakah akan di group per ribuan
		});

		nmb_construct(this, id)
	}

	get value() { return nmb_getValue(this) }
	set value(v) { nmb_setValue(this, v) }
		
		
	#suspended = false
	suspend(s) {
		if (s) {
			this.Element.disabled = true
			nmb_setDisabled(this, true)
		} 
		this.#suspended = s
	}

	isSuspended() {
		return this.#suspended
	}

	get disabled() { return this.Element.disabled }
	set disabled(disable) { 
		if (!disable && this.#suspended) {
			console.warn('suspended numberbox cannot be enabled!', this.Id)
			return
		}
		this.Element.disabled = disable
		nmb_setDisabled(this, disable)
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

	isChanged() { 
		return nmb_isChanged(this)
	}


	setError(msg) {
		super.setError(msg)
		nmb_setError(this, msg)
	}


	getLastValue() {
		return nmb_getLastValue(this)
	} 


	focus() {
		this.Nodes.Display.focus()
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
	const {precision, step} = getPrecission(self.Element.getAttribute('precision'))
	self.formatterFixed.minimumFractionDigits = precision
	self.formatterFixed.maximumFractionDigits = precision  // minimum dan maksimum jumlah angka di belakang koma di set sama




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
	display.setAttribute('autocomplete', 'off')
	

	const tabIndex = input.getAttribute('data-tabindex')
	if (tabIndex!=null) {
		display.setAttribute('tabindex', tabIndex)
	}

	const dis = input.getAttribute('disabled')
	if (dis!=null) {
		nmb_setDisabled(self, true)
	}

	const digitgrouping = input.getAttribute('digitgrouping') 
	if (digitgrouping!=null) {
		if (digitgrouping.toLowerCase()==='false') {
			self.formatterFixed.useGrouping=false
		} else {
			self.formatterFixed.useGrouping=true
		}
	}


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
	var formattedValue = nmb_formatValue(self, v)
	if (self.Nodes.Display.type === 'text') {
		self.Nodes.Display.value = formattedValue
	} else {
		self.Nodes.Display.value = v
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
		// console.log('numberbox: blurEvent')
		var num = Number(display.value)
		if (isNaN(num)) {
			self.Listener.dispatchEvent(ChangeEvent({detail: {invalid:true}}))
			self.setError('Invalid number')
		} else {
			self.setError(null)
			
			input.value = num
			var invalid = !self.validate()
			var formattedValue = nmb_formatValue(self, num)
			display.setAttribute('type', 'text')
			display.value = formattedValue

			self.Listener.dispatchEvent(ChangeEvent({detail: {invalid:invalid, value:num, formatted:formattedValue}}))
		}

	}
}


function nmb_formatValue(self, value) {
	const formatter = new Intl.NumberFormat('en-US', {
			minimumFractionDigits: self.formatterFixed.minimumFractionDigits,
			maximumFractionDigits: self.formatterFixed.minimumFractionDigits,
			useGrouping: self.formatterFixed.useGrouping
	});

	const formattedValue = formatter.format(value)
	return formattedValue
}

function nmb_acceptChanges(self) {
	self.Nodes.Display.removeAttribute('changed')
}

function nmb_Reset(self) {
	self.value = self.getLastValue()
}

function nmb_isChanged(self) {
	// bandingkan nilai last value dan input value
	const lastValue = Number(self.Nodes.LastValue.value.replace(/,/g, ""));
	const currentValue = Number(self.Nodes.Input.value.replace(/,/g, ""));


	if (currentValue != lastValue) {
		console.log(`Input '${self.Id}' is changed from '${lastValue}' to '${currentValue}'`)
		return true
	} else {
		return false
	}
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
