/**
 * Analytics Filters Module
 * Handles date range selection, export functionality, and activity filtering
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize date range functionality
    initDateRangeFilter();

    // Initialize export functionality
    initExportOptions();

    // Initialize activity filtering
    initActivityFilters();

    // Initialize table sorting
    initTableSorting();

    // Initialize pagination
    initPagination();
});

/**
 * Initialize date range filter functionality
 */
function initDateRangeFilter() {
    const dateRangeSelect = document.getElementById('date-range-preset');
    const customDateContainer = document.getElementById('custom-date-container');
    const dateFromInput = document.getElementById('date-from');
    const dateToInput = document.getElementById('date-to');
    const applyDateRangeBtn = document.getElementById('apply-date-range');

    if (!dateRangeSelect || !customDateContainer) return;

    // Set default dates
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    dateFromInput.valueAsDate = thirtyDaysAgo;
    dateToInput.valueAsDate = today;

    // Show/hide custom date range based on selection
    dateRangeSelect.addEventListener('change', function() {
        if (this.value === 'custom') {
            customDateContainer.style.display = 'flex';
        } else {
            customDateContainer.style.display = 'none';
            updateDateRange(this.value);
        }
    });

    // Apply custom date range
    applyDateRangeBtn.addEventListener('click', function() {
        const fromDate = dateFromInput.valueAsDate;
        const toDate = dateToInput.valueAsDate;

        if (!fromDate || !toDate) {
            showNotification('Please select valid dates', 'error');
            return;
        }

        if (fromDate > toDate) {
            showNotification('Start date cannot be after end date', 'error');
            return;
        }

        updateChartsWithDateRange(fromDate, toDate);
        showNotification('Date range applied successfully', 'success');
    });
}

/**
 * Update date range based on preset selection
 * @param {string} preset - The selected preset (7, 30, 90, 365)
 */
function updateDateRange(preset) {
    const days = parseInt(preset, 10);
    if (isNaN(days)) return;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    updateChartsWithDateRange(startDate, endDate);
    showNotification(`Date range updated to last ${days} days`, 'success');
}

/**
 * Update charts with the selected date range
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 */
function updateChartsWithDateRange(startDate, endDate) {
    // Format dates for display
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    // Update date range display if it exists
    const dateRangeDisplay = document.querySelector('.date-range-display');
    if (dateRangeDisplay) {
        dateRangeDisplay.textContent = `${formattedStartDate} - ${formattedEndDate}`;
    }

    // Trigger chart updates with new date range
    if (window.updateChartsData) {
        window.updateChartsData(startDate, endDate);
    }

    // Update activity table with new date range
    filterActivityTable();
}

/**
 * Format date as YYYY-MM-DD
 * @param {Date} date - Date to format
 * @returns {string} Formatted date
 */
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Initialize export functionality
 */
function initExportOptions() {
    // PDF Export
    const exportPdfBtn = document.getElementById('export-pdf');
    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', function() {
            exportAnalytics('pdf');
        });
    }

    // Excel Export
    const exportExcelBtn = document.getElementById('export-excel');
    if (exportExcelBtn) {
        exportExcelBtn.addEventListener('click', function() {
            exportAnalytics('excel');
        });
    }

    // CSV Export
    const exportCsvBtn = document.getElementById('export-csv');
    if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', function() {
            exportAnalytics('csv');
        });
    }

    // Activity-specific exports
    const exportActivityPdfBtn = document.getElementById('export-activity-pdf');
    if (exportActivityPdfBtn) {
        exportActivityPdfBtn.addEventListener('click', function() {
            exportActivityData('pdf');
        });
    }

    const exportActivityExcelBtn = document.getElementById('export-activity-excel');
    if (exportActivityExcelBtn) {
        exportActivityExcelBtn.addEventListener('click', function() {
            exportActivityData('excel');
        });
    }

    const exportActivityCsvBtn = document.getElementById('export-activity-csv');
    if (exportActivityCsvBtn) {
        exportActivityCsvBtn.addEventListener('click', function() {
            exportActivityData('csv');
        });
    }

    // Print activity
    const printActivityBtn = document.getElementById('print-activity');
    if (printActivityBtn) {
        printActivityBtn.addEventListener('click', function() {
            printActivityTable();
        });
    }
}

/**
 * Export analytics data
 * @param {string} format - Export format (pdf, excel, csv)
 */
function exportAnalytics(format) {
    // Get export options
    const includeCharts = document.getElementById('export-charts')?.checked ?? true;
    const includeTables = document.getElementById('export-tables')?.checked ?? true;
    const includeSummary = document.getElementById('export-summary')?.checked ?? true;

    // Show loading indicator
    showLoadingOverlay('Preparing export...');

    // Generate filename with current date
    const date = new Date();
    const formattedDate = formatDate(date);
    const filename = `analytics_report_${formattedDate}.${format}`;

    // Create export data
    let exportData;

    // For CSV and Excel, create a data structure
    if (format === 'csv' || format === 'excel') {
        exportData = generateExportData();
    }

    // For PDF, capture the current view
    if (format === 'pdf') {
        // In a real implementation, this would use a library like html2pdf.js
        // For this demo, we'll simulate the PDF creation
    }

    // Simulate processing time
    setTimeout(() => {
        hideLoadingOverlay();

        // Trigger download based on format
        if (format === 'csv') {
            downloadCSV(exportData, filename);
        } else if (format === 'excel') {
            downloadExcel(exportData, filename);
        } else if (format === 'pdf') {
            downloadPDF(filename);
        }

        // Show success message
        showNotification(`Analytics exported as ${format.toUpperCase()} successfully`, 'success');
    }, 1500);
}

/**
 * Generate export data from charts and tables
 * @returns {Object} Data structure for export
 */
function generateExportData() {
    // Get data from charts
    const data = {
        ticketVolume: window.ticketVolumeChart ? extractChartData(window.ticketVolumeChart) : null,
        resolutionTime: window.resolutionTimeChart ? extractChartData(window.resolutionTimeChart) : null,
        documentActivity: window.documentActivityChart ? extractChartData(window.documentActivityChart) : null,
        userActivity: window.userActivityChart ? extractChartData(window.userActivityChart) : null
    };

    // Add summary data
    data.summary = {
        exportDate: new Date().toISOString(),
        dateRange: document.querySelector('.date-range-display')?.textContent || 'All time',
        totalTickets: '65',
        avgResolutionTime: '8.2 hours',
        documentUploads: '24',
        activeUsers: '18'
    };

    return data;
}

/**
 * Extract data from a chart object
 * @param {Object} chart - Chart.js chart object
 * @returns {Object} Extracted data
 */
function extractChartData(chart) {
    if (!chart || !chart.data) return null;

    return {
        labels: chart.data.labels,
        datasets: chart.data.datasets.map(dataset => ({
            label: dataset.label,
            data: dataset.data
        }))
    };
}

/**
 * Download data as CSV
 * @param {Object} data - Data to export
 * @param {string} filename - File name
 */
function downloadCSV(data, filename) {
    // Convert data to CSV format
    let csvContent = 'data:text/csv;charset=utf-8,';

    // Add summary section
    csvContent += 'SUMMARY\r\n';
    for (const [key, value] of Object.entries(data.summary)) {
        csvContent += `${key},${value}\r\n`;
    }
    csvContent += '\r\n';

    // Add chart data sections
    for (const [chartName, chartData] of Object.entries(data)) {
        if (chartName === 'summary' || !chartData) continue;

        // Add section header
        csvContent += `${chartName.toUpperCase()}\r\n`;

        // Add labels row
        csvContent += `,${chartData.labels.join(',')}\r\n`;

        // Add dataset rows
        chartData.datasets.forEach(dataset => {
            csvContent += `${dataset.label},${dataset.data.join(',')}\r\n`;
        });

        csvContent += '\r\n';
    }

    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);

    // Trigger download
    link.click();

    // Clean up
    document.body.removeChild(link);
}

/**
 * Download data as Excel
 * @param {Object} data - Data to export
 * @param {string} filename - File name
 */
function downloadExcel(data, filename) {
    // In a real implementation, this would use a library like SheetJS
    // For this demo, we'll create a CSV and change the extension
    downloadCSV(data, filename);
}

/**
 * Download page as PDF
 * @param {string} filename - File name
 */
function downloadPDF(filename) {
    // In a real implementation, this would use a library like html2pdf.js
    // For this demo, we'll show a message explaining what would happen

    const message = `
        In a production environment, this would:
        1. Capture the current analytics view
        2. Convert it to a PDF document
        3. Download it as ${filename}

        This requires a PDF generation library like html2pdf.js or jsPDF.
    `;

    console.log(message);
}

/**
 * Export activity data
 * @param {string} format - Export format (pdf, excel, csv)
 */
function exportActivityData(format) {
    // Show loading indicator
    showLoadingOverlay('Preparing activity export...');

    // Get current filtered data
    const activityTable = document.getElementById('activity-table');
    const rows = activityTable.querySelectorAll('tbody tr:not([style*="display: none"])');

    // Generate filename with current date
    const date = new Date();
    const formattedDate = formatDate(date);
    const filename = `activity_report_${formattedDate}.${format}`;

    // Extract data from table
    const activityData = extractTableData(activityTable, rows);

    // Simulate processing time
    setTimeout(() => {
        hideLoadingOverlay();

        // Trigger download based on format
        if (format === 'csv') {
            downloadActivityCSV(activityData, filename);
        } else if (format === 'excel') {
            downloadActivityExcel(activityData, filename);
        } else if (format === 'pdf') {
            downloadActivityPDF(activityData, filename);
        }

        // Show success message
        showNotification(`Activity data exported as ${format.toUpperCase()} successfully`, 'success');
    }, 1000);
}

/**
 * Extract data from activity table
 * @param {HTMLElement} table - Table element
 * @param {NodeList} rows - Table rows
 * @returns {Object} Extracted data
 */
function extractTableData(table, rows) {
    // Get headers
    const headers = Array.from(table.querySelectorAll('thead th')).map(th =>
        th.textContent.trim().replace(/\s*\u25B2\s*|\s*\u25BC\s*/, '').replace(/\s+/g, '_').toLowerCase()
    );

    // Get data from rows
    const data = Array.from(rows).map(row => {
        const rowData = {};
        const cells = row.querySelectorAll('td');

        headers.forEach((header, index) => {
            if (index < cells.length) {
                rowData[header] = cells[index].textContent.trim();
            }
        });

        // Add metadata
        rowData.type = row.dataset.type || '';
        rowData.user = row.dataset.user || '';
        rowData.date = row.dataset.date || '';

        return rowData;
    });

    return {
        headers,
        data,
        summary: {
            exportDate: new Date().toISOString(),
            totalRecords: data.length,
            filteredFrom: table.querySelectorAll('tbody tr').length
        }
    };
}

/**
 * Download activity data as CSV
 * @param {Object} data - Activity data
 * @param {string} filename - File name
 */
function downloadActivityCSV(data, filename) {
    // Convert data to CSV format
    let csvContent = 'data:text/csv;charset=utf-8,';

    // Add summary section
    csvContent += 'SUMMARY\r\n';
    for (const [key, value] of Object.entries(data.summary)) {
        csvContent += `${key},${value}\r\n`;
    }
    csvContent += '\r\n';

    // Add headers
    csvContent += data.headers.join(',') + '\r\n';

    // Add data rows
    data.data.forEach(row => {
        const rowValues = data.headers.map(header => {
            // Escape commas and quotes
            const value = row[header] || '';
            if (value.includes(',') || value.includes('"')) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        });
        csvContent += rowValues.join(',') + '\r\n';
    });

    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);

    // Trigger download
    link.click();

    // Clean up
    document.body.removeChild(link);
}

/**
 * Download activity data as Excel
 * @param {Object} data - Activity data
 * @param {string} filename - File name
 */
function downloadActivityExcel(data, filename) {
    // In a real implementation, this would use a library like SheetJS
    // For this demo, we'll create a CSV and change the extension
    downloadActivityCSV(data, filename);
}

/**
 * Download activity data as PDF
 * @param {Object} data - Activity data
 * @param {string} filename - File name
 */
function downloadActivityPDF(data, filename) {
    // In a real implementation, this would use a library like html2pdf.js
    // For this demo, we'll show a message explaining what would happen

    const message = `
        In a production environment, this would:
        1. Format the activity data as a PDF table
        2. Add headers, footers, and styling
        3. Download it as ${filename}

        This requires a PDF generation library like html2pdf.js or jsPDF.
    `;

    console.log(message);

    // Create a simple HTML representation for demonstration
    const tableHtml = `
        <h2>Activity Report</h2>
        <p>Export Date: ${new Date().toLocaleString()}</p>
        <p>Total Records: ${data.data.length}</p>
        <table border="1" cellpadding="5" cellspacing="0">
            <thead>
                <tr>${data.headers.map(h => `<th>${h}</th>`).join('')}</tr>
            </thead>
            <tbody>
                ${data.data.map(row => `
                    <tr>${data.headers.map(h => `<td>${row[h] || ''}</td>`).join('')}</tr>
                `).join('')}
            </tbody>
        </table>
    `;

    // Log the HTML that would be converted to PDF
    console.log('HTML that would be converted to PDF:', tableHtml);
}

/**
 * Print activity table
 */
function printActivityTable() {
    // In a real implementation, this would open a print dialog
    // with a formatted version of the activity table
    window.print();
}

/**
 * Initialize activity filtering functionality
 */
function initActivityFilters() {
    // Toggle filter dropdown
    const filterBtn = document.getElementById('activity-filter-btn');
    const filterDropdown = document.getElementById('activity-filter-dropdown');

    if (filterBtn && filterDropdown) {
        filterBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            filterDropdown.style.display = filterDropdown.style.display === 'block' ? 'none' : 'block';
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!filterDropdown.contains(e.target) && e.target !== filterBtn) {
                filterDropdown.style.display = 'none';
            }
        });
    }

    // Apply filters button
    const applyFiltersBtn = document.getElementById('apply-filters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            filterActivityTable();
            if (filterDropdown) {
                filterDropdown.style.display = 'none';
            }
        });
    }

    // Reset filters button
    const resetFiltersBtn = document.getElementById('reset-filters');
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            resetActivityFilters();
        });

    // Type filter checkboxes
    const typeFilters = document.querySelectorAll('.activity-type-filter');
    if (typeFilters.length > 0) {
        const allTypeFilter = document.querySelector('.activity-type-filter[value="all"]');

        // Handle "All" checkbox
        if (allTypeFilter) {
            allTypeFilter.addEventListener('change', function() {
                typeFilters.forEach(filter => {
                    if (filter !== allTypeFilter) {
                        filter.checked = false;
                        filter.disabled = this.checked;
                    }
                });
            });
        }

        // Handle individual type checkboxes
        typeFilters.forEach(filter => {
            if (filter.value !== 'all') {
                filter.addEventListener('change', function() {
                    if (this.checked && allTypeFilter) {
                        allTypeFilter.checked = false;
                    }

                    // If no individual filters are checked, check "All"
                    const anyChecked = Array.from(typeFilters).some(f => f.value !== 'all' && f.checked);
                    if (!anyChecked && allTypeFilter) {
                        allTypeFilter.checked = true;
                    }
                });
            }
        });
    }

    // User filter checkboxes
    const userFilters = document.querySelectorAll('.activity-user-filter');
    if (userFilters.length > 0) {
        const allUserFilter = document.querySelector('.activity-user-filter[value="all"]');

        // Handle "All" checkbox
        if (allUserFilter) {
            allUserFilter.addEventListener('change', function() {
                userFilters.forEach(filter => {
                    if (filter !== allUserFilter) {
                        filter.checked = false;
                        filter.disabled = this.checked;
                    }
                });
            });
        }

        // Handle individual user checkboxes
        userFilters.forEach(filter => {
            if (filter.value !== 'all') {
                filter.addEventListener('change', function() {
                    if (this.checked && allUserFilter) {
                        allUserFilter.checked = false;
                    }

                    // If no individual filters are checked, check "All"
                    const anyChecked = Array.from(userFilters).some(f => f.value !== 'all' && f.checked);
                    if (!anyChecked && allUserFilter) {
                        allUserFilter.checked = true;
                    }
                });
            }
        });
    }
}

/**
 * Filter activity table based on selected filters
 */
function filterActivityTable() {
    const activityTable = document.getElementById('activity-table');
    const noResults = document.querySelector('.no-results');
    const rows = activityTable.querySelectorAll('tbody tr');
    const searchInput = document.getElementById('activity-search');

    if (!activityTable || !rows.length) return;

    // Get search term
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';

    // Get selected type filters
    const typeFilters = document.querySelectorAll('.activity-type-filter:checked');
    const selectedTypes = Array.from(typeFilters).map(filter => filter.value);
    const filterAllTypes = selectedTypes.includes('all');

    // Get selected user filters
    const userFilters = document.querySelectorAll('.activity-user-filter:checked');
    const selectedUsers = Array.from(userFilters).map(filter => filter.value);
    const filterAllUsers = selectedUsers.includes('all');

    // Get selected time period
    const timePeriod = document.querySelector('input[name="activity-time"]:checked')?.value || 'all';

    // Filter rows
    let visibleCount = 0;

    rows.forEach(row => {
        // Get row data
        const type = row.dataset.type;
        const user = row.dataset.user;
        const date = row.dataset.date;
        const text = row.textContent.toLowerCase();

        // Check if row matches filters
        const matchesType = filterAllTypes || selectedTypes.includes(type);
        const matchesUser = filterAllUsers || selectedUsers.includes(user);
        const matchesTime = matchesTimePeriod(date, timePeriod);
        const matchesSearch = !searchTerm || text.includes(searchTerm);

        // Show/hide row
        if (matchesType && matchesUser && matchesTime && matchesSearch) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });

    // Update pagination info
    updatePaginationInfo(visibleCount);

    // Show/hide no results message
    if (noResults) {
        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }
}

/**
 * Check if a date matches the selected time period
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @param {string} timePeriod - Selected time period (all, today, week, month)
 * @returns {boolean} Whether the date matches the time period
 */
function matchesTimePeriod(dateStr, timePeriod) {
    if (timePeriod === 'all') return true;

    const today = new Date();
    const date = new Date(dateStr);

    if (timePeriod === 'today') {
        return date.toDateString() === today.toDateString();
    }

    if (timePeriod === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 7);
        return date >= weekAgo;
    }

    if (timePeriod === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(today.getMonth() - 1);
        return date >= monthAgo;
    }

    return true;
}

/**
 * Reset activity filters to default state
 */
function resetActivityFilters() {
    // Reset type filters
    const allTypeFilter = document.querySelector('.activity-type-filter[value="all"]');
    if (allTypeFilter) {
        allTypeFilter.checked = true;
    }

    document.querySelectorAll('.activity-type-filter:not([value="all"])').forEach(filter => {
        filter.checked = false;
        filter.disabled = true;
    });

    // Reset user filters
    const allUserFilter = document.querySelector('.activity-user-filter[value="all"]');
    if (allUserFilter) {
        allUserFilter.checked = true;
    }

    document.querySelectorAll('.activity-user-filter:not([value="all"])').forEach(filter => {
        filter.checked = false;
        filter.disabled = true;
    });

    // Reset time period
    const allTimeFilter = document.querySelector('input[name="activity-time"][value="all"]');
    if (allTimeFilter) {
        allTimeFilter.checked = true;
    }

    // Reset search
    const searchInput = document.getElementById('activity-search');
    if (searchInput) {
        searchInput.value = '';
    }

    // Apply filters
    filterActivityTable();
}

/**
 * Initialize table sorting functionality
 */
function initTableSorting() {
    const sortableHeaders = document.querySelectorAll('.sortable');

    sortableHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const sortBy = this.dataset.sort;
            const currentDirection = this.dataset.direction || 'asc';
            const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';

            // Update header state
            sortableHeaders.forEach(h => {
                h.dataset.direction = '';
                h.querySelector('i').className = 'fas fa-sort';
            });

            this.dataset.direction = newDirection;
            this.querySelector('i').className = `fas fa-sort-${newDirection === 'asc' ? 'up' : 'down'}`;

            // Sort table
            sortTable(sortBy, newDirection);
        });
    });
}

/**
 * Sort table by column
 * @param {string} sortBy - Column to sort by
 * @param {string} direction - Sort direction (asc, desc)
 */
function sortTable(sortBy, direction) {
    const table = document.getElementById('activity-table');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    // Sort rows
    rows.sort((a, b) => {
        let aValue, bValue;

        // Get cell index based on sortBy
        const cellIndex = getCellIndexForSort(sortBy);

        if (cellIndex !== -1) {
            aValue = a.cells[cellIndex].textContent.trim();
            bValue = b.cells[cellIndex].textContent.trim();
        } else {
            // Use data attributes for special cases
            aValue = a.dataset[sortBy] || '';
            bValue = b.dataset[sortBy] || '';
        }

        // Compare values
        const result = aValue.localeCompare(bValue, undefined, { numeric: true, sensitivity: 'base' });
        return direction === 'asc' ? result : -result;
    });

    // Reorder rows
    rows.forEach(row => tbody.appendChild(row));
}

/**
 * Get cell index for sorting
 * @param {string} sortBy - Column to sort by
 * @returns {number} Cell index or -1 if not found
 */
function getCellIndexForSort(sortBy) {
    const headerCells = document.querySelectorAll('#activity-table thead th');

    for (let i = 0; i < headerCells.length; i++) {
        if (headerCells[i].dataset.sort === sortBy) {
            return i;
        }
    }

    return -1;
}

/**
 * Initialize pagination functionality
 */
function initPagination() {
    const itemsPerPageSelect = document.getElementById('items-per-page');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const currentPageSpan = document.getElementById('current-page');

    if (!itemsPerPageSelect || !prevPageBtn || !nextPageBtn || !currentPageSpan) return;

    // Set current page
    let currentPage = 1;

    // Handle items per page change
    itemsPerPageSelect.addEventListener('change', function() {
        currentPage = 1;
        currentPageSpan.textContent = currentPage;
        updatePagination();
    });

    // Handle previous page button
    prevPageBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            currentPageSpan.textContent = currentPage;
            updatePagination();
        }
    });

    // Handle next page button
    nextPageBtn.addEventListener('click', function() {
        const totalPages = getTotalPages();
        if (currentPage < totalPages) {
            currentPage++;
            currentPageSpan.textContent = currentPage;
            updatePagination();
        }
    });

    // Initial pagination
    updatePagination();
}

/**
 * Update pagination based on current page and items per page
 */
function updatePagination() {
    const table = document.getElementById('activity-table');
    const rows = table.querySelectorAll('tbody tr:not([style*="display: none"])');
    const itemsPerPage = parseInt(document.getElementById('items-per-page').value, 10);
    const currentPage = parseInt(document.getElementById('current-page').textContent, 10);
    const totalPages = Math.ceil(rows.length / itemsPerPage);

    // Update pagination buttons
    document.getElementById('prev-page').disabled = currentPage <= 1;
    document.getElementById('next-page').disabled = currentPage >= totalPages;

    // Show/hide rows based on current page
    rows.forEach((row, index) => {
        const rowPage = Math.floor(index / itemsPerPage) + 1;
        row.style.display = rowPage === currentPage ? '' : 'none';
    });

    // Update range display
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, rows.length);

    document.getElementById('activity-range').textContent = rows.length > 0 ? `${start}-${end}` : '0-0';
    document.getElementById('activity-total').textContent = rows.length;
}

/**
 * Update pagination info without changing page visibility
 * @param {number} visibleCount - Number of visible rows
 */
function updatePaginationInfo(visibleCount) {
    const itemsPerPage = parseInt(document.getElementById('items-per-page').value, 10);
    const currentPage = parseInt(document.getElementById('current-page').textContent, 10);
    const totalPages = Math.ceil(visibleCount / itemsPerPage);

    // Update pagination buttons
    document.getElementById('prev-page').disabled = currentPage <= 1;
    document.getElementById('next-page').disabled = currentPage >= totalPages;

    // Update range display
    const start = visibleCount > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
    const end = Math.min(currentPage * itemsPerPage, visibleCount);

    document.getElementById('activity-range').textContent = visibleCount > 0 ? `${start}-${end}` : '0-0';
    document.getElementById('activity-total').textContent = visibleCount;
}

/**
 * Get total number of pages
 * @returns {number} Total pages
 */
function getTotalPages() {
    const table = document.getElementById('activity-table');
    const rows = table.querySelectorAll('tbody tr:not([style*="display: none"])');
    const itemsPerPage = parseInt(document.getElementById('items-per-page').value, 10);

    return Math.ceil(rows.length / itemsPerPage);
}

/**
 * Show loading overlay
 * @param {string} message - Loading message
 */
function showLoadingOverlay(message = 'Loading...') {
    // Create overlay if it doesn't exist
    let overlay = document.querySelector('.loading-overlay');

    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-content">
                <div class="spinner"></div>
                <p class="loading-message">${message}</p>
            </div>
        `;
        document.body.appendChild(overlay);

        // Add styles if they don't exist
        if (!document.getElementById('loading-overlay-styles')) {
            const style = document.createElement('style');
            style.id = 'loading-overlay-styles';
            style.textContent = `
                .loading-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999;
                }

                .loading-content {
                    background-color: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    text-align: center;
                }

                .loading-message {
                    margin-top: 10px;
                    color: var(--accent-color);
                }
            `;
            document.head.appendChild(style);
        }
    } else {
        overlay.querySelector('.loading-message').textContent = message;
        overlay.style.display = 'flex';
    }
}

/**
 * Hide loading overlay
 */
function hideLoadingOverlay() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

/**
 * Show notification
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, info)
 */
function showNotification(message, type = 'info') {
    // Create notification container if it doesn't exist
    let container = document.querySelector('.notification-container');

    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);

        // Add styles if they don't exist
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification-container {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 9999;
                }

                .notification {
                    background-color: white;
                    border-radius: 4px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    padding: 15px 20px;
                    margin-bottom: 10px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    min-width: 300px;
                    max-width: 400px;
                    animation: slideIn 0.3s ease-out forwards;
                }

                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }

                .notification.success {
                    border-left: 4px solid var(--success-color);
                }

                .notification.error {
                    border-left: 4px solid var(--danger-color);
                }

                .notification.info {
                    border-left: 4px solid var(--primary-color);
                }

                .notification-icon {
                    font-size: 20px;
                }

                .notification.success .notification-icon {
                    color: var(--success-color);
                }

                .notification.error .notification-icon {
                    color: var(--danger-color);
                }

                .notification.info .notification-icon {
                    color: var(--primary-color);
                }

                .notification-content {
                    flex: 1;
                }

                .notification-close {
                    background: none;
                    border: none;
                    color: var(--accent-color);
                    cursor: pointer;
                    font-size: 16px;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    // Set icon based on type
    let icon;
    switch (type) {
        case 'success':
            icon = 'fa-check-circle';
            break;
        case 'error':
            icon = 'fa-exclamation-circle';
            break;
        default:
            icon = 'fa-info-circle';
    }

    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas ${icon}"></i>
        </div>
        <div class="notification-content">
            ${message}
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Add to container
    container.appendChild(notification);

    // Add close button event
    notification.querySelector('.notification-close').addEventListener('click', function() {
        container.removeChild(notification);
    });

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode === container) {
            container.removeChild(notification);
        }
    }, 5000);
}

    // Clear filters button (in no results message)
    const clearFiltersBtn = document.getElementById('clear-activity-filters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            resetActivityFilters();
        });
    }

    // Activity search
    const activitySearchInput = document.getElementById('activity-search');
    const activitySearchBtn = document.getElementById('activity-search-btn');

    if (activitySearchInput && activitySearchBtn) {
        activitySearchBtn.addEventListener('click', function() {
            filterActivityTable();
        });

        activitySearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                filterActivityTable();
            }
        });
    }

    // Refresh activity button
    const refreshActivityBtn = document.getElementById('refresh-activity');
    if (refreshActivityBtn) {
        refreshActivityBtn.addEventListener('click', function() {
            showLoadingOverlay('Refreshing activity data...');

            // Simulate refresh
            setTimeout(() => {
                hideLoadingOverlay();
                showNotification('Activity data refreshed', 'success');
                resetActivityFilters();
            }, 1000);
        });
    }
}
