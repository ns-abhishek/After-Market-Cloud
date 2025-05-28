/**
 * Unified MFA verification system
 * Shows all required verification methods on a single page after login
 */

/**
 * Render the unified MFA verification page with all required methods
 */
function renderUnifiedMFA() {
    clearAuthContainer();

    const authContainer = document.getElementById('auth-container');

    // Make sure the auth container is visible
    authContainer.style.display = 'block';

    // Create the unified MFA container
    const unifiedMFAContainer = document.createElement('div');
    unifiedMFAContainer.className = 'unified-mfa-container';
    unifiedMFAContainer.style.display = 'block'; // Ensure it's visible

    // Add MFA Verification heading
    const heading = document.createElement('h1');
    heading.className = 'mfa-heading';
    heading.textContent = 'MFA Verification';
    unifiedMFAContainer.appendChild(heading);

    // Create the verification steps container
    const stepsContainer = document.createElement('div');
    stepsContainer.className = 'verification-steps';
    stepsContainer.style.display = 'flex'; // Ensure it's visible

    // Ensure theme manager is initialized
    if (window.themeManager) {
        setTimeout(() => {
            window.themeManager.register();
            window.themeManager.addHoverEffects();
        }, 100);
    }

    // Factor heading removed as requested

    // Add each verification method
    authState.mfaConfig.methods.forEach((method, index) => {
        const stepElement = document.createElement('div');
        stepElement.className = 'verification-step';
        stepElement.id = `step-${index}`;
        stepElement.style.display = 'flex'; // Ensure it's visible
        stepElement.style.overflow = 'visible'; // Ensure content is visible

        // First step is active, others are inactive
        if (index === 0) {
            stepElement.classList.add('active');
        }

        // Add step number
        const stepNumber = document.createElement('div');
        stepNumber.className = 'step-number';
        stepNumber.textContent = index + 1;
        stepElement.appendChild(stepNumber);

        // Add step title
        const stepTitle = document.createElement('h3');
        stepTitle.className = 'verification-step-title';
        stepTitle.textContent = `${getMethodDisplayName(method)} Verification`;
        stepElement.appendChild(stepTitle);

        // Add step content container
        const stepContent = document.createElement('div');
        stepContent.className = 'verification-step-content';
        stepContent.style.display = 'flex';
        stepContent.style.flexDirection = 'column';
        stepContent.style.alignItems = 'center';
        stepContent.style.justifyContent = 'flex-start';
        stepContent.style.width = '100%';
        stepContent.style.height = '100%';
        stepContent.style.overflow = 'visible';
        stepElement.appendChild(stepContent);

        // Add success indicator for completed steps
        const successIndicator = document.createElement('div');
        successIndicator.className = 'success-indicator';
        successIndicator.textContent = '✓';
        stepElement.appendChild(successIndicator);

        // If this is not the active step, add an overlay to disable interaction
        if (index !== 0) {
            const overlay = document.createElement('div');
            overlay.className = 'step-overlay';
            overlay.style.position = 'absolute';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.right = '0';
            overlay.style.bottom = '0';
            overlay.style.backgroundColor = 'var(--bg-color)';
            overlay.style.opacity = '0.7';
            overlay.style.display = 'flex';
            overlay.style.alignItems = 'center';
            overlay.style.justifyContent = 'center';
            overlay.style.zIndex = '5';

            const lockIcon = document.createElement('div');
            lockIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>';
            lockIcon.style.opacity = '0.5';

            overlay.appendChild(lockIcon);
            stepElement.appendChild(overlay);
        }

        // Add the step to the container
        stepsContainer.appendChild(stepElement);

        // Render the specific verification method content
        renderVerificationMethodContent(method, stepContent, index);
    });

    unifiedMFAContainer.appendChild(stepsContainer);
    authContainer.appendChild(unifiedMFAContainer);
}

/**
 * Render the content for a specific verification method
 * @param {string} method - The verification method
 * @param {HTMLElement} container - The container to render into
 * @param {number} stepIndex - The step index
 */
function renderVerificationMethodContent(method, container, stepIndex) {
    if (!container) {
        console.error('Container not found for rendering verification method');
        return;
    }

    // Clear the container
    container.innerHTML = '';

    // Method description removed as requested

    // Get MFAMethod from the global scope
    const MFAMethod = window.MFAMethod;

    // Render the appropriate template based on the method
    let template;
    let templateId = `${method.toLowerCase().replace('_', '-')}-template`;

    template = document.getElementById(templateId);

    if (!template) {
        console.error(`Template not found: ${templateId}`);
        return;
    }

    const content = template.content.cloneNode(true);
    container.appendChild(content);

    // Set up the verification method
    setupVerificationMethod(method, container, stepIndex);
}

/**
 * Set up a verification method
 * @param {string} method - The verification method
 * @param {HTMLElement} container - The container with the method content
 * @param {number} stepIndex - The step index
 */
function setupVerificationMethod(method, container, stepIndex) {
    switch (method) {
        case MFAMethod.SMS_OTP:
            setupSMSOTPVerification(container, stepIndex);
            break;
        case MFAMethod.EMAIL_OTP:
            setupEmailOTPVerification(container, stepIndex);
            break;
        case MFAMethod.AUTHENTICATOR_APP:
            setupAuthenticatorVerification(container, stepIndex);
            break;
        case MFAMethod.FINGERPRINT:
            setupFingerprintVerification(container, stepIndex);
            break;
        case MFAMethod.MPIN:
            setupMPINVerification(container, stepIndex);
            break;
    }
}

/**
 * Set up SMS OTP verification
 * @param {HTMLElement} container - The container with the method content
 * @param {number} stepIndex - The step index
 */
function setupSMSOTPVerification(container, stepIndex) {
    // Format phone number for display (hide middle digits)
    const phoneNumber = authState.user.phoneNumber;
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);

    // Set phone number display
    const phoneNumberDisplay = container.querySelector('#phone-number');
    if (phoneNumberDisplay) {
        phoneNumberDisplay.textContent = formattedPhoneNumber;
    }

    // Add event listeners
    const form = container.querySelector('#sms-otp-form');
    if (form) {
        form.addEventListener('submit', (event) => handleVerificationSubmit(event, MFAMethod.SMS_OTP, stepIndex));
    }

    // Set up resend functionality
    setupResendOTP(container, 'SMS');
}

/**
 * Set up Email OTP verification
 * @param {HTMLElement} container - The container with the method content
 * @param {number} stepIndex - The step index
 */
function setupEmailOTPVerification(container, stepIndex) {
    // Format email for display (hide part of the email)
    const email = authState.user.email;
    const formattedEmail = formatEmail(email);

    // Set email display
    const emailDisplay = container.querySelector('#email-address');
    if (emailDisplay) {
        emailDisplay.textContent = formattedEmail;
    }

    // Add event listeners
    const form = container.querySelector('#email-otp-form');
    if (form) {
        form.addEventListener('submit', (event) => handleVerificationSubmit(event, MFAMethod.EMAIL_OTP, stepIndex));
    }

    // Set up resend functionality
    setupResendOTP(container, 'Email');
}

/**
 * Set up Authenticator App verification
 * @param {HTMLElement} container - The container with the method content
 * @param {number} stepIndex - The step index
 */
function setupAuthenticatorVerification(container, stepIndex) {
    // Add event listeners
    const form = container.querySelector('#authenticator-form');
    if (form) {
        form.addEventListener('submit', (event) => handleVerificationSubmit(event, MFAMethod.AUTHENTICATOR_APP, stepIndex));
    }
}

/**
 * Set up Fingerprint verification
 * @param {HTMLElement} container - The container with the method content
 * @param {number} stepIndex - The step index
 */
function setupFingerprintVerification(container, stepIndex) {
    // Add event listeners
    const scanButton = container.querySelector('#scan-button');
    if (scanButton) {
        scanButton.addEventListener('click', () => handleFingerprintScan(stepIndex));
    }
}

/**
 * Set up MPIN verification
 * @param {HTMLElement} container - The container with the method content
 * @param {number} stepIndex - The step index
 */
function setupMPINVerification(container, stepIndex) {
    // Add event listeners
    const form = container.querySelector('#mpin-form');
    if (form) {
        form.addEventListener('submit', (event) => handleVerificationSubmit(event, MFAMethod.MPIN, stepIndex));
    }
}

/**
 * Handle verification form submission
 * @param {Event} event - The form submission event
 * @param {string} method - The verification method
 * @param {number} stepIndex - The step index
 */
async function handleVerificationSubmit(event, method, stepIndex) {
    event.preventDefault();

    let data = {};
    let isValid = true;

    // Get the verification data based on the method
    switch (method) {
        case MFAMethod.SMS_OTP:
        case MFAMethod.EMAIL_OTP:
            const otpInput = event.target.querySelector('input[name="otp"]');
            const otp = otpInput ? otpInput.value.trim() : '';

            if (!otp) {
                showError('OTP is required');
                isValid = false;
            } else if (otp.length !== 6 || !/^\d+$/.test(otp)) {
                showError('OTP must be 6 digits');
                isValid = false;
            }

            data = { otp };
            break;

        case MFAMethod.AUTHENTICATOR_APP:
            const codeInput = event.target.querySelector('input[name="code"]');
            const code = codeInput ? codeInput.value.trim() : '';

            if (!code) {
                showError('Code is required');
                isValid = false;
            } else if (code.length !== 6 || !/^\d+$/.test(code)) {
                showError('Code must be 6 digits');
                isValid = false;
            }

            data = { code };
            break;

        case MFAMethod.MPIN:
            const mpinInput = event.target.querySelector('input[name="mpin"]');
            const mpin = mpinInput ? mpinInput.value.trim() : '';

            if (!mpin) {
                showError('MPIN is required');
                isValid = false;
            } else if (mpin.length !== 4 || !/^\d+$/.test(mpin)) {
                showError('MPIN must be 4 digits');
                isValid = false;
            }

            data = { mpin };
            break;
    }

    if (!isValid) {
        return;
    }

    // Hide error message
    hideError();

    // Set loading state
    setLoading(true);

    try {
        // Attempt to verify
        await verifyMFA(data, method);

        // If successful, mark this step as completed and activate the next step
        completeStep(stepIndex);

        // If this is the last step, show success
        if (stepIndex === authState.mfaConfig.methods.length - 1) {
            // All steps completed, user is authenticated
            authState.isAuthenticated = true;
            setTimeout(() => {
                renderAuthSuccess();
            }, 1000);
        } else {
            // Activate the next step
            activateStep(stepIndex + 1);
        }
    } catch (error) {
        // Show error message
        showError(error.message);
    } finally {
        // Reset loading state
        setLoading(false);
    }
}

/**
 * Handle fingerprint scan
 * @param {number} stepIndex - The step index
 */
async function handleFingerprintScan(stepIndex) {
    // Hide error message
    hideError();

    // Get fingerprint scanner element
    const stepElement = document.getElementById(`step-${stepIndex}`);
    const scanner = stepElement.querySelector('#fingerprint-scanner');
    const scanStatus = stepElement.querySelector('#scan-status');
    const scanButton = stepElement.querySelector('#scan-button');

    if (!scanner || !scanStatus || !scanButton) {
        console.error('Fingerprint scanner elements not found');
        return;
    }

    // Disable scan button
    scanButton.disabled = true;
    scanButton.textContent = 'Scanning...';

    // Add scanning class with animation
    scanner.classList.add('scanning');
    scanStatus.textContent = 'Scanning...';

    try {
        // Simulate fingerprint scan with a shorter animation
        await new Promise(resolve => {
            // Create a pulsing effect
            let pulseCount = 0;
            const maxPulses = 2; // Reduced from 3 to 2 for faster response

            const pulseInterval = setInterval(() => {
                pulseCount++;

                if (pulseCount >= maxPulses) {
                    clearInterval(pulseInterval);
                    resolve();
                }
            }, 500); // Reduced from 800ms to 500ms
        });

        // Short pause before verification
        await new Promise(resolve => setTimeout(resolve, 300)); // Reduced from 500ms to 300ms

        // Set user as authenticated immediately
        authState.isAuthenticated = true;

        // Directly render the success page without going through other steps
        renderAuthSuccess();

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
 * Mark a step as completed
 * @param {number} stepIndex - The step index
 */
function completeStep(stepIndex) {
    // Get the step element
    const stepElement = document.getElementById(`step-${stepIndex}`);
    if (!stepElement) {
        console.error(`Step element not found: step-${stepIndex}`);
        return;
    }

    // Mark the step as completed
    stepElement.classList.remove('active');
    stepElement.classList.add('completed');

    // Add a success animation
    const successAnimation = document.createElement('div');
    successAnimation.className = 'success-animation';
    successAnimation.style.position = 'absolute';
    successAnimation.style.top = '0';
    successAnimation.style.left = '0';
    successAnimation.style.right = '0';
    successAnimation.style.bottom = '0';
    successAnimation.style.backgroundColor = 'rgba(var(--success-color-rgb, 5, 255, 161), 0.1)';
    successAnimation.style.display = 'flex';
    successAnimation.style.alignItems = 'center';
    successAnimation.style.justifyContent = 'center';
    successAnimation.style.zIndex = '10';
    successAnimation.style.opacity = '0';
    successAnimation.style.transition = 'opacity 0.5s ease';

    const checkmark = document.createElement('div');
    checkmark.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--success-color)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    checkmark.style.transform = 'scale(0)';
    checkmark.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

    successAnimation.appendChild(checkmark);
    stepElement.appendChild(successAnimation);

    // Show the animation
    setTimeout(() => {
        successAnimation.style.opacity = '1';
        checkmark.style.transform = 'scale(1)';

        // Hide the animation after a delay
        setTimeout(() => {
            successAnimation.style.opacity = '0';

            // Remove the animation element after it fades out
            setTimeout(() => {
                successAnimation.remove();
            }, 500);
        }, 1000);
    }, 10);

    // Show a toast notification
    const toast = document.createElement('div');
    toast.textContent = `Step ${stepIndex + 1} verified successfully!`;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = 'var(--success-color)';
    toast.style.color = '#333';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '4px';
    toast.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
    toast.style.zIndex = '2000';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';

    document.body.appendChild(toast);

    // Show the toast
    setTimeout(() => {
        toast.style.opacity = '1';
    }, 10);

    // Hide and remove the toast after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

/**
 * Activate a step
 * @param {number} stepIndex - The step index
 */
function activateStep(stepIndex) {
    // Get the step element
    const stepElement = document.getElementById(`step-${stepIndex}`);
    if (!stepElement) {
        console.error(`Step element not found: step-${stepIndex}`);
        return;
    }

    // Remove the overlay
    const overlay = stepElement.querySelector('.step-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }

    // Mark the step as active
    stepElement.classList.add('active');

    // Scroll to the step
    stepElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Get the display name for a verification method
 * @param {string} method - The verification method
 * @returns {string} - The display name
 */
function getMethodDisplayName(method) {
    switch (method) {
        case MFAMethod.SMS_OTP:
            return 'SMS';
        case MFAMethod.EMAIL_OTP:
            return 'Email';
        case MFAMethod.AUTHENTICATOR_APP:
            return 'Authenticator App';
        case MFAMethod.FINGERPRINT:
            return 'Fingerprint';
        case MFAMethod.MPIN:
            return 'MPIN';
        default:
            return method;
    }
}

/**
 * Set up OTP resend functionality
 * @param {HTMLElement} container - The container with the method content
 * @param {string} type - The type of OTP (SMS or Email)
 */
function setupResendOTP(container, type) {
    const timerElement = container.querySelector('#timer');
    const resendTimer = container.querySelector('#resend-timer');
    const resendButton = container.querySelector('#resend-button');

    if (!timerElement || !resendTimer || !resendButton) {
        return;
    }

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
        setupResendOTP(container, type);

        // Show alert (in a real app, this would call an API to resend the OTP)
        alert(`A new OTP has been sent to your ${type === 'SMS' ? 'phone number' : 'email'}`);
    });
}
