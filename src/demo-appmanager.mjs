const appmgr = new $fgta5.AppManager('appmain')

export default class Page {
	async main(args) {
		await main(this, args)
	}
}

const programs = {
	account: new $fgta5.ModuleData({type:'module', title:'Account', name:'account', icon: 'images/iconprograms/map.png'}),
	departement: new $fgta5.ModuleData({type:'module', title:'Departemen', name:'departement', icon: 'images/iconprograms/mcfly.png'}),
	lokasi: new $fgta5.ModuleData({type:'module', title:'Lokasi', name:'lokasi', icon: 'images/iconprograms/medicine.png'}),
	periode: new $fgta5.ModuleData({type:'module', title:'Periode', name:'periode', icon: 'images/iconprograms/mountaint.png'}),
	jurnal: new $fgta5.ModuleData({type:'module', title:'Jurnal Umum', name:'jurnal', icon: 'images/iconprograms/packman.png', disabled:true}),
	payment: new $fgta5.ModuleData({type:'module', title:'Pembayaran', name:'payment', icon: 'images/iconprograms/photo.png'}),
	hutang: new $fgta5.ModuleData({type:'module', title:'Hutang', name:'hutang', icon: 'images/iconprograms/pin.png'}),
	user: new $fgta5.ModuleData({type:'module', title:'User', name:'user', icon: 'images/iconprograms/pizza.png'}),
	group: new $fgta5.ModuleData({type:'module', title:'Group', naem:'group', icon: 'images/iconprograms/speakers.png'})
}


async function main(self, args) {
	// const mdls = document.querySelectorAll('#recentmodules a')	
	// for (let md of mdls) {
	// 	md.addEventListener('click', ()=>{
	// 		var module = md.getAttribute('data-module')
	// 		var title = md.innerHTML
	// 		var param = {
	// 			type: 'module',
	// 			title: title,
	// 			module: module
	// 		}
	// 		appmgr.OpenModule(param)
	// 	})
	// }




	appmgr.SetMenu([
		{
			title: 'Accounting',
			items: [
				{
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
			items: [
				programs.user,
				programs.group
			]
		}
	])

		appmgr.SetFavourite([
			programs.account,
			programs.jurnal,
			programs.user,
		])
}


