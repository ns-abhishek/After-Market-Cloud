// Navigation and Search Functions

// Search functionality
function performSearch() {
    const searchTerm = document.getElementById('searchTerm').value;
    const searchField = document.getElementById('searchField').value;

    if (!searchTerm.trim()) {
        showToast('Please enter a search term', 'warning');
        return;
    }

    showLoadingState();

    // Simulate search API call
    setTimeout(() => {
        const results = performSearchOperation(searchTerm, searchField);
        displaySearchResults(results);
        hideLoadingState();

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('searchModal'));
        modal.hide();

        showToast(`Found ${results.length} results for "${searchTerm}"`, 'success');
    }, 1000);
}

function performSearchOperation(searchTerm, searchField) {
    // In a real application, this would make an API call
    // For demo purposes, we'll simulate search results
    const mockResults = [
        {
            id: 'INV001',
            type: 'customer',
            customerName: 'John Doe',
            amount: 1250.00,
            date: '2024-01-15',
            status: 'completed'
        },
        {
            id: 'INV002',
            type: 'internal',
            customerName: 'Jane Smith',
            amount: 850.00,
            date: '2024-01-14',
            status: 'pending'
        },
        {
            id: 'SRV001',
            type: 'service-return',
            customerName: 'Bob Johnson',
            amount: 320.00,
            date: '2024-01-13',
            status: 'active'
        }
    ];

    // Filter results based on search term and field
    return mockResults.filter(item => {
        if (searchField === 'all') {
            return Object.values(item).some(value =>
                value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            );
        } else {
            const fieldValue = item[searchField];
            return fieldValue && fieldValue.toString().toLowerCase().includes(searchTerm.toLowerCase());
        }
    });
}

function displaySearchResults(results) {
    // Create search results modal or update current page
    const resultsHtml = generateSearchResultsHtml(results);

    // If we're on a table page, update the table
    const tableContainer = document.querySelector('.data-table');
    if (tableContainer) {
        updateTableWithResults(results);
    } else {
        // Show results in a new modal
        showSearchResultsModal(resultsHtml);
    }
}

function generateSearchResultsHtml(results) {
    if (results.length === 0) {
        return '<p class="text-center text-muted">No results found</p>';
    }

    return `
        <div class="search-results">
            <h5 class="mb-3">Search Results (${results.length})</h5>
            <div class="table-responsive">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Type</th>
                            <th>Customer</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${results.map(item => `
                            <tr>
                                <td>${item.id}</td>
                                <td><span class="badge bg-secondary">${item.type}</span></td>
                                <td>${item.customerName}</td>
                                <td>$${item.amount.toFixed(2)}</td>
                                <td>${formatDate(item.date)}</td>
                                <td><span class="badge bg-${getStatusColor(item.status)}">${item.status}</span></td>
                                <td>
                                    <button class="btn btn-sm btn-outline-primary" onclick="viewRecord('${item.id}')">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function showSearchResultsModal(resultsHtml) {
    const modalHtml = `
        <div class="modal fade" id="searchResultsModal" tabindex="-1">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Search Results</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        ${resultsHtml}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" onclick="exportSearchResults()">Export Results</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('modal-container').innerHTML = modalHtml;
    const modal = new bootstrap.Modal(document.getElementById('searchResultsModal'));
    modal.show();
}

// Filter functionality
function applyFilters() {
    const filters = {
        dateFrom: document.getElementById('dateFrom').value,
        dateTo: document.getElementById('dateTo').value,
        amountFrom: document.getElementById('amountFrom').value,
        amountTo: document.getElementById('amountTo').value,
        status: document.getElementById('statusFilter').value
    };

    showLoadingState();

    // Simulate filter API call
    setTimeout(() => {
        const filteredResults = applyFilterOperation(filters);
        displayFilteredResults(filteredResults);
        hideLoadingState();

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('filterModal'));
        modal.hide();

        showToast('Filters applied successfully', 'success');
    }, 800);
}

function applyFilterOperation(filters) {
    // In a real application, this would make an API call
    // For demo purposes, we'll simulate filtered results
    const mockData = generateMockData();

    return mockData.filter(item => {
        // Date filter
        if (filters.dateFrom && new Date(item.date) < new Date(filters.dateFrom)) {
            return false;
        }
        if (filters.dateTo && new Date(item.date) > new Date(filters.dateTo)) {
            return false;
        }

        // Amount filter
        if (filters.amountFrom && item.amount < parseFloat(filters.amountFrom)) {
            return false;
        }
        if (filters.amountTo && item.amount > parseFloat(filters.amountTo)) {
            return false;
        }

        // Status filter
        if (filters.status && item.status !== filters.status) {
            return false;
        }

        return true;
    });
}

function clearFilters() {
    document.getElementById('dateFrom').value = '';
    document.getElementById('dateTo').value = '';
    document.getElementById('amountFrom').value = '';
    document.getElementById('amountTo').value = '';
    document.getElementById('statusFilter').value = '';

    // Reload original data
    loadTableData();

    showToast('Filters cleared', 'info');
}

function displayFilteredResults(results) {
    // Update current table with filtered results
    const tableContainer = document.querySelector('.data-table');
    if (tableContainer) {
        updateTableWithResults(results);
    }
}

// Table management
function updateTableWithResults(results) {
    const tableBody = document.querySelector('.data-table tbody');
    if (!tableBody) return;

    if (results.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="100%" class="text-center text-muted py-4">
                    <i class="fas fa-search fa-2x mb-2"></i>
                    <p>No results found</p>
                </td>
            </tr>
        `;
        return;
    }

    // Generate table rows based on current page type
    const currentPage = getCurrentPageType();
    tableBody.innerHTML = results.map(item => generateTableRow(item, currentPage)).join('');
}

function getCurrentPageType() {
    const path = window.location.pathname;
    if (path.includes('customer-invoice')) return 'customer';
    if (path.includes('service-invoice-return')) return 'service-return';
    if (path.includes('internal-invoice-return')) return 'internal-return';
    if (path.includes('internal-invoice')) return 'internal';
    return 'customer';
}

function generateTableRow(item, pageType) {
    const baseActions = `
        <button class="btn btn-sm btn-outline-primary me-1" onclick="viewRecord('${item.id}')" title="View">
            <i class="fas fa-eye"></i>
        </button>
        <button class="btn btn-sm btn-outline-secondary me-1" onclick="editRecord('${item.id}')" title="Edit">
            <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteRecord('${item.id}')" title="Delete">
            <i class="fas fa-trash"></i>
        </button>
    `;

    switch (pageType) {
        case 'customer':
            return `
                <tr>
                    <td>${baseActions}</td>
                    <td>${item.id}</td>
                    <td>${item.customerName}</td>
                    <td>${item.paymentMode || 'N/A'}</td>
                    <td>${formatDate(item.date)}</td>
                    <td>${item.workOrder || 'N/A'}</td>
                    <td>${item.workOrderDate ? formatDate(item.workOrderDate) : 'N/A'}</td>
                    <td>${item.serial || 'N/A'}</td>
                    <td>${item.model || 'N/A'}</td>
                    <td>$${(item.amount * 0.9).toFixed(2)}</td>
                    <td>$${(item.amount * 0.1).toFixed(2)}</td>
                    <td>$${item.amount.toFixed(2)}</td>
                    <td><span class="badge bg-${getStatusColor(item.status)}">${item.status}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline-info" onclick="sendMail('${item.id}')">
                            <i class="fas fa-envelope"></i>
                        </button>
                    </td>
                </tr>
            `;

        case 'service-return':
            return `
                <tr>
                    <td>${baseActions}</td>
                    <td>${item.id}</td>
                    <td>${item.customerInvoice || item.id}</td>
                    <td>${formatDate(item.returnDate)}</td>
                    <td>${item.isFullReturn ? 'Yes' : 'No'}</td>
                    <td>${item.serial || 'N/A'}</td>
                    <td>${item.model || 'N/A'}</td>
                    <td>${item.customerName}</td>
                    <td>${item.generatedThrough || 'Manual'}</td>
                    <td>$${item.creditAmount.toFixed(2)}</td>
                </tr>
            `;

        case 'internal':
            return `
                <tr>
                    <td>${baseActions}</td>
                    <td>${item.id}</td>
                    <td>${item.customerAccount || item.customerName}</td>
                    <td>${item.customerName}</td>
                    <td>${formatDate(item.date)}</td>
                    <td>${item.workOrder || 'N/A'}</td>
                    <td>${item.workOrderDate ? formatDate(item.workOrderDate) : 'N/A'}</td>
                    <td>${item.serial || 'N/A'}</td>
                    <td>${item.model || 'N/A'}</td>
                    <td><span class="badge bg-${getStatusColor(item.status)}">${item.status}</span></td>
                    <td>$${item.amount.toFixed(2)}</td>
                    <td>${item.branch || 'Main'}</td>
                </tr>
            `;

        case 'internal-return':
            return `
                <tr>
                    <td>${baseActions}</td>
                    <td>${item.id}</td>
                    <td>${formatDate(item.date)}</td>
                    <td>${item.internalInvoice || item.id}</td>
                    <td>${item.isFullReturn ? 'Yes' : 'No'}</td>
                    <td>${item.customerName}</td>
                    <td>${item.serial || 'N/A'}</td>
                    <td>${item.model || 'N/A'}</td>
                </tr>
            `;

        default:
            return `<tr><td colspan="100%">Unknown page type</td></tr>`;
    }
}

// Record actions
function viewRecord(id) {
    showLoadingState();

    // Simulate loading record details
    setTimeout(() => {
        const record = findRecordById(id);
        if (record) {
            showRecordDetailsModal(record);
        } else {
            showToast('Record not found', 'error');
        }
        hideLoadingState();
    }, 500);
}

function editRecord(id) {
    showLoadingState();

    // Simulate loading record for editing
    setTimeout(() => {
        const record = findRecordById(id);
        if (record) {
            showEditRecordModal(record);
        } else {
            showToast('Record not found', 'error');
        }
        hideLoadingState();
    }, 500);
}

function deleteRecord(id) {
    if (confirm('Are you sure you want to delete this record?')) {
        showLoadingState();

        // Simulate delete operation
        setTimeout(() => {
            // Remove from localStorage
            removeRecordFromStorage(id);

            // Reload table data
            loadTableData();

            hideLoadingState();
            showToast('Record deleted successfully', 'success');
        }, 800);
    }
}

function sendMail(id) {
    showLoadingState();

    // Simulate sending email
    setTimeout(() => {
        hideLoadingState();
        showToast('Email sent successfully', 'success');
    }, 1500);
}

// Utility functions
function findRecordById(id) {
    // Search in all storage types
    const types = ['customer', 'service-return', 'internal', 'internal-return'];

    for (const type of types) {
        const records = loadFromLocalStorage(type);
        const record = records.find(r => r.id === id);
        if (record) {
            return { ...record, type };
        }
    }

    return null;
}

function removeRecordFromStorage(id) {
    const types = ['customer', 'service-return', 'internal', 'internal-return'];

    for (const type of types) {
        const records = loadFromLocalStorage(type);
        const filteredRecords = records.filter(r => r.id !== id);

        if (filteredRecords.length !== records.length) {
            localStorage.setItem(`invoices_${type}`, JSON.stringify(filteredRecords));
            break;
        }
    }
}

function getStatusColor(status) {
    const colors = {
        'active': 'primary',
        'pending': 'warning',
        'completed': 'success',
        'cancelled': 'danger'
    };
    return colors[status] || 'secondary';
}

function generateMockData() {
    // Generate mock data for demonstration
    const mockData = [];
    const customers = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson'];
    const statuses = ['active', 'pending', 'completed', 'cancelled'];
    const paymentModes = ['cash', 'card', 'bank', 'check'];

    for (let i = 1; i <= 20; i++) {
        mockData.push({
            id: `INV${String(i).padStart(3, '0')}`,
            customerName: customers[Math.floor(Math.random() * customers.length)],
            amount: Math.floor(Math.random() * 2000) + 100,
            date: new Date(2024, 0, Math.floor(Math.random() * 30) + 1).toISOString().split('T')[0],
            status: statuses[Math.floor(Math.random() * statuses.length)],
            paymentMode: paymentModes[Math.floor(Math.random() * paymentModes.length)],
            workOrder: `WO${String(i).padStart(3, '0')}`,
            serial: `SN${String(i).padStart(6, '0')}`,
            model: `Model-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${i}`
        });
    }

    return mockData;
}

function exportSearchResults() {
    showLoadingState();

    // Simulate export operation
    setTimeout(() => {
        hideLoadingState();
        showToast('Search results exported successfully', 'success');
    }, 1000);
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set up any navigation-specific event listeners
    setupNavigationEventListeners();
});

function setupNavigationEventListeners() {
    // Add any navigation-specific event listeners here
    console.log('Navigation event listeners set up');
}
