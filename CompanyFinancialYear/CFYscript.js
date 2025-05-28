// script.js

// Array to store financial year data
let CFYFinancialYears = [];

// Dummy data for entities (for client-side demonstration)
const CFYAvailableEntities = ['Global Corp', 'North America Division', 'EMEA Operations', 'Asia Pacific Branch', 'Latin America Unit'];

// Dummy user data for User Management
const CFYAppUsers = {
    'admin': { role: 'admin' },
    'comp': { role: 'company' },
    'auditor': { role: 'auditor' },
    'user1': { role: 'company' },
    'user2': { role: 'auditor' }
};


// Pagination and Sorting State
let CFYCurrentPage = 1;
let CFYRecordsPerPage = 5;
let CFYCurrentSortColumn = 'name'; // Default sort column
let CFYCurrentSortOrder = 'asc'; // 'asc' or 'desc'
let CFYFilterValues = {
    name: '',
    startDate: '',
    endDate: '',
    status: '',
    currentStatus: '', // Added for the new column
    entity: '' // Changed from 'entities' to 'entity' for single record filtering
};

// Chart instances (no longer Chart.js objects, but we'll keep the variables for consistency)
let CFYIncomeExpenseChartInstance = null;
let CFYCashFlowChartInstance = null;
let CFYAssetDistributionChartInstance = null;


// Get references to DOM elements
const CFYLoginSection = document.getElementById('loginSection');
const CFYMainAppSection = document.getElementById('mainAppSection');
const CFYLoginForm = document.getElementById('loginForm');
const CFYLoginError = document.getElementById('loginError');

const CFYDashboardSection = document.getElementById('dashboardSection');
const CFYCompanyDashboard = document.getElementById('companyDashboard');
const CFYAdminDashboard = document.getElementById('adminDashboard');
const CFYFinancialYearManagementSection = document.getElementById('financialYearManagementSection');
const CFYReportingAnalyticsSection = document.getElementById('reportingAnalyticsSection'); // New
const CFYConfigurationSection = document.getElementById('configurationSection'); // New
const CFYSystemIntegrationSection = document.getElementById('systemIntegrationSection'); // Removed this section, but keeping variable for reference if needed
const CFYUserManagementSection = document.getElementById('userManagementSection'); // New

const CFYFinancialYearsTableBody = document.getElementById('financialYearsTableBody');
const CFYNoDataMessage = document.getElementById('noDataMessage');
const CFYMessageBox = document.getElementById('messageBox');
const CFYDarkModeToggle = document.getElementById('darkModeToggle');
const CFYLoggedInUsernameSpan = document.getElementById('loggedInUsername');
const CFYSidebar = document.getElementById('sidebar');
const CFYSidebarToggle = document.getElementById('sidebarToggle');
const CFYSidebarItems = document.querySelectorAll('.sidebar-item'); // Get all sidebar navigation items

// Dashboard metrics for company
const CFYTotalRevenueEl = document.getElementById('totalRevenue');
const CFYNetProfitEl = document.getElementById('netProfit');
const CFYCashFlowEl = document.getElementById('cashFlow');
const CFYBudgetVarianceEl = document.getElementById('budgetVariance');
const CFYOutstandingReceivablesEl = document.getElementById('outstandingReceivables');

// Dashboard metrics for admin
const CFYTotalYearsEl = document.getElementById('totalYears');
const CFYActiveYearsEl = document.getElementById('activeYears');
const CFYClosedYearsEl = document.getElementById('closedYears');
const CFYPendingYearsEl = document.getElementById('pendingYears');
const CFYCurrentYearEl = document.getElementById('currentYear');
const CFYFutureYearsEl = document.getElementById('futureYears');
const CFYPastYearsEl = document.getElementById('pastYears');

// New DOM elements for settings dropdown and logout
const CFYSettingsButton = document.getElementById('settingsButton');
const CFYSettingsDropdown = document.getElementById('settingsDropdown');
const CFYLogoutButton = document.getElementById('logoutButton');

// Data Entry Action Buttons
const CFYAddBtn = document.getElementById('addBtn');
const CFYDeleteBtn = document.getElementById('deleteBtn');
const CFYRefreshBtn = document.getElementById('refreshBtn');

// Table Headers for Sorting
const CFYSortableHeaders = document.querySelectorAll('.sortable');

// Filter Icons and Inputs
const CFYFilterIconButtons = document.querySelectorAll('.filter-icon-btn');
const CFYFilterInputs = document.querySelectorAll('.filter-input-header');


// Pagination Controls
const CFYRecordsPerPageSelect = document.getElementById('recordsPerPage');
const CFYFirstPageBtn = document.getElementById('firstPageBtn');
const CFYPrevPageBtn = document.getElementById('prevPageBtn');
const CFYNextPageBtn = document.getElementById('nextPageBtn');
const CFYLastPageBtn = document.getElementById('lastPageBtn');
const CFYPageInfoSpan = document.getElementById('pageInfo');
const CFYSelectAllCheckbox = document.getElementById('selectAllCheckbox');

// Modal Elements
const CFYAddFinancialYearModal = document.getElementById('addFinancialYearModal');
const CFYCloseModalBtn = document.getElementById('closeModalBtn');
const CFYModalFinancialYearForm = document.getElementById('modalFinancialYearForm');
const CFYModalFinancialYearName = document.getElementById('modalFinancialYearName');
const CFYModalStartDate = document.getElementById('modalStartDate');
const CFYModalEndDate = document.getElementById('modalEndDate');
const CFYModalStatusActiveRadio = document.getElementById('modalStatusActiveRadio'); // New
const CFYModalStatusInactiveRadio = document.getElementById('modalStatusInactiveRadio'); // New
const CFYFinancialYearFormatSelect = document.getElementById('financialYearFormat');

// Custom Multi-Select for Entities in Modal
const CFYSelectedModalEntitiesDisplay = document.getElementById('selectedModalEntitiesDisplay');
const CFYModalEntitiesDropdownList = document.getElementById('modalEntitiesDropdownList');
const CFYEntitySelectionContainer = document.getElementById('entitySelectionContainer');


// Reporting & Analytics Elements
const CFYReportTypeSelect = document.getElementById('reportType');
const CFYReportFinancialYearSelect = document.getElementById('reportFinancialYear');

// Custom Multi-Select for Compare Financial Years
const CFYSelectedCompareYearsDisplay = document.getElementById('selectedCompareYearsDisplay');
const CFYCompareYearsDropdownList = document.getElementById('compareYearsDropdownList');

const CFYCustomPeriodStartInput = document.getElementById('customPeriodStart');
const CFYCustomPeriodEndInput = document.getElementById('customPeriodEnd');
const CFYGenerateReportBtn = document.getElementById('generateReportBtn');
const CFYReportOutputDiv = document.getElementById('reportOutput');
const CFYAuditTrailLogDiv = document.getElementById('auditTrailLog');

// Chart Container Elements (no longer canvas directly)
const CFYIncomeExpenseChartContainer = document.getElementById('incomeExpenseChart');
const CFYCashFlowChartContainer = document.getElementById('cashFlowChart');
const CFYAssetDistributionChartContainer = document.getElementById('assetDistributionChart');

// Configuration Elements
const CFYConfigStartMonthSelect = document.getElementById('configStartMonth');
const CFYConfigStartDayInput = document.getElementById('configStartDay');
const CFYConfigYearDesignationSelect = document.getElementById('configYearDesignation');
const CFYDefaultFinancialYearSelect = document.getElementById('defaultFinancialYear');
const CFYFyStatusYearSelect = document.getElementById('fyStatusYearSelect');
const CFYFyStatusSelect = document.getElementById('fyStatusSelect');
const CFYApplyFyStatusBtn = document.getElementById('applyFyStatusBtn');
const CFYSaveFyDefinitionBtn = document.getElementById('saveFyDefinitionBtn');

const CFYPeriodTypeSelect = document.getElementById('periodType');
const CFYCustomPeriodCountDiv = document.getElementById('customPeriodCountDiv');
const CFYCustomPeriodCountInput = document.getElementById('customPeriodCount');
const CFYPeriodNamingConventionInput = document.getElementById('periodNamingConvention');
const CFYPeriodLockYearSelect = document.getElementById('periodLockYearSelect');
const CFYPeriodLockPeriodSelect = document.getElementById('periodLockPeriodSelect');
const CFYPeriodLockStatusSelect = document.getElementById('periodLockStatusSelect');
const CFYApplyPeriodLockBtn = document.getElementById('applyPeriodLockBtn');
const CFYSavePeriodDefinitionBtn = document.getElementById('savePeriodDefinitionBtn');

const CFYFinancialYearAssociationSection = document.getElementById('financialYearAssociationSection'); // New
const CFYAssociateEntitySelect = document.getElementById('associateEntitySelect');
const CFYAssociateFinancialYearSelect = document.getElementById('associateFinancialYearSelect');
const CFYSaveAssociationBtn = document.getElementById('saveAssociationBtn');

// User Management Elements
const CFYUserManagementSidebarItem = document.getElementById('userManagementSidebarItem'); // New
const CFYSelectUserDropdown = document.getElementById('selectUser'); // New
const CFYAssignRoleRadios = document.querySelectorAll('input[name="assignRole"]'); // New
const CFYSaveUserRoleBtn = document.getElementById('saveUserRoleBtn'); // New
const CFYCurrentUserRolesDiv = document.getElementById('currentUserRoles'); // New


// Audit Trail Data
let CFYAuditLog = [];

// Configuration Data (dummy for now)
let CFYFinancialYearDefinitions = []; // Stores objects like { startMonth: 3, startDay: 1, yearDesignation: 'FY_YYYY-YY' }
let CFYPeriodDefinitions = []; // Stores objects like { type: 'monthly', naming: 'P{num} {year}' }
let CFYEntityFinancialYearAssociations = {}; // Stores { entityName: 'FY_Name' }
let CFYDefaultSystemFinancialYear = null;


// Hardcoded credentials
const CFYUsers = {
    'comp': 'comp123',
    'admin': 'ad123'
};

// Variable to store the logged-in user's role
let CFYLoggedInUserRole = null;

// Store selected entities and comparison years for custom multi-selects
let CFYSelectedModalEntities = [];
let CFYSelectedCompareYears = [];


/**
 * Displays a temporary message box with a given message and type (success/error).
 * @param {string} message - The message to display.
 * @param {string} type - 'success' or 'error'.
 */
function CFYShowMessageBox(message, type) {
    CFYMessageBox.textContent = message;
    CFYMessageBox.className = 'message-box show'; // Reset classes and show
    if (type === 'error') {
        CFYMessageBox.classList.add('error');
    } else {
        CFYMessageBox.classList.remove('error');
    }

    // Hide the message after 3 seconds
    setTimeout(() => {
        CFYMessageBox.classList.remove('show');
    }, 3000);
}

/**
 * Adds an entry to the audit log and updates the display.
 * @param {string} action - Description of the action performed.
 */
function CFYAddAuditEntry(action) {
    const timestamp = new Date().toLocaleString();
    const username = sessionStorage.getItem('CFYLoggedInUsername') || 'Unknown User';
    const entry = `${timestamp} - ${username}: ${action}`;
    CFYAuditLog.push(entry);
    CFYRenderAuditLog();
}

/**
 * Renders the audit log entries into the auditTrailLogDiv.
 */
function CFYRenderAuditLog() {
    CFYAuditTrailLogDiv.innerHTML = '';
    if (CFYAuditLog.length === 0) {
        CFYAuditTrailLogDiv.innerHTML = '<p class="text-gray-500 dark:text-gray-400">No audit entries yet.</p>';
    } else {
        CFYAuditLog.slice().reverse().forEach(entry => { // Show most recent first
            const p = document.createElement('p');
            p.textContent = entry;
            CFYAuditTrailLogDiv.appendChild(p);
        });
    }
}


/**
 * Applies or removes the dark mode class based on the 'isDark' parameter.
 * Also saves the preference to localStorage.
 * @param {boolean} isDark - True to enable dark mode, false to disable.
 */
function CFYApplyDarkMode(isDark) {
    if (isDark) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
    localStorage.setItem('CFYDarkMode', isDark);
    CFYDarkModeToggle.checked = isDark; // Update toggle state
}

/**
 * Hides all main content sections and shows the specified one.
 * @param {string} sectionId - The ID of the section to show.
 */
function CFYShowSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');

    // Update active state in sidebar
    CFYSidebarItems.forEach(item => {
        item.classList.remove('active-sidebar-item'); // Remove active class from all
        if (item.dataset.section === sectionId) {
            item.classList.add('active-sidebar-item'); // Add active class to the current one
        }
    });

    // If showing dashboard, render the correct dashboard view
    if (sectionId === 'dashboardSection') {
        CFYRenderDashboard();
    } else if (sectionId === 'financialYearManagementSection') {
        // Re-render table when navigating to Data Entry
        CFYRenderTable();
    } else if (sectionId === 'reportingAnalyticsSection') {
        CFYPopulateReportingFinancialYears();
        CFYRenderAuditLog(); // Ensure audit log is rendered when this section is shown
        CFYRenderIncomeExpenseChart();
        CFYRenderCashFlowChart();
        CFYRenderAssetDistributionChart();
    } else if (sectionId === 'configurationSection') {
        CFYPopulateConfigurationDropdowns();
        CFYRenderAuditLog();
        // Show/hide Financial Year Association section based on user role
        if (CFYLoggedInUserRole === 'admin') {
            CFYFinancialYearAssociationSection.classList.remove('hidden');
        } else {
            CFYFinancialYearAssociationSection.classList.add('hidden');
        }
    } else if (sectionId === 'userManagementSection') {
        if (CFYLoggedInUserRole === 'admin') {
            CFYPopulateUserManagement();
            CFYRenderCurrentUserRoles();
            CFYUserManagementSection.classList.remove('hidden');
        } else {
            // If not admin, hide this section and redirect to dashboard
            CFYUserManagementSection.classList.add('hidden');
            CFYShowMessageBox('Access Denied: You do not have permission to view User Management.', 'error');
            CFYShowSection('dashboardSection'); 
        }
        CFYRenderAuditLog();
    }
}

/**
 * Renders the appropriate dashboard based on the logged-in user's role.
 */
function CFYRenderDashboard() {
    CFYCompanyDashboard.classList.add('hidden');
    CFYAdminDashboard.classList.add('hidden');

    if (CFYLoggedInUserRole === 'comp') {
        CFYCompanyDashboard.classList.remove('hidden');
        CFYRenderCompanyDashboard();
    } else if (CFYLoggedInUserRole === 'admin') {
        CFYAdminDashboard.classList.remove('hidden');
        CFYRenderAdminDashboard();
    }
}

/**
 * Renders the company-specific dashboard metrics.
 */
function CFYRenderCompanyDashboard() {
    // Dummy data for company metrics
    const totalRevenue = 15000000;
    const netProfit = 3500000;
    const cashFlow = 2800000;
    const budgetVariance = -150000; // Negative for over budget
    const outstandingReceivables = 750000;

    CFYTotalRevenueEl.textContent = `$${totalRevenue.toLocaleString()}`;
    CFYNetProfitEl.textContent = `$${netProfit.toLocaleString()}`;
    CFYCashFlowEl.textContent = `$${cashFlow.toLocaleString()}`;
    CFYBudgetVarianceEl.textContent = `$${budgetVariance.toLocaleString()}`;
    CFYOutstandingReceivablesEl.textContent = `$${outstandingReceivables.toLocaleString()}`;
}

/**
 * Renders the admin-specific dashboard statistics.
 */
function CFYRenderAdminDashboard() {
    const now = new Date();
    let totalEntities = new Set(); // To count unique entities
    let totalYearsCount = CFYFinancialYears.length;
    let activeCount = 0;
    let closedCount = 0;
    let currentYearName = 'N/A';
    let futureCount = 0;
    let pastCount = 0;

    CFYFinancialYears.forEach(year => {
        const startDate = new Date(year.startDate);
        const endDate = new Date(year.endDate);

        if (year.status === 'Active') {
            activeCount++;
        } else if (year.status === 'Closed') {
            closedCount++;
        }

        // Determine current, future, past
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to start of day
        if (today >= startDate && today <= endDate) {
            currentYearName = year.name;
        } else if (today < startDate) {
            futureCount++;
        } else if (today > endDate) {
            pastCount++;
        }

        if (year.entity) {
            totalEntities.add(year.entity);
        }
    });

    CFYTotalYearsEl.textContent = totalYearsCount;
    CFYActiveYearsEl.textContent = activeCount;
    CFYClosedYearsEl.textContent = closedCount;
    CFYPendingYearsEl.textContent = totalYearsCount - activeCount - closedCount; // Assuming pending is total - active - closed
    CFYCurrentYearEl.textContent = currentYearName;
    CFYFutureYearsEl.textContent = futureCount;
    CFYPastYearsEl.textContent = pastCount;
}


/**
 * Handles the login form submission.
 * @param {Event} event - The form submission event.
 */
CFYLoginForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (CFYUsers[username] === password) {
        // Successful login
        CFYLoginError.classList.add('hidden');
        CFYLoginSection.style.display = 'none'; // Hide login section
        CFYMainAppSection.style.display = 'flex'; // Show main app section
        CFYShowMessageBox(`Welcome, ${username}!`, 'success');
        
        // Set the logged-in user role
        CFYLoggedInUserRole = username === 'admin' ? 'admin' : 'comp';
        sessionStorage.setItem('CFYLoggedInUserRole', CFYLoggedInUserRole); // Store role in session storage
        sessionStorage.setItem('CFYLoggedInUsername', username); // Store username in session storage

        // Display the logged-in username in the header
        CFYLoggedInUsernameSpan.textContent = username;

        // Show the dashboard as the default landing page
        CFYShowSection('dashboardSection');
        CFYAddAuditEntry(`User "${username}" logged in.`);
    } else {
        // Invalid credentials
        CFYLoginError.classList.remove('hidden');
        CFYShowMessageBox('Invalid username or password.', 'error');
    }
});

/**
 * Handles the dark mode toggle switch.
 */
CFYDarkModeToggle.addEventListener('change', function() {
    CFYApplyDarkMode(this.checked);
});

/**
 * Function to toggle sidebar collapse
 */
function CFYToggleSidebar() {
    document.body.classList.toggle('sidebar-collapsed');
    // Store sidebar state in localStorage
    const isCollapsed = document.body.classList.contains('sidebar-collapsed');
    localStorage.setItem('CFYSidebarCollapsed', isCollapsed);
}

/**
 * Event listener for sidebar toggle button
 */
CFYSidebarToggle.addEventListener('click', CFYToggleSidebar);

/**
 * Event listeners for sidebar navigation items.
 * Uses event delegation for efficiency.
 */
CFYSidebarItems.forEach(item => {
    item.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default link behavior
        const sectionId = this.dataset.section;
        if (sectionId) {
            CFYShowSection(sectionId);
        }
    });
});

/**
 * Toggles the visibility of the settings dropdown.
 */
CFYSettingsButton.addEventListener('click', function() {
    CFYSettingsDropdown.classList.toggle('hidden');
});

// Close the dropdown if the user clicks outside of it
window.addEventListener('click', function(event) {
    if (!CFYSettingsButton.contains(event.target) && !CFYSettingsDropdown.contains(event.target)) {
        CFYSettingsDropdown.classList.add('hidden');
    }
});

/**
 * Handles the logout functionality.
 */
CFYLogoutButton.addEventListener('click', function() {
    // Clear session storage
    sessionStorage.removeItem('CFYLoggedInUserRole');
    sessionStorage.removeItem('CFYLoggedInUsername');
    CFYLoggedInUserRole = null; // Reset the global variable

    // Hide main app and show login section
    CFYMainAppSection.style.display = 'none'; // Hide main app section
    CFYLoginSection.style.display = 'flex'; // Show login section

    // Clear login form fields
    CFYLoginForm.reset();

    // Optionally clear financial years data for a fresh start
    CFYFinancialYears = [];
    CFYRenderTable(); // Update the table to show no data

    CFYShowMessageBox('Logged out successfully!', 'success');
    CFYAddAuditEntry('User logged out.');
});


/**
 * Filters and sorts the financial years data.
 * @returns {Array} The filtered and sorted array.
 */
function CFYGetFilteredAndSortedFinancialYears() {
    let filteredData = [...CFYFinancialYears]; // Create a copy to avoid modifying original

    // Apply filters
    Object.keys(CFYFilterValues).forEach(key => {
        const filterValue = CFYFilterValues[key].toLowerCase();
        if (filterValue) {
            filteredData = filteredData.filter(year => {
                let valueToFilter = '';

                if (key === 'currentStatus') {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const yearStartDate = new Date(year.startDate);
                    yearStartDate.setHours(0, 0, 0, 0);
                    const yearEndDate = new Date(year.endDate);
                    yearEndDate.setHours(0, 0, 0, 0);

                    if (today > yearEndDate) {
                        valueToFilter = 'past';
                    } else if (today >= yearStartDate && today <= yearEndDate) {
                        valueToFilter = 'current';
                    } else if (today < yearStartDate) {
                        valueToFilter = 'future';
                    }
                } else if (key === 'entity') { // Filter by single entity string
                    return String(year.entity || '').toLowerCase().includes(filterValue);
                } else {
                    valueToFilter = String(year[key]).toLowerCase();
                }
                return valueToFilter.includes(filterValue);
            });
        }
    });

    // Apply sorting
    if (CFYCurrentSortColumn) {
        filteredData.sort((a, b) => {
            let valA = a[CFYCurrentSortColumn];
            let valB = b[CFYCurrentSortColumn];

            // Handle date comparison
            if (CFYCurrentSortColumn === 'startDate' || CFYCurrentSortColumn === 'endDate') {
                valA = new Date(valA);
                valB = new Date(valB);
            }
            // Handle currentStatus sorting
            else if (CFYCurrentSortColumn === 'currentStatus') {
                const order = { 'past': 1, 'current': 2, 'future': 3 }; // Define a custom sort order
                let statusA, statusB;

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const yearAStartDate = new Date(a.startDate);
                yearAStartDate.setHours(0, 0, 0, 0);
                const yearAEndDate = new Date(a.endDate);
                yearAEndDate.setHours(0, 0, 0, 0);

                const yearBStartDate = new Date(b.startDate);
                yearBStartDate.setHours(0, 0, 0, 0);
                const yearBEndDate = new Date(b.endDate);
                yearBEndDate.setHours(0, 0, 0, 0);

                if (today > yearAEndDate) statusA = 'past';
                else if (today >= yearAStartDate && today <= yearAEndDate) statusA = 'current';
                else statusA = 'future';

                if (today > yearBEndDate) statusB = 'past';
                else if (today >= yearBStartDate && today <= yearBEndDate) statusB = 'current';
                else statusB = 'future';

                valA = order[statusA];
                valB = order[statusB];
            }
            // Handle entity sorting (alphabetical)
            else if (CFYCurrentSortColumn === 'entity') {
                valA = String(valA || '');
                valB = String(valB || '');
            }


            if (valA < valB) {
                return CFYCurrentSortOrder === 'asc' ? -1 : 1;
            }
            if (valA > valB) {
                return CFYCurrentSortOrder === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }
    return filteredData;
}

/**
 * Renders the financial years data into the table with pagination, sorting, and filtering.
 */
function CFYRenderTable() {
    const filteredAndSortedData = CFYGetFilteredAndSortedFinancialYears();
    CFYFinancialYearsTableBody.innerHTML = ''; // Clear existing rows

    if (filteredAndSortedData.length === 0) {
        CFYNoDataMessage.classList.remove('hidden');
        CFYPageInfoSpan.textContent = 'Page 0 of 0';
        CFYFirstPageBtn.disabled = true;
        CFYPrevPageBtn.disabled = true;
        CFYNextPageBtn.disabled = true;
        CFYLastPageBtn.disabled = true;
        CFYSelectAllCheckbox.checked = false; // Uncheck select all
        return;
    } else {
        CFYNoDataMessage.classList.add('hidden');
    }

    // Calculate pagination details
    const totalPages = Math.ceil(filteredAndSortedData.length / CFYRecordsPerPage);
    CFYCurrentPage = Math.min(Math.max(1, CFYCurrentPage), totalPages); // Ensure CFYCurrentPage is valid

    const startIndex = (CFYCurrentPage - 1) * CFYRecordsPerPage;
    const endIndex = startIndex + CFYRecordsPerPage;
    const paginatedData = filteredAndSortedData.slice(startIndex, endIndex);

    paginatedData.forEach((year, index) => {
        const row = CFYFinancialYearsTableBody.insertRow();
        // Store original index for deletion, but now it's the index in the `CFYFinancialYears` array
        row.dataset.originalIndex = CFYFinancialYears.indexOf(year); 

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today's date to start of day

        const yearStartDate = new Date(year.startDate);
        yearStartDate.setHours(0, 0, 0, 0);

        const yearEndDate = new Date(year.endDate);
        yearEndDate.setHours(0, 0, 0, 0);

        let currentStatusLabel = '';
        let statusColorClass = '';

        if (today > yearEndDate) {
            currentStatusLabel = 'Past';
            statusColorClass = 'text-red-500';
        } else if (today >= yearStartDate && today <= yearEndDate) {
            currentStatusLabel = 'Current';
            statusColorClass = 'text-green-500';
        } else if (today < yearStartDate) {
            currentStatusLabel = 'Future';
            statusColorClass = 'text-blue-500';
        }

        // Display the single entity for the row, or 'N/A' if not defined
        const entityDisplay = year.entity ? year.entity : 'N/A';


        row.innerHTML = `
            <td class="py-3 px-4">
                <input type="checkbox" class="row-checkbox form-checkbox rounded text-blue-500">
            </td>
            <td class="py-3 px-4">${entityDisplay}</td>
            <td class="py-3 px-4">${year.name}</td>
            <td class="py-3 px-4">${year.startDate}</td>
            <td class="py-3 px-4">${year.endDate}</td>
            <td class="py-3 px-4">${year.status}</td>
            <td class="py-3 px-4 ${statusColorClass}">${currentStatusLabel}</td>
        `;
    });

    // Update pagination info
    CFYPageInfoSpan.textContent = `Page ${CFYCurrentPage} of ${totalPages}`;
    CFYFirstPageBtn.disabled = CFYCurrentPage === 1;
    CFYPrevPageBtn.disabled = CFYCurrentPage === 1;
    CFYNextPageBtn.disabled = CFYCurrentPage === totalPages;
    CFYLastPageBtn.disabled = CFYCurrentPage === totalPages;

    CFYSelectAllCheckbox.checked = false; // Reset select all checkbox after re-render
}

// Event Listeners for Action Buttons
CFYAddBtn.addEventListener('click', function() {
    CFYAddFinancialYearModal.classList.remove('hidden'); // Show the modal
    CFYModalFinancialYearForm.reset(); // Clear modal form fields
    // Reset auto-filled fields when opening modal
    CFYModalFinancialYearName.value = '';
    CFYModalEndDate.value = '';
    // Ensure format is set to default or last selected
    CFYFinancialYearFormatSelect.value = 'YYYY-YY';

    // Set min date for modalStartDate to today
    const today = new Date();
    const todayISO = today.toISOString().split('T')[0];
    CFYModalStartDate.min = todayISO;

    // Trigger update to set initial status and year name
    CFYUpdateFinancialYearDetails();

    // Show/hide entity selection based on logged-in role
    if (CFYLoggedInUserRole === 'admin') {
        CFYEntitySelectionContainer.classList.remove('hidden');
        CFYPopulateModalEntitiesSelect(); // Populate and update display
    } else {
        CFYEntitySelectionContainer.classList.add('hidden');
    }
});

CFYCloseModalBtn.addEventListener('click', function() {
    CFYAddFinancialYearModal.classList.add('hidden'); // Hide the modal
});

/**
 * Populates the entities multi-select dropdown in the modal.
 */
function CFYPopulateModalEntitiesSelect() {
    CFYModalEntitiesDropdownList.innerHTML = ''; // Clear existing options
    CFYSelectedModalEntities = []; // Reset selected entities
    CFYUpdateMultiSelectDisplay(CFYSelectedModalEntitiesDisplay, CFYSelectedModalEntities, 'Select entities...');

    CFYAvailableEntities.forEach(entity => {
        const div = document.createElement('div');
        div.className = 'multi-select-option p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer';
        div.innerHTML = `
            <label class="flex items-center">
                <input type="checkbox" value="${entity}" class="form-checkbox rounded text-blue-500 mr-2">
                <span>${entity}</span>
            </label>
        `;
        div.querySelector('input').addEventListener('change', (event) => {
            CFYHandleMultiSelectItemClick(event, CFYSelectedModalEntities, CFYSelectedModalEntitiesDisplay, 'Select entities...');
        });
        CFYModalEntitiesDropdownList.appendChild(div);
    });
}

/**
 * Calculates and updates the 'To Date' and 'Financial Year Name' based on 'From Date'.
 * Also sets the status radio buttons.
 */
function CFYUpdateFinancialYearDetails() {
    const fromDateStr = CFYModalStartDate.value;
    if (!fromDateStr) {
        CFYModalEndDate.value = '';
        CFYModalFinancialYearName.value = '';
        CFYModalStatusActiveRadio.disabled = true;
        CFYModalStatusInactiveRadio.disabled = true;
        CFYModalStatusInactiveRadio.checked = true; // Default to inactive if no date
        return;
    }

    const fromDate = new Date(fromDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date to start of day

    // Calculate To Date (12 months from fromDate, minus one day)
    const toDate = new Date(fromDate);
    toDate.setFullYear(toDate.getFullYear() + 1);
    toDate.setDate(toDate.getDate() - 1);
    CFYModalEndDate.value = toDate.toISOString().split('T')[0]; // Format as ISO-MM-DD

    // Calculate Financial Year Name
    const startYear = fromDate.getFullYear();
    const startMonth = fromDate.getMonth(); // 0-indexed (0 = Jan, 3 = Apr)

    let financialYearStart = startYear;
    let financialYearEnd = (startYear % 100) + 1; // For YY format

    // If financial year starts in April (month 3) or later, it's YYYY-YY or FYYYYY-YY
    // For example, 2025-04-01 to 2026-03-31 -> 2025-26 or FY2025-26
    if (startMonth >= 3) { 
        financialYearStart = startYear;
        financialYearEnd = (startYear % 100) + 1;
    } else { // If financial year starts in Jan, Feb, Mar, it's part of previous year's FY
             // For example, 2025-01-01 would be part of FY2024-25
        financialYearStart = startYear - 1;
        financialYearEnd = (startYear % 100);
    }
    
    const format = CFYFinancialYearFormatSelect.value;
    let financialYearName = '';

    if (format === 'YYYY-YY') {
        financialYearName = `${financialYearStart}-${String(financialYearEnd).padStart(2, '0')}`;
    } else if (format === 'FY_YYYY-YY') {
        financialYearName = `FY${financialYearStart}-${String(financialYearEnd).padStart(2, '0')}`;
    }
    CFYModalFinancialYearName.value = financialYearName;

    // Set status based on date
    const calculatedEndDate = new Date(CFYModalEndDate.value);
    calculatedEndDate.setHours(0, 0, 0, 0);

    if (today > calculatedEndDate || fromDate > today) { // Past or Future
        CFYModalStatusInactiveRadio.checked = true;
        CFYModalStatusActiveRadio.disabled = true;
        CFYModalStatusInactiveRadio.disabled = true;
    } else { // Current
        CFYModalStatusActiveRadio.disabled = false;
        CFYModalStatusInactiveRadio.disabled = false;
        CFYModalStatusActiveRadio.checked = true; // Default to active for current year
    }
}

// Add event listeners for auto-filling
CFYModalStartDate.addEventListener('input', CFYUpdateFinancialYearDetails);
CFYFinancialYearFormatSelect.addEventListener('change', CFYUpdateFinancialYearDetails);


// Handle modal form submission
CFYModalFinancialYearForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get form values from modal
    const financialYearName = CFYModalFinancialYearName.value.trim();
    const startDate = CFYModalStartDate.value;
    const endDate = CFYModalEndDate.value;
    const status = document.querySelector('input[name="modalStatus"]:checked').value; // Get value from radio button
    
    let entitiesToAdd = [];
    if (CFYLoggedInUserRole === 'admin') {
        entitiesToAdd = [...CFYSelectedModalEntities]; // Use the array from custom multi-select
        if (entitiesToAdd.length === 0) {
            CFYShowMessageBox('Admin must select at least one entity.', 'error');
            return;
        }
    } else {
        entitiesToAdd = ['Default Company Entity']; 
    }


    // Basic validation
    if (!financialYearName || !startDate || !endDate || !status) {
        CFYShowMessageBox('Please fill in all required fields in the modal.', 'error');
        return;
    }

    // Date validation: End date must be after start date
    if (new Date(startDate) >= new Date(endDate)) {
        CFYShowMessageBox('End Date must be after Start Date.', 'error');
        return;
    }

    // Create a separate record for each selected entity
    entitiesToAdd.forEach(entity => {
        const newFinancialYear = {
            name: financialYearName,
            startDate: startDate,
            endDate: endDate,
            status: status,
            entity: entity // Assign a single entity to each record
        };
        CFYFinancialYears.push(newFinancialYear);
        CFYAddAuditEntry(`Added financial year "${financialYearName}" for entity "${entity}".`);
    });
    
    CFYShowMessageBox(`${entitiesToAdd.length} financial year(s) added successfully!`, 'success');

    // Re-render the table with new data
    CFYRenderTable();

    // Clear the form and hide the modal
    CFYModalFinancialYearForm.reset();
    CFYAddFinancialYearModal.classList.add('hidden');
    CFYSelectedModalEntities = []; // Clear selected entities after submission
});


CFYDeleteBtn.addEventListener('click', function() {
    const checkboxes = document.querySelectorAll('.row-checkbox:checked');
    if (checkboxes.length === 0) {
        CFYShowMessageBox('Please select at least one row to delete.', 'error');
        return;
    }

    // Get original indices of selected rows (in reverse to avoid issues with array shifting)
    const originalIndicesToDelete = Array.from(checkboxes)
        .map(cb => parseInt(cb.closest('tr').dataset.originalIndex))
        .sort((a, b) => b - a); // Sort descending

    // Store names of deleted years for audit trail
    const deletedYearNames = [];
    originalIndicesToDelete.forEach(index => {
        if (CFYFinancialYears[index]) {
            deletedYearNames.push(`"${CFYFinancialYears[index].name}" (Entity: ${CFYFinancialYears[index].entity || 'N/A'})`);
        }
        CFYFinancialYears.splice(index, 1);
    });

    // Recalculate total pages and adjust current page if necessary
    const totalPagesAfterDeletion = Math.ceil(CFYFinancialYears.length / CFYRecordsPerPage);
    if (CFYCurrentPage > totalPagesAfterDeletion && totalPagesAfterDeletion > 0) {
        CFYCurrentPage = 1; // Reset to page 1 if current page is invalid or no data
    } else if (CFYFinancialYears.length === 0) {
        CFYCurrentPage = 1; // Go back to first page if no data
    }

    CFYRenderTable();
    CFYShowMessageBox(`${checkboxes.length} financial year(s) deleted.`, 'success');
    CFYAddAuditEntry(`Deleted ${checkboxes.length} financial year(s): ${deletedYearNames.join(', ')}.`);
});

CFYRefreshBtn.addEventListener('click', function() {
    // Clear all filter inputs
    CFYFilterInputs.forEach(input => {
        input.value = '';
    });
    // Reset CFYFilterValues object
    CFYFilterValues = {
        name: '',
        startDate: '',
        endDate: '',
        status: '',
        currentStatus: '',
        entity: '' // Reset entity filter
    };
    CFYCurrentPage = 1; // Reset to first page on refresh
    CFYRenderTable();
    CFYShowMessageBox('Table refreshed and filters cleared.', 'success');
    CFYAddAuditEntry('Financial years table refreshed and filters cleared.');
});

// Select All Checkbox functionality
CFYSelectAllCheckbox.addEventListener('change', function() {
    const checkboxes = document.querySelectorAll('.row-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
    });
});

// Event Listeners for Sorting
CFYSortableHeaders.forEach(header => {
    header.addEventListener('click', function(event) {
        // Check if the click was on the filter icon, if so, don't sort
        if (event.target.closest('.filter-icon-btn')) {
            return;
        }

        const sortBy = this.dataset.sortBy;

        // Remove existing sort icons
        CFYSortableHeaders.forEach(h => {
            h.classList.remove('asc', 'desc');
        });

        if (CFYCurrentSortColumn === sortBy) {
            CFYCurrentSortOrder = CFYCurrentSortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            CFYCurrentSortColumn = sortBy;
            CFYCurrentSortOrder = 'asc'; // Default to ascending when changing column
        }

        this.classList.add(CFYCurrentSortOrder); // Add class for current sort order
        CFYRenderTable();
    });
});

// Event Listeners for Filter Icons and Inputs
CFYFilterIconButtons.forEach(button => {
    button.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent click from bubbling to sortable header
        const targetInputId = this.dataset.filterTarget;
        const targetInput = document.getElementById(targetInputId);

        // Hide all other filter inputs
        CFYFilterInputs.forEach(input => {
            if (input !== targetInput) {
                input.classList.add('hidden');
            }
        });

        // Toggle visibility of the clicked input
        targetInput.classList.toggle('hidden');
        if (!targetInput.classList.contains('hidden')) {
            targetInput.focus();
        }
    });
});

CFYFilterInputs.forEach(input => {
    // Apply filter on input change
    input.addEventListener('input', function() {
        const filterBy = this.dataset.filterBy;
        CFYFilterValues[filterBy] = this.value;
        CFYCurrentPage = 1; // Reset to first page on filter change
        CFYRenderTable();
    });

    // Hide input when it loses focus, unless it's a select (which needs click to close)
    input.addEventListener('blur', function() {
        // Delay hiding to allow for clicks within the select dropdown
        if (this.tagName !== 'SELECT') {
             setTimeout(() => {
                this.classList.add('hidden');
            }, 100); // Small delay
        }
    });

    // For select elements, handle change to apply filter immediately
    if (input.tagName === 'SELECT') {
        input.addEventListener('change', function() {
            const filterBy = this.dataset.filterBy;
            CFYFilterValues[filterBy] = this.value;
            CFYCurrentPage = 1; // Reset to first page on filter change
            CFYRenderTable();
            this.classList.add('hidden'); // Hide after selection
        });
    }
});

// Close filter inputs when clicking anywhere else on the window
window.addEventListener('click', function(event) {
    CFYFilterInputs.forEach(input => {
        // Check if the click target is NOT the input itself and NOT its parent filter button
        if (!input.contains(event.target) && !event.target.closest('.filter-icon-btn')) {
            input.classList.add('hidden');
        }
    });
    // Also close custom multi-select dropdowns
    if (!event.target.closest('.custom-multi-select-container')) {
        CFYModalEntitiesDropdownList.classList.add('hidden');
        CFYCompareYearsDropdownList.classList.add('hidden');
    }
});


// Event Listeners for Pagination
CFYRecordsPerPageSelect.addEventListener('change', function() {
    CFYRecordsPerPage = parseInt(this.value);
    CFYCurrentPage = 1; // Reset to first page when records per page changes
    CFYRenderTable();
});

CFYFirstPageBtn.addEventListener('click', () => {
    CFYCurrentPage = 1;
    CFYRenderTable();
});

CFYPrevPageBtn.addEventListener('click', () => {
    if (CFYCurrentPage > 1) {
        CFYCurrentPage--;
        CFYRenderTable();
    }
});

CFYNextPageBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(CFYGetFilteredAndSortedFinancialYears().length / CFYRecordsPerPage);
    if (CFYCurrentPage < totalPages) {
        CFYCurrentPage++;
        CFYRenderTable();
    }
});

CFYLastPageBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(CFYGetFilteredAndSortedFinancialYears().length / CFYRecordsPerPage);
    CFYCurrentPage = totalPages;
    CFYRenderTable();
});

// Reporting & Analytics Functions
function CFYPopulateReportingFinancialYears() {
    // Clear existing options
    CFYReportFinancialYearSelect.innerHTML = '<option value="">-- Select --</option>';
    
    // Populate single select for report year
    const uniqueYears = [...new Set(CFYFinancialYears.map(year => year.name))].sort();
    uniqueYears.forEach(yearName => {
        const option = document.createElement('option');
        option.value = yearName;
        option.textContent = yearName;
        CFYReportFinancialYearSelect.appendChild(option);
    });

    // Populate custom multi-select for comparison years
    CFYCompareYearsDropdownList.innerHTML = ''; // Clear existing options
    CFYSelectedCompareYears = []; // Reset selected comparison years
    CFYUpdateMultiSelectDisplay(CFYSelectedCompareYearsDisplay, CFYSelectedCompareYears, 'Select years...');

    uniqueYears.forEach(yearName => {
        const div = document.createElement('div');
        div.className = 'multi-select-option p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer';
        div.innerHTML = `
            <label class="flex items-center">
                <input type="checkbox" value="${yearName}" class="form-checkbox rounded text-blue-500 mr-2">
                <span>${yearName}</span>
            </label>
        `;
        div.querySelector('input').addEventListener('change', (event) => {
            CFYHandleMultiSelectItemClick(event, CFYSelectedCompareYears, CFYSelectedCompareYearsDisplay, 'Select years...');
        });
        CFYCompareYearsDropdownList.appendChild(div);
    });
}

// Custom Multi-Select Logic
function CFYToggleMultiSelectDropdown(dropdownListElement) {
    // Hide all other multi-select dropdowns
    document.querySelectorAll('.multi-select-dropdown-list').forEach(list => {
        if (list !== dropdownListElement) {
            list.classList.add('hidden');
        }
    });
    dropdownListElement.classList.toggle('hidden');
}

function CFYHandleMultiSelectItemClick(event, selectedArray, displayElement, placeholderText) {
    const value = event.target.value;
    if (event.target.checked) {
        if (!selectedArray.includes(value)) {
            selectedArray.push(value);
        }
    } else {
        const index = selectedArray.indexOf(value);
        if (index > -1) {
            selectedArray.splice(index, 1);
        }
    }
    CFYUpdateMultiSelectDisplay(displayElement, selectedArray, placeholderText);
}

function CFYUpdateMultiSelectDisplay(displayElement, selectedArray, placeholderText) {
    displayElement.innerHTML = ''; // Clear current display

    if (selectedArray.length === 0) {
        const span = document.createElement('span');
        span.className = 'placeholder-text text-gray-500 dark:text-gray-400';
        span.textContent = placeholderText;
        displayElement.appendChild(span);
    } else {
        selectedArray.forEach(item => {
            const span = document.createElement('span');
            span.className = 'selected-tag bg-blue-200 text-blue-800 dark:bg-blue-700 dark:text-blue-100 px-2 py-1 rounded-full text-sm flex items-center';
            span.textContent = item;
            displayElement.appendChild(span);
        });
    }
}

// Event listeners for custom multi-select dropdowns
CFYSelectedModalEntitiesDisplay.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent click from propagating to window and closing dropdown
    CFYToggleMultiSelectDropdown(CFYModalEntitiesDropdownList);
});

CFYSelectedCompareYearsDisplay.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent click from propagating to window and closing dropdown
    CFYToggleMultiSelectDropdown(CFYCompareYearsDropdownList);
});


CFYGenerateReportBtn.addEventListener('click', function() {
    const selectedReportType = CFYReportTypeSelect.value;
    const selectedFinancialYear = CFYReportFinancialYearSelect.value;
    // Get selected comparison years from the custom multi-select
    const selectedCompareYearsForReport = [...CFYSelectedCompareYears]; 
    const customStart = CFYCustomPeriodStartInput.value;
    const customEnd = CFYCustomPeriodEndInput.value;

    let reportContent = `<h3 class="text-xl font-semibold mb-2">Generated Report:</h3>`;

    if (!selectedReportType) {
        reportContent += `<p class="text-red-500">Please select a Report Type.</p>`;
    } else {
        reportContent += `<p><strong>Report Type:</strong> ${selectedReportType}</p>`;
        if (selectedFinancialYear) {
            reportContent += `<p><strong>For Financial Year:</strong> ${selectedFinancialYear}</p>`;
        }
        if (selectedCompareYearsForReport.length > 0) {
            reportContent += `<p><strong>Comparing With:</strong> ${selectedCompareYearsForReport.join(', ')}</p>`;
        }
        if (customStart && customEnd) {
            reportContent += `<p><strong>Custom Period:</strong> ${customStart} to ${customEnd}</p>`;
        }

        reportContent += `<p class="mt-4"><em>(Placeholder for detailed report data or charts for ${selectedReportType})</em></p>`;
        
        // Dummy data for example
        if (selectedReportType === 'profitLoss') {
            reportContent += `
                <div class="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <p><strong>Total Revenue:</strong> $1,500,000</p>
                    <p><strong>Cost of Goods Sold:</strong> $800,000</p>
                    <p><strong>Gross Profit:</strong> $700,000</p>
                    <p><strong>Operating Expenses:</strong> $300,000</p>
                    <p><strong>Net Profit:</strong> $400,000</p>
                </div>
            `;
        } else if (selectedReportType === 'balanceSheet') {
            reportContent += `
                <div class="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <p><strong>Assets:</strong> $2,000,000</p>
                    <p><strong>Liabilities:</strong> $700,000</p>
                    <p><strong>Equity:</strong> $1,300,000</p>
                </div>
            `;
        } else if (selectedReportType === 'cashFlow') {
            reportContent += `
                <div class="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <p><strong>Operating Activities:</strong> $500,000</p>
                    <p><strong>Investing Activities:</strong> -$100,000</p>
                    <p><strong>Financing Activities:</strong> -$50,000</p>
                    <p><strong>Net Cash Flow:</strong> $350,000</p>
                </div>
            `;
        }
    }
    CFYReportOutputDiv.innerHTML = reportContent;
    CFYAddAuditEntry(`Generated "${selectedReportType}" report.`);
});

/**
 * Renders a dummy Income vs Expense Bar Chart using SVG.
 */
function CFYRenderIncomeExpenseChart() {
    const container = CFYIncomeExpenseChartContainer;
    container.innerHTML = ''; // Clear previous chart

    const width = container.clientWidth;
    const height = container.clientHeight;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    const data = [1200000, 800000];
    const labels = ['Income', 'Expenses'];
    const colors = ['#4BC0C0', '#FF6384']; // Greenish and Reddish

    const maxData = Math.max(...data);
    const barWidth = (width / 2) * 0.6;
    const spacing = (width / 2) * 0.2;
    const scaleY = (height - 40) / maxData; // Leave space for labels

    // Draw bars
    data.forEach((value, i) => {
        const barHeight = value * scaleY;
        const x = spacing + i * (barWidth + spacing);
        const y = height - barHeight - 20; // 20 for bottom padding

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', barWidth);
        rect.setAttribute('height', barHeight);
        rect.setAttribute('fill', colors[i]);
        rect.setAttribute('rx', '5'); // Rounded corners
        rect.setAttribute('ry', '5');
        svg.appendChild(rect);

        // Add label
        const textLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textLabel.setAttribute('x', x + barWidth / 2);
        textLabel.setAttribute('y', height - 5);
        textLabel.setAttribute('text-anchor', 'middle');
        textLabel.setAttribute('font-size', '12');
        textLabel.setAttribute('fill', 'currentColor'); // Use current text color
        textLabel.textContent = labels[i];
        svg.appendChild(textLabel);

        // Add value text
        const textValue = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textValue.setAttribute('x', x + barWidth / 2);
        textValue.setAttribute('y', y - 5);
        textValue.setAttribute('text-anchor', 'middle');
        textValue.setAttribute('font-size', '12');
        textValue.setAttribute('fill', 'currentColor'); // Use current text color
        textValue.textContent = `$${(value / 1000000).toFixed(1)}M`;
        svg.appendChild(textValue);
    });

    container.appendChild(svg);
}

/**
 * Renders a dummy Cash Flow Line Chart using SVG.
 */
function CFYRenderCashFlowChart() {
    const container = CFYCashFlowChartContainer;
    container.innerHTML = ''; // Clear previous chart

    const width = container.clientWidth;
    const height = container.clientHeight;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    const data = [100000, 120000, 90000, 150000, 110000, 130000];
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const lineColor = '#36A2EB'; // Blue

    const padding = 30;
    const innerWidth = width - 2 * padding;
    const innerHeight = height - 2 * padding;

    const maxData = Math.max(...data);
    const minData = Math.min(...data);
    const range = maxData - minData;
    const scaleX = innerWidth / (data.length - 1);
    const scaleY = innerHeight / range;

    let points = '';
    data.forEach((value, i) => {
        const x = padding + i * scaleX;
        const y = height - padding - (value - minData) * scaleY;
        points += `${x},${y} `;

        // Add circle markers
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', '3');
        circle.setAttribute('fill', lineColor);
        svg.appendChild(circle);

        // Add labels (only for every other for readability)
        if (i % 2 === 0) {
            const textLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            textLabel.setAttribute('x', x);
            textLabel.setAttribute('y', height - padding + 15);
            textLabel.setAttribute('text-anchor', 'middle');
            textLabel.setAttribute('font-size', '10');
            textLabel.setAttribute('fill', 'currentColor');
            textLabel.textContent = labels[i];
            svg.appendChild(textLabel);
        }
    });

    const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    polyline.setAttribute('points', points);
    polyline.setAttribute('fill', 'none');
    polyline.setAttribute('stroke', lineColor);
    polyline.setAttribute('stroke-width', '2');
    svg.appendChild(polyline);

    container.appendChild(svg);
}

/**
 * Renders a dummy Asset Distribution Pie Chart using SVG.
 */
function CFYRenderAssetDistributionChart() {
    const container = CFYAssetDistributionChartContainer;
    container.innerHTML = ''; // Clear previous chart

    const width = container.clientWidth;
    const height = container.clientHeight;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    const data = [40, 50, 10]; // Percentages
    const labels = ['Current Assets', 'Fixed Assets', 'Intangible Assets'];
    const colors = ['#FFCD56', '#4BC0C0', '#9966FF']; // Yellow, Green, Purple

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20; // Leave space for labels

    let total = data.reduce((sum, val) => sum + val, 0);
    let startAngle = 0;

    data.forEach((value, i) => {
        const sliceAngle = (value / total) * 2 * Math.PI;
        const endAngle = startAngle + sliceAngle;

        const x1 = centerX + radius * Math.cos(startAngle);
        const y1 = centerY + radius * Math.sin(startAngle);
        const x2 = centerX + radius * Math.cos(endAngle);
        const y2 = centerY + radius * Math.sin(endAngle);

        const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M${centerX},${centerY} L${x1},${y1} A${radius},${radius} 0 ${largeArcFlag},1 ${x2},${y2} Z`);
        path.setAttribute('fill', colors[i]);
        svg.appendChild(path);

        // Add labels
        const midAngle = startAngle + sliceAngle / 2;
        const textX = centerX + (radius / 1.5) * Math.cos(midAngle);
        const textY = centerY + (radius / 1.5) * Math.sin(midAngle);

        const textLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textLabel.setAttribute('x', textX);
        textLabel.setAttribute('y', textY);
        textLabel.setAttribute('text-anchor', 'middle');
        textLabel.setAttribute('font-size', '12');
        textLabel.setAttribute('fill', 'white'); // White text for readability on colors
        textLabel.textContent = `${labels[i]} (${value}%)`;
        svg.appendChild(textLabel);

        startAngle = endAngle;
    });

    container.appendChild(svg);
}


/**
 * Generates dummy financial year data for demonstration.
 */
function CFYGenerateDummyData() {
    const dummyData = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const statuses = ['Active', 'Inactive'];

    for (let i = 0; i < 25; i++) {
        const randomMonth = Math.floor(Math.random() * 12); // 0-11
        const randomDay = Math.floor(Math.random() * 28) + 1; // 1-28
        const randomYearOffset = Math.floor(Math.random() * 5) - 2; // -2, -1, 0, 1, 2 years from current

        const startYear = today.getFullYear() + randomYearOffset;
        const startDate = new Date(startYear, randomMonth, randomDay);
        
        const endDate = new Date(startDate);
        endDate.setFullYear(endDate.getFullYear() + 1);
        endDate.setDate(endDate.getDate() - 1);

        const fyStartYear = startDate.getFullYear();
        const fyEndYear = (startDate.getMonth() >= 3) ? (startDate.getFullYear() % 100) + 1 : (startDate.getFullYear() % 100);
        const financialYearName = `FY${fyStartYear}-${String(fyEndYear).padStart(2, '0')}`;

        let status = statuses[Math.floor(Math.random() * statuses.length)];
        
        // Logic to set status based on date (inactive for past/future, selectable for current)
        const currentYearStatus = (function() {
            const tempStartDate = new Date(startDate);
            tempStartDate.setHours(0,0,0,0);
            const tempEndDate = new Date(endDate);
            tempEndDate.setHours(0,0,0,0);
            if (today > tempEndDate) return 'Past';
            if (today < tempStartDate) return 'Future';
            return 'Current';
        })();

        if (currentYearStatus === 'Past' || currentYearStatus === 'Future') {
            status = 'Inactive'; // Automatically inactive for past/future
        } else {
            // For 'Current' years, status can be random (Active/Inactive)
            status = statuses[Math.floor(Math.random() * statuses.length)];
        }


        const randomEntity = CFYAvailableEntities[Math.floor(Math.random() * CFYAvailableEntities.length)];

        dummyData.push({
            name: financialYearName,
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            status: status,
            entity: randomEntity
        });
    }
    CFYFinancialYears = dummyData;
    CFYAddAuditEntry('Dummy data generated for financial years.');
}

// Configuration Tab Functions
function CFYPopulateConfigurationDropdowns() {
    // Populate Default Financial Year dropdown
    CFYDefaultFinancialYearSelect.innerHTML = '<option value="">-- Select Default --</option>';
    const uniqueYears = [...new Set(CFYFinancialYears.map(year => year.name))].sort();
    uniqueYears.forEach(yearName => {
        const option = document.createElement('option');
        option.value = yearName;
        option.textContent = yearName;
        CFYDefaultFinancialYearSelect.appendChild(option);
    });

    // Populate FY Status Year Select
    CFYFyStatusYearSelect.innerHTML = '<option value="">Select Year</option>';
    uniqueYears.forEach(yearName => {
        const option = document.createElement('option');
        option.value = yearName;
        option.textContent = yearName;
        CFYFyStatusYearSelect.appendChild(option);
    });

    // Populate Period Lock Year Select
    CFYPeriodLockYearSelect.innerHTML = '<option value="">Select Year</option>';
    uniqueYears.forEach(yearName => {
        const option = document.createElement('option');
        option.value = yearName;
        option.textContent = yearName;
        CFYPeriodLockYearSelect.appendChild(option);
    });

    // Populate Associate Entity Select
    CFYAssociateEntitySelect.innerHTML = '<option value="">-- Select Entity --</option>';
    CFYAvailableEntities.forEach(entity => {
        const option = document.createElement('option');
        option.value = entity;
        option.textContent = entity;
        CFYAssociateEntitySelect.appendChild(option);
    });

    // Populate Associate Financial Year Select
    CFYAssociateFinancialYearSelect.innerHTML = '<option value="">-- Select Financial Year --</option>';
    uniqueYears.forEach(yearName => {
        const option = document.createElement('option');
        option.value = yearName;
        option.textContent = yearName;
        CFYAssociateFinancialYearSelect.appendChild(option);
    });
}

// Event Listeners for Configuration Section
CFYSaveFyDefinitionBtn.addEventListener('click', function() {
    const startMonth = CFYConfigStartMonthSelect.value;
    const startDay = CFYConfigStartDayInput.value;
    const yearDesignation = CFYConfigYearDesignationSelect.value;
    CFYShowMessageBox('Financial Year Definition Saved!', 'success');
    CFYAddAuditEntry(`Financial Year Definition saved: Start ${startMonth}/${startDay}, Format ${yearDesignation}.`);
});

CFYApplyFyStatusBtn.addEventListener('click', function() {
    const year = CFYFyStatusYearSelect.value;
    const status = CFYFyStatusSelect.value;
    if (year && status) {
        CFYShowMessageBox(`Status for ${year} set to ${status}.`, 'success');
        CFYAddAuditEntry(`Financial Year "${year}" status set to "${status}".`);
    } else {
        CFYShowMessageBox('Please select a year and status.', 'error');
    }
});

CFYPeriodTypeSelect.addEventListener('change', function() {
    if (this.value === 'custom') {
        CFYCustomPeriodCountDiv.classList.remove('hidden');
    } else {
        CFYCustomPeriodCountDiv.classList.add('hidden');
    }
});

CFYSavePeriodDefinitionBtn.addEventListener('click', function() {
    const periodType = CFYPeriodTypeSelect.value;
    const customCount = periodType === 'custom' ? CFYCustomPeriodCountInput.value : 'N/A';
    const namingConvention = CFYPeriodNamingConventionInput.value;
    CFYShowMessageBox('Period Definition Saved!', 'success');
    CFYAddAuditEntry(`Period Definition saved: Type ${periodType}, Custom Count ${customCount}, Naming "${namingConvention}".`);
});

CFYApplyPeriodLockBtn.addEventListener('click', function() {
    const year = CFYPeriodLockYearSelect.value;
    const period = CFYPeriodLockPeriodSelect.value;
    const status = CFYPeriodLockStatusSelect.value;
    if (year && period && status) {
        CFYShowMessageBox(`Period ${period} of ${year} set to ${status}.`, 'success');
        CFYAddAuditEntry(`Period "${period}" of "${year}" status set to "${status}".`);
    } else {
        CFYShowMessageBox('Please select year, period, and status.', 'error');
    }
});

// Dummy Period Population (for Period Locking dropdown)
CFYFyStatusYearSelect.addEventListener('change', function() {
    CFYPeriodLockPeriodSelect.innerHTML = '<option value="">Select Period</option>';
    const selectedYear = this.value;
    if (selectedYear) {
        // Find the actual FY object to get its dates
        const fy = CFYFinancialYears.find(f => f.name === selectedYear);
        if (fy) {
            const startDate = new Date(fy.startDate);
            const endDate = new Date(fy.endDate);
            const diffMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
            
            // Assuming monthly periods for simplicity in dummy data
            for (let i = 1; i <= diffMonths + 1; i++) {
                const option = document.createElement('option');
                option.value = `P${i}`;
                option.textContent = `Period ${i}`;
                CFYPeriodLockPeriodSelect.appendChild(option);
            }
        }
    }
});


CFYSaveAssociationBtn.addEventListener('click', function() {
    const entity = CFYAssociateEntitySelect.value;
    const fy = CFYAssociateFinancialYearSelect.value;
    if (entity && fy) {
        CFYShowMessageBox(`Entity ${entity} associated with FY ${fy}.`, 'success');
        CFYAddAuditEntry(`Entity "${entity}" associated with Financial Year "${fy}".`);
    } else {
        CFYShowMessageBox('Please select an entity and a financial year.', 'error');
    }
});

// User Management Functions
function CFYPopulateUserManagement() {
    CFYSelectUserDropdown.innerHTML = '<option value="">-- Select User --</option>';
    // Populate with dummy users
    for (const username in CFYAppUsers) {
        const option = document.createElement('option');
        option.value = username;
        option.textContent = username;
        CFYSelectUserDropdown.appendChild(option);
    }
    CFYRenderCurrentUserRoles();
}

function CFYRenderCurrentUserRoles() {
    CFYCurrentUserRolesDiv.innerHTML = '';
    let hasRoles = false;
    for (const username in CFYAppUsers) {
        hasRoles = true;
        const p = document.createElement('p');
        p.textContent = `${username}: ${CFYAppUsers[username].role}`;
        CFYCurrentUserRolesDiv.appendChild(p);
    }
    if (!hasRoles) {
        CFYCurrentUserRolesDiv.innerHTML = '<p class="text-gray-500 dark:text-gray-400">No user roles defined yet.</p>';
    }
}

CFYSelectUserDropdown.addEventListener('change', function() {
    const selectedUser = this.value;
    if (selectedUser && CFYAppUsers[selectedUser]) {
        const role = CFYAppUsers[selectedUser].role;
        CFYAssignRoleRadios.forEach(radio => {
            if (radio.value === role) {
                radio.checked = true;
            }
        });
    } else {
        CFYAssignRoleRadios.forEach(radio => radio.checked = false);
    }
});

CFYSaveUserRoleBtn.addEventListener('click', function() {
    const selectedUser = CFYSelectUserDropdown.value;
    const selectedRole = document.querySelector('input[name="assignRole"]:checked');

    if (!selectedUser) {
        CFYShowMessageBox('Please select a user.', 'error');
        return;
    }
    if (!selectedRole) {
        CFYShowMessageBox('Please select a role to assign.', 'error');
        return;
    }

    CFYAppUsers[selectedUser].role = selectedRole.value;
    CFYRenderCurrentUserRoles();
    CFYShowMessageBox(`Role for ${selectedUser} updated to ${selectedRole.value}.`, 'success');
    CFYAddAuditEntry(`User "${selectedUser}" role updated to "${selectedRole.value}".`);
});


// Initial setup when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Explicitly set initial display states using style.display
    CFYLoginSection.style.display = 'flex'; // Ensure login section is visible
    CFYMainAppSection.style.display = 'none'; // Ensure main app section is hidden

    // Check for dark mode preference in localStorage
    const savedDarkMode = localStorage.getItem('CFYDarkMode');
    if (savedDarkMode === 'true') {
        CFYApplyDarkMode(true);
    } else {
        CFYApplyDarkMode(false);
    }

    // Check for saved sidebar state
    const savedSidebarState = localStorage.getItem('CFYSidebarCollapsed');
    if (savedSidebarState === 'true') {
        document.body.classList.add('sidebar-collapsed');
    }

    // Retrieve logged-in user role from session storage
    CFYLoggedInUserRole = sessionStorage.getItem('CFYLoggedInUserRole');
    const storedUsername = sessionStorage.getItem('CFYLoggedInUsername');

    // Control visibility of User Management sidebar item
    const userManagementSidebarItem = document.getElementById('userManagementSidebarItem'); 

    if (CFYLoggedInUserRole === 'admin') {
        userManagementSidebarItem.classList.remove('hidden'); // Show for admin
    } else {
        userManagementSidebarItem.classList.add('hidden'); // Hide for non-admin
    }


    if (CFYLoggedInUserRole && storedUsername) {
        CFYLoginSection.style.display = 'none'; // Hide login section
        CFYMainAppSection.style.display = 'flex'; // Show main app section
        CFYLoggedInUsernameSpan.textContent = storedUsername;
        CFYShowSection('dashboardSection'); // Show dashboard on direct load if already logged in
    } 
    
    CFYGenerateDummyData(); // Generate dummy data on load
    CFYRenderTable(); // Initial render of the financial years table (for Data Entry section)
    CFYRenderAuditLog(); // Initial render of audit log
});
