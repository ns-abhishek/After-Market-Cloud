/**
 * Navigation Utilities
 *
 * Universal navigation functions that can be used across all pages
 * to ensure consistent back button behavior and navigation.
 */

// Navigation utility object
const NavigationUtils = {

    /**
     * Universal back button functionality
     * Handles going back to the previous page with proper fallbacks
     */
    goBack: function(fallbackUrl = 'index.html') {
        console.log('NavigationUtils.goBack called');
        console.log('window.history.length:', window.history.length);
        console.log('document.referrer:', document.referrer);

        // Check if we have a referrer and it's from our domain
        if (document.referrer && this.isInternalReferrer(document.referrer)) {
            console.log('Going back to internal referrer');
            window.history.back();
        } else if (window.history.length > 1) {
            console.log('Going back in history');
            window.history.back();
        } else {
            console.log('Fallback to:', fallbackUrl);
            window.location.href = fallbackUrl;
        }
    },

    /**
     * Check if the referrer is from our internal domain
     */
    isInternalReferrer: function(referrer) {
        try {
            const referrerUrl = new URL(referrer);
            const currentUrl = new URL(window.location.href);

            // Check if it's the same origin or a file:// protocol
            return referrerUrl.origin === currentUrl.origin ||
                   referrer.startsWith('file://') ||
                   referrerUrl.hostname === currentUrl.hostname;
        } catch (e) {
            console.warn('Error parsing referrer URL:', e);
            return false;
        }
    },

    /**
     * Navigate to a specific page with optional parameters
     */
    navigateTo: function(url, params = {}) {
        let targetUrl = url;

        // Add parameters if provided
        if (Object.keys(params).length > 0) {
            const urlParams = new URLSearchParams(params);
            targetUrl += (url.includes('?') ? '&' : '?') + urlParams.toString();
        }

        console.log('Navigating to:', targetUrl);
        window.location.href = targetUrl;
    },

    /**
     * Navigate to party details page
     */
    goToPartyDetails: function() {
        this.navigateTo('party-details-advanced.html');
    },

    /**
     * Always go back to party details page (for specific workflows)
     */
    goBackToPartyDetails: function() {
        console.log('Navigating back to party-details-advanced.html');
        this.navigateTo('party-details-advanced.html');
    },

    /**
     * Universal setup for ALL back buttons to go to party details
     * This will find and override ALL back button implementations
     */
    setupUniversalBackToPartyDetails: function() {
        console.log('Setting up universal back to party details...');

        // Comprehensive selector for all possible back button variations
        const selectors = [
            '.back-button',
            '.nav-button[title*="Back"]',
            '.nav-button[title*="Go Back"]',
            'button[onclick*="goBack"]',
            'button[onclick*="history.back"]',
            'button[id*="back"]',
            'button[id*="Back"]',
            'button:has(.material-icons:contains("arrow_back"))',
            '[class*="back"]',
            'button[title*="back" i]'
        ];

        let totalButtons = 0;

        selectors.forEach(selector => {
            try {
                const buttons = document.querySelectorAll(selector);
                buttons.forEach(button => {
                    // Check if it's actually a back button by looking for arrow_back icon or back-related text
                    const hasBackIcon = button.querySelector('.material-icons') &&
                                       button.querySelector('.material-icons').textContent.includes('arrow_back');
                    const hasBackText = button.textContent.toLowerCase().includes('back') ||
                                       button.title.toLowerCase().includes('back');

                    if (hasBackIcon || hasBackText || button.classList.contains('back-button')) {
                        // Remove all existing event handlers
                        button.removeAttribute('onclick');

                        // Clone the button to remove all event listeners
                        const newButton = button.cloneNode(true);
                        button.parentNode.replaceChild(newButton, button);

                        // Add our event listener
                        newButton.addEventListener('click', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Universal back button clicked');
                            this.goBackToPartyDetails();
                        });

                        totalButtons++;
                        console.log(`Setup universal back button: ${selector}`);
                    }
                });
            } catch (error) {
                // Ignore selector errors for unsupported selectors
                console.log(`Selector not supported: ${selector}`);
            }
        });

        // Also override any global goBack functions
        if (typeof window.goBack === 'function') {
            console.log('Overriding global goBack function');
            window.goBack = () => {
                console.log('Global goBack function called - redirecting to party details');
                this.goBackToPartyDetails();
            };
        }

        console.log(`Universal back button setup complete. Modified ${totalButtons} buttons.`);
        return totalButtons;
    },

    /**
     * Navigate to customer 360 view
     */
    goToCustomer360: function(customerId) {
        this.navigateTo('customer-360-view.html', { customerId: customerId });
    },

    /**
     * Navigate to equipment management
     */
    goToEquipmentManagement: function(customerId = null) {
        const params = customerId ? { customerId: customerId } : {};
        this.navigateTo('equipment-management.html', params);
    },

    /**
     * Navigate to document management
     */
    goToDocumentManagement: function() {
        this.navigateTo('document-management.html');
    },

    /**
     * Navigate to catalog
     */
    goToCatalog: function() {
        this.navigateTo('modern-catalog.html');
    },

    /**
     * Navigate to dashboard/home
     */
    goToHome: function() {
        this.navigateTo('index.html');
    },

    /**
     * Setup universal back button event listeners
     * Call this function on pages that have back buttons
     */
    setupBackButton: function(buttonSelector = '.back-button, .nav-button[onclick*="goBack"]', fallbackUrl = 'index.html') {
        const backButtons = document.querySelectorAll(buttonSelector);

        backButtons.forEach(button => {
            // Remove existing onclick handlers
            button.removeAttribute('onclick');

            // Add new event listener
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.goBack(fallbackUrl);
            });
        });

        console.log(`Setup back button functionality for ${backButtons.length} buttons`);
    },

    /**
     * Setup back button to always go to party details page
     * Use this for pages that should always return to party details
     */
    setupBackToPartyDetails: function(buttonSelector = '.back-button, .nav-button[onclick*="goBack"]') {
        const backButtons = document.querySelectorAll(buttonSelector);

        backButtons.forEach(button => {
            // Remove existing onclick handlers
            button.removeAttribute('onclick');

            // Add new event listener
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.goBackToPartyDetails();
            });
        });

        console.log(`Setup back to party details functionality for ${backButtons.length} buttons`);
    },

    /**
     * Setup keyboard navigation
     */
    setupKeyboardNavigation: function(options = {}) {
        const defaults = {
            enableBackOnEscape: true,
            enableArrowNavigation: false,
            fallbackUrl: 'index.html'
        };

        const config = { ...defaults, ...options };

        document.addEventListener('keydown', (e) => {
            // Escape key - Go back
            if (config.enableBackOnEscape && e.key === 'Escape' && !e.ctrlKey && !e.altKey) {
                e.preventDefault();
                this.goBack(config.fallbackUrl);
            }

            // Alt + Left Arrow - Go back (browser standard)
            if (e.altKey && e.key === 'ArrowLeft') {
                e.preventDefault();
                this.goBack(config.fallbackUrl);
            }
        });

        console.log('Keyboard navigation setup complete');
    },

    /**
     * Get current page name
     */
    getCurrentPageName: function() {
        const path = window.location.pathname;
        return path.substring(path.lastIndexOf('/') + 1);
    },

    /**
     * Get URL parameters as an object
     */
    getUrlParams: function() {
        const params = new URLSearchParams(window.location.search);
        const result = {};
        for (const [key, value] of params) {
            result[key] = value;
        }
        return result;
    },

    /**
     * Update URL parameters without page reload
     */
    updateUrlParams: function(params) {
        const url = new URL(window.location);
        Object.keys(params).forEach(key => {
            if (params[key] !== null && params[key] !== undefined) {
                url.searchParams.set(key, params[key]);
            } else {
                url.searchParams.delete(key);
            }
        });
        window.history.replaceState({}, '', url);
    },

    /**
     * Initialize navigation utilities
     * Call this on every page to setup basic navigation
     */
    init: function(options = {}) {
        const defaults = {
            setupBackButtons: true,
            setupKeyboardNav: true,
            universalBackToPartyDetails: true, // NEW: Enable universal back to party details
            backButtonSelector: '.back-button, .nav-button[onclick*="goBack"]',
            fallbackUrl: 'party-details-advanced.html' // Changed default fallback
        };

        const config = { ...defaults, ...options };

        // Setup universal back to party details (NEW FEATURE)
        if (config.universalBackToPartyDetails) {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.setupUniversalBackToPartyDetails();
                });
            } else {
                this.setupUniversalBackToPartyDetails();
            }
        } else if (config.setupBackButtons) {
            // Fallback to regular back button setup
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.setupBackButton(config.backButtonSelector, config.fallbackUrl);
                });
            } else {
                this.setupBackButton(config.backButtonSelector, config.fallbackUrl);
            }
        }

        // Setup keyboard navigation
        if (config.setupKeyboardNav) {
            this.setupKeyboardNavigation({
                fallbackUrl: config.fallbackUrl
            });
        }

        console.log('NavigationUtils initialized for page:', this.getCurrentPageName());
    }
};

// Auto-initialize on script load
NavigationUtils.init();

// Make it globally available
window.NavigationUtils = NavigationUtils;

// Legacy function for backward compatibility - ALWAYS go to party details
window.goBack = function(fallbackUrl) {
    console.log('Global goBack function called - redirecting to party details');
    NavigationUtils.goBackToPartyDetails();
};
