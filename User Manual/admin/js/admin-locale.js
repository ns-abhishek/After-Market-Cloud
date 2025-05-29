/**
 * Admin Locale Management Module
 * Handles locale management, translations, and locale-specific content
 */
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const adminTabs = document.querySelectorAll('.admin-tab');
    const tabContents = document.querySelectorAll('.admin-tab-content');
    const selectAllCheckbox = document.getElementById('select-all-locales');
    const localeCheckboxes = document.querySelectorAll('.locale-select');
    const searchInput = document.querySelector('.admin-search-bar input');
    const actionButtons = document.querySelectorAll('.action-btn');
    const addLocaleForm = document.getElementById('add-locale-form');
    
    // Initialize locale management
    initLocaleManagement();
    
    /**
     * Initialize locale management components and event listeners
     */
    function initLocaleManagement() {
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
            searchInput.addEventListener('input', searchLocales);
        }
        
        // Set up action buttons
        if (actionButtons.length > 0) {
            actionButtons.forEach(button => {
                button.addEventListener('click', handleActionButton);
            });
        }
        
        // Set up add locale form
        if (addLocaleForm) {
            addLocaleForm.addEventListener('submit', handleAddLocale);
        }
        
        // Initialize translation status chart
        initTranslationStatusChart();
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
        
        localeCheckboxes.forEach(checkbox => {
            checkbox.checked = isChecked;
        });
    }
    
    /**
     * Search locales in the table
     */
    function searchLocales() {
        const searchTerm = searchInput.value.toLowerCase();
        const localeRows = document.querySelectorAll('.admin-content-table tbody tr');
        
        localeRows.forEach(row => {
            const name = row.querySelector('.locale-name').textContent.toLowerCase();
            const code = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
            const region = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
            
            if (name.includes(searchTerm) || code.includes(searchTerm) || region.includes(searchTerm)) {
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
        const localeName = row.querySelector('.locale-name')?.textContent;
        
        if (!localeName) return;
        
        switch (action) {
            case 'edit':
                // In a real application, this would open the edit form with locale data
                showNotification(`Editing locale "${localeName}"`, 'info');
                // For demo purposes, switch to add locale tab and populate form
                populateEditForm(row);
                switchTab('add-locale');
                break;
                
            case 'view':
                // In a real application, this would show locale-specific content
                showNotification(`Viewing content for locale "${localeName}"`, 'info');
                // For demo purposes, we'll just show a notification
                break;
                
            case 'delete':
                // In a real application, this would show a confirmation dialog
                if (confirm(`Are you sure you want to delete locale "${localeName}"?`)) {
                    // For demo purposes, we'll just remove the row
                    row.remove();
                    showNotification(`Deleted locale "${localeName}"`, 'success');
                }
                break;
        }
    }
    
    /**
     * Populate edit form with locale data
     * @param {HTMLElement} row - Table row with locale data
     */
    function populateEditForm(row) {
        const localeName = row.querySelector('.locale-name').textContent;
        const localeCode = row.querySelector('td:nth-child(3)').textContent;
        const localeRegion = row.querySelector('td:nth-child(4)').textContent.toLowerCase().replace(/\s+/g, '-');
        const localeStatus = row.querySelector('td:nth-child(5) .status-badge').classList.contains('active') ? 'active' : 'inactive';
        
        // Update form title
        const formTitle = document.querySelector('#add-locale .admin-form-container h3');
        if (formTitle) {
            formTitle.textContent = 'Edit Locale';
        }
        
        // Update form button
        const submitButton = document.querySelector('#add-locale-form button[type="submit"]');
        if (submitButton) {
            submitButton.textContent = 'Update Locale';
        }
        
        // Populate form fields
        document.getElementById('locale-name').value = localeName;
        document.getElementById('locale-code').value = localeCode;
        document.getElementById('locale-code').disabled = true; // Don't allow changing locale code
        
        // Set locale region
        const regionSelect = document.getElementById('locale-region');
        if (regionSelect) {
            for (let i = 0; i < regionSelect.options.length; i++) {
                if (regionSelect.options[i].value === localeRegion) {
                    regionSelect.selectedIndex = i;
                    break;
                }
            }
        }
        
        // Set locale status
        const statusSelect = document.getElementById('locale-status');
        if (statusSelect) {
            for (let i = 0; i < statusSelect.options.length; i++) {
                if (statusSelect.options[i].value === localeStatus) {
                    statusSelect.selectedIndex = i;
                    break;
                }
            }
        }
    }
    
    /**
     * Handle add locale form submission
     * @param {Event} e - Form submit event
     */
    function handleAddLocale(e) {
        e.preventDefault();
        
        // Get form values
        const localeName = document.getElementById('locale-name').value;
        const localeCode = document.getElementById('locale-code').value;
        const localeRegion = document.getElementById('locale-region').value;
        const localeStatus = document.getElementById('locale-status').value;
        
        // Validate form
        if (!localeName || !localeCode) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Validate locale code format (language-COUNTRY)
        const localeCodeRegex = /^[a-z]{2}-[A-Z]{2}$/;
        if (!localeCodeRegex.test(localeCode)) {
            showNotification('Locale code must be in format: language-COUNTRY (e.g., en-US)', 'error');
            return;
        }
        
        // Check if this is an edit or a new locale
        const isEdit = document.getElementById('locale-code').disabled;
        
        if (isEdit) {
            // In a real application, this would update the locale
            showNotification(`Locale "${localeName}" updated successfully`, 'success');
        } else {
            // In a real application, this would create a new locale
            showNotification(`Locale "${localeName}" created successfully`, 'success');
            
            // For demo purposes, add a new row to the table
            addLocaleToTable(localeName, localeCode, formatRegionName(localeRegion), localeStatus);
        }
        
        // Reset form
        resetLocaleForm();
        
        // Switch to all locales tab
        switchTab('all-locales');
    }
    
    /**
     * Format region name for display
     * @param {string} region - Region value from form
     * @returns {string} Formatted region name
     */
    function formatRegionName(region) {
        // Convert kebab-case to title case
        return region.split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
    
    /**
     * Add a new locale to the table
     */
    function addLocaleToTable(name, code, region, status) {
        const table = document.querySelector('.admin-content-table tbody');
        if (!table) return;
        
        // Create new row
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td><input type="checkbox" class="locale-select"></td>
            <td class="locale-name">${name}</td>
            <td>${code}</td>
            <td>${region}</td>
            <td><span class="status-badge ${status}">${status === 'active' ? 'Active' : 'Inactive'}</span></td>
            <td>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%;">0%</div>
                </div>
            </td>
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
     * Reset locale form to default state
     */
    function resetLocaleForm() {
        // Reset form fields
        addLocaleForm.reset();
        
        // Enable locale code field
        document.getElementById('locale-code').disabled = false;
        
        // Reset form title
        const formTitle = document.querySelector('#add-locale .admin-form-container h3');
        if (formTitle) {
            formTitle.textContent = 'Add New Locale';
        }
        
        // Reset form button
        const submitButton = document.querySelector('#add-locale-form button[type="submit"]');
        if (submitButton) {
            submitButton.textContent = 'Create Locale';
        }
    }
    
    /**
     * Initialize translation status chart
     */
    function initTranslationStatusChart() {
        const ctx = document.getElementById('translationStatusChart');
        if (!ctx) return;
        
        // Sample data for the chart
        const data = {
            labels: ['English (US)', 'German', 'French', 'Japanese', 'Spanish'],
            datasets: [
                {
                    label: 'Translated',
                    data: [100, 85, 78, 65, 42],
                    backgroundColor: '#4CAF50'
                },
                {
                    label: 'In Progress',
                    data: [0, 10, 15, 20, 30],
                    backgroundColor: '#FFC107'
                },
                {
                    label: 'Not Started',
                    data: [0, 5, 7, 15, 28],
                    backgroundColor: '#F44336'
                }
            ]
        };
        
        // Chart options
        const options = {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Percentage'
                    }
                },
                y: {
                    stacked: true
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw}%`;
                        }
                    }
                }
            }
        };
        
        // Create chart
        new Chart(ctx, {
            type: 'bar',
            data: data,
            options: options
        });
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
