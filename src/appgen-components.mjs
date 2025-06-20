
const ICON_Textbox = ``
const ICON_Numberbox = ``
const ICON_Checkbox = ``
const ICON_Combobox = ``
const ICON_Datepicker = ``
const ICON_Timepicker = ``
const ICON_Filebox = ``



const Textbox = {
	title: 'Textbox',
	descr: '',
	icon: ICON_Textbox,
	properties: {
		fieldname: {title: 'Field Name', type:'text'},
		datatype: {title: 'Datatype', type:'select', options:['varchar', 'char'], default:'varchar'},
		datalength: {title: 'Length', type:'number'},
		show_in_datagrid: {title: 'Show in datagrid', type: 'checkbox', default:'checked'},
		show_in_form: {title: 'Show in Form', type: 'checkbox', default:'checked'},
	}
}

const Numberbox = {
	title: 'Numberbox',
	descr: '',
	icon: ICON_Numberbox,
	properties: {
		labeltext: {title: 'label text', descr: 'text yang akan menjadi label untuk input ini'},

	}
}

const Checkbox = {
	title: 'Checkbox',
	descr: '',
	icon: ICON_Checkbox,
	properties: {
		
	}
}

const Combobox = {
	title: 'Combobox',
	descr: '',
	icon: ICON_Combobox,
	properties: {
		labeltext: {title: 'label text', descr: 'text yang akan menjadi label untuk input ini'},

	}
}

const Datepicker = {
	title: 'Datepicker',
	descr: '',
	icon: ICON_Datepicker,
	properties: {
		labeltext: {title: 'label text', descr: 'text yang akan menjadi label untuk input ini'},
		
	}
}

const Timepicker = {
	title: 'Timepicker',
	descr: '',
	icon: ICON_Timepicker,
	properties: {
		labeltext: {title: 'label text', descr: 'text yang akan menjadi label untuk input ini'},
		
	}
}

const Filebox = {
	title: 'Filebox',
	descr: '',
	icons: ICON_Filebox,
	icon: ICON_Timepicker,
	properties: {
		labeltext: {title: 'label text', descr: 'text yang akan menjadi label untuk input ini'},
		
	}
}


const Items = {
	Textbox: Textbox,
	Numberbox: Numberbox,
	Checkbox: Checkbox,
	Combobox: Combobox,
	Datepicker: Datepicker,
	Timepicker: Timepicker,
	Filebox: Filebox
}

export default Items