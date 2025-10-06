import Input from "./Input.mjs"


const button_icon = `<?xml version="1.0" encoding="UTF-8"?>
<svg transform="translate(0 3)" width="12" height="12" stroke="currentColor" version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="m3.0207 17.447v3.9708h18.328v-3.9708" fill="none" stroke-linecap="square" stroke-width="4"/>
<path d="m18.595 8.3606-6.4542-4.0017-6.3622 4.0017m6.3622-1.8991v7.1708" fill="none" stroke-linecap="square" stroke-width="4"/>
</svg>
`


export default class Filebox extends Input {
	constructor(id) {
		super(id)
		flb_construct(this, id)
	}

	#value = ''
	set value(v) { this.#value = v }
	get value() { 
		if (this.Element.files.length===0) {
			return this.#value
		} else {
			return this.Element.files[0].name
		}
	}
	

	get file() {
		if (this.Element.files.length===0) {
			return 0
		} else {
			return this.Element.files[0]
		}
	}

	get disabled() { return this.Element.disabled }
	set disabled(v) { 
		this.Element.disabled = v 
		flb_setDisabled(this, v)
	}

	#_ineditmode = true
	get InEditMode() { return this.#_ineditmode }
	setEditingMode(ineditmode) {
		this.#_ineditmode = ineditmode
		flb_setEditingMode(this, ineditmode)
	}

	newData() {
		flb_newData(this)
	}

	acceptChanges() {
		flb_acceptChanges(this)
	}

	reset() {
		flb_Reset(this)
	}

	isChanged() { 
		return flb_isChanged(this)
	}

	setError(msg) {
		super.setError(msg)
		flb_setError(this, msg)
	}


	setDisplay(value) {
		flb_setDisplay(this, value)
	}


	setDownloadLink(linktext, url) {
		flb_setDownloadLink(this, linktext, url)


		

		
		
		
	}
}


function flb_setDownloadLink(self, linktext=null, url=null) {
	const downloadLink = self.Nodes.DownloadLink
	
	if (linktext==null) {
		// sembunyikan link
		downloadLink.classList.add('hidden')
		downloadLink.innerHTML = 'download'
		downloadLink.onclick = null
		downloadLink.removeAttribute('href')	
	} else {{
		// munculkan link
		downloadLink.classList.remove('hidden')
		downloadLink.innerHTML = linktext
		if (typeof url==='function') {
			downloadLink.removeAttribute('target', '_blank')
			downloadLink.setAttribute('href', 'javascript:void(0)')
			downloadLink.onclick = () => {
				url()
			}	
		} else {
			downloadLink.setAttribute('target', '_blank')
			downloadLink.setAttribute('href', url)
			downloadLink.onclick = null
		}
	}}	

}


function flb_construct(self, id) {
	const container = self.Nodes.Container
	const lastvalue = self.Nodes.LastValue
	const input = self.Nodes.Input
	const wrapinput = document.createElement('div')
	const display = document.createElement('input')
	const button = document.createElement('button')
	const label = document.querySelector(`label[for="${id}"]`)
	const downloadLink = document.createElement('a')

	// setup container, (harus di awal seblum yang lain-lain)
	// diperlukan untuk menampung semua element yang akan ditampilkan
	input.parentNode.insertBefore(container, input)
	

	downloadLink.innerHTML = 'download'
	downloadLink.classList.add('fgta5-entry-download-link')
	downloadLink.classList.add('hidden')
	



	// tambahkan elemen-element ke container
	// penambahakn container ke body document pada saat Input_construct di parent class Input
	wrapinput.appendChild(display)
	wrapinput.appendChild(button)
	button.appendChild(input)
	container.appendChild(wrapinput)
	container.appendChild(downloadLink)
	container.appendChild(lastvalue)
	


	// tambahkan referensi elemen ke Nodes
	self.Nodes.InputWrapper = wrapinput
	self.Nodes.Label = label 
	self.Nodes.Display = display
	self.Nodes.Button = button
	self.Nodes.DownloadLink = downloadLink


	// setup container
	container.setAttribute('fgta5-component', 'Filebox')


	// setup wrapper
	wrapinput.classList.add('fgta5-entry-input-wrapper')


	// display
	display.setAttribute('id', `${id}-display`)
	display.setAttribute('type', 'text')
	display.setAttribute('picker', 'file')
	display.setAttribute('fgta5-component', 'Filebox')
	display.setAttribute('readonly', 'true')
	display.classList.add('fgta5-entry-display')
	display.classList.add('fgta5-entry-display-filebox')
	var placeholder = input.getAttribute('placeholder')
	if (placeholder!=null && placeholder !='') {
		display.setAttribute('placeholder', placeholder)
	}
	var cssclass = input.getAttribute('class')
	if (cssclass!=null && cssclass !='') {
		display.setAttribute('class', cssclass)
	}
	var cssstyle = input.getAttribute('style')
	if (cssstyle!=null && cssstyle !='') {
		display.setAttribute('style', cssstyle)
	}


		// main input
	input.setAttribute('type', 'file')
	input.setAttribute('picker', 'file')
	input.removeAttribute('class')
	input.removeAttribute('style')
	input.classList.add('fgta5-entry-input')
	input.classList.add('fgta5-entry-input-filebox')
	input.getInputCaption = () => {
		if (label!=null) {
			return label.innerHTML
		} else {
			return input.getAttribute('placeholder')
		}
	}

	
	// picker button
	button.id = self.Id + '-button'
	button.insertAdjacentHTML("beforeend", button_icon)
	button.classList.add('fgta5-entry-button-filebox')	

	// label
	label.setAttribute('for', button.id)
	label.classList.add('fgta5-entry-label')




	// additional property setup

	// required field
	var required = input.getAttribute('required')
	if (required != null) {
		self.markAsRequired(true)
	}

	self._setLastValue(input.value)
	self.acceptChanges()


	// set input description
	self._setupDescription()


	input.addEventListener('change', (e)=>{
		flb_changed(self)
	})


}

function flb_setDisplay(self, value) {
	var display = self.Nodes.Display
	display.value = value
}

function flb_setDisabled(self, v) {
	var display = self.Nodes.Display
	var button = self.Nodes.Button
	if (v) {
		display.disabled = true
		button.disabled = true
	} else {
		display.disabled = false
		button.disabled = false
	}
}


function flb_setEditingMode(self, ineditmode) {
	var display = self.Nodes.Display
	var input = self.Nodes.Input
	var attrval = ineditmode ? 'true' : 'false'

	display.setAttribute('editmode', attrval)
	input.setAttribute('editmode', attrval)
	self.Nodes.InputWrapper.setAttribute('editmode', attrval)

	if (ineditmode) {
		input.disabled = false
	} else {
		input.disabled = true
		self.setError(null)
	}
}


function flb_changed(self) {
	var input = self.Nodes.Input

	if (input.files.length === 0) {
		return
	}

	self.Nodes.Display.value = input.files[0].name
	flb_markChanged(self)
	if (self.InEditMode) {
		self.setError(null)
		self.validate()
	}
}

function flb_markChanged(self) {
	var display = self.Nodes.Display
	if (self.value!=self.getLastValue()) {
		display.setAttribute('changed', 'true')
	} else {
		display.removeAttribute('changed')
	}
}



function flb_setError(self, msg) {
	var display = self.Nodes.Display
	if (msg!== null && msg !== '') {
		display.setAttribute('invalid', 'true')
	} else {
		display.removeAttribute('invalid')
	}
}

function flb_newData(self) {
	self.Nodes.Input.value = ''
	self.Nodes.Display.value = ''
	self.acceptChanges()
}


function flb_Reset(self) {
	// let newFileInput = self.Nodes.Input.cloneNode();
	// newFileInput.addEventListener('change', (e)=>{
	// 	flb_changed(self)
	// })
	
	// self.Nodes.Input.replaceWith(newFileInput)
	// self.Nodes.Input = newFileInput
	self.Nodes.Input.value = ''
	
	var lastvalue = self.getLastValue()
	self.Nodes.Display.value = lastvalue
	self.acceptChanges()
}

function flb_acceptChanges(self) {
	var display = self.Nodes.Display
	var input = self.Nodes.Input
	var currentvalue = ''
	if (input.files.length>0) {
		currentvalue = input.files[0].name
	}
	
	self._setLastValue(currentvalue)
	input.removeAttribute('changed')
	display.removeAttribute('changed')
	self.setError(null)
}


function flb_isChanged(self) {
	var lastvalue = self.Nodes.LastValue.value
	var currentvalue = self.value
	if (currentvalue!=lastvalue) {
		console.log(`Input '${self.Id}' is changed from '${lastvalue}' to '${currentvalue}'`)
		return true
	} else {
		return false
	}
}