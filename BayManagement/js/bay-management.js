// Bay Management System - Main JavaScript

class BayManagement {
    constructor() {
        this.bays = [];
        this.jobs = [];
        this.selectedBay = null;
        this.draggedJob = null;
        this.scale = 1;
        this.currentLayout = 'flow'; // Only flow layout
        this.viewMode = 'zones'; // zones, list, compact
        this.collapsedZones = new Set();

        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.generateBays();
        this.generateSampleJobs();
        this.updateStatusCards();
        this.setupDragAndDrop();
        this.setupTheme();
        this.setupTouchGestures();
    }

    loadData() {
        this.bays = Utils.loadFromStorage('bays', []);
        this.jobs = Utils.loadFromStorage('jobs', []);
    }

    saveData() {
        Utils.saveToStorage('bays', this.bays);
        Utils.saveToStorage('jobs', this.jobs);
    }

    setupEventListeners() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            Utils.toggleTheme();
        });

        // Layout controls
        document.getElementById('addBay').addEventListener('click', () => this.addNewBay());

        // Zoom controls
        document.getElementById('zoomIn').addEventListener('click', () => this.zoom(1.2));
        document.getElementById('zoomOut').addEventListener('click', () => this.zoom(0.8));
        document.getElementById('resetView').addEventListener('click', () => this.resetZoom());

        // Quick actions
        document.getElementById('addJob').addEventListener('click', () => this.showJobModal());
        document.getElementById('blockBay').addEventListener('click', () => this.showBlockBayDialog());
        document.getElementById('viewSchedule').addEventListener('click', () => this.showSchedule());
        document.getElementById('manageBays').addEventListener('click', () => this.showBayManagement());

        // Add held jobs button if it exists
        const heldJobsBtn = document.getElementById('viewHeldJobs');
        if (heldJobsBtn) {
            heldJobsBtn.addEventListener('click', () => this.showHeldJobs());
        }

        // Modal save buttons
        document.getElementById('saveBayConfig').addEventListener('click', () => this.saveBayConfiguration());
        document.getElementById('saveJob').addEventListener('click', () => this.saveJob());

        // Progress slider
        document.getElementById('progressSlider').addEventListener('input', (e) => {
            const progress = e.target.value;
            document.getElementById('jobProgress').style.width = `${progress}%`;
        });

        // Layout controls
        this.setupLayoutControls();

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Search input for Workshop Layout
        const baySearchInput = document.getElementById('baySearchInput');
        if (baySearchInput) {
            baySearchInput.addEventListener('input', (e) => {
                this.filterBays(e.target.value);
            });
        }
    }

    setupLayoutControls() {
        // Create simplified view controls (only view modes, no layout switching)
        const layoutControls = document.createElement('div');
        layoutControls.className = 'layout-controls';
        layoutControls.innerHTML = `
            <div class="btn-group" role="group">
                <button class="btn btn-sm btn-outline-secondary view-btn active" data-view="zones" title="Zone View">
                    <i class="fas fa-layer-group"></i> Zones
                </button>
                <button class="btn btn-sm btn-outline-secondary view-btn" data-view="list" title="List View">
                    <i class="fas fa-list"></i> List
                </button>
                <button class="btn btn-sm btn-outline-secondary view-btn" data-view="compact" title="Compact View">
                    <i class="fas fa-compress"></i> Compact
                </button>
            </div>
        `;

        // Insert before existing controls
        const existingControls = document.querySelector('.card-header .btn-group');
        if (existingControls) {
            existingControls.parentNode.insertBefore(layoutControls, existingControls);
        }

        // Add event listeners for view buttons only
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                e.target.closest('.view-btn').classList.add('active');
                this.viewMode = e.target.closest('.view-btn').dataset.view;
                this.renderBays();
            });
        });
    }

    setupTheme() {
        const savedTheme = Utils.getTheme();
        Utils.setTheme(savedTheme);
    }

    setupTouchGestures() {
        const bayLayout = document.getElementById('bayLayout');

        Utils.addSwipeGesture(bayLayout, {
            swipeLeft: () => this.showNextView(),
            swipeRight: () => this.showPreviousView(),
            swipeUp: () => this.showJobQueue(),
            swipeDown: () => this.hideJobQueue()
        });
    }

    generateBays() {
        if (this.bays.length === 0) {
            // Generate categorized bay layout with distinct zones
            this.createCategorizedBayLayout();
            this.saveData();
        }

        this.renderBays();
    }

    createCategorizedBayLayout() {
        // Clear existing bays
        this.bays = [];

        // Define distinct zones with proper spacing and positioning
        const zones = [
            {
                type: 'heavy-duty',
                label: 'Heavy Duty Zone',
                color: '#dc3545',
                startPos: { x: 70, y: 80 },
                bays: [
                    { x: 70, y: 80 }, { x: 220, y: 80 }, { x: 370, y: 80 },
                    { x: 70, y: 190 }, { x: 220, y: 190 }, { x: 370, y: 190 }
                ],
                equipment: ['Heavy Duty Lift', '40-Ton Lift', 'Hydraulic Press', 'Heavy Duty Lift', '50-Ton Lift', 'Industrial Lift'],
                capacity: [25, 30, 35, 40, 45, 50]
            },
            {
                type: 'painting',
                label: 'Paint Shop',
                color: '#fd7e14',
                startPos: { x: 520, y: 80 },
                bays: [
                    { x: 520, y: 80 }, { x: 670, y: 80 },
                    { x: 520, y: 190 }, { x: 670, y: 190 }
                ],
                equipment: ['Paint Booth', 'Prep Station', 'Color Match', 'Detail Bay'],
                capacity: [10, 12, 15, 8]
            },
            {
                type: 'alignment',
                label: 'Alignment Center',
                color: '#0dcaf0',
                startPos: { x: 70, y: 320 },
                bays: [
                    { x: 70, y: 320 }, { x: 200, y: 320 }, { x: 330, y: 320 },
                    { x: 460, y: 320 }, { x: 590, y: 320 }, { x: 720, y: 320 }
                ],
                equipment: ['Alignment Rack', '4-Wheel Alignment', 'Hunter Alignment', 'Precision Alignment', 'Wheel Alignment', 'Advanced Alignment'],
                capacity: [8, 10, 12, 8, 10, 12]
            },
            {
                type: 'inspection',
                label: 'Inspection Station',
                color: '#198754',
                startPos: { x: 70, y: 450 },
                bays: [
                    { x: 70, y: 450 }, { x: 200, y: 450 }, { x: 330, y: 450 }, { x: 460, y: 450 }
                ],
                equipment: ['Inspection Pit', 'Safety Check', 'MOT Bay', 'Annual Inspection'],
                capacity: [6, 8, 10, 6]
            },
            {
                type: 'general',
                label: 'General Service',
                color: '#6c757d',
                startPos: { x: 70, y: 580 },
                bays: [
                    { x: 70, y: 580 }, { x: 200, y: 580 }, { x: 330, y: 580 },
                    { x: 460, y: 580 }, { x: 590, y: 580 }, { x: 720, y: 580 },
                    { x: 70, y: 690 }, { x: 200, y: 690 }, { x: 330, y: 690 },
                    { x: 460, y: 690 }, { x: 590, y: 690 }, { x: 720, y: 690 }
                ],
                equipment: ['2-Post Lift', 'Hydraulic Lift', '4-Post Lift', 'Scissor Lift', '2-Post Lift', 'Service Bay', 'Quick Service', 'Maintenance Bay', 'Service Lift', 'General Service', 'Multi-Service', 'Service Bay'],
                capacity: [5, 8, 10, 6, 5, 8, 5, 8, 10, 6, 8, 10]
            }
        ];

        let bayCounter = 1;

        // Create bays for each zone
        zones.forEach(zone => {
            zone.bays.forEach((position, index) => {
                const bay = {
                    id: `BAY-${bayCounter.toString().padStart(2, '0')}`,
                    type: zone.type,
                    status: 'available',
                    position: position,
                    equipment: [zone.equipment[index] || zone.equipment[0]],
                    capacity: zone.capacity[index] || zone.capacity[0],
                    currentJob: null,
                    tags: [zone.type.replace('-', ' '), 'zone-' + zone.type],
                    zone: zone.type,
                    zoneColor: zone.color
                };

                this.bays.push(bay);
                bayCounter++;
            });
        });
    }

    filterBays(query) {
        query = (query || '').toLowerCase();
        // Filter by bay number, zone, type, or any other property
        const filteredBays = this.bays.filter(bay => {
            return (
                (bay.id && bay.id.toLowerCase().includes(query)) ||
                (bay.zone && bay.zone.toLowerCase().includes(query)) ||
                (bay.type && bay.type.toLowerCase().includes(query)) ||
                (bay.label && bay.label.toLowerCase().includes(query))
            );
        });
        this.renderBays(filteredBays);
    }

    renderBays(filteredBays = null) {
        const bayLayout = document.getElementById('bayLayout');
        bayLayout.innerHTML = '';

        // Remove all layout classes
        bayLayout.className = 'bay-layout';

        // Add current layout and view classes
        bayLayout.classList.add(`layout-${this.currentLayout}`);
        bayLayout.classList.add(`view-${this.viewMode}`);

        // Always render flow layout with different view modes
        if (this.viewMode === 'zones') {
            this.renderFlowLayout(bayLayout);
        } else if (this.viewMode === 'list') {
            this.renderFlowListView(bayLayout);
        } else {
            this.renderFlowCompactView(bayLayout);
        }

        // Add common elements
        // this.addCommonElements(bayLayout);
    }

    renderFlowListView(bayLayout) {
        const listContainer = document.createElement('div');
        listContainer.className = 'flow-list-container';

        const zones = this.getZoneGroups();
        Object.entries(zones).forEach(([zoneType, zoneBays]) => {
            const zoneSection = document.createElement('div');
            zoneSection.className = 'flow-list-zone-section';
            zoneSection.innerHTML = `
                <div class="flow-list-zone-header">
                    <h6><i class="${this.getZoneIcon(zoneType)}"></i> ${this.getZoneLabel(zoneType)}</h6>
                </div>
                <div class="flow-list-zone-bays"></div>
            `;

            const baysContainer = zoneSection.querySelector('.flow-list-zone-bays');
            zoneBays.forEach(bay => {
                const bayRow = document.createElement('div');
                bayRow.className = `flow-list-bay-row ${bay.status}`;
                bayRow.dataset.bayId = bay.id;

                const timeDisplay = bay.currentJob && bay.currentJob.startTime ?
                    this.getElapsedTime(bay.currentJob.startTime) : '';

                bayRow.innerHTML = `
                    <div class="flow-list-bay-id">${bay.id}</div>
                    <div class="flow-list-bay-status">${bay.status}</div>
                    <div class="flow-list-bay-capacity">${bay.capacity}T</div>
                    <div class="flow-list-bay-equipment">${bay.equipment[0]}</div>
                    <div class="flow-list-bay-job">${bay.currentJob ? `${bay.currentJob.vehicle} ${timeDisplay ? `(${timeDisplay})` : ''}` : 'Available - Drop job here'}</div>
                `;

                bayRow.addEventListener('click', () => this.selectBay(bay));
                bayRow.addEventListener('contextmenu', (e) => this.showBayContextMenu(e, bay));

                // Add drag and drop support
                bayRow.addEventListener('dragover', (e) => {
                    if (this.draggedJob && bay.status === 'available') {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'move';
                        bayRow.classList.add('drag-over');
                    }
                });

                bayRow.addEventListener('dragleave', (e) => {
                    if (!bayRow.contains(e.relatedTarget)) {
                        bayRow.classList.remove('drag-over');
                    }
                });

                bayRow.addEventListener('drop', (e) => {
                    e.preventDefault();
                    bayRow.classList.remove('drag-over');
                    if (this.draggedJob && bay.status === 'available') {
                        this.assignJobToBay(this.draggedJob, bay);
                    }
                });

                baysContainer.appendChild(bayRow);
            });

            listContainer.appendChild(zoneSection);
        });

        bayLayout.appendChild(listContainer);
    }

    renderFlowCompactView(bayLayout) {
        const compactContainer = document.createElement('div');
        compactContainer.className = 'flow-compact-container';

        const zones = this.getZoneGroups();
        Object.entries(zones).forEach(([zoneType, zoneBays]) => {
            const zoneGroup = document.createElement('div');
            zoneGroup.className = 'flow-compact-zone';
            zoneGroup.innerHTML = `
                <div class="flow-compact-zone-label">
                    <i class="${this.getZoneIcon(zoneType)}"></i>
                    ${this.getZoneLabel(zoneType)}
                </div>
                <div class="flow-compact-bays"></div>
            `;

            const baysContainer = zoneGroup.querySelector('.flow-compact-bays');
            zoneBays.forEach(bay => {
                const compactBay = document.createElement('div');
                compactBay.className = `flow-compact-bay-item ${bay.status}`;
                compactBay.dataset.bayId = bay.id;

                const timeDisplay = bay.currentJob && bay.currentJob.startTime ?
                    ` - ${this.getElapsedTime(bay.currentJob.startTime)}` : '';

                compactBay.innerHTML = `
                    <div class="flow-compact-bay-id">${bay.id}</div>
                    <div class="flow-compact-bay-indicator"></div>
                `;

                const tooltipText = bay.currentJob ?
                    `${bay.id} - ${bay.status} - ${bay.capacity}T - ${bay.equipment[0]} - ${bay.currentJob.vehicle}${timeDisplay}` :
                    `${bay.id} - ${bay.status} - ${bay.capacity}T - ${bay.equipment[0]} - Available`;

                compactBay.title = tooltipText;
                compactBay.addEventListener('click', () => this.selectBay(bay));
                compactBay.addEventListener('contextmenu', (e) => this.showBayContextMenu(e, bay));

                // Add drag and drop support
                compactBay.addEventListener('dragover', (e) => {
                    if (this.draggedJob && bay.status === 'available') {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'move';
                        compactBay.classList.add('drag-over');
                    }
                });

                compactBay.addEventListener('dragleave', (e) => {
                    if (!compactBay.contains(e.relatedTarget)) {
                        compactBay.classList.remove('drag-over');
                    }
                });

                compactBay.addEventListener('drop', (e) => {
                    e.preventDefault();
                    compactBay.classList.remove('drag-over');
                    if (this.draggedJob && bay.status === 'available') {
                        this.assignJobToBay(this.draggedJob, bay);
                    }
                });

                baysContainer.appendChild(compactBay);
            });

            compactContainer.appendChild(zoneGroup);
        });

        bayLayout.appendChild(compactContainer);
    }

    renderFlowLayout(bayLayout) {
        const zones = this.getZoneGroups();
        let currentY = 50;

        Object.entries(zones).forEach(([zoneType, zoneBays]) => {
            // Create flowing zone container
            const zoneContainer = document.createElement('div');
            zoneContainer.className = 'flow-zone';
            zoneContainer.style.cssText = `
                position: absolute;
                left: 20px;
                top: ${currentY}px;
                width: calc(100% - 40px);
                min-height: 120px;
                background: linear-gradient(135deg, ${this.getZoneColor(zoneType)}10, ${this.getZoneColor(zoneType)}20);
                border: 2px solid ${this.getZoneColor(zoneType)}40;
                border-radius: 20px;
                padding: 20px;
                margin-bottom: 20px;
            `;

            // Add zone header
            const zoneHeader = document.createElement('div');
            zoneHeader.className = 'flow-zone-header';
            zoneHeader.innerHTML = `
                <h6 style="color: ${this.getZoneColor(zoneType)}; margin: 0 0 15px 0;">
                    <i class="${this.getZoneIcon(zoneType)} me-2"></i>
                    ${this.getZoneLabel(zoneType)}
                    <span class="badge bg-secondary ms-2">${zoneBays.length} bays</span>
                </h6>
            `;
            zoneContainer.appendChild(zoneHeader);

            // Add bays in flowing layout
            const baysContainer = document.createElement('div');
            baysContainer.className = 'flow-bays';
            baysContainer.style.cssText = `
                display: flex;
                flex-wrap: wrap;
                gap: 15px;
                align-items: flex-start;
            `;

            zoneBays.forEach((bay, index) => {
                const bayElement = this.createFlowBayElement(bay);
                baysContainer.appendChild(bayElement);
            });

            zoneContainer.appendChild(baysContainer);
            bayLayout.appendChild(zoneContainer);

            currentY += zoneContainer.offsetHeight || 150;
        });
    }



    // Helper methods for new layout system
    getZoneGroups() {
        const groups = {};
        this.bays.forEach(bay => {
            if (!groups[bay.type]) {
                groups[bay.type] = [];
            }
            groups[bay.type].push(bay);
        });
        return groups;
    }

    getZoneColor(zoneType) {
        const colors = {
            'heavy-duty': '#dc3545',
            'painting': '#fd7e14',
            'alignment': '#0dcaf0',
            'inspection': '#198754',
            'general': '#6c757d'
        };
        return colors[zoneType] || '#6c757d';
    }

    getZoneIcon(zoneType) {
        const icons = {
            'heavy-duty': 'fas fa-truck',
            'painting': 'fas fa-spray-can',
            'alignment': 'fas fa-crosshairs',
            'inspection': 'fas fa-search',
            'general': 'fas fa-wrench'
        };
        return icons[zoneType] || 'fas fa-wrench';
    }

    getZoneLabel(zoneType) {
        const labels = {
            'heavy-duty': 'Heavy Duty Zone',
            'painting': 'Paint Shop',
            'alignment': 'Alignment Center',
            'inspection': 'Inspection Station',
            'general': 'General Service'
        };
        return labels[zoneType] || 'General Service';
    }



    createFlowBayElement(bay) {
        const element = document.createElement('div');
        element.className = `flow-bay-item ${bay.status}`;
        element.dataset.bayId = bay.id;
        element.dataset.type = bay.type;

        // Calculate elapsed time if job is running
        const timeDisplay = bay.currentJob && bay.currentJob.startTime ?
            `<div class="bay-time-flow">${this.getElapsedTime(bay.currentJob.startTime)}</div>` : '';

        element.innerHTML = `
            <div class="flow-bay-header">
                <span class="bay-id-flow">${bay.id}</span>
                <span class="bay-status-flow status-${bay.status}">${bay.status}</span>
                ${timeDisplay}
            </div>
            <div class="flow-bay-details">
                <div class="capacity-flow">${bay.capacity}T</div>
                ${bay.currentJob ? `
                    <div class="job-flow">
                        <div class="vehicle-flow">${bay.currentJob.vehicle}</div>
                        <div class="customer-flow">${bay.currentJob.customer}</div>
                        <div class="progress-flow">
                            <div class="progress-bar-flow" style="width: ${bay.currentJob.progress || 0}%"></div>
                        </div>
                    </div>
                ` : '<div class="available-flow">Available - Drop job here</div>'}
            </div>
        `;

        // Add event listeners
        element.addEventListener('click', () => this.selectBay(bay));
        element.addEventListener('contextmenu', (e) => this.showBayContextMenu(e, bay));

        // Add drag and drop support for job assignment
        element.addEventListener('dragover', (e) => {
            if (this.draggedJob && bay.status === 'available') {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                element.classList.add('drag-over');
            }
        });

        element.addEventListener('dragleave', (e) => {
            if (!element.contains(e.relatedTarget)) {
                element.classList.remove('drag-over');
            }
        });

        element.addEventListener('drop', (e) => {
            e.preventDefault();
            element.classList.remove('drag-over');
            if (this.draggedJob && bay.status === 'available') {
                this.assignJobToBay(this.draggedJob, bay);
            }
        });

        // Bay dragging for reassignment
        if (bay.currentJob) {
            element.draggable = true;
            element.addEventListener('dragstart', (e) => this.handleBayDragStart(e, bay));
        }

        return element;
    }





    // addCommonElements(bayLayout) {
    //     // Add trash bin
    //     const trashBin = this.createTrashBin();
    //     bayLayout.appendChild(trashBin);

    //     // Add delete overlay
    //     const deleteOverlay = document.createElement('div');
    //     deleteOverlay.className = 'delete-overlay';
    //     deleteOverlay.innerHTML = '<div class="delete-overlay-text">Drop bays here to delete</div>';
    //     bayLayout.appendChild(deleteOverlay);
    // }

    createZoneLabels(bayLayout) {
        const zones = {
            'heavy-duty': {
                position: { x: 60, y: 50 },
                width: 360,
                height: 160,
                label: 'Heavy Duty Zone',
                icon: 'fas fa-truck',
                color: '#dc3545'
            },
            'painting': {
                position: { x: 510, y: 50 },
                width: 210,
                height: 160,
                label: 'Paint Shop',
                icon: 'fas fa-spray-can',
                color: '#fd7e14'
            },
            'alignment': {
                position: { x: 60, y: 290 },
                width: 700,
                height: 80,
                label: 'Alignment Center',
                icon: 'fas fa-crosshairs',
                color: '#0dcaf0'
            },
            'inspection': {
                position: { x: 60, y: 420 },
                width: 440,
                height: 80,
                label: 'Inspection Station',
                icon: 'fas fa-search',
                color: '#198754'
            },
            'general': {
                position: { x: 60, y: 550 },
                width: 700,
                height: 170,
                label: 'General Service',
                icon: 'fas fa-wrench',
                color: '#6c757d'
            }
        };

        Object.entries(zones).forEach(([type, zone]) => {
            // Create zone background
            const zoneBackground = document.createElement('div');
            zoneBackground.className = 'zone-background';
            zoneBackground.style.cssText = `
                position: absolute;
                left: ${zone.position.x - 10}px;
                top: ${zone.position.y - 10}px;
                width: ${zone.width}px;
                height: ${zone.height}px;
                background: linear-gradient(135deg, ${zone.color}08, ${zone.color}15);
                border: 2px dashed ${zone.color}40;
                border-radius: 12px;
                z-index: 1;
            `;
            bayLayout.appendChild(zoneBackground);

            // Create zone label
            const zoneLabel = document.createElement('div');
            zoneLabel.className = 'zone-label';
            zoneLabel.innerHTML = `
                <i class="${zone.icon}"></i>
                <span>${zone.label}</span>
            `;
            zoneLabel.style.cssText = `
                position: absolute;
                left: ${zone.position.x}px;
                top: ${zone.position.y - 5}px;
                background: ${zone.color};
                color: white;
                padding: 4px 12px;
                border-radius: 15px;
                font-size: 0.8rem;
                font-weight: 600;
                z-index: 2;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            `;
            bayLayout.appendChild(zoneLabel);
        });
    }

    createBayElement(bay) {
        const element = document.createElement('div');
        element.className = `bay-item ${bay.status}`;
        element.style.left = `${bay.position.x}px`;
        element.style.top = `${bay.position.y}px`;
        element.dataset.bayId = bay.id;
        element.dataset.type = bay.type;

        let progressHtml = '';
        if (bay.currentJob && bay.currentJob.progress > 0) {
            progressHtml = `
                <div class="bay-progress">
                    <div class="bay-progress-bar" style="width: ${bay.currentJob.progress}%"></div>
                </div>
            `;
        }

        // Add type indicator
        const typeIndicator = `<div class="bay-type-indicator" title="${bay.type}"></div>`;

        // Add time tracking display
        let timeDisplay = '';
        if (bay.currentJob && bay.currentJob.startTime) {
            const elapsed = this.getElapsedTime(bay.currentJob.startTime);
            timeDisplay = `<div class="bay-time">${elapsed}</div>`;
        }

        element.innerHTML = `
            <div class="bay-label">${bay.id}</div>
            <div class="bay-status">${bay.status.charAt(0).toUpperCase() + bay.status.slice(1)}</div>
            ${timeDisplay}
            ${progressHtml}
            ${typeIndicator}
        `;

        // Add event listeners
        element.addEventListener('click', () => this.selectBay(bay));
        element.addEventListener('dblclick', () => this.showBayConfiguration(bay));
        element.addEventListener('contextmenu', (e) => this.showBayContextMenu(e, bay));
        element.addEventListener('mouseenter', (e) => this.showBayTooltip(e, bay));
        element.addEventListener('mouseleave', () => this.hideBayTooltip());

        // Make draggable for repositioning
        element.draggable = true;
        element.addEventListener('dragstart', (e) => this.handleBayDragStart(e, bay));
        element.addEventListener('dragend', () => this.handleBayDragEnd());

        return element;
    }

    // createTrashBin() {
    //     const trashBin = document.createElement('div');
    //     trashBin.className = 'trash-bin';
    //     trashBin.id = 'trashBin';

    //     trashBin.innerHTML = `
    //         <div class="trash-bin-icon">
    //             <i class="fas fa-trash-alt"></i>
    //         </div>
    //         <div class="trash-bin-label">Delete Bay</div>
    //     `;

    //     // Add drag and drop event listeners
    //     trashBin.addEventListener('dragover', (e) => {
    //         e.preventDefault();
    //         e.dataTransfer.dropEffect = 'move';
    //         trashBin.classList.add('drag-over');
    //         document.getElementById('bayLayout').classList.add('delete-mode');
    //     });

    //     trashBin.addEventListener('dragleave', (e) => {
    //         // Only remove if we're actually leaving the trash bin
    //         if (!trashBin.contains(e.relatedTarget)) {
    //             trashBin.classList.remove('drag-over');
    //             document.getElementById('bayLayout').classList.remove('delete-mode');
    //         }
    //     });

    //     trashBin.addEventListener('drop', (e) => {
    //         e.preventDefault();
    //         trashBin.classList.remove('drag-over');
    //         document.getElementById('bayLayout').classList.remove('delete-mode');
    //         this.handleBayDelete(e);
    //     });

    //     // Click to show delete instructions
    //     trashBin.addEventListener('click', () => {
    //         Utils.showToast('Drag any available bay here to delete it', 'info');
    //     });

    //     return trashBin;
    // }

    generateSampleJobs() {
        if (this.jobs.length === 0) {
            const sampleJobs = [
                { vehicle: 'Toyota Camry', customer: 'John Smith', service: 'Oil Change', duration: 1, priority: 'low' },
                { vehicle: 'BMW X5', customer: 'Sarah Johnson', service: 'Brake Repair', duration: 3, priority: 'high' },
                { vehicle: 'Honda Civic', customer: 'Mike Brown', service: 'Tire Rotation', duration: 0.5, priority: 'medium' },
                { vehicle: 'Ford F-150', customer: 'David Wilson', service: 'Engine Diagnostic', duration: 2, priority: 'high' },
                { vehicle: 'Nissan Altima', customer: 'Lisa Davis', service: 'AC Service', duration: 1.5, priority: 'medium' }
            ];

            sampleJobs.forEach(job => {
                this.jobs.push({
                    id: Utils.generateId(),
                    ...job,
                    status: 'pending',
                    progress: 0,
                    createdAt: new Date(),
                    estimatedCompletion: new Date(Date.now() + job.duration * 60 * 60 * 1000),
                    assignedEmployee: null,
                    requiredSkills: this.getRequiredSkills(job.service)
                });
            });

            this.saveData();
        }

        this.renderJobQueue();
    }

    renderJobQueue() {
        const jobQueue = document.getElementById('jobQueue');
        jobQueue.innerHTML = '';

        const pendingJobs = this.jobs.filter(job => job.status === 'pending');

        if (pendingJobs.length === 0) {
            jobQueue.innerHTML = '<div class="text-center p-3 text-muted">No pending jobs</div>';
            return;
        }

        pendingJobs.forEach(job => {
            const jobElement = this.createJobElement(job);
            jobQueue.appendChild(jobElement);
        });
    }

    createJobElement(job) {
        const element = document.createElement('div');
        element.className = 'job-item';
        element.dataset.jobId = job.id;
        element.draggable = true;

        element.innerHTML = `
            <div class="job-title">${job.vehicle}</div>
            <div class="job-details">
                <div><i class="fas fa-user me-1"></i>${job.customer}</div>
                <div><i class="fas fa-wrench me-1"></i>${job.service}</div>
                <div><i class="fas fa-clock me-1"></i>${Utils.formatDuration(job.duration)}</div>
            </div>
            <span class="job-priority ${job.priority}">${job.priority.toUpperCase()}</span>
        `;

        // Add drag event listeners
        element.addEventListener('dragstart', (e) => this.handleJobDragStart(e, job));
        element.addEventListener('dragend', () => this.handleJobDragEnd());
        element.addEventListener('click', () => this.showJobDetails(job));

        return element;
    }

    setupDragAndDrop() {
        const bayLayout = document.getElementById('bayLayout');

        // Allow drop on bay layout
        bayLayout.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });

        bayLayout.addEventListener('drop', (e) => {
            e.preventDefault();
            this.handleJobDrop(e);
        });

        // Setup sortable for job queue
        const jobQueue = document.getElementById('jobQueue');
        new Sortable(jobQueue, {
            animation: 150,
            ghostClass: 'dragging',
            onEnd: () => this.updateJobOrder()
        });
    }

    handleJobDragStart(e, job) {
        this.draggedJob = job;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.outerHTML);
    }

    handleJobDragEnd() {
        document.querySelectorAll('.job-item.dragging').forEach(el => {
            el.classList.remove('dragging');
        });
        this.draggedJob = null;
    }

    handleJobDrop(e) {
        if (!this.draggedJob) return;

        // Check for different bay element types in flow layout
        const bayElement = e.target.closest('.flow-bay-item') ||
                          e.target.closest('.flow-list-bay-row') ||
                          e.target.closest('.flow-compact-bay-item') ||
                          e.target.closest('.bay-item'); // fallback for old layout

        if (!bayElement) return;

        const bayId = bayElement.dataset.bayId;
        const bay = this.bays.find(b => b.id === bayId);

        if (bay && bay.status === 'available') {
            this.assignJobToBay(this.draggedJob, bay);
        } else {
            Utils.showToast('Bay is not available for assignment', 'warning');
        }
    }

    assignJobToBay(job, bay) {
        // Update bay status
        bay.status = 'occupied';
        bay.currentJob = {
            ...job,
            progress: 0,
            startTime: new Date(),
            estimatedEndTime: new Date(Date.now() + (job.duration * 60 * 60 * 1000))
        };

        // Update job status
        job.status = 'in-progress';
        job.assignedBay = bay.id;

        // Remove from pending jobs
        this.jobs = this.jobs.filter(j => j.id !== job.id);

        this.saveData();
        this.renderBays();
        this.renderJobQueue();
        this.updateStatusCards();

        Utils.showToast(`Job assigned to ${bay.id}`, 'success');

        // Start time tracking
        this.startTimeTracking(bay);
    }

    updateStatusCards() {
        const available = this.bays.filter(b => b.status === 'available').length;
        const occupied = this.bays.filter(b => b.status === 'occupied').length;
        const maintenance = this.bays.filter(b => b.status === 'maintenance').length;
        const blocked = this.bays.filter(b => b.status === 'blocked').length;

        document.getElementById('availableBays').textContent = available;
        document.getElementById('occupiedBays').textContent = occupied;
        document.getElementById('maintenanceBays').textContent = maintenance;
        document.getElementById('blockedBays').textContent = blocked;
    }

    selectBay(bay) {
        // Remove previous selection
        document.querySelectorAll('.bay-item').forEach(el => {
            el.classList.remove('animate-pulse');
        });

        // Select new bay
        this.selectedBay = bay;
        const bayElement = document.querySelector(`[data-bay-id="${bay.id}"]`);
        if (bayElement) {
            bayElement.classList.add('animate-pulse');
            Utils.scrollToElement(bayElement, 100);
        }

        Utils.showToast(`Selected ${bay.id}`, 'info');

        // Open booking calendar modal for this bay
        if (window.calendarManager) {
            window.calendarManager.selectedBay = bay;
            // Render the calendar (pre-selects bay in booking form)
            window.calendarManager.renderCalendar();
        }
        const bookingModal = document.getElementById('bookingModal');
        if (bookingModal) {
            const modal = new bootstrap.Modal(bookingModal);
            modal.show();
        }
    }

    showBayConfiguration(bay) {
        this.selectedBay = bay;

        // Populate form
        document.getElementById('bayId').value = bay.id;
        document.getElementById('bayType').value = bay.type;
        document.getElementById('equipment').value = bay.equipment.join(', ');
        document.getElementById('capacity').value = bay.capacity;
        document.getElementById('customTags').value = bay.tags.join(', ');

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('configModal'));
        modal.show();
    }

    saveBayConfiguration() {
        if (!this.selectedBay) return;

        const formData = {
            type: document.getElementById('bayType').value,
            equipment: document.getElementById('equipment').value.split(',').map(s => s.trim()).filter(s => s),
            capacity: parseInt(document.getElementById('capacity').value),
            tags: document.getElementById('customTags').value.split(',').map(s => s.trim()).filter(s => s)
        };

        // Validate
        const errors = Utils.validateForm(formData, {
            capacity: { required: true, min: 1, max: 50 }
        });

        if (errors.length > 0) {
            Utils.showToast(errors[0], 'error');
            return;
        }

        // Update bay
        Object.assign(this.selectedBay, formData);

        this.saveData();
        this.renderBays();

        // Hide modal
        bootstrap.Modal.getInstance(document.getElementById('configModal')).hide();

        Utils.showToast('Bay configuration saved', 'success');
    }

    zoom(factor) {
        this.scale *= factor;
        this.scale = Math.max(0.5, Math.min(2, this.scale)); // Limit zoom range

        const bayLayout = document.getElementById('bayLayout');
        bayLayout.style.transform = `scale(${this.scale})`;
        bayLayout.style.transformOrigin = 'top left';
    }

    resetZoom() {
        this.scale = 1;
        const bayLayout = document.getElementById('bayLayout');
        bayLayout.style.transform = 'scale(1)';
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case '=':
                case '+':
                    e.preventDefault();
                    this.zoom(1.2);
                    break;
                case '-':
                    e.preventDefault();
                    this.zoom(0.8);
                    break;
                case '0':
                    e.preventDefault();
                    this.resetZoom();
                    break;
            }
        }

        // Other shortcuts
        switch (e.key) {
            case 'Escape':
                this.selectedBay = null;
                document.querySelectorAll('.bay-item').forEach(el => {
                    el.classList.remove('animate-pulse');
                });
                break;
        }
    }

    showJobModal(job = null) {
        if (job) {
            // Edit existing job
            document.getElementById('vehicle').value = job.vehicle;
            document.getElementById('customer').value = job.customer;
            document.getElementById('serviceType').value = job.service;
            document.getElementById('duration').value = job.duration;
            document.getElementById('progressSlider').value = job.progress || 0;
            document.getElementById('jobProgress').style.width = `${job.progress || 0}%`;
        } else {
            // New job
            document.getElementById('jobForm').reset();
            document.getElementById('progressSlider').value = 0;
            document.getElementById('jobProgress').style.width = '0%';
        }

        const modal = new bootstrap.Modal(document.getElementById('jobModal'));
        modal.show();
    }

    saveJob() {
        const formData = {
            vehicle: document.getElementById('vehicle').value,
            customer: document.getElementById('customer').value,
            service: document.getElementById('serviceType').value,
            duration: parseFloat(document.getElementById('duration').value),
            progress: parseInt(document.getElementById('progressSlider').value)
        };

        // Validate
        const errors = Utils.validateForm(formData, {
            vehicle: { required: true, minLength: 2 },
            customer: { required: true, minLength: 2 },
            service: { required: true },
            duration: { required: true, min: 0.5, max: 24 }
        });

        if (errors.length > 0) {
            Utils.showToast(errors[0], 'error');
            return;
        }

        // Create new job
        const job = {
            id: Utils.generateId(),
            ...formData,
            status: 'pending',
            priority: 'medium',
            createdAt: new Date(),
            estimatedCompletion: new Date(Date.now() + formData.duration * 60 * 60 * 1000)
        };

        this.jobs.push(job);
        this.saveData();
        this.renderJobQueue();

        // Hide modal
        bootstrap.Modal.getInstance(document.getElementById('jobModal')).hide();

        Utils.showToast('Job created successfully', 'success');
    }

    // Additional methods for enhanced functionality
    showBayTooltip(e, bay) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip-custom';
        tooltip.innerHTML = `
            <strong>${bay.id}</strong><br>
            Type: ${bay.type}<br>
            Capacity: ${bay.capacity} tons<br>
            Equipment: ${bay.equipment.join(', ')}<br>
            ${bay.currentJob ? `Current: ${bay.currentJob.vehicle}` : 'Available'}
        `;

        document.body.appendChild(tooltip);

        const rect = e.target.getBoundingClientRect();
        tooltip.style.left = `${rect.right + 10}px`;
        tooltip.style.top = `${rect.top}px`;

        setTimeout(() => tooltip.classList.add('show'), 10);

        this.currentTooltip = tooltip;
    }

    hideBayTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.remove();
            this.currentTooltip = null;
        }
    }

    showBayContextMenu(e, bay) {
        e.preventDefault();

        const menuItems = [
            {
                icon: 'fas fa-cog',
                text: 'Configure',
                action: () => this.showBayConfiguration(bay)
            },
            {
                icon: 'fas fa-ban',
                text: bay.status === 'blocked' ? 'Unblock' : 'Block',
                action: () => this.toggleBayBlock(bay)
            },
            {
                icon: 'fas fa-tools',
                text: 'Maintenance',
                action: () => this.setBayMaintenance(bay)
            },
            {
                icon: 'fas fa-eye',
                text: 'View Details',
                action: () => this.showBayDetails(bay)
            }
        ];

        // Add delete option if bay is available
        if (bay.status === 'available') {
            menuItems.push({
                icon: 'fas fa-trash',
                text: 'Delete Bay',
                action: () => this.confirmDeleteBay(bay)
            });
        }

        if (bay.currentJob) {
            menuItems.push({
                icon: 'fas fa-exchange-alt',
                text: 'Reassign Job',
                action: () => this.showReassignJobDialog(bay)
            });
            menuItems.push({
                icon: 'fas fa-times',
                text: 'Complete Job',
                action: () => this.completeJob(bay)
            });
        }

        Utils.createContextMenu(menuItems, e.clientX, e.clientY);
    }

    toggleBayBlock(bay) {
        if (bay.status === 'blocked') {
            this.unblockBay(bay);
        } else if (bay.status === 'available') {
            this.showBlockBayModal(bay);
        } else {
            Utils.showToast('Cannot block bay - currently in use', 'error');
            return;
        }
    }

    showBlockBayModal(bay) {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-ban me-2"></i>Block ${bay.id}
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="blockBayForm">
                            <div class="mb-3">
                                <label class="form-label">Reason for Blocking</label>
                                <select class="form-select" id="blockReason" required>
                                    <option value="">Select reason...</option>
                                    <option value="maintenance">Scheduled Maintenance</option>
                                    <option value="cleaning">Deep Cleaning</option>
                                    <option value="repair">Equipment Repair</option>
                                    <option value="inspection">Safety Inspection</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Duration</label>
                                <select class="form-select" id="blockDuration" required>
                                    <option value="">Select duration...</option>
                                    <option value="1">1 Hour</option>
                                    <option value="2">2 Hours</option>
                                    <option value="4">4 Hours</option>
                                    <option value="8">8 Hours (Full Day)</option>
                                    <option value="24">24 Hours</option>
                                    <option value="48">48 Hours</option>
                                    <option value="indefinite">Indefinite</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Additional Notes</label>
                                <textarea class="form-control" id="blockNotes" rows="3" placeholder="Optional notes..."></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-warning" onclick="bayManagement.blockBay('${bay.id}')">Block Bay</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    blockBay(bayId) {
        const bay = this.bays.find(b => b.id === bayId);
        if (!bay) return;

        const reason = document.getElementById('blockReason').value;
        const duration = document.getElementById('blockDuration').value;
        const notes = document.getElementById('blockNotes').value;

        if (!reason || !duration) {
            Utils.showToast('Please fill in all required fields', 'error');
            return;
        }

        bay.status = 'blocked';
        bay.blockInfo = {
            reason: reason,
            duration: duration,
            notes: notes,
            blockedAt: new Date(),
            blockedBy: 'Current User', // In real app, this would be the logged-in user
            unblockAt: duration === 'indefinite' ? null : new Date(Date.now() + (parseInt(duration) * 60 * 60 * 1000))
        };

        this.saveData();
        this.renderBays();
        this.updateStatusCards();

        // Hide modal
        const modal = document.querySelector('.modal.show');
        if (modal) {
            bootstrap.Modal.getInstance(modal).hide();
        }

        Utils.showToast(`${bay.id} blocked for ${reason}`, 'warning');

        // Set auto-unblock timer if duration is specified
        if (bay.blockInfo.unblockAt) {
            this.scheduleAutoUnblock(bay);
        }
    }

    unblockBay(bay) {
        bay.status = 'available';
        delete bay.blockInfo;

        this.saveData();
        this.renderBays();
        this.updateStatusCards();

        Utils.showToast(`${bay.id} unblocked`, 'success');
    }

    scheduleAutoUnblock(bay) {
        const timeUntilUnblock = bay.blockInfo.unblockAt - new Date();
        if (timeUntilUnblock > 0) {
            setTimeout(() => {
                if (bay.status === 'blocked' && bay.blockInfo) {
                    this.unblockBay(bay);
                    Utils.showToast(`${bay.id} automatically unblocked`, 'info');
                }
            }, timeUntilUnblock);
        }
    }

    setBayMaintenance(bay) {
        if (bay.status === 'occupied') {
            Utils.showToast('Cannot set maintenance - bay is occupied', 'error');
            return;
        }

        bay.status = bay.status === 'maintenance' ? 'available' : 'maintenance';

        this.saveData();
        this.renderBays();
        this.updateStatusCards();

        Utils.showToast(`${bay.id} ${bay.status === 'maintenance' ? 'set to' : 'removed from'} maintenance`, 'info');
    }

    showBayDetails(bay) {
        let blockingInfo = '';
        if (bay.status === 'blocked' && bay.blockInfo) {
            const blockedSince = Utils.formatDate(new Date(bay.blockInfo.blockedAt));
            const unblockTime = bay.blockInfo.unblockAt ?
                Utils.formatDate(new Date(bay.blockInfo.unblockAt)) : 'Indefinite';

            blockingInfo = `
                <hr>
                <h6>Blocking Information</h6>
                <div class="row">
                    <div class="col-6"><strong>Reason:</strong></div>
                    <div class="col-6">${bay.blockInfo.reason}</div>
                </div>
                <div class="row mt-2">
                    <div class="col-6"><strong>Blocked Since:</strong></div>
                    <div class="col-6">${blockedSince}</div>
                </div>
                <div class="row mt-2">
                    <div class="col-6"><strong>Unblock Time:</strong></div>
                    <div class="col-6">${unblockTime}</div>
                </div>
                ${bay.blockInfo.notes ? `
                    <div class="row mt-2">
                        <div class="col-6"><strong>Notes:</strong></div>
                        <div class="col-6">${bay.blockInfo.notes}</div>
                    </div>
                ` : ''}
            `;
        }

        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-info-circle me-2"></i>${bay.id} Details
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-6"><strong>Type:</strong></div>
                            <div class="col-6">${bay.type}</div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-6"><strong>Status:</strong></div>
                            <div class="col-6">
                                <span class="status-indicator ${bay.status}"></span>
                                ${bay.status.charAt(0).toUpperCase() + bay.status.slice(1)}
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-6"><strong>Capacity:</strong></div>
                            <div class="col-6">${bay.capacity} tons</div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-6"><strong>Equipment:</strong></div>
                            <div class="col-6">${bay.equipment.join(', ')}</div>
                        </div>
                        ${bay.currentJob ? `
                            <hr>
                            <h6>Current Job</h6>
                            <div class="row">
                                <div class="col-6"><strong>Vehicle:</strong></div>
                                <div class="col-6">${bay.currentJob.vehicle}</div>
                            </div>
                            <div class="row mt-2">
                                <div class="col-6"><strong>Customer:</strong></div>
                                <div class="col-6">${bay.currentJob.customer}</div>
                            </div>
                            <div class="row mt-2">
                                <div class="col-6"><strong>Started:</strong></div>
                                <div class="col-6">${Utils.formatDate(new Date(bay.currentJob.startTime))}</div>
                            </div>
                            <div class="row mt-2">
                                <div class="col-6"><strong>Elapsed:</strong></div>
                                <div class="col-6">${this.getElapsedTime(bay.currentJob.startTime)}</div>
                            </div>
                            <div class="row mt-2">
                                <div class="col-6"><strong>Progress:</strong></div>
                                <div class="col-6">
                                    <div class="progress">
                                        <div class="progress-bar" style="width: ${bay.currentJob.progress}%">
                                            ${bay.currentJob.progress}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ` : ''}
                        ${blockingInfo}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        ${bay.currentJob ? `
                            <button type="button" class="btn btn-warning" onclick="bayManagement.holdJob('${bay.id}')" title="Put job on hold">
                                <i class="fas fa-pause me-2"></i>Hold Job
                            </button>
                            <button type="button" class="btn btn-success" onclick="bayManagement.completeJobFromModal('${bay.id}')" title="Mark job as complete">
                                <i class="fas fa-check me-2"></i>Complete Job
                            </button>
                        ` : ''}
                        ${bay.status === 'available' ? `
                            <button type="button" class="btn btn-danger" onclick="bayManagement.removeBay('${bay.id}')">
                                Remove Bay
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    holdJob(bayId) {
        const bay = this.bays.find(b => b.id === bayId);
        if (!bay || !bay.currentJob) {
            Utils.showToast('No active job found in this bay', 'error');
            return;
        }

        // Show hold job confirmation modal
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-pause me-2"></i>Hold Job - ${bay.currentJob.vehicle}
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-warning">
                            <i class="fas fa-exclamation-triangle me-2"></i>
                            This will put the job on hold and free up the bay for other work.
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Reason for Hold</label>
                            <select class="form-select" id="holdReason" required>
                                <option value="">Select reason...</option>
                                <option value="waiting-parts">Waiting for Parts</option>
                                <option value="customer-approval">Customer Approval Required</option>
                                <option value="additional-diagnosis">Additional Diagnosis Needed</option>
                                <option value="scheduling-conflict">Scheduling Conflict</option>
                                <option value="equipment-issue">Equipment Issue</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Notes (Optional)</label>
                            <textarea class="form-control" id="holdNotes" rows="3" placeholder="Additional details about why the job is being held..."></textarea>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Expected Resume Date</label>
                            <input type="date" class="form-control" id="expectedResumeDate" min="${new Date().toISOString().split('T')[0]}">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-warning" onclick="bayManagement.confirmHoldJob('${bayId}')">
                            <i class="fas fa-pause me-2"></i>Hold Job
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    confirmHoldJob(bayId) {
        const bay = this.bays.find(b => b.id === bayId);
        if (!bay || !bay.currentJob) return;

        const reason = document.getElementById('holdReason').value;
        const notes = document.getElementById('holdNotes').value;
        const expectedResumeDate = document.getElementById('expectedResumeDate').value;

        if (!reason) {
            Utils.showToast('Please select a reason for holding the job', 'error');
            return;
        }

        // Create held job record
        const heldJob = {
            ...bay.currentJob,
            status: 'on-hold',
            heldAt: new Date(),
            heldReason: reason,
            heldNotes: notes,
            expectedResumeDate: expectedResumeDate ? new Date(expectedResumeDate) : null,
            originalBayId: bay.id,
            heldBy: 'Current User' // In real app, this would be the logged-in user
        };

        // Add to held jobs list
        let heldJobs = Utils.loadFromStorage('heldJobs', []);
        heldJobs.push(heldJob);
        Utils.saveToStorage('heldJobs', heldJobs);

        // Clear bay and stop time tracking
        if (bay.timeTrackingInterval) {
            clearInterval(bay.timeTrackingInterval);
            delete bay.timeTrackingInterval;
        }

        bay.status = 'available';
        bay.currentJob = null;

        this.saveData();
        this.renderBays();
        this.updateStatusCards();

        // Close modals
        const modals = document.querySelectorAll('.modal.show');
        modals.forEach(modal => {
            bootstrap.Modal.getInstance(modal).hide();
        });

        Utils.showToast(`Job for ${heldJob.vehicle} put on hold - ${reason}`, 'warning');
    }

    completeJobFromContextMenu(bayId) {
        const bay = this.bays.find(b => b.id === bayId);
        if (!bay || !bay.currentJob) return;

        // Close the context menu specifically
        const contextMenu = document.querySelector('.bay-context-menu');
        if (contextMenu) {
            contextMenu.remove();
        }

        // Close any other modals
        const existingModals = document.querySelectorAll('.modal.show');
        existingModals.forEach(modal => {
            const bsModal = bootstrap.Modal.getInstance(modal);
            if (bsModal) {
                bsModal.hide();
            }
        });

        // Wait a moment for cleanup, then show completion modal
        setTimeout(() => {
            this.showCompletionModal(bay);
        }, 200);
    }

    completeJobFromModal(bayId) {
        const bay = this.bays.find(b => b.id === bayId);
        if (!bay || !bay.currentJob) return;

        // Close the bay details modal specifically
        const existingModals = document.querySelectorAll('.modal.show');
        existingModals.forEach(modal => {
            const bsModal = bootstrap.Modal.getInstance(modal);
            if (bsModal) {
                bsModal.hide();
            }
        });

        // Wait a moment for cleanup, then show completion modal
        setTimeout(() => {
            this.showCompletionModal(bay);
        }, 200);
    }

    completeJob(bay) {
        if (!bay.currentJob) return;

        // Close any existing modals first
        const existingModals = document.querySelectorAll('.modal.show');
        existingModals.forEach(modal => {
            const bsModal = bootstrap.Modal.getInstance(modal);
            if (bsModal) {
                bsModal.hide();
            }
        });

        // Wait a moment for modals to close, then show completion modal
        setTimeout(() => {
            this.showCompletionModal(bay);
        }, 300);
    }

    showCompletionModal(bay) {
        // Remove any existing completion modals
        const existingCompletionModals = document.querySelectorAll('.modal[data-modal-type="completion"]');
        existingCompletionModals.forEach(modal => modal.remove());

        // Show completion confirmation modal
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.setAttribute('data-modal-type', 'completion');
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-check me-2"></i>Complete Job - ${bay.currentJob.vehicle}
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-success">
                            <i class="fas fa-check-circle me-2"></i>
                            Mark this job as completed and free up the bay.
                        </div>
                        <div class="job-summary mb-3">
                            <h6>Job Summary:</h6>
                            <div class="row">
                                <div class="col-6"><strong>Vehicle:</strong></div>
                                <div class="col-6">${bay.currentJob.vehicle}</div>
                            </div>
                            <div class="row">
                                <div class="col-6"><strong>Customer:</strong></div>
                                <div class="col-6">${bay.currentJob.customer}</div>
                            </div>
                            <div class="row">
                                <div class="col-6"><strong>Service:</strong></div>
                                <div class="col-6">${bay.currentJob.service}</div>
                            </div>
                            <div class="row">
                                <div class="col-6"><strong>Started:</strong></div>
                                <div class="col-6">${Utils.formatDate(new Date(bay.currentJob.startTime))}</div>
                            </div>
                            <div class="row">
                                <div class="col-6"><strong>Duration:</strong></div>
                                <div class="col-6">${this.getElapsedTime(bay.currentJob.startTime)}</div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Completion Notes (Optional)</label>
                            <textarea class="form-control" id="completionNotes" rows="3" placeholder="Any additional notes about the completed work..."></textarea>
                        </div>
                        <div class="mb-3">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="customerNotified">
                                <label class="form-check-label" for="customerNotified">
                                    Customer has been notified
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-success" onclick="bayManagement.confirmCompleteJob('${bay.id}')">
                            <i class="fas fa-check me-2"></i>Complete Job
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Use safe modal showing to prevent conflicts
        Utils.showModalSafely(modal);

        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    confirmCompleteJob(bayId) {
        const bay = this.bays.find(b => b.id === bayId);
        if (!bay || !bay.currentJob) return;

        const completionNotes = document.getElementById('completionNotes').value;
        const customerNotified = document.getElementById('customerNotified').checked;

        // Move job to completed
        const completedJob = {
            ...bay.currentJob,
            status: 'completed',
            completedAt: new Date(),
            bayId: bay.id,
            completionNotes: completionNotes,
            customerNotified: customerNotified,
            totalDuration: this.getElapsedTime(bay.currentJob.startTime),
            completedBy: 'Current User' // In real app, this would be the logged-in user
        };

        // Stop time tracking
        if (bay.timeTrackingInterval) {
            clearInterval(bay.timeTrackingInterval);
            delete bay.timeTrackingInterval;
        }

        // Clear bay
        bay.status = 'available';
        bay.currentJob = null;

        // Save completed job to history
        let completedJobs = Utils.loadFromStorage('completedJobs', []);
        completedJobs.push(completedJob);
        Utils.saveToStorage('completedJobs', completedJobs);

        // Update employee statuses if they were assigned to this job
        if (window.employeeManagement && completedJob.assignedEmployees) {
            completedJob.assignedEmployees.forEach(empId => {
                const employee = window.employeeManagement.employees.find(e => e.id === empId);
                if (employee && employee.currentJob === completedJob.id) {
                    employee.status = 'available';
                    delete employee.currentJob;
                }
            });
            Utils.saveToStorage('employees', window.employeeManagement.employees);
        }

        this.saveData();
        this.renderBays();
        this.updateStatusCards();

        // Close all modals
        const modals = document.querySelectorAll('.modal.show');
        modals.forEach(modal => {
            const bsModal = bootstrap.Modal.getInstance(modal);
            if (bsModal) {
                bsModal.hide();
            }
        });

        // Remove completion modal from DOM after a delay
        setTimeout(() => {
            const completionModals = document.querySelectorAll('.modal[data-modal-type="completion"]');
            completionModals.forEach(modal => modal.remove());
        }, 500);

        Utils.showToast(`Job completed in ${bay.id} - ${completedJob.vehicle}`, 'success');
    }

    showHeldJobs() {
        const heldJobs = Utils.loadFromStorage('heldJobs', []);

        if (heldJobs.length === 0) {
            Utils.showToast('No jobs are currently on hold', 'info');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-pause me-2"></i>Held Jobs (${heldJobs.length})
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Vehicle</th>
                                        <th>Customer</th>
                                        <th>Service</th>
                                        <th>Held Since</th>
                                        <th>Reason</th>
                                        <th>Expected Resume</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${heldJobs.map(job => `
                                        <tr>
                                            <td><strong>${job.vehicle}</strong></td>
                                            <td>${job.customer}</td>
                                            <td>${job.service}</td>
                                            <td>${Utils.formatDate(new Date(job.heldAt))}</td>
                                            <td>
                                                <span class="badge bg-warning">${job.heldReason.replace('-', ' ')}</span>
                                                ${job.heldNotes ? `<br><small class="text-muted">${job.heldNotes}</small>` : ''}
                                            </td>
                                            <td>${job.expectedResumeDate ? Utils.formatDate(new Date(job.expectedResumeDate)) : 'Not set'}</td>
                                            <td>
                                                <div class="btn-group btn-group-sm">
                                                    <button class="btn btn-outline-success" onclick="bayManagement.resumeHeldJob('${job.id}')" title="Resume job">
                                                        <i class="fas fa-play"></i>
                                                    </button>
                                                    <button class="btn btn-outline-info" onclick="bayManagement.editHeldJob('${job.id}')" title="Edit hold details">
                                                        <i class="fas fa-edit"></i>
                                                    </button>
                                                    <button class="btn btn-outline-danger" onclick="bayManagement.cancelHeldJob('${job.id}')" title="Cancel job">
                                                        <i class="fas fa-times"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    resumeHeldJob(jobId) {
        const heldJobs = Utils.loadFromStorage('heldJobs', []);
        const jobIndex = heldJobs.findIndex(j => j.id === jobId);

        if (jobIndex === -1) {
            Utils.showToast('Held job not found', 'error');
            return;
        }

        const job = heldJobs[jobIndex];

        // Show bay selection for resuming the job
        const availableBays = this.bays.filter(bay => bay.status === 'available');

        if (availableBays.length === 0) {
            Utils.showToast('No available bays to resume the job', 'warning');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-play me-2"></i>Resume Job - ${job.vehicle}
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-info">
                            <i class="fas fa-info-circle me-2"></i>
                            Select a bay to resume this job.
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Select Bay</label>
                            <select class="form-select" id="resumeBaySelect" required>
                                <option value="">Choose a bay...</option>
                                ${availableBays.map(bay => `
                                    <option value="${bay.id}">${bay.id} - ${bay.type} (${bay.capacity} tons)</option>
                                `).join('')}
                            </select>
                        </div>
                        <div class="job-details">
                            <h6>Job Details:</h6>
                            <div class="row">
                                <div class="col-6"><strong>Vehicle:</strong></div>
                                <div class="col-6">${job.vehicle}</div>
                            </div>
                            <div class="row">
                                <div class="col-6"><strong>Customer:</strong></div>
                                <div class="col-6">${job.customer}</div>
                            </div>
                            <div class="row">
                                <div class="col-6"><strong>Service:</strong></div>
                                <div class="col-6">${job.service}</div>
                            </div>
                            <div class="row">
                                <div class="col-6"><strong>Hold Reason:</strong></div>
                                <div class="col-6">${job.heldReason.replace('-', ' ')}</div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-success" onclick="bayManagement.confirmResumeJob('${jobId}')">
                            <i class="fas fa-play me-2"></i>Resume Job
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
               const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    confirmResumeJob(jobId) {
        const bayId = document.getElementById('resumeBaySelect').value;

        if (!bayId) {
            Utils.showToast('Please select a bay', 'error');
            return;
        }

        const heldJobs = Utils.loadFromStorage('heldJobs', []);
        const jobIndex = heldJobs.findIndex(j => j.id === jobId);
        const job = heldJobs[jobIndex];
        const bay = this.bays.find(b => b.id === bayId);

        if (!job || !bay) {
            Utils.showToast('Job or bay not found', 'error');
            return;
        }

        // Remove from held jobs
        heldJobs.splice(jobIndex, 1);
        Utils.saveToStorage('heldJobs', heldJobs);

        // Assign to bay
        bay.status = 'occupied';
        bay.currentJob = {
            ...job,
            status: 'in-progress',
            resumedAt: new Date(),
            resumedFromHold: true
        };

        // Remove hold-specific properties
        delete bay.currentJob.heldAt;
        delete bay.currentJob.heldReason;
        delete bay.currentJob.heldNotes;
        delete bay.currentJob.expectedResumeDate;
        delete bay.currentJob.originalBayId;
        delete bay.currentJob.heldBy;

        this.saveData();
        this.renderBays();
        this.updateStatusCards();

        // Start time tracking
        this.startTimeTracking(bay);

        // Close modals
        const modals = document.querySelectorAll('.modal.show');
        modals.forEach(modal => {
            bootstrap.Modal.getInstance(modal).hide();
        });

        Utils.showToast(`Job resumed in ${bay.id} - ${job.vehicle}`, 'success');
    }

    cancelHeldJob(jobId) {
        const heldJobs = Utils.loadFromStorage('heldJobs', []);
        const jobIndex = heldJobs.findIndex(j => j.id === jobId);

        if (jobIndex === -1) {
            Utils.showToast('Held job not found', 'error');
            return;
        }

        const job = heldJobs[jobIndex];

        if (confirm(`Are you sure you want to cancel the job for ${job.vehicle}? This action cannot be undone.`)) {
            // Remove from held jobs
            heldJobs.splice(jobIndex, 1);
            Utils.saveToStorage('heldJobs', heldJobs);

            // Add to cancelled jobs history
            let cancelledJobs = Utils.loadFromStorage('cancelledJobs', []);
            cancelledJobs.push({
                ...job,
                status: 'cancelled',
                cancelledAt: new Date(),
                cancelledBy: 'Current User'
            });
            Utils.saveToStorage('cancelledJobs', cancelledJobs);

            Utils.showToast(`Job cancelled - ${job.vehicle}`, 'info');

            // Refresh the held jobs modal
            const modal = document.querySelector('.modal.show');
            if (modal) {
                bootstrap.Modal.getInstance(modal).hide();
                setTimeout(() => this.showHeldJobs(), 300);
            }
        }
    }

    handleBayDragStart(e, bay) {
        this.draggedBay = bay;
        e.target.classList.add('dragging');

        // Check if bay can be deleted
        if (bay.status === 'available') {
            e.target.classList.add('drag-delete');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', bay.id);
        } else {
            e.dataTransfer.effectAllowed = 'none';
            Utils.showToast('Cannot delete bay - currently in use', 'warning');
        }
    }

    handleBayDragEnd() {
        document.querySelectorAll('.bay-item.dragging, .bay-item.drag-delete').forEach(el => {
            el.classList.remove('dragging', 'drag-delete');
        });

        // Clean up any drag states
        const trashBin = document.getElementById('trashBin');
        if (trashBin) {
            trashBin.classList.remove('drag-over');
        }

        const bayLayout = document.getElementById('bayLayout');
        if (bayLayout) {
            bayLayout.classList.remove('delete-mode');
        }

        this.draggedBay = null;
    }

    handleBayDelete(e) {
        if (!this.draggedBay) return;

        const bay = this.draggedBay;

        // Safety check - only delete available bays
        if (bay.status !== 'available') {
            Utils.showToast('Cannot delete bay - currently in use', 'error');
            return;
        }

        // Show confirmation with animation
        this.showDeleteConfirmation(bay);
    }

    showDeleteConfirmation(bay) {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content border-danger">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title">
                            <i class="fas fa-trash-alt me-2"></i>Delete Bay Confirmation
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="text-center mb-3">
                            <div class="trash-animation">
                                <i class="fas fa-trash-alt fa-3x text-danger"></i>
                            </div>
                        </div>
                        <div class="alert alert-warning">
                            <i class="fas fa-exclamation-triangle me-2"></i>
                            <strong>Warning:</strong> This action cannot be undone.
                        </div>
                        <p class="text-center">Are you sure you want to permanently delete <strong>${bay.id}</strong>?</p>
                        <div class="bay-info mt-3 p-3 bg-light rounded">
                            <div class="row">
                                <div class="col-6"><strong>Type:</strong></div>
                                <div class="col-6">${bay.type}</div>
                            </div>
                            <div class="row">
                                <div class="col-6"><strong>Capacity:</strong></div>
                                <div class="col-6">${bay.capacity} tons</div>
                            </div>
                            <div class="row">
                                <div class="col-6"><strong>Equipment:</strong></div>
                                <div class="col-6">${bay.equipment.join(', ')}</div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            <i class="fas fa-times me-2"></i>Cancel
                        </button>
                        <button type="button" class="btn btn-danger" onclick="bayManagement.confirmBayDeletion('${bay.id}')">
                            <i class="fas fa-trash-alt me-2"></i>Delete Bay
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    confirmBayDeletion(bayId) {
        const bayIndex = this.bays.findIndex(b => b.id === bayId);
        if (bayIndex === -1) return;

        const bay = this.bays[bayIndex];

        // Remove bay from array
        this.bays.splice(bayIndex, 1);

        // Remove any bookings for this bay
        let bookings = Utils.loadFromStorage('bookings', []);
        bookings = bookings.filter(booking => booking.bayId !== bayId);
        Utils.saveToStorage('bookings', bookings);

        this.saveData();
        this.renderBays();
        this.updateStatusCards();

        // Hide modal
        const modal = document.querySelector('.modal.show');
        if (modal) {
            bootstrap.Modal.getInstance(modal).hide();
        }

        Utils.showToast(`${bayId} deleted successfully! 🗑️`, 'success');

        // Add some visual feedback
        this.animateTrashBin();
    }

    animateTrashBin() {
        const trashBin = document.getElementById('trashBin');
        if (trashBin) {
            trashBin.style.animation = 'trashOpen 0.5s ease-in-out';
            setTimeout(() => {
                trashBin.style.animation = '';
            }, 500);
        }
    }

    showNextView() {
        // Implement view switching logic
        Utils.showToast('Swipe left detected', 'info');
    }

    showPreviousView() {
        // Implement view switching logic
        Utils.showToast('Swipe right detected', 'info');
    }

    showJobQueue() {
        const sidebar = document.querySelector('.col-lg-3');
        if (sidebar) {
            sidebar.scrollIntoView({ behavior: 'smooth' });
        }
    }

    hideJobQueue() {
        const mainContent = document.querySelector('.col-lg-9');
        if (mainContent) {
            mainContent.scrollIntoView({ behavior: 'smooth' });
        }
    }

    showBlockBayDialog() {
        if (!this.selectedBay) {
            Utils.showToast('Please select a bay first', 'warning');
            return;
        }

        this.toggleBayBlock(this.selectedBay);
    }

    showSchedule() {
        const modal = new bootstrap.Modal(document.getElementById('bookingModal'));
        modal.show();
    }

    showJobDetails(job) {
        this.showJobModal(job);
    }

    updateJobOrder() {
        // Update job order based on DOM order
        const jobElements = document.querySelectorAll('.job-item');
        const newOrder = Array.from(jobElements).map(el => el.dataset.jobId);

        this.jobs.sort((a, b) => {
            const aIndex = newOrder.indexOf(a.id);
            const bIndex = newOrder.indexOf(b.id);
            return aIndex - bIndex;
        });

        this.saveData();
    }

    // Time tracking methods
    startTimeTracking(bay) {
        // Update time display every minute
        if (bay.timeTrackingInterval) {
            clearInterval(bay.timeTrackingInterval);
        }

        bay.timeTrackingInterval = setInterval(() => {
            if (bay.status === 'occupied' && bay.currentJob) {
                this.updateBayTimeDisplay(bay);
            } else {
                clearInterval(bay.timeTrackingInterval);
                delete bay.timeTrackingInterval;
            }
        }, 60000); // Update every minute
    }

    updateBayTimeDisplay(bay) {
        const bayElement = document.querySelector(`[data-bay-id="${bay.id}"]`);
        if (bayElement && bay.currentJob && bay.currentJob.startTime) {
            const elapsedTime = this.getElapsedTime(bay.currentJob.startTime);

            // Update different time display elements based on layout
            const timeElement = bayElement.querySelector('.bay-time') ||
                               bayElement.querySelector('.bay-time-flow') ||
                               bayElement.querySelector('.bay-time-modern');

            if (timeElement) {
                timeElement.textContent = elapsedTime;
            }

            // Update list view time display
            const jobElement = bayElement.querySelector('.flow-list-bay-job');
            if (jobElement && bay.currentJob) {
                jobElement.textContent = `${bay.currentJob.vehicle} (${elapsedTime})`;
            }

            // Update compact view tooltip
            if (bayElement.classList.contains('flow-compact-bay-item')) {
                const tooltipText = `${bay.id} - ${bay.status} - ${bay.capacity}T - ${bay.equipment[0]} - ${bay.currentJob.vehicle} - ${elapsedTime}`;
                bayElement.title = tooltipText;
            }
        }
    }

    getElapsedTime(startTime) {
        const now = new Date();
        const elapsed = now - new Date(startTime);
        const hours = Math.floor(elapsed / (1000 * 60 * 60));
        const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else {
            return `${minutes}m`;
        }
    }

    // Layout management methods
    resetLayout() {
        if (confirm('This will reset the entire bay layout. Are you sure?')) {
            this.bays = [];
            localStorage.removeItem('bayManagementData');
            this.generateBays();
            Utils.showToast('Bay layout has been reset', 'success');
        }
    }

    addNewBay() {
        const newBayId = `BAY-${(this.bays.length + 1).toString().padStart(2, '0')}`;

        // Find the best zone to add the new bay (general service zone)
        const generalBays = this.bays.filter(b => b.type === 'general');
        const generalZoneStart = { x: 50, y: 580 };
        const spacing = { x: 140, y: 120 };
        const cols = 6;

        const newPosition = {
            x: generalZoneStart.x + (generalBays.length % cols) * spacing.x,
            y: generalZoneStart.y + Math.floor(generalBays.length / cols) * spacing.y
        };

        const newBay = {
            id: newBayId,
            type: 'general',
            status: 'available',
            position: newPosition,
            equipment: ['2-Post Lift', 'Basic Tools', 'Air Compressor'],
            capacity: 8,
            currentJob: null,
            tags: ['general', 'zone-general'],
            zone: 'general',
            zoneColor: '#6c757d'
        };

        this.bays.push(newBay);
        this.saveData();
        this.renderBays();
        this.updateStatusCards();

        Utils.showToast(`${newBayId} added to General Service zone`, 'success');
    }

    confirmDeleteBay(bay) {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title text-danger">
                            <i class="fas fa-exclamation-triangle me-2"></i>Delete Bay
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-warning">
                            <i class="fas fa-exclamation-triangle me-2"></i>
                            <strong>Warning:</strong> This action cannot be undone.
                        </div>
                        <p>Are you sure you want to permanently delete <strong>${bay.id}</strong>?</p>
                        <div class="bay-info mt-3">
                            <div class="row">
                                <div class="col-6"><strong>Type:</strong></div>
                                <div class="col-6">${bay.type}</div>
                            </div>
                            <div class="row">
                                <div class="col-6"><strong>Capacity:</strong></div>
                                <div class="col-6">${bay.capacity} tons</div>
                            </div>
                            <div class="row">
                                <div class="col-6"><strong>Equipment:</strong></div>
                                <div class="col-6">${bay.equipment.join(', ')}</div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-danger" onclick="bayManagement.deleteBay('${bay.id}')">
                            <i class="fas fa-trash me-2"></i>Delete Bay
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    deleteBay(bayId) {
        const bayIndex = this.bays.findIndex(b => b.id === bayId);
        if (bayIndex === -1) return;

        const bay = this.bays[bayIndex];
        if (bay.status === 'occupied') {
            Utils.showToast('Cannot delete bay - currently occupied', 'error');
            return;
        }

        // Remove bay from array
        this.bays.splice(bayIndex, 1);

        // Remove any bookings for this bay
        let bookings = Utils.loadFromStorage('bookings', []);
        bookings = bookings.filter(booking => booking.bayId !== bayId);
        Utils.saveToStorage('bookings', bookings);

        this.saveData();
        this.renderBays();
        this.updateStatusCards();

        // Hide modal
        const modal = document.querySelector('.modal.show');
        if (modal) {
            bootstrap.Modal.getInstance(modal).hide();
        }

        Utils.showToast(`${bayId} deleted successfully`, 'success');
    }

    removeBay(bayId) {
        // This method is kept for backward compatibility
        this.confirmDeleteBay(this.bays.find(b => b.id === bayId));
    }

    // Enhanced bay details with blocking info
    showBayDetails(bay) {
        let blockingInfo = '';
        if (bay.status === 'blocked' && bay.blockInfo) {
            const blockedSince = Utils.formatDate(new Date(bay.blockInfo.blockedAt));
            const unblockTime = bay.blockInfo.unblockAt ?
                Utils.formatDate(new Date(bay.blockInfo.unblockAt)) : 'Indefinite';

            blockingInfo = `
                <hr>
                <h6>Blocking Information</h6>
                <div class="row">
                    <div class="col-6"><strong>Reason:</strong></div>
                    <div class="col-6">${bay.blockInfo.reason}</div>
                </div>
                <div class="row mt-2">
                    <div class="col-6"><strong>Blocked Since:</strong></div>
                    <div class="col-6">${blockedSince}</div>
                </div>
                <div class="row mt-2">
                    <div class="col-6"><strong>Unblock Time:</strong></div>
                    <div class="col-6">${unblockTime}</div>
                </div>
                ${bay.blockInfo.notes ? `
                    <div class="row mt-2">
                        <div class="col-6"><strong>Notes:</strong></div>
                        <div class="col-6">${bay.blockInfo.notes}</div>
                    </div>
                ` : ''}
            `;
        }

        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-info-circle me-2"></i>${bay.id} Details
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-6"><strong>Type:</strong></div>
                            <div class="col-6">${bay.type}</div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-6"><strong>Status:</strong></div>
                            <div class="col-6">
                                <span class="status-indicator ${bay.status}"></span>
                                ${bay.status.charAt(0).toUpperCase() + bay.status.slice(1)}
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-6"><strong>Capacity:</strong></div>
                            <div class="col-6">${bay.capacity} tons</div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-6"><strong>Equipment:</strong></div>
                            <div class="col-6">${bay.equipment.join(', ')}</div>
                        </div>
                        ${bay.currentJob ? `
                            <hr>
                            <h6>Current Job</h6>
                            <div class="row">
                                <div class="col-6"><strong>Vehicle:</strong></div>
                                <div class="col-6">${bay.currentJob.vehicle}</div>
                            </div>
                            <div class="row mt-2">
                                <div class="col-6"><strong>Customer:</strong></div>
                                <div class="col-6">${bay.currentJob.customer}</div>
                            </div>
                            <div class="row mt-2">
                                <div class="col-6"><strong>Started:</strong></div>
                                <div class="col-6">${Utils.formatDate(new Date(bay.currentJob.startTime))}</div>
                            </div>
                            <div class="row mt-2">
                                <div class="col-6"><strong>Elapsed:</strong></div>
                                <div class="col-6">${this.getElapsedTime(bay.currentJob.startTime)}</div>
                            </div>
                            <div class="row mt-2">
                                <div class="col-6"><strong>Progress:</strong></div>
                                <div class="col-6">
                                    <div class="progress">
                                        <div class="progress-bar" style="width: ${bay.currentJob.progress}%">
                                            ${bay.currentJob.progress}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ` : ''}
                        ${blockingInfo}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        ${bay.currentJob ? `
                            <button type="button" class="btn btn-warning" onclick="bayManagement.holdJob('${bay.id}')" title="Put job on hold">
                                <i class="fas fa-pause me-2"></i>Hold Job
                            </button>
                            <button type="button" class="btn btn-success" onclick="bayManagement.completeJobFromModal('${bay.id}')" title="Mark job as complete">
                                <i class="fas fa-check me-2"></i>Complete Job
                            </button>
                        ` : ''}
                        ${bay.status === 'available' ? `
                            <button type="button" class="btn btn-danger" onclick="bayManagement.removeBay('${bay.id}')">
                                Remove Bay
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    showBayManagement() {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-cogs me-2"></i>Bay Management
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row mb-4">
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-header">
                                        <h6 class="mb-0">Bay Statistics</h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="row text-center">
                                            <div class="col-6">
                                                <h4 class="text-primary">${this.bays.length}</h4>
                                                <small>Total Bays</small>
                                            </div>
                                            <div class="col-6">
                                                <h4 class="text-success">${this.bays.filter(b => b.status === 'available').length}</h4>
                                                <small>Available</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-header">
                                        <h6 class="mb-0">Quick Actions</h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="d-grid gap-2">
                                            <button class="btn btn-success btn-sm" onclick="bayManagement.addNewBay()">
                                                <i class="fas fa-plus me-2"></i>Add New Bay
                                            </button>
                                            <button class="btn btn-warning btn-sm" onclick="bayManagement.resetAllBays()">
                                                <i class="fas fa-refresh me-2"></i>Reset All Bays
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header">
                                <h6 class="mb-0">Bay List</h6>
                            </div>
                            <div class="card-body p-0">
                                <div class="table-responsive" style="max-height: 400px;">
                                    <table class="table table-sm table-hover mb-0">
                                        <thead class="table-light sticky-top">
                                            <tr>
                                                <th>Bay ID</th>
                                                <th>Type</th>
                                                <th>Status</th>
                                                <th>Capacity</th>
                                                <th>Equipment</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${this.renderBayManagementList()}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    renderBayManagementList() {
        return this.bays.map(bay => {
            const statusClass = {
                'available': 'success',
                'occupied': 'warning',
                'maintenance': 'danger',
                'blocked': 'secondary'
            }[bay.status] || 'secondary';

            return `
                <tr>
                    <td><strong>${bay.id}</strong></td>
                    <td><span class="badge bg-info">${bay.type}</span></td>
                    <td><span class="badge bg-${statusClass}">${bay.status}</span></td>
                    <td>${bay.capacity} tons</td>
                    <td><small>${bay.equipment.slice(0, 2).join(', ')}${bay.equipment.length > 2 ? '...' : ''}</small></td>
                    <td>
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-primary btn-sm" onclick="bayManagement.showBayConfiguration(bayManagement.bays.find(b => b.id === '${bay.id}'))" title="Configure">
                                <i class="fas fa-cog"></i>
                            </button>
                            ${bay.status === 'available' ? `
                                <button class="btn btn-outline-danger btn-sm" onclick="bayManagement.confirmDeleteBay(bayManagement.bays.find(b => b.id === '${bay.id}'))" title="Delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            ` : ''}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    resetAllBays() {
        if (confirm('Are you sure you want to reset all bays? This will:\n\n• Delete all existing bays\n• Clear all jobs and bookings\n• Generate 32 new default bays\n\nThis action cannot be undone!')) {
            // Clear all data
            this.bays = [];
            this.jobs = [];
            localStorage.removeItem('bays');
            localStorage.removeItem('jobs');
            localStorage.removeItem('bookings');
            localStorage.removeItem('completedJobs');

            // Regenerate bays
            this.generateBays();
            this.generateSampleJobs();
            this.updateStatusCards();

            // Close management modal
            const modal = document.querySelector('.modal.show');
            if (modal) {
                bootstrap.Modal.getInstance(modal).hide();
            }

            Utils.showToast('All bays have been reset to default layout', 'success');
        }
    }

    showReassignJobDialog(currentBay) {
        if (!currentBay.currentJob) {
            Utils.showToast('No job to reassign', 'warning');
            return;
        }

        const availableBays = this.bays.filter(bay =>
            bay.status === 'available' && bay.id !== currentBay.id
        );

        if (availableBays.length === 0) {
            Utils.showToast('No available bays for reassignment', 'warning');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-exchange-alt me-2"></i>Reassign Job
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-info">
                            <i class="fas fa-info-circle me-2"></i>
                            Moving job from <strong>${currentBay.id}</strong> to a different bay
                        </div>

                        <div class="current-job-info mb-4">
                            <h6>Current Job Details:</h6>
                            <div class="card bg-light">
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-6"><strong>Vehicle:</strong></div>
                                        <div class="col-6">${currentBay.currentJob.vehicle}</div>
                                    </div>
                                    <div class="row">
                                        <div class="col-6"><strong>Customer:</strong></div>
                                        <div class="col-6">${currentBay.currentJob.customer}</div>
                                    </div>
                                    <div class="row">
                                        <div class="col-6"><strong>Service:</strong></div>
                                        <div class="col-6">${currentBay.currentJob.service}</div>
                                    </div>
                                    <div class="row">
                                        <div class="col-6"><strong>Progress:</strong></div>
                                        <div class="col-6">
                                            <div class="progress">
                                                <div class="progress-bar" style="width: ${currentBay.currentJob.progress}%">
                                                    ${currentBay.currentJob.progress}%
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="reassign-options">
                            <h6>Select New Bay:</h6>
                            <div class="bay-selection">
                                ${availableBays.map(bay => `
                                    <div class="bay-option" data-bay-id="${bay.id}">
                                        <div class="bay-option-header">
                                            <input type="radio" name="newBay" value="${bay.id}" id="bay_${bay.id}">
                                            <label for="bay_${bay.id}" class="bay-option-label">
                                                <strong>${bay.id}</strong>
                                                <span class="badge bg-info ms-2">${bay.type}</span>
                                            </label>
                                        </div>
                                        <div class="bay-option-details">
                                            <small class="text-muted">
                                                Capacity: ${bay.capacity} tons •
                                                Equipment: ${bay.equipment.slice(0, 2).join(', ')}
                                            </small>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="bayManagement.executeJobReassignment('${currentBay.id}')">
                            <i class="fas fa-exchange-alt me-2"></i>Reassign Job
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    executeJobReassignment(currentBayId) {
        const selectedBayId = document.querySelector('input[name="newBay"]:checked')?.value;

        if (!selectedBayId) {
            Utils.showToast('Please select a bay for reassignment', 'warning');
            return;
        }

        const currentBay = this.bays.find(b => b.id === currentBayId);
        const newBay = this.bays.find(b => b.id === selectedBayId);

        if (!currentBay || !newBay || !currentBay.currentJob) {
            Utils.showToast('Error: Invalid bay selection', 'error');
            return;
        }

        if (newBay.status !== 'available') {
            Utils.showToast('Selected bay is no longer available', 'error');
            return;
        }

        // Transfer the job
        const job = currentBay.currentJob;

        // Update new bay
        newBay.status = 'occupied';
        newBay.currentJob = { ...job };

        // Clear current bay
        currentBay.status = 'available';
        currentBay.currentJob = null;

        // Clear time tracking interval if exists
        if (currentBay.timeTrackingInterval) {
            clearInterval(currentBay.timeTrackingInterval);
            delete currentBay.timeTrackingInterval;
        }

        // Start time tracking for new bay
        this.startTimeTracking(newBay);

        this.saveData();
        this.renderBays();
        this.updateStatusCards();

        // Hide modal
        const modal = document.querySelector('.modal.show');
        if (modal) {
            bootstrap.Modal.getInstance(modal).hide();
        }

        Utils.showToast(`Job reassigned from ${currentBayId} to ${selectedBayId}`, 'success');
    }

    getRequiredSkills(serviceType) {
        const skillMap = {
            'Oil Change': ['Basic Maintenance'],
            'Brake Repair': ['Brake Systems'],
            'Tire Rotation': ['Tire Service'],
            'Engine Diagnostic': ['Diagnostics', 'Engine Repair'],
            'AC Service': ['AC/Heating'],
            'Transmission': ['Transmission'],
            'Electrical': ['Electrical Systems'],
            'Alignment': ['Alignment'],
            'Inspection': ['General Service'],
            'Maintenance': ['Basic Maintenance'],
            'Repair': ['General Repair']
        };

        return skillMap[serviceType] || ['General Service'];
    }

    showBayContextMenu(e, bay) {
        e.preventDefault();
        e.stopPropagation();

        // Remove any existing context menu
        const existingMenu = document.querySelector('.bay-context-menu');
        if (existingMenu) {
            existingMenu.remove();
        }

        // Create context menu
        const contextMenu = document.createElement('div');
        contextMenu.className = 'bay-context-menu';
        contextMenu.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            z-index: 10000;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            min-width: 280px;
            max-width: 380px;
            max-height: 80vh;
            overflow-y: auto;
            visibility: hidden;
        `;

        // Get assigned employees for this bay
        const assignedEmployees = this.getAssignedEmployees(bay);

        contextMenu.innerHTML = `
            <div class="context-menu-header">
                <h6 class="mb-1"><i class="fas fa-car-garage me-2"></i>Bay ${bay.id}</h6>
                <small class="text-muted">${bay.type} - ${bay.capacity}T Capacity</small>
            </div>

            ${bay.currentJob ? `
                <div class="context-menu-section">
                    <div class="job-details">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <strong class="text-primary">${bay.currentJob.vehicle}</strong>
                            <span class="badge bg-info">${this.getElapsedTime(bay.currentJob.startTime)}</span>
                        </div>
                        <div class="mb-2">
                            <small class="text-muted">Customer:</small> ${bay.currentJob.customer}<br>
                            <small class="text-muted">Service:</small> ${bay.currentJob.service}<br>
                            <small class="text-muted">Priority:</small>
                            <span class="badge bg-${bay.currentJob.priority === 'high' ? 'danger' : bay.currentJob.priority === 'medium' ? 'warning' : 'secondary'}">${bay.currentJob.priority}</span>
                        </div>

                        <!-- Progress with Checkpoints -->
                        <div class="progress-section mb-3">
                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <small class="text-muted">Progress</small>
                                <small class="text-muted">${bay.currentJob.progress || 0}%</small>
                            </div>
                            <div class="progress mb-2" style="height: 8px;">
                                <div class="progress-bar bg-success" style="width: ${bay.currentJob.progress || 0}%"></div>
                            </div>
                            <div class="checkpoints">
                                ${this.generateCheckpoints(bay.currentJob).map(checkpoint => `
                                    <div class="checkpoint ${checkpoint.completed ? 'completed' : ''}" data-checkpoint="${checkpoint.id}">
                                        <i class="fas fa-${checkpoint.completed ? 'check-circle text-success' : 'circle text-muted'}"></i>
                                        <span class="ms-1">${checkpoint.name}</span>
                                        ${checkpoint.completed ? `<small class="text-muted ms-2">${checkpoint.completedAt}</small>` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Assigned Employees -->
                        <div class="employees-section mb-3">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <small class="text-muted">Assigned Employees</small>
                                <button class="btn btn-sm btn-outline-primary" onclick="bayManagement.manageEmployeeAssignment('${bay.id}')">
                                    <i class="fas fa-user-plus"></i>
                                </button>
                            </div>
                            <div class="employee-list">
                                ${assignedEmployees.length > 0 ? assignedEmployees.map(emp => `
                                    <div class="employee-item">
                                        <div class="d-flex align-items-center">
                                            <div class="employee-avatar me-2">
                                                <i class="fas fa-user-circle text-primary"></i>
                                            </div>
                                            <div class="flex-grow-1">
                                                <div class="employee-name">${emp.name}</div>
                                                <small class="text-muted">${emp.role}</small>
                                            </div>
                                            <div class="employee-status">
                                                <span class="badge bg-${emp.status === 'busy' ? 'warning' : 'success'}">${emp.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                `).join('') : '<small class="text-muted">No employees assigned</small>'}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="context-menu-actions">
                    <button class="btn btn-sm btn-outline-primary w-100 mb-2" onclick="bayManagement.updateJobProgress('${bay.id}')">
                        <i class="fas fa-tasks me-2"></i>Update Progress
                    </button>
                    <button class="btn btn-sm btn-outline-warning w-100 mb-2" onclick="bayManagement.showJobTransferModal('${bay.id}')">
                        <i class="fas fa-exchange-alt me-2"></i>Move to Another Bay
                    </button>
                    <button class="btn btn-sm btn-outline-info w-100 mb-2" onclick="bayManagement.showJobDetails(bayManagement.bays.find(b => b.id === '${bay.id}').currentJob)">
                        <i class="fas fa-info-circle me-2"></i>View Full Details
                    </button>
                    <div class="btn-group w-100">
                        <button class="btn btn-sm btn-outline-secondary" onclick="bayManagement.holdJob(bayManagement.bays.find(b => b.id === '${bay.id}'))">
                            <i class="fas fa-pause me-1"></i>Hold
                        </button>
                        <button class="btn btn-sm btn-outline-success" onclick="bayManagement.completeJobFromContextMenu('${bay.id}')">
                            <i class="fas fa-check me-1"></i>Complete
                        </button>
                    </div>
                </div>
            ` : `
                <div class="context-menu-section">
                    <div class="text-center py-3">
                        <i class="fas fa-car-garage text-muted mb-2" style="font-size: 2rem;"></i>
                        <p class="text-muted mb-0">Bay Available</p>
                        <small class="text-muted">Equipment: ${bay.equipment.join(', ')}</small>
                    </div>
                </div>

                <div class="context-menu-actions">
                    <button class="btn btn-sm btn-outline-primary w-100 mb-2" onclick="bayManagement.showJobModal('${bay.id}')">
                        <i class="fas fa-plus me-2"></i>Assign New Job
                    </button>
                    <button class="btn btn-sm btn-outline-secondary w-100 mb-2" onclick="bayManagement.showBayConfiguration(bayManagement.bays.find(b => b.id === '${bay.id}'))">
                        <i class="fas fa-cog me-2"></i>Bay Settings
                    </button>
                    <button class="btn btn-sm btn-outline-warning w-100" onclick="bayManagement.toggleBayMaintenance('${bay.id}')">
                        <i class="fas fa-wrench me-2"></i>Set Maintenance
                    </button>
                </div>
            `}
        `;

        document.body.appendChild(contextMenu);

        // Smart positioning to keep menu within viewport
        this.positionContextMenu(contextMenu, e.clientX, e.clientY);

        // Close menu when clicking outside
        const closeMenu = (event) => {
            if (!contextMenu.contains(event.target)) {
                contextMenu.remove();
                document.removeEventListener('click', closeMenu);
                document.removeEventListener('contextmenu', closeMenu);
            }
        };

        setTimeout(() => {
            document.addEventListener('click', closeMenu);
            document.addEventListener('contextmenu', closeMenu);
        }, 100);
    }

    getAssignedEmployees(bay) {
        if (!bay.currentJob || !window.employeeManagement) return [];

        const employees = window.employeeManagement.employees || [];
        return employees.filter(emp => emp.currentJob === bay.currentJob.id);
    }

    generateCheckpoints(job) {
        const serviceCheckpoints = {
            'Oil Change': [
                { id: 'drain', name: 'Drain old oil', completed: job.progress >= 25 },
                { id: 'filter', name: 'Replace filter', completed: job.progress >= 50 },
                { id: 'refill', name: 'Add new oil', completed: job.progress >= 75 },
                { id: 'check', name: 'Final inspection', completed: job.progress >= 100 }
            ],
            'Brake Service': [
                { id: 'inspect', name: 'Inspect brake system', completed: job.progress >= 20 },
                { id: 'pads', name: 'Replace brake pads', completed: job.progress >= 50 },
                { id: 'fluid', name: 'Check brake fluid', completed: job.progress >= 75 },
                { id: 'test', name: 'Test brakes', completed: job.progress >= 100 }
            ],
            'Tire Rotation': [
                { id: 'remove', name: 'Remove wheels', completed: job.progress >= 30 },
                { id: 'rotate', name: 'Rotate tires', completed: job.progress >= 70 },
                { id: 'balance', name: 'Balance & mount', completed: job.progress >= 100 }
            ],
            'Engine Diagnostic': [
                { id: 'scan', name: 'OBD scan', completed: job.progress >= 25 },
                { id: 'analyze', name: 'Analyze codes', completed: job.progress >= 50 },
                { id: 'test', name: 'Component testing', completed: job.progress >= 75 },
                { id: 'report', name: 'Generate report', completed: job.progress >= 100 }
            ]
        };

        const checkpoints = serviceCheckpoints[job.service] || [
            { id: 'start', name: 'Service started', completed: job.progress >= 25 },
            { id: 'progress', name: 'Work in progress', completed: job.progress >= 50 },
            { id: 'review', name: 'Quality check', completed: job.progress >= 75 },
            { id: 'complete', name: 'Service complete', completed: job.progress >= 100 }
        ];

        // Add completion timestamps for completed checkpoints
        return checkpoints.map(checkpoint => {
            if (checkpoint.completed && !checkpoint.completedAt) {
                checkpoint.completedAt = this.getCheckpointTime(job, checkpoint.id);
            }
            return checkpoint;
        });
    }

    getCheckpointTime(job, checkpointId) {
        // Simulate checkpoint completion times based on progress
        const startTime = new Date(job.startTime);
        const elapsed = Date.now() - startTime.getTime();
        const checkpointTime = new Date(startTime.getTime() + (elapsed * 0.8)); // Approximate time
        return checkpointTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    updateJobProgress(bayId) {
        const bay = this.bays.find(b => b.id === bayId);
        if (!bay || !bay.currentJob) return;

        // Close context menu
        const contextMenu = document.querySelector('.bay-context-menu');
        if (contextMenu) contextMenu.remove();

        // Show progress update modal
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Update Job Progress - ${bay.currentJob.vehicle}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Progress Percentage</label>
                            <input type="range" class="form-range" id="progressRange" min="0" max="100" value="${bay.currentJob.progress || 0}">
                            <div class="d-flex justify-content-between">
                                <small>0%</small>
                                <span id="progressValue">${bay.currentJob.progress || 0}%</span>
                                <small>100%</small>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Progress Notes</label>
                            <textarea class="form-control" id="progressNotes" rows="3" placeholder="Add notes about current progress..."></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="bayManagement.saveJobProgress('${bayId}')">Update Progress</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        // Update progress value display
        const progressRange = modal.querySelector('#progressRange');
        const progressValue = modal.querySelector('#progressValue');
        progressRange.addEventListener('input', (e) => {
            progressValue.textContent = e.target.value + '%';
        });

        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    saveJobProgress(bayId) {
        const bay = this.bays.find(b => b.id === bayId);
        if (!bay || !bay.currentJob) return;

        const progressRange = document.getElementById('progressRange');
        const progressNotes = document.getElementById('progressNotes');

        bay.currentJob.progress = parseInt(progressRange.value);
        bay.currentJob.progressNotes = progressNotes.value;
        bay.currentJob.lastUpdated = new Date();

        this.saveData();
        this.renderBays();
        this.updateStatusCards();

        // Close modal
        const modal = document.querySelector('.modal.show');
        if (modal) {
            bootstrap.Modal.getInstance(modal).hide();
        }

        Utils.showToast(`Progress updated to ${bay.currentJob.progress}%`, 'success');
    }

    showJobTransferModal(bayId) {
        const bay = this.bays.find(b => b.id === bayId);
        if (!bay || !bay.currentJob) return;

        // Close context menu
        const contextMenu = document.querySelector('.bay-context-menu');
        if (contextMenu) contextMenu.remove();

        // Show existing transfer modal using the correct method name
        this.showReassignJobDialog(bay);
    }

    manageEmployeeAssignment(bayId) {
        const bay = this.bays.find(b => b.id === bayId);
        if (!bay || !bay.currentJob) return;

        // Close context menu
        const contextMenu = document.querySelector('.bay-context-menu');
        if (contextMenu) contextMenu.remove();

        // Open employee management for this job
        if (window.employeeManagement) {
            window.employeeManagement.showJobAssignment(bay.currentJob.id);
        }
    }

    toggleBayMaintenance(bayId) {
        const bay = this.bays.find(b => b.id === bayId);
        if (!bay) return;

        // Close context menu
        const contextMenu = document.querySelector('.bay-context-menu');
        if (contextMenu) contextMenu.remove();

        if (bay.status === 'maintenance') {
            bay.status = 'available';
            Utils.showToast(`${bay.id} is now available`, 'success');
        } else {
            bay.status = 'maintenance';
            Utils.showToast(`${bay.id} set to maintenance mode`, 'warning');
        }

        this.saveData();
        this.renderBays();
        this.updateStatusCards();
    }

    positionContextMenu(menu, clickX, clickY) {
        // Make menu visible to get accurate measurements
        menu.style.visibility = 'visible';

        // Get viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const isMobile = viewportWidth <= 768;

        // Get menu dimensions
        const menuRect = menu.getBoundingClientRect();
        const menuWidth = menuRect.width;
        const menuHeight = menuRect.height;

        let finalX, finalY;

        if (isMobile) {
            // On mobile, center the menu
            finalX = (viewportWidth - menuWidth) / 2;
            finalY = (viewportHeight - menuHeight) / 2;

            // Ensure it doesn't go off screen
            finalX = Math.max(10, Math.min(finalX, viewportWidth - menuWidth - 10));
            finalY = Math.max(10, Math.min(finalY, viewportHeight - menuHeight - 10));
        } else {
            // Desktop positioning logic
            finalX = clickX;
            finalY = clickY;

            // Horizontal positioning
            if (clickX + menuWidth > viewportWidth - 20) {
                // Menu would go off right edge, position to the left of cursor
                finalX = clickX - menuWidth;

                // If still off screen, align with right edge
                if (finalX < 20) {
                    finalX = viewportWidth - menuWidth - 20;
                }
            }

            // Vertical positioning
            if (clickY + menuHeight > viewportHeight - 20) {
                // Menu would go off bottom edge, position above cursor
                finalY = clickY - menuHeight;

                // If still off screen, align with bottom edge
                if (finalY < 20) {
                    finalY = viewportHeight - menuHeight - 20;
                }
            }

            // Ensure minimum margins from edges
            finalX = Math.max(20, Math.min(finalX, viewportWidth - menuWidth - 20));
            finalY = Math.max(20, Math.min(finalY, viewportHeight - menuHeight - 20));
        }

        // Apply final position
        menu.style.left = finalX + 'px';
        menu.style.top = finalY + 'px';

        // Add entrance animation
        menu.style.opacity = '0';
        menu.style.transform = isMobile ? 'translate(-50%, -50%) scale(0.95)' : 'scale(0.95)';

        // Trigger animation
        requestAnimationFrame(() => {
            menu.style.transition = 'opacity 0.15s ease-out, transform 0.15s ease-out';
            menu.style.opacity = '1';
            menu.style.transform = isMobile ? 'translate(-50%, -50%) scale(1)' : 'scale(1)';
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.bayManagement = new BayManagement();
});
