/**
 * QR Payment Modal Handler
 * Manages Google Pay and PhonePe QR code payment modals
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize timers
    const timers = {};
    
    // Load necessary Font Awesome if not already loaded
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const fontAwesome = document.createElement('link');
        fontAwesome.rel = 'stylesheet';
        fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
        document.head.appendChild(fontAwesome);
    }
    
    // Ensure QR code modals are in the DOM
    ensureModalElements();
    
    // Common timer function
    function startTimer(elementId, durationInSeconds = 300) {
        // Clear existing timer if any
        if (timers[elementId]) {
            clearInterval(timers[elementId]);
        }
        
        const timerElement = document.getElementById(elementId);
        if (!timerElement) return;
        
        let timeLeft = durationInSeconds;
        
        // Update timer immediately
        updateTimerDisplay(timerElement, timeLeft);
        
        // Set interval for timer
        timers[elementId] = setInterval(function() {
            timeLeft--;
            
            // Update display
            updateTimerDisplay(timerElement, timeLeft);
            
            // Handle timer completion
            if (timeLeft <= 0) {
                clearInterval(timers[elementId]);
                handleTimerExpired(elementId);
            }
        }, 1000);
    }
    
    // Format and display timer
    function updateTimerDisplay(element, seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        // Format as MM:SS
        const formattedTime = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
        element.textContent = formattedTime;
        
        // Add warning colors
        if (seconds <= 60) {
            element.classList.add('danger');
            element.classList.remove('warning');
        } else if (seconds <= 120) {
            element.classList.add('warning');
            element.classList.remove('danger');
        } else {
            element.classList.remove('warning', 'danger');
        }
    }
    
    // Handle timer expiration
    function handleTimerExpired(timerId) {
        // Get the modal ID based on timer ID
        const modalId = timerId.includes('google-pay') 
            ? 'google-pay-modal' 
            : 'phonepe-modal';
        
        const modal = document.getElementById(modalId);
        if (modal) {
            const modalBody = modal.querySelector('.payment-body');
            const modalFooter = modal.querySelector('.payment-footer');
            
            if (modalBody && modalFooter) {
                // Show expired message
                modalBody.innerHTML = `
                    <div class="payment-expired">
                        <div class="expired-icon">
                            <i class="fas fa-exclamation-circle" style="font-size: 60px; color: #FF5722; margin-bottom: 20px;"></i>
                        </div>
                        <div class="expired-message" style="font-size: 24px; font-weight: 600; color: #ffffff; margin-bottom: 20px;">
                            Payment Session Expired
                        </div>
                        <div class="expired-details" style="text-align: center; margin-bottom: 20px; color: rgba(255, 255, 255, 0.8);">
                            <p>Your payment session has timed out.</p>
                            <p>Please try again to complete your payment.</p>
                        </div>
                    </div>
                `;
                
                modalFooter.innerHTML = `
                    <button class="payment-continue" onclick="document.getElementById('${modalId}').style.display='none';">
                        Close
                    </button>
                `;
            }
        }
    }
    
    // Generate QR code using a more reliable method
    function generateQRCode(elementId, paymentType, amount, transactionId) {
        const qrContainer = document.getElementById(elementId);
        if (!qrContainer) return;
        
        // Clear any existing content
        qrContainer.innerHTML = '';
        
        // Show loading spinner
        const loadingSpinner = document.createElement('div');
        loadingSpinner.className = 'qr-loading-spinner';
        loadingSpinner.style.width = '50px';
        loadingSpinner.style.height = '50px';
        loadingSpinner.style.border = '4px solid rgba(0, 0, 0, 0.1)';
        loadingSpinner.style.borderLeftColor = '#000000';
        loadingSpinner.style.borderRadius = '50%';
        loadingSpinner.style.animation = 'qr-spin 1s linear infinite';
        qrContainer.appendChild(loadingSpinner);
        
        // Create QR code image
        const qrImage = new Image();
        const paymentData = paymentType === 'google-pay' 
            ? `gpay://pay?pa=merchant@gpay&pn=ShopEasy&am=${amount}&cu=USD&tn=Payment for order ${transactionId}`
            : `upi://pay?pa=merchant@phonepe&pn=ShopEasy&am=${amount}&cu=USD&tn=Payment for order ${transactionId}`;
        
        // URL encode the payment data
        const encodedData = encodeURIComponent(paymentData);
        qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedData}`;
        qrImage.alt = `${paymentType === 'google-pay' ? 'Google Pay' : 'PhonePe'} QR Code`;
        
        // Handle successful load
        qrImage.onload = function() {
            qrContainer.innerHTML = '';
            qrContainer.appendChild(qrImage);
        };
        
        // Handle error
        qrImage.onerror = function() {
            qrContainer.innerHTML = '';
            qrContainer.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 32px; color: #FF5722; margin-bottom: 10px;"></i>
                    <p style="color: #ffffff; margin-bottom: 10px;">Failed to load QR code</p>
                    <button class="retry-btn" style="padding: 5px 15px; background: #ffffff; border: none; border-radius: 4px; cursor: pointer;">Retry</button>
                </div>
            `;
            
            const retryBtn = qrContainer.querySelector('.retry-btn');
            if (retryBtn) {
                retryBtn.addEventListener('click', function() {
                    generateQRCode(elementId, paymentType, amount, transactionId);
                });
            }
        };
    }
    
    // Verify payment function
    function verifyPayment(paymentType) {
        const modalId = paymentType === 'google-pay' ? 'google-pay-modal' : 'phonepe-modal';
        const modal = document.getElementById(modalId);
        const verifyBtn = document.getElementById(`verify-${paymentType}`);
        
        // Show checking payment status
        if (verifyBtn) {
            verifyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
            verifyBtn.disabled = true;
        }
        
        // Clear timer
        const timerId = `${paymentType}-timer`;
        if (timers[timerId]) {
            clearInterval(timers[timerId]);
            delete timers[timerId];
        }
        
        // Simulate payment verification (2 seconds)
        setTimeout(() => {
            if (modal) {
                const modalBody = modal.querySelector('.payment-body');
                const modalFooter = modal.querySelector('.payment-footer');
                
                if (modalBody && modalFooter) {
                    // Get amount and transaction ID
                    const amountElement = modal.querySelector('.payment-detail-value');
                    const transactionElement = modal.querySelector('.payment-detail:nth-child(2) .payment-detail-value');
                    
                    const amount = amountElement ? amountElement.textContent : '$269.98';
                    const transactionId = transactionElement ? transactionElement.textContent : 'TRX-270793-9019';
                    
                    // Show success message
                    modalBody.innerHTML = `
                        <div class="payment-success">
                            <div class="success-icon">
                                <i class="fas fa-check-circle"></i>
                            </div>
                            <div class="success-message">Payment Successful!</div>
                            <div class="success-details">
                                <p>Amount: ${amount}</p>
                                <p>Transaction ID: ${transactionId}</p>
                                <p>Date: ${new Date().toLocaleDateString()}</p>
                                <p>Payment Method: ${paymentType === 'google-pay' ? 'Google Pay' : 'PhonePe'}</p>
                            </div>
                        </div>
                    `;
                    
                    modalFooter.innerHTML = `
                        <button class="payment-continue" id="continue-${paymentType}">Continue</button>
                    `;
                    
                    // Add event listener to continue button
                    const continueBtn = document.getElementById(`continue-${paymentType}`);
                    if (continueBtn) {
                        continueBtn.addEventListener('click', function() {
                            modal.style.display = 'none';
                            redirectToConfirmation();
                        });
                    }
                }
            }
        }, 2000);
    }
    
    // Redirect to order confirmation
    function redirectToConfirmation() {
        // Simulate redirect with alert for now
        alert('Payment confirmed! Redirecting to confirmation page...');
        // Actual redirect to confirmation page
        window.location.href = 'confirmation.html';
    }
    
    // Ensure modal elements are in the DOM
    function ensureModalElements() {
        // Check if Google Pay modal exists already
        if (!document.getElementById('google-pay-modal')) {
            // Load the modal content from qr-payment-modals.html
            fetch('qr-payment-modals.html')
                .then(response => response.text())
                .then(html => {
                    // Create a temporary element to hold the HTML
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = html;
                    
                    // Extract the modals
                    const googlePayModal = tempDiv.querySelector('#google-pay-modal');
                    const phonepeModal = tempDiv.querySelector('#phonepe-modal');
                    
                    // Append to body if found
                    if (googlePayModal) document.body.appendChild(googlePayModal);
                    if (phonepeModal) document.body.appendChild(phonepeModal);
                    
                    // Attach event listeners
                    setupEventListeners();
                    
                    // Generate QR codes
                    generateQRCode('google-pay-qr', 'google-pay', '269.98', 'TRX-270793-9019');
                    generateQRCode('phonepe-qr', 'phonepe', '269.98', 'TRX-270793-9019');
                })
                .catch(error => {
                    console.error('Error loading payment modals:', error);
                    // Inject modals directly as fallback
                    injectPaymentModals();
                });
        } else {
            // Modals already exist, just setup event listeners
            setupEventListeners();
            
            // Generate QR codes
            generateQRCode('google-pay-qr', 'google-pay', '269.98', 'TRX-270793-9019');
            generateQRCode('phonepe-qr', 'phonepe', '269.98', 'TRX-270793-9019');
        }
    }
    
    // Inject payment modals directly as fallback
    function injectPaymentModals() {
        const googlePayModal = `
            <div id="google-pay-modal" class="payment-modal" style="display: none;">
                <div class="payment-content">
                    <div class="payment-header">
                        <h3>Google Pay</h3>
                        <button class="payment-close" id="close-google-pay">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="payment-body">
                        <div class="payment-logo">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Google_Pay_Logo_%282020%29.svg/1200px-Google_Pay_Logo_%282020%29.svg.png" alt="Google Pay Logo">
                        </div>
                        <div class="payment-qr-container">
                            <div class="payment-qr" id="google-pay-qr">
                                <!-- QR code will be generated dynamically -->
                            </div>
                        </div>
                        <div class="payment-instructions">
                            <h4>Scan with Google Pay App</h4>
                            <ol>
                                <li>Open your Google Pay app</li>
                                <li>Tap on 'Scan QR'</li>
                                <li>Point your camera at this QR code</li>
                                <li>Confirm payment in your app</li>
                            </ol>
                        </div>
                        <div class="payment-details">
                            <div class="payment-detail">
                                <div class="payment-detail-label">Amount:</div>
                                <div class="payment-detail-value">$269.98</div>
                            </div>
                            <div class="payment-detail">
                                <div class="payment-detail-label">Transaction ID:</div>
                                <div class="payment-detail-value">TRX-270793-9019</div>
                            </div>
                            <div class="payment-timer">
                                <div class="payment-timer-label">Time remaining:</div>
                                <div class="payment-timer-value" id="google-pay-timer">05:00</div>
                            </div>
                        </div>
                    </div>
                    <div class="payment-footer">
                        <button class="payment-cancel" id="cancel-google-pay">Cancel</button>
                        <button class="payment-verify" id="verify-google-pay">I've Paid</button>
                    </div>
                </div>
            </div>
        `;
        
        const phonepeModal = `
            <div id="phonepe-modal" class="payment-modal" style="display: none;">
                <div class="payment-content">
                    <div class="payment-header">
                        <h3>PhonePe</h3>
                        <button class="payment-close" id="close-phonepe">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="payment-body">
                        <div class="payment-logo">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/PhonePe_logo.svg/1200px-PhonePe_logo.svg.png" alt="PhonePe Logo">
                        </div>
                        <div class="payment-qr-container">
                            <div class="payment-qr" id="phonepe-qr">
                                <!-- QR code will be generated dynamically -->
                            </div>
                        </div>
                        <div class="payment-instructions">
                            <h4>Scan with PhonePe App</h4>
                            <ol>
                                <li>Open your PhonePe app</li>
                                <li>Tap on 'Scan & Pay'</li>
                                <li>Point your camera at this QR code</li>
                                <li>Confirm payment in your app</li>
                            </ol>
                        </div>
                        <div class="payment-details">
                            <div class="payment-detail">
                                <div class="payment-detail-label">Amount:</div>
                                <div class="payment-detail-value">$269.98</div>
                            </div>
                            <div class="payment-detail">
                                <div class="payment-detail-label">Transaction ID:</div>
                                <div class="payment-detail-value">TRX-270793-9019</div>
                            </div>
                            <div class="payment-timer">
                                <div class="payment-timer-label">Time remaining:</div>
                                <div class="payment-timer-value" id="phonepe-timer">05:00</div>
                            </div>
                        </div>
                    </div>
                    <div class="payment-footer">
                        <button class="payment-cancel" id="cancel-phonepe">Cancel</button>
                        <button class="payment-verify" id="verify-phonepe">I've Paid</button>
                    </div>
                </div>
            </div>
        `;
        
        // Append modals to body
        document.body.insertAdjacentHTML('beforeend', googlePayModal);
        document.body.insertAdjacentHTML('beforeend', phonepeModal);
        
        // Setup event listeners
        setupEventListeners();
        
        // Generate QR codes
        generateQRCode('google-pay-qr', 'google-pay', '269.98', 'TRX-270793-9019');
        generateQRCode('phonepe-qr', 'phonepe', '269.98', 'TRX-270793-9019');
    }
    
    // Setup event listeners for all buttons
    function setupEventListeners() {
        // Google Pay modal
        const googlePayModal = document.getElementById('google-pay-modal');
        if (googlePayModal) {
            // Close button
            const closeBtn = googlePayModal.querySelector('.payment-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', function() {
                    googlePayModal.style.display = 'none';
                    
                    // Clear timer
                    if (timers['google-pay-timer']) {
                        clearInterval(timers['google-pay-timer']);
                        delete timers['google-pay-timer'];
                    }
                });
            }
            
            // Cancel button
            const cancelBtn = document.getElementById('cancel-google-pay');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', function() {
                    googlePayModal.style.display = 'none';
                    
                    // Clear timer
                    if (timers['google-pay-timer']) {
                        clearInterval(timers['google-pay-timer']);
                        delete timers['google-pay-timer'];
                    }
                });
            }
            
            // Verify button
            const verifyBtn = document.getElementById('verify-google-pay');
            if (verifyBtn) {
                verifyBtn.addEventListener('click', function() {
                    verifyPayment('google-pay');
                });
            }
        }
        
        // PhonePe modal
        const phonepeModal = document.getElementById('phonepe-modal');
        if (phonepeModal) {
            // Close button
            const closeBtn = phonepeModal.querySelector('.payment-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', function() {
                    phonepeModal.style.display = 'none';
                    
                    // Clear timer
                    if (timers['phonepe-timer']) {
                        clearInterval(timers['phonepe-timer']);
                        delete timers['phonepe-timer'];
                    }
                });
            }
            
            // Cancel button
            const cancelBtn = document.getElementById('cancel-phonepe');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', function() {
                    phonepeModal.style.display = 'none';
                    
                    // Clear timer
                    if (timers['phonepe-timer']) {
                        clearInterval(timers['phonepe-timer']);
                        delete timers['phonepe-timer'];
                    }
                });
            }
            
            // Verify button
            const verifyBtn = document.getElementById('verify-phonepe');
            if (verifyBtn) {
                verifyBtn.addEventListener('click', function() {
                    verifyPayment('phonepe');
                });
            }
        }
    }
    
    // Show Google Pay Modal
    window.showGooglePayModal = function() {
        const googlePayModal = document.getElementById('google-pay-modal');
        if (googlePayModal) {
            googlePayModal.style.display = 'flex';
            startTimer('google-pay-timer', 300); // 5 minutes
            
            // Ensure QR code is loaded
            generateQRCode('google-pay-qr', 'google-pay', '269.98', 'TRX-270793-9019');
        }
    };
    
    // Show PhonePe Modal
    window.showPhonePeModal = function() {
        const phonepeModal = document.getElementById('phonepe-modal');
        if (phonepeModal) {
            phonepeModal.style.display = 'flex';
            startTimer('phonepe-timer', 300); // 5 minutes
            
            // Ensure QR code is loaded
            generateQRCode('phonepe-qr', 'phonepe', '269.98', 'TRX-270793-9019');
        }
    };
    
    // Find and hook events to Google Pay and PhonePe buttons
    function hookPaymentButtons() {
        // Google Pay button
        const googlePayButtons = document.querySelectorAll('.google-pay-button, #google-pay-button, button[data-payment="google-pay"]');
        googlePayButtons.forEach(button => {
            if (button && !button.getAttribute('data-qr-hooked')) {
                button.setAttribute('data-qr-hooked', 'true');
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    window.showGooglePayModal();
                    return false;
                });
            }
        });
        
        // PhonePe button
        const phonePeButtons = document.querySelectorAll('.phonepe-button, #phonepe-button, button[data-payment="phonepe"]');
        phonePeButtons.forEach(button => {
            if (button && !button.getAttribute('data-qr-hooked')) {
                button.setAttribute('data-qr-hooked', 'true');
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    window.showPhonePeModal();
                    return false;
                });
            }
        });
    }
    
    // Add CSS for QR code spinner animation if not already present
    if (!document.getElementById('qr-payment-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'qr-payment-styles';
        styleElement.innerHTML = `
            @keyframes qr-spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            .qr-loading-spinner {
                animation: qr-spin 1s linear infinite;
            }
        `;
        document.head.appendChild(styleElement);
    }
    
    // Hook payment buttons
    hookPaymentButtons();
    
    // For dynamic content loading, reattach event handlers
    const observer = new MutationObserver(function(mutations) {
        hookPaymentButtons();
    });
    
    // Start observing the document body for changes
    observer.observe(document.body, { 
        childList: true,
        subtree: true
    });
}); 