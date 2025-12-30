// Анимации для улучшенного UX
document.addEventListener('DOMContentLoaded', () => {
    // Анимация появления элементов
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.product-card, .member-card');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Изначальные стили для анимации
    document.querySelectorAll('.product-card, .member-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    // Запуск анимации при скролле
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Первоначальный запуск

    // Анимация добавления в корзину
    window.animateAddToCart = function(productId) {
        const button = document.querySelector(`[data-id="${productId}"]`);
        if (button) {
            button.innerHTML = '<i class="fas fa-check"></i> Добавлено';
            button.classList.add('btn-added');
            button.disabled = true;
            
            // Эффект пульсации на иконке корзины
            const cartCount = document.getElementById('cart-count');
            cartCount.style.transform = 'scale(1.3)';
            setTimeout(() => {
                cartCount.style.transform = 'scale(1)';
            }, 300);
        }
    };

    // Анимация для кнопки "Смотреть коллекцию"
    const exploreBtn = document.getElementById('explore-btn');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const productsSection = document.querySelector('.products-section');
            productsSection.scrollIntoView({ behavior: 'smooth' });
            
            // Эффект нажатия
            exploreBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                exploreBtn.style.transform = 'scale(1)';
            }, 200);
        });
    }

    // Анимация участников
    document.querySelectorAll('.member-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            const member = this.dataset.member;
            this.style.background = getMemberColor(member);
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.background = '';
        });
    });

    function getMemberColor(member) {
        const colors = {
            'rm': 'linear-gradient(135deg, #7027A0, #937DC2)',
            'jin': 'linear-gradient(135deg, #FF416C, #FF4B2B)',
            'suga': 'linear-gradient(135deg, #36D1DC, #5B86E5)',
            'jhope': 'linear-gradient(135deg, #A8FF78, #78FFD6)',
            'jimin': 'linear-gradient(135deg, #FF9A9E, #FAD0C4)',
            'v': 'linear-gradient(135deg, #FFD166, #EF476F)',
            'jungkook': 'linear-gradient(135deg, #118AB2, #06D6A0)'
        };
        return colors[member] || 'var(--gradient-primary)';
    }

    // Параллакс эффект для hero секции
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
});