document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.querySelector('.toggle-password');
    const themeToggle = document.getElementById('themeToggle');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');

    // Add login-page class to body for specific styling
    document.body.classList.add('login-page');

    // Always set dark theme
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i><span class="theme-toggle-text">Light Mode</span>';

    // Auto-fill credentials
    usernameInput.value = 'admin';
    passwordInput.value = 'admin123';

    // Toggle password visibility
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

    // Toggle theme (dark/light mode) but keep dark as default
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // Update button text and icon
        if (newTheme === 'dark') {
            this.innerHTML = '<i class="fas fa-sun"></i><span class="theme-toggle-text">Light Mode</span>';
        } else {
            this.innerHTML = '<i class="fas fa-moon"></i><span class="theme-toggle-text">Dark Mode</span>';
        }
    });

    // Sample admin credentials (in a real app, this would be handled server-side)
    const validCredentials = {
        username: 'admin',
        password: 'admin123'
    };

    // Show notification
    function showNotification(message, type = 'error') {
        notificationMessage.textContent = message;
        notification.style.background = type === 'error' ? 'var(--error-color)' :
                                        type === 'success' ? 'var(--success-color)' :
                                        type === 'warning' ? 'var(--warning-color)' :
                                        'var(--info-color)';
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // Handle form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        const loginBtn = document.querySelector('.login-btn');

        // Disable button and show loading state
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Logging in...</span>';

        // Simulate server validation
        setTimeout(() => {
            // Check credentials
            if (username === validCredentials.username && password === validCredentials.password) {
                // Show success notification
                showNotification('Login successful!', 'success');

                // Store login state
                sessionStorage.setItem('userLoggedIn', 'true');

                // Reset form after successful login
                setTimeout(() => {
                    window.location.href = 'Admindashboard.html'; // Replace 'dashboard.html' with your target page
                    // loginBtn.disabled = false;
                    // loginBtn.innerHTML = '<span>Admin Login</span><i class="fas fa-arrow-right"></i>';
                    // loginForm.reset();
                }, 2000);
            } else {
                // Show error notification
                showNotification('Invalid username or password. Please try again.', 'error');

                // Reset button
                loginBtn.disabled = false;
                loginBtn.innerHTML = '<span>Admin Login</span><i class="fas fa-arrow-right"></i>';
            }
        }, 1500);
    });

    // Add focus effects to input fields
    const inputIcons = document.querySelectorAll('.input-icon');

    inputIcons.forEach(icon => {
        const input = icon.querySelector('input');

        input.addEventListener('focus', () => {
            icon.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            icon.classList.remove('focused');
        });
    });
});
