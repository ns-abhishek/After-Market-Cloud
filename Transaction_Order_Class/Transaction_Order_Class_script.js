// Modern JavaScript for Transaction Order Class UI

class TransactionOrderClass {
    constructor() {
        this.data = [
            { id: 1, orderClass: 'Job Card', object: 'Parts Order', status: 'active' },
            { id: 2, orderClass: 'JC', object: 'Service Job Card', status: 'inactive' },
            { id: 3, orderClass: 'Parts Order', object: 'Purchase Order', status: 'active' },
            { id: 4, orderClass: 'Sales Invoice', object: 'Customer Invoice', status: 'active' },
            { id: 5, orderClass: 'Purchase GRN', object: 'Goods Receipt Note', status: 'inactive' },
            { id: 6, orderClass: 'Credit Note', object: 'Customer Credit', status: 'active' },
            { id: 7, orderClass: 'Debit Note', object: 'Customer Debit', status: 'active' },
            { id: 8, orderClass: 'Quotation', object: 'Sales Quotation', status: 'active' },
            { id: 9, orderClass: 'Work Order', object: 'Service Work Order', status: 'inactive' },
            { id: 10, orderClass: 'Delivery Note', object: 'Goods Delivery', status: 'active' },
            { id: 11, orderClass: 'Return Order', object: 'Customer Return', status: 'active' },
            { id: 12, orderClass: 'Payment Voucher', object: 'Payment Receipt', status: 'inactive' },
            { id: 13, orderClass: 'Receipt Voucher', object: 'Cash Receipt', status: 'active' },
            { id: 14, orderClass: 'Journal Entry', object: 'Accounting Entry', status: 'active' },
            { id: 15, orderClass: 'Inventory Adjustment', object: 'Stock Adjustment', status: 'inactive' },
            { id: 16, orderClass: 'Stock Transfer', object: 'Warehouse Transfer', status: 'active' },
            { id: 17, orderClass: 'Service Contract', object: 'Maintenance Contract', status: 'active' },
            { id: 18, orderClass: 'Warranty Claim', object: 'Product Warranty', status: 'inactive' },
            { id: 19, orderClass: 'Credit Memo', object: 'Credit Adjustment', status: 'active' },
            { id: 20, orderClass: 'Debit Memo', object: 'Debit Adjustment', status: 'active' },
            { id: 21, orderClass: 'Purchase Request', object: 'Material Request', status: 'inactive' },
            { id: 22, orderClass: 'Sales Order', object: 'Customer Order', status: 'active' },
            { id: 23, orderClass: 'Production Order', object: 'Manufacturing Order', status: 'active' },
            { id: 24, orderClass: 'Quality Check', object: 'Quality Inspection', status: 'inactive' },
            { id: 25, orderClass: 'Maintenance Request', object: 'Equipment Maintenance', status: 'active' }
        ];
        this.filteredData = [...this.data];
        this.selectedRows = new Set();
        this.currentPage = 1;
        this.rowsPerPage = 7; // Fixed to 8 rows per page
        this.sortColumn = null;
        this.sortDirection = 'asc';
        this.searchTerm = '';
        this.currentFilter = '';
        this.selectedObjectValue = '';
        this.currentView = 'grid'; // 'grid' or 'card'

        this.init();
        // Initialize all custom selects after DOM is fully ready
        this.waitForDOMReady(() => {
            this.initAllCustomSelects();
        });
    }

    waitForDOMReady(callback) {
        let attempts = 0;
        const maxAttempts = 100; // Maximum 5 seconds (100 * 50ms)

        // Check if all required elements exist
        const checkElements = () => {
            attempts++;

            const requiredElements = [
                'orderTypeTrigger',
                'orderTypeDropdown',
                'orderTypeOptions',
                'objectTrigger',
                'objectDropdown',
                'objectOptions'
            ];

            const allExist = requiredElements.every(id => document.getElementById(id) !== null);

            if (allExist) {
                console.log('All custom select elements found, initializing...');
                callback();
            } else if (attempts < maxAttempts) {
                // Wait a bit more and try again
                setTimeout(checkElements, 50);
            } else {
                console.warn('Timeout waiting for DOM elements, proceeding with partial initialization');
                callback();
            }
        };

        // Start checking after a small delay
        setTimeout(checkElements, 100);
    }

    calculateOptimalRowsPerPage() {
        const viewportHeight = window.innerHeight;
        const headerHeight = 120; // Approximate header height
        const filterHeight = 100; // Approximate filter section height
        const actionBarHeight = 60; // Approximate action bar height
        const tableHeaderHeight = 50; // Table header height
        const paginationHeight = 80; // Pagination height
        const rowHeight = 45; // Approximate row height
        const padding = 40; // Additional padding

        const availableHeight = viewportHeight - headerHeight - filterHeight - actionBarHeight - tableHeaderHeight - paginationHeight - padding;
        const optimalRows = Math.floor(availableHeight / rowHeight);

        // Set minimum and maximum bounds based on screen size
        if (window.innerWidth <= 768) {
            return Math.max(5, Math.min(optimalRows, 10)); // Mobile: 5-10 rows
        } else if (window.innerWidth <= 1024) {
            return Math.max(8, Math.min(optimalRows, 15)); // Tablet: 8-15 rows
        } else {
            return Math.max(10, Math.min(optimalRows, 25)); // Desktop: 10-25 rows
        }
    }

    init() {
        this.bindEvents();
        this.renderTable();
        this.updatePagination();
        this.updateActionButtons();
        this.updateSearchResults();
        this.updateSummaryCards();

        // Add fade-in animation to main elements
        document.querySelectorAll('.filter-card, .table-card').forEach(el => {
            el.classList.add('fade-in');
        });
    }

    bindEvents() {
        try {
            // Search functionality with real-time updates
            const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce((e) => {
                this.searchTerm = e.target.value;
                this.handleSearch();
            }, 200));

            // Keyboard shortcuts for search
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    e.target.value = '';
                    this.searchTerm = '';
                    this.handleSearch();
                }
            });
        }

        // Filter by order type - handled by custom select

        // Action buttons with null checks
        const addBtn = document.getElementById('addBtn');
        const deleteBtn = document.getElementById('deleteBtn');
        const saveBtn = document.getElementById('saveBtn');
        const refreshBtn = document.getElementById('refreshBtn');
        const exportBtn = document.getElementById('exportBtn');
        const advancedSearchBtn = document.getElementById('advancedSearchBtn');

        if (addBtn) addBtn.addEventListener('click', () => this.openModal());
        if (deleteBtn) deleteBtn.addEventListener('click', () => this.deleteSelected());
        if (saveBtn) saveBtn.addEventListener('click', () => this.saveData());
        if (refreshBtn) refreshBtn.addEventListener('click', () => this.refreshData());
        if (exportBtn) exportBtn.addEventListener('click', () => this.exportData());
        if (advancedSearchBtn) advancedSearchBtn.addEventListener('click', () => this.openAdvancedSearch());

        // Select all checkbox
        const selectAll = document.getElementById('selectAll');
        if (selectAll) {
            selectAll.addEventListener('change', (e) => {
                this.selectAll(e.target.checked);
            });
        }

        // Modal events with null checks
        const modalClose = document.getElementById('modalClose');
        const modalCancel = document.getElementById('modalCancel');
        const modalSave = document.getElementById('modalSave');
        const modalOverlay = document.getElementById('modalOverlay');

        if (modalClose) modalClose.addEventListener('click', () => this.closeModal());
        if (modalCancel) modalCancel.addEventListener('click', () => this.closeModal());
        if (modalSave) modalSave.addEventListener('click', () => this.saveRecord());
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === e.currentTarget) this.closeModal();
            });
        }

        // Status radio button events (no additional logic needed as radio buttons handle mutual exclusion automatically)

        // Pagination events with null checks
        const firstPageBtn = document.getElementById('firstPageBtn');
        const prevPageBtn = document.getElementById('prevPageBtn');
        const nextPageBtn = document.getElementById('nextPageBtn');
        const lastPageBtn = document.getElementById('lastPageBtn');

        if (firstPageBtn) firstPageBtn.addEventListener('click', () => this.goToPage(1));
        if (prevPageBtn) prevPageBtn.addEventListener('click', () => this.goToPage(this.currentPage - 1));
        if (nextPageBtn) nextPageBtn.addEventListener('click', () => this.goToPage(this.currentPage + 1));
        if (lastPageBtn) lastPageBtn.addEventListener('click', () => this.goToLastPage());

        // Rows per page - handled by custom select now

        // Sorting functionality
        document.querySelectorAll('.sortable').forEach(header => {
            header.addEventListener('click', () => {
                const column = header.dataset.sort;
                this.handleSort(column);
            });
        });

        // Enhanced keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'n':
                        e.preventDefault();
                        this.openModal();
                        break;
                    case 's':
                        e.preventDefault();
                        this.saveData();
                        break;
                    case 'f':
                        e.preventDefault();
                        if (searchInput) {
                            searchInput.focus();
                            searchInput.select();
                        }
                        break;
                }
            }
            if (e.key === 'Escape') {
                if (searchInput && searchInput.value) {
                    searchInput.value = '';
                    this.searchTerm = '';
                    this.handleSearch();
                } else {
                    this.closeModal();
                }
            }
        });

        // Summary cards click events
        const summaryCards = document.querySelectorAll('.summary-card');
        summaryCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const filter = card.dataset.filter;
                this.handleSummaryCardClick(filter);
            });
        });

        // View toggle buttons
        const viewToggleBtns = document.querySelectorAll('.view-toggle-btn');
        viewToggleBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = btn.dataset.view;
                this.switchView(view);
            });
        });

        } catch (error) {
            console.error('Error in bindEvents:', error);
        }
    }

    handleSearch() {
        const searchTerm = this.searchTerm.toLowerCase().trim();

        // Apply both search and filter
        let filteredData = [...this.data];

        // Apply filter first if there's one
        if (this.currentFilter && this.currentFilter !== '') {
            filteredData = this.applyFilter(filteredData, this.currentFilter);
        }

        // Then apply search
        if (searchTerm) {
            filteredData = filteredData.filter(item =>
                item.orderClass.toLowerCase().includes(searchTerm) ||
                item.object.toLowerCase().includes(searchTerm)
            );
        }

        this.filteredData = filteredData;
        this.currentPage = 1;
        this.renderTable();
        this.updatePagination();
        this.updateSearchResults();
        this.updateSummaryCards();
        this.clearSelection();
    }

    applyFilter(data, filterValue) {
        if (!filterValue || filterValue === '') {
            return data;
        }

        // Handle status filters from summary cards
        if (filterValue === 'active' || filterValue === 'inactive') {
            return data.filter(item => item.status === filterValue);
        }

        return data.filter(item => {
            const orderClass = item.orderClass.toLowerCase();
            const orderTypeValue = filterValue.toLowerCase();

            // Handle specific mappings for existing data
            switch (orderTypeValue) {
                case 'job-card-issue':
                case 'job-card-oem-approval':
                case 'job-card-parts-return':
                    return orderClass.includes('job') || orderClass.includes('jc');
                case 'parts-order':
                case 'parts-order-cancellation':
                case 'parts-quotation':
                    return orderClass.includes('parts') || item.object.toLowerCase().includes('parts');
                case 'service-internal-invoice':
                    return orderClass.includes('service') || item.object.toLowerCase().includes('service');
                default:
                    // For other order types, try to match with order class or object
                    return orderClass.includes(orderTypeValue.replace(/-/g, ' ')) ||
                           item.object.toLowerCase().includes(orderTypeValue.replace(/-/g, ' '));
            }
        });
    }

    updateSearchResults() {
        const searchResultsInfo = document.getElementById('searchResultsInfo');
        const searchTerm = this.searchTerm.trim();

        if (!searchResultsInfo) {
            return; // Element doesn't exist, skip update
        }

        if (searchTerm) {
            const totalResults = this.filteredData.length;
            const resultText = totalResults === 1 ? 'result' : 'results';
            searchResultsInfo.textContent = `${totalResults} ${resultText} found for "${searchTerm}"`;
            searchResultsInfo.style.display = 'block';
        } else {
            searchResultsInfo.style.display = 'none';
        }
    }

    // Summary Cards Methods
    updateSummaryCards() {
        const totalCount = this.data.length;
        const activeCount = this.data.filter(item => item.status === 'active').length;
        const inactiveCount = this.data.filter(item => item.status === 'inactive').length;

        // Update card numbers
        const totalCountEl = document.getElementById('totalCount');
        const activeCountEl = document.getElementById('activeCount');
        const inactiveCountEl = document.getElementById('inactiveCount');

        if (totalCountEl) totalCountEl.textContent = totalCount;
        if (activeCountEl) activeCountEl.textContent = activeCount;
        if (inactiveCountEl) inactiveCountEl.textContent = inactiveCount;

        // Update active states based on current filter
        this.updateSummaryCardActiveStates();
    }

    updateSummaryCardActiveStates() {
        const cards = document.querySelectorAll('.summary-card');
        cards.forEach(card => {
            card.classList.remove('active');
        });

        // Determine which card should be active based on current filter
        if (this.currentFilter === 'active') {
            document.getElementById('activeCard')?.classList.add('active');
        } else if (this.currentFilter === 'inactive') {
            document.getElementById('inactiveCard')?.classList.add('active');
        } else if (!this.currentFilter || this.currentFilter === '' || this.currentFilter === 'all') {
            document.getElementById('totalCard')?.classList.add('active');
        }
    }

    handleSummaryCardClick(filter) {
        // Clear search term when using summary card filters
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
            this.searchTerm = '';
        }

        // Set the filter based on card clicked
        if (filter === 'all') {
            this.currentFilter = '';
        } else {
            this.currentFilter = filter;
        }

        // Apply the filter
        this.handleSearch();

        // Update card active states
        this.updateSummaryCardActiveStates();

        // Show notification
        const filterText = filter === 'all' ? 'All records' :
                          filter === 'active' ? 'Active records' : 'Inactive records';
        this.showNotification(`Filtered to show: ${filterText}`, 'info');
    }

    handleFilter() {
        // Use the combined search and filter approach
        this.handleSearch();
    }

    handleSort(column) {
        // Toggle sort direction if same column, otherwise set to ascending
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }

        // Sort the filtered data
        this.filteredData.sort((a, b) => {
            let valueA = a[column];
            let valueB = b[column];

            // Convert to lowercase for case-insensitive sorting
            if (typeof valueA === 'string') valueA = valueA.toLowerCase();
            if (typeof valueB === 'string') valueB = valueB.toLowerCase();

            if (valueA < valueB) {
                return this.sortDirection === 'asc' ? -1 : 1;
            }
            if (valueA > valueB) {
                return this.sortDirection === 'asc' ? 1 : -1;
            }
            return 0;
        });

        // Update sort icons
        this.updateSortIcons();

        // Reset to first page and re-render
        this.currentPage = 1;
        this.renderTable();
        this.updatePagination();
    }

    updateSortIcons() {
        // Reset all sort icons
        document.querySelectorAll('.sort-icon').forEach(icon => {
            icon.textContent = 'unfold_more';
            icon.parentElement.classList.remove('sorted-asc', 'sorted-desc');
        });

        // Set active sort icon
        if (this.sortColumn) {
            const activeHeader = document.querySelector(`[data-sort="${this.sortColumn}"]`);
            if (activeHeader) {
                const icon = activeHeader.querySelector('.sort-icon');
                if (icon) {
                    icon.textContent = this.sortDirection === 'asc' ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
                    activeHeader.classList.add(this.sortDirection === 'asc' ? 'sorted-asc' : 'sorted-desc');
                }
            }
        }
    }

    renderTable() {
        if (this.currentView === 'grid') {
            this.renderGridView();
        } else {
            this.renderCardView();
        }
    }

    renderGridView() {
        const tbody = document.getElementById('tableBody');
        const startIndex = (this.currentPage - 1) * this.rowsPerPage;
        const endIndex = startIndex + this.rowsPerPage;
        const pageData = this.filteredData.slice(startIndex, endIndex);

        tbody.innerHTML = '';

        pageData.forEach(item => {
            const row = this.createTableRow(item);
            tbody.appendChild(row);
        });

        // Update record count
        this.updateRecordCount();

        // Add slide-up animation to new rows
        tbody.querySelectorAll('.table-row').forEach((row, index) => {
            setTimeout(() => {
                row.classList.add('slide-up');
            }, index * 50);
        });
    }

    renderCardView() {
        const cardsGrid = document.getElementById('cardsGrid');
        const startIndex = (this.currentPage - 1) * this.rowsPerPage;
        const endIndex = startIndex + this.rowsPerPage;
        const pageData = this.filteredData.slice(startIndex, endIndex);

        cardsGrid.innerHTML = '';

        pageData.forEach(item => {
            const card = this.createDataCard(item);
            cardsGrid.appendChild(card);
        });

        // Update record count
        this.updateRecordCount();

        // Add slide-up animation to new cards
        cardsGrid.querySelectorAll('.data-card').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('slide-up');
            }, index * 50);
        });
    }

    updateRecordCount() {
        const recordCount = document.querySelector('.record-count');
        const startIndex = (this.currentPage - 1) * this.rowsPerPage;
        const endIndex = startIndex + this.rowsPerPage;
        const total = this.filteredData.length;
        const start = total > 0 ? startIndex + 1 : 0;
        const end = Math.min(endIndex, total);
        recordCount.textContent = `View ${start}-${end} of ${total}`;
    }

    createTableRow(item) {
        const row = document.createElement('tr');
        row.className = 'table-row';
        row.dataset.id = item.id;

        const statusBadgeClass = item.status === 'active' ? '' : 'secondary';
        const statusText = item.status === 'active' ? 'Active' : 'Inactive';

        row.innerHTML = `
            <td class="checkbox-column">
                <label class="checkbox-wrapper">
                    <input type="checkbox" class="row-checkbox" data-id="${item.id}">
                    <span class="checkmark"></span>
                </label>
            </td>
            <td class="action-column">
                <button class="btn btn-icon edit-btn" title="Edit" data-id="${item.id}">
                    <span class="material-icons">edit</span>
                </button>
            </td>
            <td class="order-class-cell">
                <div class="cell-content">
                    <span class="cell-text">${item.orderClass}</span>
                    <span class="cell-badge ${statusBadgeClass}">${statusText}</span>
                </div>
            </td>
            <td class="object-cell">
                <div class="cell-content">
                    <span class="cell-text">${item.object}</span>
                </div>
            </td>
        `;

        // Bind events for this row
        const checkbox = row.querySelector('.row-checkbox');
        checkbox.addEventListener('change', (e) => {
            this.toggleRowSelection(item.id, e.target.checked);
        });

        const editBtn = row.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => {
            this.openModal(item);
        });

        return row;
    }

    createDataCard(item) {
        const card = document.createElement('div');
        card.className = 'data-card';
        card.dataset.id = item.id;

        const statusClass = item.status === 'active' ? 'active' : 'inactive';
        const statusIcon = item.status === 'active' ? 'check_circle' : 'cancel';
        const statusText = item.status === 'active' ? 'Active' : 'Inactive';

        card.innerHTML = `
            <div class="card-checkbox">
                <label class="checkbox-wrapper">
                    <input type="checkbox" class="card-row-checkbox" data-id="${item.id}">
                    <span class="checkmark"></span>
                </label>
            </div>
            <div class="card-header">
                <div class="card-actions">
                    <button class="btn btn-icon edit-btn" title="Edit" data-id="${item.id}">
                        <span class="material-icons">edit</span>
                    </button>
                </div>
            </div>
            <div class="card-content">
                <div class="card-title">
                    ${item.orderClass}
                    <div class="card-status ${statusClass}">
                        <span class="material-icons">${statusIcon}</span>
                        ${statusText}
                    </div>
                </div>
                <div class="card-subtitle">
                    ${item.object}
                </div>
            </div>
        `;

        // Bind events for this card
        const checkbox = card.querySelector('.card-row-checkbox');
        checkbox.addEventListener('change', (e) => {
            this.toggleRowSelection(item.id, e.target.checked);
            if (e.target.checked) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });

        const editBtn = card.querySelector('.edit-btn');
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openModal(item);
        });

        // Card click to select
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.card-checkbox') && !e.target.closest('.card-actions')) {
                checkbox.checked = !checkbox.checked;
                checkbox.dispatchEvent(new Event('change'));
            }
        });

        return card;
    }

    switchView(view) {
        if (this.currentView === view) return;

        this.currentView = view;

        // Update toggle button states
        document.querySelectorAll('.view-toggle-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');

        // Show/hide containers
        const tableContainer = document.getElementById('tableContainer');
        const cardContainer = document.getElementById('cardContainer');

        if (view === 'grid') {
            tableContainer.style.display = 'block';
            cardContainer.style.display = 'none';
        } else {
            tableContainer.style.display = 'none';
            cardContainer.style.display = 'block';
        }

        // Re-render in new view
        this.renderTable();

        // Clear and update selection state
        this.clearSelection();

        // Show notification
        const viewText = view === 'grid' ? 'Grid View' : 'Card View';
        this.showNotification(`Switched to ${viewText}`, 'info');
    }

    toggleRowSelection(id, selected) {
        if (selected) {
            this.selectedRows.add(id);
        } else {
            this.selectedRows.delete(id);
        }

        this.updateSelectAllCheckbox();
        this.updateActionButtons();
    }

    selectAll(selected) {
        const checkboxes = this.currentView === 'grid'
            ? document.querySelectorAll('.row-checkbox')
            : document.querySelectorAll('.card-row-checkbox');

        checkboxes.forEach(checkbox => {
            checkbox.checked = selected;
            const id = parseInt(checkbox.dataset.id);
            if (selected) {
                this.selectedRows.add(id);
            } else {
                this.selectedRows.delete(id);
            }

            // Update card visual state if in card view
            if (this.currentView === 'card') {
                const card = checkbox.closest('.data-card');
                if (card) {
                    if (selected) {
                        card.classList.add('selected');
                    } else {
                        card.classList.remove('selected');
                    }
                }
            }
        });

        this.updateActionButtons();
    }

    updateSelectAllCheckbox() {
        const selectAllCheckbox = document.getElementById('selectAll');
        if (!selectAllCheckbox) return;

        const checkboxSelector = this.currentView === 'grid' ? '.row-checkbox' : '.card-row-checkbox';
        const visibleRows = document.querySelectorAll(checkboxSelector).length;
        const selectedVisibleRows = document.querySelectorAll(`${checkboxSelector}:checked`).length;

        selectAllCheckbox.checked = visibleRows > 0 && selectedVisibleRows === visibleRows;
        selectAllCheckbox.indeterminate = selectedVisibleRows > 0 && selectedVisibleRows < visibleRows;
    }

    updateActionButtons() {
        const deleteBtn = document.getElementById('deleteBtn');
        if (deleteBtn) {
            deleteBtn.disabled = this.selectedRows.size === 0;
        }
    }

    clearSelection() {
        this.selectedRows.clear();

        // Clear grid view checkboxes
        document.querySelectorAll('.row-checkbox').forEach(cb => cb.checked = false);

        // Clear card view checkboxes and visual states
        document.querySelectorAll('.card-row-checkbox').forEach(cb => {
            cb.checked = false;
            const card = cb.closest('.data-card');
            if (card) {
                card.classList.remove('selected');
            }
        });

        const selectAll = document.getElementById('selectAll');
        if (selectAll) {
            selectAll.checked = false;
        }
        this.updateActionButtons();
    }

    openModal(item = null) {
        const modal = document.getElementById('modalOverlay');
        const modalTitle = document.getElementById('modalTitle');
        const form = document.getElementById('orderForm');

        if (item) {
            modalTitle.textContent = 'Edit Order Class';
            document.getElementById('orderClassInput').value = item.orderClass;

            // Set object dropdown value using custom select
            const objectValue = this.getObjectValue(item.object);
            this.setCustomSelectValue('object', objectValue);

            // Set status radio buttons
            document.getElementById('statusActive').checked = item.status === 'active';
            document.getElementById('statusInactive').checked = item.status === 'inactive';

            form.dataset.editId = item.id;
        } else {
            modalTitle.textContent = 'Add Order Class';
            form.reset();
            // Reset object dropdown
            this.setCustomSelectValue('object', '');
            // Clear radio buttons
            document.getElementById('statusActive').checked = false;
            document.getElementById('statusInactive').checked = false;
            delete form.dataset.editId;
        }

        modal.classList.add('active');
        document.getElementById('orderClassInput').focus();
    }

    setCustomSelectValue(selectId, value) {
        const trigger = document.getElementById(`${selectId}Trigger`);
        const optionsContainer = document.getElementById(`${selectId}Options`);

        if (!trigger || !optionsContainer) return;

        const options = optionsContainer.querySelectorAll('.custom-select-option');
        const targetOption = Array.from(options).find(opt => opt.dataset.value === value);

        if (targetOption) {
            // Update selected state
            options.forEach(opt => opt.classList.remove('selected'));
            targetOption.classList.add('selected');

            // Update trigger text
            trigger.querySelector('.placeholder').textContent = targetOption.textContent;

            // Store the value
            if (selectId === 'object') {
                this.selectedObjectValue = value;
            }
        }
    }

    getObjectValue(objectText) {
        // Map object text to dropdown values
        const objectMap = {
            'Parts Order': 'parts-order',
            'Service Job Card': 'service-job-card',
            'Purchase Order': 'purchase-order',
            'Customer Invoice': 'customer-invoice',
            'Goods Receipt Note': 'goods-receipt-note',
            'Customer Credit': 'customer-credit',
            'Sales Order': 'sales-order',
            'Delivery Note': 'delivery-note',
            'Quotation': 'quotation',
            'Work Order': 'work-order',
            'Service Contract': 'service-contract',
            'Warranty Claim': 'warranty-claim',
            'Return Order': 'return-order',
            'Credit Memo': 'credit-memo',
            'Debit Memo': 'debit-memo',
            'Payment Voucher': 'payment-voucher',
            'Receipt Voucher': 'receipt-voucher',
            'Journal Entry': 'journal-entry',
            'Inventory Adjustment': 'inventory-adjustment',
            'Stock Transfer': 'stock-transfer'
        };
        return objectMap[objectText] || '';
    }

    getObjectText(objectValue) {
        // Map dropdown values to display text
        const textMap = {
            'parts-order': 'Parts Order',
            'service-job-card': 'Service Job Card',
            'purchase-order': 'Purchase Order',
            'customer-invoice': 'Customer Invoice',
            'goods-receipt-note': 'Goods Receipt Note',
            'customer-credit': 'Customer Credit',
            'sales-order': 'Sales Order',
            'delivery-note': 'Delivery Note',
            'quotation': 'Quotation',
            'work-order': 'Work Order',
            'service-contract': 'Service Contract',
            'warranty-claim': 'Warranty Claim',
            'return-order': 'Return Order',
            'credit-memo': 'Credit Memo',
            'debit-memo': 'Debit Memo',
            'payment-voucher': 'Payment Voucher',
            'receipt-voucher': 'Receipt Voucher',
            'journal-entry': 'Journal Entry',
            'inventory-adjustment': 'Inventory Adjustment',
            'stock-transfer': 'Stock Transfer'
        };
        return textMap[objectValue] || objectValue;
    }

    closeModal() {
        const modal = document.getElementById('modalOverlay');
        modal.classList.remove('active');
    }

    saveRecord() {
        const form = document.getElementById('orderForm');

        const orderClass = document.getElementById('orderClassInput').value.trim();
        const objectValue = this.selectedObjectValue || '';
        const statusRadios = document.querySelectorAll('input[name="status"]:checked');

        if (!orderClass || !objectValue) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        if (statusRadios.length === 0) {
            this.showNotification('Please select a status', 'error');
            return;
        }

        // Convert object value to display text
        const object = this.getObjectText(objectValue);

        // Get selected status from radio button
        const status = statusRadios[0].value;

        let newRecordId = null;

        if (form.dataset.editId) {
            // Edit existing record
            const id = parseInt(form.dataset.editId);
            const index = this.data.findIndex(item => item.id === id);
            if (index !== -1) {
                this.data[index] = { id, orderClass, object, status };
                this.showNotification('Record updated successfully', 'success');
                newRecordId = id;
            }
        } else {
            // Add new record
            const newId = Math.max(...this.data.map(item => item.id)) + 1;
            this.data.push({ id: newId, orderClass, object, status });
            this.showNotification('Record added successfully', 'success');
            newRecordId = newId;
        }

        this.filteredData = [...this.data];

        // Navigate to the page containing the new/edited record
        if (newRecordId) {
            this.navigateToRecord(newRecordId);
        }

        this.renderTable();
        this.updatePagination();
        this.updateSummaryCards();
        this.closeModal();
    }

    deleteSelected() {
        if (this.selectedRows.size === 0) return;

        if (confirm(`Are you sure you want to delete ${this.selectedRows.size} record(s)?`)) {
            this.data = this.data.filter(item => !this.selectedRows.has(item.id));
            this.filteredData = [...this.data];
            this.clearSelection();
            this.renderTable();
            this.updatePagination();
            this.updateSummaryCards();
            this.showNotification(`${this.selectedRows.size} record(s) deleted successfully`, 'success');
        }
    }

    saveData() {
        // Simulate saving data
        this.showNotification('Data saved successfully', 'success');
    }

    refreshData() {
        // Simulate refreshing data
        const refreshBtn = document.getElementById('refreshBtn');
        refreshBtn.classList.add('loading');

        setTimeout(() => {
            refreshBtn.classList.remove('loading');
            this.renderTable();
            this.showNotification('Data refreshed', 'info');
        }, 1000);
    }

    exportData() {
        // Simple CSV export
        const headers = ['Order Class', 'Object', 'Status'];
        const csvContent = [
            headers.join(','),
            ...this.filteredData.map(item =>
                [item.orderClass, item.object, item.status].join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'transaction_order_class.csv';
        a.click();
        window.URL.revokeObjectURL(url);

        this.showNotification('Data exported successfully', 'success');
    }

    openAdvancedSearch() {
        const modal = document.getElementById('advancedSearchModal');
        modal.classList.add('active');
        this.initAdvancedSearchEvents();
        this.updateSearchPreview();
    }

    closeAdvancedSearch() {
        const modal = document.getElementById('advancedSearchModal');
        modal.classList.remove('active');
    }

    initAdvancedSearchEvents() {
        // Close button
        const closeBtn = document.getElementById('advancedSearchClose');
        const cancelBtn = document.getElementById('advancedSearchCancel');
        const clearBtn = document.getElementById('advancedSearchClear');
        const applyBtn = document.getElementById('advancedSearchApply');
        const saveSearchBtn = document.getElementById('saveSearchBtn');

        if (closeBtn) closeBtn.onclick = () => this.closeAdvancedSearch();
        if (cancelBtn) cancelBtn.onclick = () => this.closeAdvancedSearch();
        if (clearBtn) clearBtn.onclick = () => this.clearAdvancedSearch();
        if (applyBtn) applyBtn.onclick = () => this.applyAdvancedSearch();
        if (saveSearchBtn) saveSearchBtn.onclick = () => this.saveCurrentSearch();

        // Quick filter buttons
        document.querySelectorAll('.quick-filter-btn').forEach(btn => {
            btn.onclick = () => this.applyQuickFilter(btn.dataset.filter);
        });

        // Real-time preview updates
        const inputs = ['orderClassSearch', 'objectSearch', 'advStatusActive', 'advStatusInactive', 'dateFrom', 'dateTo'];
        inputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => this.updateSearchPreview());
                element.addEventListener('change', () => this.updateSearchPreview());
            }
        });

        const selects = ['orderClassOperator', 'objectOperator'];
        selects.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => this.updateSearchPreview());
            }
        });

        // Saved search actions
        document.querySelectorAll('[data-action="load"]').forEach(btn => {
            btn.onclick = () => this.loadSavedSearch(btn.closest('.saved-search-item'));
        });

        document.querySelectorAll('[data-action="delete"]').forEach(btn => {
            btn.onclick = () => this.deleteSavedSearch(btn.closest('.saved-search-item'));
        });
    }

    updateSearchPreview() {
        const criteria = this.getAdvancedSearchCriteria();
        const filteredData = this.applyAdvancedSearchCriteria(criteria);

        const previewElement = document.getElementById('searchPreviewCount');
        if (previewElement) {
            const count = filteredData.length;
            const resultText = count === 1 ? 'result' : 'results';
            previewElement.textContent = `${count} ${resultText} found`;
        }
    }

    getAdvancedSearchCriteria() {
        return {
            orderClass: {
                operator: document.getElementById('orderClassOperator')?.value || 'contains',
                value: document.getElementById('orderClassSearch')?.value || ''
            },
            object: {
                operator: document.getElementById('objectOperator')?.value || 'contains',
                value: document.getElementById('objectSearch')?.value || ''
            },
            status: {
                active: document.getElementById('advStatusActive')?.checked || false,
                inactive: document.getElementById('advStatusInactive')?.checked || false
            },
            dateRange: {
                from: document.getElementById('dateFrom')?.value || '',
                to: document.getElementById('dateTo')?.value || ''
            }
        };
    }

    applyAdvancedSearchCriteria(criteria) {
        let filteredData = [...this.data];

        // Apply order class filter
        if (criteria.orderClass.value.trim()) {
            filteredData = filteredData.filter(item => {
                return this.matchesTextCriteria(item.orderClass, criteria.orderClass);
            });
        }

        // Apply object filter
        if (criteria.object.value.trim()) {
            filteredData = filteredData.filter(item => {
                return this.matchesTextCriteria(item.object, criteria.object);
            });
        }

        // Apply status filter
        if (!criteria.status.active || !criteria.status.inactive) {
            filteredData = filteredData.filter(item => {
                if (criteria.status.active && item.status === 'active') return true;
                if (criteria.status.inactive && item.status === 'inactive') return true;
                return false;
            });
        }

        // Apply date range filter (future enhancement)
        // This would require adding date fields to the data structure

        return filteredData;
    }

    matchesTextCriteria(text, criteria) {
        const value = text.toLowerCase();
        const searchValue = criteria.value.toLowerCase();

        switch (criteria.operator) {
            case 'equals':
                return value === searchValue;
            case 'starts':
                return value.startsWith(searchValue);
            case 'ends':
                return value.endsWith(searchValue);
            case 'not_contains':
                return !value.includes(searchValue);
            case 'contains':
            default:
                return value.includes(searchValue);
        }
    }

    clearAdvancedSearch() {
        // Clear all form fields
        document.getElementById('orderClassSearch').value = '';
        document.getElementById('objectSearch').value = '';
        document.getElementById('orderClassOperator').value = 'contains';
        document.getElementById('objectOperator').value = 'contains';
        document.getElementById('advStatusActive').checked = true;
        document.getElementById('advStatusInactive').checked = true;
        document.getElementById('dateFrom').value = '';
        document.getElementById('dateTo').value = '';

        // Clear quick filter selections
        document.querySelectorAll('.quick-filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        this.updateSearchPreview();
    }

    applyAdvancedSearch() {
        const criteria = this.getAdvancedSearchCriteria();
        this.filteredData = this.applyAdvancedSearchCriteria(criteria);
        this.currentPage = 1;
        this.renderTable();
        this.updatePagination();
        this.clearSelection();
        this.closeAdvancedSearch();

        // Update basic search field to show applied filters
        this.updateBasicSearchFromAdvanced(criteria);

        this.showNotification('Advanced search applied successfully', 'success');
    }

    updateBasicSearchFromAdvanced(criteria) {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            let searchTerms = [];
            if (criteria.orderClass.value) searchTerms.push(criteria.orderClass.value);
            if (criteria.object.value) searchTerms.push(criteria.object.value);
            searchInput.value = searchTerms.join(' ');
        }
    }

    applyQuickFilter(filterType) {
        // Toggle active state
        const btn = document.querySelector(`[data-filter="${filterType}"]`);
        const isActive = btn.classList.contains('active');

        // Clear all quick filter selections
        document.querySelectorAll('.quick-filter-btn').forEach(b => b.classList.remove('active'));

        if (!isActive) {
            btn.classList.add('active');

            // Apply the quick filter
            switch (filterType) {
                case 'active':
                    document.getElementById('advStatusActive').checked = true;
                    document.getElementById('advStatusInactive').checked = false;
                    break;
                case 'inactive':
                    document.getElementById('advStatusActive').checked = false;
                    document.getElementById('advStatusInactive').checked = true;
                    break;
                case 'job-card':
                    document.getElementById('objectSearch').value = 'Job Card';
                    document.getElementById('objectOperator').value = 'contains';
                    break;
                case 'orders':
                    document.getElementById('objectSearch').value = 'Order';
                    document.getElementById('objectOperator').value = 'contains';
                    break;
                case 'invoices':
                    document.getElementById('objectSearch').value = 'Invoice';
                    document.getElementById('objectOperator').value = 'contains';
                    break;
                case 'recent':
                    // Set date range for last 30 days
                    const today = new Date();
                    const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
                    document.getElementById('dateFrom').value = thirtyDaysAgo.toISOString().split('T')[0];
                    document.getElementById('dateTo').value = today.toISOString().split('T')[0];
                    break;
            }
        } else {
            // Clear the filter
            this.clearAdvancedSearch();
        }

        this.updateSearchPreview();
    }

    saveCurrentSearch() {
        const criteria = this.getAdvancedSearchCriteria();
        const searchName = prompt('Enter a name for this search:');

        if (searchName && searchName.trim()) {
            // Save to localStorage (in a real app, this would be saved to a database)
            const savedSearches = JSON.parse(localStorage.getItem('savedSearches') || '[]');
            savedSearches.push({
                name: searchName.trim(),
                criteria: criteria,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('savedSearches', JSON.stringify(savedSearches));

            this.showNotification('Search saved successfully', 'success');
            this.refreshSavedSearches();
        }
    }

    loadSavedSearch(searchItem) {
        const searchName = searchItem.querySelector('.saved-search-name').textContent;
        const savedSearches = JSON.parse(localStorage.getItem('savedSearches') || '[]');
        const search = savedSearches.find(s => s.name === searchName);

        if (search) {
            const criteria = search.criteria;

            // Load criteria into form
            document.getElementById('orderClassSearch').value = criteria.orderClass.value;
            document.getElementById('orderClassOperator').value = criteria.orderClass.operator;
            document.getElementById('objectSearch').value = criteria.object.value;
            document.getElementById('objectOperator').value = criteria.object.operator;
            document.getElementById('advStatusActive').checked = criteria.status.active;
            document.getElementById('advStatusInactive').checked = criteria.status.inactive;
            document.getElementById('dateFrom').value = criteria.dateRange.from;
            document.getElementById('dateTo').value = criteria.dateRange.to;

            this.updateSearchPreview();
            this.showNotification(`Loaded search: ${searchName}`, 'info');
        }
    }

    deleteSavedSearch(searchItem) {
        const searchName = searchItem.querySelector('.saved-search-name').textContent;

        if (confirm(`Are you sure you want to delete the saved search "${searchName}"?`)) {
            const savedSearches = JSON.parse(localStorage.getItem('savedSearches') || '[]');
            const filteredSearches = savedSearches.filter(s => s.name !== searchName);
            localStorage.setItem('savedSearches', JSON.stringify(filteredSearches));

            this.showNotification('Saved search deleted', 'success');
            this.refreshSavedSearches();
        }
    }

    refreshSavedSearches() {
        // This would refresh the saved searches display
        // For now, just show a notification
        this.showNotification('Saved searches updated', 'info');
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredData.length / this.rowsPerPage);

        // Update page select options
        const pageOptionsContainer = document.getElementById('pageOptions');
        if (pageOptionsContainer) {
            pageOptionsContainer.innerHTML = '';
            for (let i = 1; i <= totalPages; i++) {
                const option = document.createElement('div');
                option.className = 'custom-select-option';
                option.dataset.value = i;
                option.textContent = i;
                if (i === this.currentPage) {
                    option.classList.add('selected');
                }
                pageOptionsContainer.appendChild(option);
            }

            // Update page trigger text
            const pageTrigger = document.getElementById('pageTrigger');
            if (pageTrigger && pageTrigger.querySelector('.placeholder')) {
                pageTrigger.querySelector('.placeholder').textContent = this.currentPage;
            }

            // Re-initialize page dropdown event listeners
            this.reinitializeDropdownOptions('page');
        }

        // Update "of X" text
        const paginationInfo = document.querySelector('.pagination-info');
        if (paginationInfo) {
            const ofSpan = paginationInfo.querySelector('span:last-child');
            if (ofSpan) {
                ofSpan.textContent = `of ${totalPages}`;
            }
        }

        // Update button states with null checks
        const firstPageBtn = document.getElementById('firstPageBtn');
        const prevPageBtn = document.getElementById('prevPageBtn');
        const nextPageBtn = document.getElementById('nextPageBtn');
        const lastPageBtn = document.getElementById('lastPageBtn');

        if (firstPageBtn) firstPageBtn.disabled = this.currentPage === 1;
        if (prevPageBtn) prevPageBtn.disabled = this.currentPage === 1;
        if (nextPageBtn) nextPageBtn.disabled = this.currentPage === totalPages || totalPages === 0;
        if (lastPageBtn) lastPageBtn.disabled = this.currentPage === totalPages || totalPages === 0;
    }

    goToPage(page) {
        const totalPages = Math.ceil(this.filteredData.length / this.rowsPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderTable();
            this.updatePagination();
            this.clearSelection();
        }
    }

    goToLastPage() {
        const totalPages = Math.ceil(this.filteredData.length / this.rowsPerPage);
        this.goToPage(totalPages);
    }

    navigateToRecord(recordId) {
        // Find the index of the record in the filtered data
        const recordIndex = this.filteredData.findIndex(item => item.id === recordId);

        if (recordIndex !== -1) {
            // Calculate which page the record is on
            const targetPage = Math.ceil((recordIndex + 1) / this.rowsPerPage);

            // Navigate to that page
            this.currentPage = targetPage;

            // After rendering, highlight the row briefly
            setTimeout(() => {
                this.highlightRecord(recordId);
            }, 100);
        }
    }

    highlightRecord(recordId) {
        // Find the row with the specific record ID and highlight it
        const row = document.querySelector(`tr[data-id="${recordId}"]`);
        if (row) {
            // Add highlight class
            row.classList.add('record-highlight');

            // Remove highlight after 2 seconds
            setTimeout(() => {
                row.classList.remove('record-highlight');
            }, 2000);

            // Scroll the row into view if needed
            row.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="material-icons">
                ${type === 'success' ? 'check_circle' :
                  type === 'error' ? 'error' :
                  type === 'warning' ? 'warning' : 'info'}
            </span>
            <span>${message}</span>
        `;

        // Add styles for notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 16px',
            borderRadius: '8px',
            backgroundColor: type === 'success' ? '#4caf50' :
                           type === 'error' ? '#f44336' :
                           type === 'warning' ? '#ff9800' : '#2196f3',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: '9999',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease-in-out'
        });

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    initAllCustomSelects() {
        // Initialize all custom selects in the application
        const customSelects = [
            {
                id: 'orderType',
                triggerId: 'orderTypeTrigger',
                dropdownId: 'orderTypeDropdown',
                searchId: 'orderTypeSearch',
                searchInputId: 'orderTypeSearchInput',
                optionsId: 'orderTypeOptions',
                onChange: (value) => {
                    this.currentFilter = value;
                    this.handleFilter();
                }
            },
            {
                id: 'object',
                triggerId: 'objectTrigger',
                dropdownId: 'objectDropdown',
                searchId: 'objectSearch',
                searchInputId: 'objectSearchInput',
                optionsId: 'objectOptions',
                onChange: (value) => {
                    this.selectedObjectValue = value;
                }
            },
            {
                id: 'page',
                triggerId: 'pageTrigger',
                dropdownId: 'pageDropdown',
                searchId: 'pageSearch',
                searchInputId: 'pageSearchInput',
                optionsId: 'pageOptions',
                onChange: (value) => {
                    this.goToPage(parseInt(value));
                }
            },

        ];

        customSelects.forEach(config => {
            try {
                this.initCustomSelect(config);
            } catch (error) {
                console.warn(`Failed to initialize custom select ${config.id}:`, error);
            }
        });
    }

    initCustomSelect(config) {
        try {
            const trigger = document.getElementById(config.triggerId);
            const dropdown = document.getElementById(config.dropdownId);
            const searchContainer = document.getElementById(config.searchId);
            const searchInput = document.getElementById(config.searchInputId);
            const optionsContainer = document.getElementById(config.optionsId);

            // Check if all required elements exist
            if (!trigger || !dropdown || !searchContainer || !searchInput || !optionsContainer) {
                console.warn(`Custom select elements not found for ${config.id}, skipping initialization`);
                return;
            }

            const options = optionsContainer.querySelectorAll('.custom-select-option');

            if (!options || options.length === 0) {
                console.warn(`No options found for ${config.id}, skipping initialization`);
                return;
            }

        let isOpen = false;
        let selectedValue = '';

        // Check if search is needed based on screen height
        const shouldShowSearch = () => {
            const viewportHeight = window.innerHeight;
            const triggerRect = trigger.getBoundingClientRect();
            const availableHeight = viewportHeight - triggerRect.bottom - 100; // 100px buffer
            const optionHeight = config.id === 'page' || config.id === 'rows' ? 32 : 44; // Smaller height for pagination
            const totalOptionsHeight = options.length * optionHeight;

            return totalOptionsHeight > availableHeight;
        };

        // Filter options based on search
        const filterOptions = (searchTerm) => {
            const term = searchTerm.toLowerCase();
            let hasVisibleOptions = false;

            options.forEach(option => {
                const text = option.textContent.toLowerCase();
                const matches = text.includes(term);
                option.style.display = matches ? 'block' : 'none';
                if (matches) hasVisibleOptions = true;
            });

            // Show/hide no results message
            let noResultsMsg = optionsContainer.querySelector('.custom-select-no-results');
            if (!hasVisibleOptions && searchTerm) {
                if (!noResultsMsg) {
                    noResultsMsg = document.createElement('div');
                    noResultsMsg.className = 'custom-select-no-results';
                    noResultsMsg.textContent = 'No results found';
                    optionsContainer.appendChild(noResultsMsg);
                }
                noResultsMsg.style.display = 'block';
            } else if (noResultsMsg) {
                noResultsMsg.style.display = 'none';
            }
        };

        // Position dropdown
        const positionDropdown = () => {
            const triggerRect = trigger.getBoundingClientRect();
            const dropdownHeight = dropdown.offsetHeight;
            const viewportHeight = window.innerHeight;
            const spaceBelow = viewportHeight - triggerRect.bottom;
            const spaceAbove = triggerRect.top;

            // Reset positioning
            dropdown.style.top = '';
            dropdown.style.bottom = '';
            dropdown.style.maxHeight = '';

            if (spaceBelow >= dropdownHeight || spaceBelow >= spaceAbove) {
                // Position below
                dropdown.style.top = '100%';
                dropdown.style.maxHeight = `${Math.min(300, spaceBelow - 10)}px`;
            } else {
                // Position above
                dropdown.style.bottom = '100%';
                dropdown.style.maxHeight = `${Math.min(300, spaceAbove - 10)}px`;
            }
        };

        // Toggle dropdown
        const toggleDropdown = () => {
            isOpen = !isOpen;
            dropdown.classList.toggle('active', isOpen);
            trigger.classList.toggle('active', isOpen);

            if (isOpen) {
                // Show search if needed
                if (shouldShowSearch()) {
                    searchContainer.style.display = 'block';
                    setTimeout(() => searchInput.focus(), 100);
                } else {
                    searchContainer.style.display = 'none';
                }

                // Position dropdown
                positionDropdown();
            }
        };

        // Close dropdown
        const closeDropdown = () => {
            if (isOpen) {
                isOpen = false;
                dropdown.classList.remove('active');
                trigger.classList.remove('active');
                searchInput.value = '';
                filterOptions('');
            }
        };

        // Select option
        const selectOption = (option) => {
            const value = option.dataset.value;
            const text = option.textContent;

            selectedValue = value;
            trigger.querySelector('.placeholder').textContent = text;

            // Update selected state
            options.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');

            // Trigger change event using config callback
            if (config.onChange) {
                config.onChange(value);
            }

            closeDropdown();
        };

        // Event listeners with null checks
        if (trigger) {
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleDropdown();
            });
        }

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                filterOptions(e.target.value);
            });

            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    closeDropdown();
                }
            });
        }

        if (options && options.length > 0) {
            options.forEach(option => {
                if (option) {
                    option.addEventListener('click', () => {
                        selectOption(option);
                    });
                }
            });
        }

        // Close on outside click
        const outsideClickHandler = (e) => {
            if (trigger && dropdown && !trigger.contains(e.target) && !dropdown.contains(e.target)) {
                closeDropdown();
            }
        };
        document.addEventListener('click', outsideClickHandler);

        // Close on escape key
        const escapeKeyHandler = (e) => {
            if (e.key === 'Escape' && isOpen) {
                closeDropdown();
            }
        };
        document.addEventListener('keydown', escapeKeyHandler);

        // Handle window resize
        const resizeHandler = () => {
            if (isOpen) {
                positionDropdown();
            }
        };
        window.addEventListener('resize', resizeHandler);

        // Store cleanup function for potential future use
        const cleanup = () => {
            document.removeEventListener('click', outsideClickHandler);
            document.removeEventListener('keydown', escapeKeyHandler);
            window.removeEventListener('resize', resizeHandler);
        };

        } catch (error) {
            console.error(`Error initializing custom select ${config.id}:`, error);
        }
    }

    reinitializeDropdownOptions(dropdownId) {
        // Re-initialize event listeners for dynamically updated options
        const optionsContainer = document.getElementById(`${dropdownId}Options`);
        if (!optionsContainer) return;

        const options = optionsContainer.querySelectorAll('.custom-select-option');
        const config = this.getDropdownConfig(dropdownId);

        if (!config) return;

        options.forEach(option => {
            if (option && !option.hasAttribute('data-listener-added')) {
                option.addEventListener('click', () => {
                    this.selectDropdownOption(dropdownId, option, config);
                });
                option.setAttribute('data-listener-added', 'true');
            }
        });
    }

    getDropdownConfig(dropdownId) {
        const configs = {
            'page': {
                onChange: (value) => {
                    this.goToPage(parseInt(value));
                }
            },

            'orderType': {
                onChange: (value) => {
                    this.currentFilter = value;
                    this.handleFilter();
                }
            },
            'object': {
                onChange: (value) => {
                    this.selectedObjectValue = value;
                }
            }
        };
        return configs[dropdownId];
    }

    selectDropdownOption(dropdownId, option, config) {
        const value = option.dataset.value;
        const text = option.textContent;

        // Update trigger text
        const trigger = document.getElementById(`${dropdownId}Trigger`);
        if (trigger && trigger.querySelector('.placeholder')) {
            trigger.querySelector('.placeholder').textContent = text;
        }

        // Update selected state
        const optionsContainer = document.getElementById(`${dropdownId}Options`);
        if (optionsContainer) {
            const allOptions = optionsContainer.querySelectorAll('.custom-select-option');
            allOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
        }

        // Close dropdown
        const dropdown = document.getElementById(`${dropdownId}Dropdown`);
        if (dropdown) {
            dropdown.classList.remove('active');
        }

        // Trigger change event
        if (config && config.onChange) {
            config.onChange(value);
        }
    }

    debounce(func, wait) {
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
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add a small delay to ensure all elements are rendered
    setTimeout(() => {
        try {
            new TransactionOrderClass();
        } catch (error) {
            console.error('Error initializing TransactionOrderClass:', error);
            // Fallback: try again after a longer delay
            setTimeout(() => {
                try {
                    new TransactionOrderClass();
                } catch (retryError) {
                    console.error('Failed to initialize after retry:', retryError);
                }
            }, 1000);
        }
    }, 200);
});

// Add some additional utility functions for enhanced UX
document.addEventListener('DOMContentLoaded', () => {
    // Add ripple effect to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});

// Drag and Drop Multi-Select Functionality
class DragDropMultiSelect {
    constructor() {
        this.selectedItems = new Set();
        this.allItems = [];
        this.filteredItems = [];
        this.init();
    }

    init() {
        this.initializeItems();
        this.setupEventListeners();
        this.updateSelectedCount();
    }

    initializeItems() {
        const availableItems = document.querySelectorAll('#availableItems .draggable-item');
        this.allItems = Array.from(availableItems).map(item => ({
            element: item,
            value: item.dataset.value,
            text: item.querySelector('.item-text').textContent
        }));
        this.filteredItems = [...this.allItems];
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('orderTypeSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterItems(e.target.value);
            });
        }

        // Toggle Select/Deselect All button
        const toggleSelectBtn = document.getElementById('toggleSelectBtn');
        if (toggleSelectBtn) {
            toggleSelectBtn.addEventListener('click', () => {
                this.toggleSelectAll();
            });
        }

        // Drag and drop events
        this.setupDragAndDrop();
    }

    setupDragAndDrop() {
        const availableItems = document.querySelectorAll('#availableItems .draggable-item');
        const selectedItemsContainer = document.getElementById('selectedItems');

        // Setup drag events for available items
        availableItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', item.dataset.value);
                item.classList.add('dragging');
            });

            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
            });

            // Double-click to select
            item.addEventListener('dblclick', () => {
                this.selectItem(item.dataset.value);
            });
        });

        // Setup drop zone
        if (selectedItemsContainer) {
            selectedItemsContainer.addEventListener('dragover', (e) => {
                e.preventDefault();
                selectedItemsContainer.classList.add('drag-over');
            });

            selectedItemsContainer.addEventListener('dragleave', (e) => {
                if (!selectedItemsContainer.contains(e.relatedTarget)) {
                    selectedItemsContainer.classList.remove('drag-over');
                }
            });

            selectedItemsContainer.addEventListener('drop', (e) => {
                e.preventDefault();
                selectedItemsContainer.classList.remove('drag-over');
                const itemValue = e.dataTransfer.getData('text/plain');
                this.selectItem(itemValue);
            });
        }

        // Setup drag events for selected items (to remove them)
        this.setupSelectedItemEvents();
    }

    setupSelectedItemEvents() {
        const selectedItemsContainer = document.getElementById('selectedItems');
        if (!selectedItemsContainer) return;

        // Use event delegation for dynamically added items
        selectedItemsContainer.addEventListener('dblclick', (e) => {
            const item = e.target.closest('.draggable-item');
            if (item) {
                this.deselectItem(item.dataset.value);
            }
        });

        selectedItemsContainer.addEventListener('dragstart', (e) => {
            const item = e.target.closest('.draggable-item');
            if (item) {
                e.dataTransfer.setData('text/plain', item.dataset.value);
                item.classList.add('dragging');
            }
        });

        selectedItemsContainer.addEventListener('dragend', (e) => {
            const item = e.target.closest('.draggable-item');
            if (item) {
                item.classList.remove('dragging');
            }
        });

        // Setup drop zone for available items (to deselect)
        const availableItemsContainer = document.getElementById('availableItems');
        if (availableItemsContainer) {
            availableItemsContainer.addEventListener('dragover', (e) => {
                e.preventDefault();
                availableItemsContainer.classList.add('drag-over');
            });

            availableItemsContainer.addEventListener('dragleave', (e) => {
                if (!availableItemsContainer.contains(e.relatedTarget)) {
                    availableItemsContainer.classList.remove('drag-over');
                }
            });

            availableItemsContainer.addEventListener('drop', (e) => {
                e.preventDefault();
                availableItemsContainer.classList.remove('drag-over');
                const itemValue = e.dataTransfer.getData('text/plain');
                this.deselectItem(itemValue);
            });
        }
    }

    filterItems(searchTerm) {
        const term = searchTerm.toLowerCase();
        const availableItems = document.querySelectorAll('#availableItems .draggable-item');

        availableItems.forEach(item => {
            const text = item.querySelector('.item-text').textContent.toLowerCase();
            const matches = text.includes(term);
            item.style.display = matches ? 'flex' : 'none';
        });

        // Update filtered items array
        this.filteredItems = this.allItems.filter(item =>
            item.text.toLowerCase().includes(term)
        );
    }

    selectItem(value) {
        this.selectItemSilent(value);
        this.updateSelectedCount();
        this.updateEmptyState();
        this.updateToggleButton();
    }

    deselectItem(value) {
        this.deselectItemSilent(value);
        this.updateSelectedCount();
        this.updateEmptyState();
        this.updateToggleButton();
    }

    addToSelectedContainer(itemData) {
        const selectedContainer = document.getElementById('selectedItems');
        if (!selectedContainer) return;

        const selectedItem = document.createElement('div');
        selectedItem.className = 'draggable-item';
        selectedItem.dataset.value = itemData.value;
        selectedItem.draggable = true;
        selectedItem.innerHTML = `
            <span class="item-text">${itemData.text}</span>
            <span class="material-icons drag-handle">drag_indicator</span>
        `;

        selectedContainer.appendChild(selectedItem);
    }

    removeFromSelectedContainer(value) {
        const selectedContainer = document.getElementById('selectedItems');
        if (!selectedContainer) return;

        const itemToRemove = selectedContainer.querySelector(`[data-value="${value}"]`);
        if (itemToRemove) {
            itemToRemove.remove();
        }
    }

    toggleSelectAll() {
        const hasAnySelectedItems = this.selectedItems.size > 0;

        if (hasAnySelectedItems) {
            // If any items are selected, deselect all
            this.deselectAll();
        } else {
            // If no items are selected, select all available items
            this.selectAll();
        }

        this.updateToggleButton();
    }

    selectAll() {
        // Select all available items (regardless of search filter)
        this.allItems.forEach(item => {
            if (!this.selectedItems.has(item.value)) {
                this.selectItemSilent(item.value);
            }
        });

        // Update UI after all selections
        this.updateSelectedCount();
        this.updateEmptyState();
        this.updateToggleButton();
    }

    deselectAll() {
        // Deselect all selected items
        const selectedValues = Array.from(this.selectedItems);
        selectedValues.forEach(value => {
            this.deselectItemSilent(value);
        });

        // Update UI after all deselections
        this.updateSelectedCount();
        this.updateEmptyState();
        this.updateToggleButton();
    }

    selectItemSilent(value) {
        // Select item without triggering UI updates
        if (this.selectedItems.has(value)) return;

        this.selectedItems.add(value);

        // Find the item data
        const itemData = this.allItems.find(item => item.value === value);
        if (!itemData) return;

        // Hide from available items
        itemData.element.style.display = 'none';

        // Add to selected items
        this.addToSelectedContainer(itemData);
    }

    deselectItemSilent(value) {
        // Deselect item without triggering UI updates
        if (!this.selectedItems.has(value)) return;

        this.selectedItems.delete(value);

        // Find the item data
        const itemData = this.allItems.find(item => item.value === value);
        if (!itemData) return;

        // Show in available items (if it matches current filter)
        const searchInput = document.getElementById('orderTypeSearchInput');
        const currentFilter = searchInput ? searchInput.value.toLowerCase() : '';
        const matchesFilter = itemData.text.toLowerCase().includes(currentFilter);

        if (matchesFilter) {
            itemData.element.style.display = 'flex';
        }

        // Remove from selected items
        this.removeFromSelectedContainer(value);
    }

    updateToggleButton() {
        const toggleBtn = document.getElementById('toggleSelectBtn');
        const toggleIcon = document.getElementById('toggleSelectIcon');

        if (!toggleBtn || !toggleIcon) return;

        const hasAnySelectedItems = this.selectedItems.size > 0;

        if (hasAnySelectedItems) {
            // Switch to deselect mode
            toggleBtn.classList.add('deselect-mode');
            toggleBtn.title = 'Deselect All';
            toggleIcon.textContent = 'deselect';
        } else {
            // Switch to select mode
            toggleBtn.classList.remove('deselect-mode');
            toggleBtn.title = 'Select All';
            toggleIcon.textContent = 'select_all';
        }
    }

    updateSelectedCount() {
        const countElement = document.getElementById('selectedCount');
        if (countElement) {
            const count = this.selectedItems.size;
            countElement.textContent = `${count} selected`;
        }
    }

    updateEmptyState() {
        const selectedContainer = document.getElementById('selectedItems');
        const emptyState = document.getElementById('emptyState');

        if (!selectedContainer || !emptyState) return;

        const hasSelectedItems = this.selectedItems.size > 0;
        emptyState.style.display = hasSelectedItems ? 'none' : 'flex';
    }

    getSelectedValues() {
        return Array.from(this.selectedItems);
    }

    setSelectedValues(values) {
        // Clear current selection
        this.deselectAll();

        // Select new values
        values.forEach(value => {
            this.selectItem(value);
        });
    }
}

// Initialize drag and drop when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for other components to initialize
    setTimeout(() => {
        try {
            window.dragDropMultiSelect = new DragDropMultiSelect();
        } catch (error) {
            console.error('Error initializing DragDropMultiSelect:', error);
        }
    }, 300);
});
