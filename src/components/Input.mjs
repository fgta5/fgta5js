import Component from "./Component.mjs"


/* HTML Attribute
=================
- placeholder     : Teks placeholder bantuan yang ditampilkan saat input masih kosong.
- binding         : Nama field properti data objek yang dihubungkan ke input saat memanggil setData() atau getData().
- description     : Teks penjelasan/petunjuk tambahan mengenai input yang diletakkan di bawah field.
- character-case  : Mengatur kapitalisasi otomatis nilai teks input (nilai: "uppercase" | "lowercase").
- fgta5-component : Menentukan nama kelas komponen fgta5js yang membungkus elemen ini (seperti Textbox, Numberbox, dll).
- minlength       : Batas minimum jumlah karakter teks input untuk validasi panjang teks.
- maxlength       : Batas maksimum jumlah karakter teks input untuk membatasi panjang input teks.
- pattern         : Ekspresi reguler (Regex) untuk validasi format teks input.
- min             : Batas nilai numerik minimum (pada Numberbox) atau batas tanggal awal minimum (pada Datepicker).
- max             : Batas nilai numerik maksimum (pada Numberbox) atau batas tanggal akhir maksimum (pada Datepicker).
- validator       : Mengaitkan fungsi validasi kustom eksternal yang terdaftar di objek global `window.$validators`.
*/


/**
 * Komponen dasar untuk menangani input form.
 * @extends Component
 */
export default class Input extends Component {
	#_form
	#_lasterror
	#_suspended = false
	#_ineditmode = true
	#_isrequired = false
	#_invalidMessages = {}
	#_validators = {}
	#_handlers = {}


	/**
	 * Membuat instansiasi dari objek Input.
	 * @param {string} id - ID unik untuk elemen input.
	 */
	constructor(id) {
		super(id)
		input_construct(this, id)
		this._readValidators()
	}


	/**
	 * Mengembalikan nama class constructor (misalnya: 'Textbox').
	 * @type {string}
	 */
	get type() { return this.constructor.name }


	/**
	 * Mengambil atau mengatur nilai (value) dari elemen input.
	 * @type {string|number}
	 */
	get value() { return this.Element.value }
	set value(v) { this.Element.value = v }




	/**
	 * Menghentikan sementara (suspend) atau mengaktifkan kembali interaksi input.
	 * @param {boolean} [doSuspend=true] - Status suspend yang diinginkan.
	 * @param {boolean} [keepState=false] - Jika true, tidak akan mengubah status 'disabled' pada elemen HTML.
	 */
	suspend(doSuspend = true, keepState = false) {
		this.#_suspended = doSuspend
		if (!keepState) {
			if (doSuspend) {
				this.Element.disabled = true
			} else {
				this.Element.disabled = false
			}
		}
	}

	/**
	 * Memeriksa apakah input sedang dalam status suspended.
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
			console.warn('suspended input cannot be enabled!', this.Id)
			return
		}
		this.Element.disabled = disable
	}


	/**
	 * Mengambil atau mengatur teks placeholder input.
	 * @type {string}
	 */
	get placeholder() { return this.Element.getAttribute('placeholder') }
	set placeholder(v) { this.Element.setAttribute('placeholder', v) }


	/**
	 * Mengambil atau mengatur visibilitas komponen input.
	 * Catatan: Logika set saat ini memberikan class 'hidden' jika nilai v adalah true.
	 * @type {boolean}
	 */
	get visible() {
		if (this.Nodes.Container.classList.contains('hidden')) {
			return false;
		} else {
			return true;
		}
	}
	set visible(v) {
		if (v) {
			this.Nodes.Container.classList.add('hidden')
		} else {
			this.Nodes.Container.classList.remove('hidden')
		}

	}



	/**
	 * Mengambil objek Form yang terikat dengan input ini.
	 * @type {Object}
	 */
	get Form() { return this.#_form }

	/**
	 * Mengikat input ini ke sebuah objek Form.
	 * @param {Object} form - Objek form tujuan.
	 */
	bindForm(form) { this.#_form = form }


	/**
	 * Memeriksa apakah input berada dalam mode edit.
	 * @type {boolean}
	 */
	get InEditMode() { return this.#_ineditmode }


	/**
	 * Mengubah status mode edit.
	 * @param {boolean} ineditmode - Status mode edit baru.
	 */
	setEditingMode(ineditmode) {
		this.#_ineditmode = ineditmode
	}

	/**
	 * Mengambil daftar pesan error/invalid yang terdaftar.
	 * @type {Object.<string, string>}
	 */
	get InvalidMessages() { return this.#_invalidMessages }



	/**
	 * Menambahkan atau mengubah pesan invalid spesifik.
	 * @param {string} name - Nama validator (key).
	 * @param {string} message - Pesan error yang ingin ditampilkan.
	 */
	setInvalidMessage(name, message) {
		this.#_invalidMessages[name] = message
	}


	/**
	 * Membaca pesan validator dari atribut elemen HTML (internal).
	 * @private
	 */
	_readValidators() {
		let input = this.Element
		var prefix = 'invalid-message'
		Array.from(input.attributes).forEach(attr => {
			if (attr.name.startsWith(prefix)) {
				var key = attr.name === prefix ? "default" : attr.name.replace(`${prefix}-`, "");
				this.#_invalidMessages[key] = attr.value;
			}
		});
		input_readValidators(this)
	}


	/**
	 * Mengisi input dengan data baru.
	 * @param {*} initialvalue - Nilai awal data.
	 */
	newData(initialvalue) {
		input_newData(this, initialvalue)
	}


	/**
	 * Menerima dan mengunci perubahan data saat ini.
	 */
	acceptChanges() {
		input_acceptChanges(this)
	}


	/**
	 * Mengembalikan nilai input ke data awal/sebelumnya (setelah terakhir di accept changes).
	 */
	reset() {
		input_reset(this)
	}


	/**
	 * Memeriksa apakah nilai input telah berubah dari nilai aslinya.
	 * @returns {boolean} True jika data berubah.
	 */
	isChanged() {
		return input_isChanged(this)
	}


	/**
	 * Menyimpan pesan error terakhir (internal).
	 * @param {string} msg - Pesan error.
	 * @private
	 */
	_setLastError(msg) {
		this.#_lasterror = msg
	}


	/**
	 * Mendapatkan pesan error terakhir yang terjadi.
	 * @returns {string} Pesan error terakhir.
	 */
	getLastError() {
		return this.#_lasterror
	}


	/**
	 * Menyetel pesan error pada komponen input.
	 * @param {string} msg - Pesan error.
	 */
	setError(msg) {
		input_setError(this, msg)
	}


	/**
	 * Menyimpan nilai terakhir komponen (internal).
	 * @param {*} v - Nilai input.
	 * @private
	 */
	_setLastValue(v) {
		input_setLastValue(this, v)
	}


	/**
	 * Mendapatkan nilai terakhir yang tersimpan dari komponen.
	 * @returns {*} Nilai terakhir.
	 */
	getLastValue() {
		return input_getLastValue(this)
	}


	/**
	 * Mengambil nama attribute 'binding' dari elemen HTML input.
	 * @returns {string|null} Nama binding atau null jika tidak ada.
	 */
	getBindingData() {
		var binding = this.Element.getAttribute('binding')
		if (binding === null) {
			return null
		} else {
			return binding
		}
	}


	/**
	 * Melakukan validasi pada input ini berdasarkan validator yang terpasang.
	 * @returns {boolean} True jika input valid.
	 */
	validate() {
		// console.log(`Validating input '${this.Id}'`)
		return input_validate(this)
	}


	/**
	 * Mendapatkan daftar validator yang aktif pada input ini.
	 * @type {Object}
	 */
	get Validators() { return this.#_validators }



	/**
	 * Menambahkan fungsi validator ke dalam input.
	 * @param {string} fnName - Nama fungsi validator.
	 * @param {*} fnParams - Parameter untuk fungsi validator.
	 * @param {string} message - Pesan jika validasi gagal.
	 */
	addValidator(fnName, fnParams, message) {
		this.#_validators[fnName] = {
			param: fnParams,
			message: message
		}
	}


	/**
	 * Menghapus validator tertentu berdasarkan namanya.
	 * @param {string} str - Nama validator yang ingin dihapus.
	 */
	removeValidator(str) {
		if (this.#_validators[str] !== undefined) {
			delete this.#_validators[str]
		}
	}


	/**
	 * Menghapus semua validator yang terpasang.
	 */
	clearValidators() {
		this.#_validators = {}
	}


	/**
	 * Membaca ulang validator dari elemen HTML.
	 */
	readValidators() {
		input_readValidators(this)
	}


	/**
	 * Membuat dan menampilkan elemen deskripsi tambahan di bawah input (internal).
	 * @private
	 */
	_setupDescription() {
		var description = this.Element.getAttribute('description')
		if (description !== null && description.trim() !== '') {
			description = description.trim()
			const decrdiv = document.createElement('div')
			decrdiv.classList.add('fgta5-entry-description')
			decrdiv.innerHTML = description
			decrdiv.setAttribute("title", description)
			this.Nodes.Container.appendChild(decrdiv)
		}
	}



	/**
	 * Memeriksa apakah input ini wajib diisi (required).
	 * @returns {boolean}
	 */
	isRequired() { return this.#_isrequired }



	/**
	 * Menandai input apakah wajib diisi atau tidak.
	 * @param {boolean} r - True jika wajib diisi.
	 */
	markAsRequired(r) {
		this.#_isrequired = r
		input_markAsRequired(this, r)
	}



	/**
	 * Menambahkan event listener ke input.
	 * @param {string} evt - Nama event (misal: 'click', 'change').
	 * @param {Function} callback - Fungsi yang dijalankan saat event terpicu.
	 */
	addEventListener(evt, callback) {
		this.Listener.addEventListener(evt, callback)
	}



	/**
	 * Mendapatkan daftar custom handler yang terdaftar.
	 * @type {Object}
	 */
	get Handlers() { return this.#_handlers }


	/**
	 * Mendaftarkan fungsi handler kustom.
	 * @param {string} name - Nama handler.
	 * @param {Function} fn - Fungsi handler.
	 */
	handle(name, fn) {
		this.#_handlers[name] = fn
	}



	/**
	 * Mengambil pesan error spesifik dari salah satu fungsi validasi.
	 * @param {string} fnName - Nama fungsi validasi.
	 * @returns {string|null} Pesan kesalahan atau null.
	 */
	getErrorValidation(fnName) {
		return input_getErrorValidation(this, fnName)
	}


}


/**
 * Menginisialisasi komponen input, membuat elemen DOM kontainer, 
 * serta menyiapkan objek listener dan referensi node internal.
 * @param {Object} self - Konteks atau instans dari objek `Input` yang sedang dikonstruksi.
 * @param {string} id - ID unik yang digunakan untuk mengidentifikasi komponen.
 */
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


/**
 * Menginisialisasi komponen input, membuat elemen DOM kontainer, 
 * serta menyiapkan listener dan node internal.
 * @param {Object} self - Instans atau konteks objek kelas `Input` yang sedang dikonstruksi.
 * @param {string} id - ID komponen yang digunakan untuk identifikasi.
 */
function input_setError(self, msg) {

	var errdiv = self.Nodes.Container.querySelector('.fgta5-entry-error')
	if (msg !== null && msg !== '') {
		self.Nodes.Input.setAttribute('invalid', 'true')
		if (self.Nodes.Display != null) {
			self.Nodes.Display.setAttribute('invalid', 'true')
		}
		if (!errdiv) {
			errdiv = document.createElement('div')
			errdiv.classList.add('fgta5-entry-error')
			self.Nodes.Container.insertBefore(errdiv, self.Nodes.InputWrapper.nextSibling)
		}
		errdiv.innerHTML = `<div>${msg}</div>`
		self._setLastError(msg)
	} else {
		self.Nodes.Input.removeAttribute('invalid')
		if (self.Nodes.Display != null) {
			self.Nodes.Display.removeAttribute('invalid')
		}
		if (errdiv) {
			errdiv.remove()
		}
		self._setLastError(null)
	}
}


/**
 * Menyimpan suatu nilai ke dalam elemen input hidden (LastValue).
 * @param {Object} self - Konteks objek `Input`.
 * @param {string|number} v - Nilai yang akan disimpan sebagai nilai terakhir.
 */
function input_setLastValue(self, v) {
	self.Nodes.LastValue.value = v
}


/**
 * Mengambil nilai yang tersimpan dari elemen input hidden (LastValue).
 * @param {Object} self - Konteks objek `Input`.
 * @returns {string} Nilai terakhir yang tersimpan.
 */
function input_getLastValue(self) {
	return self.Nodes.LastValue.value
}


/**
 * Mengisi komponen dengan data baru dan langsung mengunci perubahan tersebut.
 * @param {Object} self - Konteks objek `Input`.
 * @param {string|number} initialvalue - Nilai awal baru yang akan dimasukkan.
 */
function input_newData(self, initialvalue) {
	self.value = initialvalue
	self.acceptChanges()
}


/**
 * Menerima dan mengunci perubahan data saat ini, menyinkronkan nilai elemen input 
 * ke dalam penyimpanan nilai terakhir, serta membersihkan status error dan indikator perubahan.
 * @param {Object} self - Konteks objek `Input`.
 */
function input_acceptChanges(self) {
	console.log('input_acceptChanges')
	self._setLastValue(self.Nodes.Input.value)
	self.Nodes.Input.removeAttribute('changed')
	self.setError(null)
}


/**
 * Mengembalikan nilai elemen input ke nilai terakhir yang tersimpan (membatalkan perubahan).
 * @param {Object} self - Konteks objek `Input`.
 */
function input_reset(self) {
	self.Nodes.Input.value = self.Nodes.LastValue.value
	self.acceptChanges()
}


/**
 * Memeriksa apakah nilai input telah berubah dengan membandingkan langsung 
 * nilai pada elemen DOM LastValue dan Input (menghindari getter/setter komponen).
 * @param {Object} self - Konteks objek `Input`.
 * @returns {boolean} True jika nilai saat ini berbeda dengan nilai awal/terakhir yang disimpan.
 */
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


/**
 * Mengeksekusi fungsi validator tertentu dan mengembalikan objek Error jika validasi gagal.
 * Fungsi ini juga menangani transformasi character-case dan penanganan khusus untuk Numberbox.
 * @param {Object} self - Konteks objek `Input`.
 * @param {string} fnName - Nama fungsi validator yang akan dieksekusi.
 * @returns {Error|null} Objek Error jika tidak valid atau terjadi gangguan, atau null jika valid.
 */
function input_getErrorValidation(self, fnName) {
	const validatorData = self.Validators[fnName]
	const fnValidate = $validators[fnName] ?? $validators.getCustomValidator(fnName);
	const fnParams = validatorData.param;
	const fnMessage = validatorData.message;
	const input = self.Nodes.Input

	try {
		if (typeof fnValidate !== 'function') {
			var err = new Error(`Validator function '${fnName}' is not defined or not a function`)
			console.error(err);
			throw err
		}


		var charcase = self.Nodes.Input.getAttribute('character-case')
		var value = input.value
		if (charcase == 'lowercase') {
			value = value.toLowerCase()
		} else if (charcase == 'uppercase') {
			value = value.toUpperCase()
		}


		if (self.type == 'Numberbox' && fnName == 'maxlength') {
			value = self.Nodes.Display.value
			value = value.replace(/[.,]/g, "");
		}

		var valid = fnValidate(value, fnParams)
		if (!valid) {
			var defmsg = self.InvalidMessages['default']
			if (fnMessage != null) {
				throw new Error(fnMessage)
			} else if (defmsg != null) {
				throw new Error(defmsg)
			} else {
				throw new Error(`Invalid value '${input.value}' for '${input.getInputCaption()}' using validator '${fnName}(${fnParams ?? ''})'`)
			}
		}
		return null
	} catch (err) {
		return err
	}
}

/**
 * Menjalankan seluruh proses validasi pada komponen input.
 * Aturan 'required' akan diprioritaskan terlebih dahulu sebelum memeriksa validator lainnya.
 * @param {Object} self - Konteks objek `Input`.
 * @returns {boolean} True jika lolos seluruh validasi, atau false jika ada yang gagal.
 */
function input_validate(self) {
	// prioritas untama untuk proses validasi adalah required
	// jalankan validasi required dulu,
	// baru kemudian loop validasi yang lain, tapi kemudian skip required karena telah dieksekusi

	const vnamereq = 'required'
	if (self.Validators[vnamereq] != null) {
		var err = input_getErrorValidation(self, vnamereq) // prioritas utama untuk validasi
		if (err != null) {
			self.setError(err.message)
			return false
		}
	}

	// lanjutkan untuk validasi berikutnya
	for (const fnName in self.Validators) {
		if (fnName == vnamereq) {
			continue
		}
		var err = input_getErrorValidation(self, fnName)
		if (err != null) {
			self.setError(err.message)
			return false
		}
	}

	self.setError(null)
	return true
}

/**
 * Mengubah informasi waktu pada objek Date menjadi jam 00:00:00 (menghapus komponen waktu).
 * @param {Date} dt - Objek tanggal yang akan dibersihkan waktunya.
 */
function clearTime(dt) {
	dt.setHours(0)
	dt.setMinutes(0)
	dt.setSeconds(0)
}



/**
 * Membaca atribut-atribut HTML pada elemen input (seperti minlength, maxlength, pattern, min, max, serta custom validator)
 * dan mendaftarkannya ke dalam daftar validator komponen.
 * @param {Object} self - Konteks objek `Input`.
 */
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
		if (cname == "Datepicker") {
			var mindate = new Date(min)
			clearTime(mindate)
			self.addValidator('mindate', mindate, msg)
		} else if (cname == "Timepicker") {
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
		if (cname == "Datepicker") {
			var maxdate = new Date(max)
			clearTime(maxdate)
			self.addValidator('maxdate', maxdate, msg)
		} else if (cname == "Timepicker") {
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
		validator = validator.split(';')
		for (var i = 0; i < validator.length; i++) {
			var str = validator[i].trim()
			var { fnName, fnParams } = parseFunctionParam(self, str)
			self.addValidator(fnName, fnParams, self.InvalidMessages[fnName])
		}
	}
}


/**
 * Memecah string definisi validator dengan format "namaFungsi:parameter" 
 * menjadi objek nama fungsi dan parameternya (mendukung konversi otomatis ke tipe data Number).
 * @param {Object} self - Konteks objek `Input`.
 * @param {string} paramString - String teks validator yang akan diparsing (misal: "maxlength:10").
 * @returns {{fnName: string, fnParams: (string|number|null)}} Objek berisi `fnName` (nama fungsi) dan `fnParams` (parameter).
 */
function parseFunctionParam(self, paramString) {
	const [fnName, ...fnParams] = paramString.split(":");
	const fnParamsString = fnParams.length > 0 ? fnParams.join(":") : null;

	return {
		fnName,
		fnParams: fnParamsString !== null
			? (!isNaN(fnParamsString) ? Number(fnParamsString) : fnParamsString)
			: null
	};
}


/**
 * Mengatur status wajib diisi (required) pada komponen. 
 * Fungsi ini akan menambahkan/menghapus atribut 'required' pada elemen Label dan Input, 
 * serta mendaftarkan atau menghapus validator terkait.
 * @param {Object} self - Konteks objek `Input`.
 * @param {boolean} required - True jika ingin menandai input sebagai wajib diisi, false jika tidak.
 */
function input_markAsRequired(self, required) {
	var attrname = 'required'
	var label = self.Nodes.Label;
	if (label != null && label != undefined) {
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