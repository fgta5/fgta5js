import Input from "./Input.mjs"


const CheckedEvent = (data)=>{ return new CustomEvent('checked', data) }
const UnCheckedEvent = (data)=>{ return new CustomEvent('unchecked', data) }

/*
* reference:
* https://moderncss.dev/pure-css-custom-checkbox-style/
*/


export default class Checkbox extends Input {

	constructor(id) {
		super(id)
		chk_construct(this, id)
	}

	get value() { return chk_getValue(this) }
	set value(v) {
		chk_setValue(this, v)
	}


	get disabled() { return chk_getDisabled(this) }
	set disabled(v) { 
		this.Element.disabled = v 
		chk_setDisabled(this, v)
	}


	#_ineditmode = true
	get InEditMode() { return this.#_ineditmode }
	setEditingMode(ineditmode) {
		this.#_ineditmode = ineditmode
		chk_setEditingMode(this, ineditmode)
	}

	newData(initialvalue) {
		super.newData(initialvalue)
		chk_NewData(this, initialvalue)
	}

	getLastValue() {
		return chk_getLastValue(this)
	} 

	isChanged() { 
		return chk_isChanged(this)
	}

	reset() {
		chk_Reset(this)
	}

	_setLastValue(v) {
		chk_setLastValue(this, v)
	}
}



function chk_construct(self, id) {
	const container = self.Nodes.Container
	const lastvalue = self.Nodes.LastValue
	const input = self.Nodes.Input
	const label = document.querySelector(`label[for="${id}"]`)
	const checkboxlabel = document.createElement("label")


	// setup container, (harus di awal seblum yang lain-lain)
	// diperlukan untuk menampung semua element yang akan ditampilkan
	input.parentNode.insertBefore(container, input)




	// tambahkan elemen-element ke container
	// penambahakn container ke body document pada saat Input_construct di parent class Input
	checkboxlabel.appendChild(input)
	checkboxlabel.appendChild(document.createTextNode(label.innerHTML))
	container.appendChild(checkboxlabel)
	container.appendChild(lastvalue)


	// tambahkan referensi elemen ke Nodes
	self.Nodes.Label = label 
	
	
	// setup container
	container.setAttribute('fgta5-component', 'Checkbox')

	// setup input
	input.classList.add('fgta5-checkbox-input')
	
	// setup checkbox label untuk menampung checkbox
	checkboxlabel.classList.add('fgta5-checkbox')
	
	
	// ganti original label tag menjadi div 
	// karena label di form harus mereferensi ke input
	// sedangkan label di checkbox kita fungsikan sebagai text pada checkbox untuk di klik
	var replLabel = document.createElement('div')
	replLabel.innerHTML = "&nbsp";
	replLabel.style.display = "inline-block"
	replLabel.setAttribute('label', '')
	label.parentNode.replaceChild(replLabel, label);


	// inisialisasi last value
	self._setLastValue(self.Element.checked)




	const dis = input.getAttribute('disabled')
	if (dis!=null) {
		chk_setDisabled(self, true)
	}

	// tambahkan event listener internal
	input.addEventListener('change', (event) => {
		chk_checkedChanged(self)		
	});

}

function chk_getDisabled(self) {
	var disabled = self.Nodes.Input.getAttribute('permanent-disabled')
	if (disabled === null) {
		return false
	}
	if (disabled === 'true') {
		return true
	}

	return false
}

function chk_setDisabled(self, v) {
	var input = self.Nodes.Input

	var editmode = input.getAttribute('editmode')
	var ineditmode = ((editmode==null || editmode=='' || editmode=='false')) ? false : true

	if (v) {
		input.setAttribute('permanent-disabled', 'true')
		input.parentNode.setAttribute('permanent-disabled', 'true')
	} else {
		input.removeAttribute('permanent-disabled')
		input.parentNode.removeAttribute('permanent-disabled')
		if (!ineditmode) {
			input.disabled = true	
		}
	}
}


function chk_setEditingMode(self, ineditmode) {
	var input = self.Nodes.Input
	var attrval = ineditmode ? 'true' : 'false'
	var permdisattr = input.getAttribute('permanent-disabled')
	var permanentDisabled = ((permdisattr==null || permdisattr=='' || permdisattr=='false')) ? false : true

	input.setAttribute('editmode', attrval)
	if (ineditmode) {
		if (permanentDisabled) {
			input.setAttribute('disabled', 'true')
		} else {
			input.removeAttribute('disabled')
		}
	} else {
		input.setAttribute('disabled', 'true')
	}
}

function chk_setLastValue(self, v) {
	var lastvalue = 1
	if (v==='off' || v==='0' || v===0 || v===false) {
		lastvalue = 0
	}
	self.Nodes.LastValue.value = lastvalue
}


function chk_checkedChanged(self) {
	var input = self.Nodes.Input
	input.value = input.checked ? 1 : 0
	if (self.getLastValue() != self.value) {
		input.setAttribute('changed', 'true')
	} else {
		input.removeAttribute('changed')
	}

	if (input.checked) {
		self.Listener.dispatchEvent(CheckedEvent({}))
	} else {
		self.Listener.dispatchEvent(UnCheckedEvent({}))
	}
}


function chk_isChanged(self) {
	var lastvalue = self.getLastValue()
	var currentvalue = self.value
	if (currentvalue!=lastvalue) {
		// console.log(`Checkbox '${self.Id}' is changed from '${lastvalue}' to '${currentvalue}'`)
		return true
	} else {
		return false
	}
}



function chk_getBoolValue(v) {
	if (v===0||v==='0'||v===false||v===undefined) {
		return false
	} else {
		return true
	}
}



function chk_getValue(self) {
	return self.Element.checked
}

function chk_setValue(self, v) {
	var input = self.Nodes.Input
	var checked = chk_getBoolValue(v)
	input.checked = checked
	if (checked) {
		input.value = 1
	} else {
		input.value = 0
	}

	chk_markChanged(self)
}

function chk_getLastValue(self) {
	var lastvalue = self.Nodes.LastValue.value
	return chk_getBoolValue(lastvalue)
}

function chk_Reset(self) {
	var checked = self.getLastValue()
	self.value = checked
	self._setLastValue(checked)
}


function chk_NewData(self, initialvalue) {
	var checked = chk_getBoolValue(initialvalue)
	self.value = checked
	self._setLastValue(checked)
}

function chk_markChanged(self) {
	var input = self.Nodes.Input
	if (self.value!=self.getLastValue()) {
		input.setAttribute('changed', 'true')
	} else {
		input.removeAttribute('changed')
	}
}