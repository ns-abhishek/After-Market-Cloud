/**
 * Tickets Management Module
 * Handles ticket creation, filtering, and management
 */

// Initialize tickets module
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');

    // Load tickets from localStorage or use default
    loadTickets();

    // Set up event listeners with a slight delay to ensure DOM is fully processed
    setTimeout(() => {
        setupTicketEventListeners();
        console.log('Event listeners set up after delay');
    }, 300);

    // Check for URL parameters (for search results navigation)
    checkUrlParameters();

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

    console.log('Current theme:', currentTheme, 'Dark mode:', isDarkMode);

    if (isDarkMode) {
        // Add dark-theme class to root element if not already present
        document.documentElement.classList.add('dark-theme');

        // Force dark mode on all elements
        document.querySelectorAll('.ticket-item, .tickets-sidebar, .tickets-list, .ticket-status, .ticket-priority').forEach(el => {
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
            .dark-theme .ticket-item p {
                color: var(--text-color) !important;
            }
            .dark-theme .tickets-search {
                background-color: var(--bg-color) !important;
            }
            .dark-theme .tickets-search input {
                color: var(--text-color) !important;
            }
            .dark-theme .modal-container {
                background-color: var(--widget-bg) !important;
                color: var(--text-color) !important;
            }
            .dark-theme .form-control {
                background-color: var(--bg-color) !important;
                color: var(--text-color) !important;
                border-color: var(--border-color) !important;
            }
        `;
        document.head.appendChild(styleTag);
    } else {
        // Remove dark-theme class if present
        document.documentElement.classList.remove('dark-theme');
    }
}

// Set up ticket event listeners
function setupTicketEventListeners() {
    // New ticket button - using ID selector
    const newTicketBtn = document.getElementById('new-ticket-btn');
    if (newTicketBtn) {
        // Define the handler function
        const newTicketHandler = function(e) {
            e.preventDefault();
            console.log('New ticket button clicked');
            showNewTicketModal();
        };

        // Remove any existing event listeners
        newTicketBtn.removeEventListener('click', newTicketHandler);
        // Add new event listener
        newTicketBtn.addEventListener('click', newTicketHandler);
        console.log('New ticket button event listener added');
    } else {
        console.error('New ticket button not found');
    }

    // Refresh button - using ID selector
    const refreshBtn = document.getElementById('refresh-tickets-btn');
    if (refreshBtn) {
        // Define the handler function
        const refreshHandler = function(e) {
            e.preventDefault();
            console.log('Refresh button clicked');
            loadTickets();
        };

        // Remove any existing event listeners
        refreshBtn.removeEventListener('click', refreshHandler);
        // Add new event listener
        refreshBtn.addEventListener('click', refreshHandler);
        console.log('Refresh button event listener added');
    } else {
        console.error('Refresh button not found');
    }

    // Filter checkboxes
    const filterCheckboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            filterTickets();
        });
    });

    // Search input
    const searchInput = document.querySelector('.tickets-search input');
    const searchButton = document.querySelector('.tickets-search button');

    if (searchInput && searchButton) {
        searchButton.addEventListener('click', function() {
            searchTickets(searchInput.value);
        });

        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchTickets(searchInput.value);
            }
        });
    }
}

// Check URL parameters
function checkUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const ticketId = urlParams.get('ticket');

    if (ticketId) {
        // Find ticket
        const ticket = getTicketById(ticketId);

        if (ticket) {
            // Show ticket details
            showTicketDetailsModal(ticket);
        }
    }
}

// Get ticket by ID
function getTicketById(id) {
    const tickets = getTickets();
    return tickets.find(ticket => ticket.id === id);
}

// Get tickets from localStorage
function getTickets() {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) return [];

    // Get tickets
    return JSON.parse(localStorage.getItem(`tickets_${currentUser.id}`)) || getDefaultTickets();
}

// Get default tickets
function getDefaultTickets() {
    const now = new Date().getTime();

    return [
        {
            id: 'ticket1',
            title: 'Unable to access account settings',
            description: 'I\'m trying to change my password but the settings page is not loading correctly.',
            status: 'open',
            priority: 'high',
            created: now - 7200000, // 2 hours ago
            updated: now - 3600000, // 1 hour ago
            comments: [
                {
                    author: 'Support Agent',
                    text: 'Thank you for reporting this issue. Could you please provide more details about the error you\'re seeing?',
                    time: now - 3600000 // 1 hour ago
                }
            ]
        },
        {
            id: 'ticket2',
            title: 'Feature request: Dark mode',
            description: 'Would it be possible to add a dark mode option to the portal?',
            status: 'in-progress',
            priority: 'medium',
            created: now - 86400000, // 1 day ago
            updated: now - 43200000, // 12 hours ago
            comments: [
                {
                    author: 'Support Agent',
                    text: 'Thank you for your suggestion! We\'re currently working on implementing a dark mode option.',
                    time: now - 43200000 // 12 hours ago
                }
            ]
        },
        {
            id: 'ticket3',
            title: 'Question about billing cycle',
            description: 'I have a question about when my subscription renews and how billing works.',
            status: 'resolved',
            priority: 'low',
            created: now - 259200000, // 3 days ago
            updated: now - 172800000, // 2 days ago
            comments: [
                {
                    author: 'Support Agent',
                    text: 'Your subscription renews on the 15th of each month. You can view your billing history in the Account section.',
                    time: now - 172800000 // 2 days ago
                },
                {
                    author: 'John Doe',
                    text: 'Thank you for the information!',
                    time: now - 86400000 // 1 day ago
                }
            ]
        },
        {
            id: 'ticket4',
            title: 'API integration issue',
            description: 'I\'m having trouble integrating with your API. Getting error code 403.',
            status: 'closed',
            priority: 'high',
            created: now - 604800000, // 1 week ago
            updated: now - 518400000, // 6 days ago
            comments: [
                {
                    author: 'Support Agent',
                    text: 'You need to generate a new API key in your account settings. The old one might have expired.',
                    time: now - 518400000 // 6 days ago
                },
                {
                    author: 'John Doe',
                    text: 'That worked! Thank you for your help.',
                    time: now - 432000000 // 5 days ago
                }
            ]
        }
    ];
}

// Save tickets to localStorage
function saveTickets(tickets) {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) return;

    // Save tickets
    localStorage.setItem(`tickets_${currentUser.id}`, JSON.stringify(tickets));
}

// Load tickets
function loadTickets() {
    const tickets = getTickets();
    renderTickets(tickets);
}

// Render tickets
function renderTickets(tickets) {
    const ticketContainer = document.querySelector('.ticket-items');

    if (!ticketContainer) return;

    // Clear container
    ticketContainer.innerHTML = '';

    // If no tickets
    if (tickets.length === 0) {
        ticketContainer.innerHTML = '<div class="no-tickets">No tickets found</div>';
        return;
    }

    // Render each ticket
    tickets.forEach(ticket => {
        const ticketElement = document.createElement('div');
        ticketElement.className = 'ticket-item';
        ticketElement.setAttribute('data-id', ticket.id);

        ticketElement.innerHTML = `
            <div class="ticket-status status-${ticket.status}"></div>
            <div class="ticket-info">
                <h4>${ticket.title}</h4>
                <p>${ticket.description.substring(0, 100)}${ticket.description.length > 100 ? '...' : ''}</p>
                <div class="ticket-meta">
                    <span class="ticket-id">#${ticket.id}</span>
                    <span>Created: ${formatTimeAgo(ticket.created)}</span>
                </div>
            </div>
            <div class="ticket-priority priority-${ticket.priority}">${ticket.priority}</div>
            <div class="ticket-actions">
                <button class="reply-btn"><i class="fas fa-reply"></i></button>
                <button class="more-btn"><i class="fas fa-ellipsis-v"></i></button>
            </div>
        `;

        ticketContainer.appendChild(ticketElement);

        // Add event listeners
        ticketElement.addEventListener('click', function() {
            showTicketDetailsModal(ticket);
        });

        // Reply button
        const replyBtn = ticketElement.querySelector('.reply-btn');
        if (replyBtn) {
            replyBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                showTicketReplyModal(ticket);
            });
        }

        // More button
        const moreBtn = ticketElement.querySelector('.more-btn');
        if (moreBtn) {
            moreBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                showTicketActionsMenu(ticket, this);
            });
        }
    });
}

// Filter tickets
function filterTickets() {
    // Get all tickets
    const allTickets = getTickets();

    // Get selected status filters
    const statusFilters = Array.from(document.querySelectorAll('.filter-group:nth-child(1) input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.parentElement.textContent.trim().toLowerCase());

    // Get selected priority filters
    const priorityFilters = Array.from(document.querySelectorAll('.filter-group:nth-child(2) input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.parentElement.textContent.trim().toLowerCase());

    // Get selected date range filters
    const dateRangeFilters = Array.from(document.querySelectorAll('.filter-group:nth-child(3) input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.parentElement.textContent.trim());

    // Filter tickets
    const filteredTickets = allTickets.filter(ticket => {
        // Status filter
        if (statusFilters.length > 0 && !statusFilters.includes(ticket.status)) {
            return false;
        }

        // Priority filter
        if (priorityFilters.length > 0 && !priorityFilters.includes(ticket.priority)) {
            return false;
        }

        // Date range filter
        if (dateRangeFilters.length > 0) {
            const now = new Date().getTime();
            const ticketDate = ticket.created;
            const daysDiff = Math.floor((now - ticketDate) / (1000 * 60 * 60 * 24));

            let inRange = false;

            dateRangeFilters.forEach(range => {
                if (range === 'Last 7 days' && daysDiff <= 7) inRange = true;
                if (range === 'Last 30 days' && daysDiff <= 30) inRange = true;
                if (range === 'Last 90 days' && daysDiff <= 90) inRange = true;
            });

            if (!inRange) return false;
        }

        return true;
    });

    // Render filtered tickets
    renderTickets(filteredTickets);
}

// Search tickets
function searchTickets(query) {
    if (!query.trim()) {
        loadTickets();
        return;
    }

    // Get all tickets
    const allTickets = getTickets();

    // Filter tickets by query
    const searchResults = allTickets.filter(ticket => {
        const titleMatch = ticket.title.toLowerCase().includes(query.toLowerCase());
        const descriptionMatch = ticket.description.toLowerCase().includes(query.toLowerCase());
        const idMatch = ticket.id.toLowerCase().includes(query.toLowerCase());

        return titleMatch || descriptionMatch || idMatch;
    });

    // Render search results
    renderTickets(searchResults);
}

// Show new ticket modal
function showNewTicketModal() {
    console.log('showNewTicketModal called');

    // Close any existing modals first
    if (typeof closeAllModals === 'function') {
        closeAllModals();
    } else {
        // Fallback if closeAllModals is not available
        const modals = document.querySelectorAll('.modal-overlay');
        modals.forEach(modal => {
            modal.remove();
        });
    }

    // Get current theme
    const currentTheme = getUserPreference('dashboardTheme', 'default');
    const isDarkMode = currentTheme === 'dark';

    // Set colors based on theme
    const bgColor = isDarkMode ? '#1e1e1e' : 'white';
    const textColor = isDarkMode ? '#e0e0e0' : '#333';
    const borderColor = isDarkMode ? '#333' : '#eee';
    const inputBgColor = isDarkMode ? '#121212' : 'white';
    const inputBorderColor = isDarkMode ? '#444' : '#ddd';
    const secondaryBtnBg = isDarkMode ? '#2a2a2a' : '#f5f5f5';
    const secondaryBtnBorder = isDarkMode ? '#444' : '#ddd';
    const secondaryBtnText = isDarkMode ? '#e0e0e0' : '#333';

    // Create modal HTML with proper styling and theme support
    const modalHTML = `
        <div class="modal-overlay" id="new-ticket-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;">
            <div class="modal-container" style="background-color: ${bgColor}; color: ${textColor}; border-radius: 8px; width: 90%; max-width: 600px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); overflow: hidden;">
                <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; border-bottom: 1px solid ${borderColor};">
                    <h3 style="margin: 0; color: ${textColor};">Create New Ticket</h3>
                    <button class="modal-close" style="background: none; border: none; font-size: 18px; cursor: pointer; color: ${textColor};"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body" style="padding: 20px;">
                    <form id="new-ticket-form">
                        <div class="form-group" style="margin-bottom: 15px;">
                            <label for="ticket-title" style="display: block; margin-bottom: 5px; font-weight: 500; color: ${textColor};">Title</label>
                            <input type="text" id="ticket-title" required class="form-control" style="width: 100%; padding: 8px; border: 1px solid ${inputBorderColor}; border-radius: 4px; background-color: ${inputBgColor}; color: ${textColor};">
                        </div>
                        <div class="form-group" style="margin-bottom: 15px;">
                            <label for="ticket-description" style="display: block; margin-bottom: 5px; font-weight: 500; color: ${textColor};">Description</label>
                            <textarea id="ticket-description" rows="5" required class="form-control" style="width: 100%; padding: 8px; border: 1px solid ${inputBorderColor}; border-radius: 4px; resize: vertical; background-color: ${inputBgColor}; color: ${textColor};"></textarea>
                        </div>
                        <div class="form-group" style="margin-bottom: 15px;">
                            <label for="ticket-priority" style="display: block; margin-bottom: 5px; font-weight: 500; color: ${textColor};">Priority</label>
                            <select id="ticket-priority" class="form-control" style="width: 100%; padding: 8px; border: 1px solid ${inputBorderColor}; border-radius: 4px; background-color: ${inputBgColor}; color: ${textColor};">
                                <option value="low">Low</option>
                                <option value="medium" selected>Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div class="modal-footer" style="padding: 15px 20px; border-top: 1px solid ${borderColor}; display: flex; justify-content: flex-end; gap: 10px;">
                    <button class="btn-secondary modal-cancel" style="padding: 8px 15px; background-color: ${secondaryBtnBg}; color: ${secondaryBtnText}; border: 1px solid ${secondaryBtnBorder}; border-radius: 4px; cursor: pointer;">Cancel</button>
                    <button class="btn-primary" id="submit-ticket" style="padding: 8px 15px; background-color: #000000; color: white; border: none; border-radius: 4px; cursor: pointer;">Submit Ticket</button>
                </div>
            </div>
        </div>
    `;

    // Add modal to DOM
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer.firstElementChild);

    // Add event listeners
    setupNewTicketModalEventListeners();
}

// Set up new ticket modal event listeners
function setupNewTicketModalEventListeners() {
    console.log('Setting up new ticket modal event listeners');

    // Close modal
    const closeBtn = document.querySelector('#new-ticket-modal .modal-close');
    const cancelBtn = document.querySelector('#new-ticket-modal .modal-cancel');
    const modalOverlay = document.getElementById('new-ticket-modal');

    if (closeBtn) {
        // Define close handler
        const closeHandler = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Close button clicked');
            modalOverlay.remove();
        };

        // Remove any existing event listeners
        closeBtn.removeEventListener('click', closeHandler);

        // Add new event listener
        closeBtn.addEventListener('click', closeHandler);
        console.log('Close button event listener added');
    } else {
        console.error('Close button not found');
    }

    if (cancelBtn) {
        // Define cancel handler
        const cancelHandler = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Cancel button clicked');
            modalOverlay.remove();
        };

        // Remove any existing event listeners
        cancelBtn.removeEventListener('click', cancelHandler);

        // Add new event listener
        cancelBtn.addEventListener('click', cancelHandler);
        console.log('Cancel button event listener added');
    } else {
        console.error('Cancel button not found');
    }

    // Close modal when clicking outside
    if (modalOverlay) {
        // Define overlay handler
        const overlayHandler = function(e) {
            if (e.target === modalOverlay) {
                console.log('Clicked outside modal');
                modalOverlay.remove();
            }
        };

        // Remove any existing event listeners
        modalOverlay.removeEventListener('click', overlayHandler);

        // Add new event listener
        modalOverlay.addEventListener('click', overlayHandler);
        console.log('Modal overlay event listener added');
    } else {
        console.error('Modal overlay not found');
    }

    // Submit ticket
    const submitBtn = document.getElementById('submit-ticket');
    if (submitBtn) {
        // Define submit handler
        const submitHandler = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Submit button clicked');

            const title = document.getElementById('ticket-title').value;
            const description = document.getElementById('ticket-description').value;
            const priority = document.getElementById('ticket-priority').value;

            if (!title || !description) {
                alert('Please fill in all required fields');
                return;
            }

            createNewTicket(title, description, priority);
            modalOverlay.remove();

            // Refresh the tickets list
            setTimeout(() => {
                loadTickets();
            }, 100);
        };

        // Remove any existing event listeners
        submitBtn.removeEventListener('click', submitHandler);

        // Add new event listener
        submitBtn.addEventListener('click', submitHandler);
        console.log('Submit button event listener added');
    } else {
        console.error('Submit button not found');
    }
}

// Create new ticket
function createNewTicket(title, description, priority) {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) return;

    // Get tickets
    const tickets = getTickets();

    // Create new ticket
    const newTicket = {
        id: 'ticket' + (tickets.length + 1),
        title,
        description,
        status: 'open',
        priority,
        created: new Date().getTime(),
        updated: new Date().getTime(),
        comments: []
    };

    // Add to tickets
    tickets.unshift(newTicket);

    // Save tickets
    saveTickets(tickets);

    // Reload tickets
    loadTickets();

    // Show success message
    showNotification('Ticket created successfully', 'success');

    // Add notification
    addNotification('New ticket created: ' + title, 'info');

    return newTicket;
}

// Show ticket details modal
function showTicketDetailsModal(ticket) {
    // Close any existing modals first
    if (typeof closeAllModals === 'function') {
        closeAllModals();
    } else {
        // Fallback if closeAllModals is not available
        const modals = document.querySelectorAll('.modal-overlay');
        modals.forEach(modal => {
            modal.remove();
        });
    }

    // Create modal HTML
    const modalHTML = `
        <div class="modal-overlay" id="ticket-details-modal">
            <div class="modal-container ticket-details-container">
                <div class="modal-header">
                    <h3>Ticket #${ticket.id}</h3>
                    <button class="modal-close"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <div class="ticket-details">
                        <div class="ticket-details-header">
                            <h4>${ticket.title}</h4>
                            <div class="ticket-details-meta">
                                <span class="ticket-status-badge status-${ticket.status}">${ticket.status}</span>
                                <span class="ticket-priority-badge priority-${ticket.priority}">${ticket.priority}</span>
                            </div>
                        </div>

                        <!-- Status Progress Bar -->
                        <div class="ticket-status-progress">
                            <div class="status-step ${ticket.status === 'open' || ticket.status === 'in-progress' || ticket.status === 'resolved' || ticket.status === 'closed' ? 'active' : ''}">
                                <div class="status-icon"><i class="fas fa-ticket-alt"></i></div>
                                <div class="status-label">Open</div>
                            </div>
                            <div class="status-connector ${ticket.status === 'in-progress' || ticket.status === 'resolved' || ticket.status === 'closed' ? 'active' : ''}"></div>
                            <div class="status-step ${ticket.status === 'in-progress' || ticket.status === 'resolved' || ticket.status === 'closed' ? 'active' : ''}">
                                <div class="status-icon"><i class="fas fa-tools"></i></div>
                                <div class="status-label">In Progress</div>
                            </div>
                            <div class="status-connector ${ticket.status === 'resolved' || ticket.status === 'closed' ? 'active' : ''}"></div>
                            <div class="status-step ${ticket.status === 'resolved' || ticket.status === 'closed' ? 'active' : ''}">
                                <div class="status-icon"><i class="fas fa-check-circle"></i></div>
                                <div class="status-label">Resolved</div>
                            </div>
                            <div class="status-connector ${ticket.status === 'closed' ? 'active' : ''}"></div>
                            <div class="status-step ${ticket.status === 'closed' ? 'active' : ''}">
                                <div class="status-icon"><i class="fas fa-lock"></i></div>
                                <div class="status-label">Closed</div>
                            </div>
                        </div>

                        <div class="ticket-details-info">
                            <div class="info-row">
                                <div class="info-item">
                                    <span class="info-label">Created:</span>
                                    <span class="info-value">${formatDate(ticket.created)}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Last Updated:</span>
                                    <span class="info-value">${formatDate(ticket.updated)}</span>
                                </div>
                            </div>
                        </div>
                        <div class="ticket-details-description">
                            <h5>Description</h5>
                            <div class="description-content">
                                <p>${ticket.description}</p>
                            </div>
                        </div>

                        <!-- Status History -->
                        <div class="ticket-status-history">
                            <h5>Status History</h5>
                            <div class="status-history-list">
                                ${ticket.statusHistory && ticket.statusHistory.length > 0 ?
                                    ticket.statusHistory.map(history => `
                                        <div class="status-history-item">
                                            <div class="status-history-icon">
                                                <i class="fas ${getStatusIcon(history.to)}"></i>
                                            </div>
                                            <div class="status-history-info">
                                                <div class="status-history-user">
                                                    <strong>${history.changedBy}</strong> changed status
                                                </div>
                                                <div class="status-history-action">
                                                    from <span class="status-badge status-${history.from}">${history.from}</span>
                                                    to <span class="status-badge status-${history.to}">${history.to}</span>
                                                </div>
                                                <div class="status-history-time">${formatTimeAgo(history.time)}</div>
                                            </div>
                                        </div>
                                    `).join('')
                                    : '<p class="no-history">No status changes yet</p>'
                                }
                            </div>
                        </div>

                        <div class="ticket-details-comments">
                            <h5>Comments (${ticket.comments.length})</h5>
                            ${ticket.comments.length > 0 ?
                                `<div class="comments-list">
                                    ${ticket.comments.map(comment => `
                                        <div class="comment ${comment.isSystemComment ? 'system-comment' : ''}">
                                            <div class="comment-header">
                                                <div class="comment-author-container">
                                                    <span class="comment-avatar"><i class="fas fa-user-circle"></i></span>
                                                    <span class="comment-author">${comment.author} ${comment.isSystemComment ? '<span class="system-badge">System</span>' : ''}</span>
                                                </div>
                                                <span class="comment-time">${formatTimeAgo(comment.time)}</span>
                                            </div>
                                            <div class="comment-body">
                                                <p>${comment.text}</p>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>`
                                : '<p class="no-comments">No comments yet</p>'
                            }
                        </div>
                        <div class="ticket-details-reply">
                            <h5>Add Comment</h5>
                            <div class="reply-form">
                                <div class="reply-avatar">
                                    <i class="fas fa-user-circle"></i>
                                </div>
                                <div class="reply-input-container">
                                    <textarea id="comment-text" rows="2" placeholder="Type your comment here..." class="form-control"></textarea>
                                    <button type="button" class="btn-primary" id="add-comment-btn">Add Comment</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="ticket-actions-dropdown">
                        <button class="btn-secondary dropdown-toggle">Change Status <i class="fas fa-caret-down"></i></button>
                        <div class="dropdown-menu status-dropdown">
                            ${ticket.status !== 'open' ? `<button class="open-ticket-btn">Mark as Open</button>` : ''}
                            ${ticket.status !== 'in-progress' ? `<button class="in-progress-ticket-btn">Mark as In Progress</button>` : ''}
                            ${ticket.status !== 'resolved' ? `<button class="resolve-ticket-btn">Mark as Resolved</button>` : ''}
                            ${ticket.status !== 'closed' ? `<button class="close-ticket-btn">Close Ticket</button>` : ''}
                            ${ticket.status === 'closed' ? `<button class="reopen-ticket-btn">Reopen Ticket</button>` : ''}
                        </div>
                    </div>
                    <button class="btn-primary" id="close-details-btn">Close</button>
                </div>
            </div>
        </div>
    `;

    // Add modal to DOM
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer.firstElementChild);

    // Add styles
    addTicketDetailsStyles();

    // Add event listeners
    setupTicketDetailsModalEventListeners(ticket);
}

// Get status icon
function getStatusIcon(status) {
    switch (status) {
        case 'open':
            return 'fa-ticket-alt';
        case 'in-progress':
            return 'fa-tools';
        case 'resolved':
            return 'fa-check-circle';
        case 'closed':
            return 'fa-lock';
        default:
            return 'fa-info-circle';
    }
}

// Add ticket details styles
function addTicketDetailsStyles() {
    // Create style element if it doesn't exist
    let styleElement = document.getElementById('ticket-details-styles');

    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'ticket-details-styles';
        document.head.appendChild(styleElement);

        // Add styles
        styleElement.textContent = `
            .ticket-details-container {
                width: 90%;
                max-width: 800px;
                height: auto;
                max-height: 90vh;
                display: flex;
                flex-direction: column;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                overflow: hidden;
                border-radius: 8px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                animation: ticketModalFadeIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                background-color: white;
            }

            @keyframes ticketModalFadeIn {
                from {
                    opacity: 0;
                    transform: translate(-50%, -48%) scale(0.96);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }

            .modal-header {
                border-bottom: 1px solid var(--border-color);
                padding: 15px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background-color: var(--widget-bg);
            }

            .modal-body {
                overflow-y: auto;
                max-height: calc(80vh - 130px);
                flex: 1;
                padding: 20px;
            }

            .modal-footer {
                border-top: 1px solid var(--border-color);
                padding: 15px 20px;
                display: flex;
                justify-content: space-between;
                background-color: var(--widget-bg);
            }
            .ticket-details {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .ticket-details-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                border-bottom: 1px solid var(--border-color);
                padding-bottom: 10px;
                margin-bottom: 5px;
            }

            .ticket-details-header h4 {
                margin: 0;
                font-size: 18px;
            }

            .ticket-details-meta {
                display: flex;
                gap: 10px;
            }

            .ticket-status-badge, .ticket-priority-badge, .status-badge {
                padding: 5px 10px;
                border-radius: 20px;
                font-size: 12px;
                text-transform: capitalize;
            }

            .ticket-status-badge.status-open, .status-badge.status-open {
                background-color: #e6f7ff;
                color: #1890ff;
            }

            .ticket-status-badge.status-in-progress, .status-badge.status-in-progress {
                background-color: #fff7e6;
                color: #fa8c16;
            }

            .ticket-status-badge.status-resolved, .status-badge.status-resolved {
                background-color: #f6ffed;
                color: #52c41a;
            }

            .ticket-status-badge.status-closed, .status-badge.status-closed {
                background-color: #f0f0f0;
                color: #666;
            }

            .ticket-priority-badge.priority-low {
                background-color: #f6ffed;
                color: #52c41a;
            }

            .ticket-priority-badge.priority-medium {
                background-color: #fff7e6;
                color: #fa8c16;
            }

            .ticket-priority-badge.priority-high {
                background-color: #fff1f0;
                color: #f5222d;
            }

            /* Status Progress Bar */
            .ticket-status-progress {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin: 15px 0;
                position: relative;
            }

            .status-step {
                display: flex;
                flex-direction: column;
                align-items: center;
                position: relative;
                z-index: 2;
            }

            .status-icon {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background-color: #f0f0f0;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #999;
                margin-bottom: 4px;
                transition: all 0.3s ease;
            }

            .status-step.active .status-icon {
                background-color: var(--primary-color);
                color: white;
                box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
            }

            .status-label {
                font-size: 11px;
                color: #999;
                transition: all 0.3s ease;
            }

            .status-step.active .status-label {
                color: var(--primary-color);
                font-weight: 600;
            }

            .status-connector {
                flex: 1;
                height: 3px;
                background-color: #f0f0f0;
                position: relative;
                z-index: 1;
                transition: all 0.3s ease;
            }

            .status-connector.active {
                background-color: var(--primary-color);
            }

            /* Status History */
            .ticket-status-history {
                background-color: var(--hover-bg);
                border-radius: 8px;
                padding: 15px;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
            }

            .status-history-list {
                display: flex;
                flex-direction: column;
                gap: 10px;
                max-height: 120px;
                overflow-y: auto;
                padding-right: 5px;
            }

            .status-history-item {
                display: flex;
                gap: 15px;
                padding-bottom: 15px;
                border-bottom: 1px dashed var(--border-color);
                transition: all 0.2s ease;
            }

            .status-history-item:hover {
                background-color: rgba(0, 0, 0, 0.02);
            }

            .status-history-item:last-child {
                border-bottom: none;
                padding-bottom: 0;
            }

            .status-history-icon {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background-color: var(--primary-color);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                flex-shrink: 0;
            }

            .status-history-info {
                flex: 1;
            }

            .status-history-user {
                font-weight: 500;
                margin-bottom: 3px;
            }

            .status-history-action {
                margin-bottom: 3px;
            }

            .status-history-time {
                font-size: 12px;
                color: var(--accent-color);
            }

            .ticket-details-info {
                display: flex;
                gap: 20px;
                font-size: 14px;
                color: var(--accent-color);
                background-color: var(--hover-bg);
                border-radius: 8px;
                padding: 15px;
            }

            .info-row {
                display: flex;
                flex-wrap: wrap;
                gap: 20px;
                width: 100%;
            }

            .info-item {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .info-label {
                font-weight: 600;
                color: var(--accent-color);
            }

            .info-value {
                color: var(--text-color);
            }

            .ticket-details-description h5, .ticket-details-comments h5, .ticket-details-reply h5, .ticket-status-history h5 {
                margin-top: 0;
                margin-bottom: 8px;
                font-size: 15px;
                border-bottom: 1px solid var(--border-color);
                padding-bottom: 4px;
            }

            .description-content {
                background-color: var(--hover-bg);
                border-radius: 8px;
                padding: 15px;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
            }

            .description-content p {
                margin: 0;
                line-height: 1.6;
            }

            .comments-list {
                display: flex;
                flex-direction: column;
                gap: 10px;
                max-height: 150px;
                overflow-y: auto;
                padding-right: 5px;
            }

            .comment {
                background-color: var(--hover-bg);
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 10px;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
                transition: all 0.2s ease;
                color: var(--text-color);
            }

            .comment:hover {
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }

            .comment.system-comment {
                background-color: rgba(0, 0, 0, 0.03);
                border-left: 3px solid var(--primary-color);
            }

            /* Dark mode specific styles */
            .dark-mode .ticket-details-container {
                background-color: var(--widget-bg);
                border: 1px solid var(--border-color);
            }

            .dark-mode .modal-header,
            .dark-mode .modal-footer {
                background-color: var(--widget-bg);
                border-color: var(--border-color);
            }

            .dark-mode .description-content,
            .dark-mode .ticket-status-history,
            .dark-mode .comment,
            .dark-mode .reply-form {
                background-color: rgba(255, 255, 255, 0.05);
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
            }

            .dark-mode .comment.system-comment {
                background-color: rgba(0, 0, 0, 0.2);
            }

            .dark-mode .status-history-item:hover {
                background-color: rgba(255, 255, 255, 0.05);
            }

            /* Custom scrollbar styles */
            .status-history-list::-webkit-scrollbar,
            .comments-list::-webkit-scrollbar,
            .modal-body::-webkit-scrollbar {
                width: 8px;
            }

            .status-history-list::-webkit-scrollbar-track,
            .comments-list::-webkit-scrollbar-track,
            .modal-body::-webkit-scrollbar-track {
                background: transparent;
            }

            .status-history-list::-webkit-scrollbar-thumb,
            .comments-list::-webkit-scrollbar-thumb,
            .modal-body::-webkit-scrollbar-thumb {
                background-color: rgba(0, 0, 0, 0.2);
                border-radius: 4px;
            }

            .dark-mode .status-history-list::-webkit-scrollbar-thumb,
            .dark-mode .comments-list::-webkit-scrollbar-thumb,
            .dark-mode .modal-body::-webkit-scrollbar-thumb {
                background-color: rgba(255, 255, 255, 0.2);
            }

            .system-badge {
                background-color: var(--primary-color);
                color: white;
                font-size: 10px;
                padding: 2px 5px;
                border-radius: 10px;
                margin-left: 5px;
                font-weight: normal;
            }

            .comment-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                font-size: 14px;
            }

            .comment-author-container {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .comment-avatar {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background-color: var(--primary-color);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
            }

            .comment-author {
                font-weight: 600;
            }

            .comment-time {
                color: var(--accent-color);
            }

            .comment-body p {
                margin: 0;
            }

            .no-comments {
                color: var(--accent-color);
                font-style: italic;
            }

            .reply-form {
                display: flex;
                gap: 10px;
                align-items: flex-start;
                background-color: var(--hover-bg);
                border-radius: 8px;
                padding: 10px;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
            }

            .reply-avatar {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background-color: var(--primary-color);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                flex-shrink: 0;
            }

            .reply-input-container {
                flex: 1;
            }

            #comment-text {
                width: 100%;
                padding: 8px;
                border: 1px solid var(--border-color);
                border-radius: 4px;
                margin-bottom: 8px;
                resize: vertical;
                background-color: var(--widget-bg);
                font-size: 14px;
            }

            #add-comment-btn {
                float: right;
            }

            .ticket-actions-dropdown {
                position: relative;
            }

            .dropdown-toggle {
                display: flex;
                align-items: center;
                gap: 5px;
            }

            .dropdown-menu {
                position: absolute;
                top: 100%;
                left: 0;
                background-color: white;
                border: 1px solid var(--border-color);
                border-radius: 4px;
                box-shadow: var(--shadow);
                min-width: 180px;
                display: none;
                z-index: 1010;
                margin-top: 5px;
            }

            .dropdown-menu.status-dropdown {
                bottom: 100%;
                top: auto;
                margin-top: 0;
                margin-bottom: 5px;
                max-height: 200px;
                overflow-y: auto;
            }

            .ticket-actions-dropdown {
                position: relative;
            }

            .dropdown-menu button {
                display: block;
                width: 100%;
                text-align: left;
                padding: 8px 15px;
                background: transparent;
                border: none;
                cursor: pointer;
                transition: var(--transition);
            }

            .dropdown-menu button:hover {
                background-color: #f5f5f5;
            }

            .ticket-actions-dropdown:hover .dropdown-menu {
                display: block;
            }
        `;
    }
}

// Set up ticket details modal event listeners
function setupTicketDetailsModalEventListeners(ticket) {
    // Close modal
    const closeBtn = document.querySelector('#ticket-details-modal .modal-close');
    const closeDetailsBtn = document.getElementById('close-details-btn');
    const modalOverlay = document.getElementById('ticket-details-modal');

    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modalOverlay.remove();
        });
    }

    if (closeDetailsBtn) {
        closeDetailsBtn.addEventListener('click', function() {
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

    // Add comment
    const addCommentBtn = document.getElementById('add-comment-btn');
    if (addCommentBtn) {
        // Define the comment handler function
        function commentHandler(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Add comment button clicked');
            const commentText = document.getElementById('comment-text').value;

            if (!commentText.trim()) {
                alert('Please enter a comment');
                return;
            }

            addComment(ticket.id, commentText);

            // Reload ticket details
            modalOverlay.remove();
            showTicketDetailsModal(getTicketById(ticket.id));
        }

        // Remove any existing event listeners
        addCommentBtn.removeEventListener('click', commentHandler);

        // Add new event listener - use direct onclick to ensure it works
        addCommentBtn.onclick = commentHandler;
        console.log('Add comment button event listener added via onclick');
    } else {
        console.error('Add comment button not found');
    }

    // Mark as open
    const openTicketBtn = document.querySelector('.open-ticket-btn');
    if (openTicketBtn) {
        openTicketBtn.addEventListener('click', function() {
            const updatedTicket = updateTicketStatus(ticket.id, 'open');

            // Reload ticket details
            modalOverlay.remove();
            showTicketDetailsModal(updatedTicket);
        });
    }

    // Close ticket
    const closeTicketBtn = document.querySelector('.close-ticket-btn');
    if (closeTicketBtn) {
        closeTicketBtn.addEventListener('click', function() {
            const updatedTicket = updateTicketStatus(ticket.id, 'closed');

            // Reload ticket details
            modalOverlay.remove();
            showTicketDetailsModal(updatedTicket);
        });
    }

    // Reopen ticket
    const reopenTicketBtn = document.querySelector('.reopen-ticket-btn');
    if (reopenTicketBtn) {
        reopenTicketBtn.addEventListener('click', function() {
            const updatedTicket = updateTicketStatus(ticket.id, 'open');

            // Reload ticket details
            modalOverlay.remove();
            showTicketDetailsModal(updatedTicket);
        });
    }

    // Mark as in progress
    const inProgressTicketBtn = document.querySelector('.in-progress-ticket-btn');
    if (inProgressTicketBtn) {
        inProgressTicketBtn.addEventListener('click', function() {
            const updatedTicket = updateTicketStatus(ticket.id, 'in-progress');

            // Reload ticket details
            modalOverlay.remove();
            showTicketDetailsModal(updatedTicket);
        });
    }

    // Mark as resolved
    const resolveTicketBtn = document.querySelector('.resolve-ticket-btn');
    if (resolveTicketBtn) {
        resolveTicketBtn.addEventListener('click', function() {
            const updatedTicket = updateTicketStatus(ticket.id, 'resolved');

            // Reload ticket details
            modalOverlay.remove();
            showTicketDetailsModal(updatedTicket);
        });
    }
}

// Add comment to ticket
function addComment(ticketId, text) {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) return;

    // Get tickets
    const tickets = getTickets();

    // Find ticket
    const ticketIndex = tickets.findIndex(t => t.id === ticketId);

    if (ticketIndex === -1) return;

    // Add comment
    const comment = {
        author: currentUser.name,
        text,
        time: new Date().getTime()
    };

    tickets[ticketIndex].comments.push(comment);
    tickets[ticketIndex].updated = new Date().getTime();

    // Save tickets
    saveTickets(tickets);

    // Show success message
    showNotification('Comment added successfully', 'success');

    // Add notification
    addNotification('New comment on ticket #' + ticketId, 'info');

    return comment;
}

// Update ticket status
function updateTicketStatus(ticketId, status) {
    // Get tickets
    const tickets = getTickets();

    // Find ticket
    const ticketIndex = tickets.findIndex(t => t.id === ticketId);

    if (ticketIndex === -1) return;

    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;

    // Get old status for comparison
    const oldStatus = tickets[ticketIndex].status;

    // Update status
    tickets[ticketIndex].status = status;
    tickets[ticketIndex].updated = new Date().getTime();

    // Add status change comment
    const statusChangeComment = {
        author: currentUser.name,
        text: `Status changed from "${oldStatus}" to "${status}"`,
        time: new Date().getTime(),
        isSystemComment: true
    };

    tickets[ticketIndex].comments.push(statusChangeComment);

    // Add status history if it doesn't exist
    if (!tickets[ticketIndex].statusHistory) {
        tickets[ticketIndex].statusHistory = [];
    }

    // Add to status history
    tickets[ticketIndex].statusHistory.push({
        from: oldStatus,
        to: status,
        changedBy: currentUser.name,
        time: new Date().getTime()
    });

    // Save tickets
    saveTickets(tickets);

    // Reload tickets
    loadTickets();

    // Show success message
    showNotification(`Ticket marked as ${status}`, 'success');

    // Add notification
    addNotification(`Ticket #${ticketId} status changed to ${status}`, 'info');

    return tickets[ticketIndex];
}

// Show ticket reply modal
function showTicketReplyModal(ticket) {
    // Close any existing modals first
    if (typeof closeAllModals === 'function') {
        closeAllModals();
    } else {
        // Fallback if closeAllModals is not available
        const modals = document.querySelectorAll('.modal-overlay');
        modals.forEach(modal => {
            modal.remove();
        });
    }

    // Create modal HTML
    const modalHTML = `
        <div class="modal-overlay" id="ticket-reply-modal">
            <div class="modal-container">
                <div class="modal-header">
                    <h3>Reply to Ticket #${ticket.id}</h3>
                    <button class="modal-close"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <div class="ticket-reply">
                        <div class="ticket-info">
                            <h4>${ticket.title}</h4>
                            <p>${ticket.description.substring(0, 100)}${ticket.description.length > 100 ? '...' : ''}</p>
                        </div>
                        <div class="form-group">
                            <label for="reply-text">Your Reply</label>
                            <textarea id="reply-text" rows="5" required class="form-control"></textarea>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary modal-cancel">Cancel</button>
                    <button class="btn-primary" id="submit-reply">Send Reply</button>
                </div>
            </div>
        </div>
    `;

    // Add modal to DOM
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer.firstElementChild);

    // Add event listeners
    setupTicketReplyModalEventListeners(ticket);
}

// Set up ticket reply modal event listeners
function setupTicketReplyModalEventListeners(ticket) {
    // Close modal
    const closeBtn = document.querySelector('#ticket-reply-modal .modal-close');
    const cancelBtn = document.querySelector('#ticket-reply-modal .modal-cancel');
    const modalOverlay = document.getElementById('ticket-reply-modal');

    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modalOverlay.remove();
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
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

    // Submit reply
    const submitBtn = document.getElementById('submit-reply');
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            const replyText = document.getElementById('reply-text').value;

            if (!replyText.trim()) {
                alert('Please enter a reply');
                return;
            }

            addComment(ticket.id, replyText);
            modalOverlay.remove();
        });
    }
}

// Show ticket actions menu
function showTicketActionsMenu(ticket, buttonElement) {
    // Check if menu already exists
    const existingMenu = document.querySelector('.ticket-actions-menu');
    if (existingMenu) {
        existingMenu.remove();
        return;
    }

    // Create menu HTML
    const menuHTML = `
        <div class="ticket-actions-menu">
            <button class="view-ticket-btn">View Details</button>
            <button class="reply-ticket-btn">Reply</button>
            ${ticket.status !== 'closed' ? `<button class="close-ticket-btn">Close Ticket</button>` : ''}
            ${ticket.status === 'closed' ? `<button class="reopen-ticket-btn">Reopen Ticket</button>` : ''}
            ${ticket.status === 'open' ? `<button class="in-progress-ticket-btn">Mark as In Progress</button>` : ''}
            ${ticket.status === 'in-progress' ? `<button class="resolve-ticket-btn">Mark as Resolved</button>` : ''}
        </div>
    `;

    // Create menu element
    const menuElement = document.createElement('div');
    menuElement.innerHTML = menuHTML;

    // Position menu
    const menu = menuElement.firstElementChild;
    menu.style.position = 'absolute';
    menu.style.top = `${buttonElement.offsetTop + buttonElement.offsetHeight}px`;
    menu.style.right = `${document.body.offsetWidth - (buttonElement.offsetLeft + buttonElement.offsetWidth)}px`;
    menu.style.backgroundColor = 'white';
    menu.style.border = '1px solid var(--border-color)';
    menu.style.borderRadius = '4px';
    menu.style.boxShadow = 'var(--shadow)';
    menu.style.zIndex = '100';

    // Style menu buttons
    const menuButtons = menu.querySelectorAll('button');
    menuButtons.forEach(button => {
        button.style.display = 'block';
        button.style.width = '100%';
        button.style.textAlign = 'left';
        button.style.padding = '8px 15px';
        button.style.background = 'transparent';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        button.style.transition = 'var(--transition)';

        button.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#f5f5f5';
        });

        button.addEventListener('mouseout', function() {
            this.style.backgroundColor = 'transparent';
        });
    });

    // Add menu to DOM
    document.body.appendChild(menu);

    // Add event listeners
    setupTicketActionsMenuEventListeners(ticket, menu);

    // Close menu when clicking outside
    document.addEventListener('click', function closeMenu(e) {
        if (!menu.contains(e.target) && e.target !== buttonElement) {
            menu.remove();
            document.removeEventListener('click', closeMenu);
        }
    });
}

// Set up ticket actions menu event listeners
function setupTicketActionsMenuEventListeners(ticket, menu) {
    // View ticket
    const viewTicketBtn = menu.querySelector('.view-ticket-btn');
    if (viewTicketBtn) {
        viewTicketBtn.addEventListener('click', function() {
            menu.remove();
            showTicketDetailsModal(ticket);
        });
    }

    // Reply to ticket
    const replyTicketBtn = menu.querySelector('.reply-ticket-btn');
    if (replyTicketBtn) {
        replyTicketBtn.addEventListener('click', function() {
            menu.remove();
            showTicketReplyModal(ticket);
        });
    }

    // Close ticket
    const closeTicketBtn = menu.querySelector('.close-ticket-btn');
    if (closeTicketBtn) {
        closeTicketBtn.addEventListener('click', function() {
            menu.remove();
            updateTicketStatus(ticket.id, 'closed');
        });
    }

    // Reopen ticket
    const reopenTicketBtn = menu.querySelector('.reopen-ticket-btn');
    if (reopenTicketBtn) {
        reopenTicketBtn.addEventListener('click', function() {
            menu.remove();
            updateTicketStatus(ticket.id, 'open');
        });
    }

    // Mark as in progress
    const inProgressTicketBtn = menu.querySelector('.in-progress-ticket-btn');
    if (inProgressTicketBtn) {
        inProgressTicketBtn.addEventListener('click', function() {
            menu.remove();
            updateTicketStatus(ticket.id, 'in-progress');
        });
    }

    // Mark as resolved
    const resolveTicketBtn = menu.querySelector('.resolve-ticket-btn');
    if (resolveTicketBtn) {
        resolveTicketBtn.addEventListener('click', function() {
            menu.remove();
            updateTicketStatus(ticket.id, 'resolved');
        });
    }
}

// Format date
function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
}

// Format time ago (similar to the one in main.js)
function formatTimeAgo(timestamp) {
    const now = new Date().getTime();
    const diff = now - timestamp;

    // Less than a minute
    if (diff < 60000) {
        return 'Just now';
    }

    // Less than an hour
    if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }

    // Less than a day
    if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }

    // Less than a week
    if (diff < 604800000) {
        const days = Math.floor(diff / 86400000);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }

    // Format date
    const date = new Date(timestamp);
    return date.toLocaleDateString();
}

// Show notification (using the function from main.js)
function showNotification(message, type = 'info') {
    // Check if the function exists in the global scope
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
        return;
    }

    // Create notification element if it doesn't exist
    let notification = document.querySelector('.notification');

    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);

        // Add styles
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '15px 20px';
        notification.style.borderRadius = '4px';
        notification.style.color = 'white';
        notification.style.zIndex = '1000';
        notification.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        notification.style.transition = 'all 0.3s ease';
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
    }

    // Set type-specific styles
    if (type === 'success') {
        notification.style.backgroundColor = '#28a745';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#dc3545';
    } else if (type === 'warning') {
        notification.style.backgroundColor = '#ffc107';
        notification.style.color = '#333';
    } else {
        notification.style.backgroundColor = '#17a2b8';
    }

    // Set message
    notification.textContent = message;

    // Show notification
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);

    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
    }, 3000);
}

// Add notification (using the function from main.js)
function addNotification(message, type = 'info') {
    // Check if the function exists in the global scope
    if (typeof window.addNotification === 'function') {
        window.addNotification(message, type);
    }
}
