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


/* HTML Attribute
=================
- locked     : Menentukan apakah form dalam kondisi terkunci (read-only) saat pertama kali dimuat (nilai: "true" | "false").
- autoid     : Menentukan apakah ID form/data akan di-generate secara otomatis (nilai: "true" | "false").
- primarykey : Menentukan ID dari elemen input yang bertindak sebagai primary key form ini.
*/

/**
 * Komponen Form untuk mengelola input data, validasi, dan sinkronisasi status perubahan data.
 * @extends Component
 */
export default class Form extends Component {
	#_locked = false
	#_autoid = false
	#_primarykey

	/**
	 * Map dari ID input ke instans fgta5-component.
	 * @type {Object<string, Component>}
	 */
	Inputs = {}

	/**
	 * Membuat instans baru dari Form.
	 * @param {string} id - ID elemen HTML form.
	 */
	constructor(id) {
		super(id)

		this.#readAttributes()
		frm_construct(this, id)
	}

	/**
	 * Mendapatkan status apakah ID di-generate secara otomatis.
	 * @returns {boolean}
	 */
	get AutoID() { return this.#_autoid }

	/**
	 * Mendapatkan ID input yang bertindak sebagai primary key.
	 * @returns {string|null}
	 */
	get PrimaryKey() { return this.#_primarykey }

	/**
	 * Mengunci atau membuka form.
	 * @param {boolean} lock - True jika ingin mengunci, false jika ingin membuka.
	 */
	lock(lock) {
		this.#_locked = frm_lock(this, lock)
	}

	/**
	 * Memeriksa apakah form sedang dikunci.
	 * @returns {boolean}
	 */
	isLocked() {
		return this.#_locked
	}

	/**
	 * Status apakah form saat ini memuat data baru (belum disimpan).
	 * @type {boolean}
	 * @private
	 */
	#isnew

	/**
	 * Memeriksa apakah form memuat data baru.
	 * @returns {boolean}
	 */
	isNew() {
		return this.#isnew
	}

	/**
	 * Menandai form bahwa form memuat data baru.
	 */
	setAsNewData() {
		this.#isnew = true
	}

	/**
	 * Mereset status perubahan form kembali ke nilai orisinal/sebelumnya.
	 */
	reset() {
		this.#isnew = false
		frm_reset(this)
	}

	/**
	 * Mengosongkan nilai semua input pada form.
	 * @param {string} [text=''] - Teks kosong default yang akan diisi.
	 */
	clear(text) {
		frm_clear(this, text)
	}

	/**
	 * Menerima/menyimpan semua perubahan nilai saat ini sebagai nilai orisinal.
	 */
	acceptChanges() {
		this.#isnew = false
		frm_acceptChanges(this)
	}

	/**
	 * Memeriksa apakah ada perubahan nilai input pada form dibandingkan nilai orisinalnya.
	 * @returns {boolean}
	 */
	isChanged() { return frm_isChanged(this) }

	/**
	 * Pesan error terakhir yang terjadi saat validasi form.
	 * @type {string|null}
	 * @private
	 */
	#lastError

	/**
	 * Mengeset pesan error validasi terakhir.
	 * @param {string|null} msg - Pesan error.
	 * @private
	 */
	_setLastError(msg) {
		this.#lastError = msg
	}

	/**
	 * Mendapatkan pesan error validasi terakhir.
	 * @returns {string|null}
	 */
	getLastError() {
		return this.#lastError
	}

	/**
	 * Mendapatkan objek komponen input yang bertindak sebagai primary key.
	 * @returns {Component|null}
	 */
	getPrimaryInput() {
		const pk = this.PrimaryKey
		const obj = this.Inputs[pk]
		return obj
	}

	/**
	 * Mengeset form untuk penulisan data baru.
	 * @param {Object} [data] - Nilai awal/default data baru.
	 */
	newData(data) {
		this.#isnew = true
		this.lock(false)
		frm_newData(this, data)
	}

	/**
	 * Merender form dan semua komponen input di dalamnya.
	 */
	render() { frm_render(this) }

	/**
	 * Melakukan validasi terhadap seluruh komponen input di form.
	 * @returns {boolean} True jika semua valid, false jika ada yang tidak valid.
	 */
	validate() { return frm_validate(this) }

	/**
	 * Mendapatkan file-file yang dipilih dari komponen input bertipe Filebox jika ada perubahan.
	 * @returns {Object<string, File>|null} Objek berisi mapping nama field dan file biner, atau null jika tidak ada.
	 */
	getFiles() {
		return frm_getFiles(this)
	}

	/**
	 * Mendapatkan hanya data input yang nilainya telah berubah.
	 * @returns {Object} Objek berisi field data yang berubah beserta nilai barunya.
	 */
	getDataChanged() {
		var changedOnly = true
		return frm_getData(this, changedOnly)
	}

	/**
	 * Data orisinal form saat pertama kali diset via setData.
	 * @type {Object|null}
	 * @private
	 */
	#originalData

	/**
	 * Mengisi form dengan data yang diberikan dan menetapkannya sebagai nilai orisinal.
	 * @param {Object} data - Objek data.
	 */
	setData(data) {
		this.#originalData = data
		frm_setData(this, data)
	}

	/**
	 * Mendapatkan nilai data form saat ini untuk seluruh input.
	 * @returns {Object} Objek data form.
	 */
	getData() {
		return frm_getData(this) // data current form
	}

	/**
	 * Mendapatkan nilai data orisinal form.
	 * @returns {Object|null} Objek data orisinal.
	 */
	getOriginalData() {
		return this.#originalData // data saat diset pertama kali dari setData
	}

	/**
	 * Menambahkan event listener ke elemen HTML form.
	 * @param {string} event - Nama event.
	 * @param {Function} callback - Callback function.
	 */
	addEventListener(event, callback) {
		this.Element.addEventListener(event, callback)
	}

	/**
	 * Mengalihkan fokus kembali ke elemen yang aktif setelah interaksi submit/blur sesaat.
	 */
	acceptInput() {
		const prevFocusedElement = document.activeElement;
		prevFocusedElement.blur()
		setTimeout(() => {
			prevFocusedElement.focus()
		}, 100)
	}

	/**
	 * Membaca atribut HTML pada elemen Form untuk konfigurasi awal.
	 * @private
	 */
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
		if (autoid != null) {
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


/**
 * Menginisialisasi form dan memetakan input-input HTML di dalamnya ke fgta5-component.
 * @param {Form} self - Instans Form yang dioperasikan.
 * @param {string} id - ID elemen form.
 * @private
 */
function frm_construct(self, id) {
	var formEl = document.getElementById(id)

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
		if (fgtacomp == null || input.id == null || input.id == '') {
			continue
		}

		if (fgtacomp == 'Textbox') {
			self.Inputs[input.id] = new Textbox(input.id)
		} else if (fgtacomp == 'Numberbox') {
			self.Inputs[input.id] = new Numberbox(input.id)
		} else if (fgtacomp == 'Datepicker') {
			self.Inputs[input.id] = new Datepicker(input.id)
		} else if (fgtacomp == 'Timepicker') {
			self.Inputs[input.id] = new Timepicker(input.id)
		} else if (fgtacomp == 'Combobox') {
			self.Inputs[input.id] = new Combobox(input.id)
		} else if (fgtacomp == 'Checkbox') {
			self.Inputs[input.id] = new Checkbox(input.id)
		} else if (fgtacomp == 'Filebox') {
			self.Inputs[input.id] = new Filebox(input.id)
		}

	}

}


/**
 * Menghubungkan form ke seluruh input di dalamnya dan mengeset status kunci form di awal.
 * @param {Form} self - Instans Form yang dioperasikan.
 * @private
 */
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

/**
 * Mengunci atau membuka seluruh input form dan mengirimkan event locked/unlocked.
 * @param {Form} self - Instans Form yang dioperasikan.
 * @param {boolean} [lock=true] - True jika dikunci, false jika dibuka.
 * @returns {boolean} Nilai status penguncian saat ini.
 * @private
 */
function frm_lock(self, lock = true) {
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




/**
 * Menerima semua perubahan nilai saat ini sebagai nilai orisinal pada setiap input form.
 * @param {Form} self - Instans Form yang dioperasikan.
 * @private
 */
function frm_acceptChanges(self) {
	for (var name in self.Inputs) {
		var obj = self.Inputs[name]
		obj.acceptChanges()
	}
}

/**
 * Mengembalikan seluruh input form ke nilai orisinal masing-masing.
 * @param {Form} self - Instans Form yang dioperasikan.
 * @private
 */
function frm_reset(self) {
	for (var name in self.Inputs) {
		var obj = self.Inputs[name]
		obj.reset()
	}
}

/**
 * Mengosongkan nilai input bertipe teks pada elemen form.
 * @param {Form} self - Instans Form yang dioperasikan.
 * @param {string} [text=''] - Nilai teks default.
 * @private
 */
function frm_clear(self, text = '') {
	const inputs = self.Element.querySelectorAll('input:not([type="file"]')
	inputs.forEach(element => {
		element.value = text
	});
}


/**
 * Mengisi nilai input-input form berdasarkan objek data yang diberikan.
 * @param {Form} self - Instans Form yang dioperasikan.
 * @param {Object} data - Objek berisi pasangan key-value data.
 * @private
 */
function frm_setData(self, data) {
	for (var name in self.Inputs) {
		var obj = self.Inputs[name];
		var bindingdata = obj.getBindingData();
		var value = data[bindingdata]
		if (obj instanceof Combobox) {
			var displayname = obj.getDisplayBinding()
			if (displayname != null) {
				obj.setSelected(value, data[displayname])
			} else {
				obj.setSelected(value, value)
			}
		} else if (obj instanceof Filebox) {
			obj.setDisplay(value)
		} else {
			obj.value = value
		}
	}
	frm_acceptChanges(self)
}


/**
 * Menyiapkan form dengan data baru (menginisialisasi ulang input).
 * @param {Form} self - Instans Form yang dioperasikan.
 * @param {Object} [data] - Objek nilai awal.
 * @private
 */
function frm_newData(self, data) {
	data = data != null ? data : {}

	for (var name in self.Inputs) {

		var obj = self.Inputs[name]
		var bindingdata = obj.getBindingData()
		var initialvalue = data[bindingdata]

		if (obj instanceof Combobox) {
			var initialdata = (initialvalue != null) ? initialvalue : { value: '', text: '' }
			obj.newData({
				value: initialdata.value,
				text: initialdata.text
			})
		} else {
			obj.newData(initialvalue)
		}
	}
}

/**
 * Memeriksa apakah ada salah satu input form yang berubah nilainya dari orisinal.
 * @param {Form} self - Instans Form yang dioperasikan.
 * @returns {boolean} True jika ada perubahan, false jika tidak.
 * @private
 */
function frm_isChanged(self) {
	for (var name in self.Inputs) {
		var obj = self.Inputs[name]
		if (obj.isChanged()) {
			return true
		}
	}
	return false
}

/**
 * Memvalidasi semua input di form dan mencatat error jika ada yang tidak valid.
 * @param {Form} self - Instans Form yang dioperasikan.
 * @returns {boolean} True jika seluruh input valid, false jika sebaliknya.
 * @private
 */
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


/**
 * Mengambil data dari input-input form.
 * @param {Form} self - Instans Form yang dioperasikan.
 * @param {boolean} [changedOnly=false] - Jika true, hanya mengambil data yang berubah.
 * @returns {Object} Objek berisi pasangan key-value data form.
 * @private
 */
function frm_getData(self, changedOnly = false) {
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
			if (currBinding != pkBinding) {
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


/**
 * Mengambil data file yang telah berubah pada form.
 * @param {Form} self - Instans Form yang dioperasikan.
 * @returns {Object<string, File>|null} Objek data file yang berubah, atau null jika tidak ada.
 * @private
 */
function frm_getFiles(self) {
	const files = {}
	for (var name in self.Inputs) {
		var obj = self.Inputs[name]
		if (!(obj instanceof Filebox)) {
			continue
		}

		if (!obj.isChanged()) {
			continue
		}

		const bindingdata = obj.getBindingData()

		const file = obj.file
		if (file != null) {
			files[bindingdata] = obj.file
		}
	}

	const isEmpty = Object.keys(files).length === 0;
	if (isEmpty) {
		return null
	} else {
		return files
	}
}