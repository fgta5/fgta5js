import ICONS from './Icons.mjs'
import Component from "./Component.mjs"

const ATTR_ROWSELECTOR = 'rowselector'
const ATTR_AUTONUMBER = 'autonumber'
const ATTR_BINDING = 'binding'
const ATTR_SORTING = 'sorting'
const ATTR_FORMATTER = 'formatter'
const ATTR_TEXTALIGN = 'text-align'
const ATTR_ROWSELECTED = 'data-selected'
const ATTR_COLNAME = 'data-name'
const ATTR_VALUE = 'data-value'
const ATTR_ROWKEY = 'key'
const ATTR_ROWKEYVALUE = 'keyvalue'
const ATTR_ROWPROCESSING = 'data-rowprocessing'
const ATTR_MAINHEADROW = 'data-mainrowhead' // menandai row utama header (berisi contol sorting)
const ATTR_LINENUMBER = "linenumber"

const TYPE_ROWSELECTOR = 'rowselector'
const TYPE_AUTONUMBER = 'autonumber'
const TYPE_STANDARD = 'standard'

const cellClickEvent = (data) => { return new CustomEvent('cellclick', data) }
const cellDblClickEvent = (data) => { return new CustomEvent('celldblclick', data) }
const rowRenderEvent = (data) => { return new CustomEvent('rowrender', data) }
const rowRemovingEvent = (data) => { return new CustomEvent('rowremoving', data) }
const sortingEvent = (data) => { return new CustomEvent('sorting', data) }
const nextDataEvent = (data) => { return new CustomEvent('nextdata', data) }

/**
 * Komponen Gridview untuk merender dan mengelola data dalam bentuk tabel HTML.
 * Mendukung penomoran otomatis, seleksi baris, sorting, formatter kolom, dan pemuatan halaman (next data).
 * @extends Component
 */
export default class Gridview extends Component {
	/**
	 * Membuat instans baru dari Gridview.
	 * @param {string} id - ID elemen HTML table.
	 */
	constructor(id) {
		super(id)

		var el = this.Element
		if (el != undefined) {
			if (el.tagName.toLowerCase() != 'table') {
				throw new Error(`element '${id}' is not table`)
			}
			grv_construct(this)
		} else {
			throw new Error(`element id '${id}' for gridview is not defined`)
		}
	}

	/**
	 * Menambahkan satu baris data ke Gridview.
	 * @param {Object} row - Objek data baris.
	 * @returns {HTMLTableRowElement} Elemen baris tabel yang baru dibuat.
	 */
	addRow(row) {
		return grv_addRow(this, row)
	}

	/**
	 * Menambahkan banyak baris data ke Gridview sekaligus.
	 * @param {Object[]} rows - Daftar objek data baris.
	 */
	addRows(rows) {
		grv_addRows(this, rows)
	}


	/**
	 * Memperbarui data nilai pada elemen baris tabel tertentu.
	 * @param {HTMLTableRowElement} tr - Elemen baris tabel.
	 * @param {Object} data - Objek data baru.
	 */
	updateRow(tr, data) {
		grv_updateRow(this, tr, data)
	}


	/**
	 * Mengatur offset data berikutnya untuk pagination (deprecated / placeholder).
	 * @param {number} nextoffset 
	 * @param {number} limit 
	 */
	setNext(nextoffset, limit) {
		// grv_setNext(this, nextoffset, limit)
	}

	/**
	 * Menggulung (scroll) tampilan tabel secara mulus hingga ke bagian footer.
	 */
	scrollToFooter() {
		scrollToFooter(this)
	}

	/**
	 * Konfigurasi kolom gridview.
	 * @type {Object[]}
	 * @private
	 */
	#columndata

	/**
	 * Mendapatkan daftar data konfigurasi kolom.
	 * @returns {Object[]}
	 */
	get Columns() { return this.#columndata }

	/**
	 * Mengeset konfigurasi kolom gridview.
	 * @param {Object[]} columndata 
	 */
	setColumnData(columndata) {
		this.#columndata = columndata
	}

	/**
	 * Nama kolom key pengenal baris.
	 * @type {string|null}
	 * @private
	 */
	#key

	/**
	 * Mendapatkan nama kolom key baris.
	 * @returns {string|null}
	 */
	get Key() { return this.#key }

	/**
	 * Mengeset nama kolom key baris.
	 * @param {string|null} key 
	 */
	setKey(key) {
		this.#key = key
	}



	/**
	 * Memicu proses render baris dan mengirimkan event rowrender.
	 * @param {HTMLTableRowElement} tr - Elemen baris.
	 * @param {Object} args - Parameter render.
	 */
	rowRender(tr, args) {
		console.log('ROOOOW RENDEeEEEEERRRR')
		grv_rowRender(this, tr, args)
	}

	/**
	 * Menghapus baris-baris yang sedang dicentang/dipilih.
	 * @param {Function} [onFinished] - Callback setelah selesai menghapus.
	 */
	removeSelected(onFinished) {
		grv_removeSelected(this, onFinished)
	}

	/**
	 * Menghapus baris tabel tertentu dari Gridview.
	 * @param {HTMLTableRowElement} tr - Elemen baris tabel.
	 */
	removeRow(tr) {
		grv_removeRow(this, tr)
	}

	/**
	 * Mendapatkan nilai key dari baris-baris data yang saat ini dicentang/dipilih.
	 * @returns {string[]} Daftar nilai key terpilih.
	 */
	getSelected() {
		return grv_getSelected(this)
	}


	/**
	 * Memeriksa apakah ada baris yang sedang dalam status pemrosesan asinkron.
	 * @returns {boolean} True jika ada baris yang masih diproses.
	 */
	hasRowPendingProcess() {
		return grv_hasRowPendingProcess(this)
	}

	/**
	 * Menambahkan event listener ke Gridview.
	 * @param {string} evt - Nama event (misal: 'cellclick', 'celldblclick', 'rowrender', 'sorting', 'nextdata').
	 * @param {Function} callback - Callback function.
	 */
	addEventListener(evt, callback) {
		this.Listener.addEventListener(evt, callback)
	}

	/**
	 * Mengosongkan seluruh baris data di bagian tbody Gridview.
	 */
	clear() {
		this.Nodes.Tbody.innerHTML = ''
	}

	/**
	 * Mengatur pagination offset berikutnya dengan tombol muat data baru di footer.
	 * @param {number|null} nextoffset - Offset data selanjutnya.
	 * @param {number} limit - Batas jumlah data.
	 */
	setNext(nextoffset, limit) {
		grv_setNext(this, nextoffset, limit)
	}

	/**
	 * Mendapatkan status sorting kolom saat ini.
	 * @returns {Object<string, string>} Mapping nama kolom ke arah urutan ('asc'|'desc').
	 */
	getSort() {
		return grv_getSort(this)
	}

	/**
	 * Kriteria filter pencarian data.
	 * @type {Object}
	 * @private
	 */
	#criteria = {}

	/**
	 * Mendapatkan kriteria filter pencarian data saat ini.
	 * @returns {Object}
	 */
	get Criteria() { return this.#criteria }

	/**
	 * Mengeset kriteria filter pencarian data.
	 * @param {Object} criteria 
	 */
	setCriteria(criteria) {
		this.#criteria = criteria
	}


	/**
	 * Baris tabel yang saat ini aktif/terpilih.
	 * @type {HTMLTableRowElement|null}
	 * @private
	 */
	#currentRow

	/**
	 * Mendapatkan elemen baris tabel yang saat ini aktif.
	 * @returns {HTMLTableRowElement|null}
	 */
	get CurrentRow() { return this.#currentRow }

	/**
	 * Mengatur elemen baris tabel yang saat ini aktif.
	 * @param {HTMLTableRowElement|null} tr 
	 */
	set CurrentRow(tr) {
		this.#currentRow = tr
		grv_setCurentRow(this, tr)
	}



	/**
	 * Pindah fokus ke baris sebelumnya pada Gridview.
	 */
	previousRecord() {
		grv_previousRecord(this)
	}

	/**
	 * Pindah fokus ke baris berikutnya pada Gridview.
	 */
	nextRecord() {
		grv_nextRecord(this)
	}
}


/**
 * Memindahkan fokus baris saat ini ke baris sebelumnya.
 * @param {Gridview} self - Instans Gridview.
 * @private
 */
function grv_previousRecord(self) {
	const currentRow = self.CurrentRow
	if (currentRow == null) {
		// set row pertama sebagai current row
		console.log('set current row to first row')
		const tbody = self.Nodes.Tbody
		const tr = tbody.querySelector('tr')
		self.CurrentRow = tr
	} else {
		const tr = currentRow
		if (tr.previousElementSibling) {
			self.CurrentRow = tr.previousElementSibling
		}
	}
}


/**
 * Memindahkan fokus baris saat ini ke baris berikutnya.
 * @param {Gridview} self - Instans Gridview.
 * @private
 */
function grv_nextRecord(self) {
	const currentRow = self.CurrentRow
	if (currentRow == null) {
		// set row pertama sebagai current row
		console.log('set current row to first row')
		const tbody = self.Nodes.Tbody
		const tr = tbody.querySelector('tr')
		self.CurrentRow = tr
	} else {
		const tr = currentRow
		if (tr.nextElementSibling) {
			self.CurrentRow = tr.nextElementSibling
		}
	}
}


/**
 * Mengatur baris tabel aktif dan menghapus penanda aktif pada baris lainnya.
 * @param {Gridview} self - Instans Gridview.
 * @param {HTMLTableRowElement|null} tr - Elemen baris tabel baru.
 * @private
 */
function grv_setCurentRow(self, tr) {
	// kosongkan atribute terpilih	
	const tbody = self.Nodes.Tbody
	const rows = tbody.querySelectorAll('tr[data-currentrow]')
	rows.forEach(tr => {
		tr.removeAttribute('data-currentrow')
	})

	if (tr != null) {
		// set atribut terpilih untuk tr
		tr.setAttribute('data-currentrow', '')
		if (!isElementInViewport(tr)) {
			tr.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	}
}

/**
 * Menghapus baris tertentu dari tbody.
 * @param {Gridview} self - Instans Gridview.
 * @param {HTMLTableRowElement} tr - Elemen baris.
 * @private
 */
function grv_removeRow(self, tr) {
	const tbody = self.Nodes.Tbody
	tr.remove()
	if (tbody.children.length == 0) {
		self.CurrentRow = null
	}
}

/**
 * Memeriksa apakah elemen berada di dalam viewport browser.
 * @param {HTMLElement} el - Elemen HTML.
 * @returns {boolean} True jika terlihat.
 * @private
 */
function isElementInViewport(el) {
	const rect = el.getBoundingClientRect();
	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
		rect.right <= (window.innerWidth || document.documentElement.clientWidth)
	);
}

/**
 * Menginisialisasi Gridview, menyusun tbody, tfoot, mendaftarkan formatter, dan membaca kolom.
 * @param {Gridview} self - Instans Gridview.
 * @private
 */
function grv_construct(self) {
	var tbl = self.Element
	var thead = tbl.querySelector('thead')
	var tbody = document.createElement('tbody')
	var tfoot = document.createElement('tfoot')


	// tambahkan tbody dan tfoot sebelum thead
	tbl.prepend(tfoot)
	tbl.prepend(tbody)

	// tambahkan referensi elemen 
	self.Formatters = {}
	self.Listener = new EventTarget()
	self.Nodes = {
		Table: tbl,
		Thead: thead,
		Tbody: tbody,
		Tfoot: tfoot
	}


	// setup table
	tbl.classList.add('fgta5-gridview')
	tbl.setAttribute('cellspacing', 0)


	// baca kolom
	const { headrow, columns, key } = grv_getColumns(self)
	self.setColumnData(columns)
	self.setKey(key)

	// create header
	headrow.remove()
	grv_setupHeader(self, columns)




	// const columns = grv_getColumns()
	// grv_createTableHaeder(self, tbl)


}

/**
 * Menggulung tampilan tabel secara mulus hingga ke bagian footer.
 * @param {Gridview} self - Instans Gridview.
 * @private
 */
function scrollToFooter(self) {
	var tfoot = self.Nodes.Tfoot
	tfoot.scrollIntoView({ behavior: 'smooth' });
}


/**
 * Membaca konfigurasi kolom dari tag `<th>` dalam template tabel HTML.
 * @param {Gridview} self - Instans Gridview.
 * @returns {Object} Objek berisi headrow, daftar objek kolom, dan nama key.
 * @private
 */
function grv_getColumns(self) {
	var columns = []
	var thead = self.Nodes.Thead
	var headrow = thead.querySelector("tr[data-header]")
	var ths = headrow.querySelectorAll("th")
	for (var th of ths) {
		let column = {}
		var rowselector = th.getAttribute(ATTR_ROWSELECTOR)
		var autonumber = th.getAttribute(ATTR_AUTONUMBER)
		var binding = th.getAttribute(ATTR_BINDING)
		var name = th.getAttribute(ATTR_COLNAME)
		var formatter = th.getAttribute(ATTR_FORMATTER)
		var textalign = (th.getAttribute(ATTR_TEXTALIGN) ?? '').toLowerCase()
		var sorting = (th.getAttribute(ATTR_SORTING) ?? '').toLowerCase() === "true" ? true : false
		var cssclass = th.getAttribute('class')
		var cssstyle = th.getAttribute('style')
		var html = th.innerHTML



		// baca tipe column
		if (rowselector != null) {
			column.type = TYPE_ROWSELECTOR
		} else if (autonumber != null) {
			column.type = TYPE_AUTONUMBER
		} else {
			column.type = TYPE_STANDARD
		}

		// ambil daftar class
		column.cssclass = cssclass
		column.cssstyle = cssstyle
		column.binding = binding
		column.name = name
		column.formatter = formatter
		column.textalign = textalign == '' ? 'left' : textalign
		column.sorting = sorting
		column.html = html

		columns.push(column)
	}

	var key = headrow.getAttribute(ATTR_ROWKEY)

	return {
		headrow: headrow,
		columns: columns,
		key: key
	}
}


/**
 * Menyusun baris header tabel berdasarkan daftar konfigurasi kolom.
 * @param {Gridview} self - Instans Gridview.
 * @param {Object[]} columns - Daftar kolom.
 * @private
 */
function grv_setupHeader(self, columns) {
	var tr = document.createElement('tr')
	tr.setAttribute(ATTR_MAINHEADROW, '')

	for (let column of columns) {
		var th = document.createElement('th')

		setAttributeIfNotNull(th, 'class', column.cssclass)
		setAttributeIfNotNull(th, 'style', column.cssstyle)
		setAttributeIfNotNull(th, ATTR_COLNAME, column.name)

		th.classList.add('fgta5-gridview-head')
		th.setAttribute(ATTR_TEXTALIGN, column.textalign)

		if (column.type == TYPE_ROWSELECTOR) {
			var chk = createCheckbox()
			chk.addEventListener('change', (evt) => { grv_headerCheckboxChange(self, evt) })

			th.appendChild(chk)
			th.setAttribute(ATTR_ROWSELECTOR, '')

		} else if (column.type == TYPE_AUTONUMBER) {
			th.setAttribute(ATTR_AUTONUMBER, '')
			th.innerHTML = column.html
		} else {

			if (column.sorting) {
				var container = document.createElement('span')
				container.setAttribute('container', '')
				container.setAttribute(ATTR_TEXTALIGN, column.textalign)

				let sortbtn = document.createElement('button')
				sortbtn.innerHTML = ICONS.UNSORT
				sortbtn.setAttribute(ATTR_SORTING, '')
				sortbtn.setAttribute(ATTR_BINDING, column.binding)
				sortbtn.addEventListener('click', (evt) => { grv_sort(self, sortbtn) })

				var text = document.createElement('div')
				text.innerHTML = column.html

				container.appendChild(sortbtn)
				container.appendChild(text)

				th.classList.add('fgta5-gridview-colwithbutton')
				th.appendChild(container)

			} else {

				var text = document.createTextNode(column.html)
				th.appendChild(text)
			}




		}

		tr.appendChild(th)
	}
	self.Nodes.Thead.appendChild(tr)
}




/**
 * Mengeset atribut elemen jika nilai atribut tidak null.
 * @param {HTMLElement} el - Elemen HTML.
 * @param {string} attrname - Nama atribut.
 * @param {string|null} attrvalue - Nilai atribut.
 * @private
 */
function setAttributeIfNotNull(el, attrname, attrvalue) {
	if (attrvalue != null) {
		el.setAttribute(attrname, attrvalue)
	}
}

/**
 * Membuat elemen checkbox kustom bermodel fgta5.
 * @returns {HTMLLabelElement} Elemen pembungkus label checkbox.
 * @private
 */
function createCheckbox() {
	var chk = document.createElement('label')
	var input = document.createElement('input')
	var span = document.createElement('span')

	chk.classList.add('fgta5-gridview-checkbox')
	chk.appendChild(input)
	chk.appendChild(span)
	chk.checkbox = input

	input.setAttribute('type', 'checkbox')

	span.classList.add('fgta5-gridview-checkmark')

	return chk
}


/**
 * Event handler ketika checkbox utama di header dicentang/tidak, untuk mengubah semua baris.
 * @param {Gridview} self - Instans Gridview.
 * @param {Event} evt - Event objek.
 * @private
 */
function grv_headerCheckboxChange(self, evt) {
	var headchk = evt.target
	var trs = self.Nodes.Tbody.querySelectorAll('tr');
	for (var tr of trs) {
		var chk = tr.querySelector(`td[${ATTR_ROWSELECTOR}] input[type="checkbox"]`)
		chk.checked = headchk.checked
		if (headchk.checked) {
			tr.setAttribute(ATTR_ROWSELECTED, '')
		} else {
			tr.removeAttribute(ATTR_ROWSELECTED)
		}
	}
}

/**
 * Event handler ketika checkbox pada baris tabel dicentang/tidak.
 * @param {Gridview} self - Instans Gridview.
 * @param {Event} evt - Event objek.
 * @private
 */
function grv_rowCheckboxChange(self, evt) {
	var chk = evt.target
	var tr = chk.closest('tr')
	if (chk.checked) {
		tr.setAttribute(ATTR_ROWSELECTED, '')
	} else {
		tr.removeAttribute(ATTR_ROWSELECTED)

		// uncheck header
		var headchk = self.Nodes.Thead.querySelector(`tr th[${ATTR_ROWSELECTOR}] input[type="checkbox"]`)
		headchk.checked = false
	}
}

/**
 * Menambahkan banyak baris data ke tbody Gridview.
 * @param {Gridview} self - Instans Gridview.
 * @param {Object[]} rows - Daftar objek data.
 * @private
 */
function grv_addRows(self, rows) {
	var tbody = self.Nodes.Tbody
	for (var row of rows) {
		grv_addRow(self, row, tbody)
	}
}


/**
 * Memperbarui teks pada sel-sel baris tabel sesuai dengan data baru dan memanggil event render.
 * @param {Gridview} self - Instans Gridview.
 * @param {HTMLTableRowElement} tr - Elemen baris tabel.
 * @param {Object} data - Objek data baru.
 * @private
 */
function grv_updateRow(self, tr, data) {
	const tds = tr.querySelectorAll('td')
	tds.forEach(td => {
		const name = td.getAttribute('data-name')
		if (name != null && data[name] !== undefined) {
			// ambil formater column	
			let value = data[name]
			const func = self.Formatters[name]
			if (typeof func === 'function') {
				value = func(data[name])
			}
			td.innerHTML = value
		}
	})
	grv_rowRender(self, tr, {
		rowevent: 'update',
		data: data
	})
}



/**
 * Membuat elemen `<tr>` baris tabel baru, memformat data, menyusun sel `<td>`, mendaftarkan event click/dblclick, dan menambahkannya ke DOM.
 * @param {Gridview} self - Instans Gridview.
 * @param {Object} row - Data objek baris.
 * @param {HTMLTableSectionElement} [tbody] - Elemen tbody opsional.
 * @returns {HTMLTableRowElement}
 * @private
 */
function grv_addRow(self, row, tbody) {
	if (tbody === undefined) {
		tbody = self.Nodes.Tbody
	}

	var tr = document.createElement('tr')
	tr.classList.add('fgta5-gridview-row')

	var key = self.Key
	if (key != null) {
		var keyvalue = row[key]
		if (keyvalue != null) {
			tr.setAttribute(ATTR_ROWKEY, key)
			tr.setAttribute(ATTR_ROWKEYVALUE, keyvalue)
		}
	}

	for (var column of self.Columns) {
		let td = document.createElement('td')

		setAttributeIfNotNull(td, 'class', column.cssclass)
		setAttributeIfNotNull(td, 'style', column.cssstyle)
		setAttributeIfNotNull(td, ATTR_COLNAME, column.name)
		setAttributeIfNotNull(td, ATTR_BINDING, column.binding)
		setAttributeIfNotNull(td, ATTR_FORMATTER, column.formatter)
		setAttributeIfNotNull(td, ATTR_TEXTALIGN, column.textalign)


		td.classList.add('fgta5-gridview-cell')

		if (column.type == TYPE_ROWSELECTOR) {
			var chk = createCheckbox()
			chk.addEventListener('change', (evt) => { grv_rowCheckboxChange(self, evt) })
			td.appendChild(chk)
			td.setAttribute(ATTR_ROWSELECTOR, '')
		} else if (column.type == TYPE_AUTONUMBER) {
			var linenumber = grv_getLastLineNumber(self)

			linenumber++
			td.setAttribute(ATTR_AUTONUMBER, '')
			td.setAttribute(ATTR_LINENUMBER, linenumber)
			td.innerHTML = linenumber
			td.addEventListener('click', (evt) => { grv_cellClick(self, td, tr) })
			td.addEventListener('dblclick', (evt) => { grv_cellDblClick(self, td, tr) })
		} else {

			let value = row[column.binding]
			td.setAttribute(ATTR_VALUE, value)

			if (column.formatter != null) {
				try {
					// 	eval(`value=${column.formatter}`)
					let func = self.Formatters[column.name]
					if (func === undefined) {
						func = grv_createFunction(column.formatter)
						if (typeof func === 'function') {
							self.Formatters[column.name] = func
						}
					}

					if (typeof func === 'function') {
						value = func(value)
					}
				} catch (err) {
					console.error(err)
				}
			}


			if (value != null) {
				td.innerHTML = value
			} else {
				td.innerHTML = ''
			}

			td.addEventListener('click', (evt) => { grv_cellClick(self, td, tr) })
			td.addEventListener('dblclick', (evt) => { grv_cellDblClick(self, td, tr) })
		}



		tr.appendChild(td)
	}

	grv_rowRender(self, tr, {
		rowevent: 'add',
		data: row
	})

	if (tbody.children.length == 0) {
		self.CurrentRow = tr
	}


	tbody.appendChild(tr)

	return tr
}


/**
 * Event handler saat sel diklik untuk menetapkan baris aktif dan mengirimkan event cellclick.
 * @param {Gridview} self - Instans Gridview.
 * @param {HTMLTableCellElement} td - Elemen sel.
 * @param {HTMLTableRowElement} tr - Elemen baris.
 * @private
 */
function grv_cellClick(self, td, tr) {
	self.CurrentRow = tr
	self.Listener.dispatchEvent(cellClickEvent({
		detail: { tr: tr, td: td }
	}))
}

/**
 * Event handler saat sel diklik dua kali untuk mengirimkan event celldblclick.
 * @param {Gridview} self - Instans Gridview.
 * @param {HTMLTableCellElement} td - Elemen sel.
 * @param {HTMLTableRowElement} tr - Elemen baris.
 * @private
 */
function grv_cellDblClick(self, td, tr) {
	self.CurrentRow = tr
	self.Listener.dispatchEvent(cellDblClickEvent({
		detail: { tr: tr, td: td }
	}))
}

/**
 * Mengirimkan event rowrender kustom saat baris selesai digambar/diperbarui.
 * @param {Gridview} self - Instans Gridview.
 * @param {HTMLTableRowElement} tr - Elemen baris.
 * @param {Object} args - Objek status baris.
 * @private
 */
function grv_rowRender(self, tr, args) {
	self.Listener.dispatchEvent(rowRenderEvent({
		detail: {
			tr: tr,
			args: args
		}
	}))
}

/**
 * Mengubah indikator sorting kolom, menyusun kriteria sort dan memicu event sorting.
 * @param {Gridview} self - Instans Gridview.
 * @param {HTMLButtonElement} btn - Tombol sort kolom.
 * @private
 */
function grv_sort(self, btn) {
	var sorting = btn.getAttribute(ATTR_SORTING)
	var binding = btn.getAttribute(ATTR_BINDING)
	var th = btn.closest('th')

	th.setAttribute(ATTR_BINDING, binding)

	if (sorting == null || sorting == '') {
		// ubah ke ascending
		th.setAttribute(ATTR_SORTING, 'asc')
		btn.setAttribute(ATTR_SORTING, 'asc')
		btn.innerHTML = ICONS.SORTASC
	} else if (sorting == 'asc') {
		// ubah ke desc
		th.setAttribute(ATTR_SORTING, 'desc')
		btn.setAttribute(ATTR_SORTING, 'desc')
		btn.innerHTML = ICONS.SORTDESC
	} else {
		// ubah ke unsort
		th.removeAttribute(ATTR_SORTING)
		btn.setAttribute(ATTR_SORTING, '')
		btn.innerHTML = ICONS.UNSORT
	}

	// ambil semua kolom yang di sort
	const tr = btn.closest('tr')
	const sort = grv_getSort(self, tr)
	const criteria = self.Criteria

	self.Listener.dispatchEvent(sortingEvent({
		detail: {
			sort: sort,
			criteria: criteria

		}
	}))

}


/**
 * Mendapatkan semua keyvalue dari baris-baris terpilih (yang dicentang).
 * @param {Gridview} self - Instans Gridview.
 * @returns {string[]}
 * @private
 */
function grv_getSelected(self) {
	var chks = self.Nodes.Tbody.querySelectorAll(`tr td[${ATTR_ROWSELECTOR}] input[type="checkbox"]:checked`);
	if (chks.length == 0) {
		return []
	}

	const selected = []
	for (let chk of chks) {
		const tr = chk.closest('tr')
		const keyvalue = tr.getAttribute(ATTR_ROWKEYVALUE)
		selected.push(keyvalue)
	}

	return selected
}

/**
 * Menghapus semua baris data terpilih dan memicu event rowremoving jika terdaftar.
 * @param {Gridview} self - Instans Gridview.
 * @param {Function} [onFinished] - Callback setelah selesai.
 * @private
 */
function grv_removeSelected(self, onFinished) {
	var chks = self.Nodes.Tbody.querySelectorAll(`tr td[${ATTR_ROWSELECTOR}] input[type="checkbox"]:checked`);
	if (chks.length == 0) {
		if (typeof onFinished === 'function') {
			onFinished()
		}
		return
	}


	for (var chk of chks) {
		let tr = chk.closest('tr')
		tr.MarkProcessing = (p) => {
			if (p === true || p === undefined) {
				tr.setAttribute(ATTR_ROWPROCESSING, '')
			} else {
				tr.removeAttribute(ATTR_ROWPROCESSING)
			}
		}

		let evt = rowRemovingEvent({
			detail: {
				tr: tr,
				onFinished: onFinished
			}
		})

		tr.MarkProcessing()
		self.Listener.dispatchEvent(evt)
		if (!evt.handled) {
			tr.MarkProcessing(false)
			self.removeRow(tr)
		}
	}
}


/**
 * Memeriksa apakah terdapat baris yang sedang dalam status diproses.
 * @param {Gridview} self - Instans Gridview.
 * @returns {boolean}
 * @private
 */
function grv_hasRowPendingProcess(self) {
	var rows = self.Nodes.Tbody.querySelectorAll(`tr[${ATTR_ROWPROCESSING}]`)

	console.log(rows.length)
	if (rows.length > 0) {
		return true
	} else {
		return false
	}
}


/**
 * Merender link 'load next data' di bagian tfoot tabel untuk memuat halaman berikutnya.
 * @param {Gridview} self - Instans Gridview.
 * @param {number|null} nextoffset - Offset data selanjutnya.
 * @param {number} limit - Jumlah data per halaman.
 * @private
 */
function grv_setNext(self, nextoffset, limit) {
	var nextoffsetcontainer = self.Nodes.Tfoot.querySelector('tr[data-nextoffset]')
	if (nextoffsetcontainer != null) {
		nextoffsetcontainer.remove()
	}



	if (nextoffset != null) {
		var tr = document.createElement('tr')
		var td = document.createElement('td')
		var next = document.createElement('a')

		next.innerHTML = 'load next data'
		next.setAttribute('href', 'javascript:void(0)')
		next.addEventListener('click', (evt) => {
			self.Listener.dispatchEvent(nextDataEvent({
				detail: {
					criteria: self.Criteria,
					nextoffset: nextoffset,
					limit: limit,
					sort: self.getSort()
				}
			}))
		})

		var colspan = self.Nodes.Tbody.rows[0].cells.length
		td.setAttribute('colspan', colspan)
		td.setAttribute('align', 'center')
		td.setAttribute('data-nextoffset', '')
		td.appendChild(next)

		tr.setAttribute('data-nextoffset', '')
		tr.appendChild(td)
		self.Nodes.Tfoot.appendChild(tr)

	}
}

/**
 * Mendapatkan set kolom-kolom yang sedang disortir dari tr headrow.
 * @param {Gridview} self - Instans Gridview.
 * @param {HTMLTableRowElement} [tr] - Baris header utama.
 * @returns {Object<string, string>} Objek sort dengan format key binding dan value tipe sort ('asc'/'desc').
 * @private
 */
function grv_getSort(self, tr) {
	if (tr == null) {
		tr = self.Nodes.Thead.querySelector(`tr[${ATTR_MAINHEADROW}]`)
	}

	var ths = tr.querySelectorAll(`th[${ATTR_SORTING}]`)
	var sort = {}
	for (var th of ths) {
		var sorting = th.getAttribute(ATTR_SORTING)
		var binding = th.getAttribute(ATTR_BINDING)
		sort[binding] = sorting
	}

	return sort
}


/**
 * Mendapatkan nomor baris terakhir (line number) dari kolom penomoran otomatis.
 * @param {Gridview} self - Instans Gridview.
 * @returns {number} Nomor baris terakhir, atau 0 jika kosong.
 * @private
 */
function grv_getLastLineNumber(self) {
	var lastrow = self.Nodes.Tbody.querySelector('tr:last-child td[autonumber]')
	if (lastrow == null) {
		return 0
	}

	var lastlinenumber = lastrow.getAttribute(ATTR_LINENUMBER)
	if (lastlinenumber == null) {
		return 0
	}

	return Number(lastlinenumber)
}


/**
 * Membuat fungsi pemformat nilai sel berdasarkan ekspresi formatter string.
 * @param {string} expression - Ekspresi formatter (misal: "decimal(2)").
 * @returns {Function|null} Fungsi formatter.
 * @private
 */
function grv_createFunction(expression) {
	const match = expression.match(/(\w+)\(([^)]+)\)/);
	if (!match) return null;

	const [, funcName, args] = match;
	const parsedArgs = args.split(",").map(arg => parseFloat(arg.trim()));

	if (funcName === "decimal") {
		return (v) => grv_formatDecimal(v, parsedArgs[1]);
	} else if (funcName === 'int') {
		return (v) => grv_formatInteger(v)
	} else if (funcName === 'checkmark') {
		return (v) => grv_formatCheckmark(v)
	} else if (funcName === 'dateiso') {
		return (v) => grv_formatDateIso(v)
	} else if (funcName === 'datelong') {
		return (v) => grv_formatDateLong(v)
	} else if (funcName === 'dateshort' || funcName === 'date') {
		return (v) => grv_formatDateShort(v)
	}
	return null;
}


/**
 * Memformat angka menjadi format desimal sesuai presisi tertentu.
 * @param {number} value - Nilai angka.
 * @param {number} precision - Presisi angka di belakang koma.
 * @returns {string}
 * @private
 */
function grv_formatDecimal(value, precision) {
	const formatterFixed = new Intl.NumberFormat('en-US', {
		minimumFractionDigits: precision,
		maximumFractionDigits: precision
	});
	return formatterFixed.format(value)
}

/**
 * Memformat angka menjadi integer tanpa koma desimal.
 * @param {number} value - Nilai angka.
 * @returns {string}
 * @private
 */
function grv_formatInteger(value) {
	const formatterFixed = new Intl.NumberFormat('en-US', {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
		useGrouping: false
	});
	return formatterFixed.format(value)
}

/**
 * Memformat nilai boolean/status menjadi ikon centang atau tanda silang.
 * @param {any} value - Nilai boolean atau string status.
 * @returns {string} String HTML ikon.
 * @private
 */
function grv_formatCheckmark(value) {
	const yes = ICONS.YES
	const no = ICONS.NO

	if (value === undefined || value === null) {
		return no
	}

	if (value === false) {
		return no
	}

	if (value == '0' || value == '' || value == '-' || value == 0) {
		return no
	}

	return yes
}

/**
 * Memformat tanggal menjadi format ISO (YYYY-MM-DD).
 * @param {string|Date} value - Nilai tanggal.
 * @returns {string}
 * @private
 */
function grv_formatDateIso(value) {
	const dt = new Date(value)
	const str = dt.toISOString().split("T")[0]
	return str
}

/**
 * Memformat tanggal menjadi format panjang lokal (DD MMM YYYY).
 * @param {string|Date} value - Nilai tanggal.
 * @returns {string}
 * @private
 */
function grv_formatDateLong(value) {
	const dt = new Date(value)
	const options = { day: '2-digit', month: 'short', year: 'numeric' };
	const formattedDate = dt.toLocaleDateString('en-ID', options).replace('.', '');
	return formattedDate
}

/**
 * Memformat tanggal menjadi format pendek (DD/MM/YYYY).
 * @param {string|Date} value - Nilai tanggal.
 * @returns {string}
 * @private
 */
function grv_formatDateShort(value) {
	const dt = new Date(value)
	const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
	const formattedDate = dt.toLocaleDateString('en-ID', options).replace('.', '');
	return formattedDate
}
