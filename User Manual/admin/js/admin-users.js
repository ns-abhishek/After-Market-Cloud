/**
 * Admin User Management Module
 * Handles user management, roles, permissions, and activity tracking
 */
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const adminTabs = document.querySelectorAll('.admin-tab');
    const tabContents = document.querySelectorAll('.admin-tab-content');
    const selectAllCheckbox = document.getElementById('select-all-users');
    const userCheckboxes = document.querySelectorAll('.user-select');
    const searchInput = document.querySelector('.admin-search-bar input');
    const actionButtons = document.querySelectorAll('.action-btn');
    const roleItems = document.querySelectorAll('.role-item');
    const addUserForm = document.getElementById('add-user-form');
    
    // Initialize user management
    initUserManagement();
    
    /**
     * Initialize user management components and event listeners
     */
    function initUserManagement() {
        // Set up tabs
        if (adminTabs.length > 0) {
            adminTabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    const tabId = this.dataset.tab;
                    switchTab(tabId);
                });
            });
        }
        
        // Set up select all checkbox
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', toggleSelectAll);
        }
        
        // Set up search functionality
        if (searchInput) {
            searchInput.addEventListener('input', searchUsers);
        }
        
        // Set up action buttons
        if (actionButtons.length > 0) {
            actionButtons.forEach(button => {
                button.addEventListener('click', handleActionButton);
            });
        }
        
        // Set up role items
        if (roleItems.length > 0) {
            roleItems.forEach(item => {
                item.addEventListener('click', function() {
                    selectRole(this.dataset.role);
                });
            });
        }
        
        // Set up add user form
        if (addUserForm) {
            addUserForm.addEventListener('submit', handleAddUser);
        }
        
        // Check URL parameters for actions
        checkUrlParams();
    }
    
    /**
     * Switch between tabs
     * @param {string} tabId - ID of the tab to switch to
     */
    function switchTab(tabId) {
        // Update active tab
        adminTabs.forEach(tab => {
            if (tab.dataset.tab === tabId) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        // Update active content
        tabContents.forEach(content => {
            if (content.id === tabId) {
                content.classList.add('active');
                
                // Animate content in
                content.style.animation = 'fadeIn 0.3s ease';
            } else {
                content.classList.remove('active');
            }
        });
    }
    
    /**
     * Toggle select all checkboxes
     */
    function toggleSelectAll() {
        const isChecked = selectAllCheckbox.checked;
        
        userCheckboxes.forEach(checkbox => {
            checkbox.checked = isChecked;
            
            // Update row styling
            const row = checkbox.closest('tr');
            if (row) {
                if (isChecked) {
                    row.classList.add('selected');
                } else {
                    row.classList.remove('selected');
                }
            }
        });
    }
    
    /**
     * Search users in the table
     */
    function searchUsers() {
        const searchTerm = searchInput.value.toLowerCase();
        const userRows = document.querySelectorAll('.admin-content-table tbody tr');
        
        userRows.forEach(row => {
            const name = row.querySelector('.user-name').textContent.toLowerCase();
            const username = row.querySelector('.user-username').textContent.toLowerCase();
            const email = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
            const role = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
            
            if (name.includes(searchTerm) || username.includes(searchTerm) || 
                email.includes(searchTerm) || role.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
    
    /**
     * Handle action button clicks (edit, lock/unlock, delete)
     * @param {Event} e - Click event
     */
    function handleActionButton(e) {
        const button = e.currentTarget;
        const action = button.classList.contains('edit') ? 'edit' :
                      button.classList.contains('lock') ? 'lock' :
                      button.classList.contains('unlock') ? 'unlock' :
                      button.classList.contains('delete') ? 'delete' : '';
        
        const row = button.closest('tr');
        const userName = row.querySelector('.user-name').textContent;
        
        switch (action) {
            case 'edit':
                // In a real application, this would load the user for editing
                // For demo purposes, we'll switch to the add user tab and populate it
                switchTab('add-user');
                
                // Set form values
                document.getElementById('user-firstname').value = userName.split(' ')[0];
                document.getElementById('user-lastname').value = userName.split(' ')[1] || '';
                document.getElementById('user-email').value = row.querySelector('td:nth-child(3)').textContent;
                document.getElementById('user-username').value = row.querySelector('.user-username').textContent;
                
                // Show notification
                showNotification(`Editing user "${userName}"`, 'info');
                break;
                
            case 'lock':
                // In a real application, this would lock the user account
                // For demo purposes, we'll update the status badge
                const statusCell = row.querySelector('td:nth-child(5)');
                statusCell.innerHTML = '<span class="status-badge locked">Locked</span>';
                
                // Update the button to unlock
                button.classList.remove('lock');
                button.classList.add('unlock');
                button.title = 'Unlock';
                button.innerHTML = '<i class="fas fa-unlock"></i>';
                
                // Show notification
                showNotification(`Locked user "${userName}"`, 'warning');
                break;
                
            case 'unlock':
                // In a real application, this would unlock the user account
                // For demo purposes, we'll update the status badge
                const statusCellUnlock = row.querySelector('td:nth-child(5)');
                statusCellUnlock.innerHTML = '<span class="status-badge active">Active</span>';
                
                // Update the button to lock
                button.classList.remove('unlock');
                button.classList.add('lock');
                button.title = 'Lock';
                button.innerHTML = '<i class="fas fa-lock"></i>';
                
                // Show notification
                showNotification(`Unlocked user "${userName}"`, 'success');
                break;
                
            case 'delete':
                // Confirm deletion
                if (confirm(`Are you sure you want to delete user "${userName}"?`)) {
                    // In a real application, this would delete the user
                    // For demo purposes, we'll remove the row with animation
                    row.style.animation = 'fadeOut 0.5s ease forwards';
                    setTimeout(() => {
                        row.remove();
                    }, 500);
                    
                    // Show notification
                    showNotification(`Deleted user "${userName}"`, 'success');
                }
                break;
        }
    }
    
    /**
     * Select a role and update permissions display
     * @param {string} roleId - ID of the role to select
     */
    function selectRole(roleId) {
        // Update active role
        roleItems.forEach(item => {
            if (item.dataset.role === roleId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Update permissions header
        const permissionsHeader = document.querySelector('.permissions-header h3');
        if (permissionsHeader) {
            // Capitalize first letter and add "Permissions"
            const roleName = roleId.charAt(0).toUpperCase() + roleId.slice(1);
            permissionsHeader.textContent = `${roleName} Permissions`;
        }
        
        // In a real application, this would load the permissions for the selected role
        // For demo purposes, we'll update the checkboxes based on the role
        updatePermissionsForRole(roleId);
    }
    
    /**
     * Update permissions checkboxes based on role
     * @param {string} roleId - ID of the role
     */
    function updatePermissionsForRole(roleId) {
        const permissionsTable = document.querySelector('.permissions-table tbody');
        
        if (permissionsTable) {
            const rows = permissionsTable.querySelectorAll('tr');
            
            rows.forEach(row => {
                const checkboxes = row.querySelectorAll('input[type="checkbox"]');
                const permissionType = row.querySelector('td').textContent;
                
                checkboxes.forEach((checkbox, index) => {
                    // Reset all checkboxes
                    checkbox.checked = false;
                    
                    // Set permissions based on role
                    switch (roleId) {
                        case 'administrator':
                            // Administrators have all permissions
                            checkbox.checked = true;
                            break;
                            
                        case 'editor':
                            // Editors can do everything except manage users and settings
                            if (permissionType !== 'Users' && permissionType !== 'Settings') {
                                checkbox.checked = true;
                            }
                            break;
                            
                        case 'author':
                            // Authors can create, read, update their own content
                            if (permissionType === 'Content' || permissionType === 'Media') {
                                // Create, Read, Update
                                if (index < 3) {
                                    checkbox.checked = true;
                                }
                                // Publish only for authors on content
                                if (index === 4 && permissionType === 'Content') {
                                    checkbox.checked = true;
                                }
                            }
                            break;
                            
                        case 'viewer':
                            // Viewers can only read content
                            if (index === 1) { // Read permission
                                checkbox.checked = true;
                            }
                            break;
                    }
                });
            });
        }
    }
    
    /**
     * Handle add user form submission
     * @param {Event} e - Form submit event
     */
    function handleAddUser(e) {
        e.preventDefault();
        
        // Get form values
        const firstName = document.getElementById('user-firstname').value.trim();
        const lastName = document.getElementById('user-lastname').value.trim();
        const email = document.getElementById('user-email').value.trim();
        const username = document.getElementById('user-username').value.trim();
        const password = document.getElementById('user-password').value;
        const confirmPassword = document.getElementById('user-confirm-password').value;
        const role = document.getElementById('user-role').value;
        const status = document.getElementById('user-status').value;
        
        // Validate form
        if (!firstName || !lastName || !email || !username || !password || !role) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showNotification('Passwords do not match', 'error');
            return;
        }
        
        // In a real application, this would create a new user
        // For demo purposes, we'll show a success message and reset the form
        showNotification(`User "${firstName} ${lastName}" created successfully`, 'success');
        
        // Reset form
        addUserForm.reset();
        
        // Switch to all users tab
        switchTab('all-users');
    }
    
    /**
     * Check URL parameters for actions
     */
    function checkUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        
        if (urlParams.has('action')) {
            const action = urlParams.get('action');
            
            switch (action) {
                case 'new':
                    // Switch to add user tab
                    switchTab('add-user');
                    break;
                    
                case 'edit':
                    // Switch to add user tab and load user
                    switchTab('add-user');
                    
                    // In a real application, this would load the user for editing
                    // based on the ID parameter
                    if (urlParams.has('id')) {
                        const id = urlParams.get('id');
                        console.log(`Loading user with ID: ${id}`);
                    }
                    break;
                    
                case 'roles':
                    // Switch to roles tab
                    switchTab('roles');
                    break;
                    
                case 'activity':
                    // Switch to activity tab
                    switchTab('activity');
                    break;
            }
        }
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
                
                @keyframes fadeOut {
                    from { opacity: 1; transform: translateY(0); }
                    to { opacity: 0; transform: translateY(-20px); }
                }
            `;
            document.head.appendChild(style);
        }
    }
});
