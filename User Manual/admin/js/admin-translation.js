/**
 * Admin Translation Management Module
 * Handles translation workflow, translation editor, and translation memory
 */
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const adminTabs = document.querySelectorAll('.admin-tab');
    const tabContents = document.querySelectorAll('.admin-tab-content');
    const dashboardTenantSelect = document.getElementById('dashboard-tenant-select');
    const translationContentSelect = document.getElementById('translation-content-select');
    const translationTargetSelect = document.getElementById('translation-target-select');
    const sourceContent = document.getElementById('source-content');
    const targetContent = document.getElementById('target-content');
    const newTranslationTaskButton = document.getElementById('new-translation-task');
    const selectAllTasksCheckbox = document.getElementById('select-all-tasks');
    const taskCheckboxes = document.querySelectorAll('.task-select');
    
    // Initialize translation management
    initTranslationManagement();
    
    /**
     * Initialize translation management components and event listeners
     */
    function initTranslationManagement() {
        // Set up tabs
        if (adminTabs.length > 0) {
            adminTabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    const tabId = this.dataset.tab;
                    switchTab(tabId);
                });
            });
        }
        
        // Set up dashboard tenant select
        if (dashboardTenantSelect) {
            dashboardTenantSelect.addEventListener('change', updateTranslationStatusChart);
        }
        
        // Set up translation content and target language selects
        if (translationContentSelect) {
            translationContentSelect.addEventListener('change', loadSourceContent);
        }
        
        if (translationTargetSelect) {
            translationTargetSelect.addEventListener('change', loadTargetContent);
        }
        
        // Set up new translation task button
        if (newTranslationTaskButton) {
            newTranslationTaskButton.addEventListener('click', showNewTaskForm);
        }
        
        // Set up select all tasks checkbox
        if (selectAllTasksCheckbox) {
            selectAllTasksCheckbox.addEventListener('change', toggleSelectAllTasks);
        }
        
        // Set up action buttons
        const actionButtons = document.querySelectorAll('.action-btn');
        if (actionButtons.length > 0) {
            actionButtons.forEach(button => {
                button.addEventListener('click', handleActionButton);
            });
        }
        
        // Initialize translation status chart
        initTranslationStatusChart();
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
     * Initialize translation status chart
     */
    function initTranslationStatusChart() {
        const ctx = document.getElementById('translationStatusChart');
        if (!ctx) return;
        
        // Sample data for the chart
        const data = {
            labels: ['German', 'French', 'Japanese', 'Spanish'],
            datasets: [
                {
                    label: 'Translated',
                    data: [85, 78, 65, 42],
                    backgroundColor: '#4CAF50'
                },
                {
                    label: 'In Progress',
                    data: [10, 15, 20, 30],
                    backgroundColor: '#FFC107'
                },
                {
                    label: 'Not Started',
                    data: [5, 7, 15, 28],
                    backgroundColor: '#F44336'
                }
            ]
        };
        
        // Chart options
        const options = {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Percentage'
                    }
                },
                y: {
                    stacked: true
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw}%`;
                        }
                    }
                }
            }
        };
        
        // Create chart
        window.translationStatusChart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: options
        });
    }
    
    /**
     * Update translation status chart based on selected tenant
     */
    function updateTranslationStatusChart() {
        if (!window.translationStatusChart) return;
        
        const tenant = dashboardTenantSelect.value;
        
        // In a real application, this would fetch data for the selected tenant
        // For demo purposes, we'll just update with some sample data
        let data;
        
        switch (tenant) {
            case 'global':
                data = {
                    labels: ['German', 'French', 'Japanese', 'Spanish'],
                    datasets: [
                        {
                            label: 'Translated',
                            data: [90, 85, 70, 50],
                            backgroundColor: '#4CAF50'
                        },
                        {
                            label: 'In Progress',
                            data: [8, 10, 20, 30],
                            backgroundColor: '#FFC107'
                        },
                        {
                            label: 'Not Started',
                            data: [2, 5, 10, 20],
                            backgroundColor: '#F44336'
                        }
                    ]
                };
                break;
                
            case 'acme-corp':
                data = {
                    labels: ['German', 'French', 'Japanese', 'Spanish'],
                    datasets: [
                        {
                            label: 'Translated',
                            data: [80, 70, 60, 40],
                            backgroundColor: '#4CAF50'
                        },
                        {
                            label: 'In Progress',
                            data: [15, 20, 25, 30],
                            backgroundColor: '#FFC107'
                        },
                        {
                            label: 'Not Started',
                            data: [5, 10, 15, 30],
                            backgroundColor: '#F44336'
                        }
                    ]
                };
                break;
                
            default:
                data = {
                    labels: ['German', 'French', 'Japanese', 'Spanish'],
                    datasets: [
                        {
                            label: 'Translated',
                            data: [85, 78, 65, 42],
                            backgroundColor: '#4CAF50'
                        },
                        {
                            label: 'In Progress',
                            data: [10, 15, 20, 30],
                            backgroundColor: '#FFC107'
                        },
                        {
                            label: 'Not Started',
                            data: [5, 7, 15, 28],
                            backgroundColor: '#F44336'
                        }
                    ]
                };
        }
        
        // Update chart data
        window.translationStatusChart.data = data;
        window.translationStatusChart.update();
    }
    
    /**
     * Load source content for translation
     */
    function loadSourceContent() {
        if (!sourceContent) return;
        
        const contentKey = translationContentSelect.value;
        if (!contentKey) {
            sourceContent.innerHTML = '<p>Select content to translate.</p>';
            return;
        }
        
        // In a real application, this would fetch the content from the server
        // For demo purposes, we'll just use some sample content
        let content = '';
        
        switch (contentKey) {
            case 'getting-started':
                content = `
                    <h1>Getting Started</h1>
                    <p>Welcome to the Order Management System (OMS). This guide will help you get started with the system and understand its basic functionality.</p>
                    <h2>System Requirements</h2>
                    <p>To use the OMS, you need:</p>
                    <ul>
                        <li>A modern web browser (Chrome, Firefox, Safari, or Edge)</li>
                        <li>Internet connection</li>
                        <li>Valid user credentials</li>
                    </ul>
                    <h2>Logging In</h2>
                    <p>To log in to the system, navigate to the login page and enter your username and password.</p>
                `;
                break;
                
            case 'system-requirements':
                content = `
                    <h1>System Requirements</h1>
                    <p>The Order Management System (OMS) is a web-based application that can be accessed from any device with a modern web browser and internet connection.</p>
                    <h2>Supported Browsers</h2>
                    <ul>
                        <li>Google Chrome (version 90 or later)</li>
                        <li>Mozilla Firefox (version 88 or later)</li>
                        <li>Apple Safari (version 14 or later)</li>
                        <li>Microsoft Edge (version 90 or later)</li>
                    </ul>
                    <h2>Hardware Requirements</h2>
                    <p>The OMS is designed to work on a variety of devices, including desktops, laptops, tablets, and smartphones.</p>
                `;
                break;
                
            case 'managing-orders':
                content = `
                    <h1>Managing Orders</h1>
                    <p>The Order Management System allows you to create, view, edit, and track orders efficiently.</p>
                    <h2>Creating a New Order</h2>
                    <p>To create a new order, click the "New Order" button in the top right corner of the dashboard. This will open the order creation form.</p>
                    <h2>Viewing Orders</h2>
                    <p>You can view all orders in the Orders tab. Use the filters to narrow down the list based on status, date, customer, or other criteria.</p>
                `;
                break;
                
            case 'products':
                content = `
                    <h1>Products</h1>
                    <p>The Products section allows you to manage your product catalog, including adding new products, updating existing ones, and managing inventory.</p>
                    <h2>Adding a New Product</h2>
                    <p>To add a new product, click the "Add Product" button in the Products tab. Fill in the required information and click "Save".</p>
                    <h2>Managing Inventory</h2>
                    <p>You can update inventory levels for each product by editing the product and adjusting the "Stock" field.</p>
                `;
                break;
                
            default:
                content = '<p>No content available for the selected item.</p>';
        }
        
        sourceContent.innerHTML = content;
        
        // Load target content if target language is selected
        if (translationTargetSelect.value) {
            loadTargetContent();
        }
    }
    
    /**
     * Load target content for translation
     */
    function loadTargetContent() {
        if (!targetContent) return;
        
        const contentKey = translationContentSelect.value;
        const targetLanguage = translationTargetSelect.value;
        
        if (!contentKey || !targetLanguage) {
            targetContent.innerHTML = '<p>Select content and target language to start translating.</p>';
            return;
        }
        
        // In a real application, this would fetch any existing translation from the server
        // For demo purposes, we'll just use some sample content for German
        if (contentKey === 'getting-started' && targetLanguage === 'de-DE') {
            targetContent.innerHTML = `
                <h1>Erste Schritte</h1>
                <p>Willkommen beim Order Management System (OMS). Dieser Leitfaden hilft Ihnen, mit dem System zu beginnen und seine grundlegende Funktionalität zu verstehen.</p>
                <h2>Systemanforderungen</h2>
                <p>Um das OMS zu nutzen, benötigen Sie:</p>
                <ul>
                    <li>Einen modernen Webbrowser (Chrome, Firefox, Safari oder Edge)</li>
                    <li>Internetverbindung</li>
                    <li>Gültige Benutzeranmeldedaten</li>
                </ul>
                <h2>Anmelden</h2>
                <p>Um sich im System anzumelden, navigieren Sie zur Anmeldeseite und geben Sie Ihren Benutzernamen und Ihr Passwort ein.</p>
            `;
        } else {
            // For other combinations, show empty editor for translation
            targetContent.innerHTML = '';
            
            // Copy structure from source content
            const sourceNodes = sourceContent.childNodes;
            sourceNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const clone = node.cloneNode(true);
                    // Clear text content but keep structure
                    clearTextContent(clone);
                    targetContent.appendChild(clone);
                }
            });
        }
        
        // Load translation memory suggestions
        loadTranslationMemorySuggestions(contentKey, targetLanguage);
    }
    
    /**
     * Clear text content from an element while preserving structure
     * @param {HTMLElement} element - Element to clear text from
     */
    function clearTextContent(element) {
        if (element.nodeType === Node.TEXT_NODE) {
            element.textContent = '';
            return;
        }
        
        if (element.nodeType === Node.ELEMENT_NODE) {
            if (element.tagName === 'H1' || element.tagName === 'H2' || element.tagName === 'H3' ||
                element.tagName === 'P' || element.tagName === 'LI') {
                element.textContent = '';
            } else {
                const childNodes = Array.from(element.childNodes);
                childNodes.forEach(child => {
                    clearTextContent(child);
                });
            }
        }
    }
    
    /**
     * Load translation memory suggestions
     * @param {string} contentKey - Content key
     * @param {string} targetLanguage - Target language code
     */
    function loadTranslationMemorySuggestions(contentKey, targetLanguage) {
        const translationMemoryItems = document.querySelector('.translation-memory-items');
        if (!translationMemoryItems) return;
        
        // In a real application, this would fetch suggestions from the translation memory
        // For demo purposes, we'll just use some sample suggestions
        if (targetLanguage === 'de-DE') {
            translationMemoryItems.innerHTML = `
                <div class="translation-memory-item">
                    <p class="source">Click the "New Order" button to create a new order.</p>
                    <p class="target">Klicken Sie auf die Schaltfläche "Neue Bestellung", um eine neue Bestellung zu erstellen.</p>
                </div>
                <div class="translation-memory-item">
                    <p class="source">The Order Management System allows you to create, view, edit, and track orders efficiently.</p>
                    <p class="target">Das Auftragsverwaltungssystem ermöglicht es Ihnen, Aufträge effizient zu erstellen, anzuzeigen, zu bearbeiten und zu verfolgen.</p>
                </div>
                <div class="translation-memory-item">
                    <p class="source">To use the OMS, you need a modern web browser.</p>
                    <p class="target">Um das OMS zu nutzen, benötigen Sie einen modernen Webbrowser.</p>
                </div>
            `;
        } else if (targetLanguage === 'fr-FR') {
            translationMemoryItems.innerHTML = `
                <div class="translation-memory-item">
                    <p class="source">Click the "New Order" button to create a new order.</p>
                    <p class="target">Cliquez sur le bouton "Nouvelle Commande" pour créer une nouvelle commande.</p>
                </div>
                <div class="translation-memory-item">
                    <p class="source">The Order Management System allows you to create, view, edit, and track orders efficiently.</p>
                    <p class="target">Le Système de Gestion des Commandes vous permet de créer, visualiser, modifier et suivre efficacement les commandes.</p>
                </div>
            `;
        } else {
            translationMemoryItems.innerHTML = '<p>No translation memory suggestions available for the selected language.</p>';
        }
    }
    
    /**
     * Show new translation task form
     */
    function showNewTaskForm() {
        // In a real application, this would show a form to create a new translation task
        // For demo purposes, we'll just show a notification
        showNotification('New translation task form would be shown here', 'info');
    }
    
    /**
     * Toggle select all tasks checkboxes
     */
    function toggleSelectAllTasks() {
        const isChecked = selectAllTasksCheckbox.checked;
        
        taskCheckboxes.forEach(checkbox => {
            checkbox.checked = isChecked;
        });
    }
    
    /**
     * Handle action button clicks
     */
    function handleActionButton() {
        const action = this.classList.contains('edit') ? 'edit' : 
                      this.classList.contains('view') ? 'view' : '';
        
        const row = this.closest('tr');
        const content = row.querySelector('td:nth-child(2)').textContent;
        const sourceLanguage = row.querySelector('td:nth-child(3)').textContent;
        const targetLanguage = row.querySelector('td:nth-child(4)').textContent;
        
        switch (action) {
            case 'edit':
                // Switch to translation editor tab
                switchTab('translation-editor');
                
                // Set content and target language selects
                if (translationContentSelect) {
                    for (let i = 0; i < translationContentSelect.options.length; i++) {
                        if (translationContentSelect.options[i].text === content) {
                            translationContentSelect.selectedIndex = i;
                            break;
                        }
                    }
                }
                
                if (translationTargetSelect) {
                    for (let i = 0; i < translationTargetSelect.options.length; i++) {
                        if (translationTargetSelect.options[i].text === targetLanguage) {
                            translationTargetSelect.selectedIndex = i;
                            break;
                        }
                    }
                }
                
                // Load content
                loadSourceContent();
                break;
                
            case 'view':
                // In a real application, this would show a preview of the translation
                showNotification(`Viewing translation for "${content}" (${targetLanguage})`, 'info');
                break;
        }
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
