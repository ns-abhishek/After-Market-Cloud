// Notification View
// This file contains the code for showing the notification view when clicking "View" in a notification popup

// Function to load notification view
function loadNotificationView() {
  console.log('Loading notification view');

  // Check if we already have the notification container
  const existingContainer = document.getElementById('notification-modal');
  if (existingContainer) {
    // Just show it if it already exists
    existingContainer.style.display = 'flex';
    return;
  }

  // Create container for the notification view
  const container = document.createElement('div');
  container.id = 'notification-modal';
  container.className = 'notification-modal';

  // Add overlay
  const overlay = document.createElement('div');
  overlay.className = 'notification-overlay';
  container.appendChild(overlay);

  // Add content container
  const notificationContainer = document.createElement('div');
  notificationContainer.className = 'notification-container';
  container.appendChild(notificationContainer);

  // Add header
  const header = document.createElement('div');
  header.className = 'notification-header';
  header.innerHTML = `
    <h2>Notifications</h2>
    <div class="notification-actions">
      <button id="notification-maximize-btn" class="notification-action-btn" title="Maximize">
        <span class="material-icons">open_in_new</span>
      </button>
      <button id="notification-close-btn" class="notification-action-btn" title="Close">
        <span class="material-icons">close</span>
      </button>
    </div>
  `;
  notificationContainer.appendChild(header);

  // Create content wrapper
  const content = document.createElement('div');
  content.className = 'notification-content';

  // Directly embed the notification content HTML
  content.innerHTML = `
    <!-- Filter Bar -->
    <div class="filter-bar">
      <div class="filter-buttons">
        <button class="filter-button active" style="color: #ffffff !important; font-weight: bold !important; background-color: #000000 !important; border: 3px solid #000000 !important; padding: 8px 16px !important; font-size: 16px !important; text-shadow: 0 0 1px rgba(255,255,255,0.5) !important;">ALL</button>
        <button class="filter-button" style="color: #000000 !important; font-weight: bold !important; background-color: #ffffff !important; border: 3px solid #000000 !important; padding: 8px 16px !important; font-size: 16px !important; text-shadow: 0 0 1px rgba(0,0,0,0.5) !important;">UNREAD</button>
        <button class="filter-button" style="color: #000000 !important; font-weight: bold !important; background-color: #ffffff !important; border: 3px solid #000000 !important; padding: 8px 16px !important; font-size: 16px !important; text-shadow: 0 0 1px rgba(0,0,0,0.5) !important;">IMPORTANT</button>
        <button class="filter-button" style="color: #000000 !important; font-weight: bold !important; background-color: #ffffff !important; border: 3px solid #000000 !important; padding: 8px 16px !important; font-size: 16px !important; text-shadow: 0 0 1px rgba(0,0,0,0.5) !important;">SCHEDULED</button>
        <button class="filter-button" style="color: #000000 !important; font-weight: bold !important; background-color: #ffffff !important; border: 3px solid #000000 !important; padding: 8px 16px !important; font-size: 16px !important; text-shadow: 0 0 1px rgba(0,0,0,0.5) !important;">APPROVALS</button>
      </div>
      <button id="createNotificationBtn" class="create-button" style="color: #000000 !important; font-weight: bold !important; background-color: #ffffff !important; border: 3px solid #000000 !important; padding: 8px 16px !important; font-size: 16px !important; text-shadow: 0 0 1px rgba(0,0,0,0.5) !important;">
        <span class="material-icons" style="color: #000000 !important; font-size: 18px !important;">add</span>
        CREATE NEW
      </button>
    </div>

    <!-- Notifications List -->
    <div class="notifications-list">
      <!-- Important Notification -->
      <div class="notification-item important">
        <div class="notification-icon">
          <span class="material-icons">error</span>
        </div>
        <div class="notification-content">
          <p class="notification-message">The system will be down for maintenance tonight from 10 PM to 2 AM. Please save your work before 9:30 PM.</p>
          <div class="notification-meta">
            <span class="notification-sender">From: Rajesh Sharma (IT Department)</span>
            <div class="notification-time">2 hours ago</div>
          </div>
          <div class="notification-actions">
            <button class="action-button mark-read" title="Mark as Read">
              <span class="material-icons">done</span>
            </button>
            <button class="action-button delete" title="Delete">
              <span class="material-icons">delete</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Approval Notification -->
      <div class="notification-item approval">
        <div class="notification-icon">
          <span class="material-icons">person</span>
        </div>
        <div class="notification-content">
          <p class="notification-message">Priya Patel has submitted an expense report for your approval. Please review and approve or reject.</p>
          <div class="notification-meta">
            <span class="notification-sender">From: Priya Patel (Finance)</span>
            <div class="notification-time">Yesterday</div>
          </div>
          <div class="notification-actions">
            <button class="action-button approve" title="Approve">
              <span class="material-icons">check_circle</span>
            </button>
            <button class="action-button reject" title="Reject">
              <span class="material-icons">cancel</span>
            </button>
            <button class="action-button delete" title="Delete">
              <span class="material-icons">delete</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Scheduled Notification -->
      <div class="notification-item scheduled">
        <div class="notification-icon">
          <span class="material-icons">event</span>
        </div>
        <div class="notification-content">
          <p class="notification-message">Weekly team meeting scheduled for Friday, 10:00 AM in Conference Room A. Please prepare your project updates.</p>
          <div class="notification-meta">
            <span class="notification-sender">From: Ananya Desai (Team Lead)</span>
            <div class="notification-time">2 days ago</div>
          </div>
          <div class="notification-actions">
            <button class="action-button calendar" title="Add to Calendar">
              <span class="material-icons">calendar_today</span>
            </button>
            <button class="action-button delete" title="Delete">
              <span class="material-icons">delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Add the content to our container
  notificationContainer.appendChild(content);

  // Add to body
  document.body.appendChild(container);

  // Add event listeners
  const closeBtn = container.querySelector('#notification-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      container.style.display = 'none';
    });
  }

  const maximizeBtn = container.querySelector('#notification-maximize-btn');
  if (maximizeBtn) {
    maximizeBtn.addEventListener('click', () => {
      window.location.href = 'notification-compose.html';
    });
  }

  // Close when clicking on overlay
  overlay.addEventListener('click', () => {
    container.style.display = 'none';
  });

  // Initialize notification functionality
  initializeNotificationFunctionality(container);

  return container;
}

// Function to initialize notification functionality
function initializeNotificationFunctionality(container) {
  // Filter buttons
  const filterButtons = container.querySelectorAll('.filter-button');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons and reset text color
      filterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.style.color = '#000000 !important'; // Reset to black text
        btn.style.fontWeight = 'bold !important'; // Keep bold
        btn.style.backgroundColor = '#ffffff !important'; // White background
        btn.style.border = '3px solid #000000 !important'; // Black border
        btn.style.padding = '8px 16px !important'; // Padding
        btn.style.fontSize = '16px !important'; // Font size
        btn.style.textShadow = '0 0 1px rgba(0,0,0,0.5) !important'; // Text shadow
      });

      // Add active class to clicked button and set text color to white
      button.classList.add('active');
      button.style.color = '#ffffff !important'; // White text for active button
      button.style.backgroundColor = '#000000 !important'; // Black background
      button.style.textShadow = '0 0 1px rgba(255,255,255,0.5) !important'; // Text shadow

      // Filter notifications based on button text
      const filterType = button.textContent.trim().toLowerCase();
      const notificationItems = container.querySelectorAll('.notification-item');

      notificationItems.forEach(item => {
        if (filterType === 'all') {
          item.style.display = 'flex';
        } else if (filterType === 'important' && item.classList.contains('important')) {
          item.style.display = 'flex';
        } else if (filterType === 'scheduled' && item.classList.contains('scheduled')) {
          item.style.display = 'flex';
        } else if (filterType === 'approvals' && item.classList.contains('approval')) {
          item.style.display = 'flex';
        } else if (filterType === 'unread' && !item.classList.contains('read')) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Create notification button
  const createBtn = container.querySelector('#createNotificationBtn');
  if (createBtn) {
    createBtn.addEventListener('click', () => {
      // Redirect to notification compose page
      window.location.href = 'notification-compose.html';
    });
  }

  // Notification action buttons
  const actionButtons = container.querySelectorAll('.action-button');
  actionButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent notification item click

      const notificationItem = button.closest('.notification-item');

      if (button.classList.contains('mark-read')) {
        notificationItem.classList.add('read');
      } else if (button.classList.contains('delete')) {
        notificationItem.remove();
      } else if (button.classList.contains('approve')) {
        alert('Notification approved!');
        notificationItem.remove();
      } else if (button.classList.contains('reject')) {
        alert('Notification rejected!');
        notificationItem.remove();
      } else if (button.classList.contains('calendar')) {
        alert('Added to calendar!');
      }
    });
  });

  // Make notification items clickable
  const notificationItems = container.querySelectorAll('.notification-item');
  notificationItems.forEach(item => {
    item.addEventListener('click', () => {
      // Mark as read
      item.classList.add('read');

      // Redirect to notification compose page
      window.location.href = 'notification-compose.html';
    });
  });
}

// Export functions
window.loadNotificationComposeInline = loadNotificationView; // Use the same function name for compatibility
