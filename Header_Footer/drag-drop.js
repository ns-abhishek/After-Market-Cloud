/**
 * Drag and Drop functionality for checkbox lists
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize drag and drop for all checkbox lists
    initDragAndDrop();
});

/**
 * Initialize drag and drop functionality for all checkbox lists
 */
function initDragAndDrop() {
    const checkboxLists = document.querySelectorAll('.checkbox-list');
    
    checkboxLists.forEach(list => {
        const items = list.querySelectorAll('.mdl-checkbox');
        
        items.forEach(item => {
            // Make items draggable
            item.setAttribute('draggable', 'true');
            
            // Add event listeners for drag events
            item.addEventListener('dragstart', handleDragStart);
            item.addEventListener('dragend', handleDragEnd);
            item.addEventListener('dragover', handleDragOver);
            item.addEventListener('dragenter', handleDragEnter);
            item.addEventListener('dragleave', handleDragLeave);
            item.addEventListener('drop', handleDrop);
        });
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
    e.dataTransfer.setData('text/html', this.innerHTML);
    
    // Create a custom ghost image (optional)
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
    
    // Reset all items' styles
    const items = document.querySelectorAll('.mdl-checkbox');
    items.forEach(item => {
        item.classList.remove('drag-over');
    });
    
    draggedItem = null;
}

/**
 * Handle an element being dragged over another element
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
 * Handle an element being dragged into another element
 */
function handleDragEnter() {
    this.classList.add('drag-over');
}

/**
 * Handle an element being dragged out of another element
 */
function handleDragLeave() {
    this.classList.remove('drag-over');
}

/**
 * Handle an element being dropped onto another element
 * @param {DragEvent} e - The drag event
 */
function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation(); // Stops some browsers from redirecting
    }
    
    // Don't do anything if dropping the same item we're dragging
    if (draggedItem !== this) {
        // Get the list that contains both items
        const list = this.parentNode;
        
        // Determine whether to insert before or after the drop target
        const rect = this.getBoundingClientRect();
        const midpoint = rect.top + rect.height / 2;
        const insertBefore = e.clientY < midpoint;
        
        if (insertBefore) {
            list.insertBefore(draggedItem, this);
        } else {
            list.insertBefore(draggedItem, this.nextSibling);
        }
    }
    
    this.classList.remove('drag-over');
    return false;
}

/**
 * Refresh drag and drop functionality after dynamic content changes
 */
function refreshDragAndDrop() {
    // Remove existing event listeners
    const items = document.querySelectorAll('.mdl-checkbox');
    items.forEach(item => {
        item.removeAttribute('draggable');
        item.removeEventListener('dragstart', handleDragStart);
        item.removeEventListener('dragend', handleDragEnd);
        item.removeEventListener('dragover', handleDragOver);
        item.removeEventListener('dragenter', handleDragEnter);
        item.removeEventListener('dragleave', handleDragLeave);
        item.removeEventListener('drop', handleDrop);
    });
    
    // Re-initialize drag and drop
    initDragAndDrop();
}
