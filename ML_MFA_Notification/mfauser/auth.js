/**
 * Authentication state
 */
const authState = {
    isAuthenticated: false,
    user: null,
    username: '',
    password: '',
    currentStep: 1,
    totalSteps: 2, // Default to 2 (username/password + 1 MFA)
    mfaConfig: null,
    currentMFAMethod: null,
    error: null,
    loading: false
};

/**
 * Initialize the authentication flow
 */
function initAuth() {
    // Start with the combined login form
    renderLoginForm();
}

/**
 * Render a template by ID
 * @param {string} templateId - The ID of the template to render
 * @returns {HTMLElement} - The rendered template
 */
function renderTemplate(templateId) {
    const template = document.getElementById(templateId);
    if (!template) {
        console.error(`Template with ID ${templateId} not found`);
        return null;
    }

    return template.content.cloneNode(true);
}

/**
 * Clear the auth container
 */
function clearAuthContainer() {
    const authContainer = document.getElementById('auth-container');
    authContainer.innerHTML = '';
}

/**
 * Show an error message
 * @param {string} message - The error message to show
 */
function showError(message) {
    const errorElement = document.querySelector('.error-message');
    if (errorElement) {
        // Check if the message is a key in the translations
        if (window.translations && window.currentLanguage) {
            const lang = window.translations[window.currentLanguage].login;

            if (message === 'Username is required' && lang.usernameRequired) {
                message = lang.usernameRequired;
            } else if (message === 'Password is required' && lang.passwordRequired) {
                message = lang.passwordRequired;
            } else if (message === 'Invalid password' && lang.invalidPassword) {
                message = lang.invalidPassword;
            }
        }

        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

/**
 * Hide the error message
 */
function hideError() {
    const errorElement = document.querySelector('.error-message');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

/**
 * Set loading state
 * @param {boolean} isLoading - Whether the app is loading
 */
function setLoading(isLoading) {
    authState.loading = isLoading;

    // Disable/enable all buttons and inputs
    const buttons = document.querySelectorAll('button');
    const inputs = document.querySelectorAll('input');

    buttons.forEach(button => {
        button.disabled = isLoading;
    });

    inputs.forEach(input => {
        input.disabled = isLoading;
    });

    // Update button text if it's a submit button
    const submitButtons = document.querySelectorAll('button[type="submit"]');
    submitButtons.forEach(button => {
        if (isLoading) {
            button.dataset.originalText = button.textContent;
            button.textContent = 'Please wait...';
        } else if (button.dataset.originalText) {
            button.textContent = button.dataset.originalText;
        }
    });
}

/**
 * Render the progress indicator
 */
function renderProgressIndicator() {
    // Only render if we're past the username/password step
    if (authState.currentStep <= 1) {
        return;
    }

    const authContainer = document.getElementById('auth-container');
    const progressIndicator = renderTemplate('progress-indicator-template');

    const progressSteps = progressIndicator.querySelector('#progress-steps');
    const progressLabels = progressIndicator.querySelector('#progress-labels');

    // Create the progress line
    const progressLine = document.createElement('div');
    progressLine.className = 'progress-line';
    progressSteps.appendChild(progressLine);

    const progressLineActive = document.createElement('div');
    progressLineActive.className = 'progress-line-active';
    progressSteps.appendChild(progressLineActive);

    // Add steps
    for (let i = 1; i <= authState.totalSteps; i++) {
        const step = document.createElement('div');
        step.className = `progress-step ${i <= authState.currentStep ? 'active' : ''}`;
        step.textContent = i;
        progressSteps.appendChild(step);

        // Add label
        const label = document.createElement('div');
        if (i === 1) {
            label.textContent = 'Login';
        } else if (i === 2) {
            label.textContent = 'Step 1';
        } else if (i === 3) {
            label.textContent = 'Step 2';
        } else {
            label.textContent = 'Step 3';
        }
        progressLabels.appendChild(label);
    }

    // Calculate active line width
    const activePercentage = ((authState.currentStep - 1) / (authState.totalSteps - 1)) * 100;
    progressLineActive.style.width = `${activePercentage}%`;

    // Insert at the beginning of the auth container
    authContainer.insertBefore(progressIndicator, authContainer.firstChild);
}

/**
 * Update the step heading based on the current step
 */
function updateStepHeading() {
    const stepHeading = document.getElementById('step-heading');
    if (!stepHeading) return;

    let headingText = 'Verification Required';

    switch (authState.currentStep) {
        case 2:
            headingText = 'Additional Verification';
            break;
        case 3:
            headingText = 'Final Verification';
            break;
        case 4:
            headingText = 'Final Verification';
            break;
    }

    stepHeading.textContent = headingText;
}

/**
 * Find a user by username
 * @param {string} username - The username to find
 * @returns {Object|null} - The user object or null if not found
 */
function findUserByUsername(username) {
    return mockUsers.find(user => user.username === username) || null;
}

/**
 * Mock login function - in a real app, this would call an API
 * @param {string} username - The username
 * @param {string} password - The password
 * @returns {Promise} - A promise that resolves when the login is complete
 */
function login(username, password) {
    return new Promise((resolve, reject) => {
        // Simulate API call
        setTimeout(() => {
            // Find the user
            const user = findUserByUsername(username);

            // Check if user exists and password matches
            if (user && password === user.password) {
                // Update auth state
                authState.user = user;
                authState.mfaConfig = user.mfaConfig;
                authState.totalSteps = user.mfaConfig.totalFactors;
                authState.currentStep = 2; // Move to the first MFA step after username/password
                authState.currentMFAMethod = user.mfaConfig.methods[0];

                resolve();
            } else {
                reject(new Error('Invalid username or password.'));
            }
        }, 1000);
    });
}

/**
 * Mock MFA verification function - in a real app, this would call an API
 * @param {any} data - The verification data
 * @param {string} method - The MFA method
 * @returns {Promise} - A promise that resolves when the verification is complete
 */
function verifyMFA(data, method) {
    return new Promise((resolve, reject) => {
        // Simulate API call
        setTimeout(() => {
            let isValid = false;

            switch (method) {
                case MFAMethod.SMS_OTP:
                    isValid = data.otp === mockVerificationCodes.SMS_OTP;
                    break;
                case MFAMethod.EMAIL_OTP:
                    isValid = data.otp === mockVerificationCodes.EMAIL_OTP;
                    break;
                case MFAMethod.AUTHENTICATOR_APP:
                    isValid = data.code === mockVerificationCodes.AUTHENTICATOR_APP;
                    break;
                case MFAMethod.MPIN:
                    isValid = data.mpin === mockVerificationCodes.MPIN;
                    break;
                case MFAMethod.FINGERPRINT:
                    isValid = true; // Mock fingerprint always succeeds
                    break;
                default:
                    isValid = false;
            }

            if (isValid) {
                resolve();
            } else {
                reject(new Error('Verification failed. Please try again.'));
            }
        }, 1000);
    });
}

/**
 * Move to the next step in the authentication flow
 */
function nextStep() {
    const nextStep = authState.currentStep + 1;
    const nextMFAMethodIndex = nextStep - 2; // Adjust for 1-based indexing and username/password step

    authState.currentStep = nextStep;

    if (nextMFAMethodIndex < authState.mfaConfig.methods.length) {
        authState.currentMFAMethod = authState.mfaConfig.methods[nextMFAMethodIndex];
        renderMFAVerification();
    } else {
        // All steps completed, user is authenticated
        authState.isAuthenticated = true;
        renderAuthSuccess();
    }
}

/**
 * Reset the authentication state
 */
function resetAuth() {
    // Reset auth state
    authState.isAuthenticated = false;
    authState.user = null;
    authState.username = '';
    authState.password = '';
    authState.currentStep = 1;
    authState.totalSteps = 2;
    authState.mfaConfig = null;
    authState.currentMFAMethod = null;
    authState.error = null;
    authState.loading = false;

    // Start over with the login form
    renderLoginForm();
}

/**
 * Render the authentication success screen
 */
function renderAuthSuccess() {
    clearAuthContainer();

    const authContainer = document.getElementById('auth-container');
    const successTemplate = renderTemplate('auth-success-template');

    // Add event listener to logout button
    const logoutButton = successTemplate.querySelector('#logout-button');
    logoutButton.addEventListener('click', resetAuth);

    authContainer.appendChild(successTemplate);
}
