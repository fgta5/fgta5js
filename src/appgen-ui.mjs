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


const generateId = (prefix = "el") => {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;
}

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
	ME.tbl_entity = document.getElementById('tbl_entity')
	ME.btn_addEntity = document.getElementById('btn_addentity')
	ME.btn_addEntity.addEventListener('click', (evt)=>{
		btn_addEntity_click(self, evt)
	})
}


function btn_addEntity_click(self, evt) {
	AppGenLayout_AddEntity(self, {

	})
}

async function AppGenLayout_AddEntity(self, entity={}) {
	const ID = entity[ENT_COL_ID] ?? generateId('entity')
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
		if (isheader===true) {
			type='hidden'
			input.setAttribute('type', 'hidden')
		} 

		if (type=='hidden') {
			col.innerHTML = data['value'] 
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
	let btn_remove = fn_set_input('button', "remove", ENT_COL_BTNREMOVE)

	btn_design.addEventListener('click', (evt)=>{
		console.log(`design ${ID}`)
	})
	
	btn_remove.addEventListener('click', (evt)=>{
		console.log(`remove ${ID}`)
	})
}




function AppGenLayout_NewData(self) {
	// siapkan header
	AppGenLayout_AddEntity(self, {
		isheader: true,
		col_name: 'header'
	})
}