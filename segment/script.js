// Global variables
let currentPrimarySegment = '';
let currentSegments = [];
let filteredSegments = [];
let currentPage = 1;
let itemsPerPage = 10;
let selectedSegments = new Set();
let searchFilters = [];
let advancedSearchActive = false;

// DOM elements
const primarySegmentSelect = document.getElementById('primarySegmentSelect');
const secondarySection = document.getElementById('secondarySection');
const segmentsTableBody = document.getElementById('segmentsTableBody');
const searchContainer = document.getElementById('searchContainer');
const searchInput = document.getElementById('searchInput');
const addModal = document.getElementById('addModal');
const addSegmentForm = document.getElementById('addSegmentForm');
const advancedSearchModal = document.getElementById('advancedSearchModal');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updatePagination();
});

// Event listeners
function initializeEventListeners() {
    // Primary segment selection
    primarySegmentSelect.addEventListener('change', handlePrimarySegmentChange);

    // Action buttons
    document.getElementById('addBtn').addEventListener('click', showAddModal);
    document.getElementById('deleteBtn').addEventListener('click', handleDeleteSelected);
    document.getElementById('saveBtn').addEventListener('click', handleSave);
    document.getElementById('searchBtn').addEventListener('click', showAdvancedSearch);
    document.getElementById('exportBtn').addEventListener('click', handleExport);
    document.getElementById('refreshBtn').addEventListener('click', handleRefresh);

    // Search functionality
    searchInput.addEventListener('input', handleSearch);
    document.getElementById('clearSearch').addEventListener('click', clearSearch);

    // Modal controls
    document.getElementById('closeModal').addEventListener('click', hideAddModal);
    document.getElementById('cancelAdd').addEventListener('click', hideAddModal);
    document.getElementById('confirmAdd').addEventListener('click', handleAddSegment);

    // Advanced search modal controls
    document.getElementById('closeAdvancedSearch').addEventListener('click', hideAdvancedSearch);
    document.getElementById('cancelAdvancedSearch').addEventListener('click', hideAdvancedSearch);
    document.getElementById('applyAdvancedSearch').addEventListener('click', applyAdvancedSearch);
    document.getElementById('clearAdvancedSearch').addEventListener('click', clearAdvancedSearch);

    // Pagination
    document.getElementById('prevPage').addEventListener('click', () => changePage(currentPage - 1));
    document.getElementById('nextPage').addEventListener('click', () => changePage(currentPage + 1));
    document.getElementById('itemsPerPage').addEventListener('change', handleItemsPerPageChange);

    // Select all checkbox
    document.getElementById('selectAll').addEventListener('change', handleSelectAll);

    // Close modal when clicking outside
    addModal.addEventListener('click', function(e) {
        if (e.target === addModal) {
            hideAddModal();
        }
    });

    advancedSearchModal.addEventListener('click', function(e) {
        if (e.target === advancedSearchModal) {
            hideAdvancedSearch();
        }
    });

    // Initialize advanced search functionality
    initializeAdvancedSearch();
}

// Handle primary segment change
function handlePrimarySegmentChange() {
    currentPrimarySegment = primarySegmentSelect.value;

    if (currentPrimarySegment) {
        currentSegments = getSegments(currentPrimarySegment);
        filteredSegments = [...currentSegments];
        currentPage = 1;
        selectedSegments.clear();

        secondarySection.style.display = 'block';
        renderTable();
        updatePagination();
        updateDeleteButton();
    } else {
        secondarySection.style.display = 'none';
    }
}

// Render the segments table
function renderTable() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageSegments = filteredSegments.slice(startIndex, endIndex);

    segmentsTableBody.innerHTML = '';

    pageSegments.forEach(segment => {
        const row = createTableRow(segment);
        segmentsTableBody.appendChild(row);
    });

    updateSelectAllCheckbox();
}

// Create a table row for a segment
function createTableRow(segment) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <input type="checkbox" class="segment-checkbox" data-id="${segment.id}"
                   ${selectedSegments.has(segment.id) ? 'checked' : ''}>
        </td>
        <td>
            <button class="action-btn edit-btn" onclick="editSegment(${segment.id})">
                <i class="fas fa-edit"></i>
            </button>
        </td>
        <td>
            <button class="action-btn delete-btn" onclick="deleteSegment(${segment.id})">
                <i class="fas fa-trash"></i>
            </button>
        </td>
        <td>
            <input type="text" value="${segment.name}"
                   onblur="updateSegmentName(${segment.id}, this.value)"
                   onkeypress="handleEnterKey(event, ${segment.id}, this.value)">
        </td>
        <td>
            <span class="status-badge ${segment.isActive ? 'status-active' : 'status-inactive'}"
                  onclick="toggleSegmentStatus(${segment.id})">
                ${segment.isActive ? 'Yes' : 'No'}
            </span>
        </td>
    `;

    // Add event listener for checkbox
    const checkbox = row.querySelector('.segment-checkbox');
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            selectedSegments.add(segment.id);
        } else {
            selectedSegments.delete(segment.id);
        }
        updateDeleteButton();
        updateSelectAllCheckbox();
    });

    return row;
}

// Handle Enter key in input fields
function handleEnterKey(event, segmentId, value) {
    if (event.key === 'Enter') {
        updateSegmentName(segmentId, value);
        event.target.blur();
    }
}

// Update segment name
function updateSegmentName(segmentId, newName) {
    if (newName.trim()) {
        updateSegment(currentPrimarySegment, segmentId, { name: newName.trim() });
        currentSegments = getSegments(currentPrimarySegment);
        applyCurrentFilter();
    }
}

// Toggle segment status
function toggleSegmentStatus(segmentId) {
    const segment = currentSegments.find(s => s.id === segmentId);
    if (segment) {
        updateSegment(currentPrimarySegment, segmentId, { isActive: !segment.isActive });
        currentSegments = getSegments(currentPrimarySegment);
        applyCurrentFilter();
    }
}

// Edit segment (focus on name input)
function editSegment(segmentId) {
    const row = document.querySelector(`input[data-id="${segmentId}"]`).closest('tr');
    const nameInput = row.querySelector('input[type="text"]');
    nameInput.focus();
    nameInput.select();
}

// Delete single segment
function deleteSegment(segmentId) {
    if (confirm('Are you sure you want to delete this segment?')) {
        deleteSegments(currentPrimarySegment, [segmentId]);
        currentSegments = getSegments(currentPrimarySegment);
        selectedSegments.delete(segmentId);
        applyCurrentFilter();
        updateDeleteButton();
    }
}

// Handle delete selected segments
function handleDeleteSelected() {
    if (selectedSegments.size === 0) return;

    if (confirm(`Are you sure you want to delete ${selectedSegments.size} selected segment(s)?`)) {
        deleteSegments(currentPrimarySegment, Array.from(selectedSegments));
        currentSegments = getSegments(currentPrimarySegment);
        selectedSegments.clear();
        applyCurrentFilter();
        updateDeleteButton();
    }
}

// Handle select all checkbox
function handleSelectAll() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.segment-checkbox');

    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
        const segmentId = parseInt(checkbox.dataset.id);

        if (selectAllCheckbox.checked) {
            selectedSegments.add(segmentId);
        } else {
            selectedSegments.delete(segmentId);
        }
    });

    updateDeleteButton();
}

// Update select all checkbox state
function updateSelectAllCheckbox() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.segment-checkbox');
    const checkedCheckboxes = document.querySelectorAll('.segment-checkbox:checked');

    if (checkboxes.length === 0) {
        selectAllCheckbox.indeterminate = false;
        selectAllCheckbox.checked = false;
    } else if (checkedCheckboxes.length === checkboxes.length) {
        selectAllCheckbox.indeterminate = false;
        selectAllCheckbox.checked = true;
    } else if (checkedCheckboxes.length > 0) {
        selectAllCheckbox.indeterminate = true;
        selectAllCheckbox.checked = false;
    } else {
        selectAllCheckbox.indeterminate = false;
        selectAllCheckbox.checked = false;
    }
}

// Update delete button state
function updateDeleteButton() {
    const deleteBtn = document.getElementById('deleteBtn');
    deleteBtn.disabled = selectedSegments.size === 0;
}

// Show add modal
function showAddModal() {
    addModal.style.display = 'block';
    document.getElementById('segmentName').focus();
}

// Hide add modal
function hideAddModal() {
    addModal.style.display = 'none';
    addSegmentForm.reset();
}

// Handle add segment
function handleAddSegment() {
    const formData = new FormData(addSegmentForm);
    const segmentName = formData.get('segmentName').trim();
    const isActive = formData.get('isActive') === 'true';

    if (segmentName) {
        addSegment(currentPrimarySegment, segmentName, isActive);
        currentSegments = getSegments(currentPrimarySegment);
        applyCurrentFilter();
        hideAddModal();

        // Show success message
        showNotification('Segment added successfully!', 'success');
    }
}

// Handle save
function handleSave() {
    showNotification('Changes saved successfully!', 'success');
}

// Toggle search (keep for backward compatibility)
function toggleSearch() {
    const isVisible = searchContainer.style.display !== 'none';
    searchContainer.style.display = isVisible ? 'none' : 'block';

    if (!isVisible) {
        searchInput.focus();
    } else {
        clearSearch();
    }
}

// Handle search
function handleSearch() {
    const searchTerm = searchInput.value.trim();
    filteredSegments = searchSegments(currentPrimarySegment, searchTerm);
    currentPage = 1;
    renderTable();
    updatePagination();
}

// Clear search
function clearSearch() {
    searchInput.value = '';
    filteredSegments = [...currentSegments];
    currentPage = 1;
    renderTable();
    updatePagination();
}

// Apply current filter (used after data changes)
function applyCurrentFilter() {
    const searchTerm = searchInput.value.trim();
    filteredSegments = searchSegments(currentPrimarySegment, searchTerm);

    // Adjust current page if necessary
    const totalPages = Math.ceil(filteredSegments.length / itemsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
    }

    renderTable();
    updatePagination();
}

// Handle export
function handleExport() {
    const csvContent = exportSegments(currentPrimarySegment);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentPrimarySegment}_segments.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    showNotification('Export completed successfully!', 'success');
}

// Handle refresh
function handleRefresh() {
    // Simulate refresh by reloading current data
    currentSegments = getSegments(currentPrimarySegment);
    selectedSegments.clear();
    applyCurrentFilter();
    updateDeleteButton();

    showNotification('Data refreshed successfully!', 'info');
}

// Pagination functions
function changePage(newPage) {
    const totalPages = Math.ceil(filteredSegments.length / itemsPerPage);
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderTable();
        updatePagination();
    }
}

function handleItemsPerPageChange() {
    itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);
    currentPage = 1;
    renderTable();
    updatePagination();
}

function updatePagination() {
    const totalItems = filteredSegments.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    document.getElementById('paginationInfo').textContent =
        `View ${startItem} - ${endItem} of ${totalItems}`;
    document.getElementById('currentPage').textContent = currentPage;
    document.getElementById('totalPages').textContent = totalPages;

    document.getElementById('prevPage').disabled = currentPage <= 1;
    document.getElementById('nextPage').disabled = currentPage >= totalPages;
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #000000;
        color: #ffffff;
        border: 2px solid #000000;
        padding: 15px 20px;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1001;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);

// Advanced Search Functions
function initializeAdvancedSearch() {
    // Add event listeners for add/remove filter buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-filter-btn')) {
            addSearchFilter();
        } else if (e.target.classList.contains('remove-filter-btn')) {
            removeSearchFilter(e.target);
        }
    });
}

function showAdvancedSearch() {
    advancedSearchModal.style.display = 'block';
    resetAdvancedSearchForm();
}

function hideAdvancedSearch() {
    advancedSearchModal.style.display = 'none';
}

function resetAdvancedSearchForm() {
    searchFilters = [];
    const searchCriteria = document.getElementById('searchCriteria');
    searchCriteria.innerHTML = `
        <div class="search-row">
            <div class="form-row">
                <div class="form-col">
                    <label>Select Column:</label>
                    <select class="search-column">
                        <option value="">--Select--</option>
                        <option value="name">Secondary Segment</option>
                        <option value="isActive">Is Active</option>
                    </select>
                </div>
                <div class="form-col">
                    <label>Select Operator:</label>
                    <select class="search-operator">
                        <option value="">--Select--</option>
                        <option value="contains">Contains</option>
                        <option value="equals">Equals</option>
                        <option value="startsWith">Starts With</option>
                        <option value="endsWith">Ends With</option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-col">
                    <label>Value:</label>
                    <input type="text" class="search-value" placeholder="Enter value">
                </div>
                <div class="form-col">
                    <label>Select Condition:</label>
                    <select class="search-condition">
                        <option value="">--Select--</option>
                        <option value="and">AND</option>
                        <option value="or">OR</option>
                    </select>
                </div>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-primary add-filter-btn">Add Filter</button>
                <button type="button" class="btn btn-danger remove-filter-btn">Remove Filter</button>
            </div>
        </div>
    `;
    document.getElementById('searchResults').value = '';
}

function addSearchFilter() {
    const searchRows = document.querySelectorAll('.search-row');
    const lastRow = searchRows[searchRows.length - 1];

    // Get values from the current row
    const column = lastRow.querySelector('.search-column').value;
    const operator = lastRow.querySelector('.search-operator').value;
    const value = lastRow.querySelector('.search-value').value;
    const condition = lastRow.querySelector('.search-condition').value;

    if (!column || !operator || !value.trim()) {
        showNotification('Please fill in all required fields (Column, Operator, Value)', 'error');
        return;
    }

    // Add to filters array
    const filter = {
        column: column,
        operator: operator,
        value: value.trim(),
        condition: condition
    };

    searchFilters.push(filter);

    // Update search results display
    updateSearchResultsDisplay();

    // Add new search row if condition is selected
    if (condition) {
        addNewSearchRow();
    }
}

function addNewSearchRow() {
    const searchCriteria = document.getElementById('searchCriteria');
    const newRow = document.createElement('div');
    newRow.className = 'search-row';
    newRow.innerHTML = `
        <div class="form-row">
            <div class="form-col">
                <label>Select Column:</label>
                <select class="search-column">
                    <option value="">--Select--</option>
                    <option value="name">Secondary Segment</option>
                    <option value="isActive">Is Active</option>
                </select>
            </div>
            <div class="form-col">
                <label>Select Operator:</label>
                <select class="search-operator">
                    <option value="">--Select--</option>
                    <option value="contains">Contains</option>
                    <option value="equals">Equals</option>
                    <option value="startsWith">Starts With</option>
                    <option value="endsWith">Ends With</option>
                </select>
            </div>
        </div>
        <div class="form-row">
            <div class="form-col">
                <label>Value:</label>
                <input type="text" class="search-value" placeholder="Enter value">
            </div>
            <div class="form-col">
                <label>Select Condition:</label>
                <select class="search-condition">
                    <option value="">--Select--</option>
                    <option value="and">AND</option>
                    <option value="or">OR</option>
                </select>
            </div>
        </div>
        <div class="form-actions">
            <button type="button" class="btn btn-primary add-filter-btn">Add Filter</button>
            <button type="button" class="btn btn-danger remove-filter-btn">Remove Filter</button>
        </div>
    `;
    searchCriteria.appendChild(newRow);
}

function removeSearchFilter(button) {
    const searchRows = document.querySelectorAll('.search-row');
    if (searchRows.length > 1) {
        const row = button.closest('.search-row');
        row.remove();

        // Remove the last filter from the array
        if (searchFilters.length > 0) {
            searchFilters.pop();
            updateSearchResultsDisplay();
        }
    } else {
        showNotification('At least one search row must remain', 'error');
    }
}

function updateSearchResultsDisplay() {
    const searchResults = document.getElementById('searchResults');
    let displayText = '';

    searchFilters.forEach((filter, index) => {
        if (index > 0) {
            displayText += ` ${searchFilters[index - 1].condition.toUpperCase()} `;
        }
        displayText += `${filter.column} ${filter.operator} "${filter.value}"`;
    });

    searchResults.value = displayText;
}

function applyAdvancedSearch() {
    if (searchFilters.length === 0) {
        showNotification('Please add at least one search filter', 'error');
        return;
    }

    // Apply the advanced search filters
    filteredSegments = currentSegments.filter(segment => {
        return evaluateSearchFilters(segment, searchFilters);
    });

    advancedSearchActive = true;
    currentPage = 1;
    renderTable();
    updatePagination();
    hideAdvancedSearch();

    showNotification(`Advanced search applied. Found ${filteredSegments.length} results.`, 'success');
}

function evaluateSearchFilters(segment, filters) {
    if (filters.length === 0) return true;

    let result = evaluateFilter(segment, filters[0]);

    for (let i = 1; i < filters.length; i++) {
        const condition = filters[i - 1].condition;
        const filterResult = evaluateFilter(segment, filters[i]);

        if (condition === 'and') {
            result = result && filterResult;
        } else if (condition === 'or') {
            result = result || filterResult;
        }
    }

    return result;
}

function evaluateFilter(segment, filter) {
    let segmentValue = '';

    if (filter.column === 'name') {
        segmentValue = segment.name.toLowerCase();
    } else if (filter.column === 'isActive') {
        segmentValue = segment.isActive ? 'yes' : 'no';
    }

    const filterValue = filter.value.toLowerCase();

    switch (filter.operator) {
        case 'contains':
            return segmentValue.includes(filterValue);
        case 'equals':
            return segmentValue === filterValue;
        case 'startsWith':
            return segmentValue.startsWith(filterValue);
        case 'endsWith':
            return segmentValue.endsWith(filterValue);
        default:
            return false;
    }
}

function clearAdvancedSearch() {
    searchFilters = [];
    advancedSearchActive = false;
    filteredSegments = [...currentSegments];
    currentPage = 1;
    renderTable();
    updatePagination();
    resetAdvancedSearchForm();

    showNotification('Advanced search cleared', 'info');
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear any stored data
        selectedSegments.clear();

        // Show logout message
        showNotification('Logged out successfully', 'success');

        // In a real application, you would redirect to login page
        // window.location.href = '/login';

        // For demo purposes, just reload the page after a short delay
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }
}
