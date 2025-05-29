/**
 * Admin Tenant Management Module
 * Handles tenant management, tenant-specific content, and tenant settings
 */
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const adminTabs = document.querySelectorAll('.admin-tab');
    const tabContents = document.querySelectorAll('.admin-tab-content');
    const selectAllCheckbox = document.getElementById('select-all-tenants');
    const tenantCheckboxes = document.querySelectorAll('.tenant-select');
    const searchInput = document.querySelector('.admin-search-bar input');
    const actionButtons = document.querySelectorAll('.action-btn');
    const addTenantForm = document.getElementById('add-tenant-form');
    const tenantIdInput = document.getElementById('tenant-id');
    const tenantNameInput = document.getElementById('tenant-name');
    
    // Initialize tenant management
    initTenantManagement();
    
    /**
     * Initialize tenant management components and event listeners
     */
    function initTenantManagement() {
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
            searchInput.addEventListener('input', searchTenants);
        }
        
        // Set up action buttons
        if (actionButtons.length > 0) {
            actionButtons.forEach(button => {
                button.addEventListener('click', handleActionButton);
            });
        }
        
        // Set up add tenant form
        if (addTenantForm) {
            addTenantForm.addEventListener('submit', handleAddTenant);
            
            // Auto-generate tenant ID from name
            if (tenantNameInput && tenantIdInput) {
                tenantNameInput.addEventListener('input', generateTenantId);
            }
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
     * Toggle select all checkboxes
     */
    function toggleSelectAll() {
        const isChecked = selectAllCheckbox.checked;
        
        tenantCheckboxes.forEach(checkbox => {
            checkbox.checked = isChecked;
        });
    }
    
    /**
     * Search tenants in the table
     */
    function searchTenants() {
        const searchTerm = searchInput.value.toLowerCase();
        const tenantRows = document.querySelectorAll('.admin-content-table tbody tr');
        
        tenantRows.forEach(row => {
            const name = row.querySelector('.tenant-name').textContent.toLowerCase();
            const id = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
            const group = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
            const countries = row.querySelector('td:nth-child(6)').textContent.toLowerCase();
            
            if (name.includes(searchTerm) || id.includes(searchTerm) || 
                group.includes(searchTerm) || countries.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
    
    /**
     * Handle action button clicks
     */
    function handleActionButton() {
        const action = this.classList.contains('edit') ? 'edit' : 
                      this.classList.contains('view') ? 'view' : 
                      this.classList.contains('delete') ? 'delete' : '';
        
        const row = this.closest('tr');
        const tenantName = row.querySelector('.tenant-name').textContent;
        
        switch (action) {
            case 'edit':
                // In a real application, this would open the edit form with tenant data
                showNotification(`Editing tenant "${tenantName}"`, 'info');
                // For demo purposes, switch to add tenant tab and populate form
                populateEditForm(row);
                switchTab('add-tenant');
                break;
                
            case 'view':
                // In a real application, this would show tenant-specific content
                showNotification(`Viewing content for tenant "${tenantName}"`, 'info');
                // For demo purposes, we'll just show a notification
                break;
                
            case 'delete':
                // In a real application, this would show a confirmation dialog
                if (confirm(`Are you sure you want to delete tenant "${tenantName}"?`)) {
                    // For demo purposes, we'll just remove the row
                    row.remove();
                    showNotification(`Deleted tenant "${tenantName}"`, 'success');
                }
                break;
        }
    }
    
    /**
     * Populate edit form with tenant data
     * @param {HTMLElement} row - Table row with tenant data
     */
    function populateEditForm(row) {
        const tenantName = row.querySelector('.tenant-name').textContent;
        const tenantId = row.querySelector('td:nth-child(3)').textContent;
        const tenantGroup = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
        const tenantStatus = row.querySelector('td:nth-child(5) .status-badge').classList.contains('active') ? 'active' : 'inactive';
        const tenantCountries = row.querySelector('td:nth-child(6)').textContent.split(', ');
        
        // Update form title
        const formTitle = document.querySelector('#add-tenant .admin-form-container h3');
        if (formTitle) {
            formTitle.textContent = 'Edit Tenant';
        }
        
        // Update form button
        const submitButton = document.querySelector('#add-tenant-form button[type="submit"]');
        if (submitButton) {
            submitButton.textContent = 'Update Tenant';
        }
        
        // Populate form fields
        document.getElementById('tenant-name').value = tenantName;
        document.getElementById('tenant-id').value = tenantId;
        document.getElementById('tenant-id').disabled = true; // Don't allow changing tenant ID
        
        // Set tenant group
        const groupSelect = document.getElementById('tenant-group');
        if (groupSelect) {
            for (let i = 0; i < groupSelect.options.length; i++) {
                if (groupSelect.options[i].value === tenantGroup) {
                    groupSelect.selectedIndex = i;
                    break;
                }
            }
        }
        
        // Set tenant status
        const statusSelect = document.getElementById('tenant-status');
        if (statusSelect) {
            for (let i = 0; i < statusSelect.options.length; i++) {
                if (statusSelect.options[i].value === tenantStatus) {
                    statusSelect.selectedIndex = i;
                    break;
                }
            }
        }
        
        // Set countries
        tenantCountries.forEach(country => {
            const checkbox = document.getElementById(`country-${country.toLowerCase()}`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
    }
    
    /**
     * Generate tenant ID from tenant name
     */
    function generateTenantId() {
        const name = tenantNameInput.value;
        
        // Convert to lowercase, replace spaces with hyphens, remove special characters
        const id = name.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
        
        tenantIdInput.value = id;
    }
    
    /**
     * Handle add tenant form submission
     * @param {Event} e - Form submit event
     */
    function handleAddTenant(e) {
        e.preventDefault();
        
        // Get form values
        const tenantName = document.getElementById('tenant-name').value;
        const tenantId = document.getElementById('tenant-id').value;
        const tenantGroup = document.getElementById('tenant-group').value;
        const tenantStatus = document.getElementById('tenant-status').value;
        
        // Get selected countries
        const countryCheckboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked');
        const countries = Array.from(countryCheckboxes).map(checkbox => checkbox.value);
        
        // Validate form
        if (!tenantName || !tenantId) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Check if this is an edit or a new tenant
        const isEdit = document.getElementById('tenant-id').disabled;
        
        if (isEdit) {
            // In a real application, this would update the tenant
            showNotification(`Tenant "${tenantName}" updated successfully`, 'success');
        } else {
            // In a real application, this would create a new tenant
            showNotification(`Tenant "${tenantName}" created successfully`, 'success');
            
            // For demo purposes, add a new row to the table
            addTenantToTable(tenantName, tenantId, tenantGroup, tenantStatus, countries.join(', '));
        }
        
        // Reset form
        resetTenantForm();
        
        // Switch to all tenants tab
        switchTab('all-tenants');
    }
    
    /**
     * Add a new tenant to the table
     */
    function addTenantToTable(name, id, group, status, countries) {
        const table = document.querySelector('.admin-content-table tbody');
        if (!table) return;
        
        // Format group name (capitalize first letter)
        const formattedGroup = group.charAt(0).toUpperCase() + group.slice(1);
        
        // Create new row
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td><input type="checkbox" class="tenant-select"></td>
            <td class="tenant-name">${name}</td>
            <td>${id}</td>
            <td>${formattedGroup}</td>
            <td><span class="status-badge ${status}">${status === 'active' ? 'Active' : 'Inactive'}</span></td>
            <td>${countries}</td>
            <td class="action-buttons">
                <button class="action-btn edit" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="action-btn view" title="View Content"><i class="fas fa-eye"></i></button>
                <button class="action-btn delete" title="Delete"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        // Add event listeners to new buttons
        const newButtons = newRow.querySelectorAll('.action-btn');
        newButtons.forEach(button => {
            button.addEventListener('click', handleActionButton);
        });
        
        // Add new row to table
        table.appendChild(newRow);
    }
    
    /**
     * Reset tenant form to default state
     */
    function resetTenantForm() {
        // Reset form fields
        addTenantForm.reset();
        
        // Enable tenant ID field
        document.getElementById('tenant-id').disabled = false;
        
        // Reset form title
        const formTitle = document.querySelector('#add-tenant .admin-form-container h3');
        if (formTitle) {
            formTitle.textContent = 'Add New Tenant';
        }
        
        // Reset form button
        const submitButton = document.querySelector('#add-tenant-form button[type="submit"]');
        if (submitButton) {
            submitButton.textContent = 'Create Tenant';
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
