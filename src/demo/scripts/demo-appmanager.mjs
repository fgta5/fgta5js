const appmgr = new $fgta5.AppManager('appmain')

export default class Page {
	async main(args) {
		await main(this, args)
	}
}


// sample program list
const programs = {
	appgen: new $fgta5.ModuleData({name:'generator', title:'Generator', url:'/textbox'}),
	account: new $fgta5.ModuleData({name:'account', title:'Account', url:'/numberbox'}),
	departement: new $fgta5.ModuleData({name:'departement', title:'Departemen', url:'/datepicker'}),
	lokasi: new $fgta5.ModuleData({name:'lokasi', title:'Lokasi', url:'/timepicker'}),
	periode: new $fgta5.ModuleData({name:'periode', title:'Periode', url:'/combobox'}),
	jurnal: new $fgta5.ModuleData({name:'jurnal', title:'Jurnal Umum', url:'/checkbox', disabled:true}),
	payment: new $fgta5.ModuleData({name:'payment', title:'Pembayaran', url:'/fileupload'}),
	hutang: new $fgta5.ModuleData({name:'hutang', title:'Hutang', url:'/textbox'}),
	user: new $fgta5.ModuleData({name:'user', title:'User', url:'/numberbox'}),
	group: new $fgta5.ModuleData({name:'group', title:'Group', url:'/datepicker'}),
	crud01: new $fgta5.ModuleData({name:'crud01', title:'Simple CRUD', url:'/form'}),
}


const ProfileModule = new $fgta5.ModuleData({name:'profile', title:'My Profile', url:'/textbox'})
const SettingModule = new $fgta5.ModuleData({name:'setting', title:'Setting', url:'/numberbox'})

async function main(self, args) {
	
	const appmain = document.getElementById('appmain')
	appmain.classList.add('hidden')

	appmgr.setTitle('Fgta5 Application Manager')
	appmgr.setMenu([
		programs.appgen,

		{
			title: 'Accounting',
			border: false,
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
	appmgr.setFavourite([ 'appgen', 'crud01', 'account',  'periode'])

	appmgr.setUser({userid:'1234', displayname:'Agung Nugroho', profilepic:''})


	// await appmgr.openModule(programs.generator)
	setTimeout(()=>{
		appmain.classList.remove('hidden')
	}, 1000)
	

	appmgr.addEventListener('logout', (evt)=>{
		console.log('logout action')
	})

	appmgr.addEventListener('openprofile', (evt)=>{
		appmgr.openModule(ProfileModule)
	})

	appmgr.addEventListener('opensetting', (evt)=>{
		appmgr.openModule(SettingModule)
	})


	appmgr.addEventListener('action', (evt)=>{
		console.log('action triggered')
	})
	

	appmgr.addEventListener('removefavourite', (evt)=>{
		console.log('remove from favourite')
	})


	appmgr.addEventListener('addtofavourite', (evt)=>{
		console.log('add to favourite')
	})
}
