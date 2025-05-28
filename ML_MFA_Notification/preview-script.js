// Initialize global variables
window.selectedRecipients = [];

// Preview functionality
document.addEventListener('DOMContentLoaded', function() {
  const previewBtn = document.getElementById('previewBtn');
  const previewModal = document.getElementById('previewModal');
  const closePreviewBtn = document.getElementById('closePreviewBtn');
  const previewDeviceSelect = document.getElementById('previewDeviceSelect');
  const previewDeviceFrame = document.getElementById('previewDeviceFrame');
  const previewLanguageSelect = document.getElementById('previewLanguageSelect');
  const previewRecipientTypeSelect = document.getElementById('previewRecipientTypeSelect');
  const previewNotification = document.getElementById('previewNotification');
  const previewRecipientCount = document.getElementById('previewRecipientCount');
  const previewEditRecipientsBtn = document.getElementById('previewEditRecipientsBtn');

  // Open preview modal
  if (previewBtn) {
    previewBtn.addEventListener('click', function() {
      // Populate language options
      if (previewLanguageSelect) {
        const recipientsByLanguage = getRecipientsByLanguage();
        const languages = Object.keys(recipientsByLanguage);

        if (languages.length === 0) {
          // No recipients selected, show default option
          previewLanguageSelect.innerHTML = '<option value="">No recipients selected</option>';
        } else {
          // Create options for each language
          let optionsHTML = '';
          languages.forEach(language => {
            optionsHTML += `<option value="${language}">${language} (${recipientsByLanguage[language].length} recipients)</option>`;
          });
          previewLanguageSelect.innerHTML = optionsHTML;
        }
      }

      // Update recipient count
      if (previewRecipientCount) {
        const totalRecipients = selectedRecipients.length;
        previewRecipientCount.textContent = `${totalRecipients} recipient${totalRecipients !== 1 ? 's' : ''} selected`;
      }

      // Show modal
      previewModal.classList.add('active');

      // Update preview
      updatePreview();
    });
  }

  // Close preview modal
  if (closePreviewBtn) {
    closePreviewBtn.addEventListener('click', function() {
      previewModal.classList.remove('active');
    });
  }

  // Open edit recipients modal from preview
  if (previewEditRecipientsBtn) {
    previewEditRecipientsBtn.addEventListener('click', function() {
      // Close preview modal
      previewModal.classList.remove('active');

      // Open edit recipients modal directly
      const editRecipientsModal = document.getElementById('editRecipientsModal');
      if (editRecipientsModal) {
        // Create temporary copy of selected recipients
        window.tempSelectedRecipients = [...window.selectedRecipients];

        // Clone recipient list to edit modal
        const editRecipientList = document.getElementById('editRecipientList');
        const originalList = document.getElementById('recipientList');
        if (editRecipientList && originalList) {
          editRecipientList.innerHTML = originalList.innerHTML;

          // Add event listeners to checkboxes in the cloned list
          const checkboxes = editRecipientList.querySelectorAll('input[type="checkbox"]');
          checkboxes.forEach(checkbox => {
            // Set initial state based on selected recipients
            const userId = parseInt(checkbox.dataset.userId);
            const isSelected = window.selectedRecipients.some(recipient => recipient.id === userId);
            checkbox.checked = isSelected;

            // Add change event listener
            checkbox.addEventListener('change', function() {
              const recipientItem = this.closest('.recipient-item');
              const userId = parseInt(recipientItem.dataset.userId);
              const userName = recipientItem.querySelector('.recipient-name').textContent;
              const userLanguage = recipientItem.dataset.language;
              const userRole = recipientItem.querySelector('.recipient-role').textContent;

              if (this.checked) {
                // Add to temporary selected recipients
                if (!window.tempSelectedRecipients.some(r => r.id === userId)) {
                  window.tempSelectedRecipients.push({
                    id: userId,
                    name: userName,
                    language: userLanguage,
                    role: userRole
                  });
                }
              } else {
                // Remove from temporary selected recipients
                window.tempSelectedRecipients = window.tempSelectedRecipients.filter(r => r.id !== userId);
              }

              // Update selected recipients list in modal
              updateSelectedRecipientsList();
            });
          });
        }

        // Clone filter options to edit modal
        const editRecipientFilterOptions = document.getElementById('editRecipientFilterOptions');
        if (editRecipientFilterOptions) {
          const originalFilterOptions = document.getElementById('recipientFilterOptions');
          if (originalFilterOptions) {
            editRecipientFilterOptions.innerHTML = originalFilterOptions.innerHTML;

            // Add event listeners to filter radio buttons
            const filterRadios = editRecipientFilterOptions.querySelectorAll('input[name="recipientFilter"]');
            filterRadios.forEach(radio => {
              radio.name = 'editRecipientFilter'; // Change name to avoid conflict
              radio.addEventListener('change', function() {
                // Hide all sub-filters
                const subFilters = editRecipientFilterOptions.querySelectorAll('.sub-filter');
                subFilters.forEach(filter => filter.classList.add('hidden'));

                // Show the selected sub-filter
                if (this.value !== 'all' && this.value !== 'downline') {
                  const subFilter = editRecipientFilterOptions.querySelector(`.${this.value}-filter`);
                  if (subFilter) {
                    subFilter.classList.remove('hidden');
                  }
                }

                // Apply filter to edit recipient list
                applyEditFilter();
              });
            });

            // Initialize sub-filter selects
            const filterSelects = editRecipientFilterOptions.querySelectorAll('.sub-filter select');
            filterSelects.forEach(select => {
              select.addEventListener('change', applyEditFilter);
            });
          }
        }

        // Update selected recipients list in modal
        updateSelectedRecipientsList();

        // Show modal
        editRecipientsModal.classList.add('active');
      }
    });
  }

  // Function to update selected recipients list in modal
  function updateSelectedRecipientsList() {
    const selectedRecipientsList = document.getElementById('selectedRecipientsList');
    const selectedRecipientCount = document.getElementById('selectedRecipientCount');
    const editRecipientsLanguageTabs = document.getElementById('editRecipientsLanguageTabs');

    if (!selectedRecipientsList || !selectedRecipientCount) return;

    // Update count
    selectedRecipientCount.textContent = `${window.tempSelectedRecipients.length} recipient${window.tempSelectedRecipients.length !== 1 ? 's' : ''}`;

    // If no recipients selected, show empty message
    if (window.tempSelectedRecipients.length === 0) {
      selectedRecipientsList.innerHTML = '<div class="empty-selection-message">No recipients selected</div>';
      return;
    }

    // Group recipients by language
    const recipientsByLanguage = {};
    window.tempSelectedRecipients.forEach(recipient => {
      if (!recipientsByLanguage[recipient.language]) {
        recipientsByLanguage[recipient.language] = [];
      }
      recipientsByLanguage[recipient.language].push(recipient);
    });

    // Create language tabs
    let tabsHTML = '';
    Object.keys(recipientsByLanguage).forEach((language, index) => {
      tabsHTML += `
        <div class="language-tab ${index === 0 ? 'active' : ''}" data-language="${language}">
          ${language} (${recipientsByLanguage[language].length})
        </div>
      `;
    });

    editRecipientsLanguageTabs.innerHTML = tabsHTML;

    // Add event listeners to tabs
    const tabs = editRecipientsLanguageTabs.querySelectorAll('.language-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        // Remove active class from all tabs
        tabs.forEach(t => t.classList.remove('active'));

        // Add active class to clicked tab
        this.classList.add('active');

        // Show recipients for selected language
        const language = this.dataset.language;
        showRecipientsForLanguage(language);
      });
    });

    // Show recipients for first language
    const firstLanguage = Object.keys(recipientsByLanguage)[0];
    showRecipientsForLanguage(firstLanguage);
  }

  // Show recipients for selected language
  function showRecipientsForLanguage(language) {
    const selectedRecipientsList = document.getElementById('selectedRecipientsList');
    if (!selectedRecipientsList) return;

    // Get recipients for language
    const recipients = window.tempSelectedRecipients.filter(recipient => recipient.language === language);

    // Create HTML for recipients
    let recipientsHTML = '';
    recipients.forEach(recipient => {
      recipientsHTML += `
        <div class="selected-recipient-item" data-user-id="${recipient.id}">
          <div class="recipient-info-compact">
            <div class="recipient-name-compact">${recipient.name}</div>
            <div class="recipient-details-compact">${recipient.role}</div>
          </div>
          <button class="remove-recipient-btn" data-user-id="${recipient.id}">
            <span class="material-icons">close</span>
          </button>
        </div>
      `;
    });

    // Update list
    selectedRecipientsList.innerHTML = recipientsHTML;

    // Add event listeners to remove buttons
    const removeButtons = selectedRecipientsList.querySelectorAll('.remove-recipient-btn');
    removeButtons.forEach(button => {
      button.addEventListener('click', function() {
        const userId = parseInt(this.dataset.userId);

        // Remove from temporary selected recipients
        window.tempSelectedRecipients = window.tempSelectedRecipients.filter(recipient => recipient.id !== userId);

        // Uncheck checkbox in edit recipient list
        const checkbox = document.getElementById('editRecipientList').querySelector(`input[data-user-id="${userId}"]`);
        if (checkbox) {
          checkbox.checked = false;
        }

        // Update selected recipients list
        updateSelectedRecipientsList();
      });
    });
  }

  // Apply filter to edit recipient list
  function applyEditFilter() {
    const selectedFilter = document.querySelector('input[name="editRecipientFilter"]:checked').value;
    const recipientItems = document.getElementById('editRecipientList').querySelectorAll('.recipient-item');

    // Reset display
    recipientItems.forEach(item => {
      item.style.display = '';
    });

    // Apply specific filter
    switch (selectedFilter) {
      case 'all':
        // Show all users
        break;

      case 'downline':
        // For demo, we'll use user ID 1 as current user
        const currentUserId = 1;
        // In this simple example, users 2 and 3 report to user 1
        const downlineUserIds = [2, 3];

        recipientItems.forEach(item => {
          const userId = parseInt(item.dataset.userId);
          if (!downlineUserIds.includes(userId) && userId !== currentUserId) {
            item.style.display = 'none';
          }
        });
        break;

      case 'company':
        const companySelect = document.getElementById('editRecipientsModal').querySelector('#companySelect');
        if (companySelect) {
          const selectedCompany = companySelect.value;
          if (selectedCompany) {
            recipientItems.forEach(item => {
              const company = item.querySelector('.recipient-company').textContent;
              if (company !== selectedCompany) {
                item.style.display = 'none';
              }
            });
          }
        }
        break;

      case 'team':
        const teamSelect = document.getElementById('editRecipientsModal').querySelector('#teamSelect');
        if (teamSelect) {
          const selectedTeam = teamSelect.value;
          if (selectedTeam) {
            recipientItems.forEach(item => {
              const team = item.querySelector('.recipient-team').textContent;
              if (team !== selectedTeam) {
                item.style.display = 'none';
              }
            });
          }
        }
        break;

      case 'role':
        const roleSelect = document.getElementById('editRecipientsModal').querySelector('#roleSelect');
        if (roleSelect) {
          const selectedRole = roleSelect.value;
          if (selectedRole) {
            recipientItems.forEach(item => {
              const role = item.querySelector('.recipient-role').textContent;
              if (role !== selectedRole) {
                item.style.display = 'none';
              }
            });
          }
        }
        break;

      case 'individual':
        const individualSearch = document.getElementById('editRecipientsModal').querySelector('#individualSearch');
        if (individualSearch) {
          const searchTerm = individualSearch.value.toLowerCase();
          if (searchTerm) {
            recipientItems.forEach(item => {
              const name = item.querySelector('.recipient-name').textContent.toLowerCase();
              if (!name.includes(searchTerm)) {
                item.style.display = 'none';
              }
            });
          }
        }
        break;
    }
  }

  // Update language grouping based on selected recipients
  function updateLanguageGrouping() {
    const languageGroupingContainer = document.getElementById('languageGrouping');
    if (!languageGroupingContainer) return;

    if (window.selectedRecipients.length === 0) {
      // Show empty state
      languageGroupingContainer.innerHTML = `
        <div class="language-grouping-empty">
          <p>Select recipients to see language grouping</p>
        </div>
      `;
      return;
    }

    // Group recipients by language
    const groupedRecipients = {};
    window.selectedRecipients.forEach(recipient => {
      if (!groupedRecipients[recipient.language]) {
        groupedRecipients[recipient.language] = [];
      }
      groupedRecipients[recipient.language].push(recipient);
    });

    // Create language groups HTML
    let groupsHTML = '';
    Object.keys(groupedRecipients).forEach(language => {
      const recipients = groupedRecipients[language];
      const recipientCount = recipients.length;

      groupsHTML += `
        <div class="language-group">
          <div class="language-group-header">
            <h4>${language}</h4>
            <span class="recipient-count">${recipientCount} recipient${recipientCount !== 1 ? 's' : ''}</span>
          </div>
          <div class="language-group-recipients">
            ${recipients.map(recipient => `
              <div class="language-group-recipient">
                <span class="recipient-name">${recipient.name}</span>
                <span class="recipient-role">${recipient.role}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    });

    // Update container
    languageGroupingContainer.innerHTML = `
      <div class="language-grouping-header">
        <h3>Recipients by Language</h3>
        <div class="language-grouping-summary">
          <span class="total-recipients">${window.selectedRecipients.length} total recipients</span>
          <span class="language-count">${Object.keys(groupedRecipients).length} languages</span>
        </div>
      </div>
      <div class="language-groups">
        ${groupsHTML}
      </div>
    `;
  }

  // Initialize save recipients button
  document.addEventListener('DOMContentLoaded', function() {
    const saveRecipientsBtn = document.getElementById('saveRecipientsBtn');
    const closeEditRecipientsBtn = document.getElementById('closeEditRecipientsBtn');
    const addMoreRecipientsBtn = document.getElementById('addMoreRecipientsBtn');
    const closeAddRecipientsBtn = document.getElementById('closeAddRecipientsBtn');
    const addRecipientsSection = document.getElementById('addRecipientsSection');
    const editRecipientsModal = document.getElementById('editRecipientsModal');

    // Initialize recipient checkboxes in the main form
    const recipientCheckboxes = document.querySelectorAll('#recipientList input[type="checkbox"]');
    recipientCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        const recipientItem = this.closest('.recipient-item');
        const userId = parseInt(recipientItem.dataset.userId);
        const userName = recipientItem.querySelector('.recipient-name').textContent;
        const userLanguage = recipientItem.dataset.language;
        const userRole = recipientItem.querySelector('.recipient-role').textContent;

        if (this.checked) {
          // Add to selected recipients
          if (!window.selectedRecipients.some(r => r.id === userId)) {
            window.selectedRecipients.push({
              id: userId,
              name: userName,
              language: userLanguage,
              role: userRole
            });
          }
        } else {
          // Remove from selected recipients
          window.selectedRecipients = window.selectedRecipients.filter(r => r.id !== userId);
        }

        // Update language grouping
        updateLanguageGrouping();
      });
    });

    // Define global functions for select all and deselect all
    window.selectAllVisibleRecipients = function() {
      const visibleCheckboxes = document.querySelectorAll('#recipientList .recipient-item:not([style*="display: none"]) input[type="checkbox"]');
      visibleCheckboxes.forEach(checkbox => {
        if (!checkbox.checked) {
          checkbox.checked = true;
          checkbox.dispatchEvent(new Event('change'));
        }
      });
    };

    window.deselectAllRecipients = function() {
      const checkedBoxes = document.querySelectorAll('#recipientList input[type="checkbox"]:checked');
      checkedBoxes.forEach(checkbox => {
        checkbox.checked = false;
        checkbox.dispatchEvent(new Event('change'));
      });
    };

    // Save recipients changes
    if (saveRecipientsBtn) {
      saveRecipientsBtn.addEventListener('click', function() {
        // Update main selected recipients list
        window.selectedRecipients = [...window.tempSelectedRecipients];

        // Update checkboxes in main recipient list
        const mainCheckboxes = document.querySelectorAll('#recipientList input[type="checkbox"]');
        mainCheckboxes.forEach(checkbox => {
          const userId = parseInt(checkbox.dataset.userId);
          checkbox.checked = window.selectedRecipients.some(recipient => recipient.id === userId);
        });

        // Update language grouping
        updateLanguageGrouping();

        // Close modal
        editRecipientsModal.classList.remove('active');
      });
    }

    // Close edit recipients modal
    if (closeEditRecipientsBtn) {
      closeEditRecipientsBtn.addEventListener('click', function() {
        editRecipientsModal.classList.remove('active');
        // Discard changes by not updating selectedRecipients
      });
    }

    // Toggle add recipients section
    if (addMoreRecipientsBtn) {
      addMoreRecipientsBtn.addEventListener('click', function() {
        addRecipientsSection.classList.toggle('hidden');
        this.style.display = addRecipientsSection.classList.contains('hidden') ? 'block' : 'none';
      });
    }

    // Close add recipients section
    if (closeAddRecipientsBtn) {
      closeAddRecipientsBtn.addEventListener('click', function() {
        addRecipientsSection.classList.add('hidden');
        addMoreRecipientsBtn.style.display = 'block';
      });
    }
  });

  // Change device type
  if (previewDeviceSelect) {
    previewDeviceSelect.addEventListener('change', function() {
      const deviceType = this.value;

      // Remove all device classes
      previewDeviceFrame.classList.remove('mobile', 'desktop');

      // Add selected device class
      previewDeviceFrame.classList.add(deviceType);

      // Update preview
      updatePreview();
    });
  }

  // Change language
  if (previewLanguageSelect) {
    previewLanguageSelect.addEventListener('change', updatePreview);
  }

  // Change recipient type
  if (previewRecipientTypeSelect) {
    previewRecipientTypeSelect.addEventListener('change', updatePreview);
  }

  // Update preview
  function updatePreview() {
    if (!previewNotification) return;

    // Get form values
    const title = document.getElementById('notificationTitle').value || 'Notification Title';
    const content = document.getElementById('notificationContent').value || 'Notification content goes here...';
    const type = document.getElementById('notificationType').value || 'Info';
    const language = previewLanguageSelect.value || '';
    const recipientType = previewRecipientTypeSelect.value || 'employee';

    // Get current date and time
    const now = new Date();
    const formattedDate = now.toLocaleDateString();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Get response time information
    let responseTimeText = '';
    const selectedResponseOption = document.querySelector('input[name="responseTimeOption"]:checked').value;

    switch (selectedResponseOption) {
      case 'default':
        responseTimeText = '<div class="preview-notification-response-time">Response required within 24 hours</div>';
        break;

      case 'custom':
        const days = parseInt(document.getElementById('responseDays').value) || 0;
        const hours = parseInt(document.getElementById('responseHours').value) || 0;
        const minutes = parseInt(document.getElementById('responseMinutes').value) || 0;

        // Format the time string
        let timeString = '';

        if (days > 0) {
          timeString += `${days} day${days !== 1 ? 's' : ''}`;
        }

        if (hours > 0) {
          if (timeString) timeString += ', ';
          timeString += `${hours} hour${hours !== 1 ? 's' : ''}`;
        }

        if (minutes > 0) {
          if (timeString) timeString += ', ';
          timeString += `${minutes} minute${minutes !== 1 ? 's' : ''}`;
        }

        if (!timeString) {
          timeString = 'immediately';
        }

        responseTimeText = `<div class="preview-notification-response-time">Response required within ${timeString}</div>`;
        break;

      case 'none':
        responseTimeText = '<div class="preview-notification-response-time">No response required</div>';
        break;
    }

    // Create notification HTML
    const notificationHTML = `
      <h3 class="preview-notification-title">${title}</h3>
      <div class="preview-notification-meta">
        <span>${formattedDate}</span>
        <span>${formattedTime}</span>
      </div>
      <div class="preview-notification-content">${content}</div>
      ${responseTimeText}
      <div class="preview-notification-footer">
        <div>
          <span class="preview-notification-tag">${type}</span>
          ${language ? `<span class="preview-notification-tag">${language}</span>` : ''}
        </div>
        <span>For: ${recipientType}</span>
      </div>
    `;

    // Update preview
    previewNotification.innerHTML = notificationHTML;
  }
});
