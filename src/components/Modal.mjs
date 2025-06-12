export default class Modal  {
	static Show (content) { return Modal_Show(content) }
	static Mask (message) { return Modal_Mask(message) }
	static Progress (config) { return Modal_Progress(config) }
}


function CreateModal() {
	const modal = document.createElement('dialog')
	modal.classList.add('fgta5-modal-message')
	modal.addEventListener('close', (evt) => {
		modal.parentNode.removeChild(modal)
	});
	document.body.appendChild(modal)
	modal.showModal()
	return modal
}


function Modal_Show(content) {
	const modal = CreateModal()
	return modal
}

function Modal_Mask(message) {
	message =  message===undefined ? 'Please wait ...' : message
	
	const modal = CreateModal()

	var infoContainer = document.createElement('div')
	infoContainer.classList.add('fgta5-modal-loadermask-msg')
	modal.appendChild(infoContainer)

	var spinner = document.createElement('div')
	spinner.classList.add('fgta5-modal-loadermask-msg-icon')
	spinner.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><radialGradient id="a11" cx=".66" fx=".66" cy=".3125" fy=".3125" gradientTransform="scale(1.5)"><stop offset="0" stop-color="#575757"></stop><stop offset=".3" stop-color="#575757" stop-opacity=".9"></stop><stop offset=".6" stop-color="#575757" stop-opacity=".6"></stop><stop offset=".8" stop-color="#575757" stop-opacity=".3"></stop><stop offset="1" stop-color="#575757" stop-opacity="0"></stop></radialGradient><circle transform-origin="center" fill="none" stroke="url(#a11)" stroke-width="30" stroke-linecap="round" stroke-dasharray="200 1000" stroke-dashoffset="0" cx="100" cy="100" r="70"><animateTransform type="rotate" attributeName="transform" calcMode="spline" dur="1.8" values="360;0" keyTimes="0;1" keySplines="0 0 1 1" repeatCount="indefinite"></animateTransform></circle><circle transform-origin="center" fill="none" opacity=".2" stroke="#575757" stroke-width="30" stroke-linecap="round" cx="100" cy="100" r="70"></circle></svg>`
	infoContainer.appendChild(spinner)

	var infoText = document.createElement('div')
	infoText.classList.add('fgta5-modal-loadermask-msg-text')
	infoText.innerHTML = message
	infoContainer.appendChild(infoText)

	modal.setText = (message) => {
		infoText.innerHTML = message
	}

	return modal
}


function Modal_Progress(config) {
	if (config === undefined) config = {}
	

	const modal = CreateModal()

	modal.IsError = false
	

	var prgBarErrIcon = document.createElement('div')
	modal.appendChild(prgBarErrIcon)

	var prgBarContainer = document.createElement('div')
	prgBarContainer.classList.add('fgta5-modal-progressbar-container')
	modal.appendChild(prgBarContainer)

	var prgBar = document.createElement('label')
	prgBar.classList.add('fgta5-modal-progressbar')
	prgBarContainer.appendChild(prgBar)

	var prgMsg = document.createElement('div')
	prgMsg.classList.add('fgta5-modal-progressbar-text')
	modal.appendChild(prgMsg)

	modal.setProgress = function (progress, message) {
		if (progress > 100) progress = 100
		prgBar.innerHTML = `${progress}%`
		prgBar.style.width = `${progress}%`
		prgMsg.innerHTML = message
	}


	modal.setError = function (message) {
		modal.IsError = true

		prgBarErrIcon.classList.add('fgta5-icon-error')
		prgBarErrIcon.style.height = '32px'
		prgBarErrIcon.style.marginBottom = '10px'

		prgMsg.innerHTML = message
		prgMsg.setAttribute('error', 'true')
		prgBar.setAttribute('error', 'true')
	}

	modal.finish = function (text, completed) {
		if (text===undefined) text = 'Done'
		if (completed===undefined) completed = true

		if (config.buttonClose===true || modal.IsError) {
			if (completed) {
				prgMsg.style.display = 'none'
				prgBar.style.width = '100%'
				prgBar.innerHTML = '100%'
			}

			var div = document.createElement('div')
			div.style.textAlign = 'center'
			div.style.marginTop = '10px'
			div.style.marginBottom = '0'
			var btn = document.createElement('button')
			btn.classList.add('fgta5-modal-button')
			btn.innerHTML = text
			btn.addEventListener('click', () => {
				modal.close()
			})
			div.appendChild(btn)
			modal.appendChild(div)
		} else {
			modal.close()
		}
	}

	return modal
}

