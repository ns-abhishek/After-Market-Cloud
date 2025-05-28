// ===== SLA HEADER FUNCTIONALITY =====

document.addEventListener('DOMContentLoaded', function() {
    // Get the SLA name input element
    const slaNameInput = document.getElementById('sla-name');

    // Add event listeners for enhanced user experience
    if (slaNameInput) {
        // Save SLA name to localStorage as user types
        slaNameInput.addEventListener('input', function(e) {
            const slaName = e.target.value.trim();

            // Save to localStorage for persistence
            if (slaName) {
                localStorage.setItem('sla-name', slaName);
            } else {
                localStorage.removeItem('sla-name');
            }

            // Update document title to include SLA name
            updateDocumentTitle(slaName);
        });

        // Load saved SLA name on page load
        const savedSlaName = localStorage.getItem('sla-name');
        if (savedSlaName) {
            slaNameInput.value = savedSlaName;
            updateDocumentTitle(savedSlaName);
        }

        // Add focus/blur effects for better UX
        slaNameInput.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        slaNameInput.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });

        // Add validation feedback
        slaNameInput.addEventListener('blur', function() {
            validateSlaName(this.value.trim());
        });
    }

    // Add event listeners for action buttons
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            handleAction(action);
        });
    });

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            openSearchModal();
        }
        if (e.ctrlKey && e.key === 'e') {
            e.preventDefault();
            openExportModal();
        }
        if (e.key === 'F5') {
            e.preventDefault();
            refreshInterface();
        }
        if (e.key === 'Escape') {
            closeSearchModal();
            closeExportModal();
        }
    });

    // Click outside modal to close
    document.addEventListener('click', function(e) {
        const searchModal = document.getElementById('searchModal');
        const exportModal = document.getElementById('exportModal');

        if (e.target === searchModal) {
            closeSearchModal();
        }
        if (e.target === exportModal) {
            closeExportModal();
        }
    });

    // Initialize table functionality
    initializeTableFunctionality();

    // Initialize sidebar menu functionality
    initializeSidebarMenu();

    // Initialize the application
    console.log('SLA Header application initialized');
});

// ===== ACTION HANDLERS =====

function handleAction(action) {
    switch(action) {
        case 'add':
            console.log('Add action triggered');
            // Add your add functionality here
            break;
        case 'delete':
            console.log('Delete action triggered');
            // Add your delete functionality here
            break;
        case 'save':
            console.log('Save action triggered');
            // Add your save functionality here
            break;
        case 'search':
            console.log('Search action triggered');
            openSearchModal();
            break;
        case 'export':
            console.log('Export action triggered');
            openExportModal();
            break;
        case 'refresh':
            console.log('Refresh action triggered');
            refreshInterface();
            break;
        default:
            console.log('Unknown action:', action);
    }
}

// ===== ADVANCED SEARCH MODAL =====

let searchFilters = [];

function openSearchModal() {
    const modal = document.getElementById('searchModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Focus on first input
    const firstInput = modal.querySelector('.filter-select');
    if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
    }
}

function closeSearchModal() {
    const modal = document.getElementById('searchModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';

    // Clear form
    clearSearchForm();
}

function clearSearchForm() {
    document.getElementById('searchColumn').value = 'complexity';
    document.getElementById('searchOperator').value = 'equals';
    document.getElementById('searchValue').value = '';
    document.getElementById('searchCondition').value = '';
    document.getElementById('searchResults').value = '';
    searchFilters = [];
}

function addFilter() {
    const column = document.getElementById('searchColumn').value;
    const operator = document.getElementById('searchOperator').value;
    const value = document.getElementById('searchValue').value;
    const condition = document.getElementById('searchCondition').value;

    if (!value.trim()) {
        alert('Please enter a value for the filter.');
        return;
    }

    const filter = {
        column: column,
        operator: operator,
        value: value.trim(),
        condition: condition
    };

    searchFilters.push(filter);
    updateSearchResults();

    // Clear current inputs for next filter
    document.getElementById('searchValue').value = '';
    document.getElementById('searchCondition').value = '';
}

function removeFilter() {
    if (searchFilters.length > 0) {
        searchFilters.pop();
        updateSearchResults();
    }
}

function updateSearchResults() {
    const textarea = document.getElementById('searchResults');
    let filterText = '';

    searchFilters.forEach((filter, index) => {
        if (index > 0 && filter.condition) {
            filterText += ` ${filter.condition.toUpperCase()} `;
        }

        const operatorText = getOperatorText(filter.operator);
        filterText += `${filter.column} ${operatorText} "${filter.value}"`;

        if (index < searchFilters.length - 1 && !searchFilters[index + 1].condition) {
            filterText += ' AND ';
        }
    });

    textarea.value = filterText;
}

function getOperatorText(operator) {
    const operators = {
        'equals': '=',
        'not_equals': '!=',
        'contains': 'CONTAINS',
        'greater_than': '>',
        'less_than': '<'
    };
    return operators[operator] || operator;
}

function executeSearch() {
    if (searchFilters.length === 0) {
        alert('Please add at least one filter before searching.');
        return;
    }

    console.log('Executing search with filters:', searchFilters);

    // Here you would implement the actual search logic
    // For now, we'll just show a success message
    alert(`Search executed with ${searchFilters.length} filter(s):\n${document.getElementById('searchResults').value}`);

    closeSearchModal();
}

// ===== DOCUMENT EXPORT MODAL =====

function openExportModal() {
    const modal = document.getElementById('exportModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Focus on the select dropdown
    const selectElement = modal.querySelector('.export-select');
    if (selectElement) {
        setTimeout(() => selectElement.focus(), 100);
    }
}

function closeExportModal() {
    const modal = document.getElementById('exportModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';

    // Reset form
    document.getElementById('exportFormat').value = 'excel';
}

function executeExport() {
    const format = document.getElementById('exportFormat').value;

    console.log(`Executing export in ${format.toUpperCase()} format`);

    // Here you would implement the actual export logic
    // For now, we'll simulate the export process

    // Show loading state
    const exportBtn = document.querySelector('.export-btn');
    const originalText = exportBtn.textContent;
    exportBtn.textContent = 'Exporting...';
    exportBtn.disabled = true;

    // Simulate export process
    setTimeout(() => {
        // Reset button
        exportBtn.textContent = originalText;
        exportBtn.disabled = false;

        // Show success message
        alert(`SLA data has been exported successfully as ${format.toUpperCase()} format!`);

        // Close modal
        closeExportModal();

        // Show feedback
        showActionFeedback(`Data exported successfully as ${format.toUpperCase()}`, 'success');
    }, 1500);
}

// ===== REFRESH FUNCTIONALITY =====

function refreshInterface() {
    // Show loading state
    showActionFeedback('Refreshing interface...', 'info');

    // Add visual loading effect
    const refreshBtn = document.querySelector('[data-action="refresh"]');
    const originalIcon = refreshBtn.querySelector('svg');

    if (originalIcon) {
        originalIcon.style.animation = 'spin 1s linear infinite';
    }

    // Simulate refresh process
    setTimeout(() => {
        // Reset form elements
        resetFormElements();

        // Refresh table data
        refreshTableData();

        // Reset any filters or search
        resetFiltersAndSearch();

        // Update UI state
        updateUIState();

        // Stop loading animation
        if (originalIcon) {
            originalIcon.style.animation = '';
        }

        // Show success message
        showActionFeedback('Interface refreshed successfully!', 'success');

        console.log('Interface refresh completed');
    }, 1500);
}

function resetFormElements() {
    // Reset all form inputs to default values
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (input.type === 'checkbox') {
            input.checked = input.hasAttribute('checked');
        } else if (input.type === 'radio') {
            input.checked = input.hasAttribute('checked');
        } else if (input.tagName === 'SELECT') {
            input.selectedIndex = 0;
        } else {
            input.value = input.defaultValue || '';
        }
    });

    // Reset SLA name specifically
    const slaNameInput = document.getElementById('sla-name');
    if (slaNameInput) {
        slaNameInput.value = '';
        updateDocumentTitle('');
    }
}

function refreshTableData() {
    // Reset table to default state
    const complexitySelect = document.querySelector('.complexity-select');
    const prioritySelect = document.querySelector('.priority-select');
    const hoursInput = document.querySelector('.hours-input');
    const activeCheckbox = document.querySelector('.active-checkbox');

    if (complexitySelect) complexitySelect.selectedIndex = 0;
    if (prioritySelect) prioritySelect.selectedIndex = 0;
    if (hoursInput) hoursInput.value = '24';
    if (activeCheckbox) activeCheckbox.checked = true;

    // Reset table pagination
    const pageSelector = document.querySelector('.page-selector');
    const itemsPerPage = document.querySelector('.items-per-page');

    if (pageSelector) pageSelector.selectedIndex = 0;
    if (itemsPerPage) itemsPerPage.selectedIndex = 0;

    // Update view info
    const viewInfo = document.querySelector('.view-info');
    if (viewInfo) {
        viewInfo.textContent = 'View 1 - 1 of 1';
    }
}

function resetFiltersAndSearch() {
    // Clear any search filters
    searchFilters = [];

    // Reset search modal if it exists
    const searchResults = document.getElementById('searchResults');
    if (searchResults) {
        searchResults.value = '';
    }

    // Reset search form fields
    const searchColumn = document.getElementById('searchColumn');
    const searchOperator = document.getElementById('searchOperator');
    const searchValue = document.getElementById('searchValue');
    const searchCondition = document.getElementById('searchCondition');

    if (searchColumn) searchColumn.selectedIndex = 0;
    if (searchOperator) searchOperator.selectedIndex = 0;
    if (searchValue) searchValue.value = '';
    if (searchCondition) searchCondition.selectedIndex = 0;

    // Reset export modal
    const exportFormat = document.getElementById('exportFormat');
    if (exportFormat) {
        exportFormat.value = 'excel';
    }
}

function updateUIState() {
    // Hide data table if visible and show welcome section
    const tableSection = document.getElementById('dataTableSection');
    const welcomeSection = document.getElementById('welcomeSection');

    if (tableSection && tableSection.style.display !== 'none') {
        hideDataTable();
    }

    // Clear any localStorage data
    localStorage.removeItem('sla-name');
    localStorage.removeItem('sla-data');
    localStorage.removeItem('search-filters');

    // Reset any active states
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(btn => {
        btn.classList.remove('active');
    });

    // Close any open modals
    closeSearchModal();
    closeExportModal();
}

// ===== SLA MANAGEMENT FUNCTIONS =====

function deleteSLA() {
    const slaNameInput = document.getElementById('sla-name');
    const slaName = slaNameInput ? slaNameInput.value.trim() : '';

    if (!slaName) {
        alert('No SLA name to delete. Please enter an SLA name first.');
        return;
    }

    // Confirmation dialog
    const confirmDelete = confirm(`Are you sure you want to delete the SLA "${slaName}"?\n\nThis action cannot be undone.`);

    if (confirmDelete) {
        // Clear the SLA name
        slaNameInput.value = '';

        // Remove from localStorage
        localStorage.removeItem('sla-name');

        // Update document title
        updateDocumentTitle('');

        // Hide data table if visible
        hideDataTable();

        // Show success feedback
        showActionFeedback(`SLA "${slaName}" has been deleted successfully.`, 'success');

        console.log(`SLA "${slaName}" deleted successfully`);
    }
}

// ===== TABLE FUNCTIONALITY =====

function initializeTableFunctionality() {
    // Initialize select all functionality
    const selectAllCheckbox = document.getElementById('select-all');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', handleSelectAll);
    }

    // Initialize individual row checkboxes
    const rowCheckboxes = document.querySelectorAll('.table-checkbox:not(#select-all)');
    rowCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleRowSelection);
    });
}

function handleSelectAll(event) {
    const selectAllCheckbox = event.target;
    const isChecked = selectAllCheckbox.checked;

    // Get all row checkboxes (excluding the select-all checkbox)
    const rowCheckboxes = document.querySelectorAll('.table-checkbox:not(#select-all)');

    // Set all row checkboxes to match the select-all state
    rowCheckboxes.forEach(checkbox => {
        checkbox.checked = isChecked;

        // Add visual feedback to the row
        const row = checkbox.closest('.table-row');
        if (row) {
            if (isChecked) {
                row.classList.add('selected');
            } else {
                row.classList.remove('selected');
            }
        }
    });

    // Show feedback message
    const selectedCount = isChecked ? rowCheckboxes.length : 0;
    if (isChecked) {
        showActionFeedback(`Selected all ${selectedCount} row(s)`, 'success');
    } else {
        showActionFeedback('Deselected all rows', 'info');
    }

    console.log(`Select all: ${isChecked ? 'checked' : 'unchecked'}, affected ${rowCheckboxes.length} rows`);
}

function handleRowSelection(event) {
    const checkbox = event.target;
    const row = checkbox.closest('.table-row');

    // Add/remove visual feedback for the row
    if (row) {
        if (checkbox.checked) {
            row.classList.add('selected');
        } else {
            row.classList.remove('selected');
        }
    }

    // Update select-all checkbox state
    updateSelectAllState();
}

function updateSelectAllState() {
    const selectAllCheckbox = document.getElementById('select-all');
    const rowCheckboxes = document.querySelectorAll('.table-checkbox:not(#select-all)');

    if (!selectAllCheckbox || rowCheckboxes.length === 0) return;

    const checkedCount = Array.from(rowCheckboxes).filter(cb => cb.checked).length;

    if (checkedCount === 0) {
        // No rows selected
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
    } else if (checkedCount === rowCheckboxes.length) {
        // All rows selected
        selectAllCheckbox.checked = true;
        selectAllCheckbox.indeterminate = false;
    } else {
        // Some rows selected (indeterminate state)
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = true;
    }
}

function getSelectedRows() {
    const selectedCheckboxes = document.querySelectorAll('.table-checkbox:not(#select-all):checked');
    return Array.from(selectedCheckboxes).map(checkbox => checkbox.closest('.table-row'));
}

function clearAllSelections() {
    const allCheckboxes = document.querySelectorAll('.table-checkbox');
    allCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
        checkbox.indeterminate = false;

        const row = checkbox.closest('.table-row');
        if (row) {
            row.classList.remove('selected');
        }
    });

    showActionFeedback('All selections cleared', 'info');
}

// ===== SIDEBAR MENU FUNCTIONALITY =====

function initializeSidebarMenu() {
    // Initialize collapsible menu buttons
    const menuButtons = document.querySelectorAll('.menu-button');
    menuButtons.forEach(button => {
        button.addEventListener('click', handleMenuToggle);
    });

    // Initialize menu links
    const menuLinks = document.querySelectorAll('.menu-link');
    menuLinks.forEach(link => {
        link.addEventListener('click', handleMenuLinkClick);
    });

    // Initialize submenu buttons
    const submenuButtons = document.querySelectorAll('.submenu-button');
    submenuButtons.forEach(button => {
        button.addEventListener('click', handleSubmenuToggle);
    });

    console.log('Sidebar menu initialized');
}

function handleMenuToggle(event) {
    const button = event.currentTarget;
    const menuType = button.getAttribute('data-menu');

    // Toggle expanded state
    button.classList.toggle('expanded');

    // Get the arrow icon
    const arrow = button.querySelector('.menu-arrow');
    if (arrow) {
        if (button.classList.contains('expanded')) {
            arrow.style.transform = 'rotate(180deg)';
        } else {
            arrow.style.transform = 'rotate(0deg)';
        }
    }

    // Handle submenu expansion for CORE menu
    if (menuType === 'core') {
        const submenu = document.getElementById('core-submenu');
        if (submenu) {
            const isExpanded = button.classList.contains('expanded');
            if (isExpanded) {
                submenu.style.display = 'block';
                submenu.classList.add('expanded');
            } else {
                submenu.classList.remove('expanded');
                setTimeout(() => {
                    if (!submenu.classList.contains('expanded')) {
                        submenu.style.display = 'none';
                    }
                }, 300); // Match CSS transition duration
            }
        }
    }

    // Show feedback
    const menuText = button.querySelector('.menu-text').textContent;
    const isExpanded = button.classList.contains('expanded');

    if (isExpanded) {
        showActionFeedback(`${menuText} menu expanded`, 'info');
        console.log(`${menuText} menu expanded`);
    } else {
        showActionFeedback(`${menuText} menu collapsed`, 'info');
        console.log(`${menuText} menu collapsed`);
    }
}

function handleMenuLinkClick(event) {
    const link = event.currentTarget;
    const menuText = link.textContent.trim();

    // Remove active state from all menu items
    document.querySelectorAll('.menu-link, .menu-button').forEach(item => {
        item.classList.remove('active');
    });

    // Add active state to clicked item
    link.classList.add('active');

    // Show feedback
    showActionFeedback(`Navigating to ${menuText}`, 'success');
    console.log(`Menu link clicked: ${menuText}`);

    // Prevent default link behavior for demo
    event.preventDefault();
}

function handleSubmenuToggle(event) {
    const button = event.currentTarget;
    const submenuType = button.getAttribute('data-submenu');

    // Toggle expanded state
    button.classList.toggle('expanded');

    // Get the arrow icon
    const arrow = button.querySelector('.submenu-arrow');
    if (arrow) {
        if (button.classList.contains('expanded')) {
            arrow.style.transform = 'rotate(180deg)';
        } else {
            arrow.style.transform = 'rotate(0deg)';
        }
    }

    // Handle sub-submenu expansion for Master menu
    if (submenuType === 'master') {
        const subSubmenu = document.getElementById('master-submenu');
        if (subSubmenu) {
            const isExpanded = button.classList.contains('expanded');
            if (isExpanded) {
                subSubmenu.style.display = 'block';
                subSubmenu.classList.add('expanded');
            } else {
                subSubmenu.classList.remove('expanded');
                setTimeout(() => {
                    if (!subSubmenu.classList.contains('expanded')) {
                        subSubmenu.style.display = 'none';
                    }
                }, 300); // Match CSS transition duration
            }
        }
    }

    // Remove active state from other submenu items (only if not expanding)
    if (!button.classList.contains('expanded')) {
        document.querySelectorAll('.submenu-button').forEach(btn => {
            if (btn !== button) {
                btn.classList.remove('active');
            }
        });

        // Add active state to clicked item
        button.classList.add('active');
    }

    // Show feedback
    const submenuText = button.querySelector('.submenu-text').textContent;
    const isExpanded = button.classList.contains('expanded');

    if (isExpanded) {
        showActionFeedback(`${submenuText} section expanded`, 'info');
        console.log(`${submenuText} submenu expanded`);
    } else {
        showActionFeedback(`Navigating to ${submenuText}`, 'success');
        console.log(`${submenuText} submenu clicked`);
    }

    // Prevent event bubbling
    event.stopPropagation();
}

function toggleSidebar() {
    const sidebar = document.querySelector('.main-sidebar');
    sidebar.classList.toggle('open');

    const isOpen = sidebar.classList.contains('open');
    showActionFeedback(isOpen ? 'Menu opened' : 'Menu closed', 'info');
}

function closeSidebar() {
    const sidebar = document.querySelector('.main-sidebar');
    sidebar.classList.remove('open');
    showActionFeedback('Menu closed', 'info');
}

// ===== NAVIGATION FUNCTIONS =====

function navigateToSLA() {
    // Show the SLA management interface
    showSLAInterface();

    // Update active states
    updateNavigationState('sla');

    // Show feedback
    showActionFeedback('Navigating to Service Level Agreement', 'success');
    console.log('Navigated to SLA page');
}

function showSLAInterface() {
    // Hide welcome section if visible
    const welcomeSection = document.getElementById('welcomeSection');
    if (welcomeSection) {
        welcomeSection.style.display = 'none';
    }

    // Show data table section
    const dataTableSection = document.getElementById('dataTableSection');
    if (dataTableSection) {
        dataTableSection.style.display = 'block';
    }

    // Update page title context
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) {
        pageTitle.textContent = 'Service Level Agreement';
    }

    console.log('SLA interface displayed');
}

function hideDataTable() {
    // Hide data table section
    const dataTableSection = document.getElementById('dataTableSection');
    if (dataTableSection) {
        dataTableSection.style.display = 'none';
    }

    // Show welcome section
    const welcomeSection = document.getElementById('welcomeSection');
    if (welcomeSection) {
        welcomeSection.style.display = 'block';
    }

    console.log('Data table hidden, welcome section shown');
}

function updateNavigationState(activePage) {
    // Remove active state from all navigation items
    document.querySelectorAll('.menu-button, .menu-link, .submenu-button, .sub-submenu-button').forEach(item => {
        item.classList.remove('active');
    });

    // Add active state to current page
    if (activePage === 'sla') {
        const slaButton = document.querySelector('[data-page="sla"]');
        if (slaButton) {
            slaButton.classList.add('active');
        }

        // Also mark parent menus as active
        const masterButton = document.querySelector('[data-submenu="master"]');
        if (masterButton) {
            masterButton.classList.add('active');
        }

        const coreButton = document.querySelector('[data-menu="core"]');
        if (coreButton) {
            coreButton.classList.add('active');
        }
    }
}

// ===== HELPER FUNCTIONS =====

/**
 * Updates the document title to include the SLA name
 * @param {string} slaName - The current SLA name
 */
function updateDocumentTitle(slaName) {
    const baseTitle = 'Service Level Agreement';
    if (slaName && slaName.length > 0) {
        document.title = `${slaName} - ${baseTitle}`;
    } else {
        document.title = baseTitle;
    }
}

/**
 * Validates the SLA name input
 * @param {string} slaName - The SLA name to validate
 * @returns {boolean} - Whether the name is valid
 */
function validateSlaName(slaName) {
    const input = document.getElementById('sla-name');

    // Remove any existing validation classes
    input.classList.remove('valid', 'invalid');

    // Basic validation rules
    if (slaName.length === 0) {
        // Empty is okay, no validation needed
        return true;
    }

    if (slaName.length < 2) {
        input.classList.add('invalid');
        showValidationMessage('SLA name must be at least 2 characters long', 'error');
        return false;
    }

    if (slaName.length > 100) {
        input.classList.add('invalid');
        showValidationMessage('SLA name must be less than 100 characters', 'error');
        return false;
    }

    // Valid name
    input.classList.add('valid');
    return true;
}

/**
 * Shows a validation message to the user
 * @param {string} message - The message to show
 * @param {string} type - The type of message ('error', 'success', 'info')
 */
function showValidationMessage(message, type = 'info') {
    // Remove any existing validation message
    const existingMessage = document.querySelector('.validation-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create new validation message
    const messageElement = document.createElement('div');
    messageElement.className = `validation-message ${type}`;
    messageElement.textContent = message;

    // Insert after the input
    const slaNameSection = document.querySelector('.sla-name-section');
    if (slaNameSection) {
        slaNameSection.appendChild(messageElement);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 3000);
    }
}

/**
 * Gets the current SLA name
 * @returns {string} - The current SLA name
 */
function getCurrentSlaName() {
    const input = document.getElementById('sla-name');
    return input ? input.value.trim() : '';
}

/**
 * Sets the SLA name programmatically
 * @param {string} name - The name to set
 */
function setSlaName(name) {
    const input = document.getElementById('sla-name');
    if (input) {
        input.value = name;
        input.dispatchEvent(new Event('input', { bubbles: true }));
    }
}

// ===== EXPORT FUNCTIONS FOR OTHER MODULES =====
window.SLAHeader = {
    getCurrentSlaName,
    setSlaName,
    validateSlaName
};
