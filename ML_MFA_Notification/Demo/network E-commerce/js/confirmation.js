// Confirmation page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get order info from sessionStorage
    const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));
    
    // Redirect to home if no order info
    if (!orderInfo) {
        window.location.href = 'index.html';
        return;
    }
    
    // DOM Elements
    const orderNumber = document.getElementById('order-number');
    const orderDate = document.getElementById('order-date');
    const confirmationShippingInfo = document.getElementById('confirmation-shipping-info');
    const confirmationItems = document.getElementById('confirmation-items');
    const confirmationSubtotal = document.getElementById('confirmation-subtotal');
    const confirmationShipping = document.getElementById('confirmation-shipping');
    const confirmationTax = document.getElementById('confirmation-tax');
    const confirmationTotal = document.getElementById('confirmation-total');
    
    // Format price
    function formatPrice(price) {
        return '$' + price.toFixed(2);
    }
    
    // Display order information
    function displayOrderInfo() {
        if (orderNumber) orderNumber.textContent = orderInfo.orderNumber;
        if (orderDate) orderDate.textContent = orderInfo.orderDate;
        
        // Display shipping information
        if (confirmationShippingInfo && orderInfo.shippingInfo) {
            const shippingInfo = orderInfo.shippingInfo;
            confirmationShippingInfo.innerHTML = `
                <p>${shippingInfo.firstName} ${shippingInfo.lastName}</p>
                <p>${shippingInfo.address}</p>
                <p>${shippingInfo.city}, ${shippingInfo.zip}</p>
                <p>${shippingInfo.country}</p>
                <p>${shippingInfo.phone}</p>
                <p>${shippingInfo.email}</p>
            `;
        }
        
        // Display order items
        if (confirmationItems && orderInfo.cart) {
            confirmationItems.innerHTML = '';
            
            orderInfo.cart.forEach(item => {
                const confirmationItem = document.createElement('div');
                confirmationItem.className = 'confirmation-item';
                confirmationItem.innerHTML = `
                    <div class="confirmation-item-image">
                        <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/70x70?text=${item.name}'">
                    </div>
                    <div class="confirmation-item-details">
                        <div class="confirmation-item-name">${item.name}</div>
                        <div class="confirmation-item-price">${formatPrice(item.price)}</div>
                        <div class="confirmation-item-quantity">Qty: ${item.quantity}</div>
                    </div>
                `;
                confirmationItems.appendChild(confirmationItem);
            });
        }
        
        // Display order totals
        if (confirmationSubtotal) confirmationSubtotal.textContent = formatPrice(orderInfo.subtotal);
        if (confirmationShipping) confirmationShipping.textContent = formatPrice(orderInfo.shipping);
        if (confirmationTax) confirmationTax.textContent = formatPrice(orderInfo.tax);
        if (confirmationTotal) confirmationTotal.textContent = formatPrice(orderInfo.total);
    }
    
    // Initialize
    displayOrderInfo();
    
    // Update cart count to 0
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = '0';
    }
});
