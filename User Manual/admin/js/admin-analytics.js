/**
 * Admin Analytics Module
 * Handles analytics data visualization and reporting
 */
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const adminTabs = document.querySelectorAll('.admin-tab');
    const tabContents = document.querySelectorAll('.admin-tab-content');
    const dateRangeButtons = document.querySelectorAll('.date-range-btn');
    const dateRangeCustom = document.querySelector('.date-range-custom');
    const chartActionButtons = document.querySelectorAll('.chart-action-btn');

    // Initialize analytics
    initAnalytics();

    /**
     * Initialize analytics components and event listeners
     */
    function initAnalytics() {
        // Set up tabs
        if (adminTabs.length > 0) {
            adminTabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    const tabId = this.dataset.tab;
                    switchTab(tabId);
                });
            });
        }

        // Set up date range buttons
        if (dateRangeButtons.length > 0) {
            dateRangeButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const range = this.dataset.range;
                    setDateRange(range);
                });
            });
        }

        // Set up chart action buttons
        if (chartActionButtons.length > 0) {
            chartActionButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const type = this.dataset.type;
                    const view = this.dataset.view;

                    // Update active state
                    const siblings = Array.from(this.parentElement.children);
                    siblings.forEach(sibling => sibling.classList.remove('active'));
                    this.classList.add('active');

                    // Update chart based on type or view
                    if (type) {
                        updateChartByType(type);
                    } else if (view) {
                        updateChartView(view);
                    }
                });
            });
        }

        // Initialize charts
        initCharts();
    }

    /**
     * Switch between tabs
     * @param {string} tabId - ID of the tab to switch to
     */
    function switchTab(tabId) {
        // Update active tab
        adminTabs.forEach(tab => {
            if (tab.dataset.tab === tabId) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        // Update active content
        tabContents.forEach(content => {
            if (content.id === tabId) {
                content.classList.add('active');

                // Animate content in
                content.style.animation = 'fadeIn 0.3s ease';
            } else {
                content.classList.remove('active');
            }
        });
    }

    /**
     * Set date range for analytics
     * @param {string} range - Date range to set
     */
    function setDateRange(range) {
        // Update active button
        dateRangeButtons.forEach(button => {
            if (button.dataset.range === range) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });

        // Show/hide custom date range inputs
        if (range === 'custom') {
            dateRangeCustom.style.display = 'flex';
        } else {
            dateRangeCustom.style.display = 'none';

            // Update charts based on range
            updateChartsForDateRange(range);
        }
    }

    /**
     * Update charts based on date range
     * @param {string} range - Date range
     */
    function updateChartsForDateRange(range) {
        // In a real application, this would fetch data for the selected range
        // For demo purposes, we'll just show a notification
        showNotification(`Updated charts for ${range === '7' ? 'last 7 days' : range === '30' ? 'last 30 days' : 'last 90 days'}`, 'info');

        // Update charts with new data
        updatePageViewsChart(range);
        updateTopPagesChart(range);
        updateEngagementChart(range);
    }

    /**
     * Update chart based on type (day, week, month)
     * @param {string} type - Chart type
     */
    function updateChartByType(type) {
        // In a real application, this would update the chart with data for the selected type
        // For demo purposes, we'll just show a notification
        showNotification(`Updated chart to show ${type} view`, 'info');

        // Update page views chart based on type
        updatePageViewsChart(null, type);
    }

    /**
     * Update chart view (table or chart)
     * @param {string} view - View type
     */
    function updateChartView(view) {
        // In a real application, this would switch between table and chart views
        // For demo purposes, we'll just show a notification
        showNotification(`Switched to ${view} view`, 'info');
    }

    /**
     * Initialize charts
     */
    function initCharts() {
        // Initialize page views chart
        initPageViewsChart();

        // Initialize top pages chart
        initTopPagesChart();

        // Initialize engagement chart
        initEngagementChart();

        // Initialize tenant usage chart
        initTenantUsageChart();

        // Initialize locale usage chart
        initLocaleUsageChart();

        // Initialize documentation type chart
        initDocTypeChart();

        // Initialize top documentation chart
        initTopDocsChart();
    }

    /**
     * Initialize page views chart
     */
    function initPageViewsChart() {
        const ctx = document.getElementById('pageViewsChart');

        if (ctx) {
            // Set chart options
            const options = {
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
            };

            // Create chart
            window.pageViewsChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                        label: 'Page Views',
                        data: [1200, 1900, 1500, 2000, 1800, 1200, 1400],
                        borderColor: '#2196F3',
                        backgroundColor: 'rgba(33, 150, 243, 0.1)',
                        borderWidth: 2,
                        tension: 0.3,
                        fill: true
                    }, {
                        label: 'Unique Visitors',
                        data: [800, 1200, 950, 1300, 1100, 700, 900],
                        borderColor: '#4CAF50',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        borderWidth: 2,
                        tension: 0.3,
                        fill: true
                    }]
                },
                options: options
            });
        }
    }

    /**
     * Update page views chart
     * @param {string} range - Date range
     * @param {string} type - Chart type (day, week, month)
     */
    function updatePageViewsChart(range, type) {
        if (window.pageViewsChart) {
            // In a real application, this would fetch new data based on range and type
            // For demo purposes, we'll just update with random data

            let labels = [];
            let pageViewsData = [];
            let visitorsData = [];

            if (type === 'day') {
                labels = ['12am', '3am', '6am', '9am', '12pm', '3pm', '6pm', '9pm'];
                pageViewsData = [200, 150, 100, 350, 450, 500, 400, 300];
                visitorsData = [120, 80, 60, 200, 300, 350, 250, 180];
            } else if (type === 'month') {
                labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
                pageViewsData = [5000, 6200, 5800, 6500];
                visitorsData = [3200, 3800, 3500, 4000];
            } else {
                // Default to week view
                labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

                // Generate random data based on range
                if (range === '30') {
                    pageViewsData = [1500, 2200, 1800, 2400, 2100, 1500, 1700];
                    visitorsData = [1000, 1400, 1150, 1600, 1300, 900, 1100];
                } else if (range === '90') {
                    pageViewsData = [1800, 2500, 2100, 2700, 2400, 1800, 2000];
                    visitorsData = [1200, 1600, 1350, 1800, 1500, 1100, 1300];
                } else {
                    pageViewsData = [1200, 1900, 1500, 2000, 1800, 1200, 1400];
                    visitorsData = [800, 1200, 950, 1300, 1100, 700, 900];
                }
            }

            // Update chart data
            window.pageViewsChart.data.labels = labels;
            window.pageViewsChart.data.datasets[0].data = pageViewsData;
            window.pageViewsChart.data.datasets[1].data = visitorsData;

            // Update chart
            window.pageViewsChart.update();
        }
    }

    /**
     * Initialize top pages chart
     */
    function initTopPagesChart() {
        const ctx = document.getElementById('topPagesChart');

        if (ctx) {
            // Create chart
            window.topPagesChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Getting Started', 'Managing Orders', 'System Requirements', 'User Roles', 'Interface'],
                    datasets: [{
                        label: 'Page Views',
                        data: [2547, 1982, 1654, 1432, 1254],
                        backgroundColor: [
                            'rgba(33, 150, 243, 0.7)',
                            'rgba(33, 150, 243, 0.6)',
                            'rgba(33, 150, 243, 0.5)',
                            'rgba(33, 150, 243, 0.4)',
                            'rgba(33, 150, 243, 0.3)'
                        ],
                        borderColor: [
                            'rgba(33, 150, 243, 1)',
                            'rgba(33, 150, 243, 1)',
                            'rgba(33, 150, 243, 1)',
                            'rgba(33, 150, 243, 1)',
                            'rgba(33, 150, 243, 1)'
                        ],
                        borderWidth: 1
                    }]
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
                            display: false
                        }
                    }
                }
            });
        }
    }

    /**
     * Update top pages chart
     * @param {string} range - Date range
     */
    function updateTopPagesChart(range) {
        if (window.topPagesChart) {
            // In a real application, this would fetch new data based on range
            // For demo purposes, we'll just update with random data

            let data = [];

            if (range === '30') {
                data = [3200, 2500, 2100, 1800, 1600];
            } else if (range === '90') {
                data = [8500, 7200, 6300, 5400, 4800];
            } else {
                data = [2547, 1982, 1654, 1432, 1254];
            }

            // Update chart data
            window.topPagesChart.data.datasets[0].data = data;

            // Update chart
            window.topPagesChart.update();
        }
    }

    /**
     * Initialize engagement chart
     */
    function initEngagementChart() {
        const ctx = document.getElementById('engagementChart');

        if (ctx) {
            // Create chart
            window.engagementChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['< 1 min', '1-3 min', '3-5 min', '5-10 min', '> 10 min'],
                    datasets: [{
                        data: [15, 30, 25, 20, 10],
                        backgroundColor: [
                            'rgba(244, 67, 54, 0.7)',
                            'rgba(255, 152, 0, 0.7)',
                            'rgba(255, 235, 59, 0.7)',
                            'rgba(76, 175, 80, 0.7)',
                            'rgba(33, 150, 243, 0.7)'
                        ],
                        borderColor: [
                            'rgba(244, 67, 54, 1)',
                            'rgba(255, 152, 0, 1)',
                            'rgba(255, 235, 59, 1)',
                            'rgba(76, 175, 80, 1)',
                            'rgba(33, 150, 243, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right'
                        }
                    }
                }
            });
        }
    }

    /**
     * Update engagement chart
     * @param {string} range - Date range
     */
    function updateEngagementChart(range) {
        if (window.engagementChart) {
            // In a real application, this would fetch new data based on range
            // For demo purposes, we'll just update with random data

            let data = [];

            if (range === '30') {
                data = [12, 28, 30, 22, 8];
            } else if (range === '90') {
                data = [10, 25, 35, 20, 10];
            } else {
                data = [15, 30, 25, 20, 10];
            }

            // Update chart data
            window.engagementChart.data.datasets[0].data = data;

            // Update chart
            window.engagementChart.update();
        }
    }

    /**
     * Initialize tenant usage chart
     */
    function initTenantUsageChart() {
        const ctx = document.getElementById('tenantUsageChart');

        if (ctx) {
            // Create chart
            window.tenantUsageChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Global', 'Acme Corp', 'Global Ent', 'Springfield Gov', 'Tech Solutions'],
                    datasets: [{
                        label: 'Page Views',
                        data: [5200, 3800, 2900, 1700, 1200],
                        backgroundColor: 'rgba(33, 150, 243, 0.7)',
                        borderColor: 'rgba(33, 150, 243, 1)',
                        borderWidth: 1
                    }, {
                        label: 'Unique Visitors',
                        data: [3100, 2200, 1800, 950, 750],
                        backgroundColor: 'rgba(76, 175, 80, 0.7)',
                        borderColor: 'rgba(76, 175, 80, 1)',
                        borderWidth: 1
                    }]
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

            // Set up tenant content select event listener
            const tenantContentSelect = document.getElementById('tenant-content-select');
            if (tenantContentSelect) {
                tenantContentSelect.addEventListener('change', updateTenantContent);
            }
        }
    }

    /**
     * Update tenant content based on selected tenant
     */
    function updateTenantContent() {
        const tenantContentSelect = document.getElementById('tenant-content-select');
        if (!tenantContentSelect) return;

        const tenant = tenantContentSelect.value;

        // In a real application, this would fetch data for the selected tenant
        // For demo purposes, we'll just show a notification
        showNotification(`Updated content for ${tenant === 'all' ? 'all tenants' : tenant}`, 'info');
    }

    /**
     * Initialize locale usage chart
     */
    function initLocaleUsageChart() {
        const ctx = document.getElementById('localeUsageChart');

        if (ctx) {
            // Create chart
            window.localeUsageChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['English (US)', 'German', 'French', 'Japanese', 'Spanish'],
                    datasets: [{
                        data: [45, 20, 15, 12, 8],
                        backgroundColor: [
                            'rgba(33, 150, 243, 0.7)',
                            'rgba(76, 175, 80, 0.7)',
                            'rgba(255, 152, 0, 0.7)',
                            'rgba(156, 39, 176, 0.7)',
                            'rgba(244, 67, 54, 0.7)'
                        ],
                        borderColor: [
                            'rgba(33, 150, 243, 1)',
                            'rgba(76, 175, 80, 1)',
                            'rgba(255, 152, 0, 1)',
                            'rgba(156, 39, 176, 1)',
                            'rgba(244, 67, 54, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `${context.label}: ${context.raw}%`;
                                }
                            }
                        }
                    }
                }
            });

            // Set up locale content select event listener
            const localeContentSelect = document.getElementById('locale-content-select');
            if (localeContentSelect) {
                localeContentSelect.addEventListener('change', updateLocaleContent);
            }
        }
    }

    /**
     * Initialize documentation type chart
     */
    function initDocTypeChart() {
        const ctx = document.getElementById('docTypeChart');

        if (ctx) {
            // Create chart
            window.docTypeChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Complete User Manual', 'OMS Module', 'Finance Module', 'HR Module', 'Inventory Module', 'CRM Module'],
                    datasets: [{
                        data: [35, 20, 15, 10, 12, 8],
                        backgroundColor: [
                            'rgba(33, 150, 243, 0.7)',
                            'rgba(76, 175, 80, 0.7)',
                            'rgba(255, 152, 0, 0.7)',
                            'rgba(156, 39, 176, 0.7)',
                            'rgba(244, 67, 54, 0.7)',
                            'rgba(255, 193, 7, 0.7)'
                        ],
                        borderColor: [
                            'rgba(33, 150, 243, 1)',
                            'rgba(76, 175, 80, 1)',
                            'rgba(255, 152, 0, 1)',
                            'rgba(156, 39, 176, 1)',
                            'rgba(244, 67, 54, 1)',
                            'rgba(255, 193, 7, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `${context.label}: ${context.raw}%`;
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    /**
     * Initialize top documentation chart
     */
    function initTopDocsChart() {
        const ctx = document.getElementById('topDocsChart');

        if (ctx) {
            // Create chart
            window.topDocsChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['User Roles', 'Order Processing', 'System Setup', 'Reporting', 'Inventory Management'],
                    datasets: [{
                        label: 'Views',
                        data: [1432, 1254, 1102, 987, 854],
                        backgroundColor: 'rgba(33, 150, 243, 0.7)',
                        borderColor: 'rgba(33, 150, 243, 1)',
                        borderWidth: 1
                    }]
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
                            display: false
                        }
                    }
                }
            });
        }
    }

    /**
     * Update locale content based on selected locale
     */
    function updateLocaleContent() {
        const localeContentSelect = document.getElementById('locale-content-select');
        if (!localeContentSelect) return;

        const locale = localeContentSelect.value;

        // In a real application, this would fetch data for the selected locale
        // For demo purposes, we'll just show a notification
        showNotification(`Updated content for ${locale === 'all' ? 'all locales' : locale}`, 'info');
    }

    /**
     * Show notification message
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, error, warning, info)
     */
    function showNotification(message, type = 'info') {
        // Create notification element if it doesn't exist
        let notificationContainer = document.querySelector('.notification-container');

        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.className = 'notification-container';
            notificationContainer.style.position = 'fixed';
            notificationContainer.style.top = '20px';
            notificationContainer.style.right = '20px';
            notificationContainer.style.zIndex = '9999';
            document.body.appendChild(notificationContainer);
        }

        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;

        // Set notification styles
        notification.style.backgroundColor = type === 'success' ? '#4CAF50' :
                                            type === 'error' ? '#F44336' :
                                            type === 'warning' ? '#FF9800' : '#2196F3';
        notification.style.color = 'white';
        notification.style.padding = '12px 20px';
        notification.style.marginBottom = '10px';
        notification.style.borderRadius = '4px';
        notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        notification.style.display = 'flex';
        notification.style.alignItems = 'center';
        notification.style.justifyContent = 'space-between';
        notification.style.animation = 'slideInLeft 0.3s ease forwards';
        notification.style.opacity = '0';

        // Set notification icon
        const icon = type === 'success' ? 'check-circle' :
                    type === 'error' ? 'exclamation-circle' :
                    type === 'warning' ? 'exclamation-triangle' : 'info-circle';

        // Set notification content
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-${icon}"></i>
                <span>${message}</span>
            </div>
            <button class="close-notification" style="background: none; border: none; color: white; cursor: pointer;">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add notification to container
        notificationContainer.appendChild(notification);

        // Add close button event listener
        const closeButton = notification.querySelector('.close-notification');
        closeButton.addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => {
                notification.remove();
            }, 300);
        });

        // Auto-remove notification after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease forwards';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 5000);
    }
});
