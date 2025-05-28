/**
 * Calendar Widget Module
 * Adds a dynamic calendar widget to the dashboard showing May 2025 by default
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Calendar widget module loaded');

    // Check if we're on the dashboard page
    if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
        // Add calendar widget to dashboard
        addCalendarWidget();
    }
});

// Calendar state
let currentCalendarDate = new Date(2025, 4, 1); // May 2025 (month is 0-indexed)
let calendarEvents = [
    {
        id: 1,
        title: 'Product Demo',
        date: new Date(2025, 4, 16), // May 16, 2025
        startTime: '10:00 AM',
        endTime: '11:30 AM',
        description: 'Demonstrate new product features to the client'
    },
    {
        id: 2,
        title: 'Team Meeting',
        date: new Date(2025, 4, 19), // May 19, 2025
        startTime: '2:00 PM',
        endTime: '3:30 PM',
        description: 'Weekly team sync-up meeting'
    },
    {
        id: 3,
        title: 'Quarterly Review',
        date: new Date(2025, 4, 26), // May 26, 2025
        startTime: '9:00 AM',
        endTime: '12:00 PM',
        description: 'Q2 2025 performance review'
    }
];

/**
 * Add calendar widget to dashboard
 */
function addCalendarWidget() {
    console.log('Adding calendar widget to dashboard');

    // Check if a calendar widget already exists
    const existingCalendarWidget = document.querySelector('.widget-calendar');
    if (existingCalendarWidget) {
        console.log('Replacing existing calendar widget');
        // Remove the existing calendar widget
        existingCalendarWidget.remove();
    }

    // Create widget HTML
    const calendarWidgetHTML = `
        <div class="widget widget-calendar">
            <div class="widget-header">
                <h3>Calendar</h3>
                <div class="widget-actions">
                    <i class="fas fa-ellipsis-v"></i>
                </div>
            </div>
            <div class="widget-content">
                <div class="calendar-header">
                    <button class="calendar-nav prev"><i class="fas fa-chevron-left"></i></button>
                    <h4 class="calendar-title">${formatMonthYear(currentCalendarDate)}</h4>
                    <button class="calendar-nav next"><i class="fas fa-chevron-right"></i></button>
                </div>
                <div class="calendar-grid" >
                    <div class="calendar-day-header">Sun</div>
                    <div class="calendar-day-header">Mon</div>
                    <div class="calendar-day-header">Tue</div>
                    <div class="calendar-day-header">Wed</div>
                    <div class="calendar-day-header">Thu</div>
                    <div class="calendar-day-header">Fri</div>
                    <div class="calendar-day-header">Sat</div>

                    ${generateCalendarDays(currentCalendarDate)}
                </div>
                <div class="calendar-events">
                    ${generateEventsHTML(currentCalendarDate)}
                </div>
                <div class="calendar-actions">
                    <button class="btn-primary add-event-btn"><i class="fas fa-plus"></i> Add Event</button>
                </div>
            </div>
        </div>
    `;

    // Add calendar styles
    addCalendarStyles();

    // Add widget to dashboard
    const dashboardWidgets = document.querySelector('.dashboard-widgets');
    if (dashboardWidgets) {
        // Create a container for the widget
        const widgetContainer = document.createElement('div');
        widgetContainer.innerHTML = calendarWidgetHTML;

        // Append to dashboard
        dashboardWidgets.appendChild(widgetContainer.firstElementChild);

        // Set up event listeners
        setupCalendarEventListeners();

        console.log('Calendar widget added to dashboard');
    } else {
        console.error('Dashboard widgets container not found');
    }
}

/**
 * Format month and year for display
 * @param {Date} date - Date to format
 * @returns {string} Formatted month and year
 */
function formatMonthYear(date) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * Generate calendar days HTML
 * @param {Date} date - Date to generate calendar for
 * @returns {string} HTML for calendar days
 */
function generateCalendarDays(date) {
    // Clone the date to avoid modifying the original
    const currentDate = new Date(date);

    // Set to the first day of the month
    currentDate.setDate(1);

    // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfMonth = currentDate.getDay();

    // Get the number of days in the month
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

    // Generate empty cells for days before the first day of the month
    let calendarHTML = '';
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarHTML += `<div class="calendar-day empty"></div>`;
    }

    // Generate cells for each day of the month
    for (let day = 1; day <= lastDay; day++) {
        const currentDayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const hasEvent = calendarEvents.some(event =>
            event.date.getDate() === day &&
            event.date.getMonth() === currentDate.getMonth() &&
            event.date.getFullYear() === currentDate.getFullYear()
        );

        calendarHTML += `
            <div class="calendar-day${hasEvent ? ' has-event' : ''}" data-date="${currentDayDate.toISOString().split('T')[0]}" style="margin-left:45px">
                ${day}
            </div>
        `;
    }

    return calendarHTML;
}

/**
 * Generate events HTML for the current month
 * @param {Date} date - Current month date
 * @returns {string} HTML for events
 */
function generateEventsHTML(date) {
    // Filter events for the current month
    const currentMonthEvents = calendarEvents.filter(event =>
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );

    // Sort events by date
    currentMonthEvents.sort((a, b) => a.date - b.date);

    // If no events
    if (currentMonthEvents.length === 0) {
        return '<div class="no-events">No events scheduled for this month</div>';
    }

    // Generate HTML for each event
    return currentMonthEvents.map(event => {
        const eventDate = event.date;
        const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][eventDate.getMonth()];

        return `
            <div class="calendar-event" data-event-id="${event.id}">
                <div class="event-date">${month} ${eventDate.getDate()}</div>
                <div class="event-details">
                    <h5>${event.title}</h5>
                    <p>${event.startTime} - ${event.endTime}</p>
                </div>
                <div class="event-actions">
                    <button class="event-edit" title="Edit Event"><i class="fas fa-edit"></i></button>
                    <button class="event-delete" title="Delete Event"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Show event details
 * @param {number} eventId - Event ID
 */
function showEventDetails(eventId) {
    // Find event by ID
    const event = calendarEvents.find(e => e.id === eventId);

    if (!event) {
        console.error('Event not found:', eventId);
        return;
    }

    // Format date for display
    const formattedDate = event.date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Get theme colors
    const isDarkMode = document.body.classList.contains('dark-theme');
    const bgColor = isDarkMode ? 'var(--widget-bg)' : 'white';
    const textColor = isDarkMode ? 'var(--text-color)' : '#333';
    const borderColor = isDarkMode ? 'var(--border-color)' : '#e0e0e0';
    const labelColor = isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#666';

    // Create modal HTML with ticket-style container
    const modalHTML = `
        <div class="modal-overlay" id="event-details-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;">
            <div class="modal-container" style="background-color: ${bgColor}; color: ${textColor}; border-radius: 8px; width: 90%; max-width: 600px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); overflow: hidden; animation: modalFadeIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
                <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; border-bottom: 1px solid ${borderColor};">
                    <h3 style="margin: 0; color: ${textColor};">${event.title}</h3>
                    <button class="modal-close" style="background: none; border: none; cursor: pointer; font-size: 16px; color: ${textColor};"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body" style="padding: 20px; max-height: 60vh; overflow-y: auto;">
                    <div class="event-detail-item" style="display: flex; margin-bottom: 15px;">
                        <div class="event-detail-label" style="width: 100px; font-weight: 600; color: ${labelColor};">Date:</div>
                        <div class="event-detail-value" style="flex: 1; color: ${textColor};">${formattedDate}</div>
                    </div>
                    <div class="event-detail-item" style="display: flex; margin-bottom: 15px;">
                        <div class="event-detail-label" style="width: 100px; font-weight: 600; color: ${labelColor};">Time:</div>
                        <div class="event-detail-value" style="flex: 1; color: ${textColor};">${event.startTime} - ${event.endTime}</div>
                    </div>
                    <div class="event-detail-item" style="display: flex; margin-bottom: 15px;">
                        <div class="event-detail-label" style="width: 100px; font-weight: 600; color: ${labelColor};">Description:</div>
                        <div class="event-detail-value" style="flex: 1; color: ${textColor};">${event.description || 'No description provided'}</div>
                    </div>
                </div>
                <div class="modal-footer" style="display: flex; justify-content: flex-end; gap: 10px; padding: 15px 20px; border-top: 1px solid ${borderColor};">
                    <button class="btn-secondary event-details-close" style="padding: 8px 15px; background-color: ${isDarkMode ? '#333' : '#e0e0e0'}; color: ${textColor}; border: none; border-radius: 4px; cursor: pointer;">Close</button>
                    <button class="btn-primary event-details-edit" style="padding: 8px 15px; background-color: #000000; color: white; border: none; border-radius: 4px; cursor: pointer;">Edit Event</button>
                </div>
            </div>
        </div>
    `;

    // Add modal to DOM
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer.firstElementChild);

    // Add event listeners
    setupEventDetailsModalListeners(eventId);
}

/**
 * Set up event listeners for event details modal
 * @param {number} eventId - Event ID
 */
function setupEventDetailsModalListeners(eventId) {
    const modal = document.getElementById('event-details-modal');

    // Close button
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.remove();
        });
    }

    // Close when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Close button in footer
    const closeFooterBtn = modal.querySelector('.event-details-close');
    if (closeFooterBtn) {
        closeFooterBtn.addEventListener('click', function() {
            modal.remove();
        });
    }

    // Edit button
    const editBtn = modal.querySelector('.event-details-edit');
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            modal.remove();
            editEvent(eventId);
        });
    }
}

/**
 * Show add event modal
 * @param {Date} [date] - Optional date to pre-fill
 */
function showAddEventModal(date) {
    // Default date if not provided
    const eventDate = date || new Date();

    // Format date for input value
    const dateValue = eventDate.toISOString().split('T')[0];

    // Get theme colors
    const isDarkMode = document.body.classList.contains('dark-theme');
    const bgColor = isDarkMode ? 'var(--widget-bg)' : 'white';
    const textColor = isDarkMode ? 'var(--text-color)' : '#333';
    const borderColor = isDarkMode ? 'var(--border-color)' : '#e0e0e0';
    const inputBgColor = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'white';

    // Create modal HTML with ticket-style container
    const modalHTML = `
        <div class="modal-overlay" id="add-event-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;">
            <div class="modal-container" style="background-color: ${bgColor}; color: ${textColor}; border-radius: 8px; width: 90%; max-width: 600px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); overflow: hidden; animation: modalFadeIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
                <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; border-bottom: 1px solid ${borderColor};">
                    <h3 style="margin: 0; color: ${textColor};">Add New Event</h3>
                    <button class="modal-close" style="background: none; border: none; cursor: pointer; font-size: 16px; color: ${textColor};"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body" style="padding: 20px; max-height: 60vh; overflow-y: auto;">
                    <form id="add-event-form">
                        <div class="form-group" style="margin-bottom: 15px;">
                            <label for="event-title" style="display: block; margin-bottom: 5px; font-weight: 500; color: ${textColor};">Title</label>
                            <input type="text" id="event-title" required class="form-control" style="width: 100%; padding: 8px 12px; border: 1px solid ${borderColor}; border-radius: 4px; background-color: ${inputBgColor}; color: ${textColor};">
                        </div>
                        <div class="form-group" style="margin-bottom: 15px;">
                            <label for="event-date" style="display: block; margin-bottom: 5px; font-weight: 500; color: ${textColor};">Date</label>
                            <input type="date" id="event-date" required class="form-control" value="${dateValue}" style="width: 100%; padding: 8px 12px; border: 1px solid ${borderColor}; border-radius: 4px; background-color: ${inputBgColor}; color: ${textColor};">
                        </div>
                        <div class="form-row" style="display: flex; gap: 15px; margin-bottom: 15px;">
                            <div class="form-group half" style="flex: 1;">
                                <label for="event-start-time" style="display: block; margin-bottom: 5px; font-weight: 500; color: ${textColor};">Start Time</label>
                                <input type="time" id="event-start-time" required class="form-control" value="09:00" style="width: 100%; padding: 8px 12px; border: 1px solid ${borderColor}; border-radius: 4px; background-color: ${inputBgColor}; color: ${textColor};">
                            </div>
                            <div class="form-group half" style="flex: 1;">
                                <label for="event-end-time" style="display: block; margin-bottom: 5px; font-weight: 500; color: ${textColor};">End Time</label>
                                <input type="time" id="event-end-time" required class="form-control" value="10:00" style="width: 100%; padding: 8px 12px; border: 1px solid ${borderColor}; border-radius: 4px; background-color: ${inputBgColor}; color: ${textColor};">
                            </div>
                        </div>
                        <div class="form-group" style="margin-bottom: 15px;">
                            <label for="event-description" style="display: block; margin-bottom: 5px; font-weight: 500; color: ${textColor};">Description</label>
                            <textarea id="event-description" rows="3" class="form-control" style="width: 100%; padding: 8px 12px; border: 1px solid ${borderColor}; border-radius: 4px; min-height: 100px; resize: vertical; background-color: ${inputBgColor}; color: ${textColor};"></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer" style="display: flex; justify-content: flex-end; gap: 10px; padding: 15px 20px; border-top: 1px solid ${borderColor};">
                    <button class="btn-secondary modal-cancel" style="padding: 8px 15px; background-color: ${isDarkMode ? '#333' : '#e0e0e0'}; color: ${textColor}; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
                    <button class="btn-primary" id="save-event-btn" style="padding: 8px 15px; background-color: #000000; color: white; border: none; border-radius: 4px; cursor: pointer;">Save Event</button>
                </div>
            </div>
        </div>
    `;

    // Add modal to DOM
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer.firstElementChild);

    // Add event listeners
    setupAddEventModalListeners();

    // Add animation style if not already present
    if (!document.getElementById('modal-animations')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'modal-animations';
        styleElement.textContent = `
            @keyframes modalFadeIn {
                from {
                    opacity: 0;
                    transform: scale(0.96);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(styleElement);
    }
}

/**
 * Set up event listeners for add event modal
 */
function setupAddEventModalListeners() {
    const modal = document.getElementById('add-event-modal');

    // Close button
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.remove();
        });
    }

    // Close when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Cancel button
    const cancelBtn = modal.querySelector('.modal-cancel');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            modal.remove();
        });
    }

    // Save button
    const saveBtn = document.getElementById('save-event-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            // Get form values
            const title = document.getElementById('event-title').value;
            const dateStr = document.getElementById('event-date').value;
            const startTime = document.getElementById('event-start-time').value;
            const endTime = document.getElementById('event-end-time').value;
            const description = document.getElementById('event-description').value;

            // Validate form
            if (!title || !dateStr || !startTime || !endTime) {
                alert('Please fill in all required fields');
                return;
            }

            // Convert time to AM/PM format
            const formattedStartTime = formatTime(startTime);
            const formattedEndTime = formatTime(endTime);

            // Create new event
            const newEvent = {
                id: generateEventId(),
                title: title,
                date: new Date(dateStr),
                startTime: formattedStartTime,
                endTime: formattedEndTime,
                description: description
            };

            // Add event to calendar
            addEvent(newEvent);

            // Close modal
            modal.remove();
        });
    }
}

/**
 * Edit event
 * @param {number} eventId - Event ID
 */
function editEvent(eventId) {
    // Find event by ID
    const event = calendarEvents.find(e => e.id === eventId);

    if (!event) {
        console.error('Event not found:', eventId);
        return;
    }

    // Format date for input value
    const dateValue = event.date.toISOString().split('T')[0];

    // Convert AM/PM time to 24-hour format for input
    const startTime24 = convertTo24Hour(event.startTime);
    const endTime24 = convertTo24Hour(event.endTime);

    // Get theme colors
    const isDarkMode = document.body.classList.contains('dark-theme');
    const bgColor = isDarkMode ? 'var(--widget-bg)' : 'white';
    const textColor = isDarkMode ? 'var(--text-color)' : '#333';
    const borderColor = isDarkMode ? 'var(--border-color)' : '#e0e0e0';
    const inputBgColor = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'white';

    // Create modal HTML with ticket-style container
    const modalHTML = `
        <div class="modal-overlay" id="edit-event-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;">
            <div class="modal-container" style="background-color: ${bgColor}; color: ${textColor}; border-radius: 8px; width: 90%; max-width: 600px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); overflow: hidden; animation: modalFadeIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
                <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; border-bottom: 1px solid ${borderColor};">
                    <h3 style="margin: 0; color: ${textColor};">Edit Event</h3>
                    <button class="modal-close" style="background: none; border: none; cursor: pointer; font-size: 16px; color: ${textColor};"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body" style="padding: 20px; max-height: 60vh; overflow-y: auto;">
                    <form id="edit-event-form">
                        <input type="hidden" id="edit-event-id" value="${eventId}">
                        <div class="form-group" style="margin-bottom: 15px;">
                            <label for="edit-event-title" style="display: block; margin-bottom: 5px; font-weight: 500; color: ${textColor};">Title</label>
                            <input type="text" id="edit-event-title" required class="form-control" value="${event.title}" style="width: 100%; padding: 8px 12px; border: 1px solid ${borderColor}; border-radius: 4px; background-color: ${inputBgColor}; color: ${textColor};">
                        </div>
                        <div class="form-group" style="margin-bottom: 15px;">
                            <label for="edit-event-date" style="display: block; margin-bottom: 5px; font-weight: 500; color: ${textColor};">Date</label>
                            <input type="date" id="edit-event-date" required class="form-control" value="${dateValue}" style="width: 100%; padding: 8px 12px; border: 1px solid ${borderColor}; border-radius: 4px; background-color: ${inputBgColor}; color: ${textColor};">
                        </div>
                        <div class="form-row" style="display: flex; gap: 15px; margin-bottom: 15px;">
                            <div class="form-group half" style="flex: 1;">
                                <label for="edit-event-start-time" style="display: block; margin-bottom: 5px; font-weight: 500; color: ${textColor};">Start Time</label>
                                <input type="time" id="edit-event-start-time" required class="form-control" value="${startTime24}" style="width: 100%; padding: 8px 12px; border: 1px solid ${borderColor}; border-radius: 4px; background-color: ${inputBgColor}; color: ${textColor};">
                            </div>
                            <div class="form-group half" style="flex: 1;">
                                <label for="edit-event-end-time" style="display: block; margin-bottom: 5px; font-weight: 500; color: ${textColor};">End Time</label>
                                <input type="time" id="edit-event-end-time" required class="form-control" value="${endTime24}" style="width: 100%; padding: 8px 12px; border: 1px solid ${borderColor}; border-radius: 4px; background-color: ${inputBgColor}; color: ${textColor};">
                            </div>
                        </div>
                        <div class="form-group" style="margin-bottom: 15px;">
                            <label for="edit-event-description" style="display: block; margin-bottom: 5px; font-weight: 500; color: ${textColor};">Description</label>
                            <textarea id="edit-event-description" rows="3" class="form-control" style="width: 100%; padding: 8px 12px; border: 1px solid ${borderColor}; border-radius: 4px; min-height: 100px; resize: vertical; background-color: ${inputBgColor}; color: ${textColor};">${event.description || ''}</textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer" style="display: flex; justify-content: flex-end; gap: 10px; padding: 15px 20px; border-top: 1px solid ${borderColor};">
                    <button class="btn-secondary modal-cancel" style="padding: 8px 15px; background-color: ${isDarkMode ? '#333' : '#e0e0e0'}; color: ${textColor}; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
                    <button class="btn-primary" id="update-event-btn" style="padding: 8px 15px; background-color: #000000; color: white; border: none; border-radius: 4px; cursor: pointer;">Update Event</button>
                </div>
            </div>
        </div>
    `;

    // Add modal to DOM
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer.firstElementChild);

    // Add event listeners
    setupEditEventModalListeners();
}

/**
 * Set up event listeners for edit event modal
 */
function setupEditEventModalListeners() {
    const modal = document.getElementById('edit-event-modal');

    // Close button
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.remove();
        });
    }

    // Close when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Cancel button
    const cancelBtn = modal.querySelector('.modal-cancel');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            modal.remove();
        });
    }

    // Update button
    const updateBtn = document.getElementById('update-event-btn');
    if (updateBtn) {
        updateBtn.addEventListener('click', function() {
            // Get form values
            const eventId = parseInt(document.getElementById('edit-event-id').value);
            const title = document.getElementById('edit-event-title').value;
            const dateStr = document.getElementById('edit-event-date').value;
            const startTime = document.getElementById('edit-event-start-time').value;
            const endTime = document.getElementById('edit-event-end-time').value;
            const description = document.getElementById('edit-event-description').value;

            // Validate form
            if (!title || !dateStr || !startTime || !endTime) {
                alert('Please fill in all required fields');
                return;
            }

            // Convert time to AM/PM format
            const formattedStartTime = formatTime(startTime);
            const formattedEndTime = formatTime(endTime);

            // Update event
            updateEvent(eventId, {
                title: title,
                date: new Date(dateStr),
                startTime: formattedStartTime,
                endTime: formattedEndTime,
                description: description
            });

            // Close modal
            modal.remove();
        });
    }
}

/**
 * Delete event
 * @param {number} eventId - Event ID
 */
function deleteEvent(eventId) {
    // Confirm deletion
    if (confirm('Are you sure you want to delete this event?')) {
        // Find event index
        const eventIndex = calendarEvents.findIndex(e => e.id === eventId);

        if (eventIndex !== -1) {
            // Remove event from array
            calendarEvents.splice(eventIndex, 1);

            // Update calendar
            updateCalendar();
        }
    }
}

/**
 * Add event to calendar
 * @param {Object} event - Event object
 */
function addEvent(event) {
    // Add event to array
    calendarEvents.push(event);

    // Update calendar
    updateCalendar();
}

/**
 * Update event
 * @param {number} eventId - Event ID
 * @param {Object} updatedEvent - Updated event data
 */
function updateEvent(eventId, updatedEvent) {
    // Find event index
    const eventIndex = calendarEvents.findIndex(e => e.id === eventId);

    if (eventIndex !== -1) {
        // Update event
        calendarEvents[eventIndex] = {
            ...calendarEvents[eventIndex],
            ...updatedEvent
        };

        // Update calendar
        updateCalendar();
    }
}

/**
 * Generate unique event ID
 * @returns {number} Unique ID
 */
function generateEventId() {
    // Find highest ID
    const maxId = calendarEvents.reduce((max, event) => Math.max(max, event.id), 0);

    // Return next ID
    return maxId + 1;
}

/**
 * Format time from 24-hour to AM/PM
 * @param {string} time24 - Time in 24-hour format (HH:MM)
 * @returns {string} Time in AM/PM format
 */
function formatTime(time24) {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;

    return `${hour12}:${minutes} ${period}`;
}

/**
 * Convert time from AM/PM to 24-hour format
 * @param {string} timeAMPM - Time in AM/PM format
 * @returns {string} Time in 24-hour format (HH:MM)
 */
function convertTo24Hour(timeAMPM) {
    const [timePart, period] = timeAMPM.split(' ');
    let [hours, minutes] = timePart.split(':');

    hours = parseInt(hours, 10);

    if (period === 'PM' && hours < 12) {
        hours += 12;
    } else if (period === 'AM' && hours === 12) {
        hours = 0;
    }

    return `${hours.toString().padStart(2, '0')}:${minutes}`;
}

/**
 * Add calendar styles
 */
function addCalendarStyles() {
    // Create style element if it doesn't exist
    let styleElement = document.getElementById('calendar-styles');

    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'calendar-styles';
        document.head.appendChild(styleElement);

        // Add styles
        styleElement.textContent = `
            .widget-calendar {
                grid-column: span 2;
            }

            .calendar-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
            }

            .calendar-title {
                margin: 0;
                font-size: 16px;
            }

            .calendar-nav {
                background: transparent;
                border: none;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                transition: var(--transition);
            }

            .calendar-nav:hover {
                background-color: #f0f0f0;
            }

            .calendar-grid {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                gap: 5px;
                margin-bottom: 15px;
            }

            .calendar-day-header {
                text-align: center;
                font-size: 12px;
                font-weight: 600;
                color: var(--accent-color);
                padding: 5px 0;
            }

            .calendar-day {
                aspect-ratio: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 50%;
                font-size: 14px;
                cursor: pointer;
                transition: var(--transition);
            }

            .calendar-day:hover {
                background-color: #f0f0f0;
            }

            .calendar-day.empty {
                cursor: default;
            }

            .calendar-day.has-event {
                background-color: #000000;
                color: #ffffff;
                font-weight: 600;
            }

            .calendar-day.has-event:hover {
                background-color: #bae7ff;
            }

            .calendar-events {
                border-top: 1px solid var(--border-color);
                padding-top: 15px;
                max-height: 200px;
                overflow-y: auto;
            }

            .calendar-event {
                display: flex;
                align-items: center;
                padding: 10px;
                border-radius: 4px;
                transition: var(--transition);
                cursor: pointer;
                margin-bottom: 5px;
            }

            .calendar-event:hover {
                background-color: #f9f9f9;
            }

            .event-date {
                width: 60px;
                text-align: center;
                font-size: 12px;
                font-weight: 600;
                color: var(--accent-color);
            }

            .event-details {
                flex: 1;
            }

            .event-details h5 {
                margin: 0 0 5px 0;
                font-size: 14px;
            }

            .event-details p {
                margin: 0;
                font-size: 12px;
                color: var(--accent-color);
            }

            .event-actions {
                display: flex;
                gap: 5px;
            }

            .event-edit, .event-delete {
                background: none;
                border: none;
                cursor: pointer;
                padding: 5px;
                border-radius: 4px;
                transition: var(--transition);
            }

            .event-edit:hover {
                background-color: #e6f7ff;
                color: #1890ff;
            }

            .event-delete:hover {
                background-color: #fff1f0;
                color: #f5222d;
            }

            .calendar-actions {
                margin-top: 15px;
                display: flex;
                justify-content: flex-end;
            }

            .form-row {
                display: flex;
                gap: 10px;
            }

            .form-group.half {
                flex: 1;
            }

            .day-event-item {
                display: flex;
                align-items: center;
                padding: 10px;
                border-radius: 4px;
                margin-bottom: 10px;
                background-color: #f9f9f9;
            }

            .day-event-time {
                width: 120px;
                font-size: 14px;
                font-weight: 600;
            }

            .day-event-details {
                flex: 1;
            }

            .day-event-details h4 {
                margin: 0 0 5px 0;
                font-size: 16px;
            }

            .day-event-details p {
                margin: 0;
                font-size: 14px;
                color: var(--text-secondary);
            }

            .day-event-actions {
                display: flex;
                gap: 5px;
            }

            .day-event-edit, .day-event-delete {
                background: none;
                border: none;
                cursor: pointer;
                padding: 5px;
                border-radius: 4px;
                transition: var(--transition);
            }

            .day-event-edit:hover {
                background-color: #e6f7ff;
                color: #1890ff;
            }

            .day-event-delete:hover {
                background-color: #fff1f0;
                color: #f5222d;
            }

            .day-events-actions {
                margin-top: 15px;
                display: flex;
                justify-content: flex-end;
            }

            .no-events {
                text-align: center;
                padding: 20px;
                color: var(--text-secondary);
            }

            .event-detail-item {
                display: flex;
                margin-bottom: 15px;
            }

            .event-detail-label {
                width: 100px;
                font-weight: 600;
            }

            .event-detail-value {
                flex: 1;
            }

            /* Dark theme support */
            .dark-theme .calendar-nav:hover {
                background-color: #333;
            }

            .dark-theme .calendar-day:hover {
                background-color: #333;
            }

            .dark-theme .calendar-day.has-event {
                background-color: #1f1f1f;
                color: #4a90e2;
            }

            .dark-theme .calendar-day.has-event:hover {
                background-color: #2a2a2a;
            }

            .dark-theme .calendar-event:hover {
                background-color: #1f1f1f;
            }

            .dark-theme .day-event-item {
                background-color: #1f1f1f;
            }

            .dark-theme .event-edit:hover {
                background-color: #1f1f1f;
                color: #4a90e2;
            }

            .dark-theme .event-delete:hover {
                background-color: #1f1f1f;
                color: #ff4d4f;
            }
        `;
    }
}

/**
 * Set up calendar event listeners
 */
function setupCalendarEventListeners() {
    console.log('Setting up calendar event listeners');

    // Calendar navigation
    const prevBtn = document.querySelector('.calendar-nav.prev');
    const nextBtn = document.querySelector('.calendar-nav.next');

    if (prevBtn) {
        // Remove any existing event listeners
        prevBtn.replaceWith(prevBtn.cloneNode(true));
        const newPrevBtn = document.querySelector('.calendar-nav.prev');

        newPrevBtn.addEventListener('click', function() {
            console.log('Previous month button clicked');
            navigateToPreviousMonth();
        });
    }

    if (nextBtn) {
        // Remove any existing event listeners
        nextBtn.replaceWith(nextBtn.cloneNode(true));
        const newNextBtn = document.querySelector('.calendar-nav.next');

        newNextBtn.addEventListener('click', function() {
            console.log('Next month button clicked');
            navigateToNextMonth();
        });
    }

    // Calendar days with events
    setupDayEventListeners();

    // Calendar events
    setupEventActionListeners();

    // Add event button
    const addEventBtn = document.querySelector('.add-event-btn');
    if (addEventBtn) {
        // Remove any existing event listeners
        addEventBtn.replaceWith(addEventBtn.cloneNode(true));
        const newAddEventBtn = document.querySelector('.add-event-btn');

        newAddEventBtn.addEventListener('click', function() {
            console.log('Add event button clicked');
            showAddEventModal();
        });
    }
}

/**
 * Set up event listeners for calendar days
 */
function setupDayEventListeners() {
    console.log('Setting up day event listeners');

    // All calendar days (except empty ones)
    const calendarDays = document.querySelectorAll('.calendar-day:not(.empty)');
    calendarDays.forEach(day => {
        // Remove any existing event listeners by cloning and replacing
        day.replaceWith(day.cloneNode(true));
    });

    // Get the fresh elements after replacement
    const updatedCalendarDays = document.querySelectorAll('.calendar-day:not(.empty)');
    updatedCalendarDays.forEach(day => {
        day.addEventListener('click', function() {
            const dateStr = this.getAttribute('data-date');
            if (dateStr) {
                console.log('Day clicked:', dateStr);
                const selectedDate = new Date(dateStr);
                showDayEvents(selectedDate);
            }
        });
    });
}

/**
 * Set up event listeners for event actions (edit, delete)
 */
function setupEventActionListeners() {
    console.log('Setting up event action listeners');

    // Event click (view details)
    const events = document.querySelectorAll('.calendar-event');
    events.forEach(event => {
        // Remove any existing event listeners by cloning and replacing
        event.replaceWith(event.cloneNode(true));
    });

    // Get the fresh elements after replacement
    const updatedEvents = document.querySelectorAll('.calendar-event');
    updatedEvents.forEach(event => {
        event.addEventListener('click', function(e) {
            // Only trigger if not clicking on action buttons
            if (!e.target.closest('.event-actions')) {
                const eventId = parseInt(this.getAttribute('data-event-id'));
                console.log('Event clicked:', eventId);
                showEventDetails(eventId);
            }
        });
    });

    // Edit event buttons
    const editButtons = document.querySelectorAll('.event-edit');
    editButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling
            const eventId = parseInt(this.closest('.calendar-event').getAttribute('data-event-id'));
            console.log('Edit event clicked:', eventId);
            editEvent(eventId);
        });
    });

    // Delete event buttons
    const deleteButtons = document.querySelectorAll('.event-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling
            const eventId = parseInt(this.closest('.calendar-event').getAttribute('data-event-id'));
            console.log('Delete event clicked:', eventId);
            deleteEvent(eventId);
        });
    });
}

/**
 * Navigate to previous month
 */
function navigateToPreviousMonth() {
    // Update current date to previous month
    currentCalendarDate = new Date(
        currentCalendarDate.getFullYear(),
        currentCalendarDate.getMonth() - 1,
        1
    );

    // Update calendar
    updateCalendar();
}

/**
 * Navigate to next month
 */
function navigateToNextMonth() {
    // Update current date to next month
    currentCalendarDate = new Date(
        currentCalendarDate.getFullYear(),
        currentCalendarDate.getMonth() + 1,
        1
    );

    // Update calendar
    updateCalendar();
}

/**
 * Update calendar with current date
 */
function updateCalendar() {
    console.log('Updating calendar to:', formatMonthYear(currentCalendarDate));

    // Update title
    const calendarTitle = document.querySelector('.calendar-title');
    if (calendarTitle) {
        calendarTitle.textContent = formatMonthYear(currentCalendarDate);
    }

    // Update days
    const calendarGrid = document.querySelector('.calendar-grid');
    if (calendarGrid) {
        // Remove day headers
        const dayHeaders = calendarGrid.querySelectorAll('.calendar-day-header');
        const headerHTML = Array.from(dayHeaders).map(header => header.outerHTML).join('');

        // Generate new days
        calendarGrid.innerHTML = headerHTML + generateCalendarDays(currentCalendarDate);
    }

    // Update events
    const calendarEventsContainer = document.querySelector('.calendar-events');
    if (calendarEventsContainer) {
        calendarEventsContainer.innerHTML = generateEventsHTML(currentCalendarDate);
    }

    // Re-attach event listeners
    setupDayEventListeners();
    setupEventActionListeners();
}

/**
 * Show events for a specific day
 * @param {Date} date - Selected date
 */
function showDayEvents(date) {
    // Find events for the selected date
    const dayEvents = calendarEvents.filter(event =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );

    // Format date for display
    const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Get theme colors
    const isDarkMode = document.body.classList.contains('dark-theme');
    const bgColor = isDarkMode ? 'var(--widget-bg)' : 'white';
    const textColor = isDarkMode ? 'var(--text-color)' : '#333';
    const borderColor = isDarkMode ? 'var(--border-color)' : '#e0e0e0';
    const itemBgColor = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#f9f9f9';

    // Create modal HTML with ticket-style container
    let modalHTML = `
        <div class="modal-overlay" id="day-events-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;">
            <div class="modal-container" style="background-color: ${bgColor}; color: ${textColor}; border-radius: 8px; width: 90%; max-width: 600px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); overflow: hidden; animation: modalFadeIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
                <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; border-bottom: 1px solid ${borderColor};">
                    <h3 style="margin: 0; color: ${textColor};">Events for ${formattedDate}</h3>
                    <button class="modal-close" style="background: none; border: none; cursor: pointer; font-size: 16px; color: ${textColor};"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body" style="padding: 20px; max-height: 60vh; overflow-y: auto;">
    `;

    if (dayEvents.length === 0) {
        modalHTML += `
            <div class="no-events" style="text-align: center; padding: 20px; color: ${isDarkMode ? 'rgba(255, 255, 255, 0.6)' : '#666'};">
                <p style="margin-bottom: 15px;">No events scheduled for this day</p>
                <button class="btn-primary add-event-for-day-btn" style="padding: 8px 15px; background-color: #000000; color: white; border: none; border-radius: 4px; cursor: pointer;">Add Event</button>
            </div>
        `;
    } else {
        modalHTML += `
            <div class="day-events-list" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 15px;">
                ${dayEvents.map(event => `
                    <div class="day-event-item" style="display: flex; align-items: center; padding: 12px; border-radius: 4px; background-color: ${itemBgColor}; border: 1px solid ${borderColor};">
                        <div class="day-event-time" style="width: 120px; font-size: 14px; font-weight: 600; color: ${textColor};">${event.startTime} - ${event.endTime}</div>
                        <div class="day-event-details" style="flex: 1;">
                            <h4 style="margin: 0 0 5px 0; font-size: 16px; color: ${textColor};">${event.title}</h4>
                            <p style="margin: 0; font-size: 14px; color: ${isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#666'};">${event.description || 'No description provided'}</p>
                        </div>
                        <div class="day-event-actions" style="display: flex; gap: 5px;">
                            <button class="day-event-edit" data-event-id="${event.id}" style="background: none; border: none; cursor: pointer; padding: 5px; border-radius: 4px; color: ${textColor};"><i class="fas fa-edit"></i></button>
                            <button class="day-event-delete" data-event-id="${event.id}" style="background: none; border: none; cursor: pointer; padding: 5px; border-radius: 4px; color: ${textColor};"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="day-events-actions" style="display: flex; justify-content: flex-end; margin-top: 15px;">
                <button class="btn-primary add-event-for-day-btn" style="padding: 8px 15px; background-color: #000000; color: white; border: none; border-radius: 4px; cursor: pointer;">Add Event</button>
            </div>
        `;
    }

    modalHTML += `
                </div>
            </div>
        </div>
    `;

    // Add modal to DOM
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer.firstElementChild);

    // Add event listeners
    setupDayEventsModalListeners(date);
}

/**
 * Set up event listeners for day events modal
 * @param {Date} date - Selected date
 */
function setupDayEventsModalListeners(date) {
    const modal = document.getElementById('day-events-modal');

    // Close button
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.remove();
        });
    }

    // Close when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Add event button
    const addEventBtn = modal.querySelector('.add-event-for-day-btn');
    if (addEventBtn) {
        addEventBtn.addEventListener('click', function() {
            modal.remove();
            showAddEventModal(date);
        });
    }

    // Edit event buttons
    const editButtons = modal.querySelectorAll('.day-event-edit');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const eventId = parseInt(this.getAttribute('data-event-id'));
            modal.remove();
            editEvent(eventId);
        });
    });

    // Delete event buttons
    const deleteButtons = modal.querySelectorAll('.day-event-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const eventId = parseInt(this.getAttribute('data-event-id'));
            modal.remove();
            deleteEvent(eventId);
        });
    });
}
