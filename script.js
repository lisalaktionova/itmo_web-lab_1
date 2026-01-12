const products = [
    {
        id: 1,
        title: "BE (Deluxe Edition)",
        price: 3499,
        description: "Альбом 2020 года, отражающий чувства BTS во время пандемии. Включает фотокарточки, постер и журнал.",
        image: "images/album-be.png"
    },
    {
        id: 2,
        title: "Map of the Soul: 7",
        price: 4299,
        description: "Четвертый студийный альбом BTS. Версия 4 включает 2 CD, фотокнигу, фотокарточки и дополнительные материалы.",
        image: "images/album-map-of-the-soul.png"
    },
    {
        id: 3,
        title: "Love Yourself 結 'Answer'",
        price: 3899,
        description: "Компиляционный альбом, завершающий серию Love Yourself. Содержит все синглы трилогии.",
        image: "images/album-love-yourself.png"
    },
    {
        id: 4,
        title: "Dynamite (Single)",
        price: 1999,
        description: "Первая полностью англоязычная песня BTS. Физический сингл включает фото-карточки и постер.",
        image: "images/album-dynamite.png"
    },
    {
        id: 5,
        title: "Proof (Anthology)",
        price: 5999,
        description: "Антология, охватывающая 9-летнюю карьеру группы. Коллекционное издание с 3 CD.",
        image: "images/album-proof.png"
    },
    {
        id: 6,
        title: "Butter (Single)",
        price: 2199,
        description: "Второй англоязычный сингл BTS. Лимитированное издание с эксклюзивным контентом.",
        image: "images/album-butter.png"
    },
    {
        id: 7,
        title: "Wings (You Never Walk Alone)",
        price: 3599,
        description: "Переиздание второго студийного альбома Wings. Включает три новые песни.",
        image: "images/album-wings.png"
    },
    {
        id: 8,
        title: "The Most Beautiful Moment in Life: Young Forever",
        price: 3199,
        description: "Компиляционный альбом серии The Most Beautiful Moment in Life. Специальное издание.",
        image: "images/album-young-forever.png"
    }
];

let cart = JSON.parse(localStorage.getItem('bts_cart')) || []; //корзина

document.addEventListener('DOMContentLoaded', function() { //инициализация при загрузке страницы
    console.log('BTS Album Store загружен!');
    updateCartUI(); //обновление интерфейса корзины
    document.getElementById('order-id').textContent = Math.floor(1000 + Math.random() * 9000); //генерация ID заказа
    
    const deliveryDate = new Date(); //установка даты доставки
    deliveryDate.setDate(deliveryDate.getDate() + 7);
    document.getElementById('delivery-date').textContent = deliveryDate.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long'
    });
    setupEventListeners(); //настройка обработчиков событий
});

function updateCartUI() { //обновление интерфейса корзины
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    document.getElementById('cart-count').textContent = totalCount; //обновление счетчиков
    document.getElementById('cart-total').textContent = totalPrice.toLocaleString('ru-RU') + ' ₽';
    document.getElementById('cart-summary-total').textContent = totalPrice.toLocaleString('ru-RU') + ' ₽';
    
    const checkoutBtn = document.getElementById('checkout-btn'); //обновление кнопки оформления
    checkoutBtn.disabled = totalCount === 0;
    
    const cartItemsContainer = document.getElementById('cart-items'); //обновление содержимого корзины
    const emptyCartMessage = document.getElementById('empty-cart-message');
    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
        cartItemsContainer.innerHTML = '';
        return;
    }
    emptyCartMessage.style.display = 'none';
    
    let cartHTML = ''; //создание HTML для товаров в корзине
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        const itemTotal = item.price * item.quantity;
        cartHTML += `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${product.image}" alt="${item.title}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💿</text></svg>'" />
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">${item.price.toLocaleString('ru-RU')} ₽</div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-control">
                        <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                        <button class="quantity-btn increase" data-id="${item.id}">+</button>
                    </div>
                    <button class="remove-item" data-id="${item.id}" title="Удалить">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="cart-item-total">${itemTotal.toLocaleString('ru-RU')} ₽</div>
            </div>
        `;
    });
    cartItemsContainer.innerHTML = cartHTML;
    document.querySelectorAll('.decrease').forEach(btn => { //добавление обработчиков для элементов корзины
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            updateCartItem(id, -1);
        });
    });
    
    document.querySelectorAll('.increase').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            updateCartItem(id, 1);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            removeFromCart(id);
        });
    });
    
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            const id = parseInt(this.dataset.id);
            const newQuantity = parseInt(this.value);
            if (newQuantity > 0) {
                setCartItemQuantity(id, newQuantity);
            }
        });
    });
}
function addToCart(productId) {
    const product = products.find(p => p.id === productId); //добавление товара в корзину
    if (!product) return;
    let cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            quantity: 1,
            image: product.image
        });
    }
    
    localStorage.setItem('bts_cart', JSON.stringify(cart));
    updateCartUI();
    const button = document.querySelector(`.add-to-cart[data-id="${productId}"]`); //анимация кнопки
    if (button) {
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Добавлено!';
        button.style.backgroundColor = '#38b000';
        button.disabled = true;
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.style.backgroundColor = '';
            button.disabled = false;
        }, 1500);
    }
}
function updateCartItem(productId, change) { //обновление количества товара
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity < 1) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('bts_cart', JSON.stringify(cart));
            updateCartUI();
        }
    }
}
function setCartItemQuantity(productId, quantity) { //установка точного количества
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = quantity;
        if (item.quantity < 1) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('bts_cart', JSON.stringify(cart));
            updateCartUI();
        }
    }
}
function removeFromCart(productId) { //удаление товара из корзины
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('bts_cart', JSON.stringify(cart));
    updateCartUI();
}
function setupEventListeners() { //настройка обработчиков событий
    document.querySelectorAll('.add-to-cart').forEach(button => { //кнопки "Добавить в корзину"
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            addToCart(productId);
        });
    });
    document.getElementById('clear-cart').addEventListener('click', function() { //очистка корзины
        if (cart.length === 0) {
            alert('Корзина уже пуста!');
            return;
        }
        if (confirm('Вы уверены, что хотите очистить корзину?')) {
            cart = [];
            localStorage.setItem('bts_cart', JSON.stringify(cart));
            updateCartUI();
            alert('Корзина очищена!');
        }
    });
    document.getElementById('checkout-btn').addEventListener('click', function() { //оформление заказа
        if (cart.length === 0) {
            alert('Добавьте товары в корзину перед оформлением заказа!');
            return;
        }
        document.getElementById('order-form-section').style.display = 'block';
        document.getElementById('order-form-section').scrollIntoView({ behavior: 'smooth' });
    });
    document.getElementById('cancel-order').addEventListener('click', function() { //отмена заказа
        document.getElementById('order-form-section').style.display = 'none';
    });
    document.getElementById('order-form').addEventListener('submit', function(e) { //отправка формы
        e.preventDefault();
        const firstName = document.getElementById('first-name').value.trim();
        const lastName = document.getElementById('last-name').value.trim();
        const address = document.getElementById('address').value.trim();
        const phone = document.getElementById('phone').value.trim();
        if (!firstName || !lastName || !address || !phone) {
            alert('Пожалуйста, заполните все обязательные поля (отмечены *)');
            return;
        }
        document.getElementById('order-success-modal').style.display = 'flex'; //показать модальное окно
        const orderDetails = { //очистить корзину
            orderId: 'BTS-' + document.getElementById('order-id').textContent,
            customer: firstName + ' ' + lastName,
            items: [...cart],
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        };
        console.log('Заказ оформлен:', orderDetails);
        cart = [];
        localStorage.setItem('bts_cart', JSON.stringify(cart));
        updateCartUI();
        document.getElementById('order-form-section').style.display = 'none'; //скрыть форму и сбросить
        this.reset();
    });
    document.getElementById('close-modal').addEventListener('click', function() { //закрытие модального окна
        document.getElementById('order-success-modal').style.display = 'none';
    });
    document.getElementById('continue-shopping').addEventListener('click', function() {
        document.getElementById('order-success-modal').style.display = 'none';
    });
    window.addEventListener('click', function(e) { //клик вне модального окна
        const modal = document.getElementById('order-success-modal');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}
