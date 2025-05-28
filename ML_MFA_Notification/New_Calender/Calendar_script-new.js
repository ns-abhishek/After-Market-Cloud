// Modern Company Calendar JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let workingHoursChart = null;

    // Mini calendar variables
    let miniCurrentMonth = currentMonth;
    let miniCurrentYear = currentYear;

    // Current time period selection for working time analysis
    let currentTimePeriod = 'weekly';

    // Variables for date selection
    let selectionMode = false;
    let selectionStart = null;
    let selectionEnd = null;
    let selectedDates = [];

    // DOM elements
    const calendarDays = document.getElementById('calendar-days');
    const currentMonthYear = document.getElementById('current-month-year');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const viewButtons = document.querySelectorAll('.view-selector button');
    const workingTimeDataBody = document.getElementById('working-time-data-body');
    const workingHoursChartCanvas = document.getElementById('working-hours-chart');
    const periodRadios = document.querySelectorAll('input[name="time-period"]');
    const workingTimeHeader = document.getElementById('working-time-header');

    // Mini calendar DOM elements
    const miniCalendarDays = document.getElementById('mini-calendar-days');
    const miniCurrentMonthYear = document.getElementById('mini-current-month-year');
    const miniPrevMonthBtn = document.getElementById('mini-prev-month');
    const miniNextMonthBtn = document.getElementById('mini-next-month');

    // Sample data for non-working days and holidays
    const nonWorkingDaysData = [
        { date: '2025-01-04', regFrom: 0, regTo: 0, otFrom: 0, otTo: 240, dtFrom: 240, dtTo: 0 },
        { date: '2025-01-11', regFrom: 0, regTo: 0, otFrom: 0, otTo: 240, dtFrom: 240, dtTo: 0 }
    ];

    const holidaysData = [
        { date: '2025-01-01', name: "New Year's Day", doubletime: 'Yes', tripletime: 'No', overtime: 'No' },
        { date: '2025-01-02', name: "New Year's Day 2", doubletime: 'Yes', tripletime: 'No', overtime: 'No' },
        { date: '2025-01-03', name: "New Year's Day 3", doubletime: 'No', tripletime: 'Yes', overtime: 'No' },
        { date: '2025-04-21', name: "Easter Monday", doubletime: 'Yes', tripletime: 'No', overtime: 'No' },
        { date: '2025-06-24', name: "St-Jean-Baptiste Day", doubletime: 'Yes', tripletime: 'No', overtime: 'No' },
        { date: '2025-07-01', name: "Canada Day", doubletime: 'No', tripletime: 'Yes', overtime: 'No' },
        { date: '2025-09-01', name: "Labor Day", doubletime: 'Yes', tripletime: 'No', overtime: 'No' },
        { date: '2025-10-13', name: "Thanksgiving", doubletime: 'Yes', tripletime: 'No', overtime: 'No' },
        { date: '2025-12-25', name: "Christmas Day 1", doubletime: 'No', tripletime: 'Yes', overtime: 'No' },
        { date: '2025-12-26', name: "Christmas Day 2", doubletime: 'Yes', tripletime: 'No', overtime: 'No' }
    ];

    // Sample data for working hours analysis by different time periods
    const workingHoursData = {
        daily: [
            { date: '2025-05-01', day: 'Thu', regular: 8, overtime: 0, double: 0, triple: 0, total: 8 },
            { date: '2025-05-02', day: 'Fri', regular: 8, overtime: 0, double: 0, triple: 0, total: 8 },
            { date: '2025-05-05', day: 'Mon', regular: 7, overtime: 1, double: 0, triple: 0, total: 8 },
            { date: '2025-05-06', day: 'Tue', regular: 7, overtime: 1, double: 0, triple: 0, total: 8 },
            { date: '2025-05-07', day: 'Wed', regular: 6, overtime: 1, double: 1, triple: 0, total: 8 },
            { date: '2025-05-08', day: 'Thu', regular: 6, overtime: 1, double: 0, triple: 1, total: 8 },
            { date: '2025-05-09', day: 'Fri', regular: 6, overtime: 0, double: 1, triple: 1, total: 8 }
        ],
        weekly: [
            { week: 18, regular: 16, overtime: 0, double: 0, triple: 0, total: 16 },
            { week: 19, regular: 32, overtime: 4, double: 2, triple: 2, total: 40 },
            { week: 20, regular: 30, overtime: 5, double: 3, triple: 2, total: 40 },
            { week: 21, regular: 28, overtime: 6, double: 4, triple: 2, total: 40 },
            { week: 22, regular: 25, overtime: 8, double: 4, triple: 3, total: 40 }
        ],
        biweekly: [
            { period: '1 (Weeks 18-19)', regular: 48, overtime: 4, double: 2, triple: 2, total: 56 },
            { period: '2 (Weeks 20-21)', regular: 58, overtime: 11, double: 7, triple: 4, total: 80 },
            { period: '3 (Weeks 22-23)', regular: 50, overtime: 16, double: 8, triple: 6, total: 80 }
        ],
        monthly: [
            { month: 'January', regular: 120, overtime: 20, double: 12, triple: 8, total: 160 },
            { month: 'February', regular: 110, overtime: 25, double: 15, triple: 10, total: 160 },
            { month: 'March', regular: 115, overtime: 20, double: 15, triple: 10, total: 160 },
            { month: 'April', regular: 118, overtime: 18, double: 14, triple: 10, total: 160 },
            { month: 'May', regular: 128, overtime: 24, double: 16, triple: 8, total: 176 }
        ]
    };

    // Initialize working days data
    let workingDaysData = [];

    // Try to load working days data from localStorage
    try {
        const savedData = localStorage.getItem('workingDaysData');
        if (savedData) {
            workingDaysData = JSON.parse(savedData);
            console.log('Loaded working days data from localStorage:', workingDaysData);
        }
    } catch (err) {
        console.error('Error loading data from localStorage:', err);
    }

    // Initialize calendars
    setTimeout(() => {
        updateCalendar();
        updateMiniCalendar();

        // Make sure tables are populated with any saved data
        populateTables();
    }, 100);

    // Event listeners for main calendar
    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        updateCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        updateCalendar();
    });

    // Event listeners for mini calendar
    miniPrevMonthBtn.addEventListener('click', () => {
        miniCurrentMonth--;
        if (miniCurrentMonth < 0) {
            miniCurrentMonth = 11;
            miniCurrentYear--;
        }
        updateMiniCalendar();
    });

    miniNextMonthBtn.addEventListener('click', () => {
        miniCurrentMonth++;
        if (miniCurrentMonth > 11) {
            miniCurrentMonth = 0;
            miniCurrentYear++;
        }
        updateMiniCalendar();
    });

    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            console.log('Tab clicked:', tabId);

            // Use the switchToTab function to handle tab switching
            switchToTab(tabId);
        });
    });

    // View switching
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            viewButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const view = button.getAttribute('data-view');
            console.log(`Switching to ${view} view`);
        });
    });

    // Functions
    function updateCalendar() {
        // Update month and year display
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        currentMonthYear.textContent = `${months[currentMonth]} ${currentYear}`;

        // Clear previous days
        calendarDays.innerHTML = '';

        // Get first day of month and number of days
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        // Get days from previous month
        const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

        // Add days from previous month
        for (let i = firstDay - 1; i >= 0; i--) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('non-month');
            dayElement.textContent = daysInPrevMonth - i;
            calendarDays.appendChild(dayElement);
        }

        // Add days of current month
        const today = new Date();
        const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;

        // Holidays data (sample data)
        const holidays = [
            { date: '2025-01-01', name: "New Year's Day" },
            { date: '2025-01-02', name: "New Year's Day 2" },
            { date: '2025-01-03', name: "New Year's Day 3" },
            { date: '2025-04-21', name: "Easter Monday" },
            { date: '2025-06-24', name: "St-Jean-Baptiste Day" },
            { date: '2025-07-01', name: "Canada Day" },
            { date: '2025-09-01', name: "Labor Day" },
            { date: '2025-10-13', name: "Thanksgiving" },
            { date: '2025-12-25', name: "Christmas Day 1" },
            { date: '2025-12-26', name: "Christmas Day 2" }
        ];

        for (let i = 1; i <= daysInMonth; i++) {
            const dayElement = document.createElement('div');
            const currentDate = new Date(currentYear, currentMonth, i);
            const dateString = formatDateISO(currentDate);

            // Store date information as data attributes
            dayElement.setAttribute('data-date', dateString);
            dayElement.setAttribute('data-day', i);
            dayElement.setAttribute('data-month', currentMonth + 1);
            dayElement.setAttribute('data-year', currentYear);
            dayElement.setAttribute('data-week', getWeekNumber(currentDate));

            // Check if it's today
            if (isCurrentMonth && i === today.getDate()) {
                dayElement.classList.add('today');
            }

            // Check if it's a weekend
            const dayOfWeek = currentDate.getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                dayElement.classList.add('non-working');
            }

            // Check if it's a holiday
            const isHoliday = holidays.find(holiday => holiday.date === dateString);
            if (isHoliday) {
                dayElement.classList.add('holiday');
                dayElement.setAttribute('title', isHoliday.name);
            }

            // Check if this date is in the selected range
            if (selectedDates.includes(dateString)) {
                dayElement.classList.add('selected');

                // Check if it's the start or end of a selection
                if (dateString === selectionStart) {
                    dayElement.classList.add('selection-start');
                }
                if (dateString === selectionEnd) {
                    dayElement.classList.add('selection-end');
                }
            }

            // Add day number
            dayElement.innerHTML = `<span>${i}</span>`;

            // Add any events or additional information here
            if (isHoliday) {
                const eventElement = document.createElement('div');
                eventElement.classList.add('event');
                eventElement.textContent = isHoliday.name;
                dayElement.appendChild(eventElement);
            }

            // Add click event listener for date selection
            dayElement.addEventListener('click', handleDateSelection);

            calendarDays.appendChild(dayElement);
        }

        // Add days from next month to fill the grid
        const totalDaysDisplayed = calendarDays.childElementCount;
        const daysToAdd = 42 - totalDaysDisplayed; // 6 rows of 7 days

        for (let i = 1; i <= daysToAdd; i++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('non-month');
            dayElement.textContent = i;
            calendarDays.appendChild(dayElement);
        }

        // Only generate sample data if there's no existing data
        if (!workingDaysData || workingDaysData.length === 0) {
            console.log('No existing working days data, generating sample data');
            workingDaysData = generateWorkingDaysData();
        }

        // Repopulate tables with data
        populateTables();
    }

    function updateMiniCalendar() {
        // Update month and year display
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        miniCurrentMonthYear.textContent = `${months[miniCurrentMonth]} ${miniCurrentYear}`;

        // Clear previous days
        miniCalendarDays.innerHTML = '';

        // Get first day of month and number of days
        const firstDay = new Date(miniCurrentYear, miniCurrentMonth, 1).getDay();
        const daysInMonth = new Date(miniCurrentYear, miniCurrentMonth + 1, 0).getDate();

        // Get days from previous month
        const daysInPrevMonth = new Date(miniCurrentYear, miniCurrentMonth, 0).getDate();

        // Add days from previous month
        for (let i = firstDay - 1; i >= 0; i--) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('non-month');
            dayElement.textContent = daysInPrevMonth - i;
            miniCalendarDays.appendChild(dayElement);
        }

        // Add days of current month
        const today = new Date();
        const isCurrentMonth = today.getMonth() === miniCurrentMonth && today.getFullYear() === miniCurrentYear;

        // Holidays data (sample data)
        const holidays = [
            '2025-01-01', '2025-01-02', '2025-01-03', '2025-04-21',
            '2025-06-24', '2025-07-01', '2025-09-01', '2025-10-13',
            '2025-12-25', '2025-12-26'
        ];

        for (let i = 1; i <= daysInMonth; i++) {
            const dayElement = document.createElement('div');
            const currentDate = new Date(miniCurrentYear, miniCurrentMonth, i);
            const dateString = formatDateISO(currentDate);

            // Store date information as data attributes
            dayElement.setAttribute('data-date', dateString);
            dayElement.setAttribute('data-day', i);
            dayElement.setAttribute('data-month', miniCurrentMonth + 1);
            dayElement.setAttribute('data-year', miniCurrentYear);
            dayElement.setAttribute('data-week', getWeekNumber(currentDate));

            // Check if it's today
            if (isCurrentMonth && i === today.getDate()) {
                dayElement.classList.add('today');
            }

            // Check if it's a weekend
            const dayOfWeek = currentDate.getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                dayElement.classList.add('non-working');
            }

            // Check if it's a holiday
            const isHoliday = holidays.includes(dateString);
            if (isHoliday) {
                dayElement.classList.add('holiday');
            }

            // Check if this date is in the selected range
            if (selectedDates.includes(dateString)) {
                dayElement.classList.add('selected');

                // Check if it's the start or end of a selection
                if (dateString === selectionStart) {
                    dayElement.classList.add('selection-start');
                }
                if (dateString === selectionEnd) {
                    dayElement.classList.add('selection-end');
                }
            }

            // Add day number
            dayElement.textContent = i;

            // Add click event listener for date selection
            dayElement.addEventListener('click', handleDateSelection);

            miniCalendarDays.appendChild(dayElement);
        }

        // Add days from next month to fill the grid
        const totalDaysDisplayed = miniCalendarDays.childElementCount;
        const daysToAdd = 42 - totalDaysDisplayed; // 6 rows of 7 days

        for (let i = 1; i <= daysToAdd; i++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('non-month');
            dayElement.textContent = i;
            miniCalendarDays.appendChild(dayElement);
        }
    }

    // Handle date selection in both calendars
    function handleDateSelection(e) {
        // Don't allow selection of non-month days
        if (this.classList.contains('non-month')) {
            return;
        }

        const clickedDate = this.getAttribute('data-date');
        console.log('Date clicked:', clickedDate);

        try {
            // If shift key is pressed, select a range
            if (e.shiftKey && selectionStart) {
                // Clear previous selection
                clearDateSelection();

                // Set selection end
                selectionEnd = clickedDate;

                // Select all dates in the range
                const startDate = new Date(selectionStart);
                const endDate = new Date(clickedDate);

                // Ensure startDate is before endDate
                if (startDate > endDate) {
                    [selectionStart, selectionEnd] = [selectionEnd, selectionStart];
                    [startDate, endDate] = [endDate, startDate];
                }

                // Add all dates in range to selectedDates
                let currentDateInRange = new Date(startDate);
                while (currentDateInRange <= endDate) {
                    const dateStr = formatDateISO(currentDateInRange);
                    selectedDates.push(dateStr);
                    currentDateInRange.setDate(currentDateInRange.getDate() + 1);
                }

                console.log('Selected date range:', selectionStart, 'to', selectionEnd);

                // Add to working days table
                addToWorkingDaysTable(selectionStart, selectionEnd);

                // Update both calendars
                setTimeout(() => {
                    updateCalendar();
                    updateMiniCalendar();
                }, 10);
            } else {
                // Single date selection
                clearDateSelection();
                selectionStart = clickedDate;
                selectionEnd = clickedDate;
                selectedDates = [clickedDate];

                console.log('Selected single date:', clickedDate);

                // Add to working days table
                addToWorkingDaysTable(selectionStart, selectionEnd);

                // Update both calendars
                setTimeout(() => {
                    updateCalendar();
                    updateMiniCalendar();
                }, 10);
            }
        } catch (error) {
            console.error('Error in date selection:', error);
        }
    }

    // Generate sample data for working days based on current month
    function generateWorkingDaysData() {
        const currentMonthStr = String(currentMonth + 1).padStart(2, '0');
        const currentYearStr = String(currentYear);

        // Get the number of days in the current month
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        // Generate weekly data
        const data = [];
        let weekStart = 1;

        while (weekStart <= daysInMonth) {
            // Calculate week end (Friday or end of month)
            let weekEnd = Math.min(weekStart + 4, daysInMonth);

            // Get the week number
            const weekDate = new Date(currentYear, currentMonth, weekStart);
            const weekNumber = getWeekNumber(weekDate);

            // Calculate working days (excluding weekends)
            let workingDaysCount = 0;
            for (let day = weekStart; day <= weekEnd; day++) {
                const dayOfWeek = new Date(currentYear, currentMonth, day).getDay();
                if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
                    workingDaysCount++;
                }
            }

            // Add to data array
            data.push({
                week: weekNumber,
                from: `${currentYearStr}-${currentMonthStr}-${String(weekStart).padStart(2, '0')}`,
                to: `${currentYearStr}-${currentMonthStr}-${String(weekEnd).padStart(2, '0')}`,
                days: workingDaysCount,
                hours: `${workingDaysCount * 8}:00`
            });

            // Move to next week
            weekStart = weekEnd + 1;
        }

        return data;
    }



    // Populate tables with data
    function populateTables() {
        console.log('Populating tables with data');

        // Working days table
        const workingDaysBody = document.getElementById('working-days-body');
        if (!workingDaysBody) {
            console.error('Working days body element not found!');
            return;
        }

        // Clear the table
        workingDaysBody.innerHTML = '';

        try {
            console.log('Working days data length:', workingDaysData.length);

            if (!workingDaysData || workingDaysData.length === 0) {
                // Add a default row if no data
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td colspan="5">No working days data. Select dates in the calendar to add them.</td>
                `;
                workingDaysBody.appendChild(tr);
            } else {
                // Add each row to the table
                workingDaysData.forEach((row, index) => {
                    if (!row) {
                        console.error('Invalid row data at index', index);
                        return;
                    }

                    const tr = document.createElement('tr');
                    tr.className = index % 2 === 0 ? 'even-row' : 'odd-row';

                    try {
                        tr.innerHTML = `
                            <td><strong>${row.week}</strong></td>
                            <td>${formatDate(row.from)}</td>
                            <td>${formatDate(row.to)}</td>
                            <td>${row.days}</td>
                            <td>${row.hours}</td>
                        `;
                    } catch (err) {
                        console.error('Error creating row HTML:', err, row);
                        tr.innerHTML = `
                            <td colspan="5">Error displaying row data</td>
                        `;
                    }

                    workingDaysBody.appendChild(tr);
                });

                console.log('Successfully populated working days table with', workingDaysData.length, 'rows');
            }
        } catch (e) {
            console.error('Error populating working days table:', e);

            // Add error message row
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td colspan="5">Error loading data. Please try refreshing the page.</td>
            `;
            workingDaysBody.appendChild(tr);
        }

        // Non-working days table
        const nonWorkingDaysBody = document.getElementById('non-working-days-body');
        if (nonWorkingDaysBody) {
            nonWorkingDaysBody.innerHTML = '';

            nonWorkingDaysData.forEach(row => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${formatDate(row.date)}</td>
                    <td>${row.regFrom}</td>
                    <td>${row.regTo}</td>
                    <td>${row.otFrom}</td>
                    <td>${row.otTo}</td>
                    <td>${row.dtFrom}</td>
                    <td>${row.dtTo}</td>
                `;
                nonWorkingDaysBody.appendChild(tr);
            });
        }

        // Holidays table
        const holidaysBody = document.getElementById('holidays-body');
        if (holidaysBody) {
            holidaysBody.innerHTML = '';

            holidaysData.forEach((row, index) => {
                const tr = document.createElement('tr');
                // Add alternating row classes for better readability
                tr.className = index % 2 === 0 ? 'even-row' : 'odd-row';

                tr.innerHTML = `
                    <td>${formatDate(row.date)}</td>
                    <td>${row.name}</td>
                    <td>${row.doubletime}</td>
                    <td>${row.tripletime}</td>
                    <td>${row.overtime}</td>
                `;
                holidaysBody.appendChild(tr);
            });
        }
    }

    // Helper function to format dates for display (DD-MM-YYYY)
    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    }

    // Helper function to format dates in ISO format (YYYY-MM-DD)
    function formatDateISO(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${year}-${month}-${day}`;
    }

    // Function to get ISO week number
    function getWeekNumber(date) {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    }

    // Function to clear date selection
    function clearDateSelection() {
        selectionStart = null;
        selectionEnd = null;
        selectedDates = [];
    }

    // Function to add selected date range to working days table
    function addToWorkingDaysTable(startDate, endDate) {
        console.log('Adding to working days table:', startDate, 'to', endDate);

        try {
            const start = new Date(startDate);

            // Get week number for the start date
            const weekNumber = getWeekNumber(start);
            console.log('Week number:', weekNumber);

            // Calculate working days
            const workingDaysCount = calculateWorkingDays(startDate, endDate);
            console.log('Working days count:', workingDaysCount);

            // Calculate total hours (8 hours per working day)
            const totalHours = workingDaysCount * 8;

            // Make sure workingDaysData is initialized
            if (!workingDaysData) {
                workingDaysData = [];
            }

            // Check if this week already exists in the table
            const existingEntryIndex = workingDaysData.findIndex(entry => entry && entry.week === weekNumber);
            console.log('Existing entry index:', existingEntryIndex);

            if (existingEntryIndex !== -1) {
                // Update existing entry
                workingDaysData[existingEntryIndex] = {
                    week: weekNumber,
                    from: startDate,
                    to: endDate,
                    days: workingDaysCount,
                    hours: `${totalHours}:00`
                };
                console.log('Updated existing entry');
            } else {
                // Add new entry
                const newEntry = {
                    week: weekNumber,
                    from: startDate,
                    to: endDate,
                    days: workingDaysCount,
                    hours: `${totalHours}:00`
                };

                workingDaysData.push(newEntry);
                console.log('Added new entry:', newEntry);

                // Sort by week number
                workingDaysData.sort((a, b) => a.week - b.week);
            }

            // Store a copy of the data in localStorage for persistence
            try {
                localStorage.setItem('workingDaysData', JSON.stringify(workingDaysData));
                console.log('Saved working days data to localStorage');
            } catch (err) {
                console.error('Error saving to localStorage:', err);
            }

            // Update the table
            populateTables();

            // Switch to the working days tab
            switchToTab('working-days');
        } catch (error) {
            console.error('Error in addToWorkingDaysTable:', error);
        }
    }

    // Function to calculate working days between two dates (excluding weekends and holidays)
    function calculateWorkingDays(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Ensure startDate is before endDate
        if (start > end) {
            [start, end] = [end, start];
        }

        let workingDays = 0;
        let currentDate = new Date(start);

        // Holidays data
        const holidays = [
            '2025-01-01', '2025-01-02', '2025-01-03', '2025-04-21',
            '2025-06-24', '2025-07-01', '2025-09-01', '2025-10-13',
            '2025-12-25', '2025-12-26'
        ];

        while (currentDate <= end) {
            // Skip weekends and holidays
            const dayOfWeek = currentDate.getDay();
            const dateString = formatDateISO(currentDate);

            if (dayOfWeek !== 0 && dayOfWeek !== 6 && !holidays.includes(dateString)) {
                workingDays++;
            }

            currentDate.setDate(currentDate.getDate() + 1);
        }

        return workingDays;
    }

    // Add event listeners for time period selection
    periodRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            currentTimePeriod = this.value;
            updateWorkingHoursAnalysis();
        });
    });

    // Function to update the table header based on time period
    function updateTableHeader() {
        let headerHTML = '';

        switch(currentTimePeriod) {
            case 'daily':
                headerHTML = `
                    <th>Date</th>
                    <th>Day</th>
                    <th>Regular Hours</th>
                    <th>Overtime Hours</th>
                    <th>Double Hours</th>
                    <th>Triple Hours</th>
                    <th>Total Hours</th>
                `;
                break;
            case 'weekly':
                headerHTML = `
                    <th>Week</th>
                    <th>Regular Hours</th>
                    <th>Overtime Hours</th>
                    <th>Double Hours</th>
                    <th>Triple Hours</th>
                    <th>Total Hours</th>
                `;
                break;
            case 'biweekly':
                headerHTML = `
                    <th>Period</th>
                    <th>Regular Hours</th>
                    <th>Overtime Hours</th>
                    <th>Double Hours</th>
                    <th>Triple Hours</th>
                    <th>Total Hours</th>
                `;
                break;
            case 'monthly':
                headerHTML = `
                    <th>Month</th>
                    <th>Regular Hours</th>
                    <th>Overtime Hours</th>
                    <th>Double Hours</th>
                    <th>Triple Hours</th>
                    <th>Total Hours</th>
                `;
                break;
        }

        workingTimeHeader.innerHTML = headerHTML;
    }

    // Populate working hours data table based on selected time period
    function populateWorkingHoursData() {
        workingTimeDataBody.innerHTML = '';
        const data = workingHoursData[currentTimePeriod];

        data.forEach(row => {
            const tr = document.createElement('tr');

            switch(currentTimePeriod) {
                case 'daily':
                    tr.innerHTML = `
                        <td>${formatDate(row.date)}</td>
                        <td>${row.day}</td>
                        <td>${row.regular}:00</td>
                        <td>${row.overtime}:00</td>
                        <td>${row.double}:00</td>
                        <td>${row.triple}:00</td>
                        <td>${row.total}:00</td>
                    `;
                    break;
                case 'weekly':
                    tr.innerHTML = `
                        <td>${row.week}</td>
                        <td>${row.regular}:00</td>
                        <td>${row.overtime}:00</td>
                        <td>${row.double}:00</td>
                        <td>${row.triple}:00</td>
                        <td>${row.total}:00</td>
                    `;
                    break;
                case 'biweekly':
                    tr.innerHTML = `
                        <td>${row.period}</td>
                        <td>${row.regular}:00</td>
                        <td>${row.overtime}:00</td>
                        <td>${row.double}:00</td>
                        <td>${row.triple}:00</td>
                        <td>${row.total}:00</td>
                    `;
                    break;
                case 'monthly':
                    tr.innerHTML = `
                        <td>${row.month}</td>
                        <td>${row.regular}:00</td>
                        <td>${row.overtime}:00</td>
                        <td>${row.double}:00</td>
                        <td>${row.triple}:00</td>
                        <td>${row.total}:00</td>
                    `;
                    break;
            }

            workingTimeDataBody.appendChild(tr);
        });
    }

    // Initialize working hours chart based on selected time period
    function initWorkingHoursChart() {
        // Clear previous chart if it exists
        if (workingHoursChart) {
            workingHoursChart.destroy();
        }

        const data = workingHoursData[currentTimePeriod];

        // Extract data for chart based on time period
        let labels, xAxisTitle, chartTitle;

        switch(currentTimePeriod) {
            case 'daily':
                labels = data.map(item => `${item.day} ${formatDate(item.date)}`);
                xAxisTitle = 'Day';
                chartTitle = 'Working Hours by Day';
                break;
            case 'weekly':
                labels = data.map(item => `Week ${item.week}`);
                xAxisTitle = 'Week';
                chartTitle = 'Working Hours by Week';
                break;
            case 'biweekly':
                labels = data.map(item => `Period ${item.period}`);
                xAxisTitle = 'Period';
                chartTitle = 'Working Hours by Bi-Weekly Period';
                break;
            case 'monthly':
                labels = data.map(item => item.month);
                xAxisTitle = 'Month';
                chartTitle = 'Working Hours by Month';
                break;
        }

        const regularHours = data.map(item => item.regular);
        const overtimeHours = data.map(item => item.overtime);
        const doubleHours = data.map(item => item.double);
        const tripleHours = data.map(item => item.triple);

        // Create chart
        workingHoursChart = new Chart(workingHoursChartCanvas, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Regular Hours',
                        data: regularHours,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        borderColor: 'rgba(0, 0, 0, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Overtime Hours',
                        data: overtimeHours,
                        backgroundColor: 'rgba(100, 100, 100, 0.7)',
                        borderColor: 'rgba(100, 100, 100, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Double Hours',
                        data: doubleHours,
                        backgroundColor: 'rgba(200, 50, 50, 0.7)',
                        borderColor: 'rgba(200, 50, 50, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Triple Hours',
                        data: tripleHours,
                        backgroundColor: 'rgba(50, 50, 200, 0.7)',
                        borderColor: 'rgba(50, 50, 200, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Hours'
                        },
                        stacked: false
                    },
                    x: {
                        title: {
                            display: true,
                            text: xAxisTitle
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: chartTitle,
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.raw}:00`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Function to update both table and chart
    function updateWorkingHoursAnalysis() {
        updateTableHeader();
        populateWorkingHoursData();
        initWorkingHoursChart();
    }

    // Function to properly switch to a specific tab
    function switchToTab(tabId) {
        console.log('Switching to tab:', tabId);

        // Find the tab button
        const tabButton = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
        if (!tabButton) {
            console.error('Tab button not found for tab:', tabId);
            return false;
        }

        // Remove active class from all buttons and panes
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));

        // Add active class to the target button and corresponding pane
        tabButton.classList.add('active');
        
        const tabPane = document.getElementById(tabId);

        if (tabPane) {
            tabPane.classList.add('active');

            console.log('Activated tab pane:', tabId);

            // Handle specific tab activations
            if (tabId === 'working-days') {
                location.reload();
                updateMiniCalendar();
                populateTables();
            } else if (tabId === 'working-time') {
                updateWorkingHoursAnalysis();
            } else if (tabId === 'holidays') {
                populateTables();
            } else if (tabId === 'calendar') {
                updateCalendar();
            }

            return true;
        } else {
            console.error('Tab pane not found:', tabId);
            return false;
        }
    }
});