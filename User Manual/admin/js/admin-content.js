/**
 * Admin Content Management Module
 * Handles content creation, editing, and management functionality
 */
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const adminTabs = document.querySelectorAll('.admin-tab');
    const tabContents = document.querySelectorAll('.admin-tab-content');
    const contentEditor = document.getElementById('content-editor');
    const selectAllCheckbox = document.getElementById('select-all');
    const contentCheckboxes = document.querySelectorAll('.content-select');
    const searchInput = document.querySelector('.admin-search-bar input');
    const actionButtons = document.querySelectorAll('.action-btn');
    const viewVersionsButton = document.getElementById('view-versions');

    // Initialize content manager
    initContentManager();

    /**
     * Initialize content manager components and event listeners
     */
    function initContentManager() {
        // Set up tabs
        if (adminTabs.length > 0) {
            adminTabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    const tabId = this.dataset.tab;
                    switchTab(tabId);
                });
            });
        }

        // Initialize TinyMCE if content editor exists
        if (contentEditor) {
            initTinyMCE();
        }

        // Set up select all checkbox
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', toggleSelectAll);
        }

        // Set up search functionality
        if (searchInput) {
            searchInput.addEventListener('input', searchContent);
        }

        // Set up action buttons
        if (actionButtons.length > 0) {
            actionButtons.forEach(button => {
                button.addEventListener('click', handleActionButton);
            });
        }

        // Set up view versions button
        if (viewVersionsButton) {
            viewVersionsButton.addEventListener('click', handleViewVersions);
        }

        // Check URL parameters for actions
        checkUrlParams();
    }

    /**
     * Switch between tabs
     * @param {string} tabId - ID of the tab to switch to
     */
    function switchTab(tabId) {
        // Update active tab
        adminTabs.forEach(tab => {
            if (tab.dataset.tab === tabId) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        // Update active content
        tabContents.forEach(content => {
            if (content.id === tabId) {
                content.classList.add('active');

                // Animate content in
                content.style.animation = 'fadeIn 0.3s ease';
            } else {
                content.classList.remove('active');
            }
        });
    }

    /**
     * Initialize custom WYSIWYG editor
     */
    function initTinyMCE() {
        // Get editor elements
        const editorContent = document.getElementById('content-editor');
        const editorTools = document.querySelectorAll('.editor-tool');
        const hiddenTextarea = document.getElementById('content-editor-hidden');

        if (!editorContent || !editorTools.length) return;

        // Set initial content
        editorContent.innerHTML = '<p>Enter your content here...</p>';

        // Update hidden textarea with editor content
        function updateHiddenTextarea() {
            if (hiddenTextarea) {
                hiddenTextarea.value = editorContent.innerHTML;
            }
        }

        // Execute command on editor
        function execCommand(command, value = null) {
            document.execCommand(command, false, value);
            editorContent.focus();
            updateHiddenTextarea();
        }

        // Set up editor tools
        editorTools.forEach(tool => {
            tool.addEventListener('click', function() {
                const command = this.dataset.command;

                // Handle special commands
                if (command === 'createLink') {
                    const url = prompt('Enter the URL:', 'https://');
                    if (url) execCommand('createLink', url);
                } else if (command === 'insertImage') {
                    const url = prompt('Enter the image URL:', 'https://');
                    if (url) execCommand('insertImage', url);
                } else if (command === 'insertTable') {
                    const html = '<table><tr><td>Cell 1</td><td>Cell 2</td></tr><tr><td>Cell 3</td><td>Cell 4</td></tr></table>';
                    execCommand('insertHTML', html);
                } else if (command === 'code') {
                    // Toggle HTML view
                    const container = editorContent.closest('.custom-editor-container');
                    if (container) {
                        if (container.classList.contains('editor-html-mode')) {
                            // Switch back to normal mode
                            container.classList.remove('editor-html-mode');
                            editorContent.innerHTML = editorContent.textContent;
                        } else {
                            // Switch to HTML mode
                            container.classList.add('editor-html-mode');
                            editorContent.textContent = editorContent.innerHTML;
                        }
                        this.classList.toggle('active');
                        updateHiddenTextarea();
                    }
                } else {
                    // Execute standard command
                    execCommand(command);

                    // Toggle active state for formatting buttons
                    if (['bold', 'italic', 'underline', 'strikeThrough'].includes(command)) {
                        this.classList.toggle('active');
                    }
                }
            });
        });

        // Update hidden textarea when content changes
        editorContent.addEventListener('input', updateHiddenTextarea);

        // Initialize hidden textarea
        updateHiddenTextarea();

        // Listen for theme changes
        document.addEventListener('themeChanged', function(e) {
            // No specific action needed as CSS handles theme changes
        });
    }

    /**
     * Toggle select all checkboxes
     */
    function toggleSelectAll() {
        const isChecked = selectAllCheckbox.checked;

        contentCheckboxes.forEach(checkbox => {
            checkbox.checked = isChecked;

            // Update row styling
            const row = checkbox.closest('tr');
            if (row) {
                if (isChecked) {
                    row.classList.add('selected');
                } else {
                    row.classList.remove('selected');
                }
            }
        });
    }

    /**
     * Search content in the table
     */
    function searchContent() {
        const searchTerm = searchInput.value.toLowerCase();
        const contentRows = document.querySelectorAll('.admin-content-table tbody tr');

        contentRows.forEach(row => {
            const title = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
            const section = row.querySelector('td:nth-child(3)').textContent.toLowerCase();

            if (title.includes(searchTerm) || section.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    /**
     * Handle action button clicks (edit, preview, delete)
     * @param {Event} e - Click event
     */
    function handleActionButton(e) {
        const button = e.currentTarget;
        const action = button.classList.contains('edit') ? 'edit' :
                      button.classList.contains('preview') ? 'preview' :
                      button.classList.contains('delete') ? 'delete' : '';

        const row = button.closest('tr');
        const title = row.querySelector('td:nth-child(2)').textContent;

        switch (action) {
            case 'edit':
                // In a real application, this would load the content for editing
                // For demo purposes, we'll switch to the edit tab
                switchTab('add-content');

                // Set form values
                const titleInput = document.getElementById('content-title');
                if (titleInput) {
                    titleInput.value = title;
                }

                // Show notification
                showNotification(`Editing "${title}"`, 'info');
                break;

            case 'preview':
                // In a real application, this would open a preview of the content
                // For demo purposes, we'll show a notification
                showNotification(`Previewing "${title}"`, 'info');
                break;

            case 'delete':
                // Confirm deletion
                if (confirm(`Are you sure you want to delete "${title}"?`)) {
                    // In a real application, this would delete the content
                    // For demo purposes, we'll remove the row with animation
                    row.style.animation = 'fadeOut 0.5s ease forwards';
                    setTimeout(() => {
                        row.remove();
                    }, 500);

                    // Show notification
                    showNotification(`Deleted "${title}"`, 'success');
                }
                break;
        }
    }

    /**
     * Handle view versions button click
     */
    function handleViewVersions() {
        // Get content title
        const titleInput = document.getElementById('content-title');
        const title = titleInput ? titleInput.value : '';

        if (!title) {
            showNotification('Please enter a title for the content first', 'warning');
            return;
        }

        // Get tenant and locale
        const tenantSelect = document.getElementById('content-tenant');
        const localeSelect = document.getElementById('content-locale');
        const tenant = tenantSelect ? tenantSelect.value : 'global';
        const locale = localeSelect ? localeSelect.value : 'en-US';

        // In a real application, this would redirect to the version manager with the content ID
        // For demo purposes, we'll redirect to the version manager with the content title
        window.location.href = `version-manager.html?content=${encodeURIComponent(title.toLowerCase().replace(/\s+/g, '-'))}&tenant=${tenant}&locale=${locale}`;
    }

    /**
     * Check URL parameters for actions
     */
    function checkUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);

        if (urlParams.has('action')) {
            const action = urlParams.get('action');

            switch (action) {
                case 'new':
                    // Switch to add content tab
                    switchTab('add-content');
                    break;

                case 'edit':
                    // Switch to add content tab and load content
                    switchTab('add-content');

                    // In a real application, this would load the content for editing
                    // based on the ID parameter
                    if (urlParams.has('id')) {
                        const id = urlParams.get('id');
                        console.log(`Loading content with ID: ${id}`);
                    }
                    break;

                case 'version':
                    // Switch to add content tab and load content for versioning
                    switchTab('add-content');

                    if (urlParams.has('id')) {
                        const id = urlParams.get('id');
                        const version = urlParams.get('version');

                        // In a real application, this would load the specific version of the content
                        showNotification(`Loading version ${version} of content ID ${id}`, 'info');

                        // Set version notes field
                        const versionNotesField = document.getElementById('content-version-notes');
                        if (versionNotesField) {
                            versionNotesField.value = `Based on version ${version}`;
                        }
                    }
                    break;
            }
        }
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

                @keyframes fadeOut {
                    from { opacity: 1; transform: translateX(0); }
                    to { opacity: 0; transform: translateX(-20px); }
                }
            `;
            document.head.appendChild(style);
        }
    }
});
