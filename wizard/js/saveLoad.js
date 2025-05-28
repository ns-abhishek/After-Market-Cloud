/**
 * Report Wizard - Save and Load Module
 * 
 * This module handles saving and loading report configurations.
 */

// Save the current report configuration
function saveReportConfiguration() {
    // Get the report name and description
    const reportName = document.getElementById('reportName').value || 'Untitled Report';
    const reportDescription = document.getElementById('reportDescription').value || '';
    
    // Create the report configuration object
    const reportConfig = {
        id: Date.now(),
        name: reportName,
        description: reportDescription,
        dateCreated: new Date().toISOString(),
        configuration: {
            dataSource: {
                type: appState.dataSource.type,
                name: appState.dataSource.name
            },
            dataFields: appState.dataFields,
            selectedFields: appState.selectedFields,
            filters: appState.filters,
            groupings: appState.groupings,
            aggregations: appState.aggregations,
            sortFields: appState.sortFields,
            visualizationOptions: appState.visualizationOptions,
            formattingOptions: appState.formattingOptions
        }
    };
    
    // If the data source is a sample, include the data
    if (appState.dataSource.type === 'sample') {
        reportConfig.configuration.dataSource.data = appState.dataSource.data;
    }
    
    // Get the existing saved reports
    let savedReports = [];
    const savedReportsJson = localStorage.getItem('reportWizardSavedReports');
    
    if (savedReportsJson) {
        try {
            savedReports = JSON.parse(savedReportsJson);
        } catch (e) {
            console.error('Error parsing saved reports:', e);
        }
    }
    
    // Add the new report
    savedReports.push(reportConfig);
    
    // Save the reports
    localStorage.setItem('reportWizardSavedReports', JSON.stringify(savedReports));
    
    return reportConfig;
}

// Load a saved report configuration
function loadReportConfiguration(reportId) {
    // Get the saved reports
    const savedReportsJson = localStorage.getItem('reportWizardSavedReports');
    
    if (!savedReportsJson) {
        showNotification('No saved reports found.', 'error');
        return false;
    }
    
    try {
        const savedReports = JSON.parse(savedReportsJson);
        
        // Find the report with the given ID
        const report = savedReports.find(r => r.id === reportId);
        
        if (!report) {
            showNotification('Report not found.', 'error');
            return false;
        }
        
        // Load the report configuration
        const config = report.configuration;
        
        // Set the data source
        if (config.dataSource.type === 'sample' && config.dataSource.data) {
            // For sample data, we can load the data directly
            appState.dataSource = {
                type: config.dataSource.type,
                name: config.dataSource.name,
                data: config.dataSource.data
            };
        } else {
            // For other data sources, we need to prompt the user to reselect the data
            showNotification('Please reselect your data source.', 'warning');
            goToStep(1);
            return false;
        }
        
        // Set the other configuration options
        appState.dataFields = config.dataFields || [];
        appState.selectedFields = config.selectedFields || [];
        appState.filters = config.filters || [];
        appState.groupings = config.groupings || [];
        appState.aggregations = config.aggregations || [];
        appState.sortFields = config.sortFields || [];
        appState.visualizationOptions = config.visualizationOptions || { type: 'table', options: {} };
        appState.formattingOptions = config.formattingOptions || {};
        
        // Update the UI
        updateUIForLoadedReport();
        
        showNotification(`Report "${report.name}" loaded successfully.`, 'success');
        return true;
        
    } catch (e) {
        console.error('Error loading report:', e);
        showNotification('Error loading report.', 'error');
        return false;
    }
}

// Update the UI after loading a report
function updateUIForLoadedReport() {
    // Go to the first step
    goToStep(1);
    
    // Show the data preview
    if (appState.dataSource && appState.dataSource.data) {
        showDataPreview(appState.dataSource.data);
    }
}

// Show the load report dialog
function showLoadReportDialog() {
    // Get the saved reports
    const savedReportsJson = localStorage.getItem('reportWizardSavedReports');
    
    if (!savedReportsJson) {
        showNotification('No saved reports found.', 'info');
        return;
    }
    
    try {
        const savedReports = JSON.parse(savedReportsJson);
        
        if (savedReports.length === 0) {
            showNotification('No saved reports found.', 'info');
            return;
        }
        
        // Create and show the load report modal
        createLoadReportModal(savedReports);
        
    } catch (e) {
        console.error('Error parsing saved reports:', e);
        showNotification('Error loading saved reports.', 'error');
    }
}

// Create the load report modal
function createLoadReportModal(reports) {
    // Create the modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'loadReportModal';
    
    // Create the modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    // Create the modal header
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    
    const modalTitle = document.createElement('h2');
    modalTitle.textContent = 'Load Report';
    
    const closeButton = document.createElement('span');
    closeButton.className = 'close-modal';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeButton);
    
    // Create the modal body
    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
    
    // Create the reports list
    const reportsList = document.createElement('div');
    reportsList.className = 'saved-reports-list';
    
    reports.forEach(report => {
        const reportItem = document.createElement('div');
        reportItem.className = 'saved-report-item';
        
        const reportInfo = document.createElement('div');
        reportInfo.className = 'report-info';
        
        const reportName = document.createElement('h3');
        reportName.textContent = report.name;
        
        const reportDescription = document.createElement('p');
        reportDescription.textContent = report.description || 'No description';
        
        const reportDate = document.createElement('p');
        reportDate.className = 'report-date';
        reportDate.textContent = `Created: ${new Date(report.dateCreated).toLocaleString()}`;
        
        reportInfo.appendChild(reportName);
        reportInfo.appendChild(reportDescription);
        reportInfo.appendChild(reportDate);
        
        const reportActions = document.createElement('div');
        reportActions.className = 'report-actions';
        
        const loadButton = document.createElement('button');
        loadButton.className = 'btn btn-primary';
        loadButton.textContent = 'Load';
        loadButton.addEventListener('click', () => {
            loadReportConfiguration(report.id);
            document.body.removeChild(modal);
        });
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-outline';
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.title = 'Delete report';
        deleteButton.addEventListener('click', () => {
            if (confirm(`Are you sure you want to delete the report "${report.name}"?`)) {
                deleteReport(report.id);
                document.body.removeChild(modal);
            }
        });
        
        reportActions.appendChild(loadButton);
        reportActions.appendChild(deleteButton);
        
        reportItem.appendChild(reportInfo);
        reportItem.appendChild(reportActions);
        
        reportsList.appendChild(reportItem);
    });
    
    modalBody.appendChild(reportsList);
    
    // Assemble the modal
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    
    modal.appendChild(modalContent);
    
    // Add the modal to the body
    document.body.appendChild(modal);
    
    // Show the modal
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

// Delete a saved report
function deleteReport(reportId) {
    // Get the saved reports
    const savedReportsJson = localStorage.getItem('reportWizardSavedReports');
    
    if (!savedReportsJson) {
        return;
    }
    
    try {
        let savedReports = JSON.parse(savedReportsJson);
        
        // Remove the report with the given ID
        savedReports = savedReports.filter(r => r.id !== reportId);
        
        // Save the updated reports
        localStorage.setItem('reportWizardSavedReports', JSON.stringify(savedReports));
        
        showNotification('Report deleted successfully.', 'success');
        
    } catch (e) {
        console.error('Error deleting report:', e);
        showNotification('Error deleting report.', 'error');
    }
}

// Export the report configuration to a file
function exportReportConfiguration() {
    // Create the report configuration
    const reportConfig = saveReportConfiguration();
    
    // Convert to JSON
    const reportJson = JSON.stringify(reportConfig, null, 2);
    
    // Create a blob
    const blob = new Blob([reportJson], { type: 'application/json' });
    
    // Create a download link
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${reportConfig.name.replace(/\s+/g, '_')}_config.json`;
    
    // Trigger the download
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

// Import a report configuration from a file
function importReportConfiguration(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const reportConfig = JSON.parse(e.target.result);
            
            // Validate the configuration
            if (!reportConfig.configuration || !reportConfig.configuration.dataSource) {
                showNotification('Invalid report configuration file.', 'error');
                return;
            }
            
            // Add the report to the saved reports
            let savedReports = [];
            const savedReportsJson = localStorage.getItem('reportWizardSavedReports');
            
            if (savedReportsJson) {
                savedReports = JSON.parse(savedReportsJson);
            }
            
            // Generate a new ID for the imported report
            reportConfig.id = Date.now();
            
            // Add the report
            savedReports.push(reportConfig);
            
            // Save the reports
            localStorage.setItem('reportWizardSavedReports', JSON.stringify(savedReports));
            
            showNotification(`Report "${reportConfig.name}" imported successfully.`, 'success');
            
            // Ask if the user wants to load the imported report
            if (confirm(`Do you want to load the imported report "${reportConfig.name}" now?`)) {
                loadReportConfiguration(reportConfig.id);
            }
            
        } catch (e) {
            console.error('Error importing report:', e);
            showNotification('Error importing report configuration.', 'error');
        }
    };
    
    reader.onerror = function() {
        showNotification('Error reading file.', 'error');
    };
    
    reader.readAsText(file);
}
