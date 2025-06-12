let counter = 0;

export default class Component {
	Id;
	Element;


	constructor(id) {
		if (id!=undefined) {
			this.Id = id
			this.Element = document.getElementById(id)
		}
	}

	static GenerateId() {
		return `comp-${++counter}`;
	}
}

