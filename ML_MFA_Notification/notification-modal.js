// Notification Modal Component
// This file contains the code for the notification modal that appears as an overlay on the Home page

// Create and initialize the notification modal
function createNotificationModal() {
  console.log('Creating notification modal');

  // Check if modal already exists
  if (document.getElementById('notification-modal-container')) {
    console.log('Notification modal already exists');
    return document.getElementById('notification-modal-container');
  }

  // Create the main container
  const modalContainer = document.createElement('div');
  modalContainer.id = 'notification-modal-container';
  modalContainer.className = 'notification-modal-container hidden';

  // Add the HTML content
  modalContainer.innerHTML = `
    <div class="notification-modal-overlay"></div>
    <div class="notification-modal-content">
      <div class="notification-modal-header">
        <div class="notification-modal-title">
          <h3>Notifications</h3>
        </div>
        <div class="notification-modal-actions">
          <button class="notification-btn" id="notification-modal-view-btn" title="View Full Page">
            <span class="material-icons">open_in_new</span>
          </button>
          <button class="notification-btn" id="notification-modal-close-btn" title="Close">
            <span class="material-icons">close</span>
          </button>
        </div>
      </div>

      <div class="notification-modal-body">
        <div class="notification-tabs">
          <button class="notification-tab-btn active" data-tab="incoming">Incoming</button>
          <button class="notification-tab-btn" data-tab="compose">Compose</button>
        </div>

        <div class="notification-tab-content active" id="incoming-tab">
          <div class="notification-list-container">
            <div class="notification-list-header">
              <h4>Recent Notifications</h4>
              <div class="notification-list-actions">
                <button class="notification-action-btn" id="mark-all-read-btn" title="Mark All as Read">
                  <span class="material-icons">done_all</span>
                  Mark All Read
                </button>
                <button class="notification-action-btn" id="clear-all-btn" title="Clear All">
                  <span class="material-icons">delete_sweep</span>
                  Clear All
                </button>
              </div>
            </div>

            <div class="notification-list" id="notification-items-list">
              <!-- Sample notification items -->
              <div class="notification-item unread">
                <div class="notification-item-icon">
                  <span class="material-icons">assignment</span>
                </div>
                <div class="notification-item-content">
                  <div class="notification-item-header">
                    <h5>New Task Assignment</h5>
                    <span class="notification-item-time">Just now</span>
                  </div>
                  <p class="notification-item-message">You have been assigned a new task: Complete the quarterly report</p>
                  <div class="notification-item-footer">
                    <span class="notification-item-tag">Task</span>
                    <div class="notification-item-actions">
                      <button class="notification-item-action-btn" title="Mark as Read">
                        <span class="material-icons">done</span>
                      </button>
                      <button class="notification-item-action-btn" title="Delete">
                        <span class="material-icons">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="notification-item">
                <div class="notification-item-icon">
                  <span class="material-icons">event</span>
                </div>
                <div class="notification-item-content">
                  <div class="notification-item-header">
                    <h5>Meeting Reminder</h5>
                    <span class="notification-item-time">15 min ago</span>
                  </div>
                  <p class="notification-item-message">Team meeting starts in 15 minutes</p>
                  <div class="notification-item-footer">
                    <span class="notification-item-tag">Reminder</span>
                    <div class="notification-item-actions">
                      <button class="notification-item-action-btn" title="Mark as Unread">
                        <span class="material-icons">markunread</span>
                      </button>
                      <button class="notification-item-action-btn" title="Delete">
                        <span class="material-icons">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="notification-item">
                <div class="notification-item-icon">
                  <span class="material-icons">approval</span>
                </div>
                <div class="notification-item-content">
                  <div class="notification-item-header">
                    <h5>Document Approval</h5>
                    <span class="notification-item-time">1 hour ago</span>
                  </div>
                  <p class="notification-item-message">Please review and approve the attached document</p>
                  <div class="notification-item-footer">
                    <span class="notification-item-tag">Approval</span>
                    <div class="notification-item-actions">
                      <button class="notification-item-action-btn" title="Mark as Unread">
                        <span class="material-icons">markunread</span>
                      </button>
                      <button class="notification-item-action-btn" title="Delete">
                        <span class="material-icons">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="notification-tab-content" id="compose-tab">
          <div class="notification-compose-container">
            <div class="notification-compose-header">
              <h4>Create New Notification</h4>
            </div>

            <div class="notification-compose-form">
              <div class="notification-form-group">
                <label for="modal-notification-title">Title</label>
                <input type="text" id="modal-notification-title" placeholder="Enter notification title">
              </div>

              <div class="notification-form-group">
                <label for="modal-notification-type">Type</label>
                <select id="modal-notification-type">
                  <option value="">Select type</option>
                  <option value="insert">Insert</option>
                  <option value="approval">Approval</option>
                  <option value="info">Info</option>
                  <option value="alert">Alert</option>
                  <option value="action">Action</option>
                </select>
              </div>

              <div class="notification-form-group">
                <label>Recipients</label>
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
                <label for="modal-notification-content">Content</label>
                <div class="notification-rich-editor" id="modal-notification-editor">
                  <div class="notification-editor-toolbar">
                    <button class="editor-tool-btn" data-command="bold" title="Bold">
                      <span class="material-icons">format_bold</span>
                    </button>
                    <button class="editor-tool-btn" data-command="italic" title="Italic">
                      <span class="material-icons">format_italic</span>
                    </button>
                    <button class="editor-tool-btn" data-command="underline" title="Underline">
                      <span class="material-icons">format_underlined</span>
                    </button>
                    <button class="editor-tool-btn" data-command="insertUnorderedList" title="Bullet List">
                      <span class="material-icons">format_list_bulleted</span>
                    </button>
                    <button class="editor-tool-btn" data-command="insertOrderedList" title="Numbered List">
                      <span class="material-icons">format_list_numbered</span>
                    </button>
                    <button class="editor-tool-btn" data-command="createLink" title="Insert Link">
                      <span class="material-icons">link</span>
                    </button>
                    <button class="editor-tool-btn" data-command="insertImage" title="Insert Image">
                      <span class="material-icons">image</span>
                    </button>
                  </div>
                  <div class="notification-editor-content" id="modal-editor-content" contenteditable="true">
                    <p>Type your notification content here...</p>
                  </div>
                </div>
              </div>

              <div class="notification-form-group">
                <label>Response Required</label>
                <div class="notification-response-options">
                  <div class="notification-response-option">
                    <input type="radio" id="modal-response-none" name="responseOption" value="none" checked>
                    <label for="modal-response-none">No response required</label>
                  </div>
                  <div class="notification-response-option">
                    <input type="radio" id="modal-response-default" name="responseOption" value="default">
                    <label for="modal-response-default">Default (24 hours)</label>
                  </div>
                  <div class="notification-response-option">
                    <input type="radio" id="modal-response-custom" name="responseOption" value="custom">
                    <label for="modal-response-custom">Custom time</label>
                  </div>

                  <div class="notification-custom-time hidden" id="modal-custom-time">
                    <div class="time-input-group">
                      <input type="number" id="modal-response-days" min="0" max="30" value="0">
                      <label for="modal-response-days">Days</label>
                    </div>
                    <div class="time-input-group">
                      <input type="number" id="modal-response-hours" min="0" max="23" value="0">
                      <label for="modal-response-hours">Hours</label>
                    </div>
                    <div class="time-input-group">
                      <input type="number" id="modal-response-minutes" min="0" max="59" value="0">
                      <label for="modal-response-minutes">Minutes</label>
                    </div>
                  </div>
                </div>
              </div>

              <div class="notification-form-actions">
                <button class="notification-cancel-btn" id="modal-notification-cancel-btn">Cancel</button>
                <button class="notification-preview-btn" id="modal-notification-preview-btn">Preview</button>
                <button class="notification-send-btn" id="modal-notification-send-btn">Send</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Add to body
  document.body.appendChild(modalContainer);

  // Add event listeners
  addNotificationModalEventListeners(modalContainer);

  return modalContainer;
}

// Add event listeners to the notification modal
function addNotificationModalEventListeners(modalContainer) {
  // Close button
  const closeBtn = modalContainer.querySelector('#notification-modal-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      hideNotificationModal();
    });
  }

  // View full page button
  const viewBtn = modalContainer.querySelector('#notification-modal-view-btn');
  if (viewBtn) {
    viewBtn.addEventListener('click', () => {
      window.location.href = 'notification-compose.html';
    });
  }

  // Tab buttons
  const tabButtons = modalContainer.querySelectorAll('.notification-tab-btn');
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all tab buttons and content
      tabButtons.forEach(btn => btn.classList.remove('active'));
      const tabContents = modalContainer.querySelectorAll('.notification-tab-content');
      tabContents.forEach(content => content.classList.remove('active'));

      // Add active class to clicked button and corresponding content
      button.classList.add('active');
      const tabId = button.getAttribute('data-tab');
      const tabContent = modalContainer.querySelector(`#${tabId}-tab`);
      if (tabContent) {
        tabContent.classList.add('active');
      }
    });
  });

  // Mark all as read button
  const markAllReadBtn = modalContainer.querySelector('#mark-all-read-btn');
  if (markAllReadBtn) {
    markAllReadBtn.addEventListener('click', () => {
      const unreadItems = modalContainer.querySelectorAll('.notification-item.unread');
      unreadItems.forEach(item => {
        item.classList.remove('unread');
      });
    });
  }

  // Clear all button
  const clearAllBtn = modalContainer.querySelector('#clear-all-btn');
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', () => {
      const notificationList = modalContainer.querySelector('#notification-items-list');
      if (notificationList) {
        notificationList.innerHTML = `
          <div class="notification-empty-state">
            <span class="material-icons">notifications_off</span>
            <p>No notifications</p>
          </div>
        `;
      }
    });
  }

  // Individual notification actions
  const notificationItems = modalContainer.querySelectorAll('.notification-item');
  notificationItems.forEach(item => {
    const readBtn = item.querySelector('.notification-item-action-btn[title="Mark as Read"]');
    const unreadBtn = item.querySelector('.notification-item-action-btn[title="Mark as Unread"]');
    const deleteBtn = item.querySelector('.notification-item-action-btn[title="Delete"]');

    if (readBtn) {
      readBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        item.classList.remove('unread');
      });
    }

    if (unreadBtn) {
      unreadBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        item.classList.add('unread');
      });
    }

    if (deleteBtn) {
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        item.remove();
      });
    }
  });

  // Response option change
  const responseOptions = modalContainer.querySelectorAll('input[name="responseOption"]');
  const customTimeContainer = modalContainer.querySelector('#modal-custom-time');

  responseOptions.forEach(option => {
    option.addEventListener('change', () => {
      if (option.value === 'custom' && customTimeContainer) {
        customTimeContainer.classList.remove('hidden');
      } else if (customTimeContainer) {
        customTimeContainer.classList.add('hidden');
      }
    });
  });

  // Rich text editor buttons
  const editorButtons = modalContainer.querySelectorAll('.editor-tool-btn');
  editorButtons.forEach(button => {
    button.addEventListener('click', () => {
      const command = button.getAttribute('data-command');

      if (command === 'createLink') {
        const url = prompt('Enter the link URL:');
        if (url) {
          document.execCommand(command, false, url);
        }
      } else if (command === 'insertImage') {
        const url = prompt('Enter the image URL:');
        if (url) {
          document.execCommand(command, false, url);
        }
      } else {
        document.execCommand(command, false, null);
      }
    });
  });

  // Editor focus
  const editorContent = modalContainer.querySelector('#modal-editor-content');
  if (editorContent) {
    editorContent.addEventListener('focus', () => {
      if (editorContent.textContent.trim() === 'Type your notification content here...') {
        editorContent.textContent = '';
      }
    });

    editorContent.addEventListener('blur', () => {
      if (editorContent.textContent.trim() === '') {
        editorContent.innerHTML = '<p>Type your notification content here...</p>';
      }
    });
  }

  // Recipient option selection
  const recipientOptions = modalContainer.querySelectorAll('.notification-recipient-option');
  recipientOptions.forEach(option => {
    option.addEventListener('click', () => {
      option.classList.toggle('selected');
    });
  });

  // Cancel button
  const cancelBtn = modalContainer.querySelector('#modal-notification-cancel-btn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      // Switch to incoming tab
      const incomingTabBtn = modalContainer.querySelector('.notification-tab-btn[data-tab="incoming"]');
      if (incomingTabBtn) {
        incomingTabBtn.click();
      }
    });
  }

  // Preview button
  const previewBtn = modalContainer.querySelector('#modal-notification-preview-btn');
  if (previewBtn) {
    previewBtn.addEventListener('click', () => {
      const title = modalContainer.querySelector('#modal-notification-title').value || 'Untitled Notification';
      const type = modalContainer.querySelector('#modal-notification-type').value || 'info';
      const content = modalContainer.querySelector('#modal-editor-content').innerHTML;

      // Create preview popup
      createNotificationPreview(title, type, content);
    });
  }

  // Send button
  const sendBtn = modalContainer.querySelector('#modal-notification-send-btn');
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const title = modalContainer.querySelector('#modal-notification-title').value;
      const type = modalContainer.querySelector('#modal-notification-type').value;
      const content = modalContainer.querySelector('#modal-editor-content').innerHTML;

      // Validate form
      if (!title || !type || content === '<p>Type your notification content here...</p>') {
        alert('Please fill in all required fields');
        return;
      }

      // Get selected recipients
      const selectedRecipients = [];
      const recipientOptions = modalContainer.querySelectorAll('.notification-recipient-option.selected');
      recipientOptions.forEach(option => {
        selectedRecipients.push(option.getAttribute('data-recipient'));
      });

      if (selectedRecipients.length === 0) {
        alert('Please select at least one recipient');
        return;
      }

      // Show success message
      alert('Notification sent successfully!');

      // Switch to incoming tab
      const incomingTabBtn = modalContainer.querySelector('.notification-tab-btn[data-tab="incoming"]');
      if (incomingTabBtn) {
        incomingTabBtn.click();
      }

      // Reset form
      modalContainer.querySelector('#modal-notification-title').value = '';
      modalContainer.querySelector('#modal-notification-type').value = '';
      modalContainer.querySelector('#modal-editor-content').innerHTML = '<p>Type your notification content here...</p>';

      // Reset recipient selection
      recipientOptions.forEach(option => {
        option.classList.remove('selected');
      });
    });
  }

  // Close modal when clicking on overlay
  const overlay = modalContainer.querySelector('.notification-modal-overlay');
  if (overlay) {
    overlay.addEventListener('click', () => {
      hideNotificationModal();
    });
  }
}

// Create notification preview
function createNotificationPreview(title, type, content) {
  // Create the preview container
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
        <div class="notification-preview-content">
          <h4>${title}</h4>
          <div class="notification-preview-message">
            ${content}
          </div>
          <div class="notification-preview-footer">
            <span class="notification-preview-tag ${type}">${type}</span>
            <span class="notification-preview-time">Preview</span>
          </div>
        </div>
      </div>
    </div>
  `;

  // Add to body
  document.body.appendChild(previewContainer);

  // Add event listeners
  const closeButton = previewContainer.querySelector('.notification-preview-close');
  closeButton.addEventListener('click', () => {
    previewContainer.remove();
  });

  // Show the preview with animation
  setTimeout(() => {
    previewContainer.classList.add('show');
  }, 100);

  // Close when clicking outside the preview
  previewContainer.addEventListener('click', (e) => {
    if (e.target === previewContainer) {
      previewContainer.remove();
    }
  });
}

// Show the notification modal
function showNotificationModal() {
  let modalContainer = document.getElementById('notification-modal-container');

  if (!modalContainer) {
    modalContainer = createNotificationModal();
  }

  modalContainer.classList.remove('hidden');
}

// Hide the notification modal
function hideNotificationModal() {
  const modalContainer = document.getElementById('notification-modal-container');

  if (modalContainer) {
    modalContainer.classList.add('hidden');
  }
}

// Toggle the notification modal
function toggleNotificationModal() {
  const modalContainer = document.getElementById('notification-modal-container');

  if (!modalContainer || modalContainer.classList.contains('hidden')) {
    showNotificationModal();
  } else {
    hideNotificationModal();
  }
}

// Export functions
window.showNotificationModal = showNotificationModal;
window.hideNotificationModal = hideNotificationModal;
window.toggleNotificationModal = toggleNotificationModal;

// Log that the script has loaded
console.log('notification-modal.js loaded successfully');

// Add a DOMContentLoaded event listener to ensure the script runs after the page is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOMContentLoaded event fired in notification-modal.js');
});
