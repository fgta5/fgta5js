
import BasicProgram from './demo-crud-base.mjs'


const obj = {}

export default class MyApp extends BasicProgram {
	async main(args) {

		// include dynamic content yang perlu di set
		await include_all_need()

		await super.main(args)
		await main(this, args)
	}
}



 
async function main(args) {
	// include 
	obj.btn_post = new $fgta5.Button('btn_post')
	obj.btn_post.addEventListener('click', (evt)=>{
		console.log('test')
	})
}

async function include_all_need() {
	var response = await fetch('demo-crud-include')
	if (!response.ok) {
		console.error(`HTTP Error: ${response.status}`)
	}
	const data = await response.text(); 
	const myapp = document.getElementById('myapp')
	myapp.innerHTML += data
}