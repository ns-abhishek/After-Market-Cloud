document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const advancedSearchPanel = document.getElementById('advancedSearchPanel');
    const toggleAdvancedSearchPanelBtn = document.getElementById('toggleAdvancedSearchPanel');
    const collapseAdvancedSearchBtn = document.getElementById('collapseAdvancedSearchBtn');
    const selectColumn = document.getElementById('selectColumn');
    const selectOperator = document.getElementById('selectOperator');
    const valueInput = document.getElementById('valueInput');
    const valueOptions = document.getElementById('valueOptions');
    const selectCondition = document.getElementById('selectCondition');
    const addFilterBtn = document.getElementById('addFilterBtn');
    const appliedFiltersContainer = document.getElementById('appliedFiltersContainer');
    const removeSelectedFiltersBtn = document.getElementById('removeSelectedFiltersBtn');
    const searchBtn = document.getElementById('searchBtn');
    const resetBtn = document.getElementById('resetBtn');
    const dataGrid = document.getElementById('dataGrid');
    const refreshGridBtn = document.getElementById('refreshGrid');
    const activeFiltersContainer = document.getElementById('activeFiltersContainer');
    const activeFiltersTags = document.getElementById('activeFiltersTags');
    const paginationControls = document.getElementById('paginationControls');
    const startRecord = document.getElementById('startRecord');
    const endRecord = document.getElementById('endRecord');
    const totalRecords = document.getElementById('totalRecords');
    const switchToMobileBtn = document.getElementById('switchToMobile');
    const container = document.querySelector('.container');
    const toastContainer = document.getElementById('toastContainer');
    const quickFilterBtns = document.querySelectorAll('.quick-filter-btn');
    const normalSearchInput = document.getElementById('normalSearchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');

    // Directly visible filters elements
    const visibleDepartmentFilter = document.getElementById('visibleDepartmentFilter');
    const visibleStatusFilter = document.getElementById('visibleStatusFilter');
    const visibleDesignationFilter = document.getElementById('visibleDesignationFilter');
    const clearVisibleFiltersBtn = document.getElementById('clearVisibleFilters');

    // Show toast notification - only for errors/warnings
    function showToast(message, type = 'error', duration = 5000) {
        // Only show notifications for errors/warnings
        if (type !== 'error') {
            return; // Don't show success notifications
        }

        // Create toast element - always use error style
        const toast = document.createElement('div');
        toast.className = 'toast';

        // Create icon - always use warning icon
        const icon = document.createElement('span');
        icon.className = 'toast-icon';
        icon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';

        // Create message
        const messageEl = document.createElement('span');
        messageEl.className = 'toast-message';
        messageEl.textContent = message;

        // Create close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'toast-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', function() {
            toast.style.animation = 'fadeOut 0.3s forwards';
            setTimeout(() => {
                toast.remove();
            }, 300);
        });

        // Append elements to toast
        toast.appendChild(icon);
        toast.appendChild(messageEl);
        toast.appendChild(closeBtn);

        // Add toast to container
        toastContainer.appendChild(toast);

        // Auto-remove after duration
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'fadeOut 0.3s forwards';
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.remove();
                    }
                }, 300);
            }
        }, duration);

        return toast;
    }

    // Grid state
    const gridState = {
        data: [], // All data
        filteredData: [], // Data after applying filters
        pageSize: 10,
        currentPage: 1,
        appliedFilters: [], // Advanced search filters
        sortColumn: null,
        sortDirection: 'asc',
        isMobileView: false, // Flag for mobile view
        normalSearchQuery: '', // Normal search query
        isNormalSearchActive: false, // Flag for normal search
        visibleFilters: {
            department: '',
            status: '',
            designation: ''
        } // Directly visible filters
    };

    // Sample data for demonstration
    const sampleData = [
        {
            employeeCode: 'EMP001',
            name: 'John Doe',
            mobile: '1234567890',
            email: 'john@example.com',
            department: 'Engineering',
            designation: 'Developer',
            isActive: 'Yes',
            joinDate: '2020-01-15',
            salary: 85000,
            address: '123 Main St',
            city: 'New York',
            state: 'NY',
            country: 'USA',
            postalCode: '10001',
            phoneNumber: '212-555-1234',
            emergencyContact: 'Jane Doe (Wife)',
            birthDate: '1985-06-15',
            hireDate: '2020-01-15',
            terminationDate: ''
        },
        {
            employeeCode: 'EMP002',
            name: 'Jane Smith',
            mobile: '9876543210',
            email: 'jane@example.com',
            department: 'Marketing',
            designation: 'Manager',
            isActive: 'Yes',
            joinDate: '2019-05-20',
            salary: 95000,
            address: '456 Park Ave',
            city: 'Boston',
            state: 'MA',
            country: 'USA',
            postalCode: '02108',
            phoneNumber: '617-555-2345',
            emergencyContact: 'Bob Smith (Husband)',
            birthDate: '1982-03-22',
            hireDate: '2019-05-20',
            terminationDate: ''
        },
        {
            employeeCode: 'EMP003',
            name: 'Robert Johnson',
            mobile: '5551234567',
            email: 'robert@example.com',
            department: 'Sales',
            designation: 'Executive',
            isActive: 'Yes',
            joinDate: '2021-03-10',
            salary: 75000,
            address: '789 Oak St',
            city: 'Chicago',
            state: 'IL',
            country: 'USA',
            postalCode: '60601',
            phoneNumber: '312-555-3456',
            emergencyContact: 'Mary Johnson (Wife)',
            birthDate: '1990-11-05',
            hireDate: '2021-03-10',
            terminationDate: ''
        },
        {
            employeeCode: 'EMP004',
            name: 'Emily Davis',
            mobile: '7778889999',
            email: 'emily@example.com',
            department: 'HR',
            designation: 'Coordinator',
            isActive: 'No',
            joinDate: '2018-11-05',
            salary: 92000,
            address: '321 Pine St',
            city: 'San Francisco',
            state: 'CA',
            country: 'USA',
            postalCode: '94101',
            phoneNumber: '415-555-4567',
            emergencyContact: 'James Davis (Father)',
            birthDate: '1988-07-18',
            hireDate: '2018-11-05',
            terminationDate: '2022-06-30'
        },
        {
            employeeCode: 'EMP005',
            name: 'Michael Brown',
            mobile: '3334445555',
            email: 'michael@example.com',
            department: 'Engineering',
            designation: 'Senior Developer',
            isActive: 'Yes',
            joinDate: '2020-07-22',
            salary: 68000,
            address: '654 Maple Ave',
            city: 'Seattle',
            state: 'WA',
            country: 'USA',
            postalCode: '98101',
            phoneNumber: '206-555-5678',
            emergencyContact: 'Sarah Brown (Sister)',
            birthDate: '1992-02-28',
            hireDate: '2020-07-22',
            terminationDate: ''
        },
        {
            employeeCode: 'EMP006',
            name: 'Sarah Wilson',
            mobile: '6667778888',
            email: 'sarah@example.com',
            department: 'Finance',
            designation: 'Accountant',
            isActive: 'Yes',
            joinDate: '2019-09-15',
            salary: 78000,
            address: '987 Cedar Rd',
            city: 'Austin',
            state: 'TX',
            country: 'USA',
            postalCode: '73301',
            phoneNumber: '512-555-6789',
            emergencyContact: 'David Wilson (Husband)',
            birthDate: '1986-09-12',
            hireDate: '2019-09-15',
            terminationDate: ''
        },
        {
            employeeCode: 'EMP007',
            name: 'David Lee',
            mobile: '2223334444',
            email: 'david@example.com',
            department: 'IT',
            designation: 'System Admin',
            isActive: 'Yes',
            joinDate: '2021-01-10',
            salary: 65000,
            address: '753 Birch Blvd',
            city: 'Denver',
            state: 'CO',
            country: 'USA',
            postalCode: '80201',
            phoneNumber: '303-555-7890',
            emergencyContact: 'Linda Lee (Mother)',
            birthDate: '1994-05-03',
            hireDate: '2021-01-10',
            terminationDate: ''
        },
        {
            employeeCode: 'EMP008',
            name: 'Lisa Taylor',
            mobile: '8889990000',
            email: 'lisa@example.com',
            department: 'Marketing',
            designation: 'Specialist',
            isActive: 'No',
            joinDate: '2020-04-18',
            salary: 72000,
            address: '159 Elm St',
            city: 'Miami',
            state: 'FL',
            country: 'USA',
            postalCode: '33101',
            phoneNumber: '305-555-8901',
            emergencyContact: 'Mark Taylor (Brother)',
            birthDate: '1991-12-25',
            hireDate: '2020-04-18',
            terminationDate: '2023-01-15'
        },
        {
            employeeCode: 'EMP009',
            name: 'James Anderson',
            mobile: '4445556666',
            email: 'james@example.com',
            department: 'Sales',
            designation: 'Representative',
            isActive: 'Yes',
            joinDate: '2019-12-03',
            salary: 70000,
            address: '357 Walnut Dr',
            city: 'Atlanta',
            state: 'GA',
            country: 'USA',
            postalCode: '30301',
            phoneNumber: '404-555-9012',
            emergencyContact: 'Karen Anderson (Wife)',
            birthDate: '1989-08-14',
            hireDate: '2019-12-03',
            terminationDate: ''
        },
        {
            employeeCode: 'EMP010',
            name: 'Jennifer Martin',
            mobile: '1112223333',
            email: 'jennifer@example.com',
            department: 'HR',
            designation: 'Manager',
            isActive: 'Yes',
            joinDate: '2021-02-15',
            salary: 80000,
            address: '852 Spruce Ct',
            city: 'Philadelphia',
            state: 'PA',
            country: 'USA',
            postalCode: '19101',
            phoneNumber: '215-555-0123',
            emergencyContact: 'Michael Martin (Husband)',
            birthDate: '1984-04-30',
            hireDate: '2021-02-15',
            terminationDate: ''
        },
        {
            employeeCode: 'EMP011',
            name: 'Thomas White',
            mobile: '9990001111',
            email: 'thomas@example.com',
            department: 'Engineering',
            designation: 'QA Engineer',
            isActive: 'Yes',
            joinDate: '2018-08-20',
            salary: 67000,
            address: '426 Aspen Ln',
            city: 'Portland',
            state: 'OR',
            country: 'USA',
            postalCode: '97201',
            phoneNumber: '503-555-1234',
            emergencyContact: 'Emily White (Wife)',
            birthDate: '1987-10-17',
            hireDate: '2018-08-20',
            terminationDate: ''
        },
        {
            employeeCode: 'EMP012',
            name: 'Mary Johnson',
            mobile: '7776665555',
            email: 'mary@example.com',
            department: 'Finance',
            designation: 'Analyst',
            isActive: 'Yes',
            joinDate: '2020-10-12',
            salary: 90000,
            address: '951 Redwood Rd',
            city: 'Las Vegas',
            state: 'NV',
            country: 'USA',
            postalCode: '89101',
            phoneNumber: '702-555-2345',
            emergencyContact: 'Robert Johnson (Husband)',
            birthDate: '1993-01-08',
            hireDate: '2020-10-12',
            terminationDate: ''
        }
    ];

    // Initialize grid
    function initGrid() {
        // Load data
        gridState.data = sampleData;
        gridState.filteredData = [...sampleData];

        // Set up column sorting
        setupSorting();

        // Render grid
        renderGrid();

        // Initialize pagination
        updatePagination();

        // Initialize auto-complete
        initAutoComplete();

        // Initialize quick filters
        initQuickFilters();

        // Initialize keyboard shortcuts
        initKeyboardShortcuts();

        // Initialize normal search
        initNormalSearch();

        // Initialize directly visible filters
        initVisibleFilters();

        // Start with the advanced search panel collapsed
        advancedSearchPanel.classList.add('collapsed');
    }

    // Initialize directly visible filters
    function initVisibleFilters() {
        // Add event listeners to filter dropdowns
        visibleDepartmentFilter.addEventListener('change', function() {
            gridState.visibleFilters.department = this.value;
            applyVisibleFilters();
        });

        visibleStatusFilter.addEventListener('change', function() {
            gridState.visibleFilters.status = this.value;
            applyVisibleFilters();
        });

        visibleDesignationFilter.addEventListener('change', function() {
            gridState.visibleFilters.designation = this.value;
            applyVisibleFilters();
        });

        // Add event listener to clear filters button
        clearVisibleFiltersBtn.addEventListener('click', function() {
            // Reset filter values
            visibleDepartmentFilter.value = '';
            visibleStatusFilter.value = '';
            visibleDesignationFilter.value = '';

            // Reset filter state
            gridState.visibleFilters.department = '';
            gridState.visibleFilters.status = '';
            gridState.visibleFilters.designation = '';

            // Apply filters (which will now show all data)
            applyVisibleFilters();
        });
    }

    // Apply directly visible filters
    function applyVisibleFilters() {
        // Start with data filtered by advanced filters if any
        let filteredData = gridState.appliedFilters.length > 0
            ? filterData(gridState.data, gridState.appliedFilters)
            : [...gridState.data];

        // Apply visible filters using helper function
        filteredData = applyVisibleFiltersToData(filteredData);

        // Apply normal search if active
        if (gridState.isNormalSearchActive && gridState.normalSearchQuery) {
            const query = gridState.normalSearchQuery.toLowerCase();
            filteredData = filteredData.filter(item => {
                return Object.values(item).some(value =>
                    value.toString().toLowerCase().includes(query)
                );
            });
        }

        // Update filtered data
        gridState.filteredData = filteredData;

        // Apply current sort if one exists
        if (gridState.sortColumn) {
            sortData();
        }

        // Reset to first page
        gridState.currentPage = 1;

        // Update grid
        renderGrid();
        updatePagination();
    }

    // Initialize normal search functionality
    function initNormalSearch() {
        // Add event listener for input changes
        normalSearchInput.addEventListener('input', function() {
            const query = this.value.trim().toLowerCase();

            // Show/hide clear button
            clearSearchBtn.style.display = query ? 'block' : 'none';

            // Update search state
            gridState.normalSearchQuery = query;
            gridState.isNormalSearchActive = !!query;

            // Apply search
            applyNormalSearch();
        });

        // Add event listener for clear button
        clearSearchBtn.addEventListener('click', function() {
            // Clear search input
            normalSearchInput.value = '';

            // Hide clear button
            this.style.display = 'none';

            // Reset search state
            gridState.normalSearchQuery = '';
            gridState.isNormalSearchActive = false;

            // Reset to original filtered data (based on advanced filters if any)
            if (gridState.appliedFilters.length > 0) {
                gridState.filteredData = filterData(gridState.data, gridState.appliedFilters);
            } else {
                gridState.filteredData = [...gridState.data];
            }

            // Apply current sort if one exists
            if (gridState.sortColumn) {
                sortData();
            }

            // Reset to first page
            gridState.currentPage = 1;

            // Update grid
            renderGrid();
            updatePagination();

            // Focus on search input
            normalSearchInput.focus();
        });

        // Add event listener for Enter key
        normalSearchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyNormalSearch();
            }
        });
    }

    // Apply normal search to data
    function applyNormalSearch() {
        const query = gridState.normalSearchQuery;

        // If no query, reset to original data or filtered data from advanced search and visible filters
        if (!query) {
            // Start with data filtered by advanced filters if any
            let filteredData = gridState.appliedFilters.length > 0
                ? filterData(gridState.data, gridState.appliedFilters)
                : [...gridState.data];

            // Apply visible filters
            filteredData = applyVisibleFiltersToData(filteredData);

            gridState.filteredData = filteredData;
        } else {
            // Start with data filtered by advanced filters if any
            let dataToSearch = gridState.appliedFilters.length > 0
                ? filterData(gridState.data, gridState.appliedFilters)
                : [...gridState.data];

            // Apply visible filters to the data
            dataToSearch = applyVisibleFiltersToData(dataToSearch);

            // Filter data based on search query across all columns
            gridState.filteredData = dataToSearch.filter(item => {
                // Check each property for a match
                return Object.values(item).some(value =>
                    value.toString().toLowerCase().includes(query)
                );
            });
        }

        // Apply current sort if one exists
        if (gridState.sortColumn) {
            sortData();
        }

        // Reset to first page
        gridState.currentPage = 1;

        // Update grid
        renderGrid();
        updatePagination();
    }

    // Helper function to apply visible filters to data
    function applyVisibleFiltersToData(data) {
        let filteredData = [...data];

        // Apply department filter if selected
        if (gridState.visibleFilters.department) {
            filteredData = filteredData.filter(item =>
                item.department === gridState.visibleFilters.department
            );
        }

        // Apply status filter if selected
        if (gridState.visibleFilters.status) {
            filteredData = filteredData.filter(item =>
                item.isActive === gridState.visibleFilters.status
            );
        }

        // Apply designation filter if selected
        if (gridState.visibleFilters.designation) {
            filteredData = filteredData.filter(item =>
                item.designation === gridState.visibleFilters.designation
            );
        }

        return filteredData;
    }

    // Initialize auto-complete for value input
    function initAutoComplete() {
        // Listen for column selection changes to update auto-complete options
        selectColumn.addEventListener('change', function() {
            updateValueOptions();
            showAppropriateInputType(this.value);
        });

        // Initial update of options
        updateValueOptions();

        // Initialize searchable select
        initSearchableSelect();
    }

    // Initialize custom select field with integrated search functionality
    function initSearchableSelect() {
        // Get DOM elements
        const selectField = document.getElementById('selectFieldContainer');
        const selectFieldInput = document.getElementById('selectFieldInput');
        const selectFieldDropdown = document.getElementById('selectFieldDropdown');
        const selectFieldSearch = document.getElementById('selectFieldSearch');
        const selectFieldSearchInput = document.getElementById('selectFieldSearchInput');
        const selectFieldOptions = document.getElementById('selectFieldOptions');
        const selectFieldOptionElements = selectFieldOptions.querySelectorAll('.select-field-option');

        // Get the hidden native select for compatibility with existing code
        const nativeSelect = document.getElementById('selectColumn');

        // Add clear button to the input
        const clearButton = document.createElement('span');
        clearButton.className = 'select-field-clear';
        clearButton.innerHTML = '×';
        selectField.querySelector('.select-field-input-container').appendChild(clearButton);

        // Count the number of options
        const optionsCount = selectFieldOptionElements.length;

        // Variable to track if we're in search mode
        let isSearchMode = false;

        // Function to toggle dropdown visibility
        function toggleDropdown() {
            const isVisible = selectFieldDropdown.classList.contains('show');

            if (!isVisible) {
                // Check if we have 10+ options
                if (optionsCount >= 10) {
                    // For 10+ options, don't show dropdown initially
                    // Just enable search mode
                    enableSearchMode();
                    // Hide all options initially until user types something
                    selectFieldOptionElements.forEach(option => {
                        option.classList.add('hidden');
                    });
                } else {
                    // For fewer than 10 options, show dropdown normally
                    selectFieldDropdown.classList.add('show');
                }
            } else {
                // Hide dropdown
                selectFieldDropdown.classList.remove('show');

                // If in search mode, disable it
                if (isSearchMode) {
                    disableSearchMode();
                }
            }
        }

        // Function to enable search mode
        function enableSearchMode() {
            isSearchMode = true;
            selectField.classList.add('search-mode');
            selectFieldInput.readOnly = false;
            selectFieldInput.placeholder = 'Search columns...';

            // Clear any existing value to start fresh
            const currentValue = selectFieldInput.value;
            selectFieldInput.value = '';

            // Focus the input for immediate typing
            selectFieldInput.focus();

            // Hide the search in dropdown since we're searching in the input field
            selectFieldSearch.style.display = 'none';

            // Show the clear button if needed
            clearButton.style.display = 'none';
        }

        // Function to disable search mode
        function disableSearchMode() {
            isSearchMode = false;
            selectField.classList.remove('search-mode');
            selectFieldInput.readOnly = true;
            selectFieldInput.placeholder = '--Select--';

            // Clear any search term
            selectFieldInput.value = getSelectedOptionText();

            // Show all options
            selectFieldOptionElements.forEach(option => {
                option.classList.remove('hidden');
            });
        }

        // Function to get the text of the currently selected option
        function getSelectedOptionText() {
            const selectedValue = nativeSelect.value;
            const selectedOption = Array.from(selectFieldOptionElements).find(
                option => option.dataset.value === selectedValue
            );

            return selectedOption ? selectedOption.textContent : '--Select--';
        }

        // Function to update the input value based on selection
        function updateInputValue() {
            selectFieldInput.value = getSelectedOptionText();
        }

        // Function to select an option
        function selectOption(option) {
            const value = option.dataset.value;

            // Update native select
            nativeSelect.value = value;

            // Update UI
            selectFieldOptionElements.forEach(opt => {
                opt.classList.toggle('selected', opt === option);
            });

            // Update input value
            updateInputValue();

            // Hide dropdown
            selectFieldDropdown.classList.remove('show');

            // Disable search mode if active
            if (isSearchMode) {
                disableSearchMode();
            }

            // Trigger change event on the native select
            const event = new Event('change', { bubbles: true });
            nativeSelect.dispatchEvent(event);
        }

        // Function to filter options based on search term
        function filterOptions(searchTerm) {
            searchTerm = searchTerm.toLowerCase();
            let hasVisibleOptions = false;

            // Skip the first option (--Select--)
            const optionsToFilter = Array.from(selectFieldOptionElements).slice(1);

            optionsToFilter.forEach(option => {
                const text = option.textContent.toLowerCase();
                const shouldShow = text.includes(searchTerm);
                option.classList.toggle('hidden', !shouldShow);

                if (shouldShow) {
                    hasVisibleOptions = true;
                }
            });

            // Always hide the --Select-- option during search
            selectFieldOptionElements[0].classList.add('hidden');

            // If no options match, show a "No results" message
            if (!hasVisibleOptions && searchTerm) {
                // Check if we already have a no-results element
                let noResultsEl = selectFieldOptions.querySelector('.no-results');

                if (!noResultsEl) {
                    // Create a "No results" element
                    noResultsEl = document.createElement('div');
                    noResultsEl.className = 'select-field-option no-results';
                    noResultsEl.textContent = 'No matching options';
                    noResultsEl.style.fontStyle = 'italic';
                    noResultsEl.style.color = '#718096';
                    selectFieldOptions.appendChild(noResultsEl);
                }

                noResultsEl.classList.remove('hidden');
            } else {
                // Hide the "No results" element if it exists
                const noResultsEl = selectFieldOptions.querySelector('.no-results');
                if (noResultsEl) {
                    noResultsEl.classList.add('hidden');
                }
            }
        }

        // Event Listeners

        // Toggle dropdown when clicking on the input container
        selectFieldInput.addEventListener('click', function(e) {
            if (!isSearchMode) {
                e.stopPropagation();
                toggleDropdown();
            }
        });

        // Handle input changes (for search)
        selectFieldInput.addEventListener('input', function() {
            if (isSearchMode) {
                const searchTerm = this.value;

                // Show dropdown if it's not already visible
                if (!selectFieldDropdown.classList.contains('show') && searchTerm) {
                    selectFieldDropdown.classList.add('show');
                }

                // Filter options based on search term
                filterOptions(searchTerm);

                // Show/hide clear button
                clearButton.style.display = searchTerm ? 'flex' : 'none';

                // Hide dropdown if search is empty
                if (!searchTerm) {
                    selectFieldDropdown.classList.remove('show');
                }
            }
        });

        // Handle option selection
        selectFieldOptionElements.forEach(option => {
            option.addEventListener('click', function() {
                selectOption(this);
            });
        });

        // Handle clear button click
        clearButton.addEventListener('click', function(e) {
            e.stopPropagation();
            selectFieldInput.value = '';
            selectFieldInput.focus();
            filterOptions('');
            this.style.display = 'none';
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!selectField.contains(e.target)) {
                selectFieldDropdown.classList.remove('show');

                // If in search mode, disable it
                if (isSearchMode) {
                    disableSearchMode();
                }
            }
        });

        // Sync the native select with our custom select (for programmatic changes)
        const originalSelectChange = nativeSelect.onchange;
        nativeSelect.addEventListener('change', function(e) {
            if (originalSelectChange) {
                originalSelectChange.call(this, e);
            }

            // Update the selected option in our custom select
            const value = this.value;
            selectFieldOptionElements.forEach(option => {
                option.classList.toggle('selected', option.dataset.value === value);
            });

            // Update input value
            updateInputValue();
        });

        // Initialize with current selection
        updateInputValue();
    }

    // Update value options based on selected column
    function updateValueOptions() {
        // Clear existing options
        valueOptions.innerHTML = '';

        const column = selectColumn.value;
        if (!column) return;

        // Get unique values for the selected column
        const uniqueValues = new Set();
        gridState.data.forEach(item => {
            uniqueValues.add(item[column]);
        });

        // Add options to datalist
        uniqueValues.forEach(value => {
            const option = document.createElement('option');
            option.value = value;
            valueOptions.appendChild(option);
        });
    }

    // Show appropriate input type based on column
    function showAppropriateInputType(column) {
        // Hide all input containers first
        document.querySelectorAll('.value-input-container').forEach(container => {
            container.style.display = 'none';
        });

        // Show the appropriate input container based on column type
        switch(column) {
            case 'department':
            case 'designation':
                // Show radio buttons for single selection
                document.getElementById('radioContainer').style.display = 'block';
                populateRadioButtons(column);
                break;

            case 'isActive':
                // Show radio buttons for Yes/No
                document.getElementById('radioContainer').style.display = 'block';
                populateRadioButtons(column);
                break;

            case 'salary':
                // Show slider for numeric range
                document.getElementById('sliderContainer').style.display = 'block';
                setupSlider(column);
                break;

            case 'joinDate':
                // Show date picker
                document.getElementById('datePickerContainer').style.display = 'block';
                break;

            default:
                // Show standard text input for other columns
                document.getElementById('standardInputContainer').style.display = 'block';
                break;
        }
    }

    // Populate radio buttons based on column
    function populateRadioButtons(column) {
        const radioGroup = document.getElementById('radioGroup');
        radioGroup.innerHTML = '';

        let options = [];

        switch(column) {
            case 'department':
                options = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'IT'];
                break;

            case 'designation':
                options = ['Developer', 'Manager', 'Executive', 'Senior Developer', 'Accountant', 'System Admin', 'Representative', 'QA Engineer', 'Analyst'];
                break;

            case 'isActive':
                options = ['Yes', 'No'];
                break;

            default:
                options = ['Option 1', 'Option 2', 'Option 3'];
                break;
        }

        options.forEach((option, index) => {
            const radioItem = document.createElement('div');
            radioItem.className = 'radio-item';

            const radioInput = document.createElement('input');
            radioInput.type = 'radio';
            radioInput.name = 'radioOption';
            radioInput.id = `radio_${index}`;
            radioInput.value = option;

            const radioLabel = document.createElement('label');
            radioLabel.htmlFor = `radio_${index}`;
            radioLabel.textContent = option;

            radioItem.appendChild(radioInput);
            radioItem.appendChild(radioLabel);
            radioGroup.appendChild(radioItem);

            // Add event listener to update value input when radio is selected
            radioInput.addEventListener('change', function() {
                if (this.checked) {
                    valueInput.value = this.value;
                }
            });
        });
    }

    // Setup slider for numeric ranges
    function setupSlider(column) {
        const slider = document.getElementById('rangeSlider');
        const sliderValue = document.getElementById('sliderValue');

        // Set slider range based on column
        if (column === 'salary') {
            slider.min = 30000;
            slider.max = 150000;
            slider.step = 1000;
            slider.value = 50000;
        } else {
            slider.min = 0;
            slider.max = 100;
            slider.step = 1;
            slider.value = 50;
        }

        // Update display value
        sliderValue.textContent = slider.value;

        // Add event listener to update value when slider changes
        slider.addEventListener('input', function() {
            sliderValue.textContent = this.value;
            valueInput.value = this.value;
        });
    }

    // Helper function to update quick filters display based on selected column
    function updateQuickFiltersDisplay(selectedColumn = '') {
        const quickFiltersContainer = document.querySelector('.quick-filter-buttons');
        const noQuickFiltersMessage = document.querySelector('.no-quick-filters-message');

        // Remove all filter-by-* classes
        quickFiltersContainer.classList.remove('show-all-quick-filters');
        quickFiltersContainer.classList.remove('filter-by-department');
        quickFiltersContainer.classList.remove('filter-by-employeeCode');
        quickFiltersContainer.classList.remove('filter-by-name');
        quickFiltersContainer.classList.remove('filter-by-mobile');
        quickFiltersContainer.classList.remove('filter-by-email');
        quickFiltersContainer.classList.remove('filter-by-designation');
        quickFiltersContainer.classList.remove('filter-by-isActive');

        // Hide the no quick filters message by default
        noQuickFiltersMessage.style.display = 'none';

        // Add the appropriate class based on selected column
        if (selectedColumn) {
            quickFiltersContainer.classList.add(`filter-by-${selectedColumn}`);

            // Check if there are any quick filters for this column
            const hasQuickFilters = document.querySelectorAll(`.quick-filter-btn[data-filter-group="${selectedColumn}"]`).length > 0;

            // Show/hide the message based on whether there are quick filters
            if (!hasQuickFilters) {
                noQuickFiltersMessage.style.display = 'block';
            }
        } else {
            // If no column selected, show all quick filters
            quickFiltersContainer.classList.add('show-all-quick-filters');
        }
    }

    // Initialize quick filter buttons
    function initQuickFilters() {
        // Show all quick filters initially
        updateQuickFiltersDisplay();

        // Add event listener to column select to show/hide relevant quick filters
        selectColumn.addEventListener('change', function() {
            updateQuickFiltersDisplay(this.value);
        });

        // Add event listener to operator select to show appropriate input type
        selectOperator.addEventListener('change', function() {
            const operator = this.value;
            const column = selectColumn.value;

            // Hide all input containers first
            document.querySelectorAll('.value-input-container').forEach(container => {
                container.style.display = 'none';
            });

            if (operator === 'in') {
                // Show tags input for IN operator
                document.getElementById('tagsContainer').style.display = 'block';
                setupTagsInput();
            } else if (operator === 'between') {
                if (column === 'joinDate') {
                    // Show date range for date columns
                    document.getElementById('dateRangeContainer').style.display = 'block';
                } else {
                    // Show slider for numeric columns
                    document.getElementById('sliderContainer').style.display = 'block';
                    setupSlider(column);
                }
            } else {
                // Show the default input type for the column
                showAppropriateInputType(column);
            }
        });

        // Add click event to quick filter buttons
        quickFilterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const column = this.dataset.column;
                const operator = this.dataset.operator;
                const value = this.dataset.value;

                // Set form values
                selectColumn.value = column;
                selectOperator.value = operator;
                valueInput.value = value;

                // Update value options
                updateValueOptions();

                // Update quick filters display based on selected column
                updateQuickFiltersDisplay(column);

                // Show appropriate input type
                showAppropriateInputType(column);

                // Add the filter
                addFilter();

                // After adding a filter, automatically select "OR" condition for the next filter
                // This makes it easier to chain multiple quick filters
                if (gridState.appliedFilters.length > 0) {
                    selectCondition.value = 'or';
                }
            });
        });
    }

    // Setup tags input for multiple values
    function setupTagsInput() {
        const tagsInput = document.getElementById('tagsInput');
        const tagsList = document.getElementById('tagsList');

        // Clear existing tags
        tagsList.innerHTML = '';
        valueInput.value = '';

        // Add event listener for Enter key
        tagsInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();

                const tagValue = this.value.trim();
                if (tagValue) {
                    // Create a new tag
                    addTag(tagValue);

                    // Clear the input
                    this.value = '';

                    // Update the hidden value input with comma-separated values
                    updateTagsValue();
                }
            }
        });

        // Function to add a tag
        function addTag(value) {
            const tag = document.createElement('span');
            tag.className = 'tag';
            tag.innerHTML = `${value} <span class="remove-tag">&times;</span>`;

            // Add event listener to remove tag
            tag.querySelector('.remove-tag').addEventListener('click', function() {
                tag.remove();
                updateTagsValue();
            });

            tagsList.appendChild(tag);
        }

        // Function to update the hidden value input
        function updateTagsValue() {
            const tags = Array.from(tagsList.querySelectorAll('.tag')).map(tag =>
                tag.textContent.trim().replace('×', '')
            );

            valueInput.value = tags.join(',');
        }
    }

    // Initialize keyboard shortcuts
    function initKeyboardShortcuts() {
        // Add filter on Enter in value input
        valueInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addFilterBtn.click();
            }
        });

        // Global shortcuts
        document.addEventListener('keydown', function(e) {
            // Ctrl+F to open search modal
            if (e.ctrlKey && e.key === 'f') {
                e.preventDefault();
                openModalBtn.click();
            }

            // Esc to close modal
            if (e.key === 'Escape' && modal.style.display === 'block') {
                closeModalBtn.click();
            }
        });
    }

    // Add filter function (extracted to be reusable)
    function addFilter() {
        const column = selectColumn.value;
        const operator = selectOperator.value;
        const value = valueInput.value.trim();
        const condition = selectCondition.value;

        // Validate inputs
        if (!column || !operator || !value) {
            showToast('Please select column, operator, and enter a value.', 'error');
            return;
        }

        // Check for duplicate filters
        const isDuplicate = gridState.appliedFilters.some(filter =>
            filter.column === column &&
            filter.operator === operator &&
            filter.value.toLowerCase() === value.toLowerCase()
        );

        if (isDuplicate) {
            // Show toast notification instead of alert
            showToast('Duplicate filter detected! You already have a filter with the same column, operator, and value.', 'error');
            return;
        }

        // Get readable names for display
        const columnText = selectColumn.options[selectColumn.selectedIndex].text;
        const operatorText = selectOperator.options[selectOperator.selectedIndex].text;
        const conditionText = selectCondition.options[selectCondition.selectedIndex].text;

        // Create filter object
        const filter = {
            column,
            operator,
            value,
            condition,
            displayText: `${columnText} ${operatorText} "${value}"`
        };

        // Add condition prefix (AND/OR) for filters after the first one
        if (gridState.appliedFilters.length > 0 && condition) {
            filter.displayText = `${conditionText} ${filter.displayText}`;
        }

        // Add to filters array
        gridState.appliedFilters.push(filter);

        // Update filters display
        updateFiltersDisplay();

        // Clear inputs
        valueInput.value = '';

        // If it's not the first filter, condition is required for the next one
        if (gridState.appliedFilters.length > 0) {
            selectCondition.required = true;
            // Automatically select "OR" condition for the next filter
            selectCondition.value = 'or';
        }

        // No success notification for adding filters
    }

    // Set up column sorting
    function setupSorting() {
        const headers = dataGrid.querySelectorAll('thead th');

        headers.forEach(header => {
            header.addEventListener('click', () => {
                const column = header.getAttribute('data-column');

                // If clicking the same column, toggle sort direction
                if (gridState.sortColumn === column) {
                    gridState.sortDirection = gridState.sortDirection === 'asc' ? 'desc' : 'asc';
                } else {
                    // New column, default to ascending
                    gridState.sortColumn = column;
                    gridState.sortDirection = 'asc';
                }

                // Update sort indicators
                updateSortIndicators();

                // Sort the data
                sortData();

                // Reset to first page
                gridState.currentPage = 1;

                // Re-render the grid
                renderGrid();
                updatePagination();
            });
        });
    }

    // Update sort indicators in column headers
    function updateSortIndicators() {
        const headers = dataGrid.querySelectorAll('thead th');

        headers.forEach(header => {
            // Remove existing sort classes
            header.classList.remove('sort-asc', 'sort-desc');

            const column = header.getAttribute('data-column');

            // Add appropriate sort class if this is the sorted column
            if (column === gridState.sortColumn) {
                header.classList.add(gridState.sortDirection === 'asc' ? 'sort-asc' : 'sort-desc');
            }
        });
    }

    // Sort the data based on current sort column and direction
    function sortData() {
        if (!gridState.sortColumn) return;

        gridState.filteredData.sort((a, b) => {
            let valueA = a[gridState.sortColumn];
            let valueB = b[gridState.sortColumn];

            // Handle string comparison
            if (typeof valueA === 'string') {
                valueA = valueA.toLowerCase();
                valueB = valueB.toLowerCase();
            }

            // Compare values
            if (valueA < valueB) {
                return gridState.sortDirection === 'asc' ? -1 : 1;
            }
            if (valueA > valueB) {
                return gridState.sortDirection === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }

    // Render grid with current data
    function renderGrid() {
        const tbody = dataGrid.querySelector('tbody');
        const thead = dataGrid.querySelector('thead tr');
        tbody.innerHTML = '';
        thead.innerHTML = '';

        // Define all column properties and labels (including all columns from the dropdown)
        const properties = [
            'employeeCode', 'name', 'mobile', 'email', 'department', 'designation',
            'isActive', 'joinDate', 'salary', 'address', 'city', 'state', 'country',
            'postalCode', 'phoneNumber', 'emergencyContact', 'birthDate', 'hireDate', 'terminationDate'
        ];

        const labels = [
            'Employee Code', 'Name', 'Mobile', 'Email', 'Department', 'Designation',
            'Is Active?', 'Join Date', 'Salary', 'Address', 'City', 'State', 'Country',
            'Postal Code', 'Phone Number', 'Emergency Contact', 'Birth Date', 'Hire Date', 'Termination Date'
        ];

        // Create table headers for all columns
        properties.forEach((prop, index) => {
            const th = document.createElement('th');
            th.setAttribute('data-column', prop);
            th.innerHTML = `${labels[index]} <span class="sort-icon"></span>`;
            thead.appendChild(th);
        });

        // Calculate pagination
        const startIndex = (gridState.currentPage - 1) * gridState.pageSize;
        const endIndex = Math.min(startIndex + gridState.pageSize, gridState.filteredData.length);

        // Update pagination info
        startRecord.textContent = gridState.filteredData.length > 0 ? startIndex + 1 : 0;
        endRecord.textContent = endIndex;
        totalRecords.textContent = gridState.filteredData.length;

        // No data message
        if (gridState.filteredData.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = properties.length;
            cell.textContent = 'No data found';
            cell.style.textAlign = 'center';
            row.appendChild(cell);
            tbody.appendChild(row);
            return;
        }

        // Add data rows
        for (let i = startIndex; i < endIndex; i++) {
            const item = gridState.filteredData[i];
            const row = document.createElement('tr');

            if (gridState.isMobileView) {
                // Mobile view: create card-like rows with labels
                properties.forEach((prop, index) => {
                    const cell = document.createElement('td');
                    cell.setAttribute('data-label', labels[index]);
                    // Use empty string if property doesn't exist
                    cell.textContent = item[prop] !== undefined ? item[prop] : '';
                    row.appendChild(cell);
                });
            } else {
                // Desktop view: standard table rows
                properties.forEach(prop => {
                    const cell = document.createElement('td');
                    // Use empty string if property doesn't exist
                    cell.textContent = item[prop] !== undefined ? item[prop] : '';
                    row.appendChild(cell);
                });
            }

            tbody.appendChild(row);
        }

        // Re-setup sorting after updating headers
        setupSorting();
    }

    // Update pagination controls
    function updatePagination() {
        paginationControls.innerHTML = '';

        const totalPages = Math.ceil(gridState.filteredData.length / gridState.pageSize);

        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'page-btn';
        prevBtn.innerHTML = '&laquo;';
        prevBtn.disabled = gridState.currentPage === 1;
        prevBtn.addEventListener('click', () => {
            if (gridState.currentPage > 1) {
                gridState.currentPage--;
                renderGrid();
                updatePagination();
            }
        });
        paginationControls.appendChild(prevBtn);

        // Page buttons
        const maxPageButtons = 5;
        let startPage = Math.max(1, gridState.currentPage - Math.floor(maxPageButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

        if (endPage - startPage + 1 < maxPageButtons) {
            startPage = Math.max(1, endPage - maxPageButtons + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = 'page-btn';
            if (i === gridState.currentPage) {
                pageBtn.classList.add('active');
            }
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                gridState.currentPage = i;
                renderGrid();
                updatePagination();
            });
            paginationControls.appendChild(pageBtn);
        }

        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'page-btn';
        nextBtn.innerHTML = '&raquo;';
        nextBtn.disabled = gridState.currentPage === totalPages;
        nextBtn.addEventListener('click', () => {
            if (gridState.currentPage < totalPages) {
                gridState.currentPage++;
                renderGrid();
                updatePagination();
            }
        });
        paginationControls.appendChild(nextBtn);
    }

    // Toggle advanced search panel
    toggleAdvancedSearchPanelBtn.addEventListener('click', function() {
        // Toggle panel visibility
        advancedSearchPanel.classList.toggle('collapsed');

        // Reset form if opening
        if (!advancedSearchPanel.classList.contains('collapsed')) {
            // Update the applied filters display to reflect current state
            updateFiltersDisplay();

            // Show all quick filters
            updateQuickFiltersDisplay();
        }
    });

    // Collapse panel with the collapse button
    collapseAdvancedSearchBtn.addEventListener('click', function() {
        advancedSearchPanel.classList.toggle('collapsed');
    });

    // Add filter button click
    addFilterBtn.addEventListener('click', function() {
        addFilter();
    });

    // Update filters display
    function updateFiltersDisplay() {
        appliedFiltersContainer.innerHTML = '';

        if (gridState.appliedFilters.length === 0) {
            appliedFiltersContainer.innerHTML = '<div class="filter-item">No filters applied</div>';
            return;
        }

        // Create filter items with checkboxes
        gridState.appliedFilters.forEach((filter, index) => {
            const filterItem = document.createElement('div');
            filterItem.className = 'filter-item';
            filterItem.dataset.index = index;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `filter-${index}`;
            checkbox.dataset.index = index;

            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    filterItem.classList.add('selected');
                } else {
                    filterItem.classList.remove('selected');
                }
            });

            const filterText = document.createElement('label');
            filterText.className = 'filter-text';
            filterText.htmlFor = `filter-${index}`;
            filterText.textContent = filter.displayText;

            // Create filter actions container
            const filterActions = document.createElement('div');
            filterActions.className = 'filter-actions';

            // Create edit button
            const editBtn = document.createElement('button');
            editBtn.className = 'filter-edit-btn';
            editBtn.title = 'Edit filter';
            editBtn.innerHTML = '<i class="fas fa-edit"></i>';
            editBtn.dataset.index = index;
            editBtn.addEventListener('click', function() {
                editFilter(parseInt(this.dataset.index));
            });

            filterActions.appendChild(editBtn);

            filterItem.appendChild(checkbox);
            filterItem.appendChild(filterText);
            filterItem.appendChild(filterActions);
            appliedFiltersContainer.appendChild(filterItem);
        });
    }

    // Search button click
    searchBtn.addEventListener('click', function() {
        if (gridState.appliedFilters.length === 0) {
            showToast('Please add at least one filter.', 'error');
            return;
        }

        // Check for and remove duplicate filters
        const uniqueFilters = [];
        const filterKeys = new Set();

        // Keep only unique filters
        gridState.appliedFilters.forEach(filter => {
            const filterKey = `${filter.column}|${filter.operator}|${filter.value.toLowerCase()}`;

            if (!filterKeys.has(filterKey)) {
                filterKeys.add(filterKey);
                uniqueFilters.push(filter);
            }
        });

        // If duplicates were found, update the filters array and display
        if (uniqueFilters.length < gridState.appliedFilters.length) {
            gridState.appliedFilters = uniqueFilters;
            updateFiltersDisplay();
            // No success notification for removing duplicate filters
        }

        // Apply filters to data
        let filteredData = filterData(gridState.data, gridState.appliedFilters);

        // If normal search is active, apply it to the filtered data
        if (gridState.isNormalSearchActive && gridState.normalSearchQuery) {
            const query = gridState.normalSearchQuery.toLowerCase();
            filteredData = filteredData.filter(item => {
                return Object.values(item).some(value =>
                    value.toString().toLowerCase().includes(query)
                );
            });
        }

        gridState.filteredData = filteredData;

        // Apply current sort if one exists
        if (gridState.sortColumn) {
            sortData();
        }

        // Reset to first page
        gridState.currentPage = 1;

        // Update grid
        renderGrid();
        updatePagination();

        // Update active filters display
        updateActiveFiltersDisplay();

        // Collapse the panel after search
        advancedSearchPanel.classList.add('collapsed');
    });

    // Reset button click
    resetBtn.addEventListener('click', function() {
        // Clear all filters
        gridState.appliedFilters = [];
        updateFiltersDisplay();

        // Reset form
        selectColumn.value = '';
        selectOperator.value = '';
        valueInput.value = '';
        selectCondition.value = '';

        // Clear condition requirement
        selectCondition.required = false;

        // Show all quick filters
        updateQuickFiltersDisplay();

        // Remove Save Changes button and clean up event listeners if it exists
        const saveChangesBtn = document.getElementById('saveChangesBtn');
        if (saveChangesBtn) {
            // Remove event listeners if they exist
            if (saveChangesBtn.changeListeners) {
                selectColumn.removeEventListener('change', saveChangesBtn.changeListeners.column);
                selectOperator.removeEventListener('change', saveChangesBtn.changeListeners.operator);
                valueInput.removeEventListener('input', saveChangesBtn.changeListeners.value);
                selectCondition.removeEventListener('change', saveChangesBtn.changeListeners.condition);
            }
            saveChangesBtn.remove();
        }

        // Remove the editing class from all filter items
        const allFilterItems = document.querySelectorAll('.filter-item');
        allFilterItems.forEach(item => {
            item.classList.remove('editing');
        });

        // Apply normal search if active, otherwise reset to all data
        if (gridState.isNormalSearchActive && gridState.normalSearchQuery) {
            // Filter data based on normal search query
            const query = gridState.normalSearchQuery.toLowerCase();
            gridState.filteredData = gridState.data.filter(item => {
                return Object.values(item).some(value =>
                    value.toString().toLowerCase().includes(query)
                );
            });
        } else {
            // Reset filtered data to all data
            gridState.filteredData = [...gridState.data];
        }

        // Reset sort
        gridState.sortColumn = null;
        gridState.sortDirection = 'asc';
        updateSortIndicators();

        // Reset to first page
        gridState.currentPage = 1;

        // Update grid
        renderGrid();
        updatePagination();

        // Hide active filters
        activeFiltersContainer.style.display = 'none';
        activeFiltersTags.innerHTML = '';
    });

    // Remove selected filters button click
    removeSelectedFiltersBtn.addEventListener('click', function() {
        const checkboxes = appliedFiltersContainer.querySelectorAll('input[type="checkbox"]:checked');

        if (checkboxes.length === 0) {
            showToast('Please select at least one filter to remove.', 'error');
            return;
        }

        // Collect indices to remove (in descending order to avoid index shifting)
        const indicesToRemove = Array.from(checkboxes)
            .map(checkbox => parseInt(checkbox.dataset.index))
            .sort((a, b) => b - a); // Sort in descending order

        // Remove the selected filters
        indicesToRemove.forEach(index => {
            gridState.appliedFilters.splice(index, 1);
        });

        // Update filters display
        updateFiltersDisplay();

        // If filters were removed, update the grid
        if (indicesToRemove.length > 0) {
            // Update filters
            if (gridState.appliedFilters.length > 0) {
                // Reapply filters
                gridState.filteredData = filterData(gridState.data, gridState.appliedFilters);
            } else {
                // No filters, show all data
                gridState.filteredData = [...gridState.data];
            }

            // Apply normal search if active
            if (gridState.isNormalSearchActive && gridState.normalSearchQuery) {
                const query = gridState.normalSearchQuery.toLowerCase();
                gridState.filteredData = gridState.filteredData.filter(item => {
                    return Object.values(item).some(value =>
                        value.toString().toLowerCase().includes(query)
                    );
                });
            }

            // Apply current sort if one exists
            if (gridState.sortColumn) {
                sortData();
            }

            // Update grid
            renderGrid();
            updatePagination();

            // Update active filters display
            updateActiveFiltersDisplay();
        }
    });

    // Refresh grid button click
    refreshGridBtn.addEventListener('click', function() {
        // Clear all filters
        gridState.appliedFilters = [];

        // Reset filtered data
        gridState.filteredData = [...gridState.data];

        // Reset sort
        gridState.sortColumn = null;
        gridState.sortDirection = 'asc';
        updateSortIndicators();

        // Reset to first page
        gridState.currentPage = 1;

        // Clear normal search
        normalSearchInput.value = '';
        clearSearchBtn.style.display = 'none';
        gridState.normalSearchQuery = '';
        gridState.isNormalSearchActive = false;

        // Clear visible filters
        visibleDepartmentFilter.value = '';
        visibleStatusFilter.value = '';
        visibleDesignationFilter.value = '';
        gridState.visibleFilters.department = '';
        gridState.visibleFilters.status = '';
        gridState.visibleFilters.designation = '';

        // Update grid
        renderGrid();
        updatePagination();

        // Hide active filters
        activeFiltersContainer.style.display = 'none';
        activeFiltersTags.innerHTML = '';
    });

    // Update active filters display
    function updateActiveFiltersDisplay() {
        if (gridState.appliedFilters.length === 0) {
            activeFiltersContainer.style.display = 'none';
            return;
        }

        activeFiltersContainer.style.display = 'block';
        activeFiltersTags.innerHTML = '';

        // Create a map to track unique filters by their key properties
        const uniqueFilters = new Map();

        // Process filters to identify and handle duplicates
        gridState.appliedFilters.forEach((filter, index) => {
            // Create a unique key for each filter based on column, operator, and value
            const filterKey = `${filter.column}|${filter.operator}|${filter.value.toLowerCase()}`;

            // If this is a duplicate, skip it in the display
            if (uniqueFilters.has(filterKey)) {
                return;
            }

            // Mark this filter as seen
            uniqueFilters.set(filterKey, index);

            // Create the filter tag
            const filterTag = document.createElement('span');
            filterTag.className = 'filter-tag';
            filterTag.dataset.index = index;

            // Create filter text
            let filterText = filter.displayText;
            if (index > 0) {
                // Extract the condition part (AND/OR) from the beginning
                const parts = filterText.split(' ');
                const condition = parts[0];
                filterText = parts.slice(1).join(' ');

                // Add condition as a prefix
                filterTag.setAttribute('data-condition', condition);
            }

            filterTag.textContent = filterText;

            // Add remove button
            const removeBtn = document.createElement('span');
            removeBtn.className = 'remove';
            removeBtn.textContent = '×';
            removeBtn.addEventListener('click', () => {
                removeFilter(index);
            });

            filterTag.appendChild(removeBtn);
            activeFiltersTags.appendChild(filterTag);
        });
    }

    // Remove filter
    function removeFilter(index) {
        // Remove filter
        gridState.appliedFilters.splice(index, 1);

        // Update filters
        if (gridState.appliedFilters.length > 0) {
            // Reapply filters
            gridState.filteredData = filterData(gridState.data, gridState.appliedFilters);
        } else {
            // No filters, show all data
            gridState.filteredData = [...gridState.data];
        }

        // Apply normal search if active
        if (gridState.isNormalSearchActive && gridState.normalSearchQuery) {
            const query = gridState.normalSearchQuery.toLowerCase();
            gridState.filteredData = gridState.filteredData.filter(item => {
                return Object.values(item).some(value =>
                    value.toString().toLowerCase().includes(query)
                );
            });
        }

        // Apply current sort if one exists
        if (gridState.sortColumn) {
            sortData();
        }

        // Update grid
        renderGrid();
        updatePagination();

        // Update active filters display
        updateActiveFiltersDisplay();
    }

    // Edit filter
    function editFilter(index) {
        // Get the filter to edit
        const filter = gridState.appliedFilters[index];

        // Clear any previous editing states
        const allFilterItems = document.querySelectorAll('.filter-item');
        allFilterItems.forEach(item => {
            item.classList.remove('editing');
        });

        // Mark the current filter as being edited
        const filterItem = document.querySelector(`.filter-item[data-index="${index}"]`);
        if (filterItem) {
            filterItem.classList.add('editing');
        }

        // Populate the form with the filter values
        selectColumn.value = filter.column;
        selectOperator.value = filter.operator;
        valueInput.value = filter.value;

        // If it's not the first filter, set the condition
        if (index > 0) {
            selectCondition.value = filter.condition;
        } else {
            selectCondition.value = '';
        }

        // Store original values for comparison
        const originalValues = {
            column: filter.column,
            operator: filter.operator,
            value: filter.value,
            condition: index > 0 ? filter.condition : ''
        };

        // Remove any existing Save Changes button
        let existingSaveBtn = document.getElementById('saveChangesBtn');
        if (existingSaveBtn) {
            existingSaveBtn.remove();
        }

        // Create a Save Changes button but don't show it yet
        const saveChangesBtn = document.createElement('button');
        saveChangesBtn.id = 'saveChangesBtn';
        saveChangesBtn.className = 'btn primary';
        saveChangesBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
        saveChangesBtn.style.marginLeft = '10px';
        saveChangesBtn.style.backgroundColor = '#38a169';
        saveChangesBtn.style.borderColor = '#2f855a';
        saveChangesBtn.style.display = 'none'; // Hide initially

        // Insert after Add Filter button
        addFilterBtn.parentNode.insertBefore(saveChangesBtn, addFilterBtn.nextSibling);

        // Store the index of the filter being edited and original values
        saveChangesBtn.dataset.editIndex = index;
        saveChangesBtn.dataset.originalColumn = originalValues.column;
        saveChangesBtn.dataset.originalOperator = originalValues.operator;
        saveChangesBtn.dataset.originalValue = originalValues.value;
        saveChangesBtn.dataset.originalCondition = originalValues.condition;

        // Function to check if values have changed
        const checkForChanges = () => {
            const currentColumn = selectColumn.value;
            const currentOperator = selectOperator.value;
            const currentValue = valueInput.value.trim();
            const currentCondition = index > 0 ? selectCondition.value : '';

            // Check if any value has changed
            const hasChanges =
                currentColumn !== originalValues.column ||
                currentOperator !== originalValues.operator ||
                currentValue !== originalValues.value ||
                currentCondition !== originalValues.condition;

            // Show/hide the Save Changes button based on whether changes were made
            saveChangesBtn.style.display = hasChanges ? 'block' : 'none';
        };

        // Add event listeners to detect changes
        const changeListener = () => checkForChanges();
        const inputListener = () => checkForChanges();

        selectColumn.addEventListener('change', changeListener);
        selectOperator.addEventListener('change', changeListener);
        valueInput.addEventListener('input', inputListener);
        if (index > 0) {
            selectCondition.addEventListener('change', changeListener);
        }

        // Store the event listeners on the button so we can remove them later
        saveChangesBtn.changeListeners = {
            column: changeListener,
            operator: changeListener,
            value: inputListener,
            condition: changeListener
        };

        // Add event listener to save changes
        saveChangesBtn.onclick = function() {
            const editIndex = parseInt(this.dataset.editIndex);

            // Get the updated values
            const column = selectColumn.value;
            const operator = selectOperator.value;
            const value = valueInput.value.trim();
            const condition = index > 0 ? selectCondition.value : '';

            // Validate inputs
            if (!column || !operator || !value) {
                showToast('Please select column, operator, and enter a value.', 'error');
                return;
            }

            // Check for duplicate filters (excluding the current filter being edited)
            const isDuplicate = gridState.appliedFilters.some((filter, idx) =>
                idx !== editIndex &&
                filter.column === column &&
                filter.operator === operator &&
                filter.value.toLowerCase() === value.toLowerCase()
            );

            if (isDuplicate) {
                showToast('Duplicate filter detected! Another filter with the same column, operator, and value already exists.', 'error');
                return;
            }

            // Get readable names for display
            const columnText = selectColumn.options[selectColumn.selectedIndex].text;
            const operatorText = selectOperator.options[selectOperator.selectedIndex].text;
            const conditionText = condition ? selectCondition.options[selectCondition.selectedIndex].text : '';

            // Update the filter
            filter.column = column;
            filter.operator = operator;
            filter.value = value;

            if (index > 0) {
                filter.condition = condition;
                filter.displayText = `${conditionText} ${columnText} ${operatorText} "${value}"`;
            } else {
                filter.displayText = `${columnText} ${operatorText} "${value}"`;
            }

            // Update the display
            updateFiltersDisplay();

            // Clear the form
            valueInput.value = '';

            // If there are filters, automatically select "OR" condition for the next filter
            if (gridState.appliedFilters.length > 0) {
                selectCondition.value = 'or';
            }

            // Remove the editing class from all filter items
            const allFilterItems = document.querySelectorAll('.filter-item');
            allFilterItems.forEach(item => {
                item.classList.remove('editing');
            });

            // Remove event listeners
            selectColumn.removeEventListener('change', saveChangesBtn.changeListeners.column);
            selectOperator.removeEventListener('change', saveChangesBtn.changeListeners.operator);
            valueInput.removeEventListener('input', saveChangesBtn.changeListeners.value);
            if (index > 0) {
                selectCondition.removeEventListener('change', saveChangesBtn.changeListeners.condition);
            }

            // Remove the Save Changes button
            saveChangesBtn.remove();

            // No success notification for updating filters
        };
    }

    // Filter data based on applied filters
    function filterData(data, filters) {
        return data.filter(item => {
            let result = true;
            let prevCondition = null;

            filters.forEach((filter, index) => {
                const { column, operator, value, condition } = filter;
                let matches = false;

                // Apply operator logic
                switch (operator) {
                    case 'equal':
                        matches = item[column].toLowerCase() === value.toLowerCase();
                        break;
                    case 'notEqual':
                        matches = item[column].toLowerCase() !== value.toLowerCase();
                        break;
                    case 'like':
                        matches = item[column].toLowerCase().includes(value.toLowerCase());
                        break;
                    case 'contains':
                        matches = item[column].toLowerCase().indexOf(value.toLowerCase()) !== -1;
                        break;
                }

                // Apply condition logic (AND/OR)
                if (index === 0) {
                    // First filter sets the initial result
                    result = matches;
                } else {
                    // For subsequent filters, use the condition from the CURRENT filter
                    // not the previous one (this was the bug)
                    if (condition === 'and') {
                        result = result && matches;
                    } else if (condition === 'or') {
                        result = result || matches;
                    }
                }
            });

            return result;
        });
    }

    // Switch to mobile view button click
    switchToMobileBtn.addEventListener('click', function() {
        gridState.isMobileView = !gridState.isMobileView;

        if (gridState.isMobileView) {
            // Switch to mobile view
            container.classList.add('mobile-view');
            switchToMobileBtn.innerHTML = '<i class="fas fa-desktop"></i> Switch to Desktop View';
        } else {
            // Switch back to desktop view
            container.classList.remove('mobile-view');
            switchToMobileBtn.innerHTML = '<i class="fas fa-mobile-alt"></i> Switch to Mobile Device';
        }

        // Re-render the grid with the new view
        renderGrid();
        updatePagination();
    });

    // Initialize the grid
    initGrid();
});
