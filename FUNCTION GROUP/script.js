/**
 * Function Group Management System
 * A comprehensive web application for managing function groups with CRUD operations
 */

class FunctionGroupManager {
    constructor() {
        this.data = [];
        this.filteredData = [];
        this.currentPage = 1;
        this.pageSize = 10;
        this.sortColumn = null;
        this.sortDirection = 'asc';
        this.selectedRows = new Set();
        this.editingId = null;

        // Advanced search properties
        this.advancedSearchActive = false;
        this.searchCriteria = [];
        this.searchHistory = [];
        this.criteriaCounter = 0;

        // Customization properties
        this.currentTheme = 'white';
        this.currentFont = 'Times New Roman';
        this.currentViewMode = 'list'; // Default view mode

        // Initialize data first
        this.initializeData();

        // Initialize event listeners
        this.initializeEventListeners();

        // Load saved preferences and apply them
        this.loadSavedPreferences();

        // Ensure DOM is ready before rendering
        this.ensureInitialRender();
    }

    // Initialize sample data matching the image
    initializeData() {
        const savedData = localStorage.getItem('functionGroups');
        if (savedData) {
            this.data = JSON.parse(savedData);
        } else {
            // Initialize with sample data including metadata
            const now = new Date().toISOString();
            this.data = [
                { id: 1, name: 'WHEEL', brand: '', active: true, category: 'Maintenance', priority: 'High', description: 'Wheel assembly and maintenance operations', createdAt: '2024-01-15T10:30:00.000Z', lastModified: now, createdBy: 'System Admin', version: '1.2' },
                { id: 2, name: 'VV9999', brand: '', active: true, category: 'Operations', priority: 'Medium', description: 'Vehicle verification and validation procedures', createdAt: '2024-01-20T14:15:00.000Z', lastModified: now, createdBy: 'John Smith', version: '2.1' },
                { id: 3, name: 'VH9999', brand: '', active: true, category: 'Safety', priority: 'High', description: 'Vehicle health monitoring and diagnostics', createdAt: '2024-02-01T09:45:00.000Z', lastModified: now, createdBy: 'Sarah Johnson', version: '1.0' },
                { id: 4, name: 'TY9999', brand: '', active: true, category: 'Quality', priority: 'Medium', description: 'Type verification and quality assurance', createdAt: '2024-02-10T16:20:00.000Z', lastModified: now, createdBy: 'Mike Davis', version: '1.5' },
                { id: 5, name: 'Test FGN', brand: 'Brand 3', active: true, category: 'Production', priority: 'Low', description: 'Test function group for development purposes', createdAt: '2024-02-15T11:00:00.000Z', lastModified: now, createdBy: 'Test User', version: '0.9' },
                { id: 6, name: 'TC9999', brand: '', active: true, category: 'Maintenance', priority: 'High', description: 'Temperature control and monitoring systems', createdAt: '2024-02-20T13:30:00.000Z', lastModified: now, createdBy: 'Lisa Wilson', version: '2.0' },
                { id: 7, name: 'PC9999', brand: '', active: true, category: 'Operations', priority: 'Medium', description: 'Process control and automation functions', createdAt: '2024-02-25T08:15:00.000Z', lastModified: now, createdBy: 'David Brown', version: '1.8' },
                { id: 8, name: 'OR9999', brand: '', active: true, category: 'Safety', priority: 'High', description: 'Operational risk assessment and mitigation', createdAt: '2024-03-01T12:45:00.000Z', lastModified: now, createdBy: 'Emma Taylor', version: '1.3' },
                { id: 9, name: 'NF9999', brand: '', active: true, category: 'Quality', priority: 'Medium', description: 'Non-functional testing and validation', createdAt: '2024-03-05T15:20:00.000Z', lastModified: now, createdBy: 'Robert Miller', version: '1.1' },
                { id: 10, name: 'NA9999', brand: '', active: true, category: 'Production', priority: 'Low', description: 'Network administration and configuration', createdAt: '2024-03-10T10:10:00.000Z', lastModified: now, createdBy: 'Jennifer Garcia', version: '2.2' },
                // Additional sample data to demonstrate pagination and numeric-starting names
                { id: 11, name: 'MX9999', brand: 'Brand 1', active: true, category: 'Maintenance', priority: 'Medium', description: 'Material exchange safety protocols', createdAt: '2024-03-15T16:40:00.000Z', lastModified: now, createdBy: 'Amanda White', version: '1.4' },
                { id: 12, name: 'LK9999', brand: 'Brand 2', active: false, category: 'Operations', priority: 'Low', description: 'Legacy key management (deprecated)', createdAt: '2024-01-05T14:30:00.000Z', lastModified: '2024-03-15T09:00:00.000Z', createdBy: 'Legacy System', version: '0.5' },
                { id: 13, name: 'JH9999', brand: '', active: true, category: 'Safety', priority: 'High', description: 'Job hazard analysis and prevention', createdAt: '2024-03-12T11:25:00.000Z', lastModified: now, createdBy: 'Kevin Anderson', version: '1.7' },
                { id: 14, name: 'GF9999', brand: 'Brand 4', active: true, category: 'Quality', priority: 'Medium', description: 'General function testing framework', createdAt: '2024-02-28T13:15:00.000Z', lastModified: now, createdBy: 'Quality Team', version: '2.3' },
                { id: 15, name: 'DE9999', brand: '', active: false, category: 'Production', priority: 'Low', description: 'Data export utilities (under review)', createdAt: '2024-03-18T09:30:00.000Z', lastModified: '2024-03-25T11:15:00.000Z', createdBy: 'Production Manager', version: '0.8' },
                // Test data with numeric-starting and fully numeric names
                { id: 16, name: '123ABC', brand: 'Numeric Brand', active: true, category: 'Maintenance', priority: 'High', description: 'Numeric identifier maintenance group', createdAt: '2024-03-20T12:00:00.000Z', lastModified: now, createdBy: 'Maintenance Team', version: '1.6' },
                { id: 17, name: '9Test', brand: '', active: true, category: 'Operations', priority: 'Low', description: 'Nine-series test operations', createdAt: '2024-03-22T15:45:00.000Z', lastModified: now, createdBy: 'Test Engineer', version: '1.9' },
                { id: 18, name: '001Group', brand: 'Zero Brand', active: false, category: 'Safety', priority: 'High', description: 'Zero-one group safety protocols (suspended)', createdAt: '2024-03-01T10:20:00.000Z', lastModified: '2024-03-25T11:15:00.000Z', createdBy: 'Safety Officer', version: '0.7' },
                { id: 19, name: '456DEF', brand: 'Test Brand', active: true, category: 'Quality', priority: 'Medium', description: 'Four-five-six definition standards', createdAt: '2024-03-25T14:10:00.000Z', lastModified: now, createdBy: 'Standards Team', version: '1.0' },
                // Test data with fully numeric names
                { id: 20, name: '1000', brand: 'Numeric Only', active: true, category: 'Production', priority: 'High', description: 'Core production function group', createdAt: '2024-01-01T00:00:00.000Z', lastModified: now, createdBy: 'System', version: '3.0' },
                { id: 21, name: '42', brand: '', active: true, category: 'Operations', priority: 'Low', description: 'Universal answer function group', createdAt: '2024-03-14T15:92:00.000Z', lastModified: now, createdBy: 'Douglas Adams', version: '42.0' },
                { id: 22, name: '999', brand: 'Triple Nine', active: false, category: 'Maintenance', priority: 'Low', description: 'Emergency maintenance procedures (archived)', createdAt: '2024-02-29T23:59:00.000Z', lastModified: '2024-03-30T12:00:00.000Z', createdBy: 'Emergency Team', version: '0.3' }
            ];
            this.saveData();
        }
        this.filteredData = [...this.data];
    }

    // Save data to localStorage
    saveData() {
        localStorage.setItem('functionGroups', JSON.stringify(this.data));
    }

    // Initialize all event listeners
    initializeEventListeners() {
        // Header buttons
        document.getElementById('newBtn').addEventListener('click', () => this.openModal());
        document.getElementById('deleteBtn').addEventListener('click', () => this.deleteSelected());
        document.getElementById('refreshBtn').addEventListener('click', () => this.refresh());
        document.getElementById('exportBtn').addEventListener('click', () => this.toggleExportDropdown());
        document.getElementById('exportExcelBtn').addEventListener('click', () => this.exportAsExcel());
        document.getElementById('exportPdfBtn').addEventListener('click', () => this.exportAsPdf());
        document.getElementById('advancedSearchBtn').addEventListener('click', () => this.openAdvancedSearch());

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        document.getElementById('clearSearch').addEventListener('click', () => this.clearSearch());

        // Table sorting
        document.querySelectorAll('.sortable').forEach(header => {
            header.addEventListener('click', () => this.handleSort(header.dataset.column));
        });

        // Select all checkbox
        document.getElementById('selectAll').addEventListener('change', (e) => this.handleSelectAll(e.target.checked));

        // Pagination controls
        document.getElementById('firstPage').addEventListener('click', () => this.goToPage(1));
        document.getElementById('prevPage').addEventListener('click', () => this.goToPage(this.currentPage - 1));
        document.getElementById('nextPage').addEventListener('click', () => this.goToPage(this.currentPage + 1));
        document.getElementById('lastPage').addEventListener('click', () => this.goToPage(this.getTotalPages()));
        document.getElementById('currentPage').addEventListener('change', (e) => this.goToPage(parseInt(e.target.value)));
        document.getElementById('pageSize').addEventListener('change', (e) => this.changePageSize(parseInt(e.target.value)));

        // Modal controls
        document.getElementById('closeModal').addEventListener('click', () => this.closeModal());
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeModal());
        document.getElementById('saveBtn').addEventListener('click', () => this.saveItem());
        document.getElementById('modalOverlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.closeModal();
        });

        // View Modal controls
        document.getElementById('closeViewModal').addEventListener('click', () => this.closeViewModal());
        document.getElementById('closeViewModalBtn').addEventListener('click', () => this.closeViewModal());
        document.getElementById('editFromViewBtn').addEventListener('click', () => this.editFromView());
        document.getElementById('viewModalOverlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.closeViewModal();
        });

        // Confirmation dialog
        document.getElementById('confirmationCancel').addEventListener('click', () => this.closeConfirmation());
        document.getElementById('confirmationOverlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.closeConfirmation();
        });

        // Form validation
        document.getElementById('functionGroupName').addEventListener('input', () => this.validateForm());

        // Advanced Search Modal
        document.getElementById('closeAdvancedSearch').addEventListener('click', () => this.closeAdvancedSearch());
        document.getElementById('cancelAdvancedSearch').addEventListener('click', () => this.closeAdvancedSearch());
        document.getElementById('applyAdvancedSearch').addEventListener('click', () => this.applyAdvancedSearch());
        document.getElementById('resetAdvancedSearch').addEventListener('click', () => this.resetAdvancedSearch());
        document.getElementById('addCriteriaBtn').addEventListener('click', () => this.addSearchCriteria());
        // Advanced Search Export Dropdown
        document.getElementById('exportFilteredBtn').addEventListener('click', () => this.toggleExportFilteredDropdown());
        document.getElementById('exportFilteredExcelBtn').addEventListener('click', () => this.exportFilteredAsExcel());
        document.getElementById('exportFilteredPdfBtn').addEventListener('click', () => this.exportFilteredAsPdf());
        document.getElementById('advancedSearchOverlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.closeAdvancedSearch();
        });



        // Settings dropdown
        document.getElementById('settingsBtn').addEventListener('click', () => this.toggleSettingsDropdown());

        // Theme selection
        document.querySelectorAll('[data-theme]').forEach(btn => {
            btn.addEventListener('click', (e) => this.changeTheme(e.target.dataset.theme));
        });

        // Font selection
        document.querySelectorAll('[data-font]').forEach(btn => {
            btn.addEventListener('click', (e) => this.changeFont(e.target.dataset.font));
        });

        // View mode selection
        document.querySelectorAll('[data-view]').forEach(btn => {
            btn.addEventListener('click', (e) => this.changeViewMode(e.target.dataset.view));
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => this.handleOutsideClick(e));

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Window resize handler for grid optimization
        window.addEventListener('resize', () => this.handleWindowResize());

        // Initialize advanced search components
        this.initializeAdvancedSearch();

        // Initialize navigation system
        this.initializeNavigation();

        // Initialize customization
        this.initializeCustomization();

        // Initialize sorting for Grid and Card views
        this.initializeViewSorting();
    }

    // Load saved preferences without triggering toasts or re-renders
    loadSavedPreferences() {
        // Load saved preferences
        const savedTheme = localStorage.getItem('selectedTheme') || 'white';
        const savedFont = localStorage.getItem('selectedFont') || 'Times New Roman';
        const savedViewMode = localStorage.getItem('selectedViewMode') || 'list';

        // Apply theme silently
        this.currentTheme = savedTheme;
        if (savedTheme !== 'white') {
            document.documentElement.setAttribute('data-theme', savedTheme);
        }

        // Apply font silently
        this.currentFont = savedFont;
        document.body.style.fontFamily = `'${savedFont}', serif`;

        // Apply view mode silently
        this.currentViewMode = savedViewMode;

        // Update settings indicators
        this.updateSettingsIndicators();
    }

    // Ensure initial render happens when DOM is ready
    ensureInitialRender() {
        const attemptRender = () => {
            const listView = document.getElementById('listView');
            const gridView = document.getElementById('gridView');
            const cardView = document.getElementById('cardView');
            const tableBody = document.getElementById('tableBody');

            // Check if essential DOM elements exist
            if (listView && gridView && cardView && tableBody) {
                // Force reset filtered data to ensure it's properly set
                this.filteredData = [...this.data];
                this.currentPage = 1;

                // Ensure the correct view is visible
                this.hideAllViews();

                // Force render the current view mode
                switch (this.currentViewMode) {
                    case 'list':
                        this.renderListView(this.getCurrentPageData());
                        break;
                    case 'grid':
                        this.renderGridView(this.getOptimizedGridData());
                        break;
                    case 'card':
                        this.renderCardView(this.getCurrentPageData());
                        break;
                    default:
                        // Fallback to list view
                        this.currentViewMode = 'list';
                        this.renderListView(this.getCurrentPageData());
                }

                this.updatePagination();
                return true;
            }
            return false;
        };

        // Try immediate render
        if (attemptRender()) {
            return;
        }

        // If immediate render fails, use multiple fallback strategies
        requestAnimationFrame(() => {
            if (attemptRender()) {
                return;
            }

            // If still not ready, use setTimeout as fallback
            setTimeout(() => {
                if (!attemptRender()) {
                    // Final fallback - try again after a longer delay
                    setTimeout(() => {
                        attemptRender();
                    }, 500);
                }
            }, 100);
        });
    }

    // Handle search functionality
    handleSearch(query) {
        const clearBtn = document.getElementById('clearSearch');
        clearBtn.style.display = query ? 'block' : 'none';

        // Reset advanced search if simple search is used
        if (query.trim() && this.advancedSearchActive) {
            this.advancedSearchActive = false;
            this.searchCriteria = [];
        }

        if (!query.trim()) {
            this.filteredData = [...this.data];
        } else {
            const searchTerm = query.toLowerCase();
            this.filteredData = this.data.filter(item =>
                item.name.toLowerCase().includes(searchTerm) ||
                item.brand.toLowerCase().includes(searchTerm)
            );
        }

        this.currentPage = 1;
        this.renderTable();
        this.updatePagination();
    }

    // Clear search
    clearSearch() {
        document.getElementById('searchInput').value = '';
        document.getElementById('clearSearch').style.display = 'none';

        // Reset advanced search as well
        this.advancedSearchActive = false;
        this.searchCriteria = [];

        this.filteredData = [...this.data];
        this.currentPage = 1;
        this.renderTable();
        this.updatePagination();
    }

    // Highlight search terms in text
    highlightSearchTerms(text, field) {
        if (!this.advancedSearchActive && !document.getElementById('searchInput').value.trim()) {
            return text;
        }

        let searchTerms = [];

        // Get terms from simple search
        const simpleSearch = document.getElementById('searchInput').value.trim();
        if (simpleSearch) {
            searchTerms.push(simpleSearch);
        }

        // Get terms from advanced search
        if (this.advancedSearchActive) {
            const relevantCriteria = this.searchCriteria.filter(c =>
                c.field === field &&
                c.value.trim() !== '' &&
                (c.operator === 'contains' || c.operator === 'startsWith' || c.operator === 'endsWith' || c.operator === 'equals')
            );
            searchTerms.push(...relevantCriteria.map(c => c.value));
        }

        if (searchTerms.length === 0) return text;

        let highlightedText = text;
        searchTerms.forEach(term => {
            if (term.trim()) {
                const regex = new RegExp(`(${this.escapeRegex(term)})`, 'gi');
                highlightedText = highlightedText.replace(regex, '<span class="highlight">$1</span>');
            }
        });

        return highlightedText;
    }

    // Escape special regex characters
    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Handle column sorting
    handleSort(column) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }

        this.filteredData.sort((a, b) => {
            let aVal = a[column];
            let bVal = b[column];

            if (column === 'active') {
                aVal = aVal ? 'Yes' : 'No';
                bVal = bVal ? 'Yes' : 'No';
            }

            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        this.updateSortIcons();
        this.renderTable();
    }

    // Update sort icons
    updateSortIcons() {
        document.querySelectorAll('.sortable').forEach(header => {
            const icon = header.querySelector('.sort-icon');
            header.classList.remove('sorted');
            icon.className = 'fas fa-sort sort-icon';

            if (header.dataset.column === this.sortColumn) {
                header.classList.add('sorted');
                icon.className = `fas fa-sort-${this.sortDirection === 'asc' ? 'up' : 'down'} sort-icon`;
            }
        });
    }

    // Handle select all checkbox
    handleSelectAll(checked) {
        // Get checkboxes from all view modes
        const checkboxes = document.querySelectorAll(
            'tbody input[type="checkbox"], .grid-item-checkbox, .card-item-checkbox'
        );

        checkboxes.forEach(checkbox => {
            checkbox.checked = checked;

            // Handle different container types
            const row = checkbox.closest('tr');
            const gridItem = checkbox.closest('.grid-item');
            const cardItem = checkbox.closest('.card-item');

            if (checked) {
                this.selectedRows.add(parseInt(checkbox.value));
                if (row) row.classList.add('selected');
                if (gridItem) gridItem.classList.add('selected');
                if (cardItem) cardItem.classList.add('selected');
            } else {
                this.selectedRows.delete(parseInt(checkbox.value));
                if (row) row.classList.remove('selected');
                if (gridItem) gridItem.classList.remove('selected');
                if (cardItem) cardItem.classList.remove('selected');
            }
        });
        this.updateDeleteButton();
    }

    // Handle individual row selection
    handleRowSelection(id, checked, row) {
        if (checked) {
            this.selectedRows.add(id);
            row.classList.add('selected');
        } else {
            this.selectedRows.delete(id);
            row.classList.remove('selected');
        }

        // Update select all checkbox
        const totalVisible = this.getCurrentPageData().length;
        const selectedVisible = document.querySelectorAll('tbody input[type="checkbox"]:checked').length;
        const selectAllCheckbox = document.getElementById('selectAll');
        selectAllCheckbox.checked = selectedVisible === totalVisible && totalVisible > 0;
        selectAllCheckbox.indeterminate = selectedVisible > 0 && selectedVisible < totalVisible;

        this.updateDeleteButton();
    }

    // Update delete button state
    updateDeleteButton() {
        const deleteBtn = document.getElementById('deleteBtn');
        deleteBtn.disabled = this.selectedRows.size === 0;
    }

    // Get current page data
    getCurrentPageData() {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        return this.filteredData.slice(startIndex, endIndex);
    }

    // Get optimized data for grid view (fills available space)
    getOptimizedGridData() {
        if (this.currentViewMode !== 'grid') {
            return this.getCurrentPageData();
        }

        const startIndex = (this.currentPage - 1) * this.pageSize;
        const availableSpace = this.calculateAvailableGridSpace();

        if (availableSpace > this.pageSize) {
            // Load additional items to fill space
            const optimizedEndIndex = Math.min(startIndex + availableSpace, this.filteredData.length);
            return this.filteredData.slice(startIndex, optimizedEndIndex);
        }

        return this.getCurrentPageData();
    }

    // Calculate how many items can fit in the current grid container
    calculateAvailableGridSpace() {
        const gridContainer = document.getElementById('gridContainer');
        if (!gridContainer) return this.pageSize;

        // Get container dimensions
        const containerWidth = gridContainer.clientWidth || 1200; // fallback width
        const containerHeight = window.innerHeight - 300; // approximate available height

        // Grid item dimensions (including gaps)
        const itemWidth = 280 + 20; // min-width + gap
        const itemHeight = 180 + 20; // estimated height + gap

        // Calculate grid capacity
        const columnsPerRow = Math.floor(containerWidth / itemWidth);
        const maxRows = Math.floor(containerHeight / itemHeight);

        // Calculate total capacity with a reasonable minimum
        const totalCapacity = Math.max(columnsPerRow * maxRows, this.pageSize);

        return Math.min(totalCapacity, this.pageSize * 2); // Cap at 2x page size
    }

    // Handle window resize for grid optimization
    handleWindowResize() {
        // Debounce resize events
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            if (this.currentViewMode === 'grid') {
                this.renderTable();
                this.updatePagination();
            }
        }, 250);
    }

    // Initialize sorting for Grid and Card views
    initializeViewSorting() {
        // Grid view sorting
        const gridSortSelect = document.getElementById('gridSortSelect');
        const gridSortDirection = document.getElementById('gridSortDirection');

        // Card view sorting
        const cardSortSelect = document.getElementById('cardSortSelect');
        const cardSortDirection = document.getElementById('cardSortDirection');

        // Set initial sort values to match current table sort
        if (gridSortSelect && cardSortSelect) {
            const currentSort = this.getCurrentSortValue();
            gridSortSelect.value = currentSort;
            cardSortSelect.value = currentSort;
        }

        // Grid sort select change
        if (gridSortSelect) {
            gridSortSelect.addEventListener('change', (e) => {
                this.handleViewSort(e.target.value, 'grid');
            });
        }

        // Grid sort direction toggle
        if (gridSortDirection) {
            gridSortDirection.addEventListener('click', () => {
                this.toggleSortDirection('grid');
            });
        }

        // Card sort select change
        if (cardSortSelect) {
            cardSortSelect.addEventListener('change', (e) => {
                this.handleViewSort(e.target.value, 'card');
            });
        }

        // Card sort direction toggle
        if (cardSortDirection) {
            cardSortDirection.addEventListener('click', () => {
                this.toggleSortDirection('card');
            });
        }
    }

    // Get current sort value from table state
    getCurrentSortValue() {
        const column = this.sortColumn || 'name';
        const direction = this.sortDirection || 'asc';
        return `${column}-${direction}`;
    }

    // Handle sorting for Grid and Card views
    handleViewSort(sortValue, viewType) {
        const [column, direction] = sortValue.split('-');

        // Update internal sort state
        this.sortColumn = column;
        this.sortDirection = direction;

        // Update table sort to maintain consistency
        this.updateTableSort(column, direction);

        // Update sort direction button
        this.updateSortDirectionButton(viewType, direction);

        // Re-render current view
        this.renderTable();
        this.updatePagination();
    }

    // Toggle sort direction for Grid and Card views
    toggleSortDirection(viewType) {
        const newDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        const selectId = viewType === 'grid' ? 'gridSortSelect' : 'cardSortSelect';
        const select = document.getElementById(selectId);

        if (select) {
            const column = this.sortColumn || 'name';
            const newValue = `${column}-${newDirection}`;
            select.value = newValue;
            this.handleViewSort(newValue, viewType);
        }
    }

    // Update sort direction button appearance
    updateSortDirectionButton(viewType, direction) {
        const buttonId = viewType === 'grid' ? 'gridSortDirection' : 'cardSortDirection';
        const button = document.getElementById(buttonId);

        if (button) {
            const icon = button.querySelector('i');
            if (direction === 'desc') {
                button.classList.add('desc');
                icon.className = 'fas fa-sort-down';
            } else {
                button.classList.remove('desc');
                icon.className = 'fas fa-sort-up';
            }
        }
    }

    // Update table sort headers to maintain consistency
    updateTableSort(column, direction) {
        // Remove sorted class from all headers
        document.querySelectorAll('.data-table th.sorted').forEach(th => {
            th.classList.remove('sorted');
            const icon = th.querySelector('.sort-icon');
            if (icon) {
                icon.className = 'fas fa-sort sort-icon';
            }
        });

        // Add sorted class to current column
        const columnMap = {
            'name': 'name',
            'brand': 'brand',
            'active': 'active'
        };

        const targetColumn = columnMap[column];
        if (targetColumn) {
            const header = document.querySelector(`[data-column="${targetColumn}"]`);
            if (header) {
                header.classList.add('sorted');
                const icon = header.querySelector('.sort-icon');
                if (icon) {
                    icon.className = direction === 'asc' ?
                        'fas fa-sort-up sort-icon' :
                        'fas fa-sort-down sort-icon';
                }
            }
        }
    }

    // Render data based on current view mode
    renderTable() {
        // Use optimized data for grid view, regular data for others
        const currentData = this.currentViewMode === 'grid' ?
            this.getOptimizedGridData() : this.getCurrentPageData();
        const noResults = document.getElementById('noResults');

        if (currentData.length === 0) {
            this.hideAllViews();
            if (noResults) {
                noResults.style.display = 'block';
            }
            return;
        }

        if (noResults) {
            noResults.style.display = 'none';
        }

        // Render based on current view mode
        switch (this.currentViewMode) {
            case 'list':
                this.renderListView(currentData);
                break;
            case 'grid':
                this.renderGridView(currentData);
                break;
            case 'card':
                this.renderCardView(currentData);
                break;
        }
    }

    // Hide all view containers
    hideAllViews() {
        document.getElementById('listView').style.display = 'none';
        document.getElementById('gridView').style.display = 'none';
        document.getElementById('cardView').style.display = 'none';
    }

    // Render list view (original table)
    renderListView(currentData) {
        this.hideAllViews();
        document.getElementById('listView').style.display = 'block';

        const tbody = document.getElementById('tableBody');

        tbody.innerHTML = currentData.map(item => `
            <tr data-id="${item.id}" ${this.selectedRows.has(item.id) ? 'class="selected"' : ''}>
                <td class="checkbox-col">
                    <input type="checkbox" value="${item.id}" ${this.selectedRows.has(item.id) ? 'checked' : ''}>
                </td>
                <td class="action-col">
                    <button class="action-btn view" title="View details" data-id="${item.id}" data-action="view">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
                <td class="action-col">
                    <button class="action-btn delete" title="Delete item" data-id="${item.id}" data-action="delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
                <td>
                    <span class="editable" data-id="${item.id}" data-action="edit" title="Click to edit">
                        ${this.highlightSearchTerms(this.escapeHtml(item.name), 'name')}
                    </span>
                </td>
                <td>
                    <span class="editable" data-id="${item.id}" data-action="edit" title="Click to edit">
                        ${this.highlightSearchTerms(this.escapeHtml(item.brand), 'brand')}
                    </span>
                </td>
                <td>
                    <span class="status-badge ${item.active ? 'status-active' : 'status-inactive'}">
                        ${item.active ? 'Yes' : 'No'}
                    </span>
                </td>
            </tr>
        `).join('');

        this.addListViewEventListeners(currentData);
    }

    // Add event listeners for list view
    addListViewEventListeners(currentData) {
        const tbody = document.getElementById('tableBody');

        // Add event listeners to checkboxes
        tbody.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const row = e.target.closest('tr');
                this.handleRowSelection(parseInt(e.target.value), e.target.checked, row);
            });
        });

        // Add event listeners to action buttons
        tbody.querySelectorAll('.action-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const id = parseInt(button.dataset.id);
                const action = button.dataset.action;

                if (action === 'view') {
                    this.viewItem(id);
                } else if (action === 'delete') {
                    this.deleteItem(id);
                }
            });
        });

        // Add event listeners to editable spans
        tbody.querySelectorAll('.editable').forEach(span => {
            span.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const id = parseInt(span.dataset.id);
                this.editItem(id);
            });
        });

        this.updateSelectAllCheckbox(currentData);
    }

    // Update select all checkbox state
    updateSelectAllCheckbox(currentData) {
        const totalVisible = currentData.length;
        const selectedVisible = currentData.filter(item => this.selectedRows.has(item.id)).length;
        const selectAllCheckbox = document.getElementById('selectAll');
        selectAllCheckbox.checked = selectedVisible === totalVisible && totalVisible > 0;
        selectAllCheckbox.indeterminate = selectedVisible > 0 && selectedVisible < totalVisible;
    }

    // Render grid view
    renderGridView(currentData) {
        this.hideAllViews();
        document.getElementById('gridView').style.display = 'block';

        const gridContainer = document.getElementById('gridContainer');

        gridContainer.innerHTML = currentData.map(item => `
            <div class="grid-item ${this.selectedRows.has(item.id) ? 'selected' : ''}" data-id="${item.id}">
                <div class="grid-item-header">
                    <input type="checkbox" class="grid-item-checkbox" value="${item.id}" ${this.selectedRows.has(item.id) ? 'checked' : ''}>
                    <div class="grid-item-actions">
                        <button class="action-btn view" title="View details" data-id="${item.id}" data-action="view">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn delete" title="Delete item" data-id="${item.id}" data-action="delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="grid-item-title editable" data-id="${item.id}" data-action="edit" title="Click to edit">
                    ${this.highlightSearchTerms(this.escapeHtml(item.name), 'name')}
                </div>
                <div class="grid-item-brand">
                    ${this.highlightSearchTerms(this.escapeHtml(item.brand || 'No Brand'), 'brand')}
                </div>
                <div class="grid-item-status">
                    <span class="status-badge ${item.active ? 'status-active' : 'status-inactive'}">
                        ${item.active ? 'Active' : 'Inactive'}
                    </span>
                </div>
            </div>
        `).join('');

        this.addGridViewEventListeners(currentData);
    }

    // Add event listeners for grid view
    addGridViewEventListeners(currentData) {
        const gridContainer = document.getElementById('gridContainer');

        // Add event listeners to checkboxes
        gridContainer.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const gridItem = e.target.closest('.grid-item');
                this.handleGridItemSelection(parseInt(e.target.value), e.target.checked, gridItem);
            });
        });

        // Add event listeners to action buttons
        gridContainer.querySelectorAll('.action-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const id = parseInt(button.dataset.id);
                const action = button.dataset.action;

                if (action === 'view') {
                    this.viewItem(id);
                } else if (action === 'delete') {
                    this.deleteItem(id);
                }
            });
        });

        // Add event listeners to editable elements
        gridContainer.querySelectorAll('.editable').forEach(element => {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const id = parseInt(element.dataset.id);
                this.editItem(id);
            });
        });

        this.updateSelectAllCheckbox(currentData);
    }

    // Handle grid item selection
    handleGridItemSelection(id, checked, gridItem) {
        if (checked) {
            this.selectedRows.add(id);
            gridItem.classList.add('selected');
        } else {
            this.selectedRows.delete(id);
            gridItem.classList.remove('selected');
        }

        this.updateSelectAllCheckbox(this.getCurrentPageData());
        this.updateDeleteButton();
    }

    // Render card view
    renderCardView(currentData) {
        this.hideAllViews();
        document.getElementById('cardView').style.display = 'block';

        const cardContainer = document.getElementById('cardContainer');

        cardContainer.innerHTML = currentData.map(item => `
            <div class="card-item ${this.selectedRows.has(item.id) ? 'selected' : ''}" data-id="${item.id}">
                <div class="card-item-header">
                    <input type="checkbox" class="card-item-checkbox" value="${item.id}" ${this.selectedRows.has(item.id) ? 'checked' : ''}>
                    <div class="card-item-actions">
                        <button class="action-btn view" title="View details" data-id="${item.id}" data-action="view">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn delete" title="Delete item" data-id="${item.id}" data-action="delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="card-item-title editable" data-id="${item.id}" data-action="edit" title="Click to edit">
                    ${this.highlightSearchTerms(this.escapeHtml(item.name), 'name')}
                </div>
                <div class="card-item-brand">
                    ${this.highlightSearchTerms(this.escapeHtml(item.brand || 'No Brand'), 'brand')}
                </div>
                <div class="card-item-meta">
                    <div class="card-item-meta-item">
                        <div class="card-item-meta-label">Category</div>
                        <div class="card-item-meta-value">${this.escapeHtml(item.category || 'General')}</div>
                    </div>
                    <div class="card-item-meta-item">
                        <div class="card-item-meta-label">Priority</div>
                        <div class="card-item-meta-value">${this.escapeHtml(item.priority || 'Medium')}</div>
                    </div>
                </div>
                <div class="card-item-description">
                    ${this.escapeHtml(item.description || 'No description available')}
                </div>
                <div class="card-item-status">
                    <span class="status-badge ${item.active ? 'status-active' : 'status-inactive'}">
                        ${item.active ? 'Active' : 'Inactive'}
                    </span>
                </div>
            </div>
        `).join('');

        this.addCardViewEventListeners(currentData);
    }

    // Add event listeners for card view
    addCardViewEventListeners(currentData) {
        const cardContainer = document.getElementById('cardContainer');

        // Add event listeners to checkboxes
        cardContainer.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const cardItem = e.target.closest('.card-item');
                this.handleCardItemSelection(parseInt(e.target.value), e.target.checked, cardItem);
            });
        });

        // Add event listeners to action buttons
        cardContainer.querySelectorAll('.action-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const id = parseInt(button.dataset.id);
                const action = button.dataset.action;

                if (action === 'view') {
                    this.viewItem(id);
                } else if (action === 'delete') {
                    this.deleteItem(id);
                }
            });
        });

        // Add event listeners to editable elements
        cardContainer.querySelectorAll('.editable').forEach(element => {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const id = parseInt(element.dataset.id);
                this.editItem(id);
            });
        });

        this.updateSelectAllCheckbox(currentData);
    }

    // Handle card item selection
    handleCardItemSelection(id, checked, cardItem) {
        if (checked) {
            this.selectedRows.add(id);
            cardItem.classList.add('selected');
        } else {
            this.selectedRows.delete(id);
            cardItem.classList.remove('selected');
        }

        this.updateSelectAllCheckbox(this.getCurrentPageData());
        this.updateDeleteButton();
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Pagination methods
    getTotalPages() {
        return Math.ceil(this.filteredData.length / this.pageSize);
    }

    goToPage(page) {
        const totalPages = this.getTotalPages();
        if (page < 1 || page > totalPages) return;

        this.currentPage = page;
        this.renderTable();
        this.updatePagination();
    }

    changePageSize(newSize) {
        this.pageSize = newSize;
        this.currentPage = 1;
        this.renderTable();
        this.updatePagination();
    }

    updatePagination() {
        const totalItems = this.filteredData.length;
        const totalPages = this.getTotalPages();

        // Calculate actual displayed items (considering grid optimization)
        let startItem, endItem;
        if (this.currentViewMode === 'grid') {
            const optimizedData = this.getOptimizedGridData();
            startItem = totalItems === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
            endItem = Math.min(startItem + optimizedData.length - 1, totalItems);
        } else {
            startItem = totalItems === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
            endItem = Math.min(this.currentPage * this.pageSize, totalItems);
        }

        document.getElementById('paginationInfo').textContent = `View ${startItem} - ${endItem} of ${totalItems}`;
        document.getElementById('currentPage').value = this.currentPage;
        document.getElementById('currentPage').max = totalPages;
        document.getElementById('totalPages').textContent = totalPages;

        // Update button states
        document.getElementById('firstPage').disabled = this.currentPage === 1;
        document.getElementById('prevPage').disabled = this.currentPage === 1;
        document.getElementById('nextPage').disabled = this.currentPage === totalPages || totalPages === 0;
        document.getElementById('lastPage').disabled = this.currentPage === totalPages || totalPages === 0;
    }

    // Modal methods
    openModal(item = null) {
        this.editingId = item ? item.id : null;
        const modal = document.getElementById('modalOverlay');
        const title = document.getElementById('modalTitle');
        const form = document.getElementById('functionGroupForm');

        title.textContent = item ? 'Edit Function Group' : 'New Function Group';

        if (item) {
            document.getElementById('functionGroupName').value = item.name;
            document.getElementById('brand').value = item.brand;
            document.getElementById('isActive').checked = item.active;
        } else {
            form.reset();
            document.getElementById('isActive').checked = true;
        }

        modal.classList.add('active');
        document.getElementById('functionGroupName').focus();
        this.validateForm();
    }

    closeModal() {
        const modal = document.getElementById('modalOverlay');
        modal.classList.remove('active');
        this.editingId = null;
        document.getElementById('functionGroupForm').reset();
        this.clearValidationErrors();
    }

    // CRUD operations
    saveItem() {
        if (!this.validateForm()) return;

        const name = document.getElementById('functionGroupName').value.trim();
        const brand = document.getElementById('brand').value.trim();
        const active = document.getElementById('isActive').checked;

        // Check for duplicate names (excluding current item when editing)
        const duplicate = this.data.find(item =>
            item.name.toLowerCase() === name.toLowerCase() &&
            item.id !== this.editingId
        );

        if (duplicate) {
            this.showValidationError('nameError', 'Function group name already exists');
            return;
        }

        if (this.editingId) {
            // Update existing item
            const index = this.data.findIndex(item => item.id === this.editingId);
            if (index !== -1) {
                this.data[index] = {
                    ...this.data[index],
                    name,
                    brand,
                    active,
                    lastModified: new Date().toISOString()
                };
                this.showToast('Function group updated successfully', 'success');
            }
        } else {
            // Create new item with metadata
            const newId = Math.max(...this.data.map(item => item.id), 0) + 1;
            const now = new Date().toISOString();
            const categories = ['Maintenance', 'Operations', 'Safety', 'Quality', 'Production'];
            const priorities = ['High', 'Medium', 'Low'];

            const newItem = {
                id: newId,
                name,
                brand,
                active,
                category: categories[Math.floor(Math.random() * categories.length)],
                priority: priorities[Math.floor(Math.random() * priorities.length)],
                description: `Function group for ${name} operations and management`,
                createdAt: now,
                lastModified: now,
                createdBy: 'Current User',
                version: '1.0'
            };

            this.data.push(newItem);
            this.showToast('Function group created successfully', 'success');
        }

        this.saveData();
        this.filteredData = [...this.data];
        this.renderTable();
        this.updatePagination();
        this.closeModal();
    }

    editItem(id) {
        const item = this.data.find(item => item.id === id);
        if (item) {
            this.openModal(item);
        }
    }

    viewItem(id) {
        const item = this.data.find(item => item.id === id);
        if (item) {
            this.openViewModal(item);
        }
    }

    openViewModal(item) {
        // Store the current item for potential editing
        this.viewingId = item.id;

        // Populate basic information
        document.getElementById('viewName').textContent = item.name;
        document.getElementById('viewBrand').textContent = item.brand || 'N/A';

        // Set status badge
        const statusElement = document.getElementById('viewStatus');
        statusElement.textContent = item.active ? 'Active' : 'Inactive';
        statusElement.className = `detail-value status-badge ${item.active ? 'status-active' : 'status-inactive'}`;

        // Set category badge
        const categoryElement = document.getElementById('viewCategory');
        categoryElement.textContent = item.category || 'N/A';
        categoryElement.className = 'detail-value category-badge';
        if (item.category) {
            categoryElement.setAttribute('data-category', item.category.toLowerCase());
        }

        // Set priority badge
        const priorityElement = document.getElementById('viewPriority');
        priorityElement.textContent = item.priority || 'N/A';
        priorityElement.className = 'detail-value priority-badge';
        if (item.priority) {
            priorityElement.setAttribute('data-priority', item.priority.toLowerCase());
        }

        // Set version
        document.getElementById('viewVersion').textContent = item.version || 'N/A';

        // Set description
        document.getElementById('viewDescription').textContent = item.description || 'No description available.';

        // Set metadata
        document.getElementById('viewCreatedAt').textContent = this.formatDateTime(item.createdAt);
        document.getElementById('viewCreatedBy').textContent = item.createdBy || 'Unknown';
        document.getElementById('viewLastModified').textContent = this.formatDateTime(item.lastModified);
        document.getElementById('viewId').textContent = `#${item.id}`;

        // Show the modal
        const modal = document.getElementById('viewModalOverlay');
        modal.classList.add('active');
    }

    closeViewModal() {
        const modal = document.getElementById('viewModalOverlay');
        modal.classList.remove('active');
        this.viewingId = null;
    }

    editFromView() {
        if (this.viewingId) {
            const item = this.data.find(item => item.id === this.viewingId);
            if (item) {
                this.closeViewModal();
                this.openModal(item);
            }
        }
    }

    formatDateTime(dateString) {
        if (!dateString) return 'N/A';

        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffMs = now - date;
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

            // Format the date
            const formatted = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            // Add relative time for recent dates
            if (diffDays === 0) {
                return `${formatted} (Today)`;
            } else if (diffDays === 1) {
                return `${formatted} (Yesterday)`;
            } else if (diffDays < 7) {
                return `${formatted} (${diffDays} days ago)`;
            } else {
                return formatted;
            }
        } catch (error) {
            return 'Invalid date';
        }
    }

    deleteItem(id) {
        const item = this.data.find(item => item.id === id);
        if (item) {
            this.showConfirmation(
                'Delete Function Group',
                `Are you sure you want to delete "${this.escapeHtml(item.name)}"?`,
                'Delete',
                () => {
                    this.data = this.data.filter(item => item.id !== id);
                    this.selectedRows.delete(id);
                    this.saveData();
                    this.filteredData = [...this.data];
                    this.renderTable();
                    this.updatePagination();
                    this.updateDeleteButton();
                    this.showToast('Function group deleted successfully', 'success');
                    this.closeConfirmation();
                }
            );
        }
    }

    deleteSelected() {
        if (this.selectedRows.size === 0) return;

        const count = this.selectedRows.size;
        this.showConfirmation(
            'Delete Selected Items',
            `Are you sure you want to delete ${count} selected function group${count > 1 ? 's' : ''}?`,
            'Delete All',
            () => {
                this.data = this.data.filter(item => !this.selectedRows.has(item.id));
                this.selectedRows.clear();
                this.saveData();
                this.filteredData = [...this.data];
                this.renderTable();
                this.updatePagination();
                this.updateDeleteButton();
                this.showToast(`${count} function group${count > 1 ? 's' : ''} deleted successfully`, 'success');
                this.closeConfirmation();
            }
        );
    }

    // Utility methods
    refresh() {
        this.showLoading();
        setTimeout(() => {
            this.selectedRows.clear();
            this.currentPage = 1;
            this.clearSearch();
            this.hideLoading();
            this.showToast('Data refreshed successfully', 'success');
        }, 500);
    }

    // Enhanced Export Functionality
    toggleExportDropdown() {
        const dropdown = document.getElementById('exportDropdown');
        const isActive = dropdown.classList.contains('active');

        // Close all dropdowns first
        this.closeAllDropdowns();

        if (!isActive) {
            dropdown.classList.add('active');
        }
    }

    // Advanced Search Export Dropdown
    toggleExportFilteredDropdown() {
        const dropdown = document.getElementById('exportFilteredDropdown');
        const isActive = dropdown.classList.contains('active');

        // Close all dropdowns first
        this.closeAllDropdowns();

        if (!isActive) {
            dropdown.classList.add('active');
        }
    }

    exportAsExcel() {
        this.closeAllDropdowns();

        // Create workbook and worksheet
        const data = this.getExportData();
        const ws_data = [
            ['Function Group Name', 'Brand', 'Is Active?'],
            ...data.map(item => [item.name, item.brand, item.active ? 'Yes' : 'No'])
        ];

        // Create Excel content using a simple approach
        const csvContent = ws_data.map(row =>
            row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
        ).join('\n');

        // Create blob and download
        const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `function_groups_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.showToast(`Excel file exported with ${data.length} records`, 'success');
    }

    exportAsPdf() {
        this.closeAllDropdowns();

        const data = this.getExportData();

        // Create PDF content using HTML and print
        const printWindow = window.open('', '_blank');
        const htmlContent = this.generatePdfContent(data);

        printWindow.document.write(htmlContent);
        printWindow.document.close();

        // Wait for content to load then print
        printWindow.onload = () => {
            printWindow.print();
            setTimeout(() => printWindow.close(), 1000);
        };

        this.showToast(`PDF generated with ${data.length} records`, 'success');
    }

    getExportData() {
        // Return filtered data if advanced search is active, otherwise all data
        return this.advancedSearchActive || document.getElementById('searchInput').value.trim()
            ? this.filteredData
            : this.data;
    }

    generatePdfContent(data) {
        const currentDate = new Date().toLocaleDateString();
        const recordCount = data.length;

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Function Groups Report</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                        color: #333;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                        border-bottom: 2px solid #3498db;
                        padding-bottom: 20px;
                    }
                    .header h1 {
                        color: #2c3e50;
                        margin: 0;
                        font-size: 28px;
                    }
                    .header p {
                        margin: 10px 0 0 0;
                        color: #7f8c8d;
                        font-size: 14px;
                    }
                    .summary {
                        background: #f8f9fa;
                        padding: 15px;
                        border-radius: 6px;
                        margin-bottom: 20px;
                        border-left: 4px solid #3498db;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    }
                    th {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 12px;
                        text-align: left;
                        font-weight: 600;
                    }
                    td {
                        padding: 10px 12px;
                        border-bottom: 1px solid #e9ecef;
                    }
                    tr:nth-child(even) {
                        background-color: #f8f9fa;
                    }
                    tr:hover {
                        background-color: #e3f2fd;
                    }
                    .status-active {
                        color: #27ae60;
                        font-weight: 600;
                    }
                    .status-inactive {
                        color: #e74c3c;
                        font-weight: 600;
                    }
                    .footer {
                        margin-top: 30px;
                        text-align: center;
                        font-size: 12px;
                        color: #7f8c8d;
                        border-top: 1px solid #e9ecef;
                        padding-top: 15px;
                    }
                    @media print {
                        body { margin: 0; }
                        .header { page-break-after: avoid; }
                        table { page-break-inside: avoid; }
                        tr { page-break-inside: avoid; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Function Groups Report</h1>
                    <p>Generated on ${currentDate}</p>
                </div>

                <div class="summary">
                    <strong>Summary:</strong> This report contains ${recordCount} function group${recordCount !== 1 ? 's' : ''}.
                    ${this.advancedSearchActive ? ' (Filtered results based on advanced search criteria)' : ''}
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Function Group Name</th>
                            <th>Brand</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(item => `
                            <tr>
                                <td>${this.escapeHtml(item.name)}</td>
                                <td>${this.escapeHtml(item.brand) || '-'}</td>
                                <td class="${item.active ? 'status-active' : 'status-inactive'}">
                                    ${item.active ? 'Active' : 'Inactive'}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div class="footer">
                    <p>Function Group Management System - Report generated automatically</p>
                </div>
            </body>
            </html>
        `;
    }

    generateCSV() {
        const headers = ['Function Group Name', 'Brand', 'Is Active'];
        const rows = this.data.map(item => [
            `"${item.name.replace(/"/g, '""')}"`,
            `"${item.brand.replace(/"/g, '""')}"`,
            item.active ? 'Yes' : 'No'
        ]);

        return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    }

    // Theme, Font, and View Mode Customization Methods
    initializeCustomization() {
        // Set up event listeners for customization controls
        this.setupCustomizationEventListeners();
    }

    toggleSettingsDropdown() {
        const dropdown = document.getElementById('settingsDropdown');
        const isActive = dropdown.classList.contains('active');

        this.closeAllDropdowns();

        if (!isActive) {
            dropdown.classList.add('active');
            this.updateSettingsIndicators();
        }
    }

    updateSettingsIndicators() {
        // Update theme indicators
        document.querySelectorAll('.theme-option').forEach(option => {
            const theme = option.dataset.theme;
            const check = option.querySelector('.theme-check');
            const isActive = theme === this.currentTheme;

            option.classList.toggle('active', isActive);
            if (check) {
                check.style.display = isActive ? 'inline' : 'none';
            }
        });

        // Update font indicators
        document.querySelectorAll('.font-option').forEach(option => {
            const font = option.dataset.font;
            const check = option.querySelector('.font-check');
            const isActive = font === this.currentFont;

            option.classList.toggle('active', isActive);
            if (check) {
                check.style.display = isActive ? 'inline' : 'none';
            }
        });

        // Update view mode indicators
        document.querySelectorAll('.view-mode-option').forEach(option => {
            const viewMode = option.dataset.view;
            const check = option.querySelector('.view-mode-check');
            const isActive = viewMode === this.currentViewMode;

            option.classList.toggle('active', isActive);
            if (check) {
                check.style.display = isActive ? 'inline' : 'none';
            }
        });
    }

    changeTheme(themeName, showToast = true) {
        this.currentTheme = themeName;

        // Remove existing theme attributes
        document.documentElement.removeAttribute('data-theme');
        document.body.removeAttribute('data-theme');

        // Apply theme globally by setting data-theme on document element
        if (themeName !== 'white') {
            document.documentElement.setAttribute('data-theme', themeName);
        }

        localStorage.setItem('selectedTheme', themeName);
        this.updateSettingsIndicators();
        this.closeAllDropdowns();

        if (showToast) {
            this.showToast(`Application theme changed to ${this.capitalizeFirst(themeName)}`, 'success');
        }
    }

    changeFont(fontName, showToast = true) {
        this.currentFont = fontName;
        document.body.style.fontFamily = `'${fontName}', serif`;
        localStorage.setItem('selectedFont', fontName);
        this.updateSettingsIndicators();
        this.closeAllDropdowns();

        if (showToast) {
            this.showToast(`Font changed to ${fontName}`, 'success');
        }
    }

    changeViewMode(viewMode, showToast = true) {
        this.currentViewMode = viewMode;
        localStorage.setItem('selectedViewMode', viewMode);
        this.updateSettingsIndicators();
        this.closeAllDropdowns();

        // Sync sorting controls for Grid and Card views
        this.syncSortingControls();

        // Re-render the current data in the new view mode
        this.renderTable();

        // Only show toast if requested (not during initialization)
        if (showToast) {
            const viewNames = {
                'list': 'List View',
                'grid': 'Grid View',
                'card': 'Card View'
            };

            this.showToast(`View mode changed to ${viewNames[viewMode]}`, 'success');
        }
    }

    // Sync sorting controls across views
    syncSortingControls() {
        const currentSort = this.getCurrentSortValue();
        const direction = this.sortDirection || 'asc';

        // Update Grid view controls
        const gridSortSelect = document.getElementById('gridSortSelect');
        if (gridSortSelect) {
            gridSortSelect.value = currentSort;
        }
        this.updateSortDirectionButton('grid', direction);

        // Update Card view controls
        const cardSortSelect = document.getElementById('cardSortSelect');
        if (cardSortSelect) {
            cardSortSelect.value = currentSort;
        }
        this.updateSortDirectionButton('card', direction);
    }

    closeAllDropdowns() {
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }

    handleOutsideClick(e) {
        // Close dropdowns if clicking outside
        if (!e.target.closest('.dropdown')) {
            this.closeAllDropdowns();
        }
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Test function for validation (can be called from browser console)
    testValidation() {
        const testCases = [
            { name: '1000', expected: true, description: 'Fully numeric name' },
            { name: '123Test', expected: true, description: 'Numeric start with letters' },
            { name: '42', expected: true, description: 'Short numeric name' },
            { name: 'Test123', expected: true, description: 'Letters with numbers' },
            { name: '', expected: false, description: 'Empty name' },
            { name: 'A'.repeat(51), expected: false, description: 'Name too long' },
            { name: 'Valid-Name_123.0', expected: true, description: 'Valid special characters' },
            { name: 'Invalid@Name#', expected: false, description: 'Invalid special characters' }
        ];

        console.log('Testing validation logic:');
        testCases.forEach(test => {
            // Temporarily set the input value
            const input = document.getElementById('functionGroupName');
            const originalValue = input.value;
            input.value = test.name;

            const result = this.validateForm();
            const passed = result === test.expected;

            console.log(`${passed ? '✅' : '❌'} ${test.description}: "${test.name}" - Expected: ${test.expected}, Got: ${result}`);

            // Restore original value
            input.value = originalValue;
        });

        // Clear any validation errors
        this.clearValidationErrors();
    }

    // Demonstration functions for Advanced Search features
    demonstrateThemes() {
        console.log('🎨 COMPREHENSIVE THEME SYSTEM DEMONSTRATION');
        console.log('===========================================');
        console.log('');
        console.log('📋 How to use the Theme System:');
        console.log('');
        console.log('🎯 AVAILABLE THEMES:');
        console.log('   • White Theme: Clean, light appearance (default)');
        console.log('   • Black Theme: Professional dark theme');
        console.log('   • Blue Theme: Professional blue color scheme');
        console.log('   • Green Theme: Nature-inspired green theme');
        console.log('   • Purple Theme: Royal purple color scheme');
        console.log('');
        console.log('🔧 THEME AFFECTS:');
        console.log('   • Background colors (main container, modals, content areas)');
        console.log('   • Text colors (all text throughout the application)');
        console.log('   • Button colors (primary, secondary, action buttons)');
        console.log('   • Border colors (table borders, input fields, containers)');
        console.log('   • Dropdown menus and modal backgrounds');
        console.log('   • Table headers with theme-specific gradients');
        console.log('');
        console.log('⚡ HOW TO CHANGE THEMES:');
        console.log('   • Click the "Themes" dropdown in the toolbar');
        console.log('   • Select any theme to apply it instantly');
        console.log('   • Theme preference is saved automatically');
        console.log('   • Changes apply to the entire application interface');
        console.log('');
        console.log('♿ ACCESSIBILITY:');
        console.log('   • All themes maintain proper color contrast ratios');
        console.log('   • Text remains readable in all theme variations');
        console.log('   • Visual hierarchy is preserved across themes');
    }

    demonstrateCaseSensitive() {
        console.log('🔤 CASE SENSITIVE SEARCH DEMONSTRATION');
        console.log('======================================');
        console.log('');
        console.log('📋 How Case Sensitive toggle affects search:');
        console.log('');
        console.log('🔍 EXAMPLE SEARCH: Name contains "test"');
        console.log('');
        console.log('📊 Sample Data:');
        console.log('   • "Test FGN" (capital T)');
        console.log('   • "test group" (lowercase t)');
        console.log('   • "Testing123" (capital T)');
        console.log('   • "MY_TEST" (uppercase TEST)');
        console.log('');
        console.log('✅ CASE SENSITIVE OFF (default):');
        console.log('   Search for "test" will find:');
        console.log('   ✓ "Test FGN" (matches)');
        console.log('   ✓ "test group" (matches)');
        console.log('   ✓ "Testing123" (matches)');
        console.log('   ✓ "MY_TEST" (matches)');
        console.log('   → All 4 items found');
        console.log('');
        console.log('🔒 CASE SENSITIVE ON:');
        console.log('   Search for "test" will find:');
        console.log('   ✗ "Test FGN" (no match - capital T)');
        console.log('   ✓ "test group" (matches exactly)');
        console.log('   ✗ "Testing123" (no match - capital T)');
        console.log('   ✗ "MY_TEST" (no match - uppercase)');
        console.log('   → Only 1 item found');
        console.log('');
        console.log('💡 USE CASES:');
        console.log('   • Case Sensitive OFF: General searches, user-friendly');
        console.log('   • Case Sensitive ON: Precise searches, exact matches');
        console.log('');
        console.log('🧪 TRY IT YOURSELF:');
        console.log('   1. Open Advanced Search');
        console.log('   2. Add criteria: Name contains "test"');
        console.log('   3. Toggle "Case Sensitive" on/off');
        console.log('   4. Observe different result counts');
    }

    // Comprehensive feature demonstration
    demonstrateFeatures() {
        console.log('🚀 FUNCTION GROUP MANAGEMENT - FEATURE DEMONSTRATION');
        console.log('====================================================');
        console.log('');
        console.log('⌨️  KEYBOARD SHORTCUTS:');
        console.log('   • ESC: Close any open modal or dropdown');
        console.log('   • ENTER: Execute search in Advanced Search modal');
        console.log('   • Ctrl+N: Create new function group');
        console.log('   • Ctrl+F: Focus on search box');
        console.log('   • Ctrl+Shift+F: Open Advanced Search');
        console.log('   • Ctrl+R: Refresh data');
        console.log('   • Delete: Delete selected items');
        console.log('');
        console.log('🔍 ADVANCED SEARCH FEATURES:');
        console.log('   • Multiple search criteria with AND/OR logic');
        console.log('   • Case sensitive toggle');
        console.log('   • Quick filters (Active/Inactive, With/Without Brand)');
        console.log('   • Search history (automatic tracking)');
        console.log('   • Export filtered results (Excel/PDF)');
        console.log('');
        console.log('📊 EXPORT OPTIONS:');
        console.log('   • Main Export: All data as Excel/PDF');
        console.log('   • Filtered Export: Only search results as Excel/PDF');
        console.log('');
        console.log('🎨 CUSTOMIZATION:');
        console.log('   • 5 Theme options for table header');
        console.log('   • 5 Font options for entire application');
        console.log('   • Settings persist between sessions');
        console.log('');
        console.log('📱 RESPONSIVE DESIGN:');
        console.log('   • Mobile-friendly interface');
        console.log('   • Touch-optimized controls');
        console.log('   • Adaptive layouts for all screen sizes');
        console.log('');
        console.log('💾 DATA PERSISTENCE:');
        console.log('   • All data saved in browser localStorage');
        console.log('   • Search history preserved');
        console.log('   • Theme and font preferences remembered');
        console.log('');
        console.log('🧪 TO TEST FEATURES:');
        console.log('   • functionGroupManager.demonstrateThemes()');
        console.log('   • functionGroupManager.demonstrateCaseSensitive()');
        console.log('   • functionGroupManager.testValidation()');
    }

    // Advanced Search Methods
    initializeAdvancedSearch() {
        // Load search history
        this.loadSearchHistory();
        this.updateSearchHistory();
    }

    openAdvancedSearch() {
        const modal = document.getElementById('advancedSearchOverlay');
        modal.classList.add('active');

        // Add initial criteria if none exist
        if (this.searchCriteria.length === 0) {
            this.addSearchCriteria();
        }

        this.updateCriteriaDisplay();
        this.updateResultsPreview();
    }

    closeAdvancedSearch() {
        const modal = document.getElementById('advancedSearchOverlay');
        modal.classList.remove('active');
    }

    addSearchCriteria() {
        const criteria = {
            id: ++this.criteriaCounter,
            field: 'name',
            operator: 'contains',
            value: ''
        };

        this.searchCriteria.push(criteria);
        this.updateCriteriaDisplay();
    }

    removeCriteria(id) {
        this.searchCriteria = this.searchCriteria.filter(c => c.id !== id);
        this.updateCriteriaDisplay();
        this.updateResultsPreview();
    }

    updateCriteriaDisplay() {
        const container = document.getElementById('criteriaList');

        if (this.searchCriteria.length === 0) {
            container.innerHTML = `
                <div class="empty-criteria">
                    <i class="fas fa-search"></i>
                    <p>No search criteria added. Click "Add Criteria" to start building your search.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.searchCriteria.map(criteria => `
            <div class="criteria-item" data-id="${criteria.id}">
                <select class="form-select criteria-field" onchange="functionGroupManager.updateCriteria(${criteria.id}, 'field', this.value)">
                    <option value="name" ${criteria.field === 'name' ? 'selected' : ''}>Function Group Name</option>
                    <option value="brand" ${criteria.field === 'brand' ? 'selected' : ''}>Brand</option>
                    <option value="active" ${criteria.field === 'active' ? 'selected' : ''}>Active Status</option>
                </select>

                <select class="form-select criteria-operator" onchange="functionGroupManager.updateCriteria(${criteria.id}, 'operator', this.value)">
                    <option value="contains" ${criteria.operator === 'contains' ? 'selected' : ''}>Contains</option>
                    <option value="equals" ${criteria.operator === 'equals' ? 'selected' : ''}>Equals</option>
                    <option value="startsWith" ${criteria.operator === 'startsWith' ? 'selected' : ''}>Starts With</option>
                    <option value="endsWith" ${criteria.operator === 'endsWith' ? 'selected' : ''}>Ends With</option>
                    <option value="notContains" ${criteria.operator === 'notContains' ? 'selected' : ''}>Does Not Contain</option>
                    <option value="isEmpty" ${criteria.operator === 'isEmpty' ? 'selected' : ''}>Is Empty</option>
                    <option value="isNotEmpty" ${criteria.operator === 'isNotEmpty' ? 'selected' : ''}>Is Not Empty</option>
                </select>

                <div class="criteria-value">
                    ${this.renderCriteriaValueInput(criteria)}
                </div>

                <button class="remove-criteria" onclick="functionGroupManager.removeCriteria(${criteria.id})" title="Remove criteria">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }

    renderCriteriaValueInput(criteria) {
        if (criteria.field === 'active') {
            return `
                <select class="form-select" onchange="functionGroupManager.updateCriteria(${criteria.id}, 'value', this.value)">
                    <option value="true" ${criteria.value === 'true' ? 'selected' : ''}>Active</option>
                    <option value="false" ${criteria.value === 'false' ? 'selected' : ''}>Inactive</option>
                </select>
            `;
        }

        if (criteria.operator === 'isEmpty' || criteria.operator === 'isNotEmpty') {
            return '<input type="text" placeholder="No value needed" disabled>';
        }

        return `<input type="text" value="${this.escapeHtml(criteria.value)}"
                onchange="functionGroupManager.updateCriteria(${criteria.id}, 'value', this.value)"
                placeholder="Enter search value">`;
    }

    updateCriteria(id, property, value) {
        const criteria = this.searchCriteria.find(c => c.id === id);
        if (criteria) {
            criteria[property] = value;

            // Reset value if operator changed to isEmpty/isNotEmpty
            if (property === 'operator' && (value === 'isEmpty' || value === 'isNotEmpty')) {
                criteria.value = '';
            }

            // Reset value if field changed to active
            if (property === 'field' && value === 'active') {
                criteria.value = 'true';
                criteria.operator = 'equals';
            }

            this.updateCriteriaDisplay();
            this.updateResultsPreview();
        }
    }

    applyAdvancedSearch() {
        // Validate criteria
        const validCriteria = this.searchCriteria.filter(c => {
            if (c.operator === 'isEmpty' || c.operator === 'isNotEmpty') return true;
            return c.value.trim() !== '';
        });

        if (validCriteria.length === 0) {
            this.showToast('Please add at least one valid search criteria', 'warning');
            return;
        }

        // Save to history
        this.saveToHistory();

        // Apply search
        this.advancedSearchActive = true;
        this.performAdvancedSearch();
        this.closeAdvancedSearch();
        this.showToast(`Advanced search applied with ${validCriteria.length} criteria`, 'success');
    }

    performAdvancedSearch() {
        const caseSensitive = document.getElementById('caseSensitive').checked;
        const logicOperator = document.getElementById('logicOperator').value;
        const statusFilter = document.querySelector('input[name="statusFilter"]:checked').value;
        const brandFilter = document.querySelector('input[name="brandFilter"]:checked').value;

        this.filteredData = this.data.filter(item => {
            // Apply quick filters first
            if (statusFilter === 'active' && !item.active) return false;
            if (statusFilter === 'inactive' && item.active) return false;
            if (brandFilter === 'with' && !item.brand.trim()) return false;
            if (brandFilter === 'without' && item.brand.trim()) return false;

            // Apply search criteria
            const validCriteria = this.searchCriteria.filter(c => {
                if (c.operator === 'isEmpty' || c.operator === 'isNotEmpty') return true;
                return c.value.trim() !== '';
            });

            if (validCriteria.length === 0) return true;

            const results = validCriteria.map(criteria => this.evaluateCriteria(item, criteria, caseSensitive));

            return logicOperator === 'AND' ? results.every(r => r) : results.some(r => r);
        });

        this.currentPage = 1;
        this.renderTable();
        this.updatePagination();
    }

    evaluateCriteria(item, criteria, caseSensitive) {
        let itemValue = item[criteria.field];
        let searchValue = criteria.value;

        // Handle active field
        if (criteria.field === 'active') {
            itemValue = itemValue.toString();
            searchValue = searchValue.toString();
        } else {
            itemValue = itemValue.toString();
            if (!caseSensitive) {
                itemValue = itemValue.toLowerCase();
                searchValue = searchValue.toLowerCase();
            }
        }

        // Handle wildcard search
        if (searchValue.includes('*') || searchValue.includes('?')) {
            const regex = new RegExp(
                searchValue.replace(/\*/g, '.*').replace(/\?/g, '.'),
                caseSensitive ? '' : 'i'
            );
            return regex.test(itemValue);
        }

        switch (criteria.operator) {
            case 'contains':
                return itemValue.includes(searchValue);
            case 'equals':
                return itemValue === searchValue;
            case 'startsWith':
                return itemValue.startsWith(searchValue);
            case 'endsWith':
                return itemValue.endsWith(searchValue);
            case 'notContains':
                return !itemValue.includes(searchValue);
            case 'isEmpty':
                return itemValue.trim() === '';
            case 'isNotEmpty':
                return itemValue.trim() !== '';
            default:
                return false;
        }
    }

    resetAdvancedSearch() {
        // Reset all form elements
        document.getElementById('caseSensitive').checked = false;
        document.getElementById('logicOperator').value = 'AND';
        document.querySelector('input[name="statusFilter"][value="all"]').checked = true;
        document.querySelector('input[name="brandFilter"][value="all"]').checked = true;

        // Clear criteria
        this.searchCriteria = [];
        this.criteriaCounter = 0;
        this.updateCriteriaDisplay();

        // Reset search state
        this.advancedSearchActive = false;
        this.filteredData = [...this.data];
        this.currentPage = 1;
        this.renderTable();
        this.updatePagination();

        // Hide results preview
        document.getElementById('resultsPreview').style.display = 'none';

        this.showToast('Advanced search reset', 'info');
    }

    updateResultsPreview() {
        if (this.searchCriteria.length === 0) {
            document.getElementById('resultsPreview').style.display = 'none';
            return;
        }

        // Simulate search to get count
        const tempFiltered = this.data.filter(item => {
            const caseSensitive = document.getElementById('caseSensitive').checked;
            const logicOperator = document.getElementById('logicOperator').value;
            const statusFilter = document.querySelector('input[name="statusFilter"]:checked').value;
            const brandFilter = document.querySelector('input[name="brandFilter"]:checked').value;

            // Apply quick filters
            if (statusFilter === 'active' && !item.active) return false;
            if (statusFilter === 'inactive' && item.active) return false;
            if (brandFilter === 'with' && !item.brand.trim()) return false;
            if (brandFilter === 'without' && item.brand.trim()) return false;

            // Apply criteria
            const validCriteria = this.searchCriteria.filter(c => {
                if (c.operator === 'isEmpty' || c.operator === 'isNotEmpty') return true;
                return c.value.trim() !== '';
            });

            if (validCriteria.length === 0) return true;

            const results = validCriteria.map(criteria => this.evaluateCriteria(item, criteria, caseSensitive));
            return logicOperator === 'AND' ? results.every(r => r) : results.some(r => r);
        });

        document.getElementById('resultsCount').textContent = `${tempFiltered.length} results found`;
        document.getElementById('resultsPreview').style.display = 'block';
    }



    // Search History Methods
    loadSearchHistory() {
        const saved = localStorage.getItem('searchHistory');
        this.searchHistory = saved ? JSON.parse(saved) : [];
    }

    saveSearchHistory() {
        localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    }

    saveToHistory() {
        const validCriteria = this.searchCriteria.filter(c => {
            if (c.operator === 'isEmpty' || c.operator === 'isNotEmpty') return true;
            return c.value.trim() !== '';
        });

        if (validCriteria.length === 0) return;

        const historyItem = {
            id: Date.now().toString(),
            criteria: [...validCriteria],
            caseSensitive: document.getElementById('caseSensitive').checked,
            logicOperator: document.getElementById('logicOperator').value,
            statusFilter: document.querySelector('input[name="statusFilter"]:checked').value,
            brandFilter: document.querySelector('input[name="brandFilter"]:checked').value,
            searchedAt: new Date().toISOString(),
            description: this.generateSearchDescription(validCriteria)
        };

        // Remove duplicates and limit history
        this.searchHistory = this.searchHistory.filter(h => h.description !== historyItem.description);
        this.searchHistory.unshift(historyItem);
        this.searchHistory = this.searchHistory.slice(0, 10); // Keep only last 10

        this.saveSearchHistory();
        this.updateSearchHistory();
    }

    generateSearchDescription(criteria) {
        const descriptions = criteria.map(c => {
            let desc = `${c.field} ${c.operator}`;
            if (c.operator !== 'isEmpty' && c.operator !== 'isNotEmpty') {
                desc += ` "${c.value}"`;
            }
            return desc;
        });
        return descriptions.join(' AND ');
    }

    updateSearchHistory() {
        const container = document.getElementById('searchHistoryList');

        if (this.searchHistory.length === 0) {
            container.innerHTML = '<p class="no-history">No recent searches</p>';
            return;
        }

        container.innerHTML = this.searchHistory.map(item => `
            <div class="history-item" onclick="functionGroupManager.loadFromHistory('${item.id}')">
                <div class="history-text">${this.escapeHtml(item.description)}</div>
                <div class="history-date">${new Date(item.searchedAt).toLocaleDateString()}</div>
            </div>
        `).join('');
    }

    loadFromHistory(historyId) {
        const item = this.searchHistory.find(h => h.id === historyId);
        if (!item) return;

        // Load criteria
        this.searchCriteria = [...item.criteria];
        this.criteriaCounter = Math.max(...this.searchCriteria.map(c => c.id), 0);

        // Load settings
        document.getElementById('caseSensitive').checked = item.caseSensitive;
        document.getElementById('logicOperator').value = item.logicOperator;
        document.querySelector(`input[name="statusFilter"][value="${item.statusFilter}"]`).checked = true;
        document.querySelector(`input[name="brandFilter"][value="${item.brandFilter}"]`).checked = true;

        // Update display
        this.updateCriteriaDisplay();
        this.updateResultsPreview();
        this.showToast('Search loaded from history', 'success');
    }

    // Export filtered results
    exportFilteredResults() {
        if (this.filteredData.length === 0) {
            this.showToast('No results to export', 'warning');
            return;
        }

        const csvContent = this.generateFilteredCSV();
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `filtered_function_groups_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.showToast(`Exported ${this.filteredData.length} filtered results`, 'success');
    }

    // Export filtered results as Excel
    exportFilteredAsExcel() {
        this.closeAllDropdowns();
        const filteredData = this.getAdvancedSearchResults();

        if (filteredData.length === 0) {
            this.showToast('No results to export', 'warning');
            return;
        }

        // Generate Excel-compatible CSV
        const headers = ['Function Group Name', 'Brand', 'Is Active'];
        const rows = filteredData.map(item => [
            `"${item.name.replace(/"/g, '""')}"`,
            `"${item.brand.replace(/"/g, '""')}"`,
            item.active ? 'Yes' : 'No'
        ]);

        const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `function-groups-filtered-${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        this.showToast(`Exported ${filteredData.length} filtered results as Excel`, 'success');
    }

    // Export filtered results as PDF
    exportFilteredAsPdf() {
        this.closeAllDropdowns();
        const filteredData = this.getAdvancedSearchResults();

        if (filteredData.length === 0) {
            this.showToast('No results to export', 'warning');
            return;
        }

        // Create PDF content
        let pdfContent = `Function Groups - Filtered Results (${filteredData.length} items)\n`;
        pdfContent += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
        pdfContent += 'Function Group Name\tBrand\tIs Active\n';
        pdfContent += '='.repeat(50) + '\n';

        filteredData.forEach(item => {
            pdfContent += `${item.name}\t${item.brand || 'N/A'}\t${item.active ? 'Yes' : 'No'}\n`;
        });

        // Download as text file (PDF generation would require additional library)
        const blob = new Blob([pdfContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `function-groups-filtered-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        this.showToast(`Exported ${filteredData.length} filtered results as PDF`, 'success');
    }

    // Get current advanced search results
    getAdvancedSearchResults() {
        if (!this.advancedSearchActive) {
            return this.filteredData;
        }

        const caseSensitive = document.getElementById('caseSensitive').checked;
        const logicOperator = document.getElementById('logicOperator').value;
        const statusFilter = document.querySelector('input[name="statusFilter"]:checked').value;
        const brandFilter = document.querySelector('input[name="brandFilter"]:checked').value;

        return this.data.filter(item => {
            // Apply quick filters
            if (statusFilter === 'active' && !item.active) return false;
            if (statusFilter === 'inactive' && item.active) return false;
            if (brandFilter === 'with' && !item.brand.trim()) return false;
            if (brandFilter === 'without' && item.brand.trim()) return false;

            // Apply criteria
            const validCriteria = this.searchCriteria.filter(c => {
                if (c.operator === 'isEmpty' || c.operator === 'isNotEmpty') return true;
                return c.value.trim() !== '';
            });

            if (validCriteria.length === 0) return true;

            const results = validCriteria.map(criteria => this.evaluateCriteria(item, criteria, caseSensitive));
            return logicOperator === 'AND' ? results.every(r => r) : results.some(r => r);
        });
    }

    generateFilteredCSV() {
        const headers = ['Function Group Name', 'Brand', 'Is Active'];
        const rows = this.filteredData.map(item => [
            `"${item.name.replace(/"/g, '""')}"`,
            `"${item.brand.replace(/"/g, '""')}"`,
            item.active ? 'Yes' : 'No'
        ]);

        return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    }

    /**
     * Validation methods for Function Group names
     *
     * Validation Rules:
     * - Names can start with numbers (e.g., "123ABC", "9Test")
     * - Names can consist entirely of numbers (e.g., "1000", "42", "999")
     * - Names can contain mixed alphanumeric characters in any order
     * - Names cannot be empty
     * - Names must be 50 characters or less
     * - Names cannot be duplicates (case-insensitive)
     * - Allowed characters: letters, numbers, spaces, hyphens, underscores, periods
     */
    validateForm() {
        const name = document.getElementById('functionGroupName').value.trim();
        const saveBtn = document.getElementById('saveBtn');

        this.clearValidationErrors();

        if (!name) {
            this.showValidationError('nameError', 'Function group name is required');
            saveBtn.disabled = true;
            return false;
        }

        if (name.length > 50) {
            this.showValidationError('nameError', 'Function group name must be 50 characters or less');
            saveBtn.disabled = true;
            return false;
        }

        // Allow names with any combination of letters, numbers, and common characters
        // Accept names that start with numbers, consist entirely of numbers, or mixed alphanumeric
        // Pattern allows: letters (a-z, A-Z), numbers (0-9), spaces, hyphens, underscores, periods
        const validNamePattern = /^[a-zA-Z0-9\s\-_\.]+$/;

        if (!validNamePattern.test(name)) {
            this.showValidationError('nameError', 'Function group name contains invalid characters. Only letters, numbers, spaces, hyphens, underscores, and periods are allowed');
            saveBtn.disabled = true;
            return false;
        }

        saveBtn.disabled = false;
        return true;
    }

    showValidationError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }

    clearValidationErrors() {
        document.querySelectorAll('.error-message').forEach(element => {
            element.classList.remove('show');
            element.textContent = '';
        });
    }

    // UI feedback methods
    showLoading() {
        document.getElementById('loadingIndicator').style.display = 'block';
        document.querySelector('.table-container').style.opacity = '0.5';
    }

    hideLoading() {
        document.getElementById('loadingIndicator').style.display = 'none';
        document.querySelector('.table-container').style.opacity = '1';
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-${this.getToastIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        container.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 100);

        // Auto remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => container.removeChild(toast), 300);
        }, 3000);
    }

    getToastIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || icons.info;
    }

    showConfirmation(title, message, confirmText, onConfirm) {
        document.getElementById('confirmationTitle').textContent = title;
        document.getElementById('confirmationMessage').innerHTML = message;
        document.getElementById('confirmationConfirm').innerHTML = `<i class="fas fa-check"></i> ${confirmText}`;

        const overlay = document.getElementById('confirmationOverlay');
        overlay.classList.add('active');

        // Remove existing listeners and add new one
        const confirmBtn = document.getElementById('confirmationConfirm');
        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
        newConfirmBtn.addEventListener('click', onConfirm);
    }

    closeConfirmation() {
        document.getElementById('confirmationOverlay').classList.remove('active');
    }

    // Enhanced Keyboard shortcuts
    handleKeyboard(e) {
        // ESC key functionality - close modals and dropdowns with priority
        if (e.key === 'Escape') {
            e.preventDefault();

            // Priority order: modals first, then dropdowns, then clear search
            const modals = [
                { id: 'advancedSearchOverlay', closeMethod: () => this.closeAdvancedSearch() },
                { id: 'viewModalOverlay', closeMethod: () => this.closeViewModal() },
                { id: 'confirmationOverlay', closeMethod: () => this.closeConfirmation() },
                { id: 'modalOverlay', closeMethod: () => this.closeModal() }
            ];

            // Check and close the first active modal found
            for (const modal of modals) {
                const element = document.getElementById(modal.id);
                if (element && element.classList.contains('active')) {
                    modal.closeMethod();
                    return; // Exit after closing first modal
                }
            }

            // If no modals are open, close any open dropdowns
            const openDropdowns = document.querySelectorAll('.dropdown.active');
            if (openDropdowns.length > 0) {
                this.closeAllDropdowns();
                return;
            }

            // If no modals or dropdowns are open, clear search
            this.clearSearch();
            return;
        }

        // ENTER key in Advanced Search modal to execute search
        if (e.key === 'Enter') {
            const advancedSearchModal = document.getElementById('advancedSearchOverlay');
            if (advancedSearchModal && advancedSearchModal.classList.contains('active')) {
                // Don't trigger if focus is on a button or specific input elements
                if (!e.target.matches('button, input[type="button"], input[type="submit"], select')) {
                    e.preventDefault();
                    this.applyAdvancedSearch();
                    return;
                }
            }
        }

        // Ctrl+N for new item
        if (e.ctrlKey && e.key === 'n') {
            e.preventDefault();
            this.openModal();
        }

        // Ctrl+Shift+F for advanced search
        if (e.ctrlKey && e.shiftKey && e.key === 'F') {
            e.preventDefault();
            this.openAdvancedSearch();
        }

        // Delete key for selected items (only when not in input fields)
        if (e.key === 'Delete' && this.selectedRows.size > 0 && !e.target.matches('input, textarea')) {
            e.preventDefault();
            this.deleteSelected();
        }

        // Ctrl+F for search focus
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            document.getElementById('searchInput').focus();
        }

        // Ctrl+R for refresh
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            this.refresh();
        }
    }
    // ===== NAVIGATION SYSTEM METHODS =====

    // Initialize navigation system
    initializeNavigation() {
        // Initialize sidebar state
        this.sidebarCollapsed = false;
        this.isMobile = window.innerWidth <= 768;
        this.sidebarMobileOpen = false;

        // Get navigation elements
        this.sidebar = document.getElementById('sidebar');
        this.sidebarToggle = document.getElementById('sidebarToggle');
        this.mainLayout = document.querySelector('.main-layout');
        this.userDropdownToggle = document.getElementById('userDropdownToggle');
        this.userDropdownMenu = document.getElementById('userDropdownMenu');

        // Add event listeners
        this.setupNavigationEventListeners();

        // Set initial state
        this.updateNavigationState();

        // Initialize navigation dropdown states
        this.initializeNavigationState();

        // Handle window resize
        window.addEventListener('resize', () => this.handleNavigationResize());

        // Add tooltips to navigation links for collapsed state
        this.addNavigationTooltips();

        // Initialize keyboard navigation
        this.initializeKeyboardNavigation();
    }

    // Setup navigation event listeners
    setupNavigationEventListeners() {
        // Sidebar toggle
        this.sidebarToggle.addEventListener('click', () => this.toggleSidebar());

        // User dropdown
        this.userDropdownToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleUserDropdown();
        });

        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigationClick(e));
        });

        // Submenu links
        document.querySelectorAll('.nav-sublink').forEach(link => {
            link.addEventListener('click', (e) => this.handleSubmenuClick(e));
        });

        // Sub-submenu links (third level)
        document.querySelectorAll('.nav-subsublink').forEach(link => {
            link.addEventListener('click', (e) => this.handleSubSubmenuClick(e));
        });

        // Dropdown toggles
        document.querySelectorAll('.nav-dropdown-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => this.handleDropdownToggle(e));
        });

        // Sub-dropdown toggles (nested)
        document.querySelectorAll('.nav-subdropdown-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => this.handleSubDropdownToggle(e));
        });

        // User dropdown items
        document.querySelectorAll('.user-dropdown-item').forEach(item => {
            item.addEventListener('click', (e) => this.handleUserDropdownClick(e));
        });

        // Navigation action buttons
        document.getElementById('notificationsBtn')?.addEventListener('click', () => {
            this.showToast('Notifications feature coming soon!', 'info');
        });

        document.getElementById('helpBtn')?.addEventListener('click', () => {
            this.showToast('Help & Support feature coming soon!', 'info');
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => this.handleNavigationOutsideClick(e));

        // Create mobile backdrop
        if (this.isMobile) {
            this.createMobileBackdrop();
        }
    }

    // Toggle sidebar
    toggleSidebar() {
        if (this.isMobile) {
            this.sidebarMobileOpen = !this.sidebarMobileOpen;
            this.sidebar.classList.toggle('mobile-open', this.sidebarMobileOpen);

            const backdrop = document.querySelector('.sidebar-backdrop');
            if (backdrop) {
                backdrop.classList.toggle('active', this.sidebarMobileOpen);
            }
        } else {
            this.sidebarCollapsed = !this.sidebarCollapsed;
            this.sidebar.classList.toggle('collapsed', this.sidebarCollapsed);
            this.mainLayout.classList.toggle('sidebar-collapsed', this.sidebarCollapsed);
        }

        // Update toggle button aria-expanded
        this.sidebarToggle.setAttribute('aria-expanded',
            this.isMobile ? this.sidebarMobileOpen : !this.sidebarCollapsed);

        // Announce state change for screen readers
        const message = this.isMobile
            ? (this.sidebarMobileOpen ? 'Sidebar opened' : 'Sidebar closed')
            : (this.sidebarCollapsed ? 'Sidebar collapsed' : 'Sidebar expanded');

        this.announceToScreenReader(message);
    }

    // Toggle user dropdown
    toggleUserDropdown() {
        const isOpen = this.userDropdownMenu.classList.contains('active');
        this.userDropdownMenu.classList.toggle('active', !isOpen);
        this.userDropdownToggle.setAttribute('aria-expanded', !isOpen);
    }

    // Handle navigation link clicks
    handleNavigationClick(e) {
        // Check if this is a dropdown toggle
        if (e.currentTarget.classList.contains('nav-dropdown-toggle')) {
            return; // Let handleDropdownToggle handle this
        }

        e.preventDefault();
        const link = e.currentTarget;
        const page = link.dataset.page;

        // Remove active state from all nav items and subitems
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelectorAll('.nav-subitem').forEach(item => {
            item.classList.remove('active');
        });

        // Add active state to clicked item
        link.closest('.nav-item').classList.add('active');

        // Get consistent title from sidebar text
        const sidebarTitle = link.querySelector('.nav-text').textContent.trim();

        // Update breadcrumb with consistent title
        this.updateBreadcrumb(page, sidebarTitle);

        // Handle page navigation
        this.navigateToPage(page);

        // Close mobile sidebar if open
        if (this.isMobile && this.sidebarMobileOpen) {
            this.toggleSidebar();
        }

        // Announce navigation for screen readers
        this.announceToScreenReader(`Navigated to ${sidebarTitle}`);
    }

    // Handle dropdown toggle clicks
    handleDropdownToggle(e) {
        e.preventDefault();
        const toggle = e.currentTarget;
        const dropdown = toggle.closest('.nav-dropdown');
        const isExpanded = dropdown.classList.contains('expanded');

        // Close all other dropdowns
        document.querySelectorAll('.nav-dropdown').forEach(item => {
            if (item !== dropdown) {
                item.classList.remove('expanded');
                const otherToggle = item.querySelector('.nav-dropdown-toggle');
                if (otherToggle) {
                    otherToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });

        // Toggle current dropdown
        dropdown.classList.toggle('expanded', !isExpanded);
        toggle.setAttribute('aria-expanded', !isExpanded);

        // Announce state change for screen readers
        const dropdownName = toggle.querySelector('.nav-text').textContent.trim();
        const message = !isExpanded ? `${dropdownName} menu expanded` : `${dropdownName} menu collapsed`;
        this.announceToScreenReader(message);
    }

    // Handle submenu link clicks
    handleSubmenuClick(e) {
        // Check if this is a sub-dropdown toggle
        if (e.currentTarget.classList.contains('nav-subdropdown-toggle')) {
            return; // Let handleSubDropdownToggle handle this
        }

        e.preventDefault();
        const link = e.currentTarget;
        const page = link.dataset.page;

        // Remove active state from all nav items, subitems, and sub-subitems
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelectorAll('.nav-subitem').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelectorAll('.nav-subsubitem').forEach(item => {
            item.classList.remove('active');
        });

        // Add active state to clicked subitem and parent dropdown
        link.closest('.nav-subitem').classList.add('active');
        link.closest('.nav-dropdown').classList.add('expanded');

        // Get consistent title from sidebar text
        const sidebarTitle = link.querySelector('.nav-subtext').textContent.trim();
        const parentTitle = link.closest('.nav-dropdown').querySelector('.nav-text').textContent.trim();

        // Update breadcrumb with hierarchical path
        this.updateHierarchicalBreadcrumb(parentTitle, sidebarTitle, page);

        // Handle page navigation
        this.navigateToPage(page);

        // Close mobile sidebar if open
        if (this.isMobile && this.sidebarMobileOpen) {
            this.toggleSidebar();
        }

        // Announce navigation for screen readers
        this.announceToScreenReader(`Navigated to ${parentTitle} > ${sidebarTitle}`);
    }

    // Handle sub-dropdown toggle clicks (nested dropdowns)
    handleSubDropdownToggle(e) {
        e.preventDefault();
        const toggle = e.currentTarget;
        const subdropdown = toggle.closest('.nav-subdropdown');
        const isExpanded = subdropdown.classList.contains('expanded');

        // Close all other sub-dropdowns
        document.querySelectorAll('.nav-subdropdown').forEach(item => {
            if (item !== subdropdown) {
                item.classList.remove('expanded');
                const otherToggle = item.querySelector('.nav-subdropdown-toggle');
                if (otherToggle) {
                    otherToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });

        // Toggle current sub-dropdown
        subdropdown.classList.toggle('expanded', !isExpanded);
        toggle.setAttribute('aria-expanded', !isExpanded);

        // Announce state change for screen readers
        const dropdownName = toggle.querySelector('.nav-subtext').textContent.trim();
        const message = !isExpanded ? `${dropdownName} submenu expanded` : `${dropdownName} submenu collapsed`;
        this.announceToScreenReader(message);
    }

    // Handle sub-submenu link clicks (third level)
    handleSubSubmenuClick(e) {
        e.preventDefault();
        const link = e.currentTarget;
        const page = link.dataset.page;

        // Remove active state from all nav items, subitems, and sub-subitems
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelectorAll('.nav-subitem').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelectorAll('.nav-subsubitem').forEach(item => {
            item.classList.remove('active');
        });

        // Add active state to clicked sub-subitem and parent dropdowns
        link.closest('.nav-subsubitem').classList.add('active');
        link.closest('.nav-subdropdown').classList.add('active').classList.add('expanded');
        link.closest('.nav-dropdown').classList.add('expanded');

        // Get consistent titles from sidebar text
        const subSubTitle = link.querySelector('.nav-subsubtext').textContent.trim();
        const subTitle = link.closest('.nav-subdropdown').querySelector('.nav-subtext').textContent.trim();
        const parentTitle = link.closest('.nav-dropdown').querySelector('.nav-text').textContent.trim();

        // Update breadcrumb with three-level hierarchical path
        this.updateThreeLevelBreadcrumb(parentTitle, subTitle, subSubTitle, page);

        // Handle page navigation
        this.navigateToPage(page);

        // Close mobile sidebar if open
        if (this.isMobile && this.sidebarMobileOpen) {
            this.toggleSidebar();
        }

        // Announce navigation for screen readers
        this.announceToScreenReader(`Navigated to ${parentTitle} > ${subTitle} > ${subSubTitle}`);
    }

    // Handle user dropdown clicks
    handleUserDropdownClick(e) {
        e.preventDefault();
        const item = e.currentTarget;
        const action = item.textContent.trim();

        // Close dropdown
        this.userDropdownMenu.classList.remove('active');
        this.userDropdownToggle.setAttribute('aria-expanded', 'false');

        // Handle different actions
        switch (action) {
            case 'Profile':
                this.showToast('Profile page coming soon!', 'info');
                break;
            case 'Settings':
                this.showToast('Settings page coming soon!', 'info');
                break;
            case 'Logout':
                this.handleLogout();
                break;
        }
    }

    // Navigate to different pages
    navigateToPage(page) {
        // Define consistent page titles for messages
        const pageConfig = {
            'administration': 'Administration',
            'master': 'Master',
            'financial': 'Financial',
            'tools': 'Tools',
            'function-groups': 'Function Groups',
            'helpdesk': 'HELPDESK',
            'parts': 'PARTS',
            'service': 'SERVICE',
            'tams': 'TAMS',
            'bay-scheduler': 'BAY SCHEDULER',
            'core': 'CORE',
            'dashboard': 'DASHBOARD',
            'kpi-report': 'KPI REPORT',
            'contract-management': 'CONTRACT MANAGEMENT',
            'digital-catalogue': 'DIGITAL CATALOGUE',
            'reman': 'REMAN',
            'special-tools': 'SPECIAL TOOLS',
            'order-management': 'ORDER MANAGEMENT',
            'field-service': 'FIELD SERVICE',
            'warranty': 'WARRANTY',
            'sales': 'SALES'
        };

        const pageTitle = pageConfig[page] || 'Unknown Page';

        switch (page) {
            case 'function-groups':
                // Already on this page
                this.showToast(`You are already on the ${pageTitle} page`, 'info');
                break;
            case 'administration':
                this.showToast(`${pageTitle} module coming soon!`, 'info');
                break;
            case 'master':
                this.showToast(`${pageTitle} data management coming soon!`, 'info');
                break;
            case 'financial':
                this.showToast(`${pageTitle} module coming soon!`, 'info');
                break;
            case 'tools':
                this.showToast(`${pageTitle} module coming soon!`, 'info');
                break;
            case 'helpdesk':
                this.showToast(`${pageTitle} module coming soon!`, 'info');
                break;
            case 'parts':
                this.showToast(`${pageTitle} module coming soon!`, 'info');
                break;
            case 'service':
                this.showToast(`${pageTitle} module coming soon!`, 'info');
                break;
            case 'tams':
                this.showToast(`${pageTitle} system coming soon!`, 'info');
                break;
            case 'bay-scheduler':
                this.showToast(`${pageTitle} system coming soon!`, 'info');
                break;
            case 'core':
                this.showToast(`${pageTitle} system coming soon!`, 'info');
                break;
            case 'dashboard':
                this.showToast(`${pageTitle} analytics coming soon!`, 'info');
                break;
            case 'kpi-report':
                this.showToast(`${pageTitle} analytics coming soon!`, 'info');
                break;
            case 'contract-management':
                this.showToast(`${pageTitle} module coming soon!`, 'info');
                break;
            case 'digital-catalogue':
                this.showToast(`${pageTitle} module coming soon!`, 'info');
                break;
            case 'reman':
                this.showToast(`${pageTitle} module coming soon!`, 'info');
                break;
            case 'special-tools':
                this.showToast(`${pageTitle} module coming soon!`, 'info');
                break;
            case 'order-management':
                this.showToast(`${pageTitle} module coming soon!`, 'info');
                break;
            case 'field-service':
                this.showToast(`${pageTitle} module coming soon!`, 'info');
                break;
            case 'warranty':
                this.showToast(`${pageTitle} module coming soon!`, 'info');
                break;
            case 'sales':
                this.showToast(`${pageTitle} module coming soon!`, 'info');
                break;
            default:
                this.showToast('Page not found', 'error');
        }
    }

    // Update breadcrumb
    updateBreadcrumb(page, title) {
        const breadcrumbActive = document.querySelector('.breadcrumb-item.active');
        if (breadcrumbActive) {
            const icon = breadcrumbActive.querySelector('i');
            const span = breadcrumbActive.querySelector('span');

            // Define consistent page titles and icons
            const pageConfig = {
                'helpdesk': {
                    title: 'HELPDESK',
                    icon: 'fas fa-headset'
                },
                'parts': {
                    title: 'PARTS',
                    icon: 'fas fa-cogs'
                },
                'service': {
                    title: 'SERVICE',
                    icon: 'fas fa-wrench'
                },
                'tams': {
                    title: 'TAMS',
                    icon: 'fas fa-clipboard-list'
                },
                'bay-scheduler': {
                    title: 'BAY SCHEDULER',
                    icon: 'fas fa-calendar-alt'
                },
                'core': {
                    title: 'CORE',
                    icon: 'fas fa-microchip'
                },
                'administration': {
                    title: 'Administration',
                    icon: 'fas fa-user-shield'
                },
                'master': {
                    title: 'Master',
                    icon: 'fas fa-database'
                },
                'financial': {
                    title: 'Financial',
                    icon: 'fas fa-chart-line'
                },
                'tools': {
                    title: 'Tools',
                    icon: 'fas fa-tools'
                },
                'function-groups': {
                    title: 'Function Groups',
                    icon: 'fas fa-layer-group'
                },
                'dashboard': {
                    title: 'DASHBOARD',
                    icon: 'fas fa-tachometer-alt'
                },
                'kpi-report': {
                    title: 'KPI REPORT',
                    icon: 'fas fa-chart-line'
                },
                'contract-management': {
                    title: 'CONTRACT MANAGEMENT',
                    icon: 'fas fa-file-contract'
                },
                'digital-catalogue': {
                    title: 'DIGITAL CATALOGUE',
                    icon: 'fas fa-book-open'
                },
                'reman': {
                    title: 'REMAN',
                    icon: 'fas fa-recycle'
                },
                'special-tools': {
                    title: 'SPECIAL TOOLS',
                    icon: 'fas fa-tools'
                },
                'order-management': {
                    title: 'ORDER MANAGEMENT',
                    icon: 'fas fa-shopping-cart'
                },
                'field-service': {
                    title: 'FIELD SERVICE',
                    icon: 'fas fa-truck'
                },
                'warranty': {
                    title: 'WARRANTY',
                    icon: 'fas fa-shield-alt'
                },
                'sales': {
                    title: 'SALES',
                    icon: 'fas fa-dollar-sign'
                }
            };

            const config = pageConfig[page] || pageConfig['system-configuration'];
            icon.className = config.icon;
            span.textContent = config.title;
        }
    }

    // Initialize navigation dropdown states
    initializeNavigationState() {
        // Expand CORE dropdown since Function Groups is active
        const coreDropdown = document.querySelector('.nav-dropdown');
        const coreToggle = coreDropdown?.querySelector('.nav-dropdown-toggle');

        if (coreDropdown && coreToggle) {
            coreDropdown.classList.add('expanded');
            coreToggle.setAttribute('aria-expanded', 'true');
        }

        // Expand Master sub-dropdown since Function Groups is active
        const masterSubdropdown = document.querySelector('.nav-subdropdown');
        const masterToggle = masterSubdropdown?.querySelector('.nav-subdropdown-toggle');

        if (masterSubdropdown && masterToggle) {
            masterSubdropdown.classList.add('expanded');
            masterToggle.setAttribute('aria-expanded', 'true');
        }
    }

    // Update hierarchical breadcrumb for submenu items
    updateHierarchicalBreadcrumb(parentTitle, childTitle, page) {
        const breadcrumbList = document.querySelector('.breadcrumb-list');
        if (breadcrumbList) {
            // Find the parent breadcrumb item (should be second item)
            const parentBreadcrumb = breadcrumbList.children[1];
            const activeBreadcrumb = breadcrumbList.children[2];

            if (parentBreadcrumb && activeBreadcrumb) {
                // Update parent breadcrumb
                const parentIcon = parentBreadcrumb.querySelector('i');
                const parentSpan = parentBreadcrumb.querySelector('span');
                if (parentIcon && parentSpan) {
                    parentIcon.className = 'fas fa-microchip';
                    parentSpan.textContent = parentTitle;
                }

                // Update active breadcrumb
                const activeIcon = activeBreadcrumb.querySelector('i');
                const activeSpan = activeBreadcrumb.querySelector('span');
                if (activeIcon && activeSpan) {
                    const pageConfig = {
                        'system-configuration': 'fas fa-cog',
                        'user-management': 'fas fa-users-cog',
                        'security-settings': 'fas fa-shield-alt',
                        'database-management': 'fas fa-database',
                        'api-configuration': 'fas fa-plug'
                    };

                    activeIcon.className = pageConfig[page] || 'fas fa-cog';
                    activeSpan.textContent = childTitle;
                }
            }
        }
    }

    // Update three-level breadcrumb for sub-submenu items
    updateThreeLevelBreadcrumb(parentTitle, subTitle, subSubTitle, page) {
        const breadcrumbList = document.querySelector('.breadcrumb-list');
        if (breadcrumbList) {
            // Find the breadcrumb items (should be 2nd, 3rd, and 4th items)
            const parentBreadcrumb = breadcrumbList.children[1];
            const subBreadcrumb = breadcrumbList.children[2];
            const activeBreadcrumb = breadcrumbList.children[3];

            if (parentBreadcrumb && subBreadcrumb && activeBreadcrumb) {
                // Update parent breadcrumb (CORE)
                const parentIcon = parentBreadcrumb.querySelector('i');
                const parentSpan = parentBreadcrumb.querySelector('span');
                if (parentIcon && parentSpan) {
                    parentIcon.className = 'fas fa-microchip';
                    parentSpan.textContent = parentTitle;
                }

                // Update sub breadcrumb (Master)
                const subIcon = subBreadcrumb.querySelector('i');
                const subSpan = subBreadcrumb.querySelector('span');
                if (subIcon && subSpan) {
                    subIcon.className = 'fas fa-database';
                    subSpan.textContent = subTitle;
                }

                // Update active breadcrumb (Function Groups)
                const activeIcon = activeBreadcrumb.querySelector('i');
                const activeSpan = activeBreadcrumb.querySelector('span');
                if (activeIcon && activeSpan) {
                    const pageConfig = {
                        'function-groups': 'fas fa-layer-group'
                    };

                    activeIcon.className = pageConfig[page] || 'fas fa-layer-group';
                    activeSpan.textContent = subSubTitle;
                }
            }
        }
    }

    // Handle logout
    handleLogout() {
        this.showConfirmation(
            'Confirm Logout',
            'Are you sure you want to logout?',
            () => {
                this.showToast('Logout functionality coming soon!', 'info');
            }
        );
    }

    // Handle navigation outside clicks
    handleNavigationOutsideClick(e) {
        // Close user dropdown if clicking outside
        if (!e.target.closest('.user-profile')) {
            this.userDropdownMenu.classList.remove('active');
            this.userDropdownToggle.setAttribute('aria-expanded', 'false');
        }

        // Close mobile sidebar if clicking on backdrop
        if (e.target.classList.contains('sidebar-backdrop')) {
            this.toggleSidebar();
        }
    }

    // Handle window resize
    handleNavigationResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 768;

        if (wasMobile !== this.isMobile) {
            // Mobile state changed
            if (this.isMobile) {
                // Switched to mobile
                this.sidebar.classList.remove('collapsed');
                this.mainLayout.classList.remove('sidebar-collapsed');
                this.sidebarCollapsed = false;
                this.createMobileBackdrop();
            } else {
                // Switched to desktop
                this.sidebar.classList.remove('mobile-open');
                this.sidebarMobileOpen = false;
                this.removeMobileBackdrop();
            }

            this.updateNavigationState();
        }
    }

    // Update navigation state
    updateNavigationState() {
        if (this.isMobile) {
            this.sidebar.classList.toggle('mobile-open', this.sidebarMobileOpen);
            this.sidebarToggle.setAttribute('aria-expanded', this.sidebarMobileOpen);
        } else {
            this.sidebar.classList.toggle('collapsed', this.sidebarCollapsed);
            this.mainLayout.classList.toggle('sidebar-collapsed', this.sidebarCollapsed);
            this.sidebarToggle.setAttribute('aria-expanded', !this.sidebarCollapsed);
        }
    }

    // Create mobile backdrop
    createMobileBackdrop() {
        if (!document.querySelector('.sidebar-backdrop')) {
            const backdrop = document.createElement('div');
            backdrop.className = 'sidebar-backdrop';
            document.body.appendChild(backdrop);
        }
    }

    // Remove mobile backdrop
    removeMobileBackdrop() {
        const backdrop = document.querySelector('.sidebar-backdrop');
        if (backdrop) {
            backdrop.remove();
        }
    }

    // Add tooltips to navigation links
    addNavigationTooltips() {
        document.querySelectorAll('.nav-link').forEach(link => {
            const text = link.querySelector('.nav-text').textContent;
            link.setAttribute('title', text);
        });
    }

    // Initialize keyboard navigation
    initializeKeyboardNavigation() {
        // Handle keyboard navigation in sidebar
        document.addEventListener('keydown', (e) => {
            if (e.target.closest('.sidebar')) {
                this.handleSidebarKeyboard(e);
            }
        });
    }

    // Handle sidebar keyboard navigation
    handleSidebarKeyboard(e) {
        const navLinks = Array.from(document.querySelectorAll('.nav-link'));
        const currentIndex = navLinks.findIndex(link => link === document.activeElement);

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % navLinks.length;
                navLinks[nextIndex].focus();
                break;
            case 'ArrowUp':
                e.preventDefault();
                const prevIndex = currentIndex === 0 ? navLinks.length - 1 : currentIndex - 1;
                navLinks[prevIndex].focus();
                break;
            case 'Home':
                e.preventDefault();
                navLinks[0].focus();
                break;
            case 'End':
                e.preventDefault();
                navLinks[navLinks.length - 1].focus();
                break;
            case 'Enter':
            case ' ':
                if (document.activeElement.classList.contains('nav-link')) {
                    e.preventDefault();
                    document.activeElement.click();
                }
                break;
        }
    }

    // Announce to screen reader
    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;

        document.body.appendChild(announcement);

        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Use setTimeout to ensure all DOM elements are fully rendered
    setTimeout(() => {
        window.functionGroupManager = new FunctionGroupManager();
    }, 0);
});
