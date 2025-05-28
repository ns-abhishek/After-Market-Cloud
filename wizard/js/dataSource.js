/**
 * Report Wizard - Data Source Module
 *
 * This module handles data source selection, loading, and parsing.
 */

// Sample data sets
const sampleDataSets = {
    sales: {
        name: 'Sales Data',
        description: 'Monthly sales data with products, regions, and revenue',
        data: [
            { id: 1, date: '2023-01-15', product: 'Laptop', category: 'Electronics', region: 'North', quantity: 12, unitPrice: 1200, revenue: 14400 },
            { id: 2, date: '2023-01-20', product: 'Smartphone', category: 'Electronics', region: 'South', quantity: 25, unitPrice: 800, revenue: 20000 },
            { id: 3, date: '2023-01-22', product: 'Desk Chair', category: 'Furniture', region: 'East', quantity: 10, unitPrice: 250, revenue: 2500 },
            { id: 4, date: '2023-02-05', product: 'Coffee Maker', category: 'Appliances', region: 'West', quantity: 8, unitPrice: 120, revenue: 960 },
            { id: 5, date: '2023-02-10', product: 'Headphones', category: 'Electronics', region: 'North', quantity: 30, unitPrice: 100, revenue: 3000 },
            { id: 6, date: '2023-02-15', product: 'Monitor', category: 'Electronics', region: 'South', quantity: 15, unitPrice: 350, revenue: 5250 },
            { id: 7, date: '2023-03-01', product: 'Desk', category: 'Furniture', region: 'East', quantity: 7, unitPrice: 400, revenue: 2800 },
            { id: 8, date: '2023-03-10', product: 'Blender', category: 'Appliances', region: 'West', quantity: 12, unitPrice: 80, revenue: 960 },
            { id: 9, date: '2023-03-15', product: 'Tablet', category: 'Electronics', region: 'North', quantity: 18, unitPrice: 600, revenue: 10800 },
            { id: 10, date: '2023-03-25', product: 'Bookshelf', category: 'Furniture', region: 'South', quantity: 5, unitPrice: 150, revenue: 750 }
        ]
    },
    employees: {
        name: 'Employee Records',
        description: 'Employee information with departments and performance metrics',
        data: [
            { id: 1, firstName: 'John', lastName: 'Smith', department: 'Engineering', position: 'Senior Developer', hireDate: '2020-03-15', salary: 95000, performanceScore: 4.2 },
            { id: 2, firstName: 'Emily', lastName: 'Johnson', department: 'Marketing', position: 'Marketing Manager', hireDate: '2019-06-22', salary: 88000, performanceScore: 4.5 },
            { id: 3, firstName: 'Michael', lastName: 'Williams', department: 'Sales', position: 'Sales Representative', hireDate: '2021-01-10', salary: 65000, performanceScore: 3.8 },
            { id: 4, firstName: 'Jessica', lastName: 'Brown', department: 'HR', position: 'HR Specialist', hireDate: '2018-11-05', salary: 72000, performanceScore: 4.0 },
            { id: 5, firstName: 'David', lastName: 'Jones', department: 'Engineering', position: 'Developer', hireDate: '2022-02-18', salary: 78000, performanceScore: 3.9 },
            { id: 6, firstName: 'Sarah', lastName: 'Davis', department: 'Marketing', position: 'Content Specialist', hireDate: '2021-07-30', salary: 62000, performanceScore: 4.1 },
            { id: 7, firstName: 'Robert', lastName: 'Miller', department: 'Sales', position: 'Sales Manager', hireDate: '2017-09-12', salary: 92000, performanceScore: 4.3 },
            { id: 8, firstName: 'Jennifer', lastName: 'Wilson', department: 'HR', position: 'HR Director', hireDate: '2016-04-25', salary: 105000, performanceScore: 4.7 },
            { id: 9, firstName: 'Thomas', lastName: 'Moore', department: 'Engineering', position: 'Lead Developer', hireDate: '2019-12-03', salary: 98000, performanceScore: 4.4 },
            { id: 10, firstName: 'Lisa', lastName: 'Taylor', department: 'Marketing', position: 'Marketing Analyst', hireDate: '2020-08-15', salary: 70000, performanceScore: 3.7 }
        ]
    },
    inventory: {
        name: 'Inventory Management',
        description: 'Product inventory with stock levels and suppliers',
        data: [
            { id: 1, productName: 'Laptop Pro', sku: 'LP-001', category: 'Electronics', supplier: 'TechCorp', stockLevel: 45, reorderLevel: 10, unitCost: 800, retailPrice: 1200 },
            { id: 2, productName: 'Wireless Mouse', sku: 'WM-002', category: 'Accessories', supplier: 'TechCorp', stockLevel: 120, reorderLevel: 30, unitCost: 15, retailPrice: 25 },
            { id: 3, productName: 'Office Desk', sku: 'OD-003', category: 'Furniture', supplier: 'FurnishCo', stockLevel: 18, reorderLevel: 5, unitCost: 250, retailPrice: 400 },
            { id: 4, productName: 'Coffee Machine', sku: 'CM-004', category: 'Appliances', supplier: 'HomeGoods', stockLevel: 12, reorderLevel: 5, unitCost: 75, retailPrice: 120 },
            { id: 5, productName: 'Bluetooth Headphones', sku: 'BH-005', category: 'Electronics', supplier: 'AudioTech', stockLevel: 65, reorderLevel: 20, unitCost: 60, retailPrice: 100 },
            { id: 6, productName: 'LED Monitor', sku: 'LM-006', category: 'Electronics', supplier: 'TechCorp', stockLevel: 30, reorderLevel: 8, unitCost: 200, retailPrice: 350 },
            { id: 7, productName: 'Executive Chair', sku: 'EC-007', category: 'Furniture', supplier: 'FurnishCo', stockLevel: 22, reorderLevel: 7, unitCost: 180, retailPrice: 300 },
            { id: 8, productName: 'Blender Pro', sku: 'BP-008', category: 'Appliances', supplier: 'HomeGoods', stockLevel: 40, reorderLevel: 15, unitCost: 45, retailPrice: 80 },
            { id: 9, productName: 'Tablet Mini', sku: 'TM-009', category: 'Electronics', supplier: 'TechCorp', stockLevel: 35, reorderLevel: 10, unitCost: 350, retailPrice: 600 },
            { id: 10, productName: 'Bookshelf Large', sku: 'BL-010', category: 'Furniture', supplier: 'FurnishCo', stockLevel: 15, reorderLevel: 5, unitCost: 90, retailPrice: 150 }
        ]
    }
};

// Handle file upload
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const fileName = file.name;
    const fileExtension = fileName.split('.').pop().toLowerCase();

    const reader = new FileReader();

    reader.onload = function(e) {
        const fileContent = e.target.result;
        let parsedData;

        try {
            switch (fileExtension) {
                case 'csv':
                    parsedData = parseCSV(fileContent);
                    break;
                case 'json':
                    parsedData = JSON.parse(fileContent);
                    break;
                case 'xlsx':
                    // For Excel files, we would need a library like SheetJS
                    showNotification('Excel file support requires additional libraries. Please use CSV or JSON.', 'warning');
                    return;
                default:
                    showNotification('Unsupported file format. Please use CSV or JSON.', 'error');
                    return;
            }

            // Set the data source
            setDataSource({
                type: 'file',
                name: fileName,
                data: parsedData
            });

            // Show preview
            showDataPreview(parsedData);

        } catch (error) {
            console.error('Error parsing file:', error);
            showNotification('Error parsing file. Please check the file format.', 'error');
        }
    };

    reader.onerror = function() {
        showNotification('Error reading file.', 'error');
    };

    if (fileExtension === 'csv' || fileExtension === 'json') {
        reader.readAsText(file);
    } else if (fileExtension === 'xlsx') {
        reader.readAsArrayBuffer(file);
    }
}

// Parse CSV data
function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());

    const data = [];

    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;

        const values = lines[i].split(',').map(value => value.trim());
        const row = {};

        headers.forEach((header, index) => {
            let value = values[index] || '';

            // Try to convert to number if possible
            if (!isNaN(value) && value !== '') {
                value = parseFloat(value);
            }

            row[header] = value;
        });

        data.push(row);
    }

    return data;
}

// Load sample data
function loadSampleData(sampleType) {
    console.log(`Loading sample data: ${sampleType}`);
    const sampleData = sampleDataSets[sampleType];

    if (sampleData) {
        // Set the data source
        setDataSource({
            type: 'sample',
            name: sampleData.name,
            description: sampleData.description,
            data: sampleData.data
        });

        // Show preview
        showDataPreview(sampleData.data);

        // Show success notification
        showNotification(`Sample data "${sampleData.name}" loaded successfully.`, 'success');

        // Pre-select some fields for convenience
        if (appState.dataFields && appState.dataFields.length > 0 && appState.selectedFields.length === 0) {
            // Select the first 3-5 fields by default
            const fieldsToSelect = Math.min(appState.dataFields.length, 5);
            for (let i = 0; i < fieldsToSelect; i++) {
                appState.selectedFields.push(appState.dataFields[i]);
            }
            console.log(`Pre-selected ${fieldsToSelect} fields:`, appState.selectedFields);
        }
    } else {
        showNotification('Sample data not found.', 'error');
    }
}

// Process pasted data
function processPastedData(pastedText) {
    if (!pastedText.trim()) {
        showNotification('Please paste some data.', 'error');
        return;
    }

    let parsedData;

    // Try to parse as JSON first
    try {
        parsedData = JSON.parse(pastedText);

        // Set the data source
        setDataSource({
            type: 'paste',
            name: 'Pasted Data',
            data: parsedData
        });

        // Show preview
        showDataPreview(parsedData);
        return;
    } catch (e) {
        // Not valid JSON, try CSV
        try {
            parsedData = parseCSV(pastedText);

            // Set the data source
            setDataSource({
                type: 'paste',
                name: 'Pasted Data',
                data: parsedData
            });

            // Show preview
            showDataPreview(parsedData);
            return;
        } catch (e) {
            showNotification('Could not parse the pasted data. Please check the format.', 'error');
        }
    }
}

// Set the data source in the application state
function setDataSource(dataSource) {
    console.log('Setting data source:', dataSource.name);

    appState.dataSource = dataSource;

    // Reset selected fields when changing data source
    appState.selectedFields = [];

    // Extract fields from the data
    if (dataSource.data && dataSource.data.length > 0) {
        const firstRow = dataSource.data[0];
        appState.dataFields = Object.keys(firstRow).map(field => {
            const fieldType = detectFieldType(firstRow[field]);
            return {
                name: field,
                type: fieldType,
                label: formatFieldLabel(field)
            };
        });

        // Sort fields by name for better usability
        appState.dataFields.sort((a, b) => a.name.localeCompare(b.name));
    }

    console.log('Data source set:', dataSource.name);
    console.log('Fields detected:', appState.dataFields.length);
    console.log('Field details:', appState.dataFields);

    // Reset other state properties that depend on the data source
    appState.filters = [];
    appState.groupings = [];
    appState.aggregations = [];
    appState.sortFields = [];
}

// Detect the type of a field based on its value
function detectFieldType(value) {
    if (typeof value === 'number') {
        return 'number';
    } else if (typeof value === 'boolean') {
        return 'boolean';
    } else if (typeof value === 'string') {
        // Check if it's a date
        const datePattern = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/;
        if (datePattern.test(value) || !isNaN(Date.parse(value))) {
            return 'date';
        }
        return 'string';
    } else {
        return 'string';
    }
}

// Format a field name into a readable label
function formatFieldLabel(fieldName) {
    // Convert camelCase or snake_case to Title Case with spaces
    return fieldName
        .replace(/([A-Z])/g, ' $1') // Insert space before capital letters
        .replace(/_/g, ' ') // Replace underscores with spaces
        .replace(/^\w/, c => c.toUpperCase()) // Capitalize first letter
        .trim();
}

// Show data preview
function showDataPreview(data) {
    if (!data || data.length === 0) {
        showNotification('No data to preview.', 'warning');
        return;
    }

    const previewTable = elements.dataPreviewTable;
    const dataPreview = elements.dataSourcePreview;

    // Clear the table
    previewTable.innerHTML = '';

    // Create the table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const fields = Object.keys(data[0]);
    fields.forEach(field => {
        const th = document.createElement('th');
        th.textContent = formatFieldLabel(field);
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    previewTable.appendChild(thead);

    // Create the table body
    const tbody = document.createElement('tbody');

    // Show up to 10 rows for preview
    const rowsToShow = Math.min(data.length, 10);

    for (let i = 0; i < rowsToShow; i++) {
        const row = document.createElement('tr');

        fields.forEach(field => {
            const td = document.createElement('td');
            td.textContent = data[i][field];
            row.appendChild(td);
        });

        tbody.appendChild(row);
    }

    previewTable.appendChild(tbody);

    // Show the preview
    dataPreview.classList.remove('hidden');
}
