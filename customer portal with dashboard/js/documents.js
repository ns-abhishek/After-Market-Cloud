
/**
 * Documents Management Module
 * Handles document upload, download, and management
 */

// Initialize documents module
document.addEventListener('DOMContentLoaded', function() {
    // Load documents from localStorage or use default
    loadDocuments();

    // Set up event listeners
    setupDocumentEventListeners();

    // Check for URL parameters (for search results navigation)
    checkUrlParameters();

    // Ensure theme is applied to all elements
    ensureThemeConsistency();

    // Initialize drag and drop functionality
    initializeDragAndDrop();
});

/**
 * Ensure theme consistency across all elements
 */
function ensureThemeConsistency() {
    // Get current theme
    const currentTheme = getUserPreference('dashboardTheme', 'default');
    const isDarkMode = currentTheme === 'dark';

    if (isDarkMode) {
        // Force dark mode on all elements
        document.querySelectorAll('.document-item, .documents-sidebar, .document-icon, .document-info').forEach(el => {
            el.classList.add('dark-mode-element');
        });

        // Add a style tag for additional dark mode fixes
        const styleTag = document.createElement('style');
        styleTag.textContent = `
            .dark-mode-element {
                background-color: var(--widget-bg) !important;
                color: var(--text-color) !important;
                border-color: var(--border-color) !important;
            }
            .dark-mode .document-info p {
                color: var(--text-color) !important;
            }
        `;
        document.head.appendChild(styleTag);
    }
}

// Set up document event listeners
function setupDocumentEventListeners() {
    // Upload button
    const uploadBtn = document.querySelector('.btn-primary');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', function() {
            document.querySelector('.upload-area').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Refresh button
    const refreshBtn = document.querySelector('.btn-secondary');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            loadDocuments();
        });
    }

    // View toggle buttons
    const gridViewBtn = document.getElementById('grid-view');
    const listViewBtn = document.getElementById('list-view');

    if (gridViewBtn && listViewBtn) {
        gridViewBtn.addEventListener('click', function() {
            document.querySelector('.documents-grid').style.display = 'grid';
            document.querySelector('.documents-list').style.display = 'none';
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');

            // Save preference
            saveUserPreference('documentView', 'grid');
        });

        listViewBtn.addEventListener('click', function() {
            document.querySelector('.documents-grid').style.display = 'none';
            document.querySelector('.documents-list').style.display = 'block';
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');

            // Save preference
            saveUserPreference('documentView', 'list');
        });
    }

    // Folder items
    const folderItems = document.querySelectorAll('.folder-item');
    folderItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all folders
            folderItems.forEach(folder => folder.classList.remove('active'));

            // Add active class to clicked folder
            this.classList.add('active');

            // Filter documents by folder
            const folderName = this.querySelector('span').textContent;
            filterDocumentsByFolder(folderName);
        });
    });

    // Upload area
    const uploadArea = document.querySelector('.upload-area');
    const browseBtn = uploadArea.querySelector('.btn-primary');

    if (uploadArea) {
        // Drag and drop
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = 'var(--primary-color)';
            this.style.backgroundColor = '#f9f9f9';
        });

        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.borderColor = 'var(--border-color)';
            this.style.backgroundColor = 'transparent';
        });

        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderColor = 'var(--border-color)';
            this.style.backgroundColor = 'transparent';

            const files = e.dataTransfer.files;
            handleFileUpload(files);
        });

        // Browse button
        if (browseBtn) {
            browseBtn.addEventListener('click', function() {
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.multiple = true;
                fileInput.style.display = 'none';

                fileInput.addEventListener('change', function() {
                    handleFileUpload(this.files);
                });

                document.body.appendChild(fileInput);
                fileInput.click();

                // Remove input after selection
                setTimeout(() => {
                    document.body.removeChild(fileInput);
                }, 1000);
            });
        }
    }

    // Search input
    const searchInput = document.querySelector('.documents-search input');
    const searchButton = document.querySelector('.documents-search button');

    if (searchInput && searchButton) {
        searchButton.addEventListener('click', function() {
            searchDocuments(searchInput.value);
        });

        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchDocuments(searchInput.value);
            }
        });
    }
}

// Check URL parameters
function checkUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const documentId = urlParams.get('document');

    if (documentId) {
        // Find document
        const document = getDocumentById(documentId);

        if (document) {
            // Show document details
            showDocumentDetailsModal(document);
        }
    }
}

// Get document by ID
function getDocumentById(id) {
    const documents = getDocuments();
    return documents.find(doc => doc.id === id);
}

// Get documents from localStorage
function getDocuments() {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) return [];

    // Get documents
    return JSON.parse(localStorage.getItem(`documents_${currentUser.id}`)) || getDefaultDocuments();
}

// Get default documents
function getDefaultDocuments() {
    const now = new Date().getTime();

    return [
        {
            id: 'doc1',
            name: 'Product Specifications.pdf',
            type: 'pdf',
            size: '2.4 MB',
            folder: 'Product Specifications',
            created: now - 259200000, // 3 days ago
            updated: now - 259200000, // 3 days ago
            shared: false
        },
        {
            id: 'doc2',
            name: 'User Guide.docx',
            type: 'docx',
            size: '1.8 MB',
            folder: 'User Guides',
            created: now - 604800000, // 1 week ago
            updated: now - 604800000, // 1 week ago
            shared: true
        },
        {
            id: 'doc3',
            name: 'Financial Report.xlsx',
            type: 'xlsx',
            size: '3.2 MB',
            folder: 'Reports',
            created: now - 1209600000, // 2 weeks ago
            updated: now - 1209600000, // 2 weeks ago
            shared: false
        },
        {
            id: 'doc4',
            name: 'Product Image.jpg',
            type: 'jpg',
            size: '4.5 MB',
            folder: 'Product Specifications',
            created: now - 2592000000, // 1 month ago
            updated: now - 2592000000, // 1 month ago
            shared: true
        }
    ];
}

// Save documents to localStorage
function saveDocuments(documents) {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) return;

    // Save documents
    localStorage.setItem(`documents_${currentUser.id}`, JSON.stringify(documents));
}

// Load documents
function loadDocuments() {
    const documents = getDocuments();
    renderDocuments(documents);

    // Load view preference
    const viewPreference = getUserPreference('documentView', 'grid');

    if (viewPreference === 'list') {
        document.getElementById('list-view').click();
    } else {
        document.getElementById('grid-view').click();
    }
}

// Render documents
function renderDocuments(documents) {
    const gridContainer = document.querySelector('.documents-grid');

    if (!gridContainer) return;

    // Clear container
    gridContainer.innerHTML = '';

    // If no documents
    if (documents.length === 0) {
        gridContainer.innerHTML = '<div class="no-documents">No documents found. Upload your first document by dragging and dropping files or clicking "Browse Files".</div>';
        return;
    }

    // Render each document
    documents.forEach(doc => {
        const docElement = document.createElement('div');
        docElement.className = 'document-card';
        docElement.setAttribute('data-id', doc.id);

        docElement.innerHTML = `
            <div class="document-icon">
                <i class="fas fa-file-${getDocumentIcon(doc.type)}"></i>
            </div>
            <div class="document-info">
                <h4>${doc.name}</h4>
                <div class="document-meta">
                    <span>${doc.type.toUpperCase()}</span>
                    <span>${doc.size}</span>
                </div>
            </div>
            <div class="document-actions">
                <button class="document-action download-btn"><i class="fas fa-download"></i></button>
                <button class="document-action share-btn"><i class="fas fa-share-alt"></i></button>
                <button class="document-action more-btn"><i class="fas fa-ellipsis-v"></i></button>
            </div>
        `;

        gridContainer.appendChild(docElement);

        // Add event listeners
        docElement.addEventListener('click', function(e) {
            if (!e.target.closest('.document-actions')) {
                showDocumentDetailsModal(doc);
            }
        });

        // Download button
        const downloadBtn = docElement.querySelector('.download-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                downloadDocument(doc);
            });
        }

        // Share button
        const shareBtn = docElement.querySelector('.share-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                showShareDocumentModal(doc);
            });
        }

        // More button
        const moreBtn = docElement.querySelector('.more-btn');
        if (moreBtn) {
            moreBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                showDocumentActionsMenu(doc, this);
            });
        }
    });

    // Create list view if it doesn't exist
    let listContainer = document.querySelector('.documents-list');

    if (!listContainer) {
        listContainer = document.createElement('div');
        listContainer.className = 'documents-list';
        gridContainer.parentNode.appendChild(listContainer);
    } else {
        // Clear list container
        listContainer.innerHTML = '';
    }

    // Render list view
    documents.forEach(doc => {
        const listItem = document.createElement('div');
        listItem.className = 'document-item';
        listItem.setAttribute('data-id', doc.id);

        listItem.innerHTML = `
            <div class="document-item-icon">
                <i class="fas fa-file-${getDocumentIcon(doc.type)}"></i>
            </div>
            <div class="document-item-info">
                <h4>${doc.name}</h4>
                <div class="document-item-meta">
                    <span>${doc.type.toUpperCase()}</span>
                    <span>${doc.size}</span>
                    <span>Last updated: ${formatTimeAgo(doc.updated)}</span>
                </div>
            </div>
            <div class="document-item-actions">
                <button class="document-action download-btn"><i class="fas fa-download"></i></button>
                <button class="document-action share-btn"><i class="fas fa-share-alt"></i></button>
                <button class="document-action more-btn"><i class="fas fa-ellipsis-v"></i></button>
            </div>
        `;

        listContainer.appendChild(listItem);

        // Add event listeners
        listItem.addEventListener('click', function(e) {
            if (!e.target.closest('.document-item-actions')) {
                showDocumentDetailsModal(doc);
            }
        });

        // Download button
        const downloadBtn = listItem.querySelector('.download-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                downloadDocument(doc);
            });
        }

        // Share button
        const shareBtn = listItem.querySelector('.share-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                showShareDocumentModal(doc);
            });
        }

        // More button
        const moreBtn = listItem.querySelector('.more-btn');
        if (moreBtn) {
            moreBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                showDocumentActionsMenu(doc, this);
            });
        }
    });
}

/**
 * Initialize drag and drop functionality
 */
function initializeDragAndDrop() {
    // Make document cards draggable
    const documentCards = document.querySelectorAll('.document-card');
    documentCards.forEach(card => {
        card.setAttribute('draggable', 'true');

        card.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', this.getAttribute('data-id'));
            this.classList.add('dragging');
        });

        card.addEventListener('dragend', function() {
            this.classList.remove('dragging');
        });
    });

    // Make folders droppable
    const folderItems = document.querySelectorAll('.folder-item');
    folderItems.forEach(folder => {
        folder.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('folder-dragover');
        });

        folder.addEventListener('dragleave', function() {
            this.classList.remove('folder-dragover');
        });

        folder.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('folder-dragover');

            const documentId = e.dataTransfer.getData('text/plain');
            const folderName = this.querySelector('span').textContent;

            moveDocumentToFolder(documentId, folderName);
        });
    });
}

/**
 * Handle file upload
 * @param {FileList} files - The files to upload
 */
function handleFileUpload(files) {
    if (!files || files.length === 0) return;

    // Get current documents
    const documents = getDocuments();

    // Process each file
    Array.from(files).forEach(file => {
        // Create a new document object
        const newDoc = {
            id: 'doc' + (documents.length + 1) + '_' + Date.now(),
            name: file.name,
            type: file.name.split('.').pop().toLowerCase(),
            size: formatFileSize(file.size),
            folder: 'All Documents',
            created: Date.now(),
            updated: Date.now(),
            shared: false
        };

        // Add to documents array
        documents.push(newDoc);
    });

    // Save and reload
    saveDocuments(documents);
    loadDocuments();

    // Show success notification
    showNotification('Files uploaded successfully', 'success');
}

/**
 * Format file size
 * @param {number} bytes - The file size in bytes
 * @returns {string} - The formatted file size
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Get document icon based on file type
 * @param {string} type - The file type
 * @returns {string} - The icon name
 */
function getDocumentIcon(type) {
    switch (type.toLowerCase()) {
        case 'pdf':
            return 'pdf';
        case 'doc':
        case 'docx':
            return 'word';
        case 'xls':
        case 'xlsx':
            return 'excel';
        case 'ppt':
        case 'pptx':
            return 'powerpoint';
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
            return 'image';
        case 'zip':
        case 'rar':
            return 'archive';
        default:
            return 'alt';
    }
}

/**
 * Format time ago
 * @param {number} timestamp - The timestamp
 * @returns {string} - The formatted time
 */
function formatTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;

    // Convert to seconds
    const seconds = Math.floor(diff / 1000);

    if (seconds < 60) {
        return 'Just now';
    }

    // Convert to minutes
    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
        return minutes + ' minute' + (minutes > 1 ? 's' : '') + ' ago';
    }

    // Convert to hours
    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
        return hours + ' hour' + (hours > 1 ? 's' : '') + ' ago';
    }

    // Convert to days
    const days = Math.floor(hours / 24);

    if (days < 30) {
        return days + ' day' + (days > 1 ? 's' : '') + ' ago';
    }

    // Convert to months
    const months = Math.floor(days / 30);

    if (months < 12) {
        return months + ' month' + (months > 1 ? 's' : '') + ' ago';
    }

    // Convert to years
    const years = Math.floor(months / 12);

    return years + ' year' + (years > 1 ? 's' : '') + ' ago';
}

/**
 * Show document details modal
 * @param {Object} document - The document object
 */
function showDocumentDetailsModal(document) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';

    modal.innerHTML = `
        <div class="modal-container">
            <div class="modal-header">
                <h3>Document Details</h3>
                <button class="modal-close"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-content">
                <div class="document-details">
                    <div class="document-preview">
                        <div class="document-icon large">
                            <i class="fas fa-file-${getDocumentIcon(document.type)}"></i>
                        </div>
                    </div>
                    <div class="document-info">
                        <h2>${document.name}</h2>
                        <div class="document-meta">
                            <p><strong>Type:</strong> ${document.type.toUpperCase()}</p>
                            <p><strong>Size:</strong> ${document.size}</p>
                            <p><strong>Folder:</strong> ${document.folder}</p>
                            <p><strong>Created:</strong> ${formatTimeAgo(document.created)}</p>
                            <p><strong>Last Updated:</strong> ${formatTimeAgo(document.updated)}</p>
                            <p><strong>Shared:</strong> ${document.shared ? 'Yes' : 'No'}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary modal-close">Close</button>
                <button class="btn-primary download-btn">Download</button>
            </div>
        </div>
    `;

    // Add to body
    document.body.appendChild(modal);

    // Add event listeners
    modal.querySelector('.modal-close').addEventListener('click', function() {
        document.body.removeChild(modal);
    });

    modal.querySelector('.download-btn').addEventListener('click', function() {
        downloadDocument(document);
    });
}

/**
 * Download document
 * @param {Object} document - The document object
 */
function downloadDocument(document) {
    // In a real application, this would download the actual file
    // For this demo, we'll just show a notification
    showNotification(`Downloading ${document.name}...`, 'info');

    // Simulate download completion
    setTimeout(() => {
        showNotification(`${document.name} downloaded successfully`, 'success');
    }, 2000);
}

/**
 * Show share document modal
 * @param {Object} document - The document object
 */
function showShareDocumentModal(document) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';

    modal.innerHTML = `
        <div class="modal-container">
            <div class="modal-header">
                <h3>Share Document</h3>
                <button class="modal-close"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-content">
                <div class="share-options">
                    <div class="form-group">
                        <label>Email Addresses</label>
                        <input type="text" placeholder="Enter email addresses separated by commas">
                    </div>
                    <div class="form-group">
                        <label>Message</label>
                        <textarea placeholder="Add a message (optional)"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Permission</label>
                        <select>
                            <option value="view">View only</option>
                            <option value="edit">Edit</option>
                            <option value="download">Download</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary modal-close">Cancel</button>
                <button class="btn-primary share-btn">Share</button>
            </div>
        </div>
    `;

    // Add to body
    document.body.appendChild(modal);

    // Add event listeners
    modal.querySelector('.modal-close').addEventListener('click', function() {
        document.body.removeChild(modal);
    });

    modal.querySelector('.share-btn').addEventListener('click', function() {
        // In a real application, this would share the document
        // For this demo, we'll just show a notification
        showNotification(`${document.name} shared successfully`, 'success');

        // Update document
        document.shared = true;

        // Save and reload
        const documents = getDocuments();
        const index = documents.findIndex(doc => doc.id === document.id);

        if (index !== -1) {
            documents[index] = document;
            saveDocuments(documents);
            loadDocuments();
        }

        // Close modal
        document.body.removeChild(modal);
    });
}

/**
 * Show document actions menu
 * @param {Object} document - The document object
 * @param {HTMLElement} button - The button element
 */
function showDocumentActionsMenu(document, button) {
    // Create menu
    const menu = document.createElement('div');
    menu.className = 'dropdown-menu document-actions-menu';

    menu.innerHTML = `
        <ul>
            <li><a href="#" class="rename-btn"><i class="fas fa-edit"></i> Rename</a></li>
            <li><a href="#" class="move-btn"><i class="fas fa-folder-open"></i> Move</a></li>
            <li><a href="#" class="delete-btn"><i class="fas fa-trash"></i> Delete</a></li>
        </ul>
    `;

    // Position menu
    const rect = button.getBoundingClientRect();
    menu.style.position = 'absolute';
    menu.style.top = rect.bottom + 'px';
    menu.style.left = rect.left + 'px';

    // Add to body
    document.body.appendChild(menu);

    // Add event listeners
    menu.querySelector('.rename-btn').addEventListener('click', function(e) {
        e.preventDefault();
        document.body.removeChild(menu);
        showRenameDocumentModal(document);
    });

    menu.querySelector('.move-btn').addEventListener('click', function(e) {
        e.preventDefault();
        document.body.removeChild(menu);
        showMoveDocumentModal(document);
    });

    menu.querySelector('.delete-btn').addEventListener('click', function(e) {
        e.preventDefault();
        document.body.removeChild(menu);
        showDeleteDocumentConfirmation(document);
    });

    // Close menu when clicking outside
    document.addEventListener('click', function closeMenu(e) {
        if (!menu.contains(e.target) && e.target !== button) {
            document.body.removeChild(menu);
            document.removeEventListener('click', closeMenu);
        }
    });
}

/**
 * Show rename document modal
 * @param {Object} document - The document object
 */
function showRenameDocumentModal(document) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';

    modal.innerHTML = `
        <div class="modal-container">
            <div class="modal-header">
                <h3>Rename Document</h3>
                <button class="modal-close"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-content">
                <div class="form-group">
                    <label>Document Name</label>
                    <input type="text" value="${document.name}">
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary modal-close">Cancel</button>
                <button class="btn-primary rename-btn">Rename</button>
            </div>
        </div>
    `;

    // Add to body
    document.body.appendChild(modal);

    // Add event listeners
    modal.querySelector('.modal-close').addEventListener('click', function() {
        document.body.removeChild(modal);
    });

    modal.querySelector('.rename-btn').addEventListener('click', function() {
        const newName = modal.querySelector('input').value;

        if (newName.trim() === '') {
            showNotification('Document name cannot be empty', 'error');
            return;
        }

        // Update document
        document.name = newName;
        document.updated = Date.now();

        // Save and reload
        const documents = getDocuments();
        const index = documents.findIndex(doc => doc.id === document.id);

        if (index !== -1) {
            documents[index] = document;
            saveDocuments(documents);
            loadDocuments();
        }

        // Show notification
        showNotification('Document renamed successfully', 'success');

        // Close modal
        document.body.removeChild(modal);
    });
}

/**
 * Show move document modal
 * @param {Object} document - The document object
 */
function showMoveDocumentModal(document) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';

    // Get folders
    const folders = ['All Documents', 'Product Specifications', 'User Guides', 'Contracts', 'Invoices', 'Reports'];

    modal.innerHTML = `
        <div class="modal-container">
            <div class="modal-header">
                <h3>Move Document</h3>
                <button class="modal-close"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-content">
                <div class="form-group">
                    <label>Select Folder</label>
                    <select>
                        ${folders.map(folder => `<option value="${folder}" ${folder === document.folder ? 'selected' : ''}>${folder}</option>`).join('')}
                    </select>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary modal-close">Cancel</button>
                <button class="btn-primary move-btn">Move</button>
            </div>
        </div>
    `;

    // Add to body
    document.body.appendChild(modal);

    // Add event listeners
    modal.querySelector('.modal-close').addEventListener('click', function() {
        document.body.removeChild(modal);
    });

    modal.querySelector('.move-btn').addEventListener('click', function() {
        const newFolder = modal.querySelector('select').value;

        // Move document
        moveDocumentToFolder(document.id, newFolder);

        // Close modal
        document.body.removeChild(modal);
    });
}

/**
 * Move document to folder
 * @param {string} documentId - The document ID
 * @param {string} folderName - The folder name
 */
function moveDocumentToFolder(documentId, folderName) {
    // Get documents
    const documents = getDocuments();
    const index = documents.findIndex(doc => doc.id === documentId);

    if (index === -1) return;

    // Update document
    documents[index].folder = folderName;
    documents[index].updated = Date.now();

    // Save and reload
    saveDocuments(documents);
    loadDocuments();

    // Show notification
    showNotification(`Document moved to ${folderName}`, 'success');
}

/**
 * Show delete document confirmation
 * @param {Object} document - The document object
 */
function showDeleteDocumentConfirmation(document) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';

    modal.innerHTML = `
        <div class="modal-container">
            <div class="modal-header">
                <h3>Delete Document</h3>
                <button class="modal-close"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-content">
                <p>Are you sure you want to delete "${document.name}"?</p>
                <p>This action cannot be undone.</p>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary modal-close">Cancel</button>
                <button class="btn-danger delete-btn">Delete</button>
            </div>
        </div>
    `;

    // Add to body
    document.body.appendChild(modal);

    // Add event listeners
    modal.querySelector('.modal-close').addEventListener('click', function() {
        document.body.removeChild(modal);
    });

    modal.querySelector('.delete-btn').addEventListener('click', function() {
        // Delete document
        const documents = getDocuments();
        const index = documents.findIndex(doc => doc.id === document.id);

        if (index !== -1) {
            documents.splice(index, 1);
            saveDocuments(documents);
            loadDocuments();
        }

        // Show notification
        showNotification('Document deleted successfully', 'success');

        // Close modal
        document.body.removeChild(modal);
    });
}

/**
 * Filter documents by folder
 * @param {string} folderName - The folder name
 */
function filterDocumentsByFolder(folderName) {
    const documents = getDocuments();

    if (folderName === 'All Documents') {
        renderDocuments(documents);
    } else {
        const filtered = documents.filter(doc => doc.folder === folderName);
        renderDocuments(filtered);
    }
}

/**
 * Search documents
 * @param {string} query - The search query
 */
function searchDocuments(query) {
    if (!query) {
        loadDocuments();
        return;
    }

    const documents = getDocuments();
    const filtered = documents.filter(doc =>
        doc.name.toLowerCase().includes(query.toLowerCase()) ||
        doc.type.toLowerCase().includes(query.toLowerCase()) ||
        doc.folder.toLowerCase().includes(query.toLowerCase())
    );

    renderDocuments(filtered);
}

/**
 * Show notification
 * @param {string} message - The notification message
 * @param {string} type - The notification type (success, error, info)
 */
function showNotification(message, type = 'info') {
    // Create notification container if it doesn't exist
    let container = document.querySelector('.notification-container');

    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    // Set icon based on type
    let icon = 'info-circle';

    if (type === 'success') {
        icon = 'check-circle';
    } else if (type === 'error') {
        icon = 'exclamation-circle';
    }

    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-${icon}"></i>
        </div>
        <div class="notification-content">
            <p>${message}</p>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Add to container
    container.appendChild(notification);

    // Add event listener to close button
    notification.querySelector('.notification-close').addEventListener('click', function() {
        container.removeChild(notification);
    });

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (container.contains(notification)) {
            container.removeChild(notification);
        }
    }, 5000);
}
