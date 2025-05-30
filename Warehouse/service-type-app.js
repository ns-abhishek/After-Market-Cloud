// Service Type - Modern Google Material Design JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Materialize components
    initializeMaterialize();
    
    // Initialize event listeners
    initializeEventListeners();
    
    console.log('Service Type application initialized');
});

function initializeMaterialize() {
    // Initialize dropdowns
    var dropdowns = document.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(dropdowns, {
        alignment: 'left',
        constrainWidth: false,
        coverTrigger: false,
        closeOnClick: true,
        hover: false
    });
    
    // Initialize tooltips if any
    var tooltips = document.querySelectorAll('.tooltipped');
    M.Tooltip.init(tooltips);
    
    // Initialize modals if any
    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
}

function initializeEventListeners() {
    // New button click
    const newBtn = document.getElementById('newBtn');
    if (newBtn) {
        newBtn.addEventListener('click', function() {
            handleAction('new-service-type');
        });
    }
    
    // Pagination controls
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageSelect = document.getElementById('pageSelect');
    const rowsSelect = document.getElementById('rowsSelect');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            handlePagination('prev');
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            handlePagination('next');
        });
    }
    
    if (pageSelect) {
        pageSelect.addEventListener('change', function() {
            handlePagination('page', this.value);
        });
    }
    
    if (rowsSelect) {
        rowsSelect.addEventListener('change', function() {
            handlePagination('rows', this.value);
        });
    }
    
    // Table row interactions
    initializeTableInteractions();
    
    // Search functionality
    initializeSearch();
}

function initializeTableInteractions() {
    // View buttons
    const viewButtons = document.querySelectorAll('.view-cell .btn-floating');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const serviceTypeName = row.querySelector('.service-type-name-cell').textContent;
            handleAction('view-service-type', { serviceTypeName });
        });
    });
    
    // Checkbox interactions
    const checkboxes = document.querySelectorAll('.row-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateSelectionCount();
        });
    });
    
    // Row hover effects
    const tableRows = document.querySelectorAll('.table-row');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-1px)';
            this.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
}

function initializeSearch() {
    // Add search input if needed
    // This can be expanded based on requirements
}

function handleAction(action, data = {}) {
    console.log(`Action triggered: ${action}`, data);
    
    // Show toast notification
    const messages = {
        'new-service-type': 'Opening new service type form...',
        'delete-selected': 'Deleting selected service types...',
        'delete-all': 'Deleting all service types...',
        'delete-inactive': 'Deleting inactive service types...',
        'search-name': 'Searching by service type name...',
        'search-mandatory': 'Filtering mandatory service types...',
        'search-warranty': 'Filtering warranty service types...',
        'search-insurance': 'Filtering insurance service types...',
        'search-advanced': 'Opening advanced search...',
        'export-csv': 'Exporting data as CSV...',
        'export-excel': 'Exporting data as Excel...',
        'export-pdf': 'Exporting data as PDF...',
        'export-selected': 'Exporting selected items...',
        'refresh-all': 'Refreshing all data...',
        'refresh-active': 'Refreshing active items only...',
        'auto-refresh': 'Enabling auto refresh...',
        'column-settings': 'Opening column settings...',
        'view-settings': 'Opening view settings...',
        'filter-settings': 'Opening filter settings...',
        'reset-settings': 'Resetting to default settings...',
        'view-service-type': `Viewing service type: ${data.serviceTypeName || 'Unknown'}`
    };
    
    const message = messages[action] || `Action: ${action}`;
    showToast(message);
    
    // Handle specific actions
    switch (action) {
        case 'new-service-type':
            openNewServiceTypeForm();
            break;
        case 'view-service-type':
            openServiceTypeDetails(data);
            break;
        case 'delete-selected':
            deleteSelectedItems();
            break;
        case 'export-csv':
            exportData('csv');
            break;
        case 'export-excel':
            exportData('excel');
            break;
        case 'export-pdf':
            exportData('pdf');
            break;
        case 'refresh-all':
            refreshData();
            break;
        default:
            // Handle other actions as needed
            break;
    }
}

function handlePagination(type, value = null) {
    console.log(`Pagination: ${type}`, value);
    
    const pageSelect = document.getElementById('pageSelect');
    const currentPage = parseInt(pageSelect.value);
    
    switch (type) {
        case 'prev':
            if (currentPage > 1) {
                pageSelect.value = currentPage - 1;
                loadPage(currentPage - 1);
            }
            break;
        case 'next':
            // Assuming max 3 pages for this example
            if (currentPage < 3) {
                pageSelect.value = currentPage + 1;
                loadPage(currentPage + 1);
            }
            break;
        case 'page':
            loadPage(parseInt(value));
            break;
        case 'rows':
            changeRowsPerPage(parseInt(value));
            break;
    }
}

function loadPage(pageNumber) {
    console.log(`Loading page: ${pageNumber}`);
    showToast(`Loading page ${pageNumber}...`);
    
    // Simulate loading with a brief delay
    setTimeout(() => {
        showToast(`Page ${pageNumber} loaded successfully`);
    }, 500);
}

function changeRowsPerPage(rowCount) {
    console.log(`Changing rows per page to: ${rowCount}`);
    showToast(`Displaying ${rowCount} rows per page`);
}

function updateSelectionCount() {
    const selectedCheckboxes = document.querySelectorAll('.row-checkbox:checked');
    const count = selectedCheckboxes.length;
    
    if (count > 0) {
        showToast(`${count} item(s) selected`);
    }
}

function openNewServiceTypeForm() {
    // This would typically open a modal or navigate to a new page
    showToast('Opening new service type form in a separate window...');
    
    // Simulate opening in new window
    setTimeout(() => {
        alert('New Service Type form would open here.\n\nFields would include:\n- Service Type Name\n- Is Mandatory?\n- Is Warranty?\n- Is Insurance?\n- Service Due Reading\n- Service Due Days\n- Is Consider For Demand?\n- Is Active?');
    }, 500);
}

function openServiceTypeDetails(data) {
    showToast(`Opening details for: ${data.serviceTypeName}`);
    
    // Simulate opening details in new window
    setTimeout(() => {
        alert(`Service Type Details:\n\nName: ${data.serviceTypeName}\n\nThis would open in a separate window with full details and edit capabilities.`);
    }, 500);
}

function deleteSelectedItems() {
    const selectedCheckboxes = document.querySelectorAll('.row-checkbox:checked');
    const count = selectedCheckboxes.length;
    
    if (count === 0) {
        showToast('No items selected for deletion', 'error');
        return;
    }
    
    if (confirm(`Are you sure you want to delete ${count} selected item(s)?`)) {
        // Simulate deletion
        selectedCheckboxes.forEach(checkbox => {
            const row = checkbox.closest('tr');
            row.style.opacity = '0.5';
            row.style.textDecoration = 'line-through';
        });
        
        showToast(`${count} item(s) deleted successfully`, 'success');
        
        // Remove rows after animation
        setTimeout(() => {
            selectedCheckboxes.forEach(checkbox => {
                checkbox.closest('tr').remove();
            });
        }, 1000);
    }
}

function exportData(format) {
    const formatNames = {
        'csv': 'CSV',
        'excel': 'Excel',
        'pdf': 'PDF'
    };
    
    showToast(`Preparing ${formatNames[format]} export...`);
    
    // Simulate export process
    setTimeout(() => {
        showToast(`${formatNames[format]} file downloaded successfully`, 'success');
    }, 1500);
}

function refreshData() {
    showToast('Refreshing data...');
    
    // Add loading animation to table
    const tableBody = document.getElementById('serviceTypeTableBody');
    tableBody.style.opacity = '0.6';
    
    // Simulate data refresh
    setTimeout(() => {
        tableBody.style.opacity = '1';
        showToast('Data refreshed successfully', 'success');
    }, 1000);
}

function showToast(message, type = 'info') {
    // Use Materialize toast
    const colors = {
        'info': 'blue',
        'success': 'green',
        'error': 'red',
        'warning': 'orange'
    };
    
    M.toast({
        html: message,
        classes: `${colors[type]} darken-2`,
        displayLength: 3000
    });
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Export functions for global access
window.handleAction = handleAction;
window.handlePagination = handlePagination;
