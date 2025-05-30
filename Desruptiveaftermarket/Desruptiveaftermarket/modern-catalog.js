/**
 * Modern Digital Catalog
 *
 * This file provides the functionality for the modern digital catalog page,
 * including product listing, filtering, searching, and detail view with
 * disruptive features and modern UI.
 */

// Global variables
let allProducts = [];
let filteredProducts = [];
let currentView = 'grid'; // 'grid' or 'list'
let currentFilters = {
    category: '',
    manufacturer: '',
    priceRange: { min: 0, max: 1000 },
    sort: 'name',
    quickFilter: 'all',
    search: '',
    advancedFilters: [],
    advancedOperator: 'AND'
};

// DOM elements
let productGrid;
let catalogSearch;
let categoryDropdown;
let manufacturerDropdown;
let priceDropdown;
let sortDropdown;
let quickFilters;
let appliedFilters;
let productModal;
let loadingIndicator;
let sideNav;
let overlay;

// Initialize the catalog
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Modern Digital Catalog...');

    // Get DOM elements
    productGrid = document.getElementById('productGrid');
    catalogSearch = document.getElementById('catalogSearch');
    categoryDropdown = document.getElementById('categoryDropdown');
    manufacturerDropdown = document.getElementById('manufacturerDropdown');
    priceDropdown = document.getElementById('priceDropdown');
    sortDropdown = document.getElementById('sortDropdown');
    quickFilters = document.querySelectorAll('.quick-filter');
    appliedFilters = document.getElementById('appliedFilters');
    productModal = document.getElementById('productModal');
    loadingIndicator = document.getElementById('loadingIndicator');
    sideNav = document.getElementById('sideNav');
    overlay = document.getElementById('overlay');

    // Set up event listeners
    setupEventListeners();

    // Initialize UI components
    initializeUIComponents();

    // Load products
    loadProducts();

    // Initialize Material Design Web components
    if (typeof mdc !== 'undefined') {
        const buttons = document.querySelectorAll('.mdc-button');
        buttons.forEach(button => new mdc.ripple.MDCRipple(button));
    }

    // Expose applyAdvancedFilters function to window for advanced-search.js
    window.applyAdvancedFilters = function(conditions, operator) {
        // Reset any existing advanced filters
        currentFilters.advancedFilters = [];

        // Apply new filters
        applyAdvancedFilters(conditions, operator);

        // Filter products
        filterProducts();
    };
});

// Set up event listeners
function setupEventListeners() {
    // Menu button
    document.getElementById('menuButton').addEventListener('click', toggleSideNav);

    // Close nav button
    document.getElementById('closeNavButton').addEventListener('click', toggleSideNav);

    // Overlay click
    overlay.addEventListener('click', function() {
        closeSideNav();
        closeProductModal();
    });

    // Search input
    catalogSearch.addEventListener('input', function() {
        currentFilters.search = this.value.toLowerCase();
        filterProducts();
    });

    // Category filter button
    document.getElementById('categoryFilterButton').addEventListener('click', function() {
        toggleDropdown('categoryDropdown');
    });

    // Manufacturer filter button
    document.getElementById('manufacturerFilterButton').addEventListener('click', function() {
        toggleDropdown('manufacturerDropdown');
    });

    // Price filter button
    document.getElementById('priceFilterButton').addEventListener('click', function() {
        toggleDropdown('priceDropdown');
    });

    // Sort filter button
    document.getElementById('sortFilterButton').addEventListener('click', function() {
        toggleDropdown('sortDropdown');
    });

    // View toggle buttons
    document.getElementById('gridViewButton').addEventListener('click', function() {
        setView('grid');
    });

    document.getElementById('listViewButton').addEventListener('click', function() {
        setView('list');
    });

    // Quick filters
    quickFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            // Remove active class from all filters
            quickFilters.forEach(f => f.classList.remove('active'));

            // Add active class to clicked filter
            this.classList.add('active');

            // Update current quick filter
            currentFilters.quickFilter = this.dataset.filter;

            // Filter products
            filterProducts();

            // Update applied filters
            updateAppliedFilters();
        });
    });

    // Sort dropdown items
    sortDropdown.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function() {
            // Update current sort
            currentFilters.sort = this.dataset.sort;

            // Update button text
            document.getElementById('sortFilterButton').querySelector('span').textContent = this.textContent;

            // Close dropdown
            toggleDropdown('sortDropdown');

            // Filter products
            filterProducts();

            // Update applied filters
            updateAppliedFilters();
        });
    });

    // Cart button
    document.getElementById('cartButton').addEventListener('click', function() {
        window.location.href = 'cart.html';
    });

    // Voice search button
    document.getElementById('voiceSearchBtn').addEventListener('click', function() {
        if (typeof initVoiceSearch === 'function') {
            initVoiceSearch();
        }
    });
}

// Initialize UI components
function initializeUIComponents() {
    // Initialize price slider
    // This would typically use a library like noUiSlider
    console.log('Price slider would be initialized here');
}

// Toggle side navigation
function toggleSideNav() {
    sideNav.classList.toggle('open');
    overlay.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
}

// Close side navigation
function closeSideNav() {
    sideNav.classList.remove('open');
    overlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
}

// Toggle dropdown
function toggleDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);

    // Close all other dropdowns
    document.querySelectorAll('.filter-dropdown').forEach(d => {
        if (d.id !== dropdownId) {
            d.classList.remove('open');
        }
    });

    // Toggle this dropdown
    dropdown.classList.toggle('open');
}

// Set view (grid or list)
function setView(view) {
    currentView = view;

    // Update view toggle buttons
    document.querySelectorAll('.view-button').forEach(button => {
        button.classList.remove('active');
    });

    document.querySelector(`[data-view="${view}"]`).classList.add('active');

    // Update product grid class
    productGrid.className = view === 'grid' ? 'product-grid' : 'product-list';

    // Re-display products
    displayProducts();
}

// Load products from data source
function loadProducts() {
    // Show loading indicator
    loadingIndicator.classList.add('active');

    // Simulate loading delay
    setTimeout(() => {
        // Check if CatalogData is available
        if (typeof CatalogData !== 'undefined' && CatalogData.getProducts) {
            allProducts = CatalogData.getProducts();

            // Initialize categories dropdown
            initializeCategoriesDropdown();

            // Initialize manufacturers dropdown
            initializeManufacturersDropdown();
        } else {
            // Fallback to sample data
            allProducts = getSampleProducts();
        }

        // Initialize filtered products with all products
        filteredProducts = [...allProducts];

        // Hide loading indicator
        loadingIndicator.classList.remove('active');

        // Display products
        displayProducts();
    }, 800);
}

// Initialize categories dropdown
function initializeCategoriesDropdown() {
    if (typeof CatalogData !== 'undefined' && CatalogData.getCategories) {
        const categories = CatalogData.getCategories();

        // Clear dropdown
        categoryDropdown.innerHTML = '';

        // Add "All Categories" option
        const allOption = document.createElement('div');
        allOption.className = 'dropdown-item active';
        allOption.dataset.category = '';
        allOption.textContent = 'All Categories';
        categoryDropdown.appendChild(allOption);

        // Add event listener
        allOption.addEventListener('click', function() {
            selectCategory('');
        });

        // Add categories
        categories.forEach(category => {
            const item = document.createElement('div');
            item.className = 'dropdown-item';
            item.dataset.category = category.id;
            item.textContent = `${category.name} (${category.count})`;
            categoryDropdown.appendChild(item);

            // Add event listener
            item.addEventListener('click', function() {
                selectCategory(category.id);
            });
        });
    }
}

// Initialize manufacturers dropdown
function initializeManufacturersDropdown() {
    if (typeof CatalogData !== 'undefined' && CatalogData.getManufacturers) {
        const manufacturers = CatalogData.getManufacturers();

        // Clear dropdown
        manufacturerDropdown.innerHTML = '';

        // Add "All Manufacturers" option
        const allOption = document.createElement('div');
        allOption.className = 'dropdown-item active';
        allOption.dataset.manufacturer = '';
        allOption.textContent = 'All Manufacturers';
        manufacturerDropdown.appendChild(allOption);

        // Add event listener
        allOption.addEventListener('click', function() {
            selectManufacturer('');
        });

        // Add manufacturers
        manufacturers.forEach(manufacturer => {
            const item = document.createElement('div');
            item.className = 'dropdown-item';
            item.dataset.manufacturer = manufacturer.id;
            item.textContent = `${manufacturer.name} (${manufacturer.count})`;
            manufacturerDropdown.appendChild(item);

            // Add event listener
            item.addEventListener('click', function() {
                selectManufacturer(manufacturer.id);
            });
        });
    }
}

// Select category
function selectCategory(categoryId) {
    // Update current category
    currentFilters.category = categoryId;

    // Update button text
    const buttonText = categoryId ?
        document.querySelector(`[data-category="${categoryId}"]`).textContent :
        'Category';
    document.getElementById('categoryFilterButton').querySelector('span').textContent = buttonText;

    // Update active class
    categoryDropdown.querySelectorAll('.dropdown-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-category="${categoryId}"]`).classList.add('active');

    // Close dropdown
    toggleDropdown('categoryDropdown');

    // Filter products
    filterProducts();

    // Update applied filters
    updateAppliedFilters();
}

// Select manufacturer
function selectManufacturer(manufacturerId) {
    // Update current manufacturer
    currentFilters.manufacturer = manufacturerId;

    // Update button text
    const buttonText = manufacturerId ?
        document.querySelector(`[data-manufacturer="${manufacturerId}"]`).textContent :
        'Manufacturer';
    document.getElementById('manufacturerFilterButton').querySelector('span').textContent = buttonText;

    // Update active class
    manufacturerDropdown.querySelectorAll('.dropdown-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-manufacturer="${manufacturerId}"]`).classList.add('active');

    // Close dropdown
    toggleDropdown('manufacturerDropdown');

    // Filter products
    filterProducts();

    // Update applied filters
    updateAppliedFilters();
}

// Update applied filters
function updateAppliedFilters() {
    // Clear applied filters
    appliedFilters.innerHTML = '';

    // Add category filter
    if (currentFilters.category) {
        addAppliedFilter('Category', document.querySelector(`[data-category="${currentFilters.category}"]`).textContent, () => {
            selectCategory('');
        });
    }

    // Add manufacturer filter
    if (currentFilters.manufacturer) {
        addAppliedFilter('Manufacturer', document.querySelector(`[data-manufacturer="${currentFilters.manufacturer}"]`).textContent, () => {
            selectManufacturer('');
        });
    }

    // Add quick filter
    if (currentFilters.quickFilter !== 'all') {
        const quickFilterText = document.querySelector(`[data-filter="${currentFilters.quickFilter}"]`).textContent;
        addAppliedFilter('Filter', quickFilterText, () => {
            document.querySelector('[data-filter="all"]').click();
        });
    }

    // Add advanced filters
    if (currentFilters.advancedFilters && currentFilters.advancedFilters.length > 0) {
        const operatorText = currentFilters.advancedOperator === 'AND' ? 'All' : 'Any';

        // Add a single filter for advanced search that shows the number of conditions
        addAppliedFilter('Advanced', `${operatorText} (${currentFilters.advancedFilters.length} conditions)`, () => {
            // Clear advanced filters
            currentFilters.advancedFilters = [];
            currentFilters.advancedOperator = 'AND';

            // Filter products
            filterProducts();

            // Update applied filters
            updateAppliedFilters();
        });
    }
}

// Add applied filter
function addAppliedFilter(type, value, removeCallback) {
    const filter = document.createElement('div');
    filter.className = 'applied-filter';
    filter.innerHTML = `
        <span>${type}: ${value}</span>
        <span class="remove-filter">
            <i class="material-icons">close</i>
        </span>
    `;

    // Add event listener to remove button
    filter.querySelector('.remove-filter').addEventListener('click', removeCallback);

    // Add to applied filters
    appliedFilters.appendChild(filter);
}

// Filter products based on current filters
function filterProducts() {
    // Start with all products
    filteredProducts = [...allProducts];

    // Apply search filter
    if (currentFilters.search) {
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(currentFilters.search) ||
            product.description.toLowerCase().includes(currentFilters.search) ||
            product.category.toLowerCase().includes(currentFilters.search) ||
            product.manufacturer.toLowerCase().includes(currentFilters.search)
        );
    }

    // Apply category filter
    if (currentFilters.category) {
        filteredProducts = filteredProducts.filter(product =>
            product.category.toLowerCase() === currentFilters.category.toLowerCase()
        );
    }

    // Apply manufacturer filter
    if (currentFilters.manufacturer) {
        filteredProducts = filteredProducts.filter(product =>
            product.manufacturer.toLowerCase() === currentFilters.manufacturer.toLowerCase()
        );
    }

    // Apply price range filter
    filteredProducts = filteredProducts.filter(product => {
        const price = parseFloat(product.price.replace('$', ''));
        return price >= currentFilters.priceRange.min && price <= currentFilters.priceRange.max;
    });

    // Apply quick filter
    if (currentFilters.quickFilter !== 'all') {
        filteredProducts = filteredProducts.filter(product =>
            product.tags && product.tags.includes(currentFilters.quickFilter)
        );
    }

    // Apply advanced filters if any
    if (currentFilters.advancedFilters && currentFilters.advancedFilters.length > 0) {
        applyAdvancedFilters(currentFilters.advancedFilters, currentFilters.advancedOperator);
    }

    // Apply sorting
    sortProducts();

    // Display filtered products
    displayProducts();
}

// Apply advanced filters
function applyAdvancedFilters(conditions, operator) {
    if (!conditions || conditions.length === 0) return;

    // Store the conditions and operator in currentFilters
    currentFilters.advancedFilters = conditions;
    currentFilters.advancedOperator = operator;

    // Apply filters based on operator (AND/OR)
    if (operator === 'AND') {
        // All conditions must match (AND)
        conditions.forEach(condition => {
            filteredProducts = filteredProducts.filter(product =>
                matchesCondition(product, condition)
            );
        });
    } else {
        // Any condition can match (OR)
        filteredProducts = filteredProducts.filter(product =>
            conditions.some(condition => matchesCondition(product, condition))
        );
    }

    // Update applied filters display
    updateAppliedFilters();
}

// Check if a product matches a condition
function matchesCondition(product, condition) {
    const { field, operator, value } = condition;

    // Get product value
    let productValue = product[field];

    // Handle special cases
    if (field === 'price') {
        productValue = parseFloat(product.price.replace('$', ''));
    } else if (typeof productValue === 'string') {
        productValue = productValue.toLowerCase();
    }

    // Convert value based on field type
    let conditionValue = value;
    if (field === 'price' || field === 'rating' || field === 'stock') {
        conditionValue = parseFloat(value);
    } else if (typeof conditionValue === 'string') {
        conditionValue = conditionValue.toLowerCase();
    }

    // Apply operator logic
    switch (operator) {
        case 'equals':
            return productValue === conditionValue;
        case 'not_equals':
            return productValue !== conditionValue;
        case 'contains':
            return typeof productValue === 'string' && productValue.includes(conditionValue);
        case 'starts_with':
            return typeof productValue === 'string' && productValue.startsWith(conditionValue);
        case 'ends_with':
            return typeof productValue === 'string' && productValue.endsWith(conditionValue);
        case 'greater_than':
            return typeof productValue === 'number' && productValue > conditionValue;
        case 'less_than':
            return typeof productValue === 'number' && productValue < conditionValue;
        default:
            return false;
    }
}

// Sort products based on current sort option
function sortProducts() {
    switch (currentFilters.sort) {
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
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
    }
}

// Display products in the grid
function displayProducts() {
    // Clear product grid
    productGrid.innerHTML = '';

    // Check if there are products to display
    if (filteredProducts.length === 0) {
        productGrid.innerHTML = `
            <div class="no-products">
                <i class="material-icons-outlined">search_off</i>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms</p>
                <button class="mdc-button mdc-button--raised" id="clearFiltersBtn">
                    <span class="mdc-button__ripple"></span>
                    <span class="mdc-button__label">Clear Filters</span>
                </button>
            </div>
        `;

        // Add event listener to clear filters button
        document.getElementById('clearFiltersBtn').addEventListener('click', clearAllFilters);
        return;
    }

    // Create product cards
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });

    // Initialize Material Design Web components
    if (typeof mdc !== 'undefined') {
        const buttons = productGrid.querySelectorAll('.mdc-button');
        buttons.forEach(button => new mdc.ripple.MDCRipple(button));
    }
}

// Create a product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.productId = product.id;

    // Create card content
    card.innerHTML = `
        <div class="product-card-media">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            ${product.tags && product.tags.includes('sale') ? '<span class="product-badge sale">Sale</span>' : ''}
            ${product.tags && product.tags.includes('new') ? '<span class="product-badge new">New</span>' : ''}
        </div>
        <div class="product-card-content">
            <div class="product-category">${product.category}</div>
            <h3 class="product-name">${product.name}</h3>
            <div class="product-rating">
                ${generateRatingStars(product.rating)}
                <span class="rating-count">(${product.reviewCount})</span>
            </div>
            <p class="product-description">${product.description.substring(0, 100)}...</p>
            <div class="product-footer">
                <div class="product-price">${product.price}</div>
                <div class="product-actions">
                    <button class="mdc-button view-details-btn" title="View Details">
                        <span class="mdc-button__ripple"></span>
                        <span class="mdc-button__label">Details</span>
                    </button>
                    <button class="mdc-button mdc-button--raised add-to-cart-btn" title="Add to Cart">
                        <span class="mdc-button__ripple"></span>
                        <span class="mdc-button__label">Add to Cart</span>
                    </button>
                </div>
            </div>
        </div>
    `;

    // Add event listeners
    card.querySelector('.view-details-btn').addEventListener('click', function(e) {
        e.stopPropagation();
        showProductDetail(product.id);
    });

    card.querySelector('.add-to-cart-btn').addEventListener('click', function(e) {
        e.stopPropagation();
        addToCart(product.id);
    });

    // Add click event to the entire card
    card.addEventListener('click', function() {
        showProductDetail(product.id);
    });

    return card;
}

// Generate rating stars
function generateRatingStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="material-icons">star</i>';
    }

    // Add half star if needed
    if (halfStar) {
        stars += '<i class="material-icons">star_half</i>';
    }

    // Add empty stars
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="material-icons">star_border</i>';
    }

    return stars;
}

// Show product detail modal
function showProductDetail(productId) {
    // Find product by ID
    const product = allProducts.find(p => p.id === productId);

    if (!product) {
        console.error(`Product with ID ${productId} not found.`);
        return;
    }

    // Add to recently viewed
    if (typeof CatalogData !== 'undefined' && CatalogData.addToRecentlyViewed) {
        CatalogData.addToRecentlyViewed(productId);
    }

    // Create product detail content
    productModal.querySelector('.modal-content').innerHTML = `
        <div class="modal-header">
            <h2 class="modal-title">${product.name}</h2>
            <button class="modal-close-btn" id="closeModalBtn">
                <i class="material-icons">close</i>
            </button>
        </div>
        <div class="modal-body">
            <div class="product-detail">
                <div class="product-detail-gallery">
                    <div class="main-image">
                        <img src="${product.image}" alt="${product.name}" id="mainProductImage">
                    </div>
                    <div class="thumbnail-gallery">
                        ${product.images ? product.images.map(img => `
                            <div class="thumbnail">
                                <img src="${img}" alt="${product.name}" onclick="changeMainImage('${img}')">
                            </div>
                        `).join('') : ''}
                    </div>
                </div>
                <div class="product-detail-info">
                    <div class="product-detail-header">
                        <div class="product-detail-category">${product.category} | ${product.manufacturer}</div>
                        <div class="product-detail-rating">
                            ${generateRatingStars(product.rating)}
                            <span class="rating-count">(${product.reviewCount} reviews)</span>
                        </div>
                    </div>
                    <div class="product-detail-price">${product.price}</div>
                    <p class="product-detail-description">${product.description}</p>
                    <div class="product-detail-stock">
                        <span class="stock-label">Availability:</span>
                        <span class="stock-value ${parseInt(product.stock) > 0 ? 'in-stock' : 'out-of-stock'}">
                            ${parseInt(product.stock) > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                    </div>
                    <div class="product-detail-quantity">
                        <span class="quantity-label">Quantity:</span>
                        <div class="quantity-control">
                            <button class="quantity-btn" id="decreaseQuantity">-</button>
                            <input type="number" class="quantity-input" id="quantityInput" value="1" min="1" max="${product.stock}">
                            <button class="quantity-btn" id="increaseQuantity">+</button>
                        </div>
                    </div>
                    <div class="product-detail-actions">
                        <button class="mdc-button mdc-button--raised add-to-cart-btn" id="modalAddToCartBtn">
                            <span class="mdc-button__ripple"></span>
                            <span class="mdc-button__label">Add to Cart</span>
                        </button>
                        <button class="mdc-button wishlist-btn" id="addToWishlistBtn">
                            <span class="mdc-button__ripple"></span>
                            <i class="material-icons-outlined">favorite_border</i>
                            <span class="mdc-button__label">Add to Wishlist</span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="product-detail-tabs">
                <div class="tabs-header">
                    <div class="tab active" data-tab="specifications">Specifications</div>
                    <div class="tab" data-tab="compatibility">Compatibility</div>
                    <div class="tab" data-tab="reviews">Reviews</div>
                </div>
                <div class="tabs-content">
                    <div class="tab-panel active" id="specificationsPanel">
                        <table class="specifications-table">
                            ${Object.entries(product.specifications || {}).map(([key, value]) => `
                                <tr>
                                    <td class="spec-name">${key}</td>
                                    <td class="spec-value">${value}</td>
                                </tr>
                            `).join('')}
                        </table>
                    </div>
                    <div class="tab-panel" id="compatibilityPanel">
                        <ul class="compatibility-list">
                            ${(product.compatibleVehicles || []).map(vehicle => `
                                <li>${vehicle}</li>
                            `).join('')}
                        </ul>
                    </div>
                    <div class="tab-panel" id="reviewsPanel">
                        <div class="reviews-summary">
                            <div class="average-rating">
                                <span class="rating-number">${product.rating.toFixed(1)}</span>
                                <div class="rating-stars">
                                    ${generateRatingStars(product.rating)}
                                </div>
                            </div>
                            <p class="review-count">${product.reviewCount} reviews</p>
                        </div>
                        <button class="mdc-button mdc-button--outlined write-review-btn">
                            <span class="mdc-button__ripple"></span>
                            <span class="mdc-button__label">Write a Review</span>
                        </button>
                        <div class="reviews-list">
                            <!-- Reviews would be loaded dynamically -->
                            <p class="reviews-placeholder">Reviews would be loaded here</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Show modal
    productModal.classList.add('open');
    overlay.classList.add('active');
    document.body.classList.add('no-scroll');

    // Set up event listeners
    setupProductDetailEventListeners(product);

    // Initialize Material Design Web components
    if (typeof mdc !== 'undefined') {
        const buttons = productModal.querySelectorAll('.mdc-button');
        buttons.forEach(button => new mdc.ripple.MDCRipple(button));
    }
}

// Set up product detail event listeners
function setupProductDetailEventListeners(product) {
    // Close modal button
    document.getElementById('closeModalBtn').addEventListener('click', closeProductModal);

    // Quantity controls
    document.getElementById('decreaseQuantity').addEventListener('click', function() {
        const input = document.getElementById('quantityInput');
        const value = parseInt(input.value);
        if (value > 1) {
            input.value = value - 1;
        }
    });

    document.getElementById('increaseQuantity').addEventListener('click', function() {
        const input = document.getElementById('quantityInput');
        const value = parseInt(input.value);
        const max = parseInt(input.getAttribute('max'));
        if (value < max) {
            input.value = value + 1;
        }
    });

    // Add to cart button
    document.getElementById('modalAddToCartBtn').addEventListener('click', function() {
        const quantity = parseInt(document.getElementById('quantityInput').value);
        addToCart(product.id, quantity);
    });

    // Tabs
    productModal.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            productModal.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));

            // Add active class to clicked tab
            this.classList.add('active');

            // Hide all tab panels
            productModal.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));

            // Show selected tab panel
            const tabId = this.dataset.tab;
            document.getElementById(`${tabId}Panel`).classList.add('active');
        });
    });
}

// Close product detail modal
function closeProductModal() {
    productModal.classList.remove('open');
    overlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
}

// Add product to cart
function addToCart(productId, quantity = 1) {
    // Find product by ID
    const product = allProducts.find(p => p.id === productId);

    if (!product) {
        console.error(`Product with ID ${productId} not found.`);
        return;
    }

    // Add to cart using CatalogData if available
    if (typeof CatalogData !== 'undefined' && CatalogData.addToCart) {
        CatalogData.addToCart(productId, quantity);
    }

    // Update cart badge
    updateCartBadge();

    // Show notification
    showNotification(`${product.name} added to cart.`);
}

// Update cart badge
function updateCartBadge() {
    const cartBadge = document.getElementById('cartBadge');

    if (typeof CatalogData !== 'undefined' && CatalogData.getCartItems) {
        const cartItems = CatalogData.getCartItems();
        const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
        cartBadge.textContent = itemCount;
    }
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
    notification.innerHTML = `
        <div class="notification-content">
            <i class="material-icons">check_circle</i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="material-icons">close</i>
        </button>
    `;

    // Add close button event listener
    notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });

    // Add notification to container
    notificationContainer.appendChild(notification);

    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Clear all filters
function clearAllFilters() {
    // Reset filters
    currentFilters = {
        category: '',
        manufacturer: '',
        priceRange: { min: 0, max: 1000 },
        sort: 'name',
        quickFilter: 'all',
        search: '',
        advancedFilters: [],
        advancedOperator: 'AND'
    };

    // Reset UI
    catalogSearch.value = '';

    document.getElementById('categoryFilterButton').querySelector('span').textContent = 'Category';
    document.getElementById('manufacturerFilterButton').querySelector('span').textContent = 'Manufacturer';
    document.getElementById('priceFilterButton').querySelector('span').textContent = 'Price Range';
    document.getElementById('sortFilterButton').querySelector('span').textContent = 'Sort By';

    // Reset quick filters
    quickFilters.forEach(filter => filter.classList.remove('active'));
    document.querySelector('[data-filter="all"]').classList.add('active');

    // Clear applied filters
    appliedFilters.innerHTML = '';

    // Filter products
    filterProducts();
}

// Change main product image
function changeMainImage(imageUrl) {
    document.getElementById('mainProductImage').src = imageUrl;
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
            image: 'https://m.media-amazon.com/images/I/71eBZJ+5THL._AC_SL1500_.jpg',
            images: [
                'https://m.media-amazon.com/images/I/71eBZJ+5THL._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/71nwf+G+GnL._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/71Iq9T+YJFL._AC_SL1500_.jpg'
            ],
            specifications: {
                'Dimensions': '10" x 8" x 1"',
                'Material': 'Synthetic',
                'Filtration Rating': '99.5%',
                'Replacement Interval': '15,000 miles',
                'Warranty': '1 year'
            },
            compatibleVehicles: [
                'Toyota Camry (2018-2023)',
                'Honda Accord (2017-2023)',
                'Ford F-150 (2015-2022)',
                'Chevrolet Silverado (2016-2022)'
            ],
            dateAdded: '2023-01-15',
            tags: ['bestseller', 'featured'],
            rating: 4.7,
            reviewCount: 128
        },
        {
            id: 'P-10002',
            name: 'Brake Pad Set',
            description: 'Premium brake pads for reliable stopping power and reduced noise.',
            category: 'Brakes',
            manufacturer: 'BrakeMasters',
            price: '$89.95',
            stock: '78',
            image: 'https://m.media-amazon.com/images/I/71eUJMYUJOL._AC_SL1500_.jpg',
            images: [
                'https://m.media-amazon.com/images/I/71eUJMYUJOL._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/71Iq9T+YJFL._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/71nwf+G+GnL._AC_SL1500_.jpg'
            ],
            specifications: {
                'Position': 'Front',
                'Material': 'Ceramic',
                'Pad Life': '40,000-60,000 miles',
                'Noise Level': 'Low',
                'Dust Level': 'Low',
                'Warranty': '2 years'
            },
            compatibleVehicles: [
                'BMW 3 Series (2015-2023)',
                'Audi A4 (2016-2023)',
                'Mercedes C-Class (2015-2022)',
                'Lexus ES (2017-2023)'
            ],
            dateAdded: '2023-02-20',
            tags: ['bestseller'],
            rating: 4.5,
            reviewCount: 92
        },
        {
            id: 'P-10003',
            name: 'Alternator',
            description: 'Reliable alternator that ensures consistent electrical power for your vehicle. Built with premium components for long-lasting performance.',
            category: 'Electrical',
            manufacturer: 'ElectroParts',
            price: '$175.00',
            stock: '42',
            image: 'https://m.media-amazon.com/images/I/71Iq9T+YJFL._AC_SL1500_.jpg',
            images: [
                'https://m.media-amazon.com/images/I/71Iq9T+YJFL._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/71eBZJ+5THL._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/71nwf+G+GnL._AC_SL1500_.jpg'
            ],
            specifications: {
                'Output': '120 Amp',
                'Voltage': '12V',
                'Pulley Type': 'Serpentine',
                'Mounting Type': 'Direct Fit',
                'Warranty': '3 years'
            },
            compatibleVehicles: [
                'Ford Mustang (2015-2022)',
                'Chevrolet Camaro (2016-2023)',
                'Dodge Challenger (2015-2023)',
                'Nissan 370Z (2015-2020)'
            ],
            dateAdded: '2023-03-10',
            tags: ['featured'],
            rating: 4.8,
            reviewCount: 64
        },
        {
            id: 'P-10004',
            name: 'Engine Oil (5W-30)',
            description: 'Synthetic blend engine oil that provides superior protection against wear, deposits, and sludge.',
            category: 'Fluids',
            manufacturer: 'LubeTech',
            price: '$32.99',
            stock: '210',
            image: 'https://m.media-amazon.com/images/I/61ed2dOUgRL._AC_SL1500_.jpg',
            images: [
                'https://m.media-amazon.com/images/I/61ed2dOUgRL._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/71eBZJ+5THL._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/71Iq9T+YJFL._AC_SL1500_.jpg'
            ],
            specifications: {
                'Viscosity': '5W-30',
                'Type': 'Synthetic Blend',
                'Volume': '5 Quarts',
                'API Classification': 'SN/GF-5',
                'Recommended Change Interval': '5,000 miles'
            },
            compatibleVehicles: [
                'Most modern gasoline engines',
                'Light-duty diesel engines',
                'Turbocharged and naturally aspirated engines'
            ],
            dateAdded: '2023-01-25',
            tags: ['bestseller', 'sale'],
            rating: 4.9,
            reviewCount: 215
        },
        {
            id: 'P-10005',
            name: 'Oil Filter',
            description: 'Advanced oil filter that removes contaminants for engine longevity and optimal performance.',
            category: 'Filters',
            manufacturer: 'FilterCorp',
            price: '$12.50',
            stock: '320',
            image: 'https://m.media-amazon.com/images/I/71nwf+G+GnL._AC_SL1500_.jpg',
            images: [
                'https://m.media-amazon.com/images/I/71nwf+G+GnL._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/71eBZJ+5THL._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/71Iq9T+YJFL._AC_SL1500_.jpg'
            ],
            specifications: {
                'Filter Media': 'Synthetic Blend',
                'Efficiency': '99% at 20 microns',
                'Flow Rate': 'High',
                'Anti-Drainback Valve': 'Yes',
                'Bypass Valve': 'Yes'
            },
            compatibleVehicles: [
                'Toyota (most models 2010-2023)',
                'Honda (most models 2010-2023)',
                'Ford (most models 2010-2023)',
                'Chevrolet (most models 2010-2023)'
            ],
            dateAdded: '2023-02-05',
            tags: ['bestseller', 'sale'],
            rating: 4.6,
            reviewCount: 183
        },
        {
            id: 'P-10006',
            name: 'Spark Plug Set',
            description: 'High-performance spark plugs for improved ignition and fuel efficiency.',
            category: 'Ignition',
            manufacturer: 'SparkTech',
            price: '$45.75',
            stock: '96',
            image: 'https://m.media-amazon.com/images/I/71Iq9T+YJFL._AC_SL1500_.jpg',
            images: [
                'https://m.media-amazon.com/images/I/71Iq9T+YJFL._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/71eBZJ+5THL._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/71nwf+G+GnL._AC_SL1500_.jpg'
            ],
            specifications: {
                'Type': 'Iridium',
                'Gap': '0.044"',
                'Thread Size': '14mm',
                'Heat Range': 'Medium',
                'Quantity': '4 pieces'
            },
            compatibleVehicles: [
                'Subaru WRX (2015-2023)',
                'Mazda 3 (2014-2023)',
                'Volkswagen Golf GTI (2015-2023)',
                'Honda Civic Si (2016-2023)'
            ],
            dateAdded: '2023-03-15',
            tags: ['new', 'featured'],
            rating: 4.7,
            reviewCount: 76
        }
    ];
}
