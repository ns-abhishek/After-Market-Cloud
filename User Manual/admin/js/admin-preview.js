/**
 * Admin Preview Module
 * Handles content preview with tenant and locale filtering
 */
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const previewTenantSelect = document.getElementById('preview-tenant');
    const previewLocaleSelect = document.getElementById('preview-locale');
    const applyPreviewButton = document.getElementById('apply-preview');
    const closePreviewButton = document.getElementById('close-preview');
    const previewFrame = document.getElementById('preview-frame');
    
    // Get content ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const contentId = urlParams.get('content');
    
    // Initialize preview
    initPreview();
    
    /**
     * Initialize preview components and event listeners
     */
    function initPreview() {
        // Set up apply preview button
        if (applyPreviewButton) {
            applyPreviewButton.addEventListener('click', updatePreview);
        }
        
        // Set up close preview button
        if (closePreviewButton) {
            closePreviewButton.addEventListener('click', closePreview);
        }
        
        // Load initial preview
        if (contentId) {
            loadContentPreview(contentId);
        }
    }
    
    /**
     * Update preview based on selected tenant and locale
     */
    function updatePreview() {
        const tenant = previewTenantSelect ? previewTenantSelect.value : 'global';
        const locale = previewLocaleSelect ? previewLocaleSelect.value : 'en-US';
        
        if (contentId) {
            // Update preview frame URL with tenant and locale parameters
            const previewUrl = getPreviewUrl(contentId, tenant, locale);
            if (previewFrame) {
                previewFrame.src = previewUrl;
            }
        } else {
            // If no content ID is specified, just update the preview frame with tenant and locale parameters
            const baseUrl = '../index.html';
            const previewUrl = `${baseUrl}?tenant=${tenant}&locale=${locale}`;
            if (previewFrame) {
                previewFrame.src = previewUrl;
            }
        }
    }
    
    /**
     * Load content preview
     * @param {string} id - Content ID to preview
     */
    function loadContentPreview(id) {
        const tenant = previewTenantSelect ? previewTenantSelect.value : 'global';
        const locale = previewLocaleSelect ? previewLocaleSelect.value : 'en-US';
        
        // Get preview URL for the content
        const previewUrl = getPreviewUrl(id, tenant, locale);
        
        // Load preview in the iframe
        if (previewFrame) {
            previewFrame.src = previewUrl;
        }
    }
    
    /**
     * Get preview URL for content
     * @param {string} id - Content ID
     * @param {string} tenant - Tenant ID
     * @param {string} locale - Locale code
     * @returns {string} Preview URL
     */
    function getPreviewUrl(id, tenant, locale) {
        // In a real application, this would generate a URL to preview the specific content
        // For demo purposes, we'll just use a simple URL with parameters
        
        // Map content IDs to page URLs
        const contentMap = {
            'getting-started': '../getting-started.html',
            'system-requirements': '../system-requirements.html',
            'managing-orders': '../managing-orders.html',
            'products': '../products.html',
            'default': '../index.html'
        };
        
        const baseUrl = contentMap[id] || contentMap['default'];
        return `${baseUrl}?tenant=${tenant}&locale=${locale}`;
    }
    
    /**
     * Close preview and return to previous page
     */
    function closePreview() {
        // In a real application, this would navigate back to the content manager
        window.location.href = 'content-manager.html';
    }
    
    /**
     * Show notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, error, warning, info)
     */
    function showNotification(message, type = 'info') {
        // Check if notification container exists
        let notificationContainer = document.querySelector('.notification-container');
        
        // Create container if it doesn't exist
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.className = 'notification-container';
            document.body.appendChild(notificationContainer);
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 
                                type === 'error' ? 'times-circle' : 
                                type === 'warning' ? 'exclamation-triangle' : 
                                'info-circle'}"></i>
            </div>
            <div class="notification-content">
                <p>${message}</p>
            </div>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        // Add notification to container
        notificationContainer.appendChild(notification);
        
        // Add event listener to close button
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', function() {
            notification.classList.add('closing');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        // Auto-remove notification after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.add('closing');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 5000);
    }
});
