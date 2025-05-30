/**
 * Product Detail
 *
 * This file provides the functionality for the product detail page,
 * including image gallery, tabs, quantity selection, and add to cart.
 */

// Global variables
let currentProduct = null;
let currentQuantity = 1;

// Initialize the product detail page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Product Detail Page...');

    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        console.error('No product ID specified in URL.');
        showErrorMessage('Product not found. Please return to the catalog.');
        return;
    }

    // Load product data
    loadProductData(productId);

    // Set up event listeners
    setupEventListeners();

    // Initialize Material Design Lite components
    if (typeof componentHandler !== 'undefined') {
        componentHandler.upgradeAllRegistered();
    }
});

// Load product data
function loadProductData(productId) {
    // Check if CatalogData is available
    if (typeof CatalogData !== 'undefined' && typeof CatalogData.getProductById === 'function') {
        currentProduct = CatalogData.getProductById(productId);

        if (currentProduct) {
            // Update product details
            updateProductDetails();

            // Add to recently viewed
            if (typeof CatalogData.addToRecentlyViewed === 'function') {
                CatalogData.addToRecentlyViewed(productId);
            }

            // Load related products
            loadRelatedProducts();
        } else {
            console.error(`Product with ID ${productId} not found.`);
            showErrorMessage('Product not found. Please return to the catalog.');
        }
    } else {
        // Fallback to sample data
        currentProduct = getSampleProduct(productId);

        if (currentProduct) {
            // Update product details
            updateProductDetails();

            // Load related products
            loadRelatedProducts();
        } else {
            console.error(`Product with ID ${productId} not found.`);
            showErrorMessage('Product not found. Please return to the catalog.');
        }
    }
}

// Update product details
function updateProductDetails() {
    if (!currentProduct) return;

    // Update page title
    document.title = `${currentProduct.name} - Aftermarket Software`;

    // Update breadcrumbs
    updateBreadcrumbs();

    // Update product details
    document.querySelector('.product-category').textContent = currentProduct.category;
    document.querySelector('.product-name').textContent = currentProduct.name;
    document.querySelector('.product-sku').textContent = `SKU: ${currentProduct.id}`;
    document.querySelector('.product-price').textContent = currentProduct.price;

    // Update description
    const descriptionElement = document.querySelector('.product-description');
    if (descriptionElement) {
        descriptionElement.innerHTML = `<p>${currentProduct.description}</p>`;
    }

    // Update stock status
    updateStockStatus();

    // Update quantity input max
    const quantityInput = document.getElementById('quantityInput');
    if (quantityInput) {
        quantityInput.setAttribute('max', currentProduct.stock);
    }

    // Update rating
    updateRating();

    // Update image gallery
    updateImageGallery();

    // Update specifications
    updateSpecifications();

    // Update compatibility
    updateCompatibility();

    // Update reviews
    updateReviews();
}

// Update breadcrumbs
function updateBreadcrumbs() {
    const breadcrumbs = document.querySelector('.breadcrumbs');

    if (breadcrumbs && currentProduct) {
        breadcrumbs.innerHTML = `
            <a href="index.html">Home</a>
            <span class="separator">/</span>
            <a href="catalog.html">Catalog</a>
            <span class="separator">/</span>
            <a href="catalog.html?category=${encodeURIComponent(currentProduct.category.toLowerCase())}">${currentProduct.category}</a>
            <span class="separator">/</span>
            <span class="current">${currentProduct.name}</span>
        `;
    }
}

// Update stock status
function updateStockStatus() {
    const stockIndicator = document.querySelector('.stock-indicator');
    const stockText = document.querySelector('.stock-text');

    if (stockIndicator && stockText && currentProduct) {
        const stock = parseInt(currentProduct.stock);

        if (stock > 0) {
            if (stock <= parseInt(currentProduct.reorderLevel)) {
                // Low stock
                stockIndicator.className = 'stock-indicator low';
                stockText.textContent = `Low Stock (${stock} available)`;
            } else {
                // In stock
                stockIndicator.className = 'stock-indicator';
                stockText.textContent = `In Stock (${stock} available)`;
            }
        } else {
            // Out of stock
            stockIndicator.className = 'stock-indicator out';
            stockText.textContent = 'Out of Stock';

            // Disable add to cart button
            const addToCartBtn = document.querySelector('.add-to-cart-btn');
            if (addToCartBtn) {
                addToCartBtn.disabled = true;
                addToCartBtn.textContent = 'Out of Stock';
            }

            // Disable quantity selector
            const quantitySelector = document.querySelector('.quantity-selector');
            if (quantitySelector) {
                quantitySelector.style.opacity = '0.5';
                quantitySelector.style.pointerEvents = 'none';
            }
        }
    }
}

// Update rating
function updateRating() {
    const ratingStars = document.querySelector('.rating-stars');
    const ratingCount = document.querySelector('.rating-count');

    if (ratingStars && ratingCount && currentProduct) {
        if (currentProduct.rating && currentProduct.reviewCount) {
            // Create star rating
            const rating = parseFloat(currentProduct.rating);
            let starsHtml = '';

            for (let i = 1; i <= 5; i++) {
                if (i <= Math.floor(rating)) {
                    // Full star
                    starsHtml += '<i class="fas fa-star"></i>';
                } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
                    // Half star
                    starsHtml += '<i class="fas fa-star-half-alt"></i>';
                } else {
                    // Empty star
                    starsHtml += '<i class="far fa-star"></i>';
                }
            }

            ratingStars.innerHTML = starsHtml;
            ratingCount.textContent = `(${currentProduct.reviewCount} reviews)`;
        } else {
            // No rating
            ratingStars.innerHTML = '<i class="far fa-star"></i>'.repeat(5);
            ratingCount.textContent = '(0 reviews)';
        }
    }
}

// Update image gallery
function updateImageGallery() {
    const mainImage = document.getElementById('mainImage');
    const thumbnailContainer = document.querySelector('.thumbnail-container');

    if (mainImage && thumbnailContainer && currentProduct) {
        // Set main image
        mainImage.src = currentProduct.image;
        mainImage.alt = currentProduct.name;

        // Clear thumbnails
        thumbnailContainer.innerHTML = '';

        // Add thumbnails
        if (currentProduct.images && currentProduct.images.length > 0) {
            currentProduct.images.forEach((image, index) => {
                const thumbnail = document.createElement('img');
                thumbnail.src = image;
                thumbnail.alt = `${currentProduct.name} ${index + 1}`;
                thumbnail.className = 'thumbnail';
                if (index === 0) thumbnail.classList.add('active');

                thumbnail.addEventListener('click', function() {
                    // Update main image
                    mainImage.src = image;

                    // Update active thumbnail
                    const thumbnails = document.querySelectorAll('.thumbnail');
                    thumbnails.forEach(thumb => thumb.classList.remove('active'));
                    this.classList.add('active');
                });

                thumbnailContainer.appendChild(thumbnail);
            });
        } else {
            // If no images array, use the main image
            const thumbnail = document.createElement('img');
            thumbnail.src = currentProduct.image;
            thumbnail.alt = currentProduct.name;
            thumbnail.className = 'thumbnail active';
            thumbnailContainer.appendChild(thumbnail);
        }
    }
}

// Update specifications
function updateSpecifications() {
    const specificationsTable = document.querySelector('#specifications .specifications-table');

    if (specificationsTable && currentProduct) {
        // Clear specifications
        specificationsTable.innerHTML = '';

        if (currentProduct.specifications) {
            // Add specifications
            for (const [key, value] of Object.entries(currentProduct.specifications)) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <th>${key}</th>
                    <td>${value}</td>
                `;
                specificationsTable.appendChild(row);
            }
        } else {
            // No specifications
            specificationsTable.innerHTML = '<tr><td colspan="2">No specifications available.</td></tr>';
        }
    }
}

// Update compatibility
function updateCompatibility() {
    const compatibilityList = document.querySelector('#compatibility .compatibility-list');

    if (compatibilityList && currentProduct) {
        // Clear compatibility
        compatibilityList.innerHTML = '';

        if (currentProduct.compatibleVehicles && currentProduct.compatibleVehicles.length > 0) {
            // Add compatibility
            currentProduct.compatibleVehicles.forEach(vehicle => {
                const li = document.createElement('li');
                li.textContent = vehicle;
                compatibilityList.appendChild(li);
            });
        } else {
            // No compatibility
            compatibilityList.innerHTML = '<li>No compatibility information available.</li>';
        }
    }
}

// Update reviews
function updateReviews() {
    const reviewsTab = document.getElementById('reviews');

    if (reviewsTab && currentProduct) {
        // Check if reviews.js is loaded
        if (typeof displayProductReviews === 'function') {
            // Display reviews
            displayProductReviews(currentProduct.id, reviewsTab);
        } else {
            // Load reviews.js
            const script = document.createElement('script');
            script.src = 'reviews.js';
            script.onload = function() {
                // Display reviews after script is loaded
                if (typeof displayProductReviews === 'function') {
                    displayProductReviews(currentProduct.id, reviewsTab);
                }
            };
            document.head.appendChild(script);
        }
    }
}

// Load related products
function loadRelatedProducts() {
    const relatedProductsGrid = document.querySelector('.related-products-grid');

    if (relatedProductsGrid && currentProduct) {
        // Clear related products
        relatedProductsGrid.innerHTML = '';

        // Get related products
        let relatedProducts = [];

        if (typeof CatalogData !== 'undefined' && typeof CatalogData.getProductsByCategory === 'function') {
            // Get products in the same category
            relatedProducts = CatalogData.getProductsByCategory(currentProduct.category);

            // Filter out current product
            relatedProducts = relatedProducts.filter(product => product.id !== currentProduct.id);

            // Limit to 3 products
            relatedProducts = relatedProducts.slice(0, 3);
        } else {
            // Fallback to sample related products
            relatedProducts = getSampleRelatedProducts(currentProduct.id, currentProduct.category);
        }

        // Add related products
        relatedProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.dataset.productId = product.id;

            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-card-info">
                    <div class="product-card-category">${product.category}</div>
                    <h3 class="product-card-name">${product.name}</h3>
                    <div class="product-card-price">${product.price}</div>
                </div>
            `;

            productCard.addEventListener('click', function() {
                window.location.href = `product-detail.html?id=${product.id}`;
            });

            relatedProductsGrid.appendChild(productCard);
        });
    }
}

// Set up event listeners
function setupEventListeners() {
    // Quantity input
    const quantityInput = document.getElementById('quantityInput');
    if (quantityInput) {
        quantityInput.addEventListener('change', function() {
            // Ensure quantity is within range
            let quantity = parseInt(this.value);
            const min = parseInt(this.getAttribute('min'));
            const max = parseInt(this.getAttribute('max'));

            if (isNaN(quantity) || quantity < min) {
                quantity = min;
            } else if (quantity > max) {
                quantity = max;
            }

            this.value = quantity;
            currentQuantity = quantity;
        });
    }

    // Add to cart button
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            addToCart();
        });
    }

    // Wishlist button
    const wishlistBtn = document.querySelector('.wishlist-btn');
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', function() {
            addToWishlist();
        });
    }

    // Tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.textContent.toLowerCase();
            showTab(tabId);
        });
    });
}

// Show tab
function showTab(tabId) {
    // Hide all tabs
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));

    // Show selected tab
    document.getElementById(tabId).classList.add('active');

    // Update active tab button
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => button.classList.remove('active'));

    // Find the button for this tab
    const activeButton = Array.from(tabButtons).find(button =>
        button.textContent.toLowerCase() === tabId
    );

    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// Increment quantity
function incrementQuantity() {
    const quantityInput = document.getElementById('quantityInput');

    if (quantityInput) {
        const max = parseInt(quantityInput.getAttribute('max'));
        let quantity = parseInt(quantityInput.value);

        if (quantity < max) {
            quantity++;
            quantityInput.value = quantity;
            currentQuantity = quantity;
        }
    }
}

// Decrement quantity
function decrementQuantity() {
    const quantityInput = document.getElementById('quantityInput');

    if (quantityInput) {
        const min = parseInt(quantityInput.getAttribute('min'));
        let quantity = parseInt(quantityInput.value);

        if (quantity > min) {
            quantity--;
            quantityInput.value = quantity;
            currentQuantity = quantity;
        }
    }
}

// Add to cart
function addToCart() {
    if (!currentProduct) return;

    // Get quantity
    const quantity = currentQuantity;

    // Add to cart using CatalogData if available
    if (typeof CatalogData !== 'undefined' && typeof CatalogData.addToCart === 'function') {
        CatalogData.addToCart(currentProduct.id, quantity);
        showNotification(`${quantity} ${quantity === 1 ? 'item' : 'items'} added to cart.`);
    } else {
        // Fallback
        showNotification(`${quantity} ${quantity === 1 ? 'item' : 'items'} added to cart.`);
    }

    // Update cart badge if available
    if (typeof updateCartBadge === 'function') {
        updateCartBadge();
    }
}

// Add to wishlist
function addToWishlist() {
    if (!currentProduct) return;

    // In a real application, this would add the product to the wishlist
    showNotification('Added to wishlist.');
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

// Show error message
function showErrorMessage(message) {
    const productContainer = document.querySelector('.product-container');

    if (productContainer) {
        productContainer.innerHTML = `
            <div class="error-message">
                <i class="material-icons">error</i>
                <p>${message}</p>
                <a href="catalog.html" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">
                    Return to Catalog
                </a>
            </div>
        `;
    }
}

// Get sample product (fallback if CatalogData is not available)
function getSampleProduct(productId) {
    const sampleProducts = [
        {
            id: 'P-10001',
            name: 'Air Filter',
            description: 'High-quality air filter for optimal engine performance and fuel efficiency.',
            category: 'Filters',
            manufacturer: 'FilterCorp',
            price: '$24.99',
            stock: '156',
            reorderLevel: '50',
            image: 'https://via.placeholder.com/800x600?text=Air+Filter',
            images: [
                'https://via.placeholder.com/800x600?text=Air+Filter+1',
                'https://via.placeholder.com/800x600?text=Air+Filter+2',
                'https://via.placeholder.com/800x600?text=Air+Filter+3'
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
            rating: 4.7,
            reviewCount: 128
        }
    ];

    return sampleProducts.find(product => product.id === productId);
}

// Get sample related products (fallback if CatalogData is not available)
function getSampleRelatedProducts(productId, category) {
    const sampleProducts = [
        {
            id: 'P-10003',
            name: 'Oil Filter',
            description: 'Advanced oil filter that removes harmful contaminants.',
            category: 'Filters',
            manufacturer: 'FilterCorp',
            price: '$12.50',
            stock: '210',
            image: 'https://via.placeholder.com/300x200?text=Oil+Filter'
        },
        {
            id: 'P-10004',
            name: 'Spark Plug Set',
            description: 'High-performance spark plugs for improved ignition.',
            category: 'Ignition',
            manufacturer: 'SparkTech',
            price: '$45.75',
            stock: '92',
            image: 'https://via.placeholder.com/300x200?text=Spark+Plug+Set'
        },
        {
            id: 'P-10006',
            name: 'Engine Oil (5W-30)',
            description: 'Synthetic blend engine oil for superior protection.',
            category: 'Fluids',
            manufacturer: 'LubeTech',
            price: '$32.99',
            stock: '180',
            image: 'https://via.placeholder.com/300x200?text=Engine+Oil'
        }
    ];

    // Filter out current product
    return sampleProducts.filter(product => product.id !== productId);
}
