const btn_adddetil = document.getElementById('btn_adddetil')

export default class UIGenerator {
	init() {
		btn_adddetil.addEventListener('click', (evt)=>{
			uigen_adddetil(this, evt)
		})
	}
}

function generateId(prefix = "el") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;
}

function uigen_adddetil(self, evt) {
	const el = evt.target
	const tr = el.closest('tr')
	const table = el.closest('table')
	const tpl = table.querySelector('tr[data-tplname="tpldesignrow"]')
	const newtr = tpl.cloneNode(true); // salin isi template
	const id = generateId('detil')


	newtr.setAttribute('id', id)
	newtr.classList.remove('hidden')
	tr.before(newtr)

	const btndesign = newtr.querySelector('[data-tplname="tpldesignrow-btndesign"]')
	btndesign.addEventListener('click', (evt)=>{
		uigen_design(self, evt, id)
	})


	const btnremove = newtr.querySelector('[data-tplname="tpldesignrow-btnremove"]')
	btnremove.addEventListener('click', (evt)=>{
		uigen_removedetil(self, evt)
	})

	

	const dataeditorboard = document.getElementById('dataeditorboard')
	const neweditor = document.createElement('div')
	neweditor.setAttribute('data-detil-id', id)
	neweditor.innerHTML = id
	dataeditorboard.appendChild(neweditor)
}

function uigen_removedetil(self, evt) {
	const el = evt.target
	const tr = el.closest('tr')
	const id = tr.getAttribute('id')
	const dataeditorboard = document.getElementById('dataeditorboard')

	const editor = dataeditorboard.querySelector(`[data-detil-id="${id}"]`)
	tr.remove()
	editor.remove()
}

function uigen_design(self, evt, id) {
	console.log(id)
}