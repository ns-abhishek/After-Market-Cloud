/**
 * Documentation Manager Redesign
 * JavaScript for the redesigned documentation management interface
 */
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const documentationTabs = document.querySelectorAll('.documentation-tab');
    const toolbarTitle = document.querySelector('.documentation-toolbar-title');
    const searchInput = document.querySelector('.toolbar-search input');
    const filterBtn = document.getElementById('filter-btn');
    const sortBtn = document.getElementById('sort-btn');
    const newDocumentBtn = document.getElementById('new-document-btn');
    const createDocBtn = document.getElementById('create-doc-btn');
    const addNewDocumentBtn = document.getElementById('add-new-document');
    const syncDocumentationBtn = document.getElementById('sync-documentation');
    const publishAllBtn = document.getElementById('publish-all');
    const exportDocumentationBtn = document.getElementById('export-documentation');
    const documentationGrid = document.querySelector('.documentation-grid');

    // Initialize the documentation manager
    initDocumentationManager();

    /**
     * Initialize documentation manager components and event listeners
     */
    function initDocumentationManager() {
        // Set up tabs
        if (documentationTabs && documentationTabs.length > 0) {
            documentationTabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    switchTab(this.dataset.section);
                });
            });
        }

        // Set up search input with debounce
        if (searchInput) {
            // Debounce function to prevent too many searches while typing
            let searchTimeout;
            searchInput.addEventListener('input', function() {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(searchDocuments, 300);
            });

            // Also search when Enter key is pressed
            searchInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    searchDocuments();
                }
            });
        }

        // Set up filter button
        if (filterBtn) {
            filterBtn.addEventListener('click', showFilterOptions);
        }

        // Set up sort button
        if (sortBtn) {
            sortBtn.addEventListener('click', showSortOptions);
        }

        // Set up new document button
        if (newDocumentBtn) {
            newDocumentBtn.addEventListener('click', createDocument);
        }

        // Set up create document button in header
        if (createDocBtn) {
            createDocBtn.addEventListener('click', createDocument);
        }

        // Set up add new document button in quick actions
        if (addNewDocumentBtn) {
            addNewDocumentBtn.addEventListener('click', createDocument);
        }

        // Set up sync documentation button
        if (syncDocumentationBtn) {
            syncDocumentationBtn.addEventListener('click', syncDocumentation);
        }

        // Set up publish all button
        if (publishAllBtn) {
            publishAllBtn.addEventListener('click', publishAllPending);
        }

        // Set up export documentation button
        if (exportDocumentationBtn) {
            exportDocumentationBtn.addEventListener('click', showExportOptions);
        }

        // Set up card action buttons
        setupCardActions();

        // Load initial documents
        loadDocuments('all');
    }

    /**
     * Switch between documentation tabs
     * @param {string} section - Section to switch to
     */
    function switchTab(section) {
        // Update active tab with smooth transition
        documentationTabs.forEach(tab => {
            if (tab.dataset.section === section) {
                // Add active class with animation
                tab.classList.add('active');
                // Add pulse animation
                tab.style.animation = 'pulse 0.5s';
                // Remove animation after it completes
                setTimeout(() => {
                    tab.style.animation = '';
                }, 500);
            } else {
                tab.classList.remove('active');
            }
        });

        // Update toolbar title with fade effect
        if (toolbarTitle) {
            // Fade out
            toolbarTitle.style.opacity = '0';

            // After fade out, update content and fade in
            setTimeout(() => {
                const sectionIcon = section === 'all' ? 'fa-layer-group' :
                                   section === 'complete' ? 'fa-book' :
                                   section === 'module' ? 'fa-puzzle-piece' :
                                   section === 'draft' ? 'fa-pencil-alt' :
                                   section === 'review' ? 'fa-clipboard-check' :
                                   section === 'published' ? 'fa-check-circle' : 'fa-archive';

                const sectionTitle = section === 'all' ? 'All Documents' :
                                    section === 'complete' ? 'Complete Manual' :
                                    section === 'module' ? 'Module-Specific Manuals' :
                                    section === 'draft' ? 'Drafts' :
                                    section === 'review' ? 'Under Review' :
                                    section === 'published' ? 'Published' : 'Archived';

                toolbarTitle.innerHTML = `<i class="fas ${sectionIcon}"></i> ${sectionTitle}`;

                // Fade in
                toolbarTitle.style.opacity = '1';
            }, 200);
        }

        // Load documents for the selected section
        loadDocuments(section);
    }

    /**
     * Load documents for the selected section
     * @param {string} section - Section to load documents for
     */
    function loadDocuments(section) {
        // In a real application, this would make an API call to get documents
        // For demo purposes, we'll simulate loading documents

        // Clear existing documents with fade out effect
        if (documentationGrid) {
            // Fade out current content
            documentationGrid.style.opacity = '0';
            documentationGrid.style.transform = 'translateY(10px)';

            // After fade out, show loading state
            setTimeout(() => {
                // Show loading state
                documentationGrid.innerHTML = '<div class="loading-indicator"><i class="fas fa-spinner fa-spin"></i> Loading documents...</div>';
                documentationGrid.style.opacity = '1';
                documentationGrid.style.transform = 'translateY(0)';

                // Simulate API call delay
                setTimeout(() => {
                    // Generate documents based on section
                    let documents = generateDocuments(section);

                    // Fade out loading indicator
                    documentationGrid.style.opacity = '0';
                    documentationGrid.style.transform = 'translateY(10px)';

                    // After fade out, render documents and fade in
                    setTimeout(() => {
                        // Render documents
                        renderDocuments(documents);

                        // Set up card actions
                        setupCardActions();

                        // Fade in new content
                        documentationGrid.style.opacity = '1';
                        documentationGrid.style.transform = 'translateY(0)';
                    }, 200);
                }, 500);
            }, 200);
        }
    }

    /**
     * Generate sample documents based on section
     * @param {string} section - Section to generate documents for
     * @returns {Array} - Array of document objects
     */
    function generateDocuments(section) {
        // In a real application, this would be data from an API
        // For demo purposes, we'll generate sample documents

        const completeManualDocs = [
            {
                title: 'Getting Started',
                type: 'complete',
                status: 'published',
                lastUpdated: '2 days ago',
                author: 'Admin User',
                version: '2.3'
            },
            {
                title: 'User Roles and Permissions',
                type: 'complete',
                status: 'published',
                lastUpdated: '3 days ago',
                author: 'Admin User',
                version: '1.8'
            },
            {
                title: 'System Requirements',
                type: 'complete',
                status: 'published',
                lastUpdated: '1 week ago',
                author: 'Admin User',
                version: '1.5'
            },
            {
                title: 'Installation Guide',
                type: 'complete',
                status: 'review',
                lastUpdated: '1 day ago',
                author: 'John Doe',
                version: '2.0'
            },
            {
                title: 'Troubleshooting',
                type: 'complete',
                status: 'draft',
                lastUpdated: '5 hours ago',
                author: 'Jane Smith',
                version: '0.9'
            }
        ];

        const moduleDocs = [
            {
                title: 'Order Processing',
                type: 'module',
                module: 'OMS',
                status: 'published',
                lastUpdated: '1 week ago',
                author: 'Admin User',
                version: '1.7'
            },
            {
                title: 'Financial Reporting',
                type: 'module',
                module: 'Finance',
                status: 'review',
                lastUpdated: '2 days ago',
                author: 'Admin User',
                version: '1.2'
            },
            {
                title: 'Employee Management',
                type: 'module',
                module: 'HR',
                status: 'draft',
                lastUpdated: '1 day ago',
                author: 'Admin User',
                version: '0.8'
            }
        ];

        // Filter documents based on section
        let documents = [];

        if (section === 'all') {
            documents = [...completeManualDocs, ...moduleDocs];
        } else if (section === 'complete') {
            documents = completeManualDocs;
        } else if (section === 'module') {
            documents = moduleDocs;
        } else if (section === 'draft') {
            documents = [...completeManualDocs, ...moduleDocs].filter(doc => doc.status === 'draft');
        } else if (section === 'review') {
            documents = [...completeManualDocs, ...moduleDocs].filter(doc => doc.status === 'review');
        } else if (section === 'published') {
            documents = [...completeManualDocs, ...moduleDocs].filter(doc => doc.status === 'published');
        }

        return documents;
    }

    /**
     * Render documents in the grid
     * @param {Array} documents - Array of document objects
     */
    function renderDocuments(documents) {
        if (!documentationGrid) return;

        if (documents.length === 0) {
            documentationGrid.innerHTML = '<div class="no-documents">No documents found</div>';
            return;
        }

        let html = '';

        documents.forEach(doc => {
            html += createDocumentCard(doc);
        });

        documentationGrid.innerHTML = html;
    }

    /**
     * Create HTML for a document card
     * @param {Object} doc - Document object
     * @returns {string} - HTML for the document card
     */
    function createDocumentCard(doc) {
        const typeClass = doc.type === 'complete' ? 'complete' : 'module';
        const statusClass = doc.status;
        const statusIcon = doc.status === 'published' ? 'fa-check-circle' :
                          doc.status === 'review' ? 'fa-clipboard-check' : 'fa-pencil-alt';
        const statusText = doc.status === 'published' ? 'Published' :
                          doc.status === 'review' ? 'Under Review' : 'Draft';

        let moduleInfo = '';
        if (doc.type === 'module' && doc.module) {
            moduleInfo = `
                <div class="meta-item">
                    <i class="fas fa-puzzle-piece"></i>
                    <span>${doc.module} Module</span>
                </div>
            `;
        }

        return `
            <div class="documentation-card">
                <div class="documentation-card-header">
                    <div class="documentation-card-icon ${typeClass}">
                        <i class="fas fa-file-alt"></i>
                    </div>
                    <h3 class="documentation-card-title">${doc.title}</h3>
                </div>
                <div class="documentation-card-body">
                    <div class="documentation-card-meta">
                        <div class="meta-item">
                            <i class="fas fa-folder"></i>
                            <span>${doc.type === 'complete' ? 'Complete User Manual' : 'Module-Specific Manual'}</span>
                        </div>
                        ${moduleInfo}
                        <div class="meta-item">
                            <i class="fas fa-clock"></i>
                            <span>Last updated: ${doc.lastUpdated}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-user"></i>
                            <span>By: ${doc.author}</span>
                        </div>
                    </div>
                    <div class="documentation-card-status">
                        <span class="status-badge ${statusClass}">
                            <i class="fas ${statusIcon}"></i> ${statusText}
                        </span>
                        <span>Version: ${doc.version}</span>
                    </div>
                </div>
                <div class="documentation-card-footer">
                    <div class="card-actions">
                        <button class="card-action-btn edit" title="Edit" data-title="${doc.title}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="card-action-btn view" title="View" data-title="${doc.title}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="card-action-btn history" title="History" data-title="${doc.title}">
                            <i class="fas fa-history"></i>
                        </button>
                    </div>
                    <button class="card-action-btn" title="More Actions" data-title="${doc.title}">
                        <i class="fas fa-ellipsis-v"></i>
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Set up card action buttons
     */
    function setupCardActions() {
        // Edit buttons
        const editButtons = document.querySelectorAll('.card-action-btn.edit');
        if (editButtons && editButtons.length > 0) {
            editButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const title = this.dataset.title;
                    editDocument(title);
                });
            });
        }

        // View buttons
        const viewButtons = document.querySelectorAll('.card-action-btn.view');
        if (viewButtons && viewButtons.length > 0) {
            viewButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const title = this.dataset.title;
                    viewDocument(title);
                });
            });
        }

        // History buttons
        const historyButtons = document.querySelectorAll('.card-action-btn.history');
        if (historyButtons && historyButtons.length > 0) {
            historyButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const title = this.dataset.title;
                    viewDocumentHistory(title);
                });
            });
        }
    }

    /**
     * Search documents based on search input
     */
    function searchDocuments() {
        const searchTerm = searchInput.value.toLowerCase().trim();

        if (searchTerm === '') {
            // If search term is empty, reload current section
            const activeTab = document.querySelector('.documentation-tab.active');
            if (activeTab) {
                loadDocuments(activeTab.dataset.section);
            }
            return;
        }

        // Get all documents
        const allDocuments = generateDocuments('all');

        // Filter documents based on search term
        const filteredDocuments = allDocuments.filter(doc => {
            return doc.title.toLowerCase().includes(searchTerm) ||
                   (doc.type === 'module' && doc.module && doc.module.toLowerCase().includes(searchTerm)) ||
                   doc.status.toLowerCase().includes(searchTerm) ||
                   doc.author.toLowerCase().includes(searchTerm);
        });

        // Render filtered documents with animation
        documentationGrid.style.opacity = '0';
        documentationGrid.style.transform = 'translateY(10px)';

        setTimeout(() => {
            renderDocuments(filteredDocuments);
            setupCardActions();

            // Update toolbar title to show search results
            if (toolbarTitle) {
                toolbarTitle.innerHTML = `<i class="fas fa-search"></i> Search Results: "${searchTerm}" (${filteredDocuments.length} found)`;
            }

            documentationGrid.style.opacity = '1';
            documentationGrid.style.transform = 'translateY(0)';
        }, 200);
    }

    /**
     * Show filter options
     */
    function showFilterOptions() {
        // Create filter dropdown if it doesn't exist
        let filterDropdown = document.querySelector('.filter-dropdown');

        // Create backdrop if it doesn't exist
        let backdrop = document.querySelector('.dropdown-backdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.className = 'dropdown-backdrop';
            // Append to toolbar instead of body for proper positioning
            const toolbar = document.querySelector('.documentation-toolbar');
            if (toolbar) {
                toolbar.appendChild(backdrop);
            } else {
                document.body.appendChild(backdrop);
            }

            // Close dropdown when clicking on backdrop
            backdrop.addEventListener('click', () => {
                filterDropdown.classList.remove('show');
                backdrop.classList.remove('show');

                // Also hide sort dropdown if it's open
                const sortDropdown = document.querySelector('.sort-dropdown');
                if (sortDropdown) {
                    sortDropdown.classList.remove('show');
                }

                // Remove active class from buttons
                const filterBtn = document.getElementById('filter-btn');
                const sortBtn = document.getElementById('sort-btn');
                if (filterBtn) {
                    filterBtn.classList.remove('active');
                }
                if (sortBtn) {
                    sortBtn.classList.remove('active');
                }
            });
        }

        if (!filterDropdown) {
            filterDropdown = document.createElement('div');
            filterDropdown.className = 'filter-dropdown';
            filterDropdown.innerHTML = `
                <div class="filter-header">
                    <h4>Filter Documents</h4>
                    <button class="filter-close-btn"><i class="fas fa-times"></i></button>
                </div>
                <div class="filter-body">
                    <div class="filter-group">
                        <h5>Document Type</h5>
                        <label class="filter-checkbox">
                            <input type="checkbox" name="type" value="complete" checked> Complete Manual
                        </label>
                        <label class="filter-checkbox">
                            <input type="checkbox" name="type" value="module" checked> Module-Specific
                        </label>
                    </div>
                    <div class="filter-group">
                        <h5>Status</h5>
                        <label class="filter-checkbox">
                            <input type="checkbox" name="status" value="published" checked> Published
                        </label>
                        <label class="filter-checkbox">
                            <input type="checkbox" name="status" value="review" checked> Under Review
                        </label>
                        <label class="filter-checkbox">
                            <input type="checkbox" name="status" value="draft" checked> Draft
                        </label>
                    </div>
                </div>
                <div class="filter-footer">
                    <button class="filter-apply-btn">Apply Filters</button>
                    <button class="filter-reset-btn">Reset</button>
                </div>
            `;

            // Add filter dropdown to toolbar
            const toolbarActions = document.querySelector('.documentation-toolbar-actions');
            if (toolbarActions) {
                toolbarActions.appendChild(filterDropdown);
            }

            // Add event listeners
            const closeBtn = filterDropdown.querySelector('.filter-close-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    filterDropdown.classList.remove('show');
                    backdrop.classList.remove('show');

                    // Remove active class from filter button
                    const filterBtn = document.getElementById('filter-btn');
                    if (filterBtn) {
                        filterBtn.classList.remove('active');
                    }
                });
            }

            const applyBtn = filterDropdown.querySelector('.filter-apply-btn');
            if (applyBtn) {
                applyBtn.addEventListener('click', applyFilters);
            }

            const resetBtn = filterDropdown.querySelector('.filter-reset-btn');
            if (resetBtn) {
                resetBtn.addEventListener('click', resetFilters);
            }
        }

        // Close sort dropdown if it's open
        const sortDropdown = document.querySelector('.sort-dropdown');
        if (sortDropdown && sortDropdown.classList.contains('show')) {
            sortDropdown.classList.remove('show');
        }

        // Toggle filter dropdown
        filterDropdown.classList.toggle('show');

        // Toggle active state on filter button
        const filterBtn = document.getElementById('filter-btn');
        if (filterBtn) {
            filterBtn.classList.toggle('active', filterDropdown.classList.contains('show'));
        }

        // Toggle backdrop
        if (filterDropdown.classList.contains('show')) {
            backdrop.classList.add('show');
        } else {
            backdrop.classList.remove('show');
        }
    }

    /**
     * Apply filters to documents
     */
    function applyFilters() {
        // Get selected filters
        const typeCheckboxes = document.querySelectorAll('input[name="type"]:checked');
        const statusCheckboxes = document.querySelectorAll('input[name="status"]:checked');

        const selectedTypes = Array.from(typeCheckboxes).map(cb => cb.value);
        const selectedStatuses = Array.from(statusCheckboxes).map(cb => cb.value);

        // Get all documents
        const allDocuments = generateDocuments('all');

        // Filter documents based on selected filters
        const filteredDocuments = allDocuments.filter(doc => {
            return selectedTypes.includes(doc.type) && selectedStatuses.includes(doc.status);
        });

        // Render filtered documents with animation
        documentationGrid.style.opacity = '0';
        documentationGrid.style.transform = 'translateY(10px)';

        setTimeout(() => {
            renderDocuments(filteredDocuments);
            setupCardActions();

            // Update toolbar title to show filter results
            if (toolbarTitle) {
                toolbarTitle.innerHTML = `<i class="fas fa-filter"></i> Filtered Results (${filteredDocuments.length} documents)`;
            }

            documentationGrid.style.opacity = '1';
            documentationGrid.style.transform = 'translateY(0)';

            // Hide filter dropdown and backdrop
            const filterDropdown = document.querySelector('.filter-dropdown');
            const backdrop = document.querySelector('.dropdown-backdrop');
            const filterBtn = document.getElementById('filter-btn');

            if (filterDropdown) {
                filterDropdown.classList.remove('show');
            }
            if (backdrop) {
                backdrop.classList.remove('show');
            }
            if (filterBtn) {
                filterBtn.classList.remove('active');
            }
        }, 200);
    }

    /**
     * Reset filters
     */
    function resetFilters() {
        // Check all checkboxes
        const checkboxes = document.querySelectorAll('.filter-checkbox input');
        checkboxes.forEach(cb => {
            cb.checked = true;
        });

        // Reload current section
        const activeTab = document.querySelector('.documentation-tab.active');
        if (activeTab) {
            switchTab(activeTab.dataset.section);
        }

        // Hide filter dropdown and backdrop
        const filterDropdown = document.querySelector('.filter-dropdown');
        const backdrop = document.querySelector('.dropdown-backdrop');
        const filterBtn = document.getElementById('filter-btn');

        if (filterDropdown) {
            filterDropdown.classList.remove('show');
        }
        if (backdrop) {
            backdrop.classList.remove('show');
        }
        if (filterBtn) {
            filterBtn.classList.remove('active');
        }
    }

    /**
     * Show sort options
     */
    function showSortOptions() {
        // Create sort dropdown if it doesn't exist
        let sortDropdown = document.querySelector('.sort-dropdown');

        // Create backdrop if it doesn't exist
        let backdrop = document.querySelector('.dropdown-backdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.className = 'dropdown-backdrop';
            // Append to toolbar instead of body for proper positioning
            const toolbar = document.querySelector('.documentation-toolbar');
            if (toolbar) {
                toolbar.appendChild(backdrop);
            } else {
                document.body.appendChild(backdrop);
            }

            // Close dropdown when clicking on backdrop
            backdrop.addEventListener('click', () => {
                sortDropdown.classList.remove('show');
                backdrop.classList.remove('show');

                // Also hide filter dropdown if it's open
                const filterDropdown = document.querySelector('.filter-dropdown');
                if (filterDropdown) {
                    filterDropdown.classList.remove('show');
                }

                // Remove active class from buttons
                const filterBtn = document.getElementById('filter-btn');
                const sortBtn = document.getElementById('sort-btn');
                if (filterBtn) {
                    filterBtn.classList.remove('active');
                }
                if (sortBtn) {
                    sortBtn.classList.remove('active');
                }
            });
        }

        if (!sortDropdown) {
            sortDropdown = document.createElement('div');
            sortDropdown.className = 'sort-dropdown';
            sortDropdown.innerHTML = `
                <div class="sort-header">
                    <h4>Sort Documents</h4>
                    <button class="sort-close-btn"><i class="fas fa-times"></i></button>
                </div>
                <div class="sort-body">
                    <div class="sort-option" data-sort="title-asc">
                        <i class="fas fa-sort-alpha-down"></i> Title (A-Z)
                    </div>
                    <div class="sort-option" data-sort="title-desc">
                        <i class="fas fa-sort-alpha-down-alt"></i> Title (Z-A)
                    </div>
                    <div class="sort-option" data-sort="date-newest">
                        <i class="fas fa-clock"></i> Newest First
                    </div>
                    <div class="sort-option" data-sort="date-oldest">
                        <i class="fas fa-history"></i> Oldest First
                    </div>
                    <div class="sort-option" data-sort="status">
                        <i class="fas fa-tasks"></i> By Status
                    </div>
                    <div class="sort-option" data-sort="type">
                        <i class="fas fa-folder"></i> By Type
                    </div>
                </div>
            `;

            // Add sort dropdown to toolbar
            const toolbarActions = document.querySelector('.documentation-toolbar-actions');
            if (toolbarActions) {
                toolbarActions.appendChild(sortDropdown);
            }

            // Add event listeners
            const closeBtn = sortDropdown.querySelector('.sort-close-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    sortDropdown.classList.remove('show');
                    backdrop.classList.remove('show');

                    // Remove active class from sort button
                    const sortBtn = document.getElementById('sort-btn');
                    if (sortBtn) {
                        sortBtn.classList.remove('active');
                    }
                });
            }

            const sortOptions = sortDropdown.querySelectorAll('.sort-option');
            if (sortOptions) {
                sortOptions.forEach(option => {
                    option.addEventListener('click', () => {
                        sortDocuments(option.dataset.sort);
                        sortDropdown.classList.remove('show');
                        backdrop.classList.remove('show');

                        // Remove active class from sort button
                        const sortBtn = document.getElementById('sort-btn');
                        if (sortBtn) {
                            sortBtn.classList.remove('active');
                        }
                    });
                });
            }
        }

        // Close filter dropdown if it's open
        const filterDropdown = document.querySelector('.filter-dropdown');
        if (filterDropdown && filterDropdown.classList.contains('show')) {
            filterDropdown.classList.remove('show');
        }

        // Toggle sort dropdown
        sortDropdown.classList.toggle('show');

        // Toggle active state on sort button
        const sortBtn = document.getElementById('sort-btn');
        if (sortBtn) {
            sortBtn.classList.toggle('active', sortDropdown.classList.contains('show'));
        }

        // Toggle backdrop
        if (sortDropdown.classList.contains('show')) {
            backdrop.classList.add('show');
        } else {
            backdrop.classList.remove('show');
        }
    }

    /**
     * Sort documents
     * @param {string} sortOption - Sort option
     */
    function sortDocuments(sortOption) {
        // Get current documents
        const activeTab = document.querySelector('.documentation-tab.active');
        const section = activeTab ? activeTab.dataset.section : 'all';
        let documents = generateDocuments(section);

        // Sort documents based on option
        switch (sortOption) {
            case 'title-asc':
                documents.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'title-desc':
                documents.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case 'date-newest':
                // This is a simplified sort based on the "lastUpdated" text
                // In a real app, you'd sort by actual date objects
                documents.sort((a, b) => {
                    if (a.lastUpdated.includes('hour') && !b.lastUpdated.includes('hour')) return -1;
                    if (!a.lastUpdated.includes('hour') && b.lastUpdated.includes('hour')) return 1;
                    if (a.lastUpdated.includes('day') && b.lastUpdated.includes('week')) return -1;
                    if (a.lastUpdated.includes('week') && b.lastUpdated.includes('day')) return 1;
                    return 0;
                });
                break;
            case 'date-oldest':
                // Reverse of newest first
                documents.sort((a, b) => {
                    if (a.lastUpdated.includes('hour') && !b.lastUpdated.includes('hour')) return 1;
                    if (!a.lastUpdated.includes('hour') && b.lastUpdated.includes('hour')) return -1;
                    if (a.lastUpdated.includes('day') && b.lastUpdated.includes('week')) return 1;
                    if (a.lastUpdated.includes('week') && b.lastUpdated.includes('day')) return -1;
                    return 0;
                });
                break;
            case 'status':
                // Sort by status: published, review, draft
                documents.sort((a, b) => {
                    const statusOrder = { published: 1, review: 2, draft: 3 };
                    return statusOrder[a.status] - statusOrder[b.status];
                });
                break;
            case 'type':
                // Sort by type: complete, module
                documents.sort((a, b) => {
                    if (a.type === b.type) return a.title.localeCompare(b.title);
                    return a.type === 'complete' ? -1 : 1;
                });
                break;
        }

        // Render sorted documents with animation
        documentationGrid.style.opacity = '0';
        documentationGrid.style.transform = 'translateY(10px)';

        setTimeout(() => {
            renderDocuments(documents);
            setupCardActions();

            // Update toolbar title to show sort method
            if (toolbarTitle) {
                let sortTitle = '';
                switch (sortOption) {
                    case 'title-asc': sortTitle = 'Title (A-Z)'; break;
                    case 'title-desc': sortTitle = 'Title (Z-A)'; break;
                    case 'date-newest': sortTitle = 'Newest First'; break;
                    case 'date-oldest': sortTitle = 'Oldest First'; break;
                    case 'status': sortTitle = 'By Status'; break;
                    case 'type': sortTitle = 'By Type'; break;
                }

                toolbarTitle.innerHTML = `<i class="fas fa-sort"></i> Sorted by: ${sortTitle}`;
            }

            documentationGrid.style.opacity = '1';
            documentationGrid.style.transform = 'translateY(0)';
        }, 200);
    }

    function createDocument() {
        // Implementation would create a new document
        console.log('Creating new document...');

        // Simulate redirect to document editor
        setTimeout(() => {
            window.location.href = 'content-manager.html?action=add&type=documentation';
        }, 1000);
    }

    function editDocument(title) {
        // Implementation would edit the document
        console.log(`Editing document: ${title}`);

        // Simulate redirect to document editor
        setTimeout(() => {
            window.location.href = `content-manager.html?action=edit&title=${encodeURIComponent(title)}`;
        }, 1000);
    }

    function viewDocument(title) {
        // Implementation would view the document
        console.log(`Viewing document: ${title}`);

        // Simulate redirect to document viewer
        setTimeout(() => {
            window.open('../Complete_User Manual/index.html', '_blank');
        }, 1000);
    }

    function viewDocumentHistory(title) {
        // Implementation would view document history
        console.log(`Viewing history for document: ${title}`);

        // Simulate redirect to version history page
        setTimeout(() => {
            window.location.href = `version-manager.html?content=${encodeURIComponent(title.toLowerCase().replace(/\s+/g, '-'))}`;
        }, 1000);
    }

    function syncDocumentation() {
        // Implementation would sync documentation
        console.log('Syncing documentation...');
    }

    function publishAllPending() {
        // Implementation would publish all pending documents
        console.log('Publishing all pending documents...');
    }

    function showExportOptions() {
        // Implementation would show export options
        console.log('Showing export options...');
    }
});
