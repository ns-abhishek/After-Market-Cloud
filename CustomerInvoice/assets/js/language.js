// Language Management System

// Available languages
const languages = {
    en: {
        name: 'English',
        flag: '🇺🇸',
        direction: 'ltr'
    },
    es: {
        name: 'Español',
        flag: '🇪🇸',
        direction: 'ltr'
    },
    fr: {
        name: 'Français',
        flag: '🇫🇷',
        direction: 'ltr'
    }
};

// Translation data
const translations = {
    en: {
        // Navigation
        home: 'Home',
        dashboard: 'Dashboard',
        add_new: 'Add New',
        export: 'Export',
        advanced_search: 'Advanced Search',
        advanced_filter: 'Advanced Filter',
        theme: 'Theme',
        language: 'Language',

        // Main page
        customer_invoice: 'Customer Invoice',
        customer_invoice_desc: 'Manage customer invoices and payments',
        service_return: 'Service Invoice Return',
        service_return_desc: 'Handle service returns and credits',
        internal_invoice: 'Internal Invoice',
        internal_invoice_desc: 'Internal company invoicing',
        internal_return: 'Internal Invoice Return',
        internal_return_desc: 'Internal returns and adjustments',

        // Statistics
        quick_stats: 'Quick Statistics',
        total_invoices: 'Total Invoices',
        total_revenue: 'Total Revenue',
        pending_returns: 'Pending Returns',
        completion_rate: 'Completion Rate',
        quick_actions: 'Quick Actions',

        // Table headers
        view: 'View',
        customer_invoice_name: 'Customer Invoice Name',
        payment_mode: 'Payment Mode',
        date: 'Date',
        work_order: 'Work Order',
        work_order_date: 'Work Order Date',
        serial: 'Serial',
        model: 'Model',
        draft_invoice_amount: 'Draft Invoice Amount',
        tax_amount: 'Tax Amount',
        invoice_amount: 'Invoice Amount',
        sap_status: 'SAP Status',
        send_mail: 'Send Mail',

        // Service return headers
        service_invoice_return: 'Service Invoice Return',
        service_invoice_return_date: 'Service Invoice Return Date',
        is_full_return: 'Is Full Return',
        name: 'Name',
        generated_through: 'Generated Through',
        credit_inr: 'Credit INR',

        // Internal invoice headers
        internal_invoice: 'Internal Invoice',
        customer_account: 'Customer Account',
        branch: 'Branch',

        // Internal return headers
        return: 'Return',
        return_date: 'Return Date',

        // Common
        search: 'Search',
        filter: 'Filter',
        clear: 'Clear',
        apply: 'Apply',
        save: 'Save',
        cancel: 'Cancel',
        edit: 'Edit',
        delete: 'Delete',
        yes: 'Yes',
        no: 'No',
        loading: 'Loading...',
        success: 'Success',
        error: 'Error',
        warning: 'Warning',
        info: 'Information',

        // Messages
        record_saved: 'Record saved successfully!',
        record_deleted: 'Record deleted successfully!',
        confirm_delete: 'Are you sure you want to delete this record?',
        no_data: 'No data available',
        search_results: 'Search Results',
        filter_applied: 'Filter applied successfully',
        export_success: 'Data exported successfully',

        // Forms
        customer_name: 'Customer Name',
        amount: 'Amount',
        serial_number: 'Serial Number',
        full_return: 'Full Return',
        select_payment_mode: 'Select Payment Mode',
        cash: 'Cash',
        card: 'Card',
        bank_transfer: 'Bank Transfer',
        check: 'Check',
        satisfaction: 'Satisfaction',
        rework: 'Rework',
        main: 'Main',

        // Status
        active: 'Active',
        pending: 'Pending',
        completed: 'Completed',
        cancelled: 'Cancelled',

        // Export
        export_pdf: 'Export as PDF',
        export_excel: 'Export as Excel'
    },

    es: {
        // Navigation
        home: 'Inicio',
        dashboard: 'Panel',
        add_new: 'Agregar Nuevo',
        export: 'Exportar',
        advanced_search: 'Búsqueda Avanzada',
        advanced_filter: 'Filtro Avanzado',
        theme: 'Tema',
        language: 'Idioma',

        // Main page
        customer_invoice: 'Factura de Cliente',
        customer_invoice_desc: 'Gestionar facturas y pagos de clientes',
        service_return: 'Devolución de Factura de Servicio',
        service_return_desc: 'Manejar devoluciones de servicio y créditos',
        internal_invoice: 'Factura Interna',
        internal_invoice_desc: 'Facturación interna de la empresa',
        internal_return: 'Devolución de Factura Interna',
        internal_return_desc: 'Devoluciones internas y ajustes',

        // Statistics
        quick_stats: 'Estadísticas Rápidas',
        total_invoices: 'Total de Facturas',
        total_revenue: 'Ingresos Totales',
        pending_returns: 'Devoluciones Pendientes',
        completion_rate: 'Tasa de Finalización',

        // Common
        search: 'Buscar',
        filter: 'Filtrar',
        clear: 'Limpiar',
        apply: 'Aplicar',
        save: 'Guardar',
        cancel: 'Cancelar',
        edit: 'Editar',
        delete: 'Eliminar',
        yes: 'Sí',
        no: 'No',
        loading: 'Cargando...',
        success: 'Éxito',
        error: 'Error',
        warning: 'Advertencia',
        info: 'Información',

        // Messages
        record_saved: '¡Registro guardado exitosamente!',
        record_deleted: '¡Registro eliminado exitosamente!',
        confirm_delete: '¿Estás seguro de que quieres eliminar este registro?',
        no_data: 'No hay datos disponibles',
        search_results: 'Resultados de Búsqueda',
        filter_applied: 'Filtro aplicado exitosamente',
        export_success: 'Datos exportados exitosamente'
    },

    fr: {
        // Navigation
        home: 'Accueil',
        dashboard: 'Tableau de Bord',
        add_new: 'Ajouter Nouveau',
        export: 'Exporter',
        advanced_search: 'Recherche Avancée',
        advanced_filter: 'Filtre Avancé',
        theme: 'Thème',
        language: 'Langue',

        // Main page
        customer_invoice: 'Facture Client',
        customer_invoice_desc: 'Gérer les factures et paiements clients',
        service_return: 'Retour de Facture de Service',
        service_return_desc: 'Gérer les retours de service et crédits',
        internal_invoice: 'Facture Interne',
        internal_invoice_desc: 'Facturation interne de l\'entreprise',
        internal_return: 'Retour de Facture Interne',
        internal_return_desc: 'Retours internes et ajustements',

        // Statistics
        quick_stats: 'Statistiques Rapides',
        total_invoices: 'Total des Factures',
        total_revenue: 'Revenus Totaux',
        pending_returns: 'Retours en Attente',
        completion_rate: 'Taux d\'Achèvement',

        // Common
        search: 'Rechercher',
        filter: 'Filtrer',
        clear: 'Effacer',
        apply: 'Appliquer',
        save: 'Enregistrer',
        cancel: 'Annuler',
        edit: 'Modifier',
        delete: 'Supprimer',
        yes: 'Oui',
        no: 'Non',
        loading: 'Chargement...',
        success: 'Succès',
        error: 'Erreur',
        warning: 'Avertissement',
        info: 'Information',

        // Messages
        record_saved: 'Enregistrement sauvegardé avec succès!',
        record_deleted: 'Enregistrement supprimé avec succès!',
        confirm_delete: 'Êtes-vous sûr de vouloir supprimer cet enregistrement?',
        no_data: 'Aucune donnée disponible',
        search_results: 'Résultats de Recherche',
        filter_applied: 'Filtre appliqué avec succès',
        export_success: 'Données exportées avec succès'
    }
};

// Current language
let currentLanguage = 'en';

// Initialize language system
function initializeLanguage() {
    loadLanguagePreference();
    setupLanguageEventListeners();
    translatePage();
}

// Load language preference from localStorage
function loadLanguagePreference() {
    const savedLanguage = localStorage.getItem('invoiceLanguage');
    if (savedLanguage && languages[savedLanguage]) {
        currentLanguage = savedLanguage;
    } else {
        // Try to detect browser language
        const browserLang = navigator.language.split('-')[0];
        if (languages[browserLang]) {
            currentLanguage = browserLang;
        }
    }

    applyLanguage(currentLanguage);
}

// Apply language to the document
function applyLanguage(langCode) {
    if (!languages[langCode]) {
        console.warn(`Language "${langCode}" not found. Using default language.`);
        langCode = 'en';
    }

    currentLanguage = langCode;

    // Set document language
    document.documentElement.lang = langCode;

    // Set text direction
    document.documentElement.dir = languages[langCode].direction;

    // Save preference
    localStorage.setItem('invoiceLanguage', langCode);

    // Translate the page
    translatePage();

    // Update language indicator
    updateLanguageIndicator();

    // Dispatch language change event
    dispatchLanguageChangeEvent(langCode);

    console.log(`Language changed to: ${languages[langCode].name}`);
}

// Set language (called from UI)
function setLanguage(langCode) {
    applyLanguage(langCode);
    showToast(`Language changed to ${languages[langCode].name}`, 'success');
}

// Translate the current page
function translatePage() {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        const translation = getTranslation(key);
        if (translation) {
            if (element.tagName === 'INPUT' && element.type === 'submit') {
                element.value = translation;
            } else if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        }
    });

    // Translate dynamic content
    translateDynamicContent();
}

// Translate dynamic content (modals, tooltips, etc.)
function translateDynamicContent() {
    // Translate tooltips
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => {
        const titleKey = tooltip.getAttribute('data-translate-title');
        if (titleKey) {
            const translation = getTranslation(titleKey);
            if (translation) {
                tooltip.setAttribute('title', translation);
                tooltip.setAttribute('data-bs-original-title', translation);
            }
        }
    });

    // Translate aria-labels
    const ariaElements = document.querySelectorAll('[data-translate-aria]');
    ariaElements.forEach(element => {
        const ariaKey = element.getAttribute('data-translate-aria');
        const translation = getTranslation(ariaKey);
        if (translation) {
            element.setAttribute('aria-label', translation);
        }
    });
}

// Get translation for a key
function getTranslation(key, langCode = currentLanguage) {
    const langTranslations = translations[langCode];
    if (!langTranslations) {
        return translations.en[key] || key;
    }

    return langTranslations[key] || translations.en[key] || key;
}

// Get all translations for current language
function getCurrentTranslations() {
    return translations[currentLanguage] || translations.en;
}

// Update language indicator in navigation
function updateLanguageIndicator() {
    const languageDropdown = document.querySelector('[data-bs-toggle="dropdown"]:has(.fa-globe)');
    if (languageDropdown) {
        const langInfo = languages[currentLanguage];
        const textNode = languageDropdown.childNodes[languageDropdown.childNodes.length - 1];
        if (textNode && textNode.nodeType === Node.TEXT_NODE) {
            textNode.textContent = langInfo.name;
        }
    }
}

// Setup event listeners for language system
function setupLanguageEventListeners() {
    // Listen for storage changes (language changes in other tabs)
    window.addEventListener('storage', handleLanguageStorageChange);
}

// Handle localStorage changes from other tabs
function handleLanguageStorageChange(e) {
    if (e.key === 'invoiceLanguage' && e.newValue) {
        const newLanguage = e.newValue;
        if (languages[newLanguage] && newLanguage !== currentLanguage) {
            applyLanguage(newLanguage);
        }
    }
}

// Dispatch custom language change event
function dispatchLanguageChangeEvent(langCode) {
    const event = new CustomEvent('languageChanged', {
        detail: {
            language: langCode,
            languageInfo: languages[langCode],
            translations: translations[langCode]
        }
    });
    document.dispatchEvent(event);
}

// Get current language
function getCurrentLanguage() {
    return currentLanguage;
}

// Get language info
function getLanguageInfo(langCode = currentLanguage) {
    return languages[langCode] || languages.en;
}

// Get available languages
function getAvailableLanguages() {
    return languages;
}

// Format number according to current language
function formatNumber(number, options = {}) {
    const locale = getLocaleFromLanguage(currentLanguage);
    return new Intl.NumberFormat(locale, options).format(number);
}

// Format currency according to current language
function formatCurrency(amount, currency = 'USD') {
    const locale = getLocaleFromLanguage(currentLanguage);
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency
    }).format(amount);
}

// Format date according to current language
function formatDate(date, options = {}) {
    const locale = getLocaleFromLanguage(currentLanguage);
    return new Intl.DateTimeFormat(locale, options).format(new Date(date));
}

// Get locale from language code
function getLocaleFromLanguage(langCode) {
    const locales = {
        en: 'en-US',
        es: 'es-ES',
        fr: 'fr-FR'
    };
    return locales[langCode] || 'en-US';
}

// Translate text dynamically
function translateText(key, langCode = currentLanguage) {
    return getTranslation(key, langCode);
}

// Add translation to existing translations
function addTranslation(langCode, key, value) {
    if (!translations[langCode]) {
        translations[langCode] = {};
    }
    translations[langCode][key] = value;
}

// Create language selector component
function createLanguageSelector(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID "${containerId}" not found`);
        return;
    }

    const selectorHtml = `
        <div class="language-selector">
            <h5 class="mb-3">${getTranslation('language')}</h5>
            <div class="row g-2">
                ${Object.entries(languages).map(([key, lang]) => `
                    <div class="col-4">
                        <div class="language-option ${key === currentLanguage ? 'active' : ''}"
                             onclick="setLanguage('${key}')"
                             data-language="${key}">
                            <div class="language-flag">${lang.flag}</div>
                            <div class="language-name">${lang.name}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    container.innerHTML = selectorHtml;
}

// Add CSS for language selector if not already present
function addLanguageSelectorStyles() {
    if (document.getElementById('language-selector-styles')) return;

    const styles = `
        <style id="language-selector-styles">
            .language-selector .language-option {
                padding: 1rem;
                border: 2px solid var(--border-color, #dee2e6);
                border-radius: var(--border-radius, 8px);
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
                background: var(--card-bg, #ffffff);
            }

            .language-selector .language-option:hover {
                border-color: var(--primary-color, #000000);
                transform: translateY(-2px);
                box-shadow: 0 4px 12px var(--shadow-color, rgba(0,0,0,0.1));
            }

            .language-selector .language-option.active {
                border-color: var(--primary-color, #000000);
                background: var(--primary-color, #000000);
                color: var(--secondary-color, #ffffff);
            }

            .language-selector .language-flag {
                font-size: 1.5rem;
                margin-bottom: 0.5rem;
            }

            .language-selector .language-name {
                font-weight: 600;
                font-size: 0.875rem;
            }
        </style>
    `;

    document.head.insertAdjacentHTML('beforeend', styles);
}

// Initialize language system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeLanguage();
    addLanguageSelectorStyles();
});

// Export functions for global use
window.languageManager = {
    setLanguage,
    getCurrentLanguage,
    getLanguageInfo,
    getAvailableLanguages,
    translateText,
    formatNumber,
    formatCurrency,
    formatDate,
    createLanguageSelector,
    addTranslation
};

// Listen for language change events
document.addEventListener('languageChanged', function(e) {
    console.log('Language changed:', e.detail);

    // Update any components that need to respond to language changes
    updateComponentsForLanguage(e.detail.language);
});

// Update components when language changes
function updateComponentsForLanguage(langCode) {
    // Update charts if they exist
    if (window.chartManager) {
        window.chartManager.updateLanguage(langCode);
    }

    // Update data tables if they exist
    if (window.tableManager) {
        window.tableManager.updateLanguage(langCode);
    }

    // Re-translate any dynamically generated content
    setTimeout(translatePage, 100);
}
