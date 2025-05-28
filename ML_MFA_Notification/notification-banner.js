/**
 * Notification Banner System
 *
 * This module creates and manages visual banners/toasts for displaying
 * incoming notifications with different styles based on priority.
 */

class NotificationBanner {
  constructor() {
    // Create container for notification banners
    this.createContainer();

    // Initialize event listeners
    this.initEventListeners();

    // Track active banners
    this.activeBanners = [];

    // Default settings (will be overridden by user preferences)
    this.settings = {
      position: 'top-right',
      autoDismissDuration: 5000, // 5 seconds
      maxBanners: 5
    };

    // Load settings from user preferences
    this.loadSettings();
  }

  /**
   * Create container for notification banners
   */
  createContainer() {
    // Check if container already exists
    let container = document.getElementById('notificationBannerContainer');

    if (!container) {
      // Create container
      container = document.createElement('div');
      container.id = 'notificationBannerContainer';
      container.className = 'notification-banner-container top-right';
      document.body.appendChild(container);
    }

    this.container = container;
  }

  /**
   * Initialize event listeners
   */
  initEventListeners() {
    // Listen for preference changes
    document.addEventListener('preferencesChanged', (event) => {
      this.loadSettings();
    });

    // Listen for new notifications
    document.addEventListener('notificationReceived', (event) => {
      const notification = event.detail.notification;
      this.showBanner(notification);
    });
  }

  /**
   * Load settings from user preferences
   */
  loadSettings() {
    if (window.notificationPreferences) {
      const preferences = window.notificationPreferences.preferences;

      // Update settings
      this.settings.position = preferences.bannerPosition || 'top-right';
      this.settings.autoDismissDuration = preferences.autoDismissDuration || 5000;

      // Update container position
      this.container.className = `notification-banner-container ${this.settings.position}`;
    }
  }

  /**
   * Show notification banner
   * @param {Object} notification - The notification object
   */
  showBanner(notification) {
    // Check if notifications are enabled
    if (window.notificationPreferences) {
      const preferences = window.notificationPreferences.preferences;

      // Check global notifications enabled setting
      if (!preferences.notificationsEnabled) return;

      // Check priority-specific settings
      if (notification.priority === 'high' && !preferences.showHighPriority) return;
      if (notification.priority === 'normal' && !preferences.showNormalPriority) return;
      if (notification.priority === 'low' && !preferences.showLowPriority) return;
    }

    // Create banner element
    const banner = document.createElement('div');
    banner.className = `notification-banner priority-${notification.priority}`;
    banner.dataset.id = notification.id;

    // Get icon based on notification type and priority
    let icon = 'notifications';
    if (notification.priority === 'high') {
      icon = 'priority_high';
    } else if (notification.type === 'alert') {
      icon = 'warning';
    } else if (notification.type === 'info') {
      icon = 'info';
    }

    // Format timestamp
    const timestamp = new Date(notification.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    // Set banner content
    banner.innerHTML = `
      <div class="notification-banner-header">
        <h3 class="notification-banner-title">
          <span class="material-icons">${icon}</span>
          ${notification.title}
        </h3>
        <button class="notification-banner-close" aria-label="Close">
          <span class="material-icons">close</span>
        </button>
      </div>
      <div class="notification-banner-content">
        ${notification.content}
      </div>
      <div class="notification-banner-footer">
        <div class="notification-banner-meta">
          <span class="notification-banner-type type-${notification.type || 'notification'}">${notification.type || 'notification'}</span>
        </div>
        <div class="notification-banner-time">${timestamp}</div>
      </div>
      <div class="notification-banner-progress">
        <div class="notification-banner-progress-bar"></div>
      </div>
    `;

    // Add to container
    this.container.appendChild(banner);

    // Add to active banners
    this.activeBanners.push({
      id: notification.id,
      element: banner,
      timeout: null
    });

    // Limit the number of banners
    this.limitBanners();

    // Add close button event listener
    const closeButton = banner.querySelector('.notification-banner-close');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        this.closeBanner(notification.id);
      });
    }

    // Add click event to mark as read
    banner.addEventListener('click', (event) => {
      // Ignore clicks on the close button
      if (event.target.closest('.notification-banner-close')) return;

      // Mark notification as read
      this.markAsRead(notification.id);

      // Close the banner
      this.closeBanner(notification.id);
    });

    // Show the banner with animation
    setTimeout(() => {
      banner.classList.add('show');

      // Add shake animation for high priority
      if (notification.priority === 'high') {
        setTimeout(() => {
          banner.classList.add('shake');
        }, 300);
      }
    }, 10);

    // Start progress bar animation if auto-dismiss is enabled
    // Default to 5 seconds if not set
    const autoDismissDuration = this.settings.autoDismissDuration > 0 ? this.settings.autoDismissDuration : 5000;

    const progressBar = banner.querySelector('.notification-banner-progress-bar');
    if (progressBar) {
      progressBar.style.transition = `transform ${autoDismissDuration / 1000}s linear`;
      setTimeout(() => {
        progressBar.style.transform = 'scaleX(1)';
      }, 10);
    }

    // Set timeout to auto-dismiss
    const timeout = setTimeout(() => {
      this.closeBanner(notification.id);
    }, autoDismissDuration);

    // Store timeout ID
    const bannerInfo = this.activeBanners.find(b => b.id === notification.id);
    if (bannerInfo) {
      bannerInfo.timeout = timeout;
    }
  }

  /**
   * Close notification banner
   * @param {string} id - The notification ID
   */
  closeBanner(id) {
    // Find banner
    const bannerInfo = this.activeBanners.find(b => b.id === id);

    if (bannerInfo) {
      const banner = bannerInfo.element;

      // Clear timeout
      if (bannerInfo.timeout) {
        clearTimeout(bannerInfo.timeout);
      }

      // Remove from active banners
      this.activeBanners = this.activeBanners.filter(b => b.id !== id);

      // Add slide-out animation
      banner.classList.remove('show');
      banner.classList.add('slide-out');

      // Remove after animation
      setTimeout(() => {
        if (banner.parentNode) {
          banner.parentNode.removeChild(banner);
        }
      }, 300);
    } else {
      // If banner info not found, try to find the element directly
      const banners = document.querySelectorAll('.notification-banner');
      banners.forEach(banner => {
        if (banner.dataset.id === id || !id) {
          // Add slide-out animation
          banner.classList.remove('show');
          banner.classList.add('slide-out');

          // Remove after animation
          setTimeout(() => {
            if (banner.parentNode) {
              banner.parentNode.removeChild(banner);
            }
          }, 300);
        }
      });
    }
  }

  /**
   * Mark notification as read
   * @param {string} id - The notification ID
   */
  markAsRead(id) {
    // Get notifications from localStorage
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');

    // Find notification and mark as read
    const notification = notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;

      // Save back to localStorage
      localStorage.setItem('notifications', JSON.stringify(notifications));

      // Update notification counter
      const unreadCount = notifications.filter(n => !n.read).length;
      if (typeof updateNotificationBadge === 'function') {
        updateNotificationBadge(unreadCount);
      }

      // Update notification list if visible
      if (typeof loadNotifications === 'function') {
        loadNotifications();
      }
    }
  }

  /**
   * Limit the number of banners
   */
  limitBanners() {
    // If we have more banners than the limit, close the oldest ones
    if (this.activeBanners.length > this.settings.maxBanners) {
      // Get the oldest banners to remove
      const bannersToRemove = this.activeBanners.slice(0, this.activeBanners.length - this.settings.maxBanners);

      // Close each banner
      bannersToRemove.forEach(bannerInfo => {
        this.closeBanner(bannerInfo.id);
      });
    }
  }

  /**
   * Close all banners
   */
  closeAllBanners() {
    // Make a copy of the array to avoid issues during iteration
    const banners = [...this.activeBanners];

    // Close each banner
    banners.forEach(bannerInfo => {
      this.closeBanner(bannerInfo.id);
    });

    // Also close any banners that might not be in the activeBanners array
    this.closeBanner(); // Passing no ID will close all banners
  }
}

// Initialize notification banner system when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Create global notification banner instance
  window.notificationBanner = new NotificationBanner();
});
