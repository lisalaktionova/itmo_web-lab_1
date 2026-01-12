// Данные товаров с PNG изображениями
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

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('BTS Album Store загружен!');
    console.log('Товаров в корзине:', cart.length);
    
    // Обновление интерфейса корзины
    updateCartUI();
    
    // Генерация ID заказа
    orderIdElement.textContent = Math.floor(1000 + Math.random() * 9000);
    
    // Установка даты доставки
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7);
    document.getElementById('delivery-date').textContent = deliveryDate.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long'
    });
    
    // Настройка обработчиков событий
    setupEventListeners();
});

// Обновление интерфейса корзины
function updateCartUI() {
    console.log('Обновление корзины, товаров:', cart.length);
    
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Обновление счетчиков
    document.getElementById('cart-count').textContent = totalCount;
    document.getElementById('cart-total').textContent = totalPrice.toLocaleString('ru-RU') + ' ₽';
    document.getElementById('cart-summary-total').textContent = totalPrice.toLocaleString('ru-RU') + ' ₽';
    
    // Обновление кнопки оформления
    const checkoutBtn = document.getElementById('checkout-btn');
    checkoutBtn.disabled = totalCount === 0;
    
    // Обновление содержимого корзины
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    
    if (cart.length === 0) {
        console.log('Корзина пуста, показываем сообщение');
        emptyCartMessage.style.display = 'block';
        cartItemsContainer.innerHTML = '';
        return;
    }
    
    console.log('Есть товары в корзине, скрываем сообщение');
    emptyCartMessage.style.display = 'none';
    
    // Создание HTML для товаров в корзине
    let cartHTML = '';
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return;
        
        const itemTotal = item.price * item.quantity;
        
        cartHTML += `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${product.image}" alt="${item.title}" 
                         onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💿</text></svg>'">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">${item.price.toLocaleString('ru-RU')} ₽ × <span class="cart-item-quantity">${item.quantity}</span></div>
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
                <div class="cart-item-total" id="item-total-${item.id}">${itemTotal.toLocaleString('ru-RU')} ₽</div>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = cartHTML;
    
    // Добавление обработчиков для элементов корзины
    setupCartItemEventListeners();
}

// Обновление количества товара
function updateCartItem(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity < 1) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('bts_cart', JSON.stringify(cart));
            updateCartUI();
            // Обновляем только конкретный элемент вместо полного обновления UI
            updateCartItemDisplay(productId);
        }
    }
}

// Обновление отображения одного товара в корзине
function updateCartItemDisplay(productId) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    const itemTotal = item.price * item.quantity;
    const quantityElement = document.querySelector(`.cart-item[data-id="${productId}"] .cart-item-quantity`);
    const totalElement = document.getElementById(`item-total-${productId}`);
    const quantityInput = document.querySelector(`.quantity-input[data-id="${productId}"]`);
    
    if (quantityElement) quantityElement.textContent = item.quantity;
    if (totalElement) totalElement.textContent = itemTotal.toLocaleString('ru-RU') + ' ₽';
    if (quantityInput) quantityInput.value = item.quantity;
    
    // Обновляем общую сумму
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cart-count').textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-total').textContent = totalPrice.toLocaleString('ru-RU') + ' ₽';
    document.getElementById('cart-summary-total').textContent = totalPrice.toLocaleString('ru-RU') + ' ₽';
}

// Установка точного количества
function setCartItemQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = quantity;
        if (item.quantity < 1) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('bts_cart', JSON.stringify(cart));
            updateCartItemDisplay(productId);
        }
    }
}

// Обновленная функция setupCartItemEventListeners
function setupCartItemEventListeners() {
    // Уменьшение количества
    document.querySelectorAll('.decrease').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            updateCartItem(id, -1);
        });
    });
    
    // Увеличение количества
    document.querySelectorAll('.increase').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            updateCartItem(id, 1);
        });
    });
    
    // Удаление товара
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            removeFromCart(id);
        });
    });
    
    // Изменение количества через input
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            const id = parseInt(this.dataset.id);
            const newQuantity = parseInt(this.value);
            if (!isNaN(newQuantity) && newQuantity > 0) {
                setCartItemQuantity(id, newQuantity);
            } else {
                // Если введено невалидное значение
                const item = cart.find(item => item.id === id);
                if (item) this.value = item.quantity;
            }
        });
    });
}



// Добавление товара в корзину
function addToCart(productId) {
    console.log('Добавление товара ID:', productId);
    
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error('Товар не найден:', productId);
        return;
    }
    
    let cartItem = cart.find(item => item.id === productId);
    
    if (cartItem) {
        cartItem.quantity += 1;
        console.log('Увеличено количество товара:', cartItem.title, 'количество:', cartItem.quantity);
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            quantity: 1,
            image: product.image
        });
        console.log('Добавлен новый товар:', product.title);
    }
    
    localStorage.setItem('bts_cart', JSON.stringify(cart));
    console.log('Корзина сохранена в localStorage');
    
    updateCartUI();
    
    // Анимация кнопки
    const button = document.querySelector(`.add-to-cart[data-id="${productId}"]`);
    if (button) {
        const originalHTML = button.innerHTML;
        const originalText = button.textContent;
        
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

// Обновление количества товара
function updateCartItem(productId, change) {
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

// Установка точного количества
function setCartItemQuantity(productId, quantity) {
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

// Удаление товара из корзины
function removeFromCart(productId) {
    const initialLength = cart.length;
    cart = cart.filter(item => item.id !== productId);
    
    if (cart.length < initialLength) {
        console.log('Товар удален из корзины:', productId);
        localStorage.setItem('bts_cart', JSON.stringify(cart));
        updateCartUI();
    }
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Кнопки "Добавить в корзину"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = parseInt(this.getAttribute('data-id'));
            console.log('Клик по кнопке добавления, ID:', productId);
            addToCart(productId);
        });
    });
    
    // Очистка корзины
    clearCartBtn.addEventListener('click', function(e) {
        e.preventDefault();
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
    
    // Оформление заказа
    checkoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (cart.length === 0) {
            alert('Добавьте товары в корзину перед оформлением заказа!');
            return;
        }
        
        orderFormSection.style.display = 'block';
        orderFormSection.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Отмена заказа
    cancelOrderBtn.addEventListener('click', function(e) {
        e.preventDefault();
        orderFormSection.style.display = 'none';
    });
    
    // Отправка формы
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const firstName = document.getElementById('first-name').value.trim();
        const lastName = document.getElementById('last-name').value.trim();
        const address = document.getElementById('address').value.trim();
        const phone = document.getElementById('phone').value.trim();
        
        if (!firstName || !lastName || !address || !phone) {
            alert('Пожалуйста, заполните все обязательные поля (отмечены *)');
            return;
        }
        
        // Показать модальное окно
        orderSuccessModal.style.display = 'flex';
        
        // Очистить корзину
        const orderDetails = {
            orderId: 'BTS-' + orderIdElement.textContent,
            customer: firstName + ' ' + lastName,
            items: [...cart],
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        };
        
        console.log('Заказ оформлен:', orderDetails);
        
        cart = [];
        localStorage.setItem('bts_cart', JSON.stringify(cart));
        updateCartUI();
        
        // Скрыть форму и сбросить
        orderFormSection.style.display = 'none';
        this.reset();
    });
    
    // Закрытие модального окна
    closeModalBtn.addEventListener('click', function() {
        orderSuccessModal.style.display = 'none';
    });
    
    continueShoppingBtn.addEventListener('click', function() {
        orderSuccessModal.style.display = 'none';
    });
    
    // Клик вне модального окна
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('order-success-modal');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}
