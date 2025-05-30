/**
 * Reports & Analytics System
 * Comprehensive analytics dashboard with charts, KPIs, and reports
 */

// Global variables
let analyticsData = {};
let charts = {};
let currentDateRange = {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    end: new Date()
};

// DOM elements
let totalRevenue, activeCustomers, serviceOrders, equipmentUnits, warrantyClaims, responseTime;
let revenueChange, customersChange, serviceChange, equipmentChange, warrantyChange, responseChange;
let startDateInput, endDateInput, reportTypeSelect, timeframeSelect;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Reports & Analytics initializing...');
    initializeElements();
    setupEventListeners();
    initializeDateRange();
    loadAnalyticsData();
    initializeCharts();
    loadReportsData();
});

// Initialize DOM elements
function initializeElements() {
    // KPI elements
    totalRevenue = document.getElementById('totalRevenue');
    activeCustomers = document.getElementById('activeCustomers');
    serviceOrders = document.getElementById('serviceOrders');
    equipmentUnits = document.getElementById('equipmentUnits');
    warrantyClaims = document.getElementById('warrantyClaims');
    responseTime = document.getElementById('responseTime');

    // Change indicators
    revenueChange = document.getElementById('revenueChange');
    customersChange = document.getElementById('customersChange');
    serviceChange = document.getElementById('serviceChange');
    equipmentChange = document.getElementById('equipmentChange');
    warrantyChange = document.getElementById('warrantyChange');
    responseChange = document.getElementById('responseChange');

    // Filter elements
    startDateInput = document.getElementById('startDate');
    endDateInput = document.getElementById('endDate');
    reportTypeSelect = document.getElementById('reportType');
    timeframeSelect = document.getElementById('timeframe');
}

// Setup event listeners
function setupEventListeners() {
    // Header buttons
    document.getElementById('refreshBtn').addEventListener('click', refreshData);
    document.getElementById('exportBtn').addEventListener('click', exportData);
    document.getElementById('settingsBtn').addEventListener('click', showSettings);

    // Filter controls
    document.getElementById('applyFiltersBtn').addEventListener('click', applyFilters);
    timeframeSelect.addEventListener('change', handleTimeframeChange);
    reportTypeSelect.addEventListener('change', handleReportTypeChange);

    // Chart period buttons
    document.querySelectorAll('.chart-btn[data-period]').forEach(btn => {
        btn.addEventListener('click', (e) => handleChartPeriodChange(e.target.dataset.period));
    });

    // Chart type buttons
    document.querySelectorAll('.chart-btn[data-chart]').forEach(btn => {
        btn.addEventListener('click', (e) => handleChartTypeChange(e.target.dataset.chart));
    });

    // Report action buttons
    document.getElementById('viewAllCustomersBtn').addEventListener('click', () => openDetailedReport('customers'));
    document.getElementById('viewServiceReportBtn').addEventListener('click', () => openDetailedReport('service'));
    document.getElementById('viewInventoryBtn').addEventListener('click', () => openDetailedReport('inventory'));
    document.getElementById('viewFinancialBtn').addEventListener('click', () => openDetailedReport('financial'));
}

// Initialize date range
function initializeDateRange() {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    startDateInput.value = thirtyDaysAgo.toISOString().split('T')[0];
    endDateInput.value = today.toISOString().split('T')[0];

    currentDateRange.start = thirtyDaysAgo;
    currentDateRange.end = today;
}

// Load analytics data
function loadAnalyticsData() {
    console.log('Loading analytics data...');

    try {
        // Get data from various sources
        const parties = DataService.getParties() || [];
        const serviceHistory = DataService.getServiceHistory() || [];
        const warranties = DataService.getWarrantyRecords() || [];
        const equipment = DataService.getCustomerEquipment() || [];

        // Calculate KPIs
        analyticsData = calculateKPIs(parties, serviceHistory, warranties, equipment);

        // Update KPI displays
        updateKPIDisplays();

        console.log('Analytics data loaded:', analyticsData);
    } catch (error) {
        console.error('Error loading analytics data:', error);
        showNotification('Error loading analytics data', 'error');
    }
}

// Calculate KPIs from data
function calculateKPIs(parties, serviceHistory, warranties, equipment) {
    const now = new Date();
    const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const lastTwoMonths = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    // Filter data for current and previous periods
    const currentServices = serviceHistory.filter(s => new Date(s.serviceDate) >= lastMonth);
    const previousServices = serviceHistory.filter(s =>
        new Date(s.serviceDate) >= lastTwoMonths && new Date(s.serviceDate) < lastMonth
    );

    const currentWarranties = warranties.filter(w => new Date(w.startDate) >= lastMonth);
    const previousWarranties = warranties.filter(w =>
        new Date(w.startDate) >= lastTwoMonths && new Date(w.startDate) < lastMonth
    );

    // Calculate metrics
    const totalRevenue = currentServices.reduce((sum, s) => sum + (s.cost || 0), 0);
    const previousRevenue = previousServices.reduce((sum, s) => sum + (s.cost || 0), 0);
    const revenueGrowth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue * 100) : 0;

    const activeCustomers = parties.filter(p => p.isActive).length;
    const totalCustomers = parties.length;
    const customerGrowth = 5.2; // Mock growth percentage

    const serviceOrders = currentServices.length;
    const previousServiceOrders = previousServices.length;
    const serviceGrowth = previousServiceOrders > 0 ? ((serviceOrders - previousServiceOrders) / previousServiceOrders * 100) : 0;

    const equipmentUnits = equipment.length;
    const equipmentGrowth = 8.1; // Mock growth percentage

    const warrantyClaims = currentWarranties.length;
    const previousWarrantyClaims = previousWarranties.length;
    const warrantyGrowth = previousWarrantyClaims > 0 ? ((warrantyClaims - previousWarrantyClaims) / previousWarrantyClaims * 100) : 0;

    const avgResponseTime = currentServices.length > 0 ?
        currentServices.reduce((sum, s) => sum + (s.laborHours || 0), 0) / currentServices.length : 0;
    const responseGrowth = -12.3; // Mock improvement percentage

    return {
        totalRevenue,
        revenueGrowth,
        activeCustomers,
        customerGrowth,
        serviceOrders,
        serviceGrowth,
        equipmentUnits,
        equipmentGrowth,
        warrantyClaims,
        warrantyGrowth,
        avgResponseTime,
        responseGrowth,
        currentServices,
        previousServices,
        parties,
        equipment,
        warranties
    };
}

// Update KPI displays
function updateKPIDisplays() {
    // Update values
    totalRevenue.textContent = `$${analyticsData.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    activeCustomers.textContent = analyticsData.activeCustomers.toLocaleString();
    serviceOrders.textContent = analyticsData.serviceOrders.toLocaleString();
    equipmentUnits.textContent = analyticsData.equipmentUnits.toLocaleString();
    warrantyClaims.textContent = analyticsData.warrantyClaims.toLocaleString();
    responseTime.textContent = `${analyticsData.avgResponseTime.toFixed(1)}h`;

    // Update change indicators
    updateChangeIndicator(revenueChange, analyticsData.revenueGrowth);
    updateChangeIndicator(customersChange, analyticsData.customerGrowth);
    updateChangeIndicator(serviceChange, analyticsData.serviceGrowth);
    updateChangeIndicator(equipmentChange, analyticsData.equipmentGrowth);
    updateChangeIndicator(warrantyChange, analyticsData.warrantyGrowth);
    updateChangeIndicator(responseChange, analyticsData.responseGrowth);
}

// Update change indicator
function updateChangeIndicator(element, value) {
    const span = element.querySelector('span');
    const icon = element.querySelector('i');

    const absValue = Math.abs(value);
    const sign = value >= 0 ? '+' : '';

    span.textContent = `${sign}${absValue.toFixed(1)}%`;

    // Update classes and icons
    element.className = 'kpi-change';
    if (value > 0) {
        element.classList.add('positive');
        icon.textContent = 'trending_up';
    } else if (value < 0) {
        element.classList.add('negative');
        icon.textContent = 'trending_down';
    } else {
        element.classList.add('neutral');
        icon.textContent = 'trending_flat';
    }
}

// Initialize charts
function initializeCharts() {
    console.log('Initializing charts...');

    try {
        initializeRevenueChart();
        initializeServiceStatusChart();
        initializeCustomerGrowthChart();
        initializeEquipmentChart();
    } catch (error) {
        console.error('Error initializing charts:', error);
        showNotification('Error loading charts', 'error');
    }
}

// Initialize revenue trend chart
function initializeRevenueChart() {
    const ctx = document.getElementById('revenueChart').getContext('2d');

    // Generate sample revenue data for the last 30 days
    const labels = [];
    const data = [];
    const now = new Date();

    for (let i = 29; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));

        // Generate realistic revenue data with some variation
        const baseRevenue = 1000 + Math.random() * 2000;
        const weekendMultiplier = date.getDay() === 0 || date.getDay() === 6 ? 0.7 : 1;
        data.push(Math.round(baseRevenue * weekendMultiplier));
    }

    charts.revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Daily Revenue',
                data: data,
                borderColor: '#94a3b8',
                backgroundColor: 'rgba(148, 163, 184, 0.2)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// Initialize service status chart
function initializeServiceStatusChart() {
    const ctx = document.getElementById('serviceStatusChart').getContext('2d');

    const serviceData = analyticsData.currentServices || [];
    const statusCounts = {
        'Completed': serviceData.filter(s => s.status === 'Completed').length,
        'In Progress': serviceData.filter(s => s.status === 'In Progress').length,
        'Scheduled': serviceData.filter(s => s.status === 'Scheduled').length,
        'Cancelled': serviceData.filter(s => s.status === 'Cancelled').length
    };

    charts.serviceStatusChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(statusCounts),
            datasets: [{
                data: Object.values(statusCounts),
                backgroundColor: [
                    '#dcfce7',  // Completed - Light green (more visible)
                    '#fef3c7',  // In Progress - Light amber (more visible)
                    '#dbeafe',  // Scheduled - Light blue (more visible)
                    '#fecaca'   // Cancelled - Light red (more visible)
                ],
                borderWidth: 2,
                borderColor: '#f8fafc'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                }
            }
        }
    });
}

// Initialize customer growth chart
function initializeCustomerGrowthChart() {
    const ctx = document.getElementById('customerGrowthChart').getContext('2d');

    // Generate sample customer growth data for the last 12 months
    const labels = [];
    const data = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }));

        // Generate realistic customer growth data
        const baseGrowth = 50 + Math.random() * 30;
        data.push(Math.round(baseGrowth));
    }

    charts.customerGrowthChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'New Customers',
                data: data,
                backgroundColor: '#c4b5fd',
                borderColor: '#a78bfa',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Initialize equipment performance chart
function initializeEquipmentChart() {
    const ctx = document.getElementById('equipmentChart').getContext('2d');

    // Generate sample equipment performance data
    const labels = ['Excavators', 'Bulldozers', 'Loaders', 'Cranes', 'Trucks'];
    const uptimeData = [95.2, 87.8, 92.1, 89.5, 94.3];
    const efficiencyData = [88.5, 91.2, 85.7, 87.9, 90.1];

    charts.equipmentChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Uptime %',
                data: uptimeData,
                borderColor: '#34d399',
                backgroundColor: 'rgba(52, 211, 153, 0.3)',
                borderWidth: 2
            }, {
                label: 'Efficiency %',
                data: efficiencyData,
                borderColor: '#fbbf24',
                backgroundColor: 'rgba(251, 191, 36, 0.3)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20
                    }
                }
            }
        }
    });
}

// Load reports data
function loadReportsData() {
    console.log('Loading reports data...');

    try {
        loadTopCustomersReport();
        loadServicePerformanceReport();
        loadInventoryReport();
        loadFinancialReport();
    } catch (error) {
        console.error('Error loading reports data:', error);
        showNotification('Error loading reports', 'error');
    }
}

// Load top customers report
function loadTopCustomersReport() {
    const tableBody = document.querySelector('#topCustomersTable tbody');

    // Generate sample top customers data
    const topCustomers = [
        { name: 'Acme Corporation', revenue: 125000, orders: 45, growth: 12.5 },
        { name: 'Global Industries', revenue: 98000, orders: 32, growth: 8.3 },
        { name: 'Tech Solutions Inc', revenue: 87500, orders: 28, growth: -2.1 },
        { name: 'Manufacturing Co', revenue: 76000, orders: 24, growth: 15.7 },
        { name: 'Construction Ltd', revenue: 65000, orders: 19, growth: 6.9 }
    ];

    tableBody.innerHTML = topCustomers.map(customer => `
        <tr>
            <td style="font-weight: 500;">${customer.name}</td>
            <td>$${customer.revenue.toLocaleString()}</td>
            <td>${customer.orders}</td>
            <td style="color: ${customer.growth >= 0 ? 'var(--success-color)' : 'var(--error-color)'};">
                ${customer.growth >= 0 ? '+' : ''}${customer.growth.toFixed(1)}%
            </td>
        </tr>
    `).join('');
}

// Load service performance report
function loadServicePerformanceReport() {
    const tableBody = document.querySelector('#servicePerformanceTable tbody');

    // Generate sample service performance data
    const technicians = [
        { name: 'John Service Tech', completed: 28, avgTime: 3.2, rating: 4.8 },
        { name: 'Mike Repair Specialist', completed: 24, avgTime: 4.1, rating: 4.6 },
        { name: 'Sarah Quality Inspector', completed: 31, avgTime: 2.8, rating: 4.9 },
        { name: 'Tom Emergency Tech', completed: 19, avgTime: 5.5, rating: 4.4 },
        { name: 'Lisa Maintenance Tech', completed: 26, avgTime: 3.7, rating: 4.7 }
    ];

    tableBody.innerHTML = technicians.map(tech => `
        <tr>
            <td style="font-weight: 500;">${tech.name}</td>
            <td>${tech.completed}</td>
            <td>${tech.avgTime}h</td>
            <td>
                <div style="display: flex; align-items: center; gap: 4px;">
                    <span>${tech.rating}</span>
                    <div style="color: var(--warning-color);">
                        ${'★'.repeat(Math.floor(tech.rating))}${'☆'.repeat(5 - Math.floor(tech.rating))}
                    </div>
                </div>
            </td>
        </tr>
    `).join('');
}

// Load inventory report
function loadInventoryReport() {
    const tableBody = document.querySelector('#inventoryTable tbody');

    // Generate sample inventory data
    const inventory = [
        { part: 'Oil Filter OF-123', stock: 245, status: 'In Stock', value: 12250 },
        { part: 'Engine Oil EO-456', stock: 89, status: 'Low Stock', value: 4450 },
        { part: 'Hydraulic Pump HP-789', stock: 12, status: 'Critical', value: 25200 },
        { part: 'Air Filter AF-321', stock: 156, status: 'In Stock', value: 7800 },
        { part: 'Fuel Filter FF-654', stock: 203, status: 'In Stock', value: 10150 }
    ];

    tableBody.innerHTML = inventory.map(item => {
        let statusColor = 'var(--success-color)';
        if (item.status === 'Low Stock') statusColor = 'var(--warning-color)';
        if (item.status === 'Critical') statusColor = 'var(--error-color)';

        return `
            <tr>
                <td style="font-weight: 500;">${item.part}</td>
                <td>${item.stock}</td>
                <td>
                    <span style="color: ${statusColor}; font-weight: 500;">
                        ${item.status}
                    </span>
                </td>
                <td>$${item.value.toLocaleString()}</td>
            </tr>
        `;
    }).join('');
}

// Load financial report
function loadFinancialReport() {
    const tableBody = document.querySelector('#financialTable tbody');

    // Generate sample financial data
    const financials = [
        { metric: 'Total Revenue', thisMonth: 245000, lastMonth: 228000 },
        { metric: 'Service Revenue', thisMonth: 156000, lastMonth: 142000 },
        { metric: 'Parts Revenue', thisMonth: 89000, lastMonth: 86000 },
        { metric: 'Operating Costs', thisMonth: 98000, lastMonth: 105000 },
        { metric: 'Net Profit', thisMonth: 147000, lastMonth: 123000 }
    ];

    tableBody.innerHTML = financials.map(item => {
        const change = ((item.thisMonth - item.lastMonth) / item.lastMonth * 100);
        const changeColor = change >= 0 ? 'var(--success-color)' : 'var(--error-color)';

        return `
            <tr>
                <td style="font-weight: 500;">${item.metric}</td>
                <td>$${item.thisMonth.toLocaleString()}</td>
                <td>$${item.lastMonth.toLocaleString()}</td>
                <td style="color: ${changeColor}; font-weight: 500;">
                    ${change >= 0 ? '+' : ''}${change.toFixed(1)}%
                </td>
            </tr>
        `;
    }).join('');
}

// Event handlers
function refreshData() {
    showNotification('Refreshing analytics data...', 'info');
    loadAnalyticsData();

    // Refresh charts
    Object.values(charts).forEach(chart => {
        if (chart && typeof chart.update === 'function') {
            chart.update();
        }
    });

    // Refresh reports
    loadReportsData();

    showNotification('Data refreshed successfully', 'success');
}

function exportData() {
    showNotification('Exporting analytics data...', 'info');

    // In a real application, this would generate and download a file
    setTimeout(() => {
        showNotification('Export completed successfully', 'success');
    }, 2000);
}

function showSettings() {
    showNotification('Analytics settings would open here', 'info');
}

function applyFilters() {
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);
    const reportType = reportTypeSelect.value;

    if (startDate > endDate) {
        showNotification('Start date must be before end date', 'error');
        return;
    }

    currentDateRange.start = startDate;
    currentDateRange.end = endDate;

    showNotification(`Applying filters: ${reportType} from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`, 'info');

    // Refresh data with new filters
    loadAnalyticsData();
    loadReportsData();
}

function handleTimeframeChange() {
    const timeframe = timeframeSelect.value;
    const now = new Date();
    let startDate;

    switch (timeframe) {
        case '7d':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
        case '30d':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
        case '90d':
            startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            break;
        case '1y':
            startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            break;
        case 'custom':
            return; // Don't auto-update for custom range
    }

    if (startDate) {
        startDateInput.value = startDate.toISOString().split('T')[0];
        endDateInput.value = now.toISOString().split('T')[0];
        applyFilters();
    }
}

function handleReportTypeChange() {
    const reportType = reportTypeSelect.value;
    showNotification(`Switching to ${reportType} report view`, 'info');

    // In a real application, this would filter data by report type
    loadAnalyticsData();
    loadReportsData();
}

function handleChartPeriodChange(period) {
    // Update active button
    document.querySelectorAll('.chart-btn[data-period]').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-period="${period}"]`).classList.add('active');

    showNotification(`Updating chart for ${period} period`, 'info');

    // Update revenue chart with new period data
    // In a real application, this would fetch new data
}

function handleChartTypeChange(chartType) {
    // Update active button
    document.querySelectorAll('.chart-btn[data-chart]').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-chart="${chartType}"]`).classList.add('active');

    // Update service status chart type
    if (charts.serviceStatusChart) {
        charts.serviceStatusChart.config.type = chartType;
        charts.serviceStatusChart.update();
    }
}

function openDetailedReport(reportType) {
    showNotification(`Opening detailed ${reportType} report...`, 'info');

    // In a real application, this would navigate to detailed report pages
    switch (reportType) {
        case 'customers':
            // window.open('customer-detailed-report.html', '_blank');
            break;
        case 'service':
            window.open('service-history.html', '_blank');
            break;
        case 'inventory':
            // window.open('inventory-report.html', '_blank');
            break;
        case 'financial':
            // window.open('financial-report.html', '_blank');
            break;
    }
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${type === 'error' ? 'var(--error-color)' : type === 'success' ? 'var(--success-color)' : 'var(--info-color)'};
        color: white;
        padding: 12px 20px;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;

    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Back button functionality
function goBack() {
    if (typeof NavigationUtils !== 'undefined') {
        NavigationUtils.goBackToPartyDetails();
    } else {
        window.location.href = 'party-details-advanced.html';
    }
}