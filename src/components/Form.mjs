import Component from "./Component.mjs"
import Textbox from "./Textbox.mjs"
import Numberbox from "./Numberbox.mjs"
import Checkbox from "./Checkbox.mjs"
import Datepicker from "./Datepicker.mjs"
import Timepicker from "./Timepicker.mjs"
import Combobox from "./Combobox.mjs"
import Filebox from "./Filebox.mjs"


const formLockedEvent = new CustomEvent('locked')
const formUnLockedEvent = new CustomEvent('unlocked')


export default class Form extends Component {
	#_locked = false
	#_autoid = false
	#_primarykey

	Inputs = {}

	constructor(id) {
		super(id)

		this.#readAttributes()
		Construct(this, id)
	}


	get AutoID() { return this.#_autoid }
	get PrimaryKey() { return this.#_primarykey } 

	Lock(lock) { 
		this.#_locked = Form_Lock(this, lock) 
	}

	IsLocked() { 
		return this.#_locked
	}

	#isnew
	IsNew() {
		return this.#isnew
	}

	Reset() { 
		this.#isnew = false
		Form_Reset(this) 
	}

	AcceptChanges() { 
		this.#isnew = false
		Form_AcceptChanges(this) 
	}

	IsChanged() { return Form_IsChanged(this) }

	

	NewData(data) { 
		this.#isnew = true
		Form_NewData(this, data) 
	}

	Render() { Form_Render(this) }

	Validate() { return Form_Validate(this) }


	GetData() {
		return Form_GetData(this)
	}

	addEventListener(event, callback) {
		this.Element.addEventListener(event, callback)
	}

	#readAttributes() {
		var locked = this.Element.getAttribute('locked') 
		if (locked == null) {
			locked = 'false'
		}
		if (locked.toLowerCase() === 'true') {
			this.#_locked = true
		} else {
			this.#_locked = false
		}

		var autoid = this.Element.getAttribute('autoid')
		if (autoid!=null) {
			if (autoid.toLowerCase() === 'true') {
				this.#_autoid = true
			} else {
				this.#_autoid = false
			}
		} 
		


		var primarykey = this.Element.getAttribute('primarykey')
		this.#_primarykey = primarykey

	}

}


function Construct(self, id) {
	var formEl =  document.getElementById(id)

	self.Id = id
 	self.Element = formEl
	self.Inputs = {}

	self.Element.setAttribute('novalidate', '')
	self.Element.addEventListener('submit', (event) => {
		event.preventDefault();
	});



	// ambil semua input
	var inputs = formEl.querySelectorAll('input')
	for (var i = 0; i < inputs.length; i++) {
		var input = inputs[i]
		var fgtacomp = input.getAttribute('fgta5-component')
		if (fgtacomp==null || input.id==null || input.id=='') {
			continue
		}

		if (fgtacomp=='Textbox') {
			self.Inputs[input.id] = new Textbox(input.id)
		} else if (fgtacomp=='Numberbox') {
			self.Inputs[input.id] = new Numberbox(input.id)
		} else if (fgtacomp=='Datepicker') {
			self.Inputs[input.id] = new Datepicker(input.id)
		} else if (fgtacomp=='Timepicker') {
			self.Inputs[input.id] = new Timepicker(input.id)
		} else if (fgtacomp=='Combobox') {
			self.Inputs[input.id] = new Combobox(input.id)
		} else if  (fgtacomp=='Checkbox') {
			self.Inputs[input.id] = new Checkbox(input.id)
		} else if (fgtacomp=='Filebox') {
			self.Inputs[input.id] = new Filebox(input.id)
		}
	
	}
	
}


function Form_Render(self) {
	// render semua input
	for (var name in self.Inputs) {
		var obj = self.Inputs[name]
		obj.bindForm(self)
	}

	var locked = self.IsLocked() ? true : false
	if (locked) {
		Form_Lock(self, true)
	} else {
		Form_Lock(self, false)
	}

}

function Form_Lock(self, lock) {
	var formEl = self.Element
	var editmode = lock ? false : true
	for (var name in self.Inputs) {
		var obj = self.Inputs[name]
		obj.SetEditingMode(editmode)
	}

	if (lock) {
		formEl.dispatchEvent(formLockedEvent)
		formEl.setAttribute('locked', lock)
	} else {
		formEl.dispatchEvent(formUnLockedEvent)
		formEl.removeAttribute('locked')
	}
	return lock
}




function Form_AcceptChanges(self) {
	for (var name in self.Inputs) {
		var obj = self.Inputs[name]
		obj.AcceptChanges()
	}
}

function Form_Reset(self) {
	for (var name in self.Inputs) {
		var obj = self.Inputs[name]
		obj.Reset()
	}
}


function Form_NewData(self, data) {
	data = data!=null ? data : {} 

	for (var name in self.Inputs) {
		
		var obj = self.Inputs[name]
		var bindingdata = obj.GetBindingData()
		var initialvalue = data[bindingdata]

		if (obj instanceof Combobox) {
			var initialdata = (initialvalue!=null) ? initialvalue : {value:'',text:''}
			obj.NewData({
				value: initialdata.value,
				text: initialdata.text
			})
		} else if (obj instanceof Checkbox) { 
			obj.NewData(initialvalue)
		} else {
			obj.NewData(initialvalue)
		}
	}
}

function Form_IsChanged(self) {
	for (var name in self.Inputs) {
		var obj = self.Inputs[name]
		if (obj.IsChanged()) {
			return true
		}
	}
	return false
} 

function Form_Validate(self) {
	var isValid = true
	for (var name in self.Inputs) {
		var obj = self.Inputs[name]
		isValid &&= obj.Validate()
	}
	return isValid
}


function Form_GetData(self) {
	var data = {}
	for (var name in self.Inputs) {
		var obj = self.Inputs[name]
		var bindingdata = obj.GetBindingData()
		if (bindingdata) {
			data[bindingdata] = obj.Value
		}
	}
	return data
}