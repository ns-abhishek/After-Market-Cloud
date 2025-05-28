// Shipment Tracking JavaScript

let filteredShipments = [...shipmentsData];
let currentSortField = '';
let currentSortDirection = 'asc';

// Initialize shipment tracking page
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('shipment-tracking.html')) {
        initializeShipmentTracking();
    }
});

function initializeShipmentTracking() {
    loadShipments();
    updateShipmentStatistics();
    populateAvailableBays();
    
    // Add form submission handler
    const shipmentForm = document.getElementById('shipmentForm');
    if (shipmentForm) {
        shipmentForm.addEventListener('submit', handleShipmentFormSubmission);
    }
}

// Load and display shipments
function loadShipments() {
    const tableBody = document.getElementById('shipmentTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    filteredShipments.forEach(shipment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="customer-info">
                    <strong>${shipment.customer}</strong>
                    <br>
                    <small>${shipment.customerPhone}</small>
                </div>
            </td>
            <td>
                <div class="order-info">
                    <strong>${shipment.order}</strong>
                    <br>
                    <small>${shipment.courierTracking}</small>
                </div>
            </td>
            <td>
                <div class="courier-info">
                    <i class="fas fa-truck"></i>
                    ${shipment.courier}
                </div>
            </td>
            <td>
                <div class="confirmation-info">
                    <span class="status-badge status-${shipment.confirmation.toLowerCase()}">
                        ${shipment.confirmation}
                    </span>
                    <br>
                    <small>${shipment.address}</small>
                </div>
            </td>
            <td>
                <span class="status-badge status-${shipment.statusColor}">
                    ${shipment.status}
                </span>
                <br>
                <small>${shipment.time}</small>
            </td>
            <td>
                <span class="tat-badge ${shipment.tag.toLowerCase()}">
                    ${shipment.tag}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon" onclick="viewShipmentDetails(${shipment.id})" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" onclick="editShipment(${shipment.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" onclick="updateShipmentStatus(${shipment.id})" title="Update Status">
                        <i class="fas fa-sync-alt"></i>
                    </button>
                    <button class="btn-icon danger" onclick="deleteShipment(${shipment.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Update shipment statistics
function updateShipmentStatistics() {
    const delivered = filteredShipments.filter(s => s.statusColor === 'delivered').length;
    const pending = filteredShipments.filter(s => s.statusColor === 'pending').length;
    const transit = filteredShipments.filter(s => s.statusColor === 'transit').length;
    const rejected = filteredShipments.filter(s => s.statusColor === 'rejected').length;
    
    document.getElementById('deliveredCount').textContent = delivered;
    document.getElementById('pendingCount').textContent = pending;
    document.getElementById('transitCount').textContent = transit;
    document.getElementById('rejectedCount').textContent = rejected;
}

// Filter shipments
function filterShipments() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const courierFilter = document.getElementById('courierFilter').value;
    
    filteredShipments = shipmentsData.filter(shipment => {
        const matchesSearch = !searchTerm || 
            shipment.customer.toLowerCase().includes(searchTerm) ||
            shipment.order.toLowerCase().includes(searchTerm) ||
            shipment.courier.toLowerCase().includes(searchTerm) ||
            shipment.status.toLowerCase().includes(searchTerm);
            
        const matchesStatus = !statusFilter || shipment.statusColor === statusFilter;
        const matchesCourier = !courierFilter || shipment.courier === courierFilter;
        
        return matchesSearch && matchesStatus && matchesCourier;
    });
    
    loadShipments();
    updateShipmentStatistics();
}

// Reset filters
function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('courierFilter').value = '';
    
    filteredShipments = [...shipmentsData];
    loadShipments();
    updateShipmentStatistics();
}

// Sort shipments
function sortShipments(field) {
    if (currentSortField === field) {
        currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        currentSortField = field;
        currentSortDirection = 'asc';
    }
    
    filteredShipments.sort((a, b) => {
        let aValue = a[field];
        let bValue = b[field];
        
        if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
        }
        
        if (currentSortDirection === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });
    
    loadShipments();
    updateSortIcons(field);
}

// Update sort icons
function updateSortIcons(activeField) {
    const sortIcons = document.querySelectorAll('th i.fas');
    sortIcons.forEach(icon => {
        icon.className = 'fas fa-sort';
    });
    
    const activeIcon = document.querySelector(`th[onclick="sortShipments('${activeField}')"] i`);
    if (activeIcon) {
        activeIcon.className = currentSortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
    }
}

// View shipment details
function viewShipmentDetails(shipmentId) {
    const shipment = shipmentsData.find(s => s.id === shipmentId);
    if (!shipment) return;
    
    const detailsContent = document.getElementById('shipmentDetailsContent');
    detailsContent.innerHTML = `
        <div class="shipment-details">
            <div class="detail-section">
                <h4>Customer Information</h4>
                <p><strong>Name:</strong> ${shipment.customer}</p>
                <p><strong>Phone:</strong> ${shipment.customerPhone}</p>
                <p><strong>Address:</strong> ${shipment.address}</p>
            </div>
            
            <div class="detail-section">
                <h4>Order Information</h4>
                <p><strong>Order Number:</strong> ${shipment.order}</p>
                <p><strong>Courier:</strong> ${shipment.courier}</p>
                <p><strong>Tracking Number:</strong> ${shipment.courierTracking}</p>
                <p><strong>Bay:</strong> ${shipment.bay}</p>
            </div>
            
            <div class="detail-section">
                <h4>Status Information</h4>
                <p><strong>Current Status:</strong> 
                    <span class="status-badge status-${shipment.statusColor}">${shipment.status}</span>
                </p>
                <p><strong>Confirmation:</strong> ${shipment.confirmation}</p>
                <p><strong>Last Updated:</strong> ${shipment.time}</p>
                <p><strong>TAT:</strong> 
                    <span class="tat-badge ${shipment.tag.toLowerCase()}">${shipment.tag}</span>
                </p>
            </div>
        </div>
    `;
    
    openModal('shipmentDetailsModal');
}

// Edit shipment
function editShipment(shipmentId) {
    const shipment = shipmentsData.find(s => s.id === shipmentId);
    if (!shipment) return;
    
    // Populate form with existing data
    document.getElementById('customerName').value = shipment.customer;
    document.getElementById('customerPhone').value = shipment.customerPhone;
    document.getElementById('orderNumber').value = shipment.order;
    document.getElementById('courier').value = shipment.courier;
    document.getElementById('bayNumber').value = shipment.bay;
    document.getElementById('customerAddress').value = shipment.address;
    
    // Store the shipment ID for updating
    document.getElementById('shipmentForm').dataset.editingId = shipmentId;
    
    openModal('addShipmentModal');
}

// Update shipment status
function updateShipmentStatus(shipmentId) {
    const shipment = shipmentsData.find(s => s.id === shipmentId);
    if (!shipment) return;
    
    const newStatus = prompt('Enter new status:', shipment.status);
    if (newStatus && newStatus !== shipment.status) {
        shipment.status = newStatus;
        shipment.time = 'Just now';
        
        // Update status color based on new status
        if (newStatus.toLowerCase().includes('delivered')) {
            shipment.statusColor = 'delivered';
        } else if (newStatus.toLowerCase().includes('transit')) {
            shipment.statusColor = 'transit';
        } else if (newStatus.toLowerCase().includes('rejected') || newStatus.toLowerCase().includes('failed')) {
            shipment.statusColor = 'rejected';
        } else {
            shipment.statusColor = 'pending';
        }
        
        loadShipments();
        updateShipmentStatistics();
        showNotification('Shipment status updated successfully!', 'success');
    }
}

// Delete shipment
function deleteShipment(shipmentId) {
    if (confirm('Are you sure you want to delete this shipment?')) {
        const shipmentIndex = shipmentsData.findIndex(s => s.id === shipmentId);
        if (shipmentIndex > -1) {
            const shipment = shipmentsData[shipmentIndex];
            
            // Free up the bay
            const bay = baysData.find(b => b.number === shipment.bay);
            if (bay) {
                bay.status = 'available';
                bay.customer = null;
                bay.shipment = null;
            }
            
            shipmentsData.splice(shipmentIndex, 1);
            filteredShipments = filteredShipments.filter(s => s.id !== shipmentId);
            
            loadShipments();
            updateShipmentStatistics();
            showNotification('Shipment deleted successfully!', 'success');
        }
    }
}

// Handle shipment form submission
function handleShipmentFormSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const editingId = e.target.dataset.editingId;
    
    const shipmentData = {
        customer: formData.get('customerName'),
        customerPhone: formData.get('customerPhone'),
        order: formData.get('orderNumber'),
        courier: formData.get('courier'),
        bay: formData.get('bayNumber'),
        address: formData.get('customerAddress')
    };
    
    if (editingId) {
        // Update existing shipment
        updateExistingShipment(parseInt(editingId), shipmentData);
        delete e.target.dataset.editingId;
    } else {
        // Add new shipment
        addNewShipmentToTracking(shipmentData);
    }
    
    closeModal('addShipmentModal');
    e.target.reset();
}

// Update existing shipment
function updateExistingShipment(shipmentId, shipmentData) {
    const shipment = shipmentsData.find(s => s.id === shipmentId);
    if (!shipment) return;
    
    const oldBay = shipment.bay;
    
    // Update shipment data
    Object.assign(shipment, shipmentData);
    shipment.time = 'Just now';
    
    // Update bay allocation if changed
    if (oldBay !== shipmentData.bay) {
        // Free old bay
        const oldBayObj = baysData.find(b => b.number === oldBay);
        if (oldBayObj) {
            oldBayObj.status = 'available';
            oldBayObj.customer = null;
            oldBayObj.shipment = null;
        }
        
        // Allocate new bay
        const newBayObj = baysData.find(b => b.number === shipmentData.bay);
        if (newBayObj) {
            newBayObj.status = 'occupied';
            newBayObj.customer = shipmentData.customer;
            newBayObj.shipment = shipmentData.order;
        }
    }
    
    loadShipments();
    updateShipmentStatistics();
    showNotification('Shipment updated successfully!', 'success');
}

// Add new shipment to tracking
function addNewShipmentToTracking(shipmentData) {
    const newShipment = {
        id: shipmentsData.length + 1,
        customer: shipmentData.customer,
        customerPhone: shipmentData.customerPhone,
        order: shipmentData.order,
        courier: shipmentData.courier,
        courierTracking: generateTrackingNumber(),
        confirmation: 'Order',
        address: shipmentData.address,
        status: 'Pending',
        statusColor: 'pending',
        time: 'Just now',
        bay: shipmentData.bay,
        tag: 'Online'
    };
    
    shipmentsData.unshift(newShipment);
    filteredShipments.unshift(newShipment);
    
    // Update bay status
    const bay = baysData.find(b => b.number === shipmentData.bay);
    if (bay) {
        bay.status = 'occupied';
        bay.customer = shipmentData.customer;
        bay.shipment = shipmentData.order;
    }
    
    loadShipments();
    updateShipmentStatistics();
    showNotification('Shipment added successfully!', 'success');
}

// Export shipments
function exportShipments() {
    const csvContent = generateCSV(filteredShipments);
    downloadCSV(csvContent, 'shipments.csv');
    showNotification('Shipments exported successfully!', 'success');
}

// Generate CSV content
function generateCSV(data) {
    const headers = ['Customer', 'Phone', 'Order', 'Courier', 'Tracking', 'Status', 'Bay', 'Address'];
    const csvRows = [headers.join(',')];
    
    data.forEach(shipment => {
        const row = [
            shipment.customer,
            shipment.customerPhone,
            shipment.order,
            shipment.courier,
            shipment.courierTracking,
            shipment.status,
            shipment.bay,
            `"${shipment.address}"`
        ];
        csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
}

// Download CSV file
function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Refresh shipments
function refreshShipments() {
    filteredShipments = [...shipmentsData];
    loadShipments();
    updateShipmentStatistics();
    showNotification('Shipments refreshed successfully!', 'success');
}

// Populate available bays for form
function populateAvailableBays() {
    const baySelect = document.getElementById('bayNumber');
    if (!baySelect) return;
    
    baySelect.innerHTML = '<option value="">Select Bay</option>';
    
    const availableBays = baysData.filter(bay => bay.status === 'available');
    availableBays.forEach(bay => {
        const option = document.createElement('option');
        option.value = bay.number;
        option.textContent = `Bay ${bay.number}`;
        baySelect.appendChild(option);
    });
}
