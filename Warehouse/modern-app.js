// Modern HCL Software Warehouse Management System

class ModernWarehouseApp {
    constructor() {
        this.modules = {
            'service-invoice-return': 'service-invoice-return.html',
            'parts-management': 'parts-management.html',
            'inventory-management': 'inventory-management.html',
            'warranty-management': 'warranty-management.html',
            'field-service': 'field-service.html',
            'sales-management': 'sales-management.html',
            'reports': 'reports.html'
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupSidebarInteractions();
        this.setupTableInteractions();
    }

    setupEventListeners() {
        // Global search
        const globalSearch = document.getElementById('globalSearch');
        if (globalSearch) {
            globalSearch.addEventListener('input', (e) => {
                this.handleGlobalSearch(e.target.value);
            });
        }

        // Action buttons
        document.getElementById('addBtn')?.addEventListener('click', () => this.handleAdd());
        document.getElementById('deleteBtn')?.addEventListener('click', () => this.handleDelete());
        document.getElementById('saveBtn')?.addEventListener('click', () => this.handleSave());
        document.getElementById('advanceSearchBtn')?.addEventListener('click', () => this.handleAdvanceSearch());
        document.getElementById('exportBtn')?.addEventListener('click', () => this.handleExport());
        document.getElementById('refreshBtn')?.addEventListener('click', () => this.handleRefresh());

        // Table action buttons
        document.getElementById('editTableBtn')?.addEventListener('click', () => this.handleEditTable());
        document.getElementById('deleteTableBtn')?.addEventListener('click', () => this.handleDeleteTable());

        // Breadcrumb navigation
        document.querySelectorAll('.breadcrumb-item').forEach(item => {
            item.addEventListener('click', () => {
                if (item.textContent.trim() === 'Service Invoice Return') {
                    this.openModule('service-invoice-return');
                }
            });
        });
    }

    setupSidebarInteractions() {
        document.querySelectorAll('.sidebar-item').forEach(item => {
            item.addEventListener('click', () => {
                // Remove active class from all items
                document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));

                // Add active class to clicked item
                item.classList.add('active');

                const module = item.dataset.module;
                this.showNotification(`Selected module: ${item.textContent.trim()}`, 'info');

                // Handle specific module actions
                if (module === 'service') {
                    this.handleServiceModule();
                }
            });
        });
    }

    setupTableInteractions() {
        // Row checkboxes
        document.querySelectorAll('.row-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.handleRowSelection(e.target);
            });
        });

        // Row action buttons are handled by onclick in HTML
    }

    handleGlobalSearch(searchTerm) {
        if (searchTerm.trim()) {
            this.showNotification(`Searching for: ${searchTerm}`, 'info');
            // Implement search logic here
            this.filterTableRows(searchTerm);
        } else {
            this.showAllTableRows();
        }
    }

    filterTableRows(searchTerm) {
        const rows = document.querySelectorAll('.table-row');
        rows.forEach(row => {
            const nameCell = row.querySelector('.name-cell');
            if (nameCell) {
                const text = nameCell.textContent.toLowerCase();
                if (text.includes(searchTerm.toLowerCase())) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            }
        });
    }

    showAllTableRows() {
        document.querySelectorAll('.table-row').forEach(row => {
            row.style.display = '';
        });
    }

    handleServiceModule() {
        // Show service-related options or navigate to service dashboard
        this.showNotification('Service module activated', 'success');
    }

    handleRowSelection(checkbox) {
        const selectedCount = document.querySelectorAll('.row-checkbox:checked').length;
        if (selectedCount > 0) {
            this.showNotification(`${selectedCount} item(s) selected`, 'info');
        }
    }

    // Action handlers
    handleAdd() {
        this.showNotification('Opening add new item form...', 'info');
        // Implement add functionality
    }

    handleDelete() {
        const selectedItems = document.querySelectorAll('.row-checkbox:checked');
        if (selectedItems.length === 0) {
            this.showNotification('Please select items to delete', 'error');
            return;
        }

        if (confirm(`Are you sure you want to delete ${selectedItems.length} item(s)?`)) {
            this.showNotification(`${selectedItems.length} item(s) deleted successfully`, 'success');
            // Implement delete functionality
        }
    }

    handleSave() {
        this.showNotification('Saving changes...', 'info');
        setTimeout(() => {
            this.showNotification('Changes saved successfully', 'success');
        }, 1000);
    }

    handleAdvanceSearch() {
        this.showNotification('Opening advanced search...', 'info');
        // Implement advanced search modal
    }

    handleExport() {
        this.showNotification('Exporting data...', 'info');
        setTimeout(() => {
            this.showNotification('Data exported successfully', 'success');
        }, 1500);
    }

    handleRefresh() {
        this.showNotification('Refreshing data...', 'info');
        setTimeout(() => {
            this.showNotification('Data refreshed successfully', 'success');
            // Reload table data
        }, 1000);
    }

    handleEditTable() {
        this.showNotification('Entering edit mode...', 'info');
        // Implement table edit functionality
    }

    handleDeleteTable() {
        const selectedItems = document.querySelectorAll('.row-checkbox:checked');
        if (selectedItems.length === 0) {
            this.showNotification('Please select items to delete', 'error');
            return;
        }
        this.handleDelete();
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;

        const icon = type === 'success' ? 'check-circle' :
                    type === 'error' ? 'exclamation-circle' : 'info-circle';

        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;

        container.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
}

// Global function to open modules in new windows
function openModule(moduleName) {
    const app = window.modernApp;

    if (moduleName === 'service-invoice-return') {
        app.showNotification('Opening Service Invoice Return in new window...', 'info');

        const newWindow = window.open(
            'service-invoice-exact.html',
            'ServiceInvoiceReturn',
            'width=1400,height=900,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,status=no'
        );

        if (newWindow) {
            newWindow.focus();
        } else {
            app.showNotification('Please allow popups to open modules in new windows', 'error');
            // Fallback to same window
            setTimeout(() => {
                window.location.href = 'service-invoice-exact.html';
            }, 2000);
        }
    } else {
        app.showNotification(`Opening ${moduleName} module...`, 'info');

        // For other modules, you can create similar pages or show a placeholder
        const newWindow = window.open(
            `${moduleName}.html`,
            moduleName,
            'width=1200,height=800,scrollbars=yes,resizable=yes'
        );

        if (!newWindow) {
            app.showNotification(`Module ${moduleName} will be available soon`, 'info');
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.modernApp = new ModernWarehouseApp();

    // Add some initial data or setup
    console.log('Modern HCL Warehouse Management System initialized');
});
