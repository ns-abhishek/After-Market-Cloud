/**
 * Theme Manager
 * Centralized theme management system to ensure consistent theme across all pages
 */

// Global theme state
window.themeState = {
    currentTheme: 'light', // Default theme
    toggleElements: [] // Will store references to all toggle elements
};

/**
 * Initialize the theme manager
 */
function initThemeManager() {
    // Check for saved theme preference or use device preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Set initial theme based on saved preference or device preference
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
        setTheme('dark');
    } else {
        setTheme('light');
    }
    
    // Find and register all theme toggle elements
    registerThemeToggles();
    
    // Listen for theme preference changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
}

/**
 * Register all theme toggle elements
 */
function registerThemeToggles() {
    // Clear existing toggles
    window.themeState.toggleElements = [];
    
    // Find all theme toggle checkboxes
    const toggleCheckboxes = document.querySelectorAll('#theme-toggle-checkbox');
    
    toggleCheckboxes.forEach(checkbox => {
        // Remove existing event listeners
        const newCheckbox = checkbox.cloneNode(true);
        checkbox.parentNode.replaceChild(newCheckbox, checkbox);
        
        // Add to our tracked elements
        window.themeState.toggleElements.push(newCheckbox);
        
        // Add event listener
        newCheckbox.addEventListener('change', () => {
            setTheme(newCheckbox.checked ? 'dark' : 'light');
        });
    });
    
    // Update all toggle states
    updateToggleStates();
}

/**
 * Set the theme
 * @param {string} theme - The theme to set ('light' or 'dark')
 */
function setTheme(theme) {
    // Update global state
    window.themeState.currentTheme = theme;
    
    // Update document theme
    document.documentElement.setAttribute('data-theme', theme);
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
    
    // Update all toggle states
    updateToggleStates();
    
    // Update all theme labels
    updateThemeLabels();
}

/**
 * Update all toggle states based on current theme
 */
function updateToggleStates() {
    window.themeState.toggleElements.forEach(toggle => {
        toggle.checked = window.themeState.currentTheme === 'dark';
    });
}

/**
 * Update all theme labels
 */
function updateThemeLabels() {
    const themeLabels = document.querySelectorAll('.theme-label');
    const mode = window.themeState.currentTheme === 'dark' ? 'Dark' : 'Light';
    
    themeLabels.forEach(label => {
        label.textContent = `${mode} Mode`;
    });
}

/**
 * Add hover effects to floating theme toggles
 */
function addThemeToggleHoverEffects() {
    const floatingToggles = document.querySelectorAll('.floating-theme-toggle');
    
    floatingToggles.forEach(toggle => {
        toggle.addEventListener('mouseenter', () => {
            toggle.style.transform = 'translateY(-50%) scale(1.05)';
        });
        
        toggle.addEventListener('mouseleave', () => {
            toggle.style.transform = 'translateY(-50%)';
        });
    });
}

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    initThemeManager();
    addThemeToggleHoverEffects();
});

// Make functions globally available
window.themeManager = {
    init: initThemeManager,
    register: registerThemeToggles,
    setTheme: setTheme,
    addHoverEffects: addThemeToggleHoverEffects
};
