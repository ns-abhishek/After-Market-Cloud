// Send/Schedule Functionality
document.addEventListener('DOMContentLoaded', function() {
  const sendImmediatelyRadio = document.getElementById('sendImmediately');
  const scheduleForLaterRadio = document.getElementById('scheduleForLater');
  const scheduleDateTimeContainer = document.getElementById('scheduleDateTimeContainer');
  const scheduleDate = document.getElementById('scheduleDate');
  const scheduleTime = document.getElementById('scheduleTime');
  const scheduleTimezone = document.getElementById('scheduleTimezone');
  const sendBtn = document.getElementById('sendBtn');

  // Set default date and time (tomorrow at current time)
  if (scheduleDate && scheduleTime) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Format date as YYYY-MM-DD
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    scheduleDate.value = `${year}-${month}-${day}`;

    // Format time as HH:MM
    const hours = String(tomorrow.getHours()).padStart(2, '0');
    const minutes = String(tomorrow.getMinutes()).padStart(2, '0');
    scheduleTime.value = `${hours}:${minutes}`;
  }

  // Toggle schedule date/time container visibility
  if (sendImmediatelyRadio && scheduleForLaterRadio && scheduleDateTimeContainer) {
    sendImmediatelyRadio.addEventListener('change', function() {
      if (this.checked) {
        scheduleDateTimeContainer.classList.add('hidden');
        if (sendBtn) {
          sendBtn.textContent = 'Send Notification';
          sendBtn.innerHTML = '<span class="material-icons">send</span> Send Notification';
        }
      }
    });

    scheduleForLaterRadio.addEventListener('change', function() {
      if (this.checked) {
        scheduleDateTimeContainer.classList.remove('hidden');
        if (sendBtn) {
          sendBtn.textContent = 'Schedule Notification';
          sendBtn.innerHTML = '<span class="material-icons">schedule</span> Schedule Notification';
        }
      }
    });
  }

  // Send button click handler
  if (sendBtn) {
    sendBtn.addEventListener('click', function() {
      // Get selected send option
      const sendOption = document.querySelector('input[name="sendOption"]:checked').value;

      if (sendOption === 'immediate') {
        // Send immediately
        sendNotification();
      } else if (sendOption === 'scheduled') {
        // Schedule for later
        scheduleNotification();
      }
    });
  }

  // Function to send notification immediately
  function sendNotification() {
    // Validate form
    if (!validateForm()) {
      return;
    }

    // Get notification data
    const notificationData = getNotificationData();

    // Add sent date and status
    notificationData.sentDate = new Date().toISOString();
    notificationData.status = 'sent';
    notificationData.editable = false; // Explicitly mark as not editable

    // Generate a unique ID for the notification
    const notificationId = 'sent_notification_' + Date.now();

    // Store notification data in localStorage
    localStorage.setItem(notificationId, JSON.stringify(notificationData));

    // In a real implementation, this would send the notification to the server
    // For demo purposes, we'll just show a success message
    alert('Notification sent successfully!');

    // Reset form and update the sent notifications section
    resetForm();

    // Hide the compose form and show the notifications view
    const composeForm = document.getElementById('composeForm');
    const notificationsView = document.getElementById('notificationsView');

    if (composeForm && notificationsView) {
      composeForm.classList.add('hidden');
      notificationsView.classList.remove('hidden');
    }

    // Update the sent list if the sent container exists
    if (typeof updateSentList === 'function') {
      updateSentList();
    }

    // Don't automatically show sent notifications - user needs to click the Sent filter
    // Reset to the "All" filter
    const allFilterButton = document.querySelector('.filter-button[data-filter="all"]');
    if (allFilterButton) {
      allFilterButton.click();
    }
  }

  // Function to schedule notification for later
  function scheduleNotification() {
    // Validate form
    if (!validateForm()) {
      return;
    }

    // Validate schedule date and time
    if (!scheduleDate.value) {
      alert('Please select a date for the scheduled notification.');
      scheduleDate.focus();
      return;
    }

    if (!scheduleTime.value) {
      alert('Please select a time for the scheduled notification.');
      scheduleTime.focus();
      return;
    }

    // Check if the scheduled date/time is in the future
    const scheduledDateTime = new Date(`${scheduleDate.value}T${scheduleTime.value}`);
    const now = new Date();

    if (scheduledDateTime <= now) {
      alert('Please select a future date and time for the scheduled notification.');
      return;
    }

    // Get notification data
    const notificationData = getNotificationData();

    // Add scheduled date and status
    notificationData.scheduledDate = scheduledDateTime.toISOString();
    notificationData.timezone = scheduleTimezone.options[scheduleTimezone.selectedIndex].text;
    notificationData.status = 'scheduled';
    notificationData.editable = true; // Scheduled notifications can be edited

    // Generate a unique ID for the notification
    const notificationId = 'scheduled_notification_' + Date.now();

    // Store notification data in localStorage for the scheduled folder to display
    localStorage.setItem(notificationId, JSON.stringify(notificationData));

    // Format the scheduled date and time for display
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    const formattedDateTime = scheduledDateTime.toLocaleDateString(undefined, options);
    const timezone = scheduleTimezone.options[scheduleTimezone.selectedIndex].text;

    // In a real implementation, this would schedule the notification on the server
    // For demo purposes, we'll just show a success message
    alert(`Notification scheduled for ${formattedDateTime} (${timezone}).`);

    // Reset form and update the scheduled notifications section
    resetForm();

    // Hide the compose form and show the notifications view
    const composeForm = document.getElementById('composeForm');
    const notificationsView = document.getElementById('notificationsView');

    if (composeForm && notificationsView) {
      composeForm.classList.add('hidden');
      notificationsView.classList.remove('hidden');
    }

    // Update the scheduled list if the scheduled container exists
    if (typeof updateScheduledList === 'function') {
      updateScheduledList();
    }

    // Don't automatically show scheduled notifications - user needs to click the Scheduled filter
    // Reset to the "All" filter
    const allFilterButton = document.querySelector('.filter-button[data-filter="all"]');
    if (allFilterButton) {
      allFilterButton.click();
    }
  }

  // Function to get notification data
  function getNotificationData() {
    // Get notification type
    const notificationType = document.getElementById('notificationType').value || 'info';

    // Get notification title
    const notificationTitle = document.getElementById('notificationTitle').value || 'Sample Notification';

    // Get notification content
    const notificationContent = document.getElementById('notificationContent').value || 'This is a sample notification content.';

    // Get Quill editor content for rich text if available
    let richContent = notificationContent;
    try {
      const editorElement = document.getElementById('editor');
      if (editorElement && typeof Quill !== 'undefined') {
        const quill = Quill.find(editorElement);
        if (quill) {
          richContent = quill.root.innerHTML;
        }
      }
    } catch (error) {
      console.error('Error getting rich content:', error);
    }

    // Ensure we have recipients
    if (!window.selectedRecipients || window.selectedRecipients.length === 0) {
      // Create default recipients if none exist
      window.selectedRecipients = [
        {
          id: 1,
          name: "Rajesh Sharma",
          email: "rajesh.sharma@example.com",
          role: "Manager",
          company: "Acme Inc.",
          team: "Sales",
          language: "English"
        },
        {
          id: 3,
          name: "Arjun Singh",
          email: "arjun.singh@example.com",
          role: "Technician",
          company: "Acme Inc.",
          team: "Field Service",
          language: "Punjabi"
        }
      ];
      console.log('Created default recipients for notification data');
    }

    // Get recipient count
    const recipientCount = window.selectedRecipients.length;

    // Get languages from recipients
    const languages = [];
    window.selectedRecipients.forEach(recipient => {
      if (recipient.language && !languages.includes(recipient.language)) {
        languages.push(recipient.language);
      }
    });

    // Return notification data object
    return {
      title: notificationTitle,
      content: richContent,
      plainContent: notificationContent,
      type: notificationType,
      recipientCount: recipientCount,
      languages: languages,
      recipients: window.selectedRecipients.map(r => r.id)
    };
  }

  // Function to reset the form
  function resetForm() {
    // Reset notification type
    const notificationType = document.getElementById('notificationType');
    if (notificationType) {
      notificationType.value = '';
    }

    // Reset notification title
    const notificationTitle = document.getElementById('notificationTitle');
    if (notificationTitle) {
      notificationTitle.value = '';
    }

    // Reset notification content
    const notificationContent = document.getElementById('notificationContent');
    if (notificationContent) {
      notificationContent.value = '';
    }

    // Reset Quill editor if available
    try {
      const editorElement = document.getElementById('editor');
      if (editorElement && typeof Quill !== 'undefined') {
        const quill = Quill.find(editorElement);
        if (quill) {
          quill.setText('');
        }
      }
    } catch (error) {
      console.error('Error resetting Quill editor:', error);
    }

    // Reset selected recipients
    if (typeof deselectAllRecipients === 'function') {
      deselectAllRecipients();
    } else {
      window.selectedRecipients = [];
    }

    // Reset send option to immediate
    const sendImmediatelyRadio = document.getElementById('sendImmediately');
    if (sendImmediatelyRadio) {
      sendImmediatelyRadio.checked = true;

      // Trigger change event to hide schedule options
      const changeEvent = new Event('change');
      sendImmediatelyRadio.dispatchEvent(changeEvent);
    }

    console.log('Form reset successfully');
  }

  // Function to validate the form
  function validateForm() {
    // For demonstration purposes, we'll automatically select recipients if none are selected
    if (!window.selectedRecipients || window.selectedRecipients.length === 0) {
      console.log('No recipients selected, automatically selecting sample recipients');

      // Create a sample recipient if none exists
      window.selectedRecipients = [
        {
          id: 1,
          name: "Rajesh Sharma",
          email: "rajesh.sharma@example.com",
          role: "Manager",
          company: "Acme Inc.",
          team: "Sales",
          language: "English"
        },
        {
          id: 3,
          name: "Arjun Singh",
          email: "arjun.singh@example.com",
          role: "Technician",
          company: "Acme Inc.",
          team: "Field Service",
          language: "Punjabi"
        }
      ];

      console.log('Auto-selected recipients:', window.selectedRecipients);
    }

    // Check if notification type is selected
    const notificationType = document.getElementById('notificationType');
    if (!notificationType || !notificationType.value) {
      // Auto-select a notification type
      if (notificationType) {
        notificationType.value = 'info';
      }
    }

    // Check if notification title is entered
    const notificationTitle = document.getElementById('notificationTitle');
    if (!notificationTitle || !notificationTitle.value.trim()) {
      // Auto-fill a title
      if (notificationTitle) {
        notificationTitle.value = 'Sample Notification';
      }
    }

    // Check if notification content is entered
    const notificationContent = document.getElementById('notificationContent');
    if (!notificationContent || !notificationContent.value.trim()) {
      // Auto-fill content
      if (notificationContent) {
        notificationContent.value = 'This is a sample notification content.';
      }
    }

    // Always return true for demonstration purposes
    return true;
  }
});
