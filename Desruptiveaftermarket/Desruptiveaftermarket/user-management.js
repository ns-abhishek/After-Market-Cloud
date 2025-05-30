// User Management JavaScript
let users = [];
let filteredUsers = [];
let currentFilters = {
    role: '',
    status: '',
    mfa: ''
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing User Management...');

    // Initialize security service
    if (typeof SecurityService !== 'undefined') {
        SecurityService.init();
    }

    // Load users
    loadUsers();

    // Set up event listeners
    setupEventListeners();

    console.log('User Management initialized successfully');
});

// Set up event listeners
function setupEventListeners() {
    // Set up back button event listener with multiple approaches
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        // Remove any existing onclick
        backButton.removeAttribute('onclick');

        // Add click event listener
        backButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Back button clicked via event listener');
            goBack();
        });

        // Also add as onclick for backup
        backButton.onclick = function(e) {
            e.preventDefault();
            console.log('Back button clicked via onclick');
            goBack();
            return false;
        };
    }

    // Search functionality
    const searchInput = document.getElementById('userSearch');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            searchInput?.focus();
        }
    });
}

// Load users from security service
function loadUsers() {
    try {
        if (typeof SecurityService !== 'undefined') {
            users = SecurityService.getUsers() || [];
        } else {
            // Fallback sample data
            users = generateSampleUsers();
        }

        filteredUsers = [...users];
        updateUsersDisplay();
        updateUsersCount();

        console.log(`Loaded ${users.length} users`);
    } catch (error) {
        console.error('Error loading users:', error);
        showNotification('Error loading users', 'error');
    }
}

// Generate sample users for demo
function generateSampleUsers() {
    return [
        {
            id: 'user1',
            username: 'admin',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@company.com',
            role: 'admin',
            isActive: true,
            mfaEnabled: true,
            mfaMethod: 'app',
            lastLogin: '2024-01-15T10:30:00',
            accountLocked: false,
            failedLoginAttempts: 0
        },
        {
            id: 'user2',
            username: 'manager',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@company.com',
            role: 'manager',
            isActive: true,
            mfaEnabled: true,
            mfaMethod: 'sms',
            lastLogin: '2024-01-14T15:45:00',
            accountLocked: false,
            failedLoginAttempts: 0
        },
        {
            id: 'user3',
            username: 'operator',
            firstName: 'Mike',
            lastName: 'Johnson',
            email: 'mike.johnson@company.com',
            role: 'user',
            isActive: true,
            mfaEnabled: false,
            mfaMethod: null,
            lastLogin: '2024-01-13T09:20:00',
            accountLocked: false,
            failedLoginAttempts: 0
        },
        {
            id: 'user4',
            username: 'guest_user',
            firstName: 'Sarah',
            lastName: 'Wilson',
            email: 'sarah.wilson@company.com',
            role: 'guest',
            isActive: false,
            mfaEnabled: false,
            mfaMethod: null,
            lastLogin: '2024-01-10T14:15:00',
            accountLocked: false,
            failedLoginAttempts: 0
        },
        {
            id: 'user5',
            username: 'locked_user',
            firstName: 'David',
            lastName: 'Brown',
            email: 'david.brown@company.com',
            role: 'user',
            isActive: true,
            mfaEnabled: true,
            mfaMethod: 'email',
            lastLogin: '2024-01-08T11:30:00',
            accountLocked: true,
            failedLoginAttempts: 5
        }
    ];
}

// Update users display
function updateUsersDisplay() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    filteredUsers.forEach(user => {
        const row = createUserRow(user);
        tbody.appendChild(row);
    });
}

// Create user row
function createUserRow(user) {
    const row = document.createElement('tr');

    // Get user initials for avatar
    const initials = `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase();

    // Format last login
    const lastLogin = user.lastLogin ?
        new Date(user.lastLogin).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }) : 'Never';

    // Determine status
    let status = 'active';
    let statusText = 'Active';
    if (user.accountLocked) {
        status = 'locked';
        statusText = 'Locked';
    } else if (!user.isActive) {
        status = 'inactive';
        statusText = 'Inactive';
    }

    row.innerHTML = `
        <td>
            <div class="user-info">
                <div class="user-avatar">${initials}</div>
                <div class="user-details">
                    <h4>${user.firstName} ${user.lastName}</h4>
                    <p>${user.email}</p>
                </div>
            </div>
        </td>
        <td>
            <span class="role-badge role-${user.role}">${user.role}</span>
        </td>
        <td>
            <span class="status-badge status-${status}">${statusText}</span>
        </td>
        <td>${lastLogin}</td>
        <td>
            <span class="status-badge ${user.mfaEnabled ? 'status-active' : 'status-inactive'}">
                ${user.mfaEnabled ? 'Enabled' : 'Disabled'}
            </span>
        </td>
        <td>
            <div class="table-actions">
                <button class="table-action-btn edit" onclick="editUser('${user.id}')" title="Edit User">
                    <i class="material-icons">edit</i>
                </button>
                <button class="table-action-btn" onclick="resetPassword('${user.id}')" title="Reset Password">
                    <i class="material-icons">lock_reset</i>
                </button>
                <button class="table-action-btn" onclick="toggleUserStatus('${user.id}')" title="Toggle Status">
                    <i class="material-icons">${user.isActive ? 'person_off' : 'person'}</i>
                </button>
                <button class="table-action-btn delete" onclick="deleteUser('${user.id}')" title="Delete User">
                    <i class="material-icons">delete</i>
                </button>
            </div>
        </td>
    `;

    return row;
}

// Update users count
function updateUsersCount() {
    const countElement = document.getElementById('usersCount');
    if (countElement) {
        countElement.textContent = `${filteredUsers.length} of ${users.length} users`;
    }
}

// Handle search
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase().trim();

    if (searchTerm === '') {
        filteredUsers = [...users];
    } else {
        filteredUsers = users.filter(user =>
            user.firstName?.toLowerCase().includes(searchTerm) ||
            user.lastName?.toLowerCase().includes(searchTerm) ||
            user.email?.toLowerCase().includes(searchTerm) ||
            user.username?.toLowerCase().includes(searchTerm) ||
            user.role?.toLowerCase().includes(searchTerm)
        );
    }

    updateUsersDisplay();
    updateUsersCount();
}

// User actions
function addNewUser() {
    showNotification('Opening Add User dialog...', 'info');

    // Create modal for adding new user
    const modal = createUserModal();
    document.body.appendChild(modal);

    // Show modal with animation
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

// Create user modal
function createUserModal(user = null) {
    const isEdit = user !== null;
    const modalTitle = isEdit ? 'Edit User' : 'Add New User';

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${modalTitle}</h2>
                <button class="modal-close" onclick="closeModal(this)">&times;</button>
            </div>
            <div class="modal-body">
                <form id="userForm">
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label">First Name *</label>
                            <input type="text" class="form-input" id="firstName" value="${user?.firstName || ''}" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Last Name *</label>
                            <input type="text" class="form-input" id="lastName" value="${user?.lastName || ''}" required>
                        </div>
                    </div>

                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label">Username *</label>
                            <input type="text" class="form-input" id="username" value="${user?.username || ''}" required ${isEdit ? 'readonly' : ''}>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Email *</label>
                            <input type="email" class="form-input" id="email" value="${user?.email || ''}" required>
                        </div>
                    </div>

                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label">Role *</label>
                            <select class="form-select" id="role" required>
                                <option value="">Select Role</option>
                                <option value="admin" ${user?.role === 'admin' ? 'selected' : ''}>Administrator</option>
                                <option value="manager" ${user?.role === 'manager' ? 'selected' : ''}>Manager</option>
                                <option value="user" ${user?.role === 'user' ? 'selected' : ''}>User</option>
                                <option value="guest" ${user?.role === 'guest' ? 'selected' : ''}>Guest</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Status</label>
                            <select class="form-select" id="status">
                                <option value="active" ${user?.isActive !== false ? 'selected' : ''}>Active</option>
                                <option value="inactive" ${user?.isActive === false ? 'selected' : ''}>Inactive</option>
                            </select>
                        </div>
                    </div>

                    ${!isEdit ? `
                    <div class="form-group">
                        <label class="form-label">Temporary Password *</label>
                        <input type="password" class="form-input" id="tempPassword" required>
                        <small class="form-help">User will be required to change password on first login</small>
                    </div>
                    ` : ''}

                    <div class="form-group">
                        <label class="form-label">
                            <input type="checkbox" id="mfaEnabled" ${user?.mfaEnabled ? 'checked' : ''}>
                            Enable Multi-Factor Authentication
                        </label>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="action-btn secondary" onclick="closeModal(this)">Cancel</button>
                <button type="button" class="action-btn" onclick="saveUser(${isEdit ? `'${user?.id}'` : 'null'})">${isEdit ? 'Update' : 'Create'} User</button>
            </div>
        </div>
    `;

    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }

        .modal-overlay.show {
            opacity: 1;
            visibility: visible;
        }

        .modal-content {
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            transform: scale(0.9);
            transition: transform 0.3s ease;
        }

        .modal-overlay.show .modal-content {
            transform: scale(1);
        }

        .modal-header {
            padding: 20px 24px;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .modal-header h2 {
            font-size: 18px;
            font-weight: 600;
            color: var(--text-primary);
        }

        .modal-close {
            background: none;
            border: none;
            font-size: 24px;
            color: var(--text-muted);
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: var(--transition);
        }

        .modal-close:hover {
            background: var(--hover-color);
            color: var(--text-primary);
        }

        .modal-body {
            padding: 24px;
        }

        .modal-footer {
            padding: 20px 24px;
            border-top: 1px solid var(--border-color);
            display: flex;
            gap: 12px;
            justify-content: flex-end;
        }

        .form-help {
            font-size: 12px;
            color: var(--text-muted);
            margin-top: 4px;
        }
    `;

    if (!document.querySelector('#modal-styles')) {
        style.id = 'modal-styles';
        document.head.appendChild(style);
    }

    return modal;
}

function editUser(userId) {
    const user = users.find(u => u.id === userId);
    if (user) {
        showNotification(`Editing user: ${user.firstName} ${user.lastName}`, 'info');

        // Create modal for editing user
        const modal = createUserModal(user);
        document.body.appendChild(modal);

        // Show modal with animation
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }
}

// Close modal
function closeModal(element) {
    const modal = element.closest('.modal-overlay');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }
}

// Save user (create or update)
function saveUser(userId = null) {
    const form = document.getElementById('userForm');
    if (!form) return;

    // Get form data
    const formData = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        username: document.getElementById('username').value.trim(),
        email: document.getElementById('email').value.trim(),
        role: document.getElementById('role').value,
        isActive: document.getElementById('status').value === 'active',
        mfaEnabled: document.getElementById('mfaEnabled').checked
    };

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.username || !formData.email || !formData.role) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    if (!userId) {
        // Creating new user
        const tempPassword = document.getElementById('tempPassword').value.trim();
        if (!tempPassword) {
            showNotification('Please provide a temporary password', 'error');
            return;
        }

        // Check if username already exists
        if (users.some(u => u.username === formData.username)) {
            showNotification('Username already exists', 'error');
            return;
        }

        // Create new user
        const newUser = {
            ...formData,
            id: `user${Date.now()}`,
            passwordHash: `hashed_${tempPassword}`, // In real app, this would be properly hashed
            lastLogin: null,
            accountLocked: false,
            failedLoginAttempts: 0,
            passwordLastChanged: new Date().toISOString(),
            mfaMethod: formData.mfaEnabled ? 'app' : null
        };

        users.push(newUser);
        filteredUsers = [...users];

        // Save to security service if available
        if (typeof SecurityService !== 'undefined') {
            SecurityService.createUser(newUser);
        }

        showNotification(`User ${formData.firstName} ${formData.lastName} created successfully`, 'success');
    } else {
        // Updating existing user
        const userIndex = users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...formData };

            // Update in security service if available
            if (typeof SecurityService !== 'undefined') {
                SecurityService.updateUser(users[userIndex]);
            }

            showNotification(`User ${formData.firstName} ${formData.lastName} updated successfully`, 'success');
        }
    }

    // Update display
    updateUsersDisplay();
    updateUsersCount();

    // Close modal
    closeModal(document.querySelector('.modal-overlay'));
}

function resetPassword(userId) {
    const user = users.find(u => u.id === userId);
    if (user) {
        if (confirm(`Reset password for ${user.firstName} ${user.lastName}?`)) {
            showNotification(`Password reset for ${user.firstName} ${user.lastName}`, 'success');
            // TODO: Implement password reset
            console.log('Reset password for user:', user);
        }
    }
}

function toggleUserStatus(userId) {
    const user = users.find(u => u.id === userId);
    if (user) {
        const newStatus = !user.isActive;
        const action = newStatus ? 'activated' : 'deactivated';

        if (confirm(`${newStatus ? 'Activate' : 'Deactivate'} user ${user.firstName} ${user.lastName}?`)) {
            user.isActive = newStatus;

            // Update in security service if available
            if (typeof SecurityService !== 'undefined') {
                SecurityService.updateUser(user);
            }

            updateUsersDisplay();
            showNotification(`User ${action} successfully`, 'success');
        }
    }
}

function deleteUser(userId) {
    const user = users.find(u => u.id === userId);
    if (user) {
        if (confirm(`Delete user ${user.firstName} ${user.lastName}? This action cannot be undone.`)) {
            // Remove from users array
            users = users.filter(u => u.id !== userId);
            filteredUsers = filteredUsers.filter(u => u.id !== userId);

            updateUsersDisplay();
            updateUsersCount();
            showNotification(`User deleted successfully`, 'success');
        }
    }
}

// Header actions
function refreshUsers() {
    showNotification('Refreshing users...', 'info');
    loadUsers();
}

function exportUsers() {
    showNotification('Exporting users...', 'info');
    // TODO: Implement export functionality
    console.log('Export users');
}

function toggleFilters() {
    showNotification('Filters coming soon!', 'info');
    // TODO: Implement filters panel
    console.log('Toggle filters');
}

// Utility functions
function showNotification(message, type = 'info') {
    console.log(`${type.toUpperCase()}: ${message}`);

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${type === 'success' ? '#059669' : type === 'error' ? '#dc2626' : '#2563eb'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function goBack() {
    console.log('Back button clicked');

    // Try multiple navigation methods
    try {
        // First try to go to party-details-advanced.html (main page)
        if (document.referrer && document.referrer.includes('party-details-advanced.html')) {
            window.location.href = 'party-details-advanced.html';
            return;
        }

        // Try NavigationUtils if available
        if (typeof NavigationUtils !== 'undefined' && NavigationUtils.goBack) {
            NavigationUtils.goBack();
            return;
        }

        // Check if there's history to go back to
        if (window.history.length > 1) {
            window.history.back();
        } else {
            // Fallback to main page
            window.location.href = 'party-details-advanced.html';
        }
    } catch (error) {
        console.error('Error navigating back:', error);
        // Final fallback
        window.location.href = 'party-details-advanced.html';
    }
}
