/**
 * Modern Allocation Priority System
 * Card-based UI with multiple view options
 */

$(document).ready(function() {
    ModernAllocation.init();
});

const ModernAllocation = {
    // Sample data
    allocationData: [
        { id: 1, orderType: 'Customer Order', orderClass: 'Counter Sales', priority: 1, status: 'Active', createdDate: '2024-01-15', description: 'Direct counter sales to customers' },
        { id: 2, orderType: 'Customer Order', orderClass: 'Parts Sales', priority: 2, status: 'Active', createdDate: '2024-01-15', description: 'Parts sales to customers' },
        { id: 3, orderType: 'Job Card', orderClass: 'Urgent Service', priority: 1, status: 'Pending', createdDate: '2024-01-14', description: 'Urgent service job cards' },
        { id: 4, orderType: 'Stock Transfer', orderClass: 'Inter-branch Transfer', priority: 3, status: 'Active', createdDate: '2024-01-14', description: 'Inter-branch stock transfers' },
        { id: 5, orderType: 'Customer Order', orderClass: 'Emergency Order', priority: 1, status: 'Active', createdDate: '2024-01-13', description: 'Emergency customer orders' },
        { id: 6, orderType: 'Non Sales Order', orderClass: 'FOC', priority: 4, status: 'Completed', createdDate: '2024-01-13', description: 'Free of charge orders' },
        { id: 7, orderType: 'Job Card', orderClass: 'Standard Service', priority: 3, status: 'Active', createdDate: '2024-01-12', description: 'Standard service job cards' },
        { id: 8, orderType: 'Customer Order', orderClass: 'Promotional', priority: 5, status: 'Active', createdDate: '2024-01-12', description: 'Promotional customer orders' },
        { id: 9, orderType: 'Stock Transfer', orderClass: 'Internal Transfer', priority: 4, status: 'Pending', createdDate: '2024-01-11', description: 'Internal stock transfers' },
        { id: 10, orderType: 'Customer Order', orderClass: 'Bulk Order', priority: 2, status: 'Active', createdDate: '2024-01-11', description: 'Bulk customer orders' }
    ],

    filteredData: [],
    currentView: 'cards',
    currentEditId: null,

    // Priority labels
    priorityLabels: {
        1: 'Critical',
        2: 'High', 
        3: 'Medium',
        4: 'Low',
        5: 'Minimal'
    },

    // Priority classes
    priorityClasses: {
        1: 'critical',
        2: 'high',
        3: 'medium', 
        4: 'low',
        5: 'minimal'
    },

    // Initialize the application
    init: function() {
        this.filteredData = [...this.allocationData];
        this.bindEvents();
        this.updateStats();
        this.renderCurrentView();
    },

    // Bind event handlers
    bindEvents: function() {
        const self = this;

        // View switcher
        $('.view-btn').on('click', function() {
            const view = $(this).data('view');
            self.switchView(view);
        });

        // Filter controls
        $('#orderTypeFilter, #priorityFilter, #statusFilter').on('change', function() {
            self.applyFilters();
        });

        // Global search
        $('.global-search').on('input', function() {
            self.handleSearch($(this).val());
        });

        // Add new button
        $('#addNewBtn').on('click', function() {
            self.showAddModal();
        });

        // Import/Export buttons
        $('#importBtn').on('click', function() {
            self.handleImport();
        });

        $('#exportBtn').on('click', function() {
            self.handleExport();
        });

        // Modal events
        $('.modal-close, .modal-overlay').on('click', function() {
            self.hideModal();
        });

        $('#cancelBtn').on('click', function() {
            self.hideModal();
        });

        $('#saveBtn').on('click', function() {
            self.savePriority();
        });

        // Card actions
        $(document).on('click', '.priority-card', function() {
            const id = $(this).data('id');
            self.editPriority(id);
        });

        $(document).on('click', '.btn-icon', function(e) {
            e.stopPropagation();
            const action = $(this).data('action');
            const id = $(this).closest('.priority-card').data('id');
            
            if (action === 'edit') {
                self.editPriority(id);
            } else if (action === 'delete') {
                self.deletePriority(id);
            }
        });

        // Prevent modal close when clicking inside modal content
        $('.modal-content').on('click', function(e) {
            e.stopPropagation();
        });
    },

    // Switch between different views
    switchView: function(view) {
        this.currentView = view;
        
        // Update view buttons
        $('.view-btn').removeClass('active');
        $(`.view-btn[data-view="${view}"]`).addClass('active');
        
        // Hide all views
        $('.content-section').hide();
        
        // Show selected view
        if (view === 'cards') {
            $('#priorityCards').parent().show();
        } else if (view === 'table') {
            $('#tableView').show();
        } else if (view === 'kanban') {
            $('#kanbanView').show();
        }
        
        this.renderCurrentView();
    },

    // Render current view
    renderCurrentView: function() {
        switch(this.currentView) {
            case 'cards':
                this.renderCards();
                break;
            case 'table':
                this.renderTable();
                break;
            case 'kanban':
                this.renderKanban();
                break;
        }
    },

    // Render cards view
    renderCards: function() {
        const container = $('#priorityCards');
        container.empty();

        this.filteredData.forEach(item => {
            const priorityClass = this.priorityClasses[item.priority];
            const priorityLabel = this.priorityLabels[item.priority];
            
            const card = $(`
                <div class="priority-card" data-id="${item.id}">
                    <div class="card-header">
                        <div>
                            <h3 class="card-title">${item.orderType}</h3>
                            <p class="card-subtitle">${item.orderClass}</p>
                        </div>
                        <span class="priority-badge ${priorityClass}">${item.priority} - ${priorityLabel}</span>
                    </div>
                    <div class="card-content">
                        <div class="card-meta">
                            <span>Status: ${item.status}</span>
                            <span>${item.createdDate}</span>
                        </div>
                        <p class="card-description">${item.description}</p>
                    </div>
                    <div class="card-actions">
                        <button class="btn-icon" data-action="edit" title="Edit">
                            <i class="material-icons">edit</i>
                        </button>
                        <button class="btn-icon" data-action="delete" title="Delete">
                            <i class="material-icons">delete</i>
                        </button>
                    </div>
                </div>
            `);
            
            container.append(card);
        });
    },

    // Render table view
    renderTable: function() {
        const tbody = $('#tableBody');
        tbody.empty();

        this.filteredData.forEach(item => {
            const priorityClass = this.priorityClasses[item.priority];
            const priorityLabel = this.priorityLabels[item.priority];
            
            const row = $(`
                <tr data-id="${item.id}">
                    <td>${item.orderType}</td>
                    <td>${item.orderClass}</td>
                    <td><span class="priority-badge ${priorityClass}">${item.priority} - ${priorityLabel}</span></td>
                    <td>${item.status}</td>
                    <td>${item.createdDate}</td>
                    <td>
                        <button class="btn-icon" data-action="edit" title="Edit">
                            <i class="material-icons">edit</i>
                        </button>
                        <button class="btn-icon" data-action="delete" title="Delete">
                            <i class="material-icons">delete</i>
                        </button>
                    </td>
                </tr>
            `);
            
            tbody.append(row);
        });
    },

    // Render kanban view
    renderKanban: function() {
        // Clear all columns
        for (let i = 1; i <= 5; i++) {
            $(`#priority${i}Items`).empty();
        }

        // Group items by priority
        const priorityGroups = {};
        this.filteredData.forEach(item => {
            if (!priorityGroups[item.priority]) {
                priorityGroups[item.priority] = [];
            }
            priorityGroups[item.priority].push(item);
        });

        // Populate columns
        for (let priority = 1; priority <= 5; priority++) {
            const items = priorityGroups[priority] || [];
            const container = $(`#priority${priority}Items`);
            
            // Update count
            $(`.kanban-column[data-priority="${priority}"] .item-count`).text(items.length);
            
            items.forEach(item => {
                const kanbanItem = $(`
                    <div class="kanban-item" data-id="${item.id}">
                        <h4>${item.orderType}</h4>
                        <p>${item.orderClass}</p>
                        <div class="card-meta">
                            <span>${item.status}</span>
                            <span>${item.createdDate}</span>
                        </div>
                    </div>
                `);
                
                container.append(kanbanItem);
            });
        }
    },

    // Update statistics
    updateStats: function() {
        const stats = {
            critical: this.allocationData.filter(item => item.priority === 1).length,
            high: this.allocationData.filter(item => item.priority === 2).length,
            medium: this.allocationData.filter(item => item.priority === 3).length,
            low: this.allocationData.filter(item => item.priority === 4).length
        };

        $('.stat-card.critical .stat-number').text(stats.critical);
        $('.stat-card.high .stat-number').text(stats.high);
        $('.stat-card.medium .stat-number').text(stats.medium);
        $('.stat-card.low .stat-number').text(stats.low);
    },

    // Apply filters
    applyFilters: function() {
        const orderType = $('#orderTypeFilter').val();
        const priority = $('#priorityFilter').val();
        const status = $('#statusFilter').val();

        this.filteredData = this.allocationData.filter(item => {
            return (!orderType || item.orderType.toLowerCase().includes(orderType)) &&
                   (!priority || item.priority == priority) &&
                   (!status || item.status.toLowerCase() === status);
        });

        this.renderCurrentView();
    },

    // Handle search
    handleSearch: function(query) {
        if (!query.trim()) {
            this.filteredData = [...this.allocationData];
        } else {
            const searchTerm = query.toLowerCase();
            this.filteredData = this.allocationData.filter(item => 
                item.orderType.toLowerCase().includes(searchTerm) ||
                item.orderClass.toLowerCase().includes(searchTerm) ||
                item.description.toLowerCase().includes(searchTerm)
            );
        }
        
        this.renderCurrentView();
    },

    // Show add modal
    showAddModal: function() {
        this.currentEditId = null;
        $('#addPriorityModal h2').text('Add New Priority');
        this.clearForm();
        $('#addPriorityModal').addClass('active');
    },

    // Edit priority
    editPriority: function(id) {
        const item = this.allocationData.find(item => item.id === id);
        if (!item) return;

        this.currentEditId = id;
        $('#addPriorityModal h2').text('Edit Priority');
        
        // Populate form
        $('#orderType').val(item.orderType);
        $('#orderClass').val(item.orderClass);
        $(`input[name="priority"][value="${item.priority}"]`).prop('checked', true);
        $('#description').val(item.description);
        
        $('#addPriorityModal').addClass('active');
    },

    // Delete priority
    deletePriority: function(id) {
        if (confirm('Are you sure you want to delete this priority?')) {
            this.allocationData = this.allocationData.filter(item => item.id !== id);
            this.filteredData = this.filteredData.filter(item => item.id !== id);
            this.updateStats();
            this.renderCurrentView();
            this.showNotification('Priority deleted successfully', 'success');
        }
    },

    // Save priority
    savePriority: function() {
        const formData = {
            orderType: $('#orderType').val(),
            orderClass: $('#orderClass').val(),
            priority: parseInt($('input[name="priority"]:checked').val()),
            description: $('#description').val(),
            status: 'Active',
            createdDate: new Date().toISOString().split('T')[0]
        };

        if (!formData.orderType || !formData.orderClass) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        if (this.currentEditId) {
            // Update existing
            const index = this.allocationData.findIndex(item => item.id === this.currentEditId);
            if (index !== -1) {
                this.allocationData[index] = { ...this.allocationData[index], ...formData };
                this.showNotification('Priority updated successfully', 'success');
            }
        } else {
            // Add new
            const newId = Math.max(...this.allocationData.map(item => item.id)) + 1;
            this.allocationData.push({ id: newId, ...formData });
            this.showNotification('Priority added successfully', 'success');
        }

        this.filteredData = [...this.allocationData];
        this.updateStats();
        this.renderCurrentView();
        this.hideModal();
    },

    // Clear form
    clearForm: function() {
        $('#orderType').val('');
        $('#orderClass').val('');
        $('input[name="priority"][value="3"]').prop('checked', true);
        $('#description').val('');
    },

    // Hide modal
    hideModal: function() {
        $('#addPriorityModal').removeClass('active');
        this.currentEditId = null;
    },

    // Handle import
    handleImport: function() {
        this.showNotification('Import functionality coming soon', 'info');
    },

    // Handle export
    handleExport: function() {
        const csvContent = this.generateCSV();
        this.downloadCSV(csvContent, 'allocation-priorities.csv');
        this.showNotification('Data exported successfully', 'success');
    },

    // Generate CSV
    generateCSV: function() {
        const headers = ['ID', 'Order Type', 'Order Class', 'Priority', 'Status', 'Created Date', 'Description'];
        const rows = this.allocationData.map(item => [
            item.id,
            item.orderType,
            item.orderClass,
            item.priority,
            item.status,
            item.createdDate,
            item.description
        ]);

        return [headers, ...rows].map(row => row.join(',')).join('\n');
    },

    // Download CSV
    downloadCSV: function(content, filename) {
        const blob = new Blob([content], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    },

    // Show notification
    showNotification: function(message, type = 'info') {
        const notification = $(`
            <div class="notification ${type}" style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'success' ? '#000' : type === 'error' ? '#dc2626' : '#6b7280'};
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                z-index: 10000;
                opacity: 0;
                transform: translateX(100%);
                transition: all 0.3s ease;
            ">
                ${message}
            </div>
        `);

        $('body').append(notification);

        setTimeout(() => {
            notification.css({
                opacity: 1,
                transform: 'translateX(0)'
            });
        }, 100);

        setTimeout(() => {
            notification.css({
                opacity: 0,
                transform: 'translateX(100%)'
            });
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
};
