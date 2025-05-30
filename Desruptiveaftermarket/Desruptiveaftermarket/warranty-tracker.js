/**
 * Warranty Tracker JavaScript
 * 
 * This file provides the functionality for the Warranty Tracker page,
 * displaying warranty information with validation and expiry tracking.
 */

// Global variables
let allWarranties = [];
let filteredWarranties = [];
let allEquipment = [];
let allCustomers = [];

// DOM elements
let warrantyTableBody;
let warrantySearch;
let statusFilter;
let typeFilter;
let activeWarranties;
let expiringWarranties;
let expiredWarranties;
let totalClaims;
let emptyState;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    setupEventListeners();
    loadWarrantyData();
});

// Initialize DOM elements
function initializeElements() {
    warrantyTableBody = document.getElementById('warrantyTableBody');
    warrantySearch = document.getElementById('warrantySearch');
    statusFilter = document.getElementById('statusFilter');
    typeFilter = document.getElementById('typeFilter');
    activeWarranties = document.getElementById('activeWarranties');
    expiringWarranties = document.getElementById('expiringWarranties');
    expiredWarranties = document.getElementById('expiredWarranties');
    totalClaims = document.getElementById('totalClaims');
    emptyState = document.getElementById('emptyState');
}

// Setup event listeners
function setupEventListeners() {
    // Search input
    warrantySearch.addEventListener('input', function() {
        filterWarranties();
    });

    // Status filter
    statusFilter.addEventListener('change', function() {
        filterWarranties();
    });

    // Type filter
    typeFilter.addEventListener('change', function() {
        filterWarranties();
    });
}

// Load warranty data
function loadWarrantyData() {
    // Load all data
    allWarranties = DataService.getWarrantyRecords();
    allEquipment = DataService.getCustomerEquipment();
    allCustomers = DataService.getParties();

    // Enhance warranties with equipment and customer data
    allWarranties = allWarranties.map(warranty => {
        const equipment = allEquipment.find(eq => eq.id === warranty.equipmentId);
        const customer = allCustomers.find(c => c.id === warranty.customerId);
        
        return {
            ...warranty,
            equipment: equipment,
            customer: customer
        };
    });

    filteredWarranties = [...allWarranties];
    updateStatistics();
    renderWarranties();
}

// Filter warranties based on search and filters
function filterWarranties() {
    const searchTerm = warrantySearch.value.toLowerCase();
    const statusValue = statusFilter.value;
    const typeValue = typeFilter.value;

    filteredWarranties = allWarranties.filter(warranty => {
        // Search filter
        const matchesSearch = !searchTerm || 
            (warranty.equipment && (
                warranty.equipment.manufacturer.toLowerCase().includes(searchTerm) ||
                warranty.equipment.model.toLowerCase().includes(searchTerm) ||
                warranty.equipment.serialNumber.toLowerCase().includes(searchTerm)
            )) ||
            (warranty.customer && warranty.customer.name.toLowerCase().includes(searchTerm));

        // Status filter
        const warrantyStatus = getWarrantyStatus(warranty);
        const matchesStatus = !statusValue || warrantyStatus.category === statusValue;

        // Type filter
        const matchesType = !typeValue || warranty.warrantyType === typeValue;

        return matchesSearch && matchesStatus && matchesType;
    });

    renderWarranties();
}

// Update statistics
function updateStatistics() {
    let active = 0;
    let expiring = 0;
    let expired = 0;
    let claims = 0;

    allWarranties.forEach(warranty => {
        const status = getWarrantyStatus(warranty);
        
        switch (status.category) {
            case 'Active':
                active++;
                break;
            case 'Expiring':
                expiring++;
                break;
            case 'Expired':
                expired++;
                break;
        }
        
        claims += warranty.claimsCount || 0;
    });

    activeWarranties.textContent = active;
    expiringWarranties.textContent = expiring;
    expiredWarranties.textContent = expired;
    totalClaims.textContent = claims;
}

// Render warranties table
function renderWarranties() {
    warrantyTableBody.innerHTML = '';

    if (filteredWarranties.length === 0) {
        document.querySelector('.warranty-table-container').style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    document.querySelector('.warranty-table-container').style.display = 'block';
    emptyState.style.display = 'none';

    filteredWarranties.forEach(warranty => {
        const row = createWarrantyRow(warranty);
        warrantyTableBody.appendChild(row);
    });
}

// Create warranty table row
function createWarrantyRow(warranty) {
    const row = document.createElement('tr');
    const status = getWarrantyStatus(warranty);
    
    const equipmentName = warranty.equipment ? 
        `${warranty.equipment.manufacturer} ${warranty.equipment.model}` : 
        'Unknown Equipment';
    
    const customerName = warranty.customer ? warranty.customer.name : 'Unknown Customer';
    
    row.innerHTML = `
        <td>
            <div style="font-weight: 500;">${equipmentName}</div>
            <div style="font-size: 12px; color: var(--accent-color);">
                ${warranty.equipment ? warranty.equipment.serialNumber : 'N/A'}
            </div>
        </td>
        <td>${customerName}</td>
        <td>${warranty.warrantyType}</td>
        <td>
            <div class="status-badge status-${status.class}">
                <i class="material-icons" style="font-size: 14px;">${status.icon}</i>
                ${status.text}
            </div>
            <div class="warranty-progress">
                <div class="progress-bar progress-${status.class}" style="width: ${status.progress}%"></div>
            </div>
        </td>
        <td>${new Date(warranty.startDate).toLocaleDateString()}</td>
        <td>${new Date(warranty.endDate).toLocaleDateString()}</td>
        <td>
            <div style="font-weight: 500;">${warranty.coverage}</div>
            <div style="font-size: 12px; color: var(--accent-color);">${warranty.terms}</div>
        </td>
        <td>
            <div style="font-weight: 500;">${warranty.claimsCount || 0}</div>
            ${warranty.lastClaimDate ? 
                `<div style="font-size: 12px; color: var(--accent-color);">
                    Last: ${new Date(warranty.lastClaimDate).toLocaleDateString()}
                </div>` : 
                '<div style="font-size: 12px; color: var(--accent-color);">No claims</div>'
            }
        </td>
        <td>
            <button class="action-btn" onclick="viewWarrantyDetails('${warranty.id}')" title="View Details">
                <i class="material-icons">visibility</i>
            </button>
            <button class="action-btn" onclick="createClaim('${warranty.id}')" title="Create Claim">
                <i class="material-icons">receipt</i>
            </button>
        </td>
    `;

    return row;
}

// Get warranty status
function getWarrantyStatus(warranty) {
    const startDate = new Date(warranty.startDate);
    const endDate = new Date(warranty.endDate);
    const today = new Date();
    
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const daysElapsed = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));
    const daysUntilExpiry = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    
    const progress = Math.min(100, Math.max(0, (daysElapsed / totalDays) * 100));

    if (daysUntilExpiry < 0) {
        return {
            category: 'Expired',
            class: 'expired',
            icon: 'error',
            text: 'Expired',
            progress: 100
        };
    } else if (daysUntilExpiry <= 30) {
        return {
            category: 'Expiring',
            class: 'expiring',
            icon: 'warning',
            text: `${daysUntilExpiry} days left`,
            progress: progress
        };
    } else {
        return {
            category: 'Active',
            class: 'active',
            icon: 'verified_user',
            text: 'Active',
            progress: progress
        };
    }
}

// Action functions
function viewWarrantyDetails(warrantyId) {
    // Navigate to warranty details page
    window.open(`warranty-details.html?warrantyId=${warrantyId}`, '_blank');
}

function createClaim(warrantyId) {
    // Navigate to warranty claim page
    window.open(`warranty-claim.html?warrantyId=${warrantyId}`, '_blank');
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
