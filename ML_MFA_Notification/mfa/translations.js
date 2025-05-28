// Translations for the MFA Login System
const translations = {
    en: {
        // Login Screen
        loginFormTitle: "Login Form",
        username: "Username",
        usernamePlaceholder: "Enter your username",
        password: "Password",
        passwordPlaceholder: "Enter your password",
        rememberMe: "Remember me",
        forgotPassword: "Forgot password?",
        loginButton: "Log In",
        noAccount: "Don't have an account?",
        register: "Register",
        
        // Authentication Level Screen
        securityVerification: "Security Verification",
        selectAuthLevel: "Please select your preferred authentication level:",
        twoFactorTitle: "Two-Factor Authentication",
        twoFactorDesc: "Standard security with one verification method",
        threeFactorTitle: "Three-Factor Authentication",
        threeFactorDesc: "Enhanced security with two verification methods",
        fourFactorTitle: "Four-Factor Authentication",
        fourFactorDesc: "Maximum security with three verification methods",
        clickToContinue: "Click on an authentication level to continue",
        back: "Back",
        
        // MFA Options Screen
        verificationHeader: "Select Your Verification Method",
        verificationHeaderMultiple: "Select Your Verification Methods",
        selectOneMethod: "Select any one from this row",
        continueButton: "Continue",
        
        // SMS OTP Screen
        smsVerification: "SMS Verification",
        enterSmsCode: "Enter the 6-digit code sent to your phone number",
        verificationCode: "Verification Code",
        smsCodePlaceholder: "Enter 6-digit code",
        codeExpires: "Code expires in:",
        verifyCode: "Verify Code",
        resendCode: "Resend Code",
        
        // Email OTP Screen
        emailVerification: "Email Verification",
        enterEmailCode: "Enter the verification code sent to your email address",
        emailCodePlaceholder: "Enter verification code",
        
        // Authenticator Screen
        authenticatorApp: "Authenticator App",
        authenticatorInstructions: "Open your authenticator app (Google Authenticator, Microsoft Authenticator etc.) and enter the current code.",
        
        // MPIN Screen
        mpinVerification: "MPIN Verification",
        enterMpin: "Enter your 4-digit MPIN.",
        verifyMpin: "Verify MPIN",
        
        // Face ID Screen
        faceIdVerification: "Face ID Verification",
        faceIdInstructions: "Please look at the camera to verify your identity.",
        waitingForCamera: "Waiting for camera...",
        startFaceId: "Start Face ID",
        cancel: "Cancel",
        
        // Fingerprint Screen
        fingerprintVerification: "Fingerprint Verification",
        fingerprintInstructions: "Place your finger on the fingerprint sensor to verify your identity.",
        waitingForFingerprint: "Waiting for fingerprint...",
        startFingerprint: "Start Fingerprint Scan",
        
        // Success Screen
        loginSuccessful: "Login Successful",
        authenticationSummary: "Authentication Summary",
        user: "User:",
        authLevel: "Authentication Level:",
        verificationMethods: "Verification Methods:",
        sessionSecured: "Session secured successfully",
        continue: "Continue",
        
        // Language Selector
        selectLanguage: "Select Language"
    },
    hi: {
        // Login Screen
        loginFormTitle: "लॉगिन फॉर्म",
        username: "उपयोगकर्ता नाम",
        usernamePlaceholder: "अपना उपयोगकर्ता नाम दर्ज करें",
        password: "पासवर्ड",
        passwordPlaceholder: "अपना पासवर्ड दर्ज करें",
        rememberMe: "मुझे याद रखें",
        forgotPassword: "पासवर्ड भूल गए?",
        loginButton: "लॉग इन करें",
        noAccount: "खाता नहीं है?",
        register: "रजिस्टर करें",
        
        // Authentication Level Screen
        securityVerification: "सुरक्षा सत्यापन",
        selectAuthLevel: "कृपया अपना पसंदीदा प्रमाणीकरण स्तर चुनें:",
        twoFactorTitle: "दो-कारक प्रमाणीकरण",
        twoFactorDesc: "एक सत्यापन विधि के साथ मानक सुरक्षा",
        threeFactorTitle: "तीन-कारक प्रमाणीकरण",
        threeFactorDesc: "दो सत्यापन विधियों के साथ बढ़ी हुई सुरक्षा",
        fourFactorTitle: "चार-कारक प्रमाणीकरण",
        fourFactorDesc: "तीन सत्यापन विधियों के साथ अधिकतम सुरक्षा",
        clickToContinue: "जारी रखने के लिए प्रमाणीकरण स्तर पर क्लिक करें",
        back: "वापस",
        
        // MFA Options Screen
        verificationHeader: "अपनी सत्यापन विधि चुनें",
        verificationHeaderMultiple: "अपनी सत्यापन विधियां चुनें",
        selectOneMethod: "इस पंक्ति से कोई एक चुनें",
        continueButton: "जारी रखें",
        
        // SMS OTP Screen
        smsVerification: "एसएमएस सत्यापन",
        enterSmsCode: "अपने फोन नंबर पर भेजे गए 6-अंकों का कोड दर्ज करें",
        verificationCode: "सत्यापन कोड",
        smsCodePlaceholder: "6-अंकों का कोड दर्ज करें",
        codeExpires: "कोड समाप्त होता है:",
        verifyCode: "कोड सत्यापित करें",
        resendCode: "कोड पुनः भेजें",
        
        // Email OTP Screen
        emailVerification: "ईमेल सत्यापन",
        enterEmailCode: "अपने ईमेल पते पर भेजे गए सत्यापन कोड को दर्ज करें",
        emailCodePlaceholder: "सत्यापन कोड दर्ज करें",
        
        // Authenticator Screen
        authenticatorApp: "प्रमाणक ऐप",
        authenticatorInstructions: "अपना प्रमाणक ऐप (Google Authenticator, Microsoft Authenticator आदि) खोलें और वर्तमान कोड दर्ज करें।",
        
        // MPIN Screen
        mpinVerification: "MPIN सत्यापन",
        enterMpin: "अपना 4-अंकों का MPIN दर्ज करें।",
        verifyMpin: "MPIN सत्यापित करें",
        
        // Face ID Screen
        faceIdVerification: "फेस आईडी सत्यापन",
        faceIdInstructions: "अपनी पहचान सत्यापित करने के लिए कृपया कैमरे को देखें।",
        waitingForCamera: "कैमरे का इंतज़ार है...",
        startFaceId: "फेस आईडी शुरू करें",
        cancel: "रद्द करें",
        
        // Fingerprint Screen
        fingerprintVerification: "फिंगरप्रिंट सत्यापन",
        fingerprintInstructions: "अपनी पहचान सत्यापित करने के लिए फिंगरप्रिंट सेंसर पर अपनी उंगली रखें।",
        waitingForFingerprint: "फिंगरप्रिंट का इंतज़ार है...",
        startFingerprint: "फिंगरप्रिंट स्कैन शुरू करें",
        
        // Success Screen
        loginSuccessful: "लॉगिन सफल",
        authenticationSummary: "प्रमाणीकरण सारांश",
        user: "उपयोगकर्ता:",
        authLevel: "प्रमाणीकरण स्तर:",
        verificationMethods: "सत्यापन विधियां:",
        sessionSecured: "सत्र सफलतापूर्वक सुरक्षित किया गया",
        continue: "जारी रखें",
        
        // Language Selector
        selectLanguage: "भाषा चुनें"
    },
    fr: {
        // Login Screen
        loginFormTitle: "Formulaire de Connexion",
        username: "Nom d'utilisateur",
        usernamePlaceholder: "Entrez votre nom d'utilisateur",
        password: "Mot de passe",
        passwordPlaceholder: "Entrez votre mot de passe",
        rememberMe: "Se souvenir de moi",
        forgotPassword: "Mot de passe oublié?",
        loginButton: "Se connecter",
        noAccount: "Vous n'avez pas de compte?",
        register: "S'inscrire",
        
        // Authentication Level Screen
        securityVerification: "Vérification de Sécurité",
        selectAuthLevel: "Veuillez sélectionner votre niveau d'authentification préféré:",
        twoFactorTitle: "Authentification à Deux Facteurs",
        twoFactorDesc: "Sécurité standard avec une méthode de vérification",
        threeFactorTitle: "Authentification à Trois Facteurs",
        threeFactorDesc: "Sécurité renforcée avec deux méthodes de vérification",
        fourFactorTitle: "Authentification à Quatre Facteurs",
        fourFactorDesc: "Sécurité maximale avec trois méthodes de vérification",
        clickToContinue: "Cliquez sur un niveau d'authentification pour continuer",
        back: "Retour",
        
        // MFA Options Screen
        verificationHeader: "Sélectionnez Votre Méthode de Vérification",
        verificationHeaderMultiple: "Sélectionnez Vos Méthodes de Vérification",
        selectOneMethod: "Sélectionnez-en un dans cette rangée",
        continueButton: "Continuer",
        
        // SMS OTP Screen
        smsVerification: "Vérification par SMS",
        enterSmsCode: "Entrez le code à 6 chiffres envoyé à votre numéro de téléphone",
        verificationCode: "Code de vérification",
        smsCodePlaceholder: "Entrez le code à 6 chiffres",
        codeExpires: "Le code expire dans:",
        verifyCode: "Vérifier le Code",
        resendCode: "Renvoyer le Code",
        
        // Email OTP Screen
        emailVerification: "Vérification par Email",
        enterEmailCode: "Entrez le code de vérification envoyé à votre adresse email",
        emailCodePlaceholder: "Entrez le code de vérification",
        
        // Authenticator Screen
        authenticatorApp: "Application d'Authentification",
        authenticatorInstructions: "Ouvrez votre application d'authentification (Google Authenticator, Microsoft Authenticator, etc.) et entrez le code actuel.",
        
        // MPIN Screen
        mpinVerification: "Vérification MPIN",
        enterMpin: "Entrez votre MPIN à 4 chiffres.",
        verifyMpin: "Vérifier MPIN",
        
        // Face ID Screen
        faceIdVerification: "Vérification Face ID",
        faceIdInstructions: "Veuillez regarder la caméra pour vérifier votre identité.",
        waitingForCamera: "En attente de la caméra...",
        startFaceId: "Démarrer Face ID",
        cancel: "Annuler",
        
        // Fingerprint Screen
        fingerprintVerification: "Vérification d'Empreinte Digitale",
        fingerprintInstructions: "Placez votre doigt sur le capteur d'empreintes digitales pour vérifier votre identité.",
        waitingForFingerprint: "En attente d'empreinte digitale...",
        startFingerprint: "Démarrer le Scan d'Empreinte",
        
        // Success Screen
        loginSuccessful: "Connexion Réussie",
        authenticationSummary: "Résumé d'Authentification",
        user: "Utilisateur:",
        authLevel: "Niveau d'Authentification:",
        verificationMethods: "Méthodes de Vérification:",
        sessionSecured: "Session sécurisée avec succès",
        continue: "Continuer",
        
        // Language Selector
        selectLanguage: "Sélectionner la Langue"
    }
};
