document.addEventListener('DOMContentLoaded', function() {
    // Initialize Role Distribution Chart
    initRoleDistributionChart();

    // Initialize User Activity Chart
    initUserActivityChart(30); // Default to 30 days

    // Setup time range dropdown
    setupTimeRangeDropdown();

    // Setup tab switching for permissions page
    setupPermissionTabs();

    // Make stat cards clickable
    setupClickableStatCards();

    // Setup user profile dropdown
    setupUserProfileDropdown();

    // Setup drag and drop for role selection
    setupRoleDragAndDrop();

    // Setup drag and drop for permission selection
    setupPermissionDragAndDrop();

    // Setup remove icons for permission tags
    setupPermissionRemoveIcons();

    // Setup settings page functionality
    setupSettingsPage();

    // Setup user management CRUD operations
    setupUserManagement();

    // Setup role management CRUD operations
    setupRoleManagement();

    // Setup access control models
    setupAccessControlModels();

    // Setup access requests search and filter
    setupAccessRequestsFilters();

    // Modal functionality
    const modals = document.querySelectorAll('.modal');
    const modalTriggers = {
        'createRoleBtn': 'roleModal',
        'createPermissionBtn': 'permissionModal',
        'createUserBtn': 'userModal'
    };

    // Open modals
    for (const [triggerId, modalId] of Object.entries(modalTriggers)) {
        const trigger = document.getElementById(triggerId);
        const modal = document.getElementById(modalId);

        if (trigger && modal) {
            trigger.addEventListener('click', function() {
                modal.style.display = 'block';
            });
        }
    }

    // Close modals
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.close-btn');
        const cancelBtns = modal.querySelectorAll('[id$="CancelBtn"]');

        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                modal.style.display = 'none';
            });
        }

        cancelBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                modal.style.display = 'none';
            });
        });

        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Tab functionality
    const tabBtns = document.querySelectorAll('.tab-btn');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');

            // Remove active class from all tabs and panes
            document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));

            // Add active class to current tab and pane
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Settings menu functionality
    const settingsMenuItems = document.querySelectorAll('.settings-menu li');

    settingsMenuItems.forEach(item => {
        item.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');

            // Remove active class from all menu items and tabs
            document.querySelectorAll('.settings-menu li').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.settings-tab').forEach(el => el.classList.remove('active'));

            // Add active class to current menu item and tab
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Select all checkbox functionality
    const selectAllCheckbox = document.getElementById('selectAll');

    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('input[name="selectedUser"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }

    // Log details modal
    const viewDetailsButtons = document.querySelectorAll('.view-details');
    const logDetailsModal = document.getElementById('logDetailsModal');

    if (viewDetailsButtons.length > 0 && logDetailsModal) {
        viewDetailsButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                logDetailsModal.style.display = 'block';
            });
        });

        const closeLogDetailsBtn = document.getElementById('closeLogDetailsBtn');
        if (closeLogDetailsBtn) {
            closeLogDetailsBtn.addEventListener('click', function() {
                logDetailsModal.style.display = 'none';
            });
        }
    }

    // Access Request details modal
    const viewRequestButtons = document.querySelectorAll('.btn-icon.view');
    const requestDetailsModal = document.getElementById('requestDetailsModal');

    if (viewRequestButtons.length > 0 && requestDetailsModal) {
        viewRequestButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Get the row data
                const row = this.closest('tr');

                // Get the request ID
                const requestId = row.querySelector('td:first-child').textContent.trim();

                // Get the requester name
                const requesterCell = row.querySelector('td:nth-child(2)');
                const requesterName = requesterCell.querySelector('.user-name') ?
                    requesterCell.querySelector('.user-name').textContent.trim() :
                    requesterCell.textContent.trim();

                // Get the requester ID
                const requesterId = requesterCell.querySelector('.user-id') ?
                    requesterCell.querySelector('.user-id').textContent.trim() :
                    '1000';

                // Get the request type
                const requestType = row.querySelector('td:nth-child(3)').textContent.trim();

                // Get the request details
                const requestDetails = row.querySelector('td:nth-child(4)').textContent.trim();

                // Get the submission date
                const submissionDate = row.querySelector('td:nth-child(5)').textContent.trim();

                // Get the approval count
                const approvalCountCell = row.querySelector('td:nth-child(6)');
                const approvalCount = approvalCountCell.querySelector('.approval-count').textContent.trim();

                // Get the status
                const statusCell = row.querySelector('td:nth-child(7)');
                const statusText = statusCell.textContent.trim();
                const statusClass = statusCell.querySelector('.badge').className.split(' ')[1];

                // Update the modal content
                // Use the h2 in the modal-header instead of looking for modal-title class
                document.querySelector('#requestDetailsModal .modal-header h2').textContent = 'Access Request Details';

                // Get all detail-value elements in the modal
                const detailValues = document.querySelectorAll('#requestDetailsModal .detail-value');

                // Update the values using the array of elements
                if (detailValues.length >= 5) {
                    detailValues[0].textContent = requestId;
                    detailValues[1].textContent = `${requesterName} (ID: ${requesterId})`;
                    detailValues[2].textContent = 'Customer'; // Default role
                    detailValues[3].textContent = requestType;

                    // Set requested role/permission based on request type
                    if (requestType.includes('Role')) {
                        // Get the 5th detail-label and detail-value
                        const detailLabels = document.querySelectorAll('#requestDetailsModal .detail-label');
                        if (detailLabels.length >= 5) {
                            detailLabels[4].textContent = 'Requested Role:';
                            detailValues[4].textContent = requestDetails.replace('Request for ', '').replace(' role', '');
                        }
                    } else if (requestType.includes('Permission')) {
                        const detailLabels = document.querySelectorAll('#requestDetailsModal .detail-label');
                        if (detailLabels.length >= 5) {
                            detailLabels[4].textContent = 'Requested Permission:';
                            detailValues[4].textContent = requestDetails.replace('Request for ', '').replace(' permission', '');
                        }
                    } else {
                        const detailLabels = document.querySelectorAll('#requestDetailsModal .detail-label');
                        if (detailLabels.length >= 5) {
                            detailLabels[4].textContent = 'Requested Access:';
                            detailValues[4].textContent = requestDetails.replace('Request access to ', '');
                        }
                    }

                    // Update submission date
                    if (detailValues.length >= 6) {
                        detailValues[5].textContent = submissionDate;
                    }

                    // Update status badge
                    const statusBadge = document.querySelector('#requestDetailsModal .badge');
                    if (statusBadge) {
                        statusBadge.className = `badge ${statusClass}`;
                        statusBadge.textContent = statusText;
                    }

                    // Update approval count and progress bar
                    const modalApprovalCount = document.querySelector('#requestDetailsModal .approval-count');
                    const progressBar = document.querySelector('#requestDetailsModal .progress');

                    if (modalApprovalCount && progressBar) {
                        modalApprovalCount.textContent = approvalCount;

                        // Calculate progress percentage
                        const countParts = approvalCount.split('/');
                        const currentApprovals = parseInt(countParts[0]);
                        const requiredApprovals = parseInt(countParts[1]);
                        const progressPercentage = (currentApprovals / requiredApprovals) * 100;

                        // Update progress bar
                        progressBar.style.width = `${progressPercentage}%`;

                        // Show/hide approve/reject buttons based on status
                        const approveBtn = document.getElementById('approveRequestBtn');
                        const rejectBtn = document.getElementById('rejectRequestBtn');

                        if (statusText === 'Pending') {
                            if (approveBtn) approveBtn.style.display = 'inline-block';
                            if (rejectBtn) rejectBtn.style.display = 'inline-block';
                        } else {
                            if (approveBtn) approveBtn.style.display = 'none';
                            if (rejectBtn) rejectBtn.style.display = 'none';
                        }
                    }

                    // Add justification text
                    const justificationText = "I need to be able to create and edit content for the marketing department. My current role as Customer does not allow me to perform these tasks. I have been assigned to the content creation team and need the appropriate access to fulfill my responsibilities.";
                    if (detailValues.length >= 9) {
                        detailValues[8].querySelector('p').textContent = justificationText;
                    }

                    // Add manager approval text
                    const managerApprovalText = "Jane Smith (Manager) has approved this request on 2023-06-15.";
                    if (detailValues.length >= 10) {
                        detailValues[9].querySelector('p').textContent = managerApprovalText;
                    }
                }

                // Show the modal
                requestDetailsModal.style.display = 'block';
            });
        });

        // Add event listener for the close button in the modal header
        const closeBtn = document.querySelector('#requestDetailsModal .close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                requestDetailsModal.style.display = 'none';
            });
        }

        // Add event listener for the close button in the modal footer
        const closeRequestBtn = document.getElementById('closeRequestBtn');
        if (closeRequestBtn) {
            closeRequestBtn.addEventListener('click', function() {
                requestDetailsModal.style.display = 'none';
            });
        }

        const approveRequestBtn = document.getElementById('approveRequestBtn');
        if (approveRequestBtn) {
            approveRequestBtn.addEventListener('click', function() {
                // Get the current request ID from the modal
                const detailValues = document.querySelectorAll('#requestDetailsModal .detail-value');
                const requestId = detailValues.length > 0 ? detailValues[0].textContent.trim() : '';

                // Find the corresponding row in the table
                const rows = document.querySelectorAll('table tbody tr');
                let targetRow = null;

                rows.forEach(row => {
                    const rowId = row.querySelector('td:first-child').textContent.trim();
                    if (rowId === requestId) {
                        targetRow = row;
                    }
                });

                if (!targetRow) {
                    alert('Request approved successfully!');
                    requestDetailsModal.style.display = 'none';
                    return;
                }

                // Update the approval progress in the modal
                const approvalCountElement = document.querySelector('.modal .approval-count');
                const progressBar = document.querySelector('.modal .progress');

                if (approvalCountElement && progressBar) {
                    // Parse the current approval count
                    const countParts = approvalCountElement.textContent.split('/');
                    let currentApprovals = parseInt(countParts[0]);
                    const requiredApprovals = parseInt(countParts[1]);

                    // Increment the approval count
                    currentApprovals++;
                    approvalCountElement.textContent = `${currentApprovals}/${requiredApprovals}`;

                    // Update progress bar
                    const progressPercentage = (currentApprovals / requiredApprovals) * 100;
                    progressBar.style.width = `${progressPercentage}%`;

                    // Update the row in the table
                    const rowApprovalCountElement = targetRow.querySelector('.approval-count');
                    if (rowApprovalCountElement) {
                        rowApprovalCountElement.textContent = `${currentApprovals}/${requiredApprovals}`;
                    }

                    // If all approvals are received, update the status
                    if (currentApprovals >= requiredApprovals) {
                        const statusElement = document.querySelector('.modal .badge');
                        if (statusElement) {
                            statusElement.className = 'badge status-approved';
                            statusElement.textContent = 'Approved';
                        }

                        // Update the status in the table
                        const statusCell = targetRow.querySelector('td:nth-child(7)');
                        if (statusCell) {
                            statusCell.innerHTML = '<span class="badge status-approved">Approved</span>';
                        }

                        // Hide approve/reject buttons
                        this.style.display = 'none';
                        if (rejectRequestBtn) {
                            rejectRequestBtn.style.display = 'none';
                        }

                        // Hide approve/reject buttons in the table
                        const approveBtn = targetRow.querySelector('.btn-icon.approve');
                        const rejectBtn = targetRow.querySelector('.btn-icon.reject');

                        if (approveBtn) approveBtn.style.display = 'none';
                        if (rejectBtn) rejectBtn.style.display = 'none';
                    }
                }

                alert('Request approved successfully!');
                requestDetailsModal.style.display = 'none';
            });
        }

        const rejectRequestBtn = document.getElementById('rejectRequestBtn');
        if (rejectRequestBtn) {
            rejectRequestBtn.addEventListener('click', function() {
                // Get the current request ID from the modal
                const detailValues = document.querySelectorAll('#requestDetailsModal .detail-value');
                const requestId = detailValues.length > 0 ? detailValues[0].textContent.trim() : '';

                // Find the corresponding row in the table
                const rows = document.querySelectorAll('table tbody tr');
                let targetRow = null;

                rows.forEach(row => {
                    const rowId = row.querySelector('td:first-child').textContent.trim();
                    if (rowId === requestId) {
                        targetRow = row;
                    }
                });

                if (!targetRow) {
                    alert('Request rejected!');
                    requestDetailsModal.style.display = 'none';
                    return;
                }

                // Update the status in the modal
                const statusElement = document.querySelector('.modal .badge');
                if (statusElement) {
                    statusElement.className = 'badge status-rejected';
                    statusElement.textContent = 'Rejected';
                }

                // Update approval count to 0
                const approvalCountElement = document.querySelector('.modal .approval-count');
                const progressBar = document.querySelector('.modal .progress');

                if (approvalCountElement && progressBar) {
                    const countParts = approvalCountElement.textContent.split('/');
                    const requiredApprovals = parseInt(countParts[1]);
                    approvalCountElement.textContent = `0/${requiredApprovals}`;

                    // Update progress bar
                    progressBar.style.width = '0%';

                    // Update the row in the table
                    const rowApprovalCountElement = targetRow.querySelector('.approval-count');
                    if (rowApprovalCountElement) {
                        rowApprovalCountElement.textContent = `0/${requiredApprovals}`;
                    }

                    // Update the status in the table
                    const statusCell = targetRow.querySelector('td:nth-child(7)');
                    if (statusCell) {
                        statusCell.innerHTML = '<span class="badge status-rejected">Rejected</span>';
                    }

                    // Hide approve/reject buttons in the table
                    const approveBtn = targetRow.querySelector('.btn-icon.approve');
                    const rejectBtn = targetRow.querySelector('.btn-icon.reject');

                    if (approveBtn) approveBtn.style.display = 'none';
                    if (rejectBtn) rejectBtn.style.display = 'none';
                }

                // Hide approve/reject buttons in the modal
                this.style.display = 'none';
                if (approveRequestBtn) {
                    approveRequestBtn.style.display = 'none';
                }

                alert('Request rejected!');
                requestDetailsModal.style.display = 'none';
            });
        }
    }

    // Quick approve/reject buttons
    const approveButtons = document.querySelectorAll('.btn-icon.approve');
    const rejectButtons = document.querySelectorAll('.btn-icon.reject');

    approveButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('Are you sure you want to approve this request?')) {
                // Get the row and approval count element
                const row = this.closest('tr');
                const approvalCountElement = row.querySelector('.approval-count');

                if (approvalCountElement) {
                    // Parse the current approval count (format: "X/Y")
                    const countParts = approvalCountElement.textContent.split('/');
                    let currentApprovals = parseInt(countParts[0]);
                    const requiredApprovals = parseInt(countParts[1]);

                    // Increment the approval count
                    currentApprovals++;
                    approvalCountElement.textContent = `${currentApprovals}/${requiredApprovals}`;

                    // If all approvals are received, update the status
                    if (currentApprovals >= requiredApprovals) {
                        const statusCell = row.querySelector('td:nth-child(7)');
                        if (statusCell) {
                            statusCell.innerHTML = '<span class="badge status-approved">Approved</span>';
                        }

                        // Hide approve/reject buttons
                        this.style.display = 'none';
                        const rejectBtn = row.querySelector('.btn-icon.reject');
                        if (rejectBtn) {
                            rejectBtn.style.display = 'none';
                        }
                    }
                }

                alert('Request approved successfully!');
            }
        });
    });

    rejectButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('Are you sure you want to reject this request?')) {
                // Get the row and update the status
                const row = this.closest('tr');
                const statusCell = row.querySelector('td:nth-child(7)');
                if (statusCell) {
                    statusCell.innerHTML = '<span class="badge status-rejected">Rejected</span>';
                }

                // Update approval count to 0
                const approvalCountElement = row.querySelector('.approval-count');
                if (approvalCountElement) {
                    const countParts = approvalCountElement.textContent.split('/');
                    const requiredApprovals = parseInt(countParts[1]);
                    approvalCountElement.textContent = `0/${requiredApprovals}`;
                }

                // Hide approve/reject buttons
                this.style.display = 'none';
                const approveBtn = row.querySelector('.btn-icon.approve');
                if (approveBtn) {
                    approveBtn.style.display = 'none';
                }

                alert('Request rejected!');
            }
        });
    });

    // Form validation examples for other forms (not user form, which is handled by setupUserManagement)

    // Role form validation
    const roleForm = document.getElementById('roleForm');
    const saveRoleBtn = document.getElementById('saveRoleBtn');

    if (roleForm && saveRoleBtn) {
        saveRoleBtn.addEventListener('click', function(e) {
            e.preventDefault();

            const roleName = document.getElementById('roleName').value;

            if (!roleName) {
                alert('Please enter a role name.');
                return;
            }

            // If validation passes
            alert('Role saved successfully!');
            document.getElementById('roleModal').style.display = 'none';
        });
    }

    // Permission form validation
    const permissionForm = document.getElementById('permissionForm');
    const savePermissionBtn = document.getElementById('savePermissionBtn');

    if (permissionForm && savePermissionBtn) {
        savePermissionBtn.addEventListener('click', function(e) {
            e.preventDefault();

            const permissionName = document.getElementById('permissionName').value;
            const permissionCategory = document.getElementById('permissionCategory').value;

            if (!permissionName || !permissionCategory) {
                alert('Please fill in all required fields.');
                return;
            }

            // Validate permission name format (lowercase with underscores)
            const nameRegex = /^[a-z0-9_]+$/;
            if (!nameRegex.test(permissionName)) {
                alert('Permission name should be lowercase with underscores only.');
                return;
            }

            // If validation passes
            alert('Permission saved successfully!');
            document.getElementById('permissionModal').style.display = 'none';
        });
    }

    // Settings form validation
    const saveSettingsBtn = document.querySelector('.settings-tab .btn-primary');

    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', function() {
            alert('Settings saved successfully!');
        });
    }
});

// Function to initialize the role distribution pie chart
function initRoleDistributionChart() {
    const chartCanvas = document.getElementById('roleDistributionChart');
    if (!chartCanvas) return;

    // Role distribution data
    const roleData = {
        labels: ['Administrators', 'Managers', 'Editors', 'Viewers', 'Customers'],
        datasets: [{
            data: [8, 15, 22, 40, 15], // Percentages
            backgroundColor: [
                '#4a6cf7', // Admin - Primary color
                '#28a745', // Manager - Success color
                '#ffc107', // Editor - Warning color
                '#17a2b8', // Viewer - Info color
                '#6c757d'  // Customer - Secondary color
            ],
            borderWidth: 0
        }]
    };

    // Chart configuration
    const config = {
        type: 'pie',
        data: roleData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false // Hide default legend, we'll create our own
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            }
        }
    };

    // Create the chart
    const roleChart = new Chart(chartCanvas, config);

    // Generate custom legend
    const legendContainer = document.getElementById('roleChartLegend');
    if (legendContainer) {
        legendContainer.innerHTML = roleData.labels.map((label, index) => {
            const color = roleData.datasets[0].backgroundColor[index];
            const percentage = roleData.datasets[0].data[index];
            return `
                <div class="legend-item">
                    <span class="color-box" style="background-color: ${color}"></span>
                    <span>${label} (${percentage}%)</span>
                </div>
            `;
        }).join('');
    }
}

// Function to set up the time range dropdown
function setupTimeRangeDropdown() {
    const dropdownBtn = document.getElementById('timeRangeBtn');
    const dropdown = dropdownBtn ? dropdownBtn.parentElement : null;
    const dropdownContent = document.getElementById('timeRangeDropdown');
    const dropdownLinks = dropdownContent ? dropdownContent.querySelectorAll('a') : [];

    if (!dropdownBtn || !dropdown || !dropdownContent) return;

    // Toggle dropdown when button is clicked
    dropdownBtn.addEventListener('click', function(e) {
        e.preventDefault();
        dropdown.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });

    // Handle dropdown item selection
    dropdownLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const days = parseInt(this.getAttribute('data-value'));
            const text = this.textContent;

            // Update button text
            dropdownBtn.innerHTML = text + ' <i class="fas fa-chevron-down"></i>';

            // Close dropdown
            dropdown.classList.remove('active');

            // Update chart
            initUserActivityChart(days);
        });
    });
}

// Function to initialize the user activity metrics chart
function initUserActivityChart(days = 30) {
    const chartCanvas = document.getElementById('userActivityChart');
    if (!chartCanvas) return;

    // Clear existing chart if it exists
    if (window.activityChart) {
        window.activityChart.destroy();
    }

    // Generate dates based on the selected time range
    const dates = [];
    const today = new Date();

    // Calculate step size based on days
    let step = 1;
    if (days > 60) step = 15;
    else if (days > 30) step = 10;
    else if (days > 14) step = 5;
    else if (days > 7) step = 2;

    for (let i = days; i >= 0; i -= step) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const month = date.toLocaleString('default', { month: 'short' });
        dates.push(`${month} ${date.getDate()}`);
    }

    // Generate sample data based on days
    const loginData = [];
    const roleChangeData = [];
    const permissionUpdateData = [];
    const accessRequestData = [];

    for (let i = 0; i < dates.length; i++) {
        // Generate realistic-looking data with some variation
        loginData.push(Math.floor(Math.random() * 10) + 90); // 90-100 range
        roleChangeData.push(Math.floor(Math.random() * 6) + 5); // 5-10 range
        permissionUpdateData.push(Math.floor(Math.random() * 8) + 10); // 10-18 range
        accessRequestData.push(Math.floor(Math.random() * 7) + 8); // 8-15 range
    }

    // User activity data
    const activityData = {
        labels: dates,
        datasets: [
            {
                label: 'Logins',
                data: loginData,
                borderColor: '#4a6cf7',
                backgroundColor: 'transparent',
                borderWidth: 2,
                tension: 0.3,
                pointBackgroundColor: '#4a6cf7'
            },
            {
                label: 'Role Changes',
                data: roleChangeData,
                borderColor: '#28a745',
                backgroundColor: 'transparent',
                borderWidth: 2,
                tension: 0.3,
                pointBackgroundColor: '#28a745'
            },
            {
                label: 'Permission Updates',
                data: permissionUpdateData,
                borderColor: '#ffc107',
                backgroundColor: 'transparent',
                borderWidth: 2,
                tension: 0.3,
                pointBackgroundColor: '#ffc107'
            },
            {
                label: 'Access Requests',
                data: accessRequestData,
                borderColor: '#dc3545',
                backgroundColor: 'transparent',
                borderWidth: 2,
                tension: 0.3,
                pointBackgroundColor: '#dc3545'
            }
        ]
    };

    // Chart configuration
    const config = {
        type: 'line',
        data: activityData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        boxWidth: 12,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                }
            }
        }
    };

    // Create the chart and store it in a global variable
    window.activityChart = new Chart(chartCanvas, config);
}

// Function to setup tab switching for permissions page
function setupPermissionTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    if (!tabButtons.length || !tabPanes.length) return;

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Show corresponding tab pane
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Function to setup access control models
function setupAccessControlModels() {
    // Get model toggle elements
    const rbacToggle = document.getElementById('rbacToggle');
    const abacToggle = document.getElementById('abacToggle');
    const aclToggle = document.getElementById('aclToggle');

    // Get model config sections
    const rbacConfig = document.getElementById('rbacConfig');
    const abacConfig = document.getElementById('abacConfig');
    const aclConfig = document.getElementById('aclConfig');

    // Initialize access control system
    let accessControlSystem;

    // Check if access-control.js is loaded
    if (window.AccessControl) {
        accessControlSystem = new window.AccessControl.System();
        console.log('Access Control System initialized');

        // Setup demo data
        setupDemoAccessControlData(accessControlSystem);
    } else {
        console.warn('Access Control System not available. Make sure access-control.js is loaded.');
    }

    // Toggle RBAC
    if (rbacToggle && rbacConfig) {
        rbacToggle.addEventListener('change', function() {
            rbacConfig.style.display = this.checked ? 'block' : 'none';

            // Update system state
            if (accessControlSystem) {
                // Enable/disable RBAC in the system
                console.log(`RBAC ${this.checked ? 'enabled' : 'disabled'}`);
            }
        });
    }

    // Toggle ABAC
    if (abacToggle && abacConfig) {
        abacToggle.addEventListener('change', function() {
            abacConfig.style.display = this.checked ? 'block' : 'none';

            // Update system state
            if (accessControlSystem) {
                // Enable/disable ABAC in the system
                console.log(`ABAC ${this.checked ? 'enabled' : 'disabled'}`);
            }
        });
    }

    // Toggle ACL
    if (aclToggle && aclConfig) {
        aclToggle.addEventListener('change', function() {
            aclConfig.style.display = this.checked ? 'block' : 'none';

            // Update system state
            if (accessControlSystem) {
                // Enable/disable ACL in the system
                console.log(`ACL ${this.checked ? 'enabled' : 'disabled'}`);
            }
        });
    }

    // RBAC Settings
    const rbacInheritance = document.getElementById('rbacInheritance');
    const rbacMultipleRoles = document.getElementById('rbacMultipleRoles');
    const rbacDefaultDeny = document.getElementById('rbacDefaultDeny');
    const rbacRoleSelect = document.getElementById('rbacRoleSelect');
    const editRolePermissionsBtn = document.getElementById('editRolePermissionsBtn');

    if (rbacInheritance) {
        rbacInheritance.addEventListener('change', function() {
            console.log(`Role inheritance ${this.checked ? 'enabled' : 'disabled'}`);
        });
    }

    if (rbacMultipleRoles) {
        rbacMultipleRoles.addEventListener('change', function() {
            console.log(`Multiple roles per user ${this.checked ? 'enabled' : 'disabled'}`);
        });
    }

    if (rbacDefaultDeny) {
        rbacDefaultDeny.addEventListener('change', function() {
            console.log(`Default deny policy ${this.checked ? 'enabled' : 'disabled'}`);
        });
    }

    if (editRolePermissionsBtn && rbacRoleSelect) {
        editRolePermissionsBtn.addEventListener('click', function() {
            const selectedRole = rbacRoleSelect.value;
            alert(`Edit permissions for role: ${selectedRole}`);
            // This would open a modal to edit permissions for the selected role
        });
    }

    // ABAC Settings
    const abacCombineWithRbac = document.getElementById('abacCombineWithRbac');
    const abacDynamicAttributes = document.getElementById('abacDynamicAttributes');
    const abacConflictResolution = document.getElementById('abacConflictResolution');
    const addAttributeBtns = document.querySelectorAll('.add-attribute-btn');
    const attributeModal = document.getElementById('attributeModal');
    const attributeForm = document.getElementById('attributeForm');
    const attributeModalTitle = document.getElementById('attributeModalTitle');
    const attributeName = document.getElementById('attributeName');
    const attributeType = document.getElementById('attributeType');
    const attributeDescription = document.getElementById('attributeDescription');
    const attributeValues = document.getElementById('attributeValues');
    const attributeCategory = document.getElementById('attributeCategory');
    const attributeIndex = document.getElementById('attributeIndex');
    const saveAttributeBtn = document.getElementById('saveAttributeBtn');
    const cancelAttributeBtn = document.getElementById('cancelAttributeBtn');
    const closeAttributeBtn = attributeModal ? attributeModal.querySelector('.close-btn') : null;

    // Store attribute data for each category
    const attributeData = {
        user: [],
        resource: [],
        environment: []
    };

    // Initialize attribute data from the DOM
    function initializeAttributeData() {
        // User attributes
        const userAttributeList = document.getElementById('userAttributeList');
        if (userAttributeList) {
            userAttributeList.querySelectorAll('li').forEach(li => {
                const name = li.querySelector('.attribute-name').textContent;
                const type = li.querySelector('.attribute-type').textContent;
                const description = li.querySelector('.attribute-description').textContent;
                attributeData.user.push({ name, type, description, values: '' });
            });
        }

        // Resource attributes
        const resourceAttributeList = document.getElementById('resourceAttributeList');
        if (resourceAttributeList) {
            resourceAttributeList.querySelectorAll('li').forEach(li => {
                const name = li.querySelector('.attribute-name').textContent;
                const type = li.querySelector('.attribute-type').textContent;
                const description = li.querySelector('.attribute-description').textContent;
                attributeData.resource.push({ name, type, description, values: '' });
            });
        }

        // Environment attributes
        const environmentAttributeList = document.getElementById('environmentAttributeList');
        if (environmentAttributeList) {
            environmentAttributeList.querySelectorAll('li').forEach(li => {
                const name = li.querySelector('.attribute-name').textContent;
                const type = li.querySelector('.attribute-type').textContent;
                const description = li.querySelector('.attribute-description').textContent;
                attributeData.environment.push({ name, type, description, values: '' });
            });
        }
    }

    // Call initialization function
    initializeAttributeData();

    if (abacCombineWithRbac) {
        abacCombineWithRbac.addEventListener('change', function() {
            console.log(`Combine ABAC with RBAC ${this.checked ? 'enabled' : 'disabled'}`);
        });
    }

    if (abacDynamicAttributes) {
        abacDynamicAttributes.addEventListener('change', function() {
            console.log(`Dynamic attributes ${this.checked ? 'enabled' : 'disabled'}`);
        });
    }

    if (abacConflictResolution) {
        abacConflictResolution.addEventListener('change', function() {
            console.log(`ABAC conflict resolution set to: ${this.value}`);
        });
    }

    // Function to open attribute modal for adding a new attribute
    function openAddAttributeModal(category) {
        if (!attributeModal) return;

        attributeModalTitle.textContent = `Add New ${category.charAt(0).toUpperCase() + category.slice(1)} Attribute`;
        attributeForm.reset();
        attributeCategory.value = category;
        attributeIndex.value = '-1'; // -1 indicates a new attribute

        attributeModal.style.display = 'block';
    }

    // Function to open attribute modal for editing an existing attribute
    function openEditAttributeModal(category, index) {
        if (!attributeModal || !attributeData[category] || !attributeData[category][index]) return;

        const attribute = attributeData[category][index];

        attributeModalTitle.textContent = `Edit ${category.charAt(0).toUpperCase() + category.slice(1)} Attribute`;
        attributeName.value = attribute.name;
        attributeType.value = attribute.type.split(' ')[0]; // Extract the base type (e.g., "Integer" from "Integer (1-5)")
        attributeDescription.value = attribute.description;
        attributeValues.value = attribute.values;
        attributeCategory.value = category;
        attributeIndex.value = index;

        attributeModal.style.display = 'block';
    }

    // Function to save attribute
    function saveAttribute() {
        const category = attributeCategory.value;
        const index = parseInt(attributeIndex.value);

        const attribute = {
            name: attributeName.value,
            type: attributeType.value,
            description: attributeDescription.value,
            values: attributeValues.value
        };

        // Add type range if values are provided
        if (attribute.values && (attribute.type === 'Integer' || attribute.type === 'String')) {
            const values = attribute.values.split(',').map(v => v.trim());
            if (attribute.type === 'Integer' && values.length === 2 && !isNaN(values[0]) && !isNaN(values[1])) {
                attribute.type = `${attribute.type} (${values[0]}-${values[1]})`;
            }
        }

        if (index === -1) {
            // Add new attribute
            attributeData[category].push(attribute);
            updateAttributeList(category);
        } else {
            // Update existing attribute
            attributeData[category][index] = attribute;
            updateAttributeList(category);
        }

        attributeModal.style.display = 'none';
    }

    // Function to delete attribute
    function deleteAttribute(category, index) {
        if (confirm('Are you sure you want to delete this attribute?')) {
            attributeData[category].splice(index, 1);
            updateAttributeList(category);
        }
    }

    // Function to update attribute list in the DOM
    function updateAttributeList(category) {
        const listId = `${category}AttributeList`;
        const list = document.getElementById(listId);

        if (!list) return;

        // Clear the list
        list.innerHTML = '';

        // Add attributes to the list
        attributeData[category].forEach((attribute, index) => {
            const li = document.createElement('li');
            li.setAttribute('data-attribute-index', index);

            li.innerHTML = `
                <div class="attribute-info">
                    <span class="attribute-name">${attribute.name}</span>
                    <span class="attribute-type">${attribute.type}</span>
                    <span class="attribute-description">${attribute.description}</span>
                </div>
                <div class="attribute-actions">
                    <button class="btn-icon edit-attribute" title="Edit Attribute"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon delete-attribute" title="Delete Attribute"><i class="fas fa-trash"></i></button>
                </div>
            `;

            list.appendChild(li);

            // Add event listeners to the new buttons
            const editBtn = li.querySelector('.edit-attribute');
            const deleteBtn = li.querySelector('.delete-attribute');

            editBtn.addEventListener('click', function() {
                openEditAttributeModal(category, index);
            });

            deleteBtn.addEventListener('click', function() {
                deleteAttribute(category, index);
            });
        });
    }

    // Add event listeners to add attribute buttons
    addAttributeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            openAddAttributeModal(category);
        });
    });

    // Add event listeners to edit attribute buttons
    document.querySelectorAll('.edit-attribute').forEach(btn => {
        btn.addEventListener('click', function() {
            const li = this.closest('li');
            const category = this.closest('.attribute-list').id.replace('AttributeList', '');
            const index = parseInt(li.getAttribute('data-attribute-index'));
            openEditAttributeModal(category, index);
        });
    });

    // Add event listeners to delete attribute buttons
    document.querySelectorAll('.delete-attribute').forEach(btn => {
        btn.addEventListener('click', function() {
            const li = this.closest('li');
            const category = this.closest('.attribute-list').id.replace('AttributeList', '');
            const index = parseInt(li.getAttribute('data-attribute-index'));
            deleteAttribute(category, index);
        });
    });

    // Add event listeners to modal buttons
    if (saveAttributeBtn) {
        saveAttributeBtn.addEventListener('click', saveAttribute);
    }

    if (cancelAttributeBtn) {
        cancelAttributeBtn.addEventListener('click', function() {
            attributeModal.style.display = 'none';
        });
    }

    if (closeAttributeBtn) {
        closeAttributeBtn.addEventListener('click', function() {
            attributeModal.style.display = 'none';
        });
    }

    // ACL Settings
    const aclInheritance = document.getElementById('aclInheritance');
    const aclOverrideRbac = document.getElementById('aclOverrideRbac');
    const aclDefaultPolicy = document.getElementById('aclDefaultPolicy');
    const aclRbacIntegration = document.getElementById('aclRbacIntegration');
    const aclAbacIntegration = document.getElementById('aclAbacIntegration');
    const permissionTypeEditBtns = document.querySelectorAll('.permission-type-header .edit-small');
    const addPermissionTypeBtn = document.querySelector('.permission-type.add-new button');

    if (aclInheritance) {
        aclInheritance.addEventListener('change', function() {
            console.log(`ACL inheritance ${this.checked ? 'enabled' : 'disabled'}`);
        });
    }

    if (aclOverrideRbac) {
        aclOverrideRbac.addEventListener('change', function() {
            console.log(`ACL override RBAC ${this.checked ? 'enabled' : 'disabled'}`);
        });
    }

    if (aclDefaultPolicy) {
        aclDefaultPolicy.addEventListener('change', function() {
            console.log(`ACL default policy set to: ${this.value}`);
        });
    }

    if (aclRbacIntegration) {
        aclRbacIntegration.addEventListener('change', function() {
            console.log(`ACL+RBAC integration set to: ${this.value}`);
        });
    }

    if (aclAbacIntegration) {
        aclAbacIntegration.addEventListener('change', function() {
            console.log(`ACL+ABAC integration set to: ${this.value}`);
        });
    }

    if (permissionTypeEditBtns) {
        permissionTypeEditBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const permissionType = this.closest('.permission-type-header').querySelector('h5').textContent;
                alert(`Edit permission type: ${permissionType}`);
                // This would open a modal to edit the permission type
            });
        });
    }

    if (addPermissionTypeBtn) {
        addPermissionTypeBtn.addEventListener('click', function() {
            alert('Add new permission type');
            // This would open a modal to add a new permission type
        });
    }

    // Policy Rules Management
    const addPolicyBtn = document.getElementById('addPolicyBtn');
    const policyModal = document.getElementById('policyModal');
    const policyForm = document.getElementById('policyForm');
    const policyModalTitle = document.getElementById('policyModalTitle');
    const policyName = document.getElementById('policyName');
    const policyDescription = document.getElementById('policyDescription');
    const policyCondition = document.getElementById('policyCondition');
    const policyEffect = document.getElementById('policyEffect');
    const policyTarget = document.getElementById('policyTarget');
    const policyIndex = document.getElementById('policyIndex');
    const savePolicyBtn = document.getElementById('savePolicyBtn');
    const cancelPolicyBtn = document.getElementById('cancelPolicyBtn');
    const closePolicyBtn = policyModal ? policyModal.querySelector('.close-btn') : null;

    // Store policy data
    const policyData = [
        {
            name: 'Time-Based Access',
            description: 'Restrict sensitive operations to business hours',
            condition: "user.role IN ['administrator', 'manager'] AND environment.time BETWEEN '08:00' AND '18:00'",
            effect: 'ALLOW',
            target: "resource.type = 'sensitive'",
            icon: 'clock',
            enabled: true
        },
        {
            name: 'Department-Based Access',
            description: 'Allow department members to access their department\'s resources',
            condition: 'user.department = resource.department',
            effect: 'ALLOW',
            target: '',
            icon: 'building',
            enabled: true
        },
        {
            name: 'Clearance Level Access',
            description: 'Allow access based on user clearance level',
            condition: 'user.clearanceLevel >= resource.classification',
            effect: 'ALLOW',
            target: '',
            icon: 'shield-alt',
            enabled: true
        },
        {
            name: 'New Policy',
            description: 'New policy description',
            condition: 'user.attribute = value',
            effect: 'ALLOW',
            target: '',
            icon: 'file-alt',
            enabled: true
        }
    ];

    // Function to open policy modal for adding a new policy
    function openAddPolicyModal() {
        if (!policyModal) return;

        policyModalTitle.textContent = 'Add New Policy Rule';
        policyForm.reset();
        policyName.value = 'New Policy';
        policyDescription.value = 'New policy description';
        policyCondition.value = 'user.attribute = value';
        policyEffect.value = 'ALLOW';
        policyTarget.value = '';
        policyIndex.value = '-1'; // -1 indicates a new policy

        policyModal.style.display = 'block';
    }

    // Function to open policy modal for editing an existing policy
    function openEditPolicyModal(index) {
        if (!policyModal || !policyData[index]) return;

        const policy = policyData[index];

        policyModalTitle.textContent = 'Edit Policy Rule';
        policyName.value = policy.name;
        policyDescription.value = policy.description;
        policyCondition.value = policy.condition;
        policyEffect.value = policy.effect;
        policyTarget.value = policy.target || '';
        policyIndex.value = index;

        policyModal.style.display = 'block';
    }

    // Function to save policy
    function savePolicy() {
        const index = parseInt(policyIndex.value);

        const policy = {
            name: policyName.value,
            description: policyDescription.value,
            condition: policyCondition.value,
            effect: policyEffect.value,
            target: policyTarget.value,
            icon: index >= 0 && index < policyData.length ? policyData[index].icon : 'file-alt',
            enabled: index >= 0 && index < policyData.length ? policyData[index].enabled : true
        };

        if (index === -1) {
            // Add new policy
            policyData.push(policy);
            updatePolicyList();
        } else {
            // Update existing policy
            policyData[index] = policy;
            updatePolicyItem(index);
        }

        policyModal.style.display = 'none';
    }

    // Function to delete policy
    function deletePolicy(index) {
        if (confirm('Are you sure you want to delete this policy?')) {
            policyData.splice(index, 1);
            updatePolicyList();
        }
    }

    // Function to toggle policy enabled state
    function togglePolicyEnabled(index, enabled) {
        if (policyData[index]) {
            policyData[index].enabled = enabled;
        }
    }

    // Function to update a single policy item in the DOM
    function updatePolicyItem(index) {
        const policy = policyData[index];
        const policyItem = document.querySelector(`.policy-item[data-policy-index="${index}"]`);

        if (!policyItem || !policy) return;

        const policyHeader = policyItem.querySelector('.policy-header');
        const policyDetails = policyItem.querySelector('.policy-details');

        // Update header
        policyHeader.querySelector('h5').innerHTML = `<i class="fas fa-${policy.icon}"></i> ${policy.name}`;
        policyHeader.querySelector('.policy-enabled').checked = policy.enabled;

        // Update details
        policyDetails.querySelector('p').innerHTML = `<strong>Description:</strong> ${policy.description}`;

        const policyRule = policyDetails.querySelector('.policy-rule');
        policyRule.className = `policy-rule ${policy.effect.toLowerCase()}`;
        policyRule.querySelector('.policy-type').textContent = policy.effect;

        let ruleText = `IF ${policy.condition} THEN ${policy.effect} access`;
        if (policy.target) {
            ruleText += ` TO ${policy.target}`;
        }

        policyRule.querySelector('code').textContent = ruleText;
    }

    // Function to update the entire policy list in the DOM
    function updatePolicyList() {
        const policyList = document.querySelector('.policy-list');

        if (!policyList) return;

        // Remove all existing policy items
        const existingItems = policyList.querySelectorAll('.policy-item');
        existingItems.forEach(item => item.remove());

        // Add policies to the list
        policyData.forEach((policy, index) => {
            const policyItem = document.createElement('div');
            policyItem.className = 'policy-item';
            policyItem.setAttribute('data-policy-index', index);

            let ruleText = `IF ${policy.condition} THEN ${policy.effect} access`;
            if (policy.target) {
                ruleText += ` TO ${policy.target}`;
            }

            policyItem.innerHTML = `
                <div class="policy-header">
                    <h5><i class="fas fa-${policy.icon}"></i> ${policy.name}</h5>
                    <div class="policy-actions">
                        <label class="checkbox-container">
                            <input type="checkbox" class="policy-enabled" ${policy.enabled ? 'checked' : ''}>
                            <span class="checkmark"></span>
                        </label>
                        <button class="btn-icon edit" title="Edit Policy"><i class="fas fa-edit"></i></button>
                        <button class="btn-icon delete" title="Delete Policy"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
                <div class="policy-details">
                    <p><strong>Description:</strong> ${policy.description}</p>
                    <div class="policy-rule ${policy.effect.toLowerCase()}">
                        <span class="policy-type">${policy.effect}</span>
                        <code>${ruleText}</code>
                    </div>
                </div>
            `;

            // Insert before the add button
            policyList.insertBefore(policyItem, addPolicyBtn);

            // Add event listeners to the new buttons
            const editBtn = policyItem.querySelector('.edit');
            const deleteBtn = policyItem.querySelector('.delete');
            const enabledCheckbox = policyItem.querySelector('.policy-enabled');

            editBtn.addEventListener('click', function() {
                openEditPolicyModal(index);
            });

            deleteBtn.addEventListener('click', function() {
                deletePolicy(index);
            });

            enabledCheckbox.addEventListener('change', function() {
                togglePolicyEnabled(index, this.checked);
            });
        });
    }

    // Add event listeners
    if (addPolicyBtn) {
        addPolicyBtn.addEventListener('click', openAddPolicyModal);
    }

    if (savePolicyBtn) {
        savePolicyBtn.addEventListener('click', savePolicy);
    }

    if (cancelPolicyBtn) {
        cancelPolicyBtn.addEventListener('click', function() {
            policyModal.style.display = 'none';
        });
    }

    if (closePolicyBtn) {
        closePolicyBtn.addEventListener('click', function() {
            policyModal.style.display = 'none';
        });
    }

    // Add event listeners to existing policy buttons
    document.querySelectorAll('.policy-item .edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const policyItem = this.closest('.policy-item');
            const index = parseInt(policyItem.getAttribute('data-policy-index'));
            openEditPolicyModal(index);
        });
    });

    document.querySelectorAll('.policy-item .delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const policyItem = this.closest('.policy-item');
            const index = parseInt(policyItem.getAttribute('data-policy-index'));
            deletePolicy(index);
        });
    });

    document.querySelectorAll('.policy-item .policy-enabled').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const policyItem = this.closest('.policy-item');
            const index = parseInt(policyItem.getAttribute('data-policy-index'));
            togglePolicyEnabled(index, this.checked);
        });
    });

    // Add Resource ACL Button
    const addResourceAclBtn = document.getElementById('addResourceAclBtn');
    if (addResourceAclBtn) {
        addResourceAclBtn.addEventListener('click', function() {
            // Create a new ACL row
            const aclTable = document.querySelector('.acl-list table tbody');
            if (aclTable) {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>New Resource</td>
                    <td>Document</td>
                    <td>Default Owner</td>
                    <td>
                        <div class="user-access-list">
                            <span class="user-access">Default User (Read)</span>
                        </div>
                    </td>
                    <td class="actions">
                        <button class="btn-icon edit"><i class="fas fa-edit"></i></button>
                        <button class="btn-icon delete"><i class="fas fa-trash"></i></button>
                    </td>
                `;

                aclTable.appendChild(newRow);

                // Add event listeners to new buttons
                const editBtn = newRow.querySelector('.edit');
                const deleteBtn = newRow.querySelector('.delete');

                if (editBtn) {
                    editBtn.addEventListener('click', function() {
                        alert('Edit ACL functionality would open an ACL editor');
                    });
                }

                if (deleteBtn) {
                    deleteBtn.addEventListener('click', function() {
                        if (confirm('Are you sure you want to delete this ACL?')) {
                            newRow.remove();
                        }
                    });
                }
            }
        });
    }

    // Add event listeners to existing policy buttons
    const policyEditButtons = document.querySelectorAll('.policy-item .edit');
    const policyDeleteButtons = document.querySelectorAll('.policy-item .delete');

    policyEditButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            alert('Edit policy functionality would open a policy editor');
        });
    });

    policyDeleteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const policyItem = this.closest('.policy-item');
            if (policyItem && confirm('Are you sure you want to delete this policy?')) {
                policyItem.remove();
            }
        });
    });

    // Add event listeners to existing ACL buttons
    const aclEditButtons = document.querySelectorAll('.acl-list .edit');
    const aclDeleteButtons = document.querySelectorAll('.acl-list .delete');

    aclEditButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            alert('Edit ACL functionality would open an ACL editor');
        });
    });

    aclDeleteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const aclRow = this.closest('tr');
            if (aclRow && confirm('Are you sure you want to delete this ACL?')) {
                aclRow.remove();
            }
        });
    });
}

// Function to setup demo data for access control system
function setupDemoAccessControlData(accessControlSystem) {
    if (!accessControlSystem) return;

    // RBAC Demo Data
    const rbac = accessControlSystem.rbac;

    // Add roles with permissions
    rbac.addRole('administrator', [
        'user_create', 'user_read', 'user_update', 'user_delete',
        'content_create', 'content_read', 'content_update', 'content_delete', 'content_publish',
        'system_configure', 'system_backup', 'system_logs'
    ]);

    rbac.addRole('manager', [
        'user_create', 'user_read', 'user_update',
        'content_create', 'content_read', 'content_update', 'content_publish'
    ]);

    rbac.addRole('editor', [
        'content_create', 'content_read', 'content_update', 'content_publish'
    ]);

    rbac.addRole('viewer', [
        'content_read'
    ]);

    // Assign roles to users
    rbac.assignRoleToUser('user1', 'administrator');
    rbac.assignRoleToUser('user2', 'manager');
    rbac.assignRoleToUser('user3', 'editor');
    rbac.assignRoleToUser('user4', 'viewer');

    // ABAC Demo Data
    const abac = accessControlSystem.abac;

    // Add policies
    abac.addPolicy(
        (user, resource, env) => {
            return user.role === 'administrator' &&
                   env.time >= '08:00' &&
                   env.time <= '18:00';
        },
        'Administrators can access sensitive resources during business hours'
    );

    abac.addPolicy(
        (user, resource) => {
            return user.department === resource.department;
        },
        'Users can access resources from their own department'
    );

    // ACL Demo Data
    const acl = accessControlSystem.acl;

    // Grant permissions to specific resources
    acl.grantPermission('financial-report', 'user1', 'read');
    acl.grantPermission('financial-report', 'user1', 'write');
    acl.grantPermission('financial-report', 'user2', 'read');

    acl.grantPermission('marketing-assets', 'user3', 'read');
    acl.grantPermission('marketing-assets', 'user3', 'write');
}

// Function to make stat cards clickable
function setupClickableStatCards() {
    const statCards = document.querySelectorAll('.stat-card[data-link]');

    statCards.forEach(card => {
        card.addEventListener('click', function() {
            const link = this.getAttribute('data-link');
            if (link) {
                window.location.href = link;
            }
        });
    });
}

// Function to setup access requests search and filter functionality
function setupAccessRequestsFilters() {
    // Get the search input, search button, and filter dropdowns
    const searchInput = document.getElementById('searchRequests');
    const searchBtn = document.querySelector('.search-container .search-btn');
    const statusFilter = document.getElementById('statusFilter');
    const typeFilter = document.getElementById('typeFilter');

    // If we're not on the access-requests page, return early
    if (!searchInput || !statusFilter || !typeFilter) return;

    // Function to filter the access requests table
    function filterAccessRequests() {
        const searchTerm = searchInput.value.toLowerCase();
        const statusValue = statusFilter.value.toLowerCase();
        const typeValue = typeFilter.value.toLowerCase();

        // Get all rows in the table
        const rows = document.querySelectorAll('.access-requests-list .data-table tbody tr');

        rows.forEach(row => {
            // Get the data from the row
            const requestId = row.querySelector('td:first-child').textContent.toLowerCase();
            const requesterName = row.querySelector('.user-name').textContent.toLowerCase();
            const requestType = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
            const requestDetails = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
            const statusText = row.querySelector('td:nth-child(7) .badge').textContent.toLowerCase();

            // Check if the row matches the search term
            const matchesSearch = searchTerm === '' ||
                requestId.includes(searchTerm) ||
                requesterName.includes(searchTerm) ||
                requestDetails.includes(searchTerm);

            // Check if the row matches the status filter
            const matchesStatus = statusValue === '' || statusText.includes(statusValue);

            // Check if the row matches the type filter
            const matchesType = typeValue === '' || requestType.toLowerCase().includes(typeValue);

            // Show or hide the row based on the filters
            if (matchesSearch && matchesStatus && matchesType) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    // Add event listeners for the search input, search button, and filter dropdowns
    searchInput.addEventListener('input', filterAccessRequests);

    searchBtn.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent form submission
        filterAccessRequests();
    });

    statusFilter.addEventListener('change', filterAccessRequests);
    typeFilter.addEventListener('change', filterAccessRequests);

    // Add event listener for the clear button
    const clearBtn = document.getElementById('clearFilters');
    if (clearBtn) {
        clearBtn.addEventListener('click', function(e) {
            e.preventDefault();

            // Reset the search input and filter dropdowns
            searchInput.value = '';
            statusFilter.value = '';
            typeFilter.value = '';

            // Apply the filters (which will show all rows)
            filterAccessRequests();
        });
    }
}

// Function to setup user profile dropdown
function setupUserProfileDropdown() {
    const userProfiles = document.querySelectorAll('.user-profile');

    userProfiles.forEach(profile => {
        profile.addEventListener('click', function(e) {
            // Toggle active class on click
            this.classList.toggle('active');

            // Stop propagation to prevent document click from immediately closing it
            e.stopPropagation();
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        userProfiles.forEach(profile => {
            profile.classList.remove('active');
        });
    });
}

// Global variables for drag and drop
let draggedItem = null;

// Global drag and drop functions that can be used across the application
function handleDragStart(e) {
    this.classList.add('dragging');
    draggedItem = this;

    // Required for Firefox
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);

    // Set permission data if available
    if (this.hasAttribute('data-permission')) {
        e.dataTransfer.setData('permission', this.getAttribute('data-permission'));
    }
}

function handleDragEnd() {
    this.classList.remove('dragging');
    draggedItem = null;

    // Remove drag-over class from all containers
    document.querySelectorAll('.role-list, .permission-list, .permission-tags').forEach(container => {
        container.classList.remove('drag-over');
    });
}

function handleDragOver(e) {
    e.preventDefault();
    return false;
}

function handleDragEnter(e) {
    this.classList.add('drag-over');
}

function handleDragLeave() {
    this.classList.remove('drag-over');
}

// Function to update the selected roles input
function updateSelectedRolesInput() {
    const selectedRoles = document.getElementById('selectedRoles');
    const userRolesInput = document.getElementById('userRoles');

    if (!selectedRoles || !userRolesInput) return;

    const selectedRoleItems = selectedRoles.querySelectorAll('.role-item');
    const roleValues = Array.from(selectedRoleItems).map(item => item.getAttribute('data-role'));
    userRolesInput.value = roleValues.join(',');
}

// We're using the global drag and drop functions defined at the top of the file

// Function to setup drag and drop for role selection
function setupRoleDragAndDrop() {
    const availableRoles = document.getElementById('availableRoles');
    const selectedRoles = document.getElementById('selectedRoles');

    if (!availableRoles || !selectedRoles) return;

    // Function to handle drop
    function handleDrop(e) {
        e.stopPropagation();
        e.preventDefault();

        this.classList.remove('drag-over');

        // Don't do anything if we're dropping onto the same container
        if (draggedItem.parentNode === this) return false;

        // Check if we're dropping onto the selected roles container
        if (this === selectedRoles) {
            // Clone the item and add it to the selected roles
            const newItem = draggedItem.cloneNode(true);

            // Check if this role is already in the selected roles
            const existingRole = selectedRoles.querySelector(`[data-role="${draggedItem.getAttribute('data-role')}"]`);
            if (existingRole) return false;

            // Add remove icon to the new item
            const removeIcon = document.createElement('span');
            removeIcon.className = 'role-remove-icon';
            removeIcon.innerHTML = '<i class="fas fa-times-circle"></i>';
            removeIcon.addEventListener('click', function(e) {
                e.stopPropagation();
                const roleItem = this.parentNode;
                roleItem.parentNode.removeChild(roleItem);

                // Add empty message if there are no more selected roles
                if (selectedRoles.children.length === 0) {
                    const emptyMessage = document.createElement('div');
                    emptyMessage.className = 'empty-message';
                    emptyMessage.textContent = 'Drag roles here to assign them to the user';
                    selectedRoles.appendChild(emptyMessage);
                }

                // Update the hidden input with selected roles
                updateSelectedRolesInput();
            });

            newItem.appendChild(removeIcon);

            // Add event listeners to the new item
            newItem.addEventListener('dragstart', handleDragStart);
            newItem.addEventListener('dragend', handleDragEnd);

            // Remove the empty message if it exists
            const emptyMessage = selectedRoles.querySelector('.empty-message');
            if (emptyMessage) {
                selectedRoles.removeChild(emptyMessage);
            }

            // Add the new item to the selected roles
            selectedRoles.appendChild(newItem);
        } else {
            // We're dropping onto the available roles container, so remove the item from selected roles
            if (draggedItem.parentNode === selectedRoles) {
                draggedItem.parentNode.removeChild(draggedItem);

                // Add empty message if there are no more selected roles
                if (selectedRoles.children.length === 0) {
                    const emptyMessage = document.createElement('div');
                    emptyMessage.className = 'empty-message';
                    emptyMessage.textContent = 'Drag roles here to assign them to the user';
                    selectedRoles.appendChild(emptyMessage);
                }
            }
        }

        // Update the hidden input with selected roles
        updateSelectedRolesInput();

        return false;
    }

    // Add event listeners to available roles
    const roleItems = availableRoles.querySelectorAll('.role-item');
    roleItems.forEach(item => {
        item.setAttribute('draggable', true);
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
    });

    // Add event listeners to role lists
    [availableRoles, selectedRoles].forEach(container => {
        container.addEventListener('dragover', handleDragOver);
        container.addEventListener('dragenter', handleDragEnter);
        container.addEventListener('dragleave', handleDragLeave);
        container.addEventListener('drop', handleDrop);
    });
}

// Function to setup drag and drop for permission selection
function setupPermissionDragAndDrop() {
    // For the role modal
    const availablePermissions = document.getElementById('availablePermissions');
    const selectedPermissions = document.getElementById('selectedPermissions');
    const rolePermissionsInput = document.getElementById('rolePermissions');

    // For the role-permission mapping tab
    const permissionItems = document.querySelectorAll('.permission-item');
    const rolePermissionTags = document.querySelectorAll('.permission-tags');
    const permissionSearch = document.getElementById('permissionSearch');

    // Using the global draggedItem variable

    // Function to update the hidden input with selected permissions
    function updateSelectedPermissionsInput() {
        if (!rolePermissionsInput) return;

        const selectedPermissionItems = selectedPermissions ? selectedPermissions.querySelectorAll('.permission-item') : [];
        const permissionValues = Array.from(selectedPermissionItems).map(item => item.getAttribute('data-permission'));
        rolePermissionsInput.value = permissionValues.join(',');
    }

    // We're using the global drag and drop functions defined at the top of the file

    // Function to handle drop for role modal
    function handleDropRoleModal(e) {
        e.stopPropagation();
        e.preventDefault();

        this.classList.remove('drag-over');

        // Don't do anything if we're dropping onto the same container
        if (draggedItem.parentNode === this) return false;

        // Check if we're dropping onto the selected permissions container
        if (this === selectedPermissions || this.closest('#selectedPermissions')) {
            // Clone the item and add it to the selected permissions
            const newItem = draggedItem.cloneNode(true);

            // Check if this permission is already in the selected permissions
            const existingPermission = selectedPermissions.querySelector(`[data-permission="${draggedItem.getAttribute('data-permission')}"]`);
            if (existingPermission) return false;

            // Add remove icon to the new item
            const removeIcon = document.createElement('span');
            removeIcon.className = 'permission-remove-icon';
            removeIcon.innerHTML = '<i class="fas fa-times-circle"></i>';
            removeIcon.addEventListener('click', function(e) {
                e.stopPropagation();
                const permissionItem = this.parentNode;
                permissionItem.parentNode.removeChild(permissionItem);

                // Add empty message if there are no more selected permissions
                if (selectedPermissions.children.length === 0) {
                    const emptyMessage = document.createElement('div');
                    emptyMessage.className = 'empty-message';
                    emptyMessage.textContent = 'Drag permissions here to assign them to this role';
                    selectedPermissions.appendChild(emptyMessage);
                }

                // Update the hidden input with selected permissions
                updateSelectedPermissionsInput();
            });

            newItem.appendChild(removeIcon);

            // Add event listeners to the new item
            newItem.addEventListener('dragstart', handleDragStart);
            newItem.addEventListener('dragend', handleDragEnd);

            // Remove the empty message if it exists
            const emptyMessage = selectedPermissions.querySelector('.empty-message');
            if (emptyMessage) {
                selectedPermissions.removeChild(emptyMessage);
            }

            // Add the new item to the selected permissions
            selectedPermissions.appendChild(newItem);
        } else {
            // We're dropping onto the available permissions container, so remove the item from selected permissions
            if (draggedItem.parentNode === selectedPermissions || draggedItem.closest('#selectedPermissions')) {
                draggedItem.parentNode.removeChild(draggedItem);

                // Add empty message if there are no more selected permissions
                if (selectedPermissions.children.length === 0) {
                    const emptyMessage = document.createElement('div');
                    emptyMessage.className = 'empty-message';
                    emptyMessage.textContent = 'Drag permissions here to assign them to this role';
                    selectedPermissions.appendChild(emptyMessage);
                }
            }
        }

        // Update the hidden input with selected permissions
        updateSelectedPermissionsInput();

        return false;
    }

    // Function to handle drop for role-permission mapping
    function handleDropRoleMapping(e) {
        e.stopPropagation();
        e.preventDefault();

        this.classList.remove('drag-over');

        // Get the permission being dragged
        const permissionName = e.dataTransfer.getData('permission') ||
                              (draggedItem ? draggedItem.getAttribute('data-permission') : null);

        if (!permissionName) return false;

        // Get the target role container
        const targetRoleContainer = this.closest('.permission-tags');
        if (!targetRoleContainer) return false;

        // Check if this permission already exists in the target role
        const existingPermission = targetRoleContainer.querySelector(`[data-permission="${permissionName}"]`);
        if (existingPermission) return false;

        // Create a new permission tag
        const newPermissionTag = document.createElement('span');
        newPermissionTag.className = 'permission-tag';
        newPermissionTag.setAttribute('draggable', 'true');
        newPermissionTag.setAttribute('data-permission', permissionName);
        newPermissionTag.textContent = permissionName;

        // Add event listeners to the new permission tag
        newPermissionTag.addEventListener('dragstart', handleDragStart);
        newPermissionTag.addEventListener('dragend', handleDragEnd);

        // Add the new permission tag to the target role
        targetRoleContainer.appendChild(newPermissionTag);

        // If the permission was dragged from another role, remove it from there
        if (draggedItem && draggedItem.classList.contains('permission-tag')) {
            const sourceRoleContainer = draggedItem.closest('.permission-tags');
            if (sourceRoleContainer && sourceRoleContainer !== targetRoleContainer) {
                sourceRoleContainer.removeChild(draggedItem);
            }
        }

        return false;
    }

    // Setup for role modal
    if (availablePermissions && selectedPermissions) {
        // Add event listeners to available permissions
        const modalPermissionItems = availablePermissions.querySelectorAll('.permission-item');
        modalPermissionItems.forEach(item => {
            item.setAttribute('draggable', true);
            item.addEventListener('dragstart', handleDragStart);
            item.addEventListener('dragend', handleDragEnd);
        });

        // Add event listeners to permission lists
        [availablePermissions, selectedPermissions].forEach(container => {
            container.addEventListener('dragover', handleDragOver);
            container.addEventListener('dragenter', handleDragEnter);
            container.addEventListener('dragleave', handleDragLeave);
            container.addEventListener('drop', handleDropRoleModal);
        });
    }

    // Setup for role-permission mapping tab
    if (permissionItems.length > 0 && rolePermissionTags.length > 0) {
        // Add event listeners to permission items
        permissionItems.forEach(item => {
            item.setAttribute('draggable', true);
            item.addEventListener('dragstart', handleDragStart);
            item.addEventListener('dragend', handleDragEnd);
        });

        // Add event listeners to permission tags in role cards
        document.querySelectorAll('.permission-tag').forEach(tag => {
            tag.setAttribute('draggable', true);
            tag.addEventListener('dragstart', handleDragStart);
            tag.addEventListener('dragend', handleDragEnd);
        });

        // Add event listeners to role permission containers
        rolePermissionTags.forEach(container => {
            container.addEventListener('dragover', handleDragOver);
            container.addEventListener('dragenter', handleDragEnter);
            container.addEventListener('dragleave', handleDragLeave);
            container.addEventListener('drop', handleDropRoleMapping);
        });

        // Setup permission search
        if (permissionSearch) {
            permissionSearch.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();

                // If search is empty, show all category cards
                if (searchTerm === '') {
                    document.querySelectorAll('.permission-category-card').forEach(card => {
                        card.style.display = 'block';
                    });
                    permissionItems.forEach(item => {
                        item.style.display = 'inline-flex';
                    });
                    return;
                }

                // Hide/show permissions based on search term
                let visibleCategoryCards = new Set();

                permissionItems.forEach(item => {
                    const permissionName = item.getAttribute('data-permission').toLowerCase();
                    const permissionText = item.textContent.toLowerCase();
                    const categoryCard = item.closest('.permission-category-card');

                    if (permissionName.includes(searchTerm) || permissionText.includes(searchTerm)) {
                        item.style.display = 'inline-flex';
                        if (categoryCard) {
                            visibleCategoryCards.add(categoryCard);
                        }
                    } else {
                        item.style.display = 'none';
                    }
                });

                // Show only category cards that have visible permissions
                document.querySelectorAll('.permission-category-card').forEach(card => {
                    if (visibleCategoryCards.has(card)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        }
    }
}

// Function to setup role management CRUD operations
function setupRoleManagement() {
    // Elements
    const roleModal = document.getElementById('roleModal');
    const deleteRoleModal = document.getElementById('deleteRoleModal');
    const roleForm = document.getElementById('roleForm');
    const createRoleBtn = document.getElementById('createRoleBtn');
    const saveRoleBtn = document.getElementById('saveRoleBtn');
    const cancelRoleBtn = document.getElementById('cancelRoleBtn');
    const confirmDeleteRoleBtn = document.getElementById('confirmDeleteRoleBtn');
    const cancelDeleteRoleBtn = document.getElementById('cancelDeleteRoleBtn');
    const searchInput = document.getElementById('searchRoles');
    const modalCloseBtns = document.querySelectorAll('.close-btn');
    const editButtons = document.querySelectorAll('.roles-list .btn-icon.edit');
    const deleteButtons = document.querySelectorAll('.roles-list .btn-icon.delete');

    // Reference to drag and drop functions for permissions
    const handleDragStart = window.handleDragStart || function(e) {
        this.classList.add('dragging');
        window.draggedItem = this;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
        e.dataTransfer.setData('permission', this.getAttribute('data-permission'));
    };

    const handleDragEnd = window.handleDragEnd || function() {
        this.classList.remove('dragging');
        window.draggedItem = null;
        document.querySelectorAll('.permission-list').forEach(list => {
            list.classList.remove('drag-over');
        });
    };

    // Current role being edited or deleted
    let currentRole = null;

    // Sample data for demonstration
    const roles = [
        { id: 1, name: 'Administrator', description: 'Full system access with all permissions', users: 10, permissions: ['user_create', 'user_read', 'user_update', 'user_delete', 'content_create', 'content_read', 'content_update', 'content_delete', 'content_publish', 'system_settings', 'system_backup', 'system_logs'], lastModified: '2023-06-15' },
        { id: 2, name: 'Manager', description: 'Department-level access with approval capabilities', users: 18, permissions: ['user_read', 'user_update', 'content_create', 'content_read', 'content_update', 'content_publish'], lastModified: '2023-05-28' },
        { id: 3, name: 'Editor', description: 'Content creation and modification access', users: 27, permissions: ['content_create', 'content_read', 'content_update', 'content_publish'], lastModified: '2023-06-10' },
        { id: 4, name: 'Viewer', description: 'Read-only access to content and reports', users: 49, permissions: ['user_read', 'content_read'], lastModified: '2023-04-22' },
        { id: 5, name: 'Customer', description: 'Limited access to customer-facing features', users: 20, permissions: ['content_read'], lastModified: '2023-06-01' }
    ];

    // Function to open role modal for creating a new role
    function openCreateRoleModal() {
        // Reset form
        roleForm.reset();

        // Clear selected permissions
        const selectedPermissions = document.getElementById('selectedPermissions');
        if (selectedPermissions) {
            selectedPermissions.innerHTML = '<div class="empty-message">Drag permissions here to assign them to this role</div>';
        }

        // Set modal title
        const modalTitle = roleModal.querySelector('.modal-header h2');
        if (modalTitle) {
            modalTitle.textContent = 'Create New Role';
        }

        // Reset current role
        currentRole = null;

        // Show modal
        roleModal.style.display = 'block';
    }

    // Function to open role modal for editing an existing role
    function openEditRoleModal(role) {
        // Set form values
        document.getElementById('roleName').value = role.name;
        document.getElementById('roleDescription').value = role.description;

        // Set selected permissions
        const selectedPermissions = document.getElementById('selectedPermissions');
        const rolePermissionsInput = document.getElementById('rolePermissions');

        if (selectedPermissions && rolePermissionsInput) {
            // Clear existing permissions
            selectedPermissions.innerHTML = '';

            // Add role permissions
            if (role.permissions && role.permissions.length > 0) {
                role.permissions.forEach(permission => {
                    const permissionItem = document.createElement('div');
                    permissionItem.className = 'permission-item';
                    permissionItem.setAttribute('draggable', 'true');
                    permissionItem.setAttribute('data-permission', permission);

                    let permissionIcon = 'key';
                    let permissionDisplay = permission.replace('_', ' ');
                    permissionDisplay = permissionDisplay.charAt(0).toUpperCase() + permissionDisplay.slice(1);

                    switch (permission) {
                        case 'user_create':
                            permissionIcon = 'user-plus';
                            permissionDisplay = 'Create Users';
                            break;
                        case 'user_read':
                            permissionIcon = 'user';
                            permissionDisplay = 'View Users';
                            break;
                        case 'user_update':
                            permissionIcon = 'user-edit';
                            permissionDisplay = 'Edit Users';
                            break;
                        case 'user_delete':
                            permissionIcon = 'user-minus';
                            permissionDisplay = 'Delete Users';
                            break;
                        case 'content_create':
                            permissionIcon = 'file-plus';
                            permissionDisplay = 'Create Content';
                            break;
                        case 'content_read':
                            permissionIcon = 'file';
                            permissionDisplay = 'View Content';
                            break;
                        case 'content_update':
                            permissionIcon = 'file-edit';
                            permissionDisplay = 'Edit Content';
                            break;
                        case 'content_delete':
                            permissionIcon = 'file-minus';
                            permissionDisplay = 'Delete Content';
                            break;
                        case 'content_publish':
                            permissionIcon = 'upload';
                            permissionDisplay = 'Publish Content';
                            break;
                        case 'system_settings':
                            permissionIcon = 'cogs';
                            permissionDisplay = 'System Settings';
                            break;
                        case 'system_backup':
                            permissionIcon = 'database';
                            permissionDisplay = 'Backup & Restore';
                            break;
                        case 'system_logs':
                            permissionIcon = 'list';
                            permissionDisplay = 'View Logs';
                            break;
                    }

                    // Add remove icon to the permission item
                    const removeIcon = document.createElement('span');
                    removeIcon.className = 'permission-remove-icon';
                    removeIcon.innerHTML = '<i class="fas fa-times-circle"></i>';
                    removeIcon.addEventListener('click', function(e) {
                        e.stopPropagation();
                        const permissionItem = this.parentNode;
                        permissionItem.parentNode.removeChild(permissionItem);

                        // Add empty message if there are no more selected permissions
                        if (selectedPermissions.children.length === 0) {
                            const emptyMessage = document.createElement('div');
                            emptyMessage.className = 'empty-message';
                            emptyMessage.textContent = 'Drag permissions here to assign them to this role';
                            selectedPermissions.appendChild(emptyMessage);
                        }

                        // Update the hidden input with selected permissions
                        const selectedPermissionItems = selectedPermissions.querySelectorAll('.permission-item');
                        const permissionValues = Array.from(selectedPermissionItems).map(item => item.getAttribute('data-permission'));
                        rolePermissionsInput.value = permissionValues.join(',');
                    });

                    permissionItem.innerHTML = `<i class="fas fa-${permissionIcon}"></i> ${permissionDisplay}`;
                    permissionItem.appendChild(removeIcon);

                    // Add drag and drop event listeners
                    permissionItem.addEventListener('dragstart', handleDragStart);
                    permissionItem.addEventListener('dragend', handleDragEnd);

                    selectedPermissions.appendChild(permissionItem);
                });

                // Update hidden input
                rolePermissionsInput.value = role.permissions.join(',');
            } else {
                // Show empty message
                selectedPermissions.innerHTML = '<div class="empty-message">Drag permissions here to assign them to this role</div>';
                rolePermissionsInput.value = '';
            }
        }

        // Set modal title
        const modalTitle = roleModal.querySelector('.modal-header h2');
        if (modalTitle) {
            modalTitle.textContent = 'Edit Role';
        }

        // Set current role
        currentRole = role;

        // Show modal
        roleModal.style.display = 'block';
    }

    // Function to save role (create or update)
    function saveRole() {
        // Get form values
        const name = document.getElementById('roleName').value;
        const description = document.getElementById('roleDescription').value;
        const permissions = document.getElementById('rolePermissions').value;

        // Validate form
        if (!name) {
            alert('Please enter a role name.');
            return;
        }

        if (!permissions) {
            alert('Please assign at least one permission to the role.');
            return;
        }

        // Create role object
        const role = {
            id: currentRole ? currentRole.id : Date.now(),
            name,
            description,
            permissions: permissions.split(','),
            users: currentRole ? currentRole.users : 0,
            lastModified: new Date().toISOString().split('T')[0]
        };

        // In a real application, you would send this data to the server
        console.log('Saving role:', role);

        // Update the roles array
        if (currentRole) {
            // Find and update existing role
            const index = roles.findIndex(r => r.id === role.id);
            if (index !== -1) {
                roles[index] = role;

                // Update the row in the table
                updateRoleRow(role);
            }
            alert(`Role ${role.name} updated successfully.`);
        } else {
            // Add new role to array
            roles.push(role);

            // Add new row to the table
            addRoleRow(role);
            alert(`Role ${role.name} created successfully.`);
        }

        // Close modal
        roleModal.style.display = 'none';
    }

    // Function to add a new role row to the table
    function addRoleRow(role) {
        const tbody = document.querySelector('.roles-list tbody');
        if (!tbody) return;

        // Create new row
        const tr = document.createElement('tr');
        tr.setAttribute('data-role-id', role.id);

        // Set row HTML
        tr.innerHTML = `
            <td>${role.name}</td>
            <td>${role.description}</td>
            <td>${role.users}</td>
            <td>${role.permissions.length === 12 ? 'All (12)' : role.permissions.length}</td>
            <td>${role.lastModified}</td>
            <td class="actions">
                <button class="btn-icon edit"><i class="fas fa-edit"></i></button>
                <button class="btn-icon delete"><i class="fas fa-trash"></i></button>
            </td>
        `;

        // Add event listeners to the new row
        const editBtn = tr.querySelector('.btn-icon.edit');
        const deleteBtn = tr.querySelector('.btn-icon.delete');

        if (editBtn) {
            editBtn.addEventListener('click', function() {
                openEditRoleModal(role);
            });
        }

        if (deleteBtn) {
            deleteBtn.addEventListener('click', function() {
                openDeleteRoleModal(role);
            });
        }

        // Add row to table
        tbody.appendChild(tr);
    }

    // Function to update an existing role row
    function updateRoleRow(role) {
        const rows = document.querySelectorAll('.roles-list tbody tr');

        for (const row of rows) {
            const roleId = parseInt(row.getAttribute('data-role-id'));
            if (roleId === role.id) {
                // Update row cells
                const cells = row.querySelectorAll('td');
                cells[0].textContent = role.name;
                cells[1].textContent = role.description;
                cells[3].textContent = role.permissions.length === 12 ? 'All (12)' : role.permissions.length;
                cells[4].textContent = role.lastModified;

                break;
            }
        }
    }

    // Function to open delete confirmation modal
    function openDeleteRoleModal(role) {
        // Set role info
        const roleInfo = deleteRoleModal.querySelector('.role-to-delete-info');
        if (roleInfo) {
            roleInfo.innerHTML = `
                <div style="margin: 15px 0;">
                    <h3>${role.name}</h3>
                    <p>${role.description}</p>
                    <p><strong>Users:</strong> ${role.users}</p>
                    <p><strong>Permissions:</strong> ${role.permissions.length === 12 ? 'All (12)' : role.permissions.length}</p>
                </div>
            `;
        }

        // Set current role
        currentRole = role;

        // Show modal
        deleteRoleModal.style.display = 'block';
    }

    // Function to delete role
    function deleteRole() {
        if (!currentRole) return;

        // In a real application, you would send this data to the server
        console.log('Deleting role:', currentRole);

        // Remove role from array
        const index = roles.findIndex(r => r.id === currentRole.id);
        if (index !== -1) {
            roles.splice(index, 1);

            // Remove role from table
            removeRoleRow(currentRole.id);
        }

        // For demonstration purposes, show success message
        alert(`Role ${currentRole.name} deleted successfully.`);

        // Close modal
        deleteRoleModal.style.display = 'none';
    }

    // Function to remove a role row from the table
    function removeRoleRow(roleId) {
        const rows = document.querySelectorAll('.roles-list tbody tr');

        for (const row of rows) {
            const id = parseInt(row.getAttribute('data-role-id'));
            if (id === roleId) {
                row.remove();
                break;
            }
        }
    }

    // Function to search roles
    function searchRoles(searchTerm) {
        const rows = document.querySelectorAll('.roles-list tbody tr');

        rows.forEach(row => {
            const name = row.querySelector('td:first-child').textContent.toLowerCase();
            const description = row.querySelector('td:nth-child(2)').textContent.toLowerCase();

            if (name.includes(searchTerm) || description.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    // Event Listeners

    // Create Role button
    if (createRoleBtn) {
        createRoleBtn.addEventListener('click', openCreateRoleModal);
    }

    // Save Role button
    if (saveRoleBtn) {
        saveRoleBtn.addEventListener('click', saveRole);
    }

    // Cancel Role button
    if (cancelRoleBtn) {
        cancelRoleBtn.addEventListener('click', function() {
            roleModal.style.display = 'none';
        });
    }

    // Edit buttons
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const roleId = parseInt(row.getAttribute('data-role-id'));
            const role = roles.find(r => r.id === roleId);
            if (role) {
                openEditRoleModal(role);
            }
        });
    });

    // Delete buttons
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const roleId = parseInt(row.getAttribute('data-role-id'));
            const role = roles.find(r => r.id === roleId);
            if (role) {
                openDeleteRoleModal(role);
            }
        });
    });

    // Confirm Delete button
    if (confirmDeleteRoleBtn) {
        confirmDeleteRoleBtn.addEventListener('click', deleteRole);
    }

    // Cancel Delete button
    if (cancelDeleteRoleBtn) {
        cancelDeleteRoleBtn.addEventListener('click', function() {
            deleteRoleModal.style.display = 'none';
        });
    }

    // Search input
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            searchRoles(searchTerm);
        });
    }

    // Close buttons for modals
    modalCloseBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
}

// Function to setup settings page functionality
function setupSettingsPage() {
    // Settings tab switching
    const settingsMenuItems = document.querySelectorAll('.settings-menu li');
    const settingsTabs = document.querySelectorAll('.settings-tab');

    if (settingsMenuItems.length && settingsTabs.length) {
        settingsMenuItems.forEach(item => {
            item.addEventListener('click', function() {
                // Remove active class from all menu items and tabs
                settingsMenuItems.forEach(menuItem => menuItem.classList.remove('active'));
                settingsTabs.forEach(tab => tab.classList.remove('active'));

                // Add active class to clicked menu item
                this.classList.add('active');

                // Show corresponding tab
                const tabId = this.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }

    // API Authentication type switching
    const apiAuthType = document.getElementById('apiAuthType');
    const jwtSettings = document.getElementById('jwtSettings');
    const oauth2Settings = document.getElementById('oauth2Settings');

    if (apiAuthType && jwtSettings && oauth2Settings) {
        apiAuthType.addEventListener('change', function() {
            // Hide all settings sections
            jwtSettings.style.display = 'none';
            oauth2Settings.style.display = 'none';

            // Show selected settings section
            if (this.value === 'jwt') {
                jwtSettings.style.display = 'block';
            } else if (this.value === 'oauth2') {
                oauth2Settings.style.display = 'block';
            }
        });
    }

    // Storage type switching
    const storageType = document.getElementById('storageType');
    const localStorageSettings = document.getElementById('localStorageSettings');
    const cloudStorageSettings = document.getElementById('cloudStorageSettings');

    if (storageType && localStorageSettings && cloudStorageSettings) {
        storageType.addEventListener('change', function() {
            // Hide all settings sections
            localStorageSettings.style.display = 'none';
            cloudStorageSettings.style.display = 'none';

            // Show selected settings section
            if (this.value === 'local') {
                localStorageSettings.style.display = 'block';
            } else {
                cloudStorageSettings.style.display = 'block';
            }
        });
    }

    // Password visibility toggle
    const passwordToggleBtns = document.querySelectorAll('.input-with-button .btn-icon');

    passwordToggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            if (input.type === 'password') {
                input.type = 'text';
                this.innerHTML = '<i class="fas fa-eye-slash"></i>';
            } else {
                input.type = 'password';
                this.innerHTML = '<i class="fas fa-eye"></i>';
            }
        });
    });
}

// Function to setup user management CRUD operations
function setupUserManagement() {
    // Elements
    const userModal = document.getElementById('userModal');
    const deleteConfirmModal = document.getElementById('deleteConfirmModal');
    const bulkActionsModal = document.getElementById('bulkActionsModal');
    const userForm = document.getElementById('userForm');
    const createUserBtn = document.getElementById('createUserBtn');
    const saveUserBtn = document.getElementById('saveUserBtn');
    const cancelUserBtn = document.getElementById('cancelUserBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const bulkActionBtn = document.getElementById('bulkActionBtn');
    const applyBulkBtn = document.getElementById('applyBulkBtn');
    const cancelBulkBtn = document.getElementById('cancelBulkBtn');
    const selectAllCheckbox = document.getElementById('selectAll');
    const userCheckboxes = document.querySelectorAll('input[name="selectedUser"]');
    const searchInput = document.getElementById('searchUsers');
    const roleFilter = document.getElementById('roleFilter');
    const statusFilter = document.getElementById('statusFilter');
    const selectedCountBadge = document.getElementById('selectedCountBadge');
    const selectedCount = document.getElementById('selectedCount');
    const bulkAction = document.getElementById('bulkAction');
    const bulkRoleSelect = document.getElementById('bulkRoleSelect');
    const modalCloseBtns = document.querySelectorAll('.close-btn');
    const editButtons = document.querySelectorAll('.btn-icon.edit');
    const deleteButtons = document.querySelectorAll('.btn-icon.delete');

    // Current user being edited or deleted
    let currentUser = null;

    // Sample data for demonstration
    const users = [
        { id: 1001, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', roles: ['administrator'], status: 'active', lastLogin: '2023-06-15 09:45 AM' },
        { id: 1002, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', roles: ['manager'], status: 'active', lastLogin: '2023-06-14 14:22 PM' },
        { id: 1003, firstName: 'Robert', lastName: 'Johnson', email: 'robert.johnson@example.com', roles: ['editor'], status: 'inactive', lastLogin: '2023-05-30 11:15 AM' },
        { id: 1004, firstName: 'Emily', lastName: 'Davis', email: 'emily.davis@example.com', roles: ['viewer'], status: 'active', lastLogin: '2023-06-12 16:30 PM' },
        { id: 1005, firstName: 'Michael', lastName: 'Brown', email: 'michael.brown@example.com', roles: ['customer'], status: 'pending', lastLogin: 'Never' }
    ];

    // Function to open user modal for creating a new user
    function openCreateUserModal() {
        // Reset form
        userForm.reset();

        // Clear selected roles
        const selectedRoles = document.getElementById('selectedRoles');
        if (selectedRoles) {
            selectedRoles.innerHTML = '<div class="empty-message">Drag roles here to assign them to the user</div>';
        }

        // Set modal title
        const modalTitle = userModal.querySelector('.modal-header h2');
        if (modalTitle) {
            modalTitle.textContent = 'Create New User';
        }

        // Reset current user
        currentUser = null;

        // Show modal
        userModal.style.display = 'block';
    }

    // Function to open user modal for editing an existing user
    function openEditUserModal(user) {
        // Set form values
        document.getElementById('firstName').value = user.firstName;
        document.getElementById('lastName').value = user.lastName;
        document.getElementById('email').value = user.email;
        document.getElementById('userStatus').value = user.status;

        // Clear password fields
        document.getElementById('password').value = '';
        document.getElementById('confirmPassword').value = '';

        // Set selected roles
        const selectedRoles = document.getElementById('selectedRoles');
        const userRolesInput = document.getElementById('userRoles');

        if (selectedRoles && userRolesInput) {
            // Clear existing roles
            selectedRoles.innerHTML = '';

            // Add user roles
            if (user.roles && user.roles.length > 0) {
                user.roles.forEach(role => {
                    const roleItem = document.createElement('div');
                    roleItem.className = 'role-item';
                    roleItem.setAttribute('draggable', 'true');
                    roleItem.setAttribute('data-role', role);

                    let roleIcon = 'user';
                    let roleDisplay = role.charAt(0).toUpperCase() + role.slice(1);

                    switch (role) {
                        case 'administrator':
                            roleIcon = 'user-shield';
                            break;
                        case 'manager':
                            roleIcon = 'user-tie';
                            break;
                        case 'editor':
                            roleIcon = 'user-edit';
                            break;
                        case 'viewer':
                            roleIcon = 'user';
                            break;
                        case 'customer':
                            roleIcon = 'user-tag';
                            break;
                    }

                    // Add remove icon to the role item
                    const removeIcon = document.createElement('span');
                    removeIcon.className = 'role-remove-icon';
                    removeIcon.innerHTML = '<i class="fas fa-times-circle"></i>';
                    removeIcon.addEventListener('click', function(e) {
                        e.stopPropagation();
                        const roleItem = this.parentNode;
                        roleItem.parentNode.removeChild(roleItem);

                        // Add empty message if there are no more selected roles
                        if (selectedRoles.children.length === 0) {
                            const emptyMessage = document.createElement('div');
                            emptyMessage.className = 'empty-message';
                            emptyMessage.textContent = 'Drag roles here to assign them to the user';
                            selectedRoles.appendChild(emptyMessage);
                        }

                        // Update the hidden input with selected roles
                        const selectedRoleItems = selectedRoles.querySelectorAll('.role-item');
                        const roleValues = Array.from(selectedRoleItems).map(item => item.getAttribute('data-role'));
                        userRolesInput.value = roleValues.join(',');
                    });

                    roleItem.innerHTML = `<i class="fas fa-${roleIcon}"></i> ${roleDisplay}`;
                    roleItem.appendChild(removeIcon);

                    // Add drag and drop event listeners
                    roleItem.addEventListener('dragstart', handleDragStart);
                    roleItem.addEventListener('dragend', handleDragEnd);

                    selectedRoles.appendChild(roleItem);
                });

                // Update hidden input
                userRolesInput.value = user.roles.join(',');
            } else {
                // Show empty message
                selectedRoles.innerHTML = '<div class="empty-message">Drag roles here to assign them to the user</div>';
                userRolesInput.value = '';
            }
        }

        // Set modal title
        const modalTitle = userModal.querySelector('.modal-header h2');
        if (modalTitle) {
            modalTitle.textContent = 'Edit User';
        }

        // Set current user
        currentUser = user;

        // Show modal
        userModal.style.display = 'block';
    }

    // Function to save user (create or update)
    function saveUser() {
        // Get form values
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const userRoles = document.getElementById('userRoles').value;
        const status = document.getElementById('userStatus').value;
        const sendWelcomeEmail = document.getElementById('sendWelcomeEmail').checked;
        const requirePasswordChange = document.getElementById('requirePasswordChange').checked;
        const enableTwoFactor = document.getElementById('enableTwoFactor').checked;

        // Validate form
        if (!firstName || !lastName || !email) {
            alert('Please fill in all required fields.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        if (!userRoles) {
            alert('Please assign at least one role to the user.');
            return;
        }

        // Create user object
        const user = {
            id: currentUser ? currentUser.id : Date.now(),
            firstName,
            lastName,
            email,
            roles: userRoles.split(','),
            status,
            lastLogin: currentUser ? currentUser.lastLogin : 'Never',
            sendWelcomeEmail,
            requirePasswordChange,
            enableTwoFactor
        };

        // In a real application, you would send this data to the server
        console.log('Saving user:', user);

        // Update the users array
        if (currentUser) {
            // Find and update existing user
            const index = users.findIndex(u => u.id === user.id);
            if (index !== -1) {
                users[index] = user;

                // Update the row in the table
                updateUserRow(user);
            }
            alert(`User ${user.firstName} ${user.lastName} updated successfully.`);
        } else {
            // Add new user to array
            users.push(user);

            // Add new row to the table
            addUserRow(user);
            alert(`User ${user.firstName} ${user.lastName} created successfully.`);
        }

        // Close modal
        userModal.style.display = 'none';
    }

    // Function to add a new user row to the table
    function addUserRow(user) {
        const tbody = document.querySelector('.data-table tbody');
        if (!tbody) return;

        // Create new row
        const tr = document.createElement('tr');

        // Get role badges HTML
        const roleBadges = user.roles.map(role => {
            let roleClass = '';
            switch (role) {
                case 'administrator': roleClass = 'role-admin'; break;
                case 'manager': roleClass = 'role-manager'; break;
                case 'editor': roleClass = 'role-editor'; break;
                case 'viewer': roleClass = 'role-viewer'; break;
                case 'customer': roleClass = 'role-customer'; break;
            }
            return `<span class="badge ${roleClass}">${role.charAt(0).toUpperCase() + role.slice(1)}</span>`;
        }).join(' ');

        // Get status badge HTML
        let statusClass = '';
        switch (user.status) {
            case 'active': statusClass = 'status-active'; break;
            case 'inactive': statusClass = 'status-inactive'; break;
            case 'pending': statusClass = 'status-pending'; break;
        }

        // Set row HTML
        tr.innerHTML = `
            <td>
                <label class="checkbox-container">
                    <input type="checkbox" name="selectedUser">
                    <span class="checkmark"></span>
                </label>
            </td>
            <td class="user-info">
                <div class="avatar-circle user-avatar" data-letter="${user.firstName.charAt(0)}">
                    <span class="avatar-text">${user.firstName.charAt(0)}</span>
                </div>
                <div>
                    <p class="user-name">${user.firstName} ${user.lastName}</p>
                    <p class="user-id">ID: ${user.id}</p>
                </div>
            </td>
            <td>${user.email}</td>
            <td>${roleBadges}</td>
            <td><span class="badge ${statusClass}">${user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span></td>
            <td>${user.lastLogin}</td>
            <td class="actions">
                <button class="btn-icon edit"><i class="fas fa-edit"></i></button>
                <button class="btn-icon delete"><i class="fas fa-trash"></i></button>
                <button class="btn-icon more"><i class="fas fa-ellipsis-v"></i></button>
            </td>
        `;

        // Add event listeners to the new row
        const editBtn = tr.querySelector('.btn-icon.edit');
        const deleteBtn = tr.querySelector('.btn-icon.delete');
        const checkbox = tr.querySelector('input[name="selectedUser"]');

        if (editBtn) {
            editBtn.addEventListener('click', function() {
                openEditUserModal(user);
            });
        }

        if (deleteBtn) {
            deleteBtn.addEventListener('click', function() {
                openDeleteConfirmModal(user);
            });
        }

        if (checkbox) {
            checkbox.addEventListener('change', function() {
                // If any checkbox is unchecked, uncheck "Select All"
                if (!this.checked && selectAllCheckbox) {
                    selectAllCheckbox.checked = false;
                }

                // If all checkboxes are checked, check "Select All"
                if (selectAllCheckbox) {
                    const allChecked = Array.from(document.querySelectorAll('input[name="selectedUser"]')).every(cb => cb.checked);
                    selectAllCheckbox.checked = allChecked;
                }

                updateSelectedCount();
            });
        }

        // Add row to table
        tbody.appendChild(tr);
    }

    // Function to update an existing user row
    function updateUserRow(user) {
        const rows = document.querySelectorAll('.data-table tbody tr');

        for (const row of rows) {
            const userIdElement = row.querySelector('.user-id');
            if (userIdElement && userIdElement.textContent === `ID: ${user.id}`) {
                // Get role badges HTML
                const roleBadges = user.roles.map(role => {
                    let roleClass = '';
                    switch (role) {
                        case 'administrator': roleClass = 'role-admin'; break;
                        case 'manager': roleClass = 'role-manager'; break;
                        case 'editor': roleClass = 'role-editor'; break;
                        case 'viewer': roleClass = 'role-viewer'; break;
                        case 'customer': roleClass = 'role-customer'; break;
                    }
                    return `<span class="badge ${roleClass}">${role.charAt(0).toUpperCase() + role.slice(1)}</span>`;
                }).join(' ');

                // Get status badge HTML
                let statusClass = '';
                switch (user.status) {
                    case 'active': statusClass = 'status-active'; break;
                    case 'inactive': statusClass = 'status-inactive'; break;
                    case 'pending': statusClass = 'status-pending'; break;
                }

                // Update row cells
                const nameElement = row.querySelector('.user-name');
                const avatarElement = row.querySelector('.avatar-circle');
                const avatarTextElement = row.querySelector('.avatar-text');
                const emailCell = row.querySelector('td:nth-child(3)');
                const roleCell = row.querySelector('td:nth-child(4)');
                const statusCell = row.querySelector('td:nth-child(5)');

                if (nameElement) nameElement.textContent = `${user.firstName} ${user.lastName}`;
                if (avatarElement) avatarElement.setAttribute('data-letter', user.firstName.charAt(0));
                if (avatarTextElement) avatarTextElement.textContent = user.firstName.charAt(0);
                if (emailCell) emailCell.textContent = user.email;
                if (roleCell) roleCell.innerHTML = roleBadges;
                if (statusCell) statusCell.innerHTML = `<span class="badge ${statusClass}">${user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span>`;

                break;
            }
        }
    }

    // Function to open delete confirmation modal
    function openDeleteConfirmModal(user) {
        // Set user info
        const userInfo = deleteConfirmModal.querySelector('.user-to-delete-info');
        if (userInfo) {
            userInfo.innerHTML = `
                <div class="user-info" style="margin: 15px 0;">
                    <div class="avatar-circle user-avatar" data-letter="${user.firstName.charAt(0)}">
                        <span class="avatar-text">${user.firstName.charAt(0)}</span>
                    </div>
                    <div>
                        <p class="user-name">${user.firstName} ${user.lastName}</p>
                        <p class="user-id">ID: ${user.id}</p>
                        <p>${user.email}</p>
                    </div>
                </div>
            `;
        }

        // Set current user
        currentUser = user;

        // Show modal
        deleteConfirmModal.style.display = 'block';
    }

    // Function to delete user
    function deleteUser() {
        if (!currentUser) return;

        // In a real application, you would send this data to the server
        console.log('Deleting user:', currentUser);

        // Remove user from array
        const index = users.findIndex(u => u.id === currentUser.id);
        if (index !== -1) {
            users.splice(index, 1);

            // Remove user from table
            removeUserRow(currentUser.id);
        }

        // For demonstration purposes, show success message
        alert(`User ${currentUser.firstName} ${currentUser.lastName} deleted successfully.`);

        // Close modal
        deleteConfirmModal.style.display = 'none';
    }

    // Function to remove a user row from the table
    function removeUserRow(userId) {
        const rows = document.querySelectorAll('.data-table tbody tr');

        for (const row of rows) {
            const userIdElement = row.querySelector('.user-id');
            if (userIdElement && userIdElement.textContent === `ID: ${userId}`) {
                row.remove();
                break;
            }
        }
    }

    // Function to update selected count
    function updateSelectedCount() {
        const selectedUsers = document.querySelectorAll('input[name="selectedUser"]:checked');
        const count = selectedUsers.length;

        // Update count in badge and modal
        if (selectedCountBadge) selectedCountBadge.textContent = count;
        if (selectedCount) selectedCount.textContent = count;

        // Enable/disable bulk action button
        if (bulkActionBtn) {
            bulkActionBtn.disabled = count === 0;
        }
    }

    // Function to open bulk actions modal
    function openBulkActionsModal() {
        // Reset form
        if (bulkAction) bulkAction.value = '';
        if (bulkRoleSelect) bulkRoleSelect.style.display = 'none';

        // Show modal
        bulkActionsModal.style.display = 'block';
    }

    // Function to apply bulk action
    function applyBulkAction() {
        const action = bulkAction.value;
        if (!action) {
            alert('Please select an action.');
            return;
        }

        const selectedUsers = document.querySelectorAll('input[name="selectedUser"]:checked');
        if (selectedUsers.length === 0) {
            alert('No users selected.');
            return;
        }

        // Get selected user IDs and rows
        const selectedData = Array.from(selectedUsers).map(checkbox => {
            const row = checkbox.closest('tr');
            const userIdElement = row.querySelector('.user-id');
            const userId = userIdElement ? userIdElement.textContent.replace('ID: ', '') : null;
            return { userId, row };
        }).filter(data => data.userId !== null);

        // Perform action based on selection
        switch (action) {
            case 'activate':
                // Update users in array and table
                selectedData.forEach(data => {
                    const user = users.find(u => u.id == data.userId);
                    if (user) {
                        user.status = 'active';
                        const statusCell = data.row.querySelector('td:nth-child(5)');
                        if (statusCell) {
                            statusCell.innerHTML = '<span class="badge status-active">Active</span>';
                        }
                    }
                });
                console.log('Activating users:', selectedData.map(d => d.userId));
                alert(`${selectedData.length} users activated successfully.`);
                break;

            case 'deactivate':
                // Update users in array and table
                selectedData.forEach(data => {
                    const user = users.find(u => u.id == data.userId);
                    if (user) {
                        user.status = 'inactive';
                        const statusCell = data.row.querySelector('td:nth-child(5)');
                        if (statusCell) {
                            statusCell.innerHTML = '<span class="badge status-inactive">Inactive</span>';
                        }
                    }
                });
                console.log('Deactivating users:', selectedData.map(d => d.userId));
                alert(`${selectedData.length} users deactivated successfully.`);
                break;

            case 'delete':
                // Remove users from array and table
                if (confirm(`Are you sure you want to delete ${selectedData.length} users? This action cannot be undone.`)) {
                    selectedData.forEach(data => {
                        // Remove from array
                        const index = users.findIndex(u => u.id == data.userId);
                        if (index !== -1) {
                            users.splice(index, 1);
                        }
                        // Remove from table
                        data.row.remove();
                    });
                    console.log('Deleting users:', selectedData.map(d => d.userId));
                    alert(`${selectedData.length} users deleted successfully.`);
                } else {
                    // User cancelled, exit function
                    return;
                }
                break;

            case 'role':
                const role = document.getElementById('bulkRole').value;
                if (!role) {
                    alert('Please select a role to assign.');
                    return;
                }

                // Get role badge HTML
                let roleClass = '';
                switch (role) {
                    case 'administrator': roleClass = 'role-admin'; break;
                    case 'manager': roleClass = 'role-manager'; break;
                    case 'editor': roleClass = 'role-editor'; break;
                    case 'viewer': roleClass = 'role-viewer'; break;
                    case 'customer': roleClass = 'role-customer'; break;
                }
                const roleBadge = `<span class="badge ${roleClass}">${role.charAt(0).toUpperCase() + role.slice(1)}</span>`;

                // Update users in array and table
                selectedData.forEach(data => {
                    const user = users.find(u => u.id == data.userId);
                    if (user) {
                        // Check if user already has this role
                        if (!user.roles.includes(role)) {
                            user.roles.push(role);
                            const roleCell = data.row.querySelector('td:nth-child(4)');
                            if (roleCell) {
                                roleCell.innerHTML += ' ' + roleBadge;
                            }
                        }
                    }
                });

                console.log(`Assigning role ${role} to users:`, selectedData.map(d => d.userId));
                alert(`Role ${role} assigned to ${selectedData.length} users successfully.`);
                break;
        }

        // Close modal
        bulkActionsModal.style.display = 'none';

        // Uncheck all checkboxes
        if (selectAllCheckbox) selectAllCheckbox.checked = false;
        userCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

        // Update selected count
        updateSelectedCount();
    }

    // Event Listeners

    // Create User button
    if (createUserBtn) {
        createUserBtn.addEventListener('click', openCreateUserModal);
    }

    // Save User button
    if (saveUserBtn) {
        saveUserBtn.addEventListener('click', saveUser);
    }

    // Cancel User button
    if (cancelUserBtn) {
        cancelUserBtn.addEventListener('click', function() {
            userModal.style.display = 'none';
        });
    }

    // Edit buttons
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const userId = row.querySelector('.user-id').textContent.replace('ID: ', '');
            const user = users.find(u => u.id == userId);
            if (user) {
                openEditUserModal(user);
            }
        });
    });

    // Delete buttons
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const userId = row.querySelector('.user-id').textContent.replace('ID: ', '');
            const user = users.find(u => u.id == userId);
            if (user) {
                openDeleteConfirmModal(user);
            }
        });
    });

    // Confirm Delete button
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', deleteUser);
    }

    // Cancel Delete button
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', function() {
            deleteConfirmModal.style.display = 'none';
        });
    }

    // Bulk Action button
    if (bulkActionBtn) {
        bulkActionBtn.addEventListener('click', openBulkActionsModal);
    }

    // Apply Bulk Action button
    if (applyBulkBtn) {
        applyBulkBtn.addEventListener('click', applyBulkAction);
    }

    // Cancel Bulk Action button
    if (cancelBulkBtn) {
        cancelBulkBtn.addEventListener('click', function() {
            bulkActionsModal.style.display = 'none';
        });
    }

    // Select All checkbox
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            userCheckboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
            updateSelectedCount();
        });
    }

    // User checkboxes
    userCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // If any checkbox is unchecked, uncheck "Select All"
            if (!this.checked && selectAllCheckbox) {
                selectAllCheckbox.checked = false;
            }

            // If all checkboxes are checked, check "Select All"
            if (selectAllCheckbox) {
                const allChecked = Array.from(userCheckboxes).every(cb => cb.checked);
                selectAllCheckbox.checked = allChecked;
            }

            updateSelectedCount();
        });
    });

    // Bulk Action select
    if (bulkAction) {
        bulkAction.addEventListener('change', function() {
            if (bulkRoleSelect) {
                bulkRoleSelect.style.display = this.value === 'role' ? 'block' : 'none';
            }
        });
    }

    // Search input
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const rows = document.querySelectorAll('.data-table tbody tr');

            rows.forEach(row => {
                const name = row.querySelector('.user-name').textContent.toLowerCase();
                const email = row.querySelector('td:nth-child(3)').textContent.toLowerCase();

                if (name.includes(searchTerm) || email.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }

    // Role filter
    if (roleFilter) {
        roleFilter.addEventListener('change', function() {
            const selectedRole = this.value.toLowerCase();
            const rows = document.querySelectorAll('.data-table tbody tr');

            rows.forEach(row => {
                const role = row.querySelector('td:nth-child(4) .badge').textContent.toLowerCase();

                if (selectedRole === '' || role.includes(selectedRole)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }

    // Status filter
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            const selectedStatus = this.value.toLowerCase();
            const rows = document.querySelectorAll('.data-table tbody tr');

            rows.forEach(row => {
                const status = row.querySelector('td:nth-child(5) .badge').textContent.toLowerCase();

                if (selectedStatus === '' || status.includes(selectedStatus)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }

    // Close buttons for modals
    modalCloseBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
}

// Function to setup permission remove icons
function setupPermissionRemoveIcons() {
    // Get all remove icons in permission tags
    const removeIcons = document.querySelectorAll('.permission-tag .remove-icon');

    if (!removeIcons.length) return;

    // Add click event listener to each remove icon
    removeIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling

            // Get the parent permission tag
            const permissionTag = this.parentElement;

            // Get the permission name for confirmation
            const permissionName = permissionTag.getAttribute('data-permission');

            // Confirm before removing
            if (confirm(`Are you sure you want to remove the "${permissionName}" permission?`)) {
                // Remove the permission tag from the DOM
                permissionTag.remove();
            }
        });
    });
}