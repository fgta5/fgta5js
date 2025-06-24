const btn = {}
const ATTR_ENTITYID = 'data-entity-id'
const ATTR_COMPNAME = 'data-component-name'


const isValidName = str => /^[_a-z0-9]+$/.test(str) ;


export default class AppGenIO {
	Setup() {
		AppGenIO_Setup(this)
	}
	
	GetData() {
		AppGenIO_GetData(this)
	}
}




function getValueFrom(el, query, propertyname) {
	var res = el.querySelector(query)
	if (res==null) {
		return null
	}
	if (res[propertyname]===undefined) {
		return null
	} 
	return res[propertyname]
}

function getCheckedFrom(el, query) {
	var res = el.querySelector(query)
	if (res==null) {
		return false
	}

	return res.checked===true ? true : false
}


function AppGenIO_Setup(self) {
	console.log('setup')

	btn.save = document.getElementById('btnAppGenLoad')
	btn.save.addEventListener('click', (evt)=>{
		AppGenIO_Load(self, evt)
	})

	btn.load = document.getElementById('btnAppGenSave')
	btn.load.addEventListener('click', (evt)=>{
		AppGenIO_Save(self, evt)
	})
}

function AppGenIO_Save(self, evt) {
	AppGenIO_GetCurrentWorkData(self)
}

function AppGenIO_Load(self, evt) {
}

async function AppGenIO_GetCurrentWorkData(self) {
	const PROG = {
		name: '',
		title: '',
		description: '',
		icon: '',
		primary_entity_id: '',
		primary_entity_name: '',
		actions: [],
		entities: {},
		uniques: {},
		search: {},
	}
	
	try {
		AppGenIO_GetDef(self, PROG)
		AppGenIO_GetActions(self, PROG)
		AppGenIO_GetEntities(self, PROG)

		console.log(PROG)
	} catch (err) {
		await $fgta5.MessageBox.Error(err.message)
	}


}

function AppGenIO_GetDef(self, PROG) {
	const obj_programname = document.getElementById('obj_programname')
	const obj_programtitle = document.getElementById('obj_programtitle')
	const obj_programdescription = document.getElementById('obj_programdescription')
	const obj_icon = document.getElementById('upload-icon')


	PROG.name = obj_programname.value
	PROG.title = obj_programtitle.value 
	PROG.description = obj_programdescription.value
	PROG.icon = obj_icon.style.backgroundImage

}

function AppGenIO_GetActions(self, PROG) {
	PROG.actions = []

	const actionlist = document.getElementById('action-lists')
	const trs = actionlist.querySelectorAll('tr')
	for (let tr of trs) {
		const elname = tr.querySelector('[name="action-name"]')
		const eltitle = tr.querySelector('[name="action-title"]')

		PROG.actions.push({
			name: elname.innerHTML,
			title: eltitle.innerHTML
		})
	}

}

function AppGenIO_GetEntities(self, PROG) {
	const el = document.getElementById('data-entities')
	const trs = el.querySelectorAll('tr')
	for (var tr of trs) {
		tr.classList.remove('field-error')
		try {
			var entity_id = tr.getAttribute('data-entity-id')
			let entity = AppGenIO_GetEntityData(self, entity_id)	
			
			if (!isValidName(entity.name)) {
				throw new Error(`entity name '${entity.name}' is not valid`)
			}

			if (PROG.entities[entity.name]!==undefined) {
				// sudah ada, entiti duplikasi
				throw new Error(`entity ${entity.name} is duplicated`)
			}

			PROG.entities[entity.name] = entity
			if (entity.isheader) {
				PROG.primary_entity_id = entity_id
				PROG.primary_entity_name = entity.name
			}
		} catch (err) {
			tr.classList.add('field-error')
			throw err
		}
	}
}


function AppGenIO_GetEntityData(self, entity_id) {
	var entity = {
		id: entity_id
	}

	var de = document.getElementById('entities-design')
	var editor = de.querySelector(`div[name="entity-editor"][${ATTR_ENTITYID}="${entity_id}"]`)


	// get data info
	var elName = editor.querySelector('div[name="designer-info"] div[name="col_name"]')
	var elTitle = editor.querySelector('div[name="designer-info"] div[name="col_title"]')
	var elTable = editor.querySelector('div[name="designer-info"] div[name="col_table"]')
	var elPK = editor.querySelector('div[name="designer-info"] div[name="col_pk"]')
	var elInputDescr = editor.querySelector('div[name="designer-info"] input[name="table-descr"]')
	var elChkRowAdd = editor.querySelector('div[name="designer-info"] input[name="allow-row-add"]')
	var elChkRowRemove = editor.querySelector('div[name="designer-info"] input[name="allow-row-remove"]')

	var elIdMethod = editor.querySelector('div[name="designer-info"] select[name="identifier-method"]')
	var elIdfPrefix = editor.querySelector('div[name="designer-info"] input[name="identifier-prefix"]')
	var elIdBlock = editor.querySelector('div[name="designer-info"] input[name="identifier-block"]')
	var elIdLength = editor.querySelector('div[name="designer-info"] input[name="identifier-length"]')




	entity.name = elName.innerHTML
	entity.isheader = entity.name=='header' ? true : false;
	entity.title = elTitle.innerHTML
	entity.table = elTable.innerHTML
	entity.pk = elPK.innerHTML
	entity.descr = elInputDescr.value
	entity.allowRowAdd = elChkRowAdd.checked ? true : false
	entity.allowRowRemove = elChkRowRemove.checked ? true : false
	entity.identifierMethod = elIdMethod.value
	entity.identifierPrefix = elIdfPrefix.value
	entity.identifierBlock = elIdBlock.value
	entity.identifierLength = elIdLength.value
	

	entity.Items = {}

	// ambil data items
	let elAllFields = editor.querySelectorAll('div[name="design-data-field"]')
	for (let elfield of elAllFields) {
		elfield.classList.remove('field-error')
	}

	for (let elfield of elAllFields) {
		let field = AppGenIO_GetFieldData(self, elfield)
		if (entity.Items[field.name]!==undefined) {
			elfield.classList.add('field-error')
			throw new Error(`fieldname '${field.name}' duplicated!`)
		}
		entity.Items[field.name] = field
	}

	return entity
}


function AppGenIO_GetFieldData(self, el) {
	const field = {}
	
	field.component = el.getAttribute(ATTR_COMPNAME)
	field.data_fieldname = getValueFrom(el, 'input[name="fieldname"]', 'value')
	field.name = field.data_fieldname

	// ambil type variable
	var sel_datatyle = el.querySelector('select[name="datatype"]')
	field.data_type = sel_datatyle.options[sel_datatyle.selectedIndex].text

	field.data_length = getValueFrom(el, 'input[name="datalength"]', 'value') ?? 0
	field.data_precision = getValueFrom(el, 'input[name="dataprecission"]', 'value') ?? 0

	// allownull
	field.data_allownull = getCheckedFrom(el, 'input[name="allownull"]')

	// get defaul value
	if (field.component=='Checkbox') {
		var defaultChecked = getCheckedFrom(el, 'input[name="defaultvalue"]')
		field.data_defaultvalue = defaultChecked ? 1 : 0
	} else {
		var txt_defaultvalue = el.querySelector('input[name="defaultvalue"]')
		field.data_defaultvalue = txt_defaultvalue.value
	}

	// field description
	field.description = getValueFrom(el, 'input[name="description"]', 'value') ?? ''


	// object related
	field.input_name = getValueFrom(el, 'input[name="objectname"]', 'value') ?? ''
	field.input_label = getValueFrom(el, 'input[name="labeltext"]', 'value') ?? ''
	field.input_placeholder = getValueFrom(el, 'input[name="placeholder"]', 'value') ?? ''
	field.input_caption = getValueFrom(el, 'input[name="caption"]', 'value') ?? ''
	
	var sel_charcase = el.querySelector('select[name="charcasing"]')
	if (sel_charcase!=null) {
		field.input_charcase = sel_charcase.value
	} else {
		field.input_charcase = 'normal'
	}

	var chk_inputdisabled = el.querySelector('input[name="disabledinform"]')
	field.input_disabled = chk_inputdisabled.checked ? true : false 

	var chk_showingrid =  el.querySelector('input[name="showingrid"]')
	field.showInGrid = chk_showingrid.checked ? true : false

	var chk_showinform =  el.querySelector('input[name="showinform"]')
	field.showInForm = chk_showinform.checked ? true : false


	field.Validation = {}

	// isRequired
	field.Validation.isRequired = getCheckedFrom(el, 'input[name="isrequired"]')
	field.Validation.isMinimum = getCheckedFrom(el, 'input[name="isbatasmin"]')
	field.Validation.isMaximum = getCheckedFrom(el, 'input[name="isbatasmax"]')
	field.Validation.Minimum = getValueFrom(el, 'input[name="minimum"]', 'value')
	field.Validation.Maximum = getValueFrom(el, 'input[name="maximum"]', 'value')
	field.Validation.messageDefault = getValueFrom(el, 'input[name="msg_invalid_default"]', 'value')
	field.Validation.messageRequired = getValueFrom(el, 'input[name="msg_invalid_required"]', 'value')
	field.Validation.messageMinimum = getValueFrom(el, 'input[name="msg_invalid_minimum"]', 'value')
	field.Validation.messageMaximum = getValueFrom(el, 'input[name="msg_invalid_maximum"]', 'value')
	

	field.Reference = {}
	field.Reference.table = getValueFrom(el, 'input[name="ref_table"]', 'value')
	field.Reference.pk = getValueFrom(el, 'input[name="ref_id"]', 'value')
	field.Reference.bindingValue = getValueFrom(el, 'input[name="ref_id"]', 'value')
	field.Reference.bindingText = getValueFrom(el, 'input[name="ref_text"]', 'value')
	field.Reference.loaderApiModule = getValueFrom(el, 'input[name="loaderapimodule"]', 'value')
	field.Reference.loaderApiPath = getValueFrom(el, 'input[name="loaderapipath"]', 'value')

	
	field.Handle = {}
	field.Handle.changed = getCheckedFrom(el, 'input[name="ishandlechanged"]')
	field.Handle.input = getCheckedFrom(el, 'input[name="ishandleinput"]')
	field.Handle.keydown = getCheckedFrom(el, 'input[name="ishandlekeydown"]')
	field.Handle.checked = getCheckedFrom(el, 'input[name="ishandlechecked"]')
	field.Handle.selected = getCheckedFrom(el, 'input[name="ishandleselected"]')
	field.Handle.selecting = getCheckedFrom(el, 'input[name="ishandleselecting"]')
	field.Handle.populating = getCheckedFrom(el, 'input[name="ishandlepopulating"]')
	field.Handle.loadingdata = getCheckedFrom(el, 'input[name="ishandleloadingdata"]')


	if (!isValidName(field.data_fieldname)) {
		el.classList.add('field-error')
		throw new Error('Field Name is not valid')
	} 

	return field
}

