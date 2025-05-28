/**
 * Report Wizard - Grouping and Aggregation Module
 *
 * This module handles grouping and aggregation functionality.
 */

// Initialize the grouping step
function initGroupingStep() {
    console.log('Initializing grouping step');

    // Make sure the appState has the necessary properties
    appState.groupings = appState.groupings || [];
    appState.aggregations = appState.aggregations || [];

    // Get the DOM elements
    const groupingFieldsContainer = document.getElementById('groupingFieldsContainer');
    const aggregationContainer = document.getElementById('aggregationContainer');
    const addGroupingBtn = document.getElementById('addGroupingBtn');
    const addAggregationBtn = document.getElementById('addAggregationBtn');

    if (!groupingFieldsContainer || !aggregationContainer || !addGroupingBtn || !addAggregationBtn) {
        console.error('Could not find all required DOM elements for grouping step');
        return;
    }

    // Set up the add grouping button
    addGroupingBtn.addEventListener('click', () => {
        addGrouping(groupingFieldsContainer);
    });

    // Set up the add aggregation button
    addAggregationBtn.addEventListener('click', () => {
        addAggregation(aggregationContainer);
    });

    // Populate existing groupings (if any)
    populateExistingGroupings(groupingFieldsContainer);

    // Populate existing aggregations (if any)
    populateExistingAggregations(aggregationContainer);

    console.log('Grouping step initialized');
}

// Populate existing groupings
function populateExistingGroupings(container) {
    console.log('Populating existing groupings');

    // Clear the container
    container.innerHTML = '';

    // Add each grouping to the container
    if (appState.groupings && appState.groupings.length > 0) {
        appState.groupings.forEach(grouping => {
            const groupingElement = createGroupingElement(grouping);
            container.appendChild(groupingElement);
        });
        console.log('Groupings populated:', appState.groupings.length);
    } else {
        console.log('No groupings to populate');

        // Add a message if there are no groupings
        const noGroupingsMessage = document.createElement('div');
        noGroupingsMessage.className = 'no-groupings-message';
        noGroupingsMessage.innerHTML = '<p>No groupings added yet. Click "Add Grouping" to create a grouping.</p>';
        container.appendChild(noGroupingsMessage);

        // If we have fields, add a default one
        if (appState.selectedFields.length > 0) {
            addGrouping(container);
        }
    }

    // Update the live preview
    updateLivePreview(appState.currentStep);
}

// Populate existing aggregations
function populateExistingAggregations(container) {
    console.log('Populating existing aggregations');

    // Clear the container
    container.innerHTML = '';

    // Add each aggregation to the container
    if (appState.aggregations && appState.aggregations.length > 0) {
        appState.aggregations.forEach(aggregation => {
            const aggregationElement = createAggregationElement(aggregation);
            container.appendChild(aggregationElement);
        });
        console.log('Aggregations populated:', appState.aggregations.length);
    } else {
        console.log('No aggregations to populate');

        // Add a message if there are no aggregations
        const noAggregationsMessage = document.createElement('div');
        noAggregationsMessage.className = 'no-aggregations-message';
        noAggregationsMessage.innerHTML = '<p>No aggregations added yet. Click "Add Aggregation" to create an aggregation.</p>';
        container.appendChild(noAggregationsMessage);

        // If no aggregations exist and we have numeric fields, add a default one
        const numericFields = appState.selectedFields.filter(field => field.type === 'number');
        if (numericFields.length > 0) {
            addAggregation(container);
        }
    }

    // Update the live preview
    updateLivePreview(appState.currentStep);
}

// Add a new grouping
function addGrouping(container) {
    console.log('Adding new grouping');

    // Get the fields that can be used for grouping (non-numeric fields are preferred)
    const groupableFields = appState.selectedFields.filter(field =>
        field.type === 'string' || field.type === 'date' || field.type === 'boolean'
    );

    // If no groupable fields, use any selected field
    const fieldsToUse = groupableFields.length > 0 ? groupableFields : appState.selectedFields;

    if (fieldsToUse.length === 0) {
        showNotification('Please select fields in the previous step before adding groupings.', 'warning');
        return;
    }

    // Remove the no-groupings-message if it exists
    const noGroupingsMessage = container.querySelector('.no-groupings-message');
    if (noGroupingsMessage) {
        noGroupingsMessage.remove();
    }

    // Create a new grouping object
    const grouping = {
        id: Date.now(),
        field: fieldsToUse[0].name,
        sortOrder: 'asc'
    };

    console.log('Created new grouping:', grouping);

    // Add the grouping to the application state
    appState.groupings.push(grouping);

    // Add the grouping to the UI
    const groupingElement = createGroupingElement(grouping);
    container.appendChild(groupingElement);

    // Update the live preview
    updateLivePreview(appState.currentStep);

    // Show notification
    showNotification(`Grouping by "${fieldsToUse[0].label || fieldsToUse[0].name}" added`, 'success');

    // If this is the first grouping, add a default aggregation if we have numeric fields
    if (appState.groupings.length === 1) {
        const numericFields = appState.selectedFields.filter(field => field.type === 'number');
        if (numericFields.length > 0 && (!appState.aggregations || appState.aggregations.length === 0)) {
            const aggregationContainer = document.getElementById('aggregationContainer');
            if (aggregationContainer) {
                addAggregation(aggregationContainer);
            }
        }
    }
}

// Create a grouping element
function createGroupingElement(grouping) {
    const groupingElement = document.createElement('div');
    groupingElement.className = 'grouping-item';
    groupingElement.dataset.groupingId = grouping.id;

    // Create the field label
    const fieldLabel = document.createElement('label');
    fieldLabel.className = 'aggregation-label';
    fieldLabel.textContent = 'Group by';

    // Create the field select
    const fieldSelect = document.createElement('select');
    fieldSelect.className = 'grouping-field';

    // Add options for each field
    appState.selectedFields.forEach(field => {
        const option = document.createElement('option');
        option.value = field.name;
        option.textContent = field.label || field.name;
        option.selected = field.name === grouping.field;
        fieldSelect.appendChild(option);
    });

    // Create the direction label
    const directionLabel = document.createElement('label');
    directionLabel.className = 'aggregation-label';
    directionLabel.textContent = 'Order';

    // Create the sort order select
    const sortOrderSelect = document.createElement('select');
    sortOrderSelect.className = 'grouping-direction';

    // Add sort order options
    const sortOrders = [
        { value: 'asc', label: 'Ascending' },
        { value: 'desc', label: 'Descending' }
    ];

    sortOrders.forEach(order => {
        const option = document.createElement('option');
        option.value = order.value;
        option.textContent = order.label;
        option.selected = order.value === grouping.sortOrder;
        sortOrderSelect.appendChild(option);
    });

    // Create the remove button
    const removeButton = document.createElement('button');
    removeButton.className = 'btn-icon';
    removeButton.innerHTML = '<i class="fas fa-trash"></i>';
    removeButton.title = 'Remove grouping';

    // Add the elements to the grouping
    groupingElement.appendChild(fieldLabel);
    groupingElement.appendChild(fieldSelect);
    groupingElement.appendChild(directionLabel);
    groupingElement.appendChild(sortOrderSelect);
    groupingElement.appendChild(removeButton);

    // Set up event listeners
    fieldSelect.addEventListener('change', () => {
        console.log('Grouping field changed:', fieldSelect.value);
        grouping.field = fieldSelect.value;

        // Update the live preview
        updateLivePreview(appState.currentStep);
    });

    sortOrderSelect.addEventListener('change', () => {
        console.log('Grouping direction changed:', sortOrderSelect.value);
        grouping.sortOrder = sortOrderSelect.value;

        // Update the live preview
        updateLivePreview(appState.currentStep);
    });

    removeButton.addEventListener('click', () => {
        console.log('Removing grouping:', grouping);

        // Remove the grouping from the application state
        appState.groupings = appState.groupings.filter(g => g.id !== grouping.id);

        // Remove the grouping from the UI
        groupingElement.remove();

        // Check if there are no more groupings
        const groupingContainer = document.getElementById('groupingFieldsContainer');
        if (groupingContainer && (!appState.groupings || appState.groupings.length === 0)) {
            populateExistingGroupings(groupingContainer);
        }

        // Update the live preview
        updateLivePreview(appState.currentStep);

        // Show notification
        showNotification('Grouping removed', 'info');
    });

    return groupingElement;
}

// Add a new aggregation
function addAggregation(container) {
    console.log('Adding new aggregation');

    // Get the numeric fields that can be aggregated
    const aggregatableFields = appState.selectedFields.filter(field => field.type === 'number');

    if (aggregatableFields.length === 0) {
        showNotification('Please select numeric fields in the previous step before adding aggregations.', 'warning');
        return;
    }

    // Remove the no-aggregations-message if it exists
    const noAggregationsMessage = container.querySelector('.no-aggregations-message');
    if (noAggregationsMessage) {
        noAggregationsMessage.remove();
    }

    // Create a new aggregation object
    const aggregation = {
        id: Date.now(),
        field: aggregatableFields[0].name,
        function: 'sum',
        alias: `Sum of ${aggregatableFields[0].label || aggregatableFields[0].name}`
    };

    console.log('Created new aggregation:', aggregation);

    // Add the aggregation to the application state
    appState.aggregations.push(aggregation);

    // Add the aggregation to the UI
    const aggregationElement = createAggregationElement(aggregation);
    container.appendChild(aggregationElement);

    // Update the live preview
    updateLivePreview(appState.currentStep);

    // Show notification
    showNotification(`Aggregation "${aggregation.alias}" added`, 'success');
}

// Create an aggregation element
function createAggregationElement(aggregation) {
    const aggregationElement = document.createElement('div');
    aggregationElement.className = 'aggregation-item';
    aggregationElement.dataset.aggregationId = aggregation.id;

    // Create the function label
    const functionLabel = document.createElement('label');
    functionLabel.className = 'aggregation-label';
    functionLabel.textContent = 'Apply';

    // Create the function select
    const functionSelect = document.createElement('select');
    functionSelect.className = 'aggregation-function';

    // Add function options
    const functions = [
        { value: 'sum', label: 'Sum' },
        { value: 'avg', label: 'Average' },
        { value: 'min', label: 'Minimum' },
        { value: 'max', label: 'Maximum' },
        { value: 'count', label: 'Count' }
    ];

    functions.forEach(func => {
        const option = document.createElement('option');
        option.value = func.value;
        option.textContent = func.label;
        option.selected = func.value === aggregation.function;
        functionSelect.appendChild(option);
    });

    // Create the field label
    const fieldLabel = document.createElement('label');
    fieldLabel.className = 'aggregation-label';
    fieldLabel.textContent = 'of';

    // Create the field select
    const fieldSelect = document.createElement('select');
    fieldSelect.className = 'aggregation-field';

    // Add options for numeric fields
    const numericFields = appState.selectedFields.filter(field => field.type === 'number');
    numericFields.forEach(field => {
        const option = document.createElement('option');
        option.value = field.name;
        option.textContent = field.label || field.name;
        option.selected = field.name === aggregation.field;
        fieldSelect.appendChild(option);
    });

    // Create the alias label
    const aliasLabel = document.createElement('label');
    aliasLabel.className = 'aggregation-label';
    aliasLabel.textContent = 'as';

    // Create the alias input
    const aliasInput = document.createElement('input');
    aliasInput.className = 'aggregation-alias';
    aliasInput.type = 'text';
    aliasInput.value = aggregation.alias;
    aliasInput.placeholder = 'Display name';

    // Create the remove button
    const removeButton = document.createElement('button');
    removeButton.className = 'btn-icon';
    removeButton.innerHTML = '<i class="fas fa-trash"></i>';
    removeButton.title = 'Remove aggregation';

    // Add the elements to the aggregation
    aggregationElement.appendChild(functionLabel);
    aggregationElement.appendChild(functionSelect);
    aggregationElement.appendChild(fieldLabel);
    aggregationElement.appendChild(fieldSelect);
    aggregationElement.appendChild(aliasLabel);
    aggregationElement.appendChild(aliasInput);
    aggregationElement.appendChild(removeButton);

    // Set up event listeners
    functionSelect.addEventListener('change', () => {
        console.log('Aggregation function changed:', functionSelect.value);
        aggregation.function = functionSelect.value;

        // Update the alias
        const fieldName = fieldSelect.options[fieldSelect.selectedIndex].textContent;
        const funcName = functionSelect.options[functionSelect.selectedIndex].textContent;
        aliasInput.value = `${funcName} of ${fieldName}`;
        aggregation.alias = aliasInput.value;

        // Update the live preview
        updateLivePreview(appState.currentStep);
    });

    fieldSelect.addEventListener('change', () => {
        console.log('Aggregation field changed:', fieldSelect.value);
        aggregation.field = fieldSelect.value;

        // Update the alias
        const fieldName = fieldSelect.options[fieldSelect.selectedIndex].textContent;
        const funcName = functionSelect.options[functionSelect.selectedIndex].textContent;
        aliasInput.value = `${funcName} of ${fieldName}`;
        aggregation.alias = aliasInput.value;

        // Update the live preview
        updateLivePreview(appState.currentStep);
    });

    aliasInput.addEventListener('input', () => {
        aggregation.alias = aliasInput.value;
    });

    aliasInput.addEventListener('change', () => {
        console.log('Aggregation alias changed:', aliasInput.value);
        aggregation.alias = aliasInput.value;

        // Update the live preview
        updateLivePreview(appState.currentStep);
    });

    removeButton.addEventListener('click', () => {
        console.log('Removing aggregation:', aggregation);

        // Remove the aggregation from the application state
        appState.aggregations = appState.aggregations.filter(a => a.id !== aggregation.id);

        // Remove the aggregation from the UI
        aggregationElement.remove();

        // Check if there are no more aggregations
        const aggregationContainer = document.getElementById('aggregationContainer');
        if (aggregationContainer && (!appState.aggregations || appState.aggregations.length === 0)) {
            populateExistingAggregations(aggregationContainer);
        }

        // Update the live preview
        updateLivePreview(appState.currentStep);

        // Show notification
        showNotification('Aggregation removed', 'info');
    });

    return aggregationElement;
}

// Apply grouping and aggregation to the data
function applyGroupingAndAggregation(data) {
    if (!data || data.length === 0) {
        return [];
    }

    // If no groupings, return the original data
    if (appState.groupings.length === 0) {
        return data;
    }

    // Group the data
    const groupedData = {};

    data.forEach(row => {
        // Create a key based on the grouping fields
        const groupKey = appState.groupings.map(grouping => {
            const value = row[grouping.field];
            return value !== undefined && value !== null ? value.toString() : 'null';
        }).join('|');

        // If the group doesn't exist, create it
        if (!groupedData[groupKey]) {
            groupedData[groupKey] = {
                _group: {},
                _count: 0,
                _rows: []
            };

            // Add the grouping fields to the group
            appState.groupings.forEach(grouping => {
                groupedData[groupKey]._group[grouping.field] = row[grouping.field];
            });
        }

        // Increment the count
        groupedData[groupKey]._count++;

        // Add the row to the group
        groupedData[groupKey]._rows.push(row);
    });

    // Apply aggregations
    const result = [];

    Object.values(groupedData).forEach(group => {
        const resultRow = { ...group._group };

        // Add count
        resultRow._count = group._count;

        // Apply each aggregation
        appState.aggregations.forEach(aggregation => {
            const values = group._rows.map(row => row[aggregation.field]).filter(val => val !== undefined && val !== null);

            let aggregatedValue;

            switch (aggregation.function) {
                case 'sum':
                    aggregatedValue = values.reduce((sum, val) => sum + val, 0);
                    break;
                case 'avg':
                    aggregatedValue = values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
                    break;
                case 'min':
                    aggregatedValue = values.length > 0 ? Math.min(...values) : null;
                    break;
                case 'max':
                    aggregatedValue = values.length > 0 ? Math.max(...values) : null;
                    break;
                case 'count':
                    aggregatedValue = values.length;
                    break;
                default:
                    aggregatedValue = null;
            }

            resultRow[aggregation.alias] = aggregatedValue;
        });

        result.push(resultRow);
    });

    // Sort the result
    result.sort((a, b) => {
        for (const grouping of appState.groupings) {
            const aValue = a[grouping.field];
            const bValue = b[grouping.field];

            if (aValue === bValue) {
                continue;
            }

            const direction = grouping.sortOrder === 'asc' ? 1 : -1;

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

    return result;
}
