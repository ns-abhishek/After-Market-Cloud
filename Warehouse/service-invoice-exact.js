// Service Invoice Return - Exact Match JavaScript

class ServiceInvoiceReturnApp {
    constructor() {
        this.currentPage = 1;
        this.totalPages = 3;
        this.totalRecords = 26;
        this.recordsPerPage = 10;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updatePaginationInfo();
    }

    setupEventListeners() {
        // New button
        document.getElementById('newBtn')?.addEventListener('click', () => {
            this.handleNew();
        });

        // Action buttons
        document.getElementById('refreshBtn')?.addEventListener('click', () => {
            this.handleRefresh();
        });

        document.getElementById('advanceSearchBtn')?.addEventListener('click', () => {
            this.handleAdvanceSearch();
        });

        document.getElementById('exportBtn')?.addEventListener('click', () => {
            this.handleExport();
        });

        document.getElementById('settingsBtn')?.addEventListener('click', () => {
            this.handleSettings();
        });

        // Pagination controls
        document.getElementById('pageSelect')?.addEventListener('change', (e) => {
            this.currentPage = parseInt(e.target.value);
            this.loadPage(this.currentPage);
        });

        document.getElementById('rowsSelect')?.addEventListener('change', (e) => {
            this.recordsPerPage = parseInt(e.target.value);
            this.updatePagination();
        });

        document.getElementById('prevBtn')?.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.loadPage(this.currentPage);
            }
        });

        document.getElementById('nextBtn')?.addEventListener('click', () => {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.loadPage(this.currentPage);
            }
        });

        // View buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleViewRecord(e);
            });
        });

        // Row click handlers
        document.querySelectorAll('.table-row').forEach(row => {
            row.addEventListener('click', (e) => {
                if (!e.target.closest('.view-btn')) {
                    this.handleRowClick(row);
                }
            });
        });
    }

    handleNew() {
        this.showNotification('Opening new Service Invoice Return form...', 'info');
        // Implement new record functionality
    }

    handleRefresh() {
        this.showNotification('Refreshing Service Invoice Return data...', 'info');
        setTimeout(() => {
            this.showNotification('Data refreshed successfully', 'success');
            this.loadPage(this.currentPage);
        }, 1000);
    }

    handleAdvanceSearch() {
        this.showNotification('Opening advanced search...', 'info');
        // Implement advanced search modal
    }

    handleExport() {
        this.showNotification('Exporting Service Invoice Return data...', 'info');
        setTimeout(() => {
            this.showNotification('Data exported successfully', 'success');
            this.exportToCSV();
        }, 1500);
    }

    handleSettings() {
        this.showNotification('Opening settings...', 'info');
        // Implement settings functionality
    }

    handleViewRecord(event) {
        const row = event.target.closest('.table-row');
        const serviceInvoiceReturn = row.querySelector('.service-invoice-return-cell').textContent.trim();
        
        this.showNotification(`Opening details for ${serviceInvoiceReturn}...`, 'info');
        
        // Open in new window or modal
        const newWindow = window.open(
            `service-invoice-detail.html?id=${encodeURIComponent(serviceInvoiceReturn)}`,
            'ServiceInvoiceDetail',
            'width=1200,height=800,scrollbars=yes,resizable=yes'
        );
        
        if (!newWindow) {
            this.showNotification('Please allow popups to view record details', 'error');
        }
    }

    handleRowClick(row) {
        // Remove previous selections
        document.querySelectorAll('.table-row').forEach(r => r.classList.remove('selected'));
        
        // Add selection to clicked row
        row.classList.add('selected');
        
        const serviceInvoiceReturn = row.querySelector('.service-invoice-return-cell').textContent.trim();
        this.showNotification(`Selected: ${serviceInvoiceReturn}`, 'info');
    }

    loadPage(pageNumber) {
        this.showNotification(`Loading page ${pageNumber}...`, 'info');
        
        // Simulate loading different pages
        // In a real application, this would make an API call
        setTimeout(() => {
            this.updatePaginationInfo();
            this.showNotification(`Page ${pageNumber} loaded`, 'success');
        }, 500);
    }

    updatePagination() {
        this.totalPages = Math.ceil(this.totalRecords / this.recordsPerPage);
        this.currentPage = 1;
        this.updatePaginationInfo();
        this.loadPage(1);
    }

    updatePaginationInfo() {
        const pageSelect = document.getElementById('pageSelect');
        const viewInfo = document.querySelector('.view-info');
        
        if (pageSelect) {
            pageSelect.innerHTML = '';
            for (let i = 1; i <= this.totalPages; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = i;
                if (i === this.currentPage) {
                    option.selected = true;
                }
                pageSelect.appendChild(option);
            }
        }
        
        if (viewInfo) {
            const startRecord = (this.currentPage - 1) * this.recordsPerPage + 1;
            const endRecord = Math.min(this.currentPage * this.recordsPerPage, this.totalRecords);
            viewInfo.textContent = `View ${startRecord} - ${endRecord} Of ${this.totalRecords}`;
        }
        
        // Update pagination text
        const paginationText = document.querySelector('.pagination-text:nth-of-type(2)');
        if (paginationText) {
            paginationText.textContent = `of ${this.totalPages}`;
        }
        
        // Update button states
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentPage === 1;
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentPage === this.totalPages;
        }
    }

    exportToCSV() {
        const headers = [
            'Service Invoice Return #',
            'Customer Invoice #',
            'Service Invoice Return Date',
            'Is Full Return',
            'Serial #',
            'Model',
            'Name',
            'Generated Through',
            'Credit IRN #',
            'Credit IRN Generated Date'
        ];
        
        const rows = [];
        document.querySelectorAll('.table-row').forEach(row => {
            const cells = row.querySelectorAll('td');
            const rowData = [];
            for (let i = 1; i < cells.length; i++) { // Skip view column
                rowData.push(cells[i].textContent.trim());
            }
            rows.push(rowData);
        });
        
        let csvContent = headers.join(',') + '\n';
        rows.forEach(row => {
            csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
        });
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'service-invoice-return.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            padding: 12px 16px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            z-index: 9999;
            font-size: 12px;
            max-width: 300px;
            animation: slideIn 0.3s ease;
        `;
        
        const icon = type === 'success' ? '✓' : 
                    type === 'error' ? '✗' : 'ℹ';
        
        notification.innerHTML = `
            <span style="color: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'}; margin-right: 8px;">${icon}</span>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    notification.parentNode.removeChild(notification);
                }, 300);
            }
        }, 3000);
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .table-row.selected {
        background: #e3f2fd !important;
        border-left: 3px solid #2196f3;
    }
    
    .pagination-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;
document.head.appendChild(style);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.serviceInvoiceApp = new ServiceInvoiceReturnApp();
    console.log('Service Invoice Return application initialized');
});
