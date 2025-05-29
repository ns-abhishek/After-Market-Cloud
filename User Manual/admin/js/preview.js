/**
 * Documentation Preview Module
 * Handles documentation preview functionality with version comparison and device preview
 */
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const previewTitle = document.getElementById('preview-title');
    const previewDocType = document.getElementById('preview-doc-type');
    const versionSelect = document.getElementById('version-select');
    const previewTenant = document.getElementById('preview-tenant');
    const previewLocale = document.getElementById('preview-locale');
    const toggleComparisonBtn = document.getElementById('toggle-comparison');
    const toggleDevicesBtn = document.getElementById('toggle-devices');
    const editDocumentBtn = document.getElementById('edit-document');
    const previewSingle = document.getElementById('preview-single');
    const previewComparison = document.getElementById('preview-comparison');
    const comparisonContainer = document.getElementById('comparison-container');
    const comparisonVersionLabel = document.getElementById('comparison-version-label');
    const previewFrame = document.getElementById('preview-frame');
    const deviceButtons = document.querySelectorAll('.preview-frame-action');
    
    // Initialize preview
    initPreview();
    
    /**
     * Initialize preview components and event listeners
     */
    function initPreview() {
        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const title = urlParams.get('title');
        const docType = urlParams.get('type');
        
        // Set preview title and document type
        if (title) {
            previewTitle.textContent = title;
        }
        
        if (docType) {
            previewDocType.textContent = docType === 'complete' ? 'Complete User Manual' : 'Module-Specific Manual';
        }
        
        // Set up version select
        if (versionSelect) {
            versionSelect.addEventListener('change', function() {
                const version = this.value;
                updatePreviewVersion(version);
            });
        }
        
        // Set up tenant select
        if (previewTenant) {
            previewTenant.addEventListener('change', function() {
                const tenant = this.value;
                updatePreviewTenant(tenant);
            });
        }
        
        // Set up locale select
        if (previewLocale) {
            previewLocale.addEventListener('change', function() {
                const locale = this.value;
                updatePreviewLocale(locale);
            });
        }
        
        // Set up toggle comparison button
        if (toggleComparisonBtn) {
            toggleComparisonBtn.addEventListener('click', toggleComparison);
        }
        
        // Set up toggle devices button
        if (toggleDevicesBtn) {
            toggleDevicesBtn.addEventListener('click', toggleDevices);
        }
        
        // Set up edit document button
        if (editDocumentBtn) {
            editDocumentBtn.addEventListener('click', editDocument);
        }
        
        // Set up device buttons
        if (deviceButtons.length > 0) {
            deviceButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const device = this.dataset.device;
                    switchDevice(device);
                });
            });
        }
    }
    
    /**
     * Update preview based on selected version
     * @param {string} version - Selected version
     */
    function updatePreviewVersion(version) {
        // In a real application, this would load the content for the selected version
        // For demo purposes, we'll just show a notification
        showNotification(`Updated preview to version ${version}`, 'info');
        
        // Update comparison version label
        if (comparisonVersionLabel) {
            comparisonVersionLabel.textContent = version === 'current' ? '1.2' : version;
        }
        
        // If comparison mode is active, update the comparison
        if (previewComparison.style.display !== 'none') {
            updateComparison(version);
        }
    }
    
    /**
     * Update preview based on selected tenant
     * @param {string} tenant - Selected tenant
     */
    function updatePreviewTenant(tenant) {
        // In a real application, this would load the content for the selected tenant
        // For demo purposes, we'll just show a notification
        showNotification(`Updated preview for tenant: ${tenant}`, 'info');
    }
    
    /**
     * Update preview based on selected locale
     * @param {string} locale - Selected locale
     */
    function updatePreviewLocale(locale) {
        // In a real application, this would load the content for the selected locale
        // For demo purposes, we'll just show a notification
        showNotification(`Updated preview for locale: ${locale}`, 'info');
    }
    
    /**
     * Toggle between single preview and comparison mode
     */
    function toggleComparison() {
        if (previewComparison.style.display === 'none') {
            // Switch to comparison mode
            previewSingle.classList.remove('active');
            previewComparison.style.display = 'block';
            toggleComparisonBtn.innerHTML = '<i class="fas fa-eye"></i> Single View';
            
            // Update comparison
            updateComparison(versionSelect.value);
        } else {
            // Switch to single preview mode
            previewSingle.classList.add('active');
            previewComparison.style.display = 'none';
            toggleComparisonBtn.innerHTML = '<i class="fas fa-code-compare"></i> Compare Versions';
        }
    }
    
    /**
     * Update version comparison
     * @param {string} version - Selected version to compare with current
     */
    function updateComparison(version) {
        // In a real application, this would fetch the diff between versions
        // For demo purposes, we'll use a sample diff
        
        // Sample diff (added a new paragraph and modified a list item)
        const diffText = `
diff --git a/user-roles.html b/user-roles.html
index 1234567..abcdefg 100644
--- a/user-roles.html
+++ b/user-roles.html
@@ -10,7 +10,7 @@
 <h2>Available User Roles</h2>
 <p>The system provides several predefined user roles, each with specific access levels and capabilities:</p>
 
-<div class="role-card">
+<div class="role-card primary">
     <div class="role-header">
         <i class="fas fa-user-shield"></i>
         <h3>Administrator</h3>
@@ -19,7 +19,7 @@
         <p>Administrators have complete access to all system functions and can manage all aspects of the application.</p>
         <ul>
             <li>User management (create, edit, delete users)</li>
-            <li>Role assignment and permission configuration</li>
+            <li>Role assignment, permission configuration, and access control</li>
             <li>System configuration and settings</li>
             <li>Access to all modules and features</li>
             <li>Audit log review</li>
@@ -40,4 +40,8 @@
 </div>
 
 <h2>Custom Roles</h2>
-<p>In addition to the predefined roles, administrators can create custom roles with specific permission sets tailored to your organization's needs.</p>
+<p>In addition to the predefined roles, administrators can create custom roles with specific permission sets tailored to your organization's needs.</p>
+
+<h2>Role Hierarchy</h2>
+<p>The system implements a role hierarchy where higher-level roles inherit permissions from lower-level roles. This simplifies permission management and ensures consistent access control across the application.</p>
+
`;
        
        // Use diff2html to render the diff
        const diff2htmlUi = new Diff2HtmlUI({diff: diffText});
        diff2htmlUi.draw(comparisonContainer, {
            matching: 'lines',
            outputFormat: 'side-by-side',
            drawFileList: false,
            fileContentToggle: false
        });
        
        showNotification(`Comparing current version with ${version}`, 'info');
    }
    
    /**
     * Toggle device preview options
     */
    function toggleDevices() {
        const deviceActions = document.querySelector('.preview-frame-actions');
        
        if (deviceActions.style.display === 'none') {
            deviceActions.style.display = 'flex';
            toggleDevicesBtn.innerHTML = '<i class="fas fa-desktop"></i> Hide Devices';
        } else {
            deviceActions.style.display = 'none';
            toggleDevicesBtn.innerHTML = '<i class="fas fa-mobile-alt"></i> Device Preview';
        }
    }
    
    /**
     * Switch between device preview modes
     * @param {string} device - Device type (desktop, tablet, mobile)
     */
    function switchDevice(device) {
        // Update active button
        deviceButtons.forEach(button => {
            if (button.dataset.device === device) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
        
        // Update preview frame class
        previewFrame.className = `preview-frame ${device}`;
        
        showNotification(`Switched to ${device} view`, 'info');
    }
    
    /**
     * Edit the current document
     */
    function editDocument() {
        // In a real application, this would redirect to the content editor
        // For demo purposes, we'll redirect to the content manager
        window.location.href = `content-manager.html?action=edit&title=${encodeURIComponent(previewTitle.textContent)}`;
    }
    
    /**
     * Show notification message
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, error, warning, info)
     */
    function showNotification(message, type = 'info') {
        // Create notification element if it doesn't exist
        let notificationContainer = document.querySelector('.notification-container');
        
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.className = 'notification-container';
            notificationContainer.style.position = 'fixed';
            notificationContainer.style.top = '20px';
            notificationContainer.style.right = '20px';
            notificationContainer.style.zIndex = '9999';
            document.body.appendChild(notificationContainer);
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        // Set notification styles
        notification.style.backgroundColor = type === 'success' ? '#4CAF50' : 
                                            type === 'error' ? '#F44336' : 
                                            type === 'warning' ? '#FF9800' : '#2196F3';
        notification.style.color = 'white';
        notification.style.padding = '12px 20px';
        notification.style.marginBottom = '10px';
        notification.style.borderRadius = '4px';
        notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        notification.style.display = 'flex';
        notification.style.alignItems = 'center';
        notification.style.justifyContent = 'space-between';
        notification.style.animation = 'slideInLeft 0.3s ease forwards';
        notification.style.opacity = '0';
        
        // Set notification icon
        const icon = type === 'success' ? 'check-circle' : 
                    type === 'error' ? 'exclamation-circle' : 
                    type === 'warning' ? 'exclamation-triangle' : 'info-circle';
        
        // Set notification content
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-${icon}"></i>
                <span>${message}</span>
            </div>
            <button class="close-notification" style="background: none; border: none; color: white; cursor: pointer;">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add notification to container
        notificationContainer.appendChild(notification);
        
        // Add close button event listener
        const closeButton = notification.querySelector('.close-notification');
        closeButton.addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        // Auto-remove notification after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease forwards';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 5000);
        
        // Add animations if not already added
        if (!document.querySelector('#notification-animations')) {
            const style = document.createElement('style');
            style.id = 'notification-animations';
            style.textContent = `
                @keyframes slideInLeft {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
});
