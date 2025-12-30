// Данные альбомов BTS с улучшенным дизайном
const products = [
    {
        id: 1,
        name: "Dynamite (Digital Single)",
        price: 21900,
        year: "2020",
        type: "single",
        category: "digital",
        image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop&crop=face",
        description: "Первый полностью английский сингл, достигший №1 в Billboard Hot 100"
    },
    {
        id: 2,
        name: "BE (Essential Edition)",
        price: 55900,
        year: "2020",
        type: "korean",
        category: "album",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        description: "Интимный альбом, созданный во время пандемии"
    },
    {
        id: 3,
        name: "Map of the Soul: 7",
        price: 64900,
        year: "2020",
        type: "korean",
        category: "album",
        image: "https://images.unsplash.com/photo-1519281682544-5f37c4b14c47?w=400&h=400&fit=crop",
        description: "Эпический альбом-путешествие по душе"
    },
    {
        id: 4,
        name: "Butter (Hotter Remix)",
        price: 23900,
        year: "2021",
        type: "single",
        category: "digital",
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop",
        description: "Летний хит, покоривший мировые чарты"
    },
    {
        id: 5,
        name: "Proof (Collector's Edition)",
        price: 99900,
        year: "2022",
        type: "korean",
        category: "anthology",
        image: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=400&h=400&fit=crop",
        description: "Антология из 3 CD с эксклюзивным контентом"
    },
    {
        id: 6,
        name: "FACE (Jimin Solo)",
        price: 45900,
        year: "2023",
        type: "solo",
        category: "album",
        image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&h=400&fit=crop",
        description: "Дебютный сольный альбом Jimin"
    },
    {
        id: 7,
        name: "D-DAY (SUGA as Agust D)",
        price: 48900,
        year: "2023",
        type: "solo",
        category: "album",
        image: "https://images.unsplash.com/photo-1571974599782-87624638275e?w=400&h=400&fit=crop",
        description: "Третий сольный альбом SUGA под псевдонимом Agust D"
    },
    {
        id: 8,
        name: "Layover (V Solo)",
        price: 52900,
        year: "2023",
        type: "solo",
        category: "album",
        image: "https://images.unsplash.com/photo-1517230878791-4d28214057c2?w=400&h=400&fit=crop",
        description: "Джазовый и R&B проект V"
    },
    {
        id: 9,
        name: "Golden (Jung Kook Solo)",
        price: 57900,
        year: "2023",
        type: "solo",
        category: "album",
        image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&h=400&fit=crop",
        description: "Сольный альбом Jung Kook с мировыми хитами"
    },
    {
        id: 10,
        name: "Face Yourself (JP Ver.)",
        price: 41900,
        year: "2018",
        type: "japanese",
        category: "album",
        image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=400&fit=crop",
        description: "Третий японский альбом, достигший №1 в Oricon"
    },
    {
        id: 11,
        name: "Wake Up (JP Limited)",
        price: 38900,
        year: "2014",
        type: "japanese",
        category: "album",
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop",
        description: "Первый японский студийный альбом BTS"
    },
    {
        id: 12,
        name: "Youth (JP Tour Edition)",
        price: 44900,
        year: "2016",
        type: "japanese",
        category: "album",
        image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop",
        description: "Специальное издание для японского тура"
    }
];

// Инициализация
let cart = JSON.parse(localStorage.getItem('bts_store_cart')) || [];
let currentFilter = 'all';

// Дополнительные функции для улучшенного дизайна
function getCategoryLabel(category) {
    const labels = {
        'album': 'Альбом',
        'digital': 'Цифровой',
        'anthology': 'Антология',
        'single': 'Сингл'
    };
    return labels[category] || 'Товар';
}

function getBadgeText(type) {
    const badges = {
        'korean': 'K-POP',
        'japanese': 'J-POP',
        'single': 'HIT',
        'solo': 'SOLO'
    };
    return badges[type] || 'NEW';
}

function getBadgeColor(type) {
    const colors = {
        'korean': 'linear-gradient(135deg, #FF416C, #FF4B2B)',
        'japanese': 'linear-gradient(135deg, #36D1DC, #5B86E5)',
        'single': 'linear-gradient(135deg, #FF9A9E, #FAD0C4)',
        'solo': 'linear-gradient(135deg, #A8FF78, #78FFD6)'
    };
    return colors[type] || 'var(--gradient-primary)';
}

// Остальной код остается аналогичным предыдущей версии, но с использованием новых функций
// Для экономии места не дублирую весь код, только ключевые изменения:

function renderProducts(filter = 'all') {
    // ... аналогично предыдущему коду, но с новыми классами
}

// В функции создания карточки продукта:
productCard.innerHTML = `
    <div class="product-badge" style="background: ${getBadgeColor(product.type)}">
        ${getBadgeText(product.type)}
    </div>
    <img src="${product.image}" alt="${product.name}" class="product-image">
    <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <div class="product-meta">
            <span class="product-year">${product.year}</span>
            <span class="product-category">${getCategoryLabel(product.category)}</span>
        </div>
        <p class="product-description">${product.description}</p>
        <div class="product-footer">
            <span class="product-price">${product.price.toLocaleString()} ₩</span>
            <button class="btn btn-add-to-cart" data-id="${product.id}">
                <i class="fas fa-cart-plus"></i> В корзину
            </button>
        </div>
    </div>
`;
