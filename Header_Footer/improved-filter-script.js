// Visual Filter Builder Script

document.addEventListener('DOMContentLoaded', function() {
    // Initialize filter functionality
    initVisualFilterBuilder();
    initFilterCards();

    // Set initial counts
    updateFilterCounts({
        total: 16,
        set: 10,
        notSet: 6,
        active: 14,
        inactive: 2
    });
});

// Initialize Visual Filter Builder
function initVisualFilterBuilder() {
    initBuilderTabs();
    initAIAssistant();
    initCanvasTools();
    initFilterGroups();
    initFilterSummary();
    initSavedFilters();
    initTemplates();
}

// Initialize Builder Tabs
function initBuilderTabs() {
    const tabs = document.querySelectorAll('.builder-tab');
    const tabContents = document.querySelectorAll('.builder-tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));

            // Add active class to clicked tab
            this.classList.add('active');

            // Hide all tab contents
            tabContents.forEach(content => content.classList.remove('active'));

            // Show the corresponding tab content
            const tabId = this.dataset.tab;
            document.getElementById(`${tabId}-tab`).classList.add('active');

            showNotification(`Switched to ${tabId.charAt(0).toUpperCase() + tabId.slice(1)} tab`);
        });
    });
}

// Initialize AI Assistant
function initAIAssistant() {
    const aiInput = document.querySelector('.ai-input');
    const aiSubmit = document.querySelector('.ai-submit');
    const suggestionChips = document.querySelectorAll('.suggestion-chip');

    if (aiInput && aiSubmit) {
        aiSubmit.addEventListener('click', function() {
            processAIQuery(aiInput.value);
        });

        aiInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                processAIQuery(this.value);
            }
        });
    }

    suggestionChips.forEach(chip => {
        chip.addEventListener('click', function() {
            const query = this.textContent;
            if (aiInput) {
                aiInput.value = query;
            }
            processAIQuery(query);
        });
    });
}

// Process AI Query
function processAIQuery(query) {
    if (!query) return;

    showNotification(`Processing query: "${query}"`);

    // Simulate AI processing
    setTimeout(() => {
        // Clear existing filter groups
        const filterGroupsContainer = document.querySelector('.filter-groups-container');
        if (filterGroupsContainer) {
            // Keep the first group and remove others
            const groups = filterGroupsContainer.querySelectorAll('.filter-group');
            for (let i = 1; i < groups.length; i++) {
                groups[i].remove();
            }
        }

        // Update the first group based on the query
        if (query.toLowerCase().includes('active')) {
            updateFilterCondition(0, 0, 'status', 'equals', 'active');
        }

        if (query.toLowerCase().includes('north america')) {
            addFilterCondition(0, 'region', 'equals', 'north-america');
        }

        if (query.toLowerCase().includes('headquarters')) {
            addFilterCondition(0, 'branch', 'equals', 'headquarters');
        }

        if (query.toLowerCase().includes('manufacturing')) {
            addFilterCondition(0, 'branch', 'equals', 'manufacturing');
        }

        if (query.toLowerCase().includes('set')) {
            addFilterCondition(0, 'status', 'equals', 'set');
        }

        // Update the filter summary
        updateFilterSummary();

        showNotification('Filter created based on your query');
    }, 1000);
}

// Initialize Canvas Tools
function initCanvasTools() {
    const addGroupButton = document.querySelector('.canvas-tool[data-tool="add-group"]');
    const clearButton = document.querySelector('.canvas-tool[data-tool="clear"]');
    const logicSelect = document.querySelector('.logic-select');

    if (addGroupButton) {
        addGroupButton.addEventListener('click', function() {
            addFilterGroup();
        });
    }

    if (clearButton) {
        clearButton.addEventListener('click', function() {
            clearFilterGroups();
        });
    }

    if (logicSelect) {
        logicSelect.addEventListener('change', function() {
            updateFilterSummary();
            showNotification(`Logic changed to ${this.value.toUpperCase()}`);
        });
    }
}

// Add Filter Group
function addFilterGroup() {
    const filterGroupsContainer = document.querySelector('.filter-groups-container');
    if (!filterGroupsContainer) return;

    const groupCount = filterGroupsContainer.querySelectorAll('.filter-group').length;
    const groupNumber = groupCount + 1;

    const newGroup = document.createElement('div');
    newGroup.className = 'filter-group';
    newGroup.innerHTML = `
        <div class="group-header">
            <div class="group-title">Group ${groupNumber}</div>
            <div class="group-actions">
                <button class="group-action" data-action="add-condition">
                    <i class="material-icons">add</i>
                </button>
                <button class="group-action" data-action="delete-group">
                    <i class="material-icons">delete</i>
                </button>
            </div>
        </div>

        <div class="filter-conditions">
            <div class="filter-condition">
                <div class="condition-field">
                    <select class="field-select">
                        <option value="branch">Branch</option>
                        <option value="status">Status</option>
                        <option value="region">Region</option>
                        <option value="company">Company</option>
                    </select>
                </div>
                <div class="condition-operator">
                    <select class="operator-select">
                        <option value="equals" selected>equals</option>
                        <option value="not-equals">not equals</option>
                        <option value="contains">contains</option>
                        <option value="starts-with">starts with</option>
                    </select>
                </div>
                <div class="condition-value">
                    <select class="value-select">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="set">Set</option>
                        <option value="not-set">Not Set</option>
                    </select>
                </div>
                <button class="remove-condition">
                    <i class="material-icons">close</i>
                </button>
            </div>
        </div>
    `;

    filterGroupsContainer.appendChild(newGroup);

    // Initialize the new group's actions
    initGroupActions(newGroup);

    // Update filter summary
    updateFilterSummary();

    showNotification(`Added filter group ${groupNumber}`);
}

// Clear Filter Groups
function clearFilterGroups() {
    const filterGroupsContainer = document.querySelector('.filter-groups-container');
    if (!filterGroupsContainer) return;

    // Keep the first group but clear its conditions
    const groups = filterGroupsContainer.querySelectorAll('.filter-group');

    if (groups.length > 0) {
        // Clear first group's conditions
        const firstGroup = groups[0];
        const conditions = firstGroup.querySelectorAll('.filter-condition');

        // Keep only the first condition and reset it
        if (conditions.length > 0) {
            const firstCondition = conditions[0];
            const fieldSelect = firstCondition.querySelector('.field-select');
            const operatorSelect = firstCondition.querySelector('.operator-select');
            const valueSelect = firstCondition.querySelector('.value-select');

            if (fieldSelect) fieldSelect.value = 'status';
            if (operatorSelect) operatorSelect.value = 'equals';
            if (valueSelect) {
                // Update value options based on field
                updateValueOptions(firstCondition, 'status');
                valueSelect.value = 'active';
            }

            // Remove other conditions
            for (let i = 1; i < conditions.length; i++) {
                conditions[i].remove();
            }
        }

        // Remove other groups
        for (let i = 1; i < groups.length; i++) {
            groups[i].remove();
        }
    }

    // Update filter summary
    updateFilterSummary();

    showNotification('Cleared all filter groups');
}

// Initialize Filter Groups
function initFilterGroups() {
    const filterGroups = document.querySelectorAll('.filter-group');

    filterGroups.forEach(group => {
        initGroupActions(group);
    });

    // Add event listeners for field selects to update value options
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('field-select')) {
            const condition = e.target.closest('.filter-condition');
            if (condition) {
                updateValueOptions(condition, e.target.value);

                // Update filter summary
                updateFilterSummary();
            }
        }
    });

    // Add event listeners for operator and value selects
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('operator-select') || e.target.classList.contains('value-select')) {
            // Update filter summary
            updateFilterSummary();
        }
    });
}

// Initialize Group Actions
function initGroupActions(group) {
    const addConditionButton = group.querySelector('.group-action[data-action="add-condition"]');
    const deleteGroupButton = group.querySelector('.group-action[data-action="delete-group"]');

    if (addConditionButton) {
        addConditionButton.addEventListener('click', function() {
            const conditionsContainer = group.querySelector('.filter-conditions');
            if (conditionsContainer) {
                addCondition(conditionsContainer);
            }
        });
    }

    if (deleteGroupButton) {
        deleteGroupButton.addEventListener('click', function() {
            // Don't delete if it's the only group
            const allGroups = document.querySelectorAll('.filter-group');
            if (allGroups.length > 1) {
                group.remove();

                // Update filter summary
                updateFilterSummary();

                showNotification('Filter group removed');
            } else {
                showNotification('Cannot remove the only filter group');
            }
        });
    }

    // Add event listeners for remove condition buttons
    const removeConditionButtons = group.querySelectorAll('.remove-condition');
    removeConditionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const condition = this.closest('.filter-condition');
            const conditions = group.querySelectorAll('.filter-condition');

            // Don't remove if it's the only condition
            if (conditions.length > 1) {
                condition.remove();

                // Update filter summary
                updateFilterSummary();

                showNotification('Condition removed');
            } else {
                showNotification('Cannot remove the only condition');
            }
        });
    });
}

// Add Condition
function addCondition(conditionsContainer) {
    const newCondition = document.createElement('div');
    newCondition.className = 'filter-condition';
    newCondition.innerHTML = `
        <div class="condition-field">
            <select class="field-select">
                <option value="branch">Branch</option>
                <option value="status">Status</option>
                <option value="region">Region</option>
                <option value="company">Company</option>
            </select>
        </div>
        <div class="condition-operator">
            <select class="operator-select">
                <option value="equals" selected>equals</option>
                <option value="not-equals">not equals</option>
                <option value="contains">contains</option>
                <option value="starts-with">starts with</option>
            </select>
        </div>
        <div class="condition-value">
            <select class="value-select">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="set">Set</option>
                <option value="not-set">Not Set</option>
            </select>
        </div>
        <button class="remove-condition">
            <i class="material-icons">close</i>
        </button>
    `;

    conditionsContainer.appendChild(newCondition);

    // Add event listener for remove button
    const removeButton = newCondition.querySelector('.remove-condition');
    if (removeButton) {
        removeButton.addEventListener('click', function() {
            const conditions = conditionsContainer.querySelectorAll('.filter-condition');

            // Don't remove if it's the only condition
            if (conditions.length > 1) {
                newCondition.remove();

                // Update filter summary
                updateFilterSummary();

                showNotification('Condition removed');
            } else {
                showNotification('Cannot remove the only condition');
            }
        });
    }

    // Update filter summary
    updateFilterSummary();

    showNotification('Condition added');
}

// Update Value Options
function updateValueOptions(condition, field) {
    const valueSelect = condition.querySelector('.value-select');
    if (!valueSelect) return;

    // Clear current options
    valueSelect.innerHTML = '';

    // Add options based on field
    switch (field) {
        case 'status':
            valueSelect.innerHTML = `
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="set">Set</option>
                <option value="not-set">Not Set</option>
            `;
            break;

        case 'branch':
            valueSelect.innerHTML = `
                <option value="headquarters">Headquarters</option>
                <option value="customer-service">Customer Service</option>
                <option value="distribution-center">Distribution Center</option>
                <option value="finance">Finance</option>
                <option value="it-department">IT Department</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="marketing">Marketing</option>
                <option value="r&d-center">R&D Center</option>
                <option value="regional-office">Regional Office</option>
            `;
            break;

        case 'region':
            valueSelect.innerHTML = `
                <option value="north-america">North America</option>
                <option value="europe">Europe</option>
                <option value="asia-pacific">Asia Pacific</option>
                <option value="latin-america">Latin America</option>
                <option value="middle-east">Middle East</option>
                <option value="africa">Africa</option>
            `;
            break;

        case 'company':
            valueSelect.innerHTML = `
                <option value="acme-corporation">Acme Corporation</option>
                <option value="globex">Globex</option>
                <option value="soylent-corp">Soylent Corp</option>
                <option value="stark-industries">Stark Industries</option>
            `;
            break;
    }
}

// Add Filter Condition to Group
function addFilterCondition(groupIndex, field, operator, value) {
    const groups = document.querySelectorAll('.filter-group');
    if (groupIndex >= groups.length) return;

    const group = groups[groupIndex];
    const conditionsContainer = group.querySelector('.filter-conditions');
    if (!conditionsContainer) return;

    const newCondition = document.createElement('div');
    newCondition.className = 'filter-condition';
    newCondition.innerHTML = `
        <div class="condition-field">
            <select class="field-select">
                <option value="branch" ${field === 'branch' ? 'selected' : ''}>Branch</option>
                <option value="status" ${field === 'status' ? 'selected' : ''}>Status</option>
                <option value="region" ${field === 'region' ? 'selected' : ''}>Region</option>
                <option value="company" ${field === 'company' ? 'selected' : ''}>Company</option>
            </select>
        </div>
        <div class="condition-operator">
            <select class="operator-select">
                <option value="equals" ${operator === 'equals' ? 'selected' : ''}>equals</option>
                <option value="not-equals" ${operator === 'not-equals' ? 'selected' : ''}>not equals</option>
                <option value="contains" ${operator === 'contains' ? 'selected' : ''}>contains</option>
                <option value="starts-with" ${operator === 'starts-with' ? 'selected' : ''}>starts with</option>
            </select>
        </div>
        <div class="condition-value">
            <select class="value-select"></select>
        </div>
        <button class="remove-condition">
            <i class="material-icons">close</i>
        </button>
    `;

    conditionsContainer.appendChild(newCondition);

    // Update value options based on field
    updateValueOptions(newCondition, field);

    // Set the value
    const valueSelect = newCondition.querySelector('.value-select');
    if (valueSelect) {
        valueSelect.value = value;
    }

    // Add event listener for remove button
    const removeButton = newCondition.querySelector('.remove-condition');
    if (removeButton) {
        removeButton.addEventListener('click', function() {
            const conditions = conditionsContainer.querySelectorAll('.filter-condition');

            // Don't remove if it's the only condition
            if (conditions.length > 1) {
                newCondition.remove();

                // Update filter summary
                updateFilterSummary();

                showNotification('Condition removed');
            } else {
                showNotification('Cannot remove the only condition');
            }
        });
    }
}

// Update Filter Condition
function updateFilterCondition(groupIndex, conditionIndex, field, operator, value) {
    const groups = document.querySelectorAll('.filter-group');
    if (groupIndex >= groups.length) return;

    const group = groups[groupIndex];
    const conditions = group.querySelectorAll('.filter-condition');
    if (conditionIndex >= conditions.length) return;

    const condition = conditions[conditionIndex];
    const fieldSelect = condition.querySelector('.field-select');
    const operatorSelect = condition.querySelector('.operator-select');
    const valueSelect = condition.querySelector('.value-select');

    if (fieldSelect) fieldSelect.value = field;
    if (operatorSelect) operatorSelect.value = operator;

    // Update value options based on field
    updateValueOptions(condition, field);

    // Set the value
    if (valueSelect) {
        valueSelect.value = value;
    }
}

// Initialize Filter Summary
function initFilterSummary() {
    const copyButton = document.querySelector('.summary-action[data-action="copy"]');
    const saveButton = document.querySelector('.summary-action[data-action="save"]');
    const previewButton = document.querySelector('.preview-action');

    if (copyButton) {
        copyButton.addEventListener('click', function() {
            const summaryText = document.querySelector('.summary-text');
            if (summaryText) {
                // In a real app, this would copy to clipboard
                showNotification('Filter query copied to clipboard');
            }
        });
    }

    if (saveButton) {
        saveButton.addEventListener('click', function() {
            // In a real app, this would save the filter
            const filterName = `Filter ${new Date().toLocaleTimeString()}`;
            showNotification(`Filter "${filterName}" saved successfully`);

            // Switch to saved filters tab
            const savedTab = document.querySelector('.builder-tab[data-tab="saved"]');
            if (savedTab) {
                savedTab.click();
            }
        });
    }

    if (previewButton) {
        previewButton.addEventListener('click', function() {
            // Apply the filter to results
            applyVisualFilter();

            // Scroll to results
            const resultsSection = document.querySelector('.results-section');
            if (resultsSection) {
                resultsSection.scrollIntoView({ behavior: 'smooth' });
            }

            showNotification('Previewing filter results');
        });
    }

    // Initial summary update
    updateFilterSummary();
}

// Update Filter Summary
function updateFilterSummary() {
    const summaryText = document.querySelector('.summary-text');
    const previewCount = document.querySelector('.preview-count');

    if (!summaryText || !previewCount) return;

    // Build summary text
    const logicSelect = document.querySelector('.logic-select');
    const logic = logicSelect ? logicSelect.value.toUpperCase() : 'OR';

    const groups = document.querySelectorAll('.filter-group');
    let summaryParts = [];

    groups.forEach(group => {
        const conditions = group.querySelectorAll('.filter-condition');
        let groupConditions = [];

        conditions.forEach(condition => {
            const field = condition.querySelector('.field-select').value;
            const operator = condition.querySelector('.operator-select').value;
            const value = condition.querySelector('.value-select').value;

            groupConditions.push(`${field} ${operator} ${value}`);
        });

        if (groupConditions.length > 0) {
            summaryParts.push(`(${groupConditions.join(' AND ')})`);
        }
    });

    const summaryString = summaryParts.join(` ${logic} `);
    summaryText.textContent = summaryString || 'No filter conditions defined';

    // Update preview count
    const resultCount = calculateFilteredResultCount();
    previewCount.textContent = `${resultCount} results`;
}

// Calculate Filtered Result Count
function calculateFilteredResultCount() {
    // In a real app, this would calculate the actual count
    // For demo purposes, we'll return a number based on the filter complexity
    const groups = document.querySelectorAll('.filter-group');
    const conditions = document.querySelectorAll('.filter-condition');

    const logicSelect = document.querySelector('.logic-select');
    const logic = logicSelect ? logicSelect.value : 'or';

    let baseCount = 16; // Total number of results

    if (logic === 'and') {
        // AND logic is more restrictive
        return Math.max(1, Math.floor(baseCount / (groups.length + conditions.length)));
    } else {
        // OR logic is less restrictive
        return Math.min(baseCount, Math.ceil(baseCount * 0.75));
    }
}

// Apply Visual Filter
function applyVisualFilter() {
    // Get all filter conditions
    const groups = document.querySelectorAll('.filter-group');
    const logicSelect = document.querySelector('.logic-select');
    const logic = logicSelect ? logicSelect.value : 'or';

    // Build filter criteria
    let filterCriteria = [];

    groups.forEach(group => {
        const conditions = group.querySelectorAll('.filter-condition');
        let groupCriteria = [];

        conditions.forEach(condition => {
            const field = condition.querySelector('.field-select').value;
            const operator = condition.querySelector('.operator-select').value;
            const value = condition.querySelector('.value-select').value;

            groupCriteria.push({ field, operator, value });
        });

        if (groupCriteria.length > 0) {
            filterCriteria.push(groupCriteria);
        }
    });

    // Apply filters to results
    const resultCards = document.querySelectorAll('.result-card');

    // Reset all cards
    resultCards.forEach(card => {
        card.style.display = 'block';
    });

    // If no filters, show all results
    if (filterCriteria.length === 0) {
        updateResultCount(resultCards.length);
        return;
    }

    // Apply filters
    resultCards.forEach(card => {
        const matchesFilter = applyFilterCriteria(card, filterCriteria, logic);
        card.style.display = matchesFilter ? 'block' : 'none';
    });

    // Update result count
    const visibleResults = document.querySelectorAll('.result-card[style="display: block"]').length;
    updateResultCount(visibleResults);

    // Update filter counts
    updateFilterCounts({
        total: visibleResults,
        set: countResultsByStatus('set'),
        notSet: countResultsByStatus('not-set'),
        active: countResultsByStatus('active'),
        inactive: countResultsByStatus('inactive')
    });

    // Update summary cards
    updateSummaryCards(filterCriteria);
}

// Apply Filter Criteria
function applyFilterCriteria(card, filterCriteria, logic) {
    // For OR logic, any group match is sufficient
    if (logic === 'or') {
        return filterCriteria.some(groupCriteria => {
            // For AND logic within a group, all conditions must match
            return groupCriteria.every(condition => {
                return matchesCondition(card, condition);
            });
        });
    }
    // For AND logic, all groups must match
    else {
        return filterCriteria.every(groupCriteria => {
            // For AND logic within a group, all conditions must match
            return groupCriteria.every(condition => {
                return matchesCondition(card, condition);
            });
        });
    }
}

// Check if card matches a condition
function matchesCondition(card, condition) {
    const { field, operator, value } = condition;

    // Get the relevant data from the card
    let cardValue = '';

    switch (field) {
        case 'status':
            const statusElement = card.querySelector('.result-status');
            if (statusElement) {
                if (statusElement.classList.contains('status-active')) cardValue = 'active';
                else if (statusElement.classList.contains('status-inactive')) cardValue = 'inactive';
                else if (statusElement.classList.contains('status-set')) cardValue = 'set';
                else if (statusElement.classList.contains('status-not-set')) cardValue = 'not-set';
            }
            break;

        case 'branch':
            const branchInfo = card.querySelector('.result-info:nth-child(3)');
            if (branchInfo) {
                cardValue = branchInfo.textContent.replace('Branch: ', '').toLowerCase();
            }
            break;

        case 'region':
            const regionInfo = card.querySelector('.result-info:nth-child(2)');
            if (regionInfo) {
                cardValue = regionInfo.textContent.replace('Region: ', '').toLowerCase();
            }
            break;

        case 'company':
            const companyName = card.querySelector('.result-title');
            if (companyName) {
                cardValue = companyName.textContent.toLowerCase();
            }
            break;
    }

    // Apply the operator
    switch (operator) {
        case 'equals':
            return cardValue.toLowerCase() === value.toLowerCase();

        case 'not-equals':
            return cardValue.toLowerCase() !== value.toLowerCase();

        case 'contains':
            return cardValue.toLowerCase().includes(value.toLowerCase());

        case 'starts-with':
            return cardValue.toLowerCase().startsWith(value.toLowerCase());

        default:
            return false;
    }
}

// Update Result Count
function updateResultCount(count) {
    const resultsCountElement = document.getElementById('results-count');
    if (resultsCountElement) {
        resultsCountElement.textContent = count;
    }
}

// Update Summary Cards
function updateSummaryCards(filterCriteria) {
    const summaryCards = document.querySelectorAll('.summary-card');

    // Reset all cards
    summaryCards.forEach(card => {
        card.classList.remove('active');
    });

    // If no filters, return
    if (filterCriteria.length === 0) {
        return;
    }

    // Check for status filters
    const hasStatusFilter = filterCriteria.some(groupCriteria => {
        return groupCriteria.some(condition => {
            return condition.field === 'status';
        });
    });

    if (hasStatusFilter) {
        // Find all status values in the filter
        const statusValues = [];

        filterCriteria.forEach(groupCriteria => {
            groupCriteria.forEach(condition => {
                if (condition.field === 'status' && condition.operator === 'equals') {
                    statusValues.push(condition.value);
                }
            });
        });

        // Activate corresponding cards
        summaryCards.forEach(card => {
            const filterType = card.dataset.filter;
            if (statusValues.includes(filterType)) {
                card.classList.add('active');
            }
        });
    }
}

// Initialize Saved Filters
function initSavedFilters() {
    const savedFilterCards = document.querySelectorAll('.saved-filter-card');
    const savedFiltersSearch = document.querySelector('.saved-filters-search input');

    // Add event listeners to filter card actions
    savedFilterCards.forEach(card => {
        const applyButton = card.querySelector('.card-action[data-action="apply"]');
        const editButton = card.querySelector('.card-action[data-action="edit"]');
        const shareButton = card.querySelector('.card-action[data-action="share"]');
        const deleteButton = card.querySelector('.card-action[data-action="delete"]');

        if (applyButton) {
            applyButton.addEventListener('click', function() {
                const filterName = card.querySelector('h4').textContent;

                // Switch to builder tab
                const builderTab = document.querySelector('.builder-tab[data-tab="builder"]');
                if (builderTab) {
                    builderTab.click();
                }

                // Apply the saved filter (in a real app, this would load the actual filter)
                showNotification(`Applied saved filter: ${filterName}`);

                // Simulate applying the filter
                setTimeout(() => {
                    applyVisualFilter();
                }, 500);
            });
        }

        if (editButton) {
            editButton.addEventListener('click', function() {
                const filterName = card.querySelector('h4').textContent;

                // Switch to builder tab
                const builderTab = document.querySelector('.builder-tab[data-tab="builder"]');
                if (builderTab) {
                    builderTab.click();
                }

                showNotification(`Editing saved filter: ${filterName}`);
            });
        }

        if (shareButton) {
            shareButton.addEventListener('click', function() {
                const filterName = card.querySelector('h4').textContent;

                // In a real app, this would open a share dialog
                showNotification(`Sharing filter: ${filterName}`);
            });
        }

        if (deleteButton) {
            deleteButton.addEventListener('click', function() {
                const filterName = card.querySelector('h4').textContent;

                // In a real app, this would confirm deletion
                card.style.opacity = '0.5';
                card.style.pointerEvents = 'none';

                showNotification(`Deleted filter: ${filterName}`);

                // Simulate removing the card after a delay
                setTimeout(() => {
                    card.remove();
                }, 2000);
            });
        }
    });

    // Add search functionality
    if (savedFiltersSearch) {
        savedFiltersSearch.addEventListener('keyup', function() {
            const query = this.value.toLowerCase();

            savedFilterCards.forEach(card => {
                const filterName = card.querySelector('h4').textContent.toLowerCase();
                const filterDescription = card.querySelector('.filter-card-description').textContent.toLowerCase();

                if (filterName.includes(query) || filterDescription.includes(query) || query === '') {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

// Initialize Templates
function initTemplates() {
    const templateCards = document.querySelectorAll('.template-card');
    const templateCategories = document.querySelectorAll('.template-category');

    // Add event listeners to template categories
    templateCategories.forEach(category => {
        category.addEventListener('click', function() {
            // Remove active class from all categories
            templateCategories.forEach(c => c.classList.remove('active'));

            // Add active class to clicked category
            this.classList.add('active');

            const categoryName = this.textContent.toLowerCase();

            // In a real app, this would filter templates by category
            showNotification(`Showing ${categoryName} templates`);
        });
    });

    // Add event listeners to template use buttons
    templateCards.forEach(card => {
        const useButton = card.querySelector('.template-use');
        if (useButton) {
            useButton.addEventListener('click', function() {
                const templateName = card.querySelector('h4').textContent;

                // Switch to builder tab
                const builderTab = document.querySelector('.builder-tab[data-tab="builder"]');
                if (builderTab) {
                    builderTab.click();
                }

                // Apply the template (in a real app, this would load the actual template)
                showNotification(`Applied template: ${templateName}`);

                // Simulate applying the template
                setTimeout(() => {
                    // Clear existing filter groups
                    clearFilterGroups();

                    // Add template-specific conditions
                    if (templateName === 'Active Companies') {
                        updateFilterCondition(0, 0, 'status', 'equals', 'active');
                    } else if (templateName === 'Regional Analysis') {
                        updateFilterCondition(0, 0, 'region', 'equals', 'north-america');
                        addFilterGroup();
                        updateFilterCondition(1, 0, 'region', 'equals', 'europe');
                    } else if (templateName === 'Branch Comparison') {
                        updateFilterCondition(0, 0, 'branch', 'equals', 'headquarters');
                        addFilterCondition(0, 'branch', 'equals', 'manufacturing');
                    } else if (templateName === 'Growth Tracker') {
                        updateFilterCondition(0, 0, 'status', 'equals', 'active');
                        addFilterCondition(0, 'status', 'not-equals', 'set');
                    }

                    // Update filter summary
                    updateFilterSummary();

                    // Apply the filter
                    applyVisualFilter();
                }, 500);
            });
        }
    });
}

// Initialize Status Options
function initStatusOptions() {
    const statusOptions = document.querySelectorAll('.status-option');
    statusOptions.forEach(option => {
        option.addEventListener('click', function() {
            this.classList.toggle('selected');
            const statusLabel = this.querySelector('.status-label').textContent;

            if (this.classList.contains('selected')) {
                // Add filter tag
                addFilterTag('status', statusLabel);
            } else {
                // Remove filter tag
                const tag = document.querySelector(`.filter-tag[data-category="status"][data-value="${statusLabel}"]`);
                if (tag) tag.remove();
            }

            // Apply filters
            applyInteractiveFilters();
        });
    });
}

// Initialize Region Selector
function initRegionSelector() {
    const regions = document.querySelectorAll('.region');
    regions.forEach(region => {
        region.addEventListener('click', function() {
            this.classList.toggle('selected');

            if (this.classList.contains('selected')) {
                // Add filter tag
                addFilterTag('region', this.textContent);
            } else {
                // Remove filter tag
                const tag = document.querySelector(`.filter-tag[data-category="region"][data-value="${this.textContent}"]`);
                if (tag) tag.remove();
            }

            // Apply filters
            applyInteractiveFilters();
        });
    });
}

// Initialize Clear All Button
function initClearAllButton() {
    const clearAllButton = document.querySelector('.action-button.clear-all');
    if (clearAllButton) {
        clearAllButton.addEventListener('click', function() {
            clearAllFilters();
            showNotification('All filters cleared');

            // Show all results
            const resultCards = document.querySelectorAll('.result-card');
            resultCards.forEach(card => card.style.display = 'block');

            // Update result count
            const resultsCountElement = document.getElementById('results-count');
            if (resultsCountElement) {
                resultsCountElement.textContent = resultCards.length;
            }
        });
    }
}

// Clear all filters
function clearAllFilters() {
    // Clear branch checkboxes
    const branchCheckboxes = document.querySelectorAll('.option-item .custom-checkbox input');
    branchCheckboxes.forEach(checkbox => checkbox.checked = false);

    // Clear status options
    const statusOptions = document.querySelectorAll('.status-option');
    statusOptions.forEach(option => option.classList.remove('selected'));

    // Clear region selections
    const regions = document.querySelectorAll('.region');
    regions.forEach(region => region.classList.remove('selected'));

    // Clear filter tags
    const filterTags = document.querySelectorAll('.filter-tag');
    filterTags.forEach(tag => tag.remove());

    // Clear summary cards
    const summaryCards = document.querySelectorAll('.summary-card');
    summaryCards.forEach(card => card.classList.remove('active'));

    // Update select all checkbox
    const selectAllCheckbox = document.getElementById('select-all-cards');
    if (selectAllCheckbox) {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
    }
}

// Initialize Save Filter Button
function initSaveFilterButton() {
    const saveFilterButton = document.querySelector('.action-button.save-filter');
    if (saveFilterButton) {
        saveFilterButton.addEventListener('click', function() {
            // Get all active filters
            const filterTags = document.querySelectorAll('.filter-tag');

            if (filterTags.length === 0) {
                showNotification('No filters to save');
                return;
            }

            // In a real app, this would save the filter configuration
            const filterName = `Filter ${new Date().toLocaleTimeString()}`;
            showNotification(`Filter "${filterName}" saved successfully`);
        });
    }
}

// Apply filters from Interactive Filter Hub
function applyInteractiveFilters() {
    // Get selected branch filters
    const selectedBranchCheckboxes = document.querySelectorAll('.option-item .custom-checkbox input:checked');
    const branchFilters = Array.from(selectedBranchCheckboxes).map(checkbox => {
        return checkbox.closest('.custom-checkbox').querySelector('.option-label').textContent;
    });

    // Get selected status filters
    const selectedStatusOptions = document.querySelectorAll('.status-option.selected');
    const statusFilters = Array.from(selectedStatusOptions).map(option => {
        const text = option.querySelector('.status-label').textContent.toLowerCase();
        if (text === 'active') return 'active';
        if (text === 'inactive') return 'inactive';
        if (text === 'set') return 'set';
        if (text === 'not set') return 'not-set';
        return null;
    }).filter(Boolean);

    // Get selected region filters
    const selectedRegions = document.querySelectorAll('.region.selected');
    const regionFilters = Array.from(selectedRegions).map(region => {
        return region.textContent;
    });

    // Update the filter cards to match the selected status filters
    const summaryCards = document.querySelectorAll('.summary-card');
    summaryCards.forEach(card => {
        const filterType = card.dataset.filter;
        if (statusFilters.includes(filterType)) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });

    // Update select all checkbox
    const selectAllCheckbox = document.getElementById('select-all-cards');
    if (selectAllCheckbox) {
        const activeCards = document.querySelectorAll('.summary-card.active');
        selectAllCheckbox.checked = activeCards.length === summaryCards.length;
        selectAllCheckbox.indeterminate = activeCards.length > 0 && activeCards.length < summaryCards.length;
    }

    // Start with all results
    const resultCards = document.querySelectorAll('.result-card');
    resultCards.forEach(card => {
        card.style.display = 'block';
    });

    // Apply status filters if any
    if (statusFilters.length > 0) {
        resultCards.forEach(card => {
            const statusElement = card.querySelector('.result-status');
            if (statusElement) {
                // Check if the card matches any of the selected filters
                const matchesAnyFilter = statusFilters.some(filterType => {
                    return statusElement.classList.contains(`status-${filterType}`);
                });

                card.style.display = matchesAnyFilter ? 'block' : 'none';
            }
        });
    }

    // Apply branch filters if any
    if (branchFilters.length > 0) {
        resultCards.forEach(card => {
            if (card.style.display === 'none') return; // Skip already hidden cards

            const branchInfo = card.querySelector('.result-info:nth-child(3)').textContent;
            const branch = branchInfo.replace('Branch: ', '');

            if (!branchFilters.includes(branch)) {
                card.style.display = 'none';
            }
        });
    }

    // Apply region filters if any
    if (regionFilters.length > 0) {
        resultCards.forEach(card => {
            if (card.style.display === 'none') return; // Skip already hidden cards

            const regionInfo = card.querySelector('.result-info:nth-child(2)').textContent;
            const region = regionInfo.replace('Region: ', '');

            if (!regionFilters.some(r => region.includes(r))) {
                card.style.display = 'none';
            }
        });
    }

    // Update result count
    const visibleResults = document.querySelectorAll('.result-card[style="display: block"]').length;
    const resultsCountElement = document.getElementById('results-count');
    if (resultsCountElement) {
        resultsCountElement.textContent = visibleResults;
    }

    // Update filter counts
    updateFilterCounts({
        total: visibleResults,
        set: countResultsByStatus('set'),
        notSet: countResultsByStatus('not-set'),
        active: countResultsByStatus('active'),
        inactive: countResultsByStatus('inactive')
    });
}

// Initialize filter cards
function initFilterCards() {
    const summaryCards = document.querySelectorAll('.summary-card');
    const selectAllCheckbox = document.getElementById('select-all-cards');

    // Add click event to each card
    summaryCards.forEach(card => {
        card.addEventListener('click', function() {
            const filterType = this.dataset.filter;

            // Toggle active state for this card
            this.classList.toggle('active');

            // Check if any cards are selected
            const activeCards = document.querySelectorAll('.summary-card.active');

            // Update select all checkbox
            if (selectAllCheckbox) {
                selectAllCheckbox.checked = activeCards.length === summaryCards.length;
                selectAllCheckbox.indeterminate = activeCards.length > 0 && activeCards.length < summaryCards.length;
            }

            // Apply filters based on all selected cards
            applyMultipleCardFilters();

            // Also update the SMART FILTER status options
            updateSmartFilterStatus(filterType, this.classList.contains('active'));

            // Show notification
            if (this.classList.contains('active')) {
                showNotification(`Added filter: ${filterType}`);
            } else {
                showNotification(`Removed filter: ${filterType}`);
            }
        });
    });

    // Handle select all checkbox
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            if (this.checked) {
                // Select all cards
                summaryCards.forEach(card => card.classList.add('active'));
                this.indeterminate = false;
            } else {
                // Deselect all cards
                summaryCards.forEach(card => card.classList.remove('active'));
            }

            // Apply filters based on selected cards
            applyMultipleCardFilters();

            // Update SMART FILTER status options
            updateAllSmartFilterStatus(this.checked);

            // Show notification
            if (this.checked) {
                showNotification('All filters selected');
            } else {
                showNotification('All filters cleared');
            }
        });
    }
}

// Update SMART FILTER status option based on filter card selection
function updateSmartFilterStatus(filterType, isActive) {
    let statusOption;

    switch (filterType) {
        case 'active':
            statusOption = document.querySelector('.filter-option.status-active');
            break;
        case 'inactive':
            statusOption = document.querySelector('.filter-option.status-inactive');
            break;
        case 'set':
            statusOption = document.querySelector('.filter-option.status-set');
            break;
        case 'not-set':
            statusOption = document.querySelector('.filter-option.status-not-set');
            break;
    }

    if (statusOption) {
        if (isActive) {
            statusOption.classList.add('selected');
        } else {
            statusOption.classList.remove('selected');
        }
    }
}

// Update all SMART FILTER status options
function updateAllSmartFilterStatus(isSelected) {
    const statusOptions = document.querySelectorAll('.status-options .filter-option:not(.select-all)');
    statusOptions.forEach(option => {
        if (isSelected) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });

    // Also update the "Select All Status" option
    const selectAllStatus = document.querySelector('.filter-option.status-all');
    if (selectAllStatus) {
        if (isSelected) {
            selectAllStatus.classList.add('selected');
        } else {
            selectAllStatus.classList.remove('selected');
        }
    }
}

// Apply filters based on all selected cards
function applyMultipleCardFilters() {
    const activeCards = document.querySelectorAll('.summary-card.active');
    const selectedFilters = Array.from(activeCards).map(card => card.dataset.filter);

    // Filter results based on selected filters
    filterResultsByMultipleCards(selectedFilters);
}

// Filter results based on multiple selected cards
function filterResultsByMultipleCards(selectedFilters) {
    // Get all result cards
    const resultCards = document.querySelectorAll('.result-card');

    // If no filters selected, show all results
    if (selectedFilters.length === 0) {
        resultCards.forEach(card => {
            card.style.display = 'block';
        });

        // Update result count
        const resultsCountElement = document.getElementById('results-count');
        if (resultsCountElement) {
            resultsCountElement.textContent = resultCards.length;
        }

        // Update filter counts with initial values
        updateFilterCounts({
            total: resultCards.length,
            set: countResultsByStatus('set'),
            notSet: countResultsByStatus('not-set'),
            active: countResultsByStatus('active'),
            inactive: countResultsByStatus('inactive')
        });

        return;
    }

    // Show/hide based on selected filters
    resultCards.forEach(card => {
        const statusElement = card.querySelector('.result-status');
        if (statusElement) {
            // Check if the card matches any of the selected filters
            const matchesAnyFilter = selectedFilters.some(filterType => {
                if (filterType === 'all') return true;
                return statusElement.classList.contains(`status-${filterType}`);
            });

            card.style.display = matchesAnyFilter ? 'block' : 'none';
        }
    });

    // Update result count
    const visibleResults = document.querySelectorAll('.result-card[style="display: block"]').length;
    const resultsCountElement = document.getElementById('results-count');
    if (resultsCountElement) {
        resultsCountElement.textContent = visibleResults;
    }

    // Update filter counts
    updateFilterCounts({
        total: visibleResults,
        set: countResultsByStatus('set'),
        notSet: countResultsByStatus('not-set'),
        active: countResultsByStatus('active'),
        inactive: countResultsByStatus('inactive')
    });
}

// Count results by status
function countResultsByStatus(status) {
    return document.querySelectorAll(`.result-card[style="display: block"] .status-${status}`).length;
}

// Update filter counts
function updateFilterCounts(counts) {
    // Update count elements
    const totalCountElement = document.getElementById('filtered-total-count');
    const setCountElement = document.getElementById('filtered-set-count');
    const notSetCountElement = document.getElementById('filtered-not-set-count');
    const activeCountElement = document.getElementById('filtered-active-count');
    const inactiveCountElement = document.getElementById('filtered-inactive-count');

    if (totalCountElement) totalCountElement.textContent = counts.total || 0;
    if (setCountElement) setCountElement.textContent = counts.set || 0;
    if (notSetCountElement) notSetCountElement.textContent = counts.notSet || 0;
    if (activeCountElement) activeCountElement.textContent = counts.active || 0;
    if (inactiveCountElement) inactiveCountElement.textContent = counts.inactive || 0;
}

// Show notification
function showNotification(message) {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        document.body.appendChild(notification);

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
        #notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #323232;
            color: white;
            padding: 12px 24px;
            border-radius: 4px;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 1000;
        }

        #notification.show {
            transform: translateY(0);
            opacity: 1;
        }

        @keyframes fadeIn {
            0% { opacity: 0; transform: scale(0.8); }
            100% { opacity: 1; transform: scale(1); }
        }
        `;

        document.head.appendChild(style);
    }

    // Set message and show notification
    notification.textContent = message;
    notification.classList.add('show');

    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}
