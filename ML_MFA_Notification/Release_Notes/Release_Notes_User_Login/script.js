document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const modal = document.getElementById('releaseNotesModal');
    const savePdfBtn = document.getElementById('savePdfBtn');
    const continueBtn = document.getElementById('continueBtn');
    const releaseNotesContent = document.getElementById('releaseNotesContent');
    const modalBody = document.querySelector('.modal-body');
    const languageSelect = document.getElementById('languageSelect');
    const themeToggle = document.getElementById('themeToggle');
    const showReleaseNotesBtn = document.getElementById('showReleaseNotesBtn');

    // Initialize Material Design Components
    const buttons = document.querySelectorAll('.mdc-button');
    buttons.forEach(button => {
        mdc.ripple.MDCRipple.attachTo(button);
    });

    // Initialize select with default value
    const languageSelector = document.querySelector('.language-selector');
    const select = mdc.select.MDCSelect.attachTo(languageSelector);
    select.value = 'en'; // Set default language
    select.listen('MDCSelect:change', () => {
        currentLanguage = select.value;
        populateReleaseNotes(currentLanguage);
    });

    // Flag to track PDF save action
    let hasSavedPdf = false;

    // Theme toggle functionality
    themeToggle.addEventListener('click', function() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        // Update theme
        html.setAttribute('data-theme', newTheme);

        // Update icon only
        if (newTheme === 'dark') {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }

        // Save theme preference to localStorage
        localStorage.setItem('theme', newTheme);
    });

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);

        // Update icon based on saved theme
        if (savedTheme === 'dark') {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }

    // Show release notes when the button is clicked
    showReleaseNotesBtn.addEventListener('click', function() {
        populateReleaseNotes(currentLanguage);
        modal.style.display = 'block';
    });

    // Close the modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // No credentials needed - validation removed

    // Sample release notes data (in a real app, this would come from a server)
    const releaseNotes = {
        hasNewRelease: true,
        releaseDate: '2025-05-15',
        version: '3.0.0',
        codename: 'Phoenix',
        previousVersion: '2.5.2',
        feedbackLink: 'https://example.com/feedback',
        documentationLink: 'https://example.com/docs',
        supportLink: 'https://example.com/support',
        knownIssues: [
            {
                issue: 'Mobile app sync may be delayed on some Android devices',
                workaround: "Manually refresh the app or restart it if sync doesn't complete within 5 minutes",
                fixPlanned: 'Version 3.0.1 (June 2025)'
            },
            {
                issue: 'PDF export may not include custom headers in some reports',
                workaround: 'Use the Excel export option for reports with custom headers',
                fixPlanned: 'Version 3.0.1 (June 2025)'
            }
        ],
        // Translations for different languages
        translations: {
            en: {
                title: 'Version 3.0 "Phoenix" is Here!',
                tldr: 'A complete UI redesign with dark mode, 50% faster performance, new mobile app integration, enhanced security, and improved reporting tools.',
                description: "We're excited to announce our biggest update yet! Version 3.0 'Phoenix' represents a complete rebirth of our platform with a focus on speed, security, and user experience.",
                userFeedback: "Based on your feedback, we've completely redesigned the user interface and added the most requested features.",
                whatChanged: 'What\'s Changed Since Version 2.5.2',
                features: [
                    {
                        title: 'Sleek New User Interface',
                        description: 'Completely redesigned interface with intuitive navigation and customizable dashboard.',
                        benefit: 'Find what you need faster and personalize your workspace for maximum productivity.',
                        image: 'ui-redesign.png',
                        altText: 'Screenshot showing the new user interface with customizable dashboard',
                        videoUrl: 'https://example.com/videos/ui-redesign-demo.mp4'
                    },
                    {
                        title: 'Dark Mode Support',
                        description: 'New dark mode option available across all screens and reports.',
                        benefit: 'Reduce eye strain during night-time use and save battery on OLED displays.',
                        image: 'dark-mode.png',
                        altText: 'Screenshot showing the application in dark mode',
                        videoUrl: 'https://example.com/videos/dark-mode-demo.mp4'
                    },
                    {
                        title: 'Enhanced Security Features',
                        description: 'Added two-factor authentication, single sign-on support, and advanced encryption.',
                        benefit: 'Keep your data more secure with industry-leading security practices.',
                        image: 'security.png',
                        altText: 'Illustration of the new security features including two-factor authentication',
                        videoUrl: 'https://example.com/videos/security-demo.mp4'
                    },
                    {
                        title: 'Performance Optimizations',
                        description: 'Rebuilt core engine with 50% faster response times and reduced memory usage.',
                        benefit: 'Experience smoother operation even with large datasets and complex reports.',
                        image: 'performance.png',
                        altText: 'Graph showing performance improvements compared to previous version',
                        videoUrl: 'https://example.com/videos/performance-demo.mp4'
                    },
                    {
                        title: 'Advanced Reporting Tools',
                        description: 'New customizable report templates, interactive charts, and data visualization options.',
                        benefit: 'Create more insightful reports and make better data-driven decisions.',
                        image: 'reporting.png',
                        altText: 'Screenshot of the new reporting interface with interactive charts',
                        videoUrl: 'https://example.com/videos/reporting-demo.mp4'
                    },
                    {
                        title: 'Mobile App Integration',
                        description: 'New mobile app for iOS and Android with offline capabilities and real-time sync.',
                        benefit: 'Access your data anywhere, anytime, even without an internet connection.',
                        image: 'mobile-app.png',
                        altText: 'Screenshot of the mobile app on both iOS and Android devices',
                        videoUrl: 'https://example.com/videos/mobile-app-demo.mp4'
                    }
                ],
                improvements: [
                    {
                        area: 'Accessibility',
                        details: 'Improved screen reader support, keyboard navigation, and color contrast ratios'
                    },
                    {
                        area: 'Localization',
                        details: 'Added support for 5 new languages, bringing our total to 15 supported languages'
                    },
                    {
                        area: 'Data Import/Export',
                        details: 'New bulk import tools and expanded export options including Excel, CSV, and PDF'
                    }
                ],
                bugFixes: [
                    'Fixed data export issue that caused some fields to be truncated',
                    'Resolved login timeout problems that occurred on slow network connections',
                    'Corrected calculation errors in quarterly summary reports',
                    "Fixed search functionality that wasn't returning all relevant results",
                    'Resolved UI rendering issues on high-resolution displays'
                ],
                knownIssuesTitle: 'Known Issues',
                issueTitle: 'Issue:',
                workaroundTitle: 'Workaround:',
                fixPlannedTitle: 'Fix Planned:',
                improvementsTitle: 'Improvements',
                featuresTitle: 'New Features',
                bugFixesTitle: 'Bug Fixes',
                releaseDate: 'Release Date:',
                feedbackTitle: 'We Value Your Feedback',
                feedbackText: 'Try the new features and let us know what you think!',
                documentationText: 'View Documentation',
                supportText: 'Contact Support',
                feedbackLinkText: 'Send Feedback',
                savePdf: 'Save as PDF',
                continue: 'Continue',
                scrollToRead: 'Scroll down to read the full release notes',
                canSavePdf: 'You can now save the release notes as PDF',
                canProceed: 'You can now proceed to login',
                watchDemo: 'Watch Demo'
            },
            es: {
                title: '¡La Versión 3.0 "Phoenix" está aquí!',
                tldr: 'Un rediseño completo de la interfaz con modo oscuro, rendimiento 50% más rápido, nueva integración de aplicaciones móviles, seguridad mejorada y herramientas de informes mejoradas.',
                description: '¡Nos complace anunciar nuestra mayor actualización hasta ahora! La versión 3.0 "Phoenix" representa un renacimiento completo de nuestra plataforma con un enfoque en velocidad, seguridad y experiencia del usuario.',
                userFeedback: 'Basado en sus comentarios, hemos rediseñado completamente la interfaz de usuario y agregado las características más solicitadas.',
                whatChanged: 'Qué ha cambiado desde la versión 2.5.2',
                features: [
                    {
                        title: 'Nueva interfaz de usuario elegante',
                        description: 'Interfaz completamente rediseñada con navegación intuitiva y panel personalizable.',
                        benefit: 'Encuentre lo que necesita más rápido y personalice su espacio de trabajo para máxima productividad.',
                        image: 'ui-redesign.png',
                        altText: 'Captura de pantalla que muestra la nueva interfaz de usuario con panel personalizable'
                    },
                    {
                        title: 'Soporte para modo oscuro',
                        description: 'Nueva opción de modo oscuro disponible en todas las pantallas e informes.',
                        benefit: 'Reduzca la fatiga visual durante el uso nocturno y ahorre batería en pantallas OLED.',
                        image: 'dark-mode.png',
                        altText: 'Captura de pantalla que muestra la aplicación en modo oscuro'
                    },
                    {
                        title: 'Características de seguridad mejoradas',
                        description: 'Se agregó autenticación de dos factores, soporte de inicio de sesión único y encriptación avanzada.',
                        benefit: 'Mantenga sus datos más seguros con prácticas de seguridad líderes en la industria.',
                        image: 'security.png',
                        altText: 'Ilustración de las nuevas características de seguridad, incluida la autenticación de dos factores'
                    },
                    {
                        title: 'Optimizaciones de rendimiento',
                        description: 'Motor central reconstruido con tiempos de respuesta 50% más rápidos y uso reducido de memoria.',
                        benefit: 'Experimente un funcionamiento más fluido incluso con grandes conjuntos de datos e informes complejos.',
                        image: 'performance.png',
                        altText: 'Gráfico que muestra mejoras de rendimiento en comparación con la versión anterior'
                    },
                    {
                        title: 'Herramientas avanzadas de informes',
                        description: 'Nuevas plantillas de informes personalizables, gráficos interactivos y opciones de visualización de datos.',
                        benefit: 'Cree informes más perspicaces y tome mejores decisiones basadas en datos.',
                        image: 'reporting.png',
                        altText: 'Captura de pantalla de la nueva interfaz de informes con gráficos interactivos'
                    },
                    {
                        title: 'Integración de aplicaciones móviles',
                        description: 'Nueva aplicación móvil para iOS y Android con capacidades sin conexión y sincronización en tiempo real.',
                        benefit: 'Acceda a sus datos en cualquier lugar, en cualquier momento, incluso sin conexión a Internet.',
                        image: 'mobile-app.png',
                        altText: 'Captura de pantalla de la aplicación móvil en dispositivos iOS y Android'
                    }
                ],
                improvements: [
                    {
                        area: 'Accesibilidad',
                        details: 'Mejor soporte para lectores de pantalla, navegación por teclado y relaciones de contraste de color'
                    },
                    {
                        area: 'Localización',
                        details: 'Se agregó soporte para 5 nuevos idiomas, llevando nuestro total a 15 idiomas compatibles'
                    },
                    {
                        area: 'Importación/Exportación de datos',
                        details: 'Nuevas herramientas de importación masiva y opciones de exportación ampliadas que incluyen Excel, CSV y PDF'
                    }
                ],
                bugFixes: [
                    'Se solucionó el problema de exportación de datos que causaba que algunos campos se truncaran',
                    'Se resolvieron problemas de tiempo de espera de inicio de sesión que ocurrían en conexiones de red lentas',
                    'Se corrigieron errores de cálculo en informes resumidos trimestrales',
                    'Se corrigió la funcionalidad de búsqueda que no devolvía todos los resultados relevantes',
                    'Se resolvieron problemas de renderizado de UI en pantallas de alta resolución'
                ],
                knownIssuesTitle: 'Problemas Conocidos',
                issueTitle: 'Problema:',
                workaroundTitle: 'Solución temporal:',
                fixPlannedTitle: 'Corrección Planificada:',
                improvementsTitle: 'Mejoras',
                featuresTitle: 'Nuevas Características',
                bugFixesTitle: 'Correcciones de Errores',
                releaseDate: 'Fecha de Lanzamiento:',
                feedbackTitle: 'Valoramos sus Comentarios',
                feedbackText: '¡Pruebe las nuevas características y díganos qué piensa!',
                documentationText: 'Ver Documentación',
                supportText: 'Contactar Soporte',
                feedbackLinkText: 'Enviar Comentarios',
                savePdf: 'Guardar como PDF',
                continue: 'Continuar',
                scrollToRead: 'Desplácese hacia abajo para leer las notas de la versión completas',
                canSavePdf: 'Ahora puede guardar las notas de la versión como PDF',
                canProceed: 'Ahora puede proceder al inicio de sesión',
                watchDemo: 'Ver Demostración'
            },
            fr: {
                title: 'La Version 3.0 "Phoenix" est arrivée !',
                tldr: 'Une refonte complète de l\'interface avec mode sombre, performances 50% plus rapides, nouvelle intégration d\'application mobile, sécurité améliorée et outils de reporting améliorés.',
                description: 'Nous sommes ravis d\'annoncer notre plus grande mise à jour à ce jour ! La version 3.0 "Phoenix" représente une renaissance complète de notre plateforme avec un accent sur la vitesse, la sécurité et l\'expérience utilisateur.',
                userFeedback: 'Sur la base de vos commentaires, nous avons complètement repensé l\'interface utilisateur et ajouté les fonctionnalités les plus demandées.',
                whatChanged: 'Ce qui a changé depuis la version 2.5.2',
                features: [
                    {
                        title: 'Nouvelle interface utilisateur élégante',
                        description: 'Interface complètement repensée avec navigation intuitive et tableau de bord personnalisable.',
                        benefit: 'Trouvez ce dont vous avez besoin plus rapidement et personnalisez votre espace de travail pour une productivité maximale.',
                        image: 'ui-redesign.png',
                        altText: 'Capture d\'écran montrant la nouvelle interface utilisateur avec tableau de bord personnalisable'
                    },
                    {
                        title: 'Support du mode sombre',
                        description: 'Nouvelle option de mode sombre disponible sur tous les écrans et rapports.',
                        benefit: 'Réduisez la fatigue oculaire pendant l\'utilisation nocturne et économisez la batterie sur les écrans OLED.',
                        image: 'dark-mode.png',
                        altText: 'Capture d\'écran montrant l\'application en mode sombre'
                    },
                    {
                        title: 'Fonctionnalités de sécurité améliorées',
                        description: 'Ajout de l\'authentification à deux facteurs, support de l\'authentification unique et cryptage avancé.',
                        benefit: 'Gardez vos données plus sécurisées avec des pratiques de sécurité de pointe.',
                        image: 'security.png',
                        altText: 'Illustration des nouvelles fonctionnalités de sécurité, y compris l\'authentification à deux facteurs'
                    },
                    {
                        title: 'Optimisations des performances',
                        description: 'Moteur central reconstruit avec des temps de réponse 50% plus rapides et une utilisation réduite de la mémoire.',
                        benefit: 'Profitez d\'un fonctionnement plus fluide même avec de grands ensembles de données et des rapports complexes.',
                        image: 'performance.png',
                        altText: 'Graphique montrant les améliorations de performance par rapport à la version précédente'
                    },
                    {
                        title: 'Outils de reporting avancés',
                        description: 'Nouveaux modèles de rapports personnalisables, graphiques interactifs et options de visualisation de données.',
                        benefit: 'Créez des rapports plus perspicaces et prenez de meilleures décisions basées sur les données.',
                        image: 'reporting.png',
                        altText: 'Capture d\'écran de la nouvelle interface de reporting avec des graphiques interactifs'
                    },
                    {
                        title: 'Intégration d\'applications mobiles',
                        description: 'Nouvelle application mobile pour iOS et Android avec capacités hors ligne et synchronisation en temps réel.',
                        benefit: 'Accédez à vos données n\'importe où, n\'importe quand, même sans connexion Internet.',
                        image: 'mobile-app.png',
                        altText: 'Capture d\'écran de l\'application mobile sur les appareils iOS et Android'
                    }
                ],
                improvements: [
                    {
                        area: 'Accessibilité',
                        details: 'Amélioration du support des lecteurs d\'écran, de la navigation au clavier et des ratios de contraste des couleurs'
                    },
                    {
                        area: 'Localisation',
                        details: 'Ajout du support pour 5 nouvelles langues, portant notre total à 15 langues prises en charge'
                    },
                    {
                        area: 'Importation/Exportation de données',
                        details: 'Nouveaux outils d\'importation en masse et options d\'exportation étendues, y compris Excel, CSV et PDF'
                    }
                ],
                bugFixes: [
                    'Correction du problème d\'exportation de données qui causait la troncature de certains champs',
                    'Résolution des problèmes de délai d\'expiration de connexion qui se produisaient sur les connexions réseau lentes',
                    'Correction des erreurs de calcul dans les rapports trimestriels',
                    'Correction de la fonctionnalité de recherche qui ne renvoyait pas tous les résultats pertinents',
                    'Résolution des problèmes de rendu de l\'interface utilisateur sur les écrans haute résolution'
                ],
                knownIssuesTitle: 'Problèmes Connus',
                issueTitle: 'Problème:',
                workaroundTitle: 'Solution de contournement:',
                fixPlannedTitle: 'Correction Prévue:',
                improvementsTitle: 'Améliorations',
                featuresTitle: 'Nouvelles Fonctionnalités',
                bugFixesTitle: 'Corrections de Bugs',
                releaseDate: 'Date de Sortie:',
                feedbackTitle: 'Nous Valorisons Vos Commentaires',
                feedbackText: 'Essayez les nouvelles fonctionnalités et dites-nous ce que vous en pensez !',
                documentationText: 'Voir la Documentation',
                supportText: 'Contacter le Support',
                feedbackLinkText: 'Envoyer des Commentaires',
                savePdf: 'Enregistrer en PDF',
                continue: 'Continuer',
                scrollToRead: 'Faites défiler vers le bas pour lire les notes de version complètes',
                canSavePdf: 'Vous pouvez maintenant enregistrer les notes de version en PDF',
                canProceed: 'Vous pouvez maintenant procéder à la connexion',
                watchDemo: 'Voir la Démo'
            }
        }
    };

    // Current language
    let currentLanguage = 'en';

    // Function to check if there's a scheduled release
    function checkForRelease() {
        // In a real app, this would make an API call to check for releases
        return releaseNotes.hasNewRelease;
    }

    // Function to populate release notes content based on selected language
    function populateReleaseNotes(language = 'en') {
        const releaseDate = new Date(releaseNotes.releaseDate);
        const formattedDate = releaseDate.toLocaleDateString(language === 'en' ? 'en-US' :
                                                           language === 'es' ? 'es-ES' :
                                                           language === 'fr' ? 'fr-FR' :
                                                           language === 'de' ? 'de-DE' :
                                                           language === 'zh' ? 'zh-CN' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Get translations for the selected language, fallback to English if not available
        const translations = releaseNotes.translations[language] || releaseNotes.translations.en;

        // Create feature items HTML with placeholder images
        const featuresHTML = translations.features.map((feature, index) => {
            // Use the placeholder SVG images we created
            const imageSrc = `images/${['ui-redesign', 'dark-mode', 'security', 'performance', 'reporting', 'mobile-app'][index]}.svg`;


            return `
                <div class="feature-item mdc-card mdc-card--outlined">
                    <div class="feature-header mdc-card__primary-action">
                        <h4 class="feature-title mdc-typography--headline6">${feature.title}</h4>
                        <div class="feature-image">
                            <img src="${imageSrc}" alt="${feature.altText || feature.title}" />
                        </div>
                    </div>
                    <div class="mdc-card__content">
                        <p class="feature-description mdc-typography--body1">${feature.description}</p>
                        <p class="feature-benefit mdc-typography--body2"><strong>Benefit:</strong> ${feature.benefit}</p>
                    </div>
                    <div class="mdc-card__actions">
                        <a href="${feature.videoUrl}" class="video-demo-btn mdc-button mdc-button--raised" target="_blank">
                            <div class="mdc-button__ripple"></div>
                            <i class="fas fa-play-circle mdc-button__icon"></i>
                            <span class="mdc-button__label">${translations.watchDemo}</span>
                        </a>
                    </div>
                </div>
            `;
        }).join('');

        // Create improvements HTML
        const improvementsHTML = translations.improvements ? `
            <div class="improvements-section mdc-elevation--z1">
                <h3 class="mdc-typography--headline5">🚀 ${translations.improvementsTitle}</h3>
                <ul class="improvements-list mdc-list">
                    ${translations.improvements.map(item => `
                        <li class="improvement-item mdc-list-item">
                            <span class="mdc-list-item__text">
                                <strong class="mdc-typography--subtitle2">${item.area}:</strong>
                                <span class="mdc-typography--body2">${item.details}</span>
                            </span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        ` : '';

        // Create known issues HTML
        const knownIssuesHTML = releaseNotes.knownIssues ? `
            <div class="known-issues-section mdc-elevation--z1">
                <h3 class="mdc-typography--headline5">⚠️ ${translations.knownIssuesTitle}</h3>
                <div class="known-issues-list">
                    ${releaseNotes.knownIssues.map(issue => `
                        <div class="known-issue-item mdc-card mdc-card--outlined">
                            <div class="mdc-card__content">
                                <p class="mdc-typography--body1"><strong class="mdc-typography--subtitle2">${translations.issueTitle}</strong> ${issue.issue}</p>
                                <p class="mdc-typography--body1"><strong class="mdc-typography--subtitle2">${translations.workaroundTitle}</strong> ${issue.workaround}</p>
                                <p class="mdc-typography--body1"><strong class="mdc-typography--subtitle2">${translations.fixPlannedTitle}</strong> ${issue.fixPlanned}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : '';

        // Create feedback section HTML
        const feedbackHTML = `
            <div class="feedback-section mdc-elevation--z1">
                <h3 class="mdc-typography--headline5">💬 ${translations.feedbackTitle}</h3>
                <p class="mdc-typography--body1">${translations.feedbackText}</p>
                <div class="feedback-links">
                    <a href="${releaseNotes.documentationLink}" class="doc-link mdc-button mdc-button--raised" target="_blank" aria-label="${translations.documentationText}">
                        <div class="mdc-button__ripple"></div>
                        <i class="fas fa-book mdc-button__icon"></i>
                        <span class="mdc-button__label">${translations.documentationText}</span>
                    </a>
                    <a href="${releaseNotes.supportLink}" class="support-link mdc-button mdc-button--raised" target="_blank" aria-label="${translations.supportText}">
                        <div class="mdc-button__ripple"></div>
                        <i class="fas fa-headset mdc-button__icon"></i>
                        <span class="mdc-button__label">${translations.supportText}</span>
                    </a>
                    <a href="${releaseNotes.feedbackLink}" class="feedback-link mdc-button mdc-button--raised" target="_blank" aria-label="${translations.feedbackLinkText}">
                        <div class="mdc-button__ripple"></div>
                        <i class="fas fa-comment-alt mdc-button__icon"></i>
                        <span class="mdc-button__label">${translations.feedbackLinkText}</span>
                    </a>
                </div>
            </div>
        `;

        // Build the complete content
        let content = `
            <div class="release-note mdc-card__content" id="releaseNotesPdfContent">
                <!-- Header Section -->
                <div class="release-header">
                    <div class="release-title mdc-typography--headline4">${translations.title}</div>
                    <div class="release-version mdc-typography--subtitle1">v${releaseNotes.version} (${releaseNotes.codename})</div>
                    <div class="release-date mdc-typography--subtitle2">${translations.releaseDate} ${formattedDate}</div>
                </div>

                <!-- TL;DR Summary Section -->
                <div class="tldr-section mdc-elevation--z1">
                    <h3 class="mdc-typography--headline6">Summary</h3>
                    <p class="mdc-typography--body1">${translations.tldr}</p>
                </div>

                <!-- Main Description -->
                <div class="release-description mdc-typography--body1">
                    <p>${translations.description}</p>
                    <p>${translations.userFeedback}</p>
                    <p class="version-compare mdc-typography--subtitle1">${translations.whatChanged}</p>
                </div>

                <!-- Features Section -->
                <h3 class="mdc-typography--headline5">✨ ${translations.featuresTitle}</h3>
                <div class="features-container">
                    ${featuresHTML}
                </div>

                <!-- Improvements Section -->
                ${improvementsHTML}

                <!-- Bug Fixes Section -->
                <h3 class="mdc-typography--headline5">🐛 ${translations.bugFixesTitle}</h3>
                <ul class="bugfix-list mdc-list">
                    ${translations.bugFixes.map(fix => `<li class="bugfix-item mdc-list-item">${fix}</li>`).join('')}
                </ul>

                <!-- Known Issues Section -->
                ${knownIssuesHTML}

                <!-- Feedback Section -->
                ${feedbackHTML}
            </div>
        `;

        releaseNotesContent.innerHTML = content;

        // Update button text based on language
        savePdfBtn.querySelector('span').textContent = translations.savePdf;
        continueBtn.querySelector('span').textContent = 'Continue';

        // Reset states when content changes
        hasScrolledToBottom = true; // Always allow PDF generation
        hasSavedPdf = false;
        savePdfBtn.disabled = false; // Always enable the PDF button
        continueBtn.disabled = false; // Enable the close button

        // No scroll indicator or manual enable button

        // Reset scroll position
        modalBody.scrollTop = 0;
    }

    // Function to check if user has scrolled to the bottom
    function checkScrollPosition() {
        // Get the scroll indicator
        const scrollIndicator = document.getElementById('scrollIndicator');

        // If user has scrolled more than 20% of the content, start fading out the scroll indicator
        const scrollPercentage = (modalBody.scrollTop / (modalBody.scrollHeight - modalBody.clientHeight)) * 100;
        if (scrollPercentage > 20 && scrollIndicator && !scrollIndicator.classList.contains('hide')) {
            scrollIndicator.classList.add('hide');
            setTimeout(() => {
                if (scrollIndicator && scrollIndicator.parentNode) {
                    scrollIndicator.parentNode.removeChild(scrollIndicator);
                }
            }, 500);
        }

        // Always enable PDF button regardless of scrolling
        hasScrolledToBottom = true;
        savePdfBtn.disabled = false;
    }

    // Function to generate and save PDF
    function generatePDF() {
        // Always allow PDF generation
        hasScrolledToBottom = true;

        try {
            // Show loading indicator
            savePdfBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Processing...</span>';
            savePdfBtn.disabled = true;

            // Hide any fixed elements that might interfere with PDF generation
            const fixedElements = document.querySelectorAll('.tour-guide-btn');
            fixedElements.forEach(el => {
                if (el) el.style.display = 'none';
            });

            // Using jsPDF directly without html2canvas
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');

            // Get the content for the PDF
            const pdfContent = document.getElementById('releaseNotesPdfContent');
            if (!pdfContent) {
                throw new Error('PDF content element not found');
            }

            // Get translations for the current language
            const translations = releaseNotes.translations[currentLanguage] || releaseNotes.translations.en;

            // Add title
            pdf.setFontSize(20);
            pdf.text(translations.title, 20, 20);

            // Add version
            pdf.setFontSize(14);
            pdf.text(`v${releaseNotes.version} (${releaseNotes.codename})`, 20, 30);

            // Add release date
            const releaseDate = new Date(releaseNotes.releaseDate);
            const formattedDate = releaseDate.toLocaleDateString();
            pdf.text(`${translations.releaseDate} ${formattedDate}`, 20, 40);

            // Add summary
            pdf.setFontSize(16);
            pdf.text('Summary', 20, 55);
            pdf.setFontSize(12);

            // Split long text into multiple lines
            const summaryLines = pdf.splitTextToSize(translations.tldr, 170);
            pdf.text(summaryLines, 20, 65);

            // Add description
            let yPosition = 65 + (summaryLines.length * 7);
            pdf.setFontSize(12);
            const descriptionLines = pdf.splitTextToSize(translations.description, 170);
            pdf.text(descriptionLines, 20, yPosition);

            yPosition += (descriptionLines.length * 7) + 10;

            // Add features section
            pdf.setFontSize(16);
            pdf.text(translations.featuresTitle, 20, yPosition);
            yPosition += 10;
            pdf.setFontSize(12);

            // Add each feature
            translations.features.forEach(feature => {
                pdf.setFontSize(14);
                pdf.text(feature.title, 20, yPosition);
                yPosition += 7;

                pdf.setFontSize(12);
                const featureDescLines = pdf.splitTextToSize(feature.description, 170);
                pdf.text(featureDescLines, 20, yPosition);
                yPosition += (featureDescLines.length * 7);

                const benefitLines = pdf.splitTextToSize(`Benefit: ${feature.benefit}`, 170);
                pdf.text(benefitLines, 20, yPosition);
                yPosition += (benefitLines.length * 7) + 10;

                // Add a new page if we're getting close to the bottom
                if (yPosition > 270) {
                    pdf.addPage();
                    yPosition = 20;
                }
            });

            // Add improvements section if there's room, otherwise add a new page
            if (yPosition > 240) {
                pdf.addPage();
                yPosition = 20;
            }

            pdf.setFontSize(16);
            pdf.text(translations.improvementsTitle, 20, yPosition);
            yPosition += 10;
            pdf.setFontSize(12);

            // Add each improvement
            translations.improvements.forEach(improvement => {
                const improvementText = `${improvement.area}: ${improvement.details}`;
                const improvementLines = pdf.splitTextToSize(improvementText, 170);
                pdf.text(improvementLines, 20, yPosition);
                yPosition += (improvementLines.length * 7) + 5;

                // Add a new page if we're getting close to the bottom
                if (yPosition > 270) {
                    pdf.addPage();
                    yPosition = 20;
                }
            });

            // Add bug fixes section if there's room, otherwise add a new page
            if (yPosition > 240) {
                pdf.addPage();
                yPosition = 20;
            }

            pdf.setFontSize(16);
            pdf.text(translations.bugFixesTitle, 20, yPosition);
            yPosition += 10;
            pdf.setFontSize(12);

            // Add each bug fix
            translations.bugFixes.forEach(bugFix => {
                const bugFixLines = pdf.splitTextToSize(`• ${bugFix}`, 170);
                pdf.text(bugFixLines, 20, yPosition);
                yPosition += (bugFixLines.length * 7) + 5;

                // Add a new page if we're getting close to the bottom
                if (yPosition > 270) {
                    pdf.addPage();
                    yPosition = 20;
                }
            });

            // Save the PDF
            pdf.save(`Release_Notes_v${releaseNotes.version}_${releaseNotes.codename}.pdf`);

            // Mark PDF as saved
            hasSavedPdf = true;

            // Reset button text and state
            savePdfBtn.innerHTML = `<i class="fas fa-file-pdf"></i><span>${translations.savePdf}</span>`;
            savePdfBtn.disabled = false;

            // Add success animation
            savePdfBtn.classList.add('success');
            setTimeout(() => {
                savePdfBtn.classList.remove('success');
            }, 2000);

            // Restore any hidden elements
            fixedElements.forEach(el => {
                if (el) el.style.display = '';
            });

            console.log('PDF generated successfully');

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('There was an error generating the PDF. Please try again.');

            // Reset button text and state
            const translations = releaseNotes.translations[currentLanguage] || releaseNotes.translations.en;
            savePdfBtn.innerHTML = `<i class="fas fa-file-pdf"></i><span>${translations.savePdf}</span>`;
            savePdfBtn.disabled = false;

            // Restore any hidden elements
            const fixedElements = document.querySelectorAll('.tour-guide-btn');
            fixedElements.forEach(el => {
                if (el) el.style.display = '';
            });
        }
    }

    // Function to create and show the dashboard
    function showDashboard(showTour = false) {
        // We've already hidden login elements in the continue button handler

        // Remove body padding and margin to eliminate the gap at the top
        document.body.style.padding = '0';
        document.body.style.margin = '0';

        // Create dashboard if it doesn't exist
        if (!document.getElementById('dashboard')) {
            const dashboard = document.createElement('div');
            dashboard.id = 'dashboard';
            dashboard.className = 'dashboard-container';

            dashboard.innerHTML = `
                <div class="dashboard-header">
                    <div class="dashboard-logo">
                        <div class="logo-box">
                            <img src="images/HCLSW.jpg" alt="HCLSW Logo" class="logo-img">
                        </div>
                        <h2 style="color:white;">Ticketing System</h2>
                    </div>

                    <nav class="top-menu" data-tour="top-menu">
                        <ul class="menu-list">
                            <li class="menu-item active" data-tour="home">
                                <i class="fas fa-home"></i>
                                <span>Home</span>
                            </li>
                            <li class="menu-item" data-tour="tickets">
                                <i class="fas fa-ticket-alt"></i>
                                <span>My Tickets</span>
                                <span class="badge">5</span>
                            </li>
                            <li class="menu-item" data-tour="create">
                                <i class="fas fa-plus-circle"></i>
                                <span>Create Ticket</span>
                            </li>
                            <li class="menu-item" data-tour="reports">
                                <i class="fas fa-chart-bar"></i>
                                <span>Reports</span>
                            </li>
                            <li class="menu-item" data-tour="settings">
                                <i class="fas fa-cog"></i>
                                <span>Settings</span>
                            </li>
                        </ul>
                    </nav>

                    <div class="user-actions">
                        <div class="user-profile">
                            <span class="username">user123</span>
                            <div class="avatar">
                                <i class="fas fa-user-circle"></i>
                            </div>
                        </div>
                        <button id="dashboardThemeToggle" class="theme-toggle mdc-icon-button" aria-label="Toggle dark/light mode">
                            <i class="fas fa-moon"></i>
                        </button>
                        <button class="logout-btn">
                            <i class="fas fa-file-alt"></i>
                            <span>Back to Release Notes</span>
                        </button>
                    </div>
                    <button class="tour-guide-btn" id="startTourBtn" data-tour="guide-btn">
                        <span>Guided Tour</span>
                    </button>
                </div>

                <div class="dashboard-content">
                    <div class="dashboard-stats">
                        <div class="stat-card" data-tour="open-tickets">
                            <div class="stat-icon">
                                <i class="fas fa-exclamation-circle"></i>
                            </div>
                            <div class="stat-info">
                                <h3>Open Tickets</h3>
                                <p class="stat-number">12</p>
                            </div>
                        </div>

                        <div class="stat-card" data-tour="in-progress">
                            <div class="stat-icon">
                                <i class="fas fa-spinner"></i>
                            </div>
                            <div class="stat-info">
                                <h3>In Progress</h3>
                                <p class="stat-number">8</p>
                            </div>
                        </div>

                        <div class="stat-card" data-tour="resolved">
                            <div class="stat-icon">
                                <i class="fas fa-check-circle"></i>
                            </div>
                            <div class="stat-info">
                                <h3>Resolved</h3>
                                <p class="stat-number">24</p>
                            </div>
                        </div>

                        <div class="stat-card" data-tour="pending">
                            <div class="stat-icon">
                                <i class="fas fa-clock"></i>
                            </div>
                            <div class="stat-info">
                                <h3>Pending</h3>
                                <p class="stat-number">3</p>
                            </div>
                        </div>
                    </div>

                    <div class="recent-tickets" data-tour="recent-tickets">
                        <h3>Recent Tickets</h3>
                        <table class="tickets-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Subject</th>
                                    <th>Status</th>
                                    <th>Priority</th>
                                    <th>Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>#TK-1001</td>
                                    <td>Login issue after update</td>
                                    <td><span class="status-badge in-progress">In Progress</span></td>
                                    <td><span class="priority-badge high">High</span></td>
                                    <td>Today</td>
                                </tr>
                                <tr>
                                    <td>#TK-1000</td>
                                    <td>Report export fails</td>
                                    <td><span class="status-badge open">Open</span></td>
                                    <td><span class="priority-badge medium">Medium</span></td>
                                    <td>Yesterday</td>
                                </tr>
                                <tr>
                                    <td>#TK-999</td>
                                    <td>Mobile app sync issue</td>
                                    <td><span class="status-badge resolved">Resolved</span></td>
                                    <td><span class="priority-badge high">High</span></td>
                                    <td>May 14, 2025</td>
                                </tr>
                                <tr>
                                    <td>#TK-998</td>
                                    <td>Dark mode toggle not working</td>
                                    <td><span class="status-badge resolved">Resolved</span></td>
                                    <td><span class="priority-badge low">Low</span></td>
                                    <td>May 13, 2025</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="quick-actions" data-tour="quick-actions">
                        <h3>Quick Actions</h3>
                        <div class="action-buttons">
                            <button class="action-btn">
                                <i class="fas fa-plus"></i>
                                <span>New Ticket</span>
                            </button>
                            <button class="action-btn">
                                <i class="fas fa-search"></i>
                                <span>Search Tickets</span>
                            </button>
                            <button class="action-btn">
                                <i class="fas fa-file-export"></i>
                                <span>Export Report</span>
                            </button>
                            <button class="action-btn">
                                <i class="fas fa-bell"></i>
                                <span>Notifications</span>
                                <span class="notification-badge">3</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(dashboard);

            // Add "Back to Release Notes" functionality
            const logoutBtn = dashboard.querySelector('.logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function() {
                    // Show the release notes modal
                    populateReleaseNotes(currentLanguage);
                    modal.style.display = 'block';
                });
            }

            // Add theme toggle functionality to dashboard
            const dashboardThemeToggle = document.getElementById('dashboardThemeToggle');
            if (dashboardThemeToggle) {
                // Set initial icon based on current theme
                const currentTheme = document.documentElement.getAttribute('data-theme');
                if (currentTheme === 'dark') {
                    dashboardThemeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                } else {
                    dashboardThemeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                }

                // Add event listener
                dashboardThemeToggle.addEventListener('click', function() {
                    const html = document.documentElement;
                    const currentTheme = html.getAttribute('data-theme');
                    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

                    // Update theme
                    html.setAttribute('data-theme', newTheme);

                    // Update icon only
                    if (newTheme === 'dark') {
                        dashboardThemeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                        themeToggle.innerHTML = '<i class="fas fa-sun"></i>'; // Update login page toggle too
                    } else {
                        dashboardThemeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                        themeToggle.innerHTML = '<i class="fas fa-moon"></i>'; // Update login page toggle too
                    }

                    // Save theme preference to localStorage
                    localStorage.setItem('theme', newTheme);
                });
            }

            // Add some basic styling for the dashboard
            const style = document.createElement('style');
            style.textContent = `
                /* Define primary-rgb for animations */
                :root {
                    --primary-rgb: 25, 118, 210; /* This is the RGB equivalent of the primary color */
                }

                /* Reset body styles when dashboard is shown */
                body {
                    margin: 0;
                    padding: 0;
                    display: block;
                    justify-content: initial;
                    align-items: initial;
                    min-height: 100vh;
                    overflow: hidden;
                }

                .dashboard-container {
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                    width: 100vw;
                    background-color: var(--bg-color);
                    color: var(--text-color);
                    font-family: 'Poppins', sans-serif;
                    overflow: hidden;
                    margin: 0;
                    padding: 0;
                }

                .dashboard-header {
                    width: 100%;
                    height: 60px;
                    background-color: var(--primary-color);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 20px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    z-index: 10;
                }

                .dashboard-logo {
                    display: flex;
                    align-items: center;
                }

                .logo-box {
                    height: 60px;
                    width: 60px;
                    margin-right: 10px;
                    background-color: #ffffff00;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                    overflow: hidden;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .dashboard-logo img {
                    height: 100%;
                    width: 100%;
                    object-fit: cover;
                    /* Keeping original color - no filter */
                }

                .dashboard-logo h2 {
                    margin: 0;
                    font-size: 1.2rem;
                }

                .top-menu {
                    flex: 1;
                    display: flex;
                    justify-content: center;
                }

                .menu-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                }

                .menu-item {
                    padding: 0 20px;
                    height: 60px;
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    transition: background-color 0.3s;
                    position: relative;
                }

                .menu-item:hover {
                    background-color: var(--menu-hover-bg);
                }

                .menu-item.active {
                    background-color: var(--menu-active-bg);
                    border-bottom: 3px solid var(--menu-active-border);
                }

                .menu-item i {
                    margin-right: 8px;
                    width: 20px;
                    text-align: center;
                }

                .badge {
                    background-color: var(--badge-bg);
                    color: white;
                    border-radius: 10px;
                    padding: 2px 8px;
                    font-size: 0.7rem;
                    margin-left: 8px;
                }

                .user-actions {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                /* Dashboard theme toggle */
                #dashboardThemeToggle {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                html[data-theme='dark'] #dashboardThemeToggle {
                    background-color: #333333;
                    color: #ffffff;
                }

                html[data-theme='light'] #dashboardThemeToggle {
                    background-color: #ffffff;
                    color: #333333;
                }

                #dashboardThemeToggle i {
                    font-size: 18px;
                }

                .tour-guide-btn {
                    background-color: var(--tour-guide-bg);
                    color: var(--tour-guide-text);
                    border: 1px solid var(--tour-guide-border);
                    border-radius: 4px;
                    padding: 12px 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s;
                    position: fixed;
                    right: 20px;
                    top: 50%;
                    transform: translateY(-50%);
                    z-index: 100;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                    writing-mode: vertical-rl;
                    text-orientation: mixed;
                    transform: translateY(-50%) rotate(180deg);
                    height: auto;
                    min-height: 120px;
                    letter-spacing: 1px;
                    font-weight: 500;
                }

                .tour-guide-btn:hover {
                    background-color: var(--tour-guide-hover);
                    right: 22px;
                }

                /* Tour Guide Prompt */
                .tour-guide-prompt {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background-color: var(--card-bg);
                    border: 2px solid var(--primary-color);
                    border-radius: 10px;
                    padding: 25px;
                    box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
                    z-index: 1002;
                    width: 400px;
                    max-width: 90%;
                    text-align: center;
                    animation: fadeIn 0.3s ease-out;
                }

                .tour-guide-prompt h3 {
                    margin-top: 0;
                    color: var(--primary-color);
                    font-size: 1.4rem;
                    margin-bottom: 15px;
                }

                .tour-guide-prompt p {
                    margin-bottom: 25px;
                    line-height: 1.5;
                    color: var(--text-color);
                }

                .tour-guide-prompt-buttons {
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                }

                .tour-guide-prompt-btn {
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.3s;
                    border: none;
                }

                .tour-guide-prompt-btn.yes {
                    background-color: var(--primary-color);
                    color: white;
                }

                .tour-guide-prompt-btn.no {
                    background-color: var(--card-bg);
                    color: var(--text-color);
                    border: 1px solid var(--border-color);
                }

                .tour-guide-prompt-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }

                .tour-guide-prompt-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    z-index: 1001;
                    animation: fadeIn 0.3s ease-out;
                    pointer-events: all; /* Ensures the overlay blocks interaction with elements behind it */
                }

                /* Light mode specific styles */
                html[data-theme='light'] .tour-guide-prompt {
                    background-color: white;
                    border-color: #333333;
                }

                html[data-theme='light'] .tour-guide-prompt h3 {
                    color: #333333;
                }

                html[data-theme='light'] .tour-guide-prompt-btn.yes {
                    background-color: #333333;
                }

                html[data-theme='light'] .tour-guide-prompt-overlay {
                    background-color: rgba(0, 0, 0, 0.5);
                }

                /* Dark mode specific styles */
                html[data-theme='dark'] .tour-guide-prompt {
                    background-color: #1a1a1a;
                    border-color: white;
                }

                html[data-theme='dark'] .tour-guide-prompt h3 {
                    color: white;
                }

                html[data-theme='dark'] .tour-guide-prompt-btn.yes {
                    background-color: white;
                    color: #333333;
                }

                html[data-theme='dark'] .tour-guide-prompt-overlay {
                    background-color: rgba(0, 0, 0, 0.7);
                }

                /* Tour overlay */
                .tour-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    z-index: 1000;
                    pointer-events: all;
                }

                html[data-theme='light'] .tour-overlay {
                    background-color: rgba(0, 0, 0, 0.5);
                }

                html[data-theme='dark'] .tour-overlay {
                    background-color: rgba(0, 0, 0, 0.7);
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                /* No icon styling needed */

                .user-profile {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    position: relative;
                    cursor: pointer;
                }

                .avatar i {
                    font-size: 1.8rem;
                }

                .logout-btn {
                    background-color: var(--primary-color);
                    border: none;
                    color: white;
                    padding: 6px 12px;
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    border-radius: 4px;
                    transition: all 0.3s;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
                }

                .logout-btn:hover {
                    background-color: var(--secondary-color);
                    transform: translateY(-2px);
                    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
                }

                .logout-btn i {
                    margin-right: 8px;
                    width: 20px;
                    text-align: center;
                }

                .dashboard-content {
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                    width: 100%;
                }

                .dashboard-stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                    gap: 20px;
                    margin-bottom: 20px;
                }

                .stat-card {
                    background-color: var(--card-bg);
                    border-radius: 8px;
                    padding: 20px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    display: flex;
                    align-items: center;
                    transition: transform 0.3s, box-shadow 0.3s;
                }

                .stat-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.15);
                }

                .stat-icon {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background-color: var(--stat-icon-bg);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 15px;
                }

                .stat-icon i {
                    font-size: 1.5rem;
                }

                .stat-info h3 {
                    margin: 0;
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                }

                .stat-number {
                    font-size: 1.8rem;
                    font-weight: 600;
                    margin: 5px 0 0;
                    color: var(--text-color);
                }

                .recent-tickets, .quick-actions {
                    background-color: var(--card-bg);
                    border-radius: 8px;
                    padding: 20px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    margin-bottom: 20px;
                }

                .recent-tickets h3, .quick-actions h3 {
                    margin-top: 0;
                    margin-bottom: 15px;
                    font-size: 1.2rem;
                }

                .tickets-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .tickets-table th, .tickets-table td {
                    padding: 12px 15px;
                    text-align: left;
                    border-bottom: 1px solid var(--border-color);
                }

                .tickets-table th {
                    font-weight: 600;
                    color: var(--text-secondary);
                }

                .status-badge, .priority-badge {
                    padding: 5px 10px;
                    border-radius: 15px;
                    font-size: 0.8rem;
                    display: inline-block;
                }

                /* Light theme badges - Black and white only */
                html[data-theme='light'] .status-badge.open {
                    background-color: #f5f5f5;
                    color: #333333;
                }

                html[data-theme='light'] .status-badge.in-progress {
                    background-color: #e0e0e0;
                    color: #333333;
                }

                html[data-theme='light'] .status-badge.resolved {
                    background-color: #cccccc;
                    color: #333333;
                }

                html[data-theme='light'] .priority-badge.high {
                    background-color: #333333;
                    color: #ffffff;
                }

                html[data-theme='light'] .priority-badge.medium {
                    background-color: #555555;
                    color: #ffffff;
                }

                html[data-theme='light'] .priority-badge.low {
                    background-color: #777777;
                    color: #ffffff;
                }

                .action-buttons {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 15px;
                }

                .action-btn {
                    background-color: var(--action-btn-bg);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    padding: 12px 15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: background-color 0.3s;
                    position: relative;
                }

                .action-btn:hover {
                    background-color: var(--action-btn-hover);
                }

                .action-btn i {
                    margin-right: 8px;
                }

                .notification-badge {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background-color: var(--badge-bg);
                    color: white;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.7rem;
                }

                /* Tour tooltip styles */
                .tour-tooltip {
                    position: absolute;
                    background-color: var(--tour-tooltip-bg);
                    color: var(--tour-tooltip-text);
                    padding: 15px;
                    border-radius: 8px;
                    border: 1px solid var(--tour-tooltip-border);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                    z-index: 1002; /* Above the overlay and highlighted elements */
                    max-width: 300px;
                    animation: pulse 2s infinite;
                    pointer-events: auto; /* Ensures the tooltip can be interacted with */
                }

                .tour-tooltip::after {
                    content: '';
                    position: absolute;
                    width: 0;
                    height: 0;
                    border-style: solid;
                }

                .tour-tooltip.top::after {
                    border-width: 10px 10px 0 10px;
                    border-color: var(--tour-tooltip-bg) transparent transparent transparent;
                    bottom: -10px;
                    left: 50%;
                    transform: translateX(-50%);
                }

                .tour-tooltip.bottom::after {
                    border-width: 0 10px 10px 10px;
                    border-color: transparent transparent var(--tour-tooltip-bg) transparent;
                    top: -10px;
                    left: 50%;
                    transform: translateX(-50%);
                }

                .tour-tooltip.left::after {
                    border-width: 10px 0 10px 10px;
                    border-color: transparent transparent transparent var(--tour-tooltip-bg);
                    right: -10px;
                    top: 50%;
                    transform: translateY(-50%);
                }

                .tour-tooltip.right::after {
                    border-width: 10px 10px 10px 0;
                    border-color: transparent var(--tour-tooltip-bg) transparent transparent;
                    left: -10px;
                    top: 50%;
                    transform: translateY(-50%);
                }

                .tour-tooltip h4 {
                    margin-top: 0;
                    margin-bottom: 8px;
                    color: var(--tour-tooltip-text);
                }

                .tour-tooltip p {
                    margin: 0 0 10px;
                    color: var(--tour-tooltip-text);
                }

                .tour-buttons {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 10px;
                }

                .tour-btn {
                    background-color: var(--tour-btn-bg);
                    color: var(--tour-btn-text);
                    border: none;
                    border-radius: 4px;
                    padding: 5px 10px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }

                .tour-btn:hover {
                    opacity: 0.9;
                    transform: translateY(-1px);
                }

                // .tour-btn.skip {
                //     background-color: transparent;
                //     color: var(--tour-tooltip-text);
                //     border: 1px solid var(--tour-tooltip-border);
                // }

                .tour-btn.skip:hover {
                    background-color: rgba(0, 0, 0, 0.05);
                }

                @keyframes pulse {
                    0% {
                        box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
                    }
                    70% {
                        box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
                    }
                    100% {
                        box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
                    }
                }

                html[data-theme='dark'] .tour-tooltip {
                    animation: pulse-dark 2s infinite;
                }

                @keyframes pulse-dark {
                    0% {
                        box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
                    }
                    70% {
                        box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
                    }
                    100% {
                        box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
                    }
                }

                /* Responsive adjustments */
                @media (max-width: 992px) {
                    .dashboard-header {
                        flex-wrap: wrap;
                        height: auto;
                        padding: 10px;
                    }

                    .top-menu {
                        order: 3;
                        width: 100%;
                        margin-top: 10px;
                    }

                    .menu-list {
                        width: 100%;
                        justify-content: space-between;
                    }

                    .menu-item {
                        padding: 10px;
                        height: auto;
                    }

                    .logo-box {
                        height: 35px;
                        width: 35px;
                    }
                }

                @media (max-width: 768px) {
                    .menu-item span {
                        display: none;
                    }

                    .menu-item i {
                        margin-right: 0;
                    }

                    .badge {
                        position: absolute;
                        top: 5px;
                        right: 5px;
                    }

                    .tour-guide-btn {
                        padding: 8px;
                        writing-mode: vertical-rl;
                        text-orientation: mixed;
                        transform: rotate(180deg);
                        min-height: 100px;
                        font-size: 0.9rem;
                    }

                    .username {
                        display: none;
                    }

                    .logout-btn span {
                        display: none;
                    }

                    .logout-btn i {
                        margin-right: 0;
                    }

                    .logo-box {
                        height: 30px;
                        width: 30px;
                        min-width: 30px;
                    }

                    .dashboard-logo h2 {
                        font-size: 1rem;
                    }
                }
            `;
            document.head.appendChild(style);

            // Create and show the tour guide prompt
            function showTourGuidePrompt() {
                // Create overlay
                const overlay = document.createElement('div');
                overlay.className = 'tour-guide-prompt-overlay';
                document.body.appendChild(overlay);

                // Create prompt
                const prompt = document.createElement('div');
                prompt.className = 'tour-guide-prompt';
                prompt.innerHTML = `
                    <h3>Welcome to the Ticketing System</h3>
                    <p>Would you like to take a guided tour to learn about the features and functionality of the system?</p>
                    <div class="tour-guide-prompt-buttons">
                        <button class="tour-guide-prompt-btn yes">Yes, show me around</button>
                        <button class="tour-guide-prompt-btn no">No, I'll explore on my own</button>
                    </div>
                `;
                document.body.appendChild(prompt);

                // Add event listeners to buttons
                prompt.querySelector('.tour-guide-prompt-btn.yes').addEventListener('click', function() {
                    // Remove prompt and overlay
                    document.body.removeChild(prompt);
                    document.body.removeChild(overlay);

                    // Start the tour
                    startTour();
                });

                prompt.querySelector('.tour-guide-prompt-btn.no').addEventListener('click', function() {
                    // Remove prompt and overlay
                    document.body.removeChild(prompt);
                    document.body.removeChild(overlay);
                });
            }

            // Show tour guide prompt if requested, otherwise don't show anything
            if (showTour) {
                showTourGuidePrompt();
            }

            // Add event listener for the "Guided Tour" button
            document.getElementById('startTourBtn').addEventListener('click', function() {
                startTour();
            });

            // Add event listener for the "Back to Release Notes" button
            document.querySelector('.logout-btn').addEventListener('click', function() {
                // Show the release notes modal
                populateReleaseNotes(currentLanguage);
                modal.style.display = 'block';
            });
        } else {
            // If dashboard already exists, just show it
            document.getElementById('dashboard').style.display = 'flex';

            // Show tour guide prompt if requested
            if (showTour) {
                // Create and show the tour guide prompt
                function showTourGuidePrompt() {
                    // Create overlay
                    const overlay = document.createElement('div');
                    overlay.className = 'tour-guide-prompt-overlay';
                    document.body.appendChild(overlay);

                    // Create prompt
                    const prompt = document.createElement('div');
                    prompt.className = 'tour-guide-prompt';
                    prompt.innerHTML = `
                        <h3>Welcome to the Ticketing System</h3>
                        <p>Would you like to take a guided tour to learn about the features and functionality of the system?</p>
                        <div class="tour-guide-prompt-buttons">
                            <button class="tour-guide-prompt-btn yes">Yes, show me around</button>
                            <button class="tour-guide-prompt-btn no">No, I'll explore on my own</button>
                        </div>
                    `;
                    document.body.appendChild(prompt);

                    // Add event listeners to buttons
                    prompt.querySelector('.tour-guide-prompt-btn.yes').addEventListener('click', function() {
                        // Remove prompt and overlay
                        document.body.removeChild(prompt);
                        document.body.removeChild(overlay);

                        // Start the tour
                        startTour();
                    });

                    prompt.querySelector('.tour-guide-prompt-btn.no').addEventListener('click', function() {
                        // Remove prompt and overlay
                        document.body.removeChild(prompt);
                        document.body.removeChild(overlay);
                    });
                }

                showTourGuidePrompt();
            }

            // Make sure the event listener for the "Guided Tour" button is added
            if (document.getElementById('startTourBtn')) {
                document.getElementById('startTourBtn').addEventListener('click', function() {
                    startTour();
                });
            }

            // Make sure the event listener for the logout button is added
            const logoutBtn = document.querySelector('.logout-btn');
            if (logoutBtn) {
                // Remove any existing event listeners
                const newLogoutBtn = logoutBtn.cloneNode(true);
                logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);

                // Add new event listener
                newLogoutBtn.addEventListener('click', function() {
                    // Show the release notes modal
                    populateReleaseNotes(currentLanguage);
                    modal.style.display = 'block';
                });
            }
        }
    }

    // Function to show the guided tour prompt
    function showGuidedTourPrompt() {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'tour-guide-prompt-overlay';
        document.body.appendChild(overlay);

        // Create prompt
        const prompt = document.createElement('div');
        prompt.className = 'tour-guide-prompt';
        prompt.innerHTML = `
            <h3>Welcome to the Ticketing System</h3>
            <p>Would you like to take a guided tour to learn about the features and functionality of the system?</p>
            <div class="tour-guide-prompt-buttons">
                <button class="tour-guide-prompt-btn yes">Yes, show me around</button>
                <button class="tour-guide-prompt-btn no">No, I'll explore on my own</button>
            </div>
        `;
        document.body.appendChild(prompt);

        // Show dashboard first so the tour has elements to highlight
        showDashboard(false);

        // Add event listeners to buttons
        prompt.querySelector('.tour-guide-prompt-btn.yes').addEventListener('click', function() {
            // Remove prompt and overlay
            document.body.removeChild(prompt);
            document.body.removeChild(overlay);

            // Start the tour
            startTour();
        });

        prompt.querySelector('.tour-guide-prompt-btn.no').addEventListener('click', function() {
            // Remove prompt and overlay
            document.body.removeChild(prompt);
            document.body.removeChild(overlay);

            // Just show the dashboard without tour
            // Dashboard is already shown, so no need to call showDashboard again
        });
    }

    // Function to start the guided tour
    function startTour() {
        // Tour steps configuration
        const tourSteps = [
            {
                element: '[data-tour="top-menu"]',
                title: 'Main Navigation',
                content: 'This menu provides access to all the main features of the ticketing system.',
                position: 'bottom'
            },
            {
                element: '[data-tour="home"]',
                title: 'Dashboard Home',
                content: 'This is your main dashboard where you can see an overview of all your tickets and activities.',
                position: 'bottom'
            },
            {
                element: '[data-tour="tickets"]',
                title: 'My Tickets',
                content: 'View all your assigned tickets here. The badge shows how many tickets are currently assigned to you.',
                position: 'bottom'
            },
            {
                element: '[data-tour="create"]',
                title: 'Create New Tickets',
                content: 'Need to report an issue? Create a new ticket from here.',
                position: 'bottom'
            },
            // {
            //     element: '[data-tour="guide-btn"]',
            //     title: 'Show Guide',
            //     content: 'Click this button anytime to restart this tour and learn about the dashboard features.',
            //     position: 'left'
            // },
            {
                element: '[data-tour="open-tickets"]',
                title: 'Open Tickets',
                content: 'These are tickets that have been reported but not yet assigned to a technician.',
                position: 'bottom'
            },
            {
                element: '[data-tour="in-progress"]',
                title: 'In Progress',
                content: 'Tickets currently being worked on by technicians.',
                position: 'bottom'
            },
            {
                element: '[data-tour="recent-tickets"]',
                title: 'Recent Tickets',
                content: 'Here you can see the most recent tickets in the system and their current status.',
                position: 'top'
            },
            {
                element: '[data-tour="quick-actions"]',
                title: 'Quick Actions',
                content: 'Frequently used actions are available here for quick access.',
                position: 'top'
            }
        ];

        // No need to track current step as it's passed directly to the function
        let activeTooltip = null;
        let tourOverlay = null;

        // Function to create an overlay that prevents interaction with other elements
        function createTourOverlay() {
            // Remove existing overlay if any
            if (tourOverlay) {
                document.body.removeChild(tourOverlay);
            }

            // Create new overlay
            tourOverlay = document.createElement('div');
            tourOverlay.className = 'tour-overlay';
            tourOverlay.style.position = 'fixed';
            tourOverlay.style.top = '0';
            tourOverlay.style.left = '0';
            tourOverlay.style.width = '100%';
            tourOverlay.style.height = '100%';
            tourOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            tourOverlay.style.zIndex = '1000';
            tourOverlay.style.pointerEvents = 'all';

            // Apply theme-specific styles
            if (document.documentElement.getAttribute('data-theme') === 'dark') {
                tourOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            }

            document.body.appendChild(tourOverlay);

            return tourOverlay;
        }

        // Function to remove the tour overlay
        function removeTourOverlay() {
            if (tourOverlay) {
                document.body.removeChild(tourOverlay);
                tourOverlay = null;
            }
        }

        // Function to show a tour step
        function showTourStep(step) {
            // Remove any existing tooltip
            if (activeTooltip) {
                document.body.removeChild(activeTooltip);
            }

            if (step >= tourSteps.length) {
                // Tour completed
                // Remove the overlay
                removeTourOverlay();
                return;
            }

            const tourStep = tourSteps[step];
            const element = document.querySelector(tourStep.element);

            if (!element) {
                // Skip this step if element not found
                showTourStep(step + 1);
                return;
            }

            // Create tooltip
            const tooltip = document.createElement('div');
            tooltip.className = `tour-tooltip ${tourStep.position}`;
            tooltip.innerHTML = `
                <h4>${tourStep.title}</h4>
                <p>${tourStep.content}</p>
                <div class="tour-buttons">
                    <button class="tour-btn skip">Skip Tour</button>
                    <div>
                        ${step > 0 ? '<button class="tour-btn prev">Previous</button>' : ''}
                        <button class="tour-btn next">${step < tourSteps.length - 1 ? 'Next' : 'Finish'}</button>
                    </div>
                </div>
            `;

            // Position the tooltip with enough distance to not block interaction
            const rect = element.getBoundingClientRect();
            const tooltipOffset = 25; // Increased offset to ensure tooltip doesn't block interaction

            switch(tourStep.position) {
                case 'top':
                    tooltip.style.bottom = `${window.innerHeight - rect.top + tooltipOffset}px`;
                    tooltip.style.left = `${rect.left + rect.width/2 - 150}px`;
                    break;
                case 'bottom':
                    tooltip.style.top = `${rect.bottom + tooltipOffset}px`;
                    tooltip.style.left = `${rect.left + rect.width/2 - 150}px`;
                    break;
                case 'left':
                    tooltip.style.right = `${window.innerWidth - rect.left + tooltipOffset}px`;
                    tooltip.style.top = `${rect.top + rect.height/2 - 75}px`;
                    break;
                case 'right':
                    tooltip.style.left = `${rect.right + tooltipOffset}px`;
                    tooltip.style.top = `${rect.top + rect.height/2 - 75}px`;
                    break;
            }

            // Create overlay to prevent interaction with other elements
            createTourOverlay();

            // Add the tooltip to the body
            document.body.appendChild(tooltip);
            activeTooltip = tooltip;

            // Highlight the current element
            element.classList.add('highlight');

            // Make sure the highlighted element and tooltip are above the overlay
            element.style.position = 'relative';
            element.style.zIndex = '1001';

            // Add event listeners to buttons
            tooltip.querySelector('.tour-btn.skip').addEventListener('click', () => {
                // End tour
                if (activeTooltip) {
                    document.body.removeChild(activeTooltip);
                    activeTooltip = null;
                }

                // Remove highlight from all elements
                document.querySelectorAll('[data-tour]').forEach(el => {
                    el.classList.remove('highlight');
                    el.style.position = '';
                    el.style.zIndex = '';
                });

                // Remove the overlay
                removeTourOverlay();
            });

            if (step > 0) {
                tooltip.querySelector('.tour-btn.prev').addEventListener('click', () => {
                    // Remove highlight from current element
                    element.classList.remove('highlight');
                    element.style.position = '';
                    element.style.zIndex = '';

                    // Go to previous step
                    showTourStep(step - 1);
                });
            }

            tooltip.querySelector('.tour-btn.next').addEventListener('click', () => {
                // Remove highlight from current element
                element.classList.remove('highlight');
                element.style.position = '';
                element.style.zIndex = '';

                // Go to next step
                showTourStep(step + 1);
            });
        }

        // Start the tour with the first step
        showTourStep(0);
    }

    // Language selector event listener

    // Language selector
    languageSelect.addEventListener('change', function() {
        currentLanguage = this.value;
        populateReleaseNotes(currentLanguage);
    });

    // Save PDF button
    savePdfBtn.addEventListener('click', function() {
        generatePDF();
    });

    // Continue button - show the dashboard
    continueBtn.addEventListener('click', function() {
        // Hide the modal
        modal.style.display = 'none';

        // Hide the container with the release notes button
        document.querySelector('.container').style.display = 'none';
        document.querySelector('.background').style.display = 'none';
        document.querySelector('.theme-toggle-container').style.display = 'none';

        // Show the dashboard
        showDashboard(true);
    });

    // Add scroll event listener to check when user reaches the bottom
    modalBody.addEventListener('scroll', function() {
        checkScrollPosition();
    });

    // Add some animations for inputs
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
});
