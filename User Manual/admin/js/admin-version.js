/**
 * Admin Version Management Module
 * Handles content versioning across tenants and locales
 */
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const adminTabs = document.querySelectorAll('.admin-tab');
    const tabContents = document.querySelectorAll('.admin-tab-content');
    const searchInput = document.querySelector('.admin-search-bar input');
    const filterContent = document.getElementById('filter-content');
    const filterTenant = document.getElementById('filter-tenant');
    const filterLocale = document.getElementById('filter-locale');
    const filterAuthor = document.getElementById('filter-author');
    const filterTag = document.getElementById('filter-tag');
    const filterDateFrom = document.getElementById('filter-date-from');
    const filterDateTo = document.getElementById('filter-date-to');
    const applyFiltersButton = document.getElementById('apply-filters');
    const resetFiltersButton = document.getElementById('reset-filters');
    const exportPdfButton = document.getElementById('export-pdf');
    const exportCsvButton = document.getElementById('export-csv');
    const actionButtons = document.querySelectorAll('.action-btn');

    // Timeline Elements
    const timelineContent = document.getElementById('timeline-content');
    const timelineTenant = document.getElementById('timeline-tenant');
    const timelineLocale = document.getElementById('timeline-locale');
    const timelineDateFrom = document.getElementById('timeline-date-from');
    const timelineDateTo = document.getElementById('timeline-date-to');
    const filterBtn = document.getElementById('filter-btn');
    const timelineFilterPanel = document.querySelector('.timeline-filter-panel');
    const applyTimelineFilterButton = document.getElementById('apply-timeline-filter');
    const resetTimelineFilterButton = document.getElementById('reset-timeline-filter');

    // Compare Version Elements
    const compareContent = document.getElementById('compare-content');
    const compareVersionA = document.getElementById('compare-version-a');
    const compareVersionB = document.getElementById('compare-version-b');
    const compareVersionsButton = document.getElementById('compare-versions-btn');
    const versionAContent = document.getElementById('version-a-content');
    const versionBContent = document.getElementById('version-b-content');
    const versionATenant = document.getElementById('version-a-tenant');
    const versionALocale = document.getElementById('version-a-locale');
    const versionADate = document.getElementById('version-a-date');
    const versionBTenant = document.getElementById('version-b-tenant');
    const versionBLocale = document.getElementById('version-b-locale');
    const versionBDate = document.getElementById('version-b-date');

    // Version Settings Form
    const versionSettingsForm = document.getElementById('version-settings-form');
    const versionNumberingSelect = document.getElementById('version-numbering');
    const versionExportFormatSelect = document.getElementById('version-export-format');
    const versionTaggingToggle = document.getElementById('version-tagging');

    // Sample version data (in a real application, this would come from the server)
    const versionData = {
        'getting-started': [
            {
                id: 'gs-v2.1',
                version: 'v2.1',
                tenant: 'global',
                tenantName: 'Global',
                locale: 'en-US',
                localeName: 'English (US)',
                modifiedBy: 'John Doe',
                modifiedDate: 'May 15, 2025',
                status: 'current',
                content: `
                    <h1>Getting Started</h1>
                    <p>Welcome to the Order Management System (OMS). This guide will help you get started with the system and understand its basic functionality.</p>
                    <h2>System Requirements</h2>
                    <p>To use the OMS, you need:</p>
                    <ul>
                        <li>A modern web browser (Chrome, Firefox, Safari, or Edge)</li>
                        <li>Internet connection</li>
                        <li>Valid user credentials</li>
                        <li>Proper permissions assigned to your account</li>
                    </ul>
                    <h2>Logging In</h2>
                    <p>To log in to the system, navigate to the login page and enter your username and password.</p>
                    <p>If you're having trouble logging in, please contact your system administrator.</p>
                `
            },
            {
                id: 'gs-v2.0',
                version: 'v2.0',
                tenant: 'global',
                tenantName: 'Global',
                locale: 'en-US',
                localeName: 'English (US)',
                modifiedBy: 'Jane Smith',
                modifiedDate: 'May 10, 2025',
                status: 'archived',
                content: `
                    <h1>Getting Started</h1>
                    <p>Welcome to the Order Management System (OMS). This guide will help you get started with the system and understand its basic functionality.</p>
                    <h2>System Requirements</h2>
                    <p>To use the OMS, you need:</p>
                    <ul>
                        <li>A modern web browser (Chrome, Firefox, Safari, or Edge)</li>
                        <li>Internet connection</li>
                        <li>Valid user credentials</li>
                    </ul>
                    <h2>Logging In</h2>
                    <p>To log in to the system, navigate to the login page and enter your username and password.</p>
                `
            }
        ],
        'managing-orders': [
            {
                id: 'mo-v1.5',
                version: 'v1.5',
                tenant: 'acme-corp',
                tenantName: 'Acme Corp',
                locale: 'en-US',
                localeName: 'English (US)',
                modifiedBy: 'Mike Johnson',
                modifiedDate: 'May 12, 2025',
                status: 'current',
                content: `
                    <h1>Managing Orders</h1>
                    <p>The Order Management System allows you to create, view, edit, and track orders efficiently.</p>
                    <h2>Creating a New Order</h2>
                    <p>To create a new order, click the "New Order" button in the top right corner of the dashboard. This will open the order creation form.</p>
                    <p>Fill in all required fields and click "Save" to create the order.</p>
                    <h2>Viewing Orders</h2>
                    <p>You can view all orders in the Orders tab. Use the filters to narrow down the list based on status, date, customer, or other criteria.</p>
                    <h2>Acme-Specific Order Processing</h2>
                    <p>For Acme Corporation, orders go through an additional approval process before being fulfilled.</p>
                `
            },
            {
                id: 'mo-v1.4',
                version: 'v1.4',
                tenant: 'acme-corp',
                tenantName: 'Acme Corp',
                locale: 'en-US',
                localeName: 'English (US)',
                modifiedBy: 'Mike Johnson',
                modifiedDate: 'May 08, 2025',
                status: 'archived',
                content: `
                    <h1>Managing Orders</h1>
                    <p>The Order Management System allows you to create, view, edit, and track orders efficiently.</p>
                    <h2>Creating a New Order</h2>
                    <p>To create a new order, click the "New Order" button in the top right corner of the dashboard. This will open the order creation form.</p>
                    <h2>Viewing Orders</h2>
                    <p>You can view all orders in the Orders tab. Use the filters to narrow down the list based on status, date, customer, or other criteria.</p>
                    <h2>Acme-Specific Order Processing</h2>
                    <p>For Acme Corporation, orders require manager approval before processing.</p>
                `
            }
        ],
        'products': [
            {
                id: 'prod-v1.2',
                version: 'v1.2',
                tenant: 'global',
                tenantName: 'Global',
                locale: 'de-DE',
                localeName: 'German',
                modifiedBy: 'Anna Müller',
                modifiedDate: 'May 14, 2025',
                status: 'current',
                content: `
                    <h1>Produkte</h1>
                    <p>Der Bereich "Produkte" ermöglicht es Ihnen, Ihren Produktkatalog zu verwalten, einschließlich des Hinzufügens neuer Produkte, der Aktualisierung bestehender Produkte und der Verwaltung des Inventars.</p>
                    <h2>Hinzufügen eines neuen Produkts</h2>
                    <p>Um ein neues Produkt hinzuzufügen, klicken Sie auf die Schaltfläche "Produkt hinzufügen" im Bereich "Produkte". Füllen Sie die erforderlichen Informationen aus und klicken Sie auf "Speichern".</p>
                    <h2>Inventarverwaltung</h2>
                    <p>Sie können die Lagerbestände für jedes Produkt aktualisieren, indem Sie das Produkt bearbeiten und das Feld "Bestand" anpassen.</p>
                `
            }
        ]
    };

    // Initialize version management
    initVersionManagement();

    /**
     * Initialize version management components and event listeners
     */
    function initVersionManagement() {
        // Set up tabs
        if (adminTabs.length > 0) {
            adminTabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    const tabId = this.dataset.tab;
                    switchTab(tabId);
                });
            });
        }

        // Set up search functionality
        if (searchInput) {
            searchInput.addEventListener('input', searchVersions);
        }

        // Set up filter functionality
        if (applyFiltersButton) {
            applyFiltersButton.addEventListener('click', applyFilters);
        }

        // Set up reset filters button
        if (resetFiltersButton) {
            resetFiltersButton.addEventListener('click', resetFilters);
        }

        // Set up export buttons
        if (exportPdfButton) {
            exportPdfButton.addEventListener('click', function(e) {
                e.preventDefault();
                exportVersionHistory('pdf');
            });
        }

        if (exportCsvButton) {
            exportCsvButton.addEventListener('click', function(e) {
                e.preventDefault();
                exportVersionHistory('csv');
            });
        }

        // Set up export button dropdown
        const exportButton = document.getElementById('export-button');
        if (exportButton) {
            exportButton.addEventListener('click', function(e) {
                e.preventDefault();
                // This is just to ensure the dropdown works on mobile
                const exportMenu = document.querySelector('.export-menu');
                if (exportMenu) {
                    exportMenu.style.display = exportMenu.style.display === 'block' ? 'none' : 'block';
                }
            });
        }

        // Set up timeline filter panel toggle
        if (filterBtn && timelineFilterPanel) {
            filterBtn.addEventListener('click', function() {
                timelineFilterPanel.style.display = timelineFilterPanel.style.display === 'block' ? 'none' : 'block';
            });
        }

        // Set up timeline filter apply button
        if (applyTimelineFilterButton) {
            applyTimelineFilterButton.addEventListener('click', filterTimeline);
        }

        // Set up timeline filter reset button
        if (resetTimelineFilterButton) {
            resetTimelineFilterButton.addEventListener('click', resetTimelineFilters);
        }

        // Set up action buttons
        if (actionButtons.length > 0) {
            actionButtons.forEach(button => {
                button.addEventListener('click', handleActionButton);
            });
        }

        // Set up compare content select
        if (compareContent) {
            compareContent.addEventListener('change', updateVersionSelects);
        }

        // Set up version selects
        if (compareVersionA) {
            compareVersionA.addEventListener('change', updateVersionMetadata);
        }

        if (compareVersionB) {
            compareVersionB.addEventListener('change', updateVersionMetadata);
        }

        // Set up compare button
        if (compareVersionsButton) {
            compareVersionsButton.addEventListener('click', compareVersions);
        }

        // Set up version settings form
        if (versionSettingsForm) {
            versionSettingsForm.addEventListener('submit', saveVersionSettings);
        }

        // Initialize date pickers with current date range (last 30 days)
        if (filterDateFrom && filterDateTo) {
            const today = new Date();
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(today.getDate() - 30);

            filterDateFrom.valueAsDate = thirtyDaysAgo;
            filterDateTo.valueAsDate = today;
        }

        // Check URL parameters
        checkUrlParams();
    }

    /**
     * Switch between tabs
     * @param {string} tabId - ID of the tab to switch to
     */
    function switchTab(tabId) {
        // Remove active class from all tabs and tab contents
        adminTabs.forEach(tab => tab.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Add active class to selected tab and tab content
        const selectedTab = document.querySelector(`.admin-tab[data-tab="${tabId}"]`);
        const selectedContent = document.getElementById(tabId);

        if (selectedTab && selectedContent) {
            selectedTab.classList.add('active');
            selectedContent.classList.add('active');
        }
    }

    /**
     * Search versions in the table
     */
    function searchVersions() {
        const searchTerm = searchInput.value.toLowerCase();
        const versionRows = document.querySelectorAll('.admin-content-table tbody tr');

        versionRows.forEach(row => {
            const content = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
            const version = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
            const tenant = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
            const locale = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
            const modifiedBy = row.querySelector('td:nth-child(5)').textContent.toLowerCase();

            if (content.includes(searchTerm) || version.includes(searchTerm) ||
                tenant.includes(searchTerm) || locale.includes(searchTerm) ||
                modifiedBy.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    /**
     * Apply filters to version table
     */
    function applyFilters() {
        const content = filterContent ? filterContent.value : '';
        const tenant = filterTenant ? filterTenant.value : '';
        const locale = filterLocale ? filterLocale.value : '';
        const author = filterAuthor ? filterAuthor.value : '';
        const tag = filterTag ? filterTag.value : '';
        const dateFrom = filterDateFrom ? new Date(filterDateFrom.value) : null;
        const dateTo = filterDateTo ? new Date(filterDateTo.value) : null;

        const versionRows = document.querySelectorAll('.admin-content-table tbody tr');

        versionRows.forEach(row => {
            const rowContent = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
            const rowTenant = row.querySelector('td:nth-child(3) .tenant-badge').textContent.trim().toLowerCase();
            const rowLocale = row.querySelector('td:nth-child(4) .locale-badge').textContent.trim().toLowerCase();
            const rowAuthor = row.querySelector('td:nth-child(5)').textContent.toLowerCase();
            const rowTags = Array.from(row.querySelectorAll('td:nth-child(7) .tag-badge')).map(tag => tag.textContent.toLowerCase());
            const rowDate = new Date(row.querySelector('td:nth-child(6)').textContent);

            // Check if row matches all selected filters
            const matchesContent = !content || rowContent.includes(content.toLowerCase());
            const matchesTenant = !tenant || rowTenant.includes(getTenantDisplayName(tenant).toLowerCase());
            const matchesLocale = !locale || rowLocale.includes(locale.toLowerCase());
            const matchesAuthor = !author || rowAuthor.includes(author.toLowerCase());
            const matchesTag = !tag || rowTags.some(t => t.includes(tag.toLowerCase()));
            const matchesDateRange = (!dateFrom || rowDate >= dateFrom) && (!dateTo || rowDate <= dateTo);

            // Show/hide row based on filter matches
            if (matchesContent && matchesTenant && matchesLocale && matchesAuthor && matchesTag && matchesDateRange) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });

        showNotification('Filters applied successfully', 'info');
    }

    /**
     * Reset all filters to default values
     */
    function resetFilters() {
        if (filterContent) filterContent.selectedIndex = 0;
        if (filterTenant) filterTenant.selectedIndex = 0;
        if (filterLocale) filterLocale.selectedIndex = 0;
        if (filterAuthor) filterAuthor.selectedIndex = 0;
        if (filterTag) filterTag.selectedIndex = 0;

        // Reset date range to last 30 days
        if (filterDateFrom && filterDateTo) {
            const today = new Date();
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(today.getDate() - 30);

            filterDateFrom.valueAsDate = thirtyDaysAgo;
            filterDateTo.valueAsDate = today;
        }

        // Show all rows
        const versionRows = document.querySelectorAll('.admin-content-table tbody tr');
        versionRows.forEach(row => {
            row.style.display = '';
        });

        showNotification('Filters have been reset', 'info');
    }

    /**
     * Filter timeline view based on selected content, tenant, locale, and date range
     */
    function filterTimeline() {
        const content = timelineContent ? timelineContent.value : '';
        const tenant = timelineTenant ? timelineTenant.value : '';
        const locale = timelineLocale ? timelineLocale.value : '';
        const dateFrom = timelineDateFrom ? new Date(timelineDateFrom.value) : null;
        const dateTo = timelineDateTo ? new Date(timelineDateTo.value) : null;
        const timelineItems = document.querySelectorAll('.timeline-item');

        timelineItems.forEach(item => {
            // Extract date from the timeline item
            const dayEl = item.querySelector('.date-day');
            const monthEl = item.querySelector('.date-month');
            const yearEl = item.querySelector('.date-year');

            let itemDate = null;
            if (dayEl && monthEl && yearEl) {
                const monthMap = {
                    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
                    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
                };
                const monthIdx = monthMap[monthEl.textContent] || 0;
                itemDate = new Date(
                    parseInt(yearEl.textContent),
                    monthIdx,
                    parseInt(dayEl.textContent)
                );
            }

            // Extract content, tenant, and locale information
            const itemContent = item.querySelector('.document-info h4').textContent.toLowerCase();
            const metaItems = item.querySelectorAll('.version-meta .meta-item');
            let itemTenant = '';
            let itemLocale = '';

            metaItems.forEach(meta => {
                const text = meta.textContent.toLowerCase();
                if (meta.querySelector('.fa-globe-americas') || meta.querySelector('.fa-building')) {
                    itemTenant = text;
                } else if (meta.querySelector('.fa-language')) {
                    itemLocale = text;
                }
            });

            // Check if item matches all filters
            const matchesContent = !content || itemContent.includes(content.toLowerCase());
            const matchesTenant = !tenant || itemTenant.includes(tenant.toLowerCase());
            const matchesLocale = !locale || itemLocale.includes(locale.toLowerCase());
            const matchesDateRange = !itemDate ||
                                    (!dateFrom || itemDate >= dateFrom) &&
                                    (!dateTo || itemDate <= dateTo);

            if (matchesContent && matchesTenant && matchesLocale && matchesDateRange) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });

        // Hide the filter panel after applying filters
        if (timelineFilterPanel) {
            timelineFilterPanel.style.display = 'none';
        }

        showNotification('Timeline filtered successfully', 'info');
    }

    /**
     * Reset timeline filters to default values
     */
    function resetTimelineFilters() {
        if (timelineContent) timelineContent.selectedIndex = 0;
        if (timelineTenant) timelineTenant.selectedIndex = 0;
        if (timelineLocale) timelineLocale.selectedIndex = 0;

        // Reset date range to last 30 days
        if (timelineDateFrom && timelineDateTo) {
            const today = new Date();
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(today.getDate() - 30);

            // Format dates as YYYY-MM-DD for input fields
            timelineDateFrom.value = thirtyDaysAgo.toISOString().split('T')[0];
            timelineDateTo.value = today.toISOString().split('T')[0];
        }

        // Show all timeline items
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach(item => {
            item.style.display = '';
        });

        showNotification('Timeline filters have been reset', 'info');
    }

    /**
     * Export version history in the specified format
     * @param {string} format - Export format (pdf, csv)
     */
    function exportVersionHistory(format) {
        // In a real application, this would generate and download the export file
        // For this demo, we'll just show a notification

        const formatName = format === 'pdf' ? 'PDF' : format === 'csv' ? 'CSV' : format.toUpperCase();
        showNotification(`Version history exported as ${formatName}`, 'success');

        // Simulate download delay
        setTimeout(() => {
            const link = document.createElement('a');
            link.href = '#';
            link.download = `version-history.${format}`;
            link.click();
        }, 1000);
    }

    /**
     * Handle action button clicks
     */
    function handleActionButton() {
        const action = this.classList.contains('view') ? 'view' :
                      this.classList.contains('restore') ? 'restore' :
                      this.classList.contains('compare') ? 'compare' :
                      this.classList.contains('tag') ? 'tag' :
                      this.classList.contains('notes') ? 'notes' :
                      this.classList.contains('export') ? 'export' : '';

        // Check if the button is in a table row or timeline item
        const row = this.closest('tr');
        const timelineItem = this.closest('.timeline-item');

        let content, version;

        if (row) {
            // Button is in a table row
            content = row.querySelector('td:nth-child(1)').textContent;
            version = row.querySelector('td:nth-child(2) .version-badge').textContent;
        } else if (timelineItem) {
            // Button is in a timeline item
            content = timelineItem.querySelector('.document-info h4').textContent;
            version = timelineItem.querySelector('.version-badge').textContent;
        } else {
            return; // Exit if we can't determine the context
        }

        switch (action) {
            case 'view':
                // In a real application, this would open a view of the specific version
                showNotification(`Viewing ${content} ${version}`, 'info');
                break;

            case 'restore':
                // In a real application, this would restore the version with a confirmation dialog
                showVersionRestoreDialog(content, version);
                break;

            case 'compare':
                // Switch to compare tab and set up comparison
                switchTab('version-compare');

                // Set content select
                if (compareContent) {
                    for (let i = 0; i < compareContent.options.length; i++) {
                        if (compareContent.options[i].text === content) {
                            compareContent.selectedIndex = i;
                            break;
                        }
                    }

                    // Update version selects
                    updateVersionSelects();

                    // Set version A to the selected version
                    if (compareVersionA) {
                        for (let i = 0; i < compareVersionA.options.length; i++) {
                            if (compareVersionA.options[i].text === version) {
                                compareVersionA.selectedIndex = i;
                                break;
                            }
                        }

                        // Update version metadata
                        updateVersionMetadata();
                    }
                }
                break;

            case 'tag':
                // Show tag management dialog
                showTagManagementDialog(content, version, row);
                break;

            case 'notes':
                // Show version notes dialog
                showVersionNotesDialog(content, version);
                break;

            case 'export':
                // Show export options dialog
                showExportOptionsDialog(content, version);
                break;
        }
    }

    /**
     * Show version restore confirmation dialog
     * @param {string} content - Content title
     * @param {string} version - Version number
     */
    function showVersionRestoreDialog(content, version) {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';

        // Create modal dialog
        const dialog = document.createElement('div');
        dialog.className = 'modal-dialog';

        // Create dialog content
        dialog.innerHTML = `
            <div class="modal-header">
                <h3><i class="fas fa-undo"></i> Restore Version</h3>
                <button class="modal-close"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <p>Are you sure you want to restore <strong>${content}</strong> to <strong>${version}</strong>?</p>
                <p>This action will replace the current version with this version. All changes made since this version will be lost.</p>
                <div class="form-group">
                    <label for="restore-note">Add a note about this restoration (optional):</label>
                    <textarea id="restore-note" class="admin-textarea" rows="3" placeholder="Describe why you're restoring this version..."></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button class="admin-button secondary" id="cancel-restore">Cancel</button>
                <button class="admin-button" id="confirm-restore">Restore Version</button>
            </div>
        `;

        // Add dialog to overlay and overlay to document
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        // Set up event listeners
        const closeButton = dialog.querySelector('.modal-close');
        const cancelButton = dialog.querySelector('#cancel-restore');
        const confirmButton = dialog.querySelector('#confirm-restore');

        closeButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });

        cancelButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });

        confirmButton.addEventListener('click', () => {
            const note = dialog.querySelector('#restore-note').value;
            document.body.removeChild(overlay);

            // In a real application, this would restore the version
            showNotification(`Restored ${content} to ${version}`, 'success');

            // If a note was provided, show it
            if (note) {
                showNotification(`Note added: ${note}`, 'info');
            }
        });
    }

    /**
     * Show tag management dialog
     * @param {string} content - Content title
     * @param {string} version - Version number
     * @param {HTMLElement} row - Table row element
     */
    function showTagManagementDialog(content, version, row) {
        // Get current tags
        const tagElements = row.querySelectorAll('td:nth-child(7) .tag-badge');
        const currentTags = Array.from(tagElements).map(tag => tag.textContent);

        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';

        // Create modal dialog
        const dialog = document.createElement('div');
        dialog.className = 'modal-dialog';

        // Create dialog content
        dialog.innerHTML = `
            <div class="modal-header">
                <h3><i class="fas fa-tag"></i> Manage Tags</h3>
                <button class="modal-close"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <p>Manage tags for <strong>${content}</strong> <strong>${version}</strong>:</p>
                <div class="tag-management">
                    <div class="current-tags">
                        <h4>Current Tags</h4>
                        <div class="tag-list">
                            ${currentTags.map(tag => `
                                <div class="tag-item">
                                    <span class="tag-badge">${tag}</span>
                                    <button class="tag-remove" data-tag="${tag}"><i class="fas fa-times"></i></button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="add-tag">
                        <h4>Add Tag</h4>
                        <div class="tag-add-form">
                            <select id="tag-select" class="admin-select">
                                <option value="">Select a tag</option>
                                <option value="Published">Published</option>
                                <option value="Draft">Draft</option>
                                <option value="Reviewed">Reviewed</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Tenant-Specific">Tenant-Specific</option>
                                <option value="Translation">Translation</option>
                            </select>
                            <button id="add-tag-btn" class="admin-button">Add</button>
                        </div>
                        <div class="custom-tag">
                            <input type="text" id="custom-tag" class="admin-input" placeholder="Or enter a custom tag...">
                            <button id="add-custom-tag-btn" class="admin-button">Add Custom Tag</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="admin-button secondary" id="cancel-tags">Cancel</button>
                <button class="admin-button" id="save-tags">Save Tags</button>
            </div>
        `;

        // Add dialog to overlay and overlay to document
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        // Set up event listeners
        const closeButton = dialog.querySelector('.modal-close');
        const cancelButton = dialog.querySelector('#cancel-tags');
        const saveButton = dialog.querySelector('#save-tags');
        const addTagButton = dialog.querySelector('#add-tag-btn');
        const addCustomTagButton = dialog.querySelector('#add-custom-tag-btn');
        const tagSelect = dialog.querySelector('#tag-select');
        const customTagInput = dialog.querySelector('#custom-tag');

        closeButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });

        cancelButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });

        addTagButton.addEventListener('click', () => {
            const selectedTag = tagSelect.value;
            if (selectedTag) {
                addTagToDialog(selectedTag, dialog);
                tagSelect.value = '';
            }
        });

        addCustomTagButton.addEventListener('click', () => {
            const customTag = customTagInput.value.trim();
            if (customTag) {
                addTagToDialog(customTag, dialog);
                customTagInput.value = '';
            }
        });

        // Set up remove tag buttons
        const removeButtons = dialog.querySelectorAll('.tag-remove');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tagItem = this.closest('.tag-item');
                tagItem.remove();
            });
        });

        saveButton.addEventListener('click', () => {
            // Get updated tags
            const updatedTags = Array.from(dialog.querySelectorAll('.tag-list .tag-badge')).map(tag => tag.textContent);

            document.body.removeChild(overlay);

            // In a real application, this would save the tags to the server
            showNotification(`Tags updated for ${content} ${version}`, 'success');

            // For demo purposes, update the tags in the table
            const tagsCell = row.querySelector('td:nth-child(7)');
            tagsCell.innerHTML = updatedTags.map(tag => {
                const tagClass = tag.toLowerCase().replace(/\s+/g, '-');
                return `<span class="tag-badge ${tagClass}">${tag}</span>`;
            }).join('\n');
        });
    }

    /**
     * Add a tag to the tag management dialog
     * @param {string} tag - Tag text
     * @param {HTMLElement} dialog - Dialog element
     */
    function addTagToDialog(tag, dialog) {
        // Check if tag already exists
        const existingTags = Array.from(dialog.querySelectorAll('.tag-list .tag-badge')).map(tag => tag.textContent);
        if (existingTags.includes(tag)) {
            showNotification('This tag already exists', 'warning');
            return;
        }

        // Create new tag item
        const tagItem = document.createElement('div');
        tagItem.className = 'tag-item';
        tagItem.innerHTML = `
            <span class="tag-badge">${tag}</span>
            <button class="tag-remove" data-tag="${tag}"><i class="fas fa-times"></i></button>
        `;

        // Add remove event listener
        const removeButton = tagItem.querySelector('.tag-remove');
        removeButton.addEventListener('click', function() {
            tagItem.remove();
        });

        // Add to tag list
        const tagList = dialog.querySelector('.tag-list');
        tagList.appendChild(tagItem);
    }

    /**
     * Show version notes dialog
     * @param {string} content - Content title
     * @param {string} version - Version number
     */
    function showVersionNotesDialog(content, version) {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';

        // Create modal dialog
        const dialog = document.createElement('div');
        dialog.className = 'modal-dialog';

        // Sample notes (in a real application, these would come from the server)
        const notes = version === 'v2.1' ? 'Added system requirements and improved login instructions' :
                     version === 'v2.0' ? 'Initial version of updated getting started guide' :
                     version === 'v1.5' ? 'Updated Acme-specific order processing workflow' :
                     version === 'v1.4' ? 'Added manager approval process for Acme Corp' :
                     version === 'v1.2' ? 'German translation of product management section' : '';

        // Create dialog content
        dialog.innerHTML = `
            <div class="modal-header">
                <h3><i class="fas fa-sticky-note"></i> Version Notes</h3>
                <button class="modal-close"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <p><strong>${content}</strong> <strong>${version}</strong></p>
                <div class="form-group">
                    <label for="version-notes">Notes:</label>
                    <textarea id="version-notes" class="admin-textarea" rows="5">${notes}</textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button class="admin-button secondary" id="cancel-notes">Cancel</button>
                <button class="admin-button" id="save-notes">Save Notes</button>
            </div>
        `;

        // Add dialog to overlay and overlay to document
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        // Set up event listeners
        const closeButton = dialog.querySelector('.modal-close');
        const cancelButton = dialog.querySelector('#cancel-notes');
        const saveButton = dialog.querySelector('#save-notes');

        closeButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });

        cancelButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });

        saveButton.addEventListener('click', () => {
            const updatedNotes = dialog.querySelector('#version-notes').value;
            document.body.removeChild(overlay);

            // In a real application, this would save the notes to the server
            showNotification(`Notes updated for ${content} ${version}`, 'success');

            // For demo purposes, update the change description in the table
            const row = document.querySelector(`.admin-content-table tbody tr td:nth-child(2) .version-badge[textContent="${version}"]`).closest('tr');
            if (row) {
                const descriptionCell = row.querySelector('td:nth-child(8)');
                if (descriptionCell) {
                    descriptionCell.textContent = updatedNotes;
                }
            }
        });
    }

    /**
     * Update version selects based on selected content
     */
    function updateVersionSelects() {
        const contentKey = compareContent.value;

        // Clear version selects
        compareVersionA.innerHTML = '<option value="">Select version</option>';
        compareVersionB.innerHTML = '<option value="">Select version</option>';

        // Reset metadata
        versionATenant.textContent = '-';
        versionALocale.textContent = '-';
        versionADate.textContent = '-';
        versionBTenant.textContent = '-';
        versionBLocale.textContent = '-';
        versionBDate.textContent = '-';

        // Reset content
        versionAContent.innerHTML = '<p>Select versions to compare</p>';
        versionBContent.innerHTML = '<p>Select versions to compare</p>';

        if (!contentKey) return;

        // Get versions for the selected content
        const versions = versionData[contentKey];

        if (versions && versions.length > 0) {
            // Add versions to selects
            versions.forEach(version => {
                const optionA = document.createElement('option');
                optionA.value = version.id;
                optionA.text = version.version;
                compareVersionA.appendChild(optionA);

                const optionB = document.createElement('option');
                optionB.value = version.id;
                optionB.text = version.version;
                compareVersionB.appendChild(optionB);
            });

            // Set default selections
            if (versions.length >= 2) {
                compareVersionA.selectedIndex = 1; // First version
                compareVersionB.selectedIndex = 2; // Second version

                // Update metadata
                updateVersionMetadata();
            }
        }
    }

    /**
     * Update version metadata based on selected versions
     */
    function updateVersionMetadata() {
        const versionAId = compareVersionA.value;
        const versionBId = compareVersionB.value;
        const contentKey = compareContent.value;

        if (!contentKey) return;

        const versions = versionData[contentKey];

        if (versions) {
            // Update version A metadata
            if (versionAId) {
                const versionA = versions.find(v => v.id === versionAId);
                if (versionA) {
                    versionATenant.textContent = versionA.tenantName;
                    versionALocale.textContent = versionA.localeName;
                    versionADate.textContent = versionA.modifiedDate;
                }
            } else {
                versionATenant.textContent = '-';
                versionALocale.textContent = '-';
                versionADate.textContent = '-';
            }

            // Update version B metadata
            if (versionBId) {
                const versionB = versions.find(v => v.id === versionBId);
                if (versionB) {
                    versionBTenant.textContent = versionB.tenantName;
                    versionBLocale.textContent = versionB.localeName;
                    versionBDate.textContent = versionB.modifiedDate;
                }
            } else {
                versionBTenant.textContent = '-';
                versionBLocale.textContent = '-';
                versionBDate.textContent = '-';
            }
        }
    }

    /**
     * Compare selected versions
     */
    function compareVersions() {
        const versionAId = compareVersionA.value;
        const versionBId = compareVersionB.value;
        const contentKey = compareContent.value;

        if (!contentKey || !versionAId || !versionBId) {
            showNotification('Please select content and both versions to compare', 'warning');
            return;
        }

        const versions = versionData[contentKey];

        if (versions) {
            const versionA = versions.find(v => v.id === versionAId);
            const versionB = versions.find(v => v.id === versionBId);

            if (versionA && versionB) {
                // Display content
                versionAContent.innerHTML = versionA.content;
                versionBContent.innerHTML = versionB.content;

                // In a real application, this would highlight differences between versions
                highlightDifferences(versionAContent, versionBContent);
            }
        }
    }

    /**
     * Highlight differences between two version contents
     * @param {HTMLElement} contentA - Element containing version A content
     * @param {HTMLElement} contentB - Element containing version B content
     */
    function highlightDifferences(contentA, contentB) {
        // This is a simplified example of highlighting differences
        // In a real application, this would use a proper diff algorithm

        // For demo purposes, we'll just add some highlighting to show the concept
        if (contentA.querySelector('ul') && contentB.querySelector('ul')) {
            const listItemsA = contentA.querySelectorAll('li');
            const listItemsB = contentB.querySelectorAll('li');

            // Highlight added items in version A
            if (listItemsA.length > listItemsB.length) {
                listItemsA[listItemsA.length - 1].classList.add('diff-added');
            }
        }

        // Highlight added paragraphs
        const paragraphsA = contentA.querySelectorAll('p');
        const paragraphsB = contentB.querySelectorAll('p');

        if (paragraphsA.length > paragraphsB.length) {
            paragraphsA[paragraphsA.length - 1].classList.add('diff-added');
        }
    }

    /**
     * Save version settings
     * @param {Event} e - Form submit event
     */
    function saveVersionSettings(e) {
        e.preventDefault();

        // In a real application, this would save the settings to the server
        showNotification('Version settings saved successfully', 'success');
    }

    /**
     * Check URL parameters for actions
     */
    function checkUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);

        if (urlParams.has('action')) {
            const action = urlParams.get('action');

            switch (action) {
                case 'compare':
                    // Switch to compare tab
                    switchTab('version-compare');

                    // Set up comparison if content and versions are specified
                    if (urlParams.has('content') && urlParams.has('v1') && urlParams.has('v2')) {
                        const content = urlParams.get('content');
                        const v1 = urlParams.get('v1');
                        const v2 = urlParams.get('v2');

                        // Set content select
                        if (compareContent) {
                            for (let i = 0; i < compareContent.options.length; i++) {
                                if (compareContent.options[i].value === content) {
                                    compareContent.selectedIndex = i;
                                    break;
                                }
                            }

                            // Update version selects
                            updateVersionSelects();

                            // Set version selects
                            if (compareVersionA && compareVersionB) {
                                for (let i = 0; i < compareVersionA.options.length; i++) {
                                    if (compareVersionA.options[i].value === v1) {
                                        compareVersionA.selectedIndex = i;
                                        break;
                                    }
                                }

                                for (let i = 0; i < compareVersionB.options.length; i++) {
                                    if (compareVersionB.options[i].value === v2) {
                                        compareVersionB.selectedIndex = i;
                                        break;
                                    }
                                }

                                // Update metadata
                                updateVersionMetadata();

                                // Compare versions
                                compareVersions();
                            }
                        }
                    }
                    break;
            }
        }
    }

    /**
     * Get display name for a tenant value
     * @param {string} tenant - Tenant value
     * @returns {string} Display name
     */
    function getTenantDisplayName(tenant) {
        const tenantMap = {
            'global': 'Global',
            'acme-corp': 'Acme Corporation',
            'global-ent': 'Global Enterprises',
            'springfield-gov': 'City of Springfield',
            'tech-solutions': 'Tech Solutions Ltd'
        };

        return tenantMap[tenant] || tenant;
    }

    /**
     * Show notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, error, warning, info)
     */
    function showNotification(message, type = 'info') {
        // Check if notification container exists
        let notificationContainer = document.querySelector('.notification-container');

        // Create container if it doesn't exist
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.className = 'notification-container';
            document.body.appendChild(notificationContainer);
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${type === 'success' ? 'check-circle' :
                                type === 'error' ? 'times-circle' :
                                type === 'warning' ? 'exclamation-triangle' :
                                'info-circle'}"></i>
            </div>
            <div class="notification-content">
                <p>${message}</p>
            </div>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;

        // Add notification to container
        notificationContainer.appendChild(notification);

        // Add event listener to close button
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', function() {
            notification.classList.add('closing');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });

        // Auto-remove notification after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.add('closing');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 5000);
    }

    /**
     * Show version notes dialog
     * @param {string} content - Content name
     * @param {string} version - Version number
     */
    function showVersionNotesDialog(content, version) {
        // In a real application, this would show a dialog with version notes
        showNotification(`Viewing notes for ${content} ${version}`, 'info');
    }

    /**
     * Show export options dialog
     * @param {string} content - Content name
     * @param {string} version - Version number
     */
    function showExportOptionsDialog(content, version) {
        // In a real application, this would show a dialog with export options
        const options = ['PDF', 'CSV', 'JSON', 'HTML', 'DOCX'];
        const randomOption = options[Math.floor(Math.random() * options.length)];

        showNotification(`Exporting ${content} ${version} as ${randomOption}...`, 'info');

        // Simulate export delay
        setTimeout(() => {
            showNotification(`${content} ${version} exported successfully as ${randomOption}`, 'success');
        }, 1500);
    }
});
