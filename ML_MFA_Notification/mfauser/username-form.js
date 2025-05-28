/**
 * Render the username form
 */
function renderUsernameForm() {
    clearAuthContainer();

    const authContainer = document.getElementById('auth-container');
    const usernameFormTemplate = renderTemplate('username-form-template');

    // Add event listener to form
    const form = usernameFormTemplate.querySelector('#username-form');
    form.addEventListener('submit', handleUsernameSubmit);

    // Add a small hint about available users (without showing details)
    const formGroup = usernameFormTemplate.querySelector('.form-group');
    const hint = document.createElement('div');
    hint.className = 'credentials-hint';
    hint.innerHTML = 'For testing: <span style="color: var(--primary-color); font-weight: 500;">user1</span>, <span style="color: var(--primary-color); font-weight: 500;">user2</span>, or <span style="color: var(--primary-color); font-weight: 500;">user3</span>';
    formGroup.appendChild(hint);

    authContainer.appendChild(usernameFormTemplate);
}

/**
 * Handle username form submission
 * @param {Event} event - The form submission event
 */
function handleUsernameSubmit(event) {
    event.preventDefault();

    const usernameInput = document.getElementById('username');
    const username = usernameInput.value.trim();

    // Simple validation
    if (!username) {
        showError('Username is required');
        return;
    }

    // Store username in auth state
    authState.username = username;

    // Hide error message
    hideError();

    // Render password form
    renderPasswordForm();
}
