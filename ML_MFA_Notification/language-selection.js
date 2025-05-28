// Language Selection Module
// This file contains the functionality for selecting languages for notification composition
// and splitting recipients based on language

// Available languages (same as in recipient-selection.js for consistency)
const availableLanguages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" }
];

// Store selected languages and their content
let selectedLanguages = [];
let languageContent = {};

// Initialize language selection UI
function initLanguageSelection() {
  // Create language selection UI
  createLanguageSelectionUI();
  
  // Initialize with English as default
  if (selectedLanguages.length === 0) {
    selectLanguage("en");
  }
  
  // Initialize tabs
  updateLanguageTabs();
}

// Create language selection UI
function createLanguageSelectionUI() {
  const languageSelectionContainer = document.getElementById('languageSelection');
  if (!languageSelectionContainer) return;
  
  // Create language selection dropdown
  let languageOptionsHTML = '';
  availableLanguages.forEach(language => {
    languageOptionsHTML += `
      <div class="language-option" data-language-code="${language.code}">
        <span class="language-flag">${language.flag}</span>
        <span class="language-name">${language.name}</span>
      </div>
    `;
  });
  
  // Create language selection UI
  languageSelectionContainer.innerHTML = `
    <div class="language-selection-header">
      <h3>Message Languages</h3>
      <div class="language-selection-dropdown">
        <button class="language-dropdown-toggle">
          <span class="material-icons">add</span>
          Add Language
        </button>
        <div class="language-dropdown-menu hidden">
          ${languageOptionsHTML}
        </div>
      </div>
    </div>
    <div class="selected-languages" id="selectedLanguages">
      <p class="no-languages-message">No languages selected. Select at least one language.</p>
    </div>
    <div class="language-tabs" id="languageTabs">
      <!-- Language tabs will be populated by JavaScript -->
    </div>
    <div class="language-content" id="languageContent">
      <!-- Language content areas will be populated by JavaScript -->
    </div>
  `;
  
  // Add event listeners
  const dropdownToggle = languageSelectionContainer.querySelector('.language-dropdown-toggle');
  const dropdownMenu = languageSelectionContainer.querySelector('.language-dropdown-menu');
  
  // Toggle dropdown
  dropdownToggle.addEventListener('click', function() {
    dropdownMenu.classList.toggle('hidden');
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', function(event) {
    if (!event.target.closest('.language-selection-dropdown')) {
      dropdownMenu.classList.add('hidden');
    }
  });
  
  // Add event listeners to language options
  const languageOptions = languageSelectionContainer.querySelectorAll('.language-option');
  languageOptions.forEach(option => {
    option.addEventListener('click', function() {
      const languageCode = this.dataset.languageCode;
      selectLanguage(languageCode);
      dropdownMenu.classList.add('hidden');
    });
  });
}

// Select a language
function selectLanguage(languageCode) {
  // Check if language is already selected
  if (selectedLanguages.includes(languageCode)) {
    return;
  }
  
  // Add to selected languages
  selectedLanguages.push(languageCode);
  
  // Initialize content for this language
  languageContent[languageCode] = {
    title: '',
    content: ''
  };
  
  // Update UI
  updateSelectedLanguagesUI();
  updateLanguageTabs();
  
  // Switch to the newly added language tab
  switchLanguageTab(languageCode);
  
  // Update recipient grouping by language
  updateRecipientsByLanguage();
}

// Remove a language
function removeLanguage(languageCode) {
  // Check if it's the last language
  if (selectedLanguages.length === 1) {
    alert("You must have at least one language selected.");
    return;
  }
  
  // Remove from selected languages
  const index = selectedLanguages.indexOf(languageCode);
  if (index !== -1) {
    selectedLanguages.splice(index, 1);
  }
  
  // Remove content for this language
  delete languageContent[languageCode];
  
  // Update UI
  updateSelectedLanguagesUI();
  updateLanguageTabs();
  
  // Switch to the first available language tab
  if (selectedLanguages.length > 0) {
    switchLanguageTab(selectedLanguages[0]);
  }
  
  // Update recipient grouping by language
  updateRecipientsByLanguage();
}

// Update selected languages UI
function updateSelectedLanguagesUI() {
  const selectedLanguagesContainer = document.getElementById('selectedLanguages');
  if (!selectedLanguagesContainer) return;
  
  if (selectedLanguages.length === 0) {
    selectedLanguagesContainer.innerHTML = `
      <p class="no-languages-message">No languages selected. Select at least one language.</p>
    `;
    return;
  }
  
  let selectedLanguagesHTML = '';
  selectedLanguages.forEach(languageCode => {
    const language = availableLanguages.find(lang => lang.code === languageCode);
    if (language) {
      selectedLanguagesHTML += `
        <div class="selected-language">
          <span class="language-flag">${language.flag}</span>
          <span class="language-name">${language.name}</span>
          <button class="remove-language" data-language-code="${languageCode}">
            <span class="material-icons">close</span>
          </button>
        </div>
      `;
    }
  });
  
  selectedLanguagesContainer.innerHTML = selectedLanguagesHTML;
  
  // Add event listeners to remove buttons
  const removeButtons = selectedLanguagesContainer.querySelectorAll('.remove-language');
  removeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const languageCode = this.dataset.languageCode;
      removeLanguage(languageCode);
    });
  });
}

// Update language tabs
function updateLanguageTabs() {
  const languageTabsContainer = document.getElementById('languageTabs');
  const languageContentContainer = document.getElementById('languageContent');
  if (!languageTabsContainer || !languageContentContainer) return;
  
  // Create tabs
  let tabsHTML = '';
  selectedLanguages.forEach(languageCode => {
    const language = availableLanguages.find(lang => lang.code === languageCode);
    if (language) {
      tabsHTML += `
        <div class="language-tab" data-language-code="${languageCode}">
          <span class="language-flag">${language.flag}</span>
          <span class="language-name">${language.name}</span>
        </div>
      `;
    }
  });
  
  languageTabsContainer.innerHTML = tabsHTML;
  
  // Create content areas
  let contentHTML = '';
  selectedLanguages.forEach(languageCode => {
    const language = availableLanguages.find(lang => lang.code === languageCode);
    if (language) {
      const content = languageContent[languageCode] || { title: '', content: '' };
      
      contentHTML += `
        <div class="language-content-area" data-language-code="${languageCode}">
          <div class="form-group">
            <label class="form-label" for="notificationTitle_${languageCode}">Notification Title (${language.name})</label>
            <input type="text" id="notificationTitle_${languageCode}" class="form-input" 
                  placeholder="Enter notification title in ${language.name}" 
                  value="${content.title}">
          </div>
          <div class="form-group">
            <label class="form-label" for="notificationContent_${languageCode}">Notification Content (${language.name})</label>
            <textarea id="notificationContent_${languageCode}" class="form-input" rows="5" 
                     placeholder="Enter notification content in ${language.name}">${content.content}</textarea>
          </div>
        </div>
      `;
    }
  });
  
  languageContentContainer.innerHTML = contentHTML;
  
  // Add event listeners to tabs
  const tabs = languageTabsContainer.querySelectorAll('.language-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const languageCode = this.dataset.languageCode;
      switchLanguageTab(languageCode);
    });
  });
  
  // Add event listeners to inputs to save content
  selectedLanguages.forEach(languageCode => {
    const titleInput = document.getElementById(`notificationTitle_${languageCode}`);
    const contentTextarea = document.getElementById(`notificationContent_${languageCode}`);
    
    if (titleInput) {
      titleInput.addEventListener('input', function() {
        saveLanguageContent(languageCode);
      });
    }
    
    if (contentTextarea) {
      contentTextarea.addEventListener('input', function() {
        saveLanguageContent(languageCode);
      });
    }
  });
}

// Switch to a specific language tab
function switchLanguageTab(languageCode) {
  // Hide all content areas
  const contentAreas = document.querySelectorAll('.language-content-area');
  contentAreas.forEach(area => {
    area.classList.add('hidden');
  });
  
  // Remove active class from all tabs
  const tabs = document.querySelectorAll('.language-tab');
  tabs.forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Show selected content area
  const selectedContentArea = document.querySelector(`.language-content-area[data-language-code="${languageCode}"]`);
  if (selectedContentArea) {
    selectedContentArea.classList.remove('hidden');
  }
  
  // Add active class to selected tab
  const selectedTab = document.querySelector(`.language-tab[data-language-code="${languageCode}"]`);
  if (selectedTab) {
    selectedTab.classList.add('active');
  }
}

// Save content for a specific language
function saveLanguageContent(languageCode) {
  const titleInput = document.getElementById(`notificationTitle_${languageCode}`);
  const contentTextarea = document.getElementById(`notificationContent_${languageCode}`);
  
  if (titleInput && contentTextarea) {
    languageContent[languageCode] = {
      title: titleInput.value,
      content: contentTextarea.value
    };
  }
}

// Update recipients by language
function updateRecipientsByLanguage() {
  // Get all selected recipients
  const selectedRecipients = getSelectedRecipients();
  if (!selectedRecipients || selectedRecipients.length === 0) return;
  
  // Get language grouping container
  const languageGroupingContainer = document.getElementById('languageGrouping');
  if (!languageGroupingContainer) return;
  
  // Group recipients by language
  const recipientsByLanguage = {};
  
  // First, initialize with selected languages
  selectedLanguages.forEach(langCode => {
    recipientsByLanguage[langCode] = [];
  });
  
  // Then add recipients to their language groups
  selectedRecipients.forEach(recipient => {
    const recipientLang = recipient.language.toLowerCase();
    
    // Find matching language code
    let matchedLangCode = null;
    for (const langCode of selectedLanguages) {
      const language = availableLanguages.find(lang => lang.code === langCode);
      if (language && recipientLang.includes(language.name.toLowerCase())) {
        matchedLangCode = langCode;
        break;
      }
    }
    
    // If no match found, add to first language (default)
    if (!matchedLangCode && selectedLanguages.length > 0) {
      matchedLangCode = selectedLanguages[0];
    }
    
    // Add recipient to matched language group
    if (matchedLangCode) {
      if (!recipientsByLanguage[matchedLangCode]) {
        recipientsByLanguage[matchedLangCode] = [];
      }
      recipientsByLanguage[matchedLangCode].push(recipient);
    }
  });
  
  // Create language groups HTML
  let groupsHTML = '';
  Object.keys(recipientsByLanguage).forEach(langCode => {
    const language = availableLanguages.find(lang => lang.code === langCode);
    const recipients = recipientsByLanguage[langCode];
    const recipientCount = recipients.length;
    
    if (language) {
      groupsHTML += `
        <div class="language-group">
          <div class="language-group-header">
            <h4>${language.flag} ${language.name}</h4>
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
    }
  });
  
  // Update container
  languageGroupingContainer.innerHTML = `
    <div class="language-grouping-header">
      <h3>Recipients by Language</h3>
      <div class="language-grouping-summary">
        <span class="total-recipients">${selectedRecipients.length} total recipients</span>
        <span class="language-count">${Object.keys(recipientsByLanguage).length} languages</span>
      </div>
    </div>
    <div class="language-groups">
      ${groupsHTML}
    </div>
  `;
}

// Get all selected recipients
function getSelectedRecipients() {
  // This function should be implemented to work with your recipient selection system
  // For now, we'll return an empty array and expect it to be populated by the recipient selection module
  if (typeof window.getSelectedRecipientsArray === 'function') {
    return window.getSelectedRecipientsArray();
  }
  return [];
}

// Get all language content
function getAllLanguageContent() {
  // Make sure content is up to date
  selectedLanguages.forEach(languageCode => {
    saveLanguageContent(languageCode);
  });
  
  return {
    languages: selectedLanguages,
    content: languageContent
  };
}

// Check if all languages have content
function validateLanguageContent() {
  let isValid = true;
  let missingFields = [];
  
  selectedLanguages.forEach(languageCode => {
    const language = availableLanguages.find(lang => lang.code === languageCode);
    const content = languageContent[languageCode];
    
    if (!content || !content.title || !content.content) {
      isValid = false;
      missingFields.push(language ? language.name : languageCode);
    }
  });
  
  return {
    isValid,
    missingFields
  };
}

// Get recipients grouped by language
function getRecipientsByLanguage() {
  // Get all selected recipients
  const selectedRecipients = getSelectedRecipients();
  if (!selectedRecipients || selectedRecipients.length === 0) {
    return {};
  }
  
  // Group recipients by language
  const recipientsByLanguage = {};
  
  // First, initialize with selected languages
  selectedLanguages.forEach(langCode => {
    recipientsByLanguage[langCode] = [];
  });
  
  // Then add recipients to their language groups
  selectedRecipients.forEach(recipient => {
    const recipientLang = recipient.language.toLowerCase();
    
    // Find matching language code
    let matchedLangCode = null;
    for (const langCode of selectedLanguages) {
      const language = availableLanguages.find(lang => lang.code === langCode);
      if (language && recipientLang.includes(language.name.toLowerCase())) {
        matchedLangCode = langCode;
        break;
      }
    }
    
    // If no match found, add to first language (default)
    if (!matchedLangCode && selectedLanguages.length > 0) {
      matchedLangCode = selectedLanguages[0];
    }
    
    // Add recipient to matched language group
    if (matchedLangCode) {
      if (!recipientsByLanguage[matchedLangCode]) {
        recipientsByLanguage[matchedLangCode] = [];
      }
      recipientsByLanguage[matchedLangCode].push(recipient);
    }
  });
  
  return recipientsByLanguage;
}

// Export functions
window.initLanguageSelection = initLanguageSelection;
window.selectLanguage = selectLanguage;
window.removeLanguage = removeLanguage;
window.switchLanguageTab = switchLanguageTab;
window.getAllLanguageContent = getAllLanguageContent;
window.validateLanguageContent = validateLanguageContent;
window.getRecipientsByLanguage = getRecipientsByLanguage;
window.updateRecipientsByLanguage = updateRecipientsByLanguage;
