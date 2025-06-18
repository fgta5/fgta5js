/* demo-crud-base.mjs 
 *
 * halaman ini seharusnya dibuat dengan generator 
 * untuk mendefinisikan applikasi
 * yang mengakses tabel-tabel tertentu secara medasar
 * 
 * sebaiknya beri nama file sesuai dengan nama modulnya
 * 
 * custom akan dilakukan di demo-crud.msj
 */

const app = new $fgta5.Application('myapp')


export default class BasicProgram {
	get Application() { return app }
	async main(args) {
		await main(this, args)
	}

	
}

async function main(args) {
	console.log('ini basic program')

	
} 