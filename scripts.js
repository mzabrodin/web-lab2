const form = document.getElementById('add-form');
const input = document.getElementById('add-input');
const productList = document.querySelector('.product-list');
const remainingSection = document.getElementById('remaining-section');
const boughtSection = document.getElementById('bought-section');

function renderStatistic() {
    remainingSection.innerHTML = '';
    boughtSection.innerHTML = '';
    let items = document.querySelectorAll('.item-section');

    items.forEach(item => {
        let name = item.dataset.item;
        let quantity = item.dataset.quantity;
        let status = item.dataset.status;
        let span = document.createElement('span');
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
    let name = input.value.trim();
    if (name && !isDuplicate(name)) {
        createItemElement(name);
        renderStatistic();
        input.value = '';
        input.focus();
    } else{
        input.value = '';
        input.focus();
    }
});

function isDuplicate(name, excludeItem = null) {
    let items = document.querySelectorAll('.item-section');
    for (let item of items) {
        if (item !== excludeItem && item.dataset.item.toLowerCase() === name.toLowerCase()) {
            return true;
        }
    }
    return false;
}

function createItemElement(name, quantity = 1, status = 'not-bought') {
    let section = document.createElement('section');
    section.className = 'item-section';
    section.dataset.item = name;
    section.dataset.quantity = quantity;
    section.dataset.status = status;

    let nameSpan = document.createElement('span');
    nameSpan.className = 'name';
    nameSpan.contentEditable = status === 'not-bought';
    nameSpan.textContent = name;
    nameSpan.style.textDecoration = status === 'bought' ? 'line-through' : 'none';
    section.appendChild(nameSpan);

    let quantitySection = document.createElement('section');
    quantitySection.className = 'quantity-section';

    let removeButton = document.createElement('button');
    removeButton.className = 'remove';
    removeButton.dataset.tooltip = 'Зменшити к-сть';
    removeButton.textContent = '-';
    removeButton.style.display = status === 'bought' ? 'none' : 'block';
    quantitySection.appendChild(removeButton);

    let quantityButton = document.createElement('button');
    quantityButton.className = 'quantity';
    quantityButton.textContent = quantity;
    quantitySection.appendChild(quantityButton);

    let addButton = document.createElement('button');
    addButton.className = 'add';
    addButton.dataset.tooltip = 'Збільшити к-сть';
    addButton.textContent = '+';
    addButton.style.display = status === 'bought' ? 'none' : 'block';
    quantitySection.appendChild(addButton);
    section.appendChild(quantitySection);

    let statusSection = document.createElement('section');
    statusSection.className = 'status-section';

    let statusButton = document.createElement('button');
    statusButton.className = 'status';
    statusButton.textContent = status === 'bought' ? 'Куплено' : 'Не куплено';
    statusButton.style.marginRight = status === 'bought' ? '5px' : '0';
    statusSection.appendChild(statusButton);

    let deleteButton = document.createElement('button');
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

function updateRemoveButtonStyle(quantity, removeButton) {
    if (quantity === 1) {
        removeButton.setAttribute('disabled', 'disabled');
        removeButton.dataset.tooltip = 'Не можна зменшити к-сть';
    } else {
        removeButton.removeAttribute('disabled');
        removeButton.dataset.tooltip = 'Зменшити к-сть';
    }
};

function updateItemListeners(item) {
    const quantityButton = item.querySelector('.quantity');

    const nameSpan = item.querySelector('.name');
    nameSpan.addEventListener('blur', () => {
        const newName = nameSpan.textContent.trim();
        if (newName && !isDuplicate(newName, item)) {
            item.dataset.item = newName;
        } else {
            nameSpan.textContent = item.dataset.item;
        }
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
            statusButton.style.marginRight = '5px';
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
