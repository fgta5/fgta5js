const btnTogle = new $fgta5.Button('btnTogle')

const form = new $fgta5.Form('main_form')


export default class {
	async main() {
		form.render()



		btnTogle.addEventListener('click', (args) => {
			btnTogle_click(this, args)
		})
	}
}



function btnTogle_click(self, args) {
	console.log('click')
}