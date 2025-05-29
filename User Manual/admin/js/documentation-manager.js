/**
 * Documentation Management Module
 * Handles centralized documentation management functionality
 */
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const createDocBtn = document.getElementById('create-doc-btn');
    const addNewDocumentBtn = document.getElementById('add-new-document');
    const syncDocumentationBtn = document.getElementById('sync-documentation');
    const publishAllBtn = document.getElementById('publish-all');
    const exportDocumentationBtn = document.getElementById('export-documentation');
    const documentationSections = document.querySelectorAll('.documentation-sections li a');
    const documentationItems = document.querySelectorAll('.documentation-item');
    const searchInput = document.querySelector('.admin-search-input');
    const filterButton = document.querySelector('.admin-filter-button');
    const filterDropdown = document.querySelector('.admin-filter-dropdown');
    const filterCheckboxes = document.querySelectorAll('.filter-checkbox input');
    const filterApplyBtn = document.querySelector('.filter-actions .admin-button:not(.secondary)');
    const filterResetBtn = document.querySelector('.filter-actions .admin-button.secondary');
    const activityItems = document.querySelectorAll('.activity-item');

    // Initialize documentation manager
    initDocumentationManager();

    /**
     * Initialize documentation manager components and event listeners
     */
    function initDocumentationManager() {
        // Set up create document button
        if (createDocBtn) {
            createDocBtn.addEventListener('click', createDocument);
        }

        // Set up add new document button
        if (addNewDocumentBtn) {
            addNewDocumentBtn.addEventListener('click', createDocument);
        }

        // Set up quick action buttons
        if (syncDocumentationBtn) {
            syncDocumentationBtn.addEventListener('click', syncDocumentation);
        }

        if (publishAllBtn) {
            publishAllBtn.addEventListener('click', publishAllPending);
        }

        if (exportDocumentationBtn) {
            exportDocumentationBtn.addEventListener('click', showExportOptions);
        }

        // Set up documentation sections
        if (documentationSections && documentationSections.length > 0) {
            documentationSections.forEach(section => {
                section.addEventListener('click', function(e) {
                    e.preventDefault();
                    switchSection(this.dataset.section);
                });
            });
        }

        // Set up search input
        if (searchInput) {
            searchInput.addEventListener('input', searchDocuments);
        }

        // Set up filter button
        if (filterButton) {
            filterButton.addEventListener('click', toggleFilterDropdown);
        }

        // Set up filter apply button
        if (filterApplyBtn) {
            filterApplyBtn.addEventListener('click', applyFilters);
        }

        // Set up filter reset button
        if (filterResetBtn) {
            filterResetBtn.addEventListener('click', resetFilters);
        }

        // Set up document item actions
        setupDocumentActions();

        // Set up activity item actions
        if (activityItems.length > 0) {
            activityItems.forEach(item => {
                setupActivityItemActions(item);
            });
        }

        // Close filter dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (filterDropdown && filterButton) {
                if (!filterDropdown.contains(e.target) && !filterButton.contains(e.target)) {
                    filterDropdown.style.display = 'none';
                }
            }
        });

        // Check URL parameters for actions
        checkUrlParams();
    }

    /**
     * Set up activity item action buttons
     * @param {HTMLElement} item - The activity item element
     */
    function setupActivityItemActions(item) {
        const viewBtn = item.querySelector('.action-btn.view');
        const historyBtn = item.querySelector('.action-btn.history');

        if (viewBtn) {
            viewBtn.addEventListener('click', function() {
                const title = item.querySelector('.activity-title').textContent;
                viewDocument(title);
            });
        }

        if (historyBtn) {
            historyBtn.addEventListener('click', function() {
                const title = item.querySelector('.activity-title').textContent;
                viewDocumentHistory(title);
            });
        }
    }

    /**
     * Synchronize documentation between Complete User Manual and Module-Specific User Manuals
     * @param {Event} e - The click event
     */
    function syncDocumentation(e) {
        e.preventDefault();

        // Show loading state
        const icon = syncDocumentationBtn.querySelector('i');
        icon.classList.remove('fa-sync-alt');
        icon.classList.add('fa-spinner', 'fa-spin');

        // In a real application, this would make an API call to sync documentation
        setTimeout(() => {
            // Reset icon and show success message
            icon.classList.remove('fa-spinner', 'fa-spin');
            icon.classList.add('fa-sync-alt');

            showNotification('Documentation synchronized successfully', 'success');
        }, 2000);
    }

    /**
     * Publish all pending documentation
     * @param {Event} e - The click event
     */
    function publishAllPending(e) {
        e.preventDefault();

        // Show confirmation dialog
        if (confirm('Are you sure you want to publish all pending documentation?')) {
            // Show loading state
            const icon = publishAllBtn.querySelector('i');
            icon.classList.remove('fa-upload');
            icon.classList.add('fa-spinner', 'fa-spin');

            // In a real application, this would make an API call to publish all pending documentation
            setTimeout(() => {
                // Reset icon and show success message
                icon.classList.remove('fa-spinner', 'fa-spin');
                icon.classList.add('fa-upload');

                showNotification('All pending documentation published successfully', 'success');
            }, 2000);
        }
    }

    /**
     * Show export options dialog
     * @param {Event} e - The click event
     */
    function showExportOptions(e) {
        e.preventDefault();

        // Create and show export options dialog
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';

        const dialog = document.createElement('div');
        dialog.className = 'modal-dialog';
        dialog.innerHTML = `
            <div class="modal-header">
                <h3><i class="fas fa-file-export"></i> Export Documentation</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="export-type">Documentation Type</label>
                    <select id="export-type" class="admin-select">
                        <option value="all">All Documentation</option>
                        <option value="complete">Complete User Manual</option>
                        <option value="module">Module-Specific User Manuals</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="export-module">Module (if applicable)</label>
                    <select id="export-module" class="admin-select">
                        <option value="">All Modules</option>
                        <option value="oms">Order Management System</option>
                        <option value="finance">Finance</option>
                        <option value="hr">Human Resources</option>
                        <option value="inventory">Inventory</option>
                        <option value="crm">CRM</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="export-format">Export Format</label>
                    <select id="export-format" class="admin-select">
                        <option value="pdf">PDF</option>
                        <option value="html">HTML</option>
                        <option value="docx">Microsoft Word</option>
                        <option value="md">Markdown</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="include-images">Include Images</label>
                    <div class="toggle-switch">
                        <input type="checkbox" id="include-images" checked>
                        <label for="include-images"></label>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="admin-button secondary" id="cancel-export">Cancel</button>
                <button class="admin-button" id="confirm-export">Export</button>
            </div>
        `;

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        // Set up dialog event listeners
        const closeBtn = dialog.querySelector('.close-modal');
        const cancelBtn = dialog.querySelector('#cancel-export');
        const confirmBtn = dialog.querySelector('#confirm-export');

        closeBtn.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });

        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });

        confirmBtn.addEventListener('click', () => {
            const exportType = dialog.querySelector('#export-type').value;
            const exportModule = dialog.querySelector('#export-module').value;
            const exportFormat = dialog.querySelector('#export-format').value;
            const includeImages = dialog.querySelector('#include-images').checked;

            document.body.removeChild(overlay);

            // In a real application, this would make an API call to export documentation
            showNotification(`Exporting ${exportType} documentation to ${exportFormat.toUpperCase()}...`, 'info');

            // Simulate export process
            setTimeout(() => {
                showNotification('Documentation exported successfully', 'success');
            }, 3000);
        });
    }

    /**
     * View document details
     * @param {string} title - The document title
     */
    function viewDocument(title) {
        // In a real application, this would redirect to the document view page
        window.location.href = `content-manager.html?action=edit&title=${encodeURIComponent(title)}`;
    }

    /**
     * View document version history
     * @param {string} title - The document title
     */
    function viewDocumentHistory(title) {
        // In a real application, this would redirect to the version history page
        window.location.href = `version-manager.html?content=${encodeURIComponent(title.toLowerCase().replace(/\s+/g, '-'))}`;
    }

    /**
     * Show notification message
     * @param {string} message - The notification message
     * @param {string} type - The notification type (success, error, info, warning)
     */
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `admin-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas ${type === 'success' ? 'fa-check-circle' :
                               type === 'error' ? 'fa-times-circle' :
                               type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
            </div>
            <div class="notification-content">
                <p>${message}</p>
            </div>
            <button class="notification-close">&times;</button>
        `;

        // Add to document
        document.body.appendChild(notification);

        // Set up close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(notification);
        });

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 5000);
    }

    /**
     * Create a new document
     */
    function createDocument() {
        // In a real application, this would open a form to create a new document
        // For demo purposes, we'll show a notification
        showNotification('Creating new document...', 'info');

        // Simulate redirect to document editor
        setTimeout(() => {
            window.location.href = 'content-manager.html?action=add&type=documentation';
        }, 1000);
    }

    /**
     * Switch between documentation sections
     * @param {string} section - Section to switch to
     */
    function switchSection(section) {
        // Update active section
        documentationSections.forEach(item => {
            if (item.dataset.section === section) {
                item.parentElement.classList.add('active');
            } else {
                item.parentElement.classList.remove('active');
            }
        });

        // Update section header
        const sectionHeader = document.querySelector('.documentation-content-header h3');
        if (sectionHeader) {
            const sectionIcon = section === 'all' ? 'fa-layer-group' :
                               section === 'complete' ? 'fa-book' :
                               section === 'module' ? 'fa-puzzle-piece' :
                               section === 'draft' ? 'fa-pencil-alt' :
                               section === 'review' ? 'fa-clipboard-check' :
                               section === 'published' ? 'fa-check-circle' : 'fa-archive';

            const sectionTitle = section === 'all' ? 'All Documents' :
                                section === 'complete' ? 'Complete User Manual' :
                                section === 'module' ? 'Module-Specific Manuals' :
                                section === 'draft' ? 'Drafts' :
                                section === 'review' ? 'Under Review' :
                                section === 'published' ? 'Published' : 'Archived';

            sectionHeader.innerHTML = `<i class="fas ${sectionIcon}"></i> ${sectionTitle}`;
        }

        // Filter documents based on section
        filterDocumentsBySection(section);

        showNotification(`Switched to ${section === 'all' ? 'all documents' : section} view`, 'info');
    }

    /**
     * Filter documents based on section
     * @param {string} section - Section to filter by
     */
    function filterDocumentsBySection(section) {
        if (documentationItems && documentationItems.length > 0) {
            documentationItems.forEach(item => {
                const docTypeEl = item.querySelector('.doc-type-badge');
                const docStatusEl = item.querySelector('.doc-status-badge');

                if (!docTypeEl || !docStatusEl) return;

                const docType = docTypeEl.classList.contains('complete') ? 'complete' : 'module';
                const docStatus = docStatusEl.classList.contains('published') ? 'published' :
                                 docStatusEl.classList.contains('review') ? 'review' :
                                 docStatusEl.classList.contains('draft') ? 'draft' : 'archived';

                if (section === 'all' ||
                    (section === 'complete' && docType === 'complete') ||
                    (section === 'module' && docType === 'module') ||
                    (section === docStatus)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        }
    }

    /**
     * Search documents
     */
    function searchDocuments() {
        if (!searchInput) return;

        const searchTerm = searchInput.value.toLowerCase();

        if (documentationItems && documentationItems.length > 0) {
            documentationItems.forEach(item => {
                const title = item.querySelector('.documentation-item-title');
                const meta = item.querySelector('.documentation-item-meta');

                if (!title || !meta) return;

                const titleText = title.textContent.toLowerCase();
                const metaText = meta.textContent.toLowerCase();

                if (titleText.includes(searchTerm) || metaText.includes(searchTerm)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        }
    }

    /**
     * Toggle filter dropdown
     */
    function toggleFilterDropdown() {
        if (!filterDropdown) return;

        if (filterDropdown.style.display === 'block') {
            filterDropdown.style.display = 'none';
        } else {
            filterDropdown.style.display = 'block';
        }
    }

    /**
     * Apply filters
     */
    function applyFilters() {
        if (!filterCheckboxes || filterCheckboxes.length === 0) return;

        // Get selected filters
        const selectedTypes = [];
        const selectedStatuses = [];

        filterCheckboxes.forEach(checkbox => {
            const filterGroup = checkbox.closest('.filter-group');
            if (!filterGroup) return;

            const filterTypeEl = filterGroup.querySelector('h4');
            if (!filterTypeEl) return;

            const filterType = filterTypeEl.textContent;

            if (checkbox.checked) {
                if (filterType === 'Document Type') {
                    selectedTypes.push(checkbox.parentElement.textContent.trim().toLowerCase());
                } else if (filterType === 'Status') {
                    selectedStatuses.push(checkbox.parentElement.textContent.trim().toLowerCase());
                }
            }
        });

        // Apply filters to documents
        if (documentationItems && documentationItems.length > 0) {
            documentationItems.forEach(item => {
                const docTypeEl = item.querySelector('.doc-type-badge');
                const docStatusEl = item.querySelector('.doc-status-badge');

                if (!docTypeEl || !docStatusEl) return;

                const docType = docTypeEl.textContent.toLowerCase();
                const docStatus = docStatusEl.textContent.toLowerCase();

                const typeMatch = selectedTypes.length === 0 || selectedTypes.some(type => docType.includes(type));
                const statusMatch = selectedStatuses.length === 0 || selectedStatuses.some(status => docStatus.includes(status));

                if (typeMatch && statusMatch) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        }

        // Hide filter dropdown
        if (filterDropdown) {
            filterDropdown.style.display = 'none';
        }

        showNotification('Filters applied', 'info');
    }

    /**
     * Reset filters
     */
    function resetFilters() {
        // Reset checkboxes
        if (filterCheckboxes && filterCheckboxes.length > 0) {
            filterCheckboxes.forEach(checkbox => {
                checkbox.checked = true;
            });
        }

        // Show all documents
        if (documentationItems && documentationItems.length > 0) {
            documentationItems.forEach(item => {
                item.style.display = 'flex';
            });
        }

        // Hide filter dropdown
        if (filterDropdown) {
            filterDropdown.style.display = 'none';
        }

        showNotification('Filters reset', 'info');
    }

    /**
     * Set up document item actions
     */
    function setupDocumentActions() {
        // Edit buttons
        const editButtons = document.querySelectorAll('.documentation-item .action-btn.edit');
        if (editButtons && editButtons.length > 0) {
            editButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const item = this.closest('.documentation-item');
                    if (!item) return;

                    const titleEl = item.querySelector('.documentation-item-title');
                    if (!titleEl) return;

                    const title = titleEl.textContent;

                    // In a real application, this would open the document for editing
                    showNotification(`Editing "${title}"`, 'info');

                    // Simulate redirect to document editor
                    setTimeout(() => {
                        window.location.href = `content-manager.html?action=edit&title=${encodeURIComponent(title)}`;
                    }, 1000);
                });
            });
        }

        // View buttons
        const viewButtons = document.querySelectorAll('.documentation-item .action-btn.view');
        if (viewButtons && viewButtons.length > 0) {
            viewButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const item = this.closest('.documentation-item');
                    if (!item) return;

                    const titleEl = item.querySelector('.documentation-item-title');
                    if (!titleEl) return;

                    const title = titleEl.textContent;

                    // In a real application, this would open the document for viewing
                    showNotification(`Viewing "${title}"`, 'info');

                    // Simulate redirect to document viewer
                    setTimeout(() => {
                        window.open('../Complete_User Manual/index.html', '_blank');
                    }, 1000);
                });
            });
        }

        // Preview buttons
        const previewButtons = document.querySelectorAll('.documentation-item .action-btn.preview');
        if (previewButtons && previewButtons.length > 0) {
            previewButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const item = this.closest('.documentation-item');
                    if (!item) return;

                    const titleEl = item.querySelector('.documentation-item-title');
                    const docTypeEl = item.querySelector('.doc-type-badge');

                    if (!titleEl || !docTypeEl) return;

                    const title = titleEl.textContent;
                    const docType = docTypeEl.classList.contains('complete') ? 'complete' : 'module';

                    // In a real application, this would open the preview page with the document
                    showNotification(`Opening preview for "${title}"`, 'info');

                    // Redirect to preview page
                    window.location.href = `preview.html?title=${encodeURIComponent(title)}&type=${docType}`;
                });
            });
        }

        // More action buttons
        const moreButtons = document.querySelectorAll('.documentation-item .action-btn.more');
        if (moreButtons && moreButtons.length > 0) {
            moreButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const item = this.closest('.documentation-item');
                    if (!item) return;

                    const titleEl = item.querySelector('.documentation-item-title');
                    if (!titleEl) return;

                    const title = titleEl.textContent;

                    // In a real application, this would show a dropdown with more actions
                    showNotification(`More actions for "${title}"`, 'info');
                });
            });
        }
    }

    /**
     * Check URL parameters for actions
     */
    function checkUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);

        if (urlParams.has('action')) {
            const action = urlParams.get('action');

            switch (action) {
                case 'sync':
                    syncDocumentation(new Event('click'));
                    break;
                case 'publish':
                    publishAllPending(new Event('click'));
                    break;
                case 'export':
                    showExportOptions(new Event('click'));
                    break;
            }
        }

        if (urlParams.has('section')) {
            const section = urlParams.get('section');
            switchSection(section);
        }
    }
});
