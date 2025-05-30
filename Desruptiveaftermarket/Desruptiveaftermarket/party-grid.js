// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Material Design Lite components
    if (typeof componentHandler !== 'undefined') {
        componentHandler.upgradeAllRegistered();
    } else {
        // If componentHandler is not available yet, wait for it
        setTimeout(function() {
            if (typeof componentHandler !== 'undefined') {
                componentHandler.upgradeAllRegistered();
            }
        }, 500);
    }

    // Get DOM elements
    const partyTypeSelect = document.getElementById('partyTypeSelect');
    const quickFilters = document.getElementById('quickFilters');
    const normalSearch = document.getElementById('normalSearch');
    const voiceSearchBtn = document.getElementById('voiceSearchBtn');
    const notification = document.getElementById('notification');
    const tableBody = document.querySelector('.mdl-data-table tbody');
    const checkboxAll = document.getElementById('checkbox-all');

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
        tableBody.innerHTML = '';

        data.forEach(party => {
            const row = document.createElement('tr');

            // View button
            row.innerHTML = `
                <td class="view-cell">
                    <button class="view-party" data-party-id="${party.id}">
                        <i class="material-icons">visibility</i>
                    </button>
                </td>
                <td>
                    <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-table__select" for="checkbox-${party.id}">
                        <input type="checkbox" id="checkbox-${party.id}" class="mdl-checkbox__input">
                    </label>
                </td>
                <td>${party.id}</td>
                <td class="mdl-data-table__cell--non-numeric">${party.partyType}</td>
                <td class="mdl-data-table__cell--non-numeric">${party.name}</td>
                <td class="mdl-data-table__cell--non-numeric">${party.contactPerson || '-'}</td>
                <td class="mdl-data-table__cell--non-numeric">${party.email || '-'}</td>
                <td>${party.phone || '-'}</td>
                <td class="mdl-data-table__cell--non-numeric">${party.address || '-'}</td>
                <td class="mdl-data-table__cell--non-numeric">${party.city || '-'}</td>
                <td class="mdl-data-table__cell--non-numeric">${party.country || '-'}</td>
                <td>${party.isActive ? 'Yes' : 'No'}</td>
            `;

            tableBody.appendChild(row);
        });

        // Initialize all checkboxes after adding them to the DOM
        if (typeof componentHandler !== 'undefined') {
            // Initialize all checkboxes
            const checkboxes = document.querySelectorAll('.mdl-checkbox');
            checkboxes.forEach(checkbox => {
                componentHandler.upgradeElement(checkbox);
            });

            // Initialize all ripple effects
            const ripples = document.querySelectorAll('.mdl-js-ripple-effect');
            ripples.forEach(ripple => {
                if (!ripple.classList.contains('is-upgraded')) {
                    componentHandler.upgradeElement(ripple);
                }
            });
        };

        // If no data, show a message
        if (data.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td colspan="12" style="text-align: center; padding: 24px;">
                    No party data found. Try changing your filters.
                </td>
            `;
            tableBody.appendChild(row);
        }
    }

    // Function to initialize quick filters
    function initQuickFilters() {
        // Get unique party types
        const partyTypes = [...new Set(partyData.map(party => party.partyType))];

        // Get unique cities (limited to top 5)
        const cities = [...new Set(partyData.map(party => party.city))].filter(Boolean).slice(0, 5);

        // Create party type filters
        partyTypes.forEach(type => {
            const filter = document.createElement('div');
            filter.className = 'quick-filter';
            filter.dataset.type = 'partyType';
            filter.dataset.value = type;
            filter.innerHTML = `
                ${type}
                <span class="quick-filter-close">×</span>
            `;
            quickFilters.appendChild(filter);
        });

        // Create status filters
        const statusFilter1 = document.createElement('div');
        statusFilter1.className = 'quick-filter';
        statusFilter1.dataset.type = 'status';
        statusFilter1.dataset.value = 'active';
        statusFilter1.innerHTML = `
            Active
            <span class="quick-filter-close">×</span>
        `;
        quickFilters.appendChild(statusFilter1);

        const statusFilter2 = document.createElement('div');
        statusFilter2.className = 'quick-filter';
        statusFilter2.dataset.type = 'status';
        statusFilter2.dataset.value = 'inactive';
        statusFilter2.innerHTML = `
            Inactive
            <span class="quick-filter-close">×</span>
        `;
        quickFilters.appendChild(statusFilter2);

        // Create city filters
        cities.forEach(city => {
            const filter = document.createElement('div');
            filter.className = 'quick-filter';
            filter.dataset.type = 'city';
            filter.dataset.value = city;
            filter.innerHTML = `
                ${city}
                <span class="quick-filter-close">×</span>
            `;
            quickFilters.appendChild(filter);
        });
    }

    // Function to set up event listeners
    function setupEventListeners() {
        // Party type select change
        partyTypeSelect.addEventListener('change', function() {
            selectedPartyType = this.value;
            applyFilters();
        });

        // Make party type dropdown searchable
        initSearchableDropdown(partyTypeSelect);

        // Quick filter click
        quickFilters.addEventListener('click', function(e) {
            const filter = e.target.closest('.quick-filter');
            if (!filter) return;

            const type = filter.dataset.type;
            const value = filter.dataset.value;

            // Toggle active state
            filter.classList.toggle('active');

            // Update active filters
            if (filter.classList.contains('active')) {
                if (!activeQuickFilters[type].includes(value)) {
                    activeQuickFilters[type].push(value);
                }
            } else {
                const index = activeQuickFilters[type].indexOf(value);
                if (index !== -1) {
                    activeQuickFilters[type].splice(index, 1);
                }
            }

            applyFilters();
        });

        // Close button on quick filter
        quickFilters.addEventListener('click', function(e) {
            if (e.target.classList.contains('quick-filter-close')) {
                const filter = e.target.closest('.quick-filter');
                if (!filter) return;

                const type = filter.dataset.type;
                const value = filter.dataset.value;

                // Remove from active filters
                const index = activeQuickFilters[type].indexOf(value);
                if (index !== -1) {
                    activeQuickFilters[type].splice(index, 1);
                }

                // Remove active class
                filter.classList.remove('active');

                applyFilters();
            }
        });

        // Normal search input
        normalSearch.addEventListener('input', function() {
            applyFilters();
        });

        // Select all checkbox
        checkboxAll.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.mdl-data-table tbody .mdl-checkbox__input');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
                checkbox.parentElement.classList.toggle('is-checked', this.checked);
            });
        });

        // Delete selected button
        document.getElementById('deleteSelected').addEventListener('click', function() {
            const selectedCheckboxes = document.querySelectorAll('.mdl-data-table tbody .mdl-checkbox__input:checked');
            if (selectedCheckboxes.length === 0) {
                showNotification('No parties selected for deletion.', 'warning');
                return;
            }

            // In a real application, you would delete the selected parties
            showNotification(`${selectedCheckboxes.length} parties would be deleted.`, 'error');
        });

        // Advanced search button
        document.getElementById('advancedSearch').addEventListener('click', function() {
            // In a real application, you would open an advanced search panel
            showNotification('Advanced search functionality would open here.', 'info');
        });

        // Export data button
        document.getElementById('exportData').addEventListener('click', function() {
            // In a real application, you would export the data to CSV/Excel
            showNotification('Data export functionality would trigger here.', 'info');
        });

        // Refresh grid button
        document.getElementById('refreshGrid').addEventListener('click', function() {
            // In a real application, you would fetch fresh data
            showNotification('Grid refreshed with latest data.', 'success');
            filteredData = [...partyData];
            populatePartyTable(filteredData);
        });

        // View party buttons
        tableBody.addEventListener('click', function(e) {
            const viewBtn = e.target.closest('.view-party');
            if (!viewBtn) return;

            const partyId = viewBtn.dataset.partyId;
            const party = partyData.find(p => p.id === partyId);

            if (party) {
                // In a real application, you would open a modal with party details
                showNotification(`Viewing details for ${party.name}`, 'info');
            }
        });
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
                if (activeQuickFilters.status.includes('active') && party.isActive) return true;
                if (activeQuickFilters.status.includes('inactive') && !party.isActive) return true;
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

    // Function to show notification
    function showNotification(message, type) {
        // Set notification content and type
        notification.textContent = message;
        notification.className = `notification ${type}`;

        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
});

// Function to initialize searchable dropdown
function initSearchableDropdown(selectElement) {
    // Get the parent element
    const parent = selectElement.parentElement;

    // Create a custom select container
    const customSelect = document.createElement('div');
    customSelect.className = 'custom-select';

    // Create the selected value display
    const selectedDisplay = document.createElement('div');
    selectedDisplay.className = 'selected-display';

    // Create the text display
    const selectedText = document.createElement('span');
    selectedText.textContent = selectElement.options[selectElement.selectedIndex]?.text || '--Select--';

    // Create the dropdown arrow
    const arrow = document.createElement('span');
    arrow.innerHTML = '<i class="fas fa-chevron-down"></i>';

    // Add text and arrow to the display
    selectedDisplay.appendChild(selectedText);
    selectedDisplay.appendChild(arrow);

    // Create the dropdown container
    const dropdown = document.createElement('div');
    dropdown.className = 'dropdown';
    dropdown.style.display = 'none';

    // Create search input if there are 10+ options
    let searchInput = null;
    if (selectElement.options.length >= 10) {
        searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search...';
        searchInput.style.width = '100%';
        searchInput.style.padding = '10px';
        searchInput.style.border = 'none';
        searchInput.style.borderBottom = '1px solid #e0e0e0';
        searchInput.style.boxSizing = 'border-box';
        dropdown.appendChild(searchInput);
    }

    // Create the options list
    const optionsList = document.createElement('div');
    optionsList.className = 'options-list';

    // Add options to the list
    Array.from(selectElement.options).forEach(option => {
        if (!option.value) return; // Skip empty option

        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.dataset.value = option.value;
        optionElement.textContent = option.text;

        // Highlight if selected
        if (option.selected) {
            optionElement.style.backgroundColor = '#f5f5f5';
        }

        // Click event
        optionElement.addEventListener('click', function() {
            // Update the native select
            selectElement.value = this.dataset.value;

            // Trigger change event
            const event = new Event('change', { bubbles: true });
            selectElement.dispatchEvent(event);

            // Update the display text
            selectedText.textContent = this.textContent;

            // Close the dropdown
            dropdown.style.display = 'none';

            // Update styling
            Array.from(optionsList.children).forEach(opt => {
                opt.style.backgroundColor = '';
            });
            this.style.backgroundColor = '#f5f5f5';
        });

        optionsList.appendChild(optionElement);
    });

    dropdown.appendChild(optionsList);

    // Add everything to the custom select
    customSelect.appendChild(selectedDisplay);
    customSelect.appendChild(dropdown);

    // Hide the original select
    selectElement.style.display = 'none';

    // Insert the custom select after the original
    parent.insertBefore(customSelect, selectElement.nextSibling);

    // Toggle dropdown on click
    selectedDisplay.addEventListener('click', function() {
        const isVisible = dropdown.style.display === 'block';
        dropdown.style.display = isVisible ? 'none' : 'block';

        // Focus search input if it exists
        if (!isVisible && searchInput) {
            searchInput.focus();
        }
    });

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            Array.from(optionsList.children).forEach(option => {
                const text = option.textContent.toLowerCase();
                option.style.display = text.includes(searchTerm) ? 'block' : 'none';
            });
        });

        // Prevent dropdown from closing when clicking in the search input
        searchInput.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!customSelect.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });
}

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
            partyType: 'Outside Agency Name',
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
