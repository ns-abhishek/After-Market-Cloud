/**
 * Search Module - Part 4
 * Additional functionality for the search module
 */

// Update search results based on filter
function updateSearchResults(query, filter, advancedOptions = null) {
    const searchResultsContainer = document.querySelector('.search-results');
    
    if (!searchResultsContainer) return;
    
    // Get filtered results
    const results = getSearchResults(query, filter, advancedOptions);
    
    // Update container
    searchResultsContainer.innerHTML = results;
    
    // Add event listeners to new results
    const searchResults = document.querySelectorAll('.search-result');
    searchResults.forEach(result => {
        result.addEventListener('click', function() {
            const category = this.querySelector('.search-result-category').getAttribute('data-category');
            const id = this.getAttribute('data-id');
            
            // Navigate to the appropriate page
            navigateToResult(category, id);
            
            // Close modal
            document.getElementById('search-results-modal').remove();
        });
    });
}

// Navigate to search result
function navigateToResult(category, id) {
    // Get base URL
    const baseUrl = window.location.pathname.includes('/pages/') ? '' : 'pages/';
    
    switch (category) {
        case 'kb':
            window.location.href = baseUrl + 'knowledge-base.html?article=' + id;
            break;
        case 'ticket':
            window.location.href = baseUrl + 'tickets.html?ticket=' + id;
            break;
        case 'document':
            window.location.href = baseUrl + 'documents.html?document=' + id;
            break;
        default:
            console.error('Unknown category:', category);
    }
}

// Check URL parameters for search result navigation
function checkUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Check for article parameter
    const articleId = urlParams.get('article');
    if (articleId) {
        highlightArticle(articleId);
    }
    
    // Check for ticket parameter
    const ticketId = urlParams.get('ticket');
    if (ticketId) {
        highlightTicket(ticketId);
    }
    
    // Check for document parameter
    const documentId = urlParams.get('document');
    if (documentId) {
        highlightDocument(documentId);
    }
}

// Highlight article in knowledge base
function highlightArticle(articleId) {
    console.log('Highlighting article:', articleId);
    // Implementation would depend on the knowledge base structure
}

// Highlight ticket in tickets page
function highlightTicket(ticketId) {
    console.log('Highlighting ticket:', ticketId);
    // Implementation would depend on the tickets page structure
}

// Highlight document in documents page
function highlightDocument(documentId) {
    console.log('Highlighting document:', documentId);
    // Implementation would depend on the documents page structure
}

// Add search modal styles
function addSearchModalStyles() {
    // Create style element if it doesn't exist
    let styleElement = document.getElementById('search-modal-styles');
    
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'search-modal-styles';
        document.head.appendChild(styleElement);
        
        // Add styles
        styleElement.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                animation: fadeIn 0.3s ease;
            }
            
            .modal-container {
                background-color: white;
                border-radius: 8px;
                width: 90%;
                max-width: 800px;
                max-height: 80vh;
                overflow: hidden;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                animation: slideIn 0.3s ease;
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                border-bottom: 1px solid var(--border-color);
            }
            
            .modal-header h3 {
                margin: 0;
                font-size: 18px;
            }
            
            .modal-close {
                background: transparent;
                border: none;
                font-size: 16px;
                cursor: pointer;
                color: var(--accent-color);
            }
            
            .modal-body {
                padding: 20px;
                overflow-y: auto;
                max-height: calc(80vh - 60px);
            }
            
            .search-filters {
                display: flex;
                gap: 10px;
                margin-bottom: 20px;
                border-bottom: 1px solid var(--border-color);
                padding-bottom: 10px;
                flex-wrap: wrap;
            }
            
            .search-filter {
                background: transparent;
                border: none;
                padding: 8px 15px;
                cursor: pointer;
                border-radius: 20px;
                transition: var(--transition);
            }
            
            .search-filter:hover {
                background-color: #f0f0f0;
            }
            
            .search-filter.active {
                background-color: var(--primary-color);
                color: white;
            }
            
            .advanced-search-active {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding: 10px 15px;
                background-color: #f9f9f9;
                border-radius: 4px;
            }
            
            .advanced-search-tags {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            }
            
            .advanced-search-tag {
                padding: 5px 10px;
                background-color: #e6f7ff;
                color: #1890ff;
                border-radius: 20px;
                font-size: 12px;
            }
            
            .clear-advanced-search {
                background: transparent;
                border: none;
                color: #1890ff;
                cursor: pointer;
                font-size: 12px;
            }
            
            .search-results {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            
            .search-result {
                padding: 15px;
                border: 1px solid var(--border-color);
                border-radius: 8px;
                transition: var(--transition);
                cursor: pointer;
            }
            
            .search-result:hover {
                box-shadow: var(--shadow);
                transform: translateY(-2px);
            }
            
            .search-result-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }
            
            .search-result-title {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
            }
            
            .search-result-category {
                padding: 3px 8px;
                border-radius: 20px;
                font-size: 12px;
                background-color: #f0f0f0;
            }
            
            .search-result-category.kb {
                background-color: #e6f7ff;
                color: #1890ff;
            }
            
            .search-result-category.ticket {
                background-color: #fff7e6;
                color: #fa8c16;
            }
            
            .search-result-category.document {
                background-color: #f6ffed;
                color: #52c41a;
            }
            
            .search-result-content {
                margin-bottom: 10px;
                font-size: 14px;
                color: var(--text-color);
            }
            
            .search-result-meta {
                display: flex;
                justify-content: space-between;
                font-size: 12px;
                color: var(--accent-color);
            }
            
            .search-highlight {
                background-color: #fffbe6;
                padding: 0 2px;
            }
            
            .no-results {
                padding: 30px;
                text-align: center;
                color: var(--accent-color);
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideIn {
                from { transform: translateY(-20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
    }
}

// Get search history
function getSearchHistory() {
    const history = localStorage.getItem('searchHistory');
    return history ? JSON.parse(history) : [];
}

// Add to search history
function addToSearchHistory(query) {
    if (!query.trim()) return;
    
    // Get current history
    let history = getSearchHistory();
    
    // Remove if already exists
    history = history.filter(item => item.toLowerCase() !== query.toLowerCase());
    
    // Add to beginning
    history.unshift(query);
    
    // Limit to 10 items
    history = history.slice(0, 10);
    
    // Save to localStorage
    localStorage.setItem('searchHistory', JSON.stringify(history));
}

// Clear search history
function clearSearchHistory() {
    localStorage.removeItem('searchHistory');
}

// Track search analytics
function trackSearchAnalytics(query, options = {}) {
    // Get current analytics
    let analytics = localStorage.getItem('searchAnalytics');
    analytics = analytics ? JSON.parse(analytics) : { searches: [] };
    
    // Add new search
    analytics.searches.push({
        query,
        timestamp: new Date().toISOString(),
        options
    });
    
    // Limit to 100 searches
    if (analytics.searches.length > 100) {
        analytics.searches = analytics.searches.slice(-100);
    }
    
    // Save to localStorage
    localStorage.setItem('searchAnalytics', JSON.stringify(analytics));
    
    // In a real application, this would be sent to a server
    console.log('Search tracked:', query, options);
}
