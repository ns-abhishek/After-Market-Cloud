// Scheduling Page JavaScript

// Sample data for demonstration
const sampleData = {
    workshopCapacity: {
        currentMonth: 'May 2025',
        days: generateCalendarData('workshop')
    },
    techScheduler: {
        currentDate: 'May 27, 2025',
        technicians: [
            { id: 1045, name: 'Employee 1045', hours: '6:00 Hrs', overtime: '2:00Hrs' },
            { id: 1047, name: 'Employee 1047', hours: '7:30 Hrs', overtime: '0:30Hrs' },
            { id: 1332, name: 'Employee 1332', hours: '4:30 Hrs', overtime: '3:30Hrs' },
            { id: 1391, name: 'Employee 1391', hours: '5:00 Hrs', overtime: '5:00Hrs' },
            { id: 1453, name: 'Employee 1453', hours: '8:00 Hrs', overtime: '0:00Hrs' },
            { id: 1492, name: 'Employee 1492', hours: '8:00 Hrs', overtime: '0:00Hrs' },
            { id: 1496, name: 'Employee 1496', hours: '8:00 Hrs', overtime: '0:00Hrs' },
            { id: 641, name: 'Employee 641', hours: '10:00 Hrs', overtime: '0:00Hrs' }
        ]
    },
    bayCapacity: {
        currentMonth: 'May 2025',
        days: generateCalendarData('bay')
    },
    bayScheduler: {
        currentDate: 'May 27, 2025',
        bays: [
            { id: 'E1', hours: '16:00 Hrs', overtime: '1:00Hrs', status: 'available' },
            { id: 'E2', hours: '12:00 Hrs', overtime: '6:00Hrs', status: 'booked' },
            { id: 'E3', hours: '12:00 Hrs', overtime: '4:00Hrs', status: 'available' },
            { id: 'E4', hours: '17:00 Hrs', overtime: '0:00Hrs', status: 'booked' },
            { id: 'E5', hours: '17:00 Hrs', overtime: '0:00Hrs', status: 'available' }
        ]
    }
};

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeScheduling();
});

function initializeScheduling() {
    generateWorkshopCalendar();
    generateTechScheduler();
    generateBayCalendar();
    generateBayScheduler();

    // Initialize form handlers
    initializeFormHandlers();
}

function generateCalendarData(type) {
    const days = [];
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Get first day of month and number of days
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    // Add previous month days
    const prevMonth = new Date(currentYear, currentMonth, 0);
    const daysInPrevMonth = prevMonth.getDate();

    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        days.push({
            day: daysInPrevMonth - i,
            isCurrentMonth: false,
            indicators: []
        });
    }

    // Add current month days
    for (let day = 1; day <= daysInMonth; day++) {
        const indicators = generateDayIndicators(type, day);
        days.push({
            day: day,
            isCurrentMonth: true,
            isToday: day === today.getDate() && currentMonth === today.getMonth(),
            indicators: indicators
        });
    }

    // Add next month days to complete the grid
    const totalCells = Math.ceil(days.length / 7) * 7;
    let nextMonthDay = 1;
    while (days.length < totalCells) {
        days.push({
            day: nextMonthDay++,
            isCurrentMonth: false,
            indicators: []
        });
    }

    return days;
}

function generateDayIndicators(type, day) {
    const indicators = [];
    const counts = {};

    if (type === 'workshop') {
        // Generate realistic numbers for workshop capacity
        counts.new = Math.floor(Math.random() * 5) + 1; // 1-5
        counts.booked = Math.floor(Math.random() * 8) + 2; // 2-9
        counts.available = Math.floor(Math.random() * 6) + 1; // 1-6
        counts.capacity = Math.floor(Math.random() * 4) + 8; // 8-11

        indicators.push({ type: 'new', count: counts.new });
        indicators.push({ type: 'booked', count: counts.booked });
        indicators.push({ type: 'available', count: counts.available });
        indicators.push({ type: 'capacity', count: counts.capacity });
    } else if (type === 'bay') {
        // Generate realistic numbers for bay capacity
        counts.occupied = Math.floor(Math.random() * 6) + 2; // 2-7
        counts.available = Math.floor(Math.random() * 4) + 1; // 1-4
        counts.pending = Math.floor(Math.random() * 3) + 1; // 1-3

        indicators.push({ type: 'occupied', count: counts.occupied });
        indicators.push({ type: 'available', count: counts.available });
        indicators.push({ type: 'pending', count: counts.pending });
    }

    return indicators;
}

function generateWorkshopCalendar() {
    const calendar = document.getElementById('workshopCalendar');
    if (!calendar) return;

    // Add day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-day-header';
        header.textContent = day;
        calendar.appendChild(header);
    });

    // Add calendar days
    sampleData.workshopCapacity.days.forEach(dayData => {
        const dayElement = createCalendarDay(dayData);
        calendar.appendChild(dayElement);
    });
}

function generateBayCalendar() {
    const calendar = document.getElementById('bayCalendar');
    if (!calendar) return;

    // Add day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-day-header';
        header.textContent = day;
        calendar.appendChild(header);
    });

    // Add calendar days
    sampleData.bayCapacity.days.forEach(dayData => {
        const dayElement = createCalendarDay(dayData);
        calendar.appendChild(dayElement);
    });
}

function createCalendarDay(dayData) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';

    if (!dayData.isCurrentMonth) {
        dayElement.classList.add('other-month');
    }

    if (dayData.isToday) {
        dayElement.classList.add('today');
    }

    // Day number
    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    dayNumber.textContent = dayData.day;
    dayElement.appendChild(dayNumber);

    // Indicators with numbers
    if (dayData.indicators && dayData.indicators.length > 0) {
        const indicatorsContainer = document.createElement('div');
        indicatorsContainer.className = 'day-indicators';

        dayData.indicators.forEach(indicator => {
            const indicatorRow = document.createElement('div');
            indicatorRow.className = 'indicator-row';

            const indicatorDot = document.createElement('div');
            indicatorDot.className = `day-indicator-dot ${indicator.type}`;

            const indicatorCount = document.createElement('span');
            indicatorCount.className = 'indicator-count';
            indicatorCount.textContent = indicator.count;

            indicatorRow.appendChild(indicatorDot);
            indicatorRow.appendChild(indicatorCount);
            indicatorsContainer.appendChild(indicatorRow);
        });

        dayElement.appendChild(indicatorsContainer);
    }

    // Click handler
    dayElement.addEventListener('click', () => {
        if (dayData.isCurrentMonth) {
            showDayDetails(dayData.day);
        }
    });

    return dayElement;
}

function generateTechScheduler() {
    const scheduler = document.getElementById('techScheduler');
    if (!scheduler) return;

    sampleData.techScheduler.technicians.forEach(tech => {
        const row = createSchedulerRow(tech, 'tech');
        scheduler.appendChild(row);
    });
}

function generateBayScheduler() {
    const scheduler = document.getElementById('bayScheduler');
    if (!scheduler) return;

    sampleData.bayScheduler.bays.forEach(bay => {
        const row = createSchedulerRow(bay, 'bay');
        scheduler.appendChild(row);
    });
}

function createSchedulerRow(item, type) {
    const row = document.createElement('div');
    row.className = 'scheduler-row';

    // Label
    const label = document.createElement('div');
    label.className = 'scheduler-label';
    label.textContent = type === 'tech' ? `Employee ${item.id}` : item.id;
    row.appendChild(label);

    // Timeline
    const timeline = document.createElement('div');
    timeline.className = 'scheduler-timeline';

    // Create 6 time slots (6am to 11am)
    for (let i = 0; i < 6; i++) {
        const slot = document.createElement('div');
        slot.className = 'timeline-slot';

        // Random status for demonstration
        const random = Math.random();
        if (random > 0.7) {
            slot.classList.add('booked');
        } else if (random > 0.4) {
            slot.classList.add('available');
        }

        slot.addEventListener('click', () => {
            handleTimeSlotClick(item, i, type);
        });

        timeline.appendChild(slot);
    }

    row.appendChild(timeline);

    // Info
    const info = document.createElement('div');
    info.className = 'scheduler-info';
    info.innerHTML = `${item.hours}<br><span style="color: #ef4444;">${item.overtime}</span>`;
    row.appendChild(info);

    return row;
}

function handleTimeSlotClick(item, timeSlot, type) {
    const timeSlots = ['6am', '7am', '8am', '9am', '10am', '11am'];
    const time = timeSlots[timeSlot];
    const itemName = type === 'tech' ? `Employee ${item.id}` : `Bay ${item.id}`;

    showNotification(`Clicked ${itemName} at ${time}`, 'info');
}

function showDayDetails(day) {
    showNotification(`Showing details for day ${day}`, 'info');
}

// Navigation functions
function previousMonth(type) {
    showNotification(`Previous month for ${type}`, 'info');
}

function nextMonth(type) {
    showNotification(`Next month for ${type}`, 'info');
}

// Refresh functions
function refreshSchedules() {
    showNotification('Refreshing all schedules...', 'success');
    setTimeout(() => {
        initializeScheduling();
        showNotification('Schedules refreshed successfully!', 'success');
    }, 1000);
}

function refreshWorkshopCapacity() {
    showNotification('Refreshing workshop capacity...', 'info');
}

function refreshTechScheduler() {
    showNotification('Refreshing tech scheduler...', 'info');
}

function refreshBayCapacity() {
    showNotification('Refreshing bay capacity...', 'info');
}

function refreshBayScheduler() {
    showNotification('Refreshing bay scheduler...', 'info');
}

// Modal functions
function openNewBookingModal() {
    const modal = document.getElementById('newBookingModal');
    if (modal) {
        modal.style.display = 'flex';
        // Set default date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('bookingDate').value = today;
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        // Reset form if it's the booking modal
        if (modalId === 'newBookingModal') {
            document.getElementById('bookingForm').reset();
        }
    }
}

// Form handlers
function initializeFormHandlers() {
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

function handleBookingSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const bookingData = {
        type: formData.get('bookingType') || document.getElementById('bookingType').value,
        date: formData.get('bookingDate') || document.getElementById('bookingDate').value,
        time: formData.get('bookingTime') || document.getElementById('bookingTime').value,
        duration: formData.get('duration') || document.getElementById('duration').value,
        customer: formData.get('customer') || document.getElementById('customer').value,
        service: formData.get('service') || document.getElementById('service').value,
        notes: formData.get('notes') || document.getElementById('notes').value
    };

    // Validate required fields
    if (!bookingData.type || !bookingData.date || !bookingData.time || !bookingData.duration || !bookingData.customer || !bookingData.service) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    // Simulate booking creation
    showNotification('Creating booking...', 'info');

    setTimeout(() => {
        showNotification(`Booking created successfully for ${bookingData.customer} on ${bookingData.date} at ${bookingData.time}`, 'success');
        closeModal('newBookingModal');

        // Refresh the relevant scheduler
        if (bookingData.type === 'workshop') {
            refreshWorkshopCapacity();
        } else if (bookingData.type === 'technician') {
            refreshTechScheduler();
        } else if (bookingData.type === 'bay') {
            refreshBayScheduler();
        }
    }, 1500);
}

// Notification system
function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    container.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}
