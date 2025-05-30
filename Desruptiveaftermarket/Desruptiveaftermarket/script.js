// Set up event listeners after DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the main content with grid containers
    initializeGrids();

    // Menu navigation functionality
    const navLinks = document.querySelectorAll('.nav-menu li a');
    const gridContainers = {
        'dashboard': null, // No specific grid for dashboard
        'employees': document.getElementById('employeesGrid'),
        'customers': document.getElementById('customersGrid'),
        'parts': document.getElementById('partsGrid'),
        'orders': null, // Not implemented yet
        'reports': null  // Not implemented yet
    };

    // Make gridContainers accessible globally
    window.gridContainers = gridContainers;

    // Track current active section
    let currentActiveSection = 'employees'; // Default to employees

    // Make currentActiveSection accessible globally
    window.currentActiveSection = currentActiveSection;

    // Function to show the selected grid and hide others
    function showGrid(section) {
        // Hide all grids first
        Object.values(gridContainers).forEach(grid => {
            if (grid) grid.style.display = 'none';
        });

        // Show the selected grid if it exists
        if (gridContainers[section]) {
            gridContainers[section].style.display = 'block';
            currentActiveSection = section;
            window.currentActiveSection = currentActiveSection;

            // Update the advanced search button text based on the current section
            const advancedSearchBtn = document.getElementById('toggleAdvancedSearch');
            if (advancedSearchBtn) {
                advancedSearchBtn.innerHTML = `<i class="fas fa-filter"></i> ${section.charAt(0).toUpperCase() + section.slice(1)} Advanced Search`;
            }

            // Dispatch grid change event
            const event = new CustomEvent('grid-change', {
                detail: { section: section }
            });
            document.dispatchEvent(event);
        }

        // Update active menu item
        navLinks.forEach(link => {
            link.parentElement.classList.remove('active');
            if (link.getAttribute('data-section') === section) {
                link.parentElement.classList.add('active');
            }
        });
    }

    // Add click event listeners to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showGrid(section);

            // Close menu suggestions if open
            const menuSuggestions = document.getElementById('menuSuggestions');
            menuSuggestions.classList.remove('show');
        });
    });

    // Menu suggestions functionality
    const menuSearchInput = document.getElementById('menuSearchInput');
    const menuSearchButton = document.getElementById('menuSearchButton');
    const menuSuggestions = document.getElementById('menuSuggestions');

    // Create menu items data with icons
    const menuItems = [
        { text: 'Dashboard', section: 'dashboard', icon: 'fas fa-home' },
        { text: 'Employees', section: 'employees', icon: 'fas fa-id-badge' },
        { text: 'Customers', section: 'customers', icon: 'fas fa-users' },
        { text: 'Parts', section: 'parts', icon: 'fas fa-cogs' },
        { text: 'Orders', section: 'orders', icon: 'fas fa-shopping-cart' },
        { text: 'Reports', section: 'reports', icon: 'fas fa-chart-bar' }
    ];

    // Make menuItems accessible globally
    window.menuItems = menuItems;

    // Function to show menu suggestions based on input
    function showMenuSuggestions(searchText) {
        // Clear previous suggestions
        menuSuggestions.innerHTML = '';

        if (!searchText) {
            menuSuggestions.classList.remove('show');
            return;
        }

        searchText = searchText.toLowerCase();
        let matchFound = false;

        // Filter menu items that match the search text
        const filteredItems = menuItems.filter(item =>
            item.text.toLowerCase().includes(searchText)
        );

        if (filteredItems.length > 0) {
            filteredItems.forEach(item => {
                const suggestionItem = document.createElement('div');
                suggestionItem.className = 'suggestion-item';
                suggestionItem.innerHTML = `<i class="${item.icon}"></i> ${item.text}`;
                suggestionItem.dataset.section = item.section;

                // Add click event to navigate to the section
                suggestionItem.addEventListener('click', function() {
                    showGrid(this.dataset.section);
                    menuSearchInput.value = item.text;
                    menuSuggestions.classList.remove('show');
                });

                menuSuggestions.appendChild(suggestionItem);
                matchFound = true;
            });
        }

        if (matchFound) {
            menuSuggestions.classList.add('show');
        } else {
            menuSuggestions.classList.remove('show');
        }
    }

    // Function to search menus and navigate
    function searchMenus(searchText) {
        if (!searchText) return;

        searchText = searchText.toLowerCase();
        let foundItems = [];

        // Reset all menu items to normal state
        navLinks.forEach(item => {
            item.style.backgroundColor = '';
            item.parentElement.classList.remove('search-highlight');
        });

        // Search through menu items
        navLinks.forEach(item => {
            const menuText = item.textContent.toLowerCase();
            if (menuText.includes(searchText)) {
                foundItems.push(item);
                item.style.backgroundColor = '#495057';
                item.parentElement.classList.add('search-highlight');

                // If it's a match, navigate to that section
                if (foundItems.length === 1) {
                    const section = item.getAttribute('data-section');
                    showGrid(section);
                }
            }
        });

        if (foundItems.length > 0) {
            // Scroll to the first found item if needed
            foundItems[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
            menuSuggestions.classList.remove('show');
        } else {
            alert('No menu items found matching: ' + searchText);
        }
    }

    // Event listeners for menu search
    menuSearchButton.addEventListener('click', function() {
        searchMenus(menuSearchInput.value);
    });

    menuSearchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            searchMenus(this.value);
            menuSuggestions.classList.remove('show');
        } else if (e.key === 'ArrowDown' && menuSuggestions.classList.contains('show')) {
            // Navigate to first suggestion item
            const firstItem = menuSuggestions.querySelector('.suggestion-item');
            if (firstItem) {
                firstItem.classList.add('active');
                firstItem.focus();
            }
            e.preventDefault();
        }
    });

    // Show suggestions as user types
    menuSearchInput.addEventListener('input', function() {
        showMenuSuggestions(this.value);

        if (this.value === '') {
            // Reset all menu items
            navLinks.forEach(item => {
                item.style.backgroundColor = '';
                item.parentElement.classList.remove('search-highlight');
            });
        }
    });

    // Close suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!menuSearchInput.contains(e.target) && !menuSuggestions.contains(e.target)) {
            menuSuggestions.classList.remove('show');
        }
    });

    // Initialize with employees grid
    showGrid('employees');

    // Create and append the advanced search panel
    createAdvancedSearchPanel();

    // Toggle Advanced Search Panel
    document.getElementById('toggleAdvancedSearch').addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent event from bubbling up
        const panel = document.getElementById('advancedSearchPanel');
        const activeGridContainer = document.getElementById(`${currentActiveSection}Grid`);

        // Update panel title based on current section
        const panelTitle = panel.querySelector('.panel-header h2');
        if (panelTitle) {
            panelTitle.innerHTML = `<i class="fas fa-filter"></i> ${currentActiveSection.charAt(0).toUpperCase() + currentActiveSection.slice(1)} Advanced Search`;
        }

        // Show/hide quick filters based on current section
        const quickFiltersSection = panel.querySelector('.quick-filters-section');

        if (quickFiltersSection) {
            // Show all filter groups first
            const allFilterGroups = quickFiltersSection.querySelectorAll('.quick-filter-group');
            allFilterGroups.forEach(group => group.style.display = 'none');

            // Show only relevant filter groups for current section
            if (currentActiveSection === 'employees') {
                const employeeFilters = quickFiltersSection.querySelectorAll('.quick-filter-group[data-column="department"], .quick-filter-group[data-column="designation"], .quick-filter-group[data-column="email"]');
                employeeFilters.forEach(group => group.style.display = 'flex');
            } else if (currentActiveSection === 'customers') {
                const customerFilters = quickFiltersSection.querySelectorAll('.quick-filter-group[data-column="status"], .quick-filter-group[data-column="country"]');
                customerFilters.forEach(group => group.style.display = 'flex');
            } else if (currentActiveSection === 'parts') {
                const partsFilters = quickFiltersSection.querySelectorAll('.quick-filter-group[data-column="category"], .quick-filter-group[data-column="manufacturer"]');
                partsFilters.forEach(group => group.style.display = 'flex');
            } else if (currentActiveSection === 'party') {
                const partyFilters = quickFiltersSection.querySelectorAll('.quick-filter-group[data-column="partyType"], .quick-filter-group[data-column="isActive"], .quick-filter-group[data-column="city"]');
                partyFilters.forEach(group => group.style.display = 'flex');
            }
        }

        panel.classList.toggle('active');

        // Toggle the panel-active class on the active grid container
        if (panel.classList.contains('active') && activeGridContainer) {
            activeGridContainer.classList.add('panel-active');
        } else if (activeGridContainer) {
            activeGridContainer.classList.remove('panel-active');
        }
    });

    // Initialize column search functionality
    initColumnSearch();

    // Initialize Advanced Search with column suggestions
    initAdvancedSearch();
});

// Function to initialize grid containers
function initializeGrids() {
    const mainContent = document.getElementById('mainContent');

    // Create Employee Grid
    const employeesGrid = createGrid('employeesGrid', 'Employees', [
        'Employee Code', 'Name', 'Mobile', 'Email', 'Department', 'Designation', 'Status', 'Join Date', 'Salary', 'Location'
    ], getEmployeeData());

    // Create Customer Grid
    const customersGrid = createGrid('customersGrid', 'Customers', [
        'Customer ID', 'Company Name', 'Contact Person', 'Email', 'Phone', 'Address', 'City', 'Country', 'Status'
    ], getCustomerData());

    // Create Parts Grid
    const partsGrid = createGrid('partsGrid', 'Parts', [
        'Part Number', 'Description', 'Category', 'Manufacturer', 'Unit Price', 'In Stock', 'Reorder Level', 'Location', 'Status'
    ], getPartsData());

    // Append grids to main content
    mainContent.appendChild(employeesGrid);
    mainContent.appendChild(customersGrid);
    mainContent.appendChild(partsGrid);

    // Hide customer and parts grids initially
    customersGrid.style.display = 'none';
    partsGrid.style.display = 'none';
}

// Function to create a grid container
function createGrid(id, title, columns, data) {
    const gridContainer = document.createElement('div');
    gridContainer.className = 'grid-container';
    gridContainer.id = id;

    const gridHeader = document.createElement('div');
    gridHeader.className = 'grid-header';
    gridHeader.innerHTML = `
        <div class="grid-title">${title}</div>
        <div class="grid-actions">
            <button class="refresh-btn" id="refresh${id}">
                <i class="fas fa-sync-alt"></i> Refresh
            </button>
            <button class="clear-filters-btn" id="clearColumnFiltersBtn">
                <i class="fas fa-eraser"></i> Clear Filters
            </button>
        </div>
    `;

    const gridTableContainer = document.createElement('div');
    gridTableContainer.className = 'grid-table-container';

    const table = document.createElement('table');
    table.className = 'grid-table';

    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    columns.forEach((column, index) => {
        const th = document.createElement('th');
        th.textContent = column;
        th.style.position = 'relative';

        // Add column search input
        const columnSearch = document.createElement('div');
        columnSearch.className = 'column-search';
        columnSearch.innerHTML = `<input type="text" class="column-search-input" data-column="${index}" placeholder="Search ${column}...">`;

        th.appendChild(columnSearch);
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body with data
    const tbody = document.createElement('tbody');

    data.forEach(row => {
        const tr = document.createElement('tr');

        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    gridTableContainer.appendChild(table);

    gridContainer.appendChild(gridHeader);
    gridContainer.appendChild(gridTableContainer);

    return gridContainer;
}

// Function to create the advanced search panel
function createAdvancedSearchPanel() {
    const mainContent = document.getElementById('mainContent');

    const panel = document.createElement('div');
    panel.className = 'advanced-search-panel';
    panel.id = 'advancedSearchPanel';

    panel.innerHTML = `
        <div class="panel-header">
            <h2><i class="fas fa-filter"></i> Advanced Search</h2>
            <button class="panel-close-btn" id="closeAdvancedSearch">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="panel-body">
            <!-- Quick Filters Section -->
            <div class="quick-filters-section">
                <h3>Quick Filters:</h3>
                <div class="quick-filters-container" id="quickFiltersContainer">
                    <!-- Employee Department Quick Filters -->
                    <div class="quick-filter-group" data-column="department">
                        <div class="quick-filter-btn" data-column="department" data-operator="equal" data-value="Engineering">
                            <i class="fas fa-code"></i> Engineering
                        </div>
                        <div class="quick-filter-btn" data-column="department" data-operator="equal" data-value="Marketing">
                            <i class="fas fa-bullhorn"></i> Marketing
                        </div>
                        <div class="quick-filter-btn" data-column="department" data-operator="equal" data-value="Sales">
                            <i class="fas fa-chart-line"></i> Sales
                        </div>
                        <div class="quick-filter-btn" data-column="department" data-operator="equal" data-value="HR">
                            <i class="fas fa-users"></i> HR
                        </div>
                    </div>

                    <!-- Employee Designation Quick Filters -->
                    <div class="quick-filter-group" data-column="designation">
                        <div class="quick-filter-btn" data-column="designation" data-operator="equal" data-value="Developer">
                            <i class="fas fa-laptop-code"></i> Developer
                        </div>
                        <div class="quick-filter-btn" data-column="designation" data-operator="equal" data-value="Manager">
                            <i class="fas fa-user-tie"></i> Manager
                        </div>
                        <div class="quick-filter-btn" data-column="designation" data-operator="equal" data-value="Executive">
                            <i class="fas fa-briefcase"></i> Executive
                        </div>
                    </div>

                    <!-- Employee Email Quick Filters -->
                    <div class="quick-filter-group" data-column="email">
                        <div class="quick-filter-btn" data-column="email" data-operator="contains" data-value="@example.com">
                            <i class="fas fa-envelope"></i> @example.com
                        </div>
                    </div>

                    <!-- Customer Status Quick Filters -->
                    <div class="quick-filter-group" data-column="status">
                        <div class="quick-filter-btn" data-column="status" data-operator="equal" data-value="Active">
                            <i class="fas fa-check-circle"></i> Active
                        </div>
                        <div class="quick-filter-btn" data-column="status" data-operator="equal" data-value="Inactive">
                            <i class="fas fa-times-circle"></i> Inactive
                        </div>
                        <div class="quick-filter-btn" data-column="status" data-operator="equal" data-value="Pending">
                            <i class="fas fa-clock"></i> Pending
                        </div>
                    </div>

                    <!-- Customer Country Quick Filters -->
                    <div class="quick-filter-group" data-column="country">
                        <div class="quick-filter-btn" data-column="country" data-operator="equal" data-value="USA">
                            <i class="fas fa-flag"></i> USA
                        </div>
                        <div class="quick-filter-btn" data-column="country" data-operator="equal" data-value="Canada">
                            <i class="fas fa-flag"></i> Canada
                        </div>
                        <div class="quick-filter-btn" data-column="country" data-operator="equal" data-value="UK">
                            <i class="fas fa-flag"></i> UK
                        </div>
                        <div class="quick-filter-btn" data-column="country" data-operator="equal" data-value="Germany">
                            <i class="fas fa-flag"></i> Germany
                        </div>
                    </div>

                    <!-- Parts Category Quick Filters -->
                    <div class="quick-filter-group" data-column="category">
                        <div class="quick-filter-btn" data-column="category" data-operator="equal" data-value="Filters">
                            <i class="fas fa-filter"></i> Filters
                        </div>
                        <div class="quick-filter-btn" data-column="category" data-operator="equal" data-value="Brakes">
                            <i class="fas fa-car"></i> Brakes
                        </div>
                        <div class="quick-filter-btn" data-column="category" data-operator="equal" data-value="Electrical">
                            <i class="fas fa-bolt"></i> Electrical
                        </div>
                        <div class="quick-filter-btn" data-column="category" data-operator="equal" data-value="Ignition">
                            <i class="fas fa-fire"></i> Ignition
                        </div>
                    </div>

                    <!-- Parts Manufacturer Quick Filters -->
                    <div class="quick-filter-group" data-column="manufacturer">
                        <div class="quick-filter-btn" data-column="manufacturer" data-operator="equal" data-value="FilterCorp">
                            <i class="fas fa-industry"></i> FilterCorp
                        </div>
                        <div class="quick-filter-btn" data-column="manufacturer" data-operator="equal" data-value="BrakeMasters">
                            <i class="fas fa-industry"></i> BrakeMasters
                        </div>
                        <div class="quick-filter-btn" data-column="manufacturer" data-operator="equal" data-value="SparkTech">
                            <i class="fas fa-industry"></i> SparkTech
                        </div>
                        <div class="quick-filter-btn" data-column="manufacturer" data-operator="equal" data-value="ElectroParts">
                            <i class="fas fa-industry"></i> ElectroParts
                        </div>
                    </div>

                    <!-- Party Type Quick Filters -->
                    <div class="quick-filter-group" data-column="partyType">
                        <div class="quick-filter-btn" data-column="partyType" data-operator="equal" data-value="Customer">
                            <i class="fas fa-user-tie"></i> Customer
                        </div>
                        <div class="quick-filter-btn" data-column="partyType" data-operator="equal" data-value="Vendor">
                            <i class="fas fa-truck"></i> Vendor
                        </div>
                        <div class="quick-filter-btn" data-column="partyType" data-operator="equal" data-value="Manufacturer">
                            <i class="fas fa-industry"></i> Manufacturer
                        </div>
                        <div class="quick-filter-btn" data-column="partyType" data-operator="equal" data-value="Transporter">
                            <i class="fas fa-shipping-fast"></i> Transporter
                        </div>
                    </div>

                    <!-- Party Active Status Quick Filters -->
                    <div class="quick-filter-group" data-column="isActive">
                        <div class="quick-filter-btn" data-column="isActive" data-operator="equal" data-value="true">
                            <i class="fas fa-check-circle"></i> Active
                        </div>
                        <div class="quick-filter-btn" data-column="isActive" data-operator="equal" data-value="false">
                            <i class="fas fa-times-circle"></i> Inactive
                        </div>
                    </div>

                    <!-- Party City Quick Filters -->
                    <div class="quick-filter-group" data-column="city">
                        <div class="quick-filter-btn" data-column="city" data-operator="equal" data-value="New York">
                            <i class="fas fa-city"></i> New York
                        </div>
                        <div class="quick-filter-btn" data-column="city" data-operator="equal" data-value="Chicago">
                            <i class="fas fa-city"></i> Chicago
                        </div>
                        <div class="quick-filter-btn" data-column="city" data-operator="equal" data-value="Los Angeles">
                            <i class="fas fa-city"></i> Los Angeles
                        </div>
                    </div>

                    <!-- No quick filters message -->
                    <div class="no-quick-filters" style="display: none;">
                        No quick filters available for this column. Please use the form below.
                    </div>
                </div>
            </div>

            <div class="advanced-filter-form">
                <h3>Advanced Filter:</h3>

                <!-- Select Column -->
                <div class="form-group">
                    <label for="columnField">Select Column:</label>
                    <div class="search-column-container">
                        <input type="text" id="columnSearchInput" class="form-control" placeholder="Search columns..." autocomplete="off">
                        <div id="columnSuggestions" class="column-suggestions"></div>
                    </div>
                </div>

                <!-- Select Operator -->
                <div class="form-group">
                    <label for="selectOperator">Select Operator:</label>
                    <select id="selectOperator" class="form-control">
                        <option value="">--Select--</option>
                        <option value="equal">Equal</option>
                        <option value="notEqual">Not Equal</option>
                        <option value="like">Like</option>
                        <option value="contains">Contains</option>
                        <option value="greaterThan">Greater Than</option>
                        <option value="lessThan">Less Than</option>
                        <option value="between">Between</option>
                        <option value="in">In List</option>
                    </select>
                </div>

                <!-- Value Input -->
                <div class="form-group">
                    <label for="valueInput">Value:</label>
                    <input type="text" id="valueInput" class="form-control" placeholder="Enter value">
                </div>

                <!-- Condition -->
                <div class="form-group">
                    <label for="selectCondition">Select Condition:</label>
                    <select id="selectCondition" class="form-control">
                        <option value="">--Select--</option>
                        <option value="and">AND</option>
                        <option value="or">OR</option>
                    </select>
                </div>

                <!-- Add Filter Button -->
                <button id="addFilterBtn" class="action-btn add-btn">
                    <i class="fas fa-plus-circle"></i> Add Filter
                </button>

                <!-- Save Changes Button (initially hidden) -->
                <button id="saveChangesBtn" class="action-btn save-btn" style="display: none;">
                    <i class="fas fa-save"></i> Save Changes
                </button>
            </div>

            <!-- Applied Filters -->
            <div class="applied-filters">
                <h3>Applied Filters:</h3>
                <div class="applied-filters-actions">
                    <button id="removeSelectedFiltersBtn" class="action-btn remove-btn" disabled>
                        <i class="fas fa-trash-alt"></i> Remove Selected
                    </button>
                </div>
                <div id="appliedFiltersContainer" class="filters-list">
                    <div class="no-filters">No filters applied</div>
                </div>
            </div>

            <!-- Active Filters Display (synchronized with grid) -->
            <div class="active-filters-display">
                <h3>Active Filters:</h3>
                <div id="activeFiltersContainer" class="active-filters-list">
                    <div class="no-filters">No active filters</div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
                <button id="searchBtn" class="action-btn search-btn">
                    <i class="fas fa-search"></i> Search
                </button>
                <button id="resetBtn" class="action-btn reset-btn">
                    <i class="fas fa-undo"></i> Reset
                </button>
            </div>
        </div>
    `;

    mainContent.appendChild(panel);

    // Add event listeners for the panel
    document.getElementById('closeAdvancedSearch').addEventListener('click', function(event) {
        event.stopPropagation();
        const panel = document.getElementById('advancedSearchPanel');
        const activeGridContainer = document.getElementById(`${currentActiveSection}Grid`);

        panel.classList.remove('active');
        if (activeGridContainer) {
            activeGridContainer.classList.remove('panel-active');
        }
    });

    // Close panel when clicking outside
    document.addEventListener('click', function(event) {
        const panel = document.getElementById('advancedSearchPanel');
        const activeGridContainer = document.getElementById(`${currentActiveSection}Grid`);
        const isClickInsidePanel = panel.contains(event.target);
        const isToggleButton = event.target.closest('#toggleAdvancedSearch');

        // If panel is active and click is outside panel and not on toggle button
        if (panel.classList.contains('active') && !isClickInsidePanel && !isToggleButton) {
            panel.classList.remove('active');
            if (activeGridContainer) {
                activeGridContainer.classList.remove('panel-active');
            }
        }
    });

    // Prevent clicks inside panel from closing it
    panel.addEventListener('click', function(event) {
        event.stopPropagation();
    });
}

// Initialize column search functionality
function initColumnSearch() {
    const columnSearchInputs = document.querySelectorAll('.column-search-input');

    // Add event listeners to each column search input
    columnSearchInputs.forEach(input => {
        const columnIndex = parseInt(input.dataset.column);

        input.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const tableId = this.closest('.grid-container').id;
            const tableRows = document.querySelectorAll(`#${tableId} tbody tr`);

            tableRows.forEach(row => {
                const cell = row.cells[columnIndex];
                if (!cell) return;

                const cellText = cell.textContent.toLowerCase();
                if (searchTerm === '' || cellText.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });

        // Clear button functionality
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                this.value = '';
                // Trigger input event to update the table
                const event = new Event('input');
                this.dispatchEvent(event);
            }
        });
    });

    // Add event listener to the clear filters button
    const clearFiltersBtn = document.getElementById('clearColumnFiltersBtn');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            const tableId = this.closest('.grid-container').id;
            const inputs = document.querySelectorAll(`#${tableId} .column-search-input`);

            inputs.forEach(input => {
                input.value = '';
                // Trigger input event to update the table
                const event = new Event('input');
                input.dispatchEvent(event);
            });

            alert('All column filters cleared');
        });
    }
}

// Initialize Advanced Search with column suggestions
function initAdvancedSearch() {
    const columnSearchInput = document.getElementById('columnSearchInput');
    const columnSuggestions = document.getElementById('columnSuggestions');
    const selectOperator = document.getElementById('selectOperator');
    const valueInput = document.getElementById('valueInput');
    const selectCondition = document.getElementById('selectCondition');
    const addFilterBtn = document.getElementById('addFilterBtn');

    // Define column options for each grid
    const gridColumns = {
        'employees': [
            { value: 'employeeCode', text: 'Employee Code' },
            { value: 'name', text: 'Name' },
            { value: 'mobile', text: 'Mobile' },
            { value: 'email', text: 'Email' },
            { value: 'department', text: 'Department' },
            { value: 'designation', text: 'Designation' },
            { value: 'status', text: 'Status' },
            { value: 'joinDate', text: 'Join Date' },
            { value: 'salary', text: 'Salary' },
            { value: 'location', text: 'Location' }
        ],
        'customers': [
            { value: 'customerId', text: 'Customer ID' },
            { value: 'companyName', text: 'Company Name' },
            { value: 'contactPerson', text: 'Contact Person' },
            { value: 'email', text: 'Email' },
            { value: 'phone', text: 'Phone' },
            { value: 'address', text: 'Address' },
            { value: 'city', text: 'City' },
            { value: 'country', text: 'Country' },
            { value: 'status', text: 'Status' }
        ],
        'parts': [
            { value: 'partNumber', text: 'Part Number' },
            { value: 'description', text: 'Description' },
            { value: 'category', text: 'Category' },
            { value: 'manufacturer', text: 'Manufacturer' },
            { value: 'unitPrice', text: 'Unit Price' },
            { value: 'inStock', text: 'In Stock' },
            { value: 'reorderLevel', text: 'Reorder Level' },
            { value: 'location', text: 'Location' },
            { value: 'status', text: 'Status' }
        ],
        'party': [
            { value: 'id', text: 'Party ID' },
            { value: 'partyType', text: 'Party Type' },
            { value: 'name', text: 'Name' },
            { value: 'contactPerson', text: 'Contact Person' },
            { value: 'email', text: 'Email' },
            { value: 'phone', text: 'Phone' },
            { value: 'address', text: 'Address' },
            { value: 'city', text: 'City' },
            { value: 'country', text: 'Country' },
            { value: 'isActive', text: 'Is Active?' },
            { value: 'company', text: 'Company' },
            { value: 'branch', text: 'Branch' },
            { value: 'region', text: 'Region' }
        ]
    };

    // Function to show column suggestions based on active grid
    function showColumnSuggestions(searchText) {
        // Clear previous suggestions
        columnSuggestions.innerHTML = '';

        if (!searchText) {
            columnSuggestions.classList.remove('show');
            return;
        }

        searchText = searchText.toLowerCase();
        let matchFound = false;

        // Get columns for the active grid
        const activeColumns = gridColumns[currentActiveSection] || [];

        // Filter columns that match the search text
        const filteredColumns = activeColumns.filter(column =>
            column.text.toLowerCase().includes(searchText)
        );

        if (filteredColumns.length > 0) {
            filteredColumns.forEach(column => {
                const suggestionItem = document.createElement('div');
                suggestionItem.className = 'column-suggestion-item';
                suggestionItem.textContent = column.text;
                suggestionItem.dataset.value = column.value;

                // Add click event to select this column
                suggestionItem.addEventListener('click', function() {
                    columnSearchInput.value = column.text;
                    columnSearchInput.dataset.value = column.value;
                    columnSuggestions.classList.remove('show');

                    // Auto-select operator if it's empty
                    if (!selectOperator.value) {
                        selectOperator.value = 'equal';
                    }

                    // Focus on the value input
                    valueInput.focus();
                });

                columnSuggestions.appendChild(suggestionItem);
                matchFound = true;
            });
        }

        if (matchFound) {
            columnSuggestions.classList.add('show');
        } else {
            columnSuggestions.classList.remove('show');
        }
    }

    // Show suggestions as user types
    columnSearchInput.addEventListener('input', function() {
        showColumnSuggestions(this.value);
    });

    // Show all columns when focusing on the input
    columnSearchInput.addEventListener('focus', function() {
        if (!this.value) {
            // Show all columns for the active grid
            const activeColumns = gridColumns[currentActiveSection] || [];
            if (activeColumns.length > 0) {
                columnSuggestions.innerHTML = '';

                activeColumns.forEach(column => {
                    const suggestionItem = document.createElement('div');
                    suggestionItem.className = 'column-suggestion-item';
                    suggestionItem.textContent = column.text;
                    suggestionItem.dataset.value = column.value;

                    // Add click event to select this column
                    suggestionItem.addEventListener('click', function() {
                        columnSearchInput.value = column.text;
                        columnSearchInput.dataset.value = column.value;
                        columnSuggestions.classList.remove('show');

                        // Auto-select operator if it's empty
                        if (!selectOperator.value) {
                            selectOperator.value = 'equal';
                        }

                        // Focus on the value input
                        valueInput.focus();
                    });

                    columnSuggestions.appendChild(suggestionItem);
                });

                columnSuggestions.classList.add('show');
            }
        } else {
            showColumnSuggestions(this.value);
        }
    });

    // Close suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!columnSearchInput.contains(e.target) && !columnSuggestions.contains(e.target)) {
            columnSuggestions.classList.remove('show');
        }
    });

    // Handle keyboard navigation
    columnSearchInput.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown' && columnSuggestions.classList.contains('show')) {
            // Navigate to first suggestion item
            const firstItem = columnSuggestions.querySelector('.column-suggestion-item');
            if (firstItem) {
                firstItem.classList.add('active');
                firstItem.focus();
            }
            e.preventDefault();
        } else if (e.key === 'Escape') {
            columnSuggestions.classList.remove('show');
        }
    });

    // Global function to get the selected column
    window.getSelectedColumn = function() {
        return columnSearchInput.dataset.value || '';
    };

    // Update column suggestions when active grid changes
    document.addEventListener('grid-change', function() {
        // Clear column search input
        columnSearchInput.value = '';
        columnSearchInput.dataset.value = '';
        columnSuggestions.classList.remove('show');

        // Reset other form fields
        selectOperator.value = '';
        valueInput.value = '';
        selectCondition.value = '';
    });

    // Add filter button click
    addFilterBtn.addEventListener('click', function() {
        const column = window.getSelectedColumn();
        const operator = selectOperator.value;
        const value = valueInput.value;
        const condition = selectCondition.value;

        if (!column || !operator || !value) {
            alert('Please fill in all filter fields');
            return;
        }

        // In a real application, this would apply the filter to the grid
        alert(`Filter added: ${column} ${operator} ${value} ${condition}`);

        // Reset form
        columnSearchInput.value = '';
        columnSearchInput.dataset.value = '';
        selectOperator.value = '';
        valueInput.value = '';
        selectCondition.value = '';
    });
}

// Sample data functions
function getEmployeeData() {
    return [
        ['EMP001', 'John Smith', '555-1234', 'john@example.com', 'Engineering', 'Developer', 'Active', '2020-01-15', '$85,000', 'New York'],
        ['EMP002', 'Jane Doe', '555-5678', 'jane@example.com', 'Marketing', 'Manager', 'Active', '2019-05-20', '$95,000', 'Chicago'],
        ['EMP003', 'Bob Johnson', '555-9012', 'bob@example.com', 'Sales', 'Executive', 'Active', '2018-11-10', '$110,000', 'Los Angeles'],
        ['EMP004', 'Alice Brown', '555-3456', 'alice@example.com', 'HR', 'Coordinator', 'Active', '2021-03-05', '$65,000', 'Boston'],
        ['EMP005', 'Charlie Wilson', '555-7890', 'charlie@example.com', 'Engineering', 'Senior Developer', 'Active', '2017-08-15', '$105,000', 'Seattle']
    ];
}

function getCustomerData() {
    return [
        ['CUST001', 'Acme Corp', 'John Manager', 'john@acme.com', '555-1111', '123 Main St', 'New York', 'USA', 'Active'],
        ['CUST002', 'Beta Industries', 'Sarah Director', 'sarah@beta.com', '555-2222', '456 Oak Ave', 'Chicago', 'USA', 'Active'],
        ['CUST003', 'Gamma Solutions', 'Mike President', 'mike@gamma.com', '555-3333', '789 Pine Rd', 'Toronto', 'Canada', 'Inactive'],
        ['CUST004', 'Delta Services', 'Lisa Owner', 'lisa@delta.com', '555-4444', '321 Elm Blvd', 'London', 'UK', 'Active'],
        ['CUST005', 'Epsilon Tech', 'David CEO', 'david@epsilon.com', '555-5555', '654 Birch Ln', 'Berlin', 'Germany', 'Pending']
    ];
}

function getPartsData() {
    return [
        ['P-10001', 'Air Filter', 'Filters', 'FilterCorp', '$24.99', '156', '50', 'Aisle A-12', 'In Stock'],
        ['P-10002', 'Brake Pad Set', 'Brakes', 'BrakeMasters', '$89.95', '78', '30', 'Aisle B-05', 'In Stock'],
        ['P-10003', 'Oil Filter', 'Filters', 'FilterCorp', '$12.50', '210', '75', 'Aisle A-14', 'In Stock'],
        ['P-10004', 'Spark Plug Set', 'Ignition', 'SparkTech', '$45.75', '92', '40', 'Aisle C-03', 'In Stock'],
        ['P-10005', 'Alternator', 'Electrical', 'ElectroParts', '$175.00', '25', '15', 'Aisle D-08', 'In Stock']
    ];
}
