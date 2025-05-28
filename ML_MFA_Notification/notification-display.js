// Notification Display Module
// This file contains the functionality for displaying sent and scheduled notifications

document.addEventListener('DOMContentLoaded', function() {
  // Initialize notification display
  initNotificationDisplay();

  // Add filter functionality
  initFilterButtons();
});

// Initialize notification display
function initNotificationDisplay() {
  console.log('Initializing notification display...');

  // Create sent and scheduled sections if they don't exist
  createNotificationSections();

  // Load notifications
  updateSentNotifications();
  updateScheduledNotifications();

  console.log('Notification display initialized successfully');
}

// Create sent and scheduled notification sections
function createNotificationSections() {
  const notificationsView = document.getElementById('notificationsView');
  if (!notificationsView) {
    console.error('notificationsView element not found');
    return;
  }

  // Check if sections already exist
  if (document.getElementById('sentContainer') && document.getElementById('scheduledContainer')) {
    return;
  }

  // Get the notifications-list-container to add our containers
  const notificationsListContainer = document.querySelector('.notifications-list-container');
  if (!notificationsListContainer) {
    console.error('notifications-list-container element not found');
    return;
  }

  // Create sent notifications container (hidden by default, similar to trash)
  const sentContainer = document.createElement('div');
  sentContainer.id = 'sentContainer';
  sentContainer.className = 'sent-container';
  sentContainer.style.display = 'none'; // Hide by default
  sentContainer.innerHTML = `
    <div class="sent-header">
      <h3>Sent Notifications</h3>
    </div>
    <div class="sent-list" id="sentList">
      <!-- Sent notifications will be loaded here -->
    </div>
    <div class="empty-sent-state" id="emptySentState">
      <div class="empty-state-content">
        <span class="material-icons empty-state-icon">send</span>
        <div class="empty-state-text">
          <h3 class="empty-state-title">No sent notifications</h3>
          <p class="empty-state-message">Sent notifications will appear here</p>
        </div>
      </div>
    </div>
  `;

  // Create scheduled notifications container (hidden by default, similar to trash)
  const scheduledContainer = document.createElement('div');
  scheduledContainer.id = 'scheduledContainer';
  scheduledContainer.className = 'scheduled-container';
  scheduledContainer.style.display = 'none'; // Hide by default
  scheduledContainer.innerHTML = `
    <div class="scheduled-header">
      <h3>Scheduled Notifications</h3>
    </div>
    <div class="scheduled-list" id="scheduledList">
      <!-- Scheduled notifications will be loaded here -->
    </div>
    <div class="empty-scheduled-state" id="emptyScheduledState">
      <div class="empty-state-content">
        <span class="material-icons empty-state-icon">schedule</span>
        <div class="empty-state-text">
          <h3 class="empty-state-title">No scheduled notifications</h3>
          <p class="empty-state-message">Scheduled notifications will appear here</p>
        </div>
      </div>
    </div>
  `;

  // Add containers to notifications list container (same level as trash container)
  notificationsListContainer.appendChild(sentContainer);
  notificationsListContainer.appendChild(scheduledContainer);

  // Add styles for the new containers
  addNotificationContainerStyles();
}

// Add styles for notification containers
function addNotificationContainerStyles() {
  // Check if styles already exist
  if (document.getElementById('notificationContainerStyles')) {
    return;
  }

  const styleElement = document.createElement('style');
  styleElement.id = 'notificationContainerStyles';
  styleElement.textContent = `
    .sent-container, .scheduled-container {
      margin-top: 20px;
      border-radius: 8px;
      background-color: #1a1a1a;
      overflow: hidden;
      display: none; /* Hidden by default */
    }

    .sent-header, .scheduled-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      background-color: #222;
      border-bottom: 1px solid #333;
    }

    .sent-header h3, .scheduled-header h3 {
      font-size: 1.2rem;
      font-weight: 600;
      color: #fff;
      margin: 0;
    }

    .sent-list, .scheduled-list {
      max-height: 500px;
      overflow-y: auto;
    }

    .empty-sent-state, .empty-scheduled-state {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 40px 20px;
      text-align: center;
    }

    /* Style for sent notification cards - only show delete button */
    .sent-list .notification-card .notification-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 10px;
    }

    .notification-action-btn {
      background-color: #333;
      color: #fff;
      border: none;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      margin-left: 8px;
      transition: all 0.2s;
    }

    .notification-action-btn:hover {
      transform: scale(1.1);
    }

    .notification-action-btn.delete-btn:hover {
      background-color: #f44336;
    }
  `;

  document.head.appendChild(styleElement);
}

// Add styles for notification sections
function addNotificationSectionStyles() {
  // Check if styles already exist
  if (document.getElementById('notificationSectionStyles')) {
    return;
  }

  // Create style element
  const styleElement = document.createElement('style');
  styleElement.id = 'notificationSectionStyles';
  styleElement.textContent = `
    .notifications-section {
      margin-bottom: 30px;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .section-header {
      padding: 15px 20px;
      background-color: #000;
      color: #fff;
    }

    .section-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 500;
    }

    .notifications-list {
      padding: 0;
    }

    .notification-card {
      padding: 15px 20px;
      border-bottom: 1px solid #eee;
      position: relative;
    }

    .notification-card:last-child {
      border-bottom: none;
    }

    .notification-status {
      position: absolute;
      top: 15px;
      right: 20px;
      padding: 3px 8px;
      border-radius: 12px;
      font-size: 12px;
      color: #fff;
    }

    .notification-status.sent {
      background-color: #4caf50;
    }

    .notification-status.scheduled {
      background-color: #2196f3;
    }

    .notification-status.passed {
      background-color: #f44336;
    }

    .notification-title {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 5px;
      padding-right: 80px;
    }

    .notification-meta {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #777;
      margin-bottom: 10px;
    }

    .notification-content {
      font-size: 14px;
      color: #555;
      margin-bottom: 10px;
    }

    .notification-footer {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #777;
    }

    .empty-state {
      padding: 30px;
      text-align: center;
      color: #777;
    }

    .empty-state-icon {
      font-size: 48px;
      color: #ccc;
      margin-bottom: 10px;
    }

    .empty-state-title {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 5px;
    }

    .empty-state-message {
      font-size: 14px;
    }
  `;

  // Add style element to head
  document.head.appendChild(styleElement);
}

// Update sent notifications
function updateSentNotifications() {
  const sentNotificationsList = document.getElementById('sentNotificationsList');
  const emptySentState = document.getElementById('emptySentState');

  if (!sentNotificationsList || !emptySentState) {
    console.error('Sent notifications elements not found');
    return;
  }

  // Get all keys from localStorage
  const keys = Object.keys(localStorage);

  // Filter keys that start with 'sent_notification_'
  const sentNotificationKeys = keys.filter(key => key.startsWith('sent_notification_'));

  // If no sent notifications, show empty state
  if (sentNotificationKeys.length === 0) {
    sentNotificationsList.style.display = 'none';
    emptySentState.style.display = 'block';
    return;
  }

  // Show notification list and hide empty state
  sentNotificationsList.style.display = 'block';
  emptySentState.style.display = 'none';

  // Clear existing notifications
  sentNotificationsList.innerHTML = '';

  // Sort notifications by date (newest first)
  sentNotificationKeys.sort((a, b) => {
    const notificationA = JSON.parse(localStorage.getItem(a));
    const notificationB = JSON.parse(localStorage.getItem(b));
    return new Date(notificationB.sentDate) - new Date(notificationA.sentDate);
  });

  // Create notification cards
  sentNotificationKeys.forEach(key => {
    const notification = JSON.parse(localStorage.getItem(key));

    // Format date
    const sentDate = new Date(notification.sentDate);
    const formattedDate = sentDate.toLocaleString();

    // Create notification card
    const card = document.createElement('div');
    card.className = 'notification-card';
    card.innerHTML = `
      <div class="notification-status sent">Sent</div>
      <div class="notification-title">${notification.title}</div>
      <div class="notification-meta">
        <span>${notification.type}</span>
        <span>${formattedDate}</span>
      </div>
      <div class="notification-content">${notification.content.substring(0, 150)}${notification.content.length > 150 ? '...' : ''}</div>
      <div class="notification-footer">
        <span>${notification.recipientCount} recipients</span>
        <span>${notification.languages.join(', ')}</span>
      </div>
    `;

    sentNotificationsList.appendChild(card);
  });
}

// Update scheduled notifications
function updateScheduledNotifications() {
  const scheduledNotificationsList = document.getElementById('scheduledNotificationsList');
  const emptyScheduledState = document.getElementById('emptyScheduledState');

  if (!scheduledNotificationsList || !emptyScheduledState) {
    console.error('Scheduled notifications elements not found');
    return;
  }

  // Get all keys from localStorage
  const keys = Object.keys(localStorage);

  // Filter keys that start with 'scheduled_notification_'
  const scheduledNotificationKeys = keys.filter(key => key.startsWith('scheduled_notification_'));

  // If no scheduled notifications, show empty state
  if (scheduledNotificationKeys.length === 0) {
    scheduledNotificationsList.style.display = 'none';
    emptyScheduledState.style.display = 'block';
    return;
  }

  // Show notification list and hide empty state
  scheduledNotificationsList.style.display = 'block';
  emptyScheduledState.style.display = 'none';

  // Clear existing notifications
  scheduledNotificationsList.innerHTML = '';

  // Sort notifications by scheduled date (soonest first)
  scheduledNotificationKeys.sort((a, b) => {
    const notificationA = JSON.parse(localStorage.getItem(a));
    const notificationB = JSON.parse(localStorage.getItem(b));
    return new Date(notificationA.scheduledDate) - new Date(notificationB.scheduledDate);
  });

  // Create notification cards
  scheduledNotificationKeys.forEach(key => {
    const notification = JSON.parse(localStorage.getItem(key));

    // Format scheduled date
    const scheduledDate = new Date(notification.scheduledDate);
    const formattedDate = scheduledDate.toLocaleString();

    // Check if notification is scheduled for the future
    const isFuture = scheduledDate > new Date();

    // Create notification card
    const card = document.createElement('div');
    card.className = 'notification-card';
    card.innerHTML = `
      <div class="notification-status ${isFuture ? 'scheduled' : 'passed'}">${isFuture ? 'Scheduled' : 'Passed'}</div>
      <div class="notification-title">${notification.title}</div>
      <div class="notification-meta">
        <span>${notification.type}</span>
        <span>${formattedDate}</span>
      </div>
      <div class="notification-content">${notification.content.substring(0, 150)}${notification.content.length > 150 ? '...' : ''}</div>
      <div class="notification-footer">
        <span>${notification.recipientCount} recipients</span>
        <span>${notification.languages.join(', ')}</span>
      </div>
    `;

    scheduledNotificationsList.appendChild(card);
  });
}

// Initialize filter buttons
function initFilterButtons() {
  const filterButtons = document.querySelectorAll('.filter-button');
  if (!filterButtons.length) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));

      // Add active class to clicked button
      this.classList.add('active');

      // Get filter value
      const filter = this.dataset.filter;

      // Apply filter
      applyFilter(filter);
    });
  });
}

// Apply filter to notifications
function applyFilter(filter) {
  // Get the containers and lists
  const sentContainer = document.getElementById('sentContainer');
  const scheduledContainer = document.getElementById('scheduledContainer');
  const notificationList = document.getElementById('notificationList');
  const trashContainer = document.getElementById('trashContainer');

  // Hide all containers first
  if (sentContainer) sentContainer.style.display = 'none';
  if (scheduledContainer) scheduledContainer.style.display = 'none';
  if (trashContainer) trashContainer.style.display = 'none';

  // Show notification list by default
  if (notificationList) notificationList.style.display = 'block';

  // Show appropriate container based on filter
  switch (filter) {
    case 'sent':
      // Show sent notifications container
      if (sentContainer) {
        // Hide the main notification list
        if (notificationList) notificationList.style.display = 'none';

        // Show the sent container
        sentContainer.style.display = 'block';

        // Update sent notifications
        updateSentList();
      }
      break;

    case 'scheduled':
      // Show scheduled notifications container
      if (scheduledContainer) {
        // Hide the main notification list
        if (notificationList) notificationList.style.display = 'none';

        // Show the scheduled container
        scheduledContainer.style.display = 'block';

        // Update scheduled notifications
        updateScheduledList();
      }
      break;

    case 'trash':
      // Show trash container
      if (trashContainer) {
        // Hide the main notification list
        if (notificationList) notificationList.style.display = 'none';

        // Show the trash container
        trashContainer.style.display = 'block';
      }
      break;

    case 'unread':
    case 'high':
    case 'normal':
    case 'low':
      // For other filters, show the regular notification list and apply filtering
      const notificationCards = document.querySelectorAll('#notificationList .notification-card');
      notificationCards.forEach(card => {
        // Apply specific filtering logic based on the filter
        if (filter === 'unread' && card.classList.contains('unread')) {
          card.style.display = 'block';
        } else if (filter === 'high' && card.querySelector('.notification-meta').textContent.includes('High')) {
          card.style.display = 'block';
        } else if (filter === 'normal' && card.querySelector('.notification-meta').textContent.includes('Normal')) {
          card.style.display = 'block';
        } else if (filter === 'low' && card.querySelector('.notification-meta').textContent.includes('Low')) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
      break;

    case 'all':
    default:
      // Default to showing the regular notification list with all notifications visible
      if (notificationList) {
        const notificationCards = document.querySelectorAll('#notificationList .notification-card');
        notificationCards.forEach(card => {
          card.style.display = 'block';
        });
      }
      break;
  }
}

// Update sent list
function updateSentList() {
  const sentList = document.getElementById('sentList');
  const emptySentState = document.getElementById('emptySentState');

  if (!sentList || !emptySentState) {
    console.error('Sent list elements not found');
    return;
  }

  // Get all keys from localStorage
  const keys = Object.keys(localStorage);

  // Filter keys that start with 'sent_notification_'
  const sentNotificationKeys = keys.filter(key => key.startsWith('sent_notification_'));

  // If no sent notifications, show empty state
  if (sentNotificationKeys.length === 0) {
    sentList.innerHTML = '';
    emptySentState.style.display = 'block';
    return;
  }

  // Hide empty state
  emptySentState.style.display = 'none';

  // Clear existing notifications
  sentList.innerHTML = '';

  // Sort notifications by date (newest first)
  sentNotificationKeys.sort((a, b) => {
    const notificationA = JSON.parse(localStorage.getItem(a));
    const notificationB = JSON.parse(localStorage.getItem(b));
    return new Date(notificationB.sentDate) - new Date(notificationA.sentDate);
  });

  // Create notification cards
  sentNotificationKeys.forEach(key => {
    const notification = JSON.parse(localStorage.getItem(key));

    // Format date
    const sentDate = new Date(notification.sentDate);
    const formattedDate = sentDate.toLocaleString();

    // Create notification card
    const card = document.createElement('div');
    card.className = 'notification-card';
    card.dataset.notificationId = key.replace('sent_notification_', '');
    card.innerHTML = `
      <div class="notification-status sent">Sent</div>
      <h3 class="notification-title">${notification.title}</h3>
      <div class="notification-meta">
        <span>${notification.type || 'Info'}</span>
        <span>${formattedDate}</span>
      </div>
      <div class="notification-content">${notification.content.substring(0, 150)}${notification.content.length > 150 ? '...' : ''}</div>
      <div class="notification-footer">
        <div class="notification-tags">
          <span class="notification-tag">${notification.type || 'Info'}</span>
          <span class="notification-tag">${notification.languages ? notification.languages.join(', ') : 'English'}</span>
        </div>
        <span>${notification.recipientCount || 0} recipients</span>
      </div>
      <div class="notification-actions">
        <button class="notification-action-btn delete-btn" title="Delete" data-id="${key}">
          <span class="material-icons">delete</span>
        </button>
      </div>
    `;

    sentList.appendChild(card);
  });

  // Add event listeners for delete buttons
  addDeleteButtonListeners();
}

// Add event listeners for delete buttons
function addDeleteButtonListeners() {
  const deleteButtons = document.querySelectorAll('.sent-list .delete-btn');

  deleteButtons.forEach(button => {
    button.addEventListener('click', function() {
      const notificationId = this.getAttribute('data-id');

      if (notificationId) {
        // Remove from localStorage
        localStorage.removeItem(notificationId);

        // Update the sent list
        updateSentList();

        // Instead of an alert, we'll show a temporary status message in the UI
        showTemporaryStatus('Notification deleted');
      }
    });
  });
}

// Update scheduled list
function updateScheduledList() {
  const scheduledList = document.getElementById('scheduledList');
  const emptyScheduledState = document.getElementById('emptyScheduledState');

  if (!scheduledList || !emptyScheduledState) {
    console.error('Scheduled list elements not found');
    return;
  }

  // Get all keys from localStorage
  const keys = Object.keys(localStorage);

  // Filter keys that start with 'scheduled_notification_'
  const scheduledNotificationKeys = keys.filter(key => key.startsWith('scheduled_notification_'));

  // If no scheduled notifications, show empty state
  if (scheduledNotificationKeys.length === 0) {
    scheduledList.innerHTML = '';
    emptyScheduledState.style.display = 'block';
    return;
  }

  // Hide empty state
  emptyScheduledState.style.display = 'none';

  // Clear existing notifications
  scheduledList.innerHTML = '';

  // Sort notifications by scheduled date (soonest first)
  scheduledNotificationKeys.sort((a, b) => {
    const notificationA = JSON.parse(localStorage.getItem(a));
    const notificationB = JSON.parse(localStorage.getItem(b));
    return new Date(notificationA.scheduledDate) - new Date(notificationB.scheduledDate);
  });

  // Create notification cards
  scheduledNotificationKeys.forEach(key => {
    const notification = JSON.parse(localStorage.getItem(key));

    // Format scheduled date
    const scheduledDate = new Date(notification.scheduledDate);
    const formattedDate = scheduledDate.toLocaleString();

    // Check if notification is scheduled for the future
    const isFuture = scheduledDate > new Date();

    // Create notification card
    const card = document.createElement('div');
    card.className = 'notification-card';
    card.dataset.notificationId = key.replace('scheduled_notification_', '');
    card.innerHTML = `
      <div class="notification-status ${isFuture ? 'scheduled' : 'passed'}">${isFuture ? 'Scheduled' : 'Passed'}</div>
      <h3 class="notification-title">${notification.title}</h3>
      <div class="notification-meta">
        <span>${notification.type || 'Info'}</span>
        <span>${formattedDate}</span>
      </div>
      <div class="notification-content">${notification.content.substring(0, 150)}${notification.content.length > 150 ? '...' : ''}</div>
      <div class="notification-footer">
        <div class="notification-tags">
          <span class="notification-tag">${notification.type || 'Info'}</span>
          <span class="notification-tag">${notification.languages ? notification.languages.join(', ') : 'English'}</span>
        </div>
        <span>${notification.recipientCount || 0} recipients</span>
      </div>
      <div class="notification-actions">
        <button class="notification-action-btn edit-btn" title="Edit">
          <span class="material-icons">edit</span>
        </button>
        <button class="notification-action-btn delete-btn" title="Delete">
          <span class="material-icons">delete</span>
        </button>
      </div>
    `;

    scheduledList.appendChild(card);
  });
}

// Function to show a temporary status message
function showTemporaryStatus(message) {
  // Check if status container already exists
  let statusContainer = document.getElementById('status-message-container');

  // Create status container if it doesn't exist
  if (!statusContainer) {
    statusContainer = document.createElement('div');
    statusContainer.id = 'status-message-container';
    statusContainer.style.position = 'fixed';
    statusContainer.style.bottom = '20px';
    statusContainer.style.right = '20px';
    statusContainer.style.backgroundColor = '#333';
    statusContainer.style.color = '#fff';
    statusContainer.style.padding = '10px 15px';
    statusContainer.style.borderRadius = '4px';
    statusContainer.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
    statusContainer.style.zIndex = '9999';
    statusContainer.style.opacity = '0';
    statusContainer.style.transform = 'translateY(20px)';
    statusContainer.style.transition = 'opacity 0.3s, transform 0.3s';
    document.body.appendChild(statusContainer);
  }

  // Set message
  statusContainer.textContent = message;

  // Show the message
  setTimeout(() => {
    statusContainer.style.opacity = '1';
    statusContainer.style.transform = 'translateY(0)';
  }, 10);

  // Hide after 3 seconds
  setTimeout(() => {
    statusContainer.style.opacity = '0';
    statusContainer.style.transform = 'translateY(20px)';
  }, 3000);
}

// Export functions
window.updateSentList = updateSentList;
window.updateScheduledList = updateScheduledList;
