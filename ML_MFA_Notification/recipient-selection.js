// Recipient Selection Module
// This file contains the functionality for selecting notification recipients and grouping them by language

// Sample user data for demonstration
const sampleUsers = [
  {
    id: 1,
    name: "Rajesh Sharma",
    email: "rajesh.sharma@example.com",
    role: "Manager",
    company: "Acme Inc.",
    team: "Sales",
    language: "English",
    reportingTo: null
  },
  {
    id: 2,
    name: "Priya Patel",
    email: "priya.patel@example.com",
    role: "Technician",
    company: "Acme Inc.",
    team: "Field Service",
    language: "Hindi",
    reportingTo: 1
  },
  {
    id: 3,
    name: "Arjun Singh",
    email: "arjun.singh@example.com",
    role: "Technician",
    company: "Acme Inc.",
    team: "Field Service",
    language: "Punjabi",
    reportingTo: 1
  },
  {
    id: 4,
    name: "Ananya Desai",
    email: "ananya.desai@example.com",
    role: "Supervisor",
    company: "Acme Inc.",
    team: "Customer Support",
    language: "English",
    reportingTo: 1
  },
  {
    id: 5,
    name: "Vikram Reddy",
    email: "vikram.reddy@example.com",
    role: "Technician",
    company: "Acme Inc.",
    team: "Field Service",
    language: "Telugu",
    reportingTo: 4
  },
  {
    id: 6,
    name: "Meera Iyer",
    email: "meera.iyer@example.com",
    role: "Technician",
    company: "Acme Inc.",
    team: "Field Service",
    language: "Tamil",
    reportingTo: 4
  },
  {
    id: 7,
    name: "Aditya Nair",
    email: "aditya.nair@example.com",
    role: "Administrator",
    company: "Beta Corp.",
    team: "IT",
    language: "Malayalam",
    reportingTo: null
  },
  {
    id: 8,
    name: "Kavita Joshi",
    email: "kavita.joshi@example.com",
    role: "Technician",
    company: "Beta Corp.",
    team: "Field Service",
    language: "Marathi",
    reportingTo: 7
  },
  {
    id: 9,
    name: "Sanjay Gupta",
    email: "sanjay.gupta@example.com",
    role: "Supervisor",
    company: "Beta Corp.",
    team: "Field Service",
    language: "Bengali",
    reportingTo: 7
  },
  {
    id: 10,
    name: "Divya Menon",
    email: "divya.menon@example.com",
    role: "Technician",
    company: "Beta Corp.",
    team: "Customer Support",
    language: "Kannada",
    reportingTo: 9
  }
];

// Available languages
const availableLanguages = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "pa", name: "Punjabi" },
  { code: "te", name: "Telugu" },
  { code: "ta", name: "Tamil" },
  { code: "ml", name: "Malayalam" },
  { code: "mr", name: "Marathi" },
  { code: "bn", name: "Bengali" },
  { code: "kn", name: "Kannada" }
];

// Store selected recipients
let selectedRecipients = [];

// Initialize recipient selection UI
function initRecipientSelection() {
  console.log('Initializing recipient selection...');

  // Reset selected recipients
  selectedRecipients = [];

  // Make sure it's globally accessible
  window.selectedRecipients = selectedRecipients;

  // Create filter options
  createFilterOptions();

  // Create recipient list
  createRecipientList();

  // Initialize search functionality
  initSearch();

  // Initialize language grouping
  initLanguageGrouping();

  console.log('Recipient selection initialized successfully');
}

// Create filter options UI
function createFilterOptions() {
  const filterContainer = document.getElementById('recipientFilterOptions');
  if (!filterContainer) {
    console.error('recipientFilterOptions element not found');
    return;
  }

  console.log('Creating filter options...');

  // Get unique values for filters
  const companies = [...new Set(sampleUsers.map(user => user.company))];
  const teams = [...new Set(sampleUsers.map(user => user.team))];
  const roles = [...new Set(sampleUsers.map(user => user.role))];

  // Create filter HTML
  filterContainer.innerHTML = `
    <div class="filter-option">
      <input type="radio" name="recipientFilter" id="filterAll" value="all" checked>
      <label for="filterAll">All Users</label>
    </div>

    <div class="filter-option">
      <input type="radio" name="recipientFilter" id="filterDownline" value="downline">
      <label for="filterDownline">Downline</label>
    </div>

    <div class="filter-option">
      <input type="radio" name="recipientFilter" id="filterCompany" value="company">
      <label for="filterCompany">Company</label>
      <div class="sub-filter company-filter hidden">
        <select id="companySelect">
          <option value="">Select Company</option>
          ${companies.map(company => `<option value="${company}">${company}</option>`).join('')}
        </select>
      </div>
    </div>

    <div class="filter-option">
      <input type="radio" name="recipientFilter" id="filterTeam" value="team">
      <label for="filterTeam">Group/Team</label>
      <div class="sub-filter team-filter hidden">
        <select id="teamSelect">
          <option value="">Select Team</option>
          ${teams.map(team => `<option value="${team}">${team}</option>`).join('')}
        </select>
      </div>
    </div>

    <div class="filter-option">
      <input type="radio" name="recipientFilter" id="filterRole" value="role">
      <label for="filterRole">Role</label>
      <div class="sub-filter role-filter hidden">
        <select id="roleSelect">
          <option value="">Select Role</option>
          ${roles.map(role => `<option value="${role}">${role}</option>`).join('')}
        </select>
      </div>
    </div>

    <div class="filter-option">
      <input type="radio" name="recipientFilter" id="filterIndividual" value="individual">
      <label for="filterIndividual">Individual</label>
      <div class="sub-filter individual-filter hidden">
        <input type="text" id="individualSearch" placeholder="Search by name...">
      </div>
    </div>
  `;

  console.log('Filter options created successfully');

  // Add event listeners to radio buttons
  const radioButtons = filterContainer.querySelectorAll('input[type="radio"]');
  radioButtons.forEach(radio => {
    radio.addEventListener('change', function() {
      // Hide all sub-filters
      const subFilters = filterContainer.querySelectorAll('.sub-filter');
      subFilters.forEach(filter => filter.classList.add('hidden'));

      // Show the selected sub-filter
      if (this.value !== 'all' && this.value !== 'downline') {
        const subFilter = filterContainer.querySelector(`.${this.value}-filter`);
        if (subFilter) {
          subFilter.classList.remove('hidden');
        }
      }

      // Apply filter
      applyFilter();
    });
  });

  // Add event listeners to select elements
  const selects = filterContainer.querySelectorAll('select');
  selects.forEach(select => {
    select.addEventListener('change', applyFilter);
  });

  // Add event listener to individual search
  const individualSearch = document.getElementById('individualSearch');
  if (individualSearch) {
    individualSearch.addEventListener('input', applyFilter);
  }
}

// Create recipient list UI
function createRecipientList() {
  const recipientListContainer = document.getElementById('recipientList');
  if (!recipientListContainer) {
    console.error('recipientList element not found');
    return;
  }

  console.log('Creating recipient list...');

  // Clear container
  recipientListContainer.innerHTML = '';

  // Create list
  const recipientListElement = document.createElement('div');
  recipientListElement.className = 'recipient-list';

  // Add users to list
  sampleUsers.forEach(user => {
    const userElement = document.createElement('div');
    userElement.className = 'recipient-item';
    userElement.dataset.userId = user.id;
    userElement.dataset.language = user.language;

    userElement.innerHTML = `
      <div class="recipient-checkbox">
        <input type="checkbox" id="user-${user.id}" data-user-id="${user.id}">
        <label for="user-${user.id}"></label>
      </div>
      <div class="recipient-info">
        <div class="recipient-name">${user.name}</div>
        <div class="recipient-details">
          <span class="recipient-role">${user.role}</span> •
          <span class="recipient-team">${user.team}</span> •
          <span class="recipient-company">${user.company}</span>
        </div>
      </div>
      <div class="recipient-language">${user.language}</div>
    `;

    // Add event listener to checkbox
    const checkbox = userElement.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', function() {
      if (this.checked) {
        // Add to selected recipients
        selectedRecipients.push(user);
      } else {
        // Remove from selected recipients
        selectedRecipients = selectedRecipients.filter(recipient => recipient.id !== user.id);
      }

      // Update global reference
      window.selectedRecipients = selectedRecipients;

      // Update language grouping
      updateLanguageGrouping();

      // Log for debugging
      console.log(`Recipients updated: ${selectedRecipients.length} selected`);
    });

    recipientListElement.appendChild(userElement);
  });

  recipientListContainer.appendChild(recipientListElement);
  console.log('Recipient list created successfully with', sampleUsers.length, 'users');
}

// Initialize search functionality
function initSearch() {
  const searchInput = document.getElementById('recipientSearch');
  if (!searchInput) return;

  searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const recipientItems = document.querySelectorAll('.recipient-item');

    recipientItems.forEach(item => {
      const name = item.querySelector('.recipient-name').textContent.toLowerCase();
      const details = item.querySelector('.recipient-details').textContent.toLowerCase();

      if (name.includes(searchTerm) || details.includes(searchTerm)) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  });
}

// Apply filter based on selected option
function applyFilter() {
  const selectedFilter = document.querySelector('input[name="recipientFilter"]:checked').value;
  const recipientItems = document.querySelectorAll('.recipient-item');

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
      // Show users in downline (for demo, we'll use user ID 1 as current user)
      const currentUserId = 1;
      const downlineUserIds = getDownlineUserIds(currentUserId);

      recipientItems.forEach(item => {
        const userId = parseInt(item.dataset.userId);
        if (!downlineUserIds.includes(userId) && userId !== currentUserId) {
          item.style.display = 'none';
        }
      });
      break;

    case 'company':
      const selectedCompany = document.getElementById('companySelect').value;
      if (selectedCompany) {
        recipientItems.forEach(item => {
          const company = item.querySelector('.recipient-company').textContent;
          if (company !== selectedCompany) {
            item.style.display = 'none';
          }
        });
      }
      break;

    case 'team':
      const selectedTeam = document.getElementById('teamSelect').value;
      if (selectedTeam) {
        recipientItems.forEach(item => {
          const team = item.querySelector('.recipient-team').textContent;
          if (team !== selectedTeam) {
            item.style.display = 'none';
          }
        });
      }
      break;

    case 'role':
      const selectedRole = document.getElementById('roleSelect').value;
      if (selectedRole) {
        recipientItems.forEach(item => {
          const role = item.querySelector('.recipient-role').textContent;
          if (role !== selectedRole) {
            item.style.display = 'none';
          }
        });
      }
      break;

    case 'individual':
      const searchTerm = document.getElementById('individualSearch').value.toLowerCase();
      if (searchTerm) {
        recipientItems.forEach(item => {
          const name = item.querySelector('.recipient-name').textContent.toLowerCase();
          if (!name.includes(searchTerm)) {
            item.style.display = 'none';
          }
        });
      }
      break;
  }
}

// Get all users in downline of a specific user
function getDownlineUserIds(userId) {
  const downlineIds = [];

  function findDownline(id) {
    const directReports = sampleUsers.filter(user => user.reportingTo === id);
    directReports.forEach(report => {
      downlineIds.push(report.id);
      findDownline(report.id);
    });
  }

  findDownline(userId);
  return downlineIds;
}

// Initialize language grouping
function initLanguageGrouping() {
  const languageGroupingContainer = document.getElementById('languageGrouping');
  if (!languageGroupingContainer) return;

  // Create initial empty state
  languageGroupingContainer.innerHTML = `
    <div class="language-grouping-empty">
      <p>Select recipients to see language grouping</p>
    </div>
  `;
}

// Update language grouping based on selected recipients
function updateLanguageGrouping() {
  const languageGroupingContainer = document.getElementById('languageGrouping');
  if (!languageGroupingContainer) return;

  if (selectedRecipients.length === 0) {
    // Show empty state
    languageGroupingContainer.innerHTML = `
      <div class="language-grouping-empty">
        <p>Select recipients to see language grouping</p>
      </div>
    `;
    return;
  }

  // Check if we should use the language selection module to update grouping
  if (typeof window.updateRecipientsByLanguage === 'function') {
    // Let the language selection module handle the grouping
    window.updateRecipientsByLanguage();
    return;
  }

  // Default grouping if language selection module is not available
  // Group recipients by language
  const groupedRecipients = {};
  selectedRecipients.forEach(recipient => {
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
        <span class="total-recipients">${selectedRecipients.length} total recipients</span>
        <span class="language-count">${Object.keys(groupedRecipients).length} languages</span>
      </div>
    </div>
    <div class="language-groups">
      ${groupsHTML}
    </div>
  `;
}

// Select all visible recipients
function selectAllVisibleRecipients() {
  const visibleItems = document.querySelectorAll('.recipient-item:not([style*="display: none"])');
  visibleItems.forEach(item => {
    const checkbox = item.querySelector('input[type="checkbox"]');
    const userId = parseInt(item.dataset.userId);

    // Only check if not already checked
    if (!checkbox.checked) {
      checkbox.checked = true;

      // Find the user in sampleUsers
      const user = sampleUsers.find(u => u.id === userId);
      if (user && !selectedRecipients.some(r => r.id === userId)) {
        selectedRecipients.push(user);
      }

      // Trigger change event
      const changeEvent = new Event('change');
      checkbox.dispatchEvent(changeEvent);
    }
  });

  // Update global reference
  window.selectedRecipients = selectedRecipients;
  console.log(`Selected all visible recipients. Total: ${selectedRecipients.length}`);
}

// Deselect all recipients
function deselectAllRecipients() {
  // Clear the selectedRecipients array
  selectedRecipients = [];

  // Update global reference
  window.selectedRecipients = selectedRecipients;

  // Uncheck all checkboxes
  const checkboxes = document.querySelectorAll('.recipient-item input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.checked = false;

    // Trigger change event
    const changeEvent = new Event('change');
    checkbox.dispatchEvent(changeEvent);
  });

  console.log('All recipients deselected');
}

// Get selected recipients grouped by language
function getSelectedRecipientsByLanguage() {
  const groupedRecipients = {};
  selectedRecipients.forEach(recipient => {
    if (!groupedRecipients[recipient.language]) {
      groupedRecipients[recipient.language] = [];
    }
    groupedRecipients[recipient.language].push(recipient);
  });

  return groupedRecipients;
}

// Get selected recipients array
function getSelectedRecipientsArray() {
  return [...selectedRecipients];
}

// Export functions
window.initRecipientSelection = initRecipientSelection;
window.selectAllVisibleRecipients = selectAllVisibleRecipients;
window.deselectAllRecipients = deselectAllRecipients;
window.getSelectedRecipientsByLanguage = getSelectedRecipientsByLanguage;
window.getSelectedRecipientsArray = getSelectedRecipientsArray;

// Make selectedRecipients accessible globally
window.selectedRecipients = selectedRecipients;

// Initialize the recipient selection when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing recipient selection...');
  initRecipientSelection();
});
