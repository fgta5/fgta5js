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

export default class Gridview extends Component {
	constructor(id) {
		super(id)
		
		var el = this.Element
		if (el!=undefined) {
			if (el.tagName.toLowerCase()!='table' ) {
				throw new Error(`element '${id}' is not table`)
			}
			grv_construct(this)
		} else {
			throw new Error(`element id '${id}' for gridview is not defined`)
		}
	}

	/* menambahkan satu baris */
	addRow(row) {
		return grv_addRow(this, row)
	}

	/* menambahkan multi baris */
	addRows(rows) {
		grv_addRows(this, rows)
	}


	updateRow(tr, data) {
		grv_updateRow(this, tr, data)
	}


	setNext(nextoffset, limit) {
		// grv_setNext(this, nextoffset, limit)
	}

	scrollToFooter() {
		scrollToFooter(this)
	}

	#columndata
	get Columns() { return this.#columndata }
	setColumnData(columndata) {
		this.#columndata = columndata
	}

	#key
	get Key() { return this.#key }
	setKey(key) {
		this.#key = key
	}



	rowRender(tr) {
		grv_rowRender(this, tr)
	}

	removeSelected(onFinished) {
		grv_removeSelected(this, onFinished)
	}

	hasRowPendingProcess() {
		return grv_hasRowPendingProcess(this)
	}

	addEventListener(evt, callback) {
		this.Listener.addEventListener(evt, callback)
	}

	clear() {
		this.Nodes.Tbody.innerHTML = ''
	}

	setNext(nextoffset, limit)  {
		grv_setNext(this, nextoffset, limit)
	}

	getSort() {
		return grv_getSort(this)
	}

	#criteria = {}
	get Criteria() { return this.#criteria } 
	setCriteria(criteria) {
		this.#criteria = criteria
	}
}


function grv_construct(self) {
	var tbl = self.Element
	var thead = tbl.querySelector('thead')
	var tbody = document.createElement('tbody')
	var tfoot = document.createElement('tfoot')
	
	
	// tambahkan tbody dan tfoot sebelum thead
	tbl.prepend(tfoot)
	tbl.prepend(tbody)

	// tambahkan referensi elemen 
	self.Formatters =  {}
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
	const {headrow, columns, key} =grv_getColumns(self)
	self.setColumnData(columns)
	self.setKey(key)

	// create header
	headrow.remove()
	grv_setupHeader(self, columns)

	


	// const columns = grv_getColumns()
	// grv_createTableHaeder(self, tbl)


}

function scrollToFooter(self) {
	var tfoot = self.Nodes.Tfoot
	tfoot.scrollIntoView({ behavior: 'smooth' });
}


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
		if (rowselector!=null) {
			column.type = TYPE_ROWSELECTOR
		} else if (autonumber!=null) {
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
		column.textalign = textalign=='' ? 'left' : textalign
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

		if (column.type==TYPE_ROWSELECTOR) {
			var chk = createCheckbox()
			chk.addEventListener('change', (evt)=>{ grv_headerCheckboxChange(self, evt)})
			
			th.appendChild(chk)
			th.setAttribute(ATTR_ROWSELECTOR, '')

		} else if (column.type==TYPE_AUTONUMBER) {
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
				sortbtn.addEventListener('click', (evt)=>{ grv_sort(self, sortbtn) })

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




function setAttributeIfNotNull(el, attrname, attrvalue) {
	if (attrvalue!=null) {
		el.setAttribute(attrname, attrvalue)
	}
}

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

function grv_addRows(self, rows) {
	var tbody = self.Nodes.Tbody
	for (var row of rows) {
		grv_addRow(self, row, tbody)
	}
}


function grv_updateRow(self, tr, data) {
	const tds = tr.querySelectorAll('td')
	tds.forEach(td => {
		const name = td.getAttribute('data-name')
		if (name!=null && data[name]!==undefined) {
			// ambil formater column	
			let value =  data[name]
			const func = self.Formatters[name]
			if (typeof func==='function') {
				value = func(data[name])
			} 
			td.innerHTML = value
		}	
	})
	grv_rowRender(self, tr)
}



function grv_addRow(self, row, tbody) {
	if (tbody===undefined) {
		tbody = self.Nodes.Tbody
	}

	var tr = document.createElement('tr')
	tr.classList.add('fgta5-gridview-row')

	var key = self.Key
	if (key!=null) {
		var keyvalue = row[key]
		if (keyvalue!=null) {
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
	
		if (column.type==TYPE_ROWSELECTOR) {
			var chk = createCheckbox()
			chk.addEventListener('change', (evt)=>{ grv_rowCheckboxChange(self, evt) })
			td.appendChild(chk)
			td.setAttribute(ATTR_ROWSELECTOR, '')
		} else if (column.type==TYPE_AUTONUMBER) {
			var linenumber = grv_getLastLineNumber(self)

			linenumber++
			td.setAttribute(ATTR_AUTONUMBER, '')
			td.setAttribute(ATTR_LINENUMBER, linenumber)
			td.innerHTML = linenumber
			td.addEventListener('click', (evt)=>{ grv_cellClick(self, td, tr) })
			td.addEventListener('dblclick', (evt)=>{ grv_cellDblClick(self, td, tr) })
		} else {

			let value = row[column.binding]
			td.setAttribute(ATTR_VALUE, value)

			if (column.formatter!=null) {
				try {
					// 	eval(`value=${column.formatter}`)
					let func = self.Formatters[column.name]
					if (func===undefined) {
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


			if (value!=null) {
				td.innerHTML = value
			} else {
				td.innerHTML = ''
			}

			td.addEventListener('click', (evt)=>{ grv_cellClick(self, td, tr) })
			td.addEventListener('dblclick', (evt)=>{ grv_cellDblClick(self, td, tr) })
		}

		
	
		tr.appendChild(td)
	}

	grv_rowRender(self, tr)
	tbody.appendChild(tr)
	
	return tr
}


function grv_cellClick(self, td, tr) {
	self.Listener.dispatchEvent(cellClickEvent({
		detail: {tr: tr, td: td}
	}))
}

function grv_cellDblClick(self, td, tr) {
	self.Listener.dispatchEvent(cellDblClickEvent({
		detail: {tr: tr, td: td}
	}))
}

function grv_rowRender(self, tr) {
	self.Listener.dispatchEvent(rowRenderEvent({
		detail: {tr: tr}
	}))
}

function grv_sort(self, btn) {
	var sorting = btn.getAttribute(ATTR_SORTING)
	var binding = btn.getAttribute(ATTR_BINDING)
	var th = btn.closest('th')
	
	th.setAttribute(ATTR_BINDING, binding)

	if (sorting==null || sorting=='') {
		// ubah ke ascending
		th.setAttribute(ATTR_SORTING, 'asc')
		btn.setAttribute(ATTR_SORTING, 'asc')
		btn.innerHTML = ICONS.SORTASC
	} else if (sorting=='asc') {
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


function grv_removeSelected(self, onFinished) {
	var chks = self.Nodes.Tbody.querySelectorAll(`tr td[${ATTR_ROWSELECTOR}] input[type="checkbox"]:checked`);
	if (chks.length==0) {
		if (typeof onFinished==='function') {
			onFinished()
		}
		return
	}


	for (var chk of chks) {
		let tr = chk.closest('tr')
		tr.MarkProcessing = (p)=>{
			if (p===true || p===undefined) {
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
			tr.remove()
		}
	}
}


function grv_hasRowPendingProcess(self) {
	var rows = self.Nodes.Tbody.querySelectorAll(`tr[${ATTR_ROWPROCESSING}]`)

	console.log(rows.length)
	if (rows.length > 0) {
		return true
	} else {
		return false
	}
}


function grv_setNext(self, nextoffset, limit) {
	var nextoffsetcontainer = self.Nodes.Tfoot.querySelector('tr[data-nextoffset]')
	if (nextoffsetcontainer!=null) {
		nextoffsetcontainer.remove()
	}
	
	

	if (nextoffset!=null) {
		var tr = document.createElement('tr')
		var td = document.createElement('td')
		var next = document.createElement('a')

		next.innerHTML = 'load next data'
		next.setAttribute('href', 'javascript:void(0)')
		next.addEventListener('click', (evt)=>{
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

function  grv_getSort(self, tr) {
	if (tr==null) {
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


function grv_getLastLineNumber(self) {
	var lastrow = self.Nodes.Tbody.querySelector('tr:last-child td[autonumber]')
	if (lastrow==null) {
		return 0
	}

	var lastlinenumber = lastrow.getAttribute(ATTR_LINENUMBER)
	if (lastlinenumber==null) {
		return 0
	}

	return Number(lastlinenumber)
}


function grv_createFunction(expression) {
    const match = expression.match(/(\w+)\(([^)]+)\)/);
    if (!match) return null;

    const [, funcName, args] = match;
    const parsedArgs = args.split(",").map(arg => parseFloat(arg.trim()));

    if (funcName === "decimal") {
        return (v) => grv_formatDecimal(v, parsedArgs[1]);
    } else if (funcName === 'checkmark') {
		return (v) => grv_formatCheckmark(v)
	}
    return null;
}


function grv_formatDecimal (value, precision)  { 
	const formatterFixed = new Intl.NumberFormat('en-US', {
		minimumFractionDigits: precision,
		maximumFractionDigits: precision
	});
	return formatterFixed.format(value)
}

function grv_formatCheckmark(value) {
	const yes = ICONS.YES
	const no = ICONS.NO

	if (value===undefined || value===null) {
		return no
	}

	if (value===false) {
		return no
	}

	if (value=='0' || value=='' ||value=='-' || value==0) {
		return no
	}

	return yes
}


