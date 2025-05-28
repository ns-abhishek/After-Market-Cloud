document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing application...');

    // Check if login form exists
    const loginForm = document.getElementById('screen-login');
    if (loginForm) {
        console.log('Login form found:', loginForm);
    } else {
        console.error('Login form not found in the DOM!');
    }

    // Check if combined auth screen exists
    const combinedAuthScreen = document.getElementById('screen-combined-auth');
    if (combinedAuthScreen) {
        console.log('Combined auth screen found:', combinedAuthScreen);
    } else {
        console.error('Combined auth screen not found in the DOM!');
    }

    // Language selector functionality
    const languageBtn = document.querySelector('.language-btn');
    const languageMenu = document.getElementById('language-menu');
    const currentLanguageText = document.getElementById('current-language');
    const languageOptions = document.querySelectorAll('.language-dropdown-content a');

    // Get saved language or use default (English)
    let currentLang = localStorage.getItem('language') || 'en';

    // Initialize language
    setLanguage(currentLang);

    // Toggle language dropdown
    languageBtn.addEventListener('click', (e) => {
        e.preventDefault();
        languageMenu.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.language-dropdown')) {
            languageMenu.classList.remove('show');
        }
    });

    // Handle language selection
    languageOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = option.getAttribute('data-lang');

            // Update active class
            languageOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');

            // Set language
            setLanguage(lang);

            // Close dropdown
            languageMenu.classList.remove('show');
        });
    });

    // Function to set language
    function setLanguage(lang) {
        // Save to localStorage
        localStorage.setItem('language', lang);
        currentLang = lang;

        // Update button text
        currentLanguageText.textContent = {
            'en': 'English',
            'hi': 'हिन्दी',
            'fr': 'Français'
        }[lang] || 'English';

        // Update active class in dropdown
        languageOptions.forEach(opt => {
            opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
        });

        // Update all text elements with translations
        updatePageText();
    }

    // Function to update all text on the page
    function updatePageText() {
        const t = translations[currentLang];

        // Update login screen
        document.querySelector('#screen-login h2').textContent = t.loginFormTitle;
        document.querySelector('label[for="username"]').textContent = t.username;
        document.getElementById('username').placeholder = t.usernamePlaceholder;
        document.querySelector('label[for="password"]').textContent = t.password;
        document.getElementById('password').placeholder = t.passwordPlaceholder;
        document.querySelector('label[for="remember-me"]').textContent = t.rememberMe;
        document.getElementById('forgot-password').textContent = t.forgotPassword;
        document.getElementById('login-btn').textContent = t.loginButton;
        document.querySelector('.register-link span').textContent = t.noAccount;
        document.getElementById('register-link').textContent = t.register;

        // Update dropdown header
        document.querySelector('.dropdown-header').textContent = t.selectLanguage;

        // Update other screens as needed (authentication level, MFA options, etc.)
        // This can be expanded to include all text elements on the page
    }

    // Theme switcher functionality
    const themeSwitch = document.getElementById('theme-switch');

    // Check for saved theme preference or use default
    const currentTheme = localStorage.getItem('theme') || 'dark';

    // Apply the saved theme or default
    if (currentTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeSwitch.checked = true;
    }

    // Handle theme switch
    themeSwitch.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
        }
    });

    // Global variables
    let currentUser = null;
    let loginAttempts = 0;
    const maxLoginAttempts = 3;
    let selectedMFAMethods = [];
    let completedMFAMethods = [];
    let currentTimers = {};

    // Screen elements
    const screens = {
        login: document.getElementById('screen-login'),
        authLevel: document.getElementById('screen-auth-level'),
        mfaOptions: document.getElementById('screen-mfa-options'),
        smsOtp: document.getElementById('screen-sms-otp'),
        emailOtp: document.getElementById('screen-email-otp'),
        authenticator: document.getElementById('screen-authenticator'),
        mpin: document.getElementById('screen-mpin'),
        faceid: document.getElementById('screen-faceid'),
        fingerprint: document.getElementById('screen-fingerprint'),
        success: document.getElementById('screen-success'),
        combinedAuth: document.getElementById('screen-combined-auth'),
        dashboard: document.getElementById('screen-dashboard')
    };

    // Ensure all screens are properly initialized
    console.log('Initializing screens...');
    Object.keys(screens).forEach(key => {
        if (!screens[key]) {
            console.error(`Screen element not found: screen-${key}`);
        } else {
            console.log(`Screen found: ${key}`);
            // Make sure all screens are hidden initially
            screens[key].classList.remove('active');
            screens[key].style.display = 'none';
        }
    });

    // Show the login screen initially
    if (screens.login) {
        console.log('Showing login screen');
        screens.login.classList.add('active');
        screens.login.style.display = 'block';
    } else {
        console.error('Login screen not found!');
    }

    // Form elements - Login screen
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const togglePasswordButton = document.getElementById('toggle-password');
    const loginButton = document.getElementById('login-btn');
    const forgotPasswordLink = document.getElementById('forgot-password');
    const rememberMeCheckbox = document.getElementById('remember-me');
    const registerLink = document.getElementById('register-link');
    const errorMessage = document.getElementById('error-message');

    // Auto-fill username and password fields for convenience
    if (usernameInput && passwordInput) {
        usernameInput.value = 'admin';
        passwordInput.value = 'Admin$789';
    }

    // Form elements - MFA Options screen
    const firstMfaOptions = document.getElementById('first-mfa-options');
    const secondMfaOptions = document.getElementById('second-mfa-options');
    const thirdMfaOptions = document.getElementById('third-mfa-options');
    const verifyButton = document.getElementById('verify-btn');
    const mfaErrorMessage = document.getElementById('mfa-error-message');

    // Form elements - SMS OTP screen
    const maskedPhone = document.getElementById('masked-phone');
    const smsOtpInput = document.getElementById('sms-otp');
    const smsTimer = document.getElementById('sms-timer');
    const verifySmsButton = document.getElementById('verify-sms-btn');
    const resendSmsLink = document.getElementById('resend-sms');
    const backToMfaFromSmsLink = document.getElementById('back-to-mfa-options-from-sms');
    const smsErrorMessage = document.getElementById('sms-error-message');

    // Form elements - Email OTP screen
    const maskedEmail = document.getElementById('masked-email');
    const emailOtpInput = document.getElementById('email-otp');
    const emailTimer = document.getElementById('email-timer');
    const verifyEmailButton = document.getElementById('verify-email-btn');
    const resendEmailLink = document.getElementById('resend-email');
    const backToMfaFromEmailLink = document.getElementById('back-to-mfa-options-from-email');
    const emailErrorMessage = document.getElementById('email-error-message');

    // Form elements - Authenticator screen
    const authenticatorCodeInput = document.getElementById('authenticator-code');
    const verifyAuthenticatorButton = document.getElementById('verify-authenticator-btn');
    const backToMfaFromAuthenticatorLink = document.getElementById('back-to-mfa-options-from-authenticator');
    const authenticatorErrorMessage = document.getElementById('authenticator-error-message');

    // Form elements - MPIN screen
    const mpinInputs = [
        document.getElementById('mpin-1'),
        document.getElementById('mpin-2'),
        document.getElementById('mpin-3'),
        document.getElementById('mpin-4')
    ];
    const verifyMpinButton = document.getElementById('verify-mpin-btn');
    const backToMfaFromMpinLink = document.getElementById('back-to-mfa-options-from-mpin');
    const mpinErrorMessage = document.getElementById('mpin-error-message');

    // Form elements - Face ID screen
    const faceidStatusText = document.getElementById('faceid-status');
    const verifyFaceidButton = document.getElementById('verify-faceid-btn');
    const cancelFaceidButton = document.getElementById('cancel-faceid-btn');
    const backToMfaFromFaceidLink = document.getElementById('back-to-mfa-options-from-faceid');
    const faceidErrorMessage = document.getElementById('faceid-error-message');

    // Form elements - Fingerprint screen
    const fingerprintStatusText = document.getElementById('fingerprint-status');
    const verifyFingerprintButton = document.getElementById('verify-fingerprint-btn');
    const cancelFingerprintButton = document.getElementById('cancel-fingerprint-btn');
    const backToMfaFromFingerprintLink = document.getElementById('back-to-mfa-options-from-fingerprint');
    const fingerprintErrorMessage = document.getElementById('fingerprint-error-message');

    // Form elements - Success screen
    const continueButton = document.getElementById('continue-btn');

    // Utility functions
    function showScreen(screenId) {
        console.log('Showing screen:', screenId);

        // Make sure the requested screen exists
        if (!screens[screenId]) {
            console.error(`Screen not found: ${screenId}`);
            return;
        }

        // First, hide all screens
        Object.values(screens).forEach(screen => {
            if (screen) {
                screen.classList.remove('active');
                screen.style.display = 'none';
            }
        });

        // Show the requested screen
        screens[screenId].classList.add('active');
        screens[screenId].style.display = 'block';

        console.log('Screen display complete for:', screenId);
    }

    function showError(elementId, message) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
        }
    }

    function clearError(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = '';
        }
    }

    function checkUserExists(usernameOrEmail) {
        return users.find(user =>
            user.username === usernameOrEmail ||
            user.email === usernameOrEmail
        );
    }

    function validatePassword(user, password) {
        return user.password === password;
    }



    function maskEmail(email) {
        const [username, domain] = email.split('@');
        const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1);
        return `${maskedUsername}@${domain}`;
    }

    function maskPhone(phone) {
        return phone;  // Already masked in our mock data
    }

    function startTimer(elementId, durationInMinutes, onComplete) {
        const timerElement = document.getElementById(elementId);
        let totalSeconds = durationInMinutes * 60;

        // Clear any existing timer
        if (currentTimers[elementId]) {
            clearInterval(currentTimers[elementId]);
        }

        const timer = setInterval(() => {
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;

            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            if (totalSeconds <= 0) {
                clearInterval(timer);
                if (onComplete) onComplete();
            } else {
                totalSeconds--;
            }
        }, 1000);

        currentTimers[elementId] = timer;
        return timer;
    }

    function validateOTP(type, userId, otp) {
        // In a real app, this would validate against a server
        return otpStore[type][userId] === otp;
    }

    function validateAuthenticatorCode(user, code) {
        // In a real app, this would validate using TOTP algorithm
        // For demo purposes, we'll accept any 6-digit code
        return code.length === 6 && /^\d+$/.test(code);
    }

    function validateMPIN(user, mpin) {
        console.log(`Validating MPIN: ${mpin} against user MPIN: ${user.mpin}`);
        return user.mpin === mpin;
    }

    function validateFaceID(user) {
        // In a real app, this would use the device's facial recognition API
        // For demo purposes, we'll simulate a successful verification after a delay
        console.log(`Validating Face ID for user: ${user.username}`);
        return true;
    }

    function validateFingerprint(user) {
        // In a real app, this would use the device's fingerprint API
        // For demo purposes, we'll simulate a successful verification after a delay
        return true;
    }

    function generateOTP() {
        // Generate a random 6-digit OTP
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    function generateAndSendOTP(type, user) {
        const otp = generateOTP();
        otpStore[type][user.id] = otp;

        // In a real app, this would send the OTP via SMS or email
        console.log(`${type.toUpperCase()} OTP for ${user.username}: ${otp}`);

        return otp;
    }

    function populateMFAOptions(containerId, excludeMethod = null) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';

        if (!currentUser || !currentUser.mfaMethods) return;

        // Convert single excludeMethod to array for backward compatibility
        let excludeMethods = [];
        if (Array.isArray(excludeMethod)) {
            excludeMethods = excludeMethod;
        } else if (excludeMethod) {
            excludeMethods = [excludeMethod];
        }

        const methods = [
            { id: 'sms', icon: 'fa-mobile-alt', title: 'Text Message (SMS) OTP', description: `We'll send a code to ${maskPhone(currentUser.phone)}` },
            { id: 'email', icon: 'fa-envelope', title: 'Email OTP', description: `We'll send a code to ${maskEmail(currentUser.email)}` },
            { id: 'authenticator', icon: 'fa-shield-alt', title: 'Authenticator App', description: 'Use Google Authenticator, Microsoft Authenticator or Apple Authenticator' },
            { id: 'mpin', icon: 'fa-key', title: 'MPIN', description: 'Enter your 4-digit MPIN' },
            { id: 'faceid', icon: 'fa-user-circle', title: 'Face ID', description: 'Use facial recognition to verify your identity' },
            { id: 'fingerprint', icon: 'fa-fingerprint', title: 'Fingerprint', description: 'Use your fingerprint to verify your identity' }
        ];

        methods.forEach(method => {
            // Skip if method is not available for user or is excluded
            if (!currentUser.mfaMethods[method.id] || excludeMethods.includes(method.id)) return;

            const optionElement = document.createElement('div');
            optionElement.className = 'mfa-option';
            optionElement.dataset.method = method.id;
            optionElement.innerHTML = `
                <i class="fas ${method.icon}"></i>
                <div class="mfa-option-info">
                    <div class="mfa-option-title">${method.title}</div>
                    <div class="mfa-option-description">${method.description}</div>
                </div>
            `;

            optionElement.addEventListener('click', () => {
                // Remove selected class from all options in this container
                container.querySelectorAll('.mfa-option').forEach(option => {
                    option.classList.remove('selected');
                });

                // Add selected class to this option
                optionElement.classList.add('selected');

                // Update selected methods array
                if (containerId === 'first-mfa-options') {
                    selectedMFAMethods[0] = method.id;

                    // Repopulate second and third options to avoid duplicates
                    populateMFAOptions('second-mfa-options', selectedMFAMethods[0]);
                    populateMFAOptions('third-mfa-options', [selectedMFAMethods[0], selectedMFAMethods[1]].filter(Boolean));

                } else if (containerId === 'second-mfa-options') {
                    selectedMFAMethods[1] = method.id;

                    // Repopulate third option to avoid duplicates
                    populateMFAOptions('third-mfa-options', [selectedMFAMethods[0], selectedMFAMethods[1]].filter(Boolean));

                } else if (containerId === 'third-mfa-options') {
                    selectedMFAMethods[2] = method.id;
                }
            });

            container.appendChild(optionElement);
        });

        // Select first option by default if available
        const firstOption = container.querySelector('.mfa-option');
        if (firstOption) {
            firstOption.click();
        }
    }

    function proceedToNextMFAMethod() {
        console.log('Proceeding to next MFA method');
        console.log('Completed methods:', completedMFAMethods);
        console.log('Selected methods:', selectedMFAMethods);

        // Get required number of methods based on selected authentication level
        let requiredMethods = 1;
        if (selectedAuthLevel === 'three-factor') requiredMethods = 2;
        if (selectedAuthLevel === 'four-factor') requiredMethods = 3;

        // Limit selected methods to required number
        const methodsToVerify = selectedMFAMethods.slice(0, requiredMethods);

        console.log('Methods to verify:', methodsToVerify);
        console.log('Required methods:', requiredMethods);

        // If we've completed all required MFA methods, go to success screen
        if (completedMFAMethods.length >= requiredMethods) {
            console.log('All required methods completed, showing success screen');

            // Update the success screen with authentication details
            updateSuccessScreen();

            // Show the success screen
            showScreen('success');
            return;
        }

        // Otherwise, proceed to the next MFA method
        const nextMethod = methodsToVerify.find(method => !completedMFAMethods.includes(method));
        console.log('Next method to verify:', nextMethod);

        if (nextMethod === 'sms') {
            maskedPhone.textContent = maskPhone(currentUser.phone);
            generateAndSendOTP('sms', currentUser);
            startTimer('sms-timer', 2, () => {
                resendSmsLink.classList.remove('disabled');
            });
            showScreen('smsOtp');
        } else if (nextMethod === 'email') {
            maskedEmail.textContent = maskEmail(currentUser.email);
            generateAndSendOTP('email', currentUser);
            startTimer('email-timer', 5, () => {
                resendEmailLink.classList.remove('disabled');
            });
            showScreen('emailOtp');
        } else if (nextMethod === 'authenticator') {
            showScreen('authenticator');
        } else if (nextMethod === 'mpin') {
            showScreen('mpin');
            mpinInputs[0].focus();
        } else if (nextMethod === 'faceid') {
            showScreen('faceid');
            faceidStatusText.textContent = 'Waiting for camera...';
        } else if (nextMethod === 'fingerprint') {
            showScreen('fingerprint');
            fingerprintStatusText.textContent = 'Waiting for fingerprint...';
        } else {
            console.error('No valid next method found!');

            // If we somehow got here without a valid next method, just show success
            updateSuccessScreen();
            showScreen('success');
        }
    }

    // Event Listeners - Login Screen
    togglePasswordButton.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePasswordButton.querySelector('i').className = `fas fa-${type === 'password' ? 'eye' : 'eye-slash'}`;
    });

    loginButton.addEventListener('click', () => {
        const usernameOrEmail = usernameInput.value.trim();
        const password = passwordInput.value;

        clearError('error-message');

        // Validate username/email
        if (!usernameOrEmail) {
            showError('error-message', 'Please enter your username');
            return;
        }

        const user = checkUserExists(usernameOrEmail);
        if (!user) {
            showError('error-message', 'Username not found');
            return;
        }

        // Store the current user
        currentUser = user;

        // Validate password
        if (!password) {
            showError('error-message', 'Please enter your password');
            return;
        }

        if (!validatePassword(currentUser, password)) {
            loginAttempts++;

            if (loginAttempts >= maxLoginAttempts) {
                showError('error-message', `Maximum login attempts reached. Please use the "Forgot Password" option.`);
                loginButton.disabled = true;
            } else {
                showError('error-message', `Password is not correct. ${maxLoginAttempts - loginAttempts} attempts remaining.`);
            }
            return;
        }

        // Reset login attempts
        loginAttempts = 0;

        // Initialize the combined authentication screen
        initCombinedAuthScreen();

        // Proceed to combined authentication screen
        showScreen('combinedAuth');
    });

    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        const usernameOrEmail = usernameInput.value.trim();

        if (!usernameOrEmail) {
            showError('error-message', 'Please enter your username to reset password');
            return;
        }

        const user = checkUserExists(usernameOrEmail);
        if (!user) {
            showError('error-message', 'Username not found');
            return;
        }

        alert(`Password reset link has been sent to ${user.email}`);
        loginAttempts = 0;
        loginButton.disabled = false;
        clearError('error-message');
    });

    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Registration functionality will be implemented in the future.');
    });

    // Combined Authentication Screen Implementation
    function initCombinedAuthScreen() {
        console.log('Initializing combined authentication screen');

        // Check if the combined auth screen exists
        const combinedAuthScreen = document.getElementById('screen-combined-auth');
        if (!combinedAuthScreen) {
            console.error('Combined authentication screen not found in the DOM!');
            return;
        }

        console.log('Combined auth screen found:', combinedAuthScreen);

        // Check if sections exist
        const authLevelSection = document.getElementById('auth-level-section');
        const verificationMethodsSection = document.getElementById('verification-methods-section');

        if (!authLevelSection) {
            console.error('Auth level section not found!');
        }

        if (!verificationMethodsSection) {
            console.error('Verification methods section not found!');
        }

        // Reset any previous state
        selectedAuthLevel = '';
        selectedMFAMethods = [];

        // Reset UI state
        document.querySelectorAll('.auth-level-card').forEach(card => {
            card.classList.remove('selected');
        });

        if (authLevelSection) {
            authLevelSection.classList.remove('hidden');
        }

        if (verificationMethodsSection) {
            verificationMethodsSection.classList.add('hidden');
        }

        // Reset progress steps
        document.querySelectorAll('.auth-progress-step').forEach((step, index) => {
            if (index === 0) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
                step.classList.remove('completed');
            }
        });

        document.querySelectorAll('.auth-progress-line').forEach(line => {
            line.classList.remove('active');
        });

        console.log('Combined authentication screen initialization complete');
    }

    // Event Listeners - Combined Authentication Screen
    const authLevelCards = document.querySelectorAll('.auth-level-card');
    const backBtn = document.getElementById('back-btn');
    const continueAuthBtn = document.getElementById('continue-auth-btn');
    const methodsCountText = document.getElementById('methods-count-text');
    const selectedMethodsList = document.getElementById('selected-methods-list');

    // Authentication level selection
    authLevelCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove selected class from all cards
            authLevelCards.forEach(c => c.classList.remove('selected'));

            // Add selected class to clicked card
            card.classList.add('selected');

            // Store selected level
            selectedAuthLevel = card.dataset.level;

            // Update continue button text and enable it
            continueAuthBtn.textContent = 'Continue';
            continueAuthBtn.disabled = false;
            continueAuthBtn.classList.remove('disabled');

            // Clear any previous error messages
            clearError('combined-auth-error-message');
        });
    });

    // Continue button click handler
    continueAuthBtn.addEventListener('click', () => {
        // Clear any previous errors
        clearError('combined-auth-error-message');

        // Check which section is currently visible
        const authLevelSection = document.getElementById('auth-level-section');
        const verificationMethodsSection = document.getElementById('verification-methods-section');

        if (!authLevelSection.classList.contains('hidden')) {
            // We're in the auth level section

            // Validate auth level selection
            if (!selectedAuthLevel) {
                showError('combined-auth-error-message', 'Please select an authentication level');
                return;
            }

            // Update progress steps
            document.querySelectorAll('.auth-progress-step')[0].classList.add('completed');
            document.querySelectorAll('.auth-progress-step')[1].classList.add('active');
            document.querySelectorAll('.auth-progress-line')[0].classList.add('active');

            // Hide auth level section and show verification methods section
            authLevelSection.classList.add('hidden');
            verificationMethodsSection.classList.remove('hidden');

            // Update methods count text based on selected level
            let requiredMethods = 1;
            if (selectedAuthLevel === 'three-factor') requiredMethods = 2;
            if (selectedAuthLevel === 'four-factor') requiredMethods = 3;

            methodsCountText.textContent = requiredMethods === 1 ? 'one' : requiredMethods === 2 ? 'two' : 'three';

            // Update required count in the UI
            document.getElementById('required-count').textContent = requiredMethods;
            document.getElementById('selected-count').textContent = '0';
            document.getElementById('selection-progress-bar').style.width = '0%';

            // Populate verification methods by category
            populateVerificationMethodsByCategory(requiredMethods);

            // Update button text and state
            continueAuthBtn.textContent = 'Verify';
            continueAuthBtn.disabled = true;
            continueAuthBtn.classList.add('disabled');

        } else {
            // We're in the verification methods section

            // Get required number of methods based on selected authentication level
            let requiredMethods = 1;
            if (selectedAuthLevel === 'three-factor') requiredMethods = 2;
            if (selectedAuthLevel === 'four-factor') requiredMethods = 3;

            // Validate method selections
            if (selectedMFAMethods.length === 0) {
                showError('combined-auth-error-message', 'Please select at least one verification method');
                return;
            }

            // Check if we have exactly the required number of methods selected
            if (selectedMFAMethods.length !== requiredMethods) {
                showError('combined-auth-error-message', `Please select exactly ${requiredMethods} verification method(s)`);
                return;
            }

            // Check for duplicates
            const uniqueMethods = [...new Set(selectedMFAMethods)];
            if (uniqueMethods.length < selectedMFAMethods.length) {
                showError('combined-auth-error-message', 'Please select different verification methods');
                return;
            }

            // Update progress steps
            document.querySelectorAll('.auth-progress-step')[1].classList.add('completed');
            document.querySelectorAll('.auth-progress-step')[2].classList.add('active');
            document.querySelectorAll('.auth-progress-line')[1].classList.add('active');

            // Check if current user is admin
            if (currentUser && currentUser.username === 'admin') {
                // For admin, show success screen directly without verification
                // Mark all methods as completed for admin
                completedMFAMethods = [...selectedMFAMethods];

                // Update the success screen with authentication details
                updateSuccessScreen();

                // Show the success screen
                showScreen('success');
                return;
            }

            // For non-admin users, reset completed methods and proceed to verification
            completedMFAMethods = [];
            proceedToNextMFAMethod();
        }
    });

    // Back button click handler
    backBtn.addEventListener('click', () => {
        // Clear any previous errors
        clearError('combined-auth-error-message');

        // Check which section is currently visible
        const authLevelSection = document.getElementById('auth-level-section');
        const verificationMethodsSection = document.getElementById('verification-methods-section');

        if (!verificationMethodsSection.classList.contains('hidden')) {
            // We're in the verification methods section, go back to auth level
            verificationMethodsSection.classList.add('hidden');
            authLevelSection.classList.remove('hidden');

            // Update progress steps
            document.querySelectorAll('.auth-progress-step')[1].classList.remove('active');
            document.querySelectorAll('.auth-progress-step')[0].classList.remove('completed');
            document.querySelectorAll('.auth-progress-line')[0].classList.remove('active');

            // Reset selected methods
            selectedMFAMethods = [];

            // Update button text
            continueAuthBtn.textContent = 'Continue';

        } else {
            // We're in the auth level section, go back to login
            showScreen('login');
        }
    });

    // Function to populate all verification methods in a single list
    function populateVerificationMethodsByCategory(requiredMethods = 1) {
        console.log('Populating verification methods, required methods:', requiredMethods);

        // Define all available methods
        const allMethods = ['mpin', 'sms', 'email', 'authenticator', 'faceid', 'fingerprint'];

        console.log('Available methods for current user:', currentUser.mfaMethods);

        // Clear existing methods
        document.getElementById('all-methods').innerHTML = '';

        // Reset selected methods list and array
        selectedMethodsList.innerHTML = '<div class="no-methods-selected">No methods selected yet</div>';
        selectedMFAMethods = [];

        // Method details
        const methodDetails = {
            sms: {
                icon: 'fa-mobile-alt',
                title: 'SMS OTP',
                description: `Code sent to ${maskPhone(currentUser.phone)}`
            },
            email: {
                icon: 'fa-envelope',
                title: 'Email OTP',
                description: `Code sent to ${maskEmail(currentUser.email)}`
            },
            authenticator: {
                icon: 'fa-shield-alt',
                title: 'Authenticator App',
                description: 'Use Google or Microsoft Authenticator'
            },
            mpin: {
                icon: 'fa-key',
                title: 'MPIN',
                description: 'Enter your 4-digit PIN'
            },
            faceid: {
                icon: 'fa-user-circle',
                title: 'Face ID',
                description: 'Use facial recognition'
            },
            fingerprint: {
                icon: 'fa-fingerprint',
                title: 'Fingerprint',
                description: 'Use fingerprint scanner'
            }
        };

        // Get the container for all methods
        const container = document.getElementById('all-methods');

        // Populate all methods in a single container
        allMethods.forEach(method => {
            // Skip if method is not available for user
            if (!currentUser.mfaMethods[method]) return;

            const methodElement = document.createElement('div');
            methodElement.className = 'verification-method';
            methodElement.dataset.method = method;

            methodElement.innerHTML = `
                <div class="method-icon">
                    <i class="fas ${methodDetails[method].icon}"></i>
                </div>
                <div class="method-details">
                    <div class="method-title">${methodDetails[method].title}</div>
                    <div class="method-description">${methodDetails[method].description}</div>
                </div>
            `;

            methodElement.addEventListener('click', () => {
                console.log(`Method ${method} clicked`);

                // Check if we're at the limit and trying to add more
                if (selectedMFAMethods.length >= requiredMethods && !methodElement.classList.contains('selected')) {
                    // Show error message
                    showError('combined-auth-error-message', `You can only select ${requiredMethods} verification method(s) for this authentication level`);
                    return;
                }

                // Clear any previous error
                clearError('combined-auth-error-message');

                // Toggle selection
                methodElement.classList.toggle('selected');
                console.log(`Method ${method} is now ${methodElement.classList.contains('selected') ? 'selected' : 'unselected'}`);

                // Update selected methods array
                if (methodElement.classList.contains('selected')) {
                    // Add method if not already in the array
                    if (!selectedMFAMethods.includes(method)) {
                        selectedMFAMethods.push(method);
                        console.log(`Added ${method} to selected methods. Current methods:`, selectedMFAMethods);
                    }
                } else {
                    // Remove method from array
                    selectedMFAMethods = selectedMFAMethods.filter(m => m !== method);
                    console.log(`Removed ${method} from selected methods. Current methods:`, selectedMFAMethods);
                }

                // Update selected methods list
                updateSelectedMethodsList(requiredMethods);
            });

            container.appendChild(methodElement);
        });
    }

    // Function to update the selected methods list
    function updateSelectedMethodsList(requiredMethods = 1) {
        // Update the selection count and progress bar
        const selectedCount = document.getElementById('selected-count');
        const progressBar = document.getElementById('selection-progress-bar');

        selectedCount.textContent = selectedMFAMethods.length;

        // Calculate progress percentage
        const progressPercentage = Math.min((selectedMFAMethods.length / requiredMethods) * 100, 100);
        progressBar.style.width = `${progressPercentage}%`;

        // Change progress bar color based on completion
        if (selectedMFAMethods.length >= requiredMethods) {
            progressBar.style.backgroundColor = '#2ecc71'; // Green for complete
        } else {
            progressBar.style.backgroundColor = '#4a90e2'; // Blue for in progress
        }

        // Update the continue button state
        if (selectedMFAMethods.length === requiredMethods) {
            continueAuthBtn.disabled = false;
            continueAuthBtn.classList.remove('disabled');
        } else {
            continueAuthBtn.disabled = true;
            continueAuthBtn.classList.add('disabled');
        }

        // Update the selected methods list
        if (selectedMFAMethods.length === 0) {
            selectedMethodsList.innerHTML = '<div class="no-methods-selected">No methods selected yet</div>';
            return;
        }

        // Method names for display
        const methodNames = {
            sms: 'SMS OTP',
            email: 'Email OTP',
            authenticator: 'Authenticator App',
            mpin: 'MPIN',
            faceid: 'Face ID',
            fingerprint: 'Fingerprint'
        };

        // Create HTML for selected methods
        let html = '';
        selectedMFAMethods.forEach(method => {
            html += `
                <div class="selected-method-pill" data-method="${method}">
                    ${methodNames[method]}
                    <i class="fas fa-times remove-method" data-method="${method}"></i>
                </div>
            `;
        });

        selectedMethodsList.innerHTML = html;

        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-method').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const method = btn.dataset.method;

                // Remove method from array
                selectedMFAMethods = selectedMFAMethods.filter(m => m !== method);

                // Deselect the method in the UI
                document.querySelector(`.verification-method[data-method="${method}"]`).classList.remove('selected');

                // Update selected methods list
                updateSelectedMethodsList(requiredMethods);

                // Clear any error messages
                clearError('combined-auth-error-message');
            });
        });
    }

    // Legacy event listeners for backward compatibility
    const authLevelOptions = document.querySelectorAll('.auth-level-option');
    const backToPasswordFromAuthLink = document.getElementById('back-to-password-from-auth');
    let selectedAuthLevel = ''; // Default is empty, will be set when user selects

    if (backToPasswordFromAuthLink) {
        backToPasswordFromAuthLink.addEventListener('click', (e) => {
            e.preventDefault();
            showScreen('login');
        });
    }

    // Event Listeners - MFA Options Screen
    const backToAuthLevelLink = document.getElementById('back-to-auth-level');

    verifyButton.addEventListener('click', () => {
        clearError('mfa-error-message');

        // Get required number of methods based on selected authentication level
        let requiredMethods = 1;
        if (selectedAuthLevel === 'three-factor') requiredMethods = 2;
        if (selectedAuthLevel === 'four-factor') requiredMethods = 3;

        // Validate MFA selections
        if (selectedMFAMethods.length === 0) {
            showError('mfa-error-message', 'Please select at least one verification method');
            return;
        }

        // Check if we have enough methods selected
        if (selectedMFAMethods.length < requiredMethods) {
            showError('mfa-error-message', `Please select ${requiredMethods} different verification methods`);
            return;
        }

        // Check for duplicates
        const uniqueMethods = [...new Set(selectedMFAMethods)];
        if (uniqueMethods.length < selectedMFAMethods.length) {
            showError('mfa-error-message', 'Please select different verification methods');
            return;
        }

        // Check if current user is admin
        if (currentUser && currentUser.username === 'admin') {
            // For admin, show success screen directly without verification
            // Mark all methods as completed for admin
            completedMFAMethods = [...selectedMFAMethods];

            // Update the success screen with authentication details
            updateSuccessScreen();

            // Show the success screen
            showScreen('success');
            return;
        }

        // For non-admin users, reset completed methods and proceed to verification
        completedMFAMethods = [];
        proceedToNextMFAMethod();
    });

    backToAuthLevelLink.addEventListener('click', (e) => {
        e.preventDefault();
        showScreen('authLevel');
    });

    // Event Listeners - SMS OTP Screen
    verifySmsButton.addEventListener('click', () => {
        const otp = smsOtpInput.value.trim();

        clearError('sms-error-message');

        if (!otp) {
            showError('sms-error-message', 'Please enter the verification code');
            return;
        }

        if (!validateOTP('sms', currentUser.id, otp)) {
            showError('sms-error-message', 'Invalid verification code');
            return;
        }

        // Mark SMS as completed
        completedMFAMethods.push('sms');

        // Clear the input
        smsOtpInput.value = '';

        // Proceed to next MFA method or success screen
        proceedToNextMFAMethod();
    });

    resendSmsLink.addEventListener('click', (e) => {
        e.preventDefault();

        if (resendSmsLink.classList.contains('disabled')) return;

        // Regenerate and send OTP
        generateAndSendOTP('sms', currentUser);

        // Reset timer
        resendSmsLink.classList.add('disabled');
        startTimer('sms-timer', 2, () => {
            resendSmsLink.classList.remove('disabled');
        });

        // Clear input
        smsOtpInput.value = '';
    });

    backToMfaFromSmsLink.addEventListener('click', (e) => {
        e.preventDefault();

        // Clear any active timer
        if (currentTimers['sms-timer']) {
            clearInterval(currentTimers['sms-timer']);
        }

        showScreen('mfaOptions');
    });

    // Event Listeners - Email OTP Screen
    verifyEmailButton.addEventListener('click', () => {
        const otp = emailOtpInput.value.trim();

        clearError('email-error-message');

        if (!otp) {
            showError('email-error-message', 'Please enter the verification code');
            return;
        }

        if (!validateOTP('email', currentUser.id, otp)) {
            showError('email-error-message', 'Invalid verification code');
            return;
        }

        // Mark Email as completed
        completedMFAMethods.push('email');

        // Clear the input
        emailOtpInput.value = '';

        // Proceed to next MFA method or success screen
        proceedToNextMFAMethod();
    });

    resendEmailLink.addEventListener('click', (e) => {
        e.preventDefault();

        if (resendEmailLink.classList.contains('disabled')) return;

        // Regenerate and send OTP
        generateAndSendOTP('email', currentUser);

        // Reset timer
        resendEmailLink.classList.add('disabled');
        startTimer('email-timer', 5, () => {
            resendEmailLink.classList.remove('disabled');
        });

        // Clear input
        emailOtpInput.value = '';
    });

    backToMfaFromEmailLink.addEventListener('click', (e) => {
        e.preventDefault();

        // Clear any active timer
        if (currentTimers['email-timer']) {
            clearInterval(currentTimers['email-timer']);
        }

        showScreen('mfaOptions');
    });

    // Event Listeners - Authenticator Screen
    verifyAuthenticatorButton.addEventListener('click', () => {
        const code = authenticatorCodeInput.value.trim();

        clearError('authenticator-error-message');

        if (!code) {
            showError('authenticator-error-message', 'Please enter the verification code');
            return;
        }

        if (!validateAuthenticatorCode(currentUser, code)) {
            showError('authenticator-error-message', 'Invalid verification code');
            return;
        }

        // Mark Authenticator as completed
        completedMFAMethods.push('authenticator');

        // Clear the input
        authenticatorCodeInput.value = '';

        // Proceed to next MFA method or success screen
        proceedToNextMFAMethod();
    });

    backToMfaFromAuthenticatorLink.addEventListener('click', (e) => {
        e.preventDefault();
        showScreen('mfaOptions');
    });

    // Event Listeners - MPIN Screen
    // Auto-focus next input when a digit is entered
    mpinInputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            if (input.value.length === 1) {
                if (index < mpinInputs.length - 1) {
                    mpinInputs[index + 1].focus();
                }
            }
        });

        // Handle backspace
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && input.value === '' && index > 0) {
                mpinInputs[index - 1].focus();
            }
        });
    });

    verifyMpinButton.addEventListener('click', () => {
        const mpin = mpinInputs.map(input => input.value).join('');

        clearError('mpin-error-message');

        if (mpin.length !== 4) {
            showError('mpin-error-message', 'Please enter all 4 digits');
            return;
        }

        if (!validateMPIN(currentUser, mpin)) {
            showError('mpin-error-message', 'Invalid MPIN');
            return;
        }

        // Mark MPIN as completed
        completedMFAMethods.push('mpin');

        // Clear the inputs
        mpinInputs.forEach(input => input.value = '');

        // Proceed to next MFA method or success screen
        proceedToNextMFAMethod();
    });

    backToMfaFromMpinLink.addEventListener('click', (e) => {
        e.preventDefault();
        showScreen('mfaOptions');
    });

    // Event Listeners - Face ID Screen
    verifyFaceidButton.addEventListener('click', () => {
        clearError('faceid-error-message');

        // Hide verify button and show cancel button
        verifyFaceidButton.classList.add('hidden');
        cancelFaceidButton.classList.remove('hidden');

        // Update status
        faceidStatusText.textContent = 'Looking for your face...';

        // Simulate face scanning animation
        document.querySelector('.faceid-scan').classList.add('scanning');

        // Simulate face recognition process (3 seconds)
        setTimeout(() => {
            // In a real app, this would use the device's facial recognition API
            faceidStatusText.textContent = 'Face detected! Verifying...';

            setTimeout(() => {
                // Simulate successful verification
                faceidStatusText.textContent = 'Face ID verified successfully!';
                document.querySelector('.faceid-scan').classList.remove('scanning');
                document.querySelector('.faceid-scan').classList.add('success');

                // Mark Face ID as completed
                completedMFAMethods.push('faceid');

                // Proceed to next MFA method or success screen after a short delay
                setTimeout(() => {
                    // Reset UI for next time
                    verifyFaceidButton.classList.remove('hidden');
                    cancelFaceidButton.classList.add('hidden');
                    document.querySelector('.faceid-scan').classList.remove('success');

                    // Proceed to next method
                    proceedToNextMFAMethod();
                }, 1000);
            }, 1500);
        }, 1500);
    });

    cancelFaceidButton.addEventListener('click', () => {
        // Cancel the face recognition process
        document.querySelector('.faceid-scan').classList.remove('scanning');
        document.querySelector('.faceid-scan').classList.remove('success');
        faceidStatusText.textContent = 'Face ID verification cancelled.';

        // Reset UI
        verifyFaceidButton.classList.remove('hidden');
        cancelFaceidButton.classList.add('hidden');
    });

    backToMfaFromFaceidLink.addEventListener('click', (e) => {
        e.preventDefault();

        // Cancel any ongoing verification
        document.querySelector('.faceid-scan').classList.remove('scanning');
        document.querySelector('.faceid-scan').classList.remove('success');

        // Reset UI
        verifyFaceidButton.classList.remove('hidden');
        cancelFaceidButton.classList.add('hidden');

        showScreen('mfaOptions');
    });

    // Event Listeners - Fingerprint Screen
    verifyFingerprintButton.addEventListener('click', () => {
        clearError('fingerprint-error-message');

        // Hide verify button and show cancel button
        verifyFingerprintButton.classList.add('hidden');
        cancelFingerprintButton.classList.remove('hidden');

        // Update status
        fingerprintStatusText.textContent = 'Place your finger on the sensor...';

        // Simulate fingerprint scanning animation
        document.querySelector('.fingerprint-scan').classList.add('scanning');

        // Simulate fingerprint recognition process (3 seconds)
        setTimeout(() => {
            // In a real app, this would use the device's fingerprint API
            fingerprintStatusText.textContent = 'Fingerprint detected! Verifying...';

            setTimeout(() => {
                // Simulate successful verification
                fingerprintStatusText.textContent = 'Fingerprint verified successfully!';
                document.querySelector('.fingerprint-scan').classList.remove('scanning');
                document.querySelector('.fingerprint-scan').classList.add('success');

                // Mark Fingerprint as completed
                completedMFAMethods.push('fingerprint');

                // Proceed to next MFA method or success screen after a short delay
                setTimeout(() => {
                    // Reset UI for next time
                    verifyFingerprintButton.classList.remove('hidden');
                    cancelFingerprintButton.classList.add('hidden');
                    document.querySelector('.fingerprint-scan').classList.remove('success');

                    // Proceed to next method
                    proceedToNextMFAMethod();
                }, 1000);
            }, 1500);
        }, 1500);
    });

    cancelFingerprintButton.addEventListener('click', () => {
        // Cancel the fingerprint recognition process
        document.querySelector('.fingerprint-scan').classList.remove('scanning');
        document.querySelector('.fingerprint-scan').classList.remove('success');
        fingerprintStatusText.textContent = 'Fingerprint verification cancelled.';

        // Reset UI
        verifyFingerprintButton.classList.remove('hidden');
        cancelFingerprintButton.classList.add('hidden');
    });

    backToMfaFromFingerprintLink.addEventListener('click', (e) => {
        e.preventDefault();

        // Cancel any ongoing verification
        document.querySelector('.fingerprint-scan').classList.remove('scanning');
        document.querySelector('.fingerprint-scan').classList.remove('success');

        // Reset UI
        verifyFingerprintButton.classList.remove('hidden');
        cancelFingerprintButton.classList.add('hidden');

        showScreen('mfaOptions');
    });

    // Function to update the success screen with authentication details
    function updateSuccessScreen() {
        // Get the authentication level text
        let authLevelText = '';
        if (selectedAuthLevel === 'two-factor') {
            authLevelText = 'Two-Factor Authentication';
        } else if (selectedAuthLevel === 'three-factor') {
            authLevelText = 'Three-Factor Authentication';
        } else if (selectedAuthLevel === 'four-factor') {
            authLevelText = 'Four-Factor Authentication';
        }

        // Get the verification methods that were actually selected
        const methodNames = {
            'sms': 'SMS OTP',
            'email': 'Email OTP',
            'authenticator': 'Authenticator App',
            'mpin': 'MPIN',
            'faceid': 'Face ID',
            'fingerprint': 'Fingerprint'
        };

        // Log the completed and selected methods for debugging
        console.log('Selected MFA methods:', selectedMFAMethods);
        console.log('Completed MFA methods:', completedMFAMethods);

        // Determine how many methods to include based on authentication level
        let methodsToInclude = 1;
        if (selectedAuthLevel === 'three-factor') methodsToInclude = 2;
        if (selectedAuthLevel === 'four-factor') methodsToInclude = 3;

        // Get only the required number of methods
        const limitedMethods = selectedMFAMethods.slice(0, methodsToInclude);
        console.log('Limited methods for display:', limitedMethods);

        // Convert method IDs to friendly names
        const selectedMethodsList = limitedMethods.map(method => methodNames[method] || method);
        const methodsList = selectedMethodsList.join(', ');

        // Update the user profile and summary card with the authentication details
        document.getElementById('summary-username').textContent = currentUser.username;
        document.getElementById('summary-auth-level').textContent = authLevelText;
        document.getElementById('summary-methods').textContent = methodsList;
    }

    // Event Listeners - Success Screen
    continueButton.addEventListener('click', () => {
        // Update dashboard information
        updateDashboardInfo();

        // Show dashboard screen
        showScreen('dashboard');
    });

    // Function to update dashboard information
    function updateDashboardInfo() {
        // Update username
        document.getElementById('dashboard-username').textContent = currentUser.username;

        // Update authentication level
        let authLevelText = 'Two-Factor Authentication';
        if (selectedAuthLevel === 'three-factor') authLevelText = 'Three-Factor Authentication';
        if (selectedAuthLevel === 'four-factor') authLevelText = 'Four-Factor Authentication';
        document.getElementById('dashboard-auth-level').textContent = authLevelText;

        // Get the verification methods that were actually selected
        const methodNames = {
            'sms': 'SMS OTP',
            'email': 'Email OTP',
            'authenticator': 'Authenticator App',
            'mpin': 'MPIN',
            'faceid': 'Face ID',
            'fingerprint': 'Fingerprint'
        };

        // Determine how many methods to include based on authentication level
        let methodsToInclude = 1;
        if (selectedAuthLevel === 'three-factor') methodsToInclude = 2;
        if (selectedAuthLevel === 'four-factor') methodsToInclude = 3;

        // Get only the required number of methods
        const limitedMethods = selectedMFAMethods.slice(0, methodsToInclude);

        // Convert method IDs to friendly names
        const selectedMethodsList = limitedMethods.map(method => methodNames[method] || method);
        const methodsList = selectedMethodsList.join(', ');

        document.getElementById('dashboard-methods').textContent = methodsList;
    }
});
