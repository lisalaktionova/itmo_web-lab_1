// DOM элементы
const orderModal = document.getElementById('order-modal');
const closeModal = document.getElementById('close-modal');
const orderForm = document.getElementById('order-form');
const notification = document.getElementById('notification');

// Настройка маски телефона
document.getElementById('phone').addEventListener('input', function(e) {
    let x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
    e.target.value = !x[2] ? x[1] : '+7 (' + x[2] + ') ' + x[3] + (x[4] ? '-' + x[4] : '') + (x[5] ? '-' + x[5] : '');
});

// Обработчики событий
closeModal.addEventListener('click', () => {
    orderModal.classList.remove('active');
    overlay.classList.remove('active');
});

overlay.addEventListener('click', () => {
    orderModal.classList.remove('active');
    overlay.classList.remove('active');
});

// Обработка формы заказа
orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Валидация формы
    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    
    if (!firstName || !lastName || !email || !phone || !address) {
        showError('Пожалуйста, заполните все обязательные поля!');
        return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError('Пожалуйста, введите корректный email адрес!');
        return;
    }
    
    if (!/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(phone)) {
        showError('Пожалуйста, введите корректный номер телефона!');
        return;
    }
    
    // Создание заказа
    createOrder({
        firstName,
        lastName,
        email,
        phone,
        address,
        favoriteMember: document.getElementById('member').value,
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        shipping: calculateShipping(),
        orderNumber: generateOrderNumber(),
        orderDate: new Date().toLocaleString('ru-RU')
    });
});

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        ${message}
    `;
    errorDiv.style.cssText = `
        background: #ffebee;
        color: #c62828;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        animation: fadeIn 0.3s ease;
    `;
    
    const form = document.getElementById('order-form');
    const firstChild = form.firstChild;
    form.insertBefore(errorDiv, firstChild);
    
    setTimeout(() => {
        errorDiv.style.opacity = '0';
        setTimeout(() => errorDiv.remove(), 300);
    }, 5000);
}

function calculateShipping() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return total >= 50000 ? 0 : 5000;
}

function generateOrderNumber() {
    return 'BTS-' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 1000);
}

// Создание заказа
function createOrder(orderData) {
    console.log('Заказ создан:', orderData);
    
    // Сохранение заказа в localStorage
    const orders = JSON.parse(localStorage.getItem('bts_orders')) || [];
    orders.push(orderData);
    localStorage.setItem('bts_orders', JSON.stringify(orders));
    
    // Очистка формы
    orderForm.reset();
    
    // Закрытие модального окна
    orderModal.classList.remove('active');
    overlay.classList.remove('active');
    
    // Показать уведомление
    showNotification(orderData.orderNumber);
    
    // Очистка корзины
    clearCart();
}

// Показать уведомление с номером заказа
function showNotification(orderNumber) {
    const notification = document.getElementById('notification');
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <div>
                <h3>Заказ создан!</h3>
                <p>Номер вашего заказа: <strong>${orderNumber}</strong></p>
                <p>Подтверждение отправлено на email.</p>
            </div>
        </div>
    `;
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}

// Очистка корзины
function clearCart() {
    cart = [];
    saveCart();
    renderProducts();
    renderCart();
    updateCartSummary();
}

// Для доступа из cart.js
function renderProducts(filter) {
    window.renderProducts(filter);
}

function renderCart() {
    window.renderCart();
}

function updateCartSummary() {
    window.updateCartSummary();
}

function saveCart() {
    window.saveCart();
}