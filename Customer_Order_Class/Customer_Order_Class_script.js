// Customer Order Class Management System
class OrderClassManager {
    constructor() {
        this.orders = [
            {
                id: 1,
                description: 'Counter Sales',
                leadTime: 0,
                discount: 0.00,
                considerForDemand: false,
                assetValidated: false,
                isActive: true
            },
            {
                id: 2,
                description: 'Customer Order',
                leadTime: 0,
                discount: 0.00,
                considerForDemand: false,
                assetValidated: false,
                isActive: true
            },
            {
                id: 3,
                description: 'Parts Return',
                leadTime: 0,
                discount: 0.00,
                considerForDemand: false,
                assetValidated: false,
                isActive: true
            },
            {
                id: 4,
                description: 'Parts Sales',
                leadTime: 0,
                discount: 0.00,
                considerForDemand: false,
                assetValidated: false,
                isActive: true
            },
            {
                id: 5,
                description: 'Primary Customer',
                leadTime: 0,
                discount: 2.00,
                considerForDemand: true,
                assetValidated: false,
                isActive: true
            },
            {
                id: 6,
                description: 'Test COC',
                leadTime: 3,
                discount: 10.00,
                considerForDemand: false,
                assetValidated: false,
                isActive: false
            },
            {
                id: 7,
                description: 'UDO',
                leadTime: 0,
                discount: 0.00,
                considerForDemand: false,
                assetValidated: false,
                isActive: true
            }
        ];

        this.filteredOrders = [...this.orders];
        this.currentPage = 1;
        this.pageSize = 50;
        this.sortColumn = null;
        this.sortDirection = 'asc';
        this.selectedOrders = new Set();

        this.init();
    }

    init() {
        this.initTheme();
        this.initCustomDropdown();
        this.bindEvents();
        this.renderTable();
        this.updatePagination();
        this.initializeDashboard();
    }

    initTheme() {
        // Load saved theme or default to light
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.currentTheme = savedTheme;
        this.setTheme(savedTheme);
        this.updateThemeIcon();
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
        this.updateThemeIcon();
    }

    updateThemeIcon() {
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            themeIcon.textContent = this.currentTheme === 'dark' ? 'dark_mode' : 'light_mode';
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    initCustomDropdown() {
        this.selectedOrderType = '';
        this.dropdownOptions = [
            { value: '', text: '--Select--' },
            { value: 'customer-order', text: 'Customer Order' },
            { value: 'job-card', text: 'Job Card' },
            { value: 'job-card-issue', text: 'Job Card Issue' },
            { value: 'non-sales-order', text: 'Non-Sales Order' },
            { value: 'stock-transfer', text: 'Stock Transfer' },
            { value: 'parts-return', text: 'Parts Return' },
            { value: 'counter-sales', text: 'Counter Sales' },
            { value: 'warranty-claim', text: 'Warranty Claim' },
            { value: 'service-order', text: 'Service Order' },
            { value: 'purchase-order', text: 'Purchase Order' },
            { value: 'sales-return', text: 'Sales Return' },
            { value: 'inventory-adjustment', text: 'Inventory Adjustment' },
            { value: 'material-request', text: 'Material Request' },
            { value: 'quality-inspection', text: 'Quality Inspection' },
            { value: 'delivery-note', text: 'Delivery Note' },
            { value: 'payment-entry', text: 'Payment Entry' },
            { value: 'expense-claim', text: 'Expense Claim' },
            { value: 'asset-movement', text: 'Asset Movement' },
            { value: 'maintenance-schedule', text: 'Maintenance Schedule' },
            { value: 'production-order', text: 'Production Order' },
            { value: 'work-order', text: 'Work Order' },
            { value: 'quotation', text: 'Quotation' },
            { value: 'lead-management', text: 'Lead Management' },
            { value: 'opportunity', text: 'Opportunity' },
            { value: 'project-task', text: 'Project Task' },
            { value: 'timesheet', text: 'Timesheet' },
            { value: 'employee-checkin', text: 'Employee Checkin' }
        ];

        this.checkDropdownHeight();
        this.bindDropdownEvents();

        // Initialize customer data for dropdowns
        this.initCustomerData();
    }

    initCustomerData() {
        this.customerOptions = [
            { value: '', text: '--Select--' },
            { value: 'customer-10', text: 'Customer 10' },
            { value: 'customer-1382', text: 'Customer 1382' },
            { value: 'teck-coal-ltd-fro', text: 'TECK COAL LTD-FRO' },
            { value: 'customer-1910', text: 'Customer 1910' },
            { value: 'customer-3207', text: 'Customer 3207' },
            { value: 'customer-3544', text: 'Customer 3544' },
            { value: 'customer-5080', text: 'Customer 5080' },
            { value: 'customer-7726', text: 'Customer 7726' },
            { value: 'customer-8751', text: 'Customer 8751' },
            { value: 'customer-9632', text: 'Customer 9632' },
            { value: 'customer-10666', text: 'Customer 10666' },
            { value: 'customer-11192', text: 'Customer 11192' },
            { value: 'customer-11559', text: 'Customer 11559' },
            { value: 'customer-11567', text: 'Customer 11567' },
            { value: 'customer-11845', text: 'Customer 11845' },
            { value: 'customer-12680', text: 'Customer 12680' },
            { value: 'customer-15263', text: 'Customer 15263' }
        ];
    }

    checkDropdownHeight() {
        // Calculate if search should be shown based on screen height
        const optionHeight = 40; // Approximate height per option
        const maxOptionsWithoutSearch = Math.floor((window.innerHeight * 0.6) / optionHeight);

        const dropdownSearch = document.getElementById('dropdownSearch');
        if (this.dropdownOptions.length > maxOptionsWithoutSearch) {
            dropdownSearch.style.display = 'block';
        } else {
            dropdownSearch.style.display = 'none';
        }
    }

    bindDropdownEvents() {
        const dropdownSelected = document.getElementById('dropdownSelected');
        const dropdownOptions = document.getElementById('dropdownOptions');
        const searchInput = document.getElementById('searchInputDropdown');
        const optionsList = document.getElementById('optionsList');

        // Toggle dropdown
        dropdownSelected.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = dropdownOptions.classList.contains('show');
            this.closeAllDropdowns();

            if (!isOpen) {
                dropdownOptions.classList.add('show');
                dropdownSelected.classList.add('open');
                searchInput.value = '';
                this.filterDropdownOptions('');

                // Focus search input if visible
                if (document.getElementById('dropdownSearch').style.display !== 'none') {
                    setTimeout(() => searchInput.focus(), 100);
                }
            }
        });

        // Search functionality
        searchInput.addEventListener('input', (e) => {
            this.filterDropdownOptions(e.target.value);
        });

        // Option selection
        optionsList.addEventListener('click', (e) => {
            if (e.target.classList.contains('dropdown-option')) {
                const value = e.target.dataset.value;
                const text = e.target.textContent;
                this.selectDropdownOption(value, text);
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            this.closeAllDropdowns();
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.checkDropdownHeight();
        });
    }

    filterDropdownOptions(searchTerm) {
        const options = document.querySelectorAll('.dropdown-option');
        const term = searchTerm.toLowerCase();

        options.forEach(option => {
            const text = option.textContent.toLowerCase();
            if (text.includes(term)) {
                option.classList.remove('hidden');
            } else {
                option.classList.add('hidden');
            }
        });
    }

    selectDropdownOption(value, text) {
        this.selectedOrderType = value;
        document.querySelector('.selected-text').textContent = text;

        // Update selected state
        document.querySelectorAll('.dropdown-option').forEach(opt => {
            opt.classList.remove('selected');
        });

        const selectedOption = document.querySelector(`[data-value="${value}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }

        this.closeAllDropdowns();

        // Trigger any change events if needed
        console.log('Selected order type:', value);
    }

    closeAllDropdowns() {
        document.getElementById('dropdownOptions').classList.remove('show');
        document.getElementById('dropdownSelected').classList.remove('open');
    }

    bindEvents() {
        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.filterOrders(e.target.value);
        });

        // Theme toggle button
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // New button
        document.getElementById('newBtn').addEventListener('click', () => {
            this.openModal();
        });

        // Modal events
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('saveBtn').addEventListener('click', () => {
            this.saveOrder();
        });

        // Click outside modal to close
        document.getElementById('orderModal').addEventListener('click', (e) => {
            if (e.target.id === 'orderModal') {
                this.closeModal();
            }
        });

        // Select all checkbox
        document.getElementById('selectAll').addEventListener('change', (e) => {
            this.toggleSelectAll(e.target.checked);
        });

        // Table sorting
        document.querySelectorAll('.sortable').forEach(header => {
            header.addEventListener('click', () => {
                const column = header.dataset.column;
                this.sortTable(column);
            });
        });

        // Pagination controls
        document.getElementById('firstPage').addEventListener('click', () => {
            this.goToPage(1);
        });

        document.getElementById('prevPage').addEventListener('click', () => {
            this.goToPage(this.currentPage - 1);
        });

        document.getElementById('nextPage').addEventListener('click', () => {
            this.goToPage(this.currentPage + 1);
        });

        document.getElementById('lastPage').addEventListener('click', () => {
            const totalPages = Math.ceil(this.filteredOrders.length / this.pageSize);
            this.goToPage(totalPages);
        });

        document.getElementById('currentPage').addEventListener('change', (e) => {
            const page = parseInt(e.target.value);
            if (page > 0) {
                this.goToPage(page);
            }
        });

        document.getElementById('pageSize').addEventListener('change', (e) => {
            this.pageSize = parseInt(e.target.value);
            this.currentPage = 1;
            this.renderTable();
            this.updatePagination();
        });

        // Toolbar buttons
        document.getElementById('deleteBtn').addEventListener('click', () => {
            this.deleteSelectedOrders();
        });

        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.refreshData();
        });

        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('advancedSearchBtn').addEventListener('click', () => {
            this.showAdvancedSearch();
        });
    }

    filterOrders(searchTerm) {
        if (!searchTerm.trim()) {
            this.filteredOrders = [...this.orders];
        } else {
            const term = searchTerm.toLowerCase();
            this.filteredOrders = this.orders.filter(order =>
                order.description.toLowerCase().includes(term) ||
                order.leadTime.toString().includes(term) ||
                order.discount.toString().includes(term)
            );
        }

        this.currentPage = 1;
        this.renderTable();
        this.updatePagination();
        this.updateDashboard();
    }

    sortTable(column) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }

        this.filteredOrders.sort((a, b) => {
            let aVal = a[column];
            let bVal = b[column];

            // Handle different data types
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

    updateSortIcons() {
        document.querySelectorAll('.sort-icon').forEach(icon => {
            icon.textContent = 'unfold_more';
        });

        if (this.sortColumn) {
            const header = document.querySelector(`[data-column="${this.sortColumn}"] .sort-icon`);
            if (header) {
                header.textContent = this.sortDirection === 'asc' ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
            }
        }
    }

    renderTable() {
        const tbody = document.getElementById('tableBody');
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        const pageOrders = this.filteredOrders.slice(startIndex, endIndex);

        tbody.innerHTML = pageOrders.map(order => `
            <tr data-id="${order.id}">
                <td class="checkbox-column">
                    <label class="checkbox-container">
                        <input type="checkbox" class="row-checkbox" data-id="${order.id}"
                               ${this.selectedOrders.has(order.id) ? 'checked' : ''}>
                        <span class="checkmark"></span>
                    </label>
                </td>
                <td class="action-column">
                    <button class="action-btn view-btn" data-id="${order.id}" title="View">
                        <span class="material-icons">visibility</span>
                    </button>
                </td>
                <td>${order.description}</td>
                <td>${order.leadTime}</td>
                <td>${order.discount.toFixed(2)}</td>
                <td>
                    <span class="status-badge ${order.considerForDemand ? 'yes' : 'no'}">
                        ${order.considerForDemand ? 'Yes' : 'No'}
                    </span>
                </td>
                <td>
                    <span class="status-badge ${order.assetValidated ? 'yes' : 'no'}">
                        ${order.assetValidated ? 'Yes' : 'No'}
                    </span>
                </td>
                <td>
                    <span class="status-badge ${order.isActive ? 'active' : 'inactive'}">
                        ${order.isActive ? 'Yes' : 'No'}
                    </span>
                </td>
            </tr>
        `).join('');

        // Bind row events
        this.bindRowEvents();
    }

    bindRowEvents() {
        // Checkbox events
        document.querySelectorAll('.row-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const orderId = parseInt(e.target.dataset.id);
                if (e.target.checked) {
                    this.selectedOrders.add(orderId);
                } else {
                    this.selectedOrders.delete(orderId);
                }
                this.updateSelectAllState();
            });
        });

        // Edit button events removed - no edit buttons in main table

        // View button events
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const orderId = parseInt(e.target.closest('.view-btn').dataset.id);
                this.viewOrder(orderId);
            });
        });
    }

    updateSelectAllState() {
        const selectAllCheckbox = document.getElementById('selectAll');
        const visibleOrders = this.getVisibleOrderIds();
        const selectedVisibleOrders = visibleOrders.filter(id => this.selectedOrders.has(id));

        if (selectedVisibleOrders.length === 0) {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = false;
        } else if (selectedVisibleOrders.length === visibleOrders.length) {
            selectAllCheckbox.checked = true;
            selectAllCheckbox.indeterminate = false;
        } else {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = true;
        }
    }

    getVisibleOrderIds() {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        return this.filteredOrders.slice(startIndex, endIndex).map(order => order.id);
    }

    toggleSelectAll(checked) {
        const visibleOrders = this.getVisibleOrderIds();

        if (checked) {
            visibleOrders.forEach(id => this.selectedOrders.add(id));
        } else {
            visibleOrders.forEach(id => this.selectedOrders.delete(id));
        }

        this.renderTable();
    }

    updatePagination() {
        const totalRecords = this.filteredOrders.length;
        const totalPages = Math.ceil(totalRecords / this.pageSize);
        const startRecord = totalRecords > 0 ? (this.currentPage - 1) * this.pageSize + 1 : 0;
        const endRecord = Math.min(this.currentPage * this.pageSize, totalRecords);

        document.getElementById('currentRange').textContent = `${startRecord} - ${endRecord}`;
        document.getElementById('totalRecords').textContent = totalRecords;
        document.getElementById('currentPage').value = this.currentPage;
        document.getElementById('totalPages').textContent = totalPages;

        // Update pagination button states
        document.getElementById('firstPage').disabled = this.currentPage === 1;
        document.getElementById('prevPage').disabled = this.currentPage === 1;
        document.getElementById('nextPage').disabled = this.currentPage === totalPages || totalPages === 0;
        document.getElementById('lastPage').disabled = this.currentPage === totalPages || totalPages === 0;
    }

    goToPage(page) {
        const totalPages = Math.ceil(this.filteredOrders.length / this.pageSize);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderTable();
            this.updatePagination();
        }
    }

    openModal(order = null) {
        const modal = document.getElementById('orderModal');
        const form = document.getElementById('orderForm');
        const title = document.getElementById('modalTitle');

        if (order) {
            title.textContent = 'Edit Order Class';
            form.description.value = order.description;
            form.leadTime.value = order.leadTime;
            form.discount.value = order.discount;
            form.considerForDemand.checked = order.considerForDemand;
            form.assetValidated.checked = order.assetValidated;
            form.isActive.checked = order.isActive;
            form.dataset.editId = order.id;
        } else {
            title.textContent = 'New Order Class';
            form.reset();
            form.isActive.checked = true;
            delete form.dataset.editId;
        }

        modal.classList.add('show');
        form.description.focus();
    }

    closeModal() {
        const modal = document.getElementById('orderModal');
        modal.classList.remove('show');
    }

    saveOrder() {
        const form = document.getElementById('orderForm');
        const formData = new FormData(form);

        const orderData = {
            description: formData.get('description'),
            leadTime: parseInt(formData.get('leadTime')) || 0,
            discount: parseFloat(formData.get('discount')) || 0,
            considerForDemand: formData.has('considerForDemand'),
            assetValidated: formData.has('assetValidated'),
            isActive: formData.has('isActive')
        };

        if (!orderData.description.trim()) {
            alert('Please enter a description');
            return;
        }

        this.showLoading();

        // Simulate API call
        setTimeout(() => {
            if (form.dataset.editId) {
                // Edit existing order
                const orderId = parseInt(form.dataset.editId);
                const orderIndex = this.orders.findIndex(o => o.id === orderId);
                if (orderIndex !== -1) {
                    this.orders[orderIndex] = { ...this.orders[orderIndex], ...orderData };
                }
            } else {
                // Add new order
                const newOrder = {
                    id: Math.max(...this.orders.map(o => o.id)) + 1,
                    ...orderData
                };
                this.orders.push(newOrder);
            }

            this.filteredOrders = [...this.orders];
            this.renderTable();
            this.updatePagination();
            this.updateDashboard();
            this.closeModal();
            this.hideLoading();

            this.showNotification(form.dataset.editId ? 'Order updated successfully' : 'Order created successfully');
        }, 1000);
    }

    editOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            this.openModal(order);
        }
    }

    viewOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            this.openViewModal(order);
        }
    }

    openViewModal(order) {
        // Create view modal if it doesn't exist
        let viewModal = document.getElementById('viewModal');
        if (!viewModal) {
            this.createViewModal();
            viewModal = document.getElementById('viewModal');
        }

        // Populate the modal with order data
        document.getElementById('viewOrderTitle').textContent = order.description;
        document.getElementById('viewDescription').textContent = order.description;
        document.getElementById('viewLeadTime').textContent = order.leadTime;
        document.getElementById('viewDiscount').textContent = order.discount.toFixed(2);
        document.getElementById('viewIsActive').textContent = order.isActive ? 'Yes' : 'No';
        document.getElementById('viewConsiderForDemand').textContent = order.considerForDemand ? 'Yes' : 'No';
        document.getElementById('viewAssetValidated').textContent = order.assetValidated ? 'Yes' : 'No';

        // Populate customer specific data (mock data for demonstration)
        this.populateCustomerSpecificData(order);

        viewModal.classList.add('show');
    }

    createViewModal() {
        const modalHTML = `
            <div id="viewModal" class="modal view-modal">
                <div class="modal-content view-modal-content">
                    <div class="modal-header view-modal-header">
                        <h2 id="viewOrderTitle">Order Details</h2>
                        <div class="view-modal-actions">
                            <button class="btn btn-primary btn-sm" id="publishBtn">
                                <span class="material-icons">publish</span>
                                Publish
                            </button>
                            <button class="btn btn-secondary btn-sm" id="editFromViewBtn">
                                <span class="material-icons">edit</span>
                                Edit
                            </button>
                            <button class="btn btn-primary btn-sm" id="saveEditBtn" style="display: none;">
                                <span class="material-icons">save</span>
                                Save
                            </button>
                            <button class="btn btn-secondary btn-sm" id="cancelEditBtn" style="display: none;">
                                <span class="material-icons">cancel</span>
                                Cancel
                            </button>
                            <button class="btn btn-secondary btn-sm" id="exitViewBtn">
                                <span class="material-icons">close</span>
                                Exit
                            </button>
                        </div>
                    </div>
                    <div class="modal-body view-modal-body">
                        <div class="view-details-grid" id="viewDetailsGrid">
                            <div class="view-detail-item">
                                <label>Description:</label>
                                <span id="viewDescription"></span>
                                <input type="text" id="editDescription" class="edit-input" style="display: none;">
                            </div>
                            <div class="view-detail-item">
                                <label>Is Active?</label>
                                <span id="viewIsActive" class="status-indicator"></span>
                                <label class="checkbox-label edit-checkbox" style="display: none;">
                                    <input type="checkbox" id="editIsActive">
                                    <span class="checkmark"></span>
                                    Active
                                </label>
                            </div>
                            <div class="view-detail-item">
                                <label>Lead Time:</label>
                                <span id="viewLeadTime"></span>
                                <input type="number" id="editLeadTime" class="edit-input" style="display: none;">
                            </div>
                            <div class="view-detail-item">
                                <label>Is Consider For Demand?</label>
                                <span id="viewConsiderForDemand" class="status-indicator"></span>
                                <label class="checkbox-label edit-checkbox" style="display: none;">
                                    <input type="checkbox" id="editConsiderForDemand">
                                    <span class="checkmark"></span>
                                    Consider For Demand
                                </label>
                            </div>
                            <div class="view-detail-item">
                                <label>Discount:</label>
                                <span id="viewDiscount"></span>
                                <input type="number" id="editDiscount" class="edit-input" style="display: none;" step="0.01">
                            </div>
                            <div class="view-detail-item">
                                <label>Is Asset Validated?</label>
                                <span id="viewAssetValidated" class="status-indicator"></span>
                                <label class="checkbox-label edit-checkbox" style="display: none;">
                                    <input type="checkbox" id="editAssetValidated">
                                    <span class="checkmark"></span>
                                    Asset Validated
                                </label>
                            </div>
                        </div>

                        <div class="customer-specific-section">
                            <div class="section-header">
                                <h3>Customer Specific</h3>
                                <button class="btn btn-secondary btn-sm" id="addCustomerSpecificBtn">
                                    <span class="material-icons">add</span>
                                    Add
                                </button>
                            </div>
                            <div class="customer-specific-table-container">
                                <div class="table-wrapper">
                                    <table class="modern-table customer-specific-table">
                                        <thead>
                                            <tr>
                                                <th>Edit</th>
                                                <th>Delete</th>
                                                <th>Is Partner?</th>
                                                <th>Customer</th>
                                                <th>Lead Time</th>
                                                <th>Discount</th>
                                            </tr>
                                        </thead>
                                        <tbody id="customerSpecificTableBody">
                                            <!-- Customer specific data will be populated here -->
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="customer-specific-pagination">
                                <div class="pagination-controls-small">
                                    <button class="pagination-btn-small" id="customerFirstPage">
                                        <span class="material-icons">first_page</span>
                                    </button>
                                    <button class="pagination-btn-small" id="customerPrevPage">
                                        <span class="material-icons">chevron_left</span>
                                    </button>
                                    <button class="pagination-btn-small" id="customerNextPage">
                                        <span class="material-icons">chevron_right</span>
                                    </button>
                                    <span class="pagination-info-small">View 1 - 1 Of 1</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Bind events for the view modal
        this.bindViewModalEvents();
    }

    bindViewModalEvents() {
        this.isEditMode = false;

        document.getElementById('exitViewBtn').addEventListener('click', () => {
            this.closeViewModal();
        });

        document.getElementById('editFromViewBtn').addEventListener('click', () => {
            this.toggleEditMode(true);
        });

        document.getElementById('saveEditBtn').addEventListener('click', () => {
            this.saveViewModalChanges();
        });

        document.getElementById('cancelEditBtn').addEventListener('click', () => {
            this.toggleEditMode(false);
        });

        document.getElementById('publishBtn').addEventListener('click', () => {
            this.publishOrder();
        });

        document.getElementById('addCustomerSpecificBtn').addEventListener('click', () => {
            this.addCustomerSpecific();
        });

        // Close modal when clicking outside
        document.getElementById('viewModal').addEventListener('click', (e) => {
            if (e.target.id === 'viewModal') {
                this.closeViewModal();
            }
        });

        // Bind customer specific table events
        this.bindCustomerSpecificEvents();
    }

    toggleEditMode(editMode) {
        this.isEditMode = editMode;

        // Toggle visibility of view/edit elements
        const viewElements = document.querySelectorAll('#viewDetailsGrid span:not(.checkmark)');
        const editInputs = document.querySelectorAll('#viewDetailsGrid .edit-input');
        const editCheckboxes = document.querySelectorAll('#viewDetailsGrid .edit-checkbox');

        viewElements.forEach(el => {
            if (!el.classList.contains('checkmark')) {
                el.style.display = editMode ? 'none' : 'block';
            }
        });

        editInputs.forEach(el => {
            el.style.display = editMode ? 'block' : 'none';
        });

        editCheckboxes.forEach(el => {
            el.style.display = editMode ? 'flex' : 'none';
        });

        // Toggle button visibility
        document.getElementById('editFromViewBtn').style.display = editMode ? 'none' : 'inline-flex';
        document.getElementById('publishBtn').style.display = editMode ? 'none' : 'inline-flex';
        document.getElementById('saveEditBtn').style.display = editMode ? 'inline-flex' : 'none';
        document.getElementById('cancelEditBtn').style.display = editMode ? 'inline-flex' : 'none';

        if (editMode) {
            this.populateEditFields();
        }
    }

    populateEditFields() {
        const orderId = this.getCurrentViewOrderId();
        const order = this.orders.find(o => o.id === orderId);

        if (order) {
            document.getElementById('editDescription').value = order.description;
            document.getElementById('editLeadTime').value = order.leadTime;
            document.getElementById('editDiscount').value = order.discount;
            document.getElementById('editIsActive').checked = order.isActive;
            document.getElementById('editConsiderForDemand').checked = order.considerForDemand;
            document.getElementById('editAssetValidated').checked = order.assetValidated;
        }
    }

    saveViewModalChanges() {
        const orderId = this.getCurrentViewOrderId();
        const orderIndex = this.orders.findIndex(o => o.id === orderId);

        if (orderIndex !== -1) {
            // Update order data
            this.orders[orderIndex].description = document.getElementById('editDescription').value;
            this.orders[orderIndex].leadTime = parseInt(document.getElementById('editLeadTime').value);
            this.orders[orderIndex].discount = parseFloat(document.getElementById('editDiscount').value);
            this.orders[orderIndex].isActive = document.getElementById('editIsActive').checked;
            this.orders[orderIndex].considerForDemand = document.getElementById('editConsiderForDemand').checked;
            this.orders[orderIndex].assetValidated = document.getElementById('editAssetValidated').checked;

            // Update filtered orders
            this.filteredOrders = [...this.orders];

            // Refresh view
            this.updateViewModalDisplay(this.orders[orderIndex]);
            this.renderTable();
            this.updatePagination();

            this.toggleEditMode(false);
            this.showNotification('Order updated successfully');

            // Close modal after save
            setTimeout(() => {
                this.closeViewModal();
            }, 1500);
        }
    }

    bindCustomerSpecificEvents() {
        // Delegate event handling for dynamically created buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.edit-customer-btn')) {
                const id = parseInt(e.target.closest('.edit-customer-btn').dataset.id);
                this.editCustomerSpecific(id);
            }

            if (e.target.closest('.delete-customer-btn')) {
                const id = parseInt(e.target.closest('.delete-customer-btn').dataset.id);
                this.deleteCustomerSpecific(id);
            }

            if (e.target.closest('.save-customer-btn')) {
                const id = parseInt(e.target.closest('.save-customer-btn').dataset.id);
                this.saveCustomerSpecific(id);
            }

            if (e.target.closest('.cancel-customer-btn')) {
                const id = parseInt(e.target.closest('.cancel-customer-btn').dataset.id);
                this.cancelEditCustomerSpecific(id);
            }
        });
    }

    populateCustomerSpecificData(order) {
        // Mock customer specific data with more entries for pagination
        this.customerSpecificData = [
            {
                id: 1,
                isPartner: false,
                customer: 'Customer 10',
                leadTime: 2,
                discount: 5.00
            },
            {
                id: 2,
                isPartner: true,
                customer: 'Customer 15',
                leadTime: 3,
                discount: 7.50
            },
            {
                id: 3,
                isPartner: false,
                customer: 'Customer 20',
                leadTime: 1,
                discount: 2.00
            },
            {
                id: 4,
                isPartner: true,
                customer: 'Customer 25',
                leadTime: 4,
                discount: 10.00
            },
            {
                id: 5,
                isPartner: false,
                customer: 'Customer 30',
                leadTime: 2,
                discount: 3.75
            },
            {
                id: 6,
                isPartner: true,
                customer: 'Customer 35',
                leadTime: 5,
                discount: 12.50
            },
            {
                id: 7,
                isPartner: false,
                customer: 'Customer 40',
                leadTime: 1,
                discount: 1.25
            },
            {
                id: 8,
                isPartner: true,
                customer: 'Customer 45',
                leadTime: 3,
                discount: 8.00
            },
            {
                id: 9,
                isPartner: false,
                customer: 'Customer 50',
                leadTime: 2,
                discount: 4.50
            },
            {
                id: 10,
                isPartner: true,
                customer: 'Customer 55',
                leadTime: 6,
                discount: 15.00
            }
        ];

        // Initialize pagination
        this.customerSpecificCurrentPage = 1;
        this.customerSpecificItemsPerPage = 5;
        this.renderCustomerSpecificPage();
        this.setupCustomerSpecificPagination();

        // Store current order ID for reference
        document.getElementById('viewModal').dataset.orderId = order.id;
    }

    renderCustomerSpecificPage() {
        const startIndex = (this.customerSpecificCurrentPage - 1) * this.customerSpecificItemsPerPage;
        const endIndex = startIndex + this.customerSpecificItemsPerPage;
        const pageData = this.customerSpecificData.slice(startIndex, endIndex);

        const tbody = document.getElementById('customerSpecificTableBody');

        // Generate rows for actual data
        let rows = pageData.map(item => {
            if (item.isEditing) {
                return `
                    <tr>
                        <td>
                            <button class="action-btn save-customer-btn" data-id="${item.id}">
                                <span class="material-icons">save</span>
                            </button>
                        </td>
                        <td>
                            <button class="action-btn cancel-customer-btn" data-id="${item.id}">
                                <span class="material-icons">cancel</span>
                            </button>
                        </td>
                        <td>
                            <label class="checkbox-label">
                                <input type="checkbox" class="partner-checkbox" ${item.isPartner ? 'checked' : ''}>
                                <span class="checkmark"></span>
                            </label>
                        </td>
                        <td>
                            <div class="customer-dropdown-container">
                                ${this.createCustomerDropdownHTML(item.customer)}
                            </div>
                        </td>
                        <td>
                            <input type="number" class="leadtime-input" value="${item.leadTime}" min="0">
                        </td>
                        <td>
                            <input type="number" class="discount-input" value="${item.discount.toFixed(2)}" min="0" step="0.01">
                        </td>
                    </tr>
                `;
            } else {
                return `
                    <tr>
                        <td>
                            <button class="action-btn edit-customer-btn" data-id="${item.id}">
                                <span class="material-icons">edit</span>
                            </button>
                        </td>
                        <td>
                            <button class="action-btn delete-customer-btn" data-id="${item.id}">
                                <span class="material-icons">delete</span>
                            </button>
                        </td>
                        <td>
                            <span class="status-badge ${item.isPartner ? 'yes' : 'no'}">
                                ${item.isPartner ? 'YES' : 'NO'}
                            </span>
                        </td>
                        <td>${item.customer}</td>
                        <td>${item.leadTime}</td>
                        <td>${item.discount.toFixed(2)}</td>
                    </tr>
                `;
            }
        });

        // Add empty rows to fill up to 5 rows for consistent height
        const emptyRowsNeeded = this.customerSpecificItemsPerPage - pageData.length;
        for (let i = 0; i < emptyRowsNeeded; i++) {
            rows.push(`
                <tr class="empty-row">
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
            `);
        }

        tbody.innerHTML = rows.join('');

        // Update pagination info
        const totalItems = this.customerSpecificData.length;
        const totalPages = Math.ceil(totalItems / this.customerSpecificItemsPerPage);
        const startItem = startIndex + 1;
        const endItem = Math.min(endIndex, totalItems);

        const paginationInfo = document.querySelector('.customer-specific-pagination .pagination-info-small');
        if (paginationInfo) {
            paginationInfo.textContent = `View ${startItem} - ${endItem} of ${totalItems}`;
        }

        // Initialize custom dropdowns
        this.initializeCustomerDropdowns();
    }

    setupCustomerSpecificPagination() {
        const totalPages = Math.ceil(this.customerSpecificData.length / this.customerSpecificItemsPerPage);

        // First page button
        const firstPageBtn = document.getElementById('customerFirstPage');
        if (firstPageBtn) {
            firstPageBtn.onclick = () => {
                this.customerSpecificCurrentPage = 1;
                this.renderCustomerSpecificPage();
                this.updateCustomerSpecificPaginationButtons();
            };
        }

        // Previous page button
        const prevPageBtn = document.getElementById('customerPrevPage');
        if (prevPageBtn) {
            prevPageBtn.onclick = () => {
                if (this.customerSpecificCurrentPage > 1) {
                    this.customerSpecificCurrentPage--;
                    this.renderCustomerSpecificPage();
                    this.updateCustomerSpecificPaginationButtons();
                }
            };
        }

        // Next page button
        const nextPageBtn = document.getElementById('customerNextPage');
        if (nextPageBtn) {
            nextPageBtn.onclick = () => {
                if (this.customerSpecificCurrentPage < totalPages) {
                    this.customerSpecificCurrentPage++;
                    this.renderCustomerSpecificPage();
                    this.updateCustomerSpecificPaginationButtons();
                }
            };
        }

        // Last page button
        const lastPageBtn = document.getElementById('customerLastPage');
        if (lastPageBtn) {
            lastPageBtn.onclick = () => {
                this.customerSpecificCurrentPage = totalPages;
                this.renderCustomerSpecificPage();
                this.updateCustomerSpecificPaginationButtons();
            };
        }

        this.updateCustomerSpecificPaginationButtons();
    }

    updateCustomerSpecificPaginationButtons() {
        const totalPages = Math.ceil(this.customerSpecificData.length / this.customerSpecificItemsPerPage);

        const firstPageBtn = document.getElementById('customerFirstPage');
        const prevPageBtn = document.getElementById('customerPrevPage');
        const nextPageBtn = document.getElementById('customerNextPage');
        const lastPageBtn = document.getElementById('customerLastPage');

        if (firstPageBtn) firstPageBtn.disabled = this.customerSpecificCurrentPage === 1;
        if (prevPageBtn) prevPageBtn.disabled = this.customerSpecificCurrentPage === 1;
        if (nextPageBtn) nextPageBtn.disabled = this.customerSpecificCurrentPage === totalPages;
        if (lastPageBtn) lastPageBtn.disabled = this.customerSpecificCurrentPage === totalPages;
    }

    closeViewModal() {
        const viewModal = document.getElementById('viewModal');
        if (viewModal) {
            viewModal.classList.remove('show');
        }
    }

    getCurrentViewOrderId() {
        const viewModal = document.getElementById('viewModal');
        return viewModal ? parseInt(viewModal.dataset.orderId) : null;
    }

    publishOrder() {
        this.showNotification('Order published successfully');
    }

    updateViewModalDisplay(order) {
        // Update the view display with new values
        document.getElementById('viewDescription').textContent = order.description;
        document.getElementById('viewLeadTime').textContent = order.leadTime;
        document.getElementById('viewDiscount').textContent = order.discount.toFixed(2);
        document.getElementById('viewIsActive').textContent = order.isActive ? 'Yes' : 'No';
        document.getElementById('viewConsiderForDemand').textContent = order.considerForDemand ? 'Yes' : 'No';
        document.getElementById('viewAssetValidated').textContent = order.assetValidated ? 'Yes' : 'No';
    }

    addCustomerSpecific() {
        // Add new empty row at the top
        const newId = Math.max(...this.customerSpecificData.map(item => item.id)) + 1;
        const newItem = {
            id: newId,
            isPartner: false,
            customer: '',
            leadTime: 0,
            discount: 0.00,
            isEditing: true
        };

        this.customerSpecificData.unshift(newItem);
        this.customerSpecificCurrentPage = 1; // Go to first page to show new item
        this.renderCustomerSpecificPage();
        this.setupCustomerSpecificPagination();
    }

    editCustomerSpecific(id) {
        const item = this.customerSpecificData.find(item => item.id === id);
        if (item) {
            item.isEditing = true;
            this.renderCustomerSpecificPage();
        }
    }

    deleteCustomerSpecific(id) {
        if (confirm('Are you sure you want to delete this customer specific entry?')) {
            this.customerSpecificData = this.customerSpecificData.filter(item => item.id !== id);
            this.renderCustomerSpecificPage();
            this.setupCustomerSpecificPagination();
            this.showNotification('Customer specific entry deleted successfully');
        }
    }

    saveCustomerSpecific(id) {
        const item = this.customerSpecificData.find(item => item.id === id);
        if (item) {
            // Get values from form elements
            const row = document.querySelector(`[data-id="${id}"]`).closest('tr');
            const leadTimeInput = row.querySelector('.leadtime-input');
            const discountInput = row.querySelector('.discount-input');
            const partnerCheckbox = row.querySelector('.partner-checkbox');

            // Get customer value from either dropdown or select
            let customerValue = '';
            let customerText = '';

            const customDropdown = row.querySelector('.customer-dropdown .dropdown-selected');
            const customerSelect = row.querySelector('.customer-select');

            if (customDropdown) {
                customerValue = customDropdown.dataset.value;
                customerText = customDropdown.querySelector('.selected-text').textContent;
            } else if (customerSelect) {
                customerValue = customerSelect.value;
                customerText = customerSelect.options[customerSelect.selectedIndex].text;
            }

            // Validate required fields
            if (!customerValue || customerValue === '') {
                alert('Please select a customer');
                return;
            }

            // Update item
            item.customer = customerText;
            item.leadTime = parseInt(leadTimeInput.value) || 0;
            item.discount = parseFloat(discountInput.value) || 0;
            item.isPartner = partnerCheckbox.checked;
            item.isEditing = false;

            this.renderCustomerSpecificPage();
            this.showNotification('Customer specific entry saved successfully');
        }
    }

    cancelEditCustomerSpecific(id) {
        const item = this.customerSpecificData.find(item => item.id === id);
        if (item) {
            if (item.customer === '') {
                // If it's a new item with no customer, remove it
                this.customerSpecificData = this.customerSpecificData.filter(item => item.id !== id);
            } else {
                item.isEditing = false;
            }
            this.renderCustomerSpecificPage();
            this.setupCustomerSpecificPagination();
        }
    }

    createCustomerDropdown(selectedValue = '') {
        const select = document.createElement('select');
        select.className = 'customer-select';

        // Add search functionality if more than 5 options
        if (this.customerOptions.length > 5) {
            select.setAttribute('data-search', 'true');
        }

        this.customerOptions.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            if (option.value === selectedValue) {
                optionElement.selected = true;
            }
            select.appendChild(optionElement);
        });

        return select;
    }

    createCustomerDropdownHTML(selectedCustomer = '') {
        const hasSearch = this.customerOptions.length > 5;
        let selectedValue = '';
        let selectedText = '--Select--';

        // Find the value for the selected customer text
        const selectedOption = this.customerOptions.find(opt => opt.text === selectedCustomer);
        if (selectedOption) {
            selectedValue = selectedOption.value;
            selectedText = selectedOption.text;
        }

        let html;

        if (hasSearch) {
            const dropdownId = 'dropdown_' + Math.random().toString(36).substring(2, 11);

            html = `
                <div class="custom-dropdown customer-dropdown" data-dropdown-id="${dropdownId}">
                    <div class="dropdown-selected" data-value="${selectedValue}">
                        <span class="selected-text">${selectedText}</span>
                        <span class="dropdown-arrow material-icons">expand_more</span>
                    </div>
                    <div class="dropdown-options">
                        <div class="dropdown-search">
                            <input type="text" class="search-input-dropdown" placeholder="Search customers...">
                        </div>
                        <div class="options-list">
                            ${this.customerOptions.map(option =>
                                `<div class="dropdown-option" data-value="${option.value}" ${option.value === selectedValue ? 'data-selected="true"' : ''}>
                                    ${option.text}
                                </div>`
                            ).join('')}
                        </div>
                    </div>
                </div>
            `;
        } else {
            html = `<select class="customer-select">`;

            this.customerOptions.forEach(option => {
                const selected = option.value === selectedValue ? 'selected' : '';
                html += `<option value="${option.value}" ${selected}>${option.text}</option>`;
            });

            html += '</select>';
        }

        return html;
    }

    initializeCustomerDropdowns() {
        // Initialize all customer dropdowns in the current page
        const customerDropdowns = document.querySelectorAll('.customer-dropdown');

        customerDropdowns.forEach(dropdown => {
            this.setupCustomerDropdown(dropdown);
        });
    }

    setupCustomerDropdown(dropdown) {
        const selected = dropdown.querySelector('.dropdown-selected');
        const options = dropdown.querySelector('.dropdown-options');
        const searchInput = dropdown.querySelector('.search-input-dropdown');
        const dropdownOptions = dropdown.querySelectorAll('.dropdown-option');

        // Toggle dropdown
        selected.addEventListener('click', (e) => {
            e.stopPropagation();

            // Close other dropdowns
            document.querySelectorAll('.customer-dropdown .dropdown-options.show').forEach(other => {
                if (other !== options) {
                    other.classList.remove('show');
                    other.parentElement.querySelector('.dropdown-selected').classList.remove('open');
                }
            });

            options.classList.toggle('show');
            selected.classList.toggle('open');

            if (options.classList.contains('show')) {
                // Position dropdown properly within modal
                this.positionDropdownInModal(dropdown, options);
                searchInput.focus();
            }
        });

        // Search functionality
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();

            dropdownOptions.forEach(option => {
                const text = option.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    option.classList.remove('hidden');
                } else {
                    option.classList.add('hidden');
                }
            });
        });

        // Option selection
        dropdownOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();

                const value = option.dataset.value;
                const text = option.textContent;

                // Update selected display
                selected.dataset.value = value;
                selected.querySelector('.selected-text').textContent = text;

                // Update selected state
                dropdownOptions.forEach(opt => opt.removeAttribute('data-selected'));
                option.setAttribute('data-selected', 'true');

                // Close dropdown
                options.classList.remove('show');
                selected.classList.remove('open');

                // Clear search
                searchInput.value = '';
                dropdownOptions.forEach(opt => opt.classList.remove('hidden'));
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                options.classList.remove('show');
                selected.classList.remove('open');
            }
        });
    }

    positionDropdownInModal(dropdown, options) {
        // Check if dropdown is within a modal
        const modal = dropdown.closest('.modal');
        if (!modal) return;

        const modalBody = modal.querySelector('.view-modal-body');
        const selected = dropdown.querySelector('.dropdown-selected');

        if (modalBody && selected) {
            const selectedRect = selected.getBoundingClientRect();
            const modalBodyRect = modalBody.getBoundingClientRect();

            // Check if dropdown is in customer specific table
            const isInCustomerTable = dropdown.closest('.customer-specific-table');

            if (isInCustomerTable) {
                // For customer specific table, use simpler positioning with !important
                options.style.setProperty('position', 'absolute', 'important');
                options.style.setProperty('top', '100%', 'important');
                options.style.setProperty('left', '0', 'important');
                options.style.setProperty('right', '0', 'important');
                options.style.setProperty('z-index', '1150', 'important');
                options.style.setProperty('max-height', '200px', 'important');
                options.style.setProperty('overflow-y', 'auto', 'important');

                // Also ensure the dropdown container has relative positioning
                const dropdownContainer = dropdown.closest('.customer-dropdown-container');
                if (dropdownContainer) {
                    dropdownContainer.style.setProperty('position', 'relative', 'important');
                }

                return;
            }

            // Calculate available space below and above
            const spaceBelow = modalBodyRect.bottom - selectedRect.bottom;
            const spaceAbove = selectedRect.top - modalBodyRect.top;

            // If not enough space below, position above
            if (spaceBelow < 300 && spaceAbove > spaceBelow) {
                options.style.top = 'auto';
                options.style.bottom = '100%';
                options.style.maxHeight = Math.min(250, spaceAbove - 10) + 'px';
            } else {
                options.style.top = '100%';
                options.style.bottom = 'auto';
                options.style.maxHeight = Math.min(250, spaceBelow - 10) + 'px';
            }
        }
    }

    deleteSelectedOrders() {
        if (this.selectedOrders.size === 0) {
            alert('Please select orders to delete');
            return;
        }

        if (confirm(`Are you sure you want to delete ${this.selectedOrders.size} selected order(s)?`)) {
            this.showLoading();

            setTimeout(() => {
                this.orders = this.orders.filter(order => !this.selectedOrders.has(order.id));
                this.filteredOrders = [...this.orders];
                this.selectedOrders.clear();
                this.renderTable();
                this.updatePagination();
                this.updateDashboard();
                this.hideLoading();

                this.showNotification('Selected orders deleted successfully');
            }, 1000);
        }
    }

    refreshData() {
        this.showLoading();

        setTimeout(() => {
            // Simulate data refresh
            this.filteredOrders = [...this.orders];
            this.selectedOrders.clear();
            this.renderTable();
            this.updatePagination();
            this.hideLoading();

            this.showNotification('Data refreshed successfully');
        }, 1000);
    }

    exportData() {
        const csvContent = this.generateCSV();
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'customer_order_classes.csv';
        a.click();
        window.URL.revokeObjectURL(url);

        this.showNotification('Data exported successfully');
    }

    generateCSV() {
        const headers = ['Description', 'Lead Time', 'Discount', 'Consider For Demand', 'Asset Validated', 'Active'];
        const rows = this.filteredOrders.map(order => [
            order.description,
            order.leadTime,
            order.discount,
            order.considerForDemand ? 'Yes' : 'No',
            order.assetValidated ? 'Yes' : 'No',
            order.isActive ? 'Yes' : 'No'
        ]);

        return [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
    }

    showAdvancedSearch() {
        this.openAdvancedSearchModal();
    }

    openAdvancedSearchModal() {
        const modal = document.getElementById('advancedSearchModal');
        modal.classList.add('show');
        this.bindAdvancedSearchEvents();
    }

    closeAdvancedSearchModal() {
        const modal = document.getElementById('advancedSearchModal');
        modal.classList.remove('show');
    }

    bindAdvancedSearchEvents() {
        // Close modal events
        document.getElementById('closeAdvancedSearchModal').addEventListener('click', () => {
            this.closeAdvancedSearchModal();
        });

        document.getElementById('cancelAdvancedSearch').addEventListener('click', () => {
            this.closeAdvancedSearchModal();
        });

        // Click outside modal to close
        document.getElementById('advancedSearchModal').addEventListener('click', (e) => {
            if (e.target.id === 'advancedSearchModal') {
                this.closeAdvancedSearchModal();
            }
        });

        // Clear all button
        document.getElementById('clearAdvancedSearch').addEventListener('click', () => {
            this.clearAdvancedSearchForm();
        });

        // Apply search button
        document.getElementById('applyAdvancedSearch').addEventListener('click', () => {
            this.applyAdvancedSearch();
        });

        // Quick filter buttons
        document.querySelectorAll('.quick-filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.applyQuickFilter(e.target.closest('.quick-filter-btn').dataset.filter);
            });
        });
    }

    clearAdvancedSearchForm() {
        // Clear text inputs
        document.getElementById('searchDescription').value = '';
        document.getElementById('leadTimeMin').value = '';
        document.getElementById('leadTimeMax').value = '';
        document.getElementById('discountMin').value = '';
        document.getElementById('discountMax').value = '';

        // Reset selects
        document.getElementById('searchOperator').value = 'contains';
        document.getElementById('sortBy').value = 'description';
        document.getElementById('sortOrder').value = 'asc';

        // Reset radio buttons
        document.querySelectorAll('input[name="considerForDemandFilter"]').forEach(radio => {
            radio.checked = radio.value === 'all';
        });
        document.querySelectorAll('input[name="assetValidatedFilter"]').forEach(radio => {
            radio.checked = radio.value === 'all';
        });
        document.querySelectorAll('input[name="activeStatusFilter"]').forEach(radio => {
            radio.checked = radio.value === 'all';
        });

        // Clear quick filter active states
        document.querySelectorAll('.quick-filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
    }

    applyAdvancedSearch() {
        const criteria = this.getAdvancedSearchCriteria();
        this.filteredOrders = this.filterOrdersAdvanced(criteria);
        this.currentPage = 1;
        this.renderTable();
        this.updatePagination();
        this.updateDashboard();
        this.closeAdvancedSearchModal();
        this.showNotification(`Advanced search applied. Found ${this.filteredOrders.length} results.`);
    }

    getAdvancedSearchCriteria() {
        return {
            description: document.getElementById('searchDescription').value.trim(),
            searchOperator: document.getElementById('searchOperator').value,
            leadTimeMin: document.getElementById('leadTimeMin').value ? parseInt(document.getElementById('leadTimeMin').value) : null,
            leadTimeMax: document.getElementById('leadTimeMax').value ? parseInt(document.getElementById('leadTimeMax').value) : null,
            discountMin: document.getElementById('discountMin').value ? parseFloat(document.getElementById('discountMin').value) : null,
            discountMax: document.getElementById('discountMax').value ? parseFloat(document.getElementById('discountMax').value) : null,
            considerForDemand: document.querySelector('input[name="considerForDemandFilter"]:checked').value,
            assetValidated: document.querySelector('input[name="assetValidatedFilter"]:checked').value,
            activeStatus: document.querySelector('input[name="activeStatusFilter"]:checked').value,
            sortBy: document.getElementById('sortBy').value,
            sortOrder: document.getElementById('sortOrder').value
        };
    }

    filterOrdersAdvanced(criteria) {
        let filtered = [...this.orders];

        // Description filter
        if (criteria.description) {
            const searchTerm = criteria.description.toLowerCase();
            filtered = filtered.filter(order => {
                const desc = order.description.toLowerCase();
                switch (criteria.searchOperator) {
                    case 'contains':
                        return desc.includes(searchTerm);
                    case 'starts':
                        return desc.startsWith(searchTerm);
                    case 'ends':
                        return desc.endsWith(searchTerm);
                    case 'exact':
                        return desc === searchTerm;
                    default:
                        return desc.includes(searchTerm);
                }
            });
        }

        // Lead time range filter
        if (criteria.leadTimeMin !== null || criteria.leadTimeMax !== null) {
            filtered = filtered.filter(order => {
                const leadTime = order.leadTime;
                const minCheck = criteria.leadTimeMin === null || leadTime >= criteria.leadTimeMin;
                const maxCheck = criteria.leadTimeMax === null || leadTime <= criteria.leadTimeMax;
                return minCheck && maxCheck;
            });
        }

        // Discount range filter
        if (criteria.discountMin !== null || criteria.discountMax !== null) {
            filtered = filtered.filter(order => {
                const discount = order.discount;
                const minCheck = criteria.discountMin === null || discount >= criteria.discountMin;
                const maxCheck = criteria.discountMax === null || discount <= criteria.discountMax;
                return minCheck && maxCheck;
            });
        }

        // Status filters
        if (criteria.considerForDemand !== 'all') {
            const shouldConsider = criteria.considerForDemand === 'yes';
            filtered = filtered.filter(order => order.considerForDemand === shouldConsider);
        }

        if (criteria.assetValidated !== 'all') {
            const shouldValidate = criteria.assetValidated === 'yes';
            filtered = filtered.filter(order => order.assetValidated === shouldValidate);
        }

        if (criteria.activeStatus !== 'all') {
            const shouldBeActive = criteria.activeStatus === 'active';
            filtered = filtered.filter(order => order.isActive === shouldBeActive);
        }

        // Sort results
        filtered.sort((a, b) => {
            let aValue = a[criteria.sortBy];
            let bValue = b[criteria.sortBy];

            // Handle boolean values
            if (typeof aValue === 'boolean') {
                aValue = aValue ? 1 : 0;
                bValue = bValue ? 1 : 0;
            }

            // Handle string values
            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            let comparison = 0;
            if (aValue < bValue) comparison = -1;
            if (aValue > bValue) comparison = 1;

            return criteria.sortOrder === 'desc' ? -comparison : comparison;
        });

        return filtered;
    }

    applyQuickFilter(filterType) {
        // Toggle active state
        const btn = document.querySelector(`[data-filter="${filterType}"]`);
        const isActive = btn.classList.contains('active');

        // Clear all active states first
        document.querySelectorAll('.quick-filter-btn').forEach(b => b.classList.remove('active'));

        if (!isActive) {
            btn.classList.add('active');

            // Apply the quick filter
            switch (filterType) {
                case 'high-discount':
                    this.filteredOrders = this.orders.filter(order => order.discount > 10);
                    break;
                case 'long-lead-time':
                    this.filteredOrders = this.orders.filter(order => order.leadTime > 7);
                    break;
                case 'active-validated':
                    this.filteredOrders = this.orders.filter(order => order.isActive && order.assetValidated);
                    break;
                case 'demand-items':
                    this.filteredOrders = this.orders.filter(order => order.considerForDemand);
                    break;
            }
        } else {
            // If deactivating, show all orders
            this.filteredOrders = [...this.orders];
        }

        this.currentPage = 1;
        this.renderTable();
        this.updatePagination();
        this.updateDashboard();
        this.closeAdvancedSearchModal();

        if (!isActive) {
            this.showNotification(`Quick filter applied. Found ${this.filteredOrders.length} results.`);
        } else {
            this.showNotification('Filter cleared. Showing all orders.');
        }
    }

    showLoading() {
        document.getElementById('loadingOverlay').classList.add('show');
    }

    hideLoading() {
        document.getElementById('loadingOverlay').classList.remove('show');
    }

    showNotification(message) {
        // Simple notification - in a real app, you'd use a proper notification system
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4caf50;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Dashboard Methods
    initializeDashboard() {
        this.updateSummaryCards();
        this.createStatusChart();
        this.createLeadTimeChart();
        this.bindDashboardEvents();
    }

    bindDashboardEvents() {
        // Summary card click events
        document.getElementById('totalRecords').closest('.summary-card').addEventListener('click', () => {
            this.filterByDashboardCard('total');
        });

        document.getElementById('demandRecords').closest('.summary-card').addEventListener('click', () => {
            this.filterByDashboardCard('demand');
        });

        document.getElementById('validatedRecords').closest('.summary-card').addEventListener('click', () => {
            this.filterByDashboardCard('validated');
        });

        document.getElementById('activeRecords').closest('.summary-card').addEventListener('click', () => {
            this.filterByDashboardCard('active');
        });

        document.getElementById('avgDiscount').closest('.summary-card').addEventListener('click', () => {
            this.filterByDashboardCard('discount');
        });

        document.getElementById('avgLeadTime').closest('.summary-card').addEventListener('click', () => {
            this.filterByDashboardCard('leadtime');
        });
    }

    updateSummaryCards() {
        const stats = this.calculateStatistics();

        document.getElementById('totalRecords').textContent = stats.total;
        document.getElementById('demandRecords').textContent = stats.demand;
        document.getElementById('validatedRecords').textContent = stats.validated;
        document.getElementById('activeRecords').textContent = stats.active;
        document.getElementById('avgDiscount').textContent = stats.avgDiscount + '%';
        document.getElementById('avgLeadTime').textContent = stats.avgLeadTime;
    }

    calculateStatistics() {
        const data = this.filteredOrders.length > 0 ? this.filteredOrders : this.orders;

        const total = data.length;
        const demand = data.filter(order => order.considerForDemand).length;
        const validated = data.filter(order => order.assetValidated).length;
        const active = data.filter(order => order.isActive).length;

        const totalDiscount = data.reduce((sum, order) => sum + order.discount, 0);
        const avgDiscount = total > 0 ? (totalDiscount / total).toFixed(1) : 0;

        const totalLeadTime = data.reduce((sum, order) => sum + order.leadTime, 0);
        const avgLeadTime = total > 0 ? Math.round(totalLeadTime / total) : 0;

        return {
            total,
            demand,
            validated,
            active,
            avgDiscount,
            avgLeadTime
        };
    }

    createStatusChart() {
        const ctx = document.getElementById('statusChart').getContext('2d');
        const stats = this.calculateStatistics();

        // Destroy existing chart if it exists
        if (this.statusChart) {
            this.statusChart.destroy();
        }

        this.statusChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Active', 'Inactive', 'Consider for Demand', 'Asset Validated'],
                datasets: [{
                    data: [
                        stats.active,
                        stats.total - stats.active,
                        stats.demand,
                        stats.validated
                    ],
                    backgroundColor: [
                        '#06d6a0',
                        '#ef4444',
                        '#10b981',
                        '#8b5cf6'
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                onClick: (event, elements) => {
                    if (elements.length > 0) {
                        const elementIndex = elements[0].index;
                        const labels = ['Active', 'Inactive', 'Consider for Demand', 'Asset Validated'];
                        const clickedLabel = labels[elementIndex];
                        this.filterByStatusType(clickedLabel);
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            usePointStyle: true,
                            font: {
                                size: 12
                            }
                        },
                        onClick: (event, legendItem) => {
                            const label = legendItem.text;
                            this.filterByStatusType(label);
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value} (${percentage}%) - Click to filter`;
                            }
                        }
                    }
                }
            }
        });
    }

    createLeadTimeChart() {
        const ctx = document.getElementById('leadTimeChart').getContext('2d');
        const data = this.filteredOrders.length > 0 ? this.filteredOrders : this.orders;

        // Group by lead time ranges
        const ranges = {
            '0 days': 0,
            '1-3 days': 0,
            '4-7 days': 0,
            '8-14 days': 0,
            '15+ days': 0
        };

        data.forEach(order => {
            const leadTime = order.leadTime;
            if (leadTime === 0) {
                ranges['0 days']++;
            } else if (leadTime <= 3) {
                ranges['1-3 days']++;
            } else if (leadTime <= 7) {
                ranges['4-7 days']++;
            } else if (leadTime <= 14) {
                ranges['8-14 days']++;
            } else {
                ranges['15+ days']++;
            }
        });

        // Destroy existing chart if it exists
        if (this.leadTimeChart) {
            this.leadTimeChart.destroy();
        }

        this.leadTimeChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(ranges),
                datasets: [{
                    label: 'Number of Orders',
                    data: Object.values(ranges),
                    backgroundColor: [
                        '#3b82f6',
                        '#10b981',
                        '#f59e0b',
                        '#ef4444',
                        '#8b5cf6'
                    ],
                    borderColor: [
                        '#2563eb',
                        '#059669',
                        '#d97706',
                        '#dc2626',
                        '#7c3aed'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                onClick: (event, elements) => {
                    if (elements.length > 0) {
                        const elementIndex = elements[0].index;
                        const labels = Object.keys(ranges);
                        const clickedLabel = labels[elementIndex];
                        this.filterByLeadTimeRange(clickedLabel);
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.parsed.y} orders - Click to filter`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    updateDashboard() {
        this.updateSummaryCards();
        this.createStatusChart();
        this.createLeadTimeChart();
    }

    filterByDashboardCard(filterType) {
        // Clear any existing search
        document.getElementById('searchInput').value = '';

        // Apply filter based on card type
        switch (filterType) {
            case 'total':
                this.filteredOrders = [...this.orders];
                this.showNotification('Showing all records');
                break;

            case 'demand':
                this.filteredOrders = this.orders.filter(order => order.considerForDemand);
                this.showNotification(`Showing ${this.filteredOrders.length} records considered for demand`);
                break;

            case 'validated':
                this.filteredOrders = this.orders.filter(order => order.assetValidated);
                this.showNotification(`Showing ${this.filteredOrders.length} asset validated records`);
                break;

            case 'active':
                this.filteredOrders = this.orders.filter(order => order.isActive);
                this.showNotification(`Showing ${this.filteredOrders.length} active records`);
                break;

            case 'discount':
                // Show orders with above average discount
                const avgDiscount = this.calculateStatistics().avgDiscount;
                this.filteredOrders = this.orders.filter(order => order.discount > avgDiscount);
                this.showNotification(`Showing ${this.filteredOrders.length} records with above average discount (>${avgDiscount}%)`);
                break;

            case 'leadtime':
                // Show orders with above average lead time
                const avgLeadTime = this.calculateStatistics().avgLeadTime;
                this.filteredOrders = this.orders.filter(order => order.leadTime > avgLeadTime);
                this.showNotification(`Showing ${this.filteredOrders.length} records with above average lead time (>${avgLeadTime} days)`);
                break;
        }

        // Update the grid and pagination
        this.currentPage = 1;
        this.renderTable();
        this.updatePagination();
        this.updateDashboard();

        // Scroll to grid
        this.scrollToGrid();
    }

    filterByLeadTimeRange(rangeLabel) {
        // Clear any existing search
        document.getElementById('searchInput').value = '';

        // Apply filter based on lead time range
        switch (rangeLabel) {
            case '0 days':
                this.filteredOrders = this.orders.filter(order => order.leadTime === 0);
                break;
            case '1-3 days':
                this.filteredOrders = this.orders.filter(order => order.leadTime >= 1 && order.leadTime <= 3);
                break;
            case '4-7 days':
                this.filteredOrders = this.orders.filter(order => order.leadTime >= 4 && order.leadTime <= 7);
                break;
            case '8-14 days':
                this.filteredOrders = this.orders.filter(order => order.leadTime >= 8 && order.leadTime <= 14);
                break;
            case '15+ days':
                this.filteredOrders = this.orders.filter(order => order.leadTime >= 15);
                break;
        }

        // Update the grid and pagination
        this.currentPage = 1;
        this.renderTable();
        this.updatePagination();
        this.updateDashboard();

        this.showNotification(`Showing ${this.filteredOrders.length} records with ${rangeLabel} lead time`);

        // Scroll to grid
        this.scrollToGrid();
    }

    filterByStatusType(statusType) {
        // Clear any existing search
        document.getElementById('searchInput').value = '';

        // Apply filter based on status type
        switch (statusType) {
            case 'Active':
                this.filteredOrders = this.orders.filter(order => order.isActive);
                break;
            case 'Inactive':
                this.filteredOrders = this.orders.filter(order => !order.isActive);
                break;
            case 'Consider for Demand':
                this.filteredOrders = this.orders.filter(order => order.considerForDemand);
                break;
            case 'Asset Validated':
                this.filteredOrders = this.orders.filter(order => order.assetValidated);
                break;
        }

        // Update the grid and pagination
        this.currentPage = 1;
        this.renderTable();
        this.updatePagination();
        this.updateDashboard();

        this.showNotification(`Showing ${this.filteredOrders.length} ${statusType.toLowerCase()} records`);

        // Scroll to grid
        this.scrollToGrid();
    }

    scrollToGrid() {
        // Smooth scroll to the grid section
        const gridSection = document.querySelector('.main-content');
        if (gridSection) {
            gridSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new OrderClassManager();
});

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
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
document.head.appendChild(style);
