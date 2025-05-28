// Calendar and Booking System for Bay Management

class CalendarManager {
    constructor() {
        this.currentDate = new Date();
        this.bookings = [];
        this.selectedDate = null;
        this.selectedBay = null;
        this.currentView = 'month'; // month, week, day
        this.viewStartDate = new Date();

        this.init();
    }

    init() {
        // Populate with some sample bookings if none exist
        this.loadBookings();
        if (!this.bookings || this.bookings.length === 0) {
            this.bookings = [
                {
                    bayId: 'BAY-01',
                    date: '2025-05-27',
                    time: '10:00 AM',
                    customer: 'John Doe',
                    vehicle: 'Toyota Camry',
                    service: 'Oil Change'
                },
                {
                    bayId: 'BAY-02',
                    date: '2025-05-28',
                    time: '2:00 PM',
                    customer: 'Jane Smith',
                    vehicle: 'Ford F-150',
                    service: 'Brake Inspection'
                },
                {
                    bayId: 'BAY-03',
                    date: '2025-05-29',
                    time: '9:00 AM',
                    customer: 'Mike Brown',
                    vehicle: 'Honda Accord',
                    service: 'Tire Rotation'
                },
                {
                    bayId: 'BAY-04',
                    date: '2025-05-30',
                    time: '1:30 PM',
                    customer: 'Emily White',
                    vehicle: 'Chevy Malibu',
                    service: 'Paint Touch-up'
                }
            ];
            // For each booking, set startTime and endTime for compatibility with rendering logic
            this.bookings.forEach(b => {
                // Parse startTime from date and time
                const dt = new Date(`${b.date}T${b.time.replace(/(AM|PM)/, '').trim()}`);
                // If time is in PM and not 12 PM, add 12 hours
                if (/PM/.test(b.time) && !/^12/.test(b.time)) dt.setHours(dt.getHours() + 12);
                b.startTime = dt;
                // Default duration: 1 hour
                b.endTime = new Date(dt.getTime() + 60 * 60 * 1000);
            });
            this.saveBookings();
        }
        this.setupEventListeners();
    }

    loadBookings() {
        this.bookings = Utils.loadFromStorage('bookings', []);
        // Convert date strings back to Date objects
        this.bookings.forEach(booking => {
            booking.startTime = new Date(booking.startTime);
            booking.endTime = new Date(booking.endTime);
        });
    }

    saveBookings() {
        Utils.saveToStorage('bookings', this.bookings);
    }

    setupEventListeners() {
        // Calendar navigation
        document.addEventListener('click', (e) => {
            if (e.target.matches('.calendar-prev')) {
                this.navigatePrevious();
            } else if (e.target.matches('.calendar-next')) {
                this.navigateNext();
            } else if (e.target.matches('.calendar-day, .week-day, .day-hour, .week-cell, .clickable-slot')) {
                // Don't select if clicking on a booking
                if (!e.target.closest('.booking-preview, .booking-details, .booking-multi-slot')) {
                    this.selectDate(e.target.closest('.calendar-day, .week-day, .day-hour, .week-cell, .clickable-slot'));
                }
            } else if (e.target.matches('.time-slot')) {
                this.selectTimeSlot(e.target);
            } else if (e.target.matches('.view-btn')) {
                this.switchView(e.target.dataset.view);
            } else if (e.target.matches('.today-btn')) {
                this.goToToday();
            } else if (e.target.matches('#calendarHelp')) {
                this.showKeyboardShortcuts();
            }
        });

        // Setup drag and drop for bookings
        this.setupBookingDragDrop();

        // Booking modal events
        const bookingModal = document.getElementById('bookingModal');
        if (bookingModal) {
            bookingModal.addEventListener('shown.bs.modal', () => {
                this.renderCalendar();
            });
        }

        // Keyboard shortcuts for calendar navigation
        document.addEventListener('keydown', (e) => {
            // Only handle shortcuts when calendar modal is open
            if (document.querySelector('#bookingModal.show')) {
                switch (e.key) {
                    case '1':
                        e.preventDefault();
                        this.switchView('month');
                        break;
                    case '2':
                        e.preventDefault();
                        this.switchView('week');
                        break;
                    case '3':
                        e.preventDefault();
                        this.switchView('day');
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.navigatePrevious();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.navigateNext();
                        break;
                    case 't':
                    case 'T':
                        e.preventDefault();
                        this.goToToday();
                        break;
                }
            }
        });
    }

    getCalendarTitle() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        switch (this.currentView) {
            case 'month':
                return `${this.getMonthName(month)} ${year}`;
            case 'week':
                const weekStart = this.getWeekStart(this.currentDate);
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekEnd.getDate() + 6);
                return `${this.formatDateShort(weekStart)} - ${this.formatDateShort(weekEnd)}`;
            case 'day':
                return this.formatDateLong(this.currentDate);
            default:
                return '';
        }
    }

    renderCalendar() {
        const container = document.getElementById('bookingCalendar');
        if (!container) return;

        // Bay filter dropdown
        let bayOptions = '<option value="">All Bays</option>';
        if (window.bayManagement && window.bayManagement.bays) {
            window.bayManagement.bays.forEach(bay => {
                bayOptions += `<option value="${bay.id}"${this.selectedBay && this.selectedBay.id === bay.id ? ' selected' : ''}>${bay.id} (${bay.type})</option>`;
            });
        }
        const bayFilter = `
            <select id="calendarBayFilter" class="form-select form-select-sm ms-2" style="width:auto; display:inline-block;">
                ${bayOptions}
            </select>
        `;

        container.innerHTML = `
            <div class="calendar-header">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div class="d-flex align-items-center">
                        <button class="btn btn-outline-primary btn-sm calendar-prev me-2">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <button class="btn btn-outline-secondary btn-sm today-btn me-2">Today</button>
                        <button class="btn btn-outline-primary btn-sm calendar-next">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                        ${bayFilter}
                    </div>
                    <h5 class="mb-0" id="calendarTitle">${this.getCalendarTitle()}</h5>
                    <div class="d-flex align-items-center">
                        <div class="btn-group me-2" role="group">
                            <button class="btn btn-sm ${this.currentView === 'month' ? 'btn-primary' : 'btn-outline-primary'} view-btn" data-view="month" title="Month View (Press 1)">Month</button>
                            <button class="btn btn-sm ${this.currentView === 'week' ? 'btn-primary' : 'btn-outline-primary'} view-btn" data-view="week" title="Week View (Press 2)">Week</button>
                            <button class="btn btn-sm ${this.currentView === 'day' ? 'btn-primary' : 'btn-outline-primary'} view-btn" data-view="day" title="Day View (Press 3)">Day</button>
                        </div>
                        <button class="btn btn-sm btn-outline-secondary" id="calendarHelp" title="Keyboard Shortcuts">
                            <i class="fas fa-question-circle"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="calendar-content">
                ${this.renderCurrentView()}
            </div>
            <div class="time-slots mt-3" id="timeSlots" style="display: none;">
                <h6>Available Time Slots</h6>
                <div class="row" id="timeSlotsContainer">
                    <!-- Time slots will be rendered here -->
                </div>
            </div>
            <div class="booking-form mt-3" id="bookingForm" style="display: none;">
                ${this.renderBookingForm()}
            </div>
        `;

        // Bay filter event
        setTimeout(() => {
            const bayFilterEl = document.getElementById('calendarBayFilter');
            if (bayFilterEl) {
                bayFilterEl.onchange = (e) => {
                    const bayId = bayFilterEl.value;
                    if (bayId) {
                        this.selectedBay = window.bayManagement.bays.find(b => b.id === bayId);
                    } else {
                        this.selectedBay = null;
                    }
                    this.renderCalendar();
                };
            }
        }, 0);
    }

    // Filter bookings for current view
    getFilteredBookings() {
        if (this.selectedBay && this.selectedBay.id) {
            return this.bookings.filter(b => b.bayId === this.selectedBay.id);
        }
        return this.bookings;
    }

    renderCurrentView() {
        switch (this.currentView) {
            case 'month':
                return this.renderMonthView();
            case 'week':
                return this.renderWeekView();
            case 'day':
                return this.renderDayView();
            default:
                return this.renderMonthView();
        }
    }

    renderMonthView() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const startDay = firstDayOfMonth.getDay();
        const startDate = new Date(year, month, 1 - startDay);
        const today = new Date();
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        let html = '<div class="calendar-month-grid" style="display: grid; grid-template-columns: repeat(7, 1fr); grid-auto-rows: 80px; border: 1px solid #e0e0e0;">';
        for (let i = 0; i < 7; i++) {
            html += `<div class="calendar-weekday" style="background: #f8f9fa; font-weight: bold; text-align: center; border-bottom: 1px solid #e0e0e0; padding: 8px 0;">${weekdays[i]}</div>`;
        }
        let cellDate = new Date(startDate);
        const filteredBookings = this.getFilteredBookings();
        for (let i = 0; i < 42; i++) {
            const isCurrentMonth = cellDate.getMonth() === month;
            const isToday = this.isSameDate(cellDate, today);
            // Find bookings for this day
            const bookingsForDay = filteredBookings.filter(b => {
                let d = b.startTime instanceof Date ? b.startTime : (b.date ? new Date(b.date) : null);
                if (!d) return false;
                return d.getFullYear() === cellDate.getFullYear() && d.getMonth() === cellDate.getMonth() && d.getDate() === cellDate.getDate();
            });
            let bookingHtml = '';
            if (bookingsForDay.length > 0) {
                bookingHtml = '<div class="booking-indicator-list" style="position:absolute; left:2px; top:22px; right:2px; z-index:2;">';
                bookingsForDay.forEach(b => {
                    bookingHtml += `<div class="booking-indicator bg-info text-white rounded px-1 mb-1 small" title="${b.customer} - ${b.vehicle} (${b.service})">${b.bayId}: ${b.customer}</div>`;
                });
                bookingHtml += '</div>';
            }
            html += `<div class="calendar-day${isCurrentMonth ? '' : ' muted'}${isToday ? ' today' : ''}" style="border: 1px solid #e0e0e0; background: ${isCurrentMonth ? '#fff' : '#f4f4f4'}; text-align: right; padding: 6px 8px; position: relative; cursor: pointer; font-size: 15px;" data-date="${cellDate.toISOString().split('T')[0]}">
                <span style="font-weight: ${isToday ? 'bold' : 'normal'}; color: ${isCurrentMonth ? '#222' : '#bbb'};">${cellDate.getDate()}</span>
                ${bookingHtml}
            </div>`;
            cellDate.setDate(cellDate.getDate() + 1);
        }
        html += '</div>';

        // Attach click event after rendering
        setTimeout(() => {
            document.querySelectorAll('.calendar-day').forEach(dayEl => {
                dayEl.onclick = (e) => {
                    const dateStr = dayEl.getAttribute('data-date');
                    if (dateStr) {
                        this.quickBookShowTimeSlots(dateStr);
                    }
                };
            });
        }, 0);

        return html;
    }

    quickBookShowTimeSlots(dateStr) {
        // Show time slots for the selected date
        this.selectedDate = new Date(dateStr);
        const container = document.getElementById('timeSlots');
        if (!container) return;
        container.style.display = '';
        const slots = this.generateTimeSlots();
        let html = '';
        slots.forEach(slot => {
            html += `<button class="btn btn-outline-primary m-1 quick-book-slot" data-time="${slot}">${slot}</button>`;
        });
        document.getElementById('timeSlotsContainer').innerHTML = html;
        // Hide booking form
        const bookingForm = document.getElementById('bookingForm');
        if (bookingForm) bookingForm.style.display = 'none';
        // Attach click event for slots
        setTimeout(() => {
            document.querySelectorAll('.quick-book-slot').forEach(btn => {
                btn.onclick = () => {
                    this.quickBookShowForm(btn.getAttribute('data-time'));
                };
            });
        }, 0);
    }

    quickBookShowForm(timeStr) {
        // Show a minimal modal for booking
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="fas fa-calendar-plus me-2"></i>Quick Book</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="quickBookForm">
                            <input type="hidden" name="date" value="${this.selectedDate.toISOString().split('T')[0]}">
                            <input type="hidden" name="time" value="${timeStr}">
                            <input type="hidden" name="bay" value="${this.selectedBay ? this.selectedBay.id : ''}">
                            <div class="mb-3">
                                <label class="form-label">Customer</label>
                                <input type="text" class="form-control" name="customer" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Vehicle</label>
                                <input type="text" class="form-control" name="vehicle" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Service Type</label>
                                <input type="text" class="form-control" name="service" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="quickBookConfirm">Confirm</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
        modal.addEventListener('hidden.bs.modal', () => modal.remove());
        document.getElementById('quickBookConfirm').onclick = () => {
            const form = document.getElementById('quickBookForm');
            const customer = form.customer.value.trim();
            const vehicle = form.vehicle.value.trim();
            const service = form.service.value.trim();
            if (!customer || !vehicle || !service) {
                alert('Please fill all fields');
                return;
            }
            // Create booking
            const booking = {
                bayId: this.selectedBay ? this.selectedBay.id : '',
                date: form.date.value,
                time: form.time.value,
                customer,
                vehicle,
                service
            };
            this.bookings.push(booking);
            this.saveBookings();
            bsModal.hide();
            Utils.showToast('Booking created!', 'success');
            // Optionally, refresh calendar or slots
            this.renderCalendar();
        };
    }

    renderWeekView() {
        const weekStart = this.getWeekStart(this.currentDate);
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const hours = this.generateHourSlots();

        let html = '<div class="calendar-grid week-view">';

        // Header with days
        html += '<div class="week-header">';
        html += '<div class="time-column-header"></div>'; // Empty corner

        for (let i = 0; i < 7; i++) {
            const date = new Date(weekStart);
            date.setDate(date.getDate() + i);
            const isToday = this.isSameDate(date, new Date());
            const dayClass = isToday ? 'week-day today' : 'week-day';

            html += `
                <div class="${dayClass}" data-date="${date.toISOString().split('T')[0]}">
                    <div class="day-name">${weekdays[i]}</div>
                    <div class="day-number">${date.getDate()}</div>
                </div>
            `;
        }
        html += '</div>';

        // Time slots grid
        html += '<div class="week-grid">';
        hours.forEach(hour => {
            html += '<div class="week-row">';
            html += `<div class="time-label">${this.formatTime(hour)}</div>`;

            for (let i = 0; i < 7; i++) {
                const date = new Date(weekStart);
                date.setDate(date.getDate() + i);
                const [h, m] = hour.split(':');
                date.setHours(parseInt(h), parseInt(m), 0, 0);

                const bookings = this.getBookingsForDateTime(date);
                const hasBooking = bookings.length > 0;

                html += `
                    <div class="week-cell ${hasBooking ? 'has-booking' : ''} clickable-slot"
                         data-date="${date.toISOString().split('T')[0]}"
                         data-time="${hour}"
                         title="Click to book this time slot">
                        ${hasBooking ? this.renderBookingPreview(bookings[0]) : ''}
                    </div>
                `;
            }
            html += '</div>';
        });
        html += '</div></div>';

        return html;
    }

    renderDayView() {
        const date = new Date(this.currentDate);
        const hours = this.generateHourSlots();
        const bookings = this.getBookingsForDate(date);

        let html = '<div class="calendar-grid day-view">';

        // Day header
        html += `
            <div class="day-header">
                <h4>${this.formatDateLong(date)}</h4>
            </div>
        `;

        // Hour slots
        html += '<div class="day-grid">';
        hours.forEach(hour => {
            const [h, m] = hour.split(':');
            const slotTime = new Date(date);
            slotTime.setHours(parseInt(h), parseInt(m), 0, 0);

            const slotBookings = this.getBookingsForDateTime(slotTime);
            const hasBooking = slotBookings.length > 0;

            html += `
                <div class="day-hour ${hasBooking ? 'has-booking' : ''} clickable-slot"
                     data-date="${date.toISOString().split('T')[0]}"
                     data-time="${hour}"
                     title="Click to book this time slot">
                    <div class="hour-label">${this.formatTime(hour)}</div>
                    <div class="hour-content">
                        ${hasBooking ? this.renderBookingDetails(slotBookings[0]) : ''}
                    </div>
                </div>
            `;
        });
        html += '</div></div>';

        return html;
    }

    renderBookingForm() {
        // Pre-select the bay in the booking form if calendarManager.selectedBay is set
        setTimeout(() => {
            if (this.selectedBay && document.getElementById('bookingBay')) {
                document.getElementById('bookingBay').value = this.selectedBay.id;
                document.getElementById('bookingBay').disabled = true;
            } else if (document.getElementById('bookingBay')) {
                document.getElementById('bookingBay').disabled = false;
            }
        }, 0);
        return `
            <div class="card">
                <div class="card-header">
                    <h6 class="mb-0">Book Bay</h6>
                </div>
                <div class="card-body">
                    <form id="newBookingForm">
                        <div class="row">
                            <div class="col-md-6">
                                <label class="form-label">Bay</label>
                                <select class="form-select" id="bookingBay" required>
                                    <option value="">Select Bay</option>
                                    ${this.renderBayOptions()}
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Duration (hours)</label>
                                <select class="form-select" id="bookingDuration" required>
                                    <option value="0.5">30 minutes</option>
                                    <option value="1">1 hour</option>
                                    <option value="1.5">1.5 hours</option>
                                    <option value="2">2 hours</option>
                                    <option value="3">3 hours</option>
                                    <option value="4">4 hours</option>
                                    <option value="8">Full day</option>
                                </select>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-md-6">
                                <label class="form-label">Customer</label>
                                <input type="text" class="form-control" id="bookingCustomer" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Vehicle</label>
                                <input type="text" class="form-control" id="bookingVehicle" required>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-12">
                                <label class="form-label">Service Type</label>
                                <select class="form-select" id="bookingService" required>
                                    <option value="">Select Service</option>
                                    <option value="maintenance">Maintenance</option>
                                    <option value="repair">Repair</option>
                                    <option value="inspection">Inspection</option>
                                    <option value="alignment">Wheel Alignment</option>
                                    <option value="diagnostic">Diagnostic</option>
                                    <option value="bodywork">Body Work</option>
                                </select>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-12">
                                <label class="form-label">Notes</label>
                                <textarea class="form-control" id="bookingNotes" rows="2" placeholder="Additional notes..."></textarea>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-12">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="recurringBooking">
                                    <label class="form-check-label" for="recurringBooking">
                                        Recurring booking (weekly)
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="mt-3">
                            <button type="button" class="btn btn-primary" onclick="calendarManager.createBooking()">
                                <i class="fas fa-calendar-plus me-2"></i>Create Booking
                            </button>
                            <button type="button" class="btn btn-secondary ms-2" onclick="calendarManager.cancelBooking()">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    renderBayOptions() {
        if (!window.bayManagement || !window.bayManagement.bays) {
            return '<option value="">No bays available</option>';
        }

        return window.bayManagement.bays
            .filter(bay => bay.status === 'available')
            .map(bay => `<option value="${bay.id}">${bay.id} (${bay.type})</option>`)
            .join('');
    }

    selectDate(dayElement) {
        // Remove previous selection
        document.querySelectorAll('.calendar-day.selected, .week-day.selected, .week-cell.selected, .day-hour.selected').forEach(el => {
            el.classList.remove('selected');
        });

        // Select new date
        dayElement.classList.add('selected');
        this.selectedDate = new Date(dayElement.dataset.date);

        // Set selected time if available
        if (dayElement.dataset.time) {
            this.selectedTime = dayElement.dataset.time;
            // Show booking form directly for week/day view
            document.getElementById('bookingForm').style.display = 'block';
            document.getElementById('timeSlots').style.display = 'none';

            // Populate the booking form with selected date and time
            this.populateBookingDateTime();
        } else {
            // Show time slots for month view
            this.renderTimeSlots();
            document.getElementById('timeSlots').style.display = 'block';
            document.getElementById('bookingForm').style.display = 'none';
        }

        // Scroll to the appropriate section
        const targetElement = document.getElementById('bookingForm').style.display === 'block'
            ? document.getElementById('bookingForm')
            : document.getElementById('timeSlots');
        Utils.scrollToElement(targetElement, 100);
    }

    renderTimeSlots() {
        const container = document.getElementById('timeSlotsContainer');
        if (!container) return;

        const timeSlots = this.generateTimeSlots();
        const bookingsForDate = this.getBookingsForDate(this.selectedDate);

        container.innerHTML = '';

        timeSlots.forEach(slot => {
            const isAvailable = !this.isTimeSlotBooked(slot, bookingsForDate);
            const slotElement = document.createElement('div');
            slotElement.className = 'col-md-3 mb-2';

            slotElement.innerHTML = `
                <button class="btn btn-outline-primary btn-sm w-100 time-slot ${!isAvailable ? 'disabled' : ''}"
                        data-time="${slot}" ${!isAvailable ? 'disabled' : ''}>
                    ${this.formatTime(slot)}
                </button>
            `;

            container.appendChild(slotElement);
        });
    }

    generateTimeSlots() {
        const slots = [];
        for (let hour = 8; hour < 18; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                slots.push(time);
            }
        }
        return slots;
    }

    selectTimeSlot(slotElement) {
        if (slotElement.disabled) return;

        // Remove previous selection
        document.querySelectorAll('.time-slot.selected').forEach(el => {
            el.classList.remove('selected');
        });

        // Select new time slot
        slotElement.classList.add('selected');
        this.selectedTime = slotElement.dataset.time;

        // Show booking form
        document.getElementById('bookingForm').style.display = 'block';
        Utils.scrollToElement(document.getElementById('bookingForm'), 100);
    }

    createBooking() {
        if (!this.selectedDate || !this.selectedTime) {
            Utils.showToast('Please select a date and time', 'warning');
            return;
        }

        const formData = {
            bay: document.getElementById('bookingBay').value,
            duration: parseFloat(document.getElementById('bookingDuration').value),
            customer: document.getElementById('bookingCustomer').value,
            vehicle: document.getElementById('bookingVehicle').value,
            service: document.getElementById('bookingService').value,
            notes: document.getElementById('bookingNotes').value,
            recurring: document.getElementById('recurringBooking').checked
        };

        // Validate form
        const errors = Utils.validateForm(formData, {
            bay: { required: true },
            duration: { required: true },
            customer: { required: true, minLength: 2 },
            vehicle: { required: true, minLength: 2 },
            service: { required: true }
        });

        if (errors.length > 0) {
            Utils.showToast(errors[0], 'error');
            return;
        }

        // Create booking
        const startTime = new Date(this.selectedDate);
        const [hours, minutes] = this.selectedTime.split(':');
        startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        const endTime = new Date(startTime);
        endTime.setTime(endTime.getTime() + (formData.duration * 60 * 60 * 1000));

        const booking = {
            id: Utils.generateId(),
            bayId: formData.bay,
            startTime: startTime,
            endTime: endTime,
            customer: formData.customer,
            vehicle: formData.vehicle,
            service: formData.service,
            notes: formData.notes,
            status: 'confirmed',
            createdAt: new Date()
        };

        // Check for conflicts
        if (this.hasConflict(booking)) {
            Utils.showToast('Time slot conflicts with existing booking', 'error');
            return;
        }

        this.bookings.push(booking);

        // Handle recurring bookings
        if (formData.recurring) {
            this.createRecurringBookings(booking, 4); // Create 4 weeks ahead
        }

        this.saveBookings();
        this.renderCalendar();

        // Hide modal
        bootstrap.Modal.getInstance(document.getElementById('bookingModal')).hide();

        Utils.showToast('Booking created successfully', 'success');
        this.selectedBay = null;
    }

    createRecurringBookings(originalBooking, weeks) {
        for (let i = 1; i <= weeks; i++) {
            const recurringBooking = { ...originalBooking };
            recurringBooking.id = Utils.generateId();

            // Add weeks to the dates
            recurringBooking.startTime = new Date(originalBooking.startTime);
            recurringBooking.startTime.setDate(recurringBooking.startTime.getDate() + (i * 7));

            recurringBooking.endTime = new Date(originalBooking.endTime);
            recurringBooking.endTime.setDate(recurringBooking.endTime.getDate() + (i * 7));

            // Check for conflicts before adding
            if (!this.hasConflict(recurringBooking)) {
                this.bookings.push(recurringBooking);
            }
        }
    }

    hasConflict(newBooking) {
        return this.bookings.some(booking => {
            if (booking.bayId !== newBooking.bayId) return false;

            return (newBooking.startTime < booking.endTime && newBooking.endTime > booking.startTime);
        });
    }

    cancelBooking() {
        document.getElementById('bookingForm').style.display = 'none';
        document.getElementById('timeSlots').style.display = 'none';

        // Clear selections
        document.querySelectorAll('.calendar-day.selected, .time-slot.selected').forEach(el => {
            el.classList.remove('selected');
        });

        this.selectedDate = null;
        this.selectedTime = null;
        this.selectedBay = null;
    }

    populateBookingDateTime() {
        // Add a visual indicator showing selected date and time
        const bookingForm = document.getElementById('bookingForm');
        if (!bookingForm) return;

        // Check if datetime display already exists
        let datetimeDisplay = bookingForm.querySelector('.selected-datetime');
        if (!datetimeDisplay) {
            datetimeDisplay = document.createElement('div');
            datetimeDisplay.className = 'selected-datetime alert alert-info mb-3';
            bookingForm.querySelector('.card-body').insertBefore(datetimeDisplay, bookingForm.querySelector('form'));
        }

        const formattedDate = this.formatDateLong(this.selectedDate);
        const formattedTime = this.formatTime(this.selectedTime);

        datetimeDisplay.innerHTML = `
            <i class="fas fa-calendar-check me-2"></i>
            <strong>Selected:</strong> ${formattedDate} at ${formattedTime}
        `;
    }

    getBookingsForDate(date) {
        return this.bookings.filter(booking => {
            return this.isSameDate(booking.startTime, date);
        });
    }

    isTimeSlotBooked(timeSlot, bookings) {
        const [hours, minutes] = timeSlot.split(':');
        const slotTime = new Date(this.selectedDate);
        slotTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        return bookings.some(booking => {
            return slotTime >= booking.startTime && slotTime < booking.endTime;
        });
    }

    isSameDate(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }

    // Navigation methods
    navigatePrevious() {
        switch (this.currentView) {
            case 'month':
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                break;
            case 'week':
                this.currentDate.setDate(this.currentDate.getDate() - 7);
                break;
            case 'day':
                this.currentDate.setDate(this.currentDate.getDate() - 1);
                break;
        }
        this.renderCalendar();
    }

    navigateNext() {
        switch (this.currentView) {
            case 'month':
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                break;
            case 'week':
                this.currentDate.setDate(this.currentDate.getDate() + 7);
                break;
            case 'day':
                this.currentDate.setDate(this.currentDate.getDate() + 1);
                break;
        }
        this.renderCalendar();
    }

    goToToday() {
        this.currentDate = new Date();
        this.renderCalendar();
    }

    switchView(view) {
        this.currentView = view;
        this.renderCalendar();
    }

    // Helper methods for different views
    getWeekStart(date) {
        const start = new Date(date);
        const day = start.getDay();
        const diff = start.getDate() - day;
        start.setDate(diff);
        start.setHours(0, 0, 0, 0);
        return start;
    }

    generateHourSlots() {
        const slots = [];
        for (let hour = 8; hour < 18; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                slots.push(time);
            }
        }
        return slots;
    }

    getBookingsForDateTime(dateTime) {
        return this.bookings.filter(booking => {
            return dateTime >= booking.startTime && dateTime < booking.endTime;
        });
    }

    renderBookingPreview(booking) {
        return `
            <div class="booking-preview"
                 data-booking-id="${booking.id}"
                 title="${booking.customer} - ${booking.vehicle} (Drag to reschedule)">
                <div class="booking-customer">${booking.customer}</div>
                <div class="booking-service">${booking.service}</div>
            </div>
        `;
    }

    renderBookingDetails(booking) {
        const startTime = this.formatTime(booking.startTime.toTimeString().substring(0, 5));
        const endTime = this.formatTime(booking.endTime.toTimeString().substring(0, 5));

        return `
            <div class="booking-details"
                 data-booking-id="${booking.id}"
                 title="Drag to reschedule • Drag edges to resize">
                <div class="booking-time">${startTime} - ${endTime}</div>
                <div class="booking-customer">${booking.customer}</div>
                <div class="booking-vehicle">${booking.vehicle}</div>
                <div class="booking-service">${booking.service}</div>
                <div class="booking-bay">Bay: ${booking.bayId}</div>
            </div>
        `;
    }

    formatDateShort(date) {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric'
        }).format(date);
    }

    formatDateLong(date) {
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    }

    previousMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.renderCalendar();
    }

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.renderCalendar();
    }

    getMonthName(month) {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[month];
    }

    formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    }

    // Public method to show upcoming bookings
    getUpcomingBookings(days = 7) {
        const now = new Date();
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + days);

        return this.bookings
            .filter(booking => booking.startTime >= now && booking.startTime <= futureDate)
            .sort((a, b) => a.startTime - b.startTime);
    }

    // Public method to get bay utilization
    getBayUtilization(bayId, startDate, endDate) {
        const bookings = this.bookings.filter(booking => {
            return booking.bayId === bayId &&
                   booking.startTime >= startDate &&
                   booking.endTime <= endDate;
        });

        const totalTime = endDate - startDate;
        const bookedTime = bookings.reduce((total, booking) => {
            return total + (booking.endTime - booking.startTime);
        }, 0);

        return Math.round((bookedTime / totalTime) * 100);
    }

    // Show keyboard shortcuts help
    showKeyboardShortcuts() {
        const helpModal = document.createElement('div');
        helpModal.className = 'modal fade';
        helpModal.innerHTML = `
            <div class="modal-dialog modal-sm">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-keyboard me-2"></i>Keyboard Shortcuts
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="shortcut-list">
                            <div class="shortcut-item">
                                <kbd>1</kbd> <span>Month View</span>
                            </div>
                            <div class="shortcut-item">
                                <kbd>2</kbd> <span>Week View</span>
                            </div>
                            <div class="shortcut-item">
                                <kbd>3</kbd> <span>Day View</span>
                            </div>
                            <div class="shortcut-item">
                                <kbd>←</kbd> <span>Previous</span>
                            </div>
                            <div class="shortcut-item">
                                <kbd>→</kbd> <span>Next</span>
                            </div>
                            <div class="shortcut-item">
                                <kbd>T</kbd> <span>Today</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(helpModal);
        const bsModal = new bootstrap.Modal(helpModal);
        bsModal.show();

        helpModal.addEventListener('hidden.bs.modal', () => {
            helpModal.remove();
        });
    }

    // Google Calendar-like drag and drop functionality
    setupBookingDragDrop() {
        this.draggedBooking = null;
        this.resizeMode = null;
        this.resizeStartY = 0;
        this.originalDuration = 0;

        // Use event delegation for dynamically created booking elements
        document.addEventListener('mousedown', (e) => {
            const bookingElement = e.target.closest('.booking-preview, .booking-details, .booking-multi-slot');
            if (bookingElement) {
                this.handleBookingMouseDown(e, bookingElement);
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (this.draggedBooking || this.resizeMode) {
                this.handleBookingMouseMove(e);
            }
        });

        document.addEventListener('mouseup', (e) => {
            if (this.draggedBooking || this.resizeMode) {
                this.handleBookingMouseUp(e);
            }
        });
    }

    handleBookingMouseDown(e, bookingElement) {
        e.preventDefault();
        e.stopPropagation();

        const bookingId = bookingElement.dataset.bookingId;
        const booking = this.bookings.find(b => b.id === bookingId);
        if (!booking) return;

        const rect = bookingElement.getBoundingClientRect();
        const clickY = e.clientY - rect.top;

        // Check if clicking on resize handles (top 4px or bottom 4px)
        if (clickY <= 4) {
            this.resizeMode = 'top';
            this.draggedBooking = booking;
            this.resizeStartY = e.clientY;
            this.originalDuration = (booking.endTime - booking.startTime) / (1000 * 60 * 60);
            bookingElement.style.cursor = 'ns-resize';
        } else if (clickY >= rect.height - 4) {
            this.resizeMode = 'bottom';
            this.draggedBooking = booking;
            this.resizeStartY = e.clientY;
            this.originalDuration = (booking.endTime - booking.startTime) / (1000 * 60 * 60);
            bookingElement.style.cursor = 'ns-resize';
        } else {
            // Regular drag to move
            this.draggedBooking = booking;
            this.resizeMode = null;
            bookingElement.classList.add('dragging');
            bookingElement.style.cursor = 'move';

            // Show drop zones
            this.showDropZones();
        }
    }

    handleBookingMouseMove(e) {
        if (!this.draggedBooking) return;

        if (this.resizeMode) {
            this.handleBookingResize(e);
        } else {
            this.handleBookingDrag(e);
        }
    }

    handleBookingResize(e) {
        const deltaY = e.clientY - this.resizeStartY;
        const slotHeight = 40; // Height of each 30-minute slot
        const slotsChanged = Math.round(deltaY / slotHeight);

        if (slotsChanged === 0) return;

        const newDuration = Math.max(0.5, this.originalDuration + (slotsChanged * 0.5));

        if (this.resizeMode === 'bottom') {
            // Extend or shrink from the end
            const newEndTime = new Date(this.draggedBooking.startTime);
            newEndTime.setTime(newEndTime.getTime() + (newDuration * 60 * 60 * 1000));

            // Check for conflicts
            if (!this.hasConflictForResize(this.draggedBooking, this.draggedBooking.startTime, newEndTime)) {
                this.draggedBooking.endTime = newEndTime;
                this.updateBookingDisplay();
            }
        } else if (this.resizeMode === 'top') {
            // Extend or shrink from the start
            const newStartTime = new Date(this.draggedBooking.endTime);
            newStartTime.setTime(newStartTime.getTime() - (newDuration * 60 * 60 * 1000));

            // Check for conflicts
            if (!this.hasConflictForResize(this.draggedBooking, newStartTime, this.draggedBooking.endTime)) {
                this.draggedBooking.startTime = newStartTime;
                this.updateBookingDisplay();
            }
        }
    }

    handleBookingDrag(e) {
        // Highlight potential drop zones
        const elementUnder = document.elementFromPoint(e.clientX, e.clientY);
        const dropZone = elementUnder?.closest('.week-cell, .day-hour, .clickable-slot');

        // Clear previous highlights
        document.querySelectorAll('.drop-zone-active, .drop-zone-valid, .drop-zone-invalid').forEach(el => {
            el.classList.remove('drop-zone-active', 'drop-zone-valid', 'drop-zone-invalid');
        });

        if (dropZone && dropZone.dataset.date && dropZone.dataset.time) {
            const newDate = new Date(dropZone.dataset.date);
            const [hours, minutes] = dropZone.dataset.time.split(':');
            newDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

            const duration = (this.draggedBooking.endTime - this.draggedBooking.startTime) / (1000 * 60 * 60);
            const newEndTime = new Date(newDate.getTime() + (duration * 60 * 60 * 1000));

            // Check if the new time slot is valid
            if (this.hasConflictForMove(this.draggedBooking, newDate, newEndTime)) {
                dropZone.classList.add('drop-zone-invalid');
            } else {
                dropZone.classList.add('drop-zone-valid');
            }
            dropZone.classList.add('drop-zone-active');
        }
    }

    handleBookingMouseUp(e) {
        if (!this.draggedBooking) return;

        if (this.resizeMode) {
            // Finish resize
            this.saveBookings();
            this.renderCalendar();
            Utils.showToast('Booking duration updated', 'success');
        } else {
            // Finish drag - check for valid drop
            const elementUnder = document.elementFromPoint(e.clientX, e.clientY);
            const dropZone = elementUnder?.closest('.week-cell, .day-hour, .clickable-slot');

            if (dropZone && dropZone.dataset.date && dropZone.dataset.time) {
                const newDate = new Date(dropZone.dataset.date);
                const [hours, minutes] = dropZone.dataset.time.split(':');
                newDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

                const duration = (this.draggedBooking.endTime - this.draggedBooking.startTime) / (1000 * 60 * 60);
                const newEndTime = new Date(newDate.getTime() + (duration * 60 * 60 * 1000));

                if (!this.hasConflictForMove(this.draggedBooking, newDate, newEndTime)) {
                    // Update booking times
                    this.draggedBooking.startTime = newDate;
                    this.draggedBooking.endTime = newEndTime;

                    this.saveBookings();
                    this.renderCalendar();
                    Utils.showToast('Booking rescheduled successfully', 'success');
                } else {
                    Utils.showToast('Cannot reschedule - time slot conflicts', 'error');
                }
            }

            this.hideDropZones();
        }

        // Clean up
        document.querySelectorAll('.booking-preview, .booking-details, .booking-multi-slot').forEach(el => {
            el.classList.remove('dragging');
            el.style.cursor = '';
        });

        this.draggedBooking = null;
        this.resizeMode = null;
    }

    hasConflictForMove(currentBooking, newStartTime, newEndTime) {
        return this.bookings.some(booking => {
            if (booking.id === currentBooking.id) return false;
            if (booking.bayId !== currentBooking.bayId) return false;

            return (newStartTime < booking.endTime && newEndTime > booking.startTime);
        });
    }

    hasConflictForResize(currentBooking, newStartTime, newEndTime) {
        return this.bookings.some(booking => {
            if (booking.id === currentBooking.id) return false;
            if (booking.bayId !== currentBooking.bayId) return false;

            return (newStartTime < booking.endTime && newEndTime > booking.startTime);
        });
    }

    showDropZones() {
        // Add visual indicators for valid drop zones
        document.querySelectorAll('.week-cell, .day-hour').forEach(el => {
            if (!el.classList.contains('has-booking')) {
                el.style.border = '1px dashed #ccc';
            }
        });
    }

    hideDropZones() {
        // Remove drop zone indicators
        document.querySelectorAll('.drop-zone-active, .drop-zone-valid, .drop-zone-invalid').forEach(el => {
            el.classList.remove('drop-zone-active', 'drop-zone-valid', 'drop-zone-invalid');
            el.style.border = '';
        });
    }

    updateBookingDisplay() {
        // Re-render the current view to show updated booking
        this.renderCalendar();
    }
}

// Initialize calendar manager
document.addEventListener('DOMContentLoaded', () => {
    window.calendarManager = new CalendarManager();
});
