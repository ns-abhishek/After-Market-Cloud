/**
 * Admin Settings Module
 * Handles settings configuration and management
 */
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const adminTabs = document.querySelectorAll('.admin-tab');
    const tabContents = document.querySelectorAll('.admin-tab-content');
    const generalSettingsForm = document.getElementById('general-settings-form');
    const appearanceSettingsForm = document.getElementById('appearance-settings-form');
    const notificationSettingsForm = document.getElementById('notification-settings-form');
    const backupStorageSelect = document.getElementById('backup-storage');
    const cloudSettings = document.querySelector('.cloud-settings');

    // Header elements
    const adminProfileToggle = document.getElementById('admin-profile-toggle');
    const adminDropdownMenu = document.querySelector('.admin-dropdown-menu');
    const notificationsToggle = document.getElementById('notifications-toggle');
    const notificationsDropdown = document.querySelector('.notifications-dropdown');
    const markAllReadButton = document.querySelector('.mark-all-read');
    const notificationItems = document.querySelectorAll('.notification-item');

    // Initialize settings
    initSettings();

    /**
     * Initialize settings components and event listeners
     */
    function initSettings() {
        // Set up tabs
        if (adminTabs.length > 0) {
            adminTabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    const tabId = this.dataset.tab;
                    switchTab(tabId);
                });
            });
        }

        // Set up header dropdowns
        initHeaderDropdowns();

        // Set up form submissions
        if (generalSettingsForm) {
            generalSettingsForm.addEventListener('submit', function(e) {
                e.preventDefault();
                saveGeneralSettings();
            });
        }

        if (appearanceSettingsForm) {
            appearanceSettingsForm.addEventListener('submit', function(e) {
                e.preventDefault();
                saveAppearanceSettings();
            });

            // Set up color picker sync
            const primaryColor = document.getElementById('primary-color');
            const primaryColorHex = document.getElementById('primary-color-hex');
            const accentColor = document.getElementById('accent-color');
            const accentColorHex = document.getElementById('accent-color-hex');

            if (primaryColor && primaryColorHex) {
                primaryColor.addEventListener('input', function() {
                    primaryColorHex.value = this.value;
                });

                primaryColorHex.addEventListener('input', function() {
                    primaryColor.value = this.value;
                });
            }

            if (accentColor && accentColorHex) {
                accentColor.addEventListener('input', function() {
                    accentColorHex.value = this.value;
                });

                accentColorHex.addEventListener('input', function() {
                    accentColor.value = this.value;
                });
            }

            // Set up file upload button
            const logoUpload = document.getElementById('logo-upload');
            const fileUploadBtn = document.querySelector('.file-upload-btn');
            const fileName = document.querySelector('.file-name');

            if (logoUpload && fileUploadBtn && fileName) {
                fileUploadBtn.addEventListener('click', function() {
                    logoUpload.click();
                });

                logoUpload.addEventListener('change', function() {
                    if (this.files.length > 0) {
                        fileName.textContent = this.files[0].name;
                    } else {
                        fileName.textContent = 'No file chosen';
                    }
                });
            }
        }

        if (notificationSettingsForm) {
            notificationSettingsForm.addEventListener('submit', function(e) {
                e.preventDefault();
                saveNotificationSettings();
            });
        }

        // Set up backup storage toggle
        if (backupStorageSelect) {
            backupStorageSelect.addEventListener('change', function() {
                if (this.value === 'cloud' && cloudSettings) {
                    cloudSettings.style.display = 'block';
                } else if (cloudSettings) {
                    cloudSettings.style.display = 'none';
                }
            });
        }

        // Set up backup action buttons
        const createBackupBtn = document.querySelector('.backup-section .admin-button');
        const exportContentBtn = document.querySelector('.backup-section:nth-of-type(3) .admin-button');
        const backupActionBtns = document.querySelectorAll('.backup-history-table-container .action-btn');

        if (createBackupBtn) {
            createBackupBtn.addEventListener('click', function() {
                showNotification('Backup created successfully', 'success');
            });
        }

        if (exportContentBtn) {
            exportContentBtn.addEventListener('click', function() {
                showNotification('Content exported successfully', 'success');
            });
        }

        if (backupActionBtns.length > 0) {
            backupActionBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    if (this.classList.contains('download')) {
                        showNotification('Backup download started', 'info');
                    } else if (this.classList.contains('restore')) {
                        if (confirm('Are you sure you want to restore this backup? Current data will be overwritten.')) {
                            showNotification('Backup restored successfully', 'success');
                        }
                    } else if (this.classList.contains('delete')) {
                        if (confirm('Are you sure you want to delete this backup?')) {
                            const row = this.closest('tr');
                            row.style.animation = 'fadeOut 0.5s ease forwards';
                            setTimeout(() => {
                                row.remove();
                            }, 500);
                            showNotification('Backup deleted successfully', 'success');
                        }
                    }
                });
            });
        }
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
     * Save general settings
     */
    function saveGeneralSettings() {
        // Get form values
        const siteTitle = document.getElementById('site-title').value;
        const siteDescription = document.getElementById('site-description').value;
        const adminEmail = document.getElementById('admin-email').value;
        const language = document.getElementById('language').value;
        const dateFormat = document.getElementById('date-format').value;
        const timeFormat = document.getElementById('time-format').value;
        const requireLogin = document.getElementById('require-login').checked;
        const showAuthor = document.getElementById('show-author').checked;
        const showDates = document.getElementById('show-dates').checked;

        // In a real application, this would save the settings to a database or config file
        // For demo purposes, we'll just show a notification

        // Create settings object
        const settings = {
            siteTitle,
            siteDescription,
            adminEmail,
            language,
            dateFormat,
            timeFormat,
            requireLogin,
            showAuthor,
            showDates
        };

        // Log settings to console
        console.log('Saving general settings:', settings);

        // Show success notification
        showNotification('General settings saved successfully', 'success');
    }

    /**
     * Save appearance settings
     */
    function saveAppearanceSettings() {
        // Get form values
        const defaultTheme = document.getElementById('default-theme').value;
        const primaryColor = document.getElementById('primary-color').value;
        const accentColor = document.getElementById('accent-color').value;
        const fontFamily = document.getElementById('font-family').value;
        const fontSize = document.getElementById('font-size').value;
        const lineHeight = document.getElementById('line-height').value;
        const enableAnimations = document.getElementById('enable-animations').checked;
        const roundedCorners = document.getElementById('rounded-corners').checked;
        const showShadows = document.getElementById('show-shadows').checked;

        // Get logo file if selected
        const logoUpload = document.getElementById('logo-upload');
        const logoFile = logoUpload.files.length > 0 ? logoUpload.files[0].name : null;

        // Create settings object
        const settings = {
            defaultTheme,
            primaryColor,
            accentColor,
            fontFamily,
            fontSize,
            lineHeight,
            enableAnimations,
            roundedCorners,
            showShadows,
            logoFile
        };

        // Log settings to console
        console.log('Saving appearance settings:', settings);

        // Show success notification
        showNotification('Appearance settings saved successfully', 'success');
    }

    /**
     * Save notification settings
     */
    function saveNotificationSettings() {
        // Get form values
        const contentUpdatesEmail = document.getElementById('notify-content-updates').checked;
        const userActivityEmail = document.getElementById('notify-user-activity').checked;
        const systemUpdatesEmail = document.getElementById('notify-system-updates').checked;
        const securityAlertsEmail = document.getElementById('notify-security-alerts').checked;

        const contentUpdatesApp = document.getElementById('app-content-updates').checked;
        const userActivityApp = document.getElementById('app-user-activity').checked;
        const systemUpdatesApp = document.getElementById('app-system-updates').checked;
        const securityAlertsApp = document.getElementById('app-security-alerts').checked;

        const notificationFrequency = document.getElementById('notification-frequency').value;
        const additionalRecipients = document.getElementById('notification-recipients').value;

        // Create settings object
        const settings = {
            email: {
                contentUpdates: contentUpdatesEmail,
                userActivity: userActivityEmail,
                systemUpdates: systemUpdatesEmail,
                securityAlerts: securityAlertsEmail
            },
            app: {
                contentUpdates: contentUpdatesApp,
                userActivity: userActivityApp,
                systemUpdates: systemUpdatesApp,
                securityAlerts: securityAlertsApp
            },
            frequency: notificationFrequency,
            additionalRecipients: additionalRecipients.split(',').map(email => email.trim()).filter(email => email)
        };

        // Log settings to console
        console.log('Saving notification settings:', settings);

        // Show success notification
        showNotification('Notification settings saved successfully', 'success');
    }

    /**
     * Initialize header dropdowns
     */
    function initHeaderDropdowns() {
        // Set up user dropdown
        if (adminProfileToggle && adminDropdownMenu) {
            adminProfileToggle.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleUserDropdown(e);

                // Close notifications dropdown if open
                if (notificationsDropdown && notificationsDropdown.classList.contains('show')) {
                    notificationsDropdown.classList.remove('show');
                }
            });
        }

        // Set up notifications dropdown
        if (notificationsToggle && notificationsDropdown) {
            notificationsToggle.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleNotificationsDropdown(e);

                // Close user dropdown if open
                if (adminDropdownMenu && adminDropdownMenu.classList.contains('show')) {
                    adminDropdownMenu.classList.remove('show');
                    resetDropdownIcon();
                }
            });

            // Handle mark all as read button
            if (markAllReadButton) {
                markAllReadButton.addEventListener('click', function(e) {
                    e.stopPropagation();
                    markAllNotificationsAsRead();
                });
            }

            // Handle notification item clicks
            if (notificationItems.length > 0) {
                notificationItems.forEach(item => {
                    item.addEventListener('click', function() {
                        this.classList.remove('unread');
                        updateNotificationBadge();
                    });
                });
            }
        }

        // Close dropdowns when clicking outside
        document.addEventListener('click', function(e) {
            // Close user dropdown
            if (!e.target.closest('.admin-user-profile') && adminDropdownMenu && adminDropdownMenu.classList.contains('show')) {
                adminDropdownMenu.classList.remove('show');
                resetDropdownIcon();
            }

            // Close notifications dropdown
            if (!e.target.closest('.notifications-container') && notificationsDropdown && notificationsDropdown.classList.contains('show')) {
                notificationsDropdown.classList.remove('show');
            }
        });

        // Update notification badge count
        updateNotificationBadge();
    }

    /**
     * Toggle user dropdown menu
     */
    function toggleUserDropdown() {
        adminDropdownMenu.classList.toggle('show');

        // Add rotation animation to dropdown icon
        const icon = adminProfileToggle.querySelector('.admin-dropdown-toggle i');
        if (adminDropdownMenu.classList.contains('show')) {
            icon.style.transform = 'rotate(180deg)';
        } else {
            icon.style.transform = 'rotate(0)';
        }
        icon.style.transition = 'transform 0.3s ease';
    }

    /**
     * Reset dropdown icon rotation
     */
    function resetDropdownIcon() {
        const icon = adminProfileToggle.querySelector('.admin-dropdown-toggle i');
        icon.style.transform = 'rotate(0)';
    }

    /**
     * Toggle notifications dropdown
     */
    function toggleNotificationsDropdown() {
        notificationsDropdown.classList.toggle('show');

        // Add subtle animation to notification bell
        const bell = notificationsToggle.querySelector('i');
        bell.style.animation = 'bellShake 0.5s ease';

        // Add bell shake animation if not already added
        if (!document.querySelector('#bell-animation')) {
            const style = document.createElement('style');
            style.id = 'bell-animation';
            style.textContent = `
                @keyframes bellShake {
                    0% { transform: rotate(0); }
                    20% { transform: rotate(15deg); }
                    40% { transform: rotate(-15deg); }
                    60% { transform: rotate(7deg); }
                    80% { transform: rotate(-7deg); }
                    100% { transform: rotate(0); }
                }
            `;
            document.head.appendChild(style);
        }

        // Remove animation after it completes
        setTimeout(() => {
            bell.style.animation = '';
        }, 500);
    }

    /**
     * Mark all notifications as read
     */
    function markAllNotificationsAsRead() {
        const unreadItems = document.querySelectorAll('.notification-item.unread');
        unreadItems.forEach(item => {
            item.classList.remove('unread');
        });

        // Update notification badge
        updateNotificationBadge();

        // Show notification
        showNotification('All notifications marked as read', 'success');
    }

    /**
     * Update notification badge count
     */
    function updateNotificationBadge() {
        const unreadCount = document.querySelectorAll('.notification-item.unread').length;
        const badge = document.querySelector('.notification-badge');

        if (badge) {
            if (unreadCount > 0) {
                badge.textContent = unreadCount;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }
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
