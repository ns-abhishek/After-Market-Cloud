/**
 * Digital Catalog
 * 
 * This file provides the functionality for the digital catalog page,
 * including product listing, filtering, searching, and detail view.
 */

// Global variables
let allProducts = [];
let filteredProducts = [];
let currentView = 'grid'; // 'grid' or 'list'
let currentCategory = '';
let currentManufacturer = '';
let currentPriceRange = '';
let currentSort = 'name';
let currentQuickFilter = 'all';

// DOM elements
let productGrid;
let catalogSearch;
let categoryFilter;
let manufacturerFilter;
let priceFilter;
let sortFilter;
let quickFilters;
let productDetailModal;
let productDetailContent;

// Initialize the catalog
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Digital Catalog...');
    
    // Get DOM elements
    productGrid = document.getElementById('productGrid');
    catalogSearch = document.getElementById('catalogSearch');
    categoryFilter = document.getElementById('categoryFilter');
    manufacturerFilter = document.getElementById('manufacturerFilter');
    priceFilter = document.getElementById('priceFilter');
    sortFilter = document.getElementById('sortFilter');
    quickFilters = document.querySelectorAll('.quick-filter');
    productDetailModal = document.getElementById('productDetailModal');
    productDetailContent = document.getElementById('productDetailContent');
    
    // Set up event listeners
    setupEventListeners();
    
    // Load products
    loadProducts();
    
    // Initialize Material Design Lite components
    if (typeof componentHandler !== 'undefined') {
        componentHandler.upgradeAllRegistered();
    }
    
    // Initialize voice search
    initVoiceSearch();
});

// Set up event listeners
function setupEventListeners() {
    // Search input
    catalogSearch.addEventListener('input', function() {
        filterProducts();
    });
    
    // Search button
    document.getElementById('searchBtn').addEventListener('click', function() {
        filterProducts();
    });
    
    // Category filter
    categoryFilter.addEventListener('change', function() {
        currentCategory = this.value;
        filterProducts();
    });
    
    // Manufacturer filter
    manufacturerFilter.addEventListener('change', function() {
        currentManufacturer = this.value;
        filterProducts();
    });
    
    // Price filter
    priceFilter.addEventListener('change', function() {
        currentPriceRange = this.value;
        filterProducts();
    });
    
    // Sort filter
    sortFilter.addEventListener('change', function() {
        currentSort = this.value;
        filterProducts();
    });
    
    // Quick filters
    quickFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            // Remove active class from all filters
            quickFilters.forEach(f => f.classList.remove('active'));
            
            // Add active class to clicked filter
            this.classList.add('active');
            
            // Update current quick filter
            currentQuickFilter = this.dataset.filter;
            
            // Filter products
            filterProducts();
        });
    });
    
    // View toggle button
    document.getElementById('viewToggleBtn').addEventListener('click', function() {
        toggleView();
    });
    
    // Advanced search button
    document.getElementById('advancedSearchBtn').addEventListener('click', function() {
        showAdvancedSearch();
    });
    
    // Close detail modal button
    document.getElementById('closeDetailModal').addEventListener('click', function() {
        closeProductDetail();
    });
}

// Load products from data source
function loadProducts() {
    // Check if CatalogData is available
    if (typeof CatalogData !== 'undefined' && CatalogData.getProducts) {
        allProducts = CatalogData.getProducts();
    } else {
        // Fallback to sample data
        allProducts = getSampleProducts();
    }
    
    // Initialize filtered products with all products
    filteredProducts = [...allProducts];
    
    // Display products
    displayProducts();
}

// Filter products based on current filters
function filterProducts() {
    const searchTerm = catalogSearch.value.toLowerCase();
    
    // Start with all products
    filteredProducts = [...allProducts];
    
    // Apply search filter
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || 
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            product.manufacturer.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply category filter
    if (currentCategory) {
        filteredProducts = filteredProducts.filter(product => 
            product.category.toLowerCase() === currentCategory.toLowerCase()
        );
    }
    
    // Apply manufacturer filter
    if (currentManufacturer) {
        filteredProducts = filteredProducts.filter(product => 
            product.manufacturer.toLowerCase() === currentManufacturer.toLowerCase()
        );
    }
    
    // Apply price filter
    if (currentPriceRange) {
        filteredProducts = filteredProducts.filter(product => {
            const price = parseFloat(product.price.replace('$', ''));
            
            switch (currentPriceRange) {
                case '0-25':
                    return price >= 0 && price <= 25;
                case '25-50':
                    return price > 25 && price <= 50;
                case '50-100':
                    return price > 50 && price <= 100;
                case '100+':
                    return price > 100;
                default:
                    return true;
            }
        });
    }
    
    // Apply quick filter
    if (currentQuickFilter !== 'all') {
        filteredProducts = filteredProducts.filter(product => 
            product.tags && product.tags.includes(currentQuickFilter)
        );
    }
    
    // Apply sorting
    sortProducts();
    
    // Display filtered products
    displayProducts();
}

// Sort products based on current sort option
function sortProducts() {
    switch (currentSort) {
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'price-low':
            filteredProducts.sort((a, b) => 
                parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', ''))
            );
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => 
                parseFloat(b.price.replace('$', '')) - parseFloat(a.price.replace('$', ''))
            );
            break;
        case 'newest':
            filteredProducts.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
            break;
    }
}

// Display products in the grid
function displayProducts() {
    // Clear product grid
    productGrid.innerHTML = '';
    
    // Check if there are products to display
    if (filteredProducts.length === 0) {
        productGrid.innerHTML = '<div class="no-products">No products found matching your criteria.</div>';
        return;
    }
    
    // Create product cards
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
}

// Create a product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.productId = product.id;
    
    // Create card content
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <div class="product-category">${product.category}</div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-footer">
                <div class="product-price">${product.price}</div>
                <div class="product-actions">
                    <button class="product-action-btn view-details" title="View Details">
                        <i class="material-icons">visibility</i>
                    </button>
                    <button class="product-action-btn add-to-cart" title="Add to Cart">
                        <i class="material-icons">add_shopping_cart</i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners
    card.querySelector('.view-details').addEventListener('click', function(e) {
        e.stopPropagation();
        showProductDetail(product.id);
    });
    
    card.querySelector('.add-to-cart').addEventListener('click', function(e) {
        e.stopPropagation();
        addToCart(product.id);
    });
    
    // Add click event to the entire card
    card.addEventListener('click', function() {
        showProductDetail(product.id);
    });
    
    return card;
}

// Show product detail modal
function showProductDetail(productId) {
    // Find product by ID
    const product = allProducts.find(p => p.id === productId);
    
    if (!product) {
        console.error(`Product with ID ${productId} not found.`);
        return;
    }
    
    // Create product detail content
    productDetailContent.innerHTML = `
        <div class="product-detail">
            <div class="product-detail-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-detail-info">
                <h2 class="product-detail-name">${product.name}</h2>
                <div class="product-detail-category">${product.category} | ${product.manufacturer}</div>
                <div class="product-detail-price">${product.price}</div>
                <p class="product-detail-description">${product.description}</p>
                <div class="product-detail-stock">
                    <span class="stock-label">Availability:</span>
                    <span class="stock-value">${parseInt(product.stock) > 0 ? 'In Stock' : 'Out of Stock'}</span>
                </div>
                <div class="product-detail-actions">
                    <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored add-to-cart-btn">
                        <i class="material-icons">add_shopping_cart</i> Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Show modal
    if (!productDetailModal.showModal) {
        dialogPolyfill.registerDialog(productDetailModal);
    }
    productDetailModal.showModal();
    
    // Upgrade any new MDL components
    if (typeof componentHandler !== 'undefined') {
        componentHandler.upgradeAllRegistered();
    }
    
    // Add event listener to add to cart button
    const addToCartBtn = productDetailContent.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            addToCart(productId);
        });
    }
}

// Close product detail modal
function closeProductDetail() {
    productDetailModal.close();
}

// Add product to cart
function addToCart(productId) {
    // Find product by ID
    const product = allProducts.find(p => p.id === productId);
    
    if (!product) {
        console.error(`Product with ID ${productId} not found.`);
        return;
    }
    
    console.log(`Added ${product.name} to cart.`);
    
    // Show notification
    showNotification(`${product.name} added to cart.`);
    
    // In a real application, this would add the product to the cart
    // For demo purposes, we'll just log a message
}

// Show notification
function showNotification(message) {
    // Check if notification container exists
    let notificationContainer = document.querySelector('.notification-container');
    
    if (!notificationContainer) {
        // Create notification container
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add notification to container
    notificationContainer.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Toggle view between grid and list
function toggleView() {
    currentView = currentView === 'grid' ? 'list' : 'grid';
    
    // Update view toggle button icon
    const viewToggleBtn = document.getElementById('viewToggleBtn');
    viewToggleBtn.innerHTML = currentView === 'grid' 
        ? '<i class="material-icons">view_list</i> View' 
        : '<i class="material-icons">view_module</i> View';
    
    // Update product grid class
    productGrid.className = currentView === 'grid' ? 'product-grid' : 'product-list';
    
    // Re-display products
    displayProducts();
}

// Show advanced search panel
function showAdvancedSearch() {
    console.log('Advanced search not implemented yet.');
    // In a real application, this would show an advanced search panel
}

// Initialize voice search
function initVoiceSearch() {
    const voiceSearchBtn = document.getElementById('voiceSearchBtn');
    
    // Check if SpeechRecognition is available
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.lang = 'en-US';
        
        voiceSearchBtn.addEventListener('click', function() {
            recognition.start();
            voiceSearchBtn.classList.add('listening');
        });
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            catalogSearch.value = transcript;
            filterProducts();
            voiceSearchBtn.classList.remove('listening');
        };
        
        recognition.onerror = function() {
            voiceSearchBtn.classList.remove('listening');
        };
        
        recognition.onend = function() {
            voiceSearchBtn.classList.remove('listening');
        };
    } else {
        voiceSearchBtn.style.display = 'none';
    }
}

// Get sample products (fallback if CatalogData is not available)
function getSampleProducts() {
    return [
        {
            id: 'P-10001',
            name: 'Air Filter',
            description: 'High-quality air filter for optimal engine performance and fuel efficiency.',
            category: 'Filters',
            manufacturer: 'FilterCorp',
            price: '$24.99',
            stock: '156',
            image: 'https://via.placeholder.com/300x200?text=Air+Filter',
            dateAdded: '2023-01-15',
            tags: ['bestseller', 'featured']
        },
        {
            id: 'P-10002',
            name: 'Brake Pad Set',
            description: 'Premium brake pads for reliable stopping power and reduced noise.',
            category: 'Brakes',
            manufacturer: 'BrakeMasters',
            price: '$89.95',
            stock: '78',
            image: 'https://via.placeholder.com/300x200?text=Brake+Pad+Set',
            dateAdded: '2023-02-20',
            tags: ['bestseller']
        },
        {
            id: 'P-10003',
            name: 'Oil Filter',
            description: 'Advanced oil filter that removes harmful contaminants for engine longevity.',
            category: 'Filters',
            manufacturer: 'FilterCorp',
            price: '$12.50',
            stock: '210',
            image: 'https://via.placeholder.com/300x200?text=Oil+Filter',
            dateAdded: '2023-03-10',
            tags: ['sale']
        },
        {
            id: 'P-10004',
            name: 'Spark Plug Set',
            description: 'High-performance spark plugs for improved ignition and fuel efficiency.',
            category: 'Ignition',
            manufacturer: 'SparkTech',
            price: '$45.75',
            stock: '92',
            image: 'https://via.placeholder.com/300x200?text=Spark+Plug+Set',
            dateAdded: '2023-04-05',
            tags: ['new', 'featured']
        },
        {
            id: 'P-10005',
            name: 'Alternator',
            description: 'Reliable alternator that ensures consistent electrical power for your vehicle.',
            category: 'Electrical',
            manufacturer: 'ElectroParts',
            price: '$175.00',
            stock: '25',
            image: 'https://via.placeholder.com/300x200?text=Alternator',
            dateAdded: '2023-05-12',
            tags: ['featured']
        }
    ];
}
