// AfterMarket Pro - Modern Service Management System

// Sample Data
const workOrdersData = [
    {
        id: 'WO-2025-001',
        customer: 'John Smith',
        vehicle: '2020 Honda Civic',
        serviceType: 'Oil Change',
        status: 'completed',
        priority: 'low',
        assignedTo: 'Mike Johnson',
        dueDate: '2025-01-15',
        createdDate: '2025-01-10',
        description: 'Regular oil change and filter replacement'
    },
    {
        id: 'WO-2025-002',
        customer: 'Sarah Davis',
        vehicle: '2019 Toyota Camry',
        serviceType: 'Brake Repair',
        status: 'progress',
        priority: 'high',
        assignedTo: 'Tom Wilson',
        dueDate: '2025-01-16',
        createdDate: '2025-01-12',
        description: 'Front brake pads replacement and rotor resurfacing'
    },
    {
        id: 'WO-2025-003',
        customer: 'Robert Brown',
        vehicle: '2021 Ford F-150',
        serviceType: 'Transmission',
        status: 'pending',
        priority: 'urgent',
        assignedTo: 'Alex Chen',
        dueDate: '2025-01-17',
        createdDate: '2025-01-13',
        description: 'Transmission fluid leak diagnosis and repair'
    },
    {
        id: 'WO-2025-004',
        customer: 'Lisa Johnson',
        vehicle: '2018 BMW X3',
        serviceType: 'AC Repair',
        status: 'progress',
        priority: 'medium',
        assignedTo: 'Mike Johnson',
        dueDate: '2025-01-18',
        createdDate: '2025-01-14',
        description: 'Air conditioning system not cooling properly'
    },
    {
        id: 'WO-2025-005',
        customer: 'David Wilson',
        vehicle: '2022 Tesla Model 3',
        serviceType: 'Software Update',
        status: 'completed',
        priority: 'low',
        assignedTo: 'Emma Davis',
        dueDate: '2025-01-19',
        createdDate: '2025-01-15',
        description: 'Software update and system diagnostics'
    }
];

// Theme Management
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // Update theme toggle icon
    const themeToggle = document.querySelector('.theme-toggle i');
    if (themeToggle) {
        themeToggle.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Initialize theme from localStorage
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);

    const themeToggle = document.querySelector('.theme-toggle i');
    if (themeToggle) {
        themeToggle.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Status Badge Helper
function getStatusBadge(status) {
    const statusClasses = {
        'pending': 'status-badge status-pending',
        'progress': 'status-badge status-progress',
        'completed': 'status-badge status-completed',
        'cancelled': 'status-badge status-cancelled'
    };

    const statusTexts = {
        'pending': 'Pending',
        'progress': 'In Progress',
        'completed': 'Completed',
        'cancelled': 'Cancelled'
    };

    return `<span class="${statusClasses[status] || statusClasses.pending}">${statusTexts[status] || 'Unknown'}</span>`;
}

// Priority Badge Helper
function getPriorityBadge(priority) {
    const priorityClasses = {
        'low': 'priority-badge priority-low',
        'medium': 'priority-badge priority-medium',
        'high': 'priority-badge priority-high',
        'urgent': 'priority-badge priority-urgent'
    };

    const priorityTexts = {
        'low': 'Low',
        'medium': 'Medium',
        'high': 'High',
        'urgent': 'Urgent'
    };

    return `<span class="${priorityClasses[priority] || priorityClasses.low}">${priorityTexts[priority] || 'Low'}</span>`;
}

// Format Date Helper
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

// Populate Work Orders Table
function populateWorkOrdersTable() {
    const tableBody = document.getElementById('workOrdersTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    workOrdersData.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="font-medium text-primary">${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.vehicle}</td>
            <td>${order.serviceType}</td>
            <td>${getStatusBadge(order.status)}</td>
            <td>${getPriorityBadge(order.priority)}</td>
            <td>${order.assignedTo}</td>
            <td>${formatDate(order.dueDate)}</td>
            <td>
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-primary" onclick="viewWorkOrder('${order.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="editWorkOrder('${order.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Modal Management
function openModal() {
    const modal = document.getElementById('workOrderModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('workOrderModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Workflow Progress Management
function updateWorkflowProgress(status) {
    const steps = document.querySelectorAll('.workflow-step');
    const progressLine = document.querySelector('.workflow-progress-line');

    // Reset all steps
    steps.forEach(step => {
        step.classList.remove('active', 'completed');
    });

    let currentStep = 0;

    // Map work order status to workflow steps
    switch(status) {
        case 'pending':
            currentStep = 0; // Created
            break;
        case 'progress':
            currentStep = 1; // In Progress
            break;
        case 'quality-check':
            currentStep = 2; // Quality Check
            break;
        case 'customer-approval':
            currentStep = 3; // Customer Approval
            break;
        case 'completed':
            currentStep = 4; // Completed - all steps should be completed
            break;
        default:
            currentStep = 0;
    }

    // Update steps based on current status
    steps.forEach((step, index) => {
        if (status === 'completed') {
            // If completed, mark all steps as completed
            step.classList.add('completed');
        } else if (index < currentStep) {
            step.classList.add('completed');
        } else if (index === currentStep) {
            step.classList.add('active');
        }
    });

    // Update progress line
    if (progressLine) {
        let progressPercentage;
        if (status === 'completed') {
            progressPercentage = 100; // Full progress for completed
        } else {
            progressPercentage = (currentStep / (steps.length - 1)) * 100;
        }
        progressLine.style.width = `${progressPercentage}%`;
    }

    console.log('Workflow progress updated for status:', status, 'Step:', currentStep);
}

// Work Order Actions
function viewWorkOrder(orderId) {
    const order = workOrdersData.find(o => o.id === orderId);
    if (!order) return;

    // Enable view mode to prevent editing
    enableViewMode();

    // Open the full work order modal
    openModal();

    // Update workflow progress based on order status
    setTimeout(() => {
        updateWorkflowProgress(order.status);
        updateWorkOrderInfo(order);
    }, 100);

    console.log('Viewing work order:', orderId, 'in read-only mode');
}

function editWorkOrder(orderId) {
    const order = workOrdersData.find(o => o.id === orderId);
    if (!order) return;

    // Disable view mode to allow editing
    disableViewMode();

    // Open the full work order modal
    openModal();

    // Update workflow progress based on order status
    setTimeout(() => {
        updateWorkflowProgress(order.status);
        updateWorkOrderInfo(order);
    }, 100);

    console.log('Editing work order:', orderId, 'in edit mode');
}

// Update Work Order Info Bar
function updateWorkOrderInfo(order) {
    // Update work order number
    const workOrderNumber = document.getElementById('workOrderNumber');
    if (workOrderNumber) {
        workOrderNumber.textContent = order.id;
    }

    // Update status
    const workOrderStatus = document.getElementById('workOrderStatus');
    if (workOrderStatus) {
        workOrderStatus.innerHTML = getStatusBadge(order.status);
    }

    // Update dates
    const workOrderDate = document.getElementById('workOrderDate');
    if (workOrderDate) {
        workOrderDate.textContent = formatDate(order.createdDate);
    }

    // Update quotation number (derived from work order)
    const quotationNumber = document.getElementById('quotationNumber');
    if (quotationNumber) {
        quotationNumber.textContent = order.id.replace('WO-', 'QO-');
    }

    // Update quotation date
    const quotationDate = document.getElementById('quotationDate');
    if (quotationDate) {
        quotationDate.textContent = formatDate(order.createdDate);
    }

    console.log('Work order info updated for:', order.id);
}

// Search Functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            // Implementation for search functionality
            console.log('Searching for:', searchTerm);
        });
    }
}

// Navigation Active State
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const viewName = link.getAttribute('data-view');
            if (viewName) {
                switchView(viewName);

                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));

                // Add active class to clicked link
                link.classList.add('active');

                console.log('Navigation clicked:', link.textContent.trim(), 'View:', viewName);
            }
        });
    });
}

// View Switching
function switchView(viewName) {
    // Hide all content views
    const contentViews = document.querySelectorAll('.content-view');
    contentViews.forEach(view => view.classList.remove('active'));

    // Show the selected view
    const targetView = document.getElementById(viewName + '-view');
    if (targetView) {
        targetView.classList.add('active');

        // Populate data based on view
        populateViewData(viewName);

        console.log('Switched to view:', viewName);
    }
}

// Populate View Data
function populateViewData(viewName) {
    switch(viewName) {
        case 'overview':
            populateWorkOrdersTable();
            break;
        case 'all-orders':
            populateAllOrdersTable();
            break;
        case 'pending':
            populatePendingOrdersTable();
            break;
        case 'in-progress':
            populateInProgressOrdersTable();
            break;
        case 'completed':
            populateCompletedOrdersTable();
            break;
        case 'analytics':
            // Analytics data would be loaded here
            console.log('Loading analytics data...');
            break;
    }
}

// Populate All Orders Table
function populateAllOrdersTable() {
    const tableBody = document.getElementById('allOrdersTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    workOrdersData.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="font-medium text-primary">${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.vehicle}</td>
            <td>${order.serviceType}</td>
            <td>${getStatusBadge(order.status)}</td>
            <td>${getPriorityBadge(order.priority)}</td>
            <td>${order.assignedTo}</td>
            <td>${formatDate(order.dueDate)}</td>
            <td>
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-primary" onclick="viewWorkOrder('${order.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="editWorkOrder('${order.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Populate Pending Orders Table
function populatePendingOrdersTable() {
    const tableBody = document.getElementById('pendingOrdersTableBody');
    if (!tableBody) return;

    const pendingOrders = workOrdersData.filter(order => order.status === 'pending');
    tableBody.innerHTML = '';

    if (pendingOrders.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="6" class="text-center text-muted">No pending work orders found</td>`;
        tableBody.appendChild(row);
        return;
    }

    pendingOrders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="font-medium text-primary">${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.vehicle}</td>
            <td>${getPriorityBadge(order.priority)}</td>
            <td>${formatDate(order.createdDate)}</td>
            <td>
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-primary" onclick="viewWorkOrder('${order.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-success" onclick="startWorkOrder('${order.id}')">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Populate In Progress Orders Table
function populateInProgressOrdersTable() {
    const tableBody = document.getElementById('inProgressOrdersTableBody');
    if (!tableBody) return;

    const inProgressOrders = workOrdersData.filter(order => order.status === 'progress');
    tableBody.innerHTML = '';

    if (inProgressOrders.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="7" class="text-center text-muted">No work orders in progress</td>`;
        tableBody.appendChild(row);
        return;
    }

    inProgressOrders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="font-medium text-primary">${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.vehicle}</td>
            <td>${order.assignedTo}</td>
            <td>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: 65%"></div>
                    <span class="progress-text">65%</span>
                </div>
            </td>
            <td>${formatDate(order.dueDate)}</td>
            <td>
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-primary" onclick="viewWorkOrder('${order.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-success" onclick="completeWorkOrder('${order.id}')">
                        <i class="fas fa-check"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Populate Completed Orders Table
function populateCompletedOrdersTable() {
    const tableBody = document.getElementById('completedOrdersTableBody');
    if (!tableBody) return;

    const completedOrders = workOrdersData.filter(order => order.status === 'completed');
    tableBody.innerHTML = '';

    if (completedOrders.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="7" class="text-center text-muted">No completed work orders found</td>`;
        tableBody.appendChild(row);
        return;
    }

    completedOrders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="font-medium text-primary">${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.vehicle}</td>
            <td>${formatDate(order.dueDate)}</td>
            <td class="amount-cell">$${(Math.random() * 1000 + 200).toFixed(2)}</td>
            <td>
                <div class="rating">
                    ${'★'.repeat(5)}<span class="rating-text">5.0</span>
                </div>
            </td>
            <td>
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-primary" onclick="viewWorkOrder('${order.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="printWorkOrder('${order.id}')">
                        <i class="fas fa-print"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Work Order Actions
function startWorkOrder(orderId) {
    console.log('Starting work order:', orderId);
    // Implementation for starting work order
}

function completeWorkOrder(orderId) {
    console.log('Completing work order:', orderId);
    // Implementation for completing work order
}

function printWorkOrder(orderId) {
    console.log('Printing work order:', orderId);
    // Implementation for printing work order
}

// Initialize Application
function initializeApp() {
    initializeTheme();
    populateWorkOrdersTable();
    initializeSearch();
    initializeNavigation();

    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
        const modal = document.getElementById('workOrderModal');
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    console.log('AfterMarket Pro initialized successfully');
}

// Tab Management
function initializeTabs() {
    // Main tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            // Remove active class from all tabs and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            // Add active class to clicked tab and corresponding pane
            btn.classList.add('active');
            document.getElementById(targetTab + 'Tab').classList.add('active');
        });
    });

    // Checklist menu
    const checklistBtns = document.querySelectorAll('.checklist-menu-btn');
    const checklistSections = document.querySelectorAll('.checklist-section');

    checklistBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetSection = btn.getAttribute('data-section');

            // Remove active class from all buttons and sections
            checklistBtns.forEach(b => b.classList.remove('active'));
            checklistSections.forEach(s => s.classList.remove('active'));

            // Add active class to clicked button and corresponding section
            btn.classList.add('active');
            document.getElementById(targetSection + 'Section').classList.add('active');
        });
    });

    // Job details menu
    const jobBtns = document.querySelectorAll('.job-menu-btn');
    const jobSections = document.querySelectorAll('.job-section');

    jobBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetSection = btn.getAttribute('data-section');

            // Remove active class from all buttons and sections
            jobBtns.forEach(b => b.classList.remove('active'));
            jobSections.forEach(s => s.classList.remove('active'));

            // Add active class to clicked button and corresponding section
            btn.classList.add('active');
            document.getElementById(targetSection + 'Section').classList.add('active');
        });
    });

    // Vehicle view selector
    const viewBtns = document.querySelectorAll('.view-btn');
    const vehicleImage = document.getElementById('vehicleImage');

    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.getAttribute('data-view');

            // Remove active class from all view buttons
            viewBtns.forEach(b => b.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');

            // Update vehicle image based on view
            updateVehicleView(view);
        });
    });
}

// Vehicle View Management
function updateVehicleView(view) {
    const vehicleImage = document.getElementById('vehicleImage');
    const viewImages = {
        'front': 'img/Front View.png',
        'rear': 'img/Rear View.png',
        'left': 'img/Front Left View.png',
        'right': 'img/Front Right View.png',
        'top': 'img/j.png'
    };

    if (vehicleImage && viewImages[view]) {
        vehicleImage.src = viewImages[view];
        vehicleImage.alt = `Vehicle ${view.charAt(0).toUpperCase() + view.slice(1)} View`;

        // Add error handling for missing images
        vehicleImage.onerror = function() {
            console.warn(`Image not found: ${viewImages[view]}`);
            this.src = 'https://via.placeholder.com/400x300/e9ecef/6c757d?text=Vehicle+' + view.charAt(0).toUpperCase() + view.slice(1) + '+View';
        };
    }
}

// Sub Job Management
function switchSubJob(jobId) {
    console.log('switchSubJob called with ID:', jobId);

    if (!jobId) return;

    const selectedOption = document.querySelector(`#subJobSelector option[value="${jobId}"]`);
    if (!selectedOption) return;

    const optionText = selectedOption.textContent;
    console.log('Selected option text:', optionText);

    // Extract job number from the option text (e.g., "Sub Job 2" -> "2")
    const jobMatch = optionText.match(/Sub Job (\d+)/);
    if (!jobMatch) return;

    const jobNumber = jobMatch[1];
    console.log('Determined job number:', jobNumber, 'for job ID:', jobId);

    // Update all job references
    updateAllJobReferences(jobNumber);

    // Update job-specific content
    updateJobContent(jobId, jobNumber);
}

// Update All Job References
function updateAllJobReferences(jobNumber) {
    console.log('Updating all job references to J' + jobNumber);

    // Update job menu buttons
    const jobMenuBtns = document.querySelectorAll('.job-menu-btn');
    jobMenuBtns.forEach(btn => {
        const section = btn.getAttribute('data-section');
        if (section && section !== 'legend') {
            const sectionNames = {
                'header': 'Header',
                'suggested': 'Part Suggested List',
                'parts': 'Parts',
                'labor': 'Labor and Misc. Details',
                'travel': 'Travel',
                'attachments': 'Attachments',
                'summary': 'Summary',
                'causing': 'Causing Part',
                'activity': 'Job Card Activity',
                'progress': 'Case Progress'
            };

            if (sectionNames[section]) {
                btn.textContent = `J${jobNumber}-${sectionNames[section]}`;
            }
        }
    });

    // Update section titles
    document.querySelectorAll('.job-section h3').forEach(title => {
        const sectionId = title.parentElement.id;
        switch(sectionId) {
            case 'headerSection':
                title.textContent = `J${jobNumber}-Header`;
                break;
            case 'suggestedSection':
                title.textContent = `J${jobNumber}-Part Suggested List`;
                break;
            case 'partsSection':
                title.textContent = `J${jobNumber}-Parts`;
                break;
            case 'laborSection':
                title.textContent = `J${jobNumber}-Labor and Misc. Details`;
                break;
            case 'travelSection':
                title.textContent = `J${jobNumber}-Travel`;
                break;
            case 'attachmentsSection':
                title.textContent = `J${jobNumber}-Attachments`;
                break;
            case 'summarySection':
                title.textContent = `J${jobNumber}-Summary`;
                break;
            case 'causingSection':
                title.textContent = `J${jobNumber}-Causing Part`;
                break;
        }
    });

    // Update table references
    updateTableJobReferences(jobNumber);

    console.log('All UI elements updated to J' + jobNumber);
}

// Update Table Job References
function updateTableJobReferences(jobNumber) {
    // Update labor table operation codes
    const laborTableRows = document.querySelectorAll('.labor-table tbody tr');
    laborTableRows.forEach((row) => {
        const operationCodeCell = row.querySelector('td:nth-child(2)');
        if (operationCodeCell && !operationCodeCell.textContent.includes('No data')) {
            // Update operation codes to include job number
            const originalCode = operationCodeCell.textContent.replace(/J\d+-/, '');
            operationCodeCell.textContent = `J${jobNumber}-${originalCode}`;
        }
    });

    // Update parts table prefixes
    const partsTableRows = document.querySelectorAll('#partsSection .modern-table tbody tr');
    partsTableRows.forEach((row) => {
        const prefixCell = row.querySelector('td:first-child');
        if (prefixCell && prefixCell.textContent.includes('PART')) {
            prefixCell.textContent = `J${jobNumber}-PART`;
        }
    });
}

// Update Job Content
function updateJobContent(jobId, jobNumber) {
    console.log('Updating job content for job number:', jobNumber);

    // Update quotation reference
    const quotationRefField = document.getElementById('quotationRef');
    if (quotationRefField) {
        const baseRef = quotationRefField.value.replace(/ - \d+$/, '');
        quotationRefField.value = `${baseRef} - ${jobNumber}`;
    }

    // Update job number field
    const jobNumberField = document.getElementById('jobNumber');
    if (jobNumberField) {
        const baseJobNumber = jobNumberField.value.replace(/-\d+-\d+$/, '');
        jobNumberField.value = `${baseJobNumber}-${jobNumber}-01`;
    }

    // Update customer complaint based on job number
    const customerComplaintField = document.getElementById('customerComplaintJob');
    if (customerComplaintField) {
        const complaints = {
            '1': 'Engine making unusual noise during startup',
            '2': 'Air conditioning not cooling properly',
            '3': 'Brake pedal feels spongy when pressed',
            '4': 'Transmission shifting roughly between gears'
        };
        customerComplaintField.value = complaints[jobNumber] || 'Enter customer complaint details';
    }

    // Update service type based on job number
    const serviceTypeField = document.getElementById('serviceType');
    if (serviceTypeField) {
        const serviceTypes = {
            '1': 'repair',
            '2': 'maintenance',
            '3': 'inspection',
            '4': 'warranty'
        };
        serviceTypeField.value = serviceTypes[jobNumber] || 'repair';
    }

    // Update work priority based on job number
    const workPriorityField = document.getElementById('workPriority');
    if (workPriorityField) {
        const priorities = {
            '1': 'high',
            '2': 'medium',
            '3': 'urgent',
            '4': 'low'
        };
        workPriorityField.value = priorities[jobNumber] || 'medium';
    }

    console.log('Job content updated for J' + jobNumber);
}

// File Upload Management
function initializeFileUpload() {
    const uploadZone = document.querySelector('.upload-zone');
    const fileInput = document.querySelector('.file-input');
    const chooseFilesBtn = uploadZone?.querySelector('.btn');

    if (!uploadZone || !fileInput) return;

    // Click to browse files
    chooseFilesBtn?.addEventListener('click', () => {
        fileInput.click();
    });

    // Drag and drop functionality
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = 'var(--primary-blue)';
        uploadZone.style.background = 'var(--surface-primary)';
    });

    uploadZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = 'var(--border-medium)';
        uploadZone.style.background = '';
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = 'var(--border-medium)';
        uploadZone.style.background = '';

        const files = e.dataTransfer.files;
        handleFileUpload(files);
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
        handleFileUpload(e.target.files);
    });
}

// Handle File Upload
function handleFileUpload(files) {
    console.log('Files selected:', files.length);

    Array.from(files).forEach(file => {
        console.log('File:', file.name, 'Size:', file.size, 'Type:', file.type);
        // Here you would typically upload the file to your server
        // For now, we'll just log the file information
    });
}

// Global Variables
let currentQueue = 'my';
let currentFilters = {};
let isViewMode = false;
let expandedRows = new Set();

// Queue Management
function initializeQueueTabs() {
    const queueTabs = document.querySelectorAll('.queue-tab');
    queueTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const queueType = tab.getAttribute('data-queue');
            switchQueue(queueType);

            // Update active tab
            queueTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
}

function switchQueue(queueType) {
    currentQueue = queueType;

    // Update queue title
    const queueTitle = document.getElementById('queueTitle');
    if (queueTitle) {
        const titles = {
            'my': 'My Queue - Work Orders',
            'group': 'Group Queue - Work Orders',
            'all': 'All Queue - Work Orders'
        };
        queueTitle.textContent = titles[queueType] || 'Work Orders';
    }

    // Refresh data based on queue type
    populateQueueData(queueType);

    console.log('Switched to queue:', queueType);
}

function populateQueueData(queueType) {
    let filteredData = [...workOrdersData];

    // Filter based on queue type
    switch(queueType) {
        case 'my':
            // Show only orders assigned to current user (simulated)
            filteredData = workOrdersData.filter(order =>
                order.assignedTo === 'Mike Johnson' || order.assignedTo === 'Current User'
            );
            break;
        case 'group':
            // Show orders assigned to user's group (simulated)
            filteredData = workOrdersData.filter(order =>
                ['Mike Johnson', 'Tom Wilson'].includes(order.assignedTo)
            );
            break;
        case 'all':
            // Show all orders
            filteredData = workOrdersData;
            break;
    }

    // Apply current filters
    filteredData = applyCurrentFilters(filteredData);

    // Update table
    updateWorkOrderTable(filteredData);
}

// Expand/Collapse Functionality
function expandAll() {
    const expandableRows = document.querySelectorAll('.expandable-row');
    expandableRows.forEach(row => {
        if (!row.classList.contains('expanded')) {
            toggleRowExpansion(row);
        }
    });
    console.log('Expanded all rows');
}

function collapseAll() {
    const expandableRows = document.querySelectorAll('.expandable-row');
    expandableRows.forEach(row => {
        if (row.classList.contains('expanded')) {
            toggleRowExpansion(row);
        }
    });
    console.log('Collapsed all rows');
}

function toggleRowExpansion(row) {
    const rowId = row.getAttribute('data-row-id');
    const subRows = document.querySelectorAll(`[data-parent-id="${rowId}"]`);

    if (row.classList.contains('expanded')) {
        row.classList.remove('expanded');
        subRows.forEach(subRow => subRow.classList.remove('expanded'));
        expandedRows.delete(rowId);
    } else {
        row.classList.add('expanded');
        subRows.forEach(subRow => subRow.classList.add('expanded'));
        expandedRows.add(rowId);
    }
}

// Refresh Data
function refreshData() {
    const refreshBtn = document.querySelector('[onclick="refreshData()"]');
    if (refreshBtn) {
        const originalContent = refreshBtn.innerHTML;
        refreshBtn.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Refreshing...';
        refreshBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            populateQueueData(currentQueue);
            refreshBtn.innerHTML = originalContent;
            refreshBtn.disabled = false;
            console.log('Data refreshed');
        }, 1500);
    }
}

// Filter Modal Functions
function openFilterModal() {
    const modal = document.getElementById('filterModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeFilterModal() {
    const modal = document.getElementById('filterModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function clearFilters() {
    // Clear all filter inputs
    document.getElementById('filterStatus').selectedIndex = -1;
    document.getElementById('filterPriority').selectedIndex = -1;
    document.getElementById('filterServiceType').selectedIndex = -1;
    document.getElementById('filterAssignedTo').selectedIndex = -1;
    document.getElementById('filterDateFrom').value = '';
    document.getElementById('filterDateTo').value = '';
    document.getElementById('filterCustomer').value = '';

    currentFilters = {};
    console.log('Filters cleared');
}

function applyFilters() {
    // Collect filter values
    const status = Array.from(document.getElementById('filterStatus').selectedOptions).map(o => o.value);
    const priority = Array.from(document.getElementById('filterPriority').selectedOptions).map(o => o.value);
    const serviceType = Array.from(document.getElementById('filterServiceType').selectedOptions).map(o => o.value);
    const assignedTo = Array.from(document.getElementById('filterAssignedTo').selectedOptions).map(o => o.value);
    const dateFrom = document.getElementById('filterDateFrom').value;
    const dateTo = document.getElementById('filterDateTo').value;
    const customer = document.getElementById('filterCustomer').value;

    currentFilters = {
        status: status.length > 0 ? status : null,
        priority: priority.length > 0 ? priority : null,
        serviceType: serviceType.length > 0 ? serviceType : null,
        assignedTo: assignedTo.length > 0 ? assignedTo : null,
        dateFrom: dateFrom || null,
        dateTo: dateTo || null,
        customer: customer || null
    };

    // Apply filters and refresh data
    populateQueueData(currentQueue);
    closeFilterModal();

    console.log('Filters applied:', currentFilters);
}

function applyCurrentFilters(data) {
    let filtered = [...data];

    if (currentFilters.status) {
        filtered = filtered.filter(order => currentFilters.status.includes(order.status));
    }

    if (currentFilters.priority) {
        filtered = filtered.filter(order => currentFilters.priority.includes(order.priority));
    }

    if (currentFilters.serviceType) {
        filtered = filtered.filter(order => currentFilters.serviceType.includes(order.serviceType));
    }

    if (currentFilters.assignedTo) {
        filtered = filtered.filter(order => currentFilters.assignedTo.includes(order.assignedTo));
    }

    if (currentFilters.customer) {
        filtered = filtered.filter(order =>
            order.customer.toLowerCase().includes(currentFilters.customer.toLowerCase())
        );
    }

    if (currentFilters.dateFrom) {
        filtered = filtered.filter(order =>
            new Date(order.createdDate) >= new Date(currentFilters.dateFrom)
        );
    }

    if (currentFilters.dateTo) {
        filtered = filtered.filter(order =>
            new Date(order.createdDate) <= new Date(currentFilters.dateTo)
        );
    }

    return filtered;
}

// Advanced Search Functions
function openAdvanceSearch() {
    const modal = document.getElementById('advanceSearchModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeAdvanceSearchModal() {
    const modal = document.getElementById('advanceSearchModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function clearAdvanceSearch() {
    // Clear all search inputs
    document.getElementById('searchWorkOrder').value = '';
    document.getElementById('searchCustomer').value = '';
    document.getElementById('searchVehicle').value = '';
    document.getElementById('searchPhone').value = '';
    document.getElementById('searchEmail').value = '';
    document.getElementById('searchVIN').value = '';
    document.getElementById('searchLicense').value = '';
    document.getElementById('searchPartNumber').value = '';
    document.getElementById('searchInvoice').value = '';
    document.getElementById('searchDescription').value = '';

    console.log('Advanced search cleared');
}

function performAdvanceSearch() {
    // Collect search values
    const searchCriteria = {
        workOrder: document.getElementById('searchWorkOrder').value,
        customer: document.getElementById('searchCustomer').value,
        vehicle: document.getElementById('searchVehicle').value,
        phone: document.getElementById('searchPhone').value,
        email: document.getElementById('searchEmail').value,
        vin: document.getElementById('searchVIN').value,
        license: document.getElementById('searchLicense').value,
        partNumber: document.getElementById('searchPartNumber').value,
        invoice: document.getElementById('searchInvoice').value,
        description: document.getElementById('searchDescription').value
    };

    // Filter data based on search criteria
    let searchResults = workOrdersData.filter(order => {
        return Object.keys(searchCriteria).every(key => {
            if (!searchCriteria[key]) return true;

            const searchValue = searchCriteria[key].toLowerCase();
            switch(key) {
                case 'workOrder':
                    return order.id.toLowerCase().includes(searchValue);
                case 'customer':
                    return order.customer.toLowerCase().includes(searchValue);
                case 'vehicle':
                    return order.vehicle.toLowerCase().includes(searchValue);
                case 'description':
                    return order.description.toLowerCase().includes(searchValue);
                default:
                    return true; // For fields not in sample data
            }
        });
    });

    // Update table with search results
    updateWorkOrderTable(searchResults);
    closeAdvanceSearchModal();

    console.log('Advanced search performed:', searchCriteria);
    console.log('Search results:', searchResults.length, 'orders found');
}

// Export Functions
function exportData() {
    const exportBtn = document.querySelector('[onclick="exportData()"]');
    if (exportBtn) {
        // Create export menu
        const exportMenu = document.createElement('div');
        exportMenu.className = 'export-menu active';
        exportMenu.innerHTML = `
            <button class="export-option" onclick="exportToExcel()">
                <i class="fas fa-file-excel"></i>
                Export to Excel
            </button>
            <button class="export-option" onclick="exportToPDF()">
                <i class="fas fa-file-pdf"></i>
                Export to PDF
            </button>
            <button class="export-option" onclick="exportToCSV()">
                <i class="fas fa-file-csv"></i>
                Export to CSV
            </button>
            <button class="export-option" onclick="printReport()">
                <i class="fas fa-print"></i>
                Print Report
            </button>
        `;

        // Position and show menu
        const rect = exportBtn.getBoundingClientRect();
        exportMenu.style.position = 'fixed';
        exportMenu.style.top = rect.bottom + 'px';
        exportMenu.style.right = (window.innerWidth - rect.right) + 'px';

        document.body.appendChild(exportMenu);

        // Close menu when clicking outside
        setTimeout(() => {
            document.addEventListener('click', function closeExportMenu(e) {
                if (!exportMenu.contains(e.target) && e.target !== exportBtn) {
                    exportMenu.remove();
                    document.removeEventListener('click', closeExportMenu);
                }
            });
        }, 100);
    }
}

function exportToExcel() {
    console.log('Exporting to Excel...');
    // Implementation for Excel export
    alert('Excel export functionality would be implemented here');
}

function exportToPDF() {
    console.log('Exporting to PDF...');
    // Implementation for PDF export
    alert('PDF export functionality would be implemented here');
}

function exportToCSV() {
    console.log('Exporting to CSV...');
    // Implementation for CSV export
    alert('CSV export functionality would be implemented here');
}

function printReport() {
    console.log('Printing report...');
    window.print();
}

// Legend Functions
function showLegend() {
    const modal = document.getElementById('legendModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLegendModal() {
    const modal = document.getElementById('legendModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// View Mode Management
function enableViewMode() {
    isViewMode = true;
    const workOrderModal = document.querySelector('.work-order-modal-content');
    if (workOrderModal) {
        workOrderModal.classList.add('view-mode');
    }
    console.log('View mode enabled - editing disabled');
}

function disableViewMode() {
    isViewMode = false;
    const workOrderModal = document.querySelector('.work-order-modal-content');
    if (workOrderModal) {
        workOrderModal.classList.remove('view-mode');
    }
    console.log('View mode disabled - editing enabled');
}

// Update Work Order Table
function updateWorkOrderTable(data) {
    const tableBody = document.getElementById('allOrdersTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    if (data.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="9" class="text-center text-muted">No work orders found</td>`;
        tableBody.appendChild(row);
        return;
    }

    data.forEach((order, index) => {
        const row = document.createElement('tr');
        row.className = 'expandable-row';
        row.setAttribute('data-row-id', `row-${index}`);

        row.innerHTML = `
            <td>
                <i class="fas fa-chevron-right expand-icon"></i>
                <span class="font-medium text-primary">${order.id}</span>
            </td>
            <td>${order.customer}</td>
            <td>${order.vehicle}</td>
            <td>${order.serviceType}</td>
            <td>${getStatusBadge(order.status)}</td>
            <td>${getPriorityBadge(order.priority)}</td>
            <td>${order.assignedTo}</td>
            <td>${formatDate(order.dueDate)}</td>
            <td>
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-primary" onclick="viewWorkOrder('${order.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="editWorkOrder('${order.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        `;

        // Add click handler for expansion
        row.addEventListener('click', (e) => {
            if (!e.target.closest('.btn')) {
                toggleRowExpansion(row);
            }
        });

        tableBody.appendChild(row);

        // Add sub-row for expanded details
        const subRow = document.createElement('tr');
        subRow.className = 'sub-row';
        subRow.setAttribute('data-parent-id', `row-${index}`);
        subRow.innerHTML = `
            <td colspan="9">
                <div class="sub-row-content">
                    <div class="row">
                        <div class="col-md-3">
                            <strong>Created:</strong> ${formatDate(order.createdDate)}
                        </div>
                        <div class="col-md-3">
                            <strong>Description:</strong> ${order.description}
                        </div>
                        <div class="col-md-3">
                            <strong>Estimated Cost:</strong> $${(Math.random() * 1000 + 200).toFixed(2)}
                        </div>
                        <div class="col-md-3">
                            <strong>Progress:</strong> ${Math.floor(Math.random() * 100)}%
                        </div>
                    </div>
                </div>
            </td>
        `;
        tableBody.appendChild(subRow);
    });
}

// New Work Order Creation
function createNewWorkOrder() {
    console.log('Creating new work order...');
    // Implementation for creating new work order
    alert('New work order creation would be implemented here');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    initializeTabs();
    initializeFileUpload();
    initializeQueueTabs();

    // Initialize with My Queue
    switchQueue('my');

    // Initialize vehicle view with front view
    setTimeout(() => {
        updateVehicleView('front');
    }, 500);
});
