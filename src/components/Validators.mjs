/**
 * Mengambil pesan error kustom dari atribut elemen input, atau menggunakan pesan default jika tidak tersedia.
 * @param {string} name - Nama validator (misal: 'required', 'minlength', dll).
 * @param {HTMLElement} input - Elemen input HTML.
 * @param {string} defaultMessage - Pesan error default jika atribut invalid-message tidak ditemukan.
 * @returns {string} Pesan error yang sesuai.
 */
export function getInvalidMessage(name, input, defaultMessage) {
	var msg = input.getAttribute(`invalid-message-${name}`);
	if (msg == null || msg === '') {
		msg = defaultMessage;
	}
	return msg;
}


/**
 * Map penyimpan validator kustom global.
 * @type {Object<string, Function>}
 * @private
 */
const customValidator = {}

/**
 * Mendapatkan fungsi validator kustom berdasarkan nama.
 * @param {string} name - Nama validator kustom.
 * @returns {Function|undefined} Fungsi validator kustom.
 */
export function getCustomValidator(name) {
	return customValidator[name]
}

/**
 * Mendaftarkan fungsi validator kustom baru.
 * @param {string} name - Nama validator kustom.
 * @param {Function} fn - Fungsi validator dengan signature `(value)`.
 */
export function addCustomValidator(name, fn) {
	customValidator[name] = fn
}




/**
 * Memvalidasi apakah nilai wajib diisi (tidak kosong/null/undefined).
 * @param {any} value - Nilai yang divalidasi.
 * @returns {boolean} True jika ada nilainya, false jika kosong.
 */
export function required(value) {
	if (value === null || value === undefined || value === '') {
		return false;		
	}
	return true;
}

/**
 * Memvalidasi apakah nilai termasuk dalam himpunan opsi yang valid.
 * @param {any} value - Nilai yang divalidasi.
 * @param {string} data - String JSON array berisi opsi yang valid (misal: "['A','B']").
 * @returns {boolean} True jika nilai valid.
 */
export function valueIs(value, data) {
	const fixedStr = data.replace(/'/g, '"');
	const arrValid = JSON.parse(fixedStr);
	if (!arrValid.includes(value)) {
		return false
	}

	return true
	
}


/**
 * Memvalidasi panjang minimal string.
 * @param {string} value - Nilai string.
 * @param {number} minLength - Panjang minimal.
 * @returns {boolean} True jika valid.
 */
export function minlength(value, minLength) {
	if (minLength == null || minLength === 0) {
		return true; // no minimum length specified, so always valid
	}
	if (value == null || value.length < minLength) {
		return false; // value is too short
	}
	return true; // value meets the minimum length requirement
}

/**
 * Memvalidasi panjang maksimal string.
 * @param {string} value - Nilai string.
 * @param {number} maxLength - Panjang maksimal.
 * @returns {boolean} True jika valid.
 */
export function maxlength(value, maxLength) {
	if (maxLength == null || maxLength === 0) {
		return true; // no maximum length specified, so always valid
	}
	if (value == null || value.length > maxLength) {
		return false; // value is too long
	}
	return true; // value meets the maximum length requirement
}

/**
 * Memvalidasi nilai string berdasarkan pola ekspresi reguler (placeholder).
 * @param {string} value - Nilai string.
 * @param {string} strpattern - Pola regex.
 * @returns {boolean} Selalu true (belum diimplementasikan).
 */
export function pattern(value, strpattern) {
	return true; // TODO: implement pattern validation
}

/**
 * Memvalidasi apakah nilai adalah alamat email yang valid.
 * @param {string} value - Nilai alamat email.
 * @param {number} [minLength] - Panjang minimal (opsional).
 * @returns {boolean} True jika email valid.
 */
export function email(value, minLength) {
	return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
}

/**
 * Memvalidasi nilai numerik minimal.
 * @param {number} value - Nilai angka.
 * @param {number} minValue - Nilai minimal.
 * @returns {boolean} True jika valid.
 */
export function min(value, minValue) {
	if (minValue == null || minValue === 0) {
		return true; // no minimum value specified, so always valid
	}
	if (value == null || value < minValue) {
		return false; // value is less than minimum
	}
	return true; // value meets the minimum requirement
}

/**
 * Memvalidasi nilai numerik maksimal.
 * @param {number} value - Nilai angka.
 * @param {number} maxValue - Nilai maksimal.
 * @returns {boolean} True jika valid.
 */
export function max(value, maxValue) {
	if (maxValue == null || maxValue === 0) {
		return true; // no maximum value specified, so always valid
	}
	if (value == null || value > maxValue) {
		return false; // value is greater than maximum
	}
	return true; // value meets the maximum requirement
}


/**
 * Helper internal untuk parsing tanggal dan membuang bagian jam/menit/detik untuk perbandingan tanggal saja.
 * @param {string|Date} value - Tanggal yang akan diperiksa.
 * @param {Date} boundaryDate - Tanggal batas.
 * @returns {Object} Objek berisi dt dan boundary yang dinormalisasi.
 * @private
 */
function parseDate(value, boundaryDate) {
	var dtparsed = new Date(value)
	var dt = new Date(dtparsed.getFullYear(), dtparsed.getMonth(), dtparsed.getDate())
	var boundary = new Date(boundaryDate.getFullYear(), boundaryDate.getMonth(), boundaryDate.getDate())
	return {
		dt: dt,
		boundary: boundary
	}
}

/**
 * Memvalidasi tanggal minimal.
 * @param {string|Date} value - Nilai tanggal.
 * @param {Date} minDate - Batas tanggal minimal.
 * @returns {boolean} True jika tanggal valid.
 */
export function mindate(value, minDate) {
	var {dt, boundary} = parseDate(value, minDate)
	if (dt<boundary) {
		return false
	} else {
		return true
	}
}

/**
 * Memvalidasi tanggal maksimal.
 * @param {string|Date} value - Nilai tanggal.
 * @param {Date} maxDate - Batas tanggal maksimal.
 * @returns {boolean} True jika tanggal valid.
 */
export function maxdate(value, maxDate) {
	var {dt, boundary} = parseDate(value, maxDate)
	if (dt>boundary) {
		return false
	} else {
		return true
	}
	
}


/**
 * Memvalidasi waktu minimal (dalam format HH:MM).
 * @param {string} value - Nilai waktu.
 * @param {string} minTime - Batas waktu minimal.
 * @returns {boolean} True jika valid.
 */
export function mintime(value, minTime) {
	if (value<minTime) {
		return false
	} else {
		return true
	}
}

/**
 * Memvalidasi waktu maksimal (dalam format HH:MM).
 * @param {string} value - Nilai waktu.
 * @param {string} maxTime - Batas waktu maksimal.
 * @returns {boolean} True jika valid.
 */
export function maxtime(value, maxTime) {
	if (value>maxTime) {
		return false
	} else {
		return true
	}
}