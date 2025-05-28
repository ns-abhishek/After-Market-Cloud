// Notification Alert System
// This file contains the code for displaying notification alerts similar to WhatsApp

// Sample notifications for demonstration
const sampleNotifications = [
  {
    id: 1,
    title: "New Task Assigned",
    sender: "Project Manager",
    content: "You have been assigned a new task: Complete the quarterly report",
    time: "Just now",
    type: "task",
    avatar: "https://ui-avatars.com/api/?name=Project+Manager&background=3b82f6&color=fff"
  },
  {
    id: 2,
    title: "Meeting Reminder",
    sender: "Calendar",
    content: "Team meeting starts in 15 minutes",
    time: "15 min ago",
    type: "reminder",
    avatar: "https://ui-avatars.com/api/?name=Calendar&background=10b981&color=fff"
  },
  {
    id: 3,
    title: "Document Approval",
    sender: "Sarah Johnson",
    content: "Please review and approve the attached document",
    time: "1 hour ago",
    type: "approval",
    avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=ef4444&color=fff"
  }
];

// Create and show a notification alert
function showNotificationAlert(notification = null) {
  // If no notification is provided, use a random sample notification
  if (!notification) {
    notification = sampleNotifications[Math.floor(Math.random() * sampleNotifications.length)];
  }

  // Check if there's already an alert showing
  const existingAlert = document.querySelector('.notification-alert');
  if (existingAlert) {
    existingAlert.remove();
  }

  // Create the alert element
  const alertElement = document.createElement('div');
  alertElement.className = 'notification-alert';
  alertElement.setAttribute('data-notification-id', notification.id);

  // Add the HTML content
  alertElement.innerHTML = `
    <div class="notification-alert-content">
      <div class="notification-alert-avatar">
        <img src="${notification.avatar}" alt="${notification.sender}">
      </div>
      <div class="notification-alert-details">
        <div class="notification-alert-header">
          <h4>${notification.title}</h4>
          <span class="notification-alert-time">${notification.time}</span>
        </div>
        <div class="notification-alert-sender">${notification.sender}</div>
        <div class="notification-alert-message">${notification.content}</div>
      </div>
    </div>
    <div class="notification-alert-actions">
      <button class="notification-alert-close">
        <span class="material-icons">close</span>
      </button>
    </div>
  `;

  // Add to body
  document.body.appendChild(alertElement);

  // Add event listeners
  const closeButton = alertElement.querySelector('.notification-alert-close');
  closeButton.addEventListener('click', (e) => {
    e.stopPropagation();
    hideNotificationAlert();
  });

  // Add click event to open the notification preview popup
  alertElement.addEventListener('click', () => {
    // Hide the alert
    hideNotificationAlert();

    // Open the notification preview popup
    openNotificationPreview(notification);
  });

  // Show the alert with animation
  setTimeout(() => {
    alertElement.classList.add('show');
  }, 100);

  // Auto-hide after 5 seconds
  setTimeout(() => {
    hideNotificationAlert();
  }, 5000);

  return alertElement;
}

// Hide the notification alert
function hideNotificationAlert() {
  const alertElement = document.querySelector('.notification-alert');
  if (alertElement) {
    alertElement.classList.remove('show');

    // Remove from DOM after animation completes
    setTimeout(() => {
      alertElement.remove();
    }, 300);
  }
}

// Simulate receiving a notification
function simulateNotification() {
  // Get a random notification from the sample list
  const randomNotification = sampleNotifications[Math.floor(Math.random() * sampleNotifications.length)];

  // Show the notification alert
  showNotificationAlert(randomNotification);
}

// Function to open notification preview popup
function openNotificationPreview(notification) {
  // Create the preview popup container
  const previewContainer = document.createElement('div');
  previewContainer.className = 'notification-preview-container';

  // Create the preview content
  previewContainer.innerHTML = `
    <div class="notification-preview-popup">
      <div class="notification-preview-header">
        <h3>Notification Preview</h3>
        <button class="notification-preview-close">
          <span class="material-icons">close</span>
        </button>
      </div>
      <div class="notification-preview-body">
        <div class="notification-preview-info">
          <div class="notification-preview-avatar">
            <img src="${notification.avatar}" alt="${notification.sender}">
          </div>
          <div class="notification-preview-details">
            <h4>${notification.title}</h4>
            <div class="notification-preview-sender">${notification.sender}</div>
            <div class="notification-preview-time">${notification.time}</div>
          </div>
        </div>
        <div class="notification-preview-content">
          <p>${notification.content}</p>
        </div>
      </div>
      <div class="notification-preview-actions">
        <button class="notification-preview-view-all" onclick="window.location.href='notification-compose.html'">
          View All Notifications
        </button>
      </div>
    </div>
  `;

  // Add to body
  document.body.appendChild(previewContainer);

  // Add event listeners
  const closeButton = previewContainer.querySelector('.notification-preview-close');
  closeButton.addEventListener('click', () => {
    closeNotificationPreview();
  });

  // Show the preview with animation
  setTimeout(() => {
    previewContainer.classList.add('show');
  }, 100);

  // Close when clicking outside the preview
  previewContainer.addEventListener('click', (e) => {
    if (e.target === previewContainer) {
      closeNotificationPreview();
    }
  });
}

// Function to close notification preview
function closeNotificationPreview() {
  const previewContainer = document.querySelector('.notification-preview-container');
  if (previewContainer) {
    previewContainer.classList.remove('show');

    // Remove from DOM after animation completes
    setTimeout(() => {
      previewContainer.remove();
    }, 300);
  }
}

// Export functions
window.showNotificationAlert = showNotificationAlert;
window.hideNotificationAlert = hideNotificationAlert;
window.simulateNotification = simulateNotification;
window.openNotificationPreview = openNotificationPreview;
window.closeNotificationPreview = closeNotificationPreview;
