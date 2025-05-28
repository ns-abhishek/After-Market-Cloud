/**
 * Google Pay QR Code Fix
 * This script fixes the Google Pay QR code display, timer functionality, and button issues
 */

document.addEventListener('DOMContentLoaded', function() {
    // Override the processGooglePay function
    window.processGooglePay = function() {
        // Get total amount
        const amount = parseFloat(document.querySelector('.summary-total').textContent.replace('$', ''));

        // Generate transaction ID
        const transactionId = 'TRX-' + Math.floor(100000 + Math.random() * 900000) + '-' + Math.floor(1000 + Math.random() * 9000);

        // Create a Google Pay modal
        const googlePayModal = document.createElement('div');
        googlePayModal.className = 'payment-modal';
        googlePayModal.style.position = 'fixed';
        googlePayModal.style.top = '0';
        googlePayModal.style.left = '0';
        googlePayModal.style.width = '100%';
        googlePayModal.style.height = '100%';
        googlePayModal.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        googlePayModal.style.zIndex = '9999';
        googlePayModal.style.display = 'flex';
        googlePayModal.style.justifyContent = 'center';
        googlePayModal.style.alignItems = 'center';

        googlePayModal.innerHTML = `
            <div style="width: 90%; max-width: 450px; background-color: #000000; border: 2px solid #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);">
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid #333333;">
                    <h3 style="color: #ffffff; margin: 0; font-size: 18px; font-weight: 600;">Google Pay</h3>
                    <button id="close-google-pay-modal" style="background: none; border: none; color: #ffffff; font-size: 18px; cursor: pointer;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div style="padding: 20px; background-color: #000000; color: #ffffff;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Google_Pay_Logo_%282020%29.svg/1200px-Google_Pay_Logo_%282020%29.svg.png" alt="Google Pay Logo" style="height: 40px; margin-bottom: 15px;">
                    </div>

                    <div style="display: flex; flex-direction: column; align-items: center; margin: 20px 0;">
                        <div id="google-pay-qr-code" style="width: 220px; height: 220px; background-color: #ffffff; display: flex; justify-content: center; align-items: center; margin-bottom: 15px; border-radius: 12px; padding: 15px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);">
                            <div style="width: 50px; height: 50px; border: 4px solid rgba(0, 0, 0, 0.1); border-left-color: #000000; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                        </div>
                    </div>

                    <div style="background-color: #111111; border-radius: 12px; padding: 15px; margin-bottom: 20px;">
                        <h4 style="margin-top: 0; margin-bottom: 15px; color: #ffffff; text-align: center;">Scan with Google Pay App</h4>
                        <ol style="color: #aaaaaa; margin-bottom: 0; padding-left: 20px;">
                            <li style="margin-bottom: 8px;">Open your Google Pay app</li>
                            <li style="margin-bottom: 8px;">Tap on 'Scan QR'</li>
                            <li style="margin-bottom: 8px;">Point your camera at this QR code</li>
                            <li style="margin-bottom: 0;">Confirm payment in your app</li>
                        </ol>
                    </div>

                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span style="color: #aaaaaa;">Amount:</span>
                        <span style="color: #ffffff; font-weight: 600;">$${amount.toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span style="color: #aaaaaa;">Transaction ID:</span>
                        <span style="color: #ffffff; font-weight: 600;">${transactionId}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                        <span style="color: #aaaaaa;">Time remaining:</span>
                        <span style="color: #ffffff; font-weight: 600;" id="google-pay-timer">05:00</span>
                    </div>
                </div>
                <div style="padding: 15px 20px; display: flex; justify-content: space-between; border-top: 1px solid #333333; background-color: #000000;">
                    <button id="cancel-google-pay" style="padding: 12px 20px; background-color: transparent; border: 1px solid #555555; color: #ffffff; border-radius: 8px; font-weight: 500; cursor: pointer;">Cancel</button>
                    <button id="verify-google-pay" style="padding: 12px 20px; background-color: #ffffff; border: none; color: #000000; border-radius: 8px; font-weight: 600; cursor: pointer;">I've Paid</button>
                </div>
            </div>
        `;

        document.body.appendChild(googlePayModal);

        // Generate QR code
        const qrCodeContainer = document.getElementById('google-pay-qr-code');
        if (qrCodeContainer) {
            // Generate QR code data
            const qrData = `gpay://pay?pa=merchant@gpay&pn=ShopEasy&am=${amount.toFixed(2)}&cu=USD&tn=Payment%20for%20order%20${transactionId}`;

            // Create QR code image using a reliable service
            const qrImage = document.createElement('img');
            qrImage.src = `https://chart.googleapis.com/chart?cht=qr&chl=${encodeURIComponent(qrData)}&chs=200x200&chld=L|0`;
            qrImage.alt = "Google Pay QR Code";
            qrImage.style.width = "100%";
            qrImage.style.height = "100%";
            qrImage.style.backgroundColor = "#ffffff";
            qrImage.style.padding = "0";
            qrImage.style.borderRadius = "8px";
            qrImage.style.display = "block";

            // Handle image loading
            qrImage.onload = function() {
                // Clear loading spinner and add QR code
                qrCodeContainer.innerHTML = '';
                qrCodeContainer.appendChild(qrImage);
            };

            qrImage.onerror = function() {
                // Fallback if the QR code fails to load
                qrCodeContainer.innerHTML = `
                    <div style="text-align: center; padding: 20px; color: #000000;">
                        <i class="fas fa-exclamation-circle" style="font-size: 40px; color: #ff5555; margin-bottom: 15px;"></i>
                        <p style="margin-bottom: 15px;">Failed to load QR code</p>
                        <button id="retry-qr-load" style="background-color: #000000; color: #ffffff; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer;">Retry</button>
                    </div>
                `;

                const retryBtn = document.getElementById('retry-qr-load');
                if (retryBtn) {
                    retryBtn.addEventListener('click', function() {
                        // Try loading the QR code again
                        qrCodeContainer.innerHTML = '<div style="width: 50px; height: 50px; border: 4px solid rgba(0, 0, 0, 0.1); border-left-color: #000000; border-radius: 50%; animation: spin 1s linear infinite;"></div>';
                        setTimeout(() => {
                            qrImage.src = `https://chart.googleapis.com/chart?cht=qr&chl=${encodeURIComponent(qrData)}&chs=200x200&chld=L|0`;
                        }, 500);
                    });
                }
            };

            // Start timer
            let timeLeft = 5 * 60; // 5 minutes
            const timerElement = document.getElementById('google-pay-timer');
            const timerInterval = setInterval(() => {
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;

                if (timerElement) {
                    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                }

                if (--timeLeft < 0) {
                    clearInterval(timerInterval);
                    if (qrCodeContainer) {
                        qrCodeContainer.innerHTML = `
                            <div style="text-align: center; padding: 20px; color: #000000;">
                                <i class="fas fa-exclamation-circle" style="font-size: 40px; color: #ff5555; margin-bottom: 15px;"></i>
                                <p style="margin-bottom: 15px;">QR code has expired</p>
                                <button id="refresh-google-pay-qr" style="background-color: #000000; color: #ffffff; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer;">Generate New QR</button>
                            </div>
                        `;

                        const refreshBtn = document.getElementById('refresh-google-pay-qr');
                        if (refreshBtn) {
                            refreshBtn.addEventListener('click', () => {
                                googlePayModal.remove();
                                processGooglePay();
                            });
                        }
                    }
                }
            }, 1000);

            // Store the timer interval ID for cleanup
            googlePayModal.dataset.timerInterval = timerInterval;
        }

        // Add event listeners to buttons
        const closeBtn = document.getElementById('close-google-pay-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                // Clear the timer interval before removing the modal
                if (googlePayModal.dataset.timerInterval) {
                    clearInterval(parseInt(googlePayModal.dataset.timerInterval));
                }
                googlePayModal.remove();
            });
        }

        const cancelBtn = document.getElementById('cancel-google-pay');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                // Clear the timer interval before removing the modal
                if (googlePayModal.dataset.timerInterval) {
                    clearInterval(parseInt(googlePayModal.dataset.timerInterval));
                }
                googlePayModal.remove();
            });
        }

        const verifyBtn = document.getElementById('verify-google-pay');
        if (verifyBtn) {
            verifyBtn.addEventListener('click', function() {
                // Show checking payment status
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
                this.disabled = true;

                // Disable the cancel button during verification
                if (cancelBtn) {
                    cancelBtn.disabled = true;
                }

                // Clear the timer interval
                if (googlePayModal.dataset.timerInterval) {
                    clearInterval(parseInt(googlePayModal.dataset.timerInterval));
                }

                // Simulate database connection
                const dbStatus = document.querySelector('.database-status');
                if (dbStatus) {
                    dbStatus.classList.add('show', 'connected');
                    setTimeout(() => {
                        dbStatus.classList.remove('show');
                    }, 2000);
                }

                // Simulate payment verification
                setTimeout(() => {
                    // Show success message
                    const modalContent = googlePayModal.querySelector('div');
                    if (modalContent) {
                        // Add CSS link if not already present
                        if (!document.querySelector('link[href="css/payment-verification.css"]')) {
                            const cssLink = document.createElement('link');
                            cssLink.rel = 'stylesheet';
                            cssLink.href = 'css/payment-verification.css';
                            document.head.appendChild(cssLink);
                        }

                        modalContent.innerHTML = `
                            <div class="payment-verification-container">
                                <div class="verification-header">
                                    <div class="verification-icon">
                                        <i class="fab fa-google-pay"></i>
                                    </div>
                                    <h2 class="verification-title">Payment Successful</h2>
                                </div>
                                <div class="verification-content">
                                    <h3 class="verification-message">Thank You!</h3>
                                    <p class="verification-subtitle">Your Google Pay payment has been processed successfully.</p>
                                    <div class="transaction-details">
                                        <div class="detail-row">
                                            <div class="detail-label">Amount</div>
                                            <div class="detail-value">$${amount.toFixed(2)}</div>
                                        </div>
                                        <div class="detail-row">
                                            <div class="detail-label">Transaction ID</div>
                                            <div class="detail-value">${transactionId}</div>
                                        </div>
                                        <div class="detail-row">
                                            <div class="detail-label">Date</div>
                                            <div class="detail-value">${new Date().toLocaleDateString()}</div>
                                        </div>
                                        <div class="detail-row">
                                            <div class="detail-label">Payment Method</div>
                                            <div class="detail-value">Google Pay</div>
                                        </div>
                                    </div>
                                    <div class="notification-box">
                                        <div class="notification-icon">
                                            <i class="fas fa-info"></i>
                                        </div>
                                        <div class="notification-text">
                                            A receipt has been sent to your email address. Thank you for your purchase!
                                        </div>
                                    </div>
                                </div>
                                <div class="verification-footer">
                                    <button id="continue-to-confirmation" class="continue-button">
                                        <span>Continue</span>
                                        <i class="fas fa-arrow-right"></i>
                                    </button>
                                </div>
                            </div>
                        `;

                        // Add event listener to continue button
                        const continueBtn = document.getElementById('continue-to-confirmation');
                        if (continueBtn) {
                            continueBtn.addEventListener('click', function() {
                                window.location.href = 'confirmation.html';
                            });
                        }
                    }

                    // Show success notification
                    if (window.showNotification) {
                        window.showNotification('success', 'Payment Successful', 'Your Google Pay payment has been processed successfully.');
                    }
                }, 2000);
            });
        }
    };
});
