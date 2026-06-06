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
 * referensi
 * https://weblog.west-wind.com/posts/2023/Feb/06/A-Button-Only-Date-Picker-and-JavaScript-Date-Control-Binding
 */

/* HTML Attribute
=================
- placeholder   : Teks placeholder bantuan saat input waktu masih kosong.
- data-tabindex : Mengatur urutan tab (tabindex) navigasi keyboard pada elemen display.
- disabled      : Menonaktifkan picker waktu agar tidak dapat diinteraksi.
- required      : Menandai bahwa input waktu ini wajib diisi saat validasi form.
- min           : Batas waktu minimum yang diperbolehkan (format: HH:MM).
- max           : Batas waktu maksimum yang diperbolehkan (format: HH:MM).
*/

/**
 * Kelas komponen Timepicker yang mewarisi kelas base Input.
 * Menyediakan dukungan input waktu berupa jam dan menit (HH:MM) menggunakan picker dialog kustom.
 * @extends Input
 */
export default class Timepicker extends Input {
	#_suspended = false
	#_ineditmode = true


	/**
	 * Membuat instance dari Timepicker.
	 * @param {string} id - ID dari elemen input.
	 */
	constructor(id) {
		super(id)
		tpck_construct(this, id)
	}

	/**
	 * Mendapatkan batas minimal waktu yang valid.
	 * @type {string}
	 */
	get min() { return this.Element.min }

	/**
	 * Mengatur batas minimal waktu yang valid.
	 * @param {string} v - Batas minimal waktu.
	 */
	set min(v) { this.Element.min = v }

	/**
	 * Mendapatkan batas maksimal waktu yang valid.
	 * @type {string}
	 */
	get max() { return this.Element.max }

	/**
	 * Mengatur batas maksimal waktu yang valid.
	 * @param {string} v - Batas maksimal waktu.
	 */
	set max(v) { this.Element.max = v }


	/**
	 * Mendapatkan nilai waktu saat ini (HH:MM).
	 * @type {string}
	 */
	get value() { return tpck_getValue(this) }

	/**
	 * Mengatur nilai waktu (HH:MM).
	 * @param {string} v - Nilai waktu baru.
	 */
	set value(v) { tpck_setValue(this, v) }



	/**
	 * Menghentikan sementara (suspend) atau mengaktifkan kembali interaksi input.
	 * @param {boolean} s - Status suspend yang diinginkan.
	 */
	suspend(s) {
		if (s) {
			this.Element.disabled = true
			tpck_setDisabled(this, true)
		}
		this.#_suspended = s
	}

	/**
	 * Memeriksa apakah timepicker dalam status suspended.
	 * @returns {boolean} True jika sedang suspended.
	 */
	isSuspended() {
		return this.#_suspended
	}


	/**
	 * Mengambil atau mengatur status disabled pada elemen.
	 * @type {boolean}
	 */
	get disabled() { return this.Element.disabled }
	set disabled(disable) {
		if (!disable && this.#_suspended) {
			console.warn('suspended timepicker cannot be enabled!', this.Id)
			return
		}
		this.Element.disabled = disable
		tpck_setDisabled(this, disable)
	}


	/**
	 * Mendapatkan status apakah timepicker sedang dalam mode edit.
	 * @type {boolean}
	 */
	get InEditMode() { return this.#_ineditmode }

	/**
	 * Mengatur mode edit pada timepicker.
	 * @param {boolean} ineditmode - True untuk mengaktifkan mode edit, false untuk menonaktifkan.
	 */
	setEditingMode(ineditmode) {
		this.#_ineditmode = ineditmode
		tpck_setEditingMode(this, ineditmode)
	}


	/**
	 * Mengatur atau mereset data baru untuk timepicker.
	 * @param {string} initialvalue - Nilai awal untuk timepicker.
	 */
	newData(initialvalue) {
		if (initialvalue == '' || initialvalue == null) {
			initialvalue = '00:00'
		}
		super.newData(initialvalue)
		// tpck_Newdata(this, initialvalue)
	}

	/**
	 * Menerima dan mengunci perubahan data saat ini.
	 */
	acceptChanges() {
		super.acceptChanges()
		tpck_acceptChanges(this)

	}

	/**
	 * Mereset nilai input ke nilai terakhir yang disimpan.
	 */
	reset() {
		super.reset()
		tpck_reset(this)
	}


	/**
	 * Menyetel pesan error pada komponen timepicker.
	 * @param {string} msg - Pesan error.
	 */
	setError(msg) {
		super.setError(msg)
		tpck_setError(this, msg)
	}

	/**
	 * Mendapatkan nilai waktu terakhir yang disimpan.
	 * @returns {string|null} Nilai terakhir.
	 */
	getLastValue() {
		return tpck_getLastValue(this)
	}

	/**
	 * Fokus ke elemen input display timepicker.
	 */
	focus() {
		this.Nodes.Display.focus()
	}
}




/**
 * Membangun dan menginisialisasi elemen komponen Timepicker.
 * @param {Object} self - Konteks objek `Timepicker`.
 * @param {string} id - ID dari elemen input.
 */
function tpck_construct(self, id) {
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
	if (placeholder != null && placeholder != '') {
		display.setAttribute('placeholder', placeholder)
	}
	var cssclass = input.getAttribute('class')
	if (cssclass != null && cssclass != '') {
		display.setAttribute('class', cssclass)
	}
	var cssstyle = input.getAttribute('style')
	if (cssstyle != null && cssstyle != '') {
		display.setAttribute('style', cssstyle)
	}

	const tabIndex = input.getAttribute('data-tabindex')
	if (tabIndex != null) {
		display.setAttribute('tabindex', tabIndex)
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
		self.markAsRequired(true)
	}

	if (input.value == null || input.value == '') {
		input.value = '00:00'
	}
	self.value = input.value
	self._setLastValue(input.value)
	self.acceptChanges()


	// set input description
	self._setupDescription()


	input.addEventListener('change', (e) => {
		tpck_changed(self)
	})
}


/**
 * Mengatur status disabled pada elemen display, inputwrapper, dan button.
 * @param {Object} self - Konteks objek `Timepicker`.
 * @param {boolean} v - True jika disabled.
 */
function tpck_setDisabled(self, v) {
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


/**
 * Mengatur elemen UI berdasarkan status mode edit.
 * @param {Object} self - Konteks objek `Timepicker`.
 * @param {boolean} ineditmode - True jika mode edit aktif.
 */
function tpck_setEditingMode(self, ineditmode) {
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


/**
 * Menghapus penanda perubahan dari tampilan display.
 * @param {Object} self - Konteks objek `Timepicker`.
 */
function tpck_acceptChanges(self) {
	self.Nodes.Display.removeAttribute('changed')
}

/**
 * Mereset nilai input ke nilai terakhir.
 * @param {Object} self - Konteks objek `Timepicker`.
 */
function tpck_reset(self) {
	var lastvalue = self.getLastValue()
	if (lastvalue == null) {
		self.value = ''
	} else {
		self.value = lastvalue
	}
}


/**
 * Menangani trigger perubahan internal dari elemen timepicker.
 * @param {Object} self - Konteks objek `Timepicker`.
 */
function tpck_changed(self) {
	var input = self.Nodes.Input
	tpck_setDisplay(self, input.value)

	tpck_markChanged(self)
	if (self.InEditMode) {
		self.setError(null)
		self.validate()
	}
}


/**
 * Menandai komponen apakah mengalami perubahan nilai.
 * @param {Object} self - Konteks objek `Timepicker`.
 */
function tpck_markChanged(self) {
	var display = self.Nodes.Display
	if (self.value != self.getLastValue()) {
		display.setAttribute('changed', 'true')
	} else {
		display.removeAttribute('changed')
	}
}



/**
 * Mendapatkan nilai waktu saat ini.
 * @param {Object} self - Konteks objek `Timepicker`.
 * @returns {string|null} Nilai waktu.
 */
function tpck_getValue(self) {
	var input = self.Nodes.Input
	if (input.value == '') {
		return null
	} else {
		return input.value
	}
}



/**
 * Mengatur nilai waktu pada timepicker.
 * @param {Object} self - Konteks objek `Timepicker`.
 * @param {string} dt - String format waktu HH:MM.
 */
function tpck_setValue(self, dt) {
	if (!timeRegex.test(dt)) {
		throw new Error(`invalid HH:ss format for '${dt}'`)
	}

	self.Nodes.Input.value = dt
	tpck_setDisplay(self, dt)
	tpck_markChanged(self)
}


/**
 * Menyetel nilai waktu pada elemen display.
 * @param {Object} self - Konteks objek `Timepicker`.
 * @param {string} tm - Nilai waktu.
 */
function tpck_setDisplay(self, tm) {
	self.Nodes.Display.value = tm
}

/**
 * Menyetel tampilan atribut error.
 * @param {Object} self - Konteks objek `Timepicker`.
 * @param {string} msg - Pesan error.
 */
function tpck_setError(self, msg) {
	var display = self.Nodes.Display
	if (msg !== null && msg !== '') {
		display.setAttribute('invalid', 'true')
	} else {
		display.removeAttribute('invalid')
	}
}


/**
 * Mendapatkan nilai waktu terakhir yang disimpan.
 * @param {Object} self - Konteks objek `Timepicker`.
 * @returns {string|null} Nilai terakhir.
 */
function tpck_getLastValue(self) {
	var lastvalue = self.Nodes.LastValue.value
	if (lastvalue == '') {
		return null
	} else {
		return lastvalue
	}
}
