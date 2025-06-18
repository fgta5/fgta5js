let counter = 0;



const ICON_MENU = `<svg version="1.1" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <g stroke-linecap="square">
	<rect x="19.5" y="19.5" width="12" height="12" fill="currentColor"/>
	<rect x="2" y="20" width="12" height="12" fill="currentColor"/>
	<rect x="20" y="2" width="12" height="12" fill="currentColor"/>
	<rect x="2" y="2" width="12" height="12" fill="currentColor"/>
  </g>
</svg>`

const ICON_CLOSE = `<svg version="1.1" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <g stroke="currentColor" stroke-linecap="round" stroke-width="5">
	<path d="M4 4 L28 28"/>
	<path d="M4 28 L28 4"/>
  </g>
</svg>`

const ICON_BACK = `<svg version="1.1" viewBox="0 0 8.4667 8.4667" xmlns="http://www.w3.org/2000/svg">
<path d="m5.5873 1.1684-2.515 3.0773 2.515 3.0773" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.3229"/>
</svg>`

const ICON_ACTION = `<svg version="1.1" viewBox="0 0 8.4667 8.4667" xmlns="http://www.w3.org/2000/svg">
<path d="m3.4777 0.49839-1.3861 4.1094h1.945l-1.2743 3.3919 3.7782-4.663h-1.9226l1.252-2.8383z"/>
</svg>`

const ICON_USER = `<svg version="1.1" viewBox="0 0 8.4667 8.4667" xmlns="http://www.w3.org/2000/svg">
<g stroke="#fff" fill="currentColor" stroke-linecap="round" stroke-width=".223">
<path d="m4.2633 4.9935c-0.85356-0.0027456-2.0017 0.17383-2.3611 0.28348-0.35939 0.10964-0.71426 0.67396-0.71727 0.93517 0.62166 0.68677 2.0469 1.1278 3.0784 1.3222 1.0315-0.19439 2.4572-0.6354 3.0789-1.3222-0.0030132-0.26121-0.35788-0.82553-0.71727-0.93517-0.35939-0.10964-1.5081-0.28622-2.3616-0.28348z"/>
<path d="m3.9018 5.7326-0.37517 1.8759 0.69032 0.57026 0.73534-0.55525-0.36016-1.8909z" stroke-linejoin="bevel"/>
<rect x="3.8568" y="4.9072" width=".76535" height=".76535" stroke-linejoin="bevel"/>
<circle cx="4.2238" cy="2.7633" r="2.0523"/>
</g>
</svg>`


const ICON_LOGOUT = `<svg version="1.1" viewBox="0 0 8.4667 8.4667" xmlns="http://www.w3.org/2000/svg">
<g stroke="currentColor" fill="currentColor" stroke-linecap="round" stroke-linejoin="bevel">
<path d="m5.0725 0.70989h-4.3649v7.0783h4.3649z" fill="none" stroke-width=".423"/>
<path d="m5.0725 0.70989-3.1237 2.5006 0.021392 4.5776h-1.2627l-2.6e-7 -7.0783z" stroke-width=".423"/>
<path d="m3.1515 5.0723h3.4527v1.3606l1.3955-1.9759-1.3955-1.9759v1.3606h-3.4527z" stroke-width=".423"/>
</g>
</svg>`

const ICON_SEARCH = `<svg version="1.1" viewBox="0 0 8.4667 8.4667" xmlns="http://www.w3.org/2000/svg">
<g fill="none" stroke="currentColor" stroke-linecap="square">
<circle cx="4.9312" cy="3.5669" r="2.7378" stroke-width=".66146"/>
<path d="m1.1989 7.1728 0.88885-0.80617" stroke-width="1.3229"/>
</g>
</svg>`

const ICON_SETTING = `<svg version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
<g transform="matrix(.82343 0 0 .82343 4.0086 7.2155)" fill="currentColor" stroke-width="1.2144">
<path d="m0 0h48v48h-48z" fill="none"/>
<path d="m38.86 25.95c0.08-0.64 0.14-1.29 0.14-1.95s-0.06-1.31-0.14-1.95l4.23-3.31c0.38-0.3 0.49-0.84 0.24-1.28l-4-6.93c-0.25-0.43-0.77-0.61-1.22-0.43l-4.98 2.01c-1.03-0.79-2.16-1.46-3.38-1.97l-0.75-5.3c-0.09-0.47-0.5-0.84-1-0.84h-8c-0.5 0-0.91 0.37-0.99 0.84l-0.75 5.3c-1.22 0.51-2.35 1.17-3.38 1.97l-4.98-2.01c-0.45-0.17-0.97 0-1.22 0.43l-4 6.93c-0.25 0.43-0.14 0.97 0.24 1.28l4.22 3.31c-0.08 0.64-0.14 1.29-0.14 1.95s0.06 1.31 0.14 1.95l-4.22 3.31c-0.38 0.3-0.49 0.84-0.24 1.28l4 6.93c0.25 0.43 0.77 0.61 1.22 0.43l4.98-2.01c1.03 0.79 2.16 1.46 3.38 1.97l0.75 5.3c0.08 0.47 0.49 0.84 0.99 0.84h8c0.5 0 0.91-0.37 0.99-0.84l0.75-5.3c1.22-0.51 2.35-1.17 3.38-1.97l4.98 2.01c0.45 0.17 0.97 0 1.22-0.43l4-6.93c0.25-0.43 0.14-0.97-0.24-1.28zm-14.86 5.05c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
</g>
</svg>`


const ICON_HOME = `<svg version="1.1" viewBox="0 0 8.4667 8.4667" xmlns="http://www.w3.org/2000/svg">
<g fill="currentColor">
<rect x="4.2337" y="3.9367" width="3.0541" height="4.063"/>
<rect x="1.2121" y="3.9367" width=".9332" height="4.0184"/>
<path d="m4.2479 1.0276 3.7518 3.4383-7.5035-1e-7z"/>
<rect x="1.6787" y="3.9367" width="3.2135" height="1.4646"/>
</g>
</svg>`


const ICON_TRASH = `<svg version="1.1" viewBox="0 0 8.4667 8.4667" xmlns="http://www.w3.org/2000/svg">
<g fill="currentColor">
<path d="m6.5113 2.4805h-4.775l0.85705 5.5191h3.0609z" stroke-linecap="square" stroke-width="1.3229"/>
<path d="m3.2115 0.40101v0.41341h-1.8266v0.86816h5.519v-0.86816h-1.8462v-0.41341z"/>
</g>
</svg>`

export default class Component {
	Id;
	Element;

	static get ICON_MENU() { return ICON_MENU }
	static get ICON_CLOSE() { return ICON_CLOSE }
	static get ICON_BACK() { return ICON_BACK }
	static get ICON_ACTION() { return ICON_ACTION }
	static get ICON_USER() { return ICON_USER }
	static get ICON_LOGOUT() { return ICON_LOGOUT }
	static get ICON_SEARCH() { return ICON_SEARCH }
	static get ICON_SETTING() { return ICON_SETTING }
	static get ICON_HOME() { return ICON_HOME }
	static get ICON_TRASH() { return ICON_TRASH }

	static get ACTION_SHOWMENU()  { return 'showmenu' }
	static get ACTION_SHOWHOME() { return 'showhome' }
	static get ACTION_APPLICATIONLOADED() { return 'applicationloaded' }

	constructor(id) {
		if (id!=undefined) {
			this.Id = id
			this.Element = document.getElementById(id)
		}
	}


	CreateSvgButton(svg, classname, fn_click) {
		return Component_CreateSvgButton(this, svg, classname, fn_click)
	}

	static GenerateId() {
		return `comp-${++counter}`;
	}

	static Sleep(ms) {
 		return new Promise(resolve => setTimeout(resolve, ms))
	}
}


function Component_CreateSvgButton(self, svg, classname, fn_click) {
	const btn = document.createElement('a')
	btn.innerHTML = svg
	btn.classList.add(classname)
	btn.setAttribute('href', 'javascript:void(0)')

	if (typeof fn_click === 'function') {
		btn.addEventListener('click', (evt)=>{
			fn_click(evt)
		})
	}
	

	return btn
}
