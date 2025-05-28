/**
 * Report Wizard - Internationalization Module
 * 
 * This module handles internationalization (i18n) functionality.
 */

// Available languages
const availableLanguages = {
    en: 'English',
    es: 'Español',
    fr: 'Français'
};

// Default language
let currentLanguage = 'en';

// Translations
const translations = {
    en: {
        // General
        'app.title': 'Report Wizard',
        'app.save': 'Save',
        'app.load': 'Load',
        'app.language': 'Language',
        'app.next': 'Next',
        'app.previous': 'Previous',
        'app.finish': 'Finish',
        'app.step': 'Step',
        'app.of': 'of',
        
        // Steps
        'step.dataSource.title': 'Data Source',
        'step.dataSource.desc': 'Select your data source',
        'step.dataSelection.title': 'Data Selection',
        'step.dataSelection.desc': 'Choose fields and filters',
        'step.grouping.title': 'Grouping & Aggregation',
        'step.grouping.desc': 'Organize your data',
        'step.sorting.title': 'Sorting',
        'step.sorting.desc': 'Order your results',
        'step.visualization.title': 'Visualization',
        'step.visualization.desc': 'Choose layout and charts',
        'step.formatting.title': 'Formatting',
        'step.formatting.desc': 'Style your report',
        'step.preview.title': 'Preview & Export',
        'step.preview.desc': 'Review and download',
        
        // Data Source
        'dataSource.title': 'Select Data Source',
        'dataSource.file.title': 'File Upload',
        'dataSource.file.desc': 'Upload CSV, Excel, or JSON files',
        'dataSource.file.button': 'Choose File',
        'dataSource.sample.title': 'Sample Data',
        'dataSource.sample.desc': 'Use our sample datasets',
        'dataSource.sample.button': 'Browse Samples',
        'dataSource.paste.title': 'Paste Data',
        'dataSource.paste.desc': 'Paste data from clipboard',
        'dataSource.paste.button': 'Open Editor',
        'dataSource.preview.title': 'Data Preview',
        
        // Data Selection
        'dataSelection.title': 'Select Data Fields',
        'dataSelection.info': 'Select the fields you want to include in your report and apply any filters.',
        'dataSelection.availableFields': 'Available Fields',
        'dataSelection.selectedFields': 'Selected Fields',
        'dataSelection.searchPlaceholder': 'Search fields...',
        'dataSelection.noFieldsAvailable': 'All fields have been selected.',
        'dataSelection.noFieldsSelected': 'No fields selected. Drag fields from the available fields list.',
        'dataSelection.filters': 'Filters',
        'dataSelection.addFilter': 'Add Filter',
        
        // Grouping & Aggregation
        'grouping.title': 'Grouping & Aggregation',
        'grouping.info': 'Group your data and apply aggregation functions to create summary reports.',
        'grouping.groupBy': 'Group By',
        'grouping.groupByDesc': 'Select fields to group your data by:',
        'grouping.addGrouping': 'Add Grouping',
        'grouping.aggregations': 'Aggregations',
        'grouping.aggregationsDesc': 'Apply aggregation functions to numeric fields:',
        'grouping.addAggregation': 'Add Aggregation',
        'grouping.of': 'of',
        'grouping.as': 'as',
        
        // Sorting
        'sorting.title': 'Sorting',
        'sorting.info': 'Define how your data should be sorted in the report.',
        'sorting.addSorting': 'Add Sorting Rule',
        
        // Visualization
        'visualization.title': 'Visualization',
        'visualization.info': 'Choose how to visualize your report data.',
        'visualization.type': 'Visualization Type',
        'visualization.table': 'Table',
        'visualization.bar': 'Bar Chart',
        'visualization.line': 'Line Chart',
        'visualization.pie': 'Pie Chart',
        'visualization.scatter': 'Scatter Plot',
        'visualization.pivot': 'Pivot Table',
        'visualization.layout': 'Layout Options',
        'visualization.reportTitle': 'Report Title',
        'visualization.reportSubtitle': 'Subtitle (optional)',
        'visualization.showLegend': 'Show Legend',
        
        // Formatting
        'formatting.title': 'Formatting',
        'formatting.info': 'Customize the appearance of your report.',
        'formatting.colors': 'Colors & Theme',
        'formatting.colorScheme': 'Color Scheme',
        'formatting.monochrome': 'Monochrome',
        'formatting.grayscale': 'Grayscale',
        'formatting.highContrast': 'High Contrast',
        'formatting.numberFormatting': 'Number Formatting',
        'formatting.dateFormatting': 'Date Formatting',
        'formatting.conditionalFormatting': 'Conditional Formatting',
        'formatting.addConditionalFormat': 'Add Conditional Format',
        
        // Preview & Export
        'preview.title': 'Preview & Export',
        'preview.info': 'Preview your report and export it in your preferred format.',
        'preview.refresh': 'Refresh Preview',
        'preview.export': 'Export Options',
        'preview.exportPdf': 'PDF',
        'preview.exportExcel': 'Excel',
        'preview.exportCsv': 'CSV',
        'preview.exportImage': 'Image',
        'preview.schedule': 'Schedule Report',
        'preview.noSchedule': 'No schedule',
        'preview.daily': 'Daily',
        'preview.weekly': 'Weekly',
        'preview.monthly': 'Monthly',
        'preview.configure': 'Configure',
        
        // Modals
        'modal.sampleData.title': 'Sample Datasets',
        'modal.pasteData.title': 'Paste Your Data',
        'modal.pasteData.desc': 'Paste your data below (CSV, JSON, or tab-separated values):',
        'modal.pasteData.placeholder': 'Paste your data here...',
        'modal.pasteData.process': 'Process Data',
        'modal.saveReport.title': 'Save Report',
        'modal.saveReport.name': 'Report Name',
        'modal.saveReport.namePlaceholder': 'Enter report name',
        'modal.saveReport.description': 'Description (optional)',
        'modal.saveReport.descriptionPlaceholder': 'Enter report description',
        'modal.saveReport.save': 'Save Report',
        
        // Notifications
        'notification.dataSaved': 'Report saved successfully!',
        'notification.noSavedReports': 'No saved reports found.',
        'notification.loadReportSoon': 'Load report functionality will be implemented soon.',
        'notification.selectDataSource': 'Please select a data source before proceeding.',
        'notification.selectFields': 'Please select at least one field for your report.',
        'notification.selectVisualization': 'Please select a visualization type.',
        'notification.exporting': 'Exporting report as {0}...',
        'notification.exported': 'Report exported as {0} successfully!',
        'notification.scheduled': 'Report scheduled to run {0}. Configuration dialog would appear here.',
        'notification.selectFrequency': 'Please select a schedule frequency first.'
    },
    es: {
        // General
        'app.title': 'Asistente de Informes',
        'app.save': 'Guardar',
        'app.load': 'Cargar',
        'app.language': 'Idioma',
        'app.next': 'Siguiente',
        'app.previous': 'Anterior',
        'app.finish': 'Finalizar',
        'app.step': 'Paso',
        'app.of': 'de',
        
        // Steps
        'step.dataSource.title': 'Fuente de Datos',
        'step.dataSource.desc': 'Seleccione su fuente de datos',
        'step.dataSelection.title': 'Selección de Datos',
        'step.dataSelection.desc': 'Elija campos y filtros',
        'step.grouping.title': 'Agrupación y Agregación',
        'step.grouping.desc': 'Organice sus datos',
        'step.sorting.title': 'Ordenación',
        'step.sorting.desc': 'Ordene sus resultados',
        'step.visualization.title': 'Visualización',
        'step.visualization.desc': 'Elija diseño y gráficos',
        'step.formatting.title': 'Formato',
        'step.formatting.desc': 'Estilice su informe',
        'step.preview.title': 'Vista Previa y Exportación',
        'step.preview.desc': 'Revise y descargue',
        
        // Data Source
        'dataSource.title': 'Seleccionar Fuente de Datos',
        'dataSource.file.title': 'Subir Archivo',
        'dataSource.file.desc': 'Suba archivos CSV, Excel o JSON',
        'dataSource.file.button': 'Elegir Archivo',
        'dataSource.sample.title': 'Datos de Muestra',
        'dataSource.sample.desc': 'Use nuestros conjuntos de datos de muestra',
        'dataSource.sample.button': 'Explorar Muestras',
        'dataSource.paste.title': 'Pegar Datos',
        'dataSource.paste.desc': 'Pegue datos del portapapeles',
        'dataSource.paste.button': 'Abrir Editor',
        'dataSource.preview.title': 'Vista Previa de Datos'
        
        // Additional translations would be added here
    },
    fr: {
        // General
        'app.title': 'Assistant de Rapport',
        'app.save': 'Enregistrer',
        'app.load': 'Charger',
        'app.language': 'Langue',
        'app.next': 'Suivant',
        'app.previous': 'Précédent',
        'app.finish': 'Terminer',
        'app.step': 'Étape',
        'app.of': 'sur',
        
        // Steps
        'step.dataSource.title': 'Source de Données',
        'step.dataSource.desc': 'Sélectionnez votre source de données',
        'step.dataSelection.title': 'Sélection de Données',
        'step.dataSelection.desc': 'Choisissez les champs et les filtres',
        'step.grouping.title': 'Regroupement et Agrégation',
        'step.grouping.desc': 'Organisez vos données',
        'step.sorting.title': 'Tri',
        'step.sorting.desc': 'Ordonnez vos résultats',
        'step.visualization.title': 'Visualisation',
        'step.visualization.desc': 'Choisissez la mise en page et les graphiques',
        'step.formatting.title': 'Formatage',
        'step.formatting.desc': 'Stylisez votre rapport',
        'step.preview.title': 'Aperçu et Exportation',
        'step.preview.desc': 'Révisez et téléchargez',
        
        // Data Source
        'dataSource.title': 'Sélectionner la Source de Données',
        'dataSource.file.title': 'Téléchargement de Fichier',
        'dataSource.file.desc': 'Téléchargez des fichiers CSV, Excel ou JSON',
        'dataSource.file.button': 'Choisir un Fichier',
        'dataSource.sample.title': 'Données d\'Exemple',
        'dataSource.sample.desc': 'Utilisez nos ensembles de données d\'exemple',
        'dataSource.sample.button': 'Parcourir les Exemples',
        'dataSource.paste.title': 'Coller des Données',
        'dataSource.paste.desc': 'Collez des données du presse-papiers',
        'dataSource.paste.button': 'Ouvrir l\'Éditeur',
        'dataSource.preview.title': 'Aperçu des Données'
        
        // Additional translations would be added here
    }
};

// Initialize internationalization
function initI18n() {
    // Get the user's preferred language
    const userLang = navigator.language || navigator.userLanguage;
    const langCode = userLang.split('-')[0];
    
    // Set the initial language
    if (translations[langCode]) {
        currentLanguage = langCode;
    }
    
    // Set up language switchers
    const langLinks = document.querySelectorAll('[data-lang]');
    langLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = link.dataset.lang;
            if (translations[lang]) {
                setLanguage(lang);
            }
        });
    });
    
    // Apply the initial translations
    applyTranslations();
}

// Set the current language
function setLanguage(lang) {
    if (translations[lang]) {
        currentLanguage = lang;
        applyTranslations();
        
        // Save the language preference
        localStorage.setItem('reportWizardLanguage', lang);
        
        console.log(`Language set to ${availableLanguages[lang]}`);
    }
}

// Apply translations to the UI
function applyTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(element => {
        const key = element.dataset.i18n;
        const translation = getTranslation(key);
        
        if (translation) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.type === 'placeholder') {
                    element.placeholder = translation;
                } else {
                    element.value = translation;
                }
            } else {
                element.textContent = translation;
            }
        }
    });
}

// Get a translation by key
function getTranslation(key, ...args) {
    const translation = translations[currentLanguage]?.[key] || translations.en[key] || key;
    
    // Replace placeholders with arguments
    if (args.length > 0) {
        return translation.replace(/\{(\d+)\}/g, (match, index) => {
            const argIndex = parseInt(index);
            return argIndex < args.length ? args[argIndex] : match;
        });
    }
    
    return translation;
}

// Format a date according to the current locale
function formatDateLocalized(date, options = {}) {
    if (!date) {
        return '';
    }
    
    // Convert to Date object if it's a string
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if it's a valid date
    if (isNaN(dateObj.getTime())) {
        return '';
    }
    
    // Get the locale based on the current language
    const locale = currentLanguage === 'en' ? 'en-US' : 
                  currentLanguage === 'es' ? 'es-ES' : 
                  currentLanguage === 'fr' ? 'fr-FR' : 'en-US';
    
    // Format the date
    return dateObj.toLocaleDateString(locale, options);
}

// Format a number according to the current locale
function formatNumberLocalized(number, options = {}) {
    if (number === null || number === undefined || isNaN(number)) {
        return '';
    }
    
    // Get the locale based on the current language
    const locale = currentLanguage === 'en' ? 'en-US' : 
                  currentLanguage === 'es' ? 'es-ES' : 
                  currentLanguage === 'fr' ? 'fr-FR' : 'en-US';
    
    // Format the number
    return new Intl.NumberFormat(locale, options).format(number);
}
