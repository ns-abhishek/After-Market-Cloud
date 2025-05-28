/**
 * Report Wizard - Data Selection Module
 *
 * This module handles field selection and filtering functionality.
 */

// Initialize the data selection step
function initDataSelectionStep() {
    console.log('Initializing data selection step');

    // Get the DOM elements
    const availableFieldsList = document.getElementById('availableFieldsList');
    const selectedFieldsList = document.getElementById('selectedFieldsList');
    const fieldSearchInput = document.getElementById('fieldSearchInput');
    const addFilterBtn = document.getElementById('addFilterBtn');
    const filtersContainer = document.getElementById('filtersContainer');

    // Check if we have data fields
    if (!appState.dataFields || appState.dataFields.length === 0) {
        // If we don't have data fields, we need to load sample data
        console.log('No data fields found, loading sample data');
        loadSampleData('sales');
    }

    console.log('Data fields:', appState.dataFields);
    console.log('Selected fields:', appState.selectedFields);

    // Populate the available fields list
    populateAvailableFields(availableFieldsList);

    // Populate the selected fields list (if any fields were previously selected)
    populateSelectedFields(selectedFieldsList);

    // Set up the search functionality
    if (fieldSearchInput) {
        fieldSearchInput.addEventListener('input', () => {
            filterAvailableFields(fieldSearchInput.value, availableFieldsList);
        });
    }

    // Set up drag and drop for field selection
    if (availableFieldsList && selectedFieldsList) {
        setupFieldDragAndDrop(availableFieldsList, selectedFieldsList);
    }

    // Set up the add filter button
    if (addFilterBtn) {
        addFilterBtn.addEventListener('click', () => {
            addFilter(filtersContainer);
        });
    }

    // Populate existing filters (if any)
    if (filtersContainer) {
        populateExistingFilters(filtersContainer);
    }

    // Update the live preview
    updateLivePreview(2);

    console.log('Data selection step initialized');
}

// Populate the available fields list
function populateAvailableFields(container) {
    // Clear the container
    container.innerHTML = '';

    // Get the fields that are not already selected
    const availableFields = appState.dataFields.filter(field =>
        !appState.selectedFields.some(selectedField => selectedField.name === field.name)
    );

    // Add each field to the container
    availableFields.forEach(field => {
        const fieldElement = createFieldElement(field);
        container.appendChild(fieldElement);
    });

    // If no fields are available, show a message
    if (availableFields.length === 0) {
        const noFieldsMessage = document.createElement('div');
        noFieldsMessage.className = 'no-fields-message';
        noFieldsMessage.textContent = 'All fields have been selected.';
        container.appendChild(noFieldsMessage);
    }
}

// Populate the selected fields list
function populateSelectedFields(container) {
    // Clear the container
    container.innerHTML = '';

    // Add each selected field to the container
    appState.selectedFields.forEach(field => {
        const fieldElement = createFieldElement(field, true);
        container.appendChild(fieldElement);
    });

    // If no fields are selected, show a message
    if (appState.selectedFields.length === 0) {
        const noFieldsMessage = document.createElement('div');
        noFieldsMessage.className = 'no-fields-message';
        noFieldsMessage.textContent = 'No fields selected. Drag fields from the available fields list.';
        container.appendChild(noFieldsMessage);
    }
}

// Create a field element for the fields list
function createFieldElement(field, isSelected = false) {
    const fieldElement = document.createElement('div');
    fieldElement.className = 'field-item';
    fieldElement.draggable = true;
    fieldElement.dataset.fieldName = field.name;

    // Add field type icon
    const iconElement = document.createElement('i');
    switch (field.type) {
        case 'string':
            iconElement.className = 'fas fa-font';
            break;
        case 'number':
            iconElement.className = 'fas fa-hashtag';
            break;
        case 'date':
            iconElement.className = 'fas fa-calendar-alt';
            break;
        case 'boolean':
            iconElement.className = 'fas fa-toggle-on';
            break;
        default:
            iconElement.className = 'fas fa-question';
    }
    fieldElement.appendChild(iconElement);

    // Add field label
    const labelElement = document.createElement('span');
    labelElement.textContent = field.label || field.name;
    fieldElement.appendChild(labelElement);

    // Add actions
    const actionsElement = document.createElement('div');
    actionsElement.className = 'field-actions';

    if (isSelected) {
        // Add remove button for selected fields
        const removeButton = document.createElement('button');
        removeButton.className = 'btn-icon';
        removeButton.innerHTML = '<i class="fas fa-times"></i>';
        removeButton.title = 'Remove field';
        removeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            removeSelectedField(field.name);

            // Update the live preview
            updateLivePreview(appState.currentStep);
        });
        actionsElement.appendChild(removeButton);
    } else {
        // Add add button for available fields
        const addButton = document.createElement('button');
        addButton.className = 'btn-icon';
        addButton.innerHTML = '<i class="fas fa-plus"></i>';
        addButton.title = 'Add field';
        addButton.addEventListener('click', (e) => {
            e.stopPropagation();
            addSelectedField(field);

            // Update the live preview
            updateLivePreview(appState.currentStep);
        });
        actionsElement.appendChild(addButton);
    }

    fieldElement.appendChild(actionsElement);

    // Set up drag events
    fieldElement.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', field.name);
        fieldElement.classList.add('dragging');
    });

    fieldElement.addEventListener('dragend', () => {
        fieldElement.classList.remove('dragging');
    });

    // Add click event to add/remove field
    fieldElement.addEventListener('click', () => {
        if (isSelected) {
            removeSelectedField(field.name);
        } else {
            addSelectedField(field);
        }

        // Update the live preview
        updateLivePreview(appState.currentStep);
    });

    return fieldElement;
}

// Filter the available fields based on search input
function filterAvailableFields(searchText, container) {
    const fieldItems = container.querySelectorAll('.field-item');
    const searchLower = searchText.toLowerCase();

    fieldItems.forEach(item => {
        const fieldName = item.dataset.fieldName;
        const field = appState.dataFields.find(f => f.name === fieldName);

        if (field) {
            const fieldLabel = (field.label || field.name).toLowerCase();
            if (fieldLabel.includes(searchLower) || fieldName.toLowerCase().includes(searchLower)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        }
    });
}

// Set up drag and drop for field selection
function setupFieldDragAndDrop(availableContainer, selectedContainer) {
    // Make the selected container a drop target
    selectedContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        selectedContainer.classList.add('drag-over');
    });

    selectedContainer.addEventListener('dragleave', () => {
        selectedContainer.classList.remove('drag-over');
    });

    selectedContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        selectedContainer.classList.remove('drag-over');

        const fieldName = e.dataTransfer.getData('text/plain');
        const field = appState.dataFields.find(f => f.name === fieldName);

        if (field && !appState.selectedFields.some(f => f.name === fieldName)) {
            addSelectedField(field);

            // Update the live preview
            updateLivePreview(appState.currentStep);
        }
    });

    // Make the available container a drop target for removing fields
    availableContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        availableContainer.classList.add('drag-over');
    });

    availableContainer.addEventListener('dragleave', () => {
        availableContainer.classList.remove('drag-over');
    });

    availableContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        availableContainer.classList.remove('drag-over');

        const fieldName = e.dataTransfer.getData('text/plain');

        if (appState.selectedFields.some(f => f.name === fieldName)) {
            removeSelectedField(fieldName);

            // Update the live preview
            updateLivePreview(appState.currentStep);
        }
    });

    // Add double-click functionality as an alternative to drag and drop
    availableContainer.addEventListener('dblclick', (e) => {
        const fieldItem = e.target.closest('.field-item');
        if (fieldItem) {
            const fieldName = fieldItem.dataset.fieldName;
            const field = appState.dataFields.find(f => f.name === fieldName);

            if (field && !appState.selectedFields.some(f => f.name === fieldName)) {
                addSelectedField(field);
            }
        }
    });

    selectedContainer.addEventListener('dblclick', (e) => {
        const fieldItem = e.target.closest('.field-item');
        if (fieldItem) {
            const fieldName = fieldItem.dataset.fieldName;

            if (appState.selectedFields.some(f => f.name === fieldName)) {
                removeSelectedField(fieldName);
            }
        }
    });
}

// Add a field to the selected fields
function addSelectedField(field) {
    console.log('Adding field to selected fields:', field);

    // Check if the field is already selected
    if (appState.selectedFields.some(f => f.name === field.name)) {
        console.log('Field already selected, skipping');
        return;
    }

    // Add the field to the selected fields
    appState.selectedFields.push(field);
    console.log('Updated selected fields:', appState.selectedFields);

    // Update the UI
    const availableFieldsList = document.getElementById('availableFieldsList');
    const selectedFieldsList = document.getElementById('selectedFieldsList');

    if (availableFieldsList && selectedFieldsList) {
        populateAvailableFields(availableFieldsList);
        populateSelectedFields(selectedFieldsList);

        // Show a success notification
        showNotification(`Field "${field.label || field.name}" added to report`, 'success');

        // Update the live preview
        updateLivePreview(appState.currentStep);
    } else {
        console.error('Could not find field lists in the DOM');
    }
}

// Remove a field from the selected fields
function removeSelectedField(fieldName) {
    console.log('Removing field from selected fields:', fieldName);

    // Get the field label before removing it
    const field = appState.selectedFields.find(f => f.name === fieldName);
    const fieldLabel = field ? (field.label || field.name) : fieldName;

    // Remove the field from the selected fields
    appState.selectedFields = appState.selectedFields.filter(f => f.name !== fieldName);
    console.log('Updated selected fields:', appState.selectedFields);

    // Update the UI
    const availableFieldsList = document.getElementById('availableFieldsList');
    const selectedFieldsList = document.getElementById('selectedFieldsList');

    if (availableFieldsList && selectedFieldsList) {
        populateAvailableFields(availableFieldsList);
        populateSelectedFields(selectedFieldsList);

        // Show a success notification
        showNotification(`Field "${fieldLabel}" removed from report`, 'info');

        // Update the live preview
        updateLivePreview(appState.currentStep);
    } else {
        console.error('Could not find field lists in the DOM');
    }
}

// Add a new filter
function addFilter(container) {
    console.log('Adding new filter');

    // Use selected fields for filtering if available, otherwise use all fields
    const fieldsToUse = appState.selectedFields.length > 0 ? appState.selectedFields : appState.dataFields;

    if (fieldsToUse.length === 0) {
        showNotification('Please select at least one field before adding a filter.', 'warning');
        return;
    }

    // Get the first field to use
    const firstField = fieldsToUse[0];

    // Create a new filter object
    const filter = {
        id: Date.now(),
        field: firstField?.name || '',
        operator: 'equals',
        value: ''
    };

    console.log('Created new filter:', filter);

    // Add the filter to the application state
    appState.filters.push(filter);

    // Add the filter to the UI
    const filterElement = createFilterElement(filter);
    container.appendChild(filterElement);

    // Update the live preview
    updateLivePreview(appState.currentStep);

    console.log('Filter added:', filter);
}

// Create a filter element
function createFilterElement(filter) {
    const filterElement = document.createElement('div');
    filterElement.className = 'filter-item';
    filterElement.dataset.filterId = filter.id;

    // Create the filter field select
    const fieldSelect = document.createElement('select');
    fieldSelect.className = 'filter-field';

    // Use selected fields for filtering if available, otherwise use all fields
    const fieldsToUse = appState.selectedFields.length > 0 ? appState.selectedFields : appState.dataFields;

    // Add options for each field
    fieldsToUse.forEach(field => {
        const option = document.createElement('option');
        option.value = field.name;
        option.textContent = field.label || field.name;
        option.selected = field.name === filter.field;
        fieldSelect.appendChild(option);
    });

    // Create the operator select
    const operatorSelect = document.createElement('select');
    operatorSelect.className = 'filter-operator';

    // Get the field type
    const fieldType = appState.dataFields.find(f => f.name === filter.field)?.type || 'string';

    // Add options based on field type
    const operators = getOperatorsForFieldType(fieldType);
    operators.forEach(op => {
        const option = document.createElement('option');
        option.value = op.value;
        option.textContent = op.label;
        option.selected = op.value === filter.operator;
        operatorSelect.appendChild(option);
    });

    // Create the value input
    const valueInput = document.createElement('input');
    valueInput.className = 'filter-value';
    valueInput.type = getInputTypeForFieldType(fieldType);
    valueInput.value = filter.value || '';
    valueInput.placeholder = 'Enter value...';

    // If the operator is is_empty or is_not_empty, disable the value input
    if (filter.operator === 'is_empty' || filter.operator === 'is_not_empty') {
        valueInput.disabled = true;
        valueInput.placeholder = 'No value needed';
    }

    // Create the remove button
    const removeButton = document.createElement('button');
    removeButton.className = 'btn-icon';
    removeButton.innerHTML = '<i class="fas fa-trash"></i>';
    removeButton.title = 'Remove filter';

    // Add the elements to the filter
    filterElement.appendChild(fieldSelect);
    filterElement.appendChild(operatorSelect);
    filterElement.appendChild(valueInput);
    filterElement.appendChild(removeButton);

    // Set up event listeners
    fieldSelect.addEventListener('change', () => {
        const fieldName = fieldSelect.value;
        const field = appState.dataFields.find(f => f.name === fieldName);
        const fieldType = field?.type || 'string';

        console.log('Filter field changed:', fieldName, fieldType);

        // Update the filter in the application state
        filter.field = fieldName;

        // Update the operator select
        updateOperatorSelect(operatorSelect, fieldType);

        // Update the value input
        valueInput.type = getInputTypeForFieldType(fieldType);
        valueInput.value = '';
        filter.value = '';

        // Update the live preview
        updateLivePreview(appState.currentStep);
    });

    operatorSelect.addEventListener('change', () => {
        console.log('Filter operator changed:', operatorSelect.value);
        filter.operator = operatorSelect.value;

        // Handle special operators that don't need a value
        if (filter.operator === 'is_empty' || filter.operator === 'is_not_empty') {
            valueInput.disabled = true;
            valueInput.placeholder = 'No value needed';
            valueInput.value = '';
            filter.value = '';
        } else {
            valueInput.disabled = false;
            valueInput.placeholder = 'Enter value...';
        }

        // Update the live preview
        updateLivePreview(appState.currentStep);
    });

    valueInput.addEventListener('input', () => {
        filter.value = valueInput.value;
    });

    // Add a debounced update for the value input to avoid too many updates
    valueInput.addEventListener('change', () => {
        console.log('Filter value changed:', valueInput.value);
        filter.value = valueInput.value;

        // Update the live preview
        updateLivePreview(appState.currentStep);
    });

    removeButton.addEventListener('click', () => {
        console.log('Removing filter:', filter);

        // Remove the filter from the application state
        appState.filters = appState.filters.filter(f => f.id !== filter.id);

        // Remove the filter from the UI
        filterElement.remove();

        // Check if there are no more filters
        const filtersContainer = document.getElementById('filtersContainer');
        if (filtersContainer && appState.filters.length === 0) {
            populateExistingFilters(filtersContainer);
        }

        // Update the live preview
        updateLivePreview(appState.currentStep);

        // Show notification
        showNotification('Filter removed', 'info');
    });

    return filterElement;
}

// Update the operator select based on field type
function updateOperatorSelect(operatorSelect, fieldType) {
    // Clear the select
    operatorSelect.innerHTML = '';

    // Add options based on field type
    const operators = getOperatorsForFieldType(fieldType);
    operators.forEach(op => {
        const option = document.createElement('option');
        option.value = op.value;
        option.textContent = op.label;
        operatorSelect.appendChild(option);
    });

    // Set the first operator as selected
    if (operators.length > 0) {
        operatorSelect.value = operators[0].value;
    }
}

// Get the operators for a field type
function getOperatorsForFieldType(fieldType) {
    switch (fieldType) {
        case 'number':
            return [
                { value: 'equals', label: 'Equals' },
                { value: 'not_equals', label: 'Not Equals' },
                { value: 'greater_than', label: 'Greater Than' },
                { value: 'less_than', label: 'Less Than' },
                { value: 'greater_than_or_equals', label: 'Greater Than or Equals' },
                { value: 'less_than_or_equals', label: 'Less Than or Equals' },
                { value: 'between', label: 'Between' },
                { value: 'is_empty', label: 'Is Empty' },
                { value: 'is_not_empty', label: 'Is Not Empty' }
            ];
        case 'date':
            return [
                { value: 'equals', label: 'Equals' },
                { value: 'not_equals', label: 'Not Equals' },
                { value: 'after', label: 'After' },
                { value: 'before', label: 'Before' },
                { value: 'between', label: 'Between' },
                { value: 'is_empty', label: 'Is Empty' },
                { value: 'is_not_empty', label: 'Is Not Empty' }
            ];
        case 'boolean':
            return [
                { value: 'equals', label: 'Equals' },
                { value: 'not_equals', label: 'Not Equals' }
            ];
        case 'string':
        default:
            return [
                { value: 'equals', label: 'Equals' },
                { value: 'not_equals', label: 'Not Equals' },
                { value: 'contains', label: 'Contains' },
                { value: 'not_contains', label: 'Not Contains' },
                { value: 'starts_with', label: 'Starts With' },
                { value: 'ends_with', label: 'Ends With' },
                { value: 'is_empty', label: 'Is Empty' },
                { value: 'is_not_empty', label: 'Is Not Empty' }
            ];
    }
}

// Get the input type for a field type
function getInputTypeForFieldType(fieldType) {
    switch (fieldType) {
        case 'number':
            return 'number';
        case 'date':
            return 'date';
        case 'boolean':
            return 'checkbox';
        case 'string':
        default:
            return 'text';
    }
}

// Populate existing filters
function populateExistingFilters(container) {
    console.log('Populating existing filters');

    // Clear the container
    container.innerHTML = '';

    // Add each filter
    if (appState.filters && appState.filters.length > 0) {
        appState.filters.forEach(filter => {
            const filterElement = createFilterElement(filter);
            container.appendChild(filterElement);
        });
        console.log('Filters populated:', appState.filters.length);
    } else {
        console.log('No filters to populate');

        // Add a message if there are no filters
        const noFiltersMessage = document.createElement('div');
        noFiltersMessage.className = 'no-filters-message';
        noFiltersMessage.innerHTML = '<p>No filters added yet. Click "Add Filter" to create a filter.</p>';
        container.appendChild(noFiltersMessage);
    }
}
