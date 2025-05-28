/**
 * Search Module - Part 3
 * Additional functionality for the search module
 */

// Get advanced options HTML
function getAdvancedOptionsHTML(options) {
    return `
        <div class="advanced-search-active">
            <div class="advanced-search-tags">
                ${options.category && options.category !== 'all' ? 
                    `<span class="advanced-search-tag">Category: ${getCategoryName(options.category)}</span>` : ''}
                ${options.dateRange && options.dateRange !== 'all' ? 
                    `<span class="advanced-search-tag">Date: ${getDateRangeName(options.dateRange)}</span>` : ''}
                ${options.exactMatch ? 
                    `<span class="advanced-search-tag">Exact Match</span>` : ''}
            </div>
            <button class="clear-advanced-search">Clear Filters</button>
        </div>
    `;
}

// Get category name
function getCategoryName(category) {
    switch (category) {
        case 'kb': return 'Knowledge Base';
        case 'tickets': return 'Support Tickets';
        case 'documents': return 'Documents';
        default: return 'All Categories';
    }
}

// Get date range name
function getDateRangeName(dateRange) {
    switch (dateRange) {
        case 'day': return 'Last 24 Hours';
        case 'week': return 'Last Week';
        case 'month': return 'Last Month';
        default: return 'All Time';
    }
}

// Get search results HTML
function getSearchResults(query, filter = 'all', advancedOptions = null) {
    // Get all content
    let allResults = getAllSearchableContent();
    
    // Apply advanced filters if provided
    if (advancedOptions) {
        // Filter by category
        if (advancedOptions.category && advancedOptions.category !== 'all') {
            const categoryMap = { 'kb': 'kb', 'tickets': 'ticket', 'documents': 'document' };
            allResults = allResults.filter(result => result.category === categoryMap[advancedOptions.category]);
        }
        
        // Filter by date range
        if (advancedOptions.dateRange && advancedOptions.dateRange !== 'all') {
            const now = new Date();
            let cutoffDate;
            
            switch (advancedOptions.dateRange) {
                case 'day':
                    cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                    break;
                case 'week':
                    cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    break;
                case 'month':
                    cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    break;
                default:
                    cutoffDate = new Date(0); // Beginning of time
            }
            
            allResults = allResults.filter(result => new Date(result.date) >= cutoffDate);
        }
        
        // Apply exact match if selected
        if (advancedOptions.exactMatch) {
            allResults = allResults.filter(result => {
                const titleExact = result.title.toLowerCase() === query.toLowerCase();
                const contentExact = result.content && result.content.toLowerCase() === query.toLowerCase();
                return titleExact || contentExact;
            });
        }
    }
    
    // Filter by category if specified
    if (filter !== 'all') {
        allResults = allResults.filter(result => {
            if (filter === 'kb' && result.category === 'kb') return true;
            if (filter === 'tickets' && result.category === 'ticket') return true;
            if (filter === 'documents' && result.category === 'document') return true;
            return false;
        });
    }
    
    // Filter by query
    const searchResults = allResults.filter(result => {
        // Skip if already filtered by exact match
        if (advancedOptions && advancedOptions.exactMatch) return true;
        
        const titleMatch = result.title.toLowerCase().includes(query.toLowerCase());
        const contentMatch = result.content && result.content.toLowerCase().includes(query.toLowerCase());
        return titleMatch || contentMatch;
    });
    
    // If no results
    if (searchResults.length === 0) {
        return '<div class="no-results">No results found for "' + query + '"</div>';
    }
    
    // Highlight query in results
    const highlightedResults = searchResults.map(result => {
        const highlightedTitle = highlightText(result.title, query);
        const highlightedContent = highlightText(result.content, query);
        
        return `
            <div class="search-result" data-id="${result.id}">
                <div class="search-result-header">
                    <h4 class="search-result-title">${highlightedTitle}</h4>
                    <span class="search-result-category ${result.category}" data-category="${result.category}">${result.categoryName}</span>
                </div>
                <div class="search-result-content">${highlightedContent}</div>
                <div class="search-result-meta">
                    <span>Last updated: ${formatDate(result.date)}</span>
                    <span>Click to view</span>
                </div>
            </div>
        `;
    });
    
    return highlightedResults.join('');
}

// Format date for display
function formatDate(date) {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffDay > 30) {
        return date.toLocaleDateString();
    } else if (diffDay > 0) {
        return diffDay === 1 ? 'Yesterday' : diffDay + ' days ago';
    } else if (diffHour > 0) {
        return diffHour + ' hours ago';
    } else if (diffMin > 0) {
        return diffMin + ' minutes ago';
    } else {
        return 'Just now';
    }
}

// Highlight text with search query
function highlightText(text, query) {
    if (!query || !text) return text;
    
    const regex = new RegExp(query, 'gi');
    return text.replace(regex, match => `<span class="search-highlight">${match}</span>`);
}

// Set up search modal event listeners
function setupSearchModalEventListeners(query, advancedOptions = null) {
    // Close modal
    const closeBtn = document.querySelector('#search-results-modal .modal-close');
    const modalOverlay = document.getElementById('search-results-modal');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modalOverlay.remove();
        });
    }
    
    // Close modal when clicking outside
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                modalOverlay.remove();
            }
        });
    }
    
    // Filter buttons
    const filterButtons = document.querySelectorAll('.search-filter');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter
            const filter = this.getAttribute('data-filter');
            
            // Update search results
            updateSearchResults(query, filter, advancedOptions);
        });
    });
    
    // Clear advanced search button
    const clearAdvancedBtn = document.querySelector('.clear-advanced-search');
    if (clearAdvancedBtn) {
        clearAdvancedBtn.addEventListener('click', function() {
            // Show search results without advanced options
            modalOverlay.remove();
            showSearchResultsModal(query);
        });
    }
    
    // Search result click
    const searchResults = document.querySelectorAll('.search-result');
    searchResults.forEach(result => {
        result.addEventListener('click', function() {
            const category = this.querySelector('.search-result-category').getAttribute('data-category');
            const id = this.getAttribute('data-id');
            
            // Navigate to the appropriate page
            navigateToResult(category, id);
            
            // Close modal
            modalOverlay.remove();
        });
    });
}
