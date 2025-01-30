const toggleSidebar = () => {
	const sidebar = document.querySelector(".sidebar__controls");
	const headerButton = document.querySelector(".sidebar__header-button");
	const searchFormButton = document.querySelector(".sidebar__controls-search");
	const buttons = document.querySelectorAll(".sidebar__toggle-button, .sidebar__header-button");

	let disableClose = true;

	const checkScreenSize = () => {
		if (window.innerWidth > 991) {
			sidebar.classList.remove("closed");
			headerButton.classList.add("open");
		} else {
			sidebar.classList.add("closed");
			headerButton.classList.remove("open");
		}
	};

	checkScreenSize();

	window.addEventListener("resize", checkScreenSize);

	buttons.forEach(button => {
		button.addEventListener("click", (event) => {
			event.stopPropagation();
			sidebar.classList.toggle("closed");
			button.classList.toggle("open");
		});
	});

	searchFormButton.addEventListener("click", (event) => {
		event.stopPropagation();
		disableClose = !disableClose;
		searchFormButton.classList.toggle("action");
	});

	document.addEventListener("click", (event) => {
		if (!sidebar.contains(event.target) && !headerButton.contains(event.target) && !searchFormButton.contains(event.target)) {
			if (!disableClose) {
				sidebar.classList.add("closed");
				headerButton.classList.remove("open");
			}
		}
	});
};

const menuSidebar = () => {
	const searchInput = document.querySelector('.sidebar__controls-search-input');
	const menuList = document.querySelector('.sidebar__menu');

	const menuItems = [
		{ text: 'Моя работа', link: '#' },
		{ text: 'Структура портала', link: '#' },
		{ text: 'Личное расписание', link: '#' },
		{ text: 'Отсутствие на рабочем месте', link: '#' },
		{ text: 'Портфель услуг', link: '#' },
		{ text: 'Дашборды', link: '#' },
		{ text: 'Доски задач', link: '#' },
		{ text: 'Обращения', link: '#' },
		{ text: 'События', link: '#' },
		{ text: 'Инциденты', link: '#' },
		{ text: 'Проблемы', link: '#' },
		{ text: 'Настройка каталогов', link: '#' },
		{ text: 'Запросы на обслуживание', link: '#' },
		{ text: 'Запросы на изменение', link: '#' },
		{ text: 'Управление конфигурациями', link: '#' },
		{ text: 'Управление уровнем услуг', link: '#' },
		{ text: 'Настройка соответствий', link: '#' },
	];

	function renderMenu(items, searchText = '') {
		menuList.innerHTML = '';
		items.forEach(item => {
			const li = document.createElement('li');
			li.className = 'menu-list__item';
			li.setAttribute('data-search', item.text.toLowerCase());

			const a = document.createElement('a');
			a.className = 'menu-list__toggle';
			a.href = item.link;

			if (searchText) {
				const regex = new RegExp(`(${searchText})`, 'gi');
				a.innerHTML = item.text.replace(regex, '<span class="highlight">$1</span>');
			} else {
				a.textContent = item.text;
			}

			li.appendChild(a);
			menuList.appendChild(li);
		});
		addArrows();
	}

	function addArrows() {
		document.querySelectorAll('.menu-list__item').forEach(item => {
			const svg = `
                <svg class="menu-list__arrow">
                    <use href="img/icons/icons.svg#arrow"></use>
                </svg>`;
			item.insertAdjacentHTML('afterbegin', svg);
		});
	}

	renderMenu(menuItems);

	searchInput.addEventListener('input', function (event) {
		const searchText = event.target.value.toLowerCase();

		const filteredItems = menuItems.filter(item =>
			item.text.toLowerCase().includes(searchText)
		);

		renderMenu(filteredItems, searchText);
	});
};

const controlsBody = () => {
	const controls = document.querySelector('.main__controls');
	const offset = controls.offsetTop;

	window.addEventListener('scroll', function () {
		if (window.scrollY > offset) {
			controls.classList.add('shadow');
		} else {
			controls.classList.remove('shadow');
		}
	});
}

const favoritesButton = () => {
	document.getElementById('addToFavorites').addEventListener('click', function() {
		if (window.sidebar && window.sidebar.addPanel) { // Для Firefox
			window.sidebar.addPanel(document.title, window.location.href, '');
		} else if (window.external && ('AddFavorite' in window.external)) { // Для IE
			window.external.AddFavorite(window.location.href, document.title);
		} else if (window.opera && window.print) { // Для Opera
			this.title = document.title;
			return true;
		} else {
			alert('Нажмите ' + (navigator.userAgent.toLowerCase().indexOf('mac') !== -1 ? 'Cmd' : 'Ctrl') + '+D, чтобы добавить страницу в избранное.');
		}
	});
}

const toggleModal = () => {
	const modal = document.getElementById('createModal');
	const modalBody = modal.querySelector('.modal__body');
	const createButton = document.querySelector('.main__controls__button--create');
	const closeButtons = document.querySelectorAll('.modal__controls__button--exit, .modal__controls__button--exit-svg');

	const openModal = () => {
		modalBody.innerHTML = '<h1>Новая запись</h1>' + document.getElementById('contentToCopy').innerHTML;

		modal.style.display = 'block';
		requestAnimationFrame(() => modal.classList.add('open'));

		document.body.classList.add('no-scroll');

		document.addEventListener('keydown', handleEscape);
	};

	const closeModal = () => {
		modal.classList.remove('open');
		modal.addEventListener('transitionend', () => {
			modal.style.display = 'none';

			document.body.classList.remove('no-scroll');
		}, { once: true });

		document.removeEventListener('keydown', handleEscape);
	};

	const handleEscape = (event) => {
		if (event.key === 'Escape') closeModal();
	};

	createButton.addEventListener('click', openModal);

	closeButtons.forEach(button => {
		button.addEventListener('click', closeModal);
	});

	window.addEventListener('click', (event) => {
		if (event.target === modal) closeModal();
	});
};

const multiInput = () => {
	function setupMultiInput(inputId, tagsContainerId, addButtonId) {
		const inputField = document.getElementById(inputId);
		const tagsContainer = document.getElementById(tagsContainerId);
		const addButton = document.getElementById(addButtonId);

		function addValue() {
			const value = inputField.value.trim();
			if (value === '') return;

			const isDuplicate = Array.from(tagsContainer.children).some(
				(tag) => tag.querySelector('span').textContent === value
			);

			if (isDuplicate) {
				alert('Такое значение уже добавлено!');
				return;
			}

			const tag = document.createElement('div');
			tag.className = 'tag';

			const tagText = document.createElement('span');
			tagText.textContent = value;
			tag.appendChild(tagText);

			const deleteButton = document.createElement('button');
			deleteButton.textContent = '×';
			deleteButton.addEventListener('click', () => {
				tag.remove();
			});
			tag.appendChild(deleteButton);

			tagsContainer.appendChild(tag);

			inputField.value = '';
		}

		addButton.addEventListener('click', addValue);

		inputField.addEventListener('keypress', (e) => {
			if (e.key === 'Enter') {
				addValue();
			}
		});
	}

	setupMultiInput('responsible', 'responsibleTags', 'addResponsibleButton');
	setupMultiInput('group', 'groupTags', 'addGroupButton');
}

toggleSidebar();
menuSidebar();
controlsBody();
favoritesButton();
toggleModal();
multiInput();