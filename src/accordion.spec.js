import { Accordion } from './accordion';

const	virtualDom = window.document.createElement('div');
virtualDom.setAttribute('id', 'accordion-root');

describe('should create an accordion', () => {
	it('by constructor', () => {

		const component = new Accordion('accordion-root', virtualDom);

		expect(component).toBeDefined();
	});
});
