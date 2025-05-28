document.addEventListener('DOMContentLoaded', function() {
    const sign_in_btn = document.querySelector("#sign-in-btn");
    const sign_up_btn = document.querySelector("#sign-up-btn");
    const container = document.querySelector(".container");
    const signInForm = document.querySelector(".sign-in-form");
    const signUpForm = document.querySelector(".sign-up-form");
    const inputs = document.querySelectorAll("input:not([type='submit']):not([type='checkbox'])");

    // Theme toggle elements
    const themeToggle = document.querySelector("#theme-toggle");
    const themeIcon = document.querySelector("#theme-icon");
    const html = document.documentElement;

    // Branch dropdown elements
    const branchField = document.querySelector(".dropdown-field");
    const branchInput = document.querySelector("#branch-input");
    const branchDropdown = document.querySelector("#branch-dropdown");
    const branchSearch = document.querySelector("#branch-search");
    const branchOptions = document.querySelector("#branch-options");

    // Language selector elements
    const languageSelector = document.querySelector(".language-selector");
    const languageToggle = document.querySelector("#language-toggle");
    const languageMenu = document.querySelector("#language-menu");
    const currentLanguageSpan = document.querySelector("#current-language");
    const languageOptions = document.querySelectorAll(".language-option");

    // Standardized branch data (Branch1 to Branch20)
    const branches = Array.from({length: 20}, (_, i) => `Branch${i + 1}`).sort();

    // Translation data
    const translations = {
        en: {
            'brand-name': 'HCLSoftware',
            'tagline': 'Fueling the Digital + Economy',
            'login-title': 'Login',
            'signup-title': 'Sign up',
            'username-email-phone-placeholder': 'Username, Email, or Phone Number',
            'email-phone-placeholder': 'Email or Phone Number',
            'password-placeholder': 'Password',
            'username-placeholder': 'Username',
            'confirm-password-placeholder': 'Confirm Password',
            'select-branch-placeholder': 'Select Branch',
            'search-branches-placeholder': 'Search branches...',
            'remember-me': 'Remember me',
            'forgot-password': 'Forgot password?',
            'login-button': 'Login',
            'signup-button': 'Sign up',
            'social-login-text': 'Or Login with social platforms',
            'social-signup-text': 'Or Sign up with social platforms',
            'new-here-title': 'New here?',
            'new-here-text': 'Join our community today and discover amazing features!',
            'one-of-us-title': 'One of us?',
            'one-of-us-text': 'Welcome back! Login to access your account and continue your journey.',
            'email-required': 'Please enter a valid username, email, or phone number',
            'password-required': 'Password must be at least 6 characters',
            'username-required': 'Username is required',
            'passwords-not-match': 'Passwords do not match',
            'login-success': 'Login successful!',
            'login-failed': 'Invalid credentials. Please try again.',
            'signup-success': 'Account created successfully!'
        },
        es: {
            'brand-name': 'HCLSoftware',
            'tagline': 'Impulsando la Economía Digital +',
            'login-title': 'Iniciar Sesión',
            'signup-title': 'Registrarse',
            'username-email-phone-placeholder': 'Usuario, Correo o Teléfono',
            'email-phone-placeholder': 'Correo o Número de Teléfono',
            'password-placeholder': 'Contraseña',
            'username-placeholder': 'Usuario',
            'confirm-password-placeholder': 'Confirmar Contraseña',
            'select-branch-placeholder': 'Seleccionar Rama',
            'search-branches-placeholder': 'Buscar ramas...',
            'remember-me': 'Recordarme',
            'forgot-password': '¿Olvidaste tu contraseña?',
            'login-button': 'Iniciar Sesión',
            'signup-button': 'Registrarse',
            'social-login-text': 'O inicia sesión con plataformas sociales',
            'social-signup-text': 'O regístrate con plataformas sociales',
            'new-here-title': '¿Nuevo aquí?',
            'new-here-text': '¡Únete a nuestra comunidad hoy y descubre características increíbles!',
            'one-of-us-title': '¿Uno de nosotros?',
            'one-of-us-text': '¡Bienvenido de vuelta! Inicia sesión para acceder a tu cuenta y continuar tu viaje.',
            'email-required': 'Por favor ingresa un usuario, correo o teléfono válido',
            'password-required': 'La contraseña debe tener al menos 6 caracteres',
            'username-required': 'El usuario es requerido',
            'passwords-not-match': 'Las contraseñas no coinciden',
            'login-success': '¡Inicio de sesión exitoso!',
            'login-failed': 'Credenciales inválidas. Inténtalo de nuevo.',
            'signup-success': '¡Cuenta creada exitosamente!'
        },
        fr: {
            'brand-name': 'HCLSoftware',
            'tagline': 'Alimenter l\'Économie Numérique +',
            'login-title': 'Connexion',
            'signup-title': 'S\'inscrire',
            'email-phone-placeholder': 'Email ou Numéro de Téléphone',
            'password-placeholder': 'Mot de Passe',
            'fullname-placeholder': 'Nom Complet',
            'confirm-password-placeholder': 'Confirmer le Mot de Passe',
            'select-branch-placeholder': 'Sélectionner une Branche',
            'search-branches-placeholder': 'Rechercher des branches...',
            'remember-me': 'Se souvenir de moi',
            'forgot-password': 'Mot de passe oublié?',
            'login-button': 'Connexion',
            'signup-button': 'S\'inscrire',
            'social-login-text': 'Ou connectez-vous avec les plateformes sociales',
            'social-signup-text': 'Ou inscrivez-vous avec les plateformes sociales',
            'new-here-title': 'Nouveau ici?',
            'new-here-text': 'Rejoignez notre communauté aujourd\'hui et découvrez des fonctionnalités incroyables!',
            'one-of-us-title': 'L\'un d\'entre nous?',
            'one-of-us-text': 'Bon retour! Connectez-vous pour accéder à votre compte et continuer votre voyage.',
            'email-required': 'Veuillez entrer un email ou téléphone valide',
            'password-required': 'Le mot de passe doit contenir au moins 6 caractères',
            'name-required': 'Le nom est requis',
            'passwords-not-match': 'Les mots de passe ne correspondent pas',
            'login-success': 'Connexion réussie! (Ceci est une démo)',
            'signup-success': 'Compte créé avec succès! (Ceci est une démo)'
        },
        de: {
            'brand-name': 'HCLSoftware',
            'tagline': 'Die Digitale + Wirtschaft Antreiben',
            'login-title': 'Anmelden',
            'signup-title': 'Registrieren',
            'email-phone-placeholder': 'E-Mail oder Telefonnummer',
            'password-placeholder': 'Passwort',
            'fullname-placeholder': 'Vollständiger Name',
            'confirm-password-placeholder': 'Passwort Bestätigen',
            'select-branch-placeholder': 'Zweig Auswählen',
            'search-branches-placeholder': 'Zweige suchen...',
            'remember-me': 'Angemeldet bleiben',
            'forgot-password': 'Passwort vergessen?',
            'login-button': 'Anmelden',
            'signup-button': 'Registrieren',
            'social-login-text': 'Oder melden Sie sich mit sozialen Plattformen an',
            'social-signup-text': 'Oder registrieren Sie sich mit sozialen Plattformen',
            'new-here-title': 'Neu hier?',
            'new-here-text': 'Treten Sie heute unserer Gemeinschaft bei und entdecken Sie erstaunliche Funktionen!',
            'one-of-us-title': 'Einer von uns?',
            'one-of-us-text': 'Willkommen zurück! Melden Sie sich an, um auf Ihr Konto zuzugreifen und Ihre Reise fortzusetzen.',
            'email-required': 'Bitte geben Sie eine gültige E-Mail oder Telefonnummer ein',
            'password-required': 'Das Passwort muss mindestens 6 Zeichen lang sein',
            'name-required': 'Name ist erforderlich',
            'passwords-not-match': 'Passwörter stimmen nicht überein',
            'login-success': 'Anmeldung erfolgreich! (Dies ist eine Demo)',
            'signup-success': 'Konto erfolgreich erstellt! (Dies ist eine Demo)'
        },
        zh: {
            'brand-name': 'HCLSoftware',
            'tagline': '推动数字+经济',
            'login-title': 'Aftermarket Life Cycle | 登录',
            'signup-title': 'Aftermarket Life Cycle | 注册',
            'email-phone-placeholder': '邮箱或电话号码',
            'password-placeholder': '密码',
            'fullname-placeholder': '全名',
            'confirm-password-placeholder': '确认密码',
            'select-branch-placeholder': '选择分支',
            'search-branches-placeholder': '搜索分支...',
            'remember-me': '记住我',
            'forgot-password': '忘记密码？',
            'login-button': '登录',
            'signup-button': '注册',
            'social-login-text': '或使用社交平台登录',
            'social-signup-text': '或使用社交平台注册',
            'new-here-title': '新用户？',
            'new-here-text': '今天就加入我们的社区，发现令人惊叹的功能！',
            'one-of-us-title': '老用户？',
            'one-of-us-text': '欢迎回来！登录访问您的账户并继续您的旅程。',
            'email-required': '请输入有效的邮箱或电话号码',
            'password-required': '密码必须至少6个字符',
            'name-required': '姓名是必需的',
            'passwords-not-match': '密码不匹配',
            'login-success': '登录成功！（这是演示）',
            'signup-success': '账户创建成功！（这是演示）'
        }
    };

    // Initialize theme
    function initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        html.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }

    // Update theme icon
    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-moon';
        } else {
            themeIcon.className = 'fas fa-sun';
        }
    }

    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    // Keyboard navigation for theme toggle
    themeToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            themeToggle.click();
        }
    });

    // Language functionality
    function initializeLanguage() {
        const savedLanguage = localStorage.getItem('language') || 'en';
        setLanguage(savedLanguage);
    }

    function setLanguage(langCode) {
        const langData = translations[langCode] || translations['en'];

        // Update text content
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (langData[key]) {
                element.textContent = langData[key];
            }
        });

        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (langData[key]) {
                element.placeholder = langData[key];
            }
        });

        // Update button values
        document.querySelectorAll('[data-i18n-value]').forEach(element => {
            const key = element.getAttribute('data-i18n-value');
            if (langData[key]) {
                element.value = langData[key];
            }
        });

        // Update current language display
        const languageNames = {
            'en': 'EN',
            'es': 'ES',
            'fr': 'FR',
            'de': 'DE',
            'zh': '中'
        };
        currentLanguageSpan.textContent = languageNames[langCode] || 'EN';

        // Update selected language option
        languageOptions.forEach(option => {
            option.classList.remove('selected');
            if (option.getAttribute('data-lang') === langCode) {
                option.classList.add('selected');
            }
        });

        // Store language preference
        localStorage.setItem('language', langCode);

        // Store current language for error messages
        window.currentLanguage = langCode;
    }

    // Language selector event listeners
    languageToggle.addEventListener('click', (e) => {
        e.preventDefault();
        languageSelector.classList.toggle('active');
    });

    languageOptions.forEach(option => {
        option.addEventListener('click', () => {
            const langCode = option.getAttribute('data-lang');
            setLanguage(langCode);
            languageSelector.classList.remove('active');
        });
    });

    // Close language menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!languageSelector.contains(e.target)) {
            languageSelector.classList.remove('active');
        }
    });

    // Keyboard navigation for language selector
    languageToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            languageSelector.classList.toggle('active');
        }
    });

    // Toggle between sign up and sign in
    sign_up_btn.addEventListener("click", () => {
        container.classList.add("sign-up-mode");
        updatePageTitle();
    });

    sign_in_btn.addEventListener("click", () => {
        container.classList.remove("sign-up-mode");
        updatePageTitle();
    });

    // Branch dropdown functionality
    function initializeBranchDropdown() {
        // Populate dropdown options
        branchOptions.innerHTML = '';
        branches.forEach(branch => {
            const option = document.createElement('div');
            option.className = 'dropdown-option';
            option.textContent = branch;
            option.addEventListener('click', () => selectBranch(branch));
            branchOptions.appendChild(option);
        });
    }

    function selectBranch(branch) {
        branchInput.value = branch;
        branchField.classList.remove('active');
        branchField.classList.add('focused');
    }

    function filterBranches(searchTerm) {
        const options = branchOptions.querySelectorAll('.dropdown-option');
        options.forEach(option => {
            const text = option.textContent.toLowerCase();
            const matches = text.includes(searchTerm.toLowerCase());
            option.classList.toggle('hidden', !matches);
        });
    }

    // Branch dropdown event listeners
    branchInput.addEventListener('click', (e) => {
        e.preventDefault();
        branchField.classList.toggle('active');
        if (branchField.classList.contains('active')) {
            branchSearch.focus();
        }
    });

    branchSearch.addEventListener('input', (e) => {
        filterBranches(e.target.value);
    });

    branchSearch.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            branchField.classList.remove('active');
            branchInput.focus();
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!branchField.contains(e.target)) {
            branchField.classList.remove('active');
        }
    });

    // Keyboard navigation for dropdown
    branchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
            e.preventDefault();
            branchField.classList.add('active');
            branchSearch.focus();
        }
    });

    // Form validation
    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function validatePhone(phone) {
        const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        return re.test(String(phone));
    }

    function validateEmailOrPhone(value) {
        return validateEmail(value) || validatePhone(value);
    }

    function validateUsername(username) {
        // Username should be at least 3 characters and contain only letters, numbers, and underscores
        const re = /^[a-zA-Z0-9_]{3,}$/;
        return re.test(username);
    }

    function validateUsernameEmailOrPhone(value) {
        return validateUsername(value) || validateEmail(value) || validatePhone(value);
    }

    // Hard-coded authentication credentials
    const hardCodedCredentials = {
        username: 'admin',
        password: '12345',
        branch: '1'
    };

    function authenticateUser(loginValue, password, branch) {
        // Check hard-coded credentials first
        if ((loginValue === hardCodedCredentials.username ||
             loginValue === 'admin@example.com' ||
             loginValue === '+1234567890') &&
            password === hardCodedCredentials.password &&
            (branch === hardCodedCredentials.branch || branch === 'Branch1')) {
            return true;
        }
        return false;
    }

    function showError(input, messageKey) {
        const formControl = input.parentElement;
        formControl.classList.add('error');

        // Create error message if it doesn't exist
        let errorMessage = formControl.querySelector('.error-message');
        if (!errorMessage) {
            errorMessage = document.createElement('small');
            errorMessage.className = 'error-message';
            errorMessage.style.color = 'var(--error-color)';
            errorMessage.style.position = 'absolute';
            errorMessage.style.bottom = '-20px';
            errorMessage.style.left = '15px';
            errorMessage.style.fontSize = '12px';
            formControl.appendChild(errorMessage);
        }

        // Get translated message
        const currentLang = window.currentLanguage || 'en';
        const langData = translations[currentLang] || translations['en'];
        const message = langData[messageKey] || messageKey;

        errorMessage.innerText = message;
    }

    function removeError(input) {
        const formControl = input.parentElement;
        formControl.classList.remove('error');

        const errorMessage = formControl.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    // Sign In Form Validation
    signInForm.addEventListener('submit', function(e) {
        e.preventDefault();

        let isValid = true;
        const loginValue = signInForm.querySelector('input[data-i18n-placeholder="username-email-phone-placeholder"]').value.trim();
        const password = signInForm.querySelector('input[type="password"]').value.trim();
        const branch = branchInput.value.trim();

        if (!validateUsernameEmailOrPhone(loginValue)) {
            showError(signInForm.querySelector('input[data-i18n-placeholder="username-email-phone-placeholder"]'), 'email-required');
            isValid = false;
        } else {
            removeError(signInForm.querySelector('input[data-i18n-placeholder="username-email-phone-placeholder"]'));
        }

        if (password.length < 6) {
            showError(signInForm.querySelector('input[type="password"]'), 'password-required');
            isValid = false;
        } else {
            removeError(signInForm.querySelector('input[type="password"]'));
        }

        if (isValid) {
            // Check authentication
            if (authenticateUser(loginValue, password, branch)) {
                // Show success animation and message
                showLoginSuccess();
                console.log('Login successful with credentials:', { loginValue, branch });
            } else {
                // Show failure animation and message
                showLoginFailure();
            }
        }
    });

    // Sign Up Form Validation
    signUpForm.addEventListener('submit', function(e) {
        e.preventDefault();

        let isValid = true;
        const username = signUpForm.querySelector('input[data-i18n-placeholder="username-placeholder"]').value.trim();
        const emailOrPhone = signUpForm.querySelector('input[data-i18n-placeholder="email-phone-placeholder"]').value.trim();
        const password = signUpForm.querySelector('input[data-i18n-placeholder="password-placeholder"]').value.trim();
        const confirmPassword = signUpForm.querySelector('input[data-i18n-placeholder="confirm-password-placeholder"]').value.trim();

        if (!validateUsername(username)) {
            showError(signUpForm.querySelector('input[data-i18n-placeholder="username-placeholder"]'), 'username-required');
            isValid = false;
        } else {
            removeError(signUpForm.querySelector('input[data-i18n-placeholder="username-placeholder"]'));
        }

        if (!validateEmailOrPhone(emailOrPhone)) {
            showError(signUpForm.querySelector('input[data-i18n-placeholder="email-phone-placeholder"]'), 'email-required');
            isValid = false;
        } else {
            removeError(signUpForm.querySelector('input[data-i18n-placeholder="email-phone-placeholder"]'));
        }

        if (password.length < 6) {
            showError(signUpForm.querySelector('input[data-i18n-placeholder="password-placeholder"]'), 'password-required');
            isValid = false;
        } else {
            removeError(signUpForm.querySelector('input[data-i18n-placeholder="password-placeholder"]'));
        }

        if (password !== confirmPassword) {
            showError(signUpForm.querySelector('input[data-i18n-placeholder="confirm-password-placeholder"]'), 'passwords-not-match');
            isValid = false;
        } else {
            removeError(signUpForm.querySelector('input[data-i18n-placeholder="confirm-password-placeholder"]'));
        }

        if (isValid) {
            // Here you would typically send the form data to your server
            console.log('Signup form is valid, submitting...');

            // Show success message with translation
            const currentLang = window.currentLanguage || 'en';
            const langData = translations[currentLang] || translations['en'];
            alert(langData['signup-success']);
        }
    });

    // Social media login handlers
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.querySelector('i').className.split(' ')[1].split('-')[1];
            alert(`${platform} login clicked! (This is a demo)`);
        });
    });

    // Enhanced input focus effects
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            if (input.value === '') {
                input.parentElement.classList.remove('focused');
            }
        });

        // Add keyboard navigation support
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                // Allow normal tab navigation
                return;
            }
        });
    });

    // Add focus effects for dropdown
    if (branchInput) {
        branchInput.addEventListener('focus', () => {
            branchField.classList.add('focused');
        });

        branchInput.addEventListener('blur', () => {
            if (branchInput.value === '' && !branchField.classList.contains('active')) {
                branchField.classList.remove('focused');
            }
        });
    }

    // Password toggle functionality
    function initializePasswordToggles() {
        const passwordToggles = document.querySelectorAll('.password-toggle');

        passwordToggles.forEach(toggle => {
            toggle.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');
                const passwordInput = document.getElementById(targetId);
                const icon = this.querySelector('i');

                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    passwordInput.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });

            // Keyboard support for password toggle
            toggle.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    }

    // Dynamic title update based on current form
    function updatePageTitle() {
        const isSignUpMode = container.classList.contains('sign-up-mode');

        if (isSignUpMode) {
            document.title = `Aftermarket Life Cycle | Sign Up`;
        } else {
            document.title = `Aftermarket Life Cycle | Login`;
        }
    }

    // Initialize components
    initializeTheme();
    initializeLanguage();
    initializeBranchDropdown();
    initializePasswordToggles();

    // Add ARIA attributes for accessibility
    if (themeToggle) {
        themeToggle.setAttribute('role', 'button');
        themeToggle.setAttribute('aria-pressed', 'false');
    }

    if (languageToggle) {
        languageToggle.setAttribute('role', 'button');
        languageToggle.setAttribute('aria-expanded', 'false');
        languageToggle.setAttribute('aria-haspopup', 'listbox');
    }

    if (languageMenu) {
        languageMenu.setAttribute('role', 'listbox');
    }

    if (branchInput) {
        branchInput.setAttribute('role', 'combobox');
        branchInput.setAttribute('aria-expanded', 'false');
        branchInput.setAttribute('aria-haspopup', 'listbox');
    }

    if (branchDropdown) {
        branchDropdown.setAttribute('role', 'listbox');
    }

    // Animation functions for login feedback
    function showLoginSuccess() {
        const currentLang = window.currentLanguage || 'en';
        const langData = translations[currentLang] || translations['en'];

        // Add success class to form for animation
        signInForm.classList.add('login-success');

        // Create success message element
        const successMessage = document.createElement('div');
        successMessage.className = 'login-message success-message';
        successMessage.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${langData['login-success']}</span>
        `;

        // Insert message after the form
        signInForm.appendChild(successMessage);

        // Trigger animation
        setTimeout(() => {
            successMessage.classList.add('show');
        }, 100);

        // Remove message and redirect after delay
        setTimeout(() => {
            successMessage.classList.remove('show');
            setTimeout(() => {
                successMessage.remove();
                signInForm.classList.remove('login-success');
                // Redirect to dashboard
                console.log('Redirecting to dashboard...');
                window.location.href = '../dashboard/index.html';
            }, 300);
        }, 2000);
    }

    function showLoginFailure() {
        const currentLang = window.currentLanguage || 'en';
        const langData = translations[currentLang] || translations['en'];

        // Add failure class to form for shake animation
        signInForm.classList.add('login-failure');

        // Create error message element
        const errorMessage = document.createElement('div');
        errorMessage.className = 'login-message error-message';
        errorMessage.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${langData['login-failed']}</span>
        `;

        // Insert message after the form
        signInForm.appendChild(errorMessage);

        // Trigger animation
        setTimeout(() => {
            errorMessage.classList.add('show');
        }, 100);

        // Remove message after delay
        setTimeout(() => {
            errorMessage.classList.remove('show');
            setTimeout(() => {
                errorMessage.remove();
                signInForm.classList.remove('login-failure');
            }, 300);
        }, 3000);
    }
});
