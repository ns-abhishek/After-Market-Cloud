/**
 * Direct Payment Fix for Google Pay and PhonePe
 * This script provides a direct implementation for payment QR codes
 */

document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners to payment buttons
    setupPaymentButtons();

    // Add static QR code images
    prepareStaticQRCodes();
});

/**
 * Set up payment buttons
 */
function setupPaymentButtons() {
    // Google Pay button
    const googlePayBtn = document.getElementById('google-pay-button');
    if (googlePayBtn) {
        googlePayBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            showFixedPaymentModal('google-pay');
            return false;
        });
    }

    // PhonePe option
    const phonePeOptions = document.querySelectorAll('.payment-option');
    phonePeOptions.forEach(option => {
        const optionName = option.querySelector('.option-name');
        if (optionName && optionName.textContent === 'PhonePe') {
            option.addEventListener('click', function() {
                // Add our own handler after a delay to ensure the original handler runs
                setTimeout(() => {
                    const phonePeBtn = document.querySelector('.phonepe-button');
                    if (phonePeBtn) {
                        phonePeBtn.addEventListener('click', function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            showFixedPaymentModal('phonepe');
                            return false;
                        });
                    }
                }, 500);
            });
        }
    });
}

/**
 * Prepare static QR code images
 */
function prepareStaticQRCodes() {
    // Create hidden container for QR codes
    const qrContainer = document.createElement('div');
    qrContainer.id = 'static-qr-codes';
    qrContainer.style.display = 'none';

    // Add Google Pay QR code
    const googlePayQR = document.createElement('img');
    googlePayQR.id = 'static-google-pay-qr';
    googlePayQR.src = 'https://chart.googleapis.com/chart?cht=qr&chl=gpay://pay?pa=merchant@gpay&pn=ShopEasy&am=100.00&cu=USD&tn=Payment%20for%20order&chs=300x300';
    googlePayQR.alt = 'Google Pay QR Code';

    // Add PhonePe QR code
    const phonePeQR = document.createElement('img');
    phonePeQR.id = 'static-phonepe-qr';
    phonePeQR.src = 'https://chart.googleapis.com/chart?cht=qr&chl=upi://pay?pa=merchant@phonepe&pn=ShopEasy&am=100.00&cu=USD&tn=Payment%20for%20order&chs=300x300';
    phonePeQR.alt = 'PhonePe QR Code';

    // Add to container
    qrContainer.appendChild(googlePayQR);
    qrContainer.appendChild(phonePeQR);

    // Add to body
    document.body.appendChild(qrContainer);
}

/**
 * Show fixed payment modal
 */
function showFixedPaymentModal(paymentType) {
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

    // Set payment type specific details
    let paymentTitle, logoSrc, logoAlt, qrSrc;

    if (paymentType === 'google-pay') {
        paymentTitle = 'Google Pay';
        logoSrc = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Google_Pay_Logo_%282020%29.svg/1200px-Google_Pay_Logo_%282020%29.svg.png';
        logoAlt = 'Google Pay Logo';
        qrSrc = document.getElementById('static-google-pay-qr').src;
    } else {
        paymentTitle = 'PhonePe';
        logoSrc = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/PhonePe_logo.svg/1200px-PhonePe_logo.svg.png';
        logoAlt = 'PhonePe Logo';
        qrSrc = document.getElementById('static-phonepe-qr').src;
    }

    // Create modal HTML
    const modalHTML = `
        <div id="fixed-payment-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.9); z-index: 9999; display: flex; justify-content: center; align-items: center;">
            <div style="width: 90%; max-width: 450px; background-color: #000000; border: 2px solid #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);">
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid #333333;">
                    <h3 style="color: #ffffff; margin: 0; font-size: 18px; font-weight: 600;">${paymentTitle} QR Payment</h3>
                    <button id="close-fixed-payment" style="background: none; border: none; color: #ffffff; font-size: 18px; cursor: pointer;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div style="padding: 20px; background-color: #000000; color: #ffffff;">
                    <div style="display: flex; justify-content: center; margin-bottom: 20px; padding: 10px; background-color: #ffffff; border-radius: 12px; width: 200px; margin: 0 auto 20px;">
                        <img src="${logoSrc}" alt="${logoAlt}" style="height: 50px; object-fit: contain;">
                    </div>

                    <div style="display: flex; flex-direction: column; align-items: center; margin: 20px 0;">
                        <div id="fixed-payment-qr" style="width: 220px; height: 220px; background-color: #ffffff; display: flex; justify-content: center; align-items: center; margin-bottom: 15px; border-radius: 12px; padding: 15px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); border: 2px solid #000000;">
                            <img src="${qrSrc}" alt="${paymentTitle} QR Code" style="width: 100%; height: 100%; object-fit: contain;">
                        </div>
                    </div>

                    <div style="text-align: center; margin-top: 15px; background-color: rgba(255, 255, 255, 0.05); padding: 15px; border-radius: 12px; width: 100%;">
                        <h4 style="margin-bottom: 10px; color: #ffffff; font-size: 16px;">Scan with ${paymentTitle} App</h4>
                        <ol style="text-align: left; padding-left: 25px; color: #cccccc;">
                            <li style="margin-bottom: 8px; font-size: 14px;">Open your ${paymentTitle} app</li>
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
                            <div id="fixed-payment-timer" style="color: #ffffff; font-weight: 600; font-family: monospace; font-size: 16px;">05:00</div>
                        </div>
                    </div>
                </div>

                <div style="padding: 15px 20px; display: flex; justify-content: space-between; border-top: 1px solid #333333; background-color: #000000;">
                    <button id="cancel-fixed-payment" style="padding: 12px 20px; background-color: transparent; border: 1px solid #555555; color: #ffffff; border-radius: 8px; font-weight: 500; cursor: pointer;">Cancel</button>
                    <button id="verify-fixed-payment" style="padding: 12px 20px; background-color: #ffffff; border: none; color: #000000; border-radius: 8px; font-weight: 600; cursor: pointer;">I've Paid</button>
                </div>
            </div>
        </div>
    `;

    // Create modal element
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer.firstChild);

    // Start timer
    startFixedPaymentTimer();

    // Add event listeners
    document.getElementById('close-fixed-payment').addEventListener('click', closeFixedPaymentModal);
    document.getElementById('cancel-fixed-payment').addEventListener('click', closeFixedPaymentModal);
    document.getElementById('verify-fixed-payment').addEventListener('click', function() {
        verifyFixedPayment(paymentType, amount, transactionId);
    });
}

/**
 * Start fixed payment timer
 */
function startFixedPaymentTimer() {
    const timerElement = document.getElementById('fixed-payment-timer');
    if (!timerElement) return;

    let timeLeft = 5 * 60; // 5 minutes

    const timerInterval = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);

            // Show expired message
            const qrContainer = document.getElementById('fixed-payment-qr');
            if (qrContainer) {
                qrContainer.innerHTML = `
                    <div style="text-align: center; padding: 20px;">
                        <i class="fas fa-exclamation-circle" style="font-size: 40px; color: #ff5555; margin-bottom: 15px;"></i>
                        <p style="margin-bottom: 15px; color: #000000;">QR code has expired</p>
                        <button id="refresh-fixed-qr" style="background-color: #000000; color: #ffffff; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer;">Generate New QR</button>
                    </div>
                `;

                // Add event listener to refresh button
                const refreshBtn = document.getElementById('refresh-fixed-qr');
                if (refreshBtn) {
                    refreshBtn.addEventListener('click', function() {
                        closeFixedPaymentModal();
                        setTimeout(() => {
                            // Get payment type from modal title
                            const modalTitle = document.querySelector('#fixed-payment-modal h3');
                            const paymentType = modalTitle.textContent.toLowerCase().includes('google') ? 'google-pay' : 'phonepe';
                            showFixedPaymentModal(paymentType);
                        }, 300);
                    });
                }
            }
        }

        timeLeft--;
    }, 1000);

    // Store the interval ID
    document.getElementById('fixed-payment-modal').dataset.timerInterval = timerInterval;
}

/**
 * Close fixed payment modal
 */
function closeFixedPaymentModal() {
    const modal = document.getElementById('fixed-payment-modal');
    if (!modal) return;

    // Clear timer if exists
    if (modal.dataset.timerInterval) {
        clearInterval(parseInt(modal.dataset.timerInterval));
    }

    // Remove modal
    modal.remove();
}

/**
 * Verify fixed payment
 */
function verifyFixedPayment(paymentType, amount, transactionId) {
    const verifyBtn = document.getElementById('verify-fixed-payment');
    if (!verifyBtn) return;

    // Show checking payment status
    verifyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
    verifyBtn.disabled = true;

    // Get current date
    const currentDate = new Date().toLocaleDateString();

    // Format payment type name
    const paymentTypeName = paymentType === 'google-pay' ? 'Google Pay' : 'PhonePe';

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
            const modalContent = document.querySelector('#fixed-payment-modal > div');
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
                            <p style="margin: 5px 0;">Amount: $${amount.toFixed(2)}</p>
                            <p style="margin: 5px 0;">Transaction ID: ${transactionId}</p>
                            <p style="margin: 5px 0;">Date: ${currentDate}</p>
                            <p style="margin: 5px 0;">Payment Method: ${paymentTypeName}</p>
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
                window.showNotification('success', 'Payment Successful', `Your ${paymentTypeName} payment has been processed successfully.`);
            }
        }, 2000);
    }, 1000);
}
