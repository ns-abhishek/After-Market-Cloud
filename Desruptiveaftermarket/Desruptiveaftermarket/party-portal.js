// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!SecurityService.isLoggedIn()) {
        // Redirect to login page
        if (typeof NavigationController !== 'undefined') {
            NavigationController.navigateTo('LOGIN');
        } else {
            window.location.href = 'login.html';
        }
        return;
    }

    // Initialize the portal
    initPortal();

    // Update notification badges
    updateNotificationBadges();

    // Load the dashboard content
    loadDashboardContent();

    // Set up event listeners
    setupEventListeners();

    // Initialize language
    initLanguage();

    // Set user info
    setUserInfo();

    // Set up security features
    setupSecurityFeatures();
});

// Function to initialize the portal
function initPortal() {
    // Initialize data service
    if (typeof DataService !== 'undefined') {
        DataService.initialize();
    }

    // Get user profile
    const userProfile = getUserProfile();

    // Apply user preferences
    if (userProfile && userProfile.preferences) {
        applyUserPreferences(userProfile.preferences);
    }
}

// Function to get user profile
function getUserProfile() {
    if (typeof DataService !== 'undefined') {
        return DataService.getUserProfile();
    }
    return null;
}

// Function to apply user preferences
function applyUserPreferences(preferences) {
    // Apply theme if set
    if (preferences.theme) {
        document.body.setAttribute('data-theme', preferences.theme);
    }

    // Apply dashboard layout if set
    if (preferences.dashboardLayout) {
        // This would be implemented to arrange dashboard widgets
        // For now, we'll just log it
        console.log('Applying dashboard layout:', preferences.dashboardLayout);
    }
}

// Function to save user preferences
function saveUserPreferences(preferences) {
    const userProfile = getUserProfile();
    if (userProfile) {
        userProfile.preferences = { ...userProfile.preferences, ...preferences };
        if (typeof DataService !== 'undefined') {
            DataService.saveUserProfile(userProfile);
        }
    }
}

// Function to set user info in the header
function setUserInfo() {
    // Get current user from SecurityService
    const currentUser = SecurityService.getCurrentUser();
    if (currentUser) {
        const userAvatar = document.querySelector('.user-avatar');
        const userName = document.querySelector('.user-name');
        const userRole = document.querySelector('.user-role');

        if (userAvatar) {
            userAvatar.textContent = `${currentUser.firstName.charAt(0)}${currentUser.lastName.charAt(0)}`;
        }

        if (userName) {
            userName.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
        }

        if (userRole) {
            userRole.textContent = currentUser.role;
        }
    }
}

// Function to set up security features
function setupSecurityFeatures() {
    // Apply role-based access control
    applyRbac();

    // Set up session timeout
    setupSessionTimeout();

    // Log user activity
    SecurityService.logAuditEvent('PAGE_VIEW', { page: 'dashboard' });
}

// Function to apply role-based access control
function applyRbac() {
    // Get current user permissions
    const currentUser = SecurityService.getCurrentUser();
    if (!currentUser) return;

    // Hide elements based on permissions
    const restrictedElements = document.querySelectorAll('[data-permission]');
    restrictedElements.forEach(element => {
        const requiredPermission = element.getAttribute('data-permission');
        if (!SecurityService.hasPermission(requiredPermission)) {
            element.style.display = 'none';
        }
    });

    // Add permission attributes to sensitive elements

    // Admin-only features
    const adminElements = document.querySelectorAll('.admin-only');
    adminElements.forEach(element => {
        element.setAttribute('data-permission', 'canManageUsers');
        if (!SecurityService.hasPermission('canManageUsers')) {
            element.style.display = 'none';
        }
    });

    // Export data buttons
    const exportButtons = document.querySelectorAll('[id$="ExportBtn"], [id$="exportDataBtn"]');
    exportButtons.forEach(button => {
        button.setAttribute('data-permission', 'canExportData');
        if (!SecurityService.hasPermission('canExportData')) {
            button.style.display = 'none';
        }
    });

    // Delete buttons
    const deleteButtons = document.querySelectorAll('[id$="DeleteBtn"], [id$="deleteSelectedBtn"]');
    deleteButtons.forEach(button => {
        button.setAttribute('data-permission', 'canDeleteData');
        if (!SecurityService.hasPermission('canDeleteData')) {
            button.style.display = 'none';
        }
    });
}

// Function to set up session timeout
function setupSessionTimeout() {
    // Set up session timeout warning
    let sessionTimeoutWarning;
    let sessionTimeout;

    // Reset timers on user activity
    const resetTimers = () => {
        clearTimeout(sessionTimeoutWarning);
        clearTimeout(sessionTimeout);

        // Show warning after 25 minutes of inactivity
        sessionTimeoutWarning = setTimeout(() => {
            if (typeof NavigationController !== 'undefined') {
                NavigationController.showNotification('Your session will expire in 5 minutes due to inactivity. Please save your work.', 'warning', 10000);
            } else {
                alert('Your session will expire in 5 minutes due to inactivity. Please save your work.');
            }
        }, 25 * 60 * 1000);

        // Log out after 30 minutes of inactivity
        sessionTimeout = setTimeout(() => {
            SecurityService.logout();
            if (typeof NavigationController !== 'undefined') {
                NavigationController.navigateTo('LOGIN');
            } else {
                window.location.href = 'login.html';
            }
        }, 30 * 60 * 1000);
    };

    // Reset timers on page load
    resetTimers();

    // Reset timers on user activity
    const events = ['mousedown', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
        document.addEventListener(event, resetTimers, false);
    });
}

// Function to update notification badges
function updateNotificationBadges() {
    if (typeof DataService !== 'undefined') {
        // Update message badge
        const messageBadge = document.querySelector('.header-action[title="Messages"] .notification-badge');
        if (messageBadge) {
            const unreadMessages = DataService.getUnreadMessagesCount();
            messageBadge.textContent = unreadMessages;
            messageBadge.style.display = unreadMessages > 0 ? 'flex' : 'none';
        }

        // Update notification badge
        const notificationBadge = document.querySelector('.header-action[title="Notifications"] .notification-badge');
        if (notificationBadge) {
            const unreadNotifications = DataService.getUnreadNotificationsCount();
            notificationBadge.textContent = unreadNotifications;
            notificationBadge.style.display = unreadNotifications > 0 ? 'flex' : 'none';
        }
    }
}

// Function to initialize language
function initLanguage() {
    // Get preferred language from data service or use browser language
    let preferredLanguage = 'en';

    if (typeof DataService !== 'undefined') {
        preferredLanguage = DataService.getLanguagePreference();
    } else {
        preferredLanguage = localStorage.getItem('preferredLanguage') ||
                           navigator.language.split('-')[0] ||
                           'en';
    }

    // Set the language selector value
    const languageSelector = document.getElementById('languageSelector');
    if (languageSelector) {
        languageSelector.value = preferredLanguage;
    }

    // Translate the UI
    translateUI(preferredLanguage);
}

// Function to set up event listeners
function setupEventListeners() {
    // Menu toggle for mobile and desktop
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const closeSidebar = document.getElementById('closeSidebar');
    const mainContent = document.querySelector('.main-content');

    if (menuToggle && sidebar) {
        // Check if sidebar is already expanded
        let sidebarExpanded = sidebar.classList.contains('expanded');

        // Set initial state based on screen size
        if (window.innerWidth <= 768) {
            // Mobile view - sidebar starts closed
            sidebar.style.width = '0';
            if (mainContent) mainContent.style.marginLeft = '0';
        } else {
            // Desktop view - sidebar starts collapsed to icon-only mode
            sidebar.style.width = sidebarExpanded ? '280px' : '70px';
            if (mainContent) mainContent.style.marginLeft = sidebarExpanded ? '280px' : '70px';
        }

        // Menu toggle click handler
        menuToggle.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                // Mobile behavior - full open/close with overlay
                if (sidebar.style.width === '0px' || sidebar.style.width === '') {
                    sidebar.style.width = '280px';
                    if (sidebarOverlay) sidebarOverlay.classList.add('active');
                } else {
                    sidebar.style.width = '0';
                    if (sidebarOverlay) sidebarOverlay.classList.remove('active');
                }
            } else {
                // Desktop behavior - toggle between collapsed and expanded
                if (sidebar.style.width === '70px' || !sidebarExpanded) {
                    sidebar.style.width = '280px';
                    sidebar.classList.add('expanded');
                    if (mainContent) mainContent.style.marginLeft = '280px';
                    sidebarExpanded = true;
                } else {
                    sidebar.style.width = '70px';
                    sidebar.classList.remove('expanded');
                    if (mainContent) mainContent.style.marginLeft = '70px';
                    sidebarExpanded = false;
                }
            }
        });

        // Overlay click handler for mobile
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', function() {
                sidebar.style.width = '0';
                sidebarOverlay.classList.remove('active');
            });
        }

        // Close button handler
        if (closeSidebar) {
            closeSidebar.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    sidebar.style.width = '0';
                    if (sidebarOverlay) sidebarOverlay.classList.remove('active');
                } else {
                    sidebar.style.width = '70px';
                    sidebar.classList.remove('expanded');
                    if (mainContent) mainContent.style.marginLeft = '70px';
                    sidebarExpanded = false;
                }
            });
        }
    }

    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Prevent default only if it's a placeholder link
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
            }

            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));

            // Add active class to clicked link
            this.classList.add('active');

            // Handle navigation based on the link's data attributes or text
            const section = this.querySelector('span').getAttribute('data-i18n');
            handleNavigation(section);

            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
                sidebarOverlay.classList.remove('active');
            }
        });
    });

    // Language selector
    const languageSelector = document.getElementById('languageSelector');
    if (languageSelector) {
        languageSelector.addEventListener('change', function() {
            const selectedLanguage = this.value;

            // Save language preference
            if (typeof DataService !== 'undefined') {
                DataService.saveLanguagePreference(selectedLanguage);
            } else {
                localStorage.setItem('preferredLanguage', selectedLanguage);
            }

            // Translate the UI
            translateUI(selectedLanguage);
        });
    }

    // Header actions
    setupHeaderActions();

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // Confirm logout
            if (typeof NavigationController !== 'undefined') {
                NavigationController.confirmAction(
                    'Are you sure you want to log out?',
                    function() {
                        // Log audit event
                        SecurityService.logAuditEvent('LOGOUT', {
                            username: SecurityService.getCurrentUser()?.username
                        });

                        // Perform logout
                        SecurityService.logout();

                        // Navigate to login page
                        if (typeof NavigationController !== 'undefined') {
                            NavigationController.navigateTo('LOGIN');
                        } else {
                            window.location.href = 'login.html';
                        }
                    }
                );
            } else {
                if (confirm('Are you sure you want to log out?')) {
                    // Perform logout
                    SecurityService.logout();

                    // Navigate to login page
                    window.location.href = 'login.html';
                }
            }
        });
    }
}

// Function to handle navigation
function handleNavigation(section) {
    // Clear the page content
    const pageContent = document.getElementById('dashboardContent');

    // Load the appropriate content based on the section
    switch (section) {
        case 'my_dashboard':
            loadDashboardContent();
            break;
        case 'party_list':
            // Check if we should navigate to a separate page
            if (typeof NavigationController !== 'undefined' && NavigationController.navigateTo) {
                NavigationController.navigateTo('PARTY_LIST');
                return;
            }
            loadPartyList();
            break;
        case 'customer':
            loadCustomerList();
            break;
        case 'vendor':
            loadVendorList();
            break;
        case 'profile':
            // Check if we should navigate to a separate page
            if (typeof NavigationController !== 'undefined' && NavigationController.navigateTo) {
                NavigationController.navigateTo('PROFILE');
                return;
            }
            loadUserProfile();
            break;
        case 'invoices':
            // Check if we should navigate to a separate page
            if (typeof NavigationController !== 'undefined' && NavigationController.navigateTo) {
                NavigationController.navigateTo('INVOICES');
                return;
            }
            loadInvoices();
            break;
        case 'payments':
            // Check if we should navigate to a separate page
            if (typeof NavigationController !== 'undefined' && NavigationController.navigateTo) {
                NavigationController.navigateTo('PAYMENTS');
                return;
            }
            loadPayments();
            break;
        case 'documents':
            // Check if we should navigate to a separate page
            if (typeof NavigationController !== 'undefined' && NavigationController.navigateTo) {
                NavigationController.navigateTo('DOCUMENTS');
                return;
            }
            loadDocuments();
            break;
        case 'help_center':
            // Check if we should navigate to a separate page
            if (typeof NavigationController !== 'undefined' && NavigationController.navigateTo) {
                NavigationController.navigateTo('HELP_CENTER');
                return;
            }
            loadHelpCenter();
            break;
        case 'user_guides':
            loadUserGuides();
            break;
        case 'video_tutorials':
            loadVideoTutorials();
            break;
        case 'contact_support':
            loadContactSupport();
            break;
        default:
            // If no match, load dashboard
            loadDashboardContent();
    }
}

// Function to setup header actions
function setupHeaderActions() {
    // Notifications button
    const notificationsBtn = document.querySelector('.header-action[title="Notifications"]');
    if (notificationsBtn) {
        notificationsBtn.addEventListener('click', function() {
            // Show notifications panel (to be implemented)
            showNotifications();
        });
    }

    // Messages button
    const messagesBtn = document.querySelector('.header-action[title="Messages"]');
    if (messagesBtn) {
        messagesBtn.addEventListener('click', function() {
            // Show messages panel (to be implemented)
            showMessages();
        });
    }

    // Help button
    const helpBtn = document.querySelector('.header-action[title="Help"]');
    if (helpBtn) {
        helpBtn.addEventListener('click', function() {
            // Navigate to help center
            handleNavigation('help_center');
        });
    }

    // User profile
    const userProfile = document.querySelector('.user-profile');
    if (userProfile) {
        userProfile.addEventListener('click', function() {
            // Navigate to profile page
            handleNavigation('profile');
        });
    }
}

// Function to show notifications panel
function showNotifications() {
    // Create notifications panel if it doesn't exist
    let notificationsPanel = document.getElementById('notificationsPanel');
    if (!notificationsPanel) {
        notificationsPanel = document.createElement('div');
        notificationsPanel.id = 'notificationsPanel';
        notificationsPanel.className = 'modal';
        notificationsPanel.style.display = 'none';
        notificationsPanel.style.position = 'fixed';
        notificationsPanel.style.top = '0';
        notificationsPanel.style.right = '0';
        notificationsPanel.style.bottom = '0';
        notificationsPanel.style.width = '350px';
        notificationsPanel.style.backgroundColor = 'white';
        notificationsPanel.style.boxShadow = '-2px 0 5px rgba(0, 0, 0, 0.1)';
        notificationsPanel.style.zIndex = '1000';
        notificationsPanel.style.transform = 'translateX(100%)';
        notificationsPanel.style.transition = 'transform 0.3s ease';

        // Add panel content
        notificationsPanel.innerHTML = `
            <div style="padding: 16px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
                <h2 style="font-size: 18px; margin: 0;" data-i18n="notifications">Notifications</h2>
                <button id="closeNotificationsPanel" style="background: none; border: none; cursor: pointer;">
                    <i class="material-icons">close</i>
                </button>
            </div>
            <div id="notificationsList" style="overflow-y: auto; max-height: calc(100% - 60px); padding: 16px;">
                <!-- Notifications will be loaded here -->
            </div>
        `;

        document.body.appendChild(notificationsPanel);

        // Add close button event listener
        document.getElementById('closeNotificationsPanel').addEventListener('click', function() {
            notificationsPanel.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notificationsPanel.style.display = 'none';
            }, 300);
        });
    }

    // Load notifications
    const notificationsList = document.getElementById('notificationsList');
    if (notificationsList) {
        notificationsList.innerHTML = '';

        if (typeof DataService !== 'undefined') {
            const notifications = DataService.getNotifications();

            if (notifications.length === 0) {
                notificationsList.innerHTML = '<p style="text-align: center; color: var(--accent-color);">No notifications</p>';
            } else {
                notifications.forEach(notification => {
                    const notificationItem = document.createElement('div');
                    notificationItem.style.padding = '12px';
                    notificationItem.style.marginBottom = '8px';
                    notificationItem.style.borderRadius = 'var(--border-radius)';
                    notificationItem.style.backgroundColor = notification.read ? 'var(--secondary-color)' : 'rgba(33, 150, 243, 0.1)';

                    // Set notification icon based on type
                    let iconName = 'info';
                    let iconColor = 'var(--info-color)';

                    switch (notification.type) {
                        case 'success':
                            iconName = 'check_circle';
                            iconColor = 'var(--success-color)';
                            break;
                        case 'error':
                            iconName = 'error';
                            iconColor = 'var(--error-color)';
                            break;
                        case 'warning':
                            iconName = 'warning';
                            iconColor = 'var(--warning-color)';
                            break;
                    }

                    notificationItem.innerHTML = `
                        <div style="display: flex; gap: 12px;">
                            <div style="color: ${iconColor};">
                                <i class="material-icons">${iconName}</i>
                            </div>
                            <div style="flex: 1;">
                                <div style="font-weight: 500; margin-bottom: 4px;">${notification.title}</div>
                                <div style="margin-bottom: 8px;">${notification.message}</div>
                                <div style="font-size: 12px; color: var(--accent-color);">${new Date(notification.date).toLocaleString()}</div>
                            </div>
                        </div>
                    `;

                    notificationsList.appendChild(notificationItem);

                    // Mark notification as read
                    if (!notification.read) {
                        DataService.markNotificationAsRead(notification.id);
                    }
                });
            }

            // Update badges
            updateNotificationBadges();
        }
    }

    // Show panel
    notificationsPanel.style.display = 'block';
    setTimeout(() => {
        notificationsPanel.style.transform = 'translateX(0)';
    }, 10);
}

// Function to show messages panel
function showMessages() {
    // Create messages panel if it doesn't exist
    let messagesPanel = document.getElementById('messagesPanel');
    if (!messagesPanel) {
        messagesPanel = document.createElement('div');
        messagesPanel.id = 'messagesPanel';
        messagesPanel.className = 'modal';
        messagesPanel.style.display = 'none';
        messagesPanel.style.position = 'fixed';
        messagesPanel.style.top = '0';
        messagesPanel.style.right = '0';
        messagesPanel.style.bottom = '0';
        messagesPanel.style.width = '350px';
        messagesPanel.style.backgroundColor = 'white';
        messagesPanel.style.boxShadow = '-2px 0 5px rgba(0, 0, 0, 0.1)';
        messagesPanel.style.zIndex = '1000';
        messagesPanel.style.transform = 'translateX(100%)';
        messagesPanel.style.transition = 'transform 0.3s ease';

        // Add panel content
        messagesPanel.innerHTML = `
            <div style="padding: 16px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
                <h2 style="font-size: 18px; margin: 0;" data-i18n="messages">Messages</h2>
                <button id="closeMessagesPanel" style="background: none; border: none; cursor: pointer;">
                    <i class="material-icons">close</i>
                </button>
            </div>
            <div id="messagesList" style="overflow-y: auto; max-height: calc(100% - 60px); padding: 16px;">
                <!-- Messages will be loaded here -->
            </div>
        `;

        document.body.appendChild(messagesPanel);

        // Add close button event listener
        document.getElementById('closeMessagesPanel').addEventListener('click', function() {
            messagesPanel.style.transform = 'translateX(100%)';
            setTimeout(() => {
                messagesPanel.style.display = 'none';
            }, 300);
        });
    }

    // Load messages
    const messagesList = document.getElementById('messagesList');
    if (messagesList) {
        messagesList.innerHTML = '';

        if (typeof DataService !== 'undefined') {
            const messages = DataService.getMessages();

            if (messages.length === 0) {
                messagesList.innerHTML = '<p style="text-align: center; color: var(--accent-color);">No messages</p>';
            } else {
                messages.forEach(message => {
                    const messageItem = document.createElement('div');
                    messageItem.style.padding = '12px';
                    messageItem.style.marginBottom = '8px';
                    messageItem.style.borderRadius = 'var(--border-radius)';
                    messageItem.style.backgroundColor = message.read ? 'var(--secondary-color)' : 'rgba(33, 150, 243, 0.1)';

                    messageItem.innerHTML = `
                        <div style="display: flex; gap: 12px;">
                            <div style="width: 40px; height: 40px; border-radius: 50%; background-color: var(--primary-color); color: white; display: flex; align-items: center; justify-content: center; font-weight: 500;">
                                ${message.sender.avatar || message.sender.name.charAt(0)}
                            </div>
                            <div style="flex: 1;">
                                <div style="font-weight: 500; margin-bottom: 4px;">${message.subject}</div>
                                <div style="margin-bottom: 8px;">${message.message}</div>
                                <div style="display: flex; justify-content: space-between;">
                                    <div style="font-size: 12px; color: var(--accent-color);">From: ${message.sender.name}</div>
                                    <div style="font-size: 12px; color: var(--accent-color);">${new Date(message.date).toLocaleString()}</div>
                                </div>
                            </div>
                        </div>
                    `;

                    messagesList.appendChild(messageItem);

                    // Mark message as read
                    if (!message.read) {
                        DataService.markMessageAsRead(message.id);
                    }
                });
            }

            // Update badges
            updateNotificationBadges();
        }
    }

    // Show panel
    messagesPanel.style.display = 'block';
    setTimeout(() => {
        messagesPanel.style.transform = 'translateX(0)';
    }, 10);
}

// Function to load dashboard content
function loadDashboardContent() {
    const dashboardContent = document.getElementById('dashboardContent');

    // Clear existing content
    dashboardContent.innerHTML = '';

    // Create dashboard header
    const header = document.createElement('div');
    header.className = 'dashboard-header';
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.marginBottom = '20px';

    header.innerHTML = `
        <h1 style="font-size: 24px; font-weight: 500;" data-i18n="my_dashboard">My Dashboard</h1>
        <button id="customizeDashboardBtn" style="padding: 8px 16px; background-color: var(--primary-color); color: white; border: none; border-radius: var(--border-radius); cursor: pointer; display: flex; align-items: center; gap: 8px;">
            <i class="material-icons" style="font-size: 16px;">edit</i>
            <span data-i18n="customize_dashboard">Customize Dashboard</span>
        </button>
    `;

    dashboardContent.appendChild(header);

    // Create dashboard grid
    const dashboard = document.createElement('div');
    dashboard.className = 'dashboard';

    // Get statistics
    let totalParties = 0;
    let newParties = 0;
    let totalInvoiced = 0;
    let totalReceived = 0;

    if (typeof DataService !== 'undefined') {
        const parties = DataService.getParties();
        totalParties = parties.length;

        // Count parties created in the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        newParties = parties.filter(party => {
            const createdAt = new Date(party.createdAt);
            return createdAt >= thirtyDaysAgo;
        }).length;

        // Calculate invoice totals
        const invoices = DataService.getInvoices();
        totalInvoiced = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);

        // Calculate payment totals
        const payments = DataService.getPayments();
        totalReceived = payments.reduce((sum, payment) => sum + payment.amount, 0);
    }

    // Add dashboard cards
    dashboard.innerHTML = `
        <!-- Recent Activity Card -->
        <div class="dashboard-card">
            <div class="dashboard-card-header">
                <h2 class="dashboard-card-title" data-i18n="recent_activity">Recent Activity</h2>
                <div class="dashboard-card-actions">
                    <button class="dashboard-card-action refresh-activity" title="Refresh">
                        <i class="material-icons">refresh</i>
                    </button>
                    <button class="dashboard-card-action activity-more-options" title="More">
                        <i class="material-icons">more_vert</i>
                    </button>
                </div>
            </div>
            <div class="dashboard-card-content" id="recentActivityContent">
                <ul style="list-style: none; margin: 0; padding: 0;">
                    <li style="padding: 10px 0; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; gap: 10px;">
                        <div style="width: 36px; height: 36px; border-radius: 50%; background-color: var(--info-color); display: flex; align-items: center; justify-content: center; color: white;">
                            <i class="material-icons">person_add</i>
                        </div>
                        <div>
                            <div style="font-weight: 500;">New customer added</div>
                            <div style="font-size: 12px; color: var(--accent-color);">Today, 10:30 AM</div>
                        </div>
                    </li>
                    <li style="padding: 10px 0; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; gap: 10px;">
                        <div style="width: 36px; height: 36px; border-radius: 50%; background-color: var(--success-color); display: flex; align-items: center; justify-content: center; color: white;">
                            <i class="material-icons">attach_money</i>
                        </div>
                        <div>
                            <div style="font-weight: 500;">Payment received</div>
                            <div style="font-size: 12px; color: var(--accent-color);">Yesterday, 3:45 PM</div>
                        </div>
                    </li>
                    <li style="padding: 10px 0; display: flex; align-items: center; gap: 10px;">
                        <div style="width: 36px; height: 36px; border-radius: 50%; background-color: var(--warning-color); display: flex; align-items: center; justify-content: center; color: white;">
                            <i class="material-icons">description</i>
                        </div>
                        <div>
                            <div style="font-weight: 500;">Invoice generated</div>
                            <div style="font-size: 12px; color: var(--accent-color);">Yesterday, 11:20 AM</div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>

        <!-- Quick Actions Card -->
        <div class="dashboard-card">
            <div class="dashboard-card-header">
                <h2 class="dashboard-card-title" data-i18n="quick_actions">Quick Actions</h2>
            </div>
            <div class="dashboard-card-content">
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                    <button id="addPartyBtn" style="padding: 12px; background-color: var(--secondary-color); border: none; border-radius: var(--border-radius); cursor: pointer; text-align: center; transition: var(--transition);">
                        <i class="material-icons" style="font-size: 24px; margin-bottom: 5px;">person_add</i>
                        <div data-i18n="add_party">Add Party</div>
                    </button>
                    <button id="createInvoiceBtn" style="padding: 12px; background-color: var(--secondary-color); border: none; border-radius: var(--border-radius); cursor: pointer; text-align: center; transition: var(--transition);">
                        <i class="material-icons" style="font-size: 24px; margin-bottom: 5px;">receipt</i>
                        <div data-i18n="create_invoice">Create Invoice</div>
                    </button>
                    <button id="uploadDocumentBtn" style="padding: 12px; background-color: var(--secondary-color); border: none; border-radius: var(--border-radius); cursor: pointer; text-align: center; transition: var(--transition);">
                        <i class="material-icons" style="font-size: 24px; margin-bottom: 5px;">attach_file</i>
                        <div data-i18n="upload_document">Upload Document</div>
                    </button>
                    <button id="getSupportBtn" style="padding: 12px; background-color: var(--secondary-color); border: none; border-radius: var(--border-radius); cursor: pointer; text-align: center; transition: var(--transition);">
                        <i class="material-icons" style="font-size: 24px; margin-bottom: 5px;">support_agent</i>
                        <div data-i18n="get_support">Get Support</div>
                    </button>
                </div>
            </div>
        </div>

        <!-- Statistics Card -->
        <div class="dashboard-card">
            <div class="dashboard-card-header">
                <h2 class="dashboard-card-title" data-i18n="statistics">Statistics</h2>
                <div class="dashboard-card-actions">
                    <button class="dashboard-card-action refresh-stats" title="Refresh">
                        <i class="material-icons">refresh</i>
                    </button>
                    <button class="dashboard-card-action toggle-chart-view" title="Toggle View">
                        <i class="material-icons">bar_chart</i>
                    </button>
                    <button class="dashboard-card-action" title="More" id="statsMoreOptions">
                        <i class="material-icons">more_vert</i>
                    </button>
                </div>
            </div>
            <div class="dashboard-card-content">
                <!-- Stats Grid View -->
                <div class="stats-grid-view" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                    <div style="text-align: center; padding: 15px; background-color: var(--secondary-color); border-radius: var(--border-radius);">
                        <div style="font-size: 24px; font-weight: 500; margin-bottom: 5px;">${totalParties}</div>
                        <div style="color: var(--accent-color);" data-i18n="total_parties">Total Parties</div>
                    </div>
                    <div style="text-align: center; padding: 15px; background-color: var(--secondary-color); border-radius: var(--border-radius);">
                        <div style="font-size: 24px; font-weight: 500; margin-bottom: 5px;">${newParties}</div>
                        <div style="color: var(--accent-color);" data-i18n="new_this_month">New This Month</div>
                    </div>
                    <div style="text-align: center; padding: 15px; background-color: var(--secondary-color); border-radius: var(--border-radius);">
                        <div style="font-size: 24px; font-weight: 500; margin-bottom: 5px;">$${totalInvoiced.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        <div style="color: var(--accent-color);" data-i18n="total_invoiced">Total Invoiced</div>
                    </div>
                    <div style="text-align: center; padding: 15px; background-color: var(--secondary-color); border-radius: var(--border-radius);">
                        <div style="font-size: 24px; font-weight: 500; margin-bottom: 5px;">$${totalReceived.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        <div style="color: var(--accent-color);" data-i18n="total_received">Total Received</div>
                    </div>
                </div>

                <!-- Charts View (hidden by default) -->
                <div class="stats-charts-view" style="display: none; margin-top: 15px;">
                    <div style="display: flex; flex-wrap: wrap; gap: 20px;">
                        <div style="flex: 1; min-width: 300px;">
                            <canvas id="partiesChart" height="200"></canvas>
                        </div>
                        <div style="flex: 1; min-width: 300px;">
                            <canvas id="financialsChart" height="200"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Announcements Card -->
        <div class="dashboard-card">
            <div class="dashboard-card-header">
                <h2 class="dashboard-card-title" data-i18n="announcements">Announcements</h2>
            </div>
            <div class="dashboard-card-content">
                <div style="padding: 15px; background-color: var(--secondary-color); border-radius: var(--border-radius); margin-bottom: 10px;">
                    <h3 style="font-size: 16px; margin-bottom: 5px;">System Maintenance</h3>
                    <p style="margin-bottom: 5px;">Scheduled maintenance on July 15, 2023 from 2:00 AM to 4:00 AM UTC.</p>
                    <div style="font-size: 12px; color: var(--accent-color);">Posted on July 10, 2023</div>
                </div>
                <div style="padding: 15px; background-color: var(--secondary-color); border-radius: var(--border-radius);">
                    <h3 style="font-size: 16px; margin-bottom: 5px;">New Features Released</h3>
                    <p style="margin-bottom: 5px;">We've added new features to the portal. Check out the help section for more details.</p>
                    <div style="font-size: 12px; color: var(--accent-color);">Posted on July 5, 2023</div>
                </div>
            </div>
        </div>
    `;

    dashboardContent.appendChild(dashboard);

    // Set up dashboard event listeners
    setupDashboardEventListeners();

    // Translate the newly added content
    translateUI(localStorage.getItem('preferredLanguage') || 'en');
}

// Function to set up dashboard event listeners
function setupDashboardEventListeners() {
    // Customize dashboard button
    const customizeDashboardBtn = document.getElementById('customizeDashboardBtn');
    if (customizeDashboardBtn) {
        customizeDashboardBtn.addEventListener('click', function() {
            // Create customize dashboard modal if it doesn't exist
            let customizeDashboardModal = document.getElementById('customizeDashboardModal');
            if (!customizeDashboardModal) {
                customizeDashboardModal = document.createElement('div');
                customizeDashboardModal.id = 'customizeDashboardModal';
                customizeDashboardModal.className = 'modal';
                customizeDashboardModal.style.display = 'none';
                customizeDashboardModal.style.position = 'fixed';
                customizeDashboardModal.style.top = '0';
                customizeDashboardModal.style.left = '0';
                customizeDashboardModal.style.right = '0';
                customizeDashboardModal.style.bottom = '0';
                customizeDashboardModal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                customizeDashboardModal.style.zIndex = '1000';
                customizeDashboardModal.style.alignItems = 'center';
                customizeDashboardModal.style.justifyContent = 'center';

                // Add modal content
                customizeDashboardModal.innerHTML = `
                    <div style="background-color: white; border-radius: var(--border-radius); box-shadow: var(--shadow); width: 90%; max-width: 600px; max-height: 90vh; overflow-y: auto; animation: slideInUp 0.3s ease;">
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid var(--border-color); background-color: var(--primary-color); color: white; border-radius: var(--border-radius) var(--border-radius) 0 0;">
                            <h2 style="font-size: 18px; margin: 0;" data-i18n="customize_dashboard">Customize Dashboard</h2>
                            <button id="closeCustomizeDashboardModal" style="background: none; border: none; color: white; cursor: pointer; font-size: 24px; line-height: 1;">×</button>
                        </div>
                        <div style="padding: 24px;">
                            <p style="margin-bottom: 16px;" data-i18n="customize_dashboard_description">Drag and drop widgets to customize your dashboard layout.</p>

                            <div style="margin-bottom: 24px;">
                                <h3 style="font-size: 16px; margin-bottom: 12px;" data-i18n="widget_visibility">Widget Visibility</h3>
                                <div style="display: flex; flex-direction: column; gap: 12px;">
                                    <label style="display: flex; align-items: center; gap: 8px;">
                                        <input type="checkbox" checked id="showRecentActivity">
                                        <span data-i18n="recent_activity">Recent Activity</span>
                                    </label>
                                    <label style="display: flex; align-items: center; gap: 8px;">
                                        <input type="checkbox" checked id="showQuickActions">
                                        <span data-i18n="quick_actions">Quick Actions</span>
                                    </label>
                                    <label style="display: flex; align-items: center; gap: 8px;">
                                        <input type="checkbox" checked id="showStatistics">
                                        <span data-i18n="statistics">Statistics</span>
                                    </label>
                                    <label style="display: flex; align-items: center; gap: 8px;">
                                        <input type="checkbox" checked id="showAnnouncements">
                                        <span data-i18n="announcements">Announcements</span>
                                    </label>
                                </div>
                            </div>

                            <div style="display: flex; justify-content: flex-end; gap: 12px;">
                                <button id="resetDashboardBtn" style="padding: 8px 16px; background: none; border: 1px solid var(--border-color); border-radius: var(--border-radius); cursor: pointer;" data-i18n="reset">Reset</button>
                                <button id="saveDashboardBtn" style="padding: 8px 16px; background-color: var(--primary-color); color: white; border: none; border-radius: var(--border-radius); cursor: pointer;" data-i18n="save">Save</button>
                            </div>
                        </div>
                    </div>
                `;

                document.body.appendChild(customizeDashboardModal);

                // Add close button event listener
                document.getElementById('closeCustomizeDashboardModal').addEventListener('click', function() {
                    customizeDashboardModal.style.display = 'none';
                });

                // Add save button event listener
                document.getElementById('saveDashboardBtn').addEventListener('click', function() {
                    // Get widget visibility preferences
                    const showRecentActivity = document.getElementById('showRecentActivity').checked;
                    const showQuickActions = document.getElementById('showQuickActions').checked;
                    const showStatistics = document.getElementById('showStatistics').checked;
                    const showAnnouncements = document.getElementById('showAnnouncements').checked;

                    // Save preferences
                    const dashboardLayout = [];
                    if (showRecentActivity) dashboardLayout.push('recent_activity');
                    if (showQuickActions) dashboardLayout.push('quick_actions');
                    if (showStatistics) dashboardLayout.push('statistics');
                    if (showAnnouncements) dashboardLayout.push('announcements');

                    // Save preferences to user profile
                    if (typeof DataService !== 'undefined') {
                        const userProfile = DataService.getUserProfile();
                        if (userProfile && userProfile.preferences) {
                            userProfile.preferences.dashboardLayout = dashboardLayout;
                            DataService.saveUserProfile(userProfile);
                        }
                    }

                    // Close modal
                    customizeDashboardModal.style.display = 'none';

                    // Reload dashboard
                    loadDashboardContent();

                    // Show notification
                    if (typeof NavigationController !== 'undefined') {
                        NavigationController.showNotification('Dashboard customization saved', 'success');
                    } else {
                        alert('Dashboard customization saved');
                    }
                });

                // Add reset button event listener
                document.getElementById('resetDashboardBtn').addEventListener('click', function() {
                    // Reset checkboxes
                    document.getElementById('showRecentActivity').checked = true;
                    document.getElementById('showQuickActions').checked = true;
                    document.getElementById('showStatistics').checked = true;
                    document.getElementById('showAnnouncements').checked = true;
                });

                // Add click outside to close
                customizeDashboardModal.addEventListener('click', function(e) {
                    if (e.target === customizeDashboardModal) {
                        customizeDashboardModal.style.display = 'none';
                    }
                });

                // Translate modal content
                translateUI(localStorage.getItem('preferredLanguage') || 'en');
            }

            // Load current preferences
            if (typeof DataService !== 'undefined') {
                const userProfile = DataService.getUserProfile();
                if (userProfile && userProfile.preferences && userProfile.preferences.dashboardLayout) {
                    const dashboardLayout = userProfile.preferences.dashboardLayout;

                    // Set checkboxes based on preferences
                    document.getElementById('showRecentActivity').checked = dashboardLayout.includes('recent_activity');
                    document.getElementById('showQuickActions').checked = dashboardLayout.includes('quick_actions');
                    document.getElementById('showStatistics').checked = dashboardLayout.includes('statistics');
                    document.getElementById('showAnnouncements').checked = dashboardLayout.includes('announcements');
                }
            }

            // Show modal
            customizeDashboardModal.style.display = 'flex';
        });
    }

    // Quick action buttons
    const addPartyBtn = document.getElementById('addPartyBtn');
    if (addPartyBtn) {
        addPartyBtn.addEventListener('click', function() {
            handleNavigation('party_list');
        });
    }

    const createInvoiceBtn = document.getElementById('createInvoiceBtn');
    if (createInvoiceBtn) {
        createInvoiceBtn.addEventListener('click', function() {
            handleNavigation('invoices');
        });
    }

    const uploadDocumentBtn = document.getElementById('uploadDocumentBtn');
    if (uploadDocumentBtn) {
        uploadDocumentBtn.addEventListener('click', function() {
            handleNavigation('documents');
        });
    }

    const getSupportBtn = document.getElementById('getSupportBtn');
    if (getSupportBtn) {
        getSupportBtn.addEventListener('click', function() {
            handleNavigation('contact_support');
        });
    }

    // Refresh buttons
    const refreshActivityBtn = document.querySelector('.refresh-activity');
    if (refreshActivityBtn) {
        refreshActivityBtn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            icon.style.animation = 'spin 1s linear infinite';

            // Simulate refresh delay
            setTimeout(() => {
                icon.style.animation = '';

                // Show notification
                if (typeof NavigationController !== 'undefined') {
                    NavigationController.showNotification('Activity refreshed', 'success');
                } else {
                    alert('Activity refreshed');
                }

                // Reload recent activity content
                const recentActivityContent = document.getElementById('recentActivityContent');
                if (recentActivityContent) {
                    // Simulate new activity
                    recentActivityContent.innerHTML = `
                        <ul style="list-style: none; margin: 0; padding: 0;">
                            <li style="padding: 10px 0; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; gap: 10px; background-color: rgba(33, 150, 243, 0.1);">
                                <div style="width: 36px; height: 36px; border-radius: 50%; background-color: var(--primary-color); display: flex; align-items: center; justify-content: center; color: white;">
                                    <i class="material-icons">update</i>
                                </div>
                                <div>
                                    <div style="font-weight: 500;">Dashboard refreshed</div>
                                    <div style="font-size: 12px; color: var(--accent-color);">Just now</div>
                                </div>
                            </li>
                            <li style="padding: 10px 0; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; gap: 10px;">
                                <div style="width: 36px; height: 36px; border-radius: 50%; background-color: var(--info-color); display: flex; align-items: center; justify-content: center; color: white;">
                                    <i class="material-icons">person_add</i>
                                </div>
                                <div>
                                    <div style="font-weight: 500;">New customer added</div>
                                    <div style="font-size: 12px; color: var(--accent-color);">Today, 10:30 AM</div>
                                </div>
                            </li>
                            <li style="padding: 10px 0; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; gap: 10px;">
                                <div style="width: 36px; height: 36px; border-radius: 50%; background-color: var(--success-color); display: flex; align-items: center; justify-content: center; color: white;">
                                    <i class="material-icons">attach_money</i>
                                </div>
                                <div>
                                    <div style="font-weight: 500;">Payment received</div>
                                    <div style="font-size: 12px; color: var(--accent-color);">Yesterday, 3:45 PM</div>
                                </div>
                            </li>
                            <li style="padding: 10px 0; display: flex; align-items: center; gap: 10px;">
                                <div style="width: 36px; height: 36px; border-radius: 50%; background-color: var(--warning-color); display: flex; align-items: center; justify-content: center; color: white;">
                                    <i class="material-icons">description</i>
                                </div>
                                <div>
                                    <div style="font-weight: 500;">Invoice generated</div>
                                    <div style="font-size: 12px; color: var(--accent-color);">Yesterday, 11:20 AM</div>
                                </div>
                            </li>
                        </ul>
                    `;
                }
            }, 1000);
        });
    }

    const refreshStatsBtn = document.querySelector('.refresh-stats');
    if (refreshStatsBtn) {
        refreshStatsBtn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            icon.style.animation = 'spin 1s linear infinite';

            // Simulate refresh delay
            setTimeout(() => {
                icon.style.animation = '';

                // Show notification
                if (typeof NavigationController !== 'undefined') {
                    NavigationController.showNotification('Statistics refreshed', 'success');
                }

                // Reload dashboard
                loadDashboardContent();
            }, 1000);
        });
    }

    // Toggle chart view button
    const toggleChartViewBtn = document.querySelector('.toggle-chart-view');
    if (toggleChartViewBtn) {
        toggleChartViewBtn.addEventListener('click', function() {
            const gridView = document.querySelector('.stats-grid-view');
            const chartsView = document.querySelector('.stats-charts-view');

            if (gridView.style.display === 'none') {
                // Switch to grid view
                gridView.style.display = 'grid';
                chartsView.style.display = 'none';
                this.querySelector('i').textContent = 'bar_chart';
            } else {
                // Switch to charts view
                gridView.style.display = 'none';
                chartsView.style.display = 'block';
                this.querySelector('i').textContent = 'grid_view';

                // Initialize charts if they don't exist
                initializeCharts();
            }
        });
    }

    // Context menu for statistics more options button
    const statsMoreOptionsBtn = document.getElementById('statsMoreOptions');
    if (statsMoreOptionsBtn) {
        statsMoreOptionsBtn.addEventListener('click', function(e) {
            e.stopPropagation();

            // Remove any existing context menus
            const existingMenu = document.querySelector('.context-menu');
            if (existingMenu) {
                existingMenu.remove();
            }

            // Create context menu
            const contextMenu = document.createElement('div');
            contextMenu.className = 'context-menu';
            contextMenu.style.position = 'absolute';
            contextMenu.style.backgroundColor = 'white';
            contextMenu.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            contextMenu.style.borderRadius = 'var(--border-radius)';
            contextMenu.style.padding = '5px 0';
            contextMenu.style.zIndex = '1000';

            // Position the menu
            const rect = this.getBoundingClientRect();
            contextMenu.style.top = `${rect.bottom + 5}px`;
            contextMenu.style.right = `${window.innerWidth - rect.right}px`;

            // Add menu items
            contextMenu.innerHTML = `
                <div class="context-menu-item" id="exportStatsBtn" style="padding: 8px 15px; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: background-color 0.2s ease;">
                    <i class="material-icons" style="font-size: 18px; color: var(--accent-color);">file_download</i>
                    <span>Export Statistics</span>
                </div>
                <div class="context-menu-item" id="printStatsBtn" style="padding: 8px 15px; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: background-color 0.2s ease;">
                    <i class="material-icons" style="font-size: 18px; color: var(--accent-color);">print</i>
                    <span>Print Statistics</span>
                </div>
                <div class="context-menu-item" id="shareStatsBtn" style="padding: 8px 15px; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: background-color 0.2s ease;">
                    <i class="material-icons" style="font-size: 18px; color: var(--accent-color);">share</i>
                    <span>Share Statistics</span>
                </div>
                <div class="context-menu-item" id="fullScreenStatsBtn" style="padding: 8px 15px; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: background-color 0.2s ease;">
                    <i class="material-icons" style="font-size: 18px; color: var(--accent-color);">fullscreen</i>
                    <span>View Full Screen</span>
                </div>
            `;

            // Add the menu to the document
            document.body.appendChild(contextMenu);

            // Add hover effect to menu items
            const menuItems = contextMenu.querySelectorAll('.context-menu-item');
            menuItems.forEach(item => {
                item.addEventListener('mouseover', function() {
                    this.style.backgroundColor = 'var(--hover-color)';
                });

                item.addEventListener('mouseout', function() {
                    this.style.backgroundColor = '';
                });
            });

            // Add click event listeners to menu items
            document.getElementById('exportStatsBtn').addEventListener('click', function() {
                if (typeof NavigationController !== 'undefined') {
                    NavigationController.showNotification('Statistics exported successfully', 'success');
                } else {
                    alert('Statistics exported successfully');
                }
                contextMenu.remove();
            });

            document.getElementById('printStatsBtn').addEventListener('click', function() {
                if (typeof NavigationController !== 'undefined') {
                    NavigationController.showNotification('Preparing statistics for printing...', 'info');
                } else {
                    alert('Preparing statistics for printing...');
                }
                contextMenu.remove();
            });

            document.getElementById('shareStatsBtn').addEventListener('click', function() {
                if (typeof NavigationController !== 'undefined') {
                    NavigationController.showNotification('Share dialog would open here', 'info');
                } else {
                    alert('Share dialog would open here');
                }
                contextMenu.remove();
            });

            document.getElementById('fullScreenStatsBtn').addEventListener('click', function() {
                if (typeof NavigationController !== 'undefined') {
                    NavigationController.showNotification('Full screen view would open here', 'info');
                } else {
                    alert('Full screen view would open here');
                }
                contextMenu.remove();
            });

            // Close menu when clicking outside
            document.addEventListener('click', function closeMenu() {
                contextMenu.remove();
                document.removeEventListener('click', closeMenu);
            });
        });
    }

    // Add context menu for Recent Activity more button
    const activityMoreBtn = document.querySelector('.activity-more-options');
    if (activityMoreBtn) {
        activityMoreBtn.addEventListener('click', function(e) {
            e.stopPropagation();

            // Remove any existing context menus
            const existingMenu = document.querySelector('.context-menu');
            if (existingMenu) {
                existingMenu.remove();
            }

            // Create context menu
            const contextMenu = document.createElement('div');
            contextMenu.className = 'context-menu';
            contextMenu.style.position = 'absolute';
            contextMenu.style.backgroundColor = 'white';
            contextMenu.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            contextMenu.style.borderRadius = 'var(--border-radius)';
            contextMenu.style.padding = '5px 0';
            contextMenu.style.zIndex = '1000';

            // Position the menu
            const rect = this.getBoundingClientRect();
            contextMenu.style.top = `${rect.bottom + 5}px`;
            contextMenu.style.right = `${window.innerWidth - rect.right}px`;

            // Add menu items
            contextMenu.innerHTML = `
                <div class="context-menu-item" id="viewAllActivityBtn" style="padding: 8px 15px; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: background-color 0.2s ease;">
                    <i class="material-icons" style="font-size: 18px; color: var(--accent-color);">list</i>
                    <span>View All Activity</span>
                </div>
                <div class="context-menu-item" id="filterActivityBtn" style="padding: 8px 15px; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: background-color 0.2s ease;">
                    <i class="material-icons" style="font-size: 18px; color: var(--accent-color);">filter_list</i>
                    <span>Filter Activity</span>
                </div>
                <div class="context-menu-item" id="exportActivityBtn" style="padding: 8px 15px; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: background-color 0.2s ease;">
                    <i class="material-icons" style="font-size: 18px; color: var(--accent-color);">file_download</i>
                    <span>Export Activity</span>
                </div>
            `;

            // Add the menu to the document
            document.body.appendChild(contextMenu);

            // Add hover effect to menu items
            const menuItems = contextMenu.querySelectorAll('.context-menu-item');
            menuItems.forEach(item => {
                item.addEventListener('mouseover', function() {
                    this.style.backgroundColor = 'var(--hover-color)';
                });

                item.addEventListener('mouseout', function() {
                    this.style.backgroundColor = '';
                });
            });

            // Add click event listeners to menu items
            document.getElementById('viewAllActivityBtn').addEventListener('click', function() {
                if (typeof NavigationController !== 'undefined') {
                    NavigationController.showNotification('Viewing all activity', 'info');
                } else {
                    alert('Viewing all activity');
                }
                contextMenu.remove();
            });

            document.getElementById('filterActivityBtn').addEventListener('click', function() {
                if (typeof NavigationController !== 'undefined') {
                    NavigationController.showNotification('Filter dialog would open here', 'info');
                } else {
                    alert('Filter dialog would open here');
                }
                contextMenu.remove();
            });

            document.getElementById('exportActivityBtn').addEventListener('click', function() {
                if (typeof NavigationController !== 'undefined') {
                    NavigationController.showNotification('Activity exported successfully', 'success');
                } else {
                    alert('Activity exported successfully');
                }
                contextMenu.remove();
            });

            // Close menu when clicking outside
            document.addEventListener('click', function closeMenu() {
                contextMenu.remove();
                document.removeEventListener('click', closeMenu);
            });
        });
    }
}

// Function to load party list
function loadPartyList() {
    const dashboardContent = document.getElementById('dashboardContent');

    // Clear existing content
    dashboardContent.innerHTML = '';

    // Create party list header
    const header = document.createElement('div');
    header.className = 'dashboard-header';
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.marginBottom = '20px';

    header.innerHTML = `
        <h1 style="font-size: 24px; font-weight: 500;" data-i18n="party_list">Party List</h1>
        <button id="addNewPartyBtn" style="padding: 8px 16px; background-color: var(--primary-color); color: white; border: none; border-radius: var(--border-radius); cursor: pointer; display: flex; align-items: center; gap: 8px;">
            <i class="material-icons" style="font-size: 16px;">add</i>
            <span data-i18n="add_new_party">Add New Party</span>
        </button>
    `;

    dashboardContent.appendChild(header);

    // Create search and filters bar
    const searchBar = document.createElement('div');
    searchBar.className = 'search-filters-bar';
    searchBar.style.backgroundColor = 'white';
    searchBar.style.borderRadius = 'var(--border-radius)';
    searchBar.style.boxShadow = 'var(--shadow)';
    searchBar.style.padding = '16px';
    searchBar.style.marginBottom = '16px';
    searchBar.style.display = 'flex';
    searchBar.style.flexWrap = 'wrap';
    searchBar.style.gap = '16px';
    searchBar.style.alignItems = 'center';

    searchBar.innerHTML = `
        <div style="flex: 1; min-width: 250px; position: relative;">
            <input type="text" id="partySearch" placeholder="Search across all columns..." style="width: 100%; padding: 12px 16px; padding-right: 40px; border: 1px solid var(--border-color); border-radius: var(--border-radius); font-size: 16px; transition: var(--transition);">
            <button style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--accent-color); cursor: pointer; transition: var(--transition);">
                <i class="material-icons">search</i>
            </button>
        </div>

        <div style="min-width: 200px; position: relative;">
            <select id="partyTypeFilter" style="width: 100%; padding: 12px 16px; border: 1px solid var(--border-color); border-radius: var(--border-radius); background-color: white; appearance: none; background-image: url('data:image/svg+xml;utf8,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; width=&quot;16&quot; height=&quot;16&quot; viewBox=&quot;0 0 24 24&quot; fill=&quot;none&quot; stroke=&quot;%23757575&quot; stroke-width=&quot;2&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;><path d=&quot;M6 9l6 6 6-6&quot;/></svg>'); background-repeat: no-repeat; background-position: right 16px center; padding-right: 40px; font-size: 16px; cursor: pointer; transition: var(--transition);">
                <option value="" data-i18n="all_party_types">All Party Types</option>
                <option value="Customer" data-i18n="customer">Customer</option>
                <option value="Prospect" data-i18n="prospect">Prospect</option>
                <option value="Vendor" data-i18n="vendor">Vendor</option>
                <option value="Manufacturer" data-i18n="manufacturer">Manufacturer</option>
                <option value="Transporter" data-i18n="transporter">Transporter</option>
                <option value="Contractor" data-i18n="contractor">Contractor</option>
            </select>
        </div>

        <button id="advancedSearchBtn" style="background-color: var(--primary-color); color: white; border: none; border-radius: var(--border-radius); padding: 12px 16px; font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: var(--transition);">
            <i class="material-icons">filter_list</i>
            <span data-i18n="advanced_search">Advanced Search</span>
        </button>
    `;

    dashboardContent.appendChild(searchBar);

    // Create grid container
    const gridContainer = document.createElement('div');
    gridContainer.className = 'grid-container';
    gridContainer.style.backgroundColor = 'white';
    gridContainer.style.borderRadius = 'var(--border-radius)';
    gridContainer.style.boxShadow = 'var(--shadow)';
    gridContainer.style.overflow = 'hidden';
    gridContainer.style.marginBottom = '16px';

    // Create grid header
    const gridHeader = document.createElement('div');
    gridHeader.className = 'grid-header';
    gridHeader.style.display = 'flex';
    gridHeader.style.justifyContent = 'space-between';
    gridHeader.style.alignItems = 'center';
    gridHeader.style.padding = '16px';
    gridHeader.style.borderBottom = '1px solid var(--border-color)';

    gridHeader.innerHTML = `
        <h2 style="font-size: 18px; font-weight: 500;" data-i18n="party_list">Party List</h2>
        <div style="display: flex; gap: 8px;">
            <button class="grid-action-button" id="deleteSelectedBtn" title="Delete Selected" style="background: none; border: none; cursor: pointer; color: var(--accent-color); width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: var(--transition);">
                <i class="material-icons">delete</i>
            </button>
            <button class="grid-action-button" id="exportDataBtn" title="Export Data" style="background: none; border: none; cursor: pointer; color: var(--accent-color); width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: var(--transition);">
                <i class="material-icons">file_download</i>
            </button>
            <button class="grid-action-button" id="refreshGridBtn" title="Refresh Grid" style="background: none; border: none; cursor: pointer; color: var(--accent-color); width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: var(--transition);">
                <i class="material-icons">refresh</i>
            </button>
        </div>
    `;

    gridContainer.appendChild(gridHeader);

    // Create grid table container
    const gridTableContainer = document.createElement('div');
    gridTableContainer.className = 'grid-table-container';
    gridTableContainer.style.overflowX = 'auto';
    gridTableContainer.style.padding = '0';

    // Get party data
    let parties = [];
    if (typeof DataService !== 'undefined') {
        parties = DataService.getParties();
    }

    // Create table
    const table = document.createElement('table');
    table.className = 'data-table';
    table.style.width = '100%';
    table.style.borderCollapse = 'separate';
    table.style.borderSpacing = '0';

    // Create table header
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th style="width: 50px;"></th>
            <th style="width: 50px;">
                <input type="checkbox" id="selectAllParties" style="appearance: none; -webkit-appearance: none; width: 18px; height: 18px; border: 2px solid var(--accent-color); border-radius: 3px; outline: none; cursor: pointer; position: relative; transition: var(--transition); margin: 0 auto; display: block;">
            </th>
            <th data-i18n="party_id">Party ID</th>
            <th data-i18n="party_type">Party Type</th>
            <th data-i18n="name">Name</th>
            <th data-i18n="contact_person">Contact Person</th>
            <th data-i18n="email">Email</th>
            <th data-i18n="phone">Phone</th>
            <th data-i18n="city">City</th>
            <th data-i18n="country">Country</th>
            <th data-i18n="status">Status</th>
        </tr>
    `;

    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement('tbody');

    // Add party rows
    if (parties.length > 0) {
        parties.forEach(party => {
            const row = document.createElement('tr');

            // View button cell
            const viewCell = document.createElement('td');
            viewCell.style.textAlign = 'center';

            const viewButton = document.createElement('button');
            viewButton.className = 'view-button';
            viewButton.dataset.partyId = party.id;
            viewButton.innerHTML = '<i class="material-icons">visibility</i>';
            viewButton.style.background = 'none';
            viewButton.style.border = 'none';
            viewButton.style.cursor = 'pointer';
            viewButton.style.color = 'var(--accent-color)';
            viewButton.style.width = '36px';
            viewButton.style.height = '36px';
            viewButton.style.borderRadius = '50%';
            viewButton.style.display = 'flex';
            viewButton.style.alignItems = 'center';
            viewButton.style.justifyContent = 'center';
            viewButton.style.transition = 'var(--transition)';
            viewButton.style.margin = '0 auto';

            viewCell.appendChild(viewButton);
            row.appendChild(viewCell);

            // Checkbox cell
            const checkboxCell = document.createElement('td');
            checkboxCell.style.textAlign = 'center';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.dataset.partyId = party.id;
            checkbox.style.appearance = 'none';
            checkbox.style.webkitAppearance = 'none';
            checkbox.style.width = '18px';
            checkbox.style.height = '18px';
            checkbox.style.border = '2px solid var(--accent-color)';
            checkbox.style.borderRadius = '3px';
            checkbox.style.outline = 'none';
            checkbox.style.cursor = 'pointer';
            checkbox.style.position = 'relative';
            checkbox.style.transition = 'var(--transition)';
            checkbox.style.margin = '0 auto';
            checkbox.style.display = 'block';

            checkboxCell.appendChild(checkbox);
            row.appendChild(checkboxCell);

            // Data cells
            const fields = [
                party.id,
                party.partyType,
                party.name,
                party.contactPerson || '-',
                party.email || '-',
                party.phone || '-',
                party.city || '-',
                party.country || '-',
                party.isActive ? 'Active' : 'Inactive'
            ];

            fields.forEach(field => {
                const cell = document.createElement('td');
                cell.textContent = field;
                row.appendChild(cell);
            });

            tbody.appendChild(row);
        });
    } else {
        // No data message
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 11;
        cell.style.textAlign = 'center';
        cell.style.padding = '24px';
        cell.setAttribute('data-i18n', 'no_data_found');
        cell.textContent = 'No party data found. Try changing your filters.';
        row.appendChild(cell);
        tbody.appendChild(row);
    }

    table.appendChild(tbody);
    gridTableContainer.appendChild(table);
    gridContainer.appendChild(gridTableContainer);

    dashboardContent.appendChild(gridContainer);

    // Set up party grid event listeners
    setupPartyGridEventListeners();

    // Translate the newly added content
    translateUI(localStorage.getItem('preferredLanguage') || 'en');
}

// Function to set up party grid event listeners
function setupPartyGridEventListeners() {
    // Select all checkbox
    const selectAllCheckbox = document.getElementById('selectAllParties');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('tbody input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;

                // Apply styles
                if (this.checked) {
                    checkbox.style.backgroundColor = 'var(--primary-color)';
                    checkbox.style.borderColor = 'var(--primary-color)';
                } else {
                    checkbox.style.backgroundColor = '';
                    checkbox.style.borderColor = 'var(--accent-color)';
                }
            });
        });
    }

    // Individual checkboxes
    const checkboxes = document.querySelectorAll('tbody input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Apply styles
            if (this.checked) {
                this.style.backgroundColor = 'var(--primary-color)';
                this.style.borderColor = 'var(--primary-color)';
            } else {
                this.style.backgroundColor = '';
                this.style.borderColor = 'var(--accent-color)';
            }

            // Check if all checkboxes are checked
            const allChecked = Array.from(checkboxes).every(cb => cb.checked);
            const selectAllCheckbox = document.getElementById('selectAllParties');
            if (selectAllCheckbox) {
                selectAllCheckbox.checked = allChecked;

                // Apply styles to select all checkbox
                if (allChecked) {
                    selectAllCheckbox.style.backgroundColor = 'var(--primary-color)';
                    selectAllCheckbox.style.borderColor = 'var(--primary-color)';
                } else {
                    selectAllCheckbox.style.backgroundColor = '';
                    selectAllCheckbox.style.borderColor = 'var(--accent-color)';
                }
            }
        });
    });

    // View buttons
    const viewButtons = document.querySelectorAll('.view-button');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const partyId = this.dataset.partyId;
            viewPartyDetails(partyId);
        });
    });

    // Add new party button
    const addNewPartyBtn = document.getElementById('addNewPartyBtn');
    if (addNewPartyBtn) {
        addNewPartyBtn.addEventListener('click', function() {
            alert('Add new party form would open here');
        });
    }

    // Delete selected button
    const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
    if (deleteSelectedBtn) {
        deleteSelectedBtn.addEventListener('click', function() {
            const selectedCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]:checked');
            if (selectedCheckboxes.length === 0) {
                alert('No parties selected for deletion');
                return;
            }

            const confirmDelete = confirm(`Are you sure you want to delete ${selectedCheckboxes.length} selected parties?`);
            if (confirmDelete) {
                // In a real application, you would delete the selected parties
                alert(`${selectedCheckboxes.length} parties would be deleted`);
            }
        });
    }

    // Export data button
    const exportDataBtn = document.getElementById('exportDataBtn');
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', function() {
            alert('Data export functionality would trigger here');
        });
    }

    // Refresh grid button
    const refreshGridBtn = document.getElementById('refreshGridBtn');
    if (refreshGridBtn) {
        refreshGridBtn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            icon.style.animation = 'spin 1s linear infinite';

            // Simulate refresh delay
            setTimeout(() => {
                icon.style.animation = '';
                loadPartyList(); // Reload the party list
                alert('Grid refreshed with latest data');
            }, 1000);
        });
    }

    // Party search
    const partySearch = document.getElementById('partySearch');
    if (partySearch) {
        partySearch.addEventListener('input', function() {
            // In a real application, you would filter the grid based on the search term
            console.log('Searching for:', this.value);
        });
    }

    // Party type filter
    const partyTypeFilter = document.getElementById('partyTypeFilter');
    if (partyTypeFilter) {
        partyTypeFilter.addEventListener('change', function() {
            // In a real application, you would filter the grid based on the selected party type
            console.log('Filtering by party type:', this.value);
        });
    }

    // Advanced search button
    const advancedSearchBtn = document.getElementById('advancedSearchBtn');
    if (advancedSearchBtn) {
        advancedSearchBtn.addEventListener('click', function() {
            alert('Advanced search panel would open here');
        });
    }
}

// Function to initialize charts
function initializeCharts() {
    // Initialize parties chart
    const partiesChartCanvas = document.getElementById('partiesChart');
    if (partiesChartCanvas) {
        // Check if chart already exists
        if (window.partiesChart) {
            window.partiesChart.destroy();
        }

        // Get data
        let partyTypes = ['Customer', 'Prospect', 'Vendor', 'Manufacturer', 'Transporter', 'Contractor'];
        let partyCounts = [12, 5, 8, 3, 4, 2];

        // Create chart
        window.partiesChart = new Chart(partiesChartCanvas, {
            type: 'bar',
            data: {
                labels: partyTypes,
                datasets: [{
                    label: 'Party Distribution',
                    data: partyCounts,
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(153, 102, 255, 0.7)',
                        'rgba(255, 159, 64, 0.7)',
                        'rgba(255, 99, 132, 0.7)'
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255, 99, 132, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Party Distribution by Type',
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                }
            }
        });
    }

    // Initialize financials chart
    const financialsChartCanvas = document.getElementById('financialsChart');
    if (financialsChartCanvas) {
        // Check if chart already exists
        if (window.financialsChart) {
            window.financialsChart.destroy();
        }

        // Get data
        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        let invoiced = [4500, 5200, 4800, 5500, 6200, 5500];
        let received = [4200, 4800, 4500, 5000, 5800, 2250];

        // Create chart
        window.financialsChart = new Chart(financialsChartCanvas, {
            type: 'line',
            data: {
                labels: months,
                datasets: [
                    {
                        label: 'Invoiced',
                        data: invoiced,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Received',
                        data: received,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Financial Overview (Last 6 Months)',
                        font: {
                            size: 16
                        }
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
}

// Placeholder functions for other sections
function loadCustomerList() {
    const dashboardContent = document.getElementById('dashboardContent');
    dashboardContent.innerHTML = '<h1 data-i18n="customer">Customer</h1><p>Customer list content will be loaded here.</p>';
    translateUI(localStorage.getItem('preferredLanguage') || 'en');
}

function loadVendorList() {
    const dashboardContent = document.getElementById('dashboardContent');
    dashboardContent.innerHTML = '<h1 data-i18n="vendor">Vendor</h1><p>Vendor list content will be loaded here.</p>';
    translateUI(localStorage.getItem('preferredLanguage') || 'en');
}

function loadUserProfile() {
    const dashboardContent = document.getElementById('dashboardContent');
    dashboardContent.innerHTML = '<h1 data-i18n="profile">Profile</h1><p>User profile content will be loaded here.</p>';
    translateUI(localStorage.getItem('preferredLanguage') || 'en');
}

function loadInvoices() {
    const dashboardContent = document.getElementById('dashboardContent');
    dashboardContent.innerHTML = '<h1 data-i18n="invoices">Invoices</h1><p>Invoices content will be loaded here.</p>';
    translateUI(localStorage.getItem('preferredLanguage') || 'en');
}

function loadPayments() {
    const dashboardContent = document.getElementById('dashboardContent');
    dashboardContent.innerHTML = '<h1 data-i18n="payments">Payments</h1><p>Payments content will be loaded here.</p>';
    translateUI(localStorage.getItem('preferredLanguage') || 'en');
}

function loadDocuments() {
    const dashboardContent = document.getElementById('dashboardContent');
    dashboardContent.innerHTML = '<h1 data-i18n="documents">Documents</h1><p>Documents content will be loaded here.</p>';
    translateUI(localStorage.getItem('preferredLanguage') || 'en');
}

function loadHelpCenter() {
    const dashboardContent = document.getElementById('dashboardContent');
    dashboardContent.innerHTML = '<h1 data-i18n="help_center">Help Center</h1><p>Help center content will be loaded here.</p>';
    translateUI(localStorage.getItem('preferredLanguage') || 'en');
}

function loadUserGuides() {
    const dashboardContent = document.getElementById('dashboardContent');
    dashboardContent.innerHTML = '<h1 data-i18n="user_guides">User Guides</h1><p>User guides content will be loaded here.</p>';
    translateUI(localStorage.getItem('preferredLanguage') || 'en');
}

function loadVideoTutorials() {
    const dashboardContent = document.getElementById('dashboardContent');
    dashboardContent.innerHTML = '<h1 data-i18n="video_tutorials">Video Tutorials</h1><p>Video tutorials content will be loaded here.</p>';
    translateUI(localStorage.getItem('preferredLanguage') || 'en');
}

function loadContactSupport() {
    const dashboardContent = document.getElementById('dashboardContent');
    dashboardContent.innerHTML = '<h1 data-i18n="contact_support">Contact Support</h1><p>Contact support content will be loaded here.</p>';
    translateUI(localStorage.getItem('preferredLanguage') || 'en');
}
