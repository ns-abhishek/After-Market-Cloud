/**
 * Report Wizard - Main Application
 *
 * This is the main entry point for the Report Wizard application.
 * It initializes all components and manages the application state.
 */

// Global application state
const appState = {
    currentStep: 1,
    totalSteps: 7,
    dataSource: null,
    dataFields: [],
    selectedFields: [],
    filters: [],
    groupings: [],
    aggregations: [],
    sortFields: [],
    visualizationOptions: {
        type: 'table',
        options: {}
    },
    formattingOptions: {},
    reportName: '',
    reportDescription: '',
    savedReports: []
};

// DOM Elements
const elements = {
    // Navigation
    prevStepBtn: document.getElementById('prevStepBtn'),
    nextStepBtn: document.getElementById('nextStepBtn'),
    currentStepEl: document.getElementById('currentStep'),
    totalStepsEl: document.getElementById('totalSteps'),
    stepsList: document.querySelectorAll('.wizard-steps .step'),

    // Data Source
    fileUpload: document.getElementById('fileUpload'),
    sampleDataBtn: document.getElementById('sampleDataBtn'),
    pasteDataBtn: document.getElementById('pasteDataBtn'),
    dataSourcePreview: document.getElementById('dataSourcePreview'),
    dataPreviewTable: document.getElementById('dataPreviewTable'),

    // Modals
    sampleDataModal: document.getElementById('sampleDataModal'),
    pasteDataModal: document.getElementById('pasteDataModal'),
    saveReportModal: document.getElementById('saveReportModal'),

    // Modal elements
    sampleDataItems: document.querySelectorAll('.sample-data-item'),
    pasteDataArea: document.getElementById('pasteDataArea'),
    processPastedDataBtn: document.getElementById('processPastedDataBtn'),

    // Save/Load
    saveReportBtn: document.getElementById('saveReportBtn'),
    loadReportBtn: document.getElementById('loadReportBtn'),
    reportName: document.getElementById('reportName'),
    reportDescription: document.getElementById('reportDescription'),
    confirmSaveReportBtn: document.getElementById('confirmSaveReportBtn'),

    // Close modal buttons
    closeModalBtns: document.querySelectorAll('.close-modal')
};

// Initialize the application
function initApp() {
    console.log('Initializing Report Wizard application');

    // Initialize the application state with default values
    initializeAppState();

    // Set up event listeners
    setupEventListeners();

    // Initialize the wizard
    initWizard();

    // Load any saved reports from localStorage
    loadSavedReports();

    // Initialize internationalization
    initI18n();

    // Load sample data if no data source is set
    if (!appState.dataSource) {
        console.log('No data source set, loading sample data');
        loadSampleData('employees');
    }

    console.log('Report Wizard initialized');
}

// Initialize the application state with default values
function initializeAppState() {
    // Ensure all required properties exist
    appState.currentStep = appState.currentStep || 1;
    appState.totalSteps = appState.totalSteps || 7;
    appState.dataSource = appState.dataSource || null;
    appState.dataFields = appState.dataFields || [];
    appState.selectedFields = appState.selectedFields || [];
    appState.filters = appState.filters || [];
    appState.groupings = appState.groupings || [];
    appState.aggregations = appState.aggregations || [];
    appState.sortFields = appState.sortFields || [];
    appState.visualizationOptions = appState.visualizationOptions || {
        type: 'table',
        options: {}
    };
    appState.formattingOptions = appState.formattingOptions || {};
    appState.reportName = appState.reportName || '';
    appState.reportDescription = appState.reportDescription || '';
    appState.savedReports = appState.savedReports || [];

    console.log('Application state initialized');
}

// Set up all event listeners
function setupEventListeners() {
    // Navigation
    elements.prevStepBtn.addEventListener('click', goToPreviousStep);
    elements.nextStepBtn.addEventListener('click', goToNextStep);
    elements.stepsList.forEach(step => {
        step.addEventListener('click', () => {
            const stepNumber = parseInt(step.dataset.step);
            if (isStepAccessible(stepNumber)) {
                goToStep(stepNumber);
            }
        });
    });

    // Data Source
    elements.fileUpload.addEventListener('change', handleFileUpload);
    elements.sampleDataBtn.addEventListener('click', () => showModal(elements.sampleDataModal));
    elements.pasteDataBtn.addEventListener('click', () => showModal(elements.pasteDataModal));

    // Sample Data
    elements.sampleDataItems.forEach(item => {
        item.addEventListener('click', () => {
            const sampleType = item.dataset.sample;
            loadSampleData(sampleType);
            hideModal(elements.sampleDataModal);
        });
    });

    // Paste Data
    elements.processPastedDataBtn.addEventListener('click', () => {
        processPastedData(elements.pasteDataArea.value);
        hideModal(elements.pasteDataModal);
    });

    // Save/Load
    elements.saveReportBtn.addEventListener('click', () => showModal(elements.saveReportModal));
    elements.confirmSaveReportBtn.addEventListener('click', saveReport);
    elements.loadReportBtn.addEventListener('click', showLoadReportDialog);

    // Close modals
    elements.closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            hideModal(modal);
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        document.querySelectorAll('.modal').forEach(modal => {
            if (e.target === modal) {
                hideModal(modal);
            }
        });
    });
}

// Show a modal
function showModal(modal) {
    modal.classList.add('active');
}

// Hide a modal
function hideModal(modal) {
    modal.classList.remove('active');
}

// Check if a step is accessible
function isStepAccessible(stepNumber) {
    // First step is always accessible
    if (stepNumber === 1) return true;

    // Can only access steps that we've already completed or the next step
    return stepNumber <= appState.currentStep;
}

// Load saved reports from localStorage
function loadSavedReports() {
    const savedReports = localStorage.getItem('reportWizardSavedReports');
    if (savedReports) {
        appState.savedReports = JSON.parse(savedReports);
        console.log(`Loaded ${appState.savedReports.length} saved reports`);
    }
}

// Save the current report
function saveReport() {
    appState.reportName = elements.reportName.value || 'Untitled Report';
    appState.reportDescription = elements.reportDescription.value || '';

    const report = {
        id: Date.now(),
        name: appState.reportName,
        description: appState.reportDescription,
        dateCreated: new Date().toISOString(),
        state: { ...appState }
    };

    appState.savedReports.push(report);
    localStorage.setItem('reportWizardSavedReports', JSON.stringify(appState.savedReports));

    hideModal(elements.saveReportModal);
    showNotification('Report saved successfully!', 'success');
}

// Show the load report dialog
function showLoadReportDialog() {
    // This would be implemented to show a list of saved reports
    // For now, we'll just log the saved reports
    console.log('Saved reports:', appState.savedReports);

    if (appState.savedReports.length === 0) {
        showNotification('No saved reports found.', 'info');
    } else {
        // In a real implementation, we would show a modal with the list of reports
        showNotification('Load report functionality will be implemented soon.', 'info');
    }
}

// Show a notification
function showNotification(message, type = 'info') {
    // This would be implemented to show a toast notification
    console.log(`${type.toUpperCase()}: ${message}`);

    // For now, we'll use alert for simplicity
    alert(message);
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
