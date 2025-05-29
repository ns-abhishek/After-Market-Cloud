// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Help Center Elements
    const helpButton = document.getElementById('help-button');
    const helpCenterModal = document.getElementById('help-center-modal');
    const closeModalButton = document.querySelector('.close-modal');
    const helpTocList = document.getElementById('help-toc-list');
    const helpContentDisplay = document.getElementById('help-content-display');
    const helpBreadcrumbs = document.getElementById('help-breadcrumbs');
    const helpSearchInput = document.getElementById('help-search-input');

    // Contextual Help Elements
    const showContextualHelpButton = document.getElementById('show-contextual-help');
    const contextualHelpSidebar = document.getElementById('contextual-help-sidebar');
    const closeContextualHelpButton = document.querySelector('.close-sidebar');
    const contextualHelpContent = document.querySelector('.contextual-help-content');

    // Walkthrough Elements
    const walkthroughOverlay = document.getElementById('walkthrough-overlay');
    const walkthroughTitle = document.getElementById('walkthrough-title');
    const walkthroughBody = document.getElementById('walkthrough-body');
    const walkthroughPrev = document.getElementById('walkthrough-prev');
    const walkthroughNext = document.getElementById('walkthrough-next');
    const walkthroughIndicators = document.getElementById('walkthrough-indicators');
    const closeWalkthroughButton = document.querySelector('.close-walkthrough');

    // Order Card Elements
    const orderCards = document.querySelectorAll('.order-card');
    const expandButtons = document.querySelectorAll('.expand-btn');

    // Button Effect Elements
    const buttons = document.querySelectorAll('.primary-button, .secondary-button');

    // Tooltip Elements
    const tooltip = document.getElementById('tooltip');
    const enhancedTooltip = document.getElementById('enhanced-tooltip');
    const popover = document.getElementById('popover');

    // Current state
    let currentHelpTopic = 'getting-started';
    let currentWalkthroughStep = 0;
    const walkthroughSteps = Object.keys(helpContent.walkthrough);
    let draggedItem = null;
    let currentSearchMatches = [];
    let currentMatchIndex = -1;

    // Technical terms and complex concepts definitions
    const technicalTerms = {
        'API': {
            title: 'API',
            content: 'Application Programming Interface. A set of rules that allows different software applications to communicate with each other.'
        },
        'JSON': {
            title: 'JSON',
            content: 'JavaScript Object Notation. A lightweight data-interchange format that is easy for humans to read and write and easy for machines to parse and generate.'
        },
        'REST': {
            title: 'REST',
            content: 'Representational State Transfer. An architectural style for designing networked applications that relies on a stateless, client-server communication protocol, typically HTTP.'
        },
        'SKU': {
            title: 'SKU',
            content: 'Stock Keeping Unit. A unique identifier for each distinct product and service that can be purchased.'
        },
        'Webhook': {
            title: 'Webhook',
            content: 'A way for an app to provide other applications with real-time information. A webhook delivers data to other applications as it happens, meaning you get data immediately.'
        }
    };

    const complexConcepts = {
        'Inventory Management': {
            title: 'Inventory Management',
            content: 'The process of ordering, storing, and using a company\'s inventory. This includes the management of raw materials, components, and finished products, as well as warehousing and processing of such items.',
            learnMoreUrl: '#inventory-management'
        },
        'Order Fulfillment': {
            title: 'Order Fulfillment',
            content: 'The complete process from point of sale to delivery of a product to the customer. It includes receiving, processing, and delivering orders.',
            learnMoreUrl: '#order-fulfillment'
        },
        'Payment Processing': {
            title: 'Payment Processing',
            content: 'The procedure where payment details are captured, funds are transferred from customer to merchant, and the merchant receives confirmation of payment. It involves multiple steps and various entities like payment gateways and processors.',
            learnMoreUrl: '#payment-processing'
        },
        'Shipping Integration': {
            title: 'Shipping Integration',
            content: 'The connection between your e-commerce platform and shipping carriers that allows for automated shipping processes, including label generation, rate calculation, and tracking updates.',
            learnMoreUrl: '#shipping-integration'
        }
    };

    // Initialize Help Center
    function initializeHelpCenter() {
        // Populate Table of Contents
        populateTableOfContents();

        // Display initial content
        displayHelpContent(currentHelpTopic);

        // Set up event listeners
        setupHelpCenterEventListeners();
    }

    // Populate Table of Contents
    function populateTableOfContents() {
        // Clear existing content
        helpTocList.innerHTML = '';

        // Add main sections
        let animationOrder = 0;
        for (const [key, section] of Object.entries(helpContent)) {
            // Skip special sections
            if (['contextual', 'walkthrough'].includes(key)) continue;

            // Skip subsections (they'll be added under their parent)
            if (section.parent) continue;

            // Create list item for main section
            const listItem = document.createElement('li');
            listItem.style.setProperty('--animation-order', animationOrder++);

            // Add icon based on section key
            let icon = 'book';
            if (key === 'getting-started') icon = 'rocket';
            else if (key === 'orders') icon = 'shopping-cart';
            else if (key === 'products') icon = 'box';
            else if (key === 'customers') icon = 'users';
            else if (key === 'analytics') icon = 'chart-bar';
            else if (key === 'settings') icon = 'cog';
            else if (key === 'faq') icon = 'question-circle';

            listItem.innerHTML = `<i class="fas fa-${icon}"></i> ${section.title}`;
            listItem.dataset.topic = key;

            // Add ripple effect on click
            listItem.addEventListener('click', (e) => {
                // Create ripple effect
                const rect = listItem.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const ripple = document.createElement('span');
                ripple.className = 'toc-ripple';
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;

                listItem.appendChild(ripple);

                // Remove ripple after animation completes
                setTimeout(() => {
                    ripple.remove();
                }, 600);

                displayHelpContent(key);
            });

            // Add subsections if any
            if (section.sections && section.sections.length > 0) {
                const subList = document.createElement('ul');
                subList.className = 'toc-subsections';

                section.sections.forEach((subSectionKey, subIndex) => {
                    const subSection = helpContent[subSectionKey];
                    if (subSection) {
                        const subListItem = document.createElement('li');
                        subListItem.style.setProperty('--animation-order', animationOrder + subIndex);

                        // Add chevron icon for subsections
                        subListItem.innerHTML = `<i class="fas fa-angle-right"></i> ${subSection.title}`;
                        subListItem.className = 'toc-section';
                        subListItem.dataset.topic = subSectionKey;

                        // Add ripple effect on click
                        subListItem.addEventListener('click', (e) => {
                            e.stopPropagation();

                            // Create ripple effect
                            const rect = subListItem.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const y = e.clientY - rect.top;

                            const ripple = document.createElement('span');
                            ripple.className = 'toc-ripple';
                            ripple.style.left = `${x}px`;
                            ripple.style.top = `${y}px`;

                            subListItem.appendChild(ripple);

                            // Remove ripple after animation completes
                            setTimeout(() => {
                                ripple.remove();
                            }, 600);

                            displayHelpContent(subSectionKey);
                        });

                        subList.appendChild(subListItem);
                    }
                });

                listItem.appendChild(subList);
                animationOrder += section.sections.length;
            }

            helpTocList.appendChild(listItem);
        }

        // Add ripple style
        const style = document.createElement('style');
        style.textContent = `
            .toc-ripple {
                position: absolute;
                background-color: rgba(0, 0, 0, 0.1);
                border-radius: 50%;
                transform: scale(0);
                animation: tocRipple 0.6s linear;
                pointer-events: none;
                width: 100px;
                height: 100px;
            }

            @keyframes tocRipple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Display Help Content
    function displayHelpContent(topicKey, searchQuery = null) {
        const topic = helpContent[topicKey];
        if (!topic) return;

        // Update current topic
        currentHelpTopic = topicKey;

        // Reset search matches
        currentSearchMatches = [];
        currentMatchIndex = -1;

        // Update active state in TOC
        document.querySelectorAll('#help-toc-list li').forEach(li => {
            li.classList.remove('active');
            if (li.dataset.topic === topicKey) {
                li.classList.add('active');
            }
        });

        // Fade out current content
        helpContentDisplay.style.opacity = '0';
        helpContentDisplay.style.transform = 'translateY(20px)';

        setTimeout(() => {
            // Process content to add card-based layout and icons
            let processedContent = topic.content;

            // Add icons to headings
            processedContent = processedContent.replace(/<h2>(.*?)<\/h2>/g, (match, content) => {
                // Determine icon based on content
                let icon = 'book-open';
                if (content.includes('Getting Started')) icon = 'rocket';
                else if (content.includes('Order')) icon = 'shopping-cart';
                else if (content.includes('Product')) icon = 'box';
                else if (content.includes('Customer')) icon = 'users';
                else if (content.includes('Analytics')) icon = 'chart-bar';
                else if (content.includes('Settings')) icon = 'cog';
                else if (content.includes('FAQ')) icon = 'question-circle';

                return `<h2><i class="fas fa-${icon}"></i>${content}</h2>`;
            });

            // Add icons to h3 headings
            processedContent = processedContent.replace(/<h3>(.*?)<\/h3>/g, (match, content) => {
                return `<h3><i class="fas fa-bookmark"></i>${content}</h3>`;
            });

            // Process technical terms and complex concepts
            Object.keys(technicalTerms).forEach(term => {
                const regex = new RegExp(`\\b${escapeRegExp(term)}\\b`, 'g');
                processedContent = processedContent.replace(regex, `<span class="term-highlight" data-term="${term}">${term}</span>`);
            });

            Object.keys(complexConcepts).forEach(concept => {
                const regex = new RegExp(`\\b${escapeRegExp(concept)}\\b`, 'g');
                processedContent = processedContent.replace(regex, `<span class="complex-concept" data-concept="${concept}">${concept}</span>`);
            });

            // Highlight search query if provided
            if (searchQuery) {
                const regex = new RegExp(`(${escapeRegExp(searchQuery)})`, 'gi');
                processedContent = processedContent.replace(regex, '<span class="search-highlight">$1</span>');
            }

            // Wrap content in cards
            const parser = new DOMParser();
            const doc = parser.parseFromString(processedContent, 'text/html');
            const sections = [];
            let currentSection = [];
            let currentNode = doc.body.firstChild;

            // Group content into logical sections for cards
            while (currentNode) {
                if (currentNode.nodeName === 'H2') {
                    if (currentSection.length > 0) {
                        sections.push(currentSection);
                        currentSection = [];
                    }
                }

                currentSection.push(currentNode.outerHTML || currentNode.textContent);
                currentNode = currentNode.nextSibling;
            }

            if (currentSection.length > 0) {
                sections.push(currentSection);
            }

            // Create card-based layout
            let cardHTML = '';
            sections.forEach(section => {
                cardHTML += `<div class="help-card">${section.join('')}</div>`;
            });

            // Add feedback mechanism
            cardHTML += `
                <div class="help-feedback">
                    <div class="feedback-question">
                        <i class="fas fa-comment-dots"></i>
                        Was this information helpful?
                    </div>
                    <div class="feedback-actions">
                        <button class="feedback-btn positive" data-value="yes">
                            <i class="fas fa-thumbs-up"></i>
                            <span>Yes</span>
                        </button>
                        <button class="feedback-btn negative" data-value="no">
                            <i class="fas fa-thumbs-down"></i>
                            <span>No</span>
                        </button>
                    </div>
                    <div class="feedback-comment">
                        <textarea placeholder="Please tell us how we can improve this content..."></textarea>
                        <button class="feedback-submit">
                            <i class="fas fa-paper-plane"></i>
                            Submit Feedback
                        </button>
                    </div>
                    <div class="feedback-thanks">
                        <i class="fas fa-check-circle"></i>
                        <p>Thank you for your feedback!</p>
                    </div>
                </div>
            `;

            // Display content
            helpContentDisplay.innerHTML = cardHTML;

            // If search query is provided, collect and highlight matches
            if (searchQuery) {
                // Collect all search highlights
                currentSearchMatches = Array.from(helpContentDisplay.querySelectorAll('.search-highlight'));

                // If there are matches, highlight the first one and show match counter
                if (currentSearchMatches.length > 0) {
                    // Create match counter
                    const matchCounter = document.createElement('div');
                    matchCounter.className = 'search-match-counter';
                    matchCounter.innerHTML = `<i class="fas fa-highlighter"></i> ${currentSearchMatches.length} matches found`;

                    // Add navigation buttons
                    const navButtons = document.createElement('div');
                    navButtons.className = 'search-navigation';

                    const prevButton = document.createElement('button');
                    prevButton.className = 'search-nav-btn';
                    prevButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
                    prevButton.disabled = currentSearchMatches.length <= 1;
                    prevButton.addEventListener('click', navigateToPreviousMatch);

                    const nextButton = document.createElement('button');
                    nextButton.className = 'search-nav-btn';
                    nextButton.innerHTML = '<i class="fas fa-chevron-down"></i>';
                    nextButton.disabled = currentSearchMatches.length <= 1;
                    nextButton.addEventListener('click', navigateToNextMatch);

                    navButtons.appendChild(prevButton);
                    navButtons.appendChild(nextButton);
                    matchCounter.appendChild(navButtons);

                    // Insert at the top of the content
                    helpContentDisplay.insertBefore(matchCounter, helpContentDisplay.firstChild);

                    // Highlight first match
                    currentMatchIndex = 0;
                    currentSearchMatches[currentMatchIndex].classList.add('active');

                    // Scroll to first match
                    setTimeout(() => {
                        currentSearchMatches[currentMatchIndex].scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }, 500);
                }
            }

            // Animate in new content
            helpContentDisplay.style.opacity = '1';
            helpContentDisplay.style.transform = 'translateY(0)';

            // Update breadcrumbs
            updateBreadcrumbs(topicKey);

            // Set up any interactive elements in the content
            setupContentInteractivity();

            // Set up tooltips and popovers for technical terms and complex concepts
            setupTooltipsAndPopovers();

            // Set up feedback mechanism
            setupFeedbackMechanism();
        }, 300);
    }

    // Set up tooltips and popovers for technical terms and complex concepts
    function setupTooltipsAndPopovers() {
        // Set up technical term tooltips
        document.querySelectorAll('.term-highlight').forEach(term => {
            term.addEventListener('mouseenter', function() {
                showEnhancedTooltip(this, this.dataset.term);
            });
        });

        // Set up complex concept popovers
        document.querySelectorAll('.complex-concept').forEach(concept => {
            concept.addEventListener('click', function() {
                showPopover(this, this.dataset.concept);
            });
        });
    }

    // Set up feedback mechanism
    function setupFeedbackMechanism() {
        const feedbackButtons = document.querySelectorAll('.feedback-btn');
        const feedbackComment = document.querySelector('.feedback-comment');
        const feedbackThanks = document.querySelector('.feedback-thanks');
        const feedbackSubmit = document.querySelector('.feedback-submit');

        feedbackButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Show comment section if negative feedback
                if (this.dataset.value === 'no') {
                    feedbackComment.classList.add('show');
                } else {
                    // Show thanks message directly for positive feedback
                    feedbackThanks.classList.add('show');

                    // Hide buttons
                    document.querySelector('.feedback-actions').style.display = 'none';
                }

                // Disable both buttons
                feedbackButtons.forEach(btn => {
                    btn.disabled = true;
                    btn.style.opacity = '0.5';
                });
            });
        });

        // Handle feedback submission
        if (feedbackSubmit) {
            feedbackSubmit.addEventListener('click', function() {
                // Hide comment section
                feedbackComment.classList.remove('show');

                // Show thanks message
                feedbackThanks.classList.add('show');

                // In a real app, we would send the feedback to the server here
                console.log('Feedback submitted:', document.querySelector('.feedback-comment textarea').value);
            });
        }
    }

    // Update Breadcrumbs
    function updateBreadcrumbs(topicKey) {
        // Fade out current breadcrumbs
        helpBreadcrumbs.style.opacity = '0';

        setTimeout(() => {
            helpBreadcrumbs.innerHTML = '';

            // Add Home icon and link
            const homeLink = document.createElement('span');
            homeLink.innerHTML = '<i class="fas fa-home"></i>';
            homeLink.addEventListener('click', () => displayHelpContent('getting-started'));
            helpBreadcrumbs.appendChild(homeLink);

            // Build breadcrumb trail
            const trail = [];
            let currentKey = topicKey;

            // Add current topic and its ancestors to the trail
            while (currentKey) {
                const topic = helpContent[currentKey];
                if (!topic) break;

                trail.unshift({
                    key: currentKey,
                    title: topic.title
                });

                currentKey = topic.parent;
            }

            // Add breadcrumb items with animated entrance
            trail.forEach((item, index) => {
                // Add separator
                const separator = document.createElement('span');
                separator.className = 'separator';
                separator.innerHTML = '<i class="fas fa-chevron-right"></i>';
                helpBreadcrumbs.appendChild(separator);

                const link = document.createElement('span');
                link.textContent = item.title;
                link.style.animationDelay = `${index * 0.1}s`;

                if (index < trail.length - 1) {
                    link.addEventListener('click', () => displayHelpContent(item.key));
                    helpBreadcrumbs.appendChild(link);
                } else {
                    // Last item (current page) is not clickable
                    link.className = 'current-breadcrumb';
                    helpBreadcrumbs.appendChild(link);
                }
            });

            // Fade in new breadcrumbs
            helpBreadcrumbs.style.opacity = '1';
        }, 150);
    }

    // Set up interactivity within help content
    function setupContentInteractivity() {
        // Set up walkthrough button if present
        const startWalkthroughButton = document.getElementById('start-walkthrough');
        if (startWalkthroughButton) {
            startWalkthroughButton.addEventListener('click', startWalkthrough);
        }

        // Set up help links
        document.querySelectorAll('.help-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const topic = link.dataset.topic;
                if (topic) {
                    displayHelpContent(topic);
                }
            });
        });

        // Set up FAQ toggles
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => {
                const answer = question.nextElementSibling;
                answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
            });
        });

        // Initialize video placeholders
        document.querySelectorAll('.video-placeholder').forEach(placeholder => {
            placeholder.addEventListener('click', () => {
                alert('Video tutorial would play here in a real implementation.');
            });
        });
    }

    // Set up Help Center Event Listeners
    function setupHelpCenterEventListeners() {
        // Open Help Center with animation
        helpButton.addEventListener('click', () => {
            // Add pulse animation to the help button icon
            const helpIcon = helpButton.querySelector('i');
            helpIcon.classList.add('pulse-animation');

            // Remove pulse animation after it completes
            setTimeout(() => {
                helpIcon.classList.remove('pulse-animation');
            }, 1000);

            // Show modal with animation
            helpCenterModal.style.display = 'block';
            setTimeout(() => {
                helpCenterModal.classList.add('show');

                // Animate in TOC items with staggered delay
                const tocItems = document.querySelectorAll('#help-toc-list > li');
                tocItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('animate-in');
                    }, index * 50);
                });
            }, 10);
        });

        // Close Help Center with animation
        closeModalButton.addEventListener('click', () => {
            helpCenterModal.classList.remove('show');
            setTimeout(() => {
                helpCenterModal.style.display = 'none';

                // Reset animation classes for next opening
                document.querySelectorAll('#help-toc-list > li').forEach(item => {
                    item.classList.remove('animate-in');
                });
            }, 400);
        });

        // Close when clicking outside the modal content
        helpCenterModal.addEventListener('click', (e) => {
            if (e.target === helpCenterModal) {
                helpCenterModal.classList.remove('show');
                setTimeout(() => {
                    helpCenterModal.style.display = 'none';

                    // Reset animation classes for next opening
                    document.querySelectorAll('#help-toc-list > li').forEach(item => {
                        item.classList.remove('animate-in');
                    });
                }, 400);
            }
        });

        // Search functionality with animation
        helpSearchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                // Add animation to search icon
                const searchIcon = document.querySelector('.search-icon');
                searchIcon.classList.add('rotate-animation');

                // Remove animation after it completes
                setTimeout(() => {
                    searchIcon.classList.remove('rotate-animation');
                }, 600);

                searchHelpContent(helpSearchInput.value);
            }
        });

        // Search button with animation
        const searchButton = helpSearchInput.nextElementSibling;
        searchButton.addEventListener('click', () => {
            // Add animation to button
            searchButton.classList.add('scale-animation');

            // Remove animation after it completes
            setTimeout(() => {
                searchButton.classList.remove('scale-animation');
            }, 300);

            searchHelpContent(helpSearchInput.value);
        });

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            #help-toc-list > li {
                opacity: 0;
                transform: translateX(-20px);
                transition: opacity 0.4s ease, transform 0.4s ease;
            }

            #help-toc-list > li.animate-in {
                opacity: 1;
                transform: translateX(0);
            }

            .rotate-animation {
                animation: rotateSearch 0.6s ease;
            }

            @keyframes rotateSearch {
                0% { transform: translateY(-50%) rotate(0); }
                100% { transform: translateY(-50%) rotate(360deg); }
            }

            .scale-animation {
                animation: scaleButton 0.3s ease;
            }

            @keyframes scaleButton {
                0% { transform: translateY(-50%) scale(1); }
                50% { transform: translateY(-50%) scale(0.8); }
                100% { transform: translateY(-50%) scale(1); }
            }
        `;
        document.head.appendChild(style);
    }

    // Search Help Content
    function searchHelpContent(query) {
        if (!query.trim()) return;

        query = query.toLowerCase();
        const results = [];

        // Reset search matches
        currentSearchMatches = [];
        currentMatchIndex = -1;

        // Search through all help content
        for (const [key, section] of Object.entries(helpContent)) {
            // Skip special sections
            if (['contextual', 'walkthrough'].includes(key)) continue;

            // Check title and content
            if (section.title.toLowerCase().includes(query) ||
                section.content.toLowerCase().includes(query)) {
                results.push({
                    key,
                    title: section.title,
                    preview: getContentPreview(section.content, query),
                    matches: countMatches(section.content, query)
                });
            }
        }

        // Display search results
        displaySearchResults(results, query);
    }

    // Count matches in content
    function countMatches(content, query) {
        // Strip HTML tags
        const textContent = content.replace(/<[^>]*>/g, ' ');
        const regex = new RegExp(escapeRegExp(query), 'gi');
        const matches = textContent.match(regex);
        return matches ? matches.length : 0;
    }

    // Escape special characters for regex
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Get content preview for search results
    function getContentPreview(content, query) {
        // Strip HTML tags
        const textContent = content.replace(/<[^>]*>/g, ' ');

        // Find position of query
        const position = textContent.toLowerCase().indexOf(query);
        if (position === -1) return textContent.substring(0, 100) + '...';

        // Get surrounding context
        const start = Math.max(0, position - 50);
        const end = Math.min(textContent.length, position + query.length + 50);
        let preview = textContent.substring(start, end);

        // Add ellipsis if needed
        if (start > 0) preview = '...' + preview;
        if (end < textContent.length) preview = preview + '...';

        return preview;
    }

    // Display search results
    function displaySearchResults(results, query) {
        helpContentDisplay.innerHTML = '';

        // Create search results header
        const header = document.createElement('h2');
        header.innerHTML = `<i class="fas fa-search"></i> Search Results for "${query}"`;
        helpContentDisplay.appendChild(header);

        if (results.length === 0) {
            const noResults = document.createElement('p');
            noResults.textContent = 'No results found. Please try a different search term.';
            helpContentDisplay.appendChild(noResults);
            return;
        }

        // Calculate total matches
        const totalMatches = results.reduce((sum, result) => sum + result.matches, 0);

        // Create match counter
        const matchCounter = document.createElement('div');
        matchCounter.className = 'search-match-counter';
        matchCounter.innerHTML = `<i class="fas fa-highlighter"></i> ${totalMatches} matches found`;

        // Add navigation buttons if there are matches
        if (totalMatches > 0) {
            const navButtons = document.createElement('div');
            navButtons.className = 'search-navigation';

            const prevButton = document.createElement('button');
            prevButton.className = 'search-nav-btn';
            prevButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
            prevButton.disabled = true;
            prevButton.addEventListener('click', navigateToPreviousMatch);

            const nextButton = document.createElement('button');
            nextButton.className = 'search-nav-btn';
            nextButton.innerHTML = '<i class="fas fa-chevron-down"></i>';
            nextButton.addEventListener('click', navigateToNextMatch);

            navButtons.appendChild(prevButton);
            navButtons.appendChild(nextButton);
            matchCounter.appendChild(navButtons);
        }

        helpContentDisplay.appendChild(matchCounter);

        // Create results list
        const resultsList = document.createElement('div');
        resultsList.className = 'search-results';

        results.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';

            const title = document.createElement('h3');
            title.textContent = result.title;
            title.addEventListener('click', () => {
                // Navigate to the content and highlight matches
                displayHelpContent(result.key, query);
            });

            const preview = document.createElement('p');
            // Highlight the query in the preview
            preview.innerHTML = highlightText(result.preview, query);

            const matchCount = document.createElement('div');
            matchCount.className = 'match-count';
            matchCount.innerHTML = `<i class="fas fa-tag"></i> ${result.matches} ${result.matches === 1 ? 'match' : 'matches'}`;

            resultItem.appendChild(title);
            resultItem.appendChild(preview);
            resultItem.appendChild(matchCount);
            resultsList.appendChild(resultItem);
        });

        helpContentDisplay.appendChild(resultsList);
    }

    // Highlight text with search query
    function highlightText(text, query) {
        const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    }

    // Navigate to next match
    function navigateToNextMatch() {
        if (currentSearchMatches.length === 0) return;

        // Remove active class from current match
        if (currentMatchIndex >= 0 && currentMatchIndex < currentSearchMatches.length) {
            currentSearchMatches[currentMatchIndex].classList.remove('active');
        }

        // Move to next match
        currentMatchIndex = (currentMatchIndex + 1) % currentSearchMatches.length;

        // Add active class to new match
        currentSearchMatches[currentMatchIndex].classList.add('active');

        // Scroll to match
        currentSearchMatches[currentMatchIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });

        // Update button states
        updateNavigationButtons();
    }

    // Navigate to previous match
    function navigateToPreviousMatch() {
        if (currentSearchMatches.length === 0) return;

        // Remove active class from current match
        if (currentMatchIndex >= 0 && currentMatchIndex < currentSearchMatches.length) {
            currentSearchMatches[currentMatchIndex].classList.remove('active');
        }

        // Move to previous match
        currentMatchIndex = (currentMatchIndex - 1 + currentSearchMatches.length) % currentSearchMatches.length;

        // Add active class to new match
        currentSearchMatches[currentMatchIndex].classList.add('active');

        // Scroll to match
        currentSearchMatches[currentMatchIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });

        // Update button states
        updateNavigationButtons();
    }

    // Update navigation button states
    function updateNavigationButtons() {
        const prevButton = document.querySelector('.search-nav-btn:first-child');
        const nextButton = document.querySelector('.search-nav-btn:last-child');

        if (!prevButton || !nextButton) return;

        prevButton.disabled = currentSearchMatches.length <= 1;
        nextButton.disabled = currentSearchMatches.length <= 1;
    }

    // Contextual Help Functions
    function showContextualHelp() {
        // Get contextual help for the current page (in a real app, this would be dynamic)
        const pageHelp = helpContent.contextual['orders-dashboard'];

        if (pageHelp) {
            // Prepare content with icons and enhanced styling
            let processedContent = pageHelp.content;

            // Add icons to headings
            processedContent = processedContent.replace(/<h3>(.*?)<\/h3>/g, (match, content) => {
                return `<h3><i class="fas fa-info-circle"></i>${content}</h3>`;
            });

            // Add icons to list items
            processedContent = processedContent.replace(/<li>(.*?)<\/li>/g, (match, content) => {
                return `<li data-animation-order>${content}</li>`;
            });

            // Display content
            contextualHelpContent.innerHTML = processedContent;

            // Add animation order to list items
            const listItems = contextualHelpContent.querySelectorAll('li[data-animation-order]');
            listItems.forEach((item, index) => {
                item.style.setProperty('--animation-order', index);
                item.removeAttribute('data-animation-order');
            });

            // Add entrance animation to sidebar
            contextualHelpSidebar.classList.add('open');

            // Add pulse animation to the sidebar icon
            const sidebarIcon = document.querySelector('.sidebar-title i');
            sidebarIcon.classList.add('pulse-animation');

            // Remove pulse animation after it completes
            setTimeout(() => {
                sidebarIcon.classList.remove('pulse-animation');
            }, 1000);

            // Set up any interactive elements
            setupContentInteractivity();

            // Set up action buttons in footer
            setupContextualHelpActions();
        }
    }

    // Set up action buttons in the contextual help footer
    function setupContextualHelpActions() {
        const actionButtons = document.querySelectorAll('.help-action-btn');

        actionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const action = button.querySelector('span').textContent;

                // Create ripple effect
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const ripple = document.createElement('span');
                ripple.className = 'btn-ripple';
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;

                button.appendChild(ripple);

                // Remove ripple after animation completes
                setTimeout(() => {
                    ripple.remove();
                }, 600);

                // Handle different actions
                if (action === 'Open in Help Center') {
                    // Close sidebar
                    contextualHelpSidebar.classList.remove('open');

                    // Open help center with a slight delay
                    setTimeout(() => {
                        helpCenterModal.style.display = 'block';
                        setTimeout(() => {
                            helpCenterModal.classList.add('show');
                            // Navigate to the relevant help topic
                            displayHelpContent('orders-dashboard');
                        }, 10);
                    }, 300);
                } else if (action === 'Print') {
                    alert('Print functionality would be implemented here.');
                }
            });
        });

        // Add ripple style
        const style = document.createElement('style');
        style.textContent = `
            .btn-ripple {
                position: absolute;
                background-color: rgba(0, 0, 0, 0.1);
                border-radius: 50%;
                transform: scale(0);
                animation: btnRipple 0.6s linear;
                pointer-events: none;
                width: 100px;
                height: 100px;
            }

            @keyframes btnRipple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }

            .pulse-animation {
                animation: iconPulse 1s ease;
            }

            @keyframes iconPulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.5); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }

    // Walkthrough Functions
    function startWalkthrough() {
        currentWalkthroughStep = 0;
        showWalkthroughStep();
        walkthroughOverlay.style.display = 'flex';

        // Create indicators
        walkthroughIndicators.innerHTML = '';
        walkthroughSteps.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = 'indicator';
            if (index === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => {
                currentWalkthroughStep = index;
                showWalkthroughStep();
            });
            walkthroughIndicators.appendChild(indicator);
        });

        // Add animation
        setTimeout(() => {
            walkthroughOverlay.classList.add('show');
        }, 10);
    }

    function showWalkthroughStep() {
        const step = helpContent.walkthrough[walkthroughSteps[currentWalkthroughStep]];

        // Fade out current content
        walkthroughBody.style.opacity = '0';
        walkthroughTitle.style.opacity = '0';

        setTimeout(() => {
            walkthroughTitle.textContent = step.title;
            walkthroughBody.innerHTML = step.content;

            // Fade in new content
            walkthroughBody.style.opacity = '1';
            walkthroughTitle.style.opacity = '1';

            // Update navigation buttons
            walkthroughPrev.disabled = currentWalkthroughStep === 0;
            walkthroughNext.textContent = currentWalkthroughStep < walkthroughSteps.length - 1 ? 'Next' : 'Finish';

            // Update indicators
            document.querySelectorAll('.indicator').forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentWalkthroughStep);
            });
        }, 300);
    }

    // Tooltip Functions
    function showTooltip(element, text) {
        const rect = element.getBoundingClientRect();

        tooltip.textContent = text;
        // Always position tooltip below the element
        tooltip.style.top = `${rect.bottom + 10}px`;
        tooltip.style.left = `${rect.left + (rect.width / 2) - 125}px`;
        tooltip.classList.add('show');
    }

    function hideTooltip() {
        tooltip.classList.remove('show');
    }

    // Enhanced Tooltip Functions
    function showEnhancedTooltip(element, term) {
        const termInfo = technicalTerms[term];
        if (!termInfo) return;

        const rect = element.getBoundingClientRect();

        // Set tooltip content
        const tooltipTitle = enhancedTooltip.querySelector('.tooltip-title');
        const tooltipContent = enhancedTooltip.querySelector('.tooltip-content');

        tooltipTitle.textContent = termInfo.title;
        tooltipContent.textContent = termInfo.content;

        // Position tooltip below the element
        enhancedTooltip.style.top = `${rect.bottom + 10}px`;
        enhancedTooltip.style.left = `${rect.left}px`;

        // Show tooltip with animation
        enhancedTooltip.classList.add('show');

        // Add close button functionality
        const closeButton = enhancedTooltip.querySelector('.tooltip-close');
        closeButton.addEventListener('click', hideEnhancedTooltip);

        // Close when clicking outside
        document.addEventListener('click', handleOutsideEnhancedTooltipClick);
    }

    function hideEnhancedTooltip() {
        enhancedTooltip.classList.remove('show');
        document.removeEventListener('click', handleOutsideEnhancedTooltipClick);
    }

    function handleOutsideEnhancedTooltipClick(e) {
        if (!enhancedTooltip.contains(e.target) && !e.target.classList.contains('term-highlight')) {
            hideEnhancedTooltip();
        }
    }

    // Popover Functions
    function showPopover(element, concept) {
        const conceptInfo = complexConcepts[concept];
        if (!conceptInfo) return;

        const rect = element.getBoundingClientRect();

        // Set popover content
        const popoverTitle = popover.querySelector('.popover-title');
        const popoverContent = popover.querySelector('.popover-content');
        const popoverAction = popover.querySelector('.popover-action');

        popoverTitle.textContent = conceptInfo.title;
        popoverContent.textContent = conceptInfo.content;

        // Position popover below the element
        popover.style.top = `${rect.bottom + 10}px`;
        popover.style.left = `${rect.left}px`;

        // Show popover with animation
        popover.classList.add('show');

        // Add close button functionality
        const closeButton = popover.querySelector('.popover-close');
        closeButton.addEventListener('click', hidePopover);

        // Add learn more button functionality
        popoverAction.addEventListener('click', () => {
            hidePopover();
            // Navigate to the learn more URL
            if (conceptInfo.learnMoreUrl) {
                // In a real app, this would navigate to the URL
                alert(`In a real application, this would navigate to: ${conceptInfo.learnMoreUrl}`);
            }
        });

        // Close when clicking outside
        document.addEventListener('click', handleOutsidePopoverClick);
    }

    function hidePopover() {
        popover.classList.remove('show');
        document.removeEventListener('click', handleOutsidePopoverClick);
    }

    function handleOutsidePopoverClick(e) {
        if (!popover.contains(e.target) && !e.target.classList.contains('complex-concept')) {
            hidePopover();
        }
    }

    // Set up event listeners
    function setupEventListeners() {
        // Contextual Help
        showContextualHelpButton.addEventListener('click', showContextualHelp);
        closeContextualHelpButton.addEventListener('click', () => {
            contextualHelpSidebar.classList.remove('open');
        });

        // Walkthrough
        walkthroughPrev.addEventListener('click', () => {
            if (currentWalkthroughStep > 0) {
                currentWalkthroughStep--;
                showWalkthroughStep();
            }
        });

        walkthroughNext.addEventListener('click', () => {
            if (currentWalkthroughStep < walkthroughSteps.length - 1) {
                currentWalkthroughStep++;
                showWalkthroughStep();
            } else {
                closeWalkthrough();
            }
        });

        closeWalkthroughButton.addEventListener('click', closeWalkthrough);

        // Tooltips disabled - All hover text removed
        // No tooltip event listeners

        // New Order Button (demo functionality)
        const newOrderBtn = document.getElementById('new-order-btn');
        if (newOrderBtn) {
            newOrderBtn.addEventListener('click', () => {
                alert('In a real application, this would open the new order form.');
            });
        }

        // Help Center Modal
        helpButton.addEventListener('click', () => {
            helpCenterModal.style.display = 'block';
            setTimeout(() => {
                helpCenterModal.classList.add('show');
            }, 10);
        });

        closeModalButton.addEventListener('click', () => {
            helpCenterModal.classList.remove('show');
            setTimeout(() => {
                helpCenterModal.style.display = 'none';
            }, 300);
        });

        // Expandable Order Details
        expandButtons.forEach(button => {
            button.addEventListener('click', () => {
                const card = button.closest('.order-card');
                const details = card.querySelector('.order-details-expanded');

                button.classList.toggle('active');
                if (details.classList.contains('show')) {
                    details.classList.remove('show');
                } else {
                    details.classList.add('show');
                }
            });
        });

        // Button Effects
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const effect = this.querySelector('.button-effect');
                effect.style.left = `${x}px`;
                effect.style.top = `${y}px`;

                effect.classList.remove('animate');
                void effect.offsetWidth; // Trigger reflow
                effect.classList.add('animate');
            });
        });

        // Drag and Drop Functionality
        orderCards.forEach(card => {
            // Drag start
            card.addEventListener('dragstart', function(e) {
                draggedItem = this;
                setTimeout(() => {
                    this.style.opacity = '0.5';
                }, 0);
            });

            // Drag end
            card.addEventListener('dragend', function() {
                draggedItem = null;
                this.style.opacity = '1';
            });

            // Drag over
            card.addEventListener('dragover', function(e) {
                e.preventDefault();
                this.classList.add('drag-over');
            });

            // Drag leave
            card.addEventListener('dragleave', function() {
                this.classList.remove('drag-over');
            });

            // Drop
            card.addEventListener('drop', function(e) {
                e.preventDefault();
                this.classList.remove('drag-over');

                if (draggedItem && draggedItem !== this) {
                    const container = document.querySelector('.orders-container');
                    const allCards = Array.from(container.querySelectorAll('.order-card'));
                    const draggedIndex = allCards.indexOf(draggedItem);
                    const droppedIndex = allCards.indexOf(this);

                    if (draggedIndex < droppedIndex) {
                        container.insertBefore(draggedItem, this.nextSibling);
                    } else {
                        container.insertBefore(draggedItem, this);
                    }

                    // Animation effect
                    draggedItem.classList.add('reordered');
                    setTimeout(() => {
                        draggedItem.classList.remove('reordered');
                    }, 500);
                }
            });
        });
    }

    // Close walkthrough with animation
    function closeWalkthrough() {
        walkthroughOverlay.classList.remove('show');
        setTimeout(() => {
            walkthroughOverlay.style.display = 'none';
        }, 300);
    }

    // Initialize everything
    initializeHelpCenter();
    setupEventListeners();

    // Hide walkthrough overlay initially
    walkthroughOverlay.style.display = 'none';

    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .button-effect.animate {
            animation: ripple 0.6s linear;
        }

        .order-card.drag-over {
            transform: scale(1.02);
            box-shadow: var(--hover-shadow);
            border: 2px dashed var(--primary-color);
        }

        .order-card.reordered {
            animation: pulse 0.5s ease;
        }

        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);

    // Initialize Tour Manager
    const tourManager = new TourManager();

    // Add manual tour trigger button
    const headerActions = document.querySelector('.header-actions');
    const tourButton = document.createElement('button');
    tourButton.className = 'icon-btn tour-trigger';
    tourButton.innerHTML = '<i class="fas fa-route"></i>';
    tourButton.addEventListener('click', () => tourManager.startTour());
    headerActions.insertBefore(tourButton, headerActions.firstChild);
});
