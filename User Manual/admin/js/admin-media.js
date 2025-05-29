/**
 * Admin Media Library Module
 * Handles media uploads, browsing, and management
 */
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const adminTabs = document.querySelectorAll('.admin-tab');
    const tabContents = document.querySelectorAll('.admin-tab-content');
    const fileUploadInput = document.getElementById('file-upload');
    const uploadArea = document.querySelector('.upload-area');
    const uploadQueue = document.querySelector('.upload-queue');
    const queueEmpty = document.querySelector('.queue-empty');
    const mediaItems = document.querySelectorAll('.media-item');
    const searchInput = document.querySelector('.admin-search-bar input');

    // Category Management Elements
    const addCategoryBtn = document.getElementById('add-category-btn');
    const categoryForm = document.getElementById('category-form');
    const cancelCategoryBtn = document.getElementById('cancel-category-btn');
    const addCategoryForm = document.getElementById('add-category-form');

    // Image Editor Elements
    const editorTools = document.querySelectorAll('.editor-tool');
    const imageSelectorItems = document.querySelectorAll('.image-selector-item');
    const editorOptionsPanel = document.querySelector('.image-editor-options');

    // Initialize media library
    initMediaLibrary();

    /**
     * Initialize media library components and event listeners
     */
    function initMediaLibrary() {
        // Set up tabs
        if (adminTabs.length > 0) {
            adminTabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    const tabId = this.dataset.tab;
                    switchTab(tabId);
                });
            });
        }

        // Set up file upload
        if (fileUploadInput) {
            fileUploadInput.addEventListener('change', handleFileSelect);
        }

        // Set up drag and drop
        if (uploadArea) {
            uploadArea.addEventListener('dragover', handleDragOver);
            uploadArea.addEventListener('dragleave', handleDragLeave);
            uploadArea.addEventListener('drop', handleFileDrop);
        }

        // Set up media item actions
        if (mediaItems.length > 0) {
            mediaItems.forEach(item => {
                setupMediaItemActions(item);
            });
        }

        // Set up search functionality
        if (searchInput) {
            searchInput.addEventListener('input', searchMedia);
        }

        // Set up category management
        if (addCategoryBtn) {
            addCategoryBtn.addEventListener('click', showCategoryForm);
        }

        if (cancelCategoryBtn) {
            cancelCategoryBtn.addEventListener('click', hideCategoryForm);
        }

        if (addCategoryForm) {
            addCategoryForm.addEventListener('submit', handleAddCategory);
        }

        // Set up image editor
        if (editorTools.length > 0) {
            editorTools.forEach(tool => {
                tool.addEventListener('click', handleEditorTool);
            });
        }

        if (imageSelectorItems.length > 0) {
            imageSelectorItems.forEach(item => {
                item.addEventListener('click', selectImage);
            });
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
     * Handle file selection from input
     * @param {Event} e - Change event
     */
    function handleFileSelect(e) {
        const files = e.target.files;
        if (files.length > 0) {
            processFiles(files);
        }
    }

    /**
     * Handle drag over event
     * @param {Event} e - Drag over event
     */
    function handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.add('drag-over');
    }

    /**
     * Handle drag leave event
     * @param {Event} e - Drag leave event
     */
    function handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.remove('drag-over');
    }

    /**
     * Handle file drop event
     * @param {Event} e - Drop event
     */
    function handleFileDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.remove('drag-over');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            processFiles(files);
        }
    }

    /**
     * Process files for upload
     * @param {FileList} files - List of files to process
     */
    function processFiles(files) {
        // Hide empty queue message
        if (queueEmpty) {
            queueEmpty.style.display = 'none';
        }

        // Create queue items for each file
        Array.from(files).forEach(file => {
            // Check file size
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                showNotification(`File ${file.name} exceeds the 10MB size limit.`, 'error');
                return;
            }

            // Check file type
            const fileType = file.type.split('/')[0];
            const fileExtension = file.name.split('.').pop().toLowerCase();
            const allowedTypes = ['image', 'video', 'application'];
            const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'mp4', 'webm'];

            if (!allowedTypes.includes(fileType) && !allowedExtensions.includes(fileExtension)) {
                showNotification(`File type ${fileExtension} is not supported.`, 'error');
                return;
            }

            // Create queue item
            const queueItem = document.createElement('div');
            queueItem.className = 'queue-item';

            // Set file icon based on type
            let fileIcon = 'file';
            if (fileType === 'image') fileIcon = 'image';
            else if (fileType === 'video') fileIcon = 'video';
            else if (fileExtension === 'pdf') fileIcon = 'file-pdf';

            // Format file size
            const fileSize = formatFileSize(file.size);

            queueItem.innerHTML = `
                <div class="queue-item-info">
                    <i class="fas fa-${fileIcon}"></i>
                    <div class="queue-item-details">
                        <div class="queue-item-name">${file.name}</div>
                        <div class="queue-item-size">${fileSize}</div>
                    </div>
                </div>
                <div class="queue-item-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 0%"></div>
                    </div>
                    <div class="progress-status">Pending</div>
                </div>
                <button class="queue-item-remove" title="Remove from queue">
                    <i class="fas fa-times"></i>
                </button>
            `;

            // Add to queue
            uploadQueue.appendChild(queueItem);

            // Add remove button event listener
            const removeButton = queueItem.querySelector('.queue-item-remove');
            removeButton.addEventListener('click', function() {
                queueItem.remove();

                // Show empty queue message if no items left
                if (uploadQueue.querySelectorAll('.queue-item').length === 0) {
                    queueEmpty.style.display = 'block';
                }
            });

            // Simulate upload progress
            simulateUpload(queueItem, file);
        });
    }

    /**
     * Simulate file upload with progress
     * @param {HTMLElement} queueItem - Queue item element
     * @param {File} file - File to upload
     */
    function simulateUpload(queueItem, file) {
        const progressFill = queueItem.querySelector('.progress-fill');
        const progressStatus = queueItem.querySelector('.progress-status');
        let progress = 0;

        // Update progress status
        progressStatus.textContent = 'Uploading...';

        // Simulate progress
        const interval = setInterval(() => {
            progress += Math.random() * 10;

            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);

                // Update progress status
                progressStatus.textContent = 'Complete';

                // Add success class
                queueItem.classList.add('upload-success');

                // Show notification
                showNotification(`${file.name} uploaded successfully.`, 'success');

                // Add to media library (in a real app, this would be done via API)
                setTimeout(() => {
                    // Remove from queue
                    queueItem.remove();

                    // Show empty queue message if no items left
                    if (uploadQueue.querySelectorAll('.queue-item').length === 0) {
                        queueEmpty.style.display = 'block';
                    }

                    // Switch to all media tab
                    switchTab('all-media');

                    // In a real app, the new media item would be added to the grid
                }, 1000);
            }

            // Update progress bar
            progressFill.style.width = `${progress}%`;
        }, 200);
    }

    /**
     * Format file size in human-readable format
     * @param {number} bytes - File size in bytes
     * @returns {string} Formatted file size
     */
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Set up media item actions
     * @param {HTMLElement} item - Media item element
     */
    function setupMediaItemActions(item) {
        const viewButton = item.querySelector('.media-action-btn.view');
        const editButton = item.querySelector('.media-action-btn.edit');
        const deleteButton = item.querySelector('.media-action-btn.delete');
        const mediaTitle = item.querySelector('.media-title').textContent;

        // View button
        if (viewButton) {
            viewButton.addEventListener('click', function() {
                // In a real app, this would open a preview of the media
                showNotification(`Viewing ${mediaTitle}`, 'info');
            });
        }

        // Edit button
        if (editButton) {
            editButton.addEventListener('click', function() {
                // In a real app, this would open the media for editing
                showNotification(`Editing ${mediaTitle}`, 'info');
            });
        }

        // Delete button
        if (deleteButton) {
            deleteButton.addEventListener('click', function() {
                // Confirm deletion
                if (confirm(`Are you sure you want to delete ${mediaTitle}?`)) {
                    // In a real app, this would delete the media
                    item.style.animation = 'fadeOut 0.5s ease forwards';
                    setTimeout(() => {
                        item.remove();
                    }, 500);

                    // Show notification
                    showNotification(`${mediaTitle} deleted successfully.`, 'success');
                }
            });
        }

        // Add hover effect
        item.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });

        item.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
    }

    /**
     * Search media items
     */
    function searchMedia() {
        const searchTerm = searchInput.value.toLowerCase();
        const mediaItems = document.querySelectorAll('.media-item');

        mediaItems.forEach(item => {
            const title = item.querySelector('.media-title').textContent.toLowerCase();
            const type = item.querySelector('.media-type').textContent.toLowerCase();

            if (title.includes(searchTerm) || type.includes(searchTerm)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    }

    /**
     * Check URL parameters for actions
     */
    function checkUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);

        if (urlParams.has('action')) {
            const action = urlParams.get('action');

            switch (action) {
                case 'upload':
                    // Switch to upload tab
                    switchTab('upload-media');
                    break;
                case 'categories':
                    // Switch to categories tab
                    switchTab('categories');
                    break;
                case 'edit':
                    // Switch to image editor tab
                    switchTab('image-editor');

                    // If image ID is provided, load that image
                    if (urlParams.has('id')) {
                        const imageId = urlParams.get('id');
                        console.log(`Loading image with ID: ${imageId}`);
                    }
                    break;
            }
        }
    }

    /**
     * Show category form
     */
    function showCategoryForm() {
        if (categoryForm) {
            categoryForm.classList.add('active');
            addCategoryBtn.style.display = 'none';
        }
    }

    /**
     * Hide category form
     */
    function hideCategoryForm() {
        if (categoryForm) {
            categoryForm.classList.remove('active');
            addCategoryBtn.style.display = '';

            // Reset form
            addCategoryForm.reset();
        }
    }

    /**
     * Handle add category form submission
     * @param {Event} e - Form submit event
     */
    function handleAddCategory(e) {
        e.preventDefault();

        // Get form values
        const categoryName = document.getElementById('category-name').value.trim();
        const categorySlug = document.getElementById('category-slug').value.trim();
        const categoryDescription = document.getElementById('category-description').value.trim();

        // Validate form
        if (!categoryName || !categorySlug) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        // In a real application, this would create a new category
        // For demo purposes, we'll add a new row to the table
        const categoriesTable = document.querySelector('.categories-table-container tbody');

        if (categoriesTable) {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${categoryName}</td>
                <td>${categorySlug}</td>
                <td>0</td>
                <td class="action-buttons">
                    <button class="action-btn edit" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete" title="Delete"><i class="fas fa-trash"></i></button>
                </td>
            `;

            // Add action button event listeners
            const editButton = newRow.querySelector('.action-btn.edit');
            const deleteButton = newRow.querySelector('.action-btn.delete');

            if (editButton) {
                editButton.addEventListener('click', function() {
                    showNotification(`Editing category "${categoryName}"`, 'info');
                });
            }

            if (deleteButton) {
                deleteButton.addEventListener('click', function() {
                    if (confirm(`Are you sure you want to delete category "${categoryName}"?`)) {
                        newRow.style.animation = 'fadeOut 0.5s ease forwards';
                        setTimeout(() => {
                            newRow.remove();
                        }, 500);

                        showNotification(`Deleted category "${categoryName}"`, 'success');
                    }
                });
            }

            // Add to table
            categoriesTable.appendChild(newRow);

            // Show notification
            showNotification(`Category "${categoryName}" created successfully`, 'success');

            // Hide form
            hideCategoryForm();
        }
    }

    /**
     * Handle editor tool click
     * @param {Event} e - Click event
     */
    function handleEditorTool(e) {
        const tool = e.currentTarget;
        const toolName = tool.getAttribute('title').toLowerCase();

        // Toggle active state
        editorTools.forEach(t => t.classList.remove('active'));
        tool.classList.add('active');

        // Show options panel based on tool
        const optionsPanel = document.querySelector('.image-editor-options');
        const cropPanel = document.getElementById('crop-panel');

        if (optionsPanel) {
            // Hide all panels
            const panels = optionsPanel.querySelectorAll('.editor-option-panel');
            panels.forEach(panel => panel.classList.remove('active'));

            // Show panel based on tool
            switch (toolName) {
                case 'crop':
                    optionsPanel.classList.add('active');
                    if (cropPanel) cropPanel.classList.add('active');
                    break;
                case 'resize':
                case 'adjust':
                case 'filters':
                case 'text':
                case 'draw':
                    optionsPanel.classList.add('active');
                    showNotification(`${toolName} tool selected. Options panel would be shown here.`, 'info');
                    break;
                default:
                    optionsPanel.classList.remove('active');

                    // Handle special tools
                    if (toolName === 'rotate left') {
                        rotateImage('left');
                    } else if (toolName === 'rotate right') {
                        rotateImage('right');
                    } else if (toolName === 'undo') {
                        showNotification('Undo operation', 'info');
                    } else if (toolName === 'redo') {
                        showNotification('Redo operation', 'info');
                    } else if (toolName === 'reset') {
                        showNotification('Image reset to original', 'info');
                    }
            }
        }
    }

    /**
     * Rotate image
     * @param {string} direction - Direction to rotate (left or right)
     */
    function rotateImage(direction) {
        const image = document.getElementById('editing-image');

        if (image) {
            // Get current rotation
            const currentRotation = parseInt(image.dataset.rotation || '0');

            // Calculate new rotation
            const rotationAmount = direction === 'left' ? -90 : 90;
            const newRotation = (currentRotation + rotationAmount) % 360;

            // Apply rotation
            image.style.transform = `rotate(${newRotation}deg)`;
            image.dataset.rotation = newRotation.toString();

            showNotification(`Image rotated ${direction}`, 'info');
        }
    }

    /**
     * Select image for editing
     * @param {Event} e - Click event
     */
    function selectImage(e) {
        const item = e.currentTarget;

        // Update active state
        imageSelectorItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        // Get image source
        const image = item.querySelector('img');
        const title = item.querySelector('.image-selector-title').textContent;

        if (image) {
            // Update editor image
            const editorImage = document.getElementById('editing-image');
            if (editorImage) {
                editorImage.src = image.src;
                editorImage.alt = title;
                editorImage.dataset.rotation = '0';
                editorImage.style.transform = '';
            }
        } else {
            // If no image (placeholder), show notification
            showNotification(`Image "${title}" would be loaded for editing`, 'info');
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
                    from { opacity: 1; transform: translateY(0); }
                    to { opacity: 0; transform: translateY(-20px); }
                }
            `;
            document.head.appendChild(style);
        }
    }
});
