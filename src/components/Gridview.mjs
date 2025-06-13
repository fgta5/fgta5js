import Component from "./Component.mjs"

const ATTR_ROWSELECTOR = 'rowselector'
const ATTR_AUTONUMBER = 'autonumber'
const ATTR_BINDING = 'binding'
const ATTR_SORTING = 'sorting'
const ATTR_FORMATTER = 'formatter'
const ATTR_ROWSELECTED = 'data-selected'
const ATTR_COLNAME = 'data-name'
const ATTR_VALUE = 'data-value'
const ATTR_ROWKEY = 'key'
const ATTR_ROWKEYVALUE = 'keyvalue'
const ATTR_ROWPROCESSING = 'data-rowprocessing'

const TYPE_ROWSELECTOR = 'rowselector'
const TYPE_AUTONUMBER = 'autonumber'
const TYPE_STANDARD = 'standard'

const ICON_UNSORT = `<?xml version="1.0" encoding="UTF-8"?>
<svg version="1.1" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
<path d="m2.1656 5.2663 3.8057-4.6994 3.8057 4.6994z"/>
<path d="m2.1656 6.6955 3.8057 4.6994 3.8057-4.6994z"/>
</svg>`

const ICON_SORTASC = `<?xml version="1.0" encoding="UTF-8"?>
<svg version="1.1" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
<path d="m2.1943 9.1198 3.8057-6.5338 3.8057 6.5338z"/>
</svg>`

const ICON_SORTDESC = `<?xml version="1.0" encoding="UTF-8"?>
<svg version="1.1" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
<path d="m2.1943 2.586 3.8057 6.5338 3.8057-6.5338z"/>
</svg>
`

const CellClickEvent = (data) => { return new CustomEvent('cellclick', data) }
const RowRenderEvent = (data) => { return new CustomEvent('rowrender', data) }
const RowRemovingEvent = (data) => { return new CustomEvent('rowremoving', data) }
const SortingEvent = (data) => { return new CustomEvent('sorting', data) }
const NextDataEvent = (data) => { return new CustomEvent('nextdata', data) }


export default class Gridview extends Component {
	constructor(id) {
		super(id)
		
		var el = this.Element
		if (el!=undefined) {
			if (el.tagName.toLowerCase()!='table' ) {
				throw new Error(`element '${id}' is not table`)
			}
			Gridview_construct(this)
		} else {
			throw new Error(`element id '${id}' for gridview is not defined`)
		}
	}

	AddRow(row) {
		Gridview_AddRows(this, row)
	}

	AddRows(rows) {
		Gridview_AddRows(this, rows)
	}

	SetNext(nextoffset, limit) {
		// GridView_SetNext(this, nextoffset, limit)
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


	RemoveSelected(onFinished) {
		GridView_RemoveSelected(this, onFinished)
	}

	HasRowPendingProcess() {
		return GridView_HasRowPendingProcess(this)
	}

	addEventListener(evt, callback) {
		this.Listener.addEventListener(evt, callback)
	}

	Clear() {
		this.Nodes.Tbody.innerHTML = ''
	}

	SetNext(searchtext, nextoffset, limit)  {
		GridView_SetNext(this, searchtext, nextoffset, limit)
		// btnnext.nextoffset = nextoffset
		// btnnext.limit = limit
		// if (nextoffset!=null && nextoffset!=0) {
		// 	btnnext.style.display = 'inline-block'
		// } else {
		// 	btnnext.style.display = 'none'
		// }
	}

}


function Gridview_construct(self) {
	var tbl = self.Element
	var thead = tbl.querySelector('thead')
	var tbody = document.createElement('tbody')
	var tfoot = document.createElement('tfoot')
	
	
	// tambahkan tbody dan tfoot sebelum thead
	tbl.prepend(tfoot)
	tbl.prepend(tbody)

	// tambahkan referensi elemen 
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
	const {headrow, columns, key} =Gridview_getColumns(self)
	self.setColumnData(columns)
	self.setKey(key)

	// create header
	headrow.remove()
	Gridview_setupHeader(self, columns)

	


	// const columns = Gridview_getColumns()
	// Gridview_createTableHaeder(self, tbl)


}


function Gridview_getColumns(self) {
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


function Gridview_setupHeader(self, columns) {
	var tr = document.createElement('tr')
	for (let column of columns) {
		var th = document.createElement('th')

		setAttributeIfNotNull(th, 'class', column.cssclass)
		setAttributeIfNotNull(th, 'style', column.cssstyle)
		setAttributeIfNotNull(th, ATTR_COLNAME, column.name)

		th.classList.add('fgta5-gridview-head')

		if (column.type==TYPE_ROWSELECTOR) {
			var chk = createCheckbox()
			chk.addEventListener('change', (evt)=>{ Gridview_headerCheckboxChange(self, evt)})
			
			th.appendChild(chk)
			th.setAttribute(ATTR_ROWSELECTOR, '')

		} else if (column.type==TYPE_AUTONUMBER) {
			th.setAttribute(ATTR_AUTONUMBER, '')
			th.innerHTML = column.html
		} else {

			var container = document.createElement('div')

			// tambahkan button sorting, jika ada property sorting==true 
			if (column.sorting) {
				let sortbtn = document.createElement('div')
				sortbtn.innerHTML = ICON_UNSORT
				sortbtn.classList.add('fgta5-gridview-sortbutton')
				sortbtn.setAttribute(ATTR_SORTING, '')
				sortbtn.setAttribute(ATTR_BINDING, column.binding)
				sortbtn.addEventListener('click', (evt)=>{ Gridview_sort(self, sortbtn) })
				container.appendChild(sortbtn)
			}
		
			var text = document.createElement('div')
			text.innerHTML = column.html
			container.appendChild(text)
			th.appendChild(container)
			
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


function Gridview_headerCheckboxChange(self, evt) {
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

function Gridview_rowCheckboxChange(self, evt) {
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

function Gridview_AddRows(self, rows) {
	var tbody = self.Nodes.Tbody
	for (var row of rows) {
		GridView_AddRow(self, row, tbody)
	}
}


function GridView_AddRow(self, row, tbody) {
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
		setAttributeIfNotNull(td, ATTR_COLNAME, column.name)

		td.classList.add('fgta5-gridview-cell')

		if (column.type==TYPE_ROWSELECTOR) {
			var chk = createCheckbox()
			chk.addEventListener('change', (evt)=>{ Gridview_rowCheckboxChange(self, evt) })

			td.appendChild(chk)
			td.setAttribute(ATTR_ROWSELECTOR, '')
		} else if (column.type==TYPE_AUTONUMBER) {
			td.setAttribute(ATTR_AUTONUMBER, '')
			td.addEventListener('click', (evt)=>{ GridView_cellClick(self, td, tr) })
		} else {
			var value = row[column.binding]
			if (value!=null) {
				td.innerHTML = value
				td.setAttribute(ATTR_VALUE, value)
			} else {
				td.innerHTML = ''
			}
			td.addEventListener('click', (evt)=>{ GridView_cellClick(self, td, tr) })
		}
		tr.appendChild(td)
	}

	GridView_rowRender(self, tr)
	tbody.appendChild(tr)
	

}


function GridView_cellClick(self, td, tr) {
	self.Listener.dispatchEvent(CellClickEvent({
		detail: {tr: tr, td: td}
	}))
}

function GridView_rowRender(self, tr) {
	self.Listener.dispatchEvent(RowRenderEvent({
		detail: {tr: tr}
	}))
}

function Gridview_sort(self, btn) {
	var sorting = btn.getAttribute(ATTR_SORTING)
	var binding = btn.getAttribute(ATTR_BINDING)
	var th = btn.closest('th')
	
	th.setAttribute(ATTR_BINDING, binding)

	if (sorting==null || sorting=='') {
		// ubah ke ascending
		th.setAttribute(ATTR_SORTING, 'asc')
		btn.setAttribute(ATTR_SORTING, 'asc')
		btn.innerHTML = ICON_SORTASC
	} else if (sorting=='asc') {
		// ubah ke desc
		th.setAttribute(ATTR_SORTING, 'desc')
		btn.setAttribute(ATTR_SORTING, 'desc')
		btn.innerHTML = ICON_SORTDESC
	} else {
		// ubah ke unsort
		th.removeAttribute(ATTR_SORTING)
		btn.setAttribute(ATTR_SORTING, '')
		btn.innerHTML = ICON_UNSORT
	}

	// ambil semua kolom yang di sort
	var tr = btn.closest('tr')
	var ths = tr.querySelectorAll(`th[${ATTR_SORTING}]`)
	var sort = {}
	for (var th of ths) {
		var sorting = th.getAttribute(ATTR_SORTING)
		var binding = th.getAttribute(ATTR_BINDING)
		sort[binding] = sorting
	}

	self.Listener.dispatchEvent(SortingEvent({
		detail: {sort: sort}
	}))

}


function GridView_RemoveSelected(self, onFinished) {
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

		let evt = RowRemovingEvent({
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


function GridView_HasRowPendingProcess(self) {
	var rows = self.Nodes.Tbody.querySelectorAll(`tr[${ATTR_ROWPROCESSING}]`)

	console.log(rows.length)
	if (rows.length > 0) {
		return true
	} else {
		return false
	}
}


function GridView_SetNext(self, searchtext, nextoffset, limit) {
	var nextoffsetcontainer = self.Nodes.Tfoot.querySelector('tr[data-nextoffset]')
	if (nextoffsetcontainer!=null) {
		nextoffsetcontainer.remove()
	}
	
	

	if (nextoffset!=null) {
		var tr = document.createElement('tr')
		var td = document.createElement('td')
		var next = document.createElement('a')

		next.innerHTML = 'Next Data'
		next.setAttribute('href', 'javascript:void(0)')
		next.addEventListener('click', (evt)=>{
			self.Listener.dispatchEvent(NextDataEvent({
				detail: {
					searchtext: searchtext,
					nextoffset: nextoffset,
					limit: limit
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

