import 'normalize.css';
import './index.scss';
import './accordion';

// init
window.addEventListener('DOMContentLoaded', () => {
	document.querySelector('#loadingSection').classList.add('hidden');
	document.querySelector('#mainSection').classList.remove('hidden');

	// client sample
	const accordionAdd = document.querySelector('#accordion-add');
	const accordionNewTitle = document.querySelector('#accordion-new-title');
	const accordionNewDescription = document.querySelector('#accordion-new-description');
	const accordionRemove = document.querySelector('#accordion-remove');
	const accordionRemoveIndex = document.querySelector('#accordion-remove-index');
	const accordionXhr = document.querySelector('#accordion-xhr');

	const dl = document.querySelector('dl');

	const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ' +
								'ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco ' +
								'laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in ' +
								'voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat ' +
								'non proident, sunt in culpa qui officia deserunt mollit anim id est laborum';

	const getLorem = limit => {
		const start = Math.floor(Math.random() * (lorem.length - limit)) + limit;
		const end = start + limit;
		return lorem.substring(start, end);
	};

	const fillNew = () => {
		accordionNewTitle.value = getLorem(10);
		accordionNewDescription.value = getLorem(40);
	};

	fillNew();

	accordionAdd.onclick = () => {
		dl.addChild({title: accordionNewTitle.value, description: `<i>${accordionNewDescription.value}</i>`});
		fillNew();
	};

	accordionRemove.onclick = () => {
		dl.removeChildByIndex(accordionRemoveIndex.value);
		accordionRemoveIndex.value = '';
	};

	accordionXhr.onclick = async () => {
		document.querySelector('#loadingSection').classList.add('hidden');

		const data = await fetch('./data.json');
		const json = await data.json();

		json.forEach(dl.addChild.bind(dl));
	};
});




