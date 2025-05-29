// Data structure to store our knowledge base
let knowledgeBase = {
    folders: [],
    files: [],
    nextId: 1
};

// DOM elements
let treeRoot;
let contentView;
let fileUploadContainer;
let fileUploadForm;
let folderForm;
let folderFormTitle;
let folderFormModal;
let addRootFolderBtn;
let modal;
let modalTitle;
let modalMessage;
let modalConfirm;
let modalCancel;
let searchInput;
let clearSearch;
let breadcrumbList;
let contextMenu;
let expandAllBtn;
let collapseAllBtn;
let toggleThemeBtn;
let helpButton;
let helpModal;

// Function to initialize DOM elements
function initDOMElements() {
    treeRoot = document.getElementById('tree-root');
    contentView = document.getElementById('content-view');
    fileUploadContainer = document.getElementById('file-upload-container');
    fileUploadForm = document.getElementById('file-upload-form');
    folderFormModal = document.getElementById('folder-form-modal');
    folderForm = document.getElementById('folder-form');
    folderFormTitle = document.getElementById('folder-form-title');
    addRootFolderBtn = document.getElementById('add-root-folder');
    modal = document.getElementById('modal');
    modalTitle = document.getElementById('modal-title');
    modalMessage = document.getElementById('modal-message');
    modalConfirm = document.getElementById('modal-confirm');
    modalCancel = document.getElementById('modal-cancel');
    searchInput = document.getElementById('search-input');
    clearSearch = document.getElementById('clear-search');
    breadcrumbList = document.getElementById('breadcrumb-list');
    contextMenu = document.getElementById('context-menu');
    expandAllBtn = document.getElementById('expand-all');
    collapseAllBtn = document.getElementById('collapse-all');
    toggleThemeBtn = document.getElementById('toggle-theme');
    helpButton = document.getElementById('help-button');
    helpModal = document.getElementById('help-modal');
}

// Current state
let selectedItemId = null;
let currentParentId = null;
let editingItemId = null;
let actionAfterConfirm = null;
let isDarkTheme = false;
let breadcrumbPath = [];
let draggedItem = null;

// Initialize the application
function init() {
    // Initialize DOM elements
    initDOMElements();

    // Load data from localStorage if available
    loadFromLocalStorage();

    // Load theme preference
    loadThemePreference();

    // Render the tree
    renderTree();

    // Make sure modals are hidden
    hideModal();
    hideContextMenu();

    // Initialize breadcrumb
    updateBreadcrumb();

    // Add event listeners
    addEventListeners();

    // Add keyboard shortcuts
    setupKeyboardShortcuts();

    // Setup drag and drop
    setupDragAndDrop();

    // Show welcome notification
    showNotification('Welcome to Knowledge Base', 'info');
}

// Show notification
function showNotification(message, type = 'success') {
    const notificationContainer = document.getElementById('notification-container');

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    // Add icon based on type
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';

    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;

    // Add to container
    notificationContainer.appendChild(notification);

    // Remove after animation completes
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Load data from localStorage
function loadFromLocalStorage() {
    const savedData = localStorage.getItem('knowledgeBase');
    if (savedData) {
        knowledgeBase = JSON.parse(savedData);
    }
}

// Save data to localStorage
function saveToLocalStorage() {
    localStorage.setItem('knowledgeBase', JSON.stringify(knowledgeBase));
}

// Load theme preference
function loadThemePreference() {
    const savedTheme = localStorage.getItem('darkTheme');
    if (savedTheme === 'true') {
        enableDarkTheme();
    }
}

// Toggle between light and dark theme
function toggleTheme() {
    if (isDarkTheme) {
        disableDarkTheme();
    } else {
        enableDarkTheme();
    }
    localStorage.setItem('darkTheme', isDarkTheme);
}

// Enable dark theme
function enableDarkTheme() {
    document.body.classList.remove('light-theme');
    toggleThemeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    toggleThemeBtn.title = 'Switch to Light Mode';
    isDarkTheme = true;
    showNotification('Dark theme enabled', 'info');
}

// Disable dark theme
function disableDarkTheme() {
    document.body.classList.add('light-theme');
    toggleThemeBtn.innerHTML = '<i class="fas fa-moon"></i>';
    toggleThemeBtn.title = 'Switch to Dark Mode';
    isDarkTheme = false;
    showNotification('Light theme enabled', 'info');
}

// Hide context menu
function hideContextMenu() {
    contextMenu.classList.add('hidden');
}

// Show context menu
function showContextMenu(e, id, type) {
    e.preventDefault();

    // Position the context menu
    contextMenu.style.top = `${e.pageY}px`;
    contextMenu.style.left = `${e.pageX}px`;

    // Show/hide menu items based on type
    document.getElementById('ctx-open').style.display = type === 'folder' ? 'flex' : 'none';

    // Set data attributes for the selected item
    contextMenu.dataset.id = id;
    contextMenu.dataset.type = type;

    // Show the context menu
    contextMenu.classList.remove('hidden');
}

// Update breadcrumb navigation
function updateBreadcrumb() {
    if (!breadcrumbList) return;

    // Clear existing breadcrumb items except Home
    while (breadcrumbList.children.length > 1) {
        breadcrumbList.removeChild(breadcrumbList.lastChild);
    }

    // Add breadcrumb items for the current path
    breadcrumbPath.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#" data-id="${item.id}">${item.name}</a>`;
        li.querySelector('a').addEventListener('click', (e) => {
            e.preventDefault();
            selectItem(item.id, 'folder');
        });
        breadcrumbList.appendChild(li);
    });
}

// Setup keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Don't trigger shortcuts when typing in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        switch (e.key) {
            case 'f':
                // Focus search box
                e.preventDefault();
                searchInput.focus();
                break;
            case 'Escape':
                // Close modals and forms
                hideModal();
                hideFolderForm();
                hideFileUploadForm();
                hideContextMenu();
                break;
            case 'Delete':
                // Delete selected item
                if (selectedItemId) {
                    const type = knowledgeBase.folders.find(f => f.id === selectedItemId) ? 'folder' : 'file';
                    showDeleteConfirmation(selectedItemId, type);
                }
                break;
            case 'n':
                // New folder
                if (selectedItemId) {
                    const folder = knowledgeBase.folders.find(f => f.id === selectedItemId);
                    if (folder) {
                        showFolderForm(folder.id);
                    } else {
                        showFolderForm(null);
                    }
                } else {
                    showFolderForm(null);
                }
                break;
            case 'u':
                // Upload file
                if (selectedItemId) {
                    const folder = knowledgeBase.folders.find(f => f.id === selectedItemId);
                    if (folder) {
                        showFileUploadForm(folder.id);
                    }
                }
                break;
        }
    });
}

// Setup drag and drop functionality
function setupDragAndDrop() {
    // Will be implemented in the createFolderElement and createFileElement functions
}

// Add all event listeners
function addEventListeners() {
    // Add root folder button
    addRootFolderBtn.addEventListener('click', () => {
        showFolderForm(null);
    });

    // Folder form submission
    folderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const folderName = document.getElementById('folder-name').value;
        const folderColor = document.getElementById('folder-color').value;

        if (editingItemId) {
            // Edit existing folder
            updateFolder(editingItemId, folderName, folderColor);
        } else {
            // Create new folder
            createFolder(folderName, currentParentId, folderColor);
        }

        hideFolderForm();
    });

    // Cancel folder form
    document.getElementById('cancel-folder').addEventListener('click', hideFolderForm);
    document.getElementById('close-folder-form').addEventListener('click', hideFolderForm);

    // File upload form submission
    fileUploadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const fileName = document.getElementById('file-name').value;
        const fileInput = document.getElementById('file-upload');

        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const reader = new FileReader();

            reader.onload = function(event) {
                const fileContent = event.target.result;
                if (editingItemId) {
                    // Update existing file
                    updateFile(editingItemId, fileName, file.type, fileContent);
                } else {
                    // Create new file
                    createFile(fileName, file.type, fileContent, currentParentId);
                }
                hideFileUploadForm();
            };

            reader.readAsDataURL(file);
        } else {
            alert('Please select a file to upload');
        }
    });

    // Cancel file upload
    document.getElementById('cancel-upload').addEventListener('click', hideFileUploadForm);
    document.getElementById('close-file-form').addEventListener('click', hideFileUploadForm);

    // Modal buttons
    modalCancel.addEventListener('click', hideModal);
    modalConfirm.addEventListener('click', () => {
        if (actionAfterConfirm) {
            actionAfterConfirm();
        }
        hideModal();
    });
    document.getElementById('modal-close').addEventListener('click', hideModal);

    // Search functionality
    searchInput.addEventListener('input', handleSearch);
    clearSearch.addEventListener('click', clearSearchInput);

    // Theme toggle
    toggleThemeBtn.addEventListener('click', toggleTheme);

    // Help button
    helpButton.addEventListener('click', showHelpModal);
    document.getElementById('help-modal-close').addEventListener('click', hideHelpModal);

    // Expand/collapse all
    expandAllBtn.addEventListener('click', expandAllFolders);
    collapseAllBtn.addEventListener('click', collapseAllFolders);

    // Context menu items
    document.getElementById('ctx-open').addEventListener('click', handleContextMenuOpen);
    document.getElementById('ctx-add-folder').addEventListener('click', handleContextMenuAddFolder);
    document.getElementById('ctx-add-file').addEventListener('click', handleContextMenuAddFile);
    document.getElementById('ctx-rename').addEventListener('click', handleContextMenuRename);
    document.getElementById('ctx-delete').addEventListener('click', handleContextMenuDelete);

    // Close context menu when clicking elsewhere
    document.addEventListener('click', (e) => {
        if (!contextMenu.contains(e.target)) {
            hideContextMenu();
        }
    });

    // Home link in breadcrumb
    document.querySelector('#breadcrumb-list li:first-child a').addEventListener('click', (e) => {
        e.preventDefault();
        breadcrumbPath = [];
        updateBreadcrumb();
        selectedItemId = null;
        contentView.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open fa-4x"></i>
                <h3>Select a folder or file to view its contents</h3>
            </div>
        `;
    });

    // File drop area
    const fileDropArea = document.querySelector('.file-drop-area');
    const fileInput = document.getElementById('file-upload');

    fileDropArea.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            updateFilePreview(fileInput.files[0]);
        }
    });

    // Drag and drop for file upload
    fileDropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileDropArea.classList.add('drag-over');
    });

    fileDropArea.addEventListener('dragleave', () => {
        fileDropArea.classList.remove('drag-over');
    });

    fileDropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        fileDropArea.classList.remove('drag-over');

        if (e.dataTransfer.files.length > 0) {
            fileInput.files = e.dataTransfer.files;
            updateFilePreview(e.dataTransfer.files[0]);
        }
    });
}

// Handle search functionality
function handleSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();

    if (searchTerm) {
        clearSearch.classList.remove('hidden');
        performSearch(searchTerm);
    } else {
        clearSearch.classList.add('hidden');
        renderTree(); // Reset to normal view
    }
}

// Clear search input
function clearSearchInput() {
    searchInput.value = '';
    clearSearch.classList.add('hidden');
    renderTree();
}

// Perform search across folders and files
function performSearch(searchTerm) {
    treeRoot.innerHTML = '';

    // Search in folders
    const matchingFolders = knowledgeBase.folders.filter(folder =>
        folder.name.toLowerCase().includes(searchTerm)
    );

    // Search in files
    const matchingFiles = knowledgeBase.files.filter(file =>
        file.name.toLowerCase().includes(searchTerm)
    );

    if (matchingFolders.length === 0 && matchingFiles.length === 0) {
        treeRoot.innerHTML = `<li class="empty-tree">No results found for "${searchTerm}"</li>`;
        return;
    }

    // Create a search results container
    const searchResultsLi = document.createElement('li');
    searchResultsLi.innerHTML = `<div class="tree-item">
        <i class="fas fa-search tree-item-icon"></i>
        <span>Search Results</span>
    </div>`;

    const resultsList = document.createElement('ul');

    // Add matching folders
    matchingFolders.forEach(folder => {
        const folderPath = getFolderPath(folder.id);
        const pathText = folderPath.map(f => f.name).join(' > ');

        const li = document.createElement('li');
        li.innerHTML = `<div class="tree-item" data-id="${folder.id}" data-type="folder">
            <i class="fas fa-folder tree-item-icon folder-icon"></i>
            <div>
                <span class="tree-item-name">${folder.name}</span>
                <div class="search-path">${pathText}</div>
            </div>
        </div>`;

        li.querySelector('.tree-item').addEventListener('click', () => {
            selectItem(folder.id, 'folder');
        });

        resultsList.appendChild(li);
    });

    // Add matching files
    matchingFiles.forEach(file => {
        const folder = knowledgeBase.folders.find(f => f.id === file.parentId);
        const folderPath = folder ? getFolderPath(folder.id) : [];
        const pathText = folderPath.map(f => f.name).join(' > ');

        const li = document.createElement('li');
        li.innerHTML = `<div class="tree-item" data-id="${file.id}" data-type="file">
            <i class="fas fa-file tree-item-icon file-icon"></i>
            <div>
                <span class="tree-item-name">${file.name}</span>
                <div class="search-path">${pathText}</div>
            </div>
        </div>`;

        li.querySelector('.tree-item').addEventListener('click', () => {
            selectItem(file.id, 'file');
        });

        resultsList.appendChild(li);
    });

    searchResultsLi.appendChild(resultsList);
    treeRoot.appendChild(searchResultsLi);
}

// Get the full path to a folder
function getFolderPath(folderId) {
    const path = [];
    let currentId = folderId;

    while (currentId !== null) {
        const folder = knowledgeBase.folders.find(f => f.id === currentId);
        if (folder) {
            path.unshift(folder);
            currentId = folder.parentId;
        } else {
            break;
        }
    }

    return path;
}

// Show help modal
function showHelpModal() {
    helpModal.classList.remove('hidden');
    helpModal.classList.add('active');
}

// Hide help modal
function hideHelpModal() {
    helpModal.classList.remove('active');
    setTimeout(() => {
        helpModal.classList.add('hidden');
    }, 300);
}

// Expand all folders
function expandAllFolders() {
    const folderItems = document.querySelectorAll('.tree-item[data-type="folder"]');
    folderItems.forEach(item => {
        const ul = item.parentElement.querySelector('ul');
        if (ul) {
            ul.style.display = 'block';
            const toggleIcon = item.querySelector('.tree-toggle');
            if (toggleIcon) {
                toggleIcon.innerHTML = '<i class="fas fa-chevron-down"></i>';
            }
        }
    });
}

// Collapse all folders
function collapseAllFolders() {
    const folderItems = document.querySelectorAll('.tree-item[data-type="folder"]');
    folderItems.forEach(item => {
        const ul = item.parentElement.querySelector('ul');
        if (ul) {
            ul.style.display = 'none';
            const toggleIcon = item.querySelector('.tree-toggle');
            if (toggleIcon) {
                toggleIcon.innerHTML = '<i class="fas fa-chevron-right"></i>';
            }
        }
    });
}

// Handle context menu actions
function handleContextMenuOpen() {
    const id = parseInt(contextMenu.dataset.id);
    selectItem(id, 'folder');
    hideContextMenu();
}

function handleContextMenuAddFolder() {
    const id = parseInt(contextMenu.dataset.id);
    const type = contextMenu.dataset.type;

    if (type === 'folder') {
        showFolderForm(id);
    } else {
        // If it's a file, get its parent folder
        const file = knowledgeBase.files.find(f => f.id === id);
        if (file) {
            showFolderForm(file.parentId);
        }
    }

    hideContextMenu();
}

function handleContextMenuAddFile() {
    const id = parseInt(contextMenu.dataset.id);
    const type = contextMenu.dataset.type;

    if (type === 'folder') {
        showFileUploadForm(id);
    } else {
        // If it's a file, get its parent folder
        const file = knowledgeBase.files.find(f => f.id === id);
        if (file) {
            showFileUploadForm(file.parentId);
        }
    }

    hideContextMenu();
}

function handleContextMenuRename() {
    const id = parseInt(contextMenu.dataset.id);
    const type = contextMenu.dataset.type;

    if (type === 'folder') {
        const folder = knowledgeBase.folders.find(f => f.id === id);
        if (folder) {
            showFolderForm(folder.parentId, id);
            document.getElementById('folder-name').value = folder.name;
            if (folder.color) {
                document.getElementById('folder-color').value = folder.color;
            }
        }
    } else {
        const file = knowledgeBase.files.find(f => f.id === id);
        if (file) {
            showFileUploadForm(file.parentId, id);
            document.getElementById('file-name').value = file.name;
        }
    }

    hideContextMenu();
}

function handleContextMenuDelete() {
    const id = parseInt(contextMenu.dataset.id);
    const type = contextMenu.dataset.type;

    showDeleteConfirmation(id, type);
    hideContextMenu();
}

// Update file preview
function updateFilePreview(file) {
    const filePreview = document.getElementById('file-preview');
    filePreview.classList.remove('hidden');

    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            filePreview.innerHTML = `<img src="${e.target.result}" alt="File preview" style="max-width: 100%; max-height: 200px;">`;
        };
        reader.readAsDataURL(file);
    } else {
        filePreview.innerHTML = `
            <div class="file-info">
                <i class="${getFileIcon(file.type)}"></i>
                <div>
                    <p><strong>${file.name}</strong></p>
                    <p>${formatFileSize(file.size)}</p>
                </div>
            </div>
        `;
    }
}

// Get appropriate icon for file type
function getFileIcon(fileType) {
    if (fileType.startsWith('image/')) return 'fas fa-file-image';
    if (fileType.startsWith('text/')) return 'fas fa-file-alt';
    if (fileType.startsWith('application/pdf')) return 'fas fa-file-pdf';
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) return 'fas fa-file-excel';
    if (fileType.includes('word') || fileType.includes('document')) return 'fas fa-file-word';
    if (fileType.includes('presentation') || fileType.includes('powerpoint')) return 'fas fa-file-powerpoint';
    return 'fas fa-file';
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Render the tree structure
function renderTree() {
    treeRoot.innerHTML = '';

    // Get root level folders (parentId is null)
    const rootFolders = knowledgeBase.folders.filter(folder => folder.parentId === null);

    if (rootFolders.length === 0) {
        treeRoot.innerHTML = '<li class="empty-tree">No folders yet. Click "Add Root Folder" to get started.</li>';
        return;
    }

    // Render each root folder
    rootFolders.forEach(folder => {
        const folderElement = createFolderElement(folder);
        treeRoot.appendChild(folderElement);
    });
}

// Create a folder element for the tree
function createFolderElement(folder) {
    const li = document.createElement('li');

    // Create the folder item
    const folderItem = document.createElement('div');
    folderItem.className = `tree-item ${selectedItemId === folder.id ? 'selected' : ''}`;
    folderItem.dataset.id = folder.id;
    folderItem.dataset.type = 'folder';
    folderItem.draggable = true;

    // Check if folder has children
    const childFolders = knowledgeBase.folders.filter(f => f.parentId === folder.id);
    const childFiles = knowledgeBase.files.filter(f => f.parentId === folder.id);
    const hasChildren = childFolders.length > 0 || childFiles.length > 0;

    // Folder color (use custom color if available)
    const folderColor = folder.color || 'var(--folder-color)';

    // Create toggle button for expanding/collapsing if has children
    const toggleHtml = hasChildren ?
        `<span class="tree-toggle"><i class="fas fa-chevron-right"></i></span>` :
        `<span class="tree-toggle" style="visibility: hidden;"><i class="fas fa-chevron-right"></i></span>`;

    // Folder icon and name
    folderItem.innerHTML = `
        ${toggleHtml}
        <i class="fas fa-folder tree-item-icon folder-icon" style="color: ${folderColor};"></i>
        <span class="tree-item-name">${folder.name}</span>
        <div class="tree-item-actions">
            <button class="add-folder" title="Add Subfolder"><i class="fas fa-folder-plus"></i></button>
            <button class="add-file" title="Add File"><i class="fas fa-file-upload"></i></button>
            <button class="edit" title="Edit"><i class="fas fa-edit"></i></button>
            <button class="delete" title="Delete"><i class="fas fa-trash"></i></button>
        </div>
    `;

    // Add click event to select the folder
    folderItem.addEventListener('click', (e) => {
        if (!e.target.closest('button') && !e.target.closest('.tree-toggle')) {
            selectItem(folder.id, 'folder');
        }
    });

    // Add toggle functionality
    const toggleBtn = folderItem.querySelector('.tree-toggle');
    if (toggleBtn && hasChildren) {
        toggleBtn.addEventListener('click', () => {
            const ul = li.querySelector('ul');
            if (ul) {
                const isVisible = ul.style.display !== 'none';
                ul.style.display = isVisible ? 'none' : 'block';
                toggleBtn.innerHTML = isVisible ?
                    '<i class="fas fa-chevron-right"></i>' :
                    '<i class="fas fa-chevron-down"></i>';
            }
        });
    }

    // Add action button events
    folderItem.querySelector('.add-folder').addEventListener('click', () => {
        showFolderForm(folder.id);
    });

    folderItem.querySelector('.add-file').addEventListener('click', () => {
        showFileUploadForm(folder.id);
    });

    folderItem.querySelector('.edit').addEventListener('click', () => {
        showFolderForm(folder.parentId, folder.id);
        document.getElementById('folder-name').value = folder.name;
        if (folder.color) {
            document.getElementById('folder-color').value = folder.color;
        }
    });

    folderItem.querySelector('.delete').addEventListener('click', () => {
        showDeleteConfirmation(folder.id, 'folder');
    });

    // Add context menu
    folderItem.addEventListener('contextmenu', (e) => {
        showContextMenu(e, folder.id, 'folder');
    });

    // Drag and drop functionality
    folderItem.addEventListener('dragstart', (e) => {
        draggedItem = {
            id: folder.id,
            type: 'folder',
            name: folder.name
        };
        folderItem.classList.add('dragging');
        e.dataTransfer.setData('text/plain', folder.id);
        e.dataTransfer.effectAllowed = 'move';

        // Create a custom drag image
        const dragImage = document.createElement('div');
        dragImage.className = 'drag-image';
        dragImage.innerHTML = `<i class="fas fa-folder"></i> ${folder.name}`;
        dragImage.style.position = 'absolute';
        dragImage.style.top = '-1000px';
        dragImage.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        dragImage.style.color = 'white';
        dragImage.style.padding = '8px 12px';
        dragImage.style.borderRadius = '4px';
        dragImage.style.pointerEvents = 'none';
        document.body.appendChild(dragImage);

        e.dataTransfer.setDragImage(dragImage, 20, 20);

        // Remove the drag image after a short delay
        setTimeout(() => {
            document.body.removeChild(dragImage);
        }, 100);
    });

    folderItem.addEventListener('dragend', () => {
        folderItem.classList.remove('dragging');

        // Remove drag-over class from all items
        document.querySelectorAll('.drag-over').forEach(item => {
            item.classList.remove('drag-over');
        });

        document.querySelectorAll('.can-drop').forEach(item => {
            item.classList.remove('can-drop');
        });

        draggedItem = null;
    });

    folderItem.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (draggedItem && draggedItem.id !== folder.id) {
            // Check if this is a valid drop target
            let canDrop = true;

            // Don't allow dropping a parent folder into its child
            if (draggedItem.type === 'folder') {
                const childIds = getAllChildIds(draggedItem.id);
                if (childIds.folders.includes(folder.id)) {
                    canDrop = false;
                }
            }

            if (canDrop) {
                folderItem.classList.add('drag-over');
                folderItem.classList.add('can-drop');
                e.dataTransfer.dropEffect = 'move';
            } else {
                e.dataTransfer.dropEffect = 'none';
            }
        }
    });

    folderItem.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        folderItem.classList.remove('drag-over');
        folderItem.classList.remove('can-drop');
    });

    folderItem.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        folderItem.classList.remove('drag-over');
        folderItem.classList.remove('can-drop');

        if (draggedItem) {
            // Don't allow dropping on itself
            if (draggedItem.id === folder.id) return;

            // Don't allow dropping a parent folder into its child
            if (draggedItem.type === 'folder') {
                const childIds = getAllChildIds(draggedItem.id);
                if (childIds.folders.includes(folder.id)) return;
            }

            // Move the item
            if (draggedItem.type === 'folder') {
                const draggedFolder = knowledgeBase.folders.find(f => f.id === draggedItem.id);
                if (draggedFolder) {
                    // Show success message
                    const oldParent = draggedFolder.parentId ?
                        knowledgeBase.folders.find(f => f.id === draggedFolder.parentId)?.name || 'Root' :
                        'Root';

                    draggedFolder.parentId = folder.id;
                    saveToLocalStorage();
                    renderTree();

                    // Show notification
                    showNotification(`Moved folder "${draggedItem.name}" to "${folder.name}"`);
                }
            } else if (draggedItem.type === 'file') {
                const draggedFile = knowledgeBase.files.find(f => f.id === draggedItem.id);
                if (draggedFile) {
                    draggedFile.parentId = folder.id;
                    saveToLocalStorage();
                    renderTree();

                    // Show notification
                    showNotification(`Moved file "${draggedItem.name}" to "${folder.name}"`);
                }
            }
        }
    });

    li.appendChild(folderItem);

    // Create sublist for children
    if (hasChildren) {
        const ul = document.createElement('ul');

        // Initially collapsed
        ul.style.display = 'none';

        // Add child folders
        childFolders.forEach(childFolder => {
            const childElement = createFolderElement(childFolder);
            ul.appendChild(childElement);
        });

        // Add child files
        childFiles.forEach(file => {
            const fileElement = createFileElement(file);
            ul.appendChild(fileElement);
        });

        li.appendChild(ul);
    }

    return li;
}

// Create a file element for the tree
function createFileElement(file) {
    const li = document.createElement('li');

    // Create the file item
    const fileItem = document.createElement('div');
    fileItem.className = `tree-item ${selectedItemId === file.id ? 'selected' : ''}`;
    fileItem.dataset.id = file.id;
    fileItem.dataset.type = 'file';
    fileItem.draggable = true;

    // Get appropriate file icon based on file type
    const fileIconClass = getFileIconClass(file.type);

    // Empty space for alignment with folders
    const emptyToggle = `<span class="tree-toggle" style="visibility: hidden;"><i class="fas fa-chevron-right"></i></span>`;

    // File icon and name
    fileItem.innerHTML = `
        ${emptyToggle}
        <i class="${fileIconClass} tree-item-icon file-icon"></i>
        <span class="tree-item-name">${file.name}</span>
        <div class="tree-item-actions">
            <button class="edit" title="Edit"><i class="fas fa-edit"></i></button>
            <button class="delete" title="Delete"><i class="fas fa-trash"></i></button>
        </div>
    `;

    // Add click event to select the file
    fileItem.addEventListener('click', (e) => {
        if (!e.target.closest('button')) {
            selectItem(file.id, 'file');
        }
    });

    // Add action button events
    fileItem.querySelector('.edit').addEventListener('click', () => {
        showFileUploadForm(file.parentId, file.id);
        document.getElementById('file-name').value = file.name;
    });

    fileItem.querySelector('.delete').addEventListener('click', () => {
        showDeleteConfirmation(file.id, 'file');
    });

    // Add context menu
    fileItem.addEventListener('contextmenu', (e) => {
        showContextMenu(e, file.id, 'file');
    });

    // Drag and drop functionality
    fileItem.addEventListener('dragstart', (e) => {
        draggedItem = {
            id: file.id,
            type: 'file'
        };
        fileItem.classList.add('dragging');
        e.dataTransfer.setData('text/plain', file.id);
    });

    fileItem.addEventListener('dragend', () => {
        fileItem.classList.remove('dragging');
        draggedItem = null;
    });

    li.appendChild(fileItem);
    return li;
}

// Get appropriate file icon class based on file type
function getFileIconClass(fileType) {
    if (fileType.startsWith('image/')) return 'fas fa-file-image';
    if (fileType.startsWith('text/')) return 'fas fa-file-alt';
    if (fileType.startsWith('application/pdf')) return 'fas fa-file-pdf';
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) return 'fas fa-file-excel';
    if (fileType.includes('word') || fileType.includes('document')) return 'fas fa-file-word';
    if (fileType.includes('presentation') || fileType.includes('powerpoint')) return 'fas fa-file-powerpoint';
    if (fileType.includes('zip') || fileType.includes('compressed')) return 'fas fa-file-archive';
    if (fileType.includes('audio')) return 'fas fa-file-audio';
    if (fileType.includes('video')) return 'fas fa-file-video';
    if (fileType.includes('code') || fileType.includes('javascript') || fileType.includes('html') || fileType.includes('css')) return 'fas fa-file-code';
    return 'fas fa-file';
}

// Select an item (folder or file)
function selectItem(id, type) {
    // Remove selection from previously selected item
    const previouslySelected = document.querySelector('.tree-item.selected');
    if (previouslySelected) {
        previouslySelected.classList.remove('selected');
    }

    // Add selection to current item
    const currentItem = document.querySelector(`.tree-item[data-id="${id}"]`);
    if (currentItem) {
        currentItem.classList.add('selected');

        // Ensure the item is visible by expanding its parent folders
        ensureItemVisible(currentItem);
    }

    selectedItemId = id;

    // Update breadcrumb
    if (type === 'folder') {
        const folder = knowledgeBase.folders.find(f => f.id === id);
        if (folder) {
            breadcrumbPath = getFolderPath(id);
            updateBreadcrumb();
            showFolderContent(folder);
        }
    } else if (type === 'file') {
        const file = knowledgeBase.files.find(f => f.id === id);
        if (file) {
            // For files, show breadcrumb to parent folder + file
            const parentFolder = knowledgeBase.folders.find(f => f.id === file.parentId);
            if (parentFolder) {
                breadcrumbPath = getFolderPath(parentFolder.id);
                breadcrumbPath.push({
                    id: file.id,
                    name: file.name
                });
                updateBreadcrumb();
            }
            showFileContent(file);
        }
    }
}

// Ensure an item is visible by expanding its parent folders
function ensureItemVisible(item) {
    let parent = item.parentElement;

    // Traverse up the DOM to find all parent folders
    while (parent) {
        if (parent.tagName === 'UL' && parent.parentElement.tagName === 'LI') {
            // This is a folder's child list
            parent.style.display = 'block';

            // Update the toggle button
            const toggleBtn = parent.parentElement.querySelector('.tree-toggle');
            if (toggleBtn) {
                toggleBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';
            }
        }
        parent = parent.parentElement;
    }
}

// Show folder content
function showFolderContent(folder) {
    // Folder color (use custom color if available)
    const folderColor = folder.color || 'var(--folder-color)';

    contentView.innerHTML = `
        <div class="folder-view">
            <h2><i class="fas fa-folder-open folder-icon" style="color: ${folderColor};"></i> ${folder.name}</h2>
            <div class="folder-actions">
                <button class="btn btn-primary" id="folder-add-subfolder">
                    <i class="fas fa-folder-plus"></i> Add Subfolder
                </button>
                <button class="btn btn-primary" id="folder-add-file">
                    <i class="fas fa-file-upload"></i> Add File
                </button>
                <button class="btn btn-secondary" id="folder-sort">
                    <i class="fas fa-sort"></i> Sort
                </button>
            </div>
            <div class="folder-contents">
                <h3>Contents</h3>
                <div id="folder-items" class="folder-items"></div>
            </div>
        </div>
    `;

    // Add event listeners for the buttons
    document.getElementById('folder-add-subfolder').addEventListener('click', () => {
        showFolderForm(folder.id);
    });

    document.getElementById('folder-add-file').addEventListener('click', () => {
        showFileUploadForm(folder.id);
    });

    document.getElementById('folder-sort').addEventListener('click', () => {
        showSortOptions(folder.id);
    });

    // Show folder contents
    const folderItems = document.getElementById('folder-items');
    const childFolders = knowledgeBase.folders.filter(f => f.parentId === folder.id);
    const childFiles = knowledgeBase.files.filter(f => f.parentId === folder.id);

    if (childFolders.length === 0 && childFiles.length === 0) {
        folderItems.innerHTML = '<p class="empty-folder-message">This folder is empty.</p>';
        return;
    }

    // Add child folders
    childFolders.forEach(childFolder => {
        const folderColor = childFolder.color || 'var(--folder-color)';
        const folderItem = document.createElement('div');
        folderItem.className = 'content-item';
        folderItem.dataset.id = childFolder.id;
        folderItem.dataset.type = 'folder';
        folderItem.dataset.name = childFolder.name.toLowerCase();

        folderItem.innerHTML = `
            <i class="fas fa-folder folder-icon" style="color: ${folderColor};"></i>
            <span>${childFolder.name}</span>
        `;

        folderItem.addEventListener('click', () => {
            selectItem(childFolder.id, 'folder');
        });

        folderItem.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showContextMenu(e, childFolder.id, 'folder');
        });

        folderItems.appendChild(folderItem);
    });

    // Add child files
    childFiles.forEach(file => {
        const fileIconClass = getFileIconClass(file.type);
        const fileItem = document.createElement('div');
        fileItem.className = 'content-item';
        fileItem.dataset.id = file.id;
        fileItem.dataset.type = 'file';
        fileItem.dataset.name = file.name.toLowerCase();

        fileItem.innerHTML = `
            <i class="${fileIconClass} file-icon"></i>
            <span>${file.name}</span>
        `;

        fileItem.addEventListener('click', () => {
            selectItem(file.id, 'file');
        });

        fileItem.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showContextMenu(e, file.id, 'file');
        });

        folderItems.appendChild(fileItem);
    });
}

// Show sort options
function showSortOptions(folderId) {
    modal.classList.remove('hidden');
    modal.classList.add('active');

    modalTitle.textContent = 'Sort Items';

    const modalBody = document.querySelector('.modal-body');
    modalBody.innerHTML = `
        <div class="sort-options">
            <button class="btn btn-secondary sort-btn" data-sort="name-asc">
                <i class="fas fa-sort-alpha-down"></i> Name (A-Z)
            </button>
            <button class="btn btn-secondary sort-btn" data-sort="name-desc">
                <i class="fas fa-sort-alpha-up"></i> Name (Z-A)
            </button>
            <button class="btn btn-secondary sort-btn" data-sort="type">
                <i class="fas fa-layer-group"></i> Type (Folders first)
            </button>
        </div>
    `;

    // Add event listeners to sort buttons
    const sortButtons = document.querySelectorAll('.sort-btn');
    sortButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sortType = button.dataset.sort;
            sortFolderContents(sortType);
            hideModal();
        });
    });

    // Change modal buttons
    modalConfirm.style.display = 'none';
    modalCancel.textContent = 'Close';
}

// Sort folder contents
function sortFolderContents(sortType) {
    const folderItems = document.getElementById('folder-items');
    if (!folderItems) return;

    const items = Array.from(folderItems.children);

    items.sort((a, b) => {
        const aName = a.dataset.name;
        const bName = b.dataset.name;
        const aType = a.dataset.type;
        const bType = b.dataset.type;

        if (sortType === 'name-asc') {
            return aName.localeCompare(bName);
        } else if (sortType === 'name-desc') {
            return bName.localeCompare(aName);
        } else if (sortType === 'type') {
            // Folders first, then files
            if (aType === bType) {
                return aName.localeCompare(bName);
            }
            return aType === 'folder' ? -1 : 1;
        }
    });

    // Clear and re-append in sorted order
    folderItems.innerHTML = '';
    items.forEach(item => folderItems.appendChild(item));
}

// Show file content
function showFileContent(file) {
    // Get appropriate file icon
    const fileIconClass = getFileIconClass(file.type);

    let contentHtml = `
        <div class="file-view">
            <h2><i class="${fileIconClass} file-icon"></i> ${file.name}</h2>
            <div class="file-actions">
                <a href="${file.content}" download="${file.name}" class="btn btn-primary">
                    <i class="fas fa-download"></i> Download
                </a>
            </div>
    `;

    // Display file content based on type
    if (file.type.startsWith('image/')) {
        contentHtml += `<div class="file-preview">
            <img src="${file.content}" alt="${file.name}">
            <div class="image-info">
                <p><strong>Type:</strong> ${file.type}</p>
            </div>
        </div>`;
    } else if (file.type.startsWith('text/')) {
        // For text files, we need to extract the actual text from the data URL
        const base64Content = file.content.split(',')[1];
        const decodedContent = atob(base64Content);
        contentHtml += `<div class="file-preview">
            <pre>${decodedContent}</pre>
            <div class="file-info">
                <p><strong>Type:</strong> ${file.type}</p>
                <p><strong>Size:</strong> ${decodedContent.length} bytes</p>
            </div>
        </div>`;
    } else if (file.type.startsWith('application/pdf')) {
        contentHtml += `<div class="file-preview">
            <embed src="${file.content}" type="application/pdf" width="100%" height="600px">
            <div class="file-info">
                <p><strong>Type:</strong> ${file.type}</p>
            </div>
        </div>`;
    } else if (file.type.startsWith('audio/')) {
        contentHtml += `<div class="file-preview">
            <audio controls>
                <source src="${file.content}" type="${file.type}">
                Your browser does not support the audio element.
            </audio>
            <div class="file-info">
                <p><strong>Type:</strong> ${file.type}</p>
            </div>
        </div>`;
    } else if (file.type.startsWith('video/')) {
        contentHtml += `<div class="file-preview">
            <video controls width="100%">
                <source src="${file.content}" type="${file.type}">
                Your browser does not support the video element.
            </video>
            <div class="file-info">
                <p><strong>Type:</strong> ${file.type}</p>
            </div>
        </div>`;
    } else {
        contentHtml += `<div class="file-preview">
            <div class="file-icon-large">
                <i class="${fileIconClass} fa-5x"></i>
            </div>
            <p>Preview not available for this file type.</p>
            <div class="file-info">
                <p><strong>Type:</strong> ${file.type}</p>
            </div>
        </div>`;
    }

    contentHtml += '</div>';
    contentView.innerHTML = contentHtml;
}

// Show folder form
function showFolderForm(parentId, editId = null) {
    currentParentId = parentId;
    editingItemId = editId;

    folderFormTitle.textContent = editId ? 'Edit Folder' : 'Add New Folder';
    document.getElementById('folder-name').value = '';

    // Show the folder form modal
    folderFormModal.classList.remove('hidden');
    folderFormModal.classList.add('active');

    // Focus on the folder name input
    setTimeout(() => {
        document.getElementById('folder-name').focus();
    }, 100);
}

// Hide folder form
function hideFolderForm() {
    folderFormModal.classList.remove('active');
    setTimeout(() => {
        folderFormModal.classList.add('hidden');
        document.getElementById('folder-name').value = '';
        editingItemId = null;
    }, 300);
}

// Show file upload form
function showFileUploadForm(parentId, editId = null) {
    currentParentId = parentId;
    editingItemId = editId;

    document.getElementById('file-name').value = '';
    document.getElementById('file-upload').value = '';

    fileUploadContainer.classList.remove('hidden');
    folderFormContainer.classList.add('hidden');
}

// Hide file upload form
function hideFileUploadForm() {
    fileUploadContainer.classList.add('hidden');
    document.getElementById('file-name').value = '';
    document.getElementById('file-upload').value = '';
    editingItemId = null;
}

// Show delete confirmation modal
function showDeleteConfirmation(id, type) {
    const item = type === 'folder'
        ? knowledgeBase.folders.find(f => f.id === id)
        : knowledgeBase.files.find(f => f.id === id);

    if (!item) return;

    modalTitle.textContent = `Delete ${type === 'folder' ? 'Folder' : 'File'}`;
    modalMessage.textContent = `Are you sure you want to delete "${item.name}"? ${
        type === 'folder' ? 'All subfolders and files will also be deleted.' : ''
    }`;

    actionAfterConfirm = () => {
        if (type === 'folder') {
            deleteFolder(id);
        } else {
            deleteFile(id);
        }
    };

    showModal();
}

// Show modal
function showModal() {
    modal.classList.remove('hidden');
}

// Hide modal
function hideModal() {
    if (modal) {
        modal.classList.add('hidden');
        actionAfterConfirm = null;

        // Reset modal content
        if (modalTitle) modalTitle.textContent = 'Confirmation';
        if (modalMessage) modalMessage.textContent = 'Are you sure you want to proceed?';
    }
}

// Create a new folder
function createFolder(name, parentId, color = null) {
    const newFolder = {
        id: knowledgeBase.nextId++,
        name: name,
        parentId: parentId,
        type: 'folder',
        color: color
    };

    knowledgeBase.folders.push(newFolder);
    saveToLocalStorage();
    renderTree();

    // Select the new folder
    selectItem(newFolder.id, 'folder');
}

// Update an existing folder
function updateFolder(id, name, color = null) {
    const folder = knowledgeBase.folders.find(f => f.id === id);
    if (folder) {
        folder.name = name;
        if (color) {
            folder.color = color;
        }
        saveToLocalStorage();
        renderTree();

        // Reselect the folder to update the view
        selectItem(id, 'folder');
    }
}

// Delete a folder and all its contents
function deleteFolder(id) {
    // Get all child folders and files recursively
    const childIds = getAllChildIds(id);

    // Remove all child folders
    knowledgeBase.folders = knowledgeBase.folders.filter(f => !childIds.folders.includes(f.id));

    // Remove all child files
    knowledgeBase.files = knowledgeBase.files.filter(f => !childIds.files.includes(f.id));

    // Remove the folder itself
    knowledgeBase.folders = knowledgeBase.folders.filter(f => f.id !== id);

    saveToLocalStorage();
    renderTree();

    // Clear selection if the deleted folder was selected
    if (selectedItemId === id) {
        selectedItemId = null;
        contentView.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open fa-4x"></i>
                <h3>Select a folder or file to view its contents</h3>
            </div>
        `;
    }
}

// Get all child IDs recursively
function getAllChildIds(folderId) {
    const result = {
        folders: [folderId],
        files: []
    };

    // Find direct child folders
    const childFolders = knowledgeBase.folders.filter(f => f.parentId === folderId);

    // Recursively get all descendants
    childFolders.forEach(folder => {
        const descendants = getAllChildIds(folder.id);
        result.folders = [...result.folders, ...descendants.folders];
        result.files = [...result.files, ...descendants.files];
    });

    // Find direct child files
    const childFiles = knowledgeBase.files.filter(f => f.parentId === folderId);
    result.files = [...result.files, ...childFiles.map(f => f.id)];

    return result;
}

// Create a new file
function createFile(name, type, content, parentId) {
    const newFile = {
        id: knowledgeBase.nextId++,
        name: name,
        type: type,
        content: content,
        parentId: parentId
    };

    knowledgeBase.files.push(newFile);
    saveToLocalStorage();
    renderTree();

    // Select the new file
    selectItem(newFile.id, 'file');
}

// Update an existing file
function updateFile(id, name, type, content) {
    const file = knowledgeBase.files.find(f => f.id === id);
    if (file) {
        file.name = name;
        file.type = type;
        file.content = content;
        saveToLocalStorage();
        renderTree();

        // Reselect the file to update the view
        selectItem(id, 'file');
    }
}

// Delete a file
function deleteFile(id) {
    knowledgeBase.files = knowledgeBase.files.filter(f => f.id !== id);
    saveToLocalStorage();
    renderTree();

    // Clear selection if the deleted file was selected
    if (selectedItemId === id) {
        selectedItemId = null;
        contentView.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open fa-4x"></i>
                <h3>Select a folder or file to view its contents</h3>
            </div>
        `;
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);
