// Universal Filter System for All Tables
// This provides consistent filtering functionality across all tables in the application

class UniversalFilter {
    constructor(config) {
        this.config = config;
        this.originalData = [...config.data];
        this.filteredData = [...config.data];
        this.columnFilters = {};
        this.currentPage = 1;
        this.pageSize = config.pageSize || 10;
        this.sortField = null;
        this.sortDirection = 'asc';
        
        this.initializeFilters();
    }

    // Initialize filter event listeners
    initializeFilters() {
        // Main search input
        if (this.config.searchInputId) {
            const searchInput = document.getElementById(this.config.searchInputId);
            if (searchInput) {
                searchInput.addEventListener('keyup', () => this.applyFilters());
            }
        }

        // Status filter dropdown
        if (this.config.statusFilterId) {
            const statusFilter = document.getElementById(this.config.statusFilterId);
            if (statusFilter) {
                statusFilter.addEventListener('change', () => this.applyFilters());
            }
        }

        // Additional filter dropdowns
        if (this.config.additionalFilters) {
            this.config.additionalFilters.forEach(filterId => {
                const filterElement = document.getElementById(filterId);
                if (filterElement) {
                    filterElement.addEventListener('change', () => this.applyFilters());
                }
            });
        }

        // Column header filters
        if (this.config.columnFilters) {
            this.config.columnFilters.forEach(column => {
                // Text input filters
                const textInput = document.getElementById(column.inputId);
                if (textInput) {
                    textInput.addEventListener('keyup', (e) => {
                        this.setColumnFilter(column.field, e.target.value);
                    });
                }

                // Dropdown filters
                const dropdown = document.getElementById(column.dropdownId);
                if (dropdown) {
                    dropdown.addEventListener('change', (e) => {
                        this.setColumnFilter(column.field, e.target.value);
                    });
                }
            });
        }
    }

    // Set column filter value
    setColumnFilter(field, value) {
        this.columnFilters[field] = value.toLowerCase();
        this.applyFilters();
        
        // Sync dual inputs (text + dropdown)
        if (this.config.columnFilters) {
            const columnConfig = this.config.columnFilters.find(c => c.field === field);
            if (columnConfig && columnConfig.syncInputs) {
                this.syncDualInputs(columnConfig, value);
            }
        }
    }

    // Sync text input and dropdown for dual filter columns
    syncDualInputs(columnConfig, value) {
        const textInput = document.getElementById(columnConfig.inputId);
        const dropdown = document.getElementById(columnConfig.dropdownId);
        
        if (columnConfig.options && columnConfig.options.includes(value)) {
            // Exact match - select in dropdown, clear text input
            if (dropdown) dropdown.value = value;
            if (textInput) textInput.value = '';
        } else {
            // Search term - clear dropdown, set text input
            if (dropdown) dropdown.value = '';
            if (textInput && textInput !== document.activeElement) {
                textInput.value = value;
            }
        }
    }

    // Apply all filters
    applyFilters() {
        this.currentPage = 1;
        
        this.filteredData = this.originalData.filter(item => {
            return this.matchesMainSearch(item) && 
                   this.matchesStatusFilter(item) && 
                   this.matchesAdditionalFilters(item) && 
                   this.matchesColumnFilters(item);
        });

        this.updateDisplay();
        this.updatePagination();
        
        if (this.config.onFilterChange) {
            this.config.onFilterChange(this.filteredData);
        }
    }

    // Check if item matches main search
    matchesMainSearch(item) {
        const searchInput = document.getElementById(this.config.searchInputId);
        if (!searchInput || !searchInput.value.trim()) return true;
        
        const searchTerm = searchInput.value.toLowerCase();
        
        return this.config.searchFields.some(field => {
            const value = this.getNestedValue(item, field);
            return value && value.toString().toLowerCase().includes(searchTerm);
        });
    }

    // Check if item matches status filter
    matchesStatusFilter(item) {
        const statusFilter = document.getElementById(this.config.statusFilterId);
        if (!statusFilter || !statusFilter.value) return true;
        
        const statusValue = this.getNestedValue(item, this.config.statusField);
        return statusValue === statusFilter.value;
    }

    // Check if item matches additional filters
    matchesAdditionalFilters(item) {
        if (!this.config.additionalFilters) return true;
        
        return this.config.additionalFilters.every(filterId => {
            const filterElement = document.getElementById(filterId);
            if (!filterElement || !filterElement.value) return true;
            
            const filterConfig = this.config.additionalFilterConfigs?.[filterId];
            if (!filterConfig) return true;
            
            const itemValue = this.getNestedValue(item, filterConfig.field);
            
            if (filterConfig.customMatcher) {
                return filterConfig.customMatcher(itemValue, filterElement.value);
            }
            
            return itemValue === filterElement.value;
        });
    }

    // Check if item matches column filters
    matchesColumnFilters(item) {
        return Object.entries(this.columnFilters).every(([field, filterValue]) => {
            if (!filterValue) return true;
            
            const itemValue = this.getNestedValue(item, field);
            if (!itemValue) return false;
            
            const columnConfig = this.config.columnFilters?.find(c => c.field === field);
            
            if (columnConfig && columnConfig.options && columnConfig.options.includes(filterValue)) {
                // Exact match for dropdown selections
                return itemValue.toString().toLowerCase() === filterValue;
            } else {
                // Partial match for text searches
                return itemValue.toString().toLowerCase().includes(filterValue);
            }
        });
    }

    // Get nested object value using dot notation
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }

    // Update table display
    updateDisplay() {
        if (this.config.updateDisplayCallback) {
            this.config.updateDisplayCallback(this.getPaginatedData());
        }
    }

    // Get paginated data for current page
    getPaginatedData() {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        return this.filteredData.slice(startIndex, endIndex);
    }

    // Update pagination controls
    updatePagination() {
        const totalPages = Math.ceil(this.filteredData.length / this.pageSize);
        
        if (this.config.paginationCallback) {
            this.config.paginationCallback({
                currentPage: this.currentPage,
                totalPages: totalPages,
                totalRecords: this.filteredData.length,
                pageSize: this.pageSize
            });
        }
    }

    // Reset all filters
    resetFilters() {
        // Clear main search
        const searchInput = document.getElementById(this.config.searchInputId);
        if (searchInput) searchInput.value = '';

        // Clear status filter
        const statusFilter = document.getElementById(this.config.statusFilterId);
        if (statusFilter) statusFilter.value = '';

        // Clear additional filters
        if (this.config.additionalFilters) {
            this.config.additionalFilters.forEach(filterId => {
                const filterElement = document.getElementById(filterId);
                if (filterElement) filterElement.value = '';
            });
        }

        // Clear column filters
        this.columnFilters = {};
        if (this.config.columnFilters) {
            this.config.columnFilters.forEach(column => {
                const textInput = document.getElementById(column.inputId);
                const dropdown = document.getElementById(column.dropdownId);
                if (textInput) textInput.value = '';
                if (dropdown) dropdown.value = '';
            });
        }

        this.currentPage = 1;
        this.applyFilters();
    }

    // Sort data
    sortData(field, direction = null) {
        if (this.sortField === field) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortField = field;
            this.sortDirection = direction || 'asc';
        }

        this.filteredData.sort((a, b) => {
            const aValue = this.getNestedValue(a, field);
            const bValue = this.getNestedValue(b, field);

            let comparison = 0;
            if (aValue > bValue) comparison = 1;
            if (aValue < bValue) comparison = -1;

            return this.sortDirection === 'asc' ? comparison : -comparison;
        });

        this.updateDisplay();
    }

    // Change page
    changePage(newPage) {
        const totalPages = Math.ceil(this.filteredData.length / this.pageSize);
        if (newPage >= 1 && newPage <= totalPages) {
            this.currentPage = newPage;
            this.updateDisplay();
            this.updatePagination();
        }
    }

    // Change page size
    changePageSize(newPageSize) {
        this.pageSize = newPageSize;
        this.currentPage = 1;
        this.updateDisplay();
        this.updatePagination();
    }

    // Update data source
    updateData(newData) {
        this.originalData = [...newData];
        this.applyFilters();
    }

    // Get current filtered data
    getFilteredData() {
        return this.filteredData;
    }

    // Get current page data
    getCurrentPageData() {
        return this.getPaginatedData();
    }
}

// Export for use in other files
window.UniversalFilter = UniversalFilter;
