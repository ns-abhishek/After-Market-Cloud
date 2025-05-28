/**
 * Search Module
 * Handles global search functionality across the customer portal
 * 
 * This file combines all search functionality from search.js, search-part2.js,
 * search-part3.js, and search-part4.js into a single file.
 */

// Initialize search module
document.addEventListener('DOMContentLoaded', function() {
    // Set up search functionality
    setupSearch();
    
    // Check for URL parameters (for search results navigation)
    checkUrlParameters();
});

// Set up search functionality
function setupSearch() {
    // Get search elements
    const searchContainer = document.querySelector('.search-container');
    const searchInput = document.querySelector('.search-container input');
    const searchButton = document.querySelector('.search-container button');
    
    if (!searchContainer || !searchInput || !searchButton) return;
    
    // Add search suggestions container
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'search-suggestions';
    searchContainer.appendChild(suggestionsContainer);
    
    // Add search event listeners
    searchButton.addEventListener('click', function() {
        performSearch(searchInput.value);
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
        }
    });
    
    // Add input event for real-time suggestions
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        if (query.length >= 2) {
            showSearchSuggestions(query, suggestionsContainer);
        } else {
            suggestionsContainer.innerHTML = '';
            suggestionsContainer.style.display = 'none';
        }
    });
    
    // Close suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchContainer.contains(e.target)) {
            suggestionsContainer.innerHTML = '';
            suggestionsContainer.style.display = 'none';
        }
    });
    
    // Add search styles
    addSearchStyles();
}

// Add search styles
function addSearchStyles() {
    // Create style element if it doesn't exist
    let styleElement = document.getElementById('search-styles');
    
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'search-styles';
        document.head.appendChild(styleElement);
        
        // Add styles
        styleElement.textContent = `
            .search-container {
                position: relative;
            }
            
            .search-suggestions {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background-color: white;
                border-radius: 4px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                margin-top: 5px;
                z-index: 100;
                max-height: 300px;
                overflow-y: auto;
                display: none;
            }
            
            .search-suggestion {
                padding: 10px 15px;
                cursor: pointer;
                transition: background-color 0.3s ease;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .search-suggestion:hover {
                background-color: #f5f5f5;
            }
            
            .suggestion-category {
                font-size: 12px;
                padding: 2px 8px;
                border-radius: 10px;
                background-color: #f0f0f0;
                color: #666;
            }
            
            .suggestion-category.kb {
                background-color: #e6f7ff;
                color: #1890ff;
            }
            
            .suggestion-category.ticket {
                background-color: #fff7e6;
                color: #fa8c16;
            }
            
            .suggestion-category.document {
                background-color: #f6ffed;
                color: #52c41a;
            }
            
            .search-history-header {
                padding: 10px 15px;
                font-size: 12px;
                color: #666;
                background-color: #f9f9f9;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .clear-history {
                font-size: 12px;
                color: #1890ff;
                cursor: pointer;
                background: none;
                border: none;
                padding: 0;
            }
            
            .search-history-item {
                padding: 10px 15px;
                cursor: pointer;
                transition: background-color 0.3s ease;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .search-history-item:hover {
                background-color: #f5f5f5;
            }
            
            .search-history-item i {
                color: #999;
            }
            
            .advanced-search-toggle {
                padding: 10px 15px;
                font-size: 12px;
                color: #1890ff;
                cursor: pointer;
                background-color: #f9f9f9;
                text-align: center;
                border-top: 1px solid #f0f0f0;
            }
            
            .advanced-search-toggle:hover {
                background-color: #f0f0f0;
            }
            
            .advanced-search-options {
                padding: 15px;
                border-top: 1px solid #f0f0f0;
            }
            
            .advanced-search-option {
                margin-bottom: 10px;
            }
            
            .advanced-search-option label {
                display: block;
                margin-bottom: 5px;
                font-size: 12px;
                color: #666;
            }
            
            .advanced-search-option select,
            .advanced-search-option input {
                width: 100%;
                padding: 8px;
                border: 1px solid #e0e0e0;
                border-radius: 4px;
                font-size: 14px;
            }
            
            .search-highlight {
                background-color: #fffbe6;
                padding: 0 2px;
            }
        `;
    }
}

// Show search suggestions
function showSearchSuggestions(query, container) {
    // Get search history
    const searchHistory = getSearchHistory();
    
    // Get search suggestions
    const suggestions = getSearchSuggestions(query);
    
    // Create suggestions HTML
    let suggestionsHTML = '';
    
    // Add search history if available
    if (searchHistory.length > 0) {
        suggestionsHTML += `
            <div class="search-history-header">
                Recent Searches
                <button class="clear-history">Clear</button>
            </div>
        `;
        
        // Add history items that match the query
        const matchingHistory = searchHistory.filter(item => 
            item.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 3);
        
        if (matchingHistory.length > 0) {
            matchingHistory.forEach(item => {
                suggestionsHTML += `
                    <div class="search-history-item" data-query="${item}">
                        <i class="fas fa-history"></i>
                        <span>${highlightText(item, query)}</span>
                    </div>
                `;
            });
        }
    }
    
    // Add suggestions
    if (suggestions.length > 0) {
        suggestions.forEach(suggestion => {
            suggestionsHTML += `
                <div class="search-suggestion" data-id="${suggestion.id}" data-category="${suggestion.category}">
                    <span>${highlightText(suggestion.title, query)}</span>
                    <span class="suggestion-category ${suggestion.category}">${suggestion.categoryName}</span>
                </div>
            `;
        });
    }
    
    // Add advanced search option
    suggestionsHTML += `
        <div class="advanced-search-toggle">
            Advanced Search Options
        </div>
    `;
    
    // Update container
    container.innerHTML = suggestionsHTML;
    container.style.display = 'block';
    
    // Add event listeners
    setupSuggestionEventListeners(container, query);
}

// Set up suggestion event listeners
function setupSuggestionEventListeners(container, query) {
    // History item click
    const historyItems = container.querySelectorAll('.search-history-item');
    historyItems.forEach(item => {
        item.addEventListener('click', function() {
            const historyQuery = this.getAttribute('data-query');
            document.querySelector('.search-container input').value = historyQuery;
            performSearch(historyQuery);
        });
    });
    
    // Clear history button
    const clearHistoryBtn = container.querySelector('.clear-history');
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            clearSearchHistory();
            container.innerHTML = '';
            container.style.display = 'none';
        });
    }
    
    // Suggestion click
    const suggestions = container.querySelectorAll('.search-suggestion');
    suggestions.forEach(suggestion => {
        suggestion.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const category = this.getAttribute('data-category');
            
            // Add to search history
            addToSearchHistory(query);
            
            // Navigate to result
            navigateToResult(category, id);
        });
    });
    
    // Advanced search toggle
    const advancedSearchToggle = container.querySelector('.advanced-search-toggle');
    if (advancedSearchToggle) {
        advancedSearchToggle.addEventListener('click', function() {
            showAdvancedSearchOptions(container);
        });
    }
}
