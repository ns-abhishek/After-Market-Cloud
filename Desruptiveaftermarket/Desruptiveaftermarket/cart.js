/**
 * Shopping Cart
 * 
 * This file provides the functionality for the shopping cart page,
 * including displaying cart items, updating quantities, and checkout.
 */

// Initialize the cart page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Shopping Cart...');
    
    // Load cart items
    loadCartItems();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize Material Design Lite components
    if (typeof componentHandler !== 'undefined') {
        componentHandler.upgradeAllRegistered();
    }
});

// Load cart items
function loadCartItems() {
    const cartContent = document.getElementById('cartContent');
    
    if (!cartContent) return;
    
    // Get cart items
    let cartItems = [];
    
    if (typeof CatalogData !== 'undefined' && typeof CatalogData.getCartItems === 'function') {
        cartItems = CatalogData.getCartItems();
    } else {
        // Fallback to localStorage
        const cartData = localStorage.getItem('aftermarket_catalog_cart');
        if (cartData) {
            try {
                const cartItemIds = JSON.parse(cartData);
                // We need product data to display cart items
                // This is a simplified fallback that won't work without product data
                cartItems = cartItemIds;
            } catch (error) {
                console.error('Error parsing cart data:', error);
                cartItems = [];
            }
        }
    }
    
    // Check if cart is empty
    if (!cartItems || cartItems.length === 0) {
        displayEmptyCart(cartContent);
        return;
    }
    
    // Display cart items
    displayCartItems(cartContent, cartItems);
}

// Display empty cart message
function displayEmptyCart(container) {
    container.innerHTML = `
        <div class="cart-empty">
            <div class="cart-empty-icon">
                <i class="material-icons">shopping_cart</i>
            </div>
            <div class="cart-empty-message">Your cart is empty</div>
            <a href="catalog.html" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">
                Continue Shopping
            </a>
        </div>
    `;
}

// Display cart items
function displayCartItems(container, cartItems) {
    // Calculate totals
    const subtotal = calculateSubtotal(cartItems);
    const shipping = subtotal > 0 ? 10.00 : 0; // Example shipping cost
    const tax = subtotal * 0.08; // Example tax rate (8%)
    const total = subtotal + shipping + tax;
    
    // Create cart HTML
    const cartHTML = `
        <div class="cart-content">
            <table class="cart-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    ${cartItems.map(item => createCartItemRow(item)).join('')}
                </tbody>
            </table>
            
            <div class="mdl-grid">
                <div class="mdl-cell mdl-cell--8-col">
                    <a href="catalog.html" class="continue-shopping">
                        <i class="material-icons">arrow_back</i> Continue Shopping
                    </a>
                </div>
                <div class="mdl-cell mdl-cell--4-col">
                    <div class="cart-summary">
                        <h3 class="cart-summary-title">Order Summary</h3>
                        <div class="cart-summary-row">
                            <span class="cart-summary-label">Subtotal</span>
                            <span class="cart-summary-value">$${subtotal.toFixed(2)}</span>
                        </div>
                        <div class="cart-summary-row">
                            <span class="cart-summary-label">Shipping</span>
                            <span class="cart-summary-value">$${shipping.toFixed(2)}</span>
                        </div>
                        <div class="cart-summary-row">
                            <span class="cart-summary-label">Tax</span>
                            <span class="cart-summary-value">$${tax.toFixed(2)}</span>
                        </div>
                        <div class="cart-summary-total">
                            <span>Total</span>
                            <span>$${total.toFixed(2)}</span>
                        </div>
                        <button class="checkout-btn" id="checkoutBtn">
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Set cart HTML
    container.innerHTML = cartHTML;
    
    // Add event listeners to quantity buttons and remove buttons
    addCartItemEventListeners();
}

// Create cart item row HTML
function createCartItemRow(item) {
    const product = item.product;
    const quantity = item.quantity;
    const price = parseFloat(product.price.replace('$', ''));
    const totalPrice = price * quantity;
    
    return `
        <tr data-product-id="${product.id}">
            <td data-label="Product">
                <div class="cart-product">
                    <img src="${product.image}" alt="${product.name}" class="cart-product-image">
                    <div class="cart-product-info">
                        <div class="cart-product-name">${product.name}</div>
                        <div class="cart-product-category">${product.category}</div>
                    </div>
                </div>
            </td>
            <td data-label="Price" class="cart-price">$${price.toFixed(2)}</td>
            <td data-label="Quantity">
                <div class="cart-quantity">
                    <button class="cart-quantity-btn decrease-quantity" data-product-id="${product.id}">
                        <i class="material-icons">remove</i>
                    </button>
                    <input type="number" class="cart-quantity-input" value="${quantity}" min="1" max="${product.stock}" data-product-id="${product.id}">
                    <button class="cart-quantity-btn increase-quantity" data-product-id="${product.id}">
                        <i class="material-icons">add</i>
                    </button>
                </div>
            </td>
            <td data-label="Total" class="cart-total">$${totalPrice.toFixed(2)}</td>
            <td>
                <button class="cart-remove-btn" data-product-id="${product.id}">
                    <i class="material-icons">delete</i>
                </button>
            </td>
        </tr>
    `;
}

// Calculate subtotal
function calculateSubtotal(cartItems) {
    return cartItems.reduce((total, item) => {
        const price = parseFloat(item.product.price.replace('$', ''));
        return total + (price * item.quantity);
    }, 0);
}

// Add event listeners to cart item elements
function addCartItemEventListeners() {
    // Quantity decrease buttons
    const decreaseButtons = document.querySelectorAll('.decrease-quantity');
    decreaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.productId;
            const input = document.querySelector(`.cart-quantity-input[data-product-id="${productId}"]`);
            let quantity = parseInt(input.value);
            
            if (quantity > 1) {
                quantity--;
                input.value = quantity;
                updateCartItemQuantity(productId, quantity);
            }
        });
    });
    
    // Quantity increase buttons
    const increaseButtons = document.querySelectorAll('.increase-quantity');
    increaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.productId;
            const input = document.querySelector(`.cart-quantity-input[data-product-id="${productId}"]`);
            let quantity = parseInt(input.value);
            const max = parseInt(input.getAttribute('max'));
            
            if (quantity < max) {
                quantity++;
                input.value = quantity;
                updateCartItemQuantity(productId, quantity);
            }
        });
    });
    
    // Quantity input fields
    const quantityInputs = document.querySelectorAll('.cart-quantity-input');
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            const productId = this.dataset.productId;
            let quantity = parseInt(this.value);
            const min = parseInt(this.getAttribute('min'));
            const max = parseInt(this.getAttribute('max'));
            
            if (isNaN(quantity) || quantity < min) {
                quantity = min;
                this.value = min;
            } else if (quantity > max) {
                quantity = max;
                this.value = max;
            }
            
            updateCartItemQuantity(productId, quantity);
        });
    });
    
    // Remove buttons
    const removeButtons = document.querySelectorAll('.cart-remove-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.productId;
            removeCartItem(productId);
        });
    });
}

// Update cart item quantity
function updateCartItemQuantity(productId, quantity) {
    // Update quantity in data store
    if (typeof CatalogData !== 'undefined' && typeof CatalogData.updateCartItemQuantity === 'function') {
        CatalogData.updateCartItemQuantity(productId, quantity);
    } else {
        // Fallback to localStorage
        const cartData = localStorage.getItem('aftermarket_catalog_cart');
        if (cartData) {
            try {
                let cartItems = JSON.parse(cartData);
                const itemIndex = cartItems.findIndex(item => item.productId === productId);
                
                if (itemIndex !== -1) {
                    cartItems[itemIndex].quantity = quantity;
                    localStorage.setItem('aftermarket_catalog_cart', JSON.stringify(cartItems));
                }
            } catch (error) {
                console.error('Error updating cart item quantity:', error);
            }
        }
    }
    
    // Update UI
    updateCartItemUI(productId, quantity);
}

// Update cart item UI
function updateCartItemUI(productId, quantity) {
    // Get price element
    const priceElement = document.querySelector(`tr[data-product-id="${productId}"] .cart-price`);
    if (!priceElement) return;
    
    // Get price value
    const price = parseFloat(priceElement.textContent.replace('$', ''));
    
    // Calculate new total
    const totalPrice = price * quantity;
    
    // Update total element
    const totalElement = document.querySelector(`tr[data-product-id="${productId}"] .cart-total`);
    if (totalElement) {
        totalElement.textContent = `$${totalPrice.toFixed(2)}`;
    }
    
    // Update order summary
    updateOrderSummary();
}

// Remove cart item
function removeCartItem(productId) {
    // Remove from data store
    if (typeof CatalogData !== 'undefined' && typeof CatalogData.removeFromCart === 'function') {
        CatalogData.removeFromCart(productId);
    } else {
        // Fallback to localStorage
        const cartData = localStorage.getItem('aftermarket_catalog_cart');
        if (cartData) {
            try {
                let cartItems = JSON.parse(cartData);
                cartItems = cartItems.filter(item => item.productId !== productId);
                localStorage.setItem('aftermarket_catalog_cart', JSON.stringify(cartItems));
            } catch (error) {
                console.error('Error removing cart item:', error);
            }
        }
    }
    
    // Remove row from UI
    const row = document.querySelector(`tr[data-product-id="${productId}"]`);
    if (row) {
        row.remove();
    }
    
    // Check if cart is now empty
    const cartTable = document.querySelector('.cart-table tbody');
    if (cartTable && cartTable.children.length === 0) {
        // Cart is empty, show empty cart message
        const cartContent = document.getElementById('cartContent');
        if (cartContent) {
            displayEmptyCart(cartContent);
        }
    } else {
        // Update order summary
        updateOrderSummary();
    }
}

// Update order summary
function updateOrderSummary() {
    // Get all cart items
    const rows = document.querySelectorAll('.cart-table tbody tr');
    
    // Calculate subtotal
    let subtotal = 0;
    rows.forEach(row => {
        const totalElement = row.querySelector('.cart-total');
        if (totalElement) {
            subtotal += parseFloat(totalElement.textContent.replace('$', ''));
        }
    });
    
    // Calculate other values
    const shipping = subtotal > 0 ? 10.00 : 0; // Example shipping cost
    const tax = subtotal * 0.08; // Example tax rate (8%)
    const total = subtotal + shipping + tax;
    
    // Update summary elements
    const subtotalElement = document.querySelector('.cart-summary-row:nth-child(1) .cart-summary-value');
    const shippingElement = document.querySelector('.cart-summary-row:nth-child(2) .cart-summary-value');
    const taxElement = document.querySelector('.cart-summary-row:nth-child(3) .cart-summary-value');
    const totalElement = document.querySelector('.cart-summary-total span:nth-child(2)');
    
    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingElement) shippingElement.textContent = `$${shipping.toFixed(2)}`;
    if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
}

// Clear cart
function clearCart() {
    // Clear data store
    if (typeof CatalogData !== 'undefined' && typeof CatalogData.clearCart === 'function') {
        CatalogData.clearCart();
    } else {
        // Fallback to localStorage
        localStorage.setItem('aftermarket_catalog_cart', JSON.stringify([]));
    }
    
    // Show empty cart message
    const cartContent = document.getElementById('cartContent');
    if (cartContent) {
        displayEmptyCart(cartContent);
    }
}

// Set up event listeners
function setupEventListeners() {
    // Clear cart button
    const clearCartBtn = document.getElementById('clearCartBtn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear your cart?')) {
                clearCart();
            }
        });
    }
    
    // Update cart button
    const updateCartBtn = document.getElementById('updateCartBtn');
    if (updateCartBtn) {
        updateCartBtn.addEventListener('click', function() {
            // Reload cart items
            loadCartItems();
            
            // Show notification
            showNotification('Cart updated successfully');
        });
    }
    
    // Checkout button (added dynamically)
    document.addEventListener('click', function(event) {
        if (event.target.id === 'checkoutBtn' || event.target.closest('#checkoutBtn')) {
            checkout();
        }
    });
}

// Checkout
function checkout() {
    // In a real application, this would redirect to a checkout page
    alert('Checkout functionality will be implemented in the next phase.');
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
