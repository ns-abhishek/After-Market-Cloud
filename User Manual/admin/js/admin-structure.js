/**
 * Admin Structure Management Module
 * Handles documentation structure organization and hierarchy management
 */
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const structureSections = document.querySelectorAll('.structure-sections li a');
    const structureTree = document.getElementById('structure-tree');
    const expandAllButton = document.querySelector('.structure-actions button:nth-child(1)');
    const collapseAllButton = document.querySelector('.structure-actions button:nth-child(2)');
    const saveStructureButton = document.querySelector('.structure-actions button:nth-child(3)');
    const documentTypeButtons = document.querySelectorAll('.document-type-btn');
    const moduleSelector = document.querySelector('.module-selector');
    const moduleSelect = document.getElementById('module-select');
    const completeManualItems = document.querySelectorAll('.structure-item:not(.module-item)');
    const moduleManualItems = document.querySelectorAll('.structure-item.module-item');

    // Initialize structure manager
    initStructureManager();

    /**
     * Initialize structure manager components and event listeners
     */
    function initStructureManager() {
        // Set up section navigation
        if (structureSections.length > 0) {
            structureSections.forEach(section => {
                section.addEventListener('click', function(e) {
                    e.preventDefault();
                    switchSection(this.dataset.section);
                });
            });
        }

        // Set up expand/collapse buttons
        if (expandAllButton) {
            expandAllButton.addEventListener('click', expandAll);
        }

        if (collapseAllButton) {
            collapseAllButton.addEventListener('click', collapseAll);
        }

        // Set up save button
        if (saveStructureButton) {
            saveStructureButton.addEventListener('click', saveStructure);
        }

        // Set up document type buttons
        if (documentTypeButtons.length > 0) {
            documentTypeButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const docType = this.dataset.type;
                    switchDocumentType(docType);
                });
            });
        }

        // Set up module selector
        if (moduleSelect) {
            moduleSelect.addEventListener('change', function() {
                const module = this.value;
                switchModule(module);
            });
        }

        // Initialize drag and drop functionality
        initDragAndDrop();

        // Set up item expand toggles
        setupExpandToggles();

        // Set up action buttons
        setupActionButtons();
    }

    /**
     * Switch between document types (Complete User Manual or Module-Specific Manuals)
     * @param {string} docType - The document type to switch to
     */
    function switchDocumentType(docType) {
        // Update active button
        documentTypeButtons.forEach(button => {
            if (button.dataset.type === docType) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });

        // Show/hide module selector
        if (docType === 'module') {
            moduleSelector.style.display = 'flex';

            // Show module-specific items, hide complete manual items
            completeManualItems.forEach(item => {
                if (!item.classList.contains('add-new-item')) {
                    item.style.display = 'none';
                }
            });

            moduleManualItems.forEach(item => {
                item.style.display = 'block';
            });

            // Update section header
            const sectionHeader = document.querySelector('.structure-content-header h3');
            if (sectionHeader) {
                const module = moduleSelect.options[moduleSelect.selectedIndex].text;
                sectionHeader.innerHTML = `<i class="fas fa-puzzle-piece"></i> ${module} Module Documentation`;
            }

            showNotification(`Switched to Module-Specific Manual structure`, 'info');
        } else {
            moduleSelector.style.display = 'none';

            // Show complete manual items, hide module-specific items
            completeManualItems.forEach(item => {
                item.style.display = 'block';
            });

            moduleManualItems.forEach(item => {
                item.style.display = 'none';
            });

            // Update section header
            const sectionHeader = document.querySelector('.structure-content-header h3');
            if (sectionHeader) {
                sectionHeader.innerHTML = `<i class="fas fa-rocket"></i> Getting Started Section`;
            }

            showNotification(`Switched to Complete User Manual structure`, 'info');
        }
    }

    /**
     * Switch between modules for Module-Specific Manuals
     * @param {string} module - The module to switch to
     */
    function switchModule(module) {
        // Update section header
        const sectionHeader = document.querySelector('.structure-content-header h3');
        if (sectionHeader) {
            const moduleName = moduleSelect.options[moduleSelect.selectedIndex].text;
            sectionHeader.innerHTML = `<i class="fas fa-puzzle-piece"></i> ${moduleName} Module Documentation`;
        }

        // In a real application, this would load the structure for the selected module
        showNotification(`Loaded structure for ${moduleSelect.options[moduleSelect.selectedIndex].text} module`, 'info');
    }

    /**
     * Switch between content sections
     * @param {string} sectionId - ID of the section to switch to
     */
    function switchSection(sectionId) {
        // Update active section
        structureSections.forEach(section => {
            const listItem = section.parentElement;

            if (section.dataset.section === sectionId) {
                listItem.classList.add('active');
            } else {
                listItem.classList.remove('active');
            }
        });

        // Update section header
        const sectionHeader = document.querySelector('.structure-content-header h3');
        if (sectionHeader) {
            // Get section name and icon
            const activeSection = document.querySelector(`.structure-sections li.active a`);
            if (activeSection) {
                const icon = activeSection.querySelector('i').className;
                const title = activeSection.textContent.trim();

                sectionHeader.innerHTML = `<i class="${icon}"></i> ${title} Section`;
            }
        }

        // In a real application, this would load the structure for the selected section
        // For demo purposes, we'll show a notification
        showNotification(`Loaded "${sectionId}" section structure`, 'info');
    }

    /**
     * Initialize drag and drop functionality
     */
    function initDragAndDrop() {
        // Initialize main tree
        if (structureTree) {
            new Sortable(structureTree, {
                animation: 150,
                handle: '.drag-handle',
                ghostClass: 'sortable-ghost',
                chosenClass: 'sortable-chosen',
                dragClass: 'sortable-drag',
                onEnd: function(evt) {
                    // In a real application, this would update the structure order
                    console.log('Item moved:', evt.oldIndex, 'to', evt.newIndex);
                }
            });

            // Initialize subtrees
            const subtrees = document.querySelectorAll('.structure-subtree');
            subtrees.forEach(subtree => {
                new Sortable(subtree, {
                    animation: 150,
                    handle: '.drag-handle',
                    ghostClass: 'sortable-ghost',
                    chosenClass: 'sortable-chosen',
                    dragClass: 'sortable-drag',
                    group: 'nested',
                    onEnd: function(evt) {
                        // In a real application, this would update the structure order
                        console.log('Subitem moved:', evt.oldIndex, 'to', evt.newIndex);
                    }
                });
            });
        }
    }

    /**
     * Set up item expand toggles
     */
    function setupExpandToggles() {
        const expandToggles = document.querySelectorAll('.item-expand-toggle:not(.disabled)');

        expandToggles.forEach(toggle => {
            toggle.addEventListener('click', function() {
                const item = this.closest('.structure-item');
                const subtree = item.querySelector('.structure-subtree');
                const icon = this.querySelector('i');

                if (subtree) {
                    if (subtree.style.display === 'none') {
                        // Expand
                        subtree.style.display = 'block';
                        icon.className = 'fas fa-caret-down';
                    } else {
                        // Collapse
                        subtree.style.display = 'none';
                        icon.className = 'fas fa-caret-right';
                    }
                }
            });
        });
    }

    /**
     * Set up action buttons (edit, view, preview, add)
     */
    function setupActionButtons() {
        // Edit buttons
        const editButtons = document.querySelectorAll('.action-btn.edit');
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const item = this.closest('.structure-item');
                const title = item.querySelector('.item-title').textContent;

                // In a real application, this would open the item for editing
                // For demo purposes, we'll show a notification
                showNotification(`Editing "${title}"`, 'info');
            });
        });

        // View buttons
        const viewButtons = document.querySelectorAll('.action-btn.view');
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const item = this.closest('.structure-item');
                const title = item.querySelector('.item-title').textContent;

                // In a real application, this would open a preview of the item
                // For demo purposes, we'll show a notification
                showNotification(`Viewing "${title}"`, 'info');
            });
        });

        // Preview buttons
        const previewButtons = document.querySelectorAll('.action-btn.preview');
        previewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const item = this.closest('.structure-item');
                const title = item.querySelector('.item-title').textContent;
                const isModuleItem = item.classList.contains('module-item') || item.closest('.module-item');
                const docType = isModuleItem ? 'module' : 'complete';

                // In a real application, this would open the preview page with the item
                window.location.href = `preview.html?title=${encodeURIComponent(title)}&type=${docType}`;
            });
        });

        // Add buttons
        const addButtons = document.querySelectorAll('.action-btn.add');
        addButtons.forEach(button => {
            button.addEventListener('click', function() {
                const item = this.closest('.structure-item');
                const title = item.querySelector('.item-title').textContent;

                // In a real application, this would open a form to add a child item
                // For demo purposes, we'll show a notification
                showNotification(`Adding child to "${title}"`, 'info');
            });
        });

        // Add new item
        const addNewItems = document.querySelectorAll('.item-add-new');
        addNewItems.forEach(item => {
            item.addEventListener('click', function() {
                const parentItem = this.closest('.structure-subtree').parentElement;
                const parentTitle = parentItem.querySelector('.item-title').textContent;
                const isModuleItem = parentItem.classList.contains('module-item');
                const docType = isModuleItem ? 'module' : 'complete';
                const module = isModuleItem ? moduleSelect.value : '';

                // In a real application, this would open a form to add a new item
                // For demo purposes, we'll show a notification
                showNotification(`Adding new page to "${parentTitle}" (${docType} manual${module ? ', ' + module + ' module' : ''})`, 'info');
            });
        });
    }

    /**
     * Expand all items in the structure tree
     */
    function expandAll() {
        const subtrees = document.querySelectorAll('.structure-subtree');
        const icons = document.querySelectorAll('.item-expand-toggle:not(.disabled) i');

        subtrees.forEach(subtree => {
            subtree.style.display = 'block';
        });

        icons.forEach(icon => {
            icon.className = 'fas fa-caret-down';
        });

        showNotification('All sections expanded', 'info');
    }

    /**
     * Collapse all items in the structure tree
     */
    function collapseAll() {
        const subtrees = document.querySelectorAll('.structure-subtree');
        const icons = document.querySelectorAll('.item-expand-toggle:not(.disabled) i');

        subtrees.forEach(subtree => {
            subtree.style.display = 'none';
        });

        icons.forEach(icon => {
            icon.className = 'fas fa-caret-right';
        });

        showNotification('All sections collapsed', 'info');
    }

    /**
     * Save structure changes
     */
    function saveStructure() {
        // Add loading animation to button
        saveStructureButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        saveStructureButton.disabled = true;

        // Simulate saving delay
        setTimeout(() => {
            // Reset button
            saveStructureButton.innerHTML = '<i class="fas fa-save"></i> Save Structure';
            saveStructureButton.disabled = false;

            // In a real application, this would save the structure to the server
            // For demo purposes, we'll show a notification
            showNotification('Structure saved successfully', 'success');
        }, 1500);
    }

    /**
     * Show notification message
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, error, warning, info)
     */
    function showNotification(message, type = 'info') {
        // Create notification element if it doesn't exist
        let notificationContainer = document.querySelector('.notification-container');

        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.className = 'notification-container';
            notificationContainer.style.position = 'fixed';
            notificationContainer.style.top = '20px';
            notificationContainer.style.right = '20px';
            notificationContainer.style.zIndex = '9999';
            document.body.appendChild(notificationContainer);
        }

        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;

        // Set notification styles
        notification.style.backgroundColor = type === 'success' ? '#4CAF50' :
                                            type === 'error' ? '#F44336' :
                                            type === 'warning' ? '#FF9800' : '#2196F3';
        notification.style.color = 'white';
        notification.style.padding = '12px 20px';
        notification.style.marginBottom = '10px';
        notification.style.borderRadius = '4px';
        notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        notification.style.display = 'flex';
        notification.style.alignItems = 'center';
        notification.style.justifyContent = 'space-between';
        notification.style.animation = 'slideInLeft 0.3s ease forwards';
        notification.style.opacity = '0';

        // Set notification icon
        const icon = type === 'success' ? 'check-circle' :
                    type === 'error' ? 'exclamation-circle' :
                    type === 'warning' ? 'exclamation-triangle' : 'info-circle';

        // Set notification content
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-${icon}"></i>
                <span>${message}</span>
            </div>
            <button class="close-notification" style="background: none; border: none; color: white; cursor: pointer;">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add notification to container
        notificationContainer.appendChild(notification);

        // Add close button event listener
        const closeButton = notification.querySelector('.close-notification');
        closeButton.addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => {
                notification.remove();
            }, 300);
        });

        // Auto-remove notification after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease forwards';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 5000);

        // Add animations if not already added
        if (!document.querySelector('#notification-animations')) {
            const style = document.createElement('style');
            style.id = 'notification-animations';
            style.textContent = `
                @keyframes slideInLeft {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }

                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
});
