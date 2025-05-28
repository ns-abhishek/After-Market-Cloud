/**
 * Knowledge Base Module
 * Handles knowledge base functionality including category filtering and article viewing
 */

// Initialize knowledge base module
document.addEventListener('DOMContentLoaded', function() {
    // Set up category view buttons
    setupCategoryViewButtons();

    // Set up filter button
    setupFilterButton();

    // Set up article search
    setupArticleSearch();

    // Ensure theme is applied to all elements
    ensureThemeConsistency();
});

/**
 * Ensure theme consistency across all elements
 */
function ensureThemeConsistency() {
    // Get current theme
    const currentTheme = getUserPreference('dashboardTheme', 'default');
    const isDarkMode = currentTheme === 'dark';

    if (isDarkMode) {
        // Force dark mode on all elements
        document.querySelectorAll('.kb-category, .kb-articles, .kb-article, .kb-tag').forEach(el => {
            el.classList.add('dark-mode-element');
        });

        // Add a style tag for additional dark mode fixes
        const styleTag = document.createElement('style');
        styleTag.textContent = `
            .dark-mode-element {
                background-color: var(--widget-bg) !important;
                color: var(--text-color) !important;
                border-color: var(--border-color) !important;
            }
            .dark-mode a {
                color: var(--primary-color) !important;
            }
            .dark-mode .kb-article p {
                color: var(--text-color) !important;
            }
        `;
        document.head.appendChild(styleTag);
    }
}

/**
 * Set up category view buttons
 * This makes the "View Articles" buttons filter articles by category
 */
function setupCategoryViewButtons() {
    const viewButtons = document.querySelectorAll('.kb-category a.btn-secondary');

    viewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            // Get category name from parent element
            const categoryElement = this.closest('.kb-category');
            const categoryName = categoryElement.querySelector('h3').textContent;

            // Scroll to articles section
            const articlesSection = document.querySelector('.kb-articles');
            articlesSection.scrollIntoView({ behavior: 'smooth' });

            // Update header to show we're filtering
            const articlesHeader = document.querySelector('.kb-articles-header h3');
            articlesHeader.textContent = `${categoryName} Articles`;

            // Filter articles
            filterArticlesByCategory(categoryName);

            // Highlight the selected category
            document.querySelectorAll('.kb-category').forEach(cat => {
                cat.classList.remove('active');
            });
            categoryElement.classList.add('active');

            // Show reset filter button if it exists
            const resetFilterBtn = document.getElementById('reset-kb-filter');
            if (resetFilterBtn) {
                resetFilterBtn.style.display = 'inline-block';
            }
        });
    });
}

/**
 * Filter articles by category
 * @param {string} category - Category name to filter by
 */
function filterArticlesByCategory(category) {
    const articles = document.querySelectorAll('.kb-article');
    let visibleCount = 0;

    articles.forEach(article => {
        // Get article tags
        const tags = Array.from(article.querySelectorAll('.kb-tag')).map(tag => tag.textContent.toLowerCase());

        // Check if article matches category
        const matchesCategory = categoryMatchesTags(category, tags);

        // Show/hide article
        if (matchesCategory) {
            article.style.display = '';
            visibleCount++;
        } else {
            article.style.display = 'none';
        }
    });

    // Show message if no articles found
    const noResultsElement = document.querySelector('.kb-no-results');
    if (visibleCount === 0) {
        if (!noResultsElement) {
            const noResults = document.createElement('div');
            noResults.className = 'kb-no-results';
            noResults.innerHTML = `
                <p>No articles found in the "${category}" category.</p>
                <button class="btn-secondary" id="reset-kb-filter">Show All Articles</button>
            `;

            const articleList = document.querySelector('.kb-article-list');
            articleList.appendChild(noResults);

            // Add event listener to reset button
            document.getElementById('reset-kb-filter').addEventListener('click', resetArticleFilter);
        } else {
            noResultsElement.style.display = 'block';
            noResultsElement.querySelector('p').textContent = `No articles found in the "${category}" category.`;
        }
    } else if (noResultsElement) {
        noResultsElement.style.display = 'none';
    }
}

/**
 * Check if category matches any of the tags
 * @param {string} category - Category name
 * @param {Array} tags - Array of tag names
 * @returns {boolean} Whether the category matches any tag
 */
function categoryMatchesTags(category, tags) {
    // Normalize category name
    category = category.toLowerCase();

    // Special case for "FAQs" category
    if (category === 'faqs') {
        return tags.includes('faq') || tags.some(tag => tag.includes('question'));
    }

    // Map category names to related tags
    const categoryMap = {
        'products': ['product', 'feature', 'specification', 'guide'],
        'services': ['service', 'implementation', 'practice', 'api'],
        'troubleshooting': ['troubleshooting', 'issue', 'problem', 'error', 'support']
    };

    // Check if category is in our map
    if (categoryMap[category]) {
        // Check if any tag matches any of the related tags
        return tags.some(tag =>
            categoryMap[category].some(relatedTag =>
                tag.includes(relatedTag) || relatedTag.includes(tag)
            )
        );
    }

    // Direct match check
    return tags.some(tag => tag.includes(category) || category.includes(tag));
}

/**
 * Reset article filter to show all articles
 */
function resetArticleFilter() {
    // Show all articles
    document.querySelectorAll('.kb-article').forEach(article => {
        article.style.display = '';
    });

    // Reset header
    const articlesHeader = document.querySelector('.kb-articles-header h3');
    articlesHeader.textContent = 'Recent Articles';

    // Hide no results message
    const noResultsElement = document.querySelector('.kb-no-results');
    if (noResultsElement) {
        noResultsElement.style.display = 'none';
    }

    // Remove active class from categories
    document.querySelectorAll('.kb-category').forEach(cat => {
        cat.classList.remove('active');
    });

    // Hide reset filter button
    const resetFilterBtn = document.getElementById('reset-kb-filter');
    if (resetFilterBtn) {
        resetFilterBtn.style.display = 'none';
    }
}

/**
 * Set up filter button
 * This adds functionality to the filter button in the page header
 */
function setupFilterButton() {
    const filterButton = document.querySelector('.page-header .btn-secondary');

    if (!filterButton) return;

    filterButton.addEventListener('click', function() {
        // Create filter modal if it doesn't exist
        if (!document.getElementById('kb-filter-modal')) {
            createFilterModal();
        } else {
            // Show existing modal
            document.getElementById('kb-filter-modal').style.display = 'flex';
        }
    });
}

/**
 * Create filter modal
 */
function createFilterModal() {
    // Create modal element
    const modal = document.createElement('div');
    modal.id = 'kb-filter-modal';
    modal.className = 'modal-overlay';

    // Add modal content
    modal.innerHTML = `
        <div class="modal-container">
            <div class="modal-header">
                <h3>Filter Articles</h3>
                <button class="modal-close"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <div class="filter-section">
                    <h4>Categories</h4>
                    <div class="filter-options">
                        <label><input type="checkbox" name="category" value="all" checked> All Categories</label>
                        <label><input type="checkbox" name="category" value="products"> Products</label>
                        <label><input type="checkbox" name="category" value="services"> Services</label>
                        <label><input type="checkbox" name="category" value="faqs"> FAQs</label>
                        <label><input type="checkbox" name="category" value="troubleshooting"> Troubleshooting</label>
                    </div>
                </div>
                <div class="filter-section">
                    <h4>Date</h4>
                    <div class="filter-options">
                        <label><input type="radio" name="date" value="all" checked> All Time</label>
                        <label><input type="radio" name="date" value="week"> Last Week</label>
                        <label><input type="radio" name="date" value="month"> Last Month</label>
                        <label><input type="radio" name="date" value="year"> Last Year</label>
                    </div>
                </div>
                <div class="filter-actions">
                    <button class="btn-secondary" id="reset-filter">Reset</button>
                    <button class="btn-primary" id="apply-filter">Apply Filters</button>
                </div>
            </div>
        </div>
    `;

    // Add modal to the DOM
    document.body.appendChild(modal);

    // Add modal styles if they don't exist
    if (!document.getElementById('kb-modal-styles')) {
        addModalStyles();
    }

    // Add event listeners
    setupFilterModalEventListeners(modal);
}

/**
 * Add modal styles
 */
function addModalStyles() {
    const style = document.createElement('style');
    style.id = 'kb-modal-styles';
    style.textContent = `
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
        }

        .modal-container {
            background-color: white;
            border-radius: 8px;
            width: 90%;
            max-width: 500px;
            max-height: 80vh;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
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

        .filter-section {
            margin-bottom: 20px;
        }

        .filter-section h4 {
            margin-bottom: 10px;
            font-size: 16px;
            color: var(--accent-color);
        }

        .filter-options {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }

        .filter-options label {
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .filter-actions {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 20px;
        }

        .kb-category.active {
            border: 2px solid var(--primary-color);
            transform: translateY(-5px);
        }

        .kb-no-results {
            padding: 20px;
            text-align: center;
            color: var(--accent-color);
        }
    `;

    document.head.appendChild(style);
}

/**
 * Set up filter modal event listeners
 * @param {HTMLElement} modal - Modal element
 */
function setupFilterModalEventListeners(modal) {
    // Close button
    const closeButton = modal.querySelector('.modal-close');
    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Close when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Reset button
    const resetButton = modal.querySelector('#reset-filter');
    resetButton.addEventListener('click', function() {
        // Reset checkboxes and radio buttons
        modal.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = checkbox.value === 'all';
        });

        modal.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.checked = radio.value === 'all';
        });
    });

    // Apply button
    const applyButton = modal.querySelector('#apply-filter');
    applyButton.addEventListener('click', function() {
        // Get selected categories
        const selectedCategories = Array.from(modal.querySelectorAll('input[name="category"]:checked'))
            .map(checkbox => checkbox.value);

        // Get selected date
        const selectedDate = modal.querySelector('input[name="date"]:checked').value;

        // Apply filters
        applyArticleFilters(selectedCategories, selectedDate);

        // Close modal
        modal.style.display = 'none';
    });

    // Handle "All Categories" checkbox
    const allCategoriesCheckbox = modal.querySelector('input[value="all"]');
    allCategoriesCheckbox.addEventListener('change', function() {
        const categoryCheckboxes = modal.querySelectorAll('input[name="category"]:not([value="all"])');

        if (this.checked) {
            // Uncheck other categories
            categoryCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
                checkbox.disabled = true;
            });
        } else {
            // Enable other categories
            categoryCheckboxes.forEach(checkbox => {
                checkbox.disabled = false;
            });
        }
    });

    // Handle other category checkboxes
    const categoryCheckboxes = modal.querySelectorAll('input[name="category"]:not([value="all"])');
    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const allCategoriesCheckbox = modal.querySelector('input[value="all"]');

            if (this.checked) {
                // Uncheck "All Categories"
                allCategoriesCheckbox.checked = false;
            } else {
                // If no categories are checked, check "All Categories"
                const anyChecked = Array.from(categoryCheckboxes).some(cb => cb.checked);
                if (!anyChecked) {
                    allCategoriesCheckbox.checked = true;
                }
            }
        });
    });
}

/**
 * Apply article filters
 * @param {Array} categories - Selected categories
 * @param {string} date - Selected date filter
 */
function applyArticleFilters(categories, date) {
    const articles = document.querySelectorAll('.kb-article');
    let visibleCount = 0;

    // Update header
    const articlesHeader = document.querySelector('.kb-articles-header h3');
    if (categories.includes('all')) {
        articlesHeader.textContent = 'All Articles';
    } else {
        articlesHeader.textContent = `Filtered Articles (${categories.join(', ')})`;
    }

    // Filter articles
    articles.forEach(article => {
        // Get article tags
        const tags = Array.from(article.querySelectorAll('.kb-tag')).map(tag => tag.textContent.toLowerCase());

        // Get article date
        const dateText = article.querySelector('.kb-article-meta span').textContent;

        // Check if article matches filters
        const matchesCategory = categories.includes('all') ||
            categories.some(category => categoryMatchesTags(category, tags));

        const matchesDate = matchesDateFilter(dateText, date);

        // Show/hide article
        if (matchesCategory && matchesDate) {
            article.style.display = '';
            visibleCount++;
        } else {
            article.style.display = 'none';
        }
    });

    // Show message if no articles found
    const noResultsElement = document.querySelector('.kb-no-results');
    if (visibleCount === 0) {
        if (!noResultsElement) {
            const noResults = document.createElement('div');
            noResults.className = 'kb-no-results';
            noResults.innerHTML = `
                <p>No articles match your filter criteria.</p>
                <button class="btn-secondary" id="reset-kb-filter">Show All Articles</button>
            `;

            const articleList = document.querySelector('.kb-article-list');
            articleList.appendChild(noResults);

            // Add event listener to reset button
            document.getElementById('reset-kb-filter').addEventListener('click', resetArticleFilter);
        } else {
            noResultsElement.style.display = 'block';
            noResultsElement.querySelector('p').textContent = 'No articles match your filter criteria.';
        }
    } else if (noResultsElement) {
        noResultsElement.style.display = 'none';
    }

    // Show reset filter button
    if (!categories.includes('all') || date !== 'all') {
        const resetFilterBtn = document.getElementById('reset-kb-filter');
        if (resetFilterBtn) {
            resetFilterBtn.style.display = 'inline-block';
        } else {
            const resetBtn = document.createElement('button');
            resetBtn.id = 'reset-kb-filter';
            resetBtn.className = 'btn-secondary';
            resetBtn.textContent = 'Reset Filters';
            resetBtn.style.marginLeft = '10px';

            articlesHeader.parentNode.appendChild(resetBtn);
            resetBtn.addEventListener('click', resetArticleFilter);
        }
    }
}

/**
 * Check if article date matches date filter
 * @param {string} dateText - Article date text (e.g., "Updated: 2 days ago")
 * @param {string} filter - Date filter (all, week, month, year)
 * @returns {boolean} Whether the date matches the filter
 */
function matchesDateFilter(dateText, filter) {
    if (filter === 'all') return true;

    // Extract time period from date text
    const match = dateText.match(/(\d+)\s+(day|week|month|year)s?\s+ago/);
    if (!match) return true; // If we can't parse the date, include it

    const [, count, unit] = match;
    const numCount = parseInt(count, 10);

    // Check if date matches filter
    switch (filter) {
        case 'week':
            if (unit === 'day') return numCount <= 7;
            return false;
        case 'month':
            if (unit === 'day') return true;
            if (unit === 'week') return numCount <= 4;
            return false;
        case 'year':
            if (unit === 'day' || unit === 'week') return true;
            if (unit === 'month') return numCount <= 12;
            return false;
        default:
            return true;
    }
}

/**
 * Set up article search
 */
function setupArticleSearch() {
    const searchInput = document.querySelector('.kb-search input');
    const searchButton = document.querySelector('.kb-search button');

    if (!searchInput || !searchButton) return;

    // Search on button click
    searchButton.addEventListener('click', function() {
        searchArticles(searchInput.value);
    });

    // Search on Enter key
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchArticles(this.value);
        }
    });
}

/**
 * Search articles
 * @param {string} query - Search query
 */
function searchArticles(query) {
    if (!query.trim()) {
        // If query is empty, show all articles
        resetArticleFilter();
        return;
    }

    // Normalize query
    query = query.trim().toLowerCase();

    // Update header
    const articlesHeader = document.querySelector('.kb-articles-header h3');
    articlesHeader.textContent = `Search Results: "${query}"`;

    // Filter articles
    const articles = document.querySelectorAll('.kb-article');
    let visibleCount = 0;

    articles.forEach(article => {
        // Get article text
        const title = article.querySelector('h4').textContent.toLowerCase();
        const description = article.querySelector('p').textContent.toLowerCase();
        const tags = Array.from(article.querySelectorAll('.kb-tag')).map(tag => tag.textContent.toLowerCase());

        // Check if article matches query
        const matchesQuery =
            title.includes(query) ||
            description.includes(query) ||
            tags.some(tag => tag.includes(query));

        // Show/hide article
        if (matchesQuery) {
            article.style.display = '';
            visibleCount++;
        } else {
            article.style.display = 'none';
        }
    });

    // Show message if no articles found
    const noResultsElement = document.querySelector('.kb-no-results');
    if (visibleCount === 0) {
        if (!noResultsElement) {
            const noResults = document.createElement('div');
            noResults.className = 'kb-no-results';
            noResults.innerHTML = `
                <p>No articles found matching "${query}".</p>
                <button class="btn-secondary" id="reset-kb-filter">Show All Articles</button>
            `;

            const articleList = document.querySelector('.kb-article-list');
            articleList.appendChild(noResults);

            // Add event listener to reset button
            document.getElementById('reset-kb-filter').addEventListener('click', resetArticleFilter);
        } else {
            noResultsElement.style.display = 'block';
            noResultsElement.querySelector('p').textContent = `No articles found matching "${query}".`;
        }
    } else if (noResultsElement) {
        noResultsElement.style.display = 'none';
    }

    // Show reset filter button
    const resetFilterBtn = document.getElementById('reset-kb-filter');
    if (resetFilterBtn) {
        resetFilterBtn.style.display = 'inline-block';
    } else {
        const resetBtn = document.createElement('button');
        resetBtn.id = 'reset-kb-filter';
        resetBtn.className = 'btn-secondary';
        resetBtn.textContent = 'Reset Search';
        resetBtn.style.marginLeft = '10px';

        articlesHeader.parentNode.appendChild(resetBtn);
        resetBtn.addEventListener('click', resetArticleFilter);
    }
}
