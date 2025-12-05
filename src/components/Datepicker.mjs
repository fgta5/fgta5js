import Input from "./Input.mjs"


const button_icon = `<svg transform="translate(0 3)" width="12" height="12" stroke="currentColor" stroke-linecap="round" version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<rect x="1.3095" y="6.6682" width="21.393" height="1.8579" fill="none" stroke-width="2"/>
		<rect x=".81949" y="10" width="22.341" height="13.251" fill="none" stroke-width="1.02"/>
		<rect x="3.8664" y="1.1531" width="2.5776" height="1.4923" fill="none" stroke-width="2"/>
		<rect x="17.223" y="1.1203" width="2.5776" height="1.6958" fill="none" stroke-width="2"/>
		<path d="m1.2888 16.278 21.367-0.13566" fill="none" stroke-width="1.02"/>
		<path d="m8.2775 10.07-0.13566 12.888" fill="none" stroke-width="1.02"/>
		<path d="m15.799 9.9671-0.13566 12.888" fill="none" stroke-width="1.02"/>
		</svg>`


/*
 * https://weblog.west-wind.com/posts/2023/Feb/06/A-Button-Only-Date-Picker-and-JavaScript-Date-Control-Binding
 */

const ChangeEvent = (data) => { return new CustomEvent('changed', data) }


export default class Datepicker extends Input {

	constructor(id) {
		super(id)
		dtp_construct(this, id)
	}

	get value() { return dtp_getValue(this) }
	set value(v) { dtp_setValue(this, v) }


	get min() { 
		if (this.Element.min!="") {
			var dt = new Date(this.Element.min );
			return dt
		} else {
			return null
		}
	}
	set min(v) {
		if (v instanceof Date) {
			this.Element.min = v.toISOString().split("T")[0]
		} else if (typeof v === "string") {
			this.Element.min = v
		}
	}

	get max() { 
		if (this.Element.max!="") {
			var dt = new Date(this.Element.max);
			return dt
		} else {
			return null
		}
	}
	set max(v) {
		if (v instanceof Date) {
			this.Element.max = v.toISOString().split("T")[0]
		} else if (typeof v === "string") {
			this.Element.max = v
		}
	}



	#suspended = false
	suspend(s) {
		if (s) {
			this.Element.disabled = true
			dtp_setDisabled(this, true)
		} 
		this.#suspended = s
	}

	isSuspended() {
		return this.#suspended
	}



	get disabled() { return this.Element.disabled }
	set disabled(disable) { 
		if (!disable && this.#suspended) {
			console.warn('suspended datepicker cannot be enabled!', this.Id)
			return
		}

		this.Element.disabled = disable
		dtp_setDisabled(this, disable)
	}


	#_ineditmode = true
	get InEditMode() { return this.#_ineditmode }
	setEditingMode(ineditmode) {
		this.#_ineditmode = ineditmode
		dtp_setEditingMode(this, ineditmode)
	}




	newData(initialvalue) {
		if (initialvalue===undefined || initialvalue===null) {
			initialvalue = ''
		}
		// super.newData(initialvalue)
		dtp_Newdata(this, initialvalue)
	}

	acceptChanges() {
		super.acceptChanges()
		dtp_acceptChanges(this)
		
	}

	reset() {
		super.reset()
		dtp_reset(this)
	}

	setError(msg) {
		super.setError(msg)
		dtp_setError(this, msg)
	}

	getLastValue() {
		return dtp_getLastValue(this)
	} 


	focus() {
		this.Nodes.Display.focus()
	}	
}

function dtp_construct(self, id) {
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
	container.setAttribute('fgta5-component', 'Datepicker')
	if (input.style.width!='') {
		container.style.width = input.style.width
	}
	if (input.style.marginTop!='') {
		container.style.marginTop = input.style.marginTop
		input.style.marginTop = ''
	}
	if (input.style.marginBottom!='') {
		container.style.marginBottom = input.style.marginBottom
		input.style.marginBottom=''
	}
	if (input.style.marginLeft!='') {
		container.style.marginLeft = input.style.marginLeft
		input.style.marginLeft=''
	}
	if (input.style.marginRight!='') {
		container.style.marginRight = input.style.marginRight
		input.style.marginRight=''
	}
		



	// setup wrapper
	wrapinput.classList.add('fgta5-entry-input-wrapper')



	// display
	display.setAttribute('id', `${id}-display`)
	display.setAttribute('type', 'text')
	display.setAttribute('fgta5-component', 'Datepicker')
	display.setAttribute('readonly', 'true')
	display.classList.add('fgta5-entry-display')
	display.classList.add('fgta5-entry-display-datepicker')
	var placeholder = input.getAttribute('placeholder')
	if (placeholder!=null && placeholder !='') {
		display.setAttribute('placeholder', placeholder)
	}
	// var cssclass = input.getAttribute('class')
	// if (cssclass!=null && cssclass !='') {
	// 	display.setAttribute('class', cssclass)
	// }
	// var cssstyle = input.getAttribute('style')
	// if (cssstyle!=null && cssstyle !='') {
	// 	display.setAttribute('style', cssstyle)
	// }

	const tabIndex = input.getAttribute('data-tabindex')
	if (tabIndex!=null) {
		display.setAttribute('tabindex', tabIndex)
	}

	// main input
	const nonFgtaClasses = Array.from(input.classList).filter(className =>
		!className.startsWith('fgta5-')
	);

	input.setAttribute('type', 'date')
	input.removeAttribute('class')
	input.removeAttribute('style')
	input.classList.add('fgta5-entry-input')
	input.classList.add('fgta5-entry-input-datepicker')
	input.getInputCaption = () => {
		if (label!=null) {
			return label.innerHTML
		} else {
			return input.getAttribute('placeholder')
		}
	}
	
	for (var classname of nonFgtaClasses) {
		// console.log(classname)
		input.classList.remove(classname)
		display.classList.remove(classname)
		container.classList.add(classname)
	}



	// picker button
	button.id = self.Id + '-button'
	button.insertAdjacentHTML("beforeend", button_icon)
	button.classList.add('fgta5-entry-button-datepicker')	


	// label
	if (label!=null) {
		label.setAttribute('for', button.id)
		label.classList.add('fgta5-entry-label')
	}


	const dis = input.getAttribute('disabled')
	if (dis!=null) {
		dtp_setDisabled(self, true)
	}


	// additional property setup

	// required
	const required = input.getAttribute('required')
	if (required != null) {
		self.markAsRequired(true)
	}

	if (input.value != null && input.value != '') {
		self.value = input.value
		self._setLastValue(input.value)
		self.acceptChanges()
	}

	
	// set input description
	self._setupDescription()



	// internal event
	input.addEventListener('change', (e)=>{
		dtp_changed(self)
	})


}



function dtp_setDisabled(self, v) {
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


function dtp_setEditingMode(self, ineditmode) {
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
		self.setError(null)
	}
}


function dtp_getValue(self) {
	if (self.Nodes.Input.value=='') {
		return null
	} else {
		return dtp_getIsoDateValue(self.Nodes.Input.value) 
	}
}


function dtp_setValue(self, dt) {
	try {

		if (dt!=null) {
			if (dt instanceof Date) {
				const isoformat = dt.toISOString()
				const isodate = isoformat.slice(0, 10)
				self.Nodes.Input.value = isodate
			} else {
				const isodate = dt.slice(0, 10)
				self.Nodes.Input.value = isodate
			}
		} else {
			self.Nodes.Input.value = null
		}
		

		dtp_setDisplay(self, dt)
		dtp_markChanged(self)
	} catch (err) {
		throw err
	}

}


function dtp_Newdata(self, initialvalue) {
	self.value = initialvalue
	self.acceptChanges()
}


function dtp_acceptChanges(self) {
	self.Nodes.Display.removeAttribute('changed')
}

function dtp_reset(self) {
	var lastvalue = self.getLastValue()
	if (lastvalue==null) {
		self.value = ''
	} else {
		self.value = lastvalue
	}
}

function dtp_changed(self) {
	var input = self.Nodes.Input
	dtp_setDisplay(self, input.value)

	// trigger object change
	try {
		self.Listener.dispatchEvent(ChangeEvent({
			sender: self,
			detail: {value:  input.value, sender: self}
		}))
	} catch (err) {
		console.error(err.message)
	}
	
	
	dtp_markChanged(self)
	if (self.InEditMode) {
		self.setError(null)
		self.validate()
	}
}


function dtp_getIsoDateValue(v) {
	var dt
	if (typeof v==='string') {
		dt = new Date(v)
	} else if (v instanceof Date) {
		dt = v
	} 
	return dt.toISOString().split("T")[0]
}

// function dtp_getFormattedValue(isodate) {
// 	var date = new Date(isodate);
//     var options = { day: '2-digit', month: 'short', year: 'numeric' };
// 	var formattedDate = date.toLocaleDateString('en-ID', options).replace('.', ''); 
// 	return formattedDate
// }


function dtp_markChanged(self) {
	if (self.Form==null) {
		return
	}

	var display = self.Nodes.Display
	if (self.value!=self.getLastValue()) {
		display.setAttribute('changed', 'true')
	} else {
		display.removeAttribute('changed')
	}
}

function dtp_setDisplay(self, dtiso) {
	var display = self.Nodes.Display
	if (dtiso=='') {
		display.value = ''
	} else {
		const date = new Date(dtiso);
		const options = { day: '2-digit', month: 'short', year: 'numeric' };
		const formattedDate = date.toLocaleDateString('en-ID', options).replace('.', ''); 
		display.value = formattedDate
	}
}


function dtp_setError(self, msg) {
	var display = self.Nodes.Display
	if (msg!== null && msg !== '') {
		display.setAttribute('invalid', 'true')
	} else {
		display.removeAttribute('invalid')
	}
}

function dtp_getLastValue(self) {
	var lastvalue = self.Nodes.LastValue.value
	if (lastvalue=='') {
		return null
	} else {
		return lastvalue
	}
}

