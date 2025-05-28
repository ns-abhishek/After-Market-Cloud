/**
 * HCL Software Allocation Priority - Modern Black & White Business UI
 * Built with jQuery and modern web standards
 */

$(document).ready(function() {
    AllocationApp.init();
});

const AllocationApp = {
    // Application data (Limited to 10 records as requested)
    allocationData: [
        { id: 1, orderType: 'Customer Order', orderClass: 'Counter Sales', priority: 1, createdDate: '2024-01-15', status: 'Active' },
        { id: 2, orderType: 'Customer Order', orderClass: 'Parts Sales', priority: 2, createdDate: '2024-01-15', status: 'Active' },
        { id: 3, orderType: 'Job Card', orderClass: 'Urgent Service', priority: 1, createdDate: '2024-01-14', status: 'Active' },
        { id: 4, orderType: 'Stock Transfer', orderClass: 'Inter-branch Transfer', priority: 3, createdDate: '2024-01-14', status: 'Active' },
        { id: 5, orderType: 'Customer Order', orderClass: 'Emergency Order', priority: 1, createdDate: '2024-01-13', status: 'Active' },
        { id: 6, orderType: 'Job Card', orderClass: 'Scheduled Service', priority: 3, createdDate: '2024-01-13', status: 'Active' },
        { id: 7, orderType: 'Non Sales Order', orderClass: 'FOC', priority: 4, createdDate: '2024-01-12', status: 'Active' },
        { id: 8, orderType: 'Stock Transfer', orderClass: 'Internal Order', priority: 5, createdDate: '2024-01-12', status: 'Active' },
        { id: 9, orderType: 'Customer Order', orderClass: 'VIP Customer', priority: 1, createdDate: '2024-01-11', status: 'Active' },
        { id: 10, orderType: 'Job Card', orderClass: 'Critical Service', priority: 2, createdDate: '2024-01-11', status: 'Active' }
    ],

    filteredData: [],
    currentView: 'dashboard',
    currentEditIndex: -1,
    sortField: null,
    sortDirection: 'asc',

    // Initialize the application
    init: function() {
        this.filteredData = [...this.allocationData];
        this.currentPage = 1;
        this.itemsPerPage = 25;
        this.totalPages = 1;

        this.bindEvents();
        this.updateDashboard();
        this.updateProfileStats();
        this.renderCurrentView();
        this.populateFilters();
        this.initializePagination();
    },

    // Bind event handlers
    bindEvents: function() {
        const self = this;

        // View switcher
        $('.view-btn').on('click', function() {
            const view = $(this).data('view');
            self.switchView(view);
        });

        // Quick Access
        $('#quickAccessBtn').on('click', function() {
            self.toggleQuickAccess();
        });

        $('#toggleQuickAccess').on('click', function() {
            self.toggleQuickAccess();
        });

        // Quick Actions
        $('.quick-action-btn').on('click', function() {
            const action = $(this).data('action');
            self.handleQuickAction(action);
        });

        // Profile Menu
        $('#profileMenuBtn').on('click', function(e) {
            e.stopPropagation();
            self.toggleProfileMenu();
        });

        // Navigation Search
        $('#navSearch').on('input', function() {
            self.handleNavigationSearch($(this).val());
        });

        $('#navSearchClear').on('click', function() {
            $('#navSearch').val('');
            self.handleNavigationSearch('');
            $(this).hide();
        });

        // Navigation Sub-menus
        $('.nav-link').on('mouseenter', function() {
            $(this).find('.nav-submenu').addClass('active');
        }).on('mouseleave', function() {
            $(this).find('.nav-submenu').removeClass('active');
        });

        // Navigation Link Click (Toggle Expansion)
        $('.nav-link').on('click', function(e) {
            e.preventDefault();
            const $link = $(this);
            const $submenu = $link.find('.nav-submenu');

            if ($submenu.length > 0) {
                // Toggle expanded state
                $link.toggleClass('expanded');

                // Close other expanded menus
                $('.nav-link').not($link).removeClass('expanded');
            }
        });

        // Action Bar Dropdowns
        $('.dropdown-toggle').on('click', function(e) {
            e.stopPropagation();
            const dropdown = $(this).closest('.btn-dropdown');
            const menu = dropdown.find('.dropdown-menu');

            // Close other dropdowns
            $('.btn-dropdown').not(dropdown).removeClass('active');
            $('.dropdown-menu').not(menu).removeClass('active');

            // Toggle current dropdown
            dropdown.toggleClass('active');
            menu.toggleClass('active');
        });

        // Print functionality
        $('#printBtn').on('click', function() {
            self.printCurrentView();
        });

        // Import/Export dropdowns
        $(document).on('click', '.dropdown-item', function() {
            const action = $(this).data('import') || $(this).data('export');
            const type = $(this).data('import') ? 'import' : 'export';

            if (type === 'import') {
                self.handleImport(action);
            } else {
                self.handleExport(action);
            }

            // Close dropdown
            $(this).closest('.dropdown-menu').removeClass('active');
            $(this).closest('.btn-dropdown').removeClass('active');
        });

        // Global search
        $('#globalSearch').on('input', function() {
            self.handleGlobalSearch($(this).val());
        });

        // Action buttons
        $('#addOrderBtn').on('click', function() {
            self.showOrderModal();
        });

        $('#exportBtn').on('click', function() {
            self.exportData();
        });

        $('#refreshBtn').on('click', function() {
            self.refreshData();
        });

        // Modal events
        $('#closeModal, #cancelOrder').on('click', function() {
            self.hideOrderModal();
        });

        $('#saveOrder').on('click', function() {
            self.saveOrder();
        });

        $('#saveAsTemplate').on('click', function() {
            self.saveAsTemplate();
        });

        // Modal view switcher
        $('.modal-view-btn').on('click', function() {
            const view = $(this).data('modal-view');
            self.switchModalView(view);
        });

        // Priority Manager
        $('#closePriorityManager').on('click', function() {
            self.hidePriorityManager();
        });

        $('#savePriorities').on('click', function() {
            self.savePriorityChanges();
        });

        $('#resetPriorities').on('click', function() {
            self.resetPriorities();
        });

        $('#bulkAssign').on('click', function() {
            self.showBulkAssignDialog();
        });

        $('#previewChanges').on('click', function() {
            self.previewPriorityChanges();
        });

        $('#applySmartAssignment').on('click', function() {
            self.applySmartAssignment();
        });

        // Priority Mode Switcher
        $('.mode-btn').on('click', function() {
            const mode = $(this).data('mode');
            self.switchPriorityMode(mode);
        });

        // Import Modal
        $('#closeImportModal, #cancelImport').on('click', function() {
            self.hideImportModal();
        });

        $('#browseFiles').on('click', function() {
            $('#fileInput').click();
        });

        $('#fileInput').on('change', function() {
            self.handleFileSelection(this.files);
        });

        $('#confirmImport').on('click', function() {
            self.confirmImport();
        });

        // File drag and drop
        $('#importZone').on('dragover', function(e) {
            e.preventDefault();
            $(this).addClass('drag-over');
        }).on('dragleave', function(e) {
            $(this).removeClass('drag-over');
        }).on('drop', function(e) {
            e.preventDefault();
            $(this).removeClass('drag-over');
            self.handleFileSelection(e.originalEvent.dataTransfer.files);
        }).on('click', function() {
            $('#fileInput').click();
        });

        // Table sorting
        $(document).on('click', '.sortable', function() {
            const field = $(this).data('sort');
            self.sortData(field);
        });

        // Table filters
        $('#orderTypeFilter, #priorityFilter').on('change', function() {
            self.applyFilters();
        });

        // Table row actions
        $(document).on('click', '.edit-btn', function() {
            const id = $(this).data('id');
            self.editOrder(id);
        });

        $(document).on('click', '.delete-btn', function() {
            const id = $(this).data('id');
            self.deleteOrder(id);
        });

        // Settings
        $('#saveSettings').on('click', function() {
            self.saveSettings();
        });

        $('#resetSettings').on('click', function() {
            self.resetSettings();
        });

        // Timeline controls
        $('#todayBtn, #weekBtn, #monthBtn').on('click', function() {
            const period = $(this).attr('id').replace('Btn', '');
            self.filterTimeline(period);
        });

        // Batch operations
        $('#batchUpdatePriority, #batchDelete, #batchExport').on('click', function() {
            const action = $(this).attr('id').replace('batch', '').toLowerCase();
            self.handleBatchOperation(action);
        });

        // Template selection
        $(document).on('click', '.template-card', function() {
            const templateId = $(this).data('template-id');
            self.loadTemplate(templateId);
        });

        // Recent order selection
        $(document).on('click', '.recent-order-item', function() {
            const orderId = $(this).data('order-id');
            self.editOrder(orderId);
        });

        // Keyboard shortcuts
        $(document).on('keydown', function(e) {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                self.saveOrder();
            }
            if (e.ctrlKey && e.key === 'f') {
                e.preventDefault();
                $('#globalSearch').focus();
            }
            if (e.ctrlKey && e.key === 'p') {
                e.preventDefault();
                self.printCurrentView();
            }
            if (e.key === 'Escape') {
                self.hideOrderModal();
                self.hidePriorityManager();
                self.hideQuickAccess();
                self.hideImportModal();
                self.hideProfileMenu();
                self.closeAllDropdowns();
            }
            if (e.ctrlKey && e.key === 'q') {
                e.preventDefault();
                self.toggleQuickAccess();
            }
        });

        // Close dropdowns on outside click
        $(document).on('click', function(e) {
            if (!$(e.target).closest('.btn-dropdown').length) {
                self.closeAllDropdowns();
            }
            if (!$(e.target).closest('.sidebar-profile').length) {
                self.hideProfileMenu();
            }
        });

        // Modal backdrop click
        $('.modal').on('click', function(e) {
            if (e.target === this) {
                self.hideOrderModal();
                self.hidePriorityManager();
                self.hideImportModal();
            }
        });

        // Pagination event handlers
        $(document).on('click', '.pagination-btn', function() {
            const action = $(this).hasClass('prev') ? 'prev' :
                          $(this).hasClass('next') ? 'next' :
                          $(this).hasClass('first') ? 'first' : 'last';
            self.handlePagination(action);
        });

        $(document).on('click', '.pagination-number', function() {
            const page = parseInt($(this).text());
            self.goToPage(page);
        });

        $(document).on('click', '.pagination-dot', function() {
            const index = $(this).index();
            self.goToPage(index + 1);
        });

        $(document).on('input', '.pagination-range', function() {
            const page = parseInt($(this).val());
            self.goToPage(page);
        });

        $(document).on('click', '.pagination-step', function() {
            const step = $(this).index() + 1;
            self.goToPage(step);
        });

        $(document).on('click', '.pagination-card', function() {
            const index = $(this).index();
            self.goToPage(index + 1);
        });

        $(document).on('click', '.timeline-period', function() {
            const index = $(this).parent().children('.timeline-period').index(this);
            self.goToPage(index + 1);
        });

        $(document).on('click', '.pagination-tab', function() {
            const index = $(this).index();
            self.goToPage(index + 1);
        });

        // Scheduling controls
        $(document).on('click', '.schedule-btn', function() {
            const period = $(this).data('period');
            self.handleSchedulePeriodChange(period);
        });

        // Calendar navigation
        $(document).on('click', '#prevPeriod, #prevPeriodMain', function() {
            self.navigateCalendar('prev');
        });

        $(document).on('click', '#nextPeriod, #nextPeriodMain', function() {
            self.navigateCalendar('next');
        });

        // Schedule actions
        $(document).on('click', '#createScheduleBtn', function() {
            self.createSchedule();
        });

        $(document).on('click', '#exportScheduleBtn', function() {
            self.exportSchedule();
        });

        $(document).on('click', '#printScheduleBtn', function() {
            self.printSchedule();
        });

        // Calendar day clicks
        $(document).on('click', '.calendar-day', function() {
            const date = $(this).data('date');
            self.showDayDetails(date);
        });

        // Search dropdown functionality
        $(document).on('focus', '.search-dropdown-input', function() {
            $(this).siblings('.search-dropdown-menu').show();
        });

        $(document).on('blur', '.search-dropdown-input', function() {
            setTimeout(() => {
                $(this).siblings('.search-dropdown-menu').hide();
            }, 200);
        });

        $(document).on('click', '.search-dropdown-item', function() {
            const value = $(this).data('value');
            const input = $(this).closest('.search-dropdown-container').find('.search-dropdown-input');
            input.val(value);
            $(this).parent().hide();
        });

        // Analytics section switching
        $(document).on('click', '[data-section]', function() {
            const section = $(this).data('section');
            self.switchAnalyticsSection(section);
        });

        // Time range selector
        $(document).on('click', '.time-btn', function() {
            $('.time-btn').removeClass('active');
            $(this).addClass('active');
            const range = $(this).data('range');
            self.updateAnalyticsTimeRange(range);
        });

        // Navigation search functionality
        $(document).on('input', '#navSearch', function() {
            const query = $(this).val().toLowerCase();
            self.handleNavigationSearch(query);
        });

        $(document).on('focus', '#navSearch', function() {
            if ($(this).val().trim()) {
                $('#navSearchResults').show();
            }
        });

        $(document).on('blur', '#navSearch', function() {
            setTimeout(() => {
                $('#navSearchResults').hide();
            }, 200);
        });

        $(document).on('click', '.nav-search-result-item', function() {
            const module = $(this).data('module');
            const submenu = $(this).data('submenu');
            self.navigateToModule(module, submenu);
            $('#navSearchResults').hide();
            $('#navSearch').val('');
        });

        // Initialize keyboard navigation
        this.initializeKeyboardNavigation();

        // Schedule action buttons
        $(document).on('click', '#quickCreateSchedule', function() {
            self.quickCreateSchedule();
        });

        $(document).on('click', '#quickReschedule', function() {
            self.quickReschedule();
        });

        $(document).on('click', '#quickOptimize', function() {
            self.quickOptimize();
        });

        $(document).on('click', '#quickScheduleReport', function() {
            self.quickScheduleReport();
        });

        // Week navigation
        $(document).on('click', '#prevWeek', function() {
            self.navigateWeek('prev');
        });

        $(document).on('click', '#nextWeek', function() {
            self.navigateWeek('next');
        });

        // Schedule box clicks
        $(document).on('click', '.schedule-box', function() {
            const type = $(this).hasClass('urgent') ? 'urgent' :
                        $(this).hasClass('pending') ? 'pending' :
                        $(this).hasClass('progress') ? 'progress' : 'completed';
            self.showScheduleDetails(type);
        });

        // Weekly day clicks
        $(document).on('click', '.weekly-day', function() {
            const date = $(this).data('date');
            self.showDaySchedule(date);
        });

        // Initialize navigation search
        this.initializeNavigationSearch();

        // Mobile menu toggle
        $(document).on('click', '#mobileMenuToggle', function() {
            self.toggleMobileMenu();
        });

        $(document).on('click', '#sidebarOverlay', function() {
            self.closeMobileMenu();
        });

        // Header actions
        $(document).on('click', '#notificationsBtn', function() {
            self.showNotifications();
        });

        $(document).on('click', '#helpBtn', function() {
            self.showHelp();
        });

        $(document).on('click', '#fullscreenBtn', function() {
            self.toggleFullscreen();
        });

        // Global search functionality
        $(document).on('input', '#globalSearch', function() {
            const query = $(this).val();
            self.handleGlobalSearch(query);
        });

        $(document).on('focus', '#globalSearch', function() {
            if ($(this).val().trim()) {
                $('#searchSuggestions').show();
            }
        });

        $(document).on('blur', '#globalSearch', function() {
            setTimeout(() => {
                $('#searchSuggestions').hide();
            }, 200);
        });

        // Enhanced keyboard shortcuts
        $(document).on('keydown', function(e) {
            // F1 for help
            if (e.key === 'F1') {
                e.preventDefault();
                self.showHelp();
            }

            // F11 for fullscreen
            if (e.key === 'F11') {
                e.preventDefault();
                self.toggleFullscreen();
            }

            // Escape to close modals/overlays
            if (e.key === 'Escape') {
                self.closeAllOverlays();
            }
        });

        // Initialize scheduling
        this.initializeScheduling();

        // Initialize enhanced features
        this.initializeEnhancedFeatures();

        // Initialize drag and drop
        this.initializeDragAndDrop();
    },

    // View Management
    switchView: function(view) {
        this.currentView = view;

        // Update view buttons
        $('.view-btn').removeClass('active');
        $(`.view-btn[data-view="${view}"]`).addClass('active');

        // Update view content
        $('.view-content').removeClass('active');
        $(`#${view}View`).addClass('active');

        // Update breadcrumb
        this.updateBreadcrumb();

        // Render the current view
        this.renderCurrentView();

        // Show notification for view change
        const viewNames = {
            dashboard: 'Dashboard',
            table: 'Table View',
            grid: 'Grid View',
            kanban: 'Kanban Board',
            scheduling: 'Scheduling',
            analytics: 'Analytics',
            timeline: 'Timeline',
            settings: 'Settings'
        };

        this.showNotification(`Switched to ${viewNames[view]}`, 'info');
    },

    renderCurrentView: function() {
        switch(this.currentView) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'table':
                this.renderTable();
                break;
            case 'grid':
                this.renderGrid();
                break;
            case 'kanban':
                this.renderKanban();
                break;
            case 'scheduling':
                this.renderScheduling();
                break;
            case 'analytics':
                this.renderAnalytics();
                break;
            case 'timeline':
                this.renderTimeline();
                break;
            case 'settings':
                this.renderSettings();
                break;
        }
    },

    // Quick Access Management
    toggleQuickAccess: function() {
        const panel = $('#quickAccessPanel');
        if (panel.hasClass('active')) {
            this.hideQuickAccess();
        } else {
            this.showQuickAccess();
        }
    },

    showQuickAccess: function() {
        $('#quickAccessPanel').addClass('active');
        this.renderQuickAccessContent();
    },

    hideQuickAccess: function() {
        $('#quickAccessPanel').removeClass('active');
    },

    renderQuickAccessContent: function() {
        this.renderRecentOrders();
        this.renderPriorityStats();
    },

    renderRecentOrders: function() {
        const container = $('#recentOrdersList');
        container.empty();

        // Get last 5 orders
        const recentOrders = this.allocationData
            .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
            .slice(0, 5);

        recentOrders.forEach(order => {
            container.append(`
                <div class="recent-order-item" data-order-id="${order.id}">
                    <div class="recent-order-info">
                        <div class="recent-order-title">${order.orderType}</div>
                        <div class="recent-order-meta">${order.orderClass} • Priority ${order.priority}</div>
                    </div>
                    <span class="priority-badge priority-${order.priority}">${order.priority}</span>
                </div>
            `);
        });
    },

    renderPriorityStats: function() {
        const container = $('#priorityBars');
        container.empty();

        const priorityCount = {};
        for (let i = 1; i <= 5; i++) {
            priorityCount[i] = this.allocationData.filter(item => item.priority === i).length;
        }

        const total = this.allocationData.length;
        const priorityLabels = ['Critical', 'High', 'Medium', 'Low', 'Minimal'];

        for (let i = 1; i <= 5; i++) {
            const count = priorityCount[i];
            const percentage = total > 0 ? (count / total) * 100 : 0;

            container.append(`
                <div class="priority-bar">
                    <div class="priority-bar-label">${priorityLabels[i-1]}</div>
                    <div class="priority-bar-visual">
                        <div class="priority-bar-fill" style="width: ${percentage}%"></div>
                    </div>
                    <div class="priority-bar-count">${count}</div>
                </div>
            `);
        }
    },

    handleQuickAction: function(action) {
        switch(action) {
            case 'addCustomerOrder':
                this.showOrderModal(null, 'Customer Order');
                break;
            case 'addJobCard':
                this.showOrderModal(null, 'Job Card');
                break;
            case 'addStockTransfer':
                this.showOrderModal(null, 'Stock Transfer');
                break;
            case 'bulkImport':
                this.showImportModal();
                break;
            case 'priorityManager':
                this.showPriorityManager();
                break;
            case 'reports':
                this.generateReports();
                break;
        }
        this.hideQuickAccess();
    },

    // Profile Management
    toggleProfileMenu: function() {
        $('#profileMenu').toggleClass('active');
    },

    hideProfileMenu: function() {
        $('#profileMenu').removeClass('active');
    },

    // Dropdown Management
    closeAllDropdowns: function() {
        $('.btn-dropdown').removeClass('active');
        $('.dropdown-menu').removeClass('active');
    },

    // Print Functionality
    printCurrentView: function() {
        // Add print-specific styling
        $('body').addClass('printing');

        // Trigger print dialog
        window.print();

        // Remove print styling after print dialog closes
        setTimeout(() => {
            $('body').removeClass('printing');
        }, 1000);

        this.showNotification('Print dialog opened', 'info');
    },

    // Import/Export Handlers
    handleImport: function(type) {
        switch(type) {
            case 'csv':
            case 'excel':
            case 'json':
                this.showImportModal();
                break;
            case 'template':
                this.downloadTemplate();
                break;
        }
    },

    handleExport: function(type) {
        switch(type) {
            case 'csv':
                this.exportToCSV();
                break;
            case 'excel':
                this.exportToExcel();
                break;
            case 'pdf':
                this.exportToPDF();
                break;
            case 'json':
                this.exportToJSON();
                break;
        }
    },

    downloadTemplate: function() {
        const template = [
            ['Order Type', 'Order Class', 'Priority', 'Description'],
            ['Customer Order', 'Standard Order', '3', 'Sample customer order'],
            ['Job Card', 'Urgent Service', '2', 'Sample job card'],
            ['Stock Transfer', 'Inter-branch Transfer', '4', 'Sample stock transfer']
        ];

        this.downloadCSV(template, 'allocation_priority_template.csv');
        this.showNotification('Template downloaded successfully', 'success');
    },

    exportToCSV: function() {
        const data = [['Order Type', 'Order Class', 'Priority', 'Status', 'Created Date']];
        this.filteredData.forEach(item => {
            data.push([item.orderType, item.orderClass, item.priority, item.status, item.createdDate]);
        });

        this.downloadCSV(data, 'allocation_priority_export.csv');
        this.showNotification('Data exported to CSV successfully', 'success');
    },

    exportToExcel: function() {
        this.showNotification('Excel export feature coming soon', 'info');
    },

    exportToPDF: function() {
        this.showNotification('PDF export feature coming soon', 'info');
    },

    exportToJSON: function() {
        const dataStr = JSON.stringify(this.filteredData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'allocation_priority_export.json';
        link.click();
        URL.revokeObjectURL(url);

        this.showNotification('Data exported to JSON successfully', 'success');
    },

    downloadCSV: function(data, filename) {
        const csvContent = data.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    },

    // Dashboard View
    renderDashboard: function() {
        this.updateDashboard();
        this.renderOrderTypesList();
    },

    updateDashboard: function() {
        const totalOrders = this.allocationData.length;
        const highPriority = this.allocationData.filter(item => item.priority <= 2).length;
        const orderTypes = [...new Set(this.allocationData.map(item => item.orderType))].length;
        const activeOrders = this.allocationData.filter(item => item.status === 'Active').length;

        $('#totalOrders').text(totalOrders);
        $('#highPriority').text(highPriority);
        $('#orderTypes').text(orderTypes);

        // Update the efficiency percentage based on active orders
        const efficiency = totalOrders > 0 ? Math.round((activeOrders / totalOrders) * 100) : 0;
        $('.stats-card:last-child .stats-number').text(efficiency + '%');
    },

    renderOrderTypesList: function() {
        const orderTypesCount = {};
        const priorityBreakdown = {};

        this.allocationData.forEach(item => {
            orderTypesCount[item.orderType] = (orderTypesCount[item.orderType] || 0) + 1;

            if (!priorityBreakdown[item.orderType]) {
                priorityBreakdown[item.orderType] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
            }
            priorityBreakdown[item.orderType][item.priority]++;
        });

        const container = $('#orderTypesList');
        container.empty();

        // Add header
        container.append(`
            <div class="order-types-header">
                <h3>Order Types Overview</h3>
                <p>Distribution of orders by type and priority</p>
            </div>
        `);

        Object.entries(orderTypesCount).forEach(([type, count]) => {
            const priorities = priorityBreakdown[type];
            const highPriority = priorities[1] + priorities[2];
            const percentage = ((count / this.allocationData.length) * 100).toFixed(1);

            container.append(`
                <div class="order-type-card">
                    <div class="order-type-header">
                        <div class="order-type-info">
                            <h4 class="order-type-name">${type}</h4>
                            <span class="order-type-percentage">${percentage}% of total</span>
                        </div>
                        <div class="order-type-count">${count}</div>
                    </div>
                    <div class="order-type-details">
                        <div class="priority-breakdown">
                            <div class="priority-item ${priorities[1] > 0 ? 'has-orders' : ''}">
                                <span class="priority-label">Critical</span>
                                <span class="priority-count">${priorities[1]}</span>
                            </div>
                            <div class="priority-item ${priorities[2] > 0 ? 'has-orders' : ''}">
                                <span class="priority-label">High</span>
                                <span class="priority-count">${priorities[2]}</span>
                            </div>
                            <div class="priority-item ${priorities[3] > 0 ? 'has-orders' : ''}">
                                <span class="priority-label">Medium</span>
                                <span class="priority-count">${priorities[3]}</span>
                            </div>
                            <div class="priority-item ${priorities[4] > 0 ? 'has-orders' : ''}">
                                <span class="priority-label">Low</span>
                                <span class="priority-count">${priorities[4]}</span>
                            </div>
                            <div class="priority-item ${priorities[5] > 0 ? 'has-orders' : ''}">
                                <span class="priority-label">Minimal</span>
                                <span class="priority-count">${priorities[5]}</span>
                            </div>
                        </div>
                        <div class="order-type-stats">
                            <div class="stat-item">
                                <span class="stat-label">High Priority</span>
                                <span class="stat-value">${highPriority}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Active</span>
                                <span class="stat-value">${count}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        });
    },

    // Table View
    renderTable: function() {
        const tbody = $('#tableBody');
        tbody.empty();

        if (this.filteredData.length === 0) {
            tbody.append(`
                <tr>
                    <td colspan="4" style="text-align: center; padding: 40px; color: #999;">
                        <i class="material-icons" style="font-size: 48px; margin-bottom: 16px;">inbox</i>
                        <br>No data found
                    </td>
                </tr>
            `);
            return;
        }

        this.filteredData.forEach((item) => {
            const row = $(`
                <tr class="fade-in">
                    <td>${item.orderType}</td>
                    <td>${item.orderClass}</td>
                    <td>
                        <span class="priority-badge priority-${item.priority}">${item.priority}</span>
                    </td>
                    <td>
                        <button class="btn btn-icon edit-btn" data-id="${item.id}" title="Edit">
                            <i class="material-icons">edit</i>
                        </button>
                        <button class="btn btn-icon delete-btn" data-id="${item.id}" title="Delete">
                            <i class="material-icons">delete</i>
                        </button>
                    </td>
                </tr>
            `);
            tbody.append(row);
        });
    },

    // Grid View
    renderGrid: function() {
        const container = $('#gridContainer');
        container.empty();

        if (this.filteredData.length === 0) {
            container.append(`
                <div style="text-align: center; padding: 40px; color: #999; grid-column: 1 / -1;">
                    <i class="material-icons" style="font-size: 48px; margin-bottom: 16px;">inbox</i>
                    <br>No data found
                </div>
            `);
            return;
        }

        this.filteredData.forEach((item) => {
            const gridItem = $(`
                <div class="grid-item fade-in">
                    <div class="grid-item-header">
                        <span class="grid-item-title">${item.orderType}</span>
                        <span class="priority-badge priority-${item.priority}">${item.priority}</span>
                    </div>
                    <div class="grid-item-content">
                        <strong>Class:</strong> ${item.orderClass}<br>
                        <strong>Created:</strong> ${item.createdDate}<br>
                        <strong>Status:</strong> ${item.status}
                    </div>
                    <div class="grid-item-footer">
                        <button class="btn btn-icon edit-btn" data-id="${item.id}" title="Edit">
                            <i class="material-icons">edit</i>
                        </button>
                        <button class="btn btn-icon delete-btn" data-id="${item.id}" title="Delete">
                            <i class="material-icons">delete</i>
                        </button>
                    </div>
                </div>
            `);
            container.append(gridItem);
        });
    },

    // Kanban View
    renderKanban: function() {
        // Clear all kanban columns
        for (let i = 1; i <= 5; i++) {
            $(`#priority${i}Items`).empty();
            $(`#priority${i}Count`).text('0');
        }

        // Group items by priority
        const priorityGroups = {};
        this.filteredData.forEach(item => {
            if (!priorityGroups[item.priority]) {
                priorityGroups[item.priority] = [];
            }
            priorityGroups[item.priority].push(item);
        });

        // Populate kanban columns
        Object.entries(priorityGroups).forEach(([priority, items]) => {
            const container = $(`#priority${priority}Items`);
            $(`#priority${priority}Count`).text(items.length);

            items.forEach(item => {
                const kanbanItem = $(`
                    <div class="kanban-item" data-id="${item.id}">
                        <div class="kanban-item-title">${item.orderType}</div>
                        <div class="kanban-item-meta">
                            ${item.orderClass}<br>
                            <small>${item.createdDate}</small>
                        </div>
                    </div>
                `);
                container.append(kanbanItem);
            });
        });
    },

    // Analytics View
    renderAnalytics: function() {
        // Analytics is mostly static for demo purposes
        // In a real app, this would calculate real metrics
    },

    // Timeline View
    renderTimeline: function() {
        const container = $('#timelineContent');
        container.empty();

        // Sort by date for timeline
        const sortedData = [...this.filteredData].sort((a, b) =>
            new Date(b.createdDate) - new Date(a.createdDate)
        );

        sortedData.forEach(item => {
            const timelineItem = $(`
                <div class="timeline-item fade-in">
                    <div class="timeline-item-header">
                        <span class="timeline-item-title">${item.orderType} - ${item.orderClass}</span>
                        <span class="timeline-item-time">${item.createdDate}</span>
                    </div>
                    <div class="timeline-item-content">
                        Priority: <span class="priority-badge priority-${item.priority}">${item.priority}</span>
                        Status: ${item.status}
                    </div>
                </div>
            `);
            container.append(timelineItem);
        });
    },

    // Settings View
    renderSettings: function() {
        // Settings are mostly static form elements
        // Values would be loaded from localStorage or API
    },

    // Search and Filter Functions
    handleGlobalSearch: function(query) {
        if (!query.trim()) {
            this.filteredData = [...this.allocationData];
        } else {
            const searchTerm = query.toLowerCase();
            this.filteredData = this.allocationData.filter(item =>
                item.orderType.toLowerCase().includes(searchTerm) ||
                item.orderClass.toLowerCase().includes(searchTerm) ||
                item.priority.toString().includes(searchTerm) ||
                item.status.toLowerCase().includes(searchTerm)
            );
        }
        this.renderCurrentView();
    },

    applyFilters: function() {
        const orderTypeFilter = $('#orderTypeFilter').val();
        const priorityFilter = $('#priorityFilter').val();

        this.filteredData = this.allocationData.filter(item => {
            const matchesOrderType = !orderTypeFilter || item.orderType === orderTypeFilter;
            const matchesPriority = !priorityFilter || item.priority.toString() === priorityFilter;
            return matchesOrderType && matchesPriority;
        });

        this.renderCurrentView();
    },

    populateFilters: function() {
        const orderTypes = [...new Set(this.allocationData.map(item => item.orderType))];
        const orderTypeFilter = $('#orderTypeFilter');

        orderTypes.forEach(type => {
            orderTypeFilter.append(`<option value="${type}">${type}</option>`);
        });
    },

    sortData: function(field) {
        if (this.sortField === field) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortField = field;
            this.sortDirection = 'asc';
        }

        this.filteredData.sort((a, b) => {
            let aVal = a[field];
            let bVal = b[field];

            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (this.sortDirection === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

        // Update sort icons
        $('.sort-icon').text('unfold_more');
        $(`.sortable[data-sort="${field}"] .sort-icon`).text(
            this.sortDirection === 'asc' ? 'keyboard_arrow_up' : 'keyboard_arrow_down'
        );

        this.renderCurrentView();
    },

    // Enhanced Modal Management
    showOrderModal: function(editId = null, presetType = null) {
        this.currentEditIndex = editId;
        this.currentModalView = 'form';

        if (editId && typeof editId === 'number') {
            const item = this.allocationData.find(item => item.id === editId);
            $('#modalTitle').text('Edit Order');
            $('#modalSubtitle').text('Modify existing allocation priority');
            $('#orderType').val(item.orderType);
            $('#orderClass').val(item.orderClass);
            $(`input[name="priority"][value="${item.priority}"]`).prop('checked', true);
            $('#description').val(item.description || '');
        } else {
            $('#modalTitle').text('Add New Order');
            $('#modalSubtitle').text('Create new allocation priority');
            $('#orderType').val(presetType || '');
            $('#orderClass').val('');
            $('input[name="priority"][value="3"]').prop('checked', true);
            $('#description').val('');
        }

        this.switchModalView('form');
        this.renderModalContent();
        $('#orderModal').addClass('active');
    },

    hideOrderModal: function() {
        $('#orderModal').removeClass('active');
        this.currentEditIndex = null;
        this.currentModalView = 'form';
    },

    switchModalView: function(view) {
        this.currentModalView = view;

        // Update view buttons
        $('.modal-view-btn').removeClass('active');
        $(`.modal-view-btn[data-modal-view="${view}"]`).addClass('active');

        // Update view content
        $('.modal-view').removeClass('active');
        $(`#modal${view.charAt(0).toUpperCase() + view.slice(1)}View`).addClass('active');

        // Render view-specific content
        this.renderModalContent();
    },

    renderModalContent: function() {
        switch(this.currentModalView) {
            case 'details':
                this.renderOrderDetails();
                break;
            case 'history':
                this.renderOrderHistory();
                break;
            case 'templates':
                this.renderOrderTemplates();
                break;
            case 'validation':
                this.renderValidationResults();
                break;
            case 'preview':
                this.renderOrderPreview();
                break;
            case 'batch':
                this.renderBatchOperations();
                break;
        }
    },

    renderOrderDetails: function() {
        const container = $('#orderDetailsGrid');
        container.empty();

        if (this.currentEditIndex) {
            const item = this.allocationData.find(item => item.id === this.currentEditIndex);
            const details = [
                { label: 'Order ID', value: item.id },
                { label: 'Order Type', value: item.orderType },
                { label: 'Order Class', value: item.orderClass },
                { label: 'Priority Level', value: `${item.priority} - ${this.getPriorityLabel(item.priority)}` },
                { label: 'Status', value: item.status },
                { label: 'Created Date', value: item.createdDate }
            ];

            details.forEach(detail => {
                container.append(`
                    <div class="detail-item">
                        <span class="detail-label">${detail.label}</span>
                        <span class="detail-value">${detail.value}</span>
                    </div>
                `);
            });
        } else {
            container.append('<p>No order selected for details view.</p>');
        }

        // System details
        const systemContainer = $('#systemDetailsGrid');
        systemContainer.empty();
        const systemDetails = [
            { label: 'Last Modified', value: new Date().toLocaleString() },
            { label: 'Modified By', value: 'Admin' },
            { label: 'Version', value: '1.0' },
            { label: 'Workflow State', value: 'Active' }
        ];

        systemDetails.forEach(detail => {
            systemContainer.append(`
                <div class="detail-item">
                    <span class="detail-label">${detail.label}</span>
                    <span class="detail-value">${detail.value}</span>
                </div>
            `);
        });
    },

    renderOrderHistory: function() {
        const container = $('#orderHistoryTimeline');
        container.empty();

        // Mock history data
        const historyItems = [
            { date: '2024-01-15 10:30', action: 'Order Created', user: 'Admin', details: 'Initial order creation' },
            { date: '2024-01-15 10:25', action: 'Priority Set', user: 'Admin', details: 'Priority level assigned' },
            { date: '2024-01-15 10:20', action: 'Validation Passed', user: 'System', details: 'All validation checks passed' }
        ];

        historyItems.forEach(item => {
            container.append(`
                <div class="history-item">
                    <div class="history-item-header">
                        <strong>${item.action}</strong>
                        <span class="history-item-time">${item.date}</span>
                    </div>
                    <div class="history-item-content">
                        ${item.details}<br>
                        <small>by ${item.user}</small>
                    </div>
                </div>
            `);
        });
    },

    renderOrderTemplates: function() {
        const container = $('#orderTemplatesGrid');
        container.empty();

        const templates = [
            { id: 1, title: 'Standard Customer Order', description: 'Default customer order with medium priority' },
            { id: 2, title: 'Urgent Job Card', description: 'High priority job card template' },
            { id: 3, title: 'Stock Transfer', description: 'Standard stock transfer between locations' },
            { id: 4, title: 'Emergency Order', description: 'Critical priority emergency order' }
        ];

        templates.forEach(template => {
            container.append(`
                <div class="template-card" data-template-id="${template.id}">
                    <div class="template-title">${template.title}</div>
                    <div class="template-description">${template.description}</div>
                </div>
            `);
        });
    },

    renderValidationResults: function() {
        const container = $('#validationResults');
        container.empty();

        const validations = [
            { type: 'success', icon: 'check_circle', message: 'Order type is valid' },
            { type: 'success', icon: 'check_circle', message: 'Order class is properly formatted' },
            { type: 'success', icon: 'check_circle', message: 'Priority level is within acceptable range' },
            { type: 'success', icon: 'check_circle', message: 'No duplicate orders found' }
        ];

        validations.forEach(validation => {
            container.append(`
                <div class="validation-item ${validation.type}">
                    <i class="material-icons validation-icon">${validation.icon}</i>
                    <span class="validation-message">${validation.message}</span>
                </div>
            `);
        });
    },

    renderOrderPreview: function() {
        const container = $('#orderPreviewCard');
        container.empty();

        const orderType = $('#orderType').val();
        const orderClass = $('#orderClass').val();
        const priority = $('input[name="priority"]:checked').val();
        const description = $('#description').val();

        container.append(`
            <h4>Order Preview</h4>
            <div class="preview-details">
                <p><strong>Order Type:</strong> ${orderType || 'Not specified'}</p>
                <p><strong>Order Class:</strong> ${orderClass || 'Not specified'}</p>
                <p><strong>Priority:</strong> ${priority ? `${priority} - ${this.getPriorityLabel(priority)}` : 'Not specified'}</p>
                <p><strong>Description:</strong> ${description || 'No description provided'}</p>
                <p><strong>Status:</strong> Active</p>
                <p><strong>Created Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
        `);
    },

    renderBatchOperations: function() {
        const container = $('#batchSelectionList');
        container.empty();

        container.append(`
            <h4>Batch Operations</h4>
            <p>Select multiple orders from the main view to perform batch operations.</p>
            <div class="batch-info">
                <p>Available operations:</p>
                <ul>
                    <li>Update Priority - Change priority for multiple orders</li>
                    <li>Delete Selected - Remove multiple orders at once</li>
                    <li>Export Selected - Export selected orders to CSV</li>
                </ul>
            </div>
        `);
    },

    getPriorityLabel: function(priority) {
        const labels = { 1: 'Critical', 2: 'High', 3: 'Medium', 4: 'Low', 5: 'Minimal' };
        return labels[priority] || 'Unknown';
    },

    // CRUD Operations
    saveOrder: function() {
        const orderType = $('#orderType').val().trim();
        const orderClass = $('#orderClass').val().trim();
        const priority = parseInt($('input[name="priority"]:checked').val());
        const description = $('#description').val().trim();

        // Validation
        if (!orderType || !orderClass || !priority || priority < 1 || priority > 5) {
            this.showNotification('Please fill all fields correctly', 'error');
            return;
        }

        const orderData = {
            orderType,
            orderClass,
            priority,
            description,
            createdDate: new Date().toISOString().split('T')[0],
            status: 'Active'
        };

        if (this.currentEditIndex) {
            // Edit existing order
            const index = this.allocationData.findIndex(item => item.id === this.currentEditIndex);
            this.allocationData[index] = { ...this.allocationData[index], ...orderData };
            this.showNotification('Order updated successfully', 'success');
        } else {
            // Add new order
            orderData.id = Math.max(...this.allocationData.map(item => item.id)) + 1;
            this.allocationData.push(orderData);
            this.showNotification('Order added successfully', 'success');
        }

        this.filteredData = [...this.allocationData];
        this.updateDashboard();
        this.renderCurrentView();
        this.hideOrderModal();
    },

    saveAsTemplate: function() {
        const orderType = $('#orderType').val().trim();
        const orderClass = $('#orderClass').val().trim();
        const priority = parseInt($('input[name="priority"]:checked').val());

        if (!orderType || !orderClass || !priority) {
            this.showNotification('Please fill required fields to save as template', 'error');
            return;
        }

        // In a real app, this would save to a templates database
        this.showNotification('Template saved successfully', 'success');
    },

    loadTemplate: function(templateId) {
        const templates = {
            1: { orderType: 'Customer Order', orderClass: 'Standard Order', priority: 3 },
            2: { orderType: 'Job Card', orderClass: 'Urgent Service', priority: 2 },
            3: { orderType: 'Stock Transfer', orderClass: 'Inter-branch Transfer', priority: 4 },
            4: { orderType: 'Customer Order', orderClass: 'Emergency Order', priority: 1 }
        };

        const template = templates[templateId];
        if (template) {
            $('#orderType').val(template.orderType);
            $('#orderClass').val(template.orderClass);
            $(`input[name="priority"][value="${template.priority}"]`).prop('checked', true);
            this.switchModalView('form');
            this.showNotification('Template loaded successfully', 'success');
        }
    },

    // Enhanced Priority Manager with Multiple Modes
    showPriorityManager: function() {
        this.currentPriorityMode = 'priority';
        this.switchPriorityMode('priority');
        $('#priorityManagerModal').addClass('active');
    },

    hidePriorityManager: function() {
        $('#priorityManagerModal').removeClass('active');
    },

    switchPriorityMode: function(mode) {
        this.currentPriorityMode = mode;

        // Update mode buttons
        $('.mode-btn').removeClass('active');
        $(`.mode-btn[data-mode="${mode}"]`).addClass('active');

        // Update mode content
        $('.priority-mode').removeClass('active');
        $(`#${mode}Mode`).addClass('active');

        // Render mode-specific content
        switch(mode) {
            case 'priority':
                this.renderPriorityColumns();
                break;
            case 'class':
                this.renderClassZones();
                break;
            case 'smart':
                this.renderSmartAssignment();
                break;
        }
    },

    renderPriorityColumns: function() {
        const container = $('#priorityDragColumns');
        container.empty();

        const priorityLabels = ['Critical', 'High', 'Medium', 'Low', 'Minimal'];

        for (let i = 1; i <= 5; i++) {
            const items = this.allocationData.filter(item => item.priority === i);

            const column = $(`
                <div class="priority-column" data-priority="${i}">
                    <div class="priority-column-header">
                        <div class="priority-column-title">Priority ${i} - ${priorityLabels[i-1]}</div>
                        <div class="priority-column-count">${items.length} items</div>
                    </div>
                    <div class="priority-items" id="priority-${i}-items">
                        ${items.map(item => `
                            <div class="draggable-item" draggable="true" data-id="${item.id}" data-priority="${item.priority}">
                                <div class="draggable-item-title">${item.orderType}</div>
                                <div class="draggable-item-meta">${item.orderClass}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `);

            container.append(column);
        }
    },

    renderClassZones: function() {
        const zones = [
            { id: 'criticalZoneItems', priority: 1, classes: ['Emergency Order', 'Critical Service', 'VIP Customer'] },
            { id: 'highZoneItems', priority: 2, classes: ['Job Card', 'Scheduled Service', 'Parts Return'] },
            { id: 'mediumZoneItems', priority: 3, classes: ['Customer Order', 'Parts Sales', 'Counter Sales'] },
            { id: 'lowZoneItems', priority: 4, classes: ['Promotional', 'Campaign', 'Good will'] },
            { id: 'minimalZoneItems', priority: 5, classes: ['Stock Transfer', 'Internal Order', 'FOC'] }
        ];

        zones.forEach(zone => {
            const container = $(`#${zone.id}`);
            container.empty();

            const items = this.allocationData.filter(item =>
                zone.classes.some(cls => item.orderClass.toLowerCase().includes(cls.toLowerCase())) ||
                item.priority === zone.priority
            );

            items.forEach(item => {
                container.append(`
                    <div class="draggable-item" draggable="true" data-id="${item.id}" data-priority="${item.priority}">
                        <div class="draggable-item-title">${item.orderType}</div>
                        <div class="draggable-item-meta">${item.orderClass}</div>
                    </div>
                `);
            });
        });
    },

    renderSmartAssignment: function() {
        // Smart assignment is already rendered in HTML, just update stats
        this.updateSmartAssignmentStats();
    },

    updateSmartAssignmentStats: function() {
        // Mock smart assignment analysis
        const stats = {
            toUpdate: Math.floor(Math.random() * 20) + 5,
            increases: Math.floor(Math.random() * 10) + 1,
            decreases: Math.floor(Math.random() * 8) + 1
        };

        $('.stat-number').eq(0).text(stats.toUpdate);
        $('.stat-number').eq(1).text(stats.increases);
        $('.stat-number').eq(2).text(stats.decreases);
    },

    applySmartAssignment: function() {
        // Apply smart assignment rules
        this.allocationData.forEach(item => {
            // Auto-assign based on order class
            if (item.orderClass.toLowerCase().includes('emergency') ||
                item.orderClass.toLowerCase().includes('critical')) {
                item.priority = 1;
            } else if (item.orderClass.toLowerCase().includes('job card') ||
                       item.orderClass.toLowerCase().includes('urgent')) {
                item.priority = 2;
            } else if (item.orderClass.toLowerCase().includes('customer order') ||
                       item.orderClass.toLowerCase().includes('standard')) {
                item.priority = 3;
            } else if (item.orderClass.toLowerCase().includes('promotional') ||
                       item.orderClass.toLowerCase().includes('campaign')) {
                item.priority = 4;
            } else if (item.orderClass.toLowerCase().includes('stock transfer') ||
                       item.orderClass.toLowerCase().includes('internal')) {
                item.priority = 5;
            }
        });

        this.renderPriorityColumns();
        this.showNotification('Smart assignment applied successfully', 'success');
    },

    showBulkAssignDialog: function() {
        const priority = prompt('Enter priority level (1-5) for bulk assignment:');
        if (priority && priority >= 1 && priority <= 5) {
            this.allocationData.forEach(item => {
                item.priority = parseInt(priority);
            });
            this.renderPriorityColumns();
            this.showNotification(`All orders assigned to priority ${priority}`, 'success');
        }
    },

    previewPriorityChanges: function() {
        this.showNotification('Priority changes preview feature coming soon', 'info');
    },

    initializeDragAndDrop: function() {
        const self = this;

        // Drag start
        $(document).on('dragstart', '.draggable-item', function(e) {
            $(this).addClass('dragging');
            e.originalEvent.dataTransfer.setData('text/plain', $(this).data('id'));
        });

        // Drag end
        $(document).on('dragend', '.draggable-item', function(e) {
            $(this).removeClass('dragging');
        });

        // Drag over - Priority Columns
        $(document).on('dragover', '.priority-column', function(e) {
            e.preventDefault();
            $(this).addClass('drag-over');
        });

        // Drag leave - Priority Columns
        $(document).on('dragleave', '.priority-column', function(e) {
            $(this).removeClass('drag-over');
        });

        // Drop - Priority Columns
        $(document).on('drop', '.priority-column', function(e) {
            e.preventDefault();
            $(this).removeClass('drag-over');

            const itemId = parseInt(e.originalEvent.dataTransfer.getData('text/plain'));
            const newPriority = parseInt($(this).data('priority'));

            self.updateItemPriority(itemId, newPriority);
        });

        // Drag over - Class Zones
        $(document).on('dragover', '.class-zone', function(e) {
            e.preventDefault();
            $(this).addClass('drag-over');
        });

        // Drag leave - Class Zones
        $(document).on('dragleave', '.class-zone', function(e) {
            $(this).removeClass('drag-over');
        });

        // Drop - Class Zones
        $(document).on('drop', '.class-zone', function(e) {
            e.preventDefault();
            $(this).removeClass('drag-over');

            const itemId = parseInt(e.originalEvent.dataTransfer.getData('text/plain'));
            const newPriority = parseInt($(this).data('priority'));

            self.updateItemPriority(itemId, newPriority);
            self.renderClassZones(); // Re-render class zones
        });
    },

    updateItemPriority: function(itemId, newPriority) {
        const itemIndex = this.allocationData.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
            const oldPriority = this.allocationData[itemIndex].priority;
            this.allocationData[itemIndex].priority = newPriority;

            // Re-render based on current mode
            if (this.currentPriorityMode === 'priority') {
                this.renderPriorityColumns();
            } else if (this.currentPriorityMode === 'class') {
                this.renderClassZones();
            }

            this.showNotification(`Priority updated from ${oldPriority} to ${newPriority}`, 'success');
        }
    },

    savePriorityChanges: function() {
        // In a real app, this would save to the backend
        this.filteredData = [...this.allocationData];
        this.updateDashboard();
        this.renderCurrentView();
        this.hidePriorityManager();
        this.showNotification('Priority changes saved successfully', 'success');
    },

    resetPriorities: function() {
        if (confirm('Are you sure you want to reset all priorities to default values?')) {
            this.allocationData.forEach(item => {
                item.priority = 3; // Reset to medium priority
            });

            // Re-render based on current mode
            if (this.currentPriorityMode === 'priority') {
                this.renderPriorityColumns();
            } else if (this.currentPriorityMode === 'class') {
                this.renderClassZones();
            }

            this.showNotification('All priorities reset to default', 'success');
        }
    },

    // Import Modal Functions
    showImportModal: function() {
        $('#importModal').addClass('active');
        $('#importPreview').hide();
        $('#confirmImport').prop('disabled', true);
    },

    hideImportModal: function() {
        $('#importModal').removeClass('active');
        $('#fileInput').val('');
        $('#importPreview').hide();
        $('#confirmImport').prop('disabled', true);
    },

    handleFileSelection: function(files) {
        if (files.length === 0) return;

        const file = files[0];
        const fileType = file.name.split('.').pop().toLowerCase();

        if (!['csv', 'xlsx', 'json'].includes(fileType)) {
            this.showNotification('Unsupported file format. Please use CSV, Excel, or JSON.', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                let data;
                if (fileType === 'json') {
                    data = JSON.parse(e.target.result);
                } else if (fileType === 'csv') {
                    data = this.parseCSV(e.target.result);
                } else {
                    this.showNotification('Excel import feature coming soon', 'info');
                    return;
                }

                this.previewImportData(data);
            } catch (error) {
                this.showNotification('Error reading file: ' + error.message, 'error');
            }
        };

        if (fileType === 'json' || fileType === 'csv') {
            reader.readAsText(file);
        }
    },

    parseCSV: function(csvText) {
        const lines = csvText.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
                const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = values[index] || '';
                });
                data.push(row);
            }
        }

        return data;
    },

    previewImportData: function(data) {
        const container = $('#previewTable');
        container.empty();

        if (data.length === 0) {
            container.html('<p>No data found in file.</p>');
            return;
        }

        // Create preview table
        const headers = Object.keys(data[0]);
        let tableHTML = '<table class="data-table"><thead><tr>';
        headers.forEach(header => {
            tableHTML += `<th>${header}</th>`;
        });
        tableHTML += '</tr></thead><tbody>';

        // Show first 5 rows
        data.slice(0, 5).forEach(row => {
            tableHTML += '<tr>';
            headers.forEach(header => {
                tableHTML += `<td>${row[header] || ''}</td>`;
            });
            tableHTML += '</tr>';
        });

        if (data.length > 5) {
            tableHTML += `<tr><td colspan="${headers.length}">... and ${data.length - 5} more rows</td></tr>`;
        }

        tableHTML += '</tbody></table>';
        container.html(tableHTML);

        $('#importPreview').show();
        $('#confirmImport').prop('disabled', false);

        this.importData = data;
    },

    confirmImport: function() {
        if (!this.importData) return;

        let importedCount = 0;
        const maxId = Math.max(...this.allocationData.map(item => item.id));

        this.importData.forEach((row, index) => {
            // Map CSV/JSON fields to our data structure
            const newItem = {
                id: maxId + index + 1,
                orderType: row['Order Type'] || row.orderType || 'Imported Order',
                orderClass: row['Order Class'] || row.orderClass || 'Imported Class',
                priority: parseInt(row['Priority'] || row.priority) || 3,
                status: row['Status'] || row.status || 'Active',
                createdDate: row['Created Date'] || row.createdDate || new Date().toISOString().split('T')[0],
                description: row['Description'] || row.description || ''
            };

            // Check for duplicates if option is selected
            const skipDuplicates = $('#importPreview input[type="checkbox"]').eq(0).is(':checked');
            const isDuplicate = this.allocationData.some(item =>
                item.orderType === newItem.orderType && item.orderClass === newItem.orderClass
            );

            if (!skipDuplicates || !isDuplicate) {
                this.allocationData.push(newItem);
                importedCount++;
            }
        });

        this.filteredData = [...this.allocationData];
        this.updateDashboard();
        this.renderCurrentView();
        this.hideImportModal();

        this.showNotification(`Successfully imported ${importedCount} orders`, 'success');
    },

    // Profile Stats Management
    updateProfileStats: function() {
        const activeOrders = this.allocationData.filter(item => item.status === 'Active').length;
        const highPriorityOrders = this.allocationData.filter(item => item.priority <= 2).length;
        const efficiency = Math.round((activeOrders / this.allocationData.length) * 100);

        $('.profile-stats .stat-value').eq(0).text(activeOrders);
        $('.profile-stats .stat-value').eq(1).text(highPriorityOrders);
        $('.profile-stats .stat-value').eq(2).text(efficiency + '%');
    },

    // Pagination Management
    initializePagination: function() {
        this.calculateTotalPages();
        this.updatePaginationControls();
    },

    calculateTotalPages: function() {
        this.totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
        if (this.totalPages === 0) this.totalPages = 1;
    },

    handlePagination: function(action) {
        switch(action) {
            case 'first':
                this.goToPage(1);
                break;
            case 'prev':
                if (this.currentPage > 1) {
                    this.goToPage(this.currentPage - 1);
                }
                break;
            case 'next':
                if (this.currentPage < this.totalPages) {
                    this.goToPage(this.currentPage + 1);
                }
                break;
            case 'last':
                this.goToPage(this.totalPages);
                break;
        }
    },

    goToPage: function(page) {
        if (page < 1 || page > this.totalPages) return;

        this.currentPage = page;
        this.renderCurrentView();
        this.updatePaginationControls();
    },

    updatePaginationControls: function() {
        // Update all pagination types based on current view
        switch(this.currentView) {
            case 'dashboard':
                this.updateDotsPagination();
                break;
            case 'table':
                this.updateClassicPagination();
                break;
            case 'grid':
                this.updateSliderPagination();
                break;
            case 'kanban':
                this.updateStepsPagination();
                break;
            case 'analytics':
                this.updateCardsPagination();
                break;
            case 'timeline':
                this.updateTimelinePagination();
                break;
            case 'settings':
                this.updateTabsPagination();
                break;
        }
    },

    updateDotsPagination: function() {
        const container = $('#dashboardPagination');
        const dotsContainer = container.find('.pagination-dots-container');
        dotsContainer.empty();

        for (let i = 1; i <= Math.min(this.totalPages, 5); i++) {
            const dot = $(`<span class="pagination-dot ${i === this.currentPage ? 'active' : ''}"></span>`);
            dotsContainer.append(dot);
        }

        container.find('.prev').prop('disabled', this.currentPage === 1);
        container.find('.next').prop('disabled', this.currentPage === this.totalPages);
    },

    updateClassicPagination: function() {
        const container = $('#tablePagination');
        const numbersContainer = container.find('.pagination-numbers');
        numbersContainer.empty();

        // Calculate page range
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(this.totalPages, startPage + 4);

        // Add page numbers
        for (let i = startPage; i <= endPage; i++) {
            const number = $(`<button class="pagination-number ${i === this.currentPage ? 'active' : ''}">${i}</button>`);
            numbersContainer.append(number);
        }

        // Add ellipsis and last page if needed
        if (endPage < this.totalPages) {
            numbersContainer.append('<span class="pagination-ellipsis">...</span>');
            numbersContainer.append(`<button class="pagination-number">${this.totalPages}</button>`);
        }

        // Update info
        const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
        const endItem = Math.min(this.currentPage * this.itemsPerPage, this.filteredData.length);
        container.find('.pagination-info span').text(`Showing ${startItem}-${endItem} of ${this.filteredData.length} items`);

        // Update buttons
        container.find('.first, .prev').prop('disabled', this.currentPage === 1);
        container.find('.next, .last').prop('disabled', this.currentPage === this.totalPages);
    },

    updateSliderPagination: function() {
        const container = $('#gridPagination');
        const slider = container.find('.pagination-range');

        slider.attr('max', this.totalPages);
        slider.val(this.currentPage);
        container.find('.slider-label').text(`Page ${this.currentPage} of ${this.totalPages}`);

        container.find('.prev').prop('disabled', this.currentPage === 1);
        container.find('.next').prop('disabled', this.currentPage === this.totalPages);
    },

    updateStepsPagination: function() {
        const container = $('#kanbanPagination');
        container.find('.pagination-step').removeClass('active');
        container.find('.pagination-step').eq(this.currentPage - 1).addClass('active');
    },

    updateCardsPagination: function() {
        const container = $('#analyticsPagination');
        container.find('.pagination-card').removeClass('active');
        container.find('.pagination-card').eq(this.currentPage - 1).addClass('active');
    },

    updateTimelinePagination: function() {
        const container = $('#timelinePagination');
        container.find('.timeline-period').removeClass('active');
        container.find('.timeline-period').eq(this.currentPage - 1).addClass('active');
    },

    updateTabsPagination: function() {
        const container = $('#settingsPagination');
        container.find('.pagination-tab').removeClass('active');
        container.find('.pagination-tab').eq(this.currentPage - 1).addClass('active');
    },

    getPaginatedData: function() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return this.filteredData.slice(startIndex, endIndex);
    },

    // Enhanced Navigation Search Functionality
    handleNavigationSearch: function(searchTerm) {
        const $clearBtn = $('#navSearchClear');

        if (searchTerm.length > 0) {
            $clearBtn.show();
        } else {
            $clearBtn.hide();
            this.resetNavigationSearch();
            return;
        }

        const searchLower = searchTerm.toLowerCase();
        let hasResults = false;

        // Clear previous highlights
        this.clearSearchHighlights();

        // Hide all sections initially
        $('.nav-section').hide();
        $('.nav-link').hide();
        $('.submenu-item').hide();

        // Search through navigation items
        $('.nav-section').each(function() {
            const $section = $(this);
            let sectionHasResults = false;

            // Search main navigation links
            $section.find('.nav-link').each(function() {
                const $link = $(this);
                const linkText = $link.find('span').first().text().toLowerCase();
                let linkHasResults = false;

                // Check if main link matches
                if (linkText.includes(searchLower)) {
                    $link.show();
                    linkHasResults = true;
                    sectionHasResults = true;
                    hasResults = true;
                }

                // Search submenu items
                $link.find('.submenu-item').each(function() {
                    const $submenuItem = $(this);
                    const submenuText = $submenuItem.find('span').text().toLowerCase();

                    if (submenuText.includes(searchLower)) {
                        $submenuItem.show();
                        $link.show();
                        $link.addClass('expanded'); // Auto-expand parent
                        linkHasResults = true;
                        sectionHasResults = true;
                        hasResults = true;
                    }
                });

                // If link has results, show its submenu container
                if (linkHasResults) {
                    $link.find('.nav-submenu').css('opacity', '1').css('visibility', 'visible');
                }
            });

            // Show section if it has results
            if (sectionHasResults) {
                $section.show();
            }
        });

        // Show "no results" message if needed
        if (!hasResults) {
            this.showNoSearchResults();
        }

        // Highlight search results
        this.highlightSearchResults(searchTerm);
    },

    resetNavigationSearch: function() {
        $('.nav-section').show();
        $('.nav-link').show();
        $('.submenu-item').show();
        $('.nav-link').removeClass('expanded');
        $('.nav-submenu').css('opacity', '').css('visibility', '');
        this.clearSearchHighlights();
        this.hideNoSearchResults();
    },

    clearSearchHighlights: function() {
        $('.nav-link span, .submenu-item span').each(function() {
            const $span = $(this);
            const text = $span.text(); // Get plain text without HTML
            $span.text(text); // Reset to plain text
        });
    },

    highlightSearchResults: function(searchTerm) {
        if (!searchTerm) return;

        const regex = new RegExp(`(${searchTerm})`, 'gi');

        // Highlight in visible navigation links
        $('.nav-link:visible span').first().each(function() {
            const $span = $(this);
            const text = $span.text();
            if (text.toLowerCase().includes(searchTerm.toLowerCase())) {
                const highlightedText = text.replace(regex, '<mark style="background-color: #ffeb3b; color: #000; padding: 1px 2px; border-radius: 2px;">$1</mark>');
                $span.html(highlightedText);
            }
        });

        // Highlight in visible submenu items
        $('.submenu-item:visible span').each(function() {
            const $span = $(this);
            const text = $span.text();
            if (text.toLowerCase().includes(searchTerm.toLowerCase())) {
                const highlightedText = text.replace(regex, '<mark style="background-color: #ffeb3b; color: #000; padding: 1px 2px; border-radius: 2px;">$1</mark>');
                $span.html(highlightedText);
            }
        });
    },

    showNoSearchResults: function() {
        if ($('#noSearchResults').length === 0) {
            $('.sidebar-nav').append(`
                <div id="noSearchResults" class="no-search-results">
                    <div class="no-results-icon">
                        <i class="material-icons">search_off</i>
                    </div>
                    <div class="no-results-text">
                        <h4>No results found</h4>
                        <p>Try searching with different keywords</p>
                    </div>
                </div>
            `);
        }
        $('#noSearchResults').show();
    },

    hideNoSearchResults: function() {
        $('#noSearchResults').hide();
    },

    // Scheduling Functionality
    handleSchedulePeriodChange: function(period) {
        // Update active button
        $('.schedule-btn').removeClass('active');
        $(`.schedule-btn[data-period="${period}"]`).addClass('active');

        // Update period display
        const periodNames = {
            'day': 'Today',
            'week': 'This Week',
            'month': 'This Month',
            'year': 'This Year'
        };

        $('#currentPeriod').text(periodNames[period]);

        // Calculate business metrics based on period
        this.updateScheduleMetrics(period);

        // Update charts and data based on period
        this.updateDashboardForPeriod(period);

        this.showNotification(`Switched to ${periodNames[period]} view`, 'success');
    },

    updateScheduleMetrics: function(period) {
        // Simulate business logic for different periods
        let orderCount = this.allocationData.length;
        let avgPriority = 0;

        // Calculate average priority
        const totalPriority = this.allocationData.reduce((sum, item) => sum + item.priority, 0);
        avgPriority = (totalPriority / orderCount).toFixed(1);

        // Simulate different metrics based on period
        switch(period) {
            case 'day':
                orderCount = Math.floor(orderCount * 0.3); // 30% of orders for today
                break;
            case 'week':
                orderCount = Math.floor(orderCount * 0.7); // 70% of orders for this week
                break;
            case 'month':
                orderCount = orderCount; // All orders for this month
                break;
            case 'year':
                orderCount = Math.floor(orderCount * 4.2); // Projected yearly orders
                avgPriority = (parseFloat(avgPriority) * 0.9).toFixed(1); // Slightly better avg over year
                break;
        }

        // Update display
        $('#periodOrders').text(orderCount);
        $('#avgPriority').text(avgPriority);
    },

    updateDashboardForPeriod: function(period) {
        // Update dashboard statistics based on selected period
        // This would typically filter data by date range in a real application

        // For demo purposes, we'll simulate different data
        let filteredData = [...this.allocationData];

        switch(period) {
            case 'day':
                // Show only recent orders
                filteredData = filteredData.slice(0, 3);
                break;
            case 'week':
                // Show most orders
                filteredData = filteredData.slice(0, 7);
                break;
            case 'month':
                // Show all current orders
                filteredData = this.allocationData;
                break;
            case 'year':
                // Show projected data (duplicate some orders for demo)
                filteredData = [...this.allocationData, ...this.allocationData.slice(0, 5)];
                break;
        }

        // Update the filtered data temporarily for display
        const originalFiltered = this.filteredData;
        this.filteredData = filteredData;

        // Update dashboard components
        this.updateDashboard();
        this.renderOrderTypesList();

        // Restore original filtered data
        this.filteredData = originalFiltered;
    },

    // Enhanced Calendar and Scheduling Functions
    navigateCalendar: function(direction) {
        // Initialize current date if not set
        if (!this.currentCalendarDate) {
            this.currentCalendarDate = new Date();
        }

        // Navigate calendar
        if (direction === 'prev') {
            this.currentCalendarDate.setMonth(this.currentCalendarDate.getMonth() - 1);
        } else {
            this.currentCalendarDate.setMonth(this.currentCalendarDate.getMonth() + 1);
        }

        // Update calendar display
        this.renderCalendar();
        this.updateCalendarTitle();
    },

    updateCalendarTitle: function() {
        if (!this.currentCalendarDate) {
            this.currentCalendarDate = new Date();
        }

        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const title = `${monthNames[this.currentCalendarDate.getMonth()]} ${this.currentCalendarDate.getFullYear()}`;
        $('#calendarTitle, #calendarTitleMain').text(title);
    },

    renderCalendar: function() {
        if (!this.currentCalendarDate) {
            this.currentCalendarDate = new Date();
        }

        // Render for both dashboard and scheduling view
        const containers = ['#calendarContent', '#calendarGrid'];

        containers.forEach(containerSelector => {
            const container = $(containerSelector);
            if (container.length === 0) return;

            container.empty();

            // Add calendar header days for grid view
            if (containerSelector === '#calendarGrid') {
                const headerDays = $('<div class="calendar-header-days"></div>');
                const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                dayNames.forEach(day => {
                    headerDays.append(`<div class="calendar-header-day">${day}</div>`);
                });
                container.before(headerDays);
            }

            // For dashboard, create a simpler mini calendar
            if (containerSelector === '#calendarContent') {
                this.renderMiniCalendar(container);
                return;
            }

            // Get first day of month and number of days
            const firstDay = new Date(this.currentCalendarDate.getFullYear(), this.currentCalendarDate.getMonth(), 1);
            const lastDay = new Date(this.currentCalendarDate.getFullYear(), this.currentCalendarDate.getMonth() + 1, 0);
            const startDate = new Date(firstDay);
            startDate.setDate(startDate.getDate() - firstDay.getDay());

            // Generate calendar days
            for (let i = 0; i < 42; i++) { // 6 weeks
                const currentDate = new Date(startDate);
                currentDate.setDate(startDate.getDate() + i);

                const isCurrentMonth = currentDate.getMonth() === this.currentCalendarDate.getMonth();
                const isToday = this.isToday(currentDate);
                const ordersForDay = this.getOrdersForDate(currentDate);

                const dayElement = $(`
                    <div class="calendar-day ${isToday ? 'today' : ''} ${ordersForDay.length > 0 ? 'has-orders' : ''}"
                         data-date="${currentDate.toISOString().split('T')[0]}">
                        <div class="calendar-day-number">${currentDate.getDate()}</div>
                        <div class="calendar-day-orders">
                            ${this.renderOrderDots(ordersForDay)}
                        </div>
                    </div>
                `);

                if (!isCurrentMonth) {
                    dayElement.css('opacity', '0.3');
                }

                container.append(dayElement);
            }
        });
    },

    renderMiniCalendar: function(container) {
        // Create a simplified calendar for dashboard
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        // Show current week
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());

        container.append('<div class="mini-calendar-header">This Week\'s Schedule</div>');

        const weekContainer = $('<div class="mini-calendar-week"></div>');

        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);

            const isToday = this.isToday(date);
            const ordersForDay = this.getOrdersForDate(date);
            const dayName = date.toLocaleDateString('en', { weekday: 'short' });

            weekContainer.append(`
                <div class="mini-calendar-day ${isToday ? 'today' : ''}">
                    <div class="mini-day-name">${dayName}</div>
                    <div class="mini-day-number">${date.getDate()}</div>
                    <div class="mini-day-orders">${ordersForDay.length}</div>
                </div>
            `);
        }

        container.append(weekContainer);
    },

    isToday: function(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    },

    getOrdersForDate: function(date) {
        // Simulate orders for different dates
        const dayOfMonth = date.getDate();
        const orders = [];

        // Add some sample orders based on day
        if (dayOfMonth % 3 === 0) {
            orders.push({ priority: 1 });
        }
        if (dayOfMonth % 5 === 0) {
            orders.push({ priority: 2 });
        }
        if (dayOfMonth % 2 === 0) {
            orders.push({ priority: 3 });
        }
        if (dayOfMonth % 7 === 0) {
            orders.push({ priority: 4 });
        }

        return orders;
    },

    renderOrderDots: function(orders) {
        return orders.map(order =>
            `<div class="calendar-order-dot priority-${order.priority}"></div>`
        ).join('');
    },

    showDayDetails: function(date) {
        const orders = this.getOrdersForDate(new Date(date));
        const formattedDate = new Date(date).toLocaleDateString();

        this.showNotification(`${formattedDate}: ${orders.length} orders scheduled`, 'info');
    },

    renderScheduling: function() {
        // Initialize calendar if not already done
        if (!this.currentCalendarDate) {
            this.currentCalendarDate = new Date();
        }

        this.updateCalendarTitle();
        this.renderCalendar();
        this.renderScheduleCharts();
    },

    renderScheduleCharts: function() {
        this.renderPriorityChart();
        this.renderWorkloadChart();
    },

    renderPriorityChart: function() {
        const container = $('#schedulePriorityChart');
        if (container.length === 0) return;

        container.empty();

        // Calculate priority distribution
        const priorityCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        this.allocationData.forEach(item => {
            priorityCount[item.priority]++;
        });

        // Create priority bars
        for (let i = 1; i <= 5; i++) {
            const count = priorityCount[i];
            const percentage = (count / this.allocationData.length) * 100;
            const height = Math.max(percentage, 5); // Minimum height for visibility

            const priorityLabels = {
                1: 'Critical',
                2: 'High',
                3: 'Medium',
                4: 'Low',
                5: 'Minimal'
            };

            container.append(`
                <div class="priority-bar priority-${i}" style="height: ${height}%">
                    <div class="priority-bar-value">${count}</div>
                    <div class="priority-bar-label">${priorityLabels[i]}</div>
                </div>
            `);
        }
    },

    renderWorkloadChart: function() {
        const container = $('#scheduleWorkloadChart');
        if (container.length === 0) return;

        container.empty();

        // Generate workload data for next 7 days
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const workloadData = [8, 12, 6, 15, 10, 4, 2]; // Sample workload

        days.forEach((day, index) => {
            const workload = workloadData[index];
            const height = (workload / 15) * 100; // Normalize to max 15

            container.append(`
                <div class="workload-day">
                    <div class="workload-bar" style="height: ${height}%"></div>
                    <div class="workload-label">${day}</div>
                </div>
            `);
        });
    },

    // Schedule Action Functions
    createSchedule: function() {
        this.showNotification('Schedule creation wizard coming soon', 'info');
    },

    exportSchedule: function() {
        this.showNotification('Exporting schedule...', 'info');

        // Simulate export process
        setTimeout(() => {
            this.showNotification('Schedule exported successfully', 'success');
        }, 1500);
    },

    printSchedule: function() {
        this.showNotification('Preparing schedule for printing...', 'info');

        // Simulate print preparation
        setTimeout(() => {
            window.print();
        }, 1000);
    },

    // Keyboard Navigation System
    initializeKeyboardNavigation: function() {
        const self = this;

        $(document).on('keydown', function(e) {
            // Global keyboard shortcuts
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'n': // Ctrl+N - New Order
                        e.preventDefault();
                        self.showModal('add');
                        break;
                    case 's': // Ctrl+S - Save
                        e.preventDefault();
                        if ($('#orderModal').is(':visible')) {
                            self.saveOrder();
                        }
                        break;
                    case 'f': // Ctrl+F - Focus Search
                        e.preventDefault();
                        $('#searchInput').focus();
                        break;
                    case 'p': // Ctrl+P - Priority Manager
                        e.preventDefault();
                        self.showPriorityManager();
                        break;
                    case 'i': // Ctrl+I - Import
                        e.preventDefault();
                        self.showImportModal();
                        break;
                    case 'e': // Ctrl+E - Export
                        e.preventDefault();
                        self.exportData();
                        break;
                }
            }

            // Navigation shortcuts (Alt + Number)
            if (e.altKey) {
                switch(e.key) {
                    case '1':
                        e.preventDefault();
                        self.switchView('dashboard');
                        break;
                    case '2':
                        e.preventDefault();
                        self.switchView('table');
                        break;
                    case '3':
                        e.preventDefault();
                        self.switchView('grid');
                        break;
                    case '4':
                        e.preventDefault();
                        self.switchView('kanban');
                        break;
                    case '5':
                        e.preventDefault();
                        self.switchView('scheduling');
                        break;
                    case '6':
                        e.preventDefault();
                        self.switchView('analytics');
                        break;
                    case '7':
                        e.preventDefault();
                        self.switchView('timeline');
                        break;
                    case '8':
                        e.preventDefault();
                        self.switchView('settings');
                        break;
                }
            }

            // Modal navigation
            if ($('.modal:visible').length > 0) {
                switch(e.key) {
                    case 'Escape':
                        e.preventDefault();
                        self.closeModal();
                        break;
                    case 'Tab':
                        self.handleModalTabNavigation(e);
                        break;
                    case 'Enter':
                        if (e.target.tagName !== 'TEXTAREA') {
                            e.preventDefault();
                            self.handleModalEnter(e);
                        }
                        break;
                }
            }

            // Search dropdown navigation
            if ($('.search-dropdown-menu:visible').length > 0) {
                self.handleDropdownNavigation(e);
            }

            // Table navigation
            if (self.currentView === 'table') {
                self.handleTableNavigation(e);
            }
        });
    },

    handleModalTabNavigation: function(e) {
        const modal = $('.modal:visible');
        const focusableElements = modal.find('input, select, textarea, button, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements.first();
        const lastElement = focusableElements.last();

        if (e.shiftKey) {
            if ($(e.target).is(firstElement)) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if ($(e.target).is(lastElement)) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    },

    handleModalEnter: function(e) {
        if ($(e.target).hasClass('btn-primary')) {
            $(e.target).click();
        } else {
            const modal = $('.modal:visible');
            const primaryButton = modal.find('.btn-primary').first();
            if (primaryButton.length) {
                primaryButton.click();
            }
        }
    },

    handleDropdownNavigation: function(e) {
        const dropdown = $('.search-dropdown-menu:visible');
        const items = dropdown.find('.search-dropdown-item');
        const currentIndex = items.index(items.filter('.highlighted'));

        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
                items.removeClass('highlighted');
                items.eq(nextIndex).addClass('highlighted');
                break;
            case 'ArrowUp':
                e.preventDefault();
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
                items.removeClass('highlighted');
                items.eq(prevIndex).addClass('highlighted');
                break;
            case 'Enter':
                e.preventDefault();
                const highlighted = items.filter('.highlighted');
                if (highlighted.length) {
                    highlighted.click();
                } else {
                    items.first().click();
                }
                break;
            case 'Escape':
                e.preventDefault();
                dropdown.hide();
                break;
        }
    },

    handleTableNavigation: function(e) {
        const table = $('#dataTable');
        const rows = table.find('tbody tr');
        const currentRow = rows.filter('.selected');

        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (currentRow.length) {
                    const nextRow = currentRow.next();
                    if (nextRow.length) {
                        rows.removeClass('selected');
                        nextRow.addClass('selected');
                    }
                } else {
                    rows.first().addClass('selected');
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (currentRow.length) {
                    const prevRow = currentRow.prev();
                    if (prevRow.length) {
                        rows.removeClass('selected');
                        prevRow.addClass('selected');
                    }
                } else {
                    rows.last().addClass('selected');
                }
                break;
            case 'Enter':
                e.preventDefault();
                if (currentRow.length) {
                    const id = currentRow.data('id');
                    this.showModal('edit', id);
                }
                break;
            case 'Delete':
                e.preventDefault();
                if (currentRow.length) {
                    const id = currentRow.data('id');
                    this.deleteOrder(id);
                }
                break;
        }
    },

    // Analytics Functions
    switchAnalyticsSection: function(section) {
        $('.analytics-section').removeClass('active');
        $(`#${section}Section`).addClass('active');

        $('.pagination-card').removeClass('active');
        $(`.pagination-card[data-section="${section}"]`).addClass('active');

        // Render section-specific content
        this.renderAnalyticsSection(section);
    },

    renderAnalyticsSection: function(section) {
        switch(section) {
            case 'performance':
                this.renderPerformanceMetrics();
                break;
            case 'trends':
                this.renderTrendAnalysis();
                break;
            case 'distribution':
                this.renderDistributionAnalysis();
                break;
            case 'comparison':
                this.renderComparisonAnalysis();
                break;
        }
    },

    renderPerformanceMetrics: function() {
        // Performance metrics are already rendered in HTML
        this.showNotification('Performance metrics updated', 'info');
    },

    renderTrendAnalysis: function() {
        $('#volumeTrendChart').html('<div style="padding: 80px; text-align: center; color: #666;">Volume Trend Chart<br><small>Interactive chart coming soon</small></div>');
        $('#priorityTrendChart').html('<div style="padding: 80px; text-align: center; color: #666;">Priority Trend Chart<br><small>Interactive chart coming soon</small></div>');
    },

    renderDistributionAnalysis: function() {
        $('#priorityDonutChart').html('<div style="padding: 80px; text-align: center; color: #666;">Priority Distribution<br><small>Donut chart coming soon</small></div>');
        $('#orderTypeDistribution').html('<div style="padding: 80px; text-align: center; color: #666;">Order Type Distribution<br><small>Bar chart coming soon</small></div>');
    },

    renderComparisonAnalysis: function() {
        $('#periodComparisonChart').html('<div style="padding: 80px; text-align: center; color: #666;">Period Comparison<br><small>Comparison chart coming soon</small></div>');
        $('#benchmarkChart').html('<div style="padding: 80px; text-align: center; color: #666;">Benchmark Analysis<br><small>Benchmark chart coming soon</small></div>');
    },

    updateAnalyticsTimeRange: function(range) {
        this.currentTimeRange = range;
        this.showNotification(`Analytics updated for ${range} period`, 'info');

        // Update all visible charts with new time range
        const activeSection = $('.analytics-section.active').attr('id').replace('Section', '');
        this.renderAnalyticsSection(activeSection);
    },

    // Additional Quick Action Functions
    showBulkImport: function() {
        this.showNotification('Bulk import feature coming soon', 'info');
    },

    generateReports: function() {
        this.showNotification('Report generation feature coming soon', 'info');
    },

    // Navigation Search System
    initializeNavigationSearch: function() {
        this.navigationItems = [
            // Core Modules
            { title: 'Allocation Priority', module: 'core', submenu: 'allocation', path: 'Core > Master > Allocation Priority', icon: 'sort' },
            { title: 'Item Master', module: 'core', submenu: 'items', path: 'Core > Master > Item Master', icon: 'inventory' },
            { title: 'Customer Master', module: 'core', submenu: 'customers', path: 'Core > Master > Customer Master', icon: 'people' },
            { title: 'Vendor Master', module: 'core', submenu: 'vendors', path: 'Core > Master > Vendor Master', icon: 'business' },
            { title: 'Location Master', module: 'core', submenu: 'locations', path: 'Core > Master > Location Master', icon: 'location_on' },

            // Helpdesk
            { title: 'Tickets', module: 'helpdesk', submenu: 'tickets', path: 'Helpdesk > Support > Tickets', icon: 'confirmation_number' },
            { title: 'Knowledge Base', module: 'helpdesk', submenu: 'kb', path: 'Helpdesk > Support > Knowledge Base', icon: 'library_books' },
            { title: 'Support Chat', module: 'helpdesk', submenu: 'chat', path: 'Helpdesk > Support > Support Chat', icon: 'chat' },
            { title: 'Community', module: 'helpdesk', submenu: 'community', path: 'Helpdesk > Support > Community', icon: 'forum' },

            // Parts
            { title: 'Inventory', module: 'parts', submenu: 'inventory', path: 'Parts > Management > Inventory', icon: 'inventory_2' },
            { title: 'Suppliers', module: 'parts', submenu: 'suppliers', path: 'Parts > Management > Suppliers', icon: 'local_shipping' },
            { title: 'Procurement', module: 'parts', submenu: 'procurement', path: 'Parts > Management > Procurement', icon: 'shopping_cart' },
            { title: 'Part Catalog', module: 'parts', submenu: 'catalog', path: 'Parts > Management > Part Catalog', icon: 'qr_code' },

            // Service
            { title: 'Work Orders', module: 'service', submenu: 'workorders', path: 'Service > Operations > Work Orders', icon: 'assignment' },
            { title: 'Technicians', module: 'service', submenu: 'technicians', path: 'Service > Operations > Technicians', icon: 'engineering' },
            { title: 'Maintenance', module: 'service', submenu: 'maintenance', path: 'Service > Operations > Maintenance', icon: 'build_circle' },
            { title: 'Scheduling', module: 'service', submenu: 'scheduling', path: 'Service > Operations > Scheduling', icon: 'schedule' },

            // HANA
            { title: 'Database', module: 'hana', submenu: 'database', path: 'HANA > Data Platform > Database', icon: 'database' },
            { title: 'Analytics', module: 'hana', submenu: 'analytics', path: 'HANA > Data Platform > Analytics', icon: 'analytics' },
            { title: 'Reports', module: 'hana', submenu: 'reports', path: 'HANA > Data Platform > Reports', icon: 'assessment' },
            { title: 'Insights', module: 'hana', submenu: 'insights', path: 'HANA > Data Platform > Insights', icon: 'insights' },

            // Management
            { title: 'BAM Scheduler', module: 'scheduler', submenu: null, path: 'Management > BAM Scheduler', icon: 'schedule' },
            { title: 'Config', module: 'config', submenu: null, path: 'Management > Config', icon: 'tune' },
            { title: 'Dashboard', module: 'dashboard', submenu: null, path: 'Management > Dashboard', icon: 'dashboard' },
            { title: 'Job Events', module: 'events', submenu: null, path: 'Management > Job Events', icon: 'event' },

            // Business
            { title: 'Contract Management', module: 'contract', submenu: null, path: 'Business > Contract MGMT', icon: 'business_center' },
            { title: 'Digital Catalogue', module: 'catalogue', submenu: null, path: 'Business > Digital Catalogue', icon: 'library_books' },
            { title: 'Special Tools', module: 'tools', submenu: null, path: 'Business > Special Tools', icon: 'construction' },
            { title: 'Warranty', module: 'warranty', submenu: null, path: 'Business > Warranty', icon: 'verified_user' }
        ];
    },

    handleNavigationSearch: function(query) {
        const results = $('#navSearchResults');

        if (!query.trim()) {
            results.hide();
            return;
        }

        const filteredItems = this.navigationItems.filter(item =>
            item.title.toLowerCase().includes(query) ||
            item.path.toLowerCase().includes(query) ||
            item.module.toLowerCase().includes(query)
        );

        if (filteredItems.length === 0) {
            results.html(`
                <div class="nav-search-no-results">
                    <i class="material-icons">search_off</i>
                    <p>No menu items found for "${query}"</p>
                </div>
            `).show();
            return;
        }

        const resultsHtml = filteredItems.map(item => `
            <div class="nav-search-result-item" data-module="${item.module}" data-submenu="${item.submenu || ''}">
                <i class="material-icons">${item.icon}</i>
                <div class="nav-search-result-content">
                    <div class="nav-search-result-title">${item.title}</div>
                    <div class="nav-search-result-path">${item.path}</div>
                </div>
            </div>
        `).join('');

        results.html(resultsHtml).show();
    },

    navigateToModule: function(module, submenu) {
        // Highlight the navigation item
        $('.nav-link').removeClass('active');
        $(`.nav-link[data-module="${module}"]`).addClass('active');

        // If submenu exists, expand and highlight it
        if (submenu) {
            const navLink = $(`.nav-link[data-module="${module}"]`);
            navLink.addClass('expanded');
            navLink.find('.nav-submenu').show();
            navLink.find(`.submenu-item[data-submenu="${submenu}"]`).addClass('active');
        }

        this.showNotification(`Navigated to ${module}${submenu ? ' > ' + submenu : ''}`, 'info');
    },

    // Enhanced Scheduling Functions
    initializeScheduling: function() {
        this.currentWeek = new Date();
        this.updateTodayDate();
        this.updateWeekTitle();
        this.renderWeeklySchedule();
        this.updateScheduleBoxes();
    },

    updateTodayDate: function() {
        const today = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        $('#todayDate').text(today.toLocaleDateString('en-US', options));
    },

    updateWeekTitle: function() {
        const startOfWeek = new Date(this.currentWeek);
        startOfWeek.setDate(this.currentWeek.getDate() - this.currentWeek.getDay());

        const weekNumber = this.getWeekNumber(startOfWeek);
        const year = startOfWeek.getFullYear();

        $('#weekTitle').text(`Week ${weekNumber}, ${year}`);
    },

    getWeekNumber: function(date) {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    },

    navigateWeek: function(direction) {
        const daysToAdd = direction === 'next' ? 7 : -7;
        this.currentWeek.setDate(this.currentWeek.getDate() + daysToAdd);

        this.updateWeekTitle();
        this.renderWeeklySchedule();
    },

    renderWeeklySchedule: function() {
        const container = $('#weeklyScheduleGrid');
        container.empty();

        const startOfWeek = new Date(this.currentWeek);
        startOfWeek.setDate(this.currentWeek.getDate() - this.currentWeek.getDay());

        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date();

        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(startOfWeek);
            currentDate.setDate(startOfWeek.getDate() + i);

            const isToday = this.isToday(currentDate);
            const ordersCount = this.getOrdersCountForDate(currentDate);

            const dayElement = $(`
                <div class="weekly-day ${isToday ? 'today' : ''}" data-date="${currentDate.toISOString().split('T')[0]}">
                    <div class="weekly-day-name">${dayNames[i]}</div>
                    <div class="weekly-day-number">${currentDate.getDate()}</div>
                    <div class="weekly-day-orders">${ordersCount}</div>
                </div>
            `);

            container.append(dayElement);
        }
    },

    getOrdersCountForDate: function(date) {
        // Simulate order counts based on day
        const dayOfWeek = date.getDay();
        const baseCount = Math.floor(Math.random() * 10) + 1;

        // Weekdays typically have more orders
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            return baseCount + Math.floor(Math.random() * 5);
        }

        // Weekends have fewer orders
        return Math.floor(baseCount / 2);
    },

    updateScheduleBoxes: function() {
        // Simulate real-time data updates
        const urgentCount = Math.floor(Math.random() * 5) + 1;
        const pendingCount = Math.floor(Math.random() * 10) + 5;
        const progressCount = Math.floor(Math.random() * 8) + 3;
        const completedCount = Math.floor(Math.random() * 15) + 10;

        $('#urgentCount').text(urgentCount);
        $('#pendingCount').text(pendingCount);
        $('#progressCount').text(progressCount);
        $('#completedCount').text(completedCount);

        // Update efficiency based on completion rate
        const totalOrders = urgentCount + pendingCount + progressCount + completedCount;
        const efficiency = Math.round((completedCount / totalOrders) * 100);
        $('#todayEfficiency').text(`${efficiency}%`);
    },

    showScheduleDetails: function(type) {
        const typeLabels = {
            urgent: 'Urgent Orders',
            pending: 'Pending Orders',
            progress: 'Orders In Progress',
            completed: 'Completed Orders'
        };

        const count = $(`#${type}Count`).text();
        this.showNotification(`${typeLabels[type]}: ${count} orders`, 'info');
    },

    showDaySchedule: function(date) {
        const formattedDate = new Date(date).toLocaleDateString();
        const ordersCount = this.getOrdersCountForDate(new Date(date));
        this.showNotification(`${formattedDate}: ${ordersCount} orders scheduled`, 'info');
    },

    // Quick Schedule Actions
    quickCreateSchedule: function() {
        this.showNotification('Opening schedule creation wizard...', 'info');
        // Could open a modal or navigate to scheduling view
        setTimeout(() => {
            this.showNotification('Schedule creation feature coming soon', 'info');
        }, 1000);
    },

    quickReschedule: function() {
        this.showNotification('Opening reschedule options...', 'info');
        setTimeout(() => {
            this.showNotification('Reschedule feature coming soon', 'info');
        }, 1000);
    },

    quickOptimize: function() {
        this.showNotification('Optimizing schedule allocation...', 'info');

        // Simulate optimization process
        setTimeout(() => {
            this.updateScheduleBoxes();
            this.showNotification('Schedule optimized successfully!', 'success');
        }, 2000);
    },

    quickScheduleReport: function() {
        this.showNotification('Generating schedule report...', 'info');

        setTimeout(() => {
            this.showNotification('Schedule report generated successfully', 'success');
        }, 1500);
    },

    // Enhanced Features
    initializeEnhancedFeatures: function() {
        this.updateBreadcrumb();
        this.initializeRealTimeUpdates();
        this.setupResponsiveHandlers();
    },

    // Mobile Menu Functions
    toggleMobileMenu: function() {
        const sidebar = $('.sidebar');
        const overlay = $('#sidebarOverlay');

        if (sidebar.hasClass('open')) {
            this.closeMobileMenu();
        } else {
            sidebar.addClass('open');
            overlay.addClass('active');
            $('body').addClass('menu-open');
        }
    },

    closeMobileMenu: function() {
        $('.sidebar').removeClass('open');
        $('#sidebarOverlay').removeClass('active');
        $('body').removeClass('menu-open');
    },

    // Header Action Functions
    showNotifications: function() {
        const notifications = [
            {
                id: 1,
                title: 'High Priority Order',
                message: 'Order #12345 requires immediate attention',
                time: '2 minutes ago',
                type: 'urgent'
            },
            {
                id: 2,
                title: 'System Update',
                message: 'Scheduled maintenance at 2:00 AM',
                time: '1 hour ago',
                type: 'info'
            },
            {
                id: 3,
                title: 'New Order Received',
                message: 'Customer order #12346 has been created',
                time: '3 hours ago',
                type: 'success'
            }
        ];

        this.showNotificationPanel(notifications);
    },

    showNotificationPanel: function(notifications) {
        const panel = $(`
            <div class="notification-panel" id="notificationPanel">
                <div class="notification-header">
                    <h3>Notifications</h3>
                    <button class="close-btn" id="closeNotifications">
                        <i class="material-icons">close</i>
                    </button>
                </div>
                <div class="notification-list">
                    ${notifications.map(notif => `
                        <div class="notification-item ${notif.type}">
                            <div class="notification-icon">
                                <i class="material-icons">${this.getNotificationIcon(notif.type)}</i>
                            </div>
                            <div class="notification-content">
                                <div class="notification-title">${notif.title}</div>
                                <div class="notification-message">${notif.message}</div>
                                <div class="notification-time">${notif.time}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="notification-actions">
                    <button class="btn btn-secondary" id="markAllRead">Mark All Read</button>
                    <button class="btn btn-primary" id="viewAllNotifications">View All</button>
                </div>
            </div>
        `);

        $('body').append(panel);
        panel.addClass('show');

        // Close handlers
        $(document).on('click', '#closeNotifications, #notificationPanel .close-btn', function() {
            panel.removeClass('show');
            setTimeout(() => panel.remove(), 300);
        });
    },

    getNotificationIcon: function(type) {
        const icons = {
            urgent: 'priority_high',
            info: 'info',
            success: 'check_circle',
            warning: 'warning'
        };
        return icons[type] || 'notifications';
    },

    showHelp: function() {
        const helpContent = `
            <div class="help-panel" id="helpPanel">
                <div class="help-header">
                    <h3>Help & Shortcuts</h3>
                    <button class="close-btn" id="closeHelp">
                        <i class="material-icons">close</i>
                    </button>
                </div>
                <div class="help-content">
                    <div class="help-section">
                        <h4>Keyboard Shortcuts</h4>
                        <div class="shortcut-list">
                            <div class="shortcut-item">
                                <kbd>Ctrl + N</kbd>
                                <span>New Order</span>
                            </div>
                            <div class="shortcut-item">
                                <kbd>Ctrl + F</kbd>
                                <span>Focus Search</span>
                            </div>
                            <div class="shortcut-item">
                                <kbd>Alt + 1-8</kbd>
                                <span>Switch Views</span>
                            </div>
                            <div class="shortcut-item">
                                <kbd>F1</kbd>
                                <span>Show Help</span>
                            </div>
                            <div class="shortcut-item">
                                <kbd>F11</kbd>
                                <span>Fullscreen</span>
                            </div>
                            <div class="shortcut-item">
                                <kbd>Esc</kbd>
                                <span>Close Modals</span>
                            </div>
                        </div>
                    </div>
                    <div class="help-section">
                        <h4>Quick Actions</h4>
                        <div class="action-list">
                            <div class="action-item">
                                <i class="material-icons">add</i>
                                <span>Add new allocation priority order</span>
                            </div>
                            <div class="action-item">
                                <i class="material-icons">search</i>
                                <span>Search orders, types, and classes</span>
                            </div>
                            <div class="action-item">
                                <i class="material-icons">sort</i>
                                <span>Sort and filter data</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        $('body').append(helpContent);
        $('#helpPanel').addClass('show');

        $(document).on('click', '#closeHelp', function() {
            $('#helpPanel').removeClass('show');
            setTimeout(() => $('#helpPanel').remove(), 300);
        });
    },

    toggleFullscreen: function() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                $('#fullscreenBtn .material-icons').text('fullscreen_exit');
                this.showNotification('Entered fullscreen mode', 'info');
            });
        } else {
            document.exitFullscreen().then(() => {
                $('#fullscreenBtn .material-icons').text('fullscreen');
                this.showNotification('Exited fullscreen mode', 'info');
            });
        }
    },

    // Global Search Functions
    handleGlobalSearch: function(query) {
        if (!query.trim()) {
            $('#searchSuggestions').hide();
            return;
        }

        const suggestions = this.generateSearchSuggestions(query);
        this.displaySearchSuggestions(suggestions);
    },

    generateSearchSuggestions: function(query) {
        const suggestions = [];
        const lowerQuery = query.toLowerCase();

        // Search in orders
        this.allocationData.forEach(item => {
            if (item.orderType.toLowerCase().includes(lowerQuery) ||
                item.orderClass.toLowerCase().includes(lowerQuery) ||
                item.priority.toString().includes(lowerQuery)) {
                suggestions.push({
                    type: 'order',
                    title: `${item.orderType} - ${item.orderClass}`,
                    subtitle: `Priority ${item.priority}`,
                    icon: 'assignment'
                });
            }
        });

        // Search in navigation
        this.navigationItems.forEach(item => {
            if (item.title.toLowerCase().includes(lowerQuery) ||
                item.path.toLowerCase().includes(lowerQuery)) {
                suggestions.push({
                    type: 'navigation',
                    title: item.title,
                    subtitle: item.path,
                    icon: item.icon
                });
            }
        });

        return suggestions.slice(0, 8); // Limit to 8 suggestions
    },

    displaySearchSuggestions: function(suggestions) {
        const container = $('#searchSuggestions');

        if (suggestions.length === 0) {
            container.html(`
                <div class="search-no-results">
                    <i class="material-icons">search_off</i>
                    <span>No results found</span>
                </div>
            `).show();
            return;
        }

        const suggestionsHtml = suggestions.map(suggestion => `
            <div class="search-suggestion-item" data-type="${suggestion.type}">
                <i class="material-icons">${suggestion.icon}</i>
                <div class="suggestion-content">
                    <div class="suggestion-title">${suggestion.title}</div>
                    <div class="suggestion-subtitle">${suggestion.subtitle}</div>
                </div>
            </div>
        `).join('');

        container.html(suggestionsHtml).show();
    },

    // Breadcrumb Functions
    updateBreadcrumb: function() {
        const viewNames = {
            dashboard: 'Dashboard',
            table: 'Table View',
            grid: 'Grid View',
            kanban: 'Kanban Board',
            scheduling: 'Scheduling',
            analytics: 'Analytics',
            timeline: 'Timeline',
            settings: 'Settings'
        };

        const breadcrumb = $('#breadcrumb');
        const currentViewName = viewNames[this.currentView] || 'Dashboard';

        breadcrumb.html(`
            <span class="breadcrumb-item">
                <i class="material-icons">home</i>
                Dashboard
            </span>
            <span class="breadcrumb-separator">
                <i class="material-icons">chevron_right</i>
            </span>
            <span class="breadcrumb-item active">${currentViewName}</span>
        `);
    },

    // Real-time Updates
    initializeRealTimeUpdates: function() {
        // Update stats every 30 seconds
        setInterval(() => {
            this.updateDashboardStats();
            this.updateScheduleBoxes();
        }, 30000);

        // Update time displays every minute
        setInterval(() => {
            this.updateTodayDate();
        }, 60000);
    },

    // Responsive Handlers
    setupResponsiveHandlers: function() {
        $(window).on('resize', () => {
            this.handleWindowResize();
        });
    },

    handleWindowResize: function() {
        const width = $(window).width();

        if (width <= 768 && $('.sidebar').hasClass('open')) {
            // Auto-close mobile menu on resize to larger screen
            if (width > 768) {
                this.closeMobileMenu();
            }
        }
    },

    closeAllOverlays: function() {
        // Close mobile menu
        this.closeMobileMenu();

        // Close modals
        $('.modal').removeClass('show');

        // Close panels
        $('.notification-panel, .help-panel').removeClass('show');

        // Close dropdowns
        $('.dropdown-menu').hide();
        $('.search-suggestions').hide();
        $('.nav-search-results').hide();
    },

    handleBatchOperation: function(operation) {
        switch(operation) {
            case 'updatepriority':
                this.showNotification('Batch priority update feature coming soon', 'info');
                break;
            case 'delete':
                this.showNotification('Batch delete feature coming soon', 'info');
                break;
            case 'export':
                this.exportData();
                break;
        }
    },

    editOrder: function(id) {
        this.showOrderModal(id);
    },

    deleteOrder: function(id) {
        if (confirm('Are you sure you want to delete this order?')) {
            const index = this.allocationData.findIndex(item => item.id === id);
            this.allocationData.splice(index, 1);
            this.filteredData = [...this.allocationData];
            this.updateDashboard();
            this.renderCurrentView();
            this.showNotification('Order deleted successfully', 'success');
        }
    },

    // Utility Functions
    exportData: function() {
        const csvContent = this.convertToCSV(this.filteredData);
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `allocation_priority_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.showNotification('Data exported successfully', 'success');
    },

    convertToCSV: function(data) {
        const headers = ['ID', 'Order Type', 'Order Class', 'Priority', 'Created Date', 'Status'];
        const csvRows = [headers.join(',')];

        data.forEach(item => {
            const row = [
                item.id,
                `"${item.orderType}"`,
                `"${item.orderClass}"`,
                item.priority,
                item.createdDate,
                item.status
            ];
            csvRows.push(row.join(','));
        });

        return csvRows.join('\n');
    },

    refreshData: function() {
        const refreshBtn = $('#refreshBtn');
        refreshBtn.addClass('loading').prop('disabled', true);

        // Simulate API call
        setTimeout(() => {
            refreshBtn.removeClass('loading').prop('disabled', false);
            this.filteredData = [...this.allocationData];
            this.updateDashboard();
            this.renderCurrentView();
            this.showNotification('Data refreshed successfully', 'success');
        }, 1000);
    },

    saveSettings: function() {
        const defaultPriority = $('#defaultPriority').val();
        const autoAssign = $('#autoAssign').is(':checked');
        const itemsPerPage = $('#itemsPerPage').val();
        const showColors = $('#showColors').is(':checked');

        // In a real app, these would be saved to localStorage or API
        localStorage.setItem('allocationSettings', JSON.stringify({
            defaultPriority,
            autoAssign,
            itemsPerPage,
            showColors
        }));

        this.showNotification('Settings saved successfully', 'success');
    },

    resetSettings: function() {
        $('#defaultPriority').val('3');
        $('#autoAssign').prop('checked', false);
        $('#itemsPerPage').val('25');
        $('#showColors').prop('checked', true);

        localStorage.removeItem('allocationSettings');
        this.showNotification('Settings reset to default', 'success');
    },

    filterTimeline: function(period) {
        // Update active button
        $('.timeline-controls .btn').removeClass('btn-primary').addClass('btn-secondary');
        $(`#${period}Btn`).removeClass('btn-secondary').addClass('btn-primary');

        // Filter data based on period (simplified for demo)
        const now = new Date();
        let filteredData = [...this.allocationData];

        switch(period) {
            case 'today':
                const today = now.toISOString().split('T')[0];
                filteredData = this.allocationData.filter(item => item.createdDate === today);
                break;
            case 'week':
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                filteredData = this.allocationData.filter(item =>
                    new Date(item.createdDate) >= weekAgo
                );
                break;
            case 'month':
                const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                filteredData = this.allocationData.filter(item =>
                    new Date(item.createdDate) >= monthAgo
                );
                break;
        }

        // Temporarily update filtered data for timeline
        const originalFiltered = this.filteredData;
        this.filteredData = filteredData;
        this.renderTimeline();
        this.filteredData = originalFiltered;
    },

    // Enhanced Render Functions with Pagination
    renderDashboard: function() {
        // Dashboard doesn't need pagination for stats, but we update pagination controls
        this.calculateTotalPages();
        this.updatePaginationControls();
    },

    renderTable: function() {
        const tbody = $('#tableBody');
        tbody.empty();

        const paginatedData = this.getPaginatedData();
        paginatedData.forEach(item => {
            tbody.append(`
                <tr>
                    <td>${item.orderType}</td>
                    <td>${item.orderClass}</td>
                    <td><span class="priority-badge priority-${item.priority}">${item.priority}</span></td>
                    <td>
                        <button class="btn btn-icon edit-btn" data-id="${item.id}" title="Edit">
                            <i class="material-icons">edit</i>
                        </button>
                        <button class="btn btn-icon delete-btn" data-id="${item.id}" title="Delete">
                            <i class="material-icons">delete</i>
                        </button>
                    </td>
                </tr>
            `);
        });

        this.calculateTotalPages();
        this.updatePaginationControls();
    },

    renderGrid: function() {
        const container = $('#gridContainer');
        container.empty();

        const paginatedData = this.getPaginatedData();
        paginatedData.forEach(item => {
            container.append(`
                <div class="grid-item">
                    <div class="grid-item-header">
                        <h3>${item.orderType}</h3>
                        <span class="priority-badge priority-${item.priority}">${item.priority}</span>
                    </div>
                    <div class="grid-item-content">
                        <p><strong>Class:</strong> ${item.orderClass}</p>
                        <p><strong>Date:</strong> ${item.createdDate}</p>
                        <p><strong>Status:</strong> ${item.status}</p>
                    </div>
                    <div class="grid-item-actions">
                        <button class="btn btn-icon edit-btn" data-id="${item.id}">
                            <i class="material-icons">edit</i>
                        </button>
                        <button class="btn btn-icon delete-btn" data-id="${item.id}">
                            <i class="material-icons">delete</i>
                        </button>
                    </div>
                </div>
            `);
        });

        this.calculateTotalPages();
        this.updatePaginationControls();
    },

    renderKanban: function() {
        // Clear all kanban columns
        for (let i = 1; i <= 5; i++) {
            $(`#priority${i}Items`).empty();
            $(`#priority${i}Count`).text('0');
        }

        const paginatedData = this.getPaginatedData();
        const priorityCount = {};

        paginatedData.forEach(item => {
            const priority = item.priority;
            if (!priorityCount[priority]) priorityCount[priority] = 0;
            priorityCount[priority]++;

            $(`#priority${priority}Items`).append(`
                <div class="kanban-item" data-id="${item.id}">
                    <div class="kanban-item-header">
                        <h4>${item.orderType}</h4>
                        <span class="kanban-item-date">${item.createdDate}</span>
                    </div>
                    <div class="kanban-item-content">
                        <p>${item.orderClass}</p>
                    </div>
                    <div class="kanban-item-actions">
                        <button class="btn btn-icon edit-btn" data-id="${item.id}">
                            <i class="material-icons">edit</i>
                        </button>
                    </div>
                </div>
            `);
        });

        // Update counts
        for (let i = 1; i <= 5; i++) {
            $(`#priority${i}Count`).text(priorityCount[i] || 0);
        }

        this.calculateTotalPages();
        this.updatePaginationControls();
    },

    renderAnalytics: function() {
        // Analytics view shows aggregated data, pagination controls different sections
        this.calculateTotalPages();
        this.updatePaginationControls();
    },

    renderTimeline: function() {
        const container = $('#timelineContent');
        container.empty();

        const paginatedData = this.getPaginatedData();
        paginatedData.forEach((item, index) => {
            container.append(`
                <div class="timeline-item">
                    <div class="timeline-marker"></div>
                    <div class="timeline-content">
                        <div class="timeline-header">
                            <h4>${item.orderType}</h4>
                            <span class="timeline-date">${item.createdDate}</span>
                        </div>
                        <div class="timeline-body">
                            <p><strong>Class:</strong> ${item.orderClass}</p>
                            <p><strong>Priority:</strong> ${item.priority}</p>
                            <p><strong>Status:</strong> ${item.status}</p>
                        </div>
                        <div class="timeline-actions">
                            <button class="btn btn-icon edit-btn" data-id="${item.id}">
                                <i class="material-icons">edit</i>
                            </button>
                        </div>
                    </div>
                </div>
            `);
        });

        this.calculateTotalPages();
        this.updatePaginationControls();
    },

    renderSettings: function() {
        // Settings view shows different configuration sections
        this.calculateTotalPages();
        this.updatePaginationControls();
    },

    showNotification: function(message, type = 'info') {
        // Create a simple toast notification
        const toast = $(`
            <div class="toast ${type}" style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'success' ? '#000' : type === 'error' ? '#d32f2f' : '#666'};
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

        $('body').append(toast);

        // Animate in
        setTimeout(() => {
            toast.css({
                opacity: 1,
                transform: 'translateX(0)'
            });
        }, 100);

        // Animate out and remove
        setTimeout(() => {
            toast.css({
                opacity: 0,
                transform: 'translateX(100%)'
            });
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};
