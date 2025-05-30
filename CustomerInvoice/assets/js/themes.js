// Theme Management System

// Available themes
const themes = {
    light: {
        name: 'Light',
        icon: 'fas fa-sun',
        description: 'Clean light theme'
    },
    dark: {
        name: 'Dark',
        icon: 'fas fa-moon',
        description: 'Dark theme for low light environments'
    }
};

// Current theme
let currentTheme = 'light';

// Initialize theme system
function initializeThemes() {
    loadThemePreference();
    setupThemeEventListeners();
    updateThemeUI();
}

// Load theme preference from localStorage
function loadThemePreference() {
    const savedTheme = localStorage.getItem('invoiceTheme');
    if (savedTheme && themes[savedTheme]) {
        currentTheme = savedTheme;
        applyTheme(currentTheme);
    } else {
        // Check for system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            currentTheme = 'dark';
            applyTheme(currentTheme);
        }
    }
}

// Apply theme to the document
function applyTheme(themeName) {
    if (!themes[themeName]) {
        console.warn(`Theme "${themeName}" not found. Using default theme.`);
        themeName = 'light';
    }

    // Add transition class for smooth theme switching
    document.body.classList.add('theme-switching');

    // Set theme attribute
    document.documentElement.setAttribute('data-theme', themeName);

    // Update current theme
    currentTheme = themeName;

    // Save preference
    localStorage.setItem('invoiceTheme', themeName);

    // Update UI elements
    updateThemeUI();

    // Remove transition class after animation - Optimized timing
    setTimeout(() => {
        document.body.classList.remove('theme-switching');
    }, 200);

    // Dispatch theme change event
    dispatchThemeChangeEvent(themeName);

    console.log(`Theme changed to: ${themes[themeName].name}`);
}

// Set theme (called from UI)
function setTheme(themeName) {
    applyTheme(themeName);
    showToast(`Theme changed to ${themes[themeName].name}`, 'success');
}

// Update theme-related UI elements
function updateThemeUI() {
    // Update theme indicator in navbar
    updateThemeIndicator();

    // Update any theme-specific icons or text
    updateThemeSpecificElements();

    // Update meta theme-color for mobile browsers
    updateMetaThemeColor();
}

// Update theme indicator in navigation
function updateThemeIndicator() {
    // Update theme toggle button icon
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
        if (currentTheme === 'light') {
            themeIcon.className = 'fas fa-moon';
            themeIcon.parentElement.title = 'Switch to dark mode';
        } else {
            themeIcon.className = 'fas fa-sun';
            themeIcon.parentElement.title = 'Switch to light mode';
        }
    }

    // Legacy support for dropdown (if still exists)
    const themeDropdown = document.querySelector('[data-bs-toggle="dropdown"]:has(.fa-palette)');
    if (themeDropdown) {
        const themeInfo = themes[currentTheme];
        const icon = themeDropdown.querySelector('i');
        if (icon) {
            icon.className = `${themeInfo.icon} me-1`;
        }
    }
}

// Update theme-specific elements
function updateThemeSpecificElements() {
    // Update any elements that need theme-specific styling
    const themeElements = document.querySelectorAll('[data-theme-element]');
    themeElements.forEach(element => {
        const elementType = element.getAttribute('data-theme-element');
        updateElementForTheme(element, elementType);
    });
}

// Update individual element for current theme
function updateElementForTheme(element, elementType) {
    switch (elementType) {
        case 'logo':
            updateLogoForTheme(element);
            break;
        case 'icon':
            updateIconForTheme(element);
            break;
        case 'background':
            updateBackgroundForTheme(element);
            break;
        default:
            console.warn(`Unknown theme element type: ${elementType}`);
    }
}

// Update logo based on theme
function updateLogoForTheme(logoElement) {
    const logoSources = {
        light: 'assets/images/logo-light.png',
        dark: 'assets/images/logo-dark.png',
        blue: 'assets/images/logo-blue.png',
        green: 'assets/images/logo-green.png'
    };

    const logoSrc = logoSources[currentTheme];
    if (logoSrc && logoElement.tagName === 'IMG') {
        logoElement.src = logoSrc;
    }
}

// Update icons based on theme
function updateIconForTheme(iconElement) {
    // Add theme-specific classes to icons
    iconElement.classList.remove('theme-light', 'theme-dark', 'theme-blue', 'theme-green');
    iconElement.classList.add(`theme-${currentTheme}`);
}

// Update background elements based on theme
function updateBackgroundForTheme(bgElement) {
    // Update background images or patterns based on theme
    const backgroundImages = {
        light: 'url("assets/images/bg-light.jpg")',
        dark: 'url("assets/images/bg-dark.jpg")',
        blue: 'url("assets/images/bg-blue.jpg")',
        green: 'url("assets/images/bg-green.jpg")'
    };

    const bgImage = backgroundImages[currentTheme];
    if (bgImage) {
        bgElement.style.backgroundImage = bgImage;
    }
}

// Update meta theme-color for mobile browsers
function updateMetaThemeColor() {
    const themeColors = {
        light: '#ffffff',
        dark: '#1a1a1a',
        blue: '#0d6efd',
        green: '#198754'
    };

    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.name = 'theme-color';
        document.head.appendChild(metaThemeColor);
    }

    metaThemeColor.content = themeColors[currentTheme] || themeColors.light;
}

// Setup event listeners for theme system
function setupThemeEventListeners() {
    // Listen for system theme changes
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', handleSystemThemeChange);
    }

    // Listen for storage changes (theme changes in other tabs)
    window.addEventListener('storage', handleStorageChange);
}

// Handle system theme preference changes
function handleSystemThemeChange(e) {
    // Only auto-switch if user hasn't manually selected a theme
    const hasManualTheme = localStorage.getItem('invoiceTheme');
    if (!hasManualTheme) {
        const newTheme = e.matches ? 'dark' : 'light';
        applyTheme(newTheme);
        showToast(`Theme automatically changed to ${themes[newTheme].name}`, 'info');
    }
}

// Handle localStorage changes from other tabs
function handleStorageChange(e) {
    if (e.key === 'invoiceTheme' && e.newValue) {
        const newTheme = e.newValue;
        if (themes[newTheme] && newTheme !== currentTheme) {
            applyTheme(newTheme);
        }
    }
}

// Dispatch custom theme change event
function dispatchThemeChangeEvent(themeName) {
    const event = new CustomEvent('themeChanged', {
        detail: {
            theme: themeName,
            themeInfo: themes[themeName]
        }
    });
    document.dispatchEvent(event);
}

// Get current theme
function getCurrentTheme() {
    return currentTheme;
}

// Get theme info
function getThemeInfo(themeName = currentTheme) {
    return themes[themeName] || themes.light;
}

// Get all available themes
function getAvailableThemes() {
    return themes;
}

// Toggle between light and dark themes - Optimized
function toggleTheme() {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    // Immediate icon update for better perceived performance
    updateThemeIcon(newTheme);

    // Use requestAnimationFrame for smooth transition
    requestAnimationFrame(() => {
        setTheme(newTheme);
    });
}

// Optimized theme icon update
function updateThemeIcon(themeName) {
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
        if (themeName === 'light') {
            themeIcon.className = 'fas fa-moon';
            themeIcon.parentElement.title = 'Switch to dark mode';
        } else {
            themeIcon.className = 'fas fa-sun';
            themeIcon.parentElement.title = 'Switch to light mode';
        }
    }
}

// Create theme selector component
function createThemeSelector(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID "${containerId}" not found`);
        return;
    }

    const selectorHtml = `
        <div class="theme-selector">
            <h5 class="mb-3">Choose Theme</h5>
            <div class="row g-2">
                ${Object.entries(themes).map(([key, theme]) => `
                    <div class="col-6">
                        <div class="theme-option ${key === currentTheme ? 'active' : ''}"
                             onclick="setTheme('${key}')"
                             data-theme="${key}">
                            <i class="${theme.icon} mb-2"></i>
                            <div class="theme-name">${theme.name}</div>
                            <div class="theme-description">${theme.description}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    container.innerHTML = selectorHtml;
}

// Add CSS for theme selector if not already present
function addThemeSelectorStyles() {
    if (document.getElementById('theme-selector-styles')) return;

    const styles = `
        <style id="theme-selector-styles">
            .theme-selector .theme-option {
                padding: 1rem;
                border: 2px solid var(--border-color, #dee2e6);
                border-radius: var(--border-radius, 8px);
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
                background: var(--card-bg, #ffffff);
            }

            .theme-selector .theme-option:hover {
                border-color: var(--primary-color, #000000);
                transform: translateY(-2px);
                box-shadow: 0 4px 12px var(--shadow-color, rgba(0,0,0,0.1));
            }

            .theme-selector .theme-option.active {
                border-color: var(--primary-color, #000000);
                background: var(--primary-color, #000000);
                color: var(--secondary-color, #ffffff);
            }

            .theme-selector .theme-option i {
                font-size: 1.5rem;
                display: block;
            }

            .theme-selector .theme-name {
                font-weight: 600;
                margin-bottom: 0.25rem;
            }

            .theme-selector .theme-description {
                font-size: 0.875rem;
                opacity: 0.8;
            }
        </style>
    `;

    document.head.insertAdjacentHTML('beforeend', styles);
}

// Initialize theme system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeThemes();
    addThemeSelectorStyles();
});

// Export functions for global use
window.themeManager = {
    setTheme,
    getCurrentTheme,
    getThemeInfo,
    getAvailableThemes,
    toggleTheme,
    createThemeSelector
};

// Listen for theme change events
document.addEventListener('themeChanged', function(e) {
    console.log('Theme changed:', e.detail);

    // Update any components that need to respond to theme changes
    updateComponentsForTheme(e.detail.theme);
});

// Update components when theme changes
function updateComponentsForTheme(themeName) {
    // Update charts if they exist
    if (window.chartManager) {
        window.chartManager.updateTheme(themeName);
    }

    // Update data tables if they exist
    if (window.tableManager) {
        window.tableManager.updateTheme(themeName);
    }

    // Update any other components that need theme updates
    updateCustomComponents(themeName);
}

// Update custom components for theme
function updateCustomComponents(themeName) {
    // Add any custom component theme updates here
    const customComponents = document.querySelectorAll('[data-theme-component]');
    customComponents.forEach(component => {
        const componentType = component.getAttribute('data-theme-component');
        // Handle different component types
        switch (componentType) {
            case 'chart':
                updateChartTheme(component, themeName);
                break;
            case 'table':
                updateTableTheme(component, themeName);
                break;
            // Add more component types as needed
        }
    });
}

// Update chart theme
function updateChartTheme(chartElement, themeName) {
    // Implementation for updating chart themes
    console.log(`Updating chart theme to ${themeName}`);
}

// Update table theme
function updateTableTheme(tableElement, themeName) {
    // Implementation for updating table themes
    console.log(`Updating table theme to ${themeName}`);
}
