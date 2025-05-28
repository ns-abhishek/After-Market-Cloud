/**
 * PhonePe Direct Payment Implementation
 * This is a standalone implementation that doesn't rely on the existing payment.js
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize PhonePe payment
    initPhonePePayment();
});

/**
 * Initialize PhonePe payment
 */
function initPhonePePayment() {
    // Find the PhonePe button
    const phonePeButton = document.getElementById('proceed-phonepe-payment');
    if (phonePeButton) {
        phonePeButton.addEventListener('click', function(e) {
            e.preventDefault();
            showPhonePePayment();
            return false;
        });
    }

    // Find PhonePe option in payment options
    const phonePeOptions = document.querySelectorAll('.payment-option');
    phonePeOptions.forEach(option => {
        const optionName = option.querySelector('.option-name');
        if (optionName && optionName.textContent === 'PhonePe') {
            option.addEventListener('click', function() {
                // This will be handled by the existing code, but we'll add our own handler
                setTimeout(() => {
                    const phonePeBtn = document.querySelector('.phonepe-button');
                    if (phonePeBtn) {
                        phonePeBtn.addEventListener('click', function(e) {
                            e.preventDefault();
                            showPhonePePayment();
                            return false;
                        });
                    }
                }, 500);
            });
        }
    });
}

/**
 * Show PhonePe payment modal
 */
function showPhonePePayment() {
    // Get total amount
    const summaryTotal = document.getElementById('summary-total');
    if (!summaryTotal) {
        console.error('Summary total element not found');
        return;
    }

    const amount = parseFloat(summaryTotal.textContent.replace('$', ''));

    // Generate transaction ID
    const transactionId = 'TRX-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0') + '-' +
                         Math.floor(Math.random() * 10000).toString().padStart(4, '0');

    // Create modal container
    const modalContainer = document.createElement('div');
    modalContainer.id = 'phonepe-direct-modal';
    modalContainer.style.position = 'fixed';
    modalContainer.style.top = '0';
    modalContainer.style.left = '0';
    modalContainer.style.width = '100%';
    modalContainer.style.height = '100%';
    modalContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    modalContainer.style.zIndex = '9999';
    modalContainer.style.display = 'flex';
    modalContainer.style.justifyContent = 'center';
    modalContainer.style.alignItems = 'center';

    // Create modal content
    modalContainer.innerHTML = `
        <div style="width: 90%; max-width: 450px; background-color: #000000; border: 2px solid #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);">
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid #333333;">
                <h3 style="color: #ffffff; margin: 0; font-size: 18px; font-weight: 600;">PhonePe QR Payment</h3>
                <button id="close-phonepe-direct" style="background: none; border: none; color: #ffffff; font-size: 18px; cursor: pointer;">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div style="padding: 20px; background-color: #000000; color: #ffffff;">
                <div style="display: flex; justify-content: center; margin-bottom: 20px; padding: 10px; background-color: #ffffff; border-radius: 12px; width: 200px; margin: 0 auto 20px;">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/PhonePe_logo.svg/1200px-PhonePe_logo.svg.png" alt="PhonePe Logo" style="height: 50px; object-fit: contain;">
                </div>

                <div style="display: flex; flex-direction: column; align-items: center; margin: 20px 0;">
                    <div id="phonepe-direct-qr" style="width: 220px; height: 220px; background-color: #ffffff; display: flex; justify-content: center; align-items: center; margin-bottom: 15px; border-radius: 12px; padding: 15px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); border: 2px solid #000000;">
                        <div style="width: 50px; height: 50px; border: 4px solid rgba(0, 0, 0, 0.1); border-left-color: #000000; border-radius: 50%; animation: phonepeSpin 1s linear infinite;"></div>
                    </div>
                </div>

                <div style="text-align: center; margin-top: 15px; background-color: rgba(255, 255, 255, 0.05); padding: 15px; border-radius: 12px; width: 100%;">
                    <h4 style="margin-bottom: 10px; color: #ffffff; font-size: 16px;">Scan with PhonePe App</h4>
                    <ol style="text-align: left; padding-left: 25px; color: #cccccc;">
                        <li style="margin-bottom: 8px; font-size: 14px;">Open your PhonePe app</li>
                        <li style="margin-bottom: 8px; font-size: 14px;">Tap on 'Scan & Pay'</li>
                        <li style="margin-bottom: 8px; font-size: 14px;">Point your camera at this QR code</li>
                        <li style="margin-bottom: 8px; font-size: 14px;">Confirm payment in your app</li>
                    </ol>
                </div>

                <div style="margin-top: 20px; display: flex; flex-direction: column; gap: 10px;">
                    <div style="display: flex; justify-content: space-between; padding: 10px 15px; background-color: rgba(255, 255, 255, 0.05); border-radius: 8px;">
                        <div style="color: #aaaaaa; font-size: 14px;">Amount:</div>
                        <div style="color: #ffffff; font-weight: 600; font-size: 14px;">$${amount.toFixed(2)}</div>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 10px 15px; background-color: rgba(255, 255, 255, 0.05); border-radius: 8px;">
                        <div style="color: #aaaaaa; font-size: 14px;">Transaction ID:</div>
                        <div style="color: #ffffff; font-weight: 600; font-size: 14px;">${transactionId}</div>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 10px 15px; background-color: rgba(255, 255, 255, 0.1); border-radius: 8px; margin-top: 10px;">
                        <div style="color: #ffffff; font-size: 14px;">Time remaining:</div>
                        <div id="phonepe-direct-timer" style="color: #ffffff; font-weight: 600; font-family: monospace; font-size: 16px;">05:00</div>
                    </div>
                </div>
            </div>

            <div style="padding: 15px 20px; display: flex; justify-content: space-between; border-top: 1px solid #333333; background-color: #000000;">
                <button id="cancel-phonepe-direct" style="padding: 12px 20px; background-color: transparent; border: 1px solid #555555; color: #ffffff; border-radius: 8px; font-weight: 500; cursor: pointer;">Cancel</button>
                <button id="verify-phonepe-direct" style="padding: 12px 20px; background-color: #ffffff; border: none; color: #000000; border-radius: 8px; font-weight: 600; cursor: pointer;">I've Paid</button>
            </div>
        </div>
    `;

    // Add keyframe animation for spinner
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        @keyframes phonepeSpin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(styleElement);

    // Add modal to body
    document.body.appendChild(modalContainer);

    // Generate QR code
    generatePhonePeQRCode(transactionId, amount);

    // Start timer
    startPhonePeTimer();

    // Add event listeners
    document.getElementById('close-phonepe-direct').addEventListener('click', closePhonePeModal);
    document.getElementById('cancel-phonepe-direct').addEventListener('click', closePhonePeModal);
    document.getElementById('verify-phonepe-direct').addEventListener('click', verifyPhonePePayment);
}

/**
 * Generate PhonePe QR code
 */
function generatePhonePeQRCode(transactionId, amount) {
    const qrContainer = document.getElementById('phonepe-direct-qr');
    if (!qrContainer) return;

    // Generate QR code data
    const qrData = `upi://pay?pa=merchant@phonepe&pn=ShopEasy&am=${amount.toFixed(2)}&cu=USD&tn=Payment%20for%20order%20${transactionId}`;

    // Create QR code image
    const qrImage = document.createElement('img');
    qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrData)}`;
    qrImage.alt = "PhonePe QR Code";
    qrImage.style.width = "100%";
    qrImage.style.height = "100%";
    qrImage.style.backgroundColor = "#ffffff";
    qrImage.style.padding = "10px";
    qrImage.style.borderRadius = "8px";
    qrImage.style.border = "2px solid #000000";
    qrImage.style.display = "block";

    // Handle image load
    qrImage.onload = function() {
        qrContainer.innerHTML = '';
        qrContainer.appendChild(qrImage);
    };

    // Handle image error
    qrImage.onerror = function() {
        qrContainer.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <i class="fas fa-exclamation-circle" style="font-size: 40px; color: #ff5555; margin-bottom: 15px;"></i>
                <p style="margin-bottom: 15px; color: #ffffff;">Failed to load QR code</p>
                <button id="refresh-phonepe-qr" style="background-color: #ffffff; color: #000000; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer;">Generate New QR</button>
            </div>
        `;

        // Add event listener to refresh button
        const refreshBtn = document.getElementById('refresh-phonepe-qr');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', function() {
                closePhonePeModal();
                setTimeout(() => {
                    showPhonePePayment();
                }, 300);
            });
        }
    };
}

/**
 * Start PhonePe timer
 */
function startPhonePeTimer() {
    const timerElement = document.getElementById('phonepe-direct-timer');
    if (!timerElement) return;

    let timeLeft = 5 * 60; // 5 minutes

    const timerInterval = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);

            // Show expired message
            const qrContainer = document.getElementById('phonepe-direct-qr');
            if (qrContainer) {
                qrContainer.innerHTML = `
                    <div style="text-align: center; padding: 20px;">
                        <i class="fas fa-exclamation-circle" style="font-size: 40px; color: #ff5555; margin-bottom: 15px;"></i>
                        <p style="margin-bottom: 15px; color: #ffffff;">QR code has expired</p>
                        <button id="refresh-phonepe-qr" style="background-color: #ffffff; color: #000000; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer;">Generate New QR</button>
                    </div>
                `;

                // Add event listener to refresh button
                const refreshBtn = document.getElementById('refresh-phonepe-qr');
                if (refreshBtn) {
                    refreshBtn.addEventListener('click', function() {
                        closePhonePeModal();
                        setTimeout(() => {
                            showPhonePePayment();
                        }, 300);
                    });
                }
            }
        }

        timeLeft--;
    }, 1000);

    // Store the interval ID
    document.getElementById('phonepe-direct-modal').dataset.timerInterval = timerInterval;
}

/**
 * Close PhonePe modal
 */
function closePhonePeModal() {
    const modal = document.getElementById('phonepe-direct-modal');
    if (!modal) return;

    // Clear timer if exists
    if (modal.dataset.timerInterval) {
        clearInterval(parseInt(modal.dataset.timerInterval));
    }

    // Remove modal
    modal.remove();
}

/**
 * Verify PhonePe payment
 */
function verifyPhonePePayment() {
    const verifyBtn = document.getElementById('verify-phonepe-direct');
    if (!verifyBtn) return;

    // Show checking payment status
    verifyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
    verifyBtn.disabled = true;

    // Get payment details
    const amountElement = verifyBtn.closest('div').parentNode.querySelector('div div:nth-child(1) div:nth-child(2)');
    const transactionElement = verifyBtn.closest('div').parentNode.querySelector('div div:nth-child(2) div:nth-child(2)');

    const amount = amountElement ? amountElement.textContent : '$0.00';
    const transactionId = transactionElement ? transactionElement.textContent : 'UNKNOWN';
    const currentDate = new Date().toLocaleDateString();

    // Simulate database connection
    setTimeout(() => {
        // Show database connection status if available
        const dbStatus = document.getElementById('db-status');
        if (dbStatus) {
            dbStatus.classList.add('show', 'connected');
            setTimeout(() => {
                dbStatus.classList.remove('show');
            }, 2000);
        }

        // Simulate payment verification
        setTimeout(() => {
            // Show success message
            const modalContent = document.querySelector('#phonepe-direct-modal > div');
            if (modalContent) {
                modalContent.innerHTML = `
                    <div style="padding: 30px; background-color: #000000; color: #ffffff; text-align: center; border-radius: 16px;">
                        <div style="font-size: 60px; color: #ffffff; margin-bottom: 20px;">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div style="font-size: 24px; font-weight: 600; color: #ffffff; margin-bottom: 15px;">
                            Payment Successful!
                        </div>
                        <div style="color: #aaaaaa; margin-bottom: 20px;">
                            <p style="margin: 5px 0;">Amount: ${amount}</p>
                            <p style="margin: 5px 0;">Transaction ID: ${transactionId}</p>
                            <p style="margin: 5px 0;">Date: ${currentDate}</p>
                            <p style="margin: 5px 0;">Payment Method: PhonePe</p>
                        </div>
                        <button id="continue-to-confirmation" style="padding: 14px 24px; background-color: #ffffff; border: none; color: #000000; border-radius: 8px; font-weight: 600; width: 100%; cursor: pointer; margin-top: 20px;">
                            Continue
                        </button>
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

            // Show success notification if available
            if (window.showNotification) {
                window.showNotification('success', 'Payment Successful', 'Your PhonePe payment has been processed successfully.');
            }
        }, 2000);
    }, 1000);
}
