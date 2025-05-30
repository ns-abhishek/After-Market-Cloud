/**
 * Theme Configurator JavaScript
 * Handles the theme configuration interface and interactions
 */

// Theme configurator controller
const ThemeConfigurator = {
    // Initialize the configurator
    init() {
        this.setupEventListeners();
        this.loadCurrentSettings();
        this.updateUI();
        console.log('Theme configurator initialized');
    },

    // Setup event listeners
    setupEventListeners() {
        // Theme selection
        document.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const theme = e.currentTarget.dataset.theme;
                this.selectTheme(theme);
            });
        });

        // Font selection
        document.querySelectorAll('.font-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const font = e.currentTarget.dataset.font;
                this.selectFont(font);
            });
        });

        // Font size slider
        const fontSizeSlider = document.getElementById('fontSizeSlider');
        if (fontSizeSlider) {
            fontSizeSlider.addEventListener('input', (e) => {
                const sizeIndex = parseInt(e.target.value);
                const sizes = ['small', 'medium', 'large'];
                this.setFontSize(sizes[sizeIndex]);
            });
        }

        // Density slider
        const densitySlider = document.getElementById('densitySlider');
        if (densitySlider) {
            densitySlider.addEventListener('input', (e) => {
                const densityIndex = parseInt(e.target.value);
                const densities = ['compact', 'comfortable', 'spacious'];
                this.setDensity(densities[densityIndex]);
            });
        }

        // Animations toggle
        const animationsToggle = document.getElementById('animationsToggle');
        if (animationsToggle) {
            animationsToggle.addEventListener('change', (e) => {
                this.setAnimations(e.target.checked);
            });
        }

        // Listen for configuration changes
        window.addEventListener('configChanged', (e) => {
            this.updateUI();
        });
    },

    // Load current settings from ConfigManager
    loadCurrentSettings() {
        if (typeof ConfigManager !== 'undefined') {
            this.currentConfig = ConfigManager.getConfig();
        } else {
            // Fallback if ConfigManager is not available
            this.currentConfig = {
                theme: 'light',
                font: 'inter',
                fontSize: 'medium',
                density: 'comfortable',
                animations: true
            };
        }
    },

    // Update UI to reflect current settings
    updateUI() {
        this.updateThemeSelection();
        this.updateFontSelection();
        this.updateSliders();
        this.updateToggles();
    },

    // Update theme selection UI
    updateThemeSelection() {
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.remove('active');
            if (option.dataset.theme === this.currentConfig.theme) {
                option.classList.add('active');
            }
        });
    },

    // Update font selection UI
    updateFontSelection() {
        document.querySelectorAll('.font-option').forEach(option => {
            option.classList.remove('active');
            if (option.dataset.font === this.currentConfig.font) {
                option.classList.add('active');
            }
        });
    },

    // Update sliders
    updateSliders() {
        // Font size slider
        const fontSizeSlider = document.getElementById('fontSizeSlider');
        if (fontSizeSlider) {
            const sizes = ['small', 'medium', 'large'];
            const index = sizes.indexOf(this.currentConfig.fontSize);
            fontSizeSlider.value = index >= 0 ? index : 1;
        }

        // Density slider
        const densitySlider = document.getElementById('densitySlider');
        if (densitySlider) {
            const densities = ['compact', 'comfortable', 'spacious'];
            const index = densities.indexOf(this.currentConfig.density);
            densitySlider.value = index >= 0 ? index : 1;
        }
    },

    // Update toggles
    updateToggles() {
        const animationsToggle = document.getElementById('animationsToggle');
        if (animationsToggle) {
            animationsToggle.checked = this.currentConfig.animations;
        }
    },

    // Select theme
    selectTheme(theme) {
        this.currentConfig.theme = theme;
        this.applyChanges({ theme });
        this.updateThemeSelection();
        this.showNotification(`Theme changed to ${theme}`, 'success');
    },

    // Select font
    selectFont(font) {
        this.currentConfig.font = font;
        this.applyChanges({ font });
        this.updateFontSelection();
        this.showNotification(`Font changed to ${font}`, 'success');
    },

    // Set font size
    setFontSize(fontSize) {
        this.currentConfig.fontSize = fontSize;
        this.applyChanges({ fontSize });
        this.showNotification(`Font size changed to ${fontSize}`, 'success');
    },

    // Set density
    setDensity(density) {
        this.currentConfig.density = density;
        this.applyChanges({ density });
        this.showNotification(`Interface density changed to ${density}`, 'success');
    },

    // Set animations
    setAnimations(enabled) {
        this.currentConfig.animations = enabled;
        this.applyChanges({ animations: enabled });
        this.showNotification(`Animations ${enabled ? 'enabled' : 'disabled'}`, 'success');
    },

    // Apply changes through ConfigManager
    applyChanges(updates) {
        if (typeof ConfigManager !== 'undefined') {
            ConfigManager.updateConfig(updates);
        } else {
            console.warn('ConfigManager not available, changes not applied');
        }
    },

    // Show notification
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--color-success)' :
                        type === 'error' ? 'var(--color-error)' : 'var(--color-info)'};
            color: white;
            padding: var(--spacing) var(--spacing-lg);
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            opacity: 0;
            transform: translateX(100%);
            transition: all var(--transition-duration) var(--transition-timing);
            font-size: var(--font-size-sm);
            font-weight: 500;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
};

// Global functions for button actions
function saveSettings() {
    if (typeof ConfigManager !== 'undefined') {
        ConfigManager.saveConfig();
        ThemeConfigurator.showNotification('Settings saved successfully!', 'success');
    } else {
        ThemeConfigurator.showNotification('ConfigManager not available', 'error');
    }
}

function resetToDefaults() {
    if (confirm('Reset all settings to defaults? This will override your current configuration.')) {
        if (typeof ConfigManager !== 'undefined' && typeof GlobalConfig !== 'undefined') {
            ConfigManager.updateConfig(GlobalConfig.defaults);
            ThemeConfigurator.loadCurrentSettings();
            ThemeConfigurator.updateUI();
            ThemeConfigurator.showNotification('Settings reset to defaults', 'success');
        } else {
            ThemeConfigurator.showNotification('Unable to reset settings', 'error');
        }
    }
}

function exportSettings() {
    if (typeof ConfigManager !== 'undefined') {
        const config = ConfigManager.getConfig();
        const exportData = {
            timestamp: new Date().toISOString(),
            version: '1.0',
            configuration: config
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `theme-config-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        ThemeConfigurator.showNotification('Settings exported successfully!', 'success');
    } else {
        ThemeConfigurator.showNotification('ConfigManager not available', 'error');
    }
}

// Back button functionality
function goBack() {
    // Navigate back to party-details-advanced.html as per user requirement
    window.location.href = 'party-details-advanced.html';
}

// Setup back button hover effects
document.addEventListener('DOMContentLoaded', function() {
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'var(--color-hover)';
            this.style.color = 'var(--color-primary)';
        });

        backButton.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'transparent';
            this.style.color = 'var(--color-text-secondary)';
        });
    }
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ThemeConfigurator.init());
} else {
    ThemeConfigurator.init();
}

// Export for global use
window.ThemeConfigurator = ThemeConfigurator;
