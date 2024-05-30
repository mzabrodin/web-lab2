document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-form');
    const input = document.getElementById('add-input');
    const productList = document.querySelector('.product-list');
    const remainingSection = document.getElementById('remaining-section');
    const boughtSection = document.getElementById('bought-section');

    const renderStatistic = () => {
        remainingSection.innerHTML = '';
        boughtSection.innerHTML = '';
        const items = document.querySelectorAll('.item-section');

        items.forEach(item => {
            const name = item.dataset.item;
            const quantity = item.dataset.quantity;
            const status = item.dataset.status;
            const span = document.createElement('span');
            span.className = 'statistic-item';
            span.innerHTML = `${name} <span class="amount">${quantity}</span>`;
            if (status === 'bought') {
                boughtSection.appendChild(span);
            } else {
                remainingSection.appendChild(span);
            }
        });
    };

    form.addEventListener('submit', event => {
        event.preventDefault();
        const name = input.value.trim();
        if (name) {
            createItemElement(name);
            renderStatistic();
            input.value = '';
            input.focus();
        }
    });

    const createItemElement = (name, quantity = 1, status = 'not-bought') => {
        const section = document.createElement('section');
        section.className = 'item-section';
        section.dataset.item = name;
        section.dataset.quantity = quantity;
        section.dataset.status = status;

        const nameSpan = document.createElement('span');
        nameSpan.className = 'name';
        nameSpan.contentEditable = status === 'not-bought';
        nameSpan.textContent = name;
        nameSpan.style.textDecoration = status === 'bought' ? 'line-through' : 'none';
        section.appendChild(nameSpan);

        const quantitySection = document.createElement('section');
        quantitySection.className = 'quantity-section';

        const removeButton = document.createElement('button');
        removeButton.className = 'remove';
        removeButton.dataset.tooltip = 'Зменшити к-сть';
        removeButton.textContent = '-';
        removeButton.style.display = status === 'bought' ? 'none' : 'block';
        quantitySection.appendChild(removeButton);

        const quantityButton = document.createElement('button');
        quantityButton.className = 'quantity';
        quantityButton.textContent = quantity;
        quantitySection.appendChild(quantityButton);

        const addButton = document.createElement('button');
        addButton.className = 'add';
        addButton.dataset.tooltip = 'Збільшити к-сть';
        addButton.textContent = '+';
        addButton.style.display = status === 'bought' ? 'none' : 'block';
        quantitySection.appendChild(addButton);
        section.appendChild(quantitySection);

        const statusSection = document.createElement('section');
        statusSection.className = 'status-section';

        const statusButton = document.createElement('button');
        statusButton.className = 'status';
        statusButton.textContent = status === 'bought' ? 'Куплено' : 'Не куплено';
        statusSection.appendChild(statusButton);

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete';
        deleteButton.dataset.tooltip = 'Видалити';
        deleteButton.textContent = 'x';
        if (status === 'bought') deleteButton.style.display = 'none';
        statusSection.appendChild(deleteButton);

        section.appendChild(statusSection);

        productList.appendChild(section);

        updateItemListeners(section);
        updateRemoveButtonStyle(quantity, removeButton);
        renderStatistic();

    }

    const updateRemoveButtonStyle = (quantity, removeButton) => {
        if (quantity === 1) {
            removeButton.disabled = true;
            removeButton.style.backgroundColor = '#8e8888';
            removeButton.style.borderBottom = '3px #8e8888 solid';
            removeButton.style.cursor = 'not-allowed';
            removeButton.dataset.tooltip = 'Неможливо зменшити';
        } else {
            removeButton.disabled = false;
            removeButton.style.backgroundColor = ''; // Remove custom styles
            removeButton.style.borderBottom = '';
            removeButton.style.cursor = '';
            removeButton.dataset.tooltip = 'Зменшити к-сть';
        }
    };

    const updateItemListeners = item => {
        const quantityButton = item.querySelector('.quantity');

        const nameSpan = item.querySelector('.name');
        nameSpan.addEventListener('input', () => {
            item.dataset.item = nameSpan.textContent;
            renderStatistic();
        });

        const removeButton = item.querySelector('.remove');
        removeButton.addEventListener('click', () => {
            let quantity = parseInt(item.dataset.quantity, 10);
            if (quantity > 1) {
                quantity--;
                item.dataset.quantity = quantity;
                quantityButton.textContent = quantity;
                renderStatistic();
            }
            updateRemoveButtonStyle(quantity, removeButton);
        });

        const addButton = item.querySelector('.add');
        addButton.addEventListener('click', () => {
            let quantity = parseInt(item.dataset.quantity, 10);
            quantity++;
            item.dataset.quantity = quantity;
            quantityButton.textContent = quantity;
            renderStatistic();
            updateRemoveButtonStyle(quantity, removeButton);
        });

        const statusButton = item.querySelector('.status');
        statusButton.addEventListener('click', () => {
            const status = item.dataset.status;
            if (status === 'not-bought') {
                item.dataset.status = 'bought';
                statusButton.textContent = 'Куплено';
                nameSpan.contentEditable = false;
                nameSpan.style.textDecoration = 'line-through';
                removeButton.style.display = 'none';
                addButton.style.display = 'none';
                deleteButton.style.display = 'none';
            }
            if (status === 'bought'){
                item.dataset.status = 'not-bought';
                statusButton.textContent = 'Не куплено';
                nameSpan.contentEditable = true;
                nameSpan.style.textDecoration = 'none';
                removeButton.style.display = 'block';
                addButton.style.display = 'block';
                deleteButton.style.display = 'block';
            }
            renderStatistic();
        });

        const deleteButton = item.querySelector('.delete');
        deleteButton.addEventListener('click', () => {
            item.remove();
            renderStatistic();
        });
    }

    createItemElement('Помідори', 2, 'bought');
    createItemElement('Печиво', 2, 'not-bought');
    createItemElement('Сир', 1, 'not-bought');
});