/**
 * Integration Dashboard
 * 
 * This file provides the functionality for the integration dashboard,
 * including status updates, activity logs, and integration controls.
 */

// Integration activity log
let activityLog = [];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Integration Dashboard...');
    
    // Set up event listeners
    setupEventListeners();
    
    // Load initial data
    loadIntegrationStatus();
    loadActivityLog();
    
    // Set up tab switching
    setupTabs();
});

// Set up event listeners
function setupEventListeners() {
    // Sync all button
    const syncAllBtn = document.getElementById('syncAllBtn');
    if (syncAllBtn) {
        syncAllBtn.addEventListener('click', function() {
            syncAll();
        });
    }
    
    // Configure button
    const configureBtn = document.getElementById('configureBtn');
    if (configureBtn) {
        configureBtn.addEventListener('click', function() {
            showConfigurationModal();
        });
    }
    
    // Refresh activity button
    const refreshActivityBtn = document.getElementById('refreshActivityBtn');
    if (refreshActivityBtn) {
        refreshActivityBtn.addEventListener('click', function() {
            loadActivityLog();
        });
    }
    
    // Individual sync buttons
    const syncErpBtn = document.getElementById('syncErpBtn');
    if (syncErpBtn) {
        syncErpBtn.addEventListener('click', function() {
            syncSystem('ERP');
        });
    }
    
    const syncCrmBtn = document.getElementById('syncCrmBtn');
    if (syncCrmBtn) {
        syncCrmBtn.addEventListener('click', function() {
            syncSystem('CRM');
        });
    }
    
    const syncProcurementBtn = document.getElementById('syncProcurementBtn');
    if (syncProcurementBtn) {
        syncProcurementBtn.addEventListener('click', function() {
            syncSystem('PROCUREMENT');
        });
    }
}

// Set up tab switching
function setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all tab content
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Show selected tab content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
}

// Load integration status
function loadIntegrationStatus() {
    // Get status from integration service
    const status = IntegrationService.getIntegrationStatus();
    
    // Update ERP status
    updateStatusCard('erp', status.ERP);
    
    // Update CRM status
    updateStatusCard('crm', status.CRM);
    
    // Update Procurement status
    updateStatusCard('procurement', status.PROCUREMENT);
}

// Update status card
function updateStatusCard(system, status) {
    const statusElement = document.getElementById(`${system}Status`);
    const lastSyncElement = document.getElementById(`${system}LastSync`);
    const syncCountElement = document.getElementById(`${system}SyncCount`);
    const statusIconElement = document.getElementById(`${system}StatusIcon`);
    
    if (statusElement) {
        statusElement.textContent = capitalizeFirstLetter(status.status);
    }
    
    if (lastSyncElement) {
        lastSyncElement.textContent = status.lastSync ? formatDate(status.lastSync) : 'Never';
    }
    
    if (syncCountElement) {
        syncCountElement.textContent = status.syncCount;
    }
    
    if (statusIconElement) {
        // Remove all status classes
        statusIconElement.classList.remove('status-idle', 'status-syncing', 'status-success', 'status-error');
        
        // Add appropriate status class
        statusIconElement.classList.add(`status-${status.status}`);
        
        // Update icon
        const iconElement = statusIconElement.querySelector('i');
        if (iconElement) {
            switch (status.status) {
                case 'idle':
                    iconElement.textContent = 'cloud_queue';
                    break;
                case 'syncing':
                    iconElement.textContent = 'sync';
                    break;
                case 'success':
                    iconElement.textContent = 'cloud_done';
                    break;
                case 'error':
                    iconElement.textContent = 'cloud_off';
                    break;
            }
        }
    }
}

// Load activity log
function loadActivityLog() {
    // In a real application, this would load from a database or API
    // For demo purposes, we'll generate some sample activity
    generateSampleActivity();
    
    // Populate activity tables
    populateActivityTables();
}

// Generate sample activity
function generateSampleActivity() {
    // Clear existing activity
    activityLog = [];
    
    // Generate sample activity for each system
    const systems = ['ERP', 'CRM', 'PROCUREMENT'];
    const events = ['Sync Started', 'Sync Completed', 'Data Updated', 'Error Occurred'];
    const statuses = ['success', 'warning', 'danger', 'info'];
    
    // Generate 20 random activities
    for (let i = 0; i < 20; i++) {
        const system = systems[Math.floor(Math.random() * systems.length)];
        const event = events[Math.floor(Math.random() * events.length)];
        let status = statuses[Math.floor(Math.random() * statuses.length)];
        
        // Make sure status matches event
        if (event === 'Sync Completed') {
            status = 'success';
        } else if (event === 'Error Occurred') {
            status = 'danger';
        }
        
        // Generate random timestamp within the last 7 days
        const timestamp = new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000));
        
        // Generate details
        let details = '';
        switch (event) {
            case 'Sync Started':
                details = `${system} sync initiated`;
                break;
            case 'Sync Completed':
                details = `${system} sync completed successfully`;
                break;
            case 'Data Updated':
                const entityTypes = ['Parties', 'Suppliers', 'Customers', 'Products', 'Contracts'];
                const entityType = entityTypes[Math.floor(Math.random() * entityTypes.length)];
                const count = Math.floor(Math.random() * 50) + 1;
                details = `${count} ${entityType} updated from ${system}`;
                break;
            case 'Error Occurred':
                const errors = [
                    'Connection timeout',
                    'Authentication failed',
                    'API rate limit exceeded',
                    'Invalid data format',
                    'Server error'
                ];
                details = `${errors[Math.floor(Math.random() * errors.length)]}`;
                break;
        }
        
        // Add to activity log
        activityLog.push({
            timestamp,
            system,
            event,
            status,
            details
        });
    }
    
    // Sort by timestamp (newest first)
    activityLog.sort((a, b) => b.timestamp - a.timestamp);
}

// Populate activity tables
function populateActivityTables() {
    // Populate all activity table
    const allActivityTable = document.getElementById('allActivityTable');
    if (allActivityTable) {
        allActivityTable.innerHTML = '';
        
        activityLog.forEach(activity => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${formatDateTime(activity.timestamp)}</td>
                <td>${activity.system}</td>
                <td>${activity.event}</td>
                <td><span class="badge badge-${activity.status}">${capitalizeFirstLetter(activity.status)}</span></td>
                <td>${activity.details}</td>
            `;
            
            allActivityTable.appendChild(row);
        });
    }
    
    // Populate system-specific tables
    const systems = ['erp', 'crm', 'procurement'];
    
    systems.forEach(system => {
        const systemTable = document.getElementById(`${system}ActivityTable`);
        if (systemTable) {
            systemTable.innerHTML = '';
            
            const systemActivities = activityLog.filter(activity => 
                activity.system.toLowerCase() === system.toUpperCase()
            );
            
            systemActivities.forEach(activity => {
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>${formatDateTime(activity.timestamp)}</td>
                    <td>${activity.event}</td>
                    <td><span class="badge badge-${activity.status}">${capitalizeFirstLetter(activity.status)}</span></td>
                    <td>${activity.details}</td>
                `;
                
                systemTable.appendChild(row);
            });
        }
    });
}

// Sync all systems
function syncAll() {
    console.log('Syncing all systems...');
    
    // Sync each system
    syncSystem('ERP');
    syncSystem('CRM');
    syncSystem('PROCUREMENT');
}

// Sync a specific system
function syncSystem(system) {
    console.log(`Syncing ${system}...`);
    
    // Call integration service to sync
    IntegrationService.syncWithExternalSystem(system);
    
    // Update status immediately to show syncing
    const status = IntegrationService.getIntegrationStatus();
    updateStatusCard(system.toLowerCase(), status[system]);
    
    // Add to activity log
    activityLog.unshift({
        timestamp: new Date(),
        system: system,
        event: 'Sync Started',
        status: 'info',
        details: `${system} sync initiated manually`
    });
    
    // Update activity tables
    populateActivityTables();
    
    // Set up listener for sync completion
    IntegrationService.addEventListener('sync_completed', function(data) {
        if (data.system === system) {
            // Update status
            const updatedStatus = IntegrationService.getIntegrationStatus();
            updateStatusCard(system.toLowerCase(), updatedStatus[system]);
            
            // Add to activity log
            activityLog.unshift({
                timestamp: new Date(),
                system: system,
                event: 'Sync Completed',
                status: 'success',
                details: `${system} sync completed successfully`
            });
            
            // Update activity tables
            populateActivityTables();
        }
    });
    
    // Set up listener for sync errors
    IntegrationService.addEventListener('sync_error', function(data) {
        if (data.system === system) {
            // Update status
            const updatedStatus = IntegrationService.getIntegrationStatus();
            updateStatusCard(system.toLowerCase(), updatedStatus[system]);
            
            // Add to activity log
            activityLog.unshift({
                timestamp: new Date(),
                system: system,
                event: 'Error Occurred',
                status: 'danger',
                details: data.error || 'Unknown error'
            });
            
            // Update activity tables
            populateActivityTables();
        }
    });
}

// Show configuration modal
function showConfigurationModal() {
    console.log('Showing configuration modal...');
    
    // In a real application, this would show a modal dialog
    // For demo purposes, we'll just log a message
    alert('Configuration modal would be shown here');
}

// Helper function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

// Helper function to format date and time
function formatDateTime(dateString) {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
