const iconsCss = {
	'info': 'fgta5-icon-info',
	'warning': 'fgta5-icon-warning',
	'error': 'fgta5-icon-error',
	'question': 'fgta5-icon-question',
}


const ICON_ERROR = `<svg width="32" height="32" version="1.1" viewBox="0 0 8.4667 8.4667" xmlns="http://www.w3.org/2000/svg">
<path d="m2.6952 0.48756-2.2081 2.1923-0.010649 3.1118 2.193 2.208 3.112 0.010647 2.2075-2.1929 6.415e-4 -0.066396 0.010022-3.0448-2.1924-2.208z" color="#000000" fill="#f00" stroke-width=".32071" style="-inkscape-stroke:none"/>
<path transform="translate(5.0428e-6 -.019403)" d="m2.582 1.8223a0.33639 0.33639 0 0 0-0.23828 0.097656l-0.43164 0.43164a0.33639 0.33639 0 0 0 0 0.47656l1.4492 1.4492-1.4492 1.4473a0.33639 0.33639 0 0 0 0 0.47656l0.43164 0.43164a0.33639 0.33639 0 0 0 0.47656 0l1.4473-1.4492 1.4492 1.4492a0.33639 0.33639 0 0 0 0.47656 0l0.43164-0.43164a0.33639 0.33639 0 0 0 0-0.47656l-1.4492-1.4473 1.4492-1.4492a0.33639 0.33639 0 0 0 0-0.47656l-0.43164-0.43164a0.33639 0.33639 0 0 0-0.47656 0l-1.4492 1.4492-1.4473-1.4492a0.33639 0.33639 0 0 0-0.23828-0.097656z" fill="#fff" stroke-width=".52389"/>
</svg>`

const ICON_INFO = `<svg width="32" height="32" version="1.1" viewBox="0 0 8.4667 8.4667" xmlns="http://www.w3.org/2000/svg">
<path d="m1.6397 0.49839h5.2163c0.63356 0 1.1436 0.51005 1.1436 1.1436v3.83c0 0.63356-0.51005 1.1436-1.1436 1.1436l-2.0655 0.041342-1.8192 1.3427 0.54046-1.384h-1.872c-0.63356 0-1.1436-0.51005-1.1436-1.1436v-3.83c0-0.63356 0.51005-1.1436 1.1436-1.1436z" fill="#ececec" stroke-width=".29427"/>
<path d="m4.103 1.9561c-0.3426 0-0.62096 0.24685-0.62096 0.55066 0 0.30381 0.27836 0.55066 0.61025 0.55066 0.3533 0 0.63167-0.24685 0.63167-0.55066 0-0.30381-0.27836-0.55066-0.62096-0.55066z" fill="#000080" stroke-width=".25205"/>
<path d="m4.7552 3.6379-2.191 0.038907v0.15209h0.59436c0.44285 0.00353 0.50112 0.024758 0.50112 0.17685v1.0116c-0.01164 0.053055-0.02332 0.074277-0.06993 0.091962-0.08157 0.031833-0.303 0.045981-0.80413 0.049518h-0.08157v0.12733h3.0184v-0.12733h-0.08157c-0.78082-0.00707-0.88571-0.024759-0.88571-0.15209v-0.15563z" fill="#000080" stroke-width=".16051"/>
</svg>`

const ICON_QUESTION = `<svg width="32" height="32" version="1.1" viewBox="0 0 8.4667 8.4667" xmlns="http://www.w3.org/2000/svg">
<ellipse cx="4.2374" cy="4.2692" rx="3.6992" ry="3.7484" fill="#000080"/>
<path d="m4.8395 5.9237q0 0.23059-0.17562 0.3913-0.17562 0.16071-0.42928 0.16071-0.25757 0-0.43709-0.16071-0.17952-0.16071-0.17952-0.3913 0-0.22709 0.17952-0.38431 0.17952-0.15722 0.43709-0.15722 0.25367 0 0.42928 0.15722 0.17562 0.15722 0.17562 0.38431z" fill="#fff" stroke-width=".18906"/>
<path d="m5.5497 2.9486q0 0.20872-0.10927 0.379-0.10927 0.16753-0.27318 0.31308-0.16001 0.14556-0.32391 0.28013-0.16001 0.13457-0.26928 0.27463-0.10927 0.14006-0.10927 0.29935 0 0.030209 0.01561 0.085137 0.01561 0.054927 0.01561 0.054927l-0.48782-0.0054933q-0.070246-0.10161-0.11708-0.21147-0.042928-0.1126-0.042928-0.27738 0-0.16753 0.093662-0.32407 0.097564-0.15929 0.22245-0.30484 0.12488-0.14556 0.21854-0.26914 0.097564-0.12359 0.097564-0.21971 0-0.14556-0.13659-0.24168-0.13659-0.096122-0.38245-0.096122-0.23415 0-0.33952 0.074151-0.10537 0.074151-0.1483 0.15105h-0.28879q-0.085856-0.054926-0.14049-0.13732-0.050733-0.08239-0.050733-0.14556 0-0.10985 0.12098-0.23344 0.12488-0.12633 0.39416-0.21421 0.26928-0.090629 0.69856-0.090629 0.43319 0 0.73368 0.12633 0.3005 0.12359 0.4527 0.32132 0.1561 0.19499 0.1561 0.41195z" fill="#fff" stroke-width=".16762"/>
</svg>`

const ICON_WARNING = `<svg width="32" height="32" version="1.1" viewBox="0 0 8.4667 8.4667" xmlns="http://www.w3.org/2000/svg">
<path transform="matrix(.20595 0 0 .1924 3.8511 -.31824)" d="m1.875 9.1397 18.269 31.643-18.269-1e-6h-18.269l9.1345-15.821z" fill="#ff7f2a"/>
<path d="m4.751 6.4121q0 0.20413-0.14691 0.34641-0.14691 0.14227-0.35911 0.14227-0.21547 0-0.36564-0.14227-0.15017-0.14227-0.15017-0.34641 0-0.20104 0.15017-0.34022 0.15017-0.13918 0.36564-0.13918 0.2122 0 0.35911 0.13918 0.14691 0.13918 0.14691 0.34022z" fill="#fff" stroke-width=".16269"/>
<path d="m4.8197 3.7022q0 0.098082-0.022286 0.19403-0.022286 0.093818-0.057939 0.20683l-0.31198 1.0832h-0.43232l-0.2897-1q-0.040112-0.15139-0.075767-0.26013-0.035655-0.11088-0.035655-0.22815 0-0.25373 0.16045-0.37101 0.1649-0.11727 0.46351-0.11727 0.29415 0 0.44569 0.10661 0.15599 0.10661 0.15599 0.38593z" fill="#fff" stroke-width=".15783"/>
</svg>
`

export class MessageBoxButton {
	Text = 'button'
	
	constructor(text) {
		this.Text = text
	}

}

export class MessageBox {
	static ButtonOkCancel = Object.freeze({ok:new MessageBoxButton('Ok'), cancel:new MessageBoxButton('Cancel')})
	static ButtonYesNo = Object.freeze({yes:new MessageBoxButton('Yes'), no:new MessageBoxButton('No')})
	static ButtonYesNoCancel = Object.freeze({yes:new MessageBoxButton('Yes'), no:new MessageBoxButton('No'), cancel:new MessageBoxButton('Cancel')})

	static async show (message, config) { return await msgbox_show(message, config) }
	static async error(message) { return await msgbox_error(message) }
	static async info(message) { return await msgbox_info(message) }
	static async warning(message) { return await msgbox_warning(message) }
	static async confirm(message, buttons) { return await msgbox_confirm(message, buttons) }
}





function createMessageDialog(message, config) {
	const dialog = document.createElement('dialog')
    dialog.classList.add('fgta5-messagebox-dialog')

	dialog.addEventListener('close', (evt) => {
		dialog.parentNode.removeChild(dialog)
	});
	

    if (config.title) {
		dialog.divTitle = document.createElement('div')
		dialog.divTitle.classList.add('fgta5-messagebox-title')
		dialog.divTitle.innerHTML = config.title
		dialog.appendChild(dialog.divTitle)
    }

	 if (config.iconSvg!==undefined) {
		var iconcss = iconsCss[config.iconcss] ? iconsCss[config.iconcss] : config.iconcss
		dialog.divIcon = document.createElement('div')
		dialog.divIcon.classList.add('fgta5-messagebox-icon')
		// dialog.divIcon.style.backgroundImage = `url:("data:image/svg+xml,${encodeURIComponent(config.iconSvg)}")`
		dialog.divIcon.innerHTML = config.iconSvg
		dialog.appendChild(dialog.divIcon)
	} else if (config.iconcss!=undefined) {
		var iconcss = iconsCss[config.iconcss] ? iconsCss[config.iconcss] : config.iconcss
		dialog.divIcon = document.createElement('div')
		dialog.divIcon.classList.add('fgta5-messagebox-icon')
		dialog.divIcon.classList.add(iconcss)
		dialog.appendChild(dialog.divIcon)
	}

	dialog.divContent = document.createElement('div')
	dialog.divContent.classList.add('fgta5-messagebox-content')
	dialog.divContent.innerHTML = message
	dialog.appendChild(dialog.divContent)

	dialog.divButtons = document.createElement('div')
	dialog.divButtons.classList.add('fgta5-messagebox-buttonsbar')
	dialog.appendChild(dialog.divButtons)
	
	document.body.appendChild(dialog)
	return dialog
}


async function msgbox_show(message, config) {
	
	if (config === undefined) config = {}

	var dialog = createMessageDialog(message, config)
	return new Promise((resolve)=>{
		if (config.buttons) {
			for (const [key, btn] of Object.entries(config.buttons)) {
				const btnEl = document.createElement('button')
				btnEl.classList.add('fgta5-messagebox-button')
				btnEl.innerHTML = btn.Text
				btnEl.addEventListener('click', () => {
					dialog.close()
					resolve(key)
					
				})
				dialog.divButtons.appendChild(btnEl)
			}
		} else {
			const btnOk = document.createElement('button')
			btnOk.classList.add('fgta5-messagebox-button')
			btnOk.innerHTML = 'Ok'
			btnOk.addEventListener('click', () => {
				dialog.close()
				resolve('ok')
			})
			dialog.divButtons.appendChild(btnOk) 
		}
	
		dialog.showModal()
	});
}


async function msgbox_error(message) {
	const needAuthMessage = 'authentication is needed to access resource'
	await msgbox_show(message, {iconSvg: ICON_ERROR})

	if (message==needAuthMessage) {
		const currentUrl = window.location.href;
		location.href = `/login?nexturl=${currentUrl}`
	}
	return 'ok'
}

async function msgbox_info(message) {
	return await msgbox_show(message, {iconSvg: ICON_INFO})
}
async function msgbox_warning(message) {
	return await msgbox_show(message, {iconSvg: ICON_WARNING})
}
async function msgbox_confirm(message, buttons) {
	buttons = buttons===undefined ? MessageBox.ButtonOkCancel : buttons 

	return await msgbox_show(message, {
		iconSvg: ICON_QUESTION,
		buttons: buttons
	})
}