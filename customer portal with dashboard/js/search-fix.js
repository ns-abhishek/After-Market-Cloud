/**
 * Search Fix Module
 * Fixes issues with the search functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Fix search button click event
    fixSearchButtonClick();

    // Fix export button click events
    fixExportButtonClick();
});

/**
 * Fix search button click event
 * This ensures the search button properly triggers the search functionality
 */
function fixSearchButtonClick() {
    console.log('Fixing search button click events');

    // Get all search buttons and inputs
    const searchButtons = document.querySelectorAll('#search-button, .search-container button');
    const searchInputs = document.querySelectorAll('#global-search, .search-container input');

    console.log('Found search buttons:', searchButtons.length);
    console.log('Found search inputs:', searchInputs.length);

    // Direct fix for the main search in header
    const globalSearchButton = document.getElementById('search-button');
    const globalSearchInput = document.getElementById('global-search');

    if (globalSearchButton && globalSearchInput) {
        console.log('Found global search elements, applying direct fix');

        // Remove existing event listeners by cloning
        const newButton = globalSearchButton.cloneNode(true);
        globalSearchButton.parentNode.replaceChild(newButton, globalSearchButton);

        const newInput = globalSearchInput.cloneNode(true);
        globalSearchInput.parentNode.replaceChild(newInput, globalSearchInput);

        // Add new event listeners
        newButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Global search button clicked');

            if (newInput.value.trim()) {
                console.log('Performing search for:', newInput.value.trim());
                performSearch(newInput.value.trim());
            } else {
                showSearchNotification('Please enter a search term', 'error');
            }
        });

        newInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                console.log('Enter key pressed in global search');

                if (this.value.trim()) {
                    console.log('Performing search for:', this.value.trim());
                    performSearch(this.value.trim());
                } else {
                    showSearchNotification('Please enter a search term', 'error');
                }
            }
        });
    }

    // Add click event to each search button
    searchButtons.forEach((button, index) => {
        if (button.id === 'search-button') return; // Skip the main search button (already handled)

        console.log('Setting up search button:', index);

        // Remove existing event listeners
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);

        // Add new event listener
        newButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Search button clicked:', index);

            const input = searchInputs[index] || document.querySelector('#global-search') || document.querySelector('.search-container input');
            if (input && input.value.trim()) {
                console.log('Performing search for:', input.value.trim());
                performSearch(input.value.trim());
            } else {
                showSearchNotification('Please enter a search term', 'error');
            }
        });
    });

    // Add keypress event to search inputs
    searchInputs.forEach((input, index) => {
        if (input.id === 'global-search') return; // Skip the main search input (already handled)

        console.log('Setting up search input:', index);

        // Remove existing event listeners
        const newInput = input.cloneNode(true);
        input.parentNode.replaceChild(newInput, input);

        // Add new event listener
        newInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                console.log('Enter key pressed in search input:', index);

                if (this.value.trim()) {
                    console.log('Performing search for:', this.value.trim());
                    performSearch(this.value.trim());
                } else {
                    showSearchNotification('Please enter a search term', 'error');
                }
            }
        });
    });
}

/**
 * Fix export button click events
 * This ensures the export buttons properly trigger the export functionality
 */
function fixExportButtonClick() {
    // Fix main export dropdown
    const exportDropdownBtn = document.getElementById('export-dropdown-btn');
    if (exportDropdownBtn) {
        const exportDropdownMenu = document.getElementById('export-dropdown-menu');

        // Ensure dropdown shows on click
        exportDropdownBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            exportDropdownMenu.style.display = exportDropdownMenu.style.display === 'block' ? 'none' : 'block';
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (exportDropdownMenu && !exportDropdownBtn.contains(e.target) && !exportDropdownMenu.contains(e.target)) {
                exportDropdownMenu.style.display = 'none';
            }
        });
    }

    // Fix export buttons
    const exportButtons = {
        pdf: document.getElementById('export-pdf'),
        excel: document.getElementById('export-excel'),
        csv: document.getElementById('export-csv')
    };

    // Add click events to export buttons
    for (const [format, button] of Object.entries(exportButtons)) {
        if (button) {
            button.addEventListener('click', function() {
                if (typeof exportAnalytics === 'function') {
                    exportAnalytics(format);
                } else {
                    showExportNotification(`Export as ${format.toUpperCase()} is not available`, 'error');
                }
            });
        }
    }

    // Fix activity export buttons
    const activityExportButtons = {
        pdf: document.getElementById('export-activity-pdf'),
        excel: document.getElementById('export-activity-excel'),
        csv: document.getElementById('export-activity-csv')
    };

    // Add click events to activity export buttons
    for (const [format, button] of Object.entries(activityExportButtons)) {
        if (button) {
            button.addEventListener('click', function() {
                if (typeof exportActivityData === 'function') {
                    exportActivityData(format);
                } else {
                    showExportNotification(`Export as ${format.toUpperCase()} is not available`, 'error');
                }
            });
        }
    }
}

/**
 * Show search notification
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, info)
 */
function showSearchNotification(message, type = 'info') {
    if (typeof showNotification === 'function') {
        showNotification(message, type);
    } else {
        alert(message);
    }
}

/**
 * Show export notification
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, info)
 */
function showExportNotification(message, type = 'info') {
    if (typeof showNotification === 'function') {
        showNotification(message, type);
    } else {
        alert(message);
    }
}

/**
 * Show notification
 * This is a fallback implementation if the main showNotification function is not available
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, info)
 */
function showNotification(message, type = 'info') {
    // Create notification container if it doesn't exist
    let container = document.querySelector('.notification-container');

    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);

        // Add styles if they don't exist
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification-container {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 9999;
                }

                .notification {
                    background-color: white;
                    border-radius: 4px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    padding: 15px 20px;
                    margin-bottom: 10px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    min-width: 300px;
                    max-width: 400px;
                    animation: slideIn 0.3s ease-out forwards;
                }

                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }

                .notification.success {
                    border-left: 4px solid #52c41a;
                }

                .notification.error {
                    border-left: 4px solid #f5222d;
                }

                .notification.info {
                    border-left: 4px solid #1890ff;
                }

                .notification-icon {
                    font-size: 20px;
                }

                .notification.success .notification-icon {
                    color: #52c41a;
                }

                .notification.error .notification-icon {
                    color: #f5222d;
                }

                .notification.info .notification-icon {
                    color: #1890ff;
                }

                .notification-content {
                    flex: 1;
                }

                .notification-close {
                    background: none;
                    border: none;
                    color: #999;
                    cursor: pointer;
                    font-size: 16px;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    // Set icon based on type
    let icon;
    switch (type) {
        case 'success':
            icon = 'fa-check-circle';
            break;
        case 'error':
            icon = 'fa-exclamation-circle';
            break;
        default:
            icon = 'fa-info-circle';
    }

    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas ${icon}"></i>
        </div>
        <div class="notification-content">
            ${message}
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Add to container
    container.appendChild(notification);

    // Add close button event
    notification.querySelector('.notification-close').addEventListener('click', function() {
        container.removeChild(notification);
    });

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode === container) {
            container.removeChild(notification);
        }
    }, 5000);
}
