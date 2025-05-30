/**
 * Party Details Advanced View JavaScript
 *
 * This file provides comprehensive functionality for the advanced party details view
 * including smart search, advanced filtering, import/export, and multiple view modes.
 */

// Global variables
let allParties = [];
let filteredParties = [];
let currentView = 'card';
let currentSort = { field: 'name', order: 'asc' };
let activeFilters = {
    partyType: [],
    status: [],
    location: [],
    company: []
};
let smartSearchEnabled = false;
let isVoiceSearchActive = false;
let isSidebarOpen = false;
let isNavSidebarOpen = false;
let navigationHistory = [];
let currentPage = 'party-details';
let isBookmarked = false;

// DOM elements
let mainSearch;
let smartSearchToggle;
let partyContainer;
let partyList;
let partyGrid;
let gridTableBody;
let emptyState;
let loadingState;
let resultsCount;
let filterStatus;
let sortBy;
let sortOrderBtn;
let quickFiltersPanel;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    setupEventListeners();

    // Force regenerate account numbers for demo purposes
    regenerateAllAccountNumbers();

    // Check if we have all parties, if not reset the data
    ensureAllPartiesExist();

    loadPartyData();
    initializeQuickFilters();
});

// Ensure all default parties exist
function ensureAllPartiesExist() {
    // Always reset to ensure we have all 8 default parties for demo
    localStorage.removeItem('aftermarket_parties');
    DataService.initialize();
}

// Force regenerate account numbers for all parties
function regenerateAllAccountNumbers() {
    try {
        const parties = DataService.getParties();
        let updated = false;

        parties.forEach(party => {
            // Generate new account number for all parties to ensure variety
            party.accountNumber = DataService.generateAccountNumber();
            updated = true;
        });

        if (updated) {
            DataService.saveParties(parties);
            console.log('Account numbers regenerated for all parties');
        }
    } catch (error) {
        console.error('Error regenerating account numbers:', error);
    }
}

// Initialize DOM elements
function initializeElements() {
    mainSearch = document.getElementById('mainSearch');
    smartSearchToggle = document.getElementById('smartSearchToggle');
    partyContainer = document.getElementById('partyContainer');
    partyList = document.getElementById('partyList');
    partyGrid = document.getElementById('partyGrid');
    gridTableBody = document.getElementById('gridTableBody');
    emptyState = document.getElementById('emptyState');
    loadingState = document.getElementById('loadingState');
    resultsCount = document.getElementById('resultsCount');
    filterStatus = document.getElementById('filterStatus');
    sortBy = document.getElementById('sortBy');
    sortOrderBtn = document.getElementById('sortOrderBtn');
    quickFiltersPanel = document.getElementById('quickFiltersPanel');
}

// Setup event listeners
function setupEventListeners() {
    // Navigation sidebar
    document.getElementById('menuToggle').addEventListener('click', toggleNavSidebar);
    document.getElementById('navClose').addEventListener('click', closeNavSidebar);
    document.getElementById('navOverlay').addEventListener('click', closeNavSidebar);

    // Search functionality
    mainSearch.addEventListener('input', debounce(handleSearch, 300));
    document.getElementById('clearSearchBtn').addEventListener('click', clearSearch);
    document.getElementById('voiceSearchBtn').addEventListener('click', toggleVoiceSearch);

    // Smart search toggle
    smartSearchToggle.addEventListener('click', toggleSmartSearch);

    // View controls
    document.querySelectorAll('.view-toggle').forEach(btn => {
        btn.addEventListener('click', function() {
            switchView(this.dataset.view);
        });
    });

    // Sort controls
    sortBy.addEventListener('change', handleSort);
    sortOrderBtn.addEventListener('click', toggleSortOrder);

    // Control buttons
    document.getElementById('advancedSearchBtn').addEventListener('click', toggleSidebar);
    document.getElementById('importBtn').addEventListener('click', handleImport);
    document.getElementById('exportBtn').addEventListener('click', handleExport);
    document.getElementById('addPartyBtn').addEventListener('click', addNewParty);
    document.getElementById('clearAllFilters').addEventListener('click', clearAllFilters);

    // View toggle buttons
    document.getElementById('cardViewBtn').addEventListener('click', () => switchView('card'));
    document.getElementById('listViewBtn').addEventListener('click', () => switchView('list'));
    document.getElementById('compactViewBtn').addEventListener('click', () => switchView('compact'));
    document.getElementById('gridViewBtn').addEventListener('click', () => switchView('grid'));

    // Click outside to close advanced search
    document.addEventListener('click', handleClickOutside);

    // Advanced search form
    document.getElementById('advancedSearchForm').addEventListener('submit', handleAdvancedSearch);

    // Add real-time sync for advanced search fields
    setupAdvancedSearchSync();

    // Setup keyboard shortcuts
    setupKeyboardShortcuts();
}

// Setup advanced search synchronization
function setupAdvancedSearchSync() {
    // Wait for DOM to be ready
    setTimeout(() => {
        const advancedFields = [
            'advPartyType', 'advName', 'advEmail', 'advPhone',
            'advCity', 'advCountry', 'advCompany', 'advBranch', 'advStatus'
        ];

        advancedFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                // Mark field as user-entered when user types
                field.addEventListener('input', function() {
                    this.dataset.userEntered = 'true';
                    // Trigger real-time search
                    debounce(performAdvancedSearchRealTime, 300)();
                });

                field.addEventListener('change', function() {
                    this.dataset.userEntered = 'true';
                    // Trigger immediate search for dropdowns
                    performAdvancedSearchRealTime();
                });

                // Clear user-entered flag when field is cleared
                field.addEventListener('blur', function() {
                    if (!this.value.trim()) {
                        delete this.dataset.userEntered;
                    }
                });
            }
        });
    }, 100);
}

// Perform real-time advanced search without form submission
function performAdvancedSearchRealTime() {
    const criteria = {
        partyType: document.getElementById('advPartyType')?.value || '',
        name: document.getElementById('advName')?.value.toLowerCase() || '',
        email: document.getElementById('advEmail')?.value.toLowerCase() || '',
        phone: document.getElementById('advPhone')?.value || '',
        city: document.getElementById('advCity')?.value.toLowerCase() || '',
        country: document.getElementById('advCountry')?.value.toLowerCase() || '',
        company: document.getElementById('advCompany')?.value.toLowerCase() || '',
        branch: document.getElementById('advBranch')?.value.toLowerCase() || '',
        status: document.getElementById('advStatus')?.value || ''
    };

    // Only sync if there are actual criteria
    const hasCriteria = Object.values(criteria).some(value => value.trim() !== '');
    if (hasCriteria) {
        syncAdvancedSearchToMain(criteria);

        // Show sync notification
        const activeFields = Object.entries(criteria).filter(([key, value]) => value.trim() !== '').length;
        if (activeFields > 1) {
            showSyncNotification(`Searching with ${activeFields} criteria`);
        }
    }

    // Filter parties based on criteria
    filteredParties = allParties.filter(party => {
        // Party type filter
        if (criteria.partyType && party.partyType !== criteria.partyType) {
            return false;
        }

        // Name filter
        if (criteria.name && !party.name.toLowerCase().includes(criteria.name)) {
            return false;
        }

        // Email filter
        if (criteria.email && (!party.email || !party.email.toLowerCase().includes(criteria.email))) {
            return false;
        }

        // Phone filter
        if (criteria.phone && (!party.phone || !party.phone.includes(criteria.phone))) {
            return false;
        }

        // City filter
        if (criteria.city && (!party.city || !party.city.toLowerCase().includes(criteria.city))) {
            return false;
        }

        // Country filter
        if (criteria.country && (!party.country || !party.country.toLowerCase().includes(criteria.country))) {
            return false;
        }

        // Company filter
        if (criteria.company && (!party.company || !party.company.toLowerCase().includes(criteria.company))) {
            return false;
        }

        // Branch filter
        if (criteria.branch && (!party.branch || !party.branch.toLowerCase().includes(criteria.branch))) {
            return false;
        }

        // Status filter
        if (criteria.status) {
            const isActive = criteria.status === 'active';
            if (party.isActive !== isActive) {
                return false;
            }
        }

        return true;
    });

    applyFilters();
    updateDisplay();
}

// Load party data
function loadPartyData() {
    showLoading(true);

    // Simulate API call delay
    setTimeout(() => {
        try {
            allParties = DataService.getParties();

            // Update any parties that still have "Not assigned" account numbers
            let updated = false;
            allParties.forEach(party => {
                if (!party.accountNumber || party.accountNumber === 'Not assigned') {
                    party.accountNumber = DataService.generateAccountNumber();
                    updated = true;
                }
            });

            // Save updated parties if any were changed
            if (updated) {
                DataService.saveParties(allParties);
            }

            filteredParties = [...allParties];

            // Clear any existing filters
            activeFilters = {
                partyType: [],
                status: [],
                location: [],
                company: []
            };

            updateDisplay();
            showLoading(false);
        } catch (error) {
            console.error('Error loading party data:', error);
            showError('Error loading party data');
        }
    }, 800);
}

// Initialize quick filters
function initializeQuickFilters() {
    // Get unique values for filters
    const partyTypes = [...new Set(allParties.map(p => p.partyType))].filter(Boolean);
    const statuses = ['Active', 'Inactive'];
    const locations = [...new Set(allParties.map(p => p.city))].filter(Boolean);
    const companies = [...new Set(allParties.map(p => p.company))].filter(Boolean);

    // Populate filter chips
    populateFilterChips('partyTypeFilters', partyTypes, 'partyType');
    populateFilterChips('statusFilters', statuses, 'status');
    populateFilterChips('locationFilters', locations.slice(0, 10), 'location'); // Limit to 10
    populateFilterChips('companyFilters', companies.slice(0, 10), 'company'); // Limit to 10
}

// Populate filter chips
function populateFilterChips(containerId, values, filterType) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    values.forEach(value => {
        const chip = document.createElement('div');
        chip.className = 'filter-chip';
        chip.dataset.filterType = filterType;
        chip.dataset.value = value;

        chip.innerHTML = `
            <span>${value}</span>
            <i class="material-icons filter-chip-close" style="display: none;">close</i>
        `;

        chip.addEventListener('click', function() {
            toggleFilter(filterType, value, this);
        });

        container.appendChild(chip);
    });
}

// Handle search
function handleSearch() {
    const searchTerm = mainSearch.value.toLowerCase().trim();

    // Sync with advanced search
    syncMainSearchToAdvanced(searchTerm);

    // Use the new unified column filter system which handles both main search and column searches
    applyColumnFilters();
}

// Perform regular search
function performRegularSearch(searchTerm) {
    if (!searchTerm) {
        filteredParties = [...allParties];
        return;
    }

    filteredParties = allParties.filter(party => {
        return Object.values(party).some(value => {
            if (value && typeof value === 'string') {
                return value.toLowerCase().includes(searchTerm);
            }
            return false;
        });
    });
}

// Perform smart search with AI-like capabilities
function performSmartSearch(searchTerm) {
    if (!searchTerm) {
        filteredParties = [...allParties];
        return;
    }

    // Smart search patterns
    const patterns = {
        email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,
        phone: /[\+]?[1-9]?[\d\s\-\(\)]{7,}/,
        city: /in\s+(\w+)/i,
        type: /(customer|vendor|manufacturer|prospect)/i,
        status: /(active|inactive)/i
    };

    filteredParties = allParties.filter(party => {
        // Check for specific patterns
        if (patterns.email.test(searchTerm)) {
            return party.email && party.email.toLowerCase().includes(searchTerm.toLowerCase());
        }

        if (patterns.phone.test(searchTerm)) {
            return party.phone && party.phone.includes(searchTerm.replace(/\D/g, ''));
        }

        const cityMatch = searchTerm.match(patterns.city);
        if (cityMatch) {
            return party.city && party.city.toLowerCase().includes(cityMatch[1].toLowerCase());
        }

        const typeMatch = searchTerm.match(patterns.type);
        if (typeMatch) {
            return party.partyType && party.partyType.toLowerCase().includes(typeMatch[1].toLowerCase());
        }

        const statusMatch = searchTerm.match(patterns.status);
        if (statusMatch) {
            const isActive = statusMatch[1].toLowerCase() === 'active';
            return party.isActive === isActive;
        }

        // Fuzzy search for names and general content
        return performFuzzySearch(party, searchTerm);
    });
}

// Perform fuzzy search
function performFuzzySearch(party, searchTerm) {
    const searchableFields = ['name', 'email', 'phone', 'city', 'country', 'partyType', 'company'];

    return searchableFields.some(field => {
        const value = party[field];
        if (!value) return false;

        const fieldValue = value.toString().toLowerCase();
        const terms = searchTerm.toLowerCase().split(' ');

        // Check if all terms are found in the field
        return terms.every(term => {
            return fieldValue.includes(term) ||
                   calculateSimilarity(fieldValue, term) > 0.7;
        });
    });
}

// Calculate string similarity (simple implementation)
function calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
}

// Levenshtein distance calculation
function levenshteinDistance(str1, str2) {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }

    return matrix[str2.length][str1.length];
}

// Toggle filter
function toggleFilter(filterType, value, chipElement) {
    const isActive = chipElement.classList.contains('active');

    if (isActive) {
        // Remove filter
        chipElement.classList.remove('active');
        chipElement.querySelector('.filter-chip-close').style.display = 'none';
        activeFilters[filterType] = activeFilters[filterType].filter(v => v !== value);
    } else {
        // Add filter
        chipElement.classList.add('active');
        chipElement.querySelector('.filter-chip-close').style.display = 'inline';
        activeFilters[filterType].push(value);
    }

    applyFilters();
    updateDisplay();
    updateActiveFiltersDisplay();
}



// Update active filters display
function updateActiveFiltersDisplay() {
    const activeFiltersDisplay = document.getElementById('activeFiltersDisplay');
    const activeFilterCount = document.getElementById('activeFilterCount');

    // Count total active filters
    const totalActiveFilters = Object.values(activeFilters).reduce((sum, arr) => sum + arr.length, 0);

    if (totalActiveFilters > 0) {
        activeFilterCount.style.display = 'inline';
        activeFilterCount.textContent = totalActiveFilters;
        activeFiltersDisplay.style.display = 'block';

        // Create active filter chips
        let activeChipsHTML = '<div style="margin-bottom: 8px; font-weight: 500; color: var(--primary-color);">Active Filters:</div>';

        Object.entries(activeFilters).forEach(([filterType, values]) => {
            values.forEach(value => {
                activeChipsHTML += `
                    <div class="filter-chip active" onclick="removeActiveFilter('${filterType}', '${value}')" style="margin: 2px;">
                        <span>${value}</span>
                        <i class="material-icons filter-chip-close">close</i>
                    </div>
                `;
            });
        });

        activeFiltersDisplay.innerHTML = activeChipsHTML;
    } else {
        activeFilterCount.style.display = 'none';
        activeFiltersDisplay.style.display = 'none';
        activeFiltersDisplay.innerHTML = '';
    }
}

// Remove active filter
function removeActiveFilter(filterType, value) {
    // Find and click the corresponding filter chip to remove it
    const filterChips = document.querySelectorAll(`[data-filter-type="${filterType}"][data-value="${value}"]`);
    filterChips.forEach(chip => {
        if (chip.classList.contains('active')) {
            chip.click();
        }
    });
}

// Handle click outside to close advanced search
function handleClickOutside(event) {
    const sidebar = document.getElementById('advancedSidebar');
    const advancedSearchBtn = document.getElementById('advancedSearchBtn');
    const navSidebar = document.getElementById('navSidebar');
    const menuToggle = document.getElementById('menuToggle');

    // Close advanced search if clicking outside
    if (isSidebarOpen && sidebar && !sidebar.contains(event.target) && !advancedSearchBtn.contains(event.target)) {
        closeSidebar();
    }

    // Close navigation sidebar if clicking outside
    if (isNavSidebarOpen && navSidebar && !navSidebar.contains(event.target) && !menuToggle.contains(event.target)) {
        closeNavSidebar();
    }
}

// Apply filters
function applyFilters() {
    // Start with all parties, not filtered parties
    let filtered = [...allParties];

    // Apply main search first if there's a search term
    const searchTerm = mainSearch ? mainSearch.value.toLowerCase().trim() : '';
    if (searchTerm) {
        if (smartSearchEnabled) {
            filtered = performSmartSearchOnData(filtered, searchTerm);
        } else {
            filtered = performRegularSearchOnData(filtered, searchTerm);
        }
    }

    // Apply column search filters if they exist
    if (typeof columnSearchFilters !== 'undefined' && Object.keys(columnSearchFilters).length > 0) {
        Object.keys(columnSearchFilters).forEach(column => {
            const searchValue = columnSearchFilters[column];
            filtered = filtered.filter(party => {
                let columnValue = '';

                if (column === 'status') {
                    columnValue = party.isActive ? 'active' : 'inactive';
                } else if (column === 'location') {
                    columnValue = `${party.city || ''}, ${party.country || ''}`.toLowerCase();
                } else {
                    columnValue = (party[column] || '').toString().toLowerCase();
                }

                return columnValue.includes(searchValue);
            });
        });
    }

    // Apply party type filter
    if (activeFilters.partyType.length > 0) {
        filtered = filtered.filter(party =>
            activeFilters.partyType.includes(party.partyType)
        );
    }

    // Apply status filter
    if (activeFilters.status.length > 0) {
        filtered = filtered.filter(party => {
            const status = party.isActive ? 'Active' : 'Inactive';
            return activeFilters.status.includes(status);
        });
    }

    // Apply location filter
    if (activeFilters.location.length > 0) {
        filtered = filtered.filter(party =>
            activeFilters.location.includes(party.city)
        );
    }

    // Apply company filter
    if (activeFilters.company.length > 0) {
        filtered = filtered.filter(party =>
            activeFilters.company.includes(party.company)
        );
    }

    filteredParties = filtered;
}

// Helper function to perform regular search on data
function performRegularSearchOnData(data, searchTerm) {
    if (!searchTerm) return data;

    return data.filter(party => {
        return Object.values(party).some(value => {
            if (value && typeof value === 'string') {
                return value.toLowerCase().includes(searchTerm);
            }
            return false;
        });
    });
}

// Helper function to perform smart search on data
function performSmartSearchOnData(data, searchTerm) {
    if (!searchTerm) return data;

    // Smart search patterns
    const patterns = {
        email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,
        phone: /[\+]?[1-9]?[\d\s\-\(\)]{7,}/,
        city: /in\s+(\w+)/i,
        type: /(customer|vendor|manufacturer|prospect)/i,
        status: /(active|inactive)/i
    };

    return data.filter(party => {
        // Check for specific patterns
        if (patterns.email.test(searchTerm)) {
            return party.email && party.email.toLowerCase().includes(searchTerm.toLowerCase());
        }

        if (patterns.phone.test(searchTerm)) {
            return party.phone && party.phone.includes(searchTerm.replace(/\D/g, ''));
        }

        const cityMatch = searchTerm.match(patterns.city);
        if (cityMatch) {
            return party.city && party.city.toLowerCase().includes(cityMatch[1].toLowerCase());
        }

        const typeMatch = searchTerm.match(patterns.type);
        if (typeMatch) {
            return party.partyType && party.partyType.toLowerCase().includes(typeMatch[1].toLowerCase());
        }

        const statusMatch = searchTerm.match(patterns.status);
        if (statusMatch) {
            const isActive = statusMatch[1].toLowerCase() === 'active';
            return party.isActive === isActive;
        }

        // Fuzzy search for names and general content
        return performFuzzySearch(party, searchTerm);
    });
}

// Sort parties
function sortParties() {
    filteredParties.sort((a, b) => {
        let aValue = a[currentSort.field] || '';
        let bValue = b[currentSort.field] || '';

        // Handle boolean values (isActive)
        if (currentSort.field === 'isActive') {
            aValue = aValue ? 'Active' : 'Inactive';
            bValue = bValue ? 'Active' : 'Inactive';
        }

        // Convert to strings for comparison
        aValue = aValue.toString().toLowerCase();
        bValue = bValue.toString().toLowerCase();

        if (currentSort.order === 'asc') {
            return aValue.localeCompare(bValue);
        } else {
            return bValue.localeCompare(aValue);
        }
    });
}

// Update display
function updateDisplay() {
    sortParties();
    updateResultsInfo();

    // Show/hide grid-only controls based on current view
    const gridOnlyControls = document.getElementById('gridOnlyControls');
    if (gridOnlyControls) {
        if (currentView === 'grid') {
            gridOnlyControls.style.display = 'flex';
        } else {
            gridOnlyControls.style.display = 'none';
        }
    }

    if (filteredParties.length === 0) {
        showEmptyState();
    } else {
        hideEmptyState();

        // Hide all views first
        partyContainer.style.display = 'none';
        partyList.style.display = 'none';
        if (partyGrid) partyGrid.style.display = 'none';

        if (currentView === 'card') {
            renderCardView();
        } else if (currentView === 'list') {
            renderListView();
        } else if (currentView === 'compact') {
            renderCompactView();
        } else if (currentView === 'grid') {
            renderGridView();
        }
    }
}

// Render card view
function renderCardView() {
    partyContainer.style.display = 'grid';
    partyContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(380px, 1fr))';
    partyList.style.display = 'none';
    partyContainer.innerHTML = '';

    filteredParties.forEach(party => {
        const card = createPartyCard(party);
        partyContainer.appendChild(card);
    });
}

// Render list view
function renderListView() {
    partyContainer.style.display = 'none';
    partyList.style.display = 'block';
    partyList.innerHTML = '';

    filteredParties.forEach(party => {
        const listItem = createPartyListItem(party);
        partyList.appendChild(listItem);
    });
}

// Render compact view
function renderCompactView() {
    partyContainer.style.display = 'grid';
    partyContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
    partyList.style.display = 'none';
    partyContainer.innerHTML = '';

    filteredParties.forEach(party => {
        const compactCard = createCompactCard(party);
        partyContainer.appendChild(compactCard);
    });
}

// Render grid view
function renderGridView() {
    partyGrid.style.display = 'block';
    gridTableBody.innerHTML = '';

    filteredParties.forEach(party => {
        const row = createGridRow(party);
        gridTableBody.appendChild(row);
    });
}

// Create party card
function createPartyCard(party) {
    const card = document.createElement('div');
    card.className = 'party-card';

    const statusClass = party.isActive ? 'status-active' : 'status-inactive';
    const statusText = party.isActive ? 'Active' : 'Inactive';

    card.innerHTML = `
        <div class="party-header">
            <div class="party-title">${party.name}</div>
            <div class="party-subtitle">
                <i class="material-icons">business</i>
                ${party.partyType || 'Unknown Type'}
            </div>
            <div class="account-number-badge">
                <i class="material-icons">account_circle</i>
                ${party.accountNumber || 'Not assigned'}
            </div>
            <div class="party-status ${statusClass}">${statusText}</div>
        </div>
        <div class="party-body">
            <div class="party-details">
                <div class="detail-item">
                    <div class="detail-label">Email</div>
                    <div class="detail-value">${party.email || 'Not provided'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Phone</div>
                    <div class="detail-value">${party.phone || 'Not provided'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Mobile</div>
                    <div class="detail-value">${party.mobile || 'Not provided'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Location</div>
                    <div class="detail-value">${party.city || 'Unknown'}, ${party.country || 'Unknown'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Address</div>
                    <div class="detail-value" title="${party.address || 'Not provided'}">${party.address ? (party.address.length > 50 ? party.address.substring(0, 50) + '...' : party.address) : 'Not provided'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Company</div>
                    <div class="detail-value">${party.company || 'Not specified'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Branch</div>
                    <div class="detail-value">${party.branch || 'Main'}</div>
                </div>
            </div>
            <div class="party-actions">
                <button class="action-btn btn-primary" onclick="viewPartyDetails('${party.id}')">
                    <i class="material-icons">visibility</i>
                    View
                </button>
                <button class="action-btn btn-info" onclick="viewCustomer360('${party.id}')">
                    <i class="material-icons">dashboard</i>
                    360 View
                </button>
                <button class="action-btn btn-secondary" onclick="editParty('${party.id}')">
                    <i class="material-icons">edit</i>
                    Edit
                </button>
                <button class="action-btn btn-danger" onclick="deleteParty('${party.id}')">
                    <i class="material-icons">delete</i>
                    Delete
                </button>
            </div>
        </div>
    `;

    return card;
}

// Create compact card
function createCompactCard(party) {
    const card = document.createElement('div');
    card.className = 'party-card';
    card.style.cssText = 'height: auto; min-height: 200px;';

    const statusClass = party.isActive ? 'status-active' : 'status-inactive';
    const statusText = party.isActive ? 'Active' : 'Inactive';

    card.innerHTML = `
        <div class="party-header" style="padding: 16px;">
            <div class="party-title" style="font-size: 16px;">${party.name}</div>
            <div class="party-subtitle" style="font-size: 12px;">
                <i class="material-icons" style="font-size: 14px;">business</i>
                ${party.partyType || 'Unknown'}
            </div>
            <div style="font-size: 10px; color: #666; margin: 4px 0;">
                <i class="material-icons" style="font-size: 12px;">account_circle</i>
                ${party.accountNumber || 'Not assigned'}
            </div>
            <div class="party-status ${statusClass}" style="font-size: 10px; padding: 2px 8px;">${statusText}</div>
        </div>
        <div class="party-body" style="padding: 12px;">
            <div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; font-size: 12px;">
                <div><strong>Email:</strong> ${(party.email || 'Not provided').substring(0, 25)}${party.email && party.email.length > 25 ? '...' : ''}</div>
                <div><strong>Phone:</strong> ${party.phone || 'Not provided'}</div>
                <div><strong>Mobile:</strong> ${party.mobile || 'Not provided'}</div>
                <div><strong>Location:</strong> ${party.city || 'Unknown'}, ${party.country || 'Unknown'}</div>
                <div><strong>Address:</strong> ${party.address ? (party.address.length > 30 ? party.address.substring(0, 30) + '...' : party.address) : 'Not provided'}</div>
                <div><strong>Company:</strong> ${party.company || 'Not specified'}</div>
            </div>
            <div class="party-actions" style="display: flex; gap: 4px;">
                <button class="action-btn btn-primary" onclick="viewPartyDetails('${party.id}')" style="padding: 6px 8px; font-size: 12px;">
                    <i class="material-icons" style="font-size: 16px;">visibility</i>
                </button>
                <button class="action-btn btn-info" onclick="viewCustomer360('${party.id}')" style="padding: 6px 8px; font-size: 12px;">
                    <i class="material-icons" style="font-size: 16px;">dashboard</i>
                </button>
                <button class="action-btn btn-secondary" onclick="editParty('${party.id}')" style="padding: 6px 8px; font-size: 12px;">
                    <i class="material-icons" style="font-size: 16px;">edit</i>
                </button>
                <button class="action-btn btn-danger" onclick="deleteParty('${party.id}')" style="padding: 6px 8px; font-size: 12px;">
                    <i class="material-icons" style="font-size: 16px;">delete</i>
                </button>
            </div>
        </div>
    `;

    return card;
}

// Create party list item
function createPartyListItem(party) {
    const listItem = document.createElement('div');
    listItem.className = 'list-item';

    const statusClass = party.isActive ? 'status-active' : 'status-inactive';
    const statusText = party.isActive ? 'Active' : 'Inactive';

    listItem.innerHTML = `
        <div class="list-avatar">
            ${party.name.charAt(0).toUpperCase()}
        </div>
        <div class="list-content">
            <div class="list-main">
                <div class="list-title">${party.name}</div>
                <div class="list-subtitle">${party.partyType || 'Unknown Type'}</div>
                <div class="account-number-small">
                    <i class="material-icons" style="font-size: 14px;">account_circle</i>
                    ${party.accountNumber || 'Not assigned'}
                </div>
                <div class="party-status ${statusClass}" style="display: inline-block; margin-top: 4px;">${statusText}</div>
            </div>
            <div class="list-details">
                <div><strong>Email:</strong> ${party.email || 'Not provided'}</div>
                <div><strong>Phone:</strong> ${party.phone || 'Not provided'}</div>
                <div><strong>Mobile:</strong> ${party.mobile || 'Not provided'}</div>
                <div><strong>Location:</strong> ${party.city || 'Unknown'}, ${party.country || 'Unknown'}</div>
            </div>
            <div class="list-details">
                <div><strong>Address:</strong> ${party.address ? (party.address.length > 60 ? party.address.substring(0, 60) + '...' : party.address) : 'Not provided'}</div>
                <div><strong>Company:</strong> ${party.company || 'Not specified'}</div>
                <div><strong>Branch:</strong> ${party.branch || 'Main'}</div>
                <div><strong>Region:</strong> ${party.region || 'Not specified'}</div>
            </div>
        </div>
        <div class="list-actions">
            <button class="list-action-btn" onclick="viewPartyDetails('${party.id}')" title="View Details">
                <i class="material-icons">visibility</i>
            </button>
            <button class="list-action-btn" onclick="viewCustomer360('${party.id}')" title="Customer 360 View">
                <i class="material-icons">dashboard</i>
            </button>
            <button class="list-action-btn" onclick="editParty('${party.id}')" title="Edit Party">
                <i class="material-icons">edit</i>
            </button>
            <button class="list-action-btn" onclick="deleteParty('${party.id}')" title="Delete Party">
                <i class="material-icons">delete</i>
            </button>
        </div>
    `;

    return listItem;
}

// Create grid row
function createGridRow(party) {
    const row = document.createElement('tr');
    const statusClass = party.isActive ? 'status-active' : 'status-inactive';
    const statusText = party.isActive ? 'Active' : 'Inactive';

    row.innerHTML = `
        <td>
            <input type="checkbox" class="row-checkbox" value="${party.id}" onchange="updateBulkActions()">
        </td>
        <td>
            <div style="font-weight: 500;">${party.name}</div>
        </td>
        <td>
            <span style="font-family: monospace; background: #f8f9fa; padding: 2px 6px; border-radius: 4px; font-size: 12px;">
                ${party.accountNumber || 'Not assigned'}
            </span>
        </td>
        <td>
            <span class="party-type-badge">${party.partyType || 'Unknown'}</span>
        </td>
        <td>${party.email || 'Not provided'}</td>
        <td>${party.phone || 'Not provided'}</td>
        <td>${party.mobile || 'Not provided'}</td>
        <td>${party.city || 'Unknown'}, ${party.country || 'Unknown'}</td>
        <td>
            <div style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${party.address || 'Not provided'}">
                ${party.address || 'Not provided'}
            </div>
        </td>
        <td>${party.company || 'Not specified'}</td>
        <td>
            <span class="status-badge ${statusClass}">${statusText}</span>
        </td>
        <td>
            <div class="grid-actions">
                <button class="grid-action-btn" onclick="viewPartyDetails('${party.id}')" title="View Details">
                    <i class="material-icons">visibility</i>
                </button>
                <button class="grid-action-btn" onclick="viewCustomer360('${party.id}')" title="Customer 360 View">
                    <i class="material-icons">dashboard</i>
                </button>
                <button class="grid-action-btn" onclick="editParty('${party.id}')" title="Edit Party">
                    <i class="material-icons">edit</i>
                </button>
                <button class="grid-action-btn" onclick="deleteParty('${party.id}')" title="Delete Party">
                    <i class="material-icons">delete</i>
                </button>
            </div>
        </td>
    `;

    return row;
}

// Update results info
function updateResultsInfo() {
    const total = filteredParties.length;
    const totalParties = allParties.length;

    resultsCount.textContent = `${total} of ${totalParties} parties`;

    // Update filter status
    const activeFilterCount = Object.values(activeFilters).reduce((sum, arr) => sum + arr.length, 0);
    const searchActive = mainSearch.value.trim() !== '';

    if (activeFilterCount === 0 && !searchActive) {
        filterStatus.textContent = 'No filters applied';
    } else {
        const parts = [];
        if (searchActive) parts.push('search');
        if (activeFilterCount > 0) parts.push(`${activeFilterCount} filters`);
        filterStatus.textContent = parts.join(', ') + ' applied';
    }
}

// Switch view
function switchView(view) {
    currentView = view;

    // Update view toggle buttons
    document.querySelectorAll('.view-toggle').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-view="${view}"]`).classList.add('active');

    // Show/hide grid-only controls
    const gridOnlyControls = document.getElementById('gridOnlyControls');
    if (gridOnlyControls) {
        if (view === 'grid') {
            gridOnlyControls.style.display = 'flex';
        } else {
            gridOnlyControls.style.display = 'none';
        }
    }

    // Update display
    updateDisplay();

    // Initialize scroll features for grid view
    if (view === 'grid') {
        setTimeout(initializeGridScrollFeatures, 100);
    }
}

// Handle sort
function handleSort() {
    currentSort.field = sortBy.value;
    updateDisplay();
}

// Toggle sort order
function toggleSortOrder() {
    currentSort.order = currentSort.order === 'asc' ? 'desc' : 'asc';

    const icon = sortOrderBtn.querySelector('i');
    icon.textContent = currentSort.order === 'asc' ? 'arrow_upward' : 'arrow_downward';

    updateDisplay();
}

// Toggle smart search
function toggleSmartSearch() {
    smartSearchEnabled = !smartSearchEnabled;

    if (smartSearchEnabled) {
        smartSearchToggle.classList.add('active');
        smartSearchToggle.innerHTML = '<i class="material-icons">psychology</i> Smart Search ON';
        mainSearch.placeholder = 'Try: "customers in New York", "active vendors", "john@email.com"...';
    } else {
        smartSearchToggle.classList.remove('active');
        smartSearchToggle.innerHTML = '<i class="material-icons">psychology</i> Smart Search';
        mainSearch.placeholder = 'Search parties by name, email, phone, city, or any field...';
    }

    // Re-run search if there's a search term
    if (mainSearch.value.trim()) {
        handleSearch();
    }
}

// Toggle voice search
function toggleVoiceSearch() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        showNotification('Voice search is not supported in this browser', 'warning');
        return;
    }

    if (isVoiceSearchActive) {
        stopVoiceSearch();
        return;
    }

    startVoiceSearch();
}

// Start voice search
function startVoiceSearch() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = function() {
        isVoiceSearchActive = true;
        document.getElementById('voiceSearchBtn').innerHTML = '<i class="material-icons" style="color: var(--error-color);">mic</i>';
        showNotification('Listening... Speak now', 'info');
    };

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        mainSearch.value = transcript;
        handleSearch();
        showNotification(`Searched for: "${transcript}"`, 'success');
    };

    recognition.onerror = function(event) {
        showNotification('Voice search error: ' + event.error, 'error');
    };

    recognition.onend = function() {
        stopVoiceSearch();
    };

    recognition.start();
}

// Stop voice search
function stopVoiceSearch() {
    isVoiceSearchActive = false;
    document.getElementById('voiceSearchBtn').innerHTML = '<i class="material-icons">mic</i>';
}

// Clear search
function clearSearch() {
    mainSearch.value = '';
    handleSearch();
}

// Clear all filters
function clearAllFilters() {
    // Reset active filters
    activeFilters = {
        partyType: [],
        status: [],
        location: [],
        company: []
    };

    // Remove active class from all filter chips
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.classList.remove('active');
        const closeIcon = chip.querySelector('.filter-chip-close');
        if (closeIcon) {
            closeIcon.style.display = 'none';
        }
    });

    // Update active filters display
    updateActiveFiltersDisplay();

    // Reset filtered parties to all parties
    filteredParties = [...allParties];

    // Apply search if there's a search term
    if (mainSearch && mainSearch.value.trim()) {
        handleSearch();
    } else {
        updateDisplay();
    }

    showNotification('All filters cleared', 'success');
}





// Handle import
function handleImport() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.json,.xlsx';

    input.onchange = function(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                let data;
                if (file.name.endsWith('.json')) {
                    data = JSON.parse(e.target.result);
                } else if (file.name.endsWith('.csv')) {
                    data = parseCSV(e.target.result);
                } else {
                    showNotification('Unsupported file format', 'error');
                    return;
                }

                // Process imported data
                processImportedData(data);
                showNotification(`Successfully imported ${data.length} parties`, 'success');
            } catch (error) {
                showNotification('Error importing file: ' + error.message, 'error');
            }
        };

        reader.readAsText(file);
    };

    input.click();
}

// Parse CSV data
function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
            const values = lines[i].split(',').map(v => v.trim());
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = values[index] || '';
            });
            data.push(obj);
        }
    }

    return data;
}

// Process imported data
function processImportedData(data) {
    data.forEach(item => {
        // Generate ID if not present
        if (!item.id) {
            item.id = 'P' + (allParties.length + 1).toString().padStart(3, '0');
        }

        // Set default values
        item.isActive = item.isActive !== undefined ? item.isActive : true;
        item.company = item.company || 'Unknown Company';
        item.branch = item.branch || 'Main';
        item.region = item.region || 'Default';

        allParties.push(item);
    });

    // Save to data service
    DataService.saveParties(allParties);

    // Refresh display
    filteredParties = [...allParties];
    initializeQuickFilters();
    updateDisplay();
}

// Handle export
function handleExport() {
    const exportData = filteredParties.map(party => ({
        id: party.id,
        name: party.name,
        email: party.email,
        phone: party.phone,
        city: party.city,
        country: party.country,
        partyType: party.partyType,
        company: party.company,
        branch: party.branch,
        region: party.region,
        isActive: party.isActive
    }));

    // Create export modal
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;

    modal.innerHTML = `
        <div class="modal-content" style="background: white; border-radius: 8px; padding: 24px; max-width: 400px; width: 90%;">
            <h3 style="margin-bottom: 16px;">Export Data</h3>
            <p style="margin-bottom: 24px;">Export ${exportData.length} parties in your preferred format:</p>
            <div style="display: flex; flex-direction: column; gap: 12px;">
                <button class="export-json-btn" style="padding: 12px; border: none; background: var(--primary-color); color: white; border-radius: 4px; cursor: pointer;">Export as JSON</button>
                <button class="export-csv-btn" style="padding: 12px; border: none; background: var(--success-color); color: white; border-radius: 4px; cursor: pointer;">Export as CSV</button>
                <button class="modal-cancel-btn" style="padding: 12px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer;">Cancel</button>
            </div>
        </div>
    `;

    // Add event listeners
    const jsonBtn = modal.querySelector('.export-json-btn');
    const csvBtn = modal.querySelector('.export-csv-btn');
    const cancelBtn = modal.querySelector('.modal-cancel-btn');

    jsonBtn.addEventListener('click', function() {
        exportAsJSON(exportData);
        closeModal(modal);
    });

    csvBtn.addEventListener('click', function() {
        exportAsCSV(exportData);
        closeModal(modal);
    });

    cancelBtn.addEventListener('click', createModalCloseHandler(modal));

    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal(modal);
        }
    });

    document.body.appendChild(modal);
}

// Export as JSON
window.exportAsJSON = function(data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    downloadFile(blob, 'parties-export.json');
}

// Export as CSV
window.exportAsCSV = function(data) {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => row[header] || '').join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    downloadFile(blob, 'parties-export.csv');
}

// Download file
function downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification(`File downloaded: ${filename}`, 'success');
}

// Action functions
function viewPartyDetails(partyId) {
    window.open(`party-details.html?partyId=${partyId}`, '_blank');
}

function viewCustomer360(partyId) {
    window.open(`customer-360-view.html?customerId=${partyId}`, '_blank');
}

function editParty(partyId) {
    const party = allParties.find(p => p.id === partyId);
    if (!party) {
        showNotification('Party not found', 'error');
        return;
    }

    // Create edit modal
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;

    modal.innerHTML = `
        <div class="modal-content" style="background: white; border-radius: 8px; padding: 24px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <h2 style="margin: 0;">Edit Party - ${party.name}</h2>
                <button class="modal-close-btn" style="background: none; border: none; font-size: 24px; cursor: pointer;">×</button>
            </div>
            <form id="editPartyForm">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 500;">Name *</label>
                        <input type="text" id="editName" value="${party.name}" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 500;">Party Type</label>
                        <select id="editPartyType" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            <option value="Customer" ${party.partyType === 'Customer' ? 'selected' : ''}>Customer</option>
                            <option value="Vendor" ${party.partyType === 'Vendor' ? 'selected' : ''}>Vendor</option>
                            <option value="Manufacturer" ${party.partyType === 'Manufacturer' ? 'selected' : ''}>Manufacturer</option>
                            <option value="Prospect" ${party.partyType === 'Prospect' ? 'selected' : ''}>Prospect</option>
                            <option value="Outside Agency Name" ${party.partyType === 'Outside Agency Name' ? 'selected' : ''}>Outside Agency</option>
                            <option value="Clearing Agent" ${party.partyType === 'Clearing Agent' ? 'selected' : ''}>Clearing Agent</option>
                            <option value="Transporter" ${party.partyType === 'Transporter' ? 'selected' : ''}>Transporter</option>
                            <option value="Insurance" ${party.partyType === 'Insurance' ? 'selected' : ''}>Insurance</option>
                            <option value="Financier" ${party.partyType === 'Financier' ? 'selected' : ''}>Financier</option>
                            <option value="User" ${party.partyType === 'User' ? 'selected' : ''}>User</option>
                            <option value="Contractor" ${party.partyType === 'Contractor' ? 'selected' : ''}>Contractor</option>
                        </select>
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 500;">Email</label>
                        <input type="email" id="editEmail" value="${party.email || ''}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 500;">Phone</label>
                        <input type="tel" id="editPhone" value="${party.phone || ''}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 500;">City</label>
                        <input type="text" id="editCity" value="${party.city || ''}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 500;">Country</label>
                        <input type="text" id="editCountry" value="${party.country || ''}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 500;">Company</label>
                        <input type="text" id="editCompany" value="${party.company || ''}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 500;">Branch</label>
                        <input type="text" id="editBranch" value="${party.branch || ''}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div style="grid-column: span 2;">
                        <label style="display: flex; align-items: center; gap: 8px; font-weight: 500;">
                            <input type="checkbox" id="editIsActive" ${party.isActive ? 'checked' : ''}>
                            Active Status
                        </label>
                    </div>
                </div>
                <div style="display: flex; gap: 12px; justify-content: flex-end;">
                    <button type="button" class="modal-cancel-btn" style="padding: 8px 16px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer;">Cancel</button>
                    <button type="submit" style="padding: 8px 16px; border: none; background: var(--primary-color); color: white; border-radius: 4px; cursor: pointer;">Save Changes</button>
                </div>
            </form>
        </div>
    `;

    // Add close button event listeners
    const closeBtn = modal.querySelector('.modal-close-btn');
    const cancelBtn = modal.querySelector('.modal-cancel-btn');

    closeBtn.addEventListener('click', createModalCloseHandler(modal));
    cancelBtn.addEventListener('click', createModalCloseHandler(modal));

    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal(modal);
        }
    });

    // Add form submit handler
    modal.querySelector('#editPartyForm').addEventListener('submit', function(e) {
        e.preventDefault();

        // Update party data
        const updatedParty = {
            ...party,
            name: document.getElementById('editName').value,
            partyType: document.getElementById('editPartyType').value,
            email: document.getElementById('editEmail').value,
            phone: document.getElementById('editPhone').value,
            city: document.getElementById('editCity').value,
            country: document.getElementById('editCountry').value,
            company: document.getElementById('editCompany').value,
            branch: document.getElementById('editBranch').value,
            isActive: document.getElementById('editIsActive').checked
        };

        // Update in arrays
        const index = allParties.findIndex(p => p.id === partyId);
        if (index !== -1) {
            allParties[index] = updatedParty;

            // Update filtered parties if it exists there
            const filteredIndex = filteredParties.findIndex(p => p.id === partyId);
            if (filteredIndex !== -1) {
                filteredParties[filteredIndex] = updatedParty;
            }

            // Save to data service
            DataService.saveParties(allParties);

            // Refresh display
            updateDisplay();
            initializeQuickFilters();

            showNotification('Party updated successfully', 'success');
        }

        closeModal(modal);
    });

    document.body.appendChild(modal);

    // Focus on the first input field
    setTimeout(() => {
        const firstInput = modal.querySelector('#editName');
        if (firstInput) {
            firstInput.focus();
        }
    }, 100);
}

// Modal management functions
function closeModal(modal) {
    // Restore focus to the main content
    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
        mainContent.style.filter = 'none';
        mainContent.style.pointerEvents = 'auto';
    }

    // Remove any blur effects from body
    document.body.style.filter = 'none';
    document.body.style.overflow = 'auto';

    // Remove the modal
    if (modal && modal.parentNode) {
        modal.remove();
    }

    // Restore focus to the previously focused element or main search
    const mainSearch = document.getElementById('mainSearch');
    if (mainSearch) {
        setTimeout(() => {
            mainSearch.focus();
        }, 100);
    }
}

function createModalCloseHandler(modal) {
    return function() {
        closeModal(modal);
    };
}

// Add new party
function addNewParty() {
    // Create add party modal
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;

    modal.innerHTML = `
        <div class="modal-content" style="background: white; border-radius: 8px; padding: 24px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <h2 style="margin: 0;">Add New Party</h2>
                <button class="modal-close-btn" style="background: none; border: none; font-size: 24px; cursor: pointer;">×</button>
            </div>
            <form id="addPartyForm">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 500;">Name *</label>
                        <input type="text" id="addName" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 500;">Party Type</label>
                        <select id="addPartyType" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            <option value="Customer">Customer</option>
                            <option value="Vendor">Vendor</option>
                            <option value="Manufacturer">Manufacturer</option>
                            <option value="Prospect">Prospect</option>
                            <option value="Outside Agency Name">Outside Agency</option>
                            <option value="Clearing Agent">Clearing Agent</option>
                            <option value="Transporter">Transporter</option>
                            <option value="Insurance">Insurance</option>
                            <option value="Financier">Financier</option>
                            <option value="User">User</option>
                            <option value="Contractor">Contractor</option>
                        </select>
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 500;">Email</label>
                        <input type="email" id="addEmail" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 500;">Phone</label>
                        <input type="tel" id="addPhone" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 500;">City</label>
                        <input type="text" id="addCity" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 500;">Country</label>
                        <input type="text" id="addCountry" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 500;">Company</label>
                        <input type="text" id="addCompany" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 500;">Branch</label>
                        <input type="text" id="addBranch" value="Main" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div style="grid-column: span 2;">
                        <label style="display: flex; align-items: center; gap: 8px; font-weight: 500;">
                            <input type="checkbox" id="addIsActive" checked>
                            Active Status
                        </label>
                    </div>
                </div>
                <div style="display: flex; gap: 12px; justify-content: flex-end;">
                    <button type="button" class="modal-cancel-btn" style="padding: 8px 16px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer;">Cancel</button>
                    <button type="submit" style="padding: 8px 16px; border: none; background: var(--primary-color); color: white; border-radius: 4px; cursor: pointer;">Add Party</button>
                </div>
            </form>
        </div>
    `;

    // Add close button event listeners
    const closeBtn = modal.querySelector('.modal-close-btn');
    const cancelBtn = modal.querySelector('.modal-cancel-btn');

    closeBtn.addEventListener('click', createModalCloseHandler(modal));
    cancelBtn.addEventListener('click', createModalCloseHandler(modal));

    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal(modal);
        }
    });

    // Add form submit handler
    modal.querySelector('#addPartyForm').addEventListener('submit', function(e) {
        e.preventDefault();

        // Create new party data
        const newParty = {
            name: document.getElementById('addName').value,
            partyType: document.getElementById('addPartyType').value,
            email: document.getElementById('addEmail').value,
            phone: document.getElementById('addPhone').value,
            city: document.getElementById('addCity').value,
            country: document.getElementById('addCountry').value,
            company: document.getElementById('addCompany').value,
            branch: document.getElementById('addBranch').value,
            region: 'Default',
            isActive: document.getElementById('addIsActive').checked
        };

        // Save new party
        const savedParty = DataService.saveParty(newParty);

        // Add to arrays
        allParties.push(savedParty);
        filteredParties.push(savedParty);

        // Refresh display
        updateDisplay();
        initializeQuickFilters();

        showNotification('Party added successfully', 'success');
        closeModal(modal);
    });

    document.body.appendChild(modal);

    // Focus on the first input field
    setTimeout(() => {
        const firstInput = modal.querySelector('#addName');
        if (firstInput) {
            firstInput.focus();
        }
    }, 100);
}

// Back button functionality
function goBack() {
    // Check if there's a previous page in history
    if (window.history.length > 1) {
        window.history.back();
    } else {
        // Fallback to demo page
        window.location.href = 'aftermarket-demo.html';
    }
}

// Sidebar functions
function toggleSidebar() {
    const sidebar = document.getElementById('advancedSidebar');
    const mainContent = document.getElementById('mainContent');

    isSidebarOpen = !isSidebarOpen;

    if (isSidebarOpen) {
        sidebar.classList.add('open');
        mainContent.classList.add('sidebar-open');
    } else {
        sidebar.classList.remove('open');
        mainContent.classList.remove('sidebar-open');
    }
}

function closeSidebar() {
    const sidebar = document.getElementById('advancedSidebar');
    const mainContent = document.getElementById('mainContent');

    isSidebarOpen = false;
    sidebar.classList.remove('open');
    mainContent.classList.remove('sidebar-open');
}

function clearAdvancedSearch() {
    document.getElementById('advancedSearchForm').reset();
    // Reset to show all parties
    filteredParties = [...allParties];
    applyFilters();
    updateDisplay();
}

function handleAdvancedSearch(e) {
    e.preventDefault();

    const criteria = {
        partyType: document.getElementById('advPartyType').value,
        name: document.getElementById('advName').value.toLowerCase(),
        email: document.getElementById('advEmail').value.toLowerCase(),
        phone: document.getElementById('advPhone').value,
        city: document.getElementById('advCity').value.toLowerCase(),
        country: document.getElementById('advCountry').value.toLowerCase(),
        company: document.getElementById('advCompany').value.toLowerCase(),
        branch: document.getElementById('advBranch').value.toLowerCase(),
        status: document.getElementById('advStatus').value
    };

    // Sync with main search
    syncAdvancedSearchToMain(criteria);

    // Filter parties based on criteria
    filteredParties = allParties.filter(party => {
        // Party type filter
        if (criteria.partyType && party.partyType !== criteria.partyType) {
            return false;
        }

        // Name filter
        if (criteria.name && !party.name.toLowerCase().includes(criteria.name)) {
            return false;
        }

        // Email filter
        if (criteria.email && (!party.email || !party.email.toLowerCase().includes(criteria.email))) {
            return false;
        }

        // Phone filter
        if (criteria.phone && (!party.phone || !party.phone.includes(criteria.phone))) {
            return false;
        }

        // City filter
        if (criteria.city && (!party.city || !party.city.toLowerCase().includes(criteria.city))) {
            return false;
        }

        // Country filter
        if (criteria.country && (!party.country || !party.country.toLowerCase().includes(criteria.country))) {
            return false;
        }

        // Company filter
        if (criteria.company && (!party.company || !party.company.toLowerCase().includes(criteria.company))) {
            return false;
        }

        // Branch filter
        if (criteria.branch && (!party.branch || !party.branch.toLowerCase().includes(criteria.branch))) {
            return false;
        }

        // Status filter
        if (criteria.status) {
            const isActive = criteria.status === 'active';
            if (party.isActive !== isActive) {
                return false;
            }
        }

        return true;
    });

    applyFilters();
    updateDisplay();
    showNotification(`Found ${filteredParties.length} parties matching your criteria`, 'success');
}

// Synchronization functions
function syncMainSearchToAdvanced(searchTerm) {
    if (!searchTerm || mainSearch.dataset.syncing) return;

    // Try to detect what type of search term it is and populate appropriate advanced search fields
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const phonePattern = /[\+]?[1-9]?[\d\s\-\(\)]{7,}/;
    const cityPattern = /in\s+(\w+)/i;

    // Clear previous auto-filled values (but keep user-entered ones)
    const fieldsToCheck = ['advName', 'advEmail', 'advPhone', 'advCity', 'advCompany', 'advPartyType', 'advStatus'];
    fieldsToCheck.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !field.dataset.userEntered) {
            field.value = '';
        }
    });

    // Auto-populate based on search term pattern
    if (emailPattern.test(searchTerm)) {
        document.getElementById('advEmail').value = searchTerm;
        addAdvancedFieldHighlight('advEmail');
    } else if (phonePattern.test(searchTerm)) {
        document.getElementById('advPhone').value = searchTerm;
        addAdvancedFieldHighlight('advPhone');
    } else {
        // Check for city pattern (e.g., "in Seattle")
        const cityMatch = searchTerm.match(cityPattern);
        if (cityMatch) {
            document.getElementById('advCity').value = cityMatch[1];
            addAdvancedFieldHighlight('advCity');
            return;
        }

        // Check if it matches any party type
        const partyTypes = ['Customer', 'Prospect', 'Outside Agency', 'Manufacturer', 'Clearing Agent', 'Transporter', 'Insurance', 'Financier', 'User', 'Vendor', 'Contractor'];
        const matchedType = partyTypes.find(type => type.toLowerCase().includes(searchTerm.toLowerCase()));

        if (matchedType) {
            document.getElementById('advPartyType').value = matchedType;
            addAdvancedFieldHighlight('advPartyType');
        } else if (searchTerm.toLowerCase().includes('active') || searchTerm.toLowerCase().includes('inactive')) {
            const status = searchTerm.toLowerCase().includes('active') ? 'active' : 'inactive';
            document.getElementById('advStatus').value = status;
            addAdvancedFieldHighlight('advStatus');
        } else {
            // Default to name search for general text
            document.getElementById('advName').value = searchTerm;
            addAdvancedFieldHighlight('advName');
        }
    }
}

// Add visual highlight to advanced search field
function addAdvancedFieldHighlight(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.style.borderColor = 'var(--info-color)';
        field.style.boxShadow = '0 0 0 3px rgba(23, 162, 184, 0.1)';

        setTimeout(() => {
            field.style.borderColor = '';
            field.style.boxShadow = '';
        }, 2000);
    }
}

function syncAdvancedSearchToMain(criteria) {
    // Build a search term from advanced criteria
    const searchParts = [];

    if (criteria.name) searchParts.push(criteria.name);
    if (criteria.email) searchParts.push(criteria.email);
    if (criteria.phone) searchParts.push(criteria.phone);
    if (criteria.city) searchParts.push(`in ${criteria.city}`);
    if (criteria.company) searchParts.push(criteria.company);
    if (criteria.partyType) searchParts.push(criteria.partyType.toLowerCase());
    if (criteria.status) searchParts.push(criteria.status);

    // Update main search with combined criteria
    if (searchParts.length > 0) {
        // Temporarily disable sync to prevent infinite loop
        mainSearch.dataset.syncing = 'true';
        mainSearch.value = searchParts.join(' ');
        setTimeout(() => delete mainSearch.dataset.syncing, 100);

        // Add visual indicator that search is synced
        addSyncIndicator();
        showSidebarSyncStatus();
    }
}

// Add visual indicator for synchronized search
function addSyncIndicator() {
    const searchContainer = mainSearch.parentElement;
    let syncIndicator = searchContainer.querySelector('.sync-indicator');

    if (!syncIndicator) {
        syncIndicator = document.createElement('div');
        syncIndicator.className = 'sync-indicator';
        syncIndicator.innerHTML = '<i class="material-icons">sync</i>';
        syncIndicator.style.cssText = `
            position: absolute;
            right: 50px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--info-color);
            font-size: 18px;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        `;
        searchContainer.appendChild(syncIndicator);
    }

    // Show sync indicator
    syncIndicator.style.opacity = '1';

    // Hide after 2 seconds
    setTimeout(() => {
        syncIndicator.style.opacity = '0';
    }, 2000);
}

// Show sync notification
function showSyncNotification(message) {
    let syncNotification = document.getElementById('syncNotification');

    if (!syncNotification) {
        syncNotification = document.createElement('div');
        syncNotification.id = 'syncNotification';
        syncNotification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 24px;
            background: linear-gradient(135deg, var(--info-color), #1976d2);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(23, 162, 184, 0.3);
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 1001;
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        document.body.appendChild(syncNotification);
    }

    syncNotification.innerHTML = `
        <i class="material-icons" style="font-size: 18px;">sync</i>
        ${message}
    `;

    // Show notification
    setTimeout(() => {
        syncNotification.style.transform = 'translateX(0)';
        syncNotification.style.opacity = '1';
    }, 10);

    // Hide notification after 2 seconds
    setTimeout(() => {
        syncNotification.style.transform = 'translateX(100%)';
        syncNotification.style.opacity = '0';
    }, 2000);
}

// Show sidebar sync status
function showSidebarSyncStatus() {
    const syncStatus = document.getElementById('syncStatus');
    if (syncStatus) {
        syncStatus.style.display = 'flex';
        syncStatus.style.animation = 'pulse 1s ease-in-out';

        setTimeout(() => {
            syncStatus.style.display = 'none';
            syncStatus.style.animation = '';
        }, 3000);
    }
}

function deleteParty(partyId) {
    if (confirm('Are you sure you want to delete this party?')) {
        allParties = allParties.filter(p => p.id !== partyId);
        filteredParties = filteredParties.filter(p => p.id !== partyId);
        DataService.saveParties(allParties);
        updateDisplay();
        showNotification('Party deleted successfully', 'success');
    }
}

// Utility functions
function showLoading(show) {
    if (show) {
        loadingState.style.display = 'flex';
        partyContainer.style.display = 'none';
        partyList.style.display = 'none';
        emptyState.style.display = 'none';
    } else {
        loadingState.style.display = 'none';
    }
}

function showEmptyState() {
    emptyState.style.display = 'block';
    partyContainer.style.display = 'none';
    partyList.style.display = 'none';
}

function hideEmptyState() {
    emptyState.style.display = 'none';
}

function showError(message) {
    loadingState.innerHTML = `
        <div style="text-align: center; color: var(--error-color);">
            <i class="material-icons" style="font-size: 48px; margin-bottom: 16px;">error</i>
            <div style="font-size: 18px; margin-bottom: 8px;">Error</div>
            <div style="font-size: 14px;">${message}</div>
        </div>
    `;
}

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

function showNotification(message, type = 'info') {
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            padding: 16px 24px;
            border-radius: 4px;
            color: white;
            font-weight: 500;
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
            transform: translateY(100px);
            opacity: 0;
            transition: transform 0.3s, opacity 0.3s;
            z-index: 1000;
            max-width: 400px;
        `;
        document.body.appendChild(notification);
    }

    notification.textContent = message;

    const colors = {
        success: '#4caf50',
        error: '#f44336',
        warning: '#ff9800',
        info: '#2196f3'
    };
    notification.style.backgroundColor = colors[type] || colors.info;

    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    }, 10);

    setTimeout(() => {
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';
    }, 3000);
}

// Navigation Sidebar Functions
function toggleNavSidebar() {
    const navSidebar = document.getElementById('navSidebar');
    const navOverlay = document.getElementById('navOverlay');

    isNavSidebarOpen = !isNavSidebarOpen;

    if (isNavSidebarOpen) {
        navSidebar.classList.add('open');
        navOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        navSidebar.classList.remove('open');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function closeNavSidebar() {
    const navSidebar = document.getElementById('navSidebar');
    const navOverlay = document.getElementById('navOverlay');

    isNavSidebarOpen = false;
    navSidebar.classList.remove('open');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Navigation Functions for Top Menu and Sidebar
function openCustomer360() {
    navigateToCustomer360FromBreadcrumb();
    closeNavSidebar(); // Close sidebar if open
}

function openEquipmentManagement() {
    navigateToEquipmentFromBreadcrumb();
    closeNavSidebar(); // Close sidebar if open
}

function openWarrantyTracker() {
    navigateToWarrantyFromBreadcrumb();
    closeNavSidebar(); // Close sidebar if open
}

function openServiceHistory() {
    showNotification('Opening Service History...', 'info');
    // Add navigation logic here
    console.log('Navigate to Service History');
}

function openReports() {
    showNotification('Opening Reports & Analytics...', 'info');
    // Add navigation logic here
    console.log('Navigate to Reports & Analytics');
}

function openDashboard() {
    showNotification('Opening Executive Dashboard...', 'info');
    // Add navigation logic here
    console.log('Navigate to Executive Dashboard');
}

function openUserManagement() {
    showNotification('Opening User Management...', 'info');
    setTimeout(() => {
        window.open('user-management.html', '_blank');
    }, 500);
}

function openSettings() {
    showNotification('Opening System Settings...', 'info');
    setTimeout(() => {
        window.open('system-settings.html', '_blank');
    }, 500);
}

// Breadcrumb Navigation Functions
function navigateToHome() {
    addToHistory('home', 'Aftermarket Software', 'home');
    updateBreadcrumb([
        { name: 'Aftermarket Software', icon: 'home', active: true, onclick: 'navigateToHome()' }
    ]);
    showNotification('Navigating to Home...', 'info');
    console.log('Navigate to Home Dashboard');
}

function navigateToPartyManagement() {
    addToHistory('party-management', 'Party Management', 'people');
    updateBreadcrumb([
        { name: 'Aftermarket Software', icon: 'home', active: false, onclick: 'navigateToHome()' },
        { name: 'Party Management', icon: 'people', active: true, onclick: 'navigateToPartyManagement()' }
    ]);
    showNotification('Navigating to Party Management...', 'info');
    console.log('Navigate to Party Management Overview');
}

function navigateToCustomer360FromBreadcrumb() {
    addToHistory('customer-360', 'Customer 360 View', 'dashboard');
    updateBreadcrumb([
        { name: 'Aftermarket Software', icon: 'home', active: false, onclick: 'navigateToHome()' },
        { name: 'Party Management', icon: 'people', active: false, onclick: 'navigateToPartyManagement()' },
        { name: 'Customer 360 View', icon: 'dashboard', active: true, onclick: 'navigateToCustomer360FromBreadcrumb()' }
    ]);
    openCustomer360();
}

function navigateToEquipmentFromBreadcrumb() {
    addToHistory('equipment-management', 'Equipment Management', 'precision_manufacturing');
    updateBreadcrumb([
        { name: 'Aftermarket Software', icon: 'home', active: false, onclick: 'navigateToHome()' },
        { name: 'Equipment & Assets', icon: 'precision_manufacturing', active: false, onclick: 'navigateToEquipmentFromBreadcrumb()' },
        { name: 'Equipment Management', icon: 'precision_manufacturing', active: true, onclick: 'navigateToEquipmentFromBreadcrumb()' }
    ]);
    openEquipmentManagement();
}

function navigateToWarrantyFromBreadcrumb() {
    addToHistory('warranty-tracker', 'Warranty Tracker', 'verified_user');
    updateBreadcrumb([
        { name: 'Aftermarket Software', icon: 'home', active: false, onclick: 'navigateToHome()' },
        { name: 'Equipment & Assets', icon: 'precision_manufacturing', active: false, onclick: 'navigateToEquipmentFromBreadcrumb()' },
        { name: 'Warranty Tracker', icon: 'verified_user', active: true, onclick: 'navigateToWarrantyFromBreadcrumb()' }
    ]);
    openWarrantyTracker();
}

// Update breadcrumb display
function updateBreadcrumb(items) {
    const container = document.getElementById('breadcrumbContainer');
    container.innerHTML = '';

    items.forEach((item, index) => {
        // Add breadcrumb item
        const breadcrumbItem = document.createElement('div');
        breadcrumbItem.className = 'breadcrumb-item';

        const link = document.createElement('a');
        link.href = '#';
        link.className = `breadcrumb-link ${item.active ? 'active' : ''}`;
        link.onclick = () => eval(item.onclick);

        link.innerHTML = `
            <i class="material-icons breadcrumb-icon">${item.icon}</i>
            <span>${item.name}</span>
        `;

        breadcrumbItem.appendChild(link);
        container.appendChild(breadcrumbItem);

        // Add separator (except for last item)
        if (index < items.length - 1) {
            const separator = document.createElement('i');
            separator.className = 'material-icons breadcrumb-separator';
            separator.textContent = 'chevron_right';
            container.appendChild(separator);
        }
    });
}

// Add to navigation history
function addToHistory(pageId, pageName, icon) {
    const historyItem = {
        id: pageId,
        name: pageName,
        icon: icon,
        timestamp: new Date()
    };

    // Remove if already exists
    navigationHistory = navigationHistory.filter(item => item.id !== pageId);

    // Add to beginning
    navigationHistory.unshift(historyItem);

    // Keep only last 10 items
    if (navigationHistory.length > 10) {
        navigationHistory = navigationHistory.slice(0, 10);
    }

    currentPage = pageId;
}

// Quick Action Functions
function goBack() {
    if (navigationHistory.length > 1) {
        const previousPage = navigationHistory[1];
        showNotification(`Going back to ${previousPage.name}...`, 'info');

        // Remove current page from history
        navigationHistory.shift();

        // Navigate to previous page
        switch(previousPage.id) {
            case 'home':
                navigateToHome();
                break;
            case 'party-management':
                navigateToPartyManagement();
                break;
            case 'customer-360':
                navigateToCustomer360FromBreadcrumb();
                break;
            case 'equipment-management':
                navigateToEquipmentFromBreadcrumb();
                break;
            case 'warranty-tracker':
                navigateToWarrantyFromBreadcrumb();
                break;
            default:
                showNotification('Cannot go back further', 'warning');
        }
    } else {
        showNotification('No previous page to go back to', 'warning');
    }
}

function refreshPage() {
    showNotification('Refreshing page...', 'info');

    // Refresh data
    loadPartyData();

    // Reset filters
    clearAllFilters();

    // Reset search
    if (mainSearch) {
        mainSearch.value = '';
        handleSearch();
    }

    showNotification('Page refreshed successfully', 'success');
}

function toggleBookmark() {
    const bookmarkBtn = document.getElementById('bookmarkBtn');
    const icon = bookmarkBtn.querySelector('i');

    isBookmarked = !isBookmarked;

    if (isBookmarked) {
        icon.textContent = 'bookmark';
        bookmarkBtn.classList.add('active');
        showNotification('Page bookmarked', 'success');
    } else {
        icon.textContent = 'bookmark_border';
        bookmarkBtn.classList.remove('active');
        showNotification('Bookmark removed', 'info');
    }
}

function shareCurrentPage() {
    const shareData = {
        title: 'Aftermarket Software - Party Details',
        text: 'Check out this party management system',
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData)
            .then(() => showNotification('Page shared successfully', 'success'))
            .catch(() => showNotification('Share cancelled', 'info'));
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href)
            .then(() => showNotification('Link copied to clipboard', 'success'))
            .catch(() => showNotification('Could not copy link', 'error'));
    }
}

function openHelp() {
    showNotification('Opening help documentation...', 'info');

    // Create help modal or navigate to help page
    const helpContent = `
        <div style="max-width: 600px; padding: 20px;">
            <h3>Party Management Help</h3>
            <div style="margin: 20px 0;">
                <h4>Navigation:</h4>
                <ul>
                    <li>Use breadcrumbs to navigate between sections</li>
                    <li>Click the menu button to access the navigation sidebar</li>
                    <li>Use quick actions for common tasks</li>
                </ul>

                <h4>Search Features:</h4>
                <ul>
                    <li>Smart Search: AI-powered search with pattern recognition</li>
                    <li>Advanced Search: Detailed filtering options</li>
                    <li>Voice Search: Speak your search terms</li>
                    <li>Quick Filters: One-click filtering by category</li>
                </ul>

                <h4>Keyboard Shortcuts:</h4>
                <ul>
                    <li>Ctrl+F: Focus search</li>
                    <li>Ctrl+B: Toggle bookmark</li>
                    <li>Ctrl+R: Refresh page</li>
                    <li>Alt+Left: Go back</li>
                </ul>
            </div>
        </div>
    `;

    console.log('Help content:', helpContent);
}

// Keyboard Shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl+F: Focus search
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            if (mainSearch) {
                mainSearch.focus();
                mainSearch.select();
            }
        }

        // Ctrl+B: Toggle bookmark
        if (e.ctrlKey && e.key === 'b') {
            e.preventDefault();
            toggleBookmark();
        }

        // Ctrl+R: Refresh page (prevent default browser refresh)
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            refreshPage();
        }

        // Alt+Left: Go back
        if (e.altKey && e.key === 'ArrowLeft') {
            e.preventDefault();
            goBack();
        }

        // Escape: Close sidebars
        if (e.key === 'Escape') {
            if (isNavSidebarOpen) {
                closeNavSidebar();
            }
            if (isSidebarOpen) {
                closeSidebar();
            }
        }

        // Ctrl+M: Toggle navigation menu
        if (e.ctrlKey && e.key === 'm') {
            e.preventDefault();
            toggleNavSidebar();
        }

        // Ctrl+Shift+A: Toggle advanced search
        if (e.ctrlKey && e.shiftKey && e.key === 'A') {
            e.preventDefault();
            toggleSidebar();
        }
    });
}

// Bulk Operations Functions
function toggleSelectAll() {
    const headerSelectAll = document.getElementById('headerSelectAll');
    const rowCheckboxes = document.querySelectorAll('.row-checkbox');
    const isChecked = headerSelectAll.checked;

    rowCheckboxes.forEach(checkbox => {
        checkbox.checked = isChecked;
        const row = checkbox.closest('tr');
        if (isChecked) {
            row.classList.add('selected');
        } else {
            row.classList.remove('selected');
        }
    });

    updateBulkActions();
}

function updateBulkActions() {
    const selectedCheckboxes = document.querySelectorAll('.row-checkbox:checked');
    const selectedCount = selectedCheckboxes.length;
    const compactBulkActions = document.getElementById('compactBulkActions');
    const selectedCountSpan = document.getElementById('selectedCount');
    const partyGrid = document.getElementById('partyGrid');

    if (selectedCount > 0) {
        compactBulkActions.style.display = 'block';
        selectedCountSpan.textContent = selectedCount;
        partyGrid.classList.add('has-selection');
    } else {
        compactBulkActions.style.display = 'none';
        partyGrid.classList.remove('has-selection');
    }

    // Update row selection styling
    selectedCheckboxes.forEach(checkbox => {
        checkbox.closest('tr').classList.add('selected');
    });

    document.querySelectorAll('.row-checkbox:not(:checked)').forEach(checkbox => {
        checkbox.closest('tr').classList.remove('selected');
    });

    // Update select all checkbox state
    const allCheckboxes = document.querySelectorAll('.row-checkbox');
    const headerSelectAll = document.getElementById('headerSelectAll');

    if (selectedCount === 0) {
        headerSelectAll.indeterminate = false;
        headerSelectAll.checked = false;
    } else if (selectedCount === allCheckboxes.length) {
        headerSelectAll.indeterminate = false;
        headerSelectAll.checked = true;
    } else {
        headerSelectAll.indeterminate = true;
        headerSelectAll.checked = false;
    }
}

function bulkDeleteParties() {
    const selectedCheckboxes = document.querySelectorAll('.row-checkbox:checked');
    const selectedIds = Array.from(selectedCheckboxes).map(cb => cb.value);

    if (selectedIds.length === 0) {
        showNotification('No parties selected for deletion', 'warning');
        return;
    }

    const confirmMessage = `Are you sure you want to delete ${selectedIds.length} selected ${selectedIds.length === 1 ? 'party' : 'parties'}? This action cannot be undone.`;

    if (confirm(confirmMessage)) {
        // Remove from arrays
        allParties = allParties.filter(party => !selectedIds.includes(party.id));
        filteredParties = filteredParties.filter(party => !selectedIds.includes(party.id));

        // Save to data service
        DataService.saveParties(allParties);

        // Refresh display
        updateDisplay();
        initializeQuickFilters();

        // Reset bulk actions
        clearSelection();

        showNotification(`${selectedIds.length} ${selectedIds.length === 1 ? 'party' : 'parties'} deleted successfully`, 'success');
    }
}

// Clear all selections
function clearSelection() {
    const headerSelectAll = document.getElementById('headerSelectAll');
    const rowCheckboxes = document.querySelectorAll('.row-checkbox');

    headerSelectAll.checked = false;
    headerSelectAll.indeterminate = false;

    rowCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
        checkbox.closest('tr').classList.remove('selected');
    });

    updateBulkActions();
}

// Column search and sort functionality
let columnSearchFilters = {};
let currentColumnSort = { column: null, direction: 'asc' };

// Search within a specific column
function searchColumn(input) {
    const column = input.dataset.column;
    const value = input.value.toLowerCase().trim();
    const clearIcon = input.parentElement.querySelector('.search-clear-icon');

    // Update column search filters
    if (value) {
        columnSearchFilters[column] = value;
        input.classList.add('has-value');
        clearIcon.style.display = 'block';
    } else {
        delete columnSearchFilters[column];
        input.classList.remove('has-value');
        clearIcon.style.display = 'none';
    }

    // Apply all filters
    applyColumnFilters();
}

// Apply column filters to the data
function applyColumnFilters() {
    // Use the unified filtering system
    applyFilters();
    updateDisplay();
    updateResultsInfo();
}

// Clear individual column search
function clearColumnSearch(clearIcon) {
    const container = clearIcon.parentElement;
    const input = container.querySelector('.column-search-input, .column-search-select');
    const column = input.dataset.column;

    input.value = '';
    input.classList.remove('has-value');
    clearIcon.style.display = 'none';

    delete columnSearchFilters[column];
    applyColumnFilters();
}

// Clear all column searches
function clearAllColumnSearches() {
    const searchInputs = document.querySelectorAll('.column-search-input, .column-search-select');
    const clearIcons = document.querySelectorAll('.search-clear-icon');

    searchInputs.forEach(input => {
        input.value = '';
        input.classList.remove('has-value');
    });

    clearIcons.forEach(icon => {
        icon.style.display = 'none';
    });

    columnSearchFilters = {};
    applyColumnFilters();

    showNotification('All column searches cleared', 'success');
}



// Toggle column search row visibility
function toggleColumnSearch() {
    const columnSearchRow = document.querySelector('.column-search-row');
    const toggleBtn = document.getElementById('columnSearchToggle');

    if (columnSearchRow.style.display === 'none') {
        columnSearchRow.style.display = '';
        toggleBtn.classList.add('active');
        toggleBtn.innerHTML = '<i class="material-icons">search</i><span>Column Search</span>';
        showNotification('Column search enabled', 'info');
    } else {
        columnSearchRow.style.display = 'none';
        toggleBtn.classList.remove('active');
        toggleBtn.innerHTML = '<i class="material-icons">search_off</i><span>Column Search</span>';
        showNotification('Column search hidden', 'info');
    }
}

// Horizontal scrolling functions
function scrollGridLeft() {
    const container = document.getElementById('gridScrollContainer');
    container.scrollBy({ left: -300, behavior: 'smooth' });
    updateScrollIndicators();
}

function scrollGridRight() {
    const container = document.getElementById('gridScrollContainer');
    container.scrollBy({ left: 300, behavior: 'smooth' });
    updateScrollIndicators();
}

function updateScrollIndicators() {
    const container = document.getElementById('gridScrollContainer');
    const leftBtn = document.getElementById('scrollLeft');
    const rightBtn = document.getElementById('scrollRight');

    if (!container || !leftBtn || !rightBtn) return;

    const isAtStart = container.scrollLeft <= 0;
    const isAtEnd = container.scrollLeft >= container.scrollWidth - container.clientWidth;

    leftBtn.classList.toggle('hidden', isAtStart);
    rightBtn.classList.toggle('hidden', isAtEnd);
}

// Column visibility functions
function toggleColumnVisibility() {
    const menu = document.getElementById('columnVisibilityMenu');
    menu.classList.toggle('show');

    // Close menu when clicking outside
    document.addEventListener('click', function closeMenu(e) {
        if (!e.target.closest('.column-visibility-dropdown')) {
            menu.classList.remove('show');
            document.removeEventListener('click', closeMenu);
        }
    });
}

// Enhanced column visibility functions
function toggleColumn(columnName) {
    // Prevent hiding the name column (required)
    if (columnName === 'name') {
        showNotification('Name column cannot be hidden as it is required', 'warning');
        return;
    }

    const checkbox = document.getElementById(`col-${columnName === 'accountNumber' ? 'account' : columnName === 'partyType' ? 'type' : columnName}`);
    const isVisible = checkbox.checked;

    // Find column by data-column attribute
    const headers = document.querySelectorAll('.grid-table th[data-column]');
    let columnIndex = -1;

    headers.forEach((header, index) => {
        if (header.getAttribute('data-column') === columnName) {
            columnIndex = index + 1; // +1 because of checkbox column
        }
    });

    if (columnIndex === -1) return;

    // Toggle column visibility
    const table = document.querySelector('.grid-table');
    const rows = table.querySelectorAll('tr');

    rows.forEach(row => {
        const cell = row.children[columnIndex];
        if (cell) {
            cell.style.display = isVisible ? '' : 'none';
        }
    });

    // Update button text to show hidden column count
    updateColumnVisibilityButton();

    showNotification(`${getColumnDisplayName(columnName)} column ${isVisible ? 'shown' : 'hidden'}`, 'info');
}

function getColumnDisplayName(columnName) {
    const displayNames = {
        'accountNumber': 'Account Number',
        'partyType': 'Party Type',
        'email': 'Email',
        'phone': 'Phone',
        'mobile': 'Mobile',
        'location': 'Location',
        'address': 'Address',
        'company': 'Company',
        'status': 'Status'
    };
    return displayNames[columnName] || columnName;
}

function showAllColumns() {
    const checkboxes = document.querySelectorAll('.column-visibility-item input[type="checkbox"]:not([disabled])');
    checkboxes.forEach(checkbox => {
        if (!checkbox.checked) {
            checkbox.checked = true;
            const columnName = checkbox.id.replace('col-', '').replace('account', 'accountNumber').replace('type', 'partyType');
            toggleColumn(columnName);
        }
    });
    showNotification('All columns are now visible', 'success');
}

function hideAllColumns() {
    const checkboxes = document.querySelectorAll('.column-visibility-item input[type="checkbox"]:not([disabled])');
    let hiddenCount = 0;

    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            checkbox.checked = false;
            const columnName = checkbox.id.replace('col-', '').replace('account', 'accountNumber').replace('type', 'partyType');
            toggleColumn(columnName);
            hiddenCount++;
        }
    });

    if (hiddenCount > 0) {
        showNotification(`${hiddenCount} columns hidden. Name column remains visible.`, 'info');
    } else {
        showNotification('No columns to hide', 'info');
    }
}

function resetColumnVisibility() {
    const checkboxes = document.querySelectorAll('.column-visibility-item input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        if (!checkbox.disabled && !checkbox.checked) {
            checkbox.checked = true;
            const columnName = checkbox.id.replace('col-', '').replace('account', 'accountNumber').replace('type', 'partyType');
            toggleColumn(columnName);
        }
    });
    showNotification('Column visibility reset to default', 'success');
}

function updateColumnVisibilityButton() {
    const btn = document.querySelector('.column-visibility-btn span');
    const hiddenColumns = document.querySelectorAll('.column-visibility-item input[type="checkbox"]:not([disabled]):not(:checked)');
    const hiddenCount = hiddenColumns.length;

    if (hiddenCount > 0) {
        btn.textContent = `Show/Hide Columns (${hiddenCount} hidden)`;
    } else {
        btn.textContent = 'Show/Hide Columns';
    }
}

// Drag to scroll functionality
let isDragging = false;
let startX = 0;
let scrollLeft = 0;

function initializeDragScroll() {
    const container = document.getElementById('gridScrollContainer');
    const dragIndicator = document.getElementById('dragScrollIndicator');

    if (!container) return;

    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
        container.style.cursor = 'grabbing';
        dragIndicator.classList.add('show');
    });

    container.addEventListener('mouseleave', () => {
        isDragging = false;
        container.style.cursor = 'grab';
        dragIndicator.classList.remove('show');
    });

    container.addEventListener('mouseup', () => {
        isDragging = false;
        container.style.cursor = 'grab';
        dragIndicator.classList.remove('show');
    });

    container.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        container.scrollLeft = scrollLeft - walk;
        updateScrollIndicators();
    });

    // Touch events for mobile
    container.addEventListener('touchstart', (e) => {
        startX = e.touches[0].pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
    });

    container.addEventListener('touchmove', (e) => {
        const x = e.touches[0].pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        container.scrollLeft = scrollLeft - walk;
        updateScrollIndicators();
    });

    // Update scroll indicators on scroll
    container.addEventListener('scroll', updateScrollIndicators);

    // Initialize scroll indicators
    setTimeout(updateScrollIndicators, 100);
}

// Initialize drag scroll when grid view is shown
function initializeGridScrollFeatures() {
    // Initialize drag scroll functionality
    initializeDragScroll();

    // Set initial cursor style
    const container = document.getElementById('gridScrollContainer');
    if (container) {
        container.style.cursor = 'grab';
    }
}

// ==================== NAVIGATION FUNCTIONALITY ====================

// Top Menu Functions - Most Used
function openCustomer360() {
    showNotification('Opening Customer 360 View...', 'info');
    setTimeout(() => {
        window.open('customer-360-view.html', '_blank');
    }, 500);
}

function openEquipmentManagement() {
    showNotification('Opening Equipment Management...', 'info');
    setTimeout(() => {
        window.open('equipment-management.html', '_blank');
    }, 500);
}

function openWarrantyTracker() {
    showNotification('Opening Warranty Tracker...', 'info');
    setTimeout(() => {
        window.open('warranty-tracker.html', '_blank');
    }, 500);
}

// Top Menu Functions - Recently Used
function openServiceHistory() {
    showNotification('Opening Service History...', 'info');
    setTimeout(() => {
        window.open('service-history.html', '_blank');
    }, 500);
}

function openReports() {
    showNotification('Opening Reports & Analytics...', 'info');
    setTimeout(() => {
        window.open('reports-analytics.html', '_blank');
    }, 500);
}

// Breadcrumb Navigation Functions
function navigateToHome() {
    showNotification('Navigating to Home...', 'info');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 500);
}

function navigateToPartyManagement() {
    showNotification('Navigating to Party Management...', 'info');
    setTimeout(() => {
        window.location.href = 'party-management.html';
    }, 500);
}

// Quick Action Bar Functions
function goBack() {
    if (navigationHistory.length > 1) {
        navigationHistory.pop(); // Remove current page
        const previousPage = navigationHistory[navigationHistory.length - 1];
        showNotification(`Going back to ${previousPage}...`, 'info');
        setTimeout(() => {
            window.history.back();
        }, 300);
    } else {
        showNotification('No previous page in history', 'warning');
    }
}

function refreshPage() {
    showNotification('Refreshing page...', 'info');
    setTimeout(() => {
        window.location.reload();
    }, 300);
}

function toggleBookmark() {
    isBookmarked = !isBookmarked;
    const bookmarkBtn = document.getElementById('bookmarkBtn');
    const icon = bookmarkBtn.querySelector('i');

    if (isBookmarked) {
        icon.textContent = 'bookmark';
        bookmarkBtn.classList.add('active');
        showNotification('Page bookmarked!', 'success');

        // Save to localStorage
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        bookmarks.push({
            title: 'Party Details - Advanced View',
            url: window.location.href,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    } else {
        icon.textContent = 'bookmark_border';
        bookmarkBtn.classList.remove('active');
        showNotification('Bookmark removed', 'info');

        // Remove from localStorage
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        const updatedBookmarks = bookmarks.filter(b => b.url !== window.location.href);
        localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
    }
}

function shareCurrentPage() {
    if (navigator.share) {
        navigator.share({
            title: 'Party Details - Advanced View',
            text: 'Check out this Party Management interface',
            url: window.location.href
        }).then(() => {
            showNotification('Page shared successfully!', 'success');
        }).catch(() => {
            fallbackShare();
        });
    } else {
        fallbackShare();
    }
}

function fallbackShare() {
    // Copy URL to clipboard
    navigator.clipboard.writeText(window.location.href).then(() => {
        showNotification('Page URL copied to clipboard!', 'success');
    }).catch(() => {
        // Create a modal with share options
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.5); display: flex; align-items: center;
            justify-content: center; z-index: 1000;
        `;

        modal.innerHTML = `
            <div class="modal-content" style="background: white; padding: 24px; border-radius: 8px; max-width: 400px; width: 90%;">
                <h3 style="margin-bottom: 16px;">Share This Page</h3>
                <div style="margin-bottom: 16px;">
                    <input type="text" value="${window.location.href}" readonly
                           style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                <div style="display: flex; gap: 8px;">
                    <button class="copy-url-btn"
                            style="flex: 1; padding: 8px; background: var(--primary-color); color: white; border: none; border-radius: 4px; cursor: pointer;">
                        Copy URL
                    </button>
                    <button class="modal-close-btn"
                            style="padding: 8px 16px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        Close
                    </button>
                </div>
            </div>
        `;

        // Add event listeners
        const copyBtn = modal.querySelector('.copy-url-btn');
        const closeBtn = modal.querySelector('.modal-close-btn');
        const urlInput = modal.querySelector('input');

        copyBtn.addEventListener('click', function() {
            urlInput.select();
            document.execCommand('copy');
            showNotification('URL copied!', 'success');
            closeModal(modal);
        });

        closeBtn.addEventListener('click', createModalCloseHandler(modal));

        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal(modal);
            }
        });

        document.body.appendChild(modal);
    });
}

function openHelp() {
    showNotification('Opening Help Center...', 'info');

    // Create help modal
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.5); display: flex; align-items: center;
        justify-content: center; z-index: 1000;
    `;

    modal.innerHTML = `
        <div class="modal-content" style="background: white; padding: 24px; border-radius: 8px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <h2 style="margin: 0;">Help & Support</h2>
                <button class="modal-close-btn" style="background: none; border: none; font-size: 24px; cursor: pointer;">×</button>
            </div>

            <div style="display: grid; gap: 16px;">
                <div style="padding: 16px; border: 1px solid #ddd; border-radius: 8px;">
                    <h3 style="margin-bottom: 8px;">🔍 Search & Filters</h3>
                    <p style="margin: 0; color: #666;">Use the main search bar for quick searches, or click "Advanced Search" for detailed filtering options.</p>
                </div>

                <div style="padding: 16px; border: 1px solid #ddd; border-radius: 8px;">
                    <h3 style="margin-bottom: 8px;">👁️ View Options</h3>
                    <p style="margin: 0; color: #666;">Switch between Card, List, Compact, and Grid views using the view toggle buttons.</p>
                </div>

                <div style="padding: 16px; border: 1px solid #ddd; border-radius: 8px;">
                    <h3 style="margin-bottom: 8px;">📊 Column Management</h3>
                    <p style="margin: 0; color: #666;">In Grid view, use "Show/Hide Columns" to customize which columns are visible.</p>
                </div>

                <div style="padding: 16px; border: 1px solid #ddd; border-radius: 8px;">
                    <h3 style="margin-bottom: 8px;">🎤 Voice Search</h3>
                    <p style="margin: 0; color: #666;">Click the microphone icon to search using voice commands.</p>
                </div>

                <div style="padding: 16px; border: 1px solid #ddd; border-radius: 8px;">
                    <h3 style="margin-bottom: 8px;">📱 Keyboard Shortcuts</h3>
                    <p style="margin: 0; color: #666;">
                        • Ctrl+F: Focus search<br>
                        • Ctrl+K: Open advanced search<br>
                        • Escape: Close modals/sidebars
                    </p>
                </div>
            </div>

            <div style="margin-top: 24px; text-align: center;">
                <button onclick="window.open('mailto:support@aftermarket-software.com', '_blank')"
                        style="padding: 12px 24px; background: var(--primary-color); color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 8px;">
                    Contact Support
                </button>
                <button onclick="window.open('user-manual.pdf', '_blank')"
                        style="padding: 12px 24px; background: var(--info-color); color: white; border: none; border-radius: 4px; cursor: pointer;">
                    User Manual
                </button>
            </div>
        </div>
    `;

    // Add close button event listener
    const closeBtn = modal.querySelector('.modal-close-btn');
    closeBtn.addEventListener('click', createModalCloseHandler(modal));

    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal(modal);
        }
    });

    document.body.appendChild(modal);
}

// Sidebar Navigation Functions
function openDashboard() {
    showNotification('Opening Executive Dashboard...', 'info');
    setTimeout(() => {
        window.open('executive-dashboard.html', '_blank');
    }, 500);
}

function openUserManagement() {
    showNotification('Opening User Management...', 'info');
    setTimeout(() => {
        window.open('user-management.html', '_blank');
    }, 500);
}

function openSettings() {
    showNotification('Opening System Settings...', 'info');
    setTimeout(() => {
        window.open('system-settings.html', '_blank');
    }, 500);
}

function openThemeConfigurator() {
    showNotification('Opening Theme Configuration...', 'info');
    setTimeout(() => {
        window.open('theme-configurator.html', '_blank');
    }, 500);
}

// Navigation Sidebar Functions
function toggleNavSidebar() {
    isNavSidebarOpen = !isNavSidebarOpen;
    const navSidebar = document.getElementById('navSidebar');
    const navOverlay = document.getElementById('navOverlay');

    if (isNavSidebarOpen) {
        navSidebar.classList.add('open');
        navOverlay.classList.add('active');
        showNotification('Navigation menu opened', 'info');
    } else {
        navSidebar.classList.remove('open');
        navOverlay.classList.remove('active');
    }
}

function closeNavSidebar() {
    isNavSidebarOpen = false;
    const navSidebar = document.getElementById('navSidebar');
    const navOverlay = document.getElementById('navOverlay');

    navSidebar.classList.remove('open');
    navOverlay.classList.remove('active');
}

// Initialize navigation history
function initializeNavigation() {
    navigationHistory.push('Party Details');

    // Check if page is bookmarked
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    const isCurrentPageBookmarked = bookmarks.some(b => b.url === window.location.href);

    if (isCurrentPageBookmarked) {
        isBookmarked = true;
        const bookmarkBtn = document.getElementById('bookmarkBtn');
        const icon = bookmarkBtn.querySelector('i');
        icon.textContent = 'bookmark';
        bookmarkBtn.classList.add('active');
    }
}

// Keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl+F - Focus search
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            const mainSearch = document.getElementById('mainSearch');
            if (mainSearch) {
                mainSearch.focus();
                showNotification('Search focused', 'info');
            }
        }

        // Ctrl+K - Open advanced search
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            toggleSidebar();
        }

        // Escape - Close modals/sidebars
        if (e.key === 'Escape') {
            // Close navigation sidebar
            if (isNavSidebarOpen) {
                closeNavSidebar();
            }

            // Close advanced search sidebar
            if (isSidebarOpen) {
                closeSidebar();
            }

            // Close any open modals
            const modals = document.querySelectorAll('.modal-overlay');
            modals.forEach(modal => {
                closeModal(modal);
            });
        }

        // Ctrl+1-4 - Switch views
        if (e.ctrlKey && ['1', '2', '3', '4'].includes(e.key)) {
            e.preventDefault();
            const views = ['card', 'list', 'compact', 'grid'];
            const viewIndex = parseInt(e.key) - 1;
            if (views[viewIndex]) {
                switchView(views[viewIndex]);
                showNotification(`Switched to ${views[viewIndex]} view`, 'info');
            }
        }

        // Ctrl+R - Refresh (override default to show notification)
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            refreshPage();
        }

        // Ctrl+B - Toggle bookmark
        if (e.ctrlKey && e.key === 'b') {
            e.preventDefault();
            toggleBookmark();
        }
    });
}

// Initialize all navigation functionality
function initializeAllNavigation() {
    initializeNavigation();
    setupKeyboardShortcuts();

    // Add navigation event listeners
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize navigation history
        navigationHistory.push('Party Details');

        // Set up navigation active states
        updateNavigationActiveStates();
    });
}

function updateNavigationActiveStates() {
    // Update sidebar active states based on current page
    const currentPage = 'party-details';
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.classList.remove('active');
        const link = item.querySelector('.nav-link');
        if (link && link.textContent.toLowerCase().includes('party details')) {
            item.classList.add('active');
        }
    });
}

// Call initialization
initializeAllNavigation();

// Add a global function to reset party data (for debugging)
window.resetPartyData = function() {
    console.log('Resetting party data...');
    localStorage.removeItem('aftermarket_parties');
    DataService.initialize();
    location.reload();
};

// Add a global function to show all parties (for debugging)
window.showAllParties = function() {
    console.log('Showing all parties...');
    allParties = DataService.getParties();
    filteredParties = [...allParties];
    activeFilters = {
        partyType: [],
        status: [],
        location: [],
        company: []
    };
    if (mainSearch) mainSearch.value = '';
    updateDisplay();
    console.log('All parties displayed:', filteredParties.length);
};