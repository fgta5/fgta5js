const app = new $fgta5.Application('main')
const Carousell = $fgta5.SectionCarousell
const carousellContainer = document.getElementById('main')
const Crsl = new Carousell(carousellContainer) 
const btn_openPage2 = document.getElementById('btn_openPage2')
const btn_openPage3 = document.getElementById('btn_openPage3')

export default class {
	async main(args) {
		await main(this)
	}
}


async function main(self) {
	btn_openPage2.addEventListener('click', (evt)=>{
		btn_openPage2_click(self, evt)
	})

	btn_openPage3.addEventListener('click', (evt)=>{
		btn_openPage3_click(self, evt)
	})

}

function btn_openPage2_click(self, evt) {
	const toshow = Crsl.Items['sec_page2']
	toshow.show()
}

function btn_openPage3_click(self, evt) {
	const toshow = Crsl.Items['sec_page3']
	toshow.show()
}