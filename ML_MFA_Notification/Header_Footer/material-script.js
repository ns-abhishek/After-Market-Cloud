// Sample Data
const regions = [
    'North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East', 'Africa'
];

const companies = [
    'Acme Corporation', 'Globex', 'Soylent Corp', 'Initech', 'Umbrella Corp',
    'Stark Industries', 'Wayne Enterprises', 'Cyberdyne Systems', 'Oscorp', 'LexCorp'
];

const branches = [
    'Headquarters', 'Regional Office', 'Sales Office', 'R&D Center', 'Manufacturing',
    'Distribution Center', 'Customer Service', 'IT Department', 'Finance', 'Marketing'
];

const subBranches = [
    'Team Alpha', 'Team Beta', 'Team Gamma', 'Team Delta', 'Team Epsilon',
    'Division 1', 'Division 2', 'Division 3', 'Unit A', 'Unit B'
];

// Generate sample report data
const generateReportData = (count = 20) => {
    const reports = [];
    const reportNames = [
        'Annual Financial Report', 'Quarterly Sales Report', 'Marketing Campaign Analysis',
        'Customer Satisfaction Survey', 'Employee Performance Review', 'Inventory Status',
        'Market Research', 'Competitor Analysis', 'Budget Forecast', 'Project Status Update'
    ];

    const headerOptions = ['Company Logo', 'Standard Header', 'Minimal Header', 'Detailed Header', 'Custom Header'];
    const footerOptions = ['Standard Footer', 'Minimal Footer', 'Detailed Footer', 'Page Numbers', 'Custom Footer'];

    for (let i = 0; i < count; i++) {
        const startDate = new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 90) + 30);
        const isSet = Math.random() > 0.3; // 70% chance of being set

        reports.push({
            id: i + 1,
            name: reportNames[Math.floor(Math.random() * reportNames.length)] + ' ' + (i + 1),
            header: headerOptions[Math.floor(Math.random() * headerOptions.length)],
            footer: footerOptions[Math.floor(Math.random() * footerOptions.length)],
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            status: isSet ? 'Set' : 'Not Set',
            active: Math.random() > 0.2 // 80% chance of being active
        });
    }

    // Update the summary counts based on the generated data
    setTimeout(() => {
        const setCount = reports.filter(report => report.status === 'Set').length;
        const notSetCount = reports.filter(report => report.status === 'Not Set').length;
        const activeCount = reports.filter(report => report.active).length;
        const inactiveCount = reports.filter(report => !report.active).length;

        document.getElementById('total-count').textContent = reports.length;
        document.getElementById('set-count').textContent = setCount;
        document.getElementById('not-set-count').textContent = notSetCount;
        document.getElementById('active-count').textContent = activeCount;
        document.getElementById('inactive-count').textContent = inactiveCount;
    }, 0);

    return reports;
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Material Design components
    mdc.autoInit();

    const reportData = generateReportData();

    // Store report data in window object for access from event handlers
    window.reportData = reportData;

    // Add region, company, branch properties to reports for filtering
    reportData.forEach((report, index) => {
        report.region = regions[index % regions.length];
        report.company = companies[index % companies.length];
        report.branch = branches[index % branches.length];
        report.subBranch = subBranches[index % subBranches.length];
    });

    // Populate filter checkboxes
    populateCheckboxList('region-list', regions);
    populateCheckboxList('company-list', companies);
    populateCheckboxList('branch-list', branches);
    populateCheckboxList('subbranch-list', subBranches);

    // Populate grid
    populateReportsGrid(reportData);

    // Setup search functionality
    setupSearch('region-search', 'region-list');
    setupSearch('company-search', 'company-list');
    setupSearch('branch-search', 'branch-list');
    setupSearch('subbranch-search', 'subbranch-list');

    // Setup clear filters button
    document.getElementById('clear-filters').addEventListener('click', () => {
        clearAllFilters(reportData);
    });

    // Setup add button to redirect to landing.html
    document.getElementById('add-record').addEventListener('click', () => {
        window.location.href = 'landing.html';
    });

    // Setup export button options
    setupExportOptions(reportData);

    // Setup grid filter button and dialog
    const gridFilterButton = document.getElementById('grid-filter-button');
    const advancedFilterDialog = document.getElementById('advanced-filter-dialog');
    const closeFilterDialog = document.getElementById('close-filter-dialog');
    const resetAdvancedFilter = document.getElementById('reset-advanced-filter');
    const applyAdvancedFilter = document.getElementById('apply-advanced-filter');

    // Show advanced filter dialog
    gridFilterButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent event bubbling
        if (advancedFilterDialog.style.display === 'block') {
            advancedFilterDialog.style.display = 'none';
        } else {
            advancedFilterDialog.style.display = 'block';
        }
    });

    // Close advanced filter dialog
    closeFilterDialog.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent event bubbling
        advancedFilterDialog.style.display = 'none';
    });

    // Reset advanced filter fields
    resetAdvancedFilter.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent event bubbling
        // Reset all filter inputs
        document.getElementById('filter-report-name').value = '';
        document.getElementById('filter-status').selectedIndex = 0;
        document.getElementById('filter-active').selectedIndex = 0;
        document.getElementById('filter-start-date').value = '';
        document.getElementById('filter-end-date').value = '';
    });

    // Apply advanced filter
    applyAdvancedFilter.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent event bubbling
        // Get filter values
        const reportNameFilter = document.getElementById('filter-report-name').value.toLowerCase();
        const statusFilter = document.getElementById('filter-status').value;
        const activeFilter = document.getElementById('filter-active').value;
        const startDateFilter = document.getElementById('filter-start-date').value;
        const endDateFilter = document.getElementById('filter-end-date').value;

        // Apply advanced filters to the reports
        let filteredReports = window.reportData;

        // Filter by report name
        if (reportNameFilter) {
            filteredReports = filteredReports.filter(report =>
                report.name.toLowerCase().includes(reportNameFilter));
        }

        // Filter by status
        if (statusFilter) {
            filteredReports = filteredReports.filter(report =>
                report.status === statusFilter);
        }

        // Filter by active status
        if (activeFilter) {
            filteredReports = filteredReports.filter(report =>
                (activeFilter === 'Yes' && report.active) ||
                (activeFilter === 'No' && !report.active));
        }

        // Filter by date range
        if (startDateFilter) {
            const startDate = new Date(startDateFilter);
            filteredReports = filteredReports.filter(report =>
                new Date(report.startDate) >= startDate);
        }

        if (endDateFilter) {
            const endDate = new Date(endDateFilter);
            filteredReports = filteredReports.filter(report =>
                new Date(report.endDate) <= endDate);
        }

        // Update the grid with filtered reports
        populateReportsGrid(filteredReports);

        // Update the filtered counts
        document.getElementById('filtered-total-count').textContent = filteredReports.length;
        document.getElementById('filtered-set-count').textContent = filteredReports.filter(report => report.status === 'Set').length;
        document.getElementById('filtered-not-set-count').textContent = filteredReports.filter(report => report.status === 'Not Set').length;
        document.getElementById('filtered-active-count').textContent = filteredReports.filter(report => report.active).length;
        document.getElementById('filtered-inactive-count').textContent = filteredReports.filter(report => !report.active).length;

        // Hide the dialog
        advancedFilterDialog.style.display = 'none';
    });

    // Prevent dialog from closing when clicking inside it
    advancedFilterDialog.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    // Close dialog when clicking outside
    document.addEventListener('click', () => {
        if (advancedFilterDialog.style.display === 'block') {
            advancedFilterDialog.style.display = 'none';
        }
    });

    // Setup clickable summary cards (main cards first, then filtered results cards)
    setupSummaryCardFilters(reportData, '.summary-cards .card.clickable:not(.filtered-results .card.clickable)');

    // Setup clickable filtered results cards
    setupSummaryCardFilters(reportData, '.filtered-results .card.clickable');

    // Setup checkbox for select/deselect all
    const selectAllCheckbox = document.getElementById('select-all-cards');

    // Initialize MDC checkbox
    new mdc.checkbox.MDCCheckbox(document.querySelector('.select-all-checkbox .mdc-checkbox'));

    selectAllCheckbox.addEventListener('change', () => {
        if (selectAllCheckbox.checked) {
            // Select all cards
            document.querySelectorAll('.filtered-results .card.clickable').forEach(card => {
                card.classList.add('active');
            });

            // Set active filters to include all filter types
            window.activeFilters = ['all', 'set', 'not-set', 'active', 'inactive'];

            // Update the grid to show all reports
            populateReportsGrid(reportData);
        } else {
            // Deselect all cards
            document.querySelectorAll('.filtered-results .card.clickable').forEach(card => {
                card.classList.remove('active');
            });

            // Clear active filters
            window.activeFilters = [];

            // Update the grid to show no reports
            const tbody = document.querySelector('#reports-grid tbody');
            tbody.innerHTML = '';
            const row = document.createElement('tr');
            row.className = 'mdc-data-table__row';
            const cell = document.createElement('td');
            cell.className = 'mdc-data-table__cell';
            cell.colSpan = 8;
            cell.classList.add('no-records-message');
            cell.textContent = 'No reports match the selected filters';
            row.appendChild(cell);
            tbody.appendChild(row);
        }
    });
});

// Setup export options
function setupExportOptions(reports) {
    const exportOptions = document.querySelectorAll('.export-option');

    exportOptions.forEach(option => {
        option.addEventListener('click', () => {
            const format = option.getAttribute('data-format');
            exportData(reports, format);
        });
    });
}

// Export data function
function exportData(data, format) {
    // In a real application, this would handle the actual export
    console.log(`Exporting data in ${format} format`);
    alert(`Data would be exported in ${format.toUpperCase()} format`);
}

// Populate checkbox lists with auto-filtering
function populateCheckboxList(listId, items) {
    const list = document.getElementById(listId);
    list.innerHTML = '';

    // Add "Select All" option
    const selectAllItem = document.createElement('div');
    selectAllItem.className = 'checkbox-item select-all-item';

    const selectAllCheckbox = document.createElement('div');
    selectAllCheckbox.className = 'mdc-checkbox';

    const selectAllInput = document.createElement('input');
    selectAllInput.type = 'checkbox';
    selectAllInput.id = `${listId}-select-all`;
    selectAllInput.className = 'mdc-checkbox__native-control';
    selectAllInput.checked = true; // Selected by default

    // Add change event listener for Select All
    selectAllInput.addEventListener('change', () => {
        const isChecked = selectAllInput.checked;
        const checkboxes = list.querySelectorAll('input[type="checkbox"]:not(#' + selectAllInput.id + ')');

        checkboxes.forEach(checkbox => {
            checkbox.checked = isChecked;
        });

        // Apply filters
        const reportData = window.reportData;
        if (reportData) {
            applyFilters(reportData);
        }
    });

    const selectAllBackground = document.createElement('div');
    selectAllBackground.className = 'mdc-checkbox__background';

    const selectAllCheckmark = document.createElement('svg');
    selectAllCheckmark.className = 'mdc-checkbox__checkmark';
    selectAllCheckmark.viewBox = '0 0 24 24';

    const selectAllPath = document.createElement('path');
    selectAllPath.className = 'mdc-checkbox__checkmark-path';
    selectAllPath.d = 'M1.73,12.91 8.1,19.28 22.79,4.59';
    selectAllPath.fill = 'none';

    selectAllCheckmark.appendChild(selectAllPath);
    selectAllBackground.appendChild(selectAllCheckmark);

    const selectAllMixedmark = document.createElement('div');
    selectAllMixedmark.className = 'mdc-checkbox__mixedmark';
    selectAllBackground.appendChild(selectAllMixedmark);

    selectAllCheckbox.appendChild(selectAllInput);
    selectAllCheckbox.appendChild(selectAllBackground);

    const selectAllLabel = document.createElement('label');
    selectAllLabel.htmlFor = `${listId}-select-all`;
    selectAllLabel.textContent = 'Select All';
    selectAllLabel.style.fontWeight = 'bold';

    selectAllItem.appendChild(selectAllCheckbox);
    selectAllItem.appendChild(selectAllLabel);
    list.appendChild(selectAllItem);



    // Add individual items
    items.forEach((item, index) => {
        const checkboxItem = document.createElement('div');
        checkboxItem.className = 'checkbox-item';

        const checkbox = document.createElement('div');
        checkbox.className = 'mdc-checkbox';

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = `${listId}-${index}`;
        input.className = 'mdc-checkbox__native-control';
        input.value = item;
        input.checked = true; // Selected by default

        // Add change event listener for auto-filtering
        input.addEventListener('change', () => {
            // Update "Select All" checkbox state
            const allCheckboxes = list.querySelectorAll('input[type="checkbox"]:not(#' + selectAllInput.id + ')');
            const checkedCheckboxes = list.querySelectorAll('input[type="checkbox"]:checked:not(#' + selectAllInput.id + ')');

            if (checkedCheckboxes.length === 0) {
                selectAllInput.checked = false;
                selectAllInput.indeterminate = false;
            } else if (checkedCheckboxes.length === allCheckboxes.length) {
                selectAllInput.checked = true;
                selectAllInput.indeterminate = false;
            } else {
                selectAllInput.checked = false;
                selectAllInput.indeterminate = true;
            }

            // Get the report data from the window object
            const reportData = window.reportData;
            if (reportData) {
                applyFilters(reportData);
            }
        });

        const background = document.createElement('div');
        background.className = 'mdc-checkbox__background';

        const checkmark = document.createElement('svg');
        checkmark.className = 'mdc-checkbox__checkmark';
        checkmark.viewBox = '0 0 24 24';

        const path = document.createElement('path');
        path.className = 'mdc-checkbox__checkmark-path';
        path.d = 'M1.73,12.91 8.1,19.28 22.79,4.59';
        path.fill = 'none';

        checkmark.appendChild(path);
        background.appendChild(checkmark);

        const mixedmark = document.createElement('div');
        mixedmark.className = 'mdc-checkbox__mixedmark';
        background.appendChild(mixedmark);

        checkbox.appendChild(input);
        checkbox.appendChild(background);

        const label = document.createElement('label');
        label.htmlFor = `${listId}-${index}`;
        label.textContent = item;

        checkboxItem.appendChild(checkbox);
        checkboxItem.appendChild(label);
        list.appendChild(checkboxItem);

        // Initialize MDC checkbox
        new mdc.checkbox.MDCCheckbox(checkbox);
    });

    // Initialize Select All checkbox
    new mdc.checkbox.MDCCheckbox(selectAllCheckbox);
}

// Setup search functionality
function setupSearch(searchId, listId) {
    const searchInput = document.getElementById(searchId);
    const list = document.getElementById(listId);

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const items = list.querySelectorAll('.checkbox-item');

        items.forEach(item => {
            const label = item.querySelector('label');
            const text = label.textContent.toLowerCase();

            if (text.includes(searchTerm)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

// Populate reports grid
function populateReportsGrid(reports, filters = ['all']) {
    const tbody = document.querySelector('#reports-grid tbody');
    tbody.innerHTML = '';

    // Get active filters (convert single filter to array if needed)
    const activeFilters = Array.isArray(filters) ? filters : [filters];

    // Store original reports for reference
    window.allReports = reports;

    // Filter reports based on the selected filters
    let filteredReports = reports;

    // If we have filters other than 'all', apply them
    if (!(activeFilters.length === 1 && activeFilters[0] === 'all')) {
        filteredReports = reports.filter(report => {
            // Check if the report matches any of the active filters
            return activeFilters.some(filter => {
                switch (filter) {
                    case 'set':
                        return report.status === 'Set';
                    case 'not-set':
                        return report.status === 'Not Set';
                    case 'active':
                        return report.active;
                    case 'inactive':
                        return !report.active;
                    default:
                        return true; // 'all' filter
                }
            });
        });
    }

    // Update the filtered counts with actual numbers
    document.getElementById('filtered-total-count').textContent = filteredReports.length;
    document.getElementById('filtered-set-count').textContent = filteredReports.filter(report => report.status === 'Set').length;
    document.getElementById('filtered-not-set-count').textContent = filteredReports.filter(report => report.status === 'Not Set').length;
    document.getElementById('filtered-active-count').textContent = filteredReports.filter(report => report.active).length;
    document.getElementById('filtered-inactive-count').textContent = filteredReports.filter(report => !report.active).length;

    // If no reports match the filter, show a message
    if (filteredReports.length === 0) {
        const row = document.createElement('tr');
        row.className = 'mdc-data-table__row';
        const cell = document.createElement('td');
        cell.className = 'mdc-data-table__cell';
        cell.colSpan = 8; // Adjust for the number of columns
        cell.classList.add('no-records-message');
        cell.textContent = 'No reports match the selected filters';
        row.appendChild(cell);
        tbody.appendChild(row);
        return;
    }

    filteredReports.forEach(report => {
        const row = document.createElement('tr');
        row.className = 'mdc-data-table__row';

        // View button
        const viewCell = document.createElement('td');
        viewCell.className = 'mdc-data-table__cell';
        const viewBtn = document.createElement('button');
        viewBtn.className = 'mdc-icon-button material-icons';
        viewBtn.textContent = 'visibility';
        viewBtn.title = 'View';
        viewBtn.addEventListener('click', () => {
            alert(`Viewing report: ${report.name}`);
        });
        viewCell.appendChild(viewBtn);

        // Report name
        const nameCell = document.createElement('td');
        nameCell.className = 'mdc-data-table__cell';
        nameCell.textContent = report.name;

        // Header
        const headerCell = document.createElement('td');
        headerCell.className = 'mdc-data-table__cell';
        headerCell.textContent = report.header;

        // Footer
        const footerCell = document.createElement('td');
        footerCell.className = 'mdc-data-table__cell';
        footerCell.textContent = report.footer;

        // Start date
        const startDateCell = document.createElement('td');
        startDateCell.className = 'mdc-data-table__cell';
        startDateCell.textContent = report.startDate;

        // End date
        const endDateCell = document.createElement('td');
        endDateCell.className = 'mdc-data-table__cell';
        endDateCell.textContent = report.endDate;

        // Status (Set/Not Set)
        const statusCell = document.createElement('td');
        statusCell.className = 'mdc-data-table__cell';
        const setStatusBadge = document.createElement('span');
        setStatusBadge.className = `status-badge ${report.status === 'Set' ? 'status-active' : 'status-inactive'}`;
        setStatusBadge.textContent = report.status;

        // Apply custom styling for Set status
        if (report.status === 'Set') {
            setStatusBadge.style.backgroundColor = '#000000';
            setStatusBadge.style.color = '#ffffff';
            setStatusBadge.style.border = '1px solid #424242';
        }

        statusCell.appendChild(setStatusBadge);

        // Active status
        const activeCell = document.createElement('td');
        activeCell.className = 'mdc-data-table__cell';
        const activeBadge = document.createElement('span');
        activeBadge.className = `status-badge ${report.active ? 'status-active' : 'status-inactive'}`;
        activeBadge.textContent = report.active ? 'Yes' : 'No';

        // Apply custom styling for Active Yes
        if (report.active) {
            activeBadge.style.backgroundColor = '#000000';
            activeBadge.style.color = '#ffffff';
            activeBadge.style.border = '1px solid #424242';
        }

        activeCell.appendChild(activeBadge);

        // Append all cells to the row
        row.appendChild(viewCell);
        row.appendChild(nameCell);
        row.appendChild(headerCell);
        row.appendChild(footerCell);
        row.appendChild(startDateCell);
        row.appendChild(endDateCell);
        row.appendChild(statusCell);
        row.appendChild(activeCell);

        // Append the row to the table
        tbody.appendChild(row);
    });
}

// Setup summary card filters with multi-select support
function setupSummaryCardFilters(reports, selector = '.card.clickable') {
    const cards = document.querySelectorAll(selector);
    if (cards.length === 0) return;

    // Initialize active filters array
    if (!window.activeFilters) {
        window.activeFilters = ['all'];
    }

    // Set the first card (Total) as active by default if this is the main section
    if (selector.includes(':not(.filtered-results')) {
        cards[0].classList.add('active');
    }

    cards.forEach(card => {
        // Remove any existing click event listeners
        const newCard = card.cloneNode(true);
        card.parentNode.replaceChild(newCard, card);

        newCard.addEventListener('click', () => {
            const filterType = newCard.getAttribute('data-filter');

            // Always allow multi-select (no Ctrl key needed)

            // If clicking "all", clear all active filters
            if (filterType === 'all') {
                // Remove active class from all cards
                document.querySelectorAll('.card.clickable').forEach(c => c.classList.remove('active'));
                window.activeFilters = [];
            }

            // Toggle active state for this card
            if (newCard.classList.contains('active')) {
                newCard.classList.remove('active');
                window.activeFilters = window.activeFilters.filter(f => f !== filterType);

                // If no filters are active, default to "all"
                if (window.activeFilters.length === 0) {
                    window.activeFilters = ['all'];
                    // Find and activate the "all" cards
                    document.querySelectorAll('.card.clickable[data-filter="all"]').forEach(c => c.classList.add('active'));
                }
            } else {
                newCard.classList.add('active');

                // If adding a specific filter and "all" is currently active, remove "all"
                if (filterType !== 'all' && window.activeFilters.includes('all')) {
                    window.activeFilters = window.activeFilters.filter(f => f !== 'all');
                    document.querySelectorAll('.card.clickable[data-filter="all"]').forEach(c => c.classList.remove('active'));
                }

                // Add this filter if it's not already in the list
                if (!window.activeFilters.includes(filterType)) {
                    window.activeFilters.push(filterType);
                }
            }

            // Synchronize active state between main and filtered cards
            syncActiveCards();

            // Update the "Select All" checkbox state
            updateSelectAllCheckboxState();

            // Apply the filters to the grid
            populateReportsGrid(reports, window.activeFilters);
        });
    });
}

// Synchronize active state between main and filtered cards
function syncActiveCards() {
    // Get all cards
    const mainCards = document.querySelectorAll('.card.clickable:not(.filtered-results .card.clickable)');
    const filteredCards = document.querySelectorAll('.filtered-results .card.clickable');

    // Update main cards based on active filters
    mainCards.forEach(card => {
        const filterType = card.getAttribute('data-filter');
        if (window.activeFilters.includes(filterType)) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });

    // Update filtered cards based on active filters
    filteredCards.forEach(card => {
        const filterType = card.getAttribute('data-filter');
        if (window.activeFilters.includes(filterType)) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });
}

// Update the "Select All" checkbox state based on active cards
function updateSelectAllCheckboxState() {
    const selectAllCheckbox = document.getElementById('select-all-cards');
    const allCards = document.querySelectorAll('.filtered-results .card.clickable');
    const activeCards = document.querySelectorAll('.filtered-results .card.clickable.active');

    if (activeCards.length === 0) {
        // No cards are active
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
    } else if (activeCards.length === allCards.length) {
        // All cards are active
        selectAllCheckbox.checked = true;
        selectAllCheckbox.indeterminate = false;
    } else {
        // Some cards are active
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = true;
    }
}

// Apply filters and update counts
function applyFilters(reports) {
    // Get selected filters
    const selectedRegions = getSelectedValues('region-list');
    const selectedCompanies = getSelectedValues('company-list');
    const selectedBranches = getSelectedValues('branch-list');
    const selectedSubBranches = getSelectedValues('subbranch-list');

    // Log the selected filters
    console.log('Applied Filters:', {
        regions: selectedRegions,
        companies: selectedCompanies,
        branches: selectedBranches,
        subBranches: selectedSubBranches
    });

    // Filter reports based on selections
    let filteredReports = reports;

    // Apply region filter if any regions are selected
    if (selectedRegions.length > 0) {
        // Check if "Select All" is selected for regions
        if (selectedRegions.includes('Select All')) {
            // Don't filter by region if "Select All" is selected
        } else {
            filteredReports = filteredReports.filter(report =>
                selectedRegions.includes(report.region || 'Unknown'));
        }
    }

    // Apply company filter if any companies are selected
    if (selectedCompanies.length > 0) {
        // Check if "Select All" is selected for companies
        if (selectedCompanies.includes('Select All')) {
            // Don't filter by company if "Select All" is selected
        } else {
            filteredReports = filteredReports.filter(report =>
                selectedCompanies.includes(report.company || 'Unknown'));
        }
    }

    // Apply branch filter if any branches are selected
    if (selectedBranches.length > 0) {
        // Check if "Select All" is selected for branches
        if (selectedBranches.includes('Select All')) {
            // Don't filter by branch if "Select All" is selected
        } else {
            filteredReports = filteredReports.filter(report =>
                selectedBranches.includes(report.branch || 'Unknown'));
        }
    }

    // Apply sub-branch filter if any sub-branches are selected
    if (selectedSubBranches.length > 0) {
        // Check if "Select All" is selected for sub-branches
        if (selectedSubBranches.includes('Select All')) {
            // Don't filter by sub-branch if "Select All" is selected
        } else {
            filteredReports = filteredReports.filter(report =>
                selectedSubBranches.includes(report.subBranch || 'Unknown'));
        }
    }

    // Update the filtered counts
    document.getElementById('filtered-total-count').textContent = filteredReports.length;
    document.getElementById('filtered-set-count').textContent = filteredReports.filter(report => report.status === 'Set').length;
    document.getElementById('filtered-not-set-count').textContent = filteredReports.filter(report => report.status === 'Not Set').length;
    document.getElementById('filtered-active-count').textContent = filteredReports.filter(report => report.active).length;
    document.getElementById('filtered-inactive-count').textContent = filteredReports.filter(report => !report.active).length;

    // Update the "Select All" checkbox state
    updateSelectAllCheckboxState();

    // Apply any card filters that are active
    if (window.activeFilters && window.activeFilters.length > 0 && !(window.activeFilters.length === 1 && window.activeFilters[0] === 'all')) {
        populateReportsGrid(filteredReports, window.activeFilters);
    } else {
        populateReportsGrid(filteredReports, ['all']);
    }
}

// Get selected values from a checkbox list
function getSelectedValues(listId) {
    const checkboxes = document.querySelectorAll(`#${listId} input[type="checkbox"]:checked`);
    return Array.from(checkboxes).map(checkbox => checkbox.value);
}

// Clear all filters and reset the grid
function clearAllFilters(reports) {
    // Uncheck all checkboxes
    const checkboxes = document.querySelectorAll('.checkbox-list input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    // Reset active filters
    window.activeFilters = ['all'];

    // Reset active cards
    document.querySelectorAll('.card.clickable').forEach(card => {
        card.classList.remove('active');
    });

    // Activate the "all" cards
    document.querySelectorAll('.card.clickable[data-filter="all"]').forEach(card => {
        card.classList.add('active');
    });

    // Reset the grid to show all reports
    populateReportsGrid(reports, ['all']);

    // Update the filtered counts
    document.getElementById('filtered-total-count').textContent = reports.length;
    document.getElementById('filtered-set-count').textContent = reports.filter(report => report.status === 'Set').length;
    document.getElementById('filtered-not-set-count').textContent = reports.filter(report => report.status === 'Not Set').length;
    document.getElementById('filtered-active-count').textContent = reports.filter(report => report.active).length;
    document.getElementById('filtered-inactive-count').textContent = reports.filter(report => !report.active).length;
}
