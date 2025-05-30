/**
 * Executive Dashboard JavaScript
 *
 * This file provides comprehensive functionality for the executive dashboard,
 * including KPI management, chart rendering, data visualization, and real-time updates.
 */

// Global variables
let charts = {};
let dashboardData = {};
let currentTimeRange = '30d';
let refreshInterval;

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Executive Dashboard...');

    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded!');
        return;
    }
    console.log('Chart.js loaded successfully');

    // Initialize navigation utilities
    if (typeof NavigationUtils !== 'undefined') {
        NavigationUtils.init();
    }

    // Set up event listeners
    setupEventListeners();

    // Load initial data first, then initialize charts
    loadDashboardData();

    // Initialize charts after a short delay to ensure data is loaded
    setTimeout(() => {
        console.log('Starting chart initialization...');
        console.log('Available canvas elements:');
        console.log('- revenueChart:', document.getElementById('revenueChart'));
        console.log('- performanceChart:', document.getElementById('performanceChart'));
        console.log('- customerGrowthChart:', document.getElementById('customerGrowthChart'));
        console.log('- operationalChart:', document.getElementById('operationalChart'));
        console.log('- marketAnalysisChart:', document.getElementById('marketAnalysisChart'));
        initializeCharts();
    }, 200);

    // Start auto-refresh
    startAutoRefresh();

    console.log('Executive Dashboard initialized successfully');
});

// Set up event listeners
function setupEventListeners() {
    // Header buttons
    const refreshBtn = document.getElementById('refreshBtn');
    const exportBtn = document.getElementById('exportBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const filtersBtn = document.getElementById('filtersBtn');
    const generateReportBtn = document.getElementById('generateReportBtn');

    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshDashboard);
    }

    if (exportBtn) {
        exportBtn.addEventListener('click', exportDashboard);
    }

    if (settingsBtn) {
        settingsBtn.addEventListener('click', openSettings);
    }

    if (filtersBtn) {
        filtersBtn.addEventListener('click', openFilters);
    }

    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', generateReport);
    }

    // Time range selector
    const timeRangeBtns = document.querySelectorAll('.time-range-btn');
    timeRangeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            timeRangeBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Update time range
            currentTimeRange = this.dataset.range;
            // Refresh data
            loadDashboardData();
        });
    });

    // Chart action buttons
    setupChartEventListeners();

    // Table action buttons
    setupTableEventListeners();
}

// Set up chart event listeners
function setupChartEventListeners() {
    // Revenue chart buttons
    const revenueChartBtns = document.querySelectorAll('#revenueChart').parentElement.parentElement.querySelectorAll('.chart-btn');
    revenueChartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            updateChartPeriod('revenue', this.dataset.period);
        });
    });

    // Performance chart buttons
    const performanceChartBtns = document.querySelectorAll('#performanceChart').parentElement.parentElement.querySelectorAll('.chart-btn');
    performanceChartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            updateChartType('performance', this.dataset.chart);
        });
    });

    // Customer growth chart buttons
    const customerGrowthBtns = document.querySelectorAll('#customerGrowthChart').parentElement.parentElement.querySelectorAll('.chart-btn');
    customerGrowthBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            updateChartType('customerGrowth', this.dataset.type);
        });
    });

    // Operational chart buttons
    const operationalBtns = document.querySelectorAll('#operationalChart').parentElement.parentElement.querySelectorAll('.chart-btn');
    operationalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            updateChartMetric('operational', this.dataset.metric);
        });
    });

    // Market analysis chart buttons
    const marketAnalysisBtns = document.querySelectorAll('#marketAnalysisChart').parentElement.parentElement.querySelectorAll('.chart-btn');
    marketAnalysisBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            updateChartView('marketAnalysis', this.dataset.view);
        });
    });
}

// Set up table event listeners
function setupTableEventListeners() {
    // View all buttons
    const viewAllProductsBtn = document.getElementById('viewAllProductsBtn');
    const viewAllCustomersBtn = document.getElementById('viewAllCustomersBtn');
    const viewAllActivitiesBtn = document.getElementById('viewAllActivitiesBtn');
    const viewAllAlertsBtn = document.getElementById('viewAllAlertsBtn');

    if (viewAllProductsBtn) {
        viewAllProductsBtn.addEventListener('click', () => navigateToProducts());
    }

    if (viewAllCustomersBtn) {
        viewAllCustomersBtn.addEventListener('click', () => navigateToCustomers());
    }

    if (viewAllActivitiesBtn) {
        viewAllActivitiesBtn.addEventListener('click', () => navigateToActivities());
    }

    if (viewAllAlertsBtn) {
        viewAllAlertsBtn.addEventListener('click', () => navigateToAlerts());
    }
}

// Load dashboard data
function loadDashboardData() {
    console.log(`Loading dashboard data for time range: ${currentTimeRange}`);

    // Generate sample data based on time range
    dashboardData = generateSampleData(currentTimeRange);

    // Update KPIs
    updateKPIs();

    // Update charts
    updateCharts();

    // Update tables
    updateTables();

    console.log('Dashboard data loaded successfully');
}

// Generate sample data
function generateSampleData(timeRange) {
    const baseData = {
        totalRevenue: 2450000,
        activeCustomers: 1247,
        serviceOrders: 89,
        equipmentUnits: 456,
        profitMargin: 23.5,
        customerSatisfaction: 94.2
    };

    // Adjust data based on time range
    const multiplier = getTimeRangeMultiplier(timeRange);

    return {
        kpis: {
            totalRevenue: {
                value: baseData.totalRevenue * multiplier,
                change: Math.random() * 20 - 5, // -5% to +15%
                trend: generateTrendData(30)
            },
            activeCustomers: {
                value: Math.floor(baseData.activeCustomers * multiplier),
                change: Math.random() * 15 + 2, // +2% to +17%
                trend: generateTrendData(30)
            },
            serviceOrders: {
                value: Math.floor(baseData.serviceOrders * multiplier),
                change: Math.random() * 10 - 2, // -2% to +8%
                trend: generateTrendData(30)
            },
            equipmentUnits: {
                value: Math.floor(baseData.equipmentUnits * multiplier),
                change: Math.random() * 12 + 3, // +3% to +15%
                trend: generateTrendData(30)
            },
            profitMargin: {
                value: baseData.profitMargin + (Math.random() * 6 - 3), // ±3%
                change: Math.random() * 8 - 2, // -2% to +6%
                trend: generateTrendData(30)
            },
            customerSatisfaction: {
                value: baseData.customerSatisfaction + (Math.random() * 4 - 2), // ±2%
                change: Math.random() * 5 + 1, // +1% to +6%
                trend: generateTrendData(30)
            }
        },
        charts: {
            revenue: generateRevenueData(timeRange),
            performance: generatePerformanceData(),
            customerGrowth: generateCustomerGrowthData(timeRange),
            operational: generateOperationalData(),
            marketAnalysis: generateMarketAnalysisData()
        },
        tables: {
            topProducts: generateTopProductsData(),
            keyCustomers: generateKeyCustomersData(),
            recentActivities: generateRecentActivitiesData(),
            systemAlerts: generateSystemAlertsData()
        }
    };
}

// Get time range multiplier
function getTimeRangeMultiplier(timeRange) {
    switch (timeRange) {
        case '7d': return 0.25;
        case '30d': return 1;
        case '90d': return 3;
        case '1y': return 12;
        default: return 1;
    }
}

// Generate trend data
function generateTrendData(points) {
    const data = [];
    let value = 50 + Math.random() * 30; // Start between 50-80

    for (let i = 0; i < points; i++) {
        value += (Math.random() - 0.5) * 10; // Random walk
        value = Math.max(20, Math.min(100, value)); // Keep between 20-100
        data.push(Math.round(value));
    }

    return data;
}

// Generate revenue data
function generateRevenueData(timeRange) {
    const periods = getPeriodsForTimeRange(timeRange);
    const labels = [];
    const data = [];

    for (let i = 0; i < periods; i++) {
        labels.push(getDateLabel(i, timeRange));
        data.push(Math.floor(Math.random() * 100000) + 50000);
    }

    return { labels, data };
}

// Generate performance data
function generatePerformanceData() {
    return {
        labels: ['Sales', 'Service', 'Operations', 'Customer Support', 'Marketing'],
        data: [85, 92, 78, 88, 75],
        colors: ['#059669', '#2563eb', '#d97706', '#7c3aed', '#dc2626']
    };
}

// Generate customer growth data
function generateCustomerGrowthData(timeRange) {
    const periods = getPeriodsForTimeRange(timeRange);
    const labels = [];
    const newCustomers = [];
    const retainedCustomers = [];

    for (let i = 0; i < periods; i++) {
        labels.push(getDateLabel(i, timeRange));
        newCustomers.push(Math.floor(Math.random() * 50) + 20);
        retainedCustomers.push(Math.floor(Math.random() * 200) + 800);
    }

    return { labels, newCustomers, retainedCustomers };
}

// Generate operational data
function generateOperationalData() {
    return {
        labels: ['Equipment A', 'Equipment B', 'Equipment C', 'Equipment D', 'Equipment E'],
        efficiency: [95, 87, 92, 89, 94],
        productivity: [88, 91, 85, 93, 87]
    };
}

// Generate market analysis data
function generateMarketAnalysisData() {
    return {
        marketShare: {
            labels: ['Our Company', 'Competitor A', 'Competitor B', 'Competitor C', 'Others'],
            data: [35, 25, 18, 12, 10],
            colors: ['#059669', '#94a3b8', '#cbd5e1', '#e2e8f0', '#f1f5f9']
        },
        competitive: {
            labels: ['Price', 'Quality', 'Service', 'Innovation', 'Brand'],
            ourCompany: [85, 92, 88, 90, 87],
            competitor: [78, 85, 82, 75, 89]
        },
        trends: {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            marketGrowth: [12, 15, 18, 22],
            ourGrowth: [18, 22, 25, 28]
        }
    };
}

// Helper functions for data generation
function getPeriodsForTimeRange(timeRange) {
    switch (timeRange) {
        case '7d': return 7;
        case '30d': return 30;
        case '90d': return 12; // Weekly data
        case '1y': return 12; // Monthly data
        default: return 30;
    }
}

function getDateLabel(index, timeRange) {
    const now = new Date();
    let date;

    switch (timeRange) {
        case '7d':
            date = new Date(now.getTime() - (6 - index) * 24 * 60 * 60 * 1000);
            return date.toLocaleDateString('en-US', { weekday: 'short' });
        case '30d':
            date = new Date(now.getTime() - (29 - index) * 24 * 60 * 60 * 1000);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        case '90d':
            date = new Date(now.getTime() - (11 - index) * 7 * 24 * 60 * 60 * 1000);
            return `Week ${index + 1}`;
        case '1y':
            date = new Date(now.getFullYear(), now.getMonth() - (11 - index), 1);
            return date.toLocaleDateString('en-US', { month: 'short' });
        default:
            return `Period ${index + 1}`;
    }
}

// Update KPIs
function updateKPIs() {
    const kpis = dashboardData.kpis;

    // Total Revenue
    updateKPI('totalRevenue', kpis.totalRevenue.value, kpis.totalRevenue.change, 'currency');
    updateKPITrend('revenueTrendChart', kpis.totalRevenue.trend);

    // Active Customers
    updateKPI('activeCustomers', kpis.activeCustomers.value, kpis.activeCustomers.change, 'number');
    updateKPITrend('customersTrendChart', kpis.activeCustomers.trend);

    // Service Orders
    updateKPI('serviceOrders', kpis.serviceOrders.value, kpis.serviceOrders.change, 'number');
    updateKPITrend('serviceTrendChart', kpis.serviceOrders.trend);

    // Equipment Units
    updateKPI('equipmentUnits', kpis.equipmentUnits.value, kpis.equipmentUnits.change, 'number');
    updateKPITrend('equipmentTrendChart', kpis.equipmentUnits.trend);

    // Profit Margin
    updateKPI('profitMargin', kpis.profitMargin.value, kpis.profitMargin.change, 'percentage');
    updateKPITrend('profitTrendChart', kpis.profitMargin.trend);

    // Customer Satisfaction
    updateKPI('customerSatisfaction', kpis.customerSatisfaction.value, kpis.customerSatisfaction.change, 'percentage');
    updateKPITrend('satisfactionTrendChart', kpis.customerSatisfaction.trend);
}

// Update individual KPI
function updateKPI(elementId, value, change, type) {
    const valueElement = document.getElementById(elementId);
    // Fix the change element ID generation
    let changeElementId;
    switch (elementId) {
        case 'totalRevenue':
            changeElementId = 'revenueChange';
            break;
        case 'activeCustomers':
            changeElementId = 'customersChange';
            break;
        case 'serviceOrders':
            changeElementId = 'serviceChange';
            break;
        case 'equipmentUnits':
            changeElementId = 'equipmentChange';
            break;
        case 'profitMargin':
            changeElementId = 'profitChange';
            break;
        case 'customerSatisfaction':
            changeElementId = 'satisfactionChange';
            break;
        default:
            changeElementId = elementId + 'Change';
    }
    const changeElement = document.getElementById(changeElementId);

    if (valueElement) {
        let formattedValue;
        switch (type) {
            case 'currency':
                formattedValue = `$${value.toLocaleString('en-US', { minimumFractionDigits: 0 })}`;
                break;
            case 'percentage':
                formattedValue = `${value.toFixed(1)}%`;
                break;
            case 'number':
            default:
                formattedValue = value.toLocaleString('en-US');
                break;
        }
        valueElement.textContent = formattedValue;
    }

    if (changeElement) {
        const span = changeElement.querySelector('span');
        const icon = changeElement.querySelector('i');

        if (span && icon) {
            const sign = change >= 0 ? '+' : '';
            span.textContent = `${sign}${change.toFixed(1)}%`;

            // Update classes and icons
            changeElement.className = 'kpi-change';
            if (change > 0) {
                changeElement.classList.add('positive');
                icon.textContent = 'trending_up';
            } else if (change < 0) {
                changeElement.classList.add('negative');
                icon.textContent = 'trending_down';
            } else {
                changeElement.classList.add('neutral');
                icon.textContent = 'trending_flat';
            }
        }
    }
}

// Update KPI trend chart
function updateKPITrend(canvasId, trendData) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw trend line
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const stepX = width / (trendData.length - 1);
    const maxValue = Math.max(...trendData);
    const minValue = Math.min(...trendData);
    const range = maxValue - minValue || 1;

    trendData.forEach((value, index) => {
        const x = index * stepX;
        const y = height - ((value - minValue) / range) * height;

        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });

    ctx.stroke();

    // Add gradient fill
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#059669';
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
}

// Initialize charts
function initializeCharts() {
    console.log('Initializing charts...');
    console.log('Dashboard data:', dashboardData);

    try {
        // Revenue Chart
        initializeRevenueChart();

        // Performance Chart
        initializePerformanceChart();

        // Customer Growth Chart
        initializeCustomerGrowthChart();

        // Operational Chart
        initializeOperationalChart();

        // Market Analysis Chart
        initializeMarketAnalysisChart();

        console.log('Charts initialized successfully');
    } catch (error) {
        console.error('Error initializing charts:', error);
    }
}

// Initialize revenue chart
function initializeRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) {
        console.error('Revenue chart canvas not found');
        return;
    }

    const data = dashboardData.charts?.revenue || generateRevenueData('30d');
    console.log('Initializing revenue chart with data:', data);

    charts.revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Revenue',
                data: data.data,
                borderColor: '#059669',
                backgroundColor: 'rgba(5, 150, 105, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#059669',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
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
                    grid: {
                        color: '#f1f5f9'
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + (value / 1000) + 'K';
                        }
                    }
                },
                x: {
                    grid: {
                        color: '#f1f5f9'
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// Initialize performance chart
function initializePerformanceChart() {
    const ctx = document.getElementById('performanceChart');
    if (!ctx) {
        console.error('Performance chart canvas not found');
        return;
    }

    const data = dashboardData.charts?.performance || generatePerformanceData();
    console.log('Initializing performance chart with data:', data);

    charts.performanceChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.data,
                backgroundColor: data.colors,
                borderWidth: 0,
                hoverBorderWidth: 2,
                hoverBorderColor: '#ffffff'
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
            },
            cutout: '60%'
        }
    });
}

// Initialize customer growth chart
function initializeCustomerGrowthChart() {
    const ctx = document.getElementById('customerGrowthChart');
    if (!ctx) {
        console.error('Customer growth chart canvas not found');
        return;
    }

    const data = dashboardData.charts?.customerGrowth || generateCustomerGrowthData('30d');
    console.log('Initializing customer growth chart with data:', data);

    charts.customerGrowthChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'New Customers',
                data: data.newCustomers,
                backgroundColor: '#2563eb',
                borderRadius: 4
            }, {
                label: 'Retained Customers',
                data: data.retainedCustomers,
                backgroundColor: '#059669',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#f1f5f9'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Initialize operational chart
function initializeOperationalChart() {
    const ctx = document.getElementById('operationalChart');
    if (!ctx) {
        console.error('Operational chart canvas not found');
        return;
    }

    const data = dashboardData.charts?.operational || generateOperationalData();
    console.log('Initializing operational chart with data:', data);

    charts.operationalChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Efficiency %',
                data: data.efficiency,
                borderColor: '#059669',
                backgroundColor: 'rgba(5, 150, 105, 0.2)',
                borderWidth: 2
            }, {
                label: 'Productivity %',
                data: data.productivity,
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.2)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: '#f1f5f9'
                    }
                }
            }
        }
    });
}

// Initialize market analysis chart
function initializeMarketAnalysisChart() {
    const ctx = document.getElementById('marketAnalysisChart');
    if (!ctx) {
        console.error('Market analysis chart canvas not found');
        return;
    }

    const marketData = dashboardData.charts?.marketAnalysis || generateMarketAnalysisData();
    const data = marketData.marketShare;
    console.log('Initializing market analysis chart with data:', data);

    charts.marketAnalysisChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.data,
                backgroundColor: data.colors,
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                }
            }
        }
    });
}

// Update charts
function updateCharts() {
    // Update all charts with new data
    if (charts.revenueChart) {
        const revenueData = dashboardData.charts.revenue;
        charts.revenueChart.data.labels = revenueData.labels;
        charts.revenueChart.data.datasets[0].data = revenueData.data;
        charts.revenueChart.update();
    }

    if (charts.performanceChart) {
        const performanceData = dashboardData.charts.performance;
        charts.performanceChart.data.datasets[0].data = performanceData.data;
        charts.performanceChart.update();
    }

    if (charts.customerGrowthChart) {
        const customerData = dashboardData.charts.customerGrowth;
        charts.customerGrowthChart.data.labels = customerData.labels;
        charts.customerGrowthChart.data.datasets[0].data = customerData.newCustomers;
        charts.customerGrowthChart.data.datasets[1].data = customerData.retainedCustomers;
        charts.customerGrowthChart.update();
    }

    if (charts.operationalChart) {
        const operationalData = dashboardData.charts.operational;
        charts.operationalChart.data.datasets[0].data = operationalData.efficiency;
        charts.operationalChart.data.datasets[1].data = operationalData.productivity;
        charts.operationalChart.update();
    }

    if (charts.marketAnalysisChart) {
        const marketData = dashboardData.charts.marketAnalysis.marketShare;
        charts.marketAnalysisChart.data.datasets[0].data = marketData.data;
        charts.marketAnalysisChart.update();
    }
}

// Generate table data functions
function generateTopProductsData() {
    const products = [
        'Heavy Machinery Parts', 'Engine Components', 'Hydraulic Systems',
        'Electrical Components', 'Transmission Parts'
    ];

    return products.map((product, index) => ({
        product,
        revenue: Math.floor(Math.random() * 500000) + 100000,
        unitsSold: Math.floor(Math.random() * 1000) + 100,
        growth: (Math.random() * 30 - 5).toFixed(1),
        status: Math.random() > 0.3 ? 'active' : 'warning'
    }));
}

function generateKeyCustomersData() {
    const customers = [
        'Global Construction Corp', 'Industrial Solutions Ltd', 'Heavy Equipment Inc',
        'Manufacturing Giants', 'Construction Dynamics'
    ];

    return customers.map((customer, index) => ({
        customer,
        revenue: Math.floor(Math.random() * 1000000) + 200000,
        orders: Math.floor(Math.random() * 50) + 10,
        lastOrder: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        status: Math.random() > 0.2 ? 'active' : 'warning'
    }));
}

function generateRecentActivitiesData() {
    const activities = [
        'New order created', 'Customer payment received', 'Service completed',
        'Equipment delivered', 'Contract signed', 'Warranty claim processed'
    ];

    const users = ['John Smith', 'Sarah Johnson', 'Mike Wilson', 'Lisa Brown', 'David Lee'];

    return Array.from({ length: 10 }, (_, index) => ({
        time: new Date(Date.now() - index * 2 * 60 * 60 * 1000).toLocaleTimeString(),
        activity: activities[Math.floor(Math.random() * activities.length)],
        user: users[Math.floor(Math.random() * users.length)],
        status: Math.random() > 0.1 ? 'active' : 'warning'
    }));
}

function generateSystemAlertsData() {
    const alerts = [
        'Low inventory warning', 'Service due reminder', 'Payment overdue',
        'Equipment maintenance required', 'Contract renewal needed'
    ];

    const priorities = ['High', 'Medium', 'Low'];

    return Array.from({ length: 8 }, (_, index) => ({
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        alert: alerts[Math.floor(Math.random() * alerts.length)],
        time: new Date(Date.now() - index * 4 * 60 * 60 * 1000).toLocaleTimeString(),
        action: 'View Details'
    }));
}

// Update tables
function updateTables() {
    updateTopProductsTable();
    updateKeyCustomersTable();
    updateRecentActivitiesTable();
    updateSystemAlertsTable();
}

// Update individual tables
function updateTopProductsTable() {
    const table = document.getElementById('topProductsTable');
    if (!table) return;

    const tbody = table.querySelector('tbody');
    const data = dashboardData.tables.topProducts;

    tbody.innerHTML = '';

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.product}</td>
            <td>$${item.revenue.toLocaleString()}</td>
            <td>${item.unitsSold.toLocaleString()}</td>
            <td class="${item.growth >= 0 ? 'positive' : 'negative'}">${item.growth >= 0 ? '+' : ''}${item.growth}%</td>
            <td><span class="status-badge status-${item.status}">${item.status}</span></td>
        `;
        tbody.appendChild(row);
    });
}

function updateKeyCustomersTable() {
    const table = document.getElementById('keyCustomersTable');
    if (!table) return;

    const tbody = table.querySelector('tbody');
    const data = dashboardData.tables.keyCustomers;

    tbody.innerHTML = '';

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.customer}</td>
            <td>$${item.revenue.toLocaleString()}</td>
            <td>${item.orders}</td>
            <td>${item.lastOrder}</td>
            <td><span class="status-badge status-${item.status}">${item.status}</span></td>
        `;
        tbody.appendChild(row);
    });
}

function updateRecentActivitiesTable() {
    const table = document.getElementById('recentActivitiesTable');
    if (!table) return;

    const tbody = table.querySelector('tbody');
    const data = dashboardData.tables.recentActivities;

    tbody.innerHTML = '';

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.time}</td>
            <td>${item.activity}</td>
            <td>${item.user}</td>
            <td><span class="status-badge status-${item.status}">${item.status}</span></td>
        `;
        tbody.appendChild(row);
    });
}

function updateSystemAlertsTable() {
    const table = document.getElementById('systemAlertsTable');
    if (!table) return;

    const tbody = table.querySelector('tbody');
    const data = dashboardData.tables.systemAlerts;

    tbody.innerHTML = '';

    data.forEach(item => {
        const row = document.createElement('tr');
        const priorityClass = item.priority.toLowerCase() === 'high' ? 'critical' :
                             item.priority.toLowerCase() === 'medium' ? 'warning' : 'active';
        row.innerHTML = `
            <td><span class="status-badge status-${priorityClass}">${item.priority}</span></td>
            <td>${item.alert}</td>
            <td>${item.time}</td>
            <td><button class="action-btn secondary" onclick="handleAlert('${item.alert}')">${item.action}</button></td>
        `;
        tbody.appendChild(row);
    });
}

// Chart interaction functions
function updateChartPeriod(chartType, period) {
    console.log(`Updating ${chartType} chart for period: ${period}`);
    // Update chart buttons
    const chartContainer = document.getElementById(`${chartType}Chart`).closest('.chart-container');
    const buttons = chartContainer.querySelectorAll('.chart-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.period === period) {
            btn.classList.add('active');
        }
    });

    // Regenerate data for the new period
    if (chartType === 'revenue') {
        dashboardData.charts.revenue = generateRevenueData(period);
        updateCharts();
    }
}

function updateChartType(chartType, type) {
    console.log(`Updating ${chartType} chart type to: ${type}`);
    // Update chart buttons
    const chartContainer = document.getElementById(`${chartType}Chart`).closest('.chart-container');
    const buttons = chartContainer.querySelectorAll('.chart-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.chart === type || btn.dataset.type === type) {
            btn.classList.add('active');
        }
    });

    // Update chart type
    if (chartType === 'performance' && charts.performanceChart) {
        charts.performanceChart.config.type = type;
        charts.performanceChart.update();
    } else if (chartType === 'customerGrowth' && charts.customerGrowthChart) {
        charts.customerGrowthChart.config.type = type;
        charts.customerGrowthChart.update();
    }
}

function updateChartMetric(chartType, metric) {
    console.log(`Updating ${chartType} chart metric to: ${metric}`);
    // Update chart buttons
    const chartContainer = document.getElementById(`${chartType}Chart`).closest('.chart-container');
    const buttons = chartContainer.querySelectorAll('.chart-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.metric === metric) {
            btn.classList.add('active');
        }
    });
}

function updateChartView(chartType, view) {
    console.log(`Updating ${chartType} chart view to: ${view}`);
    // Update chart buttons
    const chartContainer = document.getElementById(`${chartType}Chart`).closest('.chart-container');
    const buttons = chartContainer.querySelectorAll('.chart-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.view === view) {
            btn.classList.add('active');
        }
    });

    // Update market analysis chart based on view
    if (chartType === 'marketAnalysis' && charts.marketAnalysisChart) {
        const marketData = dashboardData.charts.marketAnalysis;
        let newData;

        switch (view) {
            case 'market':
                newData = marketData.marketShare;
                charts.marketAnalysisChart.config.type = 'pie';
                break;
            case 'competitive':
                newData = {
                    labels: marketData.competitive.labels,
                    datasets: [{
                        label: 'Our Company',
                        data: marketData.competitive.ourCompany,
                        backgroundColor: '#059669'
                    }, {
                        label: 'Competitor',
                        data: marketData.competitive.competitor,
                        backgroundColor: '#94a3b8'
                    }]
                };
                charts.marketAnalysisChart.config.type = 'radar';
                break;
            case 'trends':
                newData = {
                    labels: marketData.trends.labels,
                    datasets: [{
                        label: 'Market Growth',
                        data: marketData.trends.marketGrowth,
                        borderColor: '#94a3b8',
                        backgroundColor: 'rgba(148, 163, 184, 0.1)'
                    }, {
                        label: 'Our Growth',
                        data: marketData.trends.ourGrowth,
                        borderColor: '#059669',
                        backgroundColor: 'rgba(5, 150, 105, 0.1)'
                    }]
                };
                charts.marketAnalysisChart.config.type = 'line';
                break;
        }

        if (newData) {
            charts.marketAnalysisChart.data = newData;
            charts.marketAnalysisChart.update();
        }
    }
}

// Navigation functions
function navigateToProducts() {
    console.log('Navigating to products page...');
    if (typeof NavigationUtils !== 'undefined') {
        NavigationUtils.navigateTo('party-details-advanced.html');
    } else {
        window.location.href = 'party-details-advanced.html';
    }
}

function navigateToCustomers() {
    console.log('Navigating to customers page...');
    if (typeof NavigationUtils !== 'undefined') {
        NavigationUtils.navigateTo('party-details-advanced.html');
    } else {
        window.location.href = 'party-details-advanced.html';
    }
}

function navigateToActivities() {
    console.log('Navigating to activities page...');
    if (typeof NavigationUtils !== 'undefined') {
        NavigationUtils.navigateTo('service-history.html');
    } else {
        window.location.href = 'service-history.html';
    }
}

function navigateToAlerts() {
    console.log('Navigating to alerts page...');
    showNotification('System alerts management coming soon!', 'info');
}

// Action functions
function refreshDashboard() {
    console.log('Refreshing dashboard...');
    showNotification('Refreshing dashboard data...', 'info');

    // Reload data
    loadDashboardData();

    setTimeout(() => {
        showNotification('Dashboard refreshed successfully!', 'success');
    }, 1000);
}

function exportDashboard() {
    console.log('Exporting dashboard...');
    showNotification('Preparing dashboard export...', 'info');

    // Simulate export process
    setTimeout(() => {
        showNotification('Dashboard exported successfully!', 'success');
    }, 2000);
}

function openSettings() {
    console.log('Opening dashboard settings...');
    showNotification('Dashboard settings coming soon!', 'info');
}

function openFilters() {
    console.log('Opening dashboard filters...');
    showNotification('Advanced filters coming soon!', 'info');
}

function generateReport() {
    console.log('Generating executive report...');
    showNotification('Generating comprehensive executive report...', 'info');

    setTimeout(() => {
        showNotification('Executive report generated successfully!', 'success');
    }, 3000);
}

function handleAlert(alertText) {
    console.log(`Handling alert: ${alertText}`);
    showNotification(`Processing alert: ${alertText}`, 'info');
}

// Auto-refresh functionality
function startAutoRefresh() {
    // Refresh every 5 minutes
    refreshInterval = setInterval(() => {
        console.log('Auto-refreshing dashboard data...');
        loadDashboardData();
    }, 5 * 60 * 1000);
}

function stopAutoRefresh() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
    }
}

// Utility functions
function showNotification(message, type = 'info') {
    console.log(`${type.toUpperCase()}: ${message}`);

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${type === 'success' ? '#059669' : type === 'error' ? '#dc2626' : '#2563eb'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Back button functionality
function goBack() {
    if (typeof NavigationUtils !== 'undefined') {
        NavigationUtils.goBack();
    } else {
        window.history.back();
    }
}

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    stopAutoRefresh();
});
