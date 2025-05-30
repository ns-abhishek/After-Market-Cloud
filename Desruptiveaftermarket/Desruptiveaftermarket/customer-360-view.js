/**
 * Customer 360 View JavaScript
 *
 * This file provides the functionality for the Customer 360 View page,
 * displaying comprehensive customer information including equipment,
 * warranties, service history, and communication logs.
 */

// Global variables
let currentCustomerId = null;
let customer360Data = null;
let allCustomers = [];
let currentCustomerIndex = 0;

// DOM elements
let loadingState;
let customerContent;
let customerName;
let customerLocation;
let customerEmail;
let customerPhone;
let customerType;
let customerAvatar;
let equipmentCount;
let warrantyCount;
let serviceCount;
let communicationCount;
let equipmentOverview;
let serviceHistory;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    setupEventListeners();
    loadCustomerData();
});

// Initialize DOM elements
function initializeElements() {
    loadingState = document.getElementById('loadingState');
    customerContent = document.getElementById('customerContent');
    customerName = document.getElementById('customerName');
    customerLocation = document.getElementById('customerLocation');
    customerEmail = document.getElementById('customerEmail');
    customerPhone = document.getElementById('customerPhone');
    customerType = document.getElementById('customerType');
    customerAvatar = document.getElementById('customerAvatar');
    equipmentCount = document.getElementById('equipmentCount');
    warrantyCount = document.getElementById('warrantyCount');
    serviceCount = document.getElementById('serviceCount');
    communicationCount = document.getElementById('communicationCount');
    equipmentOverview = document.getElementById('equipmentOverview');
    serviceHistory = document.getElementById('serviceHistory');
}

// Setup event listeners
function setupEventListeners() {
    // Back button
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', function() {
            goBack();
        });
    }

    // Edit customer button
    document.getElementById('editCustomerBtn').addEventListener('click', function() {
        editCustomer();
    });

    // Contact customer button
    document.getElementById('contactCustomerBtn').addEventListener('click', function() {
        contactCustomer();
    });

    // View all equipment button
    document.getElementById('viewAllEquipmentBtn').addEventListener('click', function() {
        viewAllEquipment();
    });

    // View all service button
    document.getElementById('viewAllServiceBtn').addEventListener('click', function() {
        viewAllService();
    });
}

// Load customer data
function loadCustomerData() {
    // Get customer ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    currentCustomerId = urlParams.get('customerId') || 'P001'; // Default to P001 for demo

    // Load all customers for navigation
    loadAllCustomers();

    // Show loading state
    showLoading(true);

    // Simulate API call delay
    setTimeout(() => {
        try {
            // Get customer 360 data
            customer360Data = DataService.getCustomer360View(currentCustomerId);

            if (customer360Data) {
                populateCustomerData();
                updateNavigationState();
                showLoading(false);
            } else {
                showError('Customer not found');
            }
        } catch (error) {
            console.error('Error loading customer data:', error);
            showError('Error loading customer data');
        }
    }, 1000);
}

// Load all customers for navigation
function loadAllCustomers() {
    try {
        // Get all parties and filter for customers, prospects, and vendors (business entities)
        const allParties = DataService.getParties();
        allCustomers = allParties.filter(party =>
            party.partyType === 'Customer' ||
            party.partyType === 'Prospect' ||
            party.partyType === 'Vendor' ||
            party.partyType === 'Contractor'
        );

        // Find current customer index
        currentCustomerIndex = allCustomers.findIndex(customer => customer.id === currentCustomerId);
        if (currentCustomerIndex === -1) {
            currentCustomerIndex = 0;
            currentCustomerId = allCustomers[0]?.id || 'P001';
        }
    } catch (error) {
        console.error('Error loading customers:', error);
        allCustomers = [];
        currentCustomerIndex = 0;
    }
}

// Populate customer data
function populateCustomerData() {
    const customer = customer360Data.customer;

    // Update customer header
    customerName.textContent = customer.name;
    customerLocation.textContent = `${customer.city || 'Unknown'}, ${customer.country || 'Unknown'}`;
    customerEmail.textContent = customer.email || 'No email';
    customerPhone.textContent = customer.phone || 'No phone';
    customerType.textContent = customer.partyType || 'Unknown';

    // Update avatar with first letter of company name
    customerAvatar.innerHTML = `<span style="font-size: 32px; font-weight: bold;">${customer.name.charAt(0)}</span>`;

    // Update statistics
    equipmentCount.textContent = customer360Data.equipment.length;
    warrantyCount.textContent = customer360Data.warranties.filter(w => w.status === 'Active').length;
    serviceCount.textContent = customer360Data.serviceHistory.length;
    communicationCount.textContent = customer360Data.communicationLogs.length;

    // Populate equipment overview
    populateEquipmentOverview();

    // Populate service history
    populateServiceHistory();
}

// Populate equipment overview
function populateEquipmentOverview() {
    equipmentOverview.innerHTML = '';

    const equipment = customer360Data.equipment; // Show ALL equipment records

    if (equipment.length === 0) {
        equipmentOverview.innerHTML = '<p style="text-align: center; color: var(--accent-color); padding: 20px;">No equipment found</p>';
        return;
    }

    equipment.forEach(eq => {
        const equipmentCard = document.createElement('div');
        equipmentCard.className = 'equipment-card';

        const statusClass = eq.status === 'Active' ? 'status-active' : 'status-maintenance';

        equipmentCard.innerHTML = `
            <div class="equipment-header">
                <div class="equipment-title">${eq.manufacturer} ${eq.model}</div>
                <div class="equipment-status ${statusClass}">${eq.status}</div>
            </div>
            <div class="equipment-details">
                <div class="detail-item">
                    <span class="detail-label">Type:</span>
                    <span>${eq.equipmentType}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Serial:</span>
                    <span>${eq.serialNumber}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Hours:</span>
                    <span>${eq.operatingHours || 0}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Location:</span>
                    <span>${eq.location || 'Unknown'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Year:</span>
                    <span>${eq.year || 'Unknown'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Purchase Date:</span>
                    <span>${eq.purchaseDate ? formatDate(eq.purchaseDate) : 'Unknown'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Warranty:</span>
                    <span>${eq.warrantyStatus || 'Unknown'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Last Service:</span>
                    <span>${eq.lastServiceDate ? formatDate(eq.lastServiceDate) : 'Never'}</span>
                </div>
            </div>
        `;

        // Add click event to view equipment details
        equipmentCard.addEventListener('click', function() {
            viewEquipmentDetails(eq.id);
        });

        equipmentOverview.appendChild(equipmentCard);
    });
}

// Populate service history
function populateServiceHistory() {
    serviceHistory.innerHTML = '';

    const services = customer360Data.serviceHistory; // Show ALL service records

    if (services.length === 0) {
        serviceHistory.innerHTML = '<p style="text-align: center; color: var(--accent-color); padding: 20px;">No service history found</p>';
        return;
    }

    // Sort services by date (most recent first)
    const sortedServices = services.sort((a, b) => new Date(b.serviceDate) - new Date(a.serviceDate));

    sortedServices.forEach(service => {
        const serviceItem = document.createElement('div');
        serviceItem.style.cssText = `
            padding: 16px;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            margin-bottom: 12px;
            cursor: pointer;
            transition: var(--transition);
            background: white;
        `;

        // Determine service status color
        const statusColor = service.status === 'Completed' ? 'var(--success-color)' :
                           service.status === 'In Progress' ? 'var(--warning-color)' :
                           service.status === 'Pending' ? 'var(--info-color)' : 'var(--accent-color)';

        serviceItem.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                <div style="font-weight: 500; font-size: 16px;">${service.serviceType}</div>
                <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
                    <div style="font-size: 14px; color: var(--accent-color);">${formatDate(service.serviceDate)}</div>
                    <div style="padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 500; color: white; background: ${statusColor};">
                        ${service.status || 'Completed'}
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; font-size: 14px;">
                <div>
                    <span style="color: var(--accent-color);">Technician:</span>
                    <span style="font-weight: 500; margin-left: 4px;">${service.technician}</span>
                </div>
                <div>
                    <span style="color: var(--accent-color);">Cost:</span>
                    <span style="font-weight: 500; margin-left: 4px; color: var(--success-color);">$${service.cost.toFixed(2)}</span>
                </div>
                <div>
                    <span style="color: var(--accent-color);">Duration:</span>
                    <span style="font-weight: 500; margin-left: 4px;">${service.duration || 'N/A'}</span>
                </div>
                <div>
                    <span style="color: var(--accent-color);">Priority:</span>
                    <span style="font-weight: 500; margin-left: 4px;">${service.priority || 'Normal'}</span>
                </div>
            </div>

            <div style="margin-bottom: 8px;">
                <div style="color: var(--accent-color); font-size: 12px; margin-bottom: 4px;">Description:</div>
                <div style="font-size: 14px; line-height: 1.4;">${service.description}</div>
            </div>

            ${service.partsUsed && service.partsUsed.length > 0 ? `
                <div style="margin-bottom: 8px;">
                    <div style="color: var(--accent-color); font-size: 12px; margin-bottom: 4px;">Parts Used:</div>
                    <div style="font-size: 13px;">
                        ${service.partsUsed.map(part => `<span style="background: var(--secondary-color); padding: 2px 6px; border-radius: 4px; margin-right: 4px; display: inline-block; margin-bottom: 2px;">${part}</span>`).join('')}
                    </div>
                </div>
            ` : ''}

            ${service.nextServiceDue ? `
                <div style="padding: 8px; background: var(--light-orange); border-radius: 4px; border-left: 3px solid var(--warning-color);">
                    <div style="font-size: 12px; color: var(--warning-color); font-weight: 500;">Next Service Due:</div>
                    <div style="font-size: 14px; font-weight: 500;">${formatDate(service.nextServiceDue)}</div>
                </div>
            ` : ''}
        `;

        serviceItem.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            this.style.transform = 'translateY(-2px)';
        });

        serviceItem.addEventListener('mouseleave', function() {
            this.style.boxShadow = 'none';
            this.style.transform = 'translateY(0)';
        });

        serviceItem.addEventListener('click', function() {
            viewServiceDetails(service.id);
        });

        serviceHistory.appendChild(serviceItem);
    });
}

// Show/hide loading state
function showLoading(show) {
    if (show) {
        loadingState.style.display = 'flex';
        customerContent.style.display = 'none';
    } else {
        loadingState.style.display = 'none';
        customerContent.style.display = 'block';
    }
}

// Show error message
function showError(message) {
    loadingState.innerHTML = `
        <div style="text-align: center; color: var(--error-color);">
            <i class="material-icons" style="font-size: 48px; margin-bottom: 16px;">error</i>
            <div style="font-size: 18px; margin-bottom: 8px;">Error</div>
            <div style="font-size: 14px;">${message}</div>
        </div>
    `;
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

// Back button functionality
function goBack() {
    console.log('goBack() called');
    // Always go to party details advanced page
    if (typeof NavigationUtils !== 'undefined') {
        console.log('Using NavigationUtils.goBackToPartyDetails()');
        NavigationUtils.goBackToPartyDetails();
    } else {
        console.log('NavigationUtils not available, using direct navigation');
        window.location.href = 'party-details-advanced.html';
    }
}

// Action functions
function editCustomer() {
    // In a real application, this would open an edit form
    showNotification('Edit customer functionality would open here', 'info');
}

function contactCustomer() {
    // In a real application, this would open contact options
    showNotification('Contact customer functionality would open here', 'info');
}

function viewAllEquipment() {
    // Navigate to equipment management page
    window.open(`equipment-management.html?customerId=${currentCustomerId}`, '_blank');
}

function viewAllService() {
    // Navigate to service history page
    window.open(`service-history.html?customerId=${currentCustomerId}`, '_blank');
}

function viewEquipmentDetails(equipmentId) {
    // Navigate to equipment details page
    window.open(`equipment-details.html?equipmentId=${equipmentId}`, '_blank');
}

function viewServiceDetails(serviceId) {
    // Navigate to service details page
    window.open(`service-details.html?serviceId=${serviceId}`, '_blank');
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

// ==================== NAVIGATION FUNCTIONALITY ====================

// Update navigation state
function updateNavigationState() {
    const prevBtn = document.getElementById('prevCustomerBtn');
    const nextBtn = document.getElementById('nextCustomerBtn');

    if (allCustomers.length > 0) {
        // Update counter using dedicated function
        updateCustomerCounter();

        // Update button states
        prevBtn.disabled = currentCustomerIndex === 0;
        nextBtn.disabled = currentCustomerIndex === allCustomers.length - 1;

        // Add visual feedback for disabled buttons
        if (prevBtn.disabled) {
            prevBtn.style.opacity = '0.5';
            prevBtn.style.cursor = 'not-allowed';
        } else {
            prevBtn.style.opacity = '1';
            prevBtn.style.cursor = 'pointer';
        }

        if (nextBtn.disabled) {
            nextBtn.style.opacity = '0.5';
            nextBtn.style.cursor = 'not-allowed';
        } else {
            nextBtn.style.opacity = '1';
            nextBtn.style.cursor = 'pointer';
        }
    } else {
        const customerCounter = document.getElementById('customerCounter');
        if (customerCounter) {
            customerCounter.textContent = '0 of 0';
        }
        prevBtn.disabled = true;
        nextBtn.disabled = true;
    }
}

// Navigate to previous customer
function navigateToPreviousCustomer() {
    if (currentCustomerIndex > 0) {
        currentCustomerIndex--;
        const previousCustomer = allCustomers[currentCustomerIndex];

        if (previousCustomer) {
            showNotification(`Loading ${previousCustomer.name}...`, 'info');

            // Update URL and reload customer data
            const newUrl = `${window.location.pathname}?customerId=${previousCustomer.id}`;
            window.history.pushState({}, '', newUrl);

            currentCustomerId = previousCustomer.id;
            loadCustomerData();
        }
    } else {
        showNotification('Already at the first customer', 'warning');
    }
}

// Navigate to next customer
function navigateToNextCustomer() {
    if (currentCustomerIndex < allCustomers.length - 1) {
        currentCustomerIndex++;
        const nextCustomer = allCustomers[currentCustomerIndex];

        if (nextCustomer) {
            showNotification(`Loading ${nextCustomer.name}...`, 'info');

            // Update URL and reload customer data
            const newUrl = `${window.location.pathname}?customerId=${nextCustomer.id}`;
            window.history.pushState({}, '', newUrl);

            currentCustomerId = nextCustomer.id;
            loadCustomerData();
        }
    } else {
        showNotification('Already at the last customer', 'warning');
    }
}

// Navigate to specific customer by ID
function navigateToCustomer(customerId) {
    const customerIndex = allCustomers.findIndex(customer => customer.id === customerId);

    if (customerIndex !== -1) {
        currentCustomerIndex = customerIndex;
        const customer = allCustomers[currentCustomerIndex];

        showNotification(`Loading ${customer.name}...`, 'info');

        // Update URL and reload customer data
        const newUrl = `${window.location.pathname}?customerId=${customerId}`;
        window.history.pushState({}, '', newUrl);

        currentCustomerId = customerId;
        loadCustomerData();
    } else {
        showNotification('Customer not found', 'error');
    }
}

// Keyboard navigation
function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // Left arrow - Previous customer
        if (e.key === 'ArrowLeft' && !e.ctrlKey && !e.altKey) {
            e.preventDefault();
            navigateToPreviousCustomer();
        }

        // Right arrow - Next customer
        if (e.key === 'ArrowRight' && !e.ctrlKey && !e.altKey) {
            e.preventDefault();
            navigateToNextCustomer();
        }

        // Escape - Go back
        if (e.key === 'Escape') {
            e.preventDefault();
            goBack();
        }

        // Home - First customer
        if (e.key === 'Home') {
            e.preventDefault();
            if (allCustomers.length > 0) {
                navigateToCustomer(allCustomers[0].id);
            }
        }

        // End - Last customer
        if (e.key === 'End') {
            e.preventDefault();
            if (allCustomers.length > 0) {
                navigateToCustomer(allCustomers[allCustomers.length - 1].id);
            }
        }
    });
}

// Initialize keyboard navigation
document.addEventListener('DOMContentLoaded', function() {
    setupKeyboardNavigation();
});

// Add customer search functionality
function searchCustomers(searchTerm) {
    const filteredCustomers = allCustomers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone?.includes(searchTerm)
    );

    return filteredCustomers;
}

// Quick customer selector (could be added to UI)
function showCustomerSelector() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.5); display: flex; align-items: center;
        justify-content: center; z-index: 1000;
    `;

    modal.innerHTML = `
        <div style="background: white; padding: 24px; border-radius: 8px; max-width: 500px; width: 90%; max-height: 70vh; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <h3 style="margin: 0;">Select Customer</h3>
                <button onclick="this.closest('div').parentElement.remove()" style="background: none; border: none; font-size: 24px; cursor: pointer;">×</button>
            </div>
            <input type="text" placeholder="Search customers..." style="width: 100%; padding: 8px; margin-bottom: 16px; border: 1px solid #ddd; border-radius: 4px;" onkeyup="filterCustomerList(this.value)">
            <div id="customerList" style="max-height: 300px; overflow-y: auto;">
                ${allCustomers.map((customer, index) => `
                    <div onclick="selectCustomerFromList('${customer.id}'); this.closest('div').parentElement.parentElement.remove();"
                         style="padding: 12px; border-bottom: 1px solid #eee; cursor: pointer; ${index === currentCustomerIndex ? 'background: #e3f2fd;' : ''}"
                         onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='${index === currentCustomerIndex ? '#e3f2fd' : 'transparent'}'">
                        <div style="font-weight: 500;">${customer.name}</div>
                        <div style="font-size: 14px; color: #666;">${customer.email || 'No email'} • ${customer.phone || 'No phone'}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function selectCustomerFromList(customerId) {
    navigateToCustomer(customerId);
}

function filterCustomerList(searchTerm) {
    const customerList = document.getElementById('customerList');
    const filteredCustomers = searchCustomers(searchTerm);

    customerList.innerHTML = filteredCustomers.map((customer, index) => `
        <div onclick="selectCustomerFromList('${customer.id}'); this.closest('div').parentElement.parentElement.remove();"
             style="padding: 12px; border-bottom: 1px solid #eee; cursor: pointer;"
             onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='transparent'">
            <div style="font-weight: 500;">${customer.name}</div>
            <div style="font-size: 14px; color: #666;">${customer.email || 'No email'} • ${customer.phone || 'No phone'}</div>
        </div>
    `).join('');
}

// Update customer counter display
function updateCustomerCounter() {
    const customerCounter = document.getElementById('customerCounter');
    if (customerCounter && allCustomers.length > 0) {
        customerCounter.textContent = `${currentCustomerIndex + 1} of ${allCustomers.length}`;
    }
}

// Initialize when DOM is loaded - Remove duplicate
// (This function is already called at the top of the file)
