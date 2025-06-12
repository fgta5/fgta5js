'use strict';

import Input from "./Input.mjs"
import Dataloader from "./DataLoader.mjs";

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

const DEF_LIMIT = 30

export default class Combobox extends Input {

	constructor(id) {
		super(id)
		Combobox_construct(this, id)
	}

	get Value() { return Combobox_getValue(this) }
	set Value(v) {  throw Error('Value is readonly') }

	get Text() { return  Combobox_getText(this) }
	set Text(v) { throw Error('Text is readonly') }

	get Disabled() { return this.Element.disabled }
	set Disabled(v) { 
		this.Element.disabled = v 
		Combobox_setDisabled(this, v)
	}

	#_ineditmode = true
	get InEditMode() { return this.#_ineditmode }
	SetEditingMode(ineditmode) {
		this.#_ineditmode = ineditmode
		Combobox_SetEditingMode(this, ineditmode)
	}

	NewData(initialdata) {
		Combobox_NewData(this, initialdata)
	}

	AcceptChanges() {
		super.AcceptChanges()
		Combobox_AcceptChanges(this)
	}
	
	Reset() {
		super.Reset()
		Combobox_Reset(this)
	}

	_setLastValue(v, t) {
		super._setLastValue(v)
		Combobox_setLastValue(this, v, t)
	}

	GetLastValue() {
		return Combobox_GetLastValue(this)
	} 

	GetLastText() {
		return Combobox_GetLastText(this)
	} 

	SetSelected(value, text) {
		if (text===undefined || text===null) {
			text = value
		}
		Combobox_SetSelected(this, value, text)
	}


	AddOptions(data) {
		Combobox_AddOptions(this, data)
	}

	SetOptions(data) {
		Combobox_SetOptions(this, data)
	}


	#iswaiting = false
	IsWaiting() { return this.#iswaiting }
	Wait(iswaiting) {
		this.#iswaiting = iswaiting===undefined ? true : iswaiting
		Combobox_Wait(this, iswaiting)
	}
	
	// untuk keperluan abort fetch data yang dibatalkan
	// apabila belum selesai tapi dialog sudah ditutup
	AbortHandler = null


	HasStaticOption = null

}


function Combobox_SetSelected(self, value, text) {
	self.Nodes.Input.value = value
	self.Nodes.Display.value = text
	Combobox_markChanged(self)
}

function Combobox_construct(self, id) {
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

	// setup wrapper
	wrapinput.classList.add('fgta5-entry-input-wrapper')

	// setup input
	input.classList.add('fgta5-entry-input')
	input.setAttribute('type', 'hidden')
	input.getInputCaption = () => {
		return label.innerHTML
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

	// setup button
	button.classList.add('fgta5-entry-button-combobox')	
	button.innerHTML = icon_cbo_button
	button.addEventListener('click', (e)=>{
		Combobox_buttonClick(self, e)
	})


	// setup lasttext
	lasttext.setAttribute('type', 'hidden')

	// setup label
	label.setAttribute('for', display.id)
	label.classList.add('fgta5-entry-label')


	// required field
	var required = input.getAttribute('required')
	if (required != null) {
		self.MarkAsRequired(true)
	}

	// dialog
	Combobox_createDialog(self, dialog)
	dialog.addEventListener("cancel", (e)=>{
		dialog.setAttribute(ATTR_REMOVING, 'true')
		e.preventDefault()
		setTimeout(() => {
			dialog.close()
			dialog.removeAttribute(ATTR_REMOVING)
			dialog.removeAttribute(ATTR_SHOWED)
			Combobox_closed(self)
		}, 200);
    });

	

	// datalist
	if (datalist!=null) {
		datalist.remove()
		var opt = Combobox_createStaticOptions(self, dialog, datalist)
		if (opt.default!=null) {
			input.value = def.value
			display.value = def.text
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


function Combobox_getValue(self) {
	var input = self.Nodes.Input
	if (input.value=='') {
		return null
	} else {
		return input.value
	}
}

function Combobox_getText(self) {
	return self.Nodes.Display.value
}


function Combobox_NewData(self, initialdata) {
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

	self.SetError(null)
	self.AcceptChanges()
}

function Combobox_AcceptChanges(self) {
	self.Nodes.Display.removeAttribute('changed')
	self._setLastValue(self.Value, self.Text)
}

function Combobox_Reset(self) {
	self.Value = self.GetLastValue()
	self.Text = self.GetLastText()
	self.Nodes.Display.removeAttribute('changed')
}

function Combobox_setLastValue(self, v, t) {
	self.Nodes.LastValue.value = v
	self.Nodes.LastText.value = t
}

function Combobox_setDisabled(self, v) {
	if (v) {
		self.Nodes.Display.disabled = true
		self.Nodes.Button.disabled = true
	} else {
		self.Nodes.Display.disabled = false
		self.Nodes.Button.disabled = false
	}
}


function Combobox_SetEditingMode(self, ineditmode) {
	var attrval = ineditmode ? 'true' : 'false'

	self.Nodes.Display.setAttribute(ATTR_EDITMODE, attrval)
	self.Nodes.Input.setAttribute(ATTR_EDITMODE, attrval)
	self.Nodes.InputWrapper.setAttribute(ATTR_EDITMODE, attrval)
	self.Nodes.Button.setAttribute(ATTR_EDITMODE, attrval)

	if (ineditmode) {
		self.Nodes.Input.removeAttribute('readonly')
	} else {
		self.Nodes.Input.setAttribute('readonly', 'true')
		self.SetError(null)
	}
}


function Combobox_createOptionRow(self, value, text, data) {
	let tr = document.createElement('tr')
	var td = document.createElement('td')

	tr.classList.add('fgta-combobox-option-row')
	tr.setAttribute('value', value)

	td.setAttribute('option', '')
	td.setAttribute('value', value)
	td.innerHTML = text
	td.addEventListener('click', (e)=>{

		// untuk menghindari kesalah jika melakukan double click
		// karena efek animate
		if (self.pauseClickEvent===true) {
			return
		}
		self.pauseClickEvent = true
		setTimeout(()=>{
			self.pauseClickEvent = false
		}, 500)

		// reset dulu jika ada option yang terpilih sebelumnya
		Combobox_resetSelected(self)

		// tandai baris yang sekarang dilih
		tr.setAttribute(ATTR_SELECTED, '')


		self.Nodes.Input.value = value
		self.Nodes.Display.value = text
		Combobox_userSelectValue(self, value, text, data)


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
	var valueselected=self.Value??''
	if (value==valueselected) {
		tr.setAttribute(ATTR_SELECTED, '')
	}


	return tr
} 

function Combobox_createStaticOptions(self, dialog, datalist) {
	const options = datalist.getElementsByTagName("option");
	
	var thead = dialog.getElementsByTagName('thead')[0]
	var tbody = dialog.getElementsByTagName('tbody')[0]
	var tfoot = dialog.getElementsByTagName('tfoot')[0]
	var defaultOption = null
	
	thead.style.display='none'
	tfoot.style.display='none'


	// jika tidak harus diisi,
	// tambahkan opsi none
	if (!self.IsRequired()) {
		var tr = Combobox_createOptionRow(self, '', 'none', {})
		tr.setAttribute('data-none', '')
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

		tbody.appendChild(Combobox_createOptionRow(self, value, text, { option: option }))
	}

	return {
		count: i,
		default: defaultOption
	}

}

function Combobox_createDialog(self, dialog) {
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
		Combobox_resetSelected(self)
		Combobox_Search(self, searchtext, limit, offset)
	})

	srccontainer.classList.add('fgta5-combobox-dialog-filter')
	srccontainer.appendChild(srcinput)
	srccontainer.appendChild(srcbuton)
	dialog.appendChild(srccontainer)

	// template tabel dialog
	var table = document.createElement('table')
	var thead = document.createElement('thead')
	var tbody = document.createElement('tbody')
	var tfoot = document.createElement('tfoot')
	dialog.appendChild(table)
	
	
	table.appendChild(tbody)
	table.appendChild(tfoot)
	table.appendChild(thead)

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
		Combobox_Search(self, searchtext, limit, nextoffset)
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
}

function Combobox_userSelectValue(self, value, text, data) {
	// trigger event
	self.Listener.dispatchEvent(ChangeEvent({
		sender: self,
		detail: {value: value, text: text, data:data, sender: self}
	}))

	Combobox_markChanged(self)

	// tutup
	self.Nodes.Dialog.removeAttribute(ATTR_SHOWED)
	setTimeout(() => {
		self.Nodes.Dialog.close()
		Combobox_closed(self)
	}, 200);
}

function Combobox_markChanged(self) {
	var display = self.Nodes.Display
	if (self.Value!=self.GetLastValue()) {
		display.setAttribute('changed', 'true')
	} else {
		display.removeAttribute('changed')
	}
}


function Combobox_GetLastValue(self) {
	var lastvalue = self.Nodes.LastValue.value
	if (lastvalue=='') {
		return null
	} else {
		return lastvalue
	}
}

function Combobox_GetLastText(self) {
	return this.Nodes.LastText.value
}


function Combobox_ClearOptions(self, tbody) {
	const dialog = self.Nodes.Dialog
	if (tbody==undefined || tbody==null) {
		tbody = dialog.getElementsByTagName('tbody')[0]
	}

	tbody.replaceChildren()
}

function Combobox_AddOptions(self, data, tbody) {
	if (data==undefined || data==null) {
		return
	}

	const dialog = self.Nodes.Dialog
	if (tbody==undefined || tbody==null) {
		tbody = dialog.getElementsByTagName('tbody')[0]
	}

	for (let row of data) {
		tbody.appendChild(Combobox_createOptionRow(self, row.value, row.text, data))
	}
}

function Combobox_SetOptions(self, data) {
	const dialog = self.Nodes.Dialog
	const tbody = dialog.getElementsByTagName('tbody')[0]

	// hapus dulu datanya
	Combobox_ClearOptions(self, tbody)
	
	// cek apakah tidak required
	// jika tidak required, tambahkan none di paling atas
	if (!self.IsRequired()) {
		// Combobox_addOptionRow(self, tbody, '', '')
	}


	// tampilkan data pada pilihan
	Combobox_AddOptions(self, data, tbody)
}

function Combobox_closed(self) {
	console.log('combobox closed')
	if (typeof self.AbortHandler==='function') {
		self.AbortHandler()
	}
}


function Combobox_Search(self, searchtext, limit, offset) {
	const dialog = self.Nodes.Dialog
	const tbody = dialog.getElementsByTagName('tbody')[0]


	// required atau nggak
	var addNoneIfNotRequired = () => {
		var none = tbody.querySelector('tr[data-none]')
		if (self.IsRequired()) {
			// hilangkan none
			none.remove()
		} else {
			// tambahkan none jika belum ada
			if (none==null) {
				var tr = Combobox_createOptionRow(self, '', 'none', {})
				tr.setAttribute('data-none', '')
				tbody.prepend(tr)
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
			Combobox_ClearOptions(self, tbody)
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
					var tr = Combobox_createOptionRow(self, value, text, data)
					tbody.appendChild(tr)
				}
			}
		}))
	}


}


function Combobox_buttonClick(self, e) {
	const dialog = self.Nodes.Dialog

	var editmode = self.Nodes.Button.getAttribute(ATTR_EDITMODE)
	if (editmode!=="true") {
		return
	}


	if (self.HasStaticOption) {
		// populasi data option statis melalui definisi datalist pada element
		self.Listener.dispatchEvent(SelectingEvent({
			detail: {
				sender: self,
				dialog: dialog,
				searchtext: '', limit: 0, offset: 0,
				addRow: (value, text, data) => {
					var tr = Combobox_createOptionRow(self, value, text, data)
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
		Combobox_Search(self, searchtext, limit, offset)

		// set focus pada input search
		setTimeout(()=>{
			var inputsearch = dialog.querySelector(".fgta5-combobox-dialog-filter input")
			if (inputsearch!=null) {
				inputsearch.focus()
			}
		}, 100)


	}

	// set jika dalam waktu 1 detik masih dalam posisi waiting, munculkan mask
	setTimeout(()=>{
		if (self.IsWaiting()) {
			dialog.mask = $fgta5.Modal.Mask()
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
				Combobox_closed(self)
			}, 200);
		}
	}

}


function Combobox_Wait(self, iswaiting) {
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


function Combobox_resetSelected(self) {
	var prevselected = self.Nodes.Dialog.querySelector(`table tr[${ATTR_SELECTED}]`)
	if (prevselected != null) {
		prevselected.removeAttribute(ATTR_SELECTED)
	}
}
