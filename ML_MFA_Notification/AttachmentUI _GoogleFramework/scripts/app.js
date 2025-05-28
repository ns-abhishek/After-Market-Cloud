/**
 * Attachment UI Application
 * Main application logic for the Google Framework UI
 */

document.addEventListener('DOMContentLoaded', function() {
    // Detect if we're on a touch device
    const isTouchDevice = ('ontouchstart' in window) ||
                          (navigator.maxTouchPoints > 0) ||
                          (navigator.msMaxTouchPoints > 0);

    // Add touch class to body if on a touch device
    if (isTouchDevice) {
        document.body.classList.add('touch-device');
    }
    // Store uploaded files
    const uploadedFiles = {};

    // File counter for generating unique IDs
    let fileCounter = 1;

    // DOM Elements
    const fileInput = document.getElementById('fileInput');
    const dialogFileInput = document.getElementById('dialog-file-input');
    const dropzone = document.getElementById('dropzone');
    const uploadButton = document.getElementById('upload-button');
    const attachmentList = document.getElementById('attachment-list');
    const attachmentGrid = document.getElementById('attachment-grid');
    const fileViewerContainer = document.getElementById('file-viewer-container');
    const downloadFileBtn = document.getElementById('download-file-btn');

    // Sample reference documents
    const referenceDocuments = {
        'BSKY': 'BSKY - Design - colour exploration',
        'Research': 'Preliminary research',
        'Documentation': 'System documentation'
    };

    // Sample user data
    const users = {
        'user1': { name: 'John Smith', email: 'john.smith@example.com' },
        'user2': { name: 'Jane Doe', email: 'jane.doe@example.com' },
        'user3': { name: 'Robert Johnson', email: 'robert.johnson@example.com' }
    };

    // Initialize the UI with sample data
    initializeSampleData();

    // Event Listeners

    // File selection state management
    let fileSelectionInProgress = false;
    let fileDialogContext = 'new'; // 'new' or 'update'
    let lastSelectedFile = null;

    // Open upload dialog when upload button is clicked
    if (uploadButton) {
        uploadButton.addEventListener('click', () => {
            if (fileSelectionInProgress) return;

            fileSelectionInProgress = true;
            fileDialogContext = 'new';

            // Use a timeout to prevent double-opening
            setTimeout(() => {
                fileInput.click();
            }, 100);
        });
    }

    // Handle file selection from the file input
    if (fileInput) {
        fileInput.addEventListener('change', (event) => {
            if (!event.target.files || event.target.files.length === 0) {
                fileSelectionInProgress = false;
                return;
            }

            // Store the selected file
            lastSelectedFile = event.target.files[0];

            // Process the file based on context
            if (fileDialogContext === 'new') {
                // Create a new file entry and open the upload dialog
                const fileId = 'file_' + fileCounter++;
                uploadedFiles[fileId] = {
                    id: fileId,
                    name: lastSelectedFile.name,
                    type: lastSelectedFile.type,
                    size: lastSelectedFile.size,
                    data: lastSelectedFile,
                    date: new Date(),
                    user: 'user1', // Current user ID
                    reference: '',
                    requiresSignature: false,
                    signed: false
                };

                // Update the file name in the upload dialog
                const selectedFilename = document.querySelector('.selected-filename');
                if (selectedFilename) {
                    selectedFilename.textContent = lastSelectedFile.name;
                }

                // Update the file icon based on type
                updateFileIcon(lastSelectedFile.type);

                // Open the upload dialog
                if (window.dialogs && window.dialogs.upload) {
                    window.dialogs.upload.show();
                } else if (window.dialogInstances && window.dialogInstances['upload-dialog']) {
                    window.dialogInstances['upload-dialog'].open();
                }
            } else if (fileDialogContext === 'update') {
                // Update the existing file entry
                const fileId = 'file_' + (fileCounter - 1);
                if (uploadedFiles[fileId]) {
                    uploadedFiles[fileId].name = lastSelectedFile.name;
                    uploadedFiles[fileId].type = lastSelectedFile.type;
                    uploadedFiles[fileId].size = lastSelectedFile.size;
                    uploadedFiles[fileId].data = lastSelectedFile;
                }

                // Update the file name in the upload dialog
                const selectedFilename = document.querySelector('.selected-filename');
                if (selectedFilename) {
                    selectedFilename.textContent = lastSelectedFile.name;
                }

                // Update the file icon based on type
                updateFileIcon(lastSelectedFile.type);
            }

            // Reset the file selection state
            fileSelectionInProgress = false;
        });
    }

    // Handle dialog file selection button
    const dialogChooseFileBtn = document.getElementById('dialog-choose-file-btn');
    if (dialogChooseFileBtn) {
        dialogChooseFileBtn.addEventListener('click', () => {
            if (fileSelectionInProgress) return;

            fileSelectionInProgress = true;
            fileDialogContext = 'update';

            // Use a timeout to prevent double-opening
            setTimeout(() => {
                fileInput.click();
            }, 100);
        });
    }

    // Handle dropzone click
    if (dropzone) {
        dropzone.addEventListener('click', () => {
            if (fileSelectionInProgress) return;

            fileSelectionInProgress = true;
            fileDialogContext = 'new';

            // Use a timeout to prevent double-opening
            setTimeout(() => {
                fileInput.click();
            }, 100);
        });

        // Handle drag and drop
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('dragover');
        });

        dropzone.addEventListener('dragleave', () => {
            dropzone.classList.remove('dragover');
        });

        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('dragover');

            if (e.dataTransfer.files.length > 0) {
                // Create a new file entry directly from the dropped file
                const file = e.dataTransfer.files[0];
                const fileId = 'file_' + fileCounter++;

                uploadedFiles[fileId] = {
                    id: fileId,
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    data: file,
                    date: new Date(),
                    user: 'user1', // Current user ID
                    reference: '',
                    requiresSignature: false,
                    signed: false
                };

                // Update the file name in the upload dialog
                const selectedFilename = document.querySelector('.selected-filename');
                if (selectedFilename) {
                    selectedFilename.textContent = file.name;
                }

                // Update the file icon based on type
                updateFileIcon(file.type);

                // Open the upload dialog
                if (window.dialogs && window.dialogs.upload) {
                    window.dialogs.upload.show();
                } else if (window.dialogInstances && window.dialogInstances['upload-dialog']) {
                    window.dialogInstances['upload-dialog'].open();
                }
            }
        });
    }

    // Handle upload confirmation in dialog
    const uploadConfirmBtn = document.getElementById('upload-confirm-btn');
    if (uploadConfirmBtn) {
        uploadConfirmBtn.addEventListener('click', () => {
            // Get selected file info from the dialog
            const fileSelect = document.getElementById('file-reference-select');
            const requireSignature = document.getElementById('require-signature-checkbox') &&
                                    document.getElementById('require-signature-checkbox').checked;

            let reference = '';
            if (fileSelect) {
                // For Google Web Components
                if (typeof fileSelect.value !== 'undefined') {
                    reference = fileSelect.value;
                }
                // For MDC components
                else if (window.mdc && mdc.select && mdc.select.MDCSelect) {
                    const mdcSelect = mdc.select.MDCSelect.attachTo(fileSelect);
                    reference = mdcSelect.value;
                }
            }

            // Get the last added file ID
            const fileId = 'file_' + (fileCounter - 1);
            if (uploadedFiles[fileId]) {
                // Update file metadata
                uploadedFiles[fileId].reference = reference;
                uploadedFiles[fileId].requiresSignature = requireSignature;

                // Add the file to the UI
                addFileToUI(uploadedFiles[fileId]);
            }

            // Close the dialog
            if (window.dialogs && window.dialogs.upload) {
                window.dialogs.upload.close();
            } else if (window.dialogInstances && window.dialogInstances['upload-dialog']) {
                window.dialogInstances['upload-dialog'].close();
            }

            // Reset file selection state
            fileSelectionInProgress = false;

            // Show success message
            window.showSnackbar('File uploaded successfully');
        });
    }

    // Add event listener for dialog events
    const uploadDialog = document.getElementById('upload-dialog');
    if (uploadDialog) {
        // For Material Design Components
        uploadDialog.addEventListener('MDCDialog:closed', () => {
            fileSelectionInProgress = false;
        });

        // For Google Web Components
        uploadDialog.addEventListener('closed', () => {
            fileSelectionInProgress = false;
        });
    }

    // Helper function to update file icon based on file type
    function updateFileIcon(fileType) {
        const fileIcon = document.querySelector('.file-icon');
        if (fileIcon) {
            fileIcon.textContent = getFileTypeIcon(fileType);
        }
    }

    // Function to add a file to the UI
    function addFileToUI(file) {
        // Add to list view
        addFileToListView(file);

        // Add to grid view
        addFileToGridView(file);
    }

    // Function to add a file to the list view
    function addFileToListView(file) {
        if (!attachmentList) return;

        const row = document.createElement('tr');
        row.className = 'mdc-data-table__row';
        row.setAttribute('data-file-id', file.id);

        // Format file size
        const fileSize = formatFileSize(file.size);

        // Format date
        const fileDate = formatDate(file.date);

        // Get user info
        const user = users[file.user] || { name: 'Unknown User' };

        // Create signature status element
        const signatureStatus = file.requiresSignature
            ? (file.signed
                ? '<span class="signature-status signed"><i class="material-icons">verified</i> Signed</span>'
                : '<span class="signature-status unsigned"><i class="material-icons">pending</i> Pending</span>')
            : '';

        // Create reference element
        const referenceElement = file.reference
            ? `<div class="mdc-chip" role="row"><div class="mdc-chip__ripple"></div><span class="mdc-chip__text">${referenceDocuments[file.reference] || file.reference}</span></div>`
            : '';

        row.innerHTML = `
            <td class="mdc-data-table__cell mdc-data-table__cell--checkbox">
                <div class="mdc-checkbox mdc-data-table__row-checkbox">
                    <input type="checkbox" class="mdc-checkbox__native-control" aria-labelledby="file-${file.id}"/>
                    <div class="mdc-checkbox__background">
                        <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">
                            <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
                        </svg>
                        <div class="mdc-checkbox__mixedmark"></div>
                    </div>
                </div>
            </td>
            <td class="mdc-data-table__cell" id="file-${file.id}">
                <div class="file-info">
                    <div class="file-type-icon ${getFileTypeClass(file.type)}">
                        <i class="material-icons">${getFileTypeIcon(file.type)}</i>
                    </div>
                    <span>${file.name}</span>
                </div>
            </td>
            <td class="mdc-data-table__cell">${fileSize}</td>
            <td class="mdc-data-table__cell">${user.name}</td>
            <td class="mdc-data-table__cell">${fileDate}</td>
            <td class="mdc-data-table__cell">
                <div class="file-actions">
                    <button class="file-action-button view-file" data-file-id="${file.id}" title="View file">
                        <i class="material-icons">visibility</i>
                    </button>
                    <button class="file-action-button download-file" data-file-id="${file.id}" title="Download file">
                        <i class="material-icons">download</i>
                    </button>
                    <button class="file-action-button delete-file" data-file-id="${file.id}" title="Delete file">
                        <i class="material-icons">delete</i>
                    </button>
                </div>
            </td>
        `;

        attachmentList.appendChild(row);

        // Initialize the checkbox
        const checkbox = row.querySelector('.mdc-checkbox');
        new mdc.checkbox.MDCCheckbox(checkbox);

        // Add event listeners to action buttons
        const viewButton = row.querySelector('.view-file');
        const downloadButton = row.querySelector('.download-file');
        const deleteButton = row.querySelector('.delete-file');

        viewButton.addEventListener('click', () => openFileViewer(file.id));
        downloadButton.addEventListener('click', () => downloadFile(file.id));
        deleteButton.addEventListener('click', () => deleteFile(file.id));
    }

    // Function to add a file to the grid view
    function addFileToGridView(file) {
        if (!attachmentGrid) return;

        const cell = document.createElement('div');
        cell.className = 'mdc-layout-grid__cell mdc-layout-grid__cell--span-3-desktop mdc-layout-grid__cell--span-4-tablet mdc-layout-grid__cell--span-4-phone';
        cell.setAttribute('data-file-id', file.id);

        // Format file size
        const fileSize = formatFileSize(file.size);

        // Format date
        const fileDate = formatDate(file.date);

        // Get user info
        const user = users[file.user] || { name: 'Unknown User' };

        // Create signature status element
        const signatureStatus = file.requiresSignature
            ? (file.signed
                ? '<span class="signature-status signed"><i class="material-icons">verified</i> Signed</span>'
                : '<span class="signature-status unsigned"><i class="material-icons">pending</i> Pending</span>')
            : '';

        cell.innerHTML = `
            <div class="mdc-card attachment-card">
                <div class="attachment-card__media" style="background-color: ${getFileTypeColor(file.type)}">
                    <i class="material-icons attachment-card__media-icon">${getFileTypeIcon(file.type)}</i>
                </div>
                <div class="mdc-card__content" style="padding: 16px;">
                    <h2 class="mdc-typography--subtitle1" style="margin: 0 0 8px 0; word-break: break-all;">${file.name}</h2>
                    <p class="mdc-typography--body2" style="margin: 0 0 4px 0; color: var(--mdc-theme-text-secondary-on-background);">
                        Size: ${fileSize}
                    </p>
                    <p class="mdc-typography--body2" style="margin: 0 0 8px 0; color: var(--mdc-theme-text-secondary-on-background);">
                        Uploaded by: ${user.name}
                    </p>
                    ${signatureStatus}
                </div>
                <div class="mdc-card__actions">
                    <div class="mdc-card__action-buttons">
                        <button class="mdc-button mdc-card__action mdc-card__action--button view-file" data-file-id="${file.id}">
                            <span class="mdc-button__ripple"></span>
                            <i class="material-icons mdc-button__icon" aria-hidden="true">visibility</i>
                            <span class="mdc-button__label">View</span>
                        </button>
                    </div>
                    <div class="mdc-card__action-icons">
                        <button class="mdc-icon-button mdc-card__action mdc-card__action--icon download-file" data-file-id="${file.id}" title="Download">
                            <i class="material-icons">download</i>
                        </button>
                        <button class="mdc-icon-button mdc-card__action mdc-card__action--icon delete-file" data-file-id="${file.id}" title="Delete">
                            <i class="material-icons">delete</i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        attachmentGrid.appendChild(cell);

        // Initialize ripple effect on buttons
        const buttons = cell.querySelectorAll('.mdc-button');
        buttons.forEach(button => {
            new mdc.ripple.MDCRipple(button);
        });

        const iconButtons = cell.querySelectorAll('.mdc-icon-button');
        iconButtons.forEach(iconButton => {
            const iconButtonRipple = new mdc.ripple.MDCRipple(iconButton);
            iconButtonRipple.unbounded = true;
        });

        // Add event listeners to action buttons
        const viewButton = cell.querySelector('.view-file');
        const downloadButton = cell.querySelector('.download-file');
        const deleteButton = cell.querySelector('.delete-file');

        viewButton.addEventListener('click', () => openFileViewer(file.id));
        downloadButton.addEventListener('click', () => downloadFile(file.id));
        deleteButton.addEventListener('click', () => deleteFile(file.id));
    }

    // Function to open file viewer
    function openFileViewer(fileId) {
        if (!uploadedFiles[fileId]) return;

        const file = uploadedFiles[fileId];

        // Set the dialog title
        const dialogTitle = document.getElementById('file-viewer-dialog-title');
        if (dialogTitle) {
            dialogTitle.textContent = file.name;
        }

        // Clear previous content
        if (fileViewerContainer) {
            fileViewerContainer.innerHTML = `
                <div class="file-viewer-placeholder">
                    <i class="material-icons">hourglass_empty</i>
                    <p>Loading file...</p>
                </div>
            `;
        }

        // Set the current file ID on the download button
        if (downloadFileBtn) {
            downloadFileBtn.setAttribute('data-file-id', fileId);
        }

        // Open the dialog
        window.dialogInstances['file-viewer-dialog'].open();

        // Display the file based on its type
        setTimeout(() => {
            displayFile(fileId);
        }, 500);
    }

    // Function to display a file in the viewer
    function displayFile(fileId) {
        if (!uploadedFiles[fileId] || !fileViewerContainer) return;

        const file = uploadedFiles[fileId];
        const fileType = file.type;

        // Create object URL for the file
        const objectUrl = URL.createObjectURL(file.data);

        // Display based on file type
        if (fileType.startsWith('image/')) {
            // Image viewer
            fileViewerContainer.innerHTML = `
                <img src="${objectUrl}" alt="${file.name}" class="file-viewer-image">
            `;
        } else if (fileType === 'application/pdf') {
            // PDF viewer
            fileViewerContainer.innerHTML = `
                <iframe src="${objectUrl}" class="file-viewer-pdf" title="${file.name}"></iframe>
            `;
        } else if (fileType === 'text/plain' || fileType === 'text/csv') {
            // Text viewer
            const reader = new FileReader();
            reader.onload = function(e) {
                fileViewerContainer.innerHTML = `
                    <pre class="file-viewer-text">${e.target.result}</pre>
                `;
            };
            reader.readAsText(file.data);
        } else if (fileType.includes('word') || fileType.includes('document') ||
                  fileType.includes('sheet') || fileType.includes('excel') ||
                  fileType.includes('presentation') || fileType.includes('powerpoint')) {
            // Office documents - use Google Docs Viewer
            fileViewerContainer.innerHTML = `
                <iframe src="https://docs.google.com/viewer?embedded=true&url=${encodeURIComponent(objectUrl)}"
                        class="file-viewer-iframe" title="${file.name}"></iframe>
            `;
        } else {
            // Generic file info for unsupported types
            fileViewerContainer.innerHTML = `
                <div class="file-viewer-placeholder">
                    <i class="material-icons">${getFileTypeIcon(fileType)}</i>
                    <h3 class="mdc-typography--headline6">${file.name}</h3>
                    <p class="mdc-typography--body1">This file type cannot be previewed.</p>
                    <button class="mdc-button mdc-button--raised" id="viewer-download-btn">
                        <span class="mdc-button__ripple"></span>
                        <i class="material-icons mdc-button__icon" aria-hidden="true">download</i>
                        <span class="mdc-button__label">Download File</span>
                    </button>
                </div>
            `;

            // Initialize the download button
            const downloadBtn = document.getElementById('viewer-download-btn');
            if (downloadBtn) {
                new mdc.ripple.MDCRipple(downloadBtn);
                downloadBtn.addEventListener('click', () => downloadFile(fileId));
            }
        }
    }

    // Function to download a file
    function downloadFile(fileId) {
        if (!uploadedFiles[fileId]) return;

        const file = uploadedFiles[fileId];

        // Create a download link
        const link = document.createElement('a');
        link.href = URL.createObjectURL(file.data);
        link.download = file.name;
        link.style.display = 'none';

        // Add to document, click it, and remove it
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Show success message
        window.showSnackbar(`Downloading: ${file.name}`);
    }

    // Function to delete a file
    function deleteFile(fileId) {
        if (!uploadedFiles[fileId]) return;

        // Remove from UI
        const listItem = attachmentList.querySelector(`tr[data-file-id="${fileId}"]`);
        if (listItem) {
            listItem.remove();
        }

        const gridItem = attachmentGrid.querySelector(`div[data-file-id="${fileId}"]`);
        if (gridItem) {
            gridItem.remove();
        }

        // Remove from storage
        delete uploadedFiles[fileId];

        // Show success message
        window.showSnackbar('File deleted successfully');
    }

    // Helper function to update file icon in upload dialog
    function updateFileIcon(fileType) {
        const fileIcon = document.querySelector('.file-icon');
        if (fileIcon) {
            fileIcon.textContent = getFileTypeIcon(fileType);
        }
    }

    // Helper function to get file type icon
    function getFileTypeIcon(fileType) {
        if (fileType.startsWith('image/')) {
            return 'image';
        } else if (fileType === 'application/pdf') {
            return 'picture_as_pdf';
        } else if (fileType.includes('word') || fileType.includes('document')) {
            return 'description';
        } else if (fileType.includes('sheet') || fileType.includes('excel')) {
            return 'table_chart';
        } else if (fileType.includes('presentation') || fileType.includes('powerpoint')) {
            return 'slideshow';
        } else if (fileType === 'text/plain' || fileType === 'text/csv') {
            return 'text_snippet';
        } else {
            return 'insert_drive_file';
        }
    }

    // Helper function to get file type class
    function getFileTypeClass(fileType) {
        if (fileType.startsWith('image/')) {
            return 'image';
        } else if (fileType === 'application/pdf') {
            return 'pdf';
        } else if (fileType.includes('word') || fileType.includes('document')) {
            return 'document';
        } else if (fileType.includes('sheet') || fileType.includes('excel')) {
            return 'spreadsheet';
        } else if (fileType.includes('presentation') || fileType.includes('powerpoint')) {
            return 'presentation';
        } else if (fileType === 'text/plain' || fileType === 'text/csv') {
            return 'text';
        } else {
            return 'other';
        }
    }

    // Helper function to get file type color for grid view
    function getFileTypeColor(fileType) {
        if (fileType.startsWith('image/')) {
            return '#4285f4'; // Google Blue
        } else if (fileType === 'application/pdf') {
            return '#ea4335'; // Google Red
        } else if (fileType.includes('word') || fileType.includes('document')) {
            return '#4285f4'; // Google Blue
        } else if (fileType.includes('sheet') || fileType.includes('excel')) {
            return '#34a853'; // Google Green
        } else if (fileType.includes('presentation') || fileType.includes('powerpoint')) {
            return '#fbbc04'; // Google Yellow
        } else if (fileType === 'text/plain' || fileType === 'text/csv') {
            return '#5f6368'; // Google Gray
        } else {
            return '#9aa0a6'; // Light Gray
        }
    }

    // Helper function to format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Helper function to format date
    function formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    // Function to initialize sample data
    function initializeSampleData() {
        // Sample files will be added here
    }
});
