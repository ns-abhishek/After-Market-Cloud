// Main Business Management Application
class BusinessManagementApp {
    constructor() {
        this.currentModule = 'movement-type';
        this.dataManagers = {
            'movement-type': new DataManager('movement-type'),
            'movement-type-definition': new DataManager('movement-type-definition'),
            'parts-category': new DataManager('parts-category'),
            'parts-category-definition': new DataManager('parts-category-definition')
        };
        this.selectedItems = new Set();
        this.currentEditId = null;
        this.sidebarCollapsed = false;

        // Table customization settings
        this.tableSettings = {
            headerAlign: localStorage.getItem('tableHeaderAlign') || 'left',
            dataAlign: localStorage.getItem('tableDataAlign') || 'left',
            headerColor: localStorage.getItem('tableHeaderColor') || 'default',
            density: localStorage.getItem('tableDensity') || 'normal'
        };

        this.init();
    }

    // Initialize the application
    init() {
        this.bindEvents();
        this.setupTheme();
        this.loadModule(this.currentModule);
        this.setupSidebar();
    }

    // Bind all event listeners
    bindEvents() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

        // Sidebar navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const module = link.dataset.module;
                this.switchModule(module);
            });
        });

        // Sidebar toggle
        document.getElementById('sidebarToggle').addEventListener('click', () => this.toggleSidebar());
        document.getElementById('mobileSidebarToggle').addEventListener('click', () => this.toggleMobileSidebar());

        // Modal events
        document.getElementById('modalClose').addEventListener('click', () => this.hideModal());
        document.getElementById('modalCancel').addEventListener('click', () => this.hideModal());
        document.getElementById('modalSave').addEventListener('click', () => this.saveItem());
        document.getElementById('modalOverlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.hideModal();
        });

        // Customize modal events - bind only if elements exist
        const customizeModalClose = document.getElementById('customizeModalClose');
        const customizeCancel = document.getElementById('customizeCancel');
        const customizeApply = document.getElementById('customizeApply');
        const customizeReset = document.getElementById('customizeReset');
        const customizeModalOverlay = document.getElementById('customizeModalOverlay');

        if (customizeModalClose) {
            customizeModalClose.addEventListener('click', () => this.hideCustomizeModal());
        }
        if (customizeCancel) {
            customizeCancel.addEventListener('click', () => this.hideCustomizeModal());
        }
        if (customizeApply) {
            customizeApply.addEventListener('click', () => this.applyCustomization());
        }
        if (customizeReset) {
            customizeReset.addEventListener('click', () => this.resetCustomization());
        }
        if (customizeModalOverlay) {
            customizeModalOverlay.addEventListener('click', (e) => {
                if (e.target === e.currentTarget) this.hideCustomizeModal();
            });
        }

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown')) {
                document.querySelectorAll('.dropdown').forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });
    }

    // Setup theme
    setupTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }

    // Toggle theme
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeIcon(newTheme);
    }

    // Update theme icon
    updateThemeIcon(theme) {
        const icon = document.querySelector('#themeToggle i');
        const text = document.querySelector('.theme-text');
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
            if (text) text.textContent = 'Light Mode';
        } else {
            icon.className = 'fas fa-moon';
            if (text) text.textContent = 'Dark Mode';
        }
    }

    // Sidebar management
    setupSidebar() {
        // Set initial active state
        this.updateActiveNavLink();
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('collapsed');
        this.sidebarCollapsed = sidebar.classList.contains('collapsed');
        localStorage.setItem('sidebarCollapsed', this.sidebarCollapsed);
    }

    toggleMobileSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('mobile-open');
    }

    // Module management
    switchModule(module) {
        this.currentModule = module;
        this.selectedItems.clear();
        this.loadModule(module);
        this.updateActiveNavLink();
        this.updatePageTitle(module);

        // Close mobile sidebar if open
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.remove('mobile-open');
    }

    loadModule(module) {
        const contentContainer = document.getElementById('contentContainer');
        const template = document.getElementById(`${module}-template`);

        if (template) {
            contentContainer.innerHTML = template.innerHTML;
            this.bindModuleEvents();
            this.renderTable();
            this.updatePagination();
            this.applyTableCustomization();
        }
    }

    updateActiveNavLink() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.module === this.currentModule) {
                link.classList.add('active');
            }
        });
    }

    updatePageTitle(module) {
        const pageTitle = document.getElementById('pageTitle');
        const titleSpan = pageTitle.querySelector('span');
        const titleIcon = pageTitle.querySelector('i');

        const moduleConfig = {
            'movement-type': { title: 'Movement Type', icon: 'fas fa-exchange-alt' },
            'movement-type-definition': { title: 'Movement Type Definition', icon: 'fas fa-cogs' },
            'parts-category': { title: 'Parts Category', icon: 'fas fa-tags' },
            'parts-category-definition': { title: 'Parts Category Definition', icon: 'fas fa-list-alt' }
        };

        const config = moduleConfig[module];
        if (config) {
            titleSpan.textContent = config.title;
            titleIcon.className = config.icon;
        }
    }

    // Get current data manager
    getCurrentDataManager() {
        return this.dataManagers[this.currentModule];
    }

    // Bind module-specific events
    bindModuleEvents() {
        // Toolbar buttons
        document.querySelectorAll('[data-action="add"]').forEach(btn => {
            btn.addEventListener('click', () => this.showAddModal());
        });

        document.querySelectorAll('[data-action="delete"]').forEach(btn => {
            btn.addEventListener('click', () => this.deleteSelected());
        });

        document.querySelectorAll('[data-action="save"]').forEach(btn => {
            btn.addEventListener('click', () => this.saveData());
        });

        document.querySelectorAll('[data-action="refresh"]').forEach(btn => {
            btn.addEventListener('click', () => this.refreshData());
        });

        document.querySelectorAll('[data-action="advanced-search"]').forEach(btn => {
            btn.addEventListener('click', () => this.toggleAdvancedSearch());
        });

        // Advanced search filter events
        const applyFiltersBtn = document.getElementById('applyFilters');
        const clearFiltersBtn = document.getElementById('clearFilters');

        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', () => this.applyAdvancedFilters());
        }
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => this.clearAllFilters());
        }

        document.querySelectorAll('[data-action="export"]').forEach(btn => {
            btn.addEventListener('click', () => this.toggleExportMenu());
        });

        document.querySelectorAll('[data-action="customize"]').forEach(btn => {
            btn.addEventListener('click', () => this.showCustomizeModal());
        });

        // Search functionality
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        const searchClear = document.querySelector('.search-clear');
        if (searchClear) {
            searchClear.addEventListener('click', () => this.clearSearch());
        }

        // Export dropdown
        document.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', (e) => this.handleExport(e));
        });

        // Table events
        const selectAll = document.querySelector('.select-all');
        if (selectAll) {
            selectAll.addEventListener('change', (e) => this.handleSelectAll(e.target.checked));
        }

        // Pagination
        document.querySelectorAll('[data-action="first-page"]').forEach(btn => {
            btn.addEventListener('click', () => this.goToPage(1));
        });

        document.querySelectorAll('[data-action="prev-page"]').forEach(btn => {
            btn.addEventListener('click', () => this.goToPage(this.getCurrentDataManager().currentPage - 1));
        });

        document.querySelectorAll('[data-action="next-page"]').forEach(btn => {
            btn.addEventListener('click', () => this.goToPage(this.getCurrentDataManager().currentPage + 1));
        });

        document.querySelectorAll('[data-action="last-page"]').forEach(btn => {
            btn.addEventListener('click', () => this.goToLastPage());
        });

        const pageInput = document.querySelector('.pagination-input');
        if (pageInput) {
            pageInput.addEventListener('change', (e) => this.goToPage(parseInt(e.target.value)));
        }

        const pageSizeSelect = document.querySelector('.page-size-select');
        if (pageSizeSelect) {
            pageSizeSelect.addEventListener('change', (e) => this.changePageSize(parseInt(e.target.value)));
        }

        // Modal events
        const modalClose = document.getElementById('modalClose');
        const modalCancel = document.getElementById('modalCancel');
        const modalSave = document.getElementById('modalSave');
        const modalOverlay = document.getElementById('modalOverlay');

        if (modalClose) {
            modalClose.addEventListener('click', () => this.hideModal());
        }
        if (modalCancel) {
            modalCancel.addEventListener('click', () => this.hideModal());
        }
        if (modalSave) {
            modalSave.addEventListener('click', () => this.saveItem());
        }
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === e.currentTarget) this.hideModal();
            });
        }
    }

    // Render table
    renderTable() {
        const tableBody = document.querySelector('.table-body') || document.querySelector('#tableBody') || document.querySelector('tbody');
        if (!tableBody) {
            console.error('Table body not found');
            return;
        }

        const dataManager = this.getCurrentDataManager();
        const data = dataManager.getData();

        if (data.data.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
                        No data found
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = data.data.map(item => {
            const isEditing = dataManager.isEditing(item.id);
            return this.renderTableRow(item, isEditing);
        }).join('');

        // Bind row checkbox events
        document.querySelectorAll('.row-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => this.handleRowSelection(e));
        });

        // Bind sortable headers
        document.querySelectorAll('.sortable').forEach(header => {
            header.addEventListener('click', () => this.handleSort(header.dataset.column));
        });

        // Bind editable cells for double-click editing
        document.querySelectorAll('.editable-cell').forEach(cell => {
            if (!dataManager.isEditing(parseInt(cell.dataset.id))) {
                cell.addEventListener('dblclick', () => {
                    const id = parseInt(cell.dataset.id);
                    this.startInlineEdit(id);
                });
            }
        });

        this.updateDeleteButton();
    }

    // Render table row based on module type
    renderTableRow(item, isEditing) {
        const baseColumns = `
            <td class="checkbox-column">
                <div class="checkbox-wrapper">
                    <input type="checkbox" class="checkbox row-checkbox" data-id="${item.id}"
                           ${this.selectedItems.has(item.id) ? 'checked' : ''}>
                </div>
            </td>
            <td class="action-column">
                <div class="action-buttons">
                    ${isEditing ? `
                        <button class="action-btn save" onclick="window.app.saveInlineEdit(${item.id})" title="Save">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="action-btn cancel" onclick="window.app.cancelInlineEdit(${item.id})" title="Cancel">
                            <i class="fas fa-times"></i>
                        </button>
                    ` : `
                        <button class="action-btn edit" onclick="window.app.startInlineEdit(${item.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="window.app.deleteItem(${item.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    `}
                </div>
            </td>
        `;

        let dataColumns = '';

        switch (this.currentModule) {
            case 'movement-type':
            case 'parts-category':
                dataColumns = `
                    <td class="editable-cell" data-field="company" data-id="${item.id}">
                        ${isEditing ?
                            `<input type="text" class="inline-input" value="${this.escapeHtml(item.company || '')}" data-field="company">` :
                            `${this.escapeHtml(item.company || '')}<div class="edit-indicator"></div>`
                        }
                    </td>
                    <td class="editable-cell" data-field="description" data-id="${item.id}">
                        ${isEditing ?
                            `<input type="text" class="inline-input" value="${this.escapeHtml(item.description || '')}" data-field="description">` :
                            `${this.escapeHtml(item.description || '')}<div class="edit-indicator"></div>`
                        }
                    </td>
                    <td class="editable-cell text-center" data-field="isActive" data-id="${item.id}">
                        ${isEditing ?
                            `<select class="inline-select" data-field="isActive">
                                <option value="Yes" ${item.isActive === 'Yes' ? 'selected' : ''}>Yes</option>
                                <option value="No" ${item.isActive === 'No' ? 'selected' : ''}>No</option>
                            </select>` :
                            `<span class="status-badge ${item.isActive === 'Yes' ? 'active' : 'inactive'}">
                                ${item.isActive}
                            </span><div class="edit-indicator"></div>`
                        }
                    </td>
                `;
                break;

            case 'movement-type-definition':
                dataColumns = `
                    <td class="editable-cell" data-field="description" data-id="${item.id}">
                        ${isEditing ?
                            `<input type="text" class="inline-input" value="${this.escapeHtml(item.description || '')}" data-field="description">` :
                            `${this.escapeHtml(item.description || '')}<div class="edit-indicator"></div>`
                        }
                    </td>
                    <td class="editable-cell text-center" data-field="unmoved" data-id="${item.id}">
                        ${isEditing ?
                            `<input type="number" class="inline-input" value="${item.unmoved || 0}" data-field="unmoved" min="0">` :
                            `${item.unmoved || 0}<div class="edit-indicator"></div>`
                        }
                    </td>
                    <td class="editable-cell text-center" data-field="slow" data-id="${item.id}">
                        ${isEditing ?
                            `<input type="number" class="inline-input" value="${item.slow || 0}" data-field="slow" min="0">` :
                            `${item.slow || 0}<div class="edit-indicator"></div>`
                        }
                    </td>
                    <td class="editable-cell text-center" data-field="medium" data-id="${item.id}">
                        ${isEditing ?
                            `<input type="number" class="inline-input" value="${item.medium || 0}" data-field="medium" min="0">` :
                            `${item.medium || 0}<div class="edit-indicator"></div>`
                        }
                    </td>
                    <td class="editable-cell text-center" data-field="fast" data-id="${item.id}">
                        ${isEditing ?
                            `<input type="number" class="inline-input" value="${item.fast || 0}" data-field="fast" min="0">` :
                            `${item.fast || 0}<div class="edit-indicator"></div>`
                        }
                    </td>
                    <td class="editable-cell text-center" data-field="isActive" data-id="${item.id}">
                        ${isEditing ?
                            `<select class="inline-select" data-field="isActive">
                                <option value="Yes" ${item.isActive === 'Yes' ? 'selected' : ''}>Yes</option>
                                <option value="No" ${item.isActive === 'No' ? 'selected' : ''}>No</option>
                            </select>` :
                            `<span class="status-badge ${item.isActive === 'Yes' ? 'active' : 'inactive'}">
                                ${item.isActive}
                            </span><div class="edit-indicator"></div>`
                        }
                    </td>
                `;
                break;

            case 'parts-category-definition':
                dataColumns = `
                    <td class="editable-cell" data-field="partsCategory" data-id="${item.id}">
                        ${isEditing ?
                            `<input type="text" class="inline-input" value="${this.escapeHtml(item.partsCategory || '')}" data-field="partsCategory">` :
                            `${this.escapeHtml(item.partsCategory || '')}<div class="edit-indicator"></div>`
                        }
                    </td>
                    <td class="editable-cell text-right" data-field="conversionFactor" data-id="${item.id}">
                        ${isEditing ?
                            `<input type="number" class="inline-input" value="${item.conversionFactor || 0}" data-field="conversionFactor" step="0.001" min="0">` :
                            `${(item.conversionFactor || 0).toFixed(3)}<div class="edit-indicator"></div>`
                        }
                    </td>
                    <td class="editable-cell text-right" data-field="profitValue" data-id="${item.id}">
                        ${isEditing ?
                            `<input type="number" class="inline-input" value="${item.profitValue || 0}" data-field="profitValue" step="0.01" min="0">` :
                            `${(item.profitValue || 0).toFixed(2)}<div class="edit-indicator"></div>`
                        }
                    </td>
                    <td class="editable-cell text-right" data-field="netRateFactor" data-id="${item.id}">
                        ${isEditing ?
                            `<input type="number" class="inline-input" value="${item.netRateFactor || 0}" data-field="netRateFactor" step="0.001" min="0">` :
                            `${(item.netRateFactor || 0).toFixed(3)}<div class="edit-indicator"></div>`
                        }
                    </td>
                    <td class="editable-cell text-center" data-field="isActive" data-id="${item.id}">
                        ${isEditing ?
                            `<select class="inline-select" data-field="isActive">
                                <option value="Yes" ${item.isActive === 'Yes' ? 'selected' : ''}>Yes</option>
                                <option value="No" ${item.isActive === 'No' ? 'selected' : ''}>No</option>
                            </select>` :
                            `<span class="status-badge ${item.isActive === 'Yes' ? 'active' : 'inactive'}">
                                ${item.isActive}
                            </span><div class="edit-indicator"></div>`
                        }
                    </td>
                `;
                break;
        }

        return `<tr class="${isEditing ? 'editing' : ''}" data-id="${item.id}">${baseColumns}${dataColumns}</tr>`;
    }

    // Handle row selection
    handleRowSelection(e) {
        const id = parseInt(e.target.dataset.id);
        if (e.target.checked) {
            this.selectedItems.add(id);
        } else {
            this.selectedItems.delete(id);
        }
        this.updateSelectAllCheckbox();
        this.updateDeleteButton();
    }

    // Handle select all
    handleSelectAll(checked) {
        const checkboxes = document.querySelectorAll('.row-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = checked;
            const id = parseInt(checkbox.dataset.id);
            if (checked) {
                this.selectedItems.add(id);
            } else {
                this.selectedItems.delete(id);
            }
        });
        this.updateDeleteButton();
    }

    // Update select all checkbox
    updateSelectAllCheckbox() {
        const selectAllCheckbox = document.querySelector('.select-all') || document.getElementById('selectAll');
        const rowCheckboxes = document.querySelectorAll('.row-checkbox');
        const checkedCount = document.querySelectorAll('.row-checkbox:checked').length;

        if (selectAllCheckbox) {
            selectAllCheckbox.checked = checkedCount === rowCheckboxes.length && rowCheckboxes.length > 0;
            selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < rowCheckboxes.length;
        }
    }

    // Update delete button state
    updateDeleteButton() {
        const deleteBtn = document.querySelector('[data-action="delete"]');
        if (deleteBtn) {
            deleteBtn.disabled = this.selectedItems.size === 0;
        }
    }

    // Handle sorting
    handleSort(column) {
        const dataManager = this.getCurrentDataManager();
        const currentSort = dataManager.sortColumn;
        const currentDirection = dataManager.sortDirection;

        let newDirection = 'asc';
        if (currentSort === column && currentDirection === 'asc') {
            newDirection = 'desc';
        }

        dataManager.setSorting(column, newDirection);
        this.renderTable();
        this.updatePagination();
        this.updateSortIcons(column, newDirection);
    }

    // Update sort icons
    updateSortIcons(activeColumn, direction) {
        document.querySelectorAll('.sortable').forEach(header => {
            const icon = header.querySelector('.sort-icon');
            header.classList.remove('sorted');

            if (header.dataset.column === activeColumn) {
                header.classList.add('sorted');
                icon.className = direction === 'asc' ? 'fas fa-sort-up sort-icon' : 'fas fa-sort-down sort-icon';
            } else {
                icon.className = 'fas fa-sort sort-icon';
            }
        });
    }

    // Handle search
    handleSearch(searchTerm) {
        const dataManager = this.getCurrentDataManager();
        dataManager.setSearchFilter(searchTerm);
        this.renderTable();
        this.updatePagination();
        this.selectedItems.clear();
        this.updateSelectAllCheckbox();
        this.updateDeleteButton();
    }

    // Clear search
    clearSearch() {
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.value = '';
            this.handleSearch('');
        }
    }

    // Toggle advanced search
    toggleAdvancedSearch() {
        const panel = document.getElementById('advancedSearchPanel');
        if (panel) {
            panel.classList.toggle('active');
            // Populate filters when panel is opened
            if (panel.classList.contains('active')) {
                this.populateAdvancedSearchFilters();
            }
        }
    }

    // Populate advanced search filters based on current module
    populateAdvancedSearchFilters() {
        const filtersContainer = document.querySelector('.search-filters');
        if (!filtersContainer) return;

        // Clear existing filters
        filtersContainer.innerHTML = '';

        // Get table headers for current module (excluding Actions and checkbox columns)
        const headers = document.querySelectorAll('.data-table thead th.sortable');
        const dataManager = this.getCurrentDataManager();

        headers.forEach(header => {
            const column = header.dataset.column;
            const columnName = header.querySelector('.header-content span').textContent;

            if (column && columnName) {
                const filterGroup = document.createElement('div');
                filterGroup.className = 'filter-group';

                const label = document.createElement('label');
                label.setAttribute('for', `${column}Filter`);
                label.textContent = columnName;

                const select = document.createElement('select');
                select.id = `${column}Filter`;
                select.className = 'filter-select';

                // Add default option
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = `All ${columnName}`;
                select.appendChild(defaultOption);

                // Populate options based on column type
                this.populateFilterOptions(select, column, dataManager);

                filterGroup.appendChild(label);
                filterGroup.appendChild(select);
                filtersContainer.appendChild(filterGroup);
            }
        });

        // Status filter is already handled in the main loop above if isActive column exists
        // No need for separate status filter logic

        // Add search actions if they don't exist
        let actionsContainer = document.querySelector('.search-actions');
        if (!actionsContainer) {
            actionsContainer = document.createElement('div');
            actionsContainer.className = 'search-actions';
            actionsContainer.innerHTML = `
                <button class="btn btn-primary" id="applyFilters">Apply Filters</button>
                <button class="btn btn-secondary" id="clearFilters">Clear Filters</button>
            `;

            // Add event listeners to the new buttons
            const applyBtn = actionsContainer.querySelector('#applyFilters');
            const clearBtn = actionsContainer.querySelector('#clearFilters');

            if (applyBtn) {
                applyBtn.addEventListener('click', () => this.applyAdvancedFilters());
            }
            if (clearBtn) {
                clearBtn.addEventListener('click', () => this.clearAllFilters());
            }

            filtersContainer.parentNode.appendChild(actionsContainer);
        }
    }

    // Populate filter options for a specific column
    populateFilterOptions(select, column, dataManager) {
        // Special handling for isActive/status columns
        if (column === 'isActive') {
            const activeOption = document.createElement('option');
            activeOption.value = 'Yes';
            activeOption.textContent = 'Active';
            select.appendChild(activeOption);

            const inactiveOption = document.createElement('option');
            inactiveOption.value = 'No';
            inactiveOption.textContent = 'Inactive';
            select.appendChild(inactiveOption);
            return;
        }

        // Get all data from the data manager
        const allData = dataManager.getAllData();

        const uniqueValues = new Set();

        allData.forEach(item => {
            if (item[column] !== undefined && item[column] !== null && item[column] !== '') {
                // For numeric columns, group similar values
                if (typeof item[column] === 'number') {
                    if (column.includes('Factor') || column.includes('Value')) {
                        // For decimal values, round to reasonable precision
                        uniqueValues.add(Number(item[column]).toFixed(3));
                    } else {
                        uniqueValues.add(item[column].toString());
                    }
                } else {
                    uniqueValues.add(item[column].toString());
                }
            }
        });

        // Sort values and add to select
        const sortedValues = Array.from(uniqueValues).sort();
        sortedValues.forEach(value => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            select.appendChild(option);
        });
    }

    // Apply advanced filters
    applyAdvancedFilters() {
        const filters = {};

        // Collect all filter values from dynamically created filters
        const filterSelects = document.querySelectorAll('.search-filters select');
        filterSelects.forEach(select => {
            const column = select.id.replace('Filter', '');
            const value = select.value;
            if (value) {
                filters[column] = value;
            }
        });

        const dataManager = this.getCurrentDataManager();
        dataManager.setAdvancedFilters(filters);
        this.renderTable();
        this.updatePagination();
        this.selectedItems.clear();
        this.updateSelectAllCheckbox();
        this.updateDeleteButton();
        this.showToast('Filters applied successfully', 'success');
    }

    // Clear all filters
    clearAllFilters() {
        // Clear all dynamically created filter selects
        const filterSelects = document.querySelectorAll('.search-filters select');
        filterSelects.forEach(select => {
            select.value = '';
        });

        // Clear search input
        const searchInput = document.querySelector('.search-input');
        if (searchInput) searchInput.value = '';

        const dataManager = this.getCurrentDataManager();
        dataManager.clearFilters();
        this.renderTable();
        this.updatePagination();
        this.selectedItems.clear();
        this.updateSelectAllCheckbox();
        this.updateDeleteButton();
        this.showToast('Filters cleared', 'success');
    }



    // Pagination methods
    updatePagination() {
        const dataManager = this.getCurrentDataManager();
        const data = dataManager.getData();
        const paginationInfo = document.querySelector('.pagination-info-text');
        const currentPageInput = document.querySelector('.pagination-input');
        const totalPages = document.querySelector('.total-pages');

        if (!paginationInfo || !currentPageInput || !totalPages) return;

        const startItem = data.totalItems === 0 ? 0 : (data.currentPage - 1) * data.pageSize + 1;
        const endItem = Math.min(data.currentPage * data.pageSize, data.totalItems);

        paginationInfo.textContent = `View ${startItem} - ${endItem} of ${data.totalItems}`;
        currentPageInput.value = data.currentPage;
        currentPageInput.max = data.totalPages;
        totalPages.textContent = data.totalPages;

        // Update button states
        const firstPage = document.querySelector('[data-action="first-page"]');
        const prevPage = document.querySelector('[data-action="prev-page"]');
        const nextPage = document.querySelector('[data-action="next-page"]');
        const lastPage = document.querySelector('[data-action="last-page"]');

        if (firstPage) firstPage.disabled = data.currentPage === 1;
        if (prevPage) prevPage.disabled = data.currentPage === 1;
        if (nextPage) nextPage.disabled = data.currentPage === data.totalPages || data.totalPages === 0;
        if (lastPage) lastPage.disabled = data.currentPage === data.totalPages || data.totalPages === 0;
    }

    goToPage(page) {
        const dataManager = this.getCurrentDataManager();
        dataManager.setPage(page);
        this.renderTable();
        this.updatePagination();
        this.selectedItems.clear();
        this.updateSelectAllCheckbox();
        this.updateDeleteButton();
    }

    goToLastPage() {
        const dataManager = this.getCurrentDataManager();
        const data = dataManager.getData();
        this.goToPage(data.totalPages);
    }

    changePageSize(size) {
        const dataManager = this.getCurrentDataManager();
        dataManager.setPageSize(size);
        this.renderTable();
        this.updatePagination();
        this.selectedItems.clear();
        this.updateSelectAllCheckbox();
        this.updateDeleteButton();
    }

    // Utility methods
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showLoading() {
        document.getElementById('loadingOverlay').classList.add('active');
    }

    hideLoading() {
        document.getElementById('loadingOverlay').classList.remove('active');
    }

    showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        toastContainer.appendChild(toast);

        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);

        // Hide and remove toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toastContainer.removeChild(toast), 300);
        }, 3000);
    }

    // Modal methods
    showAddModal() {
        this.currentEditId = null;
        const modalTitle = document.getElementById('modalTitle');
        const form = document.getElementById('itemForm') || document.getElementById('movementForm');

        if (modalTitle) {
            modalTitle.textContent = `Add ${this.getModuleDisplayName()}`;
        }
        if (form) {
            form.reset();
        }

        // Show/hide form fields based on current module
        this.configureModalFields();
        this.showModal();
    }

    configureModalFields() {
        // Reset all fields to default visibility and remove required attributes
        const allInputs = document.querySelectorAll('#itemForm input, #itemForm select');
        allInputs.forEach(input => {
            input.removeAttribute('required');
        });

        const companyGroup = document.getElementById('companyGroup');
        const descriptionGroup = document.getElementById('descriptionGroup');
        const isActiveGroup = document.getElementById('isActiveGroup');

        // Show default fields
        if (companyGroup) companyGroup.style.display = 'block';
        if (descriptionGroup) descriptionGroup.style.display = 'block';
        if (isActiveGroup) isActiveGroup.style.display = 'block';

        // Hide all optional fields first
        const fieldsToHide = [
            'unmovedGroup', 'slowGroup', 'mediumGroup', 'fastGroup',
            'partsCategoryGroup', 'conversionFactorGroup', 'profitValueGroup', 'netRateFactorGroup'
        ];

        fieldsToHide.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) field.style.display = 'none';
        });

        // Show fields and set required attributes based on current module
        switch (this.currentModule) {
            case 'movement-type':
            case 'parts-category':
                // Show company and description fields, set as required
                const companyInput = document.getElementById('companyInput');
                const descriptionInput = document.getElementById('descriptionInput');
                const isActiveInput = document.getElementById('isActiveInput');

                if (companyInput) companyInput.setAttribute('required', 'required');
                if (descriptionInput) descriptionInput.setAttribute('required', 'required');
                if (isActiveInput) isActiveInput.setAttribute('required', 'required');
                break;

            case 'movement-type-definition':
                // Hide company field, show movement type definition fields
                if (companyGroup) companyGroup.style.display = 'none';

                ['unmovedGroup', 'slowGroup', 'mediumGroup', 'fastGroup'].forEach(fieldId => {
                    const field = document.getElementById(fieldId);
                    if (field) field.style.display = 'block';
                });

                // Set required fields for movement type definition
                const descInput = document.getElementById('descriptionInput');
                const isActiveInput2 = document.getElementById('isActiveInput');
                if (descInput) descInput.setAttribute('required', 'required');
                if (isActiveInput2) isActiveInput2.setAttribute('required', 'required');
                break;

            case 'parts-category-definition':
                // Hide company and description fields, show parts category definition fields
                if (companyGroup) companyGroup.style.display = 'none';
                if (descriptionGroup) descriptionGroup.style.display = 'none';

                ['partsCategoryGroup', 'conversionFactorGroup', 'profitValueGroup', 'netRateFactorGroup'].forEach(fieldId => {
                    const field = document.getElementById(fieldId);
                    if (field) field.style.display = 'block';
                });

                // Set required fields for parts category definition
                const partsCategoryInput = document.getElementById('partsCategory');
                const isActiveInput3 = document.getElementById('isActiveInput');
                if (partsCategoryInput) partsCategoryInput.setAttribute('required', 'required');
                if (isActiveInput3) isActiveInput3.setAttribute('required', 'required');
                break;
        }
    }

    editItem(id) {
        this.currentEditId = id;
        const dataManager = this.getCurrentDataManager();
        const item = dataManager.getItemById(id);
        if (item) {
            const modalTitle = document.getElementById('modalTitle');
            if (modalTitle) {
                modalTitle.textContent = `Edit ${this.getModuleDisplayName()}`;
            }

            // Configure modal fields and populate form
            this.configureModalFields();
            this.populateEditForm(item);
            this.showModal();
        }
    }

    populateEditForm(item) {
        // Try different possible input IDs
        const companyInput = document.getElementById('companyInput') || document.getElementById('company');
        const descriptionInput = document.getElementById('descriptionInput') || document.getElementById('description');
        const isActiveInput = document.getElementById('isActiveInput') || document.getElementById('isActive');

        if (companyInput) companyInput.value = item.company || '';
        if (descriptionInput) descriptionInput.value = item.description || '';
        if (isActiveInput) isActiveInput.value = item.isActive || 'Yes';

        // Handle module-specific fields
        if (this.currentModule === 'movement-type-definition') {
            const unmoved = document.getElementById('unmoved');
            const slow = document.getElementById('slow');
            const medium = document.getElementById('medium');
            const fast = document.getElementById('fast');

            if (unmoved) unmoved.value = item.unmoved || 0;
            if (slow) slow.value = item.slow || 0;
            if (medium) medium.value = item.medium || 0;
            if (fast) fast.value = item.fast || 0;
        } else if (this.currentModule === 'parts-category-definition') {
            const partsCategory = document.getElementById('partsCategory');
            const conversionFactor = document.getElementById('conversionFactor');
            const profitValue = document.getElementById('profitValue');
            const netRateFactor = document.getElementById('netRateFactor');

            if (partsCategory) partsCategory.value = item.partsCategory || '';
            if (conversionFactor) conversionFactor.value = item.conversionFactor || 0;
            if (profitValue) profitValue.value = item.profitValue || 0;
            if (netRateFactor) netRateFactor.value = item.netRateFactor || 0;
        }
    }

    getModuleDisplayName() {
        const moduleNames = {
            'movement-type': 'Movement Type',
            'movement-type-definition': 'Movement Type Definition',
            'parts-category': 'Parts Category',
            'parts-category-definition': 'Parts Category Definition'
        };
        return moduleNames[this.currentModule] || 'Item';
    }

    showModal() {
        document.getElementById('modalOverlay').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    hideModal() {
        document.getElementById('modalOverlay').classList.remove('active');
        document.body.style.overflow = '';
        this.currentEditId = null;
    }

    saveItem() {
        const form = document.getElementById('itemForm') || document.getElementById('movementForm');
        if (!form) {
            console.error('Form not found');
            return;
        }

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const formData = this.collectFormData();
        if (!formData) {
            this.showToast('Please fill in all required fields', 'error');
            return;
        }

        const dataManager = this.getCurrentDataManager();

        if (this.currentEditId) {
            // Update existing item
            dataManager.updateItem(this.currentEditId, formData);
            this.showToast('Item updated successfully', 'success');
        } else {
            // Add new item
            dataManager.addItem(formData);
            this.showToast('Item added successfully', 'success');
        }

        this.hideModal();
        this.renderTable();
        this.updatePagination();
    }

    collectFormData() {
        const formData = {};

        // Common fields
        const companyInput = document.getElementById('companyInput') || document.getElementById('company');
        const descriptionInput = document.getElementById('descriptionInput') || document.getElementById('description');
        const isActiveInput = document.getElementById('isActiveInput') || document.getElementById('isActive');

        if (companyInput) formData.company = companyInput.value.trim();
        if (descriptionInput) formData.description = descriptionInput.value.trim();
        if (isActiveInput) formData.isActive = isActiveInput.value;

        // Module-specific fields
        if (this.currentModule === 'movement-type-definition') {
            const unmoved = document.getElementById('unmoved');
            const slow = document.getElementById('slow');
            const medium = document.getElementById('medium');
            const fast = document.getElementById('fast');

            if (unmoved) formData.unmoved = parseInt(unmoved.value) || 0;
            if (slow) formData.slow = parseInt(slow.value) || 0;
            if (medium) formData.medium = parseInt(medium.value) || 0;
            if (fast) formData.fast = parseInt(fast.value) || 0;
        } else if (this.currentModule === 'parts-category-definition') {
            const partsCategory = document.getElementById('partsCategory');
            const conversionFactor = document.getElementById('conversionFactor');
            const profitValue = document.getElementById('profitValue');
            const netRateFactor = document.getElementById('netRateFactor');

            if (partsCategory) formData.partsCategory = partsCategory.value.trim();
            if (conversionFactor) formData.conversionFactor = parseFloat(conversionFactor.value) || 0;
            if (profitValue) formData.profitValue = parseFloat(profitValue.value) || 0;
            if (netRateFactor) formData.netRateFactor = parseFloat(netRateFactor.value) || 0;
        }

        // Validate required fields
        if (this.currentModule === 'parts-category-definition') {
            if (!formData.partsCategory) return null;
        } else {
            if (!formData.company || !formData.description) return null;
        }

        return formData;
    }

    deleteItem(id) {
        if (confirm('Are you sure you want to delete this item?')) {
            const dataManager = this.getCurrentDataManager();
            dataManager.deleteItem(id);
            this.selectedItems.delete(id);
            this.renderTable();
            this.updatePagination();
            this.updateSelectAllCheckbox();
            this.updateDeleteButton();
            this.showToast('Item deleted successfully', 'success');
        }
    }

    deleteSelected() {
        if (this.selectedItems.size === 0) return;

        const count = this.selectedItems.size;
        if (confirm(`Are you sure you want to delete ${count} selected item(s)?`)) {
            const dataManager = this.getCurrentDataManager();
            dataManager.deleteItems([...this.selectedItems]);
            this.selectedItems.clear();
            this.renderTable();
            this.updatePagination();
            this.updateSelectAllCheckbox();
            this.updateDeleteButton();
            this.showToast(`${count} item(s) deleted successfully`, 'success');
        }
    }

    saveData() {
        this.showLoading();
        // Simulate save operation
        setTimeout(() => {
            this.hideLoading();
            this.showToast('Data saved successfully', 'success');
        }, 1000);
    }

    refreshData() {
        this.showLoading();
        const dataManager = this.getCurrentDataManager();
        dataManager.refresh().then(() => {
            this.hideLoading();
            this.renderTable();
            this.updatePagination();
            this.selectedItems.clear();
            this.updateSelectAllCheckbox();
            this.updateDeleteButton();
            this.showToast('Data refreshed successfully', 'success');
        });
    }

    // Export functionality
    toggleExportMenu() {
        const dropdown = document.querySelector('.dropdown');
        dropdown.classList.toggle('active');
    }

    handleExport(e) {
        e.preventDefault();
        const format = e.target.dataset.format;
        if (format) {
            this.exportData(format);
        }
        // Close dropdown
        document.querySelector('.dropdown').classList.remove('active');
    }

    exportData(format) {
        try {
            const dataManager = this.getCurrentDataManager();
            const exportData = dataManager.exportData(format);
            this.downloadFile(exportData.content, exportData.filename, exportData.mimeType);
            this.showToast(`Data exported as ${format.toUpperCase()} successfully`, 'success');
        } catch (error) {
            this.showToast('Export failed. Please try again.', 'error');
            console.error('Export error:', error);
        }
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    // Inline editing methods
    startInlineEdit(id) {
        const dataManager = this.getCurrentDataManager();

        // Stop editing other rows
        dataManager.editingRows.forEach(editingId => {
            if (editingId !== id) {
                dataManager.stopEditing(editingId);
            }
        });

        dataManager.startEditing(id);
        this.renderTable();
        this.updatePagination();

        // Focus on the first input field and add keyboard handlers
        setTimeout(() => {
            const firstInput = document.querySelector(`tr[data-id="${id}"] .inline-input, tr[data-id="${id}"] .inline-select`);
            if (firstInput) {
                firstInput.focus();
                if (firstInput.type === 'text') {
                    firstInput.select();
                }
            }

            // Add keyboard event listeners for all inputs in the row
            const allInputs = document.querySelectorAll(`tr[data-id="${id}"] .inline-input, tr[data-id="${id}"] .inline-select`);
            allInputs.forEach(input => {
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.saveInlineEdit(id);
                    } else if (e.key === 'Escape') {
                        e.preventDefault();
                        this.cancelInlineEdit(id);
                    } else if (e.key === 'Tab') {
                        // Allow normal tab behavior for navigation between fields
                        return;
                    }
                });
            });
        }, 100);
    }

    saveInlineEdit(id) {
        const row = document.querySelector(`tr[data-id="${id}"]`);
        if (!row) return;

        const inputs = row.querySelectorAll('.inline-input, .inline-select');
        const updates = {};
        let isValid = true;

        inputs.forEach(input => {
            const field = input.dataset.field;
            const value = input.value.trim();

            if (!value && field !== 'isActive') {
                isValid = false;
                input.style.borderColor = 'var(--danger-color)';
                return;
            }

            updates[field] = value;
            input.style.borderColor = '';
        });

        if (!isValid) {
            this.showToast('Please fill in all required fields', 'error');
            return;
        }

        // Update the item
        const dataManager = this.getCurrentDataManager();
        const updatedItem = dataManager.updateItem(id, updates);
        if (updatedItem) {
            dataManager.stopEditing(id);
            this.renderTable();
            this.updatePagination();
            this.showToast('Item updated successfully', 'success');
        } else {
            this.showToast('Failed to update item', 'error');
        }
    }



    cancelInlineEdit(id) {
        const dataManager = this.getCurrentDataManager();
        dataManager.stopEditing(id);
        this.renderTable();
        this.updatePagination();
    }

    // Customize functionality
    showCustomizeModal() {
        this.populateCustomizeModal();
        this.bindCustomizeModalEvents();
        document.getElementById('customizeModalOverlay').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    hideCustomizeModal() {
        document.getElementById('customizeModalOverlay').classList.remove('active');
        document.body.style.overflow = '';
    }

    bindCustomizeModalEvents() {
        // Bind modal button events
        const customizeModalClose = document.getElementById('customizeModalClose');
        const customizeCancel = document.getElementById('customizeCancel');
        const customizeApply = document.getElementById('customizeApply');
        const customizeReset = document.getElementById('customizeReset');
        const customizeModalOverlay = document.getElementById('customizeModalOverlay');

        if (customizeModalClose) {
            customizeModalClose.onclick = () => this.hideCustomizeModal();
        }
        if (customizeCancel) {
            customizeCancel.onclick = () => this.hideCustomizeModal();
        }
        if (customizeApply) {
            customizeApply.onclick = () => this.applyCustomization();
        }
        if (customizeReset) {
            customizeReset.onclick = () => this.resetCustomization();
        }
        if (customizeModalOverlay) {
            customizeModalOverlay.onclick = (e) => {
                if (e.target === e.currentTarget) this.hideCustomizeModal();
            };
        }
    }

    populateCustomizeModal() {
        // Set header alignment
        const headerAlignRadios = document.querySelectorAll('input[name="headerAlign"]');
        headerAlignRadios.forEach(radio => {
            radio.checked = radio.value === this.tableSettings.headerAlign;
        });

        // Set data alignment
        const dataAlignRadios = document.querySelectorAll('input[name="dataAlign"]');
        dataAlignRadios.forEach(radio => {
            radio.checked = radio.value === this.tableSettings.dataAlign;
        });

        // Set density
        const densityRadios = document.querySelectorAll('input[name="density"]');
        densityRadios.forEach(radio => {
            radio.checked = radio.value === this.tableSettings.density;
        });

        // Set header color
        document.querySelectorAll('.color-option').forEach(option => {
            option.classList.remove('selected');
            if (option.dataset.color === this.tableSettings.headerColor) {
                option.classList.add('selected');
            }
        });

        // Bind color option events
        document.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
            });
        });
    }

    applyCustomization() {
        // Get selected values
        const headerAlign = document.querySelector('input[name="headerAlign"]:checked')?.value || 'left';
        const dataAlign = document.querySelector('input[name="dataAlign"]:checked')?.value || 'left';
        const density = document.querySelector('input[name="density"]:checked')?.value || 'normal';
        const headerColor = document.querySelector('.color-option.selected')?.dataset.color || 'default';

        // Update settings
        this.tableSettings = { headerAlign, dataAlign, density, headerColor };

        // Save to localStorage
        localStorage.setItem('tableHeaderAlign', headerAlign);
        localStorage.setItem('tableDataAlign', dataAlign);
        localStorage.setItem('tableDensity', density);
        localStorage.setItem('tableHeaderColor', headerColor);

        // Apply styles
        this.applyTableCustomization();

        this.hideCustomizeModal();
        this.showToast('Table customization applied successfully', 'success');
    }

    resetCustomization() {
        // Reset to defaults
        this.tableSettings = {
            headerAlign: 'left',
            dataAlign: 'left',
            headerColor: 'default',
            density: 'normal'
        };

        // Clear localStorage
        localStorage.removeItem('tableHeaderAlign');
        localStorage.removeItem('tableDataAlign');
        localStorage.removeItem('tableDensity');
        localStorage.removeItem('tableHeaderColor');

        // Apply styles
        this.applyTableCustomization();

        // Update modal
        this.populateCustomizeModal();

        this.showToast('Table customization reset to defaults', 'success');
    }

    applyTableCustomization() {
        const tableContainer = document.querySelector('.table-container');
        if (!tableContainer) return;

        // Remove existing customization classes
        tableContainer.className = tableContainer.className
            .split(' ')
            .filter(cls => !cls.startsWith('table-header-') && !cls.startsWith('table-data-') &&
                          !cls.startsWith('table-density-') && !cls.startsWith('header-theme-'))
            .join(' ');

        // Add new customization classes
        tableContainer.classList.add(`table-header-${this.tableSettings.headerAlign}`);
        tableContainer.classList.add(`table-data-${this.tableSettings.dataAlign}`);
        tableContainer.classList.add(`table-density-${this.tableSettings.density}`);
        tableContainer.classList.add(`header-theme-${this.tableSettings.headerColor}`);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new BusinessManagementApp();
});
