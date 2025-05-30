// Column Search Functionality for Material Design Tables

// Global state for column searches
let activeColumnSearches = {};
let originalTableData = [];
let currentTableType = '';

// Column name mappings for different table types
const columnMappings = {
    'customer': {
        1: 'Customer Invoice',
        2: 'Customer Name',
        3: 'Payment Mode',
        4: 'Date',
        5: 'Work Order',
        6: 'Work Order Date',
        7: 'Serial',
        8: 'Model',
        9: 'Draft Amount',
        10: 'Tax Amount',
        11: 'Invoice Amount',
        12: 'SAP Status'
    },
    'service-return': {
        1: 'Service Return',
        2: 'Customer Invoice',
        3: 'Return Date',
        4: 'Full Return',
        5: 'Serial',
        6: 'Model',
        7: 'Customer Name',
        8: 'Generated Through',
        9: 'Credit Amount'
    },
    'internal': {
        1: 'Internal Invoice',
        2: 'Customer Account',
        3: 'Customer Name',
        4: 'Date',
        5: 'Work Order',
        6: 'Work Order Date',
        7: 'Serial',
        8: 'Model',
        9: 'SAP Status',
        10: 'Invoice Amount',
        11: 'Branch'
    },
    'internal-return': {
        1: 'Return ID',
        2: 'Return Date',
        3: 'Internal Invoice',
        4: 'Full Return',
        5: 'Customer Name',
        6: 'Serial',
        7: 'Model'
    }
};

/**
 * Initialize column search functionality
 * @param {string} tableType - Type of table (customer, service-return, internal, internal-return)
 * @param {Array} data - Original table data
 */
function initializeColumnSearch(tableType, data = []) {
    currentTableType = tableType;
    originalTableData = data;
    activeColumnSearches = {};
    
    // Add click outside listener to close search inputs
    document.addEventListener('click', handleClickOutside);
}

/**
 * Toggle column search input visibility
 * @param {number} columnIndex - Index of the column
 */
function toggleColumnSearch(columnIndex) {
    const searchRow = document.getElementById('searchRow');
    const searchCell = document.getElementById(`searchCell${columnIndex}`);
    const headerCell = document.querySelector(`[data-column="${columnIndex}"]`);
    const searchIcon = headerCell.querySelector('.mdc-data-table__search-icon-button');
    
    // Check if search is already active for this column
    if (activeColumnSearches[columnIndex]) {
        // Remove search
        clearColumnSearch(columnIndex);
    } else {
        // Show search row if hidden
        if (searchRow.style.display === 'none') {
            searchRow.style.display = '';
        }
        
        // Show search input for this column
        searchCell.classList.remove('mdc-data-table__search-cell--hidden');
        searchCell.innerHTML = createSearchInput(columnIndex);
        
        // Update header visual state
        headerCell.classList.add('mdc-data-table__header-cell--has-search');
        searchIcon.classList.add('mdc-data-table__search-icon-button--active');
        searchIcon.textContent = 'search_off';
        
        // Focus on the input
        setTimeout(() => {
            const input = searchCell.querySelector('.column-search-input');
            if (input) {
                input.focus();
            }
        }, 100);
        
        // Mark as active
        activeColumnSearches[columnIndex] = true;
    }
}

/**
 * Create search input HTML for a column
 * @param {number} columnIndex - Index of the column
 * @returns {string} HTML string for search input
 */
function createSearchInput(columnIndex) {
    const columnNames = columnMappings[currentTableType] || {};
    const columnName = columnNames[columnIndex] || `Column ${columnIndex}`;
    
    return `
        <div class="column-search-container">
            <input type="text" 
                   class="column-search-input" 
                   placeholder="Search ${columnName}..."
                   oninput="performColumnSearch(${columnIndex}, this.value)"
                   onkeydown="handleSearchKeydown(event, ${columnIndex})"
                   data-column="${columnIndex}"
                   autocomplete="off">
            <button class="column-search-clear" 
                    onclick="clearColumnSearch(${columnIndex})" 
                    title="Clear search"
                    type="button">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>
    `;
}

/**
 * Perform search on a specific column
 * @param {number} columnIndex - Index of the column
 * @param {string} searchValue - Search term
 */
function performColumnSearch(columnIndex, searchValue) {
    // Store the search value
    if (searchValue.trim() === '') {
        delete activeColumnSearches[columnIndex];
    } else {
        activeColumnSearches[columnIndex] = searchValue.toLowerCase();
    }
    
    // Apply all active filters
    applyAllColumnFilters();
    
    // Show visual feedback
    updateSearchVisualState(columnIndex, searchValue);
}

/**
 * Apply all active column filters to the table
 */
function applyAllColumnFilters() {
    const tableBody = document.getElementById('tableBody');
    const rows = tableBody.querySelectorAll('.mdc-data-table__row');
    let visibleCount = 0;
    
    rows.forEach(row => {
        let showRow = true;
        const cells = row.querySelectorAll('.mdc-data-table__cell');
        
        // Check each active search filter
        for (const [columnIndex, searchValue] of Object.entries(activeColumnSearches)) {
            if (typeof searchValue === 'string') {
                const cellIndex = parseInt(columnIndex);
                const cell = cells[cellIndex];
                
                if (cell) {
                    const cellText = extractCellText(cell);
                    if (!cellText.includes(searchValue)) {
                        showRow = false;
                        break;
                    }
                }
            }
        }
        
        row.style.display = showRow ? '' : 'none';
        if (showRow) visibleCount++;
    });
    
    // Update table info
    updateTableInfo(visibleCount);
    
    // Dispatch custom event for other components
    dispatchFilterEvent(visibleCount);
}

/**
 * Extract clean text from table cell (removes HTML tags, extra spaces)
 * @param {HTMLElement} cell - Table cell element
 * @returns {string} Clean text content
 */
function extractCellText(cell) {
    // Get text content and clean it up
    let text = cell.textContent || cell.innerText || '';
    
    // Remove extra whitespace and convert to lowercase
    text = text.trim().toLowerCase();
    
    // Handle special cases like currency symbols
    text = text.replace(/[$€£¥₹]/g, '');
    
    return text;
}

/**
 * Clear search for a specific column
 * @param {number} columnIndex - Index of the column
 */
function clearColumnSearch(columnIndex) {
    const searchRow = document.getElementById('searchRow');
    const searchCell = document.getElementById(`searchCell${columnIndex}`);
    const headerCell = document.querySelector(`[data-column="${columnIndex}"]`);
    const searchIcon = headerCell.querySelector('.mdc-data-table__search-icon-button');
    
    // Hide search input for this column
    searchCell.classList.add('mdc-data-table__search-cell--hidden');
    searchCell.innerHTML = '';
    
    // Update header visual state
    headerCell.classList.remove('mdc-data-table__header-cell--has-search');
    searchIcon.classList.remove('mdc-data-table__search-icon-button--active');
    searchIcon.textContent = 'search';
    
    // Remove from active searches
    delete activeColumnSearches[columnIndex];
    
    // Hide search row if no active searches
    const hasActiveSearches = Object.keys(activeColumnSearches).some(key => 
        typeof activeColumnSearches[key] === 'string'
    );
    
    if (!hasActiveSearches) {
        searchRow.style.display = 'none';
    }
    
    // Reapply remaining filters
    applyAllColumnFilters();
}

/**
 * Clear all column searches
 */
function clearAllColumnSearches() {
    const activeColumns = Object.keys(activeColumnSearches);
    activeColumns.forEach(columnIndex => {
        clearColumnSearch(parseInt(columnIndex));
    });
}

/**
 * Handle keyboard events in search inputs
 * @param {KeyboardEvent} event - Keyboard event
 * @param {number} columnIndex - Index of the column
 */
function handleSearchKeydown(event, columnIndex) {
    switch (event.key) {
        case 'Escape':
            clearColumnSearch(columnIndex);
            break;
        case 'Enter':
            event.target.blur();
            break;
        case 'Tab':
            // Allow normal tab behavior
            break;
        default:
            // Let the input handle other keys normally
            break;
    }
}

/**
 * Handle clicks outside search inputs to maintain focus
 * @param {MouseEvent} event - Click event
 */
function handleClickOutside(event) {
    // Don't close if clicking on search-related elements
    if (event.target.closest('.column-search-container') || 
        event.target.closest('.mdc-data-table__search-icon-button')) {
        return;
    }
    
    // Optional: Auto-close search inputs when clicking elsewhere
    // Uncomment if you want this behavior
    // clearAllColumnSearches();
}

/**
 * Update visual state of search icon based on search value
 * @param {number} columnIndex - Index of the column
 * @param {string} searchValue - Current search value
 */
function updateSearchVisualState(columnIndex, searchValue) {
    const headerCell = document.querySelector(`[data-column="${columnIndex}"]`);
    const searchIcon = headerCell.querySelector('.mdc-data-table__search-icon-button');
    
    if (searchValue.trim()) {
        headerCell.classList.add('mdc-data-table__header-cell--has-search');
        searchIcon.classList.add('mdc-data-table__search-icon-button--active');
    } else {
        headerCell.classList.remove('mdc-data-table__header-cell--has-search');
        searchIcon.classList.remove('mdc-data-table__search-icon-button--active');
    }
}

/**
 * Update table info display
 * @param {number} visibleCount - Number of visible rows
 */
function updateTableInfo(visibleCount) {
    const tableInfo = document.getElementById('tableInfo');
    if (tableInfo) {
        const totalCount = originalTableData.length || visibleCount;
        tableInfo.textContent = `Showing ${visibleCount} of ${totalCount} entries`;
        
        if (visibleCount < totalCount) {
            tableInfo.textContent += ' (filtered)';
        }
    }
}

/**
 * Dispatch custom filter event for other components to listen to
 * @param {number} visibleCount - Number of visible rows
 */
function dispatchFilterEvent(visibleCount) {
    const event = new CustomEvent('columnFilterChanged', {
        detail: {
            visibleCount,
            totalCount: originalTableData.length,
            activeFilters: Object.keys(activeColumnSearches).length,
            filters: { ...activeColumnSearches }
        }
    });
    document.dispatchEvent(event);
}

/**
 * Get current filter state
 * @returns {Object} Current filter state
 */
function getFilterState() {
    return {
        activeSearches: { ...activeColumnSearches },
        tableType: currentTableType,
        hasActiveFilters: Object.keys(activeColumnSearches).length > 0
    };
}

/**
 * Restore filter state (useful for page navigation)
 * @param {Object} state - Previously saved filter state
 */
function restoreFilterState(state) {
    if (state && state.tableType === currentTableType) {
        activeColumnSearches = { ...state.activeSearches };
        
        // Restore UI state
        Object.keys(activeColumnSearches).forEach(columnIndex => {
            if (typeof activeColumnSearches[columnIndex] === 'string') {
                toggleColumnSearch(parseInt(columnIndex));
                const input = document.querySelector(`[data-column="${columnIndex}"]`);
                if (input) {
                    input.value = activeColumnSearches[columnIndex];
                }
            }
        });
        
        applyAllColumnFilters();
    }
}

// Export functions for global use
if (typeof window !== 'undefined') {
    window.columnSearch = {
        initialize: initializeColumnSearch,
        toggle: toggleColumnSearch,
        perform: performColumnSearch,
        clear: clearColumnSearch,
        clearAll: clearAllColumnSearches,
        getState: getFilterState,
        restoreState: restoreFilterState
    };
}
