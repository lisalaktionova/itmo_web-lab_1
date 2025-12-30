// Данные альбомов BTS
const products = [
    {
        id: 1,
        name: "Dynamite (Single)",
        price: 19900,
        year: "2020",
        type: "single",
        image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop"
    },
    {
        id: 2,
        name: "BE (Deluxe Edition)",
        price: 49900,
        year: "2020",
        type: "korean",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop"
    },
    {
        id: 3,
        name: "Map of the Soul: 7",
        price: 59900,
        year: "2020",
        type: "korean",
        image: "https://images.unsplash.com/photo-1519281682544-5f37c4b14c47?w=400&h=400&fit=crop"
    },
    {
        id: 4,
        name: "Butter (Single)",
        price: 21900,
        year: "2021",
        type: "single",
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop"
    },
    {
        id: 5,
        name: "Proof (Anthology)",
        price: 89900,
        year: "2022",
        type: "korean",
        image: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=400&h=400&fit=crop"
    },
    {
        id: 6,
        name: "FACE (Jimin)",
        price: 39900,
        year: "2023",
        type: "korean",
        image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&h=400&fit=crop"
    },
    {
        id: 7,
        name: "D-DAY (SUGA)",
        price: 42900,
        year: "2023",
        type: "korean",
        image: "https://images.unsplash.com/photo-1571974599782-87624638275e?w=400&h=400&fit=crop"
    },
    {
        id: 8,
        name: "Layover (V)",
        price: 45900,
        year: "2023",
        type: "korean",
        image: "https://images.unsplash.com/photo-1517230878791-4d28214057c2?w=400&h=400&fit=crop"
    },
    {
        id: 9,
        name: "Golden (Jung Kook)",
        price: 47900,
        year: "2023",
        type: "korean",
        image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&h=400&fit=crop"
    }
];

// Корзина
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM элементы
const productsContainer = document.getElementById('productsContainer');
const cartBtn = document.getElementById('cartBtn');
const cartCounter = document.getElementById('cartCounter');
const cartModal = document.getElementById('cartModal');
const orderModal = document.getElementById('orderModal');
const cartItems = document.getElementById('cartItems');
const checkoutBtn = document.getElementById('checkoutBtn');
const orderForm = document.getElementById('orderForm');
const notification = document.getElementById('notification');
const filters = document.querySelectorAll('.filter');

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCart();
    setupEventListeners();
});

// Рендеринг товаров
function renderProducts(filter = 'all') {
    productsContainer.innerHTML = '';
    
    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(p => p.type === filter);
    
    filteredProducts.forEach(product => {
        const isInCart = cart.some(item => item.id === product.id);
        
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-img">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-meta">${product.year} • ${getTypeName(product.type)}</p>
                <p class="product-price">${product.price.toLocaleString()} ₩</p>
                <button class="add-to-cart ${isInCart ? 'added' : ''}" 
                        data-id="${product.id}"
                        ${isInCart ? 'disabled' : ''}>
                    ${isInCart ? '✓ В корзине' : 'В корзину'}
                </button>
            </div>
        `;
        
        productsContainer.appendChild(productCard);
    });
    
    // Навешиваем обработчики
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            addToCart(productId);
        });
    });
}

function getTypeName(type) {
    const types = {
        'korean': 'Корейский альбом',
        'single': 'Сингл'
    };
    return types[type] || 'Альбом';
}

// Добавление в корзину
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCart();
    renderProducts();
    
    // Обновляем кнопку
    const button = document.querySelector(`.add-to-cart[data-id="${productId}"]`);
    if (button) {
        button.textContent = '✓ В корзине';
        button.classList.add('added');
        button.disabled = true;
    }
}

// Удаление из корзины
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCart();
    renderProducts();
}

// Изменение количества
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity < 1) {
        removeFromCart(productId);
    } else {
        saveCart();
        updateCart();
    }
}

// Обновление корзины
function updateCart() {
    // Обновляем счетчик
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCounter.textContent = totalItems;
    
    // Обновляем содержимое корзины
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Корзина пуста</p>';
    } else {
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${(item.price * item.quantity).toLocaleString()} ₩</div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" data-id="${item.id}" data-change="-1">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" data-id="${item.id}" data-change="1">+</button>
                        <button class="remove-btn" data-id="${item.id}">Удалить</button>
                    </div>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
    }
    
    // Обновляем итоговую сумму
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 50000 ? 0 : 5000;
    const total = subtotal + shipping;
    
    document.getElementById('subtotal').textContent = subtotal.toLocaleString() + ' ₩';
    document.getElementById('shipping').textContent = shipping === 0 ? 'Бесплатно' : '5,000 ₩';
    document.getElementById('total').textContent = total.toLocaleString() + ' ₩';
    
    // Обновляем информацию о доставке
    const shippingInfo = document.querySelector('.shipping-info');
    if (shippingInfo) {
        shippingInfo.textContent = subtotal >= 50000 
            ? 'Бесплатная доставка включена!' 
            : `Добавьте товаров на ${(50000 - subtotal).toLocaleString()} ₩ для бесплатной доставки`;
    }
}

// Сохранение в localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Кнопка корзины
    cartBtn.addEventListener('click', () => {
        cartModal.style.display = 'block';
        updateCart();
    });
    
    // Фильтры
    filters.forEach(filter => {
        filter.addEventListener('click', () => {
            filters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            renderProducts(filter.dataset.filter);
        });
    });
    
    // Закрытие модальных окон
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            cartModal.style.display = 'none';
            orderModal.style.display = 'none';
        });
    });
    
    // Клик вне модального окна
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
        if (e.target === orderModal) {
            orderModal.style.display = 'none';
        }
    });
    
    // Оформление заказа
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Корзина пуста! Добавьте товары в корзину.');
            return;
        }
        cartModal.style.display = 'none';
        orderModal.style.display = 'block';
    });
    
    // Обработка формы заказа
    if (orderForm) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Проверка заполнения полей
            const inputs = orderForm.querySelectorAll('input[required], textarea[required]');
            let valid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    input.style.borderColor = '#e74c3c';
                    valid = false;
                } else {
                    input.style.borderColor = '#ddd';
                }
            });
            
            if (!valid) {
                alert('Пожалуйста, заполните все обязательные поля!');
                return;
            }
            
            // Создание заказа
            const orderNumber = 'BT' + Date.now().toString().slice(-6);
            
            // Показываем уведомление
            document.getElementById('orderNumber').textContent = orderNumber;
            notification.style.display = 'block';
            
            // Скрываем уведомление через 5 секунд
            setTimeout(() => {
                notification.style.display = 'none';
            }, 5000);
            
            // Закрываем модальное окно
            orderModal.style.display = 'none';
            
            // Очищаем форму
            orderForm.reset();
            
            // Очищаем корзину
            cart = [];
            saveCart();
            updateCart();
            renderProducts();
            
            // Сбрасываем фильтры
            filters.forEach(f => f.classList.remove('active'));
            document.querySelector('.filter[data-filter="all"]').classList.add('active');
        });
    }
}

// Делегирование событий для динамических элементов
document.addEventListener('click', (e) => {
    // Обработка кнопок в корзине
    if (e.target.classList.contains('quantity-btn')) {
        const productId = parseInt(e.target.dataset.id);
        const change = parseInt(e.target.dataset.change);
        updateQuantity(productId, change);
    }
    
    if (e.target.classList.contains('remove-btn')) {
        const productId = parseInt(e.target.dataset.id);
        removeFromCart(productId);
    }
});
