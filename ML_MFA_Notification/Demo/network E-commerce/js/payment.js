// Payment page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Theme Switcher Functionality
    const themeToggle = document.getElementById('theme-toggle');
    const themeOptions = document.getElementById('theme-options');
    const themeOptionElements = document.querySelectorAll('.theme-option');

    // Apply theme function
    function applyTheme(theme) {
        // First, remove all theme classes
        document.body.classList.remove('theme-white');

        // Then add the selected theme class if it's not the default dark theme
        if (theme) {
            document.body.classList.add(theme);
            // Update icon to moon for light mode (since we're switching to dark when clicked)
            if (theme === 'theme-white') {
                themeToggle.querySelector('i').classList.remove('fa-sun');
                themeToggle.querySelector('i').classList.add('fa-moon');
            }
        } else {
            // Update icon to sun for dark mode (since we're switching to light when clicked)
            themeToggle.querySelector('i').classList.remove('fa-moon');
            themeToggle.querySelector('i').classList.add('fa-sun');
        }

        // Update active state in theme options
        themeOptionElements.forEach(option => {
            option.classList.remove('active');
            if (option.getAttribute('data-theme') === theme) {
                option.classList.add('active');
            }
        });

        // Save theme preference
        localStorage.setItem('payment-theme', theme || '');

        console.log('Theme applied:', theme || 'dark (default)');
    }

    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('payment-theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    }

    // Toggle theme options panel
    themeToggle.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent event from bubbling up

        // Direct toggle between dark and light mode
        const currentTheme = document.body.classList.contains('theme-white') ? '' : 'theme-white';
        applyTheme(currentTheme);

        // Optional: still show the options panel for more control
        // themeOptions.classList.toggle('show');
    });

    // Close theme options when clicking outside
    document.addEventListener('click', function(event) {
        if (!themeOptions.contains(event.target)) {
            themeOptions.classList.remove('show');
        }
    });

    // Theme selection
    themeOptionElements.forEach(option => {
        option.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            applyTheme(theme);
            themeOptions.classList.remove('show');
        });
    });
    // Get cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Redirect to home if cart is empty
    if (cart.length === 0) {
        window.location.href = 'index.html';
    }

    // DOM Elements
    const savedCards = document.querySelectorAll('.saved-card');
    const paymentOptions = document.querySelectorAll('.payment-option');
    const unifiedPayButton = document.getElementById('unified-pay-button');
    const leftPanelPayButton = document.getElementById('left-panel-pay-button');
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    // Card form elements
    const cardNumberInput = document.getElementById('card-number');
    const cardHolderInput = document.getElementById('card-holder');
    const expiryDateInput = document.getElementById('expiry-date');
    const cvvInput = document.getElementById('cvv');

    // Card preview elements
    const cardNumberDisplay = document.querySelector('.card-number-display');
    const cardHolderDisplay = document.querySelector('.card-details .card-holder .value');
    const expiryDisplay = document.querySelector('.card-details .card-expiry .value');

    // Order summary elements
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryShipping = document.getElementById('summary-shipping');
    const summaryTax = document.getElementById('summary-tax');
    const summaryTotal = document.getElementById('summary-total');

    // Format price
    function formatPrice(price) {
        return '₹' + price.toFixed(2);
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

    // Select saved payment method
    function selectSavedCard(card) {
        // Remove active class from all cards
        savedCards.forEach(card => {
            card.classList.remove('active');
            const radioBtn = card.querySelector('.radio-btn');
            if (radioBtn) radioBtn.classList.remove('active');
        });

        // Remove active class from all payment options
        paymentOptions.forEach(option => {
            option.classList.remove('active');
            const radioBtn = option.querySelector('.radio-btn');
            if (radioBtn) radioBtn.classList.remove('active');
        });

        // Add active class to selected card
        card.classList.add('active');
        const radioBtn = card.querySelector('.radio-btn');
        if (radioBtn) radioBtn.classList.add('active');

        // Get payment method and ID
        const paymentMethod = card.getAttribute('data-payment-method');
        const paymentId = card.getAttribute('data-payment-id');
        console.log('Selected saved payment method:', paymentMethod, 'ID:', paymentId);

        // Set this payment method as default
        if (paymentId) {
            setDefaultPaymentMethod(paymentId);
        }

        // Show the appropriate payment form with smooth transition
        showPaymentForm(paymentMethod);

        // Update unified pay button based on payment method
        if (paymentMethod === 'paypal') {
            // Show PayPal button
            updateUnifiedPayButton('paypal', 'Pay with PayPal');
        } else if (paymentMethod === 'apple-pay') {
            // Show Apple Pay button and form
            updateUnifiedPayButton('apple-pay', 'Pay with Apple Pay');
        } else if (paymentMethod === 'google-pay') {
            // Show Google Pay button and form
            updateUnifiedPayButton('google-pay', 'Pay with Google Pay');
        } else {
            // Show credit card button and form
            updateUnifiedPayButton('credit-card', 'Pay with Card');
        }

        // Show the pay button
        if (unifiedPayButton) {
            unifiedPayButton.style.display = 'flex';

            // Add a subtle animation to draw attention to the pay button
            unifiedPayButton.classList.add('pulse-animation');
            setTimeout(() => {
                unifiedPayButton.classList.remove('pulse-animation');
            }, 1000);
        }
    }

    // Show PayPal Button
    function showPayPalButton() {
        // Hide regular pay button
        if (payButton) {
            payButton.style.display = 'none';
        }

        // Remove existing PayPal button if any
        const existingPayPalButton = document.getElementById('paypal-button');
        if (existingPayPalButton) {
            existingPayPalButton.remove();
        }

        // Remove existing Apple Pay button if any
        const existingApplePayButton = document.getElementById('apple-pay-button');
        if (existingApplePayButton) {
            existingApplePayButton.remove();
        }

        // Create PayPal button
        const paypalButton = document.createElement('button');
        paypalButton.id = 'paypal-button';
        paypalButton.className = 'paypal-button';
        paypalButton.innerHTML = '<img src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/checkout-logo-medium.png" alt="PayPal Checkout">';

        // Create button container
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'payment-action';
        buttonContainer.appendChild(paypalButton);

        // Replace the payment action section
        const paymentAction = document.querySelector('.payment-action');
        if (paymentAction) {
            paymentAction.parentNode.replaceChild(buttonContainer, paymentAction);
        } else {
            // If payment action doesn't exist, append to payment details panel
            const paymentDetailsPanel = document.querySelector('.payment-details-panel');
            if (paymentDetailsPanel) {
                paymentDetailsPanel.appendChild(buttonContainer);
            }
        }

        // Add event listener to PayPal button
        paypalButton.addEventListener('click', function() {
            // Redirect to PayPal
            redirectToPayPal();
        });
    }

    // Show Apple Pay Button
    function showApplePayButton() {
        // Hide regular pay button
        if (payButton) {
            payButton.style.display = 'none';
        }

        // Remove existing PayPal button if any
        const existingPayPalButton = document.getElementById('paypal-button');
        if (existingPayPalButton) {
            existingPayPalButton.remove();
        }

        // Remove existing Apple Pay button if any
        const existingApplePayButton = document.getElementById('apple-pay-button');
        if (existingApplePayButton) {
            existingApplePayButton.remove();
        }

        // Create Apple Pay button
        const applePayButton = document.createElement('button');
        applePayButton.id = 'apple-pay-button';
        applePayButton.className = 'apple-pay-button';
        applePayButton.innerHTML = '<i class="fab fa-apple"></i> Pay with Apple Pay';

        // Create button container
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'payment-action';
        buttonContainer.appendChild(applePayButton);

        // Replace the payment action section
        const paymentAction = document.querySelector('.payment-action');
        if (paymentAction) {
            paymentAction.parentNode.replaceChild(buttonContainer, paymentAction);
        } else {
            // If payment action doesn't exist, append to payment details panel
            const paymentDetailsPanel = document.querySelector('.payment-details-panel');
            if (paymentDetailsPanel) {
                paymentDetailsPanel.appendChild(buttonContainer);
            }
        }

        // Add event listener to Apple Pay button
        applePayButton.addEventListener('click', function() {
            // Initiate Apple Pay
            initiateApplePay();
        });
    }

    // Show Regular Payment Button
    function showRegularPaymentButton() {
        // Show regular pay button
        if (payButton) {
            payButton.style.display = 'block';
        }

        // Remove existing PayPal button if any
        const existingPayPalButton = document.getElementById('paypal-button');
        if (existingPayPalButton) {
            existingPayPalButton.remove();
        }

        // Remove existing Apple Pay button if any
        const existingApplePayButton = document.getElementById('apple-pay-button');
        if (existingApplePayButton) {
            existingApplePayButton.remove();
        }
    }

    // Redirect to PayPal
    function redirectToPayPal() {
        // Get total amount
        const amount = parseFloat(summaryTotal.textContent.replace('$', ''));

        // Show loading overlay
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-text">Redirecting to PayPal...</div>
        `;
        document.body.appendChild(loadingOverlay);

        // Simulate redirect to PayPal
        setTimeout(() => {
            // In a real implementation, you would redirect to PayPal's checkout page
            window.open('https://www.paypal.com/checkoutnow', '_blank');

            // Remove loading overlay
            loadingOverlay.remove();
        }, 1500);
    }

    // Initiate Apple Pay
    function initiateApplePay() {
        // Get total amount
        const amount = parseFloat(summaryTotal.textContent.replace('$', ''));

        // Show Apple Pay sheet
        const applePaySheet = document.createElement('div');
        applePaySheet.className = 'apple-pay-sheet';
        applePaySheet.innerHTML = `
            <div class="apple-pay-sheet-content">
                <div class="apple-pay-sheet-header">
                    <div class="apple-pay-logo">
                        <i class="fab fa-apple"></i> Pay
                    </div>
                    <button class="apple-pay-close-btn">&times;</button>
                </div>
                <div class="apple-pay-sheet-body">
                    <div class="apple-pay-amount">$${amount.toFixed(2)}</div>
                    <div class="apple-pay-merchant">ShopEasy Store</div>
                    <div class="apple-pay-device">
                        <i class="fas fa-mobile-alt"></i> Pay with Touch ID
                    </div>
                    <div class="apple-pay-button-container">
                        <button class="apple-pay-confirm-button">
                            <i class="fab fa-apple"></i> Pay
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(applePaySheet);

        // Add event listener to close button
        const closeBtn = applePaySheet.querySelector('.apple-pay-close-btn');
        closeBtn.addEventListener('click', function() {
            applePaySheet.remove();
        });

        // Add event listener to confirm button
        const confirmBtn = applePaySheet.querySelector('.apple-pay-confirm-button');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', function() {
                // Show processing state
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                this.disabled = true;

                // Simulate Apple Pay processing
                simulateApplePayProcessing(applePaySheet);
            });
        }

        // Function to simulate Apple Pay processing
        function simulateApplePayProcessing(sheet) {
            setTimeout(() => {
                // Show success message
                sheet.innerHTML = `
                    <div class="apple-pay-sheet-content">
                        <div class="apple-pay-sheet-header">
                            <div class="apple-pay-logo">
                                <i class="fab fa-apple"></i> Pay
                            </div>
                            <button class="apple-pay-close-btn">&times;</button>
                        </div>
                        <div class="apple-pay-sheet-body">
                            <div class="apple-pay-success">
                                <i class="fas fa-check-circle"></i>
                                <div>Payment Successful</div>
                            </div>
                        </div>
                    </div>
                `;

                // Add event listener to close button
                const closeBtn = sheet.querySelector('.apple-pay-close-btn');
                closeBtn.addEventListener('click', function() {
                    sheet.remove();

                    // Redirect to confirmation page
                    window.location.href = 'confirmation.html';
                });

                // Auto redirect after 2 seconds
                setTimeout(() => {
                    sheet.remove();
                    window.location.href = 'confirmation.html';
                }, 2000);
            }, 2000);
        }
    }

    // Select payment option
    function selectPaymentOption(option) {
        // Remove active class from all options
        paymentOptions.forEach(opt => {
            opt.classList.remove('active');
            const radioBtn = opt.querySelector('.radio-btn');
            if (radioBtn) radioBtn.classList.remove('active');
        });

        // Remove active class from all saved cards
        savedCards.forEach(card => {
            card.classList.remove('active');
            const radioBtn = card.querySelector('.radio-btn');
            if (radioBtn) radioBtn.classList.remove('active');
        });

        // Add active class to selected option with a smooth transition
        option.classList.add('active');
        const radioBtn = option.querySelector('.radio-btn');
        if (radioBtn) radioBtn.classList.add('active');

        // Add a subtle highlight effect
        option.classList.add('highlight-effect');
        setTimeout(() => {
            option.classList.remove('highlight-effect');
        }, 700);

        // Get payment method name for display
        const paymentMethodNameElement = option.querySelector('.option-name');
        if (!paymentMethodNameElement) {
            console.error('Payment method name element not found');
            return;
        }

        const paymentMethodName = paymentMethodNameElement.textContent;
        console.log('Selected payment method:', paymentMethodName);

        // Determine payment method type
        let paymentMethod;
        if (paymentMethodName === 'Credit/Debit Cards') {
            paymentMethod = 'credit-card';
        } else if (paymentMethodName === 'Apple Pay') {
            paymentMethod = 'apple-pay';
        } else if (paymentMethodName === 'PayPal') {
            paymentMethod = 'paypal';
        } else if (paymentMethodName === 'Google Pay') {
            paymentMethod = 'google-pay';
        } else if (paymentMethodName === 'Bank Transfer') {
            paymentMethod = 'bank-transfer';
        } else if (paymentMethodName === 'Buy Now Pay Later') {
            paymentMethod = 'buy-now-pay-later';
        } else if (paymentMethodName === 'Cryptocurrency') {
            paymentMethod = 'cryptocurrency';
        } else if (paymentMethodName === 'Cash on Delivery') {
            paymentMethod = 'cash-delivery';
        } else if (paymentMethodName === 'PhonePe') {
            paymentMethod = 'phonepe';
        } else {
            paymentMethod = 'credit-card'; // Default
        }

        // Show the appropriate payment form with smooth transition
        showPaymentForm(paymentMethod);

        // Update unified pay button based on payment method
        if (paymentMethod === 'credit-card') {
            updateUnifiedPayButton('credit-card', 'Pay with Credit Card');

            // Focus on the first input field in credit card form
            const creditCardForm = document.getElementById('credit-card-form');
            if (creditCardForm && creditCardForm.classList.contains('active')) {
                const firstInput = creditCardForm.querySelector('input');
                if (firstInput) {
                    setTimeout(() => {
                        firstInput.focus();
                    }, 300); // Increased delay for better UX
                }
            }
        } else if (paymentMethod === 'apple-pay') {
            updateUnifiedPayButton('apple-pay', 'Pay with Apple Pay');
        } else if (paymentMethod === 'paypal') {
            updateUnifiedPayButton('paypal', 'Pay with PayPal');
        } else if (paymentMethod === 'google-pay') {
            updateUnifiedPayButton('google-pay', 'Pay with Google Pay');
        } else if (paymentMethod === 'bank-transfer') {
            updateUnifiedPayButton('bank-transfer', 'Confirm Bank Transfer');
        } else if (paymentMethod === 'cash-delivery') {
            updateUnifiedPayButton('cash-delivery', 'Confirm Cash on Delivery');
        } else if (paymentMethod === 'buy-now-pay-later') {
            updateUnifiedPayButton('buy-now-pay-later', 'Continue with Buy Now Pay Later');
        } else if (paymentMethod === 'cryptocurrency') {
            updateUnifiedPayButton('cryptocurrency', 'Confirm Cryptocurrency Payment');
        } else if (paymentMethod === 'phonepe') {
            updateUnifiedPayButton('phonepe', 'Pay with PhonePe');
        } else {
            updateUnifiedPayButton('default', 'Complete Payment');
        }

        // Show the pay button with animation
        if (unifiedPayButton) {
            unifiedPayButton.style.display = 'flex';

            // Add a subtle animation to draw attention to the pay button
            unifiedPayButton.classList.add('pulse-animation');
            setTimeout(() => {
                unifiedPayButton.classList.remove('pulse-animation');
            }, 1000);
        }

        // Show a subtle notification to guide the user
        showNotification('info', 'Payment Method Selected', `${paymentMethodName} selected. Please complete your payment details.`, 3000);
    }

    // Update unified pay button
    function updateUnifiedPayButton(paymentType, buttonText) {
        if (!unifiedPayButton) return;

        console.log('Updating unified pay button for:', paymentType, buttonText);

        // Remove all payment type classes
        unifiedPayButton.classList.remove('apple-pay', 'paypal', 'credit-card', 'google-pay', 'phonepe', 'bank-transfer', 'cash-delivery', 'buy-now-pay-later', 'cryptocurrency', 'default');

        // Add the specific payment type class
        unifiedPayButton.classList.add(paymentType);

        // Update button text
        const payWithText = unifiedPayButton.querySelector('.pay-with-text');
        if (payWithText) {
            payWithText.textContent = buttonText;
        }

        // Make sure the left panel pay button is hidden
        if (leftPanelPayButton) {
            leftPanelPayButton.style.display = 'none';
        }

        // Make sure the right panel pay button is visible
        if (unifiedPayButton) {
            unifiedPayButton.style.display = 'flex';

            // Add a subtle animation to draw attention to the button
            unifiedPayButton.classList.add('pulse-animation');
            setTimeout(() => {
                unifiedPayButton.classList.remove('pulse-animation');
            }, 1000);
        }

        // Remove any existing click event handlers
        unifiedPayButton.onclick = null;

        // Add the handlePaymentProcess as the click handler
        // This will determine the correct payment method to use
        unifiedPayButton.onclick = handlePaymentProcess;
    }

    // Format card number with spaces
    function formatCardNumber(value) {
        // Remove non-digit characters
        const cleanValue = value.replace(/\D/g, '');

        // Add space after every 4 digits
        const formattedValue = cleanValue.replace(/(\d{4})(?=\d)/g, '$1 ');

        return formattedValue;
    }

    // Format expiry date (MM/YY)
    function formatExpiryDate(value) {
        // Remove non-digit characters
        const cleanValue = value.replace(/\D/g, '');

        // Add slash after 2 digits
        if (cleanValue.length > 2) {
            return cleanValue.slice(0, 2) + '/' + cleanValue.slice(2);
        }

        return cleanValue;
    }

    // Update card preview
    function updateCardPreview() {
        // Update card number display
        if (cardNumberInput.value) {
            const formattedNumber = cardNumberInput.value.replace(/\d(?=\d{4})/g, '•');
            cardNumberDisplay.textContent = formattedNumber;
        } else {
            cardNumberDisplay.textContent = '•••• •••• •••• ••••';
        }

        // Update card holder display
        if (cardHolderInput.value) {
            cardHolderDisplay.textContent = cardHolderInput.value.toUpperCase();
        } else {
            cardHolderDisplay.textContent = 'EXAMPLE NAME';
        }

        // Update expiry date display
        if (expiryDateInput.value) {
            expiryDisplay.textContent = expiryDateInput.value;
        } else {
            expiryDisplay.textContent = 'MM/YY';
        }
    }

    // Validate card form
    function validateCardForm(showErrors = false) {
        // Check if a saved card is selected - if so, no need to validate the form
        const selectedSavedCard = document.querySelector('.saved-card.active');
        if (selectedSavedCard) {
            return true;
        }

        // Check if a payment option is selected that's not Credit/Debit Cards
        const selectedPaymentOption = document.querySelector('.payment-option.active');
        if (selectedPaymentOption) {
            const paymentMethodNameElement = selectedPaymentOption.querySelector('.option-name');
            if (paymentMethodNameElement && paymentMethodNameElement.textContent !== 'Credit/Debit Cards') {
                return true;
            }
        }

        // If Credit/Debit Cards is selected or no option is selected, validate the card form
        let isValid = true;
        let errorMessages = [];
        let firstInvalidField = null;

        // Validate card number (16 digits)
        if (cardNumberInput) {
            const cardNumber = cardNumberInput.value.replace(/\s/g, '');
            if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
                cardNumberInput.classList.add('error');
                // Add shake animation for visual feedback
                cardNumberInput.classList.add('shake-animation');
                setTimeout(() => {
                    cardNumberInput.classList.remove('shake-animation');
                }, 500);

                isValid = false;
                errorMessages.push('Please enter a valid 16-digit card number.');
                if (!firstInvalidField) firstInvalidField = cardNumberInput;
            } else {
                cardNumberInput.classList.remove('error');
                // Add success animation
                cardNumberInput.classList.add('success-animation');
                setTimeout(() => {
                    cardNumberInput.classList.remove('success-animation');
                }, 500);
            }
        } else {
            isValid = false;
            errorMessages.push('Card number field not found.');
        }

        // Validate card holder (not empty)
        if (cardHolderInput) {
            if (!cardHolderInput.value.trim()) {
                cardHolderInput.classList.add('error');
                // Add shake animation for visual feedback
                cardHolderInput.classList.add('shake-animation');
                setTimeout(() => {
                    cardHolderInput.classList.remove('shake-animation');
                }, 500);

                isValid = false;
                errorMessages.push('Please enter the cardholder name.');
                if (!firstInvalidField) firstInvalidField = cardHolderInput;
            } else {
                cardHolderInput.classList.remove('error');
                // Add success animation
                cardHolderInput.classList.add('success-animation');
                setTimeout(() => {
                    cardHolderInput.classList.remove('success-animation');
                }, 500);
            }
        } else {
            isValid = false;
            errorMessages.push('Cardholder field not found.');
        }

        // Validate expiry date (MM/YY format)
        if (expiryDateInput) {
            const expiryDate = expiryDateInput.value;
            if (!expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
                expiryDateInput.classList.add('error');
                // Add shake animation for visual feedback
                expiryDateInput.classList.add('shake-animation');
                setTimeout(() => {
                    expiryDateInput.classList.remove('shake-animation');
                }, 500);

                isValid = false;
                errorMessages.push('Please enter a valid expiry date (MM/YY).');
                if (!firstInvalidField) firstInvalidField = expiryDateInput;
            } else {
                expiryDateInput.classList.remove('error');
                // Add success animation
                expiryDateInput.classList.add('success-animation');
                setTimeout(() => {
                    expiryDateInput.classList.remove('success-animation');
                }, 500);
            }
        } else {
            isValid = false;
            errorMessages.push('Expiry date field not found.');
        }

        // Validate CVV (3 or 4 digits)
        if (cvvInput) {
            const cvv = cvvInput.value;
            if (!cvv.match(/^\d{3,4}$/)) {
                cvvInput.classList.add('error');
                // Add shake animation for visual feedback
                cvvInput.classList.add('shake-animation');
                setTimeout(() => {
                    cvvInput.classList.remove('shake-animation');
                }, 500);

                isValid = false;
                errorMessages.push('Please enter a valid 3 or 4 digit CVV code.');
                if (!firstInvalidField) firstInvalidField = cvvInput;
            } else {
                cvvInput.classList.remove('error');
                // Add success animation
                cvvInput.classList.add('success-animation');
                setTimeout(() => {
                    cvvInput.classList.remove('success-animation');
                }, 500);
            }
        } else {
            isValid = false;
            errorMessages.push('CVV field not found.');
        }

        // Show error notification if requested and there are errors
        if (showErrors && !isValid && errorMessages.length > 0) {
            showNotification('error', 'Card Validation Failed', errorMessages.join('<br>'));

            // Focus on the first invalid field
            if (firstInvalidField) {
                setTimeout(() => {
                    firstInvalidField.focus();
                }, 500);
            }

            // Highlight the credit card form
            const creditCardForm = document.getElementById('credit-card-form');
            if (creditCardForm) {
                creditCardForm.classList.add('highlight-form');
                setTimeout(() => {
                    creditCardForm.classList.remove('highlight-form');
                }, 2000);
            }
        } else if (isValid && showErrors) {
            // Show success notification if all validations pass
            showNotification('success', 'Card Validation Successful', 'Your card details have been validated successfully.');
        }

        return isValid;
    }

    // Show notification
    function showNotification(type, title, message, duration = 5000) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;

        // Set notification content
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas ${type === 'error' ? 'fa-exclamation-circle' :
                               type === 'success' ? 'fa-check-circle' :
                               type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close">&times;</button>
        `;

        // Add notification to container
        const container = document.getElementById('notification-container');
        container.appendChild(notification);

        // Show notification with animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Add close button event listener
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
            }, 500);
        });

        // Auto-remove notification after duration
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.add('fade-out');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 500);
            }
        }, duration);

        return notification;
    }

    // Process payment
    function processPayment() {
        // Check if Credit/Debit Cards is selected and validate form
        const selectedOption = document.querySelector('.payment-option.active');
        if (selectedOption &&
            selectedOption.querySelector('.option-name').textContent === 'Credit/Debit Cards') {

            // Validate card details
            if (!validateCardForm(true)) {
                showNotification('error', 'Invalid Card Details', 'Please fill in all required card details correctly.');
                return;
            }
        }

        // Show loading state
        const clickedButton = document.activeElement;
        if (clickedButton && clickedButton.classList.contains('pay-button')) {
            clickedButton.textContent = 'Processing...';
            clickedButton.disabled = true;
        }

        // Show success notification
        showNotification('success', 'Payment Initiated', 'Your payment is being processed...');

        // Simulate payment processing
        setTimeout(() => {
            // Redirect to confirmation page
            window.location.href = 'confirmation.html';
        }, 2000);
    }

    // Event listeners for saved cards
    savedCards.forEach(card => {
        card.addEventListener('click', function() {
            selectSavedCard(this);

            // Always show payment options section for all payment methods
            const paymentOptionsSection = document.querySelector('.payment-options-section');
            if (paymentOptionsSection) {
                paymentOptionsSection.style.display = 'block';
            }
        });
    });

    // Event listeners for payment options
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Clear all active states first to prevent multiple selections
            const allSavedCards = document.querySelectorAll('.saved-card');
            const allPaymentOptions = document.querySelectorAll('.payment-option');

            // Remove active class from all cards and options
            allSavedCards.forEach(card => {
                card.classList.remove('active');
                const radioBtn = card.querySelector('.radio-btn');
                if (radioBtn) radioBtn.classList.remove('active');
            });

            allPaymentOptions.forEach(option => {
                option.classList.remove('active');
                const radioBtn = option.querySelector('.radio-btn');
                if (radioBtn) radioBtn.classList.remove('active');
            });

            // Now select the clicked option
            selectPaymentOption(this);
        });
    });

    // Event listeners for card form inputs
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            // Format card number with spaces
            const formattedValue = formatCardNumber(e.target.value);

            // Limit to 19 characters (16 digits + 3 spaces)
            if (formattedValue.length <= 19) {
                e.target.value = formattedValue;
            } else {
                e.target.value = formattedValue.slice(0, 19);
            }

            // Update card preview
            updateCardPreview();
        });
    }

    if (cardHolderInput) {
        cardHolderInput.addEventListener('input', function() {
            updateCardPreview();
        });
    }

    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', function(e) {
            // Format expiry date (MM/YY)
            const formattedValue = formatExpiryDate(e.target.value);

            // Limit to 5 characters (MM/YY)
            if (formattedValue.length <= 5) {
                e.target.value = formattedValue;
            } else {
                e.target.value = formattedValue.slice(0, 5);
            }

            // Update card preview
            updateCardPreview();
        });
    }

    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            // Remove non-digit characters
            const cleanValue = e.target.value.replace(/\D/g, '');

            // Limit to 4 digits
            if (cleanValue.length <= 4) {
                e.target.value = cleanValue;
            } else {
                e.target.value = cleanValue.slice(0, 4);
            }
        });
    }

    // QR Code Payment Modal Elements
    const qrPaymentModal = document.getElementById('qr-payment-modal');
    const closeQrModal = document.getElementById('close-qr-modal');
    const cancelPaymentBtn = document.getElementById('cancel-payment-btn');
    const checkPaymentBtn = document.getElementById('check-payment-btn');
    const qrPaymentIcon = document.getElementById('qr-payment-icon');
    const qrPaymentName = document.getElementById('qr-payment-name');
    const qrPaymentAmount = document.getElementById('qr-payment-amount');
    const qrCodeContainer = document.getElementById('qr-code');
    const timerMinutes = document.getElementById('timer-minutes');
    const timerSeconds = document.getElementById('timer-seconds');
    const timerCircle = document.getElementById('timer-circle');
    const qrPaymentStatus = document.getElementById('qr-payment-status');

    // PhonePe Modal Elements
    const phonepayModal = document.getElementById('phonepay-modal');
    const closePhonepayModal = document.getElementById('close-phonepay-modal');
    const cancelPhonepayBtn = document.getElementById('cancel-phonepay-btn');
    const proceedPhonepayBtn = document.getElementById('proceed-phonepay-btn');
    const phonepayAmount = document.getElementById('phonepay-amount');

    // PhonePe Form Elements
    const phonepeOptions = document.querySelectorAll('.phonepe-option');
    const proceedPhonepeBtn = document.getElementById('proceed-phonepe-payment');

    // Database Status Element
    const dbStatus = document.getElementById('db-status');

    // Generate QR Code
    function generateQRCode(data) {
        // Clear previous QR code
        qrCodeContainer.innerHTML = '';

        try {
            // Create QR code with error handling
            const qr = qrcode(0, 'M');
            qr.addData(data);
            qr.make();

            // Append QR code to container with enhanced styling
            const qrImg = qr.createImgTag(5);
            qrCodeContainer.innerHTML = qrImg;

            // Add a loading animation first
            qrCodeContainer.classList.add('qr-loading');

            // Get the image element
            const imgElement = qrCodeContainer.querySelector('img');
            if (imgElement) {
                // Add event listeners for load and error
                imgElement.onload = function() {
                    qrCodeContainer.classList.remove('qr-loading');
                    qrCodeContainer.classList.add('qr-loaded');

                    // Add a subtle animation to draw attention to the QR code
                    setTimeout(() => {
                        imgElement.classList.add('qr-pulse');
                    }, 300);
                };

                imgElement.onerror = function() {
                    // Handle error - show fallback
                    qrCodeContainer.classList.remove('qr-loading');
                    qrCodeContainer.innerHTML = `
                        <div class="qr-error">
                            <i class="fas fa-exclamation-triangle"></i>
                            <p>Failed to generate QR code</p>
                            <button class="retry-qr-btn">Retry</button>
                        </div>
                    `;

                    // Add event listener to retry button
                    const retryBtn = qrCodeContainer.querySelector('.retry-qr-btn');
                    if (retryBtn) {
                        retryBtn.addEventListener('click', function() {
                            generateQRCode(data);
                        });
                    }
                };

                // Add styling to the image
                imgElement.style.borderRadius = '8px';
                imgElement.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            }
        } catch (error) {
            console.error('Error generating QR code:', error);

            // Show error message
            qrCodeContainer.innerHTML = `
                <div class="qr-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Failed to generate QR code</p>
                    <button class="retry-qr-btn">Retry</button>
                </div>
            `;

            // Add event listener to retry button
            const retryBtn = qrCodeContainer.querySelector('.retry-qr-btn');
            if (retryBtn) {
                retryBtn.addEventListener('click', function() {
                    generateQRCode(data);
                });
            }
        }
    }

    // Start QR Code Timer
    function startQRCodeTimer(duration) {
        let timer = duration;
        let minutes, seconds;
        let interval;

        // Calculate the circumference of the circle
        const circumference = 2 * Math.PI * 54;
        timerCircle.style.strokeDasharray = circumference;

        interval = setInterval(function() {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            timerMinutes.textContent = minutes;
            timerSeconds.textContent = seconds;

            // Update the circle
            const progress = timer / duration;
            const dashoffset = circumference * (1 - progress);
            timerCircle.style.strokeDashoffset = dashoffset;

            if (--timer < 0) {
                clearInterval(interval);
                // QR code expired
                qrPaymentStatus.innerHTML = `
                    <div class="status-icon">
                        <i class="fas fa-exclamation-circle" style="color: #dc3545;"></i>
                    </div>
                    <div class="status-text">QR code expired. Please try again.</div>
                `;
            }
        }, 1000);

        // Return the interval ID so it can be cleared if needed
        return interval;
    }

    // Show QR Payment Modal
    function showQRPaymentModal(paymentMethod, amount) {
        // Set payment method info
        qrPaymentName.textContent = paymentMethod;
        qrPaymentAmount.textContent = formatPrice(amount);

        // Set payment method icon
        if (paymentMethod === 'Credit/Debit Cards') {
            qrPaymentIcon.innerHTML = '<i class="far fa-credit-card"></i>';
        } else if (paymentMethod === 'PhonePay') {
            qrPaymentIcon.innerHTML = '<i class="fas fa-mobile-alt"></i>';
        } else if (paymentMethod === 'Cryptocurrency') {
            qrPaymentIcon.innerHTML = '<i class="fab fa-bitcoin"></i>';
        } else {
            qrPaymentIcon.innerHTML = '<i class="fas fa-money-bill-wave"></i>';
        }

        // Generate QR code with payment info
        const paymentData = {
            method: paymentMethod,
            amount: amount,
            orderId: 'ORD-' + Date.now(),
            timestamp: new Date().toISOString()
        };

        generateQRCode(JSON.stringify(paymentData));

        // Reset payment status
        qrPaymentStatus.innerHTML = `
            <div class="status-icon">
                <i class="fas fa-spinner fa-spin"></i>
            </div>
            <div class="status-text">Waiting for payment...</div>
        `;

        // Show modal
        qrPaymentModal.classList.add('show');

        // Start timer (5 minutes)
        const timerInterval = startQRCodeTimer(5 * 60);

        // Store the timer interval ID
        qrPaymentModal.dataset.timerInterval = timerInterval;

        // Simulate database connection
        setTimeout(() => {
            dbStatus.classList.add('show', 'connected');
            setTimeout(() => {
                dbStatus.classList.remove('show');
            }, 3000);
        }, 1000);
    }

    // Show PhonePay Modal
    function showPhonePay(amount) {
        // Set amount
        phonepayAmount.textContent = formatPrice(amount);

        // Show modal
        phonepayModal.classList.add('show');
    }

    // Close QR Payment Modal
    function closeQRPaymentModal() {
        // Clear timer interval
        clearInterval(qrPaymentModal.dataset.timerInterval);

        // Hide modal
        qrPaymentModal.classList.remove('show');
    }

    // Close PhonePay Modal
    function closePhonePay() {
        phonepayModal.classList.remove('show');
    }

    // Event Listeners for QR Payment Modal
    if (closeQrModal) {
        closeQrModal.addEventListener('click', closeQRPaymentModal);
    }

    if (cancelPaymentBtn) {
        cancelPaymentBtn.addEventListener('click', closeQRPaymentModal);
    }

    if (checkPaymentBtn) {
        checkPaymentBtn.addEventListener('click', function() {
            // Simulate payment verification
            qrPaymentStatus.innerHTML = `
                <div class="status-icon">
                    <i class="fas fa-spinner fa-spin"></i>
                </div>
                <div class="status-text">Verifying payment...</div>
            `;

            setTimeout(() => {
                // Simulate successful payment
                qrPaymentStatus.innerHTML = `
                    <div class="status-icon">
                        <i class="fas fa-check-circle" style="color: #28a745;"></i>
                    </div>
                    <div class="status-text">Payment successful!</div>
                `;

                // Redirect to confirmation page after 2 seconds
                setTimeout(() => {
                    window.location.href = 'confirmation.html';
                }, 2000);
            }, 2000);
        });
    }

    // Event Listeners for PhonePay Modal
    if (closePhonepayModal) {
        closePhonepayModal.addEventListener('click', closePhonePay);
    }

    if (cancelPhonepayBtn) {
        cancelPhonepayBtn.addEventListener('click', closePhonePay);
    }

    if (proceedPhonepayBtn) {
        proceedPhonepayBtn.addEventListener('click', function() {
            // Update amount in the modal
            if (phonepayAmount) {
                const amount = summaryTotal.textContent;
                phonepayAmount.textContent = amount;
            }

            // Process PhonePe payment
            processPhonePePayment();

            // Close the modal
            closePhonePay();
        });
    }

    // Centralized payment processing function
    function handlePaymentProcess(event) {
        // Prevent default button behavior
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        // Add visual feedback to the clicked button
        const clickedButton = event.target.closest('button') || event.target;
        let originalText = '';

        if (clickedButton && clickedButton.classList.contains('pay-button')) {
            // Add a pressed effect
            clickedButton.classList.add('button-pressed');

            // Store the original text
            originalText = clickedButton.innerHTML;

            // Show loading state
            clickedButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        }

        // Log which button was clicked
        console.log('Pay button clicked:', event.target.id);

        // Check if a saved card is selected
        const selectedSavedCard = document.querySelector('.saved-card.active');

        // Get selected payment option
        const selectedPaymentOption = document.querySelector('.payment-option.active');

        // If no payment method is selected, show error
        if (!selectedSavedCard && !selectedPaymentOption) {
            showNotification('error', 'No Payment Method Selected', 'Please select a payment method before proceeding.');

            // Highlight payment sections to guide the user
            const savedMethodsSection = document.querySelector('.saved-methods-section');
            const paymentOptionsSection = document.querySelector('.payment-options-section');

            if (savedMethodsSection) {
                savedMethodsSection.classList.add('highlight-section');
                setTimeout(() => {
                    savedMethodsSection.classList.remove('highlight-section');
                }, 2000);
            }

            if (paymentOptionsSection) {
                setTimeout(() => {
                    paymentOptionsSection.classList.add('highlight-section');
                    setTimeout(() => {
                        paymentOptionsSection.classList.remove('highlight-section');
                    }, 2000);
                }, 500);
            }

            // Restore button state
            if (clickedButton && clickedButton.classList.contains('pay-button')) {
                clickedButton.classList.remove('button-pressed');
                clickedButton.innerHTML = originalText;
            }

            return;
        }

        // Determine which payment method is active
        let activePaymentMethod = '';
        let activePaymentMethodName = '';

        if (selectedSavedCard) {
            activePaymentMethod = selectedSavedCard.getAttribute('data-payment-method');
            activePaymentMethodName = selectedSavedCard.querySelector('.card-name').textContent;
        } else if (selectedPaymentOption) {
            const optionNameElement = selectedPaymentOption.querySelector('.option-name');
            if (optionNameElement) {
                activePaymentMethodName = optionNameElement.textContent;

                // Convert name to method ID
                switch(activePaymentMethodName) {
                    case 'Credit/Debit Cards': activePaymentMethod = 'credit-card'; break;
                    case 'Apple Pay': activePaymentMethod = 'apple-pay'; break;
                    case 'PayPal': activePaymentMethod = 'paypal'; break;
                    case 'Google Pay': activePaymentMethod = 'google-pay'; break;
                    case 'Bank Transfer': activePaymentMethod = 'bank-transfer'; break;
                    case 'Buy Now Pay Later': activePaymentMethod = 'buy-now-pay-later'; break;
                    case 'Cryptocurrency': activePaymentMethod = 'cryptocurrency'; break;
                    case 'Cash on Delivery': activePaymentMethod = 'cash-delivery'; break;
                    case 'PhonePe': activePaymentMethod = 'phonepe'; break;
                    default: activePaymentMethod = 'credit-card';
                }
            }
        }

        console.log('Active payment method:', activePaymentMethod);

        // Check if credit card form needs validation
        if (activePaymentMethod === 'credit-card') {
            if (!validateCardForm(true)) {
                // Error notification is shown by validateCardForm

                // Restore button state
                if (clickedButton && clickedButton.classList.contains('pay-button')) {
                    clickedButton.classList.remove('button-pressed');
                    clickedButton.innerHTML = originalText;
                }

                return;
            }
        }

        // Process payment with a slight delay for better UX
        setTimeout(() => {
            // Process based on the active payment method
            switch(activePaymentMethod) {
                case 'paypal':
                    console.log('Redirecting to PayPal...');
                    redirectToPayPal();
                    break;

                case 'apple-pay':
                    console.log('Initiating Apple Pay...');
                    initiateApplePay();
                    break;

                case 'google-pay':
                    console.log('Initiating Google Pay...');
                    processGooglePay();
                    break;

                case 'phonepe':
                    console.log('Processing PhonePe payment...');
                    processPhonePePayment();
                    break;

                case 'bank-transfer':
                    console.log('Processing bank transfer...');
                    processBankTransfer();
                    break;

                case 'cash-delivery':
                    console.log('Processing cash on delivery...');
                    processCashOnDelivery();
                    break;

                case 'buy-now-pay-later':
                    console.log('Processing buy now pay later...');
                    processBuyNowPayLater();
                    break;

                case 'cryptocurrency':
                    console.log('Processing cryptocurrency payment...');
                    processCryptocurrencyPayment();
                    break;

                case 'credit-card':
                default:
                    console.log('Processing credit card payment...');
                    processPayment();
                    break;
            }

            // Show a success notification
            showNotification('success', 'Payment Processing', `Your ${activePaymentMethodName} payment is being processed...`);

        }, 500);
    }

    // Process Google Pay payment
    function processGooglePay() {
        // Redirect to the standalone Google Pay page
        window.location.href = 'google-pay.html';
    }

    // Generic function to start payment QR timer
    function startPaymentQRTimer(timerElementId, modalElement, qrCodeContainerId, refreshFunction) {
        const timerElement = document.getElementById(timerElementId);
        if (!timerElement) return;

        let timeLeft = 5 * 60; // 5 minutes in seconds

        const timerInterval = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;

            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);

                // Show expired message
                const qrContainer = document.getElementById(qrCodeContainerId);
                if (qrContainer) {
                    qrContainer.innerHTML = `
                        <div class="payment-qr-error">
                            <i class="fas fa-exclamation-circle"></i>
                            <p>QR code has expired</p>
                            <button class="payment-qr-retry" id="refresh-${qrCodeContainerId}">Generate New QR</button>
                        </div>
                    `;

                    // Add event listener to refresh button
                    const refreshBtn = document.getElementById(`refresh-${qrCodeContainerId}`);
                    if (refreshBtn) {
                        refreshBtn.addEventListener('click', () => {
                            refreshFunction();

                            // Remove the current modal
                            modalElement.classList.remove('show');
                            setTimeout(() => {
                                modalElement.remove();
                            }, 300);
                        });
                    }
                }
            }

            timeLeft--;
        }, 1000);

        // Store the interval ID to clear it if needed
        modalElement.dataset.timerInterval = timerInterval;
    }

    // Event listener for all pay buttons
    const payButtons = document.querySelectorAll('.pay-button');
    console.log('Found pay buttons:', payButtons.length);

    payButtons.forEach(button => {
        console.log('Adding event listener to button:', button.id);
        button.addEventListener('click', handlePaymentProcess);
    });

    // Update cart count
    function updateCartCount() {
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCountElement.textContent = totalItems;
        }
    }

    // Initialize accordion functionality
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            // Toggle active class on header
            this.classList.toggle('active');

            // Toggle active class on content
            const content = this.nextElementSibling;
            content.classList.toggle('active');

            // Close other accordions
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== this) {
                    otherHeader.classList.remove('active');
                    otherHeader.nextElementSibling.classList.remove('active');
                }
            });
        });
    });

    // Open first accordion by default
    if (accordionHeaders.length > 0) {
        accordionHeaders[0].classList.add('active');
        accordionHeaders[0].nextElementSibling.classList.add('active');
    }

    // Process generic payment
    function processPayment() {
        // Get current payment method
        const currentPaymentMethod = getCurrentPaymentMethod();

        // Get total amount
        const amount = parseFloat(summaryTotal.textContent.replace('$', ''));

        // Generate transaction ID
        const transactionId = generateTransactionId();

        // Get current date
        const currentDate = new Date().toLocaleDateString();

        // Show loading overlay
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-text">Processing payment...</div>
        `;
        document.body.appendChild(loadingOverlay);

        // Simulate payment processing
        setTimeout(() => {
            // Show enhanced confirmation screen
            loadingOverlay.innerHTML = createConfirmationScreen({
                type: currentPaymentMethod,
                title: 'Payment Successful',
                message: 'Your payment has been processed successfully.',
                details: [
                    { label: 'Amount', value: '$' + amount.toFixed(2) },
                    { label: 'Transaction ID', value: transactionId },
                    { label: 'Date', value: currentDate },
                    { label: 'Payment Method', value: getPaymentMethodTypeName(currentPaymentMethod) }
                ],
                note: 'A receipt has been sent to your email address. Thank you for your purchase!',
                buttonText: 'Continue to Order Confirmation'
            });

            // Add event listener to continue button (redundant with inline onclick, but added for robustness)
            setTimeout(() => {
                const continueButton = document.getElementById('confirmation-continue-btn');
                if (continueButton) {
                    continueButton.addEventListener('click', function() {
                        window.location.href = 'confirmation.html';
                    });

                    // Make sure the button is visible and clickable
                    continueButton.style.pointerEvents = 'auto';
                    continueButton.style.opacity = '1';

                    // Log for debugging
                    console.log('Continue button event listener attached');
                }
            }, 100); // Small delay to ensure DOM is updated
        }, 2000);
    }

    // Get current payment method
    function getCurrentPaymentMethod() {
        // Check if a payment option is selected
        const selectedOption = document.querySelector('.payment-option.active');
        if (selectedOption) {
            const paymentMethodName = selectedOption.querySelector('.option-name').textContent;

            // Map payment method name to type
            if (paymentMethodName === 'Credit/Debit Cards') {
                return 'credit-card';
            } else if (paymentMethodName === 'Apple Pay') {
                return 'apple-pay';
            } else if (paymentMethodName === 'PayPal') {
                return 'paypal';
            } else if (paymentMethodName === 'Google Pay') {
                return 'google-pay';
            } else if (paymentMethodName === 'Bank Transfer') {
                return 'bank-transfer';
            } else if (paymentMethodName === 'Buy Now Pay Later') {
                return 'buy-now-pay-later';
            } else if (paymentMethodName === 'Cryptocurrency') {
                return 'cryptocurrency';
            } else if (paymentMethodName === 'Cash on Delivery') {
                return 'cash-delivery';
            } else if (paymentMethodName === 'PhonePe') {
                return 'phonepe';
            }
        }

        // Check if a saved card is selected
        const selectedCard = document.querySelector('.saved-card.active');
        if (selectedCard) {
            return selectedCard.getAttribute('data-payment-method');
        }

        // Default to credit card
        return 'credit-card';
    }

    // Create confirmation screen
    function createConfirmationScreen(options) {
        const { type, title, message, details, note, buttonText } = options;

        // Get icon based on payment type
        let icon = '';
        switch(type) {
            case 'credit-card':
                icon = '<i class="far fa-credit-card"></i>';
                break;
            case 'apple-pay':
                icon = '<i class="fab fa-apple"></i>';
                break;
            case 'paypal':
                icon = '<i class="fab fa-paypal"></i>';
                break;
            case 'google-pay':
                icon = '<i class="fab fa-google-pay"></i>';
                break;
            case 'bank-transfer':
                icon = '<i class="fas fa-university"></i>';
                break;
            case 'cash-delivery':
                icon = '<i class="fas fa-hand-holding-usd"></i>';
                break;
            case 'buy-now-pay-later':
                icon = '<i class="fas fa-money-bill-wave"></i>';
                break;
            case 'cryptocurrency':
                icon = '<i class="fab fa-bitcoin"></i>';
                break;
            case 'phonepe':
                icon = '<i class="fas fa-mobile-alt"></i>';
                break;
            default:
                icon = '<i class="fas fa-check-circle"></i>';
        }

        // Create details HTML
        let detailsHTML = '';
        if (details && details.length > 0) {
            detailsHTML = details.map(detail => `
                <div class="detail-row">
                    <div class="detail-label">${detail.label}</div>
                    <div class="detail-value">${detail.value}</div>
                </div>
            `).join('');
        }

        // Create notes HTML
        let notesHTML = '';
        if (note) {
            notesHTML = `
                <div class="notification-box">
                    <div class="notification-icon">
                        <i class="fas fa-info"></i>
                    </div>
                    <div class="notification-text">${note}</div>
                </div>
            `;
        }

        // Add CSS link if not already present
        if (!document.querySelector('link[href="css/payment-verification.css"]')) {
            const cssLink = document.createElement('link');
            cssLink.rel = 'stylesheet';
            cssLink.href = 'css/payment-verification.css';
            document.head.appendChild(cssLink);
        }

        // Create confirmation screen HTML with new styling
        return `
            <div class="payment-verification-container">
                <div class="verification-header">
                    <div class="verification-icon ${type === 'cryptocurrency' ? 'crypto-icon' : ''}">
                        ${icon}
                    </div>
                    <h2 class="verification-title">${title}</h2>
                </div>
                <div class="verification-content">
                    <h3 class="verification-message">Thank You!</h3>
                    <p class="verification-subtitle">${message}</p>
                    <div class="transaction-details">
                        ${detailsHTML}
                    </div>
                    ${notesHTML}
                </div>
                <div class="verification-footer">
                    <button id="confirmation-continue-btn" class="continue-button" onclick="window.location.href='confirmation.html'">
                        <span>${buttonText || 'Continue'}</span>
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `;
    }

    // Process bank transfer
    function processBankTransfer() {
        // Get total amount
        const amount = parseFloat(summaryTotal.textContent.replace('$', ''));

        // Generate transaction ID
        const transactionId = generateTransactionId();

        // Get current date
        const currentDate = new Date().toLocaleDateString();

        // Show loading overlay
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-text">Confirming your order...</div>
        `;
        document.body.appendChild(loadingOverlay);

        // Simulate order confirmation
        setTimeout(() => {
            // Show enhanced confirmation screen
            loadingOverlay.innerHTML = createConfirmationScreen({
                type: 'bank-transfer',
                title: 'Order Confirmed',
                message: 'Your order has been confirmed. Please complete your bank transfer within 24 hours.',
                details: [
                    { label: 'Amount', value: '$' + amount.toFixed(2) },
                    { label: 'Order ID', value: transactionId },
                    { label: 'Date', value: currentDate },
                    { label: 'Payment Method', value: 'Bank Transfer' }
                ],
                note: 'Please use your Order ID as the payment reference when making the transfer. Your order will be processed once we receive your payment.',
                buttonText: 'Continue to Order Details'
            });

            // Add event listener to continue button (redundant with inline onclick, but added for robustness)
            setTimeout(() => {
                const continueButton = document.getElementById('confirmation-continue-btn');
                if (continueButton) {
                    continueButton.addEventListener('click', function() {
                        window.location.href = 'confirmation.html';
                    });

                    // Make sure the button is visible and clickable
                    continueButton.style.pointerEvents = 'auto';
                    continueButton.style.opacity = '1';

                    // Log for debugging
                    console.log('Continue button event listener attached');
                }
            }, 100); // Small delay to ensure DOM is updated
        }, 1500);
    }

    // Process cash on delivery
    function processCashOnDelivery() {
        // Get total amount
        const amount = parseFloat(summaryTotal.textContent.replace('$', ''));

        // Generate transaction ID
        const transactionId = generateTransactionId();

        // Get current date
        const currentDate = new Date().toLocaleDateString();

        // Show loading overlay
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-text">Confirming your order...</div>
        `;
        document.body.appendChild(loadingOverlay);

        // Simulate order confirmation
        setTimeout(() => {
            // Show enhanced confirmation screen
            loadingOverlay.innerHTML = createConfirmationScreen({
                type: 'cash-delivery',
                title: 'Order Confirmed',
                message: 'Your order has been confirmed for cash on delivery.',
                details: [
                    { label: 'Amount', value: '$' + amount.toFixed(2) },
                    { label: 'Order ID', value: transactionId },
                    { label: 'Date', value: currentDate },
                    { label: 'Payment Method', value: 'Cash on Delivery' },
                    { label: 'Estimated Delivery', value: '3-5 business days' }
                ],
                note: 'Please have the exact amount ready at the time of delivery. Our delivery personnel may not carry change.',
                buttonText: 'Continue to Order Details'
            });

            // Add event listener to continue button (redundant with inline onclick, but added for robustness)
            setTimeout(() => {
                const continueButton = document.getElementById('confirmation-continue-btn');
                if (continueButton) {
                    continueButton.addEventListener('click', function() {
                        window.location.href = 'confirmation.html';
                    });

                    // Make sure the button is visible and clickable
                    continueButton.style.pointerEvents = 'auto';
                    continueButton.style.opacity = '1';

                    // Log for debugging
                    console.log('Continue button event listener attached');
                }
            }, 100); // Small delay to ensure DOM is updated
        }, 1500);
    }

    // Process buy now pay later
    function processBuyNowPayLater() {
        // Get total amount
        const amount = parseFloat(summaryTotal.textContent.replace('$', ''));
        const installmentAmount = (amount / 4).toFixed(2);

        // Generate transaction ID
        const transactionId = generateTransactionId();

        // Get current date
        const currentDate = new Date().toLocaleDateString();

        // Show loading overlay
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-text">Processing your request...</div>
        `;
        document.body.appendChild(loadingOverlay);

        // Check if a BNPL provider is selected
        const selectedProvider = document.querySelector('.bnpl-provider.active') || document.querySelector('.bnpl-provider:hover');
        let providerName = 'Afterpay'; // Default provider

        if (selectedProvider) {
            providerName = selectedProvider.querySelector('span').textContent;
        }

        // Simulate BNPL processing
        setTimeout(() => {
            // Show enhanced confirmation screen
            loadingOverlay.innerHTML = createConfirmationScreen({
                type: 'buy-now-pay-later',
                title: 'Payment Plan Confirmed',
                message: `Your ${providerName} payment plan has been set up successfully.`,
                details: [
                    { label: 'Total Amount', value: '$' + amount.toFixed(2) },
                    { label: 'Order ID', value: transactionId },
                    { label: 'Date', value: currentDate },
                    { label: 'Payment Method', value: 'Buy Now Pay Later (' + providerName + ')' },
                    { label: 'First Payment', value: '$' + installmentAmount + ' (Today)' },
                    { label: 'Remaining Payments', value: '3 x $' + installmentAmount + ' (Every 2 weeks)' }
                ],
                note: 'Your first payment has been processed. The remaining payments will be automatically charged to your account every 2 weeks. You will receive email reminders before each payment.',
                buttonText: 'Continue to Order Details'
            });

            // Add event listener to continue button (redundant with inline onclick, but added for robustness)
            setTimeout(() => {
                const continueButton = document.getElementById('confirmation-continue-btn');
                if (continueButton) {
                    continueButton.addEventListener('click', function() {
                        window.location.href = 'confirmation.html';
                    });

                    // Make sure the button is visible and clickable
                    continueButton.style.pointerEvents = 'auto';
                    continueButton.style.opacity = '1';

                    // Log for debugging
                    console.log('Continue button event listener attached');
                }
            }, 100); // Small delay to ensure DOM is updated
        }, 2000);
    }

    // Process PhonePe payment
    function processPhonePePayment() {
        // Redirect to the standalone PhonePe page
        window.location.href = 'phonepe.html';
    }

    // Process cryptocurrency payment
    function processCryptocurrencyPayment() {
        // Get total amount
        const amount = parseFloat(summaryTotal.textContent.replace('$', ''));

        // Generate transaction ID
        const transactionId = generateTransactionId();

        // Get current date
        const currentDate = new Date().toLocaleDateString();

        // Get selected cryptocurrency
        const selectedCrypto = document.querySelector('.crypto-option.active');
        const cryptoName = selectedCrypto.querySelector('.crypto-name').textContent;
        const cryptoAmount = document.getElementById('crypto-amount').textContent;

        // Show loading overlay
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-text">Verifying payment...</div>
        `;
        document.body.appendChild(loadingOverlay);

        // Simulate cryptocurrency payment verification
        setTimeout(() => {
            // Show enhanced confirmation screen
            loadingOverlay.innerHTML = createConfirmationScreen({
                type: 'cryptocurrency',
                title: 'Payment Verified',
                message: `Your ${cryptoName} payment has been verified.`,
                details: [
                    { label: 'Crypto Amount', value: cryptoAmount },
                    { label: 'Fiat Equivalent', value: '$' + amount.toFixed(2) },
                    { label: 'Transaction ID', value: transactionId },
                    { label: 'Date', value: currentDate },
                    { label: 'Payment Method', value: cryptoName },
                    { label: 'Confirmations', value: '1/6' }
                ],
                note: 'Your payment has been received and is being confirmed on the blockchain. Your order will be processed after 6 confirmations. You will receive an email notification when your order is ready to ship.',
                buttonText: 'Continue to Order Details'
            });

            // Add event listener to continue button (redundant with inline onclick, but added for robustness)
            setTimeout(() => {
                const continueButton = document.getElementById('confirmation-continue-btn');
                if (continueButton) {
                    continueButton.addEventListener('click', function() {
                        window.location.href = 'confirmation.html';
                    });

                    // Make sure the button is visible and clickable
                    continueButton.style.pointerEvents = 'auto';
                    continueButton.style.opacity = '1';

                    // Log for debugging
                    console.log('Continue button event listener attached');
                }
            }, 100); // Small delay to ensure DOM is updated
        }, 2500);
    }

    // Payment Methods Management
    const managePaymentMethodsBtn = document.getElementById('manage-payment-methods');
    const addFirstPaymentMethodBtn = document.getElementById('add-first-payment-method');
    const paymentMethodsModal = document.getElementById('payment-methods-modal');
    const closePaymentMethodsModalBtn = document.getElementById('close-payment-methods-modal');
    const paymentMethodsList = document.getElementById('payment-methods-list');
    const noPaymentMethods = document.getElementById('no-payment-methods');
    const addPaymentMethodBtn = document.getElementById('add-payment-method');

    // Edit Payment Method Modal
    const editPaymentMethodModal = document.getElementById('edit-payment-method-modal');
    const closeEditPaymentModalBtn = document.getElementById('close-edit-payment-modal');
    const editPaymentModalTitle = document.getElementById('edit-payment-modal-title');
    const paymentMethodForm = document.getElementById('payment-method-form');
    const paymentMethodIdInput = document.getElementById('payment-method-id');
    const paymentMethodTypeSelect = document.getElementById('payment-method-type');
    const creditCardFields = document.getElementById('credit-card-fields');
    const paypalFields = document.getElementById('paypal-fields');
    const digitalWalletFields = document.getElementById('digital-wallet-fields');
    const paymentNicknameInput = document.getElementById('payment-nickname');
    const cancelPaymentEditBtn = document.getElementById('cancel-payment-edit');

    // Credit Card Form Fields
    const editCardNumberInput = document.getElementById('edit-card-number');
    const editCardHolderInput = document.getElementById('edit-card-holder');
    const editExpiryDateInput = document.getElementById('edit-expiry-date');
    const editCvvInput = document.getElementById('edit-cvv');

    // PayPal Fields
    const editPaypalEmailInput = document.getElementById('edit-paypal-email');

    // Delete Payment Method Modal
    const deletePaymentMethodModal = document.getElementById('delete-payment-method-modal');
    const closeDeleteModalBtn = document.getElementById('close-delete-modal');
    const deletePaymentPreview = document.getElementById('delete-payment-preview');
    const cancelDeleteBtn = document.getElementById('cancel-delete');
    const confirmDeleteBtn = document.getElementById('confirm-delete');

    // Saved Cards Container
    const savedCardsContainer = document.getElementById('saved-cards-container');
    const noSavedMethods = document.getElementById('no-saved-methods');

    // Load saved payment methods from localStorage
    let paymentMethods = JSON.parse(localStorage.getItem('payment-methods')) || [];

    // Initialize payment methods if empty
    if (paymentMethods.length === 0) {
        // Add some default payment methods for demonstration
        paymentMethods = [
            {
                id: generateId(),
                type: 'credit-card',
                cardNumber: '4111111111113398',
                cardHolder: 'John Doe',
                expiryDate: '12/25',
                cvv: '123',
                nickname: 'My Mastercard',
                icon: 'fab fa-cc-mastercard',
                isDefault: false
            },
            {
                id: generateId(),
                type: 'paypal',
                email: 'example@email.com',
                nickname: 'My PayPal',
                icon: 'fab fa-paypal',
                isDefault: false
            },
            {
                id: generateId(),
                type: 'apple-pay',
                nickname: 'Apple Pay',
                icon: 'fab fa-apple-pay',
                isDefault: true
            }
        ];

        // Save to localStorage
        savePaymentMethods();
    }

    // Generate a unique ID
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    // Generate a transaction ID
    function generateTransactionId() {
        const timestamp = new Date().getTime().toString().slice(-6);
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `TRX-${timestamp}-${random}`;
    }

    // Save payment methods to localStorage
    function savePaymentMethods() {
        localStorage.setItem('payment-methods', JSON.stringify(paymentMethods));
    }

    // Render saved payment methods in the payment panel
    function renderSavedPaymentMethods() {
        // Clear the container
        savedCardsContainer.innerHTML = '';

        // Check if there are any payment methods
        if (paymentMethods.length === 0) {
            noSavedMethods.style.display = 'block';
            return;
        }

        // Hide the no saved methods message
        noSavedMethods.style.display = 'none';

        // Render each payment method
        paymentMethods.forEach(method => {
            const savedCard = document.createElement('div');
            savedCard.className = 'saved-card' + (method.isDefault ? ' active' : '');
            savedCard.setAttribute('data-payment-method', method.type);
            savedCard.setAttribute('data-payment-id', method.id);

            let cardInfo = '';
            if (method.type === 'credit-card') {
                cardInfo = `
                    <div class="card-name">${method.nickname || 'Credit Card'}</div>
                    <div class="card-number">**** **** **** ${method.cardNumber.slice(-4)}</div>
                `;
            } else if (method.type === 'paypal') {
                cardInfo = `
                    <div class="card-name">${method.nickname || 'PayPal'}</div>
                    <div class="card-number">${method.email}</div>
                `;
            } else {
                cardInfo = `
                    <div class="card-name">${method.nickname || method.type}</div>
                `;
            }

            savedCard.innerHTML = `
                <div class="card-icon ${method.type}-icon">
                    <i class="${method.icon}"></i>
                </div>
                <div class="card-info">
                    ${cardInfo}
                </div>
                <div class="card-select">
                    <div class="radio-btn${method.isDefault ? ' active' : ''}"></div>
                </div>
            `;

            // Add event listener
            savedCard.addEventListener('click', function() {
                selectSavedCard(this);
            });

            savedCardsContainer.appendChild(savedCard);
        });

        // Update the DOM reference for saved cards
        updateSavedCardsReference();
    }

    // Update the DOM reference for saved cards
    function updateSavedCardsReference() {
        const savedCardsElements = document.querySelectorAll('.saved-card');
        if (savedCardsElements.length > 0) {
            savedCards = savedCardsElements;
        }
    }

    // Render payment methods in the management modal
    function renderPaymentMethodsList() {
        // Clear the container
        paymentMethodsList.innerHTML = '';

        // Check if there are any payment methods
        if (paymentMethods.length === 0) {
            noPaymentMethods.style.display = 'block';
            return;
        }

        // Hide the no payment methods message
        noPaymentMethods.style.display = 'none';

        // Render each payment method
        paymentMethods.forEach(method => {
            const methodItem = document.createElement('div');
            methodItem.className = 'payment-method-item';
            methodItem.setAttribute('data-payment-id', method.id);

            let methodDetails = '';
            if (method.type === 'credit-card') {
                methodDetails = `**** **** **** ${method.cardNumber.slice(-4)} | Expires: ${method.expiryDate}`;
            } else if (method.type === 'paypal') {
                methodDetails = method.email;
            } else {
                methodDetails = 'Connected to your device';
            }

            methodItem.innerHTML = `
                <div class="payment-method-icon">
                    <i class="${method.icon}"></i>
                </div>
                <div class="payment-method-info">
                    <div class="payment-method-name">${method.nickname || getPaymentMethodTypeName(method.type)}</div>
                    <div class="payment-method-details">${methodDetails}</div>
                </div>
                <div class="payment-method-actions">
                    <button class="payment-method-action edit" data-payment-id="${method.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="payment-method-action delete" data-payment-id="${method.id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;

            paymentMethodsList.appendChild(methodItem);
        });

        // Add event listeners to edit and delete buttons
        const editButtons = document.querySelectorAll('.payment-method-action.edit');
        const deleteButtons = document.querySelectorAll('.payment-method-action.delete');

        editButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const paymentId = this.getAttribute('data-payment-id');
                openEditPaymentMethodModal(paymentId);
            });
        });

        deleteButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const paymentId = this.getAttribute('data-payment-id');
                openDeletePaymentMethodModal(paymentId);
            });
        });
    }

    // Get payment method type name
    function getPaymentMethodTypeName(type) {
        switch(type) {
            case 'credit-card': return 'Credit/Debit Card';
            case 'paypal': return 'PayPal';
            case 'apple-pay': return 'Apple Pay';
            case 'google-pay': return 'Google Pay';
            default: return type;
        }
    }

    // Open the payment methods management modal
    function openPaymentMethodsModal() {
        renderPaymentMethodsList();
        paymentMethodsModal.classList.add('show');
    }

    // Close the payment methods management modal
    function closePaymentMethodsModal() {
        paymentMethodsModal.classList.remove('show');
    }

    // Open the edit payment method modal
    function openEditPaymentMethodModal(paymentId = null) {
        // Reset form
        paymentMethodForm.reset();

        if (paymentId) {
            // Edit existing payment method
            editPaymentModalTitle.textContent = 'Edit Payment Method';

            // Find the payment method
            const paymentMethod = paymentMethods.find(method => method.id === paymentId);
            if (!paymentMethod) return;

            // Set form values
            paymentMethodIdInput.value = paymentMethod.id;
            paymentMethodTypeSelect.value = paymentMethod.type;
            paymentNicknameInput.value = paymentMethod.nickname || '';

            // Set specific fields based on payment type
            if (paymentMethod.type === 'credit-card') {
                editCardNumberInput.value = paymentMethod.cardNumber || '';
                editCardHolderInput.value = paymentMethod.cardHolder || '';
                editExpiryDateInput.value = paymentMethod.expiryDate || '';
                editCvvInput.value = paymentMethod.cvv || '';
            } else if (paymentMethod.type === 'paypal') {
                editPaypalEmailInput.value = paymentMethod.email || '';
            }

            // Disable payment method type select for existing methods
            paymentMethodTypeSelect.disabled = true;
        } else {
            // Add new payment method
            editPaymentModalTitle.textContent = 'Add Payment Method';
            paymentMethodIdInput.value = '';

            // Enable payment method type select for new methods
            paymentMethodTypeSelect.disabled = false;
        }

        // Show/hide fields based on payment type
        togglePaymentMethodFields();

        // Close the payment methods management modal
        closePaymentMethodsModal();

        // Show the edit payment method modal
        editPaymentMethodModal.classList.add('show');
    }

    // Close the edit payment method modal
    function closeEditPaymentMethodModal() {
        editPaymentMethodModal.classList.remove('show');

        // Reopen the payment methods management modal
        openPaymentMethodsModal();
    }

    // Toggle payment method fields based on selected type
    function togglePaymentMethodFields() {
        const selectedType = paymentMethodTypeSelect.value;

        // Hide all fields first
        creditCardFields.style.display = 'none';
        paypalFields.style.display = 'none';
        digitalWalletFields.style.display = 'none';

        // Show fields based on selected type
        if (selectedType === 'credit-card') {
            creditCardFields.style.display = 'block';
        } else if (selectedType === 'paypal') {
            paypalFields.style.display = 'block';
        } else {
            digitalWalletFields.style.display = 'block';
        }
    }

    // Save payment method
    function savePaymentMethod(e) {
        e.preventDefault();

        const paymentId = paymentMethodIdInput.value;
        const paymentType = paymentMethodTypeSelect.value;
        const nickname = paymentNicknameInput.value;

        let paymentData = {
            type: paymentType,
            nickname: nickname
        };

        // Add specific fields based on payment type
        if (paymentType === 'credit-card') {
            paymentData = {
                ...paymentData,
                cardNumber: editCardNumberInput.value,
                cardHolder: editCardHolderInput.value,
                expiryDate: editExpiryDateInput.value,
                cvv: editCvvInput.value,
                icon: 'fab fa-cc-mastercard' // Default icon, could be determined based on card number
            };
        } else if (paymentType === 'paypal') {
            paymentData = {
                ...paymentData,
                email: editPaypalEmailInput.value,
                icon: 'fab fa-paypal'
            };
        } else if (paymentType === 'apple-pay') {
            paymentData = {
                ...paymentData,
                icon: 'fab fa-apple-pay'
            };
        } else if (paymentType === 'google-pay') {
            paymentData = {
                ...paymentData,
                icon: 'fab fa-google-pay'
            };
        }

        if (paymentId) {
            // Update existing payment method
            const index = paymentMethods.findIndex(method => method.id === paymentId);
            if (index !== -1) {
                // Preserve the isDefault status
                paymentData.isDefault = paymentMethods[index].isDefault;
                paymentData.id = paymentId;
                paymentMethods[index] = paymentData;
            }
        } else {
            // Add new payment method
            paymentData.id = generateId();
            paymentData.isDefault = paymentMethods.length === 0; // Make it default if it's the first one
            paymentMethods.push(paymentData);
        }

        // Save to localStorage
        savePaymentMethods();

        // Close the edit modal
        closeEditPaymentMethodModal();

        // Render the updated payment methods
        renderSavedPaymentMethods();

        // Show success notification
        showNotification('success', 'Payment Method Saved', 'Your payment method has been saved successfully.');
    }

    // Open the delete payment method modal
    function openDeletePaymentMethodModal(paymentId) {
        // Find the payment method
        const paymentMethod = paymentMethods.find(method => method.id === paymentId);
        if (!paymentMethod) return;

        // Set the payment method ID to the confirm delete button
        confirmDeleteBtn.setAttribute('data-payment-id', paymentId);

        // Show payment method details in the preview
        let methodDetails = '';
        if (paymentMethod.type === 'credit-card') {
            methodDetails = `
                <div class="payment-method-icon">
                    <i class="${paymentMethod.icon}"></i>
                </div>
                <div class="payment-method-info">
                    <div class="payment-method-name">${paymentMethod.nickname || 'Credit Card'}</div>
                    <div class="payment-method-details">**** **** **** ${paymentMethod.cardNumber.slice(-4)} | Expires: ${paymentMethod.expiryDate}</div>
                </div>
            `;
        } else if (paymentMethod.type === 'paypal') {
            methodDetails = `
                <div class="payment-method-icon">
                    <i class="${paymentMethod.icon}"></i>
                </div>
                <div class="payment-method-info">
                    <div class="payment-method-name">${paymentMethod.nickname || 'PayPal'}</div>
                    <div class="payment-method-details">${paymentMethod.email}</div>
                </div>
            `;
        } else {
            methodDetails = `
                <div class="payment-method-icon">
                    <i class="${paymentMethod.icon}"></i>
                </div>
                <div class="payment-method-info">
                    <div class="payment-method-name">${paymentMethod.nickname || getPaymentMethodTypeName(paymentMethod.type)}</div>
                    <div class="payment-method-details">Connected to your device</div>
                </div>
            `;
        }

        deletePaymentPreview.innerHTML = methodDetails;

        // Close the payment methods management modal
        closePaymentMethodsModal();

        // Show the delete payment method modal
        deletePaymentMethodModal.classList.add('show');
    }

    // Close the delete payment method modal
    function closeDeletePaymentMethodModal() {
        deletePaymentMethodModal.classList.remove('show');

        // Reopen the payment methods management modal
        openPaymentMethodsModal();
    }

    // Delete payment method
    function deletePaymentMethod() {
        const paymentId = confirmDeleteBtn.getAttribute('data-payment-id');
        if (!paymentId) return;

        // Find the payment method
        const index = paymentMethods.findIndex(method => method.id === paymentId);
        if (index === -1) return;

        // Check if it's the default payment method
        const isDefault = paymentMethods[index].isDefault;

        // Remove the payment method
        paymentMethods.splice(index, 1);

        // If it was the default and there are other methods, make the first one default
        if (isDefault && paymentMethods.length > 0) {
            paymentMethods[0].isDefault = true;
        }

        // Save to localStorage
        savePaymentMethods();

        // Close the delete modal
        closeDeletePaymentMethodModal();

        // Render the updated payment methods
        renderSavedPaymentMethods();

        // Show success notification
        showNotification('success', 'Payment Method Deleted', 'Your payment method has been deleted successfully.');
    }

    // Set a payment method as default
    function setDefaultPaymentMethod(paymentId) {
        // Reset all payment methods to non-default
        paymentMethods.forEach(method => {
            method.isDefault = false;
        });

        // Set the selected payment method as default
        const paymentMethod = paymentMethods.find(method => method.id === paymentId);
        if (paymentMethod) {
            paymentMethod.isDefault = true;

            // Update the unified pay button based on the payment method type
            if (paymentMethod.type === 'apple-pay') {
                updateUnifiedPayButton('apple-pay', 'Pay with Apple Pay');
                showPaymentForm('apple-pay');
            } else if (paymentMethod.type === 'paypal') {
                updateUnifiedPayButton('paypal', 'Pay with PayPal');
                showPaymentForm('paypal');
            } else if (paymentMethod.type === 'credit-card') {
                updateUnifiedPayButton('credit-card', 'Pay with Card');
                showPaymentForm('credit-card');
            } else if (paymentMethod.type === 'google-pay') {
                updateUnifiedPayButton('google-pay', 'Pay with Google Pay');
                showPaymentForm('google-pay');
            } else {
                updateUnifiedPayButton('default', 'Complete Payment');
                showPaymentForm(paymentMethod.type);
            }
        }

        // Save to localStorage
        savePaymentMethods();

        // Render the updated payment methods
        renderSavedPaymentMethods();
    }

    // Event Listeners for Payment Methods Management
    if (managePaymentMethodsBtn) {
        managePaymentMethodsBtn.addEventListener('click', openPaymentMethodsModal);
    }

    if (addFirstPaymentMethodBtn) {
        addFirstPaymentMethodBtn.addEventListener('click', () => openEditPaymentMethodModal());
    }

    if (closePaymentMethodsModalBtn) {
        closePaymentMethodsModalBtn.addEventListener('click', closePaymentMethodsModal);
    }

    if (addPaymentMethodBtn) {
        addPaymentMethodBtn.addEventListener('click', () => openEditPaymentMethodModal());
    }

    if (closeEditPaymentModalBtn) {
        closeEditPaymentModalBtn.addEventListener('click', closeEditPaymentMethodModal);
    }

    if (cancelPaymentEditBtn) {
        cancelPaymentEditBtn.addEventListener('click', closeEditPaymentMethodModal);
    }

    if (paymentMethodTypeSelect) {
        paymentMethodTypeSelect.addEventListener('change', togglePaymentMethodFields);
    }

    if (paymentMethodForm) {
        paymentMethodForm.addEventListener('submit', savePaymentMethod);
    }

    if (closeDeleteModalBtn) {
        closeDeleteModalBtn.addEventListener('click', closeDeletePaymentMethodModal);
    }

    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', closeDeletePaymentMethodModal);
    }

    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', deletePaymentMethod);
    }

    // Show the appropriate payment form based on the selected payment method
    function showPaymentForm(paymentMethod) {
        console.log('Showing payment form for:', paymentMethod);

        // First, add a fade-out class to all payment forms
        const paymentForms = document.querySelectorAll('.payment-form');
        paymentForms.forEach(form => {
            if (form.classList.contains('active')) {
                form.classList.add('fade-out');
                // Remove active class after fade out animation completes
                setTimeout(() => {
                    form.classList.remove('active');
                    form.classList.remove('fade-out');
                }, 150);
            } else {
                form.classList.remove('active');
            }
        });

        // Determine which form to show
        let formId;
        switch(paymentMethod) {
            case 'apple-pay':
                formId = 'apple-pay-form';
                break;
            case 'paypal':
                formId = 'paypal-form';
                break;
            case 'credit-card':
                formId = 'credit-card-form';
                break;
            case 'google-pay':
                formId = 'google-pay-form';
                break;
            case 'bank-transfer':
                formId = 'bank-transfer-form';
                break;
            case 'cash-delivery':
                formId = 'cash-delivery-form';
                break;
            case 'buy-now-pay-later':
                formId = 'buy-now-pay-later-form';
                // Calculate installment amounts
                calculateInstallments();
                break;
            case 'cryptocurrency':
                formId = 'cryptocurrency-form';
                // Update crypto conversion rates
                updateCryptoRates();
                break;
            case 'phonepe':
                formId = 'phonepe-form';
                break;
            default:
                formId = 'credit-card-form';
        }

        console.log('Form ID to show:', formId);

        // Show the selected form with a slight delay for smooth transition
        setTimeout(() => {
            const selectedForm = document.getElementById(formId);
            if (selectedForm) {
                console.log('Found form element, showing:', formId);

                // Hide all individual payment buttons in the forms
                hideAllIndividualPayButtons();

                // Show the form
                selectedForm.classList.add('fade-in');
                selectedForm.classList.add('active');

                // Remove the fade-in class after animation completes
                setTimeout(() => {
                    selectedForm.classList.remove('fade-in');
                }, 300);
            } else {
                console.error('Form element not found:', formId);
            }

            // Update the payment method display
            updatePaymentMethodDisplay(paymentMethod);
        }, 200);
    }

    // Hide all individual payment buttons in the forms
    function hideAllIndividualPayButtons() {
        // List of all individual payment buttons to hide
        const buttonIds = [
            'paypal-button',
            'apple-pay-button',
            'google-pay-button',
            'confirm-bank-transfer',
            'confirm-cod',
            'select-bnpl-provider',
            'confirm-crypto-payment',
            'proceed-phonepe-payment'
        ];

        // Hide each button
        buttonIds.forEach(id => {
            const button = document.getElementById(id);
            if (button) {
                button.style.display = 'none';
            }
        });
    }

    // Calculate installment amounts for Buy Now Pay Later
    function calculateInstallments() {
        const totalAmount = parseFloat(summaryTotal.textContent.replace('$', ''));
        const installmentAmount = (totalAmount / 4).toFixed(2);

        document.getElementById('first-installment').textContent = '$' + installmentAmount;
        document.getElementById('second-installment').textContent = '$' + installmentAmount;
        document.getElementById('third-installment').textContent = '$' + installmentAmount;
        document.getElementById('fourth-installment').textContent = '$' + installmentAmount;
    }

    // Update cryptocurrency rates
    function updateCryptoRates() {
        const totalAmount = parseFloat(summaryTotal.textContent.replace('$', ''));
        document.getElementById('crypto-fiat-amount').textContent = '$' + totalAmount.toFixed(2);

        // Simulate different conversion rates for different cryptocurrencies
        const cryptoRates = {
            'bitcoin': 0.000017, // BTC/USD
            'ethereum': 0.00025,  // ETH/USD
            'litecoin': 0.0055,   // LTC/USD
            'usdt': 1.0           // USDT/USD
        };

        // Get the selected cryptocurrency
        const selectedCrypto = document.querySelector('.crypto-option.active').getAttribute('data-crypto');
        const rate = cryptoRates[selectedCrypto];
        const cryptoAmount = (totalAmount * rate).toFixed(6);

        // Update the displayed amount
        let cryptoSymbol;
        switch(selectedCrypto) {
            case 'bitcoin':
                cryptoSymbol = 'BTC';
                break;
            case 'ethereum':
                cryptoSymbol = 'ETH';
                break;
            case 'litecoin':
                cryptoSymbol = 'LTC';
                break;
            case 'usdt':
                cryptoSymbol = 'USDT';
                break;
            default:
                cryptoSymbol = 'BTC';
        }

        document.getElementById('crypto-amount').textContent = cryptoAmount + ' ' + cryptoSymbol;

        // Update the QR code
        const walletAddress = document.getElementById('crypto-wallet-address').textContent;
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${walletAddress}`;
        document.querySelector('#crypto-qr-code img').src = qrCodeUrl;
    }

    // Update the payment method display
    function updatePaymentMethodDisplay(paymentMethod) {
        const paymentMethodDisplay = document.getElementById('payment-method-display');
        if (!paymentMethodDisplay) return;

        // Clear the current content
        paymentMethodDisplay.innerHTML = '';

        // Create the payment method display content
        let displayContent = '';
        let methodName = '';
        let methodIcon = '';
        let methodColor = '';

        switch(paymentMethod) {
            case 'apple-pay':
                methodName = 'Apple Pay';
                methodIcon = '<i class="fab fa-apple"></i>';
                methodColor = '#000';
                break;
            case 'paypal':
                methodName = 'PayPal';
                methodIcon = '<i class="fab fa-paypal"></i>';
                methodColor = '#0070ba';
                break;
            case 'credit-card':
                methodName = 'Credit/Debit Card';
                methodIcon = '<i class="far fa-credit-card"></i>';
                methodColor = '#4a6de5';
                break;
            case 'google-pay':
                methodName = 'Google Pay';
                methodIcon = '<i class="fab fa-google-pay"></i>';
                methodColor = '#4285F4';
                break;
            case 'bank-transfer':
                methodName = 'Bank Transfer';
                methodIcon = '<i class="fas fa-university"></i>';
                methodColor = '#28a745';
                break;
            case 'cash-delivery':
                methodName = 'Cash on Delivery';
                methodIcon = '<i class="fas fa-hand-holding-usd"></i>';
                methodColor = '#ffc107';
                break;
            case 'buy-now-pay-later':
                methodName = 'Buy Now Pay Later';
                methodIcon = '<i class="fas fa-money-bill-wave"></i>';
                methodColor = '#9c27b0';
                break;
            case 'cryptocurrency':
                methodName = 'Cryptocurrency';
                methodIcon = '<i class="fab fa-bitcoin"></i>';
                methodColor = '#f7931a';
                break;
            case 'phonepe':
                methodName = 'PhonePe';
                methodIcon = '<i class="fas fa-mobile-alt"></i>';
                methodColor = '#5f259f';
                break;
            default:
                methodName = 'Payment Method';
                methodIcon = '<i class="fas fa-money-bill"></i>';
                methodColor = '#6c757d';
        }

        displayContent = `
            <div class="selected-payment-method">
                <div class="method-icon" style="background-color: ${methodColor}; color: ${methodColor === '#ffc107' ? '#212529' : 'white'}">
                    ${methodIcon}
                </div>
                <div class="method-details">
                    <h3>Selected Payment Method</h3>
                    <p>${methodName}</p>
                </div>
            </div>
        `;

        paymentMethodDisplay.innerHTML = displayContent;
    }

    // Initialize
    calculateOrderSummary();
    updateCartCount();

    // Add event listeners for cryptocurrency options
    const cryptoOptions = document.querySelectorAll('.crypto-option');
    cryptoOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            cryptoOptions.forEach(opt => opt.classList.remove('active'));

            // Add active class to clicked option
            this.classList.add('active');

            // Update crypto rates
            updateCryptoRates();
        });
    });

    // Add event listener for copy crypto address button
    const copyAddressBtn = document.getElementById('copy-crypto-address');
    if (copyAddressBtn) {
        copyAddressBtn.addEventListener('click', function() {
            const walletAddress = document.getElementById('crypto-wallet-address').textContent;

            // Copy to clipboard
            navigator.clipboard.writeText(walletAddress).then(() => {
                // Show success notification
                showNotification('success', 'Address Copied', 'Wallet address copied to clipboard.');

                // Change button appearance temporarily
                this.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-copy"></i>';
                }, 2000);
            });
        });
    }

    // Add event listeners for BNPL providers
    const bnplProviders = document.querySelectorAll('.bnpl-provider');
    bnplProviders.forEach(provider => {
        provider.addEventListener('click', function() {
            // Remove active class from all providers
            bnplProviders.forEach(p => p.classList.remove('active'));

            // Add active class to clicked provider
            this.classList.add('active');

            // Update the BNPL button text
            const providerName = this.querySelector('span').textContent;
            const bnplButton = document.getElementById('select-bnpl-provider');
            if (bnplButton) {
                bnplButton.innerHTML = `
                    <i class="fas fa-credit-card"></i>
                    <span>Pay with ${providerName}</span>
                `;
            }
        });
    });

    // Add event listeners for PhonePe options
    if (phonepeOptions && phonepeOptions.length > 0) {
        phonepeOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Remove active class from all options
                phonepeOptions.forEach(opt => {
                    opt.classList.remove('active');
                    const radioBtn = opt.querySelector('.radio-btn');
                    if (radioBtn) radioBtn.classList.remove('active');
                });

                // Add active class to selected option
                this.classList.add('active');
                const radioBtn = this.querySelector('.radio-btn');
                if (radioBtn) radioBtn.classList.add('active');

                // Show/hide appropriate sections based on selected option
                const isUpiOption = this.querySelector('.phonepe-option-name').textContent.includes('UPI');
                const qrSection = document.querySelector('.phonepe-qr-section');
                const upiSection = document.querySelector('.phonepe-upi-section');

                if (qrSection) qrSection.style.display = isUpiOption ? 'none' : 'flex';
                if (upiSection) upiSection.style.display = isUpiOption ? 'block' : 'none';
            });
        });
    }

    // Add event listener for PhonePe payment button
    if (proceedPhonepeBtn) {
        proceedPhonepeBtn.addEventListener('click', function() {
            processPhonePePayment();
        });
    }
    renderSavedPaymentMethods();

    // Set default payment method
    const defaultPaymentMethod = paymentMethods.find(method => method.isDefault);
    if (defaultPaymentMethod) {
        if (defaultPaymentMethod.type === 'apple-pay') {
            updateUnifiedPayButton('apple-pay', 'Pay with Apple Pay');
            showPaymentForm('apple-pay');
        } else if (defaultPaymentMethod.type === 'paypal') {
            updateUnifiedPayButton('paypal', 'Pay with PayPal');
            showPaymentForm('paypal');
        } else if (defaultPaymentMethod.type === 'credit-card') {
            updateUnifiedPayButton('credit-card', 'Pay with Card');
            showPaymentForm('credit-card');
        } else if (defaultPaymentMethod.type === 'google-pay') {
            updateUnifiedPayButton('google-pay', 'Pay with Google Pay');
            showPaymentForm('google-pay');
        } else {
            updateUnifiedPayButton('default', 'Complete Payment');
            showPaymentForm('credit-card');
        }
    } else {
        updateUnifiedPayButton('default', 'Complete Payment');
        showPaymentForm('credit-card');
    }

    // Make sure the left panel pay button is always hidden
    if (leftPanelPayButton) {
        leftPanelPayButton.style.display = 'none';
    }

    // Add event listener for PayPal checkout button
    const paypalCheckoutButton = document.getElementById('paypal-checkout-button');
    if (paypalCheckoutButton) {
        paypalCheckoutButton.addEventListener('click', function() {
            redirectToPayPal();
        });
    }

    // Clear all active states first to prevent multiple selections
    const allSavedCards = document.querySelectorAll('.saved-card');
    const allPaymentOptions = document.querySelectorAll('.payment-option');

    // Remove active class from all cards and options
    allSavedCards.forEach(card => {
        card.classList.remove('active');
        const radioBtn = card.querySelector('.radio-btn');
        if (radioBtn) radioBtn.classList.remove('active');
    });

    allPaymentOptions.forEach(option => {
        option.classList.remove('active');
        const radioBtn = option.querySelector('.radio-btn');
        if (radioBtn) radioBtn.classList.remove('active');
    });

    // Find the active saved card (if any)
    const activeCard = document.querySelector('.saved-card.active');

    // If there's an active card, select it
    if (activeCard) {
        // Call selectSavedCard to ensure proper initialization
        selectSavedCard(activeCard);

        // Always show payment options section for all payment methods
        const paymentOptionsSection = document.querySelector('.payment-options-section');
        if (paymentOptionsSection) {
            paymentOptionsSection.style.display = 'block';
        }
    }
    // Otherwise, don't select anything by default
    // Let the user make an explicit selection

    // Add CSS for error state
    const style = document.createElement('style');
    style.textContent = `
        .form-group input.error {
            border-color: var(--payment-error);
            box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.2);
        }
    `;
    document.head.appendChild(style);
});
