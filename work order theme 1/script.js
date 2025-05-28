// Global variables
let currentWorkOrders = [];
let currentFilter = 'all';
let expandedRows = new Set();
let expandedSubJobs = new Set();

// DOM elements
const themeToggle = document.getElementById('themeToggle');
const searchInput = document.getElementById('searchInput');
const filterTabs = document.querySelectorAll('.filter-tab');
const workOrdersTableBody = document.getElementById('workOrdersTableBody');
const workOrderModal = document.getElementById('workOrderModal');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const saveBtn = document.getElementById('saveBtn');
const newWorkOrderBtn = document.getElementById('newWorkOrderBtn');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, checking data...');
    console.log('workOrdersData available:', typeof workOrdersData !== 'undefined');
    if (typeof workOrdersData !== 'undefined') {
        currentWorkOrders = [...workOrdersData];
        console.log('First work order:', workOrdersData[0]);
        console.log('Bay value:', workOrdersData[0].bay);
        console.log('Key tag value:', workOrdersData[0].keyTag);
        console.log('Unit number value:', workOrdersData[0].unitNumber);
    }
    initializeTheme();
    renderWorkOrders();
    setupEventListeners();
});

// Theme management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Event listeners setup
function setupEventListeners() {
    themeToggle.addEventListener('click', toggleTheme);
    searchInput.addEventListener('input', handleSearch);
    closeModal.addEventListener('click', closeWorkOrderModal);
    cancelBtn.addEventListener('click', closeWorkOrderModal);
    saveBtn.addEventListener('click', saveWorkOrder);
    newWorkOrderBtn.addEventListener('click', openNewWorkOrderModal);

    // Filter tabs
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => handleFilterChange(tab.dataset.filter));
    });

    // Modal tab navigation
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Job details menu navigation
    const jobMenuBtns = document.querySelectorAll('.job-menu-btn');
    jobMenuBtns.forEach(btn => {
        btn.addEventListener('click', () => switchJobSection(btn.dataset.section));
    });

    // Checklist menu navigation
    const checklistMenuBtns = document.querySelectorAll('.checklist-menu-btn');
    checklistMenuBtns.forEach(btn => {
        btn.addEventListener('click', () => switchChecklistSection(btn.dataset.section));
    });

    // Close modal when clicking outside
    workOrderModal.addEventListener('click', (e) => {
        if (e.target === workOrderModal) {
            closeWorkOrderModal();
        }
    });

    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && workOrderModal.classList.contains('active')) {
            closeWorkOrderModal();
        }
    });
}

// Search functionality
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    if (searchTerm === '') {
        currentWorkOrders = [...workOrdersData];
    } else {
        currentWorkOrders = workOrdersData.filter(wo =>
            wo.workOrderNumber.toLowerCase().includes(searchTerm) ||
            wo.customerName.toLowerCase().includes(searchTerm) ||
            wo.customerAccount.toLowerCase().includes(searchTerm) ||
            wo.serialNumber.toLowerCase().includes(searchTerm) ||
            wo.quotationNumber.toLowerCase().includes(searchTerm) ||
            wo.status.toLowerCase().includes(searchTerm)
        );
    }

    applyCurrentFilter();
    renderWorkOrders();
}

// Filter functionality
function handleFilterChange(filter) {
    currentFilter = filter;

    // Update active tab
    filterTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.filter === filter);
    });

    applyCurrentFilter();
    renderWorkOrders();
}

function applyCurrentFilter() {
    // For demo purposes, we'll just show all orders
    // In a real application, you would filter based on user assignments, etc.
    switch (currentFilter) {
        case 'my':
            // Filter for current user's work orders
            break;
        case 'group':
            // Filter for group work orders
            break;
        default:
            // Show all work orders
            break;
    }
}

// Render work orders table
function renderWorkOrders() {
    workOrdersTableBody.innerHTML = '';

    currentWorkOrders.forEach(workOrder => {
        renderWorkOrderWithSubJobs(workOrder, 0);
    });
}

// Render work order with its sub-jobs
function renderWorkOrderWithSubJobs(workOrder, level = 0) {
    const row = createWorkOrderRow(workOrder, level > 0, level);
    workOrdersTableBody.appendChild(row);

    // Add expanded details if row was previously expanded
    if (expandedRows.has(workOrder.id)) {
        const detailsRow = createWorkOrderDetailsRow(workOrder);
        workOrdersTableBody.appendChild(detailsRow);
    }

    // Add sub-jobs if they exist and parent is expanded
    if (workOrder.hasSubJobs && workOrder.subJobs && expandedSubJobs.has(workOrder.id)) {
        workOrder.subJobs.forEach(subJob => {
            renderWorkOrderWithSubJobs(subJob, level + 1);
        });
    }
}

// Create work order table row
function createWorkOrderRow(workOrder, isSubJob = false, level = 0) {
    const row = document.createElement('tr');
    row.className = expandedRows.has(workOrder.id) ? 'expanded' : '';
    if (isSubJob) {
        row.classList.add('sub-job-row');
        row.dataset.parentId = workOrder.parentId;
    }
    row.dataset.workOrderId = workOrder.id;
    row.dataset.level = level;

    const statusClass = statusColors[workOrder.status] || 'default';
    const hasSubJobs = workOrder.hasSubJobs && workOrder.subJobs && workOrder.subJobs.length > 0;
    const isExpanded = expandedSubJobs.has(workOrder.id);

    // Simplified tree structure - only show tree icon for parent orders
    let workOrderDisplay = workOrder.workOrderNumber;
    let treeControl = '';

    if (hasSubJobs && !isSubJob) {
        // Parent order with sub-jobs
        const subJobCount = workOrder.subJobs.length;
        treeControl = `
            <button class="tree-toggle-btn ${isExpanded ? 'expanded' : ''}"
                    onclick="event.stopPropagation(); toggleSubJobs(${workOrder.id})"
                    title="${isExpanded ? 'Hide' : 'Show'} ${subJobCount} sub job${subJobCount > 1 ? 's' : ''}">
                <i class="fas fa-${isExpanded ? 'minus' : 'plus'}"></i>
                <span class="sub-count">${subJobCount}</span>
            </button>`;
        workOrderDisplay = `
            <div class="parent-order">
                <span class="work-order-link" onclick="event.stopPropagation(); openWorkOrderModal(${workOrder.id})">
                    ${workOrder.workOrderNumber}
                </span>
                ${treeControl}
            </div>`;
    } else if (isSubJob) {
        // Sub-job
        workOrderDisplay = `
            <div class="sub-job" style="margin-left: 20px;">
                <i class="fas fa-arrow-turn-down-right sub-job-icon"></i>
                <span class="work-order-link sub-job-link" onclick="event.stopPropagation(); openWorkOrderModal(${workOrder.id})">
                    ${workOrder.workOrderNumber}
                </span>
            </div>`;
    } else {
        // Regular order without sub-jobs
        workOrderDisplay = `
            <span class="work-order-link" onclick="event.stopPropagation(); openWorkOrderModal(${workOrder.id})">
                ${workOrder.workOrderNumber}
            </span>`;
    }

    row.innerHTML = `
        <td>
            <i class="fas fa-chevron-right expandable-icon ${expandedRows.has(workOrder.id) ? 'expanded' : ''}"
               onclick="event.stopPropagation(); toggleRowExpansion(${workOrder.id})"
               title="Show/Hide details"></i>
        </td>
        <td>${workOrderDisplay}</td>
        <td>${workOrder.customerAccount}</td>
        <td>${workOrder.customerName}</td>
        <td>${workOrder.serialNumber}</td>
        <td>${workOrder.quotationNumber}</td>
        <td>${workOrder.ticketNumber}</td>
        <td>${formatDate(workOrder.plannedStartDate)}</td>
        <td>${formatDate(workOrder.plannedCompletionDate)}</td>
        <td>${workOrder.unitNumber}</td>
        <td>${workOrder.status}</td>
        <td>${workOrder.keyTag}</td>
        <td>${workOrder.bay}</td>
    `;

    // Add click event to the entire row for details expansion
    row.addEventListener('click', (e) => {
        if (!e.target.closest('.tree-toggle-btn') && !e.target.closest('.expandable-icon') && !e.target.closest('.work-order-link')) {
            toggleRowExpansion(workOrder.id);
        }
    });

    return row;
}

// Create expanded work order details row
function createWorkOrderDetailsRow(workOrder) {
    const detailsRow = document.createElement('tr');
    detailsRow.className = 'work-order-details';

    const statusClass = statusColors[workOrder.status] || 'default';
    const quotationStatusClass = statusColors[workOrder.quotationStatus] || 'default';

    detailsRow.innerHTML = `
        <td colspan="13">
            <div class="expanded-work-order-header">
                <div class="header-actions">
                    <button class="btn btn-secondary btn-sm">Pull Back</button>
                    <button class="btn btn-secondary btn-sm">Addition Job/Estimate</button>
                    <button class="btn btn-secondary btn-sm">View</button>
                </div>
            </div>
            <div class="expanded-work-order-table">
                <table class="expanded-details-table">
                    <tbody>
                        <!-- Row 1: Work Order # and Basic Info -->
                        <tr class="details-row">
                            <td class="field-label">Work Order #</td>
                            <td class="field-value work-order-cell">
                                <i class="fas fa-external-link-alt"></i>
                                <a href="#" onclick="openWorkOrderModal(${workOrder.id})" class="work-order-link">
                                    ${workOrder.workOrderNumber}
                                </a>
                            </td>
                            <td class="field-label">Customer Complaint</td>
                            <td class="field-value" title="${safeGet(workOrder, 'jobDetails.customerComplaint')}">${safeGet(workOrder, 'jobDetails.customerComplaint') || 'No complaint specified'}</td>
                            <td class="field-label">Status</td>
                            <td class="field-value">${workOrder.status}</td>
                        </tr>

                        <!-- Row 2: Quotation and Assignment Info -->
                        <tr class="details-row">
                            <td class="field-label">Quotation Status</td>
                            <td class="field-value">${workOrder.quotationStatus || 'Approved'}</td>
                            <td class="field-label">Assigned To</td>
                            <td class="field-value">${workOrder.assignedTo || 'Admin'}</td>
                            <td class="field-label">Customer Account #</td>
                            <td class="field-value">${workOrder.customerAccount}</td>
                        </tr>

                        <!-- Row 3: Customer and Serial Info -->
                        <tr class="details-row">
                            <td class="field-label">Customer Name</td>
                            <td class="field-value">${workOrder.customerName}</td>
                            <td class="field-label">Serial #</td>
                            <td class="field-value">${workOrder.serialNumber}</td>
                            <td class="field-label">Quotation #</td>
                            <td class="field-value">${workOrder.quotationNumber}</td>
                        </tr>

                        <!-- Row 4: Financial and Date Info -->
                        <tr class="details-row">
                            <td class="field-label">Fin. Year</td>
                            <td class="field-value">${workOrder.finYear || '2024-25'}</td>
                            <td class="field-label">Date</td>
                            <td class="field-value">${formatDate(workOrder.date || workOrder.workOrderDate)}</td>
                            <td class="field-label">Model</td>
                            <td class="field-value">${workOrder.model || '-'}</td>
                        </tr>

                        <!-- Row 5: Asset and Service Details -->
                        <tr class="details-row">
                            <td class="field-label">Unit #</td>
                            <td class="field-value">${workOrder.unitNumber || '-'}</td>
                            <td class="field-label">Ticket #</td>
                            <td class="field-value">${workOrder.ticketNumber || '-'}</td>
                            <td class="field-label">Service Type</td>
                            <td class="field-value">${workOrder.serviceType || 'General'}</td>
                        </tr>

                        <!-- Row 6: Priority and Rate Info -->
                        <tr class="details-row">
                            <td class="field-label">Work Priority</td>
                            <td class="field-value">${workOrder.workPriority || 'Medium'}</td>
                            <td class="field-label">Is Mobile Rate?</td>
                            <td class="field-value">${workOrder.isMobileRate ? 'Yes' : 'No'}</td>
                            <td class="field-label"></td>
                            <td class="field-value"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </td>
    `;

    return detailsRow;
}

// Toggle sub-jobs visibility
function toggleSubJobs(workOrderId) {
    if (expandedSubJobs.has(workOrderId)) {
        expandedSubJobs.delete(workOrderId);
    } else {
        expandedSubJobs.add(workOrderId);
    }
    renderWorkOrders();
}

// Toggle row expansion
function toggleRowExpansion(workOrderId) {
    const icon = document.querySelector(`tr[data-work-order-id="${workOrderId}"] .expandable-icon`);
    const row = document.querySelector(`tr[data-work-order-id="${workOrderId}"]`);

    if (expandedRows.has(workOrderId)) {
        expandedRows.delete(workOrderId);
        icon.classList.remove('expanded');
        row.classList.remove('expanded');

        // Remove details row
        const detailsRow = row.nextElementSibling;
        if (detailsRow && detailsRow.classList.contains('work-order-details')) {
            detailsRow.remove();
        }
    } else {
        expandedRows.add(workOrderId);
        icon.classList.add('expanded');
        row.classList.add('expanded');

        // Add details row
        const workOrder = findWorkOrderById(workOrderId);
        if (workOrder) {
            const detailsRow = createWorkOrderDetailsRow(workOrder);
            row.parentNode.insertBefore(detailsRow, row.nextSibling);
        }
    }
}

// Find work order by ID (including sub-jobs)
function findWorkOrderById(workOrderId) {
    for (const workOrder of workOrdersData) {
        if (workOrder.id === workOrderId) {
            return workOrder;
        }
        if (workOrder.subJobs) {
            for (const subJob of workOrder.subJobs) {
                if (subJob.id === workOrderId) {
                    return subJob;
                }
            }
        }
    }
    return null;
}

// Modal functionality
function openWorkOrderModal(workOrderId) {
    const workOrder = findWorkOrderById(workOrderId);
    if (!workOrder) return;

    populateModalData(workOrder);

    // Populate sub job selector with actual sub jobs
    populateSubJobSelector(workOrderId);

    workOrderModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function openNewWorkOrderModal() {
    // For new work order, clear all fields
    clearModalData();
    document.getElementById('modalTitle').textContent = 'New Work Order';
    workOrderModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeWorkOrderModal() {
    workOrderModal.classList.remove('active');
    document.body.style.overflow = '';
}

function populateModalData(workOrder) {
    // Work order info bar
    document.getElementById('modalWorkOrderNumber').textContent = workOrder.workOrderNumber;
    document.getElementById('modalWorkOrderStatus').textContent = workOrder.status;
    document.getElementById('modalWorkOrderDate').textContent = formatDate(workOrder.workOrderDate);
    document.getElementById('modalQuotationNumber').textContent = workOrder.quotationNumber;
    document.getElementById('modalTicketNumber').textContent = workOrder.ticketNumber;
    document.getElementById('modalQuotationDate').textContent = formatDate(workOrder.quotationDate);

    // Customer details
    document.getElementById('customerName').value = workOrder.customerName;
    document.getElementById('customerMobile').value = workOrder.customerDetails.mobile;
    document.getElementById('customerEmail').value = workOrder.customerDetails.email;
    document.getElementById('customerAddress').value = workOrder.customerDetails.address;
    document.getElementById('poNumber').value = workOrder.customerDetails.poNumber;
    document.getElementById('shipTo').value = workOrder.customerDetails.shipTo;
    document.getElementById('isDropDownIn').value = workOrder.customerDetails.isDropDownIn || '';
    document.getElementById('contactPerson').value = workOrder.customerDetails.contactPerson || '';

    // Asset details
    document.getElementById('unitNumber').value = workOrder.unitNumber || '';
    document.getElementById('assetSerial').value = workOrder.serialNumber;
    document.getElementById('assetModel').value = workOrder.assetDetails.model;
    document.getElementById('assetBrand').value = workOrder.assetDetails.brand;
    document.getElementById('assetType').value = workOrder.assetDetails.assetType;
    document.getElementById('keyTag').value = workOrder.keyTag;
    document.getElementById('odometer').value = workOrder.assetDetails.odometer;
    document.getElementById('assetStatus').value = workOrder.assetDetails.assetStatus || '';
    document.getElementById('isBreakdown').checked = workOrder.assetDetails.isBreakdown;
    document.getElementById('bay').value = workOrder.bay || '';

    // Planning details
    document.getElementById('expectedArrival').value = workOrder.planningDetails.expectedArrival;
    document.getElementById('actualArrival').value = workOrder.planningDetails.actualArrival;
    document.getElementById('expectedDelivery').value = workOrder.planningDetails.expectedDelivery;
    document.getElementById('actualDelivery').value = workOrder.planningDetails.actualDelivery;
    document.getElementById('plannedStartDate').value = workOrder.plannedStartDate;
    document.getElementById('plannedEndDate').value = workOrder.plannedCompletionDate;
    document.getElementById('actualStartDate').value = workOrder.planningDetails.actualStartDate;
    document.getElementById('actualEndDate').value = workOrder.planningDetails.actualEndDate;


}

function clearModalData() {
    // Clear all form fields
    const inputs = workOrderModal.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        if (input.type === 'checkbox') {
            input.checked = false;
        } else {
            input.value = '';
        }
    });

    // Reset info bar
    document.getElementById('modalWorkOrderNumber').textContent = 'New';
    document.getElementById('modalWorkOrderStatus').textContent = 'Draft';
    document.getElementById('modalWorkOrderDate').textContent = formatDate(new Date().toISOString().split('T')[0]);
    document.getElementById('modalQuotationNumber').textContent = '';
    document.getElementById('modalTicketNumber').textContent = '';
    document.getElementById('modalQuotationDate').textContent = '';
}

// Tab switching
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Update tab panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.toggle('active', pane.id === tabName + 'Tab');
    });

    // Maximize modal width for Job Details tab
    const modalContainer = document.querySelector('.modal-container');
    if (modalContainer) {
        if (tabName === 'job') {
            modalContainer.classList.add('job-details-active');
        } else {
            modalContainer.classList.remove('job-details-active');
        }
    }
}

// Job section switching
function switchJobSection(sectionName) {
    // Update job menu buttons
    document.querySelectorAll('.job-menu-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.section === sectionName);
    });

    // Update job sections
    document.querySelectorAll('.job-section').forEach(section => {
        section.classList.toggle('active', section.id === sectionName + 'Section');
    });
}

// Checklist section switching
function switchChecklistSection(sectionName) {
    // Update checklist menu buttons
    document.querySelectorAll('.checklist-menu-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.section === sectionName);
    });

    // Update checklist sections
    document.querySelectorAll('.checklist-section').forEach(section => {
        section.classList.toggle('active', section.id === sectionName + 'Section');
    });
}

// Vehicle view switching for Walk Around
function switchVehicleView(viewName) {
    // Update view tab buttons
    document.querySelectorAll('.view-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === viewName);
    });

    // Update vehicle views
    document.querySelectorAll('.vehicle-view').forEach(view => {
        view.classList.toggle('active', view.id === viewName + 'View');
    });

    // Update view-specific data sections
    document.querySelectorAll('.view-specific-data').forEach(data => {
        data.classList.toggle('active', data.id === viewName + 'ViewData');
    });
}

// Print Walk Around functionality
function printWalkAround() {
    // Get the currently active view
    const activeViewTab = document.querySelector('.view-tab-btn.active');
    const activeView = document.querySelector('.vehicle-view.active');
    const activeViewData = document.querySelector('.view-specific-data.active');
    const vehicleInfoHeader = document.querySelector('.vehicle-info-header');
    const attachmentSection = document.querySelector('.attachment-section');

    if (!activeViewTab || !activeView || !activeViewData) {
        alert('No active view found to print');
        return;
    }

    const viewName = activeViewTab.textContent;

    // Create a new window for printing
    const printWindow = window.open('', '_blank');

    // Get vehicle info
    const vehicleInfoHTML = vehicleInfoHeader ? vehicleInfoHeader.outerHTML : '';

    // Get active view image
    const activeViewHTML = activeView.outerHTML;

    // Get active view data
    const activeViewDataHTML = activeViewData.outerHTML;

    // Get attachment section
    const attachmentHTML = attachmentSection ? attachmentSection.outerHTML : '';

    // Create print-friendly HTML
    const printHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Walk Around Checklist - ${viewName}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; color: black; }
                .vehicle-info-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding: 12px 16px;
                    border: 1px solid #ccc;
                    border-radius: 8px;
                }
                .vehicle-info-row { display: flex; gap: 24px; flex-wrap: wrap; }
                .vehicle-info-item { display: flex; gap: 6px; margin-right: 20px; }
                .info-label { font-weight: bold; }
                .info-value { color: #333; }
                .walkaround-actions { display: none !important; }
                .vehicle-view {
                    text-align: center;
                    margin: 20px 0;
                    border: 1px solid #ccc;
                    border-radius: 8px;
                    padding: 20px;
                }
                .vehicle-diagram { max-width: 100%; height: auto; }
                .diagram-placeholder { color: #666; }
                .view-specific-data {
                    margin: 20px 0;
                    padding: 16px;
                    border: 1px solid #ccc;
                    border-radius: 8px;
                }
                .pressure-row { display: flex; gap: 20px; margin-bottom: 10px; flex-wrap: wrap; }
                .pressure-item { flex: 1; min-width: 200px; margin-bottom: 10px; }
                .pressure-item label { font-weight: bold; display: block; margin-bottom: 4px; }
                .pressure-item input {
                    border: 1px solid #ccc;
                    padding: 4px 8px;
                    border-radius: 4px;
                    background: white;
                    color: black;
                }
                .observation-item { margin-top: 10px; }
                .observation-item label { font-weight: bold; display: block; margin-bottom: 4px; }
                .observation-item textarea {
                    width: 100%;
                    border: 1px solid #ccc;
                    padding: 8px;
                    border-radius: 4px;
                    background: white;
                    color: black;
                    min-height: 60px;
                }
                .attachment-section {
                    margin-top: 20px;
                    border: 1px solid #ccc;
                    border-radius: 8px;
                    overflow: hidden;
                }
                .attachment-header {
                    padding: 12px 16px;
                    background: #f5f5f5;
                    border-bottom: 1px solid #ccc;
                }
                .attachment-header h4 { margin: 0; color: black; }
                .attachment-btn { display: none !important; }
                .attachment-table { width: 100%; border-collapse: collapse; }
                .attachment-table th, .attachment-table td {
                    border: 1px solid #ccc;
                    padding: 8px;
                    text-align: left;
                    background: white;
                    color: black;
                }
                .attachment-table th { background-color: #f5f5f5; font-weight: bold; }
                h1 { text-align: center; color: black; margin-bottom: 30px; }
                @page { margin: 1in; }
            </style>
        </head>
        <body>
            <h1>Walk Around Checklist - ${viewName}</h1>
            ${vehicleInfoHTML}
            ${activeViewHTML}
            ${activeViewDataHTML}
            ${attachmentHTML}
        </body>
        </html>
    `;

    printWindow.document.write(printHTML);
    printWindow.document.close();

    // Wait for content to load then print
    printWindow.onload = function() {
        printWindow.print();
        printWindow.close();
    };
}

// Exit Walk Around functionality
function exitWalkAround() {
    // Close the modal or navigate back
    const modal = document.getElementById('workOrderModal');
    if (modal && modal.classList.contains('active')) {
        closeWorkOrderModal();
    } else {
        // If not in modal, could navigate to previous page or close tab
        if (confirm('Are you sure you want to exit the Walk Around checklist?')) {
            // You can customize this behavior based on your needs
            window.history.back();
        }
    }
}

// Add attachment functionality
function addAttachment() {
    // Create file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*,application/pdf,.doc,.docx';
    fileInput.multiple = true;

    fileInput.onchange = function(event) {
        const files = event.target.files;
        if (files.length > 0) {
            // Process each selected file
            Array.from(files).forEach(file => {
                addAttachmentToTable(file);
            });
        }
    };

    // Trigger file selection
    fileInput.click();
}

// Add attachment to table
function addAttachmentToTable(file) {
    const tableBody = document.getElementById('attachmentTableBody');

    // Remove "No Patterns To View" row if it exists
    const noDataRow = tableBody.querySelector('.no-attachments');
    if (noDataRow) {
        noDataRow.remove();
    }

    // Create new row
    const row = document.createElement('tr');
    const currentDate = new Date().toLocaleDateString();
    const currentUser = 'Current User'; // You can get this from your user system

    row.innerHTML = `
        <td>Current View</td>
        <td>${file.name}</td>
        <td>Walk Around Attachment</td>
        <td>${currentUser}</td>
        <td>${currentDate}</td>
    `;

    tableBody.appendChild(row);

    // Show success message
    console.log(`Attachment added: ${file.name}`);
}

// Work Order Action Button Functions
function openInternalRemarks() {
    // Create and show internal remarks modal/dialog
    const modal = document.createElement('div');
    modal.className = 'internal-remarks-modal';
    modal.innerHTML = `
        <div class="internal-remarks-overlay">
            <div class="internal-remarks-container">
                <div class="internal-remarks-header">
                    <h3>Internal Remarks</h3>
                    <button class="close-btn" onclick="closeInternalRemarks()">&times;</button>
                </div>
                <div class="internal-remarks-content">
                    <textarea id="internalRemarksText" placeholder="Enter internal remarks..." rows="10"></textarea>
                </div>
                <div class="internal-remarks-footer">
                    <button class="btn btn-secondary" onclick="closeInternalRemarks()">Cancel</button>
                    <button class="btn btn-primary" onclick="saveInternalRemarks()">Save</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'block';
}

function closeInternalRemarks() {
    const modal = document.querySelector('.internal-remarks-modal');
    if (modal) {
        modal.remove();
    }
}

function saveInternalRemarks() {
    const remarksText = document.getElementById('internalRemarksText').value;
    console.log('Internal Remarks saved:', remarksText);
    // Here you would typically save to your backend
    closeInternalRemarks();
    alert('Internal remarks saved successfully!');
}

function openWorkOrderValue() {
    // Create and show work order value modal/dialog
    const modal = document.createElement('div');
    modal.className = 'work-order-value-modal';
    modal.innerHTML = `
        <div class="work-order-value-overlay">
            <div class="work-order-value-container">
                <div class="work-order-value-header">
                    <h3>Work Order Value</h3>
                    <button class="close-btn" onclick="closeWorkOrderValue()">&times;</button>
                </div>
                <div class="work-order-value-content">
                    <div class="value-summary">
                        <div class="value-item">
                            <label>Parts Total:</label>
                            <span>$0.00</span>
                        </div>
                        <div class="value-item">
                            <label>Labor Total:</label>
                            <span>$0.00</span>
                        </div>
                        <div class="value-item">
                            <label>Travel Total:</label>
                            <span>$0.00</span>
                        </div>
                        <div class="value-item">
                            <label>Miscellaneous Total:</label>
                            <span>$0.00</span>
                        </div>
                        <div class="value-item total">
                            <label>Grand Total:</label>
                            <span>$0.00</span>
                        </div>
                    </div>
                </div>
                <div class="work-order-value-footer">
                    <button class="btn btn-primary" onclick="closeWorkOrderValue()">Close</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'block';
}

function closeWorkOrderValue() {
    const modal = document.querySelector('.work-order-value-modal');
    if (modal) {
        modal.remove();
    }
}

function editWorkOrder() {
    // Enable editing mode for the work order
    console.log('Edit Work Order clicked');

    // Enable form fields
    const formInputs = document.querySelectorAll('#workOrderModal input, #workOrderModal select, #workOrderModal textarea');
    formInputs.forEach(input => {
        if (!input.hasAttribute('readonly')) {
            input.disabled = false;
        }
    });

    // Show save/cancel buttons in modal footer
    const modalFooter = document.querySelector('.modal-footer');
    if (modalFooter) {
        modalFooter.style.display = 'flex';
    }

    alert('Work Order is now in edit mode. Make your changes and click Save Changes.');
}

function exitWorkOrder() {
    // Close the work order modal
    const modal = document.getElementById('workOrderModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function printWorkOrder() {
    // Print the entire work order
    const modal = document.getElementById('workOrderModal');
    const modalContent = modal.querySelector('.modal-content');

    if (modalContent) {
        const printWindow = window.open('', '_blank');

        const printHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Work Order Details - Print</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; color: black; }
                    .work-order-info-bar {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 20px;
                        margin-bottom: 20px;
                        padding: 16px;
                        border: 1px solid #ccc;
                        border-radius: 8px;
                    }
                    .info-item { display: flex; gap: 8px; }
                    .info-item label { font-weight: bold; }
                    .work-order-actions { display: none !important; }
                    .tab-navigation { display: none !important; }
                    .tab-pane { display: block !important; }
                    .form-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px; }
                    .form-group { display: flex; flex-direction: column; gap: 4px; }
                    .form-group label { font-weight: bold; }
                    .form-group input, .form-group select, .form-group textarea {
                        border: 1px solid #ccc;
                        padding: 8px;
                        border-radius: 4px;
                        background: white;
                        color: black;
                    }
                    h2, h3 { color: black; margin-top: 30px; margin-bottom: 15px; }
                    .status-badge {
                        padding: 4px 8px;
                        border-radius: 4px;
                        background: #f0f0f0;
                        color: black;
                        border: 1px solid #ccc;
                    }
                    @page { margin: 1in; }
                    @media print {
                        .modal-close { display: none !important; }
                        .modal-footer { display: none !important; }
                    }
                </style>
            </head>
            <body>
                <h1>Work Order Details</h1>
                ${modalContent.innerHTML}
            </body>
            </html>
        `;

        printWindow.document.write(printHTML);
        printWindow.document.close();

        printWindow.onload = function() {
            printWindow.print();
            printWindow.close();
        };
    } else {
        alert('Work Order content not found');
    }
}

// Fuel Gauge Functions
function updateFuelGauge(gaugeNumber, value) {
    // Update the displayed percentage value
    const fuelValueElement = document.getElementById(`fuelValue${gaugeNumber}`);
    if (fuelValueElement) {
        fuelValueElement.textContent = `${value}%`;
    }

    // Update the needle rotation if using placeholder gauge
    const needleElement = document.getElementById(`fuelGauge${gaugeNumber}Needle`);
    if (needleElement) {
        // Convert percentage to rotation angle (0% = -90deg, 100% = 90deg)
        const rotation = (value / 100) * 180 - 90;
        needleElement.style.transform = `translate(-50%, -100%) rotate(${rotation}deg)`;
    }

    console.log(`Fuel Gauge ${gaugeNumber} updated to ${value}%`);
}

// Populate sub job selector with actual sub jobs
function populateSubJobSelector(workOrderId) {
    const workOrder = findWorkOrderById(workOrderId);
    const subJobSelector = document.getElementById('subJobSelector');

    if (!subJobSelector) return;

    // Clear existing options
    subJobSelector.innerHTML = '<option value="">-- Select Job --</option>';

    // Find the parent work order (in case workOrderId is a sub job)
    let parentWorkOrder = workOrder;
    if (!workOrder.hasSubJobs) {
        // This might be a sub job, find its parent
        for (const wo of workOrdersData) {
            if (wo.hasSubJobs && wo.subJobs) {
                const foundSubJob = wo.subJobs.find(sj => sj.id === workOrderId);
                if (foundSubJob) {
                    parentWorkOrder = wo;
                    break;
                }
            }
        }
    }

    // Add sub jobs to selector if they exist
    if (parentWorkOrder.hasSubJobs && parentWorkOrder.subJobs && parentWorkOrder.subJobs.length > 0) {
        parentWorkOrder.subJobs.forEach((subJob, index) => {
            const option = document.createElement('option');
            option.value = subJob.id;
            option.textContent = `Sub Job ${index + 1} - ${subJob.workOrderNumber}`;
            subJobSelector.appendChild(option);
        });

        // If current work order is a sub job, select it
        if (!workOrder.hasSubJobs) {
            subJobSelector.value = workOrderId;
            // Trigger the change event to show job details
            switchSubJob(workOrderId);
        } else {
            // Select first sub job by default
            subJobSelector.value = parentWorkOrder.subJobs[0].id;
            switchSubJob(parentWorkOrder.subJobs[0].id);
        }
    } else {
        // No sub jobs - this is a single main job
        // Add the main job as the only option
        const option = document.createElement('option');
        option.value = workOrder.id;
        option.textContent = `J1 - ${workOrder.workOrderNumber} (Main Job)`;
        subJobSelector.appendChild(option);
        subJobSelector.value = workOrder.id;

        // Show job details for the main job
        switchSubJob(workOrder.id);
    }
}

// Sub job switching
function switchSubJob(subJobId) {
    console.log('switchSubJob called with ID:', subJobId);

    // Only proceed if a job is selected
    if (!subJobId) {
        console.log('No job ID provided, hiding job details');
        // Hide job details if no job selected
        document.querySelector('.job-details-container').style.display = 'none';
        return;
    }

    // Get the selected job data
    const selectedJob = findWorkOrderById(subJobId);
    if (!selectedJob) {
        console.error('Job not found:', subJobId);
        return;
    }

    // Show job details container
    document.querySelector('.job-details-container').style.display = 'flex';

    // Determine job number
    let jobNumber = '1';

    // Check if this is a sub job by looking at the dropdown selector
    const subJobSelector = document.getElementById('subJobSelector');
    if (subJobSelector) {
        const selectedOption = subJobSelector.options[subJobSelector.selectedIndex];
        console.log('Selected option text:', selectedOption ? selectedOption.textContent : 'none');

        if (selectedOption && selectedOption.textContent.includes('Sub Job')) {
            // Extract job number from option text (e.g., "Sub Job 2 - WO/177N/2/2025 - 1-02" -> "2")
            const match = selectedOption.textContent.match(/Sub Job (\d+)/);
            console.log('Sub job match:', match);
            if (match) {
                jobNumber = match[1];
            }
        } else {
            // This is a main job
            jobNumber = '1';
        }
    }

    console.log('Determined job number:', jobNumber, 'for job ID:', subJobId);

    // Update ALL UI elements to reflect the selected job number
    updateAllJobReferences(jobNumber);

    // Update job-specific content based on job number
    updateJobContent(selectedJob, jobNumber);
}

// Update all job references throughout the UI
function updateAllJobReferences(jobNumber) {
    console.log('Updating all job references to J' + jobNumber);

    // Update the header section title
    const headerTitle = document.querySelector('#headerSection h3');
    if (headerTitle) {
        headerTitle.textContent = `J${jobNumber}-Header`;
    }

    // Update all menu button texts to reflect the job number
    const menuButtons = document.querySelectorAll('.job-menu-btn');
    menuButtons.forEach(btn => {
        const section = btn.dataset.section;
        switch(section) {
            case 'header':
                btn.textContent = `J${jobNumber}-Header`;
                break;
            case 'suggested':
                btn.textContent = `J${jobNumber}-Part Suggested List`;
                break;
            case 'parts':
                btn.textContent = `J${jobNumber}-Parts`;
                break;
            case 'labor':
                btn.textContent = `J${jobNumber}-Labor and Misc. Details`;
                break;
            case 'travel':
                btn.textContent = `J${jobNumber}-Travel`;
                break;
            case 'attachments':
                btn.textContent = `J${jobNumber}-Attachments`;
                break;
            case 'summary':
                btn.textContent = `J${jobNumber}-Summary`;
                break;
            case 'causing':
                btn.textContent = `J${jobNumber}-Causing Part`;
                break;
            case 'activity':
                btn.textContent = 'Job Card Activity';
                break;
            case 'progress':
                btn.textContent = 'Case Progress';
                break;
            case 'legend':
                btn.textContent = 'Job Card Status Legend';
                break;
        }
    });

    // Update all section titles
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
            case 'activitySection':
                title.textContent = 'Job Card Activity';
                break;
            case 'progressSection':
                title.textContent = 'Case Progress';
                break;
            case 'legendSection':
                title.textContent = 'Job Card Status Legend';
                break;
        }
    });

    // Update table headers and content that contain job references
    updateTableJobReferences(jobNumber);

    // Update any other elements that might contain job references
    updateMiscJobReferences(jobNumber);

    console.log(`All UI elements updated to J${jobNumber}`);
}

// Update table headers and content with job references
function updateTableJobReferences(jobNumber) {
    // Update labor table operation codes to reflect job number
    const laborTableRows = document.querySelectorAll('.labor-table tbody tr');
    laborTableRows.forEach((row, index) => {
        const operationCodeCell = row.querySelector('td:nth-child(2)');
        if (operationCodeCell && !operationCodeCell.textContent.includes('No data')) {
            // Update operation codes to include job number
            const originalCode = operationCodeCell.textContent.replace(/J\d+-/, '');
            operationCodeCell.textContent = `J${jobNumber}-${originalCode}`;
        }
    });

    // Update parts table references
    const partsTableRows = document.querySelectorAll('.parts-table tbody tr');
    partsTableRows.forEach((row, index) => {
        const partPrefixCell = row.querySelector('td:nth-child(2)');
        if (partPrefixCell && !partPrefixCell.textContent.includes('No data')) {
            // Update part prefixes to include job number
            const originalPrefix = partPrefixCell.textContent.replace(/J\d+-/, '');
            partPrefixCell.textContent = `J${jobNumber}-${originalPrefix}`;
        }
    });
}

// Update miscellaneous job references
function updateMiscJobReferences(jobNumber) {
    // Update any spans or divs that might contain job references
    const jobRefElements = document.querySelectorAll('[data-job-ref]');
    jobRefElements.forEach(element => {
        const originalText = element.getAttribute('data-original-text') || element.textContent;
        if (!element.getAttribute('data-original-text')) {
            element.setAttribute('data-original-text', originalText);
        }
        element.textContent = originalText.replace(/J\d+/g, `J${jobNumber}`);
    });

    // Update quotation reference to include job number
    const quotationRefField = document.getElementById('quotationRef');
    if (quotationRefField) {
        const baseRef = quotationRefField.value.replace(/ - \d+$/, '');
        quotationRefField.value = `${baseRef} - ${jobNumber}`;
    }
}

// Update job content based on selected job
function updateJobContent(selectedJob, jobNumber) {
    console.log('Updating job content for job number:', jobNumber);

    // Update job number in the header form
    const jobNumberField = document.getElementById('jobNumber');
    if (jobNumberField) {
        jobNumberField.value = selectedJob.workOrderNumber;
    }

    // Update quotation ref field with job-specific reference
    const quotationRefField = document.getElementById('quotationRef');
    if (quotationRefField) {
        quotationRefField.value = selectedJob.quotationRef || `QO/177N/2/2025 - ${jobNumber}`;
    }

    // Update job date field
    const jobDateField = document.getElementById('jobDate');
    if (jobDateField) {
        jobDateField.value = selectedJob.jobDate || '24-Mar-2025';
    }

    // Update job status field
    const jobStatusField = document.getElementById('jobStatus');
    if (jobStatusField) {
        // Different status for different jobs
        const jobStatuses = {
            '1': 'Moved to Tech',
            '2': 'In Progress',
            '3': 'Pending Parts',
            '4': 'Quality Check'
        };
        jobStatusField.value = jobStatuses[jobNumber] || 'Moved to Tech';
    }

    // Update service type based on job
    const serviceTypeField = document.getElementById('serviceTypeJob');
    if (serviceTypeField) {
        const serviceTypes = {
            '1': 'customer-paid',
            '2': 'warranty',
            '3': 'maintenance',
            '4': 'inspection'
        };
        serviceTypeField.value = serviceTypes[jobNumber] || 'customer-paid';
    }

    // Update charged to field
    const chargedToField = document.getElementById('chargedTo');
    if (chargedToField) {
        const chargedToOptions = {
            '1': 'customer',
            '2': 'warranty',
            '3': 'customer',
            '4': 'internal'
        };
        chargedToField.value = chargedToOptions[jobNumber] || 'customer';
    }

    // Update test drive distance
    const testDriveField = document.getElementById('testDriveDistance');
    if (testDriveField) {
        const distances = {
            '1': '5',
            '2': '10',
            '3': '15',
            '4': '20'
        };
        testDriveField.value = distances[jobNumber] || '5';
    }

    // Update customer complaint field (correct ID)
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

    // Update cause of failure field
    const causeOfFailureField = document.getElementById('causeOfFailure');
    if (causeOfFailureField) {
        const causes = {
            '1': 'Worn engine mount causing vibration',
            '2': 'Low refrigerant level in AC system',
            '3': 'Air in brake lines affecting pedal feel',
            '4': 'Transmission fluid needs replacement'
        };
        causeOfFailureField.value = causes[jobNumber] || 'Enter cause of failure';
    }

    // Update corrective action field
    const correctiveActionField = document.getElementById('correctiveAction');
    if (correctiveActionField) {
        const actions = {
            '1': 'Replace engine mount and test drive',
            '2': 'Recharge AC system and check for leaks',
            '3': 'Bleed brake system and test pedal feel',
            '4': 'Replace transmission fluid and filter'
        };
        correctiveActionField.value = actions[jobNumber] || 'Enter corrective action taken';
    }

    // Update action for next service field (correct ID)
    const nextServiceField = document.getElementById('actionNextService');
    if (nextServiceField) {
        const nextActions = {
            '1': 'Monitor engine mount condition during next service',
            '2': 'Check AC system performance in 6 months',
            '3': 'Inspect brake system during next maintenance',
            '4': 'Schedule transmission service in 30,000 miles'
        };
        nextServiceField.value = nextActions[jobNumber] || 'Enter action for next service';
    }

    console.log(`Job content updated for J${jobNumber}`);
}

// Save work order
function saveWorkOrder() {
    // In a real application, this would send data to the server
    console.log('Saving work order...');

    // Show success message (you could implement a toast notification)
    alert('Work order saved successfully!');

    closeWorkOrderModal();
}

// Utility functions
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

function truncateText(text, maxLength = 20) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function safeGet(obj, path, defaultValue = '') {
    return path.split('.').reduce((current, key) => current && current[key] !== undefined ? current[key] : defaultValue, obj);
}

// Add CSS for work order links
const style = document.createElement('style');
style.textContent = `
    .work-order-link {
        color: var(--accent-color);
        text-decoration: none;
        font-weight: 500;
    }

    .work-order-link:hover {
        text-decoration: underline;
    }
`;
document.head.appendChild(style);
