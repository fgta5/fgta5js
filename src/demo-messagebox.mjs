const btn_msgboxShow = new $fgta5.Button('btn_msgbox_show')
const btn_msgboxInfo = new $fgta5.Button('btn_msgbox_info')
const btn_msgboxWarn = new $fgta5.Button('btn_msgbox_warn')
const btn_msgboxError = new $fgta5.Button('btn_msgbox_error')
const btn_msgboxConfirm = new $fgta5.Button('btn_msgbox_confirm')
const btn_msgbox_choose = new $fgta5.Button('btn_msgbox_choose')


export default class Page {
	async main(args) {
		await main(this, args)
	}
		
}


async function main(self, args) {
	console.log('starting module')

	btn_msgboxShow.addEventListener('click', (evt) => { btn_msgboxShow_click(self, evt) });
	btn_msgboxInfo.addEventListener('click', (evt) => { btn_msgboxInfo_click(self, evt) });
	btn_msgboxWarn.addEventListener('click', (evt) => { btn_rmsgboxWarn_click(self, evt) });
	btn_msgboxError.addEventListener('click', (evt) => { btn_msgboxError_click(self, evt) });
	btn_msgboxConfirm.addEventListener('click', (evt) => { btn_msgboxConfirm_click(self, evt) });
	btn_msgbox_choose.addEventListener('click', (evt) => { btn_msgbox_choose_click(self, evt) });
}





async function btn_msgboxShow_click(self, evt) {
	var ret = await $fgta5.MessageBox.Show("ini messagebox ditampilkan")
	console.log(ret)
}

async function btn_msgboxInfo_click(self, evt) {
	$fgta5.MessageBox.Info("ini info ditampilkan")
}

async function btn_rmsgboxWarn_click(self, evt) {
	$fgta5.MessageBox.Warning("ini warning ditampilkan")
}

async function btn_msgboxError_click(self, evt) {
	$fgta5.MessageBox.Error("ini error ditampilkan")
}

async function btn_msgboxConfirm_click(self, evt) {
	var ret = await $fgta5.MessageBox.Confirm("konfirmasi, oke tidak ?")
	console.log(ret)
}

async function btn_msgbox_choose_click(self, evt) {
	var ret = await $fgta5.MessageBox.Show("Kamu mau soto atau gulai ?", {
		iconcss: 'demo-icon-food',
		buttons: {
			soto: new $fgta5.MessageBoxButton('Soto'),
			gulai: new $fgta5.MessageBoxButton('Gulai'),
		}
	})
	console.log(ret)
}


