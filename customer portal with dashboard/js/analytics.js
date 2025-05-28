/**
 * Analytics Module
 * Handles real-time chart generation and updates for the analytics page
 */

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Analytics module loaded');

    // Replace chart placeholders with canvas elements immediately
    replaceChartPlaceholders();

    // First try to use the Chart.js that should be loaded in the HTML
    if (window.Chart) {
        console.log('Chart.js already available from HTML');
        initChartsWithRetry();
    } else {
        console.log('Chart.js not found in window, attempting to load dynamically');
        // Load Chart.js from CDN
        loadChartJS().then(() => {
            console.log('Chart.js loaded successfully');
            initChartsWithRetry();
        }).catch(error => {
            console.error('Failed to load Chart.js:', error);
            // Show error message in chart containers
            showChartLoadError();
        });
    }

    // Ensure theme is applied to all elements
    ensureThemeConsistency();
});

// Listen for the polyfill ready event
document.addEventListener('chartjs-polyfill-ready', function() {
    console.log('Chart.js polyfill is ready, initializing charts with fallback data');
    initChartsWithRetry();
});

/**
 * Ensure theme consistency across all elements
 */
function ensureThemeConsistency() {
    // Get current theme
    let currentTheme = 'default';
    try {
        if (typeof getUserPreference === 'function') {
            currentTheme = getUserPreference('dashboardTheme', 'default');
        } else {
            // Fallback to checking body class
            if (document.body.classList.contains('dark-mode')) {
                currentTheme = 'dark';
            }
        }
    } catch (e) {
        console.error('Error getting theme preference:', e);
    }

    const isDarkMode = currentTheme === 'dark';

    if (isDarkMode) {
        // Force dark mode on all elements
        document.querySelectorAll('.analytics-card, .analytics-filter, .analytics-chart, .analytics-content').forEach(el => {
            el.classList.add('dark-mode-element');
        });

        // Add a style tag for additional dark mode fixes
        const styleTag = document.createElement('style');
        styleTag.textContent = `
            .dark-mode-element {
                background-color: var(--widget-bg) !important;
                color: var(--text-color) !important;
                border-color: var(--border-color) !important;
            }
            .dark-mode .analytics-card p {
                color: var(--text-color) !important;
            }
            .dark-mode canvas {
                background-color: var(--widget-bg) !important;
            }
            .dark-mode .global-chart-error .error-content {
                background-color: var(--widget-bg) !important;
                color: var(--text-color) !important;
            }
            .dark-mode .error-content p {
                color: var(--text-color) !important;
            }
            .dark-mode .fallback-data {
                background-color: var(--widget-bg) !important;
                color: var(--text-color) !important;
            }
            .dark-mode .fallback-content th, .dark-mode .fallback-content td {
                border-color: var(--border-color) !important;
            }
            .dark-mode .fallback-content th {
                background-color: var(--hover-bg) !important;
            }
        `;
        document.head.appendChild(styleTag);

        // Update chart colors for dark mode if Chart.js is available
        if (typeof Chart !== 'undefined') {
            try {
                Chart.defaults.color = '#ffffff';
                Chart.defaults.borderColor = '#333333';

                // Update existing charts if they exist
                if (window.ticketVolumeChart && typeof window.ticketVolumeChart.update === 'function') {
                    window.ticketVolumeChart.update();
                }

                // We'll ignore the TypeScript errors for these properties since we know they exist at runtime
                if (window.resolutionTimeChart && typeof window.resolutionTimeChart.update === 'function') {
                    window.resolutionTimeChart.update();
                }

                if (window.documentActivityChart && typeof window.documentActivityChart.update === 'function') {
                    window.documentActivityChart.update();
                }

                if (window.userActivityChart && typeof window.userActivityChart.update === 'function') {
                    window.userActivityChart.update();
                }
            } catch (e) {
                console.error('Error updating chart colors for dark mode:', e);
            }
        }
    }
}

// Initialize charts with retry mechanism
function initChartsWithRetry(retryCount = 0) {
    console.log(`Attempting to initialize charts (attempt ${retryCount + 1})`);

    // Check if Chart.js is actually available
    if (!window.Chart) {
        console.error('Chart.js not available in window object');

        if (retryCount < 3) {
            console.log(`Retrying in 1 second (${retryCount + 1}/3)`);
            setTimeout(() => initChartsWithRetry(retryCount + 1), 1000);
        } else {
            console.error('Maximum retry attempts reached');
            showChartLoadError();
        }
        return;
    }

    try {
        // Initialize charts with a slight delay to ensure DOM is ready
        setTimeout(() => {
            initializeCharts();

            // Set up real-time updates
            setupRealTimeUpdates();
        }, 500);
    } catch (error) {
        console.error('Error initializing charts:', error);

        if (retryCount < 3) {
            console.log(`Retrying in 1 second (${retryCount + 1}/3)`);
            setTimeout(() => initChartsWithRetry(retryCount + 1), 1000);
        } else {
            console.error('Maximum retry attempts reached');
            showChartLoadError();
        }
    }
}

// Load Chart.js from CDN
function loadChartJS() {
    return new Promise((resolve, reject) => {
        // Check if Chart.js is already loaded
        if (window.Chart) {
            console.log('Chart.js already loaded, using existing instance');
            resolve();
            return;
        }

        console.log('Loading Chart.js dynamically');

        // Create script element
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js';

        // Remove integrity and crossOrigin to avoid potential issues
        // script.integrity = 'sha256-+8RZJLOWWrKgmQT4HlCkb1ROgZCaLZgqE9iAaP5zoGI=';
        // script.crossOrigin = 'anonymous';

        // Set up load and error handlers
        script.onload = () => {
            console.log('Chart.js loaded successfully via dynamic script');
            resolve();
        };

        script.onerror = (error) => {
            console.error('Failed to load Chart.js dynamically:', error);
            reject(new Error('Failed to load Chart.js'));
        };

        // Add to document
        document.head.appendChild(script);

        // Set a timeout to reject if loading takes too long
        setTimeout(() => {
            if (!window.Chart) {
                console.error('Chart.js loading timed out');
                reject(new Error('Chart.js loading timed out'));
            }
        }, 5000);
    });
}

// Replace chart placeholders with canvas elements
function replaceChartPlaceholders() {
    console.log('Replacing chart placeholders');
    const chartPlaceholders = document.querySelectorAll('.chart-placeholder');
    console.log(`Found ${chartPlaceholders.length} chart placeholders`);

    chartPlaceholders.forEach((placeholder, index) => {
        const canvas = document.createElement('canvas');
        canvas.id = 'chart-' + index;
        canvas.width = 400;
        canvas.height = 200;
        canvas.style.width = '100%';
        canvas.style.height = '100%';

        // Add loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'chart-loading';
        loadingDiv.innerHTML = '<div class="spinner"></div><p>Loading chart data...</p>';

        // Replace placeholder with canvas and add loading indicator
        placeholder.parentNode.replaceChild(canvas, placeholder);
        canvas.parentNode.appendChild(loadingDiv);

        console.log(`Replaced placeholder with canvas id: ${canvas.id}`);
    });
}

// Show error message when chart loading fails
function showChartLoadError() {
    const chartContainers = document.querySelectorAll('.analytics-card');
    chartContainers.forEach(container => {
        const content = container.querySelector('.analytics-content');
        if (!content) return;

        // Remove loading indicator if exists
        const loadingDiv = content.querySelector('.chart-loading');
        if (loadingDiv) {
            loadingDiv.remove();
        }

        // Try to show fallback data first
        const placeholder = content.querySelector('.chart-placeholder');
        const fallbackData = placeholder?.querySelector('.fallback-data');

        if (fallbackData) {
            // Show fallback data
            fallbackData.style.display = 'block';

            // Style the fallback data
            const style = document.createElement('style');
            style.textContent = `
                .fallback-data {
                    width: 100%;
                    padding: 15px;
                    background-color: #f9f9f9;
                    border-radius: 8px;
                }

                .fallback-title {
                    font-weight: bold;
                    font-size: 16px;
                    margin-bottom: 10px;
                    text-align: center;
                }

                .fallback-content table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .fallback-content th, .fallback-content td {
                    padding: 8px;
                    text-align: center;
                    border-bottom: 1px solid #ddd;
                }

                .fallback-content th {
                    background-color: #f2f2f2;
                }
            `;
            document.head.appendChild(style);
        } else {
            // Show error message if no fallback data
            const errorDiv = document.createElement('div');
            errorDiv.className = 'chart-error';
            errorDiv.innerHTML = '<i class="fas fa-exclamation-triangle"></i><p>Failed to load chart. Please refresh the page.</p>';
            content.appendChild(errorDiv);
        }
    });

    // Add a refresh button at the top of the page
    const refreshButton = document.createElement('div');
    refreshButton.className = 'refresh-charts-button';
    refreshButton.innerHTML = '<button class="btn-primary"><i class="fas fa-sync-alt"></i> Refresh Charts</button>';
    refreshButton.style.textAlign = 'center';
    refreshButton.style.margin = '20px 0';

    const container = document.querySelector('.analytics-container');
    if (container) {
        container.parentNode.insertBefore(refreshButton, container);

        // Add click event
        refreshButton.querySelector('button').addEventListener('click', function() {
            location.reload();
        });
    }
}

// Initialize all charts
function initializeCharts() {
    console.log('Initializing charts');

    // Remove loading indicators
    document.querySelectorAll('.chart-loading').forEach(loader => {
        loader.remove();
    });

    // Initialize each chart and track success
    let successCount = 0;
    let totalCharts = 4;

    // Try to initialize each chart and count successes
    if (initializeTicketVolumeChart()) successCount++;
    if (initializeResolutionTimeChart()) successCount++;
    if (initializeDocumentActivityChart()) successCount++;
    if (initializeUserActivityChart()) successCount++;

    // Log results
    console.log(`Charts initialized: ${successCount}/${totalCharts}`);

    // If no charts were successfully initialized, show a global error
    if (successCount === 0) {
        console.error('Failed to initialize any charts');
        showGlobalChartError();
        return false;
    }

    return true;
}

// Show a global error message for all charts
function showGlobalChartError() {
    // Create error overlay
    const errorOverlay = document.createElement('div');
    errorOverlay.className = 'global-chart-error';
    errorOverlay.innerHTML = `
        <div class="error-content">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Chart Loading Error</h3>
            <p>There was a problem loading the analytics charts. Please try refreshing the page.</p>
            <button id="reload-charts-btn" class="btn-primary">Reload Charts</button>
        </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .global-chart-error {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }

        .error-content {
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            text-align: center;
            max-width: 400px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }

        .error-content i {
            font-size: 48px;
            color: #e74c3c;
            margin-bottom: 20px;
        }

        .error-content h3 {
            margin-bottom: 15px;
            font-size: 24px;
        }

        .error-content p {
            margin-bottom: 20px;
            color: #666;
        }

        #reload-charts-btn {
            padding: 10px 20px;
        }
    `;

    // Add to document
    document.head.appendChild(style);
    document.body.appendChild(errorOverlay);

    // Add event listener to reload button
    const reloadBtn = document.getElementById('reload-charts-btn');
    if (reloadBtn) {
        reloadBtn.addEventListener('click', function() {
            errorOverlay.remove();
            initChartsWithRetry(0);
        });
    }
}

// Helper function to show chart error
function showChartError(container, message) {
    console.error('Chart error:', message);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'chart-error';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i><p>${message}</p>`;

    // Remove loading indicator if exists
    const loadingDiv = container.querySelector('.chart-loading');
    if (loadingDiv) {
        loadingDiv.remove();
    }

    container.appendChild(errorDiv);
}

// Initialize Ticket Volume Chart (Line Chart)
function initializeTicketVolumeChart() {
    console.log('Initializing Ticket Volume Chart');

    // Make sure Chart.js is available
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not available');
        return false;
    }

    // Find the container and create canvas if needed
    const container = document.querySelector('.analytics-card:nth-child(1) .analytics-content');
    if (!container) {
        console.error('Ticket Volume Chart container not found');
        return false;
    }

    // Clear any existing content
    let canvas = container.querySelector('canvas');
    if (canvas) {
        // If canvas exists but we're reinitializing, destroy any existing chart
        if (window.ticketVolumeChart) {
            window.ticketVolumeChart.destroy();
            window.ticketVolumeChart = null;
        }
    } else {
        // Create new canvas
        canvas = document.createElement('canvas');
        canvas.id = 'ticket-volume-chart';
        canvas.width = 400;
        canvas.height = 200;

        // Remove placeholder if it exists
        const placeholder = container.querySelector('.chart-placeholder');
        if (placeholder) {
            container.removeChild(placeholder);
        }

        // Add canvas to container
        container.appendChild(canvas);
    }

    // Remove any loading or error messages
    const loadingEl = container.querySelector('.chart-loading');
    if (loadingEl) loadingEl.remove();

    const errorEl = container.querySelector('.chart-error');
    if (errorEl) errorEl.remove();

    try {
        // Generate data for demonstration
        const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        // Use fixed data for reliability
        const tempData1 = [25, 30, 22, 28, 35, 40, 38, 45, 48, 50, 55, 60];
        const tempData2 = [20, 25, 18, 24, 30, 35, 32, 40, 42, 45, 48, 52];

        const data = {
            labels: labels,
            datasets: [{
                label: 'New Tickets',
                data: tempData1,
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Resolved Tickets',
                data: tempData2,
                borderColor: '#2ecc71',
                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                tension: 0.4,
                fill: true
            }]
        };

        // Create chart with minimal options first
        const ctx = canvas.getContext('2d');
        const ticketVolumeChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false // Disable animation initially for faster rendering
            }
        });

        // Store chart in window object for later updates
        window.ticketVolumeChart = ticketVolumeChart;
        console.log('Ticket Volume Chart created successfully');

        // Update with full options after a short delay
        setTimeout(() => {
            if (window.ticketVolumeChart) {
                window.ticketVolumeChart.options = {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: false
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false
                        },
                        legend: {
                            position: 'top',
                            labels: {
                                usePointStyle: true,
                                boxWidth: 6
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                drawBorder: false
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    },
                    animation: {
                        duration: 1000,
                        easing: 'easeOutQuart'
                    }
                };
                window.ticketVolumeChart.update();
            }
        }, 100);

        return true;
    } catch (error) {
        console.error('Failed to create Ticket Volume Chart:', error);
        showChartError(container, 'Failed to create chart. Please refresh the page.');
        return false;
    }
}

// Initialize Resolution Time Chart (Bar Chart)
function initializeResolutionTimeChart() {
    console.log('Initializing Resolution Time Chart');
    const container = document.querySelector('.analytics-card:nth-child(2) .analytics-content');
    const canvas = container?.querySelector('canvas');

    if (!canvas) {
        console.error('Resolution Time Chart canvas not found');
        if (container) {
            showChartError(container, 'Chart canvas not found');
        }
        return;
    }

    try {
        // Use fixed data for demonstration
        const labels = ['Critical', 'High', 'Medium', 'Low'];
        const data = {
            labels: labels,
            datasets: [{
                label: 'Average Resolution Time (hours)',
                data: [2.5, 5.8, 12.3, 24.7],
                backgroundColor: [
                    'rgba(231, 76, 60, 0.7)',
                    'rgba(241, 196, 15, 0.7)',
                    'rgba(52, 152, 219, 0.7)',
                    'rgba(46, 204, 113, 0.7)'
                ],
                borderColor: [
                    'rgb(231, 76, 60)',
                    'rgb(241, 196, 15)',
                    'rgb(52, 152, 219)',
                    'rgb(46, 204, 113)'
                ],
                borderWidth: 1
            }]
        };

        // Create chart
        const resolutionTimeChart = new Chart(canvas, {
            type: 'bar',
            data: data,
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
                        title: {
                            display: true,
                            text: 'Hours'
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        });

        // Store chart in window object for later updates
        window.resolutionTimeChart = resolutionTimeChart;
        console.log('Resolution Time Chart created successfully');
    } catch (error) {
        console.error('Failed to create Resolution Time Chart:', error);
        showChartError(container, 'Failed to create chart. Please refresh the page.');
    }
}

// Initialize Document Activity Chart (Area Chart)
function initializeDocumentActivityChart() {
    console.log('Initializing Document Activity Chart');
    const container = document.querySelector('.analytics-card:nth-child(3) .analytics-content');
    const canvas = container?.querySelector('canvas');

    if (!canvas) {
        console.error('Document Activity Chart canvas not found');
        if (container) {
            showChartError(container, 'Chart canvas not found');
        }
        return;
    }

    try {
        // Use fixed data for demonstration
        const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

        // Fixed data instead of random
        const uploadsData = [15, 22, 18, 25];
        const downloadsData = [45, 58, 65, 70];
        const viewsData = [80, 95, 88, 105];

        const data = {
            labels: labels,
            datasets: [{
                label: 'Uploads',
                data: uploadsData,
                borderColor: '#9b59b6',
                backgroundColor: 'rgba(155, 89, 182, 0.2)',
                fill: true
            }, {
                label: 'Downloads',
                data: downloadsData,
                borderColor: '#f39c12',
                backgroundColor: 'rgba(243, 156, 18, 0.2)',
                fill: true
            }, {
                label: 'Views',
                data: viewsData,
                borderColor: '#1abc9c',
                backgroundColor: 'rgba(26, 188, 156, 0.2)',
                fill: true
            }]
        };

        // Create chart
        const documentActivityChart = new Chart(canvas, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    filler: {
                        propagate: false
                    },
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        });

        // Store chart in window object for later updates
        window.documentActivityChart = documentActivityChart;
        console.log('Document Activity Chart created successfully');
    } catch (error) {
        console.error('Failed to create Document Activity Chart:', error);
        showChartError(container, 'Failed to create chart. Please refresh the page.');
    }
}

// Initialize User Activity Chart (Pie Chart)
function initializeUserActivityChart() {
    console.log('Initializing User Activity Chart');
    const container = document.querySelector('.analytics-card:nth-child(4) .analytics-content');
    const canvas = container?.querySelector('canvas');

    if (!canvas) {
        console.error('User Activity Chart canvas not found');
        if (container) {
            showChartError(container, 'Chart canvas not found');
        }
        return;
    }

    try {
        // Fixed data for demonstration
        const data = {
            labels: ['Dashboard', 'Knowledge Base', 'Tickets', 'Documents', 'Account'],
            datasets: [{
                data: [30, 25, 20, 15, 10],
                backgroundColor: [
                    'rgba(52, 152, 219, 0.7)',
                    'rgba(46, 204, 113, 0.7)',
                    'rgba(155, 89, 182, 0.7)',
                    'rgba(241, 196, 15, 0.7)',
                    'rgba(231, 76, 60, 0.7)'
                ],
                borderColor: [
                    'rgb(52, 152, 219)',
                    'rgb(46, 204, 113)',
                    'rgb(155, 89, 182)',
                    'rgb(241, 196, 15)',
                    'rgb(231, 76, 60)'
                ],
                borderWidth: 1
            }]
        };

        // Create chart
        const userActivityChart = new Chart(canvas, {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                },
                animation: {
                    duration: 1000,
                    animateRotate: true,
                    animateScale: true
                }
            }
        });

        // Store chart in window object for later updates
        window.userActivityChart = userActivityChart;
        console.log('User Activity Chart created successfully');
    } catch (error) {
        console.error('Failed to create User Activity Chart:', error);
        showChartError(container, 'Failed to create chart. Please refresh the page.');
    }
}

// Set up real-time updates for charts
function setupRealTimeUpdates() {
    console.log('Setting up real-time updates');

    // Update charts every 5 seconds
    const updateInterval = setInterval(() => {
        try {
            updateTicketVolumeChart();
            updateResolutionTimeChart();
            updateDocumentActivityChart();
            updateUserActivityChart();
            console.log('Charts updated successfully');
        } catch (error) {
            console.error('Error updating charts:', error);
            // If there's a persistent error, stop the interval
            if (window.chartUpdateErrorCount === undefined) {
                window.chartUpdateErrorCount = 1;
            } else {
                window.chartUpdateErrorCount++;
            }

            // If we've had 5 consecutive errors, stop trying to update
            if (window.chartUpdateErrorCount >= 5) {
                console.error('Too many chart update errors, stopping real-time updates');
                clearInterval(updateInterval);
            }
        }
    }, 5000);

    // Store interval ID in window object so it can be cleared if needed
    window.chartUpdateInterval = updateInterval;
}

// Update Ticket Volume Chart with new data
function updateTicketVolumeChart() {
    if (!window.ticketVolumeChart) {
        console.warn('Ticket Volume Chart not found for update');
        return;
    }

    try {
        // Generate new data points with slight variations from the last points
        const dataset1 = window.ticketVolumeChart.data.datasets[0].data;
        const dataset2 = window.ticketVolumeChart.data.datasets[1].data;

        const lastValue1 = dataset1[dataset1.length - 1];
        const lastValue2 = dataset2[dataset2.length - 1];

        // Generate new values with a slight variation (up to ±10%)
        const variation1 = lastValue1 * (Math.random() * 0.2 - 0.1);
        const variation2 = lastValue2 * (Math.random() * 0.2 - 0.1);

        const newData1 = Math.max(0, Math.round(lastValue1 + variation1));
        const newData2 = Math.max(0, Math.round(lastValue2 + variation2));

        // Add new data points
        dataset1.push(newData1);
        dataset2.push(newData2);

        // Remove first data points if more than 12 points
        if (dataset1.length > 12) {
            dataset1.shift();
            dataset2.shift();
        }

        // Update chart with animation
        window.ticketVolumeChart.update('none'); // 'none' for smoother updates
    } catch (error) {
        console.error('Error updating Ticket Volume Chart:', error);
        throw error; // Re-throw to be caught by the main update function
    }
}

// Update Resolution Time Chart with new data
function updateResolutionTimeChart() {
    if (!window.resolutionTimeChart) {
        console.warn('Resolution Time Chart not found for update');
        return;
    }

    try {
        // Get current data
        const currentData = window.resolutionTimeChart.data.datasets[0].data;

        // Generate new data with small variations from current data
        const newData = currentData.map(value => {
            // Add or subtract up to 15% of the current value
            const variation = value * (Math.random() * 0.3 - 0.15);
            return Math.max(0, +(value + variation).toFixed(1)); // Keep one decimal place
        });

        // Update data
        window.resolutionTimeChart.data.datasets[0].data = newData;

        // Update chart with animation
        window.resolutionTimeChart.update('none');
    } catch (error) {
        console.error('Error updating Resolution Time Chart:', error);
        throw error;
    }
}

// Update Document Activity Chart with new data
function updateDocumentActivityChart() {
    if (!window.documentActivityChart) {
        console.warn('Document Activity Chart not found for update');
        return;
    }

    try {
        // Get current datasets
        const datasets = window.documentActivityChart.data.datasets;

        // Generate new data points with variations from the last points
        const newData = datasets.map(dataset => {
            const lastValue = dataset.data[dataset.data.length - 1];
            // Add or subtract up to 20% of the last value
            const variation = lastValue * (Math.random() * 0.4 - 0.2);
            return Math.max(0, Math.round(lastValue + variation));
        });

        // Add new data points
        datasets.forEach((dataset, index) => {
            dataset.data.push(newData[index]);

            // Remove first data point if more than 4 points
            if (dataset.data.length > 4) {
                dataset.data.shift();
            }
        });

        // Update chart with animation
        window.documentActivityChart.update('none');
    } catch (error) {
        console.error('Error updating Document Activity Chart:', error);
        throw error;
    }
}

// Update User Activity Chart with new data
function updateUserActivityChart() {
    if (!window.userActivityChart) {
        console.warn('User Activity Chart not found for update');
        return;
    }

    try {
        // Get current data
        const currentData = window.userActivityChart.data.datasets[0].data;

        // Generate new data with small variations
        const newData = currentData.map(value => {
            // Add or subtract up to 10% of the current value
            const variation = value * (Math.random() * 0.2 - 0.1);
            return Math.max(0, Math.round(value + variation));
        });

        // Update data
        window.userActivityChart.data.datasets[0].data = newData;

        // Update chart with animation
        window.userActivityChart.update({
            duration: 500,
            easing: 'easeOutQuart'
        });
    } catch (error) {
        console.error('Error updating User Activity Chart:', error);
        throw error;
    }
}

// Generate random data for charts
function generateRandomData(count, min, max) {
    return Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}
