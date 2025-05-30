/**
 * Advanced Filter Functionality
 *
 * This file provides a modern, user-friendly advanced filter interface
 * for the digital catalog, allowing users to create complex filter queries.
 */

// Global variables
let advancedFilterPanel;
let filterConditions = [];
let currentFilterId = 0;
let availableColumns = [];

// Initialize advanced filter
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Advanced Filter...');

    // Create advanced filter panel if it doesn't exist
    if (!document.getElementById('advancedFilterPanel')) {
        createAdvancedFilterPanel();
    }

    // Add event listener to advanced filter button
    const advancedFilterBtn = document.getElementById('advancedFilterBtn');
    if (advancedFilterBtn) {
        advancedFilterBtn.addEventListener('click', toggleAdvancedFilter);
    }

    // Initialize available columns
    initializeAvailableColumns();
});

// Initialize available columns for filtering
function initializeAvailableColumns() {
    availableColumns = [
        { value: 'name', label: 'Product Name', type: 'text' },
        { value: 'description', label: 'Description', type: 'text' },
        { value: 'category', label: 'Category', type: 'select' },
        { value: 'manufacturer', label: 'Manufacturer', type: 'select' },
        { value: 'price', label: 'Price', type: 'number' },
        { value: 'stock', label: 'Stock', type: 'number' },
        { value: 'rating', label: 'Rating', type: 'number' },
        { value: 'dateAdded', label: 'Date Added', type: 'date' },
        { value: 'reviewCount', label: 'Review Count', type: 'number' }
    ];
}

// Create advanced filter panel
function createAdvancedFilterPanel() {
    // Create panel element
    advancedFilterPanel = document.createElement('div');
    advancedFilterPanel.id = 'advancedFilterPanel';
    advancedFilterPanel.className = 'advanced-filter-panel';

    // Create panel content
    advancedFilterPanel.innerHTML = `
        <div class="filter-panel-header">
            <h2 class="filter-panel-title">
                <i class="material-icons">filter_alt</i>
                Advanced Filter
            </h2>
            <button class="filter-panel-close-btn" id="closeFilterPanelBtn">
                <i class="material-icons">close</i>
            </button>
        </div>
        <div class="filter-panel-body">
            <div class="filter-intro">
                <p>Create complex filters with multiple conditions to find exactly what you need.</p>
            </div>

            <div class="filter-section">
                <h3 class="filter-section-title">Filter Conditions</h3>
                <div class="filter-conditions" id="filterConditions">
                    <!-- Filter conditions will be added here -->
                </div>
                <button type="button" class="add-condition-btn" id="addFilterConditionBtn">
                    <i class="material-icons">add_circle</i>
                    <span>Add Condition</span>
                </button>
            </div>

            <div class="filter-section">
                <h3 class="filter-section-title">Logical Operator</h3>
                <div class="logical-operator">
                    <div class="operator-options">
                        <label class="operator-option">
                            <input type="radio" name="filterOperator" value="AND" checked>
                            <span>Match ALL conditions (AND)</span>
                            <div class="operator-hint">All conditions must be true</div>
                        </label>
                        <label class="operator-option">
                            <input type="radio" name="filterOperator" value="OR">
                            <span>Match ANY condition (OR)</span>
                            <div class="operator-hint">At least one condition must be true</div>
                        </label>
                    </div>
                </div>
            </div>

            <div class="filter-section">
                <h3 class="filter-section-title">Applied Filters</h3>
                <div class="applied-filter-list" id="appliedFilterList">
                    <div class="no-filters-message">No filters applied</div>
                </div>
            </div>
        </div>
        <div class="filter-panel-footer">
            <button type="button" class="mdc-button mdc-button--outlined" id="resetFilterBtn">
                <span class="mdc-button__ripple"></span>
                <i class="material-icons">refresh</i>
                <span class="mdc-button__label">Reset</span>
            </button>
            <button type="button" class="mdc-button mdc-button--raised" id="applyFilterBtn">
                <span class="mdc-button__ripple"></span>
                <i class="material-icons">search</i>
                <span class="mdc-button__label">Apply Filter</span>
            </button>
        </div>
    `;

    // Add to document
    document.body.appendChild(advancedFilterPanel);

    // Add event listeners
    document.getElementById('closeFilterPanelBtn').addEventListener('click', toggleAdvancedFilter);
    document.getElementById('addFilterConditionBtn').addEventListener('click', addFilterCondition);
    document.getElementById('resetFilterBtn').addEventListener('click', resetFilter);
    document.getElementById('applyFilterBtn').addEventListener('click', applyFilter);

    // Add initial condition
    addFilterCondition();
}

// Toggle advanced filter panel
function toggleAdvancedFilter() {
    const panel = document.getElementById('advancedFilterPanel');
    const overlay = document.getElementById('overlay');

    if (panel.classList.contains('open')) {
        panel.classList.remove('open');
        overlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
    } else {
        panel.classList.add('open');
        overlay.classList.add('active');
        document.body.classList.add('no-scroll');
    }
}

// Add filter condition
function addFilterCondition() {
    const conditionsContainer = document.getElementById('filterConditions');
    const filterId = currentFilterId++;

    // Create condition element
    const conditionElement = document.createElement('div');
    conditionElement.className = 'filter-condition';
    conditionElement.dataset.id = filterId;

    // Create column options HTML
    const columnOptions = availableColumns.map(column =>
        `<option value="${column.value}">${column.label}</option>`
    ).join('');

    // Create operators HTML
    const operators = [
        { value: 'equals', label: 'Equals' },
        { value: 'not_equals', label: 'Not Equals' },
        { value: 'contains', label: 'Contains' },
        { value: 'starts_with', label: 'Starts With' },
        { value: 'ends_with', label: 'Ends With' },
        { value: 'greater_than', label: 'Greater Than' },
        { value: 'less_than', label: 'Less Than' }
    ];

    const operatorOptions = operators.map(op =>
        `<option value="${op.value}">${op.label}</option>`
    ).join('');

    // Set condition HTML
    conditionElement.innerHTML = `
        <div class="condition-row">
            <div class="condition-column">
                <label class="field-label">Column</label>
                <select class="column-select" data-id="${filterId}">
                    ${columnOptions}
                </select>
            </div>
            <div class="condition-operator">
                <label class="field-label">Operator</label>
                <select class="operator-select" data-id="${filterId}">
                    ${operatorOptions}
                </select>
            </div>
            <div class="condition-value">
                <label class="field-label">Value</label>
                <input type="text" class="value-input" data-id="${filterId}" placeholder="Enter filter value">
            </div>
            <div class="condition-actions">
                <button type="button" class="remove-condition-btn" data-id="${filterId}" title="Remove condition">
                    <i class="material-icons">delete_outline</i>
                </button>
            </div>
        </div>
    `;

    // Add to container
    conditionsContainer.appendChild(conditionElement);

    // Add event listener to remove button
    conditionElement.querySelector('.remove-condition-btn').addEventListener('click', function() {
        removeFilterCondition(filterId);
    });

    // Add event listener to column select
    conditionElement.querySelector('.column-select').addEventListener('change', function() {
        updateValueInput(filterId);
    });

    // Initialize value input based on selected column
    updateValueInput(filterId);

    // Add to filter conditions array
    filterConditions.push({
        id: filterId,
        column: availableColumns[0].value,
        operator: 'equals',
        value: ''
    });
}

// Remove filter condition
function removeFilterCondition(filterId) {
    // Remove from DOM
    const conditionElement = document.querySelector(`.filter-condition[data-id="${filterId}"]`);
    if (conditionElement) {
        conditionElement.remove();
    }

    // Remove from array
    filterConditions = filterConditions.filter(condition => condition.id !== filterId);

    // If no conditions left, add one
    if (filterConditions.length === 0) {
        addFilterCondition();
    }
}

// Update value input based on selected column
function updateValueInput(filterId) {
    const columnSelect = document.querySelector(`.column-select[data-id="${filterId}"]`);
    const valueInput = document.querySelector(`.value-input[data-id="${filterId}"]`);

    if (!columnSelect || !valueInput) return;

    const selectedColumn = columnSelect.value;
    const columnType = getColumnType(selectedColumn);

    // Update value input based on column type
    switch (columnType) {
        case 'number':
            valueInput.type = 'number';
            valueInput.step = '0.01';
            break;
        case 'date':
            valueInput.type = 'date';
            break;
        case 'select':
            // Replace input with select for category and manufacturer
            const options = getOptionsForColumn(selectedColumn);
            const selectHtml = `
                <select class="value-input" data-id="${filterId}">
                    <option value="">Select ${selectedColumn}</option>
                    ${options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                </select>
            `;
            valueInput.parentNode.innerHTML = `
                <label class="field-label">Value</label>
                ${selectHtml}
            `;
            break;
        default:
            valueInput.type = 'text';
            break;
    }

    // Update condition in array
    const condition = filterConditions.find(c => c.id === filterId);
    if (condition) {
        condition.column = selectedColumn;
    }
}

// Get column type
function getColumnType(column) {
    const columnDef = availableColumns.find(col => col.value === column);
    return columnDef ? columnDef.type : 'text';
}

// Get options for column (for select type columns)
function getOptionsForColumn(column) {
    // This would normally fetch from the data
    // For now, return sample options
    if (column === 'category') {
        return ['Filters', 'Brakes', 'Electrical', 'Fluids', 'Ignition'];
    } else if (column === 'manufacturer') {
        return ['FilterCorp', 'BrakeMasters', 'ElectroParts', 'LubeTech', 'SparkTech'];
    }
    return [];
}

// Reset filter
function resetFilter() {
    // Clear conditions
    filterConditions = [];
    document.getElementById('filterConditions').innerHTML = '';

    // Reset operator
    document.querySelector('input[name="filterOperator"][value="AND"]').checked = true;

    // Add initial condition
    addFilterCondition();

    // Clear applied filters
    document.getElementById('appliedFilterList').innerHTML = '<div class="no-filters-message">No filters applied</div>';
}

// Apply filter
function applyFilter() {
    // Get logical operator
    const operator = document.querySelector('input[name="filterOperator"]:checked').value;

    // Get conditions
    const conditions = [];
    filterConditions.forEach(condition => {
        const columnSelect = document.querySelector(`.column-select[data-id="${condition.id}"]`);
        const operatorSelect = document.querySelector(`.operator-select[data-id="${condition.id}"]`);
        const valueInput = document.querySelector(`.value-input[data-id="${condition.id}"]`);

        if (columnSelect && operatorSelect && valueInput && valueInput.value.trim() !== '') {
            conditions.push({
                field: columnSelect.value, // Use 'field' instead of 'column' to match existing code
                operator: operatorSelect.value,
                value: valueInput.value
            });
        }
    });

    // Update applied filters display
    updateAppliedFilters(conditions, operator);

    // Apply filter to products
    if (typeof window.applyAdvancedFilters === 'function') {
        // Call the existing function in modern-catalog.js
        window.applyAdvancedFilters(conditions, operator);
    } else {
        console.error('applyAdvancedFilters function not found');
    }

    // Close panel
    toggleAdvancedFilter();
}

// Update applied filters display
function updateAppliedFilters(conditions, operator) {
    const appliedFilterList = document.getElementById('appliedFilterList');

    if (conditions.length === 0) {
        appliedFilterList.innerHTML = '<div class="no-filters-message">No filters applied</div>';
        return;
    }

    let html = '';
    conditions.forEach((condition, index) => {
        const columnLabel = getColumnLabel(condition.column);
        const operatorLabel = getOperatorLabel(condition.operator);

        html += `
            <div class="applied-filter">
                <span class="filter-text">${columnLabel} ${operatorLabel} "${condition.value}"</span>
                ${index < conditions.length - 1 ? `<span class="filter-connector">${operator}</span>` : ''}
            </div>
        `;
    });

    appliedFilterList.innerHTML = html;
}

// Get column label
function getColumnLabel(column) {
    const columnDef = availableColumns.find(col => col.value === column);
    return columnDef ? columnDef.label : column;
}

// Get operator label
function getOperatorLabel(operator) {
    const operators = {
        'equals': 'equals',
        'not_equals': 'does not equal',
        'contains': 'contains',
        'starts_with': 'starts with',
        'ends_with': 'ends with',
        'greater_than': 'is greater than',
        'less_than': 'is less than'
    };

    return operators[operator] || operator;
}

// Export functions
window.toggleAdvancedFilter = toggleAdvancedFilter;
window.resetFilter = resetFilter;
window.applyFilter = applyFilter;
