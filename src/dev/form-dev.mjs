const btnTogle = new $fgta5.ActionButton('btnTogle')
const btnAccept = new $fgta5.ActionButton('btnAccept')
const btnReset = new $fgta5.ActionButton('btnReset')

const form = new $fgta5.Form('main_form')


export default class {
	async main() {
		form.render()

		update_togle_button()

		btnTogle.addEventListener('click', (args) => {
			btnTogle_click(this, args)
		})

		btnAccept.addEventListener('click', (args) => {
			btnAccept_click(this, args)

		})

		btnReset.addEventListener('click', (args) => {
			btnReset_click(this, args)
		})
	}
}


function update_togle_button() {
	const isLocked = form.isLocked();
	const label = isLocked ? 'Edit' : 'Lock';
	const lockIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`;
	const editIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z"></path></svg>`;
	const icon = isLocked ? editIcon : lockIcon;

	btnTogle.setText(`<span class="action-button-icon">${icon}</span><span class="action-button-text">${label}</span>`);
}


async function btnTogle_click(self, args) {
	if (!form.isLocked() && form.isChanged()) {
		// when form is modified
		await $fgta5.MessageBox.warning('Data is changed, please accept changes or reset before lock');
		return
	}


	form.lock(!form.isLocked())
	update_togle_button()

	if (form.isLocked()) {
		btnAccept.suspend(true)
		btnReset.suspend(true)
	} else {
		btnAccept.suspend(false)
		btnReset.suspend(false)
	}
}


async function btnAccept_click(self, args) {
	console.log('accept')
	form.acceptChanges()
}


async function btnReset_click(self, args) {
	if (form.isChanged()) {
		var res = await $fgta5.MessageBox.confirm('Data is changed, are you sure to reset?')
		console.log(res)
		if (res != 'ok') {
			return
		}
		form.reset()
	}
}