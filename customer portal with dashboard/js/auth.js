/**
 * Authentication Module
 * Handles user authentication, registration, and session management
 */

// Get users from localStorage or use default if none exist
let users = JSON.parse(localStorage.getItem('users')) || [
    
    {
        id: 2,
        email: 'user@example.com',
        password: 'user123',
        name: 'Jane Smith',
        role: 'user',
        created: new Date().toISOString(),
        lastLogin: null
    }
];

// Save users to localStorage
function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

// Initialize users if they don't exist
if (!localStorage.getItem('users')) {
    saveUsers();
}

// Current user session
let currentUser = null;

// Check if user is already logged in (from localStorage)
function checkAuth() {
    try {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);

            // Validate user data
            if (!currentUser || !currentUser.id || !currentUser.email || !currentUser.name) {
                console.warn('Invalid user data in localStorage, clearing session');
                handleLogout();
                return;
            }

            console.log('User already logged in:', currentUser.name);

            // Store user ID for later use
            localStorage.setItem('lastUserId', currentUser.id);

            // Show portal interface
            showPortal();
            updateUserInfo();
            setRoleBasedAccess();

            // Set up logout buttons
            setupLogoutButtons();
        } else {
            console.log('No user logged in, showing login form');
            setupAuthForms();
        }
    } catch (error) {
        console.error('Error checking authentication:', error);
        handleLogout();
    }
}

// Set up authentication forms and event listeners
function setupAuthForms() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Register link
    const registerLink = document.getElementById('register-link');
    if (registerLink) {
        registerLink.addEventListener('click', function(e) {
            e.preventDefault();
            showRegisterForm();
        });
    }

    // Forgot password link
    const forgotPasswordLink = document.getElementById('forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            showForgotPasswordForm();
        });
    }

    // Set up logout buttons
    setupLogoutButtons();
}

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Find user
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Update last login
        user.lastLogin = new Date().toISOString();
        saveUsers();

        // Create a copy without the password for security
        const userSession = { ...user };
        delete userSession.password;

        // Save to session
        currentUser = userSession;
        localStorage.setItem('currentUser', JSON.stringify(userSession));

        // Store user ID for later use (e.g., for clearing data on logout)
        localStorage.setItem('lastUserId', user.id);

        // Show success message
        showNotification('Login successful! Welcome back, ' + user.name, 'success');

        // Show portal
        showPortal();
        updateUserInfo();
        setRoleBasedAccess();

        // Set up logout buttons again to ensure they work
        setupLogoutButtons();
    } else {
        showNotification('Invalid email or password', 'error');
    }
}

// Handle logout
function handleLogout(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    console.log('Logout function called');

    // Clear all session data
    currentUser = null;
    localStorage.removeItem('currentUser');

    // Clear any other user-specific data
    const userId = localStorage.getItem('lastUserId');
    if (userId) {
        localStorage.removeItem(`preferences_${userId}`);
        localStorage.removeItem(`notifications_${userId}`);
        localStorage.removeItem(`tickets_${userId}`);
        localStorage.removeItem(`documents_${userId}`);
    }

    // Show success message
    showNotification('You have been logged out successfully', 'success');

    // Show login form if we're on the main page
    const loginContainer = document.getElementById('login-container');
    const portalContainer = document.getElementById('portal-container');

    if (loginContainer && portalContainer) {
        showLogin();
    }

    // If we're on a subpage, redirect to the main page
    if (window.location.pathname.includes('/pages/')) {
        console.log('Redirecting to main page...');
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1000);
    } else if (!loginContainer || !portalContainer) {
        // If we're on a page without login/portal containers, redirect to index
        console.log('No login container found, redirecting to index...');
        setTimeout(() => {
            window.location.href = window.location.pathname.includes('/pages/') ? '../index.html' : 'index.html';
        }, 1000);
    }
}

// Show registration form
function showRegisterForm() {
    // Create registration form HTML
    const registrationHTML = `
        <div class="login-form">
            <div class="logo">
                <h1>Customer<span>Portal</span></h1>
            </div>
            <h2>Create Account</h2>
            <form id="register-form">
                <div class="form-group">
                    <label for="reg-name">Full Name</label>
                    <input type="text" id="reg-name" required>
                </div>
                <div class="form-group">
                    <label for="reg-email">Email</label>
                    <input type="email" id="reg-email" required>
                </div>
                <div class="form-group">
                    <label for="reg-password">Password</label>
                    <input type="password" id="reg-password" required>
                </div>
                <div class="form-group">
                    <label for="reg-confirm-password">Confirm Password</label>
                    <input type="password" id="reg-confirm-password" required>
                </div>
                <div class="form-group">
                    <button type="submit" class="btn-primary">Create Account</button>
                </div>
                <div class="form-footer">
                    <a href="#" id="back-to-login">Back to Login</a>
                </div>
            </form>
        </div>
    `;

    // Replace login form with registration form
    document.querySelector('.login-form').outerHTML = registrationHTML;

    // Add event listener to registration form
    document.getElementById('register-form').addEventListener('submit', handleRegistration);

    // Add event listener to back to login link
    document.getElementById('back-to-login').addEventListener('click', function(e) {
        e.preventDefault();
        window.location.reload(); // Reload page to show login form
    });
}

// Handle registration form submission
function handleRegistration(e) {
    e.preventDefault();

    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;

    // Validate form
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    // Check if email already exists
    if (users.some(u => u.email === email)) {
        showNotification('Email already registered', 'error');
        return;
    }

    // Create new user
    const newUser = {
        id: users.length + 1,
        email: email,
        password: password,
        name: name,
        role: 'user', // Default role
        created: new Date().toISOString(),
        lastLogin: new Date().toISOString()
    };

    // Add user to users array
    users.push(newUser);
    saveUsers();

    // Create a copy without the password for security
    const userSession = { ...newUser };
    delete userSession.password;

    // Save to session
    currentUser = userSession;
    localStorage.setItem('currentUser', JSON.stringify(userSession));

    // Store user ID for later use
    localStorage.setItem('lastUserId', newUser.id);

    // Show success message
    showNotification('Account created successfully! Welcome, ' + name, 'success');

    // Show portal
    showPortal();
    updateUserInfo();
    setRoleBasedAccess();

    // Set up logout buttons
    setupLogoutButtons();
}

// Show forgot password form
function showForgotPasswordForm() {
    // Create forgot password form HTML
    const forgotPasswordHTML = `
        <div class="login-form">
            <div class="logo">
                <h1>Customer<span>Portal</span></h1>
            </div>
            <h2>Reset Password</h2>
            <form id="forgot-password-form">
                <div class="form-group">
                    <label for="reset-email">Email</label>
                    <input type="email" id="reset-email" required>
                </div>
                <div class="form-group">
                    <button type="submit" class="btn-primary">Send Reset Link</button>
                </div>
                <div class="form-footer">
                    <a href="#" id="back-to-login">Back to Login</a>
                </div>
            </form>
        </div>
    `;

    // Replace login form with forgot password form
    document.querySelector('.login-form').outerHTML = forgotPasswordHTML;

    // Add event listener to forgot password form
    document.getElementById('forgot-password-form').addEventListener('submit', handleForgotPassword);

    // Add event listener to back to login link
    document.getElementById('back-to-login').addEventListener('click', function(e) {
        e.preventDefault();
        window.location.reload(); // Reload page to show login form
    });
}

// Handle forgot password form submission
function handleForgotPassword(e) {
    e.preventDefault();

    const email = document.getElementById('reset-email').value;

    // Check if email exists
    const user = users.find(u => u.email === email);

    if (user) {
        // In a real app, this would send an email with a reset link
        // For demo purposes, we'll just show a success message
        showNotification('Password reset link sent to ' + email, 'success');

        // Show reset password form (for demo purposes)
        showResetPasswordForm(user.id);
    } else {
        showNotification('Email not found', 'error');
    }
}

// Show reset password form
function showResetPasswordForm(userId) {
    // Create reset password form HTML
    const resetPasswordHTML = `
        <div class="login-form">
            <div class="logo">
                <h1>Customer<span>Portal</span></h1>
            </div>
            <h2>Create New Password</h2>
            <form id="reset-password-form">
                <input type="hidden" id="user-id" value="${userId}">
                <div class="form-group">
                    <label for="new-password">New Password</label>
                    <input type="password" id="new-password" required>
                </div>
                <div class="form-group">
                    <label for="confirm-new-password">Confirm New Password</label>
                    <input type="password" id="confirm-new-password" required>
                </div>
                <div class="form-group">
                    <button type="submit" class="btn-primary">Reset Password</button>
                </div>
                <div class="form-footer">
                    <a href="#" id="back-to-login">Back to Login</a>
                </div>
            </form>
        </div>
    `;

    // Replace forgot password form with reset password form
    document.querySelector('.login-form').outerHTML = resetPasswordHTML;

    // Add event listener to reset password form
    document.getElementById('reset-password-form').addEventListener('submit', handleResetPassword);

    // Add event listener to back to login link
    document.getElementById('back-to-login').addEventListener('click', function(e) {
        e.preventDefault();
        window.location.reload(); // Reload page to show login form
    });
}

// Handle reset password form submission
function handleResetPassword(e) {
    e.preventDefault();

    const userId = parseInt(document.getElementById('user-id').value);
    const newPassword = document.getElementById('new-password').value;
    const confirmNewPassword = document.getElementById('confirm-new-password').value;

    // Validate form
    if (newPassword !== confirmNewPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    // Find user
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex !== -1) {
        // Update password
        users[userIndex].password = newPassword;
        saveUsers();

        // Show success message
        showNotification('Password reset successfully', 'success');

        // Reload page to show login form
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    } else {
        showNotification('User not found', 'error');
    }
}

// Show portal interface
function showPortal() {
    const loginContainer = document.getElementById('login-container');
    const portalContainer = document.getElementById('portal-container');

    if (loginContainer && portalContainer) {
        loginContainer.style.display = 'none';
        portalContainer.style.display = 'block';
        console.log('Portal interface shown');
    } else {
        console.warn('Login or portal container not found');
    }
}

// Show login interface
function showLogin() {
    const loginContainer = document.getElementById('login-container');
    const portalContainer = document.getElementById('portal-container');

    if (loginContainer && portalContainer) {
        portalContainer.style.display = 'none';
        loginContainer.style.display = 'flex';
        console.log('Login interface shown');
    } else {
        console.warn('Login or portal container not found');
    }
}

// Update user information in the UI
function updateUserInfo() {
    if (!currentUser) return;

    const userNameElements = document.querySelectorAll('.user-name');
    const userRoleElements = document.querySelectorAll('.user-role');

    userNameElements.forEach(el => {
        if (el) el.textContent = currentUser.name;
    });

    userRoleElements.forEach(el => {
        if (el) el.textContent = currentUser.role;
    });
}

// Set access based on user role
function setRoleBasedAccess() {
    if (!currentUser) return;

    const adminElements = document.querySelectorAll('.admin-only');

    if (currentUser.role === 'admin') {
        adminElements.forEach(el => el.style.display = 'block');
    } else {
        adminElements.forEach(el => el.style.display = 'none');
    }
}

// Show notification
function showNotification(message, type = 'info') {
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

// Set up logout buttons
function setupLogoutButtons() {
    // Find all logout buttons
    const logoutButtons = document.querySelectorAll('#logout-btn, .btn-secondary[id="logout-btn"], button[id="logout-btn"], a[id="logout-btn"]');

    // Add event listener to each button
    logoutButtons.forEach(btn => {
        // Remove any existing event listeners
        btn.removeEventListener('click', handleLogout);

        // Add new event listener
        btn.addEventListener('click', handleLogout);
    });

    console.log('Logout buttons set up:', logoutButtons.length);
}

// Initialize authentication
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();

    // Set up logout buttons again after DOM is loaded
    // This ensures buttons are set up even if they're added dynamically
    setupLogoutButtons();

    // Set up a MutationObserver to detect DOM changes and set up logout buttons again
    const observer = new MutationObserver(function() {
        setupLogoutButtons();
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, { childList: true, subtree: true });
});
