const tbl_data = new $fgta5.Gridview('tbl_data')
const btn_remove = new $fgta5.Button('btn_remove')
const btn_search = new  $fgta5.Button('btn_search')
const txt_search = new  $fgta5.Textbox('txt_search')

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
	tbl_data.addEventListener('nextdata', async evt=>{ await tbl_data_nextdata(self, evt) })


	btn_search.addEventListener('click', (evt)=>{
		var searchtext = txt_search.Value

		tbl_data.Clear()		
		search(searchtext)
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
	btn.innerHTML = 'clk'
	btn.addEventListener('click', (evt)=>{
		console.log(value)
		evt.stopPropagation()
	
	})

	tdphone.innerHTML = ''
	tdphone.appendChild(btn)

	
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



async function search(searchtext, limit, offset) {
	var args = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			searchtext: searchtext,
			offset: offset,
			limit: limit,
		})
	}

	var mask = $fgta5.Modal.Mask()
	const loader = new $fgta5.Dataloader() 
	loader.Load('http://localhost:3000/getdata-persons', args, (err, result)=>{
		tbl_data.AddRows(result.data)
		tbl_data.SetNext(searchtext, result.nextoffset, result.limit)
		mask.close();
	})
}

function tbl_data_nextdata(self, evt) {
	var searchtext = evt.detail.searchtext
	var limit = evt.detail.limit
	var nextoffset = evt.detail.nextoffset
	// console.log(searchtext, limit, nextoffset)

	search(searchtext, limit, nextoffset)
}