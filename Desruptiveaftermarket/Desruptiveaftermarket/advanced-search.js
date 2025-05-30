/**
 * Advanced Search Functionality
 *
 * This file provides advanced search functionality for the digital catalog,
 * allowing users to create complex search queries with multiple conditions.
 */

// Global variables
let advancedSearchModal;
let advancedSearchForm;
let searchConditions = [];
let currentConditionId = 0;

// Initialize advanced search
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Advanced Search...');

    // Get DOM elements
    advancedSearchModal = document.getElementById('advancedSearchModal');

    // Create advanced search form if it doesn't exist
    if (!document.getElementById('advancedSearchForm')) {
        createAdvancedSearchForm();
    }

    // Add event listener to advanced search button
    const advancedSearchBtn = document.getElementById('advancedSearchBtn');
    if (advancedSearchBtn) {
        advancedSearchBtn.addEventListener('click', openAdvancedSearch);
    }
});

// Create advanced search form
function createAdvancedSearchForm() {
    const modalContent = advancedSearchModal.querySelector('.modal-content');

    // Create form content
    modalContent.innerHTML = `
        <div class="modal-header">
            <h2 class="modal-title">
                <i class="material-icons">filter_alt</i>
                Advanced Search
            </h2>
            <button class="modal-close-btn" id="closeAdvancedSearchBtn">
                <i class="material-icons">close</i>
            </button>
        </div>
        <div class="modal-body">
            <form id="advancedSearchForm" class="advanced-search-form">
                <div class="search-intro">
                    <p>Create complex search queries with multiple conditions to find exactly what you need.</p>
                </div>

                <div class="search-conditions" id="searchConditions">
                    <!-- Search conditions will be added here -->
                </div>

                <div class="form-actions">
                    <button type="button" class="add-condition-btn" id="addConditionBtn">
                        <i class="material-icons">add_circle</i>
                        <span>Add Another Condition</span>
                    </button>
                </div>

                <div class="logical-operator">
                    <label>How should conditions be matched?</label>
                    <div class="operator-options">
                        <label class="operator-option">
                            <input type="radio" name="operator" value="AND" checked>
                            <span>Match ALL conditions (AND)</span>
                            <div class="operator-hint">All conditions must be true</div>
                        </label>
                        <label class="operator-option">
                            <input type="radio" name="operator" value="OR">
                            <span>Match ANY condition (OR)</span>
                            <div class="operator-hint">At least one condition must be true</div>
                        </label>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="button" class="mdc-button mdc-button--outlined" id="resetAdvancedSearchBtn">
                        <span class="mdc-button__ripple"></span>
                        <i class="material-icons">refresh</i>
                        <span class="mdc-button__label">Reset</span>
                    </button>
                    <button type="button" class="mdc-button mdc-button--raised" id="applyAdvancedSearchBtn">
                        <span class="mdc-button__ripple"></span>
                        <i class="material-icons">search</i>
                        <span class="mdc-button__label">Apply Search</span>
                    </button>
                </div>
            </form>
        </div>
    `;

    // Get form element
    advancedSearchForm = document.getElementById('advancedSearchForm');

    // Add event listeners
    document.getElementById('closeAdvancedSearchBtn').addEventListener('click', closeAdvancedSearch);
    document.getElementById('addConditionBtn').addEventListener('click', addSearchCondition);
    document.getElementById('resetAdvancedSearchBtn').addEventListener('click', resetAdvancedSearch);
    document.getElementById('applyAdvancedSearchBtn').addEventListener('click', applyAdvancedSearch);

    // Add initial condition
    addSearchCondition();
}

// Open advanced search modal
function openAdvancedSearch() {
    advancedSearchModal.classList.add('open');
    document.getElementById('overlay').classList.add('active');
    document.body.classList.add('no-scroll');
}

// Close advanced search modal
function closeAdvancedSearch() {
    advancedSearchModal.classList.remove('open');
    document.getElementById('overlay').classList.remove('active');
    document.body.classList.remove('no-scroll');
}

// Add search condition
function addSearchCondition() {
    const conditionsContainer = document.getElementById('searchConditions');
    const conditionId = currentConditionId++;

    // Create condition element
    const conditionElement = document.createElement('div');
    conditionElement.className = 'search-condition';
    conditionElement.dataset.id = conditionId;

    // Get available fields
    const fields = getSearchableFields();

    // Create field options HTML
    const fieldOptions = fields.map(field =>
        `<option value="${field.value}">${field.label}</option>`
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
            <div class="condition-field">
                <label class="field-label">Field</label>
                <select class="field-select" data-id="${conditionId}">
                    ${fieldOptions}
                </select>
            </div>
            <div class="condition-operator">
                <label class="field-label">Operator</label>
                <select class="operator-select" data-id="${conditionId}">
                    ${operatorOptions}
                </select>
            </div>
            <div class="condition-value">
                <label class="field-label">Value</label>
                <input type="text" class="value-input" data-id="${conditionId}" placeholder="Enter search value">
            </div>
            <div class="condition-actions">
                <button type="button" class="remove-condition-btn" data-id="${conditionId}" title="Remove condition">
                    <i class="material-icons">delete_outline</i>
                </button>
            </div>
        </div>
    `;

    // Add to container
    conditionsContainer.appendChild(conditionElement);

    // Add event listener to remove button
    conditionElement.querySelector('.remove-condition-btn').addEventListener('click', function() {
        removeSearchCondition(conditionId);
    });

    // Add event listener to field select
    conditionElement.querySelector('.field-select').addEventListener('change', function() {
        updateValueInput(conditionId);
    });

    // Initialize value input based on selected field
    updateValueInput(conditionId);

    // Add to search conditions array
    searchConditions.push({
        id: conditionId,
        field: fields[0].value,
        operator: 'equals',
        value: ''
    });
}

// Remove search condition
function removeSearchCondition(conditionId) {
    // Remove from DOM
    const conditionElement = document.querySelector(`.search-condition[data-id="${conditionId}"]`);
    if (conditionElement) {
        conditionElement.remove();
    }

    // Remove from array
    searchConditions = searchConditions.filter(condition => condition.id !== conditionId);

    // If no conditions left, add one
    if (searchConditions.length === 0) {
        addSearchCondition();
    }
}

// Update value input based on selected field
function updateValueInput(conditionId) {
    const fieldSelect = document.querySelector(`.field-select[data-id="${conditionId}"]`);
    const valueInput = document.querySelector(`.value-input[data-id="${conditionId}"]`);

    if (!fieldSelect || !valueInput) return;

    const selectedField = fieldSelect.value;
    const fieldType = getFieldType(selectedField);

    // Update value input based on field type
    switch (fieldType) {
        case 'number':
            valueInput.type = 'number';
            valueInput.step = '0.01';
            break;
        case 'date':
            valueInput.type = 'date';
            break;
        case 'boolean':
            // Replace input with select
            const selectHtml = `
                <select class="value-input" data-id="${conditionId}">
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </select>
            `;
            valueInput.parentNode.innerHTML = selectHtml;
            break;
        default:
            valueInput.type = 'text';
            break;
    }

    // Update condition in array
    const condition = searchConditions.find(c => c.id === conditionId);
    if (condition) {
        condition.field = selectedField;
    }
}

// Reset advanced search
function resetAdvancedSearch() {
    // Clear conditions
    searchConditions = [];
    document.getElementById('searchConditions').innerHTML = '';

    // Reset operator
    document.querySelector('input[name="operator"][value="AND"]').checked = true;

    // Add initial condition
    addSearchCondition();
}

// Apply advanced search
function applyAdvancedSearch() {
    // Get logical operator
    const operator = document.querySelector('input[name="operator"]:checked').value;

    // Get conditions
    const conditions = [];
    searchConditions.forEach(condition => {
        const fieldSelect = document.querySelector(`.field-select[data-id="${condition.id}"]`);
        const operatorSelect = document.querySelector(`.operator-select[data-id="${condition.id}"]`);
        const valueInput = document.querySelector(`.value-input[data-id="${condition.id}"]`);

        if (fieldSelect && operatorSelect && valueInput && valueInput.value.trim() !== '') {
            conditions.push({
                field: fieldSelect.value,
                operator: operatorSelect.value,
                value: valueInput.value
            });
        }
    });

    // Apply search
    if (typeof applyAdvancedFilters === 'function') {
        applyAdvancedFilters(conditions, operator);
    } else if (typeof window.applyAdvancedFilters === 'function') {
        window.applyAdvancedFilters(conditions, operator);
    } else {
        console.error('applyAdvancedFilters function not found');
    }

    // Close modal
    closeAdvancedSearch();
}

// Get searchable fields
function getSearchableFields() {
    return [
        { value: 'name', label: 'Product Name' },
        { value: 'description', label: 'Description' },
        { value: 'category', label: 'Category' },
        { value: 'manufacturer', label: 'Manufacturer' },
        { value: 'price', label: 'Price' },
        { value: 'stock', label: 'Stock' },
        { value: 'rating', label: 'Rating' }
    ];
}

// Get field type
function getFieldType(field) {
    switch (field) {
        case 'price':
        case 'stock':
        case 'rating':
            return 'number';
        case 'dateAdded':
        case 'lastUpdated':
            return 'date';
        case 'isActive':
            return 'boolean';
        default:
            return 'text';
    }
}

// Export functions
window.openAdvancedSearch = openAdvancedSearch;
window.closeAdvancedSearch = closeAdvancedSearch;
