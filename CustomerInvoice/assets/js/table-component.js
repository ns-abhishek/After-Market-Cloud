// Standardized Table Component for Invoice Management System

class InvoiceTable {
    constructor(containerId, config) {
        this.containerId = containerId;
        this.config = {
            title: config.title || 'Data Table',
            columns: config.columns || [],
            data: config.data || [],
            actions: config.actions || ['view'],
            exportable: config.exportable !== false,
            searchable: config.searchable !== false,
            filterable: config.filterable !== false,
            pagination: config.pagination !== false,
            pageSize: config.pageSize || 25,
            ...config
        };
        this.currentData = [...this.config.data];
        this.filteredData = [...this.config.data];
        this.currentPage = 1;
        this.currentView = this.config.defaultView || (this.config.cardViewEnabled ? 'table' : 'table'); // Use defaultView if specified
        this.init();
    }

    init() {
        this.render();
        this.attachEventListeners();
        this.updateTable();
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container with ID ${this.containerId} not found`);
            return;
        }

        container.innerHTML = `
            <div class="invoice-table-wrapper">
                ${this.renderControls()}
                ${this.renderTable()}
                ${this.renderPagination()}
            </div>
        `;
    }

    renderControls() {
        if (!this.config.searchable && !this.config.filterable && !this.config.exportable) {
            return '';
        }

        return `
            <div class="table-controls mb-3">
                <div class="row g-3 align-items-center">
                    ${this.config.searchable ? `
                        <div class="col-md-4">
                            <div class="input-group">
                                <span class="input-group-text"><i class="fas fa-search"></i></span>
                                <input type="text" class="form-control" id="${this.containerId}_search"
                                       placeholder="Search all columns..." />
                            </div>
                        </div>
                    ` : ''}

                    ${this.config.filterable ? `
                        <div class="col-md-3">
                            <select class="form-select" id="${this.containerId}_filter">
                                <option value="">All Records</option>
                                <option value="active">Active</option>
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="cash">Cash</option>
                                <option value="card">Card</option>
                                <option value="bank">Bank Transfer</option>
                                <option value="manual">Manual</option>
                                <option value="automatic">Automatic</option>
                                <option value="system">System</option>
                            </select>
                        </div>
                    ` : ''}

                    <div class="col-md-2">
                        <button class="btn btn-outline-secondary w-100" onclick="invoiceTable_${this.containerId}.clearFilters()">
                            <i class="fas fa-times me-1"></i>Clear
                        </button>
                    </div>

                    ${this.config.cardViewEnabled ? `
                        <div class="col-md-3">
                            <div class="btn-group w-100" role="group">
                                <button type="button" class="btn btn-outline-primary ${this.currentView === 'table' ? 'active' : ''}"
                                        onclick="invoiceTable_${this.containerId}.switchView('table')" id="${this.containerId}_tableViewBtn">
                                    <i class="fas fa-table me-1"></i>Table
                                </button>
                                <button type="button" class="btn btn-outline-primary ${this.currentView === 'card' ? 'active' : ''}"
                                        onclick="invoiceTable_${this.containerId}.switchView('card')" id="${this.containerId}_cardViewBtn">
                                    <i class="fas fa-th-large me-1"></i>Cards
                                </button>
                            </div>
                        </div>
                    ` : ''}

                    ${this.config.exportable ? `
                        <div class="col-md-3">
                            <div class="btn-group w-100" role="group">
                                <button type="button" class="btn btn-outline-success"
                                        onclick="invoiceTable_${this.containerId}.export('pdf')">
                                    <i class="fas fa-file-pdf me-1"></i>PDF
                                </button>
                                <button type="button" class="btn btn-outline-success"
                                        onclick="invoiceTable_${this.containerId}.export('excel')">
                                    <i class="fas fa-file-excel me-1"></i>Excel
                                </button>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    renderTable() {
        return `
            <!-- Table View -->
            <div id="${this.containerId}_tableView" class="view-container" style="display: ${this.currentView === 'table' ? 'block' : 'none'}">
                <div class="table-responsive">
                    <table class="table table-striped table-hover" id="${this.containerId}_table">
                        <thead class="table-dark">
                            <tr>
                                ${this.config.actions.length > 0 ? '<th width="120">Actions</th>' : ''}
                                ${this.config.columns.map(col =>
                                    `<th class="${col.sortable !== false ? 'sortable' : ''}"
                                         data-column="${col.key}">${col.label}</th>`
                                ).join('')}
                            </tr>
                        </thead>
                        <tbody id="${this.containerId}_tbody">
                            <!-- Data will be populated here -->
                        </tbody>
                    </table>
                </div>
            </div>

            ${this.config.cardViewEnabled ? `
                <!-- Card View -->
                <div id="${this.containerId}_cardView" class="view-container" style="display: ${this.currentView === 'card' ? 'block' : 'none'}">
                    <div class="row g-3" id="${this.containerId}_cardContainer">
                        <!-- Cards will be populated here -->
                    </div>
                </div>
            ` : ''}

            <div class="table-info mt-2">
                <small class="text-muted" id="${this.containerId}_info">
                    Showing 0 to 0 of 0 entries
                </small>
            </div>
        `;
    }

    renderPagination() {
        if (!this.config.pagination) return '';

        return `
            <nav aria-label="Table pagination" class="mt-3">
                <ul class="pagination justify-content-center" id="${this.containerId}_pagination">
                    <!-- Pagination will be generated here -->
                </ul>
            </nav>
        `;
    }

    attachEventListeners() {
        // Search functionality
        if (this.config.searchable) {
            const searchInput = document.getElementById(`${this.containerId}_search`);
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    this.search(e.target.value);
                });
            }
        }

        // Filter functionality
        if (this.config.filterable) {
            const filterSelect = document.getElementById(`${this.containerId}_filter`);
            if (filterSelect) {
                filterSelect.addEventListener('change', (e) => {
                    this.filter(e.target.value);
                });
            }
        }

        // Column sorting
        const table = document.getElementById(`${this.containerId}_table`);
        if (table) {
            table.addEventListener('click', (e) => {
                if (e.target.closest('th.sortable')) {
                    const column = e.target.closest('th').dataset.column;
                    this.sort(column);
                }
            });
        }
    }

    updateTable() {
        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.config.pageSize;
        const endIndex = startIndex + this.config.pageSize;
        const pageData = this.filteredData.slice(startIndex, endIndex);

        if (this.currentView === 'table') {
            const tbody = document.getElementById(`${this.containerId}_tbody`);
            if (tbody) {
                tbody.innerHTML = pageData.map(row => this.renderRow(row)).join('');
            }
        } else if (this.currentView === 'card' && this.config.cardViewEnabled) {
            const cardContainer = document.getElementById(`${this.containerId}_cardContainer`);
            if (cardContainer) {
                cardContainer.innerHTML = pageData.map(row => this.renderCard(row)).join('');
            }
        }

        // Update info
        this.updateInfo();

        // Update pagination
        if (this.config.pagination) {
            this.updatePagination();
        }
    }

    renderRow(row) {
        const actionButtons = this.config.actions.map(action => {
            const actionConfig = {
                view: { icon: 'fas fa-eye', class: 'btn-outline-primary', title: 'View Details' }
            };

            const config = actionConfig[action];
            if (!config) return '';

            return `
                <button class="btn btn-sm ${config.class} me-1"
                        onclick="invoiceTable_${this.containerId}.handleAction('${action}', '${row.id}')"
                        title="${config.title}">
                    <i class="${config.icon}"></i>
                </button>
            `;
        }).join('');

        const cells = this.config.columns.map(col => {
            let value = row[col.key] || '';

            // Apply formatting if specified
            if (col.format) {
                value = col.format(value, row);
            }

            return `<td>${value}</td>`;
        }).join('');

        return `
            <tr data-id="${row.id}">
                ${this.config.actions.length > 0 ? `<td>${actionButtons}</td>` : ''}
                ${cells}
            </tr>
        `;
    }

    renderCard(row) {
        if (!this.config.cardViewEnabled) return '';

        const actionButtons = this.config.actions.map(action => {
            const actionConfig = {
                view: { icon: 'fas fa-eye', class: 'btn-outline-primary', title: 'View Details' }
            };

            const config = actionConfig[action];
            if (!config) return '';

            return `
                <button class="btn btn-sm ${config.class} me-1"
                        onclick="invoiceTable_${this.containerId}.handleAction('${action}', '${row.id}')"
                        title="${config.title}">
                    <i class="${config.icon}"></i>
                </button>
            `;
        }).join('');

        const cardFields = this.config.columns.slice(0, 4).map(col => {
            let value = row[col.key] || '';
            if (col.format) {
                value = col.format(value, row);
            }

            return `
                <div class="card-field">
                    <small class="text-muted">${col.label}</small>
                    <div>${value}</div>
                </div>
            `;
        }).join('');

        return `
            <div class="col-sm-6 col-md-4 col-lg-3">
                <div class="card h-100" data-id="${row.id}">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h6 class="card-title mb-0">${row.id}</h6>
                            <div class="card-actions">
                                ${actionButtons}
                            </div>
                        </div>
                        ${cardFields}
                    </div>
                </div>
            </div>
        `;
    }

    switchView(viewType) {
        if (!this.config.cardViewEnabled) return;

        this.currentView = viewType;

        // Update view containers
        const tableView = document.getElementById(`${this.containerId}_tableView`);
        const cardView = document.getElementById(`${this.containerId}_cardView`);

        if (tableView && cardView) {
            if (viewType === 'table') {
                tableView.style.display = 'block';
                cardView.style.display = 'none';
            } else {
                tableView.style.display = 'none';
                cardView.style.display = 'block';
            }
        }

        // Update button states
        const tableBtn = document.getElementById(`${this.containerId}_tableViewBtn`);
        const cardBtn = document.getElementById(`${this.containerId}_cardViewBtn`);

        if (tableBtn && cardBtn) {
            tableBtn.classList.toggle('active', viewType === 'table');
            cardBtn.classList.toggle('active', viewType === 'card');
        }

        // Re-render data for the new view
        this.updateTable();

        // Store preference
        if (this.config.cardViewEnabled) {
            sessionStorage.setItem(`${this.containerId}_view`, viewType);
        }
    }



    search(term) {
        if (!term.trim()) {
            this.filteredData = [...this.currentData];
        } else {
            const searchTerm = term.toLowerCase();
            this.filteredData = this.currentData.filter(row => {
                return this.config.columns.some(col => {
                    const value = String(row[col.key] || '').toLowerCase();
                    return value.includes(searchTerm);
                });
            });
        }
        this.currentPage = 1;
        this.updateTable();
    }

    filter(filterValue) {
        if (!filterValue) {
            this.filteredData = [...this.currentData];
        } else {
            this.filteredData = this.currentData.filter(row => {
                // Check multiple possible status/type fields
                const statusFields = [
                    row.status,
                    row.sapStatus,
                    row.paymentMode,
                    row.generatedThrough,
                    row.returnType,
                    row.branch
                ];

                return statusFields.some(field =>
                    field && String(field).toLowerCase().includes(filterValue.toLowerCase())
                );
            });
        }
        this.currentPage = 1;
        this.updateTable();
    }

    sort(columnKey) {
        // Toggle sort direction
        if (this.lastSortColumn === columnKey) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortDirection = 'asc';
        }
        this.lastSortColumn = columnKey;

        this.filteredData.sort((a, b) => {
            let aVal = a[columnKey] || '';
            let bVal = b[columnKey] || '';

            // Handle different data types
            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        this.updateTable();
    }

    clearFilters() {
        // Clear search
        const searchInput = document.getElementById(`${this.containerId}_search`);
        if (searchInput) searchInput.value = '';

        // Clear filter
        const filterSelect = document.getElementById(`${this.containerId}_filter`);
        if (filterSelect) filterSelect.value = '';

        // Reset data
        this.filteredData = [...this.currentData];
        this.currentPage = 1;
        this.updateTable();

        showToast('Filters cleared', 'info');
    }

    export(format) {
        const data = {
            headers: this.config.columns.map(col => col.label),
            rows: this.filteredData.map(row =>
                this.config.columns.map(col => row[col.key] || '')
            )
        };

        if (format === 'pdf') {
            exportToPDF(data, this.config.title);
        } else if (format === 'excel') {
            exportToExcel(data, this.config.title);
        }
    }

    handleAction(action, id) {
        const row = this.currentData.find(r => r.id === id);
        if (!row) return;

        if (action === 'view') {
            this.onView(row);
        }
    }

    onView(row) {
        if (this.config.onView) {
            this.config.onView(row);
        } else {
            // Create and show detail modal
            this.showDetailModal(row);
        }
    }

    showDetailModal(row) {
        const modal = this.createDetailModal(row);
        document.body.appendChild(modal);
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();

        // Clean up modal when closed
        modal.addEventListener('hidden.bs.modal', function() {
            document.body.removeChild(modal);
        });
    }

    createDetailModal(row) {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'detailModal';
        modal.tabIndex = -1;

        const fields = this.config.columns.map(col => {
            let value = row[col.key] || 'N/A';
            if (col.format) {
                // Strip HTML tags for modal display
                value = col.format(row[col.key], row).replace(/<[^>]*>/g, '');
            }

            return `
                <div class="row mb-2">
                    <div class="col-4"><strong>${col.label}:</strong></div>
                    <div class="col-8">${value}</div>
                </div>
            `;
        }).join('');

        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Record Details - ${row.id}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        ${fields}
                    </div>
                    <div class="modal-footer">
                        ${this.config.exportable ? `
                            <button type="button" class="btn btn-outline-success" onclick="invoiceTable_${this.containerId}.export('pdf')">
                                <i class="fas fa-file-pdf me-1"></i>Export PDF
                            </button>
                            <button type="button" class="btn btn-outline-success" onclick="invoiceTable_${this.containerId}.export('excel')">
                                <i class="fas fa-file-excel me-1"></i>Export Excel
                            </button>
                        ` : ''}
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        `;

        return modal;
    }

    updateInfo() {
        const info = document.getElementById(`${this.containerId}_info`);
        if (!info) return;

        const startIndex = (this.currentPage - 1) * this.config.pageSize + 1;
        const endIndex = Math.min(startIndex + this.config.pageSize - 1, this.filteredData.length);
        const total = this.filteredData.length;

        info.textContent = `Showing ${startIndex} to ${endIndex} of ${total} entries`;
    }

    updatePagination() {
        const pagination = document.getElementById(`${this.containerId}_pagination`);
        if (!pagination) return;

        const totalPages = Math.ceil(this.filteredData.length / this.config.pageSize);

        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let paginationHTML = '';

        // Previous button
        paginationHTML += `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="invoiceTable_${this.containerId}.goToPage(${this.currentPage - 1})">Previous</a>
            </li>
        `;

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                paginationHTML += `
                    <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                        <a class="page-link" href="#" onclick="invoiceTable_${this.containerId}.goToPage(${i})">${i}</a>
                    </li>
                `;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                paginationHTML += '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
        }

        // Next button
        paginationHTML += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="invoiceTable_${this.containerId}.goToPage(${this.currentPage + 1})">Next</a>
            </li>
        `;

        pagination.innerHTML = paginationHTML;
    }

    goToPage(page) {
        const totalPages = Math.ceil(this.filteredData.length / this.config.pageSize);
        if (page < 1 || page > totalPages) return;

        this.currentPage = page;
        this.updateTable();
    }

    // Public methods for external use
    setData(data) {
        this.currentData = [...data];
        this.filteredData = [...data];
        this.currentPage = 1;
        this.updateTable();
    }

    addRow(row) {
        this.currentData.push(row);
        this.filteredData.push(row);
        this.updateTable();
    }

    removeRow(id) {
        this.currentData = this.currentData.filter(r => r.id !== id);
        this.filteredData = this.filteredData.filter(r => r.id !== id);
        this.updateTable();
    }

    updateRow(id, newData) {
        const index = this.currentData.findIndex(r => r.id === id);
        if (index !== -1) {
            this.currentData[index] = { ...this.currentData[index], ...newData };
            const filteredIndex = this.filteredData.findIndex(r => r.id === id);
            if (filteredIndex !== -1) {
                this.filteredData[filteredIndex] = { ...this.filteredData[filteredIndex], ...newData };
            }
            this.updateTable();
        }
    }
}

// Global registry for table instances
window.invoiceTables = {};

// Helper function to create and register table instances
function createInvoiceTable(containerId, config) {
    const table = new InvoiceTable(containerId, config);
    window.invoiceTables[containerId] = table;
    window[`invoiceTable_${containerId}`] = table; // For onclick handlers
    return table;
}
