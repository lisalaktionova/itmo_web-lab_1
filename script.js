// Данные товаров (альбомы BTS)
const products = [
    {
        id: 1,
        title: "BE (Deluxe Edition)",
        price: 3499,
        description: "Альбом 2020 года, отражающий чувства BTS во время пандемии. Включает фотокарточки, постер и журнал.",
        icon: "🎵"
    },
    {
        id: 2,
        title: "Map of the Soul: 7",
        price: 4299,
        description: "Четвертый студийный альбом BTS. Версия 4 включает 2 CD, фотокнигу, фотокарточки и дополнительные материалы.",
        icon: "🧭"
    },
    {
        id: 3,
        title: "Love Yourself 結 'Answer'",
        price: 3899,
        description: "Компиляционный альбом, завершающий серию Love Yourself. Содержит все синглы трилогии.",
        icon: "💖"
    },
    {
        id: 4,
        title: "Dynamite (Single)",
        price: 1999,
        description: "Первая полностью англоязычная песня BTS. Физический сингл включает фото-карточки и постер.",
        icon: "💥"
    },
    {
        id: 5,
        title: "Proof (Anthology)",
        price: 5999,
        description: "Антология, охватывающая 9-летнюю карьеру группы. Коллекционное издание с 3 CD.",
        icon: "📀"
    },
    {
        id: 6,
        title: "Butter (Single)",
        price: 2199,
        description: "Второй англоязычный сингл BTS. Лимитированное издание с эксклюзивным контентом.",
        icon: "🧈"
    },
    {
        id: 7,
        title: "Wings (You Never Walk Alone)",
        price: 3599,
        description: "Переиздание второго студийного альбома Wings. Включает три новые песни.",
        icon: "🪽"
    },
    {
        id: 8,
        title: "The Most Beautiful Moment in Life: Young Forever",
        price: 3199,
        description: "Компиляционный альбом серии The Most Beautiful Moment in Life. Специальное издание.",
        icon: "🌅"
    }
];

// Корзина
let cart = JSON.parse(localStorage.getItem('bts_cart')) || [];

// DOM элементы
const productsGrid = document.getElementById('products-grid');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const cartSummaryTotal = document.getElementById('cart-summary-total');
const emptyCartMessage = document.getElementById('empty-cart-message');
const cartToggle = document.getElementById('cart-toggle');
const clearCartBtn = document.getElementById('clear-cart');
const checkoutBtn = document.getElementById('checkout-btn');
const orderFormSection = document.getElementById('order-form-section');
const orderForm = document.getElementById('order-form');
const cancelOrderBtn = document.getElementById('cancel-order');
const orderSuccessModal = document.getElementById('order-success-modal');
const closeModalBtn = document.getElementById('close-modal');
const continueShoppingBtn = document.getElementById('continue-shopping');
const orderIdElement = document.getElementById('order-id');

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    renderCart();
    updateCartSummary();
    
    // Генерация случайного ID заказа
    orderIdElement.textContent = Math.floor(1000 + Math.random() * 9000);
    
    // Установка даты доставки
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7);
    document.getElementById('delivery-date').textContent = deliveryDate.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long'
    });
    
    // Добавление обработчиков событий
    setupEventListeners();
});

// Рендеринг товаров
function renderProducts() {
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <div class="product-image">
                <span>${product.icon}</span>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${product.price.toLocaleString('ru-RU')} ₽</div>
                <button class="btn-primary add-to-cart" data-id="${product.id}">
                    <i class="fas fa-cart-plus"></i> Добавить в корзину
                </button>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
}

// Добавление товара в корзину
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            quantity: 1,
            icon: product.icon
        });
    }
    
    saveCart();
    renderCart();
    updateCartSummary();
    
    // Анимация добавления в корзину
    const button = document.querySelector(`.add-to-cart[data-id="${productId}"]`);
    const originalHTML = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i> Добавлено!';
    button.style.backgroundColor = 'var(--success-color)';
    button.disabled = true;
    
    setTimeout(() => {
        button.innerHTML = originalHTML;
        button.style.backgroundColor = '';
        button.disabled = false;
    }, 1500);
}

// Удаление товара из корзины
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
    updateCartSummary();
}

// Изменение количества товара
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        renderCart();
        updateCartSummary();
    }
}

// Сохранение корзины в localStorage
function saveCart() {
    localStorage.setItem('bts_cart', JSON.stringify(cart));
}

// Рендеринг корзины
function renderCart() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
        return;
    }
    
    emptyCartMessage.style.display = 'none';
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        const itemTotal = item.price * item.quantity;
        
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <span>${item.icon}</span>
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
        `;
        
        cartItems.appendChild(cartItem);
    });
}

// Обновление сводки корзины
function updateCartSummary() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartCount.textContent = totalCount;
    cartTotal.textContent = `${totalPrice.toLocaleString('ru-RU')} ₽`;
    cartSummaryTotal.textContent = `${totalPrice.toLocaleString('ru-RU')} ₽`;
    
    // Обновление состояния кнопки оформления заказа
    checkoutBtn.disabled = totalCount === 0;
    if (totalCount === 0) {
        checkoutBtn.style.opacity = '0.5';
        checkoutBtn.style.cursor = 'not-allowed';
    } else {
        checkoutBtn.style.opacity = '1';
        checkoutBtn.style.cursor = 'pointer';
    }
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Добавление в корзину
    productsGrid.addEventListener('click', (e) => {
        if (e.target.closest('.add-to-cart')) {
            const productId = parseInt(e.target.closest('.add-to-cart').dataset.id);
            addToCart(productId);
        }
    });
    
    // Управление элементами корзины
    cartItems.addEventListener('click', (e) => {
        // Уменьшение количества
        if (e.target.closest('.decrease')) {
            const productId = parseInt(e.target.closest('.decrease').dataset.id);
            const item = cart.find(item => item.id === productId);
            if (item) updateQuantity(productId, item.quantity - 1);
        }
        
        // Увеличение количества
        if (e.target.closest('.increase')) {
            const productId = parseInt(e.target.closest('.increase').dataset.id);
            const item = cart.find(item => item.id === productId);
            if (item) updateQuantity(productId, item.quantity + 1);
        }
        
        // Удаление товара
        if (e.target.closest('.remove-item')) {
            const productId = parseInt(e.target.closest('.remove-item').dataset.id);
            removeFromCart(productId);
        }
    });
    
    // Изменение количества через input
    cartItems.addEventListener('change', (e) => {
        if (e.target.classList.contains('quantity-input')) {
            const productId = parseInt(e.target.dataset.id);
            const newQuantity = parseInt(e.target.value);
            if (!isNaN(newQuantity) && newQuantity > 0) {
                updateQuantity(productId, newQuantity);
            } else {
                // Если введено невалидное значение, восстанавливаем предыдущее
                const item = cart.find(item => item.id === productId);
                if (item) e.target.value = item.quantity;
            }
        }
    });
    
    // Очистка корзины
    clearCartBtn.addEventListener('click', () => {
        if (cart.length === 0) return;
        
        if (confirm('Вы уверены, что хотите очистить корзину?')) {
            cart = [];
            saveCart();
            renderCart();
            updateCartSummary();
        }
    });
    
    // Открытие формы заказа
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) return;
        orderFormSection.style.display = 'block';
        orderFormSection.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Отмена заказа
    cancelOrderBtn.addEventListener('click', () => {
        orderFormSection.style.display = 'none';
    });
    
    // Отправка формы заказа
    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Проверка заполнения формы
        const firstName = document.getElementById('first-name').value.trim();
        const lastName = document.getElementById('last-name').value.trim();
        const address = document.getElementById('address').value.trim();
        const phone = document.getElementById('phone').value.trim();
        
        if (!firstName || !lastName || !address || !phone) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }
        
        // Показать модальное окно с подтверждением
        orderSuccessModal.style.display = 'flex';
        
        // Очистить корзину после оформления заказа
        cart = [];
        saveCart();
        renderCart();
        updateCartSummary();
        
        // Скрыть форму заказа
        orderFormSection.style.display = 'none';
        
        // Сброс формы
        orderForm.reset();
    });
    
    // Закрытие модального окна
    closeModalBtn.addEventListener('click', () => {
        orderSuccessModal.style.display = 'none';
    });
    
    continueShoppingBtn.addEventListener('click', () => {
        orderSuccessModal.style.display = 'none';
    });
    
    // Закрытие модального окна при клике вне его
    window.addEventListener('click', (e) => {
        if (e.target === orderSuccessModal) {
            orderSuccessModal.style.display = 'none';
        }
    });
    
    // Переключение видимости корзины (для мобильных устройств)
    cartToggle.addEventListener('click', () => {
        const cartSection = document.querySelector('.cart-section');
        if (window.innerWidth <= 768) {
            cartSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Инициализация корзины при загрузке страницы
function initializeCart() {
    if (cart.length > 0) {
        renderCart();
        updateCartSummary();
    }
}

// Вызов инициализации
initializeCart();
