const appmgr = new $fgta5.AppManager('appmain')

export default class Page {
	async main(args) {
		await main(this, args)
	}
}


// sample program list
const host = window.location.origin

const programs = {
	train: new $fgta5.ModuleData({ name: 'train', title: 'Train', url: host + '/application/train', icon: 'demo/icons/train.png' }),
	map: new $fgta5.ModuleData({ name: 'map', title: 'Map', url: host + '/application/map', icon: 'demo/icons/map.png' }),
	medicine: new $fgta5.ModuleData({ name: 'medicine', title: 'Medicine', url: host + '/application/medicine', icon: 'demo/icons/medicine.png' }),
	mountain: new $fgta5.ModuleData({ name: 'mountain', title: 'Maountain', url: host + '/application/mountain', icon: 'demo/icons/mountain.png' }),
	packman: new $fgta5.ModuleData({ name: 'packman', title: 'Packman', url: host + '/application/packman', icon: 'demo/icons/packman.png' }),
	photo: new $fgta5.ModuleData({ name: 'photo', title: 'Photo', url: host + '/application/photo', icon: 'demo/icons/photo.png' }),
	pin: new $fgta5.ModuleData({ name: 'pin', title: 'Pin', url: host + '/application/pin', disabled: true, icon: 'demo/icons/pin.png' }),
	pizza: new $fgta5.ModuleData({ name: 'pizza', title: 'Pizza', url: host + '/application/pizza', icon: 'demo/icons/pizza.png' }),
	speakers: new $fgta5.ModuleData({ name: 'speakers', title: 'Speakers', url: host + '/application/speakers', icon: 'demo/icons/speakers.png' }),
	store: new $fgta5.ModuleData({ name: 'store', title: 'Store', url: host + '/application/store', icon: 'demo/icons/store.png' }),
	toaster: new $fgta5.ModuleData({ name: 'toaster', title: 'Toaster', url: host + '/application/toaster', icon: 'demo/icons/toaster.png' }),

}


const ProfileModule = new $fgta5.ModuleData({ name: 'profile', title: 'My Profile', url: host + '/application/profile' })
const PreferenceModule = new $fgta5.ModuleData({ name: 'preference', title: 'Preference', url: host + '/application/preference' })

async function main(self, args) {

	const appmain = document.getElementById('appmain')
	appmain.classList.add('hidden')

	appmgr.setTitle('Fgta5 Application Manager')
	appmgr.setMenu([
		programs.train,

		{
			title: 'Group A',
			border: false,
			items: [
				{
					title: 'Group A1',
					items: [
						programs.map,
						programs.medicine,
						programs.mountain,
						programs.packman
					]
				},
				{
					title: 'Group A2',
					border: false,
					items: [
						programs.photo,
						programs.pin,
						programs.pizza
					]
				}
			]
		},
		{
			title: 'Group B',
			border: false,
			items: [
				programs.speakers,
				programs.store,
			]
		},

		programs.toaster,

	])



	// set program favourite	
	appmgr.setFavourite(['map', 'photo', 'speakers', 'toaster'])

	appmgr.setUser({ userid: '1234', displayname: 'Ferrine', profilepic: '' })


	// await appmgr.openModule(programs.generator)
	setTimeout(() => {
		appmain.classList.remove('hidden')
	}, 1000)


	appmgr.addEventListener('logout', (evt) => {
		console.log('logout action')
	})

	appmgr.addEventListener('openprofile', (evt) => {
		console.log('openprofile')
		appmgr.openModule(ProfileModule)
	})

	appmgr.addEventListener('openpreference', (evt) => {
		console.log('openpreference')
		appmgr.openModule(PreferenceModule)
	})


	appmgr.addEventListener('action', (evt) => {
		console.log('action triggered')
	})


	appmgr.addEventListener('removefavourite', (evt) => {
		console.log('remove from favourite')
	})


	appmgr.addEventListener('addtofavourite', (evt) => {
		console.log('add to favourite')
	})
}
