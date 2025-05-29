/**
 * Custom WYSIWYG Editor
 * A lightweight editor that doesn't require any external API keys
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize editor if it exists
    const editorContent = document.getElementById('content-editor');
    if (!editorContent) return;
    
    // Create dialogs for link and image insertion
    createEditorDialogs();
    
    // Add keyboard shortcuts
    addEditorKeyboardShortcuts();
    
    // Add paste handling for images
    addPasteHandling();
    
    // Add drag and drop for images
    addDragAndDropHandling();
    
    /**
     * Create dialogs for link and image insertion
     */
    function createEditorDialogs() {
        // Create link dialog
        const linkDialog = document.createElement('div');
        linkDialog.className = 'editor-dialog';
        linkDialog.id = 'link-dialog';
        linkDialog.style.display = 'none';
        linkDialog.innerHTML = `
            <div class="editor-dialog-header">
                <h3>Insert Link</h3>
                <button type="button" class="editor-dialog-close">&times;</button>
            </div>
            <div class="editor-dialog-content">
                <div class="form-group">
                    <label for="link-url">URL</label>
                    <input type="text" id="link-url" placeholder="https://">
                </div>
                <div class="form-group">
                    <label for="link-text">Text</label>
                    <input type="text" id="link-text" placeholder="Link text">
                </div>
                <div class="form-group">
                    <label for="link-title">Title (optional)</label>
                    <input type="text" id="link-title" placeholder="Link title">
                </div>
                <div class="form-group">
                    <input type="checkbox" id="link-new-tab">
                    <label for="link-new-tab">Open in new tab</label>
                </div>
            </div>
            <div class="editor-dialog-actions">
                <button type="button" class="admin-button secondary" id="link-cancel">Cancel</button>
                <button type="button" class="admin-button" id="link-insert">Insert</button>
            </div>
        `;
        
        // Create image dialog
        const imageDialog = document.createElement('div');
        imageDialog.className = 'editor-dialog';
        imageDialog.id = 'image-dialog';
        imageDialog.style.display = 'none';
        imageDialog.innerHTML = `
            <div class="editor-dialog-header">
                <h3>Insert Image</h3>
                <button type="button" class="editor-dialog-close">&times;</button>
            </div>
            <div class="editor-dialog-content">
                <div class="form-group">
                    <label for="image-url">Image URL</label>
                    <input type="text" id="image-url" placeholder="https://">
                </div>
                <div class="form-group">
                    <label for="image-alt">Alt Text</label>
                    <input type="text" id="image-alt" placeholder="Image description">
                </div>
                <div class="form-row">
                    <div class="form-group half">
                        <label for="image-width">Width (optional)</label>
                        <input type="text" id="image-width" placeholder="e.g., 300px">
                    </div>
                    <div class="form-group half">
                        <label for="image-height">Height (optional)</label>
                        <input type="text" id="image-height" placeholder="e.g., 200px">
                    </div>
                </div>
            </div>
            <div class="editor-dialog-actions">
                <button type="button" class="admin-button secondary" id="image-cancel">Cancel</button>
                <button type="button" class="admin-button" id="image-insert">Insert</button>
            </div>
        `;
        
        // Create table dialog
        const tableDialog = document.createElement('div');
        tableDialog.className = 'editor-dialog';
        tableDialog.id = 'table-dialog';
        tableDialog.style.display = 'none';
        tableDialog.innerHTML = `
            <div class="editor-dialog-header">
                <h3>Insert Table</h3>
                <button type="button" class="editor-dialog-close">&times;</button>
            </div>
            <div class="editor-dialog-content">
                <div class="form-row">
                    <div class="form-group half">
                        <label for="table-rows">Rows</label>
                        <input type="number" id="table-rows" value="3" min="1" max="20">
                    </div>
                    <div class="form-group half">
                        <label for="table-cols">Columns</label>
                        <input type="number" id="table-cols" value="3" min="1" max="10">
                    </div>
                </div>
                <div class="form-group">
                    <input type="checkbox" id="table-header" checked>
                    <label for="table-header">Include header row</label>
                </div>
            </div>
            <div class="editor-dialog-actions">
                <button type="button" class="admin-button secondary" id="table-cancel">Cancel</button>
                <button type="button" class="admin-button" id="table-insert">Insert</button>
            </div>
        `;
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'editor-overlay';
        overlay.id = 'editor-overlay';
        overlay.style.display = 'none';
        
        // Add dialogs and overlay to the document
        document.body.appendChild(linkDialog);
        document.body.appendChild(imageDialog);
        document.body.appendChild(tableDialog);
        document.body.appendChild(overlay);
        
        // Set up dialog event listeners
        setupDialogEventListeners();
    }
    
    /**
     * Set up dialog event listeners
     */
    function setupDialogEventListeners() {
        // Link dialog
        const linkDialog = document.getElementById('link-dialog');
        const linkInsertBtn = document.getElementById('link-insert');
        const linkCancelBtn = document.getElementById('link-cancel');
        const linkCloseBtn = linkDialog.querySelector('.editor-dialog-close');
        
        // Image dialog
        const imageDialog = document.getElementById('image-dialog');
        const imageInsertBtn = document.getElementById('image-insert');
        const imageCancelBtn = document.getElementById('image-cancel');
        const imageCloseBtn = imageDialog.querySelector('.editor-dialog-close');
        
        // Table dialog
        const tableDialog = document.getElementById('table-dialog');
        const tableInsertBtn = document.getElementById('table-insert');
        const tableCancelBtn = document.getElementById('table-cancel');
        const tableCloseBtn = tableDialog.querySelector('.editor-dialog-close');
        
        // Overlay
        const overlay = document.getElementById('editor-overlay');
        
        // Link dialog events
        if (linkInsertBtn) {
            linkInsertBtn.addEventListener('click', function() {
                insertLink();
                closeAllDialogs();
            });
        }
        
        if (linkCancelBtn) {
            linkCancelBtn.addEventListener('click', closeAllDialogs);
        }
        
        if (linkCloseBtn) {
            linkCloseBtn.addEventListener('click', closeAllDialogs);
        }
        
        // Image dialog events
        if (imageInsertBtn) {
            imageInsertBtn.addEventListener('click', function() {
                insertImage();
                closeAllDialogs();
            });
        }
        
        if (imageCancelBtn) {
            imageCancelBtn.addEventListener('click', closeAllDialogs);
        }
        
        if (imageCloseBtn) {
            imageCloseBtn.addEventListener('click', closeAllDialogs);
        }
        
        // Table dialog events
        if (tableInsertBtn) {
            tableInsertBtn.addEventListener('click', function() {
                insertTable();
                closeAllDialogs();
            });
        }
        
        if (tableCancelBtn) {
            tableCancelBtn.addEventListener('click', closeAllDialogs);
        }
        
        if (tableCloseBtn) {
            tableCloseBtn.addEventListener('click', closeAllDialogs);
        }
        
        // Overlay event
        if (overlay) {
            overlay.addEventListener('click', closeAllDialogs);
        }
        
        // Override editor tool click events for dialogs
        const linkTool = document.querySelector('.editor-tool[data-command="createLink"]');
        const imageTool = document.querySelector('.editor-tool[data-command="insertImage"]');
        const tableTool = document.querySelector('.editor-tool[data-command="insertTable"]');
        
        if (linkTool) {
            linkTool.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent default handler
                openLinkDialog();
            });
        }
        
        if (imageTool) {
            imageTool.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent default handler
                openImageDialog();
            });
        }
        
        if (tableTool) {
            tableTool.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent default handler
                openTableDialog();
            });
        }
    }
    
    /**
     * Open link dialog
     */
    function openLinkDialog() {
        const selection = window.getSelection();
        const selectedText = selection.toString();
        
        // Set selected text as link text
        const linkTextInput = document.getElementById('link-text');
        if (linkTextInput && selectedText) {
            linkTextInput.value = selectedText;
        }
        
        // Show dialog and overlay
        const linkDialog = document.getElementById('link-dialog');
        const overlay = document.getElementById('editor-overlay');
        
        if (linkDialog && overlay) {
            linkDialog.style.display = 'block';
            overlay.style.display = 'block';
            
            // Focus URL input
            const linkUrlInput = document.getElementById('link-url');
            if (linkUrlInput) {
                linkUrlInput.focus();
            }
        }
    }
    
    /**
     * Open image dialog
     */
    function openImageDialog() {
        // Show dialog and overlay
        const imageDialog = document.getElementById('image-dialog');
        const overlay = document.getElementById('editor-overlay');
        
        if (imageDialog && overlay) {
            imageDialog.style.display = 'block';
            overlay.style.display = 'block';
            
            // Focus URL input
            const imageUrlInput = document.getElementById('image-url');
            if (imageUrlInput) {
                imageUrlInput.focus();
            }
        }
    }
    
    /**
     * Open table dialog
     */
    function openTableDialog() {
        // Show dialog and overlay
        const tableDialog = document.getElementById('table-dialog');
        const overlay = document.getElementById('editor-overlay');
        
        if (tableDialog && overlay) {
            tableDialog.style.display = 'block';
            overlay.style.display = 'block';
        }
    }
    
    /**
     * Close all dialogs
     */
    function closeAllDialogs() {
        const dialogs = document.querySelectorAll('.editor-dialog');
        const overlay = document.getElementById('editor-overlay');
        
        dialogs.forEach(dialog => {
            dialog.style.display = 'none';
        });
        
        if (overlay) {
            overlay.style.display = 'none';
        }
        
        // Focus back on editor
        const editorContent = document.getElementById('content-editor');
        if (editorContent) {
            editorContent.focus();
        }
    }
    
    /**
     * Insert link from dialog
     */
    function insertLink() {
        const url = document.getElementById('link-url').value;
        const text = document.getElementById('link-text').value;
        const title = document.getElementById('link-title').value;
        const newTab = document.getElementById('link-new-tab').checked;
        
        if (!url) return;
        
        const editorContent = document.getElementById('content-editor');
        if (!editorContent) return;
        
        // Create link HTML
        let linkHtml = `<a href="${url}"`;
        if (title) linkHtml += ` title="${title}"`;
        if (newTab) linkHtml += ` target="_blank" rel="noopener noreferrer"`;
        linkHtml += `>${text || url}</a>`;
        
        // Insert link
        document.execCommand('insertHTML', false, linkHtml);
        
        // Update hidden textarea
        const hiddenTextarea = document.getElementById('content-editor-hidden');
        if (hiddenTextarea) {
            hiddenTextarea.value = editorContent.innerHTML;
        }
    }
    
    /**
     * Insert image from dialog
     */
    function insertImage() {
        const url = document.getElementById('image-url').value;
        const alt = document.getElementById('image-alt').value;
        const width = document.getElementById('image-width').value;
        const height = document.getElementById('image-height').value;
        
        if (!url) return;
        
        const editorContent = document.getElementById('content-editor');
        if (!editorContent) return;
        
        // Create image HTML
        let imgHtml = `<img src="${url}" alt="${alt || ''}"`;
        if (width) imgHtml += ` width="${width}"`;
        if (height) imgHtml += ` height="${height}"`;
        imgHtml += `>`;
        
        // Insert image
        document.execCommand('insertHTML', false, imgHtml);
        
        // Update hidden textarea
        const hiddenTextarea = document.getElementById('content-editor-hidden');
        if (hiddenTextarea) {
            hiddenTextarea.value = editorContent.innerHTML;
        }
    }
    
    /**
     * Insert table from dialog
     */
    function insertTable() {
        const rows = parseInt(document.getElementById('table-rows').value) || 3;
        const cols = parseInt(document.getElementById('table-cols').value) || 3;
        const includeHeader = document.getElementById('table-header').checked;
        
        const editorContent = document.getElementById('content-editor');
        if (!editorContent) return;
        
        // Create table HTML
        let tableHtml = '<table style="width:100%; border-collapse: collapse;">';
        
        // Add header row if needed
        if (includeHeader) {
            tableHtml += '<thead><tr>';
            for (let i = 0; i < cols; i++) {
                tableHtml += `<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Header ${i + 1}</th>`;
            }
            tableHtml += '</tr></thead>';
        }
        
        // Add body rows
        tableHtml += '<tbody>';
        for (let i = 0; i < rows; i++) {
            tableHtml += '<tr>';
            for (let j = 0; j < cols; j++) {
                tableHtml += `<td style="border: 1px solid #ddd; padding: 8px;">Cell ${i + 1}-${j + 1}</td>`;
            }
            tableHtml += '</tr>';
        }
        tableHtml += '</tbody></table>';
        
        // Insert table
        document.execCommand('insertHTML', false, tableHtml);
        
        // Update hidden textarea
        const hiddenTextarea = document.getElementById('content-editor-hidden');
        if (hiddenTextarea) {
            hiddenTextarea.value = editorContent.innerHTML;
        }
    }
    
    /**
     * Add keyboard shortcuts to editor
     */
    function addEditorKeyboardShortcuts() {
        const editorContent = document.getElementById('content-editor');
        if (!editorContent) return;
        
        editorContent.addEventListener('keydown', function(e) {
            // Ctrl+B: Bold
            if (e.ctrlKey && e.key === 'b') {
                e.preventDefault();
                document.execCommand('bold', false, null);
            }
            
            // Ctrl+I: Italic
            if (e.ctrlKey && e.key === 'i') {
                e.preventDefault();
                document.execCommand('italic', false, null);
            }
            
            // Ctrl+U: Underline
            if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
                document.execCommand('underline', false, null);
            }
            
            // Ctrl+K: Link
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                openLinkDialog();
            }
        });
    }
    
    /**
     * Add paste handling for images
     */
    function addPasteHandling() {
        const editorContent = document.getElementById('content-editor');
        if (!editorContent) return;
        
        editorContent.addEventListener('paste', function(e) {
            // Check if paste contains images
            const items = (e.clipboardData || e.originalEvent.clipboardData).items;
            let hasImage = false;
            
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    hasImage = true;
                    break;
                }
            }
            
            // If paste contains images, show notification
            if (hasImage) {
                e.preventDefault();
                showNotification('Direct image paste is not supported. Please use the image upload button.', 'warning');
            }
        });
    }
    
    /**
     * Add drag and drop handling for images
     */
    function addDragAndDropHandling() {
        const editorContent = document.getElementById('content-editor');
        if (!editorContent) return;
        
        editorContent.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.add('drag-over');
        });
        
        editorContent.addEventListener('dragleave', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.remove('drag-over');
        });
        
        editorContent.addEventListener('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.remove('drag-over');
            
            // Show notification
            showNotification('Direct file drop is not supported. Please use the image upload button.', 'warning');
        });
    }
    
    /**
     * Show notification message
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
    }
});
