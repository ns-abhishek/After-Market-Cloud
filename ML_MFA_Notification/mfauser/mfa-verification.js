/**
 * Render the appropriate MFA verification form based on the current method
 */
function renderMFAVerification() {
    clearAuthContainer();

    const authContainer = document.getElementById('auth-container');
    let template;

    // Render the progress indicator
    renderProgressIndicator();

    // Render the appropriate template based on the current MFA method
    switch (authState.currentMFAMethod) {
        case MFAMethod.SMS_OTP:
            template = renderTemplate('sms-otp-template');
            setupSMSOTPVerification(template);
            break;
        case MFAMethod.EMAIL_OTP:
            template = renderTemplate('email-otp-template');
            setupEmailOTPVerification(template);
            break;
        case MFAMethod.AUTHENTICATOR_APP:
            template = renderTemplate('authenticator-app-template');
            setupAuthenticatorVerification(template);
            break;
        case MFAMethod.FINGERPRINT:
            template = renderTemplate('fingerprint-template');
            setupFingerprintVerification(template);
            break;
        case MFAMethod.MPIN:
            template = renderTemplate('mpin-template');
            setupMPINVerification(template);
            break;
        default:
            console.error('Unknown MFA method:', authState.currentMFAMethod);
            return;
    }

    // Update step heading
    updateStepHeading();

    authContainer.appendChild(template);
}

/**
 * Set up SMS OTP verification
 * @param {DocumentFragment} template - The template to set up
 */
function setupSMSOTPVerification(template) {
    // Format phone number for display (hide middle digits)
    const phoneNumber = authState.user.phoneNumber;
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);

    // Set phone number display
    const phoneNumberDisplay = template.querySelector('#phone-number');
    phoneNumberDisplay.textContent = formattedPhoneNumber;

    // Autofill OTP code
    const otpInput = template.querySelector('#otp');
    otpInput.value = '123456';

    // Add event listeners
    const form = template.querySelector('#sms-otp-form');
    form.addEventListener('submit', handleSMSOTPSubmit);

    // Set up resend functionality
    setupResendOTP(template, 'SMS');
}

/**
 * Set up Email OTP verification
 * @param {DocumentFragment} template - The template to set up
 */
function setupEmailOTPVerification(template) {
    // Format email for display (hide part of the email)
    const email = authState.user.email;
    const formattedEmail = formatEmail(email);

    // Set email display
    const emailDisplay = template.querySelector('#email-address');
    emailDisplay.textContent = formattedEmail;

    // Autofill OTP code
    const otpInput = template.querySelector('#otp');
    otpInput.value = '123456';

    // Add event listeners
    const form = template.querySelector('#email-otp-form');
    form.addEventListener('submit', handleEmailOTPSubmit);

    // Set up resend functionality
    setupResendOTP(template, 'Email');
}

/**
 * Set up Authenticator App verification
 * @param {DocumentFragment} template - The template to set up
 */
function setupAuthenticatorVerification(template) {
    // Autofill authenticator code
    const codeInput = template.querySelector('#code');
    codeInput.value = '123456';

    // Add event listeners
    const form = template.querySelector('#authenticator-form');
    form.addEventListener('submit', handleAuthenticatorSubmit);
}

/**
 * Set up Fingerprint verification
 * @param {DocumentFragment} template - The template to set up
 */
function setupFingerprintVerification(template) {
    // Add event listeners
    const scanButton = template.querySelector('#scan-button');
    scanButton.addEventListener('click', handleFingerprintScan);
}

/**
 * Set up MPIN verification
 * @param {DocumentFragment} template - The template to set up
 */
function setupMPINVerification(template) {
    // Autofill MPIN code
    const mpinInput = template.querySelector('#mpin');
    mpinInput.value = '1234';

    // Add event listeners
    const form = template.querySelector('#mpin-form');
    form.addEventListener('submit', handleMPINSubmit);
}

/**
 * Set up OTP resend functionality
 * @param {DocumentFragment} template - The template to set up
 * @param {string} type - The type of OTP (SMS or Email)
 */
function setupResendOTP(template, type) {
    const timerElement = template.querySelector('#timer');
    const resendTimer = template.querySelector('#resend-timer');
    const resendButton = template.querySelector('#resend-button');

    let timeLeft = 60;

    // Update timer every second
    const timerInterval = setInterval(() => {
        timeLeft--;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            resendTimer.style.display = 'none';
            resendButton.style.display = 'block';
        } else {
            timerElement.textContent = timeLeft;
        }
    }, 1000);

    // Add event listener to resend button
    resendButton.addEventListener('click', () => {
        // Reset timer
        timeLeft = 60;
        timerElement.textContent = timeLeft;
        resendTimer.style.display = 'block';
        resendButton.style.display = 'none';

        // Restart interval
        clearInterval(timerInterval);
        setupResendOTP(template, type);

        // Show alert (in a real app, this would call an API to resend the OTP)
        alert(`A new OTP has been sent to your ${type === 'SMS' ? 'phone number' : 'email'}`);
    });
}

/**
 * Handle SMS OTP form submission
 * @param {Event} event - The form submission event
 */
async function handleSMSOTPSubmit(event) {
    event.preventDefault();

    const otpInput = document.getElementById('otp');
    const otp = otpInput.value.trim();

    // Simple validation
    if (!otp) {
        showError('OTP is required');
        return;
    }

    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
        showError('OTP must be 6 digits');
        return;
    }

    // Hide error message
    hideError();

    // Set loading state
    setLoading(true);

    try {
        // Attempt to verify OTP
        await verifyMFA({ otp }, MFAMethod.SMS_OTP);

        // If successful, move to next step
        nextStep();
    } catch (error) {
        // Show error message
        showError(error.message);
    } finally {
        // Reset loading state
        setLoading(false);
    }
}

/**
 * Handle Email OTP form submission
 * @param {Event} event - The form submission event
 */
async function handleEmailOTPSubmit(event) {
    event.preventDefault();

    const otpInput = document.getElementById('otp');
    const otp = otpInput.value.trim();

    // Simple validation
    if (!otp) {
        showError('OTP is required');
        return;
    }

    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
        showError('OTP must be 6 digits');
        return;
    }

    // Hide error message
    hideError();

    // Set loading state
    setLoading(true);

    try {
        // Attempt to verify OTP
        await verifyMFA({ otp }, MFAMethod.EMAIL_OTP);

        // If successful, move to next step
        nextStep();
    } catch (error) {
        // Show error message
        showError(error.message);
    } finally {
        // Reset loading state
        setLoading(false);
    }
}

/**
 * Handle Authenticator App form submission
 * @param {Event} event - The form submission event
 */
async function handleAuthenticatorSubmit(event) {
    event.preventDefault();

    const codeInput = document.getElementById('code');
    const code = codeInput.value.trim();

    // Simple validation
    if (!code) {
        showError('Code is required');
        return;
    }

    if (code.length !== 6 || !/^\d+$/.test(code)) {
        showError('Code must be 6 digits');
        return;
    }

    // Hide error message
    hideError();

    // Set loading state
    setLoading(true);

    try {
        // Attempt to verify code
        await verifyMFA({ code }, MFAMethod.AUTHENTICATOR_APP);

        // If successful, move to next step
        nextStep();
    } catch (error) {
        // Show error message
        showError(error.message);
    } finally {
        // Reset loading state
        setLoading(false);
    }
}

/**
 * Handle Fingerprint scan
 */
async function handleFingerprintScan() {
    // Hide error message
    hideError();

    // Get fingerprint scanner element
    const scanner = document.getElementById('fingerprint-scanner');
    const scanStatus = document.getElementById('scan-status');
    const scanButton = document.getElementById('scan-button');

    // Disable scan button
    scanButton.disabled = true;
    scanButton.textContent = 'Scanning...';

    // Add scanning class with animation
    scanner.classList.add('scanning');
    scanStatus.textContent = 'Scanning...';

    try {
        // Simulate fingerprint scan with a more realistic animation
        await new Promise(resolve => {
            // Create a pulsing effect
            let pulseCount = 0;
            const maxPulses = 3;

            const pulseInterval = setInterval(() => {
                pulseCount++;

                if (pulseCount >= maxPulses) {
                    clearInterval(pulseInterval);
                    resolve();
                }
            }, 800);
        });

        // Short pause before verification
        await new Promise(resolve => setTimeout(resolve, 500));

        // Attempt to verify fingerprint
        await verifyMFA({}, MFAMethod.FINGERPRINT);

        // If successful, move to next step
        nextStep();
    } catch (error) {
        // Show error message
        showError(error.message);

        // Remove scanning class
        scanner.classList.remove('scanning');
        scanStatus.textContent = 'Ready to scan';

        // Re-enable scan button
        scanButton.disabled = false;
        scanButton.textContent = 'Scan Fingerprint';
    } finally {
        // Reset loading state if there was an error
        if (scanner.classList.contains('scanning')) {
            scanner.classList.remove('scanning');
        }
    }
}

/**
 * Handle MPIN form submission
 * @param {Event} event - The form submission event
 */
async function handleMPINSubmit(event) {
    event.preventDefault();

    const mpinInput = document.getElementById('mpin');
    const mpin = mpinInput.value.trim();

    // Simple validation
    if (!mpin) {
        showError('MPIN is required');
        return;
    }

    if (mpin.length !== 4 || !/^\d+$/.test(mpin)) {
        showError('MPIN must be 4 digits');
        return;
    }

    // Hide error message
    hideError();

    // Set loading state
    setLoading(true);

    try {
        // Attempt to verify MPIN
        await verifyMFA({ mpin }, MFAMethod.MPIN);

        // If successful, move to next step
        nextStep();
    } catch (error) {
        // Show error message
        showError(error.message);
    } finally {
        // Reset loading state
        setLoading(false);
    }
}

/**
 * Format phone number for display (hide middle digits)
 * @param {string} phone - The phone number to format
 * @returns {string} - The formatted phone number
 */
function formatPhoneNumber(phone) {
    if (!phone) return '';

    // Simple formatting - in a real app, you'd want more robust handling
    const parts = phone.split(' ');
    if (parts.length === 2) {
        const number = parts[1];
        if (number.length > 4) {
            return `${parts[0]} ${number.substring(0, 2)}XXXX${number.substring(number.length - 4)}`;
        }
    }
    return phone;
}

/**
 * Format email for display (hide part of the email)
 * @param {string} email - The email to format
 * @returns {string} - The formatted email
 */
function formatEmail(email) {
    if (!email) return '';

    const [username, domain] = email.split('@');
    if (username && domain) {
        const hiddenUsername = username.length > 2
            ? `${username.substring(0, 2)}${'*'.repeat(username.length - 2)}`
            : username;
        return `${hiddenUsername}@${domain}`;
    }
    return email;
}
