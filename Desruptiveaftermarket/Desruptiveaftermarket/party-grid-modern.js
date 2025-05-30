// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const normalSearch = document.getElementById('normalSearch');
    const voiceSearchBtn = document.getElementById('voiceSearchBtn');
    const partyTypeSelect = document.getElementById('partyTypeSelect');
    const partyTypeFilters = document.getElementById('partyTypeFilters');
    const statusFilters = document.getElementById('statusFilters');
    const cityFilters = document.getElementById('cityFilters');
    const clearAllFilters = document.getElementById('clearAllFilters');
    const advancedSearchToggle = document.getElementById('advancedSearchToggle');
    const advancedSearchPanel = document.getElementById('advancedSearchPanel');
    const closeAdvancedSearch = document.getElementById('closeAdvancedSearch');
    const partyTableBody = document.getElementById('partyTableBody');
    const selectAll = document.getElementById('selectAll');
    const deleteSelected = document.getElementById('deleteSelected');
    const exportData = document.getElementById('exportData');
    const refreshGrid = document.getElementById('refreshGrid');
    const menuToggle = document.querySelector('.menu-toggle');

    // Party data
    const partyData = getPartyData();

    // Current filtered data
    let filteredData = [...partyData];

    // Party type filter
    let selectedPartyType = '';

    // Quick filter state
    const activeQuickFilters = {
        partyType: [],
        status: [],
        city: []
    };

    // Initialize the grid
    populatePartyTable(partyData);

    // Initialize quick filters
    initQuickFilters();

    // Set up event listeners
    setupEventListeners();

    // Initialize voice search
    initVoiceSearch();

    // Function to populate the party table
    function populatePartyTable(data) {
        partyTableBody.innerHTML = '';

        data.forEach(party => {
            const row = document.createElement('tr');

            // Create view button cell with dropdown
            const viewCell = document.createElement('td');
            viewCell.style.textAlign = 'center';

            // Create dropdown container
            const dropdownContainer = document.createElement('div');
            dropdownContainer.style.position = 'relative';
            dropdownContainer.style.display = 'inline-block';

            const viewButton = document.createElement('button');
            viewButton.className = 'view-button';
            viewButton.dataset.partyId = party.id;
            viewButton.innerHTML = '<i class="material-icons">visibility</i>';
            viewButton.title = 'View Options';

            // Create dropdown menu
            const dropdownMenu = document.createElement('div');
            dropdownMenu.className = 'dropdown-menu';
            dropdownMenu.style.cssText = `
                position: absolute;
                top: 100%;
                right: 0;
                background: white;
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius);
                box-shadow: var(--shadow);
                min-width: 180px;
                z-index: 1000;
                display: none;
            `;

            dropdownMenu.innerHTML = `
                <div class="dropdown-item" data-action="details" style="padding: 12px 16px; cursor: pointer; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; gap: 8px;">
                    <i class="material-icons" style="font-size: 16px;">info</i>
                    <span>View Details</span>
                </div>
                <div class="dropdown-item" data-action="customer360" style="padding: 12px 16px; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                    <i class="material-icons" style="font-size: 16px;">dashboard</i>
                    <span>Customer 360 View</span>
                </div>
            `;

            // Add hover effects to dropdown items
            dropdownMenu.querySelectorAll('.dropdown-item').forEach(item => {
                item.addEventListener('mouseenter', function() {
                    this.style.backgroundColor = 'var(--hover-color)';
                });
                item.addEventListener('mouseleave', function() {
                    this.style.backgroundColor = 'transparent';
                });

                item.addEventListener('click', function() {
                    const action = this.dataset.action;
                    if (action === 'details') {
                        viewPartyDetails(party.id);
                    } else if (action === 'customer360') {
                        viewCustomer360(party.id);
                    }
                    dropdownMenu.style.display = 'none';
                });
            });

            // Toggle dropdown on button click
            viewButton.addEventListener('click', function(e) {
                e.stopPropagation();
                // Hide all other dropdowns
                document.querySelectorAll('.dropdown-menu').forEach(menu => {
                    if (menu !== dropdownMenu) {
                        menu.style.display = 'none';
                    }
                });
                // Toggle current dropdown
                dropdownMenu.style.display = dropdownMenu.style.display === 'none' ? 'block' : 'none';
            });

            // Hide dropdown when clicking outside
            document.addEventListener('click', function() {
                dropdownMenu.style.display = 'none';
            });

            dropdownContainer.appendChild(viewButton);
            dropdownContainer.appendChild(dropdownMenu);
            viewCell.appendChild(dropdownContainer);

            // Create checkbox cell
            const checkboxCell = document.createElement('td');
            checkboxCell.style.textAlign = 'center';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.dataset.partyId = party.id;
            checkboxCell.appendChild(checkbox);

            // Add cells to row
            row.appendChild(viewCell);
            row.appendChild(checkboxCell);

            // Add data cells
            const fields = [
                party.id,
                party.partyType,
                party.name,
                party.contactPerson || '-',
                party.email || '-',
                party.phone || '-',
                party.city || '-',
                party.country || '-',
                party.isActive ? 'Active' : 'Inactive'
            ];

            fields.forEach(field => {
                const cell = document.createElement('td');
                cell.textContent = field;
                row.appendChild(cell);
            });

            partyTableBody.appendChild(row);
        });

        // If no data, show a message
        if (data.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 11;
            cell.style.textAlign = 'center';
            cell.style.padding = '24px';
            cell.textContent = 'No party data found. Try changing your filters.';
            row.appendChild(cell);
            partyTableBody.appendChild(row);
        }
    }

    // Function to initialize quick filters
    function initQuickFilters() {
        // Create party type filters
        createQuickFilter('Customer', 'partyType', 'fas fa-user-tie', partyTypeFilters);
        createQuickFilter('Vendor', 'partyType', 'fas fa-truck', partyTypeFilters);
        createQuickFilter('Manufacturer', 'partyType', 'fas fa-industry', partyTypeFilters);
        createQuickFilter('Transporter', 'partyType', 'fas fa-shipping-fast', partyTypeFilters);
        createQuickFilter('Prospect', 'partyType', 'fas fa-handshake', partyTypeFilters);
        createQuickFilter('Contractor', 'partyType', 'fas fa-hard-hat', partyTypeFilters);

        // Create status filters
        createQuickFilter('Active', 'status', 'fas fa-check-circle', statusFilters);
        createQuickFilter('Inactive', 'status', 'fas fa-times-circle', statusFilters);

        // Create city filters (top cities)
        const cities = [...new Set(partyData.map(party => party.city))].filter(Boolean);
        const topCities = cities.slice(0, 5);
        topCities.forEach(city => {
            createQuickFilter(city, 'city', 'fas fa-city', cityFilters);
        });

        // Add clear all filters event listener
        clearAllFilters.addEventListener('click', function() {
            // Clear all active filters
            document.querySelectorAll('.quick-filter.active').forEach(filter => {
                filter.classList.remove('active');
            });

            // Reset active filters object
            Object.keys(activeQuickFilters).forEach(key => {
                activeQuickFilters[key] = [];
            });

            // Reset party type select
            partyTypeSelect.value = '';
            selectedPartyType = '';

            // Apply filters (which will show all data)
            applyFilters();

            // Show notification
            showNotification('All filters cleared', 'info');
        });
    }

    // Function to create a quick filter
    function createQuickFilter(value, type, iconClass, container) {
        const filter = document.createElement('div');
        filter.className = 'quick-filter';
        filter.dataset.type = type;
        filter.dataset.value = value;

        // For status filters, convert to boolean value
        if (type === 'status') {
            filter.dataset.boolValue = value === 'Active' ? 'true' : 'false';
        }

        filter.innerHTML = `
            <i class="${iconClass}"></i> ${value}
            <span class="quick-filter-close">×</span>
        `;

        container.appendChild(filter);
    }

    // Function to set up event listeners
    function setupEventListeners() {
        // Party type select change
        partyTypeSelect.addEventListener('change', function() {
            selectedPartyType = this.value;
            applyFilters();
        });

        // Quick filter clicks for all filter containers
        const allFilterContainers = [partyTypeFilters, statusFilters, cityFilters];
        allFilterContainers.forEach(container => {
            container.addEventListener('click', function(e) {
                const filter = e.target.closest('.quick-filter');
                if (!filter) return;

                // If clicked on close button, remove the filter
                if (e.target.classList.contains('quick-filter-close')) {
                    deactivateQuickFilter(filter);
                    return;
                }

                // Toggle active state
                toggleQuickFilter(filter);
            });
        });

        // Normal search input
        normalSearch.addEventListener('input', function() {
            applyFilters();
        });

        // Select all checkbox
        selectAll.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('#partyTableBody input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });

        // Delete selected button
        deleteSelected.addEventListener('click', function() {
            const selectedCheckboxes = document.querySelectorAll('#partyTableBody input[type="checkbox"]:checked');
            if (selectedCheckboxes.length === 0) {
                showNotification('No parties selected for deletion.', 'warning');
                return;
            }

            // In a real application, you would delete the selected parties
            showNotification(`${selectedCheckboxes.length} parties would be deleted.`, 'error');
        });

        // Advanced search toggle
        advancedSearchToggle.addEventListener('click', function() {
            advancedSearchPanel.classList.toggle('active');

            // If panel is now active, populate it with search options
            if (advancedSearchPanel.classList.contains('active')) {
                populateAdvancedSearchPanel();
            }
        });

        // Close advanced search
        closeAdvancedSearch.addEventListener('click', function() {
            advancedSearchPanel.classList.remove('active');
        });

        // Export data button
        exportData.addEventListener('click', function() {
            // In a real application, you would export the data to CSV/Excel
            showNotification('Data export functionality would trigger here.', 'info');
        });

        // Refresh grid button
        refreshGrid.addEventListener('click', function() {
            // Show loading animation
            const icon = this.querySelector('i');
            icon.classList.add('rotating');
            icon.style.animation = 'spin 1s linear infinite';

            // Disable the button during refresh
            this.disabled = true;

            // In a real application, you would fetch fresh data
            // Simulate network delay
            setTimeout(() => {
                filteredData = [...partyData];
                populatePartyTable(filteredData);

                // Stop loading animation
                icon.style.animation = '';
                icon.classList.remove('rotating');

                // Re-enable the button
                this.disabled = false;

                showNotification('Grid refreshed with latest data.', 'success');
            }, 800);
        });

        // Menu toggle
        menuToggle.addEventListener('click', function() {
            document.body.classList.toggle('menu-open');
        });
    }

    // Function to toggle a quick filter
    function toggleQuickFilter(filter) {
        filter.classList.toggle('active');

        const type = filter.dataset.type;
        const value = filter.dataset.value;

        // Update active filters
        if (filter.classList.contains('active')) {
            if (!activeQuickFilters[type].includes(value)) {
                activeQuickFilters[type].push(value);
            }
        } else {
            deactivateQuickFilter(filter);
        }

        applyFilters();
    }

    // Function to deactivate a quick filter
    function deactivateQuickFilter(filter) {
        filter.classList.remove('active');

        const type = filter.dataset.type;
        const value = filter.dataset.value;

        // Remove from active filters
        const index = activeQuickFilters[type].indexOf(value);
        if (index !== -1) {
            activeQuickFilters[type].splice(index, 1);
        }

        applyFilters();
    }

    // Function to apply filters
    function applyFilters() {
        let result = [...partyData];

        // Apply party type select filter
        if (selectedPartyType) {
            result = result.filter(party => party.partyType === selectedPartyType);
        }

        // Apply quick filters
        if (activeQuickFilters.partyType.length > 0) {
            result = result.filter(party => activeQuickFilters.partyType.includes(party.partyType));
        }

        if (activeQuickFilters.status.length > 0) {
            result = result.filter(party => {
                if (activeQuickFilters.status.includes('Active') && party.isActive) return true;
                if (activeQuickFilters.status.includes('Inactive') && !party.isActive) return true;
                return false;
            });
        }

        if (activeQuickFilters.city.length > 0) {
            result = result.filter(party => activeQuickFilters.city.includes(party.city));
        }

        // Apply normal search
        const searchTerm = normalSearch.value.trim().toLowerCase();
        if (searchTerm) {
            result = result.filter(party => {
                return Object.values(party).some(value => {
                    if (value === null || value === undefined) return false;
                    return String(value).toLowerCase().includes(searchTerm);
                });
            });
        }

        // Update filtered data and table
        filteredData = result;
        populatePartyTable(filteredData);
    }

    // Function to initialize voice search
    function initVoiceSearch() {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onresult = function(event) {
                const transcript = event.results[0][0].transcript;
                normalSearch.value = transcript;
                applyFilters();
            };

            voiceSearchBtn.addEventListener('click', function() {
                recognition.start();
                showNotification('Listening...', 'info');
            });
        } else {
            voiceSearchBtn.style.display = 'none';
        }
    }

    // Function to view party details
    function viewPartyDetails(partyId) {
        const party = partyData.find(p => p.id === partyId);
        if (!party) return;

        // Get modal elements
        const modal = document.getElementById('partyDetailsModal');
        const modalTitle = modal.querySelector('.modal-title');
        const modalContent = document.getElementById('partyDetailsContent');
        const closeBtn = document.getElementById('closePartyDetailsModal');
        const editBtn = document.getElementById('editPartyBtn');

        // Set modal title
        modalTitle.textContent = `${party.name} (${party.partyType})`;

        // Clear previous content
        modalContent.innerHTML = '';

        // Create detail fields
        const fields = [
            { label: 'Party ID', value: party.id },
            { label: 'Party Type', value: party.partyType },
            { label: 'Name', value: party.name },
            { label: 'Contact Person', value: party.contactPerson || '-' },
            { label: 'Email', value: party.email || '-' },
            { label: 'Phone', value: party.phone || '-' },
            { label: 'Address', value: party.address || '-' },
            { label: 'City', value: party.city || '-' },
            { label: 'Country', value: party.country || '-' },
            { label: 'Status', value: party.isActive ? 'Active' : 'Inactive' },
            { label: 'Company', value: party.company || '-' },
            { label: 'Branch', value: party.branch || '-' },
            { label: 'Region', value: party.region || '-' }
        ];

        // Add fields to modal
        fields.forEach(field => {
            const fieldContainer = document.createElement('div');
            fieldContainer.className = 'detail-field';
            fieldContainer.innerHTML = `
                <label style="display: block; font-size: 12px; color: var(--accent-color); margin-bottom: 4px;">${field.label}</label>
                <div style="font-size: 16px; font-weight: 500;">${field.value}</div>
            `;
            modalContent.appendChild(fieldContainer);
        });

        // Show modal
        modal.style.display = 'flex';

        // Add close button event listener
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });

        // Add edit button event listener
        editBtn.addEventListener('click', function() {
            // In a real application, you would open an edit form
            modal.style.display = 'none';
            showNotification(`Edit functionality would open for ${party.name}`, 'info');
        });

        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Function to populate advanced search panel
    function populateAdvancedSearchPanel() {
        const panelBody = document.querySelector('.panel-body');

        // Clear existing content
        panelBody.innerHTML = '';

        // Create advanced search form
        const form = document.createElement('form');
        form.id = 'advancedSearchForm';
        form.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; margin-bottom: 16px;">
                <div>
                    <label for="advPartyId">Party ID</label>
                    <input type="text" id="advPartyId" class="search-input" style="margin-top: 8px;">
                </div>
                <div>
                    <label for="advPartyType">Party Type</label>
                    <select id="advPartyType" class="party-type-select" style="margin-top: 8px;">
                        <option value="">All Types</option>
                        <option value="Customer">Customer</option>
                        <option value="Prospect">Prospect</option>
                        <option value="OutsideAgency">Outside Agency</option>
                        <option value="Manufacturer">Manufacturer</option>
                        <option value="ClearingAgent">Clearing Agent</option>
                        <option value="Transporter">Transporter</option>
                        <option value="Insurance">Insurance</option>
                        <option value="Financier">Financier</option>
                        <option value="User">User</option>
                        <option value="Vendor">Vendor</option>
                        <option value="Contractor">Contractor</option>
                    </select>
                </div>
                <div>
                    <label for="advName">Name</label>
                    <input type="text" id="advName" class="search-input" style="margin-top: 8px;">
                </div>
                <div>
                    <label for="advEmail">Email</label>
                    <input type="text" id="advEmail" class="search-input" style="margin-top: 8px;">
                </div>
                <div>
                    <label for="advCity">City</label>
                    <input type="text" id="advCity" class="search-input" style="margin-top: 8px;">
                </div>
                <div>
                    <label for="advStatus">Status</label>
                    <select id="advStatus" class="party-type-select" style="margin-top: 8px;">
                        <option value="">All</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 16px;">
                <button type="button" id="clearAdvSearch" style="padding: 12px 16px; border: 1px solid var(--border-color); background: white; border-radius: 4px; cursor: pointer;">
                    Clear
                </button>
                <button type="submit" style="padding: 12px 16px; background: var(--primary-color); color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Search
                </button>
            </div>
        `;

        panelBody.appendChild(form);

        // Add event listeners
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            applyAdvancedSearch();
        });

        document.getElementById('clearAdvSearch').addEventListener('click', function() {
            form.reset();
        });
    }

    // Function to apply advanced search
    function applyAdvancedSearch() {
        const partyId = document.getElementById('advPartyId').value.trim();
        const partyType = document.getElementById('advPartyType').value;
        const name = document.getElementById('advName').value.trim();
        const email = document.getElementById('advEmail').value.trim();
        const city = document.getElementById('advCity').value.trim();
        const status = document.getElementById('advStatus').value;

        let result = [...partyData];

        if (partyId) {
            result = result.filter(party => party.id.toLowerCase().includes(partyId.toLowerCase()));
        }

        if (partyType) {
            result = result.filter(party => party.partyType === partyType);
        }

        if (name) {
            result = result.filter(party => party.name.toLowerCase().includes(name.toLowerCase()));
        }

        if (email) {
            result = result.filter(party => party.email && party.email.toLowerCase().includes(email.toLowerCase()));
        }

        if (city) {
            result = result.filter(party => party.city && party.city.toLowerCase().includes(city.toLowerCase()));
        }

        if (status) {
            const isActive = status === 'active';
            result = result.filter(party => party.isActive === isActive);
        }

        // Update filtered data and table
        filteredData = result;
        populatePartyTable(filteredData);

        // Close the panel
        advancedSearchPanel.classList.remove('active');

        // Show notification
        showNotification(`Found ${result.length} matching parties.`, 'info');
    }

    // Function to view Customer 360
    function viewCustomer360(partyId) {
        // Open Customer 360 View in new tab
        window.open(`customer-360-view.html?customerId=${partyId}`, '_blank');
    }

    // Function to show notification
    function showNotification(message, type) {
        // Create notification element if it doesn't exist
        let notification = document.getElementById('notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'notification';
            notification.style.position = 'fixed';
            notification.style.bottom = '24px';
            notification.style.right = '24px';
            notification.style.padding = '16px 24px';
            notification.style.borderRadius = '4px';
            notification.style.color = 'white';
            notification.style.fontWeight = '500';
            notification.style.boxShadow = '0 3px 6px rgba(0, 0, 0, 0.16)';
            notification.style.transform = 'translateY(100px)';
            notification.style.opacity = '0';
            notification.style.transition = 'transform 0.3s, opacity 0.3s';
            notification.style.zIndex = '1000';
            document.body.appendChild(notification);
        }

        // Set notification content and type
        notification.textContent = message;

        // Set background color based on type
        switch (type) {
            case 'success':
                notification.style.backgroundColor = '#4caf50';
                break;
            case 'error':
                notification.style.backgroundColor = '#f44336';
                break;
            case 'warning':
                notification.style.backgroundColor = '#ff9800';
                break;
            case 'info':
            default:
                notification.style.backgroundColor = '#2196f3';
                break;
        }

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
});

// Function to generate party data
function getPartyData() {
    return [
        {
            id: 'P001',
            partyType: 'Customer',
            name: 'Acme Corporation',
            contactPerson: 'John Smith',
            email: 'john@acme.com',
            phone: '555-1234',
            address: '123 Main St',
            city: 'New York',
            country: 'USA',
            isActive: true,
            company: 'TechCorp',
            branch: 'East Branch',
            region: 'Northeast',
            tenantId: 'tenant1',
            entityId: 'entity1'
        },
        {
            id: 'P002',
            partyType: 'Vendor',
            name: 'Global Supplies Inc',
            contactPerson: 'Jane Doe',
            email: 'jane@globalsupplies.com',
            phone: '555-5678',
            address: '456 Oak Ave',
            city: 'Chicago',
            country: 'USA',
            isActive: true,
            company: 'TechCorp',
            branch: 'Midwest Branch',
            region: 'Central',
            tenantId: 'tenant1',
            entityId: 'entity1'
        },
        {
            id: 'P003',
            partyType: 'Manufacturer',
            name: 'Tech Manufacturing Ltd',
            contactPerson: 'Robert Johnson',
            email: 'robert@techmanufacturing.com',
            phone: '555-9012',
            address: '789 Pine Rd',
            city: 'Los Angeles',
            country: 'USA',
            isActive: true,
            company: 'GlobalTech',
            branch: 'West Branch',
            region: 'West',
            tenantId: 'tenant2',
            entityId: 'entity6'
        },
        {
            id: 'P004',
            partyType: 'Transporter',
            name: 'Fast Logistics',
            contactPerson: 'Sarah Williams',
            email: 'sarah@fastlogistics.com',
            phone: '555-3456',
            address: '321 Elm Blvd',
            city: 'Miami',
            country: 'USA',
            isActive: false,
            company: 'TechCorp',
            branch: 'East Branch',
            region: 'Southeast',
            tenantId: 'tenant1',
            entityId: 'entity1'
        },
        {
            id: 'P005',
            partyType: 'Insurance',
            name: 'Secure Insurance Co',
            contactPerson: 'Michael Brown',
            email: 'michael@secureinsurance.com',
            phone: '555-7890',
            address: '654 Birch Ln',
            city: 'Boston',
            country: 'USA',
            isActive: true,
            company: 'TechCorp',
            branch: 'East Branch',
            region: 'Northeast',
            tenantId: 'tenant1',
            entityId: 'entity1'
        },
        {
            id: 'P006',
            partyType: 'Customer',
            name: 'Beta Industries',
            contactPerson: 'Emily Davis',
            email: 'emily@betaindustries.com',
            phone: '555-2345',
            address: '987 Cedar St',
            city: 'Dallas',
            country: 'USA',
            isActive: true,
            company: 'GlobalTech',
            branch: 'South Branch',
            region: 'South',
            tenantId: 'tenant2',
            entityId: 'entity6'
        },
        {
            id: 'P007',
            partyType: 'Prospect',
            name: 'Future Client LLC',
            contactPerson: 'David Wilson',
            email: 'david@futureclient.com',
            phone: '555-6789',
            address: '753 Maple Ave',
            city: 'Seattle',
            country: 'USA',
            isActive: true,
            company: 'GlobalTech',
            branch: 'West Branch',
            region: 'Northwest',
            tenantId: 'tenant2',
            entityId: 'entity6'
        },
        {
            id: 'P008',
            partyType: 'Contractor',
            name: 'Build Right Construction',
            contactPerson: 'Thomas Anderson',
            email: 'thomas@buildright.com',
            phone: '555-0123',
            address: '159 Walnut Rd',
            city: 'Denver',
            country: 'USA',
            isActive: false,
            company: 'TechCorp',
            branch: 'Midwest Branch',
            region: 'Central',
            tenantId: 'tenant1',
            entityId: 'entity1'
        },
        {
            id: 'P009',
            partyType: 'Clearing Agent',
            name: 'Clear Customs Agency',
            contactPerson: 'Jessica Martinez',
            email: 'jessica@clearcustoms.com',
            phone: '555-4567',
            address: '357 Pine St',
            city: 'San Francisco',
            country: 'USA',
            isActive: true,
            company: 'GlobalTech',
            branch: 'West Branch',
            region: 'West',
            tenantId: 'tenant2',
            entityId: 'entity6'
        },
        {
            id: 'P010',
            partyType: 'Financier',
            name: 'Capital Funding Group',
            contactPerson: 'Andrew Taylor',
            email: 'andrew@capitalfunding.com',
            phone: '555-8901',
            address: '852 Oak Blvd',
            city: 'Atlanta',
            country: 'USA',
            isActive: true,
            company: 'TechCorp',
            branch: 'East Branch',
            region: 'Southeast',
            tenantId: 'tenant1',
            entityId: 'entity1'
        },
        {
            id: 'P011',
            partyType: 'Outside Agency',
            name: 'External Services Inc',
            contactPerson: 'Olivia Johnson',
            email: 'olivia@externalservices.com',
            phone: '555-2345',
            address: '753 First Ave',
            city: 'Phoenix',
            country: 'USA',
            isActive: true,
            company: 'GlobalTech',
            branch: 'West Branch',
            region: 'Southwest',
            tenantId: 'tenant2',
            entityId: 'entity6'
        },
        {
            id: 'P012',
            partyType: 'User',
            name: 'System Admin',
            contactPerson: 'Admin User',
            email: 'admin@system.com',
            phone: '555-6789',
            address: '123 Tech Blvd',
            city: 'Austin',
            country: 'USA',
            isActive: true,
            company: 'TechCorp',
            branch: 'Headquarters',
            region: 'Central',
            tenantId: 'tenant1',
            entityId: 'entity1'
        }
    ];
}
