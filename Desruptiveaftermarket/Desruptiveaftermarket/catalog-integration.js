/**
 * Catalog Integration
 * 
 * This file integrates the digital catalog with the main application,
 * including navigation, data sharing, and cross-module functionality.
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the main page with navigation
    const mainContent = document.getElementById('mainContent');

    if (mainContent) {
        // We're on the main page, integrate catalog
        integrateCatalog();
    } else {
        // We might be on the standalone catalog page
        console.log('Standalone catalog page detected');
        
        // Check if we need to initialize any shared components
        initializeSharedComponents();
    }
});

// Function to integrate catalog with main navigation
function integrateCatalog() {
    // Add Catalog to menu items if it doesn't exist
    const navMenu = document.querySelector('.nav-menu');
    
    if (navMenu) {
        // Check if catalog menu item already exists
        const existingCatalogItem = Array.from(navMenu.querySelectorAll('li a')).find(a => 
            a.textContent.trim() === 'Catalog' || a.dataset.section === 'catalog'
        );
        
        if (!existingCatalogItem) {
            // Create new menu item
            const catalogMenuItem = document.createElement('li');
            catalogMenuItem.innerHTML = `<a href="#" data-section="catalog"><i class="fas fa-shopping-cart"></i> Catalog</a>`;
            
            // Add event listener
            catalogMenuItem.querySelector('a').addEventListener('click', function(e) {
                e.preventDefault();
                navigateToCatalog();
            });
            
            // Add to menu
            navMenu.appendChild(catalogMenuItem);
            
            console.log('Catalog menu item added');
        }
    }
    
    // Add catalog to grid containers if using that navigation pattern
    if (typeof window.gridContainers !== 'undefined') {
        window.gridContainers['catalog'] = null; // Will be initialized when needed
    }
    
    // Register catalog with any global navigation controllers
    if (typeof window.NavigationController !== 'undefined') {
        window.NavigationController.registerPage('CATALOG', 'catalog.html');
    }
    
    console.log('Catalog integrated with main application');
}

// Function to navigate to the catalog page
function navigateToCatalog() {
    // Check if we're using the SPA approach or separate pages
    if (typeof window.showSection === 'function') {
        // SPA approach - show catalog section
        window.showSection('catalog');
        
        // Initialize catalog grid if needed
        initializeCatalogGrid();
    } else {
        // Separate pages approach - navigate to catalog.html
        window.location.href = 'catalog.html';
    }
}

// Function to initialize catalog grid for SPA approach
function initializeCatalogGrid() {
    // Get main content container
    const mainContent = document.getElementById('mainContent');
    
    if (!mainContent) return;
    
    // Check if catalog grid already exists
    let catalogGrid = document.getElementById('catalogGrid');
    
    if (!catalogGrid) {
        // Create catalog grid
        catalogGrid = document.createElement('div');
        catalogGrid.id = 'catalogGrid';
        catalogGrid.className = 'grid-container';
        
        // Create grid content
        catalogGrid.innerHTML = `
            <div class="grid-header">
                <h2>Product Catalog</h2>
                <div class="grid-actions">
                    <button class="grid-action-button" id="catalogAdvancedSearch" title="Search">
                        <i class="material-icons">search</i>
                    </button>
                    <button class="grid-action-button" id="catalogExport" title="Export">
                        <i class="material-icons">file_download</i>
                    </button>
                    <button class="grid-action-button" id="catalogRefresh" title="Refresh">
                        <i class="material-icons">refresh</i>
                    </button>
                </div>
            </div>
            
            <div class="catalog-container">
                <!-- Search Bar -->
                <div class="catalog-search">
                    <input type="text" class="catalog-search-input" id="catalogSearch" placeholder="Search products...">
                    <button class="catalog-voice-btn" id="catalogVoiceSearch" title="Voice Search">
                        <i class="material-icons">mic</i>
                    </button>
                    <button class="catalog-search-btn" id="catalogSearchBtn" title="Search">
                        <i class="material-icons">search</i>
                    </button>
                </div>
                
                <!-- Filters -->
                <div class="catalog-filters">
                    <div class="filter-group">
                        <select class="filter-select" id="catalogCategoryFilter">
                            <option value="">All Categories</option>
                            <option value="filters">Filters</option>
                            <option value="brakes">Brakes</option>
                            <option value="ignition">Ignition</option>
                            <option value="electrical">Electrical</option>
                            <option value="engine">Engine</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <select class="filter-select" id="catalogManufacturerFilter">
                            <option value="">All Manufacturers</option>
                            <option value="filtercorp">FilterCorp</option>
                            <option value="brakemasters">BrakeMasters</option>
                            <option value="sparktech">SparkTech</option>
                            <option value="electroparts">ElectroParts</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <select class="filter-select" id="catalogSortFilter">
                            <option value="name">Sort by Name</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="newest">Newest First</option>
                        </select>
                    </div>
                </div>
                
                <!-- Product Grid -->
                <div class="product-grid" id="catalogProductGrid">
                    <!-- Products will be added here dynamically -->
                </div>
            </div>
        `;
        
        // Add to main content
        mainContent.appendChild(catalogGrid);
        
        // Hide initially
        catalogGrid.style.display = 'none';
        
        // Initialize catalog functionality
        initializeCatalogFunctionality(catalogGrid);
        
        console.log('Catalog grid created');
    }
    
    // Store in grid containers if available
    if (typeof window.gridContainers !== 'undefined') {
        window.gridContainers['catalog'] = catalogGrid;
    }
}

// Function to initialize catalog functionality for SPA approach
function initializeCatalogFunctionality(catalogGrid) {
    // Check if CatalogData is available
    if (typeof CatalogData === 'undefined') {
        // Load catalog data script
        const script = document.createElement('script');
        script.src = 'catalog-data.js';
        document.head.appendChild(script);
        
        // Wait for script to load
        script.onload = function() {
            // Initialize catalog data
            if (typeof CatalogData !== 'undefined' && typeof CatalogData.initialize === 'function') {
                CatalogData.initialize();
                
                // Load products
                loadCatalogProducts(catalogGrid);
            }
        };
    } else {
        // Load products
        loadCatalogProducts(catalogGrid);
    }
    
    // Set up event listeners
    setupCatalogEventListeners(catalogGrid);
}

// Function to load catalog products for SPA approach
function loadCatalogProducts(catalogGrid) {
    // Get product grid
    const productGrid = catalogGrid.querySelector('#catalogProductGrid');
    
    if (!productGrid) return;
    
    // Clear product grid
    productGrid.innerHTML = '';
    
    // Get products
    let products = [];
    
    if (typeof CatalogData !== 'undefined' && typeof CatalogData.getProducts === 'function') {
        products = CatalogData.getProducts();
    } else {
        // Fallback to sample data
        products = getSampleProducts();
    }
    
    // Create product cards
    products.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
    
    console.log(`Loaded ${products.length} products`);
}

// Function to create a product card
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

// Function to set up catalog event listeners for SPA approach
function setupCatalogEventListeners(catalogGrid) {
    // Search input
    const searchInput = catalogGrid.querySelector('#catalogSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterCatalogProducts(catalogGrid);
        });
    }
    
    // Search button
    const searchBtn = catalogGrid.querySelector('#catalogSearchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            filterCatalogProducts(catalogGrid);
        });
    }
    
    // Category filter
    const categoryFilter = catalogGrid.querySelector('#catalogCategoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            filterCatalogProducts(catalogGrid);
        });
    }
    
    // Manufacturer filter
    const manufacturerFilter = catalogGrid.querySelector('#catalogManufacturerFilter');
    if (manufacturerFilter) {
        manufacturerFilter.addEventListener('change', function() {
            filterCatalogProducts(catalogGrid);
        });
    }
    
    // Sort filter
    const sortFilter = catalogGrid.querySelector('#catalogSortFilter');
    if (sortFilter) {
        sortFilter.addEventListener('change', function() {
            filterCatalogProducts(catalogGrid);
        });
    }
    
    // Advanced search button
    const advancedSearchBtn = catalogGrid.querySelector('#catalogAdvancedSearch');
    if (advancedSearchBtn) {
        advancedSearchBtn.addEventListener('click', function() {
            showAdvancedSearch();
        });
    }
    
    // Refresh button
    const refreshBtn = catalogGrid.querySelector('#catalogRefresh');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            loadCatalogProducts(catalogGrid);
        });
    }
    
    // Export button
    const exportBtn = catalogGrid.querySelector('#catalogExport');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            exportCatalogData();
        });
    }
}

// Function to filter catalog products for SPA approach
function filterCatalogProducts(catalogGrid) {
    // Get filter values
    const searchTerm = catalogGrid.querySelector('#catalogSearch')?.value.toLowerCase() || '';
    const category = catalogGrid.querySelector('#catalogCategoryFilter')?.value || '';
    const manufacturer = catalogGrid.querySelector('#catalogManufacturerFilter')?.value || '';
    const sortBy = catalogGrid.querySelector('#catalogSortFilter')?.value || 'name';
    
    // Get products
    let products = [];
    
    if (typeof CatalogData !== 'undefined' && typeof CatalogData.getProducts === 'function') {
        products = CatalogData.getProducts();
    } else {
        // Fallback to sample data
        products = getSampleProducts();
    }
    
    // Apply filters
    let filteredProducts = [...products];
    
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
    if (category) {
        filteredProducts = filteredProducts.filter(product => 
            product.category.toLowerCase() === category.toLowerCase()
        );
    }
    
    // Apply manufacturer filter
    if (manufacturer) {
        filteredProducts = filteredProducts.filter(product => 
            product.manufacturer.toLowerCase() === manufacturer.toLowerCase()
        );
    }
    
    // Apply sorting
    switch (sortBy) {
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
    
    // Update product grid
    const productGrid = catalogGrid.querySelector('#catalogProductGrid');
    
    if (productGrid) {
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
}

// Function to initialize shared components
function initializeSharedComponents() {
    // Initialize any components that need to be shared between pages
    console.log('Initializing shared components');
    
    // Add cart indicator to header if it doesn't exist
    addCartIndicator();
}

// Function to add cart indicator to header
function addCartIndicator() {
    // Check if we're on a page with a header
    const header = document.querySelector('.mdl-layout__header-row');
    
    if (header) {
        // Check if cart indicator already exists
        let cartIndicator = header.querySelector('#cartIndicator');
        
        if (!cartIndicator) {
            // Create cart indicator
            cartIndicator = document.createElement('div');
            cartIndicator.id = 'cartIndicator';
            cartIndicator.className = 'cart-indicator';
            cartIndicator.innerHTML = `
                <button class="mdl-button mdl-js-button mdl-button--icon">
                    <i class="material-icons">shopping_cart</i>
                    <span class="cart-badge" id="cartBadge">0</span>
                </button>
            `;
            
            // Add to header before the search box
            const searchBox = header.querySelector('.mdl-textfield');
            if (searchBox) {
                header.insertBefore(cartIndicator, searchBox);
            } else {
                header.appendChild(cartIndicator);
            }
            
            // Add event listener
            cartIndicator.addEventListener('click', function() {
                showCart();
            });
            
            // Update cart badge
            updateCartBadge();
            
            console.log('Cart indicator added to header');
        }
    }
}

// Function to update cart badge
function updateCartBadge() {
    const cartBadge = document.getElementById('cartBadge');
    
    if (cartBadge) {
        // Get cart items
        let cartItems = [];
        
        if (typeof CatalogData !== 'undefined' && typeof CatalogData.getCartItems === 'function') {
            cartItems = CatalogData.getCartItems();
        } else if (localStorage.getItem('aftermarket_catalog_cart')) {
            cartItems = JSON.parse(localStorage.getItem('aftermarket_catalog_cart')) || [];
        }
        
        // Update badge
        cartBadge.textContent = cartItems.length;
        
        // Show/hide badge
        if (cartItems.length > 0) {
            cartBadge.style.display = 'block';
        } else {
            cartBadge.style.display = 'none';
        }
    }
}

// Function to show cart
function showCart() {
    console.log('Show cart not implemented yet');
    // In a real application, this would show the cart
    alert('Cart functionality will be implemented in the next phase.');
}

// Function to show product detail
function showProductDetail(productId) {
    console.log(`Show product detail for ${productId} not implemented yet`);
    // In a real application, this would show the product detail
    alert(`Product detail for ${productId} will be implemented in the next phase.`);
}

// Function to add product to cart
function addToCart(productId) {
    // Add to cart using CatalogData if available
    if (typeof CatalogData !== 'undefined' && typeof CatalogData.addToCart === 'function') {
        CatalogData.addToCart(productId, 1);
    } else {
        // Fallback to direct localStorage manipulation
        const cart = JSON.parse(localStorage.getItem('aftermarket_catalog_cart')) || [];
        
        // Check if product already exists in cart
        const existingItem = cart.find(item => item.productId === productId);
        
        if (existingItem) {
            // Update quantity
            existingItem.quantity += 1;
        } else {
            // Add new item
            cart.push({
                productId,
                quantity: 1,
                dateAdded: new Date().toISOString()
            });
        }
        
        // Save to localStorage
        localStorage.setItem('aftermarket_catalog_cart', JSON.stringify(cart));
    }
    
    // Update cart badge
    updateCartBadge();
    
    // Show notification
    alert(`Product added to cart.`);
}

// Function to show advanced search
function showAdvancedSearch() {
    console.log('Advanced search not implemented yet');
    // In a real application, this would show an advanced search panel
    alert('Advanced search will be implemented in the next phase.');
}

// Function to export catalog data
function exportCatalogData() {
    console.log('Export catalog data not implemented yet');
    // In a real application, this would export catalog data
    alert('Export functionality will be implemented in the next phase.');
}

// Get sample products (fallback if CatalogData is not available)
function getSampleProducts() {
    return [
        {
            id: 'P-10001',
            name: 'Air Filter',
            description: 'High-quality air filter for optimal engine performance.',
            category: 'Filters',
            manufacturer: 'FilterCorp',
            price: '$24.99',
            stock: '156',
            image: 'https://via.placeholder.com/300x200?text=Air+Filter',
            dateAdded: '2023-01-15'
        },
        {
            id: 'P-10002',
            name: 'Brake Pad Set',
            description: 'Premium brake pads for reliable stopping power.',
            category: 'Brakes',
            manufacturer: 'BrakeMasters',
            price: '$89.95',
            stock: '78',
            image: 'https://via.placeholder.com/300x200?text=Brake+Pad+Set',
            dateAdded: '2023-02-20'
        },
        {
            id: 'P-10003',
            name: 'Oil Filter',
            description: 'Advanced oil filter that removes harmful contaminants.',
            category: 'Filters',
            manufacturer: 'FilterCorp',
            price: '$12.50',
            stock: '210',
            image: 'https://via.placeholder.com/300x200?text=Oil+Filter',
            dateAdded: '2023-03-10'
        }
    ];
}
