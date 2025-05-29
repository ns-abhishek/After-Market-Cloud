/**
 * Admin Header Module
 * Handles header functionality across all admin pages
 */
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const adminProfileToggle = document.getElementById('admin-profile-toggle');
    const adminDropdownMenu = document.querySelector('.admin-dropdown-menu');
    const notificationsToggle = document.getElementById('notifications-toggle');
    const notificationsDropdown = document.querySelector('.notifications-dropdown');
    const markAllReadButton = document.querySelector('.mark-all-read');
    const notificationItems = document.querySelectorAll('.notification-item');
    const submenuItems = document.querySelectorAll('.admin-nav li.has-submenu');

    // Initialize header
    initHeader();

    /**
     * Initialize header components and event listeners
     */
    function initHeader() {
        // Set up user dropdown
        if (adminProfileToggle && adminDropdownMenu) {
            adminProfileToggle.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleUserDropdown();

                // Close notifications dropdown if open
                if (notificationsDropdown && notificationsDropdown.classList.contains('show')) {
                    notificationsDropdown.classList.remove('show');
                }
            });
        }

        // Set up submenu functionality for mobile
        if (submenuItems.length > 0) {
            submenuItems.forEach(item => {
                const link = item.querySelector('a');
                const submenu = item.querySelector('.submenu');

                // For mobile view, make the parent link toggle the submenu
                if (window.innerWidth <= 768) {
                    link.addEventListener('click', function(e) {
                        e.preventDefault();
                        submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
                        const icon = link.querySelector('.submenu-icon');
                        if (icon) {
                            icon.style.transform = submenu.style.display === 'block' ? 'rotate(180deg)' : 'rotate(0)';
                        }
                    });
                }
            });

            // Update submenu behavior on window resize
            window.addEventListener('resize', function() {
                if (window.innerWidth <= 768) {
                    submenuItems.forEach(item => {
                        const link = item.querySelector('a');
                        const submenu = item.querySelector('.submenu');

                        // Remove existing event listeners
                        const newLink = link.cloneNode(true);
                        link.parentNode.replaceChild(newLink, link);

                        // Add new event listener
                        newLink.addEventListener('click', function(e) {
                            e.preventDefault();
                            submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
                            const icon = newLink.querySelector('.submenu-icon');
                            if (icon) {
                                icon.style.transform = submenu.style.display === 'block' ? 'rotate(180deg)' : 'rotate(0)';
                            }
                        });
                    });
                } else {
                    // Reset submenu display for desktop
                    submenuItems.forEach(item => {
                        const submenu = item.querySelector('.submenu');
                        submenu.style.display = '';
                    });
                }
            });
        }

        // Set up notifications dropdown
        if (notificationsToggle && notificationsDropdown) {
            notificationsToggle.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleNotificationsDropdown();

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
