export default class Dialog extends EventTarget{
	
	#element
	constructor(id, args={}) {
		super()
		const el = document.getElementById(id)
		if (el==null) {
			console.error(`element dengan id: '$id' tidak ditemukan di halaman`)
		}

		this.#element = el
		dlg_constructor(this, args)

	}
	get element() { return this.#element }


	async dispatchCancelableEvent(event) {
		const listeners = this._getListeners(event.type);
		for (const listener of listeners) {
		await listener(event);
		if (event.defaultPrevented) break;
		}
		return event.defaultPrevented;
	}

	_getListeners(type) {
		// Hack: we need to track listeners manually
		return this._listeners?.[type] || [];
	}

	addAsyncEventListener(type, callback) {
		if (!this._listeners) this._listeners = {};
		if (!this._listeners[type]) this._listeners[type] = [];
		this._listeners[type].push(callback);
	}



	async show() {
		console.log('showing modal dialog')
		const self = this 
		const element = this.#element

		var showingEvent = new Event('showing', {});
		await self.dispatchCancelableEvent(showingEvent);

		element.showModal();
		element.setAttribute('showed', true)

		return new Promise((resolve)=>{
			self.btnOk.onclick = async (evt) => {
				console.log('btnOk click')

				var btnOkEvent = new Event('ok', { cancelable: true });
				btnOkEvent.result = {}
				var canceled = await self.dispatchCancelableEvent(btnOkEvent);
				if (canceled) {
					console.log('dialog invalid, and was canceled');
					return
				}
				self.close()
				resolve(btnOkEvent.result)
			}

			self.btnCancel.onclick = (evt) => {
				console.log('btnCancel click')
				self.close()
				resolve(null)
			}
		})
	}

	close() {
		const self = this 
		const element = this.#element
		element.close();

		// hapus semua listener button
		self.btnOk.onclick = null
		self.btnCancel.onclick = null
	}

}

function dlg_constructor(self, args) {
	const element = self.element
	
	// buat container untuk content dari dialog
	const container = document.createElement('div');
	container.classList.add('fgta5-dialogbox-container');

	// pindahkan semua element di dialog ke dalam container
	while (element.firstChild) {
		container.appendChild(element.firstChild);
	}
	element.appendChild(container);

	// tambahkan title apabila diperlukan
	if (args.title!=null) {
		const header = document.createElement('div')
		header.innerHTML = args.title
		element.prepend(header)
	}

	// tambahkan footer untuk tombol tutup dan cancel
	const footer = document.createElement('div')
	self.btnOk = document.createElement('button')
	self.btnCancel = document.createElement('button')

	self.btnOk.innerHTML = 'Ok'
	self.btnCancel.innerHTML = 'Cancel'

	footer.appendChild(self.btnOk)
	footer.appendChild(self.btnCancel)

	element.appendChild(footer)
	
}

