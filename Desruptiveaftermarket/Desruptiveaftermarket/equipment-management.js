/**
 * Equipment Management JavaScript
 * 
 * This file provides the functionality for the Equipment Management page,
 * displaying customer equipment with warranty tracking and service history.
 */

// Global variables
let currentCustomerId = null;
let allEquipment = [];
let filteredEquipment = [];

// DOM elements
let equipmentGrid;
let emptyState;
let equipmentSearch;
let statusFilter;
let addEquipmentBtn;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    setupEventListeners();
    loadEquipmentData();
});

// Initialize DOM elements
function initializeElements() {
    equipmentGrid = document.getElementById('equipmentGrid');
    emptyState = document.getElementById('emptyState');
    equipmentSearch = document.getElementById('equipmentSearch');
    statusFilter = document.getElementById('statusFilter');
    addEquipmentBtn = document.getElementById('addEquipmentBtn');
}

// Setup event listeners
function setupEventListeners() {
    // Search input
    equipmentSearch.addEventListener('input', function() {
        filterEquipment();
    });

    // Status filter
    statusFilter.addEventListener('change', function() {
        filterEquipment();
    });

    // Add equipment button
    addEquipmentBtn.addEventListener('click', function() {
        addNewEquipment();
    });
}

// Load equipment data
function loadEquipmentData() {
    // Get customer ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    currentCustomerId = urlParams.get('customerId');

    if (currentCustomerId) {
        // Load equipment for specific customer
        allEquipment = DataService.getCustomerEquipment(currentCustomerId);
        
        // Update page title
        const customer = DataService.getParties().find(p => p.id === currentCustomerId);
        if (customer) {
            document.querySelector('.app-title').textContent = `Equipment - ${customer.name}`;
        }
    } else {
        // Load all equipment
        allEquipment = DataService.getCustomerEquipment();
        document.querySelector('.app-title').textContent = 'All Equipment';
    }

    filteredEquipment = [...allEquipment];
    renderEquipment();
}

// Filter equipment based on search and status
function filterEquipment() {
    const searchTerm = equipmentSearch.value.toLowerCase();
    const statusValue = statusFilter.value;

    filteredEquipment = allEquipment.filter(equipment => {
        // Search filter
        const matchesSearch = !searchTerm || 
            equipment.manufacturer.toLowerCase().includes(searchTerm) ||
            equipment.model.toLowerCase().includes(searchTerm) ||
            equipment.serialNumber.toLowerCase().includes(searchTerm) ||
            equipment.location.toLowerCase().includes(searchTerm) ||
            equipment.equipmentType.toLowerCase().includes(searchTerm);

        // Status filter
        const matchesStatus = !statusValue || equipment.status === statusValue;

        return matchesSearch && matchesStatus;
    });

    renderEquipment();
}

// Render equipment cards
function renderEquipment() {
    equipmentGrid.innerHTML = '';

    if (filteredEquipment.length === 0) {
        equipmentGrid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    equipmentGrid.style.display = 'grid';
    emptyState.style.display = 'none';

    filteredEquipment.forEach(equipment => {
        const equipmentCard = createEquipmentCard(equipment);
        equipmentGrid.appendChild(equipmentCard);
    });
}

// Create equipment card
function createEquipmentCard(equipment) {
    const card = document.createElement('div');
    card.className = 'equipment-card';

    // Get warranty status
    const warranty = DataService.validateWarranty(equipment.id);
    const warrantyStatus = getWarrantyStatus(warranty);

    // Calculate next service due
    const nextServiceDue = equipment.nextServiceDue ? 
        new Date(equipment.nextServiceDue).toLocaleDateString() : 'Not scheduled';

    card.innerHTML = `
        <div class="equipment-header">
            <div class="equipment-title">${equipment.manufacturer} ${equipment.model}</div>
            <div class="equipment-subtitle">${equipment.equipmentType}</div>
            <div class="equipment-status status-${equipment.status.toLowerCase()}">${equipment.status}</div>
        </div>
        <div class="equipment-body">
            <div class="equipment-details">
                <div class="detail-item">
                    <div class="detail-label">Serial Number</div>
                    <div class="detail-value">${equipment.serialNumber}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Operating Hours</div>
                    <div class="detail-value">${equipment.operatingHours || 0}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Location</div>
                    <div class="detail-value">${equipment.location || 'Unknown'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Purchase Date</div>
                    <div class="detail-value">${new Date(equipment.purchaseDate).toLocaleDateString()}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Last Service</div>
                    <div class="detail-value">${equipment.lastServiceDate ? 
                        new Date(equipment.lastServiceDate).toLocaleDateString() : 'Never'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Next Service Due</div>
                    <div class="detail-value">${nextServiceDue}</div>
                </div>
            </div>
            
            <div class="warranty-indicator warranty-${warrantyStatus.class}">
                <i class="material-icons">${warrantyStatus.icon}</i>
                <span>${warrantyStatus.text}</span>
            </div>
            
            <div class="equipment-actions">
                <button class="action-btn btn-primary" onclick="viewEquipmentDetails('${equipment.id}')">
                    <i class="material-icons">visibility</i>
                    View Details
                </button>
                <button class="action-btn btn-secondary" onclick="scheduleService('${equipment.id}')">
                    <i class="material-icons">build</i>
                    Service
                </button>
            </div>
        </div>
    `;

    return card;
}

// Get warranty status
function getWarrantyStatus(warranty) {
    if (!warranty) {
        return {
            class: 'expired',
            icon: 'error',
            text: 'No Active Warranty'
        };
    }

    const endDate = new Date(warranty.endDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) {
        return {
            class: 'expired',
            icon: 'error',
            text: 'Warranty Expired'
        };
    } else if (daysUntilExpiry <= 30) {
        return {
            class: 'expiring',
            icon: 'warning',
            text: `Warranty expires in ${daysUntilExpiry} days`
        };
    } else {
        return {
            class: 'active',
            icon: 'verified_user',
            text: `Warranty valid until ${endDate.toLocaleDateString()}`
        };
    }
}

// Action functions
function viewEquipmentDetails(equipmentId) {
    // Navigate to equipment details page
    window.open(`equipment-details.html?equipmentId=${equipmentId}`, '_blank');
}

function scheduleService(equipmentId) {
    // Navigate to service scheduling page
    window.open(`service-scheduling.html?equipmentId=${equipmentId}`, '_blank');
}

function addNewEquipment() {
    // Navigate to add equipment page
    const url = currentCustomerId ? 
        `add-equipment.html?customerId=${currentCustomerId}` : 
        'add-equipment.html';
    window.open(url, '_blank');
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            padding: 16px 24px;
            border-radius: 4px;
            color: white;
            font-weight: 500;
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
            transform: translateY(100px);
            opacity: 0;
            transition: transform 0.3s, opacity 0.3s;
            z-index: 1000;
            max-width: 400px;
        `;
        document.body.appendChild(notification);
    }

    // Set notification content and type
    notification.textContent = message;

    // Set background color based on type
    const colors = {
        success: '#4caf50',
        error: '#f44336',
        warning: '#ff9800',
        info: '#2196f3'
    };
    notification.style.backgroundColor = colors[type] || colors.info;

    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    }, 10);

    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';
    }, 3000);
}
