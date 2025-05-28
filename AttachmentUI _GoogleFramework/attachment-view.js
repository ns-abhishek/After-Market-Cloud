document.addEventListener('DOMContentLoaded', function() {
    // Store the currently selected file
    let currentSelectedFile = null;

    // Track current view mode (list or grid)
    let currentViewMode = 'list';

    // Store current signature data
    let currentSignature = null;
    let currentSignatureType = null; // 'draw', 'type', or 'upload'
    let currentFileIdForSignature = null;

    // Upload signature data
    let uploadSignature = null;

    // Drawing variables
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let penColor = '#000000';
    let penSize = 2;

    // Reference to grid container
    const attachmentGridContainer = document.getElementById('attachmentGridContainer');
    const emptyGridState = document.getElementById('emptyGridState');

    // Toggle accordion sections
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const section = header.parentElement;
            section.classList.toggle('active');
            const content = header.nextElementSibling;
            content.classList.toggle('show');
            const icon = header.querySelector('.toggle-icon');
            icon.classList.toggle('fa-chevron-down');
            icon.classList.toggle('fa-chevron-up');
        });
    });

    // File upload functionality
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('fileInput');
    const emptyState = document.getElementById('emptyState');
    const attachmentTableBody = document.getElementById('attachmentTableBody');
    const uploadModal = document.getElementById('uploadModal');
    const closeModalBtn = document.querySelector('.close-btn');
    const uploadBtn = document.querySelector('.upload-btn');
    const modalFileInput = document.getElementById('modalFileInput');
    const selectedFilename = document.querySelector('.selected-filename');
    const uploadFileBtn = document.querySelector('.upload-btn-modal');
    const paginationInfo = document.querySelector('.pagination-info');

    // Filter elements
    const fileTypeFilter = document.getElementById('fileTypeFilter');
    const labelFilter = document.getElementById('labelFilter');
    const sortFilter = document.getElementById('sortFilter');

    // View toggle elements
    const listViewBtn = document.getElementById('listViewBtn');
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listView = document.querySelector('.list-view');
    const gridView = document.querySelector('.grid-view');

    // Label elements
    const fileLabelsInput = document.getElementById('fileLabels');
    const labelSuggestions = document.querySelectorAll('.label-suggestion');
    const fileAttachedToSelect = document.getElementById('fileAttachedTo');

    // File viewer elements
    const fileViewerModal = document.getElementById('fileViewerModal');
    const viewerFileName = document.getElementById('viewerFileName');
    const fileViewerContainer = document.getElementById('fileViewerContainer');
    const closeViewerBtn = document.getElementById('closeViewerBtn');
    const closeViewerFooterBtn = document.getElementById('closeViewerFooterBtn');
    const downloadViewedFileBtn = document.getElementById('downloadViewedFileBtn');

    // Upload signature elements
    const requireSignatureCheckbox = document.getElementById('requireSignature');
    const uploadSignatureArea = document.getElementById('uploadSignatureArea');
    const uploadSignatureCanvas = document.getElementById('uploadSignatureCanvas');
    const clearUploadSignatureBtn = document.getElementById('clearUploadSignatureBtn');

    // Store uploaded files for viewing
    const uploadedFiles = {};

    // Sample reference documents
    const referenceDocuments = {
        'BSKY': 'BSKY - Design - colour exploration',
        'Research': 'Preliminary research',
        'Documentation': 'System documentation'
    };

    // Show upload modal when upload button is clicked
    if (uploadBtn) {
        uploadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Trigger the file input click to open the file dialog directly
            if (fileInput) {
                fileInput.click();
            }
        });
    }

    // Also handle the main choose button click
    const mainChooseBtn = document.getElementById('mainChooseBtn');
    if (mainChooseBtn) {
        mainChooseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Trigger the file input click to open the file dialog directly
            if (fileInput) {
                fileInput.click();
            }
        });
    }



    // Close modal when close button is clicked
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            if (uploadModal) {
                uploadModal.style.display = 'none';
                // Reset the file selection
                currentSelectedFile = null;
                selectedFilename.textContent = 'No file selected';
                // Reset form fields
                document.getElementById('fileDescription').value = '';
                if (fileLabelsInput) fileLabelsInput.value = '';
                if (fileAttachedToSelect) fileAttachedToSelect.selectedIndex = 0;
            }
        });
    }

    // Close modal when clicking outside of it
    if (uploadModal) {
        uploadModal.addEventListener('click', (e) => {
            if (e.target === uploadModal) {
                uploadModal.style.display = 'none';
                // Reset the file selection
                currentSelectedFile = null;
                selectedFilename.textContent = 'No file selected';
                // Reset form fields
                document.getElementById('fileDescription').value = '';
                if (fileLabelsInput) fileLabelsInput.value = '';
                if (fileAttachedToSelect) fileAttachedToSelect.selectedIndex = 0;
            }
        });
    }

    // Handle cancel button in modal
    const cancelBtn = document.querySelector('.modal-footer .btn-secondary');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            uploadModal.style.display = 'none';
            // Reset the file selection
            currentSelectedFile = null;
            selectedFilename.textContent = 'No file selected';
            // Reset form fields
            document.getElementById('fileDescription').value = '';
            if (fileLabelsInput) fileLabelsInput.value = '';
            if (fileAttachedToSelect) fileAttachedToSelect.selectedIndex = 0;

            // Reset the file icon
            const fileIcon = document.querySelector('.file-icon i');
            if (fileIcon) {
                fileIcon.className = 'fas fa-file-alt';
            }
        });
    }



    // Update selected filename in modal
    if (modalFileInput) {
        modalFileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                currentSelectedFile = e.target.files[0];
                selectedFilename.textContent = currentSelectedFile.name;

                // Update the file icon based on file type
                const fileIcon = document.querySelector('.file-icon i');
                if (fileIcon) {
                    const fileTypeInfo = getFileTypeInfo(currentSelectedFile.name);
                    fileIcon.className = `fas ${fileTypeInfo.icon}`;
                }
            } else {
                currentSelectedFile = null;
                selectedFilename.textContent = 'No file selected';
            }
        });
    }

    // Initialize upload signature canvas
    function initializeUploadSignatureCanvas() {
        if (!uploadSignatureCanvas) return;

        const ctx = uploadSignatureCanvas.getContext('2d');

        // Set default pen properties
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Mouse events for desktop
        uploadSignatureCanvas.addEventListener('mousedown', startUploadDrawing);
        uploadSignatureCanvas.addEventListener('mousemove', drawUploadSignature);
        uploadSignatureCanvas.addEventListener('mouseup', stopUploadDrawing);
        uploadSignatureCanvas.addEventListener('mouseout', stopUploadDrawing);

        // Touch events for mobile
        uploadSignatureCanvas.addEventListener('touchstart', startUploadDrawingTouch);
        uploadSignatureCanvas.addEventListener('touchmove', drawUploadSignatureTouch);
        uploadSignatureCanvas.addEventListener('touchend', stopUploadDrawing);
    }

    // Drawing functions for upload signature
    function startUploadDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];

        // Hide placeholder text
        const placeholder = document.querySelector('.signature-canvas-placeholder-upload');
        if (placeholder) {
            placeholder.style.opacity = '0';
        }
    }

    function drawUploadSignature(e) {
        if (!isDrawing) return;

        const ctx = uploadSignatureCanvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }

    function startUploadDrawingTouch(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = uploadSignatureCanvas.getBoundingClientRect();
        const offsetX = touch.clientX - rect.left;
        const offsetY = touch.clientY - rect.top;

        isDrawing = true;
        [lastX, lastY] = [offsetX, offsetY];

        // Hide placeholder text
        const placeholder = document.querySelector('.signature-canvas-placeholder-upload');
        if (placeholder) {
            placeholder.style.opacity = '0';
        }
    }

    function drawUploadSignatureTouch(e) {
        e.preventDefault();
        if (!isDrawing) return;

        const touch = e.touches[0];
        const rect = uploadSignatureCanvas.getBoundingClientRect();
        const offsetX = touch.clientX - rect.left;
        const offsetY = touch.clientY - rect.top;

        const ctx = uploadSignatureCanvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
        [lastX, lastY] = [offsetX, offsetY];
    }

    function stopUploadDrawing() {
        if (isDrawing) {
            isDrawing = false;

            // Save current signature
            if (uploadSignatureCanvas) {
                uploadSignature = uploadSignatureCanvas.toDataURL('image/png');
            }
        }
    }

    // Clear upload signature button
    if (clearUploadSignatureBtn) {
        clearUploadSignatureBtn.addEventListener('click', () => {
            if (uploadSignatureCanvas) {
                const ctx = uploadSignatureCanvas.getContext('2d');
                ctx.clearRect(0, 0, uploadSignatureCanvas.width, uploadSignatureCanvas.height);

                // Show placeholder text
                const placeholder = document.querySelector('.signature-canvas-placeholder-upload');
                if (placeholder) {
                    placeholder.style.opacity = '0.5';
                }

                // Reset signature
                uploadSignature = null;
            }
        });
    }

    // Toggle signature area visibility based on checkbox
    if (requireSignatureCheckbox) {
        requireSignatureCheckbox.addEventListener('change', () => {
            if (requireSignatureCheckbox.checked) {
                uploadSignatureArea.style.display = 'block';
                // Initialize canvas if not already done
                initializeUploadSignatureCanvas();

                // Scroll to the signature area after a short delay to ensure it's visible
                setTimeout(() => {
                    uploadSignatureArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
            } else {
                uploadSignatureArea.style.display = 'none';
                // Clear signature data
                uploadSignature = null;
            }
        });
    }

    // Handle file upload from modal
    if (uploadFileBtn) {
        uploadFileBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const fileDescription = document.getElementById('fileDescription').value;
            const labels = fileLabelsInput ? fileLabelsInput.value : '';
            const attachedTo = fileAttachedToSelect ? fileAttachedToSelect.value : '';
            const requiresSignature = requireSignatureCheckbox ? requireSignatureCheckbox.checked : false;

            // Use the stored file or get it from the input
            const file = currentSelectedFile || (modalFileInput && modalFileInput.files.length > 0 ? modalFileInput.files[0] : null);

            if (file) {
                // Check if signature is required but not provided
                if (requiresSignature && !uploadSignature) {
                    showToast('Please add a signature before uploading');
                    return;
                }

                // Add the file with signature if required
                addAttachmentToList(file, fileDescription, labels, attachedTo, requiresSignature ? uploadSignature : null);
                uploadModal.style.display = 'none';

                // Show success message
                showToast('File uploaded successfully');

                // Reset form
                document.getElementById('fileDescription').value = '';
                if (fileLabelsInput) fileLabelsInput.value = '';
                if (fileAttachedToSelect) fileAttachedToSelect.selectedIndex = 0;
                selectedFilename.textContent = 'No file selected';

                // Reset signature
                if (requireSignatureCheckbox) {
                    requireSignatureCheckbox.checked = false;
                }
                if (uploadSignatureArea) {
                    uploadSignatureArea.style.display = 'none';
                }
                if (uploadSignatureCanvas) {
                    const ctx = uploadSignatureCanvas.getContext('2d');
                    ctx.clearRect(0, 0, uploadSignatureCanvas.width, uploadSignatureCanvas.height);
                }
                uploadSignature = null;

                // Reset the file icon
                const fileIcon = document.querySelector('.file-icon i');
                if (fileIcon) {
                    fileIcon.className = 'fas fa-file-alt';
                }

                // Reset the stored file
                currentSelectedFile = null;

                // Clear the file input
                if (modalFileInput) modalFileInput.value = '';
            } else {
                alert('Please select a file to upload');
            }
        });
    }

    // Handle label suggestions
    if (labelSuggestions && labelSuggestions.length > 0) {
        labelSuggestions.forEach(suggestion => {
            suggestion.addEventListener('click', () => {
                if (fileLabelsInput) {
                    const currentLabels = fileLabelsInput.value.trim();
                    const newLabel = suggestion.dataset.label;

                    if (currentLabels === '') {
                        fileLabelsInput.value = newLabel;
                    } else if (!currentLabels.split(',').map(l => l.trim()).includes(newLabel)) {
                        fileLabelsInput.value = currentLabels + ', ' + newLabel;
                    }
                }
            });
        });
    }

    // Handle drag and drop
    if (dropzone) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropzone.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, unhighlight, false);
        });

        function highlight() {
            dropzone.classList.add('highlight');
        }

        function unhighlight() {
            dropzone.classList.remove('highlight');
        }

        dropzone.addEventListener('drop', handleDrop, false);

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;

            if (files.length > 0) {
                // For simplicity, just handle the first file
                currentSelectedFile = files[0];

                // Show the modal for description
                uploadModal.style.display = 'flex';
                selectedFilename.textContent = currentSelectedFile.name;

                // Update the file icon based on file type
                const fileIcon = document.querySelector('.file-icon i');
                if (fileIcon) {
                    const fileTypeInfo = getFileTypeInfo(currentSelectedFile.name);
                    fileIcon.className = `fas ${fileTypeInfo.icon}`;
                }
            }
        }
    }

    // Handle file input change from the main upload area
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                // Store the file
                currentSelectedFile = e.target.files[0];

                // Show the modal for description
                uploadModal.style.display = 'flex';
                selectedFilename.textContent = currentSelectedFile.name;

                // Update the file icon based on file type
                const fileIcon = document.querySelector('.file-icon i');
                if (fileIcon) {
                    const fileTypeInfo = getFileTypeInfo(currentSelectedFile.name);
                    fileIcon.className = `fas ${fileTypeInfo.icon}`;
                }

                // Clear the file input so it can be used again
                fileInput.value = '';
            }
        });
    }

    // Handle click on the "Choose File" button in the modal
    const modalChooseFileBtn = document.querySelector('.choose-file-btn');
    if (modalChooseFileBtn) {
        modalChooseFileBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Create a new file input element each time to avoid the issue
            const newFileInput = document.createElement('input');
            newFileInput.type = 'file';
            newFileInput.accept = modalFileInput.accept;
            newFileInput.style.display = 'none';

            // Add event listener to the new file input
            newFileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    // Store the file
                    currentSelectedFile = e.target.files[0];

                    // Update the filename display
                    selectedFilename.textContent = currentSelectedFile.name;

                    // Update the file icon based on file type
                    const fileIcon = document.querySelector('.file-icon i');
                    if (fileIcon) {
                        const fileTypeInfo = getFileTypeInfo(currentSelectedFile.name);
                        fileIcon.className = `fas ${fileTypeInfo.icon}`;
                    }

                    // Remove the temporary input element
                    document.body.removeChild(newFileInput);
                }
            });

            // Add to DOM temporarily and trigger click
            document.body.appendChild(newFileInput);
            newFileInput.click();
        });
    }

    // Handle label chip clicks
    const labelChips = document.querySelectorAll('.label-chip');
    if (labelChips.length > 0) {
        labelChips.forEach(chip => {
            chip.addEventListener('click', () => {
                if (fileLabelsInput) {
                    const currentLabels = fileLabelsInput.value.trim();
                    const newLabel = chip.dataset.label;

                    if (currentLabels === '') {
                        fileLabelsInput.value = newLabel;
                    } else if (!currentLabels.split(',').map(l => l.trim()).includes(newLabel)) {
                        fileLabelsInput.value = currentLabels + ', ' + newLabel;
                    }
                }
            });
        });
    }

    // View toggle functionality
    if (listViewBtn && gridViewBtn) {
        // List view button click
        listViewBtn.addEventListener('click', () => {
            if (currentViewMode !== 'list') {
                // Update active button
                listViewBtn.classList.add('active');
                gridViewBtn.classList.remove('active');

                // Show list view, hide grid view
                listView.classList.add('active');
                gridView.classList.remove('active');

                // Update current view mode
                currentViewMode = 'list';

                showToast('Switched to list view');
            }
        });

        // Grid view button click
        gridViewBtn.addEventListener('click', () => {
            if (currentViewMode !== 'grid') {
                // Update active button
                gridViewBtn.classList.add('active');
                listViewBtn.classList.remove('active');

                // Show grid view, hide list view
                gridView.classList.add('active');
                listView.classList.remove('active');

                // Update current view mode
                currentViewMode = 'grid';

                showToast('Switched to grid view');
            }
        });
    }

    // Select all checkbox functionality
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', () => {
            const isChecked = selectAllCheckbox.checked;
            const checkboxes = document.querySelectorAll('.file-select-checkbox');

            checkboxes.forEach(checkbox => {
                checkbox.checked = isChecked;

                // Update row styling
                const row = checkbox.closest('.attachment-row');
                if (row) {
                    if (isChecked) {
                        row.classList.add('selected');
                    } else {
                        row.classList.remove('selected');
                    }
                }
            });

            // Also update grid items if in grid view
            const gridCheckboxes = document.querySelectorAll('.grid-item-select input[type="checkbox"]');
            gridCheckboxes.forEach(checkbox => {
                checkbox.checked = isChecked;

                // Update grid item styling
                const gridItem = checkbox.closest('.grid-item');
                if (gridItem) {
                    if (isChecked) {
                        gridItem.classList.add('selected');
                    } else {
                        gridItem.classList.remove('selected');
                    }
                }
            });

            if (isChecked) {
                showToast('Selected all files');
            } else {
                showToast('Deselected all files');
            }
        });
    }

    // Function to add attachment to the table and grid
    function addAttachmentToList(file, description, labels = '', attachedTo = '', signature = null) {
        // Hide empty states if visible
        if (emptyState) {
            emptyState.style.display = 'none';
        }
        if (emptyGridState) {
            emptyGridState.style.display = 'none';
        }

        // Get current date and format it
        const today = new Date();
        const creationDate = formatCreationDate(today);
        const modificationDate = formatTimeAgo(today);

        // Format file size
        const fileSize = formatFileSize(file.size);

        // Get file type icon
        const fileTypeInfo = getFileTypeInfo(file.name);

        // Format labels
        const labelsHtml = formatLabels(labels);

        // Format attached to reference
        const attachedToHtml = formatAttachedTo(attachedTo);

        // Store the file in our uploadedFiles object with a unique ID
        const fileId = 'file_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
        uploadedFiles[fileId] = {
            file: file,
            name: file.name,
            description: description || '',
            type: file.type,
            labels: labels,
            attachedTo: attachedTo,
            creationDate: creationDate,
            modificationDate: modificationDate,
            size: fileSize,
            signature: signature,
            signatureDate: signature ? formatCreationDate(today) : null,
            creator: 'Admin'
        };

        // 1. Create a new table row for list view
        const newRow = document.createElement('tr');
        newRow.className = 'attachment-row';
        newRow.dataset.fileId = fileId;

        // Create row HTML
        newRow.innerHTML = `
            <td class="select-col">
                <input type="checkbox" class="file-select-checkbox">
            </td>
            <td class="view-col">
                <button class="action-btn view-btn" title="View file">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
            <td class="filename-col">
                <div class="file-info-cell">
                    <div class="file-type-icon ${fileTypeInfo.class}">
                        <i class="fas ${fileTypeInfo.icon}"></i>
                    </div>
                    <span>${file.name}</span>
                </div>
            </td>
            <td class="size-col">${fileSize}</td>
            <td class="creator-col">Admin</td>
            <td class="creation-date-col">${creationDate}</td>
            <td class="modification-date-col">${modificationDate}</td>
            <td class="labels-col">${labelsHtml}</td>
            <td class="signature-col">
                ${signature ?
                    `<button class="signature-status signed" title="View signature">
                        <i class="fas fa-signature"></i>
                    </button>` :
                    `<button class="signature-status unsigned" title="Add signature">
                        <i class="fas fa-pen-alt"></i>
                    </button>`
                }
            </td>
            <td class="attached-to-col">${attachedToHtml}</td>
        `;

        // 2. Create a grid item for grid view
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';
        gridItem.dataset.fileId = fileId;

        // Determine if we should show an image preview
        let previewHtml = '';
        if (file.type.startsWith('image/')) {
            previewHtml = `<img src="${URL.createObjectURL(file)}" alt="${file.name}">`;
        } else {
            previewHtml = `
                <div class="file-type-icon ${fileTypeInfo.class}">
                    <i class="fas ${fileTypeInfo.icon}"></i>
                </div>
            `;
        }

        // Create grid item HTML
        gridItem.innerHTML = `
            <div class="grid-item-select">
                <input type="checkbox" class="file-select-checkbox">
            </div>
            <div class="grid-item-preview">
                ${previewHtml}
                <div class="grid-item-actions">
                    <button class="action-btn view-btn" title="View file">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="grid-item-info">
                <div class="grid-item-title">${file.name}</div>
                <div class="grid-item-meta">
                    <div>${fileSize} • ${creationDate}</div>
                    <div>${labelsHtml}</div>
                </div>
            </div>
        `;

        // Add event listeners to list view elements
        const viewBtn = newRow.querySelector('.view-btn');
        if (viewBtn) {
            viewBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                openFileViewer(fileId);
                showToast('Opening file: ' + file.name);
            });
        }

        const checkbox = newRow.querySelector('.file-select-checkbox');
        if (checkbox) {
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    newRow.classList.add('selected');
                } else {
                    newRow.classList.remove('selected');
                }

                // Also update the corresponding grid item checkbox if it exists
                const gridCheckbox = document.querySelector(`.grid-item[data-file-id="${fileId}"] .file-select-checkbox`);
                if (gridCheckbox) {
                    gridCheckbox.checked = checkbox.checked;

                    // Update grid item styling
                    const gridItem = gridCheckbox.closest('.grid-item');
                    if (gridItem) {
                        if (checkbox.checked) {
                            gridItem.classList.add('selected');
                        } else {
                            gridItem.classList.remove('selected');
                        }
                    }
                }
            });
        }

        // Add event listeners to grid view elements
        const gridViewBtn = gridItem.querySelector('.view-btn');
        if (gridViewBtn) {
            gridViewBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                openFileViewer(fileId);
                showToast('Opening file: ' + file.name);
            });
        }

        // Add event listener to signature button
        const signatureBtn = newRow.querySelector('.signature-status');
        if (signatureBtn) {
            signatureBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                openSignatureModal(fileId);
            });
        }

        const gridCheckbox = gridItem.querySelector('.file-select-checkbox');
        if (gridCheckbox) {
            gridCheckbox.addEventListener('change', () => {
                if (gridCheckbox.checked) {
                    gridItem.classList.add('selected');
                } else {
                    gridItem.classList.remove('selected');
                }

                // Also update the corresponding list view checkbox if it exists
                const listCheckbox = document.querySelector(`.attachment-row[data-file-id="${fileId}"] .file-select-checkbox`);
                if (listCheckbox) {
                    listCheckbox.checked = gridCheckbox.checked;

                    // Update row styling
                    const row = listCheckbox.closest('.attachment-row');
                    if (row) {
                        if (gridCheckbox.checked) {
                            row.classList.add('selected');
                        } else {
                            row.classList.remove('selected');
                        }
                    }
                }
            });
        }

        // Make the entire grid item clickable to view the file
        gridItem.addEventListener('click', (e) => {
            // Only trigger if the click wasn't on a checkbox or button
            if (!e.target.closest('.file-select-checkbox') && !e.target.closest('.action-btn')) {
                openFileViewer(fileId);
                showToast('Opening file: ' + file.name);
            }
        });

        // Append to table body and grid container
        if (attachmentTableBody) {
            attachmentTableBody.appendChild(newRow);
        }

        if (attachmentGridContainer) {
            attachmentGridContainer.appendChild(gridItem);
        }

        // Update pagination info
        updatePaginationInfo();

        // Show success toast
        showToast('File added: ' + file.name);
    }



    // Function to update pagination info
    function updatePaginationInfo() {
        const attachmentRows = attachmentTableBody.querySelectorAll('.attachment-row:not([style*="display: none"])');
        const count = attachmentRows.length;

        if (paginationInfo) {
            if (count === 0) {
                paginationInfo.textContent = 'No records to view';
            } else {
                paginationInfo.textContent = `View 1-${count} of ${count}`;
            }
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

    // Helper function to get file type info
    function getFileTypeInfo(filename) {
        const extension = filename.split('.').pop().toLowerCase();

        if (['pdf'].includes(extension)) {
            return { class: 'pdf', icon: 'fa-file-pdf' };
        } else if (['doc', 'docx'].includes(extension)) {
            return { class: 'word', icon: 'fa-file-word' };
        } else if (['xls', 'xlsx', 'csv'].includes(extension)) {
            return { class: 'excel', icon: 'fa-file-excel' };
        } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(extension)) {
            return { class: 'image', icon: 'fa-file-image' };
        } else if (['txt', 'md', 'json', 'xml', 'html', 'css', 'js'].includes(extension)) {
            return { class: 'text', icon: 'fa-file-alt' };
        } else {
            return { class: 'text', icon: 'fa-file' };
        }
    }

    // Helper function to format labels
    function formatLabels(labels) {
        if (!labels || labels.trim() === '') {
            return '<span class="no-labels">No labels</span>';
        }

        return labels.split(',')
            .map(label => label.trim())
            .filter(label => label !== '')
            .map(label => `<span class="label">${label}</span>`)
            .join(' ');
    }

    // Helper function to format attached to reference
    function formatAttachedTo(attachedTo) {
        if (!attachedTo || attachedTo.trim() === '') {
            return '';
        }

        const referenceName = referenceDocuments[attachedTo] || attachedTo;
        return `<div class="attached-reference"><i class="fas fa-file-alt"></i> ${referenceName}</div>`;
    }

    // Helper function to format creation date (Apr 08, 2020)
    function formatCreationDate(date) {
        const day = date.getDate().toString().padStart(2, '0');
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();

        return `${month} ${day}, ${year}`;
    }

    // Helper function to format time ago (2 minutes ago)
    function formatTimeAgo(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffSec = Math.round(diffMs / 1000);
        const diffMin = Math.round(diffSec / 60);
        const diffHour = Math.round(diffMin / 60);
        const diffDay = Math.round(diffHour / 24);

        if (diffMin < 1) {
            return 'just now';
        } else if (diffMin < 60) {
            return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
        } else if (diffHour < 24) {
            return `${diffHour} hour${diffHour === 1 ? '' : 's'} ago`;
        } else {
            return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;
        }
    }

    // Function to apply filters
    function applyFilters() {
        const fileTypeValue = fileTypeFilter ? fileTypeFilter.value.toLowerCase() : '';
        const labelValue = labelFilter ? labelFilter.value.toLowerCase() : '';
        const sortValue = sortFilter ? sortFilter.value : 'newest';

        // Get all rows and convert to array for sorting
        const rowsNodeList = attachmentTableBody.querySelectorAll('.attachment-row:not(.empty-row)');
        const rows = Array.from(rowsNodeList);
        let visibleCount = 0;

        // First filter the rows
        rows.forEach(row => {
            const fileName = row.querySelector('.filename-col span').textContent.toLowerCase();
            const fileExtension = fileName.split('.').pop();
            const labelsCell = row.querySelector('.labels-col').textContent.toLowerCase();

            let showRow = true;

            // Apply file type filter
            if (fileTypeValue) {
                const allowedExtensions = fileTypeValue.split(',');
                let matchesFileType = false;

                for (const ext of allowedExtensions) {
                    if (fileExtension === ext.trim()) {
                        matchesFileType = true;
                        break;
                    }
                }

                if (!matchesFileType) {
                    showRow = false;
                }
            }

            // Apply label filter
            if (labelValue && !labelsCell.includes(labelValue)) {
                showRow = false;
            }

            // Set visibility
            if (showRow) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });

        // Now sort the visible rows
        const visibleRows = rows.filter(row => row.style.display !== 'none');

        if (visibleRows.length > 0) {
            // Sort based on selected option
            visibleRows.sort((a, b) => {
                switch (sortValue) {
                    case 'newest':
                        // Sort by creation date (newest first)
                        const dateA = new Date(a.querySelector('.creation-date-col').textContent);
                        const dateB = new Date(b.querySelector('.creation-date-col').textContent);
                        return dateB - dateA;

                    case 'oldest':
                        // Sort by creation date (oldest first)
                        const dateC = new Date(a.querySelector('.creation-date-col').textContent);
                        const dateD = new Date(b.querySelector('.creation-date-col').textContent);
                        return dateC - dateD;

                    case 'name_asc':
                        // Sort by name (A-Z)
                        const nameA = a.querySelector('.filename-col span').textContent.toLowerCase();
                        const nameB = b.querySelector('.filename-col span').textContent.toLowerCase();
                        return nameA.localeCompare(nameB);

                    case 'name_desc':
                        // Sort by name (Z-A)
                        const nameC = a.querySelector('.filename-col span').textContent.toLowerCase();
                        const nameD = b.querySelector('.filename-col span').textContent.toLowerCase();
                        return nameD.localeCompare(nameC);

                    case 'size_asc':
                        // Sort by size (smallest first)
                        const sizeA = parseSizeToBytes(a.querySelector('.size-col').textContent);
                        const sizeB = parseSizeToBytes(b.querySelector('.size-col').textContent);
                        return sizeA - sizeB;

                    case 'size_desc':
                        // Sort by size (largest first)
                        const sizeC = parseSizeToBytes(a.querySelector('.size-col').textContent);
                        const sizeD = parseSizeToBytes(b.querySelector('.size-col').textContent);
                        return sizeD - sizeC;

                    default:
                        return 0;
                }
            });

            // Reorder the rows in the DOM
            visibleRows.forEach(row => {
                attachmentTableBody.appendChild(row);
            });
        }

        // Update pagination info
        if (paginationInfo) {
            if (visibleCount === 0) {
                paginationInfo.textContent = 'No records to view';
            } else {
                paginationInfo.textContent = `View 1-${visibleCount} of ${visibleCount}`;
            }
        }

        // Show/hide empty state
        if (emptyState) {
            if (visibleCount === 0 && rows.length > 0) { // Only show if there are actual rows but none match
                emptyState.style.display = '';
                emptyState.querySelector('.empty-message').innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-filter"></i>
                        <p>No matching records found</p>
                    </div>
                `;
            } else if (visibleCount > 0) {
                emptyState.style.display = 'none';
            }
        }
    }

    // Helper function to parse size string to bytes for sorting
    function parseSizeToBytes(sizeStr) {
        const sizeRegex = /^([\d.]+)\s*([KMGT]?B)$/i;
        const match = sizeStr.match(sizeRegex);

        if (!match) return 0;

        const size = parseFloat(match[1]);
        const unit = match[2].toUpperCase();

        switch (unit) {
            case 'KB': return size * 1024;
            case 'MB': return size * 1024 * 1024;
            case 'GB': return size * 1024 * 1024 * 1024;
            case 'TB': return size * 1024 * 1024 * 1024 * 1024;
            default: return size;
        }
    }

    // Function to clear all filters
    function clearAllFilters() {
        if (fileTypeFilter) fileTypeFilter.selectedIndex = 0;
        if (labelFilter) labelFilter.selectedIndex = 0;
        if (sortFilter) sortFilter.selectedIndex = 0; // Reset to "Latest"
        applyFilters();
    }

    // Add clear all filters button functionality
    const clearAllFiltersBtn = document.getElementById('clearAllFilters');
    if (clearAllFiltersBtn) {
        clearAllFiltersBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            clearAllFilters();

            // Show feedback toast
            showToast('Filters reset successfully');
        });
    }

    // Add apply filters button functionality
    const applyFiltersBtn = document.getElementById('applyFilters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            applyFilters();

            // Show feedback toast
            showToast('Filters applied');
        });
    }

    // Function to show toast notification
    function showToast(message) {
        // Create toast element if it doesn't exist
        let toast = document.getElementById('toast-notification');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast-notification';
            toast.className = 'toast-notification';
            document.body.appendChild(toast);
        }

        // Set message and show toast
        toast.textContent = message;
        toast.classList.add('show');

        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Add change event listeners for select dropdowns - apply filters automatically on change
    if (fileTypeFilter) {
        fileTypeFilter.addEventListener('change', () => {
            applyFilters();
        });
    }

    if (labelFilter) {
        labelFilter.addEventListener('change', () => {
            applyFilters();
        });
    }

    if (sortFilter) {
        sortFilter.addEventListener('change', () => {
            applyFilters();
        });
    }

    // Add event listeners for pagination controls
    const refreshBtn = document.querySelector('.refresh-btn');
    const firstPageBtn = document.querySelector('.first-page');
    const prevPageBtn = document.querySelector('.prev-page');
    const nextPageBtn = document.querySelector('.next-page');
    const lastPageBtn = document.querySelector('.last-page');

    // Refresh button functionality
    if (refreshBtn) {
        refreshBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // In a real app, this would refresh the attachment list from the server
            refreshBtn.classList.add('rotating');

            // Apply filters to refresh the view
            applyFilters();

            // Simulate refresh delay
            setTimeout(() => {
                refreshBtn.classList.remove('rotating');
                showToast('Attachment list refreshed');
            }, 800);
        });
    }

    // Download selected files button
    const downloadSelectedBtn = document.querySelector('.download-selected-btn');
    if (downloadSelectedBtn) {
        downloadSelectedBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Find all selected files (either in list or grid view)
            const selectedCheckboxes = document.querySelectorAll('.file-select-checkbox:checked');
            let downloadCount = 0;

            // Create a Set to track which files we've already processed
            const processedFileIds = new Set();

            selectedCheckboxes.forEach(checkbox => {
                // Find the parent row or grid item
                const container = checkbox.closest('.attachment-row') || checkbox.closest('.grid-item');
                if (container) {
                    const fileId = container.dataset.fileId;

                    // Only process each file once (might be selected in both views)
                    if (fileId && uploadedFiles[fileId] && !processedFileIds.has(fileId)) {
                        downloadFile(fileId);
                        downloadCount++;
                        processedFileIds.add(fileId);
                    }
                }
            });

            if (downloadCount > 0) {
                showToast(`Downloading ${downloadCount} selected file(s)`);
            } else {
                showToast('No files selected for download');
            }
        });
    }

    // Delete selected files button
    const deleteSelectedBtn = document.querySelector('.delete-selected-btn');
    if (deleteSelectedBtn) {
        deleteSelectedBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Find all selected files (either in list or grid view)
            const selectedCheckboxes = document.querySelectorAll('.file-select-checkbox:checked');
            let deleteCount = 0;

            // Create a Set to track which files we've already processed
            const processedFileIds = new Set();

            // Collect all file IDs to delete
            const fileIdsToDelete = [];

            selectedCheckboxes.forEach(checkbox => {
                // Find the parent row or grid item
                const container = checkbox.closest('.attachment-row') || checkbox.closest('.grid-item');
                if (container) {
                    const fileId = container.dataset.fileId;

                    // Only process each file once (might be selected in both views)
                    if (fileId && uploadedFiles[fileId] && !processedFileIds.has(fileId)) {
                        fileIdsToDelete.push(fileId);
                        processedFileIds.add(fileId);
                    }
                }
            });

            // If we have files to delete, confirm with the user
            if (fileIdsToDelete.length > 0) {
                if (confirm(`Are you sure you want to delete ${fileIdsToDelete.length} selected file(s)?`)) {
                    // Delete the files
                    fileIdsToDelete.forEach(fileId => {
                        // Remove from list view
                        const row = document.querySelector(`.attachment-row[data-file-id="${fileId}"]`);
                        if (row) {
                            row.remove();
                        }

                        // Remove from grid view
                        const gridItem = document.querySelector(`.grid-item[data-file-id="${fileId}"]`);
                        if (gridItem) {
                            gridItem.remove();
                        }

                        // In a real app, this would send a delete request to the server
                        delete uploadedFiles[fileId];
                        deleteCount++;
                    });

                    showToast(`Deleted ${deleteCount} file(s)`);

                    // Check if we need to show empty states
                    const remainingRows = attachmentTableBody.querySelectorAll('.attachment-row:not([style*="display: none"])');
                    if (remainingRows.length === 0) {
                        if (emptyState) {
                            emptyState.style.display = '';
                        }
                        if (emptyGridState) {
                            emptyGridState.style.display = '';
                        }
                    }

                    updatePaginationInfo();
                }
            } else {
                showToast('No files selected for deletion');
            }
        });
    }

    // Pagination buttons (for demonstration)
    if (firstPageBtn) {
        firstPageBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showToast('Navigating to first page');
        });
    }

    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showToast('Navigating to previous page');
        });
    }

    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showToast('Navigating to next page');
        });
    }

    if (lastPageBtn) {
        lastPageBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showToast('Navigating to last page');
        });
    }

    // File viewer functionality
    if (closeViewerBtn) {
        closeViewerBtn.addEventListener('click', () => {
            fileViewerModal.style.display = 'none';
        });
    }

    if (closeViewerFooterBtn) {
        closeViewerFooterBtn.addEventListener('click', () => {
            fileViewerModal.style.display = 'none';
        });
    }

    if (fileViewerModal) {
        fileViewerModal.addEventListener('click', (e) => {
            if (e.target === fileViewerModal) {
                fileViewerModal.style.display = 'none';
            }
        });
    }

    if (downloadViewedFileBtn) {
        downloadViewedFileBtn.addEventListener('click', () => {
            const fileId = fileViewerModal.dataset.currentFileId;
            if (fileId && uploadedFiles[fileId]) {
                downloadFile(fileId);
                showToast('Downloading file: ' + uploadedFiles[fileId].name);
            }
        });
    }

    // Add print functionality
    const printViewedFileBtn = document.getElementById('printViewedFileBtn');
    if (printViewedFileBtn) {
        printViewedFileBtn.addEventListener('click', () => {
            const fileId = fileViewerModal.dataset.currentFileId;
            if (fileId && uploadedFiles[fileId]) {
                // Create a new window for printing
                const printWindow = window.open('', '_blank');
                const file = uploadedFiles[fileId];

                if (file.type.startsWith('image/')) {
                    // For images
                    printWindow.document.write(`
                        <html>
                            <head>
                                <title>Print: ${file.name}</title>
                                <style>
                                    body { margin: 0; display: flex; justify-content: center; }
                                    img { max-width: 100%; max-height: 100vh; }
                                </style>
                            </head>
                            <body>
                                <img src="${URL.createObjectURL(file.file)}" alt="${file.name}">
                                <script>
                                    window.onload = function() { window.print(); window.close(); }
                                </script>
                            </body>
                        </html>
                    `);
                } else {
                    // For other file types, just show file info
                    printWindow.document.write(`
                        <html>
                            <head>
                                <title>Print: ${file.name}</title>
                                <style>
                                    body { font-family: Arial, sans-serif; padding: 20px; }
                                    .file-info { border: 1px solid #ccc; padding: 20px; border-radius: 5px; }
                                    h1 { margin-top: 0; }
                                </style>
                            </head>
                            <body>
                                <div class="file-info">
                                    <h1>${file.name}</h1>
                                    <p>Type: ${file.type || 'Unknown'}</p>
                                    <p>Size: ${formatFileSize(file.file.size)}</p>
                                    <p>Description: ${file.description || 'No description'}</p>
                                </div>
                                <script>
                                    window.onload = function() { window.print(); window.close(); }
                                </script>
                            </body>
                        </html>
                    `);
                }

                printWindow.document.close();
                showToast('Printing file: ' + file.name);
            }
        });
    }

    // Function to open file viewer
    function openFileViewer(fileId) {
        if (!uploadedFiles[fileId]) {
            console.error('File not found');
            return;
        }

        const fileData = uploadedFiles[fileId];

        // Set the current file ID on the modal
        fileViewerModal.dataset.currentFileId = fileId;

        // Update the file name in the header
        if (viewerFileName) {
            viewerFileName.textContent = fileData.name;
        }

        // Clear previous content
        if (fileViewerContainer) {
            fileViewerContainer.innerHTML = `
                <div class="file-viewer-placeholder">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Loading file...</p>
                </div>
            `;
        }

        // Show the modal
        fileViewerModal.style.display = 'flex';

        // Read and display the file based on its type
        setTimeout(() => {
            displayFile(fileId);
        }, 500); // Small delay for better UX
    }

    // Function to display file content
    function displayFile(fileId) {
        if (!uploadedFiles[fileId] || !fileViewerContainer) return;

        const fileData = uploadedFiles[fileId];
        const file = fileData.file;
        const reader = new FileReader();

        reader.onload = function(e) {
            const result = e.target.result;

            // Handle different file types
            if (file.type.startsWith('image/')) {
                // Image file
                fileViewerContainer.innerHTML = `
                    <img src="${result}" alt="${file.name}" class="file-viewer-image">
                `;
            } else if (file.type === 'application/pdf') {
                // PDF file
                fileViewerContainer.innerHTML = `
                    <iframe src="${result}" class="file-viewer-pdf" title="${file.name}"></iframe>
                `;
            } else if (file.type.startsWith('text/') ||
                      file.type === 'application/json' ||
                      file.type === 'application/xml') {
                // Text file
                fileViewerContainer.innerHTML = `
                    <pre class="file-viewer-text">${escapeHtml(result)}</pre>
                `;
            } else if (file.type.includes('word') ||
                      file.type.includes('document') ||
                      file.name.endsWith('.doc') ||
                      file.name.endsWith('.docx')) {
                // Word documents - provide a preview with document viewer
                const objectUrl = URL.createObjectURL(file);

                // Create a document preview with fallback options
                fileViewerContainer.innerHTML = `
                    <div class="document-preview-container">
                        <div class="document-preview-header">
                            <div class="document-icon word">
                                <i class="fas fa-file-word"></i>
                            </div>
                            <div class="document-title">
                                <h3>${file.name}</h3>
                                <p>Microsoft Word Document • ${formatFileSize(file.size)}</p>
                            </div>
                        </div>
                        <div class="document-preview-frame" id="documentPreviewFrame">
                            <div class="document-preview-loading">
                                <div class="loading-spinner"></div>
                                <p>Loading document preview...</p>
                            </div>
                        </div>
                        <div class="document-preview-actions">
                            <button class="btn btn-primary download-document-btn" data-file-id="${fileId}">
                                <i class="fas fa-download"></i> Download Document
                            </button>
                            <button class="btn btn-accent preview-toggle-btn" data-mode="google" title="Toggle preview mode">
                                <i class="fas fa-sync-alt"></i> Try Different Viewer
                            </button>
                        </div>
                    </div>
                `;

                // Function to load document preview with different viewers
                const loadDocumentPreview = (viewerType) => {
                    const previewFrame = document.getElementById('documentPreviewFrame');
                    if (!previewFrame) return;

                    // Show loading state
                    previewFrame.innerHTML = `
                        <div class="document-preview-loading">
                            <div class="loading-spinner"></div>
                            <p>Loading document preview...</p>
                        </div>
                    `;

                    // Create iframe for preview
                    const iframe = document.createElement('iframe');
                    iframe.className = 'office-viewer';
                    iframe.title = file.name;

                    // Set up error handling
                    iframe.onerror = function() {
                        showFallbackPreview();
                    };

                    // Set up load event to detect if iframe loaded successfully
                    iframe.onload = function() {
                        // Add a timeout to check if the preview loaded correctly
                        setTimeout(() => {
                            try {
                                // Try to access iframe content - if it fails, show fallback
                                if (iframe.contentDocument &&
                                    iframe.contentDocument.body &&
                                    iframe.contentDocument.body.innerHTML.includes('error')) {
                                    showFallbackPreview();
                                }
                            } catch (e) {
                                // If we can't access iframe content due to CORS, assume it's working
                                console.log('Preview iframe loaded, but content not accessible due to CORS');
                            }
                        }, 2000);
                    };

                    // Set the appropriate viewer URL based on type
                    if (viewerType === 'google') {
                        iframe.src = `https://docs.google.com/viewer?embedded=true&url=${encodeURIComponent(window.location.href.split('/').slice(0, -1).join('/') + '/viewer-proxy.html?file=' + objectUrl)}`;
                    } else {
                        iframe.src = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(window.location.href.split('/').slice(0, -1).join('/') + '/viewer-proxy.html?file=' + objectUrl)}`;
                    }

                    // Replace loading indicator with iframe
                    previewFrame.innerHTML = '';
                    previewFrame.appendChild(iframe);

                    // Set up error detection - if iframe fails to load properly
                    setTimeout(() => {
                        if (previewFrame.querySelector('.office-viewer') &&
                            (!previewFrame.querySelector('.office-viewer').contentDocument ||
                             previewFrame.querySelector('.office-viewer').contentDocument.body.innerHTML === '')) {
                            showFallbackPreview();
                        }
                    }, 5000);
                };

                // Function to show fallback preview when viewers fail
                const showFallbackPreview = () => {
                    const previewFrame = document.getElementById('documentPreviewFrame');
                    if (!previewFrame) return;

                    previewFrame.innerHTML = `
                        <div class="document-fallback-preview">
                            <div class="document-preview-icon">
                                <i class="fas fa-file-word fa-4x"></i>
                            </div>
                            <h3>Document Preview Not Available</h3>
                            <p>We're unable to generate a preview for this document.</p>
                            <p class="document-preview-tip">You can download the document to view it in Microsoft Word or another compatible application.</p>
                            <button class="btn btn-primary download-now-btn" data-file-id="${fileId}">
                                <i class="fas fa-download"></i> Download Now
                            </button>
                        </div>
                    `;

                    // Add event listener to the download button in fallback view
                    const downloadNowBtn = previewFrame.querySelector('.download-now-btn');
                    if (downloadNowBtn) {
                        downloadNowBtn.addEventListener('click', () => {
                            downloadFile(fileId);
                            showToast('Downloading document: ' + file.name);
                        });
                    }
                };

                // Add event listeners to the buttons
                setTimeout(() => {
                    const downloadBtn = fileViewerContainer.querySelector('.download-document-btn');
                    if (downloadBtn) {
                        downloadBtn.addEventListener('click', () => {
                            const fileId = downloadBtn.getAttribute('data-file-id');
                            if (fileId) {
                                downloadFile(fileId);
                                showToast('Downloading document: ' + file.name);
                            }
                        });
                    }

                    const toggleBtn = fileViewerContainer.querySelector('.preview-toggle-btn');
                    if (toggleBtn) {
                        toggleBtn.addEventListener('click', () => {
                            const currentMode = toggleBtn.getAttribute('data-mode');
                            const newMode = currentMode === 'google' ? 'office' : 'google';
                            toggleBtn.setAttribute('data-mode', newMode);
                            loadDocumentPreview(newMode);
                        });
                    }
                }, 100);

                // Initial load with Microsoft viewer
                loadDocumentPreview('office');
            } else if (file.type.includes('excel') ||
                      file.type.includes('spreadsheet') ||
                      file.name.endsWith('.xls') ||
                      file.name.endsWith('.xlsx') ||
                      file.name.endsWith('.csv')) {
                // Excel documents - provide a preview with document viewer
                const objectUrl = URL.createObjectURL(file);

                // Create a document preview with fallback options
                fileViewerContainer.innerHTML = `
                    <div class="document-preview-container">
                        <div class="document-preview-header">
                            <div class="document-icon excel">
                                <i class="fas fa-file-excel"></i>
                            </div>
                            <div class="document-title">
                                <h3>${file.name}</h3>
                                <p>Spreadsheet Document • ${formatFileSize(file.size)}</p>
                            </div>
                        </div>
                        <div class="document-preview-frame" id="spreadsheetPreviewFrame">
                            <div class="document-preview-loading">
                                <div class="loading-spinner"></div>
                                <p>Loading spreadsheet preview...</p>
                            </div>
                        </div>
                        <div class="document-preview-actions">
                            <button class="btn btn-primary download-document-btn" data-file-id="${fileId}">
                                <i class="fas fa-download"></i> Download Spreadsheet
                            </button>
                            <button class="btn btn-accent preview-toggle-btn" data-mode="google" title="Toggle preview mode">
                                <i class="fas fa-sync-alt"></i> Try Different Viewer
                            </button>
                        </div>
                    </div>
                `;

                // Function to load spreadsheet preview with different viewers
                const loadSpreadsheetPreview = (viewerType) => {
                    const previewFrame = document.getElementById('spreadsheetPreviewFrame');
                    if (!previewFrame) return;

                    // Show loading state
                    previewFrame.innerHTML = `
                        <div class="document-preview-loading">
                            <div class="loading-spinner"></div>
                            <p>Loading spreadsheet preview...</p>
                        </div>
                    `;

                    // Create iframe for preview
                    const iframe = document.createElement('iframe');
                    iframe.className = 'office-viewer';
                    iframe.title = file.name;

                    // Set up error handling
                    iframe.onerror = function() {
                        showFallbackPreview();
                    };

                    // Set up load event to detect if iframe loaded successfully
                    iframe.onload = function() {
                        // Add a timeout to check if the preview loaded correctly
                        setTimeout(() => {
                            try {
                                // Try to access iframe content - if it fails, show fallback
                                if (iframe.contentDocument &&
                                    iframe.contentDocument.body &&
                                    iframe.contentDocument.body.innerHTML.includes('error')) {
                                    showFallbackPreview();
                                }
                            } catch (e) {
                                // If we can't access iframe content due to CORS, assume it's working
                                console.log('Preview iframe loaded, but content not accessible due to CORS');
                            }
                        }, 2000);
                    };

                    // Set the appropriate viewer URL based on type
                    if (viewerType === 'google') {
                        iframe.src = `https://docs.google.com/viewer?embedded=true&url=${encodeURIComponent(window.location.href.split('/').slice(0, -1).join('/') + '/viewer-proxy.html?file=' + objectUrl)}`;
                    } else {
                        iframe.src = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(window.location.href.split('/').slice(0, -1).join('/') + '/viewer-proxy.html?file=' + objectUrl)}`;
                    }

                    // Replace loading indicator with iframe
                    previewFrame.innerHTML = '';
                    previewFrame.appendChild(iframe);

                    // Set up error detection - if iframe fails to load properly
                    setTimeout(() => {
                        if (previewFrame.querySelector('.office-viewer') &&
                            (!previewFrame.querySelector('.office-viewer').contentDocument ||
                             previewFrame.querySelector('.office-viewer').contentDocument.body.innerHTML === '')) {
                            showFallbackPreview();
                        }
                    }, 5000);
                };

                // Function to show fallback preview when viewers fail
                const showFallbackPreview = () => {
                    const previewFrame = document.getElementById('spreadsheetPreviewFrame');
                    if (!previewFrame) return;

                    previewFrame.innerHTML = `
                        <div class="document-fallback-preview">
                            <div class="document-preview-icon">
                                <i class="fas fa-file-excel fa-4x"></i>
                            </div>
                            <h3>Spreadsheet Preview Not Available</h3>
                            <p>We're unable to generate a preview for this spreadsheet.</p>
                            <p class="document-preview-tip">You can download the file to view it in Microsoft Excel or another compatible application.</p>
                            <button class="btn btn-primary download-now-btn" data-file-id="${fileId}">
                                <i class="fas fa-download"></i> Download Now
                            </button>
                        </div>
                    `;

                    // Add event listener to the download button in fallback view
                    const downloadNowBtn = previewFrame.querySelector('.download-now-btn');
                    if (downloadNowBtn) {
                        downloadNowBtn.addEventListener('click', () => {
                            downloadFile(fileId);
                            showToast('Downloading spreadsheet: ' + file.name);
                        });
                    }
                };

                // Add event listeners to the buttons
                setTimeout(() => {
                    const downloadBtn = fileViewerContainer.querySelector('.download-document-btn');
                    if (downloadBtn) {
                        downloadBtn.addEventListener('click', () => {
                            const fileId = downloadBtn.getAttribute('data-file-id');
                            if (fileId) {
                                downloadFile(fileId);
                                showToast('Downloading spreadsheet: ' + file.name);
                            }
                        });
                    }

                    const toggleBtn = fileViewerContainer.querySelector('.preview-toggle-btn');
                    if (toggleBtn) {
                        toggleBtn.addEventListener('click', () => {
                            const currentMode = toggleBtn.getAttribute('data-mode');
                            const newMode = currentMode === 'google' ? 'office' : 'google';
                            toggleBtn.setAttribute('data-mode', newMode);
                            loadSpreadsheetPreview(newMode);
                        });
                    }
                }, 100);

                // Initial load with Microsoft viewer
                loadSpreadsheetPreview('office');
            } else if (file.name.endsWith('.ppt') || file.name.endsWith('.pptx') || file.type.includes('presentation')) {
                // PowerPoint documents - provide a preview with document viewer
                const objectUrl = URL.createObjectURL(file);

                // Create a document preview with fallback options
                fileViewerContainer.innerHTML = `
                    <div class="document-preview-container">
                        <div class="document-preview-header">
                            <div class="document-icon powerpoint">
                                <i class="fas fa-file-powerpoint"></i>
                            </div>
                            <div class="document-title">
                                <h3>${file.name}</h3>
                                <p>PowerPoint Presentation • ${formatFileSize(file.size)}</p>
                            </div>
                        </div>
                        <div class="document-preview-frame" id="presentationPreviewFrame">
                            <div class="document-preview-loading">
                                <div class="loading-spinner"></div>
                                <p>Loading presentation preview...</p>
                            </div>
                        </div>
                        <div class="document-preview-actions">
                            <button class="btn btn-primary download-document-btn" data-file-id="${fileId}">
                                <i class="fas fa-download"></i> Download Presentation
                            </button>
                            <button class="btn btn-accent preview-toggle-btn" data-mode="google" title="Toggle preview mode">
                                <i class="fas fa-sync-alt"></i> Try Different Viewer
                            </button>
                        </div>
                    </div>
                `;

                // Function to load presentation preview with different viewers
                const loadPresentationPreview = (viewerType) => {
                    const previewFrame = document.getElementById('presentationPreviewFrame');
                    if (!previewFrame) return;

                    // Show loading state
                    previewFrame.innerHTML = `
                        <div class="document-preview-loading">
                            <div class="loading-spinner"></div>
                            <p>Loading presentation preview...</p>
                        </div>
                    `;

                    // Create iframe for preview
                    const iframe = document.createElement('iframe');
                    iframe.className = 'office-viewer';
                    iframe.title = file.name;

                    // Set up error handling
                    iframe.onerror = function() {
                        showFallbackPreview();
                    };

                    // Set up load event to detect if iframe loaded successfully
                    iframe.onload = function() {
                        // Add a timeout to check if the preview loaded correctly
                        setTimeout(() => {
                            try {
                                // Try to access iframe content - if it fails, show fallback
                                if (iframe.contentDocument &&
                                    iframe.contentDocument.body &&
                                    iframe.contentDocument.body.innerHTML.includes('error')) {
                                    showFallbackPreview();
                                }
                            } catch (e) {
                                // If we can't access iframe content due to CORS, assume it's working
                                console.log('Preview iframe loaded, but content not accessible due to CORS');
                            }
                        }, 2000);
                    };

                    // Set the appropriate viewer URL based on type
                    if (viewerType === 'google') {
                        iframe.src = `https://docs.google.com/viewer?embedded=true&url=${encodeURIComponent(window.location.href.split('/').slice(0, -1).join('/') + '/viewer-proxy.html?file=' + objectUrl)}`;
                    } else {
                        iframe.src = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(window.location.href.split('/').slice(0, -1).join('/') + '/viewer-proxy.html?file=' + objectUrl)}`;
                    }

                    // Replace loading indicator with iframe
                    previewFrame.innerHTML = '';
                    previewFrame.appendChild(iframe);

                    // Set up error detection - if iframe fails to load properly
                    setTimeout(() => {
                        if (previewFrame.querySelector('.office-viewer') &&
                            (!previewFrame.querySelector('.office-viewer').contentDocument ||
                             previewFrame.querySelector('.office-viewer').contentDocument.body.innerHTML === '')) {
                            showFallbackPreview();
                        }
                    }, 5000);
                };

                // Function to show fallback preview when viewers fail
                const showFallbackPreview = () => {
                    const previewFrame = document.getElementById('presentationPreviewFrame');
                    if (!previewFrame) return;

                    previewFrame.innerHTML = `
                        <div class="document-fallback-preview">
                            <div class="document-preview-icon">
                                <i class="fas fa-file-powerpoint fa-4x"></i>
                            </div>
                            <h3>Presentation Preview Not Available</h3>
                            <p>We're unable to generate a preview for this presentation.</p>
                            <p class="document-preview-tip">You can download the file to view it in Microsoft PowerPoint or another compatible application.</p>
                            <button class="btn btn-primary download-now-btn" data-file-id="${fileId}">
                                <i class="fas fa-download"></i> Download Now
                            </button>
                        </div>
                    `;

                    // Add event listener to the download button in fallback view
                    const downloadNowBtn = previewFrame.querySelector('.download-now-btn');
                    if (downloadNowBtn) {
                        downloadNowBtn.addEventListener('click', () => {
                            downloadFile(fileId);
                            showToast('Downloading presentation: ' + file.name);
                        });
                    }
                };

                // Add event listeners to the buttons
                setTimeout(() => {
                    const downloadBtn = fileViewerContainer.querySelector('.download-document-btn');
                    if (downloadBtn) {
                        downloadBtn.addEventListener('click', () => {
                            const fileId = downloadBtn.getAttribute('data-file-id');
                            if (fileId) {
                                downloadFile(fileId);
                                showToast('Downloading presentation: ' + file.name);
                            }
                        });
                    }

                    const toggleBtn = fileViewerContainer.querySelector('.preview-toggle-btn');
                    if (toggleBtn) {
                        toggleBtn.addEventListener('click', () => {
                            const currentMode = toggleBtn.getAttribute('data-mode');
                            const newMode = currentMode === 'google' ? 'office' : 'google';
                            toggleBtn.setAttribute('data-mode', newMode);
                            loadPresentationPreview(newMode);
                        });
                    }
                }, 100);

                // Initial load with Microsoft viewer
                loadPresentationPreview('office');
            } else {
                // Generic file preview for other types
                const fileExtension = file.name.split('.').pop().toLowerCase();
                const fileTypeInfo = getFileTypeInfo(file.name);
                const objectUrl = URL.createObjectURL(file);

                // Check if we can preview this file type
                let previewHtml = '';
                let canPreview = false;

                // Try to determine if we can preview this file
                if (fileTypeInfo.class === 'pdf' || file.type === 'application/pdf') {
                    previewHtml = `<iframe src="${objectUrl}" class="generic-file-preview" title="${file.name}"></iframe>`;
                    canPreview = true;
                } else if (fileTypeInfo.class === 'image' || file.type.startsWith('image/')) {
                    previewHtml = `<img src="${objectUrl}" alt="${file.name}" class="generic-file-preview">`;
                    canPreview = true;
                } else if (fileTypeInfo.class === 'text' || file.type.startsWith('text/')) {
                    // For text files, we need to read the content
                    const textReader = new FileReader();
                    textReader.onload = function(e) {
                        const textContent = e.target.result;
                        const previewElement = document.querySelector('.preview-placeholder');
                        if (previewElement) {
                            previewElement.innerHTML = `<pre class="generic-file-preview text-preview">${escapeHtml(textContent)}</pre>`;
                        }
                    };
                    textReader.readAsText(file);
                    previewHtml = `<div class="preview-placeholder"><div class="loading-indicator"><i class="fas fa-spinner fa-spin"></i> Loading preview...</div></div>`;
                    canPreview = true;
                } else if (fileTypeInfo.class === 'video' || file.type.startsWith('video/')) {
                    previewHtml = `
                        <video controls class="generic-file-preview">
                            <source src="${objectUrl}" type="${file.type}">
                            Your browser does not support the video tag.
                        </video>
                    `;
                    canPreview = true;
                } else if (fileTypeInfo.class === 'audio' || file.type.startsWith('audio/')) {
                    previewHtml = `
                        <div class="audio-preview-container">
                            <div class="audio-icon"><i class="fas fa-music fa-3x"></i></div>
                            <audio controls class="generic-file-preview">
                                <source src="${objectUrl}" type="${file.type}">
                                Your browser does not support the audio tag.
                            </audio>
                        </div>
                    `;
                    canPreview = true;
                }

                fileViewerContainer.innerHTML = `
                    <div class="document-preview-container">
                        <div class="document-preview-header">
                            <div class="document-icon ${fileTypeInfo.class}">
                                <i class="fas ${fileTypeInfo.icon}"></i>
                            </div>
                            <div class="document-title">
                                <h3>${file.name}</h3>
                                <p>${file.type || 'File type: ' + fileExtension.toUpperCase()} • ${formatFileSize(file.size)}</p>
                            </div>
                        </div>
                        ${canPreview ?
                            `<div class="document-preview-frame">
                                ${previewHtml}
                            </div>` :
                            `<div class="no-preview-message">
                                <i class="fas fa-eye-slash"></i>
                                <p>Preview not available for this file type</p>
                            </div>`
                        }
                        <div class="document-preview-actions">
                            <button class="btn btn-primary download-document-btn" data-file-id="${fileId}">
                                <i class="fas fa-download"></i> Download File
                            </button>
                        </div>
                    </div>
                `;

                // Add event listener to the download button
                setTimeout(() => {
                    const downloadBtn = fileViewerContainer.querySelector('.download-document-btn');
                    if (downloadBtn) {
                        downloadBtn.addEventListener('click', () => {
                            const fileId = downloadBtn.getAttribute('data-file-id');
                            if (fileId) {
                                downloadFile(fileId);
                                showToast('Downloading file: ' + file.name);
                            }
                        });
                    }
                }, 100);
            }

        };

        reader.onerror = function() {
            fileViewerContainer.innerHTML = `
                <div class="file-viewer-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Error loading file</p>
                </div>
            `;
        };

        // Read the file based on its type
        if (file.type.startsWith('text/') ||
            file.type === 'application/json' ||
            file.type === 'application/xml') {
            reader.readAsText(file);
        } else if (file.type === 'application/pdf' ||
                  file.type.startsWith('image/')) {
            // For PDFs and images, we can display them directly
            reader.readAsDataURL(file);
        } else if (file.type.includes('spreadsheet') ||
                  file.type.includes('excel') ||
                  file.name.endsWith('.xls') ||
                  file.name.endsWith('.xlsx') ||
                  file.name.endsWith('.csv')) {
            // For Excel files, we'll show a preview with icon
            reader.readAsDataURL(file);
        } else if (file.type.includes('word') ||
                  file.type.includes('document') ||
                  file.name.endsWith('.doc') ||
                  file.name.endsWith('.docx')) {
            // For Word documents, we'll show a preview with icon
            reader.readAsDataURL(file);
        } else {
            // For other file types
            reader.readAsDataURL(file);
        }
    }

    // Function to download a file
    function downloadFile(fileId) {
        if (!uploadedFiles[fileId]) return;

        const fileData = uploadedFiles[fileId];
        const file = fileData.file;

        // Create a download link
        const link = document.createElement('a');
        link.href = URL.createObjectURL(file);
        link.download = file.name;
        link.style.display = 'none';

        // Add to document, click it, and remove it
        document.body.appendChild(link);
        link.click();

        // Clean up
        setTimeout(() => {
            URL.revokeObjectURL(link.href);
            document.body.removeChild(link);
        }, 100);
    }

    // Signature Modal Elements
    const signatureModal = document.getElementById('signatureModal');
    const signatureCanvas = document.getElementById('signatureCanvas');
    const signatureTitle = document.getElementById('signatureTitle');
    const closeSignatureBtn = document.getElementById('closeSignatureBtn');
    const cancelSignatureBtn = document.getElementById('cancelSignatureBtn');
    const saveSignatureBtn = document.getElementById('saveSignatureBtn');
    const clearSignatureBtn = document.getElementById('clearSignatureBtn');
    const typedSignature = document.getElementById('typedSignature');
    const typedSignaturePreview = document.getElementById('typedSignaturePreview');
    const signatureFileInput = document.getElementById('signatureFileInput');
    const uploadedSignaturePreview = document.getElementById('uploadedSignaturePreview');
    const chooseSignatureBtn = document.getElementById('chooseSignatureBtn');

    // Signature Preview Modal Elements
    const signaturePreviewModal = document.getElementById('signaturePreviewModal');
    const signaturePreviewImage = document.getElementById('signaturePreviewImage');
    const signatureOwner = document.getElementById('signatureOwner');
    const signatureDate = document.getElementById('signatureDate');
    const closeSignaturePreviewBtn = document.getElementById('closeSignaturePreviewBtn');
    const closeSignaturePreviewFooterBtn = document.getElementById('closeSignaturePreviewFooterBtn');
    const downloadSignatureBtn = document.getElementById('downloadSignatureBtn');

    // Function to open signature modal
    function openSignatureModal(fileId) {
        if (!uploadedFiles[fileId]) return;

        // Set current file ID for signature
        currentFileIdForSignature = fileId;

        // Check if file already has a signature
        if (uploadedFiles[fileId].signature) {
            // Show preview modal instead
            openSignaturePreviewModal(fileId);
            return;
        }

        // Set modal title
        signatureTitle.textContent = `Add Signature to ${uploadedFiles[fileId].name}`;

        // Reset canvas
        if (signatureCanvas) {
            const ctx = signatureCanvas.getContext('2d');
            ctx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
        }

        // Reset typed signature
        if (typedSignature) {
            typedSignature.value = '';
            typedSignaturePreview.textContent = '';
        }

        // Reset uploaded signature
        if (uploadedSignaturePreview) {
            uploadedSignaturePreview.src = '';
        }

        // Reset current signature data
        currentSignature = null;
        currentSignatureType = null;

        // Show the modal
        signatureModal.style.display = 'flex';

        // Initialize canvas drawing if not already initialized
        initializeSignatureCanvas();
    }

    // Function to open signature preview modal
    function openSignaturePreviewModal(fileId) {
        if (!uploadedFiles[fileId] || !uploadedFiles[fileId].signature) return;

        // Set signature preview image
        signaturePreviewImage.src = uploadedFiles[fileId].signature;

        // Set signature info
        signatureOwner.textContent = uploadedFiles[fileId].creator || 'Admin';
        signatureDate.textContent = uploadedFiles[fileId].signatureDate || formatCreationDate(new Date());

        // Show the modal
        signaturePreviewModal.style.display = 'flex';
    }

    // Initialize signature canvas
    function initializeSignatureCanvas() {
        if (!signatureCanvas) return;

        const ctx = signatureCanvas.getContext('2d');

        // Set default pen properties
        ctx.strokeStyle = penColor;
        ctx.lineWidth = penSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Mouse events for desktop
        signatureCanvas.addEventListener('mousedown', startDrawing);
        signatureCanvas.addEventListener('mousemove', draw);
        signatureCanvas.addEventListener('mouseup', stopDrawing);
        signatureCanvas.addEventListener('mouseout', stopDrawing);

        // Touch events for mobile
        signatureCanvas.addEventListener('touchstart', startDrawingTouch);
        signatureCanvas.addEventListener('touchmove', drawTouch);
        signatureCanvas.addEventListener('touchend', stopDrawing);
    }

    // Drawing functions
    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];

        // Hide placeholder text
        const placeholder = document.querySelector('.signature-canvas-placeholder');
        if (placeholder) {
            placeholder.style.opacity = '0';
        }

        // Set current signature type
        currentSignatureType = 'draw';
    }

    function draw(e) {
        if (!isDrawing) return;

        const ctx = signatureCanvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }

    function startDrawingTouch(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = signatureCanvas.getBoundingClientRect();
        const offsetX = touch.clientX - rect.left;
        const offsetY = touch.clientY - rect.top;

        isDrawing = true;
        [lastX, lastY] = [offsetX, offsetY];

        // Hide placeholder text
        const placeholder = document.querySelector('.signature-canvas-placeholder');
        if (placeholder) {
            placeholder.style.opacity = '0';
        }

        // Set current signature type
        currentSignatureType = 'draw';
    }

    function drawTouch(e) {
        e.preventDefault();
        if (!isDrawing) return;

        const touch = e.touches[0];
        const rect = signatureCanvas.getBoundingClientRect();
        const offsetX = touch.clientX - rect.left;
        const offsetY = touch.clientY - rect.top;

        const ctx = signatureCanvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
        [lastX, lastY] = [offsetX, offsetY];
    }

    function stopDrawing() {
        if (isDrawing) {
            isDrawing = false;

            // Save current signature
            if (currentSignatureType === 'draw') {
                currentSignature = signatureCanvas.toDataURL('image/png');
            }
        }
    }

    // Signature tab switching
    const signatureTabs = document.querySelectorAll('.signature-tab');
    if (signatureTabs.length) {
        signatureTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                signatureTabs.forEach(t => t.classList.remove('active'));

                // Add active class to clicked tab
                tab.classList.add('active');

                // Hide all tab content
                document.querySelectorAll('.signature-tab-content').forEach(content => {
                    content.classList.remove('active');
                });

                // Show selected tab content
                const tabName = tab.getAttribute('data-tab');
                const tabContent = document.getElementById(tabName + 'Tab');
                if (tabContent) {
                    tabContent.classList.add('active');
                }
            });
        });
    }

    // Pen color selection
    const colorButtons = document.querySelectorAll('.color-btn');
    if (colorButtons.length) {
        colorButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all color buttons
                colorButtons.forEach(b => b.classList.remove('active'));

                // Add active class to clicked button
                btn.classList.add('active');

                // Set pen color
                penColor = btn.getAttribute('data-color');

                // Update canvas context
                if (signatureCanvas) {
                    const ctx = signatureCanvas.getContext('2d');
                    ctx.strokeStyle = penColor;
                }
            });
        });
    }

    // Pen size selection
    const sizeButtons = document.querySelectorAll('.size-btn');
    if (sizeButtons.length) {
        sizeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all size buttons
                sizeButtons.forEach(b => b.classList.remove('active'));

                // Add active class to clicked button
                btn.classList.add('active');

                // Set pen size
                penSize = parseInt(btn.getAttribute('data-size'));

                // Update canvas context
                if (signatureCanvas) {
                    const ctx = signatureCanvas.getContext('2d');
                    ctx.lineWidth = penSize;
                }
            });
        });
    }

    // Clear signature button
    if (clearSignatureBtn) {
        clearSignatureBtn.addEventListener('click', () => {
            if (signatureCanvas) {
                const ctx = signatureCanvas.getContext('2d');
                ctx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);

                // Show placeholder text
                const placeholder = document.querySelector('.signature-canvas-placeholder');
                if (placeholder) {
                    placeholder.style.opacity = '0.5';
                }

                // Reset current signature
                currentSignature = null;
            }
        });
    }

    // Typed signature
    if (typedSignature) {
        typedSignature.addEventListener('input', () => {
            // Update preview
            typedSignaturePreview.textContent = typedSignature.value;

            // Set current signature type
            currentSignatureType = 'type';

            // Get current font
            const activeFont = document.querySelector('.font-btn.active');
            if (activeFont) {
                const fontFamily = activeFont.getAttribute('data-font');
                typedSignaturePreview.style.fontFamily = fontFamily;
            }

            // If there's text, create a signature image
            if (typedSignature.value.trim()) {
                // Use html2canvas or similar library to convert to image
                // For now, we'll just use a simple approach
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = typedSignaturePreview.offsetWidth;
                tempCanvas.height = typedSignaturePreview.offsetHeight;
                const ctx = tempCanvas.getContext('2d');

                // Set font properties
                ctx.font = window.getComputedStyle(typedSignaturePreview).font;
                ctx.fillStyle = 'black';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                // Draw text
                ctx.fillText(typedSignature.value, tempCanvas.width / 2, tempCanvas.height / 2);

                // Save as image
                currentSignature = tempCanvas.toDataURL('image/png');
            } else {
                currentSignature = null;
            }
        });
    }

    // Font selection
    const fontButtons = document.querySelectorAll('.font-btn');
    if (fontButtons.length) {
        fontButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all font buttons
                fontButtons.forEach(b => b.classList.remove('active'));

                // Add active class to clicked button
                btn.classList.add('active');

                // Set font family
                const fontFamily = btn.getAttribute('data-font');
                if (typedSignaturePreview) {
                    typedSignaturePreview.style.fontFamily = fontFamily;
                }

                // Update signature image if there's text
                if (typedSignature && typedSignature.value.trim()) {
                    // Trigger input event to update signature
                    typedSignature.dispatchEvent(new Event('input'));
                }
            });
        });
    }

    // Signature file upload
    if (chooseSignatureBtn) {
        chooseSignatureBtn.addEventListener('click', () => {
            signatureFileInput.click();
        });
    }

    if (signatureFileInput) {
        signatureFileInput.addEventListener('change', () => {
            if (signatureFileInput.files && signatureFileInput.files[0]) {
                const file = signatureFileInput.files[0];

                // Check if it's an image
                if (!file.type.startsWith('image/')) {
                    showToast('Please select an image file');
                    return;
                }

                // Create object URL
                const url = URL.createObjectURL(file);

                // Show preview
                uploadedSignaturePreview.src = url;

                // Set current signature type
                currentSignatureType = 'upload';

                // Save signature
                currentSignature = url;
            }
        });
    }

    // Close signature modal
    if (closeSignatureBtn) {
        closeSignatureBtn.addEventListener('click', () => {
            signatureModal.style.display = 'none';
        });
    }

    if (cancelSignatureBtn) {
        cancelSignatureBtn.addEventListener('click', () => {
            signatureModal.style.display = 'none';
        });
    }

    // Close signature preview modal
    if (closeSignaturePreviewBtn) {
        closeSignaturePreviewBtn.addEventListener('click', () => {
            signaturePreviewModal.style.display = 'none';
        });
    }

    if (closeSignaturePreviewFooterBtn) {
        closeSignaturePreviewFooterBtn.addEventListener('click', () => {
            signaturePreviewModal.style.display = 'none';
        });
    }

    // Download signature
    if (downloadSignatureBtn) {
        downloadSignatureBtn.addEventListener('click', () => {
            if (currentFileIdForSignature && uploadedFiles[currentFileIdForSignature] && uploadedFiles[currentFileIdForSignature].signature) {
                // Create a temporary link
                const a = document.createElement('a');
                a.href = uploadedFiles[currentFileIdForSignature].signature;
                a.download = `signature_${uploadedFiles[currentFileIdForSignature].name}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                showToast('Signature downloaded');
            }
        });
    }

    // Save signature
    if (saveSignatureBtn) {
        saveSignatureBtn.addEventListener('click', () => {
            if (!currentFileIdForSignature || !currentSignature) {
                showToast('Please create a signature first');
                return;
            }

            // Save signature to file data
            uploadedFiles[currentFileIdForSignature].signature = currentSignature;
            uploadedFiles[currentFileIdForSignature].signatureType = currentSignatureType;
            uploadedFiles[currentFileIdForSignature].signatureDate = formatCreationDate(new Date());

            // Update UI
            const row = document.querySelector(`.attachment-row[data-file-id="${currentFileIdForSignature}"]`);
            if (row) {
                const signatureCell = row.querySelector('.signature-col');
                if (signatureCell) {
                    // Update button
                    const signatureBtn = signatureCell.querySelector('.signature-status');
                    if (signatureBtn) {
                        signatureBtn.className = 'signature-status signed';
                        signatureBtn.title = 'View signature';
                        signatureBtn.innerHTML = '<i class="fas fa-signature"></i>';
                    }
                }
            }

            // Close modal
            signatureModal.style.display = 'none';

            showToast('Signature saved successfully');
        });
    }

    // Helper function to escape HTML
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Helper function to determine file type info (icon and class)
    function getFileTypeInfo(fileName) {
        const extension = fileName.split('.').pop().toLowerCase();

        // Default file icon
        let icon = 'fa-file';
        let className = 'generic';

        // Determine icon based on file extension
        switch (extension) {
            // Documents
            case 'pdf':
                icon = 'fa-file-pdf';
                className = 'pdf';
                break;
            case 'doc':
            case 'docx':
                icon = 'fa-file-word';
                className = 'word';
                break;
            case 'xls':
            case 'xlsx':
            case 'csv':
                icon = 'fa-file-excel';
                className = 'excel';
                break;
            case 'ppt':
            case 'pptx':
                icon = 'fa-file-powerpoint';
                className = 'powerpoint';
                break;

            // Images
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
            case 'bmp':
            case 'svg':
                icon = 'fa-file-image';
                className = 'image';
                break;

            // Code
            case 'html':
            case 'htm':
            case 'xml':
            case 'css':
            case 'js':
            case 'json':
            case 'php':
            case 'py':
            case 'java':
            case 'c':
            case 'cpp':
            case 'cs':
                icon = 'fa-file-code';
                className = 'code';
                break;

            // Archives
            case 'zip':
            case 'rar':
            case 'tar':
            case 'gz':
            case '7z':
                icon = 'fa-file-archive';
                className = 'archive';
                break;

            // Audio
            case 'mp3':
            case 'wav':
            case 'ogg':
            case 'flac':
            case 'm4a':
                icon = 'fa-file-audio';
                className = 'audio';
                break;

            // Video
            case 'mp4':
            case 'avi':
            case 'mov':
            case 'wmv':
            case 'flv':
            case 'mkv':
                icon = 'fa-file-video';
                className = 'video';
                break;

            // Text
            case 'txt':
            case 'rtf':
            case 'md':
                icon = 'fa-file-alt';
                className = 'text';
                break;

            default:
                icon = 'fa-file';
                className = 'generic';
        }

        return { icon, class: className };
    }

    // Add CSS for additional styling
    const style = document.createElement('style');
    style.textContent = `
        .upload-dropzone.highlight {
            border-color: var(--primary-color);
            background-color: rgba(37, 99, 235, 0.05);
        }

        .selected-for-delete {
            background-color: rgba(239, 68, 68, 0.05);
        }

        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        .rotating {
            animation: rotate 1s linear infinite;
        }

        .toast-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: var(--primary-color);
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.3s, transform 0.3s;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .toast-notification.show {
            opacity: 1;
            transform: translateY(0);
        }

        .toast-notification::before {
            content: '✓';
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);
});
