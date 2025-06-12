const txtState = document.getElementById('txtState')

const btn_reset = new $fgta5.Button('btn_reset')
const btn_save = new $fgta5.Button('btn_save')
const btn_new = new $fgta5.Button('btn_new')
const btn_edittogle = new $fgta5.Button('btn_edittogle')

const btn_testvalidation = new $fgta5.Button('btn_testvalidation')
const btn_testdised = new $fgta5.Button('btn_testdised')
const btn_clearerror = new $fgta5.Button('btn_clearerror')

const form = new $fgta5.Form('myform');
const obj_nama = form.Inputs.obj_nama
const obj_disabled = form.Inputs.obj_disabled
const obj_alamat = form.Inputs.obj_alamat
const obj_nilai = form.Inputs.obj_nilai
const obj_tanggal = form.Inputs.obj_tanggal
const obj_jam = form.Inputs.obj_jam
const obj_kota = form.Inputs.obj_kota


// untuk keperluan test & debug agar bisa diakses langsung dari console
// PERHATIAN! jangan lakukan ini untuk production
window.form = form
window.obj_nama = obj_nama
window.obj_nilai = obj_nilai
window.obj_disabled = obj_disabled
window.obj_alamat = obj_alamat
window.obj_tanggal = obj_tanggal
window.obj_jam = obj_jam
window.obj_kota = obj_kota



export default class Page {
	async main(args) {
		await main(this, args)
	}
		
}


async function main(self, args) {
	console.log('starting module')


	btn_edittogle.addEventListener('click', (evt) => { btn_edittogle_click(self, evt) });
	btn_reset.addEventListener('click', (evt) => { btn_reset_click(self, evt) });
	btn_save.addEventListener('click', (evt) => { btn_save_click(self, evt) });
	btn_new.addEventListener('click', (evt) => { btn_new_click(self, evt) });

	btn_testvalidation.addEventListener('click', (evt) => { btn_testvalidation_click(self, evt) });
	btn_testdised.addEventListener('click', (evt) => { btn_testdised_click(self, evt) });
	btn_clearerror.addEventListener('click', (evt) => { btn_clearerror_click(self, evt) });


	if (obj_nama!=null) {
		obj_nama.addEventListener('input', (evt)=>{
			// console.log('input', evt)
		})

		obj_nama.addEventListener('keydown', (evt)=>{
			// console.log('keydown', evt)
		})
	}



	if (obj_disabled!=null) {
		obj_disabled.addEventListener('checked', (evt)=>{
			console.log('checked')
		})

		obj_disabled.addEventListener('unchecked', (evt)=>{
			console.log('unchecked')
		})
	}


	if (obj_nilai!=null) {
		obj_nilai.addEventListener('change', (evt)=>{
			console.log(evt.detail)
		})

	}


	if (obj_tanggal!=null) {
		obj_tanggal.addEventListener('change', (evt)=>{
			console.log('Tanggal berubah')
			console.log(evt.detail)
		})
	}
	

	if (obj_kota!=null) {
		obj_kota.addEventListener('change', (evt)=>{
			console.log(evt.detail)
		})

		obj_kota.addEventListener('optionformatting', (evt)=>{
			// console.log(evt.detail)
		})

		obj_kota.addEventListener('selecting', (evt)=>{
			obj_kota_selecting(evt)
		})
		
	}


	form.addEventListener('locked', (evt) => { form_locked(self, evt) });
	form.addEventListener('unlocked', (evt) => { form_unlocked(self, evt) });
	form.Render()

}


function obj_kota_selecting(evt) {
	const cbo = evt.detail.sender
	const dialog = evt.detail.dialog
	const loader = new $fgta5.Dataloader() // cbo.CreateDataLoader()

	var searchtext = evt.detail.searchtext!=null ? evt.detail.searchtext : ''
	var args = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			searchtext: searchtext,
			offset: evt.detail.offset,
			limit: evt.detail.limit,
			test_delay: 50,
			test_stop_at: 35
		})
	}


	cbo.Wait()
	cbo.AbortHandler = () => { loader.Abort() }	
	loader.Load('http://localhost:3000/getdata', args, (err, result)=>{
		for (var row of result.data) {
			evt.detail.addRow(row.value, row.text, row)
		}
		dialog.setNext(result.nextoffset, result.limit)
		cbo.Wait(false)
	})
	
	
}

async function btn_edittogle_click(self, evt) {
	if (!form.IsLocked()) {
		// dalam posisi edit
		if (form.IsChanged()) {
			await $fgta5.MessageBox.Warning('Ada perubahan data, simpam data terlebih dahulu atau batalkan perubahan')
			return
		}
	}
	
	form.Lock(!form.IsLocked()) 
}


async function btn_reset_click(self, evt) {
	if (form.IsChanged()) {
		var ret = await $fgta5.MessageBox.Confirm("data pada form berubah, apakah akan reset data?")
		if (ret=='ok') {
			form.Reset()
		}
	}
}

async function btn_save_click(self, evt) {
	if (!form.IsChanged()) {
		console.log('tidak ada perubahan data, tidak perlu disimpan')
		return
	}

	var isValid = form.Validate()
	if (!isValid) {
		var err = new Error('Ada kesalahan pada form, silahkan perbaiki');
		console.warn(err.message);
		await $fgta5.MessageBox.Error(err.message)
		return
	} else {
		form.AcceptChanges()

		var data = form.GetData()
		console.log('data yang akan disimpan:', data)
	}
}

async function btn_new_click(self, evt) {
	var newdata = true;
	if (form.IsChanged()) {
		newdata = false
		var ret = await $fgta5.MessageBox.Confirm("data pada form berubah, apakah akan membuat data baru?")
		if (ret=='ok') {
			newdata = true
		}
	}

	if (newdata) {
		form.NewData({
			// nama: "Nama Baru",   // textbox
			nilai: 60,  // numberbox
			// isdisabled : true,
			// kota: null, //{value:"JKT", text:"Jakarta"},  // combobox
			// tanggal: new Date(), // datebox
			// jam: '11:00',
			// alamat: "Alamat Baru", // textarea
		})
		form.Lock(false)
	}
}




function form_locked(self, evt) {
	txtState.innerHTML = "View"
	btn_reset.Disabled = true 
	btn_save.Disabled = true
	btn_testvalidation.Disabled = true
}

function form_unlocked(self, evt) {
	txtState.innerHTML = "Edit"
	btn_reset.Disabled = false 
	btn_save.Disabled = false
	btn_testvalidation.Disabled = false
}



function btn_testvalidation_click(self, evt) {
	var isValid = form.Validate()
	if (!isValid) {	
		console.warn('ada error, di default validation');
		return
	} 
}

function btn_testdised_click(self, evt) {
	for (var name in form.Inputs) {	
		var obj = form.Inputs[name]
		obj.Disabled = !obj.Disabled
	}
}

function btn_clearerror_click(self, evt) {
	for (var name in form.Inputs) {	
		var obj = form.Inputs[name]
		obj.SetError(null)
	}
}