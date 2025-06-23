const btn = {}

export default class AppGenIO {
	Setup() {
		AppGenIO_Setup(this)
	}
	
	GetData() {
		AppGenIO_GetData(this)
	}
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

function AppGenIO_GetCurrentWorkData(self) {
	const PROG = {
		name: '',
		title: '',
		description: '',
		icon: '',
		actions: [],
		entities: []
	}
	AppGenIO_GetDef(self, PROG)
	AppGenIO_GetActions(self, PROG)
	AppGenIO_GetEntities(self, PROG)

	console.log(PROG)
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
	const entities = document.getElementById('data-entities')
	
}