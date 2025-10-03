'use strict';

import Input from "./Input.mjs"

const ChangeEvent = (data) => { return new CustomEvent('change', data) }
const OptionFormattingEvent = (data) => { return new CustomEvent('optionformatting', data) }
const SelectingEvent = (data) => { return new CustomEvent('selecting', data) }


const icon_cbo_button = `<?xml version="1.0" encoding="UTF-8"?>
<svg transform="translate(0 3)" width="12" height="12" stroke-linecap="round" version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path transform="matrix(.8169 0 0 -.64538 10.987 14.119)" d="m11.299 11.275h-10.157l-10.157-1e-6 10.157-17.593 5.0786 8.7965z"/>
</svg>
`

const icon_cbo_close = `<?xml version="1.0" encoding="UTF-8"?>
<svg transform="translate(0 3)" width="12" height="12" stroke="currentColor" stroke-linecap="round" version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="m3.5642 20.295 16.853-16.833" fill="none" stroke-width="4"/>
<path d="m3.5741 3.4523 16.833 16.853" fill="none" stroke-width="4"/>
</svg>`



const ATTR_EDITMODE = 'editmode'
const ATTR_SHOWED = 'showed'
const ATTR_REMOVING = 'removing'
const ATTR_SELECTED = 'selected'
const ATTR_INDEX = 'data-index'

const DEF_LIMIT = 30

export default class Combobox extends Input {

	constructor(id) {
		super(id)
		cbo_construct(this, id)
	}

	get value() { return cbo_getValue(this) }
	set value(v) {  throw Error('Value is readonly') }

	get text() { return  cbo_getText(this) }
	set text(v) { throw Error('Text is readonly') }

	get disabled() { return this.Element.disabled }
	set disabled(v) { 
		this.Element.disabled = v 
		cbo_setDisabled(this, v)
	}

	#_ineditmode = true
	get InEditMode() { return this.#_ineditmode }
	setEditingMode(ineditmode) {
		this.#_ineditmode = ineditmode
		cbo_SetEditingMode(this, ineditmode)
	}

	newData(initialdata) {
		cbo_newData(this, initialdata)
	}

	acceptChanges() {
		super.acceptChanges()
		cbo_acceptChanges(this)
	}
	
	reset() {
		cbo_reset(this)
	}

	_setLastValue(v, t) {
		super._setLastValue(v)
		cbo_setLastValue(this, v, t)
	}

	getLastValue() {
		return cbo_getLastValue(this)
	} 

	getLastText() {
		return cbo_getLastText(this)
	} 

	setSelected(value, text) {
		if (text===undefined || text===null) {
			text = value
		}
		cbo_setSelected(this, value, text)
	}

	getDisplayBinding() {
		return this.Nodes.Input.getAttribute('data-display')
	}

	addOptions(data) {
		cbo_addOptions(this, data)
	}

	setOptions(data) {
		cbo_setOptions(this, data)
	}


	#iswaiting = false
	isWaiting() { return this.#iswaiting }
	wait(iswaiting) {
		this.#iswaiting = iswaiting===undefined ? true : iswaiting
		cbo_wait(this, iswaiting)
	}
	
	// untuk keperluan abort fetch data yang dibatalkan
	// apabila belum selesai tapi dialog sudah ditutup
	AbortHandler = null


	HasStaticOption = null

}


function cbo_setSelected(self, value, text) {
	self.Nodes.Input.value = value
	self.Nodes.Display.value = text
	cbo_markChanged(self)
}

function cbo_construct(self, id) {
	const container = self.Nodes.Container
	const lastvalue = self.Nodes.LastValue
	const input = self.Nodes.Input
	const wrapinput = document.createElement('div')
	const display = document.createElement('input')
	const button = document.createElement('button')
	const label = document.querySelector(`label[for="${id}"]`)
	const datalist = input.parentNode.querySelector(`datalist[for="${id}"]`)
	const dialog = document.createElement('dialog')
	const lasttext = document.createElement('input')


	// setup container, (harus di awal seblum yang lain-lain)
	// diperlukan untuk menampung semua element yang akan ditampilkan
	input.parentNode.insertBefore(container, input)


	// tambahkan elemen-element ke container
	// penambahakn container ke body document pada saat Input_construct di parent class Input
	wrapinput.appendChild(input)
	wrapinput.appendChild(display)
	wrapinput.appendChild(button)
	container.appendChild(wrapinput)
	container.appendChild(lastvalue)
	container.appendChild(lasttext)
	container.appendChild(dialog) 


	// tambahkan referensi elemen ke Nodes
	self.Nodes.InputWrapper = wrapinput
	self.Nodes.Label = label 
	self.Nodes.Display = display
	self.Nodes.Button = button
	self.Nodes.Dialog = dialog
	self.Nodes.LastText = lasttext


	// setup container
	container.setAttribute('fgta5-component', 'Combobox')
	if (input.style.width!='') {
		container.style.width = input.style.width
	}
	if (input.style.marginTop!='') {
		container.style.marginTop = input.style.marginTop
		input.style.marginTop = ''
	}
	if (input.style.marginBottom!='') {
		container.style.marginBottom = input.style.marginBottom
		input.style.marginBottom=''
	}
	if (input.style.marginLeft!='') {
		container.style.marginLeft = input.style.marginLeft
		input.style.marginLeft=''
	}
	if (input.style.marginRight!='') {
		container.style.marginRight = input.style.marginRight
		input.style.marginRight=''
	}


	// setup wrapper
	wrapinput.classList.add('fgta5-entry-input-wrapper')

	// setup input
	input.classList.add('fgta5-entry-input')
	input.setAttribute('type', 'hidden')
	input.getInputCaption = () => {
		if (label!=null) {
			return label.innerHTML
		} else {
			return input.getAttribute('placeholder')
		}
	}
	const nonFgtaClasses = Array.from(input.classList).filter(className =>
		!className.startsWith('fgta5-')
	);
	for (var classname of nonFgtaClasses) {
		input.classList.remove(classname)
		container.classList.add(classname)
	}


	// setup display
	display.id = self.Id + '-display'
	display.classList.add('fgta5-entry-display')
	display.setAttribute('style', input.getAttribute('style') || '')
	display.setAttribute('type', 'text')
	display.setAttribute('readonly', 'true')
	display.setAttribute('fgta5-component', 'Combobox')
	display.setAttribute('placeholder', input.getAttribute('placeholder'))
	
	display.required = input.required

	const dis = input.getAttribute('disabled')
	if (dis!=null) {
		cbo_setDisabled(self, true)
	}



	// setup button
	button.classList.add('fgta5-entry-button-combobox')	
	button.innerHTML = icon_cbo_button
	button.addEventListener('click', (e)=>{
		cbo_buttonClick(self, e)
	})


	// setup lasttext
	lasttext.setAttribute('type', 'hidden')

	// setup label
	if (label!=null) {
		label.setAttribute('for', display.id)
		label.classList.add('fgta5-entry-label')
	}


	// required field
	var required = input.getAttribute('required')
	if (required != null) {
		self.markAsRequired(true)
	}

	// dialog
	if (datalist!=null) {
		self.HasStaticOption = true
	}
	cbo_createDialog(self, dialog)
	dialog.addEventListener("cancel", (e)=>{
		dialog.setAttribute(ATTR_REMOVING, 'true')
		e.preventDefault()
		setTimeout(() => {
			dialog.close()
			dialog.removeAttribute(ATTR_REMOVING)
			dialog.removeAttribute(ATTR_SHOWED)
			cbo_closed(self)
		}, 200);
    });

	dialog.addEventListener('close', (evt)=>{
		cbo_dialogClose(self)
	})

	

	// datalist
	if (datalist!=null) {
		datalist.remove()
		var opt = cbo_createStaticOptions(self, dialog, datalist)
		if (opt.default!=null) {
			input.value = opt.default.value
			display.value = opt.default.text
		}

		if (opt.count>0) {
			self.HasStaticOption = true
		}
	} else {
		input.value = ''
		display.value = ''
	}


	// baca attribut kelengkapan combobox
	self._read

	// set input description
	self._setupDescription()
	self._setLastValue(input.value, display.value)
	
}


function cbo_getValue(self) {
	var input = self.Nodes.Input
	if (input.value=='') {
		return null
	} else {
		return input.value
	}
}

function cbo_getText(self) {
	return self.Nodes.Display.value
}


function cbo_newData(self, initialdata) {
	var input = self.Nodes.Input
	var display = self.Nodes.Display


	if (initialdata===undefined) {
		input.value = ''
		display.value = ''
	} else if (typeof initialdata==='string') {
		input.value = initialdata
		display.value = initialdata
	} else if (initialdata!=null) {
		input.value = initialdata.value
		display.value = initialdata.text
	} else {
		input.value = ''
		input.value = ''
	}
	self.Nodes.Display.removeAttribute('changed')

	self.setError(null)
	self.acceptChanges()

	cbo_resetSelected(self)
}

function cbo_acceptChanges(self) {
	self.Nodes.Display.removeAttribute('changed')
	self._setLastValue(self.value, self.text)
}

function cbo_reset(self) {
	var lastValue = self.getLastValue()
	var lastText =  self.getLastText()

	console.log('reset:', lastValue, lastText)
	self.Nodes.Input.value = lastValue
	self.Nodes.Display.value = lastText
	self.Nodes.Display.removeAttribute('changed')

	self.acceptChanges()
}

function cbo_setLastValue(self, v, t) {
	self.Nodes.LastValue.value = v
	self.Nodes.LastText.value = t
}

function cbo_setDisabled(self, v) {
	if (v) {
		self.Nodes.Display.disabled = true
		self.Nodes.Button.disabled = true
	} else {
		self.Nodes.Display.disabled = false
		self.Nodes.Button.disabled = false
	}
}

function cbo_markSelected(self, tr) {
	tr.setAttribute(ATTR_SELECTED, '')
	
	setTimeout(()=>{
		let d = tr.getAttribute('data-none')
 		if (d=='') {
			// taruh paling atas
			// TODO: geser TR di awal tbody
		} else {
			// geser tr ke atas atau setelah none 
			const dialog = self.Nodes.Dialog
			const tbody = dialog.getElementsByTagName('tbody')[0]
			const none = tbody.querySelector('tr[data-none]')
			if (none!=null) {
				none.after(tr)	
			}
		}
	}, 100)
	
}


function cbo_SetEditingMode(self, ineditmode) {
	var attrval = ineditmode ? 'true' : 'false'

	self.Nodes.Display.setAttribute(ATTR_EDITMODE, attrval)
	self.Nodes.Input.setAttribute(ATTR_EDITMODE, attrval)
	self.Nodes.InputWrapper.setAttribute(ATTR_EDITMODE, attrval)
	self.Nodes.Button.setAttribute(ATTR_EDITMODE, attrval)

	if (ineditmode) {
		self.Nodes.Input.removeAttribute('readonly')
	} else {
		self.Nodes.Input.setAttribute('readonly', 'true')
		self.setError(null)
	}
}

function isMobileDevice() {
	return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|Opera Mini|IEMobile/i.test(navigator.userAgent);
}


function cbo_selectRow(self, tr, td, value, text, data) {
		// reset dulu jika ada option yang terpilih sebelumnya
		cbo_resetSelected(self)

		// tandai baris yang sekarang dilih
		cbo_markSelected(self, tr)

		self.Nodes.Input.value = value
		if (value=='' && text=='none') {
			console.log('none dipilih')
			self.Nodes.Display.value = ''
		} else {
			self.Nodes.Display.value = text
		}


		
		cbo_userSelectValue(self, value, text, data)
}

function cbo_createOptionRow(self, value, text, data) {
	let tr = document.createElement('tr')
	var td = document.createElement('td')

	tr.classList.add('fgta-combobox-option-row')
	tr.setAttribute('value', value)

	td.setAttribute('option', '')
	td.setAttribute('value', value)
	td.innerHTML = text




	td.addEventListener('dblclick', (e)=>{
		if (isMobileDevice()) {
			return
		}

		cbo_selectRow(self, tr, td, value, text, data)
	})

	td.addEventListener('click', (e)=>{
		// click hanya untuk mobile
		if (!isMobileDevice()) {
			return
		}

		cbo_selectRow(self, tr, td, value, text, data)
		/*
		// untuk menghindari kesalah jika melakukan double click
		// karena efek animate
		if (self.pauseClickEvent===true) {
			return
		}
		self.pauseClickEvent = true
		setTimeout(()=>{
			self.pauseClickEvent = false
		}, 500)
		*/
	})

	tr.appendChild(td)



	// CATATAN:
	// dispatch event di sini tidak berlaku untuk static options
	// karena event handler pada main program baru akan diexekusi setelah pembuatan content option statis
	self.Listener.dispatchEvent(OptionFormattingEvent({
		detail: {
			value: value,
			text: text,
			tr: tr,
			data: data
		}
	}))


	// tandai baris pilihan ini jika merupakan opsi yang dipilih user saat ini
	var valueselected=self.value??''
	if (value==valueselected) {
		cbo_markSelected(self, tr)
	}


	return tr
} 

function cbo_createStaticOptions(self, dialog, datalist) {
	const options = datalist.getElementsByTagName("option");
	
	const thead = dialog.getElementsByTagName('thead')[0]
	const tbody = dialog.getElementsByTagName('tbody')[0]
	const tfoot = dialog.getElementsByTagName('tfoot')[0]
	var defaultOption = null
	
	thead.style.display='none'
	tfoot.style.display='none'


	// jika tidak harus diisi,
	// tambahkan opsi none
	if (!self.isRequired()) {
		var tr = cbo_createOptionRow(self, '', 'none', {})
		tr.setAttribute('data-none', '')
		tr.setAttribute(ATTR_INDEX, 0)
		tbody.appendChild(tr)
	}

	// selanjutnya isi data berdasar options default
	var i = 0
	for (let option of options) {
		i++
		let text = option.textContent || option.innerText
		let value = (option.value==null || option.value=='') ? text : option.value

		var def = option.getAttribute('default')
		if (def!=null) {
			defaultOption = {
				value: value,
				text: text
			}
		}

		var idx = tbody.rows.length - 1
		var tr = cbo_createOptionRow(self, value, text, { option: option })
		
		tr.setAttribute(ATTR_INDEX, idx)
		tbody.appendChild(tr)
	}

	return {
		count: i,
		default: defaultOption
	}

}

function cbo_createDialog(self, dialog) {
	dialog.classList.add('fgta5-combobox-dialog')

	// buat header dialog
	var head = document.createElement('div')
	head.classList.add('fgta5-combobox-dialog-head')
	head.innerHTML = self.Nodes.Input.getInputCaption()
	dialog.appendChild(head)

	// tombol tutup dialog (tanpa memilih)
	var btnClose = document.createElement('button')
	btnClose.innerHTML = icon_cbo_close
	head.appendChild(btnClose)



	
	// filtering
	if (!self.HasStaticOption) {
		var srccontainer = document.createElement('div')
		var srcinput = document.createElement('input')
		var srcbuton = document.createElement('button')
		var btnnext = document.createElement('a')

		srcinput.setAttribute('placeholder', 'Search')
		srcinput.setAttribute('maxlength', 30)
		srcinput.addEventListener('keypress', (evt)=>{
			if (evt.key==="Enter") {
				srcbuton.click()
			}
		})
		

		srcbuton.innerHTML = 'Submit'
		srcbuton.addEventListener('click', (evt)=>{
			var searchtext = srcinput.value
			var limit = DEF_LIMIT
			var offset = 0

			btnnext.searchtext = searchtext
			cbo_resetSelected(self)
			cbo_search(self, searchtext, limit, offset)
		})

		srccontainer.classList.add('fgta5-combobox-dialog-filter')
		srccontainer.appendChild(srcinput)
		srccontainer.appendChild(srcbuton)
		dialog.appendChild(srccontainer)

	}






	// template tabel dialog
	var table = document.createElement('table')
	var thead = document.createElement('thead')
	var tbody = document.createElement('tbody')
	var tfoot = document.createElement('tfoot')
	dialog.appendChild(table)
	
	
	table.appendChild(tbody)
	table.appendChild(tfoot)
	table.appendChild(thead)


	if (!self.HasStaticOption) {
		// siapkan tombol next,
		// jikalau nanti ada data yang panjang dan perlu paging
		btnnext.classList.add('fgta5-combobox-dialog-nextbutton')
		btnnext.innerHTML = 'next data'
		btnnext.style.display = 'none'
		btnnext.setAttribute('href', 'javascript:void(0)')
		btnnext.addEventListener('click', (evt)=>{
			// ketiak, eh ketika tombol next di klik
			var searchtext = btnnext.searchtext
			var limit = btnnext.limit
			var nextoffset = btnnext.nextoffset
			cbo_search(self, searchtext, limit, nextoffset)
		})
		dialog.appendChild(btnnext)

		dialog.setNext = (nextoffset, limit) => {
			btnnext.nextoffset = nextoffset
			btnnext.limit = limit
			if (nextoffset!=null && nextoffset!=0) {
				btnnext.style.display = 'inline-block'
			} else {
				btnnext.style.display = 'none'
			}
		}
	} else {
		dialog.setNext = (nextoffset, limit) => {
			console.log('not implemented')
		}
	}	
	
	
}

function cbo_userSelectValue(self, value, text, data) {
	// trigger event
	self.Listener.dispatchEvent(ChangeEvent({
		sender: self,
		detail: {value: value, text: text, data:data, sender: self}
	}))

	cbo_markChanged(self)

	// tutup
	self.Nodes.Dialog.removeAttribute(ATTR_SHOWED)
	setTimeout(() => {
		self.Nodes.Dialog.close()
		cbo_closed(self)
	}, 200);
}

function cbo_markChanged(self) {
	if (self.Form==null) {
		return
	}

	var display = self.Nodes.Display
	if (self.value!=self.getLastValue()) {
		display.setAttribute('changed', 'true')
	} else {
		display.removeAttribute('changed')
	}
}


function cbo_getLastValue(self) {
	var lastvalue = self.Nodes.LastValue.value
	if (lastvalue=='') {
		return null
	} else {
		return lastvalue
	}
}

function cbo_getLastText(self) {
	return self.Nodes.LastText.value
}


function cbo_clearOptions(self, tbody) {
	const dialog = self.Nodes.Dialog
	if (tbody==undefined || tbody==null) {
		tbody = dialog.getElementsByTagName('tbody')[0]
	}

	tbody.replaceChildren()
}

function cbo_addOptions(self, data, tbody) {
	if (data==undefined || data==null) {
		return
	}

	const dialog = self.Nodes.Dialog
	if (tbody==undefined || tbody==null) {
		tbody = dialog.getElementsByTagName('tbody')[0]
	}

	for (let row of data) {
		tbody.appendChild(cbo_createOptionRow(self, row.value, row.text, data))
	}
}

function cbo_setOptions(self, data) {
	const dialog = self.Nodes.Dialog
	const tbody = dialog.getElementsByTagName('tbody')[0]

	// hapus dulu datanya
	cbo_clearOptions(self, tbody)
	
	// cek apakah tidak required
	// jika tidak required, tambahkan none di paling atas
	if (!self.isRequired()) {
		// cbo_addOptionRow(self, tbody, '', '')
	}


	// tampilkan data pada pilihan
	cbo_addOptions(self, data, tbody)
}

function cbo_closed(self) {
	console.log('combobox closed')
	if (typeof self.abortHandler==='function') {
		self.abortHandler()
	}
}


function cbo_search(self, searchtext, limit, offset) {
	const dialog = self.Nodes.Dialog
	const tbody = dialog.getElementsByTagName('tbody')[0]


	// required atau nggak
	var addNoneIfNotRequired = () => {
		var none = tbody.querySelector('tr[data-none]')
		if (self.isRequired()) {
			// hilangkan none
			if (none!=null) {
				none.remove()
			}
			
		} else {
			// tambahkan none jika belum ada
			if (none==null) {
				var tr = cbo_createOptionRow(self, '', 'none', {})
				tr.setAttribute('data-none', '')
				tr.setAttribute(ATTR_INDEX, 0)
				tbody.prepend(tr)
				console.log('add none')
			}
		}
	}

	var execute_selecting = true
	if (offset==0) {
		var prevselected = dialog.querySelector(`table tr[${ATTR_SELECTED}]`)
		if (prevselected != null) {
			// kalau sudah ada yang dipilih sebelumnya
			// tidak perlu query selecting lagi 
			execute_selecting = false
		} else {
			execute_selecting = true
			cbo_clearOptions(self, tbody)
			dialog.setNext(null)
		}
	}
	


	if (execute_selecting) {

		// selecting event
		addNoneIfNotRequired()


		self.Listener.dispatchEvent(SelectingEvent({
			detail: {
				sender: self,
				dialog: dialog,
				searchtext: searchtext,
				limit: limit, 
				offset: offset,
				addRow: (value, text, data) => {
					var idx = tbody.rows.length - 1
					var tr = cbo_createOptionRow(self, value, text, data)
					tr.setAttribute(ATTR_INDEX, idx)
					tbody.appendChild(tr)
				}
			}
		}))
	}


}


function cbo_buttonClick(self, e) {
	const dialog = self.Nodes.Dialog

	if (self.Form!=null) {
		var editmode = self.Nodes.Button.getAttribute(ATTR_EDITMODE)
		if (editmode!=="true") {
			return
		}
	}

	if (self.HasStaticOption) {
		// populasi data option statis melalui definisi datalist pada element
		self.Listener.dispatchEvent(SelectingEvent({
			detail: {
				sender: self,
				dialog: dialog,
				searchtext: '', limit: 0, offset: 0,
				addRow: (value, text, data) => {
					var tr = cbo_createOptionRow(self, value, text, data)
					tbody.appendChild(tr)
				}
			}
		}))

	} else {
		// populasi data option dengan secara dinamis,
		var searchtext = null // diisi null berarti saat klik pertama kali
		var limit = DEF_LIMIT
		var offset = 0

		// tambahkan data yang dipilih
		cbo_search(self, searchtext, limit, offset)

		// set focus pada input search
		setTimeout(()=>{
			var inputsearch = dialog.querySelector(".fgta5-combobox-dialog-filter input")
			if (inputsearch!=null) {
				inputsearch.value = ''
				inputsearch.focus()
			}
		}, 100)


	}

	// set jika dalam waktu 1 detik masih dalam posisi waiting, munculkan mask
	setTimeout(()=>{
		if (self.isWaiting()) {
			dialog.mask = $fgta5.Modal.createMask()
		}
	}, 1000)

	// tampilkan modal dialog untuk options
	dialog.showModal()
	dialog.setAttribute(ATTR_SHOWED, 'true')


	// handler tombol untuk menutup dialog pilihan combobox
	var btnClose = dialog.querySelector('.fgta5-combobox-dialog-head > button')
	if (btnClose.onclick==null) {
		btnClose.onclick=(e) => {
			dialog.setAttribute(ATTR_REMOVING, 'true')
			setTimeout(() => {
				dialog.close()
				dialog.removeAttribute(ATTR_REMOVING)
				dialog.removeAttribute(ATTR_SHOWED)
				cbo_closed(self)
			}, 200);
		}
	}

}


function cbo_wait(self, iswaiting) {
	const dialog = self.Nodes.Dialog
	var tbody = dialog.getElementsByTagName('tbody')[0]

	iswaiting = iswaiting===undefined ? true : iswaiting
	if (iswaiting) {
		var tr = document.createElement('tr')
		var td = document.createElement('td')

		tr.setAttribute('data-waiting', '')
		td.innerHTML = 'fetching data from server ...'
		tr.appendChild(td)
		tbody.appendChild(tr)

		
	} else {
		var el = tbody.querySelector('[data-waiting]')
		if (el!=null) {
			el.remove()
		}

		if (dialog.mask!=null) {
			dialog.mask.close()
			delete dialog.mask
		}
	}

}


function cbo_resetSelected(self) {
	// ambil baris yang dipilih sebelumnya
	const prevselected = self.Nodes.Dialog.querySelector(`table tr[${ATTR_SELECTED}]`)
	if (prevselected != null) {

		// kemablikan ke urutan sesuai index
		const idx = prevselected.getAttribute(ATTR_INDEX)	
		if (idx!='' && idx!=null) {
			const index = Number(idx)
			const tbody = prevselected.closest('tbody')
			const trs = tbody.querySelectorAll('tr')
			for (var tr of trs) {
				var rowidx = tr.getAttribute(ATTR_INDEX) ?? 0
				var rowindex = Number(rowidx)
				if (rowindex==0) continue
				if (rowindex==index) continue

				if (index<rowindex) {
					tr.insertAdjacentElement("beforebegin", prevselected);
					break
				}
			}
		}	

		// remove status selected
		prevselected.removeAttribute(ATTR_SELECTED)
	}
}


function cbo_dialogClose(self) {
	// kembalikan yang saat ini di select ke baris semula
	// const dialog = self.Nodes.Dialog
	// const selected = dialog.querySelector(`table tr[${ATTR_SELECTED}]`)
	// const idx = selected.getAttribute(ATTR_INDEX)
	// if (idx!='' && idx!=null) {
	// 	const tbody = dialog.getElementsByTagName('tbody')[0]
	// 	const trs = tbody.querySelectorAll('tr')
	// 	for (var tr of trs) {
	// 		var rowidx = tr.getAttribute(ATTR_INDEX) ?? 0
	// 		if (rowidx==0) continue

	// 		if (idx>rowidx) {
	// 			tr.after(selected)
	// 			break
	// 		}
	// 	}
	// }
}