/**
 * Report Wizard - Visualization Module
 * 
 * This module handles report layout and visualization functionality.
 */

// Initialize the visualization step
function initVisualizationStep() {
    // Get the DOM elements
    const vizTypeCards = document.querySelectorAll('.viz-type-card');
    const vizOptionsContainer = document.getElementById('vizOptionsContainer');
    const reportTitle = document.getElementById('reportTitle');
    const reportSubtitle = document.getElementById('reportSubtitle');
    const showLegend = document.getElementById('showLegend');
    
    // Set up the visualization type selection
    vizTypeCards.forEach(card => {
        // Set the active class on the current visualization type
        if (card.dataset.vizType === appState.visualizationOptions.type) {
            card.classList.add('active');
        }
        
        card.addEventListener('click', () => {
            // Remove active class from all cards
            vizTypeCards.forEach(c => c.classList.remove('active'));
            
            // Add active class to the clicked card
            card.classList.add('active');
            
            // Update the visualization type
            appState.visualizationOptions.type = card.dataset.vizType;
            
            // Load the visualization options
            loadVisualizationOptions(vizOptionsContainer, card.dataset.vizType);
        });
    });
    
    // Load the visualization options for the current type
    loadVisualizationOptions(vizOptionsContainer, appState.visualizationOptions.type);
    
    // Set up the report title and subtitle
    reportTitle.value = appState.visualizationOptions.title || '';
    reportTitle.addEventListener('input', () => {
        appState.visualizationOptions.title = reportTitle.value;
    });
    
    reportSubtitle.value = appState.visualizationOptions.subtitle || '';
    reportSubtitle.addEventListener('input', () => {
        appState.visualizationOptions.subtitle = reportSubtitle.value;
    });
    
    // Set up the show legend checkbox
    showLegend.checked = appState.visualizationOptions.showLegend !== false;
    showLegend.addEventListener('change', () => {
        appState.visualizationOptions.showLegend = showLegend.checked;
    });
}

// Load visualization options based on the selected type
function loadVisualizationOptions(container, vizType) {
    // Clear the container
    container.innerHTML = '';
    
    // Create the options based on the visualization type
    switch (vizType) {
        case 'table':
            createTableOptions(container);
            break;
        case 'bar':
            createBarChartOptions(container);
            break;
        case 'line':
            createLineChartOptions(container);
            break;
        case 'pie':
            createPieChartOptions(container);
            break;
        case 'scatter':
            createScatterPlotOptions(container);
            break;
        case 'pivot':
            createPivotTableOptions(container);
            break;
        default:
            container.innerHTML = '<p>No options available for this visualization type.</p>';
    }
}

// Create options for table visualization
function createTableOptions(container) {
    const options = appState.visualizationOptions.options || {};
    
    // Create the options form
    const form = document.createElement('form');
    form.className = 'viz-options-form';
    
    // Add pagination option
    const paginationGroup = document.createElement('div');
    paginationGroup.className = 'form-group';
    
    const paginationLabel = document.createElement('label');
    paginationLabel.textContent = 'Enable Pagination';
    
    const paginationSwitch = document.createElement('label');
    paginationSwitch.className = 'switch';
    
    const paginationInput = document.createElement('input');
    paginationInput.type = 'checkbox';
    paginationInput.checked = options.pagination !== false;
    paginationInput.addEventListener('change', () => {
        options.pagination = paginationInput.checked;
        
        // Show/hide the page size input
        pageSizeGroup.style.display = paginationInput.checked ? 'block' : 'none';
    });
    
    const paginationSlider = document.createElement('span');
    paginationSlider.className = 'slider';
    
    paginationSwitch.appendChild(paginationInput);
    paginationSwitch.appendChild(paginationSlider);
    
    paginationGroup.appendChild(paginationLabel);
    paginationGroup.appendChild(paginationSwitch);
    
    // Add page size option
    const pageSizeGroup = document.createElement('div');
    pageSizeGroup.className = 'form-group';
    pageSizeGroup.style.display = options.pagination !== false ? 'block' : 'none';
    
    const pageSizeLabel = document.createElement('label');
    pageSizeLabel.textContent = 'Rows Per Page';
    
    const pageSizeInput = document.createElement('input');
    pageSizeInput.type = 'number';
    pageSizeInput.min = '1';
    pageSizeInput.value = options.pageSize || 10;
    pageSizeInput.addEventListener('input', () => {
        options.pageSize = parseInt(pageSizeInput.value) || 10;
    });
    
    pageSizeGroup.appendChild(pageSizeLabel);
    pageSizeGroup.appendChild(pageSizeInput);
    
    // Add striped rows option
    const stripedGroup = document.createElement('div');
    stripedGroup.className = 'form-group';
    
    const stripedLabel = document.createElement('label');
    stripedLabel.textContent = 'Striped Rows';
    
    const stripedSwitch = document.createElement('label');
    stripedSwitch.className = 'switch';
    
    const stripedInput = document.createElement('input');
    stripedInput.type = 'checkbox';
    stripedInput.checked = options.striped !== false;
    stripedInput.addEventListener('change', () => {
        options.striped = stripedInput.checked;
    });
    
    const stripedSlider = document.createElement('span');
    stripedSlider.className = 'slider';
    
    stripedSwitch.appendChild(stripedInput);
    stripedSwitch.appendChild(stripedSlider);
    
    stripedGroup.appendChild(stripedLabel);
    stripedGroup.appendChild(stripedSwitch);
    
    // Add bordered option
    const borderedGroup = document.createElement('div');
    borderedGroup.className = 'form-group';
    
    const borderedLabel = document.createElement('label');
    borderedLabel.textContent = 'Bordered Table';
    
    const borderedSwitch = document.createElement('label');
    borderedSwitch.className = 'switch';
    
    const borderedInput = document.createElement('input');
    borderedInput.type = 'checkbox';
    borderedInput.checked = options.bordered !== false;
    borderedInput.addEventListener('change', () => {
        options.bordered = borderedInput.checked;
    });
    
    const borderedSlider = document.createElement('span');
    borderedSlider.className = 'slider';
    
    borderedSwitch.appendChild(borderedInput);
    borderedSwitch.appendChild(borderedSlider);
    
    borderedGroup.appendChild(borderedLabel);
    borderedGroup.appendChild(borderedSwitch);
    
    // Add the form groups to the form
    form.appendChild(paginationGroup);
    form.appendChild(pageSizeGroup);
    form.appendChild(stripedGroup);
    form.appendChild(borderedGroup);
    
    // Add the form to the container
    container.appendChild(form);
    
    // Update the options in the application state
    appState.visualizationOptions.options = options;
}

// Create options for bar chart visualization
function createBarChartOptions(container) {
    const options = appState.visualizationOptions.options || {};
    
    // Create the options form
    const form = document.createElement('form');
    form.className = 'viz-options-form';
    
    // Add orientation option
    const orientationGroup = document.createElement('div');
    orientationGroup.className = 'form-group';
    
    const orientationLabel = document.createElement('label');
    orientationLabel.textContent = 'Chart Orientation';
    
    const orientationSelect = document.createElement('select');
    
    const verticalOption = document.createElement('option');
    verticalOption.value = 'vertical';
    verticalOption.textContent = 'Vertical';
    verticalOption.selected = options.orientation !== 'horizontal';
    
    const horizontalOption = document.createElement('option');
    horizontalOption.value = 'horizontal';
    horizontalOption.textContent = 'Horizontal';
    horizontalOption.selected = options.orientation === 'horizontal';
    
    orientationSelect.appendChild(verticalOption);
    orientationSelect.appendChild(horizontalOption);
    
    orientationSelect.addEventListener('change', () => {
        options.orientation = orientationSelect.value;
    });
    
    orientationGroup.appendChild(orientationLabel);
    orientationGroup.appendChild(orientationSelect);
    
    // Add stacked option
    const stackedGroup = document.createElement('div');
    stackedGroup.className = 'form-group';
    
    const stackedLabel = document.createElement('label');
    stackedLabel.textContent = 'Stacked Bars';
    
    const stackedSwitch = document.createElement('label');
    stackedSwitch.className = 'switch';
    
    const stackedInput = document.createElement('input');
    stackedInput.type = 'checkbox';
    stackedInput.checked = options.stacked === true;
    stackedInput.addEventListener('change', () => {
        options.stacked = stackedInput.checked;
    });
    
    const stackedSlider = document.createElement('span');
    stackedSlider.className = 'slider';
    
    stackedSwitch.appendChild(stackedInput);
    stackedSwitch.appendChild(stackedSlider);
    
    stackedGroup.appendChild(stackedLabel);
    stackedGroup.appendChild(stackedSwitch);
    
    // Add show values option
    const showValuesGroup = document.createElement('div');
    showValuesGroup.className = 'form-group';
    
    const showValuesLabel = document.createElement('label');
    showValuesLabel.textContent = 'Show Values on Bars';
    
    const showValuesSwitch = document.createElement('label');
    showValuesSwitch.className = 'switch';
    
    const showValuesInput = document.createElement('input');
    showValuesInput.type = 'checkbox';
    showValuesInput.checked = options.showValues === true;
    showValuesInput.addEventListener('change', () => {
        options.showValues = showValuesInput.checked;
    });
    
    const showValuesSlider = document.createElement('span');
    showValuesSlider.className = 'slider';
    
    showValuesSwitch.appendChild(showValuesInput);
    showValuesSwitch.appendChild(showValuesSlider);
    
    showValuesGroup.appendChild(showValuesLabel);
    showValuesGroup.appendChild(showValuesSwitch);
    
    // Add the form groups to the form
    form.appendChild(orientationGroup);
    form.appendChild(stackedGroup);
    form.appendChild(showValuesGroup);
    
    // Add the form to the container
    container.appendChild(form);
    
    // Update the options in the application state
    appState.visualizationOptions.options = options;
}

// Create options for line chart visualization
function createLineChartOptions(container) {
    const options = appState.visualizationOptions.options || {};
    
    // Create the options form
    const form = document.createElement('form');
    form.className = 'viz-options-form';
    
    // Add area option
    const areaGroup = document.createElement('div');
    areaGroup.className = 'form-group';
    
    const areaLabel = document.createElement('label');
    areaLabel.textContent = 'Area Chart';
    
    const areaSwitch = document.createElement('label');
    areaSwitch.className = 'switch';
    
    const areaInput = document.createElement('input');
    areaInput.type = 'checkbox';
    areaInput.checked = options.area === true;
    areaInput.addEventListener('change', () => {
        options.area = areaInput.checked;
    });
    
    const areaSlider = document.createElement('span');
    areaSlider.className = 'slider';
    
    areaSwitch.appendChild(areaInput);
    areaSwitch.appendChild(areaSlider);
    
    areaGroup.appendChild(areaLabel);
    areaGroup.appendChild(areaSwitch);
    
    // Add smooth lines option
    const smoothGroup = document.createElement('div');
    smoothGroup.className = 'form-group';
    
    const smoothLabel = document.createElement('label');
    smoothLabel.textContent = 'Smooth Lines';
    
    const smoothSwitch = document.createElement('label');
    smoothSwitch.className = 'switch';
    
    const smoothInput = document.createElement('input');
    smoothInput.type = 'checkbox';
    smoothInput.checked = options.smooth === true;
    smoothInput.addEventListener('change', () => {
        options.smooth = smoothInput.checked;
    });
    
    const smoothSlider = document.createElement('span');
    smoothSlider.className = 'slider';
    
    smoothSwitch.appendChild(smoothInput);
    smoothSwitch.appendChild(smoothSlider);
    
    smoothGroup.appendChild(smoothLabel);
    smoothGroup.appendChild(smoothSwitch);
    
    // Add show points option
    const showPointsGroup = document.createElement('div');
    showPointsGroup.className = 'form-group';
    
    const showPointsLabel = document.createElement('label');
    showPointsLabel.textContent = 'Show Data Points';
    
    const showPointsSwitch = document.createElement('label');
    showPointsSwitch.className = 'switch';
    
    const showPointsInput = document.createElement('input');
    showPointsInput.type = 'checkbox';
    showPointsInput.checked = options.showPoints !== false;
    showPointsInput.addEventListener('change', () => {
        options.showPoints = showPointsInput.checked;
    });
    
    const showPointsSlider = document.createElement('span');
    showPointsSlider.className = 'slider';
    
    showPointsSwitch.appendChild(showPointsInput);
    showPointsSwitch.appendChild(showPointsSlider);
    
    showPointsGroup.appendChild(showPointsLabel);
    showPointsGroup.appendChild(showPointsSwitch);
    
    // Add the form groups to the form
    form.appendChild(areaGroup);
    form.appendChild(smoothGroup);
    form.appendChild(showPointsGroup);
    
    // Add the form to the container
    container.appendChild(form);
    
    // Update the options in the application state
    appState.visualizationOptions.options = options;
}

// Create options for pie chart visualization
function createPieChartOptions(container) {
    const options = appState.visualizationOptions.options || {};
    
    // Create the options form
    const form = document.createElement('form');
    form.className = 'viz-options-form';
    
    // Add donut option
    const donutGroup = document.createElement('div');
    donutGroup.className = 'form-group';
    
    const donutLabel = document.createElement('label');
    donutLabel.textContent = 'Donut Chart';
    
    const donutSwitch = document.createElement('label');
    donutSwitch.className = 'switch';
    
    const donutInput = document.createElement('input');
    donutInput.type = 'checkbox';
    donutInput.checked = options.donut === true;
    donutInput.addEventListener('change', () => {
        options.donut = donutInput.checked;
    });
    
    const donutSlider = document.createElement('span');
    donutSlider.className = 'slider';
    
    donutSwitch.appendChild(donutInput);
    donutSwitch.appendChild(donutSlider);
    
    donutGroup.appendChild(donutLabel);
    donutGroup.appendChild(donutSwitch);
    
    // Add show percentages option
    const showPercentagesGroup = document.createElement('div');
    showPercentagesGroup.className = 'form-group';
    
    const showPercentagesLabel = document.createElement('label');
    showPercentagesLabel.textContent = 'Show Percentages';
    
    const showPercentagesSwitch = document.createElement('label');
    showPercentagesSwitch.className = 'switch';
    
    const showPercentagesInput = document.createElement('input');
    showPercentagesInput.type = 'checkbox';
    showPercentagesInput.checked = options.showPercentages !== false;
    showPercentagesInput.addEventListener('change', () => {
        options.showPercentages = showPercentagesInput.checked;
    });
    
    const showPercentagesSlider = document.createElement('span');
    showPercentagesSlider.className = 'slider';
    
    showPercentagesSwitch.appendChild(showPercentagesInput);
    showPercentagesSwitch.appendChild(showPercentagesSlider);
    
    showPercentagesGroup.appendChild(showPercentagesLabel);
    showPercentagesGroup.appendChild(showPercentagesSwitch);
    
    // Add the form groups to the form
    form.appendChild(donutGroup);
    form.appendChild(showPercentagesGroup);
    
    // Add the form to the container
    container.appendChild(form);
    
    // Update the options in the application state
    appState.visualizationOptions.options = options;
}

// Create options for scatter plot visualization
function createScatterPlotOptions(container) {
    const options = appState.visualizationOptions.options || {};
    
    // Create the options form
    const form = document.createElement('form');
    form.className = 'viz-options-form';
    
    // Add show trend line option
    const trendLineGroup = document.createElement('div');
    trendLineGroup.className = 'form-group';
    
    const trendLineLabel = document.createElement('label');
    trendLineLabel.textContent = 'Show Trend Line';
    
    const trendLineSwitch = document.createElement('label');
    trendLineSwitch.className = 'switch';
    
    const trendLineInput = document.createElement('input');
    trendLineInput.type = 'checkbox';
    trendLineInput.checked = options.trendLine === true;
    trendLineInput.addEventListener('change', () => {
        options.trendLine = trendLineInput.checked;
    });
    
    const trendLineSlider = document.createElement('span');
    trendLineSlider.className = 'slider';
    
    trendLineSwitch.appendChild(trendLineInput);
    trendLineSwitch.appendChild(trendLineSlider);
    
    trendLineGroup.appendChild(trendLineLabel);
    trendLineGroup.appendChild(trendLineSwitch);
    
    // Add the form groups to the form
    form.appendChild(trendLineGroup);
    
    // Add the form to the container
    container.appendChild(form);
    
    // Update the options in the application state
    appState.visualizationOptions.options = options;
}

// Create options for pivot table visualization
function createPivotTableOptions(container) {
    const options = appState.visualizationOptions.options || {};
    
    // Create the options form
    const form = document.createElement('form');
    form.className = 'viz-options-form';
    
    // Add collapsible option
    const collapsibleGroup = document.createElement('div');
    collapsibleGroup.className = 'form-group';
    
    const collapsibleLabel = document.createElement('label');
    collapsibleLabel.textContent = 'Collapsible Rows';
    
    const collapsibleSwitch = document.createElement('label');
    collapsibleSwitch.className = 'switch';
    
    const collapsibleInput = document.createElement('input');
    collapsibleInput.type = 'checkbox';
    collapsibleInput.checked = options.collapsible !== false;
    collapsibleInput.addEventListener('change', () => {
        options.collapsible = collapsibleInput.checked;
    });
    
    const collapsibleSlider = document.createElement('span');
    collapsibleSlider.className = 'slider';
    
    collapsibleSwitch.appendChild(collapsibleInput);
    collapsibleSwitch.appendChild(collapsibleSlider);
    
    collapsibleGroup.appendChild(collapsibleLabel);
    collapsibleGroup.appendChild(collapsibleSwitch);
    
    // Add the form groups to the form
    form.appendChild(collapsibleGroup);
    
    // Add the form to the container
    container.appendChild(form);
    
    // Update the options in the application state
    appState.visualizationOptions.options = options;
}
