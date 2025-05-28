/**
 * Advanced Bin Location Management System
 * Complete warehouse management with drag-and-drop, scheduling, and advanced features
 */

$(document).ready(function() {
    AdvancedBinManager.init();
});

const AdvancedBinManager = {
    // Enhanced bin location data with more fields
    binData: [
        { id: 1, binCode: 'A01-R01-L01', zone: 'A', aisle: '01', rack: 'R01', level: 'L01', status: 'occupied', binType: 'standard', itemCode: 'ITM001', quantity: 45, capacity: 50, dimensions: '100x50x30 cm', description: 'Standard storage bin', lastUpdated: '2024-12-20T10:30:00', priority: 'medium', temperature: 22, humidity: 45 },
        { id: 2, binCode: 'A01-R01-L02', zone: 'A', aisle: '01', rack: 'R01', level: 'L02', status: 'empty', binType: 'standard', itemCode: '', quantity: 0, capacity: 50, dimensions: '100x50x30 cm', description: 'Standard storage bin', lastUpdated: '2024-12-20T09:15:00', priority: 'low', temperature: 21, humidity: 43 },
        { id: 3, binCode: 'A01-R02-L01', zone: 'A', aisle: '01', rack: 'R02', level: 'L01', status: 'reserved', binType: 'picking', itemCode: 'ITM002', quantity: 20, capacity: 30, dimensions: '80x40x25 cm', description: 'Picking bin for fast-moving items', lastUpdated: '2024-12-20T11:45:00', priority: 'high', temperature: 20, humidity: 40 },
        { id: 4, binCode: 'B02-R01-L01', zone: 'B', aisle: '02', rack: 'R01', level: 'L01', status: 'occupied', binType: 'bulk', itemCode: 'ITM003', quantity: 180, capacity: 200, dimensions: '150x100x50 cm', description: 'Bulk storage for large quantities', lastUpdated: '2024-12-20T08:20:00', priority: 'medium', temperature: 19, humidity: 38 },
        { id: 5, binCode: 'B02-R01-L02', zone: 'B', aisle: '02', rack: 'R01', level: 'L02', status: 'blocked', binType: 'standard', itemCode: '', quantity: 0, capacity: 50, dimensions: '100x50x30 cm', description: 'Maintenance required', lastUpdated: '2024-12-19T16:30:00', priority: 'critical', temperature: 25, humidity: 50 },
        { id: 6, binCode: 'C03-R01-L01', zone: 'C', aisle: '03', rack: 'R01', level: 'L01', status: 'occupied', binType: 'picking', itemCode: 'ITM004', quantity: 25, capacity: 30, dimensions: '80x40x25 cm', description: 'High-priority picking bin', lastUpdated: '2024-12-20T12:10:00', priority: 'high', temperature: 18, humidity: 35 },
        { id: 7, binCode: 'C03-R02-L01', zone: 'C', aisle: '03', rack: 'R02', level: 'L01', status: 'empty', binType: 'standard', itemCode: '', quantity: 0, capacity: 50, dimensions: '100x50x30 cm', description: 'Available for allocation', lastUpdated: '2024-12-20T07:45:00', priority: 'low', temperature: 22, humidity: 42 },
        { id: 8, binCode: 'D04-R01-L01', zone: 'D', aisle: '04', rack: 'R01', level: 'L01', status: 'occupied', binType: 'quarantine', itemCode: 'ITM005', quantity: 10, capacity: 20, dimensions: '60x40x20 cm', description: 'Quarantine area for quality check', lastUpdated: '2024-12-20T13:25:00', priority: 'critical', temperature: 15, humidity: 30 },
        { id: 9, binCode: 'D04-R01-L02', zone: 'D', aisle: '04', rack: 'R01', level: 'L02', status: 'reserved', binType: 'standard', itemCode: 'ITM006', quantity: 35, capacity: 50, dimensions: '100x50x30 cm', description: 'Reserved for outbound shipment', lastUpdated: '2024-12-20T14:00:00', priority: 'high', temperature: 23, humidity: 47 },
        { id: 10, binCode: 'A01-R03-L01', zone: 'A', aisle: '01', rack: 'R03', level: 'L01', status: 'empty', binType: 'bulk', itemCode: '', quantity: 0, capacity: 200, dimensions: '150x100x50 cm', description: 'Large capacity bulk storage', lastUpdated: '2024-12-20T06:30:00', priority: 'medium', temperature: 21, humidity: 41 },
        { id: 11, binCode: 'B03-R02-L03', zone: 'B', aisle: '03', rack: 'R02', level: 'L03', status: 'occupied', binType: 'standard', itemCode: 'ITM007', quantity: 38, capacity: 50, dimensions: '100x50x30 cm', description: 'Standard storage bin', lastUpdated: '2024-12-20T15:20:00', priority: 'medium', temperature: 20, humidity: 39 },
        { id: 12, binCode: 'C02-R03-L01', zone: 'C', aisle: '02', rack: 'R03', level: 'L01', status: 'empty', binType: 'picking', itemCode: '', quantity: 0, capacity: 30, dimensions: '80x40x25 cm', description: 'Fast-access picking bin', lastUpdated: '2024-12-20T16:45:00', priority: 'low', temperature: 19, humidity: 36 }
    ],

    // Enhanced application state
    filteredData: [],
    selectedBins: new Set(),
    currentView: 'grid',
    currentEditId: null,
    sidebarOpen: false,
    activeFilters: {},
    sortBy: 'binCode',
    sortOrder: 'asc',
    itemsPerPage: 24,
    currentPage: 1,
    draggedItem: null,

    // Scheduled tasks
    scheduledTasks: [
        { id: 1, title: 'Zone A inventory count', type: 'inventory-count', priority: 'high', assignedTo: 'warehouse-manager', date: '2024-12-20', time: '09:00', status: 'in-progress', description: 'Complete inventory count for Zone A' },
        { id: 2, title: 'Bin maintenance - Rack R05', type: 'maintenance', priority: 'medium', assignedTo: 'maintenance', date: '2024-12-20', time: '11:30', status: 'pending', description: 'Routine maintenance for rack R05' },
        { id: 3, title: 'New bin setup - Zone D', type: 'reorganization', priority: 'low', assignedTo: 'supervisor', date: '2024-12-20', time: '14:00', status: 'scheduled', description: 'Setup new bins in Zone D expansion area' }
    ],

    // Activity log
    activityLog: [
        { id: 1, type: 'allocation', title: 'Bin A01-R01-L03 allocated', time: '2 minutes ago', icon: 'input', iconClass: 'receiving' },
        { id: 2, type: 'picking', title: 'Pick completed from C02-R05-L01', time: '5 minutes ago', icon: 'shopping_cart', iconClass: 'picking' },
        { id: 3, type: 'transfer', title: 'Transfer initiated B03-R02-L02', time: '8 minutes ago', icon: 'compare_arrows', iconClass: 'transfer' },
        { id: 4, type: 'maintenance', title: 'Maintenance completed on D01-R01-L01', time: '12 minutes ago', icon: 'build', iconClass: 'maintenance' },
        { id: 5, type: 'audit', title: 'Audit started for Zone C', time: '15 minutes ago', icon: 'fact_check', iconClass: 'audit' }
    ],

    // Smart alerts
    smartAlerts: [
        { id: 1, type: 'critical', title: 'Zone A capacity critical', description: '95% utilization reached', icon: 'warning', action: 'view-zone' },
        { id: 2, type: 'warning', title: 'Maintenance due', description: '5 bins require inspection', icon: 'info', action: 'schedule-maintenance' },
        { id: 3, type: 'info', title: 'Optimization suggestion', description: 'Relocate slow-moving items', icon: 'lightbulb', action: 'optimize' }
    ],

    // Zone information with enhanced data
    zoneInfo: {
        'A': { name: 'Zone A - Receiving', color: '#8b5cf6', capacity: 150, occupied: 45, efficiency: 85 },
        'B': { name: 'Zone B - Storage', color: '#06b6d4', capacity: 200, occupied: 120, efficiency: 92 },
        'C': { name: 'Zone C - Picking', color: '#84cc16', capacity: 100, occupied: 65, efficiency: 88 },
        'D': { name: 'Zone D - Shipping', color: '#f97316', capacity: 80, occupied: 35, efficiency: 78 }
    },

    // Status labels and colors
    statusLabels: {
        'empty': 'Empty',
        'occupied': 'Occupied',
        'reserved': 'Reserved',
        'blocked': 'Blocked'
    },

    // Priority labels
    priorityLabels: {
        'critical': 'Critical',
        'high': 'High',
        'medium': 'Medium',
        'low': 'Low'
    },

    // Initialize the enhanced application
    init: function() {
        this.filteredData = [...this.binData];
        this.bindEvents();
        this.initializeDragAndDrop();
        this.updateStats();
        this.updateWidgets();
        this.renderCurrentView();
        this.initializeSearchSuggestions();
        this.startRealTimeUpdates();
        console.log('Advanced Bin Manager initialized successfully');
    },

    // Comprehensive event binding
    bindEvents: function() {
        const self = this;

        // Sidebar toggle
        $('#sidebarToggle').on('click', function() {
            self.toggleSidebar();
        });

        $('#sidebarClose').on('click', function() {
            self.closeSidebar();
        });

        // Navigation search
        $('#navSearch').on('input', function() {
            self.searchNavigation($(this).val());
        });

        // Section toggles
        $('.section-toggle').on('click', function() {
            const section = $(this).data('section');
            self.toggleSection(section);
        });

        // Navigation items
        $('.nav-item').on('click', function() {
            const module = $(this).data('module');
            self.activateModule(module);
        });

        $('.submenu-item').on('click', function() {
            const submenu = $(this).data('submenu');
            self.activateSubmenu(submenu);
        });

        // Quick actions
        $('.quick-action-btn').on('click', function() {
            const action = $(this).data('action');
            self.executeQuickAction(action);
        });

        // User menu
        $('#userMenu').on('click', function() {
            $(this).toggleClass('active');
        });

        $('.dropdown-item').on('click', function() {
            const action = $(this).data('action');
            self.handleUserAction(action);
        });

        // Header actions
        $('#quickActionsBtn').on('click', function() {
            self.showQuickActionsModal();
        });

        $('#scheduleBtn').on('click', function() {
            self.showScheduleModal();
        });

        $('#notificationsBtn').on('click', function() {
            self.showNotifications();
        });

        $('#helpBtn').on('click', function() {
            self.showHelp();
        });

        // View switcher
        $('.view-btn').on('click', function() {
            const view = $(this).data('view');
            self.switchView(view);
        });

        // Advanced filters
        $('#zoneFilter, #statusFilter, #typeFilter').on('change', function() {
            self.applyFilters();
        });

        $('.checkbox-item input[type="checkbox"]').on('change', function() {
            self.applyFilters();
        });

        $('#capacityMin, #capacityMax').on('input', function() {
            self.updateCapacityRange();
            self.applyFilters();
        });

        $('#dateFrom, #dateTo').on('change', function() {
            self.applyFilters();
        });

        $('.quick-filter-btn').on('click', function() {
            const filter = $(this).data('filter');
            self.applyQuickFilter(filter);
        });

        // Sorting and pagination
        $('#sortBy').on('change', function() {
            self.sortBy = $(this).val();
            self.applySorting();
        });

        $('.sort-btn').on('click', function() {
            const order = $(this).data('order');
            self.sortOrder = order;
            $('.sort-btn').removeClass('active');
            $(this).addClass('active');
            self.applySorting();
        });

        $('#itemsPerPage').on('change', function() {
            self.itemsPerPage = parseInt($(this).val());
            self.currentPage = 1;
            self.renderCurrentView();
        });

        // Global search with suggestions
        $('#globalSearch').on('input', function() {
            const query = $(this).val();
            self.handleSearch(query);
            if (query.length > 2) {
                self.showSearchSuggestions(query);
            } else {
                self.hideSearchSuggestions();
            }
        });

        $('.search-filter-btn').on('click', function() {
            const filter = $(this).data('filter');
            self.setSearchFilter(filter);
        });

        // Bin selection
        $(document).on('change', '.bin-checkbox', function() {
            const binId = parseInt($(this).val());
            if ($(this).is(':checked')) {
                self.selectedBins.add(binId);
            } else {
                self.selectedBins.delete(binId);
            }
            self.updateSelectionUI();
        });

        $('#selectAllBins').on('click', function() {
            self.selectAllBins();
        });

        $('#clearSelection').on('click', function() {
            self.clearSelection();
        });

        // Bulk actions
        $('#bulkActionsBtn').on('click', function() {
            self.showBulkActionsModal();
        });

        $('#applyBulkStatus').on('click', function() {
            const status = $('#bulkStatusSelect').val();
            self.applyBulkStatusUpdate(status);
        });

        $('#applyBulkZone').on('click', function() {
            const zone = $('#bulkZoneSelect').val();
            self.applyBulkZoneMove(zone);
        });

        $('#scheduleBulkMaintenance').on('click', function() {
            const date = $('#bulkMaintenanceDate').val();
            self.scheduleBulkMaintenance(date);
        });

        $('#deleteBulkBins').on('click', function() {
            self.deleteBulkBins();
        });

        // Modal actions
        $('#addBinBtn, #navAddBinBtn').on('click', function() {
            self.showAddModal();
        });

        $('#importBinsBtn, #navImportBtn').on('click', function() {
            self.handleImport();
        });

        $('#exportBinsBtn, #navExportBtn').on('click', function() {
            self.handleExport();
        });

        $('#scanBtn, #navScanBtn').on('click', function() {
            self.showScannerModal();
        });

        // Modal close events
        $('.modal-close, .modal-overlay').on('click', function() {
            self.hideAllModals();
        });

        $('#cancelBtn, #cancelSchedule, #mobileCancelBtn').on('click', function() {
            self.hideAllModals();
        });

        // Save actions
        $('#saveBinBtn').on('click', function() {
            self.saveBinLocation();
        });

        $('#saveSchedule').on('click', function() {
            self.saveScheduledTask();
        });

        // Bin card interactions
        $(document).on('click', '.bin-card', function(e) {
            if (!$(e.target).closest('.bin-actions').length) {
                const id = $(this).data('id');
                self.viewBinDetails(id);
            }
        });

        $(document).on('click', '.btn-icon', function(e) {
            e.stopPropagation();
            const action = $(this).data('action');
            const id = $(this).closest('.bin-card, tr').data('id');
            self.handleBinAction(action, id);
        });

        // Kanban actions
        $('#autoArrangeBtn').on('click', function() {
            self.autoArrangeBins();
        });

        $('#bulkMoveBtn').on('click', function() {
            self.showBulkMoveModal();
        });

        $('.add-bin-btn').on('click', function() {
            const status = $(this).data('status');
            self.showAddModalWithStatus(status);
        });

        // Widget interactions
        $('.activity-item, .alert-item, .schedule-item').on('click', function() {
            const type = $(this).data('type') || 'activity';
            const id = $(this).data('id');
            self.handleWidgetClick(type, id);
        });

        $('.widget-btn').on('click', function() {
            const action = $(this).data('action') || $(this).attr('id');
            self.handleWidgetAction(action);
        });

        // Prevent modal close when clicking inside content
        $('.modal-content, .modal-dialog').on('click', function(e) {
            e.stopPropagation();
        });

        // Keyboard shortcuts
        $(document).on('keydown', function(e) {
            self.handleKeyboardShortcuts(e);
        });

        // Real-time updates
        setInterval(function() {
            self.updateRealTimeData();
        }, 30000); // Update every 30 seconds

        console.log('All event handlers bound successfully');
    },

    // Sidebar management
    toggleSidebar: function() {
        this.sidebarOpen = !this.sidebarOpen;
        if (this.sidebarOpen) {
            $('#advancedSidebar').addClass('open');
            $('.main-container').addClass('sidebar-open');
        } else {
            this.closeSidebar();
        }
    },

    closeSidebar: function() {
        this.sidebarOpen = false;
        $('#advancedSidebar').removeClass('open');
        $('.main-container').removeClass('sidebar-open');
    },

    // Navigation functionality
    searchNavigation: function(query) {
        const items = $('.nav-item, .submenu-item');
        if (!query) {
            items.show();
            return;
        }

        items.each(function() {
            const text = $(this).text().toLowerCase();
            if (text.includes(query.toLowerCase())) {
                $(this).show();
                $(this).closest('.nav-section').show();
            } else {
                $(this).hide();
            }
        });
    },

    toggleSection: function(section) {
        const content = $(`#${section}Section`);
        const toggle = $(`.section-toggle[data-section="${section}"]`);

        if (content.hasClass('collapsed')) {
            content.removeClass('collapsed').show();
            toggle.find('.material-icons').text('expand_less');
        } else {
            content.addClass('collapsed').hide();
            toggle.find('.material-icons').text('expand_more');
        }
    },

    activateModule: function(module) {
        $('.nav-item').removeClass('active');
        $(`.nav-item[data-module="${module}"]`).addClass('active');

        // Expand submenu if exists
        const navItem = $(`.nav-item[data-module="${module}"]`);
        if (navItem.find('.nav-submenu').length > 0) {
            navItem.addClass('expanded');
        }

        console.log(`Activated module: ${module}`);
    },

    activateSubmenu: function(submenu) {
        $('.submenu-item').removeClass('active');
        $(`.submenu-item[data-submenu="${submenu}"]`).addClass('active');

        // Handle different submenu actions
        switch(submenu) {
            case 'grid-view':
                this.switchView('grid');
                break;
            case 'list-view':
                this.switchView('list');
                break;
            case 'map-view':
                this.switchView('map');
                break;
            case 'analytics':
                this.showAnalytics();
                break;
        }
    },

    executeQuickAction: function(action) {
        switch(action) {
            case 'add-bin':
                this.showAddModal();
                break;
            case 'scan':
                this.showScannerModal();
                break;
            case 'import':
                this.handleImport();
                break;
            case 'export':
                this.handleExport();
                break;
            case 'reports':
                this.showReports();
                break;
            case 'schedule':
                this.showScheduleModal();
                break;
        }
        this.closeSidebar();
    },

    handleUserAction: function(action) {
        $('#userMenu').removeClass('active');

        switch(action) {
            case 'profile':
                this.showProfile();
                break;
            case 'preferences':
                this.showPreferences();
                break;
            case 'reports':
                this.showReports();
                break;
            case 'logout':
                this.handleLogout();
                break;
        }
    },

    // Enhanced view switching
    switchView: function(view) {
        this.currentView = view;
        $('.view-btn').removeClass('active');
        $(`.view-btn[data-view="${view}"]`).addClass('active');

        // Hide all view sections
        $('.content-section').hide();

        // Show selected view
        switch(view) {
            case 'grid':
                $('#binGrid').parent().show();
                this.renderGridView();
                break;
            case 'list':
                $('#listView').show();
                this.renderListView();
                break;
            case 'map':
                $('#mapView').show();
                this.renderMapView();
                break;
            case 'kanban':
                $('#kanbanView').show();
                this.renderKanbanView();
                break;
        }

        console.log(`Switched to ${view} view`);
    },

    // Render current view
    renderCurrentView: function() {
        switch(this.currentView) {
            case 'grid':
                this.renderGridView();
                break;
            case 'list':
                this.renderListView();
                break;
            case 'map':
                this.renderMapView();
                break;
            case 'kanban':
                this.renderKanbanView();
                break;
        }
    },

    // Enhanced grid view rendering
    renderGridView: function() {
        const container = $('#binGrid');
        container.empty();

        this.filteredData.forEach(bin => {
            const capacityPercentage = bin.capacity > 0 ? (bin.quantity / bin.capacity) * 100 : 0;
            const zoneInfo = this.zoneInfo[bin.zone];

            const card = $(`
                <div class="bin-card ${bin.status}" data-id="${bin.id}" draggable="true">
                    <div class="bin-header">
                        <div class="bin-selection">
                            <input type="checkbox" class="bin-checkbox" value="${bin.id}">
                        </div>
                        <div class="bin-info">
                            <h3 class="bin-code">${bin.binCode}</h3>
                            <p class="bin-zone">${zoneInfo.name}</p>
                        </div>
                        <span class="bin-status ${bin.status}">${this.statusLabels[bin.status]}</span>
                    </div>
                    <div class="bin-details">
                        <div class="bin-location">
                            <div class="location-item">
                                <div class="location-label">Aisle</div>
                                <div class="location-value">${bin.aisle}</div>
                            </div>
                            <div class="location-item">
                                <div class="location-label">Rack</div>
                                <div class="location-value">${bin.rack}</div>
                            </div>
                            <div class="location-item">
                                <div class="location-label">Level</div>
                                <div class="location-value">${bin.level}</div>
                            </div>
                        </div>
                        <div class="bin-capacity">
                            <span class="capacity-label">Capacity</span>
                            <div class="capacity-bar">
                                <div class="capacity-fill" style="width: ${capacityPercentage}%"></div>
                            </div>
                            <span class="capacity-text">${bin.quantity}/${bin.capacity}</span>
                        </div>
                        ${bin.itemCode ? `<p><strong>Item:</strong> ${bin.itemCode}</p>` : ''}
                        <p><strong>Type:</strong> ${bin.binType}</p>
                        <p><strong>Priority:</strong> <span class="priority-${bin.priority}">${this.priorityLabels[bin.priority]}</span></p>
                        <p><strong>Last Updated:</strong> ${this.formatDateTime(bin.lastUpdated)}</p>
                    </div>
                    <div class="bin-actions">
                        <button class="btn-icon" data-action="scan" title="Scan">
                            <i class="material-icons">qr_code_scanner</i>
                        </button>
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

        this.updatePagination();
    },

    // Enhanced list view rendering
    renderListView: function() {
        const tbody = $('#binTableBody');
        tbody.empty();

        this.filteredData.forEach(bin => {
            const capacityPercentage = bin.capacity > 0 ? (bin.quantity / bin.capacity) * 100 : 0;

            const row = $(`
                <tr data-id="${bin.id}">
                    <td>
                        <input type="checkbox" class="bin-checkbox" value="${bin.id}">
                    </td>
                    <td>${bin.binCode}</td>
                    <td>${bin.zone}</td>
                    <td>${bin.aisle}</td>
                    <td>${bin.rack}</td>
                    <td>${bin.level}</td>
                    <td><span class="bin-status ${bin.status}">${this.statusLabels[bin.status]}</span></td>
                    <td>${bin.itemCode || '-'}</td>
                    <td>${bin.quantity}</td>
                    <td>${bin.capacity}</td>
                    <td>
                        <div class="capacity-bar-small">
                            <div class="capacity-fill-small" style="width: ${capacityPercentage}%"></div>
                        </div>
                        <span class="capacity-percentage">${Math.round(capacityPercentage)}%</span>
                    </td>
                    <td><span class="priority-${bin.priority}">${this.priorityLabels[bin.priority]}</span></td>
                    <td>${this.formatDateTime(bin.lastUpdated)}</td>
                    <td>
                        <button class="btn-icon" data-action="scan" title="Scan">
                            <i class="material-icons">qr_code_scanner</i>
                        </button>
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

        this.updatePagination();
    },

    // Enhanced map view rendering
    renderMapView: function() {
        const container = $('#warehouseMapContainer');
        container.empty();

        // Create enhanced warehouse layout
        const warehouseLayout = $(`
            <div class="warehouse-layout" style="
                width: 900px;
                height: 600px;
                position: relative;
                background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
                border: 2px solid #e5e7eb;
                margin: 20px auto;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            ">
                <div class="zone-a" style="position: absolute; top: 30px; left: 30px; width: 200px; height: 240px; background: rgba(139, 92, 246, 0.1); border: 2px solid #8b5cf6; border-radius: 12px; backdrop-filter: blur(10px);">
                    <div style="padding: 12px; font-weight: 600; color: #8b5cf6; font-size: 14px;">Zone A - Receiving</div>
                    <div class="zone-stats" style="padding: 0 12px; font-size: 12px; color: #6b7280;">
                        <div>Capacity: ${this.zoneInfo.A.capacity}</div>
                        <div>Occupied: ${this.zoneInfo.A.occupied}</div>
                        <div>Efficiency: ${this.zoneInfo.A.efficiency}%</div>
                    </div>
                </div>
                <div class="zone-b" style="position: absolute; top: 30px; left: 250px; width: 200px; height: 240px; background: rgba(6, 182, 212, 0.1); border: 2px solid #06b6d4; border-radius: 12px; backdrop-filter: blur(10px);">
                    <div style="padding: 12px; font-weight: 600; color: #06b6d4; font-size: 14px;">Zone B - Storage</div>
                    <div class="zone-stats" style="padding: 0 12px; font-size: 12px; color: #6b7280;">
                        <div>Capacity: ${this.zoneInfo.B.capacity}</div>
                        <div>Occupied: ${this.zoneInfo.B.occupied}</div>
                        <div>Efficiency: ${this.zoneInfo.B.efficiency}%</div>
                    </div>
                </div>
                <div class="zone-c" style="position: absolute; top: 290px; left: 30px; width: 200px; height: 240px; background: rgba(132, 204, 22, 0.1); border: 2px solid #84cc16; border-radius: 12px; backdrop-filter: blur(10px);">
                    <div style="padding: 12px; font-weight: 600; color: #84cc16; font-size: 14px;">Zone C - Picking</div>
                    <div class="zone-stats" style="padding: 0 12px; font-size: 12px; color: #6b7280;">
                        <div>Capacity: ${this.zoneInfo.C.capacity}</div>
                        <div>Occupied: ${this.zoneInfo.C.occupied}</div>
                        <div>Efficiency: ${this.zoneInfo.C.efficiency}%</div>
                    </div>
                </div>
                <div class="zone-d" style="position: absolute; top: 290px; left: 250px; width: 200px; height: 240px; background: rgba(249, 115, 22, 0.1); border: 2px solid #f97316; border-radius: 12px; backdrop-filter: blur(10px);">
                    <div style="padding: 12px; font-weight: 600; color: #f97316; font-size: 14px;">Zone D - Shipping</div>
                    <div class="zone-stats" style="padding: 0 12px; font-size: 12px; color: #6b7280;">
                        <div>Capacity: ${this.zoneInfo.D.capacity}</div>
                        <div>Occupied: ${this.zoneInfo.D.occupied}</div>
                        <div>Efficiency: ${this.zoneInfo.D.efficiency}%</div>
                    </div>
                </div>
                <div class="warehouse-center" style="position: absolute; top: 250px; left: 470px; width: 120px; height: 120px; background: rgba(107, 114, 128, 0.1); border: 2px dashed #6b7280; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <div style="text-align: center; color: #6b7280; font-size: 12px; font-weight: 600;">
                        <div>Control</div>
                        <div>Center</div>
                    </div>
                </div>
            </div>
        `);

        container.append(warehouseLayout);

        // Add enhanced bin indicators
        this.filteredData.forEach((bin, index) => {
            const zoneElement = container.find(`.zone-${bin.zone.toLowerCase()}`);
            if (zoneElement.length) {
                const binIndicator = $(`
                    <div class="bin-indicator enhanced" style="
                        position: absolute;
                        width: 16px;
                        height: 16px;
                        border-radius: 50%;
                        background: ${this.getStatusColor(bin.status)};
                        top: ${50 + (index % 8) * 20}px;
                        left: ${40 + Math.floor(index / 8) * 20}px;
                        cursor: pointer;
                        border: 3px solid white;
                        box-shadow: 0 3px 8px rgba(0,0,0,0.3);
                        transition: all 0.3s ease;
                        z-index: 10;
                    " title="${bin.binCode} - ${this.statusLabels[bin.status]}" data-id="${bin.id}">
                    </div>
                `);

                binIndicator.hover(
                    function() {
                        $(this).css({
                            'transform': 'scale(1.3)',
                            'z-index': '20'
                        });
                    },
                    function() {
                        $(this).css({
                            'transform': 'scale(1)',
                            'z-index': '10'
                        });
                    }
                );

                zoneElement.append(binIndicator);
            }
        });

        // Add click handlers for bin indicators
        const self = this;
        container.find('.bin-indicator').on('click', function() {
            const id = $(this).data('id');
            self.viewBinDetails(id);
        });
    },

    // Kanban view rendering
    renderKanbanView: function() {
        const columns = {
            empty: $('#emptyColumnContent'),
            occupied: $('#occupiedColumnContent'),
            reserved: $('#reservedColumnContent'),
            blocked: $('#blockedColumnContent')
        };

        // Clear all columns
        Object.values(columns).forEach(column => column.empty());

        // Group bins by status
        const binsByStatus = {
            empty: [],
            occupied: [],
            reserved: [],
            blocked: []
        };

        this.filteredData.forEach(bin => {
            binsByStatus[bin.status].push(bin);
        });

        // Render bins in each column
        Object.keys(binsByStatus).forEach(status => {
            const bins = binsByStatus[status];
            const column = columns[status];

            bins.forEach(bin => {
                const capacityPercentage = bin.capacity > 0 ? (bin.quantity / bin.capacity) * 100 : 0;

                const kanbanItem = $(`
                    <div class="kanban-item" data-id="${bin.id}" data-status="${bin.status}" draggable="true">
                        <div class="kanban-item-header">
                            <div class="kanban-item-title">${bin.binCode}</div>
                            <div class="kanban-item-zone">${bin.zone}</div>
                        </div>
                        <div class="kanban-item-details">
                            ${bin.itemCode ? `Item: ${bin.itemCode}` : 'No item assigned'}
                        </div>
                        <div class="kanban-item-capacity">
                            <span>${bin.quantity}/${bin.capacity}</span>
                            <div class="capacity-bar-small">
                                <div class="capacity-fill-small" style="width: ${capacityPercentage}%"></div>
                            </div>
                            <span>${Math.round(capacityPercentage)}%</span>
                        </div>
                    </div>
                `);

                column.append(kanbanItem);
            });

            // Update column count
            $(`#${status}ColumnCount`).text(bins.length);
        });

        this.initializeKanbanDragDrop();
    },

    // Render grid view
    renderGrid: function() {
        const container = $('#binGrid');
        container.empty();

        this.filteredData.forEach(bin => {
            const capacityPercentage = bin.capacity > 0 ? (bin.quantity / bin.capacity) * 100 : 0;
            const zoneInfo = this.zoneInfo[bin.zone];

            const card = $(`
                <div class="bin-card ${bin.status}" data-id="${bin.id}">
                    <div class="bin-header">
                        <div>
                            <h3 class="bin-code">${bin.binCode}</h3>
                            <p class="bin-zone">${zoneInfo.name}</p>
                        </div>
                        <span class="bin-status ${bin.status}">${this.statusLabels[bin.status]}</span>
                    </div>
                    <div class="bin-details">
                        <div class="bin-location">
                            <div class="location-item">
                                <div class="location-label">Aisle</div>
                                <div class="location-value">${bin.aisle}</div>
                            </div>
                            <div class="location-item">
                                <div class="location-label">Rack</div>
                                <div class="location-value">${bin.rack}</div>
                            </div>
                            <div class="location-item">
                                <div class="location-label">Level</div>
                                <div class="location-value">${bin.level}</div>
                            </div>
                        </div>
                        <div class="bin-capacity">
                            <span class="capacity-label">Capacity</span>
                            <div class="capacity-bar">
                                <div class="capacity-fill" style="width: ${capacityPercentage}%"></div>
                            </div>
                            <span class="capacity-text">${bin.quantity}/${bin.capacity}</span>
                        </div>
                        ${bin.itemCode ? `<p><strong>Item:</strong> ${bin.itemCode}</p>` : ''}
                        <p><strong>Type:</strong> ${bin.binType}</p>
                        <p><strong>Dimensions:</strong> ${bin.dimensions}</p>
                    </div>
                    <div class="bin-actions">
                        <button class="btn-icon" data-action="scan" title="Scan">
                            <i class="material-icons">qr_code_scanner</i>
                        </button>
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

    // Render list view
    renderList: function() {
        const tbody = $('#binTableBody');
        tbody.empty();

        this.filteredData.forEach(bin => {
            const row = $(`
                <tr data-id="${bin.id}">
                    <td>${bin.binCode}</td>
                    <td>${bin.zone}</td>
                    <td>${bin.aisle}</td>
                    <td>${bin.rack}</td>
                    <td>${bin.level}</td>
                    <td><span class="bin-status ${bin.status}">${this.statusLabels[bin.status]}</span></td>
                    <td>${bin.itemCode || '-'}</td>
                    <td>${bin.quantity}</td>
                    <td>${bin.capacity}</td>
                    <td>
                        <button class="btn-icon" data-action="scan" title="Scan">
                            <i class="material-icons">qr_code_scanner</i>
                        </button>
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

    // Render warehouse map view
    renderMap: function() {
        const container = $('#warehouseMapContainer');
        container.empty();

        // Create a simple warehouse layout
        const warehouseLayout = $(`
            <div class="warehouse-layout" style="
                width: 800px;
                height: 500px;
                position: relative;
                background: #f9fafb;
                border: 2px solid #e5e7eb;
                margin: 20px auto;
            ">
                <div class="zone-a" style="position: absolute; top: 20px; left: 20px; width: 180px; height: 200px; background: rgba(139, 92, 246, 0.1); border: 2px solid #8b5cf6; border-radius: 8px;">
                    <div style="padding: 8px; font-weight: 600; color: #8b5cf6;">Zone A - Receiving</div>
                </div>
                <div class="zone-b" style="position: absolute; top: 20px; left: 220px; width: 180px; height: 200px; background: rgba(6, 182, 212, 0.1); border: 2px solid #06b6d4; border-radius: 8px;">
                    <div style="padding: 8px; font-weight: 600; color: #06b6d4;">Zone B - Storage</div>
                </div>
                <div class="zone-c" style="position: absolute; top: 240px; left: 20px; width: 180px; height: 200px; background: rgba(132, 204, 22, 0.1); border: 2px solid #84cc16; border-radius: 8px;">
                    <div style="padding: 8px; font-weight: 600; color: #84cc16;">Zone C - Picking</div>
                </div>
                <div class="zone-d" style="position: absolute; top: 240px; left: 220px; width: 180px; height: 200px; background: rgba(249, 115, 22, 0.1); border: 2px solid #f97316; border-radius: 8px;">
                    <div style="padding: 8px; font-weight: 600; color: #f97316;">Zone D - Shipping</div>
                </div>
            </div>
        `);

        container.append(warehouseLayout);

        // Add bin indicators to the map
        this.filteredData.forEach((bin, index) => {
            const zoneElement = container.find(`.zone-${bin.zone.toLowerCase()}`);
            if (zoneElement.length) {
                const binIndicator = $(`
                    <div class="bin-indicator" style="
                        position: absolute;
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        background: ${this.getStatusColor(bin.status)};
                        top: ${30 + (index % 10) * 15}px;
                        left: ${30 + Math.floor(index / 10) * 15}px;
                        cursor: pointer;
                        border: 2px solid white;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    " title="${bin.binCode} - ${this.statusLabels[bin.status]}" data-id="${bin.id}">
                    </div>
                `);

                zoneElement.append(binIndicator);
            }
        });

        // Add click handlers for bin indicators
        container.find('.bin-indicator').on('click', function() {
            const id = $(this).data('id');
            self.editBinLocation(id);
        });
    },

    // Get status color for map indicators
    getStatusColor: function(status) {
        const colors = {
            'empty': '#10b981',
            'occupied': '#3b82f6',
            'reserved': '#f59e0b',
            'blocked': '#ef4444'
        };
        return colors[status] || '#6b7280';
    },

    // Update statistics
    updateStats: function() {
        const stats = {
            total: this.binData.length,
            occupied: this.binData.filter(bin => bin.status === 'occupied').length,
            empty: this.binData.filter(bin => bin.status === 'empty').length,
            zones: Object.keys(this.zoneInfo).length
        };

        $('#totalBins').text(stats.total);
        $('#occupiedBins').text(stats.occupied);
        $('#emptyBins').text(stats.empty);
        $('#totalZones').text(stats.zones);
    },

    // Apply filters
    applyFilters: function() {
        const zone = $('#zoneFilter').val();
        const status = $('#statusFilter').val();
        const type = $('#typeFilter').val();

        this.filteredData = this.binData.filter(bin => {
            return (!zone || bin.zone === zone) &&
                   (!status || bin.status === status) &&
                   (!type || bin.binType === type);
        });

        this.renderCurrentView();
    },

    // Handle search
    handleSearch: function(query) {
        if (!query.trim()) {
            this.filteredData = [...this.binData];
        } else {
            const searchTerm = query.toLowerCase();
            this.filteredData = this.binData.filter(bin =>
                bin.binCode.toLowerCase().includes(searchTerm) ||
                bin.itemCode.toLowerCase().includes(searchTerm) ||
                bin.description.toLowerCase().includes(searchTerm) ||
                bin.zone.toLowerCase().includes(searchTerm)
            );
        }

        this.renderCurrentView();
        this.updateSearchSuggestions(query);
    },

    // Initialize search suggestions
    initializeSearchSuggestions: function() {
        // Implementation for search suggestions
    },

    // Update search suggestions
    updateSearchSuggestions: function(query) {
        // Implementation for updating search suggestions
    },

    // Show add modal
    showAddModal: function() {
        this.currentEditId = null;
        $('#modalTitle').text('Add New Bin Location');
        this.clearForm();
        $('#addBinModal').addClass('active');
    },

    // Edit bin location
    editBinLocation: function(id) {
        const bin = this.binData.find(bin => bin.id === id);
        if (!bin) return;

        this.currentEditId = id;
        $('#modalTitle').text('Edit Bin Location');

        // Populate form
        $('#binCode').val(bin.binCode);
        $('#binType').val(bin.binType);
        $('#zone').val(bin.zone);
        $('#aisle').val(bin.aisle);
        $('#rack').val(bin.rack);
        $('#level').val(bin.level);
        $('#capacity').val(bin.capacity);
        $('#dimensions').val(bin.dimensions);
        $('#description').val(bin.description);

        $('#addBinModal').addClass('active');
    },

    // Delete bin location
    deleteBinLocation: function(id) {
        if (confirm('Are you sure you want to delete this bin location?')) {
            this.binData = this.binData.filter(bin => bin.id !== id);
            this.filteredData = this.filteredData.filter(bin => bin.id !== id);
            this.updateStats();
            this.renderCurrentView();
            this.showNotification('Bin location deleted successfully', 'success');
        }
    },

    // Scan bin location
    scanBinLocation: function(id) {
        const bin = this.binData.find(bin => bin.id === id);
        if (bin) {
            this.showNotification(`Scanned: ${bin.binCode}`, 'info');
            // Simulate scanner result
            $('#scannedCode').text(bin.binCode);
            $('#scannerResult').show();
            $('#searchScannedBtn').show();
        }
    },

    // Save bin location
    saveBinLocation: function() {
        const formData = {
            binCode: $('#binCode').val(),
            binType: $('#binType').val(),
            zone: $('#zone').val(),
            aisle: $('#aisle').val(),
            rack: $('#rack').val(),
            level: $('#level').val(),
            capacity: parseInt($('#capacity').val()),
            dimensions: $('#dimensions').val(),
            description: $('#description').val(),
            status: 'empty',
            itemCode: '',
            quantity: 0
        };

        if (!formData.binCode || !formData.zone || !formData.aisle || !formData.rack || !formData.level) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        if (this.currentEditId) {
            // Update existing
            const index = this.binData.findIndex(bin => bin.id === this.currentEditId);
            if (index !== -1) {
                this.binData[index] = { ...this.binData[index], ...formData };
                this.showNotification('Bin location updated successfully', 'success');
            }
        } else {
            // Add new
            const newId = Math.max(...this.binData.map(bin => bin.id)) + 1;
            this.binData.push({ id: newId, ...formData });
            this.showNotification('Bin location added successfully', 'success');
        }

        this.filteredData = [...this.binData];
        this.updateStats();
        this.renderCurrentView();
        this.hideModal();
    },

    // Clear form
    clearForm: function() {
        $('#binCode').val('');
        $('#binType').val('');
        $('#zone').val('');
        $('#aisle').val('');
        $('#rack').val('');
        $('#level').val('');
        $('#capacity').val('');
        $('#dimensions').val('');
        $('#description').val('');
    },

    // Hide modal
    hideModal: function() {
        $('#addBinModal').removeClass('active');
        this.currentEditId = null;
    },

    // Show scanner modal
    showScannerModal: function() {
        $('#scannerModal').addClass('active');
        // Simulate scanner activation
        setTimeout(() => {
            this.simulateBarcodeScan();
        }, 3000);
    },

    // Hide scanner modal
    hideScannerModal: function() {
        $('#scannerModal').removeClass('active');
        $('#scannerResult').hide();
        $('#searchScannedBtn').hide();
    },

    // Simulate barcode scan
    simulateBarcodeScan: function() {
        const randomBin = this.binData[Math.floor(Math.random() * this.binData.length)];
        $('#scannedCode').text(randomBin.binCode);
        $('#scannerResult').show();
        $('#searchScannedBtn').show();
    },

    // Handle map controls
    handleMapControl: function(action) {
        this.showNotification(`Map ${action} feature coming soon`, 'info');
    },

    // Handle import
    handleImport: function() {
        this.showNotification('Import functionality coming soon', 'info');
    },

    // Handle export
    handleExport: function() {
        const csvContent = this.generateCSV();
        this.downloadCSV(csvContent, 'bin-locations.csv');
        this.showNotification('Data exported successfully', 'success');
    },

    // Generate CSV
    generateCSV: function() {
        const headers = ['ID', 'Bin Code', 'Zone', 'Aisle', 'Rack', 'Level', 'Status', 'Type', 'Item Code', 'Quantity', 'Capacity', 'Dimensions', 'Description'];
        const rows = this.binData.map(bin => [
            bin.id,
            bin.binCode,
            bin.zone,
            bin.aisle,
            bin.rack,
            bin.level,
            bin.status,
            bin.binType,
            bin.itemCode,
            bin.quantity,
            bin.capacity,
            bin.dimensions,
            bin.description
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

    // Essential utility methods
    formatDateTime: function(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    getStatusColor: function(status) {
        const colors = {
            'empty': '#22c55e',
            'occupied': '#3b82f6',
            'reserved': '#f59e0b',
            'blocked': '#ef4444'
        };
        return colors[status] || '#6b7280';
    },

    // Enhanced filtering system
    applyFilters: function() {
        let filtered = [...this.binData];
        this.activeFilters = {};

        // Zone filter
        const selectedZones = $('#zoneFilter').val();
        if (selectedZones && selectedZones.length > 0) {
            filtered = filtered.filter(bin => selectedZones.includes(bin.zone));
            this.activeFilters.zones = selectedZones;
        }

        // Status filter
        const selectedStatuses = $('#statusFilter').val();
        if (selectedStatuses && selectedStatuses.length > 0) {
            filtered = filtered.filter(bin => selectedStatuses.includes(bin.status));
            this.activeFilters.statuses = selectedStatuses;
        }

        // Type filter
        const selectedTypes = $('#typeFilter').val();
        if (selectedTypes && selectedTypes.length > 0) {
            filtered = filtered.filter(bin => selectedTypes.includes(bin.binType));
            this.activeFilters.types = selectedTypes;
        }

        // Utilization filter
        const selectedUtilizations = $('input[name="utilization"]:checked').map(function() {
            return $(this).val();
        }).get();

        if (selectedUtilizations.length > 0) {
            filtered = filtered.filter(bin => {
                const utilization = (bin.quantity / bin.capacity) * 100;
                return selectedUtilizations.some(range => {
                    const [min, max] = range.split('-').map(Number);
                    return utilization >= min && utilization <= max;
                });
            });
            this.activeFilters.utilizations = selectedUtilizations;
        }

        // Capacity range filter
        const capacityMin = parseInt($('#capacityMin').val());
        const capacityMax = parseInt($('#capacityMax').val());
        if (capacityMin > 0 || capacityMax < 1000) {
            filtered = filtered.filter(bin =>
                bin.capacity >= capacityMin && bin.capacity <= capacityMax
            );
            this.activeFilters.capacityRange = [capacityMin, capacityMax];
        }

        // Date range filter
        const dateFrom = $('#dateFrom').val();
        const dateTo = $('#dateTo').val();
        if (dateFrom || dateTo) {
            filtered = filtered.filter(bin => {
                const binDate = new Date(bin.lastUpdated);
                const fromDate = dateFrom ? new Date(dateFrom) : new Date('1900-01-01');
                const toDate = dateTo ? new Date(dateTo) : new Date();
                return binDate >= fromDate && binDate <= toDate;
            });
            this.activeFilters.dateRange = [dateFrom, dateTo];
        }

        this.filteredData = filtered;
        this.updateActiveFiltersDisplay();
        this.applySorting();
        this.updateStats();
    },

    applyQuickFilter: function(filter) {
        $('.quick-filter-btn').removeClass('active');
        $(`.quick-filter-btn[data-filter="${filter}"]`).addClass('active');

        let filtered = [...this.binData];

        switch(filter) {
            case 'critical':
                filtered = filtered.filter(bin => bin.priority === 'critical' || bin.status === 'blocked');
                break;
            case 'maintenance':
                filtered = filtered.filter(bin => bin.status === 'blocked' || bin.priority === 'critical');
                break;
            case 'empty':
                filtered = filtered.filter(bin => bin.status === 'empty');
                break;
            case 'full':
                filtered = filtered.filter(bin => (bin.quantity / bin.capacity) >= 0.9);
                break;
        }

        this.filteredData = filtered;
        this.renderCurrentView();
        this.updateStats();
    },

    updateCapacityRange: function() {
        const min = $('#capacityMin').val();
        const max = $('#capacityMax').val();
        $('#capacityMinValue').text(min);
        $('#capacityMaxValue').text(max);
    },

    updateActiveFiltersDisplay: function() {
        const container = $('#activeFilters');
        container.empty();

        Object.keys(this.activeFilters).forEach(filterType => {
            const values = this.activeFilters[filterType];
            if (Array.isArray(values) && values.length > 0) {
                values.forEach(value => {
                    if (value) {
                        const tag = $(`
                            <div class="filter-tag">
                                <span>${value}</span>
                                <button class="remove-filter" data-filter="${filterType}" data-value="${value}">
                                    <i class="material-icons">close</i>
                                </button>
                            </div>
                        `);
                        container.append(tag);
                    }
                });
            }
        });

        // Bind remove filter events
        $('.remove-filter').on('click', function() {
            const filterType = $(this).data('filter');
            const value = $(this).data('value');
            // Remove specific filter logic here
            $(this).parent().remove();
        });
    },

    // Enhanced sorting
    applySorting: function() {
        this.filteredData.sort((a, b) => {
            let aVal = a[this.sortBy];
            let bVal = b[this.sortBy];

            // Handle different data types
            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (this.sortOrder === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

        this.renderCurrentView();
    },

    // Enhanced search functionality
    handleSearch: function(query) {
        if (!query) {
            this.filteredData = [...this.binData];
        } else {
            this.filteredData = this.binData.filter(bin =>
                bin.binCode.toLowerCase().includes(query.toLowerCase()) ||
                bin.itemCode.toLowerCase().includes(query.toLowerCase()) ||
                bin.zone.toLowerCase().includes(query.toLowerCase()) ||
                bin.status.toLowerCase().includes(query.toLowerCase()) ||
                bin.binType.toLowerCase().includes(query.toLowerCase())
            );
        }
        this.renderCurrentView();
        this.updateStats();
    },

    showSearchSuggestions: function(query) {
        const suggestions = this.binData
            .filter(bin => bin.binCode.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 5)
            .map(bin => bin.binCode);

        const container = $('#searchSuggestions');
        container.empty();

        suggestions.forEach(suggestion => {
            const item = $(`<div class="suggestion-item">${suggestion}</div>`);
            item.on('click', () => {
                $('#globalSearch').val(suggestion);
                this.handleSearch(suggestion);
                this.hideSearchSuggestions();
            });
            container.append(item);
        });

        if (suggestions.length > 0) {
            container.show();
        }
    },

    hideSearchSuggestions: function() {
        $('#searchSuggestions').hide();
    },

    setSearchFilter: function(filter) {
        $('.search-filter-btn').removeClass('active');
        $(`.search-filter-btn[data-filter="${filter}"]`).addClass('active');
        console.log(`Search filter set to: ${filter}`);
    },

    updatePagination: function() {
        // Simple pagination implementation
        const totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
        console.log(`Page ${this.currentPage} of ${totalPages}`);
    },

    // Widget management
    updateWidgets: function() {
        this.updateActivityFeed();
        this.updateSmartAlerts();
        this.updateScheduleWidget();
    },

    updateActivityFeed: function() {
        const container = $('#realTimeActivity');
        container.empty();

        this.activityLog.forEach(activity => {
            const item = $(`
                <div class="activity-item" data-id="${activity.id}" data-type="activity">
                    <div class="activity-icon ${activity.iconClass}">
                        <i class="material-icons">${activity.icon}</i>
                    </div>
                    <div class="activity-details">
                        <div class="activity-title">${activity.title}</div>
                        <div class="activity-time">${activity.time}</div>
                    </div>
                </div>
            `);
            container.append(item);
        });
    },

    updateSmartAlerts: function() {
        const container = $('#smartAlerts');
        container.empty();

        this.smartAlerts.forEach(alert => {
            const item = $(`
                <div class="alert-item ${alert.type}" data-id="${alert.id}" data-type="alert">
                    <div class="alert-icon">
                        <i class="material-icons">${alert.icon}</i>
                    </div>
                    <div class="alert-content">
                        <div class="alert-title">${alert.title}</div>
                        <div class="alert-description">${alert.description}</div>
                    </div>
                    <button class="alert-action" data-action="${alert.action}">
                        <i class="material-icons">arrow_forward</i>
                    </button>
                </div>
            `);
            container.append(item);
        });
    },

    updateScheduleWidget: function() {
        const container = $('#todaySchedule');
        container.empty();

        this.scheduledTasks.forEach(task => {
            const item = $(`
                <div class="schedule-item" data-id="${task.id}" data-type="schedule">
                    <div class="schedule-time">${task.time}</div>
                    <div class="schedule-content">
                        <div class="schedule-title">${task.title}</div>
                        <div class="schedule-status ${task.status}">${task.status.replace('-', ' ')}</div>
                    </div>
                </div>
            `);
            container.append(item);
        });
    },

    // Modal management
    showQuickActionsModal: function() {
        $('#quickActionsModal').addClass('active');
    },

    showScheduleModal: function() {
        $('#scheduleModal').addClass('active');
    },

    showBulkActionsModal: function() {
        $('#bulkActionsModal').addClass('active');
        this.updateSelectionUI();
    },

    hideAllModals: function() {
        $('.modal').removeClass('active');
    },

    // Selection management
    updateSelectionUI: function() {
        $('#selectedCount').text(this.selectedBins.size);
    },

    selectAllBins: function() {
        this.filteredData.forEach(bin => {
            this.selectedBins.add(bin.id);
        });
        $('.bin-checkbox').prop('checked', true);
        this.updateSelectionUI();
    },

    clearSelection: function() {
        this.selectedBins.clear();
        $('.bin-checkbox').prop('checked', false);
        this.updateSelectionUI();
    },

    // Drag and drop functionality
    initializeDragAndDrop: function() {
        console.log('Initializing drag and drop functionality');
    },

    initializeKanbanDragDrop: function() {
        const self = this;

        // Make kanban items draggable
        $('.kanban-item').attr('draggable', true);

        $('.kanban-item').on('dragstart', function(e) {
            self.draggedItem = $(this).data('id');
            $(this).addClass('dragging');
            $('#dragOverlay').show();
        });

        $('.kanban-item').on('dragend', function(e) {
            $(this).removeClass('dragging');
            $('#dragOverlay').hide();
            self.draggedItem = null;
        });

        // Make columns droppable
        $('.kanban-column').on('dragover', function(e) {
            e.preventDefault();
            $(this).addClass('drag-over');
        });

        $('.kanban-column').on('dragleave', function(e) {
            $(this).removeClass('drag-over');
        });

        $('.kanban-column').on('drop', function(e) {
            e.preventDefault();
            $(this).removeClass('drag-over');

            const newStatus = $(this).data('status');
            if (self.draggedItem && newStatus) {
                self.updateBinStatus(self.draggedItem, newStatus);
            }
        });
    },

    updateBinStatus: function(binId, newStatus) {
        const bin = this.binData.find(b => b.id === binId);
        if (bin) {
            bin.status = newStatus;
            bin.lastUpdated = new Date().toISOString();
            this.renderKanbanView();
            this.updateStats();
            this.showNotification(`Bin ${bin.binCode} moved to ${this.statusLabels[newStatus]}`, 'success');
        }
    },

    // Advanced functionality placeholders
    startRealTimeUpdates: function() {
        console.log('Real-time updates started');
    },

    updateRealTimeData: function() {
        // Simulate real-time updates
        this.updateWidgets();
    },

    handleBinAction: function(action, id) {
        switch(action) {
            case 'edit':
                this.editBinLocation(id);
                break;
            case 'delete':
                this.deleteBinLocation(id);
                break;
            case 'scan':
                this.scanBinLocation(id);
                break;
        }
    },

    viewBinDetails: function(id) {
        this.editBinLocation(id);
    },

    handleWidgetClick: function(type, id) {
        console.log(`Widget clicked: ${type}, ID: ${id}`);
    },

    handleWidgetAction: function(action) {
        console.log(`Widget action: ${action}`);
    },

    handleKeyboardShortcuts: function(e) {
        // Implement keyboard shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'n':
                    e.preventDefault();
                    this.showAddModal();
                    break;
                case 'f':
                    e.preventDefault();
                    $('#globalSearch').focus();
                    break;
            }
        }
    },

    // Placeholder methods for advanced features
    showAnalytics: function() {
        this.showNotification('Analytics view coming soon', 'info');
    },

    showReports: function() {
        this.showNotification('Reports feature coming soon', 'info');
    },

    showProfile: function() {
        this.showNotification('Profile settings coming soon', 'info');
    },

    showPreferences: function() {
        this.showNotification('Preferences coming soon', 'info');
    },

    handleLogout: function() {
        if (confirm('Are you sure you want to logout?')) {
            this.showNotification('Logging out...', 'info');
        }
    },

    showNotifications: function() {
        this.showNotification('Notifications panel coming soon', 'info');
    },

    showHelp: function() {
        this.showNotification('Help documentation coming soon', 'info');
    },

    // Show notification
    showNotification: function(message, type = 'info') {
        const notification = $(`
            <div class="notification ${type}" style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'success' ? '#000' : type === 'error' ? '#ef4444' : '#6b7280'};
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
