// Данные альбомов BTS
const products = [
    {
        id: 1,
        name: "Dynamite (Single)",
        price: 19900,
        year: "2020",
        type: "single",
        image: "https://upload.wikimedia.org/wikipedia/en/1/11/BTS_-_Dynamite_%28official_cover%29.png",
        description: "Первый полностью английский сингл BTS, достигший №1 в Billboard Hot 100"
    },
    {
        id: 2,
        name: "BE (Deluxe Edition)",
        price: 49900,
        year: "2020",
        type: "korean",
        image: "https://upload.wikimedia.org/wikipedia/en/f/fc/BTS_-_Be.png",
        description: "Альбом, созданный во время пандемии, включая хит 'Life Goes On'"
    },
    {
        id: 3,
        name: "Map of the Soul: 7",
        price: 59900,
        year: "2020",
        type: "korean",
        image: "https://upload.wikimedia.org/wikipedia/en/3/3a/BTS_-_Map_of_the_Soul_7.png",
        description: "Седьмой корейский студийный альбом с синглами 'ON' и 'Black Swan'"
    },
    {
        id: 4,
        name: "Butter (Single)",
        price: 21900,
        year: "2021",
        type: "single",
        image: "https://upload.wikimedia.org/wikipedia/en/5/53/BTS_-_Butter.png",
        description: "Летний английский сингл, возглавлявший Billboard Hot 100 10 недель"
    },
    {
        id: 5,
        name: "Proof (Anthology)",
        price: 89900,
        year: "2022",
        type: "korean",
        image: "https://upload.wikimedia.org/wikipedia/en/2/29/BTS_-_Proof.png",
        description: "Антология, включающая хиты за 9 лет и 3 новые песни"
    },
    {
        id: 6,
        name: "FACE",
        price: 39900,
        year: "2023",
        type: "korean",
        image: "https://upload.wikimedia.org/wikipedia/en/3/35/Jimin_-_Face.png",
        description: "Сольный альбом Jimin с синглом 'Like Crazy'"
    },
    {
        id: 7,
        name: "D-DAY",
        price: 42900,
        year: "2023",
        type: "korean",
        image: "https://upload.wikimedia.org/wikipedia/en/8/8f/Agust_D_-_D-Day.png",
        description: "Третий сольный альбом SUGA под псевдонимом Agust D"
    },
    {
        id: 8,
        name: "Layover",
        price: 45900,
        year: "2023",
        type: "korean",
        image: "https://upload.wikimedia.org/wikipedia/en/7/78/V_-_Layover.png",
        description: "Сольный альбом V с джазовыми и R&B влияниями"
    },
    {
        id: 9,
        name: "Golden",
        price: 47900,
        year: "2023",
        type: "korean",
        image: "https://upload.wikimedia.org/wikipedia/en/5/5b/Jungkook_-_Golden.png",
        description: "Сольный альбом Jung Kook с хитом 'Seven' feat. Latto"
    },
    {
        id: 10,
        name: "Wake Up (Japanese)",
        price: 34900,
        year: "2014",
        type: "japanese",
        image: "https://upload.wikimedia.org/wikipedia/en/9/92/BTS_-_Wake_Up.png",
        description: "Первый японский студийный альбом BTS"
    },
    {
        id: 11,
        name: "Youth (Japanese)",
        price: 38900,
        year: "2016",
        type: "japanese",
        image: "https://upload.wikimedia.org/wikipedia/en/c/c4/BTS_-_Youth.png",
        description: "Второй японский альбом с новыми версиями корейских хитов"
    },
    {
        id: 12,
        name: "FACE YOURSELF (Japanese)",
        price: 44900,
        year: "2018",
        type: "japanese",
        image: "https://upload.wikimedia.org/wikipedia/en/7/74/BTS_-_Face_Yourself.png",
        description: "Третий японский альбом, достигший №1 в Oricon"
    }
];

// Корзина
let cart = JSON.parse(localStorage.getItem('bts_cart')) || [];

// DOM элементы
const productsGrid = document.getElementById('products-grid');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const totalPrice = document.getElementById('total-price');
const cartToggle = document.getElementById('cart-toggle');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCart = document.getElementById('close-cart');
const overlay = document.getElementById('overlay');
const checkoutBtn = document.getElementById('checkout-btn');
const filterButtons = document.querySelectorAll('.filter-btn');

// Инициализация страницы
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    renderCart();
    updateCartSummary();
    setupEventListeners();
    setupFilterButtons();
    
    // Загрузка корзины из localStorage
    const savedCart = localStorage.getItem('bts_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        renderCart();
        updateCartSummary();
    }
});

// Настройка кнопок фильтрации
function setupFilterButtons() {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Удаляем активный класс у всех кнопок
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
            button.classList.add('active');
            
            const filter = button.dataset.filter;
            renderProducts(filter);
        });
    });
}

// Рендеринг товаров с фильтрацией
function renderProducts(filter = 'all') {
    productsGrid.innerHTML = '';
    
    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(product => product.type === filter);
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        const isInCart = cart.some(item => item.id === product.id);
        
        let typeBadge = '';
        switch(product.type) {
            case 'korean':
                typeBadge = 'KOREAN VER.';
                break;
            case 'japanese':
                typeBadge = 'JAPANESE VER.';
                break;
            case 'single':
                typeBadge = 'SINGLE';
                break;
        }
        
        productCard.innerHTML = `
            ${typeBadge ? `<div class="product-badge">${typeBadge}</div>` : ''}
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-year">${product.year} • ${getTypeLabel(product.type)}</p>
                <p class="product-description">${product.description}</p>
                <p class="product-price">${product.price.toLocaleString()}</p>
                <button class="btn ${isInCart ? 'btn-added' : 'btn-add-to-cart'}" 
                        data-id="${product.id}"
                        ${isInCart ? 'disabled' : ''}>
                    <i class="fas ${isInCart ? 'fa-check' : 'fa-cart-plus'}"></i>
                    ${isInCart ? 'Добавлено' : 'В корзину'}
                </button>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
    
    // Добавление обработчиков для кнопок
    document.querySelectorAll('.btn-add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.closest('button').dataset.id);
            addToCart(productId);
        });
    });
}

function getTypeLabel(type) {
    switch(type) {
        case 'korean': return 'Корейский альбом';
        case 'japanese': return 'Японский альбом';
        case 'single': return 'Сингл';
        default: return 'Альбом';
    }
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
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    renderProducts();
    renderCart();
    updateCartSummary();
    showCart();
    
    // Анимация добавления
    animateAddToCart();
}

function animateAddToCart() {
    const cartBadge = document.querySelector('.cart-badge');
    cartBadge.style.transform = 'scale(1.3)';
    setTimeout(() => {
        cartBadge.style.transform = 'scale(1)';
    }, 300);
}

// Удаление товара из корзины
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderProducts();
    renderCart();
    updateCartSummary();
}

// Изменение количества товара
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity < 1) {
        removeFromCart(productId);
    } else {
        saveCart();
        renderCart();
        updateCartSummary();
    }
}

// Рендеринг корзины
function renderCart() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <p class="empty-cart">
                <i class="fas fa-shopping-bag"></i><br>
                Ваша корзина пуста
            </p>
        `;
        return;
    }
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <h4 class="cart-item-title">${item.name}</h4>
                <p class="cart-item-type">${getTypeLabel(item.type)}</p>
                <p class="cart-item-price">${(item.price * item.quantity).toLocaleString()} ₩</p>
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
    
    // Добавление обработчиков для кнопок в корзине
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            const change = parseInt(e.target.dataset.change);
            updateQuantity(productId, change);
        });
    });
    
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            removeFromCart(productId);
        });
    });
}

// Обновление итоговой суммы
function updateCartSummary() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    totalPrice.textContent = total.toLocaleString() + ' ₩';
    cartCount.textContent = count;
    
    // Обновление стоимости доставки
    const shippingPrice = document.getElementById('shipping-price');
    if (total >= 50000) {
        shippingPrice.textContent = 'Бесплатно';
        shippingPrice.style.color = '#4CAF50';
    } else {
        const shippingCost = 5000;
        shippingPrice.textContent = shippingCost.toLocaleString() + ' ₩';
        shippingPrice.style.color = '';
    }
}

// Сохранение корзины в localStorage
function saveCart() {
    localStorage.setItem('bts_cart', JSON.stringify(cart));
}

// Показать/скрыть корзину
function showCart() {
    cartSidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideCart() {
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Настройка обработчиков событий
function setupEventListeners() {
    cartToggle.addEventListener('click', showCart);
    closeCart.addEventListener('click', hideCart);
    overlay.addEventListener('click', hideCart);
    
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Корзина пуста! Добавьте альбомы BTS в корзину.');
            return;
        }
        hideCart();
        document.getElementById('order-modal').classList.add('active');
        overlay.classList.add('active');
    });
}