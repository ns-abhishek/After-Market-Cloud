/**
 * Admin Advanced Analytics Module
 * Handles advanced analytics for tenant and locale-specific content usage
 */
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const adminTabs = document.querySelectorAll('.admin-tab');
    const tabContents = document.querySelectorAll('.admin-tab-content');
    const dateRangeOptions = document.querySelectorAll('.date-range-option');
    const customDateRange = document.querySelector('.custom-date-range');
    const applyDateRangeButton = document.getElementById('apply-date-range');
    const dateFromInput = document.getElementById('date-from');
    const dateToInput = document.getElementById('date-to');
    const tenantSelect = document.getElementById('tenant-select');
    const localeSelect = document.getElementById('locale-select');
    const exportTenantDataButton = document.getElementById('export-tenant-data');
    const exportLocaleDataButton = document.getElementById('export-locale-data');
    
    // Initialize advanced analytics
    initAdvancedAnalytics();
    
    /**
     * Initialize advanced analytics components and event listeners
     */
    function initAdvancedAnalytics() {
        // Set up tabs
        if (adminTabs.length > 0) {
            adminTabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    const tabId = this.dataset.tab;
                    switchTab(tabId);
                });
            });
        }
        
        // Set up date range options
        if (dateRangeOptions.length > 0) {
            dateRangeOptions.forEach(option => {
                option.addEventListener('click', function() {
                    const range = this.dataset.range;
                    selectDateRange(range);
                });
            });
        }
        
        // Set up apply date range button
        if (applyDateRangeButton) {
            applyDateRangeButton.addEventListener('click', applyCustomDateRange);
        }
        
        // Set up tenant select
        if (tenantSelect) {
            tenantSelect.addEventListener('change', updateTenantMetrics);
        }
        
        // Set up locale select
        if (localeSelect) {
            localeSelect.addEventListener('change', updateLocaleMetrics);
        }
        
        // Set up export buttons
        if (exportTenantDataButton) {
            exportTenantDataButton.addEventListener('click', exportTenantData);
        }
        
        if (exportLocaleDataButton) {
            exportLocaleDataButton.addEventListener('click', exportLocaleData);
        }
        
        // Initialize charts
        initCharts();
        
        // Set default date range (last 7 days)
        setDefaultDates();
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
     * Select date range
     * @param {string} range - Date range value
     */
    function selectDateRange(range) {
        // Remove active class from all options
        dateRangeOptions.forEach(option => {
            option.classList.remove('active');
        });
        
        // Add active class to selected option
        const selectedOption = document.querySelector(`.date-range-option[data-range="${range}"]`);
        if (selectedOption) {
            selectedOption.classList.add('active');
        }
        
        // Show/hide custom date range inputs
        if (range === 'custom') {
            customDateRange.style.display = 'flex';
        } else {
            customDateRange.style.display = 'none';
            
            // Update charts based on selected range
            updateChartsForDateRange(range);
        }
    }
    
    /**
     * Apply custom date range
     */
    function applyCustomDateRange() {
        const fromDate = dateFromInput.value;
        const toDate = dateToInput.value;
        
        if (!fromDate || !toDate) {
            showNotification('Please select both start and end dates', 'warning');
            return;
        }
        
        // Validate date range
        const from = new Date(fromDate);
        const to = new Date(toDate);
        
        if (from > to) {
            showNotification('Start date cannot be after end date', 'error');
            return;
        }
        
        // Update charts based on custom date range
        updateChartsForCustomDateRange(fromDate, toDate);
    }
    
    /**
     * Set default dates for custom date range
     */
    function setDefaultDates() {
        if (dateFromInput && dateToInput) {
            const today = new Date();
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(today.getDate() - 7);
            
            dateToInput.value = formatDate(today);
            dateFromInput.value = formatDate(sevenDaysAgo);
        }
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
     * Update charts based on selected date range
     * @param {string} range - Date range value
     */
    function updateChartsForDateRange(range) {
        // In a real application, this would fetch data for the selected date range
        // For demo purposes, we'll just show a notification
        showNotification(`Updated charts for last ${range} days`, 'info');
        
        // Update tenant comparison chart
        updateTenantComparisonChart(range);
        
        // Update locale comparison chart
        updateLocaleComparisonChart(range);
    }
    
    /**
     * Update charts based on custom date range
     * @param {string} fromDate - Start date (YYYY-MM-DD)
     * @param {string} toDate - End date (YYYY-MM-DD)
     */
    function updateChartsForCustomDateRange(fromDate, toDate) {
        // In a real application, this would fetch data for the custom date range
        // For demo purposes, we'll just show a notification
        showNotification(`Updated charts for date range: ${fromDate} to ${toDate}`, 'info');
        
        // Update tenant comparison chart with custom range
        updateTenantComparisonChart('custom', fromDate, toDate);
        
        // Update locale comparison chart with custom range
        updateLocaleComparisonChart('custom', fromDate, toDate);
    }
    
    /**
     * Update tenant metrics based on selected tenant
     */
    function updateTenantMetrics() {
        const tenant = tenantSelect.value;
        
        // In a real application, this would fetch metrics for the selected tenant
        // For demo purposes, we'll just show a notification
        showNotification(`Updated metrics for ${tenant === 'all' ? 'all tenants' : tenant}`, 'info');
    }
    
    /**
     * Update locale metrics based on selected locale
     */
    function updateLocaleMetrics() {
        const locale = localeSelect.value;
        
        // In a real application, this would fetch metrics for the selected locale
        // For demo purposes, we'll just show a notification
        showNotification(`Updated metrics for ${locale === 'all' ? 'all locales' : locale}`, 'info');
    }
    
    /**
     * Export tenant data
     */
    function exportTenantData() {
        // In a real application, this would generate and download a CSV/Excel file
        // For demo purposes, we'll just show a notification
        showNotification('Tenant data export started. The file will be downloaded shortly.', 'success');
    }
    
    /**
     * Export locale data
     */
    function exportLocaleData() {
        // In a real application, this would generate and download a CSV/Excel file
        // For demo purposes, we'll just show a notification
        showNotification('Locale data export started. The file will be downloaded shortly.', 'success');
    }
    
    /**
     * Initialize charts
     */
    function initCharts() {
        // Initialize tenant comparison chart
        initTenantComparisonChart();
        
        // Initialize locale comparison chart
        initLocaleComparisonChart();
    }
    
    /**
     * Initialize tenant comparison chart
     */
    function initTenantComparisonChart() {
        const ctx = document.getElementById('tenantComparisonChart');
        
        if (ctx) {
            // Create chart
            window.tenantComparisonChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Global', 'Acme Corp', 'Global Ent', 'Springfield Gov', 'Tech Solutions'],
                    datasets: [
                        {
                            label: 'Page Views',
                            data: [5200, 3800, 2900, 1700, 1200],
                            backgroundColor: 'rgba(33, 150, 243, 0.7)',
                            borderColor: 'rgba(33, 150, 243, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Unique Users',
                            data: [3100, 2200, 1800, 950, 750],
                            backgroundColor: 'rgba(76, 175, 80, 0.7)',
                            borderColor: 'rgba(76, 175, 80, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Avg. Time (seconds)',
                            data: [240, 280, 210, 190, 170],
                            backgroundColor: 'rgba(255, 152, 0, 0.7)',
                            borderColor: 'rgba(255, 152, 0, 1)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.dataset.label || '';
                                    
                                    if (label) {
                                        label += ': ';
                                    }
                                    
                                    if (context.dataset.label === 'Avg. Time (seconds)') {
                                        const minutes = Math.floor(context.raw / 60);
                                        const seconds = context.raw % 60;
                                        label += `${minutes}m ${seconds}s`;
                                    } else {
                                        label += context.formattedValue;
                                    }
                                    
                                    return label;
                                }
                            }
                        }
                    }
                }
            });
        }
    }
    
    /**
     * Update tenant comparison chart
     * @param {string} range - Date range value
     * @param {string} [fromDate] - Start date for custom range
     * @param {string} [toDate] - End date for custom range
     */
    function updateTenantComparisonChart(range, fromDate, toDate) {
        if (!window.tenantComparisonChart) return;
        
        // In a real application, this would fetch data for the selected date range
        // For demo purposes, we'll just update with some sample data
        let viewsData, usersData, timeData;
        
        switch (range) {
            case '30':
                viewsData = [4800, 3500, 2700, 1500, 1100];
                usersData = [2900, 2000, 1600, 850, 650];
                timeData = [230, 270, 200, 180, 160];
                break;
                
            case '90':
                viewsData = [14500, 10200, 8100, 4800, 3300];
                usersData = [8700, 6100, 4900, 2700, 1950];
                timeData = [250, 290, 220, 200, 180];
                break;
                
            case '365':
                viewsData = [58000, 41000, 32000, 19000, 13000];
                usersData = [35000, 24000, 19000, 11000, 7800];
                timeData = [260, 300, 230, 210, 190];
                break;
                
            case 'custom':
                // In a real application, this would fetch data for the custom date range
                viewsData = [6100, 4200, 3300, 2000, 1400];
                usersData = [3700, 2500, 2000, 1100, 850];
                timeData = [245, 285, 215, 195, 175];
                break;
                
            default: // 7 days
                viewsData = [5200, 3800, 2900, 1700, 1200];
                usersData = [3100, 2200, 1800, 950, 750];
                timeData = [240, 280, 210, 190, 170];
        }
        
        // Update chart data
        window.tenantComparisonChart.data.datasets[0].data = viewsData;
        window.tenantComparisonChart.data.datasets[1].data = usersData;
        window.tenantComparisonChart.data.datasets[2].data = timeData;
        
        // Update chart
        window.tenantComparisonChart.update();
    }
    
    /**
     * Initialize locale comparison chart
     */
    function initLocaleComparisonChart() {
        const ctx = document.getElementById('localeComparisonChart');
        
        if (ctx) {
            // Create chart
            window.localeComparisonChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
                    datasets: [
                        {
                            label: 'English (US)',
                            data: [1200, 1300, 1100, 1400, 1350, 1500, 1600],
                            borderColor: 'rgba(33, 150, 243, 1)',
                            backgroundColor: 'rgba(33, 150, 243, 0.1)',
                            tension: 0.4,
                            fill: true
                        },
                        {
                            label: 'German',
                            data: [800, 850, 750, 900, 950, 1000, 1050],
                            borderColor: 'rgba(76, 175, 80, 1)',
                            backgroundColor: 'rgba(76, 175, 80, 0.1)',
                            tension: 0.4,
                            fill: true
                        },
                        {
                            label: 'French',
                            data: [600, 650, 600, 700, 750, 800, 850],
                            borderColor: 'rgba(255, 152, 0, 1)',
                            backgroundColor: 'rgba(255, 152, 0, 0.1)',
                            tension: 0.4,
                            fill: true
                        },
                        {
                            label: 'Japanese',
                            data: [400, 450, 400, 500, 550, 600, 650],
                            borderColor: 'rgba(156, 39, 176, 1)',
                            backgroundColor: 'rgba(156, 39, 176, 0.1)',
                            tension: 0.4,
                            fill: true
                        },
                        {
                            label: 'Spanish',
                            data: [300, 350, 300, 400, 450, 500, 550],
                            borderColor: 'rgba(244, 67, 54, 1)',
                            backgroundColor: 'rgba(244, 67, 54, 0.1)',
                            tension: 0.4,
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top'
                        }
                    }
                }
            });
        }
    }
    
    /**
     * Update locale comparison chart
     * @param {string} range - Date range value
     * @param {string} [fromDate] - Start date for custom range
     * @param {string} [toDate] - End date for custom range
     */
    function updateLocaleComparisonChart(range, fromDate, toDate) {
        if (!window.localeComparisonChart) return;
        
        // In a real application, this would fetch data for the selected date range
        // For demo purposes, we'll just update with some sample data
        let labels, enData, deData, frData, jaData, esData;
        
        switch (range) {
            case '30':
                labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
                enData = [5200, 5500, 5800, 6100];
                deData = [3500, 3700, 3900, 4100];
                frData = [2700, 2900, 3100, 3300];
                jaData = [1800, 2000, 2200, 2400];
                esData = [1500, 1700, 1900, 2100];
                break;
                
            case '90':
                labels = ['Month 1', 'Month 2', 'Month 3'];
                enData = [15000, 16500, 18000];
                deData = [10000, 11000, 12000];
                frData = [8000, 8800, 9600];
                jaData = [5500, 6000, 6500];
                esData = [4500, 5000, 5500];
                break;
                
            case '365':
                labels = ['Q1', 'Q2', 'Q3', 'Q4'];
                enData = [60000, 66000, 72000, 78000];
                deData = [40000, 44000, 48000, 52000];
                frData = [32000, 35000, 38000, 41000];
                jaData = [22000, 24000, 26000, 28000];
                esData = [18000, 20000, 22000, 24000];
                break;
                
            case 'custom':
                // In a real application, this would fetch data for the custom date range
                labels = ['Period 1', 'Period 2', 'Period 3', 'Period 4'];
                enData = [4800, 5200, 5600, 6000];
                deData = [3200, 3500, 3800, 4100];
                frData = [2500, 2700, 2900, 3100];
                jaData = [1700, 1900, 2100, 2300];
                esData = [1400, 1600, 1800, 2000];
                break;
                
            default: // 7 days
                labels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
                enData = [1200, 1300, 1100, 1400, 1350, 1500, 1600];
                deData = [800, 850, 750, 900, 950, 1000, 1050];
                frData = [600, 650, 600, 700, 750, 800, 850];
                jaData = [400, 450, 400, 500, 550, 600, 650];
                esData = [300, 350, 300, 400, 450, 500, 550];
        }
        
        // Update chart labels
        window.localeComparisonChart.data.labels = labels;
        
        // Update chart data
        window.localeComparisonChart.data.datasets[0].data = enData;
        window.localeComparisonChart.data.datasets[1].data = deData;
        window.localeComparisonChart.data.datasets[2].data = frData;
        window.localeComparisonChart.data.datasets[3].data = jaData;
        window.localeComparisonChart.data.datasets[4].data = esData;
        
        // Update chart
        window.localeComparisonChart.update();
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
});
