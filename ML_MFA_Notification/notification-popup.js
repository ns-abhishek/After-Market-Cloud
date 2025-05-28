// Notification Popup Component
// This file contains the code for the notification popup interface

// Create and initialize the notification popup
function createNotificationPopup() {
  console.log('Creating notification popup');
  
  // Check if popup already exists
  if (document.getElementById('notification-popup-container')) {
    console.log('Notification popup already exists');
    return document.getElementById('notification-popup-container');
  }
  
  // Create the main container
  const popupContainer = document.createElement('div');
  popupContainer.id = 'notification-popup-container';
  popupContainer.className = 'notification-popup-container hidden';
  
  // Add the HTML content
  popupContainer.innerHTML = `
    <div class="notification-popup-header">
      <div class="notification-popup-title">
        <h3>Push Notifications</h3>
      </div>
      <div class="notification-popup-actions">
        <button class="notification-btn" id="notification-popup-view-btn" title="View Full Page">
          <span class="material-icons">open_in_new</span>
        </button>
        <button class="notification-btn" id="notification-popup-minimize-btn" title="Minimize">
          <span class="material-icons">remove</span>
        </button>
        <button class="notification-btn" id="notification-popup-close-btn" title="Close">
          <span class="material-icons">close</span>
        </button>
      </div>
    </div>
    
    <div class="notification-popup-content">
      <div class="notification-popup-toolbar">
        <button class="notification-create-btn" id="notification-create-btn">
          <span class="material-icons">add</span>
          Create New Notification
        </button>
      </div>
      
      <div class="notification-compose-form hidden" id="notification-compose-form">
        <h4 class="notification-form-title">Compose New Notification</h4>
        
        <div class="notification-form-group">
          <label for="notification-title">Title</label>
          <input type="text" id="notification-title" placeholder="Enter notification title">
        </div>
        
        <div class="notification-form-group">
          <label for="notification-type">Type</label>
          <select id="notification-type">
            <option value="">Select type</option>
            <option value="insert">Insert</option>
            <option value="approval">Approval</option>
            <option value="info">Info</option>
            <option value="alert">Alert</option>
            <option value="action">Action</option>
          </select>
        </div>
        
        <div class="notification-form-group">
          <label for="notification-recipients">Recipients</label>
          <div class="notification-recipients-selector">
            <button class="notification-recipient-option" data-recipient="all">All Users</button>
            <button class="notification-recipient-option" data-recipient="downline">Downline</button>
            <button class="notification-recipient-option" data-recipient="company">Company</button>
            <button class="notification-recipient-option" data-recipient="group">Group/Team</button>
            <button class="notification-recipient-option" data-recipient="role">Role-based</button>
            <button class="notification-recipient-option" data-recipient="individual">Individual</button>
          </div>
        </div>
        
        <div class="notification-form-group">
          <label for="notification-content">Content</label>
          <textarea id="notification-content" placeholder="Enter notification content"></textarea>
        </div>
        
        <div class="notification-form-actions">
          <button class="notification-cancel-btn" id="notification-cancel-btn">Cancel</button>
          <button class="notification-save-btn" id="notification-save-btn">Save Draft</button>
        </div>
      </div>
      
      <div class="notification-list" id="notification-list">
        <div class="notification-empty-state">
          <span class="material-icons">notifications_off</span>
          <p>No notifications yet</p>
          <p>Create your first notification</p>
        </div>
      </div>
    </div>
  `;
  
  // Add to body
  document.body.appendChild(popupContainer);
  
  // Add event listeners
  addNotificationPopupEventListeners(popupContainer);
  
  return popupContainer;
}

// Add event listeners to the notification popup
function addNotificationPopupEventListeners(popupContainer) {
  // Close button
  const closeBtn = popupContainer.querySelector('#notification-popup-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      hideNotificationPopup();
    });
  }
  
  // Minimize button
  const minimizeBtn = popupContainer.querySelector('#notification-popup-minimize-btn');
  if (minimizeBtn) {
    minimizeBtn.addEventListener('click', () => {
      popupContainer.classList.toggle('minimized');
    });
  }
  
  // View full page button
  const viewBtn = popupContainer.querySelector('#notification-popup-view-btn');
  if (viewBtn) {
    viewBtn.addEventListener('click', () => {
      window.location.href = 'notification-compose.html';
    });
  }
  
  // Create notification button
  const createBtn = popupContainer.querySelector('#notification-create-btn');
  const composeForm = popupContainer.querySelector('#notification-compose-form');
  const notificationList = popupContainer.querySelector('#notification-list');
  
  if (createBtn && composeForm && notificationList) {
    createBtn.addEventListener('click', () => {
      composeForm.classList.remove('hidden');
      notificationList.classList.add('hidden');
    });
  }
  
  // Cancel button
  const cancelBtn = popupContainer.querySelector('#notification-cancel-btn');
  if (cancelBtn && composeForm && notificationList) {
    cancelBtn.addEventListener('click', () => {
      composeForm.classList.add('hidden');
      notificationList.classList.remove('hidden');
      
      // Reset form
      const titleInput = popupContainer.querySelector('#notification-title');
      const typeSelect = popupContainer.querySelector('#notification-type');
      const contentTextarea = popupContainer.querySelector('#notification-content');
      
      if (titleInput) titleInput.value = '';
      if (typeSelect) typeSelect.value = '';
      if (contentTextarea) contentTextarea.value = '';
      
      // Reset recipient selection
      const recipientOptions = popupContainer.querySelectorAll('.notification-recipient-option');
      recipientOptions.forEach(option => {
        option.classList.remove('selected');
      });
    });
  }
  
  // Save button
  const saveBtn = popupContainer.querySelector('#notification-save-btn');
  if (saveBtn && composeForm && notificationList) {
    saveBtn.addEventListener('click', () => {
      const titleInput = popupContainer.querySelector('#notification-title');
      const typeSelect = popupContainer.querySelector('#notification-type');
      const contentTextarea = popupContainer.querySelector('#notification-content');
      
      // Validate form
      if (!titleInput.value || !typeSelect.value || !contentTextarea.value) {
        alert('Please fill in all required fields');
        return;
      }
      
      // Get selected recipients
      const selectedRecipients = [];
      const recipientOptions = popupContainer.querySelectorAll('.notification-recipient-option.selected');
      recipientOptions.forEach(option => {
        selectedRecipients.push(option.getAttribute('data-recipient'));
      });
      
      if (selectedRecipients.length === 0) {
        alert('Please select at least one recipient');
        return;
      }
      
      // Create notification card
      const notificationCard = document.createElement('div');
      notificationCard.className = 'notification-card';
      notificationCard.innerHTML = `
        <div class="notification-card-header">
          <h4>${titleInput.value}</h4>
          <span class="notification-badge ${typeSelect.value}">${typeSelect.value}</span>
        </div>
        <div class="notification-card-content">
          <p>${contentTextarea.value}</p>
        </div>
        <div class="notification-card-footer">
          <span class="notification-status">Draft</span>
          <span class="notification-time">Just now</span>
        </div>
      `;
      
      // Replace empty state with notification card
      notificationList.innerHTML = '';
      notificationList.appendChild(notificationCard);
      
      // Hide form and show list
      composeForm.classList.add('hidden');
      notificationList.classList.remove('hidden');
      
      // Reset form
      titleInput.value = '';
      typeSelect.value = '';
      contentTextarea.value = '';
      
      // Reset recipient selection
      recipientOptions.forEach(option => {
        option.classList.remove('selected');
      });
    });
  }
  
  // Recipient option selection
  const recipientOptions = popupContainer.querySelectorAll('.notification-recipient-option');
  recipientOptions.forEach(option => {
    option.addEventListener('click', () => {
      option.classList.toggle('selected');
    });
  });
}

// Show the notification popup
function showNotificationPopup() {
  let popupContainer = document.getElementById('notification-popup-container');
  
  if (!popupContainer) {
    popupContainer = createNotificationPopup();
  }
  
  popupContainer.classList.remove('hidden');
  popupContainer.classList.remove('minimized');
}

// Hide the notification popup
function hideNotificationPopup() {
  const popupContainer = document.getElementById('notification-popup-container');
  
  if (popupContainer) {
    popupContainer.classList.add('hidden');
  }
}

// Toggle the notification popup
function toggleNotificationPopup() {
  const popupContainer = document.getElementById('notification-popup-container');
  
  if (!popupContainer || popupContainer.classList.contains('hidden')) {
    showNotificationPopup();
  } else {
    hideNotificationPopup();
  }
}

// Export functions
window.showNotificationPopup = showNotificationPopup;
window.hideNotificationPopup = hideNotificationPopup;
window.toggleNotificationPopup = toggleNotificationPopup;
