/**
 * Main JavaScript file for the Customer Portal
 * Handles UI interactions, dashboard functionality, and other features
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');

    // Initialize demo user if not exists
    initDemoUser();

    // Initialize tooltips, popovers, etc.
    initUI();

    // Set up event listeners
    setupEventListeners();

    // Load dashboard data
    loadDashboardData();

    // Initialize additional features
    handleNotifications();
    handleResponsiveness();
    loadUserPreferences();
});

// Initialize demo user for localStorage functionality
function initDemoUser() {
    if (!localStorage.getItem('currentUser')) {
        const demoUser = {
            id: 'demo-user-1',
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            role: 'user'
        };
        localStorage.setItem('currentUser', JSON.stringify(demoUser));
        console.log('Demo user initialized for localStorage functionality');
    }
}

// Initialize UI components
function initUI() {
    // Add active class to current page in sidebar
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const sidebarLinks = document.querySelectorAll('.sidebar ul li a');

    sidebarLinks.forEach(link => {
        const href = link.getAttribute('href').split('/').pop();
        if (href === currentPage) {
            link.parentElement.classList.add('active');
        }
    });
}

// Close all open modals
function closeAllModals() {
    // Remove all modal overlays
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
        modal.remove();
    });
}

// Set up event listeners for various UI interactions
function setupEventListeners() {
    // Widget actions (ellipsis menu)
    const widgetActions = document.querySelectorAll('.widget-actions');
    widgetActions.forEach(action => {
        action.addEventListener('click', function(e) {
            // Show widget options menu (to be implemented)
            console.log('Widget options clicked');
        });
    });

    // Dashboard customize button - only on the dashboard page
    if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
        const customizeBtn = document.querySelector('.actions .btn-primary');
        if (customizeBtn && customizeBtn.innerHTML.includes('Customize')) {
            customizeBtn.addEventListener('click', function() {
                console.log('Customize button clicked');
                showToast('Opening dashboard customization...', 'info');
                showDashboardCustomizationModal();
            });
        } else {
            console.error('Customize button not found');
        }
    }

    // Dashboard refresh button
    const refreshBtn = document.querySelector('.actions .btn-secondary');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            loadDashboardData();
        });
    } else {
        console.error('Refresh button not found');
    }

    // Search functionality
    const searchInput = document.querySelector('.search-container input');
    const searchButton = document.querySelector('.search-container button');

    if (searchButton) {
        searchButton.addEventListener('click', function() {
            performSearch(searchInput.value);
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(searchInput.value);
            }
        });
    }
}

// Perform search across the portal
function performSearch(query) {
    if (!query.trim()) return;

    // Show search results modal
    showSearchResultsModal(query);
}

// Show search results modal
function showSearchResultsModal(query) {
    // Create search results HTML
    const searchResultsHTML = `
        <div class="modal-overlay" id="search-results-modal">
            <div class="modal-container">
                <div class="modal-header">
                    <h3>Search Results for "${query}"</h3>
                    <button class="modal-close"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <div class="search-filters">
                        <button class="search-filter active" data-filter="all">All Results</button>
                        <button class="search-filter" data-filter="kb">Knowledge Base</button>
                        <button class="search-filter" data-filter="tickets">Tickets</button>
                        <button class="search-filter" data-filter="documents">Documents</button>
                    </div>

                    <div class="search-results">
                        ${getSearchResults(query)}
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add modal to the DOM
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = searchResultsHTML;
    document.body.appendChild(modalContainer.firstElementChild);

    // Add modal styles
    addSearchModalStyles();

    // Add event listeners
    setupSearchModalEventListeners(query);
}

// Add search modal styles
function addSearchModalStyles() {
    // Create style element if it doesn't exist
    let styleElement = document.getElementById('search-modal-styles');

    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'search-modal-styles';
        document.head.appendChild(styleElement);

        // Add styles
        styleElement.textContent = `
            .search-filters {
                display: flex;
                gap: 10px;
                margin-bottom: 20px;
                border-bottom: 1px solid var(--border-color);
                padding-bottom: 10px;
            }

            .search-filter {
                background: transparent;
                border: none;
                padding: 8px 15px;
                cursor: pointer;
                border-radius: 20px;
                transition: var(--transition);
            }

            .search-filter:hover {
                background-color: #f0f0f0;
            }

            .search-filter.active {
                background-color: var(--primary-color);
                color: white;
            }

            .search-results {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .search-result {
                padding: 15px;
                border: 1px solid var(--border-color);
                border-radius: 8px;
                transition: var(--transition);
            }

            .search-result:hover {
                box-shadow: var(--shadow);
                transform: translateY(-2px);
            }

            .search-result-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }

            .search-result-title {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
            }

            .search-result-category {
                padding: 3px 8px;
                border-radius: 20px;
                font-size: 12px;
                background-color: #f0f0f0;
            }

            .search-result-category.kb {
                background-color: #e6f7ff;
                color: #1890ff;
            }

            .search-result-category.ticket {
                background-color: #fff7e6;
                color: #fa8c16;
            }

            .search-result-category.document {
                background-color: #f6ffed;
                color: #52c41a;
            }

            .search-result-content {
                margin-bottom: 10px;
                font-size: 14px;
                color: var(--text-color);
            }

            .search-result-meta {
                display: flex;
                justify-content: space-between;
                font-size: 12px;
                color: var(--accent-color);
            }

            .search-result-highlight {
                background-color: #fffbe6;
                padding: 0 2px;
            }

            .no-results {
                padding: 30px;
                text-align: center;
                color: var(--accent-color);
            }
        `;
    }
}

// Set up search modal event listeners
function setupSearchModalEventListeners(query) {
    // Close modal
    const closeBtn = document.querySelector('#search-results-modal .modal-close');
    const modalOverlay = document.getElementById('search-results-modal');

    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modalOverlay.remove();
        });
    }

    // Close modal when clicking outside
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                modalOverlay.remove();
            }
        });
    }

    // Filter buttons
    const filterButtons = document.querySelectorAll('.search-filter');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Get filter
            const filter = this.getAttribute('data-filter');

            // Update search results
            updateSearchResults(query, filter);
        });
    });

    // Search result click
    const searchResults = document.querySelectorAll('.search-result');
    searchResults.forEach(result => {
        result.addEventListener('click', function() {
            const category = this.querySelector('.search-result-category').getAttribute('data-category');
            const id = this.getAttribute('data-id');

            // Navigate to the appropriate page
            navigateToResult(category, id);

            // Close modal
            modalOverlay.remove();
        });
    });
}

// Update search results based on filter
function updateSearchResults(query, filter) {
    const searchResultsContainer = document.querySelector('.search-results');

    if (!searchResultsContainer) return;

    // Get filtered results
    const results = getSearchResults(query, filter);

    // Update container
    searchResultsContainer.innerHTML = results;

    // Add event listeners to new results
    const searchResults = document.querySelectorAll('.search-result');
    searchResults.forEach(result => {
        result.addEventListener('click', function() {
            const category = this.querySelector('.search-result-category').getAttribute('data-category');
            const id = this.getAttribute('data-id');

            // Navigate to the appropriate page
            navigateToResult(category, id);

            // Close modal
            document.getElementById('search-results-modal').remove();
        });
    });
}

// Get search results HTML
function getSearchResults(query, filter = 'all') {
    // Mock search results
    const allResults = [
        {
            id: 'kb1',
            title: 'Getting Started with Our Platform',
            content: 'A comprehensive guide to help you get started with our platform and its features.',
            category: 'kb',
            categoryName: 'Knowledge Base',
            date: '2 days ago'
        },
        {
            id: 'kb2',
            title: 'How to Configure Your Account Settings',
            content: 'Learn how to configure your account settings for optimal performance and security.',
            category: 'kb',
            categoryName: 'Knowledge Base',
            date: '1 week ago'
        },
        {
            id: 'ticket1',
            title: 'Unable to access account settings',
            content: 'I\'m trying to change my password but the settings page is not loading correctly.',
            category: 'ticket',
            categoryName: 'Support Ticket',
            date: '2 hours ago'
        },
        {
            id: 'ticket2',
            title: 'Feature request: Dark mode',
            content: 'Would it be possible to add a dark mode option to the portal?',
            category: 'ticket',
            categoryName: 'Support Ticket',
            date: '1 day ago'
        },
        {
            id: 'doc1',
            title: 'Product Specifications.pdf',
            content: 'Detailed specifications for all our products and services.',
            category: 'document',
            categoryName: 'Document',
            date: '3 days ago'
        },
        {
            id: 'doc2',
            title: 'User Guide.docx',
            content: 'Complete user guide with step-by-step instructions.',
            category: 'document',
            categoryName: 'Document',
            date: '1 week ago'
        }
    ];

    // Filter results
    let filteredResults = allResults;

    if (filter !== 'all') {
        filteredResults = allResults.filter(result => {
            if (filter === 'kb' && result.category === 'kb') return true;
            if (filter === 'tickets' && result.category === 'ticket') return true;
            if (filter === 'documents' && result.category === 'document') return true;
            return false;
        });
    }

    // Filter by query
    const searchResults = filteredResults.filter(result => {
        const titleMatch = result.title.toLowerCase().includes(query.toLowerCase());
        const contentMatch = result.content.toLowerCase().includes(query.toLowerCase());
        return titleMatch || contentMatch;
    });

    // If no results
    if (searchResults.length === 0) {
        return '<div class="no-results">No results found for "' + query + '"</div>';
    }

    // Highlight query in results
    const highlightedResults = searchResults.map(result => {
        const highlightedTitle = highlightText(result.title, query);
        const highlightedContent = highlightText(result.content, query);

        return `
            <div class="search-result" data-id="${result.id}">
                <div class="search-result-header">
                    <h4 class="search-result-title">${highlightedTitle}</h4>
                    <span class="search-result-category ${result.category}" data-category="${result.category}">${result.categoryName}</span>
                </div>
                <div class="search-result-content">${highlightedContent}</div>
                <div class="search-result-meta">
                    <span>Last updated: ${result.date}</span>
                    <span>Click to view</span>
                </div>
            </div>
        `;
    });

    return highlightedResults.join('');
}

// Highlight text with search query
function highlightText(text, query) {
    if (!query) return text;

    const regex = new RegExp(query, 'gi');
    return text.replace(regex, match => `<span class="search-result-highlight">${match}</span>`);
}

// Navigate to search result
function navigateToResult(category, id) {
    switch (category) {
        case 'kb':
            window.location.href = 'pages/knowledge-base.html?article=' + id;
            break;
        case 'ticket':
            window.location.href = 'pages/tickets.html?ticket=' + id;
            break;
        case 'document':
            window.location.href = 'pages/documents.html?document=' + id;
            break;
        default:
            console.error('Unknown category:', category);
    }
}

// Load dashboard data
function loadDashboardData() {
    // In a real application, this would fetch data from an API
    console.log('Loading dashboard data...');

    // Simulate loading with a small delay
    const widgets = document.querySelectorAll('.widget');

    widgets.forEach(widget => {
        widget.classList.add('loading');

        setTimeout(() => {
            widget.classList.remove('loading');
        }, 1000);
    });
}

// Handle notifications
function handleNotifications() {
    const notificationIcon = document.querySelector('.notifications');

    if (notificationIcon) {
        notificationIcon.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling
            showNotificationsPanel();
        });
    }

    // Close notifications panel when clicking outside
    document.addEventListener('click', function(e) {
        const notificationsPanel = document.querySelector('.notifications-panel');
        if (notificationsPanel && !notificationsPanel.contains(e.target) && !notificationIcon.contains(e.target)) {
            notificationsPanel.remove();
        }
    });
}

// Show notifications panel
function showNotificationsPanel() {
    // Remove existing panel if it exists
    const existingPanel = document.querySelector('.notifications-panel');
    if (existingPanel) {
        existingPanel.remove();
        return;
    }

    // Get notifications from localStorage or use default
    const notifications = getNotifications();

    // Create notifications panel HTML
    const panelHTML = `
        <div class="notifications-panel">
            <div class="notifications-header">
                <h3>Notifications</h3>
                <div class="notifications-actions">
                    <button class="mark-all-read">Mark All as Read</button>
                    <button class="clear-all">Clear All</button>
                </div>
            </div>
            <div class="notifications-body">
                ${notifications.length > 0 ?
                    notifications.map(notification => `
                        <div class="notification-item ${notification.read ? 'read' : 'unread'}" data-id="${notification.id}">
                            <div class="notification-icon ${notification.type}">
                                <i class="fas ${getNotificationIcon(notification.type)}"></i>
                            </div>
                            <div class="notification-content">
                                <p>${notification.message}</p>
                                <span class="notification-time">${formatTimeAgo(notification.time)}</span>
                            </div>
                            <button class="notification-dismiss"><i class="fas fa-times"></i></button>
                        </div>
                    `).join('')
                    : '<div class="no-notifications">No notifications</div>'
                }
            </div>
            <div class="notifications-footer">
                <a href="#">View All Notifications</a>
            </div>
        </div>
    `;

    // Create panel element
    const panelElement = document.createElement('div');
    panelElement.innerHTML = panelHTML;

    // Add panel to DOM
    const notificationIcon = document.querySelector('.notifications');
    notificationIcon.appendChild(panelElement.firstElementChild);

    // Add panel styles
    addNotificationPanelStyles();

    // Add event listeners
    setupNotificationEventListeners();

    // Update notification badge
    updateNotificationBadge();
}

// Add notification panel styles
function addNotificationPanelStyles() {
    // Create style element if it doesn't exist
    let styleElement = document.getElementById('notification-styles');

    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'notification-styles';
        document.head.appendChild(styleElement);

        // Add styles
        styleElement.textContent = `
            .notifications {
                position: relative;
            }

            .notifications-panel {
                position: absolute;
                top: 100%;
                right: -100px;
                width: 350px;
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                z-index: 100;
                overflow: hidden;
                animation: fadeIn 0.3s ease;
            }

            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .notifications-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px;
                border-bottom: 1px solid var(--border-color);
            }

            .notifications-header h3 {
                margin: 0;
                font-size: 16px;
            }

            .notifications-actions {
                display: flex;
                gap: 10px;
            }

            .notifications-actions button {
                background: transparent;
                border: none;
                font-size: 12px;
                color: var(--accent-color);
                cursor: pointer;
                transition: var(--transition);
            }

            .notifications-actions button:hover {
                color: var(--primary-color);
            }

            .notifications-body {
                max-height: 350px;
                overflow-y: auto;
            }

            .notification-item {
                display: flex;
                align-items: flex-start;
                padding: 15px;
                border-bottom: 1px solid var(--border-color);
                transition: var(--transition);
                cursor: pointer;
            }

            .notification-item:hover {
                background-color: #f9f9f9;
            }

            .notification-item.unread {
                background-color: #f0f7ff;
            }

            .notification-icon {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-right: 15px;
                flex-shrink: 0;
            }

            .notification-icon.info {
                background-color: #e6f7ff;
                color: #1890ff;
            }

            .notification-icon.success {
                background-color: #e6f7e6;
                color: #28a745;
            }

            .notification-icon.warning {
                background-color: #fff7e6;
                color: #ffc107;
            }

            .notification-icon.error {
                background-color: #fff0f0;
                color: #dc3545;
            }

            .notification-content {
                flex: 1;
            }

            .notification-content p {
                margin: 0 0 5px 0;
                font-size: 14px;
            }

            .notification-time {
                font-size: 12px;
                color: var(--accent-color);
            }

            .notification-dismiss {
                background: transparent;
                border: none;
                color: var(--accent-color);
                cursor: pointer;
                opacity: 0;
                transition: var(--transition);
            }

            .notification-item:hover .notification-dismiss {
                opacity: 1;
            }

            .no-notifications {
                padding: 30px;
                text-align: center;
                color: var(--accent-color);
            }

            .notifications-footer {
                padding: 10px;
                text-align: center;
                border-top: 1px solid var(--border-color);
            }

            .notifications-footer a {
                font-size: 14px;
                color: var(--primary-color);
                text-decoration: none;
            }
        `;
    }
}

// Set up notification event listeners
function setupNotificationEventListeners() {
    // Mark all as read
    const markAllReadBtn = document.querySelector('.mark-all-read');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            markAllNotificationsAsRead();
        });
    }

    // Clear all notifications
    const clearAllBtn = document.querySelector('.clear-all');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            clearAllNotifications();
        });
    }

    // Individual notification actions
    const notificationItems = document.querySelectorAll('.notification-item');
    notificationItems.forEach(item => {
        // Mark as read on click
        item.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            markNotificationAsRead(id);
        });

        // Dismiss notification
        const dismissBtn = item.querySelector('.notification-dismiss');
        if (dismissBtn) {
            dismissBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const id = parseInt(this.parentElement.getAttribute('data-id'));
                dismissNotification(id);
            });
        }
    });
}

// Get notifications from localStorage
function getNotifications() {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) return [];

    // Get notifications
    return JSON.parse(localStorage.getItem(`notifications_${currentUser.id}`)) || getDefaultNotifications();
}

// Get default notifications
function getDefaultNotifications() {
    const now = new Date().getTime();

    return [
        {
            id: 1,
            message: 'Welcome to the Customer Portal!',
            type: 'info',
            time: now,
            read: false
        },
        {
            id: 2,
            message: 'Your account has been created successfully.',
            type: 'success',
            time: now - 3600000, // 1 hour ago
            read: false
        },
        {
            id: 3,
            message: 'New ticket #1234 has been created.',
            type: 'info',
            time: now - 86400000, // 1 day ago
            read: true
        }
    ];
}

// Save notifications to localStorage
function saveNotifications(notifications) {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) return;

    // Save notifications
    localStorage.setItem(`notifications_${currentUser.id}`, JSON.stringify(notifications));

    // Update notification badge
    updateNotificationBadge();
}

// Add a new notification
function addNotification(message, type = 'info') {
    // Get notifications
    const notifications = getNotifications();

    // Create new notification
    const newNotification = {
        id: notifications.length > 0 ? Math.max(...notifications.map(n => n.id)) + 1 : 1,
        message,
        type,
        time: new Date().getTime(),
        read: false
    };

    // Add to notifications
    notifications.unshift(newNotification);

    // Save notifications
    saveNotifications(notifications);

    // Update notification badge
    updateNotificationBadge();

    // Show notification toast
    showNotification(message, type);

    return newNotification;
}

// Mark notification as read
function markNotificationAsRead(id) {
    // Get notifications
    const notifications = getNotifications();

    // Find notification
    const notification = notifications.find(n => n.id === id);

    if (notification) {
        // Mark as read
        notification.read = true;

        // Save notifications
        saveNotifications(notifications);

        // Update UI
        const notificationItem = document.querySelector(`.notification-item[data-id="${id}"]`);
        if (notificationItem) {
            notificationItem.classList.remove('unread');
            notificationItem.classList.add('read');
        }
    }
}

// Mark all notifications as read
function markAllNotificationsAsRead() {
    // Get notifications
    const notifications = getNotifications();

    // Mark all as read
    notifications.forEach(notification => {
        notification.read = true;
    });

    // Save notifications
    saveNotifications(notifications);

    // Update UI
    const notificationItems = document.querySelectorAll('.notification-item');
    notificationItems.forEach(item => {
        item.classList.remove('unread');
        item.classList.add('read');
    });

    // Show success message
    showNotification('All notifications marked as read', 'success');
}

// Dismiss notification
function dismissNotification(id) {
    // Get notifications
    const notifications = getNotifications();

    // Remove notification
    const updatedNotifications = notifications.filter(n => n.id !== id);

    // Save notifications
    saveNotifications(updatedNotifications);

    // Update UI
    const notificationItem = document.querySelector(`.notification-item[data-id="${id}"]`);
    if (notificationItem) {
        notificationItem.style.height = `${notificationItem.offsetHeight}px`;
        notificationItem.style.opacity = '0';
        notificationItem.style.marginTop = '-10px';

        setTimeout(() => {
            notificationItem.style.height = '0';
            notificationItem.style.padding = '0';
            notificationItem.style.margin = '0';
            notificationItem.style.borderBottom = 'none';

            setTimeout(() => {
                notificationItem.remove();

                // Show empty message if no notifications
                if (updatedNotifications.length === 0) {
                    const notificationsBody = document.querySelector('.notifications-body');
                    if (notificationsBody) {
                        notificationsBody.innerHTML = '<div class="no-notifications">No notifications</div>';
                    }
                }
            }, 300);
        }, 300);
    }
}

// Clear all notifications
function clearAllNotifications() {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) return;

    // Clear notifications
    localStorage.removeItem(`notifications_${currentUser.id}`);

    // Update UI
    const notificationsBody = document.querySelector('.notifications-body');
    if (notificationsBody) {
        notificationsBody.innerHTML = '<div class="no-notifications">No notifications</div>';
    }

    // Update notification badge
    updateNotificationBadge();

    // Show success message
    showNotification('All notifications cleared', 'success');
}

// Update notification badge
function updateNotificationBadge() {
    // Get notifications
    const notifications = getNotifications();

    // Count unread notifications
    const unreadCount = notifications.filter(n => !n.read).length;

    // Update badge
    const badge = document.querySelector('.notifications .badge');
    if (badge) {
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'flex' : 'none';
    }
}

// Get notification icon based on type
function getNotificationIcon(type) {
    switch (type) {
        case 'success':
            return 'fa-check';
        case 'warning':
            return 'fa-exclamation-triangle';
        case 'error':
            return 'fa-times-circle';
        case 'info':
        default:
            return 'fa-info-circle';
    }
}

// Format time ago
function formatTimeAgo(timestamp) {
    const now = new Date().getTime();
    const diff = now - timestamp;

    // Less than a minute
    if (diff < 60000) {
        return 'Just now';
    }

    // Less than an hour
    if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }

    // Less than a day
    if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }

    // Less than a week
    if (diff < 604800000) {
        const days = Math.floor(diff / 86400000);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }

    // Format date
    const date = new Date(timestamp);
    return date.toLocaleDateString();
}

// Add a new activity item to the activity feed
function addActivityItem(icon, text, time) {
    const activityList = document.querySelector('.activity-list');

    if (!activityList) return;

    const li = document.createElement('li');
    li.className = 'activity-item';

    li.innerHTML = `
        <div class="activity-icon"><i class="fas fa-${icon}"></i></div>
        <div class="activity-info">
            <p>${text}</p>
            <span class="activity-time">${time}</span>
        </div>
    `;

    activityList.prepend(li);
}

// Update dashboard stats
function updateStats(tickets, documents, notifications) {
    const ticketStat = document.querySelector('.stat-item:nth-child(1) .stat-value');
    const documentStat = document.querySelector('.stat-item:nth-child(2) .stat-value');
    const notificationStat = document.querySelector('.stat-item:nth-child(3) .stat-value');

    if (ticketStat) ticketStat.textContent = tickets;
    if (documentStat) documentStat.textContent = documents;
    if (notificationStat) notificationStat.textContent = notifications;
}

// Handle mobile responsiveness
function handleResponsiveness() {
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'sidebar-toggle';
    toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';

    document.querySelector('header').appendChild(toggleBtn);

    toggleBtn.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });
}

// Dashboard customization functionality
function showDashboardCustomizationModal() {
    // Close any existing modals first
    closeAllModals();

    // Create modal HTML
    const modalHTML = `
        <div class="modal-overlay" id="dashboard-modal-overlay">
            <div class="modal-container">
                <div class="modal-header">
                    <h3>Customize Dashboard</h3>
                    <button class="modal-close"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <div class="customization-section">
                        <h4>Widget Layout</h4>
                        <div class="layout-options">
                            <div class="layout-option" data-layout="2-column">
                                <div class="layout-preview">
                                    <div class="preview-column"></div>
                                    <div class="preview-column"></div>
                                </div>
                                <span>2 Columns</span>
                            </div>
                            <div class="layout-option" data-layout="3-column">
                                <div class="layout-preview">
                                    <div class="preview-column"></div>
                                    <div class="preview-column"></div>
                                    <div class="preview-column"></div>
                                </div>
                                <span>3 Columns</span>
                            </div>
                            <div class="layout-option active" data-layout="mixed">
                                <div class="layout-preview">
                                    <div class="preview-mixed">
                                        <div class="preview-top"></div>
                                        <div class="preview-bottom">
                                            <div></div>
                                            <div></div>
                                        </div>
                                    </div>
                                </div>
                                <span>Mixed</span>
                            </div>
                        </div>
                    </div>

                    <div class="customization-section">
                        <h4>Available Widgets</h4>
                        <p>Drag and drop to add or remove widgets from your dashboard.</p>

                        <div class="widget-list">
                            <div class="widget-item" draggable="true" data-widget-type="stats">
                                <div class="widget-item-icon"><i class="fas fa-chart-pie"></i></div>
                                <div class="widget-item-info">
                                    <h5>Quick Stats</h5>
                                    <p>Shows key metrics at a glance</p>
                                </div>
                                <button class="widget-item-status active">Active</button>
                            </div>

                            <div class="widget-item" draggable="true" data-widget-type="activity">
                                <div class="widget-item-icon"><i class="fas fa-list"></i></div>
                                <div class="widget-item-info">
                                    <h5>Recent Activity</h5>
                                    <p>Shows latest activities and updates</p>
                                </div>
                                <button class="widget-item-status active">Active</button>
                            </div>

                            <div class="widget-item" draggable="true" data-widget-type="tickets">
                                <div class="widget-item-icon"><i class="fas fa-ticket-alt"></i></div>
                                <div class="widget-item-info">
                                    <h5>Recent Tickets</h5>
                                    <p>Shows your latest support tickets</p>
                                </div>
                                <button class="widget-item-status">Inactive</button>
                            </div>

                            <div class="widget-item" draggable="true" data-widget-type="calendar">
                                <div class="widget-item-icon"><i class="fas fa-calendar"></i></div>
                                <div class="widget-item-info">
                                    <h5>Calendar</h5>
                                    <p>Shows upcoming events and deadlines</p>
                                </div>
                                <button class="widget-item-status">Inactive</button>
                            </div>

                            <div class="widget-item" draggable="true" data-widget-type="documents">
                                <div class="widget-item-icon"><i class="fas fa-file"></i></div>
                                <div class="widget-item-info">
                                    <h5>Recent Documents</h5>
                                    <p>Shows recently accessed documents</p>
                                </div>
                                <button class="widget-item-status">Inactive</button>
                            </div>
                        </div>
                    </div>

                    <div class="customization-section">
                        <h4>Color Theme</h4>
                        <div class="theme-options">
                            <div class="theme-option active" data-theme="default">
                                <div class="theme-preview default-theme"></div>
                                <span>Default</span>
                            </div>
                            <div class="theme-option" data-theme="dark">
                                <div class="theme-preview dark-theme"></div>
                                <span>Dark</span>
                            </div>
                            <div class="theme-option" data-theme="light">
                                <div class="theme-preview light-theme"></div>
                                <span>Light</span>
                            </div>
                            <div class="theme-option" data-theme="blue">
                                <div class="theme-preview blue-theme"></div>
                                <span>Blue</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" id="reset-dashboard">Reset to Default</button>
                    <button class="btn-primary" id="save-dashboard">Save Changes</button>
                </div>
            </div>
        </div>
    `;

    // Add modal to the DOM
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer.firstElementChild);

    // Add modal styles
    addModalStyles();

    // Add event listeners
    setupModalEventListeners();
}

// Add modal styles
function addModalStyles() {
    // Create style element if it doesn't exist
    let styleElement = document.getElementById('modal-styles');

    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'modal-styles';
        document.head.appendChild(styleElement);

        // Add styles
        styleElement.textContent = `
            .modal-overlay {
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
                backdrop-filter: blur(3px);
                -webkit-backdrop-filter: blur(3px);
            }

            .modal-container {
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                width: 800px;
                max-width: 90%;
                max-height: 90vh;
                display: flex;
                flex-direction: column;
                animation: modalFadeIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }

            @keyframes modalFadeIn {
                from {
                    opacity: 0;
                    transform: translate(-50%, -48%) scale(0.96);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }

            .modal-overlay {
                animation: overlayFadeIn 0.3s ease;
            }

            @keyframes overlayFadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }

            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                border-bottom: 1px solid #e0e0e0;
            }

            .modal-header h3 {
                margin: 0;
            }

            .modal-close {
                background: transparent;
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: #666;
            }

            .modal-body {
                padding: 20px;
                overflow-y: auto;
                max-height: calc(90vh - 130px);
            }

            .modal-footer {
                padding: 15px 20px;
                border-top: 1px solid #e0e0e0;
                display: flex;
                justify-content: flex-end;
                gap: 10px;
            }

            .customization-section {
                margin-bottom: 30px;
            }

            .customization-section h4 {
                margin-bottom: 15px;
                padding-bottom: 5px;
                border-bottom: 1px solid #f0f0f0;
            }

            .layout-options {
                display: flex;
                gap: 20px;
                margin-bottom: 20px;
            }

            .layout-option {
                text-align: center;
                cursor: pointer;
                padding: 10px;
                border-radius: 4px;
                border: 2px solid transparent;
                transition: all 0.3s ease;
            }

            .layout-option:hover {
                background-color: #f9f9f9;
            }

            .layout-option.active {
                border-color: #000;
                background-color: #f5f5f5;
            }

            .layout-preview {
                width: 100px;
                height: 60px;
                background-color: #f0f0f0;
                margin-bottom: 5px;
                display: flex;
                gap: 2px;
            }

            .preview-column {
                flex: 1;
                background-color: #ddd;
            }

            .preview-mixed {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                gap: 2px;
            }

            .preview-top {
                height: 30px;
                background-color: #ddd;
            }

            .preview-bottom {
                flex: 1;
                display: flex;
                gap: 2px;
            }

            .preview-bottom div {
                flex: 1;
                background-color: #ddd;
            }

            .widget-list {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .widget-item {
                display: flex;
                align-items: center;
                padding: 15px;
                border: 1px solid #e0e0e0;
                border-radius: 4px;
                cursor: grab;
                transition: all 0.3s ease;
                position: relative;
            }

            .widget-item:hover {
                background-color: #f9f9f9;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }

            .widget-item:hover .widget-item-status {
                transform: scale(1.05);
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            .widget-item-icon {
                width: 40px;
                height: 40px;
                background-color: #f0f0f0;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-right: 15px;
                color: #333;
            }

            .widget-item-info {
                flex: 1;
            }

            .widget-item-info h5 {
                margin: 0 0 5px 0;
            }

            .widget-item-info p {
                margin: 0;
                font-size: 12px;
                color: #666;
            }

            .widget-item-status {
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 12px;
                background-color: #f0f0f0;
                color: #666;
                transition: all 0.3s ease;
                font-weight: 500;
                min-width: 80px;
                text-align: center;
                cursor: pointer;
                border: none;
                outline: none;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                position: relative;
                overflow: hidden;
            }

            .widget-item-status:hover {
                transform: translateY(-1px);
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
            }

            .widget-item-status:active {
                transform: translateY(1px);
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
            }

            .widget-item-status.active {
                background-color: #e6f7e6;
                color: #28a745;
                font-weight: 600;
            }

            .widget-item-status::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 10px;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background-color: currentColor;
                opacity: 0;
                transform: translateY(-50%);
                transition: opacity 0.3s ease;
            }

            .widget-item-status.active::before {
                opacity: 1;
            }

            .theme-options {
                display: flex;
                gap: 20px;
            }

            .theme-option {
                text-align: center;
                cursor: pointer;
                padding: 10px;
                border-radius: 4px;
                border: 2px solid transparent;
                transition: all 0.3s ease;
            }

            .theme-option:hover {
                background-color: #f9f9f9;
            }

            .theme-option.active {
                border-color: #000;
                background-color: #f5f5f5;
            }

            .theme-preview {
                width: 60px;
                height: 60px;
                border-radius: 4px;
                margin-bottom: 5px;
            }

            .default-theme {
                background: linear-gradient(to bottom right, #fff 50%, #000 50%);
            }

            .dark-theme {
                background-color: #333;
                border: 1px solid #666;
            }

            .light-theme {
                background-color: #f9f9f9;
                border: 1px solid #ddd;
            }

            .blue-theme {
                background-color: #e6f7ff;
                border: 1px solid #91d5ff;
            }
        `;
    }
}

// Set up modal event listeners
function setupModalEventListeners() {
    // Close modal
    const closeBtn = document.querySelector('.modal-close');
    const modalOverlay = document.getElementById('dashboard-modal-overlay');

    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modalOverlay.remove();
        });
    }

    // Close modal when clicking outside
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                modalOverlay.remove();
            }
        });
    }

    // Layout options
    const layoutOptions = document.querySelectorAll('.layout-option');
    layoutOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            layoutOptions.forEach(opt => opt.classList.remove('active'));

            // Add active class to clicked option
            this.classList.add('active');

            // Save layout preference to localStorage
            const layout = this.getAttribute('data-layout');
            saveUserPreference('dashboardLayout', layout);
        });
    });

    // Theme options
    const themeOptions = document.querySelectorAll('.theme-option');

    // Set active theme based on current preference
    const currentTheme = getUserPreference('dashboardTheme', 'default');
    themeOptions.forEach(option => {
        const optionTheme = option.getAttribute('data-theme');
        if (optionTheme === currentTheme) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }

        // Add click event listener
        option.addEventListener('click', function() {
            // Remove active class from all options
            themeOptions.forEach(opt => opt.classList.remove('active'));

            // Add active class to clicked option
            this.classList.add('active');

            // Get theme from data attribute
            const theme = this.getAttribute('data-theme');

            // Apply theme (this will also save the preference)
            applyTheme(theme);
        });
    });

    // Widget items drag and drop
    const widgetItems = document.querySelectorAll('.widget-item');
    widgetItems.forEach(item => {
        item.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', this.getAttribute('data-widget-type'));
            this.classList.add('dragging');
        });

        item.addEventListener('dragend', function() {
            this.classList.remove('dragging');
        });

        // Add click handler for the status button specifically
        const statusButton = item.querySelector('.widget-item-status');
        if (statusButton) {
            statusButton.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent event from bubbling up

                // Toggle active state
                const isActive = this.classList.contains('active');
                console.log('Status button clicked:', item.getAttribute('data-widget-type'), 'Current status:', isActive);

                if (isActive) {
                    this.classList.remove('active');
                    this.textContent = 'Inactive';
                    this.style.backgroundColor = '#f0f0f0';
                    this.style.color = '#666';
                } else {
                    this.classList.add('active');
                    this.textContent = 'Active';
                    this.style.backgroundColor = '#e6f7e6';
                    this.style.color = '#28a745';
                }

                // Save widget preference to localStorage
                const widgetType = item.getAttribute('data-widget-type');
                saveUserPreference(`widget_${widgetType}`, !isActive);

                // Show feedback
                const widgetName = item.querySelector('.widget-item-info h5').textContent;
                const statusText = !isActive ? 'activated' : 'deactivated';
                showToast(`${widgetName} ${statusText}`, 'info');
            });
        }

        // Keep the item click handler as a fallback
        item.addEventListener('click', function(e) {
            // Only handle clicks if they're not on the status button
            if (e.target.closest('.widget-item-status')) return;

            // Toggle widget status
            const statusElement = this.querySelector('.widget-item-status');
            if (!statusElement) return;

            const isActive = statusElement.classList.contains('active');
            console.log('Widget item clicked:', this.getAttribute('data-widget-type'), 'Current status:', isActive);

            if (isActive) {
                statusElement.classList.remove('active');
                statusElement.textContent = 'Inactive';
                statusElement.style.backgroundColor = '#f0f0f0';
                statusElement.style.color = '#666';
            } else {
                statusElement.classList.add('active');
                statusElement.textContent = 'Active';
                statusElement.style.backgroundColor = '#e6f7e6';
                statusElement.style.color = '#28a745';
            }

            // Save widget preference to localStorage
            const widgetType = this.getAttribute('data-widget-type');
            saveUserPreference(`widget_${widgetType}`, !isActive);

            // Show feedback
            const widgetName = this.querySelector('.widget-item-info h5').textContent;
            const statusText = !isActive ? 'activated' : 'deactivated';
            showToast(`${widgetName} ${statusText}`, 'info');
        });
    });

    // Save dashboard button
    const saveBtn = document.getElementById('save-dashboard');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            // Save all preferences
            const activeLayout = document.querySelector('.layout-option.active').getAttribute('data-layout');
            const activeTheme = document.querySelector('.theme-option.active').getAttribute('data-theme');

            saveUserPreference('dashboardLayout', activeLayout);
            saveUserPreference('dashboardTheme', activeTheme);

            // Save widget preferences
            widgetItems.forEach(item => {
                const widgetType = item.getAttribute('data-widget-type');
                const isActive = item.querySelector('.widget-item-status').classList.contains('active');
                saveUserPreference(`widget_${widgetType}`, isActive);
            });

            // Apply changes
            applyTheme(activeTheme);
            updateDashboardLayout(activeLayout);
            updateDashboardWidgets();

            // Show success message
            showToast('Dashboard customization saved successfully', 'success');

            // Close modal
            modalOverlay.remove();
        });
    }

    // Reset dashboard button
    const resetBtn = document.getElementById('reset-dashboard');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            // Clear preferences
            clearUserPreferences();

            // Reset UI
            layoutOptions.forEach(opt => {
                if (opt.getAttribute('data-layout') === 'mixed') {
                    opt.classList.add('active');
                } else {
                    opt.classList.remove('active');
                }
            });

            themeOptions.forEach(opt => {
                if (opt.getAttribute('data-theme') === 'default') {
                    opt.classList.add('active');
                } else {
                    opt.classList.remove('active');
                }
            });

            widgetItems.forEach(item => {
                const statusElement = item.querySelector('.widget-item-status');
                if (!statusElement) return;

                const widgetType = item.getAttribute('data-widget-type');
                if (widgetType === 'stats' || widgetType === 'activity') {
                    statusElement.classList.add('active');
                    statusElement.textContent = 'Active';
                    statusElement.style.backgroundColor = '#e6f7e6';
                    statusElement.style.color = '#28a745';
                } else {
                    statusElement.classList.remove('active');
                    statusElement.textContent = 'Inactive';
                    statusElement.style.backgroundColor = '#f0f0f0';
                    statusElement.style.color = '#666';
                }

                // Save the reset preference
                saveUserPreference(`widget_${widgetType}`, widgetType === 'stats' || widgetType === 'activity');
            });

            // Show success message
            showToast('Dashboard reset to default settings', 'success');
        });
    }
}

// Save user preference to localStorage
function saveUserPreference(key, value) {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) return;

    // Get user preferences
    let preferences = JSON.parse(localStorage.getItem(`preferences_${currentUser.id}`)) || {};

    // Update preference
    preferences[key] = value;

    // Save preferences
    localStorage.setItem(`preferences_${currentUser.id}`, JSON.stringify(preferences));
}

// Get user preference from localStorage
function getUserPreference(key, defaultValue) {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) return defaultValue;

    // Get user preferences
    const preferences = JSON.parse(localStorage.getItem(`preferences_${currentUser.id}`)) || {};

    // Return preference or default value
    return preferences[key] !== undefined ? preferences[key] : defaultValue;
}

// Clear user preferences
function clearUserPreferences() {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) return;

    // Clear preferences
    localStorage.removeItem(`preferences_${currentUser.id}`);
}

// Apply theme
function applyTheme(theme) {
    // Get root element
    const root = document.documentElement;

    // Add or remove theme classes from body
    const body = document.body;
    body.classList.remove('dark-mode', 'light-mode', 'blue-mode', 'default-mode');
    body.classList.add(`${theme}-mode`);

    // Apply theme
    switch (theme) {
        case 'dark':
            // Dark mode - true black and white theme
            root.style.setProperty('--primary-color', '#ffffff');
            root.style.setProperty('--secondary-color', '#cccccc');
            root.style.setProperty('--accent-color', '#999999');
            root.style.setProperty('--background-color', '#121212');
            root.style.setProperty('--text-color', '#ffffff');
            root.style.setProperty('--border-color', '#333333');
            root.style.setProperty('--shadow', '0 2px 10px rgba(0, 0, 0, 0.5)');

            // Widget and card backgrounds
            root.style.setProperty('--widget-bg', '#1e1e1e');
            root.style.setProperty('--header-bg', '#1e1e1e');
            root.style.setProperty('--sidebar-bg', '#1e1e1e');
            root.style.setProperty('--hover-bg', '#333333');

            // Update success, warning, danger colors for dark mode
            root.style.setProperty('--success-color', '#4caf50');
            root.style.setProperty('--warning-color', '#ff9800');
            root.style.setProperty('--danger-color', '#f44336');
            root.style.setProperty('--info-color', '#2196f3');
            break;

        case 'light':
            root.style.setProperty('--primary-color', '#555555');
            root.style.setProperty('--secondary-color', '#777777');
            root.style.setProperty('--accent-color', '#999999');
            root.style.setProperty('--background-color', '#f9f9f9');
            root.style.setProperty('--text-color', '#333333');
            root.style.setProperty('--border-color', '#e0e0e0');
            root.style.setProperty('--shadow', '0 2px 10px rgba(0, 0, 0, 0.1)');

            // Widget and card backgrounds
            root.style.setProperty('--widget-bg', '#ffffff');
            root.style.setProperty('--header-bg', '#ffffff');
            root.style.setProperty('--sidebar-bg', '#ffffff');
            root.style.setProperty('--hover-bg', '#f5f5f5');

            // Reset default colors
            root.style.setProperty('--success-color', '#28a745');
            root.style.setProperty('--warning-color', '#ffc107');
            root.style.setProperty('--danger-color', '#dc3545');
            root.style.setProperty('--info-color', '#17a2b8');
            break;

        case 'blue':
            root.style.setProperty('--primary-color', '#1890ff');
            root.style.setProperty('--secondary-color', '#096dd9');
            root.style.setProperty('--accent-color', '#40a9ff');
            root.style.setProperty('--background-color', '#ffffff');
            root.style.setProperty('--text-color', '#333333');
            root.style.setProperty('--border-color', '#e0e0e0');
            root.style.setProperty('--shadow', '0 2px 10px rgba(0, 0, 0, 0.1)');

            // Widget and card backgrounds
            root.style.setProperty('--widget-bg', '#ffffff');
            root.style.setProperty('--header-bg', '#ffffff');
            root.style.setProperty('--sidebar-bg', '#ffffff');
            root.style.setProperty('--hover-bg', '#f0f7ff');

            // Reset default colors
            root.style.setProperty('--success-color', '#28a745');
            root.style.setProperty('--warning-color', '#ffc107');
            root.style.setProperty('--danger-color', '#dc3545');
            root.style.setProperty('--info-color', '#17a2b8');
            break;

        default: // Default black and white theme
            root.style.setProperty('--primary-color', '#000000');
            root.style.setProperty('--secondary-color', '#333333');
            root.style.setProperty('--accent-color', '#555555');
            root.style.setProperty('--background-color', '#ffffff');
            root.style.setProperty('--text-color', '#333333');
            root.style.setProperty('--border-color', '#e0e0e0');
            root.style.setProperty('--shadow', '0 2px 10px rgba(0, 0, 0, 0.1)');

            // Widget and card backgrounds
            root.style.setProperty('--widget-bg', '#ffffff');
            root.style.setProperty('--header-bg', '#ffffff');
            root.style.setProperty('--sidebar-bg', '#ffffff');
            root.style.setProperty('--hover-bg', '#f5f5f5');

            // Reset default colors
            root.style.setProperty('--success-color', '#28a745');
            root.style.setProperty('--warning-color', '#ffc107');
            root.style.setProperty('--danger-color', '#dc3545');
            root.style.setProperty('--info-color', '#17a2b8');
            break;
    }

    // Update theme toggle button if it exists
    updateThemeToggleButton(theme);

    // Update theme options in customization modal if it's open
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        const optionTheme = option.getAttribute('data-theme');
        if (optionTheme === theme) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });

    // Save theme preference to localStorage
    saveUserPreference('dashboardTheme', theme);
}

// Update theme toggle button
function updateThemeToggleButton(theme) {
    const themeToggleLink = document.getElementById('theme-toggle');
    if (!themeToggleLink) return;

    const isDarkMode = theme === 'dark';
    themeToggleLink.innerHTML = `
        <i class="fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}"></i>
        ${isDarkMode ? 'Light Mode' : 'Dark Mode'}
    `;
}

// Update dashboard layout
function updateDashboardLayout(layout) {
    const dashboardWidgets = document.querySelector('.dashboard-widgets');

    if (!dashboardWidgets) return;

    // Apply layout
    switch (layout) {
        case '2-column':
            dashboardWidgets.style.gridTemplateColumns = 'repeat(2, 1fr)';
            break;
        case '3-column':
            dashboardWidgets.style.gridTemplateColumns = 'repeat(3, 1fr)';
            break;
        case 'mixed':
        default:
            dashboardWidgets.style.gridTemplateColumns = 'repeat(auto-fill, minmax(350px, 1fr))';
            break;
    }
}

// Update dashboard widgets
function updateDashboardWidgets() {
    // Get dashboard widgets container
    const dashboardWidgets = document.querySelector('.dashboard-widgets');
    if (!dashboardWidgets) return;

    // Get current widgets
    const currentWidgets = Array.from(dashboardWidgets.querySelectorAll('.widget'));

    // Check user preferences for each widget type
    const widgetTypes = ['stats', 'activity', 'tickets', 'calendar', 'documents'];

    // Create a map of existing widgets
    const existingWidgets = {};
    currentWidgets.forEach(widget => {
        const widgetClass = Array.from(widget.classList).find(cls => cls.startsWith('widget-'));
        if (widgetClass) {
            const widgetType = widgetClass.replace('widget-', '');
            existingWidgets[widgetType] = widget;
        }
    });

    // Clear dashboard
    dashboardWidgets.innerHTML = '';

    // Add widgets based on preferences
    widgetTypes.forEach(type => {
        const isActive = getUserPreference(`widget_${type}`, type === 'stats' || type === 'activity');

        if (isActive) {
            if (existingWidgets[type]) {
                // Re-add existing widget
                dashboardWidgets.appendChild(existingWidgets[type]);
            } else {
                // Create new widget
                const newWidget = createWidget(type);
                if (newWidget) {
                    dashboardWidgets.appendChild(newWidget);
                }
            }
        }
    });

    // If no widgets, add default widgets
    if (dashboardWidgets.children.length === 0) {
        const statsWidget = createWidget('stats');
        const activityWidget = createWidget('activity');

        if (statsWidget) dashboardWidgets.appendChild(statsWidget);
        if (activityWidget) dashboardWidgets.appendChild(activityWidget);
    }
}

// Create a new widget based on type
function createWidget(type) {
    switch (type) {
        case 'stats':
            return createStatsWidget();
        case 'activity':
            return createActivityWidget();
        case 'tickets':
            return createTicketsWidget();
        case 'calendar':
            return createCalendarWidget();
        case 'documents':
            return createDocumentsWidget();
        default:
            return null;
    }
}

// Create stats widget
function createStatsWidget() {
    const widget = document.createElement('div');
    widget.className = 'widget widget-stats';
    widget.innerHTML = `
        <div class="widget-header">
            <h3>Quick Stats</h3>
            <div class="widget-actions">
                <i class="fas fa-ellipsis-v"></i>
            </div>
        </div>
        <div class="widget-content">
            <div class="stat-item">
                <div class="stat-icon"><i class="fas fa-ticket-alt"></i></div>
                <div class="stat-info">
                    <h4>Open Tickets</h4>
                    <span class="stat-value">5</span>
                </div>
            </div>
            <div class="stat-item">
                <div class="stat-icon"><i class="fas fa-file-alt"></i></div>
                <div class="stat-info">
                    <h4>Documents</h4>
                    <span class="stat-value">24</span>
                </div>
            </div>
            <div class="stat-item">
                <div class="stat-icon"><i class="fas fa-bell"></i></div>
                <div class="stat-info">
                    <h4>Notifications</h4>
                    <span class="stat-value">3</span>
                </div>
            </div>
        </div>
    `;
    return widget;
}

// Create activity widget
function createActivityWidget() {
    const widget = document.createElement('div');
    widget.className = 'widget widget-activity';
    widget.innerHTML = `
        <div class="widget-header">
            <h3>Recent Activity</h3>
            <div class="widget-actions">
                <i class="fas fa-ellipsis-v"></i>
            </div>
        </div>
        <div class="widget-content">
            <ul class="activity-list">
                <li class="activity-item">
                    <div class="activity-icon"><i class="fas fa-ticket-alt"></i></div>
                    <div class="activity-info">
                        <p>Ticket #1234 was updated</p>
                        <span class="activity-time">2 hours ago</span>
                    </div>
                </li>
                <li class="activity-item">
                    <div class="activity-icon"><i class="fas fa-file-alt"></i></div>
                    <div class="activity-info">
                        <p>New document uploaded: "Product Specifications"</p>
                        <span class="activity-time">Yesterday</span>
                    </div>
                </li>
                <li class="activity-item">
                    <div class="activity-icon"><i class="fas fa-comment"></i></div>
                    <div class="activity-info">
                        <p>New comment on Ticket #1230</p>
                        <span class="activity-time">2 days ago</span>
                    </div>
                </li>
            </ul>
        </div>
    `;
    return widget;
}

// Create tickets widget
function createTicketsWidget() {
    const widget = document.createElement('div');
    widget.className = 'widget widget-tickets';
    widget.innerHTML = `
        <div class="widget-header">
            <h3>Recent Tickets</h3>
            <div class="widget-actions">
                <i class="fas fa-ellipsis-v"></i>
            </div>
        </div>
        <div class="widget-content">
            <ul class="ticket-list">
                <li class="ticket-item">
                    <div class="ticket-status open"></div>
                    <div class="ticket-info">
                        <h4>Unable to access account settings</h4>
                        <p>I'm trying to change my password but the settings page is not loading correctly.</p>
                        <div class="ticket-meta">
                            <span class="ticket-id">#1234</span>
                            <span class="ticket-time">2 hours ago</span>
                        </div>
                    </div>
                </li>
                <li class="ticket-item">
                    <div class="ticket-status in-progress"></div>
                    <div class="ticket-info">
                        <h4>Feature request: Dark mode</h4>
                        <p>Would it be possible to add a dark mode option to the portal?</p>
                        <div class="ticket-meta">
                            <span class="ticket-id">#1233</span>
                            <span class="ticket-time">1 day ago</span>
                        </div>
                    </div>
                </li>
                <li class="ticket-item">
                    <div class="ticket-status closed"></div>
                    <div class="ticket-info">
                        <h4>Login issue resolved</h4>
                        <p>Thank you for your help. I can now log in successfully.</p>
                        <div class="ticket-meta">
                            <span class="ticket-id">#1230</span>
                            <span class="ticket-time">3 days ago</span>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    `;
    return widget;
}

// Create calendar widget
function createCalendarWidget() {
    const widget = document.createElement('div');
    widget.className = 'widget widget-calendar';
    widget.innerHTML = `
        <div class="widget-header">
            <h3>Calendar</h3>
            <div class="widget-actions">
                <i class="fas fa-ellipsis-v"></i>
            </div>
        </div>
        <div class="widget-content">
            <div class="calendar-header">
                <button class="calendar-nav prev"><i class="fas fa-chevron-left"></i></button>
                <h4>June 2025</h4>
                <button class="calendar-nav next"><i class="fas fa-chevron-right"></i></button>
            </div>
            <div class="calendar-grid">
                <div class="calendar-day-names">
                    <span>Sun</span>
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                </div>
                <div class="calendar-days">
                    <div class="calendar-day prev-month">30</div>
                    <div class="calendar-day prev-month">31</div>
                    <div class="calendar-day">1</div>
                    <div class="calendar-day">2</div>
                    <div class="calendar-day">3</div>
                    <div class="calendar-day">4</div>
                    <div class="calendar-day">5</div>
                    <div class="calendar-day">6</div>
                    <div class="calendar-day">7</div>
                    <div class="calendar-day">8</div>
                    <div class="calendar-day">9</div>
                    <div class="calendar-day">10</div>
                    <div class="calendar-day">11</div>
                    <div class="calendar-day">12</div>
                    <div class="calendar-day">13</div>
                    <div class="calendar-day">14</div>
                    <div class="calendar-day current">15</div>
                    <div class="calendar-day event">16</div>
                    <div class="calendar-day">17</div>
                    <div class="calendar-day">18</div>
                    <div class="calendar-day">19</div>
                    <div class="calendar-day">20</div>
                    <div class="calendar-day event">21</div>
                    <div class="calendar-day">22</div>
                    <div class="calendar-day">23</div>
                    <div class="calendar-day">24</div>
                    <div class="calendar-day">25</div>
                    <div class="calendar-day">26</div>
                    <div class="calendar-day">27</div>
                    <div class="calendar-day">28</div>
                    <div class="calendar-day">29</div>
                    <div class="calendar-day">30</div>
                    <div class="calendar-day next-month">1</div>
                    <div class="calendar-day next-month">2</div>
                    <div class="calendar-day next-month">3</div>
                </div>
            </div>
            <div class="upcoming-events">
                <h5>Upcoming Events</h5>
                <div class="event-item">
                    <div class="event-date">Jun 16</div>
                    <div class="event-info">
                        <h6>Product Demo</h6>
                        <p>10:00 AM - 11:30 AM</p>
                    </div>
                </div>
                <div class="event-item">
                    <div class="event-date">Jun 21</div>
                    <div class="event-info">
                        <h6>Team Meeting</h6>
                        <p>2:00 PM - 3:00 PM</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    return widget;
}

// Create documents widget
function createDocumentsWidget() {
    const widget = document.createElement('div');
    widget.className = 'widget widget-documents';
    widget.innerHTML = `
        <div class="widget-header">
            <h3>Recent Documents</h3>
            <div class="widget-actions">
                <i class="fas fa-ellipsis-v"></i>
            </div>
        </div>
        <div class="widget-content">
            <ul class="document-list">
                <li class="document-item">
                    <div class="document-icon"><i class="fas fa-file-pdf"></i></div>
                    <div class="document-info">
                        <h4>Product Specifications.pdf</h4>
                        <div class="document-meta">
                            <span class="document-size">2.5 MB</span>
                            <span class="document-time">3 days ago</span>
                        </div>
                    </div>
                    <div class="document-actions">
                        <button><i class="fas fa-download"></i></button>
                    </div>
                </li>
                <li class="document-item">
                    <div class="document-icon"><i class="fas fa-file-word"></i></div>
                    <div class="document-info">
                        <h4>User Guide.docx</h4>
                        <div class="document-meta">
                            <span class="document-size">1.8 MB</span>
                            <span class="document-time">1 week ago</span>
                        </div>
                    </div>
                    <div class="document-actions">
                        <button><i class="fas fa-download"></i></button>
                    </div>
                </li>
                <li class="document-item">
                    <div class="document-icon"><i class="fas fa-file-excel"></i></div>
                    <div class="document-info">
                        <h4>Monthly Report.xlsx</h4>
                        <div class="document-meta">
                            <span class="document-size">0.5 MB</span>
                            <span class="document-time">2 weeks ago</span>
                        </div>
                    </div>
                    <div class="document-actions">
                        <button><i class="fas fa-download"></i></button>
                    </div>
                </li>
            </ul>
        </div>
    `;
    return widget;
}

// Show toast notification
function showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');

    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);

        // Add toast container styles
        const styleElement = document.createElement('style');
        document.head.appendChild(styleElement);

        styleElement.textContent = `
            .toast-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .toast {
                padding: 12px 20px;
                border-radius: 4px;
                background-color: var(--widget-bg, white);
                color: var(--text-color, #333);
                box-shadow: var(--shadow, 0 2px 10px rgba(0, 0, 0, 0.2));
                display: flex;
                align-items: center;
                gap: 10px;
                min-width: 250px;
                max-width: 350px;
                animation: toastFadeIn 0.3s ease, toastFadeOut 0.3s ease 2.7s;
                opacity: 0;
                transform: translateY(20px);
                animation-fill-mode: forwards;
                border: 1px solid var(--border-color);
            }

            @keyframes toastFadeIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes toastFadeOut {
                from {
                    opacity: 1;
                    transform: translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateY(-20px);
                }
            }

            .toast-icon {
                font-size: 18px;
            }

            .toast-message {
                flex: 1;
            }

            .toast-close {
                background: transparent;
                border: none;
                color: var(--accent-color, #666);
                cursor: pointer;
                font-size: 16px;
                transition: var(--transition);
            }

            .toast-close:hover {
                color: var(--text-color);
                transform: scale(1.1);
            }

            .toast.info .toast-icon {
                color: #1890ff;
            }

            .toast.success .toast-icon {
                color: #52c41a;
            }

            .toast.warning .toast-icon {
                color: #faad14;
            }

            .toast.error .toast-icon {
                color: #f5222d;
            }
        `;
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    // Get icon based on type
    const icon = getNotificationIcon(type);

    // Set toast content
    toast.innerHTML = `
        <div class="toast-icon"><i class="fas ${icon}"></i></div>
        <div class="toast-message">${message}</div>
        <button class="toast-close"><i class="fas fa-times"></i></button>
    `;

    // Add to container
    toastContainer.appendChild(toast);

    // Add close event
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', function() {
        toast.style.opacity = '0';
        setTimeout(() => {
            toast.remove();
        }, 300);
    });

    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);

    return toast;
}

// Load user preferences
function loadUserPreferences() {
    // Apply theme
    const theme = getUserPreference('dashboardTheme', 'default');
    applyTheme(theme);

    // Add theme toggle button to user menu
    addThemeToggleButton();

    // Apply layout
    const layout = getUserPreference('dashboardLayout', 'mixed');
    updateDashboardLayout(layout);

    // Apply widget preferences
    updateDashboardWidgets();
}

// Add theme toggle button to user menu
function addThemeToggleButton() {
    const userMenu = document.querySelector('.dropdown-menu ul');
    if (!userMenu) return;

    // Check if button already exists
    if (document.getElementById('theme-toggle')) return;

    // Get current theme
    const currentTheme = getUserPreference('dashboardTheme', 'default');
    const isDarkMode = currentTheme === 'dark';

    // Create theme toggle item
    const themeToggleItem = document.createElement('li');
    themeToggleItem.innerHTML = `
        <a href="#" id="theme-toggle">
            <i class="fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}"></i>
            ${isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </a>
    `;

    // Add to menu
    userMenu.appendChild(themeToggleItem);

    // Add click event
    const themeToggleLink = document.getElementById('theme-toggle');
    if (themeToggleLink) {
        themeToggleLink.addEventListener('click', function(e) {
            e.preventDefault();

            // Get current theme
            const currentTheme = getUserPreference('dashboardTheme', 'default');
            const isDarkMode = currentTheme === 'dark';

            // Toggle theme
            const newTheme = isDarkMode ? 'default' : 'dark';
            saveUserPreference('dashboardTheme', newTheme);
            applyTheme(newTheme);

            // Update button text and icon
            const icon = this.querySelector('i');
            if (icon) {
                icon.className = `fas ${newTheme === 'dark' ? 'fa-sun' : 'fa-moon'}`;
            }
            this.innerHTML = `
                <i class="fas ${newTheme === 'dark' ? 'fa-sun' : 'fa-moon'}"></i>
                ${newTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            `;

            // Update theme options in customization modal if it's open
            const themeOptions = document.querySelectorAll('.theme-option');
            themeOptions.forEach(option => {
                const optionTheme = option.getAttribute('data-theme');
                if (optionTheme === newTheme) {
                    option.classList.add('active');
                } else {
                    option.classList.remove('active');
                }
            });
        });
    }
}

// Get notification icon based on type
function getNotificationIcon(type) {
    switch (type) {
        case 'success':
            return 'fa-check-circle';
        case 'warning':
            return 'fa-exclamation-triangle';
        case 'error':
            return 'fa-times-circle';
        case 'info':
        default:
            return 'fa-info-circle';
    }
}

// Handle responsiveness
function handleResponsiveness() {
    // Check if we're on the dashboard page
    const dashboardWidgets = document.querySelector('.dashboard-widgets');
    if (!dashboardWidgets) return;

    // Add resize event listener
    window.addEventListener('resize', function() {
        adjustWidgetLayout();
    });

    // Initial adjustment
    adjustWidgetLayout();
}

// Adjust widget layout based on screen size
function adjustWidgetLayout() {
    const dashboardWidgets = document.querySelector('.dashboard-widgets');
    if (!dashboardWidgets) return;

    const windowWidth = window.innerWidth;

    // Adjust grid columns based on screen width
    if (windowWidth < 768) {
        dashboardWidgets.style.gridTemplateColumns = '1fr';
    } else if (windowWidth < 1200) {
        dashboardWidgets.style.gridTemplateColumns = 'repeat(2, 1fr)';
    } else {
        dashboardWidgets.style.gridTemplateColumns = 'repeat(auto-fill, minmax(350px, 1fr))';
    }
}
