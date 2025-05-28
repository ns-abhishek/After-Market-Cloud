/**
 * Search Module - Part 2
 * Additional functionality for the search module
 */

// Get search suggestions
function getSearchSuggestions(query) {
    // Get all searchable content
    const allContent = getAllSearchableContent();
    
    // Filter by query
    const filteredContent = allContent.filter(item => {
        const titleMatch = item.title.toLowerCase().includes(query.toLowerCase());
        const contentMatch = item.content && item.content.toLowerCase().includes(query.toLowerCase());
        return titleMatch || contentMatch;
    });
    
    // Return top 5 results
    return filteredContent.slice(0, 5);
}

// Get all searchable content
function getAllSearchableContent() {
    // This would ideally come from an API or database
    // For now, we'll use mock data
    return [
        {
            id: 'kb1',
            title: 'Getting Started with Our Platform',
            content: 'A comprehensive guide to help you get started with our platform and its features.',
            category: 'kb',
            categoryName: 'Knowledge Base',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
        },
        {
            id: 'kb2',
            title: 'How to Configure Your Account Settings',
            content: 'Learn how to configure your account settings for optimal performance and security.',
            category: 'kb',
            categoryName: 'Knowledge Base',
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 1 week ago
        },
        {
            id: 'kb3',
            title: 'Troubleshooting Common Issues',
            content: 'Solutions to the most common issues users encounter with our platform.',
            category: 'kb',
            categoryName: 'Knowledge Base',
            date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // 2 weeks ago
        },
        {
            id: 'kb4',
            title: 'API Documentation and Examples',
            content: 'Comprehensive documentation of our API with examples and use cases.',
            category: 'kb',
            categoryName: 'Knowledge Base',
            date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 1 month ago
        },
        {
            id: 'ticket1',
            title: 'Unable to access account settings',
            content: 'I\'m trying to change my password but the settings page is not loading correctly.',
            category: 'ticket',
            categoryName: 'Support Ticket',
            date: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
        },
        {
            id: 'ticket2',
            title: 'Feature request: Dark mode',
            content: 'Would it be possible to add a dark mode option to the portal?',
            category: 'ticket',
            categoryName: 'Support Ticket',
            date: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
        },
        {
            id: 'ticket3',
            title: 'Question about billing cycle',
            content: 'I have a question about when my subscription renews and how billing works.',
            category: 'ticket',
            categoryName: 'Support Ticket',
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
        },
        {
            id: 'doc1',
            title: 'Product Specifications.pdf',
            content: 'Detailed specifications for all our products and services.',
            category: 'document',
            categoryName: 'Document',
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
        },
        {
            id: 'doc2',
            title: 'User Guide.docx',
            content: 'Complete user guide with step-by-step instructions.',
            category: 'document',
            categoryName: 'Document',
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 1 week ago
        },
        {
            id: 'doc3',
            title: 'Financial Report.xlsx',
            content: 'Financial reports and analytics for the current quarter.',
            category: 'document',
            categoryName: 'Document',
            date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // 2 weeks ago
        }
    ];
}

// Perform search
function performSearch(query) {
    if (!query.trim()) return;
    
    // Add to search history
    addToSearchHistory(query);
    
    // Track search analytics
    trackSearchAnalytics(query);
    
    // Show search results modal
    showSearchResultsModal(query);
}

// Perform advanced search
function performAdvancedSearch(query, category, dateRange, exactMatch) {
    if (!query.trim()) return;
    
    // Add to search history
    addToSearchHistory(query);
    
    // Track search analytics
    trackSearchAnalytics(query, { category, dateRange, exactMatch });
    
    // Show search results modal with advanced options
    showSearchResultsModal(query, { category, dateRange, exactMatch });
}

// Show search results modal
function showSearchResultsModal(query, advancedOptions = null) {
    // Create search results HTML
    const searchResultsHTML = `
        <div class="modal-overlay" id="search-results-modal">
            <div class="modal-container">
                <div class="modal-header">
                    <h3>Search Results for "${query}"</h3>
                    <button class="modal-close"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <div class="search-filters">
                        <button class="search-filter active" data-filter="all">All Results</button>
                        <button class="search-filter" data-filter="kb">Knowledge Base</button>
                        <button class="search-filter" data-filter="tickets">Tickets</button>
                        <button class="search-filter" data-filter="documents">Documents</button>
                    </div>
                    
                    ${advancedOptions ? getAdvancedOptionsHTML(advancedOptions) : ''}
                    
                    <div class="search-results">
                        ${getSearchResults(query, 'all', advancedOptions)}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to the DOM
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = searchResultsHTML;
    document.body.appendChild(modalContainer.firstElementChild);
    
    // Add modal styles
    addSearchModalStyles();
    
    // Add event listeners
    setupSearchModalEventListeners(query, advancedOptions);
}
