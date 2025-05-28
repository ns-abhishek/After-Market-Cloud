$(document).ready(function() {
    // Sample parts data
    const partsData = [
        {
            id: '0000052',
            prefix: 'OEM',
            description: 'TWINE GUIDE',
            category: 'Accessory (Outside)',
            partFunctionGroup: 'Electrical',
            isComponent: true,
            isActive: true,
            uom: 'Sqm'
        },
        {
            id: '001729',
            prefix: 'N',
            description: 'SHAFT ASSY, IDLER, W/S WIPER',
            category: 'AUT-Classic/New Look',
            partFunctionGroup: 'Mechanical',
            isComponent: true,
            isActive: true,
            uom: 'Each'
        },
        {
            id: '001754',
            prefix: 'AF',
            description: 'ARM WIPER',
            category: 'AUT-Classic/New Look',
            partFunctionGroup: 'Mechanical',
            isComponent: true,
            isActive: true,
            uom: 'Each'
        },
        {
            id: '001828',
            prefix: 'OEM',
            description: 'FIELD ASSY, 24V A/C CLUTCH',
            category: 'AUT-Classic/New Look',
            partFunctionGroup: 'Electrical',
            isComponent: false,
            isActive: true,
            uom: 'Each'
        },
        {
            id: '00133TFF',
            prefix: 'N',
            description: 'FABRIC FOR N2320T LINEAR VD X 59"',
            category: 'AUT-Classic/New Look',
            partFunctionGroup: 'Interior',
            isComponent: false,
            isActive: true,
            uom: 'Piece'
        },
        {
            id: '005370PN',
            prefix: 'AF',
            description: 'BOLT',
            category: 'LFS 96-2000',
            partFunctionGroup: 'Hardware',
            isComponent: false,
            isActive: true,
            uom: 'Piece'
        },
        {
            id: '0055390',
            prefix: 'OEM',
            description: 'CLIP- BRAKE PEDAL TREAD',
            category: 'LFS 96-2000',
            partFunctionGroup: 'Brake System',
            isComponent: false,
            isActive: true,
            uom: 'Each'
        },
        {
            id: '006206ZN',
            prefix: 'N',
            description: 'LOCK NUT',
            category: 'LFS 2000-2007',
            partFunctionGroup: 'Hardware',
            isComponent: false,
            isActive: true,
            uom: 'Each'
        },
        {
            id: '0055228',
            prefix: 'AF',
            description: 'AIR DRYER AD-9 NEW',
            category: 'AUT-Classic/New Look',
            partFunctionGroup: 'Air System',
            isComponent: false,
            isActive: true,
            uom: 'Piece'
        },
        {
            id: '007000614472N',
            prefix: 'OEM',
            description: 'WASHER',
            category: 'LFS 2000-2007',
            partFunctionGroup: 'Hardware',
            isComponent: false,
            isActive: true,
            uom: 'Each'
        }
    ];

    let currentView = 'card';
    let filteredData = [...partsData];
    let currentPage = 1;
    const partsPerPage = 8;
    let selectedParts = new Set();

    // Initialize the application
    init();

    function init() {
        renderParts();
        bindEvents();
        updateStats();
        initializeMobileDrawer();
    }

    function bindEvents() {
        // View toggle buttons
        $('#cardView').click(() => switchView('card'));
        $('#listView').click(() => switchView('list'));
        $('#tableView').click(() => switchView('table'));

        // Search functionality
        $('#globalSearch').on('input', handleSearch);

        // Filter checkboxes
        $('.filter-options input[type="checkbox"]').change(handleFilter);

        // Clear filters
        $('#clearFilters').click(clearFilters);

        // Click events removed for all views - only action buttons are functional

        // Action buttons
        $(document).on('click', '.btn-edit', function(e) {
            e.stopPropagation();
            const partId = $(this).closest('[data-part-id]').data('part-id');
            editPart(partId);
        });

        $(document).on('click', '.btn-delete', function(e) {
            e.stopPropagation();
            const partId = $(this).closest('[data-part-id]').data('part-id');
            deletePart(partId);
        });

        $(document).on('click', '.btn-view', function(e) {
            e.stopPropagation();
            const partId = $(this).closest('[data-part-id]').data('part-id');
            openPartDetails(partId);
        });

        // Pagination
        $(document).on('click', '.pagination .page-link', function(e) {
            e.preventDefault();
            const page = parseInt($(this).data('page'));
            if (!isNaN(page) && page > 0 && page <= Math.ceil(filteredData.length / partsPerPage)) {
                currentPage = page;
                renderParts();
            }
        });

        // Selection functionality
        $('#selectAll').change(function() {
            const isChecked = $(this).is(':checked');
            $('.selection-checkbox').prop('checked', isChecked);

            if (isChecked) {
                // Add all current page items to selection
                const currentPageData = getCurrentPageData();
                currentPageData.forEach(part => selectedParts.add(part.id));
            } else {
                // Remove all current page items from selection
                const currentPageData = getCurrentPageData();
                currentPageData.forEach(part => selectedParts.delete(part.id));
            }

            updateSelectionUI();
        });

        $(document).on('change', '.selection-checkbox', function() {
            const partId = $(this).val();
            const isChecked = $(this).is(':checked');

            if (isChecked) {
                selectedParts.add(partId);
            } else {
                selectedParts.delete(partId);
            }

            updateSelectionUI();
            updateMasterCheckbox();
        });

        $('#deleteSelected').click(function() {
            if (selectedParts.size > 0) {
                deleteSelectedParts();
            }
        });
    }

    function switchView(view) {
        currentView = view;

        // Update button states
        $('.header-actions .btn-group .btn').removeClass('active');
        $(`#${view}View`).addClass('active');

        // Render parts in new view
        renderParts();
    }

    function renderParts() {
        const container = $('#partsContainer');
        container.empty();

        if (filteredData.length === 0) {
            container.html(`
                <div class="text-center py-5">
                    <i class="material-icons" style="font-size: 4rem; color: #ccc;">search_off</i>
                    <h4 class="mt-3 text-muted">No parts found</h4>
                    <p class="text-muted">Try adjusting your search or filters</p>
                </div>
            `);
            updatePagination();
            return;
        }

        // Calculate pagination
        const totalPages = Math.ceil(filteredData.length / partsPerPage);
        const startIndex = (currentPage - 1) * partsPerPage;
        const endIndex = startIndex + partsPerPage;
        const currentPageData = filteredData.slice(startIndex, endIndex);

        switch (currentView) {
            case 'card':
                renderCardView(container, currentPageData);
                break;
            case 'list':
                renderListView(container, currentPageData);
                break;
            case 'table':
                renderTableView(container, currentPageData);
                break;
        }

        // Add fade-in animation
        container.find('.part-card, .part-item, .table-container').addClass('fade-in-up');

        // Update pagination
        updatePagination();

        // Update selection UI
        updateSelectionUI();
        updateMasterCheckbox();
    }

    function renderCardView(container, data) {
        const grid = $('<div class="parts-grid"></div>');

        data.forEach(part => {
            const isSelected = selectedParts.has(part.id);
            const card = $(`
                <div class="part-card" data-part-id="${part.id}" data-category="${part.category}">
                    <input type="checkbox" class="selection-checkbox" value="${part.id}" ${isSelected ? 'checked' : ''}>
                    <div class="part-card-header">
                        <div class="part-number">${part.prefix}-${part.id}</div>
                        <div class="part-description">${part.description}</div>
                        <span class="part-category" data-category="${part.category}">${part.category}</span>
                    </div>
                    <div class="part-card-body">
                        <div class="part-info-grid">
                            <div class="info-item">
                                <span class="info-label">Function Group:</span>
                                <span class="info-value">${part.partFunctionGroup}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">UOM:</span>
                                <span class="info-value">${part.uom}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Component:</span>
                                <span class="badge ${part.isComponent ? 'bg-success' : 'bg-secondary'} component-badge">
                                    ${part.isComponent ? 'Yes' : 'No'}
                                </span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Status:</span>
                                <span class="part-status ${part.isActive ? 'status-active' : 'status-inactive'}">
                                    ${part.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                        <div class="part-actions">
                            <button class="btn-icon btn-view" title="View Details">
                                <i class="material-icons">visibility</i>
                            </button>
                            <button class="btn-icon btn-edit" title="Edit">
                                <i class="material-icons">edit</i>
                            </button>
                            <button class="btn-icon btn-delete" title="Delete">
                                <i class="material-icons">delete</i>
                            </button>
                        </div>
                    </div>
                </div>
            `);
            grid.append(card);
        });

        container.append(grid);
    }

    function renderListView(container, data) {
        const list = $('<div class="parts-list"></div>');

        data.forEach(part => {
            const isSelected = selectedParts.has(part.id);
            const item = $(`
                <div class="part-item" data-part-id="${part.id}" data-category="${part.category}">
                    <input type="checkbox" class="selection-checkbox" value="${part.id}" ${isSelected ? 'checked' : ''}>
                    <div class="row align-items-center">
                        <div class="col-md-2">
                            <div class="part-number">${part.prefix}-${part.id}</div>
                            <small class="text-muted">UOM: ${part.uom}</small>
                        </div>
                        <div class="col-md-3">
                            <div class="part-description">${part.description}</div>
                            <small class="text-muted">${part.category}</small>
                        </div>
                        <div class="col-md-2">
                            <div class="function-group">${part.partFunctionGroup}</div>
                            <small class="text-muted">Function Group</small>
                        </div>
                        <div class="col-md-2">
                            <span class="badge ${part.isComponent ? 'bg-success' : 'bg-secondary'} mb-1">
                                ${part.isComponent ? 'Component' : 'Not Component'}
                            </span>
                            <br>
                            <span class="part-status ${part.isActive ? 'status-active' : 'status-inactive'}">
                                ${part.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <div class="col-md-3">
                            <div class="part-actions">
                                <button class="btn-icon btn-view" title="View Details">
                                    <i class="material-icons">visibility</i>
                                </button>
                                <button class="btn-icon btn-edit" title="Edit">
                                    <i class="material-icons">edit</i>
                                </button>
                                <button class="btn-icon btn-delete" title="Delete">
                                    <i class="material-icons">delete</i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `);
            list.append(item);
        });

        container.append(list);
    }

    function renderTableView(container, data) {
        const tableContainer = $('<div class="table-container"></div>');
        const table = $(`
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th class="selection-cell">
                            <input type="checkbox" id="selectAllTable">
                        </th>
                        <th>Part #</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Function Group</th>
                        <th>UOM</th>
                        <th>Is Component</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        `);

        const tbody = table.find('tbody');
        data.forEach(part => {
            const isSelected = selectedParts.has(part.id);
            const row = $(`
                <tr data-part-id="${part.id}" data-category="${part.category}" ${isSelected ? 'class="selected"' : ''}>
                    <td class="selection-cell">
                        <input type="checkbox" class="selection-checkbox" value="${part.id}" ${isSelected ? 'checked' : ''}>
                    </td>
                    <td><strong>${part.prefix}-${part.id}</strong></td>
                    <td>${part.description}</td>
                    <td><span class="part-category">${part.category}</span></td>
                    <td>${part.partFunctionGroup}</td>
                    <td>${part.uom}</td>
                    <td>
                        <span class="badge ${part.isComponent ? 'bg-success' : 'bg-secondary'}">
                            ${part.isComponent ? 'Yes' : 'No'}
                        </span>
                    </td>
                    <td>
                        <span class="part-status ${part.isActive ? 'status-active' : 'status-inactive'}">
                            ${part.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </td>
                    <td>
                        <div class="part-actions">
                            <button class="btn-icon btn-view" title="View Details">
                                <i class="material-icons">visibility</i>
                            </button>
                            <button class="btn-icon btn-edit" title="Edit">
                                <i class="material-icons">edit</i>
                            </button>
                        </div>
                    </td>
                </tr>
            `);
            tbody.append(row);
        });

        tableContainer.append(table);
        container.append(tableContainer);
    }

    function handleSearch() {
        const searchTerm = $(this).val().toLowerCase();

        filteredData = partsData.filter(part =>
            part.id.toLowerCase().includes(searchTerm) ||
            part.description.toLowerCase().includes(searchTerm) ||
            part.category.toLowerCase().includes(searchTerm)
        );

        currentPage = 1; // Reset to first page
        renderParts();
        updateStats();
    }

    function handleFilter() {
        const activeCategories = [];
        const activeFunctionGroups = [];
        const activeUOMs = [];
        const activeComponentTypes = [];
        const activeStatuses = [];

        // Get selected filters
        $('.filter-options input[type="checkbox"]:checked').each(function() {
            const id = $(this).attr('id');
            const label = $(this).next('label').text();

            // Category filters
            if (['accessory', 'autClassic', 'lfs96', 'lfs2000'].includes(id)) {
                activeCategories.push(label);
            }
            // Function Group filters
            else if (['electrical', 'mechanical', 'hardware', 'brakeSystem', 'airSystem', 'interior'].includes(id)) {
                activeFunctionGroups.push(label);
            }
            // UOM filters
            else if (['each', 'piece', 'sqm'].includes(id)) {
                activeUOMs.push(label.charAt(0).toUpperCase() + label.slice(1));
            }
            // Component filters
            else if (['isComponent', 'notComponent'].includes(id)) {
                activeComponentTypes.push(id === 'isComponent');
            }
            // Status filters
            else if (['active', 'inactive'].includes(id)) {
                activeStatuses.push(id === 'active');
            }
        });

        filteredData = partsData.filter(part => {
            const categoryMatch = activeCategories.length === 0 || activeCategories.includes(part.category);
            const functionGroupMatch = activeFunctionGroups.length === 0 || activeFunctionGroups.includes(part.partFunctionGroup);
            const uomMatch = activeUOMs.length === 0 || activeUOMs.includes(part.uom);
            const componentMatch = activeComponentTypes.length === 0 || activeComponentTypes.includes(part.isComponent);
            const statusMatch = activeStatuses.length === 0 || activeStatuses.includes(part.isActive);

            return categoryMatch && functionGroupMatch && uomMatch && componentMatch && statusMatch;
        });

        currentPage = 1; // Reset to first page
        renderParts();
        updateStats();
    }

    function clearFilters() {
        $('.filter-options input[type="checkbox"]').prop('checked', false);
        $('#globalSearch').val('');
        filteredData = [...partsData];
        currentPage = 1; // Reset to first page
        renderParts();
        updateStats();
    }

    function updateStats() {
        // Update stats based on filtered data
        const totalParts = filteredData.length;
        const activeParts = filteredData.filter(part => part.isActive).length;
        const categories = [...new Set(filteredData.map(part => part.category))].length;

        $('.stat-card').eq(0).find('h3').text(totalParts);
        $('.stat-card').eq(1).find('h3').text(activeParts);
        $('.stat-card').eq(3).find('h3').text(categories);
    }

    function openPartDetails(partId) {
        // Redirect to part details page
        window.location.href = `part-details.html?id=${partId}`;
    }

    function editPart(partId) {
        // Show edit modal or redirect to edit page
        console.log('Edit part:', partId);
        // Implementation would go here
    }

    function deletePart(partId) {
        if (confirm('Are you sure you want to delete this part?')) {
            // Remove from data array
            const index = partsData.findIndex(part => part.id === partId);
            if (index > -1) {
                partsData.splice(index, 1);
                filteredData = filteredData.filter(part => part.id !== partId);
                renderParts();
                updateStats();
            }
        }
    }

    // Smooth scrolling for anchor links
    $('a[href^="#"]').on('click', function(event) {
        const target = $(this.getAttribute('href'));
        if (target.length) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 100
            }, 1000);
        }
    });

    // Update pagination
    function updatePagination() {
        const totalPages = Math.ceil(filteredData.length / partsPerPage);
        const startIndex = (currentPage - 1) * partsPerPage + 1;
        const endIndex = Math.min(currentPage * partsPerPage, filteredData.length);

        // Update pagination info
        $('.pagination').parent().find('small').text(
            `Showing ${startIndex}-${endIndex} of ${filteredData.length} parts`
        );

        // Generate pagination buttons
        const pagination = $('.pagination');
        pagination.empty();

        // Previous button
        pagination.append(`
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link elevation-1" href="#" data-page="${currentPage - 1}" tabindex="-1">
                    <i class="material-icons">chevron_left</i>
                    <span class="d-none d-sm-inline ms-1">Previous</span>
                </a>
            </li>
        `);

        // Page numbers
        for (let i = 1; i <= Math.min(totalPages, 5); i++) {
            pagination.append(`
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link ${i === currentPage ? 'elevation-2' : 'elevation-1'}" href="#" data-page="${i}">${i}</a>
                </li>
            `);
        }

        if (totalPages > 5) {
            pagination.append(`
                <li class="page-item">
                    <span class="page-link bg-transparent border-0">...</span>
                </li>
                <li class="page-item">
                    <a class="page-link elevation-1" href="#" data-page="${totalPages}">${totalPages}</a>
                </li>
            `);
        }

        // Next button
        pagination.append(`
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link elevation-1" href="#" data-page="${currentPage + 1}">
                    <span class="d-none d-sm-inline me-1">Next</span>
                    <i class="material-icons">chevron_right</i>
                </a>
            </li>
        `);
    }

    // Initialize mobile drawer
    function initializeMobileDrawer() {
        $('#mobileMenuToggle').click(function() {
            $('#sidebar').toggleClass('show');
            $('#mobileDrawerOverlay').toggleClass('show');
        });

        $('#mobileDrawerOverlay').click(function() {
            $('#sidebar').removeClass('show');
            $('#mobileDrawerOverlay').removeClass('show');
        });
    }

    // Helper functions for selection
    function getCurrentPageData() {
        const startIndex = (currentPage - 1) * partsPerPage;
        const endIndex = startIndex + partsPerPage;
        return filteredData.slice(startIndex, endIndex);
    }

    function updateSelectionUI() {
        const selectedCount = selectedParts.size;
        $('#selectionInfo').text(`${selectedCount} item${selectedCount !== 1 ? 's' : ''} selected`);

        if (selectedCount > 0) {
            $('#selectionControls').addClass('show');
            $('#masterSelection').show();
        } else {
            $('#selectionControls').removeClass('show');
            $('#masterSelection').hide();
        }
    }

    function updateMasterCheckbox() {
        const currentPageData = getCurrentPageData();
        const currentPageIds = currentPageData.map(part => part.id);
        const selectedOnPage = currentPageIds.filter(id => selectedParts.has(id));

        const selectAllCheckbox = $('#selectAll');
        const selectAllTableCheckbox = $('#selectAllTable');

        if (selectedOnPage.length === 0) {
            selectAllCheckbox.prop('indeterminate', false).prop('checked', false);
            selectAllTableCheckbox.prop('indeterminate', false).prop('checked', false);
        } else if (selectedOnPage.length === currentPageIds.length) {
            selectAllCheckbox.prop('indeterminate', false).prop('checked', true);
            selectAllTableCheckbox.prop('indeterminate', false).prop('checked', true);
        } else {
            selectAllCheckbox.prop('indeterminate', true);
            selectAllTableCheckbox.prop('indeterminate', true);
        }
    }

    function deleteSelectedParts() {
        if (confirm(`Are you sure you want to delete ${selectedParts.size} selected part${selectedParts.size !== 1 ? 's' : ''}?`)) {
            // Remove selected parts from data arrays
            const selectedArray = Array.from(selectedParts);

            selectedArray.forEach(partId => {
                const index = partsData.findIndex(part => part.id === partId);
                if (index > -1) {
                    partsData.splice(index, 1);
                }
            });

            // Update filtered data
            filteredData = filteredData.filter(part => !selectedParts.has(part.id));

            // Clear selection
            selectedParts.clear();

            // Re-render and update
            renderParts();
            updateStats();
            updateSelectionUI();
        }
    }

    // Add table select all handler
    $(document).on('change', '#selectAllTable', function() {
        const isChecked = $(this).is(':checked');
        $('.selection-checkbox').prop('checked', isChecked);

        const currentPageData = getCurrentPageData();
        if (isChecked) {
            currentPageData.forEach(part => selectedParts.add(part.id));
        } else {
            currentPageData.forEach(part => selectedParts.delete(part.id));
        }

        updateSelectionUI();

        // Update row selection visual state
        $('.table tbody tr').each(function() {
            const checkbox = $(this).find('.selection-checkbox');
            if (checkbox.is(':checked')) {
                $(this).addClass('selected');
            } else {
                $(this).removeClass('selected');
            }
        });
    });

    // Update row selection visual state when individual checkboxes change
    $(document).on('change', '.selection-checkbox', function() {
        const row = $(this).closest('tr');
        if ($(this).is(':checked')) {
            row.addClass('selected');
        } else {
            row.removeClass('selected');
        }
    });

    // Tooltip initialization
    $('[data-bs-toggle="tooltip"]').tooltip();
});
