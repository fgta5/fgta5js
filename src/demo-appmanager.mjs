const appmgr = new $fgta5.AppManager('appmain')

export default class Page {
	async main(args) {
		await main(this, args)
	}
}


async function main(self, args) {
	const mdls = document.querySelectorAll('#recentmodules a')	
	for (let md of mdls) {
		md.addEventListener('click', ()=>{
			var module = md.getAttribute('data-module')
			var title = md.innerHTML
			var param = {
				type: 'module',
				title: title,
				module: module
			}
			appmgr.OpenModule(param)
		})
	}

	appmgr.SetMenu([
		{
			type: 'group',
			title: 'Accounting',
			items: [
				{
					type: 'group',
					title: 'Master data',
					items: [
						{type:'module', title:'Account', module:'account'},
						{type:'module', title:'Departemen', module:'departement'},
						{type:'module', title:'Lokasi', module:'lokasi'},
						{type:'module', title:'Periode', module:'periode'}
					]
				},
				{
					type: 'group',
					title: 'Transaksi',
					items: [
						{type:'module', title:'Jurnal Umum', module:'jurnal'},
						{type:'module', title:'Pembayaran', module:'payment'},
						{type:'module', title:'Hutang', module:'hutang'}
					]
				}
			]
		},
		{
			type: 'group',
			title: 'Administrator',
			items: [
				{type:'module', title:'User'},
				{type:'module', title:'Group'}
			]
		}
	])
}


