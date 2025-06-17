const app = new $fgta5.Application('myapp')

const btnFooterShow = new $fgta5.Button('btnFooterShow')
const btnFooterHide = new $fgta5.Button('btnFooterHide')


export default class MyApp extends CrudApplication {
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


	// const header = crud.connect({
	// 	apis: {
	// 		create: '',
	// 		retrieve: '',
	// 		update: '',
	// 		delete: '' 
	// 	},
	// 	keyfields: ['id']
	// })



	// var result = await header.retrieve({
	// 	criteria: {
	// 		id: '1234'
	// 	},
	// 	paging: {
	// 		offset: 0,
	// 		limit: 30
	// 	},
	// 	columns: ['id', 'nama', 'alamat', 'kota']
	// })

	// // misal untuk edit row
	// result.rows[0]['nama'] = 'joni'


	// // edit row
	// await header.update(rows[0])


	// // crud.delete('header', row)

	// // crud.create('header', data)
}