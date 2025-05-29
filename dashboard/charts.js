// Chart.js configuration and initialization
document.addEventListener('DOMContentLoaded', function() {
    // Chart.js default configuration
    Chart.defaults.font.family = 'Roboto, sans-serif';
    Chart.defaults.color = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim();
    Chart.defaults.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim();

    // Sales Chart Data
    const salesData = {
        week: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Sales',
                data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
                borderColor: getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim(),
                backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim() + '20',
                tension: 0.4,
                fill: true
            }]
        },
        month: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'Sales',
                data: [85000, 92000, 78000, 105000],
                borderColor: getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim(),
                backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim() + '20',
                tension: 0.4,
                fill: true
            }]
        },
        year: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Sales',
                data: [320000, 280000, 350000, 420000, 380000, 450000, 520000, 480000, 390000, 460000, 510000, 580000],
                borderColor: getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim(),
                backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim() + '20',
                tension: 0.4,
                fill: true
            }]
        }
    };

    // User Activity Chart Data
    const activityData = {
        labels: ['Active Users', 'New Users', 'Returning Users'],
        datasets: [{
            data: [65, 25, 10],
            backgroundColor: [
                getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim(),
                getComputedStyle(document.documentElement).getPropertyValue('--success-color').trim(),
                getComputedStyle(document.documentElement).getPropertyValue('--info-color').trim()
            ],
            borderWidth: 0
        }]
    };

    // Chart options
    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--card-background').trim(),
                titleColor: getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim(),
                bodyColor: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim(),
                borderColor: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim(),
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: false
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                border: {
                    display: false
                }
            },
            y: {
                grid: {
                    color: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim(),
                    drawBorder: false
                },
                border: {
                    display: false
                },
                ticks: {
                    callback: function(value) {
                        return '$' + value.toLocaleString();
                    }
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        }
    };

    const doughnutChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'circle'
                }
            },
            tooltip: {
                backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--card-background').trim(),
                titleColor: getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim(),
                bodyColor: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim(),
                borderColor: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim(),
                borderWidth: 1,
                cornerRadius: 8,
                callbacks: {
                    label: function(context) {
                        return context.label + ': ' + context.parsed + '%';
                    }
                }
            }
        },
        cutout: '60%'
    };

    // Initialize Sales Chart
    const salesCtx = document.getElementById('salesChart');
    let salesChart;
    
    if (salesCtx) {
        salesChart = new Chart(salesCtx, {
            type: 'line',
            data: salesData.month,
            options: lineChartOptions
        });
    }

    // Initialize Activity Chart
    const activityCtx = document.getElementById('activityChart');
    let activityChart;
    
    if (activityCtx) {
        activityChart = new Chart(activityCtx, {
            type: 'doughnut',
            data: activityData,
            options: doughnutChartOptions
        });
    }

    // Function to update chart data based on period
    window.updateChartData = function(period) {
        if (salesChart && salesData[period]) {
            salesChart.data = salesData[period];
            salesChart.update('active');
        }
    };

    // Theme change handler for charts
    function updateChartsForTheme() {
        const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim();
        const borderColor = getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim();
        const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();

        // Update Chart.js defaults
        Chart.defaults.color = textColor;
        Chart.defaults.borderColor = borderColor;

        // Update sales chart
        if (salesChart) {
            salesChart.data.datasets[0].borderColor = accentColor;
            salesChart.data.datasets[0].backgroundColor = accentColor + '20';
            salesChart.options.scales.y.grid.color = borderColor;
            salesChart.update('none');
        }

        // Update activity chart
        if (activityChart) {
            activityChart.data.datasets[0].backgroundColor[0] = accentColor;
            activityChart.update('none');
        }
    }

    // Listen for theme changes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                setTimeout(updateChartsForTheme, 100);
            }
        });
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });

    // Animate charts on load
    setTimeout(() => {
        if (salesChart) {
            salesChart.update('active');
        }
        if (activityChart) {
            activityChart.update('active');
        }
    }, 500);

    // Real-time data simulation for charts
    function simulateChartData() {
        if (salesChart) {
            const currentData = salesChart.data.datasets[0].data;
            const newData = currentData.map(value => {
                const change = (Math.random() - 0.5) * value * 0.1;
                return Math.max(0, Math.round(value + change));
            });
            
            salesChart.data.datasets[0].data = newData;
            salesChart.update('active');
        }

        if (activityChart) {
            const total = 100;
            const active = Math.floor(Math.random() * 30) + 50;
            const newUsers = Math.floor(Math.random() * 20) + 15;
            const returning = total - active - newUsers;
            
            activityChart.data.datasets[0].data = [active, newUsers, returning];
            activityChart.update('active');
        }
    }

    // Update charts every 60 seconds
    setInterval(simulateChartData, 60000);

    // Export functions for global access
    window.salesChart = salesChart;
    window.activityChart = activityChart;
    window.updateChartsForTheme = updateChartsForTheme;
});
