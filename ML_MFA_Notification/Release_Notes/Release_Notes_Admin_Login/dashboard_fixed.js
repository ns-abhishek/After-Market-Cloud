// Immediate self-executing function to initialize everything
(function() {
    console.log('Initializing dashboard.js');

    // For testing purposes, bypass login check
    if (!sessionStorage.getItem('adminLoggedIn')) {
        console.log('Setting adminLoggedIn in sessionStorage for testing');
        sessionStorage.setItem('adminLoggedIn', 'true');
    }
})();

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    initializeDashboard();
});

// Also try to initialize if the document is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('Document already loaded, initializing immediately');
    setTimeout(initializeDashboard, 1);
}

// Global notification function
function showNotification(message, type = 'error') {
    console.log('Showing notification:', message, 'Type:', type);

    // Get notification elements
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');

    if (!notification || !notificationMessage) {
        console.error('Notification elements not found in the DOM');
        // Fallback to alert for critical messages
        if (type === 'error') {
            alert(message);
        }
        return;
    }

    // Set message
    notificationMessage.textContent = message;

    // Reset classes
    notification.className = 'notification';

    // Add type class
    notification.classList.add(type);

    // Show notification
    notification.classList.add('show');

    // Hide after delay
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Main initialization function
function initializeDashboard() {
    console.log('Initializing dashboard components');

    // DOM Elements
    const menuLinks = document.querySelectorAll('.menu-nav a');
    const contentSections = document.querySelectorAll('.content-section');
    const logoutBtn = document.getElementById('logoutBtn');
    const themeToggle = document.getElementById('themeToggle');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const menuNav = document.querySelector('.menu-nav');
    const languageSelect = document.getElementById('languageSelect');

    // Manage Release Elements
    const createReleaseBtn = document.getElementById('createReleaseBtn');
    const releaseCreateForm = document.getElementById('releaseCreateForm');
    const cancelCreateBtn = document.getElementById('cancelCreateBtn');
    const editButtons = document.querySelectorAll('.edit-release-btn');

    // Log DOM elements for debugging
    console.log('Menu Links:', menuLinks ? menuLinks.length : 'not found');
    console.log('Content Sections:', contentSections ? contentSections.length : 'not found');

    // Check if essential elements exist
    if (!menuLinks || menuLinks.length === 0) {
        console.error('No menu links found in the DOM');
        alert('Navigation error: No menu links found');
    }

    if (!contentSections || contentSections.length === 0) {
        console.error('No content sections found in the DOM');
        alert('Navigation error: No content sections found');
    }

    // Log section IDs for debugging
    if (contentSections) {
        contentSections.forEach(section => {
            console.log('Section ID:', section.id);
        });
    }

    // Setup direct click handlers for all menu items
    setupDirectNavigation();

    // Setup direct handlers for theme toggle and logout
    setupThemeToggle(themeToggle);
    setupLogout(logoutBtn);

    // Setup hamburger menu
    setupHamburgerMenu();

    // Setup Manage Release functionality
    setupManageReleaseFunctionality(createReleaseBtn, releaseCreateForm, cancelCreateBtn, editButtons);

    // Setup Feature Tours functionality
    setupFeatureToursFunctionality();

    // Setup Validation functionality
    setupValidationFunctionality();

    // Test notification
    setTimeout(() => {
        showNotification('Dashboard loaded successfully', 'success');
    }, 1000);
}

// Setup theme toggle functionality
function setupThemeToggle(themeToggle) {
    if (themeToggle) {
        console.log('Setting up theme toggle button');
        themeToggle.onclick = function() {
            console.log('Theme toggle clicked');
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);

            // Update button text and icon
            if (newTheme === 'dark') {
                this.innerHTML = '<i class="fas fa-sun"></i><span class="theme-toggle-text">Light Mode</span>';
                showNotification('Switched to Dark Mode', 'info');
            } else {
                this.innerHTML = '<i class="fas fa-moon"></i><span class="theme-toggle-text">Dark Mode</span>';
                showNotification('Switched to Light Mode', 'info');
            }
        };
    }
}

// Setup logout functionality
function setupLogout(logoutBtn) {
    if (logoutBtn) {
        console.log('Setting up logout button');
        logoutBtn.onclick = function() {
            console.log('Logout button clicked');
            showNotification('Logging out...', 'info');

            // Small delay to show the notification before redirecting
            setTimeout(function() {
                sessionStorage.removeItem('adminLoggedIn');
                window.location.href = 'index.html';
            }, 1000);
        };
    }
}

// Function to set up direct navigation handlers
function setupDirectNavigation() {
    console.log('Setting up direct navigation handlers');

    // Get all menu links
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'manage', label: 'Manage Releases' },
        { id: 'validation', label: 'Validation' },
        { id: 'downtime', label: 'Downtime Notices' },
        { id: 'feature-tours', label: 'Feature Tours' },
        { id: 'templates', label: 'Templates' },
        { id: 'media', label: 'Media Library' },
        { id: 'settings', label: 'Settings' }
    ];

    // Add click handlers for each menu item
    menuItems.forEach(item => {
        const link = document.querySelector(`a[data-section="${item.id}"]`);
        if (link) {
            console.log(`Setting up handler for ${item.label}`);
            link.onclick = function(e) {
                e.preventDefault();
                console.log(`Clicked on ${item.label}`);
                switchToSection(item.id);
                return false;
            };
        } else {
            console.error(`Menu link for ${item.label} not found`);
        }
    });
}

// Function to switch between sections
function switchToSection(sectionId) {
    console.log('Switching to section:', sectionId);

    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    // Show the target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
        console.log('Section displayed:', sectionId);

        // Update active menu item
        const menuItems = document.querySelectorAll('.menu-nav li');
        menuItems.forEach(item => {
            item.classList.remove('active');
        });

        const activeMenuItem = document.querySelector(`.menu-nav a[data-section="${sectionId}"]`);
        if (activeMenuItem && activeMenuItem.parentElement) {
            activeMenuItem.parentElement.classList.add('active');
        }

        showNotification(`Navigated to ${sectionId}`, 'success');
    } else {
        console.error('Section not found:', sectionId);
        alert(`Section "${sectionId}" not found`);
    }
}

// Setup Manage Release functionality
function setupManageReleaseFunctionality(createReleaseBtn, releaseCreateForm, cancelCreateBtn, editButtons) {
    console.log('Setting up Manage Release functionality');

    // Create New Release button
    if (createReleaseBtn && releaseCreateForm) {
        console.log('Setting up Create New Release button');
        createReleaseBtn.onclick = function() {
            console.log('Create New Release button clicked');

            // Show the create form
            const releasesTableContainer = document.querySelector('.releases-table-container');
            const pagination = document.querySelector('.pagination');

            if (releasesTableContainer) releasesTableContainer.style.display = 'none';
            if (pagination) pagination.style.display = 'none';
            releaseCreateForm.style.display = 'block';

            showNotification('Create new release form opened', 'info');
        };
    } else {
        console.error('Create Release button or form not found');
    }

    // Cancel Create button
    if (cancelCreateBtn && releaseCreateForm) {
        console.log('Setting up Cancel Create button');
        cancelCreateBtn.onclick = function() {
            console.log('Cancel Create button clicked');

            // Hide the create form and show the table
            const releasesTableContainer = document.querySelector('.releases-table-container');
            const pagination = document.querySelector('.pagination');

            releaseCreateForm.style.display = 'none';
            if (releasesTableContainer) releasesTableContainer.style.display = 'block';
            if (pagination) pagination.style.display = 'flex';

            showNotification('Create form canceled', 'info');
        };
    } else {
        console.error('Cancel Create button not found');
    }

    // Back to Table button
    const backToTableBtn = document.getElementById('backToTableBtn');
    if (backToTableBtn && releaseCreateForm) {
        console.log('Setting up Back to Table button');
        backToTableBtn.onclick = function() {
            console.log('Back to Table button clicked');

            // Hide the create form and show the table
            const releasesTableContainer = document.querySelector('.releases-table-container');
            const pagination = document.querySelector('.pagination');

            releaseCreateForm.style.display = 'none';
            if (releasesTableContainer) releasesTableContainer.style.display = 'block';
            if (pagination) pagination.style.display = 'flex';

            showNotification('Returned to releases table', 'info');
        };
    } else {
        console.error('Back to Table button not found');
    }

    // Edit Release buttons
    if (editButtons && editButtons.length > 0) {
        console.log('Setting up Edit Release buttons');
        editButtons.forEach(button => {
            button.onclick = function() {
                const version = this.getAttribute('data-version');
                console.log('Edit button clicked for version:', version);

                // Show the create form (which will be used for editing)
                const releasesTableContainer = document.querySelector('.releases-table-container');
                const pagination = document.querySelector('.pagination');

                if (releasesTableContainer) releasesTableContainer.style.display = 'none';
                if (pagination) pagination.style.display = 'none';
                if (releaseCreateForm) releaseCreateForm.style.display = 'block';

                // In a real app, you would load the release data here
                showNotification(`Editing release version ${version}`, 'info');
            };
        });
    } else {
        console.log('No Edit Release buttons found');
    }

    // Add direct click handlers to all edit buttons (including those without class)
    const allEditButtons = document.querySelectorAll('.action-buttons .icon-btn:first-child');
    if (allEditButtons && allEditButtons.length > 0) {
        console.log('Setting up all Edit buttons');
        allEditButtons.forEach(button => {
            button.onclick = function() {
                console.log('Edit button clicked');

                // Show the create form (which will be used for editing)
                const releasesTableContainer = document.querySelector('.releases-table-container');
                const pagination = document.querySelector('.pagination');

                if (releasesTableContainer) releasesTableContainer.style.display = 'none';
                if (pagination) pagination.style.display = 'none';
                if (releaseCreateForm) releaseCreateForm.style.display = 'block';

                showNotification('Editing release', 'info');
            };
        });
    }

    // Setup file upload functionality
    setupFileUpload();

    // Ensure manual entry form is visible and file upload form is hidden by default
    const manualEntryForm = document.getElementById('manualEntryForm');
    const fileUploadForm = document.getElementById('fileUploadForm');

    if (manualEntryForm) manualEntryForm.style.display = 'block';
    if (fileUploadForm) fileUploadForm.style.display = 'none';

    // Setup validation, downtime, and publish functionality
    setupReleaseWorkflow();
}

// Setup file upload functionality
function setupFileUpload() {
    console.log('Setting up file upload functionality');

    // Get DOM elements
    const showUploadBtn = document.getElementById('showUploadBtn');
    const manualEntryForm = document.getElementById('manualEntryForm');
    const fileUploadForm = document.getElementById('fileUploadForm');
    const releaseNoteFile = document.getElementById('releaseNoteFile');
    const fileContentPreview = document.getElementById('fileContentPreview');
    const uploadedFileName = document.getElementById('uploadedFileName');
    const uploadedFileSize = document.getElementById('uploadedFileSize');
    const filePreview = document.querySelector('.file-preview');
    const removeFileBtn = document.getElementById('removeFileBtn');

    // Show upload form button
    if (showUploadBtn) {
        console.log('Setting up show upload button');
        showUploadBtn.onclick = function() {
            console.log('Show upload button clicked');

            if (fileUploadForm) {
                fileUploadForm.style.display = 'block';
                showNotification('File upload form opened', 'info');
            }
        };
    } else {
        console.error('Show upload button not found');
    }

    // File upload handling
    if (releaseNoteFile) {
        console.log('Setting up file upload input');
        releaseNoteFile.onchange = function(e) {
            const file = e.target.files[0];
            if (!file) return;

            console.log('File selected:', file.name);

            // Update file info
            if (uploadedFileName) uploadedFileName.textContent = file.name;
            if (uploadedFileSize) uploadedFileSize.textContent = formatFileSize(file.size);

            // Show file preview
            if (filePreview) filePreview.style.display = 'flex';

            // Read file content for preview
            const reader = new FileReader();
            reader.onload = function(e) {
                if (fileContentPreview) {
                    fileContentPreview.textContent = e.target.result.substring(0, 500) +
                        (e.target.result.length > 500 ? '...' : '');
                }

                // Store the full content for processing
                fileContentPreview.dataset.fullContent = e.target.result;
            };
            reader.readAsText(file);

            showNotification(`File "${file.name}" selected`, 'success');
        };
    } else {
        console.error('File upload input not found');
    }

    // Process file button
    const processFileBtn = document.getElementById('processFileBtn');
    const cancelUploadBtn = document.getElementById('cancelUploadBtn');

    if (processFileBtn) {
        console.log('Setting up process file button');
        processFileBtn.onclick = function() {
            console.log('Process file button clicked');

            // Get the file content
            const fileContent = fileContentPreview?.dataset.fullContent;
            if (!fileContent) {
                showNotification('No file content to process', 'error');
                return;
            }

            try {
                // Try to parse as JSON
                const releaseData = JSON.parse(fileContent);
                console.log('Parsed release data:', releaseData);

                // Fill the form with the parsed data
                fillReleaseForm(releaseData);

                // Hide the file upload form
                if (fileUploadForm) fileUploadForm.style.display = 'none';

                showNotification('File processed successfully', 'success');
            } catch (error) {
                console.error('Error parsing file:', error);

                // Try to extract data using regex patterns if JSON parsing fails
                const extractedData = extractDataFromText(fileContent);
                if (extractedData) {
                    fillReleaseForm(extractedData);

                    // Hide the file upload form
                    if (fileUploadForm) fileUploadForm.style.display = 'none';

                    showNotification('File processed with best effort', 'success');
                } else {
                    showNotification('Could not parse file content. Please check the file format.', 'error');
                }
            }
        };
    } else {
        console.error('Process file button not found');
    }

    // Cancel upload button
    if (cancelUploadBtn) {
        console.log('Setting up cancel upload button');
        cancelUploadBtn.onclick = function() {
            console.log('Cancel upload button clicked');

            // Clear file input
            if (releaseNoteFile) releaseNoteFile.value = '';

            // Hide file preview
            if (filePreview) filePreview.style.display = 'none';

            // Clear file content preview
            if (fileContentPreview) {
                fileContentPreview.textContent = 'No file selected';
                fileContentPreview.dataset.fullContent = '';
            }

            // Hide file upload form
            if (fileUploadForm) fileUploadForm.style.display = 'none';

            showNotification('File upload canceled', 'info');
        };
    } else {
        console.error('Cancel upload button not found');
    }

    // Remove file button
    if (removeFileBtn && filePreview) {
        console.log('Setting up remove file button');
        removeFileBtn.onclick = function() {
            console.log('Remove file button clicked');

            // Clear file input
            if (releaseNoteFile) releaseNoteFile.value = '';

            // Hide file preview
            filePreview.style.display = 'none';

            // Clear file content preview
            if (fileContentPreview) fileContentPreview.textContent = 'No file selected';

            showNotification('File removed', 'info');
        };
    } else {
        console.error('Remove file button or file preview not found');
    }

    // File drag and drop
    const fileUploadArea = document.querySelector('.file-upload-area');
    if (fileUploadArea) {
        console.log('Setting up file drag and drop');

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            fileUploadArea.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            fileUploadArea.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            fileUploadArea.addEventListener(eventName, unhighlight, false);
        });

        function highlight() {
            fileUploadArea.classList.add('highlight');
        }

        function unhighlight() {
            fileUploadArea.classList.remove('highlight');
        }

        fileUploadArea.addEventListener('drop', handleDrop, false);

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const file = dt.files[0];

            if (file && releaseNoteFile) {
                // Create a DataTransfer object and add the file
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);

                // Set the files property of the file input
                releaseNoteFile.files = dataTransfer.files;

                // Trigger the change event
                const event = new Event('change', { bubbles: true });
                releaseNoteFile.dispatchEvent(event);
            }
        }
    } else {
        console.error('File upload area not found');
    }
}

// Setup validation, downtime, and publish functionality
function setupReleaseWorkflow() {
    console.log('Setting up release workflow functionality');

    // Get DOM elements
    const publishStatus = document.getElementById('publishStatus');
    const saveCreateBtn = document.getElementById('saveCreateBtn');
    const previewCreateBtn = document.getElementById('previewCreateBtn');
    const previewModal = document.getElementById('previewModal');
    const closePreviewBtn = document.getElementById('closePreviewBtn');
    const closeModalBtn = document.querySelector('.close-btn');
    const exportPdfBtn = document.getElementById('exportPdfBtn');

    // Status change handling
    if (publishStatus) {
        console.log('Setting up publish status dropdown');
        publishStatus.onchange = function() {
            const status = this.value;
            console.log('Publish status changed to:', status);

            showNotification(`Status set to: ${getStatusText(status)}`, 'info');
        };
    } else {
        console.error('Publish status dropdown not found');
    }

    // Save button
    if (saveCreateBtn) {
        console.log('Setting up save button');
        saveCreateBtn.onclick = function() {
            console.log('Save button clicked');

            // Simulate saving
            setTimeout(() => {
                // Hide the create form and show the table
                const releaseCreateForm = document.getElementById('releaseCreateForm');
                const releasesTableContainer = document.querySelector('.releases-table-container');
                const pagination = document.querySelector('.pagination');

                if (releaseCreateForm) releaseCreateForm.style.display = 'none';
                if (releasesTableContainer) releasesTableContainer.style.display = 'block';
                if (pagination) pagination.style.display = 'flex';

                showNotification('Release note saved successfully', 'success');
            }, 1000);

            showNotification('Saving release note...', 'info');
        };
    } else {
        console.error('Save button not found');
    }

    // Preview button
    if (previewCreateBtn && previewModal) {
        console.log('Setting up preview button');
        previewCreateBtn.onclick = function() {
            console.log('Preview button clicked');

            // Show preview modal
            previewModal.style.display = 'block';

            // Generate preview content
            const previewContent = document.getElementById('previewContent');
            if (previewContent) {
                previewContent.innerHTML = generatePreviewContent();
            }

            showNotification('Preview opened', 'info');
        };
    } else {
        console.error('Preview button or modal not found');
    }

    // Close preview buttons
    if (closePreviewBtn && previewModal) {
        console.log('Setting up close preview button');
        closePreviewBtn.onclick = function() {
            console.log('Close preview button clicked');

            // Hide preview modal
            previewModal.style.display = 'none';

            showNotification('Preview closed', 'info');
        };
    }

    if (closeModalBtn && previewModal) {
        console.log('Setting up close modal button');
        closeModalBtn.onclick = function() {
            console.log('Close modal button clicked');

            // Hide preview modal
            previewModal.style.display = 'none';

            showNotification('Preview closed', 'info');
        };
    }

    // Export PDF button
    if (exportPdfBtn) {
        console.log('Setting up export PDF button');
        exportPdfBtn.onclick = function() {
            console.log('Export PDF button clicked');

            // Simulate PDF export
            setTimeout(() => {
                showNotification('PDF exported successfully', 'success');
            }, 1000);

            showNotification('Exporting PDF...', 'info');
        };
    } else {
        console.error('Export PDF button not found');
    }

    // Setup validation and downtime buttons in the table
    setupTableActionButtons();
}

// Setup validation and downtime buttons in the table
function setupTableActionButtons() {
    console.log('Setting up table action buttons');

    // Get all status badges
    const statusBadges = document.querySelectorAll('.status-badge');

    if (statusBadges && statusBadges.length > 0) {
        console.log('Setting up status badges');
        statusBadges.forEach(badge => {
            // Make status badges clickable
            badge.style.cursor = 'pointer';
            badge.onclick = function() {
                const status = this.classList[0].replace('status-badge', '').trim();
                console.log('Status badge clicked:', status);

                if (status === 'draft') {
                    // Show validation confirmation
                    if (confirm('Submit this release note for validation?')) {
                        this.className = 'status-badge validation';
                        this.textContent = 'Pending Validation';
                        showNotification('Release note submitted for validation', 'success');
                    }
                } else if (status === 'validation') {
                    // Show downtime confirmation
                    if (confirm('Approve validation and submit for downtime notice?')) {
                        this.className = 'status-badge downtime';
                        this.textContent = 'Pending Downtime Notice';
                        showNotification('Validation approved, submitted for downtime notice', 'success');
                    }
                } else if (status === 'downtime') {
                    // Show publish confirmation
                    if (confirm('Approve downtime notice and publish this release note?')) {
                        this.className = 'status-badge published';
                        this.textContent = 'Published';
                        showNotification('Release note published successfully', 'success');
                    }
                } else if (status === 'published') {
                    alert('This release note is already published.');
                }
            };
        });
    } else {
        console.error('No status badges found');
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

// Helper function to get status text
function getStatusText(status) {
    switch (status) {
        case 'draft': return 'Draft';
        case 'validation': return 'Pending Validation';
        case 'downtime': return 'Pending Downtime Notice';
        case 'scheduled': return 'Scheduled';
        case 'published': return 'Published';
        default: return status;
    }
}

// Helper function to extract data from text using regex patterns
function extractDataFromText(text) {
    console.log('Extracting data from text');

    // Initialize extracted data object
    const extractedData = {
        version: '',
        codename: '',
        title: '',
        summary: '',
        features: [],
        bugfixes: [],
        improvements: []
    };

    // Extract version
    const versionMatch = text.match(/version[:\s]*([\d\.]+)/i);
    if (versionMatch) {
        extractedData.version = versionMatch[1];
    }

    // Extract codename
    const codenameMatch = text.match(/codename[:\s]*["']?([^"'\n]+)["']?/i);
    if (codenameMatch) {
        extractedData.codename = codenameMatch[1];
    }

    // Extract title
    const titleMatch = text.match(/title[:\s]*["']?([^"'\n]+)["']?/i) ||
                      text.match(/^#\s*(.+)$/m);
    if (titleMatch) {
        extractedData.title = titleMatch[1];
    }

    // Extract summary
    const summaryMatch = text.match(/summary[:\s]*["']?([^"'\n]+)["']?/i) ||
                        text.match(/tldr[:\s]*["']?([^"'\n]+)["']?/i);
    if (summaryMatch) {
        extractedData.summary = summaryMatch[1];
    }

    // Extract features
    const featuresSection = text.match(/new features[:\s]*([\s\S]*?)(?=bug fixes|improvements|$)/i);
    if (featuresSection) {
        const features = featuresSection[1].match(/[-*]\s*(.+)$/gm);
        if (features) {
            extractedData.features = features.map(f => f.replace(/[-*]\s*/, '').trim());
        }
    }

    // Extract bug fixes
    const bugfixesSection = text.match(/bug fixes[:\s]*([\s\S]*?)(?=new features|improvements|$)/i);
    if (bugfixesSection) {
        const bugfixes = bugfixesSection[1].match(/[-*]\s*(.+)$/gm);
        if (bugfixes) {
            extractedData.bugfixes = bugfixes.map(b => b.replace(/[-*]\s*/, '').trim());
        }
    }

    // Extract improvements
    const improvementsSection = text.match(/improvements[:\s]*([\s\S]*?)(?=new features|bug fixes|$)/i);
    if (improvementsSection) {
        const improvements = improvementsSection[1].match(/[-*]\s*(.+)$/gm);
        if (improvements) {
            extractedData.improvements = improvements.map(i => i.replace(/[-*]\s*/, '').trim());
        }
    }

    console.log('Extracted data:', extractedData);
    return extractedData;
}

// Helper function to fill the release form with data
function fillReleaseForm(data) {
    console.log('Filling release form with data:', data);

    // Fill basic fields
    if (data.version) {
        const versionInput = document.getElementById('releaseVersion');
        if (versionInput) versionInput.value = data.version;
    }

    if (data.codename) {
        const codenameInput = document.getElementById('releaseCodename');
        if (codenameInput) codenameInput.value = data.codename;
    }

    if (data.title) {
        const titleInput = document.getElementById('releaseTitle');
        if (titleInput) titleInput.value = data.title;
    }

    if (data.summary) {
        const summaryInput = document.getElementById('releaseTLDR');
        if (summaryInput) summaryInput.value = data.summary;
    }

    // Fill rich text editor content if available
    const quillEditor = window.releaseEditor;
    if (quillEditor) {
        let content = '';

        // Add features
        if (data.features && data.features.length > 0) {
            content += '<h2>New Features</h2><ul>';
            data.features.forEach(feature => {
                content += `<li>${feature}</li>`;
            });
            content += '</ul>';
        }

        // Add bug fixes
        if (data.bugfixes && data.bugfixes.length > 0) {
            content += '<h2>Bug Fixes</h2><ul>';
            data.bugfixes.forEach(bugfix => {
                content += `<li>${bugfix}</li>`;
            });
            content += '</ul>';
        }

        // Add improvements
        if (data.improvements && data.improvements.length > 0) {
            content += '<h2>Improvements</h2><ul>';
            data.improvements.forEach(improvement => {
                content += `<li>${improvement}</li>`;
            });
            content += '</ul>';
        }

        // Set the content
        quillEditor.root.innerHTML = content;
    }
}

// Helper function to generate preview content
function generatePreviewContent() {
    // Get form values
    const version = document.getElementById('releaseVersion')?.value || '3.1.0';
    const codename = document.getElementById('releaseCodename')?.value || '';
    const title = document.getElementById('releaseTitle')?.value || 'New Release';
    const summary = document.getElementById('releaseTLDR')?.value || 'This is a preview of the release note.';

    // Get content from Quill editor if available
    let editorContent = '';
    if (window.releaseEditor) {
        editorContent = window.releaseEditor.root.innerHTML;
    }

    // Generate HTML
    return `
        <div class="preview-release-note">
            <div class="preview-header">
                <h2>${title}</h2>
                <div class="preview-meta">
                    <span class="preview-version">Version ${version}${codename ? ` "${codename}"` : ''}</span>
                    <span class="preview-date">${new Date().toLocaleDateString()}</span>
                </div>
            </div>
            <div class="preview-summary">
                <p>${summary}</p>
            </div>
            ${editorContent ? `<div class="preview-content">${editorContent}</div>` : `
            <div class="preview-section">
                <h3>New Features</h3>
                <ul>
                    <li>
                        <strong>Enhanced User Interface</strong>
                        <p>Completely redesigned dashboard for better usability and modern look.</p>
                    </li>
                    <li>
                        <strong>Performance Improvements</strong>
                        <p>Faster loading times and reduced resource usage.</p>
                    </li>
                </ul>
            </div>
            <div class="preview-section">
                <h3>Bug Fixes</h3>
                <ul>
                    <li>Fixed issue with report generation</li>
                    <li>Resolved login problems on certain browsers</li>
                    <li>Fixed data display in the analytics dashboard</li>
                </ul>
            </div>
            `}
        </div>
    `;
}

// Setup Feature Tours functionality
function setupFeatureToursFunctionality() {
    console.log('Setting up Feature Tours functionality');

    // Get DOM elements
    const createTourBtn = document.getElementById('createTourBtn');
    const tourForm = document.getElementById('tourForm');
    const backToToursBtn = document.getElementById('backToToursBtn');
    const editTourButtons = document.querySelectorAll('.edit-tour-btn');

    // Create New Tour button
    if (createTourBtn && tourForm) {
        console.log('Setting up Create New Tour button');
        createTourBtn.onclick = function() {
            console.log('Create New Tour button clicked');

            // Show the tour form and hide the table
            const releasesTableContainer = document.querySelector('#feature-tours .releases-table-container');
            const manageControls = document.querySelector('#feature-tours .manage-controls');
            const pagination = document.querySelector('#feature-tours .pagination');

            if (releasesTableContainer) releasesTableContainer.style.display = 'none';
            if (manageControls) manageControls.style.display = 'none';
            if (pagination) pagination.style.display = 'none';
            tourForm.style.display = 'block';

            showNotification('Create new tour form opened', 'info');
        };
    } else {
        console.error('Create Tour button or form not found');
    }

    // Back to Tours button
    if (backToToursBtn && tourForm) {
        console.log('Setting up Back to Tours button');
        backToToursBtn.onclick = function() {
            console.log('Back to Tours button clicked');

            // Hide the tour form and show the table
            const releasesTableContainer = document.querySelector('#feature-tours .releases-table-container');
            const manageControls = document.querySelector('#feature-tours .manage-controls');
            const pagination = document.querySelector('#feature-tours .pagination');

            tourForm.style.display = 'none';
            if (releasesTableContainer) releasesTableContainer.style.display = 'block';
            if (manageControls) manageControls.style.display = 'flex';
            if (pagination) pagination.style.display = 'flex';

            showNotification('Returned to tours table', 'info');
        };
    } else {
        console.error('Back to Tours button not found');
    }

    // Edit Tour buttons
    if (editTourButtons && editTourButtons.length > 0) {
        console.log('Setting up Edit Tour buttons');
        editTourButtons.forEach(button => {
            button.onclick = function() {
                console.log('Edit Tour button clicked');

                // Show the tour form and hide the table
                const releasesTableContainer = document.querySelector('#feature-tours .releases-table-container');
                const manageControls = document.querySelector('#feature-tours .manage-controls');
                const pagination = document.querySelector('#feature-tours .pagination');

                if (releasesTableContainer) releasesTableContainer.style.display = 'none';
                if (manageControls) manageControls.style.display = 'none';
                if (pagination) pagination.style.display = 'none';
                if (tourForm) tourForm.style.display = 'block';

                // In a real app, you would load the tour data here
                showNotification('Editing tour', 'info');
            };
        });
    } else {
        console.log('No Edit Tour buttons found');
    }
}

// Setup Validation functionality
function setupValidationFunctionality() {
    console.log('Setting up Validation functionality');

    // Get DOM elements
    const reviewButtons = document.querySelectorAll('.review-release-btn');
    const reviewModal = document.getElementById('reviewModal');
    const closeReviewBtn = document.getElementById('closeReviewBtn');
    const submitReviewBtn = document.getElementById('submitReviewBtn');
    const reviewDecision = document.getElementById('reviewDecision');
    const reviewComments = document.getElementById('reviewComments');
    const closeModalBtn = document.querySelector('#reviewModal .close-btn');

    // Review buttons
    if (reviewButtons && reviewButtons.length > 0) {
        console.log('Setting up Review buttons');
        reviewButtons.forEach(button => {
            button.onclick = function() {
                const version = this.getAttribute('data-version');
                console.log('Review button clicked for version:', version);

                // Show the review modal
                if (reviewModal) {
                    reviewModal.style.display = 'block';

                    // Update review info (in a real app, you would load the data from the server)
                    document.getElementById('reviewVersion').textContent = version;

                    showNotification(`Reviewing release version ${version}`, 'info');
                }
            };
        });
    } else {
        console.log('No Review buttons found');
    }

    // Close review modal
    if (closeReviewBtn && reviewModal) {
        console.log('Setting up close review button');
        closeReviewBtn.onclick = function() {
            console.log('Close review button clicked');
            reviewModal.style.display = 'none';
            showNotification('Review canceled', 'info');
        };
    }

    if (closeModalBtn && reviewModal) {
        console.log('Setting up close modal button');
        closeModalBtn.onclick = function() {
            console.log('Close modal button clicked');
            reviewModal.style.display = 'none';
            showNotification('Review canceled', 'info');
        };
    }

    // Submit review
    if (submitReviewBtn && reviewModal) {
        console.log('Setting up submit review button');
        submitReviewBtn.onclick = function() {
            console.log('Submit review button clicked');

            const decision = reviewDecision ? reviewDecision.value : 'approve';
            const comments = reviewComments ? reviewComments.value : '';
            const version = document.getElementById('reviewVersion') ? document.getElementById('reviewVersion').textContent : '';

            console.log('Review decision:', decision);
            console.log('Review comments:', comments);

            // Hide the modal
            reviewModal.style.display = 'none';

            // Show notification
            if (decision === 'approve') {
                showNotification(`Release ${version} approved`, 'success');
            } else {
                showNotification(`Release ${version} rejected`, 'error');
            }

            // In a real app, you would update the UI to reflect the new status
            setTimeout(() => {
                // Refresh the validation table
                const statusBadge = document.querySelector(`tr[data-version="${version}"] .status-badge`);
                if (statusBadge) {
                    statusBadge.className = `status-badge ${decision === 'approve' ? 'approved' : 'rejected'}`;
                    statusBadge.textContent = decision === 'approve' ? 'Approved' : 'Rejected';
                }
            }, 500);
        };
    }

    // Setup validation table search and filters
    setupValidationTableSearch();
}

// Setup hamburger menu
function setupHamburgerMenu() {
    console.log('Setting up hamburger menu');

    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const hamburgerDropdown = document.querySelector('.hamburger-dropdown');

    if (hamburgerBtn && hamburgerDropdown) {
        console.log('Found hamburger menu elements');

        hamburgerBtn.onclick = function(e) {
            e.stopPropagation();
            console.log('Hamburger button clicked');
            hamburgerDropdown.classList.toggle('show');

            // Show notification
            showNotification('Menu opened', 'info');
        };

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (hamburgerDropdown.classList.contains('show') &&
                !hamburgerDropdown.contains(e.target) &&
                !hamburgerBtn.contains(e.target)) {
                console.log('Clicking outside, closing menu');
                hamburgerDropdown.classList.remove('show');
            }
        });

        // Add click event to dropdown items
        const dropdownLinks = hamburgerDropdown.querySelectorAll('a');
        dropdownLinks.forEach(link => {
            link.onclick = function() {
                console.log('Dropdown link clicked:', this.getAttribute('data-section'));
                hamburgerDropdown.classList.remove('show');

                // Navigate to the section
                const sectionId = this.getAttribute('data-section');
                if (sectionId) {
                    switchToSection(sectionId);
                }

                return false;
            };
        });
    } else {
        console.error('Hamburger menu elements not found');
    }
}

// Setup validation table search and filters
function setupValidationTableSearch() {
    console.log('Setting up validation table search and filters');

    // Get DOM elements
    const validationTableSearch = document.getElementById('validationTableSearch');
    const validationStatusFilter = document.getElementById('validationStatusFilter');
    const validationVersionFilter = document.getElementById('validationVersionFilter');

    // Table search
    if (validationTableSearch) {
        console.log('Setting up validation table search');
        validationTableSearch.oninput = function() {
            const searchTerm = this.value.toLowerCase();
            console.log('Validation table search term:', searchTerm);

            // Filter table rows
            const tableRows = document.querySelectorAll('#validation .releases-table tbody tr');
            tableRows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        };
    }

    // Status filter
    if (validationStatusFilter) {
        console.log('Setting up validation status filter');
        validationStatusFilter.onchange = function() {
            const status = this.value;
            console.log('Validation status filter:', status);

            // Filter table rows
            const tableRows = document.querySelectorAll('#validation .releases-table tbody tr');
            tableRows.forEach(row => {
                const statusBadge = row.querySelector('.status-badge');
                if (status === 'all' || (statusBadge && statusBadge.classList.contains(status))) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        };
    }

    // Version filter
    if (validationVersionFilter) {
        console.log('Setting up validation version filter');
        validationVersionFilter.onchange = function() {
            const versionType = this.value;
            console.log('Validation version filter:', versionType);

            // Filter table rows
            const tableRows = document.querySelectorAll('#validation .releases-table tbody tr');
            tableRows.forEach(row => {
                const version = row.cells[0].textContent;

                if (versionType === 'all') {
                    row.style.display = '';
                } else if (versionType === 'major' && /^\d+\.0\.0/.test(version)) {
                    row.style.display = '';
                } else if (versionType === 'minor' && /^\d+\.\d+\.0/.test(version)) {
                    row.style.display = '';
                } else if (versionType === 'patch' && /^\d+\.\d+\.\d+/.test(version) && !/\.0$/.test(version)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        };
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
