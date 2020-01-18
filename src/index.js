import 'normalize.css';
import './index.scss';
import { ExpandingList } from './accordion';

// init
window.addEventListener('DOMContentLoaded', () => {
	document.getElementById('loadingSection')
	.classList
	.add('hidden');
	document.getElementById('mainSection')
	.classList
	.remove('hidden');


	let buttonAdd = document.getElementById('add');
	let buttonRemove = document.getElementById('remove');
	let textRemoveIndex = document.getElementById('removeIndex');

	let dl = document.getElementsByTagName('dl')[0];

	buttonAdd.onclick = () => {
		dl.agregar({a: 'section X', b: '<b>section x detail</b>'});
	};

	buttonRemove.onclick = () => {
		dl.removerIndex(textRemoveIndex.value);
		textRemoveIndex.value = '';
	};

	customElements.define('expanding-list', ExpandingList, {extends: 'dl'});

});


