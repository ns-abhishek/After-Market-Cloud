// Notification Toast Component
// This file contains the code for the small notification toast that appears in the bottom right corner

// Create container for toasts if it doesn't exist
function createToastContainer() {
  let container = document.getElementById('notification-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'notification-toast-container';
    container.className = 'notification-toast-container';
    document.body.appendChild(container);
  }
  return container;
}

// Get icon for notification type
function getNotificationIcon(type) {
  switch (type.toLowerCase()) {
    case 'success':
      return 'check_circle';
    case 'warning':
      return 'warning';
    case 'error':
      return 'error';
    case 'info':
    default:
      return 'info';
  }
}

// Format time ago
function formatTimeAgo(timestamp) {
  const now = new Date();
  const date = new Date(timestamp);
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) {
    return 'Just now';
  }
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  }
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  }
  
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? 's' : ''} ago`;
}

// Show notification toast
function showNotificationToast(options) {
  // Default options
  const defaults = {
    title: 'Notification',
    message: '',
    type: 'info',
    duration: 5000, // 5 seconds
    timestamp: new Date(),
    actions: [
      {
        text: 'Remind later',
        type: 'secondary',
        callback: () => {
          // Default remind later - will show again in 30 minutes
          setTimeout(() => {
            showNotificationToast(options);
          }, 30 * 60 * 1000); // 30 minutes
        }
      },
      {
        text: 'View',
        type: 'primary',
        callback: () => {
          // Default view action - open notification modal
          if (typeof toggleNotificationModal === 'function') {
            toggleNotificationModal();
          }
        }
      }
    ]
  };
  
  // Merge options
  const settings = { ...defaults, ...options };
  
  // Create container
  const container = createToastContainer();
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `notification-toast ${settings.type}`;
  
  // Get icon for notification type
  const icon = getNotificationIcon(settings.type);
  
  // Format time ago
  const timeAgo = formatTimeAgo(settings.timestamp);
  
  // Create toast HTML
  toast.innerHTML = `
    <div class="notification-toast-header">
      <h4 class="notification-toast-title">
        <span class="material-icons">${icon}</span>
        ${settings.title}
      </h4>
      <button class="notification-toast-close" aria-label="Close">
        <span class="material-icons">close</span>
      </button>
    </div>
    <div class="notification-toast-body">
      <p class="notification-toast-message">${settings.message}</p>
      <span class="notification-toast-time">${timeAgo}</span>
      <div class="notification-toast-actions">
        ${settings.actions.map(action => `
          <button class="notification-toast-action ${action.type}" data-action-index="${settings.actions.indexOf(action)}">
            ${action.text}
          </button>
        `).join('')}
      </div>
    </div>
    <div class="notification-toast-progress">
      <div class="notification-toast-progress-bar"></div>
    </div>
  `;
  
  // Add toast to container
  container.appendChild(toast);
  
  // Show toast with animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // Set up progress bar animation
  const progressBar = toast.querySelector('.notification-toast-progress-bar');
  if (progressBar && settings.duration > 0) {
    progressBar.style.transition = `width ${settings.duration}ms linear`;
    setTimeout(() => {
      progressBar.style.width = '0%';
    }, 10);
  }
  
  // Set up close button
  const closeButton = toast.querySelector('.notification-toast-close');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      closeToast(toast);
    });
  }
  
  // Set up action buttons
  const actionButtons = toast.querySelectorAll('.notification-toast-action');
  actionButtons.forEach(button => {
    button.addEventListener('click', () => {
      const actionIndex = parseInt(button.getAttribute('data-action-index'));
      if (settings.actions[actionIndex] && typeof settings.actions[actionIndex].callback === 'function') {
        settings.actions[actionIndex].callback();
      }
      closeToast(toast);
    });
  });
  
  // Auto close after duration
  if (settings.duration > 0) {
    setTimeout(() => {
      closeToast(toast);
    }, settings.duration);
  }
  
  return toast;
}

// Close toast
function closeToast(toast) {
  if (!toast) return;
  
  // Hide with animation
  toast.classList.remove('show');
  
  // Remove after animation
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 300);
}

// Sample notifications for testing
const sampleNotifications = [
  {
    title: 'New Task Assignment',
    message: 'You have been assigned a new task: Complete the quarterly report',
    type: 'info',
    timestamp: new Date()
  },
  {
    title: 'Meeting Reminder',
    message: 'Team meeting starts in 15 minutes',
    type: 'warning',
    timestamp: new Date(Date.now() - 15 * 60 * 1000) // 15 minutes ago
  },
  {
    title: 'Document Approved',
    message: 'Your document has been approved by the manager',
    type: 'success',
    timestamp: new Date(Date.now() - 60 * 60 * 1000) // 1 hour ago
  },
  {
    title: 'System Error',
    message: 'Failed to connect to the server. Please try again later.',
    type: 'error',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  }
];

// Function to show the most recent notification
function showLatestNotification() {
  // In a real app, you would fetch the latest notification from the server
  // For demo purposes, we'll use the first notification from our sample data
  const latestNotification = sampleNotifications[0];
  
  showNotificationToast({
    title: latestNotification.title,
    message: latestNotification.message,
    type: latestNotification.type,
    timestamp: latestNotification.timestamp
  });
}

// Function to show a notification after a delay
function scheduleNotification(delay) {
  setTimeout(() => {
    showLatestNotification();
  }, delay);
}

// Export functions
window.showNotificationToast = showNotificationToast;
window.showLatestNotification = showLatestNotification;
window.scheduleNotification = scheduleNotification;

// Auto show notification on page load after a short delay
document.addEventListener('DOMContentLoaded', function() {
  // Show first notification after 3 seconds
  scheduleNotification(3000);
  
  // Schedule another notification after 60 seconds
  scheduleNotification(60000);
});
