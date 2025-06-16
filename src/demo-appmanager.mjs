const appmgr = new $fgta5.AppManager('appmain')

export default class Page {
	async main(args) {
		await main(this, args)
	}
}


// sample program list
const programs = {
	account: new $fgta5.ModuleData({name:'account', title:'Account', icon: 'images/iconprograms/map.png'}),
	departement: new $fgta5.ModuleData({name:'departement', title:'Departemen', icon: 'images/iconprograms/mcfly.png'}),
	lokasi: new $fgta5.ModuleData({name:'lokasi', title:'Lokasi', icon: 'images/iconprograms/medicine.png'}),
	periode: new $fgta5.ModuleData({name:'periode', title:'Periode', icon: 'images/iconprograms/mountain.png'}),
	jurnal: new $fgta5.ModuleData({name:'jurnal', title:'Jurnal Umum', icon: 'images/iconprograms/packman.png', disabled:true}),
	payment: new $fgta5.ModuleData({name:'payment', title:'Pembayaran', icon: 'images/iconprograms/photo.png'}),
	hutang: new $fgta5.ModuleData({name:'hutang', title:'Hutang', icon: 'images/iconprograms/pin.png'}),
	user: new $fgta5.ModuleData({name:'user', title:'User', icon: 'images/iconprograms/pizza.png'}),
	group: new $fgta5.ModuleData({name:'group', title:'Group', icon: 'images/iconprograms/speakers.png'})
}


async function main(self, args) {
	appmgr.SetMenu([
		{
			title: 'Accounting',
			border: false,
			items: [
				{
					icon: 'images/icon-food.svg',
					title: 'Master data',
					items: [
						programs.account,
						programs.departement,
						programs.lokasi,
						programs.periode
					]
				},
				{
					title: 'Transaksi',
					border: false,
					items: [
						programs.jurnal,
						programs.payment,
						programs.hutang
					]
				}
			]
		},
		{
			title: 'Administrator',
			border: false,
			items: [
				programs.user,
				programs.group
			]
		}
	])

	// set program favourite	
	appmgr.SetFavourite(['account', 'jurnal', 'user'])

}


