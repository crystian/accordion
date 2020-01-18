export class ExpandingList extends HTMLDListElement {
	rootDl;

	constructor() {
		super();

		this.rootDl = document.querySelector(':root dl');
		this.validateContent();
		this.hideDD();
		this.rootDl.querySelectorAll('dt')
		.forEach(item => {
			this.bindElement(item);
		});
	}

	removeItem($event) {
		$event.target.nextElementSibling.remove();
		$event.target.remove();
	}

	validateContent() {
		let flagDTDD = true;
		let children = this.rootDl.children;

		if (children.length % 2) {
			throw Error('invalid tree 1');
		}

		Array.from(children)
		.forEach(item => {
			if (!['DT', 'DD'].includes(item.tagName)) {
				throw Error('invalid tag name');
			}

			let dtDetected = item.tagName.includes('DT') && flagDTDD;
			let ddDetected = item.tagName.includes('DD') && !flagDTDD;

			if (dtDetected === ddDetected) {
				throw Error('invalid pair');
			}

			flagDTDD = !flagDTDD;
		});
	}

	updateSelected($event) {
		const stateprev = $event.target.nextElementSibling.style.display;
		this.hideDD();
		$event.target.nextElementSibling.style.display = stateprev === 'block' ? 'none' : 'block';
	}

	hideDD() {
		this.rootDl.querySelectorAll('dd')
		.forEach(item => {
			item.style.display = 'none';
		});
	}

	bindElement(item) {
		item.style.cursor = 'pointer';
		item.onclick = this.updateSelected.bind(this);

	}


	//   connectedCallback() {
	//     console.log('Custom square element added to page.');
	//     //updateStyle(this);
	//   }

	//   disconnectedCallback() {
	//     console.log('Custom square element removed from page.');
	//   }

	//   adoptedCallback() {
	//     console.log('Custom square element moved to new page.');
	//   }

	//   attributeChangedCallback(name, oldValue, newValue) {
	//     console.log('Custom square element attributes changed.');
	//     //updateStyle(this);

	//   }

	agregar(data) {
		const a = document.createElement('dt');
		a.innerHTML = data.a;
		const b = document.createElement('dd');
		b.innerHTML = data.b;
		b.style.display = 'none';
		this.bindElement(a);
		this.bindElement(b);
		this.appendChild(a);
		this.appendChild(b);
	}

	removerIndex(index) {
		if (!index) {
			throw Error('index invalid');
		}

		index = +index;
		if (!Number.isInteger(index)) {
			throw Error('index invalid');
		}

		const elements = this.rootDl.getElementsByTagName('DT');
		if (index >= elements.length) {
			throw Error('index grater than length');
		}

		this.removeItem({target: elements[index]});
	}
}
