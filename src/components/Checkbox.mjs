import Input from "./Input.mjs"


const ChangedEvent = (data) => { return new CustomEvent('changed', data) }
const CheckedEvent = (data) => { return new CustomEvent('checked', data) }
const UnCheckedEvent = (data) => { return new CustomEvent('unchecked', data) }

/* HTML Attribute
=================
- data-tabindex       : Mengatur urutan tab (tabindex) navigasi keyboard pada elemen input checkbox.
- disabled            : Menonaktifkan checkbox agar tidak dapat diinteraksi.
- permanent-disabled : Menonaktifkan secara permanen meskipun form berada dalam mode edit.
*/


/**
 * Kelas komponen Checkbox yang mewarisi kelas base Input.
 * Menyediakan dukungan input boolean berupa checkbox dengan gaya kustom.
 * @extends Input
 */
export default class Checkbox extends Input {
	#_suspended = false
	#_ineditmode = true


	/**
	 * Membuat instance dari Checkbox.
	 * @param {string} id - ID dari elemen input.
	 */
	constructor(id) {
		super(id)
		chk_construct(this, id)
	}

	/**
	 * Mendapatkan status centang saat ini.
	 * @type {boolean}
	 */
	get value() { return chk_getValue(this) }

	/**
	 * Mengatur status centang checkbox.
	 * @param {boolean|number|string} v - Nilai status centang.
	 */
	set value(v) {
		chk_setValue(this, v)
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
				chk_setDisabled(this, true)
			} else {
				chk_setDisabled(this, false)
			}
		}
	}

	/**
	 * Memeriksa apakah checkbox dalam status suspended.
	 * @returns {boolean} True jika sedang suspended.
	 */
	isSuspended() {
		return this.#_suspended
	}

	/**
	 * Mengambil atau mengatur status disabled pada checkbox.
	 * @type {boolean}
	 */
	get disabled() { return chk_getDisabled(this) }
	set disabled(disable) {
		if (!disable && this.#_suspended) {
			console.warn('suspended checkbox cannot be enabled!', this.Id)
			return
		}

		this.Element.disabled = disable
		chk_setDisabled(this, disable)
	}



	/**
	 * Mendapatkan status apakah checkbox sedang dalam mode edit.
	 * @type {boolean}
	 */
	get InEditMode() { return this.#_ineditmode }

	/**
	 * Mengatur mode edit pada checkbox.
	 * @param {boolean} ineditmode - True untuk mengaktifkan mode edit, false untuk menonaktifkan.
	 */
	setEditingMode(ineditmode) {
		this.#_ineditmode = ineditmode
		chk_setEditingMode(this, ineditmode)
	}

	/**
	 * Mengatur atau mereset data baru untuk checkbox.
	 * @param {boolean|number|string} initialvalue - Nilai awal untuk checkbox.
	 */
	newData(initialvalue) {
		super.newData(initialvalue)
		chk_NewData(this, initialvalue)
	}

	/**
	 * Mendapatkan nilai status centang terakhir yang disimpan.
	 * @returns {boolean} Nilai terakhir.
	 */
	getLastValue() {
		return chk_getLastValue(this)
	}

	/**
	 * Memeriksa apakah status centang saat ini telah berubah dari nilai terakhir.
	 * @returns {boolean} True jika berubah.
	 */
	isChanged() {
		return chk_isChanged(this)
	}

	/**
	 * Mereset nilai centang ke nilai terakhir yang disimpan.
	 */
	reset() {
		chk_Reset(this)
	}

	/**
	 * Menyimpan nilai centang terakhir (internal).
	 * @param {boolean|number|string} v - Nilai.
	 * @private
	 */
	_setLastValue(v) {
		chk_setLastValue(this, v)
	}
}



/**
 * Membangun dan menginisialisasi elemen komponen Checkbox.
 * @param {Object} self - Konteks objek `Checkbox`.
 * @param {string} id - ID dari elemen input.
 */
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
	input.value = input.checked ? 'on' : 'off'



	const tabIndex = input.getAttribute('data-tabindex')
	if (tabIndex != null) {
		input.setAttribute('tabindex', tabIndex)
	}


	// setup checkbox label untuk menampung checkbox
	checkboxlabel.classList.add('fgta5-checkbox')


	// ganti original label tag menjadi div 
	// karena label di form harus mereferensi ke input
	// sedangkan label di checkbox kita fungsikan sebagai text pada checkbox untuk di klik
	var replLabel = document.createElement('div')
	replLabel.innerHTML = "&nbsp";
	replLabel.setAttribute('label', '')
	replLabel.classList.add('fgta5-checkbox-caption')
	label.parentNode.replaceChild(replLabel, label);


	// inisialisasi last value
	self._setLastValue(self.Element.checked)




	const dis = input.getAttribute('disabled')
	if (dis != null) {
		chk_setDisabled(self, true)
	}

	// tambahkan event listener internal
	input.addEventListener('change', (event) => {
		chk_checkedChanged(self)
	});

}

/**
 * Memeriksa apakah checkbox dinonaktifkan secara permanen.
 * @param {Object} self - Konteks objek `Checkbox`.
 * @returns {boolean} True jika dinonaktifkan secara permanen.
 */
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

/**
 * Mengatur status disabled pada elemen input checkbox.
 * @param {Object} self - Konteks objek `Checkbox`.
 * @param {boolean} v - True jika disabled.
 */
function chk_setDisabled(self, v) {
	var input = self.Nodes.Input

	var editmode = input.getAttribute('editmode')
	var ineditmode = ((editmode == null || editmode == '' || editmode == 'false')) ? false : true

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


/**
 * Mengatur elemen input berdasarkan status mode edit.
 * @param {Object} self - Konteks objek `Checkbox`.
 * @param {boolean} ineditmode - True jika mode edit aktif.
 */
function chk_setEditingMode(self, ineditmode) {
	var input = self.Nodes.Input
	var attrval = ineditmode ? 'true' : 'false'
	var permdisattr = input.getAttribute('permanent-disabled')
	var permanentDisabled = ((permdisattr == null || permdisattr == '' || permdisattr == 'false')) ? false : true

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

/**
 * Mengatur penyimpanan nilai centang terakhir (hidden input).
 * @param {Object} self - Konteks objek `Checkbox`.
 * @param {boolean|number|string} v - Nilai.
 */
function chk_setLastValue(self, v) {
	var lastvalue = 1
	if (v === 'off' || v === '0' || v === 0 || v === false) {
		lastvalue = 0
	}
	self.Nodes.LastValue.value = lastvalue
}


/**
 * Menangani event perubahan status centang checkbox.
 * @param {Object} self - Konteks objek `Checkbox`.
 */
function chk_checkedChanged(self) {
	var input = self.Nodes.Input
	input.value = input.checked ? 1 : 0
	if (self.getLastValue() != self.value) {
		input.setAttribute('changed', 'true')
	} else {
		input.removeAttribute('changed')
	}


	if (input.checked) {
		self.Listener.dispatchEvent(CheckedEvent({
			sender: self,
			detail: {}
		}))
	} else {
		self.Listener.dispatchEvent(UnCheckedEvent({
			sender: self,
			detail: {}
		}))
	}

	self.Listener.dispatchEvent(ChangedEvent({
		sender: self,
		detail: { checked: input.checked }
	}))

}


/**
 * Memeriksa apakah status centang telah berubah.
 * @param {Object} self - Konteks objek `Checkbox`.
 * @returns {boolean} True jika berubah.
 */
function chk_isChanged(self) {
	var lastvalue = self.getLastValue()
	var currentvalue = self.value
	if (currentvalue != lastvalue) {
		// console.log(`Checkbox '${self.Id}' is changed from '${lastvalue}' to '${currentvalue}'`)
		return true
	} else {
		return false
	}
}



/**
 * Mengonversi bermacam tipe data ke boolean.
 * @param {*} v - Nilai.
 * @returns {boolean} Representasi boolean.
 */
function chk_getBoolValue(v) {
	if (v === 0 || v === '0' || v === false || v === undefined) {
		return false
	} else {
		return true
	}
}



/**
 * Mendapatkan status centang dari elemen input.
 * @param {Object} self - Konteks objek `Checkbox`.
 * @returns {boolean} Status centang.
 */
function chk_getValue(self) {
	return self.Element.checked
}

/**
 * Mengatur status centang elemen checkbox.
 * @param {Object} self - Konteks objek `Checkbox`.
 * @param {boolean} v - Nilai.
 */
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

/**
 * Mendapatkan nilai centang terakhir yang disimpan.
 * @param {Object} self - Konteks objek `Checkbox`.
 * @returns {boolean} Nilai centang terakhir.
 */
function chk_getLastValue(self) {
	var lastvalue = self.Nodes.LastValue.value
	return chk_getBoolValue(lastvalue)
}

/**
 * Mereset status centang ke nilai terakhir yang disimpan.
 * @param {Object} self - Konteks objek `Checkbox`.
 */
function chk_Reset(self) {
	var checked = self.getLastValue()
	self.value = checked
	self._setLastValue(checked)
}


/**
 * Mengisi checkbox dengan status centang baru.
 * @param {Object} self - Konteks objek `Checkbox`.
 * @param {boolean} initialvalue - Nilai awal status centang.
 */
function chk_NewData(self, initialvalue) {
	var checked = chk_getBoolValue(initialvalue)
	self.value = checked
	self._setLastValue(checked)
}

/**
 * Menandai komponen apakah mengalami perubahan centang.
 * @param {Object} self - Konteks objek `Checkbox`.
 */
function chk_markChanged(self) {
	var input = self.Nodes.Input
	if (self.value != self.getLastValue()) {
		input.setAttribute('changed', 'true')
	} else {
		input.removeAttribute('changed')
	}
}