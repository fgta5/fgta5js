import Component from "./Component.mjs"

export default class Input extends Component {
	/* Construct Input */
	constructor(id) {
		super(id)
		input_construct(this, id)
		this._readValidators()
	}
	
	/* mengembalikan nama class contructor, misalnya 'Textbox' */
	get type() { return this.constructor.name }


	get value() { return this.Element.value }
	set value(v) { this.Element.value = v }

	get disabled() { return this.Element.disabled }
	set disabled(v) { this.Element.disabled = v }

	get placeholder() { return this.Element.getAttribute('placeholder') }
	set placeholder(v) { this.Element.setAttribute('placeholder', v) }

	#_form
	get Form() { return this.#_form }
	bindForm(form) { this.#_form = form }

	#_ineditmode = true
	get InEditMode() { return this.#_ineditmode }
	setEditingMode(ineditmode) { 
		this.#_ineditmode = ineditmode 
	}
	
	#invalidMessages = {}
	get InvalidMessages() { return this.#invalidMessages }
	_readValidators() {
		let input = this.Element
		var prefix = 'invalid-message'
		Array.from(input.attributes).forEach(attr => {
			if (attr.name.startsWith(prefix)) {
				var key = attr.name === prefix ? "default" : attr.name.replace(`${prefix}-`, "");
				this.#invalidMessages[key] = attr.value;
			}
		});
		input_readValidators(this)
	}


	newData(initialvalue) {
		input_newData(this, initialvalue)
	}

	acceptChanges() {
		input_acceptChanges(this)
	}
	
	reset() {
		input_reset(this)
	}
	
	isChanged() { 
		return input_isChanged(this)
	}

	#lasterror
	_setLastError(msg) {
		this.#lasterror = msg
	}	

	getLastError() {
		return this.#lasterror
	}

	setError(msg) {
		input_setError(this, msg)
	}

	_setLastValue(v) {
		input_setLastValue(this, v)
	}

	#lastvalue
	getLastValue() {
		return input_getLastValue(this)
	} 


	getBindingData() {
		var binding = this.Element.getAttribute('binding')
		if (binding === null) {
			return null
		} else {
			return binding
		}
	}

	validate() { 
		// console.log(`Validating input '${this.Id}'`)
		return input_validate(this) 
	}

	#_validators = {}
	get Validators() { return this.#_validators }
	addValidator(fnName, fnParams, message) {
		this.#_validators[fnName] = {
			param: fnParams,
			message: message
		}
	}
	removeValidator(str) {
		if (this.#_validators[str] !== undefined) {
			delete this.#_validators[str]
		}			
	}
	clearValidators() {
		this.#_validators = {}
	}
	readValidators() {
		input_readValidators(this)
	}


	_setupDescription() {
		var description = this.Element.getAttribute('description')
		if (description !== null && description.trim() !== '') {
			description = description.trim()
			const decrdiv = document.createElement('div')
			decrdiv.classList.add('fgta5-entry-description')
			decrdiv.innerHTML = description
			this.Nodes.Container.appendChild(decrdiv)
		}		
	}

	#isrequired = false
	isRequired() { return this.#isrequired}
	markAsRequired(r) {
		this.#isrequired = r
		input_markAsRequired(this, r)
	}


	addEventListener(evt, callback) {
		this.Listener.addEventListener(evt, callback)
	}


	#handlers = {}
	get Handlers() { return this.#handlers }
	handle(name, fn) {
		this.#handlers[name] = fn
	}


	getErrorValidation(fnName) {
		return input_getErrorValidation(this, fnName)
	}


}

function input_construct(self, id) {
	const container = document.createElement('div')
	const lastvalue = document.createElement('input')

	lastvalue.setAttribute('type', 'hidden') 
	lastvalue.classList.add('fgta5-entry-lastvalue')

	container.classList.add('fgta5-entry-container')

	self.InitialValue = '';

	self.Element.getInputCaption = () => {
		return self.Id;
	}

	self.Listener = new EventTarget()
	self.Nodes = {
		Input: self.Element,
		Container: container,
		LastValue: lastvalue,
	}


}


function input_setError(self, msg) {
	var errdiv = self.Nodes.Container.querySelector('.fgta5-entry-error')
	if (msg!== null && msg !== '') {
		self.Nodes.Input.setAttribute('invalid', 'true')
		if (!errdiv) {
			 errdiv = document.createElement('div')
			 errdiv.classList.add('fgta5-entry-error')
			 self.Nodes.Container.insertBefore(errdiv, self.Nodes.InputWrapper.nextSibling)
		}
		errdiv.innerHTML = msg
		self._setLastError(msg)
	} else {
		self.Nodes.Input.removeAttribute('invalid')
		if (errdiv) {
			errdiv.remove()
		}
		self._setLastError(null)
	}
}


function input_setLastValue(self, v) {
	self.Nodes.LastValue.value = v
}

function input_getLastValue(self) {
	return self.Nodes.LastValue.value
}

function input_newData(self, initialvalue) {
	self.value = initialvalue
	self.acceptChanges()
}

function input_acceptChanges(self) {
	self._setLastValue(self.Nodes.Input.value)
	self.Nodes.Input.removeAttribute('changed')
	self.setError(null)
}

function input_reset(self) {
	self.Nodes.Input.value = self.Nodes.LastValue.value
	self.acceptChanges()
}

function input_isChanged(self) {
	// bandingkan nilai last value dan input value
	// bandingkan langsung dari nilai yang ada di element, jangan gunakan self.getLastValue dan self.value
	// karena nilai dari properti self.value dan method getLastValue bisa di modif sesuai tipe component
	if (self.Nodes.LastValue.value != self.Nodes.Input.value) {
		console.log(`Input '${self.Id}' is changed from '${self.Nodes.LastValue.value}' to '${self.Nodes.Input.value}'`)
		return true
	} else {
		return false
	}
}


function input_getErrorValidation(self, fnName) {
	const validatorData = self.Validators[fnName]
	const fnValidate = $validators[fnName];
	const fnParams = validatorData.param;
	const fnMessage = validatorData.message;
	const input = self.Nodes.Input

	try {
		if (typeof fnValidate !== 'function') {
			var err = new Error(`Validator function '${fnName}' is not defined or not a function`)
			console.error(err);
			throw err
		}

		var valid = fnValidate(input.value, fnParams)
		if (!valid) {
			var defmsg = self.InvalidMessages['default']
			if (fnMessage!=null) {
				throw new Error(fnMessage)
			} else if (defmsg != null) {
				throw new Error(defmsg)
			} else {
				throw new Error( `Invalid value '${input.value}' for '${input.getInputCaption()}' using validator '${fnName}(${fnParams??''})'` )
			}
		}
		return null
	} catch(err) {
		return err
	}
}


function input_validate(self) {
	// prioritas untama untuk proses validasi adalah required
	// jalankan validasi required dulu,
	// baru kemudian loop validasi yang lain, tapi kemudian skip required karena telah dieksekusi

	const vnamereq = 'required'
	if (self.Validators[vnamereq]!=null) {
		var err = input_getErrorValidation(self, vnamereq) // prioritas utama untuk validasi
		if (err!=null) {
			self.setError(err.message)
			return false
		}
	}

	// lanjutkan untuk validasi berikutnya
	for (const fnName in self.Validators) {
		if (fnName==vnamereq) {
			continue
		}
		var err = input_getErrorValidation(self, fnName) 
		if (err!=null) {
			self.setError(err.message)
			return false
		}
	}

	self.setError(null)
	return true
}


function clearTime(dt) {
	dt.setHours(0)
	dt.setMinutes(0)
	dt.setSeconds(0)
}

function input_readValidators(self) {
	const cname = self.Nodes.Input.getAttribute('fgta5-component')
	var attrname = ''

	attrname = 'minlength'
	var minlength = self.Nodes.Input.getAttribute(attrname)
	if (minlength != null) {
		minlength = parseInt(minlength)
		if (!isNaN(minlength)) {
			self.addValidator(attrname, minlength, self.InvalidMessages[attrname])
		}
	}

	attrname = 'maxlength'
	var maxlength = self.Nodes.Input.getAttribute(attrname)
	if (maxlength != null) {
		maxlength = parseInt(maxlength)
		if (!isNaN(maxlength)) {
			self.addValidator(attrname, maxlength, self.InvalidMessages[attrname])
		}
	}

	attrname = 'pattern'
	var pattern = self.Nodes.Input.getAttribute(attrname)
	if (pattern != null) {
		if (pattern.trim() !== '') {
			self.addValidator('pattern', pattern, self.InvalidMessages[attrname])
		}
	}


	attrname = 'min'
	var min = self.Nodes.Input.getAttribute(attrname)
	if (min != null) {
		var msg = self.InvalidMessages[attrname]
		if (cname=="Datepicker") {
			var mindate = new Date(min)
			clearTime(mindate)
			self.addValidator('mindate', mindate, msg)
		} else if (cname=="Timepicker") {
			var mintime = min
			self.addValidator('mintime', mintime, msg)
		} else {
			min = parseInt(min)
			if (!isNaN(min)) {
				self.addValidator(attrname, min, msg)
			}
		}
	}

	attrname = 'max'
	var max = self.Nodes.Input.getAttribute(attrname)
	if (max != null) {
		var msg = self.InvalidMessages[attrname]
		if (cname=="Datepicker") {
			var maxdate = new Date(max)
			clearTime(maxdate)
			self.addValidator('maxdate', maxdate, msg)
		} else if (cname=="Timepicker") {
			var maxtime = max
			self.addValidator('maxtime', maxtime, msg)
		} else {
			max = parseInt(max)
			if (!isNaN(max)) {
				self.addValidator(attrname, max, msg)
			}
		}
	}


	var validator = self.Nodes.Input.getAttribute('validator')
	if (validator != null && validator.trim() !== '') {
		validator = validator.split(',')
		for (var i=0; i<validator.length; i++) {
			var str = validator[i].trim()
			var { fnName, fnParams } = $fgta5.Validators.parseFunctionParam(str)
			self.addValidator(fnName, fnParams, self.InvalidMessages[fnName])
		}
	}
}

function input_markAsRequired(self, required) {
	var attrname = 'required'
	var label = self.Nodes.Label;
	if (label!=null && label !=undefined) {
		if (required) {
			self.Nodes.Label.setAttribute(attrname, '')
			self.Nodes.Input.setAttribute(attrname, '')
			self.addValidator(attrname, null, self.InvalidMessages[attrname])
		} else {
			self.Nodes.Label.removeAttribute(attrname)
			self.Nodes.Input.removeAttribute(attrname)
			self.removeValidator(attrname)
		}
	}
}