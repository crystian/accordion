export const accordionToggleErrorMessages = {
	invalidFixedTree: 'Invalid tree of elements, should be a pair of DT and DD',
	invalidTags: 'Invalid children tags, should be DT or DD',
	invalidPair: 'Invalid pair of tags, should be a DT and a DD',
	invalidIndexToRemove: 'Index invalid to remove',
	invalidIndexToRemoveGreater: 'Index greater than the length of elements'
};

export class AccordionToggle extends HTMLDListElement {
	constructor() {
		super();
		this.init();
	}

	init() {
		this._validateChildren();
		this._hideChildren();
		this._bindChildren();
	}

	addChild(data) {
		const dt = document.createElement('dt');
		const dd = document.createElement('dd');
		dt.innerHTML = data.title;
		dd.innerHTML = data.description;
		dd.style.display = 'none';
		this._bindChild(dt);
		this._bindChild(dd);
		this.appendChild(dt);
		this.appendChild(dd);
	}

	removeChildByIndex(index) {
		if (index === '') {
			throw Error(accordionToggleErrorMessages.invalidIndexToRemove);
		}

		index = +index;
		if (!Number.isInteger(index)) {
			throw Error(accordionToggleErrorMessages.invalidIndexToRemove);
		}

		const elements = this.getElementsByTagName('DT');
		if (index >= elements.length) {
			throw Error(accordionToggleErrorMessages.invalidIndexToRemoveGreater);
		}

		this._removeChild({target: elements[index]});
	}

	_removeChild($event) {
		$event.target.nextElementSibling.remove();
		$event.target.remove();
	}

	_validateChildren() {
		const children = this.children;
		let flagDTDD = true;

		if (children.length % 2) {
			throw Error(accordionToggleErrorMessages.invalidFixedTree);
		}

		Array.from(children)
		.forEach(item => {
			if (!['DT', 'DD'].includes(item.tagName)) {
				throw Error(accordionToggleErrorMessages.invalidTags);
			}

			let dtDetected = item.tagName.includes('DT') && flagDTDD;
			let ddDetected = item.tagName.includes('DD') && !flagDTDD;

			if (dtDetected === ddDetected) {
				throw Error(accordionToggleErrorMessages.invalidPair);
			}

			flagDTDD = !flagDTDD;
		});
	}

	_childrenSelected($event) {
		const stateprev = $event.target.nextElementSibling.style.display;
		this._hideChildren();
		$event.target.nextElementSibling.style.display = stateprev === 'block' ? 'none' : 'block';
	}

	_hideChildren() {
		this.querySelectorAll('dd')
		.forEach(item => {
			item.style.display = 'none';
		});
	}

	_bindChildren() {
		this.querySelectorAll('dt').forEach(item => {
			this._bindChild(item);
		});
	}

	_bindChild(item) {
		item.style.cursor = 'pointer';
		item.onclick = this._childrenSelected.bind(this);
	}
}

// registering the new component
customElements.define('accordion-toggle', AccordionToggle, {extends: 'dl'});
