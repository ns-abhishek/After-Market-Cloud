/**
 * Report Wizard - Export Module
 *
 * This module handles report export functionality.
 */

// Initialize the preview step
function initPreviewStep() {
    // Get the DOM elements
    const refreshPreviewBtn = document.getElementById('refreshPreviewBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomLevel = document.getElementById('zoomLevel');
    const reportPreviewContainer = document.getElementById('reportPreviewContainer');
    const exportPdfBtn = document.getElementById('exportPdfBtn');
    const exportExcelBtn = document.getElementById('exportExcelBtn');
    const exportCsvBtn = document.getElementById('exportCsvBtn');
    const exportImageBtn = document.getElementById('exportImageBtn');
    const scheduleFrequency = document.getElementById('scheduleFrequency');
    const configScheduleBtn = document.getElementById('configScheduleBtn');

    // Set up the refresh preview button
    refreshPreviewBtn.addEventListener('click', () => {
        generateReportPreview(reportPreviewContainer);
    });

    // Set up zoom controls
    let currentZoom = 100;

    zoomOutBtn.addEventListener('click', () => {
        if (currentZoom > 50) {
            currentZoom -= 10;
            updateZoom();
        }
    });

    zoomInBtn.addEventListener('click', () => {
        if (currentZoom < 200) {
            currentZoom += 10;
            updateZoom();
        }
    });

    function updateZoom() {
        zoomLevel.textContent = `${currentZoom}%`;
        reportPreviewContainer.style.transform = `scale(${currentZoom / 100})`;
        reportPreviewContainer.style.transformOrigin = 'top left';
    }

    // Set up export buttons
    exportPdfBtn.addEventListener('click', () => {
        exportReport('pdf');
    });

    exportExcelBtn.addEventListener('click', () => {
        exportReport('excel');
    });

    exportCsvBtn.addEventListener('click', () => {
        exportReport('csv');
    });

    exportImageBtn.addEventListener('click', () => {
        exportReport('image');
    });

    // Set up scheduling
    scheduleFrequency.addEventListener('change', () => {
        const frequency = scheduleFrequency.value;
        configScheduleBtn.disabled = !frequency;

        if (frequency) {
            appState.scheduleOptions = appState.scheduleOptions || {};
            appState.scheduleOptions.frequency = frequency;
        } else {
            delete appState.scheduleOptions;
        }
    });

    configScheduleBtn.addEventListener('click', () => {
        showScheduleConfigDialog();
    });

    // Generate the initial preview
    generateReportPreview(reportPreviewContainer);
}

// Generate the report preview
function generateReportPreview(container) {
    console.log('Generating report preview');

    // Clear the container
    container.innerHTML = '';

    // Create the report preview
    const reportPreview = document.createElement('div');
    reportPreview.className = 'report-preview-content';

    // Add the report title and subtitle
    if (appState.visualizationOptions.title) {
        const titleElement = document.createElement('h1');
        titleElement.className = 'report-title';
        titleElement.textContent = appState.visualizationOptions.title;
        reportPreview.appendChild(titleElement);
    } else {
        // Add a default title if none is set
        const titleElement = document.createElement('h1');
        titleElement.className = 'report-title';
        titleElement.textContent = 'Report Preview';
        reportPreview.appendChild(titleElement);
    }

    if (appState.visualizationOptions.subtitle) {
        const subtitleElement = document.createElement('h2');
        subtitleElement.className = 'report-subtitle';
        subtitleElement.textContent = appState.visualizationOptions.subtitle;
        reportPreview.appendChild(subtitleElement);
    }

    // Check if we have data to display
    const data = getProcessedData();
    if (!data || data.length === 0) {
        const noDataMessage = document.createElement('div');
        noDataMessage.className = 'alert alert-warning';
        noDataMessage.innerHTML = '<p>No data available for preview. Please make sure you have selected data fields and applied any necessary filters.</p>';
        reportPreview.appendChild(noDataMessage);
        container.appendChild(reportPreview);
        return;
    }

    // Generate the visualization based on the selected type
    const visualizationElement = document.createElement('div');
    visualizationElement.className = 'report-visualization';

    // Default to table visualization if none is selected
    const vizType = appState.visualizationOptions.type || 'table';

    switch (vizType) {
        case 'table':
            generateTableVisualization(visualizationElement);
            break;
        case 'bar':
            generateBarChartVisualization(visualizationElement);
            break;
        case 'line':
            generateLineChartVisualization(visualizationElement);
            break;
        case 'pie':
            generatePieChartVisualization(visualizationElement);
            break;
        case 'scatter':
            generateScatterPlotVisualization(visualizationElement);
            break;
        case 'pivot':
            generatePivotTableVisualization(visualizationElement);
            break;
        default:
            generateTableVisualization(visualizationElement);
    }

    reportPreview.appendChild(visualizationElement);

    // Add the report to the container
    container.appendChild(reportPreview);

    console.log('Report preview generated');
}

// Generate a table visualization
function generateTableVisualization(container) {
    console.log('Generating table visualization');

    // Get the processed data
    const data = getProcessedData();

    if (!data || data.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info">
                <p>No data available for preview.</p>
                <p>Please make sure you have:</p>
                <ul>
                    <li>Selected a data source</li>
                    <li>Selected at least one field</li>
                    <li>Applied appropriate filters (if any)</li>
                </ul>
            </div>
        `;
        return;
    }

    // Get the options
    const options = appState.visualizationOptions.options || {};

    // Create the table
    const table = document.createElement('table');
    table.className = 'report-table';

    // Add classes based on options
    if (options.striped !== false) {
        table.classList.add('striped');
    }

    if (options.bordered !== false) {
        table.classList.add('bordered');
    }

    // Create the table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    // Get the fields to display
    const fields = Object.keys(data[0]);

    if (fields.length === 0) {
        // If no fields in data but we have selected fields, use those
        if (appState.selectedFields && appState.selectedFields.length > 0) {
            console.log('Using selected fields for table headers');
            // Create a table with just the headers
            const table = document.createElement('table');
            table.className = 'report-table bordered';

            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');

            appState.selectedFields.forEach(field => {
                const th = document.createElement('th');
                th.textContent = field.label || formatFieldLabel(field.name);
                headerRow.appendChild(th);
            });

            thead.appendChild(headerRow);
            table.appendChild(thead);

            // Add empty body with a message
            const tbody = document.createElement('tbody');
            const messageRow = document.createElement('tr');
            const messageCell = document.createElement('td');
            messageCell.colSpan = appState.selectedFields.length;
            messageCell.textContent = 'No data available for the selected fields.';
            messageCell.style.textAlign = 'center';
            messageCell.style.padding = '20px';

            messageRow.appendChild(messageCell);
            tbody.appendChild(messageRow);
            table.appendChild(tbody);

            container.appendChild(table);
            return;
        } else {
            container.innerHTML = '<p>No fields available in the data.</p>';
            return;
        }
    }

    fields.forEach(field => {
        // Skip internal fields
        if (field.startsWith('_') && field !== '_count') {
            return;
        }

        const th = document.createElement('th');
        th.textContent = formatFieldLabel(field);
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create the table body
    const tbody = document.createElement('tbody');

    // Determine how many rows to show
    let rowsToShow = data.length;
    if (options.pagination !== false) {
        rowsToShow = Math.min(data.length, options.pageSize || 10);
    }

    for (let i = 0; i < rowsToShow; i++) {
        const row = document.createElement('tr');

        fields.forEach(field => {
            // Skip internal fields
            if (field.startsWith('_') && field !== '_count') {
                return;
            }

            const td = document.createElement('td');

            // Format the value based on field type
            let value = data[i][field];

            if (typeof value === 'number') {
                // Format numbers
                td.textContent = formatNumber(value);
                td.classList.add('number');
            } else if (value instanceof Date) {
                // Format dates
                td.textContent = formatDate(value);
            } else {
                td.textContent = value !== undefined && value !== null ? value : '';
            }

            row.appendChild(td);
        });

        tbody.appendChild(row);
    }

    table.appendChild(tbody);

    // Add pagination if enabled
    if (options.pagination !== false && data.length > (options.pageSize || 10)) {
        const pagination = document.createElement('div');
        pagination.className = 'table-pagination';

        const pageInfo = document.createElement('div');
        pageInfo.className = 'page-info';
        pageInfo.textContent = `Showing 1-${options.pageSize || 10} of ${data.length} rows`;

        const pageControls = document.createElement('div');
        pageControls.className = 'page-controls';

        const prevButton = document.createElement('button');
        prevButton.className = 'btn btn-sm btn-outline';
        prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevButton.disabled = true;

        const nextButton = document.createElement('button');
        nextButton.className = 'btn btn-sm btn-outline';
        nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';

        pageControls.appendChild(prevButton);
        pageControls.appendChild(nextButton);

        pagination.appendChild(pageInfo);
        pagination.appendChild(pageControls);

        container.appendChild(table);
        container.appendChild(pagination);
    } else {
        container.appendChild(table);
    }

    console.log('Table visualization generated');
}

// Generate a bar chart visualization
function generateBarChartVisualization(container) {
    // In a real implementation, this would use a charting library
    // For this demo, we'll just show a placeholder

    container.innerHTML = `
        <div class="chart-placeholder">
            <div class="chart-icon">
                <i class="fas fa-chart-bar"></i>
            </div>
            <p>Bar Chart Visualization</p>
            <p class="chart-note">In a real implementation, this would render an interactive bar chart using a library like Chart.js or D3.js.</p>
        </div>
    `;
}

// Generate a line chart visualization
function generateLineChartVisualization(container) {
    // In a real implementation, this would use a charting library
    // For this demo, we'll just show a placeholder

    container.innerHTML = `
        <div class="chart-placeholder">
            <div class="chart-icon">
                <i class="fas fa-chart-line"></i>
            </div>
            <p>Line Chart Visualization</p>
            <p class="chart-note">In a real implementation, this would render an interactive line chart using a library like Chart.js or D3.js.</p>
        </div>
    `;
}

// Generate a pie chart visualization
function generatePieChartVisualization(container) {
    // In a real implementation, this would use a charting library
    // For this demo, we'll just show a placeholder

    container.innerHTML = `
        <div class="chart-placeholder">
            <div class="chart-icon">
                <i class="fas fa-chart-pie"></i>
            </div>
            <p>Pie Chart Visualization</p>
            <p class="chart-note">In a real implementation, this would render an interactive pie chart using a library like Chart.js or D3.js.</p>
        </div>
    `;
}

// Generate a scatter plot visualization
function generateScatterPlotVisualization(container) {
    // In a real implementation, this would use a charting library
    // For this demo, we'll just show a placeholder

    container.innerHTML = `
        <div class="chart-placeholder">
            <div class="chart-icon">
                <i class="fas fa-braille"></i>
            </div>
            <p>Scatter Plot Visualization</p>
            <p class="chart-note">In a real implementation, this would render an interactive scatter plot using a library like Chart.js or D3.js.</p>
        </div>
    `;
}

// Generate a pivot table visualization
function generatePivotTableVisualization(container) {
    // In a real implementation, this would use a pivot table library
    // For this demo, we'll just show a placeholder

    container.innerHTML = `
        <div class="chart-placeholder">
            <div class="chart-icon">
                <i class="fas fa-th"></i>
            </div>
            <p>Pivot Table Visualization</p>
            <p class="chart-note">In a real implementation, this would render an interactive pivot table using a library like PivotTable.js or AG Grid.</p>
        </div>
    `;
}

// Get the processed data for visualization
function getProcessedData() {
    console.log('Getting processed data for visualization');

    // If no data source, return empty array
    if (!appState.dataSource || !appState.dataSource.data) {
        console.log('No data source available');
        return [];
    }

    // Get the raw data
    let data = [...appState.dataSource.data]; // Create a copy to avoid modifying the original
    console.log('Raw data count:', data.length);

    // If no fields are selected, return empty array
    if (!appState.selectedFields || appState.selectedFields.length === 0) {
        console.log('No fields selected');
        return [];
    }

    console.log('Selected fields:', appState.selectedFields);

    // Filter data to only include selected fields
    data = data.map(item => {
        const filteredItem = {};
        appState.selectedFields.forEach(field => {
            // Make sure the field exists in the data
            if (field && field.name && item.hasOwnProperty(field.name)) {
                filteredItem[field.name] = item[field.name];
            } else {
                console.warn(`Field ${field?.name} not found in data item`, item);
            }
        });
        return filteredItem;
    });

    // Apply filters
    if (appState.filters && appState.filters.length > 0) {
        console.log('Applying filters');
        data = applyFilters(data);
        console.log('Data after filters:', data.length);
    }

    // Apply grouping and aggregation
    if (appState.groupings && appState.groupings.length > 0) {
        console.log('Applying grouping and aggregation');
        data = applyGroupingAndAggregation(data);
        console.log('Data after grouping:', data.length);

        // After grouping, we don't need to filter by selected fields again
        // since applyGroupingAndAggregation already updates the selectedFields
        return data;
    }

    // Apply sorting
    if (appState.sortFields && appState.sortFields.length > 0) {
        console.log('Applying sorting');
        data = applySorting(data);
    }

    // Make sure we have at least some data to display
    if (data.length === 0 && appState.dataSource.data.length > 0) {
        // If we have source data but no processed data, return a sample of the raw data
        console.log('No processed data, returning sample of raw data');
        const sampleData = appState.dataSource.data.slice(0, 5);
        return sampleData.map(item => {
            const filteredItem = {};
            appState.selectedFields.forEach(field => {
                if (field && field.name) {
                    filteredItem[field.name] = item[field.name];
                }
            });
            return filteredItem;
        });
    }

    console.log('Final processed data count:', data.length);
    return data;
}

// Apply filters to the data
function applyFilters(data) {
    console.log('Applying filters to data');

    if (!appState.filters || appState.filters.length === 0) {
        console.log('No filters to apply');
        return data;
    }

    console.log('Filters to apply:', appState.filters);

    // Make sure all filters have valid fields and values
    const validFilters = appState.filters.filter(filter => {
        // Make sure the field exists
        if (!filter.field) {
            console.log(`Skipping filter with no field specified`);
            return false;
        }

        // Skip filters with empty values unless the operator is is_empty or is_not_empty
        if ((filter.value === '' || filter.value === null || filter.value === undefined) &&
            filter.operator !== 'is_empty' && filter.operator !== 'is_not_empty') {
            console.log(`Skipping filter with empty value: ${filter.field} ${filter.operator}`);
            return false;
        }

        // For is_empty and is_not_empty operators, we don't need a value
        if (filter.operator === 'is_empty' || filter.operator === 'is_not_empty') {
            console.log(`Filter ${filter.field} ${filter.operator} doesn't need a value`);
            return true;
        }

        return true;
    });

    if (validFilters.length === 0) {
        console.log('No valid filters to apply');
        return data;
    }

    console.log('Valid filters to apply:', validFilters);

    return data.filter(row => {
        // Check each filter
        for (const filter of validFilters) {
            const field = filter.field;
            const operator = filter.operator;
            const filterValue = filter.value;
            const rowValue = row[field];

            console.log(`Checking filter: ${field} ${operator} ${filterValue}, row value: ${rowValue}`);

            // Skip if the field doesn't exist
            if (rowValue === undefined) {
                console.log(`Field ${field} not found in row, skipping filter`);
                continue;
            }

            // Apply the filter based on the operator
            let result = true;
            switch (operator) {
                case 'equals':
                    result = String(rowValue) === String(filterValue);
                    break;
                case 'not_equals':
                    result = String(rowValue) !== String(filterValue);
                    break;
                case 'contains':
                    result = String(rowValue).toLowerCase().includes(String(filterValue).toLowerCase());
                    break;
                case 'not_contains':
                    result = !String(rowValue).toLowerCase().includes(String(filterValue).toLowerCase());
                    break;
                case 'starts_with':
                    result = String(rowValue).toLowerCase().startsWith(String(filterValue).toLowerCase());
                    break;
                case 'ends_with':
                    result = String(rowValue).toLowerCase().endsWith(String(filterValue).toLowerCase());
                    break;
                case 'greater_than':
                    result = Number(rowValue) > Number(filterValue);
                    break;
                case 'less_than':
                    result = Number(rowValue) < Number(filterValue);
                    break;
                case 'greater_than_or_equals':
                    result = Number(rowValue) >= Number(filterValue);
                    break;
                case 'less_than_or_equals':
                    result = Number(rowValue) <= Number(filterValue);
                    break;
                case 'is_empty':
                    result = rowValue === null || rowValue === undefined || rowValue === '';
                    break;
                case 'is_not_empty':
                    result = rowValue !== null && rowValue !== undefined && rowValue !== '';
                    break;
                default:
                    console.log(`Unknown operator: ${operator}`);
                    result = true;
            }

            if (!result) {
                console.log(`Filter failed: ${field} ${operator} ${filterValue}, row value: ${rowValue}`);
                return false;
            }
        }

        // If all filters pass, include the row
        return true;
    });
}

// Apply sorting to the data
function applySorting(data) {
    if (!appState.sortFields || appState.sortFields.length === 0) {
        return data;
    }

    return [...data].sort((a, b) => {
        for (const sort of appState.sortFields) {
            const field = sort.field;
            const direction = sort.direction === 'asc' ? 1 : -1;

            const aValue = a[field];
            const bValue = b[field];

            if (aValue === bValue) {
                continue;
            }

            if (aValue === null || aValue === undefined) {
                return direction;
            }

            if (bValue === null || bValue === undefined) {
                return -direction;
            }

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return (aValue - bValue) * direction;
            }

            return String(aValue).localeCompare(String(bValue)) * direction;
        }

        return 0;
    });
}

// Format a number for display
function formatNumber(value) {
    // In a real implementation, this would use the formatting options
    // For this demo, we'll just use a simple formatter
    return new Intl.NumberFormat().format(value);
}

// Format a date for display
function formatDate(value) {
    // In a real implementation, this would use the formatting options
    // For this demo, we'll just use a simple formatter
    return new Intl.DateTimeFormat().format(value);
}

// Export the report
function exportReport(format) {
    // In a real implementation, this would generate the export file
    // For this demo, we'll just show a notification

    const formatNames = {
        pdf: 'PDF',
        excel: 'Excel',
        csv: 'CSV',
        image: 'Image'
    };

    showNotification(`Exporting report as ${formatNames[format]}...`, 'info');

    // Simulate export delay
    setTimeout(() => {
        showNotification(`Report exported as ${formatNames[format]} successfully!`, 'success');
    }, 1500);
}

// Show the schedule configuration dialog
function showScheduleConfigDialog() {
    // In a real implementation, this would show a dialog to configure scheduling
    // For this demo, we'll just show a notification

    const frequency = appState.scheduleOptions?.frequency || '';

    if (frequency) {
        showNotification(`Report scheduled to run ${frequency}. Configuration dialog would appear here.`, 'info');
    } else {
        showNotification('Please select a schedule frequency first.', 'warning');
    }
}
