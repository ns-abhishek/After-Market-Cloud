document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const modal = document.getElementById('advancedSearchModal');
    const openModalBtn = document.getElementById('openAdvancedSearch');
    const closeModalBtn = document.querySelector('.close');
    const selectColumn = document.getElementById('selectColumn');
    const selectOperator = document.getElementById('selectOperator');
    const valueInput = document.getElementById('valueInput');
    const selectCondition = document.getElementById('selectCondition');
    const addFilterBtn = document.getElementById('addFilterBtn');
    const filtersTextarea = document.getElementById('filtersTextarea');
    const searchBtn = document.getElementById('searchBtn');
    const resetBtn = document.getElementById('resetBtn');
    const resultsTable = document.getElementById('resultsTable');
    
    // Store applied filters
    let appliedFilters = [];
    
    // Sample data for demonstration
    const sampleData = [
        {
            employeeCode: 'EMP001',
            name: 'John Doe',
            mobile: '1234567890',
            email: 'john@example.com',
            department: 'Engineering',
            designation: 'Developer',
            isActive: 'Yes'
        },
        {
            employeeCode: 'EMP002',
            name: 'Jane Smith',
            mobile: '9876543210',
            email: 'jane@example.com',
            department: 'Marketing',
            designation: 'Manager',
            isActive: 'Yes'
        },
        {
            employeeCode: 'EMP003',
            name: 'Robert Johnson',
            mobile: '5551234567',
            email: 'robert@example.com',
            department: 'Sales',
            designation: 'Executive',
            isActive: 'Yes'
        },
        {
            employeeCode: 'EMP004',
            name: 'Emily Davis',
            mobile: '7778889999',
            email: 'emily@example.com',
            department: 'HR',
            designation: 'Coordinator',
            isActive: 'No'
        },
        {
            employeeCode: 'EMP005',
            name: 'Michael Brown',
            mobile: '3334445555',
            email: 'michael@example.com',
            department: 'Engineering',
            designation: 'Senior Developer',
            isActive: 'Yes'
        }
    ];
    
    // Open modal
    openModalBtn.addEventListener('click', function() {
        modal.style.display = 'block';
    });
    
    // Close modal
    closeModalBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Add filter
    addFilterBtn.addEventListener('click', function() {
        const column = selectColumn.value;
        const operator = selectOperator.value;
        const value = valueInput.value.trim();
        const condition = selectCondition.value;
        
        // Validate inputs
        if (!column || !operator || !value) {
            alert('Please select column, operator, and enter a value.');
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
        if (appliedFilters.length > 0 && condition) {
            filter.displayText = `${conditionText} ${filter.displayText}`;
        }
        
        // Add to filters array
        appliedFilters.push(filter);
        
        // Update filters display
        updateFiltersDisplay();
        
        // Clear inputs
        valueInput.value = '';
        
        // If it's not the first filter, condition is required for the next one
        if (appliedFilters.length > 0) {
            selectCondition.required = true;
        }
    });
    
    // Update filters display
    function updateFiltersDisplay() {
        if (appliedFilters.length === 0) {
            filtersTextarea.value = '';
            return;
        }
        
        // Create display text
        let displayText = '';
        appliedFilters.forEach((filter, index) => {
            displayText += filter.displayText;
            if (index < appliedFilters.length - 1) {
                displayText += '\n';
            }
        });
        
        filtersTextarea.value = displayText;
    }
    
    // Search button click
    searchBtn.addEventListener('click', function() {
        if (appliedFilters.length === 0) {
            alert('Please add at least one filter.');
            return;
        }
        
        // Apply filters to data
        const filteredData = filterData(sampleData, appliedFilters);
        
        // Update table with filtered data
        updateTable(filteredData);
        
        // Close modal
        modal.style.display = 'none';
    });
    
    // Reset button click
    resetBtn.addEventListener('click', function() {
        // Clear all filters
        appliedFilters = [];
        updateFiltersDisplay();
        
        // Reset form
        selectColumn.value = '';
        selectOperator.value = '';
        valueInput.value = '';
        selectCondition.value = '';
        
        // Reset table to show all data
        updateTable(sampleData);
    });
    
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
                }
                
                // Apply condition logic (AND/OR)
                if (index === 0) {
                    result = matches;
                } else {
                    if (prevCondition === 'and') {
                        result = result && matches;
                    } else if (prevCondition === 'or') {
                        result = result || matches;
                    }
                }
                
                prevCondition = condition;
            });
            
            return result;
        });
    }
    
    // Update table with filtered data
    function updateTable(data) {
        const tbody = resultsTable.querySelector('tbody');
        tbody.innerHTML = '';
        
        if (data.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 7;
            cell.textContent = 'No results found';
            cell.style.textAlign = 'center';
            row.appendChild(cell);
            tbody.appendChild(row);
            return;
        }
        
        data.forEach(item => {
            const row = document.createElement('tr');
            
            // Add cells for each property
            const properties = ['employeeCode', 'name', 'mobile', 'email', 'department', 'designation', 'isActive'];
            properties.forEach(prop => {
                const cell = document.createElement('td');
                cell.textContent = item[prop];
                row.appendChild(cell);
            });
            
            tbody.appendChild(row);
        });
    }
    
    // Initialize table with sample data
    updateTable(sampleData);
});
