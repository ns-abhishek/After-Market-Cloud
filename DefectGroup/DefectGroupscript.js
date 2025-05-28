// Mock Data
const mockDefectGroups = [
    {
        id: 1,
        code: 'ELC001',
        defectGroup: 'Electrical',
        category: 'Electrical',
        isActive: true,
        createdAt: '2024-01-15T10:30:00Z',
        description: 'Electrical system defects and malfunctions',
        priority: 'High',
        assignedTo: 'John Smith',
        lastUpdated: '2024-01-20T14:22:00Z'
    },
    {
        id: 2,
        code: 'ENG001',
        defectGroup: 'Engine',
        category: 'Mechanical',
        isActive: true,
        createdAt: '2024-01-10T09:15:00Z',
        description: 'Engine performance and mechanical issues',
        priority: 'Critical',
        assignedTo: 'Sarah Johnson',
        lastUpdated: '2024-01-22T11:45:00Z'
    },
    {
        id: 3,
        code: 'HYD001',
        defectGroup: 'Hydraulic',
        category: 'Hydraulic',
        isActive: false,
        createdAt: '2024-01-08T16:20:00Z',
        description: 'Hydraulic system pressure and fluid issues',
        priority: 'Medium',
        assignedTo: 'Mike Davis',
        lastUpdated: '2024-01-18T13:30:00Z'
    },
    {
        id: 4,
        code: 'BRK001',
        defectGroup: 'Braking System',
        category: 'Safety',
        isActive: true,
        createdAt: '2024-01-12T11:45:00Z',
        description: 'Brake system defects and safety concerns',
        priority: 'Critical',
        assignedTo: 'Lisa Wilson',
        lastUpdated: '2024-01-21T16:10:00Z'
    },
    {
        id: 5,
        code: 'TRN001',
        defectGroup: 'Transmission',
        category: 'Mechanical',
        isActive: true,
        createdAt: '2024-01-14T14:30:00Z',
        description: 'Transmission and gear system issues',
        priority: 'High',
        assignedTo: 'Robert Brown',
        lastUpdated: '2024-01-19T10:15:00Z'
    },
    {
        id: 6,
        code: 'STR001',
        defectGroup: 'Steering',
        category: 'Control',
        isActive: true,
        createdAt: '2024-01-16T08:00:00Z',
        description: 'Steering mechanism and control defects',
        priority: 'High',
        assignedTo: 'Emma Taylor',
        lastUpdated: '2024-01-23T09:20:00Z'
    },
    {
        id: 7,
        code: 'SUS001',
        defectGroup: 'Suspension',
        category: 'Mechanical',
        isActive: false,
        createdAt: '2024-01-05T12:15:00Z',
        description: 'Suspension system and shock absorber issues',
        priority: 'Medium',
        assignedTo: 'David Wilson',
        lastUpdated: '2024-01-17T15:45:00Z'
    },
    {
        id: 8,
        code: 'FUL001',
        defectGroup: 'Fuel System',
        category: 'Engine',
        isActive: true,
        createdAt: '2024-01-18T13:20:00Z',
        description: 'Fuel delivery and injection system defects',
        priority: 'High',
        assignedTo: 'Jennifer Lee',
        lastUpdated: '2024-01-24T12:30:00Z'
    }
];

// Application State
class DefectManagementApp {
    constructor() {
        this.defectGroups = [...mockDefectGroups];
        this.filteredGroups = [...mockDefectGroups];
        this.selectedItems = new Set();
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.sortField = 'defectGroup';
        this.sortDirection = 'asc';
        this.searchTerm = '';
        this.selectedCategory = 'all';
        this.darkMode = false;
        this.activeDropdown = null;

        this.init();
    }

    init() {
        this.bindEvents();
        this.loadData();
        this.setupDarkMode();
        this.handleNavigationFromDefectName();
    }

    bindEvents() {
        // Dark mode toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleDarkMode();
            });
        }

        // Add defect button
        const addDefectBtn = document.getElementById('addDefectBtn');
        if (addDefectBtn) {
            addDefectBtn.addEventListener('click', () => {
                this.openModal(); // From landing page - show dropdown
            });
        }

        // Landing page search functionality
        this.initLandingSearch();

        // Selection bar events
        this.initSelectionBar();

        // Refresh button events
        this.initRefreshButtons();

        // Modal events
        const closeModal = document.getElementById('closeModal');
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                this.closeModal();
            });
        }

        const cancelBtn = document.getElementById('cancelBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.closeModal();
            });
        }

        const modalOverlay = document.querySelector('.modal-overlay');
        if (modalOverlay) {
            modalOverlay.addEventListener('click', () => {
                this.closeModal();
            });
        }

        // Form submission
        const addDefectForm = document.getElementById('addDefectForm');
        if (addDefectForm) {
            addDefectForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit();
            });
        }

        // Initialize custom dropdown
        this.initCustomDropdown();

        // Initialize category selector
        this.initCategorySelector();

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.action-dropdown') && !e.target.closest('[data-dropdown-trigger]')) {
                this.closeAllDropdowns();
            }
        });
    }

    setupDarkMode() {
        // Check for saved dark mode preference
        const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode === 'true') {
            this.darkMode = true;
            document.body.classList.add('dark');
            this.updateDarkModeIcon();
        }
    }

    toggleDarkMode() {
        this.darkMode = !this.darkMode;
        document.body.classList.toggle('dark', this.darkMode);
        localStorage.setItem('darkMode', this.darkMode.toString());
        this.updateDarkModeIcon();
    }

    updateDarkModeIcon() {
        const sunIcon = document.querySelector('.sun-icon');
        const moonIcon = document.querySelector('.moon-icon');

        if (this.darkMode) {
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        } else {
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        }
    }

    loadData() {
        // Initialize sample data for the app
        this.defectGroups = [
            {
                id: 1,
                code: 'DG001',
                defectGroup: 'Sample Defect Group',
                description: 'This is a sample defect group for demonstration',
                isActive: true,
                category: 'Assembly Faults',
                priority: 'Medium',
                lastUpdated: new Date().toISOString()
            }
        ];

        // Initialize filtered groups
        this.filteredGroups = [...this.defectGroups];

        // Update ALL categories card with totals
        this.updateAllCategoriesCard();
    }

    applyFilters() {
        let filtered = [...this.defectGroups];

        // Apply search filter
        if (this.searchTerm) {
            filtered = filtered.filter(group =>
                group.defectGroup.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                group.code.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                group.description.toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        }

        this.filteredGroups = filtered;
        this.currentPage = 1;
        this.selectedItems.clear();
        // Note: renderTable and renderStatsCards are now only called in modal context
    }

    handleSort(field) {
        if (this.sortField === field) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortField = field;
            this.sortDirection = 'asc';
        }

        this.filteredGroups.sort((a, b) => {
            let aValue = a[field];
            let bValue = b[field];

            // Handle date sorting
            if (field === 'lastUpdated' || field === 'createdAt') {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            }

            if (this.sortDirection === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        this.updateSortIcons();
        this.renderTable();
    }

    updateSortIcons() {
        // Reset all sort icons
        document.querySelectorAll('.sort-icon').forEach(icon => {
            icon.className = 'sort-icon';
        });

        // Set active sort icon
        const activeHeader = document.querySelector(`[data-sort="${this.sortField}"] .sort-icon`);
        if (activeHeader) {
            activeHeader.classList.add(this.sortDirection);
        }
    }

    renderStatsCards() {
        const total = this.defectGroups.length;
        const active = this.defectGroups.filter(group => group.isActive).length;
        const critical = this.defectGroups.filter(group => group.priority === 'Critical').length;

        // Recently updated (within last 7 days)
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const recentlyUpdated = this.defectGroups.filter(group =>
            new Date(group.lastUpdated) > weekAgo
        ).length;

        const stats = [
            // {
            //     title: 'Total Defect Groups',
            //     value: total,
            //     color: 'blue'
            // },
            // {
            //     title: 'Active Groups',
            //     value: active,
            //     color: 'green'
            // }
        ];

        const statsContainer = document.getElementById('statsCards');
        statsContainer.innerHTML = stats.map((stat, index) => `
            <div class="stat-card stat-${stat.color} animate-fade-in" style="animation-delay: ${index * 100}ms;">
                <div class="stat-card-content">
                    <div class="stat-info">
                        <h3>${stat.title}</h3>
                        <div class="stat-value">${stat.value}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    getStatIcon(iconName) {
        const icons = {
            'activity': '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>',
            'check-circle': '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
            'alert-triangle': '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path></svg>',
            'clock': '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
        };
        return icons[iconName] || '';
    }

    renderTable() {
        const tableContainer = document.getElementById('tableContainer');
        const emptyState = document.getElementById('emptyState');
        const pagination = document.getElementById('pagination');
        const tableTitle = document.getElementById('tableTitle');

        // Update table title
        tableTitle.textContent = `Defect Groups (${this.filteredGroups.length})`;

        if (this.filteredGroups.length === 0) {
            tableContainer.classList.add('hidden');
            emptyState.classList.remove('hidden');
            pagination.classList.add('hidden');
            return;
        }

        tableContainer.classList.remove('hidden');
        emptyState.classList.add('hidden');
        pagination.classList.remove('hidden');

        // Calculate pagination
        const totalPages = Math.ceil(this.filteredGroups.length / this.itemsPerPage);
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const paginatedGroups = this.filteredGroups.slice(startIndex, endIndex);

        // Render table rows
        const tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = paginatedGroups.map(group => `
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td class="px-6 py-4">
                    <input type="checkbox" class="checkbox" data-id="${group.id}"
                           ${this.selectedItems.has(group.id) ? 'checked' : ''}>
                </td>
                <td class="px-6 py-4">
                    <span class="cell-main">${group.code}</span>
                </td>
                <td class="px-6 py-4">
                    <div class="cell-main">${group.defectGroup}</div>
                </td>
                <td class="px-6 py-4">
                    <span class="badge ${group.isActive ? 'badge-green' : 'badge-gray'}">
                        ${group.isActive ? 'Yes' : 'No'}
                    </span>
                </td>
                <td class="px-6 py-4">
                    <div class="relative">
                        <button class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                data-dropdown-trigger data-id="${group.id}">
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Bind checkbox events
        tableBody.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const id = parseInt(e.target.dataset.id);
                if (e.target.checked) {
                    this.selectedItems.add(id);
                } else {
                    this.selectedItems.delete(id);
                }
                this.updateBulkActions();
                this.updateSelectAllCheckbox();
                this.updateSelectionBar();
            });
        });

        // Bind dropdown triggers
        tableBody.querySelectorAll('[data-dropdown-trigger]').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(trigger.dataset.id);
                this.toggleDropdown(trigger, id);
            });
        });

        this.renderPagination();
        this.updateBulkActions();
        this.updateSelectAllCheckbox();
        this.updateSortIcons();
    }

    getPriorityBadgeClass(priority) {
        const classes = {
            'Critical': 'badge-red',
            'High': 'badge-yellow',
            'Medium': 'badge-blue',
            'Low': 'badge-green'
        };
        return classes[priority] || 'badge-gray';
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredGroups.length / this.itemsPerPage);
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = Math.min(startIndex + this.itemsPerPage, this.filteredGroups.length);

        // Update pagination text
        document.getElementById('paginationText').textContent =
            `Showing ${startIndex + 1} to ${endIndex} of ${this.filteredGroups.length} results`;

        // Update pagination buttons
        document.getElementById('prevPage').disabled = this.currentPage === 1;
        document.getElementById('nextPage').disabled = this.currentPage === totalPages;

        // Render page numbers
        const pageNumbers = document.getElementById('pageNumbers');
        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        pageNumbers.innerHTML = '';
        for (let i = startPage; i <= endPage; i++) {
            const button = document.createElement('button');
            button.className = `page-btn ${i === this.currentPage ? 'active' : ''}`;
            button.textContent = i;
            button.addEventListener('click', () => {
                this.currentPage = i;
                this.renderTable();
            });
            pageNumbers.appendChild(button);
        }
    }

    initSelectionBar() {
        // Selection bar action buttons
        const activateBtn = document.getElementById('activateBtn');
        const deactivateBtn = document.getElementById('deactivateBtn');
        const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
        const cancelSelectionBtn = document.getElementById('cancelSelectionBtn');

        if (activateBtn) {
            activateBtn.addEventListener('click', () => {
                this.bulkActivate();
            });
        }

        if (deactivateBtn) {
            deactivateBtn.addEventListener('click', () => {
                this.bulkDeactivate();
            });
        }

        if (deleteSelectedBtn) {
            deleteSelectedBtn.addEventListener('click', () => {
                this.bulkDelete();
            });
        }

        if (cancelSelectionBtn) {
            cancelSelectionBtn.addEventListener('click', () => {
                this.clearSelection();
            });
        }
    }

    updateSelectionBar() {
        const selectionBar = document.getElementById('selectionBar');

        if (this.selectedItems.size > 0) {
            selectionBar.classList.remove('hidden');
        } else {
            selectionBar.classList.add('hidden');
        }
    }

    bulkActivate() {
        if (this.selectedItems.size === 0) return;

        // Update selected items to active
        this.defectGroups.forEach(group => {
            if (this.selectedItems.has(group.id)) {
                group.isActive = true;
            }
        });

        this.showToast('success', 'Success', 'Selected items have been activated');
        this.clearSelection();
        this.applyFilters();
        this.renderModalTable();
    }

    bulkDeactivate() {
        if (this.selectedItems.size === 0) return;

        // Update selected items to inactive
        this.defectGroups.forEach(group => {
            if (this.selectedItems.has(group.id)) {
                group.isActive = false;
            }
        });

        this.showToast('success', 'Success', 'Selected items have been deactivated');
        this.clearSelection();
        this.applyFilters();
        this.renderModalTable();
    }

    bulkDelete() {
        if (this.selectedItems.size === 0) return;

        if (confirm(`Are you sure you want to delete ${this.selectedItems.size} selected items? This action cannot be undone.`)) {
            // Remove selected items
            this.defectGroups = this.defectGroups.filter(group => !this.selectedItems.has(group.id));

            this.showToast('success', 'Success', `${this.selectedItems.size} items have been deleted`);
            this.clearSelection();
            this.applyFilters();
            this.renderModalTable();
            this.updateAllCategoriesCard();
        }
    }

    clearSelection() {
        this.selectedItems.clear();
        this.updateSelectionBar();
        this.updateBulkActions();
        this.updateSelectAllCheckbox();

        // Uncheck all checkboxes
        document.querySelectorAll('input[type="checkbox"][data-id]').forEach(checkbox => {
            checkbox.checked = false;
        });
    }

    initRefreshButtons() {
        // Categories refresh button
        const refreshCategoriesBtn = document.getElementById('refreshCategoriesBtn');
        if (refreshCategoriesBtn) {
            refreshCategoriesBtn.addEventListener('click', () => {
                this.refreshCategories();
            });
        }

        // Modal table refresh button
        const refreshModalTableBtn = document.getElementById('refreshModalTableBtn');
        if (refreshModalTableBtn) {
            refreshModalTableBtn.addEventListener('click', () => {
                this.refreshModalTable();
            });
        }
    }

    refreshCategories() {
        const refreshBtn = document.getElementById('refreshCategoriesBtn');

        // Add refreshing state
        refreshBtn.classList.add('refreshing');
        refreshBtn.disabled = true;

        // Show loading toast
        this.showToast('info', 'Refreshing', 'Updating category data...');

        // Simulate refresh delay
        setTimeout(() => {
            // Update all categories card
            this.updateAllCategoriesCard();

            // Clear any search filters
            const searchInput = document.getElementById('categorySearchInput');
            if (searchInput) {
                searchInput.value = '';
                this.filterCategories('');
            }

            // Remove refreshing state
            refreshBtn.classList.remove('refreshing');
            refreshBtn.disabled = false;

            // Show success toast
            this.showToast('success', 'Success', 'Categories refreshed successfully');
        }, 1000);
    }

    refreshModalTable() {
        const refreshBtn = document.getElementById('refreshModalTableBtn');

        // Add refreshing state
        refreshBtn.classList.add('refreshing');
        refreshBtn.disabled = true;

        // Show loading toast
        this.showToast('info', 'Refreshing', 'Updating table data...');

        // Simulate refresh delay
        setTimeout(() => {
            // Clear selections
            this.modalSelectedItems.clear();

            // Clear search
            const searchInput = document.getElementById('modalSearchInput');
            if (searchInput) {
                searchInput.value = '';
                this.modalSearchTerm = '';
            }

            // Clear filters
            this.clearModalFilters();

            // Reset pagination
            this.modalCurrentPage = 1;

            // Re-apply filters and render
            this.applyModalFilters();
            this.renderModalStatsCards();
            this.renderModalTable();

            // Remove refreshing state
            refreshBtn.classList.remove('refreshing');
            refreshBtn.disabled = false;

            // Show success toast
            this.showToast('success', 'Success', 'Table refreshed successfully');
        }, 1000);
    }

    updateBulkActions() {
        const bulkActions = document.getElementById('bulkActions');
        const selectedCount = document.getElementById('selectedCount');

        if (this.selectedItems.size > 0) {
            bulkActions.classList.remove('hidden');
            selectedCount.textContent = `${this.selectedItems.size} selected`;
        } else {
            bulkActions.classList.add('hidden');
        }
    }

    updateSelectAllCheckbox() {
        const selectAllCheckbox = document.getElementById('selectAll');
        const currentPageItems = this.getCurrentPageItems();
        const allCurrentPageSelected = currentPageItems.length > 0 &&
            currentPageItems.every(item => this.selectedItems.has(item.id));

        selectAllCheckbox.checked = allCurrentPageSelected;
        selectAllCheckbox.indeterminate = this.selectedItems.size > 0 && !allCurrentPageSelected;
    }

    getCurrentPageItems() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return this.filteredGroups.slice(startIndex, endIndex);
    }

    handleSelectAll(checked) {
        const currentPageItems = this.getCurrentPageItems();

        if (checked) {
            currentPageItems.forEach(item => this.selectedItems.add(item.id));
        } else {
            currentPageItems.forEach(item => this.selectedItems.delete(item.id));
        }

        this.updateSelectionBar();
        this.renderTable();
    }

    handleBulkDelete() {
        if (this.selectedItems.size === 0) return;

        if (confirm(`Are you sure you want to delete ${this.selectedItems.size} item(s)?`)) {
            this.defectGroups = this.defectGroups.filter(group => !this.selectedItems.has(group.id));
            this.selectedItems.clear();
            this.applyFilters();
            this.showToast('success', 'Success', `${this.selectedItems.size} item(s) deleted successfully`);
        }
    }

    toggleDropdown(trigger, id) {
        this.closeAllDropdowns();

        const group = this.defectGroups.find(g => g.id === id);
        if (!group) return;

        const dropdown = this.createDropdown(group);
        trigger.parentElement.appendChild(dropdown);
        this.activeDropdown = dropdown;

        // Position dropdown
        const rect = trigger.getBoundingClientRect();
        const dropdownRect = dropdown.getBoundingClientRect();

        if (rect.right + dropdownRect.width > window.innerWidth) {
            dropdown.style.right = '0';
            dropdown.style.left = 'auto';
        }
    }

    createDropdown(group) {
        const dropdown = document.createElement('div');
        dropdown.className = 'action-dropdown';
        dropdown.innerHTML = `
            <div class="dropdown-content">
                <button class="dropdown-item view-btn" data-action="view" data-id="${group.id}">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    View Details
                </button>
                <button class="dropdown-item edit-btn" data-action="edit" data-id="${group.id}">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    Edit
                </button>
                <button class="dropdown-item toggle-btn" data-action="toggle" data-id="${group.id}">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364L18.364 5.636"></path>
                    </svg>
                    ${group.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button class="dropdown-item delete-btn" data-action="delete" data-id="${group.id}">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Delete
                </button>
            </div>
        `;

        // Bind dropdown actions
        dropdown.querySelectorAll('[data-action]').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = button.dataset.action;
                const id = parseInt(button.dataset.id);
                this.handleDropdownAction(action, id);
                this.closeAllDropdowns();
            });
        });

        return dropdown;
    }

    closeAllDropdowns() {
        if (this.activeDropdown) {
            this.activeDropdown.remove();
            this.activeDropdown = null;
        }
    }

    handleDropdownAction(action, id) {
        const group = this.defectGroups.find(g => g.id === id);
        if (!group) return;

        switch (action) {
            case 'view':
                this.showToast('info', 'Info', `Viewing details for ${group.defectGroup}`);
                break;
            case 'edit':
                this.showToast('info', 'Info', `Edit functionality for ${group.defectGroup} would open here`);
                break;
            case 'toggle':
                group.isActive = !group.isActive;
                group.lastUpdated = new Date().toISOString();
                this.renderTable();
                this.renderStatsCards();
                this.showToast('success', 'Success',
                    `${group.defectGroup} ${group.isActive ? 'activated' : 'deactivated'} successfully`);
                break;
            case 'delete':
                if (confirm(`Are you sure you want to delete "${group.defectGroup}"?`)) {
                    this.defectGroups = this.defectGroups.filter(g => g.id !== id);
                    this.applyFilters();
                    this.showToast('success', 'Success', `${group.defectGroup} deleted successfully`);
                }
                break;
        }
    }

    openModal(preselectedCategory = null) {
        console.log('Opening modal with preselected category:', preselectedCategory);
        document.getElementById('addDefectModal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        // Reset form
        document.getElementById('addDefectForm').reset();
        this.clearFormErrors();

        // Re-check the "Is Active" checkbox by default
        document.getElementById('isActive').checked = true;

        const categoryDropdown = document.getElementById('categoryDropdown');
        const categoryField = document.getElementById('category');

        console.log('Category dropdown element:', categoryDropdown);
        console.log('Reset dropdown function available:', !!this.resetDropdown);

        if (preselectedCategory) {
            // Auto-fill category and hide dropdown
            this.setPreselectedCategory(preselectedCategory);
            categoryDropdown.style.display = 'none';
        } else {
            // Show dropdown for category selection
            categoryDropdown.style.display = 'block';
            // Reset custom dropdown
            if (this.resetDropdown) {
                console.log('Calling resetDropdown function');
                this.resetDropdown();
            } else {
                console.warn('resetDropdown function not available');
            }
        }

        // Focus first input
        setTimeout(() => {
            document.getElementById('code').focus();
        }, 100);
    }

    setPreselectedCategory(category) {
        const categoryField = document.getElementById('category');
        const categoryDropdown = document.getElementById('categoryDropdown');

        // Set the hidden input value
        categoryField.value = category;

        // Create a visual indicator for the preselected category
        const existingIndicator = document.getElementById('preselectedCategoryIndicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }

        const indicator = document.createElement('div');
        indicator.id = 'preselectedCategoryIndicator';
        indicator.className = 'preselected-category-indicator';
        indicator.innerHTML = `
            <div class="preselected-category-content">
                <div class="preselected-category-icon">
                    ${this.getCategoryIcon(category)}
                </div>
                <div class="preselected-category-info">
                    <label class="preselected-category-label">Category</label>
                    <div class="preselected-category-value">${category}</div>
                </div>
                <div class="preselected-category-badge">Auto-selected</div>
            </div>
        `;

        // Insert the indicator before the dropdown
        categoryDropdown.parentNode.insertBefore(indicator, categoryDropdown);
    }

    closeModal() {
        document.getElementById('addDefectModal').classList.add('hidden');
        document.body.style.overflow = '';
        this.clearFormErrors();

        // Clean up preselected category indicator
        const indicator = document.getElementById('preselectedCategoryIndicator');
        if (indicator) {
            indicator.remove();
        }

        // Show category dropdown again
        const categoryDropdown = document.getElementById('categoryDropdown');
        if (categoryDropdown) {
            categoryDropdown.style.display = 'block';
        }
    }

    handleFormSubmit() {
        const formData = new FormData(document.getElementById('addDefectForm'));
        const data = Object.fromEntries(formData.entries());

        // Convert checkbox value
        data.isActive = formData.has('isActive');

        if (this.validateForm(data)) {
            this.submitForm(data);
        }
    }

    validateForm(data) {
        this.clearFormErrors();
        let isValid = true;

        // Code validation
        if (!data.code || data.code.trim().length < 3) {
            this.showFormError('codeError', 'Code must be at least 3 characters long');
            isValid = false;
        }

        // Check for duplicate code (exclude current item when editing)
        const duplicateGroup = this.defectGroups.find(group =>
            group.code.toLowerCase() === data.code.toLowerCase() &&
            group.id !== this.editingId
        );
        if (duplicateGroup) {
            this.showFormError('codeError', 'Code already exists');
            isValid = false;
        }

        // Category validation
        if (!data.category) {
            this.showFormError('categoryError', 'Category is required');
            isValid = false;
        }

        // Defect group validation
        if (!data.defectGroup || data.defectGroup.trim().length === 0) {
            this.showFormError('defectGroupError', 'Defect group name is required');
            isValid = false;
        }

        return isValid;
    }

    showFormError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.innerHTML = `
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            ${message}
        `;
        errorElement.style.display = 'flex';
    }

    clearFormErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.innerHTML = '';
            element.style.display = 'none';
        });
    }

    async submitForm(data) {
        const submitBtn = document.getElementById('submitBtn');
        const submitText = document.querySelector('.submit-text');
        const submitIcon = document.querySelector('.submit-icon');
        const loadingSpinner = submitBtn.querySelector('.loading-spinner');

        const isEditing = !!this.editingId;

        // Show loading state
        submitBtn.disabled = true;
        submitText.textContent = isEditing ? 'Updating...' : 'Creating...';
        submitIcon.classList.add('hidden');
        loadingSpinner.classList.remove('hidden');

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            if (isEditing) {
                // Update existing defect group
                const groupIndex = this.defectGroups.findIndex(g => g.id === this.editingId);
                if (groupIndex !== -1) {
                    this.defectGroups[groupIndex] = {
                        ...this.defectGroups[groupIndex],
                        code: data.code.trim(),
                        defectGroup: data.defectGroup.trim(),
                        category: data.category,
                        isActive: data.isActive,
                        lastUpdated: new Date().toISOString(),
                        description: `${data.defectGroup.trim()} defect group`
                    };
                }
                this.showNotification('Defect group updated successfully!', 'success');
            } else {
                // Create new defect group
                const newGroup = {
                    id: Date.now(),
                    code: data.code.trim(),
                    defectGroup: data.defectGroup.trim(),
                    category: data.category,
                    isActive: data.isActive,
                    createdAt: new Date().toISOString(),
                    lastUpdated: new Date().toISOString(),
                    // Default values for other fields to maintain data structure
                    description: `${data.defectGroup.trim()} defect group`,
                    priority: 'Medium',
                    assignedTo: 'System Admin'
                };

                this.defectGroups.unshift(newGroup);
                this.showNotification('Defect group created successfully!', 'success');
            }

            // Update modal data if it's open
            this.modalFilteredGroups = [...this.defectGroups];
            this.renderModalStatsCards();
            this.renderModalTable();

            this.closeModal();

        } catch (error) {
            this.showNotification(
                isEditing ? 'Failed to update defect group' : 'Failed to create defect group',
                'error'
            );
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitText.textContent = isEditing ? 'Update Defect Group' : 'Create Defect Group';
            submitIcon.classList.remove('hidden');
            loadingSpinner.classList.add('hidden');

            // Clear editing state
            this.editingId = null;

            // Reset form title and button text
            document.querySelector('#addDefectModal h3').textContent = 'Add New Defect Group';
            document.querySelector('#submitBtn .submit-text').textContent = 'Create Defect Group';
        }
    }

    showToast(type, title, message) {
        const toastContainer = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icons = {
            success: '<svg class="toast-icon success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
            error: '<svg class="toast-icon error" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>',
            warning: '<svg class="toast-icon warning" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path></svg>',
            info: '<svg class="toast-icon info" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
        };

        toast.innerHTML = `
            ${icons[type]}
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        `;

        // Add close functionality
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.remove();
        });

        toastContainer.appendChild(toast);

        // Auto remove after 4 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 4000);
    }

    initCustomDropdown() {
        const dropdown = document.getElementById('categoryDropdown');
        if (!dropdown) {
            console.error('Category dropdown not found');
            return;
        }

        const trigger = dropdown.querySelector('.dropdown-trigger');
        const menu = dropdown.querySelector('.dropdown-menu');
        const valueDisplay = dropdown.querySelector('.dropdown-value');
        const hiddenInput = document.getElementById('category');
        const searchInput = dropdown.querySelector('#categorySearch');
        const optionsContainer = dropdown.querySelector('#categoryOptions');

        if (!trigger || !menu || !valueDisplay || !hiddenInput || !searchInput || !optionsContainer) {
            console.error('Dropdown elements not found:', {
                trigger: !!trigger,
                menu: !!menu,
                valueDisplay: !!valueDisplay,
                hiddenInput: !!hiddenInput,
                searchInput: !!searchInput,
                optionsContainer: !!optionsContainer
            });
            return;
        }

        let isOpen = false;
        let selectedValue = '';
        let highlightedIndex = -1;
        let allOptions = [];
        let filteredOptions = [];

        // Get all options
        const updateOptions = () => {
            allOptions = Array.from(optionsContainer.querySelectorAll('.dropdown-option'));
            filteredOptions = [...allOptions];
        };

        updateOptions();

        // Toggle dropdown
        const toggleDropdown = () => {
            console.log('Toggling dropdown, current state:', isOpen);
            isOpen = !isOpen;
            trigger.classList.toggle('active', isOpen);
            menu.classList.toggle('open', isOpen);

            console.log('Dropdown state after toggle:', {
                isOpen,
                hasActiveClass: trigger.classList.contains('active'),
                hasOpenClass: menu.classList.contains('open')
            });

            if (isOpen) {
                searchInput.focus();
                searchInput.value = '';
                filterOptions('');
                highlightedIndex = -1;
                updateHighlight();
            }
        };

        // Close dropdown
        const closeDropdown = () => {
            if (isOpen) {
                isOpen = false;
                trigger.classList.remove('active');
                menu.classList.remove('open');
                highlightedIndex = -1;
                updateHighlight();
            }
        };

        // Filter options based on search
        const filterOptions = (searchTerm) => {
            const term = searchTerm.toLowerCase();
            const popularSection = dropdown.querySelector('.popular-categories');
            const allCategoriesSection = dropdown.querySelector('.dropdown-section:last-child');

            // Filter popular category chips
            let visibleChips = 0;
            if (popularSection) {
                const categoryChips = popularSection.querySelectorAll('.category-chip');
                categoryChips.forEach(chip => {
                    const chipText = chip.textContent.toLowerCase();
                    const matches = chipText.includes(term);
                    chip.style.display = matches ? 'inline-flex' : 'none';
                    if (matches) visibleChips++;
                });
            }

            // Show/hide popular section based on matches
            const popularSectionContainer = dropdown.querySelector('.dropdown-section:first-child');
            if (popularSectionContainer) {
                popularSectionContainer.style.display = (visibleChips > 0 || !term) ? 'block' : 'none';
            }

            // Filter dropdown options
            filteredOptions = allOptions.filter(option => {
                const title = option.querySelector('.option-title').textContent.toLowerCase();
                const description = option.querySelector('.option-description').textContent.toLowerCase();
                const matches = title.includes(term) || description.includes(term);

                option.style.display = matches ? 'block' : 'none';
                return matches;
            });

            // Show/hide all categories section
            if (allCategoriesSection) {
                allCategoriesSection.style.display = (filteredOptions.length > 0 || !term) ? 'block' : 'none';
            }

            // Show no results message if needed
            if (optionsContainer) {
                const noResults = optionsContainer.querySelector('.dropdown-no-results');
                const hasResults = filteredOptions.length > 0 || visibleChips > 0;

                if (!hasResults && searchTerm) {
                    if (!noResults) {
                        const noResultsDiv = document.createElement('div');
                        noResultsDiv.className = 'dropdown-no-results';
                        noResultsDiv.innerHTML = `
                            <svg class="dropdown-no-results-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            <div>No categories found</div>
                            <div style="font-size: 0.75rem; margin-top: 0.25rem;">Try a different search term</div>
                        `;
                        optionsContainer.appendChild(noResultsDiv);
                    }
                } else if (noResults) {
                    noResults.remove();
                }
            }

            highlightedIndex = -1;
            updateHighlight();
        };

        // Update highlighted option
        const updateHighlight = () => {
            filteredOptions.forEach((option, index) => {
                option.classList.toggle('highlighted', index === highlightedIndex);
            });
        };

        // Select option
        const selectOption = (option) => {
            const value = option.dataset.value;
            const title = option.querySelector('.option-title').textContent;

            selectedValue = value;
            valueDisplay.textContent = title;
            valueDisplay.classList.remove('placeholder');
            hiddenInput.value = value;

            // Update selected state
            allOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');

            closeDropdown();

            // Clear any validation errors
            const errorElement = document.getElementById('categoryError');
            if (errorElement) {
                errorElement.innerHTML = '';
                errorElement.style.display = 'none';
            }
        };

        // Event listeners
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown();
        });

        trigger.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    toggleDropdown();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    if (!isOpen) {
                        toggleDropdown();
                    } else {
                        highlightedIndex = Math.min(highlightedIndex + 1, filteredOptions.length - 1);
                        updateHighlight();
                    }
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    if (isOpen) {
                        highlightedIndex = Math.max(highlightedIndex - 1, -1);
                        updateHighlight();
                    }
                    break;
                case 'Escape':
                    closeDropdown();
                    break;
            }
        });

        searchInput.addEventListener('input', (e) => {
            filterOptions(e.target.value);
        });

        searchInput.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    highlightedIndex = Math.min(highlightedIndex + 1, filteredOptions.length - 1);
                    updateHighlight();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    highlightedIndex = Math.max(highlightedIndex - 1, -1);
                    updateHighlight();
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
                        selectOption(filteredOptions[highlightedIndex]);
                    }
                    break;
                case 'Escape':
                    closeDropdown();
                    trigger.focus();
                    break;
            }
        });

        // Option click handlers
        allOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                selectOption(option);
            });

            option.addEventListener('mouseenter', () => {
                highlightedIndex = filteredOptions.indexOf(option);
                updateHighlight();
            });
        });

        // Category chip handlers
        const categoryChips = dropdown.querySelectorAll('.category-chip');
        categoryChips.forEach(chip => {
            chip.addEventListener('click', (e) => {
                e.stopPropagation();
                const value = chip.dataset.value;
                const correspondingOption = allOptions.find(opt => opt.dataset.value === value);
                if (correspondingOption) {
                    selectOption(correspondingOption);
                }
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                closeDropdown();
            }
        });

        // Reset dropdown when modal opens
        this.resetDropdown = () => {
            selectedValue = '';
            valueDisplay.textContent = 'Select a category';
            valueDisplay.classList.add('placeholder');
            hiddenInput.value = '';
            allOptions.forEach(opt => opt.classList.remove('selected'));
            closeDropdown();
        };
    }

    initLandingSearch() {
        const searchInput = document.getElementById('categorySearchInput');
        const categoryGrid = document.getElementById('categoryGrid');

        if (!searchInput || !categoryGrid) return;

        let searchTimeout;

        // Search input handler
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.trim();

            // Debounce search
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.filterCategories(searchTerm);
            }, 300);
        });

        // Enter key handler
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const searchTerm = searchInput.value.trim();
                this.filterCategories(searchTerm);
            }
        });
    }

    filterCategories(searchTerm) {
        const categoryCards = document.querySelectorAll('.category-card');
        const categoryGrid = document.getElementById('categoryGrid');
        let visibleCount = 0;

        categoryCards.forEach(card => {
            const categoryName = card.dataset.category.toLowerCase();
            const categoryDescription = card.querySelector('.category-description')?.textContent.toLowerCase() || '';
            const searchLower = searchTerm.toLowerCase();

            const matches = categoryName.includes(searchLower) ||
                          categoryDescription.includes(searchLower);

            if (matches || !searchTerm) {
                card.style.display = 'block';
                card.classList.remove('search-hidden');
                visibleCount++;

                // Add search highlight animation
                if (searchTerm) {
                    card.classList.add('search-match');
                    setTimeout(() => card.classList.remove('search-match'), 300);
                }
            } else {
                card.style.display = 'none';
                card.classList.add('search-hidden');
            }
        });

        // Show/hide no results message
        this.toggleNoResultsMessage(visibleCount === 0 && searchTerm);
    }

    toggleNoResultsMessage(show) {
        const categoryGrid = document.getElementById('categoryGrid');
        let noResultsDiv = document.getElementById('noSearchResults');

        if (show && !noResultsDiv) {
            noResultsDiv = document.createElement('div');
            noResultsDiv.id = 'noSearchResults';
            noResultsDiv.className = 'no-search-results';
            noResultsDiv.innerHTML = `
                <div class="no-results-content">
                    <div class="no-results-icon">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                    </div>
                    <h3>No categories found</h3>
                    <p>Try adjusting your search terms or browse all categories</p>
                    <button id="clearSearchFromResults" class="clear-search-results-btn">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                        Clear Search
                    </button>
                </div>
            `;
            categoryGrid.appendChild(noResultsDiv);

            // Add click handler for clear button in no results
            document.getElementById('clearSearchFromResults').addEventListener('click', () => {
                const searchInput = document.getElementById('categorySearchInput');
                searchInput.value = '';
                this.filterCategories('');
                searchInput.focus();
            });
        } else if (!show && noResultsDiv) {
            noResultsDiv.remove();
        }
    }

    initCategorySelector() {
        const categoryCards = document.querySelectorAll('.category-card');

        categoryCards.forEach(card => {
            card.addEventListener('click', () => {
                this.handleCategorySelection(card);
            });
        });

        // Initialize modal close functionality
        this.initCategoryModal();
    }

    initCategoryModal() {
        const modal = document.getElementById('categoryDataModal');
        const closeBtn = document.getElementById('closeCategoryModal');
        const overlay = modal.querySelector('.modal-overlay');

        // Close modal handlers
        closeBtn.addEventListener('click', () => this.closeCategoryModal());
        overlay.addEventListener('click', () => this.closeCategoryModal());

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                this.closeCategoryModal();
            }
        });

        // Initialize modal search
        const modalSearchInput = document.getElementById('modalSearchInput');
        modalSearchInput.addEventListener('input', (e) => {
            this.modalSearchTerm = e.target.value;
            this.applyModalFilters();
        });

        // Initialize filter toggle
        const toggleFiltersBtn = document.getElementById('toggleFiltersBtn');
        // const filterPanel = document.getElementById('filterPanel');

        // toggleFiltersBtn.addEventListener('click', () => {
        //     filterPanel.classList.toggle('hidden');
        //     toggleFiltersBtn.classList.toggle('active');
        // });

        // Initialize filter inputs
        this.initModalFilters();

        // Initialize modal pagination
        document.getElementById('modalPrevPage').addEventListener('click', () => {
            if (this.modalCurrentPage > 1) {
                this.modalCurrentPage--;
                this.renderModalTable();
            }
        });

        document.getElementById('modalNextPage').addEventListener('click', () => {
            const totalPages = Math.ceil(this.modalFilteredGroups.length / this.modalItemsPerPage);
            if (this.modalCurrentPage < totalPages) {
                this.modalCurrentPage++;
                this.renderModalTable();
            }
        });

        // Initialize modal items per page
        document.getElementById('modalItemsPerPage').addEventListener('change', (e) => {
            this.modalItemsPerPage = parseInt(e.target.value);
            this.modalCurrentPage = 1;
            this.renderModalTable();
        });

        // Initialize modal select all
        document.getElementById('modalSelectAll').addEventListener('change', (e) => {
            this.handleModalSelectAll(e.target.checked);
        });

        // Initialize modal add defect button
        document.getElementById('modalAddDefectBtn').addEventListener('click', () => {
            if (this.selectedCategory === 'ALL') {
                this.openModal(); // From ALL categories modal - show dropdown
            } else {
                this.openModal(this.selectedCategory); // From category modal - auto-fill category
            }
        });
    }

    async handleCategorySelection(selectedCard) {
        const category = selectedCard.dataset.category;

        // Add loading state
        selectedCard.classList.add('loading');

        // Remove active state from all cards
        document.querySelectorAll('.category-card').forEach(card => {
            card.classList.remove('active', 'selected');
        });

        try {
            // Simulate loading delay for better UX
            await new Promise(resolve => setTimeout(resolve, 800));

            // Set selected category
            this.selectedCategory = category;

            if (category === 'ALL') {
                // Load all categories data
                await this.loadAllCategoriesData();

                // Update UI
                selectedCard.classList.remove('loading');
                selectedCard.classList.add('selected', 'success');

                // Open all categories modal
                this.openAllCategoriesModal();
            } else {
                // Load data for selected category
                await this.loadCategoryData(category);

                // Update UI
                selectedCard.classList.remove('loading');
                selectedCard.classList.add('selected', 'success');

                // Open category modal instead of showing inline
                this.openCategoryModal(category);
            }

        } catch (error) {
            console.error('Error loading category data:', error);
            selectedCard.classList.remove('loading');
            this.showNotification('Error loading category data', 'error');
        }
    }

    async handleCategorySelectionByName(categoryName) {
        // Find the category card by name
        const categoryCard = document.querySelector(`[data-category="${categoryName}"]`);
        if (categoryCard) {
            // Use the existing method with the found card
            await this.handleCategorySelection(categoryCard);
        } else {
            // If card not found, directly open the modal
            this.selectedCategory = categoryName;
            if (categoryName === 'ALL') {
                await this.loadAllCategoriesData();
                this.openAllCategoriesModal();
            } else {
                await this.loadCategoryData(categoryName);
                this.openCategoryModal(categoryName);
            }
        }
    }

    openCategoryModal(category, specificDefectGroup = null) {
        const modal = document.getElementById('categoryDataModal');
        const modalTitle = document.getElementById('categoryModalTitle');
        const modalSubtitle = document.getElementById('categoryModalSubtitle');
        const modalIcon = document.getElementById('categoryModalIcon');

        // Set modal title and icon
        if (specificDefectGroup) {
            modalTitle.textContent = specificDefectGroup;
            modalSubtitle.textContent = `Defect groups in ${category} - ${specificDefectGroup}`;
        } else {
            modalTitle.textContent = category;
            modalSubtitle.textContent = `Manage defect groups for ${category}`;
        }

        // Set modal icon based on category
        const iconClass = this.getCategoryIconClass(category);
        modalIcon.className = `category-modal-icon ${iconClass}`;
        modalIcon.innerHTML = this.getCategoryIcon(category);

        // Initialize modal state
        this.modalSearchTerm = '';
        this.modalCurrentPage = 1;
        this.modalItemsPerPage = 10;
        this.modalSelectedItems = new Set();
        this.modalActiveFilters = new Set();

        // Clear and reset filters
        this.clearModalFilters();

        // Filter data based on category and specific defect group if provided
        let filteredData = [...this.defectGroups];
        if (category !== 'ALL') {
            filteredData = filteredData.filter(group => group.category === category);
        }
        if (specificDefectGroup) {
            filteredData = filteredData.filter(group => group.defectGroup === specificDefectGroup);
        }
        this.modalFilteredGroups = filteredData;

        // Clear search input
        document.getElementById('modalSearchInput').value = '';

        // Hide category filter for single category view
        const categoryFilterGroup = document.getElementById('categoryFilterGroup');
        categoryFilterGroup.style.display = 'none';

        // Render modal content
        this.renderModalStatsCards();
        this.renderModalTable();

        // Hide category column for single category view (after table is rendered)
        this.toggleCategoryColumn(false);

        // Show modal
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    openAllCategoriesModal() {
        const modal = document.getElementById('categoryDataModal');
        const modalTitle = document.getElementById('categoryModalTitle');
        const modalSubtitle = document.getElementById('categoryModalSubtitle');
        const modalIcon = document.getElementById('categoryModalIcon');

        // Set modal title and icon for all categories
        modalTitle.textContent = 'All Categories';
        modalSubtitle.textContent = 'Manage defect groups across all categories';

        // Set modal icon for all categories
        modalIcon.className = 'category-modal-icon all';
        modalIcon.innerHTML = this.getCategoryIcon('ALL');

        // Initialize modal state
        this.modalSearchTerm = '';
        this.modalCurrentPage = 1;
        this.modalItemsPerPage = 10;
        this.modalSelectedItems = new Set();
        this.modalActiveFilters = new Set();
        this.modalFilteredGroups = [...this.defectGroups];

        // Clear and reset filters
        this.clearModalFilters();

        // Clear search input
        document.getElementById('modalSearchInput').value = '';

        // Show category filter for all categories view
        const categoryFilterGroup = document.getElementById('categoryFilterGroup');
        categoryFilterGroup.style.display = 'flex';

        // Render modal content
        this.renderModalStatsCards();
        this.renderModalTable();

        // Show category column for all categories view (after table is rendered)
        this.toggleCategoryColumn(true);

        // Show modal
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    toggleCategoryColumn(show) {
        const categoryHeaders = document.querySelectorAll('.category-column');
        const categoryColumns = document.querySelectorAll('.category-cell');

        categoryHeaders.forEach(header => {
            if (show) {
                header.classList.remove('hidden');
            } else {
                header.classList.add('hidden');
            }
        });

        categoryColumns.forEach(cell => {
            if (show) {
                cell.classList.remove('hidden');
            } else {
                cell.classList.add('hidden');
            }
        });
    }

    closeCategoryModal() {
        const modal = document.getElementById('categoryDataModal');
        modal.classList.add('hidden');
        document.body.style.overflow = '';

        // Reset category card states
        document.querySelectorAll('.category-card').forEach(card => {
            card.classList.remove('selected', 'success', 'loading');
        });
    }

    async loadCategoryData(category) {
        // Generate sample data for the category
        this.defectGroups = this.generateSampleDataForCategory(category);

        // Apply current filters
        this.applyFilters();

        // Update stats
        this.renderStatsCards();
    }

    async loadAllCategoriesData() {
        // Generate sample data for all categories
        const allCategories = ['Assembly Faults', 'Electrical Faults', 'Mechanical Faults', 'Hydraulic Faults', 'Safety Issues', 'Control System'];
        this.defectGroups = [];

        allCategories.forEach(category => {
            const categoryData = this.generateSampleDataForCategory(category);
            // Ensure category field is set for each defect group
            categoryData.forEach(group => {
                group.category = category;
            });
            this.defectGroups = this.defectGroups.concat(categoryData);
        });

        // Update modal filtered groups to use the new data
        this.modalFilteredGroups = [...this.defectGroups];

        // Apply current filters
        this.applyFilters();

        // Update stats
        this.renderStatsCards();
    }

    getCategoryIconClass(category) {
        const iconMap = {
            'Assembly Faults': 'assembly',
            'Electrical Faults': 'electrical',
            'Mechanical Faults': 'mechanical',
            'Hydraulic Faults': 'hydraulic',
            'Safety Issues': 'safety',
            'Control System': 'control',
            'ALL': 'all'
        };
        return iconMap[category] || 'assembly';
    }

    getCategoryIcon(category) {
        const iconMap = {
            'Assembly Faults': '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>',
            'Electrical Faults': '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>',
            'Mechanical Faults': '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>',
            'Hydraulic Faults': '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>',
            'Safety Issues': '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>',
            'Control System': '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path></svg>',
            'ALL': '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>'
        };
        return iconMap[category] || iconMap['Assembly Faults'];
    }

    renderModalStatsCards() {
        const total = this.defectGroups.length;
        const active = this.defectGroups.filter(group => group.isActive).length;
        const inactive = this.defectGroups.filter(group => !group.isActive).length;

        const stats = [
            {
                title: 'Total Groups',
                value: total,
                color: 'blue',
                filter: 'total',
                clickable: false
            },
            {
                title: 'Active Groups',
                value: active,
                color: 'green',
                filter: 'active',
                clickable: true
            },
            {
                title: 'Inactive Groups',
                value: inactive,
                color: 'red',
                filter: 'inactive',
                clickable: true
            }
        ];

        // Initialize filter state if not exists
        if (!this.modalActiveFilters) {
            this.modalActiveFilters = new Set();
        }

        const statsContainer = document.getElementById('modalStatsCards');
        statsContainer.innerHTML = stats.map((stat, index) => `
            <div class="stat-card stat-${stat.color} ${stat.clickable ? 'stat-clickable' : ''} ${this.modalActiveFilters.has(stat.filter) ? 'stat-active' : ''} animate-fade-in"
                 style="animation-delay: ${index * 100}ms;"
                 ${stat.clickable ? `data-filter="${stat.filter}"` : ''}>
                <div class="stat-card-content">
                    <div class="stat-info">
                        <h3>${stat.title}</h3>
                        <div class="stat-value">${stat.value}</div>
                        ${stat.clickable ? '<div class="stat-filter-hint">Click to filter</div>' : ''}
                    </div>
                    ${stat.clickable ? '<div class="stat-filter-indicator"></div>' : ''}
                </div>
            </div>
        `).join('');

        // Add click event listeners for filterable stats
        statsContainer.querySelectorAll('.stat-clickable').forEach(card => {
            card.addEventListener('click', () => {
                const filter = card.dataset.filter;
                this.toggleModalFilter(filter);
            });
        });
    }

    toggleModalFilter(filter) {
        if (this.modalActiveFilters.has(filter)) {
            this.modalActiveFilters.delete(filter);
        } else {
            this.modalActiveFilters.add(filter);
        }

        // Re-render stats cards to update active states
        this.renderModalStatsCards();

        // Apply filters
        this.applyModalFilters();
    }

    initModalFilters() {
        // Initialize filter state
        this.modalFilters = {
            code: '',
            defectGroup: '',
            category: '',
            status: ''
        };

        // Check if elements exist before binding events
        const codeFilter = document.getElementById('codeFilter');
        const defectGroupFilter = document.getElementById('defectGroupFilter');
        const categoryFilter = document.getElementById('categoryFilter');
        const statusFilter = document.getElementById('statusFilter');
        const applyFiltersBtn = document.getElementById('applyFiltersBtn');
        const clearFiltersBtn = document.getElementById('clearFiltersBtn');

        if (codeFilter) {
            codeFilter.addEventListener('input', (e) => {
                this.modalFilters.code = e.target.value;
                this.applyModalFilters();
            });
        }

        if (defectGroupFilter) {
            defectGroupFilter.addEventListener('input', (e) => {
                this.modalFilters.defectGroup = e.target.value;
                this.applyModalFilters();
            });
        }

        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.modalFilters.category = e.target.value;
                this.applyModalFilters();
            });
        }

        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.modalFilters.status = e.target.value;
                this.applyModalFilters();
            });
        }

        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', () => {
                this.applyModalFilters();
            });
        }

        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.clearModalFilters();
            });
        }

        // Populate category filter options
        this.populateCategoryFilter();
    }

    populateCategoryFilter() {
        const categoryFilter = document.getElementById('categoryFilter');
        if (!categoryFilter) return;

        const categories = [...new Set(this.defectGroups.map(group => group.category).filter(Boolean))];

        // Clear existing options except the first one
        categoryFilter.innerHTML = '<option value="">All Categories</option>';

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }

    clearModalFilters() {
        // Reset filter inputs safely
        const codeFilter = document.getElementById('codeFilter');
        const defectGroupFilter = document.getElementById('defectGroupFilter');
        const categoryFilter = document.getElementById('categoryFilter');
        const statusFilter = document.getElementById('statusFilter');

        if (codeFilter) codeFilter.value = '';
        if (defectGroupFilter) defectGroupFilter.value = '';
        if (categoryFilter) categoryFilter.value = '';
        if (statusFilter) statusFilter.value = '';

        // Reset filter state
        this.modalFilters = {
            code: '',
            defectGroup: '',
            category: '',
            status: ''
        };

        // Apply filters (which will show all data)
        this.applyModalFilters();
    }

    applyModalFilters() {
        // Always start with the complete defectGroups data
        let filtered = [...this.defectGroups];

        // If we're in a specific category view, filter by that category first
        if (this.selectedCategory && this.selectedCategory !== 'ALL') {
            filtered = filtered.filter(group => group.category === this.selectedCategory);
        }

        // Apply search filter
        if (this.modalSearchTerm) {
            filtered = filtered.filter(group =>
                group.defectGroup.toLowerCase().includes(this.modalSearchTerm.toLowerCase()) ||
                group.code.toLowerCase().includes(this.modalSearchTerm.toLowerCase()) ||
                group.description.toLowerCase().includes(this.modalSearchTerm.toLowerCase()) ||
                (group.category && group.category.toLowerCase().includes(this.modalSearchTerm.toLowerCase()))
            );
        }

        // Apply advanced filters
        if (this.modalFilters) {
            // Code filter
            if (this.modalFilters.code) {
                filtered = filtered.filter(group =>
                    group.code.toLowerCase().includes(this.modalFilters.code.toLowerCase())
                );
            }

            // Defect Group filter
            if (this.modalFilters.defectGroup) {
                filtered = filtered.filter(group =>
                    group.defectGroup.toLowerCase().includes(this.modalFilters.defectGroup.toLowerCase())
                );
            }

            // Category filter
            if (this.modalFilters.category) {
                filtered = filtered.filter(group =>
                    group.category === this.modalFilters.category
                );
            }

            // Status filter
            if (this.modalFilters.status) {
                filtered = filtered.filter(group => {
                    if (this.modalFilters.status === 'active') {
                        return group.isActive === true;
                    } else if (this.modalFilters.status === 'inactive') {
                        return group.isActive === false;
                    }
                    return true;
                });
            }
        }

        // Apply status filters from stats cards (if any are active)
        if (this.modalActiveFilters && this.modalActiveFilters.size > 0) {
            filtered = filtered.filter(group => {
                // If multiple filters are active, show items that match ANY of them (OR logic)
                return Array.from(this.modalActiveFilters).some(filter => {
                    switch (filter) {
                        case 'active':
                            return group.isActive === true;
                        case 'inactive':
                            return group.isActive === false;
                        default:
                            return true;
                    }
                });
            });
        }

        this.modalFilteredGroups = filtered;
        this.modalCurrentPage = 1;
        this.modalSelectedItems.clear();
        this.renderModalTable();
    }

    renderModalTable() {
        const tableContainer = document.getElementById('modalTableContainer');
        const emptyState = document.getElementById('modalEmptyState');
        const pagination = document.getElementById('modalPagination');
        const tableTitle = document.getElementById('modalTableTitle');

        // Update table title
        tableTitle.textContent = `Defect Groups (${this.modalFilteredGroups.length})`;

        if (this.modalFilteredGroups.length === 0) {
            tableContainer.classList.add('hidden');
            emptyState.classList.remove('hidden');
            pagination.classList.add('hidden');
            return;
        }

        tableContainer.classList.remove('hidden');
        emptyState.classList.add('hidden');
        pagination.classList.remove('hidden');

        // Calculate pagination
        const totalPages = Math.ceil(this.modalFilteredGroups.length / this.modalItemsPerPage);
        const startIndex = (this.modalCurrentPage - 1) * this.modalItemsPerPage;
        const endIndex = startIndex + this.modalItemsPerPage;
        const paginatedGroups = this.modalFilteredGroups.slice(startIndex, endIndex);

        // Render table rows
        const tableBody = document.getElementById('modalTableBody');
        tableBody.innerHTML = paginatedGroups.map(group => `
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td class="px-6 py-4">
                    <input type="checkbox" class="checkbox" data-id="${group.id}"
                           ${this.modalSelectedItems.has(group.id) ? 'checked' : ''}>
                </td>
                <td class="px-6 py-4">
                    <span class="cell-main">${group.code}</span>
                </td>
                <td class="px-6 py-4">
                    <div class="cell-main">${group.defectGroup}</div>
                </td>
                <td class="px-6 py-4 category-cell hidden">
                    <span class="badge badge-blue">${group.category || 'Unknown'}</span>
                </td>
                <td class="px-6 py-4">
                    <span class="badge ${group.isActive ? 'badge-green' : 'badge-gray'}">
                        ${group.isActive ? 'Yes' : 'No'}
                    </span>
                </td>
                <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                        <button class="action-btn-small edit-btn" data-id="${group.id}" title="Edit">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                        </button>
                        <button class="action-btn-small toggle-btn" data-id="${group.id}" title="Toggle Status">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                            </svg>
                        </button>
                        <button class="action-btn-small delete-btn" data-id="${group.id}" title="Delete">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Bind checkbox events
        tableBody.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const id = parseInt(e.target.dataset.id);
                if (e.target.checked) {
                    this.modalSelectedItems.add(id);
                } else {
                    this.modalSelectedItems.delete(id);
                }
                this.updateModalBulkActions();
                this.updateModalSelectAllCheckbox();
            });
        });

        // Bind action button events
        tableBody.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                this.editDefectGroup(id);
            });
        });

        tableBody.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                this.toggleDefectGroupStatus(id);
            });
        });

        tableBody.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                this.deleteDefectGroup(id);
            });
        });

        this.renderModalPagination();
        this.updateModalBulkActions();
        this.updateModalSelectAllCheckbox();

        // Ensure category column visibility is maintained based on current context
        if (this.selectedCategory === 'ALL') {
            this.toggleCategoryColumn(true);
        } else {
            this.toggleCategoryColumn(false);
        }
    }

    renderModalPagination() {
        const totalPages = Math.ceil(this.modalFilteredGroups.length / this.modalItemsPerPage);
        const startIndex = (this.modalCurrentPage - 1) * this.modalItemsPerPage;
        const endIndex = Math.min(startIndex + this.modalItemsPerPage, this.modalFilteredGroups.length);

        // Update pagination text
        document.getElementById('modalPaginationText').textContent =
            `Showing ${startIndex + 1} to ${endIndex} of ${this.modalFilteredGroups.length} results`;

        // Update pagination buttons
        document.getElementById('modalPrevPage').disabled = this.modalCurrentPage === 1;
        document.getElementById('modalNextPage').disabled = this.modalCurrentPage === totalPages;

        // Render page numbers
        const pageNumbers = document.getElementById('modalPageNumbers');
        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.modalCurrentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        pageNumbers.innerHTML = '';
        for (let i = startPage; i <= endPage; i++) {
            const button = document.createElement('button');
            button.className = `page-btn ${i === this.modalCurrentPage ? 'active' : ''}`;
            button.textContent = i;
            button.addEventListener('click', () => {
                this.modalCurrentPage = i;
                this.renderModalTable();
            });
            pageNumbers.appendChild(button);
        }
    }

    updateModalBulkActions() {
        const bulkActions = document.getElementById('modalBulkActions');
        const selectedCount = document.getElementById('modalSelectedCount');

        if (this.modalSelectedItems.size > 0) {
            bulkActions.classList.remove('hidden');
            selectedCount.textContent = `${this.modalSelectedItems.size} selected`;
        } else {
            bulkActions.classList.add('hidden');
        }
    }

    updateModalSelectAllCheckbox() {
        const selectAllCheckbox = document.getElementById('modalSelectAll');
        const currentPageItems = this.getCurrentModalPageItems();
        const allCurrentPageSelected = currentPageItems.length > 0 &&
            currentPageItems.every(item => this.modalSelectedItems.has(item.id));

        selectAllCheckbox.checked = allCurrentPageSelected;
        selectAllCheckbox.indeterminate = this.modalSelectedItems.size > 0 && !allCurrentPageSelected;
    }

    getCurrentModalPageItems() {
        const startIndex = (this.modalCurrentPage - 1) * this.modalItemsPerPage;
        const endIndex = startIndex + this.modalItemsPerPage;
        return this.modalFilteredGroups.slice(startIndex, endIndex);
    }

    handleModalSelectAll(checked) {
        const currentPageItems = this.getCurrentModalPageItems();

        if (checked) {
            currentPageItems.forEach(item => this.modalSelectedItems.add(item.id));
        } else {
            currentPageItems.forEach(item => this.modalSelectedItems.delete(item.id));
        }

        this.renderModalTable();
    }

    editDefectGroup(id) {
        const group = this.defectGroups.find(g => g.id === id);
        if (!group) return;

        // Pre-fill the form with existing data
        document.getElementById('categoryValue').textContent = group.category;
        document.getElementById('category').value = group.category;
        document.getElementById('code').value = group.code;
        document.getElementById('defectGroup').value = group.defectGroup;
        document.getElementById('isActive').checked = group.isActive;

        // Update form title and button
        document.querySelector('#addDefectModal h3').textContent = 'Edit Defect Group';
        document.querySelector('#submitBtn .submit-text').textContent = 'Update Defect Group';

        // Store the ID for update
        this.editingId = id;

        // Open the modal
        this.openModal(group.category);
    }

    toggleDefectGroupStatus(id) {
        const group = this.defectGroups.find(g => g.id === id);
        if (!group) return;

        // Toggle the status
        group.isActive = !group.isActive;

        // Show notification
        this.showNotification(
            `Defect group "${group.defectGroup}" ${group.isActive ? 'activated' : 'deactivated'}`,
            'success'
        );

        // Re-render the table and stats
        this.renderModalStatsCards();
        this.renderModalTable();
    }

    deleteDefectGroup(id) {
        const group = this.defectGroups.find(g => g.id === id);
        if (!group) return;

        // Show confirmation dialog
        if (confirm(`Are you sure you want to delete "${group.defectGroup}"?`)) {
            // Remove from array
            this.defectGroups = this.defectGroups.filter(g => g.id !== id);

            // Update filtered groups
            this.modalFilteredGroups = this.modalFilteredGroups.filter(g => g.id !== id);

            // Show notification
            this.showNotification(
                `Defect group "${group.defectGroup}" deleted successfully`,
                'success'
            );

            // Re-render the table and stats
            this.renderModalStatsCards();
            this.renderModalTable();
        }
    }

    generateSampleDataForCategory(category) {
        const sampleData = {
            'Assembly Faults': [
                { id: 101, code: 'ASM001', defectGroup: 'Bolt Misalignment', description: 'Incorrect bolt positioning during assembly', isActive: true, category: 'Assembly Faults' },
                { id: 102, code: 'ASM002', defectGroup: 'Weld Defects', description: 'Poor weld quality in assembly joints', isActive: true, category: 'Assembly Faults' },
                { id: 103, code: 'ASM003', defectGroup: 'Part Mismatch', description: 'Wrong parts used in assembly process', isActive: false, category: 'Assembly Faults' },
                { id: 104, code: 'ASM004', defectGroup: 'Torque Issues', description: 'Incorrect torque specifications', isActive: true, category: 'Assembly Faults' },
                { id: 105, code: 'ASM005', defectGroup: 'Alignment Problems', description: 'Component alignment issues', isActive: true, category: 'Assembly Faults' }
            ],
            'Electrical Faults': [
                { id: 201, code: 'ELC001', defectGroup: 'Short Circuit', description: 'Electrical short circuit in wiring', isActive: true, category: 'Electrical Faults' },
                { id: 202, code: 'ELC002', defectGroup: 'Open Circuit', description: 'Broken electrical connections', isActive: true, category: 'Electrical Faults' },
                { id: 203, code: 'ELC003', defectGroup: 'Voltage Drop', description: 'Excessive voltage drop in circuits', isActive: true, category: 'Electrical Faults' },
                { id: 204, code: 'ELC004', defectGroup: 'Insulation Failure', description: 'Electrical insulation breakdown', isActive: false, category: 'Electrical Faults' }
            ],
            'Mechanical Faults': [
                { id: 301, code: 'MEC001', defectGroup: 'Bearing Failure', description: 'Premature bearing wear and failure', isActive: true, category: 'Mechanical Faults' },
                { id: 302, code: 'MEC002', defectGroup: 'Shaft Misalignment', description: 'Improper shaft alignment causing vibration', isActive: true, category: 'Mechanical Faults' },
                { id: 303, code: 'MEC003', defectGroup: 'Gear Wear', description: 'Excessive gear tooth wear', isActive: false, category: 'Mechanical Faults' },
                { id: 304, code: 'MEC004', defectGroup: 'Belt Tension', description: 'Incorrect belt tension settings', isActive: true, category: 'Mechanical Faults' }
            ],
            'Hydraulic Faults': [
                { id: 401, code: 'HYD001', defectGroup: 'Fluid Leak', description: 'Hydraulic fluid leakage from seals', isActive: true, category: 'Hydraulic Faults' },
                { id: 402, code: 'HYD002', defectGroup: 'Pressure Loss', description: 'Loss of hydraulic pressure', isActive: true, category: 'Hydraulic Faults' },
                { id: 403, code: 'HYD003', defectGroup: 'Contamination', description: 'Hydraulic fluid contamination', isActive: true, category: 'Hydraulic Faults' }
            ],
            'Safety Issues': [
                { id: 501, code: 'SAF001', defectGroup: 'Guard Missing', description: 'Safety guards not properly installed', isActive: true, category: 'Safety Issues' },
                { id: 502, code: 'SAF002', defectGroup: 'Emergency Stop', description: 'Emergency stop system malfunction', isActive: true, category: 'Safety Issues' },
                { id: 503, code: 'SAF003', defectGroup: 'Warning Labels', description: 'Missing or damaged warning labels', isActive: true, category: 'Safety Issues' }
            ],
            'Control System': [
                { id: 601, code: 'CTL001', defectGroup: 'Sensor Failure', description: 'Control system sensor malfunction', isActive: true, category: 'Control System' },
                { id: 602, code: 'CTL002', defectGroup: 'PLC Error', description: 'Programmable logic controller errors', isActive: true, category: 'Control System' },
                { id: 603, code: 'CTL003', defectGroup: 'HMI Issues', description: 'Human machine interface problems', isActive: false, category: 'Control System' }
            ]
        };

        return sampleData[category] || [];
    }

    updateAllCategoriesCard() {
        // Calculate totals from all categories
        const allCategories = ['Assembly Faults', 'Electrical Faults', 'Mechanical Faults', 'Hydraulic Faults', 'Safety Issues', 'Control System'];
        let totalGroups = 0;
        let totalActive = 0;

        allCategories.forEach(category => {
            const categoryData = this.generateSampleDataForCategory(category);
            totalGroups += categoryData.length;
            totalActive += categoryData.filter(group => group.isActive).length;
        });

        // Update the ALL category card
        const totalElement = document.getElementById('allCategoriesTotal');
        const activeElement = document.getElementById('allCategoriesActive');

        if (totalElement) totalElement.textContent = totalGroups;
        if (activeElement) activeElement.textContent = totalActive;
    }

    handleNavigationFromDefectName() {
        // Check if we have navigation data from defect-name.html
        const navigationData = sessionStorage.getItem('defectGroupNavigation');
        if (navigationData) {
            try {
                const data = JSON.parse(navigationData);

                // Check if the data is recent (within last 5 seconds to avoid stale data)
                const now = Date.now();
                if (now - data.timestamp < 5000) {
                    // Clear the navigation data
                    sessionStorage.removeItem('defectGroupNavigation');

                    setTimeout(() => {
                        if (data.showCategoryGroups) {
                            // Show category groups - find and simulate clicking the category card
                            this.handleCategorySelectionByName(data.category);
                        } else if (data.openModal && data.defectGroup) {
                            // Open specific defect group modal
                            this.openCategoryModal(data.category, data.defectGroup);
                        }
                    }, 500); // Small delay to ensure page is fully loaded
                }
            } catch (error) {
                console.error('Error parsing navigation data:', error);
                sessionStorage.removeItem('defectGroupNavigation');
            }
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 3000);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new DefectManagementApp();
});


