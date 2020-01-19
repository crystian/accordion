import { accordionToggleErrorMessages } from './accordion';

const createPair = (dlRoot) => {
	dlRoot.innerHTML += '<dt></dt><dd></dd>';
};


describe('should manipulate the dynamic html', () => {
	let dlRoot;

	beforeEach(() => {
		dlRoot = window.document.createElement('dl', {is: 'accordion-toggle'});
		dlRoot.addChild({
			title: 'title1',
			description: 'desc1'
		});
	});

	it('should be an empty array', function() {
		dlRoot = window.document.createElement('dl', {is: 'accordion-toggle'});
		
		expect(dlRoot.children.length).toBe(0);
	});

	it('should add a pair of elements', function() {
		expect(dlRoot.children.length).toBe(2);
	});

	it('should add two pairs of elements', function() {
		dlRoot.addChild({
			title: '',
			description: ''
		});

		expect(dlRoot.children.length).toBe(4);
	});

	it('should add a pair of elements with values', function() {
		expect(dlRoot.children[0].innerHTML).toContain('title1');
		expect(dlRoot.children[1].innerHTML).toContain('desc1');
	});

	it('should fail by using appendChild method', function() {
		expect(() => {
			dlRoot.appendChild(document.createElement('dt'));
		}).toThrowError(accordionToggleErrorMessages.methodNotAllowed);
	});

	it('should fail by remove a pair of elements without index', function() {
		expect(() => {
			dlRoot.removeChildByIndex();
		}).toThrowError(accordionToggleErrorMessages.invalidIndexToRemove);
	});

	it('should fail by remove a pair of elements without index 2', function() {
		expect(() => {
			dlRoot.removeChildByIndex('');
		}).toThrowError(accordionToggleErrorMessages.invalidIndexToRemove);
	});

	it('should fail by remove a pair of elements greater than the length', function() {
		expect(() => {
			dlRoot.removeChildByIndex(1);
		}).toThrowError(accordionToggleErrorMessages.invalidIndexToRemoveGreater);
	});

	it('should remove a first element', function() {
		dlRoot.addChild({
			title: 'title2',
			description: 'desc2'
		});

		expect(dlRoot.children.length).toBe(4);

		dlRoot.removeChildByIndex(0);

		expect(dlRoot.children.length).toBe(2);
		expect(dlRoot.children[0].innerHTML).toBe('title2');
		expect(dlRoot.children[1].innerHTML).toBe('desc2');
	});

	it('should fail by using removeChild method', function() {
		expect(() => {
			dlRoot.removeChild();
		}).toThrowError(accordionToggleErrorMessages.methodNotAllowed);
	});
});

describe('should manipulate the fixed html', () => {
	let dlRoot;

	beforeEach(() => {
		dlRoot = window.document.createElement('dl', {is: 'accordion-toggle'});
		createPair(dlRoot);
		createPair(dlRoot);
		dlRoot.init();
	});

	it('should hide children', function() {
		const displayNone = Array.from(dlRoot.querySelectorAll('dd')).every(el => el.style.display === 'none');

		expect(displayNone).toBeTrue();
	});

	it('should call a method', function() {
		spyOn(dlRoot, '_childrenSelected').and.callThrough();

		dlRoot.init();
		dlRoot.querySelector('dt').click();

		expect(dlRoot._childrenSelected).toHaveBeenCalled();
	});

	it('should show the first DD', function() {
		dlRoot.querySelector('dt').click();

		expect(dlRoot.querySelectorAll('dd')[0].style.display === 'block').toBeTrue();
		expect(dlRoot.querySelectorAll('dd')[1].style.display === 'none').toBeTrue();
	});

	it('should hide the first DD', function() {
		dlRoot.querySelector('dt').click();

		expect(dlRoot.querySelectorAll('dd')[0].style.display === 'block').toBeTrue();
		expect(dlRoot.querySelectorAll('dd')[1].style.display === 'none').toBeTrue();

		dlRoot.querySelector('dt').click();

		expect(dlRoot.querySelectorAll('dd')[0].style.display === 'none').toBeTrue();
		expect(dlRoot.querySelectorAll('dd')[1].style.display === 'none').toBeTrue();
	});

	it('should show the second DD', function() {
		dlRoot.querySelectorAll('dt')[1].click();

		expect(dlRoot.querySelectorAll('dd')[0].style.display === 'none').toBeTrue();
		expect(dlRoot.querySelectorAll('dd')[1].style.display === 'block').toBeTrue();
	});

	it('should hide the second DD', function() {
		dlRoot.querySelectorAll('dt')[1].click();

		expect(dlRoot.querySelectorAll('dd')[0].style.display === 'none').toBeTrue();
		expect(dlRoot.querySelectorAll('dd')[1].style.display === 'block').toBeTrue();

		dlRoot.querySelectorAll('dt')[1].click();

		expect(dlRoot.querySelectorAll('dd')[0].style.display === 'none').toBeTrue();
		expect(dlRoot.querySelectorAll('dd')[1].style.display === 'none').toBeTrue();
	});
});

describe('should validate the fixed html', () => {
	let dlRoot;

	beforeEach(() => {
		dlRoot = window.document.createElement('dl', {is: 'accordion-toggle'});
	});

	it('should not fail by empty elements', function() {
		expect(() => {
			dlRoot.init();
		}).not.toThrowError();
	});

	it('should fail by odd elements', function() {
		expect(() => {
			dlRoot.innerHTML = '<div></div>';

			dlRoot.init();

		}).toThrowError(accordionToggleErrorMessages.invalidFixedTree);
	});

	it('should fail by invalid tag elements', function() {
		expect(() => {
			dlRoot.innerHTML = '<div></div><div></div>';

			dlRoot.init();

		}).toThrowError(accordionToggleErrorMessages.invalidTags);
	});

	it('should fail by invalid tag elements 2', function() {
		expect(() => {
			dlRoot.innerHTML = '<dt></dt><div></div>';

			dlRoot.init();

		}).toThrowError(accordionToggleErrorMessages.invalidTags);
	});

	it('should fail by invalid tag elements 3', function() {
		expect(() => {
			dlRoot.innerHTML = '<div></div><dt></dt>';

			dlRoot.init();

		}).toThrowError(accordionToggleErrorMessages.invalidTags);
	});

	it('should fail by invalid pair of tags in order', function() {
		expect(() => {
			dlRoot.innerHTML = '<dd></dd><dt></dt>';
			dlRoot.init();

		}).toThrowError(accordionToggleErrorMessages.invalidPair);
	});

	it('should be valid by pair of tags in order', function() {
		expect(() => {
			createPair(dlRoot);

			dlRoot.init();

		}).not.toThrowError();
	});

});
