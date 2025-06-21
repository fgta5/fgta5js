import Components from './appgen-components.mjs'

const URL_LAYOUT = 'appgen-layout'
const ME = {}

const ENT_COL_ID =  'col_id'
const ENT_COL_NAME =  'col_name'
const ENT_COL_TITLE =  'col_title'
const ENT_COL_TABLE =  'col_table'
const ENT_COL_PK =  'col_pk'
const ENT_COL_BTNDESIGN =  'col_btndesign'
const ENT_COL_BTNREMOVE =  'col_btnremove'

const ATTR_NAME = 'name'
const ATTR_ENTITYID = 'data-entity-id'
const ATTR_DROPTARGET = 'drop-target'
const ATTR_DRAGOVER = 'data-dragover'
const ATTR_CURRENTENTITY = 'data-currententity'

const ID_ENTITYEDITOR = 'entity-editor'
const ID_DESIGNERINFO = 'designer-info'
const ID_ICONTOOL = 'component-icon-tool'
const ID_DESIGNFIELD = 'design-data-field'

const CLS_HIDDEN = 'hidden'
const CLS_ENTITYEDITOR = 'entity-editor'


const DRAG_ICONTOOL = 'drag-icon-tool'
const DRAG_REORDERFIELD = 'drag-reorderfield'

// let drop_valid = false

const CURRENT = {
	drag_action: null,
	drop_valid: false,
	entity_id: null,
	Design: null,
	droptarget: null
}


const generateId = (prefix = "el") => {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;
}
const isValidName = str => /^[_a-z0-9]+$/.test(str) ;


const createInputElement = (type, entity_id, data={}) => {
	const input = document.createElement('input')
	input.setAttribute('type', type)
	input.setAttribute(ATTR_NAME, data.name)
	input.setAttribute(ATTR_ENTITYID, entity_id)
	input.value = data.value
	return input	
}

export default class AppGenUI {
	#app
	
	constructor(app) {
		this.#app = app
		
	}

	get App() { return this.#app}

	NewData() {
		AppGenLayout_NewData(this)
	}

	async FetchAll(args) {
		await AppGenLayout_FetchAll(this)
		await AppGenLayout_Render(this)
		AppGenLayout_NewData(this)
	}
}

async function AppGenLayout_GetContent(self, url) {
	const response = await fetch(url)
	if (!response.ok) {
		console.error(`HTTP Error: ${response.status}`)
	}
	const data = await response.text(); 
	return data
}

async function AppGenLayout_FetchAll(self) {
	const main = self.App.Nodes.Main
	const data = await AppGenLayout_GetContent(self, URL_LAYOUT)
	main.innerHTML += data
}

async function AppGenLayout_Render(self) {
	ME.ComponentList = document.getElementById('crud-component-list')
	ME.DesignTemplate = document.getElementById('DESIGNTEMPLATE')
	ME.DataEntities = document.getElementById('data-entities')
	ME.EntityDesigner = document.getElementById('entities-design')
	ME.LayoutEditor = document.getElementById('layout-editor')
	ME.LayoutSidebar = document.getElementById('layout-sidebar')
	ME.EntityDesigner = document.getElementById('entities-design')
	ME.tbl_entity = document.getElementById('tbl_entity')
	ME.btn_addEntity = document.getElementById('btn_addentity')
	ME.btn_addEntity.addEventListener('click', (evt)=>{
		btn_addEntity_click(self, evt)
	})

	AppGenLayout_createComponentList(this)
}


function btn_addEntity_click(self, evt) {
	ME.btn_addEntity.style.animation = 'tombolDiTekanMenghilang 0.3s forwards'
	setTimeout(()=>{
		ME.btn_addEntity.classList.add('hidden')
		ME.btn_addEntity.style.animation = 'unset'
		AppGenLayout_AddEntity(self, {})
	}, 300)

	// nanti muncul lagi setelah 1 detil
	setTimeout(()=>{
		ME.btn_addEntity.classList.remove('hidden')
		ME.btn_addEntity.style.animation = 'tombolMunculLagi 0.3s forwards'
		setTimeout(()=>{
			ME.btn_addEntity.style.animation = 'unset'
		}, 300)
	}, 1000)
	

	

	
}

async function AppGenLayout_AddEntity(self, entity={}) {
	const ID = entity[ENT_COL_ID] ?? generateId('en')
	const tbl_entity = ME.tbl_entity
	const tbody = tbl_entity.querySelector('tbody')
	const cols = tbl_entity.querySelectorAll('thead > tr th')

	/*
	isi entity untuk set ulang
	entyty {
		col_id: 'xxxx',
		col_name: 'nama entity',
		col_title: 'judul entity',
		col_table: 'nama tabel',
		col_ok: 'PK dari table'
	}
	*/

	const newtr = document.createElement('tr')
	newtr.setAttribute(ATTR_ENTITYID, ID)
	cols.forEach(th => {
		const name = th.getAttribute(ATTR_NAME)
		const td = document.createElement('td')
		td.setAttribute(ATTR_NAME, name)
		newtr.appendChild(td)
	});
	tbody.appendChild(newtr)


	const fn_set_input = (type, value, entity_column_identity, isheader) => {
		const col = newtr.querySelector(`td[${ATTR_NAME}="${entity_column_identity}"]`)
		const data = {}
		data[`${ATTR_ENTITYID}`] = ID
		data[`${ATTR_NAME}`] = entity_column_identity
		data['value'] = value ?? ""
		const input = col.appendChild(createInputElement(type, ID, data))

		input.setAttribute('autocomplete', 'off')
		if (type=='text') {
			input.addEventListener('change', (evt)=>{
				AppGenLayout_entityInputChanged(self, evt)
			})
		}


		if (isheader===true) {
			type='hidden'
			input.setAttribute('type', 'hidden')
		} 
		if (type=='hidden') {
			col.innerHTML = `<span>${data['value']}</span>`
		}
		col.appendChild(input)
		return input
	}

	fn_set_input('hidden', ID, ENT_COL_ID, false)
	fn_set_input('text', entity[ENT_COL_NAME], ENT_COL_NAME, entity.isheader)
	fn_set_input('text', entity[ENT_COL_TITLE], ENT_COL_TITLE)
	fn_set_input('text', entity[ENT_COL_TABLE], ENT_COL_TABLE)
	fn_set_input('text', entity[ENT_COL_PK], ENT_COL_PK)

	let btn_design = fn_set_input('button', "design", ENT_COL_BTNDESIGN)
	btn_design.addEventListener('click', (evt)=>{
		console.log(`design ${ID}`)
		btn_design_click(self, evt)
	})

	if (entity.isheader!==true) {
		let btn_remove = fn_set_input('button', "remove", ENT_COL_BTNREMOVE)
		btn_remove.addEventListener('click', (evt)=>{
			btn_remove_click(self, evt)
		})
	}


	// tambahkan ke ME.EntityDesigner
	AppGenLayout_addDesigner(self, ID)
	
}


async function AppGenLayout_entityInputChanged(self, evt) {
	const input = evt.target
	const name = input.getAttribute(ATTR_NAME)
	const entity_id = input.getAttribute(ATTR_ENTITYID)
	const value = input.value
	
	const data = {}
	data[name] = value

	const valid = await AppGenLayout_CekEntityData(self, data)
	if (valid) {
		AppGenLayout_changeEntityInfo(self, entity_id, data)
	}

}


async function AppGenLayout_CekEntityData(self, data) {
	for (var name in data) {
		if (data[name]==null || data[name].trim()=='') {
			await $fgta5.MessageBox.Warning("lengkapi dahulu semua data entity")
			return false
		}
	}

	const rule = "hanya boleh alphabet dan angka, dengan huruf kecil,<br>tanpa spasi, tanpa character khusus."

	
	if (data[ENT_COL_NAME]!==undefined) {
		if (!isValidName(data[ENT_COL_NAME].trim())) {
			await $fgta5.MessageBox.Warning(`nama entity: <span style="font-weight:bold; color:red">${data[ENT_COL_NAME]}</span> tidak valid!<br>${rule}`)
			return false
		}
	}

	if (data[ENT_COL_TABLE]!==undefined) {
		if (!isValidName(data[ENT_COL_TABLE].trim())) {
			await $fgta5.MessageBox.Warning(`nama table: <span style="font-weight:bold; color:red">${data[ENT_COL_TABLE]}</span> tidak valid!<br>${rule}`)
			return false
		}
	}
	
	if (data[ENT_COL_PK]!==undefined) {
		if (!isValidName(data[ENT_COL_PK].trim())) {
			await $fgta5.MessageBox.Warning(`nama PK: <span style="font-weight:bold; color:red">${data[ENT_COL_PK]}</span> tidak valid!<br>${rule}`)
			return false
		}
	}

	return true
}


async function btn_design_click(self, evt) {
	const btn = evt.target
	const entity_id = btn.getAttribute(ATTR_ENTITYID)
	const editores = ME.EntityDesigner.querySelectorAll(`div[name="${ID_ENTITYEDITOR}"]`)
	const tr = btn.closest('tr')
	
	
	const data = AppGenLayout_GetEntityData(self, tr)
	const valid = await AppGenLayout_CekEntityData(self, data)
	
	if (!valid) {
		return
	}

	editores.forEach(el => {
		let ceid = el.getAttribute(ATTR_ENTITYID)
		// let info = el.getAttribute(ATTR_DATAINFO)
		// if (info==null) {
		if (ceid==entity_id) {
			el.classList.remove(CLS_HIDDEN)
			AppGenLayout_entityDesign(self, entity_id, tr)
			AppGenLayout_startDesign(self, entity_id)
		} else {
			el.classList.add(CLS_HIDDEN)
		}
	})
}


function AppGenLayout_GetEntityData(self, tr) {
	const ens = [ENT_COL_NAME, ENT_COL_TITLE, ENT_COL_TABLE, ENT_COL_PK]
	const data = {}
	ens.forEach(name => {
		const obj = tr.querySelector(`td[name="${name}"] input`)
		data[name] = obj.value
	})
	return data
}


function AppGenLayout_entityDesign(self, entity_id, tr) {
	const data = AppGenLayout_GetEntityData(self, tr)
	AppGenLayout_changeEntityInfo(self, entity_id, data)

	// tandaii tool: ATTR_CURRENTENTITY
	Array.from(ME.ComponentList.children).forEach(el=>{
		el.setAttribute(ATTR_CURRENTENTITY, entity_id)
	})
}


function AppGenLayout_changeEntityInfo(self, entity_id, data) {
	const info = ME.EntityDesigner.querySelector(`div[${ATTR_ENTITYID}="${entity_id}"] div[name="${ID_DESIGNERINFO}"]`)
	const ens = [ENT_COL_NAME, ENT_COL_TITLE, ENT_COL_TABLE, ENT_COL_PK]
	ens.forEach(name => {
		if (data[name]!==undefined) {
			const ed = info.querySelector(`div[name="${name}"]`)
			ed.innerHTML = data[name]
		}
	})

}


async function btn_remove_click(self, evt) {
	const btn = evt.target
	const tr = btn.closest('tr')
	const data = AppGenLayout_GetEntityData(self, tr)

	var sudahadadata = false
	for (var name in data) {
		if (data[name].trim()!='') {
			sudahadadata = true
		}
	}

	if (sudahadadata) {
		var ret = await $fgta5.MessageBox.Confirm("Apakah anda yakin mau menghapus design entity ini?")
		if (ret=='ok') {
			tr.remove()
		}
	} else {
		tr.remove()
	}


}


function AppGenLayout_addDesigner(self, ID) {
	const editem = document.createElement('div')
	editem.classList.add('hidden')
	editem.classList.add(CLS_ENTITYEDITOR)
	editem.setAttribute('name', ID_ENTITYEDITOR)
	editem.setAttribute(ATTR_ENTITYID, ID)
	
	// ambil data template untuk entity info
	const tpl = ME.DesignTemplate.querySelector(`div[name="${ID_DESIGNERINFO}"]`)
	const elinfo = tpl.cloneNode(true)

	editem.appendChild(elinfo)
	ME.EntityDesigner.appendChild(editem)
}

function AppGenLayout_NewData(self) {
	// siapkan header
	AppGenLayout_AddEntity(self, {
		isheader: true,
		col_name: 'header',
		col_title: 'test_title',
		col_table: 'test_table',
		col_pk: 'test_pk'
	})
}


function AppGenLayout_highlightElement(self, droptarget) {


	droptarget.style.animation = 'pulseHighlight 1s forwards'
	setTimeout(()=>{
		droptarget.style.animation = 'unset'
	}, 1000)

}

function AppGenLayout_startDesign(self, entity_id) {
	ME.LayoutEditor.classList.remove('hidden')
	ME.LayoutSidebar.classList.remove('hidden')


	// buat drop target
	// cek apakah sudah ada drop target
	const designer = ME.EntityDesigner.querySelector(`div[${ATTR_ENTITYID}="${entity_id}"]`)
	let droptarget = designer.querySelector(`[name="${ATTR_DROPTARGET}"]`)
	if (droptarget==null) {
		// blum ada, buat dulu
		const tpl = ME.DesignTemplate.querySelector(`div[name="${ATTR_DROPTARGET}"]`)
		droptarget = tpl.cloneNode(true)
		droptarget.setAttribute(ATTR_ENTITYID, entity_id)
		designer.appendChild(droptarget)
	}

	// scroll ke element editor
	designer.scrollIntoView({
		behavior: 'smooth',
		block: 'start'
	});

	AppGenLayout_setupDropTarget(self, droptarget)

	// higlight drop target
	AppGenLayout_highlightElement(self, droptarget)

	CURRENT.entity_id = entity_id
	CURRENT.Design = designer
	CURRENT.droptarget = droptarget

}

function AppGenLayout_setupDropTarget(self, droptarget) {
	const dr = droptarget.getAttribute(ATTR_DROPTARGET)
	if (dr===true) {
		// drop target sudah di setup
		return
	}


	droptarget.addEventListener('dragover', (evt)=>{
		evt.preventDefault()
		droptarget.setAttribute(ATTR_DRAGOVER, '')
	})

	droptarget.addEventListener('dragleave', (evt)=>{
		droptarget.removeAttribute(ATTR_DRAGOVER)
		// droptarget.classList.add('hidden')
	})

	droptarget.addEventListener('drop', (evt)=>{
		CURRENT.drop_valid = true
		droptarget.removeAttribute(ATTR_DRAGOVER)
		const compname = evt.dataTransfer.getData('compname');
		AppGenLayout_addComponentToDesigner(self, droptarget, Components[compname])

		setTimeout(()=>{
			CURRENT.Design.appendChild(droptarget)
			droptarget.scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			});
		}, 300)
		// droptarget.classList.add('hidden')
	})
	
}


function AppGenLayout_createComponentList(self) {
	const tpl = ME.DesignTemplate.querySelector(`div[name="${ID_ICONTOOL}"]`)
	


	for (var name in Components) {
		let comp = Components[name]

		comp.name = name
		var iconTool = AppGenLayout_createIconTool(self, comp, tpl)
		ME.ComponentList.appendChild(iconTool)
	}

}

function AppGenLayout_createIconTool(self, comp, tpl) {
	const tool = tpl.cloneNode(true)
	const label = tool.querySelector('div[data-label]')
	label.innerHTML = comp.title


	tool.addEventListener('dragstart', (evt)=>{
		CURRENT.drop_valid = false
		CURRENT.drag_action = DRAG_ICONTOOL
		evt.dataTransfer.setData('compname', comp.name);
	})

	tool.addEventListener('dragend', (evt)=>{
		if (CURRENT.droptarget==null) {
			return
		}
		const fields = CURRENT.Design.querySelectorAll('[name="design-data-field"]')
		if (fields.length==0) {
			return
		}
		if (!CURRENT.drop_valid) {
			CURRENT.droptarget.classList.add('hidden')
		}
	})

	return tool
}


function AppGenLayout_addComponentToDesigner(self, droptarget, comp) {
	const tpl = ME.DesignTemplate.querySelector(`div[name="${ID_DESIGNFIELD}"][data-template=${comp.template}]`)
	const datafield = tpl.cloneNode(true)


	const comptype = datafield.querySelector('[name="component-type"]')
	comptype.innerHTML = comp.title

	// masukkan element baru sebelum drop target
	droptarget.before(datafield)

	// kalau data field dilewati DRAG ICON, munculkan droptarget di bawahnya
	datafield.addEventListener('dragover', (evt)=>{
		if (CURRENT.drag_action==DRAG_ICONTOOL) {
			evt.preventDefault()
			droptarget.classList.remove('hidden')

			const rect = datafield.getBoundingClientRect();
  			const offsetY = evt.clientY - rect.top;
			const offsetX = evt.clientX - rect.left;

			if (offsetX > rect.width - 100) {
				return;
			}
			

			if (offsetY < rect.height / 2) {
				setTimeout(()=>{
					datafield.before(droptarget)
				}, 300)
				
			} else {
				// console.log("Di bawah");
				setTimeout(()=>{
					datafield.after(droptarget)
				}, 300)
			}

		}
	})

}	