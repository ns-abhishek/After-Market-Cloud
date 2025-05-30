// Main JavaScript for Invoice Management System

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Load saved preferences
    loadThemePreference();
    loadLanguagePreference();

    // Initialize tooltips and popovers
    initializeBootstrapComponents();

    // Set up event listeners
    setupEventListeners();

    // Load initial data
    loadDashboardStats();

    console.log('Invoice Management System initialized successfully');
}

function initializeBootstrapComponents() {
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize Bootstrap popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
}

function setupEventListeners() {
    // Add keyboard navigation for service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });

    // Add loading states to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (!button.classList.contains('no-loading')) {
                addLoadingState(button);
            }
        });
    });
}

// Navigation Functions
function navigateToPage(pageType) {
    showLoadingOverlay();

    const pages = {
        'customer-invoice': 'pages/customer-invoice.html',
        'service-invoice-return': 'pages/service-invoice-return.html',
        'internal-invoice': 'pages/internal-invoice.html',
        'internal-invoice-return': 'pages/internal-invoice-return.html'
    };

    const targetPage = pages[pageType];
    if (targetPage) {
        // Simulate loading time for better UX
        setTimeout(() => {
            window.location.href = targetPage;
        }, 500);
    } else {
        hideLoadingOverlay();
        showToast('Page not found', 'error');
    }
}

// Modal Functions
function openAddModal(type) {
    const modalHtml = generateAddModal(type);
    document.getElementById('modal-container').innerHTML = modalHtml;

    const modal = new bootstrap.Modal(document.getElementById('addModal'));
    modal.show();
}

function generateAddModal(type) {
    const titles = {
        'customer': 'Add Customer Invoice',
        'service-return': 'Add Service Invoice Return',
        'internal': 'Add Internal Invoice',
        'internal-return': 'Add Internal Invoice Return'
    };

    return `
        <div class="modal fade" id="addModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${titles[type] || 'Add New Record'}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="addForm">
                            ${generateFormFields(type)}
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="saveRecord('${type}')">Save</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateFormFields(type) {
    const commonFields = `
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Date</label>
                    <input type="date" class="form-control" name="date" required>
                </div>
            </div>
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Amount</label>
                    <input type="number" class="form-control" name="amount" step="0.01" required>
                </div>
            </div>
        </div>
    `;

    const typeSpecificFields = {
        'customer': `
            <div class="mb-3">
                <label class="form-label">Customer Name</label>
                <input type="text" class="form-control" name="customerName" required>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label class="form-label">Payment Mode</label>
                        <select class="form-select" name="paymentMode" required>
                            <option value="">Select Payment Mode</option>
                            <option value="cash">Cash</option>
                            <option value="card">Card</option>
                            <option value="bank">Bank Transfer</option>
                            <option value="check">Check</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label class="form-label">Work Order</label>
                        <input type="text" class="form-control" name="workOrder">
                    </div>
                </div>
            </div>
        `,
        'service-return': `
            <div class="mb-3">
                <label class="form-label">Customer Invoice</label>
                <input type="text" class="form-control" name="customerInvoice" required>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label class="form-label">Serial Number</label>
                        <input type="text" class="form-control" name="serial" required>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label class="form-label">Model</label>
                        <input type="text" class="form-control" name="model" required>
                    </div>
                </div>
            </div>
            <div class="mb-3">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" name="isFullReturn" id="isFullReturn">
                    <label class="form-check-label" for="isFullReturn">
                        Full Return
                    </label>
                </div>
            </div>
        `,
        'internal': `
            <div class="mb-3">
                <label class="form-label">Customer Account</label>
                <input type="text" class="form-control" name="customerAccount" required>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label class="form-label">Work Order</label>
                        <input type="text" class="form-control" name="workOrder">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label class="form-label">Branch</label>
                        <select class="form-select" name="branch">
                            <option value="">Select Branch</option>
                            <option value="satisfaction">Satisfaction</option>
                            <option value="rework">Rework</option>
                            <option value="main">Main</option>
                        </select>
                    </div>
                </div>
            </div>
        `,
        'internal-return': `
            <div class="mb-3">
                <label class="form-label">Internal Invoice</label>
                <input type="text" class="form-control" name="internalInvoice" required>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label class="form-label">Serial Number</label>
                        <input type="text" class="form-control" name="serial" required>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label class="form-label">Model</label>
                        <input type="text" class="form-control" name="model" required>
                    </div>
                </div>
            </div>
            <div class="mb-3">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" name="isFullReturn" id="isFullReturnInternal">
                    <label class="form-check-label" for="isFullReturnInternal">
                        Full Return
                    </label>
                </div>
            </div>
        `
    };

    return (typeSpecificFields[type] || '') + commonFields;
}

function saveRecord(type) {
    const form = document.getElementById('addForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Add timestamp and ID
    data.id = generateId();
    data.createdAt = new Date().toISOString();
    data.type = type;

    // Simulate API call
    showLoadingState();

    setTimeout(() => {
        // Save to localStorage for demo purposes
        saveToLocalStorage(type, data);

        hideLoadingState();
        showToast('Record saved successfully!', 'success');

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addModal'));
        modal.hide();

        // Refresh data if on relevant page
        if (window.location.pathname.includes(type)) {
            loadTableData();
        }
    }, 1000);
}

// Export Functions
function exportData(format) {
    showLoadingState();

    setTimeout(() => {
        if (format === 'pdf') {
            exportToPDF();
        } else if (format === 'excel') {
            exportToExcel();
        }

        hideLoadingState();
        showToast(`Data exported as ${format.toUpperCase()}`, 'success');
    }, 1500);
}

function exportToPDF() {
    // Simulate PDF export
    console.log('Exporting to PDF...');
    // In a real application, you would use a library like jsPDF
}

function exportToExcel() {
    // Simulate Excel export
    console.log('Exporting to Excel...');
    // In a real application, you would use a library like SheetJS
}

// Search and Filter Functions
function openAdvancedSearch() {
    const searchModal = generateSearchModal();
    document.getElementById('modal-container').innerHTML = searchModal;

    const modal = new bootstrap.Modal(document.getElementById('searchModal'));
    modal.show();
}

function openAdvancedFilter() {
    const filterModal = generateFilterModal();
    document.getElementById('modal-container').innerHTML = filterModal;

    const modal = new bootstrap.Modal(document.getElementById('filterModal'));
    modal.show();
}

function generateSearchModal() {
    return `
        <div class="modal fade" id="searchModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Advanced Search</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Search Term</label>
                            <input type="text" class="form-control" id="searchTerm" placeholder="Enter search term...">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Search In</label>
                            <select class="form-select" id="searchField">
                                <option value="all">All Fields</option>
                                <option value="invoice">Invoice Number</option>
                                <option value="customer">Customer Name</option>
                                <option value="amount">Amount</option>
                                <option value="date">Date</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="performSearch()">Search</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateFilterModal() {
    return `
        <div class="modal fade" id="filterModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Advanced Filter</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label">Date From</label>
                                    <input type="date" class="form-control" id="dateFrom">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label">Date To</label>
                                    <input type="date" class="form-control" id="dateTo">
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label">Amount From</label>
                                    <input type="number" class="form-control" id="amountFrom" step="0.01">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label">Amount To</label>
                                    <input type="number" class="form-control" id="amountTo" step="0.01">
                                </div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Status</label>
                            <select class="form-select" id="statusFilter">
                                <option value="">All Statuses</option>
                                <option value="active">Active</option>
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="clearFilters()">Clear</button>
                        <button type="button" class="btn btn-primary" onclick="applyFilters()">Apply Filters</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Utility Functions
function generateId() {
    return 'inv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function saveToLocalStorage(type, data) {
    const key = `invoices_${type}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push(data);
    localStorage.setItem(key, JSON.stringify(existing));
}

function loadFromLocalStorage(type) {
    const key = `invoices_${type}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
}

function showLoadingOverlay() {
    // Remove existing overlay if present
    hideLoadingOverlay();

    const overlay = document.createElement('div');
    overlay.id = 'loadingOverlay';
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner-border text-light" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3">Loading...</p>
        </div>
    `;
    document.body.appendChild(overlay);
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.remove();
    }
}

// Format date utility function
function formatDate(dateString) {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';

    const currentLang = getCurrentLanguage ? getCurrentLanguage() : 'en';
    const locale = getLocaleFromLanguage ? getLocaleFromLanguage(currentLang) : 'en-US';

    return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Get locale from language code
function getLocaleFromLanguage(langCode) {
    const locales = {
        en: 'en-US',
        es: 'es-ES',
        fr: 'fr-FR'
    };
    return locales[langCode] || 'en-US';
}

// Show record details modal
function showRecordDetailsModal(record) {
    const modalHtml = `
        <div class="modal fade" id="recordDetailsModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Record Details - ${record.id}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            ${Object.entries(record).map(([key, value]) => `
                                <div class="col-md-6 mb-3">
                                    <label class="form-label fw-bold">${formatFieldName(key)}</label>
                                    <div class="form-control-plaintext">${formatFieldValue(key, value)}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" onclick="editRecord('${record.id}')">Edit</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('modal-container').innerHTML = modalHtml;
    const modal = new bootstrap.Modal(document.getElementById('recordDetailsModal'));
    modal.show();
}

// Show edit record modal
function showEditRecordModal(record) {
    const modalHtml = generateEditModal(record);
    document.getElementById('modal-container').innerHTML = modalHtml;

    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
}

// Generate edit modal HTML
function generateEditModal(record) {
    return `
        <div class="modal fade" id="editModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Record - ${record.id}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="editForm">
                            ${generateEditFormFields(record)}
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="saveEditedRecord('${record.id}')">Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Generate edit form fields
function generateEditFormFields(record) {
    const excludeFields = ['id', 'createdAt', 'type'];

    return Object.entries(record)
        .filter(([key]) => !excludeFields.includes(key))
        .map(([key, value]) => {
            const fieldName = formatFieldName(key);
            const fieldType = getFieldType(key, value);

            return `
                <div class="mb-3">
                    <label class="form-label">${fieldName}</label>
                    ${generateFormInput(key, value, fieldType)}
                </div>
            `;
        }).join('');
}

// Generate form input based on field type
function generateFormInput(key, value, type) {
    switch (type) {
        case 'date':
            return `<input type="date" class="form-control" name="${key}" value="${value || ''}">`;
        case 'number':
            return `<input type="number" class="form-control" name="${key}" value="${value || ''}" step="0.01">`;
        case 'select':
            return generateSelectInput(key, value);
        case 'checkbox':
            return `
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" name="${key}" ${value ? 'checked' : ''}>
                    <label class="form-check-label">${formatFieldName(key)}</label>
                </div>
            `;
        default:
            return `<input type="text" class="form-control" name="${key}" value="${value || ''}">`;
    }
}

// Generate select input for specific fields
function generateSelectInput(key, value) {
    const options = getSelectOptions(key);

    return `
        <select class="form-select" name="${key}">
            <option value="">Select ${formatFieldName(key)}</option>
            ${options.map(option => `
                <option value="${option.value}" ${value === option.value ? 'selected' : ''}>
                    ${option.label}
                </option>
            `).join('')}
        </select>
    `;
}

// Get select options for specific fields
function getSelectOptions(key) {
    const optionsMap = {
        paymentMode: [
            { value: 'cash', label: 'Cash' },
            { value: 'card', label: 'Card' },
            { value: 'bank', label: 'Bank Transfer' },
            { value: 'check', label: 'Check' }
        ],
        sapStatus: [
            { value: 'active', label: 'Active' },
            { value: 'pending', label: 'Pending' },
            { value: 'completed', label: 'Completed' },
            { value: 'cancelled', label: 'Cancelled' }
        ],
        branch: [
            { value: 'satisfaction', label: 'Satisfaction' },
            { value: 'rework', label: 'Rework' },
            { value: 'main', label: 'Main' }
        ],
        generatedThrough: [
            { value: 'manual', label: 'Manual' },
            { value: 'automatic', label: 'Automatic' },
            { value: 'system', label: 'System' }
        ]
    };

    return optionsMap[key] || [];
}

// Get field type for form generation
function getFieldType(key, value) {
    if (key.toLowerCase().includes('date')) return 'date';
    if (key.toLowerCase().includes('amount') || key.toLowerCase().includes('credit')) return 'number';
    if (key.toLowerCase().includes('isfullreturn')) return 'checkbox';
    if (['paymentMode', 'sapStatus', 'branch', 'generatedThrough'].includes(key)) return 'select';
    return 'text';
}

// Format field name for display
function formatFieldName(key) {
    return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .replace(/Id$/, 'ID')
        .replace(/Sap/, 'SAP')
        .replace(/Inr/, 'INR');
}

// Format field value for display
function formatFieldValue(key, value) {
    if (value === null || value === undefined) return 'N/A';

    if (key.toLowerCase().includes('date')) {
        return formatDate(value);
    }

    if (key.toLowerCase().includes('amount') || key.toLowerCase().includes('credit')) {
        return typeof value === 'number' ? `$${value.toFixed(2)}` : value;
    }

    if (key.toLowerCase().includes('isfullreturn')) {
        return value ? 'Yes' : 'No';
    }

    return value.toString();
}

// Save edited record
function saveEditedRecord(recordId) {
    const form = document.getElementById('editForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Add ID and timestamp
    data.id = recordId;
    data.updatedAt = new Date().toISOString();

    showLoadingState();

    setTimeout(() => {
        // Update record in localStorage
        updateRecordInStorage(recordId, data);

        hideLoadingState();
        showToast('Record updated successfully!', 'success');

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
        modal.hide();

        // Reload table data if on relevant page
        if (typeof loadTableData === 'function') {
            loadTableData();
        }
    }, 1000);
}

// Update record in localStorage
function updateRecordInStorage(recordId, updatedData) {
    const types = ['customer', 'service-return', 'internal', 'internal-return'];

    for (const type of types) {
        const records = loadFromLocalStorage(type);
        const recordIndex = records.findIndex(r => r.id === recordId);

        if (recordIndex !== -1) {
            records[recordIndex] = { ...records[recordIndex], ...updatedData };
            localStorage.setItem(`invoices_${type}`, JSON.stringify(records));
            break;
        }
    }
}

function showLoadingState() {
    document.body.classList.add('loading');
}

function hideLoadingState() {
    document.body.classList.remove('loading');
}

function addLoadingState(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Loading...';
    button.disabled = true;

    setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
    }, 2000);
}

function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    const toastId = 'toast_' + Date.now();

    const toastHtml = `
        <div class="toast" id="${toastId}" role="alert">
            <div class="toast-header">
                <i class="fas fa-${getToastIcon(type)} me-2 text-${type}"></i>
                <strong class="me-auto">Notification</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;

    toastContainer.insertAdjacentHTML('beforeend', toastHtml);

    const toast = new bootstrap.Toast(document.getElementById(toastId));
    toast.show();

    // Auto remove after hiding
    document.getElementById(toastId).addEventListener('hidden.bs.toast', function() {
        this.remove();
    });
}

function getToastIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function loadDashboardStats() {
    // Simulate loading dashboard statistics
    // In a real application, this would fetch from an API
    console.log('Loading dashboard statistics...');
}

// Loading overlay utilities
function showLoadingOverlay(message = 'Loading...') {
    let overlay = document.getElementById('loadingOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'loadingOverlay';
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-content">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <div class="loading-text mt-2">${message}</div>
            </div>
        `;
        document.body.appendChild(overlay);
    } else {
        overlay.querySelector('.loading-text').textContent = message;
        overlay.style.display = 'flex';
    }
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

// Performance optimization utilities
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Optimized data loading
function loadTableData(tableType, callback) {
    showLoadingOverlay(`Loading ${tableType} data...`);

    // Simulate API call with immediate response (no artificial delay)
    const data = generateTableData(tableType);

    // Use requestAnimationFrame for smooth UI updates
    requestAnimationFrame(() => {
        if (callback) callback(data);
        hideLoadingOverlay();
    });
}

function generateTableData(type) {
    const generators = {
        'customer': generateCustomerInvoiceData,
        'service-return': generateServiceReturnData,
        'internal': generateInternalInvoiceData,
        'internal-return': generateInternalReturnData
    };

    const generator = generators[type];
    return generator ? generator() : [];
}

// Service Return Data Generation
function generateServiceReturnData() {
    const data = [];
    const customers = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson', 'Diana Prince'];
    const generatedThrough = ['manual', 'automatic', 'system'];

    for (let i = 1; i <= 40; i++) {
        const creditAmount = Math.floor(Math.random() * 2000) + 200;

        data.push({
            id: `SRV${String(i).padStart(4, '0')}`,
            customerInvoice: `CI${String(Math.floor(Math.random() * 100) + 1).padStart(4, '0')}`,
            returnDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
            isFullReturn: Math.random() > 0.6,
            serial: `SN${String(i + 10000).padStart(8, '0')}`,
            model: `Model-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${i}`,
            customerName: customers[Math.floor(Math.random() * customers.length)],
            generatedThrough: generatedThrough[Math.floor(Math.random() * generatedThrough.length)],
            creditAmount: creditAmount
        });
    }

    return data;
}

// Batch processing for large datasets
function processBatch(items, batchSize, processor, callback) {
    let index = 0;

    function processBatchChunk() {
        const batch = items.slice(index, index + batchSize);
        if (batch.length === 0) {
            if (callback) callback();
            return;
        }

        processor(batch);
        index += batchSize;

        // Use setTimeout to prevent blocking the UI
        setTimeout(processBatchChunk, 0);
    }

    processBatchChunk();
}

// Memory management
function cleanupEventListeners(element) {
    if (element && element.parentNode) {
        const clone = element.cloneNode(true);
        element.parentNode.replaceChild(clone, element);
        return clone;
    }
    return element;
}

// Error boundary for operations
function safeExecute(operation, errorMessage = 'Operation failed') {
    try {
        return operation();
    } catch (error) {
        console.error(errorMessage, error);
        showToast(errorMessage, 'error');
        return null;
    }
}

// Action card functions for dashboard
function openAddModal(type) {
    const modal = createAddModal(type);
    document.body.appendChild(modal);
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();

    // Clean up modal when closed
    modal.addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(modal);
    });
}

function createAddModal(type) {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'addModal';
    modal.tabIndex = -1;

    const typeNames = {
        'customer': 'Customer Invoice',
        'service-return': 'Service Return',
        'internal': 'Internal Invoice',
        'internal-return': 'Internal Return'
    };

    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Add New ${typeNames[type] || type}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="addForm">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Invoice ID</label>
                                <input type="text" class="form-control" name="invoiceId" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Customer Name</label>
                                <input type="text" class="form-control" name="customerName" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Date</label>
                                <input type="date" class="form-control" name="date" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Amount</label>
                                <input type="number" class="form-control" name="amount" step="0.01" required>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" onclick="saveNewRecord('${type}')">Save</button>
                </div>
            </div>
        </div>
    `;

    return modal;
}

function saveNewRecord(type) {
    const form = document.getElementById('addForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Simulate saving
    showToast(`New ${type} record saved successfully!`, 'success');
    bootstrap.Modal.getInstance(document.getElementById('addModal')).hide();

    // Refresh current page data if on a table page
    if (typeof loadTableData === 'function') {
        loadTableData();
    }
}

function exportAllData(format) {
    showLoadingOverlay();

    // Simulate export process
    setTimeout(() => {
        if (format === 'pdf') {
            exportToPDF(getAllTableData(), 'All_Invoice_Data');
        } else if (format === 'excel') {
            exportToExcel(getAllTableData(), 'All_Invoice_Data');
        }
        hideLoadingOverlay();
        showToast(`All data exported as ${format.toUpperCase()}`, 'success');
    }, 1500);
}

function getAllTableData() {
    // Collect data from all tables
    return {
        headers: ['Type', 'ID', 'Customer', 'Date', 'Amount', 'Status'],
        rows: [
            ['Customer Invoice', 'CI0001', 'John Doe', '2024-01-15', '$1,250.00', 'Active'],
            ['Service Return', 'SR0001', 'Jane Smith', '2024-01-16', '$850.00', 'Pending'],
            ['Internal Invoice', 'II0001', 'Internal Dept A', '2024-01-17', '$2,100.00', 'Completed']
        ]
    };
}

function openAdvancedSearch() {
    const modal = createSearchModal();
    document.body.appendChild(modal);
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();

    modal.addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(modal);
    });
}

function createSearchModal() {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'searchModal';
    modal.tabIndex = -1;

    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Advanced Search</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="searchForm">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Search Term</label>
                                <input type="text" class="form-control" name="searchTerm" placeholder="Enter search term...">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Date Range</label>
                                <div class="row g-2">
                                    <div class="col">
                                        <input type="date" class="form-control" name="dateFrom">
                                    </div>
                                    <div class="col">
                                        <input type="date" class="form-control" name="dateTo">
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Amount Range</label>
                                <div class="row g-2">
                                    <div class="col">
                                        <input type="number" class="form-control" name="amountFrom" placeholder="Min">
                                    </div>
                                    <div class="col">
                                        <input type="number" class="form-control" name="amountTo" placeholder="Max">
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Status</label>
                                <select class="form-select" name="status">
                                    <option value="">All Statuses</option>
                                    <option value="active">Active</option>
                                    <option value="pending">Pending</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" onclick="performAdvancedSearch()">Search</button>
                </div>
            </div>
        </div>
    `;

    return modal;
}

function performAdvancedSearch() {
    const form = document.getElementById('searchForm');
    const formData = new FormData(form);
    const searchParams = Object.fromEntries(formData);

    showToast('Advanced search performed', 'success');
    bootstrap.Modal.getInstance(document.getElementById('searchModal')).hide();

    // Apply search to current page if applicable
    if (typeof applyAdvancedSearch === 'function') {
        applyAdvancedSearch(searchParams);
    }
}

function openAdvancedFilter() {
    const modal = createFilterModal();
    document.body.appendChild(modal);
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();

    modal.addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(modal);
    });
}

function createFilterModal() {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'filterModal';
    modal.tabIndex = -1;

    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Advanced Filter</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="filterForm">
                        <div class="mb-3">
                            <label class="form-label">Filter by Type</label>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" name="types" value="customer" id="typeCustomer">
                                <label class="form-check-label" for="typeCustomer">Customer Invoices</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" name="types" value="internal" id="typeInternal">
                                <label class="form-check-label" for="typeInternal">Internal Invoices</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" name="types" value="return" id="typeReturn">
                                <label class="form-check-label" for="typeReturn">Returns</label>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Sort by</label>
                            <select class="form-select" name="sortBy">
                                <option value="date">Date</option>
                                <option value="amount">Amount</option>
                                <option value="customer">Customer</option>
                                <option value="status">Status</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Sort Order</label>
                            <select class="form-select" name="sortOrder">
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" onclick="applyAdvancedFilter()">Apply Filter</button>
                </div>
            </div>
        </div>
    `;

    return modal;
}

function applyAdvancedFilter() {
    const form = document.getElementById('filterForm');
    const formData = new FormData(form);
    const filterParams = Object.fromEntries(formData);

    showToast('Advanced filter applied', 'success');
    bootstrap.Modal.getInstance(document.getElementById('filterModal')).hide();

    // Apply filter to current page if applicable
    if (typeof applyAdvancedFilter === 'function') {
        applyAdvancedFilter(filterParams);
    }
}

function openReports() {
    window.location.href = 'pages/dashboard.html';
}

// Alias functions for dashboard compatibility
function openGlobalSearch() {
    openAdvancedSearch();
}

function openGlobalFilter() {
    openAdvancedFilter();
}


