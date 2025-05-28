class EmployeeManagement {
    constructor() {
        this.employees = [];
        this.employeeSchedules = [];
        this.loadData();
        this.generateEmployees();
        this.setupEventListeners();
    }

    loadData() {
        this.employees = Utils.loadFromStorage('employees') || [];
        this.employeeSchedules = Utils.loadFromStorage('employeeSchedules') || [];
    }

    saveData() {
        Utils.saveToStorage('employees', this.employees);
        Utils.saveToStorage('employeeSchedules', this.employeeSchedules);
    }

    generateEmployees() {
        if (this.employees.length === 0) {
            this.employees = [
                {
                    id: 'EMP001',
                    name: 'John Smith',
                    role: 'Senior Technician',
                    specialties: ['Engine Repair', 'Transmission', 'Diagnostics'],
                    shift: 'Morning',
                    hourlyRate: 35,
                    status: 'available',
                    avatar: 'https://ui-avatars.com/api/?name=John+Smith&background=007bff&color=fff',
                    phone: '+1-555-0101',
                    email: 'john.smith@workshop.com',
                    experience: 8,
                    certifications: ['ASE Master', 'BMW Certified']
                },
                {
                    id: 'EMP002',
                    name: 'Maria Garcia',
                    role: 'Lead Mechanic',
                    specialties: ['Brake Systems', 'Suspension', 'Electrical'],
                    shift: 'Morning',
                    hourlyRate: 32,
                    status: 'available',
                    avatar: 'https://ui-avatars.com/api/?name=Maria+Garcia&background=28a745&color=fff',
                    phone: '+1-555-0102',
                    email: 'maria.garcia@workshop.com',
                    experience: 6,
                    certifications: ['ASE Certified', 'Honda Specialist']
                },
                {
                    id: 'EMP003',
                    name: 'David Johnson',
                    role: 'Technician',
                    specialties: ['Oil Change', 'Tire Service', 'Basic Maintenance'],
                    shift: 'Afternoon',
                    hourlyRate: 25,
                    status: 'available',
                    avatar: 'https://ui-avatars.com/api/?name=David+Johnson&background=ffc107&color=000',
                    phone: '+1-555-0103',
                    email: 'david.johnson@workshop.com',
                    experience: 3,
                    certifications: ['Basic ASE']
                },
                {
                    id: 'EMP004',
                    name: 'Sarah Wilson',
                    role: 'Diagnostic Specialist',
                    specialties: ['Computer Diagnostics', 'Engine Analysis', 'Emissions'],
                    shift: 'Morning',
                    hourlyRate: 38,
                    status: 'available',
                    avatar: 'https://ui-avatars.com/api/?name=Sarah+Wilson&background=dc3545&color=fff',
                    phone: '+1-555-0104',
                    email: 'sarah.wilson@workshop.com',
                    experience: 10,
                    certifications: ['ASE Master', 'Ford Certified', 'Emissions Specialist']
                },
                {
                    id: 'EMP005',
                    name: 'Mike Chen',
                    role: 'Apprentice',
                    specialties: ['General Assistance', 'Parts Handling', 'Basic Repairs'],
                    shift: 'Full Day',
                    hourlyRate: 18,
                    status: 'available',
                    avatar: 'https://ui-avatars.com/api/?name=Mike+Chen&background=6f42c1&color=fff',
                    phone: '+1-555-0105',
                    email: 'mike.chen@workshop.com',
                    experience: 1,
                    certifications: ['In Training']
                },
                {
                    id: 'EMP006',
                    name: 'Lisa Brown',
                    role: 'Senior Technician',
                    specialties: ['AC/Heating', 'Electrical Systems', 'Hybrid Vehicles'],
                    shift: 'Afternoon',
                    hourlyRate: 36,
                    status: 'available',
                    avatar: 'https://ui-avatars.com/api/?name=Lisa+Brown&background=17a2b8&color=fff',
                    phone: '+1-555-0106',
                    email: 'lisa.brown@workshop.com',
                    experience: 7,
                    certifications: ['ASE Master', 'Hybrid Specialist', 'AC Certified']
                },
                {
                    id: 'EMP007',
                    name: 'Robert Taylor',
                    role: 'Shop Foreman',
                    specialties: ['Quality Control', 'Team Management', 'Complex Repairs'],
                    shift: 'Morning',
                    hourlyRate: 42,
                    status: 'available',
                    avatar: 'https://ui-avatars.com/api/?name=Robert+Taylor&background=343a40&color=fff',
                    phone: '+1-555-0107',
                    email: 'robert.taylor@workshop.com',
                    experience: 15,
                    certifications: ['ASE Master', 'Management Certified', 'All Brands']
                },
                {
                    id: 'EMP008',
                    name: 'Jennifer Lee',
                    role: 'Technician',
                    specialties: ['Body Work', 'Paint Touch-up', 'Interior Repair'],
                    shift: 'Afternoon',
                    hourlyRate: 28,
                    status: 'available',
                    avatar: 'https://ui-avatars.com/api/?name=Jennifer+Lee&background=e83e8c&color=fff',
                    phone: '+1-555-0108',
                    email: 'jennifer.lee@workshop.com',
                    experience: 4,
                    certifications: ['Body Work Certified', 'Paint Specialist']
                }
            ];
            this.saveData();
        }
    }

    setupEventListeners() {
        // Employee management button
        document.addEventListener('click', (e) => {
            if (e.target.matches('#employeeManagementBtn')) {
                this.showEmployeeManagement();
            }
        });
    }

    showEmployeeManagement() {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-users me-2"></i>Employee Management
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-8">
                                <div class="card">
                                    <div class="card-header d-flex justify-content-between align-items-center">
                                        <h6 class="mb-0">Employee List</h6>
                                        <button class="btn btn-primary btn-sm" onclick="employeeManagement.addNewEmployee()">
                                            <i class="fas fa-plus me-2"></i>Add Employee
                                        </button>
                                    </div>
                                    <div class="card-body p-0">
                                        <div class="employee-grid">
                                            ${this.renderEmployeeGrid()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="card">
                                    <div class="card-header">
                                        <h6 class="mb-0">Quick Stats</h6>
                                    </div>
                                    <div class="card-body">
                                        ${this.renderEmployeeStats()}
                                    </div>
                                </div>
                                <div class="card mt-3">
                                    <div class="card-header">
                                        <h6 class="mb-0">Schedule Overview</h6>
                                    </div>
                                    <div class="card-body">
                                        <button class="btn btn-outline-primary btn-sm w-100 mb-2" onclick="employeeManagement.showScheduleCalendar()">
                                            <i class="fas fa-calendar me-2"></i>View Schedules
                                        </button>
                                        <button class="btn btn-outline-success btn-sm w-100" onclick="employeeManagement.showAssignmentManager()">
                                            <i class="fas fa-tasks me-2"></i>Manage Assignments
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    renderEmployeeGrid() {
        return this.employees.map(employee => {
            const statusClass = {
                'available': 'success',
                'busy': 'warning',
                'on_break': 'info',
                'off_duty': 'secondary'
            }[employee.status] || 'secondary';

            return `
                <div class="employee-card" data-employee-id="${employee.id}">
                    <div class="employee-avatar">
                        <img src="${employee.avatar}" alt="${employee.name}" class="avatar-img">
                        <span class="status-badge badge bg-${statusClass}"></span>
                    </div>
                    <div class="employee-info">
                        <h6 class="employee-name">${employee.name}</h6>
                        <p class="employee-role">${employee.role}</p>
                        <div class="employee-specialties">
                            ${employee.specialties.slice(0, 2).map(spec =>
                                `<span class="badge bg-light text-dark">${spec}</span>`
                            ).join('')}
                        </div>
                        <div class="employee-details">
                            <small class="text-muted">
                                <i class="fas fa-clock me-1"></i>${employee.shift} •
                                <i class="fas fa-dollar-sign me-1"></i>$${employee.hourlyRate}/hr
                            </small>
                        </div>
                    </div>
                    <div class="employee-actions">
                        <button class="btn btn-sm btn-outline-primary" onclick="employeeManagement.showEmployeeDetails('${employee.id}')" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-success" onclick="employeeManagement.showEmployeeSchedule('${employee.id}')" title="Schedule">
                            <i class="fas fa-calendar"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-warning" onclick="employeeManagement.assignToJob('${employee.id}')" title="Assign Job">
                            <i class="fas fa-tasks"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderEmployeeStats() {
        const available = this.employees.filter(e => e.status === 'available').length;
        const busy = this.employees.filter(e => e.status === 'busy').length;
        const onBreak = this.employees.filter(e => e.status === 'on_break').length;
        const avgExperience = Math.round(this.employees.reduce((sum, e) => sum + e.experience, 0) / this.employees.length);

        return `
            <div class="stat-item">
                <div class="stat-value text-success">${available}</div>
                <div class="stat-label">Available</div>
            </div>
            <div class="stat-item">
                <div class="stat-value text-warning">${busy}</div>
                <div class="stat-label">Busy</div>
            </div>
            <div class="stat-item">
                <div class="stat-value text-info">${onBreak}</div>
                <div class="stat-label">On Break</div>
            </div>
            <div class="stat-item">
                <div class="stat-value text-primary">${avgExperience} yrs</div>
                <div class="stat-label">Avg Experience</div>
            </div>
        `;
    }

    showEmployeeDetails(employeeId) {
        const employee = this.employees.find(e => e.id === employeeId);
        if (!employee) return;

        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-user me-2"></i>${employee.name}
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-4 text-center">
                                <img src="${employee.avatar}" alt="${employee.name}" class="img-fluid rounded-circle mb-3" style="width: 100px; height: 100px;">
                                <h6>${employee.role}</h6>
                                <span class="badge bg-${this.getStatusClass(employee.status)}">${employee.status.replace('_', ' ').toUpperCase()}</span>
                            </div>
                            <div class="col-md-8">
                                <div class="row mb-2">
                                    <div class="col-4"><strong>Employee ID:</strong></div>
                                    <div class="col-8">${employee.id}</div>
                                </div>
                                <div class="row mb-2">
                                    <div class="col-4"><strong>Phone:</strong></div>
                                    <div class="col-8">${employee.phone}</div>
                                </div>
                                <div class="row mb-2">
                                    <div class="col-4"><strong>Email:</strong></div>
                                    <div class="col-8">${employee.email}</div>
                                </div>
                                <div class="row mb-2">
                                    <div class="col-4"><strong>Experience:</strong></div>
                                    <div class="col-8">${employee.experience} years</div>
                                </div>
                                <div class="row mb-2">
                                    <div class="col-4"><strong>Hourly Rate:</strong></div>
                                    <div class="col-8">$${employee.hourlyRate}/hour</div>
                                </div>
                                <div class="row mb-2">
                                    <div class="col-4"><strong>Shift:</strong></div>
                                    <div class="col-8">${employee.shift}</div>
                                </div>
                            </div>
                        </div>
                        <hr>
                        <h6>Specialties</h6>
                        <div class="mb-3">
                            ${employee.specialties.map(spec => `<span class="badge bg-primary me-1">${spec}</span>`).join('')}
                        </div>
                        <h6>Certifications</h6>
                        <div class="mb-3">
                            ${employee.certifications.map(cert => `<span class="badge bg-success me-1">${cert}</span>`).join('')}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" onclick="employeeManagement.showEmployeeSchedule('${employee.id}')">
                            <i class="fas fa-calendar me-2"></i>View Schedule
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    showEmployeeSchedule(employeeId) {
        const employee = this.employees.find(e => e.id === employeeId);
        if (!employee) return;

        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-calendar me-2"></i>${employee.name}'s Schedule
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="schedule-calendar">
                            <div class="schedule-header">
                                <div>
                                    <h6 class="mb-0">${employee.name} - ${employee.role}</h6>
                                    <small>Shift: ${employee.shift} | Rate: $${employee.hourlyRate}/hr</small>
                                </div>
                                <div>
                                    <button class="btn btn-light btn-sm" onclick="employeeManagement.addScheduleEntry('${employee.id}')">
                                        <i class="fas fa-plus me-2"></i>Add Assignment
                                    </button>
                                </div>
                            </div>
                            <div class="schedule-content">
                                ${this.renderEmployeeScheduleGrid(employee)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });

        // Setup drag and drop for schedule
        this.setupScheduleDragDrop();
    }

    renderEmployeeScheduleGrid(employee) {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const hours = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

        let html = '<div class="schedule-grid">';

        // Header row
        html += '<div class="schedule-time-slot"></div>';
        days.forEach(day => {
            html += `<div class="schedule-day-header">${day}</div>`;
        });

        // Time slots
        hours.forEach(hour => {
            html += `<div class="schedule-time-slot">${hour}</div>`;
            days.forEach((_, dayIndex) => {
                const assignments = this.getEmployeeAssignments(employee.id, dayIndex, hour);
                const hasAssignment = assignments.length > 0;

                html += `
                    <div class="schedule-cell ${hasAssignment ? 'has-assignment' : ''}"
                         data-employee-id="${employee.id}"
                         data-day="${dayIndex}"
                         data-hour="${hour}">
                        ${assignments.map(assignment => `
                            <div class="assignment-block"
                                 title="${assignment.jobTitle}"
                                 draggable="true"
                                 data-assignment-id="${assignment.id}">
                                ${assignment.jobTitle}
                            </div>
                        `).join('')}
                    </div>
                `;
            });
        });

        html += '</div>';
        return html;
    }

    getEmployeeAssignments(employeeId, day, hour) {
        // Get assignments from storage or use sample data
        const assignments = Utils.loadFromStorage('employeeAssignments') || [
            { id: 'ASG001', employeeId: 'EMP001', day: 1, hour: '9:00', jobTitle: 'Engine Repair - Honda Civic', jobId: 'JOB001' },
            { id: 'ASG002', employeeId: 'EMP001', day: 1, hour: '10:00', jobTitle: 'Engine Repair - Honda Civic', jobId: 'JOB001' },
            { id: 'ASG003', employeeId: 'EMP002', day: 2, hour: '14:00', jobTitle: 'Brake Service - Toyota Camry', jobId: 'JOB002' },
            { id: 'ASG004', employeeId: 'EMP003', day: 0, hour: '8:00', jobTitle: 'Oil Change - Ford F150', jobId: 'JOB003' }
        ];

        return assignments.filter(a =>
            a.employeeId === employeeId && a.day === day && a.hour === hour
        );
    }

    saveEmployeeAssignments(assignments) {
        Utils.saveToStorage('employeeAssignments', assignments);
    }

    setupScheduleDragDrop() {
        // Remove any existing listeners to prevent duplicates
        this.removeDragListeners();

        // Setup drag and drop for assignment blocks
        this.dragStartHandler = (e) => {
            if (e.target.classList.contains('assignment-block')) {
                console.log('Drag started:', e.target.dataset.assignmentId);
                this.draggedAssignment = {
                    id: e.target.dataset.assignmentId,
                    element: e.target,
                    originalParent: e.target.parentElement
                };
                e.target.style.opacity = '0.5';
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/html', e.target.outerHTML);
            }
        };

        this.dragEndHandler = (e) => {
            if (e.target.classList.contains('assignment-block')) {
                console.log('Drag ended');
                e.target.style.opacity = '1';
                // Clean up all drag-over classes
                document.querySelectorAll('.schedule-cell.drag-over').forEach(cell => {
                    cell.classList.remove('drag-over');
                });
                this.draggedAssignment = null;
            }
        };

        this.dragOverHandler = (e) => {
            const scheduleCell = e.target.closest('.schedule-cell');
            if (scheduleCell && this.draggedAssignment) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';

                // Remove drag-over from all cells first
                document.querySelectorAll('.schedule-cell.drag-over').forEach(cell => {
                    cell.classList.remove('drag-over');
                });

                // Add to current cell
                scheduleCell.classList.add('drag-over');
                console.log('Drag over cell:', scheduleCell.dataset.day, scheduleCell.dataset.hour);
            }
        };

        this.dragLeaveHandler = (e) => {
            const scheduleCell = e.target.closest('.schedule-cell');
            if (scheduleCell) {
                // Only remove if we're actually leaving the cell
                if (!scheduleCell.contains(e.relatedTarget)) {
                    scheduleCell.classList.remove('drag-over');
                }
            }
        };

        this.dropHandler = (e) => {
            const scheduleCell = e.target.closest('.schedule-cell');
            if (scheduleCell && this.draggedAssignment) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Drop on cell:', scheduleCell.dataset.day, scheduleCell.dataset.hour);

                scheduleCell.classList.remove('drag-over');
                this.handleAssignmentDrop(scheduleCell);
            }
        };

        // Add event listeners
        document.addEventListener('dragstart', this.dragStartHandler);
        document.addEventListener('dragend', this.dragEndHandler);
        document.addEventListener('dragover', this.dragOverHandler);
        document.addEventListener('dragleave', this.dragLeaveHandler);
        document.addEventListener('drop', this.dropHandler);
    }

    removeDragListeners() {
        if (this.dragStartHandler) {
            document.removeEventListener('dragstart', this.dragStartHandler);
            document.removeEventListener('dragend', this.dragEndHandler);
            document.removeEventListener('dragover', this.dragOverHandler);
            document.removeEventListener('dragleave', this.dragLeaveHandler);
            document.removeEventListener('drop', this.dropHandler);
        }
    }

    handleAssignmentDrop(targetCell) {
        if (!this.draggedAssignment) {
            console.log('No dragged assignment found');
            return;
        }

        const employeeId = targetCell.dataset.employeeId;
        const day = parseInt(targetCell.dataset.day);
        const hour = targetCell.dataset.hour;

        console.log('Dropping assignment:', this.draggedAssignment.id, 'to:', employeeId, day, hour);

        // Get all assignments
        const allAssignments = Utils.loadFromStorage('employeeAssignments') || [];

        // Find and update the dragged assignment
        const assignmentIndex = allAssignments.findIndex(a => a.id === this.draggedAssignment.id);
        if (assignmentIndex !== -1) {
            console.log('Found assignment to update:', allAssignments[assignmentIndex]);

            // Update the assignment
            allAssignments[assignmentIndex].employeeId = employeeId;
            allAssignments[assignmentIndex].day = day;
            allAssignments[assignmentIndex].hour = hour;

            this.saveEmployeeAssignments(allAssignments);

            // Refresh the schedule display
            this.refreshScheduleDisplay();

            Utils.showToast(`Assignment moved to ${this.getDayName(day)} at ${hour}`, 'success');
        } else {
            console.log('Assignment not found in storage');
            Utils.showToast('Error: Assignment not found', 'error');
        }
    }

    getDayName(dayIndex) {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        return days[dayIndex] || 'Unknown';
    }

    refreshScheduleDisplay() {
        // Find the schedule content and refresh it
        const scheduleContent = document.querySelector('.schedule-content');
        if (scheduleContent) {
            const employeeId = document.querySelector('.schedule-cell').dataset.employeeId;
            const employee = this.employees.find(e => e.id === employeeId);
            if (employee) {
                scheduleContent.innerHTML = this.renderEmployeeScheduleGrid(employee);
            }
        }
    }

    addScheduleEntry(employeeId) {
        const employee = this.employees.find(e => e.id === employeeId);
        if (!employee) return;

        // Get available jobs from bay management
        const availableJobs = window.bayManagement ? window.bayManagement.jobs.filter(j => j.status === 'pending') : [];

        if (availableJobs.length === 0) {
            Utils.showToast('No available jobs to assign', 'warning');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-plus me-2"></i>Add Assignment for ${employee.name}
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="addAssignmentForm">
                            <div class="mb-3">
                                <label class="form-label">Select Job</label>
                                <select class="form-select" id="jobSelect" required>
                                    <option value="">Choose a job...</option>
                                    ${availableJobs.map(job => `
                                        <option value="${job.id}" data-skills="${job.requiredSkills ? job.requiredSkills.join(',') : ''}">
                                            ${job.vehicle} - ${job.customer} (${job.service})
                                        </option>
                                    `).join('')}
                                </select>
                                <small class="text-muted">Employee skills: ${employee.specialties.join(', ')}</small>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <label class="form-label">Date</label>
                                    <input type="date" class="form-control" id="dateSelect" required>
                                    <small class="text-muted">Select the assignment date</small>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Start Time</label>
                                    <input type="time" class="form-control" id="timeSelect" required min="08:00" max="17:00" step="3600">
                                    <small class="text-muted">Working hours: 8:00 AM - 5:00 PM</small>
                                </div>
                            </div>
                            <div class="mt-3">
                                <label class="form-label">Duration (hours)</label>
                                <input type="number" class="form-control" id="durationSelect" required min="0.5" max="8" step="0.5" value="1">
                                <small class="text-muted">Enter duration in hours (0.5 to 8 hours)</small>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="employeeManagement.saveAssignment('${employeeId}')">
                            <i class="fas fa-save me-2"></i>Add Assignment
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        // Set default values
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        document.getElementById('dateSelect').value = tomorrow.toISOString().split('T')[0];
        document.getElementById('timeSelect').value = '09:00';

        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    saveAssignment(employeeId) {
        const jobId = document.getElementById('jobSelect').value;
        const selectedDate = document.getElementById('dateSelect').value;
        const startTime = document.getElementById('timeSelect').value;
        const duration = parseFloat(document.getElementById('durationSelect').value);

        if (!jobId || !selectedDate || !startTime || !duration) {
            Utils.showToast('Please fill in all fields', 'warning');
            return;
        }

        // Convert date to day of week (0 = Monday, 6 = Sunday)
        const date = new Date(selectedDate);
        const day = (date.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0 format

        // Get the selected job details
        const job = window.bayManagement ? window.bayManagement.jobs.find(j => j.id === jobId) : null;
        if (!job) {
            Utils.showToast('Selected job not found', 'error');
            return;
        }

        // Get existing assignments
        const allAssignments = Utils.loadFromStorage('employeeAssignments') || [];

        // Create assignments for the duration (supporting half-hour increments)
        const [startHour] = startTime.split(':').map(Number);
        const totalMinutes = duration * 60;
        const slots = Math.ceil(totalMinutes / 60); // Number of hour slots needed

        for (let i = 0; i < slots; i++) {
            const currentHour = startHour + i;
            if (currentHour >= 8 && currentHour <= 17) { // Within working hours
                const hour = `${currentHour}:00`;
                const assignment = {
                    id: Utils.generateId(),
                    employeeId: employeeId,
                    day: day,
                    hour: hour,
                    jobId: jobId,
                    jobTitle: `${job.service} - ${job.vehicle}`,
                    date: selectedDate,
                    startTime: startTime,
                    duration: duration
                };
                allAssignments.push(assignment);
            }
        }

        this.saveEmployeeAssignments(allAssignments);

        // Close modal
        const modal = document.querySelector('.modal.show');
        if (modal) {
            bootstrap.Modal.getInstance(modal).hide();
        }

        // Refresh schedule display
        this.refreshScheduleDisplay();

        Utils.showToast(`Assignment added: ${duration} hour(s) starting at ${startTime}`, 'success');
    }

    showAssignmentManager() {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-tasks me-2"></i>Job Assignment Manager
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="assignment-manager">
                            <div class="available-employees">
                                <div class="assignment-header">
                                    <i class="fas fa-users me-2"></i>Available Employees (<span id="employeeCount">${this.employees.filter(e => e.status === 'available').length}</span>)
                                </div>
                                <div class="search-container mb-3">
                                    <div class="input-group input-group-sm">
                                        <span class="input-group-text">
                                            <i class="fas fa-search"></i>
                                        </span>
                                        <input type="text" class="form-control" id="employeeSearch" placeholder="Search employees by name, role, or specialty...">
                                        <button class="btn btn-outline-secondary" type="button" id="clearEmployeeSearch">
                                            <i class="fas fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="assignment-content" id="employeeList">
                                    ${this.renderAvailableEmployees()}
                                </div>
                            </div>
                            <div class="job-assignments">
                                <div class="assignment-header">
                                    <i class="fas fa-clipboard-list me-2"></i>Job Assignments (<span id="jobCount">${this.getJobCount()}</span>)
                                </div>
                                <div class="search-container mb-3">
                                    <div class="input-group input-group-sm">
                                        <span class="input-group-text">
                                            <i class="fas fa-search"></i>
                                        </span>
                                        <input type="text" class="form-control" id="jobSearch" placeholder="Search jobs by vehicle, customer, or service...">
                                        <button class="btn btn-outline-secondary" type="button" id="clearJobSearch">
                                            <i class="fas fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="assignment-content" id="jobList">
                                    ${this.renderJobAssignments()}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-success" onclick="employeeManagement.showBayAssignmentManager()">
                            <i class="fas fa-warehouse me-2"></i>Assign to Bays
                        </button>
                        <button type="button" class="btn btn-warning" onclick="employeeManagement.resetEmployeeStatuses()">
                            <i class="fas fa-refresh me-2"></i>Reset All Statuses
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });

        // Setup search functionality
        this.setupAssignmentManagerSearch();

        // Setup drag and drop for job assignment manager
        this.setupJobAssignmentDragDrop();
    }

    getJobCount() {
        const jobs = window.bayManagement ? window.bayManagement.jobs : [];
        return jobs.length;
    }

    setupAssignmentManagerSearch() {
        // Employee search functionality
        const employeeSearch = document.getElementById('employeeSearch');
        const clearEmployeeSearch = document.getElementById('clearEmployeeSearch');
        const jobSearch = document.getElementById('jobSearch');
        const clearJobSearch = document.getElementById('clearJobSearch');

        if (employeeSearch) {
            employeeSearch.addEventListener('input', (e) => {
                this.filterEmployees(e.target.value);
            });
        }

        if (clearEmployeeSearch) {
            clearEmployeeSearch.addEventListener('click', () => {
                employeeSearch.value = '';
                this.filterEmployees('');
            });
        }

        if (jobSearch) {
            jobSearch.addEventListener('input', (e) => {
                this.filterJobs(e.target.value);
            });
        }

        if (clearJobSearch) {
            clearJobSearch.addEventListener('click', () => {
                jobSearch.value = '';
                this.filterJobs('');
            });
        }
    }

    filterEmployees(searchTerm) {
        const employeeList = document.getElementById('employeeList');
        const employeeCount = document.getElementById('employeeCount');

        if (!employeeList || !employeeCount) return;

        const filteredEmployees = this.employees.filter(e => e.status === 'available').filter(employee => {
            if (!searchTerm) return true;

            const term = searchTerm.toLowerCase();
            return employee.name.toLowerCase().includes(term) ||
                   employee.role.toLowerCase().includes(term) ||
                   employee.specialties.some(spec => spec.toLowerCase().includes(term));
        });

        employeeList.innerHTML = filteredEmployees.map(employee => `
            <div class="employee-assignment-card" draggable="true" data-employee-id="${employee.id}">
                <div class="d-flex align-items-center">
                    <img src="${employee.avatar}" alt="${employee.name}" class="rounded-circle me-3" style="width: 40px; height: 40px;">
                    <div>
                        <h6 class="mb-1">${employee.name}</h6>
                        <small class="text-muted">${employee.role}</small>
                        <div class="mt-1">
                            ${employee.specialties.slice(0, 2).map(spec =>
                                `<span class="badge bg-light text-dark me-1" style="font-size: 0.6rem;">${spec}</span>`
                            ).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        employeeCount.textContent = filteredEmployees.length;

        // Re-setup drag and drop after filtering
        this.setupJobAssignmentDragDrop();
    }

    filterJobs(searchTerm) {
        const jobList = document.getElementById('jobList');
        const jobCount = document.getElementById('jobCount');

        if (!jobList || !jobCount) return;

        const jobs = window.bayManagement ? window.bayManagement.jobs : [];
        const filteredJobs = jobs.filter(job => {
            if (!searchTerm) return true;

            const term = searchTerm.toLowerCase();
            return job.vehicle.toLowerCase().includes(term) ||
                   job.customer.toLowerCase().includes(term) ||
                   job.service.toLowerCase().includes(term) ||
                   job.priority.toLowerCase().includes(term);
        });

        jobList.innerHTML = filteredJobs.map(job => {
            // Support both old single employee format and new multiple employees format
            let assignedEmployees = [];

            if (job.assignedEmployees && Array.isArray(job.assignedEmployees)) {
                // New format: multiple employees
                assignedEmployees = job.assignedEmployees.map(empId =>
                    this.employees.find(e => e.id === empId)
                ).filter(emp => emp); // Remove any null/undefined employees
            } else if (job.assignedEmployee) {
                // Old format: single employee - convert to array
                const singleEmployee = this.employees.find(e => e.id === job.assignedEmployee);
                if (singleEmployee) {
                    assignedEmployees = [singleEmployee];
                }
            }

            const hasAssignments = assignedEmployees.length > 0;

            return `
                <div class="job-assignment-slot" data-job-id="${job.id}">
                    <div class="text-center">
                        <h6>${job.vehicle}</h6>
                        <p class="mb-1">${job.customer}</p>
                        <small class="text-muted">${job.service}</small>
                        <div class="mt-2">
                            <span class="badge bg-info">${job.priority}</span>
                            ${assignedEmployees.length > 1 ? `<span class="badge bg-success ms-1">${assignedEmployees.length} employees</span>` : ''}
                        </div>
                        <div class="assigned-employees mt-2" style="min-height: 40px; border: 2px ${hasAssignments ? 'solid #28a745' : 'dashed #dee2e6'}; border-radius: 4px; padding: 5px; background: ${hasAssignments ? '#d4edda' : 'transparent'};">
                            ${hasAssignments ? `
                                <div class="employee-list">
                                    ${assignedEmployees.map(employee => `
                                        <div class="assigned-employee-item d-flex align-items-center justify-content-between mb-1" style="background: rgba(255,255,255,0.7); border-radius: 3px; padding: 2px 5px;">
                                            <div class="d-flex align-items-center">
                                                <img src="${employee.avatar}" alt="${employee.name}" class="rounded-circle me-2" style="width: 20px; height: 20px;">
                                                <div>
                                                    <div class="fw-bold" style="font-size: 0.7rem;">${employee.name}</div>
                                                    <small class="text-muted" style="font-size: 0.6rem;">${employee.role}</small>
                                                </div>
                                            </div>
                                            <button class="btn btn-sm btn-outline-danger" onclick="employeeManagement.unassignSpecificEmployee('${job.id}', '${employee.id}')" title="Remove ${employee.name}">
                                                <i class="fas fa-times" style="font-size: 0.6rem;"></i>
                                            </button>
                                        </div>
                                    `).join('')}
                                    <div class="add-more-employees mt-1" style="border-top: 1px dashed #28a745; padding-top: 3px;">
                                        <small class="text-muted">Drop more employees here</small>
                                    </div>
                                </div>
                            ` : `
                                <small class="text-muted">Drop employee here</small>
                            `}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        jobCount.textContent = filteredJobs.length;

        // Re-setup drag and drop after filtering
        this.setupJobAssignmentDragDrop();
    }

    renderAvailableEmployees() {
        return this.employees.filter(e => e.status === 'available').map(employee => `
            <div class="employee-assignment-card" draggable="true" data-employee-id="${employee.id}">
                <div class="d-flex align-items-center">
                    <img src="${employee.avatar}" alt="${employee.name}" class="rounded-circle me-3" style="width: 40px; height: 40px;">
                    <div>
                        <h6 class="mb-1">${employee.name}</h6>
                        <small class="text-muted">${employee.role}</small>
                        <div class="mt-1">
                            ${employee.specialties.slice(0, 2).map(spec =>
                                `<span class="badge bg-light text-dark me-1" style="font-size: 0.6rem;">${spec}</span>`
                            ).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderJobAssignments() {
        // Get current jobs from bay management
        const jobs = window.bayManagement ? window.bayManagement.jobs : [];

        return jobs.map(job => {
            // Support both old single employee format and new multiple employees format
            let assignedEmployees = [];

            if (job.assignedEmployees && Array.isArray(job.assignedEmployees)) {
                // New format: multiple employees
                assignedEmployees = job.assignedEmployees.map(empId =>
                    this.employees.find(e => e.id === empId)
                ).filter(emp => emp); // Remove any null/undefined employees
            } else if (job.assignedEmployee) {
                // Old format: single employee - convert to array
                const singleEmployee = this.employees.find(e => e.id === job.assignedEmployee);
                if (singleEmployee) {
                    assignedEmployees = [singleEmployee];
                }
            }

            const hasAssignments = assignedEmployees.length > 0;

            return `
                <div class="job-assignment-slot" data-job-id="${job.id}">
                    <div class="text-center">
                        <h6>${job.vehicle}</h6>
                        <p class="mb-1">${job.customer}</p>
                        <small class="text-muted">${job.service}</small>
                        <div class="mt-2">
                            <span class="badge bg-info">${job.priority}</span>
                            ${assignedEmployees.length > 1 ? `<span class="badge bg-success ms-1">${assignedEmployees.length} employees</span>` : ''}
                        </div>
                        <div class="assigned-employees mt-2" style="min-height: 40px; border: 2px ${hasAssignments ? 'solid #28a745' : 'dashed #dee2e6'}; border-radius: 4px; padding: 5px; background: ${hasAssignments ? '#d4edda' : 'transparent'};">
                            ${hasAssignments ? `
                                <div class="employee-list">
                                    ${assignedEmployees.map(employee => `
                                        <div class="assigned-employee-item d-flex align-items-center justify-content-between mb-1" style="background: rgba(255,255,255,0.7); border-radius: 3px; padding: 2px 5px;">
                                            <div class="d-flex align-items-center">
                                                <img src="${employee.avatar}" alt="${employee.name}" class="rounded-circle me-2" style="width: 20px; height: 20px;">
                                                <div>
                                                    <div class="fw-bold" style="font-size: 0.7rem;">${employee.name}</div>
                                                    <small class="text-muted" style="font-size: 0.6rem;">${employee.role}</small>
                                                </div>
                                            </div>
                                            <button class="btn btn-sm btn-outline-danger" onclick="employeeManagement.unassignSpecificEmployee('${job.id}', '${employee.id}')" title="Remove ${employee.name}">
                                                <i class="fas fa-times" style="font-size: 0.6rem;"></i>
                                            </button>
                                        </div>
                                    `).join('')}
                                    <div class="add-more-employees mt-1" style="border-top: 1px dashed #28a745; padding-top: 3px;">
                                        <small class="text-muted">Drop more employees here</small>
                                    </div>
                                </div>
                            ` : `
                                <small class="text-muted">Drop employee here</small>
                            `}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    setupJobAssignmentDragDrop() {
        // Remove existing listeners
        this.removeJobAssignmentListeners();

        // Drag start for employees
        this.jobDragStartHandler = (e) => {
            if (e.target.classList.contains('employee-assignment-card')) {
                console.log('Employee drag started:', e.target.dataset.employeeId);
                this.draggedEmployee = {
                    id: e.target.dataset.employeeId,
                    element: e.target
                };
                e.target.style.opacity = '0.5';
                e.dataTransfer.effectAllowed = 'move';
            }
        };

        // Drag end for employees
        this.jobDragEndHandler = (e) => {
            if (e.target.classList.contains('employee-assignment-card')) {
                console.log('Employee drag ended');
                e.target.style.opacity = '1';
                // Clean up all drag-over classes
                document.querySelectorAll('.job-assignment-slot.drag-over').forEach(slot => {
                    slot.classList.remove('drag-over');
                });
                this.draggedEmployee = null;
            }
        };

        // Drag over job slots
        this.jobDragOverHandler = (e) => {
            const jobSlot = e.target.closest('.job-assignment-slot');
            if (jobSlot && this.draggedEmployee) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';

                // Remove drag-over from all slots first
                document.querySelectorAll('.job-assignment-slot.drag-over').forEach(slot => {
                    slot.classList.remove('drag-over');
                });

                // Add to current slot
                jobSlot.classList.add('drag-over');
                console.log('Drag over job:', jobSlot.dataset.jobId);
            }
        };

        // Drag leave job slots
        this.jobDragLeaveHandler = (e) => {
            const jobSlot = e.target.closest('.job-assignment-slot');
            if (jobSlot) {
                if (!jobSlot.contains(e.relatedTarget)) {
                    jobSlot.classList.remove('drag-over');
                }
            }
        };

        // Drop on job slots
        this.jobDropHandler = (e) => {
            const jobSlot = e.target.closest('.job-assignment-slot');
            if (jobSlot && this.draggedEmployee) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Drop employee on job:', this.draggedEmployee.id, jobSlot.dataset.jobId);

                jobSlot.classList.remove('drag-over');
                this.handleEmployeeJobAssignment(this.draggedEmployee.id, jobSlot.dataset.jobId);
            }
        };

        // Add event listeners
        document.addEventListener('dragstart', this.jobDragStartHandler);
        document.addEventListener('dragend', this.jobDragEndHandler);
        document.addEventListener('dragover', this.jobDragOverHandler);
        document.addEventListener('dragleave', this.jobDragLeaveHandler);
        document.addEventListener('drop', this.jobDropHandler);
    }

    removeJobAssignmentListeners() {
        if (this.jobDragStartHandler) {
            document.removeEventListener('dragstart', this.jobDragStartHandler);
            document.removeEventListener('dragend', this.jobDragEndHandler);
            document.removeEventListener('dragover', this.jobDragOverHandler);
            document.removeEventListener('dragleave', this.jobDragLeaveHandler);
            document.removeEventListener('drop', this.jobDropHandler);
        }
    }

    handleEmployeeJobAssignment(employeeId, jobId) {
        if (!employeeId || !jobId) {
            console.log('Missing employee or job ID');
            return;
        }

        // Get employee and job details
        const employee = this.employees.find(e => e.id === employeeId);
        const job = window.bayManagement ? window.bayManagement.jobs.find(j => j.id === jobId) : null;

        if (!employee || !job) {
            Utils.showToast('Employee or job not found', 'error');
            return;
        }

        // Check if employee is already assigned to this job
        if (job.assignedEmployees && job.assignedEmployees.includes(employeeId)) {
            Utils.showToast(`${employee.name} is already assigned to this job`, 'warning');
            return;
        }

        // Initialize assignedEmployees array if it doesn't exist
        if (!job.assignedEmployees) {
            job.assignedEmployees = [];

            // Migrate old single employee assignment to new format
            if (job.assignedEmployee) {
                job.assignedEmployees.push(job.assignedEmployee);
                delete job.assignedEmployee;
                delete job.assignedEmployeeName;
            }
        }

        // Add employee to job assignment
        job.assignedEmployees.push(employeeId);
        job.status = 'assigned';

        // Update employee status
        employee.status = 'busy';
        employee.currentJob = jobId;

        // Save data
        Utils.saveToStorage('employees', this.employees);
        if (window.bayManagement) {
            window.bayManagement.saveData();
            window.bayManagement.updateStatusCards();
        }

        // Refresh the assignment manager display
        this.refreshAssignmentManager();

        const assignedCount = job.assignedEmployees.length;
        Utils.showToast(`${employee.name} assigned to ${job.vehicle} (${assignedCount} employee${assignedCount > 1 ? 's' : ''} total)`, 'success');
    }

    unassignEmployee(jobId) {
        if (!jobId) return;

        // Get the job
        const job = window.bayManagement ? window.bayManagement.jobs.find(j => j.id === jobId) : null;
        if (!job) return;

        // Handle both old and new format
        let employeesToUnassign = [];

        if (job.assignedEmployees && Array.isArray(job.assignedEmployees)) {
            // New format: multiple employees
            employeesToUnassign = [...job.assignedEmployees];
            job.assignedEmployees = [];
        } else if (job.assignedEmployee) {
            // Old format: single employee
            employeesToUnassign = [job.assignedEmployee];
            delete job.assignedEmployee;
            delete job.assignedEmployeeName;
        }

        if (employeesToUnassign.length === 0) return;

        // Clear job status
        job.status = 'pending';

        // Clear employee assignments
        employeesToUnassign.forEach(empId => {
            const employee = this.employees.find(e => e.id === empId);
            if (employee) {
                employee.status = 'available';
                delete employee.currentJob;
            }
        });

        // Save data
        Utils.saveToStorage('employees', this.employees);
        if (window.bayManagement) {
            window.bayManagement.saveData();
            window.bayManagement.updateStatusCards();
        }

        // Refresh the assignment manager display
        this.refreshAssignmentManager();

        Utils.showToast(`All employees unassigned from ${job.vehicle}`, 'success');
    }

    unassignSpecificEmployee(jobId, employeeId) {
        if (!jobId || !employeeId) return;

        // Get the job and employee
        const job = window.bayManagement ? window.bayManagement.jobs.find(j => j.id === jobId) : null;
        const employee = this.employees.find(e => e.id === employeeId);

        if (!job || !employee) return;

        // Handle both old and new format
        if (job.assignedEmployees && Array.isArray(job.assignedEmployees)) {
            // New format: remove from array
            job.assignedEmployees = job.assignedEmployees.filter(id => id !== employeeId);

            // If no employees left, set job to pending
            if (job.assignedEmployees.length === 0) {
                job.status = 'pending';
            }
        } else if (job.assignedEmployee === employeeId) {
            // Old format: clear single assignment
            delete job.assignedEmployee;
            delete job.assignedEmployeeName;
            job.status = 'pending';
        }

        // Clear employee assignment
        employee.status = 'available';
        delete employee.currentJob;

        // Save data
        Utils.saveToStorage('employees', this.employees);
        if (window.bayManagement) {
            window.bayManagement.saveData();
            window.bayManagement.updateStatusCards();
        }

        // Refresh the assignment manager display
        this.refreshAssignmentManager();

        const remainingCount = job.assignedEmployees ? job.assignedEmployees.length : 0;
        Utils.showToast(`${employee.name} removed from ${job.vehicle} (${remainingCount} employee${remainingCount !== 1 ? 's' : ''} remaining)`, 'success');
    }

    showJobAssignment(jobId) {
        // Find the job
        const job = window.bayManagement ? window.bayManagement.jobs.find(j => j.id === jobId) : null;

        // For active jobs in bays, find the bay with this job
        let bay = null;
        if (window.bayManagement) {
            bay = window.bayManagement.bays.find(b => b.currentJob && b.currentJob.id === jobId);
        }

        if (!job && !bay) {
            Utils.showToast('Job not found', 'error');
            return;
        }

        // Use job from bay if available, otherwise use the job from jobs list
        const targetJob = bay ? bay.currentJob : job;

        // Get available employees (not currently busy)
        const availableEmployees = this.employees.filter(emp => emp.status === 'available');

        // Get currently assigned employees
        const assignedEmployees = targetJob.assignedEmployees ?
            targetJob.assignedEmployees.map(empId => this.employees.find(e => e.id === empId)).filter(emp => emp) : [];

        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-users me-2"></i>Manage Employee Assignment
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <!-- Job Details -->
                        <div class="job-assignment-header mb-4">
                            <div class="card bg-light">
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-8">
                                            <h6 class="card-title mb-2">
                                                <i class="fas fa-car me-2"></i>${targetJob.vehicle}
                                            </h6>
                                            <div class="job-details-grid">
                                                <div><strong>Customer:</strong> ${targetJob.customer}</div>
                                                <div><strong>Service:</strong> ${targetJob.service}</div>
                                                <div><strong>Priority:</strong>
                                                    <span class="badge bg-${targetJob.priority === 'high' ? 'danger' : targetJob.priority === 'medium' ? 'warning' : 'secondary'}">${targetJob.priority}</span>
                                                </div>
                                                ${bay ? `<div><strong>Bay:</strong> ${bay.id}</div>` : ''}
                                            </div>
                                        </div>
                                        <div class="col-md-4 text-end">
                                            ${targetJob.progress ? `
                                                <div class="progress mb-2" style="height: 8px;">
                                                    <div class="progress-bar bg-success" style="width: ${targetJob.progress}%"></div>
                                                </div>
                                                <small class="text-muted">${targetJob.progress}% Complete</small>
                                            ` : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <!-- Currently Assigned Employees -->
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-header">
                                        <h6 class="mb-0">
                                            <i class="fas fa-user-check me-2"></i>Assigned Employees (${assignedEmployees.length})
                                        </h6>
                                    </div>
                                    <div class="card-body employee-drop-zone" data-zone="assigned" style="max-height: 300px; overflow-y: auto; min-height: 200px;">
                                        <div id="assignedEmployeesList">
                                            ${assignedEmployees.length > 0 ? assignedEmployees.map(emp => `
                                                <div class="assigned-employee-item mb-2" draggable="true" data-employee-id="${emp.id}" data-current-zone="assigned">
                                                    <div class="d-flex align-items-center">
                                                        <div class="drag-handle me-2">
                                                            <i class="fas fa-grip-vertical text-muted"></i>
                                                        </div>
                                                        <img src="${emp.avatar}" alt="${emp.name}" class="rounded-circle me-3" style="width: 40px; height: 40px;">
                                                        <div class="flex-grow-1">
                                                            <div class="fw-bold">${emp.name}</div>
                                                            <small class="text-muted">${emp.role}</small>
                                                            <div class="mt-1">
                                                                ${emp.specialties.slice(0, 2).map(spec =>
                                                                    `<span class="badge bg-light text-dark me-1" style="font-size: 0.6rem;">${spec}</span>`
                                                                ).join('')}
                                                            </div>
                                                        </div>
                                                        <button class="btn btn-sm btn-outline-danger" onclick="employeeManagement.removeEmployeeFromPendingAssignment('${emp.id}')">
                                                            <i class="fas fa-times"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            `) : ''}
                                            ${assignedEmployees.length === 0 ? '<div class="empty-zone-message text-muted text-center py-4"><i class="fas fa-users me-2"></i>Drag employees here to assign them</div>' : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Available Employees -->
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-header">
                                        <h6 class="mb-0">
                                            <i class="fas fa-user-plus me-2"></i>Available Employees (${availableEmployees.length})
                                        </h6>
                                    </div>
                                    <div class="card-body employee-drop-zone" data-zone="available" style="max-height: 300px; overflow-y: auto; min-height: 200px;">
                                        <div id="availableEmployeesList">
                                            ${availableEmployees.length > 0 ? availableEmployees.map(emp => `
                                                <div class="available-employee-item mb-2" draggable="true" data-employee-id="${emp.id}" data-current-zone="available">
                                                    <div class="d-flex align-items-center">
                                                        <div class="drag-handle me-2">
                                                            <i class="fas fa-grip-vertical text-muted"></i>
                                                        </div>
                                                        <img src="${emp.avatar}" alt="${emp.name}" class="rounded-circle me-3" style="width: 40px; height: 40px;">
                                                        <div class="flex-grow-1">
                                                            <div class="fw-bold">${emp.name}</div>
                                                            <small class="text-muted">${emp.role}</small>
                                                            <div class="mt-1">
                                                                ${emp.specialties.slice(0, 2).map(spec =>
                                                                    `<span class="badge bg-light text-dark me-1" style="font-size: 0.6rem;">${spec}</span>`
                                                                ).join('')}
                                                            </div>
                                                        </div>
                                                        <button class="btn btn-sm btn-outline-primary" onclick="employeeManagement.addEmployeeToPendingAssignment('${emp.id}')">
                                                            <i class="fas fa-plus"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            `) : ''}
                                            ${availableEmployees.length === 0 ? '<div class="empty-zone-message text-muted text-center py-4"><i class="fas fa-user-slash me-2"></i>No available employees</div>' : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Service Requirements -->
                        ${targetJob.service ? `
                            <div class="mt-3">
                                <div class="alert alert-info">
                                    <i class="fas fa-info-circle me-2"></i>
                                    <strong>Service Requirements:</strong> ${targetJob.service}
                                    ${this.getServiceSkillRequirements(targetJob.service) ?
                                        `<br><small>Recommended skills: ${this.getServiceSkillRequirements(targetJob.service).join(', ')}</small>` : ''}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                    <div class="modal-footer">
                        <div class="me-auto">
                            <small class="text-muted">
                                <i class="fas fa-info-circle me-1"></i>
                                Drag employees between columns or use +/- buttons. Click Save to apply changes.
                            </small>
                        </div>
                        <button type="button" class="btn btn-secondary" onclick="employeeManagement.cancelJobAssignmentChanges('${targetJob.id}', '${bay ? bay.id : ''}')">
                            <i class="fas fa-times me-2"></i>Cancel
                        </button>
                        <button type="button" class="btn btn-success" onclick="employeeManagement.saveJobAssignmentChanges('${targetJob.id}', '${bay ? bay.id : ''}')">
                            <i class="fas fa-save me-2"></i>Save Changes
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        // Initialize pending changes tracking
        this.pendingAssignmentChanges = {
            jobId: targetJob.id,
            bayId: bay ? bay.id : '',
            originalAssigned: [...(targetJob.assignedEmployees || [])],
            currentAssigned: [...(targetJob.assignedEmployees || [])]
        };

        // Setup drag and drop for employee assignment
        this.setupEmployeeAssignmentDragDrop();

        modal.addEventListener('hidden.bs.modal', () => {
            // Clean up drag and drop listeners
            this.cleanupEmployeeAssignmentDragDrop();
            modal.remove();
        });
    }

    assignEmployeeToJob(employeeId, jobId, bayId = '') {
        const employee = this.employees.find(e => e.id === employeeId);

        // Find job either in jobs list or in bay
        let job = null;
        let bay = null;

        if (bayId && window.bayManagement) {
            bay = window.bayManagement.bays.find(b => b.id === bayId);
            job = bay ? bay.currentJob : null;
        }

        if (!job && window.bayManagement) {
            job = window.bayManagement.jobs.find(j => j.id === jobId);
        }

        if (!employee || !job) {
            Utils.showToast('Employee or job not found', 'error');
            return;
        }

        // Initialize assignedEmployees array if it doesn't exist
        if (!job.assignedEmployees) {
            job.assignedEmployees = [];
        }

        // Check if employee is already assigned
        if (job.assignedEmployees.includes(employeeId)) {
            Utils.showToast(`${employee.name} is already assigned to this job`, 'warning');
            return;
        }

        // Add employee to job assignment
        job.assignedEmployees.push(employeeId);

        // Update employee status
        employee.status = 'busy';
        employee.currentJob = jobId;

        // Save data
        this.saveData();
        if (window.bayManagement) {
            window.bayManagement.saveData();
            window.bayManagement.renderBays();
            window.bayManagement.updateStatusCards();
        }

        Utils.showToast(`${employee.name} assigned to job`, 'success');

        // Refresh the modal
        this.refreshJobAssignment(jobId, bayId);
    }

    unassignEmployeeFromJob(employeeId, jobId, bayId = '') {
        const employee = this.employees.find(e => e.id === employeeId);

        // Find job either in jobs list or in bay
        let job = null;
        let bay = null;

        if (bayId && window.bayManagement) {
            bay = window.bayManagement.bays.find(b => b.id === bayId);
            job = bay ? bay.currentJob : null;
        }

        if (!job && window.bayManagement) {
            job = window.bayManagement.jobs.find(j => j.id === jobId);
        }

        if (!employee || !job) {
            Utils.showToast('Employee or job not found', 'error');
            return;
        }

        // Remove employee from job assignment
        if (job.assignedEmployees) {
            job.assignedEmployees = job.assignedEmployees.filter(id => id !== employeeId);
        }

        // Update employee status
        employee.status = 'available';
        delete employee.currentJob;

        // Save data
        this.saveData();
        if (window.bayManagement) {
            window.bayManagement.saveData();
            window.bayManagement.renderBays();
            window.bayManagement.updateStatusCards();
        }

        Utils.showToast(`${employee.name} unassigned from job`, 'success');

        // Refresh the modal
        this.refreshJobAssignment(jobId, bayId);
    }

    refreshJobAssignment(jobId, bayId = '') {
        // Close current modal and reopen with updated data
        const modal = document.querySelector('.modal.show');
        if (modal) {
            bootstrap.Modal.getInstance(modal).hide();
        }

        // Small delay to ensure modal is closed before opening new one
        setTimeout(() => {
            this.showJobAssignment(jobId);
        }, 300);
    }

    getServiceSkillRequirements(serviceType) {
        const skillMap = {
            'Oil Change': ['Fluid Systems', 'Basic Maintenance'],
            'Brake Service': ['Brake Systems', 'Safety Systems'],
            'Tire Rotation': ['Tire Service', 'Wheel Alignment'],
            'Engine Diagnostic': ['Diagnostics', 'Engine Repair'],
            'Transmission Service': ['Transmission', 'Fluid Systems'],
            'AC Service': ['HVAC Systems', 'Refrigeration'],
            'Battery Replacement': ['Electrical Systems', 'Basic Maintenance'],
            'Alignment': ['Wheel Alignment', 'Suspension'],
            'Suspension Repair': ['Suspension', 'Chassis Work'],
            'Exhaust Repair': ['Exhaust Systems', 'Welding']
        };

        return skillMap[serviceType] || [];
    }

    setupEmployeeAssignmentDragDrop() {
        // Remove any existing listeners first
        this.cleanupEmployeeAssignmentDragDrop();

        // Drag start handler
        this.employeeDragStartHandler = (e) => {
            const employeeItem = e.target.closest('[data-employee-id]');
            if (employeeItem) {
                this.draggedEmployee = {
                    id: employeeItem.dataset.employeeId,
                    currentZone: employeeItem.dataset.currentZone,
                    element: employeeItem
                };
                employeeItem.style.opacity = '0.5';
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', ''); // For Firefox compatibility
            }
        };

        // Drag end handler
        this.employeeDragEndHandler = (e) => {
            const employeeItem = e.target.closest('[data-employee-id]');
            if (employeeItem) {
                employeeItem.style.opacity = '1';
                // Remove drag-over classes from all drop zones
                document.querySelectorAll('.employee-drop-zone').forEach(zone => {
                    zone.classList.remove('drag-over');
                });
                this.draggedEmployee = null;
            }
        };

        // Drag over handler for drop zones
        this.employeeDragOverHandler = (e) => {
            const dropZone = e.target.closest('.employee-drop-zone');
            if (dropZone && this.draggedEmployee) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';

                // Remove drag-over from all zones first
                document.querySelectorAll('.employee-drop-zone').forEach(zone => {
                    zone.classList.remove('drag-over');
                });

                // Add to current zone
                dropZone.classList.add('drag-over');
            }
        };

        // Drag leave handler
        this.employeeDragLeaveHandler = (e) => {
            const dropZone = e.target.closest('.employee-drop-zone');
            if (dropZone && !dropZone.contains(e.relatedTarget)) {
                dropZone.classList.remove('drag-over');
            }
        };

        // Drop handler
        this.employeeDropHandler = (e) => {
            const dropZone = e.target.closest('.employee-drop-zone');
            if (dropZone && this.draggedEmployee) {
                e.preventDefault();
                e.stopPropagation();

                dropZone.classList.remove('drag-over');

                const targetZone = dropZone.dataset.zone;
                const sourceZone = this.draggedEmployee.currentZone;

                if (targetZone !== sourceZone) {
                    this.moveEmployeeBetweenZones(this.draggedEmployee.id, sourceZone, targetZone);
                }
            }
        };

        // Add event listeners
        document.addEventListener('dragstart', this.employeeDragStartHandler);
        document.addEventListener('dragend', this.employeeDragEndHandler);
        document.addEventListener('dragover', this.employeeDragOverHandler);
        document.addEventListener('dragleave', this.employeeDragLeaveHandler);
        document.addEventListener('drop', this.employeeDropHandler);
    }

    cleanupEmployeeAssignmentDragDrop() {
        if (this.employeeDragStartHandler) {
            document.removeEventListener('dragstart', this.employeeDragStartHandler);
            document.removeEventListener('dragend', this.employeeDragEndHandler);
            document.removeEventListener('dragover', this.employeeDragOverHandler);
            document.removeEventListener('dragleave', this.employeeDragLeaveHandler);
            document.removeEventListener('drop', this.employeeDropHandler);
        }
    }

    moveEmployeeBetweenZones(employeeId, sourceZone, targetZone) {
        if (sourceZone === 'available' && targetZone === 'assigned') {
            this.addEmployeeToPendingAssignment(employeeId);
        } else if (sourceZone === 'assigned' && targetZone === 'available') {
            this.removeEmployeeFromPendingAssignment(employeeId);
        }
    }

    addEmployeeToPendingAssignment(employeeId) {
        if (!this.pendingAssignmentChanges.currentAssigned.includes(employeeId)) {
            this.pendingAssignmentChanges.currentAssigned.push(employeeId);
            this.updateEmployeeAssignmentDisplay();
        }
    }

    removeEmployeeFromPendingAssignment(employeeId) {
        this.pendingAssignmentChanges.currentAssigned = this.pendingAssignmentChanges.currentAssigned.filter(id => id !== employeeId);
        this.updateEmployeeAssignmentDisplay();
    }

    updateEmployeeAssignmentDisplay() {
        const assignedList = document.getElementById('assignedEmployeesList');
        const availableList = document.getElementById('availableEmployeesList');

        if (!assignedList || !availableList) return;

        // Get current assignments
        const currentAssigned = this.pendingAssignmentChanges.currentAssigned;
        const assignedEmployees = currentAssigned.map(empId => this.employees.find(e => e.id === empId)).filter(emp => emp);
        const availableEmployees = this.employees.filter(emp => emp.status === 'available' && !currentAssigned.includes(emp.id));

        // Update assigned employees list
        assignedList.innerHTML = assignedEmployees.length > 0 ? assignedEmployees.map(emp => `
            <div class="assigned-employee-item mb-2" draggable="true" data-employee-id="${emp.id}" data-current-zone="assigned">
                <div class="d-flex align-items-center">
                    <div class="drag-handle me-2">
                        <i class="fas fa-grip-vertical text-muted"></i>
                    </div>
                    <img src="${emp.avatar}" alt="${emp.name}" class="rounded-circle me-3" style="width: 40px; height: 40px;">
                    <div class="flex-grow-1">
                        <div class="fw-bold">${emp.name}</div>
                        <small class="text-muted">${emp.role}</small>
                        <div class="mt-1">
                            ${emp.specialties.slice(0, 2).map(spec =>
                                `<span class="badge bg-light text-dark me-1" style="font-size: 0.6rem;">${spec}</span>`
                            ).join('')}
                        </div>
                    </div>
                    <button class="btn btn-sm btn-outline-danger" onclick="employeeManagement.removeEmployeeFromPendingAssignment('${emp.id}')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `).join('') : '<div class="empty-zone-message text-muted text-center py-4"><i class="fas fa-users me-2"></i>Drag employees here to assign them</div>';

        // Update available employees list
        availableList.innerHTML = availableEmployees.length > 0 ? availableEmployees.map(emp => `
            <div class="available-employee-item mb-2" draggable="true" data-employee-id="${emp.id}" data-current-zone="available">
                <div class="d-flex align-items-center">
                    <div class="drag-handle me-2">
                        <i class="fas fa-grip-vertical text-muted"></i>
                    </div>
                    <img src="${emp.avatar}" alt="${emp.name}" class="rounded-circle me-3" style="width: 40px; height: 40px;">
                    <div class="flex-grow-1">
                        <div class="fw-bold">${emp.name}</div>
                        <small class="text-muted">${emp.role}</small>
                        <div class="mt-1">
                            ${emp.specialties.slice(0, 2).map(spec =>
                                `<span class="badge bg-light text-dark me-1" style="font-size: 0.6rem;">${spec}</span>`
                            ).join('')}
                        </div>
                    </div>
                    <button class="btn btn-sm btn-outline-primary" onclick="employeeManagement.addEmployeeToPendingAssignment('${emp.id}')">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        `).join('') : '<div class="empty-zone-message text-muted text-center py-4"><i class="fas fa-user-slash me-2"></i>No available employees</div>';

        // Update counts in headers using a more reliable method
        const modal = document.querySelector('.modal.show');
        if (modal) {
            const headers = modal.querySelectorAll('.card-header h6');
            headers.forEach(header => {
                if (header.textContent.includes('Assigned Employees')) {
                    header.innerHTML = `<i class="fas fa-user-check me-2"></i>Assigned Employees (${assignedEmployees.length})`;
                } else if (header.textContent.includes('Available Employees')) {
                    header.innerHTML = `<i class="fas fa-user-plus me-2"></i>Available Employees (${availableEmployees.length})`;
                }
            });
        }
    }

    saveJobAssignmentChanges(jobId, bayId = '') {
        if (!this.pendingAssignmentChanges) {
            Utils.showToast('No changes to save', 'info');
            return;
        }

        // Find job either in jobs list or in bay
        let job = null;
        let bay = null;

        if (bayId && window.bayManagement) {
            bay = window.bayManagement.bays.find(b => b.id === bayId);
            job = bay ? bay.currentJob : null;
        }

        if (!job && window.bayManagement) {
            job = window.bayManagement.jobs.find(j => j.id === jobId);
        }

        if (!job) {
            Utils.showToast('Job not found', 'error');
            return;
        }

        // Calculate changes
        const originalAssigned = this.pendingAssignmentChanges.originalAssigned;
        const currentAssigned = this.pendingAssignmentChanges.currentAssigned;

        const toAssign = currentAssigned.filter(id => !originalAssigned.includes(id));
        const toUnassign = originalAssigned.filter(id => !currentAssigned.includes(id));

        // Apply assignments
        toAssign.forEach(employeeId => {
            const employee = this.employees.find(e => e.id === employeeId);
            if (employee) {
                employee.status = 'busy';
                employee.currentJob = jobId;
            }
        });

        // Apply unassignments
        toUnassign.forEach(employeeId => {
            const employee = this.employees.find(e => e.id === employeeId);
            if (employee) {
                employee.status = 'available';
                delete employee.currentJob;
            }
        });

        // Update job assignments
        job.assignedEmployees = [...currentAssigned];

        // Save data
        this.saveData();
        if (window.bayManagement) {
            window.bayManagement.saveData();
            window.bayManagement.renderBays();
            window.bayManagement.updateStatusCards();
        }

        // Close modal
        const modal = document.querySelector('.modal.show');
        if (modal) {
            bootstrap.Modal.getInstance(modal).hide();
        }

        const changeCount = toAssign.length + toUnassign.length;
        Utils.showToast(`Assignment changes saved (${changeCount} change${changeCount !== 1 ? 's' : ''})`, 'success');
    }

    cancelJobAssignmentChanges(jobId, bayId = '') {
        // Close modal without saving
        const modal = document.querySelector('.modal.show');
        if (modal) {
            bootstrap.Modal.getInstance(modal).hide();
        }

        Utils.showToast('Changes cancelled', 'info');
    }

    showBayAssignmentManager() {
        // Get jobs that have employees assigned but are not yet assigned to bays
        const assignedJobs = window.bayManagement ? window.bayManagement.jobs.filter(job =>
            job.assignedEmployees && job.assignedEmployees.length > 0 && !job.assignedBay
        ) : [];

        // Get available bays
        const availableBays = window.bayManagement ? window.bayManagement.bays.filter(bay =>
            bay.status === 'available'
        ) : [];

        if (assignedJobs.length === 0) {
            Utils.showToast('No jobs with assigned employees ready for bay assignment', 'info');
            return;
        }

        if (availableBays.length === 0) {
            Utils.showToast('No available bays for assignment', 'warning');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-warehouse me-2"></i>Bay Assignment Manager
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-header">
                                        <h6 class="mb-0">
                                            <i class="fas fa-clipboard-list me-2"></i>Ready Jobs (${assignedJobs.length})
                                        </h6>
                                        <small class="text-muted">Jobs with assigned employees ready for bay assignment</small>
                                    </div>
                                    <div class="card-body" style="max-height: 400px; overflow-y: auto;">
                                        ${this.renderReadyJobs(assignedJobs)}
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-header">
                                        <h6 class="mb-0">
                                            <i class="fas fa-warehouse me-2"></i>Available Bays (${availableBays.length})
                                        </h6>
                                        <small class="text-muted">Drag jobs to available bays to assign</small>
                                    </div>
                                    <div class="card-body" style="max-height: 400px; overflow-y: auto;">
                                        ${this.renderAvailableBays(availableBays)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" onclick="employeeManagement.showAssignmentManager()">
                            <i class="fas fa-arrow-left me-2"></i>Back to Job Assignment
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });

        // Setup drag and drop for bay assignment
        this.setupBayAssignmentDragDrop();
    }

    renderReadyJobs(jobs) {
        return jobs.map(job => {
            const assignedEmployees = job.assignedEmployees.map(empId =>
                this.employees.find(e => e.id === empId)
            ).filter(emp => emp);

            return `
                <div class="ready-job-card" draggable="true" data-job-id="${job.id}">
                    <div class="d-flex align-items-start">
                        <div class="job-icon me-3">
                            <i class="fas fa-car"></i>
                        </div>
                        <div class="flex-grow-1">
                            <h6 class="mb-1">${job.vehicle}</h6>
                            <p class="mb-1 text-muted">${job.customer}</p>
                            <small class="text-muted">${job.service}</small>
                            <div class="mt-2">
                                <span class="badge bg-info me-1">${job.priority}</span>
                                <span class="badge bg-success">${assignedEmployees.length} employee${assignedEmployees.length > 1 ? 's' : ''}</span>
                            </div>
                            <div class="mt-2">
                                <small class="text-muted">Assigned to:</small>
                                <div class="assigned-employees-list">
                                    ${assignedEmployees.map(emp => `
                                        <div class="d-flex align-items-center mt-1">
                                            <img src="${emp.avatar}" alt="${emp.name}" class="rounded-circle me-2" style="width: 20px; height: 20px;">
                                            <small>${emp.name} (${emp.role})</small>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderAvailableBays(bays) {
        return bays.map(bay => `
            <div class="available-bay-slot" data-bay-id="${bay.id}">
                <div class="text-center">
                    <div class="bay-icon mb-2">
                        <i class="fas fa-warehouse"></i>
                    </div>
                    <h6 class="mb-1">${bay.id}</h6>
                    <small class="text-muted">${bay.type}</small>
                    <div class="mt-2">
                        <span class="badge bg-secondary">${bay.capacity} tons</span>
                    </div>
                    <div class="mt-2">
                        <small class="text-muted">Equipment:</small>
                        <div class="equipment-list">
                            ${bay.equipment.slice(0, 2).map(eq => `
                                <small class="d-block">${eq}</small>
                            `).join('')}
                            ${bay.equipment.length > 2 ? `<small class="text-muted">+${bay.equipment.length - 2} more</small>` : ''}
                        </div>
                    </div>
                    <div class="drop-zone mt-3">
                        <small class="text-muted">Drop job here</small>
                    </div>
                </div>
            </div>
        `).join('');
    }

    setupBayAssignmentDragDrop() {
        // Remove existing listeners
        this.removeBayAssignmentListeners();

        // Drag start for jobs
        this.bayDragStartHandler = (e) => {
            if (e.target.classList.contains('ready-job-card')) {
                this.draggedJob = {
                    id: e.target.dataset.jobId,
                    element: e.target
                };
                e.target.style.opacity = '0.5';
                e.dataTransfer.effectAllowed = 'move';
            }
        };

        // Drag end for jobs
        this.bayDragEndHandler = (e) => {
            if (e.target.classList.contains('ready-job-card')) {
                e.target.style.opacity = '1';
                // Clean up all drag-over classes
                document.querySelectorAll('.available-bay-slot.drag-over').forEach(slot => {
                    slot.classList.remove('drag-over');
                });
                this.draggedJob = null;
            }
        };

        // Drag over bay slots
        this.bayDragOverHandler = (e) => {
            const baySlot = e.target.closest('.available-bay-slot');
            if (baySlot && this.draggedJob) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';

                // Remove drag-over from all slots first
                document.querySelectorAll('.available-bay-slot.drag-over').forEach(slot => {
                    slot.classList.remove('drag-over');
                });

                // Add to current slot
                baySlot.classList.add('drag-over');
            }
        };

        // Drag leave bay slots
        this.bayDragLeaveHandler = (e) => {
            const baySlot = e.target.closest('.available-bay-slot');
            if (baySlot) {
                if (!baySlot.contains(e.relatedTarget)) {
                    baySlot.classList.remove('drag-over');
                }
            }
        };

        // Drop on bay slots
        this.bayDropHandler = (e) => {
            const baySlot = e.target.closest('.available-bay-slot');
            if (baySlot && this.draggedJob) {
                e.preventDefault();
                e.stopPropagation();

                baySlot.classList.remove('drag-over');
                this.handleJobBayAssignment(this.draggedJob.id, baySlot.dataset.bayId);
            }
        };

        // Add event listeners
        document.addEventListener('dragstart', this.bayDragStartHandler);
        document.addEventListener('dragend', this.bayDragEndHandler);
        document.addEventListener('dragover', this.bayDragOverHandler);
        document.addEventListener('dragleave', this.bayDragLeaveHandler);
        document.addEventListener('drop', this.bayDropHandler);
    }

    removeBayAssignmentListeners() {
        if (this.bayDragStartHandler) {
            document.removeEventListener('dragstart', this.bayDragStartHandler);
            document.removeEventListener('dragend', this.bayDragEndHandler);
            document.removeEventListener('dragover', this.bayDragOverHandler);
            document.removeEventListener('dragleave', this.bayDragLeaveHandler);
            document.removeEventListener('drop', this.bayDropHandler);
        }
    }

    handleJobBayAssignment(jobId, bayId) {
        if (!jobId || !bayId) return;

        const job = window.bayManagement ? window.bayManagement.jobs.find(j => j.id === jobId) : null;
        const bay = window.bayManagement ? window.bayManagement.bays.find(b => b.id === bayId) : null;

        if (!job || !bay) {
            Utils.showToast('Job or bay not found', 'error');
            return;
        }

        if (bay.status !== 'available') {
            Utils.showToast('Bay is no longer available', 'warning');
            return;
        }

        // Use the existing bay management assignment logic
        if (window.bayManagement) {
            window.bayManagement.assignJobToBay(job, bay);
        }

        // Close the bay assignment modal
        const modal = document.querySelector('.modal.show');
        if (modal) {
            bootstrap.Modal.getInstance(modal).hide();
        }

        Utils.showToast(`${job.vehicle} assigned to ${bay.id}`, 'success');
    }

    refreshAssignmentManager() {
        const availableContent = document.querySelector('.available-employees .assignment-content');
        const jobContent = document.querySelector('.job-assignments .assignment-content');
        const employeeCount = document.getElementById('employeeCount');
        const jobCount = document.getElementById('jobCount');

        if (availableContent) {
            availableContent.innerHTML = this.renderAvailableEmployees();
        }

        if (jobContent) {
            jobContent.innerHTML = this.renderJobAssignments();
        }

        // Update counts
        if (employeeCount) {
            employeeCount.textContent = this.employees.filter(e => e.status === 'available').length;
        }

        if (jobCount) {
            jobCount.textContent = this.getJobCount();
        }

        // Clear any active search filters
        const employeeSearch = document.getElementById('employeeSearch');
        const jobSearch = document.getElementById('jobSearch');

        if (employeeSearch) {
            employeeSearch.value = '';
        }

        if (jobSearch) {
            jobSearch.value = '';
        }

        // Re-setup drag and drop
        this.setupJobAssignmentDragDrop();
    }

    getStatusClass(status) {
        const statusClasses = {
            'available': 'success',
            'busy': 'warning',
            'on_break': 'info',
            'off_duty': 'secondary'
        };
        return statusClasses[status] || 'secondary';
    }

    showScheduleCalendar() {
        this.showTeamScheduleOverview();
    }

    showTeamScheduleOverview() {
        // Initialize schedule view properties
        this.currentScheduleView = 'week';
        this.currentScheduleDate = new Date();

        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-fullscreen">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-calendar-alt me-2"></i>Team Schedule Overview
                        </h5>
                        <div class="schedule-controls">
                            <div class="btn-group me-3" role="group">
                                <button type="button" class="btn btn-outline-primary btn-sm view-btn" data-view="month" onclick="employeeManagement.changeScheduleView('month')">
                                    <i class="fas fa-calendar me-1"></i>Month
                                </button>
                                <button type="button" class="btn btn-primary btn-sm view-btn" data-view="week" onclick="employeeManagement.changeScheduleView('week')">
                                    <i class="fas fa-calendar-week me-1"></i>Week
                                </button>
                                <button type="button" class="btn btn-outline-primary btn-sm view-btn" data-view="day" onclick="employeeManagement.changeScheduleView('day')">
                                    <i class="fas fa-calendar-day me-1"></i>Day
                                </button>
                            </div>
                            <div class="btn-group me-3" role="group">
                                <button type="button" class="btn btn-outline-secondary btn-sm" onclick="employeeManagement.navigateSchedule('prev')">
                                    <i class="fas fa-chevron-left"></i>
                                </button>
                                <button type="button" class="btn btn-outline-secondary btn-sm" onclick="employeeManagement.navigateSchedule('today')">
                                    Today
                                </button>
                                <button type="button" class="btn btn-outline-secondary btn-sm" onclick="employeeManagement.navigateSchedule('next')">
                                    <i class="fas fa-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="schedule-date-header">
                            <h6 id="scheduleDateRange" class="mb-3"></h6>
                        </div>
                        <div class="team-schedule-container" id="teamScheduleContainer">
                            ${this.renderTeamScheduleGrid()}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-warning" onclick="employeeManagement.resetEmployeeStatuses()">
                            <i class="fas fa-refresh me-2"></i>Reset Statuses
                        </button>
                        <button type="button" class="btn btn-primary" onclick="employeeManagement.showAssignmentManager()">
                            <i class="fas fa-tasks me-2"></i>Manage Assignments
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        // Update date range display
        this.updateScheduleDateRange();

        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });

        // Setup drag and drop for team schedule
        this.setupScheduleDragDrop();
    }

    renderTeamScheduleGrid() {
        const view = this.currentScheduleView || 'week';

        switch (view) {
            case 'month':
                return this.renderMonthView();
            case 'week':
                return this.renderWeekView();
            case 'day':
                return this.renderDayView();
            default:
                return this.renderWeekView();
        }
    }

    renderWeekView() {
        const weekStart = this.getWeekStart(this.currentScheduleDate);
        const weekDays = [];

        // Generate week days with actual dates
        for (let i = 0; i < 7; i++) {
            const date = new Date(weekStart);
            date.setDate(date.getDate() + i);
            weekDays.push(date);
        }

        const hours = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

        let html = `
            <div class="team-schedule-grid week-view">
                <div class="schedule-header">
                    <div class="employee-column">Employee</div>
                    ${weekDays.map(date => `
                        <div class="day-column">
                            <div class="day-name">${this.getDayName(date.getDay())}</div>
                            <div class="day-date">${date.getDate()}/${date.getMonth() + 1}</div>
                        </div>
                    `).join('')}
                </div>
        `;

        this.employees.forEach(employee => {
            html += `
                <div class="employee-row">
                    <div class="employee-info">
                        <img src="${employee.avatar}" alt="${employee.name}" class="rounded-circle me-2" style="width: 30px; height: 30px;">
                        <div>
                            <div class="fw-bold">${employee.name}</div>
                            <small class="text-muted">${employee.role}</small>
                        </div>
                    </div>
                    ${weekDays.map((date, dayIndex) => `
                        <div class="day-schedule">
                            ${hours.map(hour => {
                                const assignments = this.getEmployeeAssignments(employee.id, dayIndex, hour);
                                const hasAssignment = assignments.length > 0;
                                return `
                                    <div class="schedule-time-slot ${hasAssignment ? 'has-assignment' : ''}"
                                         data-employee-id="${employee.id}"
                                         data-day="${dayIndex}"
                                         data-hour="${hour}"
                                         data-date="${date.toISOString().split('T')[0]}">
                                        ${assignments.map(assignment => `
                                            <div class="assignment-block mini"
                                                 title="${assignment.jobTitle}"
                                                 draggable="true"
                                                 data-assignment-id="${assignment.id}">
                                                ${assignment.jobTitle.substring(0, 15)}...
                                            </div>
                                        `).join('')}
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    `).join('')}
                </div>
            `;
        });

        html += '</div>';
        return html;
    }

    renderDayView() {
        const currentDate = new Date(this.currentScheduleDate);
        const hours = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
        const dayIndex = (currentDate.getDay() + 6) % 7; // Convert to Monday=0 format

        let html = `
            <div class="team-schedule-grid day-view">
                <div class="schedule-header">
                    <div class="employee-column">Employee</div>
                    <div class="day-column wide">
                        <div class="day-name">${this.getDayName(currentDate.getDay())}</div>
                        <div class="day-date">${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}</div>
                    </div>
                </div>
        `;

        this.employees.forEach(employee => {
            html += `
                <div class="employee-row">
                    <div class="employee-info">
                        <img src="${employee.avatar}" alt="${employee.name}" class="rounded-circle me-2" style="width: 40px; height: 40px;">
                        <div>
                            <div class="fw-bold">${employee.name}</div>
                            <small class="text-muted">${employee.role}</small>
                            <div class="mt-1">
                                <span class="badge bg-${this.getStatusClass(employee.status)}">${employee.status.replace('_', ' ')}</span>
                            </div>
                        </div>
                    </div>
                    <div class="day-schedule wide">
                        ${hours.map(hour => {
                            const assignments = this.getEmployeeAssignments(employee.id, dayIndex, hour);
                            const hasAssignment = assignments.length > 0;
                            return `
                                <div class="schedule-time-slot large ${hasAssignment ? 'has-assignment' : ''}"
                                     data-employee-id="${employee.id}"
                                     data-day="${dayIndex}"
                                     data-hour="${hour}"
                                     data-date="${currentDate.toISOString().split('T')[0]}">
                                    <div class="time-label">${hour}</div>
                                    <div class="assignment-content">
                                        ${assignments.map(assignment => `
                                            <div class="assignment-block large"
                                                 title="${assignment.jobTitle}"
                                                 draggable="true"
                                                 data-assignment-id="${assignment.id}">
                                                <div class="assignment-title">${assignment.jobTitle}</div>
                                                <div class="assignment-details">
                                                    <small>Duration: ${assignment.duration || 1}h</small>
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        });

        html += '</div>';
        return html;
    }

    renderMonthView() {
        console.log('Rendering month view');
        const currentDate = new Date(this.currentScheduleDate);
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        console.log('Month view for:', this.getMonthName(month), year);

        // Get first day of month and calculate calendar grid
        const firstDay = new Date(year, month, 1);
        const startDate = new Date(firstDay);

        // Start from Monday of the week containing the first day
        const firstDayOfWeek = (firstDay.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
        startDate.setDate(startDate.getDate() - firstDayOfWeek);

        const weeks = [];
        let currentWeek = [];

        // Generate 6 weeks to ensure full month coverage
        for (let i = 0; i < 42; i++) { // 6 weeks * 7 days = 42 days
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            currentWeek.push(new Date(date));

            if (currentWeek.length === 7) {
                weeks.push([...currentWeek]);
                currentWeek = [];
            }
        }

        console.log('Generated weeks:', weeks.length);

        let html = `
            <div class="team-schedule-grid month-view">
                <div class="month-header">
                    <div class="month-title">${this.getMonthName(month)} ${year}</div>
                </div>
                <div class="month-calendar">
                    <div class="calendar-header">
                        ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day =>
                            `<div class="calendar-day-header">${day}</div>`
                        ).join('')}
                    </div>
                    ${weeks.map(week => `
                        <div class="calendar-week">
                            ${week.map(date => {
                                const isCurrentMonth = date.getMonth() === month;
                                const dayAssignments = this.getDayAssignments(date);
                                const isToday = this.isToday(date);
                                return `
                                    <div class="calendar-day ${isCurrentMonth ? 'current-month' : 'other-month'} ${isToday ? 'today' : ''}"
                                         data-date="${date.toISOString().split('T')[0]}"
                                         onclick="employeeManagement.selectDate('${date.toISOString().split('T')[0]}')">
                                        <div class="day-number">${date.getDate()}</div>
                                        <div class="day-assignments">
                                            ${dayAssignments.slice(0, 3).map(assignment => `
                                                <div class="assignment-dot"
                                                     title="${assignment.employeeName}: ${assignment.jobTitle}"
                                                     style="background-color: ${this.getEmployeeColor(assignment.employeeId)}">
                                                </div>
                                            `).join('')}
                                            ${dayAssignments.length > 3 ? `<div class="more-assignments">+${dayAssignments.length - 3}</div>` : ''}
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        return html;
    }

    // Calendar helper methods
    changeScheduleView(view) {
        console.log('Changing schedule view to:', view);
        this.currentScheduleView = view;

        // Update button states - only for view buttons
        document.querySelectorAll('.schedule-controls .view-btn').forEach(btn => {
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-outline-primary');
        });

        // Find and activate the clicked button
        const activeBtn = document.querySelector(`.schedule-controls .view-btn[data-view="${view}"]`);
        if (activeBtn) {
            activeBtn.classList.remove('btn-outline-primary');
            activeBtn.classList.add('btn-primary');
        }

        // Update date range display
        this.updateScheduleDateRange();

        // Re-render the schedule
        this.refreshTeamSchedule();
    }

    navigateSchedule(direction) {
        const currentDate = new Date(this.currentScheduleDate);

        switch (direction) {
            case 'prev':
                if (this.currentScheduleView === 'month') {
                    currentDate.setMonth(currentDate.getMonth() - 1);
                } else if (this.currentScheduleView === 'week') {
                    currentDate.setDate(currentDate.getDate() - 7);
                } else {
                    currentDate.setDate(currentDate.getDate() - 1);
                }
                break;
            case 'next':
                if (this.currentScheduleView === 'month') {
                    currentDate.setMonth(currentDate.getMonth() + 1);
                } else if (this.currentScheduleView === 'week') {
                    currentDate.setDate(currentDate.getDate() + 7);
                } else {
                    currentDate.setDate(currentDate.getDate() + 1);
                }
                break;
            case 'today':
                currentDate.setTime(new Date().getTime());
                break;
        }

        this.currentScheduleDate = currentDate;
        this.refreshTeamSchedule();
        this.updateScheduleDateRange();
    }

    refreshTeamSchedule() {
        const container = document.getElementById('teamScheduleContainer');
        if (container) {
            container.innerHTML = this.renderTeamScheduleGrid();
            this.setupScheduleDragDrop();
        }
    }

    updateScheduleDateRange() {
        const element = document.getElementById('scheduleDateRange');
        if (!element) return;

        const currentDate = new Date(this.currentScheduleDate);
        let dateText = '';

        switch (this.currentScheduleView) {
            case 'month':
                dateText = `${this.getMonthName(currentDate.getMonth())} ${currentDate.getFullYear()}`;
                break;
            case 'week':
                const weekStart = this.getWeekStart(currentDate);
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekEnd.getDate() + 6);
                dateText = `${weekStart.getDate()}/${weekStart.getMonth() + 1} - ${weekEnd.getDate()}/${weekEnd.getMonth() + 1}/${weekEnd.getFullYear()}`;
                break;
            case 'day':
                dateText = `${this.getDayName(currentDate.getDay())}, ${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
                break;
        }

        element.textContent = dateText;
    }

    getWeekStart(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        return new Date(d.setDate(diff));
    }

    getDayName(dayIndex) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[dayIndex];
    }

    getMonthName(monthIndex) {
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
        return months[monthIndex];
    }

    getDayAssignments(date) {
        const dayIndex = (date.getDay() + 6) % 7; // Convert to Monday=0 format
        const allAssignments = Utils.loadFromStorage('employeeAssignments') || [];

        return allAssignments.filter(assignment => {
            if (assignment.date) {
                return assignment.date === date.toISOString().split('T')[0];
            } else {
                return assignment.day === dayIndex;
            }
        }).map(assignment => {
            const employee = this.employees.find(e => e.id === assignment.employeeId);
            return {
                ...assignment,
                employeeName: employee ? employee.name : 'Unknown'
            };
        });
    }

    getEmployeeColor(employeeId) {
        const colors = ['#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8', '#6f42c1', '#fd7e14'];
        const index = this.employees.findIndex(e => e.id === employeeId);
        return colors[index % colors.length];
    }

    isToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    selectDate(dateString) {
        console.log('Selected date:', dateString);
        this.currentScheduleDate = new Date(dateString);
        this.changeScheduleView('day');
    }

    resetEmployeeStatuses() {
        // Reset all employees to available status
        this.employees.forEach(employee => {
            employee.status = 'available';
            delete employee.currentJob; // Remove any current job assignment
        });

        // Save updated employee data
        Utils.saveToStorage('employees', this.employees);

        // Clear any job assignments
        localStorage.removeItem('employeeAssignments');

        // Reset job assignments in bay management
        if (window.bayManagement && window.bayManagement.jobs) {
            window.bayManagement.jobs.forEach(job => {
                // Clear both old and new format assignments
                delete job.assignedEmployee;
                delete job.assignedEmployeeName;
                delete job.assignedEmployees;
                if (job.status === 'assigned') {
                    job.status = 'pending';
                }
            });
            window.bayManagement.saveData();
            window.bayManagement.updateStatusCards();
        }

        Utils.showToast('All employee statuses reset to available!', 'success');

        // Refresh any open modals
        this.refreshEmployeeDisplay();
    }

    refreshEmployeeDisplay() {
        // Refresh employee grid if visible
        const employeeGrid = document.querySelector('.employee-grid');
        if (employeeGrid) {
            employeeGrid.innerHTML = this.renderEmployeeGrid();
        }

        // Refresh employee stats if visible
        const statsContainer = document.querySelector('.card-body');
        if (statsContainer && statsContainer.innerHTML.includes('Available')) {
            statsContainer.innerHTML = this.renderEmployeeStats();
        }

        // Refresh assignment manager if open
        this.refreshAssignmentManager();

        // Refresh team schedule if open
        this.refreshTeamSchedule();
    }

    // Reset workshop data with fresh employees and jobs
    resetWorkshopData() {
        // Clear existing data
        localStorage.removeItem('employees');
        localStorage.removeItem('employeeSchedules');
        localStorage.removeItem('bays');
        localStorage.removeItem('jobs');
        localStorage.removeItem('bookings');
        localStorage.removeItem('completedJobs');

        // Regenerate fresh data
        this.employees = [];
        this.employeeSchedules = [];
        this.generateEmployees();

        // Regenerate bay management data
        if (window.bayManagement) {
            window.bayManagement.bays = [];
            window.bayManagement.jobs = [];
            window.bayManagement.generateBays();
            window.bayManagement.generateSampleJobs();
            window.bayManagement.updateStatusCards();
        }

        Utils.showToast('Workshop data refreshed with new employees and jobs!', 'success');
    }
}

// Initialize employee management
document.addEventListener('DOMContentLoaded', () => {
    window.employeeManagement = new EmployeeManagement();
});
