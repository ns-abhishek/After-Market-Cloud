/**
 * Table Manager - Manages invoice table instances
 * Provides a centralized way to create and manage table components
 */

// Global table instances storage
window.tableInstances = {};

/**
 * Create an invoice table with standardized configuration
 * @param {string} containerId - The container element ID
 * @param {object} config - Table configuration object
 * @returns {InvoiceTable} - The created table instance
 */
function createInvoiceTable(containerId, config) {
    // Ensure the container exists
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID '${containerId}' not found`);
        return null;
    }

    // Create the table instance
    const table = new InvoiceTable(containerId, config);
    
    // Store the instance globally for access
    window.tableInstances[containerId] = table;
    window[`invoiceTable_${containerId}`] = table;
    
    return table;
}

/**
 * Get a table instance by container ID
 * @param {string} containerId - The container element ID
 * @returns {InvoiceTable|null} - The table instance or null if not found
 */
function getTableInstance(containerId) {
    return window.tableInstances[containerId] || null;
}

/**
 * Destroy a table instance
 * @param {string} containerId - The container element ID
 */
function destroyTable(containerId) {
    const table = window.tableInstances[containerId];
    if (table && typeof table.destroy === 'function') {
        table.destroy();
    }
    
    delete window.tableInstances[containerId];
    delete window[`invoiceTable_${containerId}`];
}

/**
 * Refresh all table instances
 */
function refreshAllTables() {
    Object.values(window.tableInstances).forEach(table => {
        if (table && typeof table.refresh === 'function') {
            table.refresh();
        }
    });
}

/**
 * Export all tables data
 * @param {string} format - Export format ('pdf' or 'excel')
 */
function exportAllTablesData(format) {
    const allData = [];
    
    Object.entries(window.tableInstances).forEach(([containerId, table]) => {
        if (table && table.config && table.config.data) {
            allData.push({
                title: table.config.title || containerId,
                data: table.config.data,
                columns: table.config.columns
            });
        }
    });
    
    if (allData.length === 0) {
        showToast('No table data to export', 'warning');
        return;
    }
    
    if (format === 'pdf') {
        exportAllTablesToPDF(allData);
    } else if (format === 'excel') {
        exportAllTablesToExcel(allData);
    }
}

/**
 * Export all tables to PDF
 * @param {Array} tablesData - Array of table data objects
 */
function exportAllTablesToPDF(tablesData) {
    const printWindow = window.open('', '_blank');
    let htmlContent = `
        <html>
            <head>
                <title>All Invoice Data Export</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        margin: 20px; 
                        color: #000000; 
                        font-size: 12px;
                    }
                    h1 { 
                        text-align: center; 
                        border: 3px solid #000000; 
                        padding: 1rem; 
                        background-color: #000000; 
                        color: #ffffff; 
                        margin-bottom: 2rem;
                    }
                    h2 {
                        border: 2px solid #000000;
                        padding: 0.5rem;
                        background-color: #000000;
                        color: #ffffff;
                        margin: 2rem 0 1rem 0;
                    }
                    .table { 
                        border: 2px solid #000000; 
                        margin-bottom: 2rem;
                        width: 100%;
                    }
                    .table th { 
                        background-color: #000000 !important; 
                        color: #ffffff !important; 
                        border: 1px solid #000000 !important;
                        padding: 8px !important;
                        font-weight: bold;
                        font-size: 10px;
                    }
                    .table td { 
                        border: 1px solid #000000 !important; 
                        padding: 6px !important;
                        color: #000000;
                        font-size: 10px;
                    }
                    @media print { 
                        body { margin: 0; font-size: 10px; } 
                        .table { break-inside: avoid; }
                        h1, h2 { break-after: avoid; }
                    }
                    .print-footer {
                        margin-top: 2rem; 
                        text-align: center; 
                        border-top: 2px solid #000000; 
                        padding-top: 1rem;
                        font-size: 10px;
                    }
                </style>
            </head>
            <body>
                <h1>Complete Invoice Management System Export</h1>
    `;
    
    tablesData.forEach(tableData => {
        htmlContent += `<h2>${tableData.title}</h2>`;
        htmlContent += '<table class="table">';
        
        // Add headers
        htmlContent += '<thead><tr>';
        tableData.columns.forEach(col => {
            htmlContent += `<th>${col.label}</th>`;
        });
        htmlContent += '</tr></thead>';
        
        // Add data rows
        htmlContent += '<tbody>';
        tableData.data.forEach(row => {
            htmlContent += '<tr>';
            tableData.columns.forEach(col => {
                let value = row[col.key] || '';
                // Remove HTML tags for PDF export
                value = value.toString().replace(/<[^>]*>/g, '');
                htmlContent += `<td>${value}</td>`;
            });
            htmlContent += '</tr>';
        });
        htmlContent += '</tbody></table>';
    });
    
    htmlContent += `
                <div class="print-footer">
                    <small>Generated on ${new Date().toLocaleString()}</small>
                </div>
            </body>
        </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    setTimeout(() => {
        printWindow.print();
        showToast('PDF export initiated', 'success');
    }, 500);
}

/**
 * Export all tables to Excel
 * @param {Array} tablesData - Array of table data objects
 */
function exportAllTablesToExcel(tablesData) {
    let csvContent = `Complete Invoice Management System Export\nGenerated on: ${new Date().toLocaleString()}\n\n`;
    
    tablesData.forEach(tableData => {
        csvContent += `${tableData.title}\n`;
        
        // Add headers
        const headers = tableData.columns.map(col => col.label);
        csvContent += headers.map(h => `"${h}"`).join(',') + '\n';
        
        // Add data rows
        tableData.data.forEach(row => {
            const values = tableData.columns.map(col => {
                let value = row[col.key] || '';
                // Remove HTML tags for Excel export
                value = value.toString().replace(/<[^>]*>/g, '');
                return `"${value}"`;
            });
            csvContent += values.join(',') + '\n';
        });
        
        csvContent += '\n';
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Complete_Invoice_Export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('Excel export completed', 'success');
}

/**
 * Initialize table manager
 */
function initializeTableManager() {
    // Set up global event listeners for table management
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Table Manager initialized');
    });
}

// Initialize when script loads
initializeTableManager();
