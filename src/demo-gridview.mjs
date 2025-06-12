const tbl_data = new $fgta5.Gridview('tbl_data')


export default class Page {
	async main(args) {
		await main(this, args)
	}
}


async function main() {
	console.log('tbl_data')


	tbl_data.AddRows([
		{nama:'agung', alamat:'taman royal', kota:'tangerang', phone:'123'},
		{nama:'nugroho', alamat:'citra indah', kota:'cibubur', phone:'456'},
		{nama:'dwi', alamat:'jl pramuka', kota:'jakarta', phone:'789'},
		{nama:'wibowo', alamat:'jl pantirejo', kota:'salatiga', phone:'101'},
	])

	tbl_data.SetNext(4, 10)
}