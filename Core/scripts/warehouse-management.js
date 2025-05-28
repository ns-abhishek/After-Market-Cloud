/**
 * Advanced Warehouse Management System
 * Complete warehouse bin location management with multiple views and advanced features
 */

$(document).ready(function() {
    WarehouseManager.init();
});

const WarehouseManager = {
    // Enhanced bin location data
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

    // Application state
    filteredData: [],
    selectedBins: new Set(),
    currentView: 'dashboard',
    currentEditId: null,
    draggedItem: null,

    // Zone information with enhanced data
    zoneInfo: {
        'A': { name: 'Zone A - Receiving', color: '#8b5cf6', capacity: 150, occupied: 45, efficiency: 92 },
        'B': { name: 'Zone B - Storage', color: '#06b6d4', capacity: 200, occupied: 120, efficiency: 88 },
        'C': { name: 'Zone C - Picking', color: '#84cc16', capacity: 100, occupied: 65, efficiency: 95 },
        'D': { name: 'Zone D - Shipping', color: '#f97316', capacity: 80, occupied: 35, efficiency: 76 }
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

    // Initialize the application
    init: function() {
        this.filteredData = [...this.binData];
        this.bindEvents();
        this.updateStats();
        this.renderCurrentView();
        this.initializeDragAndDrop();
        this.startRealTimeUpdates();
        console.log('Warehouse Management System initialized successfully');
    },

    // Comprehensive event binding
    bindEvents: function() {
        const self = this;

        // Mobile menu toggle
        $('#mobileMenuToggle').on('click', function() {
            self.toggleSidebar();
        });

        // Sidebar overlay
        $('#sidebarOverlay').on('click', function() {
            self.closeSidebar();
        });

        // Navigation search
        $('#navSearch').on('input', function() {
            self.searchNavigation($(this).val());
        });

        // Navigation links
        $('.nav-link').on('click', function(e) {
            e.preventDefault();
            const module = $(this).data('module');
            self.activateModule(module);
        });

        $('.submenu-item').on('click', function(e) {
            e.preventDefault();
            const submenu = $(this).data('submenu');
            self.activateSubmenu(submenu);
        });

        // View switcher
        $('.view-btn').on('click', function() {
            const view = $(this).data('view');
            self.switchView(view);
        });

        // Header actions
        $('#notificationsBtn').on('click', function() {
            self.showNotifications();
        });

        $('#helpBtn').on('click', function() {
            self.showHelp();
        });

        $('#fullscreenBtn').on('click', function() {
            self.toggleFullscreen();
        });

        $('#quickAccessBtn').on('click', function() {
            self.showQuickAccess();
        });

        // Action bar buttons
        $('#printBtn').on('click', function() {
            self.printReport();
        });

        $('#importBtn').on('click', function() {
            $(this).next('.dropdown-menu').toggle();
        });

        $('#exportBtn').on('click', function() {
            $(this).next('.dropdown-menu').toggle();
        });

        $('#refreshBtn').on('click', function() {
            self.refreshData();
        });

        $('#addBinBtn').on('click', function() {
            self.showAddModal();
        });

        $('#scanBarcodeBtn').on('click', function() {
            self.showBarcodeScanner();
        });

        $('#quickActionsBtn').on('click', function() {
            self.showQuickActions();
        });

        $('#quickAccessBtn').on('click', function() {
            self.showQuickAccess();
        });

        // Import/Export actions
        $('.dropdown-item[data-import]').on('click', function() {
            const type = $(this).data('import');
            self.handleImport(type);
        });

        $('.dropdown-item[data-export]').on('click', function() {
            const type = $(this).data('export');
            self.handleExport(type);
        });

        // Global search
        $('#globalSearch').on('input', function() {
            const query = $(this).val();
            self.handleSearch(query);
            if (query.length > 2) {
                self.showSearchSuggestions(query);
            } else {
                self.hideSearchSuggestions();
            }
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

        $('#selectAll').on('change', function() {
            if ($(this).is(':checked')) {
                self.selectAllBins();
            } else {
                self.clearSelection();
            }
        });

        // Bin actions
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

        // Kanban drag and drop
        $('#autoArrangeBtn').on('click', function() {
            self.autoArrangeBins();
        });

        $('#bulkMoveBtn').on('click', function() {
            self.showBulkMoveModal();
        });

        // Modal events
        $('.modal-close, .modal-overlay, .quick-panel-close, .quick-panel-overlay').on('click', function() {
            self.hideAllModals();
        });

        $('#cancelBtn, #cancelScanBtn').on('click', function() {
            self.hideAllModals();
        });

        $('#saveBinBtn').on('click', function() {
            self.saveBinLocation();
        });

        $('#manualEntryBtn').on('click', function() {
            self.showManualEntry();
        });

        // Quick Actions
        $('.quick-action-item').on('click', function() {
            const action = $(this).data('action');
            self.handleQuickAction(action);
        });

        // Quick Access
        $('.quick-access-item').on('click', function() {
            const view = $(this).data('view');
            const action = $(this).data('action');
            if (view) {
                self.switchView(view);
            } else if (action) {
                self.handleQuickAction(action);
            }
            self.hideAllModals();
        });

        // Barcode Scanner
        $('#toggleFlashlight').on('click', function() {
            self.toggleFlashlight();
        });

        $('#switchCamera').on('click', function() {
            self.switchCamera();
        });

        // Prevent modal close when clicking inside content
        $('.modal-content, .quick-panel-content').on('click', function(e) {
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

    // View switching functionality
    switchView: function(view) {
        this.currentView = view;
        $('.view-btn').removeClass('active');
        $(`.view-btn[data-view="${view}"]`).addClass('active');

        // Hide all view containers
        $('.view-container').hide();

        // Show selected view
        $(`#${view}View`).show();

        // Update breadcrumb
        this.updateBreadcrumb(view);

        // Render view content
        this.renderCurrentView();

        console.log(`Switched to ${view} view`);
    },

    // Render current view
    renderCurrentView: function() {
        switch(this.currentView) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'table':
                this.renderTableView();
                break;
            case 'grid':
                this.renderGridView();
                break;
            case 'kanban':
                this.renderKanbanView();
                break;
            case 'map':
                this.renderMapView();
                break;
            case 'analytics':
                this.renderAnalyticsView();
                break;
            case 'timeline':
                this.renderTimelineView();
                break;
        }
    },

    // Dashboard rendering
    renderDashboard: function() {
        this.updateStats();
        this.updateActivityFeed();
        this.updateZonePerformance();
    },

    // Update statistics
    updateStats: function() {
        const stats = this.calculateStats();
        $('#totalBins').text(stats.total);
        $('#occupiedBins').text(stats.occupied);
        $('#emptyBins').text(stats.empty);
        $('#criticalBins').text(stats.critical);
    },

    calculateStats: function() {
        const total = this.binData.length;
        const occupied = this.binData.filter(bin => bin.status === 'occupied').length;
        const empty = this.binData.filter(bin => bin.status === 'empty').length;
        const critical = this.binData.filter(bin => bin.priority === 'critical' || bin.status === 'blocked').length;

        return { total, occupied, empty, critical };
    },

    // Update activity feed
    updateActivityFeed: function() {
        const activities = [
            { icon: 'input', iconClass: 'receiving', title: 'Bin A01-R01-L03 allocated', time: '2 minutes ago', meta: 'Zone A • Item: ITM001' },
            { icon: 'shopping_cart', iconClass: 'picking', title: 'Pick completed from C02-R05-L01', time: '5 minutes ago', meta: 'Zone C • Qty: 25 units' },
            { icon: 'compare_arrows', iconClass: 'transfer', title: 'Transfer initiated B03-R02-L02', time: '8 minutes ago', meta: 'Zone B → Zone D' },
            { icon: 'build', iconClass: 'maintenance', title: 'Maintenance completed on D01-R01-L01', time: '12 minutes ago', meta: 'Zone D • Status: Active' }
        ];

        const container = $('#realTimeActivity');
        container.empty();

        activities.forEach(activity => {
            const item = $(`
                <div class="activity-item">
                    <div class="activity-icon ${activity.iconClass}">
                        <i class="material-icons">${activity.icon}</i>
                    </div>
                    <div class="activity-details">
                        <div class="activity-title">${activity.title}</div>
                        <div class="activity-time">${activity.time}</div>
                        <div class="activity-meta">${activity.meta}</div>
                    </div>
                </div>
            `);
            container.append(item);
        });
    },

    // Update zone performance
    updateZonePerformance: function() {
        const container = $('#zonePerformance');
        container.empty();

        Object.keys(this.zoneInfo).forEach(zoneKey => {
            const zone = this.zoneInfo[zoneKey];
            const utilization = Math.round((zone.occupied / zone.capacity) * 100);

            const item = $(`
                <div class="zone-item">
                    <div class="zone-header">
                        <div class="zone-name">${zone.name}</div>
                        <div class="zone-efficiency">${zone.efficiency}%</div>
                    </div>
                    <div class="zone-stats">
                        <div class="zone-stat">
                            <span class="stat-label">Capacity:</span>
                            <span class="stat-value">${zone.occupied}/${zone.capacity}</span>
                        </div>
                        <div class="zone-stat">
                            <span class="stat-label">Utilization:</span>
                            <span class="stat-value">${utilization}%</span>
                        </div>
                    </div>
                    <div class="zone-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${utilization}%"></div>
                        </div>
                    </div>
                </div>
            `);
            container.append(item);
        });
    },

    // Table view rendering
    renderTableView: function() {
        const tbody = $('#binTableBody');
        tbody.empty();

        this.filteredData.forEach(bin => {
            const capacityPercentage = bin.capacity > 0 ? (bin.quantity / bin.capacity) * 100 : 0;

            const row = $(`
                <tr data-id="${bin.id}">
                    <td><input type="checkbox" class="bin-checkbox" value="${bin.id}"></td>
                    <td>${bin.binCode}</td>
                    <td>${bin.zone}</td>
                    <td>${bin.aisle}</td>
                    <td>${bin.rack}</td>
                    <td>${bin.level}</td>
                    <td><span class="status-badge ${bin.status}">${this.statusLabels[bin.status]}</span></td>
                    <td>${bin.itemCode || '-'}</td>
                    <td>${bin.quantity}</td>
                    <td>${bin.capacity}</td>
                    <td>
                        <div class="utilization-bar">
                            <div class="utilization-fill" style="width: ${capacityPercentage}%"></div>
                        </div>
                        <span class="utilization-text">${Math.round(capacityPercentage)}%</span>
                    </td>
                    <td><span class="priority-badge ${bin.priority}">${this.priorityLabels[bin.priority]}</span></td>
                    <td>${this.formatDateTime(bin.lastUpdated)}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-icon" data-action="edit" title="Edit">
                                <i class="material-icons">edit</i>
                            </button>
                            <button class="btn-icon" data-action="delete" title="Delete">
                                <i class="material-icons">delete</i>
                            </button>
                        </div>
                    </td>
                </tr>
            `);
            tbody.append(row);
        });
    },

    // Grid view rendering
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
                        <span class="status-badge ${bin.status}">${this.statusLabels[bin.status]}</span>
                    </div>
                    <div class="bin-details">
                        <div class="bin-location">
                            <div class="location-item">
                                <span class="location-label">Aisle:</span>
                                <span class="location-value">${bin.aisle}</span>
                            </div>
                            <div class="location-item">
                                <span class="location-label">Rack:</span>
                                <span class="location-value">${bin.rack}</span>
                            </div>
                            <div class="location-item">
                                <span class="location-label">Level:</span>
                                <span class="location-value">${bin.level}</span>
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
                        <p><strong>Priority:</strong> <span class="priority-badge ${bin.priority}">${this.priorityLabels[bin.priority]}</span></p>
                        <p><strong>Last Updated:</strong> ${this.formatDateTime(bin.lastUpdated)}</p>
                    </div>
                    <div class="bin-actions">
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

    // Map view rendering
    renderMapView: function() {
        // The map is now static HTML, just add click handlers
        $('.bin-slot').off('click').on('click', function() {
            const binCode = $(this).data('bin');
            const bin = WarehouseManager.binData.find(b => b.binCode === binCode);
            if (bin) {
                WarehouseManager.viewBinDetails(bin.id);
            } else {
                WarehouseManager.showNotification(`Bin ${binCode} not found in database`, 'warning');
            }
        });

        // Add hover effects for bin slots
        $('.bin-slot').hover(
            function() {
                const binCode = $(this).data('bin');
                const title = $(this).attr('title');
                $(this).attr('data-original-title', title);
            },
            function() {
                // Hover out
            }
        );

        // Update map controls
        $('#zoomIn').off('click').on('click', function() {
            WarehouseManager.zoomMap(1.2);
        });

        $('#zoomOut').off('click').on('click', function() {
            WarehouseManager.zoomMap(0.8);
        });

        $('#resetView').off('click').on('click', function() {
            WarehouseManager.resetMapView();
        });

        $('#toggleHeatmap').off('click').on('click', function() {
            WarehouseManager.toggleHeatmap();
        });

        $('#toggle3D').off('click').on('click', function() {
            WarehouseManager.toggle3DView();
        });
    },

    // Map control methods
    zoomMap: function(factor) {
        const container = $('.warehouse-layout');
        const currentScale = container.data('scale') || 1;
        const newScale = currentScale * factor;

        if (newScale >= 0.5 && newScale <= 2) {
            container.css('transform', `scale(${newScale})`);
            container.data('scale', newScale);
            this.showNotification(`Zoom: ${Math.round(newScale * 100)}%`, 'info');
        }
    },

    resetMapView: function() {
        $('.warehouse-layout').css('transform', 'scale(1)').data('scale', 1);
        this.showNotification('Map view reset', 'info');
    },

    toggleHeatmap: function() {
        const btn = $('#toggleHeatmap');
        btn.toggleClass('active');

        if (btn.hasClass('active')) {
            $('.bin-slot').addClass('heatmap-mode');
            this.showNotification('Heatmap view enabled', 'info');
        } else {
            $('.bin-slot').removeClass('heatmap-mode');
            this.showNotification('Heatmap view disabled', 'info');
        }
    },

    toggle3DView: function() {
        const btn = $('#toggle3D');
        btn.toggleClass('active');

        if (btn.hasClass('active')) {
            $('.warehouse-layout').addClass('view-3d');
            this.showNotification('3D view enabled', 'info');
        } else {
            $('.warehouse-layout').removeClass('view-3d');
            this.showNotification('3D view disabled', 'info');
        }
    },

    // Utility functions
    formatDateTime: function(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    updateBreadcrumb: function(view) {
        const viewNames = {
            dashboard: 'Dashboard',
            table: 'Table View',
            grid: 'Grid View',
            kanban: 'Kanban Board',
            map: 'Warehouse Map',
            analytics: 'Analytics',
            timeline: 'Timeline'
        };

        $('#breadcrumb .breadcrumb-item.active').text(viewNames[view] || 'Bin Location Management');
    },

    // Placeholder methods for advanced features
    toggleSidebar: function() {
        $('.sidebar').toggleClass('open');
        $('#sidebarOverlay').toggle();
    },

    closeSidebar: function() {
        $('.sidebar').removeClass('open');
        $('#sidebarOverlay').hide();
    },

    searchNavigation: function(query) {
        console.log('Searching navigation:', query);
    },

    activateModule: function(module) {
        $('.nav-link').removeClass('active');
        $(`.nav-link[data-module="${module}"]`).addClass('active');
        console.log('Activated module:', module);
    },

    activateSubmenu: function(submenu) {
        console.log('Activated submenu:', submenu);
    },

    handleSearch: function(query) {
        if (!query) {
            this.filteredData = [...this.binData];
        } else {
            this.filteredData = this.binData.filter(bin =>
                bin.binCode.toLowerCase().includes(query.toLowerCase()) ||
                bin.itemCode.toLowerCase().includes(query.toLowerCase()) ||
                bin.zone.toLowerCase().includes(query.toLowerCase()) ||
                bin.status.toLowerCase().includes(query.toLowerCase())
            );
        }
        this.renderCurrentView();
    },

    showSearchSuggestions: function(query) {
        console.log('Showing search suggestions for:', query);
    },

    hideSearchSuggestions: function() {
        $('#searchSuggestions').hide();
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

    updateSelectionUI: function() {
        console.log('Selected bins:', this.selectedBins.size);
    },

    viewBinDetails: function(id) {
        const bin = this.binData.find(b => b.id === id);
        if (bin) {
            this.showEditModal(bin);
        }
    },

    handleBinAction: function(action, id) {
        switch(action) {
            case 'edit':
                this.editBinLocation(id);
                break;
            case 'delete':
                this.deleteBinLocation(id);
                break;
        }
    },

    // Modal management
    showAddModal: function() {
        $('#addBinModal').addClass('active');
    },

    showEditModal: function(bin) {
        // Populate form with bin data
        $('#binCode').val(bin.binCode);
        $('#zone').val(bin.zone);
        $('#aisle').val(bin.aisle);
        $('#rack').val(bin.rack);
        $('#level').val(bin.level);
        $('#binType').val(bin.binType);
        $('#capacity').val(bin.capacity);
        $('#description').val(bin.description);

        this.currentEditId = bin.id;
        $('#addBinModal').addClass('active');
    },

    hideAllModals: function() {
        $('.modal, .quick-panel').removeClass('active');
        this.currentEditId = null;
    },

    // Quick Actions
    showQuickActions: function() {
        $('#quickActionsPanel').addClass('active');
    },

    showQuickAccess: function() {
        $('#quickAccessPanel').addClass('active');
    },

    handleQuickAction: function(action) {
        this.hideAllModals();

        switch(action) {
            case 'scan':
                this.showBarcodeScanner();
                break;
            case 'add-bin':
                this.showAddModal();
                break;
            case 'bulk-move':
                this.showBulkMoveModal();
                break;
            case 'export':
                this.handleExport('csv');
                break;
            case 'import':
                this.handleImport('csv');
                break;
            case 'print':
                this.printReport();
                break;
            case 'search':
                $('#globalSearch').focus();
                break;
            case 'filter':
                this.showFilterModal();
                break;
            case 'refresh':
                this.refreshData();
                break;
        }
    },

    // Barcode Scanner
    showBarcodeScanner: function() {
        $('#barcodeScannerModal').addClass('active');
        this.initializeScanner();
    },

    initializeScanner: function() {
        // Simulate scanner initialization
        console.log('Initializing barcode scanner...');

        // Simulate a successful scan after 3 seconds
        setTimeout(() => {
            this.simulateSuccessfulScan();
        }, 3000);
    },

    simulateSuccessfulScan: function() {
        const scannedCode = 'BIN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        $('#scannedCode').text(scannedCode);
        $('#scannerResult').show();

        // Find bin by scanned code
        const bin = this.binData.find(b => b.binCode === scannedCode);
        if (bin) {
            this.showNotification(`Found bin: ${bin.binCode}`, 'success');
            setTimeout(() => {
                this.hideAllModals();
                this.viewBinDetails(bin.id);
            }, 2000);
        } else {
            this.showNotification(`Scanned: ${scannedCode} - No matching bin found`, 'info');
        }
    },

    toggleFlashlight: function() {
        const btn = $('#toggleFlashlight');
        const icon = btn.find('.material-icons');

        if (icon.text() === 'flashlight_on') {
            icon.text('flashlight_off');
            this.showNotification('Flashlight turned off', 'info');
        } else {
            icon.text('flashlight_on');
            this.showNotification('Flashlight turned on', 'info');
        }
    },

    switchCamera: function() {
        this.showNotification('Switching camera...', 'info');
        // Simulate camera switch
        setTimeout(() => {
            this.showNotification('Camera switched successfully', 'success');
        }, 1000);
    },

    showManualEntry: function() {
        this.hideAllModals();
        const code = prompt('Enter barcode manually:');
        if (code) {
            $('#scannedCode').text(code);
            this.simulateSuccessfulScan();
            this.showBarcodeScanner();
        }
    },

    saveBinLocation: function() {
        const formData = {
            binCode: $('#binCode').val(),
            zone: $('#zone').val(),
            aisle: $('#aisle').val(),
            rack: $('#rack').val(),
            level: $('#level').val(),
            binType: $('#binType').val(),
            capacity: parseInt($('#capacity').val()),
            description: $('#description').val()
        };

        if (this.currentEditId) {
            // Update existing bin
            const binIndex = this.binData.findIndex(b => b.id === this.currentEditId);
            if (binIndex !== -1) {
                Object.assign(this.binData[binIndex], formData);
                this.showNotification('Bin location updated successfully', 'success');
            }
        } else {
            // Add new bin
            const newBin = {
                id: Date.now(),
                ...formData,
                status: 'empty',
                itemCode: '',
                quantity: 0,
                dimensions: '100x50x30 cm',
                lastUpdated: new Date().toISOString(),
                priority: 'medium',
                temperature: 22,
                humidity: 45
            };
            this.binData.push(newBin);
            this.showNotification('Bin location added successfully', 'success');
        }

        this.filteredData = [...this.binData];
        this.renderCurrentView();
        this.updateStats();
        this.hideAllModals();
    },

    editBinLocation: function(id) {
        const bin = this.binData.find(b => b.id === id);
        if (bin) {
            this.showEditModal(bin);
        }
    },

    deleteBinLocation: function(id) {
        if (confirm('Are you sure you want to delete this bin location?')) {
            this.binData = this.binData.filter(b => b.id !== id);
            this.filteredData = [...this.binData];
            this.renderCurrentView();
            this.updateStats();
            this.showNotification('Bin location deleted successfully', 'success');
        }
    },

    // Drag and drop functionality
    initializeDragAndDrop: function() {
        console.log('Initializing drag and drop functionality');
    },

    initializeKanbanDragDrop: function() {
        const self = this;

        $('.kanban-item').attr('draggable', true);

        $('.kanban-item').on('dragstart', function(e) {
            self.draggedItem = $(this).data('id');
            $(this).addClass('dragging');
        });

        $('.kanban-item').on('dragend', function(e) {
            $(this).removeClass('dragging');
            self.draggedItem = null;
        });

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

    // Placeholder methods for other features
    renderAnalyticsView: function() {
        console.log('Rendering analytics view');
    },

    renderTimelineView: function() {
        console.log('Rendering timeline view');
    },

    autoArrangeBins: function() {
        this.showNotification('Auto-arrange feature coming soon', 'info');
    },

    showBulkMoveModal: function() {
        this.showNotification('Bulk move feature coming soon', 'info');
    },

    handleImport: function(type) {
        this.showNotification(`Import ${type} feature coming soon`, 'info');
    },

    handleExport: function(type) {
        this.showNotification(`Export ${type} feature coming soon`, 'info');
    },

    printReport: function() {
        window.print();
    },

    refreshData: function() {
        this.renderCurrentView();
        this.updateStats();
        this.showNotification('Data refreshed successfully', 'success');
    },

    showNotifications: function() {
        this.showNotification('Notifications panel coming soon', 'info');
    },

    showHelp: function() {
        this.showNotification('Help documentation coming soon', 'info');
    },

    toggleFullscreen: function() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    },

    showQuickAccess: function() {
        this.showNotification('Quick access panel coming soon', 'info');
    },

    startRealTimeUpdates: function() {
        console.log('Real-time updates started');
    },

    updateRealTimeData: function() {
        this.updateActivityFeed();
    },

    handleKeyboardShortcuts: function(e) {
        if (e.altKey) {
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    this.switchView('dashboard');
                    break;
                case '2':
                    e.preventDefault();
                    this.switchView('table');
                    break;
                case '3':
                    e.preventDefault();
                    this.switchView('grid');
                    break;
                case '4':
                    e.preventDefault();
                    this.switchView('kanban');
                    break;
                case '5':
                    e.preventDefault();
                    this.switchView('map');
                    break;
                case '6':
                    e.preventDefault();
                    this.switchView('analytics');
                    break;
                case '7':
                    e.preventDefault();
                    this.switchView('timeline');
                    break;
            }
        }
    },

    // Show notification
    showNotification: function(message, type = 'info') {
        const notification = $(`
            <div class="notification ${type}">
                ${message}
            </div>
        `);

        $('body').append(notification);

        setTimeout(() => {
            notification.addClass('show');
        }, 100);

        setTimeout(() => {
            notification.removeClass('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
};
