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
		frm_construct(this, id)
	}


	get AutoID() { return this.#_autoid }
	get PrimaryKey() { return this.#_primarykey } 

	lock(lock) { 
		this.#_locked = frm_lock(this, lock) 
	}

	isLocked() { 
		return this.#_locked
	}

	#isnew
	isNew() {
		return this.#isnew
	}

	setAsNewData() {
		this.#isnew = true
	}

	reset() { 
		this.#isnew = false
		frm_Reset(this) 
	}

	acceptChanges() { 
		this.#isnew = false
		frm_acceptChanges(this) 
	}

	isChanged() { return frm_isChanged(this) }

	
	#lastError
	_setLastError(msg) {
		this.#lastError = msg
	}

	getLastError() {
		return this.#lastError
	}


	newData(data) { 
		this.#isnew = true
		frm_newData(this, data) 
	}

	render() { frm_render(this) }

	validate() { return frm_validate(this) }


	getData() {
		return frm_getData(this)
	}

	getDataChanged() {
		var changedOnly = true
		return frm_getData(this, changedOnly)
	}

	setData(data) {
		frm_setData(this, data)
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


function frm_construct(self, id) {
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


function frm_render(self) {
	// render semua input
	for (var name in self.Inputs) {
		var obj = self.Inputs[name]
		obj.bindForm(self)
	}

	var locked = self.isLocked() ? true : false
	if (locked) {
		frm_lock(self, true)
	} else {
		frm_lock(self, false)
	}

}

function frm_lock(self, lock=true) {
	var formEl = self.Element
	var editmode = lock ? false : true
	for (var name in self.Inputs) {
		var obj = self.Inputs[name]
		obj.setEditingMode(editmode)
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




function frm_acceptChanges(self) {
	for (var name in self.Inputs) {
		var obj = self.Inputs[name]
		obj.acceptChanges()
	}
}

function frm_Reset(self) {
	for (var name in self.Inputs) {
		var obj = self.Inputs[name]
		obj.reset()
	}
}

function frm_setData(self, data) {
	for (var name in self.Inputs) {
		var obj = self.Inputs[name];
		var bindingdata = obj.getBindingData();
		var value = data[bindingdata]
		if (obj instanceof Combobox) {
			var displayname = obj.getDisplayBinding()
			if (displayname!=null) {
				obj.setSelected(value, data[displayname])
			} else {
				obj.setSelected(value, value)
			}
		} else {
			obj.value = value
		}
	}
	frm_acceptChanges(self)
}


function frm_newData(self, data) {
	data = data!=null ? data : {} 

	for (var name in self.Inputs) {
		
		var obj = self.Inputs[name]
		var bindingdata = obj.getBindingData()
		var initialvalue = data[bindingdata]

		if (obj instanceof Combobox) {
			var initialdata = (initialvalue!=null) ? initialvalue : {value:'',text:''}
			obj.newData({
				value: initialdata.value,
				text: initialdata.text
			})
		} else if (obj instanceof Checkbox) { 
			obj.newData(initialvalue)
		} else {
			obj.newData(initialvalue)
		}
	}
}

function frm_isChanged(self) {
	for (var name in self.Inputs) {
		var obj = self.Inputs[name]
		if (obj.isChanged()) {
			return true
		}
	}
	return false
} 

function frm_validate(self) {
	var isValid = true
	for (var name in self.Inputs) {
		var obj = self.Inputs[name]
		isValid &&= obj.validate()

		if (!isValid) {
			var lastError = obj.getLastError()
			self._setLastError(lastError)
			return false
		}
	}

	self._setLastError(null)
	return true
}


function frm_getData(self, changedOnly=false) {
	var primarykey = self.PrimaryKey
	var obj_pk = self.Inputs[primarykey]
	var pkBinding = obj_pk.getBindingData()


	var data = {}
	for (var name in self.Inputs) {
		var obj = self.Inputs[name]
		var currBinding = obj.getBindingData()

		if (changedOnly) {
			// jika ambil data hanya yang berubah
			// data primary key harus selalu diambil
			if (currBinding!=pkBinding) {
				// jika bukan primary key, cek apakah berubah
				if (!obj.isChanged()) {
					// jika tidak ada perubahan, skip
					continue
				}
			}
		}

		var bindingdata = obj.getBindingData()
		if (bindingdata) {
			data[bindingdata] = obj.value
		}
	}
	return data
}