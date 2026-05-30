import Input from "./Input.mjs"


const button_icon = `<?xml version="1.0" encoding="UTF-8"?>
<svg transform="translate(0 3)" width="12" height="12" stroke="currentColor" version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="m3.0207 17.447v3.9708h18.328v-3.9708" fill="none" stroke-linecap="square" stroke-width="4"/>
<path d="m18.595 8.3606-6.4542-4.0017-6.3622 4.0017m6.3622-1.8991v7.1708" fill="none" stroke-linecap="square" stroke-width="4"/>
</svg>
`


/**
 * Kelas komponen Filebox yang mewarisi kelas base Input.
 * Menyediakan dukungan input file kustom dengan preview nama file, tautan unduhan, dan validasi file wajib diisi.
 * @extends Input
 */
export default class Filebox extends Input {
	#_value = ''
	#_suspended = false
	#_ineditmode = true


	/**
	 * Membuat instance dari Filebox.
	 * @param {string} id - ID dari elemen input.
	 */
	constructor(id) {
		super(id)
		flb_construct(this, id)
	}


	/**
	 * Mengatur nama file.
	 * @param {string} v - Nama file.
	 */
	set value(v) { this.#_value = v }

	/**
	 * Mendapatkan nama file saat ini.
	 * @type {string}
	 */
	get value() {
		if (this.Element.files.length === 0) {
			return this.#_value
		} else {
			return this.Element.files[0].name
		}
	}


	/**
	 * Mendapatkan objek file mentah (File) yang terpilih.
	 * @type {File|number}
	 */
	get file() {
		if (this.Element.files.length === 0) {
			return 0
		} else {
			return this.Element.files[0]
		}
	}



	/**
	 * Menghentikan sementara (suspend) atau mengaktifkan kembali interaksi input.
	 * @param {boolean} [doSuspend=true] - Status suspend yang diinginkan.
	 * @param {boolean} [keepState=false] - Jika true, status disabled pada elemen HTML tidak diubah.
	 */
	suspend(doSuspend = true, keepState = false) {
		this.#_suspended = doSuspend
		if (!keepState) {
			if (doSuspend) {
				flb_setDisabled(this, true)
			} else {
				flb_setDisabled(this, false)
			}
		}
	}

	/**
	 * Memeriksa apakah filebox dalam status suspended.
	 * @returns {boolean} True jika sedang suspended.
	 */
	isSuspended() {
		return this.#_suspended
	}



	/**
	 * Mengambil atau mengatur status disabled pada filebox.
	 * @type {boolean}
	 */
	get disabled() { return this.Element.disabled }
	set disabled(disable) {
		if (!disable && this.#_suspended) {
			console.warn('suspended filebox cannot be enabled!', this.Id)
			return
		}

		this.Element.disabled = disable
		flb_setDisabled(this, disable)
	}


	/**
	 * Mendapatkan status apakah filebox sedang dalam mode edit.
	 * @type {boolean}
	 */
	get InEditMode() { return this.#_ineditmode }

	/**
	 * Mengatur mode edit pada filebox.
	 * @param {boolean} ineditmode - True untuk mengaktifkan mode edit, false untuk menonaktifkan.
	 */
	setEditingMode(ineditmode) {
		this.#_ineditmode = ineditmode
		flb_setEditingMode(this, ineditmode)
	}

	/**
	 * Mengatur data baru (membersihkan file terpilih).
	 */
	newData() {
		flb_newData(this)
	}

	/**
	 * Menerima dan mengunci perubahan file saat ini.
	 */
	acceptChanges() {
		flb_acceptChanges(this)
	}

	/**
	 * Mereset nilai input file ke nilai terakhir yang disimpan.
	 */
	reset() {
		flb_Reset(this)
	}

	/**
	 * Memeriksa apakah nilai filebox telah berubah.
	 * @returns {boolean} True jika berubah.
	 */
	isChanged() {
		return flb_isChanged(this)
	}

	/**
	 * Menyetel pesan error pada komponen filebox.
	 * @param {string} msg - Pesan error.
	 */
	setError(msg) {
		super.setError(msg)
		flb_setError(this, msg)
	}


	/**
	 * Mengatur tampilan teks nama file di display.
	 * @param {string} value - Nama file.
	 */
	setDisplay(value) {
		flb_setDisplay(this, value)
	}


	/**
	 * Mengonfigurasi tautan unduhan untuk file yang sudah diunggah sebelumnya.
	 * @param {string} linktext - Teks tautan yang akan ditampilkan.
	 * @param {string|Function} url - URL tujuan unduhan atau handler fungsi klik.
	 */
	setDownloadLink(linktext, url) {
		flb_setDownloadLink(this, linktext, url)
	}

	/**
	 * Melakukan proses validasi file (apabila required).
	 * @returns {boolean} True jika valid.
	 */
	validate() {
		return flb_validate(this)
	}

	/**
	 * Fokus ke elemen input display filebox.
	 */
	focus() {
		this.Nodes.Display.focus()
	}
}


/**
 * Memvalidasi apakah file telah dipilih (apabila required).
 * @param {Object} self - Konteks objek `Filebox`.
 * @returns {boolean} True jika valid.
 */
function flb_validate(self) {
	if (self.isRequired()) {
		if (self.Nodes.Display.value == '') {
			// return false
			var err = self.getErrorValidation('required') // prioritas utama untuk validasi
			if (err != null) {
				self.setError(err.message)
			} else {
				self.setError('file harus diisi')
			}
			return false
		} else {
			return true
		}
	} else {
		return true
	}
}

/**
 * Mengonfigurasi tautan download pada filebox.
 * @param {Object} self - Konteks objek `Filebox`.
 * @param {string} [linktext=null] - Teks link.
 * @param {string|Function} [url=null] - URL link atau callback klik.
 */
function flb_setDownloadLink(self, linktext = null, url = null) {
	const downloadLink = self.Nodes.DownloadLink

	if (linktext == null) {
		// sembunyikan link
		downloadLink.classList.add('hidden')
		downloadLink.innerHTML = 'download'
		downloadLink.onclick = null
		downloadLink.removeAttribute('href')
	} else {
		{
			// munculkan link
			downloadLink.classList.remove('hidden')
			downloadLink.innerHTML = linktext
			if (typeof url === 'function') {
				downloadLink.removeAttribute('target', '_blank')
				downloadLink.setAttribute('href', 'javascript:void(0)')
				downloadLink.onclick = () => {
					url()
				}
			} else {
				downloadLink.setAttribute('target', '_blank')
				downloadLink.setAttribute('href', url)
				downloadLink.onclick = null
			}
		}
	}

}


/**
 * Membangun dan menginisialisasi elemen komponen Filebox.
 * @param {Object} self - Konteks objek `Filebox`.
 * @param {string} id - ID dari elemen input.
 */
function flb_construct(self, id) {
	const container = self.Nodes.Container
	const lastvalue = self.Nodes.LastValue
	const input = self.Nodes.Input
	const wrapinput = document.createElement('div')
	const display = document.createElement('input')
	const button = document.createElement('button')
	const label = document.querySelector(`label[for="${id}"]`)
	const downloadLink = document.createElement('a')

	// setup container, (harus di awal seblum yang lain-lain)
	// diperlukan untuk menampung semua element yang akan ditampilkan
	input.parentNode.insertBefore(container, input)


	downloadLink.innerHTML = 'download'
	downloadLink.classList.add('fgta5-entry-download-link')
	downloadLink.classList.add('hidden')




	// tambahkan elemen-element ke container
	// penambahakn container ke body document pada saat Input_construct di parent class Input
	wrapinput.appendChild(display)
	wrapinput.appendChild(button)
	button.appendChild(input)
	container.appendChild(wrapinput)
	container.appendChild(downloadLink)
	container.appendChild(lastvalue)



	// tambahkan referensi elemen ke Nodes
	self.Nodes.InputWrapper = wrapinput
	self.Nodes.Label = label
	self.Nodes.Display = display
	self.Nodes.Button = button
	self.Nodes.DownloadLink = downloadLink


	// setup container
	container.setAttribute('fgta5-component', 'Filebox')


	// setup wrapper
	wrapinput.classList.add('fgta5-entry-input-wrapper')


	// display
	display.setAttribute('id', `${id}-display`)
	display.setAttribute('type', 'text')
	display.setAttribute('picker', 'file')
	display.setAttribute('fgta5-component', 'Filebox')
	display.setAttribute('readonly', 'true')
	display.classList.add('fgta5-entry-display')
	display.classList.add('fgta5-entry-display-filebox')
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
	input.setAttribute('type', 'file')
	input.setAttribute('picker', 'file')
	input.removeAttribute('class')
	input.removeAttribute('style')
	input.classList.add('fgta5-entry-input')
	input.classList.add('fgta5-entry-input-filebox')
	input.getInputCaption = () => {
		if (label != null) {
			return label.innerHTML
		} else {
			return input.getAttribute('placeholder')
		}
	}


	// picker button
	button.id = self.Id + '-button'
	button.insertAdjacentHTML("beforeend", button_icon)
	button.classList.add('fgta5-entry-button-filebox')

	// label
	label.setAttribute('for', button.id)
	label.classList.add('fgta5-entry-label')




	// additional property setup

	// required field
	var required = input.getAttribute('required')
	if (required != null) {
		self.markAsRequired(true)
	}

	self._setLastValue(input.value)
	self.acceptChanges()


	// set input description
	self._setupDescription()


	input.addEventListener('change', (e) => {
		flb_changed(self)
	})


}

/**
 * Mengatur tampilan teks nama file di display.
 * @param {Object} self - Konteks objek `Filebox`.
 * @param {string} value - Nama file.
 */
function flb_setDisplay(self, value) {
	var display = self.Nodes.Display
	display.value = value
}

/**
 * Mengatur status disabled pada elemen display dan button.
 * @param {Object} self - Konteks objek `Filebox`.
 * @param {boolean} v - True jika disabled.
 */
function flb_setDisabled(self, v) {
	var display = self.Nodes.Display
	var button = self.Nodes.Button
	if (v) {
		display.disabled = true
		button.disabled = true
	} else {
		display.disabled = false
		button.disabled = false
	}
}


/**
 * Mengatur elemen input dan display berdasarkan status mode edit.
 * @param {Object} self - Konteks objek `Filebox`.
 * @param {boolean} ineditmode - True jika mode edit aktif.
 */
function flb_setEditingMode(self, ineditmode) {
	var display = self.Nodes.Display
	var input = self.Nodes.Input
	var attrval = ineditmode ? 'true' : 'false'

	display.setAttribute('editmode', attrval)
	input.setAttribute('editmode', attrval)
	self.Nodes.InputWrapper.setAttribute('editmode', attrval)

	if (ineditmode) {
		input.disabled = false
	} else {
		input.disabled = true
		self.setError(null)
	}
}


/**
 * Menangani trigger perubahan internal dari elemen input file.
 * @param {Object} self - Konteks objek `Filebox`.
 */
function flb_changed(self) {
	var input = self.Nodes.Input

	if (input.files.length === 0) {
		return
	}

	self.Nodes.Display.value = input.files[0].name
	flb_markChanged(self)
	if (self.InEditMode) {
		self.setError(null)
		self.validate()
	}
}

/**
 * Menandai komponen apakah mengalami perubahan.
 * @param {Object} self - Konteks objek `Filebox`.
 */
function flb_markChanged(self) {
	var display = self.Nodes.Display
	if (self.value != self.getLastValue()) {
		display.setAttribute('changed', 'true')
	} else {
		display.removeAttribute('changed')
	}
}



/**
 * Menyetel tampilan atribut error.
 * @param {Object} self - Konteks objek `Filebox`.
 * @param {string} msg - Pesan error.
 */
function flb_setError(self, msg) {
	var display = self.Nodes.Display
	if (msg !== null && msg !== '') {
		display.setAttribute('invalid', 'true')
	} else {
		display.removeAttribute('invalid')
	}
}

/**
 * Mengisi filebox dengan data baru (membersihkan pilihan).
 * @param {Object} self - Konteks objek `Filebox`.
 */
function flb_newData(self) {
	self.Nodes.Input.value = ''
	self.Nodes.Display.value = ''
	self.acceptChanges()
}


/**
 * Mereset nilai input file ke nilai terakhir yang disimpan.
 * @param {Object} self - Konteks objek `Filebox`.
 */
function flb_Reset(self) {
	// let newFileInput = self.Nodes.Input.cloneNode();
	// newFileInput.addEventListener('change', (e)=>{
	// 	flb_changed(self)
	// })

	// self.Nodes.Input.replaceWith(newFileInput)
	// self.Nodes.Input = newFileInput
	self.Nodes.Input.value = ''

	var lastvalue = self.getLastValue()
	self.Nodes.Display.value = lastvalue
	self.acceptChanges()
}

/**
 * Mengunci perubahan saat ini pada filebox.
 * @param {Object} self - Konteks objek `Filebox`.
 */
function flb_acceptChanges(self) {
	var display = self.Nodes.Display
	var input = self.Nodes.Input
	var currentvalue = ''
	if (input.files.length > 0) {
		currentvalue = input.files[0].name
	}

	self._setLastValue(currentvalue)
	input.removeAttribute('changed')
	display.removeAttribute('changed')
	self.setError(null)
}


/**
 * Memeriksa apakah nilai filebox telah berubah.
 * @param {Object} self - Konteks objek `Filebox`.
 * @returns {boolean} True jika berubah.
 */
function flb_isChanged(self) {
	var lastvalue = self.Nodes.LastValue.value
	var currentvalue = self.value
	if (currentvalue != lastvalue) {
		console.log(`Input '${self.Id}' is changed from '${lastvalue}' to '${currentvalue}'`)
		return true
	} else {
		return false
	}
}