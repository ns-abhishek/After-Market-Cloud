// Sample data for Movement Types
let movementTypes = [
    {
        id: 1,
        company: 'HCL_AMP',
        description: 'Slow',
        isActive: 'Yes',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
    },
    {
        id: 2,
        company: 'HCL_AMP',
        description: 'Medium',
        isActive: 'Yes',
        createdAt: new Date('2024-01-16'),
        updatedAt: new Date('2024-01-16')
    },
    {
        id: 3,
        company: 'HCL_AMP',
        description: 'Fast',
        isActive: 'Yes',
        createdAt: new Date('2024-01-17'),
        updatedAt: new Date('2024-01-17')
    },
    {
        id: 4,
        company: 'TECH_CORP',
        description: 'Express',
        isActive: 'No',
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-18')
    },
    {
        id: 5,
        company: 'TECH_CORP',
        description: 'Standard',
        isActive: 'Yes',
        createdAt: new Date('2024-01-19'),
        updatedAt: new Date('2024-01-19')
    },
    {
        id: 6,
        company: 'LOGISTICS_PRO',
        description: 'Priority',
        isActive: 'Yes',
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20')
    },
    {
        id: 7,
        company: 'LOGISTICS_PRO',
        description: 'Overnight',
        isActive: 'Yes',
        createdAt: new Date('2024-01-21'),
        updatedAt: new Date('2024-01-21')
    },
    {
        id: 8,
        company: 'GLOBAL_SHIP',
        description: 'Economy',
        isActive: 'Yes',
        createdAt: new Date('2024-01-22'),
        updatedAt: new Date('2024-01-22')
    },
    {
        id: 9,
        company: 'GLOBAL_SHIP',
        description: 'Same Day',
        isActive: 'No',
        createdAt: new Date('2024-01-23'),
        updatedAt: new Date('2024-01-23')
    },
    {
        id: 10,
        company: 'SWIFT_MOVE',
        description: 'Rush',
        isActive: 'Yes',
        createdAt: new Date('2024-01-24'),
        updatedAt: new Date('2024-01-24')
    },
    {
        id: 11,
        company: 'SWIFT_MOVE',
        description: 'Regular',
        isActive: 'No',
        createdAt: new Date('2024-01-25'),
        updatedAt: new Date('2024-01-25')
    },
    {
        id: 12,
        company: 'CARGO_PLUS',
        description: 'Freight',
        isActive: 'Yes',
        createdAt: new Date('2024-01-26'),
        updatedAt: new Date('2024-01-26')
    },
    {
        id: 13,
        company: 'CARGO_PLUS',
        description: 'Air Cargo',
        isActive: 'Yes',
        createdAt: new Date('2024-01-27'),
        updatedAt: new Date('2024-01-27')
    },
    {
        id: 14,
        company: 'METRO_TRANS',
        description: 'Local',
        isActive: 'Yes',
        createdAt: new Date('2024-01-28'),
        updatedAt: new Date('2024-01-28')
    },
    {
        id: 15,
        company: 'METRO_TRANS',
        description: 'Regional',
        isActive: 'No',
        createdAt: new Date('2024-01-29'),
        updatedAt: new Date('2024-01-29')
    },
    {
        id: 16,
        company: 'SPEED_LINK',
        description: 'Ultra Fast',
        isActive: 'Yes',
        createdAt: new Date('2024-01-30'),
        updatedAt: new Date('2024-01-30')
    },
    {
        id: 17,
        company: 'SPEED_LINK',
        description: 'Next Day',
        isActive: 'Yes',
        createdAt: new Date('2024-01-31'),
        updatedAt: new Date('2024-01-31')
    },
    {
        id: 18,
        company: 'RELIABLE_MOVE',
        description: 'Scheduled',
        isActive: 'Yes',
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-01')
    },
    {
        id: 19,
        company: 'RELIABLE_MOVE',
        description: 'On-Demand',
        isActive: 'No',
        createdAt: new Date('2024-02-02'),
        updatedAt: new Date('2024-02-02')
    },
    {
        id: 20,
        company: 'QUICK_DISPATCH',
        description: 'Instant',
        isActive: 'Yes',
        createdAt: new Date('2024-02-03'),
        updatedAt: new Date('2024-02-03')
    },
    {
        id: 21,
        company: 'QUICK_DISPATCH',
        description: 'Urgent',
        isActive: 'Yes',
        createdAt: new Date('2024-02-04'),
        updatedAt: new Date('2024-02-04')
    },
    {
        id: 22,
        company: 'FLEX_TRANS',
        description: 'Flexible',
        isActive: 'Yes',
        createdAt: new Date('2024-02-05'),
        updatedAt: new Date('2024-02-05')
    },
    {
        id: 23,
        company: 'FLEX_TRANS',
        description: 'Bulk',
        isActive: 'No',
        createdAt: new Date('2024-02-06'),
        updatedAt: new Date('2024-02-06')
    },
    {
        id: 24,
        company: 'PRIME_LOGISTICS',
        description: 'Premium',
        isActive: 'Yes',
        createdAt: new Date('2024-02-07'),
        updatedAt: new Date('2024-02-07')
    },
    {
        id: 25,
        company: 'PRIME_LOGISTICS',
        description: 'Basic',
        isActive: 'Yes',
        createdAt: new Date('2024-02-08'),
        updatedAt: new Date('2024-02-08')
    }
];

// Sample data for different modules
const moduleData = {
    'movement-type': [...movementTypes],
    'movement-type-definition': [
        {
            id: 1,
            description: 'Fast',
            unmoved: 0,
            slow: 50,
            medium: 100,
            fast: 101,
            isActive: 'Yes',
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-01-15')
        },
        {
            id: 2,
            description: 'Medium',
            unmoved: 0,
            slow: 25,
            medium: 75,
            fast: 85,
            isActive: 'Yes',
            createdAt: new Date('2024-01-16'),
            updatedAt: new Date('2024-01-16')
        },
        {
            id: 3,
            description: 'Slow',
            unmoved: 0,
            slow: 10,
            medium: 30,
            fast: 45,
            isActive: 'Yes',
            createdAt: new Date('2024-01-17'),
            updatedAt: new Date('2024-01-17')
        },
        {
            id: 4,
            description: 'Express',
            unmoved: 0,
            slow: 75,
            medium: 150,
            fast: 200,
            isActive: 'No',
            createdAt: new Date('2024-01-18'),
            updatedAt: new Date('2024-01-18')
        },
        {
            id: 5,
            description: 'Standard',
            unmoved: 0,
            slow: 40,
            medium: 80,
            fast: 120,
            isActive: 'Yes',
            createdAt: new Date('2024-01-19'),
            updatedAt: new Date('2024-01-19')
        }
    ],
    'parts-category': [
        { id: 1, company: 'HCL_AMP', description: 'A/C System', isActive: 'Yes', createdAt: new Date('2024-01-15'), updatedAt: new Date('2024-01-15') },
        { id: 2, company: 'HCL_AMP', description: 'Accessory (Inside)', isActive: 'Yes', createdAt: new Date('2024-01-16'), updatedAt: new Date('2024-01-16') },
        { id: 3, company: 'HCL_AMP', description: 'Accessory (Outside)', isActive: 'Yes', createdAt: new Date('2024-01-17'), updatedAt: new Date('2024-01-17') },
        { id: 4, company: 'HCL_AMP', description: 'Audio/Video', isActive: 'Yes', createdAt: new Date('2024-01-18'), updatedAt: new Date('2024-01-18') },
        { id: 5, company: 'HCL_AMP', description: 'AUT-Classic/New Look', isActive: 'Yes', createdAt: new Date('2024-01-19'), updatedAt: new Date('2024-01-19') },
        { id: 6, company: 'HCL_AMP', description: 'AUTX-Transit Common', isActive: 'Yes', createdAt: new Date('2024-01-20'), updatedAt: new Date('2024-01-20') },
        { id: 7, company: 'HCL_AMP', description: 'batteries', isActive: 'Yes', createdAt: new Date('2024-01-21'), updatedAt: new Date('2024-01-21') },
        { id: 8, company: 'HCL_AMP', description: 'Bearing', isActive: 'Yes', createdAt: new Date('2024-01-22'), updatedAt: new Date('2024-01-22') },
        { id: 9, company: 'HCL_AMP', description: 'Boutique', isActive: 'Yes', createdAt: new Date('2024-01-23'), updatedAt: new Date('2024-01-23') },
        { id: 10, company: 'HCL_AMP', description: 'Campaign', isActive: 'Yes', createdAt: new Date('2024-01-24'), updatedAt: new Date('2024-01-24') }
    ],
    'parts-category-definition': [
        {
            id: 1,
            partsCategory: 'A/C System',
            conversionFactor: 0.200,
            profitValue: 30.00,
            netRateFactor: 12.000,
            isActive: 'Yes',
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-01-15')
        },
        {
            id: 2,
            partsCategory: 'Bearing',
            conversionFactor: 2.000,
            profitValue: 500.00,
            netRateFactor: 500.000,
            isActive: 'Yes',
            createdAt: new Date('2024-01-16'),
            updatedAt: new Date('2024-01-16')
        },
        {
            id: 3,
            partsCategory: 'Audio/Video',
            conversionFactor: 1.500,
            profitValue: 250.00,
            netRateFactor: 150.000,
            isActive: 'Yes',
            createdAt: new Date('2024-01-17'),
            updatedAt: new Date('2024-01-17')
        },
        {
            id: 4,
            partsCategory: 'Accessory (Inside)',
            conversionFactor: 0.750,
            profitValue: 75.00,
            netRateFactor: 45.000,
            isActive: 'Yes',
            createdAt: new Date('2024-01-18'),
            updatedAt: new Date('2024-01-18')
        },
        {
            id: 5,
            partsCategory: 'Accessory (Outside)',
            conversionFactor: 0.850,
            profitValue: 85.00,
            netRateFactor: 55.000,
            isActive: 'No',
            createdAt: new Date('2024-01-19'),
            updatedAt: new Date('2024-01-19')
        },
        {
            id: 6,
            partsCategory: 'batteries',
            conversionFactor: 3.000,
            profitValue: 800.00,
            netRateFactor: 750.000,
            isActive: 'Yes',
            createdAt: new Date('2024-01-20'),
            updatedAt: new Date('2024-01-20')
        }
    ]
};

// Data management functions
class DataManager {
    constructor(moduleType = 'movement-type') {
        this.moduleType = moduleType;
        this.data = [...(moduleData[moduleType] || [])];
        this.filteredData = [...this.data];
        this.currentPage = 1;
        this.pageSize = 10;
        this.sortColumn = null;
        this.sortDirection = 'asc';
        this.filters = {
            search: '',
            company: '',
            description: '',
            status: ''
        };
        this.editingRows = new Set();
    }

    // Get all data
    getAllData() {
        return [...this.data];
    }

    // Get filtered and paginated data
    getData() {
        return {
            data: this.getPaginatedData(),
            totalItems: this.filteredData.length,
            currentPage: this.currentPage,
            pageSize: this.pageSize,
            totalPages: Math.ceil(this.filteredData.length / this.pageSize)
        };
    }

    // Apply filters
    applyFilters() {
        this.filteredData = this.data.filter(item => {
            // Search filter
            const searchMatch = !this.filters.search ||
                Object.values(item).some(value =>
                    value.toString().toLowerCase().includes(this.filters.search.toLowerCase())
                );

            // Dynamic advanced filters
            let advancedFiltersMatch = true;
            for (const [filterKey, filterValue] of Object.entries(this.filters)) {
                if (filterKey === 'search' || !filterValue) continue;

                // Handle status filter (maps to isActive)
                if (filterKey === 'status') {
                    if (item.isActive !== filterValue) {
                        advancedFiltersMatch = false;
                        break;
                    }
                    continue;
                }

                // Handle other filters
                if (item[filterKey] !== undefined) {
                    const itemValue = item[filterKey].toString().toLowerCase();
                    const filterValueLower = filterValue.toString().toLowerCase();

                    if (!itemValue.includes(filterValueLower)) {
                        advancedFiltersMatch = false;
                        break;
                    }
                }
            }

            return searchMatch && advancedFiltersMatch;
        });

        // Reset to first page when filters change
        this.currentPage = 1;

        // Apply sorting if set
        if (this.sortColumn) {
            this.applySorting();
        }
    }

    // Apply sorting
    applySorting() {
        this.filteredData.sort((a, b) => {
            let aValue = a[this.sortColumn];
            let bValue = b[this.sortColumn];

            // Handle different data types
            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (aValue < bValue) {
                return this.sortDirection === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return this.sortDirection === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }

    // Get paginated data
    getPaginatedData() {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        return this.filteredData.slice(startIndex, endIndex);
    }

    // Set search filter
    setSearchFilter(searchTerm) {
        this.filters.search = searchTerm;
        this.applyFilters();
    }

    // Set advanced filters
    setAdvancedFilters(filters) {
        this.filters = { ...this.filters, ...filters };
        this.applyFilters();
    }

    // Clear all filters
    clearFilters() {
        // Reset all filters to empty strings
        Object.keys(this.filters).forEach(key => {
            this.filters[key] = '';
        });
        this.applyFilters();
    }

    // Set sorting
    setSorting(column, direction) {
        this.sortColumn = column;
        this.sortDirection = direction;
        this.applySorting();
    }

    // Set page
    setPage(page) {
        const totalPages = Math.ceil(this.filteredData.length / this.pageSize);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
        }
    }

    // Set page size
    setPageSize(size) {
        this.pageSize = size;
        this.currentPage = 1; // Reset to first page
        this.applyFilters(); // Reapply to update pagination
    }

    // Add new item
    addItem(item) {
        const newId = Math.max(...this.data.map(d => d.id)) + 1;
        const newItem = {
            ...item,
            id: newId,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.data.push(newItem);
        this.applyFilters();
        return newItem;
    }

    // Update item
    updateItem(id, updates) {
        const index = this.data.findIndex(item => item.id === id);
        if (index !== -1) {
            this.data[index] = {
                ...this.data[index],
                ...updates,
                updatedAt: new Date()
            };
            this.applyFilters();
            return this.data[index];
        }
        return null;
    }

    // Delete item
    deleteItem(id) {
        const index = this.data.findIndex(item => item.id === id);
        if (index !== -1) {
            const deletedItem = this.data.splice(index, 1)[0];
            this.applyFilters();
            return deletedItem;
        }
        return null;
    }

    // Delete multiple items
    deleteItems(ids) {
        const deletedItems = [];
        ids.forEach(id => {
            const deletedItem = this.deleteItem(id);
            if (deletedItem) {
                deletedItems.push(deletedItem);
            }
        });
        return deletedItems;
    }

    // Get item by ID
    getItemById(id) {
        return this.data.find(item => item.id === id);
    }

    // Inline editing methods
    startEditing(id) {
        this.editingRows.add(id);
    }

    stopEditing(id) {
        this.editingRows.delete(id);
    }

    isEditing(id) {
        return this.editingRows.has(id);
    }

    // Export data
    exportData(format = 'csv') {
        const dataToExport = this.filteredData.length > 0 ? this.filteredData : this.data;

        switch (format) {
            case 'csv':
                return this.exportToCSV(dataToExport);
            case 'json':
                return this.exportToJSON(dataToExport);
            case 'excel':
                return this.exportToExcel(dataToExport);
            default:
                return this.exportToCSV(dataToExport);
        }
    }

    // Export to CSV
    exportToCSV(data) {
        const headers = ['ID', 'Company', 'Description', 'Is Active', 'Created At', 'Updated At'];
        const csvContent = [
            headers.join(','),
            ...data.map(item => [
                item.id,
                `"${item.company}"`,
                `"${item.description}"`,
                item.isActive,
                item.createdAt.toISOString().split('T')[0],
                item.updatedAt.toISOString().split('T')[0]
            ].join(','))
        ].join('\n');

        return {
            content: csvContent,
            filename: `movement_types_${new Date().toISOString().split('T')[0]}.csv`,
            mimeType: 'text/csv'
        };
    }

    // Export to JSON
    exportToJSON(data) {
        const jsonContent = JSON.stringify(data, null, 2);
        return {
            content: jsonContent,
            filename: `movement_types_${new Date().toISOString().split('T')[0]}.json`,
            mimeType: 'application/json'
        };
    }

    // Export to Excel (simplified - would need a library for full Excel support)
    exportToExcel(data) {
        // For now, return CSV with .xlsx extension
        // In a real application, you'd use a library like SheetJS
        const csvData = this.exportToCSV(data);
        return {
            ...csvData,
            filename: csvData.filename.replace('.csv', '.xlsx'),
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        };
    }

    // Get unique values for filters
    getUniqueCompanies() {
        return [...new Set(this.data.map(item => item.company))].sort();
    }

    getUniqueDescriptions() {
        return [...new Set(this.data.map(item => item.description))].sort();
    }

    // Refresh data (simulate API call)
    refresh() {
        return new Promise((resolve) => {
            setTimeout(() => {
                // In a real application, this would fetch from an API
                this.applyFilters();
                resolve(this.getData());
            }, 500);
        });
    }
}

// Create global data manager instance
const dataManager = new DataManager();
