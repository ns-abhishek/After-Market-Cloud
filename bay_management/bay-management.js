// Bay Management JavaScript

let filteredBays = [];
let currentView = 'grid';
let currentBaySortField = '';
let currentBaySortDirection = 'asc';
let columnFilters = {
    code: '',
    description: '',
    type: '',
    active: ''
};

// Initialize bay management page
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('bay-management.html')) {
        initializeBayManagement();
    }
});

function initializeBayManagement() {
    // Initialize filtered bays with all bay data
    filteredBays = [...baysData];

    loadBayLayout();
    updateBayStatistics();

    // Add form submission handlers
    const bayForm = document.getElementById('bayForm');
    if (bayForm) {
        bayForm.addEventListener('submit', handleBayFormSubmission);
    }

    const allocateBayForm = document.getElementById('allocateBayForm');
    if (allocateBayForm) {
        allocateBayForm.addEventListener('submit', handleBayAllocation);
    }

    console.log('Bay management initialized with', baysData.length, 'bays');
}

// Load bay layout (configuration table view)
function loadBayLayout() {
    loadBayConfigTable();
}

// Load bay configuration table
function loadBayConfigTable() {
    const tableBody = document.getElementById('bayConfigTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    // Calculate pagination
    const startIndex = (currentPageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedBays = filteredBays.slice(startIndex, endIndex);

    // Show message if no bays found
    if (paginatedBays.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-light);">
                <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
                No bays found matching your criteria
            </td>
        `;
        tableBody.appendChild(row);
        updatePaginationInfo();
        return;
    }

    paginatedBays.forEach((bay, index) => {
        const row = document.createElement('tr');
        row.className = 'bay-config-row';

        // Add row number for better tracking
        const globalIndex = startIndex + index + 1;

        row.innerHTML = `
            <td class="checkbox-cell">
                <input type="checkbox" class="bay-checkbox" value="${bay.id}" onchange="updateSelection()">
            </td>
            <td class="edit-cell">
                <button class="btn-table-action" onclick="editBayConfig(${bay.id})" title="Edit Bay ${bay.number}">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
            <td class="delete-cell">
                <button class="btn-table-action delete" onclick="deleteBayConfig(${bay.id})" title="Delete Bay ${bay.number}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
            <td class="code-cell">
                <span class="bay-code" title="Bay Code: ${bay.number}">${bay.number}</span>
            </td>
            <td class="description-cell">
                <span class="bay-description" title="${bay.description || `Service bay ${bay.number}`}">
                    ${bay.description || `Service bay ${bay.number}`}
                </span>
            </td>
            <td class="type-cell">
                <span class="bay-type" title="Bay Type: ${bay.type || getBayType(bay.status)}">
                    ${bay.type || getBayType(bay.status)}
                </span>
            </td>
            <td class="active-cell">
                <span class="active-status ${bay.isActive !== false ? 'active' : 'inactive'}"
                      title="Status: ${bay.isActive !== false ? 'Active' : 'Inactive'}">
                    <span class="status-dot ${bay.isActive !== false ? 'active' : 'inactive'}"></span>
                    ${bay.isActive !== false ? 'Active' : 'Inactive'}
                </span>
            </td>
        `;

        tableBody.appendChild(row);
    });

    updatePaginationInfo();
}

// Get bay type based on status
function getBayType(status) {
    switch(status) {
        case 'available': return 'Outside Branch';
        case 'occupied': return 'Working';
        case 'maintenance': return 'Maintenance';
        default: return 'Working';
    }
}

// Get bay section from bay number (handles different naming patterns)
function getBaySection(bayNumber) {
    if (!bayNumber) return '';

    // Handle patterns like "A1", "A01", "B01", "C01", etc.
    if (/^[A-Z]\d+/.test(bayNumber)) {
        return bayNumber.charAt(0);
    }

    // Handle patterns like "Bay 01", "Bay 02", etc. - these are unassigned
    if (bayNumber.startsWith('Bay ')) {
        return ''; // Return empty to make them unassigned
    }

    // Default case - try to extract first letter if it exists
    const firstChar = bayNumber.charAt(0);
    return /[A-Z]/.test(firstChar) ? firstChar : '';
}

// Load bay list view
function loadBayListView() {
    const tableBody = document.getElementById('bayTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    filteredBays.forEach(bay => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <strong>${bay.number}</strong>
            </td>
            <td>
                <span class="status-badge status-${bay.status}">
                    ${bay.status.toUpperCase()}
                </span>
            </td>
            <td>
                ${bay.customer || '-'}
            </td>
            <td>
                ${bay.shipment || '-'}
            </td>
            <td>
                ${bay.allocatedTime || '-'}
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon" onclick="showBayDetailsModal(${JSON.stringify(bay).replace(/"/g, '&quot;')})" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${bay.status === 'available' ?
                        `<button class="btn-icon" onclick="allocateBay('${bay.number}')" title="Allocate">
                            <i class="fas fa-plus"></i>
                        </button>` :
                        `<button class="btn-icon" onclick="freeBay('${bay.number}')" title="Free Bay">
                            <i class="fas fa-times"></i>
                        </button>`
                    }
                    <button class="btn-icon" onclick="editBay('${bay.number}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon danger" onclick="deleteBay('${bay.number}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// Update bay statistics with progress bars
function updateBayStatistics() {
    const total = filteredBays.length;
    const occupied = filteredBays.filter(bay => bay.status === 'occupied').length;
    const available = filteredBays.filter(bay => bay.status === 'available').length;
    const maintenance = filteredBays.filter(bay => bay.status === 'maintenance').length;

    // Update counts
    document.getElementById('totalBaysCount').textContent = total;
    document.getElementById('occupiedBaysCount').textContent = occupied;
    document.getElementById('availableBaysCount').textContent = available;
    document.getElementById('maintenanceBaysCount').textContent = maintenance;

    // Calculate percentages
    const occupiedPercent = total > 0 ? Math.round((occupied / total) * 100) : 0;
    const availablePercent = total > 0 ? Math.round((available / total) * 100) : 0;
    const maintenancePercent = total > 0 ? Math.round((maintenance / total) * 100) : 0;

    // Update progress bars
    const totalProgress = document.getElementById('totalBaysProgress');
    const occupiedProgress = document.getElementById('occupiedBaysProgress');
    const availableProgress = document.getElementById('availableBaysProgress');
    const maintenanceProgress = document.getElementById('maintenanceBaysProgress');

    if (totalProgress) totalProgress.style.width = '100%';
    if (occupiedProgress) occupiedProgress.style.width = `${occupiedPercent}%`;
    if (availableProgress) availableProgress.style.width = `${availablePercent}%`;
    if (maintenanceProgress) maintenanceProgress.style.width = `${maintenancePercent}%`;

    // Update percentage text
    const totalPercentage = document.getElementById('totalBaysPercentage');
    const occupiedPercentage = document.getElementById('occupiedBaysPercentage');
    const availablePercentage = document.getElementById('availableBaysPercentage');
    const maintenancePercentage = document.getElementById('maintenanceBaysPercentage');

    if (totalPercentage) totalPercentage.textContent = '100%';
    if (occupiedPercentage) occupiedPercentage.textContent = `${occupiedPercent}%`;
    if (availablePercentage) availablePercentage.textContent = `${availablePercent}%`;
    if (maintenancePercentage) maintenancePercentage.textContent = `${maintenancePercent}%`;

    console.log(`Statistics updated: Total: ${total}, Occupied: ${occupied} (${occupiedPercent}%), Available: ${available} (${availablePercent}%), Maintenance: ${maintenance} (${maintenancePercent}%)`);
}

// Filter bays - Main search function (global filters only)
function filterBays() {
    const searchTerm = document.getElementById('baySearchInput')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('bayStatusFilter')?.value || '';
    const sectionFilter = document.getElementById('baySectionFilter')?.value || '';

    console.log('Main filtering with:', { searchTerm, statusFilter, sectionFilter });

    // Debug: Show bay sections for first few bays
    if (sectionFilter) {
        console.log('Section filter active:', sectionFilter);
        baysData.slice(0, 5).forEach(bay => {
            console.log(`Bay ${bay.number} -> Section: ${getBaySection(bay.number)}`);
        });
    }

    // Reset current page when filtering
    currentPageNumber = 1;

    // Apply only main search and top-level filters (ignore column filters)
    filteredBays = baysData.filter(bay => {
        // Main search term filter
        const matchesSearch = !searchTerm ||
            bay.number.toLowerCase().includes(searchTerm) ||
            (bay.description && bay.description.toLowerCase().includes(searchTerm)) ||
            (bay.customer && bay.customer.toLowerCase().includes(searchTerm)) ||
            (bay.shipment && bay.shipment.toLowerCase().includes(searchTerm)) ||
            (`Service bay ${bay.number}`.toLowerCase().includes(searchTerm));

        // Status filter (bay operational status)
        const matchesStatus = !statusFilter || bay.status === statusFilter;

        // Section filter - handle different bay naming patterns
        const baySection = getBaySection(bay.number);
        const matchesSection = !sectionFilter || baySection === sectionFilter;

        return matchesSearch && matchesStatus && matchesSection;
    });

    console.log(`Main filtered ${filteredBays.length} bays from ${baysData.length} total`);

    loadBayLayout();
    updateBayStatistics();
    updatePaginationInfo();
}

// Reset bay filters
function resetBayFilters() {
    document.getElementById('baySearchInput').value = '';
    document.getElementById('bayStatusFilter').value = '';
    document.getElementById('baySectionFilter').value = '';

    filteredBays = [...baysData];
    loadBayLayout();
    updateBayStatistics();
}

// Removed toggle view function - now using horizontal table only

// Sort bays
function sortBays(field) {
    if (currentBaySortField === field) {
        currentBaySortDirection = currentBaySortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        currentBaySortField = field;
        currentBaySortDirection = 'asc';
    }

    filteredBays.sort((a, b) => {
        let aValue = a[field];
        let bValue = b[field];

        if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
        }

        if (currentBaySortDirection === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    loadBayLayout();
}

// Show bay details modal
function showBayDetailsModal(bay) {
    const detailsContent = document.getElementById('bayDetailsContent');
    detailsContent.innerHTML = `
        <div class="bay-details">
            <div class="detail-section">
                <h4>Bay Information</h4>
                <p><strong>Bay Number:</strong> ${bay.number}</p>
                <p><strong>Section:</strong> ${bay.number.charAt(0)}</p>
                <p><strong>Status:</strong>
                    <span class="status-badge status-${bay.status}">${bay.status.toUpperCase()}</span>
                </p>
                <p><strong>Capacity:</strong> ${bay.capacity || 'Not specified'} cubic meters</p>
            </div>

            ${bay.status === 'occupied' ? `
                <div class="detail-section">
                    <h4>Current Allocation</h4>
                    <p><strong>Customer:</strong> ${bay.customer}</p>
                    <p><strong>Shipment:</strong> ${bay.shipment}</p>
                    <p><strong>Allocated Time:</strong> ${bay.allocatedTime || 'Not recorded'}</p>
                </div>
            ` : ''}

            <div class="detail-section">
                <h4>Actions</h4>
                <div class="action-buttons">
                    ${bay.status === 'available' ?
                        `<button class="btn-primary" onclick="allocateBay('${bay.number}'); closeModal('bayDetailsModal')">
                            <i class="fas fa-plus"></i> Allocate Bay
                        </button>` :
                        `<button class="btn-secondary" onclick="freeBay('${bay.number}'); closeModal('bayDetailsModal')">
                            <i class="fas fa-times"></i> Free Bay
                        </button>`
                    }
                    <button class="btn-secondary" onclick="editBay('${bay.number}'); closeModal('bayDetailsModal')">
                        <i class="fas fa-edit"></i> Edit Bay
                    </button>
                    ${bay.status !== 'occupied' ?
                        `<button class="btn-secondary danger" onclick="deleteBay('${bay.number}'); closeModal('bayDetailsModal')">
                            <i class="fas fa-trash"></i> Delete Bay
                        </button>` : ''
                    }
                </div>
            </div>
        </div>
    `;

    openModal('bayDetailsModal');
}

// Allocate bay
function allocateBay(bayNumber) {
    const bay = baysData.find(b => b.number === bayNumber);
    if (!bay || bay.status !== 'available') {
        showNotification('Bay is not available for allocation!', 'error');
        return;
    }

    document.getElementById('selectedBay').value = bayNumber;
    openModal('allocateBayModal');
}

// Free bay
function freeBay(bayNumber) {
    if (confirm('Are you sure you want to free this bay?')) {
        const bay = baysData.find(b => b.number === bayNumber);
        if (bay) {
            bay.status = 'available';
            bay.customer = null;
            bay.shipment = null;
            bay.allocatedTime = null;

            // Update filtered bays
            const filteredBay = filteredBays.find(b => b.number === bayNumber);
            if (filteredBay) {
                Object.assign(filteredBay, bay);
            }

            loadBayLayout();
            updateBayStatistics();
            showNotification('Bay freed successfully!', 'success');
        }
    }
}

// Edit bay
function editBay(bayNumber) {
    const bay = baysData.find(b => b.number === bayNumber);
    if (!bay) return;

    // Populate form with existing data
    document.getElementById('bayNumber').value = bay.number;
    document.getElementById('baySection').value = bay.number.charAt(0);
    document.getElementById('bayCapacity').value = bay.capacity || '';
    document.getElementById('bayDescription').value = bay.description || '';

    // Store the bay number for updating
    document.getElementById('bayForm').dataset.editingBay = bayNumber;

    openModal('addBayModal');
}

// Delete bay
function deleteBay(bayNumber) {
    const bay = baysData.find(b => b.number === bayNumber);
    if (bay && bay.status === 'occupied') {
        showNotification('Cannot delete occupied bay!', 'error');
        return;
    }

    if (confirm('Are you sure you want to delete this bay?')) {
        const bayIndex = baysData.findIndex(b => b.number === bayNumber);
        if (bayIndex > -1) {
            baysData.splice(bayIndex, 1);
            filteredBays = filteredBays.filter(b => b.number !== bayNumber);

            loadBayLayout();
            updateBayStatistics();
            showNotification('Bay deleted successfully!', 'success');
        }
    }
}

// Handle bay form submission
function handleBayFormSubmission(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const editingBay = e.target.dataset.editingBay;

    const bayData = {
        number: formData.get('bayNumber'),
        section: formData.get('baySection'),
        capacity: formData.get('bayCapacity'),
        description: formData.get('bayDescription'),
        status: 'available'
    };

    if (editingBay) {
        // Update existing bay
        updateExistingBay(editingBay, bayData);
        delete e.target.dataset.editingBay;
    } else {
        // Add new bay
        addNewBay(bayData);
    }

    closeModal('addBayModal');
    e.target.reset();
}

// Add new bay
function addNewBay(bayData) {
    // Check if bay number already exists
    if (baysData.find(b => b.number === bayData.number)) {
        showNotification('Bay number already exists!', 'error');
        return;
    }

    const newBay = {
        id: baysData.length + 1,
        number: bayData.number,
        status: 'available',
        customer: null,
        shipment: null,
        capacity: bayData.capacity,
        description: bayData.description
    };

    baysData.push(newBay);
    filteredBays.push(newBay);

    loadBayLayout();
    updateBayStatistics();
    showNotification('Bay added successfully!', 'success');
}

// Update existing bay
function updateExistingBay(bayNumber, bayData) {
    const bay = baysData.find(b => b.number === bayNumber);
    if (!bay) return;

    // Update bay data (preserve status and allocation info)
    bay.number = bayData.number;
    bay.capacity = bayData.capacity;
    bay.description = bayData.description;

    // Update filtered bays
    const filteredBay = filteredBays.find(b => b.number === bayNumber);
    if (filteredBay) {
        Object.assign(filteredBay, bay);
    }

    loadBayLayout();
    updateBayStatistics();
    showNotification('Bay updated successfully!', 'success');
}

// Handle bay allocation
function handleBayAllocation(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const bayNumber = document.getElementById('selectedBay').value;

    const allocationData = {
        customer: formData.get('allocateCustomer'),
        shipment: formData.get('allocateShipment'),
        notes: formData.get('allocateNotes')
    };

    const bay = baysData.find(b => b.number === bayNumber);
    if (bay && bay.status === 'available') {
        bay.status = 'occupied';
        bay.customer = allocationData.customer;
        bay.shipment = allocationData.shipment;
        bay.allocatedTime = new Date().toLocaleString();
        bay.notes = allocationData.notes;

        // Update filtered bays
        const filteredBay = filteredBays.find(b => b.number === bayNumber);
        if (filteredBay) {
            Object.assign(filteredBay, bay);
        }

        loadBayLayout();
        updateBayStatistics();
        showNotification('Bay allocated successfully!', 'success');
    }

    closeModal('allocateBayModal');
    e.target.reset();
}

// Refresh bays
function refreshBays() {
    filteredBays = [...baysData];
    loadBayLayout();
    updateBayStatistics();
    showNotification('Bays refreshed successfully!', 'success');
}

// New functionality for bay configuration table

// Toggle select all checkboxes
function toggleSelectAll() {
    const selectAll = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.bay-checkbox');

    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAll.checked;
    });

    updateSelection();
}

// Update selection count and enable/disable bulk actions
function updateSelection() {
    const checkboxes = document.querySelectorAll('.bay-checkbox:checked');
    const selectAll = document.getElementById('selectAll');
    const totalCheckboxes = document.querySelectorAll('.bay-checkbox');

    // Update select all checkbox state
    if (checkboxes.length === 0) {
        selectAll.indeterminate = false;
        selectAll.checked = false;
    } else if (checkboxes.length === totalCheckboxes.length) {
        selectAll.indeterminate = false;
        selectAll.checked = true;
    } else {
        selectAll.indeterminate = true;
        selectAll.checked = false;
    }
}

// Sort bay configuration table
function sortBayConfig(field) {
    if (currentBaySortField === field) {
        currentBaySortDirection = currentBaySortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        currentBaySortField = field;
        currentBaySortDirection = 'asc';
    }

    filteredBays.sort((a, b) => {
        let aValue = field === 'code' ? a.number : a[field];
        let bValue = field === 'code' ? b.number : b[field];

        if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
        }

        if (currentBaySortDirection === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    loadBayLayout();
    updateSortIcon(field);
}

// Update sort icon
function updateSortIcon(activeField) {
    const sortIcons = document.querySelectorAll('.bay-config-table th i.fas');
    sortIcons.forEach(icon => {
        icon.className = 'fas fa-sort';
    });

    const activeIcon = document.querySelector(`th .fas[onclick*="${activeField}"]`);
    if (activeIcon) {
        activeIcon.className = currentBaySortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
    }
}

// Edit bay configuration
function editBayConfig(bayId) {
    const bay = baysData.find(b => b.id === bayId);
    if (!bay) return;

    // Populate form with existing data
    document.getElementById('bayNumber').value = bay.number;
    document.getElementById('baySection').value = bay.number.charAt(0);
    document.getElementById('bayCapacity').value = bay.capacity || '';
    document.getElementById('bayDescription').value = bay.description || `Service bay ${bay.number}`;

    // Store the bay ID for updating
    document.getElementById('bayForm').dataset.editingId = bayId;

    openModal('addBayModal');
}

// Delete bay configuration
function deleteBayConfig(bayId) {
    const bay = baysData.find(b => b.id === bayId);
    if (!bay) return;

    if (bay.status === 'occupied') {
        showNotification('Cannot delete occupied bay!', 'error');
        return;
    }

    if (confirm(`Are you sure you want to delete bay ${bay.number}?`)) {
        const bayIndex = baysData.findIndex(b => b.id === bayId);
        if (bayIndex > -1) {
            baysData.splice(bayIndex, 1);
            filteredBays = filteredBays.filter(b => b.id !== bayId);

            loadBayLayout();
            updateBayStatistics();
            showNotification('Bay deleted successfully!', 'success');
        }
    }
}

// Delete selected bays
function deleteBays() {
    const selectedCheckboxes = document.querySelectorAll('.bay-checkbox:checked');

    if (selectedCheckboxes.length === 0) {
        showNotification('Please select bays to delete!', 'warning');
        return;
    }

    const selectedIds = Array.from(selectedCheckboxes).map(cb => parseInt(cb.value));
    const occupiedBays = selectedIds.filter(id => {
        const bay = baysData.find(b => b.id === id);
        return bay && bay.status === 'occupied';
    });

    if (occupiedBays.length > 0) {
        showNotification('Cannot delete occupied bays!', 'error');
        return;
    }

    if (confirm(`Are you sure you want to delete ${selectedIds.length} selected bay(s)?`)) {
        selectedIds.forEach(id => {
            const bayIndex = baysData.findIndex(b => b.id === id);
            if (bayIndex > -1) {
                baysData.splice(bayIndex, 1);
            }
        });

        filteredBays = baysData.filter(bay => !selectedIds.includes(bay.id));
        loadBayLayout();
        updateBayStatistics();
        showNotification(`${selectedIds.length} bay(s) deleted successfully!`, 'success');
    }
}

// Advanced search
function advancedSearch() {
    const searchTerm = prompt('Enter search term for bay code or description:');
    if (searchTerm) {
        filteredBays = baysData.filter(bay =>
            bay.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `Service bay ${bay.number}`.toLowerCase().includes(searchTerm.toLowerCase())
        );
        loadBayLayout();
        updateBayStatistics();
        showNotification(`Found ${filteredBays.length} matching bay(s)`, 'info');
    }
}

// Export bays
function exportBays() {
    const csvContent = generateBayConfigCSV(filteredBays);
    downloadCSV(csvContent, 'bay-configuration.csv');
    showNotification('Bay configuration exported successfully!', 'success');
}

// Generate bay configuration CSV
function generateBayConfigCSV(data) {
    const headers = ['Code', 'Description', 'Type', 'Is Active'];
    const csvRows = [headers.join(',')];

    data.forEach(bay => {
        const row = [
            bay.number,
            `"Service bay ${bay.number}"`,
            getBayType(bay.status),
            bay.status !== 'maintenance' ? 'Yes' : 'No'
        ];
        csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
}

// Filter by branch
function filterByBranch() {
    const branch = document.getElementById('branchSelect').value;
    // For demo purposes, we'll just show a notification
    showNotification(`Filtered by branch: ${branch}`, 'info');
}

// Filter by workshop
function filterByWorkshop() {
    const workshop = document.getElementById('workshopSelect').value;
    // For demo purposes, we'll just show a notification
    showNotification(`Filtered by workshop: ${workshop}`, 'info');
}

// Update pagination info
function updatePaginationInfo() {
    const totalRecords = filteredBays.length;
    const pageSize = parseInt(document.getElementById('pageSize')?.value || 10);
    const totalPages = Math.ceil(totalRecords / pageSize);
    const startRecord = (currentPageNumber - 1) * pageSize + 1;
    const endRecord = Math.min(currentPageNumber * pageSize, totalRecords);

    // Update pagination display
    const totalRecordsElement = document.getElementById('totalRecords');
    const currentPageElement = document.getElementById('currentPage');
    const totalPagesElement = document.getElementById('totalPages');

    if (totalRecordsElement) totalRecordsElement.textContent = totalRecords;
    if (currentPageElement) currentPageElement.textContent = startRecord;
    if (totalPagesElement) totalPagesElement.textContent = endRecord;

    // Update pagination buttons
    const prevButton = document.querySelector('.btn-pagination[onclick="previousPage()"]');
    const nextButton = document.querySelector('.btn-pagination[onclick="nextPage()"]');

    if (prevButton) {
        prevButton.disabled = currentPageNumber <= 1;
    }
    if (nextButton) {
        nextButton.disabled = currentPageNumber >= totalPages;
    }
}

// Change page size
function changePageSize() {
    const pageSize = parseInt(document.getElementById('pageSize').value);
    itemsPerPage = pageSize;
    currentPageNumber = 1; // Reset to first page
    loadBayLayout();
    updatePaginationInfo();
    showNotification(`Page size changed to ${pageSize} items per page`, 'info');
}

// Filter by column - only affects the specific column
function filterByColumn(column, value) {
    columnFilters[column] = value.toLowerCase();
    console.log(`Filtering by ${column}: "${value}"`);
    console.log('Current column filters:', columnFilters);

    // Synchronize type filter inputs
    if (column === 'type') {
        const typeSearch = document.getElementById('typeSearch');
        const typeSearchInput = document.getElementById('typeSearchInput');

        // If value matches a dropdown option, select it and clear input
        if (value && ['Working', 'Outside Branch', 'Maintenance'].includes(value)) {
            if (typeSearch) typeSearch.value = value;
            if (typeSearchInput) typeSearchInput.value = '';
        } else {
            // If it's a search term, clear dropdown and set input
            if (typeSearch) typeSearch.value = '';
            if (typeSearchInput && typeSearchInput !== document.activeElement) {
                typeSearchInput.value = value;
            }
        }
    }

    // Synchronize active/status filter inputs
    if (column === 'active') {
        const activeSearch = document.getElementById('activeSearch');
        const activeSearchInput = document.getElementById('activeSearchInput');

        // If value matches a dropdown option, select it and clear input
        if (value && ['Active', 'Inactive'].includes(value)) {
            if (activeSearch) activeSearch.value = value;
            if (activeSearchInput) activeSearchInput.value = '';
        } else {
            // If it's a search term, clear dropdown and set input
            if (activeSearch) activeSearch.value = '';
            if (activeSearchInput && activeSearchInput !== document.activeElement) {
                activeSearchInput.value = value;
            }
        }
    }

    // Apply column-specific filtering without affecting main search
    applyColumnOnlyFilters();
}

// Apply column filters to a single row (helper function)
function applyColumnFiltersToRow(bay) {
    // Code filter
    if (columnFilters.code && !bay.number.toLowerCase().includes(columnFilters.code)) {
        return false;
    }

    // Description filter
    if (columnFilters.description) {
        const description = bay.description || `Service bay ${bay.number}`;
        if (!description.toLowerCase().includes(columnFilters.description)) {
            return false;
        }
    }

    // Type filter - support both exact match and partial search
    if (columnFilters.type) {
        const bayType = bay.type || getBayType(bay.status);
        const filterValue = columnFilters.type.toLowerCase();

        // Check if it's an exact match (from dropdown) or partial match (from search input)
        const exactMatch = bayType === filterValue;
        const partialMatch = bayType.toLowerCase().includes(filterValue);

        if (!exactMatch && !partialMatch) {
            return false;
        }
    }

    // Active filter - support both exact match and partial search
    if (columnFilters.active) {
        const isActive = bay.isActive !== false ? 'Active' : 'Inactive';
        const filterValue = columnFilters.active.toLowerCase();

        // Check if it's an exact match (from dropdown) or partial match (from search input)
        const exactMatch = isActive.toLowerCase() === filterValue;
        const partialMatch = isActive.toLowerCase().includes(filterValue);

        if (!exactMatch && !partialMatch) {
            return false;
        }
    }

    return true;
}

// Apply column-only filters (only within currently visible table data)
function applyColumnOnlyFilters() {
    // Reset current page when filtering
    currentPageNumber = 1;

    // Check which column filters are active
    const activeColumnFilters = Object.entries(columnFilters).filter(([key, value]) => value && value.trim());

    if (activeColumnFilters.length === 0) {
        // No column filters active, show current filtered data (or apply main filters)
        filterBays();
        return;
    }

    console.log('Active column filters:', activeColumnFilters);

    // Get the base data that should be used for column filtering
    // This should be the currently filtered data from main search/filters
    let baseDataForColumnFilter = getBaseDataForColumnFiltering();

    console.log(`Column filtering base data: ${baseDataForColumnFilter.length} bays`);

    // Apply column filters only to the base data (currently visible data)
    filteredBays = baseDataForColumnFilter.filter(bay => {
        // Apply each active column filter
        return activeColumnFilters.every(([column, filterValue]) => {
            switch (column) {
                case 'code':
                    return bay.number.toLowerCase().includes(filterValue);

                case 'description':
                    const description = bay.description || `Service bay ${bay.number}`;
                    return description.toLowerCase().includes(filterValue);

                case 'type':
                    const bayType = bay.type || getBayType(bay.status);
                    // Support both exact match and partial match
                    return bayType.toLowerCase() === filterValue || bayType.toLowerCase().includes(filterValue);

                case 'active':
                    const isActive = bay.isActive !== false ? 'active' : 'inactive';
                    // Support both exact match and partial match
                    return isActive === filterValue || isActive.includes(filterValue);

                default:
                    return true;
            }
        });
    });

    console.log(`Column-only filtering: ${filteredBays.length} bays match column criteria from ${baseDataForColumnFilter.length} visible bays`);

    // Show notification about column filtering being active
    const activeFilterNames = activeColumnFilters.map(([column, value]) => {
        const columnName = column.charAt(0).toUpperCase() + column.slice(1);
        return `${columnName}: "${value}"`;
    }).join(', ');

    showNotification(`Column filter active: ${activeFilterNames}. Showing ${filteredBays.length} matching rows from current table.`, 'info');

    loadBayLayout();
    updateBayStatistics();
    updatePaginationInfo();
}

// Get base data for column filtering (currently visible data)
function getBaseDataForColumnFiltering() {
    // Apply main search and top-level filters to get the base data
    const searchTerm = document.getElementById('baySearchInput')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('bayStatusFilter')?.value || '';
    const sectionFilter = document.getElementById('baySectionFilter')?.value || '';

    // If no main filters are active, use all data
    if (!searchTerm && !statusFilter && !sectionFilter) {
        return [...baysData];
    }

    // Apply main filters to get the base data for column filtering
    return baysData.filter(bay => {
        // Main search term filter
        const matchesSearch = !searchTerm ||
            bay.number.toLowerCase().includes(searchTerm) ||
            (bay.description && bay.description.toLowerCase().includes(searchTerm)) ||
            (bay.customer && bay.customer.toLowerCase().includes(searchTerm)) ||
            (bay.shipment && bay.shipment.toLowerCase().includes(searchTerm)) ||
            (`Service bay ${bay.number}`.toLowerCase().includes(searchTerm));

        // Status filter (bay operational status)
        const matchesStatus = !statusFilter || bay.status === statusFilter;

        // Section filter - handle different bay naming patterns
        const baySection = getBaySection(bay.number);
        const matchesSection = !sectionFilter || baySection === sectionFilter;

        return matchesSearch && matchesStatus && matchesSection;
    });
}

// Apply all column filters (main function) - for compatibility
function applyColumnFilters() {
    applyColumnOnlyFilters();
}

// Clear all column filters
function clearColumnFilters() {
    columnFilters = {
        code: '',
        description: '',
        type: '',
        active: ''
    };

    // Clear input values safely
    const codeSearch = document.getElementById('codeSearch');
    const descriptionSearch = document.getElementById('descriptionSearch');
    const typeSearch = document.getElementById('typeSearch');
    const typeSearchInput = document.getElementById('typeSearchInput');
    const activeSearch = document.getElementById('activeSearch');
    const activeSearchInput = document.getElementById('activeSearchInput');

    if (codeSearch) codeSearch.value = '';
    if (descriptionSearch) descriptionSearch.value = '';
    if (typeSearch) typeSearch.value = '';
    if (typeSearchInput) typeSearchInput.value = '';
    if (activeSearch) activeSearch.value = '';
    if (activeSearchInput) activeSearchInput.value = '';

    // Reset current page
    currentPageNumber = 1;

    // Show notification about column filters being cleared
    showNotification('Column filters cleared. Showing all data.', 'info');

    // Use the main filter function to show all data (or apply main filters)
    filterBays();
}

// Enhanced reset bay filters to include column filters
function resetBayFilters() {
    // Clear main search inputs safely
    const baySearchInput = document.getElementById('baySearchInput');
    const bayStatusFilter = document.getElementById('bayStatusFilter');
    const baySectionFilter = document.getElementById('baySectionFilter');

    if (baySearchInput) baySearchInput.value = '';
    if (bayStatusFilter) bayStatusFilter.value = '';
    if (baySectionFilter) baySectionFilter.value = '';

    // Clear column filters
    clearColumnFilters();

    // Reset pagination
    currentPageNumber = 1;

    // Reset filtered data and refresh display
    filteredBays = [...baysData];
    loadBayLayout();
    updateBayStatistics();
    updatePaginationInfo();

    showNotification('All filters cleared successfully!', 'info');
}

// Additional functionality for enhanced bay management

// Bulk operations
function bulkActivateBays() {
    const selectedCheckboxes = document.querySelectorAll('.bay-checkbox:checked');

    if (selectedCheckboxes.length === 0) {
        showNotification('Please select bays to activate!', 'warning');
        return;
    }

    const selectedIds = Array.from(selectedCheckboxes).map(cb => parseInt(cb.value));

    if (confirm(`Are you sure you want to activate ${selectedIds.length} selected bay(s)?`)) {
        selectedIds.forEach(id => {
            const bay = baysData.find(b => b.id === id);
            if (bay) {
                bay.isActive = true;
            }
        });

        loadBayLayout();
        updateBayStatistics();
        showNotification(`${selectedIds.length} bay(s) activated successfully!`, 'success');
    }
}

function bulkDeactivateBays() {
    const selectedCheckboxes = document.querySelectorAll('.bay-checkbox:checked');

    if (selectedCheckboxes.length === 0) {
        showNotification('Please select bays to deactivate!', 'warning');
        return;
    }

    const selectedIds = Array.from(selectedCheckboxes).map(cb => parseInt(cb.value));
    const occupiedBays = selectedIds.filter(id => {
        const bay = baysData.find(b => b.id === id);
        return bay && bay.status === 'occupied';
    });

    if (occupiedBays.length > 0) {
        showNotification('Cannot deactivate occupied bays!', 'error');
        return;
    }

    if (confirm(`Are you sure you want to deactivate ${selectedIds.length} selected bay(s)?`)) {
        selectedIds.forEach(id => {
            const bay = baysData.find(b => b.id === id);
            if (bay) {
                bay.isActive = false;
            }
        });

        loadBayLayout();
        updateBayStatistics();
        showNotification(`${selectedIds.length} bay(s) deactivated successfully!`, 'success');
    }
}

// Quick search functionality
function quickSearch() {
    const searchTerm = prompt('Enter search term (bay code, description, or type):');
    if (searchTerm && searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim();

        filteredBays = baysData.filter(bay => {
            const code = bay.number.toLowerCase();
            const description = (bay.description || `Service bay ${bay.number}`).toLowerCase();
            const type = (bay.type || getBayType(bay.status)).toLowerCase();

            return code.includes(term) || description.includes(term) || type.includes(term);
        });

        loadBayLayout();
        updateBayStatistics();
        updatePaginationInfo();
        showNotification(`Found ${filteredBays.length} matching bay(s)`, 'info');
    }
}

// Drag and Drop Functionality
let isDragDropMode = false;
let draggedBay = null;
let pendingChanges = []; // Store pending bay changes

// Toggle drag and drop mode
function toggleDragDropMode() {
    console.log('=== BAY MANAGEMENT PAGE - TOGGLE DRAG DROP ===');

    isDragDropMode = !isDragDropMode;
    const newBtn = document.getElementById('newBayBtn');
    const dragDropSection = document.getElementById('dragDropSection');
    const tableContainer = document.querySelector('.bay-table-section'); // Changed to correct selector

    console.log('Toggling drag & drop mode. isDragDropMode:', isDragDropMode);
    console.log('Elements found:', {
        newBtn: !!newBtn,
        dragDropSection: !!dragDropSection,
        tableContainer: !!tableContainer
    });

    if (isDragDropMode) {
        console.log('Switching to drag & drop mode...');
        newBtn.innerHTML = '<i class="fas fa-table"></i> Back to Table';
        newBtn.classList.add('btn-secondary');
        newBtn.classList.remove('btn-primary');

        if (dragDropSection) {
            dragDropSection.style.display = 'block';
            console.log('Drag drop section shown');
        }

        if (tableContainer) {
            tableContainer.style.display = 'none';
            console.log('Table container hidden');
        }

        document.body.classList.add('drag-mode-active');

        // Load the drag drop layout immediately
        console.log('Loading drag drop layout...');
        loadDragDropLayout();

        showNotification('Drag & Drop mode enabled. Drag bays to appropriate sections.', 'info');
    } else {
        console.log('Switching back to table mode...');
        newBtn.innerHTML = '<i class="fas fa-plus"></i> New';
        newBtn.classList.remove('btn-secondary');
        newBtn.classList.add('btn-primary');

        if (dragDropSection) {
            dragDropSection.style.display = 'none';
        }

        if (tableContainer) {
            tableContainer.style.display = 'block';
        }

        document.body.classList.remove('drag-mode-active');

        // Refresh the table to show any newly added bays
        console.log('Refreshing table with updated bay data...');
        console.log('Current baysData length:', window.baysData ? window.baysData.length : 'undefined');

        // Force reload the bay data and table immediately
        setTimeout(() => {
            console.log('Refreshing table after drag & drop mode...');

            // Refresh the filtered bays from the main data
            filteredBays = [...baysData];
            console.log('Refreshed filteredBays. Length:', filteredBays.length);

            // Reload the table with updated data
            loadBayConfigTable();
            console.log('Bay config table reloaded');

            // Update statistics and pagination
            updateBayStatistics();
            updatePaginationInfo();

            console.log('Table refresh completed');
        }, 300);

        showNotification('Table view restored - newly added bays should be visible!', 'success');
    }
}

// Generate additional random bays for demonstration
function generateAdditionalBays() {
    const additionalBays = [];
    const statuses = ['available', 'occupied', 'maintenance', 'outside_branch'];
    const customers = ['ABC Corp', 'XYZ Ltd', 'Tech Solutions', 'Global Inc', 'Prime Co'];

    // Generate some random bays that aren't in the main table
    for (let i = 10; i <= 25; i++) {
        const bayNumber = `Bay ${i.toString().padStart(2, '0')}`;
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        additionalBays.push({
            id: `random-${i}`,
            number: bayNumber,
            status: status,
            customer: status === 'occupied' ? customers[Math.floor(Math.random() * customers.length)] : '',
            type: getBayType(status),
            lastUpdated: new Date().toISOString().split('T')[0]
        });
    }

    // Generate some section-specific bays
    const sections = ['A', 'B', 'C', 'D'];
    sections.forEach(section => {
        for (let i = 10; i <= 15; i++) {
            const bayNumber = `${section}${i.toString().padStart(2, '0')}`;
            const status = statuses[Math.floor(Math.random() * statuses.length)];

            additionalBays.push({
                id: `section-${section}-${i}`,
                number: bayNumber,
                status: status,
                customer: status === 'occupied' ? customers[Math.floor(Math.random() * customers.length)] : '',
                type: getBayType(status),
                lastUpdated: new Date().toISOString().split('T')[0]
            });
        }
    });

    return additionalBays;
}

// Load drag and drop layout
function loadDragDropLayout() {
    console.log('=== LOADING DRAG & DROP LAYOUT ===');

    // Get the unassigned container first
    const unassignedContainer = document.getElementById('unassignedBays');
    if (!unassignedContainer) {
        console.error('unassignedBays container not found!');
        // Try to find it by class name as fallback
        const fallbackContainer = document.querySelector('.unassigned-bays');
        if (fallbackContainer) {
            console.log('Found fallback container by class name');
            unassignedContainer = fallbackContainer;
        } else {
            console.error('No unassigned container found at all!');
            return;
        }
    }

    console.log('Found unassigned container:', unassignedContainer);

    // Clear all sections
    document.getElementById('sectionA-bays').innerHTML = '';
    document.getElementById('sectionB-bays').innerHTML = '';
    document.getElementById('sectionC-bays').innerHTML = '';
    document.getElementById('sectionD-bays').innerHTML = '';
    unassignedContainer.innerHTML = '';

    // Force add blocks directly to the unassigned section
    console.log('Adding bay blocks to unassigned section...');

    // Create NEW bay blocks that don't conflict with existing data
    // Existing bays: A1, Bay01-09, A01-A06, B01-B06, C01-C02
    const bayBlocksData = [
        // New Section A bays
        { name: 'A07', status: 'available' },
        { name: 'A08', status: 'available' },
        { name: 'A09', status: 'maintenance' },
        { name: 'A10', status: 'available' },

        // New Section B bays
        { name: 'B07', status: 'available' },
        { name: 'B08', status: 'occupied' },
        { name: 'B09', status: 'available' },
        { name: 'B10', status: 'maintenance' },

        // New Section C bays
        { name: 'C03', status: 'available' },
        { name: 'C04', status: 'occupied' },
        { name: 'C05', status: 'maintenance' },

        // New Section D bays (completely new section)
        { name: 'D01', status: 'available' },
        { name: 'D02', status: 'available' },
        { name: 'D03', status: 'occupied' },

        // New General bays
        { name: 'Bay 10', status: 'available' },
        { name: 'Bay 11', status: 'available' }
    ];

    bayBlocksData.forEach(bay => {
        const bayBlock = document.createElement('div');

        // Style to match the bay overview blocks
        const backgroundColor = bay.status === 'available' ? '#3b82f6' :
                               bay.status === 'occupied' ? '#e5e7eb' :
                               bay.status === 'maintenance' ? '#1e40af' : '#e5e7eb';

        const textColor = bay.status === 'available' ? 'white' :
                         bay.status === 'occupied' ? '#374151' :
                         bay.status === 'maintenance' ? 'white' : '#374151';

        bayBlock.style.cssText = `
            width: 80px;
            height: 80px;
            background-color: ${backgroundColor};
            color: ${textColor};
            border-radius: 4px;
            margin: 8px;
            padding: 8px;
            display: inline-flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            cursor: grab;
            font-family: Arial, sans-serif;
            font-size: 12px;
            font-weight: bold;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: transform 0.2s, box-shadow 0.2s;
            user-select: none;
        `;

        bayBlock.innerHTML = `
            <div style="font-size: 14px; margin-bottom: 4px;">${bay.name}</div>
            <div style="font-size: 10px; text-transform: uppercase;">${bay.status}</div>
        `;

        // Add drag functionality using the centralized function
        addDragFunctionalityToElement(bayBlock, bay);

        unassignedContainer.appendChild(bayBlock);
        console.log(`Added bay block: ${bay.name} (${bay.status})`);
    });

    console.log('Total bay blocks added:', unassignedContainer.children.length);

    // Setup drop zones for drag functionality
    setupDropZones();

    // Add simple click test for drop zones
    addDropZoneClickTest();

    // Show success notification
    showNotification(`${bayBlocksData.length} bay blocks loaded and ready to drag!`, 'success');
}

// Get expected type for section
function getExpectedTypeForSection(section) {
    switch(section) {
        case 'A': return 'Working';
        case 'B': return 'Outside Branch';
        case 'C': return 'Maintenance';
        case 'D': return 'Working';
        default: return 'Working';
    }
}

// Create draggable bay card
function createDraggableBayCard(bay) {
    const card = document.createElement('div');
    card.className = 'bay-block draggable-bay';
    card.draggable = true;
    card.dataset.bayId = bay.id;
    card.dataset.bayNumber = bay.number;

    const expectedSection = getBaySection(bay.number);
    const expectedType = getExpectedTypeForSection(expectedSection);
    const actualType = bay.type || getBayType(bay.status);

    if (expectedType !== actualType) {
        card.classList.add('wrong-section');
    }

    // Get status class and icon
    const statusClass = bay.status === 'available' ? 'status-available' :
                       bay.status === 'occupied' ? 'status-occupied' :
                       bay.status === 'maintenance' ? 'status-maintenance' : 'status-outside-branch';

    const statusIcon = bay.status === 'available' ? 'fas fa-check-circle' :
                      bay.status === 'occupied' ? 'fas fa-user' :
                      bay.status === 'maintenance' ? 'fas fa-tools' : 'fas fa-building';

    card.innerHTML = `
        <div class="bay-block-content">
            <div class="bay-block-header">
                <div class="bay-number">${bay.number}</div>
                <div class="bay-status-icon ${statusClass}">
                    <i class="${statusIcon}"></i>
                </div>
            </div>
            <div class="bay-block-info">
                <div class="bay-type">${bay.type || getBayType(bay.status)}</div>
                <div class="bay-status-text">${bay.status.replace('_', ' ').toUpperCase()}</div>
                ${bay.customer ? `<div class="bay-customer"><i class="fas fa-user"></i> ${bay.customer}</div>` : ''}
                ${expectedType !== actualType ? '<div class="wrong-section-indicator"><i class="fas fa-exclamation-triangle"></i> Misplaced</div>' : ''}
            </div>
            <div class="drag-handle">
                <i class="fas fa-grip-vertical"></i>
            </div>
        </div>
    `;

    // Add drag event listeners
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);

    return card;
}

// Add drag functionality to a specific element
function addDragFunctionalityToElement(element, bayData) {
    console.log('Adding drag functionality to element:', bayData.name || bayData.number);

    // Remove existing event listeners to avoid duplicates
    element.removeEventListener('dragstart', handleElementDragStart);
    element.removeEventListener('dragend', handleElementDragEnd);
    element.removeEventListener('mouseenter', handleElementMouseEnter);
    element.removeEventListener('mouseleave', handleElementMouseLeave);

    // Ensure element is draggable
    element.draggable = true;
    element.dataset.bayId = bayData.name || bayData.number;
    element.dataset.bayNumber = bayData.name || bayData.number;
    element.dataset.bayStatus = bayData.status;

    // Add hover effects
    function handleElementMouseEnter() {
        element.style.transform = 'scale(1.05)';
        element.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        element.style.cursor = 'grab';
    }

    function handleElementMouseLeave() {
        element.style.transform = 'scale(1)';
        element.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    }

    // Add drag functionality
    function handleElementDragStart(e) {
        console.log('=== ELEMENT DRAG START ===');
        console.log('Dragging bay:', bayData.name || bayData.number);

        // Store drag data globally for easy access
        window.currentDraggedBay = {
            name: bayData.name || bayData.number,
            number: bayData.name || bayData.number,
            status: bayData.status,
            element: element
        };

        // Also use the standard draggedBay variable
        draggedBay = window.currentDraggedBay;

        e.dataTransfer.setData('text/plain', bayData.name || bayData.number);
        element.style.opacity = '0.6';
        element.style.cursor = 'grabbing';

        console.log('Drag data set:', window.currentDraggedBay);
    }

    function handleElementDragEnd(e) {
        console.log('=== ELEMENT DRAG END ===');
        element.style.opacity = '1';
        element.style.cursor = 'grab';
    }

    // Add event listeners
    element.addEventListener('mouseenter', handleElementMouseEnter);
    element.addEventListener('mouseleave', handleElementMouseLeave);
    element.addEventListener('dragstart', handleElementDragStart);
    element.addEventListener('dragend', handleElementDragEnd);

    console.log('Drag functionality added to element');
}

// Setup drop zones
function setupDropZones() {
    console.log('Setting up drop zones...');

    const dropZones = document.querySelectorAll('.section-drop-zone, .unassigned-bays');
    console.log('Found drop zones:', dropZones.length);

    dropZones.forEach((zone, index) => {
        console.log(`Setting up drop zone ${index + 1}:`, zone.dataset.section || 'unassigned');

        // Remove existing listeners to avoid duplicates
        zone.removeEventListener('dragover', handleDragOver);
        zone.removeEventListener('drop', handleDrop);
        zone.removeEventListener('dragenter', handleDragEnter);
        zone.removeEventListener('dragleave', handleDragLeave);

        // Add fresh listeners
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('drop', handleDrop);
        zone.addEventListener('dragenter', handleDragEnter);
        zone.addEventListener('dragleave', handleDragLeave);

        // Add visual feedback for testing
        zone.style.minHeight = '100px';
        zone.style.border = '2px dashed transparent';
    });

    console.log('Drop zones setup completed');
}

// Add click test for drop zones
function addDropZoneClickTest() {
    console.log('Adding click test for drop zones...');

    const dropZones = document.querySelectorAll('.section-drop-zone');
    dropZones.forEach(zone => {
        zone.addEventListener('click', function() {
            const section = this.dataset.section;
            const type = this.dataset.type;
            console.log(`Drop zone clicked: Section ${section} (${type})`);
            showNotification(`Drop zone test: Section ${section} (${type}) is working!`, 'info');
        });

        // Make drop zones more visible for testing
        zone.style.border = '2px solid #e5e7eb';
        zone.style.borderRadius = '8px';
        zone.style.padding = '20px';
        zone.style.margin = '10px';
        zone.style.minHeight = '120px';
        zone.style.cursor = 'pointer';
    });
}

// Drag event handlers
function handleDragStart(e) {
    console.log('Drag started for:', e.target.dataset.bayNumber);

    draggedBay = {
        id: e.target.dataset.bayId,
        number: e.target.dataset.bayNumber,
        status: e.target.dataset.bayStatus,
        element: e.target
    };

    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', e.target.dataset.bayNumber);

    console.log('Dragged bay data:', draggedBay);
}

function handleDragEnd(e) {
    console.log('Drag ended for:', e.target.dataset.bayNumber);
    e.target.classList.remove('dragging');

    // Clean up drag-over classes
    document.querySelectorAll('.drag-over').forEach(el => {
        el.classList.remove('drag-over');
    });
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnter(e) {
    e.preventDefault();
    console.log('Drag enter on:', e.target.className);

    const dropZone = e.target.closest('.section-drop-zone') || e.target.closest('.unassigned-bays');
    if (dropZone) {
        dropZone.style.border = '2px dashed #3b82f6';
        dropZone.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';

        if (dropZone.classList.contains('section-drop-zone')) {
            const baySection = dropZone.closest('.bay-section');
            if (baySection) {
                baySection.classList.add('drag-over');
            }
        }
    }
}

function handleDragLeave(e) {
    const dropZone = e.target.closest('.section-drop-zone') || e.target.closest('.unassigned-bays');
    if (dropZone && !dropZone.contains(e.relatedTarget)) {
        dropZone.style.border = '2px dashed transparent';
        dropZone.style.backgroundColor = '';

        if (dropZone.classList.contains('section-drop-zone')) {
            const baySection = dropZone.closest('.bay-section');
            if (baySection) {
                baySection.classList.remove('drag-over');
            }
        }
    }
}

function handleDrop(e) {
    e.preventDefault();
    console.log('=== DROP EVENT TRIGGERED ===');
    console.log('Event target:', e.target);
    console.log('Dragged bay:', draggedBay);

    if (!draggedBay) {
        console.log('No dragged bay found!');
        return;
    }

    // Clean up visual feedback
    document.querySelectorAll('.drag-over').forEach(el => {
        el.classList.remove('drag-over');
    });

    const allDropZones = document.querySelectorAll('.section-drop-zone, .unassigned-bays');
    allDropZones.forEach(zone => {
        zone.style.border = '2px dashed transparent';
        zone.style.backgroundColor = '';
    });

    const dropZone = e.target.closest('.section-drop-zone') || e.target.closest('.unassigned-bays');
    if (!dropZone) {
        console.log('No valid drop zone found!');
        return;
    }

    const targetSection = dropZone.dataset.section;
    const targetType = dropZone.dataset.type;

    console.log('Drop zone found:', {
        section: targetSection,
        type: targetType,
        element: dropZone
    });

    // Create new bay data with Working type and Active status as default
    // Use the bay name from the dragged element or fallback to draggedBay.number
    const bayName = draggedBay.name || draggedBay.number || 'undefined';

    const newBay = {
        id: Date.now(),
        number: bayName,               // Use the actual bay name from the block
        status: 'available',           // Always set as available (Active in table)
        customer: null,
        shipment: null,
        description: `Service bay ${bayName}`,
        type: 'Working',               // Always set as Working type
        isActive: true                 // Always set as active
    };

    console.log('Creating new bay with name:', bayName, 'from draggedBay:', draggedBay);

    if (targetSection && targetType) {
        console.log(`Adding bay ${bayName} to pending changes for Section ${targetSection}`);

        // Add to pending changes instead of directly to table
        const changeId = Date.now();
        const pendingChange = {
            id: changeId,
            bayData: newBay,
            section: targetSection,
            type: 'Working',        // Always show as Working in pending changes
            action: 'add'
        };

        pendingChanges.push(pendingChange);
        console.log('Added to pending changes. Total pending:', pendingChanges.length);

        // Move element to target section visually
        const targetContainer = document.getElementById(`section${targetSection}-bays`);
        if (targetContainer && draggedBay.element) {
            targetContainer.appendChild(draggedBay.element);

            // Add visual indicator that this is pending
            draggedBay.element.classList.add('pending-change');
            draggedBay.element.dataset.changeId = changeId;

            // IMPORTANT: Re-add drag functionality to the moved element
            addDragFunctionalityToElement(draggedBay.element, draggedBay);

            console.log('Moved element to target section with pending indicator and restored drag functionality');
        }

        // Show and update the make changes section
        showMakeChangesSection();
        updateChangesList();

        showNotification(`📋 Bay ${bayName} added to pending changes as Working/Active. Click "Make Changes" to save to table.`, 'info');
    } else {
        console.log('Moved to unassigned area');

        // If dropped in unassigned area, move element back to unassigned container
        const unassignedContainer = document.getElementById('unassignedBays');
        if (unassignedContainer && draggedBay.element) {
            unassignedContainer.appendChild(draggedBay.element);

            // Remove any pending change indicators
            draggedBay.element.classList.remove('pending-change');
            draggedBay.element.removeAttribute('data-change-id');

            // Re-add drag functionality to ensure it works in unassigned area
            addDragFunctionalityToElement(draggedBay.element, draggedBay);

            console.log('Moved element back to unassigned area with restored drag functionality');
        }

        showNotification(`Bay ${bayName} moved back to unassigned area`, 'info');
    }

    // Reset dragged bay
    draggedBay = null;
    console.log('=== DROP COMPLETED ===');
}

// Show the make changes section
function showMakeChangesSection() {
    const makeChangesSection = document.getElementById('makeChangesSection');
    if (makeChangesSection && pendingChanges.length > 0) {
        makeChangesSection.style.display = 'block';
        console.log('Make changes section shown');
    }
}

// Hide the make changes section
function hideMakeChangesSection() {
    const makeChangesSection = document.getElementById('makeChangesSection');
    if (makeChangesSection) {
        makeChangesSection.style.display = 'none';
        console.log('Make changes section hidden');
    }
}

// Update the changes list display
function updateChangesList() {
    const changesList = document.getElementById('changesList');
    if (!changesList) return;

    if (pendingChanges.length === 0) {
        changesList.innerHTML = '<p style="color: #64748b; font-style: italic;">No pending changes</p>';
        hideMakeChangesSection();
        return;
    }

    const changesHTML = pendingChanges.map(change => `
        <div class="change-item" data-change-id="${change.id}">
            <div class="change-details">
                <span class="change-bay-number">${change.bayData.number}</span>
                <span class="change-arrow">→</span>
                <span class="change-section">Section ${change.section}</span>
                <span class="change-type">${change.type}</span>
            </div>
            <button class="btn-remove-change" onclick="removePendingChange(${change.id})" title="Remove this change">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');

    changesList.innerHTML = changesHTML;
    console.log('Changes list updated with', pendingChanges.length, 'changes');
}

// Remove a pending change
function removePendingChange(changeId) {
    console.log('Removing pending change:', changeId);

    // Find and remove from pending changes
    const changeIndex = pendingChanges.findIndex(change => change.id === changeId);
    if (changeIndex === -1) return;

    const removedChange = pendingChanges.splice(changeIndex, 1)[0];

    // Remove visual indicator from bay element
    const bayElement = document.querySelector(`[data-change-id="${changeId}"]`);
    if (bayElement) {
        bayElement.classList.remove('pending-change');
        bayElement.removeAttribute('data-change-id');

        // Move back to unassigned section
        const unassignedContainer = document.getElementById('unassignedBays');
        if (unassignedContainer) {
            unassignedContainer.appendChild(bayElement);
        }
    }

    // Update the changes list
    updateChangesList();

    showNotification(`Removed ${removedChange.bayData.number} from pending changes`, 'info');
}

// Cancel all changes
function cancelChanges() {
    console.log('Cancelling all pending changes');

    // Remove visual indicators and move bays back to unassigned
    pendingChanges.forEach(change => {
        const bayElement = document.querySelector(`[data-change-id="${change.id}"]`);
        if (bayElement) {
            bayElement.classList.remove('pending-change');
            bayElement.removeAttribute('data-change-id');

            // Move back to unassigned section
            const unassignedContainer = document.getElementById('unassignedBays');
            if (unassignedContainer) {
                unassignedContainer.appendChild(bayElement);
            }
        }
    });

    // Clear pending changes
    pendingChanges = [];

    // Hide make changes section
    hideMakeChangesSection();

    showNotification('All pending changes cancelled', 'info');
}

// Apply all pending changes to the table
function makeChanges() {
    console.log('Applying', pendingChanges.length, 'pending changes to table');

    if (pendingChanges.length === 0) {
        showNotification('No pending changes to apply', 'warning');
        return;
    }

    // Apply each pending change
    let addedCount = 0;
    pendingChanges.forEach(change => {
        const newBay = change.bayData;

        // Check if bay already exists to avoid duplicates
        const existingBay = baysData.find(b => b.number === newBay.number);
        if (!existingBay) {
            // Add to main baysData array (source data for table)
            baysData.push(newBay);
            console.log('Added to baysData. New length:', baysData.length);

            // Add to filteredBays array (what table displays)
            filteredBays.push(newBay);
            console.log('Added to filteredBays. New length:', filteredBays.length);

            addedCount++;
            console.log(`Applied change: Bay ${newBay.number} added to Section ${change.section} as ${change.type}`);
        } else {
            console.log('Bay already exists, skipping:', newBay.number);
        }
    });

    // Remove visual indicators
    pendingChanges.forEach(change => {
        const bayElement = document.querySelector(`[data-change-id="${change.id}"]`);
        if (bayElement) {
            bayElement.classList.remove('pending-change');
            bayElement.removeAttribute('data-change-id');
        }
    });

    // Clear pending changes
    pendingChanges = [];

    // Hide make changes section
    hideMakeChangesSection();

    // Refresh the table if we're in table view
    if (!isDragDropMode) {
        console.log('Refreshing table after applying changes...');
        loadBayConfigTable(); // Use the correct table refresh function
        updateBayStatistics();
        updatePaginationInfo();
    }

    // Show success message
    showNotification(`✅ Successfully added ${addedCount} bay(s) to the table!`, 'success');

    console.log('All changes applied successfully');
}

// Sync bay changes back to main data
function syncBayToMainData(updatedBay) {
    // Find and update in main bays array
    const mainBayIndex = bays.findIndex(bay => bay.id === updatedBay.id);
    if (mainBayIndex !== -1) {
        bays[mainBayIndex] = { ...updatedBay };
    } else {
        // If it's a new bay (from additional bays), add it to main data
        bays.push(updatedBay);
    }

    // Update filtered bays as well
    const filteredIndex = filteredBays.findIndex(bay => bay.id === updatedBay.id);
    if (filteredIndex !== -1) {
        filteredBays[filteredIndex] = { ...updatedBay };
    } else {
        filteredBays.push(updatedBay);
    }

    // Update baysData (used in drag & drop)
    const baysDataIndex = baysData.findIndex(bay => bay.id === updatedBay.id);
    if (baysDataIndex !== -1) {
        baysData[baysDataIndex] = { ...updatedBay };
    } else {
        baysData.push(updatedBay);
    }

    // Save to localStorage for persistence
    localStorage.setItem('bayData', JSON.stringify(bays));

    console.log('Bay synced to main data:', updatedBay.number);
}

// Generate new bay number for section
function generateNewBayNumber(section, currentNumber) {
    // If already in correct section format, keep it
    if (currentNumber.startsWith(section)) {
        return currentNumber;
    }

    // Find next available number in section
    const existingNumbers = baysData
        .filter(b => b.number.startsWith(section))
        .map(b => {
            const match = b.number.match(/\d+/);
            return match ? parseInt(match[0]) : 0;
        });

    const nextNumber = Math.max(0, ...existingNumbers) + 1;
    return `${section}${nextNumber.toString().padStart(2, '0')}`;
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Only activate shortcuts when not typing in input fields
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
        return;
    }

    // Ctrl+A - Select all visible bays
    if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        const selectAll = document.getElementById('selectAll');
        if (selectAll) {
            selectAll.checked = true;
            toggleSelectAll();
        }
    }

    // Ctrl+D - Deselect all
    if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        const selectAll = document.getElementById('selectAll');
        if (selectAll) {
            selectAll.checked = false;
            toggleSelectAll();
        }
    }

    // Ctrl+F - Quick search
    if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        quickSearch();
    }

    // Ctrl+R - Refresh
    if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        refreshBays();
    }

    // Escape - Clear filters
    if (e.key === 'Escape') {
        clearColumnFilters();
    }
});

// Auto-save functionality for form data
function autoSaveFormData() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                localStorage.setItem(`bay-form-${form.id}`, JSON.stringify(data));
            });
        });
    });
}

// Restore form data
function restoreFormData(formId) {
    const savedData = localStorage.getItem(`bay-form-${formId}`);
    if (savedData) {
        const data = JSON.parse(savedData);
        const form = document.getElementById(formId);
        if (form) {
            Object.keys(data).forEach(key => {
                const input = form.querySelector(`[name="${key}"]`);
                if (input) {
                    input.value = data[key];
                }
            });
        }
    }
}

// Clear saved form data
function clearSavedFormData(formId) {
    localStorage.removeItem(`bay-form-${formId}`);
}

// Enhanced pagination
let currentPageNumber = 1;
let itemsPerPage = 10;

function goToPage(pageNumber) {
    const totalPages = Math.ceil(filteredBays.length / itemsPerPage);

    if (pageNumber < 1 || pageNumber > totalPages) {
        return;
    }

    currentPageNumber = pageNumber;
    loadBayLayout();
    updatePaginationInfo();
}

function nextPage() {
    const totalPages = Math.ceil(filteredBays.length / itemsPerPage);
    if (currentPageNumber < totalPages) {
        goToPage(currentPageNumber + 1);
    }
}

function previousPage() {
    if (currentPageNumber > 1) {
        goToPage(currentPageNumber - 1);
    }
}

// Enhanced export functionality
function exportSelectedBays() {
    const selectedCheckboxes = document.querySelectorAll('.bay-checkbox:checked');

    if (selectedCheckboxes.length === 0) {
        showNotification('Please select bays to export!', 'warning');
        return;
    }

    const selectedIds = Array.from(selectedCheckboxes).map(cb => parseInt(cb.value));
    const selectedBays = baysData.filter(bay => selectedIds.includes(bay.id));

    const csvContent = generateBayConfigCSV(selectedBays);
    downloadCSV(csvContent, `selected-bays-${new Date().toISOString().split('T')[0]}.csv`);
    showNotification(`${selectedBays.length} selected bay(s) exported successfully!`, 'success');
}

// Download CSV helper function
function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Initialize enhanced functionality
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('bay-management.html')) {
        autoSaveFormData();

        // Add keyboard shortcut hints
        console.log('Bay Management Keyboard Shortcuts:');
        console.log('Ctrl+A: Select all visible bays');
        console.log('Ctrl+D: Deselect all bays');
        console.log('Ctrl+F: Quick search');
        console.log('Ctrl+R: Refresh data');
        console.log('Escape: Clear all filters');
    }
});
