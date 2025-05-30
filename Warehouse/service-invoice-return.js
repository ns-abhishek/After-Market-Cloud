// Service Invoice Return Application
class ServiceInvoiceReturnApp {
    constructor() {
        this.serviceInvoices = [
            { id: 1, serviceInvoiceReturn: "SIR-2024-001", customerInvoice: "CI-2024-001", serviceInvoiceReturnDate: "2024-01-15", isFullReturn: true, serial: "SN001234567", model: "HCL-WS-2024", name: "Workstation Pro", generatedThrough: "Manual", creditIrn: "CRN-2024-001", creditIrnGeneratedDate: "2024-01-16" },
            { id: 2, serviceInvoiceReturn: "SIR-2024-002", customerInvoice: "CI-2024-002", serviceInvoiceReturnDate: "2024-01-16", isFullReturn: false, serial: "SN001234568", model: "HCL-LT-2024", name: "Laptop Elite", generatedThrough: "Automated", creditIrn: "CRN-2024-002", creditIrnGeneratedDate: "2024-01-17" },
            { id: 3, serviceInvoiceReturn: "SIR-2024-003", customerInvoice: "CI-2024-003", serviceInvoiceReturnDate: "2024-01-17", isFullReturn: true, serial: "SN001234569", model: "HCL-SV-2024", name: "Server Enterprise", generatedThrough: "Manual", creditIrn: "CRN-2024-003", creditIrnGeneratedDate: "2024-01-18" },
            { id: 4, serviceInvoiceReturn: "SIR-2024-004", customerInvoice: "CI-2024-004", serviceInvoiceReturnDate: "2024-01-18", isFullReturn: false, serial: "SN001234570", model: "HCL-TB-2024", name: "Tablet Business", generatedThrough: "Automated", creditIrn: "CRN-2024-004", creditIrnGeneratedDate: "2024-01-19" },
            { id: 5, serviceInvoiceReturn: "SIR-2024-005", customerInvoice: "CI-2024-005", serviceInvoiceReturnDate: "2024-01-19", isFullReturn: true, serial: "SN001234571", model: "HCL-DT-2024", name: "Desktop Standard", generatedThrough: "Manual", creditIrn: "CRN-2024-005", creditIrnGeneratedDate: "2024-01-20" },
            { id: 6, serviceInvoiceReturn: "SIR-2024-006", customerInvoice: "CI-2024-006", serviceInvoiceReturnDate: "2024-01-20", isFullReturn: false, serial: "SN001234572", model: "HCL-MN-2024", name: "Monitor Ultra", generatedThrough: "Automated", creditIrn: "CRN-2024-006", creditIrnGeneratedDate: "2024-01-21" },
            { id: 7, serviceInvoiceReturn: "SIR-2024-007", customerInvoice: "CI-2024-007", serviceInvoiceReturnDate: "2024-01-21", isFullReturn: true, serial: "SN001234573", model: "HCL-PR-2024", name: "Printer Laser", generatedThrough: "Manual", creditIrn: "CRN-2024-007", creditIrnGeneratedDate: "2024-01-22" },
            { id: 8, serviceInvoiceReturn: "SIR-2024-008", customerInvoice: "CI-2024-008", serviceInvoiceReturnDate: "2024-01-22", isFullReturn: false, serial: "SN001234574", model: "HCL-SC-2024", name: "Scanner Pro", generatedThrough: "Automated", creditIrn: "CRN-2024-008", creditIrnGeneratedDate: "2024-01-23" },
            { id: 9, serviceInvoiceReturn: "SIR-2024-009", customerInvoice: "CI-2024-009", serviceInvoiceReturnDate: "2024-01-23", isFullReturn: true, serial: "SN001234575", model: "HCL-RT-2024", name: "Router Enterprise", generatedThrough: "Manual", creditIrn: "CRN-2024-009", creditIrnGeneratedDate: "2024-01-24" },
            { id: 10, serviceInvoiceReturn: "SIR-2024-010", customerInvoice: "CI-2024-010", serviceInvoiceReturnDate: "2024-01-24", isFullReturn: false, serial: "SN001234576", model: "HCL-SW-2024", name: "Switch Network", generatedThrough: "Automated", creditIrn: "CRN-2024-010", creditIrnGeneratedDate: "2024-01-25" },
            { id: 11, serviceInvoiceReturn: "SIR-2024-011", customerInvoice: "CI-2024-011", serviceInvoiceReturnDate: "2024-01-25", isFullReturn: true, serial: "SN001234577", model: "HCL-KB-2024", name: "Keyboard Wireless", generatedThrough: "Manual", creditIrn: "CRN-2024-011", creditIrnGeneratedDate: "2024-01-26" },
            { id: 12, serviceInvoiceReturn: "SIR-2024-012", customerInvoice: "CI-2024-012", serviceInvoiceReturnDate: "2024-01-26", isFullReturn: false, serial: "SN001234578", model: "HCL-MS-2024", name: "Mouse Optical", generatedThrough: "Automated", creditIrn: "CRN-2024-012", creditIrnGeneratedDate: "2024-01-27" },
            { id: 13, serviceInvoiceReturn: "SIR-2024-013", customerInvoice: "CI-2024-013", serviceInvoiceReturnDate: "2024-01-27", isFullReturn: true, serial: "SN001234579", model: "HCL-HD-2024", name: "Hard Drive External", generatedThrough: "Manual", creditIrn: "CRN-2024-013", creditIrnGeneratedDate: "2024-01-28" },
            { id: 14, serviceInvoiceReturn: "SIR-2024-014", customerInvoice: "CI-2024-014", serviceInvoiceReturnDate: "2024-01-28", isFullReturn: false, serial: "SN001234580", model: "HCL-USB-2024", name: "USB Drive 64GB", generatedThrough: "Automated", creditIrn: "CRN-2024-014", creditIrnGeneratedDate: "2024-01-29" },
            { id: 15, serviceInvoiceReturn: "SIR-2024-015", customerInvoice: "CI-2024-015", serviceInvoiceReturnDate: "2024-01-29", isFullReturn: true, serial: "SN001234581", model: "HCL-CAM-2024", name: "Webcam HD", generatedThrough: "Manual", creditIrn: "CRN-2024-015", creditIrnGeneratedDate: "2024-01-30" },
            { id: 16, serviceInvoiceReturn: "SIR-2024-016", customerInvoice: "CI-2024-016", serviceInvoiceReturnDate: "2024-01-30", isFullReturn: false, serial: "SN001234582", model: "HCL-SPK-2024", name: "Speakers Bluetooth", generatedThrough: "Automated", creditIrn: "CRN-2024-016", creditIrnGeneratedDate: "2024-01-31" },
            { id: 17, serviceInvoiceReturn: "SIR-2024-017", customerInvoice: "CI-2024-017", serviceInvoiceReturnDate: "2024-01-31", isFullReturn: true, serial: "SN001234583", model: "HCL-MIC-2024", name: "Microphone USB", generatedThrough: "Manual", creditIrn: "CRN-2024-017", creditIrnGeneratedDate: "2024-02-01" },
            { id: 18, serviceInvoiceReturn: "SIR-2024-018", customerInvoice: "CI-2024-018", serviceInvoiceReturnDate: "2024-02-01", isFullReturn: false, serial: "SN001234584", model: "HCL-HUB-2024", name: "USB Hub 4-Port", generatedThrough: "Automated", creditIrn: "CRN-2024-018", creditIrnGeneratedDate: "2024-02-02" },
            { id: 19, serviceInvoiceReturn: "SIR-2024-019", customerInvoice: "CI-2024-019", serviceInvoiceReturnDate: "2024-02-02", isFullReturn: true, serial: "SN001234585", model: "HCL-DOC-2024", name: "Docking Station", generatedThrough: "Manual", creditIrn: "CRN-2024-019", creditIrnGeneratedDate: "2024-02-03" },
            { id: 20, serviceInvoiceReturn: "SIR-2024-020", customerInvoice: "CI-2024-020", serviceInvoiceReturnDate: "2024-02-03", isFullReturn: false, serial: "SN001234586", model: "HCL-CHG-2024", name: "Charger Universal", generatedThrough: "Automated", creditIrn: "CRN-2024-020", creditIrnGeneratedDate: "2024-02-04" },
            { id: 21, serviceInvoiceReturn: "SIR-2024-021", customerInvoice: "CI-2024-021", serviceInvoiceReturnDate: "2024-02-04", isFullReturn: true, serial: "SN001234587", model: "HCL-BAG-2024", name: "Laptop Bag Premium", generatedThrough: "Manual", creditIrn: "CRN-2024-021", creditIrnGeneratedDate: "2024-02-05" },
            { id: 22, serviceInvoiceReturn: "SIR-2024-022", customerInvoice: "CI-2024-022", serviceInvoiceReturnDate: "2024-02-05", isFullReturn: false, serial: "SN001234588", model: "HCL-PAD-2024", name: "Mouse Pad Gaming", generatedThrough: "Automated", creditIrn: "CRN-2024-022", creditIrnGeneratedDate: "2024-02-06" },
            { id: 23, serviceInvoiceReturn: "SIR-2024-023", customerInvoice: "CI-2024-023", serviceInvoiceReturnDate: "2024-02-06", isFullReturn: true, serial: "SN001234589", model: "HCL-STD-2024", name: "Laptop Stand Adjustable", generatedThrough: "Manual", creditIrn: "CRN-2024-023", creditIrnGeneratedDate: "2024-02-07" },
            { id: 24, serviceInvoiceReturn: "SIR-2024-024", customerInvoice: "CI-2024-024", serviceInvoiceReturnDate: "2024-02-07", isFullReturn: false, serial: "SN001234590", model: "HCL-CLN-2024", name: "Screen Cleaner Kit", generatedThrough: "Automated", creditIrn: "CRN-2024-024", creditIrnGeneratedDate: "2024-02-08" },
            { id: 25, serviceInvoiceReturn: "SIR-2024-025", customerInvoice: "CI-2024-025", serviceInvoiceReturnDate: "2024-02-08", isFullReturn: true, serial: "SN001234591", model: "HCL-FAN-2024", name: "Cooling Fan External", generatedThrough: "Manual", creditIrn: "CRN-2024-025", creditIrnGeneratedDate: "2024-02-09" },
            { id: 26, serviceInvoiceReturn: "SIR-2024-026", customerInvoice: "CI-2024-026", serviceInvoiceReturnDate: "2024-02-09", isFullReturn: false, serial: "SN001234592", model: "HCL-LCK-2024", name: "Security Lock Cable", generatedThrough: "Automated", creditIrn: "CRN-2024-026", creditIrnGeneratedDate: "2024-02-10" }
        ];

        this.filteredInvoices = [...this.serviceInvoices];
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.sortConfig = { key: null, direction: 'asc' };
        this.selectedRows = new Set();

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderTable();
        this.renderPagination();
        this.setupThemeToggle();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('globalSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // Button event listeners
        document.getElementById('newBtn')?.addEventListener('click', () => this.handleNew());
        document.getElementById('refreshBtn')?.addEventListener('click', () => this.handleRefresh());
        document.getElementById('advanceSearchBtn')?.addEventListener('click', () => this.handleAdvanceSearch());
        document.getElementById('exportBtn')?.addEventListener('click', () => this.handleExport());

        // Table sorting
        document.querySelectorAll('.sortable').forEach(header => {
            header.addEventListener('click', () => {
                const sortKey = header.dataset.sort;
                this.handleSort(sortKey);
            });
        });

        // Select all checkbox
        document.getElementById('selectAll')?.addEventListener('change', (e) => {
            this.handleSelectAll(e.target.checked);
        });

        // Pagination
        document.getElementById('itemsPerPage')?.addEventListener('change', (e) => {
            this.itemsPerPage = parseInt(e.target.value);
            this.currentPage = 1;
            this.renderTable();
            this.renderPagination();
        });

        // Pagination buttons
        document.getElementById('firstBtn')?.addEventListener('click', () => {
            this.currentPage = 1;
            this.renderTable();
            this.renderPagination();
        });

        document.getElementById('prevBtn')?.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderTable();
                this.renderPagination();
            }
        });

        document.getElementById('nextBtn')?.addEventListener('click', () => {
            const totalPages = Math.ceil(this.filteredInvoices.length / this.itemsPerPage);
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.renderTable();
                this.renderPagination();
            }
        });

        document.getElementById('lastBtn')?.addEventListener('click', () => {
            const totalPages = Math.ceil(this.filteredInvoices.length / this.itemsPerPage);
            this.currentPage = totalPages;
            this.renderTable();
            this.renderPagination();
        });

        document.getElementById('currentPageSelect')?.addEventListener('change', (e) => {
            this.currentPage = parseInt(e.target.value);
            this.renderTable();
            this.renderPagination();
        });
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = document.getElementById('themeIcon');

        if (themeToggle && themeIcon) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

                document.documentElement.setAttribute('data-theme', newTheme);
                themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

                this.showNotification(`Switched to ${newTheme} theme`, 'info');
            });
        }
    }

    handleSearch(searchTerm) {
        if (!searchTerm.trim()) {
            this.filteredInvoices = [...this.serviceInvoices];
        } else {
            this.filteredInvoices = this.serviceInvoices.filter(invoice =>
                Object.values(invoice).some(value =>
                    value.toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }
        this.currentPage = 1;
        this.renderTable();
        this.renderPagination();
    }

    handleSort(key) {
        if (this.sortConfig.key === key) {
            this.sortConfig.direction = this.sortConfig.direction === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortConfig.key = key;
            this.sortConfig.direction = 'asc';
        }

        this.filteredInvoices.sort((a, b) => {
            let aValue = a[key];
            let bValue = b[key];

            if (typeof aValue === 'boolean') {
                aValue = aValue ? 1 : 0;
                bValue = bValue ? 1 : 0;
            }

            if (aValue < bValue) return this.sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return this.sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        this.renderTable();
        this.updateSortIcons();
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

    handleSelectAll(checked) {
        const checkboxes = document.querySelectorAll('.row-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = checked;
            const id = parseInt(checkbox.dataset.id);
            if (checked) {
                this.selectedRows.add(id);
            } else {
                this.selectedRows.delete(id);
            }
        });
        this.updateSelectionUI();
    }

    handleRowSelection(id, checked) {
        if (checked) {
            this.selectedRows.add(parseInt(id));
        } else {
            this.selectedRows.delete(parseInt(id));
        }
        this.updateSelectionUI();
    }

    updateSelectionUI() {
        const selectedCount = this.selectedRows.size;
        if (selectedCount > 0) {
            this.showNotification(`${selectedCount} item(s) selected`, 'info');
        }
    }

    renderTable() {
        const tbody = document.getElementById('serviceInvoiceTableBody');
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageInvoices = this.filteredInvoices.slice(startIndex, endIndex);

        tbody.innerHTML = pageInvoices.map(invoice => `
            <tr data-id="${invoice.id}">
                <td class="checkbox-column">
                    <input type="checkbox" class="table-checkbox row-checkbox"
                           data-id="${invoice.id}"
                           ${this.selectedRows.has(invoice.id) ? 'checked' : ''}
                           onchange="app.handleRowSelection(${invoice.id}, this.checked)">
                </td>
                <td class="text-center">
                    <button class="btn btn-sm btn-primary" onclick="app.viewInvoice(${invoice.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
                <td>${invoice.serviceInvoiceReturn}</td>
                <td>${invoice.customerInvoice}</td>
                <td>${invoice.serviceInvoiceReturnDate}</td>
                <td class="text-center">
                    <span class="status-badge ${invoice.isFullReturn ? 'success' : 'warning'}">
                        ${invoice.isFullReturn ? 'Yes' : 'No'}
                    </span>
                </td>
                <td>${invoice.serial}</td>
                <td>${invoice.model}</td>
                <td>${invoice.name}</td>
                <td>${invoice.generatedThrough}</td>
                <td>${invoice.creditIrn}</td>
                <td>${invoice.creditIrnGeneratedDate}</td>
            </tr>
        `).join('');
    }

    renderPagination() {
        const totalItems = this.filteredInvoices.length;
        const totalPages = Math.ceil(totalItems / this.itemsPerPage);
        const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
        const endItem = Math.min(this.currentPage * this.itemsPerPage, totalItems);

        document.getElementById('paginationInfo').textContent =
            `View ${startItem} - ${endItem} of ${totalItems}`;

        // Update page select
        const pageSelect = document.getElementById('currentPageSelect');
        pageSelect.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            if (i === this.currentPage) option.selected = true;
            pageSelect.appendChild(option);
        }

        // Update pagination buttons
        document.getElementById('firstBtn').disabled = this.currentPage === 1;
        document.getElementById('prevBtn').disabled = this.currentPage === 1;
        document.getElementById('nextBtn').disabled = this.currentPage === totalPages || totalPages === 0;
        document.getElementById('lastBtn').disabled = this.currentPage === totalPages || totalPages === 0;
    }

    // Action handlers
    handleNew() {
        this.showNotification('Opening new Service Invoice Return form...', 'info');
    }

    handleRefresh() {
        this.filteredInvoices = [...this.serviceInvoices];
        this.currentPage = 1;
        this.selectedRows.clear();
        this.renderTable();
        this.renderPagination();
        this.showNotification('Data refreshed successfully', 'success');
    }

    handleAdvanceSearch() {
        this.showNotification('Opening advanced search...', 'info');
    }

    handleExport() {
        this.showNotification('Exporting data...', 'info');
    }

    viewInvoice(id) {
        const invoice = this.serviceInvoices.find(inv => inv.id === id);
        if (invoice) {
            this.showNotification(`Viewing invoice: ${invoice.serviceInvoiceReturn}`, 'info');
        }
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        container.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ServiceInvoiceReturnApp();
});
