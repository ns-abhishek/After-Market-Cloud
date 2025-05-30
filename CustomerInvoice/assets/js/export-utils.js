// Export Utilities for Invoice Management System

// Export table data to PDF or Excel
function exportTableData(format, tableId = 'customerInvoiceTable') {
    const table = document.getElementById(tableId);
    if (!table) {
        showToast('Table not found', 'error');
        return;
    }

    const data = extractTableData(table);

    if (format === 'pdf') {
        exportToPDF(data, getTableTitle(tableId));
    } else if (format === 'excel') {
        exportToExcel(data, getTableTitle(tableId));
    }
}

// Extract data from table
function extractTableData(table) {
    const headers = [];
    const rows = [];

    // Extract headers
    const headerRow = table.querySelector('thead tr');
    if (headerRow) {
        const headerCells = headerRow.querySelectorAll('th');
        headerCells.forEach(cell => {
            const label = cell.querySelector('.mdc-data-table__header-cell-label');
            if (label) {
                headers.push(label.textContent.trim());
            } else {
                headers.push(cell.textContent.trim());
            }
        });
    }

    // Extract data rows
    const dataRows = table.querySelectorAll('tbody tr');
    dataRows.forEach(row => {
        if (row.style.display !== 'none') { // Only include visible rows
            const rowData = [];
            const cells = row.querySelectorAll('td');
            cells.forEach((cell, index) => {
                // Skip action columns (buttons)
                if (!cell.querySelector('button') && !cell.querySelector('.btn')) {
                    rowData.push(cell.textContent.trim());
                } else if (index === 0) {
                    // For view column, just add "View"
                    rowData.push('View');
                }
            });
            if (rowData.length > 0) {
                rows.push(rowData);
            }
        }
    });

    return { headers, rows };
}

// Get table title based on table ID
function getTableTitle(tableId) {
    const titles = {
        'customerInvoiceTable': 'Customer Invoice Report',
        'serviceReturnTable': 'Service Return Report',
        'internalInvoiceTable': 'Internal Invoice Report',
        'internalReturnTable': 'Internal Return Report'
    };
    return titles[tableId] || 'Invoice Report';
}

// Export to PDF using jsPDF
function exportToPDF(data, title) {
    // Check if jsPDF is available
    if (typeof window.jsPDF === 'undefined') {
        // Load jsPDF dynamically
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', () => {
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js', () => {
                generatePDF(data, title);
            });
        });
    } else {
        generatePDF(data, title);
    }
}

// Fallback PDF generation using browser print
function generatePDFfallback(data, title) {
    const printWindow = window.open('', '_blank');
    const tableHTML = generateTableHTML(data, title);

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${title}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { color: #333; text-align: center; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; font-weight: bold; }
                tr:nth-child(even) { background-color: #f9f9f9; }
                .meta { text-align: center; color: #666; margin-bottom: 20px; }
                @media print {
                    body { margin: 0; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <h1>${title}</h1>
            <div class="meta">Generated on: ${new Date().toLocaleDateString()}</div>
            ${tableHTML}
            <div class="no-print" style="margin-top: 20px; text-align: center;">
                <button onclick="window.print()">Print PDF</button>
                <button onclick="window.close()">Close</button>
            </div>
        </body>
        </html>
    `);

    printWindow.document.close();

    // Auto-print after a short delay
    setTimeout(() => {
        printWindow.print();
    }, 500);

    showToast('PDF export opened in new window', 'success');
}

function generateTableHTML(data, title) {
    let html = '<table>';

    // Add headers
    if (data.headers && data.headers.length > 0) {
        html += '<thead><tr>';
        data.headers.forEach(header => {
            html += `<th>${header}</th>`;
        });
        html += '</tr></thead>';
    }

    // Add rows
    if (data.rows && data.rows.length > 0) {
        html += '<tbody>';
        data.rows.forEach(row => {
            html += '<tr>';
            row.forEach(cell => {
                html += `<td>${cell}</td>`;
            });
            html += '</tr>';
        });
        html += '</tbody>';
    }

    html += '</table>';
    return html;
}

// Generate PDF document
function generatePDF(data, title) {
    try {
        const { jsPDF } = window.jsPDF;
        const doc = new jsPDF('l', 'mm', 'a4'); // Landscape orientation

        // Add title
        doc.setFontSize(16);
        doc.text(title, 14, 22);

        // Add generation date
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

        // Add table
        if (typeof doc.autoTable === 'function') {
            doc.autoTable({
                head: [data.headers],
                body: data.rows,
                startY: 35,
                styles: {
                    fontSize: 8,
                    cellPadding: 2
                },
                headStyles: {
                    fillColor: [0, 0, 0],
                    textColor: [255, 255, 255],
                    fontStyle: 'bold'
                },
                alternateRowStyles: {
                    fillColor: [245, 245, 245]
                },
                margin: { top: 35, right: 14, bottom: 20, left: 14 }
            });
        } else {
            // Fallback: add simple text table
            let yPosition = 40;
            data.headers.forEach((header, index) => {
                doc.text(header, 14 + (index * 40), yPosition);
            });
            yPosition += 10;

            data.rows.forEach(row => {
                row.forEach((cell, index) => {
                    doc.text(String(cell), 14 + (index * 40), yPosition);
                });
                yPosition += 8;
            });
        }

        // Save the PDF
        const filename = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(filename);

        showToast('PDF exported successfully', 'success');
    } catch (error) {
        console.error('PDF generation failed:', error);
        // Fallback to print-based PDF
        generatePDFfallback(data, title);
    }
}

// Export to Excel using SheetJS
function exportToExcel(data, title) {
    // Check if SheetJS is available
    if (typeof XLSX === 'undefined') {
        // Load SheetJS dynamically
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js', () => {
            generateExcel(data, title);
        });
    } else {
        generateExcel(data, title);
    }
}

// Generate Excel file
function generateExcel(data, title) {
    try {
        // Create workbook
        const wb = XLSX.utils.book_new();

        // Create worksheet data
        const wsData = [data.headers, ...data.rows];

        // Create worksheet
        const ws = XLSX.utils.aoa_to_sheet(wsData);

        // Set column widths
        const colWidths = data.headers.map(() => ({ wch: 15 }));
        ws['!cols'] = colWidths;

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Data');

        // Save the file
        const filename = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, filename);

        showToast('Excel file exported successfully', 'success');
    } catch (error) {
        console.error('Excel generation failed:', error);
        // Fallback to CSV export
        generateCSVfallback(data, title);
    }
}

// Fallback CSV generation
function generateCSVfallback(data, title) {
    try {
        let csvContent = '';

        // Add headers
        csvContent += data.headers.join(',') + '\n';

        // Add rows
        data.rows.forEach(row => {
            const escapedRow = row.map(cell => {
                // Escape quotes and wrap in quotes if contains comma
                const cellStr = String(cell);
                if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
                    return '"' + cellStr.replace(/"/g, '""') + '"';
                }
                return cellStr;
            });
            csvContent += escapedRow.join(',') + '\n';
        });

        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showToast('Data exported as CSV file', 'success');
    } catch (error) {
        console.error('CSV generation failed:', error);
        showToast('Export failed. Please try again.', 'error');
    }
}

// Load external script dynamically
function loadScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.onload = callback;
    script.onerror = () => {
        showToast('Failed to load export library', 'error');
    };
    document.head.appendChild(script);
}













// Initialize export utilities
document.addEventListener('DOMContentLoaded', function() {
    // Set up any initial export configurations
    console.log('Export utilities initialized');
});
