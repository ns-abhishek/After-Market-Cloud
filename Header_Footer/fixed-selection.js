/**
 * Fixed Modern Selection Interface with Visual Tag-Based Selection
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the fixed selection interface
    initFixedSelection();

    // Set default selections for all fields
    setDefaultSelections();
});

/**
 * Initialize the fixed selection interface
 */
function initFixedSelection() {
    console.log("Initializing fixed selection interface");

    // First, ensure the DOM is fully loaded
    if (document.readyState !== 'complete' && document.readyState !== 'interactive') {
        console.log("DOM not ready, waiting for DOMContentLoaded");
        document.addEventListener('DOMContentLoaded', initFixedSelection);
        return;
    }

    // Clear any existing event listeners by cloning nodes
    document.querySelectorAll('.select-all-btn').forEach(btn => {
        const newBtn = btn.cloneNode(true);
        if (btn.parentNode) {
            btn.parentNode.replaceChild(newBtn, btn);
        }
    });

    // Make all items draggable
    document.querySelectorAll('.item-tag').forEach(item => {
        item.setAttribute('draggable', 'true');
    });

    // Prepare items for search first (extract text)
    prepareItemsForSearch();

    // Set up drag and drop events
    setupDragAndDrop();

    // Set up click handlers for items
    setupItemClickHandlers();

    // Set up remove buttons
    setupRemoveButtons();

    // Set up search functionality
    setupSearch();

    // Initialize counts for all category panels
    initializeCounts();

    // Set up submit button
    setupSubmitButton();

    // Set up clear filters button
    setupClearFiltersButton();

    // Set up select all buttons (do this after search setup)
    setupSelectAllButtons();

    // Ensure fixed layout
    enforceFixedLayout();

    // Add window resize listener to maintain fixed layout
    window.addEventListener('resize', enforceFixedLayout);

    // Add a small delay to ensure everything is properly initialized
    setTimeout(() => {
        // Refresh the search to ensure items are properly filtered
        document.querySelectorAll('.smart-search input').forEach(input => {
            filterAvailableItems(input);
        });

        // Update all Select All button states
        document.querySelectorAll('.category-panel').forEach(panel => {
            updateSelectAllButtonText(panel);
        });

        console.log("Fixed selection interface fully initialized");
    }, 100);

    console.log("Fixed selection interface initialized");
}

/**
 * Set up submit button
 */
function setupSubmitButton() {
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            // Collect selected items
            const selectedOptions = {
                regions: [],
                companies: [],
                branches: [],
                subBranches: [],
                languages: [],
                documentType: 'report' // Default
            };

            // Get document type
            const typePageRadio = document.getElementById('typePage');
            if (typePageRadio && typePageRadio.checked) {
                selectedOptions.documentType = 'page';
            }

            // Collect selected regions
            document.querySelectorAll('.region-panel .selected-items .item-tag:not(.empty-state)').forEach(item => {
                selectedOptions.regions.push(item.textContent.trim());
            });

            // Collect selected companies
            document.querySelectorAll('.company-panel .selected-items .item-tag:not(.empty-state)').forEach(item => {
                selectedOptions.companies.push(item.textContent.trim());
            });

            // Collect selected branches
            document.querySelectorAll('.branch-panel .selected-items .item-tag:not(.empty-state)').forEach(item => {
                selectedOptions.branches.push(item.textContent.trim());
            });

            // Collect selected sub-branches
            document.querySelectorAll('.subbranch-panel .selected-items .item-tag:not(.empty-state)').forEach(item => {
                selectedOptions.subBranches.push(item.textContent.trim());
            });

            // Collect selected languages
            document.querySelectorAll('.language-panel .selected-items .item-tag:not(.empty-state)').forEach(item => {
                selectedOptions.languages.push(item.textContent.trim());
            });

            // Build URL with parameters
            let url = 'word-editor.html?';
            const params = [];

            // Add regions
            if (selectedOptions.regions.length > 0) {
                params.push('regions=' + encodeURIComponent(selectedOptions.regions.join(',')));
            }

            // Add companies
            if (selectedOptions.companies.length > 0) {
                params.push('companies=' + encodeURIComponent(selectedOptions.companies.join(',')));
            }

            // Add branches
            if (selectedOptions.branches.length > 0) {
                params.push('branches=' + encodeURIComponent(selectedOptions.branches.join(',')));
            }

            // Add sub-branches
            if (selectedOptions.subBranches.length > 0) {
                params.push('subBranches=' + encodeURIComponent(selectedOptions.subBranches.join(',')));
            }

            // Add languages
            if (selectedOptions.languages.length > 0) {
                params.push('languages=' + encodeURIComponent(selectedOptions.languages.join(',')));
            } else {
                // Default to English if no language selected
                params.push('languages=English');
            }

            // Add document type
            params.push('docType=' + encodeURIComponent(selectedOptions.documentType));

            // Add first page and last page options for report type
            if (selectedOptions.documentType === 'report') {
                // Get first page option
                const firstPageOption = document.querySelector('input[name="firstPageOption"]:checked');
                if (firstPageOption) {
                    params.push('firstPage=' + encodeURIComponent(firstPageOption.value));
                }

                // Get last page option
                const lastPageOption = document.querySelector('input[name="lastPageOption"]:checked');
                if (lastPageOption) {
                    params.push('lastPage=' + encodeURIComponent(lastPageOption.value));
                }
            } else {
                // Add header and footer options for page type
                const headerCheckbox = document.getElementById('headerCheckbox');
                if (headerCheckbox) {
                    params.push('header=' + encodeURIComponent(headerCheckbox.checked));
                }

                const footerCheckbox = document.getElementById('footerCheckbox');
                if (footerCheckbox) {
                    params.push('footer=' + encodeURIComponent(footerCheckbox.checked));
                }
            }

            // Combine URL and parameters
            url += params.join('&');
            console.log("Redirecting to:", url);

            // Redirect to word editor with parameters
            window.location.href = url;
        });
    }
}

/**
 * Set up clear filters button
 */
function setupClearFiltersButton() {
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            clearAllFilters();
        });
    }
}

/**
 * Initialize counts for all category panels
 */
function initializeCounts() {
    document.querySelectorAll('.category-panel').forEach(panel => {
        updateCount(panel);
    });
}

/**
 * Set up drag and drop events
 */
function setupDragAndDrop() {
    let draggedItem = null;

    // Drag start event
    document.addEventListener('dragstart', function(e) {
        if (e.target.classList.contains('item-tag')) {
            draggedItem = e.target;
            e.target.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';

            // Store the search text in the data transfer
            const searchText = draggedItem.getAttribute('data-search-text');
            if (searchText) {
                e.dataTransfer.setData('application/search-text', searchText);
            }
        }
    });

    // Drag end event
    document.addEventListener('dragend', function(e) {
        if (e.target.classList.contains('item-tag')) {
            e.target.classList.remove('dragging');
            document.querySelectorAll('.drag-over').forEach(el => {
                el.classList.remove('drag-over');
            });
        }
    });

    // Drag over event
    document.addEventListener('dragover', function(e) {
        e.preventDefault(); // Necessary to allow dropping

        const dropZone = e.target.closest('.available-items, .selected-items');
        if (dropZone && draggedItem) {
            e.dataTransfer.dropEffect = 'move';
        }
    });

    // Drag enter event
    document.addEventListener('dragenter', function(e) {
        const dropZone = e.target.closest('.available-items, .selected-items');
        if (dropZone && draggedItem) {
            dropZone.classList.add('drag-over');
        }
    });

    // Drag leave event
    document.addEventListener('dragleave', function(e) {
        const dropZone = e.target.closest('.available-items, .selected-items');
        if (dropZone && !dropZone.contains(e.relatedTarget)) {
            dropZone.classList.remove('drag-over');
        }
    });

    // Drop event
    document.addEventListener('drop', function(e) {
        e.preventDefault();

        const dropZone = e.target.closest('.available-items, .selected-items');
        if (dropZone && draggedItem) {
            dropZone.classList.remove('drag-over');

            // Only allow drops if we're in the same category panel
            const sourcePanel = draggedItem.closest('.category-panel');
            const targetPanel = dropZone.closest('.category-panel');

            // Get the current container of the dragged item
            const sourceContainer = draggedItem.closest('.available-items, .selected-items');

            // Only move if dropping to a different container
            if (sourcePanel === targetPanel && sourceContainer !== dropZone) {
                if (dropZone.classList.contains('selected-items')) {
                    moveToSelected(draggedItem);
                } else {
                    moveToAvailable(draggedItem);
                }

                // Apply current search filter after drop
                const searchInput = targetPanel.querySelector('.smart-search input');
                if (searchInput) {
                    filterAvailableItems(searchInput);
                }
            }

            draggedItem = null;
        }
    });
}

/**
 * Set up click handlers for items
 */
function setupItemClickHandlers() {
    document.addEventListener('click', function(e) {
        // Handle item clicks (but not clicks on remove buttons)
        const itemTag = e.target.closest('.item-tag');
        if (itemTag && !e.target.closest('.remove-tag')) {
            const parentArea = itemTag.closest('.available-items, .selected-items');

            // Check if the item already exists in the target area
            if (parentArea.classList.contains('available-items')) {
                // Check if this item already exists in the selected area
                const categoryPanel = itemTag.closest('.category-panel');
                const selectedArea = categoryPanel.querySelector('.selected-items');
                const itemId = itemTag.dataset.id;

                // Only move if the item doesn't already exist in the selected area
                const existingItem = selectedArea.querySelector(`.item-tag[data-id="${itemId}"]`);
                if (!existingItem) {
                    moveToSelected(itemTag);
                }
            } else {
                moveToAvailable(itemTag);
            }
        }
    });
}

/**
 * Update the Select All button text based on context
 * @param {HTMLElement} categoryPanel - The category panel containing the button
 */
function updateSelectAllButtonText(categoryPanel) {
    const selectAllBtn = categoryPanel.querySelector('.select-all-btn');
    if (!selectAllBtn) return;

    const selectedItems = categoryPanel.querySelectorAll('.selected-items .item-tag:not(.empty-state)');
    const visibleAvailableItems = Array.from(categoryPanel.querySelectorAll('.available-items .item-tag'))
        .filter(item => {
            // Check if the item is hidden by search
            const isHidden = item.classList.contains('hidden-by-search');
            // Check if the item is hidden by style
            const isStyleHidden = item.style.display === 'none';
            // Item is visible if it's not hidden by either method
            return !isHidden && !isStyleHidden;
        });

    console.log(`Selected items: ${selectedItems.length}, Visible available items: ${visibleAvailableItems.length}`);

    // If there are selected items and no visible available items, change to "Unselect All"
    if (selectedItems.length > 0 && visibleAvailableItems.length === 0) {
        selectAllBtn.innerHTML = '<i class="material-icons">remove_done</i> Unselect All';
        selectAllBtn.setAttribute('data-action', 'unselect');
        console.log("Button set to: Unselect All");
    } else {
        selectAllBtn.innerHTML = '<i class="material-icons">done_all</i> Select All';
        selectAllBtn.setAttribute('data-action', 'select');
        console.log("Button set to: Select All");
    }
}

/**
 * Set up select all buttons
 */
function setupSelectAllButtons() {
    console.log("Setting up Select All buttons");

    // Add direct click handlers for each specific Select All button by ID
    const selectAllButtons = [
        'regionSelectAll',
        'companySelectAll',
        'branchSelectAll',
        'subbranchSelectAll',
        'languageSelectAll'
    ];

    selectAllButtons.forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
            console.log(`Adding click handler for ${buttonId}`);

            // Remove any existing event listeners
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);

            // Add new event listener
            newButton.addEventListener('click', function(e) {
                e.preventDefault();
                console.log(`${buttonId} clicked`);

                // Find the category panel
                const categoryPanel = this.closest('.category-panel');
                if (!categoryPanel) {
                    console.error("No category panel found");
                    return;
                }

                // Get all available items that are visible
                const availableItems = Array.from(categoryPanel.querySelectorAll('.available-items .item-tag'))
                    .filter(item => window.getComputedStyle(item).display !== 'none');

                console.log(`Found ${availableItems.length} visible items to select`);

                // If we have items to select, move them to selected
                if (availableItems.length > 0) {
                    availableItems.forEach(item => {
                        moveToSelected(item);
                    });
                    console.log(`Selected ${availableItems.length} items`);
                } else {
                    // If no available items, check if we should unselect all
                    const selectedItems = Array.from(categoryPanel.querySelectorAll('.selected-items .item-tag:not(.empty-state)'));
                    if (selectedItems.length > 0) {
                        selectedItems.forEach(item => {
                            moveToAvailable(item);
                        });
                        console.log(`Unselected ${selectedItems.length} items`);
                    }
                }

                // Update the button text
                updateSelectAllButtonText(categoryPanel);
            });
        } else {
            console.error(`Button with ID ${buttonId} not found`);
        }
    });

    // Also set up event delegation as a fallback
    document.addEventListener('click', function(e) {
        const button = e.target.closest('.select-all-btn');
        if (button && !button.hasAttribute('data-handler-attached')) {
            console.log("Select All button clicked via delegation");

            const categoryPanel = button.closest('.category-panel');
            if (!categoryPanel) {
                console.error("No category panel found");
                return;
            }

            // Get all available items that are visible
            const availableItems = Array.from(categoryPanel.querySelectorAll('.available-items .item-tag'))
                .filter(item => window.getComputedStyle(item).display !== 'none');

            console.log(`Found ${availableItems.length} visible items to select`);

            // If we have items to select, move them to selected
            if (availableItems.length > 0) {
                availableItems.forEach(item => {
                    moveToSelected(item);
                });
                console.log(`Selected ${availableItems.length} items`);
            } else {
                // If no available items, check if we should unselect all
                const selectedItems = Array.from(categoryPanel.querySelectorAll('.selected-items .item-tag:not(.empty-state)'));
                if (selectedItems.length > 0) {
                    selectedItems.forEach(item => {
                        moveToAvailable(item);
                    });
                    console.log(`Unselected ${selectedItems.length} items`);
                }
            }

            // Update the button text
            updateSelectAllButtonText(categoryPanel);
        }
    });

    // Initialize button text on page load
    document.querySelectorAll('.category-panel').forEach(panel => {
        updateSelectAllButtonText(panel);
    });
}

/**
 * Set up remove buttons
 */
function setupRemoveButtons() {
    document.addEventListener('click', function(e) {
        const removeBtn = e.target.closest('.remove-tag');
        if (removeBtn) {
            e.stopPropagation(); // Prevent item click event
            const itemTag = removeBtn.closest('.item-tag');
            moveToAvailable(itemTag);
        }
    });
}

/**
 * Move an item to the selected items area
 */
function moveToSelected(item) {
    const categoryPanel = item.closest('.category-panel');
    if (!categoryPanel) return;

    const selectedArea = categoryPanel.querySelector('.selected-items');
    if (!selectedArea) return;

    // Check if this item already exists in the selected area
    const itemId = item.dataset.id;
    if (itemId) {
        const existingItem = selectedArea.querySelector(`.item-tag[data-id="${itemId}"]`);
        if (existingItem) {
            // Item already exists in selected area, don't create a duplicate
            return;
        }
    }

    // Create a clone of the item
    const clone = item.cloneNode(true);
    clone.classList.add('selected');

    // Preserve the search text
    const searchText = item.getAttribute('data-search-text');
    if (searchText) {
        clone.setAttribute('data-search-text', searchText);
    }

    // Add remove button if not already present
    if (!clone.querySelector('.remove-tag')) {
        const removeBtn = document.createElement('span');
        removeBtn.className = 'remove-tag';
        removeBtn.innerHTML = '<i class="material-icons">close</i>';
        clone.appendChild(removeBtn);
    }

    // Make the clone draggable
    clone.setAttribute('draggable', 'true');

    // Add to selected area
    selectedArea.appendChild(clone);

    // Remove from available area if it came from there
    if (item.closest('.available-items')) {
        item.remove();
    }

    // Update the count
    updateCount(categoryPanel);

    // Update hidden checkboxes
    updateHiddenCheckboxes(categoryPanel);

    // Enforce fixed layout
    enforceFixedLayout();

    // Update Select All button text
    updateSelectAllButtonText(categoryPanel);
}

/**
 * Move an item to the available items area
 */
function moveToAvailable(item) {
    const categoryPanel = item.closest('.category-panel');
    if (!categoryPanel) return;

    const availableArea = categoryPanel.querySelector('.available-items');
    if (!availableArea) return;

    // Check if this item already exists in the available area
    const itemId = item.dataset.id;
    if (itemId) {
        const existingItem = availableArea.querySelector(`.item-tag[data-id="${itemId}"]`);
        if (existingItem) {
            // If the item is in the selected area, just remove it
            if (item.closest('.selected-items')) {
                item.remove();
                // Update the count
                updateCount(categoryPanel);
                // Update hidden checkboxes
                updateHiddenCheckboxes(categoryPanel);
                // Enforce fixed layout
                enforceFixedLayout();
            }
            return;
        }
    }

    // Create a clone of the item
    const clone = item.cloneNode(true);
    clone.classList.remove('selected');

    // Preserve the search text
    const searchText = item.getAttribute('data-search-text');
    if (searchText) {
        clone.setAttribute('data-search-text', searchText);
    }

    // Remove the remove button
    const removeBtn = clone.querySelector('.remove-tag');
    if (removeBtn) {
        removeBtn.remove();
    }

    // Make the clone draggable
    clone.setAttribute('draggable', 'true');

    // Add to available area
    availableArea.appendChild(clone);

    // Remove from selected area if it came from there
    if (item.closest('.selected-items')) {
        item.remove();
    }

    // Update the count
    updateCount(categoryPanel);

    // Update hidden checkboxes
    updateHiddenCheckboxes(categoryPanel);

    // Enforce fixed layout
    enforceFixedLayout();

    // Apply current search filter
    const searchInput = categoryPanel.querySelector('.smart-search input');
    if (searchInput) {
        filterAvailableItems(searchInput);
    }
}

/**
 * Update the count in the category header
 */
function updateCount(categoryPanel) {
    const countElement = categoryPanel.querySelector('.category-count');
    // Only count actual item tags, not empty state elements
    const selectedItems = categoryPanel.querySelectorAll('.selected-items .item-tag:not(.empty-state)').length;

    if (countElement) {
        countElement.textContent = selectedItems;
    }
}

/**
 * Update hidden checkboxes for validation
 */
function updateHiddenCheckboxes(categoryPanel) {
    let checkboxClass = '';

    if (categoryPanel.classList.contains('region-panel')) {
        checkboxClass = 'region-checkbox';
    } else if (categoryPanel.classList.contains('company-panel')) {
        checkboxClass = 'company-checkbox';
    } else if (categoryPanel.classList.contains('branch-panel')) {
        checkboxClass = 'branch-checkbox';
    } else if (categoryPanel.classList.contains('subbranch-panel')) {
        checkboxClass = 'subbranch-checkbox';
    } else if (categoryPanel.classList.contains('language-panel')) {
        checkboxClass = 'language-checkbox';
    }

    if (!checkboxClass) return;

    // Uncheck all checkboxes
    document.querySelectorAll('.' + checkboxClass).forEach(checkbox => {
        checkbox.checked = false;
        if (checkbox.parentElement.classList.contains('is-checked')) {
            checkbox.parentElement.classList.remove('is-checked');
        }
    });

    // Check the ones that are selected
    categoryPanel.querySelectorAll('.selected-items .item-tag').forEach(item => {
        const itemId = item.dataset.id;
        if (itemId) {
            const checkbox = document.getElementById(itemId);
            if (checkbox) {
                checkbox.checked = true;
                if (checkbox.parentElement) {
                    checkbox.parentElement.classList.add('is-checked');
                }
            }
        }
    });
}

/**
 * Set up search functionality
 */
function setupSearch() {
    console.log("Setting up search functionality");

    // Remove any existing event listeners by cloning the search inputs
    document.querySelectorAll('.smart-search input').forEach(input => {
        const newInput = input.cloneNode(true);
        if (input.parentNode) {
            input.parentNode.replaceChild(newInput, input);
        }
    });

    // Add input event listener for search (real-time filtering)
    document.addEventListener('input', function(e) {
        if (e.target.closest('.smart-search input')) {
            console.log("Search input changed:", e.target.value);
            filterAvailableItems(e.target);
        }
    });

    // Add keyup event listener for Enter key
    document.addEventListener('keyup', function(e) {
        if (e.key === 'Enter' && e.target.closest('.smart-search input')) {
            console.log("Enter key pressed in search");
            filterAvailableItems(e.target);
        }
    });

    // Add click event listener for search icon
    document.addEventListener('click', function(e) {
        if (e.target.closest('.smart-search i')) {
            const searchInput = e.target.closest('.smart-search').querySelector('input');
            if (searchInput) {
                console.log("Search icon clicked");
                filterAvailableItems(searchInput);
            }
        }
    });

    // Initialize search inputs on page load
    document.querySelectorAll('.smart-search input').forEach(input => {
        // Clear any previous search
        input.value = '';
        console.log("Initializing search input");

        // Set placeholder text
        input.setAttribute('placeholder', 'Search...');

        // Add a focus event to prepare items when the search input is focused
        input.addEventListener('focus', function() {
            // Ensure all items have search text before filtering
            const categoryPanel = this.closest('.category-panel');
            if (categoryPanel) {
                const availableItems = categoryPanel.querySelectorAll('.available-items .item-tag');
                availableItems.forEach(item => {
                    if (!item.hasAttribute('data-search-text')) {
                        prepareItemForSearch(item);
                    }
                });
            }
        });

        // Add direct input event handler to each search input
        input.addEventListener('input', function() {
            console.log("Direct input event on search:", this.value);
            filterAvailableItems(this);
        });
    });

    // Fix search functionality for existing items
    prepareItemsForSearch();
}

/**
 * Prepare a single item for search
 * @param {HTMLElement} item - The item to prepare
 */
function prepareItemForSearch(item) {
    // Extract clean text without icons and buttons
    let text = '';
    const textNodes = Array.from(item.childNodes).filter(node => {
        return !(node.nodeType === 1 &&
                (node.classList.contains('material-icons') ||
                 node.classList.contains('remove-tag') ||
                 node.classList.contains('highlight')));
    });

    if (textNodes.length > 0) {
        text = textNodes.map(node => node.textContent || '').join('').trim();
    } else {
        text = item.textContent.replace(/close|place|domain|location_city|group|language/g, '').trim();
    }

    // Store the clean text
    item.setAttribute('data-search-text', text);
    console.log(`Item prepared for search: "${text}"`);

    // Make sure the item is visible by default
    item.style.display = 'inline-flex';
    item.classList.remove('hidden-by-search');
}

/**
 * Prepare items for search by extracting clean text
 */
function prepareItemsForSearch() {
    console.log("Preparing all items for search");

    // Add data-search-text attribute to all items
    document.querySelectorAll('.item-tag').forEach(item => {
        prepareItemForSearch(item);
    });

    // Remove any existing no-results messages (clean slate)
    document.querySelectorAll('.no-results-message').forEach(msg => {
        msg.remove();
    });

    // Remove any existing highlights
    document.querySelectorAll('.highlight').forEach(highlight => {
        const text = highlight.textContent;
        const textNode = document.createTextNode(text);
        if (highlight.parentNode) {
            highlight.parentNode.replaceChild(textNode, highlight);
        }
    });
}

/**
 * Filter available items based on search input
 * @param {HTMLElement} searchInput - The search input element
 */
function filterAvailableItems(searchInput) {
    // Get the search term
    const searchTerm = searchInput.value.toLowerCase().trim();
    console.log("Filtering for search term:", searchTerm);

    // Get the category panel
    const categoryPanel = searchInput.closest('.category-panel');
    if (!categoryPanel) {
        console.error("No category panel found for search input");
        return;
    }

    // Get all available items
    const availableItems = categoryPanel.querySelectorAll('.available-items .item-tag');
    console.log("Available items count:", availableItems.length);

    // Track if we have any visible items
    let hasVisibleItems = false;

    // First, make sure all items have search text
    availableItems.forEach(item => {
        if (!item.hasAttribute('data-search-text')) {
            // Extract clean text without icons and buttons
            let text = '';
            const textNodes = Array.from(item.childNodes).filter(node => {
                return !(node.nodeType === 1 &&
                        (node.classList.contains('material-icons') ||
                         node.classList.contains('remove-tag') ||
                         node.classList.contains('highlight')));
            });

            if (textNodes.length > 0) {
                text = textNodes.map(node => node.textContent || '').join('').trim();
            } else {
                text = item.textContent.replace(/close|place|domain|location_city|group|language/g, '').trim();
            }

            item.setAttribute('data-search-text', text);
            console.log(`Setting search text for item: "${text}"`);
        }
    });

    // If search term is empty, show all items
    if (searchTerm === '') {
        console.log("Empty search term, showing all items");
        availableItems.forEach(item => {
            item.style.display = 'inline-flex';
            item.classList.remove('hidden-by-search');
            removeHighlights(item);
        });
        hasVisibleItems = availableItems.length > 0;
    } else {
        // Process each available item for the search term
        availableItems.forEach(item => {
            const searchableText = item.getAttribute('data-search-text').toLowerCase();

            // Check if the item text contains the search term
            if (searchableText.includes(searchTerm)) {
                // Show the item
                item.style.display = 'inline-flex';
                item.classList.remove('hidden-by-search');
                hasVisibleItems = true;
                console.log(`Item matches: "${searchableText}"`);

                // Highlight the matching text
                highlightMatchingText(item, searchableText, searchTerm);
            } else {
                // Hide the item
                item.style.display = 'none';
                item.classList.add('hidden-by-search');
                console.log(`Item does not match: "${searchableText}"`);
            }
        });
    }

    // Always show selected items in the selected area
    const selectedItems = categoryPanel.querySelectorAll('.selected-items .item-tag:not(.empty-state)');
    selectedItems.forEach(item => {
        item.style.display = 'inline-flex';

        // Remove highlights from selected items if search is empty
        if (searchTerm === '') {
            removeHighlights(item);
        }
    });

    // Handle empty state in selected area
    const selectedEmptyState = categoryPanel.querySelector('.selected-items .empty-state');
    if (selectedEmptyState) {
        if (selectedItems.length > 0) {
            selectedEmptyState.style.display = 'none';
        } else {
            selectedEmptyState.style.display = 'flex';
        }
    }

    // Update the Select All button text based on context
    updateSelectAllButtonText(categoryPanel);

    console.log(`Search complete. Visible items: ${hasVisibleItems ? 'Yes' : 'No'}`);
}

/**
 * Highlight matching text in an item
 * @param {HTMLElement} item - The item element
 * @param {string} searchableText - The searchable text of the item
 * @param {string} searchTerm - The search term
 */
function highlightMatchingText(item, searchableText, searchTerm) {
    // First remove any existing highlights
    removeHighlights(item);

    // Find the text node to replace
    const textNodes = Array.from(item.childNodes).filter(node => {
        return node.nodeType === 3 ||
              (node.nodeType === 1 &&
               !node.classList.contains('material-icons') &&
               !node.classList.contains('remove-tag'));
    });

    if (textNodes.length === 0) return;

    // Get the original text
    const originalText = searchableText;
    const startIndex = originalText.indexOf(searchTerm);

    if (startIndex >= 0) {
        const endIndex = startIndex + searchTerm.length;
        const beforeMatch = originalText.substring(0, startIndex);
        const match = originalText.substring(startIndex, endIndex);
        const afterMatch = originalText.substring(endIndex);

        // Create a wrapper span
        const wrapper = document.createElement('span');

        // Add the text before the match
        if (beforeMatch) {
            const beforeSpan = document.createElement('span');
            beforeSpan.textContent = beforeMatch;
            wrapper.appendChild(beforeSpan);
        }

        // Add the highlighted match
        const highlightSpan = document.createElement('span');
        highlightSpan.className = 'highlight';
        highlightSpan.textContent = match;
        wrapper.appendChild(highlightSpan);

        // Add the text after the match
        if (afterMatch) {
            const afterSpan = document.createElement('span');
            afterSpan.textContent = afterMatch;
            wrapper.appendChild(afterSpan);
        }

        // Replace the text node with our wrapper
        const textNode = textNodes[0];
        if (textNode.nodeType === 3) {
            // It's a direct text node
            item.replaceChild(wrapper, textNode);
        } else {
            // It's an element, replace its content
            textNode.innerHTML = '';
            textNode.appendChild(wrapper);
        }
    }
}

/**
 * Remove highlights from an item
 * @param {HTMLElement} item - The item element
 */
function removeHighlights(item) {
    // Find any highlight spans
    const highlights = item.querySelectorAll('.highlight');

    highlights.forEach(highlight => {
        // Get the parent span if it exists
        const parent = highlight.parentNode;

        if (parent && parent.tagName === 'SPAN') {
            // Get the text content
            const text = parent.textContent;

            // Create a text node
            const textNode = document.createTextNode(text);

            // Replace the parent span with the text node
            if (parent.parentNode) {
                parent.parentNode.replaceChild(textNode, parent);
            }
        } else {
            // Just replace the highlight with its text content
            const text = highlight.textContent;
            const textNode = document.createTextNode(text);

            if (highlight.parentNode) {
                highlight.parentNode.replaceChild(textNode, highlight);
            }
        }
    });
}

/**
 * Set default selections for all fields
 */
function setDefaultSelections() {
    console.log("Setting default selections for all fields");

    // Clear existing selections first
    clearAllFilters();

    // Set default for Region (North America)
    const regionItem = document.querySelector('.region-panel .available-items .item-tag[data-id="region1"]');
    if (regionItem) {
        moveToSelected(regionItem);
    }

    // Set default for Company (Acme Corporation)
    const companyItem = document.querySelector('.company-panel .available-items .item-tag[data-id="company1"]');
    if (companyItem) {
        moveToSelected(companyItem);
    }

    // Set default for Branch (Headquarters)
    const branchItem = document.querySelector('.branch-panel .available-items .item-tag[data-id="branch1"]');
    if (branchItem) {
        moveToSelected(branchItem);
    }

    // Set default for Sub-Branch (Team Alpha)
    const subBranchItem = document.querySelector('.subbranch-panel .available-items .item-tag[data-id="subbranch1"]');
    if (subBranchItem) {
        moveToSelected(subBranchItem);
    }

    // Set default for Language (English is already selected in HTML)
    // Make sure it's properly reflected in the UI
    const languageItem = document.querySelector('.language-panel .available-items .item-tag[data-id="lang1"]');
    if (languageItem) {
        moveToSelected(languageItem);
    }

    // Set default document type to Report
    const typeReportRadio = document.getElementById('typeReport');
    if (typeReportRadio) {
        typeReportRadio.checked = true;
        typeReportRadio.parentElement.classList.add('is-checked');
    }

    // Set default first page option to Report Header
    const firstPageRadio = document.getElementById('firstPage1');
    if (firstPageRadio) {
        firstPageRadio.checked = true;
        firstPageRadio.parentElement.classList.add('is-checked');
    }

    // Set default last page option to Report Footer
    const lastPageRadio = document.getElementById('lastPage1');
    if (lastPageRadio) {
        lastPageRadio.checked = true;
        lastPageRadio.parentElement.classList.add('is-checked');
    }

    // Show report options, hide page options
    const reportOptions = document.getElementById('reportOptions');
    const pageOptions = document.getElementById('pageOptions');
    if (reportOptions && pageOptions) {
        reportOptions.style.display = 'block';
        pageOptions.style.display = 'none';
    }

    // Update preview if available
    if (typeof updatePreview === 'function') {
        updatePreview();
    }

    console.log("Default selections set");
}

/**
 * Clear all filters and reset to default state
 */
function clearAllFilters() {
    // Clear all selected items
    document.querySelectorAll('.selected-items .item-tag:not(.empty-state)').forEach(item => {
        moveToAvailable(item);
    });

    // Show all available items
    document.querySelectorAll('.available-items .item-tag').forEach(item => {
        item.style.display = '';
    });

    // Clear all search inputs
    document.querySelectorAll('.smart-search input').forEach(input => {
        input.value = '';
        filterAvailableItems(input);
    });

    // Reset counts
    document.querySelectorAll('.category-panel').forEach(panel => {
        updateCount(panel);
    });

    // Show empty states
    document.querySelectorAll('.selected-items .empty-state').forEach(state => {
        state.style.display = '';
    });

    // Update all Select All buttons
    document.querySelectorAll('.category-panel').forEach(panel => {
        updateSelectAllButtonText(panel);
    });
}

/**
 * Enforce fixed layout
 */
function enforceFixedLayout() {
    // Fix selection areas height
    document.querySelectorAll('.selection-areas').forEach(area => {
        area.style.height = '180px';
    });

    // Fix available and selected items containers height
    document.querySelectorAll('.available-items, .selected-items').forEach(container => {
        container.style.height = '180px';
        container.style.overflow = 'auto';
    });

    // Fix category content height and ensure it's always visible (no accordion)
    document.querySelectorAll('.category-content').forEach(content => {
        content.style.maxHeight = '400px';
        content.style.display = 'block'; // Always show content
    });

    // Remove pointer cursor from headers (since they're not clickable anymore)
    document.querySelectorAll('.category-header').forEach(header => {
        header.style.cursor = 'default';
    });
}

// Initialize when the DOM is ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initFixedSelection();
} else {
    document.addEventListener('DOMContentLoaded', initFixedSelection);
}
