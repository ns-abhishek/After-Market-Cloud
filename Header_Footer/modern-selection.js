/**
 * Modern Selection Interface with Visual Tag-Based Selection
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the modern selection interface
    initModernSelection();
});

/**
 * Initialize the modern selection interface
 */
function initModernSelection() {
    // Set up category panels
    setupCategoryPanels();

    // Initialize drag and drop
    initDragAndDrop();

    // Set up smart search
    setupSmartSearch();

    // Set up select all buttons
    setupSelectAllButtons();

    // Initialize default selections
    initDefaultSelections();

    // Ensure fixed layout
    maintainFixedLayout();

    // Add window resize listener to maintain fixed layout
    window.addEventListener('resize', maintainFixedLayout);
}

/**
 * Initialize default selections based on checked checkboxes
 */
function initDefaultSelections() {
    // For each category panel, check which items should be selected by default
    document.querySelectorAll('.category-panel').forEach(panel => {
        let checkboxClass = '';

        if (panel.classList.contains('region-panel')) {
            checkboxClass = 'region-checkbox';
        } else if (panel.classList.contains('company-panel')) {
            checkboxClass = 'company-checkbox';
        } else if (panel.classList.contains('branch-panel')) {
            checkboxClass = 'branch-checkbox';
        } else if (panel.classList.contains('subbranch-panel')) {
            checkboxClass = 'subbranch-checkbox';
        } else if (panel.classList.contains('language-panel')) {
            checkboxClass = 'language-checkbox';
        }

        if (checkboxClass) {
            // Find all checked checkboxes of this type
            document.querySelectorAll('.' + checkboxClass + ':checked').forEach(checkbox => {
                // Find the corresponding item tag
                const itemId = checkbox.id;
                const itemTag = panel.querySelector(`.available-items .item-tag[data-id="${itemId}"]`);

                if (itemTag) {
                    // Move it to selected
                    moveItemToSelected(itemTag);
                }
            });
        }
    });
}

/**
 * Set up expandable/collapsible category panels
 */
function setupCategoryPanels() {
    const categoryHeaders = document.querySelectorAll('.category-header');

    categoryHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const panel = this.closest('.category-panel');
            const content = panel.querySelector('.category-content');
            const icon = this.querySelector('.category-title i');

            // Toggle the content visibility
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                icon.textContent = 'expand_more';
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
                icon.textContent = 'expand_less';
            }
        });
    });

    // Expand all panels by default
    categoryHeaders.forEach(header => {
        const content = header.closest('.category-panel').querySelector('.category-content');
        const icon = header.querySelector('.category-title i');
        content.style.maxHeight = content.scrollHeight + 'px';
        icon.textContent = 'expand_less';
    });
}

/**
 * Initialize drag and drop functionality
 */
function initDragAndDrop() {
    // Use event delegation for drag and drop to handle dynamically created elements
    document.addEventListener('dragstart', function(e) {
        if (e.target.classList.contains('item-tag')) {
            handleDragStart.call(e.target, e);
        }
    });

    document.addEventListener('dragend', function(e) {
        if (e.target.classList.contains('item-tag')) {
            handleDragEnd.call(e.target, e);
        }
    });

    // Set up drop areas using event delegation
    document.addEventListener('dragover', function(e) {
        const dropArea = e.target.closest('.available-items, .selected-items');
        if (dropArea) {
            handleDragOver.call(dropArea, e);
        }
    });

    document.addEventListener('dragenter', function(e) {
        const dropArea = e.target.closest('.available-items, .selected-items');
        if (dropArea) {
            handleDragEnter.call(dropArea, e);
        }
    });

    document.addEventListener('dragleave', function(e) {
        const dropArea = e.target.closest('.available-items, .selected-items');
        if (dropArea) {
            handleDragLeave.call(dropArea, e);
        }
    });

    document.addEventListener('drop', function(e) {
        const dropArea = e.target.closest('.available-items, .selected-items');
        if (dropArea) {
            handleDrop.call(dropArea, e);
        }
    });

    // Use event delegation for click events
    document.addEventListener('click', function(e) {
        // Handle item clicks
        if (e.target.classList.contains('item-tag') || e.target.closest('.item-tag')) {
            const itemTag = e.target.classList.contains('item-tag') ? e.target : e.target.closest('.item-tag');

            // Don't handle clicks on remove buttons
            if (!e.target.closest('.remove-tag')) {
                handleItemClick.call(itemTag, e);
            }
        }

        // Handle remove button clicks
        if (e.target.closest('.remove-tag')) {
            e.stopPropagation(); // Prevent item click event
            const tag = e.target.closest('.item-tag');
            moveItemToAvailable(tag);
        }
    });

    // Make all existing items draggable
    document.querySelectorAll('.item-tag').forEach(item => {
        item.setAttribute('draggable', 'true');
    });
}

// Keep track of the dragged item
let draggedItem = null;

/**
 * Handle the start of a drag operation
 * @param {DragEvent} e - The drag event
 */
function handleDragStart(e) {
    draggedItem = this;
    this.classList.add('dragging');

    // Set the data to be dragged
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.outerHTML);

    // Create a custom ghost image
    const ghostElement = this.cloneNode(true);
    ghostElement.style.width = this.offsetWidth + 'px';
    ghostElement.style.opacity = '0.8';
    ghostElement.style.position = 'absolute';
    ghostElement.style.top = '-1000px';
    document.body.appendChild(ghostElement);
    e.dataTransfer.setDragImage(ghostElement, 20, 20);

    // Remove the ghost element after it's been used
    setTimeout(() => {
        document.body.removeChild(ghostElement);
    }, 0);
}

/**
 * Handle the end of a drag operation
 */
function handleDragEnd() {
    this.classList.remove('dragging');

    // Reset all drop areas
    document.querySelectorAll('.available-items, .selected-items').forEach(area => {
        area.classList.remove('drag-over');
    });

    draggedItem = null;
}

/**
 * Handle an element being dragged over a drop area
 * @param {DragEvent} e - The drag event
 */
function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault(); // Allows us to drop
    }

    e.dataTransfer.dropEffect = 'move';
    return false;
}

/**
 * Handle an element being dragged into a drop area
 */
function handleDragEnter() {
    this.classList.add('drag-over');
}

/**
 * Handle an element being dragged out of a drop area
 */
function handleDragLeave() {
    this.classList.remove('drag-over');
}

/**
 * Handle an element being dropped onto a drop area
 * @param {DragEvent} e - The drag event
 */
function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation(); // Stops some browsers from redirecting
    }

    if (draggedItem) {
        // Check if we're dropping into the selected or available area
        if (this.classList.contains('selected-items')) {
            // Only allow drops if we're in the same category panel
            const sourcePanel = draggedItem.closest('.category-panel');
            const targetPanel = this.closest('.category-panel');

            if (sourcePanel === targetPanel) {
                moveItemToSelected(draggedItem);
            }
        } else if (this.classList.contains('available-items')) {
            // Only allow drops if we're in the same category panel
            const sourcePanel = draggedItem.closest('.category-panel');
            const targetPanel = this.closest('.category-panel');

            if (sourcePanel === targetPanel) {
                moveItemToAvailable(draggedItem);
            }
        }
    }

    this.classList.remove('drag-over');
    return false;
}

/**
 * Handle item click (for mobile devices)
 */
function handleItemClick() {
    // Toggle between available and selected
    const parentArea = this.closest('.available-items, .selected-items');

    if (parentArea.classList.contains('available-items')) {
        moveItemToSelected(this);
    } else {
        moveItemToAvailable(this);
    }
}

/**
 * Move an item to the selected items area
 * @param {HTMLElement} item - The item to move
 */
function moveItemToSelected(item) {
    // Find the correct selected area within the same category panel
    const categoryPanel = item.closest('.category-panel');
    if (!categoryPanel) return; // Safety check

    const selectedArea = categoryPanel.querySelector('.selected-items');
    if (!selectedArea) return; // Safety check

    const clone = item.cloneNode(true);

    // Add selected class and remove button if not already present
    clone.classList.add('selected');

    if (!clone.querySelector('.remove-tag')) {
        const removeBtn = document.createElement('span');
        removeBtn.className = 'remove-tag';
        removeBtn.innerHTML = '<i class="material-icons">close</i>';
        clone.appendChild(removeBtn);
    }

    // Set up the new item
    clone.setAttribute('draggable', 'true');

    // Add to selected area
    selectedArea.appendChild(clone);

    // Remove from available area if it came from there
    if (item.closest('.available-items')) {
        item.remove();
    }

    // Update counts
    updateItemCounts();

    // Update hidden input fields for validation
    updateHiddenInputs(categoryPanel);

    // Prevent layout expansion by maintaining fixed heights
    maintainFixedLayout();
}

/**
 * Move an item to the available items area
 * @param {HTMLElement} item - The item to move
 */
function moveItemToAvailable(item) {
    // Find the correct available area within the same category panel
    const categoryPanel = item.closest('.category-panel');
    if (!categoryPanel) return; // Safety check

    const availableArea = categoryPanel.querySelector('.available-items');
    if (!availableArea) return; // Safety check

    const clone = item.cloneNode(true);

    // Remove selected class and remove button
    clone.classList.remove('selected');
    const removeBtn = clone.querySelector('.remove-tag');
    if (removeBtn) {
        removeBtn.remove();
    }

    // Set up the new item
    clone.setAttribute('draggable', 'true');

    // Add to available area
    availableArea.appendChild(clone);

    // Remove from selected area if it came from there
    if (item.closest('.selected-items')) {
        item.remove();
    }

    // Update counts
    updateItemCounts();

    // Update hidden input fields for validation
    updateHiddenInputs(categoryPanel);

    // Prevent layout expansion by maintaining fixed heights
    maintainFixedLayout();
}

/**
 * Update the item counts in category headers
 */
function updateItemCounts() {
    const categories = document.querySelectorAll('.category-panel');

    categories.forEach(category => {
        const selectedItems = category.querySelectorAll('.selected-items .item-tag').length;
        const countElement = category.querySelector('.category-count');

        if (countElement) {
            countElement.textContent = selectedItems;
        }
    });
}

/**
 * Set up smart search functionality
 */
function setupSmartSearch() {
    const searchInputs = document.querySelectorAll('.smart-search input');

    searchInputs.forEach(input => {
        input.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const categoryPanel = this.closest('.category-panel');
            const availableItems = categoryPanel.querySelectorAll('.available-items .item-tag');

            availableItems.forEach(item => {
                const text = item.textContent.toLowerCase();

                if (text.includes(searchTerm)) {
                    item.style.display = 'inline-flex';

                    // Highlight the matching text
                    if (searchTerm.length > 0) {
                        const itemText = item.textContent;
                        const startIndex = itemText.toLowerCase().indexOf(searchTerm);

                        if (startIndex >= 0) {
                            const endIndex = startIndex + searchTerm.length;
                            const highlightedText =
                                itemText.substring(0, startIndex) +
                                '<span class="highlight">' +
                                itemText.substring(startIndex, endIndex) +
                                '</span>' +
                                itemText.substring(endIndex);

                            // Only update the text content, not any child elements
                            const textNode = Array.from(item.childNodes).find(node => node.nodeType === 3);
                            if (textNode) {
                                const span = document.createElement('span');
                                span.innerHTML = highlightedText;
                                item.replaceChild(span, textNode);
                            }
                        }
                    }
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

/**
 * Set up select all buttons
 */
function setupSelectAllButtons() {
    // Use event delegation for select all buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.select-all-btn')) {
            const button = e.target.closest('.select-all-btn');
            const categoryPanel = button.closest('.category-panel');
            const availableItems = Array.from(categoryPanel.querySelectorAll('.available-items .item-tag'));

            // Create a copy of the array since we'll be modifying the DOM
            const itemsToMove = [...availableItems];

            // Move all visible available items to selected
            itemsToMove.forEach(item => {
                if (item.style.display !== 'none') {
                    moveItemToSelected(item);
                }
            });

            // Update the hidden checkboxes
            updateHiddenInputs(categoryPanel);
        }
    });
}

/**
 * Maintain fixed layout by enforcing fixed heights
 */
function maintainFixedLayout() {
    // Enforce fixed heights on selection areas
    document.querySelectorAll('.selection-areas').forEach(area => {
        area.style.height = '180px';
    });

    document.querySelectorAll('.available-items, .selected-items').forEach(container => {
        container.style.height = '180px';
        container.style.overflow = 'auto';
    });

    // Ensure category panels don't expand beyond their set height
    document.querySelectorAll('.category-content').forEach(content => {
        if (content.style.maxHeight) {
            // Refresh the max height to prevent expansion
            content.style.maxHeight = '400px';
        }
    });
}

/**
 * Update hidden input fields for validation
 * @param {HTMLElement} categoryPanel - The category panel containing the selection
 */
function updateHiddenInputs(categoryPanel) {
    // Determine which category we're dealing with
    let inputClass = '';
    if (categoryPanel.classList.contains('region-panel')) {
        inputClass = 'region-checkbox';
    } else if (categoryPanel.classList.contains('company-panel')) {
        inputClass = 'company-checkbox';
    } else if (categoryPanel.classList.contains('branch-panel')) {
        inputClass = 'branch-checkbox';
    } else if (categoryPanel.classList.contains('subbranch-panel')) {
        inputClass = 'subbranch-checkbox';
    } else if (categoryPanel.classList.contains('language-panel')) {
        inputClass = 'language-checkbox';
    }

    if (!inputClass) return;

    // Get all selected items
    const selectedItems = categoryPanel.querySelectorAll('.selected-items .item-tag');

    // Find all checkboxes of this type and uncheck them
    document.querySelectorAll('.' + inputClass).forEach(checkbox => {
        checkbox.checked = false;
        checkbox.parentElement.classList.remove('is-checked');
    });

    // Check the ones that are selected
    selectedItems.forEach(item => {
        const itemId = item.dataset.id;
        if (itemId) {
            const checkbox = document.getElementById(itemId);
            if (checkbox) {
                checkbox.checked = true;
                checkbox.parentElement.classList.add('is-checked');
            }
        }
    });

    // Update the "Select All" checkbox state
    const selectAllId = inputClass.replace('-checkbox', '');
    const selectAllCheckbox = document.getElementById('selectAll' + selectAllId.charAt(0).toUpperCase() + selectAllId.slice(1) + 's');

    if (selectAllCheckbox) {
        const checkboxes = document.querySelectorAll('.' + inputClass);
        const checkedCount = document.querySelectorAll('.' + inputClass + ':checked').length;

        if (checkedCount === 0) {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.parentElement.classList.remove('is-checked');
            selectAllCheckbox.indeterminate = false;
        } else if (checkedCount === checkboxes.length) {
            selectAllCheckbox.checked = true;
            selectAllCheckbox.parentElement.classList.add('is-checked');
            selectAllCheckbox.indeterminate = false;
        } else {
            selectAllCheckbox.indeterminate = true;
            selectAllCheckbox.checked = false;
            selectAllCheckbox.parentElement.classList.remove('is-checked');
        }
    }
}
