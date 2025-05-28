/**
 * Report Wizard - Wizard Navigation
 *
 * This module handles the step-by-step navigation of the wizard,
 * including validation and step content loading.
 */

// Step content templates
const stepTemplates = {
    2: `
        <div class="wizard-step-content" id="step-2">
            <h2>Select Data Fields</h2>
            <div class="alert alert-info">
                <p>Select the fields you want to include in your report and apply any filters.</p>
            </div>

            <div class="field-selection-container">
                <div class="available-fields">
                    <h3>Available Fields</h3>
                    <div class="search-container">
                        <input type="text" id="fieldSearchInput" placeholder="Search fields...">
                    </div>
                    <div class="fields-list" id="availableFieldsList"></div>
                </div>

                <div class="selected-fields">
                    <h3>Selected Fields</h3>
                    <div class="fields-list" id="selectedFieldsList"></div>
                </div>
            </div>

            <div class="filters-section">
                <h3>Filters</h3>
                <button id="addFilterBtn" class="btn btn-outline">
                    <i class="fas fa-plus"></i> Add Filter
                </button>
                <div id="filtersContainer"></div>
            </div>
        </div>
    `,
    3: `
        <div class="wizard-step-content" id="step-3">
            <h2>Grouping & Aggregation</h2>
            <div class="info-text">
                <p>Group your data and apply aggregation functions to create summary reports.</p>
            </div>

            <div class="grouping-section">
                <h3>Group By</h3>
                <div class="info-text">
                    <p>Select fields to group your data by. Grouping allows you to organize your data into categories.</p>
                </div>
                <div id="groupingFieldsContainer" class="fields-container"></div>
                <button id="addGroupingBtn" class="btn btn-outline">
                    <i class="fas fa-plus"></i> Add Grouping
                </button>
            </div>

            <div class="aggregation-section">
                <h3>Aggregations</h3>
                <div class="info-text">
                    <p>Apply aggregation functions (Sum, Average, Count, etc.) to numeric fields to calculate values for each group.</p>
                </div>
                <div id="aggregationContainer" class="fields-container"></div>
                <button id="addAggregationBtn" class="btn btn-outline">
                    <i class="fas fa-plus"></i> Add Aggregation
                </button>
            </div>
        </div>
    `,
    4: `
        <div class="wizard-step-content" id="step-4">
            <h2>Sorting</h2>
            <div class="alert alert-info">
                <p>Define how your data should be sorted in the report.</p>
            </div>

            <div class="sorting-section">
                <button id="addSortingBtn" class="btn btn-outline">
                    <i class="fas fa-plus"></i> Add Sorting Rule
                </button>
                <div id="sortingRulesContainer"></div>
            </div>
        </div>
    `,
    5: `
        <div class="wizard-step-content" id="step-5">
            <h2>Visualization</h2>
            <div class="alert alert-info">
                <p>Choose how to visualize your report data.</p>
            </div>

            <div class="visualization-options">
                <div class="viz-type-selection">
                    <h3>Visualization Type</h3>
                    <div class="viz-type-cards">
                        <div class="viz-type-card" data-viz-type="table">
                            <i class="fas fa-table"></i>
                            <h4>Table</h4>
                        </div>
                        <div class="viz-type-card" data-viz-type="bar">
                            <i class="fas fa-chart-bar"></i>
                            <h4>Bar Chart</h4>
                        </div>
                        <div class="viz-type-card" data-viz-type="line">
                            <i class="fas fa-chart-line"></i>
                            <h4>Line Chart</h4>
                        </div>
                        <div class="viz-type-card" data-viz-type="pie">
                            <i class="fas fa-chart-pie"></i>
                            <h4>Pie Chart</h4>
                        </div>
                        <div class="viz-type-card" data-viz-type="scatter">
                            <i class="fas fa-braille"></i>
                            <h4>Scatter Plot</h4>
                        </div>
                        <div class="viz-type-card" data-viz-type="pivot">
                            <i class="fas fa-th"></i>
                            <h4>Pivot Table</h4>
                        </div>
                    </div>
                </div>

                <div id="vizOptionsContainer" class="viz-options-container">
                    <!-- Visualization specific options will be loaded here -->
                </div>
            </div>

            <div class="layout-section">
                <h3>Layout Options</h3>
                <div class="layout-options">
                    <div class="form-group">
                        <label for="reportTitle">Report Title</label>
                        <input type="text" id="reportTitle" placeholder="Enter report title">
                    </div>
                    <div class="form-group">
                        <label for="reportSubtitle">Subtitle (optional)</label>
                        <input type="text" id="reportSubtitle" placeholder="Enter subtitle">
                    </div>
                    <div class="form-group">
                        <label>Show Legend</label>
                        <label class="switch">
                            <input type="checkbox" id="showLegend" checked>
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    `,
    6: `
        <div class="wizard-step-content" id="step-6">
            <h2>Formatting</h2>
            <div class="alert alert-info">
                <p>Customize the appearance of your report.</p>
            </div>

            <div class="formatting-options">
                <div class="formatting-section">
                    <h3>Colors & Theme</h3>
                    <div class="form-group">
                        <label>Color Scheme</label>
                        <div class="color-scheme-options">
                            <div class="color-scheme" data-scheme="monochrome">
                                <div class="color-preview monochrome"></div>
                                <span>Monochrome</span>
                            </div>
                            <div class="color-scheme" data-scheme="grayscale">
                                <div class="color-preview grayscale"></div>
                                <span>Grayscale</span>
                            </div>
                            <div class="color-scheme" data-scheme="contrast">
                                <div class="color-preview contrast"></div>
                                <span>High Contrast</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="formatting-section">
                    <h3>Number Formatting</h3>
                    <div id="numberFormattingContainer">
                        <!-- Number formatting options will be generated based on numeric fields -->
                    </div>
                </div>

                <div class="formatting-section">
                    <h3>Date Formatting</h3>
                    <div id="dateFormattingContainer">
                        <!-- Date formatting options will be generated based on date fields -->
                    </div>
                </div>

                <div class="formatting-section">
                    <h3>Conditional Formatting</h3>
                    <button id="addCondFormatBtn" class="btn btn-outline">
                        <i class="fas fa-plus"></i> Add Conditional Format
                    </button>
                    <div id="conditionalFormattingContainer"></div>
                </div>
            </div>
        </div>
    `,
    7: `
        <div class="wizard-step-content" id="step-7">
            <h2>Preview & Export</h2>
            <div class="alert alert-info">
                <p>Preview your report and export it in your preferred format.</p>
            </div>

            <div class="report-preview-container">
                <div class="preview-toolbar">
                    <button id="refreshPreviewBtn" class="btn btn-outline">
                        <i class="fas fa-sync-alt"></i> Refresh Preview
                    </button>
                    <div class="preview-zoom">
                        <button id="zoomOutBtn" class="btn btn-sm btn-outline">
                            <i class="fas fa-search-minus"></i>
                        </button>
                        <span id="zoomLevel">100%</span>
                        <button id="zoomInBtn" class="btn btn-sm btn-outline">
                            <i class="fas fa-search-plus"></i>
                        </button>
                    </div>
                </div>

                <div id="reportPreviewContainer" class="report-preview">
                    <!-- Report preview will be rendered here -->
                </div>
            </div>

            <div class="export-options">
                <h3>Export Options</h3>
                <div class="export-buttons">
                    <button id="exportPdfBtn" class="btn btn-outline">
                        <i class="fas fa-file-pdf"></i> PDF
                    </button>
                    <button id="exportExcelBtn" class="btn btn-outline">
                        <i class="fas fa-file-excel"></i> Excel
                    </button>
                    <button id="exportCsvBtn" class="btn btn-outline">
                        <i class="fas fa-file-csv"></i> CSV
                    </button>
                    <button id="exportImageBtn" class="btn btn-outline">
                        <i class="fas fa-file-image"></i> Image
                    </button>
                </div>

                <div class="form-group">
                    <label for="scheduleReport">Schedule Report</label>
                    <div class="schedule-options">
                        <select id="scheduleFrequency">
                            <option value="">No schedule</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                        <button id="configScheduleBtn" class="btn btn-outline">
                            <i class="fas fa-cog"></i> Configure
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `
};

// Initialize the wizard
function initWizard() {
    // Set the total steps
    elements.totalStepsEl.textContent = appState.totalSteps;

    // Set the current step
    updateStepIndicator();
}

// Go to the next step
function goToNextStep() {
    if (validateCurrentStep()) {
        if (appState.currentStep < appState.totalSteps) {
            goToStep(appState.currentStep + 1);
        }
    }
}

// Go to the previous step
function goToPreviousStep() {
    if (appState.currentStep > 1) {
        goToStep(appState.currentStep - 1);
    }
}

// Go to a specific step
function goToStep(stepNumber) {
    console.log(`Going to step ${stepNumber}`);

    // Update the current step
    appState.currentStep = stepNumber;

    // Update the step indicator
    updateStepIndicator();

    // Load the step content
    loadStepContent(stepNumber);

    // Update the navigation buttons
    updateNavigationButtons();

    // If we're going to the preview step, make sure to generate the preview
    if (stepNumber === 7) {
        // Wait for the DOM to update
        setTimeout(() => {
            const reportPreviewContainer = document.getElementById('reportPreviewContainer');
            if (reportPreviewContainer) {
                generateReportPreview(reportPreviewContainer);
            }
        }, 100);
    }
}

// Update the step indicator
function updateStepIndicator() {
    // Update the current step number
    elements.currentStepEl.textContent = appState.currentStep;

    // Update the step list
    elements.stepsList.forEach(step => {
        const stepNumber = parseInt(step.dataset.step);

        // Remove all classes
        step.classList.remove('active', 'completed');

        // Add the appropriate class
        if (stepNumber === appState.currentStep) {
            step.classList.add('active');
        } else if (stepNumber < appState.currentStep) {
            step.classList.add('completed');
        }
    });
}

// Update the navigation buttons
function updateNavigationButtons() {
    // Enable/disable the previous button
    elements.prevStepBtn.disabled = appState.currentStep === 1;

    // Update the next button text for the last step
    if (appState.currentStep === appState.totalSteps) {
        elements.nextStepBtn.innerHTML = 'Finish <i class="fas fa-check"></i>';
    } else {
        elements.nextStepBtn.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
    }
}

// Load the content for a specific step
function loadStepContent(stepNumber) {
    console.log(`Loading content for step ${stepNumber}`);
    const wizardContent = document.querySelector('.wizard-content');

    // If it's the first step, the content is already in the HTML
    if (stepNumber === 1) {
        // Make sure only step 1 is visible
        const allStepContents = document.querySelectorAll('.wizard-step-content');
        allStepContents.forEach(content => {
            if (content.id === 'step-1') {
                content.style.display = 'block';
            } else {
                content.style.display = 'none';
            }
        });

        // Add live preview if it doesn't exist
        addLivePreviewToStep(1);
        return;
    }

    // Check if the step content already exists
    const existingContent = document.getElementById(`step-${stepNumber}`);
    if (existingContent) {
        // Hide all step contents
        const allStepContents = document.querySelectorAll('.wizard-step-content');
        allStepContents.forEach(content => {
            content.style.display = 'none';
        });

        // Show the current step content
        existingContent.style.display = 'block';

        // Add live preview
        addLivePreviewToStep(stepNumber);
    } else {
        // Create the new step content
        const template = stepTemplates[stepNumber];
        if (template) {
            // Hide all step contents
            const allStepContents = document.querySelectorAll('.wizard-step-content');
            allStepContents.forEach(content => {
                content.style.display = 'none';
            });

            // Append the new content
            wizardContent.insertAdjacentHTML('beforeend', template);

            // Initialize the step-specific functionality
            initStepFunctionality(stepNumber);

            // Add live preview
            addLivePreviewToStep(stepNumber);
        }
    }
}

// Add live preview to the current step
function addLivePreviewToStep(stepNumber) {
    console.log(`Adding live preview to step ${stepNumber}`);

    // Get the current step content
    const stepContent = document.getElementById(`step-${stepNumber}`);
    if (!stepContent) {
        console.error(`Step content not found for step ${stepNumber}`);
        return;
    }

    // Check if preview already exists
    let previewContainer = stepContent.querySelector('.live-preview-container');
    if (!previewContainer) {
        // Create the preview container
        previewContainer = document.createElement('div');
        previewContainer.className = 'live-preview-container';
        previewContainer.innerHTML = `
            <div class="live-preview-header">
                <h3>Live Preview</h3>
                <button class="btn btn-sm btn-outline refresh-preview-btn">
                    <i class="fas fa-sync-alt"></i> Refresh
                </button>
            </div>
            <div class="live-preview-content"></div>
        `;

        // Add the preview container to the step content
        stepContent.appendChild(previewContainer);

        // Add event listener to the refresh button
        const refreshBtn = previewContainer.querySelector('.refresh-preview-btn');
        refreshBtn.addEventListener('click', () => {
            updateLivePreview(stepNumber);
        });
    }

    // Update the preview
    updateLivePreview(stepNumber);
}

// Update the live preview for the current step
function updateLivePreview(stepNumber) {
    console.log(`Updating live preview for step ${stepNumber}`);

    // Get the current step content
    const stepContent = document.getElementById(`step-${stepNumber}`);
    if (!stepContent) {
        console.error(`Step content not found for step ${stepNumber}`);
        return;
    }

    // Get the preview content container
    const previewContent = stepContent.querySelector('.live-preview-content');
    if (!previewContent) {
        console.error('Preview content container not found');
        return;
    }

    // Generate the preview
    generateReportPreview(previewContent);
}

// Initialize step-specific functionality
function initStepFunctionality(stepNumber) {
    switch (stepNumber) {
        case 2:
            initDataSelectionStep();
            break;
        case 3:
            initGroupingStep();
            break;
        case 4:
            initSortingStep();
            break;
        case 5:
            initVisualizationStep();
            break;
        case 6:
            initFormattingStep();
            break;
        case 7:
            initPreviewStep();
            break;
    }
}

// Validate the current step
function validateCurrentStep() {
    switch (appState.currentStep) {
        case 1:
            return validateDataSourceStep();
        case 2:
            return validateDataSelectionStep();
        case 3:
            return validateGroupingStep();
        case 4:
            return validateSortingStep();
        case 5:
            return validateVisualizationStep();
        case 6:
            return validateFormattingStep();
        case 7:
            return validatePreviewStep();
        default:
            return true;
    }
}

// Validation functions for each step
function validateDataSourceStep() {
    if (!appState.dataSource) {
        showNotification('Please select a data source before proceeding.', 'error');
        return false;
    }
    return true;
}

function validateDataSelectionStep() {
    console.log('Validating data selection step');
    console.log('Selected fields:', appState.selectedFields);

    if (!appState.selectedFields || appState.selectedFields.length === 0) {
        showNotification('Please select at least one field for your report.', 'error');
        return false;
    }

    return true;
}

function validateGroupingStep() {
    // Grouping is optional
    return true;
}

function validateSortingStep() {
    // Sorting is optional
    return true;
}

function validateVisualizationStep() {
    // Basic visualization is required
    if (!appState.visualizationOptions.type) {
        showNotification('Please select a visualization type.', 'error');
        return false;
    }
    return true;
}

function validateFormattingStep() {
    // Formatting is optional
    return true;
}

function validatePreviewStep() {
    // Preview is the last step, no validation needed
    return true;
}
