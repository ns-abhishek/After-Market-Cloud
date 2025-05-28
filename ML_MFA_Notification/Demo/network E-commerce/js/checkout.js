// Checkout functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Redirect to home if cart is empty
    if (cart.length === 0) {
        window.location.href = 'index.html';
    }

    // DOM Elements
    const shippingSection = document.getElementById('shipping-section');
    const paymentSection = document.getElementById('payment-section');
    const reviewSection = document.getElementById('review-section');

    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const step3 = document.getElementById('step-3');

    const backToCartBtn = document.getElementById('back-to-cart');
    const toPaymentBtn = document.getElementById('to-payment');
    const backToShippingBtn = document.getElementById('back-to-shipping');
    const toReviewBtn = document.getElementById('to-review');
    const backToPaymentBtn = document.getElementById('back-to-payment');
    const placeOrderBtn = document.getElementById('place-order');

    const editShippingBtn = document.getElementById('edit-shipping');
    const editPaymentBtn = document.getElementById('edit-payment');

    const summaryItemsContainer = document.getElementById('summary-items');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryShipping = document.getElementById('summary-shipping');
    const summaryTax = document.getElementById('summary-tax');
    const summaryTotal = document.getElementById('summary-total');

    const reviewShippingInfo = document.getElementById('review-shipping-info');
    const reviewPaymentInfo = document.getElementById('review-payment-info');

    // Format price
    function formatPrice(price) {
        return '$' + price.toFixed(2);
    }

    // Calculate order summary
    function calculateOrderSummary() {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = subtotal > 100 ? 0 : 10; // Free shipping for orders over $100
        const tax = subtotal * 0.08; // 8% tax
        const total = subtotal + shipping + tax;

        summarySubtotal.textContent = formatPrice(subtotal);
        summaryShipping.textContent = formatPrice(shipping);
        summaryTax.textContent = formatPrice(tax);
        summaryTotal.textContent = formatPrice(total);
    }

    // Render order summary items
    function renderSummaryItems() {
        summaryItemsContainer.innerHTML = '';

        cart.forEach(item => {
            const summaryItem = document.createElement('div');
            summaryItem.className = 'summary-item';
            summaryItem.innerHTML = `
                <div class="summary-item-image">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/60x60?text=${item.name}'">
                </div>
                <div class="summary-item-details">
                    <div class="summary-item-name">${item.name}</div>
                    <div class="summary-item-price">${formatPrice(item.price)}</div>
                    <div class="summary-item-quantity">Qty: ${item.quantity}</div>
                </div>
            `;
            summaryItemsContainer.appendChild(summaryItem);
        });
    }

    // Show section
    function showSection(section) {
        // Hide all sections
        shippingSection.classList.remove('active');
        paymentSection.classList.remove('active');
        reviewSection.classList.remove('active');

        // Show selected section
        section.classList.add('active');

        // Update steps
        if (section === shippingSection) {
            step1.classList.add('active');
            step2.classList.remove('active');
            step3.classList.remove('active');
        } else if (section === paymentSection) {
            step1.classList.add('active');
            step1.classList.add('completed');
            step2.classList.add('active');
            step3.classList.remove('active');
        } else if (section === reviewSection) {
            step1.classList.add('active');
            step1.classList.add('completed');
            step2.classList.add('active');
            step2.classList.add('completed');
            step3.classList.add('active');
        }
    }

    // Validate shipping form
    function validateShippingForm() {
        const firstName = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const zip = document.getElementById('zip').value;
        const country = document.getElementById('country').value;
        const phone = document.getElementById('phone').value;

        if (!firstName || !lastName || !email || !address || !city || !zip || !country || !phone) {
            alert('Please fill in all required fields');
            return false;
        }

        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return false;
        }

        // Save shipping info to sessionStorage
        const shippingInfo = {
            firstName,
            lastName,
            email,
            address,
            city,
            zip,
            country,
            phone
        };

        sessionStorage.setItem('shippingInfo', JSON.stringify(shippingInfo));
        return true;
    }

    // Validate payment form
    function validatePaymentForm() {
        const cardName = document.getElementById('card-name').value;
        const cardNumber = document.getElementById('card-number').value;
        const expiry = document.getElementById('expiry').value;
        const cvv = document.getElementById('cvv').value;

        if (!cardName || !cardNumber || !expiry || !cvv) {
            alert('Please fill in all required fields');
            return false;
        }

        // Simple card number validation (16 digits)
        const cardNumberRegex = /^\d{16}$/;
        const cardNumberWithoutSpaces = cardNumber.replace(/\s/g, '');
        if (!cardNumberRegex.test(cardNumberWithoutSpaces)) {
            alert('Please enter a valid 16-digit card number');
            return false;
        }

        // Simple expiry date validation (MM/YY)
        const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (!expiryRegex.test(expiry)) {
            alert('Please enter a valid expiry date (MM/YY)');
            return false;
        }

        // Simple CVV validation (3 digits)
        const cvvRegex = /^\d{3}$/;
        if (!cvvRegex.test(cvv)) {
            alert('Please enter a valid 3-digit CVV');
            return false;
        }

        // Save payment info to sessionStorage
        const paymentInfo = {
            cardName,
            cardNumber: cardNumber.replace(/\d(?=\d{4})/g, '*'), // Mask card number
            expiry,
            cvv: '***' // Mask CVV
        };

        sessionStorage.setItem('paymentInfo', JSON.stringify(paymentInfo));
        return true;
    }

    // Display review information
    function displayReviewInfo() {
        const shippingInfo = JSON.parse(sessionStorage.getItem('shippingInfo'));
        const paymentInfo = JSON.parse(sessionStorage.getItem('paymentInfo'));

        if (shippingInfo) {
            reviewShippingInfo.innerHTML = `
                <p>${shippingInfo.firstName} ${shippingInfo.lastName}</p>
                <p>${shippingInfo.address}</p>
                <p>${shippingInfo.city}, ${shippingInfo.zip}</p>
                <p>${shippingInfo.country}</p>
                <p>${shippingInfo.phone}</p>
                <p>${shippingInfo.email}</p>
            `;
        }

        if (paymentInfo) {
            reviewPaymentInfo.innerHTML = `
                <p>${paymentInfo.cardName}</p>
                <p>${paymentInfo.cardNumber}</p>
                <p>Expires: ${paymentInfo.expiry}</p>
            `;
        }
    }

    // Place order
    function placeOrder() {
        const shippingInfo = JSON.parse(sessionStorage.getItem('shippingInfo'));
        const paymentInfo = JSON.parse(sessionStorage.getItem('paymentInfo'));

        if (!shippingInfo || !paymentInfo) {
            alert('Something went wrong. Please try again.');
            return;
        }

        // Generate order number
        const orderNumber = 'ORD-' + Date.now();
        const orderDate = new Date().toLocaleDateString();

        // Save order info to sessionStorage
        const orderInfo = {
            orderNumber,
            orderDate,
            cart,
            shippingInfo,
            paymentInfo,
            subtotal: parseFloat(summarySubtotal.textContent.replace('$', '')),
            shipping: parseFloat(summaryShipping.textContent.replace('$', '')),
            tax: parseFloat(summaryTax.textContent.replace('$', '')),
            total: parseFloat(summaryTotal.textContent.replace('$', ''))
        };

        sessionStorage.setItem('orderInfo', JSON.stringify(orderInfo));

        // Clear cart
        localStorage.removeItem('cart');

        // Redirect to confirmation page
        window.location.href = 'confirmation.html';
    }

    // Event listeners
    if (backToCartBtn) {
        backToCartBtn.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }

    if (toPaymentBtn) {
        toPaymentBtn.addEventListener('click', function() {
            if (validateShippingForm()) {
                // Redirect to the new payment page
                window.location.href = 'payment.html';
            }
        });
    }

    if (backToShippingBtn) {
        backToShippingBtn.addEventListener('click', function() {
            showSection(shippingSection);
        });
    }

    if (toReviewBtn) {
        toReviewBtn.addEventListener('click', function() {
            if (validatePaymentForm()) {
                displayReviewInfo();
                showSection(reviewSection);
            }
        });
    }

    if (backToPaymentBtn) {
        backToPaymentBtn.addEventListener('click', function() {
            showSection(paymentSection);
        });
    }

    if (editShippingBtn) {
        editShippingBtn.addEventListener('click', function() {
            showSection(shippingSection);
        });
    }

    if (editPaymentBtn) {
        editPaymentBtn.addEventListener('click', function() {
            showSection(paymentSection);
        });
    }

    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', placeOrder);
    }

    // Format input fields
    const cardNumberInput = document.getElementById('card-number');
    const expiryInput = document.getElementById('expiry');
    const cvvInput = document.getElementById('cvv');

    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            // Remove non-digit characters
            let value = e.target.value.replace(/\D/g, '');

            // Add space after every 4 digits
            value = value.replace(/(\d{4})(?=\d)/g, '$1 ');

            // Limit to 16 digits (19 characters with spaces)
            if (value.length > 19) {
                value = value.slice(0, 19);
            }

            e.target.value = value;
        });
    }

    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            // Remove non-digit characters
            let value = e.target.value.replace(/\D/g, '');

            // Add slash after 2 digits
            if (value.length > 2) {
                value = value.slice(0, 2) + '/' + value.slice(2);
            }

            // Limit to MM/YY format (5 characters)
            if (value.length > 5) {
                value = value.slice(0, 5);
            }

            e.target.value = value;
        });
    }

    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            // Remove non-digit characters
            let value = e.target.value.replace(/\D/g, '');

            // Limit to 3 digits
            if (value.length > 3) {
                value = value.slice(0, 3);
            }

            e.target.value = value;
        });
    }

    // Initialize
    renderSummaryItems();
    calculateOrderSummary();

    // Pre-fill shipping form if data exists
    const shippingInfo = JSON.parse(sessionStorage.getItem('shippingInfo'));
    if (shippingInfo) {
        document.getElementById('first-name').value = shippingInfo.firstName;
        document.getElementById('last-name').value = shippingInfo.lastName;
        document.getElementById('email').value = shippingInfo.email;
        document.getElementById('address').value = shippingInfo.address;
        document.getElementById('city').value = shippingInfo.city;
        document.getElementById('zip').value = shippingInfo.zip;
        document.getElementById('country').value = shippingInfo.country;
        document.getElementById('phone').value = shippingInfo.phone;
    }

    // Pre-fill payment form if data exists
    const paymentInfo = JSON.parse(sessionStorage.getItem('paymentInfo'));
    if (paymentInfo) {
        document.getElementById('card-name').value = paymentInfo.cardName;
        // Don't pre-fill sensitive payment information for security reasons
    }
});
