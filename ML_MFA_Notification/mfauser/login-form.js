/**
 * Render the login form
 */
function renderLoginForm() {
    // Clear the auth container
    const authContainer = document.getElementById('auth-container');
    authContainer.innerHTML = '';

    // Get the login container
    const loginContainer = document.querySelector('.login-container');
    loginContainer.style.display = 'block';

    // Clear the login container
    loginContainer.innerHTML = '';

    // Render the login form template
    const loginFormTemplate = renderTemplate('login-form-template');

    // Add event listener to form
    const form = loginFormTemplate.querySelector('#login-form');
    form.addEventListener('submit', handleLoginSubmit);

    // Password input reference
    const passwordInput = loginFormTemplate.querySelector('#password');

    // Add password visibility toggle functionality
    const togglePasswordButton = loginFormTemplate.querySelector('#toggle-password');
    togglePasswordButton.addEventListener('click', togglePasswordVisibility);

    // Store a reference to the toggle button globally so it can be accessed after language changes
    window.passwordToggleButton = togglePasswordButton;
    window.passwordInput = passwordInput;

    // Add "Remember me" functionality
    const rememberMeCheckbox = loginFormTemplate.querySelector('#remember-me');

    // Autofill username with "user3" and password with "Password@123"
    const usernameInput = loginFormTemplate.querySelector('#username');
    usernameInput.value = 'user3';
    passwordInput.value = 'Password@123';
    rememberMeCheckbox.checked = true;

    // Add "Forgot password" functionality
    const forgotPasswordLink = loginFormTemplate.querySelector('.forgot-password');
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        showForgotPasswordMessage();
    });

    // Append the login form to the login container instead of the auth container
    loginContainer.appendChild(loginFormTemplate);

    // Ensure theme manager is initialized
    if (window.themeManager) {
        setTimeout(() => {
            window.themeManager.register();
            window.themeManager.addHoverEffects();
        }, 100);
    }
}

/**
 * Handle login form submission
 * @param {Event} event - The form submission event
 */
async function handleLoginSubmit(event) {
    event.preventDefault();

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // Simple validation
    if (!username) {
        showError('Username is required');
        return;
    }

    if (!password) {
        showError('Password is required');
        return;
    }

    // Password validation is handled silently
    const isPasswordValid = validatePasswordSilently(password);

    if (!isPasswordValid) {
        showError('Invalid password');
        return;
    }

    // Store username in auth state
    authState.username = username;
    authState.password = password;

    // Handle "Remember me" functionality
    const rememberMeCheckbox = document.getElementById('remember-me');
    if (rememberMeCheckbox.checked) {
        localStorage.setItem('rememberedUsername', username);
    } else {
        localStorage.removeItem('rememberedUsername');
    }

    // Hide error message
    hideError();

    // Set loading state
    setLoading(true);

    try {
        // Attempt to log in
        await login(username, password);

        // Hide the login container
        const loginContainer = document.querySelector('.login-container');
        if (loginContainer) {
            loginContainer.style.display = 'none';
        }

        // Hide only the language selector, keep the floating theme toggle
        const topControls = document.querySelector('.top-controls');
        if (topControls) {
            topControls.style.display = 'none';
        }

        // Make sure the floating theme toggle stays visible
        const floatingThemeToggle = document.querySelector('.floating-theme-toggle');
        if (floatingThemeToggle) {
            floatingThemeToggle.style.display = 'flex';
        }

        // If successful, render unified MFA verification
        renderUnifiedMFA();
    } catch (error) {
        // Show error message
        showError(error.message);
    } finally {
        // Reset loading state
        setLoading(false);
    }
}

/**
 * Validate password against requirements without visual feedback
 * @param {string} password - The password to validate
 * @returns {boolean} - Whether the password is valid
 */
function validatePasswordSilently(password) {
    // Check each requirement
    const hasLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?]/.test(password);

    // Return overall validity
    return hasLength && hasUppercase && hasLowercase && hasNumber && hasSpecial;
}

/**
 * Toggle password visibility
 */
function togglePasswordVisibility() {
    // Get the current password input (might be different after language change)
    const passwordInput = this.closest('.password-input-container').querySelector('input') || window.passwordInput;

    // Toggle the type attribute
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    // Update the eye icon appearance
    const eyeIcon = this.querySelector('.eye-icon-svg');

    if (type === 'password') {
        // When password is hidden
        eyeIcon.classList.remove('visible');
    } else {
        // When password is visible
        eyeIcon.classList.add('visible');
    }
}

// Make the function globally accessible
window.togglePasswordVisibility = togglePasswordVisibility;

/**
 * Show a message for the forgot password functionality
 */
function showForgotPasswordMessage() {
    // In a real application, this would open a password reset flow
    // For this demo, we'll just show a message
    const errorContainer = document.querySelector('.error-message');

    let message = 'Password reset functionality would be implemented here. For testing, use Password@123';

    // Use translated message if available
    if (window.translations && window.currentLanguage) {
        const lang = window.translations[window.currentLanguage].login;
        if (lang.passwordResetMessage) {
            message = lang.passwordResetMessage;
        }
    }

    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
    errorContainer.style.color = 'var(--primary-color)';

    // Hide the message after 5 seconds
    setTimeout(() => {
        errorContainer.style.display = 'none';
        errorContainer.style.color = '';
    }, 5000);
}
