/**
 * Admin Permissions Management Module
 * Handles user permissions for tenant and locale management
 */
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const adminTabs = document.querySelectorAll('.admin-tab');
    const tabContents = document.querySelectorAll('.admin-tab-content');
    const addRoleButton = document.getElementById('add-role-btn');
    const addTenantPermissionButton = document.getElementById('add-tenant-permission-btn');
    const addLocalePermissionButton = document.getElementById('add-locale-permission-btn');
    const exportPermissionsButton = document.getElementById('export-permissions-btn');
    const actionButtons = document.querySelectorAll('.action-btn');
    
    // Initialize permissions management
    initPermissionsManagement();
    
    /**
     * Initialize permissions management components and event listeners
     */
    function initPermissionsManagement() {
        // Set up tabs
        if (adminTabs.length > 0) {
            adminTabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    const tabId = this.dataset.tab;
                    switchTab(tabId);
                });
            });
        }
        
        // Set up add role button
        if (addRoleButton) {
            addRoleButton.addEventListener('click', showAddRoleDialog);
        }
        
        // Set up add tenant permission button
        if (addTenantPermissionButton) {
            addTenantPermissionButton.addEventListener('click', showAddTenantPermissionDialog);
        }
        
        // Set up add locale permission button
        if (addLocalePermissionButton) {
            addLocalePermissionButton.addEventListener('click', showAddLocalePermissionDialog);
        }
        
        // Set up export permissions button
        if (exportPermissionsButton) {
            exportPermissionsButton.addEventListener('click', exportPermissions);
        }
        
        // Set up action buttons
        if (actionButtons.length > 0) {
            actionButtons.forEach(button => {
                button.addEventListener('click', handleActionButton);
            });
        }
    }
    
    /**
     * Switch between tabs
     * @param {string} tabId - ID of the tab to switch to
     */
    function switchTab(tabId) {
        // Remove active class from all tabs and tab contents
        adminTabs.forEach(tab => tab.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to selected tab and tab content
        const selectedTab = document.querySelector(`.admin-tab[data-tab="${tabId}"]`);
        const selectedContent = document.getElementById(tabId);
        
        if (selectedTab && selectedContent) {
            selectedTab.classList.add('active');
            selectedContent.classList.add('active');
        }
    }
    
    /**
     * Show add role dialog
     */
    function showAddRoleDialog() {
        // Create dialog element
        const dialog = document.createElement('div');
        dialog.className = 'permission-dialog';
        dialog.innerHTML = `
            <div class="permission-dialog-content">
                <div class="permission-dialog-header">
                    <h3><i class="fas fa-user-tag"></i> Add New Role</h3>
                    <button class="permission-dialog-close"><i class="fas fa-times"></i></button>
                </div>
                <div class="permission-dialog-body">
                    <form id="add-role-form" class="admin-form">
                        <div class="form-group">
                            <label for="role-name">Role Name *</label>
                            <input type="text" id="role-name" required>
                        </div>
                        <div class="form-group">
                            <label for="role-description">Description</label>
                            <textarea id="role-description" rows="3"></textarea>
                        </div>
                        <div class="form-group">
                            <label>Permissions</label>
                            <div class="permission-form">
                                <div class="permission-form-section">
                                    <h4>Content Management</h4>
                                    <div class="permission-checkbox-group">
                                        <div class="permission-checkbox-item">
                                            <input type="checkbox" id="perm-create-content">
                                            <label for="perm-create-content">Create Content</label>
                                        </div>
                                        <div class="permission-checkbox-item">
                                            <input type="checkbox" id="perm-edit-content">
                                            <label for="perm-edit-content">Edit Content</label>
                                        </div>
                                        <div class="permission-checkbox-item">
                                            <input type="checkbox" id="perm-publish-content">
                                            <label for="perm-publish-content">Publish Content</label>
                                        </div>
                                        <div class="permission-checkbox-item">
                                            <input type="checkbox" id="perm-delete-content">
                                            <label for="perm-delete-content">Delete Content</label>
                                        </div>
                                    </div>
                                    
                                    <h4>Tenant Management</h4>
                                    <div class="permission-checkbox-group">
                                        <div class="permission-checkbox-item">
                                            <input type="checkbox" id="perm-create-tenant">
                                            <label for="perm-create-tenant">Create Tenant</label>
                                        </div>
                                        <div class="permission-checkbox-item">
                                            <input type="checkbox" id="perm-edit-tenant">
                                            <label for="perm-edit-tenant">Edit Tenant</label>
                                        </div>
                                        <div class="permission-checkbox-item">
                                            <input type="checkbox" id="perm-delete-tenant">
                                            <label for="perm-delete-tenant">Delete Tenant</label>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="permission-form-section">
                                    <h4>Locale Management</h4>
                                    <div class="permission-checkbox-group">
                                        <div class="permission-checkbox-item">
                                            <input type="checkbox" id="perm-create-locale">
                                            <label for="perm-create-locale">Create Locale</label>
                                        </div>
                                        <div class="permission-checkbox-item">
                                            <input type="checkbox" id="perm-edit-locale">
                                            <label for="perm-edit-locale">Edit Locale</label>
                                        </div>
                                        <div class="permission-checkbox-item">
                                            <input type="checkbox" id="perm-delete-locale">
                                            <label for="perm-delete-locale">Delete Locale</label>
                                        </div>
                                    </div>
                                    
                                    <h4>User Management</h4>
                                    <div class="permission-checkbox-group">
                                        <div class="permission-checkbox-item">
                                            <input type="checkbox" id="perm-manage-users">
                                            <label for="perm-manage-users">Manage Users</label>
                                        </div>
                                        <div class="permission-checkbox-item">
                                            <input type="checkbox" id="perm-manage-roles">
                                            <label for="perm-manage-roles">Manage Roles</label>
                                        </div>
                                        <div class="permission-checkbox-item">
                                            <input type="checkbox" id="perm-assign-permissions">
                                            <label for="perm-assign-permissions">Assign Permissions</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="permission-dialog-footer">
                    <button class="admin-button secondary" id="cancel-role-btn">Cancel</button>
                    <button class="admin-button" id="save-role-btn">Save Role</button>
                </div>
            </div>
        `;
        
        // Add dialog to the DOM
        document.body.appendChild(dialog);
        
        // Set up event listeners
        const closeButton = dialog.querySelector('.permission-dialog-close');
        const cancelButton = dialog.getElementById('cancel-role-btn');
        const saveButton = dialog.getElementById('save-role-btn');
        
        closeButton.addEventListener('click', () => {
            dialog.remove();
        });
        
        cancelButton.addEventListener('click', () => {
            dialog.remove();
        });
        
        saveButton.addEventListener('click', () => {
            saveRole(dialog);
        });
    }
    
    /**
     * Save role from dialog
     * @param {HTMLElement} dialog - Dialog element
     */
    function saveRole(dialog) {
        const roleName = dialog.querySelector('#role-name').value;
        const roleDescription = dialog.querySelector('#role-description').value;
        
        if (!roleName) {
            showNotification('Role name is required', 'error');
            return;
        }
        
        // In a real application, this would save the role to the server
        // For demo purposes, we'll just show a notification
        showNotification(`Role "${roleName}" created successfully`, 'success');
        
        // Close dialog
        dialog.remove();
    }
    
    /**
     * Show add tenant permission dialog
     */
    function showAddTenantPermissionDialog() {
        // Create dialog element
        const dialog = document.createElement('div');
        dialog.className = 'permission-dialog';
        dialog.innerHTML = `
            <div class="permission-dialog-content">
                <div class="permission-dialog-header">
                    <h3><i class="fas fa-building"></i> Add Tenant Permission</h3>
                    <button class="permission-dialog-close"><i class="fas fa-times"></i></button>
                </div>
                <div class="permission-dialog-body">
                    <form id="add-tenant-permission-form" class="admin-form">
                        <div class="form-group">
                            <label>Assign To</label>
                            <div class="permission-level-selector">
                                <div class="permission-level-option selected">
                                    <input type="radio" name="assign-to" value="role" checked>
                                    <div class="permission-level-info">
                                        <h5>Role</h5>
                                        <p>Assign permission to all users with this role</p>
                                    </div>
                                </div>
                                <div class="permission-level-option">
                                    <input type="radio" name="assign-to" value="user">
                                    <div class="permission-level-info">
                                        <h5>User</h5>
                                        <p>Assign permission to a specific user</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-group" id="role-select-group">
                            <label for="role-select">Role</label>
                            <select id="role-select" class="admin-select">
                                <option value="">Select a role</option>
                                <option value="super-admin">Super Admin</option>
                                <option value="content-manager">Content Manager</option>
                                <option value="translator">Translator</option>
                                <option value="tenant-admin">Tenant Admin</option>
                                <option value="locale-manager">Locale Manager</option>
                            </select>
                        </div>
                        
                        <div class="form-group" id="user-select-group" style="display: none;">
                            <label for="user-search">User</label>
                            <div class="user-search">
                                <i class="fas fa-search"></i>
                                <input type="text" id="user-search" placeholder="Search users...">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="tenant-select">Tenant</label>
                            <select id="tenant-select" class="admin-select">
                                <option value="">Select a tenant</option>
                                <option value="global">Global (All Tenants)</option>
                                <option value="acme-corp">Acme Corporation</option>
                                <option value="global-ent">Global Enterprises</option>
                                <option value="springfield-gov">City of Springfield</option>
                                <option value="tech-solutions">Tech Solutions Ltd</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>Access Level</label>
                            <div class="permission-level-selector">
                                <div class="permission-level-option selected">
                                    <input type="radio" name="access-level" value="full" checked>
                                    <div class="permission-level-info">
                                        <h5>Full Access</h5>
                                        <p>Can create, edit, publish, and delete content</p>
                                    </div>
                                </div>
                                <div class="permission-level-option">
                                    <input type="radio" name="access-level" value="read-write">
                                    <div class="permission-level-info">
                                        <h5>Read/Write</h5>
                                        <p>Can view, edit, and publish content</p>
                                    </div>
                                </div>
                                <div class="permission-level-option">
                                    <input type="radio" name="access-level" value="read-only">
                                    <div class="permission-level-info">
                                        <h5>Read Only</h5>
                                        <p>Can only view content</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="permission-dialog-footer">
                    <button class="admin-button secondary" id="cancel-tenant-permission-btn">Cancel</button>
                    <button class="admin-button" id="save-tenant-permission-btn">Save Permission</button>
                </div>
            </div>
        `;
        
        // Add dialog to the DOM
        document.body.appendChild(dialog);
        
        // Set up event listeners
        const closeButton = dialog.querySelector('.permission-dialog-close');
        const cancelButton = dialog.getElementById('cancel-tenant-permission-btn');
        const saveButton = dialog.getElementById('save-tenant-permission-btn');
        const assignToOptions = dialog.querySelectorAll('input[name="assign-to"]');
        const roleSelectGroup = dialog.getElementById('role-select-group');
        const userSelectGroup = dialog.getElementById('user-select-group');
        
        closeButton.addEventListener('click', () => {
            dialog.remove();
        });
        
        cancelButton.addEventListener('click', () => {
            dialog.remove();
        });
        
        saveButton.addEventListener('click', () => {
            saveTenantPermission(dialog);
        });
        
        // Toggle between role and user selection
        assignToOptions.forEach(option => {
            option.addEventListener('change', function() {
                const assignTo = this.value;
                
                // Update selected class
                dialog.querySelectorAll('.permission-level-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                this.closest('.permission-level-option').classList.add('selected');
                
                // Show/hide appropriate selection group
                if (assignTo === 'role') {
                    roleSelectGroup.style.display = '';
                    userSelectGroup.style.display = 'none';
                } else {
                    roleSelectGroup.style.display = 'none';
                    userSelectGroup.style.display = '';
                }
            });
        });
        
        // Set up permission level options
        const accessLevelOptions = dialog.querySelectorAll('input[name="access-level"]');
        accessLevelOptions.forEach(option => {
            option.addEventListener('change', function() {
                // Update selected class
                dialog.querySelectorAll('.permission-level-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                this.closest('.permission-level-option').classList.add('selected');
            });
        });
    }
    
    /**
     * Save tenant permission from dialog
     * @param {HTMLElement} dialog - Dialog element
     */
    function saveTenantPermission(dialog) {
        const assignTo = dialog.querySelector('input[name="assign-to"]:checked').value;
        const tenant = dialog.getElementById('tenant-select').value;
        const accessLevel = dialog.querySelector('input[name="access-level"]:checked').value;
        
        let assignToValue;
        if (assignTo === 'role') {
            assignToValue = dialog.getElementById('role-select').value;
            if (!assignToValue) {
                showNotification('Please select a role', 'error');
                return;
            }
        } else {
            assignToValue = dialog.getElementById('user-search').value;
            if (!assignToValue) {
                showNotification('Please select a user', 'error');
                return;
            }
        }
        
        if (!tenant) {
            showNotification('Please select a tenant', 'error');
            return;
        }
        
        // In a real application, this would save the permission to the server
        // For demo purposes, we'll just show a notification
        showNotification(`Tenant permission added successfully`, 'success');
        
        // Close dialog
        dialog.remove();
    }
    
    /**
     * Show add locale permission dialog
     */
    function showAddLocalePermissionDialog() {
        // Create dialog element
        const dialog = document.createElement('div');
        dialog.className = 'permission-dialog';
        dialog.innerHTML = `
            <div class="permission-dialog-content">
                <div class="permission-dialog-header">
                    <h3><i class="fas fa-globe"></i> Add Locale Permission</h3>
                    <button class="permission-dialog-close"><i class="fas fa-times"></i></button>
                </div>
                <div class="permission-dialog-body">
                    <form id="add-locale-permission-form" class="admin-form">
                        <div class="form-group">
                            <label>Assign To</label>
                            <div class="permission-level-selector">
                                <div class="permission-level-option selected">
                                    <input type="radio" name="assign-to" value="role" checked>
                                    <div class="permission-level-info">
                                        <h5>Role</h5>
                                        <p>Assign permission to all users with this role</p>
                                    </div>
                                </div>
                                <div class="permission-level-option">
                                    <input type="radio" name="assign-to" value="user">
                                    <div class="permission-level-info">
                                        <h5>User</h5>
                                        <p>Assign permission to a specific user</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-group" id="role-select-group">
                            <label for="role-select">Role</label>
                            <select id="role-select" class="admin-select">
                                <option value="">Select a role</option>
                                <option value="super-admin">Super Admin</option>
                                <option value="content-manager">Content Manager</option>
                                <option value="translator">Translator</option>
                                <option value="tenant-admin">Tenant Admin</option>
                                <option value="locale-manager">Locale Manager</option>
                            </select>
                        </div>
                        
                        <div class="form-group" id="user-select-group" style="display: none;">
                            <label for="user-search">User</label>
                            <div class="user-search">
                                <i class="fas fa-search"></i>
                                <input type="text" id="user-search" placeholder="Search users...">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="locale-select">Locale</label>
                            <select id="locale-select" class="admin-select">
                                <option value="">Select a locale</option>
                                <option value="en-US">English (US)</option>
                                <option value="de-DE">German</option>
                                <option value="fr-FR">French</option>
                                <option value="ja-JP">Japanese</option>
                                <option value="es-ES">Spanish</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>Access Level</label>
                            <div class="permission-level-selector">
                                <div class="permission-level-option selected">
                                    <input type="radio" name="access-level" value="full" checked>
                                    <div class="permission-level-info">
                                        <h5>Full Access</h5>
                                        <p>Can create, edit, publish, and delete content</p>
                                    </div>
                                </div>
                                <div class="permission-level-option">
                                    <input type="radio" name="access-level" value="read-write">
                                    <div class="permission-level-info">
                                        <h5>Read/Write</h5>
                                        <p>Can view, edit, and publish content</p>
                                    </div>
                                </div>
                                <div class="permission-level-option">
                                    <input type="radio" name="access-level" value="read-only">
                                    <div class="permission-level-info">
                                        <h5>Read Only</h5>
                                        <p>Can only view content</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="permission-dialog-footer">
                    <button class="admin-button secondary" id="cancel-locale-permission-btn">Cancel</button>
                    <button class="admin-button" id="save-locale-permission-btn">Save Permission</button>
                </div>
            </div>
        `;
        
        // Add dialog to the DOM
        document.body.appendChild(dialog);
        
        // Set up event listeners
        const closeButton = dialog.querySelector('.permission-dialog-close');
        const cancelButton = dialog.getElementById('cancel-locale-permission-btn');
        const saveButton = dialog.getElementById('save-locale-permission-btn');
        const assignToOptions = dialog.querySelectorAll('input[name="assign-to"]');
        const roleSelectGroup = dialog.getElementById('role-select-group');
        const userSelectGroup = dialog.getElementById('user-select-group');
        
        closeButton.addEventListener('click', () => {
            dialog.remove();
        });
        
        cancelButton.addEventListener('click', () => {
            dialog.remove();
        });
        
        saveButton.addEventListener('click', () => {
            saveLocalePermission(dialog);
        });
        
        // Toggle between role and user selection
        assignToOptions.forEach(option => {
            option.addEventListener('change', function() {
                const assignTo = this.value;
                
                // Update selected class
                dialog.querySelectorAll('.permission-level-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                this.closest('.permission-level-option').classList.add('selected');
                
                // Show/hide appropriate selection group
                if (assignTo === 'role') {
                    roleSelectGroup.style.display = '';
                    userSelectGroup.style.display = 'none';
                } else {
                    roleSelectGroup.style.display = 'none';
                    userSelectGroup.style.display = '';
                }
            });
        });
        
        // Set up permission level options
        const accessLevelOptions = dialog.querySelectorAll('input[name="access-level"]');
        accessLevelOptions.forEach(option => {
            option.addEventListener('change', function() {
                // Update selected class
                dialog.querySelectorAll('.permission-level-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                this.closest('.permission-level-option').classList.add('selected');
            });
        });
    }
    
    /**
     * Save locale permission from dialog
     * @param {HTMLElement} dialog - Dialog element
     */
    function saveLocalePermission(dialog) {
        const assignTo = dialog.querySelector('input[name="assign-to"]:checked').value;
        const locale = dialog.getElementById('locale-select').value;
        const accessLevel = dialog.querySelector('input[name="access-level"]:checked').value;
        
        let assignToValue;
        if (assignTo === 'role') {
            assignToValue = dialog.getElementById('role-select').value;
            if (!assignToValue) {
                showNotification('Please select a role', 'error');
                return;
            }
        } else {
            assignToValue = dialog.getElementById('user-search').value;
            if (!assignToValue) {
                showNotification('Please select a user', 'error');
                return;
            }
        }
        
        if (!locale) {
            showNotification('Please select a locale', 'error');
            return;
        }
        
        // In a real application, this would save the permission to the server
        // For demo purposes, we'll just show a notification
        showNotification(`Locale permission added successfully`, 'success');
        
        // Close dialog
        dialog.remove();
    }
    
    /**
     * Export permissions
     */
    function exportPermissions() {
        // In a real application, this would generate and download a CSV/Excel file
        // For demo purposes, we'll just show a notification
        showNotification('Permissions export started. The file will be downloaded shortly.', 'success');
    }
    
    /**
     * Handle action button clicks
     */
    function handleActionButton() {
        const action = this.classList.contains('edit') ? 'edit' : 
                      this.classList.contains('view') ? 'view' : 
                      this.classList.contains('delete') ? 'delete' : '';
        
        const row = this.closest('tr');
        const firstCell = row.querySelector('td:first-child').textContent;
        
        switch (action) {
            case 'edit':
                // In a real application, this would open the edit form
                showNotification(`Editing ${firstCell}`, 'info');
                break;
                
            case 'view':
                // In a real application, this would show permissions details
                showNotification(`Viewing permissions for ${firstCell}`, 'info');
                break;
                
            case 'delete':
                // In a real application, this would show a confirmation dialog
                if (confirm(`Are you sure you want to delete ${firstCell}?`)) {
                    // For demo purposes, we'll just remove the row
                    row.remove();
                    showNotification(`Deleted ${firstCell}`, 'success');
                }
                break;
        }
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
