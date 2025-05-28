// Translations
const translations = {
  en: {
    formTitle: "1st Free Service",
    serviceTypeName: "Service Type Name",
    isMandatory: "Is Mandatory?",
    isConsiderForDemand: "Is Consider For Demand?",
    isActive: "Is Active?",
    isWarranty: "Is Warranty?",
    isInstallation: "Is Installation?",
    isInsurance: "Is Insurance?",
    serviceDueReading: "Service Due Reading",
    serviceDueDays: "Service Due Days",
    operationDetail: "Operation Detail",
    operationCode: "Operation Code",
    operationDescription: "Operation Description",
    edit: "Edit",
    delete: "Delete",
    exit: "Exit",
    noRecords: "No Records To View",
    languages: {
      en: "English",
      es: "Spanish",
      fr: "French",
      de: "German",
      hi: "Hindi"
    }
  },
  es: {
    formTitle: "1er Servicio Gratuito",
    serviceTypeName: "Nombre del Tipo de Servicio",
    isMandatory: "¿Es Obligatorio?",
    isConsiderForDemand: "¿Se Considera Para Demanda?",
    isActive: "¿Está Activo?",
    isWarranty: "¿Es Garantía?",
    isInstallation: "¿Es Instalación?",
    isInsurance: "¿Es Seguro?",
    serviceDueReading: "Lectura de Vencimiento del Servicio",
    serviceDueDays: "Días de Vencimiento del Servicio",
    operationDetail: "Detalle de Operación",
    operationCode: "Código de Operación",
    operationDescription: "Descripción de Operación",
    edit: "Editar",
    delete: "Eliminar",
    exit: "Salir",
    noRecords: "No Hay Registros Para Ver",
    languages: {
      en: "Inglés",
      es: "Español",
      fr: "Francés",
      de: "Alemán",
      hi: "Hindi"
    }
  },
  fr: {
    formTitle: "1er Service Gratuit",
    serviceTypeName: "Nom du Type de Service",
    isMandatory: "Est Obligatoire?",
    isConsiderForDemand: "Est Considéré Pour la Demande?",
    isActive: "Est Actif?",
    isWarranty: "Est Garantie?",
    isInstallation: "Est Installation?",
    isInsurance: "Est Assurance?",
    serviceDueReading: "Lecture d'Échéance du Service",
    serviceDueDays: "Jours d'Échéance du Service",
    operationDetail: "Détail de l'Opération",
    operationCode: "Code d'Opération",
    operationDescription: "Description de l'Opération",
    edit: "Modifier",
    delete: "Supprimer",
    exit: "Quitter",
    noRecords: "Aucun Enregistrement à Afficher",
    languages: {
      en: "Anglais",
      es: "Espagnol",
      fr: "Français",
      de: "Allemand",
      hi: "Hindi"
    }
  },
  de: {
    formTitle: "1. Kostenloser Service",
    serviceTypeName: "Servicetypname",
    isMandatory: "Ist Pflicht?",
    isConsiderForDemand: "Wird für Nachfrage berücksichtigt?",
    isActive: "Ist Aktiv?",
    isWarranty: "Ist Garantie?",
    isInstallation: "Ist Installation?",
    isInsurance: "Ist Versicherung?",
    serviceDueReading: "Service-Fälligkeitsstand",
    serviceDueDays: "Service-Fälligkeitstage",
    operationDetail: "Betriebsdetail",
    operationCode: "Betriebscode",
    operationDescription: "Betriebsbeschreibung",
    edit: "Bearbeiten",
    delete: "Löschen",
    exit: "Beenden",
    noRecords: "Keine Datensätze zum Anzeigen",
    languages: {
      en: "Englisch",
      es: "Spanisch",
      fr: "Französisch",
      de: "Deutsch",
      hi: "Hindi"
    }
  },
  hi: {
    formTitle: "पहली मुफ्त सेवा",
    serviceTypeName: "सेवा प्रकार का नाम",
    isMandatory: "क्या अनिवार्य है?",
    isConsiderForDemand: "क्या मांग के लिए विचार किया जाता है?",
    isActive: "क्या सक्रिय है?",
    isWarranty: "क्या वारंटी है?",
    isInstallation: "क्या स्थापना है?",
    isInsurance: "क्या बीमा है?",
    serviceDueReading: "सेवा देय रीडिंग",
    serviceDueDays: "सेवा देय दिन",
    operationDetail: "ऑपरेशन विवरण",
    operationCode: "ऑपरेशन कोड",
    operationDescription: "ऑपरेशन विवरण",
    edit: "संपादित करें",
    delete: "हटाएं",
    exit: "बाहर निकलें",
    noRecords: "देखने के लिए कोई रिकॉर्ड नहीं",
    languages: {
      en: "अंग्रेज़ी",
      es: "स्पेनिश",
      fr: "फ्रेंच",
      de: "जर्मन",
      hi: "हिंदी"
    }
  }
};

// DOM Elements
const languageSidebar = document.getElementById('language-sidebar');
const languageToggle = document.getElementById('language-toggle');
const languageOptions = document.querySelectorAll('.language-option');

// Text elements that need to be translated
const elementsToTranslate = {
  'form-title': 'formTitle',
  'service-type-name-label': 'serviceTypeName',
  'is-mandatory-label': 'isMandatory',
  'is-consider-for-demand-label': 'isConsiderForDemand',
  'is-active-label': 'isActive',
  'is-warranty-label': 'isWarranty',
  'is-installation-label': 'isInstallation',
  'is-insurance-label': 'isInsurance',
  'service-due-reading-label': 'serviceDueReading',
  'service-due-days-label': 'serviceDueDays',
  'operation-detail-label': 'operationDetail',
  'operation-code-label': 'operationCode',
  'operation-description-label': 'operationDescription',
  'edit-label': 'edit',
  'delete-label': 'delete',
  'edit-btn': 'edit',
  'exit-btn': 'exit',
  'edit-btn-bottom': 'edit',
  'exit-btn-bottom': 'exit',
  'no-records-label': 'noRecords'
};

// Current language
let currentLanguage = 'en';

// Toggle sidebar expansion
languageToggle.addEventListener('click', () => {
  const isExpanded = languageSidebar.classList.contains('expanded');

  if (isExpanded) {
    languageSidebar.classList.remove('expanded');
    languageSidebar.classList.add('collapsed');
    languageToggle.textContent = '▶';
  } else {
    languageSidebar.classList.remove('collapsed');
    languageSidebar.classList.add('expanded');
    languageToggle.textContent = '◀';
  }
});

// Handle language selection
languageOptions.forEach(option => {
  option.addEventListener('click', () => {
    const lang = option.getAttribute('data-lang');
    changeLanguage(lang);

    // Update active class
    languageOptions.forEach(opt => opt.classList.remove('active'));
    option.classList.add('active');

    // Optionally collapse sidebar after selection
    setTimeout(() => {
      languageSidebar.classList.remove('expanded');
      languageSidebar.classList.add('collapsed');
      languageToggle.textContent = '▶';
    }, 500);
  });
});

// Change language function
function changeLanguage(lang) {
  currentLanguage = lang;

  // Update all text elements
  for (const [elementId, translationKey] of Object.entries(elementsToTranslate)) {
    const element = document.getElementById(elementId);
    if (element) {
      // Handle special case for elements with required asterisk
      if (elementId === 'service-type-name-label' || elementId === 'operation-code-label') {
        element.innerHTML = translations[lang][translationKey] + ' <span class="required">*</span>';
      } else {
        element.textContent = translations[lang][translationKey];
      }
    }
  }
}

// Initialize with English
changeLanguage('en');
