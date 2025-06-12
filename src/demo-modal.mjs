const btn_staticmask = new $fgta5.Button('btn_staticmask')
const btn_infomask = new $fgta5.Button('btn_infomask')
const btn_progressmask = new $fgta5.Button('btn_progressmask')
const btn_stayprogressmask = new $fgta5.Button('btn_stayprogressmask')
const btn_interuptedprogressmask = new $fgta5.Button('btn_interuptedprogressmask')


export default class Page {
	async main(args) {
		await main(this, args)
	}
}


async function main(self, args) {
	console.log('starting module')

	btn_staticmask.addEventListener('click', (evt) => { btn_staticmask_click(self, evt) });
	btn_infomask.addEventListener('click', (evt) => { btn_infomask_click(self, evt) });
	btn_progressmask.addEventListener('click', (evt) => { btn_progressmask_click(self, evt) });
	btn_stayprogressmask.addEventListener('click', (evt) => { btn_stayprogressmask_click(self, evt) });
	btn_interuptedprogressmask.addEventListener('click', (evt) => { btn_interuptedprogressmask_click(self, evt) });
}


async function btn_staticmask_click(self, evt) {
	var mask = $fgta5.Modal.Mask()
	await new Promise(resolve => setTimeout(resolve, 3000));
	mask.close();
}

async function btn_infomask_click(params) {
	var mask = $fgta5.Modal.Mask()
	await new Promise(resolve => setTimeout(resolve, 1000))

	mask.setText('doing first progress')
	await new Promise(resolve => setTimeout(resolve, 1000))

	mask.setText('and then second progress')
	await new Promise(resolve => setTimeout(resolve, 1000))

	mask.setText('try to start third one')
	await new Promise(resolve => setTimeout(resolve, 1000))

	mask.setText('finalize progress')
	await new Promise(resolve => setTimeout(resolve, 1000))

	mask.close();
}

async function btn_progressmask_click(self, evt) {
	var prog = $fgta5.Modal.Progress()
	prog.setProgress(0, "initializing") 
	await new Promise(resolve => setTimeout(resolve, 1000));

	for (var i = 1; i <= 10; i++) {
		var progress = i * 10
		prog.setProgress(i * 10, "processing " + progress + "%")
		await new Promise(resolve => setTimeout(resolve, 1000));
	}
	prog.finish()
	
}

async function btn_stayprogressmask_click(self, evt) {
	var prog = $fgta5.Modal.Progress({buttonClose: true})
	prog.setProgress(0, "initializing") 
	await new Promise(resolve => setTimeout(resolve, 1000));

	for (var i = 1; i <= 10; i++) {
		var progress = i * 10
		prog.setProgress(i * 10, "processing " + progress + "%")
		await new Promise(resolve => setTimeout(resolve, 1000));
	}
	prog.finish()
}

async function btn_interuptedprogressmask_click(self, evt) {
	var prog = $fgta5.Modal.Progress()
	prog.setProgress(0, "initializing") 
	await new Promise(resolve => setTimeout(resolve, 1000));

	try {
		var test_error = true
		for (var i = 1; i <= 10; i++) {
			
			var progress = i * 10
			prog.setProgress(i * 10, "processing " + progress + "%")
			await new Promise(resolve => setTimeout(resolve, 1000));

			if (test_error && i==5) {
				throw new Error(`error at ${progress}%`)
			}
		}
		prog.finish()
	} catch (err) {
		prog.setError(err.message)
		prog.finish('Close', false)
	}
}

