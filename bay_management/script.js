// Bay Management System JavaScript

// Global variables
let currentBays = [...baysData];
let currentShipments = [...shipmentsData];
let currentCustomers = [...customersData];
let currentActivities = [...activitiesData];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    updateStatistics();
    loadRecentActivities();
    loadBayOverview();
    populateAvailableBays();
});

// Initialize dashboard
function initializeDashboard() {
    updateStatistics();
    loadRecentActivities();
    loadBayOverview();
    
    // Set active navigation
    setActiveNavigation();
}

// Update statistics
function updateStatistics() {
    const stats = calculateStatistics();
    
    document.getElementById('totalBays').textContent = stats.totalBays;
    document.getElementById('occupiedBays').textContent = stats.occupiedBays;
    document.getElementById('availableBays').textContent = stats.availableBays;
    document.getElementById('pendingShipments').textContent = stats.pendingShipments;
}

// Calculate statistics from current data
function calculateStatistics() {
    const totalBays = currentBays.length;
    const occupiedBays = currentBays.filter(bay => bay.status === 'occupied').length;
    const availableBays = currentBays.filter(bay => bay.status === 'available').length;
    const pendingShipments = currentShipments.filter(shipment => 
        shipment.statusColor === 'pending' || shipment.statusColor === 'transit'
    ).length;
    
    return {
        totalBays,
        occupiedBays,
        availableBays,
        pendingShipments
    };
}

// Load recent activities
function loadRecentActivities() {
    const activityList = document.getElementById('activityList');
    if (!activityList) return;
    
    activityList.innerHTML = '';
    
    currentActivities.slice(0, 5).forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        
        activityItem.innerHTML = `
            <div class="activity-icon">
                <i class="${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <h4>${activity.title}</h4>
                <p>${activity.description}</p>
            </div>
            <div class="activity-time">
                ${activity.time}
            </div>
        `;
        
        activityList.appendChild(activityItem);
    });
}

// Load bay overview
function loadBayOverview() {
    const bayGrid = document.getElementById('bayGrid');
    if (!bayGrid) return;
    
    bayGrid.innerHTML = '';
    
    currentBays.forEach(bay => {
        const bayItem = document.createElement('div');
        bayItem.className = `bay-item ${bay.status}`;
        bayItem.onclick = () => showBayDetails(bay);
        
        bayItem.innerHTML = `
            <div class="bay-number">${bay.number}</div>
            <div class="bay-status">${bay.status}</div>
        `;
        
        bayGrid.appendChild(bayItem);
    });
}

// Show bay details
function showBayDetails(bay) {
    let details = `Bay: ${bay.number}\nStatus: ${bay.status}`;
    
    if (bay.customer) {
        details += `\nCustomer: ${bay.customer}`;
        details += `\nShipment: ${bay.shipment}`;
    }
    
    alert(details);
}

// Refresh bay status
function refreshBayStatus() {
    showNotification('Bay status refreshed successfully!', 'success');
    loadBayOverview();
    updateStatistics();
}

// Generate report
function generateReport() {
    const stats = calculateStatistics();
    const reportData = {
        date: new Date().toLocaleDateString(),
        totalBays: stats.totalBays,
        occupiedBays: stats.occupiedBays,
        availableBays: stats.availableBays,
        pendingShipments: stats.pendingShipments,
        deliveredToday: currentShipments.filter(s => s.statusColor === 'delivered').length
    };
    
    console.log('Generated Report:', reportData);
    showNotification('Report generated successfully!', 'success');
}

// Modal functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        
        // Populate form data if needed
        if (modalId === 'addShipmentModal') {
            populateAvailableBays();
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Populate available bays in form
function populateAvailableBays() {
    const baySelect = document.getElementById('bayNumber');
    if (!baySelect) return;
    
    baySelect.innerHTML = '<option value="">Select Bay</option>';
    
    const availableBays = currentBays.filter(bay => bay.status === 'available');
    availableBays.forEach(bay => {
        const option = document.createElement('option');
        option.value = bay.number;
        option.textContent = `Bay ${bay.number}`;
        baySelect.appendChild(option);
    });
}

// Handle shipment form submission
document.addEventListener('submit', function(e) {
    if (e.target.id === 'shipmentForm') {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const shipmentData = {
            customer: formData.get('customerName') || document.getElementById('customerName').value,
            order: formData.get('orderNumber') || document.getElementById('orderNumber').value,
            courier: formData.get('courier') || document.getElementById('courier').value,
            bay: formData.get('bayNumber') || document.getElementById('bayNumber').value
        };
        
        if (addNewShipment(shipmentData)) {
            closeModal('addShipmentModal');
            e.target.reset();
            showNotification('Shipment added successfully!', 'success');
        }
    }
});

// Add new shipment
function addNewShipment(shipmentData) {
    if (!shipmentData.customer || !shipmentData.order || !shipmentData.courier || !shipmentData.bay) {
        showNotification('Please fill all required fields!', 'error');
        return false;
    }
    
    // Generate new shipment
    const newShipment = {
        id: currentShipments.length + 1,
        customer: shipmentData.customer,
        customerPhone: '9090909090',
        order: shipmentData.order,
        courier: shipmentData.courier,
        courierTracking: generateTrackingNumber(),
        confirmation: 'Order',
        address: 'Address',
        status: 'Pending',
        statusColor: 'pending',
        time: 'Just now',
        bay: shipmentData.bay,
        tag: 'Online'
    };
    
    currentShipments.unshift(newShipment);
    
    // Update bay status
    const bay = currentBays.find(b => b.number === shipmentData.bay);
    if (bay) {
        bay.status = 'occupied';
        bay.customer = shipmentData.customer;
        bay.shipment = shipmentData.order;
    }
    
    // Add activity
    const newActivity = {
        id: currentActivities.length + 1,
        type: 'shipment',
        icon: 'fas fa-plus',
        title: 'New shipment added',
        description: `Shipment ${shipmentData.order} for ${shipmentData.customer} added to Bay ${shipmentData.bay}`,
        time: 'Just now'
    };
    
    currentActivities.unshift(newActivity);
    
    // Update UI
    updateStatistics();
    loadRecentActivities();
    loadBayOverview();
    
    return true;
}

// Generate tracking number
function generateTrackingNumber() {
    return Math.random().toString(36).substr(2, 9).toUpperCase() + Math.floor(Math.random() * 10000);
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Set active navigation
function setActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        const parentItem = link.closest('.nav-item');
        
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            parentItem.classList.add('active');
        } else {
            parentItem.classList.remove('active');
        }
    });
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Search functionality
function searchItems(searchTerm, items, searchFields) {
    if (!searchTerm) return items;
    
    return items.filter(item => {
        return searchFields.some(field => {
            const value = item[field];
            return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
        });
    });
}

// Filter functionality
function filterItems(items, filterField, filterValue) {
    if (!filterValue) return items;
    
    return items.filter(item => item[filterField] === filterValue);
}

// Sort functionality
function sortItems(items, sortField, sortDirection = 'asc') {
    return [...items].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        
        if (sortDirection === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });
}

// Export functions for use in other pages
window.BayManagement = {
    currentBays,
    currentShipments,
    currentCustomers,
    currentActivities,
    updateStatistics,
    loadRecentActivities,
    loadBayOverview,
    showNotification,
    searchItems,
    filterItems,
    sortItems,
    generateTrackingNumber
};
