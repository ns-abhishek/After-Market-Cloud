/**
 * Navigation Controller
 *
 * This file handles navigation between different pages and components
 * of the application, ensuring a seamless user experience.
 */

// Define page paths
const PAGES = {
    LOGIN: 'login.html',
    DASHBOARD: 'party-portal.html',
    PARTY_LIST: 'party-grid-modern.html',
    PROFILE: 'profile-page.html',
    HELP_CENTER: 'help-center.html',
    INVOICES: 'invoices.html',
    PAYMENTS: 'payments.html',
    DOCUMENTS: 'documents.html',
    SECURITY_SETTINGS: 'security-settings.html'
};

// Navigation Controller
const NavigationController = {
    /**
     * Navigate to a specific page
     * @param {string} page - The page to navigate to
     * @param {Object} params - Optional parameters to pass to the page
     */
    navigateTo: function(page, params = {}) {
        // Store any parameters in sessionStorage
        if (Object.keys(params).length > 0) {
            sessionStorage.setItem('navigationParams', JSON.stringify(params));
        }

        // Navigate to the page
        if (PAGES[page]) {
            window.location.href = PAGES[page];
        } else {
            console.error(`Page ${page} not found`);
        }
    },

    /**
     * Get parameters passed during navigation
     * @returns {Object} The parameters
     */
    getNavigationParams: function() {
        const params = sessionStorage.getItem('navigationParams');
        return params ? JSON.parse(params) : {};
    },

    /**
     * Clear navigation parameters
     */
    clearNavigationParams: function() {
        sessionStorage.removeItem('navigationParams');
    },

    /**
     * Navigate to a section within the current page
     * @param {string} section - The section to navigate to
     */
    navigateToSection: function(section) {
        // This function is used for in-page navigation
        // It will be implemented differently depending on the page
        if (typeof handleNavigation === 'function') {
            handleNavigation(section);
        } else {
            console.error('handleNavigation function not found');
        }
    },

    /**
     * Open a modal dialog
     * @param {string} modalId - The ID of the modal to open
     * @param {Object} data - Optional data to pass to the modal
     */
    openModal: function(modalId, data = {}) {
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.error(`Modal ${modalId} not found`);
            return;
        }

        // Store modal data
        if (Object.keys(data).length > 0) {
            modal.dataset.modalData = JSON.stringify(data);
        }

        // Display the modal
        modal.style.display = 'flex';

        // Add animation class if it exists
        if (modal.classList.contains('modal-animated')) {
            modal.classList.add('modal-show');
        }
    },

    /**
     * Close a modal dialog
     * @param {string} modalId - The ID of the modal to close
     */
    closeModal: function(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.error(`Modal ${modalId} not found`);
            return;
        }

        // Remove animation class if it exists
        if (modal.classList.contains('modal-animated')) {
            modal.classList.remove('modal-show');
            // Wait for animation to complete
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        } else {
            modal.style.display = 'none';
        }

        // Clear modal data
        delete modal.dataset.modalData;
    },

    /**
     * Get data passed to a modal
     * @param {string} modalId - The ID of the modal
     * @returns {Object} The modal data
     */
    getModalData: function(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.error(`Modal ${modalId} not found`);
            return {};
        }

        return modal.dataset.modalData ? JSON.parse(modal.dataset.modalData) : {};
    },

    /**
     * Show a notification
     * @param {string} message - The notification message
     * @param {string} type - The notification type (success, error, warning, info)
     * @param {number} duration - How long to show the notification (in ms)
     */
    showNotification: function(message, type = 'info', duration = 3000) {
        // Create notification element if it doesn't exist
        let notification = document.getElementById('notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'notification';
            notification.style.position = 'fixed';
            notification.style.bottom = '24px';
            notification.style.right = '24px';
            notification.style.padding = '16px 24px';
            notification.style.borderRadius = '4px';
            notification.style.color = 'white';
            notification.style.fontWeight = '500';
            notification.style.boxShadow = '0 3px 6px rgba(0, 0, 0, 0.16)';
            notification.style.transform = 'translateY(100px)';
            notification.style.opacity = '0';
            notification.style.transition = 'transform 0.3s, opacity 0.3s';
            notification.style.zIndex = '1000';
            document.body.appendChild(notification);
        }

        // Set notification content and type
        notification.textContent = message;

        // Set background color based on type
        switch (type) {
            case 'success':
                notification.style.backgroundColor = '#4caf50';
                break;
            case 'error':
                notification.style.backgroundColor = '#f44336';
                break;
            case 'warning':
                notification.style.backgroundColor = '#ff9800';
                break;
            case 'info':
            default:
                notification.style.backgroundColor = '#2196f3';
                break;
        }

        // Show notification
        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
        }, 10);

        // Hide notification after duration
        setTimeout(() => {
            notification.style.transform = 'translateY(100px)';
            notification.style.opacity = '0';
        }, duration);
    },

    /**
     * Confirm an action with the user
     * @param {string} message - The confirmation message
     * @param {Function} onConfirm - Function to call if user confirms
     * @param {Function} onCancel - Function to call if user cancels
     */
    confirmAction: function(message, onConfirm, onCancel = null) {
        // Create modal overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        modalOverlay.style.position = 'fixed';
        modalOverlay.style.top = '0';
        modalOverlay.style.left = '0';
        modalOverlay.style.right = '0';
        modalOverlay.style.bottom = '0';
        modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        modalOverlay.style.display = 'flex';
        modalOverlay.style.alignItems = 'center';
        modalOverlay.style.justifyContent = 'center';
        modalOverlay.style.zIndex = '9999';
        modalOverlay.style.animation = 'fadeIn 0.3s ease';

        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.style.backgroundColor = 'white';
        modalContent.style.borderRadius = '4px';
        modalContent.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
        modalContent.style.width = '90%';
        modalContent.style.maxWidth = '500px';
        modalContent.style.animation = 'slideInUp 0.3s ease';

        // Create modal header
        const modalHeader = document.createElement('div');
        modalHeader.className = 'modal-header';
        modalHeader.style.padding = '16px';
        modalHeader.style.borderBottom = '1px solid #e0e0e0';
        modalHeader.style.display = 'flex';
        modalHeader.style.alignItems = 'center';
        modalHeader.style.justifyContent = 'space-between';

        const modalTitle = document.createElement('h3');
        modalTitle.style.margin = '0';
        modalTitle.style.fontSize = '18px';
        modalTitle.textContent = 'Confirm Action';

        const closeButton = document.createElement('button');
        closeButton.className = 'modal-close';
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontSize = '24px';
        closeButton.style.lineHeight = '1';
        closeButton.textContent = '×';

        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeButton);

        // Create modal body
        const modalBody = document.createElement('div');
        modalBody.className = 'modal-body';
        modalBody.style.padding = '16px';

        const modalMessage = document.createElement('p');
        modalMessage.style.margin = '0';
        modalMessage.textContent = message;

        modalBody.appendChild(modalMessage);

        // Create modal footer
        const modalFooter = document.createElement('div');
        modalFooter.className = 'modal-footer';
        modalFooter.style.padding = '16px';
        modalFooter.style.borderTop = '1px solid #e0e0e0';
        modalFooter.style.display = 'flex';
        modalFooter.style.justifyContent = 'flex-end';
        modalFooter.style.gap = '8px';

        const cancelButton = document.createElement('button');
        cancelButton.className = 'modal-button modal-button-secondary';
        cancelButton.id = 'cancelButton';
        cancelButton.style.padding = '8px 16px';
        cancelButton.style.borderRadius = '4px';
        cancelButton.style.cursor = 'pointer';
        cancelButton.style.fontWeight = '500';
        cancelButton.style.backgroundColor = 'transparent';
        cancelButton.style.color = '#757575';
        cancelButton.style.border = '1px solid #e0e0e0';
        cancelButton.textContent = 'Cancel';

        const confirmButton = document.createElement('button');
        confirmButton.className = 'modal-button modal-button-primary';
        confirmButton.id = 'confirmButton';
        confirmButton.style.padding = '8px 16px';
        confirmButton.style.borderRadius = '4px';
        confirmButton.style.cursor = 'pointer';
        confirmButton.style.fontWeight = '500';
        confirmButton.style.backgroundColor = '#212529';
        confirmButton.style.color = 'white';
        confirmButton.style.border = 'none';
        confirmButton.textContent = 'Confirm';

        modalFooter.appendChild(cancelButton);
        modalFooter.appendChild(confirmButton);

        // Assemble modal
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        modalContent.appendChild(modalFooter);
        modalOverlay.appendChild(modalContent);

        // Add to body
        document.body.appendChild(modalOverlay);

        // Add necessary animation styles
        if (!document.getElementById('navigationControllerStyles')) {
            const styleElement = document.createElement('style');
            styleElement.id = 'navigationControllerStyles';
            styleElement.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideInUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styleElement);
        }

        // Close modal function
        const closeModal = () => {
            modalOverlay.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(modalOverlay);
            }, 300);
        };

        // Close button event listener
        closeButton.addEventListener('click', () => {
            closeModal();
            if (onCancel) onCancel();
        });

        // Cancel button event listener
        cancelButton.addEventListener('click', () => {
            closeModal();
            if (onCancel) onCancel();
        });

        // Confirm button event listener
        confirmButton.addEventListener('click', () => {
            closeModal();
            if (onConfirm) onConfirm();
        });

        // Click outside to cancel
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
                if (onCancel) onCancel();
            }
        });

        // Focus confirm button
        confirmButton.focus();
    }
};

// Export the NavigationController
window.NavigationController = NavigationController;
