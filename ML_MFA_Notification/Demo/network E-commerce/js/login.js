// Login page functionality
document.addEventListener('DOMContentLoaded', function() {
    // API Configuration
    const API_URL = 'http://localhost:5000/api';

    // Flag to determine if we should use the backend or fallback to local storage
    let useBackend = true;

    // Account Lockout Configuration
    const MAX_LOGIN_ATTEMPTS = 3; // Maximum number of failed login attempts before lockout
    const LOCKOUT_DURATION = 5 * 60; // Lockout duration in seconds (5 minutes)

    // Check if backend is available
    function checkBackendAvailability() {
        return fetch(`${API_URL}/auth`, { method: 'GET' })
            .then(response => {
                useBackend = true;
                console.log('Backend is available');
                return true;
            })
            .catch(error => {
                useBackend = false;
                console.log('Backend is not available, using local storage fallback');
                return false;
            });
    }

    // Initialize by checking backend availability
    checkBackendAvailability();

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
    const toggleNewPassword = document.getElementById('toggle-new-password');
    const newPasswordInput = document.getElementById('new-password');
    const toggleConfirmPassword = document.getElementById('toggle-confirm-password');
    const confirmPasswordInput = document.getElementById('confirm-password');

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
    togglePasswordVisibility(newPasswordInput, toggleNewPassword);
    togglePasswordVisibility(confirmPasswordInput, toggleConfirmPassword);

    // Password Strength Checker
    const strengthBar = document.getElementById('strength-bar');
    const strengthText = document.getElementById('strength-text');
    const passwordStrengthContainer = document.getElementById('password-strength-container');
    const newStrengthBar = document.getElementById('new-strength-bar');
    const newStrengthText = document.getElementById('new-strength-text');
    const newPasswordStrengthContainer = document.getElementById('new-password-strength-container');

    // Password requirements elements
    const reqLength = document.getElementById('req-length');
    const reqUppercase = document.getElementById('req-uppercase');
    const reqLowercase = document.getElementById('req-lowercase');
    const reqNumber = document.getElementById('req-number');
    const reqSpecial = document.getElementById('req-special');

    // New password requirements elements
    const newReqLength = document.getElementById('new-req-length');
    const newReqUppercase = document.getElementById('new-req-uppercase');
    const newReqLowercase = document.getElementById('new-req-lowercase');
    const newReqNumber = document.getElementById('new-req-number');
    const newReqSpecial = document.getElementById('new-req-special');

    // Check password strength
    function checkPasswordStrength(password, strengthBar, strengthText, reqLength, reqUppercase, reqLowercase, reqNumber, reqSpecial) {
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
            checkPasswordStrength(
                this.value,
                strengthBar,
                strengthText,
                reqLength,
                reqUppercase,
                reqLowercase,
                reqNumber,
                reqSpecial
            );
        });
    }

    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', function() {
            // Show password strength container when user starts typing
            if (this.value.length > 0) {
                newPasswordStrengthContainer.style.display = 'block';
            } else {
                newPasswordStrengthContainer.style.display = 'none';
                return;
            }

            checkPasswordStrength(
                this.value,
                newStrengthBar,
                newStrengthText,
                newReqLength,
                newReqUppercase,
                newReqLowercase,
                newReqNumber,
                newReqSpecial
            );
        });
    }

    // Forgot Password Modal
    const forgotPasswordLink = document.getElementById('forgot-password');
    const forgotPasswordModal = document.getElementById('forgot-password-modal');
    const closeForgotModal = document.getElementById('close-forgot-modal');
    const forgotStep1 = document.getElementById('forgot-step-1');
    const forgotStep2 = document.getElementById('forgot-step-2');
    const forgotStep3 = document.getElementById('forgot-step-3');
    const sendCodeBtn = document.getElementById('send-code-btn');
    const verifyCodeBtn = document.getElementById('verify-code-btn');
    const resetPasswordBtn = document.getElementById('reset-password-btn');
    const resendCodeBtn = document.getElementById('resend-code-btn');
    const timerCount = document.getElementById('timer-count');
    const otpInputs = document.querySelectorAll('.otp-input');

    // Open forgot password modal
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            forgotPasswordModal.classList.add('active');
            // Reset to step 1
            showForgotStep(1);
        });
    }

    // Close forgot password modal
    if (closeForgotModal) {
        closeForgotModal.addEventListener('click', function() {
            forgotPasswordModal.classList.remove('active');
        });
    }

    // Show specific step in forgot password flow
    function showForgotStep(step) {
        forgotStep1.classList.remove('active');
        forgotStep2.classList.remove('active');
        forgotStep3.classList.remove('active');

        if (step === 1) {
            forgotStep1.classList.add('active');
        } else if (step === 2) {
            forgotStep2.classList.add('active');
            startResendTimer();
        } else if (step === 3) {
            forgotStep3.classList.add('active');
        }
    }

    // Send password reset email
    if (sendCodeBtn) {
        sendCodeBtn.addEventListener('click', function() {
            const recoveryEmail = document.getElementById('recovery-email').value;

            // Validate email
            if (!recoveryEmail || !isValidEmail(recoveryEmail)) {
                showNotification('error', 'Invalid Email', 'Please enter a valid email address.');
                return;
            }

            // Update UI
            this.textContent = 'Sending...';
            this.disabled = true;

            if (useBackend) {
                // Send request to backend
                fetch(`${API_URL}/auth/forgotpassword`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: recoveryEmail })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        showNotification('success', 'Email Sent', 'A password reset link has been sent to your email.');
                        showForgotStep(2);
                    } else {
                        showNotification('error', 'Error', data.message || 'Failed to send reset email.');
                    }
                    this.textContent = 'Send Code';
                    this.disabled = false;
                })
                .catch(error => {
                    console.error('Password reset error:', error);
                    // Switch to local storage fallback
                    useBackend = false;
                    handleLocalPasswordReset(recoveryEmail, this);
                });
            } else {
                // Use local storage fallback
                handleLocalPasswordReset(recoveryEmail, this);
            }

            // Function to handle password reset with local storage
            function handleLocalPasswordReset(email, button) {
                // Get demo users from local storage
                const demoUsers = JSON.parse(localStorage.getItem('demoUsers') || '[]');

                // Check if user exists
                const userExists = demoUsers.some(u => u.email === email);

                if (userExists) {
                    // Generate a demo verification code
                    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

                    // Store the code in session storage
                    sessionStorage.setItem('resetCode', verificationCode);
                    sessionStorage.setItem('resetEmail', email);

                    // In a real app, this would send an email
                    console.log(`Demo verification code for ${email}: ${verificationCode}`);

                    // Show success message
                    showNotification('success', 'Code Generated',
                        `For demo purposes, your verification code is: ${verificationCode}`);

                    // Move to next step
                    showForgotStep(2);
                } else {
                    // User doesn't exist, but we don't want to reveal that for security
                    showNotification('success', 'If your email exists in our system, a verification code has been sent.');
                    showForgotStep(2);
                }

                // Reset button
                button.textContent = 'Send Code';
                button.disabled = false;
            }
        });
    }

    // Verify code
    if (verifyCodeBtn) {
        verifyCodeBtn.addEventListener('click', function() {
            // Get OTP code
            let otpCode = '';
            otpInputs.forEach(input => {
                otpCode += input.value;
            });

            // Validate OTP
            if (otpCode.length !== 6 || !/^\d+$/.test(otpCode)) {
                showNotification('error', 'Invalid Code', 'Please enter a valid 6-digit verification code.');
                return;
            }

            // Update UI
            this.textContent = 'Verifying...';
            this.disabled = true;

            if (useBackend) {
                // In a real implementation, we would verify the code with the backend
                // For demo purposes, we'll just simulate a successful verification
                setTimeout(() => {
                    showNotification('success', 'Code Verified', 'Your verification code has been verified.');
                    showForgotStep(3);
                    this.textContent = 'Verify Code';
                    this.disabled = false;

                    // Store a demo reset token
                    sessionStorage.setItem('resetToken', 'demo-reset-token-' + Date.now());
                }, 1500);
            } else {
                // Use local storage fallback
                const storedCode = sessionStorage.getItem('resetCode');

                if (storedCode && storedCode === otpCode) {
                    // Code matches
                    showNotification('success', 'Code Verified', 'Your verification code has been verified.');
                    showForgotStep(3);

                    // Generate a demo reset token
                    sessionStorage.setItem('resetToken', 'demo-reset-token-' + Date.now());
                } else {
                    // Code doesn't match
                    showNotification('error', 'Invalid Code', 'The verification code you entered is incorrect. Please try again.');
                }

                this.textContent = 'Verify Code';
                this.disabled = false;
            }
        });
    }

    // Reset password
    if (resetPasswordBtn) {
        resetPasswordBtn.addEventListener('click', function() {
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const recoveryEmail = document.getElementById('recovery-email').value || sessionStorage.getItem('resetEmail');

            // Get reset token from session storage
            const resetToken = sessionStorage.getItem('resetToken') || 'demo-reset-token';

            // Validate passwords
            if (!newPassword || newPassword.length < 8) {
                showNotification('error', 'Invalid Password', 'Password must be at least 8 characters long.');
                return;
            }

            if (newPassword !== confirmPassword) {
                showNotification('error', 'Passwords Don\'t Match', 'Your passwords do not match. Please try again.');
                return;
            }

            // Update UI
            this.textContent = 'Resetting...';
            this.disabled = true;

            if (useBackend) {
                // Send request to backend
                fetch(`${API_URL}/auth/resetpassword/${resetToken}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        password: newPassword
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Reset failed login attempts and unlock account
                        resetFailedAttempts(recoveryEmail);

                        showNotification('success', 'Password Reset', 'Your password has been reset successfully. You can now login with your new password.');
                        forgotPasswordModal.classList.remove('active');

                        // Clear any stored reset token
                        sessionStorage.removeItem('resetToken');
                        sessionStorage.removeItem('resetCode');
                        sessionStorage.removeItem('resetEmail');
                    } else {
                        showNotification('error', 'Reset Failed', data.message || 'Failed to reset password.');
                    }
                    this.textContent = 'Reset Password';
                    this.disabled = false;
                })
                .catch(error => {
                    console.error('Password reset error:', error);
                    // Switch to local storage fallback
                    useBackend = false;
                    handleLocalPasswordUpdate(recoveryEmail, newPassword, this);
                });
            } else {
                // Use local storage fallback
                handleLocalPasswordUpdate(recoveryEmail, newPassword, this);
            }

            // Function to handle password update with local storage
            function handleLocalPasswordUpdate(email, newPassword, button) {
                // Get demo users from local storage
                const demoUsers = JSON.parse(localStorage.getItem('demoUsers') || '[]');

                // Find the user
                const userIndex = demoUsers.findIndex(u => u.email === email);

                if (userIndex !== -1) {
                    // Update the password
                    demoUsers[userIndex].password = newPassword;

                    // Save back to local storage
                    localStorage.setItem('demoUsers', JSON.stringify(demoUsers));

                    // Reset failed login attempts
                    resetFailedAttempts(email);

                    showNotification('success', 'Password Reset', 'Your password has been reset successfully. You can now login with your new password.');
                } else {
                    // This shouldn't happen in normal flow, but just in case
                    showNotification('error', 'User Not Found', 'We couldn\'t find your account. Please try the registration process.');
                }

                // Close modal and reset UI
                forgotPasswordModal.classList.remove('active');
                button.textContent = 'Reset Password';
                button.disabled = false;

                // Clear session storage
                sessionStorage.removeItem('resetToken');
                sessionStorage.removeItem('resetCode');
                sessionStorage.removeItem('resetEmail');
            }
        });
    }

    // OTP input handling
    otpInputs.forEach(input => {
        input.addEventListener('keyup', function(e) {
            const index = parseInt(this.getAttribute('data-index'));

            // If a digit is entered, move to next input
            if (this.value.length === 1 && /^\d$/.test(this.value)) {
                if (index < 6) {
                    const nextInput = document.querySelector(`.otp-input[data-index="${index + 1}"]`);
                    if (nextInput) nextInput.focus();
                }
            }

            // If backspace is pressed, move to previous input
            if (e.key === 'Backspace' && this.value.length === 0) {
                if (index > 1) {
                    const prevInput = document.querySelector(`.otp-input[data-index="${index - 1}"]`);
                    if (prevInput) prevInput.focus();
                }
            }
        });

        // Ensure only digits are entered
        input.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '');
        });
    });

    // Resend timer
    let resendTimer;
    function startResendTimer() {
        let seconds = 60;
        timerCount.textContent = seconds;
        resendCodeBtn.classList.add('disabled');

        clearInterval(resendTimer);
        resendTimer = setInterval(() => {
            seconds--;
            timerCount.textContent = seconds;

            if (seconds <= 0) {
                clearInterval(resendTimer);
                document.getElementById('resend-timer').style.display = 'none';
                resendCodeBtn.classList.remove('disabled');
            }
        }, 1000);
    }

    // Resend code
    if (resendCodeBtn) {
        resendCodeBtn.addEventListener('click', function(e) {
            e.preventDefault();

            if (this.classList.contains('disabled')) {
                return;
            }

            // Simulate resending code
            this.textContent = 'Sending...';

            setTimeout(() => {
                showNotification('success', 'Code Resent', 'A new verification code has been sent to your email.');
                this.textContent = 'Resend Code';
                document.getElementById('resend-timer').style.display = 'inline';
                startResendTimer();

                // Clear OTP inputs
                otpInputs.forEach(input => {
                    input.value = '';
                });
                otpInputs[0].focus();
            }, 1500);
        });
    }

    // Account Lockout Functionality
    const accountLockoutModal = document.getElementById('account-lockout-modal');
    const unlockAccountBtn = document.getElementById('unlock-account-btn');
    const lockoutMinutes = document.getElementById('lockout-minutes');
    const lockoutSeconds = document.getElementById('lockout-seconds');
    const demoLockoutBtn = document.getElementById('demo-lockout-btn');

    // Check if account is locked
    function isAccountLocked(email) {
        const lockoutInfo = JSON.parse(localStorage.getItem('accountLockout') || '{}');
        if (lockoutInfo[email]) {
            const now = Math.floor(Date.now() / 1000);
            if (now < lockoutInfo[email].lockoutEnd) {
                return true;
            } else {
                // Lockout period has expired, remove the lockout
                const updatedLockoutInfo = { ...lockoutInfo };
                delete updatedLockoutInfo[email];
                localStorage.setItem('accountLockout', JSON.stringify(updatedLockoutInfo));
                return false;
            }
        }
        return false;
    }

    // Get remaining lockout time in seconds
    function getRemainingLockoutTime(email) {
        const lockoutInfo = JSON.parse(localStorage.getItem('accountLockout') || '{}');
        if (lockoutInfo[email]) {
            const now = Math.floor(Date.now() / 1000);
            const remaining = lockoutInfo[email].lockoutEnd - now;
            return remaining > 0 ? remaining : 0;
        }
        return 0;
    }

    // Format time in MM:SS format
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return {
            minutes: mins.toString().padStart(2, '0'),
            seconds: secs.toString().padStart(2, '0')
        };
    }

    // Update lockout countdown timer
    function updateLockoutTimer(email) {
        const remainingTime = getRemainingLockoutTime(email);
        if (remainingTime <= 0) {
            // Lockout period has ended
            accountLockoutModal.classList.remove('active');
            return;
        }

        const formattedTime = formatTime(remainingTime);
        lockoutMinutes.textContent = formattedTime.minutes;
        lockoutSeconds.textContent = formattedTime.seconds;

        setTimeout(() => {
            updateLockoutTimer(email);
        }, 1000);
    }

    // Show account lockout modal
    function showAccountLockout(email) {
        accountLockoutModal.classList.add('active');
        updateLockoutTimer(email);
    }

    // Lock account after too many failed attempts
    function lockAccount(email) {
        const now = Math.floor(Date.now() / 1000);
        const lockoutEnd = now + LOCKOUT_DURATION;

        const lockoutInfo = JSON.parse(localStorage.getItem('accountLockout') || '{}');
        lockoutInfo[email] = {
            failedAttempts: MAX_LOGIN_ATTEMPTS,
            lockoutEnd: lockoutEnd
        };

        localStorage.setItem('accountLockout', JSON.stringify(lockoutInfo));
        showAccountLockout(email);
    }

    // Increment failed login attempts
    function incrementFailedAttempts(email) {
        const lockoutInfo = JSON.parse(localStorage.getItem('accountLockout') || '{}');
        if (!lockoutInfo[email]) {
            lockoutInfo[email] = {
                failedAttempts: 1,
                lockoutEnd: 0
            };
        } else {
            lockoutInfo[email].failedAttempts += 1;
        }

        localStorage.setItem('accountLockout', JSON.stringify(lockoutInfo));

        // Check if max attempts reached
        if (lockoutInfo[email].failedAttempts >= MAX_LOGIN_ATTEMPTS) {
            lockAccount(email);
            return true;
        }

        return false;
    }

    // Reset failed login attempts
    function resetFailedAttempts(email) {
        const lockoutInfo = JSON.parse(localStorage.getItem('accountLockout') || '{}');
        if (lockoutInfo[email]) {
            delete lockoutInfo[email];
            localStorage.setItem('accountLockout', JSON.stringify(lockoutInfo));
        }
    }

    // Unlock account via email verification
    if (unlockAccountBtn) {
        unlockAccountBtn.addEventListener('click', function() {
            accountLockoutModal.classList.remove('active');
            forgotPasswordModal.classList.add('active');
            showForgotStep(1);
        });
    }

    // Demo Lockout Button
    if (demoLockoutBtn) {
        demoLockoutBtn.addEventListener('click', function() {
            const email = document.getElementById('email').value;

            // Validate email
            if (!email || !isValidEmail(email)) {
                showNotification('error', 'Invalid Email', 'Please enter a valid email address to demo the lockout feature.');
                return;
            }

            // Simulate 3 failed login attempts
            demoLockoutBtn.textContent = 'Simulating...';
            demoLockoutBtn.disabled = true;

            showNotification('info', 'Demo Mode', 'Simulating 3 failed login attempts...');

            // Lock the account
            lockAccount(email);

            setTimeout(() => {
                demoLockoutBtn.textContent = 'Demo Account Lockout';
                demoLockoutBtn.disabled = false;
            }, 2000);
        });
    }

    // Login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Validate email and password
            if (!email || !isValidEmail(email)) {
                showNotification('error', 'Invalid Email', 'Please enter a valid email address.');
                return;
            }

            if (!password) {
                showNotification('error', 'Missing Password', 'Please enter your password.');
                return;
            }

            // Check if account is locked
            if (isAccountLocked(email)) {
                showAccountLockout(email);
                return;
            }

            // Simulate login
            const loginButton = this.querySelector('.login-button');
            loginButton.textContent = 'Logging in...';
            loginButton.disabled = true;

            if (useBackend) {
                // Try to connect to backend API for login
                fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Successful login
                        showNotification('success', 'Login Successful', 'You have been logged in successfully.');

                        // Store token and user info in localStorage
                        localStorage.setItem('token', data.token);
                        localStorage.setItem('user', JSON.stringify(data.user));

                        // Reset any local lockout state
                        resetFailedAttempts(email);

                        // Redirect to home page after successful login
                        setTimeout(() => {
                            window.location.href = 'index.html';
                        }, 1000);
                    } else {
                        // Failed login
                        loginButton.textContent = 'Login';
                        loginButton.disabled = false;

                        // Check if account is locked
                        if (data.lockUntil) {
                            const lockoutEnd = new Date(data.lockUntil);
                            const now = new Date();
                            const remainingSeconds = Math.floor((lockoutEnd - now) / 1000);

                            // Store lockout info in localStorage for UI purposes
                            const lockoutInfo = JSON.parse(localStorage.getItem('accountLockout') || '{}');
                            lockoutInfo[email] = {
                                failedAttempts: MAX_LOGIN_ATTEMPTS,
                                lockoutEnd: Math.floor(lockoutEnd.getTime() / 1000)
                            };
                            localStorage.setItem('accountLockout', JSON.stringify(lockoutInfo));

                            // Show lockout UI
                            showAccountLockout(email);
                        } else if (data.attemptsRemaining) {
                            // Update local lockout state for UI
                            const lockoutInfo = JSON.parse(localStorage.getItem('accountLockout') || '{}');
                            if (!lockoutInfo[email]) {
                                lockoutInfo[email] = { failedAttempts: 0, lockoutEnd: 0 };
                            }
                            lockoutInfo[email].failedAttempts = MAX_LOGIN_ATTEMPTS - data.attemptsRemaining;
                            localStorage.setItem('accountLockout', JSON.stringify(lockoutInfo));

                            // Show error with attempts remaining
                            showNotification('error', 'Login Failed',
                                `Invalid email or password. You have ${data.attemptsRemaining} attempt${data.attemptsRemaining !== 1 ? 's' : ''} remaining.`);
                        } else {
                            // Generic error
                            showNotification('error', 'Login Failed', data.message || 'An error occurred during login.');
                        }
                    }
                })
                .catch(error => {
                    console.error('Login error:', error);
                    // Switch to local storage fallback if backend is unavailable
                    useBackend = false;
                    handleLocalLogin(email, password, loginButton);
                });
            } else {
                // Use local storage fallback
                handleLocalLogin(email, password, loginButton);
            }

            // Function to handle login with local storage fallback
            function handleLocalLogin(email, password, loginButton) {
                // Check if account is locked
                if (isAccountLocked(email)) {
                    showAccountLockout(email);
                    return;
                }

                // For demo purposes, we'll simulate a successful login with any credentials
                // In a real implementation, you would check against stored credentials

                // Get demo users from local storage or create default
                const demoUsers = JSON.parse(localStorage.getItem('demoUsers') || '[]');

                // Check if user exists
                const user = demoUsers.find(u => u.email === email);

                if (user) {
                    // In a real app, you would check password hash
                    // For demo, we'll just check if passwords match
                    if (user.password === password) {
                        // Successful login
                        showNotification('success', 'Login Successful', 'You have been logged in successfully.');

                        // Store user info
                        localStorage.setItem('currentUser', JSON.stringify({
                            email: user.email,
                            firstName: user.firstName,
                            lastName: user.lastName
                        }));

                        // Reset failed attempts
                        resetFailedAttempts(email);

                        // Redirect to home page
                        setTimeout(() => {
                            window.location.href = 'index.html';
                        }, 1000);
                    } else {
                        // Failed login - wrong password
                        loginButton.textContent = 'Login';
                        loginButton.disabled = false;

                        const isLocked = incrementFailedAttempts(email);
                        const attemptsLeft = MAX_LOGIN_ATTEMPTS - (JSON.parse(localStorage.getItem('accountLockout') || '{}')[email]?.failedAttempts || 0);

                        if (!isLocked) {
                            showNotification('error', 'Login Failed',
                                `Invalid password. You have ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining.`);
                        }
                    }
                } else {
                    // User doesn't exist, create a new demo user
                    const newUser = {
                        email: email,
                        password: password,
                        firstName: 'Demo',
                        lastName: 'User'
                    };

                    demoUsers.push(newUser);
                    localStorage.setItem('demoUsers', JSON.stringify(demoUsers));

                    // Successful login
                    showNotification('success', 'Account Created', 'A demo account has been created and you are now logged in.');

                    // Store user info
                    localStorage.setItem('currentUser', JSON.stringify({
                        email: newUser.email,
                        firstName: newUser.firstName,
                        lastName: newUser.lastName
                    }));

                    // Redirect to home page
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000);
                }
            }
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
