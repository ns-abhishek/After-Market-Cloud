// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Form data state
  const formData = {
    serviceTypeName: '1st Free Service',
    isActive: false,
    isInstallation: false,
    isMandatory: false,
    isConsiderForDemand: false,
    isWarranty: false,
    isInsurance: false,
    serviceDueReading: '100',
    serviceDueDays: '365',
    operationDetailExpanded: false
  };

  // Get DOM elements
  const languageSidebar = document.getElementById('language-sidebar');
  const languageToggle = document.getElementById('language-toggle');
  const languageOptions = document.querySelectorAll('.language-option');
  const operationHeader = document.getElementById('operation-header');
  const operationArrow = document.getElementById('operation-arrow');
  const operationContent = document.getElementById('operation-content');
  const editButtons = document.querySelectorAll('.btn-edit');
  const exitButtons = document.querySelectorAll('.btn-exit');

  // Current language
  let currentLanguage = 'en';

  // Initialize the form
  initForm();

  // Initialize language sidebar
  initLanguageSidebar();

  // Initialize operation detail section
  initOperationDetail();

  // Initialize button handlers
  initButtons();

  // Function to initialize the form
  function initForm() {
    // Set initial values
    document.getElementById('serviceTypeName').value = formData.serviceTypeName;
    document.getElementById('isActive').checked = formData.isActive;
    document.getElementById('isInstallation').checked = formData.isInstallation;
    document.getElementById('isMandatory').checked = formData.isMandatory;
    document.getElementById('isConsiderForDemand').checked = formData.isConsiderForDemand;
    document.getElementById('isWarranty').checked = formData.isWarranty;
    document.getElementById('isInsurance').checked = formData.isInsurance;
    document.getElementById('serviceDueReading').value = formData.serviceDueReading;
    document.getElementById('serviceDueDays').value = formData.serviceDueDays;

    // Add input change handlers
    document.getElementById('serviceTypeName').addEventListener('input', handleInputChange);
    document.getElementById('serviceDueReading').addEventListener('input', handleInputChange);
    document.getElementById('serviceDueDays').addEventListener('input', handleInputChange);

    // Add checkbox change handlers
    document.getElementById('isActive').addEventListener('change', handleCheckboxChange);
    document.getElementById('isInstallation').addEventListener('change', handleCheckboxChange);
    document.getElementById('isMandatory').addEventListener('change', handleCheckboxChange);
    document.getElementById('isConsiderForDemand').addEventListener('change', handleCheckboxChange);
    document.getElementById('isWarranty').addEventListener('change', handleCheckboxChange);
    document.getElementById('isInsurance').addEventListener('change', handleCheckboxChange);
  }

  // Function to initialize language sidebar
  function initLanguageSidebar() {
    // Toggle sidebar expansion
    languageToggle.addEventListener('click', function() {
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

    // Language selection
    languageOptions.forEach(option => {
      option.addEventListener('click', function() {
        const lang = this.getAttribute('data-lang');
        changeLanguage(lang);
        
        // Update active class
        languageOptions.forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');
      });
    });

    // Set initial active language
    document.querySelector(`.language-option[data-lang="${currentLanguage}"]`).classList.add('active');
  }

  // Function to initialize operation detail section
  function initOperationDetail() {
    operationHeader.addEventListener('click', function() {
      formData.operationDetailExpanded = !formData.operationDetailExpanded;
      
      if (formData.operationDetailExpanded) {
        operationContent.classList.add('expanded');
        operationArrow.classList.add('expanded');
      } else {
        operationContent.classList.remove('expanded');
        operationArrow.classList.remove('expanded');
      }
    });
  }

  // Function to initialize button handlers
  function initButtons() {
    // Edit buttons
    editButtons.forEach(button => {
      button.addEventListener('click', function() {
        console.log('Edit clicked', formData);
        // Implement edit functionality
        alert('Edit functionality would be implemented here');
      });
    });

    // Exit buttons
    exitButtons.forEach(button => {
      button.addEventListener('click', function() {
        console.log('Exit clicked');
        // Implement exit functionality
        alert('Exit functionality would be implemented here');
      });
    });
  }

  // Function to handle input changes
  function handleInputChange(e) {
    const { name, value } = e.target;
    formData[name] = value;
    console.log('Input changed:', name, value);
  }

  // Function to handle checkbox changes
  function handleCheckboxChange(e) {
    const { name, checked } = e.target;
    formData[name] = checked;
    console.log('Checkbox changed:', name, checked);
  }

  // Function to change language
  function changeLanguage(lang) {
    currentLanguage = lang;
    
    // Update all text elements with translations
    for (const [elementId, translationKey] of Object.entries(getElementsToTranslate())) {
      const element = document.getElementById(elementId);
      if (element) {
        // Handle special cases for elements with required asterisk
        if (elementId === 'label-service-type-name' || elementId === 'th-operation-code') {
          element.innerHTML = translations[lang][translationKey] + ' <span class="required">*</span>';
        } else {
          element.textContent = translations[lang][translationKey];
        }
      }
    }
    
    // Update the document language attribute
    document.documentElement.lang = lang;
    
    console.log('Language changed to:', lang);
  }

  // Helper function to get elements to translate
  function getElementsToTranslate() {
    return {
      'form-title': 'form-title',
      'btn-edit': 'btn-edit',
      'btn-exit': 'btn-exit',
      'btn-edit-bottom': 'btn-edit-bottom',
      'btn-exit-bottom': 'btn-exit-bottom',
      'label-service-type-name': 'label-service-type-name',
      'label-is-active': 'label-is-active',
      'label-is-installation': 'label-is-installation',
      'label-is-mandatory': 'label-is-mandatory',
      'label-consider-demand': 'label-consider-demand',
      'label-is-warranty': 'label-is-warranty',
      'label-is-insurance': 'label-is-insurance',
      'label-service-due-reading': 'label-service-due-reading',
      'label-service-due-days': 'label-service-due-days',
      'operation-detail': 'operation-detail',
      'th-operation-code': 'th-operation-code',
      'th-operation-description': 'th-operation-description',
      'no-records-message': 'no-records-message'
    };
  }
});
