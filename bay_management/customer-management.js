// Customer Management JavaScript

let filteredCustomers = [...customersData];
let currentCustomerSortField = '';
let currentCustomerSortDirection = 'asc';

// Initialize customer management page
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('customer-management.html')) {
        initializeCustomerManagement();
    }
});

function initializeCustomerManagement() {
    initializeCustomerFilter();
    loadCustomers();
    updateCustomerStatistics();
    loadTopCustomers();

    // Add form submission handler
    const customerForm = document.getElementById('customerForm');
    if (customerForm) {
        customerForm.addEventListener('submit', handleCustomerFormSubmission);
    }
}

// Initialize universal filter for customers
function initializeCustomerFilter() {
    window.customerFilter = new UniversalFilter({
        data: customersData,
        searchInputId: 'customerSearchInput',
        statusFilterId: 'customerStatusFilter',
        additionalFilters: ['customerOrdersFilter'],
        searchFields: ['name', 'phone', 'email', 'address'],
        statusField: 'status',
        columnFilters: [
            {
                field: 'name',
                inputId: 'nameSearch'
            },
            {
                field: 'phone',
                inputId: 'contactSearch'
            },
            {
                field: 'address',
                inputId: 'addressSearch'
            },
            {
                field: 'totalOrders',
                inputId: 'ordersSearch'
            },
            {
                field: 'status',
                inputId: 'statusSearchInput',
                dropdownId: 'statusSearch',
                options: ['Active', 'VIP', 'New', 'Inactive'],
                syncInputs: true
            }
        ],
        additionalFilterConfigs: {
            'customerOrdersFilter': {
                field: 'totalOrders',
                customMatcher: (itemValue, filterValue) => {
                    switch (filterValue) {
                        case 'high': return itemValue >= 20;
                        case 'medium': return itemValue >= 10 && itemValue < 20;
                        case 'low': return itemValue < 10;
                        default: return true;
                    }
                }
            }
        },
        updateDisplayCallback: (data) => {
            filteredCustomers = customerFilter.getFilteredData();
            displayCustomers(data);
        },
        paginationCallback: (paginationInfo) => {
            updateCustomerPagination(paginationInfo);
        },
        onFilterChange: (data) => {
            updateCustomerStatistics();
            loadTopCustomers();
        }
    });
}

// Display customers using paginated data
function displayCustomers(customers) {
    const tableBody = document.getElementById('customerTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    customers.forEach(customer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="customer-info">
                    <strong>${customer.name}</strong>
                    <br>
                    <small>ID: ${customer.id}</small>
                </div>
            </td>
            <td>
                <div class="contact-info">
                    <div><i class="fas fa-phone"></i> ${customer.phone}</div>
                    <div><i class="fas fa-envelope"></i> ${customer.email}</div>
                </div>
            </td>
            <td>
                <div class="address-info">
                    ${customer.address}
                </div>
            </td>
            <td>
                <div class="orders-info">
                    <strong>${customer.totalOrders}</strong>
                    <br>
                    <small>orders</small>
                </div>
            </td>
            <td>
                <span class="status-badge status-${customer.status.toLowerCase()}">
                    ${customer.status}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon" onclick="viewCustomerDetails(${customer.id})" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" onclick="editCustomer(${customer.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" onclick="viewCustomerOrders(${customer.id})" title="View Orders">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                    <button class="btn-icon danger" onclick="deleteCustomer(${customer.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// Update customer pagination info
function updateCustomerPagination(paginationInfo) {
    // Update pagination display if elements exist
    const currentPageElement = document.getElementById('currentCustomerPage');
    const totalPagesElement = document.getElementById('totalCustomerPages');
    const totalRecordsElement = document.getElementById('totalCustomerRecords');

    if (currentPageElement) currentPageElement.textContent = paginationInfo.currentPage;
    if (totalPagesElement) totalPagesElement.textContent = paginationInfo.totalPages;
    if (totalRecordsElement) totalRecordsElement.textContent = paginationInfo.totalRecords;
}

// Load and display customers
function loadCustomers() {
    const tableBody = document.getElementById('customerTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    filteredCustomers.forEach(customer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="customer-info">
                    <strong>${customer.name}</strong>
                    <br>
                    <small>ID: ${customer.id}</small>
                </div>
            </td>
            <td>
                <div class="contact-info">
                    <div><i class="fas fa-phone"></i> ${customer.phone}</div>
                    <div><i class="fas fa-envelope"></i> ${customer.email}</div>
                </div>
            </td>
            <td>
                <div class="address-info">
                    ${customer.address}
                </div>
            </td>
            <td>
                <div class="orders-info">
                    <strong>${customer.totalOrders}</strong>
                    <br>
                    <small>orders</small>
                </div>
            </td>
            <td>
                <span class="status-badge status-${customer.status.toLowerCase()}">
                    ${customer.status}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon" onclick="viewCustomerDetails(${customer.id})" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" onclick="editCustomer(${customer.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" onclick="viewCustomerOrders(${customer.id})" title="View Orders">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                    <button class="btn-icon danger" onclick="deleteCustomer(${customer.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// Update customer statistics
function updateCustomerStatistics() {
    const total = filteredCustomers.length;
    const active = filteredCustomers.filter(c => c.status === 'Active').length;
    const vip = filteredCustomers.filter(c => c.status === 'VIP').length;
    const newCustomers = filteredCustomers.filter(c => c.status === 'New').length;

    document.getElementById('totalCustomersCount').textContent = total;
    document.getElementById('activeCustomersCount').textContent = active;
    document.getElementById('vipCustomersCount').textContent = vip;
    document.getElementById('newCustomersCount').textContent = newCustomers;
}

// Load top customers
function loadTopCustomers() {
    const topCustomersList = document.getElementById('topCustomersList');
    if (!topCustomersList) return;

    const topCustomers = [...filteredCustomers]
        .sort((a, b) => b.totalOrders - a.totalOrders)
        .slice(0, 5);

    topCustomersList.innerHTML = '';

    topCustomers.forEach((customer, index) => {
        const customerItem = document.createElement('div');
        customerItem.className = 'top-customer-item';

        customerItem.innerHTML = `
            <div class="customer-rank">#${index + 1}</div>
            <div class="customer-details">
                <strong>${customer.name}</strong>
                <small>${customer.totalOrders} orders</small>
            </div>
            <div class="customer-badge">
                <span class="status-badge status-${customer.status.toLowerCase()}">
                    ${customer.status}
                </span>
            </div>
        `;

        topCustomersList.appendChild(customerItem);
    });
}

// Filter customers
function filterCustomers() {
    const searchTerm = document.getElementById('customerSearchInput').value.toLowerCase();
    const statusFilter = document.getElementById('customerStatusFilter').value;
    const ordersFilter = document.getElementById('customerOrdersFilter').value;

    filteredCustomers = customersData.filter(customer => {
        const matchesSearch = !searchTerm ||
            customer.name.toLowerCase().includes(searchTerm) ||
            customer.phone.includes(searchTerm) ||
            customer.email.toLowerCase().includes(searchTerm) ||
            customer.address.toLowerCase().includes(searchTerm);

        const matchesStatus = !statusFilter || customer.status === statusFilter;

        let matchesOrders = true;
        if (ordersFilter) {
            switch (ordersFilter) {
                case 'high':
                    matchesOrders = customer.totalOrders >= 20;
                    break;
                case 'medium':
                    matchesOrders = customer.totalOrders >= 10 && customer.totalOrders < 20;
                    break;
                case 'low':
                    matchesOrders = customer.totalOrders < 10;
                    break;
            }
        }

        return matchesSearch && matchesStatus && matchesOrders;
    });

    loadCustomers();
    updateCustomerStatistics();
    loadTopCustomers();
}

// Reset customer filters
function resetCustomerFilters() {
    document.getElementById('customerSearchInput').value = '';
    document.getElementById('customerStatusFilter').value = '';
    document.getElementById('customerOrdersFilter').value = '';

    filteredCustomers = [...customersData];
    loadCustomers();
    updateCustomerStatistics();
    loadTopCustomers();
}

// Sort customers
function sortCustomers(field) {
    if (currentCustomerSortField === field) {
        currentCustomerSortDirection = currentCustomerSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        currentCustomerSortField = field;
        currentCustomerSortDirection = 'asc';
    }

    filteredCustomers.sort((a, b) => {
        let aValue = a[field];
        let bValue = b[field];

        if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
        }

        if (currentCustomerSortDirection === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    loadCustomers();
    updateCustomerSortIcons(field);
}

// Update sort icons
function updateCustomerSortIcons(activeField) {
    const sortIcons = document.querySelectorAll('th i.fas');
    sortIcons.forEach(icon => {
        icon.className = 'fas fa-sort';
    });

    const activeIcon = document.querySelector(`th[onclick="sortCustomers('${activeField}')"] i`);
    if (activeIcon) {
        activeIcon.className = currentCustomerSortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
    }
}

// View customer details
function viewCustomerDetails(customerId) {
    const customer = customersData.find(c => c.id === customerId);
    if (!customer) return;

    const detailsContent = document.getElementById('customerDetailsContent');
    detailsContent.innerHTML = `
        <div class="customer-details">
            <div class="detail-section">
                <h4>Personal Information</h4>
                <p><strong>Name:</strong> ${customer.name}</p>
                <p><strong>Phone:</strong> ${customer.phone}</p>
                <p><strong>Email:</strong> ${customer.email}</p>
                <p><strong>Address:</strong> ${customer.address}</p>
            </div>

            <div class="detail-section">
                <h4>Account Information</h4>
                <p><strong>Customer ID:</strong> ${customer.id}</p>
                <p><strong>Status:</strong>
                    <span class="status-badge status-${customer.status.toLowerCase()}">${customer.status}</span>
                </p>
                <p><strong>Total Orders:</strong> ${customer.totalOrders}</p>
                <p><strong>Member Since:</strong> ${customer.memberSince || 'Not recorded'}</p>
            </div>

            <div class="detail-section">
                <h4>Recent Activity</h4>
                <p><strong>Last Order:</strong> ${customer.lastOrder || 'No recent orders'}</p>
                <p><strong>Last Contact:</strong> ${customer.lastContact || 'No recent contact'}</p>
                <p><strong>Preferred Courier:</strong> ${customer.preferredCourier || 'No preference'}</p>
            </div>

            <div class="detail-section">
                <h4>Actions</h4>
                <div class="action-buttons">
                    <button class="btn-primary" onclick="editCustomer(${customer.id}); closeModal('customerDetailsModal')">
                        <i class="fas fa-edit"></i> Edit Customer
                    </button>
                    <button class="btn-secondary" onclick="viewCustomerOrders(${customer.id}); closeModal('customerDetailsModal')">
                        <i class="fas fa-shopping-cart"></i> View Orders
                    </button>
                    <button class="btn-secondary" onclick="contactCustomer(${customer.id})">
                        <i class="fas fa-phone"></i> Contact Customer
                    </button>
                </div>
            </div>
        </div>
    `;

    openModal('customerDetailsModal');
}

// Edit customer
function editCustomer(customerId) {
    const customer = customersData.find(c => c.id === customerId);
    if (!customer) return;

    // Populate form with existing data
    document.getElementById('customerName').value = customer.name;
    document.getElementById('customerPhone').value = customer.phone;
    document.getElementById('customerEmail').value = customer.email;
    document.getElementById('customerAddress').value = customer.address;
    document.getElementById('customerStatus').value = customer.status;

    // Store the customer ID for updating
    document.getElementById('customerForm').dataset.editingId = customerId;

    openModal('addCustomerModal');
}

// View customer orders
function viewCustomerOrders(customerId) {
    const customer = customersData.find(c => c.id === customerId);
    if (!customer) return;

    // Filter shipments for this customer
    const customerShipments = shipmentsData.filter(s => s.customer === customer.name);

    if (customerShipments.length === 0) {
        showNotification('No orders found for this customer.', 'info');
        return;
    }

    // Redirect to shipment tracking with customer filter
    window.location.href = `shipment-tracking.html?customer=${encodeURIComponent(customer.name)}`;
}

// Contact customer
function contactCustomer(customerId) {
    const customer = customersData.find(c => c.id === customerId);
    if (!customer) return;

    const action = confirm(`Contact ${customer.name}?\n\nPhone: ${customer.phone}\nEmail: ${customer.email}\n\nClick OK to call or Cancel to email.`);

    if (action) {
        // Simulate phone call
        window.open(`tel:${customer.phone}`);
    } else {
        // Simulate email
        window.open(`mailto:${customer.email}?subject=Regarding your shipments`);
    }

    showNotification(`Contacting ${customer.name}...`, 'info');
}

// Delete customer
function deleteCustomer(customerId) {
    const customer = customersData.find(c => c.id === customerId);
    if (!customer) return;

    // Check if customer has active shipments
    const activeShipments = shipmentsData.filter(s =>
        s.customer === customer.name &&
        (s.statusColor === 'pending' || s.statusColor === 'transit')
    );

    if (activeShipments.length > 0) {
        showNotification('Cannot delete customer with active shipments!', 'error');
        return;
    }

    if (confirm(`Are you sure you want to delete ${customer.name}?\n\nThis action cannot be undone.`)) {
        const customerIndex = customersData.findIndex(c => c.id === customerId);
        if (customerIndex > -1) {
            customersData.splice(customerIndex, 1);
            filteredCustomers = filteredCustomers.filter(c => c.id !== customerId);

            loadCustomers();
            updateCustomerStatistics();
            loadTopCustomers();
            showNotification('Customer deleted successfully!', 'success');
        }
    }
}

// Handle customer form submission
function handleCustomerFormSubmission(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const editingId = e.target.dataset.editingId;

    const customerData = {
        name: formData.get('customerName'),
        phone: formData.get('customerPhone'),
        email: formData.get('customerEmail'),
        address: formData.get('customerAddress'),
        status: formData.get('customerStatus')
    };

    if (editingId) {
        // Update existing customer
        updateExistingCustomer(parseInt(editingId), customerData);
        delete e.target.dataset.editingId;
    } else {
        // Add new customer
        addNewCustomer(customerData);
    }

    closeModal('addCustomerModal');
    e.target.reset();
}

// Add new customer
function addNewCustomer(customerData) {
    // Check if email already exists
    if (customersData.find(c => c.email === customerData.email)) {
        showNotification('Email address already exists!', 'error');
        return;
    }

    const newCustomer = {
        id: customersData.length + 1,
        name: customerData.name,
        phone: customerData.phone,
        email: customerData.email,
        address: customerData.address,
        totalOrders: 0,
        status: customerData.status,
        memberSince: new Date().toLocaleDateString(),
        lastContact: 'Just now'
    };

    customersData.push(newCustomer);
    filteredCustomers.push(newCustomer);

    loadCustomers();
    updateCustomerStatistics();
    loadTopCustomers();
    showNotification('Customer added successfully!', 'success');
}

// Update existing customer
function updateExistingCustomer(customerId, customerData) {
    const customer = customersData.find(c => c.id === customerId);
    if (!customer) return;

    // Check if email already exists (excluding current customer)
    if (customersData.find(c => c.email === customerData.email && c.id !== customerId)) {
        showNotification('Email address already exists!', 'error');
        return;
    }

    // Update customer data
    Object.assign(customer, customerData);
    customer.lastContact = 'Just now';

    // Update filtered customers
    const filteredCustomer = filteredCustomers.find(c => c.id === customerId);
    if (filteredCustomer) {
        Object.assign(filteredCustomer, customer);
    }

    loadCustomers();
    updateCustomerStatistics();
    loadTopCustomers();
    showNotification('Customer updated successfully!', 'success');
}

// Export customers
function exportCustomers() {
    const csvContent = generateCustomerCSV(filteredCustomers);
    downloadCSV(csvContent, 'customers.csv');
    showNotification('Customers exported successfully!', 'success');
}

// Generate customer CSV content
function generateCustomerCSV(data) {
    const headers = ['ID', 'Name', 'Phone', 'Email', 'Address', 'Total Orders', 'Status'];
    const csvRows = [headers.join(',')];

    data.forEach(customer => {
        const row = [
            customer.id,
            `"${customer.name}"`,
            customer.phone,
            customer.email,
            `"${customer.address}"`,
            customer.totalOrders,
            customer.status
        ];
        csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
}

// Refresh customers
function refreshCustomers() {
    filteredCustomers = [...customersData];
    loadCustomers();
    updateCustomerStatistics();
    loadTopCustomers();
    showNotification('Customers refreshed successfully!', 'success');
}
