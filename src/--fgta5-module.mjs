const RESET_CONFIRM = 'Sudah ada perubahan data, apakah akan direset?'
const NEWDATA_CONFIRM  = 'Sudah ada perubahan data, apakah akan membuat baru?'
const BACK_CONFIRM = 'Sudah ada perubahan data, apakah akan kembali ke list?'
const DELETE_CONFIRM = 'Apakah akan hapus data '
const EDIT_WARNING = 'Silakan data di save atau di reset dahulu'

export default class Module {
	static get RESET_CONFIRM() { return RESET_CONFIRM }
	static get NEWDATA_CONFIRM() { return NEWDATA_CONFIRM }
	static get BACK_CONFIRM() { return BACK_CONFIRM }
	static get DELETE_CONFIRM() { return DELETE_CONFIRM }
	static get EDIT_WARNING() { return EDIT_WARNING }
	
	constructor() {
	}

	static isMobileDevice() {
		return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|Opera Mini|IEMobile/i.test(navigator.userAgent);
	}

	static async getContent(url) {
		try {
			const response = await fetch(url)
			if (!response.ok) {
				console.error(`HTTP Error: ${response.status}`)
				return `<div>${url}</div>`
			}
			const data = await response.text(); 
			return data
		} catch (err) {

		}
		
	}

	static renderFooterButtons(footerButtonsContainer) { 
		renderFooterButtons(this, footerButtonsContainer) 
	}


	async getFunction(functionname) { return null }


	async sleep(ms) {
		return new Promise(lanjut=>{
			setTimeout(()=>{
				lanjut()
			}, ms)
		})
	}

	isInFrame() {
		return window.self !== window.top;
	}

	async apiCall(url, args) {
		const api = new $fgta5.ApiEndpoint(url)
		try {
			const result = await api.execute(args)
			return result 
		} catch (err) {
			const currentUrl = window.location.href;
			if (err.code==401) {
				console.error(err)
				await $fgta5.MessageBox.error(err.message)
				if (this.isInFrame()) {
					window.parent.postMessage({
						action:'REDIRECT_TO_LOGIN',
						href: '/login',
						nexturl: currentUrl

					}, '*')
				} else {
					location.href = `/login?nexturl=${currentUrl}`
				}
				await this.sleep(10000)
				throw err				
			} else {
				throw err
			}
		}
	}
}


export async function loadTemplate(self, name) {
	const tpl = document.querySelector(`template[name="${name}"]`)
	if (tpl==null) {
		throw new Error(`template "${name}" is not found!`)
	}

	const clone = tpl.content.cloneNode(true); // salin isi template
	document.body.appendChild(clone);
}


function renderFooterButtons(self, footerButtonsContainer) {
	const footer = document.querySelector('footer.fgta5-app-footer')
	footer.innerHTML = ''

	// masukkan semua footerButtonsContainer ke footer
	for (var bc of Array.from(footerButtonsContainer)) {
		var section = bc.closest('section')
		bc.setAttribute('data-section', section.id)

		footer.appendChild(bc)
	}
}