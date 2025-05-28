// Translation Request Functionality
document.addEventListener('DOMContentLoaded', function() {
  const requestTranslationBtn = document.getElementById('requestTranslationBtn');
  const approveTranslationBtn = document.getElementById('approveTranslationBtn');
  const translationStatusList = document.getElementById('translationStatusList');

  // Tab functionality
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  // Add click event to tab buttons
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      tabButtons.forEach(btn => btn.classList.remove('active'));

      // Add active class to clicked button
      this.classList.add('active');

      // Hide all tab contents
      tabContents.forEach(content => content.classList.add('hidden'));

      // Show the selected tab content
      const tabId = this.getAttribute('data-tab');
      document.getElementById(`${tabId}-tab`).classList.remove('hidden');
    });
  });

  // Store translations
  window.translations = [];

  // Request translation button click handler
  if (requestTranslationBtn) {
    requestTranslationBtn.addEventListener('click', function() {
      // Get selected recipients languages
      const languages = getSelectedLanguages();

      if (languages.length === 0) {
        alert('Please select recipients first to determine languages for translation.');
        return;
      }

      // Check if we already have translations requested for these languages
      const existingLanguages = window.translations.map(t => t.language);
      const newLanguages = languages.filter(lang => !existingLanguages.includes(lang));

      if (newLanguages.length === 0) {
        alert('Translations have already been requested for all selected languages.');
        return;
      }

      // Create new translation requests
      const now = new Date();
      const dueDate = new Date(now);
      dueDate.setDate(dueDate.getDate() + 3); // Default due date is 3 days from now

      newLanguages.forEach(language => {
        window.translations.push({
          id: Date.now() + Math.floor(Math.random() * 1000), // Generate unique ID
          language: language,
          status: 'pending',
          translator: 'Unassigned',
          dueDate: dueDate,
          requestDate: now
        });
      });

      // Update translation status list
      updateTranslationStatusList();

      // Show confirmation
      alert(`Translation requested for ${newLanguages.length} language(s): ${newLanguages.join(', ')}`);
    });
  }

  // Approve translations button click handler
  if (approveTranslationBtn) {
    approveTranslationBtn.addEventListener('click', function() {
      const completedTranslations = window.translations.filter(t => t.status === 'completed');

      if (completedTranslations.length === 0) {
        alert('There are no completed translations to approve.');
        return;
      }

      // In a real implementation, this would trigger a workflow to approve the translations
      // For demo purposes, we'll just mark them as approved
      completedTranslations.forEach(translation => {
        translation.status = 'approved';
      });

      // Update translation status list
      updateTranslationStatusList();

      // Disable approve button
      approveTranslationBtn.disabled = true;

      // Show confirmation
      alert(`${completedTranslations.length} translation(s) approved successfully.`);
    });
  }

  // Function to get selected languages from recipients
  function getSelectedLanguages() {
    // Get unique languages from selected recipients
    const languages = [];

    if (window.selectedRecipients && window.selectedRecipients.length > 0) {
      window.selectedRecipients.forEach(recipient => {
        if (recipient.language && !languages.includes(recipient.language)) {
          languages.push(recipient.language);
        }
      });
    }

    // Remove English as it's the default language
    return languages.filter(lang => lang !== 'English');
  }

  // Function to update translation status list
  function updateTranslationStatusList() {
    if (!translationStatusList) return;

    if (window.translations.length === 0) {
      translationStatusList.innerHTML = `
        <tr class="translation-empty-row">
          <td colspan="5">
            <div class="translation-status-empty">
              <p>No translations requested yet</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    let statusHTML = '';
    window.translations.forEach(translation => {
      const formattedDueDate = translation.dueDate.toLocaleDateString();

      // Determine status badge class
      let statusBadgeClass = '';
      switch (translation.status) {
        case 'pending':
          statusBadgeClass = 'status-pending';
          break;
        case 'in-progress':
          statusBadgeClass = 'status-in-progress';
          break;
        case 'completed':
          statusBadgeClass = 'status-completed';
          break;
        case 'approved':
          statusBadgeClass = 'status-completed';
          break;
        case 'rejected':
          statusBadgeClass = 'status-rejected';
          break;
      }

      // Create status item HTML as table row
      statusHTML += `
        <tr class="translation-status-item" data-translation-id="${translation.id}">
          <td class="translation-language">${translation.language}</td>
          <td class="translation-status">
            <span class="status-badge ${statusBadgeClass}">${translation.status}</span>
          </td>
          <td class="translation-translator">${translation.translator}</td>
          <td class="translation-due-date">${formattedDueDate}</td>
          <td class="translation-actions-cell">
            ${translation.status === 'pending' ?
              `<button class="translation-action-btn" onclick="cancelTranslation(${translation.id})" title="Cancel">
                <span class="material-icons">close</span>
              </button>` : ''}
            ${translation.status === 'completed' ?
              `<button class="translation-action-btn" onclick="viewTranslation(${translation.id})" title="View">
                <span class="material-icons">visibility</span>
              </button>` : ''}
          </td>
        </tr>
      `;
    });

    // Update list
    translationStatusList.innerHTML = statusHTML;

    // Check if we have completed translations to enable approve button
    const hasCompletedTranslations = window.translations.some(t => t.status === 'completed');
    if (approveTranslationBtn) {
      approveTranslationBtn.disabled = !hasCompletedTranslations;
    }
  }

  // Add global functions for translation actions
  window.cancelTranslation = function(translationId) {
    // Find the translation
    const index = window.translations.findIndex(t => t.id === translationId);
    if (index !== -1) {
      // Remove the translation
      window.translations.splice(index, 1);
      // Update the list
      updateTranslationStatusList();
    }
  };

  window.viewTranslation = function(translationId) {
    // Find the translation
    const translation = window.translations.find(t => t.id === translationId);
    if (translation) {
      // In a real implementation, this would open a modal to view the translation
      alert(`Viewing translation for ${translation.language}`);
    }
  };

  // Helper function to get a random translator name
  function getRandomTranslator() {
    const translators = [
      'Maria Rodriguez',
      'Jean Dupont',
      'Li Wei',
      'Ahmed Hassan',
      'Hans Müller',
      'Sofia Rossi'
    ];
    return translators[Math.floor(Math.random() * translators.length)];
  }
});
