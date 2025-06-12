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
export default class Datepicker extends Input {

	constructor(id) {
		super(id)
		Datepicker_construct(this, id)
	}

	get Value() { return Datepicker_getValue(this) }
	set Value(v) { Datepicker_setValue(this, v) }


	get Min() { 
		if (this.Element.min!="") {
			var dt = new Date(this.Element.min );
			return dt
		} else {
			return null
		}
	}
	set Min(v) {
		if (v instanceof Date) {
			this.Element.min = v.toISOString().split("T")[0]
		} else if (typeof v === "string") {
			this.Element.min = v
		}
	}

	get Max() { 
		if (this.Element.max!="") {
			var dt = new Date(this.Element.max);
			return dt
		} else {
			return null
		}
	}
	set Max(v) {
		if (v instanceof Date) {
			this.Element.max = v.toISOString().split("T")[0]
		} else if (typeof v === "string") {
			this.Element.max = v
		}
	}


	get Disabled() { return this.Element.disabled }
	set Disabled(v) { 
		this.Element.disabled = v 
		Datepicker_setDisabled(this, v)
	}


	#_ineditmode = true
	get InEditMode() { return this.#_ineditmode }
	SetEditingMode(ineditmode) {
		this.#_ineditmode = ineditmode
		Datepicker_SetEditingMode(this, ineditmode)
	}




	NewData(initialvalue) {
		if (initialvalue===undefined || initialvalue===null) {
			initialvalue = ''
		}
		super.NewData(initialvalue)
		// Datepicker_Newdata(this, initialvalue)
	}

	AcceptChanges() {
		super.AcceptChanges()
		Datepicker_AcceptChanges(this)
		
	}

	Reset() {
		super.Reset()
		Datepicker_Reset(this)
	}

	SetError(msg) {
		super.SetError(msg)
		Datepicker_SetError(this, msg)
	}

	GetLastValue() {
		return Datepicker_GetLastValue(this)
	} 

}

function Datepicker_construct(self, id) {
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
	var cssclass = input.getAttribute('class')
	if (cssclass!=null && cssclass !='') {
		display.setAttribute('class', cssclass)
	}
	var cssstyle = input.getAttribute('style')
	if (cssstyle!=null && cssstyle !='') {
		display.setAttribute('style', cssstyle)
	}


	// main input
	input.setAttribute('type', 'date')
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

	// required
	var required = input.getAttribute('required')
	if (required != null) {
		self.MarkAsRequired(true)
	}

	if (input.value != null && input.value != '') {
		self.Value = input.value
		self._setLastValue(input.value)
		self.AcceptChanges()
	}

	
	// set input description
	self._setupDescription()



	// internal event
	input.addEventListener('change', (e)=>{
		Datepicker_changed(self)
	})


}



function Datepicker_setDisabled(self, v) {
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


function Datepicker_SetEditingMode(self, ineditmode) {
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


function Datepicker_getValue(self) {
	if (self.Nodes.Input.value=='') {
		return null
	} else {
		return Datepicker_getIsoDateValue(self.Nodes.Input.value) 
	}
}


function Datepicker_setValue(self, dt) {
	self.Nodes.Input.value = dt
	Datepicker_setDisplay(self, dt)
	Datepicker_markChanged(self)
}


// function Datepicker_Newdata(self, initialvalue) {
// 	self.AcceptChanges()
// }


function Datepicker_AcceptChanges(self) {
	self.Nodes.Display.removeAttribute('changed')
}

function Datepicker_Reset(self) {
	var lastvalue = self.GetLastValue()
	if (lastvalue==null) {
		self.Value = ''
	} else {
		self.Value = lastvalue
	}
}

function Datepicker_changed(self) {
	var input = self.Nodes.Input
	Datepicker_setDisplay(self, input.value)
	
	Datepicker_markChanged(self)
	if (self.InEditMode) {
		self.SetError(null)
		self.Validate()
	}

	// trigger object change
}


function Datepicker_getIsoDateValue(v) {
	var dt
	if (typeof v==='string') {
		dt = new Date(v)
	} else if (v instanceof Date) {
		dt = v
	} 
	return dt.toISOString().split("T")[0]
}

// function Datepicker_getFormattedValue(isodate) {
// 	var date = new Date(isodate);
//     var options = { day: '2-digit', month: 'short', year: 'numeric' };
// 	var formattedDate = date.toLocaleDateString('en-ID', options).replace('.', ''); 
// 	return formattedDate
// }


function Datepicker_markChanged(self) {
	var display = self.Nodes.Display
	if (self.Value!=self.GetLastValue()) {
		display.setAttribute('changed', 'true')
	} else {
		display.removeAttribute('changed')
	}
}

function Datepicker_setDisplay(self, dtiso) {
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


function Datepicker_SetError(self, msg) {
	var display = self.Nodes.Display
	if (msg!== null && msg !== '') {
		display.setAttribute('invalid', 'true')
	} else {
		display.removeAttribute('invalid')
	}
}

function Datepicker_GetLastValue(self) {
	var lastvalue = self.Nodes.LastValue.value
	if (lastvalue=='') {
		return null
	} else {
		return lastvalue
	}
}

