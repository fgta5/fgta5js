import Component from "./Component.mjs"

const ATTR_AUTONUMBER = 'autonumber'
const ATTR_BINDING = 'binding'
const ATTR_SORTING = 'sorting'
const ATTR_FORMATTER = 'formatter'
const ATTR_ROWSELECTED = 'data-selected'


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
		GridView_SetNext(this, nextoffset, limit)
	}

	#columndata
	get Columns() { return this.#columndata }
	setColumnData(columndata) {
		this.#columndata = columndata
	}
}


function Gridview_construct(self) {
	var tbl = self.Element
	tbl.setAttribute('cellspacing', 0)

	Gridview_createTableHaeder(self, tbl)


}


function createCheckbox(tagname) {
	let tdchk = document.createElement(tagname)
	var label = document.createElement('label')
	var input = document.createElement('input')
	var span = document.createElement('span')


	tdchk.appendChild(label)
	tdchk.setAttribute('data-rowselector', '')

	label.classList.add('fgta5-gridview-rowcheckbox')
	label.appendChild(input)
	label.appendChild(span)

	input.setAttribute('type', 'checkbox')

	span.classList.add('fgta5-gridview-checkmark')

	

	if (tagname=='td') {
		// select related row
		input.addEventListener('change', (evt)=>{
			var tr = tdchk.closest("tr");
			if (input.checked) {
				tr.setAttribute(ATTR_ROWSELECTED, '')
			} else {
				tr.removeAttribute(ATTR_ROWSELECTED)
			}
		})
	} else {
		// select all rows
		input.addEventListener('change', (evt)=>{
			var table = tdchk.closest('table')
			var trs = table.querySelectorAll('tbody tr')
			for (var tr of trs) {
				var chk = tr.querySelector('td[data-rowselector] input[type="checkbox"]')
				if (input.checked) {
					tr.setAttribute(ATTR_ROWSELECTED, '')
					chk.checked = true
				} else {
					tr.removeAttribute(ATTR_ROWSELECTED)
					chk.checked = false
				}
			}
		})
	}

	return tdchk
}

function createAutoNumber(tagname) {
	var td = document.createElement(tagname)
	td.setAttribute(ATTR_AUTONUMBER, true)
	td.innerHTML = '&nbsp;'
	return td
}

function Gridview_createTableHaeder(self, tbl) {
	var columns = []


	// ambil data-header
	var tr = document.createElement('tr')
	var thead = tbl.querySelector('thead')
	var headrow = tbl.querySelector("thead tr[data-header]")
	var ths = headrow.querySelectorAll("th")


	tr.classList.add('fgta5-gridview-rowheader')
	for (var th of ths) {
		// cek apakah checkbox
		var ischk = th.getAttribute('data-checkbox')
		var autonumber = th.getAttribute('data-autonumber')

		var cssclass =  th.getAttribute('class')
		var cssstyle = th.getAttribute('style')

		var thcol
		if (ischk!=null){
			thcol = createCheckbox('th')
			columns.push({
				type:'checkbox',
				cssclass: cssclass,
				cssstyle: cssstyle
			})
		} else if (autonumber!=null) {	
			thcol = createAutoNumber('th')
			columns.push({
				type:'autonumber',
				cssclass: cssclass,
				cssstyle: cssstyle
			})
		} else {
			var thcol = document.createElement('th')
			var binding = th.getAttribute(ATTR_BINDING)
			var sorting = th.getAttribute(ATTR_SORTING)
			var formatter = th.getAttribute(ATTR_FORMATTER)
			
			thcol.innerHTML = th.innerHTML
			
			columns.push({
				type:'field',
				binding: binding,
				sorting: sorting,
				formatter: formatter,
				cssclass: cssclass,
				cssstyle: cssstyle
			})
		}

		thcol.setAttribute('class', cssclass)
		thcol.setAttribute('style', cssstyle)
		tr.appendChild(thcol)
	}
	thead.appendChild(tr)

	// hapus baris yang mendefiniskan binding
	headrow.remove()

	self.setColumnData(columns)

}


function Gridview_AddRows(self, rows) {
	var tbody = self.Element.querySelector('tbody')
	if (tbody==null) {
		tbody = document.createElement('tbody')
		self.Element.appendChild(tbody)
	}

	for (var row of rows) {
		GridView_AddRow(self, row, tbody)
	}
}


function GridView_AddRow(self, row, tbody) {
	if (tbody===undefined) {
		tbody = self.Element.querySelector('tbody')
		if (tbody==null) {
			tbody = document.createElement('tbody')
			self.Element.appendChild(tbody)
		}
	}

	var tr = document.createElement('tr')
	tr.classList.add('fgta5-gridview-row')

	for (var column of self.Columns) {
		var td
		if (column.type=='checkbox') {
			td = createCheckbox('td')
		} else if (column.type=='autonumber') {
			td = createAutoNumber('td')
			td.addEventListener('click', (evt)=>{ GridView_rowClick(self, tr) })
		} else {
			td = document.createElement('td')
			td.addEventListener('click', (evt)=>{ GridView_rowClick(self, tr) })
			if (column.binding!=null) {
				td.innerHTML = row[column.binding]
			}
		}

		td.classList.add('fgta5-gridview-cell')
		tr.appendChild(td)
	}
	tbody.appendChild(tr)
}


function GridView_SetNext(self, nextoffset, limit) {

}

function GridView_rowClick(self, tr) {
	console.log(tr)
}