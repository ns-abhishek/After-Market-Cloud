/**
 * Tour Manager - Handles interactive guided tours for the OMS
 * Provides different tour experiences for new and returning users
 */

class TourManager {
    constructor() {
        // Tour state
        this.isActive = false;
        this.currentStep = 0;
        this.tourType = 'new'; // 'new' or 'returning'
        this.isPaused = false;

        // DOM Elements
        this.tourOverlay = null;
        this.tourTooltip = null;
        this.tourHighlight = null;
        this.tourProgress = null;
        this.tourControls = null;

        // Tour steps for new users (comprehensive tour)
        this.newUserTourSteps = [
            {
                element: '.logo',
                title: 'Welcome to OMS',
                description: 'This is the Order Management System, designed to help you efficiently manage and track all your orders in one place.',
                position: 'bottom',
                highlightPadding: 10
            },
            {
                element: '.horizontal-nav',
                title: 'Navigation Menu',
                description: 'Use this menu to navigate between different sections of the application. You can access Orders, Products, Customers, Analytics, and Settings.',
                position: 'bottom',
                highlightPadding: 5
            },
            {
                element: '.search-bar',
                title: 'Search Functionality',
                description: 'Quickly find orders, products, or customers by using the search bar. Just type what you\'re looking for and press Enter.',
                position: 'bottom',
                highlightPadding: 5
            },
            {
                element: '.notifications',
                title: 'Notifications',
                description: 'View system notifications here. The badge indicates how many unread notifications you have.',
                position: 'bottom-left',
                highlightPadding: 10
            },
            {
                element: '#help-button',
                title: 'Help Center',
                description: 'Access the Help Center anytime by clicking this button. You\'ll find comprehensive documentation and guides.',
                position: 'bottom-left',
                highlightPadding: 10
            },
            {
                element: '#show-contextual-help',
                title: 'Contextual Help',
                description: 'Get help specific to the current page you\'re viewing. This shows relevant information for your current task.',
                position: 'bottom-right',
                highlightPadding: 5
            },
            {
                element: '.process-steps',
                title: 'Order Process Steps',
                description: 'This shows the stages an order goes through from creation to delivery. You can track where each order is in the process.',
                position: 'bottom',
                highlightPadding: 10
            },
            {
                element: '.dashboard-actions',
                title: 'Order Actions',
                description: 'Create new orders, export data, or filter your orders using these action buttons.',
                position: 'left',
                highlightPadding: 10
            },
            {
                element: '#new-order-btn',
                title: 'Create New Orders',
                description: 'Click here to create a new order. This will open a form where you can enter order details.',
                position: 'bottom',
                highlightPadding: 5
            },
            {
                element: '.order-card:first-child',
                title: 'Order Cards',
                description: 'Each card represents an order. You can see key information at a glance, including order ID, customer, and status.',
                position: 'right',
                highlightPadding: 10
            },
            {
                element: '.status-badge',
                title: 'Order Status',
                description: 'This badge shows the current status of the order. Different colors indicate different statuses: green for delivered, blue for processing, and orange for pending.',
                position: 'top',
                highlightPadding: 5
            },
            {
                element: '.order-card:first-child .order-card-footer',
                title: 'Order Actions',
                description: 'Manage individual orders with these action buttons. You can view details, edit, or delete orders.',
                position: 'top',
                highlightPadding: 5
            },
            {
                element: '.expand-btn',
                title: 'Expand Order Details',
                description: 'Click this button to see more details about the order, including items and shipping information.',
                position: 'left',
                highlightPadding: 5
            },
            {
                element: '.orders-container',
                title: 'Drag and Drop',
                description: 'You can reorder cards by dragging and dropping them. This helps you prioritize and organize your orders.',
                position: 'top',
                highlightPadding: 20
            }
        ];

        // Tour steps for returning users (condensed tour highlighting new features)
        this.returningUserTourSteps = [
            {
                element: '.horizontal-nav',
                title: 'New Navigation Layout',
                description: 'We\'ve updated the navigation to a horizontal layout for better accessibility and screen space utilization.',
                position: 'bottom',
                isNew: true,
                highlightPadding: 5
            },
            {
                element: '.process-steps',
                title: 'New: Order Process Tracker',
                description: 'Track the progress of orders through each stage with this new visual process indicator.',
                position: 'bottom',
                isNew: true,
                highlightPadding: 10
            },
            {
                element: '.order-card:first-child',
                title: 'Redesigned Order Cards',
                description: 'Orders are now displayed as cards instead of table rows, making it easier to view and manage your orders.',
                position: 'right',
                isNew: true,
                highlightPadding: 10
            },
            {
                element: '.expand-btn',
                title: 'New: Expandable Details',
                description: 'Click this button to expand and see more details about the order without leaving the dashboard.',
                position: 'left',
                isNew: true,
                highlightPadding: 5
            },
            {
                element: '.orders-container',
                title: 'New: Drag and Drop Ordering',
                description: 'You can now reorder cards by dragging and dropping them to prioritize important orders.',
                position: 'top',
                isNew: true,
                highlightPadding: 20
            }
        ];

        // Initialize
        this.init();
    }

    /**
     * Initialize the tour manager
     */
    init() {
        // Create tour UI elements
        this.createTourElements();

        // Check if user has seen the tour before
        const hasSeenTour = localStorage.getItem('oms_tour_completed');
        const lastVersion = localStorage.getItem('oms_last_version');
        const currentVersion = '2.0'; // Update this when making significant changes

        // Determine tour type based on user history
        if (hasSeenTour && lastVersion === currentVersion) {
            // User has seen the current version tour - don't show automatically
            return;
        } else if (hasSeenTour) {
            // Returning user - show condensed tour
            this.tourType = 'returning';
            // Show a notification that a tour is available
            this.showTourNotification();
        } else {
            // New user - show comprehensive tour
            this.tourType = 'new';
            // Start tour automatically with a slight delay
            setTimeout(() => this.startTour(), 1000);
        }

        // Store current version
        localStorage.setItem('oms_last_version', currentVersion);
    }

    /**
     * Create the tour UI elements
     */
    createTourElements() {
        // Create tour overlay
        this.tourOverlay = document.createElement('div');
        this.tourOverlay.className = 'tour-overlay';

        // Create highlight element
        this.tourHighlight = document.createElement('div');
        this.tourHighlight.className = 'tour-highlight';

        // Create tooltip
        this.tourTooltip = document.createElement('div');
        this.tourTooltip.className = 'tour-tooltip';

        // Create progress indicator
        this.tourProgress = document.createElement('div');
        this.tourProgress.className = 'tour-progress';

        // Create controls
        this.tourControls = document.createElement('div');
        this.tourControls.className = 'tour-controls';

        // Add elements to the DOM
        document.body.appendChild(this.tourOverlay);
        document.body.appendChild(this.tourHighlight);
        document.body.appendChild(this.tourTooltip);

        // Add event listeners for window resize
        window.addEventListener('resize', () => {
            if (this.isActive) {
                this.positionTourElements();
            }
        });
    }

    /**
     * Show notification that a tour is available
     */
    showTourNotification() {
        const notification = document.createElement('div');
        notification.className = 'tour-notification';
        notification.innerHTML = `
            <div class="tour-notification-content">
                <h3>New Features Available!</h3>
                <p>We've updated the Order Management System with new features. Would you like a quick tour?</p>
                <div class="tour-notification-actions">
                    <button class="tour-start-btn">Take the Tour</button>
                    <button class="tour-dismiss-btn">Maybe Later</button>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        // Add event listeners
        notification.querySelector('.tour-start-btn').addEventListener('click', () => {
            notification.remove();
            this.startTour();
        });

        notification.querySelector('.tour-dismiss-btn').addEventListener('click', () => {
            notification.remove();
        });

        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
    }

    /**
     * Start the guided tour
     */
    startTour() {
        // Set active state
        this.isActive = true;
        this.currentStep = 0;

        // Show the tour overlay
        this.tourOverlay.classList.add('active');

        // Show the first step
        this.showStep(0);

        // Add keyboard event listeners
        document.addEventListener('keydown', this.handleKeyboardNavigation);
    }

    /**
     * Show a specific step in the tour
     * @param {number} stepIndex - The index of the step to show
     */
    showStep(stepIndex) {
        // Get the appropriate tour steps based on user type
        const steps = this.tourType === 'new' ? this.newUserTourSteps : this.returningUserTourSteps;

        // Validate step index
        if (stepIndex < 0 || stepIndex >= steps.length) {
            this.endTour();
            return;
        }

        // Clear any existing highlighted elements
        this._clearHighlightedElements();

        // Update current step
        this.currentStep = stepIndex;

        // Get step data
        const step = steps[stepIndex];

        // Find the target element
        const targetElement = document.querySelector(step.element);
        if (!targetElement) {
            console.error(`Tour target element not found: ${step.element}`);
            this.showStep(stepIndex + 1); // Skip to next step
            return;
        }

        // Position the highlight and tooltip
        this.positionHighlight(targetElement, step.highlightPadding || 0);
        this.positionTooltip(targetElement, step.position, step);

        // Update progress indicator
        this.updateProgress(stepIndex, steps.length);
    }

    /**
     * Position the highlight element around the target
     * @param {HTMLElement} targetElement - The element to highlight
     * @param {number} padding - Additional padding around the element
     */
    positionHighlight(targetElement, padding = 0) {
        const rect = targetElement.getBoundingClientRect();

        // Position and size the highlight
        this.tourHighlight.style.top = `${rect.top - padding + window.scrollY}px`;
        this.tourHighlight.style.left = `${rect.left - padding + window.scrollX}px`;
        this.tourHighlight.style.width = `${rect.width + (padding * 2)}px`;
        this.tourHighlight.style.height = `${rect.height + (padding * 2)}px`;

        // Create a "hole" in the overlay using clip-path
        // This helps ensure the highlighted element remains clear
        const highlightTop = rect.top - padding;
        const highlightLeft = rect.left - padding;
        const highlightRight = rect.right + padding;
        const highlightBottom = rect.bottom + padding;
        const clipPath = `
            polygon(
                0% 0%, 100% 0%, 100% 100%, 0% 100%,
                0% ${highlightTop}px, ${highlightLeft}px ${highlightTop}px,
                ${highlightLeft}px ${highlightBottom}px, ${highlightRight}px ${highlightBottom}px,
                ${highlightRight}px ${highlightTop}px, 0% ${highlightTop}px
            )
        `;

        // Apply the clip-path to the overlay to create a "hole"
        this.tourOverlay.style.clipPath = 'none';
        // Force reflow
        void this.tourOverlay.offsetWidth;
        this.tourOverlay.style.clipPath = clipPath;

        // Ensure the highlighted element remains fully visible
        // Remove any existing backdrop filters from the target element and its children
        const originalStyles = new Map();

        // Store original styles and remove any filters or backdrop filters
        const clearFilters = (element) => {
            if (!element) return;

            // Store original styles if not already stored
            if (!originalStyles.has(element)) {
                originalStyles.set(element, {
                    filter: element.style.filter,
                    backdropFilter: element.style.backdropFilter,
                    opacity: element.style.opacity,
                    zIndex: element.style.zIndex,
                    position: element.style.position
                });
            }

            // Clear filters and ensure full opacity with !important to override any inherited styles
            element.style.setProperty('filter', 'none', 'important');
            element.style.setProperty('backdrop-filter', 'none', 'important');
            element.style.setProperty('opacity', '1', 'important');

            // Increase z-index to ensure the element appears above the overlay
            const currentZIndex = parseInt(window.getComputedStyle(element).zIndex, 10);
            if (isNaN(currentZIndex) || currentZIndex < 9002) {
                element.style.setProperty('z-index', '9002', 'important');
            }

            // Ensure the element has a position that allows z-index to work
            const position = window.getComputedStyle(element).position;
            if (position === 'static') {
                element.style.setProperty('position', 'relative', 'important');
            }

            // Process children recursively
            Array.from(element.children).forEach(child => clearFilters(child));
        };

        // Make sure we're not already highlighting this element
        if (this._currentHighlightedElement === targetElement) {
            // If we're already highlighting this element, just ensure the highlight is visible
            this.tourHighlight.classList.add('active');
            return;
        }

        // Apply the style changes to ensure visibility
        clearFilters(targetElement);

        // Store the target element to restore styles later
        this._currentHighlightedElement = targetElement;
        this._originalStyles = originalStyles;

        // Show the highlight with animation
        this.tourHighlight.classList.remove('active');
        void this.tourHighlight.offsetWidth; // Force reflow
        this.tourHighlight.classList.add('active');

        // Scroll element into view if needed
        if (rect.top < 0 || rect.bottom > window.innerHeight) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }

    /**
     * Position the tooltip relative to the target element
     * @param {HTMLElement} targetElement - The element the tooltip is for
     * @param {string} position - The position of the tooltip (top, right, bottom, left)
     * @param {Object} step - The step data
     */
    positionTooltip(targetElement, position = 'bottom', step) {
        const rect = targetElement.getBoundingClientRect();
        const tooltipWidth = 320; // Fixed width for tooltip

        // Calculate position
        let top, left;

        switch (position) {
            case 'top':
                top = rect.top - 10 + window.scrollY;
                left = rect.left + (rect.width / 2) - (tooltipWidth / 2) + window.scrollX;
                break;
            case 'right':
                top = rect.top + (rect.height / 2) - 100 + window.scrollY;
                left = rect.right + 20 + window.scrollX;
                break;
            case 'bottom':
                top = rect.bottom + 20 + window.scrollY;
                left = rect.left + (rect.width / 2) - (tooltipWidth / 2) + window.scrollX;
                break;
            case 'left':
                top = rect.top + (rect.height / 2) - 100 + window.scrollY;
                left = rect.left - tooltipWidth - 20 + window.scrollX;
                break;
            case 'bottom-left':
                top = rect.bottom + 20 + window.scrollY;
                left = rect.left + window.scrollX;
                break;
            case 'bottom-right':
                top = rect.bottom + 20 + window.scrollY;
                left = rect.right - tooltipWidth + window.scrollX;
                break;
            default:
                top = rect.bottom + 20 + window.scrollY;
                left = rect.left + (rect.width / 2) - (tooltipWidth / 2) + window.scrollX;
        }

        // Ensure tooltip stays within viewport
        if (left < 20) left = 20;
        if (left + tooltipWidth > window.innerWidth - 20) {
            left = window.innerWidth - tooltipWidth - 20;
        }

        // Get the appropriate tour steps based on user type
        const steps = this.tourType === 'new' ? this.newUserTourSteps : this.returningUserTourSteps;

        // Create tooltip content
        let newBadge = step.isNew ? '<span class="tour-new-badge">NEW</span>' : '';

        this.tourTooltip.innerHTML = `
            <div class="tour-tooltip-header">
                <h3>${step.title} ${newBadge}</h3>
                <button class="tour-close-btn">&times;</button>
            </div>
            <div class="tour-tooltip-body">
                <p>${step.description}</p>
            </div>
            <div class="tour-tooltip-footer">
                <div class="tour-progress">
                    <span class="tour-progress-text">Step ${this.currentStep + 1} of ${steps.length}</span>
                    <div class="tour-progress-bar">
                        <div class="tour-progress-indicator" style="width: ${((this.currentStep + 1) / steps.length) * 100}%"></div>
                    </div>
                </div>
                <div class="tour-controls">
                    <button class="tour-btn tour-btn-skip">Skip Tour</button>
                    <div class="tour-navigation">
                        <button class="tour-btn tour-btn-prev" ${this.currentStep === 0 ? 'disabled' : ''}>Previous</button>
                        <button class="tour-btn tour-btn-next">${this.currentStep === steps.length - 1 ? 'Finish' : 'Next'}</button>
                    </div>
                </div>
            </div>
        `;

        // Position the tooltip
        this.tourTooltip.style.top = `${top}px`;
        this.tourTooltip.style.left = `${left}px`;
        this.tourTooltip.style.width = `${tooltipWidth}px`;

        // Add position class for arrow
        this.tourTooltip.className = 'tour-tooltip';
        this.tourTooltip.classList.add(`position-${position}`);

        // Show the tooltip with animation
        this.tourTooltip.classList.remove('active');
        void this.tourTooltip.offsetWidth; // Force reflow
        this.tourTooltip.classList.add('active');

        // Add event listeners
        this.tourTooltip.querySelector('.tour-close-btn').addEventListener('click', () => this.endTour());
        this.tourTooltip.querySelector('.tour-btn-skip').addEventListener('click', () => this.endTour());
        this.tourTooltip.querySelector('.tour-btn-prev').addEventListener('click', () => this.showStep(this.currentStep - 1));
        this.tourTooltip.querySelector('.tour-btn-next').addEventListener('click', () => {
            if (this.currentStep === steps.length - 1) {
                this.endTour();
            } else {
                this.showStep(this.currentStep + 1);
            }
        });
    }

    /**
     * Update the progress indicator
     * Note: Progress is now handled directly within the tooltip rendering
     */
    updateProgress() {
        // Progress is handled within the tooltip now
    }

    /**
     * Handle keyboard navigation
     * @param {KeyboardEvent} event - The keyboard event
     */
    handleKeyboardNavigation = (event) => {
        if (!this.isActive) return;

        // Get the appropriate tour steps based on user type
        const steps = this.tourType === 'new' ? this.newUserTourSteps : this.returningUserTourSteps;

        switch (event.key) {
            case 'Escape':
                this.endTour();
                break;
            case 'ArrowRight':
            case 'Enter':
                if (this.currentStep === steps.length - 1) {
                    this.endTour();
                } else {
                    this.showStep(this.currentStep + 1);
                }
                break;
            case 'ArrowLeft':
                if (this.currentStep > 0) {
                    this.showStep(this.currentStep - 1);
                }
                break;
        }
    }

    /**
     * Clear all highlighted elements and restore their original styles
     * @private
     */
    _clearHighlightedElements() {
        // Hide highlight element
        this.tourHighlight.classList.remove('active');

        // Reset the clip-path on the overlay
        this.tourOverlay.style.clipPath = 'none';

        // Restore original styles to the highlighted element
        if (this._currentHighlightedElement && this._originalStyles) {
            const restoreStyles = (element) => {
                if (!element || !this._originalStyles.has(element)) return;

                const originalStyle = this._originalStyles.get(element);

                // Fully restore all modified properties
                if (originalStyle) {
                    // Restore all saved properties
                    if (originalStyle.filter) {
                        element.style.filter = originalStyle.filter;
                    } else {
                        element.style.removeProperty('filter');
                    }

                    if (originalStyle.backdropFilter) {
                        element.style.backdropFilter = originalStyle.backdropFilter;
                    } else {
                        element.style.removeProperty('backdrop-filter');
                    }

                    if (originalStyle.opacity) {
                        element.style.opacity = originalStyle.opacity;
                    } else {
                        element.style.removeProperty('opacity');
                    }

                    if (originalStyle.zIndex) {
                        element.style.zIndex = originalStyle.zIndex;
                    } else {
                        element.style.removeProperty('z-index');
                    }

                    if (originalStyle.position) {
                        element.style.position = originalStyle.position;
                    } else if (element.style.position === 'relative') {
                        element.style.removeProperty('position');
                    }
                }

                // Process children recursively
                Array.from(element.children).forEach(child => restoreStyles(child));
            };

            // Apply the style restoration
            restoreStyles(this._currentHighlightedElement);

            // Clear references
            this._currentHighlightedElement = null;
            this._originalStyles = null;
        }
    }

    /**
     * End the tour
     */
    endTour() {
        // Hide tour elements
        this.tourOverlay.classList.remove('active');
        this.tourHighlight.classList.remove('active');
        this.tourTooltip.classList.remove('active');

        // Clear any highlighted elements
        this._clearHighlightedElements();

        // Set inactive state
        this.isActive = false;

        // Remove keyboard event listener
        document.removeEventListener('keydown', this.handleKeyboardNavigation);

        // Mark tour as completed
        localStorage.setItem('oms_tour_completed', 'true');
    }

    /**
     * Position all tour elements based on current step
     */
    positionTourElements() {
        if (!this.isActive) return;

        // Get the appropriate tour steps based on user type
        const steps = this.tourType === 'new' ? this.newUserTourSteps : this.returningUserTourSteps;

        // Get current step
        const step = steps[this.currentStep];

        // Find the target element
        const targetElement = document.querySelector(step.element);
        if (!targetElement) {
            console.warn(`Tour target element not found: ${step.element}`);
            return;
        }

        // Check if the current highlighted element is different from the target
        // If so, clear all highlights first to ensure only one element is highlighted
        if (this._currentHighlightedElement && this._currentHighlightedElement !== targetElement) {
            this._clearHighlightedElements();
        }

        // Ensure the element is visible in the viewport
        const rect = targetElement.getBoundingClientRect();
        if (rect.top < 0 || rect.bottom > window.innerHeight) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }

        // Reposition elements with a slight delay to ensure smooth scrolling completes
        setTimeout(() => {
            this.positionHighlight(targetElement, step.highlightPadding || 0);
            this.positionTooltip(targetElement, step.position, step);
        }, 300);
    }
}
