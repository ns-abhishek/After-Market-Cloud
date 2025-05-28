/**
 * Theme Utilities
 * Handles theme management across all pages of the Customer Portal
 */

// Apply theme immediately - even before DOM is fully loaded
(function() {
    // Get saved theme preference directly
    let theme = 'default';
    try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            const preferences = JSON.parse(localStorage.getItem(`preferences_${currentUser.id}`)) || {};
            theme = preferences['dashboardTheme'] || 'default';
        }
    } catch (e) {
        console.error('Error loading theme preference:', e);
    }

    // Apply basic theme class to body immediately
    document.body.classList.remove('dark-mode', 'light-mode', 'blue-mode', 'default-mode');
    document.body.classList.add(`${theme}-mode`);
})();

// Apply theme completely when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Load and apply the saved theme
    loadAndApplyTheme();
});

/**
 * Load and apply the saved theme
 */
function loadAndApplyTheme() {
    // Get saved theme preference
    const theme = getUserPreference('dashboardTheme', 'default');

    // Apply the theme
    applyTheme(theme);

    // If we're on a page with a theme toggle in account settings, update it
    updateAccountThemeToggle(theme);
}

/**
 * Get user preference from localStorage
 * @param {string} key - The preference key
 * @param {*} defaultValue - The default value if preference doesn't exist
 * @returns {*} The preference value or default value
 */
window.getUserPreference = function(key, defaultValue) {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) return defaultValue;

    // Get user preferences
    const preferences = JSON.parse(localStorage.getItem(`preferences_${currentUser.id}`)) || {};

    // Return preference or default value
    return preferences[key] !== undefined ? preferences[key] : defaultValue;
}

/**
 * Save user preference to localStorage
 * @param {string} key - The preference key
 * @param {*} value - The preference value
 */
window.saveUserPreference = function(key, value) {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) return;

    // Get user preferences
    let preferences = JSON.parse(localStorage.getItem(`preferences_${currentUser.id}`)) || {};

    // Update preference
    preferences[key] = value;

    // Save preferences
    localStorage.setItem(`preferences_${currentUser.id}`, JSON.stringify(preferences));
}

/**
 * Apply theme to the page
 * @param {string} theme - The theme to apply ('default', 'dark', 'light', or 'blue')
 */
window.applyTheme = function(theme) {
    // Get root element
    const root = document.documentElement;

    // Add or remove theme classes from body and html
    const body = document.body;
    const html = document.documentElement;

    // Remove all theme classes
    body.classList.remove('dark-mode', 'light-mode', 'blue-mode', 'default-mode');
    html.classList.remove('dark-mode', 'light-mode', 'blue-mode', 'default-mode');

    // Add the new theme class
    body.classList.add(`${theme}-mode`);
    html.classList.add(`${theme}-mode`);

    // Apply theme
    switch (theme) {
        case 'dark':
            // Dark mode - true black and white theme
            root.style.setProperty('--primary-color', '#ffffff');
            root.style.setProperty('--secondary-color', '#cccccc');
            root.style.setProperty('--accent-color', '#999999');
            root.style.setProperty('--background-color', '#121212');
            root.style.setProperty('--text-color', '#ffffff');
            root.style.setProperty('--border-color', '#333333');
            root.style.setProperty('--shadow', '0 2px 10px rgba(0, 0, 0, 0.5)');

            // Widget and card backgrounds
            root.style.setProperty('--widget-bg', '#1e1e1e');
            root.style.setProperty('--header-bg', '#1e1e1e');
            root.style.setProperty('--sidebar-bg', '#1e1e1e');
            root.style.setProperty('--hover-bg', '#333333');

            // Update success, warning, danger colors for dark mode
            root.style.setProperty('--success-color', '#4caf50');
            root.style.setProperty('--warning-color', '#ff9800');
            root.style.setProperty('--danger-color', '#f44336');
            root.style.setProperty('--info-color', '#2196f3');
            break;

        case 'light':
            root.style.setProperty('--primary-color', '#555555');
            root.style.setProperty('--secondary-color', '#777777');
            root.style.setProperty('--accent-color', '#999999');
            root.style.setProperty('--background-color', '#f9f9f9');
            root.style.setProperty('--text-color', '#333333');
            root.style.setProperty('--border-color', '#e0e0e0');
            root.style.setProperty('--shadow', '0 2px 10px rgba(0, 0, 0, 0.1)');

            // Widget and card backgrounds
            root.style.setProperty('--widget-bg', '#ffffff');
            root.style.setProperty('--header-bg', '#ffffff');
            root.style.setProperty('--sidebar-bg', '#ffffff');
            root.style.setProperty('--hover-bg', '#f5f5f5');

            // Reset default colors
            root.style.setProperty('--success-color', '#28a745');
            root.style.setProperty('--warning-color', '#ffc107');
            root.style.setProperty('--danger-color', '#dc3545');
            root.style.setProperty('--info-color', '#17a2b8');
            break;

        case 'blue':
            root.style.setProperty('--primary-color', '#1890ff');
            root.style.setProperty('--secondary-color', '#096dd9');
            root.style.setProperty('--accent-color', '#40a9ff');
            root.style.setProperty('--background-color', '#ffffff');
            root.style.setProperty('--text-color', '#333333');
            root.style.setProperty('--border-color', '#e0e0e0');
            root.style.setProperty('--shadow', '0 2px 10px rgba(0, 0, 0, 0.1)');

            // Widget and card backgrounds
            root.style.setProperty('--widget-bg', '#ffffff');
            root.style.setProperty('--header-bg', '#ffffff');
            root.style.setProperty('--sidebar-bg', '#ffffff');
            root.style.setProperty('--hover-bg', '#f0f7ff');

            // Reset default colors
            root.style.setProperty('--success-color', '#28a745');
            root.style.setProperty('--warning-color', '#ffc107');
            root.style.setProperty('--danger-color', '#dc3545');
            root.style.setProperty('--info-color', '#17a2b8');
            break;

        default: // Default black and white theme
            root.style.setProperty('--primary-color', '#000000');
            root.style.setProperty('--secondary-color', '#333333');
            root.style.setProperty('--accent-color', '#555555');
            root.style.setProperty('--background-color', '#ffffff');
            root.style.setProperty('--text-color', '#333333');
            root.style.setProperty('--border-color', '#e0e0e0');
            root.style.setProperty('--shadow', '0 2px 10px rgba(0, 0, 0, 0.1)');

            // Widget and card backgrounds
            root.style.setProperty('--widget-bg', '#ffffff');
            root.style.setProperty('--header-bg', '#ffffff');
            root.style.setProperty('--sidebar-bg', '#ffffff');
            root.style.setProperty('--hover-bg', '#f5f5f5');

            // Reset default colors
            root.style.setProperty('--success-color', '#28a745');
            root.style.setProperty('--warning-color', '#ffc107');
            root.style.setProperty('--danger-color', '#dc3545');
            root.style.setProperty('--info-color', '#17a2b8');
            break;
    }

    // Update theme toggle button if it exists
    updateThemeToggleButton(theme);

    // Save theme preference to localStorage
    saveUserPreference('dashboardTheme', theme);
}

/**
 * Update theme toggle button in the user menu
 * @param {string} theme - The current theme
 */
function updateThemeToggleButton(theme) {
    const themeToggleLink = document.getElementById('theme-toggle');
    if (!themeToggleLink) return;

    const isDarkMode = theme === 'dark';
    themeToggleLink.innerHTML = `
        <i class="fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}"></i>
        ${isDarkMode ? 'Light Mode' : 'Dark Mode'}
    `;
}

/**
 * Update the dark mode toggle in account settings
 * @param {string} theme - The current theme
 */
function updateAccountThemeToggle(theme) {
    // Find all dark mode toggles in account settings
    const darkModeToggles = document.querySelectorAll('#preferences .toggle-switch input');

    if (darkModeToggles.length > 0) {
        // Look for the Dark Mode toggle by finding its label
        darkModeToggles.forEach(toggle => {
            const toggleLabel = toggle.closest('.security-option')?.querySelector('h4');
            if (toggleLabel && toggleLabel.textContent.includes('Dark Mode')) {
                toggle.checked = theme === 'dark';
            }
        });
    }
}
