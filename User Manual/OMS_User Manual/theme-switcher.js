/**
 * Theme Switcher - Handles theme switching functionality for the OMS
 * Supports light and dark themes with smooth transitions
 */

class ThemeSwitcher {
    constructor() {
        // DOM Elements
        this.themeToggleBtn = document.getElementById('theme-toggle');

        // Theme state
        this.currentTheme = localStorage.getItem('oms_theme') || 'light';

        // Initialize
        this.init();
    }

    /**
     * Initialize the theme switcher
     */
    init() {
        // Apply the saved theme
        this.applyTheme(this.currentTheme);

        // Add event listener to the theme toggle button
        if (this.themeToggleBtn) {
            this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
        }

        // Add event listener for system theme changes
        this.setupSystemThemeListener();
    }

    /**
     * Toggle between light and dark themes
     */
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        this.currentTheme = newTheme;
        localStorage.setItem('oms_theme', newTheme);

        // Add animation effect
        this.animateThemeChange();
    }

    /**
     * Apply the specified theme
     * @param {string} theme - The theme to apply ('light' or 'dark')
     */
    applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }

        // Remove tooltip from theme toggle button
        if (this.themeToggleBtn) {
            this.themeToggleBtn.removeAttribute('data-tooltip');
        }
    }

    /**
     * Add animation effect when changing themes
     */
    animateThemeChange() {
        // Create a ripple effect
        const ripple = document.createElement('div');
        ripple.className = 'theme-ripple';
        document.body.appendChild(ripple);

        // Trigger animation
        setTimeout(() => {
            ripple.style.transform = 'scale(150)';
            ripple.style.opacity = '0';

            // Remove ripple after animation completes
            setTimeout(() => {
                document.body.removeChild(ripple);
            }, 1000);
        }, 10);
    }

    /**
     * Setup listener for system theme changes
     */
    setupSystemThemeListener() {
        // Check if the user has a preference in localStorage
        const savedTheme = localStorage.getItem('oms_theme');

        // If no saved preference, listen for system theme changes
        if (!savedTheme) {
            const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

            // Set initial theme based on system preference
            if (prefersDarkScheme.matches) {
                this.applyTheme('dark');
                this.currentTheme = 'dark';
            }

            // Listen for changes
            prefersDarkScheme.addEventListener('change', (e) => {
                const newTheme = e.matches ? 'dark' : 'light';
                this.applyTheme(newTheme);
                this.currentTheme = newTheme;
            });
        }
    }
}

// Initialize the theme switcher when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add theme ripple styles
    const style = document.createElement('style');
    style.textContent = `
        .theme-ripple {
            position: fixed;
            top: 0;
            left: 0;
            width: 10px;
            height: 10px;
            background-color: var(--primary-color);
            border-radius: 50%;
            transform: scale(0);
            opacity: 0.2;
            pointer-events: none;
            transition: transform 1s ease-out, opacity 1s ease-out;
            z-index: 9999;
        }
    `;
    document.head.appendChild(style);

    // Initialize theme switcher
    new ThemeSwitcher();
});
