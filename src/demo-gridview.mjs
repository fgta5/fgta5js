const tbl_data = new $fgta5.Gridview('tbl_data')
const btn_remove = new $fgta5.Button('btn_remove')
const btn_search = new  $fgta5.Button('btn_search')
const txt_search = new  $fgta5.Textbox('txt_search')


const ICON_PHONE = `<?xml version="1.0" encoding="UTF-8"?>
<svg version="1.1" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
<path d="M21.76 16.56H9.92L8.48 20H5.92L2 26.4h28L26.08 20h-2.56zm-5.04 2.64a5.12 3.328 0 0 1 5.12 3.328 5.12 3.328 0 0 1-5.12 3.328 5.12 3.328 0 0 1-5.14-3.328 5.12 3.328 0 0 1 5.14-3.328z" fill="currentColor"/>
<path d="M19.03 7.24c-3.38-.5-8.4-.41-10.07-.17-1.66.24-4.4 1.92-4.74 3.94-.41 2.44 1.46 4.73 4.18 5.12s5.29-1.26 5.7-3.69c.11-.66.06-1.34-.17-1.98 2.8-.16 5.86.37 9.22 1.76-.25.43-.42.9-.51 1.38-.41 2.44 1.46 4.73 4.18 5.12s5.29-1.26 5.7-3.69c.38-2.22-1.16-4.37-3.61-5.01-3.24-1.29-6.54-2.24-9.85-2.73z" fill="currentColor"/>
</svg>`


export default class Page {
	async main(args) {
		await main(this, args)
	}
}


async function main(self, args) {
	console.log('tbl_data')


	tbl_data.addEventListener('cellclick', evt=>{ tbl_data_cellclick(self, evt) })
	tbl_data.addEventListener('rowrender', evt=>{ tbl_data_rowrender(self, evt) })
	tbl_data.addEventListener('rowremoving', async evt=>{ await tbl_data_removing(self, evt) })
	tbl_data.addEventListener('nextdata', async evt=>{ tbl_data_nextdata(self, evt) })
	tbl_data.addEventListener('sorting', async evt=>{ tbl_data_sorting(self, evt) })


	txt_search.addEventListener('keydown', (evt)=>{
		if (evt.key == 'Enter') {
			var searchtext = txt_search.Value
			if (searchtext.trim()!='') {
				btn_search.click()
			}
		}
		
	})

	btn_search.addEventListener('click', (evt)=>{
		var searchtext = txt_search.Value
		// tbl_data.Clear()
		tbl_data.SetCriteria({
			searchtext: searchtext
		})		
		search(tbl_data.Criteria)
	})


	btn_remove.addEventListener('click', (evt)=>{
		var mask = $fgta5.Modal.Mask()
		tbl_data.RemoveSelected(()=>{
			mask.close();
		})
	})

	btn_search.click()
}


function tbl_data_cellclick(self, evt) {
	console.log(evt.detail.tr)
}

function tbl_data_rowrender(self, evt) {
	var tr = evt.detail.tr
	var tdphone = tr.querySelector('td[data-name="phone"]')
	var value = tdphone.getAttribute('data-value')
	
	var btn = document.createElement('button')
	btn.classList.add('phone_button')
	btn.innerHTML = ICON_PHONE
	btn.addEventListener('click', (evt)=>{
		console.log(value)
		evt.stopPropagation()
	
	})

	tdphone.innerHTML = ''
	tdphone.appendChild(btn)


	// cek disabled
	var disCol = tr.querySelector('td[data-name="disabled"]')
	var disVal = disCol.getAttribute('data-value')
	if (disVal==='1') {
		tr.setAttribute('data-disabled', '')
	}

	
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function tbl_data_removing(self, evt) {
	evt.handled = true
	var tr = evt.detail.tr
	var keyvalue = tr.getAttribute('keyvalue')
	

	console.log('removing dari database ...')
	tr.MarkProcessing()
	await sleep(1000)
	
	if (keyvalue!='dwi') {
		// console.log(tr)
		console.log('berhasil remove dari database')
		tr.remove()
	} else {
		console.log('tidak berhasil remove dari database')
		$fgta5.MessageBox.Error("simulasi ada baris yang tidak bisa dihapus")
	}
	tr.MarkProcessing(false)

	var pending = tbl_data.HasRowPendingProcess()
	console.log(pending)
	if (!pending) {
		var onFinished = evt.detail.onFinished
		if (typeof onFinished==='function') {
			onFinished()
		}
	}
	
}



async function search(criteria, limit, offset, sort) {
	var searchtext = criteria.searchtext

	// cek sorting
	if (sort===undefined) {
		sort = tbl_data.GetSort()
	}

	console.log(sort)
	var args = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			searchtext: searchtext,
			offset: offset,
			limit: limit,
			sort: sort
		})
	}

	



	var mask = $fgta5.Modal.Mask()
	const loader = new $fgta5.Dataloader() 
	loader.Load('/getdata-persons', args, (err, result)=>{
		if (offset===undefined) {
			tbl_data.Clear()
		}
		tbl_data.AddRows(result.data)
		tbl_data.SetNext(result.nextoffset, result.limit)
		mask.close();
	})
}

function tbl_data_nextdata(self, evt) {
	var criteria = evt.detail.criteria
	var limit = evt.detail.limit
	var nextoffset = evt.detail.nextoffset
	search(criteria, limit, nextoffset)

	// tbl_data.Scroll()
}

function tbl_data_sorting(self, evt) {
	var criteria = tbl_data.Criteria

	// tbl_data.Clear()
	search(criteria, undefined, undefined, evt.detail.sort)
	
}