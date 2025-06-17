import BasicProgram from './demo-crud-base.mjs'

export default class MyApp extends BasicProgram {
	async main(args) {
		await super.main(args)
		await main(this, args)
	}
}

async function main(args) {

	// load dynamic content
	var response = await fetch('demo-crud-include')
	if (!response.ok) {
		console.error(`HTTP Error: ${response.status}`)
	}

	const data = await response.text(); 
	const div = document.getElementById('dynamicload')
	div.innerHTML = data

}