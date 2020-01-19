import './accordion.scss';

export const accordionToggleErrorMessages = {
	invalidFixedTree: 'Invalid tree of elements, should be a pair of DT and DD',
	invalidTags: 'Invalid children tags, should be DT or DD',
	invalidPair: 'Invalid pair of tags, should be a DT and a DD',
	invalidIndexToRemove: 'Index invalid to remove',
	invalidIndexToRemoveGreater: 'Index greater than the length of elements',
	methodNotAllowed: 'Method not allowed',
	invalidAutoCollapseArgument: 'Invalid argument to auto-collapse'
};

export class AccordionToggle extends HTMLDListElement {
	_appendChild;
	_autoCollapse;

	// register the attributes to use on attributeChangedCallback
	static get observedAttributes() {
		return ['auto-collapse'];
	}

	constructor() {
		super();
		this.init();
	}

	init() {
		this._autoColapse = true;
		this._validateChildren();
		this._hideChildren();
		this._bindChildren();
		this._blockMethods();
	}

	addChild(data) {
		const dt = document.createElement('dt');
		const dd = document.createElement('dd');
		dt.innerHTML = data.title;
		dt.setAttribute('tabindex', '0');
		dt.setAttribute('data-message', data.title);
		dd.innerHTML = data.description;
		dd.classList.add('accordion-hidden');
		this._bindChild(dt);
		this._bindChild(dd);
		this._appendChild(dt);
		this._appendChild(dd);
	}

	removeChildByIndex(index) {
		if (index === '') {
			throw Error(accordionToggleErrorMessages.invalidIndexToRemove);
		}

		index = +index; // convert to number
		if (!Number.isInteger(index)) {
			throw Error(accordionToggleErrorMessages.invalidIndexToRemove);
		}

		const elements = this.getElementsByTagName('DT');
		if (index >= elements.length) {
			throw Error(accordionToggleErrorMessages.invalidIndexToRemoveGreater);
		}

		this._removeChild({target: elements[index]});
	}

	attributeChangedCallback(name /*, oldValue, newValue*/) {
		switch (name) {
			case 'auto-collapse':
				this._hideChildren();
				this._setAutoCollapse();
				break;
		}
	}

	_setAutoCollapse() {
		// default
		this._autoColapse = true;
		// TODO handle the potential error by parse
		this._autoColapse = Boolean(JSON.parse(this.getAttribute('auto-collapse')));
	}

	_blockMethods() {
		this._appendChild = this.appendChild;
		this.appendChild = this._methodNotAllowed;
		this.removeChild = this._methodNotAllowed;
		this.replaceChild = this._methodNotAllowed;
	}

	_methodNotAllowed() {
		throw Error(accordionToggleErrorMessages.methodNotAllowed);
	}

	_removeChild($event) {
		$event.target.nextElementSibling.remove();
		$event.target.remove();
	}

	_validateChildren() {
		const children = this.children;
		let flagFirstElementOfPair = true; // true if it is DT

		if (children.length % 2) {
			throw Error(accordionToggleErrorMessages.invalidFixedTree);
		}

		Array.from(children)
		.forEach(item => {
			if (!['DT', 'DD'].includes(item.tagName)) {
				throw Error(accordionToggleErrorMessages.invalidTags);
			}

			// detect a DT as first and DD as second
			let dtDetected = item.tagName.includes('DT') && flagFirstElementOfPair;
			let ddDetected = item.tagName.includes('DD') && !flagFirstElementOfPair;

			if (dtDetected === ddDetected) {
				throw Error(accordionToggleErrorMessages.invalidPair);
			}

			item.setAttribute('tabindex', '0');
			if(flagFirstElementOfPair){
				item.setAttribute('data-message', item.innerHTML);
			}

			flagFirstElementOfPair = !flagFirstElementOfPair;
		});
	}

	_childrenSelected($event) {
		const statePrev = $event.target.nextElementSibling.classList.contains('accordion-hidden');

		if (this._autoColapse) {
			this._hideChildren();
		}

		if (statePrev) {
			$event.target.nextElementSibling.classList.remove('accordion-hidden');
			$event.target.nextElementSibling.classList.add('accordion-show');
		} else {
			$event.target.nextElementSibling.classList.add('accordion-hidden');
			$event.target.nextElementSibling.classList.remove('accordion-show');
		}
	}

	_hideChildren() {
		this.querySelectorAll('dd')
		.forEach(item => {
			item.classList.add('accordion-hidden');
			item.classList.remove('accordion-show');
		});
	}

	_bindChildren() {
		this.querySelectorAll('dt').forEach(item => {
			this._bindChild(item);
		});
	}

	_bindChild(item) {
		item.onclick = this._childrenSelected.bind(this);
		item.onkeydown = ($event) => {
			if($event.keyCode === 13) { // The Enter/Return key
				this._childrenSelected($event);
			}
		};
	}
}

// registering the new component
customElements.define('accordion-toggle', AccordionToggle, {extends: 'dl'});
