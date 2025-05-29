/**
 * Modern UI JavaScript for ERP User Manual
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all UI components
    initializeNavigation();
    initializeSettingsMenu();
    initializeAccessibilityControls();
    initializeSearch();
    initializeTableOfContents();
    initializeFeedbackWidget();
    initializeLanguageSelector();
    initializeUserRoleSelection();
    initializeTooltips();
    trackRecentlyViewed();
});

/**
 * Initialize navigation functionality
 */
function initializeNavigation() {
    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.setAttribute('aria-expanded',
                navToggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
            );
        });
    }

    // Dropdown menus
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        const dropdownToggle = dropdown.querySelector('.dropdown-toggle');

        if (dropdownToggle) {
            // For mobile: click to toggle dropdown
            if (window.innerWidth < 768) {
                dropdownToggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                    dropdownToggle.setAttribute('aria-expanded',
                        dropdownToggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
                    );
                });
            }
        }
    });
}

/**
 * Initialize settings menu
 */
function initializeSettingsMenu() {
    const settingsToggle = document.querySelector('.settings-toggle');
    const settingsMenu = document.querySelector('.settings-menu');

    if (settingsToggle && settingsMenu) {
        // Toggle settings menu
        settingsToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            settingsMenu.classList.toggle('active');
        });

        // Close settings menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!settingsMenu.contains(e.target) && !settingsToggle.contains(e.target)) {
                settingsMenu.classList.remove('active');
            }
        });
    }
}

/**
 * Initialize accessibility controls
 */
function initializeAccessibilityControls() {
    // Font size controls
    const increaseFont = document.getElementById('increase-font');
    const decreaseFont = document.getElementById('decrease-font');
    const html = document.documentElement;

    // Get stored font size or use default
    let currentFontSize = localStorage.getItem('font-size') || 16;
    html.style.fontSize = currentFontSize + 'px';

    if (increaseFont) {
        increaseFont.addEventListener('click', function() {
            if (currentFontSize < 24) {
                currentFontSize = parseInt(currentFontSize) + 1;
                html.style.fontSize = currentFontSize + 'px';
                localStorage.setItem('font-size', currentFontSize);
            }
        });
    }

    if (decreaseFont) {
        decreaseFont.addEventListener('click', function() {
            if (currentFontSize > 12) {
                currentFontSize = parseInt(currentFontSize) - 1;
                html.style.fontSize = currentFontSize + 'px';
                localStorage.setItem('font-size', currentFontSize);
            }
        });
    }

    // Font family selection
    const fontOptions = document.querySelectorAll('.font-option');

    // Font family mapping to CSS variables
    const fontFamilies = {
        'sans-serif': 'var(--sans-serif-font)',
        'serif': 'var(--serif-font)',
        'monospace': 'var(--monospace-font)'
    };

    // Get stored font family preference or use default
    const storedFontFamily = localStorage.getItem('font-family') || 'sans-serif';

    // Apply initial font family
    applyFontFamily(storedFontFamily);

    // Mark the active font option
    if (fontOptions) {
        fontOptions.forEach(option => {
            if (option.dataset.font === storedFontFamily) {
                option.classList.add('active');
            }

            option.addEventListener('click', function() {
                const fontFamily = this.dataset.font;

                // Remove active class from all options
                fontOptions.forEach(opt => opt.classList.remove('active'));

                // Add active class to selected option
                this.classList.add('active');

                // Apply the selected font family
                applyFontFamily(fontFamily);

                // Save preference
                localStorage.setItem('font-family', fontFamily);
            });
        });
    }

    // Function to apply font family to the document
    function applyFontFamily(fontFamily) {
        if (fontFamilies[fontFamily]) {
            document.body.style.fontFamily = fontFamilies[fontFamily];
        }
    }

    // Theme toggle (dark/light) - only in header, not in settings menu
    const themeToggleBtn = document.getElementById('theme-toggle-btn');

    // Get stored theme preference or use system preference
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = localStorage.getItem('theme');
    const currentTheme = storedTheme || (prefersDarkScheme ? 'dark' : 'light');

    // Function to update theme icons and state
    function updateThemeState(isDark) {
        // Update theme toggle button icon - show the opposite icon of current theme
        // In light theme, show moon (to switch to dark)
        // In dark theme, show sun (to switch to light)
        if (themeToggleBtn) {
            themeToggleBtn.innerHTML = isDark ?
                '<i class="fas fa-sun"></i>' :
                '<i class="fas fa-moon"></i>';

            // Add aria-label for accessibility
            themeToggleBtn.setAttribute('aria-label', isDark ?
                'Switch to light theme' :
                'Switch to dark theme');
        }

        // Apply theme to document
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }

    // Apply initial theme
    updateThemeState(currentTheme === 'dark');

    // Add event listener to header theme toggle button
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const isDark = currentTheme !== 'dark';
            updateThemeState(isDark);
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }
}

/**
 * Initialize search functionality
 */
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchSuggestions = document.querySelector('.search-suggestions');
    const searchFilters = document.querySelector('.search-filters');
    const searchFilterItems = document.querySelectorAll('.search-filter');

    if (searchInput && searchButton) {
        // Search button click
        searchButton.addEventListener('click', function() {
            if (searchInput.value.trim() !== '') {
                performSearch(searchInput.value);
            }
        });

        // Enter key press in search input
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && searchInput.value.trim() !== '') {
                performSearch(searchInput.value);
            }
        });

        // Focus on search input
        searchInput.addEventListener('focus', function() {
            if (searchFilters) {
                searchFilters.classList.add('active');
            }
        });

        // Live search suggestions
        searchInput.addEventListener('input', function() {
            if (searchInput.value.trim().length > 2) {
                // Simulate getting search suggestions
                showSearchSuggestions(searchInput.value);
            } else if (searchSuggestions) {
                searchSuggestions.innerHTML = '';
            }
        });

        // Close search filters when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !searchFilters.contains(e.target)) {
                searchFilters.classList.remove('active');
            }
        });
    }

    // Search filters
    if (searchFilterItems) {
        searchFilterItems.forEach(filter => {
            filter.addEventListener('click', function() {
                searchFilterItems.forEach(f => f.classList.remove('active'));
                filter.classList.add('active');

                // If there's a search term, update results based on filter
                if (searchInput && searchInput.value.trim() !== '') {
                    performSearch(searchInput.value, filter.dataset.filter);
                }
            });
        });
    }
}

/**
 * Perform search with the given query and optional filter
 */
function performSearch(query, filter = 'all') {
    // In a real implementation, this would send the search request to the server
    // For now, we'll just redirect to a search results page
    window.location.href = `search-results.html?q=${encodeURIComponent(query)}&filter=${filter}`;
}

/**
 * Show search suggestions based on input
 */
function showSearchSuggestions(query) {
    const searchSuggestions = document.querySelector('.search-suggestions');

    if (searchSuggestions) {
        // In a real implementation, this would fetch suggestions from the server
        // For now, we'll just show some dummy suggestions
        const suggestions = [
            `${query} in Finance Module`,
            `${query} Tutorial`,
            `How to ${query}`,
            `${query} Troubleshooting`
        ];

        searchSuggestions.innerHTML = '';

        suggestions.forEach(suggestion => {
            const div = document.createElement('div');
            div.className = 'search-suggestion';
            div.textContent = suggestion;
            div.addEventListener('click', function() {
                performSearch(suggestion);
            });
            searchSuggestions.appendChild(div);
        });
    }
}

/**
 * Initialize table of contents functionality
 */
function initializeTableOfContents() {
    const tocToggle = document.querySelector('.toc-toggle');
    const tocContent = document.getElementById('toc-content');
    const tocExpanders = document.querySelectorAll('.toc-expand');

    if (tocToggle && tocContent) {
        // Check if the TOC should be collapsed by default
        const isCollapsedByDefault = localStorage.getItem('toc-collapsed') === 'true';

        // Apply initial state
        if (isCollapsedByDefault) {
            tocContent.classList.add('collapsed');
            tocToggle.setAttribute('aria-expanded', 'false');
            tocToggle.innerHTML = '<i class="fas fa-chevron-down"></i>';
        } else {
            tocContent.classList.remove('collapsed');
            tocToggle.setAttribute('aria-expanded', 'true');
            tocToggle.innerHTML = '<i class="fas fa-chevron-up"></i>';
        }

        // Add click event listener
        tocToggle.addEventListener('click', function() {
            // Toggle the collapsed class
            tocContent.classList.toggle('collapsed');

            // Update the aria-expanded attribute
            const isExpanded = tocContent.classList.contains('collapsed') ? false : true;
            tocToggle.setAttribute('aria-expanded', isExpanded);

            // Update the icon
            tocToggle.innerHTML = isExpanded ?
                '<i class="fas fa-chevron-up"></i>' :
                '<i class="fas fa-chevron-down"></i>';

            // Save the state to localStorage
            localStorage.setItem('toc-collapsed', !isExpanded);
        });
    }

    if (tocExpanders) {
        tocExpanders.forEach(expander => {
            expander.addEventListener('click', function() {
                const tocItem = expander.closest('.toc-item');
                const subList = tocItem.querySelector('.toc-list');

                if (subList) {
                    // Toggle the collapsed class
                    subList.classList.toggle('collapsed');

                    // Update the icon based on the current state
                    const isCollapsed = subList.classList.contains('collapsed');
                    expander.innerHTML = isCollapsed ?
                        '<i class="fas fa-plus"></i>' :
                        '<i class="fas fa-minus"></i>';
                }
            });
        });
    }
}

/**
 * Initialize feedback widget
 */
function initializeFeedbackWidget() {
    const feedbackToggle = document.getElementById('feedback-toggle');
    const feedbackForm = document.getElementById('feedback-form');
    const feedbackClose = document.querySelector('.feedback-close');
    const ratingButtons = document.querySelectorAll('.rating-btn');
    const submitFeedback = document.querySelector('.submit-feedback');

    if (feedbackToggle && feedbackForm) {
        feedbackToggle.addEventListener('click', function() {
            feedbackForm.classList.toggle('hidden');
        });
    }

    if (feedbackClose) {
        feedbackClose.addEventListener('click', function() {
            feedbackForm.classList.add('hidden');
        });
    }

    if (ratingButtons) {
        ratingButtons.forEach(button => {
            button.addEventListener('click', function() {
                ratingButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    }

    if (submitFeedback) {
        submitFeedback.addEventListener('click', function() {
            // In a real implementation, this would send the feedback to the server
            alert('Thank you for your feedback!');
            feedbackForm.classList.add('hidden');
        });
    }
}

/**
 * Initialize language selector
 */
function initializeLanguageSelector() {
    const languageCurrent = document.querySelector('.language-current');
    const languageDropdown = document.querySelector('.language-dropdown');
    const languageOptions = document.querySelectorAll('.language-option');

    if (languageCurrent && languageDropdown) {
        languageCurrent.addEventListener('click', function() {
            languageDropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.language-selector-enhanced')) {
                languageDropdown.classList.remove('active');
            }
        });
    }

    if (languageOptions) {
        languageOptions.forEach(option => {
            option.addEventListener('click', function() {
                const lang = option.dataset.lang;
                const img = option.querySelector('img').cloneNode(true);
                const name = option.querySelector('.language-name').textContent;

                languageCurrent.innerHTML = '';
                languageCurrent.appendChild(img);

                const nameSpan = document.createElement('span');
                nameSpan.className = 'language-name';
                nameSpan.textContent = name;
                languageCurrent.appendChild(nameSpan);

                const icon = document.createElement('i');
                icon.className = 'fas fa-chevron-down';
                languageCurrent.appendChild(icon);

                languageDropdown.classList.remove('active');

                // In a real implementation, this would change the language
                // For now, we'll just store the preference
                localStorage.setItem('language', lang);
            });
        });
    }
}

/**
 * Initialize user role selection
 */
function initializeUserRoleSelection() {
    const userRoles = document.querySelectorAll('.user-role');

    if (userRoles) {
        userRoles.forEach(role => {
            role.addEventListener('click', function() {
                userRoles.forEach(r => r.classList.remove('active'));
                role.classList.add('active');

                const userType = role.dataset.userType;
                localStorage.setItem('user-role', userType);

                // If this is a guide trigger, start the guide
                if (role.classList.contains('guide-trigger')) {
                    const guideId = role.dataset.guideId;
                    startGuide(guideId);
                }
            });
        });
    }
}

/**
 * Start a guided tour
 */
function startGuide(guideId) {
    // In a real implementation, this would start a guided tour
    // For now, we'll just redirect to the appropriate page
    window.location.href = `${guideId}.html`;
}

/**
 * Initialize tooltips
 */
function initializeTooltips() {
    // No additional JavaScript needed for basic tooltips
    // They work with CSS :hover

    // For mobile, we could add tap functionality
    if ('ontouchstart' in window) {
        const tooltipContainers = document.querySelectorAll('.tooltip-container');

        tooltipContainers.forEach(container => {
            container.addEventListener('click', function(e) {
                e.preventDefault();
                const tooltip = container.querySelector('.tooltip-content');

                // Close all other tooltips
                document.querySelectorAll('.tooltip-content.active').forEach(t => {
                    if (t !== tooltip) {
                        t.classList.remove('active');
                    }
                });

                // Toggle this tooltip
                tooltip.classList.toggle('active');
            });
        });
    }
}

/**
 * Track recently viewed pages
 */
function trackRecentlyViewed() {
    // Get current page
    const currentPage = window.location.pathname.split('/').pop();
    const pageTitle = document.title;

    if (currentPage) {
        // Get stored recently viewed pages
        let recentlyViewed = JSON.parse(localStorage.getItem('recently-viewed') || '[]');

        // Add current page to the beginning if it's not already there
        const existingIndex = recentlyViewed.findIndex(page => page.url === currentPage);
        if (existingIndex !== -1) {
            recentlyViewed.splice(existingIndex, 1);
        }

        recentlyViewed.unshift({
            url: currentPage,
            title: pageTitle,
            timestamp: new Date().getTime()
        });

        // Keep only the 5 most recent pages
        recentlyViewed = recentlyViewed.slice(0, 5);

        // Store updated list
        localStorage.setItem('recently-viewed', JSON.stringify(recentlyViewed));

        // Update the recently viewed list in the sidebar
        updateRecentlyViewedList(recentlyViewed);
    }
}

/**
 * Update the recently viewed list in the sidebar
 */
function updateRecentlyViewedList(recentlyViewed) {
    const recentlyViewedList = document.getElementById('recently-viewed');

    if (recentlyViewedList) {
        recentlyViewedList.innerHTML = '';

        if (recentlyViewed.length === 0) {
            const emptyState = document.createElement('p');
            emptyState.className = 'empty-state';
            emptyState.textContent = 'No recent pages';
            recentlyViewedList.appendChild(emptyState);
        } else {
            recentlyViewed.forEach(page => {
                const li = document.createElement('li');
                li.className = 'sidebar-item';

                const a = document.createElement('a');
                a.className = 'sidebar-link';
                a.href = page.url;
                a.innerHTML = `<i class="fas fa-history"></i> ${page.title}`;

                li.appendChild(a);
                recentlyViewedList.appendChild(li);
            });
        }
    }
}
