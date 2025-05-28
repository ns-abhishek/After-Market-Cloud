// Fail Code Management System - Main JavaScript File

class FailCodeManager {
    constructor() {
        this.currentPage = 1;
        this.recordsPerPage = 10;
        this.currentSort = { column: null, direction: 'asc' };
        this.failCodeSearchTerm = '';
        this.descriptionSearchTerm = '';
        this.selectedRecords = new Set();
        this.editingRecord = null;
        this.selectedWarrantyType = '';
        this.isDropdownOpen = false;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.populateWarrantyTypes();
        this.renderTable();
        this.updatePagination();
    }

    setupEventListeners() {
        // Searchable Warranty Type Dropdown
        const warrantyTypeSearch = document.getElementById('warrantyTypeSearch');
        const dropdownContainer = document.querySelector('.searchable-dropdown-container');

        warrantyTypeSearch.addEventListener('click', () => {
            this.toggleDropdown();
        });

        warrantyTypeSearch.addEventListener('input', (e) => {
            this.filterWarrantyTypes(e.target.value);
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdownContainer.contains(e.target)) {
                this.closeDropdown();
            }
        });

        // Clear buttons
        document.getElementById('clearWarrantyBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.clearWarrantySelection();
        });

        document.getElementById('clearSearchBtn').addEventListener('click', () => {
            this.clearAllSearches();
        });

        // Action Buttons
        document.getElementById('addBtn').addEventListener('click', () => this.addRecord());
        document.getElementById('deleteBtn').addEventListener('click', () => this.deleteSelectedRecords());
        document.getElementById('saveBtn').addEventListener('click', () => this.saveRecord());
        document.getElementById('refreshBtn').addEventListener('click', () => this.refreshData());
        document.getElementById('exportBtn').addEventListener('click', () => this.exportData());

        // Search Controls
        document.getElementById('failCodeSearch').addEventListener('input', (e) => {
            this.failCodeSearchTerm = e.target.value;
            this.updateSearchClearButtonState();
            this.currentPage = 1;
            this.renderTable();
            this.updatePagination();
        });

        document.getElementById('descriptionSearch').addEventListener('input', (e) => {
            this.descriptionSearchTerm = e.target.value;
            this.updateSearchClearButtonState();
            this.currentPage = 1;
            this.renderTable();
            this.updatePagination();
        });

        document.getElementById('recordsPerPage').addEventListener('change', (e) => {
            this.recordsPerPage = parseInt(e.target.value);
            this.currentPage = 1;
            this.renderTable();
            this.updatePagination();
        });

        // Select All Checkbox
        document.getElementById('selectAll').addEventListener('change', (e) => {
            this.toggleSelectAll(e.target.checked);
        });

        // Pagination
        document.getElementById('prevPage').addEventListener('click', () => this.goToPage(this.currentPage - 1));
        document.getElementById('nextPage').addEventListener('click', () => this.goToPage(this.currentPage + 1));

        // Modal
        document.getElementById('confirmYes').addEventListener('click', () => this.confirmAction());
        document.getElementById('confirmNo').addEventListener('click', () => this.hideModal());

        // Add Modal
        document.getElementById('addForm').addEventListener('submit', (e) => this.handleAddSubmit(e));
        document.getElementById('addCancel').addEventListener('click', () => this.hideAddModal());
    }

    populateWarrantyTypes() {
        const select = document.getElementById('warrantyType');
        const dropdownList = document.getElementById('warrantyDropdownList');

        select.innerHTML = '<option value="">--Select Warranty Type--</option>';
        dropdownList.innerHTML = '';

        warrantyTypes.forEach(type => {
            // Populate hidden select
            const option = document.createElement('option');
            option.value = type.id;
            option.textContent = type.name;
            select.appendChild(option);

            // Populate dropdown list
            const dropdownItem = document.createElement('div');
            dropdownItem.className = 'dropdown-item';
            dropdownItem.textContent = type.name;
            dropdownItem.dataset.value = type.id;
            dropdownItem.addEventListener('click', () => {
                this.selectWarrantyType(type.id, type.name);
            });
            dropdownList.appendChild(dropdownItem);
        });
    }

    toggleDropdown() {
        const dropdownContainer = document.querySelector('.searchable-dropdown-container');
        const dropdownList = document.getElementById('warrantyDropdownList');
        const warrantyTypeSearch = document.getElementById('warrantyTypeSearch');

        this.isDropdownOpen = !this.isDropdownOpen;

        if (this.isDropdownOpen) {
            dropdownContainer.classList.add('open');
            dropdownList.style.display = 'block';
            // Add animation class after display
            setTimeout(() => {
                dropdownList.classList.add('show');
            }, 10);
            warrantyTypeSearch.removeAttribute('readonly');
            warrantyTypeSearch.focus();
        } else {
            this.closeDropdown();
        }
    }

    closeDropdown() {
        const dropdownContainer = document.querySelector('.searchable-dropdown-container');
        const dropdownList = document.getElementById('warrantyDropdownList');
        const warrantyTypeSearch = document.getElementById('warrantyTypeSearch');

        this.isDropdownOpen = false;
        dropdownContainer.classList.remove('open');
        dropdownList.classList.remove('show');

        // Hide after animation
        setTimeout(() => {
            if (!this.isDropdownOpen) {
                dropdownList.style.display = 'none';
            }
        }, 300);

        warrantyTypeSearch.setAttribute('readonly', 'readonly');
        warrantyTypeSearch.blur();
    }

    filterWarrantyTypes(searchTerm) {
        const dropdownList = document.getElementById('warrantyDropdownList');
        const items = dropdownList.querySelectorAll('.dropdown-item');
        let hasResults = false;

        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            const matches = text.includes(searchTerm.toLowerCase());
            item.style.display = matches ? 'block' : 'none';
            if (matches) hasResults = true;
        });

        // Show/hide no results message
        let noResultsMsg = dropdownList.querySelector('.no-results');
        if (!hasResults && searchTerm) {
            if (!noResultsMsg) {
                noResultsMsg = document.createElement('div');
                noResultsMsg.className = 'no-results';
                noResultsMsg.textContent = 'No warranty types found';
                dropdownList.appendChild(noResultsMsg);
            }
            noResultsMsg.style.display = 'block';
        } else if (noResultsMsg) {
            noResultsMsg.style.display = 'none';
        }
    }

    selectWarrantyType(warrantyTypeId, warrantyTypeName) {
        const warrantyTypeSearch = document.getElementById('warrantyTypeSearch');
        const select = document.getElementById('warrantyType');
        const dropdownList = document.getElementById('warrantyDropdownList');
        const clearBtn = document.getElementById('clearWarrantyBtn');

        // Update input and select values
        warrantyTypeSearch.value = warrantyTypeName;
        select.value = warrantyTypeId;

        // Enable clear button when a selection is made
        clearBtn.disabled = false;

        // Update selected state in dropdown
        const items = dropdownList.querySelectorAll('.dropdown-item');
        items.forEach(item => {
            item.classList.remove('selected');
            if (item.dataset.value === warrantyTypeId) {
                item.classList.add('selected');
            }
        });

        this.selectedWarrantyType = warrantyTypeId;
        this.closeDropdown();
        this.renderTable();
        this.updatePagination();
    }

    clearWarrantySelection() {
        const warrantyTypeSearch = document.getElementById('warrantyTypeSearch');
        const select = document.getElementById('warrantyType');
        const dropdownList = document.getElementById('warrantyDropdownList');
        const clearBtn = document.getElementById('clearWarrantyBtn');

        // Clear input and select values
        warrantyTypeSearch.value = '';
        select.value = '';

        // Disable clear button
        clearBtn.disabled = true;

        // Remove selected state from all dropdown items
        const items = dropdownList.querySelectorAll('.dropdown-item');
        items.forEach(item => {
            item.classList.remove('selected');
        });

        // Reset warranty type selection
        this.selectedWarrantyType = '';
        this.currentPage = 1;
        this.renderTable();
        this.updatePagination();
    }

    onWarrantyTypeChange(warrantyTypeId) {
        this.selectedWarrantyType = warrantyTypeId;
        this.renderTable();
        this.updatePagination();
    }



    updateSearchClearButtonState() {
        const failCodeValue = document.getElementById('failCodeSearch').value;
        const descriptionValue = document.getElementById('descriptionSearch').value;
        const clearBtn = document.getElementById('clearSearchBtn');

        // Enable clear button if either search field has content
        clearBtn.disabled = (!failCodeValue || failCodeValue.trim() === '') &&
                           (!descriptionValue || descriptionValue.trim() === '');
    }

    clearAllSearches() {
        // Clear search inputs
        document.getElementById('failCodeSearch').value = '';
        document.getElementById('descriptionSearch').value = '';

        // Reset search terms
        this.failCodeSearchTerm = '';
        this.descriptionSearchTerm = '';

        // Disable clear button
        document.getElementById('clearSearchBtn').disabled = true;

        // Reset page and refresh table
        this.currentPage = 1;
        this.renderTable();
        this.updatePagination();
    }

    updateButtonStates() {
        const hasSelection = this.selectedRecords.size > 0;
        document.getElementById('deleteBtn').disabled = !hasSelection;
    }

    addRecord() {
        if (!this.selectedWarrantyType) {
            alert('Please select a warranty type first.');
            return;
        }

        // Show the add modal
        this.showAddModal();
    }

    showAddModal() {
        // Clear the form
        document.getElementById('newFailCode').value = '';
        document.getElementById('newFailDescription').value = '';
        document.getElementById('newIsActive').checked = true;

        // Show the modal
        document.getElementById('addModal').style.display = 'flex';

        // Focus on the first input
        setTimeout(() => {
            document.getElementById('newFailCode').focus();
        }, 100);
    }

    hideAddModal() {
        document.getElementById('addModal').style.display = 'none';
    }

    handleAddSubmit(e) {
        e.preventDefault();

        const failCode = document.getElementById('newFailCode').value.trim();
        const failDescription = document.getElementById('newFailDescription').value.trim();
        const isActive = document.getElementById('newIsActive').checked;

        // Validate required fields
        if (!failCode || !failDescription) {
            alert('Please fill in all required fields.');
            return;
        }

        // Check for duplicate fail code
        const existingRecord = failCodeRecords.find(record =>
            record.failCode.toLowerCase() === failCode.toLowerCase() &&
            record.warrantyType === this.selectedWarrantyType
        );

        if (existingRecord) {
            alert('A fail code with this name already exists for the selected warranty type.');
            return;
        }

        // Get the warranty type name
        const warrantyTypeName = warrantyTypes.find(wt => wt.id === this.selectedWarrantyType)?.name || '';

        // Create a new record
        const newRecord = {
            id: Date.now(), // Temporary ID
            warrantyType: this.selectedWarrantyType,
            warrantyTypeName: warrantyTypeName,
            failCode: failCode,
            failCodeName: failDescription,
            isActive: isActive,
            createdDate: new Date().toISOString().split('T')[0],
            lastModified: new Date().toISOString().split('T')[0]
        };

        // Add to the beginning of the records array
        failCodeRecords.unshift(newRecord);

        // Reset to first page to show the new record
        this.currentPage = 1;

        // Re-render the table
        this.renderTable();
        this.updatePagination();

        // Hide the modal
        this.hideAddModal();

        // Show success message
        this.showMessage('New fail code added successfully!', 'success');
    }

    clearForm() {
        document.getElementById('warrantyType').value = '';
        this.selectedWarrantyType = '';
        this.renderTable();
        this.updatePagination();
    }

    saveRecord() {
        this.showMessage('No changes to save.', 'info');
    }

    editRecord(id) {
        alert(`Edit record ${id} functionality would be implemented here`);
    }

    deleteRecord(id) {
        this.showConfirmModal('Are you sure you want to delete this record?', () => {
            failCodeRecords = failCodeRecords.filter(r => r.id !== id);
            this.selectedRecords.delete(id);
            this.renderTable();
            this.updatePagination();
            this.updateButtonStates();
            this.showMessage('Record deleted successfully!', 'success');
        });
    }

    deleteSelectedRecords() {
        if (this.selectedRecords.size === 0) return;

        const count = this.selectedRecords.size;
        this.showConfirmModal(`Are you sure you want to delete ${count} selected record(s)?`, () => {
            failCodeRecords = failCodeRecords.filter(r => !this.selectedRecords.has(r.id));
            this.selectedRecords.clear();
            this.renderTable();
            this.updatePagination();
            this.updateButtonStates();
            this.showMessage(`${count} record(s) deleted successfully!`, 'success');
        });
    }

    refreshData() {
        this.clearForm();
        this.selectedRecords.clear();
        this.editingRecord = null;
        this.currentPage = 1;
        this.searchTerm = '';
        document.getElementById('tableSearch').value = '';
        this.renderTable();
        this.updatePagination();
        this.updateButtonStates();
        this.showMessage('Data refreshed successfully!', 'info');
    }

    exportData() {
        const filteredRecords = this.getFilteredRecords();
        const csvContent = this.convertToCSV(filteredRecords);
        this.downloadCSV(csvContent, 'fail_code_records.csv');
        this.showMessage('Data exported successfully!', 'success');
    }

    convertToCSV(records) {
        const headers = ['Warranty Type', 'Warranty Type Name', 'Fail Code', 'Fail Code Description', 'Is Active', 'Created Date', 'Last Modified'];
        const csvRows = [headers.join(',')];

        records.forEach(record => {
            const row = [
                record.warrantyType,
                `"${record.warrantyTypeName}"`,
                record.failCode,
                `"${record.failCodeName}"`,
                record.isActive ? 'Yes' : 'No',
                record.createdDate,
                record.lastModified
            ];
            csvRows.push(row.join(','));
        });

        return csvRows.join('\n');
    }

    downloadCSV(csvContent, filename) {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    getFilteredRecords() {
        let filtered = failCodeRecords;

        // Filter by selected warranty type
        if (this.selectedWarrantyType) {
            filtered = filtered.filter(record => record.warrantyType === this.selectedWarrantyType);
        }

        // Filter by fail code search term
        if (this.failCodeSearchTerm) {
            const term = this.failCodeSearchTerm.toLowerCase();
            filtered = filtered.filter(record =>
                record.failCode.toLowerCase().includes(term)
            );
        }

        // Filter by description search term
        if (this.descriptionSearchTerm) {
            const term = this.descriptionSearchTerm.toLowerCase();
            filtered = filtered.filter(record =>
                record.failCodeName.toLowerCase().includes(term)
            );
        }

        return filtered;
    }

    renderTable() {
        const tbody = document.getElementById('tableBody');
        const filteredRecords = this.getFilteredRecords();

        // Apply sorting
        if (this.currentSort.column) {
            filteredRecords.sort((a, b) => {
                let aVal = a[this.currentSort.column];
                let bVal = b[this.currentSort.column];

                if (typeof aVal === 'string') {
                    aVal = aVal.toLowerCase();
                    bVal = bVal.toLowerCase();
                }

                if (this.currentSort.direction === 'asc') {
                    return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
                } else {
                    return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
                }
            });
        }

        // Pagination
        const startIndex = (this.currentPage - 1) * this.recordsPerPage;
        const endIndex = startIndex + this.recordsPerPage;
        const paginatedRecords = filteredRecords.slice(startIndex, endIndex);

        tbody.innerHTML = '';

        if (paginatedRecords.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px; color: #6c757d;">
                        <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
                        No records found
                    </td>
                </tr>
            `;
            return;
        }

        paginatedRecords.forEach(record => {
            const row = document.createElement('tr');
            row.className = this.selectedRecords.has(record.id) ? 'selected' : '';

            row.innerHTML = `
                <td>
                    <input type="checkbox" ${this.selectedRecords.has(record.id) ? 'checked' : ''}
                           onchange="failCodeManager.toggleRecordSelection(${record.id}, this.checked)">
                </td>
                <td style="text-align: center;">
                    <button class="btn-icon edit-btn" onclick="failCodeManager.editRecord(${record.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
                <td style="text-align: center;">
                    <button class="btn-icon delete-btn" onclick="failCodeManager.deleteRecord(${record.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
                <td>
                    <input type="text" class="table-input fail-code-input" value="${record.failCode}" readonly>
                </td>
                <td>
                    <input type="text" class="table-input fail-description-input" value="${record.failCodeName}" readonly>
                </td>
                <td style="text-align: center;">
                    <span class="status-badge ${record.isActive ? 'status-active' : 'status-inactive'}">
                        ${record.isActive ? 'Yes' : 'No'}
                    </span>
                </td>
            `;

            tbody.appendChild(row);
        });

        this.updateSelectAllCheckbox();
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    toggleRecordSelection(id, selected) {
        if (selected) {
            this.selectedRecords.add(id);
        } else {
            this.selectedRecords.delete(id);
        }
        this.updateButtonStates();
        this.updateSelectAllCheckbox();
    }

    toggleSelectAll(selectAll) {
        const filteredRecords = this.getFilteredRecords();
        const startIndex = (this.currentPage - 1) * this.recordsPerPage;
        const endIndex = startIndex + this.recordsPerPage;
        const paginatedRecords = filteredRecords.slice(startIndex, endIndex);

        paginatedRecords.forEach(record => {
            if (selectAll) {
                this.selectedRecords.add(record.id);
            } else {
                this.selectedRecords.delete(record.id);
            }
        });

        this.renderTable();
        this.updateButtonStates();
    }

    updateSelectAllCheckbox() {
        const filteredRecords = this.getFilteredRecords();
        const startIndex = (this.currentPage - 1) * this.recordsPerPage;
        const endIndex = startIndex + this.recordsPerPage;
        const paginatedRecords = filteredRecords.slice(startIndex, endIndex);

        const selectAllCheckbox = document.getElementById('selectAll');
        const selectedCount = paginatedRecords.filter(r => this.selectedRecords.has(r.id)).length;

        selectAllCheckbox.checked = paginatedRecords.length > 0 && selectedCount === paginatedRecords.length;
        selectAllCheckbox.indeterminate = selectedCount > 0 && selectedCount < paginatedRecords.length;
    }

    getTotalPages() {
        const filteredRecords = this.getFilteredRecords();
        return Math.ceil(filteredRecords.length / this.recordsPerPage);
    }

    goToPage(page) {
        const totalPages = this.getTotalPages();
        if (page < 1 || page > totalPages) return;

        this.currentPage = page;
        this.renderTable();
        this.updatePagination();
    }

    updatePagination() {
        const filteredRecords = this.getFilteredRecords();
        const totalRecords = filteredRecords.length;
        const totalPages = this.getTotalPages();
        const startRecord = totalRecords === 0 ? 0 : (this.currentPage - 1) * this.recordsPerPage + 1;
        const endRecord = Math.min(this.currentPage * this.recordsPerPage, totalRecords);

        // Update pagination info
        document.getElementById('paginationInfo').textContent =
            `Showing ${startRecord} to ${endRecord} of ${totalRecords} entries`;

        // Update page info
        document.getElementById('pageInfo').textContent =
            `Page ${this.currentPage} of ${totalPages || 1}`;

        // Update pagination buttons
        document.getElementById('prevPage').disabled = this.currentPage === 1;
        document.getElementById('nextPage').disabled = this.currentPage === totalPages || totalPages === 0;
    }

    showConfirmModal(message, onConfirm) {
        document.getElementById('confirmMessage').textContent = message;
        document.getElementById('confirmModal').style.display = 'flex';
        this.pendingConfirmAction = onConfirm;
    }

    hideModal() {
        document.getElementById('confirmModal').style.display = 'none';
        this.pendingConfirmAction = null;
    }

    confirmAction() {
        if (this.pendingConfirmAction) {
            this.pendingConfirmAction();
        }
        this.hideModal();
    }

    showMessage(message, type = 'info') {
        // Simple alert for now - could be enhanced with toast notifications
        alert(message);
    }

    showLoading() {
        document.getElementById('loadingSpinner').style.display = 'flex';
    }

    hideLoading() {
        document.getElementById('loadingSpinner').style.display = 'none';
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.failCodeManager = new FailCodeManager();
});
