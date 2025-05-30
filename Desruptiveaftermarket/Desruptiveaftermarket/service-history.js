/**
 * Service History Management System
 * Comprehensive service tracking and management functionality
 */

// Global variables
let allServiceRecords = [];
let filteredServiceRecords = [];
let allCustomers = [];
let allEquipment = [];

// DOM elements
let serviceTableBody;
let serviceSearch;
let statusFilter;
let typeFilter;
let completedServices;
let scheduledServices;
let totalCost;
let totalHours;
let emptyState;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Service History page initializing...');
    initializeElements();
    setupEventListeners();
    loadServiceData();
});

// Initialize DOM elements
function initializeElements() {
    serviceTableBody = document.getElementById('serviceTableBody');
    serviceSearch = document.getElementById('serviceSearch');
    statusFilter = document.getElementById('statusFilter');
    typeFilter = document.getElementById('typeFilter');
    completedServices = document.getElementById('completedServices');
    scheduledServices = document.getElementById('scheduledServices');
    totalCost = document.getElementById('totalCost');
    totalHours = document.getElementById('totalHours');
    emptyState = document.getElementById('emptyState');
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    serviceSearch.addEventListener('input', handleSearch);

    // Filter functionality
    statusFilter.addEventListener('change', applyFilters);
    typeFilter.addEventListener('change', applyFilters);

    // Button functionality
    document.getElementById('addServiceBtn').addEventListener('click', showAddServiceModal);
    document.getElementById('exportBtn').addEventListener('click', exportServiceData);
    document.getElementById('refreshBtn').addEventListener('click', refreshData);
}

// Load service data
function loadServiceData() {
    console.log('Loading service data...');

    try {
        // Load service records
        allServiceRecords = DataService.getServiceHistory() || [];

        // Load customers and equipment for reference
        allCustomers = DataService.getParties() || [];
        allEquipment = DataService.getCustomerEquipment() || [];

        // Enhance service records with customer and equipment details
        enhanceServiceRecords();

        // Apply initial filters
        applyFilters();

        console.log(`Loaded ${allServiceRecords.length} service records`);
    } catch (error) {
        console.error('Error loading service data:', error);
        showError('Failed to load service data');
    }
}

// Enhance service records with additional details
function enhanceServiceRecords() {
    allServiceRecords = allServiceRecords.map(service => {
        // Find customer details
        const customer = allCustomers.find(c => c.id === service.customerId);
        service.customerName = customer ? customer.name : 'Unknown Customer';

        // Find equipment details
        const equipment = allEquipment.find(e => e.id === service.equipmentId);
        service.equipmentName = equipment ? `${equipment.manufacturer} ${equipment.model}` : 'Unknown Equipment';
        service.equipmentSerial = equipment ? equipment.serialNumber : 'N/A';

        return service;
    });
}

// Handle search functionality
function handleSearch() {
    const searchTerm = serviceSearch.value.toLowerCase().trim();
    console.log('Searching for:', searchTerm);
    applyFilters();
}

// Apply filters to service records
function applyFilters() {
    const searchTerm = serviceSearch.value.toLowerCase().trim();
    const statusValue = statusFilter.value;
    const typeValue = typeFilter.value;

    filteredServiceRecords = allServiceRecords.filter(service => {
        // Search filter
        const matchesSearch = !searchTerm ||
            service.id.toLowerCase().includes(searchTerm) ||
            service.customerName.toLowerCase().includes(searchTerm) ||
            service.equipmentName.toLowerCase().includes(searchTerm) ||
            service.technician.toLowerCase().includes(searchTerm) ||
            service.description.toLowerCase().includes(searchTerm) ||
            service.serviceType.toLowerCase().includes(searchTerm);

        // Status filter
        const matchesStatus = !statusValue || service.status === statusValue;

        // Type filter
        const matchesType = !typeValue || service.serviceType === typeValue;

        return matchesSearch && matchesStatus && matchesType;
    });

    // Sort by date (most recent first)
    filteredServiceRecords.sort((a, b) => new Date(b.serviceDate) - new Date(a.serviceDate));

    updateStatistics();
    renderServiceTable();
}

// Update statistics
function updateStatistics() {
    const completed = filteredServiceRecords.filter(s => s.status === 'Completed').length;
    const scheduled = filteredServiceRecords.filter(s => s.status === 'Scheduled').length;
    const cost = filteredServiceRecords.reduce((sum, s) => sum + (s.cost || 0), 0);
    const hours = filteredServiceRecords.reduce((sum, s) => sum + (s.laborHours || 0), 0);

    completedServices.textContent = completed;
    scheduledServices.textContent = scheduled;
    totalCost.textContent = `$${cost.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    totalHours.textContent = hours.toFixed(1);
}

// Render service table
function renderServiceTable() {
    serviceTableBody.innerHTML = '';

    if (filteredServiceRecords.length === 0) {
        emptyState.style.display = 'block';
        document.querySelector('.service-table-container').style.display = 'none';
        return;
    }

    emptyState.style.display = 'none';
    document.querySelector('.service-table-container').style.display = 'block';

    filteredServiceRecords.forEach(service => {
        const row = createServiceRow(service);
        serviceTableBody.appendChild(row);
    });
}

// Create service table row
function createServiceRow(service) {
    const row = document.createElement('tr');

    const statusClass = getStatusClass(service.status);
    const formattedDate = formatDate(service.serviceDate);
    const formattedCost = service.cost ? `$${service.cost.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : 'N/A';
    const formattedHours = service.laborHours ? `${service.laborHours}h` : 'N/A';

    row.innerHTML = `
        <td>
            <div style="font-weight: 500; color: var(--primary-color);">${service.id}</div>
        </td>
        <td>
            <div style="font-weight: 500;">${formattedDate}</div>
            ${service.nextServiceDue ? `<div style="font-size: 12px; color: var(--accent-color);">Next: ${formatDate(service.nextServiceDue)}</div>` : ''}
        </td>
        <td>
            <div style="font-weight: 500;">${service.equipmentName}</div>
            <div style="font-size: 12px; color: var(--accent-color);">SN: ${service.equipmentSerial}</div>
        </td>
        <td>
            <div style="font-weight: 500;">${service.customerName}</div>
        </td>
        <td>
            <span class="service-type-badge">${service.serviceType}</span>
        </td>
        <td>
            <div style="font-weight: 500;">${service.technician}</div>
        </td>
        <td>
            <span class="status-badge ${statusClass}">${service.status}</span>
        </td>
        <td>
            <div style="font-weight: 500;">${formattedCost}</div>
        </td>
        <td>
            <div style="font-weight: 500;">${formattedHours}</div>
        </td>
        <td>
            <div style="display: flex; gap: 4px;">
                <button class="table-action-btn" onclick="viewServiceDetails('${service.id}')" title="View Details">
                    <i class="material-icons">visibility</i>
                </button>
                <button class="table-action-btn" onclick="editService('${service.id}')" title="Edit Service">
                    <i class="material-icons">edit</i>
                </button>
                <button class="table-action-btn" onclick="duplicateService('${service.id}')" title="Duplicate Service">
                    <i class="material-icons">content_copy</i>
                </button>
                <button class="table-action-btn" onclick="deleteService('${service.id}')" title="Delete Service">
                    <i class="material-icons">delete</i>
                </button>
            </div>
        </td>
    `;

    return row;
}

// Get status CSS class
function getStatusClass(status) {
    switch (status) {
        case 'Completed':
            return 'status-completed';
        case 'In Progress':
            return 'status-in-progress';
        case 'Scheduled':
            return 'status-scheduled';
        case 'Cancelled':
            return 'status-cancelled';
        default:
            return 'status-completed';
    }
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Show error message
function showError(message) {
    console.error(message);
    showNotification(message, 'error');
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${type === 'error' ? 'var(--error-color)' : type === 'success' ? 'var(--success-color)' : 'var(--info-color)'};
        color: white;
        padding: 12px 20px;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;

    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Action functions
function viewServiceDetails(serviceId) {
    const service = allServiceRecords.find(s => s.id === serviceId);
    if (service) {
        showServiceDetailsModal(service);
    }
}

function editService(serviceId) {
    const service = allServiceRecords.find(s => s.id === serviceId);
    if (service) {
        showEditServiceModal(service);
    }
}

function duplicateService(serviceId) {
    const service = allServiceRecords.find(s => s.id === serviceId);
    if (service) {
        showDuplicateServiceModal(service);
    }
}

function deleteService(serviceId) {
    if (confirm('Are you sure you want to delete this service record?')) {
        // In a real application, this would call the API
        showNotification('Service record deleted successfully', 'success');
        loadServiceData(); // Refresh data
    }
}

function showAddServiceModal() {
    showNotification('Add Service functionality would open here', 'info');
}

function exportServiceData() {
    showNotification('Exporting service data...', 'info');
    // In a real application, this would generate and download a file
}

function refreshData() {
    showNotification('Refreshing service data...', 'info');
    loadServiceData();
}

// Modal functions
function showServiceDetailsModal(service) {
    const modal = createModal('Service Details', createServiceDetailsContent(service));
    document.body.appendChild(modal);
}

function showEditServiceModal(service) {
    const modal = createModal('Edit Service', createServiceFormContent(service));
    document.body.appendChild(modal);
}

function showDuplicateServiceModal(service) {
    const duplicatedService = { ...service };
    delete duplicatedService.id;
    duplicatedService.serviceDate = new Date().toISOString().split('T')[0];
    duplicatedService.status = 'Scheduled';

    const modal = createModal('Duplicate Service', createServiceFormContent(duplicatedService));
    document.body.appendChild(modal);
}

function showAddServiceModal() {
    const newService = {
        serviceDate: new Date().toISOString().split('T')[0],
        serviceType: 'Preventive Maintenance',
        status: 'Scheduled',
        priority: 'Normal',
        location: 'Customer Site'
    };

    const modal = createModal('Add New Service', createServiceFormContent(newService));
    document.body.appendChild(modal);
}

// Create modal element
function createModal(title, content) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background-color: white;
        border-radius: var(--border-radius);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        max-width: 800px;
        max-height: 90vh;
        width: 90%;
        overflow-y: auto;
        animation: slideIn 0.3s ease;
    `;

    const modalHeader = document.createElement('div');
    modalHeader.style.cssText = `
        padding: 20px;
        border-bottom: 1px solid var(--border-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;

    modalHeader.innerHTML = `
        <h2 style="margin: 0; font-size: 18px; font-weight: 500;">${title}</h2>
        <button onclick="this.closest('.modal').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: var(--accent-color);">
            <i class="material-icons">close</i>
        </button>
    `;

    const modalBody = document.createElement('div');
    modalBody.style.cssText = `padding: 20px;`;
    modalBody.innerHTML = content;

    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modal.appendChild(modalContent);
    modal.className = 'modal';

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    return modal;
}

// Create service details content
function createServiceDetailsContent(service) {
    const partsUsedList = service.partsUsed && service.partsUsed.length > 0
        ? service.partsUsed.map(part => `<li>${part}</li>`).join('')
        : '<li>No parts used</li>';

    return `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
                <h3 style="margin-bottom: 16px; color: var(--primary-color);">Service Information</h3>
                <div style="margin-bottom: 12px;">
                    <strong>Service ID:</strong> ${service.id}
                </div>
                <div style="margin-bottom: 12px;">
                    <strong>Work Order:</strong> ${service.workOrderNumber || 'N/A'}
                </div>
                <div style="margin-bottom: 12px;">
                    <strong>Date:</strong> ${formatDate(service.serviceDate)}
                </div>
                <div style="margin-bottom: 12px;">
                    <strong>Type:</strong> <span class="service-type-badge">${service.serviceType}</span>
                </div>
                <div style="margin-bottom: 12px;">
                    <strong>Status:</strong> <span class="status-badge ${getStatusClass(service.status)}">${service.status}</span>
                </div>
                <div style="margin-bottom: 12px;">
                    <strong>Priority:</strong> ${service.priority || 'Normal'}
                </div>
                <div style="margin-bottom: 12px;">
                    <strong>Location:</strong> ${service.location || 'N/A'}
                </div>
            </div>
            <div>
                <h3 style="margin-bottom: 16px; color: var(--primary-color);">Customer & Equipment</h3>
                <div style="margin-bottom: 12px;">
                    <strong>Customer:</strong> ${service.customerName}
                </div>
                <div style="margin-bottom: 12px;">
                    <strong>Equipment:</strong> ${service.equipmentName}
                </div>
                <div style="margin-bottom: 12px;">
                    <strong>Serial Number:</strong> ${service.equipmentSerial}
                </div>
                <div style="margin-bottom: 12px;">
                    <strong>Technician:</strong> ${service.technician}
                </div>
                <div style="margin-bottom: 12px;">
                    <strong>Labor Hours:</strong> ${service.laborHours || 0}h
                </div>
                <div style="margin-bottom: 12px;">
                    <strong>Cost:</strong> $${(service.cost || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                ${service.nextServiceDue ? `<div style="margin-bottom: 12px;"><strong>Next Service Due:</strong> ${formatDate(service.nextServiceDue)}</div>` : ''}
            </div>
        </div>
        <div style="margin-top: 20px;">
            <h3 style="margin-bottom: 16px; color: var(--primary-color);">Description</h3>
            <p style="background-color: var(--secondary-color); padding: 16px; border-radius: var(--border-radius); margin-bottom: 20px;">
                ${service.description}
            </p>
        </div>
        <div>
            <h3 style="margin-bottom: 16px; color: var(--primary-color);">Parts Used</h3>
            <ul style="background-color: var(--secondary-color); padding: 16px; border-radius: var(--border-radius); margin: 0;">
                ${partsUsedList}
            </ul>
        </div>
        <div style="margin-top: 20px; text-align: right;">
            <button onclick="editService('${service.id}'); this.closest('.modal').remove();" class="action-btn" style="margin-right: 8px;">
                <i class="material-icons">edit</i>
                Edit Service
            </button>
            <button onclick="this.closest('.modal').remove();" class="action-btn secondary">
                Close
            </button>
        </div>
    `;
}

// Create service form content
function createServiceFormContent(service) {
    const isEdit = !!service.id;
    const customers = allCustomers.map(c => `<option value="${c.id}" ${service.customerId === c.id ? 'selected' : ''}>${c.name}</option>`).join('');
    const equipment = allEquipment.map(e => `<option value="${e.id}" ${service.equipmentId === e.id ? 'selected' : ''}>${e.manufacturer} ${e.model}</option>`).join('');

    return `
        <form id="serviceForm" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
                <h3 style="margin-bottom: 16px; color: var(--primary-color);">Service Information</h3>
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 4px; font-weight: 500;">Service Date *</label>
                    <input type="date" name="serviceDate" value="${service.serviceDate || ''}" required style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: var(--border-radius);">
                </div>
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 4px; font-weight: 500;">Service Type *</label>
                    <select name="serviceType" required style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: var(--border-radius);">
                        <option value="Preventive Maintenance" ${service.serviceType === 'Preventive Maintenance' ? 'selected' : ''}>Preventive Maintenance</option>
                        <option value="Repair" ${service.serviceType === 'Repair' ? 'selected' : ''}>Repair</option>
                        <option value="Emergency" ${service.serviceType === 'Emergency' ? 'selected' : ''}>Emergency</option>
                        <option value="Inspection" ${service.serviceType === 'Inspection' ? 'selected' : ''}>Inspection</option>
                    </select>
                </div>
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 4px; font-weight: 500;">Status *</label>
                    <select name="status" required style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: var(--border-radius);">
                        <option value="Scheduled" ${service.status === 'Scheduled' ? 'selected' : ''}>Scheduled</option>
                        <option value="In Progress" ${service.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                        <option value="Completed" ${service.status === 'Completed' ? 'selected' : ''}>Completed</option>
                        <option value="Cancelled" ${service.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </div>
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 4px; font-weight: 500;">Technician *</label>
                    <input type="text" name="technician" value="${service.technician || ''}" required style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: var(--border-radius);">
                </div>
            </div>
            <div>
                <h3 style="margin-bottom: 16px; color: var(--primary-color);">Customer & Equipment</h3>
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 4px; font-weight: 500;">Customer *</label>
                    <select name="customerId" required style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: var(--border-radius);">
                        <option value="">Select Customer</option>
                        ${customers}
                    </select>
                </div>
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 4px; font-weight: 500;">Equipment *</label>
                    <select name="equipmentId" required style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: var(--border-radius);">
                        <option value="">Select Equipment</option>
                        ${equipment}
                    </select>
                </div>
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 4px; font-weight: 500;">Labor Hours</label>
                    <input type="number" name="laborHours" value="${service.laborHours || ''}" step="0.5" min="0" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: var(--border-radius);">
                </div>
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 4px; font-weight: 500;">Cost</label>
                    <input type="number" name="cost" value="${service.cost || ''}" step="0.01" min="0" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: var(--border-radius);">
                </div>
            </div>
            <div style="grid-column: 1 / -1;">
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 4px; font-weight: 500;">Description *</label>
                    <textarea name="description" required rows="3" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: var(--border-radius); resize: vertical;">${service.description || ''}</textarea>
                </div>
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 4px; font-weight: 500;">Next Service Due</label>
                    <input type="date" name="nextServiceDue" value="${service.nextServiceDue || ''}" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: var(--border-radius);">
                </div>
            </div>
        </form>
        <div style="margin-top: 20px; text-align: right; border-top: 1px solid var(--border-color); padding-top: 20px;">
            <button onclick="this.closest('.modal').remove();" class="action-btn" style="background-color: var(--accent-color); margin-right: 8px;">
                Cancel
            </button>
            <button onclick="saveService('${service.id || ''}'); this.closest('.modal').remove();" class="action-btn">
                <i class="material-icons">save</i>
                ${isEdit ? 'Update' : 'Create'} Service
            </button>
        </div>
    `;
}

// Save service functionality
function saveService(serviceId) {
    const form = document.getElementById('serviceForm');
    const formData = new FormData(form);

    const serviceData = {
        serviceDate: formData.get('serviceDate'),
        serviceType: formData.get('serviceType'),
        status: formData.get('status'),
        technician: formData.get('technician'),
        customerId: formData.get('customerId'),
        equipmentId: formData.get('equipmentId'),
        laborHours: parseFloat(formData.get('laborHours')) || 0,
        cost: parseFloat(formData.get('cost')) || 0,
        description: formData.get('description'),
        nextServiceDue: formData.get('nextServiceDue') || null,
        priority: 'Normal',
        location: 'Customer Site',
        workOrderNumber: `WO-${new Date().getFullYear()}-${new Date().getMonth().toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}`
    };

    try {
        if (serviceId) {
            // Update existing service
            DataService.updateServiceRecord(serviceId, serviceData);
            showNotification('Service updated successfully', 'success');
        } else {
            // Create new service
            DataService.addServiceRecord(serviceData);
            showNotification('Service created successfully', 'success');
        }

        // Refresh the data
        loadServiceData();
    } catch (error) {
        console.error('Error saving service:', error);
        showNotification('Error saving service', 'error');
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    .modal {
        animation: fadeIn 0.3s ease;
    }

    .modal > div {
        animation: slideIn 0.3s ease;
    }
`;
document.head.appendChild(style);

// Back button functionality
function goBack() {
    if (typeof NavigationUtils !== 'undefined') {
        NavigationUtils.goBackToPartyDetails();
    } else {
        window.location.href = 'party-details-advanced.html';
    }
}
