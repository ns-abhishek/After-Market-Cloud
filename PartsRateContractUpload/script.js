// Initialize Material Design Components
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initializeTheme();

    // Initialize all MDC components
    initializeMDCComponents();

    // Initialize app functionality
    initializeApp();
});

// Theme Management
function initializeTheme() {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    // Initialize theme toggle button
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', toggleTheme);

    // Update toggle button icon based on current theme
    updateThemeToggleIcon(savedTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeToggleIcon(theme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

function updateThemeToggleIcon(theme) {
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = theme === 'light' ? 'dark_mode' : 'light_mode';
    }
}

function initializeMDCComponents() {
    // Initialize text fields
    const textFields = document.querySelectorAll('.mdc-text-field');
    textFields.forEach(textField => {
        mdc.textField.MDCTextField.attachTo(textField);
    });

    // Initialize buttons
    const buttons = document.querySelectorAll('.mdc-button');
    buttons.forEach(button => {
        mdc.ripple.MDCRipple.attachTo(button);
    });

    // Initialize icon buttons
    const iconButtons = document.querySelectorAll('.mdc-icon-button');
    iconButtons.forEach(iconButton => {
        mdc.ripple.MDCRipple.attachTo(iconButton);
        iconButton.unbounded = true;
    });

    // Initialize select
    const selects = document.querySelectorAll('.mdc-select');
    selects.forEach(select => {
        mdc.select.MDCSelect.attachTo(select);
    });
}

function initializeApp() {
    // Tab functionality
    initializeTabs();

    // File upload functionality
    initializeFileUpload();

    // Template download functionality
    initializeTemplateDownload();

    // Form handling
    initializeFormHandling();

    // Multiple entry functionality
    initializeMultipleEntry();

    // Search functionality
    initializeSearch();

    // Grid export functionality
    initializeGridExport();

    // Header icons functionality
    initializeHeaderIcons();

    // Modal functionality
    initializeModal();

    // Sample data
    loadSampleData();

    // Add sample manual entry for UI demonstration
    addSampleManualEntry();
}

// Tab Management
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            // Remove active class from all tabs and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked tab and corresponding content
            button.classList.add('active');
            document.getElementById(`${targetTab}-tab`).classList.add('active');
        });
    });
}

// File Upload Functionality
function initializeFileUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');

    // Drag and drop functionality
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    });

    // Click to upload
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
        }
    });
}

function handleFileUpload(file) {
    // Validate file type
    const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'
    ];

    if (!allowedTypes.includes(file.type)) {
        showNotification('Please upload a valid Excel or CSV file.', 'error');
        return;
    }

    // Show loading state
    const uploadArea = document.getElementById('uploadArea');
    uploadArea.classList.add('loading');

    // Simulate file processing
    setTimeout(() => {
        uploadArea.classList.remove('loading');
        uploadArea.classList.add('success');

        showNotification(`File "${file.name}" uploaded successfully!`, 'success');

        // Add to contracts table
        addContractToTable({
            uploadDate: new Date().toLocaleDateString('en-GB'),
            uploadedBy: 'Current User',
            uploadCount: Math.floor(Math.random() * 1000) + 1,
            fileName: file.name
        });

        // Reset upload area after 3 seconds
        setTimeout(() => {
            uploadArea.classList.remove('success');
        }, 3000);
    }, 2000);
}

// Template Download Functionality
function initializeTemplateDownload() {
    const downloadTemplateBtn = document.getElementById('downloadTemplate');

    downloadTemplateBtn.addEventListener('click', () => {
        // Create sample CSV data
        const csvData = [
            ['Customer#', 'Customer Name', 'Prefix', 'Part Number', 'Part Description', 'Scale', 'Price', 'Currency', 'Effective From', 'Effective To'],
            ['Customer 11002', 'HCL AMP', 'P', '800378', 'WIPER BLADE / SERVICE 700MM', '150', '150.00', 'US Dollars', '16-Mar-22', '15-Mar-23'],
            ['Customer 11003', 'Sample Company', 'P', '800379', 'BRAKE PAD / SERVICE 300MM', '100', '75.50', 'US Dollars', '01-Jan-23', '31-Dec-23'],
            ['Customer 11004', 'Demo Corp', 'S', '800380', 'OIL FILTER / STANDARD', '200', '25.00', 'EUR', '15-Jun-23', '14-Jun-24']
        ];

        // Convert to CSV string
        const csvContent = csvData.map(row => row.join(',')).join('\n');

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'parts_rate_contract_template.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showNotification('Template downloaded successfully!', 'success');
    });
}

// Multiple Entry Management
let pendingEntries = [];

function initializeMultipleEntry() {
    const addAndContinueBtn = document.getElementById('addAndContinue');
    const clearAllPendingBtn = document.getElementById('clearAllPending');
    const submitAllEntriesBtn = document.getElementById('submitAllEntries');

    addAndContinueBtn.addEventListener('click', () => {
        if (validateAndAddToPending()) {
            clearFormFields();
            showNotification('Entry added to pending list. Continue adding more entries.', 'success');
        }
    });

    clearAllPendingBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all pending entries?')) {
            pendingEntries = [];
            updatePendingEntriesDisplay();
            showNotification('All pending entries cleared.', 'info');
        }
    });

    submitAllEntriesBtn.addEventListener('click', () => {
        if (pendingEntries.length === 0) {
            showNotification('No pending entries to submit.', 'error');
            return;
        }

        // Show loading state
        submitAllEntriesBtn.classList.add('loading');

        // Simulate submission
        setTimeout(() => {
            submitAllEntriesBtn.classList.remove('loading');

            // Add all pending entries to the contracts table
            pendingEntries.forEach(entry => {
                addContractToTable({
                    uploadDate: new Date().toLocaleDateString('en-GB'),
                    uploadedBy: 'Current User',
                    uploadCount: 1,
                    manual: true,
                    data: entry
                });
            });

            showNotification(`Successfully submitted ${pendingEntries.length} entries!`, 'success');

            // Clear pending entries
            pendingEntries = [];
            updatePendingEntriesDisplay();
        }, 2000);
    });
}

function validateAndAddToPending() {
    const data = {
        customerId: document.getElementById('customerId').value,
        customerName: document.getElementById('customerName').value,
        prefix: document.getElementById('prefix').value,
        partNumber: document.getElementById('partNumber').value,
        partDescription: document.getElementById('partDescription').value,
        scale: document.getElementById('scale').value,
        price: document.getElementById('price').value,
        currency: document.getElementById('currency').value,
        manualEffectiveFrom: document.getElementById('manualEffectiveFrom').value,
        manualEffectiveTo: document.getElementById('manualEffectiveTo').value
    };

    // Clear previous error states
    clearFormErrors();

    // Validate required fields
    const requiredFields = ['customerId', 'customerName', 'partNumber', 'partDescription', 'price', 'manualEffectiveFrom', 'manualEffectiveTo'];
    const missingFields = requiredFields.filter(field => !data[field]);

    if (missingFields.length > 0) {
        // Add error styling to missing fields
        missingFields.forEach(fieldId => {
            const fieldElement = document.getElementById(fieldId);
            if (fieldElement) {
                const fieldContainer = fieldElement.closest('.form-field');
                if (fieldContainer) {
                    fieldContainer.classList.add('field-error');
                }
            }
        });

        showNotification('Please fill in all required fields.', 'error');
        return false;
    }

    // Add to pending entries
    pendingEntries.push(data);
    updatePendingEntriesDisplay();
    return true;
}

function clearFormErrors() {
    const errorFields = document.querySelectorAll('.field-error');
    errorFields.forEach(field => {
        field.classList.remove('field-error');
    });
}

function updatePendingEntriesDisplay() {
    const pendingSection = document.getElementById('pendingEntriesSection');
    const pendingList = document.getElementById('pendingList');
    const pendingCount = document.getElementById('pendingCount');

    pendingCount.textContent = pendingEntries.length;

    if (pendingEntries.length === 0) {
        pendingSection.style.display = 'none';
        return;
    }

    pendingSection.style.display = 'block';
    pendingList.innerHTML = '';

    pendingEntries.forEach((entry, index) => {
        const pendingItem = document.createElement('div');
        pendingItem.className = 'pending-item';
        pendingItem.innerHTML = `
            <div class="pending-item-details">
                <div class="pending-item-field">
                    <span class="label">Customer#</span>
                    <span class="value">${entry.customerId}</span>
                </div>
                <div class="pending-item-field">
                    <span class="label">Customer Name</span>
                    <span class="value">${entry.customerName}</span>
                </div>
                <div class="pending-item-field">
                    <span class="label">Part Number</span>
                    <span class="value">${entry.partNumber}</span>
                </div>
                <div class="pending-item-field">
                    <span class="label">Price</span>
                    <span class="value">${entry.price} ${entry.currency}</span>
                </div>
                <div class="pending-item-field">
                    <span class="label">Effective Period</span>
                    <span class="value">${entry.manualEffectiveFrom} to ${entry.manualEffectiveTo}</span>
                </div>
            </div>
            <div class="pending-item-actions">
                <button class="mdc-icon-button" onclick="editPendingEntry(${index})" title="Edit">
                    <span class="material-icons">edit</span>
                </button>
                <button class="mdc-icon-button" onclick="removePendingEntry(${index})" title="Remove">
                    <span class="material-icons">delete</span>
                </button>
            </div>
        `;
        pendingList.appendChild(pendingItem);

        // Initialize ripple effects for new buttons
        const iconButtons = pendingItem.querySelectorAll('.mdc-icon-button');
        iconButtons.forEach(iconButton => {
            const ripple = mdc.ripple.MDCRipple.attachTo(iconButton);
            ripple.unbounded = true;
        });
    });
}

function editPendingEntry(index) {
    const entry = pendingEntries[index];

    // Populate form with entry data
    document.getElementById('customerId').value = entry.customerId;
    document.getElementById('customerName').value = entry.customerName;
    document.getElementById('prefix').value = entry.prefix;
    document.getElementById('partNumber').value = entry.partNumber;
    document.getElementById('partDescription').value = entry.partDescription;
    document.getElementById('scale').value = entry.scale;
    document.getElementById('price').value = entry.price;
    document.getElementById('currency').value = entry.currency;
    document.getElementById('manualEffectiveFrom').value = entry.manualEffectiveFrom;
    document.getElementById('manualEffectiveTo').value = entry.manualEffectiveTo;

    // Remove from pending entries
    pendingEntries.splice(index, 1);
    updatePendingEntriesDisplay();

    showNotification('Entry loaded for editing.', 'info');
}

function removePendingEntry(index) {
    pendingEntries.splice(index, 1);
    updatePendingEntriesDisplay();
    showNotification('Entry removed from pending list.', 'info');
}

function clearFormFields() {
    document.getElementById('customerId').value = '';
    document.getElementById('customerName').value = '';
    document.getElementById('prefix').value = '';
    document.getElementById('partNumber').value = '';
    document.getElementById('partDescription').value = '';
    document.getElementById('scale').value = '';
    document.getElementById('price').value = '';
    document.getElementById('currency').value = 'USD';
    document.getElementById('manualEffectiveFrom').value = '';
    document.getElementById('manualEffectiveTo').value = '';

    // Clear any error states
    clearFormErrors();
}

// Form Handling
function initializeFormHandling() {
    const form = document.getElementById('manualEntryForm');
    const clearButton = document.getElementById('clearForm');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data manually for better control
        const data = {
            customerId: document.getElementById('customerId').value,
            customerName: document.getElementById('customerName').value,
            prefix: document.getElementById('prefix').value,
            partNumber: document.getElementById('partNumber').value,
            partDescription: document.getElementById('partDescription').value,
            scale: document.getElementById('scale').value,
            price: document.getElementById('price').value,
            currency: document.getElementById('currency').value,
            manualEffectiveFrom: document.getElementById('manualEffectiveFrom').value,
            manualEffectiveTo: document.getElementById('manualEffectiveTo').value
        };

        // Clear previous error states
        clearFormErrors();

        // Validate required fields
        const requiredFields = ['customerId', 'customerName', 'partNumber', 'partDescription', 'price', 'manualEffectiveFrom', 'manualEffectiveTo'];
        const missingFields = requiredFields.filter(field => !data[field]);

        if (missingFields.length > 0) {
            // Add error styling to missing fields
            missingFields.forEach(fieldId => {
                const fieldElement = document.getElementById(fieldId);
                if (fieldElement) {
                    const fieldContainer = fieldElement.closest('.form-field');
                    if (fieldContainer) {
                        fieldContainer.classList.add('field-error');
                    }
                }
            });

            showNotification('Please fill in all required fields.', 'error');
            return;
        }

        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.classList.add('loading');

        // Simulate form submission
        setTimeout(() => {
            submitButton.classList.remove('loading');
            showNotification('Contract entry added successfully!', 'success');

            // Add to contracts table
            addContractToTable({
                uploadDate: new Date().toLocaleDateString('en-GB'),
                uploadedBy: 'Current User',
                uploadCount: 1,
                manual: true,
                data: data
            });

            // Clear form
            clearFormFields();
        }, 1500);
    });

    clearButton.addEventListener('click', () => {
        clearFormFields();
        clearFormErrors();
        showNotification('Form cleared.', 'info');
    });

    // Add input event listeners to clear error states when user starts typing
    const formInputs = form.querySelectorAll('.modern-input, .modern-select, .modern-date, .modern-textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', () => {
            const fieldContainer = input.closest('.form-field');
            if (fieldContainer && fieldContainer.classList.contains('field-error')) {
                fieldContainer.classList.remove('field-error');
            }
        });
    });
}

// Search Functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const tableRows = document.querySelectorAll('#contractsTableBody tr');

        tableRows.forEach(row => {
            const text = row.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                row.style.display = '';
                row.classList.add('fade-in');
            } else {
                row.style.display = 'none';
                row.classList.remove('fade-in');
            }
        });
    });
}

// Grid Export Functionality
function initializeGridExport() {
    const exportGridBtn = document.getElementById('exportGridBtn');

    exportGridBtn.addEventListener('click', () => {
        const table = document.getElementById('contractsTable');
        const rows = table.querySelectorAll('tbody tr');
        const visibleRows = Array.from(rows).filter(row => row.style.display !== 'none');

        if (visibleRows.length === 0) {
            showNotification('No data to export.', 'error');
            return;
        }

        // Create CSV data
        const csvData = [];

        // Add headers
        csvData.push(['Upload Date', 'Uploaded By', 'Upload Count']);

        // Add visible row data
        visibleRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            // Skip View and Export columns (first two), get the data columns
            const rowData = [
                cells[2].textContent.trim(), // Upload Date
                cells[3].textContent.trim(), // Uploaded By
                cells[4].textContent.trim()  // Upload Count
            ];
            csvData.push(rowData);
        });

        // Convert to CSV string
        const csvContent = csvData.map(row => row.join(',')).join('\n');

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `contracts_grid_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showNotification(`Grid exported successfully! ${visibleRows.length} records exported.`, 'success');
    });
}

// Header Icons Functionality
function initializeHeaderIcons() {
    const languageBtn = document.getElementById('languageBtn');
    const notificationsBtn = document.getElementById('notificationsBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const profileBtn = document.getElementById('profileBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    // Add ripple effects to all header icon buttons
    const headerIconBtns = document.querySelectorAll('.header-icon-btn');
    headerIconBtns.forEach(btn => {
        const ripple = mdc.ripple.MDCRipple.attachTo(btn);
        ripple.unbounded = true;
    });

    languageBtn.addEventListener('click', () => {
        showNotification('Language settings opened.', 'info');
    });

    notificationsBtn.addEventListener('click', () => {
        showNotification('Notifications panel opened.', 'info');
    });

    settingsBtn.addEventListener('click', () => {
        showNotification('Settings panel opened.', 'info');
    });

    profileBtn.addEventListener('click', () => {
        showNotification('Profile settings opened.', 'info');
    });

    logoutBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to logout?')) {
            showNotification('Logging out...', 'info');
            setTimeout(() => {
                showNotification('Logged out successfully.', 'success');
            }, 1500);
        }
    });
}

// Modal Management
function initializeModal() {
    const modal = document.getElementById('contractModal');
    const closeModal = document.getElementById('closeModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const exportContractBtn = document.getElementById('exportContractBtn');
    const exportModalBtn = document.getElementById('exportModalBtn');

    // Close modal handlers
    closeModal.addEventListener('click', hideModal);
    closeModalBtn.addEventListener('click', hideModal);

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });

    // ESC key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            hideModal();
        }
    });

    // Export contract functionality - Footer button
    exportContractBtn.addEventListener('click', () => {
        const contractData = getCurrentModalData();
        exportContractFromModal(contractData);
        showNotification('Contract exported successfully!', 'success');
    });

    // Export contract functionality - Header icon
    exportModalBtn.addEventListener('click', () => {
        const contractData = getCurrentModalData();
        exportContractFromModal(contractData);
        showNotification('Contract exported successfully!', 'success');
    });

    // Initialize ripple effects for modal buttons
    const modalButtons = modal.querySelectorAll('.mdc-button');
    modalButtons.forEach(button => {
        mdc.ripple.MDCRipple.attachTo(button);
    });

    const modalIconButtons = modal.querySelectorAll('.modal-close, .modal-icon-btn');
    modalIconButtons.forEach(iconButton => {
        const ripple = mdc.ripple.MDCRipple.attachTo(iconButton);
        ripple.unbounded = true;
    });
}

function getCurrentModalData() {
    return {
        customerId: document.getElementById('modalCustomerId').textContent,
        customerName: document.getElementById('modalCustomerName').textContent,
        companyName: document.getElementById('modalCompanyName').textContent,
        branchName: document.getElementById('modalBranchName').textContent,
        prefix: document.getElementById('modalPrefix').textContent,
        partNumber: document.getElementById('modalPartNumber').textContent,
        partDescription: document.getElementById('modalPartDescription').textContent,
        scale: document.getElementById('modalScale').textContent,
        price: document.getElementById('modalPrice').textContent,
        currency: document.getElementById('modalCurrency').textContent,
        effectiveFrom: document.getElementById('modalEffectiveFrom').textContent,
        effectiveTo: document.getElementById('modalEffectiveTo').textContent,
        uploadDate: document.getElementById('modalUploadDate').textContent,
        uploadedBy: document.getElementById('modalUploadedBy').textContent
    };
}

function exportContractFromModal(contractData) {
    const csvData = [
        ['Field', 'Value'],
        ['Customer#', contractData.customerId],
        ['Customer Name', contractData.customerName],
        ['Company Name', contractData.companyName],
        ['Branch Name', contractData.branchName],
        ['Prefix', contractData.prefix],
        ['Part Number', contractData.partNumber],
        ['Part Description', contractData.partDescription],
        ['Scale', contractData.scale],
        ['Price', contractData.price],
        ['Currency', contractData.currency],
        ['Effective From', contractData.effectiveFrom],
        ['Effective To', contractData.effectiveTo],
        ['Upload Date', contractData.uploadDate],
        ['Uploaded By', contractData.uploadedBy]
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `contract_${contractData.customerId}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function showModal(contractData) {
    const modal = document.getElementById('contractModal');

    // Populate modal with contract data
    document.getElementById('modalCustomerId').textContent = contractData.customerId || '-';
    document.getElementById('modalCustomerName').textContent = contractData.customerName || '-';
    document.getElementById('modalCompanyName').textContent = contractData.companyName || '-';
    document.getElementById('modalBranchName').textContent = contractData.branchName || '-';
    document.getElementById('modalPrefix').textContent = contractData.prefix || '-';
    document.getElementById('modalPartNumber').textContent = contractData.partNumber || '-';
    document.getElementById('modalPartDescription').textContent = contractData.partDescription || '-';
    document.getElementById('modalScale').textContent = contractData.scale || '-';
    document.getElementById('modalPrice').textContent = contractData.price || '-';
    document.getElementById('modalCurrency').textContent = contractData.currency || '-';
    document.getElementById('modalEffectiveFrom').textContent = contractData.effectiveFrom || '-';
    document.getElementById('modalEffectiveTo').textContent = contractData.effectiveTo || '-';
    document.getElementById('modalUploadDate').textContent = contractData.uploadDate || '-';
    document.getElementById('modalUploadedBy').textContent = contractData.uploadedBy || '-';

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function hideModal() {
    const modal = document.getElementById('contractModal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

// Table Management
function addContractToTable(contract) {
    const tableBody = document.getElementById('contractsTableBody');
    const row = document.createElement('tr');
    row.classList.add('slide-up');

    row.innerHTML = `
        <td>
            <button class="mdc-icon-button" onclick="viewContract(this)" title="View Details">
                <span class="material-icons">visibility</span>
            </button>
        </td>
        <td>
            <button class="mdc-icon-button" onclick="exportContract(this)" title="Export Contract">
                <span class="material-icons">download</span>
            </button>
        </td>
        <td>${contract.uploadDate}</td>
        <td>${contract.uploadedBy}</td>
        <td>${contract.uploadCount}</td>
    `;

    // Store contract data for modal display
    row.dataset.contractData = JSON.stringify({
        customerId: contract.data?.customerId || `Customer ${Math.floor(Math.random() * 10000)}`,
        customerName: contract.data?.customerName || 'Sample Customer',
        companyName: contract.data?.companyName || 'Automotive Solutions Ltd.',
        branchName: contract.data?.branchName || 'Main Branch',
        prefix: contract.data?.prefix || 'P',
        partNumber: contract.data?.partNumber || `800378`,
        partDescription: contract.data?.partDescription || 'WIPER BLADE / SERVICE 700MM',
        scale: contract.data?.scale || '150',
        price: contract.data?.price || '150.00',
        currency: contract.data?.currency || 'USD',
        effectiveFrom: contract.data?.manualEffectiveFrom || '16-Mar-22',
        effectiveTo: contract.data?.manualEffectiveTo || '15-Mar-23',
        uploadDate: contract.uploadDate,
        uploadedBy: contract.uploadedBy
    });

    // Insert at the beginning of the table
    tableBody.insertBefore(row, tableBody.firstChild);

    // Initialize ripple effects for new buttons
    const iconButtons = row.querySelectorAll('.mdc-icon-button');
    iconButtons.forEach(iconButton => {
        const ripple = mdc.ripple.MDCRipple.attachTo(iconButton);
        ripple.unbounded = true;
    });
}

function loadSampleData() {
    const sampleData = [
        { uploadDate: '15-Mar-2023', uploadedBy: 'Admin', uploadCount: 1 },
        { uploadDate: '15-Mar-2023', uploadedBy: 'Admin2', uploadCount: 1 },
        { uploadDate: '05-Jul-2022', uploadedBy: 'Admin2', uploadCount: 36 },
        { uploadDate: '26-Jun-2022', uploadedBy: 'Admin2', uploadCount: 706 },
        { uploadDate: '24-Jun-2022', uploadedBy: 'Admin2', uploadCount: 3964 },
        { uploadDate: '29-Apr-2022', uploadedBy: 'Admin2', uploadCount: 1256 },
        { uploadDate: '27-Apr-2022', uploadedBy: 'Admin2', uploadCount: 528 },
        { uploadDate: '22-Apr-2022', uploadedBy: 'Admin2', uploadCount: 2 },
        { uploadDate: '26-Apr-2022', uploadedBy: 'Admin2', uploadCount: 888 },
        { uploadDate: '16-Apr-2022', uploadedBy: 'Admin2', uploadCount: 62 }
    ];

    const tableBody = document.getElementById('contractsTableBody');
    tableBody.innerHTML = ''; // Clear existing sample row

    sampleData.forEach(contract => {
        addContractToTable(contract);
    });
}

// Contract Actions
function viewContract(button) {
    const row = button.closest('tr');
    const contractData = JSON.parse(row.dataset.contractData);

    // Show modal with contract details
    showModal(contractData);
}

function exportContract(button) {
    const row = button.closest('tr');
    const contractData = JSON.parse(row.dataset.contractData);

    // Create CSV data for this specific contract
    const csvData = [
        ['Field', 'Value'],
        ['Customer#', contractData.customerId],
        ['Customer Name', contractData.customerName],
        ['Prefix', contractData.prefix],
        ['Part Number', contractData.partNumber],
        ['Part Description', contractData.partDescription],
        ['Scale', contractData.scale],
        ['Price', contractData.price],
        ['Currency', contractData.currency],
        ['Effective From', contractData.effectiveFrom],
        ['Effective To', contractData.effectiveTo],
        ['Upload Date', contractData.uploadDate],
        ['Uploaded By', contractData.uploadedBy]
    ];

    // Convert to CSV string
    const csvContent = csvData.map(row => row.join(',')).join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `contract_${contractData.customerId}_${contractData.partNumber}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification('Contract exported successfully!', 'success');
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// Header Actions - Export button removed from header

// Add sample manual entry for UI demonstration
function addSampleManualEntry() {
    // Pre-fill the manual entry form with sample data
    setTimeout(() => {
        document.getElementById('customerId').value = 'CUST001';
        document.getElementById('customerName').value = 'Automotive Solutions Ltd.';
        document.getElementById('prefix').value = 'P';
        document.getElementById('partNumber').value = '800378';
        document.getElementById('partDescription').value = 'WIPER BLADE / SERVICE 700MM';
        document.getElementById('scale').value = '150';
        document.getElementById('price').value = '150.00';
        document.getElementById('currency').value = 'USD';
        document.getElementById('manualEffectiveFrom').value = '2024-01-01';
        document.getElementById('manualEffectiveTo').value = '2024-12-31';
    }, 500); // Small delay to ensure form elements are ready
}

// Add fadeOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(-100%);
        }
    }
`;
document.head.appendChild(style);
