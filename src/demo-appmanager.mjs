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
	group: new $fgta5.ModuleData({name:'group', title:'Group', icon: 'images/iconprograms/speakers.png'}),

	group01: new $fgta5.ModuleData({name:'group01', title:'Group 01', icon: 'images/iconprograms/speakers.png'}),
	group02: new $fgta5.ModuleData({name:'group02', title:'Group 02', icon: 'images/iconprograms/speakers.png'}),
	group03: new $fgta5.ModuleData({name:'group03', title:'Group 03', icon: 'images/iconprograms/speakers.png'}),
	group04: new $fgta5.ModuleData({name:'group04', title:'Group 04', icon: 'images/iconprograms/speakers.png'}),
	group05: new $fgta5.ModuleData({name:'group05', title:'Group 05', icon: 'images/iconprograms/speakers.png'}),
	group06: new $fgta5.ModuleData({name:'group06', title:'Group 06', icon: 'images/iconprograms/speakers.png'}),
	group07: new $fgta5.ModuleData({name:'group07', title:'Group 07', icon: 'images/iconprograms/speakers.png'}),
	group08: new $fgta5.ModuleData({name:'group08', title:'Group 08', icon: 'images/iconprograms/speakers.png'}),
	group09: new $fgta5.ModuleData({name:'group09', title:'Group 09', icon: 'images/iconprograms/speakers.png'}),
	group10: new $fgta5.ModuleData({name:'group10', title:'Group 10', icon: 'images/iconprograms/speakers.png'}),
	group11: new $fgta5.ModuleData({name:'group11', title:'Group 11', icon: 'images/iconprograms/speakers.png'}),
	group12: new $fgta5.ModuleData({name:'group12', title:'Group 12', icon: 'images/iconprograms/speakers.png'}),
	group13: new $fgta5.ModuleData({name:'group13', title:'Group 13', icon: 'images/iconprograms/speakers.png'}),
	group14: new $fgta5.ModuleData({name:'group14', title:'Group 14', icon: 'images/iconprograms/speakers.png'}),
	group15: new $fgta5.ModuleData({name:'group15', title:'Group 15', icon: 'images/iconprograms/speakers.png'}),
	group16: new $fgta5.ModuleData({name:'group16', title:'Group 16', icon: 'images/iconprograms/speakers.png'}),
	group17: new $fgta5.ModuleData({name:'group17', title:'Group 17', icon: 'images/iconprograms/speakers.png'}),
	group18: new $fgta5.ModuleData({name:'group18', title:'Group 18', icon: 'images/iconprograms/speakers.png'}),
	group19: new $fgta5.ModuleData({name:'group19', title:'Group 19', icon: 'images/iconprograms/speakers.png'}),
	group20: new $fgta5.ModuleData({name:'group20', title:'Group 20', icon: 'images/iconprograms/speakers.png'}),
	group21: new $fgta5.ModuleData({name:'group21', title:'Group 21', icon: 'images/iconprograms/speakers.png'}),
	group22: new $fgta5.ModuleData({name:'group22', title:'Group 22', icon: 'images/iconprograms/speakers.png'}),
	group23: new $fgta5.ModuleData({name:'group23', title:'Group 23', icon: 'images/iconprograms/speakers.png'}),
	group24: new $fgta5.ModuleData({name:'group24', title:'Group 24', icon: 'images/iconprograms/speakers.png'}),
	group25: new $fgta5.ModuleData({name:'group25', title:'Group 25', icon: 'images/iconprograms/speakers.png'}),
	group26: new $fgta5.ModuleData({name:'group26', title:'Group 26', icon: 'images/iconprograms/speakers.png'}),
	group27: new $fgta5.ModuleData({name:'group27', title:'Group 27', icon: 'images/iconprograms/speakers.png'}),
	group28: new $fgta5.ModuleData({name:'group28', title:'Group 28', icon: 'images/iconprograms/speakers.png'}),
	group29: new $fgta5.ModuleData({name:'group29', title:'Group 29', icon: 'images/iconprograms/speakers.png'}),
	group30: new $fgta5.ModuleData({name:'group30', title:'Group 30', icon: 'images/iconprograms/speakers.png'}),
	group31: new $fgta5.ModuleData({name:'group31', title:'Group 31', icon: 'images/iconprograms/speakers.png'}),
	group32: new $fgta5.ModuleData({name:'group32', title:'Group 32', icon: 'images/iconprograms/speakers.png'}),
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
				programs.group,
			]
		},
		
		programs.group01,
		programs.group02,
		programs.group03,
		programs.group04,
		programs.group05,
		programs.group06,
		programs.group07,
		programs.group08,
		programs.group09,
		programs.group10,
		programs.group11,
		programs.group12,
		programs.group13,
		programs.group14,
		programs.group15,
		programs.group16,
		programs.group17,
		programs.group18,
		programs.group19,
		programs.group20,
		programs.group21,
		programs.group22,
		programs.group23,
		programs.group24,
		programs.group25,
		programs.group26,
		programs.group27,
		programs.group28,
		programs.group29,
		programs.group30,
		programs.group31,
		programs.group32,
	])

	// set program favourite	
	appmgr.SetFavourite(['account', 'jurnal', 'user'])

	appmgr.SetUser({userid:'1234', displayname:'Agung Nugroho', profilepic:''})


	appmgr.addEventListener('logout', (evt)=>{
		// do something when logout
		console.log('logout action')
		console.log(evt.detail)
	})

	appmgr.addEventListener('openprofile', (evt)=>{
		// do something when logout
		console.log('open user profule')
		console.log(evt.detail)
	})

	appmgr.addEventListener('opensetting', (evt)=>{
		// do something when logout
		console.log('open setting')
		console.log(evt.detail)
	})


	appmgr.addEventListener('action', (evt)=>{
		// click program, dll
		console.log('action triggered')
		console.log(evt.detail)
	})
	

}


