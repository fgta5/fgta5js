const appmgr = new $fgta5.AppManager('appmain')

export default class Page {
	async main(args) {
		await main(this, args)
	}
}


// sample program list
const programs = {
	appgen: new $fgta5.ModuleData({name:'generator', title:'Generator', url:'appgen'}),
	account: new $fgta5.ModuleData({name:'account', title:'Account', icon:'images/iconprograms/mcfly.png'}),
	departement: new $fgta5.ModuleData({name:'departement', title:'Departemen', icon: 'images/iconprograms/mcfly.png'}),
	lokasi: new $fgta5.ModuleData({name:'lokasi', title:'Lokasi', icon: 'images/iconprograms/medicine.png'}),
	periode: new $fgta5.ModuleData({name:'periode', title:'Periode', icon: 'images/iconprograms/mountain.png'}),
	jurnal: new $fgta5.ModuleData({name:'jurnal', title:'Jurnal Umum', icon: 'images/iconprograms/packman.png', disabled:true}),
	payment: new $fgta5.ModuleData({name:'payment', title:'Pembayaran', icon: 'images/iconprograms/photo.png'}),
	hutang: new $fgta5.ModuleData({name:'hutang', title:'Hutang', icon: 'images/iconprograms/pin.png'}),
	user: new $fgta5.ModuleData({name:'user', title:'User', icon: 'images/iconprograms/pizza.png'}),
	group: new $fgta5.ModuleData({name:'group', title:'Group', icon: 'images/iconprograms/speakers.png'}),
	crud01: new $fgta5.ModuleData({name:'crud01', title:'Simple CRUD', icon: 'images/iconprograms/speakers.png', url:'demo-crud'}),

}


const ProfileModule = new $fgta5.ModuleData({name:'profile', title:'My Profile', icon: 'images/iconprograms/toaster.png'})
const SettingModule = new $fgta5.ModuleData({name:'setting', title:'Setting', icon: 'images/iconprograms/train.png'})

async function main(self, args) {
	
	const appmain = document.getElementById('appmain')
	appmain.classList.add('hidden')

	appmgr.SetTitle('Fgta5 Application Manager')
	appmgr.SetMenu([
		programs.generator,

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
		
		programs.crud01,
		
	
	])

	// set program favourite	
	appmgr.SetFavourite([ 'appgen', 'crud01', 'account',  'periode'])

	appmgr.SetUser({userid:'1234', displayname:'Agung Nugroho', profilepic:''})


	// await appmgr.OpenModule(programs.generator)
	setTimeout(()=>{
		appmain.classList.remove('hidden')
	}, 1000)
	

	appmgr.addEventListener('logout', (evt)=>{
		// do something when logout
		// console.log('logout action')
		// console.log(evt.detail)
	})

	appmgr.addEventListener('openprofile', (evt)=>{
		// do something when logout
		// console.log('open user profule')
		// console.log(evt.detail)
		appmgr.OpenModule(ProfileModule)
	})

	appmgr.addEventListener('opensetting', (evt)=>{
		// do something when logout
		// console.log('open setting')
		// console.log(evt.detail)
		appmgr.OpenModule(SettingModule)
	})


	appmgr.addEventListener('action', (evt)=>{
		// click program, dll
		// console.log('action triggered')
		// console.log(evt.detail)
	})
	

	appmgr.addEventListener('removefavourite', (evt)=>{
		// console.log('remove from favourite')
		// console.log(evt.detail)
	})


	appmgr.addEventListener('addtofavourite', (evt)=>{
		// console.log('add to favourite')
		// console.log(evt.detail)
	})
}


