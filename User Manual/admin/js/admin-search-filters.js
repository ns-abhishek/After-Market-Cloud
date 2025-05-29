/**
 * Admin Search and Filter Components
 * JavaScript functionality for the modern search and filter components
 */

document.addEventListener('DOMContentLoaded', function() {
    // Filter toggle functionality
    const filterToggles = document.querySelectorAll('.admin-filter-toggle');
    
    filterToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const isExpanded = this.classList.contains('expanded');
            const filterSection = this.closest('.admin-search-filter-container').querySelector('.admin-filter-section');
            
            if (isExpanded) {
                this.classList.remove('expanded');
                filterSection.classList.add('collapsed');
            } else {
                this.classList.add('expanded');
                filterSection.classList.remove('collapsed');
            }
        });
    });
    
    // Apply filters functionality
    const applyFilterButtons = document.querySelectorAll('[id^="apply-filters"]');
    
    applyFilterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const container = this.closest('.admin-search-filter-container');
            const activeFiltersSection = container.querySelector('[id^="active-filters"]');
            const filterTagsContainer = activeFiltersSection.querySelector('.active-filter-tags');
            const filterSelects = container.querySelectorAll('.admin-filter-select');
            
            // Clear existing filter tags
            filterTagsContainer.innerHTML = '';
            
            // Check if any filters are active
            let hasActiveFilters = false;
            
            // Create filter tags for each active filter
            filterSelects.forEach(select => {
                if (select.value) {
                    hasActiveFilters = true;
                    const selectedOption = select.options[select.selectedIndex];
                    const filterLabel = select.previousElementSibling.textContent;
                    const filterValue = selectedOption.textContent;
                    
                    // Create filter tag
                    const filterTag = document.createElement('div');
                    filterTag.className = 'filter-tag';
                    filterTag.innerHTML = `
                        <span class="filter-tag-label">${filterLabel}</span>
                        <span class="filter-tag-value">${filterValue}</span>
                        <button class="filter-tag-remove" data-filter-id="${select.id}">
                            <i class="fas fa-times"></i>
                        </button>
                    `;
                    
                    // Add filter tag to container
                    filterTagsContainer.appendChild(filterTag);
                    
                    // Add active class to the select
                    select.classList.add('active');
                }
            });
            
            // Show or hide active filters section
            if (hasActiveFilters) {
                activeFiltersSection.classList.remove('hidden');
            } else {
                activeFiltersSection.classList.add('hidden');
            }
            
            // Apply actual filtering logic here (this would depend on your specific implementation)
            // For demonstration purposes, we're just showing the filter tags
        });
    });
    
    // Clear all filters functionality
    const clearAllButtons = document.querySelectorAll('[id^="clear-filters"], .clear-all-filters');
    
    clearAllButtons.forEach(button => {
        button.addEventListener('click', function() {
            const container = this.closest('.admin-search-filter-container');
            const activeFiltersSection = container.querySelector('[id^="active-filters"]');
            const filterSelects = container.querySelectorAll('.admin-filter-select');
            
            // Reset all filter selects
            filterSelects.forEach(select => {
                select.value = '';
                select.classList.remove('active');
            });
            
            // Hide active filters section
            activeFiltersSection.classList.add('hidden');
            
            // Reset actual filtering logic here
        });
    });
    
    // Individual filter tag removal
    document.addEventListener('click', function(e) {
        if (e.target.closest('.filter-tag-remove')) {
            const removeButton = e.target.closest('.filter-tag-remove');
            const filterId = removeButton.getAttribute('data-filter-id');
            const filterTag = removeButton.closest('.filter-tag');
            const container = removeButton.closest('.admin-search-filter-container');
            const filterSelect = container.querySelector(`#${filterId}`);
            
            // Remove the filter tag
            filterTag.remove();
            
            // Reset the corresponding select
            if (filterSelect) {
                filterSelect.value = '';
                filterSelect.classList.remove('active');
            }
            
            // Check if there are any remaining filter tags
            const filterTagsContainer = removeButton.closest('.active-filter-tags');
            if (filterTagsContainer.children.length === 0) {
                const activeFiltersSection = removeButton.closest('[id^="active-filters"]');
                activeFiltersSection.classList.add('hidden');
            }
            
            // Update actual filtering logic here
        }
    });
    
    // Search functionality
    const searchInputs = document.querySelectorAll('[id$="-search"]');
    
    searchInputs.forEach(input => {
        input.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            // Implement search logic here
            // This would depend on your specific implementation
            console.log(`Searching for: ${searchTerm}`);
            
            // For demonstration purposes, we're just logging the search term
        });
    });
});
