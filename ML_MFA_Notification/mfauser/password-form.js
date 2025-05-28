/**
 * Render the password form
 */
function renderPasswordForm() {
    clearAuthContainer();

    const authContainer = document.getElementById('auth-container');
    const passwordFormTemplate = renderTemplate('password-form-template');

    // Set username display
    const usernameDisplay = passwordFormTemplate.querySelector('#username-display');
    usernameDisplay.textContent = authState.username;

    // Find the user
    const user = findUserByUsername(authState.username);

    // Pre-fill the password field if the user exists
    const passwordInput = passwordFormTemplate.querySelector('#password');
    if (user) {
        passwordInput.value = user.password;
    }

    // Add event listeners
    const form = passwordFormTemplate.querySelector('#password-form');
    form.addEventListener('submit', handlePasswordSubmit);

    const backButton = passwordFormTemplate.querySelector('#back-button');
    backButton.addEventListener('click', renderUsernameForm);

    // No password hint displayed

    authContainer.appendChild(passwordFormTemplate);
}

/**
 * Handle password form submission
 * @param {Event} event - The form submission event
 */
async function handlePasswordSubmit(event) {
    event.preventDefault();

    const passwordInput = document.getElementById('password');
    const password = passwordInput.value.trim();

    // Simple validation
    if (!password) {
        showError('Password is required');
        return;
    }

    // Store password in auth state
    authState.password = password;

    // Hide error message
    hideError();

    // Set loading state
    setLoading(true);

    try {
        // Attempt to log in
        await login(authState.username, authState.password);

        // If successful, render MFA verification
        renderMFAVerification();
    } catch (error) {
        // Show error message
        showError(error.message);
    } finally {
        // Reset loading state
        setLoading(false);
    }
}
