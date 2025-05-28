// Model Management System JavaScript

class ModelManager {
    constructor() {
        this.models = [
            {
                id: 1,
                name: "Model A-100",
                serviceType: "Maintenance",
                serviceFrequency: "Monthly",
                isActive: true,
                brand: "brand1",
                assetType: "type1",
                description: "High-performance model for industrial use",
                averageLandingCost: 1500.00,
                physicalStock: 25,
                outOfWarehouse: 5,
                averageSellingPrice: 2000.00,
                availableStock: 20,
                gitStock: 3,
                underClearance: 2
            },
            {
                id: 2,
                name: "Model B-200",
                serviceType: "Repair",
                serviceFrequency: "Quarterly",
                isActive: false,
                brand: "brand2",
                assetType: "type2",
                description: "Standard model for commercial applications",
                averageLandingCost: 800.00,
                physicalStock: 15,
                outOfWarehouse: 2,
                averageSellingPrice: 1200.00,
                availableStock: 13,
                gitStock: 1,
                underClearance: 1
            },
            {
                id: 3,
                name: "Model C-300",
                serviceType: "Inspection",
                serviceFrequency: "Weekly",
                isActive: true,
                brand: "brand1",
                assetType: "type1",
                description: "Premium model with advanced features",
                averageLandingCost: 2500.00,
                physicalStock: 10,
                outOfWarehouse: 1,
                averageSellingPrice: 3500.00,
                availableStock: 9,
                gitStock: 0,
                underClearance: 0
            }
        ];

        this.filteredModels = [...this.models];
        this.currentPage = 1;
        this.recordsPerPage = 20;
        this.selectedModels = new Set();
        this.editingModel = null;

        this.init();
    }

    init() {
        this.bindEvents();
        this.renderTable();
        this.updatePagination();
    }

    bindEvents() {
        // Filter events
        document.getElementById('brandSelect').addEventListener('change', () => this.applyFilters());
        document.getElementById('assetTypeSelect').addEventListener('change', () => this.applyFilters());

        // Action button events
        document.getElementById('newBtn').addEventListener('click', () => this.openModal());
        document.getElementById('deleteBtn').addEventListener('click', () => this.deleteSelected());
        document.getElementById('advanceSearchBtn').addEventListener('click', () => this.showAdvanceSearch());
        document.getElementById('exportBtn').addEventListener('click', () => this.exportData());
        document.getElementById('refreshBtn').addEventListener('click', () => this.refreshData());

        // Modal events
        document.getElementById('closeModal').addEventListener('click', () => this.closeModal());
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeModal());
        document.getElementById('saveBtn').addEventListener('click', () => this.saveModel());

        // Pagination events
        document.getElementById('pageInput').addEventListener('change', (e) => this.goToPage(parseInt(e.target.value)));
        document.getElementById('recordsPerPage').addEventListener('change', (e) => {
            this.recordsPerPage = parseInt(e.target.value);
            this.currentPage = 1;
            this.renderTable();
            this.updatePagination();
        });

        document.getElementById('firstPageBtn').addEventListener('click', () => this.goToPage(1));
        document.getElementById('prevPageBtn').addEventListener('click', () => this.goToPage(this.currentPage - 1));
        document.getElementById('nextPageBtn').addEventListener('click', () => this.goToPage(this.currentPage + 1));
        document.getElementById('lastPageBtn').addEventListener('click', () => this.goToPage(this.getTotalPages()));

        // Select all checkbox
        document.getElementById('selectAll').addEventListener('change', (e) => this.toggleSelectAll(e.target.checked));

        // Close modal when clicking outside
        document.getElementById('modelModal').addEventListener('click', (e) => {
            if (e.target.id === 'modelModal') {
                this.closeModal();
            }
        });
    }

    applyFilters() {
        const brandFilter = document.getElementById('brandSelect').value;
        const assetTypeFilter = document.getElementById('assetTypeSelect').value;

        this.filteredModels = this.models.filter(model => {
            const brandMatch = !brandFilter || model.brand === brandFilter;
            const assetTypeMatch = !assetTypeFilter || model.assetType === assetTypeFilter;
            return brandMatch && assetTypeMatch;
        });

        this.currentPage = 1;
        this.selectedModels.clear();
        this.renderTable();
        this.updatePagination();
    }

    renderTable() {
        const tableBody = document.getElementById('tableBody');
        const noDataMessage = document.getElementById('noDataMessage');

        if (this.filteredModels.length === 0) {
            tableBody.innerHTML = '';
            noDataMessage.style.display = 'block';
            return;
        }

        noDataMessage.style.display = 'none';

        const startIndex = (this.currentPage - 1) * this.recordsPerPage;
        const endIndex = startIndex + this.recordsPerPage;
        const pageModels = this.filteredModels.slice(startIndex, endIndex);

        tableBody.innerHTML = pageModels.map(model => `
            <tr>
                <td>
                    <input type="checkbox" class="row-checkbox" data-id="${model.id}"
                           ${this.selectedModels.has(model.id) ? 'checked' : ''}>
                </td>
                <td>
                    <i class="fas fa-eye action-icon" onclick="modelManager.viewModel(${model.id})" title="View"></i>
                </td>
                <td>
                    <i class="fas fa-trash action-icon" onclick="modelManager.deleteModel(${model.id})" title="Delete"></i>
                </td>
                <td>${model.name}</td>
                <td>${model.serviceType}</td>
                <td>${model.serviceFrequency}</td>
                <td>
                    <span class="status-badge ${model.isActive ? 'status-active' : 'status-inactive'}">
                        ${model.isActive ? 'Yes' : 'No'}
                    </span>
                </td>
            </tr>
        `).join('');

        // Bind checkbox events
        document.querySelectorAll('.row-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const modelId = parseInt(e.target.dataset.id);
                if (e.target.checked) {
                    this.selectedModels.add(modelId);
                } else {
                    this.selectedModels.delete(modelId);
                }
                this.updateSelectAllCheckbox();
            });
        });
    }

    updatePagination() {
        const totalPages = this.getTotalPages();
        document.getElementById('totalPages').textContent = totalPages;
        document.getElementById('pageInput').value = this.currentPage;
        document.getElementById('pageInput').max = totalPages;

        // Update pagination button states
        document.getElementById('firstPageBtn').disabled = this.currentPage === 1;
        document.getElementById('prevPageBtn').disabled = this.currentPage === 1;
        document.getElementById('nextPageBtn').disabled = this.currentPage === totalPages;
        document.getElementById('lastPageBtn').disabled = this.currentPage === totalPages;
    }

    getTotalPages() {
        return Math.ceil(this.filteredModels.length / this.recordsPerPage);
    }

    goToPage(page) {
        const totalPages = this.getTotalPages();
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderTable();
            this.updatePagination();
        }
    }

    toggleSelectAll(checked) {
        const startIndex = (this.currentPage - 1) * this.recordsPerPage;
        const endIndex = startIndex + this.recordsPerPage;
        const pageModels = this.filteredModels.slice(startIndex, endIndex);

        pageModels.forEach(model => {
            if (checked) {
                this.selectedModels.add(model.id);
            } else {
                this.selectedModels.delete(model.id);
            }
        });

        this.renderTable();
    }

    updateSelectAllCheckbox() {
        const startIndex = (this.currentPage - 1) * this.recordsPerPage;
        const endIndex = startIndex + this.recordsPerPage;
        const pageModels = this.filteredModels.slice(startIndex, endIndex);

        const allSelected = pageModels.every(model => this.selectedModels.has(model.id));
        const someSelected = pageModels.some(model => this.selectedModels.has(model.id));

        const selectAllCheckbox = document.getElementById('selectAll');
        selectAllCheckbox.checked = allSelected;
        selectAllCheckbox.indeterminate = someSelected && !allSelected;
    }

    openModal(model = null) {
        this.editingModel = model;
        const modal = document.getElementById('modelModal');
        const modalTitle = document.getElementById('modalTitle');

        if (model) {
            modalTitle.textContent = 'Edit Model';
            document.getElementById('modelName').value = model.name || '';
            document.getElementById('serviceType').value = model.serviceType || '';
            document.getElementById('serviceFrequency').value = model.serviceFrequency || '';
            document.getElementById('description').value = model.description || '';
            document.getElementById('averageLandingCost').value = model.averageLandingCost || '';
            document.getElementById('physicalStock').value = model.physicalStock || '';
            document.getElementById('outOfWarehouse').value = model.outOfWarehouse || '';
            document.getElementById('averageSellingPrice').value = model.averageSellingPrice || '';
            document.getElementById('availableStock').value = model.availableStock || '';
            document.getElementById('gitStock').value = model.gitStock || '';
            document.getElementById('underClearance').value = model.underClearance || '';
            document.getElementById('isActive').checked = model.isActive;
        } else {
            modalTitle.textContent = 'Add Model';
            document.getElementById('modelForm').reset();
            document.getElementById('isActive').checked = true;
        }

        modal.classList.add('show');
    }

    closeModal() {
        const modal = document.getElementById('modelModal');
        modal.classList.remove('show');
        this.editingModel = null;
    }

    saveModel() {
        const form = document.getElementById('modelForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const modelData = {
            name: document.getElementById('modelName').value,
            serviceType: document.getElementById('serviceType').value,
            serviceFrequency: document.getElementById('serviceFrequency').value,
            description: document.getElementById('description').value,
            averageLandingCost: parseFloat(document.getElementById('averageLandingCost').value) || 0,
            physicalStock: parseInt(document.getElementById('physicalStock').value) || 0,
            outOfWarehouse: parseInt(document.getElementById('outOfWarehouse').value) || 0,
            averageSellingPrice: parseFloat(document.getElementById('averageSellingPrice').value) || 0,
            availableStock: parseInt(document.getElementById('availableStock').value) || 0,
            gitStock: parseInt(document.getElementById('gitStock').value) || 0,
            underClearance: parseInt(document.getElementById('underClearance').value) || 0,
            isActive: document.getElementById('isActive').checked,
            brand: 'brand1', // Default values
            assetType: 'type1'
        };

        if (this.editingModel) {
            // Update existing model
            const index = this.models.findIndex(m => m.id === this.editingModel.id);
            this.models[index] = { ...this.editingModel, ...modelData };
        } else {
            // Add new model
            const newModel = {
                id: Math.max(...this.models.map(m => m.id)) + 1,
                ...modelData
            };
            this.models.push(newModel);
        }

        this.applyFilters();
        this.closeModal();
        this.showNotification(this.editingModel ? 'Model updated successfully!' : 'Model added successfully!');
    }

    viewModel(id) {
        const model = this.models.find(m => m.id === id);
        if (model) {
            this.openModal(model);
        }
    }

    deleteModel(id) {
        if (confirm('Are you sure you want to delete this model?')) {
            this.models = this.models.filter(m => m.id !== id);
            this.selectedModels.delete(id);
            this.applyFilters();
            this.showNotification('Model deleted successfully!');
        }
    }

    deleteSelected() {
        if (this.selectedModels.size === 0) {
            alert('Please select models to delete.');
            return;
        }

        if (confirm(`Are you sure you want to delete ${this.selectedModels.size} selected model(s)?`)) {
            this.models = this.models.filter(m => !this.selectedModels.has(m.id));
            this.selectedModels.clear();
            this.applyFilters();
            this.showNotification('Selected models deleted successfully!');
        }
    }

    showAdvanceSearch() {
        // Placeholder for advanced search functionality
        alert('Advanced search functionality would be implemented here.');
    }

    exportData() {
        // Simple CSV export
        const headers = ['ID', 'Model', 'Service Type', 'Service Frequency', 'Is Active'];
        const csvContent = [
            headers.join(','),
            ...this.filteredModels.map(model => [
                model.id,
                `"${model.name}"`,
                `"${model.serviceType}"`,
                `"${model.serviceFrequency}"`,
                model.isActive ? 'Yes' : 'No'
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'models_export.csv';
        a.click();
        window.URL.revokeObjectURL(url);

        this.showNotification('Data exported successfully!');
    }

    refreshData() {
        // Reset filters and reload data
        document.getElementById('brandSelect').value = '';
        document.getElementById('assetTypeSelect').value = '';
        this.selectedModels.clear();
        this.currentPage = 1;
        this.applyFilters();
        this.showNotification('Data refreshed successfully!');
    }

    showNotification(message) {
        // Create and show a temporary notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #27ae60;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            z-index: 1001;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Add notification animations to CSS dynamically
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

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.modelManager = new ModelManager();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape key to close modal
    if (e.key === 'Escape') {
        const modal = document.getElementById('modelModal');
        if (modal.classList.contains('show')) {
            window.modelManager.closeModal();
        }
    }

    // Ctrl+N for new model
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        window.modelManager.openModal();
    }

    // Delete key for delete selected
    if (e.key === 'Delete' && window.modelManager.selectedModels.size > 0) {
        window.modelManager.deleteSelected();
    }
});
