/**
 * Language selector functionality
 */

// Language translations
const translations = {
    en: {
        login: {
            title: "Secure Login",
            subtitle: "Enter your credentials to continue",
            username: "Username",
            password: "Password",
            rememberMe: "Remember me",
            forgotPassword: "Forgot password?",
            loginButton: "Log In",
            usernameRequired: "Username is required",
            passwordRequired: "Password is required",
            invalidPassword: "Invalid password",
            passwordResetMessage: "Password reset functionality would be implemented here. For testing, use Password@123"
        },
        verification: {
            title: "Verification Required",
            subtitle: "Please complete this verification step to continue:",
            additionalTitle: "Additional Verification",
            finalTitle: "Final Verification",
            smsTitle: "SMS Verification",
            smsDescription: "A verification code has been sent to your phone number",
            emailTitle: "Email Verification",
            emailDescription: "A verification code has been sent to your email address",
            authenticatorTitle: "Authenticator App",
            authenticatorDescription: "Open your authenticator app and enter the current code",
            fingerprintTitle: "Fingerprint Verification",
            fingerprintDescription: "Please use your fingerprint sensor to verify your identity",
            mpinTitle: "MPIN Verification",
            mpinDescription: "Enter your 4-digit MPIN to verify your identity",
            verifyButton: "Verify Code",
            resendCode: "Resend code in",
            seconds: "seconds",
            resendButton: "Resend code"
        },
        success: {
            title: "Login Successful",
            message: "You have successfully logged in and can now access the system",
            logoutButton: "Log Out"
        }
    },
    fr: {
        login: {
            title: "Connexion Sécurisée",
            subtitle: "Entrez vos identifiants pour continuer",
            username: "Nom d'utilisateur",
            password: "Mot de passe",
            rememberMe: "Se souvenir de moi",
            forgotPassword: "Mot de passe oublié?",
            loginButton: "Se Connecter",
            usernameRequired: "Nom d'utilisateur requis",
            passwordRequired: "Mot de passe requis",
            invalidPassword: "Mot de passe invalide",
            passwordResetMessage: "La fonctionnalité de réinitialisation du mot de passe serait implémentée ici. Pour tester, utilisez Password@123"
        },
        verification: {
            title: "Vérification Requise",
            subtitle: "Veuillez compléter cette étape de vérification pour continuer:",
            additionalTitle: "Vérification Supplémentaire",
            finalTitle: "Vérification Finale",
            smsTitle: "Vérification par SMS",
            smsDescription: "Un code de vérification a été envoyé à votre numéro de téléphone",
            emailTitle: "Vérification par Email",
            emailDescription: "Un code de vérification a été envoyé à votre adresse email",
            authenticatorTitle: "Application d'Authentification",
            authenticatorDescription: "Ouvrez votre application d'authentification et entrez le code actuel",
            fingerprintTitle: "Vérification d'Empreinte Digitale",
            fingerprintDescription: "Veuillez utiliser votre capteur d'empreintes digitales pour vérifier votre identité",
            mpinTitle: "Vérification MPIN",
            mpinDescription: "Entrez votre MPIN à 4 chiffres pour vérifier votre identité",
            verifyButton: "Vérifier le Code",
            resendCode: "Renvoyer le code dans",
            seconds: "secondes",
            resendButton: "Renvoyer le code"
        },
        success: {
            title: "Connexion Réussie",
            message: "Vous vous êtes connecté avec succès et pouvez maintenant accéder au système",
            logoutButton: "Se Déconnecter"
        }
    },
    hi: {
        login: {
            title: "सुरक्षित लॉगिन",
            subtitle: "जारी रखने के लिए अपना क्रेडेंशियल दर्ज करें",
            username: "उपयोगकर्ता नाम",
            password: "पासवर्ड",
            rememberMe: "मुझे याद रखें",
            forgotPassword: "पासवर्ड भूल गए?",
            loginButton: "लॉग इन करें",
            usernameRequired: "उपयोगकर्ता नाम आवश्यक है",
            passwordRequired: "पासवर्ड आवश्यक है",
            invalidPassword: "अमान्य पासवर्ड",
            passwordResetMessage: "पासवर्ड रीसेट कार्यक्षमता यहां लागू की जाएगी। परीक्षण के लिए, Password@123 का उपयोग करें"
        },
        verification: {
            title: "सत्यापन आवश्यक",
            subtitle: "जारी रखने के लिए कृपया इस सत्यापन चरण को पूरा करें:",
            additionalTitle: "अतिरिक्त सत्यापन",
            finalTitle: "अंतिम सत्यापन",
            smsTitle: "एसएमएस सत्यापन",
            smsDescription: "आपके फोन नंबर पर एक सत्यापन कोड भेजा गया है",
            emailTitle: "ईमेल सत्यापन",
            emailDescription: "आपके ईमेल पते पर एक सत्यापन कोड भेजा गया है",
            authenticatorTitle: "प्रमाणक ऐप",
            authenticatorDescription: "अपना प्रमाणक ऐप खोलें और वर्तमान कोड दर्ज करें",
            fingerprintTitle: "फिंगरप्रिंट सत्यापन",
            fingerprintDescription: "अपनी पहचान सत्यापित करने के लिए कृपया अपने फिंगरप्रिंट सेंसर का उपयोग करें",
            mpinTitle: "MPIN सत्यापन",
            mpinDescription: "अपनी पहचान सत्यापित करने के लिए अपना 4-अंकीय MPIN दर्ज करें",
            verifyButton: "कोड सत्यापित करें",
            resendCode: "कोड पुनः भेजें",
            seconds: "सेकंड में",
            resendButton: "कोड पुनः भेजें"
        },
        success: {
            title: "लॉगिन सफल",
            message: "आप सफलतापूर्वक लॉग इन हो चुके हैं और अब सिस्टम का उपयोग कर सकते हैं",
            logoutButton: "लॉग आउट"
        }
    }
};

// Default language
let currentLanguage = 'en';

/**
 * Initialize the language selector
 */
function initLanguageSelector() {
    const languageSelector = document.getElementById('language-selector');

    if (!languageSelector) {
        console.error('Language selector not found');
        return;
    }

    // Set initial language from localStorage or browser preference
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && translations[savedLanguage]) {
        currentLanguage = savedLanguage;
        languageSelector.value = currentLanguage;
    } else {
        // Try to detect browser language (only for supported languages: en, fr, hi)
        const browserLang = navigator.language.split('-')[0];
        if (browserLang === 'en' || browserLang === 'fr' || browserLang === 'hi') {
            currentLanguage = browserLang;
            languageSelector.value = currentLanguage;
        } else {
            // Default to English
            currentLanguage = 'en';
            languageSelector.value = 'en';
        }
    }

    // Apply initial translations
    applyTranslations();

    // Add event listener for language change
    languageSelector.addEventListener('change', function() {
        currentLanguage = this.value;
        localStorage.setItem('preferredLanguage', currentLanguage);
        applyTranslations();
    });
}

/**
 * Apply translations to the page
 */
function applyTranslations() {
    // Only apply translations if the elements exist
    // This is a simplified implementation - in a real app, you would use a more robust approach

    const lang = translations[currentLanguage];

    // Login form translations
    const loginTitle = document.querySelector('.auth-form h2');
    const loginSubtitle = document.querySelector('.auth-form p');
    const usernameLabel = document.querySelector('label[for="username"]');
    const passwordLabel = document.querySelector('label[for="password"]');
    const rememberMeLabel = document.querySelector('label[for="remember-me"]');
    const forgotPasswordLink = document.querySelector('.forgot-password');
    const loginButton = document.querySelector('#login-form button[type="submit"]');

    if (loginTitle) loginTitle.textContent = lang.login.title;
    if (loginSubtitle) loginSubtitle.textContent = lang.login.subtitle;
    if (usernameLabel) usernameLabel.textContent = lang.login.username;
    if (passwordLabel) passwordLabel.textContent = lang.login.password;
    if (rememberMeLabel) rememberMeLabel.textContent = lang.login.rememberMe;
    if (forgotPasswordLink) forgotPasswordLink.textContent = lang.login.forgotPassword;
    if (loginButton) loginButton.textContent = lang.login.loginButton;

    // Update placeholders
    const usernameInput = document.querySelector('#username');
    const passwordInput = document.querySelector('#password');

    if (usernameInput) usernameInput.placeholder = `${lang.login.username}...`;
    if (passwordInput) passwordInput.placeholder = `${lang.login.password}...`;

    // Make sure the eye icon is preserved
    const togglePasswordButton = document.querySelector('#toggle-password');
    if (togglePasswordButton && passwordInput) {
        // Ensure the toggle button is properly attached to the password field
        const passwordType = passwordInput.getAttribute('type');
        const eyeIcon = togglePasswordButton.querySelector('.eye-icon-svg');

        if (eyeIcon) {
            if (passwordType === 'text') {
                eyeIcon.classList.add('visible');
            } else {
                eyeIcon.classList.remove('visible');
            }
        }

        // Reattach event listener to ensure it works after language change
        togglePasswordButton.removeEventListener('click', window.togglePasswordVisibility);
        togglePasswordButton.addEventListener('click', window.togglePasswordVisibility || function() {
            // Fallback toggle function if the global one isn't available
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            if (eyeIcon) {
                if (type === 'password') {
                    eyeIcon.classList.remove('visible');
                } else {
                    eyeIcon.classList.add('visible');
                }
            }
        });
    }
}

// Initialize language selector when DOM is loaded
document.addEventListener('DOMContentLoaded', initLanguageSelector);

// Export for use in other files
window.translations = translations;
window.currentLanguage = currentLanguage;
window.applyTranslations = applyTranslations;
