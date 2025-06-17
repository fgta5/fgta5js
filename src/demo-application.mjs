const app = new $fgta5.Application('myapp')

const btnFooterShow = new $fgta5.Button('btnFooterShow')
const btnFooterHide = new $fgta5.Button('btnFooterHide')


export default class Page {
	async main(args) {
		await main(this, args)
	}
}


async function main(self, args) {
	btnFooterShow.addEventListener('click', (evt)=>{
		app.ShowFooter(true)
	})

	btnFooterHide.addEventListener('click', (evt)=>{
		app.ShowFooter(false)
	})


	// coba isi data
	for (var i=0; i<=100;i++) {
		var line = document.createElement('div')
		line.innerHTML = `baris ${i}`
		app.Nodes.Main.appendChild(line)
	}
}