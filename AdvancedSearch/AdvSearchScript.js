const data = [
  { name: 'Company A', industry: 'Technology', location: 'New York', revenue: 500000, establishedDate: '2001-05-15', active: 'Yes' },
  { name: 'Company B', industry: 'Finance', location: 'London', revenue: 300000, establishedDate: '1998-11-20', active: 'No' },
  { name: 'Company C', industry: 'Healthcare', location: 'San Francisco', revenue: 700000, establishedDate: '2010-03-10', active: 'Yes' },
  { name: 'Company D', industry: 'Retail', location: 'Chicago', revenue: 450000, establishedDate: '2005-07-25', active: 'No' },
  { name: 'Company E', industry: 'Manufacturing', location: 'Berlin', revenue: 350000, establishedDate: '2000-01-15', active: 'Yes' },
  { name: 'Company F', industry: 'Technology', location: 'Boston', revenue: 600000, establishedDate: '2003-09-30', active: 'Yes' },
  { name: 'Company G', industry: 'Finance', location: 'Paris', revenue: 400000, establishedDate: '1995-12-10', active: 'No' },
  { name: 'Company H', industry: 'Healthcare', location: 'Los Angeles', revenue: 800000, establishedDate: '2012-04-05', active: 'Yes' },
  { name: 'Company I', industry: 'Retail', location: 'Toronto', revenue: 550000, establishedDate: '2008-08-20', active: 'No' },
  { name: 'Company J', industry: 'Manufacturing', location: 'Shanghai', revenue: 500000, establishedDate: '2001-02-14', active: 'Yes' },
  { name: 'Company K', industry: 'Technology', location: 'Austin', revenue: 750000, establishedDate: '2006-06-18', active: 'Yes' },
  { name: 'Company L', industry: 'Finance', location: 'Dublin', revenue: 300000, establishedDate: '1999-10-25', active: 'No' },
  { name: 'Company M', industry: 'Healthcare', location: 'Mumbai', revenue: 900000, establishedDate: '2015-01-30', active: 'Yes' },
  { name: 'Company N', industry: 'Retail', location: 'Tokyo', revenue: 650000, establishedDate: '2004-03-22', active: 'No' },
  { name: 'Company O', industry: 'Manufacturing', location: 'Seoul', revenue: 480000, establishedDate: '2002-11-11', active: 'Yes' },
  { name: 'Company P', industry: 'Technology', location: 'San Diego', revenue: 570000, establishedDate: '2007-07-07', active: 'Yes' },
  { name: 'Company Q', industry: 'Finance', location: 'Madrid', revenue: 340000, establishedDate: '1996-05-19', active: 'No' },
  { name: 'Company R', industry: 'Healthcare', location: 'Dubai', revenue: 720000, establishedDate: '2011-09-09', active: 'Yes' },
  { name: 'Company S', industry: 'Retail', location: 'Mexico City', revenue: 610000, establishedDate: '2009-12-12', active: 'No' },
  { name: 'Company T', industry: 'Manufacturing', location: 'Sydney', revenue: 530000, establishedDate: '2000-04-04', active: 'Yes' },
];

let currentPage = 1;
const rowsPerPage = 5;
const totalPages = Math.ceil(data.length / rowsPerPage);
let filters = [];

function populateTable(page) {
  const gridBody = document.getElementById('grid-body');
  gridBody.innerHTML = '';

  const start = (page - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const rows = data.slice(start, end);

  rows.forEach(row => {
    const tr = document.createElement('tr');
    Object.values(row).forEach(cell => {
      const td = document.createElement('td');
      td.textContent = cell;
      tr.appendChild(td);
    });
    gridBody.appendChild(tr);
  });

  updatePager();
}

function updatePager() {
  const pageInfo = document.getElementById('page-info');
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

  document.getElementById('prev-btn').disabled = currentPage === 1;
  document.getElementById('next-btn').disabled = currentPage === totalPages;
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    populateTable(currentPage);
  }
}

function nextPage() {
  if (currentPage < totalPages) {
    currentPage++;
    populateTable(currentPage);
  }
}

function openAdvancedSearch() {
  document.getElementById('advanced-search-modal').style.display = 'block';
}

function closeAdvancedSearch() {
  document.getElementById('advanced-search-modal').style.display = 'none';
}

function addFilter() {
  const field = document.getElementById('field').value;
  const operator = document.getElementById('operator').value;
  const value = document.getElementById('value').value;
  const conditionDropdown = document.getElementById('condition');
  const isConditionVisible = conditionDropdown.style.display === 'block';
  const condition = isConditionVisible && conditionDropdown.value !== '0' ? conditionDropdown.value : null;

  // Validate inputs
  if (field === '0' || operator === '0' || !value.trim()) {
    alert('Please select valid values for all fields.');
    return;
  }

  // Construct filter string without condition for the first filter
  const filterString = `${isConditionVisible && condition ? condition + ' ' : ''}${field} ${operator} ${value}`;

  // Append to textarea
  const queryDisplay = document.getElementById('query-display');
  queryDisplay.value += (queryDisplay.value ? '\n' : '') + filterString;

  // Add filter to applied filters list
  const appliedFiltersList = document.getElementById('applied-filters-list');
  const filterItem = document.createElement('div');
  filterItem.className = 'filter-item';
  filterItem.textContent = filterString;

  const removeButton = document.createElement('button');
  removeButton.textContent = 'Remove';
  removeButton.onclick = () => {
    const filterItems = Array.from(appliedFiltersList.children);
    let index = filterItems.indexOf(filterItem);

    if (index !== -1) {
      appliedFiltersList.removeChild(filterItems[index]);
      updateQueryDisplay();

      // Adjust conditions for subsequent filters
      if (index === 0 && appliedFiltersList.children.length > 0) {
        const nextFilter = appliedFiltersList.children[0];
        const nextFilterText = nextFilter.textContent.replace(/^(AND|OR)\s/, '').replace('Remove', '').trim();
        nextFilter.textContent = nextFilterText;

        // Recreate and append the Remove button
        const nextRemoveButton = document.createElement('button');
        nextRemoveButton.textContent = 'Remove';
        nextRemoveButton.onclick = removeButton.onclick;
        nextFilter.appendChild(nextRemoveButton);
        updateQueryDisplay();
      }

      // Hide condition dropdown if all filters are removed
      if (appliedFiltersList.children.length === 0) {
        conditionDropdown.style.display = 'none';
      }

      // Repopulate grid data after filter removal
      applyFilters();
    } else {
      console.error('Filter item not found in appliedFiltersList. Setting index to 0.');
      index = 0; // Set index to 0 if it becomes -1
    }
  };

  filterItem.appendChild(removeButton);
  appliedFiltersList.appendChild(filterItem);

  // Clear inputs
  document.getElementById('value').value = '';

  // Show condition dropdown after the first filter is applied
  conditionDropdown.style.display = 'block';
}

function updateQueryDisplay() {
  const appliedFiltersList = document.getElementById('applied-filters-list');
  const queryDisplay = document.getElementById('query-display');
  const filters = Array.from(appliedFiltersList.children).map(item => item.textContent.replace('Remove', '').trim());
  queryDisplay.value = filters.join('\n');
}

// Add quick filter options above the dropdowns
const quickFiltersContainer = document.createElement('div');
quickFiltersContainer.className = 'quick-filters';

const quickFilters = [
  { label: 'Technology Companies', field: 'Industry', operator: 'equals', value: 'Technology' },
  { label: 'Revenue > 500K', field: 'Revenue', operator: 'greaterthan', value: '500000' },
  { label: 'Located in New York', field: 'Location', operator: 'equals', value: 'New York' }
];

quickFilters.forEach(filter => {
  const button = document.createElement('button');
  button.textContent = filter.label;

  // Style the button
  button.style.marginRight = '10px'; // Add space between buttons
  button.style.backgroundColor = '#333'; // Dark gray background
  button.style.color = '#fff'; // White text
  button.style.border = '1px solid #555'; // Gray border
  button.style.padding = '8px 12px'; // Add padding
  button.style.borderRadius = '5px'; // Rounded corners
  button.style.cursor = 'pointer'; // Pointer cursor on hover
  button.style.fontSize = '14px'; // Adjust font size for better readability
  button.style.boxShadow = '0px 4px 6px rgba(255, 255, 255, 0.1)'; // Subtle white shadow for depth

  // Add hover effects
  button.onmouseover = () => button.style.backgroundColor = '#444'; // Slightly lighter gray on hover
  button.onmouseout = () => button.style.backgroundColor = '#333'; // Reset color on mouse out

  // Set button functionality
  button.onclick = () => {
    document.getElementById('field').value = filter.field;
    document.getElementById('operator').value = filter.operator;
    document.getElementById('value').value = filter.value;
  };

  // Append the button to the quick filters container
  document.getElementById('quick-filters-container').appendChild(button);
});

const addQuickFilterButton = document.createElement('button');
addQuickFilterButton.textContent = 'Add Quick Filter';
addQuickFilterButton.style.marginTop = '10px';
addQuickFilterButton.style.marginRight = '10px';
addQuickFilterButton.onclick = () => {
  const label = prompt('Enter a label for the quick filter:');
  const field = prompt('Enter the field name (e.g., Industry, Revenue):');
  const operator = prompt('Enter the operator (e.g., equals, greaterthan):');
  const value = prompt('Enter the value for the filter:');

  if (!label || !field || !operator || !value) {
    alert('All fields are required to create a quick filter.');
    return;
  }

  const button = document.createElement('button');
  button.textContent = label;
  button.style.marginRight = '10px';
  button.onclick = () => {
    document.getElementById('field').value = field;
    document.getElementById('operator').value = operator;
    document.getElementById('value').value = value;
  };

  document.getElementById('quick-filters-container').appendChild(button);
};

document.getElementById('quick-filters-container').appendChild(addQuickFilterButton);

// Initialize the table with the first page
populateTable(currentPage);

function applyFilters() {
  const queryDisplay = document.getElementById('query-display').value;
  if (!queryDisplay.trim()) {
    alert('Please add at least one filter before searching.');
    return;
  }

  const filters = queryDisplay.split('\n').map((filter, index) => {
    const parts = filter.split(' ');

    // For the first filter, there is no condition
    if (index === 0) {
      const [field, operator, ...valueParts] = parts;
      const value = valueParts.join(' ');
      return { condition: null, field, operator, value };
    }

    // For subsequent filters, include the condition
    const [condition, field, operator, ...valueParts] = parts;
    const value = valueParts.join(' ');
    return { condition, field, operator, value };
  });

  const filteredData = data.filter(row => {
    return filters.every(filter => {
      const rowValue = row[filter.field.toLowerCase()];
      if (rowValue === undefined) return false; // Skip if field doesn't exist

      switch (filter.operator.toLowerCase()) {
        case 'equals':
          return rowValue.toString().toLowerCase() === filter.value.toLowerCase();
        case 'notequals':
          return rowValue.toString().toLowerCase() !== filter.value.toLowerCase();
        case 'greaterthan':
          return parseFloat(rowValue) > parseFloat(filter.value);
        case 'lessthan':
          return parseFloat(rowValue) < parseFloat(filter.value);
        case 'greaterthanorequals':
          return parseFloat(rowValue) >= parseFloat(filter.value);
        case 'lessthanorequals':
          return parseFloat(rowValue) <= parseFloat(filter.value);
        case 'contains':
          return rowValue.toString().toLowerCase().includes(filter.value.toLowerCase());
        case 'doesnotcontain':
          return !rowValue.toString().toLowerCase().includes(filter.value.toLowerCase());
        case 'startswith':
          return rowValue.toString().toLowerCase().startsWith(filter.value.toLowerCase());
        case 'endswith':
          return rowValue.toString().toLowerCase().endsWith(filter.value.toLowerCase());
        case 'isnull':
          return rowValue == null || rowValue === '';
        case 'isnotnull':
          return rowValue != null && rowValue !== '';
        default:
          return false; // Invalid operator
      }
    });
  });

  populateTableWithData(filteredData);
}

function populateTableWithData(filteredData) {
  const gridBody = document.getElementById('grid-body');
  gridBody.innerHTML = '';

  filteredData.forEach(row => {
    const tr = document.createElement('tr');
    Object.values(row).forEach(cell => {
      const td = document.createElement('td');
      td.textContent = cell;
      tr.appendChild(td);
    });
    gridBody.appendChild(tr);
  });
}

function resetFilters() {
  document.getElementById('query-display').value = '';
  document.getElementById('applied-filters-list').innerHTML = '';
  document.getElementById('condition').style.display = 'none';

  // Reset all dropdowns to default value
  document.getElementById('field').value = '0';
  document.getElementById('operator').value = '0';
  document.getElementById('value').value = '';

  // Repopulate the table with original data
  populateTable(currentPage);
}

// Reset button functionality
// document.getElementById('resetButton').addEventListener('click', resetFilters);

// Validation for dropdowns
function validateDropdowns() {
  const field = document.getElementById('field').value;
  const operator = document.getElementById('operator').value;
  const value = document.getElementById('value').value;

  if (field === '0' || operator === '0' || !value.trim()) {
    alert('Please fill all fields before adding a filter.');
    return false;
  }
  return true;
}

// document.getElementById('searchButton').addEventListener('click', applyFilters);

function performGlobalSearch() {
  const query = document.getElementById('global-search').value.trim().toLowerCase();
  if (!query) {
    populateTable(currentPage); // Show the initially loaded data
    return;
  }

  const filteredData = data.filter(row => {
    return Object.values(row).some(value => value.toString().toLowerCase().includes(query));
  });

  populateTableWithData(filteredData);
}

document.getElementById('global-search').addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    performGlobalSearch();
  }
});

document.getElementById('field').addEventListener('change', function () {
  const field = this.value;
  const valueContainer = document.getElementById('value-container');
  valueContainer.innerHTML = ''; // Clear the existing input

  const commonStyle = 'width: 200px; height: 35px; padding: 5px; border: 1px solid #ccc; border-radius: 4px;';

  if (field === 'EstablishedDate') {
    // Create a datepicker for date fields
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.id = 'value';
    dateInput.style.cssText = commonStyle; // Apply common styles
    valueContainer.appendChild(dateInput);
  } else if (field === 'Active') {
    // Create a checkbox for Yes/No fields
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'value';
    checkbox.addEventListener('change', function () {
      checkbox.value = this.checked ? 'Yes' : 'No'; // Set value to "Yes" or "No"
    });
    checkbox.value = 'No'; // Default value is "No"
    valueContainer.appendChild(checkbox);
  } else {
    // Default to a text input for other fields
    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.id = 'value';
    textInput.placeholder = 'Enter value';
    textInput.style.cssText = commonStyle; // Apply common styles
    valueContainer.appendChild(textInput);
  }
});

function applyBlackAndWhiteTheme() {
  document.body.style.backgroundColor = '#000'; // Set background to black
  document.body.style.color = '#fff'; // Set text color to white

  // Style all buttons
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    button.style.backgroundColor = '#333'; // Dark gray background
    button.style.color = '#fff'; // White text
    button.style.border = '1px solid #555'; // Gray border
    button.style.padding = '8px 12px';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
  });

  // Style all inputs
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    input.style.backgroundColor = '#222'; // Darker gray background
    input.style.color = '#fff'; // White text
    input.style.border = '1px solid #555'; // Gray border
    input.style.padding = '5px';
    input.style.borderRadius = '4px';
  });

  // Style the table
  const table = document.getElementById('data-grid');
  if (table) {
    table.style.backgroundColor = '#111'; // Black background
    table.style.color = '#fff'; // White text
    table.style.borderCollapse = 'collapse';
    table.style.width = '100%';
  }

  // Style table headers
  const tableHeaders = document.querySelectorAll('#data-grid th');
  tableHeaders.forEach(th => {
    th.style.backgroundColor = '#333'; // Dark gray background
    th.style.color = '#fff'; // White text
    th.style.border = '1px solid #555'; // Gray border
    th.style.padding = '10px';
  });

  // Style table cells
  const tableCells = document.querySelectorAll('#data-grid td');
  tableCells.forEach(td => {
    td.style.border = '1px solid #555'; // Gray border
    td.style.padding = '10px';
  });

  // Style modal
  const modal = document.getElementById('advanced-search-modal');
  if (modal) {
    modal.style.backgroundColor = '#111'; // Black background
    modal.style.color = '#fff'; // White text
    modal.style.border = '1px solid #555'; // Gray border
    modal.style.borderRadius = '5px';
  }
}

// Function to toggle the side menu
function toggleSideMenu() {
  const sideMenu = document.getElementById('side-menu');
  const content = document.getElementById('content');
  sideMenu.classList.toggle('open');
  content.classList.toggle('menu-open');
}

// Call the function to apply the theme
applyBlackAndWhiteTheme();

function populateSearchSuggestions() {
  const searchBox = document.getElementById('global-search');
  const suggestionsContainer = document.getElementById('search-suggestions-container');
  suggestionsContainer.innerHTML = ''; // Clear existing suggestions

  const query = searchBox.value.trim().toLowerCase();
  if (!query) {
    suggestionsContainer.style.display = 'none'; // Hide suggestions if query is empty
    return;
  }

  const searchSuggestions = new Set();

  // Add menu items to suggestions
  const menuItems = document.querySelectorAll('.menu-item, .side-menu a');
  menuItems.forEach(item => {
    if (item.textContent.toLowerCase().includes(query)) {
      searchSuggestions.add(item.textContent.trim());
    }
  });

  // Add grid data to suggestions
  data.forEach(row => {
    Object.values(row).forEach(value => {
      if (value.toString().toLowerCase().includes(query)) {
        searchSuggestions.add(value.toString());
      }
    });
  });

  // Populate the suggestions container
  searchSuggestions.forEach(suggestion => {
    const suggestionItem = document.createElement('div');
    suggestionItem.className = 'suggestion-item';
    suggestionItem.textContent = suggestion;
    suggestionItem.onclick = () => {
      searchBox.value = suggestion; // Set the search box value to the clicked suggestion
      suggestionsContainer.style.display = 'none'; // Hide suggestions
      performGlobalSearch(); // Trigger search
    };
    suggestionsContainer.appendChild(suggestionItem);
  });

  // Show suggestions if there are any
  suggestionsContainer.style.display = searchSuggestions.size > 0 ? 'block' : 'none';
}

// Attach event listeners to the search box
document.getElementById('global-search').addEventListener('input', populateSearchSuggestions);
document.getElementById('global-search').addEventListener('blur', () => {
  setTimeout(() => {
    document.getElementById('search-suggestions-container').style.display = 'none'; // Hide suggestions on blur
  }, 200);
});
document.getElementById('global-search').addEventListener('focus', populateSearchSuggestions);

populateSearchSuggestions();