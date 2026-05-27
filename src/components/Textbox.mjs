import Input from "./Input.mjs"

const InputEvent = (data) => { return new CustomEvent('input', data) }
const BlurEvent = (data) => { return new CustomEvent('blur', data) }
const KeydownEvent = (data) => { return new KeyboardEvent('keydown', data) }


/**
 * Kelas komponen Textbox yang mewarisi kelas base Input.
 * Menyediakan dukungan untuk elemen input teks satu baris (single-line) dan multi-baris (multiline), pengaturan huruf (casing), serta event kustom.
 */
export default class Textbox extends Input {

	/**
	 * Membuat instance dari Textbox.
	 * @param {string} id - ID dari elemen input.
	 */
	constructor(id) {
		super(id)
		txt_construct(this, id)
	}

	/**
	 * Mendapatkan nilai saat ini dari textbox.
	 * @type {string}
	 */
	get value() { return txt_GetValue(this) }

	/**
	 * Mengatur nilai dari textbox.
	 * @param {string} v - Nilai yang akan diatur.
	 */
	set value(v) { txt_SetValue(this, v) }


	#_ineditmode = true

	/**
	 * Mendapatkan status apakah textbox sedang dalam mode edit.
	 * @type {boolean}
	 */
	get InEditMode() { return this.#_ineditmode }

	/**
	 * Mengatur mode edit pada textbox.
	 * @param {boolean} ineditmode - True untuk mengaktifkan mode edit, false untuk menonaktifkan.
	 */
	setEditingMode(ineditmode) {
		this.#_ineditmode = ineditmode
		txt_setEditingMode(this, ineditmode)
	}

	/**
	 * Mengatur atau mereset data baru untuk textbox.
	 * @param {string} initialvalue - Nilai awal untuk textbox.
	 */
	newData(initialvalue) {
		super.newData(initialvalue)
	}

	/**
	 * Mendapatkan nilai terakhir yang disimpan di textbox.
	 * @returns {string} Nilai terakhir yang disimpan.
	 */
	getLastValue() {
		return txt_getLastValue(this)
	}

	/**
	 * Memeriksa apakah nilai saat ini telah berubah dari nilai terakhir yang disimpan.
	 * @returns {boolean} True jika nilai telah berubah, jika tidak false.
	 */
	isChanged() {
		return txt_isChanged(this)
	}

	/**
	 * Fokus ke elemen input textbox.
	 */
	focus() {
		this.Nodes.Input.focus()
	}

}



/**
 * Membangun dan menginisialisasi elemen komponen Textbox.
 * @param {string} id - ID dari elemen input.
 */
function txt_construct(self, id) {
	const container = self.Nodes.Container
	const lastvalue = self.Nodes.LastValue
	// const input = self.Nodes.Input
	const wrapinput = document.createElement('div')
	const label = document.querySelector(`label[for="${id}"]`)
	let input

	const mtl = self.Nodes.Input.getAttribute('multiline')
	if (mtl != null) {
		console.log('textbox is multiline')
		input = document.createElement('textarea')
		for (const attr of self.Nodes.Input.attributes) {
			// skip atribut yang tidak cocok untuk textarea (opsional)
			if (attr.name === "type") continue;
			input.setAttribute(attr.name, attr.value);
		}
		input.value = self.Nodes.Input.value
		self.Nodes.Input.replaceWith(input);
		self.Nodes.Input = input
		self.Element = input
	} else {
		input = self.Nodes.Input
	}


	// setup container, (harus di awal seblum yang lain-lain)
	// diperlukan untuk menampung semua element yang akan ditampilkan
	input.parentNode.insertBefore(container, input)


	// tambahkan elemen-element ke container
	// penambahakn container ke body document pada saat Input_construct di parent class Input
	wrapinput.appendChild(input)
	container.appendChild(wrapinput)
	container.appendChild(lastvalue)


	// tambahkan referensi elemen ke Nodes
	self.Nodes.InputWrapper = wrapinput
	self.Nodes.Label = label


	// setup container
	container.setAttribute('fgta5-component', 'Textbox')
	container.setAttribute('input-id', id)
	if (input.style.width != '') {
		container.style.width = input.style.width
	}
	if (input.style.marginTop != '') {
		container.style.marginTop = input.style.marginTop
		input.style.marginTop = ''
	}
	if (input.style.marginBottom != '') {
		container.style.marginBottom = input.style.marginBottom
		input.style.marginBottom = ''
	}
	if (input.style.marginLeft != '') {
		container.style.marginLeft = input.style.marginLeft
		input.style.marginLeft = ''
	}
	if (input.style.marginRight != '') {
		container.style.marginRight = input.style.marginRight
		input.style.marginRight = ''
	}



	// setup wrapper
	wrapinput.classList.add('fgta5-entry-input-wrapper')


	// setup input
	input.classList.add('fgta5-entry-input')
	input.getInputCaption = () => {
		if (label != null) {
			return label.innerHTML
		} else {
			return input.getAttribute('placeholder')
		}
	}
	const nonFgtaClasses = Array.from(input.classList).filter(className =>
		!className.startsWith('fgta5-')
	);
	for (var classname of nonFgtaClasses) {
		input.classList.remove(classname)
		container.classList.add(classname)
	}

	const tabIndex = input.getAttribute('data-tabindex')
	if (tabIndex != null) {
		input.setAttribute('tabindex', tabIndex)
	}


	// label
	if (label != null) {
		label.classList.add('fgta5-entry-label')
	}



	// set input value
	self._setLastValue(self.value)

	// set input description
	self._setupDescription()


	// aditional property setup
	// background
	if (input.style.backgroundColor !== '') {
		wrapinput.style.backgroundColor = input.style.backgroundColor
		input.style.backgroundColor = 'transparent'
	}

	// character casing
	var charCase = input.getAttribute('character-case')
	if (charCase !== null && charCase.trim() !== '') {
		input.charCase = charCase.trim().toLowerCase()
	}

	// required field
	var required = input.getAttribute('required')
	if (required != null) {
		self.markAsRequired(true)
	}


	// internal event listener
	input.addEventListener("input", (evt) => {
		self.Listener.dispatchEvent(InputEvent({}))

		// jika tidak ada form, tidak ada perubahan change notifications
		if (self.Form == null) {
			return
		}

		if (self.getLastValue() != self.value) {
			input.setAttribute('changed', 'true')
		} else {
			input.removeAttribute('changed')
		}
	})

	input.addEventListener('blur', (evt) => {
		txt_blur(self, evt)
		self.Listener.dispatchEvent(BlurEvent({}))
	})

	input.addEventListener('keydown', (evt) => {
		const e = KeydownEvent({
			cancelable: true,
			key: evt.key,
			code: evt.code,
			ctrlKey: evt.ctrlKey,
			altKey: evt.altKey,
			shiftKey: evt.shiftKey,
			srcElement: evt.srcElement,
			target: evt.target
		})
		self.Listener.dispatchEvent(e)

		if (e.defaultPrevented) {
			evt.preventDefault()
		}
	})

}

/**
 * Mendapatkan nilai string dengan format huruf (casing) yang telah disesuaikan.
 * @param {string} v - Nilai mentah.
 * @returns {string} Nilai dengan format huruf yang disesuaikan.
 */
function txt_getValueCased(self, v) {
	var value = v
	var input = self.Nodes.Input
	if (input.charCase === 'uppercase') {
		value = v.toUpperCase()
	} else if (input.charCase === 'lowercase') {
		value = v.toLowerCase()
	}
	return value
}


/**
 * Mendapatkan nilai saat ini dari textbox.
 * @returns {string} Nilai dengan format huruf yang disesuaikan.
 */
function txt_GetValue(self) {
	var input = self.Nodes.Input
	var value = txt_getValueCased(self, input.value)
	return value
}

/**
 * Mengatur nilai dari textbox.
 * @param {string} v - Nilai yang akan diatur.
 */
function txt_SetValue(self, v) {
	if (v === null || v === undefined) {
		v = ''
	}
	self.Element.value = txt_getValueCased(self, v)
}



/**
 * Memeriksa apakah nilai saat ini berbeda dari nilai terakhir yang disimpan.
 * @returns {boolean} True jika berubah, jika tidak false.
 */
function txt_isChanged(self) {
	var lastvalue = self.getLastValue()
	var currentvalue = self.value
	if (currentvalue != lastvalue) {
		console.log(`Textbox '${self.Id}' is changed from '${lastvalue}' to '${currentvalue}'`)
		return true
	} else {
		return false
	}
}

/**
 * Mendapatkan nilai terakhir yang disimpan dari textbox.
 * @returns {string} Nilai terakhir yang disimpan.
 */
function txt_getLastValue(self) {
	var lastvalue = self.Nodes.LastValue.value
	return txt_getValueCased(self, lastvalue)
}

/**
 * Memperbarui elemen UI berdasarkan status mode edit.
 * @param {boolean} ineditmode - True untuk mengaktifkan mode edit, false untuk menonaktifkan.
 */
function txt_setEditingMode(self, ineditmode) {
	var attrval = ineditmode ? 'true' : 'false'
	self.Nodes.Input.setAttribute('editmode', attrval)
	self.Nodes.InputWrapper.setAttribute('editmode', attrval)

	if (ineditmode) {
		self.Nodes.Input.removeAttribute('readonly')
	} else {
		self.Nodes.Input.setAttribute('readonly', 'true')
		self.setError(null)
	}
}


/**
 * Menangani event blur untuk elemen input.
 * @param {FocusEvent} e - Event fokus.
 */
function txt_blur(self, e) {
	if (self.InEditMode) {
		self.setError(null)
		self.validate()
	}
}
