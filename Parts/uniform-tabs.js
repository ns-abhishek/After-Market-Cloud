// Universal Tab Management System for Parts Management
// Provides uniform UI and functionality across all tabs

$(document).ready(function() {
    // Universal Tab Update Function
    function updateTabWithUniformStructure(tabType, part, dataKey, summaryUpdateFn) {
        try {
            // Clear all view containers
            const containers = {
                table: $(`#${tabType}DetailsTableBody`),
                grid: $(`#${tabType}GridView`),
                list: $(`#${tabType}ListView`),
                cards: $(`#${tabType}CardsView`),
                tiles: $(`#${tabType}TilesView`),
                compact: $(`#${tabType}CompactView`)
            };

            Object.values(containers).forEach(container => container.empty());

            // Check if data exists
            if (!part[dataKey] || !Array.isArray(part[dataKey])) {
                console.warn(`No ${tabType} details available for this part`);
                showEmptyState(containers, tabType, `No ${tabType} information available`);
                return;
            }

            // Update summary cards if function provided
            if (summaryUpdateFn && typeof summaryUpdateFn === 'function') {
                summaryUpdateFn(part[dataKey]);
            }

            // Populate all views
            part[dataKey].forEach((item, index) => {
                generateUniformViews(tabType, item, index, containers);
            });

            // Initialize view switching and selection
            initializeViewSwitching(tabType);
            initializeSelection(tabType);

        } catch (error) {
            console.error(`Error updating ${tabType} tab:`, error);
            showErrorState(tabType, `Error loading ${tabType} information`);
        }
    }

    // Universal View Generation Function
    function generateUniformViews(tabType, item, index, containers) {
        const itemId = item.id || `${tabType}_${index}`;

        // Generate Table View
        generateTableView(tabType, item, itemId, containers.table);

        // Generate Grid View
        generateGridView(tabType, item, itemId, containers.grid);

        // Generate List View
        generateListView(tabType, item, itemId, containers.list);

        // Generate Bootstrap Cards View
        generateCardsView(tabType, item, itemId, containers.cards);

        // Generate Tiles View
        generateTilesView(tabType, item, itemId, containers.tiles);

        // Generate Compact View
        generateCompactView(tabType, item, itemId, containers.compact);
    }

    // Table View Generator
    function generateTableView(tabType, item, itemId, container) {
        let tableRow = '';

        switch(tabType) {
            case 'stock':
                tableRow = generateStockTableRow(item, itemId);
                break;
            case 'pricing':
                tableRow = generatePricingTableRow(item, itemId);
                break;
            case 'manufacturer':
                tableRow = generateManufacturerTableRow(item, itemId);
                break;
            case 'assets':
                tableRow = generateAssetsTableRow(item, itemId);
                break;
            case 'competitor':
                tableRow = generateCompetitorTableRow(item, itemId);
                break;
            case 'files':
                tableRow = generateFilesTableRow(item, itemId);
                break;
        }

        container.append(tableRow);
    }

    // Grid View Generator
    function generateGridView(tabType, item, itemId, container) {
        const gridItem = $(`
            <div class="${tabType}-grid-item" data-${tabType}-id="${itemId}">
                <div class="${tabType}-grid-header">
                    <div class="form-check">
                        <input class="form-check-input ${tabType}-checkbox" type="checkbox" value="${itemId}">
                    </div>
                    <h6 class="${tabType}-grid-title">
                        ${getGridTitle(tabType, item)}
                    </h6>
                </div>
                <div class="${tabType}-grid-body">
                    ${getGridBody(tabType, item)}
                </div>
                <div class="${tabType}-grid-footer">
                    ${getGridFooter(tabType, item)}
                    <div class="${tabType}-grid-actions">
                        <button class="btn btn-sm btn-outline-primary" onclick="edit${capitalize(tabType)}Entry('${itemId}')" title="Edit">
                            <i class="material-icons">edit</i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="delete${capitalize(tabType)}Entry('${itemId}')" title="Delete">
                            <i class="material-icons">delete</i>
                        </button>
                    </div>
                </div>
            </div>
        `);
        container.append(gridItem);
    }

    // List View Generator
    function generateListView(tabType, item, itemId, container) {
        const listItem = $(`
            <div class="${tabType}-list-item" data-${tabType}-id="${itemId}">
                <div class="list-item-content">
                    <div class="list-item-header">
                        <div class="form-check">
                            <input class="form-check-input ${tabType}-checkbox" type="checkbox" value="${itemId}">
                        </div>
                        <div class="list-item-title">${getListTitle(tabType, item)}</div>
                        <div class="list-item-actions">
                            <button class="btn btn-sm btn-outline-primary" onclick="edit${capitalize(tabType)}Entry('${itemId}')" title="Edit">
                                <i class="material-icons">edit</i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="delete${capitalize(tabType)}Entry('${itemId}')" title="Delete">
                                <i class="material-icons">delete</i>
                            </button>
                        </div>
                    </div>
                    <div class="list-item-body">
                        ${getListBody(tabType, item)}
                    </div>
                </div>
            </div>
        `);
        container.append(listItem);
    }

    // Bootstrap Cards View Generator
    function generateCardsView(tabType, item, itemId, container) {
        const cardItem = $(`
            <div class="col-md-6 col-lg-4 mb-3">
                <div class="card ${tabType}-bootstrap-card" data-${tabType}-id="${itemId}">
                    <div class="card-header">
                        <div class="form-check">
                            <input class="form-check-input ${tabType}-checkbox" type="checkbox" value="${itemId}">
                        </div>
                        <h6 class="card-title mb-0">${getCardTitle(tabType, item)}</h6>
                    </div>
                    <div class="card-body">
                        ${getCardBody(tabType, item)}
                    </div>
                    <div class="card-footer">
                        <div class="btn-group w-100">
                            <button class="btn btn-sm btn-outline-primary" onclick="edit${capitalize(tabType)}Entry('${itemId}')" title="Edit">
                                <i class="material-icons">edit</i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="delete${capitalize(tabType)}Entry('${itemId}')" title="Delete">
                                <i class="material-icons">delete</i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `);
        container.append(cardItem);
    }

    // Tiles View Generator
    function generateTilesView(tabType, item, itemId, container) {
        const tileItem = $(`
            <div class="${tabType}-tile-item" data-${tabType}-id="${itemId}">
                <div class="tile-content">
                    <div class="tile-header">
                        <div class="form-check">
                            <input class="form-check-input ${tabType}-checkbox" type="checkbox" value="${itemId}">
                        </div>
                        <div class="tile-icon">
                            ${getTileIcon(tabType)}
                        </div>
                    </div>
                    <div class="tile-body">
                        <div class="tile-title">${getTileTitle(tabType, item)}</div>
                        <div class="tile-content">${getTileContent(tabType, item)}</div>
                    </div>
                    <div class="tile-footer">
                        <button class="btn btn-sm btn-outline-primary" onclick="edit${capitalize(tabType)}Entry('${itemId}')" title="Edit">
                            <i class="material-icons">edit</i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="delete${capitalize(tabType)}Entry('${itemId}')" title="Delete">
                            <i class="material-icons">delete</i>
                        </button>
                    </div>
                </div>
            </div>
        `);
        container.append(tileItem);
    }

    // Compact View Generator
    function generateCompactView(tabType, item, itemId, container) {
        const compactItem = $(`
            <div class="${tabType}-compact-item" data-${tabType}-id="${itemId}">
                <div class="compact-content">
                    <div class="form-check compact-checkbox">
                        <input class="form-check-input ${tabType}-checkbox" type="checkbox" value="${itemId}">
                    </div>
                    <div class="compact-info">
                        ${getCompactInfo(tabType, item)}
                    </div>
                    <div class="compact-actions">
                        <button class="btn btn-sm btn-outline-primary" onclick="edit${capitalize(tabType)}Entry('${itemId}')" title="Edit">
                            <i class="material-icons">edit</i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="delete${capitalize(tabType)}Entry('${itemId}')" title="Delete">
                            <i class="material-icons">delete</i>
                        </button>
                    </div>
                </div>
            </div>
        `);
        container.append(compactItem);
    }

    // Universal View Switching
    function initializeViewSwitching(tabType) {
        $(`.${tabType}-view .view-btn`).off('click').on('click', function() {
            const view = $(this).data('view');
            $(`.${tabType}-view .view-btn`).removeClass('active');
            $(this).addClass('active');
            $(`.${tabType}-view`).hide();
            $(`.${tabType}-${view}-view`).show();
        });
    }

    // Universal Selection Management
    function initializeSelection(tabType) {
        // Select all functionality
        $(`#selectAll${capitalize(tabType)}`).off('change').on('change', function() {
            const isChecked = $(this).is(':checked');
            $(`.${tabType}-checkbox`).prop('checked', isChecked);
            updateSelectionControls(tabType);
        });

        // Individual checkbox functionality
        $(`.${tabType}-checkbox`).off('change').on('change', function() {
            updateSelectionControls(tabType);
        });
    }

    // Update Selection Controls
    function updateSelectionControls(tabType) {
        const selectedCount = $(`.${tabType}-checkbox:checked`).length;
        const totalCount = $(`.${tabType}-checkbox`).length;

        $(`#selected${capitalize(tabType)}Count`).text(selectedCount);

        if (selectedCount > 0) {
            $(`#${tabType}SelectionControls`).show();
            $(`#delete${capitalize(tabType)}Entry`).show();
        } else {
            $(`#${tabType}SelectionControls`).hide();
            $(`#delete${capitalize(tabType)}Entry`).hide();
        }

        // Update select all checkbox state
        const selectAllCheckbox = $(`#selectAll${capitalize(tabType)}`);
        if (selectedCount === 0) {
            selectAllCheckbox.prop('indeterminate', false).prop('checked', false);
        } else if (selectedCount === totalCount) {
            selectAllCheckbox.prop('indeterminate', false).prop('checked', true);
        } else {
            selectAllCheckbox.prop('indeterminate', true);
        }
    }

    // Utility Functions
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function showEmptyState(containers, tabType, message) {
        const emptyStateHtml = `
            <div class="empty-state-container">
                <div class="empty-state-content">
                    <i class="material-icons empty-state-icon">info</i>
                    <div class="empty-state-message">${message}</div>
                </div>
            </div>
        `;

        Object.values(containers).forEach(container => {
            container.append(emptyStateHtml);
        });
    }

    function showErrorState(tabType, message) {
        const errorStateHtml = `
            <div class="error-state-container">
                <div class="error-state-content">
                    <i class="material-icons error-state-icon">error</i>
                    <div class="error-state-message">${message}</div>
                </div>
            </div>
        `;

        $(`#${tabType}ViewContainer`).html(errorStateHtml);
    }

    // Stock-specific content generators
    function generateStockTableRow(item, itemId) {
        const stockBadgeClass = (item.availableStock || 0) > 0 ? 'bg-success' : 'bg-warning';
        return $(`
            <tr data-stock-id="${itemId}">
                <td>
                    <div class="form-check">
                        <input class="form-check-input stock-checkbox" type="checkbox" value="${itemId}">
                    </div>
                </td>
                <td>${item.warehouse || '-'}</td>
                <td>${item.location || '-'}</td>
                <td>${(item.totalStock || 0).toFixed(2)}</td>
                <td><span class="badge ${stockBadgeClass}">${(item.availableStock || 0).toFixed(2)}</span></td>
                <td>${(item.reservedQuantity || 0).toFixed(2)}</td>
                <td>${(item.damagedQuantity || 0).toFixed(2)}</td>
                <td>${item.lastStockCheckDate || '-'}</td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-outline-primary" onclick="editStockEntry('${itemId}')" title="Edit">
                            <i class="material-icons">edit</i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteStockEntry('${itemId}')" title="Delete">
                            <i class="material-icons">delete</i>
                        </button>
                    </div>
                </td>
            </tr>
        `);
    }

    function generatePricingTableRow(item, itemId) {
        return $(`
            <tr data-pricing-id="${itemId}">
                <td>
                    <div class="form-check">
                        <input class="form-check-input pricing-checkbox" type="checkbox" value="${itemId}">
                    </div>
                </td>
                <td><strong>$${(item.listPrice || 0).toFixed(2)}</strong></td>
                <td>$${(item.costPrice || 0).toFixed(2)}</td>
                <td>${item.effectiveFrom || '-'}</td>
                <td>${item.customerWarranty || '-'}</td>
                <td>${item.buyingCurrency || '-'}</td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-outline-primary" onclick="editPricingEntry('${itemId}')" title="Edit">
                            <i class="material-icons">edit</i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deletePricingEntry('${itemId}')" title="Delete">
                            <i class="material-icons">delete</i>
                        </button>
                    </div>
                </td>
            </tr>
        `);
    }

    function generateManufacturerTableRow(item, itemId) {
        return $(`
            <tr data-manufacturer-id="${itemId}">
                <td>
                    <div class="form-check">
                        <input class="form-check-input manufacturer-checkbox" type="checkbox" value="${itemId}">
                    </div>
                </td>
                <td>${item.manufacturer || '-'}</td>
                <td>${item.prefix || '-'}</td>
                <td>${item.manufacturerPart || '-'}</td>
                <td>${item.buyingCurrency || '-'}</td>
                <td>${item.stdPackQty || '-'}</td>
                <td>$${(item.partnerNetPrice || 0).toFixed(2)}</td>
                <td>${item.lastInvoiceDate || '-'}</td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-outline-primary" onclick="editManufacturerEntry('${itemId}')" title="Edit">
                            <i class="material-icons">edit</i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteManufacturerEntry('${itemId}')" title="Delete">
                            <i class="material-icons">delete</i>
                        </button>
                    </div>
                </td>
            </tr>
        `);
    }

    function generateAssetsTableRow(item, itemId) {
        return $(`
            <tr data-assets-id="${itemId}">
                <td>
                    <div class="form-check">
                        <input class="form-check-input assets-checkbox" type="checkbox" value="${itemId}">
                    </div>
                </td>
                <td>${item.brand || '-'}</td>
                <td>${item.assetType || '-'}</td>
                <td>${item.model || '-'}</td>
                <td>${item.fromVin || '-'}</td>
                <td>${item.toVin || '-'}</td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-outline-primary" onclick="editAssetsEntry('${itemId}')" title="Edit">
                            <i class="material-icons">edit</i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteAssetsEntry('${itemId}')" title="Delete">
                            <i class="material-icons">delete</i>
                        </button>
                    </div>
                </td>
            </tr>
        `);
    }

    function generateCompetitorTableRow(item, itemId) {
        return $(`
            <tr data-competitor-id="${itemId}">
                <td>
                    <div class="form-check">
                        <input class="form-check-input competitor-checkbox" type="checkbox" value="${itemId}">
                    </div>
                </td>
                <td>${item.competitorName || '-'}</td>
                <td>$${(item.netRate || 0).toFixed(2)}</td>
                <td>$${(item.costPrice || 0).toFixed(2)}</td>
                <td>${item.effectiveFrom || '-'}</td>
                <td>${item.remarks || '-'}</td>
                <td>${item.modifiedBy || '-'}</td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-outline-primary" onclick="editCompetitorEntry('${itemId}')" title="Edit">
                            <i class="material-icons">edit</i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteCompetitorEntry('${itemId}')" title="Delete">
                            <i class="material-icons">delete</i>
                        </button>
                    </div>
                </td>
            </tr>
        `);
    }

    function generateFilesTableRow(item, itemId) {
        return $(`
            <tr data-files-id="${itemId}">
                <td>
                    <div class="form-check">
                        <input class="form-check-input files-checkbox" type="checkbox" value="${itemId}">
                    </div>
                </td>
                <td>${item.fileName || '-'}</td>
                <td>${item.fileType || '-'}</td>
                <td>${formatFileSize(item.fileSize || 0)}</td>
                <td>${item.uploadedBy || '-'}</td>
                <td>${item.uploadDate || '-'}</td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-outline-primary" onclick="editFilesEntry('${itemId}')" title="Edit">
                            <i class="material-icons">edit</i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteFilesEntry('${itemId}')" title="Delete">
                            <i class="material-icons">delete</i>
                        </button>
                    </div>
                </td>
            </tr>
        `);
    }

    // Content generators for different view types
    function getGridTitle(tabType, item) {
        switch(tabType) {
            case 'stock': return `<i class="material-icons">location_on</i> ${item.warehouse || 'Unknown Warehouse'}`;
            case 'pricing': return `<i class="material-icons">attach_money</i> $${(item.listPrice || 0).toFixed(2)}`;
            case 'manufacturer': return `<i class="material-icons">business</i> ${item.manufacturer || 'Unknown Manufacturer'}`;
            case 'assets': return `<i class="material-icons">directions_bus</i> ${item.brand || 'Unknown Brand'}`;
            case 'competitor': return `<i class="material-icons">trending_down</i> ${item.competitorName || 'Unknown Competitor'}`;
            case 'files': return `<i class="material-icons">attach_file</i> ${item.fileName || 'Unknown File'}`;
            default: return 'Item';
        }
    }

    function getGridBody(tabType, item) {
        switch(tabType) {
            case 'stock':
                return `
                    <div class="stock-grid-stats">
                        <div class="stock-stat">
                            <span class="stat-label">Available</span>
                            <span class="stat-value">${(item.availableStock || 0).toFixed(2)}</span>
                        </div>
                        <div class="stock-stat">
                            <span class="stat-label">Total</span>
                            <span class="stat-value">${(item.totalStock || 0).toFixed(2)}</span>
                        </div>
                    </div>
                `;
            case 'pricing':
                return `
                    <div class="pricing-grid-stats">
                        <div class="pricing-stat">
                            <span class="stat-label">List Price</span>
                            <span class="stat-value">$${(item.listPrice || 0).toFixed(2)}</span>
                        </div>
                        <div class="pricing-stat">
                            <span class="stat-label">Cost Price</span>
                            <span class="stat-value">$${(item.costPrice || 0).toFixed(2)}</span>
                        </div>
                    </div>
                `;
            case 'manufacturer':
                return `
                    <div class="manufacturer-grid-stats">
                        <div class="manufacturer-stat">
                            <span class="stat-label">Part Number</span>
                            <span class="stat-value">${item.manufacturerPart || '-'}</span>
                        </div>
                        <div class="manufacturer-stat">
                            <span class="stat-label">Net Price</span>
                            <span class="stat-value">$${(item.partnerNetPrice || 0).toFixed(2)}</span>
                        </div>
                    </div>
                `;
            case 'assets':
                return `
                    <div class="assets-grid-stats">
                        <div class="assets-stat">
                            <span class="stat-label">Model</span>
                            <span class="stat-value">${item.model || '-'}</span>
                        </div>
                        <div class="assets-stat">
                            <span class="stat-label">Type</span>
                            <span class="stat-value">${item.assetType || '-'}</span>
                        </div>
                    </div>
                `;
            case 'competitor':
                return `
                    <div class="competitor-grid-stats">
                        <div class="competitor-stat">
                            <span class="stat-label">Net Rate</span>
                            <span class="stat-value">$${(item.netRate || 0).toFixed(2)}</span>
                        </div>
                        <div class="competitor-stat">
                            <span class="stat-label">Cost Price</span>
                            <span class="stat-value">$${(item.costPrice || 0).toFixed(2)}</span>
                        </div>
                    </div>
                `;
            case 'files':
                return `
                    <div class="files-grid-stats">
                        <div class="files-stat">
                            <span class="stat-label">Type</span>
                            <span class="stat-value">${item.fileType || '-'}</span>
                        </div>
                        <div class="files-stat">
                            <span class="stat-label">Size</span>
                            <span class="stat-value">${formatFileSize(item.fileSize || 0)}</span>
                        </div>
                    </div>
                `;
            default: return '';
        }
    }

    function getGridFooter(tabType, item) {
        switch(tabType) {
            case 'stock': return `<small class="text-muted">Updated: ${item.lastStockCheckDate || 'Never'}</small>`;
            case 'pricing': return `<small class="text-muted">Effective: ${item.effectiveFrom || 'Not set'}</small>`;
            case 'manufacturer': return `<small class="text-muted">Last Invoice: ${item.lastInvoiceDate || 'Never'}</small>`;
            case 'assets': return `<small class="text-muted">VIN: ${item.fromVin || 'Not specified'}</small>`;
            case 'competitor': return `<small class="text-muted">Updated: ${item.effectiveFrom || 'Not set'}</small>`;
            case 'files': return `<small class="text-muted">Uploaded: ${item.uploadDate || 'Unknown'}</small>`;
            default: return '';
        }
    }

    function getListTitle(tabType, item) {
        return getGridTitle(tabType, item);
    }

    function getListBody(tabType, item) {
        return getGridBody(tabType, item);
    }

    function getCardTitle(tabType, item) {
        return getGridTitle(tabType, item);
    }

    function getCardBody(tabType, item) {
        return getGridBody(tabType, item);
    }

    function getTileIcon(tabType) {
        switch(tabType) {
            case 'stock': return '<i class="material-icons">inventory</i>';
            case 'pricing': return '<i class="material-icons">attach_money</i>';
            case 'manufacturer': return '<i class="material-icons">business</i>';
            case 'assets': return '<i class="material-icons">precision_manufacturing</i>';
            case 'competitor': return '<i class="material-icons">trending_down</i>';
            case 'files': return '<i class="material-icons">attach_file</i>';
            default: return '<i class="material-icons">info</i>';
        }
    }

    function getTileTitle(tabType, item) {
        switch(tabType) {
            case 'stock': return item.warehouse || 'Unknown Warehouse';
            case 'pricing': return `$${(item.listPrice || 0).toFixed(2)}`;
            case 'manufacturer': return item.manufacturer || 'Unknown Manufacturer';
            case 'assets': return item.brand || 'Unknown Brand';
            case 'competitor': return item.competitorName || 'Unknown Competitor';
            case 'files': return item.fileName || 'Unknown File';
            default: return 'Item';
        }
    }

    function getTileContent(tabType, item) {
        switch(tabType) {
            case 'stock': return `Available: ${(item.availableStock || 0).toFixed(2)}`;
            case 'pricing': return `Cost: $${(item.costPrice || 0).toFixed(2)}`;
            case 'manufacturer': return `Part: ${item.manufacturerPart || '-'}`;
            case 'assets': return `Model: ${item.model || '-'}`;
            case 'competitor': return `Rate: $${(item.netRate || 0).toFixed(2)}`;
            case 'files': return `Size: ${formatFileSize(item.fileSize || 0)}`;
            default: return '';
        }
    }

    function getCompactInfo(tabType, item) {
        switch(tabType) {
            case 'stock':
                return `<span class="compact-title">${item.warehouse || 'Unknown'}</span> - Available: ${(item.availableStock || 0).toFixed(2)}`;
            case 'pricing':
                return `<span class="compact-title">$${(item.listPrice || 0).toFixed(2)}</span> - ${item.buyingCurrency || 'USD'}`;
            case 'manufacturer':
                return `<span class="compact-title">${item.manufacturer || 'Unknown'}</span> - ${item.manufacturerPart || '-'}`;
            case 'assets':
                return `<span class="compact-title">${item.brand || 'Unknown'}</span> - ${item.model || '-'}`;
            case 'competitor':
                return `<span class="compact-title">${item.competitorName || 'Unknown'}</span> - $${(item.netRate || 0).toFixed(2)}`;
            case 'files':
                return `<span class="compact-title">${item.fileName || 'Unknown'}</span> - ${formatFileSize(item.fileSize || 0)}`;
            default: return 'Item';
        }
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Export functions to global scope
    window.updateTabWithUniformStructure = updateTabWithUniformStructure;
    window.generateUniformViews = generateUniformViews;
    window.initializeViewSwitching = initializeViewSwitching;
    window.initializeSelection = initializeSelection;
});
