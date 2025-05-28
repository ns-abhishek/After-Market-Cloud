// Sample data for OEM Order Classes
const orderClasses = [
    {
        id: 1,
        description: "Class A",
        considerForDemand: false,
        assetValidate: false,
        isActive: false
    },
    {
        id: 2,
        description: "Class B",
        considerForDemand: false,
        assetValidate: false,
        isActive: false
    },
    {
        id: 3,
        description: "Class C",
        considerForDemand: false,
        assetValidate: false,
        isActive: false
    },
    {
        id: 4,
        description: "Replenishment Order-YTA (WKL)",
        considerForDemand: true,
        assetValidate: true,
        isActive: true
    },
    {
        id: 5,
        description: "Rush Order-YSO (RUS)",
        considerForDemand: true,
        assetValidate: true,
        isActive: true
    },
    {
        id: 6,
        description: "Service Instruction Tool-YKD (YKD)",
        considerForDemand: true,
        assetValidate: false,
        isActive: true
    },
    {
        id: 7,
        description: "Test Supplier Order Class",
        considerForDemand: false,
        assetValidate: false,
        isActive: false
    },
    {
        id: 8,
        description: "Yearly Indent-YEA (STK)",
        considerForDemand: true,
        assetValidate: false,
        isActive: true
    }
];

// Dummy manufacturer data
const manufacturerData = {
    'Class A': [
        { id: 1, manufacturer: 'Toyota Motors', priceType: 'Standard', leadTime: '7 days', discount: '15%' },
        { id: 2, manufacturer: 'Honda Corp', priceType: 'Premium', leadTime: '5 days', discount: '12%' },
        { id: 3, manufacturer: 'Ford Motors', priceType: 'Economy', leadTime: '10 days', discount: '18%' },
        { id: 4, manufacturer: 'BMW Group', priceType: 'Luxury', leadTime: '14 days', discount: '8%' },
        { id: 5, manufacturer: 'Mercedes-Benz', priceType: 'Premium', leadTime: '12 days', discount: '10%' },
        { id: 6, manufacturer: 'Audi AG', priceType: 'Luxury', leadTime: '16 days', discount: '9%' },
        { id: 7, manufacturer: 'Volkswagen', priceType: 'Standard', leadTime: '8 days', discount: '14%' },
        { id: 8, manufacturer: 'Nissan Motors', priceType: 'Economy', leadTime: '9 days', discount: '16%' },
        { id: 9, manufacturer: 'Hyundai Motors', priceType: 'Standard', leadTime: '6 days', discount: '17%' },
        { id: 10, manufacturer: 'Kia Motors', priceType: 'Economy', leadTime: '7 days', discount: '19%' },
        { id: 11, manufacturer: 'Mazda Corporation', priceType: 'Premium', leadTime: '11 days', discount: '11%' },
        { id: 12, manufacturer: 'Subaru Corporation', priceType: 'Standard', leadTime: '13 days', discount: '13%' },
        { id: 13, manufacturer: 'Mitsubishi Motors', priceType: 'Economy', leadTime: '15 days', discount: '20%' },
        { id: 14, manufacturer: 'Lexus Division', priceType: 'Luxury', leadTime: '18 days', discount: '7%' },
        { id: 15, manufacturer: 'Infiniti Motors', priceType: 'Premium', leadTime: '17 days', discount: '8%' }
    ],
    'Class B': [
        { id: 1, manufacturer: 'Nissan Motors', priceType: 'Standard', leadTime: '6 days', discount: '14%' },
        { id: 2, manufacturer: 'Hyundai Motors', priceType: 'Economy', leadTime: '8 days', discount: '16%' },
        { id: 3, manufacturer: 'Mercedes-Benz', priceType: 'Luxury', leadTime: '12 days', discount: '10%' }
    ],
    'Class C': [
        { id: 1, manufacturer: 'Volkswagen', priceType: 'Standard', leadTime: '9 days', discount: '13%' },
        { id: 2, manufacturer: 'Audi AG', priceType: 'Premium', leadTime: '11 days', discount: '11%' }
    ],
    'Replenishment Order-YTA (WKL)': [
        { id: 1, manufacturer: 'Caterpillar Inc', priceType: 'Industrial', leadTime: '21 days', discount: '20%' },
        { id: 2, manufacturer: 'John Deere', priceType: 'Agricultural', leadTime: '18 days', discount: '22%' },
        { id: 3, manufacturer: 'Komatsu Ltd', priceType: 'Heavy Duty', leadTime: '25 days', discount: '19%' }
    ],
    'Rush Order-YSO (RUS)': [
        { id: 1, manufacturer: 'Express Parts Co', priceType: 'Rush', leadTime: '2 days', discount: '5%' },
        { id: 2, manufacturer: 'Quick Supply Ltd', priceType: 'Emergency', leadTime: '1 day', discount: '3%' }
    ]
};

let selectedItems = new Set();
let currentEditingId = null;
let currentManufacturers = [];
let filteredManufacturers = [];
let isEditMode = false;

// Pagination variables
let currentPage = 1;
let itemsPerPage = 8;
let totalPages = 1;

// Search variables
let currentSearchFilters = null;
let filteredOrderClasses = [...orderClasses];

// Manufacturer editing variables
let currentEditingManufacturerId = null;

// DOM Elements
const cardsContainer = document.getElementById('cardsContainer');
const newOrderBtn = document.getElementById('newOrderBtn');
const deleteBtn = document.getElementById('deleteBtn');
const refreshBtn = document.getElementById('refreshBtn');
const exportBtn = document.getElementById('exportBtn');
const advanceSearchBtn = document.getElementById('advanceSearchBtn');
const selectAllCheckbox = document.getElementById('selectAll');

// Modal elements
const modalOverlay = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');
const modalClose = document.getElementById('modalClose');
const modalCancel = document.getElementById('modalCancel');
const modalSave = document.getElementById('modalSave');
const orderClassForm = document.getElementById('orderClassForm');

// View modal elements
const viewModalOverlay = document.getElementById('viewModalOverlay');
const viewModalClose = document.getElementById('viewModalClose');
const viewModalExit = document.getElementById('viewModalExit');
const viewModalEdit = document.getElementById('viewModalEdit');
const viewModalCancel = document.getElementById('viewModalCancel');
const viewModalSave = document.getElementById('viewModalSave');

// Manufacturer search element (in view modal)
const manufacturerViewSearch = document.getElementById('manufacturerViewSearch');

// Manufacturer modal elements
const manufacturerModalOverlay = document.getElementById('manufacturerModalOverlay');
const manufacturerModalClose = document.getElementById('manufacturerModalClose');
const manufacturerModalCancel = document.getElementById('manufacturerModalCancel');
const manufacturerModalSave = document.getElementById('manufacturerModalSave');
const manufacturerForm = document.getElementById('manufacturerForm');
const addManufacturerBtn = document.getElementById('addManufacturerBtn');

// Dashboard functionality
let currentFilter = null;
let sampleData = [...orderClasses]; // Use orderClasses as sample data
let filteredData = [...orderClasses];

// Sorting functionality
let currentSort = null; // 'asc', 'desc', or null

// Initialize dashboard
function initializeDashboard() {
    updateDashboardStats();
    setupDashboardClickHandlers();
    setupSortControls();
}

// Update dashboard statistics
function updateDashboardStats() {
    const demandYes = sampleData.filter(item => item.considerForDemand === true).length;
    const demandNo = sampleData.filter(item => item.considerForDemand === false).length;
    const validateYes = sampleData.filter(item => item.assetValidate === true).length;
    const validateNo = sampleData.filter(item => item.assetValidate === false).length;
    const activeYes = sampleData.filter(item => item.isActive === true).length;
    const activeNo = sampleData.filter(item => item.isActive === false).length;
    const total = sampleData.length;

    // Update demand card
    document.getElementById('demandYesCount').textContent = demandYes;
    document.getElementById('demandNoCount').textContent = demandNo;
    document.getElementById('demandPercentage').textContent = `${Math.round((demandYes / total) * 100)}% Yes`;

    // Update validate card
    document.getElementById('validateYesCount').textContent = validateYes;
    document.getElementById('validateNoCount').textContent = validateNo;
    document.getElementById('validatePercentage').textContent = `${Math.round((validateYes / total) * 100)}% Yes`;

    // Update active card
    document.getElementById('activeYesCount').textContent = activeYes;
    document.getElementById('activeNoCount').textContent = activeNo;
    document.getElementById('activePercentage').textContent = `${Math.round((activeYes / total) * 100)}% Yes`;

    // Update total card
    document.getElementById('totalCount').textContent = total;
    document.getElementById('totalPages').textContent = `${Math.ceil(total / itemsPerPage)} Pages`;
}

// Setup dashboard click handlers
function setupDashboardClickHandlers() {
    // Handle clicks on stat items (YES/NO numbers)
    document.addEventListener('click', (e) => {
        const statItem = e.target.closest('.stat-item.clickable');
        if (statItem) {
            e.stopPropagation();
            const filterType = statItem.getAttribute('data-filter');
            const filterValue = statItem.getAttribute('data-value');
            applyDirectFilter(filterType, filterValue, statItem);
            return;
        }

        // Handle clicks on dashboard cards (excluding total card)
        const dashboardCard = e.target.closest('.dashboard-card:not(#totalCard)');
        if (dashboardCard) {
            // Don't trigger if clicking on clickable stat items
            if (e.target.closest('.stat-item.clickable')) {
                return;
            }

            e.stopPropagation();
            const filterType = dashboardCard.getAttribute('data-filter');
            if (filterType) {
                // Default to "yes" filter when clicking on card area
                const yesStatItem = dashboardCard.querySelector('.stat-item.clickable[data-value="yes"]');
                if (yesStatItem) {
                    applyDirectFilter(filterType, 'yes', yesStatItem);
                }
            }
            return;
        }

        // Handle clicks on total card
        const totalCard = e.target.closest('#totalCard');
        if (totalCard) {
            clearAllFilters();
            return;
        }
    });
}

// Toggle filter based on card clicked
function toggleFilter(filterType) {
    // Remove active class from all cards
    document.querySelectorAll('.dashboard-card').forEach(card => {
        card.classList.remove('active');
    });

    // If clicking the same filter, clear it
    if (currentFilter === filterType) {
        currentFilter = null;
        filteredOrderClasses = [...orderClasses];
        currentSearchFilters = null;
    } else {
        // Set new filter
        currentFilter = filterType;
        document.getElementById(`${filterType}Card`).classList.add('active');

        // Apply filter
        switch (filterType) {
            case 'demand':
                // Show modal to choose Yes/No for demand
                showFilterModal('Consider For Demand', ['YES', 'NO'], (value) => {
                    const boolValue = value === 'YES';
                    filteredOrderClasses = orderClasses.filter(item => item.considerForDemand === boolValue);
                    currentSearchFilters = { demandFilter: value.toLowerCase() };
                    renderCards();
                });
                return;
            case 'validate':
                // Show modal to choose Yes/No for validate
                showFilterModal('Asset Validate', ['YES', 'NO'], (value) => {
                    const boolValue = value === 'YES';
                    filteredOrderClasses = orderClasses.filter(item => item.assetValidate === boolValue);
                    currentSearchFilters = { validateFilter: value.toLowerCase() };
                    renderCards();
                });
                return;
            case 'active':
                // Show modal to choose Yes/No for active
                showFilterModal('Is Active', ['YES', 'NO'], (value) => {
                    const boolValue = value === 'YES';
                    filteredOrderClasses = orderClasses.filter(item => item.isActive === boolValue);
                    currentSearchFilters = { activeFilter: value.toLowerCase() };
                    renderCards();
                });
                return;
            case 'total':
                filteredOrderClasses = [...orderClasses];
                currentSearchFilters = null;
                break;
        }
    }

    renderCards();
}

// Show filter selection modal
function showFilterModal(title, options, callback) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h2>Filter by ${title}</h2>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                    <span class="material-icons">close</span>
                </button>
            </div>
            <div class="modal-body">
                <p>Select the value to filter by:</p>
                <div style="display: flex; gap: 12px; margin-top: 16px;">
                    ${options.map(option => `
                        <button class="btn btn-primary filter-option-btn" data-value="${option}">
                            ${option}
                        </button>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Add click handlers for filter options
    modal.querySelectorAll('.filter-option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const value = btn.getAttribute('data-value');
            callback(value);
            modal.remove();
            document.body.style.overflow = '';
        });
    });

    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            document.body.style.overflow = '';
            // Remove active state if modal is closed without selection
            document.querySelectorAll('.dashboard-card').forEach(card => {
                card.classList.remove('active');
            });
            currentFilter = null;
        }
    });
}

// Apply direct filter when clicking on YES/NO numbers
function applyDirectFilter(filterType, filterValue, clickedElement) {
    // Clear all active states
    document.querySelectorAll('.stat-item.clickable').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelectorAll('.dashboard-card').forEach(card => {
        card.classList.remove('active');
    });

    // Check if clicking the same filter again to toggle off
    if (currentFilter === `${filterType}-${filterValue}`) {
        clearAllFilters();
        return;
    }

    // Set new filter
    currentFilter = `${filterType}-${filterValue}`;
    clickedElement.classList.add('active');
    clickedElement.closest('.dashboard-card').classList.add('active');

    // Apply filter based on type and value
    const boolValue = filterValue === 'yes';

    switch (filterType) {
        case 'demand':
            filteredOrderClasses = orderClasses.filter(item => item.considerForDemand === boolValue);
            currentSearchFilters = { demandFilter: filterValue };
            break;
        case 'validate':
            filteredOrderClasses = orderClasses.filter(item => item.assetValidate === boolValue);
            currentSearchFilters = { validateFilter: filterValue };
            break;
        case 'active':
            filteredOrderClasses = orderClasses.filter(item => item.isActive === boolValue);
            currentSearchFilters = { activeFilter: filterValue };
            break;
    }

    // Reset to first page and render
    currentPage = 1;
    renderCards();

    // Show notification
    const filterName = filterType.charAt(0).toUpperCase() + filterType.slice(1);
    const valueName = filterValue.toUpperCase();
    showNotification(`Filtered by ${filterName}: ${valueName} (${filteredOrderClasses.length} items)`);
}

// Clear all filters
function clearAllFilters() {
    currentFilter = null;
    filteredOrderClasses = [...orderClasses];
    currentSearchFilters = null;

    // Remove all active states
    document.querySelectorAll('.stat-item.clickable').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelectorAll('.dashboard-card').forEach(card => {
        card.classList.remove('active');
    });

    // Reset to first page and render
    currentPage = 1;
    renderCards();

    showNotification('All filters cleared');
}

// Setup sort controls
function setupSortControls() {
    const sortControls = document.getElementById('sortControls');
    const sortDropdown = document.getElementById('sortDropdown');

    if (!sortControls || !sortDropdown) return;

    // Toggle dropdown
    sortControls.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = sortControls.classList.contains('open');

        // Close all other dropdowns
        document.querySelectorAll('.sort-controls.open').forEach(control => {
            control.classList.remove('open');
        });

        if (!isOpen) {
            sortControls.classList.add('open');
        }
    });

    // Handle sort option clicks
    sortDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
        const sortOption = e.target.closest('.sort-option');
        if (!sortOption) return;

        const sortType = sortOption.getAttribute('data-sort');
        applySorting(sortType);

        // Close dropdown
        sortControls.classList.remove('open');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        sortControls.classList.remove('open');
    });
}

// Apply sorting to the data
function applySorting(sortType) {
    const sortLabel = document.getElementById('sortLabel');
    const sortOptions = document.querySelectorAll('.sort-option');

    // Remove active state from all options
    sortOptions.forEach(option => option.classList.remove('active'));

    // Update current sort
    currentSort = sortType === 'none' ? null : sortType;

    // Get the data to sort (filtered or all)
    let dataToSort = currentSearchFilters ? filteredOrderClasses : orderClasses;

    if (currentSort === 'asc') {
        dataToSort.sort((a, b) => a.description.localeCompare(b.description));
        sortLabel.textContent = 'Sort: A to Z';
        document.querySelector('.sort-option[data-sort="asc"]').classList.add('active');
        document.getElementById('sortControls').classList.add('active');
    } else if (currentSort === 'desc') {
        dataToSort.sort((a, b) => b.description.localeCompare(a.description));
        sortLabel.textContent = 'Sort: Z to A';
        document.querySelector('.sort-option[data-sort="desc"]').classList.add('active');
        document.getElementById('sortControls').classList.add('active');
    } else {
        // Reset to original order
        if (currentSearchFilters) {
            filteredOrderClasses = [...orderClasses].filter(item => {
                return applySearchFilters(currentSearchFilters).includes(item);
            });
        } else {
            // Reset to original order
            orderClasses.sort((a, b) => a.id - b.id);
        }
        sortLabel.textContent = 'Sort by Description';
        document.querySelector('.sort-option[data-sort="none"]').classList.add('active');
        document.getElementById('sortControls').classList.remove('active');
    }

    // Update filtered data if search is active
    if (currentSearchFilters) {
        filteredOrderClasses = [...dataToSort];
    }

    // Reset to first page and render
    currentPage = 1;
    renderCards();

    // Show notification
    const sortMessages = {
        'asc': 'Sorted A to Z',
        'desc': 'Sorted Z to A',
        'none': 'Sort cleared'
    };
    showNotification(sortMessages[sortType] || 'Sorting applied');
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    renderCards();
    setupEventListeners();
    addAnimations();
    initializeDashboard();
});

// Render the data cards with pagination
function renderCards() {
    cardsContainer.innerHTML = '';

    // Use filtered data if search is active
    const dataToRender = currentSearchFilters ? filteredOrderClasses : orderClasses;

    // Calculate pagination
    totalPages = Math.ceil(dataToRender.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = dataToRender.slice(startIndex, endIndex);

    currentItems.forEach((item, index) => {
        const card = createDataCard(item, startIndex + index);
        cardsContainer.appendChild(card);
    });

    updateSelectAllState();
    updatePaginationInfo();
    updateSearchIndicator();
    updateDashboardStats();
}

// Create a data card
function createDataCard(item, index) {
    const card = document.createElement('div');
    card.className = 'data-card fade-in';
    card.style.animationDelay = `${index * 0.05}s`;
    card.style.cursor = 'pointer';

    card.innerHTML = `
        <div class="card-content">
            <div class="card-main">
                <div class="card-checkbox">
                    <input type="checkbox" class="checkbox row-checkbox" data-id="${item.id}">
                </div>
                <div class="card-description">
                    ${item.description}
                </div>
            </div>
            <div class="card-statuses">
                <div class="status-group">
                    <small>Demand:</small>
                    <span class="status-badge ${item.considerForDemand ? 'status-yes' : 'status-no'}">
                        ${item.considerForDemand ? 'Yes' : 'No'}
                    </span>
                </div>
                <div class="status-group">
                    <small>Validate:</small>
                    <span class="status-badge ${item.assetValidate ? 'status-yes' : 'status-no'}">
                        ${item.assetValidate ? 'Yes' : 'No'}
                    </span>
                </div>
                <div class="status-group">
                    <small>Active:</small>
                    <span class="status-badge ${item.isActive ? 'status-yes' : 'status-no'}">
                        ${item.isActive ? 'Yes' : 'No'}
                    </span>
                </div>
            </div>
            <div class="card-actions">
                <button class="action-btn delete-btn" onclick="deleteItem(${item.id}); event.stopPropagation();" title="Delete">
                    <span class="material-icons">delete</span>
                </button>
            </div>
        </div>
    `;

    // Add click event listener to the card (except for checkbox and delete button)
    card.addEventListener('click', (e) => {
        // Don't trigger view if clicking on checkbox or delete button
        if (e.target.closest('.card-checkbox') || e.target.closest('.delete-btn')) {
            return;
        }
        viewItem(item.id);
    });

    return card;
}

// Setup event listeners
function setupEventListeners() {
    // New order button
    newOrderBtn.addEventListener('click', () => openModal());

    // Modal controls
    modalClose.addEventListener('click', closeModal);
    modalCancel.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // View modal controls
    viewModalClose.addEventListener('click', closeViewModal);
    viewModalExit.addEventListener('click', closeViewModal);
    viewModalOverlay.addEventListener('click', (e) => {
        if (e.target === viewModalOverlay) closeViewModal();
    });

    // Form submission
    orderClassForm.addEventListener('submit', handleFormSubmit);

    // Action buttons
    deleteBtn.addEventListener('click', deleteSelectedItems);
    refreshBtn.addEventListener('click', refreshTable);
    exportBtn.addEventListener('click', exportData);
    advanceSearchBtn.addEventListener('click', showAdvanceSearch);

    // Select all checkbox
    selectAllCheckbox.addEventListener('change', handleSelectAll);

    // Row checkboxes (delegated event)
    cardsContainer.addEventListener('change', handleRowCheckbox);

    // View modal edit button
    viewModalEdit.addEventListener('click', () => {
        toggleEditMode(true);
    });

    // View modal cancel button
    if (viewModalCancel) {
        viewModalCancel.addEventListener('click', () => {
            toggleEditMode(false);
        });
    }

    // View modal save button
    if (viewModalSave) {
        viewModalSave.addEventListener('click', () => {
            saveViewModalChanges();
        });
    }

    // Manufacturer search functionality
    if (manufacturerViewSearch) {
        manufacturerViewSearch.addEventListener('input', handleManufacturerSearch);
    }

    // Manufacturer modal controls
    if (addManufacturerBtn) {
        addManufacturerBtn.addEventListener('click', openManufacturerModal);
    }
    if (manufacturerModalClose) {
        manufacturerModalClose.addEventListener('click', closeManufacturerModal);
    }
    if (manufacturerModalCancel) {
        manufacturerModalCancel.addEventListener('click', closeManufacturerModal);
    }
    if (manufacturerModalSave) {
        manufacturerModalSave.addEventListener('click', saveManufacturer);
    }
    if (manufacturerModalOverlay) {
        manufacturerModalOverlay.addEventListener('click', (e) => {
            if (e.target === manufacturerModalOverlay) closeManufacturerModal();
        });
    }

    // Pagination controls
    const firstPageBtn = document.getElementById('firstPageBtn');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    const lastPageBtn = document.getElementById('lastPageBtn');

    if (firstPageBtn) firstPageBtn.addEventListener('click', goToFirstPage);
    if (prevPageBtn) prevPageBtn.addEventListener('click', goToPreviousPage);
    if (nextPageBtn) nextPageBtn.addEventListener('click', goToNextPage);
    if (lastPageBtn) lastPageBtn.addEventListener('click', goToLastPage);

    // Advanced search controls
    const advancedSearchModalOverlay = document.getElementById('advancedSearchModalOverlay');
    const advancedSearchModalClose = document.getElementById('advancedSearchModalClose');
    const advancedSearchCancel = document.getElementById('advancedSearchCancel');
    const applySearchBtn = document.getElementById('applySearchBtn');
    const clearSearchBtn = document.getElementById('clearSearchBtn');

    if (advancedSearchModalClose) advancedSearchModalClose.addEventListener('click', closeAdvancedSearchModal);
    if (advancedSearchCancel) advancedSearchCancel.addEventListener('click', closeAdvancedSearchModal);
    if (applySearchBtn) applySearchBtn.addEventListener('click', applyAdvancedSearch);
    if (clearSearchBtn) clearSearchBtn.addEventListener('click', clearAdvancedSearch);
    if (advancedSearchModalOverlay) {
        advancedSearchModalOverlay.addEventListener('click', (e) => {
            if (e.target === advancedSearchModalOverlay) closeAdvancedSearchModal();
        });
    }

    // Quick filter buttons
    document.addEventListener('click', (e) => {
        if (e.target.closest('.quick-filter-btn')) {
            handleQuickFilter(e.target.closest('.quick-filter-btn'));
        }
    });

    // Real-time search preview
    const searchDescription = document.getElementById('searchDescription');
    if (searchDescription) {
        searchDescription.addEventListener('input', updateSearchPreview);
    }

    // Radio button changes for preview
    document.addEventListener('change', (e) => {
        if (e.target.type === 'radio' && e.target.name.includes('Filter')) {
            updateSearchPreview();
        }
    });
}

// Open modal for new/edit
function openModal(item = null) {
    currentEditingId = item ? item.id : null;
    modalTitle.textContent = item ? 'Edit OEM Order Class' : 'Add OEM Order Class';

    if (item) {
        document.getElementById('description').value = item.description;
        document.getElementById('considerForDemand').checked = item.considerForDemand;
        document.getElementById('assetValidate').checked = item.assetValidate;
        document.getElementById('isActive').checked = item.isActive;
    } else {
        orderClassForm.reset();
        document.getElementById('isActive').checked = true; // Default to active
    }

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    currentEditingId = null;
    orderClassForm.reset();
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(orderClassForm);
    const newItem = {
        id: currentEditingId || Date.now(),
        description: formData.get('description'),
        considerForDemand: formData.has('considerForDemand'),
        assetValidate: formData.has('assetValidate'),
        isActive: formData.has('isActive')
    };

    if (currentEditingId) {
        // Update existing item
        const index = orderClasses.findIndex(item => item.id === currentEditingId);
        if (index !== -1) {
            orderClasses[index] = newItem;
        }
    } else {
        // Add new item
        orderClasses.push(newItem);
        // Reset to last page to show the new item
        currentPage = Math.ceil(orderClasses.length / itemsPerPage);
    }

    renderCards();
    closeModal();
    showNotification(currentEditingId ? 'Order class updated successfully!' : 'Order class added successfully!');
}

// View item details
function viewItem(id) {
    const item = orderClasses.find(item => item.id === id);
    if (!item) return;

    currentEditingId = id;
    isEditMode = false;

    document.getElementById('viewModalTitle').textContent = item.description;
    document.getElementById('viewDescription').textContent = item.description;
    document.getElementById('viewConsiderDemand').textContent = item.considerForDemand ? 'Yes' : 'No';
    document.getElementById('viewConsiderDemand').className = `status-badge ${item.considerForDemand ? 'status-yes' : 'status-no'}`;
    document.getElementById('viewAssetValidate').textContent = item.assetValidate ? 'Yes' : 'No';
    document.getElementById('viewAssetValidate').className = `status-badge ${item.assetValidate ? 'status-yes' : 'status-no'}`;
    document.getElementById('viewIsActive').textContent = item.isActive ? 'Yes' : 'No';
    document.getElementById('viewIsActive').className = `status-badge ${item.isActive ? 'status-yes' : 'status-no'}`;

    // Initialize edit form with current values
    document.getElementById('editDescription').value = item.description;
    document.getElementById('editConsiderDemand').checked = item.considerForDemand;
    document.getElementById('editAssetValidate').checked = item.assetValidate;
    document.getElementById('editIsActive').checked = item.isActive;

    // Set initial view mode
    toggleEditMode(false);

    // Populate manufacturer cards
    populateManufacturerCards(item.description);

    viewModalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function populateManufacturerCards(itemName, searchTerm = '') {
    const container = document.getElementById('manufacturerCardsContainer');
    currentManufacturers = manufacturerData[itemName] || [];

    // Filter manufacturers based on search term
    filteredManufacturers = currentManufacturers.filter(manufacturer => {
        if (!searchTerm) return true;

        const searchLower = searchTerm.toLowerCase();
        return manufacturer.manufacturer.toLowerCase().includes(searchLower) ||
               manufacturer.priceType.toLowerCase().includes(searchLower) ||
               manufacturer.leadTime.toLowerCase().includes(searchLower) ||
               manufacturer.discount.toLowerCase().includes(searchLower);
    });

    if (filteredManufacturers.length === 0) {
        const emptyMessage = searchTerm ?
            `No manufacturers found matching "${searchTerm}"` :
            'No Manufacturer Records Available';
        const emptySubtext = searchTerm ?
            'Try adjusting your search terms' :
            'Click "Add Manufacturer" to create new records';

        container.innerHTML = `
            <div class="empty-state">
                <span class="material-icons">${searchTerm ? 'search_off' : 'inventory'}</span>
                <p>${emptyMessage}</p>
                <small>${emptySubtext}</small>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredManufacturers.map(manufacturer => `
        <div class="manufacturer-card">
            <div class="manufacturer-card-header">
                <div class="manufacturer-name">${manufacturer.manufacturer}</div>
                <div class="manufacturer-actions">
                    <button class="action-btn edit-btn manufacturer-edit-btn" onclick="editManufacturer(${manufacturer.id})" title="Edit" style="display: ${isEditMode ? 'flex' : 'none'}">
                        <span class="material-icons">edit</span>
                    </button>
                    <button class="action-btn delete-btn manufacturer-delete-btn" onclick="deleteManufacturer(${manufacturer.id})" title="Delete" style="display: ${isEditMode ? 'flex' : 'none'}">
                        <span class="material-icons">delete</span>
                    </button>
                </div>
            </div>
            <div class="manufacturer-details">
                <div class="detail-field price-type">
                    <label>Price Type</label>
                    <span>${manufacturer.priceType}</span>
                </div>
                <div class="detail-field lead-time">
                    <label>Lead Time</label>
                    <span>${manufacturer.leadTime}</span>
                </div>
                <div class="detail-field discount">
                    <label>Discount</label>
                    <span>${manufacturer.discount}</span>
                </div>
                <div class="detail-field status">
                    <label>Status</label>
                    <span class="status-badge status-yes">Active</span>
                </div>
            </div>
        </div>
    `).join('');
}

function editManufacturer(id) {
    // Find the manufacturer data
    const currentItem = orderClasses.find(item => item.id === currentEditingId);
    if (!currentItem) return;

    const manufacturers = manufacturerData[currentItem.description] || [];
    const manufacturer = manufacturers.find(m => m.id === id);

    if (!manufacturer) {
        showNotification('Manufacturer not found!', 'error');
        return;
    }

    // Set editing mode
    currentEditingManufacturerId = id;

    // Open manufacturer modal with prefilled data
    openManufacturerModal(manufacturer);
}

function deleteManufacturer(id) {
    if (confirm('Are you sure you want to delete this manufacturer?')) {
        showNotification(`Manufacturer with ID: ${id} deleted successfully!`);
    }
}

// Handle manufacturer search
function handleManufacturerSearch(e) {
    const searchTerm = e.target.value;
    const currentItem = orderClasses.find(item => item.id === currentEditingId);
    if (currentItem) {
        populateManufacturerCards(currentItem.description, searchTerm);
    }
}

// Close view modal
function closeViewModal() {
    viewModalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    currentEditingId = null;
    isEditMode = false;

    // Clear search input
    if (manufacturerViewSearch) {
        manufacturerViewSearch.value = '';
    }

    // Reset manufacturer arrays
    currentManufacturers = [];
    filteredManufacturers = [];
}

// Toggle edit mode in view modal
function toggleEditMode(editMode) {
    isEditMode = editMode;

    // Toggle visibility of view/edit content
    const viewModeContent = document.getElementById('viewModeContent');
    const editModeContent = document.getElementById('editModeContent');
    const viewModeButtons = document.getElementById('viewModeButtons');
    const editModeButtons = document.getElementById('editModeButtons');

    if (editMode) {
        viewModeContent.style.display = 'none';
        editModeContent.style.display = 'block';
        viewModeButtons.style.display = 'none';
        editModeButtons.style.display = 'block';

        // Enable Add Manufacturer button
        if (addManufacturerBtn) {
            addManufacturerBtn.disabled = false;
        }

        // Show manufacturer edit/delete buttons
        document.querySelectorAll('.manufacturer-edit-btn, .manufacturer-delete-btn').forEach(btn => {
            btn.style.display = 'flex';
        });
    } else {
        viewModeContent.style.display = 'block';
        editModeContent.style.display = 'none';
        viewModeButtons.style.display = 'block';
        editModeButtons.style.display = 'none';

        // Disable Add Manufacturer button
        if (addManufacturerBtn) {
            addManufacturerBtn.disabled = true;
        }

        // Hide manufacturer edit/delete buttons
        document.querySelectorAll('.manufacturer-edit-btn, .manufacturer-delete-btn').forEach(btn => {
            btn.style.display = 'none';
        });
    }
}

// Save changes from view modal edit form
function saveViewModalChanges() {
    if (!currentEditingId) return;

    const item = orderClasses.find(item => item.id === currentEditingId);
    if (!item) return;

    // Get form data
    const description = document.getElementById('editDescription').value;
    const considerForDemand = document.getElementById('editConsiderDemand').checked;
    const assetValidate = document.getElementById('editAssetValidate').checked;
    const isActive = document.getElementById('editIsActive').checked;

    // Update the item
    item.description = description;
    item.considerForDemand = considerForDemand;
    item.assetValidate = assetValidate;
    item.isActive = isActive;

    // Update the cards display
    renderCards();

    // Show success notification
    showNotification('Order class updated successfully!');

    // Close the view modal
    closeViewModal();
}

// Edit item
function editItem(id) {
    const item = orderClasses.find(item => item.id === id);
    if (item) {
        openModal(item);
    }
}

// Delete single item
function deleteItem(id) {
    if (confirm('Are you sure you want to delete this order class?')) {
        const index = orderClasses.findIndex(item => item.id === id);
        if (index !== -1) {
            orderClasses.splice(index, 1);

            // Adjust current page if necessary
            const newTotalPages = Math.ceil(orderClasses.length / itemsPerPage);
            if (currentPage > newTotalPages && newTotalPages > 0) {
                currentPage = newTotalPages;
            } else if (orderClasses.length === 0) {
                currentPage = 1;
            }

            renderCards();
            showNotification('Order class deleted successfully!');
        }
    }
}

// Handle select all checkbox
function handleSelectAll(e) {
    const checkboxes = document.querySelectorAll('.row-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = e.target.checked;
        const id = parseInt(checkbox.dataset.id);
        if (e.target.checked) {
            selectedItems.add(id);
        } else {
            selectedItems.delete(id);
        }
    });
    updateDeleteButtonState();
}

// Handle individual row checkbox
function handleRowCheckbox(e) {
    if (e.target.classList.contains('row-checkbox')) {
        const id = parseInt(e.target.dataset.id);
        if (e.target.checked) {
            selectedItems.add(id);
        } else {
            selectedItems.delete(id);
        }
        updateSelectAllState();
        updateDeleteButtonState();
    }
}

// Update select all checkbox state
function updateSelectAllState() {
    const checkboxes = document.querySelectorAll('.row-checkbox');
    const checkedBoxes = document.querySelectorAll('.row-checkbox:checked');

    if (checkedBoxes.length === 0) {
        selectAllCheckbox.indeterminate = false;
        selectAllCheckbox.checked = false;
    } else if (checkedBoxes.length === checkboxes.length) {
        selectAllCheckbox.indeterminate = false;
        selectAllCheckbox.checked = true;
    } else {
        selectAllCheckbox.indeterminate = true;
        selectAllCheckbox.checked = false;
    }
}

// Update delete button state
function updateDeleteButtonState() {
    deleteBtn.disabled = selectedItems.size === 0;
    deleteBtn.style.opacity = selectedItems.size === 0 ? '0.5' : '1';
}

// Delete selected items
function deleteSelectedItems() {
    if (selectedItems.size === 0) return;

    const count = selectedItems.size;
    if (confirm(`Are you sure you want to delete ${count} selected order class${count > 1 ? 'es' : ''}?`)) {
        selectedItems.forEach(id => {
            const index = orderClasses.findIndex(item => item.id === id);
            if (index !== -1) {
                orderClasses.splice(index, 1);
            }
        });

        selectedItems.clear();

        // Adjust current page if necessary
        const newTotalPages = Math.ceil(orderClasses.length / itemsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
            currentPage = newTotalPages;
        } else if (orderClasses.length === 0) {
            currentPage = 1;
        }

        renderCards();
        showNotification(`${count} order class${count > 1 ? 'es' : ''} deleted successfully!`);
    }
}

// Refresh cards
function refreshTable() {
    renderCards();
    showNotification('Data refreshed successfully!');
}

// Pagination functions
function updatePaginationInfo() {
    const paginationInfo = document.getElementById('paginationInfo');
    const firstBtn = document.getElementById('firstPageBtn');
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    const lastBtn = document.getElementById('lastPageBtn');

    if (paginationInfo) {
        paginationInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    }

    // Update button states
    if (firstBtn) firstBtn.disabled = currentPage === 1;
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;
    if (lastBtn) lastBtn.disabled = currentPage === totalPages;
}

function goToFirstPage() {
    currentPage = 1;
    renderCards();
}

function goToPreviousPage() {
    if (currentPage > 1) {
        currentPage--;
        renderCards();
    }
}

function goToNextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        renderCards();
    }
}

function goToLastPage() {
    currentPage = totalPages;
    renderCards();
}

// Export data
function exportData() {
    const csvContent = generateCSV();
    downloadCSV(csvContent, 'oem_order_classes.csv');
    showNotification('Data exported successfully!');
}

// Generate CSV content
function generateCSV() {
    const headers = ['Description', 'Consider For Demand', 'Asset Validate', 'Is Active'];
    const rows = orderClasses.map(item => [
        item.description,
        item.considerForDemand ? 'Yes' : 'No',
        item.assetValidate ? 'Yes' : 'No',
        item.isActive ? 'Yes' : 'No'
    ]);

    const csvContent = [headers, ...rows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');

    return csvContent;
}

// Download CSV file
function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
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

// Show advanced search modal
function showAdvanceSearch() {
    const advancedSearchModalOverlay = document.getElementById('advancedSearchModalOverlay');
    if (advancedSearchModalOverlay) {
        // Reset form if no current filters
        if (!currentSearchFilters) {
            resetAdvancedSearchForm();
        } else {
            // Populate form with current filters
            populateAdvancedSearchForm();
        }

        updateSearchPreview();
        advancedSearchModalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close advanced search modal
function closeAdvancedSearchModal() {
    const advancedSearchModalOverlay = document.getElementById('advancedSearchModalOverlay');
    if (advancedSearchModalOverlay) {
        advancedSearchModalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Reset advanced search form
function resetAdvancedSearchForm() {
    document.getElementById('searchDescription').value = '';
    document.getElementById('searchOperator').value = 'contains';

    // Reset radio buttons to "all"
    document.querySelector('input[name="demandFilter"][value="all"]').checked = true;
    document.querySelector('input[name="validateFilter"][value="all"]').checked = true;
    document.querySelector('input[name="activeFilter"][value="all"]').checked = true;

    // Reset quick filter buttons
    document.querySelectorAll('.quick-filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
}

// Populate form with current filters
function populateAdvancedSearchForm() {
    if (!currentSearchFilters) return;

    document.getElementById('searchDescription').value = currentSearchFilters.description || '';
    document.getElementById('searchOperator').value = currentSearchFilters.operator || 'contains';

    // Set radio buttons
    if (currentSearchFilters.demandFilter) {
        document.querySelector(`input[name="demandFilter"][value="${currentSearchFilters.demandFilter}"]`).checked = true;
    }
    if (currentSearchFilters.validateFilter) {
        document.querySelector(`input[name="validateFilter"][value="${currentSearchFilters.validateFilter}"]`).checked = true;
    }
    if (currentSearchFilters.activeFilter) {
        document.querySelector(`input[name="activeFilter"][value="${currentSearchFilters.activeFilter}"]`).checked = true;
    }
}

// Get current search criteria from form
function getCurrentSearchCriteria() {
    return {
        description: document.getElementById('searchDescription').value.trim(),
        operator: document.getElementById('searchOperator').value,
        demandFilter: document.querySelector('input[name="demandFilter"]:checked').value,
        validateFilter: document.querySelector('input[name="validateFilter"]:checked').value,
        activeFilter: document.querySelector('input[name="activeFilter"]:checked').value
    };
}

// Apply search filters
function applySearchFilters(criteria) {
    return orderClasses.filter(item => {
        // Description filter
        if (criteria.description) {
            const description = item.description.toLowerCase();
            const searchTerm = criteria.description.toLowerCase();

            switch (criteria.operator) {
                case 'contains':
                    if (!description.includes(searchTerm)) return false;
                    break;
                case 'startsWith':
                    if (!description.startsWith(searchTerm)) return false;
                    break;
                case 'endsWith':
                    if (!description.endsWith(searchTerm)) return false;
                    break;
                case 'exact':
                    if (description !== searchTerm) return false;
                    break;
            }
        }

        // Status filters
        if (criteria.demandFilter !== 'all') {
            const expectedValue = criteria.demandFilter === 'yes';
            if (item.considerForDemand !== expectedValue) return false;
        }

        if (criteria.validateFilter !== 'all') {
            const expectedValue = criteria.validateFilter === 'yes';
            if (item.assetValidate !== expectedValue) return false;
        }

        if (criteria.activeFilter !== 'all') {
            const expectedValue = criteria.activeFilter === 'yes';
            if (item.isActive !== expectedValue) return false;
        }

        return true;
    });
}

// Update search preview
function updateSearchPreview() {
    const criteria = getCurrentSearchCriteria();
    const results = applySearchFilters(criteria);
    const resultCount = results.length;
    const pageCount = Math.ceil(resultCount / itemsPerPage);

    document.getElementById('previewCount').textContent = resultCount;
    document.getElementById('previewPages').textContent = pageCount;

    const previewMessage = document.getElementById('previewMessage');
    if (resultCount === 0) {
        previewMessage.textContent = 'No items match the current criteria';
        previewMessage.style.color = 'var(--error-color)';
    } else if (resultCount === orderClasses.length) {
        previewMessage.textContent = 'All items match the criteria';
        previewMessage.style.color = 'var(--success-color)';
    } else {
        previewMessage.textContent = `${resultCount} of ${orderClasses.length} items match`;
        previewMessage.style.color = 'var(--text-secondary)';
    }
}

// Apply advanced search
function applyAdvancedSearch() {
    const criteria = getCurrentSearchCriteria();

    // Check if any filters are applied
    const hasFilters = criteria.description ||
                      criteria.demandFilter !== 'all' ||
                      criteria.validateFilter !== 'all' ||
                      criteria.activeFilter !== 'all';

    if (hasFilters) {
        currentSearchFilters = criteria;
        filteredOrderClasses = applySearchFilters(criteria);
    } else {
        currentSearchFilters = null;
        filteredOrderClasses = [...orderClasses];
    }

    // Reset to first page
    currentPage = 1;

    // Re-render cards
    renderCards();

    // Close modal
    closeAdvancedSearchModal();

    // Show notification
    const resultCount = hasFilters ? filteredOrderClasses.length : orderClasses.length;
    showNotification(`Search applied: ${resultCount} items found`);
}

// Clear advanced search
function clearAdvancedSearch() {
    currentSearchFilters = null;
    filteredOrderClasses = [...orderClasses];
    currentPage = 1;

    resetAdvancedSearchForm();
    updateSearchPreview();
    renderCards();

    showNotification('Search filters cleared');
}

// Handle quick filter buttons
function handleQuickFilter(button) {
    const filterType = button.dataset.filter;

    // Toggle active state
    button.classList.toggle('active');

    // Reset form first
    resetAdvancedSearchForm();

    // Apply quick filter
    switch (filterType) {
        case 'active':
            document.querySelector('input[name="activeFilter"][value="yes"]').checked = true;
            break;
        case 'demand':
            document.querySelector('input[name="demandFilter"][value="yes"]').checked = true;
            break;
        case 'validate':
            document.querySelector('input[name="validateFilter"][value="yes"]').checked = true;
            break;
        case 'inactive':
            document.querySelector('input[name="activeFilter"][value="no"]').checked = true;
            break;
    }

    // Update preview
    updateSearchPreview();
}

// Update search indicator on advance search button
function updateSearchIndicator() {
    const advanceSearchBtn = document.getElementById('advanceSearchBtn');
    if (currentSearchFilters) {
        advanceSearchBtn.classList.add('search-active-indicator');
    } else {
        advanceSearchBtn.classList.remove('search-active-indicator');
    }
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="material-icons">${type === 'success' ? 'check_circle' : 'error'}</span>
        <span>${message}</span>
    `;

    // Add notification styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 2rem;
                right: 2rem;
                background: white;
                padding: 1rem 1.5rem;
                border-radius: 0.5rem;
                box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
                display: flex;
                align-items: center;
                gap: 0.75rem;
                z-index: 1001;
                animation: slideInRight 0.3s ease-out;
                max-width: 400px;
            }
            .notification-success {
                border-left: 4px solid #10b981;
                color: #065f46;
            }
            .notification-error {
                border-left: 4px solid #ef4444;
                color: #991b1b;
            }
            .notification .material-icons {
                color: inherit;
            }
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
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add animations to elements
function addAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('slide-in');
            }
        });
    });

    document.querySelectorAll('.data-card').forEach(card => {
        observer.observe(card);
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + N for new order
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        openModal();
    }

    // Escape to close modals
    if (e.key === 'Escape') {
        if (modalOverlay.classList.contains('active')) {
            closeModal();
        }
        if (viewModalOverlay.classList.contains('active')) {
            closeViewModal();
        }
    }

    // Ctrl/Cmd + R for refresh
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        refreshTable();
    }
});

// Manufacturer Modal Functions
function openManufacturerModal(manufacturerData = null) {
    if (manufacturerModalOverlay) {
        // Update modal title
        const modalTitle = document.getElementById('manufacturerModalTitle');
        if (modalTitle) {
            modalTitle.textContent = manufacturerData ? 'Edit Manufacturer' : 'Add Manufacturer';
        }

        manufacturerForm.reset();
        // Reset searchable selects
        resetSearchableSelects();

        manufacturerModalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Initialize searchable dropdowns first
        initializeSearchableDropdowns();

        // If editing, prefill the form after initialization
        if (manufacturerData) {
            setTimeout(() => {
                prefillManufacturerForm(manufacturerData);
            }, 100);
        }
    }
}

// Prefill manufacturer form with existing data
function prefillManufacturerForm(manufacturerData) {
    if (!manufacturerData) return;

    // Set manufacturer
    const manufacturerSearch = document.getElementById('manufacturerSearch');
    const manufacturerSelect = document.getElementById('manufacturerSelect');
    if (manufacturerSearch && manufacturerSelect && manufacturerData.manufacturer) {
        manufacturerSearch.value = manufacturerData.manufacturer;
        manufacturerSelect.value = manufacturerData.manufacturer;
    }

    // Set price type
    const priceTypeSearch = document.getElementById('priceTypeSearch');
    const priceTypeSelect = document.getElementById('priceTypeSelect');
    if (priceTypeSearch && priceTypeSelect && manufacturerData.priceType) {
        priceTypeSearch.value = manufacturerData.priceType;
        priceTypeSelect.value = manufacturerData.priceType;
    }

    // Set lead time (extract number from string like "7 days")
    const leadTimeInput = document.getElementById('leadTimeInput');
    if (leadTimeInput && manufacturerData.leadTime) {
        const leadTimeNumber = manufacturerData.leadTime.match(/\d+/);
        leadTimeInput.value = leadTimeNumber ? leadTimeNumber[0] : '';
    }

    // Set discount (extract number from string like "15%")
    const discountInput = document.getElementById('discountInput');
    if (discountInput && manufacturerData.discount) {
        const discountNumber = manufacturerData.discount.match(/\d+(\.\d+)?/);
        discountInput.value = discountNumber ? discountNumber[0] : '';
    }
}

// Initialize searchable dropdown functionality
function initializeSearchableDropdowns() {
    initializeSearchableSelect('manufacturer');
    initializeSearchableSelect('priceType');
}

// Initialize a single searchable select
function initializeSearchableSelect(type) {
    const input = document.getElementById(`${type}Search`);
    const dropdown = document.getElementById(`${type}Dropdown`);
    const hiddenInput = document.getElementById(`${type}Select`);

    // Check if all required elements exist
    if (!input || !dropdown || !hiddenInput) {
        console.warn(`Missing elements for searchable select: ${type}`);
        return;
    }

    const container = input.parentElement;
    const searchInput = dropdown.querySelector('.dropdown-search');

    if (!container || !searchInput) {
        console.warn(`Missing container or search input for: ${type}`);
        return;
    }

    // Remove existing event listeners by cloning elements
    const newInput = input.cloneNode(true);
    const newSearchInput = searchInput.cloneNode(true);
    input.parentNode.replaceChild(newInput, input);
    searchInput.parentNode.replaceChild(newSearchInput, searchInput);

    // Update references after cloning
    const currentInput = document.getElementById(`${type}Search`);
    const currentSearchInput = dropdown.querySelector('.dropdown-search');
    const options = dropdown.querySelectorAll('.dropdown-option'); // Get fresh reference after cloning

    // Toggle dropdown
    currentInput.addEventListener('click', (e) => {
        e.stopPropagation();
        closeAllDropdowns();
        container.classList.add('open');

        // Position dropdown - improved positioning for modals
        const rect = currentInput.getBoundingClientRect();
        const isInModal = currentInput.closest('.modal');

        if (isInModal) {
            // For modals, use absolute positioning relative to the modal
            dropdown.style.position = 'absolute';
            dropdown.style.top = `${currentInput.offsetTop + currentInput.offsetHeight}px`;
            dropdown.style.left = `${currentInput.offsetLeft}px`;
            dropdown.style.width = `${currentInput.offsetWidth}px`;
        } else {
            // For non-modal elements, use fixed positioning
            dropdown.style.position = 'fixed';
            dropdown.style.top = `${rect.bottom}px`;
            dropdown.style.left = `${rect.left}px`;
            dropdown.style.width = `${rect.width}px`;
        }

        setTimeout(() => currentSearchInput.focus(), 100);
    });

    // Search functionality
    currentSearchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const currentOptions = dropdown.querySelectorAll('.dropdown-option'); // Get fresh reference
        currentOptions.forEach(option => {
            const text = option.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                option.classList.remove('hidden');
            } else {
                option.classList.add('hidden');
            }
        });
    });

    // Option selection - clone options to remove existing event listeners
    options.forEach(option => {
        const newOption = option.cloneNode(true);
        option.parentNode.replaceChild(newOption, option);
    });

    // Get fresh options reference after cloning and add event listeners
    const freshOptions = dropdown.querySelectorAll('.dropdown-option');
    freshOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const value = option.getAttribute('data-value');
            const text = option.textContent;

            // Update inputs
            currentInput.value = text;
            hiddenInput.value = value;

            // Update selected state
            freshOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');

            // Close dropdown
            container.classList.remove('open');
            currentSearchInput.value = '';
            freshOptions.forEach(opt => opt.classList.remove('hidden'));
        });
    });
}

// Close all dropdowns
function closeAllDropdowns() {
    document.querySelectorAll('.searchable-select-container').forEach(container => {
        container.classList.remove('open');
    });
}

// Reset searchable selects
function resetSearchableSelects() {
    const manufacturerSearch = document.getElementById('manufacturerSearch');
    const priceTypeSearch = document.getElementById('priceTypeSearch');
    const manufacturerSelect = document.getElementById('manufacturerSelect');
    const priceTypeSelect = document.getElementById('priceTypeSelect');

    if (manufacturerSearch) manufacturerSearch.value = '';
    if (priceTypeSearch) priceTypeSearch.value = '';
    if (manufacturerSelect) manufacturerSelect.value = '';
    if (priceTypeSelect) priceTypeSelect.value = '';

    // Reset search inputs and show all options
    document.querySelectorAll('.dropdown-search').forEach(search => {
        search.value = '';
    });
    document.querySelectorAll('.dropdown-option').forEach(option => {
        option.classList.remove('hidden', 'selected');
    });
}

// Close dropdowns when clicking outside (remove existing listener first)
document.removeEventListener('click', closeDropdownsHandler);
document.addEventListener('click', closeDropdownsHandler);

function closeDropdownsHandler(e) {
    if (!e.target.closest('.searchable-select-container') &&
        !e.target.closest('.searchable-select-dropdown')) {
        closeAllDropdowns();
    }
}

function closeManufacturerModal() {
    if (manufacturerModalOverlay) {
        manufacturerModalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        manufacturerForm.reset();
        resetSearchableSelects();
        closeAllDropdowns();

        // Reset editing state
        currentEditingManufacturerId = null;
    }
}

function saveManufacturer() {
    const formData = new FormData(manufacturerForm);
    const manufacturerName = formData.get('manufacturer');
    const priceType = formData.get('priceType');
    const leadTime = formData.get('leadTime');
    const discount = formData.get('discount');

    // Validate form
    if (!manufacturerName || !priceType || !leadTime || !discount) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    // Get current item
    const currentItem = orderClasses.find(item => item.id === currentEditingId);
    if (!currentItem) {
        showNotification('No order class selected', 'error');
        return;
    }

    // Initialize manufacturer data for this item if it doesn't exist
    if (!manufacturerData[currentItem.description]) {
        manufacturerData[currentItem.description] = [];
    }

    const manufacturers = manufacturerData[currentItem.description];

    if (currentEditingManufacturerId) {
        // Edit existing manufacturer
        const manufacturerIndex = manufacturers.findIndex(m => m.id === currentEditingManufacturerId);
        if (manufacturerIndex !== -1) {
            manufacturers[manufacturerIndex] = {
                id: currentEditingManufacturerId,
                manufacturer: manufacturerName,
                priceType: priceType,
                leadTime: `${leadTime} days`,
                discount: `${discount}%`
            };
            showNotification('Manufacturer updated successfully!');
        }
    } else {
        // Add new manufacturer
        const newId = Math.max(0, ...manufacturers.map(m => m.id)) + 1;
        const newManufacturer = {
            id: newId,
            manufacturer: manufacturerName,
            priceType: priceType,
            leadTime: `${leadTime} days`,
            discount: `${discount}%`
        };
        manufacturers.push(newManufacturer);
        showNotification('Manufacturer added successfully!');
    }

    // Reset editing state
    currentEditingManufacturerId = null;

    // Refresh the manufacturer cards
    populateManufacturerCards(currentItem.description);

    // Close modal
    closeManufacturerModal();
}

// Initialize delete button state
updateDeleteButtonState();
