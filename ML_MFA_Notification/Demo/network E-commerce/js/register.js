// Registration page functionality
document.addEventListener('DOMContentLoaded', function() {
    // API Configuration
    const API_URL = 'http://localhost:5000/api';
    
    // Theme Switcher Functionality
    const themeToggle = document.getElementById('theme-toggle');
    const themeOptions = document.getElementById('theme-options');
    const themeOptionElements = document.querySelectorAll('.theme-option');

    // Apply theme function
    function applyTheme(theme) {
        // First, remove all theme classes
        document.body.classList.remove('theme-light', 'theme-blue', 'theme-purple', 'theme-green');

        // Then add the selected theme class if it's not the default dark theme
        if (theme) {
            document.body.classList.add(theme);
        }

        // Update active state in theme options
        themeOptionElements.forEach(option => {
            option.classList.remove('active');
            if (option.getAttribute('data-theme') === theme) {
                option.classList.add('active');
            }
        });

        // Save theme preference
        localStorage.setItem('login-theme', theme || '');
    }

    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('login-theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    }

    // Toggle theme options panel
    themeToggle.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent event from bubbling up
        themeOptions.classList.toggle('show');
    });

    // Close theme options when clicking outside
    document.addEventListener('click', function(event) {
        if (!themeOptions.contains(event.target)) {
            themeOptions.classList.remove('show');
        }
    });

    // Theme selection
    themeOptionElements.forEach(option => {
        option.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            applyTheme(theme);
            themeOptions.classList.remove('show');
        });
    });

    // Password Toggle Functionality
    const togglePassword = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');
    const toggleConfirmPassword = document.getElementById('toggle-confirm-password');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    // Toggle password visibility
    function togglePasswordVisibility(passwordField, toggleButton) {
        if (passwordField && toggleButton) {
            toggleButton.addEventListener('click', function() {
                const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordField.setAttribute('type', type);
                
                // Toggle eye icon
                const icon = this.querySelector('i');
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            });
        }
    }

    togglePasswordVisibility(passwordInput, togglePassword);
    togglePasswordVisibility(confirmPasswordInput, toggleConfirmPassword);

    // Password Strength Checker
    const strengthBar = document.getElementById('strength-bar');
    const strengthText = document.getElementById('strength-text');
    const passwordStrengthContainer = document.getElementById('password-strength-container');

    // Password requirements elements
    const reqLength = document.getElementById('req-length');
    const reqUppercase = document.getElementById('req-uppercase');
    const reqLowercase = document.getElementById('req-lowercase');
    const reqNumber = document.getElementById('req-number');
    const reqSpecial = document.getElementById('req-special');

    // Check password strength
    function checkPasswordStrength(password) {
        // Show password strength container when user starts typing
        if (password.length > 0) {
            passwordStrengthContainer.style.display = 'block';
        } else {
            passwordStrengthContainer.style.display = 'none';
            return;
        }

        // Check requirements
        const hasLength = password.length >= 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[^A-Za-z0-9]/.test(password);

        // Update requirement indicators
        updateRequirement(reqLength, hasLength);
        updateRequirement(reqUppercase, hasUppercase);
        updateRequirement(reqLowercase, hasLowercase);
        updateRequirement(reqNumber, hasNumber);
        updateRequirement(reqSpecial, hasSpecial);

        // Calculate strength score (0-4)
        let strength = 0;
        if (hasLength) strength++;
        if (hasUppercase) strength++;
        if (hasLowercase) strength++;
        if (hasNumber) strength++;
        if (hasSpecial) strength++;

        // Update strength bar and text
        strengthBar.className = 'strength-bar';
        
        if (strength === 0) {
            strengthBar.style.width = '0%';
            strengthText.textContent = 'None';
        } else if (strength === 1) {
            strengthBar.classList.add('weak');
            strengthText.textContent = 'Weak';
            strengthText.style.color = 'var(--login-error)';
        } else if (strength === 2) {
            strengthBar.classList.add('medium');
            strengthText.textContent = 'Medium';
            strengthText.style.color = 'var(--login-warning)';
        } else if (strength === 3) {
            strengthBar.classList.add('strong');
            strengthText.textContent = 'Strong';
            strengthText.style.color = 'var(--login-info)';
        } else {
            strengthBar.classList.add('very-strong');
            strengthText.textContent = 'Very Strong';
            strengthText.style.color = 'var(--login-success)';
        }

        return strength;
    }

    // Update requirement indicator
    function updateRequirement(element, isMet) {
        if (isMet) {
            element.classList.add('met');
            element.querySelector('i').className = 'fas fa-check';
        } else {
            element.classList.remove('met');
            element.querySelector('i').className = 'fas fa-times';
        }
    }

    // Check password strength on input
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            checkPasswordStrength(this.value);
        });
    }

    // Registration form submission
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const terms = document.getElementById('terms').checked;
            
            // Validate form
            if (!firstName || !lastName || !email || !password || !confirmPassword) {
                showNotification('error', 'Missing Fields', 'Please fill in all required fields.');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('error', 'Invalid Email', 'Please enter a valid email address.');
                return;
            }
            
            const passwordStrength = checkPasswordStrength(password);
            if (passwordStrength < 3) {
                showNotification('error', 'Weak Password', 'Please create a stronger password.');
                return;
            }
            
            if (password !== confirmPassword) {
                showNotification('error', 'Passwords Don\'t Match', 'Your passwords do not match. Please try again.');
                return;
            }
            
            if (!terms) {
                showNotification('error', 'Terms Required', 'You must agree to the Terms & Conditions.');
                return;
            }
            
            // Submit registration to backend
            const registerButton = this.querySelector('button[type="submit"]');
            registerButton.textContent = 'Creating Account...';
            registerButton.disabled = true;
            
            fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Store token and user info
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    
                    showNotification('success', 'Registration Successful', 'Your account has been created successfully!');
                    
                    // Redirect to home page
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                } else {
                    showNotification('error', 'Registration Failed', data.message || 'An error occurred during registration.');
                    registerButton.textContent = 'Create Account';
                    registerButton.disabled = false;
                }
            })
            .catch(error => {
                console.error('Registration error:', error);
                showNotification('error', 'Registration Failed', 'A network error occurred. Please try again.');
                registerButton.textContent = 'Create Account';
                registerButton.disabled = false;
            });
        });
    }

    // Helper function to validate email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Notification system
    function showNotification(type, title, message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        // Set notification content
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas ${getIconForType(type)}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add notification to DOM
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Set up close button
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
    
    // Helper function to get icon for notification type
    function getIconForType(type) {
        switch (type) {
            case 'success':
                return 'fa-check-circle';
            case 'error':
                return 'fa-exclamation-circle';
            case 'warning':
                return 'fa-exclamation-triangle';
            case 'info':
                return 'fa-info-circle';
            default:
                return 'fa-info-circle';
        }
    }
});
