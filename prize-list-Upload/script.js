// Price List Manager JavaScript

// Global variables
let priceData = [];
let pendingEntries = [];
let currentTheme = 'light';
let sortField = '';
let sortDirection = 'asc';
let currentManufacturer = '';
let currentEffectiveDate = '';
let currentView = 'grid'; // 'grid' or 'table'
let filteredData = [];
let currentUser = 'Admin User'; // Mock current user
let uploadStats = {
    successful: 0,
    failed: 0,
    total: 0
};

// Grouped view variables
let isGroupedView = false;
let expandedGroups = new Set();
let groupedData = new Map();

// Dashboard analytics variables
let recentActivities = [];
let priceChart = null;
const MAX_ACTIVITIES = 10;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    try {
        initializeTheme();
        initializeEventListeners();
        initializeTabSwitching();
        initializeFileUpload();
        initializeFormHandling();
        initializeSampleData();
        initializeLandingGrid();
        initializeRequiredFields();
        initializeSearchableSelects();
        initializeModal();
        initializeViewToggle();
        initializeFilters();
        initializeGroupToggle();
        initializeDashboardComponents();
    } catch (error) {
        console.error('Error during application initialization:', error);
    }
});

// Sample Data Initialization
function initializeSampleData() {
    const sampleData = [
        {
            id: 1001,
            manufacturer: 'Toyota',
            effectiveFrom: '2024-01-15',
            prefix: 'TOY',
            partNumber: 'TOY-ENG-001',
            supplierPrice: 245.50,
            standardPackingQuantity: 5,
            supplierPartsPrefix: 'SPTY',
            supplierPartsNumber: 'SPTY-ENG-001',
            manufacturerWarranty: 365,
            listPrice: 320.00,
            formulaCostPrice: 285.75,
            mrp: 399.99,
            uploadedBy: 'John Smith',
            uploadDate: '2024-01-15T09:30:00.000Z',
            status: 'success'
        },
        {
            id: 1002,
            manufacturer: 'Toyota',
            effectiveFrom: '2024-01-15',
            prefix: 'TOY',
            partNumber: 'TOY-BRK-002',
            supplierPrice: 89.99,
            standardPackingQuantity: 10,
            supplierPartsPrefix: 'SPTY',
            supplierPartsNumber: 'SPTY-BRK-002',
            manufacturerWarranty: 180,
            listPrice: 125.00,
            formulaCostPrice: 107.50,
            mrp: 159.99,
            uploadedBy: 'John Smith',
            uploadDate: '2024-01-15T09:30:00.000Z',
            status: 'success'
        },
        {
            id: 1003,
            manufacturer: 'Honda',
            effectiveFrom: '2024-01-20',
            prefix: 'HON',
            partNumber: 'HON-TRN-003',
            supplierPrice: 156.75,
            standardPackingQuantity: 8,
            supplierPartsPrefix: 'SPHN',
            supplierPartsNumber: 'SPHN-TRN-003',
            manufacturerWarranty: 270,
            listPrice: 210.00,
            formulaCostPrice: 183.38,
            mrp: 269.99,
            uploadedBy: 'Sarah Johnson',
            uploadDate: '2024-01-20T14:15:00.000Z',
            status: 'success'
        },
        {
            id: 1004,
            manufacturer: 'BMW',
            effectiveFrom: '2024-01-22',
            prefix: 'BMW',
            partNumber: 'BMW-SUS-004',
            supplierPrice: 425.00,
            standardPackingQuantity: 2,
            supplierPartsPrefix: 'SPBM',
            supplierPartsNumber: 'SPBM-SUS-004',
            manufacturerWarranty: 730,
            listPrice: 580.00,
            formulaCostPrice: 502.50,
            mrp: 749.99,
            uploadedBy: 'Mike Wilson',
            uploadDate: '2024-01-22T11:45:00.000Z',
            status: 'success'
        },
        {
            id: 1005,
            manufacturer: 'Ford',
            effectiveFrom: '2024-01-25',
            prefix: 'FRD',
            partNumber: 'FRD-ELC-005',
            supplierPrice: 67.25,
            standardPackingQuantity: 15,
            supplierPartsPrefix: 'SPFD',
            supplierPartsNumber: 'SPFD-ELC-005',
            manufacturerWarranty: 90,
            listPrice: 95.00,
            formulaCostPrice: 81.13,
            mrp: 119.99,
            uploadedBy: 'Emily Davis',
            uploadDate: '2024-01-25T16:20:00.000Z',
            status: 'failed'
        },
        {
            id: 1006,
            manufacturer: 'Mercedes-Benz',
            effectiveFrom: '2024-01-28',
            prefix: 'MBZ',
            partNumber: 'MBZ-INT-006',
            supplierPrice: 189.50,
            standardPackingQuantity: 6,
            supplierPartsPrefix: 'SPMB',
            supplierPartsNumber: 'SPMB-INT-006',
            manufacturerWarranty: 365,
            listPrice: 265.00,
            formulaCostPrice: 227.25,
            mrp: 339.99,
            uploadedBy: 'David Brown',
            uploadDate: '2024-01-28T10:10:00.000Z',
            status: 'success'
        },
        {
            id: 1007,
            manufacturer: 'Audi',
            effectiveFrom: '2024-02-01',
            prefix: 'AUD',
            partNumber: 'AUD-EXH-007',
            supplierPrice: 312.80,
            standardPackingQuantity: 3,
            supplierPartsPrefix: 'SPAD',
            supplierPartsNumber: 'SPAD-EXH-007',
            manufacturerWarranty: 540,
            listPrice: 425.00,
            formulaCostPrice: 368.90,
            mrp: 549.99,
            uploadedBy: 'Lisa Anderson',
            uploadDate: '2024-02-01T13:25:00.000Z',
            status: 'failed'
        },
        {
            id: 1008,
            manufacturer: 'Nissan',
            effectiveFrom: '2024-02-03',
            prefix: 'NIS',
            partNumber: 'NIS-FUL-008',
            supplierPrice: 78.90,
            standardPackingQuantity: 12,
            supplierPartsPrefix: 'SPNS',
            supplierPartsNumber: 'SPNS-FUL-008',
            manufacturerWarranty: 180,
            listPrice: 110.00,
            formulaCostPrice: 94.45,
            mrp: 139.99,
            uploadedBy: 'Robert Taylor',
            uploadDate: '2024-02-03T08:50:00.000Z',
            status: 'success'
        }
    ];

    // Add sample data to prizeData
    priceData.push(...sampleData);

    // Calculate upload statistics
    updateUploadStats();
}

function updateUploadStats() {
    uploadStats.total = priceData.length;
    uploadStats.successful = priceData.filter(item => item.status === 'success').length;
    uploadStats.failed = priceData.filter(item => item.status === 'failed').length;

    // Update the stats display
    updateStatsCards();
}

function updateStatsCards() {
    const totalEntriesCard = document.getElementById('totalEntries');
    const successfulUploadsCard = document.getElementById('successfulUploads');
    const failedUploadsCard = document.getElementById('failedUploads');
    const successRateCard = document.getElementById('successRate');

    if (totalEntriesCard) totalEntriesCard.textContent = uploadStats.total;
    if (successfulUploadsCard) successfulUploadsCard.textContent = uploadStats.successful;
    if (failedUploadsCard) failedUploadsCard.textContent = uploadStats.failed;

    // Calculate and display success rate
    const successRate = uploadStats.total > 0 ? Math.round((uploadStats.successful / uploadStats.total) * 100) : 0;
    if (successRateCard) successRateCard.textContent = `${successRate}%`;

    // Update chart and activity display
    createPriceDistributionChart();
}

// Dashboard Components Initialization
function initializeDashboardComponents() {
    // Initialize chart
    createPriceDistributionChart();

    // Initialize activity display
    updateActivityDisplay();

    // Add event listeners for dashboard actions
    const refreshChartBtn = document.getElementById('refreshChart');
    if (refreshChartBtn) {
        refreshChartBtn.addEventListener('click', () => {
            createPriceDistributionChart();
            addActivity('update', 'Price distribution chart refreshed');
        });
    }

    const clearActivityBtn = document.getElementById('clearActivity');
    if (clearActivityBtn) {
        clearActivityBtn.addEventListener('click', clearAllActivities);
    }

    const viewAllActivityBtn = document.getElementById('viewAllActivity');
    if (viewAllActivityBtn) {
        viewAllActivityBtn.addEventListener('click', () => {
            showNotification('Full activity log feature coming soon!', 'info');
        });
    }

    // Add initial activities for sample data
    if (recentActivities.length === 0) {
        addActivity('upload', 'Sample data loaded successfully (8 items)', 'System');
        addActivity('create', 'Dashboard initialized with analytics', 'System');
    }
}

// Theme Management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    currentTheme = savedTheme || systemTheme;

    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
    showNotification(`Switched to ${currentTheme} theme`, 'success');
}

function updateThemeIcon() {
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = currentTheme === 'light' ? 'dark_mode' : 'light_mode';
    } else {
        console.warn('Theme icon element not found');
    }
}

// Required Fields Management
function initializeRequiredFields() {
    // Get effective date elements
    const uploadEffectiveFrom = document.getElementById('uploadEffectiveFrom');
    const manualEffectiveFrom = document.getElementById('manualEffectiveFrom');
    const chooseFileBtn = document.getElementById('chooseFileBtn');

    // Sync effective date between tabs
    uploadEffectiveFrom.addEventListener('change', function() {
        currentEffectiveDate = this.value;
        manualEffectiveFrom.value = this.value;
        validateRequiredFields();
    });

    manualEffectiveFrom.addEventListener('change', function() {
        currentEffectiveDate = this.value;
        uploadEffectiveFrom.value = this.value;
        validateRequiredFields();
    });

    // Update choose file button click handler
    chooseFileBtn.addEventListener('click', function() {
        if (validateRequiredFields()) {
            document.getElementById('fileInput').click();
        }
    });

    // Initial validation
    validateRequiredFields();
}

function validateRequiredFields() {
    // Check if manufacturer and effective date are properly selected
    const isValid = currentManufacturer && currentManufacturer.trim() !== '' &&
                   currentEffectiveDate && currentEffectiveDate.trim() !== '';

    const chooseFileBtn = document.getElementById('chooseFileBtn');
    const uploadFileBtn = document.getElementById('uploadFileBtn');
    const uploadCategoryPriceBtn = document.getElementById('uploadCategoryPriceBtn');
    const uploadArea = document.getElementById('uploadArea');
    const requirementTexts = document.querySelectorAll('.upload-requirement-text');

    if (isValid) {
        // Enable upload buttons
        chooseFileBtn.disabled = false;
        chooseFileBtn.textContent = 'Choose File';
        uploadFileBtn.disabled = false;
        uploadCategoryPriceBtn.disabled = false;

        // Enable upload area
        uploadArea.classList.remove('disabled');
        uploadArea.style.pointerEvents = 'auto';

        // Hide requirement texts
        requirementTexts.forEach(text => text.style.display = 'none');
    } else {
        // Disable upload buttons
        chooseFileBtn.disabled = true;
        chooseFileBtn.textContent = 'Choose File';
        uploadFileBtn.disabled = true;
        uploadCategoryPriceBtn.disabled = true;

        // Disable upload area
        uploadArea.classList.add('disabled');
        uploadArea.style.pointerEvents = 'none';

        // Show requirement texts
        requirementTexts.forEach(text => text.style.display = 'block');
    }

    return isValid;
}

// Searchable Select Functionality
function initializeSearchableSelects() {
    const searchableSelects = [
        { input: 'uploadManufacturer', dropdown: 'uploadManufacturerDropdown', wrapper: 'uploadManufacturerWrapper' },
        { input: 'manualManufacturer', dropdown: 'manualManufacturerDropdown', wrapper: 'manualManufacturerWrapper' }
    ];

    searchableSelects.forEach(select => {
        initializeSearchableSelect(select.input, select.dropdown, select.wrapper);
    });
}

function initializeSearchableSelect(inputId, dropdownId, wrapperId) {
    const input = document.getElementById(inputId);
    const dropdown = document.getElementById(dropdownId);
    const wrapper = document.getElementById(wrapperId);
    const searchInput = dropdown.querySelector('.searchable-select-search');
    const options = dropdown.querySelectorAll('.searchable-select-option');

    // Toggle dropdown
    input.addEventListener('click', function() {
        closeAllDropdowns();
        wrapper.classList.toggle('open');
        dropdown.classList.toggle('open');
        if (dropdown.classList.contains('open')) {
            searchInput.focus();
        }
    });

    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        options.forEach(option => {
            const text = option.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                option.classList.remove('hidden');
            } else {
                option.classList.add('hidden');
            }
        });
    });

    // Option selection
    options.forEach(option => {
        option.addEventListener('click', function() {
            const value = this.getAttribute('data-value');
            const text = this.textContent;

            input.value = text;
            input.setAttribute('data-value', value);

            // Update current manufacturer and sync across tabs
            if (inputId.includes('Manufacturer')) {
                currentManufacturer = value;
                syncManufacturerSelection(value, text);
                validateRequiredFields();
            }

            // Close dropdown
            wrapper.classList.remove('open');
            dropdown.classList.remove('open');
            searchInput.value = '';
            options.forEach(opt => opt.classList.remove('hidden'));
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!wrapper.contains(e.target)) {
            wrapper.classList.remove('open');
            dropdown.classList.remove('open');
            searchInput.value = '';
            options.forEach(opt => opt.classList.remove('hidden'));
        }
    });

    // Keyboard navigation
    searchInput.addEventListener('keydown', function(e) {
        const visibleOptions = Array.from(options).filter(opt => !opt.classList.contains('hidden'));
        let selectedIndex = visibleOptions.findIndex(opt => opt.classList.contains('selected'));

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (selectedIndex < visibleOptions.length - 1) {
                if (selectedIndex >= 0) visibleOptions[selectedIndex].classList.remove('selected');
                visibleOptions[selectedIndex + 1].classList.add('selected');
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (selectedIndex > 0) {
                visibleOptions[selectedIndex].classList.remove('selected');
                visibleOptions[selectedIndex - 1].classList.add('selected');
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex >= 0) {
                visibleOptions[selectedIndex].click();
            }
        } else if (e.key === 'Escape') {
            wrapper.classList.remove('open');
            dropdown.classList.remove('open');
            searchInput.value = '';
            options.forEach(opt => opt.classList.remove('hidden'));
        }
    });
}

function closeAllDropdowns() {
    document.querySelectorAll('.searchable-select-wrapper').forEach(wrapper => {
        wrapper.classList.remove('open');
    });
    document.querySelectorAll('.searchable-select-dropdown').forEach(dropdown => {
        dropdown.classList.remove('open');
    });
}

function syncManufacturerSelection(value, text) {
    const manufacturerInputs = ['uploadManufacturer', 'manualManufacturer'];

    manufacturerInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            if (value && value.trim() !== '') {
                input.value = text;
                input.setAttribute('data-value', value);
            } else {
                input.value = '';
                input.placeholder = 'Select Manufacturer';
                input.setAttribute('data-value', '');
            }
        }
    });
}

// Event Listeners
function initializeEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Header utility buttons (placeholder functionality)
    const languageBtn = document.getElementById('languageBtn');
    if (languageBtn) {
        languageBtn.addEventListener('click', () => showNotification('Language settings clicked'));
    }

    const notificationsBtn = document.getElementById('notificationsBtn');
    if (notificationsBtn) {
        notificationsBtn.addEventListener('click', () => showNotification('Notifications clicked'));
    }

    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => showNotification('Settings clicked'));
    }

    const profileBtn = document.getElementById('profileBtn');
    if (profileBtn) {
        profileBtn.addEventListener('click', () => showNotification('Profile clicked'));
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => showNotification('Logout clicked'));
    }

    // Download template
    const downloadTemplateBtn = document.getElementById('downloadTemplate');
    if (downloadTemplateBtn) {
        downloadTemplateBtn.addEventListener('click', downloadTemplate);
    }

    // Upload File button
    const uploadFileBtn = document.getElementById('uploadFileBtn');
    if (uploadFileBtn) {
        uploadFileBtn.addEventListener('click', function() {
            if (validateRequiredFields()) {
                document.getElementById('fileInput').click();
            }
        });
    }

    // Upload Price Using Parts Category Definition button
    const uploadCategoryPriceBtn = document.getElementById('uploadCategoryPriceBtn');
    if (uploadCategoryPriceBtn) {
        uploadCategoryPriceBtn.addEventListener('click', function() {
            if (validateRequiredFields()) {
                showNotification('Category-based price upload functionality coming soon!', 'success');
                // TODO: Implement category-based upload workflow
            }
        });
    }

    // Data grid actions
    const exportDataBtn = document.getElementById('exportDataBtn');
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', exportData);
    }

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
}

// Tab Switching
function initializeTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Update active tab content
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(`${targetTab}-tab`).classList.add('active');
        });
    });
}

// File Upload
function initializeFileUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');

    // Drag and drop
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);

    // File input change
    fileInput.addEventListener('change', handleFileSelect);
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
        processFile(files[0]);
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        processFile(file);
    }
}

function processFile(file) {
    if (!validateRequiredFields()) {
        showNotification('Please select manufacturer and effective date first.', 'error');
        return;
    }

    showNotification('Processing file...');

    // Simulate file processing with mock data
    setTimeout(() => {
        const currentTime = new Date().toISOString();
        const mockData = [
            {
                id: Date.now() + 1,
                manufacturer: currentManufacturer,
                effectiveFrom: currentEffectiveDate,
                prefix: 'PFX',
                partNumber: 'PN001',
                supplierPrice: 150.00,
                standardPackingQuantity: 10,
                supplierPartsPrefix: 'SPP',
                supplierPartsNumber: 'SPN001',
                manufacturerWarranty: 365,
                listPrice: 200.00,
                formulaCostPrice: 175.00,
                mrp: 250.00,
                uploadedBy: currentUser,
                uploadDate: currentTime
            },
            {
                id: Date.now() + 2,
                manufacturer: currentManufacturer,
                effectiveFrom: currentEffectiveDate,
                prefix: 'PFX',
                partNumber: 'PN002',
                supplierPrice: 75.50,
                standardPackingQuantity: 25,
                supplierPartsPrefix: 'SPP',
                supplierPartsNumber: 'SPN002',
                manufacturerWarranty: 180,
                listPrice: 100.00,
                formulaCostPrice: 87.75,
                mrp: 125.00,
                uploadedBy: currentUser,
                uploadDate: currentTime
            }
        ];

        priceData.push(...mockData);
        updateUploadStats();
        updateLandingGrid();
        showNotification(`File processed successfully! Added ${mockData.length} entries.`);
    }, 1000);
}

// Form Handling
function initializeFormHandling() {
    const form = document.getElementById('manualEntryForm');
    const clearBtn = document.getElementById('clearForm');
    const addContinueBtn = document.getElementById('addAndContinue');
    const clearAllPendingBtn = document.getElementById('clearAllPending');
    const submitAllBtn = document.getElementById('submitAllEntries');

    form.addEventListener('submit', handleFormSubmit);
    clearBtn.addEventListener('click', clearForm);
    addContinueBtn.addEventListener('click', addAndContinue);
    clearAllPendingBtn.addEventListener('click', clearAllPending);
    submitAllBtn.addEventListener('click', submitAllEntries);
}

function handleFormSubmit(e) {
    e.preventDefault();

    if (validateForm()) {
        const entry = getFormData();
        priceData.push(entry);
        updateUploadStats();
        updateLandingGrid();
        clearForm();
        showNotification('Entry added successfully!');
    }
}

function addAndContinue() {
    if (validateForm()) {
        const entry = getFormData();
        pendingEntries.push(entry);
        updatePendingEntries();
        clearForm();
        showNotification('Entry added to pending list!');
    }
}

function validateForm() {
    // First check required fields (manufacturer and effective date)
    if (!validateRequiredFields()) {
        showNotification('Please select manufacturer and effective date first.', 'error');
        return false;
    }

    const requiredFields = ['partNumber', 'supplierPrice', 'listPrice', 'mrp'];
    let isValid = true;

    // Clear previous errors
    document.querySelectorAll('.field-error').forEach(field => {
        field.classList.remove('field-error');
    });

    // Validate manufacturer and effective date fields
    const manualManufacturer = document.getElementById('manualManufacturer');
    const manualEffectiveFrom = document.getElementById('manualEffectiveFrom');

    if (!manualManufacturer.value || manualManufacturer.value.trim() === '' ||
        manualManufacturer.value === 'Select Manufacturer') {
        manualManufacturer.closest('.form-field').classList.add('field-error');
        isValid = false;
    }

    if (!manualEffectiveFrom.value || manualEffectiveFrom.value.trim() === '') {
        manualEffectiveFrom.closest('.form-field').classList.add('field-error');
        isValid = false;
    }

    // Validate other required fields
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        const value = field.value.trim();

        if (!value || (field.type === 'number' && parseFloat(value) <= 0)) {
            field.closest('.form-field').classList.add('field-error');
            isValid = false;
        }
    });

    if (!isValid) {
        showNotification('Please fill in all required fields with valid values.', 'error');
    }

    return isValid;
}

function getFormData() {
    return {
        id: Date.now(),
        manufacturer: currentManufacturer,
        effectiveFrom: currentEffectiveDate,
        prefix: document.getElementById('prefix').value.trim(),
        partNumber: document.getElementById('partNumber').value.trim(),
        supplierPrice: parseFloat(document.getElementById('supplierPrice').value) || 0,
        standardPackingQuantity: parseInt(document.getElementById('standardPackingQuantity').value) || 0,
        supplierPartsPrefix: document.getElementById('supplierPartsPrefix').value.trim(),
        supplierPartsNumber: document.getElementById('supplierPartsNumber').value.trim(),
        manufacturerWarranty: parseInt(document.getElementById('manufacturerWarranty').value) || 0,
        listPrice: parseFloat(document.getElementById('listPrice').value) || 0,
        formulaCostPrice: parseFloat(document.getElementById('formulaCostPrice').value) || 0,
        mrp: parseFloat(document.getElementById('mrp').value) || 0,
        uploadedBy: currentUser,
        uploadDate: new Date().toISOString(),
        status: 'success' // Manual entries are always successful
    };
}

function clearForm() {
    document.getElementById('manualEntryForm').reset();
    document.querySelectorAll('.field-error').forEach(field => {
        field.classList.remove('field-error');
    });
}

function updatePendingEntries() {
    const pendingSection = document.getElementById('pendingEntriesSection');
    const pendingTableBody = document.getElementById('pendingTableBody');
    const pendingCount = document.getElementById('pendingCount');

    if (pendingEntries.length > 0) {
        pendingSection.style.display = 'block';
        pendingCount.textContent = pendingEntries.length;

        pendingTableBody.innerHTML = pendingEntries.map((entry, index) => `
            <tr data-index="${index}">
                <td class="actions-cell">
                    <button class="action-btn edit-btn" onclick="editPendingEntry(${index})" title="Edit Entry">
                        <span class="material-icons">edit</span>
                    </button>
                    <button class="action-btn delete-btn" onclick="deletePendingEntry(${index})" title="Delete Entry">
                        <span class="material-icons">delete</span>
                    </button>
                </td>
                <td class="manufacturer">${entry.manufacturer || '-'}</td>
                <td>${entry.effectiveFrom || '-'}</td>
                <td>${entry.prefix || '-'}</td>
                <td class="part-number">${entry.partNumber}</td>
                <td class="currency">$${entry.supplierPrice.toFixed(2)}</td>
                <td>${entry.standardPackingQuantity || '-'}</td>
                <td>${entry.supplierPartsPrefix || '-'}</td>
                <td>${entry.supplierPartsNumber || '-'}</td>
                <td>${entry.manufacturerWarranty || '-'}</td>
                <td class="currency">$${entry.listPrice.toFixed(2)}</td>
                <td class="currency">${entry.formulaCostPrice ? '$' + entry.formulaCostPrice.toFixed(2) : '-'}</td>
                <td class="currency">$${entry.mrp.toFixed(2)}</td>
            </tr>
        `).join('');
    } else {
        pendingSection.style.display = 'none';
    }
}

function clearAllPending() {
    pendingEntries = [];
    updatePendingEntries();
    showNotification('All pending entries cleared.');
}

function submitAllEntries() {
    if (pendingEntries.length > 0) {
        priceData.push(...pendingEntries);
        const count = pendingEntries.length;
        pendingEntries = [];
        updatePendingEntries();
        updateUploadStats();
        updateLandingGrid();
        showNotification(`${count} entries submitted successfully!`);
    }
}

function editPendingEntry(index) {
    if (index >= 0 && index < pendingEntries.length) {
        const entry = pendingEntries[index];

        // Populate form with entry data
        document.getElementById('prefix').value = entry.prefix || '';
        document.getElementById('partNumber').value = entry.partNumber || '';
        document.getElementById('supplierPrice').value = entry.supplierPrice || '';
        document.getElementById('standardPackingQuantity').value = entry.standardPackingQuantity || '';
        document.getElementById('supplierPartsPrefix').value = entry.supplierPartsPrefix || '';
        document.getElementById('supplierPartsNumber').value = entry.supplierPartsNumber || '';
        document.getElementById('manufacturerWarranty').value = entry.manufacturerWarranty || '';
        document.getElementById('listPrice').value = entry.listPrice || '';
        document.getElementById('formulaCostPrice').value = entry.formulaCostPrice || '';
        document.getElementById('mrp').value = entry.mrp || '';

        // Remove the entry from pending list
        pendingEntries.splice(index, 1);
        updatePendingEntries();

        // Scroll to form
        document.getElementById('manualEntryForm').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        showNotification('Entry loaded for editing. Make your changes and click "Add & Continue" or "Add Entry".');
    }
}

function deletePendingEntry(index) {
    if (index >= 0 && index < pendingEntries.length) {
        const entry = pendingEntries[index];

        if (confirm(`Are you sure you want to delete the entry for "${entry.partNumber}"?`)) {
            pendingEntries.splice(index, 1);
            updatePendingEntries();
            showNotification('Entry deleted successfully.');
        }
    }
}

// Grouping Functions
function createGroupKey(manufacturer, effectiveDate) {
    return `${manufacturer}|${effectiveDate}`;
}

function groupDataByManufacturerAndDate(data) {
    const groups = new Map();

    data.forEach(item => {
        const key = createGroupKey(item.manufacturer, item.effectiveFrom);
        if (!groups.has(key)) {
            groups.set(key, []);
        }
        groups.get(key).push(item);
    });

    return groups;
}

function calculateGroupStats(items) {
    const totalValue = items.reduce((sum, item) => sum + (item.listPrice || 0), 0);
    const avgPrice = items.length > 0 ? totalValue / items.length : 0;
    const minPrice = items.length > 0 ? Math.min(...items.map(item => item.listPrice || 0)) : 0;
    const maxPrice = items.length > 0 ? Math.max(...items.map(item => item.listPrice || 0)) : 0;
    const successCount = items.filter(item => item.status === 'success').length;
    const failedCount = items.length - successCount;

    return {
        totalItems: items.length,
        totalValue,
        avgPrice,
        minPrice,
        maxPrice,
        successCount,
        failedCount,
        successRate: items.length > 0 ? (successCount / items.length) * 100 : 0
    };
}

function getManufacturerIcon(manufacturer) {
    if (!manufacturer) return 'business';
    return manufacturer.substring(0, 2).toUpperCase();
}

function getGroupStatus(items) {
    const now = new Date();
    const effectiveDate = new Date(items[0]?.effectiveFrom);
    return effectiveDate <= now ? 'active' : 'inactive';
}

function formatGroupDate(dateString) {
    if (!dateString) return 'No Date';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function toggleGroupedView() {
    isGroupedView = !isGroupedView;
    const groupToggle = document.getElementById('groupToggle');

    if (isGroupedView) {
        groupToggle.classList.add('active');
        groupToggle.querySelector('span:last-child').textContent = 'List View';
        groupToggle.querySelector('.material-icons').textContent = 'view_list';
    } else {
        groupToggle.classList.remove('active');
        groupToggle.querySelector('span:last-child').textContent = 'Grouped View';
        groupToggle.querySelector('.material-icons').textContent = 'view_module';
        expandedGroups.clear();
    }

    updateLandingGrid();
}

function toggleGroupExpansion(groupKey) {
    if (expandedGroups.has(groupKey)) {
        expandedGroups.delete(groupKey);
    } else {
        expandedGroups.add(groupKey);
    }

    const groupCard = document.querySelector(`[data-group-key="${groupKey}"]`);
    const expandedContent = groupCard.querySelector('.group-expanded-content');
    const groupSummaryCard = groupCard.querySelector('.group-summary-card');

    if (expandedGroups.has(groupKey)) {
        groupSummaryCard.classList.add('expanded');
        expandedContent.classList.add('expanded');

        // Show loading state
        expandedContent.innerHTML = `
            <div class="group-loading">
                <span class="material-icons">refresh</span>
                Loading group details...
            </div>
        `;

        // Simulate loading delay for smooth animation
        setTimeout(() => {
            renderGroupExpandedContent(groupKey, groupedData.get(groupKey));
        }, 300);
    } else {
        groupSummaryCard.classList.remove('expanded');
        expandedContent.classList.remove('expanded');
    }
}

function expandAllGroups() {
    groupedData.forEach((items, groupKey) => {
        expandedGroups.add(groupKey);
    });
    updateLandingGrid();
}

function collapseAllGroups() {
    expandedGroups.clear();
    updateLandingGrid();
}

// Landing Grid
function initializeLandingGrid() {
    // Add click listeners to sortable headers
    document.querySelectorAll('[data-sort]').forEach(header => {
        header.addEventListener('click', () => {
            const field = header.getAttribute('data-sort');
            handleSort(field);
        });
    });

    // Initialize the grid display
    updateLandingGrid();
}

// Modal functionality
function initializeModal() {
    const addNewBtn = document.getElementById('addNewBtn');
    const modal = document.getElementById('addNewModal');
    const closeBtn = document.getElementById('closeAddNewModal');
    const manualEntryOption = document.getElementById('manualEntryOption');
    const uploadFileOption = document.getElementById('uploadFileOption');

    // Open modal
    addNewBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });

    // Close modal
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Handle option selections
    manualEntryOption.addEventListener('click', () => {
        closeModal();
        // Switch to manual entry tab
        document.querySelector('[data-tab="manual"]').click();
        // Scroll to manual entry form
        document.getElementById('manual-tab').scrollIntoView({ behavior: 'smooth' });
    });

    uploadFileOption.addEventListener('click', () => {
        closeModal();
        // Switch to upload tab
        document.querySelector('[data-tab="upload"]').click();
        // Scroll to upload section
        document.getElementById('upload-tab').scrollIntoView({ behavior: 'smooth' });
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeModal();
        }
    });
}

function closeModal() {
    const modal = document.getElementById('addNewModal');
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

// View toggle functionality
function initializeViewToggle() {
    const viewBtns = document.querySelectorAll('.view-btn');

    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.getAttribute('data-view');
            switchView(view);
        });
    });
}

function switchView(view) {
    currentView = view;

    // Update button states
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-view="${view}"]`).classList.add('active');

    // Show/hide appropriate containers
    const gridContainer = document.getElementById('dataGridContainer');
    const tableContainer = document.getElementById('dataTableContainer');

    if (view === 'grid') {
        gridContainer.style.display = 'block';
        tableContainer.style.display = 'none';
    } else {
        gridContainer.style.display = 'none';
        tableContainer.style.display = 'block';
    }

    // Update the display
    updateLandingGrid();
}

// Filter functionality
function initializeFilters() {
    const manufacturerFilter = document.getElementById('manufacturerFilter');
    const dateRangeFilter = document.getElementById('dateRangeFilter');

    manufacturerFilter.addEventListener('change', applyFilters);
    dateRangeFilter.addEventListener('change', applyFilters);

    // Populate manufacturer filter options
    updateManufacturerFilter();
}

function updateManufacturerFilter() {
    const manufacturerFilter = document.getElementById('manufacturerFilter');
    const manufacturers = [...new Set(priceData.map(item => item.manufacturer))];

    // Clear existing options except "All Manufacturers"
    manufacturerFilter.innerHTML = '<option value="">All Manufacturers</option>';

    manufacturers.forEach(manufacturer => {
        if (manufacturer) {
            const option = document.createElement('option');
            option.value = manufacturer;
            option.textContent = manufacturer;
            manufacturerFilter.appendChild(option);
        }
    });
}

function applyFilters() {
    const manufacturerFilter = document.getElementById('manufacturerFilter').value;
    const dateRangeFilter = document.getElementById('dateRangeFilter').value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    filteredData = priceData.filter(item => {
        // Manufacturer filter
        if (manufacturerFilter && item.manufacturer !== manufacturerFilter) {
            return false;
        }

        // Date range filter
        if (dateRangeFilter) {
            const itemDate = new Date(item.uploadDate || item.effectiveFrom);
            const now = new Date();

            switch (dateRangeFilter) {
                case 'today':
                    if (itemDate.toDateString() !== now.toDateString()) return false;
                    break;
                case 'week':
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    if (itemDate < weekAgo) return false;
                    break;
                case 'month':
                    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                    if (itemDate < monthAgo) return false;
                    break;
                case 'year':
                    const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
                    if (itemDate < yearAgo) return false;
                    break;
            }
        }

        // Search filter
        if (searchTerm) {
            const searchableText = Object.values(item).join(' ').toLowerCase();
            if (!searchableText.includes(searchTerm)) return false;
        }

        return true;
    });

    updateLandingGrid();
}

function handleSort(field) {
    if (sortField === field) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortField = field;
        sortDirection = 'asc';
    }

    updateLandingGrid();
}

function handleSearch() {
    applyFilters();
}

function updateLandingGrid() {
    // Use filtered data if filters are applied, otherwise use all data
    const dataToDisplay = filteredData.length > 0 || hasActiveFilters() ? filteredData : priceData;

    // Sort data
    let sortedData = [...dataToDisplay];
    if (sortField) {
        sortedData.sort((a, b) => {
            const aValue = a[sortField];
            const bValue = b[sortField];

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
            }

            const aStr = aValue.toString().toLowerCase();
            const bStr = bValue.toString().toLowerCase();

            if (sortDirection === 'asc') {
                return aStr.localeCompare(bStr);
            } else {
                return bStr.localeCompare(aStr);
            }
        });
    }

    // Update entry count
    const entryCount = document.getElementById('entryCount');
    entryCount.textContent = sortedData.length;

    // Show/hide empty state
    const emptyState = document.getElementById('emptyState');
    const dataGrid = document.getElementById('dataGrid');
    const dataTableBody = document.getElementById('dataTableBody');

    if (sortedData.length === 0) {
        emptyState.style.display = 'block';
        dataGrid.innerHTML = '';
        dataTableBody.innerHTML = '';
    } else {
        emptyState.style.display = 'none';

        if (isGroupedView) {
            groupedData = groupDataByManufacturerAndDate(sortedData);
            renderGroupedView();
        } else {
            if (currentView === 'grid') {
                renderGridView(sortedData);
            } else {
                renderTableView(sortedData);
            }
        }
    }

    // Update sort indicators for table headers
    document.querySelectorAll('[data-sort]').forEach(header => {
        const field = header.getAttribute('data-sort');
        const indicator = field === sortField ? (sortDirection === 'asc' ? ' ↑' : ' ↓') : '';
        header.textContent = header.textContent.replace(/ [↑↓]?$/, '') + indicator;
    });

    // Update manufacturer filter options
    updateManufacturerFilter();
}

function hasActiveFilters() {
    const manufacturerFilter = document.getElementById('manufacturerFilter').value;
    const dateRangeFilter = document.getElementById('dateRangeFilter').value;
    const searchTerm = document.getElementById('searchInput').value;

    return manufacturerFilter || dateRangeFilter || searchTerm;
}

function renderGroupedView() {
    const dataGrid = document.getElementById('dataGrid');
    const dataTableContainer = document.getElementById('dataTableContainer');

    // Hide table view when in grouped mode
    if (dataTableContainer) {
        dataTableContainer.style.display = 'none';
    }

    if (!dataGrid) return;

    // Render group summary cards
    const groupCardsHtml = Array.from(groupedData.entries()).map(([groupKey, items]) => {
        return renderGroupSummaryCard(groupKey, items);
    }).join('');

    dataGrid.innerHTML = groupCardsHtml;
}

function renderGroupSummaryCard(groupKey, items) {
    const [manufacturer, effectiveDate] = groupKey.split('|');
    const stats = calculateGroupStats(items);
    const status = getGroupStatus(items);
    const isExpanded = expandedGroups.has(groupKey);
    const manufacturerIcon = getManufacturerIcon(manufacturer);
    const formattedDate = formatGroupDate(effectiveDate);

    return `
        <div class="group-container" data-group-key="${groupKey}">
            <div class="group-summary-card status-${status} ${isExpanded ? 'expanded' : ''}"
                 onclick="toggleGroupExpansion('${groupKey}')">
                <div class="group-card-header">
                    <div class="group-card-main-info">
                        <div class="group-manufacturer">
                            <div class="manufacturer-icon">${manufacturerIcon}</div>
                            <div>
                                <h3 class="manufacturer-name">${manufacturer}</h3>
                                <div class="effective-date">
                                    <span class="material-icons">calendar_today</span>
                                    Effective: ${formattedDate}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="group-card-badges">
                        <div class="record-count-badge">${stats.totalItems} items</div>
                        <div class="status-indicator ${status}">
                            <span class="material-icons">${status === 'active' ? 'check_circle' : 'schedule'}</span>
                            ${status.toUpperCase()}
                        </div>
                    </div>
                </div>

                <div class="group-card-stats">
                    <div class="group-stat">
                        <div class="group-stat-value">$${stats.totalValue.toFixed(2)}</div>
                        <div class="group-stat-label">Total Value</div>
                    </div>
                    <div class="group-stat">
                        <div class="group-stat-value">$${stats.avgPrice.toFixed(2)}</div>
                        <div class="group-stat-label">Avg Price</div>
                    </div>
                    <div class="group-stat">
                        <div class="group-stat-value">${stats.successRate.toFixed(1)}%</div>
                        <div class="group-stat-label">Success Rate</div>
                    </div>
                    <div class="group-stat">
                        <div class="group-stat-value">${stats.successCount}/${stats.totalItems}</div>
                        <div class="group-stat-label">Success/Total</div>
                    </div>
                </div>

                <div class="group-card-footer">
                    <div class="group-meta">
                        <div class="group-meta-item">
                            <span class="material-icons">person</span>
                            ${items[0]?.uploadedBy || 'Unknown'}
                        </div>
                        <div class="group-meta-item">
                            <span class="material-icons">schedule</span>
                            ${formatDate(items[0]?.uploadDate)}
                        </div>
                    </div>
                    <div class="expand-indicator">
                        <span>${isExpanded ? 'Collapse' : 'Expand'}</span>
                        <span class="material-icons">expand_more</span>
                    </div>
                </div>
            </div>

            <div class="group-expanded-content ${isExpanded ? 'expanded' : ''}">
                ${isExpanded ? renderGroupExpandedContentHtml(groupKey, items) : ''}
            </div>
        </div>
    `;
}

function renderGroupExpandedContent(groupKey, items) {
    const expandedContent = document.querySelector(`[data-group-key="${groupKey}"] .group-expanded-content`);
    if (expandedContent) {
        expandedContent.innerHTML = renderGroupExpandedContentHtml(groupKey, items);
    }
}

function renderGroupExpandedContentHtml(groupKey, items) {
    const [manufacturer, effectiveDate] = groupKey.split('|');

    return `
        <div class="group-content-header">
            <h4 class="group-content-title">${manufacturer} - ${formatGroupDate(effectiveDate)} (${items.length} items)</h4>
            <div class="group-actions">
                <button class="group-action-btn" onclick="editGroupItems('${groupKey}')">
                    <span class="material-icons">edit</span>
                    Edit All
                </button>
                <button class="group-action-btn" onclick="exportGroupData('${groupKey}')">
                    <span class="material-icons">download</span>
                    Export
                </button>
                <button class="group-action-btn danger" onclick="deleteGroup('${groupKey}')">
                    <span class="material-icons">delete</span>
                    Delete Group
                </button>
            </div>
        </div>

        <div class="group-items-grid">
            ${items.map(item => renderGroupItem(item)).join('')}
        </div>
    `;
}

function renderGroupItem(item) {
    return `
        <div class="group-item" data-id="${item.id}">
            <div class="group-item-header">
                <h5 class="group-item-title">${item.partNumber}</h5>
                <div class="group-item-actions">
                    <button class="group-item-action" onclick="editGridItem(${item.id})" title="Edit">
                        <span class="material-icons">edit</span>
                    </button>
                    <button class="group-item-action" onclick="deleteGridItem(${item.id})" title="Delete">
                        <span class="material-icons">delete</span>
                    </button>
                </div>
            </div>
            <div class="group-item-content">
                <div class="group-item-field">
                    <span class="group-item-label">Supplier Price</span>
                    <span class="group-item-value currency">$${item.supplierPrice.toFixed(2)}</span>
                </div>
                <div class="group-item-field">
                    <span class="group-item-label">List Price</span>
                    <span class="group-item-value currency">$${item.listPrice.toFixed(2)}</span>
                </div>
                <div class="group-item-field">
                    <span class="group-item-label">MRP</span>
                    <span class="group-item-value currency">$${item.mrp.toFixed(2)}</span>
                </div>
                <div class="group-item-field">
                    <span class="group-item-label">Status</span>
                    <span class="group-item-value ${item.status}">${item.status === 'success' ? 'Success' : 'Failed'}</span>
                </div>
            </div>
        </div>
    `;
}

// Group Action Functions
function editGroupItems(groupKey) {
    const items = groupedData.get(groupKey);
    if (items && items.length > 0) {
        showNotification(`Editing ${items.length} items in group. Feature coming soon!`, 'info');
    }
}

function exportGroupData(groupKey) {
    const items = groupedData.get(groupKey);
    if (items && items.length > 0) {
        const [manufacturer, effectiveDate] = groupKey.split('|');
        const headers = [
            'ID', 'Manufacturer', 'Effective From', 'Prefix', 'Part Number',
            'Supplier Price', 'Standard Packing Quantity', 'Supplier Parts Prefix',
            'Supplier Parts Number', 'Manufacturer Warranty', 'List Price',
            'Formula Cost Price', 'MRP', 'Uploaded By', 'Upload Date', 'Status'
        ];

        const csvContent = [
            headers.join(','),
            ...items.map(item => [
                item.id,
                item.manufacturer,
                item.effectiveFrom,
                item.prefix,
                item.partNumber,
                item.supplierPrice,
                item.standardPackingQuantity,
                item.supplierPartsPrefix,
                item.supplierPartsNumber,
                item.manufacturerWarranty,
                item.listPrice,
                item.formulaCostPrice,
                item.mrp,
                item.uploadedBy,
                item.uploadDate,
                item.status
            ].join(','))
        ].join('\n');

        downloadCSV(csvContent, `${manufacturer}-${effectiveDate}-group.csv`);
        showNotification(`Group data exported successfully!`);
    }
}

function deleteGroup(groupKey) {
    const items = groupedData.get(groupKey);
    if (items && items.length > 0) {
        const [manufacturer, effectiveDate] = groupKey.split('|');
        if (confirm(`Are you sure you want to delete all ${items.length} items in the ${manufacturer} - ${formatGroupDate(effectiveDate)} group?`)) {
            // Remove items from prizeData
            const itemIds = items.map(item => item.id);
            priceData = priceData.filter(item => !itemIds.includes(item.id));

            // Update displays
            updateUploadStats();
            updateLandingGrid();
            showNotification(`Group deleted successfully! Removed ${items.length} items.`);
        }
    }
}

function initializeGroupToggle() {
    const groupToggle = document.getElementById('groupToggle');
    if (groupToggle) {
        groupToggle.addEventListener('click', toggleGroupedView);
    }
}

// Activity Tracking Functions
function addActivity(type, description, user = currentUser) {
    const activity = {
        id: Date.now(),
        type: type,
        description: description,
        user: user,
        timestamp: new Date(),
        icon: getActivityIcon(type)
    };

    recentActivities.unshift(activity);

    // Keep only the latest activities
    if (recentActivities.length > MAX_ACTIVITIES) {
        recentActivities = recentActivities.slice(0, MAX_ACTIVITIES);
    }

    updateActivityDisplay();
}

function getActivityIcon(type) {
    const icons = {
        'upload': 'cloud_upload',
        'edit': 'edit',
        'delete': 'delete',
        'export': 'download',
        'import': 'upload_file',
        'create': 'add_circle',
        'update': 'update'
    };
    return icons[type] || 'info';
}

function updateActivityDisplay() {
    const activityList = document.getElementById('activityList');
    if (!activityList) return;

    if (recentActivities.length === 0) {
        activityList.innerHTML = `
            <div class="activity-empty">
                No recent activities to display
            </div>
        `;
        return;
    }

    activityList.innerHTML = recentActivities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon ${activity.type}">
                <span class="material-icons">${activity.icon}</span>
            </div>
            <div class="activity-content">
                <div class="activity-description">${activity.description}</div>
                <div class="activity-meta">
                    <span class="activity-user">${activity.user}</span>
                    <span class="activity-time">${formatActivityTime(activity.timestamp)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function formatActivityTime(timestamp) {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
}

function clearAllActivities() {
    recentActivities = [];
    updateActivityDisplay();
    showNotification('Activity history cleared');
}

// Price Distribution Chart Functions
function createPriceDistributionChart() {
    const canvas = document.getElementById('priceDistributionChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const data = calculatePriceDistribution();

    // Clear previous chart
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (data.ranges.length === 0) {
        drawEmptyChart(ctx, canvas);
        return;
    }

    drawBarChart(ctx, canvas, data);
    updateChartLegend(data);
    updateChartSummary();
}

function calculatePriceDistribution() {
    if (priceData.length === 0) {
        return { ranges: [], counts: [], colors: [], total: 0 };
    }

    const prices = priceData.map(item => item.listPrice || 0).filter(price => price > 0);
    if (prices.length === 0) {
        return { ranges: [], counts: [], colors: [], total: 0 };
    }

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const rangeSize = Math.ceil((maxPrice - minPrice) / 5) || 1;

    const ranges = [];
    const counts = [];
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    for (let i = 0; i < 5; i++) {
        const start = minPrice + (i * rangeSize);
        const end = i === 4 ? maxPrice : start + rangeSize - 0.01;
        const count = prices.filter(price => price >= start && price <= end).length;

        ranges.push(`$${start.toFixed(0)}-$${end.toFixed(0)}`);
        counts.push(count);
    }

    return {
        ranges,
        counts,
        colors,
        total: prices.length,
        minPrice,
        maxPrice,
        avgPrice: prices.reduce((sum, price) => sum + price, 0) / prices.length
    };
}

function drawBarChart(ctx, canvas, data) {
    const padding = 40;
    const chartWidth = canvas.width - (padding * 2);
    const chartHeight = canvas.height - (padding * 2);
    const barWidth = chartWidth / data.ranges.length;
    const maxCount = Math.max(...data.counts);

    // Draw bars
    data.counts.forEach((count, index) => {
        const barHeight = maxCount > 0 ? (count / maxCount) * chartHeight : 0;
        const x = padding + (index * barWidth) + (barWidth * 0.1);
        const y = padding + chartHeight - barHeight;
        const width = barWidth * 0.8;

        // Draw bar
        ctx.fillStyle = data.colors[index];
        ctx.fillRect(x, y, width, barHeight);

        // Draw count label
        ctx.fillStyle = '#374151';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(count.toString(), x + width/2, y - 5);
    });

    // Draw axes
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, padding + chartHeight);
    ctx.lineTo(padding + chartWidth, padding + chartHeight);
    ctx.stroke();
}

function drawEmptyChart(ctx, canvas) {
    ctx.fillStyle = '#9ca3af';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('No price data available', canvas.width / 2, canvas.height / 2);
}

function updateChartLegend(data) {
    const legend = document.getElementById('chartLegend');
    if (!legend) return;

    legend.innerHTML = data.ranges.map((range, index) => `
        <div class="chart-legend-item">
            <div class="chart-legend-color" style="background-color: ${data.colors[index]}"></div>
            <span>${range}</span>
        </div>
    `).join('');
}

function updateChartSummary() {
    const avgPriceElement = document.getElementById('avgPriceValue');
    const priceRangeElement = document.getElementById('priceRangeValue');

    if (priceData.length === 0) {
        if (avgPriceElement) avgPriceElement.textContent = '$0.00';
        if (priceRangeElement) priceRangeElement.textContent = '$0 - $0';
        return;
    }

    const prices = priceData.map(item => item.listPrice || 0).filter(price => price > 0);
    if (prices.length === 0) {
        if (avgPriceElement) avgPriceElement.textContent = '$0.00';
        if (priceRangeElement) priceRangeElement.textContent = '$0 - $0';
        return;
    }

    const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    if (avgPriceElement) avgPriceElement.textContent = `$${avgPrice.toFixed(2)}`;
    if (priceRangeElement) priceRangeElement.textContent = `$${minPrice.toFixed(0)} - $${maxPrice.toFixed(0)}`;
}

function renderGridView(data) {
    const dataGrid = document.getElementById('dataGrid');
    const dataTableContainer = document.getElementById('dataTableContainer');

    // Show grid container, hide table
    if (dataTableContainer) {
        dataTableContainer.style.display = 'none';
    }

    if (!dataGrid) return;

    dataGrid.innerHTML = data.map(item => `
        <div class="grid-item ${item.status === 'failed' ? 'failed-item' : 'success-item'}" data-id="${item.id}">
            <div class="grid-item-header">
                <h3 class="grid-item-title">${item.partNumber}</h3>
                <div class="grid-item-badges">
                    <span class="grid-item-badge manufacturer">${item.manufacturer}</span>
                    <span class="grid-item-badge status ${item.status}">
                        <span class="material-icons">${item.status === 'success' ? 'check_circle' : 'error'}</span>
                        ${item.status === 'success' ? 'Success' : 'Failed'}
                    </span>
                </div>
            </div>

            <div class="grid-item-content">
                <div class="grid-item-field">
                    <span class="grid-item-label">Supplier Price</span>
                    <span class="grid-item-value currency">$${item.supplierPrice.toFixed(2)}</span>
                </div>
                <div class="grid-item-field">
                    <span class="grid-item-label">List Price</span>
                    <span class="grid-item-value currency">$${item.listPrice.toFixed(2)}</span>
                </div>
                <div class="grid-item-field">
                    <span class="grid-item-label">MRP</span>
                    <span class="grid-item-value currency">$${item.mrp.toFixed(2)}</span>
                </div>
                <div class="grid-item-field">
                    <span class="grid-item-label">Effective From</span>
                    <span class="grid-item-value">${formatDate(item.effectiveFrom)}</span>
                </div>
                ${item.prefix ? `
                <div class="grid-item-field">
                    <span class="grid-item-label">Prefix</span>
                    <span class="grid-item-value">${item.prefix}</span>
                </div>
                ` : ''}
                ${item.standardPackingQuantity ? `
                <div class="grid-item-field">
                    <span class="grid-item-label">Packing Qty</span>
                    <span class="grid-item-value">${item.standardPackingQuantity}</span>
                </div>
                ` : ''}
            </div>

            <div class="grid-item-footer">
                <div class="grid-item-meta">
                    <div class="grid-item-meta-item">
                        <span class="material-icons">person</span>
                        ${item.uploadedBy || 'Unknown'}
                    </div>
                    <div class="grid-item-meta-item">
                        <span class="material-icons">schedule</span>
                        ${formatDate(item.uploadDate)}
                    </div>
                </div>
                <div class="grid-item-actions">
                    <button class="grid-item-action" onclick="editGridItem(${item.id})" title="Edit">
                        <span class="material-icons">edit</span>
                    </button>
                    <button class="grid-item-action" onclick="deleteGridItem(${item.id})" title="Delete">
                        <span class="material-icons">delete</span>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderTableView(data) {
    const tableBody = document.getElementById('dataTableBody');

    tableBody.innerHTML = data.map(item => `
        <tr data-id="${item.id}" class="${item.status === 'failed' ? 'failed-row' : 'success-row'}">
            <td class="actions-cell">
                <div class="table-actions">
                    <button class="table-action-btn view" onclick="viewGridItem(${item.id})" title="View Details">
                        <span class="material-icons">visibility</span>
                    </button>
                    <button class="table-action-btn edit" onclick="editGridItem(${item.id})" title="Edit">
                        <span class="material-icons">edit</span>
                    </button>
                    <button class="table-action-btn delete" onclick="deleteGridItem(${item.id})" title="Delete">
                        <span class="material-icons">delete</span>
                    </button>
                </div>
            </td>
            <td class="font-medium">${item.manufacturer || '-'}</td>
            <td>${formatDate(item.effectiveFrom)}</td>
            <td>${item.prefix || '-'}</td>
            <td class="font-medium">${item.partNumber}</td>
            <td>$${item.supplierPrice.toFixed(2)}</td>
            <td>${item.standardPackingQuantity || '-'}</td>
            <td>${item.supplierPartsPrefix || '-'}</td>
            <td>${item.supplierPartsNumber || '-'}</td>
            <td>${item.manufacturerWarranty || '-'}</td>
            <td>$${item.listPrice.toFixed(2)}</td>
            <td>${item.formulaCostPrice ? '$' + item.formulaCostPrice.toFixed(2) : '-'}</td>
            <td class="font-medium">$${item.mrp.toFixed(2)}</td>
            <td>${item.uploadedBy || 'Unknown'}</td>
            <td>${formatDate(item.uploadDate)}</td>
            <td>
                <span class="status-badge ${item.status}">
                    <span class="material-icons">${item.status === 'success' ? 'check_circle' : 'error'}</span>
                    ${item.status === 'success' ? 'Success' : 'Failed'}
                </span>
            </td>
        </tr>
    `).join('');
}

function formatDate(dateString) {
    if (!dateString) return '-';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function editGridItem(id) {
    const item = priceData.find(item => item.id === id);
    if (item) {
        // Populate the form with item data and switch to manual entry
        populateFormWithItem(item);
        document.querySelector('[data-tab="manual"]').click();
        document.getElementById('manual-tab').scrollIntoView({ behavior: 'smooth' });

        // Remove the item from the data array (it will be re-added when saved)
        priceData = priceData.filter(i => i.id !== id);
        updateLandingGrid();

        showNotification('Item loaded for editing. Make your changes and save.');
    }
}

function deleteGridItem(id) {
    const item = priceData.find(item => item.id === id);
    if (item && confirm(`Are you sure you want to delete the entry for "${item.partNumber}"?`)) {
        priceData = priceData.filter(i => i.id !== id);
        updateUploadStats();
        updateLandingGrid();
        showNotification('Entry deleted successfully.');
    }
}

function viewGridItem(id) {
    const item = priceData.find(item => item.id === id);
    if (item) {
        // Create a detailed view modal or expand the item
        const details = `
            <div class="item-details">
                <h3>Part Details: ${item.partNumber}</h3>
                <div class="details-grid">
                    <div><strong>Manufacturer:</strong> ${item.manufacturer}</div>
                    <div><strong>Effective From:</strong> ${formatDate(item.effectiveFrom)}</div>
                    <div><strong>Prefix:</strong> ${item.prefix || 'N/A'}</div>
                    <div><strong>Supplier Price:</strong> $${item.supplierPrice.toFixed(2)}</div>
                    <div><strong>List Price:</strong> $${item.listPrice.toFixed(2)}</div>
                    <div><strong>MRP:</strong> $${item.mrp.toFixed(2)}</div>
                    <div><strong>Standard Packing Qty:</strong> ${item.standardPackingQuantity || 'N/A'}</div>
                    <div><strong>Warranty:</strong> ${item.manufacturerWarranty || 'N/A'} days</div>
                    <div><strong>Uploaded By:</strong> ${item.uploadedBy}</div>
                    <div><strong>Upload Date:</strong> ${formatDate(item.uploadDate)}</div>
                    <div><strong>Status:</strong> <span class="status-${item.status}">${item.status.toUpperCase()}</span></div>
                </div>
            </div>
        `;

        // For now, show in a simple alert (can be enhanced with a proper modal)
        const detailsText = `
Part Number: ${item.partNumber}
Manufacturer: ${item.manufacturer}
Effective From: ${formatDate(item.effectiveFrom)}
Supplier Price: $${item.supplierPrice.toFixed(2)}
List Price: $${item.listPrice.toFixed(2)}
MRP: $${item.mrp.toFixed(2)}
Uploaded By: ${item.uploadedBy}
Status: ${item.status.toUpperCase()}
        `;
        alert(detailsText);
    }
}

function populateFormWithItem(item) {
    // Set manufacturer and effective date
    currentManufacturer = item.manufacturer;
    currentEffectiveDate = item.effectiveFrom;

    // Sync manufacturer selection
    syncManufacturerSelection(item.manufacturer, item.manufacturer);

    // Set effective date
    document.getElementById('manualEffectiveFrom').value = item.effectiveFrom;
    document.getElementById('uploadEffectiveFrom').value = item.effectiveFrom;

    // Populate form fields
    document.getElementById('prefix').value = item.prefix || '';
    document.getElementById('partNumber').value = item.partNumber || '';
    document.getElementById('supplierPrice').value = item.supplierPrice || '';
    document.getElementById('standardPackingQuantity').value = item.standardPackingQuantity || '';
    document.getElementById('supplierPartsPrefix').value = item.supplierPartsPrefix || '';
    document.getElementById('supplierPartsNumber').value = item.supplierPartsNumber || '';
    document.getElementById('manufacturerWarranty').value = item.manufacturerWarranty || '';
    document.getElementById('listPrice').value = item.listPrice || '';
    document.getElementById('formulaCostPrice').value = item.formulaCostPrice || '';
    document.getElementById('mrp').value = item.mrp || '';
}

// Utility Functions
function downloadTemplate() {
    const headers = [
        'Manufacturer',
        'Effective From',
        'Prefix',
        'PartNumber',
        'Supplier Price',
        'Standard Packing Quantity',
        'Supplier Parts Prefix',
        'Supplier Parts Number',
        'Manufacturer Warranty (days)',
        'List Price',
        'Formula Cost Price',
        'MRP'
    ];

    const csvContent = headers.join(',') + '\n';
    downloadCSV(csvContent, 'prize-list-template.csv');
    showNotification('Template downloaded successfully!');
}

function exportData() {
    if (priceData.length === 0) {
        showNotification('No data to export.', 'error');
        return;
    }

    const headers = [
        'Manufacturer',
        'Effective From',
        'Prefix',
        'Part Number',
        'Supplier Price',
        'Standard Packing Quantity',
        'Supplier Parts Prefix',
        'Supplier Parts Number',
        'Manufacturer Warranty (days)',
        'List Price',
        'Formula Cost Price',
        'MRP',
        'Uploaded By',
        'Upload Date'
    ];

    const csvContent = [
        headers.join(','),
        ...priceData.map(item => [
            item.manufacturer,
            item.effectiveFrom,
            item.prefix,
            item.partNumber,
            item.supplierPrice,
            item.standardPackingQuantity,
            item.supplierPartsPrefix,
            item.supplierPartsNumber,
            item.manufacturerWarranty,
            item.listPrice,
            item.formulaCostPrice,
            item.mrp,
            item.uploadedBy || 'Unknown',
            item.uploadDate || ''
        ].join(','))
    ].join('\n');

    downloadCSV(csvContent, 'prize-list-data.csv');
    showNotification('Data exported successfully!');
}

function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}



function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${type === 'error' ? 'var(--error-color)' : 'var(--success-color)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        font-size: 0.875rem;
        font-weight: 500;
        max-width: 300px;
        word-wrap: break-word;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}
