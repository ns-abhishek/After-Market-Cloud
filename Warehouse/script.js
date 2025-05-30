// Enhanced HCL Software Warehouse Management System
// Mock Data with enhanced features
const mockWarehouses = [
    {
        id: '1',
        name: '177N-177N',
        isDefault: true,
        isActive: true,
        isVisible: true,
        branch: 'Branch 11',
        warehouseType: 'Parts',
        location: 'Main Warehouse',
        order: 1
    },
    {
        id: '2',
        name: '177N-M801',
        isDefault: false,
        isActive: true,
        isVisible: true,
        branch: 'Branch 11',
        warehouseType: 'Parts',
        location: 'Secondary Storage',
        order: 2
    },
    {
        id: '3',
        name: '177N-M802',
        isDefault: false,
        isActive: true,
        isVisible: true,
        branch: 'Branch 11',
        warehouseType: 'Parts',
        location: 'Backup Storage',
        order: 3
    },
    {
        id: '4',
        name: '177N-M803',
        isDefault: false,
        isActive: true,
        isVisible: true,
        branch: 'Branch 11',
        warehouseType: 'Parts',
        location: 'Emergency Stock',
        order: 4
    },
    {
        id: '5',
        name: '177N-PROJ',
        isDefault: false,
        isActive: true,
        isVisible: true,
        branch: 'Branch 11',
        warehouseType: 'Parts',
        location: 'Project Storage',
        order: 5
    },
    {
        id: '6',
        name: '177N-WARR',
        isDefault: false,
        isActive: true,
        isVisible: true,
        branch: 'Branch 11',
        warehouseType: 'Parts',
        location: 'Warranty Parts',
        order: 6
    },
    {
        id: '7',
        name: 'Customer X Stock WH',
        isDefault: false,
        isActive: true,
        isVisible: true,
        branch: 'Branch 11',
        warehouseType: 'Parts',
        location: 'Customer Dedicated',
        order: 7
    },
    {
        id: '8',
        name: 'Test WH-01',
        isDefault: false,
        isActive: true,
        isVisible: true,
        branch: 'Branch 11',
        warehouseType: 'Parts',
        location: 'Testing Area',
        order: 8
    },
    {
        id: '9',
        name: 'WH401',
        isDefault: false,
        isActive: true,
        isVisible: true,
        branch: 'Branch 11',
        warehouseType: 'Parts',
        location: 'Overflow Storage',
        order: 9
    },
    {
        id: '10',
        name: 'WH401',
        isDefault: false,
        isActive: true,
        isVisible: true,
        branch: 'Branch 11',
        warehouseType: 'Parts',
        location: 'Additional Storage',
        order: 10
    }
];

// Movement Types Data
const mockMovementTypes = [
    {
        id: '1',
        code: 'IN-001',
        name: 'Goods Receipt',
        description: 'Receipt of goods from suppliers or production',
        category: 'Inbound',
        isActive: true,
        createdAt: '2024-01-01',
        icon: 'fas fa-arrow-down'
    },
    {
        id: '2',
        code: 'OUT-001',
        name: 'Goods Issue',
        description: 'Issue of goods to customers or production',
        category: 'Outbound',
        isActive: true,
        createdAt: '2024-01-01',
        icon: 'fas fa-arrow-up'
    },
    {
        id: '3',
        code: 'TRF-001',
        name: 'Stock Transfer',
        description: 'Transfer of stock between warehouses',
        category: 'Transfer',
        isActive: true,
        createdAt: '2024-01-01',
        icon: 'fas fa-exchange-alt'
    },
    {
        id: '4',
        code: 'ADJ-001',
        name: 'Stock Adjustment',
        description: 'Adjustment of stock quantities',
        category: 'Adjustment',
        isActive: true,
        createdAt: '2024-01-01',
        icon: 'fas fa-edit'
    },
    {
        id: '5',
        code: 'RET-001',
        name: 'Return',
        description: 'Return of goods from customers',
        category: 'Return',
        isActive: true,
        createdAt: '2024-01-01',
        icon: 'fas fa-undo'
    },
    {
        id: '6',
        code: 'SCR-001',
        name: 'Scrap',
        description: 'Scrapping of damaged or obsolete goods',
        category: 'Disposal',
        isActive: true,
        createdAt: '2024-01-01',
        icon: 'fas fa-trash'
    },
    {
        id: '7',
        code: 'CNT-001',
        name: 'Cycle Count',
        description: 'Periodic counting of inventory',
        category: 'Count',
        isActive: true,
        createdAt: '2024-01-01',
        icon: 'fas fa-calculator'
    },
    {
        id: '8',
        code: 'RES-001',
        name: 'Reservation',
        description: 'Reservation of stock for specific orders',
        category: 'Reservation',
        isActive: true,
        createdAt: '2024-01-01',
        icon: 'fas fa-bookmark'
    }
];

// Enhanced HCL Software WMS Application
class HCLWMSApp {
    constructor() {
        this.warehouses = [...mockWarehouses];
        this.filteredWarehouses = [...mockWarehouses];
        this.movementTypes = [...mockMovementTypes];
        this.selectedRows = new Set();
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.sortConfig = { key: 'order', direction: 'asc' };
        this.filters = {
            search: '',
            branch: 'Branch 11',
            warehouseType: 'Parts',
            parts: ''
        };
        this.dragSortable = null;
        this.currentView = 'table';
        this.userPermissions = {
            canAdd: true,
            canEdit: true,
            canDelete: true,
            canExport: true,
            canBulkEdit: true,
            isAdmin: true
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadTheme();
        this.initializeDragAndDrop();
        this.applyFiltersAndSort();
        this.renderTable();
        this.renderPagination();
        this.updateUI();
    }

    initializeDragAndDrop() {
        const tableBody = document.getElementById('tableBody');
        this.dragSortable = Sortable.create(tableBody, {
            animation: 150,
            handle: '.drag-handle',
            ghostClass: 'sortable-ghost',
            chosenClass: 'sortable-chosen',
            dragClass: 'sortable-drag',
            onEnd: (evt) => {
                this.handleDragEnd(evt);
            }
        });
    }

    setupEventListeners() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Global search
        document.getElementById('globalSearch').addEventListener('input', (e) => {
            this.performGlobalSearch(e.target.value);
        });

        // Local search
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.filters.search = e.target.value;
            this.currentPage = 1;
            this.applyFiltersAndSort();
            this.renderTable();
            this.renderPagination();
        });

        // Filter dropdowns
        document.getElementById('branchSelect').addEventListener('change', (e) => {
            this.filters.branch = e.target.value;
            this.currentPage = 1;
            this.applyFiltersAndSort();
            this.renderTable();
            this.renderPagination();
        });

        document.getElementById('warehouseTypeSelect').addEventListener('change', (e) => {
            this.filters.warehouseType = e.target.value;
            this.currentPage = 1;
            this.applyFiltersAndSort();
            this.renderTable();
            this.renderPagination();
        });

        document.getElementById('partsSelect').addEventListener('change', (e) => {
            this.filters.parts = e.target.value;
            this.currentPage = 1;
            this.applyFiltersAndSort();
            this.renderTable();
            this.renderPagination();
        });

        // Select all checkbox
        document.getElementById('selectAll').addEventListener('change', (e) => {
            this.handleSelectAll(e.target.checked);
        });

        // Items per page
        document.getElementById('itemsPerPage').addEventListener('change', (e) => {
            this.itemsPerPage = parseInt(e.target.value);
            this.currentPage = 1;
            this.renderTable();
            this.renderPagination();
        });

        // Pagination buttons
        document.getElementById('firstBtn').addEventListener('click', () => {
            this.currentPage = 1;
            this.renderTable();
            this.renderPagination();
        });

        document.getElementById('prevBtn').addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderTable();
                this.renderPagination();
            }
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            const totalPages = Math.ceil(this.filteredWarehouses.length / this.itemsPerPage);
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.renderTable();
                this.renderPagination();
            }
        });

        document.getElementById('lastBtn').addEventListener('click', () => {
            const totalPages = Math.ceil(this.filteredWarehouses.length / this.itemsPerPage);
            this.currentPage = totalPages;
            this.renderTable();
            this.renderPagination();
        });

        // Table sorting
        document.querySelectorAll('.sortable').forEach(header => {
            header.addEventListener('click', () => {
                const sortKey = header.dataset.sort;
                this.handleSort(sortKey);
            });
        });

        // Action buttons
        document.getElementById('addBtn').addEventListener('click', () => {
            this.showWarehouseModal();
        });

        document.getElementById('movementTypeBtn').addEventListener('click', () => {
            this.showMovementTypeModal();
        });

        document.getElementById('deleteSelectedBtn').addEventListener('click', () => {
            this.deleteSelected();
        });

        document.getElementById('bulkEditBtn').addEventListener('click', () => {
            this.showBulkEditModal();
        });

        document.getElementById('saveBtn').addEventListener('click', () => {
            this.saveAsPDF();
        });

        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.refreshData();
        });

        document.getElementById('advancedSearchBtn').addEventListener('click', () => {
            this.showAdvancedSearch();
        });

        // Search clear button
        document.getElementById('clearSearch').addEventListener('click', () => {
            document.getElementById('searchInput').value = '';
            this.filters.search = '';
            this.applyFiltersAndSort();
            this.renderTable();
            this.renderPagination();
        });

        // View options
        document.getElementById('tableView').addEventListener('click', () => {
            this.switchView('table');
        });

        document.getElementById('cardView').addEventListener('click', () => {
            this.switchView('card');
        });

        document.getElementById('listView').addEventListener('click', () => {
            this.switchView('list');
        });

        // Notifications
        document.getElementById('notificationsBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown('notificationsDropdown');
        });

        // User menu
        document.getElementById('userMenuBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown('userDropdown');
        });

        // Navigation function buttons
        document.getElementById('monthEndBtn').addEventListener('click', () => {
            this.showModal('monthEndModal');
        });

        document.getElementById('reportsBtn').addEventListener('click', () => {
            this.showReportsInfo();
        });

        document.getElementById('userManualBtn').addEventListener('click', () => {
            this.showModal('userManualModal');
        });

        document.getElementById('releaseInfoBtn').addEventListener('click', () => {
            this.showModal('releaseInfoModal');
        });

        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.showSettingsInfo();
        });

        document.getElementById('homeBtn').addEventListener('click', () => {
            this.showNotification('Navigating to Dashboard Home', 'info');
        });

        // Modal event listeners
        this.setupModalEventListeners();

        // Close dropdowns when clicking outside
        document.addEventListener('click', () => {
            this.closeAllDropdowns();
        });

        // Simplified sidebar functionality
        this.setupSimplifiedSidebar();

        // Breadcrumb navigation
        this.setupBreadcrumbNavigation();

        // Context menu
        document.addEventListener('click', (e) => {
            this.hideContextMenu();
        });

        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        const themeIcon = document.getElementById('themeIcon');
        themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);

        const themeIcon = document.getElementById('themeIcon');
        themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    performGlobalSearch(query) {
        // Simulate global search across the application
        if (query.trim()) {
            this.showNotification(`Global search for: "${query}"`, 'info');
        }
    }

    handleSelectAll(checked) {
        const checkboxes = document.querySelectorAll('.row-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = checked;
            const warehouseId = checkbox.dataset.id;
            if (checked) {
                this.selectedRows.add(warehouseId);
            } else {
                this.selectedRows.delete(warehouseId);
            }
        });
        this.updateUI();
    }

    handleRowSelection(warehouseId, checked) {
        if (checked) {
            this.selectedRows.add(warehouseId);
        } else {
            this.selectedRows.delete(warehouseId);
        }

        // Update select all checkbox
        const totalRows = this.filteredWarehouses.length;
        const selectedCount = this.selectedRows.size;
        const selectAllCheckbox = document.getElementById('selectAll');

        selectAllCheckbox.indeterminate = selectedCount > 0 && selectedCount < totalRows;
        selectAllCheckbox.checked = selectedCount === totalRows;

        this.updateUI();
    }

    handleDragEnd(evt) {
        const oldIndex = evt.oldIndex;
        const newIndex = evt.newIndex;

        if (oldIndex !== newIndex) {
            // Update the order in the data
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const item = this.filteredWarehouses.splice(startIndex + oldIndex, 1)[0];
            this.filteredWarehouses.splice(startIndex + newIndex, 0, item);

            // Update order values
            this.filteredWarehouses.forEach((warehouse, index) => {
                warehouse.order = index + 1;
            });

            this.showNotification('Row order updated successfully', 'success');
        }
    }

    setupSimplifiedSidebar() {
        // Dashboard item click
        const dashboardItem = document.querySelector('[data-section="dashboard"]');
        if (dashboardItem) {
            dashboardItem.addEventListener('click', () => {
                this.handleDashboardClick();
            });
        }

        // Warehouse dropdown item click
        const warehouseItem = document.querySelector('[data-section="warehouse"]');
        if (warehouseItem) {
            warehouseItem.addEventListener('click', () => {
                this.handleWarehouseDropdownClick();
            });
        }

        // Warehouse submenu items
        document.querySelectorAll('.submenu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleSubmenuClick(item);
            });
        });

        // Initialize warehouse submenu as active
        const warehouseSubmenu = document.getElementById('warehouseSubmenu');
        if (warehouseSubmenu) {
            warehouseSubmenu.classList.add('active');
        }
    }

    handleDashboardClick() {
        // Remove active class from all items
        document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
        document.querySelectorAll('.submenu-item').forEach(i => i.classList.remove('active'));

        // Add active class to dashboard
        document.querySelector('[data-section="dashboard"]').classList.add('active');

        // Hide warehouse submenu
        document.getElementById('warehouseSubmenu').classList.remove('active');

        this.showNotification('Navigated to DASHBOARD', 'info');
    }

    handleWarehouseDropdownClick() {
        const warehouseItem = document.querySelector('[data-section="warehouse"]');
        const warehouseSubmenu = document.getElementById('warehouseSubmenu');

        // Remove active from dashboard
        document.querySelector('[data-section="dashboard"]').classList.remove('active');

        // Toggle warehouse dropdown
        warehouseItem.classList.add('active');
        warehouseSubmenu.classList.toggle('active');

        if (warehouseSubmenu.classList.contains('active')) {
            this.showNotification('WAREHOUSE menu expanded', 'info');
        } else {
            this.showNotification('WAREHOUSE menu collapsed', 'info');
        }
    }

    handleSubmenuClick(item) {
        // Remove active class from all submenu items
        document.querySelectorAll('.submenu-item').forEach(i => i.classList.remove('active'));

        // Add active class to clicked submenu item
        item.classList.add('active');

        const action = item.dataset.action;
        const actionName = item.querySelector('span').textContent;

        this.showNotification(`Navigated to ${actionName}`, 'info');

        // Handle specific warehouse actions
        switch(action) {
            case 'warehouse-management':
                // Current page - no action needed
                break;
            case 'service-invoice-return':
                this.openServiceInvoiceReturn();
                break;
            case 'inventory-control':
                this.showNotification('Opening Inventory Control module...', 'info');
                break;
            case 'stock-movements':
                this.showNotification('Opening Stock Movements module...', 'info');
                break;
            case 'location-management':
                this.showNotification('Opening Location Management module...', 'info');
                break;
            case 'warehouse-reports':
                this.showNotification('Opening Warehouse Reports module...', 'info');
                break;
            case 'warehouse-settings':
                this.showNotification('Opening Warehouse Settings module...', 'info');
                break;
        }
    }

    setupBreadcrumbNavigation() {
        // Service Invoice Return breadcrumb click
        const serviceInvoiceReturnBreadcrumb = document.getElementById('serviceInvoiceReturnBreadcrumb');

        if (serviceInvoiceReturnBreadcrumb) {
            serviceInvoiceReturnBreadcrumb.addEventListener('click', (e) => {
                e.preventDefault();
                this.openServiceInvoiceReturn();
            });
        }
    }

    openServiceInvoiceReturn() {
        this.showNotification('Opening Service Invoice Return in new window...', 'info');

        // Open in new window/tab
        const newWindow = window.open(
            'service-invoice-return.html',
            'ServiceInvoiceReturn',
            'width=1400,height=900,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,status=no'
        );

        // Focus the new window
        if (newWindow) {
            newWindow.focus();
        } else {
            // Fallback if popup is blocked
            this.showNotification('Please allow popups for this site to open Service Invoice Return', 'error');
            // Try opening in same tab as fallback
            setTimeout(() => {
                window.location.href = 'service-invoice-return.html';
            }, 2000);
        }
    }

    applyFiltersAndSort() {
        // Apply filters
        this.filteredWarehouses = this.warehouses.filter(warehouse => {
            const matchesSearch = !this.filters.search ||
                warehouse.name.toLowerCase().includes(this.filters.search.toLowerCase()) ||
                (warehouse.location && warehouse.location.toLowerCase().includes(this.filters.search.toLowerCase()));

            const matchesBranch = !this.filters.branch || warehouse.branch === this.filters.branch;
            const matchesType = !this.filters.warehouseType || warehouse.warehouseType === this.filters.warehouseType;
            const matchesParts = !this.filters.parts || warehouse.warehouseType === this.filters.parts;

            return matchesSearch && matchesBranch && matchesType && matchesParts;
        });

        // Apply sorting
        this.filteredWarehouses.sort((a, b) => {
            let aValue = a[this.sortConfig.key];
            let bValue = b[this.sortConfig.key];

            // Handle boolean values
            if (typeof aValue === 'boolean') {
                aValue = aValue ? 1 : 0;
                bValue = bValue ? 1 : 0;
            }

            if (aValue < bValue) {
                return this.sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return this.sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }

    renderTable() {
        const tbody = document.getElementById('tableBody');
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageWarehouses = this.filteredWarehouses.slice(startIndex, endIndex);

        tbody.innerHTML = pageWarehouses.map(warehouse => `
            <tr class="fade-in" data-id="${warehouse.id}">
                <td class="checkbox-column">
                    <input type="checkbox" class="table-checkbox row-checkbox"
                           data-id="${warehouse.id}"
                           ${this.selectedRows.has(warehouse.id) ? 'checked' : ''}
                           onchange="app.handleRowSelection('${warehouse.id}', this.checked)">
                </td>
                <td class="drag-column">
                    <i class="fas fa-grip-vertical drag-handle"></i>
                </td>
                <td class="warehouse-name">${warehouse.name}</td>
                <td class="text-center">
                    <span class="status-${warehouse.isDefault ? 'yes' : 'no'}">
                        ${warehouse.isDefault ? 'Yes' : 'No'}
                    </span>
                </td>
                <td class="text-center">
                    <span class="status-${warehouse.isActive ? 'yes' : 'no'}">
                        ${warehouse.isActive ? 'Yes' : 'No'}
                    </span>
                </td>
                <td class="text-center">
                    <span class="status-${warehouse.isVisible ? 'yes' : 'no'}">
                        ${warehouse.isVisible ? 'Yes' : 'No'}
                    </span>
                </td>
            </tr>
        `).join('');

        this.updateSortIcons();

        // Re-initialize drag and drop for new rows
        if (this.dragSortable) {
            this.dragSortable.destroy();
            this.initializeDragAndDrop();
        }
    }

    updateSortIcons() {
        document.querySelectorAll('.sortable').forEach(header => {
            const icon = header.querySelector('.sort-icon');
            const key = header.dataset.sort;

            header.classList.remove('sorted');
            icon.className = 'fas fa-sort sort-icon';

            if (this.sortConfig.key === key) {
                header.classList.add('sorted');
                icon.className = this.sortConfig.direction === 'asc'
                    ? 'fas fa-sort-up sort-icon'
                    : 'fas fa-sort-down sort-icon';
            }
        });
    }

    handleSort(key) {
        if (this.sortConfig.key === key) {
            this.sortConfig.direction = this.sortConfig.direction === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortConfig.key = key;
            this.sortConfig.direction = 'asc';
        }

        this.applyFiltersAndSort();
        this.renderTable();
        this.updateSortIcons();
    }

    renderPagination() {
        const totalItems = this.filteredWarehouses.length;
        const totalPages = Math.ceil(totalItems / this.itemsPerPage);
        const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
        const endItem = Math.min(this.currentPage * this.itemsPerPage, totalItems);

        // Update pagination info
        document.getElementById('paginationInfo').textContent =
            `View ${startItem} - ${endItem} of ${totalItems}`;

        // Update pagination buttons
        document.getElementById('firstBtn').disabled = this.currentPage === 1;
        document.getElementById('prevBtn').disabled = this.currentPage === 1;
        document.getElementById('nextBtn').disabled = this.currentPage === totalPages || totalPages === 0;
        document.getElementById('lastBtn').disabled = this.currentPage === totalPages || totalPages === 0;
    }

    updateUI() {
        const selectedCount = this.selectedRows.size;
        const hasSelection = selectedCount > 0;

        // Update button states
        const deleteBtn = document.getElementById('deleteSelectedBtn');
        if (deleteBtn) {
            deleteBtn.disabled = !hasSelection;
        }

        // Update selection info
        if (hasSelection) {
            this.showNotification(`${selectedCount} item(s) selected`, 'info');
        }
    }

    setupModalEventListeners() {
        // Warehouse Modal
        document.getElementById('closeWarehouseModal').addEventListener('click', () => {
            this.hideModal('warehouseModal');
        });

        document.getElementById('cancelWarehouse').addEventListener('click', () => {
            this.hideModal('warehouseModal');
        });

        document.getElementById('saveWarehouse').addEventListener('click', () => {
            this.saveWarehouse();
        });

        // Movement Type Modal
        document.getElementById('closeMovementType').addEventListener('click', () => {
            this.hideModal('movementTypeModal');
        });

        document.getElementById('closeMovementTypeModal').addEventListener('click', () => {
            this.hideModal('movementTypeModal');
        });

        document.getElementById('addMovementType').addEventListener('click', () => {
            this.addMovementType();
        });

        document.getElementById('saveMovementTypes').addEventListener('click', () => {
            this.saveMovementTypes();
        });

        // Advanced Search Modal
        document.getElementById('closeAdvancedSearch').addEventListener('click', () => {
            this.hideModal('advancedSearchModal');
        });

        document.getElementById('applyAdvancedSearch').addEventListener('click', () => {
            this.applyAdvancedSearch();
        });

        document.getElementById('clearAdvancedSearch').addEventListener('click', () => {
            this.clearAdvancedSearch();
        });

        // Bulk Edit Modal
        document.getElementById('closeBulkEdit').addEventListener('click', () => {
            this.hideModal('bulkEditModal');
        });

        document.getElementById('cancelBulkEdit').addEventListener('click', () => {
            this.hideModal('bulkEditModal');
        });

        document.getElementById('applyBulkEdit').addEventListener('click', () => {
            this.applyBulkEdit();
        });

        // Month End Modal
        document.getElementById('closeMonthEnd').addEventListener('click', () => {
            this.hideModal('monthEndModal');
        });

        // User Manual Modal
        document.getElementById('closeUserManual').addEventListener('click', () => {
            this.hideModal('userManualModal');
        });

        // Release Info Modal
        document.getElementById('closeReleaseInfo').addEventListener('click', () => {
            this.hideModal('releaseInfoModal');
        });

        // Manual navigation
        document.querySelectorAll('.manual-section').forEach(section => {
            section.addEventListener('click', () => {
                this.switchManualSection(section.dataset.section);
            });
        });
    }

    // Modal Management
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    // Dropdown Management
    toggleDropdown(dropdownId) {
        const dropdown = document.getElementById(dropdownId);
        const isVisible = dropdown.classList.contains('show');

        this.closeAllDropdowns();

        if (!isVisible) {
            dropdown.classList.add('show');
        }
    }

    closeAllDropdowns() {
        document.querySelectorAll('.dropdown-menu').forEach(dropdown => {
            dropdown.classList.remove('show');
        });
    }

    // View Management
    switchView(viewType) {
        this.currentView = viewType;

        // Update view buttons
        document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`${viewType}View`).classList.add('active');

        // Re-render based on view type
        this.renderTable();
        this.showNotification(`Switched to ${viewType} view`, 'info');
    }

    // PDF Export Functionality
    async saveAsPDF() {
        try {
            this.showNotification('Generating PDF...', 'info');

            // Get jsPDF from global scope
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape orientation

            // Add title
            pdf.setFontSize(20);
            pdf.setTextColor(0, 102, 204);
            pdf.text('HCL Software - Warehouse Management Report', 20, 20);

            // Add metadata
            pdf.setFontSize(12);
            pdf.setTextColor(0, 0, 0);
            pdf.text(`Generated on: ${new Date().toLocaleString()}`, 20, 35);
            pdf.text(`Total Warehouses: ${this.filteredWarehouses.length}`, 20, 45);
            pdf.text(`Branch: ${this.filters.branch || 'All Branches'}`, 20, 55);

            // Prepare table data
            const headers = ['Warehouse Name', 'Branch', 'Type', 'Location', 'Default', 'Active', 'Visible'];
            const data = this.filteredWarehouses.map(warehouse => [
                warehouse.name,
                warehouse.branch,
                warehouse.warehouseType,
                warehouse.location || 'N/A',
                warehouse.isDefault ? 'Yes' : 'No',
                warehouse.isActive ? 'Yes' : 'No',
                warehouse.isVisible ? 'Yes' : 'No'
            ]);

            // Add table
            pdf.autoTable({
                head: [headers],
                body: data,
                startY: 70,
                theme: 'grid',
                styles: {
                    fontSize: 10,
                    cellPadding: 3
                },
                headStyles: {
                    fillColor: [0, 102, 204],
                    textColor: 255,
                    fontStyle: 'bold'
                },
                alternateRowStyles: {
                    fillColor: [245, 245, 245]
                }
            });

            // Add footer
            const pageCount = pdf.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                pdf.setPage(i);
                pdf.setFontSize(10);
                pdf.setTextColor(128, 128, 128);
                pdf.text(`Page ${i} of ${pageCount}`, pdf.internal.pageSize.width - 30, pdf.internal.pageSize.height - 10);
                pdf.text('HCL Software Warehouse Management System', 20, pdf.internal.pageSize.height - 10);
            }

            // Save the PDF
            const fileName = `warehouse-report-${new Date().toISOString().split('T')[0]}.pdf`;
            pdf.save(fileName);

            this.showNotification('PDF saved successfully!', 'success');
        } catch (error) {
            console.error('PDF generation error:', error);
            this.showNotification('Error generating PDF. Please try again.', 'error');
        }
    }

    // Warehouse Modal Management
    showWarehouseModal(warehouseId = null) {
        const modal = document.getElementById('warehouseModal');
        const title = document.getElementById('warehouseModalTitle');
        const form = document.getElementById('warehouseForm');

        if (warehouseId) {
            // Edit mode
            const warehouse = this.warehouses.find(w => w.id === warehouseId);
            title.innerHTML = '<i class="fas fa-edit"></i> Edit Warehouse';
            this.populateWarehouseForm(warehouse);
        } else {
            // Add mode
            title.innerHTML = '<i class="fas fa-warehouse"></i> Add New Warehouse';
            form.reset();
        }

        this.showModal('warehouseModal');
    }

    populateWarehouseForm(warehouse) {
        document.getElementById('warehouseName').value = warehouse.name;
        document.getElementById('warehouseCode').value = warehouse.code || '';
        document.getElementById('warehouseBranch').value = warehouse.branch;
        document.getElementById('warehouseType').value = warehouse.warehouseType;
        document.getElementById('warehouseLocation').value = warehouse.location || '';
        document.getElementById('warehouseCapacity').value = warehouse.capacity || '';
        document.getElementById('isDefault').checked = warehouse.isDefault;
        document.getElementById('isActive').checked = warehouse.isActive;
        document.getElementById('isVisible').checked = warehouse.isVisible;
    }

    saveWarehouse() {
        const form = document.getElementById('warehouseForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const warehouseData = {
            id: Date.now().toString(),
            name: document.getElementById('warehouseName').value,
            code: document.getElementById('warehouseCode').value,
            branch: document.getElementById('warehouseBranch').value,
            warehouseType: document.getElementById('warehouseType').value,
            location: document.getElementById('warehouseLocation').value,
            capacity: document.getElementById('warehouseCapacity').value,
            isDefault: document.getElementById('isDefault').checked,
            isActive: document.getElementById('isActive').checked,
            isVisible: document.getElementById('isVisible').checked,
            order: this.warehouses.length + 1
        };

        this.warehouses.push(warehouseData);
        this.applyFiltersAndSort();
        this.renderTable();
        this.renderPagination();
        this.hideModal('warehouseModal');
        this.showNotification('Warehouse saved successfully!', 'success');
    }

    // Movement Types Management
    showMovementTypeModal() {
        this.renderMovementTypes();
        this.showModal('movementTypeModal');
    }

    renderMovementTypes() {
        const grid = document.getElementById('movementTypesGrid');
        grid.innerHTML = this.movementTypes.map(type => `
            <div class="movement-type-card" data-id="${type.id}">
                <div class="movement-type-header">
                    <div class="movement-type-name">${type.name}</div>
                    <div class="movement-type-code">${type.code}</div>
                </div>
                <div class="movement-type-description">${type.description}</div>
                <div class="movement-type-actions">
                    <button class="btn btn-primary btn-sm" onclick="app.editMovementType('${type.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="app.deleteMovementType('${type.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    addMovementType() {
        const newType = {
            id: Date.now().toString(),
            code: `NEW-${Date.now().toString().slice(-3)}`,
            name: 'New Movement Type',
            description: 'Description for new movement type',
            category: 'General',
            isActive: true,
            createdAt: new Date().toISOString().split('T')[0],
            icon: 'fas fa-arrow-right'
        };

        this.movementTypes.push(newType);
        this.renderMovementTypes();
        this.showNotification('New movement type added', 'success');
    }

    editMovementType(id) {
        this.showNotification('Edit movement type functionality would be implemented here', 'info');
    }

    deleteMovementType(id) {
        if (confirm('Are you sure you want to delete this movement type?')) {
            this.movementTypes = this.movementTypes.filter(type => type.id !== id);
            this.renderMovementTypes();
            this.showNotification('Movement type deleted successfully', 'success');
        }
    }

    saveMovementTypes() {
        this.hideModal('movementTypeModal');
        this.showNotification('Movement types saved successfully!', 'success');
    }

    // Bulk Edit Management
    showBulkEditModal() {
        if (this.selectedRows.size === 0) {
            this.showNotification('Please select items to edit', 'error');
            return;
        }

        document.getElementById('bulkEditCount').textContent = this.selectedRows.size;
        this.showModal('bulkEditModal');
    }

    applyBulkEdit() {
        const branch = document.getElementById('bulkBranch').value;
        const type = document.getElementById('bulkType').value;
        const setActive = document.getElementById('bulkSetActive').checked;
        const setVisible = document.getElementById('bulkSetVisible').checked;

        this.warehouses = this.warehouses.map(warehouse => {
            if (this.selectedRows.has(warehouse.id)) {
                return {
                    ...warehouse,
                    branch: branch || warehouse.branch,
                    warehouseType: type || warehouse.warehouseType,
                    isActive: setActive || warehouse.isActive,
                    isVisible: setVisible || warehouse.isVisible
                };
            }
            return warehouse;
        });

        this.selectedRows.clear();
        this.applyFiltersAndSort();
        this.renderTable();
        this.renderPagination();
        this.updateUI();
        this.hideModal('bulkEditModal');
        this.showNotification('Bulk edit applied successfully!', 'success');
    }

    // Action Methods
    addWarehouse() {
        const newWarehouse = {
            id: Date.now().toString(),
            name: `New Warehouse ${this.warehouses.length + 1}`,
            isDefault: false,
            isActive: true,
            isVisible: true,
            branch: 'Branch 11',
            warehouseType: 'Parts',
            location: 'New Location',
            order: this.warehouses.length + 1
        };

        this.warehouses.push(newWarehouse);
        this.applyFiltersAndSort();
        this.renderTable();
        this.renderPagination();
        this.showNotification('New warehouse added successfully', 'success');
    }

    deleteSelected() {
        if (this.selectedRows.size === 0) {
            this.showNotification('Please select items to delete', 'error');
            return;
        }

        if (confirm(`Are you sure you want to delete ${this.selectedRows.size} selected item(s)?`)) {
            this.warehouses = this.warehouses.filter(warehouse =>
                !this.selectedRows.has(warehouse.id)
            );
            this.selectedRows.clear();
            this.applyFiltersAndSort();
            this.renderTable();
            this.renderPagination();
            this.updateUI();
            this.showNotification('Selected items deleted successfully', 'success');
        }
    }

    saveChanges() {
        this.showNotification('Changes saved successfully', 'success');
    }

    exportData() {
        const csvContent = this.generateCSV();
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'warehouses.csv';
        a.click();
        window.URL.revokeObjectURL(url);
        this.showNotification('Data exported successfully', 'success');
    }

    generateCSV() {
        const headers = ['Name', 'Branch', 'Type', 'Is Default', 'Is Active', 'Is Visible'];
        const rows = this.filteredWarehouses.map(warehouse => [
            warehouse.name,
            warehouse.branch,
            warehouse.warehouseType,
            warehouse.isDefault ? 'Yes' : 'No',
            warehouse.isActive ? 'Yes' : 'No',
            warehouse.isVisible ? 'Yes' : 'No'
        ]);

        return [headers, ...rows].map(row =>
            row.map(field => `"${field}"`).join(',')
        ).join('\n');
    }

    refreshData() {
        this.warehouses = [...mockWarehouses];
        this.selectedRows.clear();
        this.filters = {
            search: '',
            branch: 'Branch 11',
            warehouseType: 'Parts',
            parts: ''
        };
        this.currentPage = 1;

        // Reset form inputs
        document.getElementById('searchInput').value = '';
        document.getElementById('branchSelect').value = 'Branch 11';
        document.getElementById('warehouseTypeSelect').value = 'Parts';
        document.getElementById('partsSelect').value = '';

        this.applyFiltersAndSort();
        this.renderTable();
        this.renderPagination();
        this.updateUI();
        this.showNotification('Data refreshed successfully', 'success');
    }

    // Advanced Search Methods
    showAdvancedSearch() {
        this.showModal('advancedSearchModal');
    }

    applyAdvancedSearch() {
        const name = document.getElementById('advSearchName').value;
        const code = document.getElementById('advSearchCode').value;
        const branch = document.getElementById('advSearchBranch').value;
        const type = document.getElementById('advSearchType').value;
        const location = document.getElementById('advSearchLocation').value;
        const status = document.getElementById('advSearchStatus').value;
        const defaultOnly = document.getElementById('searchDefaultOnly').checked;
        const visibleOnly = document.getElementById('searchVisibleOnly').checked;

        this.filteredWarehouses = this.warehouses.filter(warehouse => {
            const matchesName = !name || warehouse.name.toLowerCase().includes(name.toLowerCase());
            const matchesCode = !code || (warehouse.code && warehouse.code.toLowerCase().includes(code.toLowerCase()));
            const matchesBranch = !branch || warehouse.branch === branch;
            const matchesType = !type || warehouse.warehouseType === type;
            const matchesLocation = !location || (warehouse.location && warehouse.location.toLowerCase().includes(location.toLowerCase()));
            const matchesStatus = !status ||
                (status === 'active' && warehouse.isActive) ||
                (status === 'inactive' && !warehouse.isActive);
            const matchesDefault = !defaultOnly || warehouse.isDefault;
            const matchesVisible = !visibleOnly || warehouse.isVisible;

            return matchesName && matchesCode && matchesBranch && matchesType &&
                   matchesLocation && matchesStatus && matchesDefault && matchesVisible;
        });

        this.currentPage = 1;
        this.renderTable();
        this.renderPagination();
        this.hideModal('advancedSearchModal');
        this.showNotification(`Advanced search applied - ${this.filteredWarehouses.length} results found`, 'success');
    }

    clearAdvancedSearch() {
        document.getElementById('advSearchName').value = '';
        document.getElementById('advSearchCode').value = '';
        document.getElementById('advSearchBranch').value = '';
        document.getElementById('advSearchType').value = '';
        document.getElementById('advSearchLocation').value = '';
        document.getElementById('advSearchStatus').value = '';
        document.getElementById('searchDefaultOnly').checked = false;
        document.getElementById('searchVisibleOnly').checked = false;
    }

    // Navigation Function Methods
    showReportsInfo() {
        this.showNotification('Reports & Analytics: Access comprehensive reporting tools, generate custom reports, and analyze warehouse performance metrics.', 'info');
    }

    showSettingsInfo() {
        this.showNotification('System Settings: Configure system preferences, user permissions, integration settings, and application parameters.', 'info');
    }

    // Manual Navigation
    switchManualSection(sectionId) {
        // Remove active class from all sections and pages
        document.querySelectorAll('.manual-section').forEach(section => {
            section.classList.remove('active');
        });
        document.querySelectorAll('.manual-page').forEach(page => {
            page.classList.remove('active');
        });

        // Add active class to selected section and page
        document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
        document.getElementById(sectionId).classList.add('active');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--bg-primary);
            border: 1px solid var(--border-color);
            border-radius: 4px;
            padding: 12px 16px;
            box-shadow: var(--shadow-lg);
            z-index: 2000;
            max-width: 300px;
            font-size: 12px;
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the HCL WMS application
const app = new HCLWMSApp();
