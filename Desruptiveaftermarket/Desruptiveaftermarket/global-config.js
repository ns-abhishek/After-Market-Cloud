/**
 * Global Configuration System
 * Manages themes, fonts, responsive settings, and user preferences
 */

// Global configuration object
const GlobalConfig = {
    // Theme configurations
    themes: {
        light: {
            name: 'Light Theme',
            colors: {
                primary: '#000000',
                primaryLight: '#1f2937',
                primaryDark: '#111827',
                secondary: '#ffffff',
                accent: '#f8fafc',
                background: '#ffffff',
                backgroundSecondary: '#f8fafc',
                surface: '#ffffff',
                border: '#e2e8f0',
                hover: '#f1f5f9',
                text: '#1e293b',
                textSecondary: '#475569',
                textMuted: '#64748b',
                success: '#10b981',
                warning: '#f59e0b',
                error: '#ef4444',
                info: '#3b82f6'
            },
            shadows: {
                sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }
        },
        dark: {
            name: 'Dark Theme',
            colors: {
                primary: '#ffffff',
                primaryLight: '#f8fafc',
                primaryDark: '#e2e8f0',
                secondary: '#1e293b',
                accent: '#334155',
                background: '#0f172a',
                backgroundSecondary: '#1e293b',
                surface: '#334155',
                border: '#475569',
                hover: '#475569',
                text: '#f8fafc',
                textSecondary: '#cbd5e1',
                textMuted: '#94a3b8',
                success: '#10b981',
                warning: '#f59e0b',
                error: '#ef4444',
                info: '#3b82f6'
            },
            shadows: {
                sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
                md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
                lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
                xl: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)'
            }
        },
        auto: {
            name: 'Auto (System)',
            colors: null // Will use system preference
        }
    },

    // Font configurations
    fonts: {
        inter: {
            name: 'Inter',
            family: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            weights: [300, 400, 500, 600, 700],
            googleFont: 'Inter:wght@300;400;500;600;700'
        },
        roboto: {
            name: 'Roboto',
            family: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            weights: [300, 400, 500, 700],
            googleFont: 'Roboto:wght@300;400;500;700'
        },
        poppins: {
            name: 'Poppins',
            family: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            weights: [300, 400, 500, 600, 700],
            googleFont: 'Poppins:wght@300;400;500;600;700'
        },
        system: {
            name: 'System Default',
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            weights: [400, 500, 600, 700],
            googleFont: null
        }
    },

    // Responsive breakpoints
    breakpoints: {
        xs: 0,
        sm: 576,
        md: 768,
        lg: 992,
        xl: 1200,
        xxl: 1400
    },

    // Default settings
    defaults: {
        theme: 'light',
        font: 'inter',
        fontSize: 'medium',
        density: 'comfortable',
        animations: true,
        autoSave: true
    },

    // Font size scales
    fontSizes: {
        small: {
            base: '14px',
            sm: '12px',
            lg: '16px',
            xl: '18px',
            '2xl': '20px',
            '3xl': '24px'
        },
        medium: {
            base: '16px',
            sm: '14px',
            lg: '18px',
            xl: '20px',
            '2xl': '24px',
            '3xl': '28px'
        },
        large: {
            base: '18px',
            sm: '16px',
            lg: '20px',
            xl: '24px',
            '2xl': '28px',
            '3xl': '32px'
        }
    },

    // Density settings
    densities: {
        compact: {
            spacing: '8px',
            spacingMd: '12px',
            spacingLg: '16px',
            borderRadius: '6px',
            buttonHeight: '32px',
            inputHeight: '36px'
        },
        comfortable: {
            spacing: '12px',
            spacingMd: '16px',
            spacingLg: '24px',
            borderRadius: '8px',
            buttonHeight: '40px',
            inputHeight: '44px'
        },
        spacious: {
            spacing: '16px',
            spacingMd: '24px',
            spacingLg: '32px',
            borderRadius: '12px',
            buttonHeight: '48px',
            inputHeight: '52px'
        }
    }
};

// Configuration manager
const ConfigManager = {
    // Storage key
    STORAGE_KEY: 'aftermarket_global_config',

    // Current configuration
    current: { ...GlobalConfig.defaults },

    // Initialize configuration
    init() {
        this.loadConfig();
        this.applyConfig();
        this.setupEventListeners();
        console.log('Global configuration initialized');
    },

    // Load configuration from storage
    loadConfig() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                this.current = { ...GlobalConfig.defaults, ...JSON.parse(stored) };
            }
        } catch (error) {
            console.error('Error loading configuration:', error);
            this.current = { ...GlobalConfig.defaults };
        }
    },

    // Save configuration to storage
    saveConfig() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.current));
            console.log('Configuration saved');
        } catch (error) {
            console.error('Error saving configuration:', error);
        }
    },

    // Apply current configuration
    applyConfig() {
        this.applyTheme();
        this.applyFont();
        this.applyFontSize();
        this.applyDensity();
        this.applyAnimations();
    },

    // Apply theme
    applyTheme() {
        const theme = this.current.theme;
        
        if (theme === 'auto') {
            // Use system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.setThemeVariables(prefersDark ? 'dark' : 'light');
        } else {
            this.setThemeVariables(theme);
        }

        // Set theme attribute on body
        document.body.setAttribute('data-theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    },

    // Set CSS variables for theme
    setThemeVariables(themeName) {
        const theme = GlobalConfig.themes[themeName];
        if (!theme || !theme.colors) return;

        const root = document.documentElement;
        
        // Set color variables
        Object.entries(theme.colors).forEach(([key, value]) => {
            const cssVar = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
            root.style.setProperty(cssVar, value);
        });

        // Set shadow variables
        Object.entries(theme.shadows).forEach(([key, value]) => {
            root.style.setProperty(`--shadow-${key}`, value);
        });
    },

    // Apply font
    applyFont() {
        const fontConfig = GlobalConfig.fonts[this.current.font];
        if (!fontConfig) return;

        // Load Google Font if needed
        if (fontConfig.googleFont) {
            this.loadGoogleFont(fontConfig.googleFont);
        }

        // Set font family
        document.documentElement.style.setProperty('--font-family', fontConfig.family);
    },

    // Load Google Font
    loadGoogleFont(fontQuery) {
        const existingLink = document.querySelector(`link[href*="${fontQuery}"]`);
        if (existingLink) return;

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${fontQuery}&display=swap`;
        document.head.appendChild(link);
    },

    // Apply font size
    applyFontSize() {
        const sizeConfig = GlobalConfig.fontSizes[this.current.fontSize];
        if (!sizeConfig) return;

        const root = document.documentElement;
        Object.entries(sizeConfig).forEach(([key, value]) => {
            const cssVar = key === 'base' ? '--font-size-base' : `--font-size-${key}`;
            root.style.setProperty(cssVar, value);
        });
    },

    // Apply density
    applyDensity() {
        const densityConfig = GlobalConfig.densities[this.current.density];
        if (!densityConfig) return;

        const root = document.documentElement;
        Object.entries(densityConfig).forEach(([key, value]) => {
            const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
            root.style.setProperty(cssVar, value);
        });
    },

    // Apply animations
    applyAnimations() {
        const root = document.documentElement;
        if (this.current.animations) {
            root.style.setProperty('--transition-duration', '0.3s');
            root.style.setProperty('--animation-duration', '0.3s');
        } else {
            root.style.setProperty('--transition-duration', '0s');
            root.style.setProperty('--animation-duration', '0s');
        }
    },

    // Update configuration
    updateConfig(updates) {
        this.current = { ...this.current, ...updates };
        this.saveConfig();
        this.applyConfig();
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('configChanged', { 
            detail: { config: this.current, updates } 
        }));
    },

    // Get current configuration
    getConfig() {
        return { ...this.current };
    },

    // Setup event listeners
    setupEventListeners() {
        // Listen for system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', () => {
                if (this.current.theme === 'auto') {
                    this.applyTheme();
                }
            });
        }

        // Listen for window resize for responsive adjustments
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    },

    // Handle window resize
    handleResize() {
        const width = window.innerWidth;
        let currentBreakpoint = 'xs';
        
        Object.entries(GlobalConfig.breakpoints).forEach(([name, value]) => {
            if (width >= value) {
                currentBreakpoint = name;
            }
        });

        document.documentElement.setAttribute('data-breakpoint', currentBreakpoint);
        
        // Dispatch resize event
        window.dispatchEvent(new CustomEvent('breakpointChanged', { 
            detail: { breakpoint: currentBreakpoint, width } 
        }));
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ConfigManager.init());
} else {
    ConfigManager.init();
}

// Export for global use
window.GlobalConfig = GlobalConfig;
window.ConfigManager = ConfigManager;
