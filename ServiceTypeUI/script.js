// Enterprise Service Type Management Application
class EnterpriseServiceTypeApp {
    constructor() {
        // Multi-tenant context
        this.currentContext = {
            tenant: 'autoparts-global',
            company: 'usa',
            brand: 'autopro',
            language: 'en',
            currency: 'USD'
        };

        // Automotive Aftermarket Service Data
        this.services = [
            {
                id: 1,
                code: 'ENG-OIL-001',
                name: 'Engine Oil Change',
                description: 'Complete engine oil and filter replacement service for passenger vehicles and light trucks.',
                category: 'maintenance',
                unitOfMeasure: 'service',
                status: 'active',
                tenantLevel: true,
                companySpecific: false,
                associatedBrands: ['autopro', 'fleetmaster'],
                standardCost: 25.00,
                listPrice: 45.00,
                glAccount: '4000-001',
                taxCode: 'SRV-STD',
                isMandatory: true,
                isConsiderForDemand: true,
                isActive: true,
                isWarranty: false,
                isInstallation: false,
                isInsurance: false,
                serviceDueDays: 90,
                serviceDueReading: 5000,
                operationDetails: 'Standard oil change procedure including drain, filter replacement, and refill with specified grade oil.',
                operations: [
                    { id: 1, code: 'INSPECT', description: 'Vehicle Inspection' },
                    { id: 2, code: 'DRAIN', description: 'Drain Old Oil' },
                    { id: 3, code: 'FILTER', description: 'Replace Oil Filter' },
                    { id: 4, code: 'REFILL', description: 'Install New Oil' },
                    { id: 5, code: 'CHECK', description: 'System Check' }
                ],
                multiLingual: {
                    en: { name: 'Engine Oil Change', description: 'Complete engine oil and filter replacement service for passenger vehicles and light trucks.' },
                    fr: { name: 'Vidange Moteur', description: 'Service complet de remplacement d\'huile moteur et de filtre pour véhicules de tourisme et camions légers.' },
                    de: { name: 'Motorölwechsel', description: 'Kompletter Motoröl- und Filterwechselservice für Personenkraftwagen und leichte Lastkraftwagen.' }
                },
                pricing: {
                    usa: { cost: 25.00, price: 45.00, currency: 'USD' },
                    europe: { cost: 22.00, price: 40.00, currency: 'EUR' },
                    asia: { cost: 18.00, price: 35.00, currency: 'USD' }
                },
                slaTemplate: 'standard',
                requiredSkills: ['Basic Maintenance', 'Oil Systems', 'Vehicle Safety'],
                complianceMapping: ['EPA-Standards', 'DOT-Regulations'],
                createdAt: new Date('2024-01-15'),
                version: '1.0',
                auditTrail: [
                    { action: 'created', user: 'service.manager@autoparts.com', timestamp: new Date('2024-01-15'), details: 'Initial service creation' }
                ]
            },
            {
                id: 2,
                code: 'BRK-PAD-001',
                name: 'Brake Pad Replacement',
                description: 'Complete brake pad replacement service including inspection of rotors and brake system components.',
                category: 'maintenance',
                unitOfMeasure: 'service',
                status: 'active',
                tenantLevel: true,
                companySpecific: false,
                associatedBrands: ['autopro'],
                standardCost: 85.00,
                listPrice: 150.00,
                glAccount: '4000-002',
                taxCode: 'SRV-STD',
                isMandatory: false,
                isConsiderForDemand: true,
                isActive: true,
                isWarranty: true,
                isInstallation: false,
                isInsurance: false,
                serviceDueDays: 180,
                serviceDueReading: 15000,
                operationDetails: 'Brake pad replacement including safety inspection, rotor assessment, brake fluid check, and system testing.',
                operations: [
                    { id: 1, code: 'INSPECT', description: 'Brake System Inspection' },
                    { id: 2, code: 'REMOVE', description: 'Remove Old Brake Pads' },
                    { id: 3, code: 'ROTOR', description: 'Inspect/Resurface Rotors' },
                    { id: 4, code: 'INSTALL', description: 'Install New Brake Pads' },
                    { id: 5, code: 'TEST', description: 'Brake System Test' }
                ],
                multiLingual: {
                    en: { name: 'Brake Pad Replacement', description: 'Complete brake pad replacement service including inspection of rotors and brake system components.' },
                    fr: { name: 'Remplacement des Plaquettes de Frein', description: 'Service complet de remplacement des plaquettes de frein incluant l\'inspection des rotors et composants du système de freinage.' },
                    de: { name: 'Bremsbelag-Austausch', description: 'Kompletter Bremsbelag-Austauschservice einschließlich Inspektion der Bremsscheiben und Bremssystemkomponenten.' }
                },
                pricing: {
                    usa: { cost: 85.00, price: 150.00, currency: 'USD' },
                    europe: { cost: 75.00, price: 135.00, currency: 'EUR' },
                    asia: { cost: 65.00, price: 120.00, currency: 'USD' }
                },
                slaTemplate: 'premium',
                requiredSkills: ['Brake Systems', 'Safety Inspection', 'Hydraulic Systems'],
                complianceMapping: ['DOT-Standards', 'Safety-Regulations'],
                createdAt: new Date('2024-01-10'),
                version: '1.0',
                auditTrail: [
                    { action: 'created', user: 'brake.specialist@autoparts.com', timestamp: new Date('2024-01-10'), details: 'Initial service creation' }
                ]
            },
            {
                id: 3,
                code: 'DIAG-ENG-001',
                name: 'Engine Diagnostics',
                description: 'Comprehensive engine diagnostic service using advanced OBD-II and manufacturer-specific tools.',
                category: 'diagnostics',
                unitOfMeasure: 'service',
                status: 'active',
                tenantLevel: false,
                companySpecific: true,
                associatedBrands: ['autopro'],
                standardCost: 120.00,
                listPrice: 180.00,
                glAccount: '4000-003',
                taxCode: 'SRV-DIAG',
                isMandatory: true,
                isConsiderForDemand: false,
                isActive: true,
                isWarranty: false,
                isInstallation: false,
                isInsurance: true,
                serviceDueDays: 0,
                serviceDueReading: 0,
                operationDetails: 'Engine diagnostic services including OBD-II scanning, manufacturer-specific diagnostics, performance testing, and detailed reporting.',
                operations: [
                    { id: 1, code: 'OBD-SCAN', description: 'OBD-II System Scan' },
                    { id: 2, code: 'MFG-DIAG', description: 'Manufacturer Diagnostics' },
                    { id: 3, code: 'PERF-TEST', description: 'Performance Testing' },
                    { id: 4, code: 'REPORT', description: 'Diagnostic Report' }
                ],
                multiLingual: {
                    en: { name: 'Engine Diagnostics', description: 'Comprehensive engine diagnostic service using advanced OBD-II and manufacturer-specific tools.' },
                    fr: { name: 'Diagnostic Moteur', description: 'Service de diagnostic moteur complet utilisant des outils OBD-II avancés et spécifiques au fabricant.' },
                    de: { name: 'Motor-Diagnose', description: 'Umfassender Motor-Diagnoseservice mit fortschrittlichen OBD-II- und herstellerspezifischen Tools.' }
                },
                pricing: {
                    usa: { cost: 120.00, price: 180.00, currency: 'USD' },
                    europe: { cost: 110.00, price: 165.00, currency: 'EUR' },
                    asia: { cost: 95.00, price: 150.00, currency: 'USD' }
                },
                slaTemplate: 'premium',
                requiredSkills: ['Engine Diagnostics', 'OBD-II Systems', 'Automotive Electronics'],
                complianceMapping: ['EPA-Standards', 'OBD-Regulations', 'Emissions-Standards'],
                createdAt: new Date('2024-01-08'),
                version: '1.1',
                auditTrail: [
                    { action: 'created', user: 'diagnostics@autoparts.com', timestamp: new Date('2024-01-08'), details: 'Initial service creation' },
                    { action: 'updated', user: 'tech.manager@autoparts.com', timestamp: new Date('2024-01-20'), details: 'Updated diagnostic procedures' }
                ]
            },
            {
                id: 4,
                code: 'TIRE-SERV-001',
                name: 'Tire Service & Rotation',
                description: 'Complete tire service including rotation, balancing, alignment check, and pressure adjustment.',
                category: 'maintenance',
                unitOfMeasure: 'service',
                status: 'active',
                tenantLevel: true,
                companySpecific: false,
                associatedBrands: ['autopro', 'fleetmaster'],
                standardCost: 45.00,
                listPrice: 75.00,
                glAccount: '4000-004',
                taxCode: 'SRV-STD',
                isMandatory: false,
                isConsiderForDemand: true,
                isActive: true,
                isWarranty: true,
                isInstallation: false,
                isInsurance: false,
                serviceDueDays: 120,
                serviceDueReading: 8000,
                operationDetails: 'Tire service including rotation, balancing, alignment inspection, pressure adjustment, and tread depth measurement.',
                operations: [
                    { id: 1, code: 'INSPECT', description: 'Tire Inspection' },
                    { id: 2, code: 'ROTATE', description: 'Tire Rotation' },
                    { id: 3, code: 'BALANCE', description: 'Wheel Balancing' },
                    { id: 4, code: 'PRESSURE', description: 'Pressure Adjustment' },
                    { id: 5, code: 'ALIGN-CHK', description: 'Alignment Check' }
                ],
                multiLingual: {
                    en: { name: 'Tire Service & Rotation', description: 'Complete tire service including rotation, balancing, alignment check, and pressure adjustment.' },
                    fr: { name: 'Service et Rotation des Pneus', description: 'Service complet des pneus incluant rotation, équilibrage, vérification de l\'alignement et ajustement de pression.' },
                    de: { name: 'Reifenservice & Rotation', description: 'Kompletter Reifenservice einschließlich Rotation, Auswuchtung, Spurprüfung und Druckanpassung.' }
                },
                pricing: {
                    usa: { cost: 45.00, price: 75.00, currency: 'USD' },
                    europe: { cost: 40.00, price: 68.00, currency: 'EUR' },
                    asia: { cost: 35.00, price: 60.00, currency: 'USD' }
                },
                slaTemplate: 'standard',
                requiredSkills: ['Tire Service', 'Wheel Balancing', 'Alignment Systems'],
                complianceMapping: ['DOT-Standards', 'Safety-Regulations'],
                createdAt: new Date('2024-01-05'),
                version: '1.0',
                auditTrail: [
                    { action: 'created', user: 'tire.specialist@autoparts.com', timestamp: new Date('2024-01-05'), details: 'Initial service creation' }
                ]
            },
            {
                id: 5,
                code: 'FLEET-INSP-001',
                name: 'Fleet Vehicle Inspection',
                description: 'Comprehensive multi-point inspection service for fleet vehicles and commercial assets.',
                category: 'inspection',
                unitOfMeasure: 'service',
                status: 'active',
                tenantLevel: true,
                companySpecific: false,
                associatedBrands: ['fleetmaster', 'assetguard'],
                standardCost: 95.00,
                listPrice: 140.00,
                glAccount: '4000-005',
                taxCode: 'SRV-INSP',
                isMandatory: false,
                isConsiderForDemand: false,
                isActive: true,
                isWarranty: false,
                isInstallation: false,
                isInsurance: false,
                serviceDueDays: 365,
                serviceDueReading: 25000,
                operationDetails: 'Comprehensive fleet inspection including safety systems, engine performance, emissions testing, brake systems, and compliance verification.',
                operations: [
                    { id: 1, code: 'SAFETY', description: 'Safety Systems Check' },
                    { id: 2, code: 'ENGINE', description: 'Engine Performance Test' },
                    { id: 3, code: 'EMISSIONS', description: 'Emissions Testing' },
                    { id: 4, code: 'BRAKES', description: 'Brake System Inspection' },
                    { id: 5, code: 'COMPLIANCE', description: 'Compliance Verification' }
                ],
                multiLingual: {
                    en: { name: 'Fleet Vehicle Inspection', description: 'Comprehensive multi-point inspection service for fleet vehicles and commercial assets.' },
                    fr: { name: 'Inspection de Véhicules de Flotte', description: 'Service d\'inspection multi-points complet pour véhicules de flotte et actifs commerciaux.' },
                    de: { name: 'Flottenfahrzeug-Inspektion', description: 'Umfassender Mehrpunkt-Inspektionsservice für Flottenfahrzeuge und gewerbliche Anlagen.' }
                },
                pricing: {
                    usa: { cost: 95.00, price: 140.00, currency: 'USD' },
                    europe: { cost: 85.00, price: 125.00, currency: 'EUR' },
                    asia: { cost: 75.00, price: 115.00, currency: 'USD' }
                },
                slaTemplate: 'standard',
                requiredSkills: ['Fleet Management', 'Safety Inspection', 'Compliance Standards'],
                complianceMapping: ['DOT-Regulations', 'Fleet-Standards', 'Safety-Compliance'],
                createdAt: new Date('2024-01-03'),
                version: '1.0',
                auditTrail: [
                    { action: 'created', user: 'fleet.manager@autoparts.com', timestamp: new Date('2024-01-03'), details: 'Initial service creation' }
                ]
            }
        ];

        // Service catalogs
        this.catalogs = [
            {
                id: 1,
                name: 'AutoPro Complete Service Catalog',
                brand: 'autopro',
                visibility: 'public',
                serviceIds: [1, 2, 3, 4, 5],
                description: 'Comprehensive automotive service catalog for passenger vehicles and light trucks'
            },
            {
                id: 2,
                name: 'FleetMaster Commercial Catalog',
                brand: 'fleetmaster',
                visibility: 'public',
                serviceIds: [1, 4, 5],
                description: 'Specialized services for fleet vehicles and commercial asset management'
            },
            {
                id: 3,
                name: 'VehicleCare Basic Catalog',
                brand: 'vehiclecare',
                visibility: 'public',
                serviceIds: [1, 2, 4],
                description: 'Essential maintenance services for everyday vehicle care'
            }
        ];

        // Service bundles
        this.bundles = [
            {
                id: 1,
                name: 'Complete Vehicle Maintenance Package',
                price: 350,
                currency: 'USD',
                serviceIds: [1, 2, 4],
                description: 'Comprehensive maintenance package including oil change, brake service, and tire care'
            },
            {
                id: 2,
                name: 'Fleet Inspection & Diagnostics Bundle',
                price: 320,
                currency: 'USD',
                serviceIds: [3, 5],
                description: 'Complete diagnostic and inspection package for fleet vehicles'
            },
            {
                id: 3,
                name: 'Premium Service Package',
                price: 500,
                currency: 'USD',
                serviceIds: [1, 2, 3, 4, 5],
                description: 'All-inclusive premium service package for complete vehicle care'
            }
        ];

        // SLA templates
        this.slaTemplates = [
            {
                id: 'premium',
                name: 'Premium Service SLA',
                tier: 'premium',
                responseTime: '30 minutes',
                resolutionTime: '2 hours',
                availability: '99.9%',
                description: 'Priority service for fleet and commercial vehicles'
            },
            {
                id: 'standard',
                name: 'Standard Service SLA',
                tier: 'standard',
                responseTime: '2 hours',
                resolutionTime: '4 hours',
                availability: '99.5%',
                description: 'Standard service level for regular maintenance'
            },
            {
                id: 'express',
                name: 'Express Service SLA',
                tier: 'express',
                responseTime: '15 minutes',
                resolutionTime: '1 hour',
                availability: '99.95%',
                description: 'Emergency service for critical fleet operations'
            }
        ];

        this.currentSection = 'dashboard';
        this.filteredServices = [...this.services];
        this.filters = {
            category: '',
            status: '',
            search: ''
        };
        this.editingServiceId = null;
        this.currentOperations = [];
        this.editingOperationId = null;
        this.isSaving = false; // Prevent multiple saves

        this.initializeMDC();
        this.setupEventListeners();
        this.updateDashboardStats();
        this.renderServices();

        // Ensure we're on the services section by default
        this.navigateToSection('services');
        this.initializeContextSelectors();
        this.initializeFormSelects();

        // Initialize modern UI features immediately
        this.initializeViewControls();
        this.currentView = 'grid';

        // Initialize other features with delay
        setTimeout(() => {
            this.initializeModernSearch();
            this.addModernAnimations();
            this.initializeSortControls();
            this.initializeBulkActions();
            this.initializeAdvancedFilters();
            this.initializeTableColumnFilters();
            this.initializeMenuSearch();
            this.initializeDragAndDrop();
            this.initializeServiceTemplates();
            this.initializeQuickServiceTypes();
            this.initializeJobTemplates();
            this.initializeServiceBundles();
            this.initializeServiceCatalogs();
            this.initializeThemeSystem();
            this.setupFloatingLabels();
            this.initializeMDCTextFieldsForAutoFill();
            this.initializeSaveButton();

            // Test Templates button immediately
            this.testTemplatesButton();
        }, 500);
    }

    initializeMDC() {
        try {
            // Initialize Material Design Components
            this.drawer = new mdc.drawer.MDCDrawer(document.querySelector('.mdc-drawer'));
            this.topAppBar = new mdc.topAppBar.MDCTopAppBar(document.querySelector('.mdc-top-app-bar'));

            // Initialize dialogs with error handling
            const dialogElement = document.querySelector('#add-service-dialog');
            const operationDialogElement = document.querySelector('#add-operation-dialog');

            if (dialogElement) {
                this.dialog = new mdc.dialog.MDCDialog(dialogElement);
            } else {
                console.error('Main dialog element not found');
            }

            if (operationDialogElement) {
                this.operationDialog = new mdc.dialog.MDCDialog(operationDialogElement);
            } else {
                console.error('Operation dialog element not found');
            }

            // Initialize selectors with error handling
            const tenantSel = document.querySelector('#tenant-selector');
            const companySel = document.querySelector('#company-selector');
            const brandSel = document.querySelector('#brand-selector');
            const catFilter = document.querySelector('#category-filter');
            const statusFilter = document.querySelector('#status-filter');

            if (tenantSel) this.tenantSelector = new mdc.select.MDCSelect(tenantSel);
            if (companySel) this.companySelector = new mdc.select.MDCSelect(companySel);
            if (brandSel) this.brandSelector = new mdc.select.MDCSelect(brandSel);
            if (catFilter) this.categoryFilter = new mdc.select.MDCSelect(catFilter);
            if (statusFilter) this.statusFilter = new mdc.select.MDCSelect(statusFilter);

            // Initialize text fields
            document.querySelectorAll('.mdc-text-field').forEach(textField => {
                try {
                    new mdc.textField.MDCTextField(textField);
                } catch (e) {
                    console.warn('Failed to initialize text field:', e);
                }
            });

            // Initialize selects in forms
            document.querySelectorAll('.mdc-select').forEach(select => {
                if (!select.classList.contains('initialized')) {
                    try {
                        new mdc.select.MDCSelect(select);
                        select.classList.add('initialized');
                    } catch (e) {
                        console.warn('Failed to initialize select:', e);
                    }
                }
            });

            // Initialize buttons
            document.querySelectorAll('.mdc-button').forEach(button => {
                try {
                    new mdc.ripple.MDCRipple(button);
                } catch (e) {
                    console.warn('Failed to initialize button ripple:', e);
                }
            });

            // Initialize list items
            document.querySelectorAll('.mdc-list-item').forEach(listItem => {
                try {
                    new mdc.ripple.MDCRipple(listItem);
                } catch (e) {
                    console.warn('Failed to initialize list item ripple:', e);
                }
            });

            // Initialize switches
            document.querySelectorAll('.mdc-switch').forEach(switchElement => {
                try {
                    new mdc.switchControl.MDCSwitch(switchElement);
                } catch (e) {
                    console.warn('Failed to initialize switch:', e);
                }
            });

            // Initialize checkboxes
            document.querySelectorAll('.mdc-checkbox').forEach(checkbox => {
                try {
                    new mdc.checkbox.MDCCheckbox(checkbox);
                } catch (e) {
                    console.warn('Failed to initialize checkbox:', e);
                }
            });

            // Initialize cards
            document.querySelectorAll('.mdc-card__primary-action').forEach(card => {
                try {
                    new mdc.ripple.MDCRipple(card);
                } catch (e) {
                    console.warn('Failed to initialize card ripple:', e);
                }
            });

            // Initialize data tables
            document.querySelectorAll('.mdc-data-table').forEach(table => {
                try {
                    new mdc.dataTable.MDCDataTable(table);
                } catch (e) {
                    console.warn('Failed to initialize data table:', e);
                }
            });

            // Initialize tab bars
            document.querySelectorAll('.mdc-tab-bar').forEach(tabBar => {
                try {
                    new mdc.tabBar.MDCTabBar(tabBar);
                } catch (e) {
                    console.warn('Failed to initialize tab bar:', e);
                }
            });
        } catch (error) {
            console.error('Error initializing MDC components:', error);
        }
    }

    initializeContextSelectors() {
        try {
            // Set initial values with error handling
            if (this.tenantSelector) {
                this.tenantSelector.value = this.currentContext.tenant;
            }
            if (this.companySelector) {
                this.companySelector.value = this.currentContext.company;
            }
            if (this.brandSelector) {
                this.brandSelector.value = this.currentContext.brand;
            }
        } catch (error) {
            console.warn('Error initializing context selectors:', error);
        }
    }

    initializeFormSelects() {
        try {
            // Initialize form selects
            const categorySelect = document.getElementById('category-select');
            const unitSelect = document.getElementById('unit-select');

            if (categorySelect) {
                this.categoryFormSelect = new mdc.select.MDCSelect(categorySelect);
            }
            if (unitSelect) {
                this.unitFormSelect = new mdc.select.MDCSelect(unitSelect);
            }
        } catch (error) {
            console.warn('Error initializing form selects:', error);
        }
    }

    setupEventListeners() {
        // Menu button
        document.getElementById('menu-button').addEventListener('click', () => {
            this.drawer.open = !this.drawer.open;
        });

        // Navigation
        document.querySelectorAll('.mdc-list-item[data-section]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                this.navigateToSection(section);
            });
        });

        // Context selectors with error handling
        if (this.tenantSelector) {
            this.tenantSelector.listen('MDCSelect:change', () => {
                this.currentContext.tenant = this.tenantSelector.value;
                this.onContextChange();
            });
        }

        if (this.companySelector) {
            this.companySelector.listen('MDCSelect:change', () => {
                this.currentContext.company = this.companySelector.value;
                this.onContextChange();
            });
        }

        if (this.brandSelector) {
            this.brandSelector.listen('MDCSelect:change', () => {
                this.currentContext.brand = this.brandSelector.value;
                this.onContextChange();
            });
        }

        // Language and currency buttons
        document.getElementById('language-button').addEventListener('click', () => {
            this.showLanguageSelector();
        });

        document.getElementById('currency-button').addEventListener('click', () => {
            this.showCurrencySelector();
        });

        // Action buttons
        const addServiceBtn = document.getElementById('add-service-btn');
        if (addServiceBtn) {
            addServiceBtn.addEventListener('click', () => {
                try {
                    this.clearForm();
                    this.renderOperationTable();
                    if (this.dialog) {
                        this.dialog.open();
                    } else {
                        this.showSnackbar('Dialog not initialized. Please refresh the page.');
                    }
                } catch (error) {
                    console.error('Error opening dialog:', error);
                    this.showSnackbar('Error opening dialog. Please try again.');
                }
            });
        } else {
            console.error('Add Service button not found!');
        }

        document.getElementById('import-services-btn').addEventListener('click', () => {
            this.importServices();
        });

        document.getElementById('export-services-btn').addEventListener('click', () => {
            this.exportServices();
        });

        document.getElementById('bulk-actions-btn').addEventListener('click', () => {
            this.showBulkActionsMenu();
        });

        // Filters with error handling
        if (this.categoryFilter) {
            this.categoryFilter.listen('MDCSelect:change', () => {
                this.filters.category = this.categoryFilter.value;
                this.applyFilters();
            });
        }

        if (this.statusFilter) {
            this.statusFilter.listen('MDCSelect:change', () => {
                this.filters.status = this.statusFilter.value;
                this.applyFilters();
            });
        }

        // Search functionality
        document.getElementById('search-input').addEventListener('input', (e) => {
            this.filters.search = e.target.value;
            this.applyFilters();
        });

        // Dialog actions
        this.dialog.listen('MDCDialog:closed', (event) => {
            if (event.detail.action === 'accept') {
                if (this.editingServiceId) {
                    this.updateService();
                } else {
                    this.addNewService();
                }
            }
            this.editingServiceId = null;
        });

        // Settings switches
        document.getElementById('dark-mode-switch').addEventListener('change', (e) => {
            this.toggleDarkMode(e.target.checked);
        });

        document.getElementById('notifications-switch').addEventListener('change', (e) => {
            this.toggleNotifications(e.target.checked);
        });

        // Operation management
        document.getElementById('add-operation-btn').addEventListener('click', () => {
            this.openOperationDialog();
        });

        // Operation dialog actions
        this.operationDialog.listen('MDCDialog:closed', (event) => {
            if (event.detail.action === 'save') {
                if (this.editingOperationId) {
                    this.updateOperation();
                } else {
                    this.addOperation();
                }
            }
            this.editingOperationId = null;
        });
    }

    onContextChange() {
        // Update UI based on context change
        this.updateDashboardStats();
        this.applyFilters();
        this.showSnackbar(`Context updated: ${this.currentContext.tenant} > ${this.currentContext.company} > ${this.currentContext.brand}`);
    }

    showLanguageSelector() {
        const languages = [
            { code: 'en', name: 'English' },
            { code: 'fr', name: 'Français' },
            { code: 'de', name: 'Deutsch' },
            { code: 'es', name: 'Español' }
        ];

        // Simple implementation - in real app would show proper selector
        const selectedLang = prompt('Select language:\n' + languages.map(l => `${l.code}: ${l.name}`).join('\n'));
        if (selectedLang && languages.find(l => l.code === selectedLang)) {
            this.currentContext.language = selectedLang;
            this.updateLanguage();
        }
    }

    showCurrencySelector() {
        const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD'];
        const selectedCurrency = prompt('Select currency:\n' + currencies.join('\n'));
        if (selectedCurrency && currencies.includes(selectedCurrency)) {
            this.currentContext.currency = selectedCurrency;
            this.updateCurrency();
        }
    }

    updateLanguage() {
        // Update UI text based on selected language
        this.renderServices();
        this.showSnackbar(`Language changed to ${this.currentContext.language}`);
    }

    updateCurrency() {
        // Update pricing display based on selected currency
        this.renderServices();
        this.showSnackbar(`Currency changed to ${this.currentContext.currency}`);
    }

    navigateToSection(section) {
        // Update active navigation item
        document.querySelectorAll('.mdc-list-item').forEach(item => {
            item.classList.remove('mdc-list-item--activated');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('mdc-list-item--activated');

        // Show/hide sections
        document.querySelectorAll('.content-section').forEach(sec => {
            sec.classList.remove('active');
        });
        document.getElementById(`${section}-section`).classList.add('active');

        this.currentSection = section;

        // Handle section-specific rendering
        if (section === 'templates') {
            this.renderSavedTemplates();
        } else if (section === 'bundles') {
            this.renderServiceBundles();
        } else if (section === 'catalogs') {
            this.renderServiceCatalogs();
        }

        // Close drawer on mobile
        if (window.innerWidth <= 768) {
            this.drawer.open = false;
        }
    }

    applyFilters() {
        let filtered = [...this.services];

        // Filter by current context (tenant, company, brand)
        // Temporarily disable brand filtering to debug
        /*
        filtered = filtered.filter(service => {
            // Multi-tenant filtering
            if (service.tenantLevel || service.companySpecific) {
                // Check brand association
                if (!service.associatedBrands.includes(this.currentContext.brand)) {
                    return false;
                }
            }
            return true;
        });
        */

        // Apply search filter
        if (this.filters.search) {
            const searchTerm = this.filters.search.toLowerCase();
            filtered = filtered.filter(service => {
                const lang = this.currentContext.language;
                const localizedName = service.multiLingual[lang]?.name || service.name;
                const localizedDesc = service.multiLingual[lang]?.description || service.description;

                return localizedName.toLowerCase().includes(searchTerm) ||
                       localizedDesc.toLowerCase().includes(searchTerm) ||
                       service.code.toLowerCase().includes(searchTerm) ||
                       service.category.toLowerCase().includes(searchTerm);
            });
        }

        // Apply category filter
        if (this.filters.category) {
            filtered = filtered.filter(service => service.category === this.filters.category);
        }

        // Apply status filter
        if (this.filters.status) {
            filtered = filtered.filter(service => service.status === this.filters.status);
        }

        this.filteredServices = filtered;
        this.renderServices();
    }

    importServices() {
        // Simulate import functionality
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,.csv';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                this.showSnackbar(`Importing services from ${file.name}...`);
                // In real implementation, would parse file and add services
                setTimeout(() => {
                    this.showSnackbar('Services imported successfully');
                }, 2000);
            }
        };
        input.click();
    }

    exportServices() {
        // Export filtered services
        const dataToExport = {
            context: this.currentContext,
            services: this.filteredServices,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `services_${this.currentContext.tenant}_${this.currentContext.company}_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showSnackbar('Services exported successfully');
    }

    showBulkActionsMenu() {
        // Simple implementation - in real app would show proper menu
        const actions = ['Activate Selected', 'Deactivate Selected', 'Delete Selected', 'Update Pricing'];
        const selectedAction = prompt('Select bulk action:\n' + actions.join('\n'));

        if (selectedAction && actions.includes(selectedAction)) {
            this.showSnackbar(`Bulk action "${selectedAction}" would be executed here`);
        }
    }

    updateDashboardStats() {
        // Use all services for now (disable brand filtering for debugging)
        const contextServices = this.services;

        const totalServices = contextServices.length;
        const activeServices = contextServices.filter(s => s.status === 'active').length;
        const inactiveServices = contextServices.filter(s => s.status === 'inactive').length;

        // Animate stats cards
        const statsCards = document.querySelectorAll('.stats-card');
        statsCards.forEach((card, index) => {
            card.classList.add('animate-fade-in-scale');
            card.style.animationDelay = `${index * 0.1}s`;
        });

        document.getElementById('total-services').textContent = totalServices;
        document.getElementById('active-services').textContent = activeServices;
        document.getElementById('inactive-services').textContent = inactiveServices;
    }

    renderServices() {
        console.log('renderServices called');
        console.log('filteredServices:', this.filteredServices);
        console.log('currentView:', this.currentView);

        // Check if modern view controls are initialized
        if (this.currentView) {
            this.renderCurrentView();
        } else {
            // Fallback to grid view
            this.renderGridView();
        }
    }

    createServiceCard(service) {
        const lang = this.currentContext.language;
        const localizedName = service.multiLingual[lang]?.name || service.name;
        const localizedDesc = service.multiLingual[lang]?.description || service.description;

        // Get pricing for current company/currency
        const pricing = service.pricing[this.currentContext.company] ||
                       { cost: service.standardCost, price: service.listPrice, currency: 'USD' };

        const card = document.createElement('div');
        card.className = 'service-card';
        card.setAttribute('data-service-id', service.id);
        card.innerHTML = `
            <div class="service-card__header">
                <div class="service-header-content">
                    <h3 class="service-card__title">${localizedName}</h3>
                    <span class="service-code">${service.code}</span>
                </div>
                <div class="service-pricing">
                    <span class="price">${pricing.currency} ${pricing.price}/${service.unitOfMeasure}</span>
                </div>
            </div>
            <div class="service-card__content">
                <div class="service-card__status ${service.status}">${service.status.toUpperCase()}</div>
                <p class="service-card__description">${localizedDesc}</p>

                <div class="service-metadata">
                    <div class="metadata-item">
                        <span class="label">Category:</span>
                        <span class="value">${service.category}</span>
                    </div>
                    <div class="metadata-item">
                        <span class="label">SLA:</span>
                        <span class="value">${service.slaTemplate}</span>
                    </div>
                    <div class="metadata-item">
                        <span class="label">Brands:</span>
                        <span class="value">${service.associatedBrands.join(', ')}</span>
                    </div>
                    <div class="metadata-item">
                        <span class="label">Mandatory:</span>
                        <span class="value ${service.isMandatory ? 'status-yes' : 'status-no'}">${service.isMandatory ? 'Yes' : 'No'}</span>
                    </div>
                    <div class="metadata-item">
                        <span class="label">Warranty:</span>
                        <span class="value ${service.isWarranty ? 'status-yes' : 'status-no'}">${service.isWarranty ? 'Yes' : 'No'}</span>
                    </div>
                    ${service.serviceDueDays > 0 ? `
                    <div class="metadata-item">
                        <span class="label">Due Days:</span>
                        <span class="value">${service.serviceDueDays} days</span>
                    </div>
                    ` : ''}
                </div>

                <div class="service-card__actions">
                    <button class="mdc-button mdc-button--outlined" onclick="app.viewServiceDetails(${service.id})">
                        <span class="mdc-button__ripple"></span>
                        <i class="material-icons mdc-button__icon">visibility</i>
                        <span class="mdc-button__label">View</span>
                    </button>
                    <button class="mdc-button mdc-button--outlined" onclick="app.editService(${service.id})">
                        <span class="mdc-button__ripple"></span>
                        <i class="material-icons mdc-button__icon">edit</i>
                        <span class="mdc-button__label">Edit</span>
                    </button>
                    <button class="mdc-button mdc-button--outlined" onclick="app.toggleServiceStatus(${service.id})">
                        <span class="mdc-button__ripple"></span>
                        <i class="material-icons mdc-button__icon">${service.status === 'active' ? 'pause' : 'play_arrow'}</i>
                        <span class="mdc-button__label">${service.status === 'active' ? 'Deactivate' : 'Activate'}</span>
                    </button>
                    <button class="mdc-button mdc-button--outlined" onclick="app.cloneService(${service.id})" style="color: var(--mdc-theme-secondary);">
                        <span class="mdc-button__ripple"></span>
                        <i class="material-icons mdc-button__icon">content_copy</i>
                        <span class="mdc-button__label">Clone</span>
                    </button>
                    <button class="mdc-button mdc-button--outlined" onclick="app.deleteService(${service.id})" style="color: var(--mdc-theme-error);">
                        <span class="mdc-button__ripple"></span>
                        <i class="material-icons mdc-button__icon">delete</i>
                        <span class="mdc-button__label">Delete</span>
                    </button>
                </div>
            </div>
        `;

        // Initialize ripple for buttons
        card.querySelectorAll('.mdc-button').forEach(button => {
            new mdc.ripple.MDCRipple(button);
        });

        // Make card draggable
        this.makeServiceDraggable(card, service);

        return card;
    }

    addNewService() {
        try {
            const code = document.getElementById('service-code')?.value || '';
            const name = document.getElementById('service-name')?.value || '';
            const description = document.getElementById('service-description')?.value || '';
            const standardCost = parseFloat(document.getElementById('standard-cost')?.value) || 0;
            const listPrice = parseFloat(document.getElementById('list-price')?.value) || 0;
            const glAccount = document.getElementById('gl-account')?.value || '';
            const taxCode = document.getElementById('tax-code')?.value || '';

            // Get all the new service attributes
            const isMandatory = document.getElementById('is-mandatory')?.checked || false;
            const isConsiderForDemand = document.getElementById('is-consider-for-demand')?.checked || false;
            const isActive = document.getElementById('is-active')?.checked || true;
            const isWarranty = document.getElementById('is-warranty')?.checked || false;
            const isInstallation = document.getElementById('is-installation')?.checked || false;
            const isInsurance = document.getElementById('is-insurance')?.checked || false;
            const serviceDueDays = parseInt(document.getElementById('service-due-days')?.value) || 0;
            const serviceDueReading = parseInt(document.getElementById('service-due-reading')?.value) || 0;
            const operationDetails = document.getElementById('operation-details')?.value || '';

            if (!code.trim() || !name.trim()) {
                this.showSnackbar('Service code and name are required');
                return;
            }

            // Check for duplicate code
            if (this.services.find(s => s.code === code.trim())) {
                this.showSnackbar('Service code already exists');
                return;
            }

            // Get category and unit of measure from selects
            const categorySelect = document.getElementById('category-select');
            const unitSelect = document.getElementById('unit-select');

            const category = this.getSelectValue(categorySelect) || 'development';
            const unitOfMeasure = this.getSelectValue(unitSelect) || 'hours';

            const newService = {
                id: Math.max(...this.services.map(s => s.id)) + 1,
                code: code.trim(),
                name: name.trim(),
                description: description.trim() || 'No description provided',
                category: category,
                unitOfMeasure: unitOfMeasure,
                status: 'active',
                tenantLevel: document.getElementById('tenant-level')?.checked || false,
                companySpecific: document.getElementById('company-specific')?.checked || false,
                associatedBrands: this.getSelectedBrands(),
                standardCost: standardCost,
                listPrice: listPrice,
                glAccount: glAccount.trim(),
                taxCode: taxCode.trim(),
                isMandatory: isMandatory,
                isConsiderForDemand: isConsiderForDemand,
                isActive: isActive,
                isWarranty: isWarranty,
                isInstallation: isInstallation,
                isInsurance: isInsurance,
                serviceDueDays: serviceDueDays,
                serviceDueReading: serviceDueReading,
                operationDetails: operationDetails.trim(),
                operations: [...this.currentOperations],
                multiLingual: {
                    en: { name: name.trim(), description: description.trim() || 'No description provided' }
                },
                pricing: {
                    [this.currentContext.company]: {
                        cost: standardCost,
                        price: listPrice,
                        currency: this.currentContext.currency
                    }
                },
                slaTemplate: 'standard',
                requiredSkills: [],
                complianceMapping: [],
                createdAt: new Date(),
                version: '1.0',
                auditTrail: [
                    {
                        action: 'created',
                        user: 'current-user@example.com',
                        timestamp: new Date(),
                        details: 'Service created via UI'
                    }
                ]
            };

            this.services.push(newService);
            this.applyFilters();
            this.updateDashboardStats();
            this.clearForm();
            this.showSnackbar('Service type added successfully');
        } catch (error) {
            console.error('Error adding service:', error);
            this.showSnackbar('Error adding service. Please try again.');
        }
    }

    getSelectValue(selectElement) {
        if (!selectElement) return null;
        try {
            // Try to get value from MDC select instance first
            if (selectElement.id === 'category-select' && this.categoryFormSelect) {
                return this.categoryFormSelect.value || 'development';
            }
            if (selectElement.id === 'unit-select' && this.unitFormSelect) {
                return this.unitFormSelect.value || 'hours';
            }

            // Fallback to DOM query
            const selectedItem = selectElement.querySelector('.mdc-list-item--selected');
            return selectedItem ? selectedItem.getAttribute('data-value') : null;
        } catch (error) {
            console.warn('Error getting select value:', error);
            return null;
        }
    }

    updateService() {
        try {
            const service = this.services.find(s => s.id === this.editingServiceId);
            if (!service) {
                this.showSnackbar('Service not found');
                return;
            }

            const code = document.getElementById('service-code')?.value || '';
            const name = document.getElementById('service-name')?.value || '';
            const description = document.getElementById('service-description')?.value || '';
            const standardCost = parseFloat(document.getElementById('standard-cost')?.value) || 0;
            const listPrice = parseFloat(document.getElementById('list-price')?.value) || 0;
            const glAccount = document.getElementById('gl-account')?.value || '';
            const taxCode = document.getElementById('tax-code')?.value || '';

            // Get all the new service attributes
            const isMandatory = document.getElementById('is-mandatory')?.checked || false;
            const isConsiderForDemand = document.getElementById('is-consider-for-demand')?.checked || false;
            const isActive = document.getElementById('is-active')?.checked || true;
            const isWarranty = document.getElementById('is-warranty')?.checked || false;
            const isInstallation = document.getElementById('is-installation')?.checked || false;
            const isInsurance = document.getElementById('is-insurance')?.checked || false;
            const serviceDueDays = parseInt(document.getElementById('service-due-days')?.value) || 0;
            const serviceDueReading = parseInt(document.getElementById('service-due-reading')?.value) || 0;
            const operationDetails = document.getElementById('operation-details')?.value || '';

            if (!code.trim() || !name.trim()) {
                this.showSnackbar('Service code and name are required');
                return;
            }

            // Check for duplicate code (excluding current service)
            if (this.services.find(s => s.code === code.trim() && s.id !== this.editingServiceId)) {
                this.showSnackbar('Service code already exists');
                return;
            }

            const categorySelect = document.getElementById('category-select');
            const unitSelect = document.getElementById('unit-select');

            const category = this.getSelectValue(categorySelect) || service.category;
            const unitOfMeasure = this.getSelectValue(unitSelect) || service.unitOfMeasure;

            // Update service properties
            service.code = code.trim();
            service.name = name.trim();
            service.description = description.trim() || 'No description provided';
            service.category = category;
            service.unitOfMeasure = unitOfMeasure;
            service.tenantLevel = document.getElementById('tenant-level')?.checked || false;
            service.companySpecific = document.getElementById('company-specific')?.checked || false;
            service.associatedBrands = this.getSelectedBrands();
            service.standardCost = standardCost;
            service.listPrice = listPrice;
            service.glAccount = glAccount.trim();
            service.taxCode = taxCode.trim();
            service.isMandatory = isMandatory;
            service.isConsiderForDemand = isConsiderForDemand;
            service.isActive = isActive;
            service.isWarranty = isWarranty;
            service.isInstallation = isInstallation;
            service.isInsurance = isInsurance;
            service.serviceDueDays = serviceDueDays;
            service.serviceDueReading = serviceDueReading;
            service.operationDetails = operationDetails.trim();
            service.operations = [...this.currentOperations];

            // Update multi-lingual content
            service.multiLingual.en = {
                name: name.trim(),
                description: description.trim() || 'No description provided'
            };

            // Update pricing
            service.pricing[this.currentContext.company] = {
                cost: standardCost,
                price: listPrice,
                currency: this.currentContext.currency
            };

            // Add audit trail entry
            service.auditTrail.push({
                action: 'updated',
                user: 'current-user@example.com',
                timestamp: new Date(),
                details: 'Service updated via UI'
            });

            this.applyFilters();
            this.updateDashboardStats();
            this.clearForm();
            this.showSnackbar('Service updated successfully');
        } catch (error) {
            console.error('Error updating service:', error);
            this.showSnackbar('Error updating service. Please try again.');
        }
    }

    getSelectedBrands() {
        const brands = [];
        if (document.getElementById('brand-innovatepro').checked) brands.push('innovatepro');
        if (document.getElementById('brand-innovatelite').checked) brands.push('innovatelite');
        return brands.length > 0 ? brands : [this.currentContext.brand];
    }

    viewService(id) {
        const service = this.services.find(s => s.id === id);
        if (service) {
            this.showServiceModal(service, 'view');
        }
    }

    viewServiceDetails(id) {
        // Alias for backward compatibility
        this.viewService(id);
    }

    editService(id) {
        const service = this.services.find(s => s.id === id);
        if (service) {
            this.showServiceModal(service, 'edit');
        }
    }

    editServiceOld(id) {
        // Keep old edit functionality for form-based editing
        const service = this.services.find(s => s.id === id);
        if (service) {
            this.editingServiceId = id;

            // Populate form with service data
            document.getElementById('service-code').value = service.code;
            document.getElementById('service-name').value = service.name;
            document.getElementById('service-description').value = service.description;
            document.getElementById('standard-cost').value = service.standardCost;
            document.getElementById('list-price').value = service.listPrice;
            document.getElementById('gl-account').value = service.glAccount || '';
            document.getElementById('tax-code').value = service.taxCode || '';
            document.getElementById('tenant-level').checked = service.tenantLevel;
            document.getElementById('company-specific').checked = service.companySpecific;

            // Set brand checkboxes
            document.getElementById('brand-innovatepro').checked = service.associatedBrands.includes('innovatepro');
            document.getElementById('brand-innovatelite').checked = service.associatedBrands.includes('innovatelite');

            // Set new service attribute checkboxes
            document.getElementById('is-mandatory').checked = service.isMandatory || false;
            document.getElementById('is-consider-for-demand').checked = service.isConsiderForDemand || false;
            document.getElementById('is-active').checked = service.isActive || false;
            document.getElementById('is-warranty').checked = service.isWarranty || false;
            document.getElementById('is-installation').checked = service.isInstallation || false;
            document.getElementById('is-insurance').checked = service.isInsurance || false;

            // Set service due fields
            document.getElementById('service-due-days').value = service.serviceDueDays || 0;
            document.getElementById('service-due-reading').value = service.serviceDueReading || 0;
            document.getElementById('operation-details').value = service.operationDetails || '';

            // Load operations
            this.currentOperations = service.operations ? [...service.operations] : [];
            this.renderOperationTable();

            // Set select values
            if (this.categoryFormSelect) {
                this.categoryFormSelect.value = service.category;
            }
            if (this.unitFormSelect) {
                this.unitFormSelect.value = service.unitOfMeasure;
            }

            // Update dialog title
            const dialogTitle = document.querySelector('#add-service-dialog .mdc-dialog__title');
            if (dialogTitle) {
                dialogTitle.textContent = 'Edit Service Type';
            }

            this.dialog.open();
        }
    }

    cloneService(id) {
        const service = this.services.find(s => s.id === id);
        if (service) {
            const clonedService = {
                ...service,
                id: Math.max(...this.services.map(s => s.id)) + 1,
                code: service.code + '-COPY',
                name: service.name + ' (Copy)',
                createdAt: new Date(),
                version: '1.0',
                auditTrail: [
                    {
                        action: 'cloned',
                        user: 'current-user@example.com',
                        timestamp: new Date(),
                        details: `Cloned from service ${service.code}`
                    }
                ]
            };

            this.services.push(clonedService);
            this.applyFilters();
            this.updateDashboardStats();
            this.showSnackbar('Service cloned successfully');
        }
    }

    toggleServiceStatus(id) {
        const service = this.services.find(s => s.id === id);
        if (service) {
            const oldStatus = service.status;
            service.status = service.status === 'active' ? 'inactive' : 'active';

            // Add audit trail entry
            service.auditTrail.push({
                action: 'status_changed',
                user: 'current-user@example.com',
                timestamp: new Date(),
                details: `Status changed from ${oldStatus} to ${service.status}`
            });

            this.updateDashboardStats();
            this.applyFilters();
            this.showSnackbar(`Service ${service.status === 'active' ? 'activated' : 'deactivated'}`);
        }
    }

    deleteService(id) {
        const service = this.services.find(s => s.id === id);
        if (service) {
            this.showConfirmationModal(
                'Delete Service',
                `Are you sure you want to delete service "${service.name}"?`,
                'This action cannot be undone.',
                () => {
                    this.services = this.services.filter(s => s.id !== id);
                    this.applyFilters();
                    this.updateDashboardStats();
                    this.showModernNotification('Service type deleted successfully', 'success');
                }
            );
        }
    }

    clearForm() {
        // Helper function to safely set element values
        const safeSetValue = (id, value) => {
            const element = document.getElementById(id);
            if (element) {
                element.value = value;
            } else {
                console.warn(`Element with id '${id}' not found`);
            }
        };

        const safeSetChecked = (id, checked) => {
            const element = document.getElementById(id);
            if (element) {
                element.checked = checked;
            } else {
                console.warn(`Element with id '${id}' not found`);
            }
        };

        // Clear basic form fields
        safeSetValue('service-code', '');
        safeSetValue('service-name', '');
        safeSetValue('service-description', '');
        safeSetValue('standard-cost', '');
        safeSetValue('list-price', '');
        safeSetValue('gl-account', '');
        safeSetValue('tax-code', '');

        // Clear checkboxes
        safeSetChecked('tenant-level', false);
        safeSetChecked('company-specific', false);
        safeSetChecked('brand-innovatepro', false);
        safeSetChecked('brand-innovatelite', false);

        // Clear new service attribute checkboxes
        safeSetChecked('is-mandatory', false);
        safeSetChecked('is-consider-for-demand', false);
        safeSetChecked('is-active', true); // Default to active
        safeSetChecked('is-warranty', false);
        safeSetChecked('is-installation', false);
        safeSetChecked('is-insurance', false);

        // Clear service due fields
        safeSetValue('service-due-days', '');
        safeSetValue('service-due-reading', '');
        safeSetValue('operation-details', '');

        // Clear operations
        this.currentOperations = [];
        this.renderOperationTable();

        // Reset selects to default values
        if (this.categoryFormSelect) {
            this.categoryFormSelect.value = 'development';
        }
        if (this.unitFormSelect) {
            this.unitFormSelect.value = 'hours';
        }

        // Reset dialog title
        const dialogTitle = document.querySelector('#add-service-dialog .mdc-dialog__title');
        if (dialogTitle) {
            dialogTitle.textContent = 'Add New Service Type';
        }

        this.editingServiceId = null;
    }

    toggleDarkMode(enabled) {
        if (enabled) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
        this.showSnackbar(`Dark mode ${enabled ? 'enabled' : 'disabled'}`);
    }

    toggleNotifications(enabled) {
        this.showSnackbar(`Notifications ${enabled ? 'enabled' : 'disabled'}`);
    }

    showSnackbar(message) {
        // Simple snackbar implementation
        const snackbar = document.createElement('div');
        snackbar.className = 'snackbar';
        snackbar.textContent = message;
        snackbar.style.cssText = `
            position: fixed;
            bottom: 24px;
            left: 50%;
            transform: translateX(-50%);
            background: #323232;
            color: white;
            padding: 14px 24px;
            border-radius: 4px;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
            max-width: 400px;
            text-align: center;
        `;

        document.body.appendChild(snackbar);

        setTimeout(() => {
            snackbar.style.opacity = '1';
        }, 100);

        setTimeout(() => {
            snackbar.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(snackbar)) {
                    document.body.removeChild(snackbar);
                }
            }, 300);
        }, 3000);
    }

    showModernNotification(message, type = 'info', duration = 4000) {
        const notification = document.createElement('div');
        notification.className = `modern-notification ${type}`;

        const icon = type === 'success' ? 'check_circle' :
                    type === 'error' ? 'error' :
                    type === 'warning' ? 'warning' : 'info';

        notification.innerHTML = `
            <div class="notification-content">
                <i class="material-icons notification-icon">${icon}</i>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="material-icons">close</i>
                </button>
            </div>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4caf50' :
                        type === 'error' ? '#f44336' :
                        type === 'warning' ? '#ff9800' : '#2196f3'};
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            max-width: 400px;
            min-width: 300px;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, duration);
    }

    showServiceModal(service, mode = 'view') {
        // Remove existing modal if any
        const existingModal = document.getElementById('service-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'service-modal';
        modal.className = 'service-modal-overlay';

        const isEditMode = mode === 'edit';
        const modalTitle = isEditMode ? 'Edit Service' : 'Service Details';
        const actionButtons = isEditMode ?
            `<button class="modal-btn modal-btn-primary" onclick="app.saveServiceFromModal()">Save Changes</button>
             <button class="modal-btn modal-btn-secondary" onclick="app.closeServiceModal()">Cancel</button>` :
            `<button class="modal-btn modal-btn-primary" onclick="app.closeServiceModal()">Close</button>`;

        modal.innerHTML = `
            <div class="service-modal">
                <div class="modal-header">
                    <h2 class="modal-title">
                        <i class="material-icons">${isEditMode ? 'edit' : 'visibility'}</i>
                        ${modalTitle}
                    </h2>
                    <button class="modal-close" onclick="app.closeServiceModal()">
                        <i class="material-icons">close</i>
                    </button>
                </div>

                <div class="modal-body">
                    <div class="service-details-grid">
                        <div class="detail-section">
                            <h3><i class="material-icons">info</i> Basic Information</h3>
                            <div class="detail-row">
                                <label>Service Code:</label>
                                ${isEditMode ? `<input type="text" id="modal-code" value="${service.code}" class="modal-input">` : `<span>${service.code}</span>`}
                            </div>
                            <div class="detail-row">
                                <label>Service Name:</label>
                                ${isEditMode ? `<input type="text" id="modal-name" value="${service.name}" class="modal-input">` : `<span>${service.name}</span>`}
                            </div>
                            <div class="detail-row">
                                <label>Description:</label>
                                ${isEditMode ? `<textarea id="modal-description" class="modal-textarea">${service.description}</textarea>` : `<span>${service.description}</span>`}
                            </div>
                            <div class="detail-row">
                                <label>Category:</label>
                                ${isEditMode ? `<select id="modal-category" class="modal-select">
                                    <option value="maintenance" ${service.category === 'maintenance' ? 'selected' : ''}>Maintenance</option>
                                    <option value="diagnostics" ${service.category === 'diagnostics' ? 'selected' : ''}>Diagnostics</option>
                                    <option value="inspection" ${service.category === 'inspection' ? 'selected' : ''}>Inspection</option>
                                    <option value="repair" ${service.category === 'repair' ? 'selected' : ''}>Repair</option>
                                    <option value="installation" ${service.category === 'installation' ? 'selected' : ''}>Installation</option>
                                    <option value="consulting" ${service.category === 'consulting' ? 'selected' : ''}>Consulting</option>
                                    <option value="support" ${service.category === 'support' ? 'selected' : ''}>Support</option>
                                </select>` : `<span class="category-badge">${service.category || 'maintenance'}</span>`}
                            </div>
                            <div class="detail-row">
                                <label>Status:</label>
                                <span class="status-badge status-${service.status}">${service.status}</span>
                            </div>
                        </div>

                        <div class="detail-section">
                            <h3><i class="material-icons">attach_money</i> Pricing Information</h3>
                            <div class="detail-row">
                                <label>Standard Cost:</label>
                                ${isEditMode ? `<input type="number" id="modal-cost" value="${service.standardCost || 0}" class="modal-input" step="0.01">` : `<span class="price">$${service.standardCost || 0}</span>`}
                            </div>
                            <div class="detail-row">
                                <label>List Price:</label>
                                ${isEditMode ? `<input type="number" id="modal-price" value="${service.listPrice || 0}" class="modal-input" step="0.01">` : `<span class="price">$${service.listPrice || 0}</span>`}
                            </div>
                            <div class="detail-row">
                                <label>Unit of Measure:</label>
                                ${isEditMode ? `<select id="modal-unit" class="modal-select">
                                    <option value="service" ${(service.unitOfMeasure || 'service') === 'service' ? 'selected' : ''}>Service</option>
                                    <option value="hours" ${(service.unitOfMeasure || 'service') === 'hours' ? 'selected' : ''}>Hours</option>
                                    <option value="days" ${(service.unitOfMeasure || 'service') === 'days' ? 'selected' : ''}>Days</option>
                                    <option value="fixed" ${(service.unitOfMeasure || 'service') === 'fixed' ? 'selected' : ''}>Fixed</option>
                                </select>` : `<span>${service.unitOfMeasure || 'service'}</span>`}
                            </div>
                        </div>

                        <div class="detail-section">
                            <h3><i class="material-icons">settings</i> Service Attributes</h3>
                            <div class="attributes-grid">
                                <div class="attribute-item">
                                    <label>
                                        ${isEditMode ? `<input type="checkbox" id="modal-mandatory" ${service.isMandatory || false ? 'checked' : ''}>` : ''}
                                        <span class="attribute-label">Mandatory</span>
                                        ${!isEditMode ? `<span class="attribute-value ${service.isMandatory || false ? 'yes' : 'no'}">${service.isMandatory || false ? 'Yes' : 'No'}</span>` : ''}
                                    </label>
                                </div>
                                <div class="attribute-item">
                                    <label>
                                        ${isEditMode ? `<input type="checkbox" id="modal-active" ${service.isActive !== false ? 'checked' : ''}>` : ''}
                                        <span class="attribute-label">Active</span>
                                        ${!isEditMode ? `<span class="attribute-value ${service.isActive !== false ? 'yes' : 'no'}">${service.isActive !== false ? 'Yes' : 'No'}</span>` : ''}
                                    </label>
                                </div>
                                <div class="attribute-item">
                                    <label>
                                        ${isEditMode ? `<input type="checkbox" id="modal-warranty" ${service.isWarranty || false ? 'checked' : ''}>` : ''}
                                        <span class="attribute-label">Warranty</span>
                                        ${!isEditMode ? `<span class="attribute-value ${service.isWarranty || false ? 'yes' : 'no'}">${service.isWarranty || false ? 'Yes' : 'No'}</span>` : ''}
                                    </label>
                                </div>
                                <div class="attribute-item">
                                    <label>
                                        ${isEditMode ? `<input type="checkbox" id="modal-installation" ${service.isInstallation || false ? 'checked' : ''}>` : ''}
                                        <span class="attribute-label">Installation</span>
                                        ${!isEditMode ? `<span class="attribute-value ${service.isInstallation || false ? 'yes' : 'no'}">${service.isInstallation || false ? 'Yes' : 'No'}</span>` : ''}
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="detail-section">
                            <h3><i class="material-icons">business</i> Context Information</h3>
                            <div class="detail-row">
                                <label>Associated Brands:</label>
                                <span class="brands">${(service.associatedBrands || []).join(', ') || 'None'}</span>
                            </div>
                            <div class="detail-row">
                                <label>Created:</label>
                                <span>${service.createdAt ? service.createdAt.toLocaleDateString() : 'Unknown'}</span>
                            </div>
                            <div class="detail-row">
                                <label>Version:</label>
                                <span>${service.version || '1.0'}</span>
                            </div>
                        </div>

                        ${service.operations && service.operations.length > 0 ? `
                        <div class="detail-section">
                            <h3><i class="material-icons">build_circle</i> Operations (${service.operations.length})</h3>
                            <div class="operations-list">
                                ${service.operations.map(op => `
                                    <div class="operation-item">
                                        <div class="operation-code">${op.code}</div>
                                        <div class="operation-description">${op.description || 'No description'}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>

                <div class="modal-footer">
                    ${actionButtons}
                </div>
            </div>
        `;

        // Store current service for editing
        if (isEditMode) {
            this.currentEditingService = service;
        }

        document.body.appendChild(modal);

        // Add animation
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeServiceModal();
            }
        });
    }

    closeServiceModal() {
        const modal = document.getElementById('service-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
        this.currentEditingService = null;
    }

    saveServiceFromModal() {
        if (!this.currentEditingService) return;

        const service = this.currentEditingService;

        // Get values from modal inputs
        service.code = document.getElementById('modal-code').value;
        service.name = document.getElementById('modal-name').value;
        service.description = document.getElementById('modal-description').value;
        service.category = document.getElementById('modal-category').value;
        service.standardCost = parseFloat(document.getElementById('modal-cost').value);
        service.listPrice = parseFloat(document.getElementById('modal-price').value);
        service.unitOfMeasure = document.getElementById('modal-unit').value;
        service.isMandatory = document.getElementById('modal-mandatory').checked;
        service.isActive = document.getElementById('modal-active').checked;
        service.isWarranty = document.getElementById('modal-warranty').checked;
        service.isInstallation = document.getElementById('modal-installation').checked;

        // Add audit trail
        service.auditTrail.push({
            action: 'updated',
            user: 'current-user@example.com',
            timestamp: new Date(),
            details: 'Service updated via modal'
        });

        this.applyFilters();
        this.updateDashboardStats();
        this.closeServiceModal();
        this.showModernNotification('Service updated successfully', 'success');
    }

    showConfirmationModal(title, message, subtitle, onConfirm) {
        // Remove existing modal if any
        const existingModal = document.getElementById('confirmation-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'confirmation-modal';
        modal.className = 'confirmation-modal-overlay';

        modal.innerHTML = `
            <div class="confirmation-modal">
                <div class="modal-header">
                    <h2 class="modal-title">
                        <i class="material-icons warning-icon">warning</i>
                        ${title}
                    </h2>
                </div>

                <div class="modal-body">
                    <p class="confirmation-message">${message}</p>
                    ${subtitle ? `<p class="confirmation-subtitle">${subtitle}</p>` : ''}
                </div>

                <div class="modal-footer">
                    <button class="modal-btn modal-btn-secondary" onclick="app.closeConfirmationModal()">Cancel</button>
                    <button class="modal-btn modal-btn-danger" onclick="app.confirmAction()">Delete</button>
                </div>
            </div>
        `;

        // Store the confirmation action
        this.pendingConfirmAction = onConfirm;

        document.body.appendChild(modal);

        // Add animation
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeConfirmationModal();
            }
        });
    }

    closeConfirmationModal() {
        const modal = document.getElementById('confirmation-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
        this.pendingConfirmAction = null;
    }

    confirmAction() {
        if (this.pendingConfirmAction) {
            this.pendingConfirmAction();
        }
        this.closeConfirmationModal();
    }

    // Operation Management Methods
    openOperationDialog() {
        this.editingOperationId = null;

        const operationCode = document.getElementById('operation-code');
        const operationDesc = document.getElementById('operation-description');

        if (operationCode) operationCode.value = '';
        if (operationDesc) operationDesc.value = '';

        const dialogTitle = document.querySelector('#add-operation-dialog .mdc-dialog__title');
        if (dialogTitle) {
            dialogTitle.textContent = 'Add Operation';
        }

        if (this.operationDialog) {
            this.operationDialog.open();
        } else {
            console.error('Operation dialog not initialized');
        }
    }

    addOperation() {
        const code = document.getElementById('operation-code').value.trim();
        const description = document.getElementById('operation-description').value.trim();

        if (!code) {
            this.showModernNotification('Operation code is required', 'error');
            return;
        }

        // Check for duplicate code
        if (this.currentOperations.find(op => op.code === code)) {
            this.showModernNotification('Operation code already exists', 'error');
            return;
        }

        const newOperation = {
            id: Math.max(0, ...this.currentOperations.map(op => op.id)) + 1,
            code: code,
            description: description || ''
        };

        this.currentOperations.push(newOperation);
        this.renderOperationTable();

        // Add success animation to the new row
        setTimeout(() => {
            const newRow = document.querySelector(`[data-operation-index="${this.currentOperations.length - 1}"]`);
            if (newRow) {
                newRow.classList.add('operation-row-new');
            }
        }, 100);

        this.showModernNotification('Operation added successfully', 'success');

        // Close the dialog
        if (this.operationDialog) {
            this.operationDialog.close();
        }
    }

    editOperation(id) {
        const operation = this.currentOperations.find(op => op.id === id);
        if (operation) {
            this.editingOperationId = id;
            document.getElementById('operation-code').value = operation.code;
            document.getElementById('operation-description').value = operation.description;

            const dialogTitle = document.querySelector('#add-operation-dialog .mdc-dialog__title');
            if (dialogTitle) {
                dialogTitle.textContent = 'Edit Operation';
            }

            this.operationDialog.open();
        }
    }

    updateOperation() {
        const operation = this.currentOperations.find(op => op.id === this.editingOperationId);
        if (!operation) {
            this.showModernNotification('Operation not found', 'error');
            return;
        }

        const code = document.getElementById('operation-code').value.trim();
        const description = document.getElementById('operation-description').value.trim();

        if (!code) {
            this.showModernNotification('Operation code is required', 'error');
            return;
        }

        // Check for duplicate code (excluding current operation)
        if (this.currentOperations.find(op => op.code === code && op.id !== this.editingOperationId)) {
            this.showModernNotification('Operation code already exists', 'error');
            return;
        }

        const operationIndex = this.currentOperations.findIndex(op => op.id === this.editingOperationId);

        operation.code = code;
        operation.description = description || '';

        this.renderOperationTable();

        // Add success animation to the updated row
        setTimeout(() => {
            const updatedRow = document.querySelector(`[data-operation-index="${operationIndex}"]`);
            if (updatedRow) {
                updatedRow.classList.add('operation-row-success');
                setTimeout(() => {
                    updatedRow.classList.remove('operation-row-success');
                }, 1000);
            }
        }, 100);

        this.showModernNotification('Operation updated successfully', 'success');

        // Close the dialog
        if (this.operationDialog) {
            this.operationDialog.close();
        }
    }

    deleteOperation(id) {
        const operation = this.currentOperations.find(op => op.id === id);
        if (operation && confirm(`Are you sure you want to delete operation "${operation.code}"?`)) {
            this.currentOperations = this.currentOperations.filter(op => op.id !== id);
            this.renderOperationTable();
            this.showSnackbar('Operation deleted successfully');
        }
    }

    renderOperationTable() {
        const tableBody = document.getElementById('operation-table-body');
        const viewInfo = document.getElementById('operation-view-info');

        if (!tableBody || !viewInfo) return;

        tableBody.innerHTML = '';

        if (this.currentOperations.length === 0) {
            tableBody.innerHTML = `
                <tr class="mdc-data-table__row">
                    <td class="mdc-data-table__cell" colspan="4">
                        <div class="operation-empty-state">
                            <i class="material-icons">build_circle</i>
                            <h4>No Operations Defined</h4>
                            <p>Click "Add Operation" to define service operations and procedures</p>
                        </div>
                    </td>
                </tr>
            `;
            viewInfo.textContent = '0 operations';
        } else {
            this.currentOperations.forEach((operation, index) => {
                const row = document.createElement('tr');
                row.className = 'mdc-data-table__row';
                row.setAttribute('data-operation-index', index);
                row.innerHTML = `
                    <td class="mdc-data-table__cell operation-action-cell">
                        <button class="operation-action-btn edit-btn" onclick="app.editOperation(${operation.id})" title="Edit Operation">
                            <i class="material-icons">edit</i>
                        </button>
                    </td>
                    <td class="mdc-data-table__cell operation-action-cell">
                        <button class="operation-action-btn delete-btn" onclick="app.deleteOperation(${operation.id})" title="Delete Operation">
                            <i class="material-icons">delete</i>
                        </button>
                    </td>
                    <td class="mdc-data-table__cell">
                        <span class="operation-code-cell">${this.escapeHtml(operation.code)}</span>
                    </td>
                    <td class="mdc-data-table__cell">
                        <span class="operation-desc-cell">${this.escapeHtml(operation.description || 'No description provided')}</span>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            const total = this.currentOperations.length;
            viewInfo.textContent = `${total} operation${total !== 1 ? 's' : ''}`;
        }
    }

    // Helper method to escape HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Modern View Controls
    initializeViewControls() {
        console.log('Initializing view controls...');
        this.currentView = 'grid';
        this.selectedItems = new Set();

        // View toggle buttons
        const viewButtons = document.querySelectorAll('.view-btn');
        console.log('Found view buttons:', viewButtons.length);

        if (viewButtons.length === 0) {
            console.error('No view buttons found! Check HTML structure.');
            return;
        }

        viewButtons.forEach((btn, index) => {
            console.log(`Setting up button ${index}:`, btn.dataset.view);
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const view = e.currentTarget.dataset.view;
                console.log('Button clicked, switching to view:', view);
                this.switchView(view);
            });
        });

        // Update results count
        this.updateResultsCount();

        // Initialize the grid view as default
        console.log('Setting initial view to grid');
        this.switchView('grid');
    }

    switchView(view) {
        this.currentView = view;

        // Update active button
        const allButtons = document.querySelectorAll('.view-btn');
        allButtons.forEach(btn => {
            btn.classList.remove('active');
        });

        const activeBtn = document.querySelector(`.view-btn[data-view="${view}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        // Hide all view contents by removing active class
        const viewContents = document.querySelectorAll('.view-content');
        viewContents.forEach(content => {
            content.classList.remove('active');
        });

        // Show selected view by adding active class
        let targetView;
        switch(view) {
            case 'grid':
                targetView = document.getElementById('services-grid');
                break;
            case 'list':
                targetView = document.getElementById('services-list');
                break;
            case 'table':
                targetView = document.getElementById('services-table-container');
                break;
            case 'kanban':
                targetView = document.getElementById('services-kanban');
                break;
        }

        if (targetView) {
            targetView.classList.add('active');
        }

        // Render content for the new view
        this.renderCurrentView();

        if (this.showModernNotification) {
            this.showModernNotification(`Switched to ${view} view`, 'info', 2000);
        }
    }

    renderCurrentView() {
        // Clear all view containers first
        const gridContainer = document.getElementById('services-grid');
        const listContainer = document.getElementById('services-list');
        const tableBody = document.getElementById('services-table-body');
        const activeKanban = document.getElementById('active-kanban');
        const inactiveKanban = document.getElementById('inactive-kanban');
        const draftKanban = document.getElementById('draft-kanban');

        if (gridContainer) gridContainer.innerHTML = '';
        if (listContainer) listContainer.innerHTML = '';
        if (tableBody) tableBody.innerHTML = '';
        if (activeKanban) activeKanban.innerHTML = '';
        if (inactiveKanban) inactiveKanban.innerHTML = '';
        if (draftKanban) draftKanban.innerHTML = '';

        // Now render only the current view
        switch (this.currentView) {
            case 'grid':
                this.renderGridView();
                break;
            case 'list':
                this.renderListView();
                break;
            case 'table':
                this.renderTableView();
                break;
            case 'kanban':
                this.renderKanbanView();
                break;
        }
        this.updateResultsCount();
    }

    renderGridView() {
        console.log('renderGridView called');
        const container = document.getElementById('services-grid');
        console.log('Grid container:', container);
        if (!container) {
            console.error('Grid container not found!');
            return;
        }

        container.innerHTML = '';
        console.log('Rendering', this.filteredServices.length, 'services in grid view');

        this.filteredServices.forEach((service, index) => {
            console.log('Creating card for service:', service.name);
            const card = this.createServiceCard(service);
            card.classList.add('animate-fade-in-up');
            card.style.animationDelay = `${index * 0.05}s`;
            container.appendChild(card);
        });
    }

    renderListView() {
        const container = document.getElementById('services-list');
        if (!container) return;

        container.innerHTML = '';

        this.filteredServices.forEach((service, index) => {
            const listItem = this.createServiceListItem(service);
            listItem.classList.add('animate-slide-in-left');
            listItem.style.animationDelay = `${index * 0.05}s`;
            container.appendChild(listItem);
        });
    }

    renderTableView() {
        const tbody = document.getElementById('services-table-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        this.filteredServices.forEach((service, index) => {
            const row = this.createServiceTableRow(service);
            row.classList.add('animate-fade-in-up');
            row.style.animationDelay = `${index * 0.02}s`;
            tbody.appendChild(row);
        });

        // Initialize table sorting
        this.initializeTableSorting();
    }

    renderKanbanView() {
        const activeContainer = document.getElementById('active-kanban');
        const inactiveContainer = document.getElementById('inactive-kanban');
        const draftContainer = document.getElementById('draft-kanban');

        if (!activeContainer || !inactiveContainer || !draftContainer) return;

        // Clear containers
        activeContainer.innerHTML = '';
        inactiveContainer.innerHTML = '';
        draftContainer.innerHTML = '';

        // Group services by status
        const grouped = {
            active: this.filteredServices.filter(s => s.status === 'active'),
            inactive: this.filteredServices.filter(s => s.status === 'inactive'),
            draft: this.filteredServices.filter(s => s.status === 'draft')
        };

        // Render each group
        Object.entries(grouped).forEach(([status, services]) => {
            const container = document.getElementById(`${status}-kanban`);
            if (container) {
                services.forEach((service, index) => {
                    const item = this.createKanbanItem(service);
                    item.classList.add('animate-bounce-in');
                    item.style.animationDelay = `${index * 0.1}s`;
                    container.appendChild(item);
                });
            }
        });

        // Update counts
        const activeCount = document.getElementById('active-count');
        const inactiveCount = document.getElementById('inactive-count');
        const draftCount = document.getElementById('draft-count');

        if (activeCount) activeCount.textContent = grouped.active.length;
        if (inactiveCount) inactiveCount.textContent = grouped.inactive.length;
        if (draftCount) draftCount.textContent = grouped.draft.length;
    }

    createServiceListItem(service) {
        const lang = this.currentContext.language;
        const localizedName = service.multiLingual[lang]?.name || service.name;
        const pricing = service.pricing[this.currentContext.company] || { price: 0, currency: 'USD' };

        const listItem = document.createElement('div');
        listItem.className = 'service-list-item';
        listItem.innerHTML = `
            <div class="checkbox-container">
                <input type="checkbox" id="select-${service.id}" data-service-id="${service.id}">
                <span class="checkmark"></span>
            </div>
            <div class="service-list-content">
                <div class="service-list-info">
                    <div class="service-list-title">${localizedName}</div>
                    <div class="service-list-meta">
                        <span><i class="material-icons">code</i> ${service.code}</span>
                        <span><i class="material-icons">category</i> ${service.category}</span>
                        <span><i class="material-icons">attach_money</i> ${this.formatPrice(pricing.price)}</span>
                        <span class="status-badge status-${service.status}">${service.status}</span>
                    </div>
                </div>
                <div class="service-list-actions">
                    <button class="mdc-icon-button action-btn view-btn-action" onclick="app.viewService(${service.id})" title="View Details">
                        <i class="material-icons">visibility</i>
                    </button>
                    <button class="mdc-icon-button action-btn edit-btn-action" onclick="app.editService(${service.id})" title="Edit Service">
                        <i class="material-icons">edit</i>
                    </button>
                    <button class="mdc-icon-button action-btn clone-btn-action" onclick="app.cloneService(${service.id})" title="Clone Service">
                        <i class="material-icons">content_copy</i>
                    </button>
                    <button class="mdc-icon-button action-btn deactivate-btn-action" onclick="app.toggleServiceStatus(${service.id})" title="${service.status === 'active' ? 'Deactivate' : 'Activate'} Service">
                        <i class="material-icons">${service.status === 'active' ? 'pause_circle' : 'play_circle'}</i>
                    </button>
                    <button class="mdc-icon-button action-btn delete-btn-action" onclick="app.deleteService(${service.id})" title="Delete Service">
                        <i class="material-icons">delete</i>
                    </button>
                </div>
            </div>
        `;

        // Add checkbox event listener
        const checkbox = listItem.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', (e) => {
            this.handleItemSelection(service.id, e.target.checked);
        });

        // Make list item draggable
        this.makeServiceDraggable(listItem, service);

        return listItem;
    }

    createServiceTableRow(service) {
        const lang = this.currentContext.language;
        const localizedName = service.multiLingual[lang]?.name || service.name;
        const pricing = service.pricing[this.currentContext.company] || { price: 0, currency: 'USD' };

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <label class="checkbox-container">
                    <input type="checkbox" data-service-id="${service.id}">
                    <span class="checkmark"></span>
                </label>
            </td>
            <td>${localizedName}</td>
            <td>${service.code}</td>
            <td>${service.category}</td>
            <td>${this.formatPrice(pricing.price)}</td>
            <td><span class="status-badge status-${service.status}">${service.status}</span></td>
            <td>
                <div class="table-actions">
                    <button class="mdc-icon-button action-btn view-btn-action" onclick="app.viewService(${service.id})" title="View Details">
                        <i class="material-icons">visibility</i>
                    </button>
                    <button class="mdc-icon-button action-btn edit-btn-action" onclick="app.editService(${service.id})" title="Edit Service">
                        <i class="material-icons">edit</i>
                    </button>
                    <button class="mdc-icon-button action-btn clone-btn-action" onclick="app.cloneService(${service.id})" title="Clone Service">
                        <i class="material-icons">content_copy</i>
                    </button>
                    <button class="mdc-icon-button action-btn deactivate-btn-action" onclick="app.toggleServiceStatus(${service.id})" title="${service.status === 'active' ? 'Deactivate' : 'Activate'} Service">
                        <i class="material-icons">${service.status === 'active' ? 'pause_circle' : 'play_circle'}</i>
                    </button>
                    <button class="mdc-icon-button action-btn delete-btn-action" onclick="app.deleteService(${service.id})" title="Delete Service">
                        <i class="material-icons">delete</i>
                    </button>
                </div>
            </td>
        `;

        // Add checkbox event listener
        const checkbox = row.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', (e) => {
            this.handleItemSelection(service.id, e.target.checked);
        });

        // Make table row draggable
        this.makeServiceDraggable(row, service);

        return row;
    }

    createKanbanItem(service) {
        const lang = this.currentContext.language;
        const localizedName = service.multiLingual[lang]?.name || service.name;
        const pricing = service.pricing[this.currentContext.company] || { price: 0, currency: 'USD' };

        const item = document.createElement('div');
        item.className = 'kanban-item';
        item.draggable = true;
        item.dataset.serviceId = service.id;
        item.innerHTML = `
            <div class="kanban-item-title">${localizedName}</div>
            <div class="kanban-item-meta">
                <span>${service.code}</span>
                <span>${this.formatPrice(pricing.price)}</span>
            </div>
            <div class="kanban-item-actions">
                <button class="mdc-icon-button action-btn view-btn-action" onclick="app.viewService(${service.id})" title="View Details">
                    <i class="material-icons">visibility</i>
                </button>
                <button class="mdc-icon-button action-btn edit-btn-action" onclick="app.editService(${service.id})" title="Edit Service">
                    <i class="material-icons">edit</i>
                </button>
                <button class="mdc-icon-button action-btn clone-btn-action" onclick="app.cloneService(${service.id})" title="Clone Service">
                    <i class="material-icons">content_copy</i>
                </button>
                <button class="mdc-icon-button action-btn deactivate-btn-action" onclick="app.toggleServiceStatus(${service.id})" title="${service.status === 'active' ? 'Deactivate' : 'Activate'} Service">
                    <i class="material-icons">${service.status === 'active' ? 'pause_circle' : 'play_circle'}</i>
                </button>
                <button class="mdc-icon-button action-btn delete-btn-action" onclick="app.deleteService(${service.id})" title="Delete Service">
                    <i class="material-icons">delete</i>
                </button>
            </div>
        `;

        // Make kanban item draggable using the new system
        this.makeServiceDraggable(item, service);

        item.addEventListener('click', () => {
            this.editService(service.id);
        });

        return item;
    }

    initializeSortControls() {
        const sortBtn = document.getElementById('sort-btn');
        const sortMenu = document.getElementById('sort-menu');

        if (sortBtn && sortMenu) {
            sortBtn.addEventListener('click', () => {
                sortMenu.classList.toggle('show');
                sortBtn.classList.toggle('active');
            });

            // Sort options
            sortMenu.querySelectorAll('.dropdown-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    const sortField = e.currentTarget.dataset.sort;
                    const sortOrder = e.currentTarget.dataset.order;
                    this.sortServices(sortField, sortOrder);
                    sortMenu.classList.remove('show');
                    sortBtn.classList.remove('active');
                });
            });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (sortBtn && sortMenu && !sortBtn.contains(e.target) && !sortMenu.contains(e.target)) {
                sortMenu.classList.remove('show');
                sortBtn.classList.remove('active');
            }
        });
    }

    initializeBulkActions() {
        const bulkSelectBtn = document.getElementById('bulk-select-btn');
        const bulkActionsBar = document.getElementById('bulk-actions-bar');

        if (bulkSelectBtn) {
            bulkSelectBtn.addEventListener('click', () => {
                this.toggleBulkSelection();
            });
        }

        // Bulk action buttons
        document.getElementById('bulk-activate')?.addEventListener('click', () => {
            this.bulkActivateServices();
        });

        document.getElementById('bulk-deactivate')?.addEventListener('click', () => {
            this.bulkDeactivateServices();
        });

        document.getElementById('bulk-delete')?.addEventListener('click', () => {
            this.bulkDeleteServices();
        });

        document.getElementById('bulk-export')?.addEventListener('click', () => {
            this.bulkExportServices();
        });

        document.getElementById('bulk-cancel')?.addEventListener('click', () => {
            this.cancelBulkSelection();
        });
    }

    initializeAdvancedFilters() {
        const filterBtn = document.getElementById('advanced-filter-btn');
        const filterPanel = document.getElementById('advanced-filter-panel');

        if (filterBtn && filterPanel) {
            filterBtn.addEventListener('click', () => {
                filterPanel.classList.toggle('show');
            });
        }
    }

    handleItemSelection(serviceId, isSelected) {
        if (isSelected) {
            this.selectedItems.add(serviceId);
        } else {
            this.selectedItems.delete(serviceId);
        }

        this.updateSelectionUI();
    }

    updateSelectionUI() {
        const selectedCount = this.selectedItems.size;
        const selectionInfo = document.getElementById('selection-info');
        const selectedCountEl = document.getElementById('selected-count');
        const bulkActionsBar = document.getElementById('bulk-actions-bar');

        if (selectedCount > 0) {
            selectionInfo.style.display = 'inline';
            selectedCountEl.textContent = selectedCount;
            bulkActionsBar?.classList.add('show');
        } else {
            selectionInfo.style.display = 'none';
            bulkActionsBar?.classList.remove('show');
        }
    }

    updateResultsCount() {
        const resultsCount = document.getElementById('results-count');
        if (resultsCount) {
            resultsCount.textContent = `${this.filteredServices.length} services`;
        }
    }

    formatPrice(price) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: this.currentContext.currency
        }).format(price || 0);
    }

    sortServices(field, order) {
        this.filteredServices.sort((a, b) => {
            let aVal = a[field];
            let bVal = b[field];

            if (field === 'name') {
                const lang = this.currentContext.language;
                aVal = a.multiLingual[lang]?.name || a.name;
                bVal = b.multiLingual[lang]?.name || b.name;
            } else if (field === 'price') {
                aVal = a.pricing[this.currentContext.company]?.price || 0;
                bVal = b.pricing[this.currentContext.company]?.price || 0;
            }

            if (order === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

        this.renderCurrentView();
        this.showModernNotification(`Sorted by ${field} (${order})`, 'info', 2000);
    }

    toggleBulkSelection() {
        // Implementation for bulk selection toggle
        this.showModernNotification('Bulk selection mode activated', 'info', 2000);
    }

    bulkActivateServices() {
        const selectedServices = Array.from(this.selectedItems);
        selectedServices.forEach(id => {
            const service = this.services.find(s => s.id === parseInt(id));
            if (service) service.status = 'active';
        });
        this.renderCurrentView();
        this.showModernNotification(`Activated ${selectedServices.length} services`, 'success');
    }

    bulkDeactivateServices() {
        const selectedServices = Array.from(this.selectedItems);
        selectedServices.forEach(id => {
            const service = this.services.find(s => s.id === parseInt(id));
            if (service) service.status = 'inactive';
        });
        this.renderCurrentView();
        this.showModernNotification(`Deactivated ${selectedServices.length} services`, 'success');
    }

    bulkDeleteServices() {
        if (confirm(`Delete ${this.selectedItems.size} selected services?`)) {
            const selectedIds = Array.from(this.selectedItems);
            this.services = this.services.filter(s => !selectedIds.includes(s.id.toString()));
            this.selectedItems.clear();
            this.applyFilters();
            this.showModernNotification(`Deleted ${selectedIds.length} services`, 'success');
        }
    }

    bulkExportServices() {
        const selectedServices = this.services.filter(s => this.selectedItems.has(s.id.toString()));
        const dataToExport = {
            context: this.currentContext,
            services: selectedServices,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `selected_services_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showModernNotification(`Exported ${selectedServices.length} services`, 'success');
    }

    cancelBulkSelection() {
        this.selectedItems.clear();
        this.updateSelectionUI();
        // Uncheck all checkboxes
        document.querySelectorAll('input[type="checkbox"][data-service-id]').forEach(cb => {
            cb.checked = false;
        });
        this.showModernNotification('Bulk selection cancelled', 'info', 2000);
    }

    initializeTableSorting() {
        const sortableHeaders = document.querySelectorAll('.services-table th.sortable');
        sortableHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const sortField = header.dataset.sort;
                const currentOrder = header.dataset.currentOrder || 'asc';
                const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';

                // Update header
                header.dataset.currentOrder = newOrder;

                // Update sort icon
                const icon = header.querySelector('.sort-icon');
                icon.textContent = newOrder === 'asc' ? 'keyboard_arrow_up' : 'keyboard_arrow_down';

                // Sort services
                this.sortServices(sortField, newOrder);
            });
        });
    }

    // ========================================
    // TABLE COLUMN FILTERS & SORT FUNCTIONALITY
    // ========================================

    initializeTableColumnFilters() {
        console.log('Initializing table column filters and sort controls');

        // Initialize sort buttons
        this.initializeColumnSort();

        // Initialize filter buttons
        this.initializeColumnFilterButtons();

        // Initialize filter inputs
        this.initializeColumnFilterInputs();

        // Initialize clear filters button
        this.initializeClearFilters();

        // Store current filters and sort state
        this.tableFilters = {};
        this.tableSortState = { column: null, order: null };
    }

    initializeColumnSort() {
        const sortButtons = document.querySelectorAll('.sort-btn');

        sortButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const column = button.dataset.sort;
                const order = button.dataset.order;

                console.log('Sort clicked:', column, order);

                // Remove active class from all sort buttons
                document.querySelectorAll('.sort-btn').forEach(btn => {
                    btn.classList.remove('active');
                });

                // Add active class to clicked button
                button.classList.add('active');

                // Update sort state
                this.tableSortState = { column, order };

                // Apply sort
                this.applySortToTable(column, order);

                // Show notification
                this.showModernNotification(`Sorted by ${column} (${order === 'asc' ? 'A-Z' : 'Z-A'})`, 'success');
            });
        });
    }

    initializeColumnFilterButtons() {
        const filterButtons = document.querySelectorAll('.filter-btn');

        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const column = button.dataset.column;
                console.log('Filter button clicked:', column);

                // Toggle filter row visibility
                this.toggleFilterRow();

                // Toggle button active state
                button.classList.toggle('active');
            });
        });
    }

    initializeColumnFilterInputs() {
        const filterInputs = document.querySelectorAll('.column-filter');

        filterInputs.forEach(input => {
            // Add input event listener for real-time filtering
            input.addEventListener('input', (e) => {
                const column = input.dataset.column;
                const value = input.value.trim();

                console.log('Filter input changed:', column, value);

                // Update filter state
                if (value) {
                    this.tableFilters[column] = value;
                    input.classList.add('has-value');
                } else {
                    delete this.tableFilters[column];
                    input.classList.remove('has-value');
                }

                // Update filter button state
                this.updateFilterButtonState(column);

                // Apply filters with debounce
                clearTimeout(this.filterTimeout);
                this.filterTimeout = setTimeout(() => {
                    this.applyFiltersToTable();
                }, 300);
            });

            // Add change event for select elements
            input.addEventListener('change', (e) => {
                const column = input.dataset.column;
                const value = input.value;

                console.log('Filter select changed:', column, value);

                // Update filter state
                if (value) {
                    this.tableFilters[column] = value;
                    input.classList.add('has-value');
                } else {
                    delete this.tableFilters[column];
                    input.classList.remove('has-value');
                }

                // Update filter button state
                this.updateFilterButtonState(column);

                // Apply filters immediately for selects
                this.applyFiltersToTable();
            });
        });
    }

    initializeClearFilters() {
        const clearButton = document.querySelector('.clear-filters-btn');

        if (clearButton) {
            clearButton.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Clear filters clicked');

                // Clear all filter inputs
                document.querySelectorAll('.column-filter').forEach(input => {
                    input.value = '';
                    input.classList.remove('has-value');
                });

                // Clear filter state
                this.tableFilters = {};

                // Update all filter button states
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.remove('has-active-filter');
                });

                // Clear sort state
                document.querySelectorAll('.sort-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                this.tableSortState = { column: null, order: null };

                // Re-render table with original data
                this.renderTableView();

                // Show notification
                this.showModernNotification('All filters and sorting cleared', 'info');
            });
        }
    }

    toggleFilterRow() {
        const filterRow = document.getElementById('table-filter-row');

        if (filterRow) {
            if (filterRow.style.display === 'none') {
                filterRow.style.display = 'table-row';
                filterRow.classList.add('show');
                filterRow.classList.remove('hide');
            } else {
                filterRow.classList.add('hide');
                filterRow.classList.remove('show');
                setTimeout(() => {
                    filterRow.style.display = 'none';
                }, 300);
            }
        }
    }

    updateFilterButtonState(column) {
        const filterButton = document.querySelector(`.filter-btn[data-column="${column}"]`);

        if (filterButton) {
            if (this.tableFilters[column]) {
                filterButton.classList.add('has-active-filter');
            } else {
                filterButton.classList.remove('has-active-filter');
            }
        }
    }

    applySortToTable(column, order) {
        console.log('Applying sort to table:', column, order);

        // Get current filtered data or all data
        let dataToSort = this.getFilteredServicesForTable();

        // Sort the data
        dataToSort.sort((a, b) => {
            let aValue, bValue;

            // Map column names to service properties
            switch(column) {
                case 'name':
                    aValue = a.name;
                    bValue = b.name;
                    break;
                case 'code':
                    aValue = a.code;
                    bValue = b.code;
                    break;
                case 'category':
                    aValue = a.category;
                    bValue = b.category;
                    break;
                case 'price':
                    const aPricing = a.pricing[this.currentContext.company] || { price: a.listPrice };
                    const bPricing = b.pricing[this.currentContext.company] || { price: b.listPrice };
                    aValue = parseFloat(aPricing.price) || 0;
                    bValue = parseFloat(bPricing.price) || 0;
                    break;
                case 'status':
                    aValue = a.status;
                    bValue = b.status;
                    break;
                default:
                    aValue = a[column];
                    bValue = b[column];
            }

            // Handle different data types
            if (column === 'price') {
                // Already converted to numbers above
            } else {
                aValue = String(aValue).toLowerCase();
                bValue = String(bValue).toLowerCase();
            }

            if (order === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });

        // Re-render table with sorted data
        this.renderTableViewWithData(dataToSort);
    }

    applyFiltersToTable() {
        console.log('Applying filters to table:', this.tableFilters);

        // Get filtered data
        const filteredData = this.getFilteredServicesForTable();

        // Apply current sort if any
        if (this.tableSortState.column) {
            this.applySortToTable(this.tableSortState.column, this.tableSortState.order);
        } else {
            // Re-render table with filtered data
            this.renderTableViewWithData(filteredData);
        }

        // Show filter count
        const totalCount = this.filteredServices.length;
        const filteredCount = filteredData.length;

        if (filteredCount < totalCount) {
            this.showModernNotification(`Showing ${filteredCount} of ${totalCount} services`, 'info');
        }
    }

    getFilteredServicesForTable() {
        if (Object.keys(this.tableFilters).length === 0) {
            return [...this.filteredServices];
        }

        return this.filteredServices.filter(service => {
            return Object.entries(this.tableFilters).every(([column, filterValue]) => {
                let serviceValue;

                // Map column names to service properties
                switch(column) {
                    case 'name':
                        serviceValue = service.name;
                        break;
                    case 'code':
                        serviceValue = service.code;
                        break;
                    case 'category':
                        serviceValue = service.category;
                        break;
                    case 'price':
                        const pricing = service.pricing[this.currentContext.company] ||
                                       { price: service.listPrice };
                        serviceValue = pricing.price;
                        break;
                    case 'status':
                        serviceValue = service.status;
                        break;
                    default:
                        serviceValue = service[column];
                }

                const serviceStr = String(serviceValue).toLowerCase();
                const filter = String(filterValue).toLowerCase();

                // Handle different filter types
                if (column === 'price') {
                    const servicePrice = parseFloat(serviceValue) || 0;
                    const filterPrice = parseFloat(filterValue) || 0;
                    return servicePrice >= filterPrice;
                } else {
                    return serviceStr.includes(filter);
                }
            });
        });
    }

    renderTableViewWithData(data) {
        const tableBody = document.getElementById('services-table-body');
        if (!tableBody) return;

        tableBody.innerHTML = '';

        data.forEach(service => {
            const pricing = service.pricing[this.currentContext.company] ||
                           { price: service.listPrice, currency: this.currentContext.currency };

            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="select-column">
                    <label class="checkbox-container">
                        <input type="checkbox" class="service-checkbox" data-id="${service.id}">
                        <span class="checkmark"></span>
                    </label>
                </td>
                <td class="service-name">${service.name}</td>
                <td class="service-code">${service.code}</td>
                <td class="service-category">${service.category}</td>
                <td class="service-price">${pricing.currency} ${pricing.price}</td>
                <td class="service-status">
                    <span class="status-badge status-${service.status}">${service.status}</span>
                </td>
                <td class="actions-column">
                    <div class="table-actions">
                        <button class="action-btn view-btn-action" onclick="app.viewService(${service.id})" title="View">
                            <i class="material-icons">visibility</i>
                        </button>
                        <button class="action-btn edit-btn-action" onclick="app.editService(${service.id})" title="Edit">
                            <i class="material-icons">edit</i>
                        </button>
                        <button class="action-btn clone-btn-action" onclick="app.cloneService(${service.id})" title="Clone">
                            <i class="material-icons">content_copy</i>
                        </button>
                        <button class="action-btn deactivate-btn-action" onclick="app.toggleServiceStatus(${service.id})" title="Toggle Status">
                            <i class="material-icons">${service.status === 'active' ? 'pause' : 'play_arrow'}</i>
                        </button>
                        <button class="action-btn delete-btn-action" onclick="app.deleteService(${service.id})" title="Delete">
                            <i class="material-icons">delete</i>
                        </button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Re-initialize checkbox functionality
        this.initializeTableCheckboxes();
    }

    // ========================================
    // MENU SEARCH FUNCTIONALITY
    // ========================================

    initializeMenuSearch() {
        console.log('Initializing menu search functionality');

        // Initialize search data
        this.initializeSearchData();

        // Initialize search input
        this.initializeSearchInput();

        // Initialize advanced search
        this.initializeAdvancedSearchButton();

        // Initialize search help
        this.initializeSearchHelp();
    }

    initializeSearchData() {
        // Define all searchable menu items - prioritizing main navigation menus
        this.searchData = [
            // ========================================
            // MAIN NAVIGATION MENUS (Priority Items)
            // ========================================

            // Core Management Module
            { id: 'dashboard', title: 'Dashboard', description: 'Overview and analytics dashboard for automotive services', icon: 'dashboard', path: 'Core Management > Dashboard', section: 'dashboard', type: 'menu', priority: 1 },
            { id: 'service-types', title: 'Service Types', description: 'Manage automotive service types and configurations', icon: 'build', path: 'Core Management > Master > Service Types', section: 'services', type: 'menu', priority: 1 },
            { id: 'service-catalogs', title: 'Service Catalogs', description: 'Organize automotive services into catalogs by brand', icon: 'library_books', path: 'Core Management > Service Catalogs', section: 'catalogs', type: 'menu', priority: 1 },
            { id: 'service-bundles', title: 'Service Bundles', description: 'Create and manage automotive service packages', icon: 'inventory', path: 'Core Management > Service Bundles', section: 'bundles', type: 'menu', priority: 1 },
            { id: 'pricing-costing', title: 'Pricing & Costing', description: 'Multi-currency pricing and cost management', icon: 'monetization_on', path: 'Core Management > Pricing & Costing', section: 'pricing', type: 'menu', priority: 1 },

            // Analytics & Reporting Module
            { id: 'analytics', title: 'Analytics', description: 'Service performance and usage analytics', icon: 'analytics', path: 'Analytics & Reporting > Analytics', section: 'analytics', type: 'menu', priority: 1 },
            { id: 'reports', title: 'Reports', description: 'Generate detailed service reports', icon: 'assessment', path: 'Analytics & Reporting > Reports', section: 'reports', type: 'menu', priority: 1 },

            // Administration Module
            { id: 'settings', title: 'Settings', description: 'Application settings and preferences', icon: 'settings', path: 'Administration > Settings', section: 'settings', type: 'menu', priority: 1 },
            { id: 'access-control', title: 'Access Control', description: 'User roles and permissions management', icon: 'admin_panel_settings', path: 'Administration > Access Control', section: 'rbac', type: 'menu', priority: 1 },

            // ========================================
            // SUBMENU ITEMS (Secondary Priority)
            // ========================================

            // Service Management Submenus
            { id: 'maintenance-services', title: 'Maintenance Services', description: 'Vehicle maintenance and repair services', icon: 'build_circle', path: 'Service Types > Categories > Maintenance', section: 'services', type: 'submenu', priority: 2, filter: 'maintenance' },
            { id: 'diagnostic-services', title: 'Diagnostic Services', description: 'Engine and system diagnostic services', icon: 'troubleshoot', path: 'Service Types > Categories > Diagnostics', section: 'services', type: 'submenu', priority: 2, filter: 'diagnostics' },
            { id: 'inspection-services', title: 'Inspection Services', description: 'Vehicle inspection and testing services', icon: 'fact_check', path: 'Service Types > Categories > Inspection', section: 'services', type: 'submenu', priority: 2, filter: 'inspection' },
            { id: 'fleet-services', title: 'Fleet Management', description: 'Commercial fleet management services', icon: 'local_shipping', path: 'Service Types > Categories > Fleet', section: 'services', type: 'submenu', priority: 2, filter: 'fleet' },

            // Configuration Submenus
            { id: 'sla-templates', title: 'SLA Templates', description: 'Service level agreement templates', icon: 'schedule', path: 'Configuration > SLA Templates', section: 'sla', type: 'submenu', priority: 2 },
            { id: 'skills-resources', title: 'Skills & Resources', description: 'Required skills and resource management', icon: 'psychology', path: 'Configuration > Skills & Resources', section: 'skills', type: 'submenu', priority: 2 },
            { id: 'workflows', title: 'Workflows', description: 'Approval and business process workflows', icon: 'account_tree', path: 'Configuration > Workflows', section: 'workflows', type: 'submenu', priority: 2 },

            // Integration & Compliance Submenus
            { id: 'erp-integration', title: 'ERP Integration', description: 'Enterprise resource planning system integration', icon: 'integration_instructions', path: 'Integration > ERP Integration', section: 'integration', type: 'submenu', priority: 2 },
            { id: 'compliance', title: 'Compliance Management', description: 'Regulatory compliance and standards', icon: 'verified_user', path: 'Compliance > Management', section: 'compliance', type: 'submenu', priority: 2 },
            { id: 'audit-trails', title: 'Audit Trails', description: 'Change tracking and audit history', icon: 'history', path: 'Compliance > Audit Trails', section: 'audit', type: 'submenu', priority: 2 },

            // Advanced Analytics Submenus
            { id: 'ai-insights', title: 'AI Insights', description: 'AI-powered service recommendations', icon: 'psychology_alt', path: 'Analytics > AI Insights', section: 'ai-insights', type: 'submenu', priority: 2 },
            { id: 'cost-analysis', title: 'Cost Analysis', description: 'Service cost analysis and optimization', icon: 'trending_up', path: 'Analytics > Cost Analysis', section: 'cost-analysis', type: 'submenu', priority: 2 },
            { id: 'usage-analytics', title: 'Usage Analytics', description: 'Service usage patterns and trends', icon: 'insights', path: 'Analytics > Usage Analytics', section: 'usage-analytics', type: 'submenu', priority: 2 },

            // Service Actions
            { id: 'add-service', title: 'Add Service Type', description: 'Create a new service type', icon: 'add', path: 'Actions > Add Service Type', action: 'addService' },
            { id: 'import-services', title: 'Import Services', description: 'Import services from file', icon: 'upload', path: 'Actions > Import Services', action: 'importServices' },
            { id: 'export-services', title: 'Export Services', description: 'Export services to file', icon: 'download', path: 'Actions > Export Services', action: 'exportServices' },
            { id: 'bulk-actions', title: 'Bulk Actions', description: 'Perform actions on multiple services', icon: 'checklist', path: 'Actions > Bulk Actions', action: 'bulkActions' },

            // View Options
            { id: 'grid-view', title: 'Grid View', description: 'View services in grid layout', icon: 'grid_view', path: 'Views > Grid View', action: 'setGridView' },
            { id: 'list-view', title: 'List View', description: 'View services in list layout', icon: 'view_list', path: 'Views > List View', action: 'setListView' },
            { id: 'table-view', title: 'Table View', description: 'View services in table layout', icon: 'table_chart', path: 'Views > Table View', action: 'setTableView' },
            { id: 'kanban-view', title: 'Kanban View', description: 'View services in kanban layout', icon: 'view_kanban', path: 'Views > Kanban View', action: 'setKanbanView' },

            // Automotive Service Categories
            { id: 'maintenance-category', title: 'Maintenance & Repair', description: 'Vehicle maintenance and repair services', icon: 'build_circle', path: 'Services > Categories > Maintenance & Repair', action: 'filterByCategory', data: 'maintenance' },
            { id: 'inspection-category', title: 'Inspection & Testing', description: 'Vehicle inspection and testing services', icon: 'fact_check', path: 'Services > Categories > Inspection & Testing', action: 'filterByCategory', data: 'inspection' },
            { id: 'diagnostic-category', title: 'Diagnostics', description: 'Engine and system diagnostic services', icon: 'troubleshoot', path: 'Services > Categories > Diagnostics', action: 'filterByCategory', data: 'diagnostics' },
            { id: 'parts-category', title: 'Parts & Components', description: 'Replacement parts and component services', icon: 'precision_manufacturing', path: 'Services > Categories > Parts & Components', action: 'filterByCategory', data: 'parts' },
            { id: 'warranty-category', title: 'Warranty Services', description: 'Vehicle warranty and claim services', icon: 'verified', path: 'Services > Categories > Warranty Services', action: 'filterByCategory', data: 'warranty' },
            { id: 'fleet-category', title: 'Fleet Management', description: 'Commercial fleet management services', icon: 'local_shipping', path: 'Services > Categories > Fleet Management', action: 'filterByCategory', data: 'fleet' },

            // Specific Automotive Services
            { id: 'oil-change-service', title: 'Engine Oil Change', description: 'Complete engine oil and filter replacement service', icon: 'oil_barrel', path: 'Services > Maintenance > Engine Oil Change', action: 'viewService', data: 1 },
            { id: 'brake-service', title: 'Brake Pad Replacement', description: 'Complete brake pad replacement and inspection', icon: 'speed', path: 'Services > Maintenance > Brake Pad Replacement', action: 'viewService', data: 2 },
            { id: 'engine-diagnostics-service', title: 'Engine Diagnostics', description: 'Comprehensive engine diagnostic service', icon: 'computer', path: 'Services > Diagnostics > Engine Diagnostics', action: 'viewService', data: 3 },
            { id: 'tire-service', title: 'Tire Service & Rotation', description: 'Complete tire service and rotation', icon: 'tire_repair', path: 'Services > Maintenance > Tire Service & Rotation', action: 'viewService', data: 4 },
            { id: 'fleet-inspection-service', title: 'Fleet Vehicle Inspection', description: 'Multi-point inspection for fleet vehicles', icon: 'assignment_turned_in', path: 'Services > Inspection > Fleet Vehicle Inspection', action: 'viewService', data: 5 },

            // Automotive Brands
            { id: 'autopro-brand', title: 'AutoPro Brand', description: 'Switch to AutoPro service brand', icon: 'star', path: 'Brands > AutoPro', action: 'switchBrand', data: 'autopro' },
            { id: 'fleetmaster-brand', title: 'FleetMaster Brand', description: 'Switch to FleetMaster service brand', icon: 'local_shipping', path: 'Brands > FleetMaster', action: 'switchBrand', data: 'fleetmaster' },
            { id: 'vehiclecare-brand', title: 'VehicleCare Brand', description: 'Switch to VehicleCare service brand', icon: 'car_repair', path: 'Brands > VehicleCare', action: 'switchBrand', data: 'vehiclecare' },
            { id: 'assetguard-brand', title: 'AssetGuard Brand', description: 'Switch to AssetGuard service brand', icon: 'security', path: 'Brands > AssetGuard', action: 'switchBrand', data: 'assetguard' },

            // Company Locations
            { id: 'autoparts-usa', title: 'AutoParts USA', description: 'Switch to AutoParts USA location', icon: 'location_on', path: 'Company > AutoParts USA', action: 'switchCompany', data: 'usa' },
            { id: 'autoparts-europe', title: 'AutoParts Europe', description: 'Switch to AutoParts Europe location', icon: 'location_on', path: 'Company > AutoParts Europe', action: 'switchCompany', data: 'europe' },
            { id: 'autoparts-asia', title: 'AutoParts Asia', description: 'Switch to AutoParts Asia location', icon: 'location_on', path: 'Company > AutoParts Asia', action: 'switchCompany', data: 'asia' },

            // Quick Actions
            { id: 'add-oil-change', title: 'Add Oil Change Service', description: 'Quickly add a new oil change service', icon: 'add_circle', path: 'Quick Actions > Add Oil Change', action: 'addServiceTemplate', data: 'oil-change' },
            { id: 'add-brake-service', title: 'Add Brake Service', description: 'Quickly add a new brake service', icon: 'add_circle', path: 'Quick Actions > Add Brake Service', action: 'addServiceTemplate', data: 'brake-service' },
            { id: 'add-diagnostic-service', title: 'Add Diagnostic Service', description: 'Quickly add a new diagnostic service', icon: 'add_circle', path: 'Quick Actions > Add Diagnostic Service', action: 'addServiceTemplate', data: 'diagnostic' },

            // Filters & Status
            { id: 'filter-active', title: 'Active Services', description: 'Show only active services', icon: 'check_circle', path: 'Filters > Status > Active', action: 'filterByStatus', data: 'active' },
            { id: 'filter-inactive', title: 'Inactive Services', description: 'Show only inactive services', icon: 'cancel', path: 'Filters > Status > Inactive', action: 'filterByStatus', data: 'inactive' },
            { id: 'filter-draft', title: 'Draft Services', description: 'Show only draft services', icon: 'edit', path: 'Filters > Status > Draft', action: 'filterByStatus', data: 'draft' },
            { id: 'clear-filters', title: 'Clear All Filters', description: 'Remove all applied filters', icon: 'clear_all', path: 'Filters > Clear All', action: 'clearAllFilters' },

            // Settings & Configuration
            { id: 'theme-settings', title: 'Theme Settings', description: 'Change application theme and appearance', icon: 'palette', path: 'Settings > Themes', action: 'showThemeSelector' },
            { id: 'notification-settings', title: 'Notification Settings', description: 'Configure notification preferences', icon: 'notifications', path: 'Settings > Notifications', action: 'showNotificationSettings' },
            { id: 'user-profile', title: 'User Profile', description: 'Manage your user profile', icon: 'account_circle', path: 'Settings > User Profile', action: 'showUserProfile' }
        ];
    }

    initializeSearchInput() {
        const searchInput = document.getElementById('menu-search-input');
        const searchDropdown = document.getElementById('search-results-dropdown');

        if (!searchInput) return;

        // Initialize MDC text field
        const searchField = document.querySelector('.menu-search-field');
        if (searchField) {
            new mdc.textField.MDCTextField(searchField);
        }

        let searchTimeout;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();

            // Clear previous timeout
            clearTimeout(searchTimeout);

            if (query.length === 0) {
                this.hideSearchResults();
                return;
            }

            // Debounce search
            searchTimeout = setTimeout(() => {
                this.performSearch(query);
            }, 300);
        });

        // Hide results when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.menu-search-container')) {
                this.hideSearchResults();
            }
        });

        // Handle keyboard navigation
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideSearchResults();
                searchInput.blur();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateSearchResults('down');
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateSearchResults('up');
            } else if (e.key === 'Enter') {
                e.preventDefault();
                this.selectCurrentSearchResult();
            }
        });

        // Show suggestions on focus
        searchInput.addEventListener('focus', () => {
            if (searchInput.value.trim() === '') {
                this.showSearchSuggestions();
            }
        });

        // Add keyboard shortcut (Ctrl+K or Cmd+K) to focus search
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchInput.focus();
                searchInput.select();
            }
        });
    }

    performSearch(query) {
        console.log('Performing search for:', query);

        const queryLower = query.toLowerCase();

        // Filter and score results
        const results = this.searchData
            .filter(item => {
                const searchText = `${item.title} ${item.description} ${item.path}`.toLowerCase();
                return searchText.includes(queryLower);
            })
            .map(item => {
                // Calculate relevance score
                let score = 0;
                const titleLower = item.title.toLowerCase();
                const descLower = item.description.toLowerCase();
                const pathLower = item.path.toLowerCase();

                // Exact title match gets highest score
                if (titleLower === queryLower) score += 100;
                // Title starts with query
                else if (titleLower.startsWith(queryLower)) score += 80;
                // Title contains query
                else if (titleLower.includes(queryLower)) score += 60;
                // Description contains query
                else if (descLower.includes(queryLower)) score += 40;
                // Path contains query
                else if (pathLower.includes(queryLower)) score += 20;

                // Boost menu items (priority 1)
                if (item.priority === 1) score += 30;
                // Boost submenu items (priority 2)
                else if (item.priority === 2) score += 15;

                // Boost items with 'menu' type
                if (item.type === 'menu') score += 25;
                else if (item.type === 'submenu') score += 10;

                return { ...item, score };
            })
            .sort((a, b) => b.score - a.score); // Sort by score descending

        this.displaySearchResults(results, query);
    }

    displaySearchResults(results, query, isSuggestions = false) {
        const dropdown = document.getElementById('search-results-dropdown');
        const content = document.getElementById('search-results-content');
        const count = document.getElementById('search-results-count');

        if (!dropdown || !content || !count) return;

        // Update results count
        if (isSuggestions) {
            count.textContent = 'Popular suggestions';
        } else {
            count.textContent = `${results.length} result${results.length !== 1 ? 's' : ''}`;
        }

        // Clear previous results
        content.innerHTML = '';

        if (results.length === 0) {
            content.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">
                        <i class="material-icons">search_off</i>
                    </div>
                    <div class="no-results-title">No results found</div>
                    <div class="no-results-description">Try different keywords or check the spelling</div>
                </div>
            `;
        } else {
            results.slice(0, 8).forEach((result, index) => {
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                resultItem.dataset.index = index;

                // Add type-specific styling
                if (result.type === 'menu') {
                    resultItem.classList.add('menu-item');
                } else if (result.type === 'submenu') {
                    resultItem.classList.add('submenu-item');
                }

                // Create type badge
                let typeBadge = '';
                if (result.type === 'menu') {
                    typeBadge = '<span class="result-type-badge menu-badge">MENU</span>';
                } else if (result.type === 'submenu') {
                    typeBadge = '<span class="result-type-badge submenu-badge">SUBMENU</span>';
                } else if (result.action) {
                    typeBadge = '<span class="result-type-badge action-badge">ACTION</span>';
                }

                resultItem.innerHTML = `
                    <i class="material-icons search-result-icon">${result.icon}</i>
                    <div class="search-result-content">
                        <div class="search-result-header">
                            <div class="search-result-title">${this.highlightSearchTerm(result.title, query)}</div>
                            ${typeBadge}
                        </div>
                        <div class="search-result-description">${this.highlightSearchTerm(result.description, query)}</div>
                        <div class="search-result-path">${result.path}</div>
                    </div>
                `;

                resultItem.addEventListener('click', () => {
                    this.executeSearchResult(result);
                });

                content.appendChild(resultItem);
            });

            if (results.length > 8) {
                const moreResults = document.createElement('div');
                moreResults.className = 'search-result-item more-results';
                moreResults.innerHTML = `
                    <i class="material-icons search-result-icon">more_horiz</i>
                    <div class="search-result-content">
                        <div class="search-result-title">+${results.length - 8} more results</div>
                        <div class="search-result-description">Click to view all results</div>
                    </div>
                `;
                content.appendChild(moreResults);
            }
        }

        // Show dropdown
        dropdown.style.display = 'block';
        this.currentSearchResults = results;
        this.selectedResultIndex = -1;
    }

    highlightSearchTerm(text, term) {
        if (!term) return text;
        const regex = new RegExp(`(${term})`, 'gi');
        return text.replace(regex, '<mark style="background: #fff3cd; padding: 1px 2px; border-radius: 2px;">$1</mark>');
    }

    hideSearchResults() {
        const dropdown = document.getElementById('search-results-dropdown');
        if (dropdown) {
            dropdown.style.display = 'none';
        }
        this.currentSearchResults = [];
        this.selectedResultIndex = -1;
    }

    navigateSearchResults(direction) {
        if (!this.currentSearchResults || this.currentSearchResults.length === 0) return;

        const items = document.querySelectorAll('.search-result-item:not(.more-results)');

        // Remove previous selection
        items.forEach(item => item.classList.remove('selected'));

        if (direction === 'down') {
            this.selectedResultIndex = Math.min(this.selectedResultIndex + 1, items.length - 1);
        } else {
            this.selectedResultIndex = Math.max(this.selectedResultIndex - 1, -1);
        }

        // Highlight current selection
        if (this.selectedResultIndex >= 0 && items[this.selectedResultIndex]) {
            items[this.selectedResultIndex].classList.add('selected');
            items[this.selectedResultIndex].scrollIntoView({ block: 'nearest' });
        }
    }

    selectCurrentSearchResult() {
        if (this.selectedResultIndex >= 0 && this.currentSearchResults[this.selectedResultIndex]) {
            this.executeSearchResult(this.currentSearchResults[this.selectedResultIndex]);
        }
    }

    executeSearchResult(result) {
        console.log('Executing search result:', result);

        // Hide search results
        this.hideSearchResults();

        // Clear search input
        const searchInput = document.getElementById('menu-search-input');
        if (searchInput) {
            searchInput.value = '';
        }

        // Execute the action
        if (result.section) {
            // Navigate to section
            this.navigateToSection(result.section);
            this.showModernNotification(`Navigated to ${result.title}`, 'success');
        } else if (result.action) {
            // Execute action with data if available
            this.executeAction(result.action, result.data);
            this.showModernNotification(`Executed ${result.title}`, 'success');
        }
    }

    executeAction(action, data = null) {
        switch (action) {
            case 'addService':
                this.clearForm();
                this.renderOperationTable();
                if (this.dialog) {
                    this.dialog.open();
                }
                break;
            case 'importServices':
                this.importServices();
                break;
            case 'exportServices':
                this.exportServices();
                break;
            case 'bulkActions':
                this.showBulkActionsMenu();
                break;
            case 'setGridView':
                this.setView('grid');
                break;
            case 'setListView':
                this.setView('list');
                break;
            case 'setTableView':
                this.setView('table');
                break;
            case 'setKanbanView':
                this.setView('kanban');
                break;

            // Automotive-specific actions
            case 'filterByCategory':
                this.filterByCategory(data);
                break;
            case 'viewService':
                this.viewService(data);
                break;
            case 'switchBrand':
                this.switchBrand(data);
                break;
            case 'switchCompany':
                this.switchCompany(data);
                break;
            case 'addServiceTemplate':
                this.addServiceTemplate(data);
                break;
            case 'filterByStatus':
                this.filterByStatus(data);
                break;
            case 'clearAllFilters':
                this.clearAllFilters();
                break;
            case 'showThemeSelector':
                this.showThemeSelector();
                break;
            case 'showNotificationSettings':
                this.showNotificationSettings();
                break;
            case 'showUserProfile':
                this.showUserProfile();
                break;

            default:
                console.warn('Unknown action:', action);
        }
    }

    setView(viewType) {
        // Update view buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        const targetBtn = document.querySelector(`[data-view="${viewType}"]`);
        if (targetBtn) {
            targetBtn.classList.add('active');
        }

        // Update view content
        document.querySelectorAll('.view-content').forEach(content => {
            content.classList.remove('active');
        });

        const targetContent = document.getElementById(`services-${viewType === 'table' ? 'table-container' : viewType}`);
        if (targetContent) {
            targetContent.classList.add('active');
        }

        // Update current view and render
        this.currentView = viewType;
        this.renderCurrentView();
    }

    initializeAdvancedSearchButton() {
        const advancedBtn = document.getElementById('advanced-search-btn');

        if (advancedBtn) {
            advancedBtn.addEventListener('click', () => {
                this.showAdvancedSearchModal();
            });
        }
    }

    showAdvancedSearchModal() {
        // Create advanced search modal
        const modal = document.createElement('div');
        modal.className = 'advanced-search-modal-overlay';
        modal.innerHTML = `
            <div class="advanced-search-modal">
                <div class="modal-header">
                    <h2 class="modal-title">
                        <i class="material-icons">tune</i>
                        Advanced Search
                    </h2>
                    <button class="modal-close" onclick="this.closest('.advanced-search-modal-overlay').remove()">
                        <i class="material-icons">close</i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="search-categories">
                        <h3>Search Categories</h3>
                        <div class="category-filters">
                            <label class="category-filter">
                                <input type="checkbox" checked> Core Management
                            </label>
                            <label class="category-filter">
                                <input type="checkbox" checked> Configuration
                            </label>
                            <label class="category-filter">
                                <input type="checkbox" checked> Integration & Compliance
                            </label>
                            <label class="category-filter">
                                <input type="checkbox" checked> Analytics & Reporting
                            </label>
                            <label class="category-filter">
                                <input type="checkbox" checked> Administration
                            </label>
                            <label class="category-filter">
                                <input type="checkbox" checked> Actions
                            </label>
                        </div>
                    </div>
                    <div class="search-tips">
                        <h3>Search Tips</h3>
                        <ul>
                            <li>Use specific keywords for better results</li>
                            <li>Try searching for actions like "add", "import", "export"</li>
                            <li>Search for view types like "grid", "table", "kanban"</li>
                            <li>Use keyboard shortcuts: ↑↓ to navigate, Enter to select, Esc to close</li>
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="modal-btn modal-btn-secondary" onclick="this.closest('.advanced-search-modal-overlay').remove()">
                        Close
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Show modal with animation
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }

    initializeSearchHelp() {
        const helpBtn = document.getElementById('search-help-btn');

        if (helpBtn) {
            helpBtn.addEventListener('click', () => {
                this.showSearchHelp();
            });
        }
    }

    showSearchHelp() {
        this.showModernNotification('Search Help: Type menu names to navigate instantly. Use ↑↓ arrows to navigate, Enter to select, Esc to close. Press Ctrl+K to focus search.', 'info', 6000);
    }

    showSearchSuggestions() {
        // Show main menu suggestions when search field is focused
        const menuSuggestions = this.searchData
            .filter(item => item.type === 'menu' && item.priority === 1)
            .slice(0, 8); // Show top 8 main menu items

        this.displaySearchResults(menuSuggestions, '', true);
    }

    // ========================================
    // AUTOMOTIVE SEARCH ACTION METHODS
    // ========================================

    filterByCategory(category) {
        console.log('Filtering by category:', category);

        // Update the category filter dropdown
        const categorySelect = document.getElementById('category-filter');
        if (categorySelect) {
            categorySelect.value = category;
            // Trigger change event to update the filter
            categorySelect.dispatchEvent(new Event('change'));
        }

        // Apply the filter
        this.filters.category = category;
        this.applyFilters();
        this.renderServices();

        this.showModernNotification(`Filtered by category: ${category}`, 'success');
    }

    filterByStatus(status) {
        console.log('Filtering by status:', status);

        // Apply the status filter
        this.filters.status = status;
        this.applyFilters();
        this.renderServices();

        this.showModernNotification(`Showing ${status} services`, 'success');
    }

    clearAllFilters() {
        console.log('Clearing all filters');

        // Reset all filters
        this.filters = {
            category: '',
            status: '',
            search: ''
        };

        // Reset UI elements
        const categorySelect = document.getElementById('category-filter');
        if (categorySelect) {
            categorySelect.value = '';
        }

        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = '';
        }

        // Apply filters and re-render
        this.applyFilters();
        this.renderServices();

        this.showModernNotification('All filters cleared', 'success');
    }

    switchBrand(brandId) {
        console.log('Switching to brand:', brandId);

        // Update current context
        this.currentContext.brand = brandId;

        // Update brand selector if it exists
        const brandSelect = document.getElementById('brand-select');
        if (brandSelect) {
            brandSelect.value = brandId;
        }

        // Re-apply filters and render
        this.applyFilters();
        this.renderServices();
        this.updateDashboardStats();

        this.showModernNotification(`Switched to ${brandId} brand`, 'success');
    }

    switchCompany(companyId) {
        console.log('Switching to company:', companyId);

        // Update current context
        this.currentContext.company = companyId;

        // Update company selector if it exists
        const companySelect = document.getElementById('company-select');
        if (companySelect) {
            companySelect.value = companyId;
        }

        // Re-apply filters and render
        this.applyFilters();
        this.renderServices();
        this.updateDashboardStats();

        this.showModernNotification(`Switched to ${companyId} location`, 'success');
    }

    addServiceTemplate(templateType) {
        console.log('Adding service template:', templateType);

        // Clear the form first
        this.clearForm();

        // Pre-fill form based on template type
        switch (templateType) {
            case 'oil-change':
                this.prefillOilChangeTemplate();
                break;
            case 'brake-service':
                this.prefillBrakeServiceTemplate();
                break;
            case 'diagnostic':
                this.prefillDiagnosticTemplate();
                break;
            default:
                console.warn('Unknown template type:', templateType);
        }

        // Open the dialog
        if (this.dialog) {
            this.dialog.open();
        }

        this.showModernNotification(`${templateType} template loaded`, 'success');
    }

    prefillOilChangeTemplate() {
        // Pre-fill oil change service template
        const form = document.getElementById('service-form');
        if (form) {
            form.querySelector('#service-name').value = 'Engine Oil Change';
            form.querySelector('#service-code').value = 'ENG-OIL-' + Date.now().toString().slice(-3);
            form.querySelector('#service-description').value = 'Complete engine oil and filter replacement service';
            form.querySelector('#service-category').value = 'maintenance';
            form.querySelector('#unit-of-measure').value = 'service';
            form.querySelector('#standard-cost').value = '25.00';
            form.querySelector('#list-price').value = '45.00';
        }
    }

    prefillBrakeServiceTemplate() {
        // Pre-fill brake service template
        const form = document.getElementById('service-form');
        if (form) {
            form.querySelector('#service-name').value = 'Brake Pad Replacement';
            form.querySelector('#service-code').value = 'BRK-PAD-' + Date.now().toString().slice(-3);
            form.querySelector('#service-description').value = 'Complete brake pad replacement and inspection';
            form.querySelector('#service-category').value = 'maintenance';
            form.querySelector('#unit-of-measure').value = 'service';
            form.querySelector('#standard-cost').value = '85.00';
            form.querySelector('#list-price').value = '150.00';
        }
    }

    prefillDiagnosticTemplate() {
        // Pre-fill diagnostic service template
        const form = document.getElementById('service-form');
        if (form) {
            form.querySelector('#service-name').value = 'Engine Diagnostics';
            form.querySelector('#service-code').value = 'DIAG-ENG-' + Date.now().toString().slice(-3);
            form.querySelector('#service-description').value = 'Comprehensive engine diagnostic service';
            form.querySelector('#service-category').value = 'diagnostics';
            form.querySelector('#unit-of-measure').value = 'service';
            form.querySelector('#standard-cost').value = '120.00';
            form.querySelector('#list-price').value = '180.00';
        }
    }

    showThemeSelector() {
        console.log('Opening theme selector');
        // This will be implemented when theme system is added
        this.showModernNotification('Theme selector will be available soon', 'info');
    }

    showNotificationSettings() {
        console.log('Opening notification settings');
        this.showModernNotification('Notification settings will be available soon', 'info');
    }

    showUserProfile() {
        console.log('Opening user profile');
        this.showModernNotification('User profile will be available soon', 'info');
    }

    viewService(serviceId) {
        console.log('Viewing service:', serviceId);

        // Find the service by ID
        const service = this.services.find(s => s.id === serviceId);
        if (!service) {
            this.showModernNotification('Service not found', 'error');
            return;
        }

        // Show the service details modal
        this.showServiceModal(service, 'view');
        this.showModernNotification(`Viewing ${service.name}`, 'success');
    }

    // ========================================
    // SERVICE TEMPLATES FUNCTIONALITY
    // ========================================

    initializeServiceTemplates() {
        this.serviceTemplates = {
            automotive: [
                {
                    id: 'oil-change-template',
                    name: 'Engine Oil Change',
                    description: 'Complete engine oil and filter replacement service',
                    category: 'maintenance',
                    icon: 'oil_barrel',
                    price: '$45.00',
                    data: {
                        name: 'Engine Oil Change',
                        code: 'ENG-OIL-' + Date.now().toString().slice(-3),
                        description: 'Complete engine oil and filter replacement service',
                        category: 'maintenance',
                        unitOfMeasure: 'service',
                        standardCost: '25.00',
                        listPrice: '45.00',
                        operations: [
                            { code: 'DRAIN-OIL', description: 'Drain old engine oil' },
                            { code: 'REPLACE-FILTER', description: 'Replace oil filter' },
                            { code: 'ADD-OIL', description: 'Add new engine oil' },
                            { code: 'CHECK-LEVEL', description: 'Check oil level and quality' }
                        ]
                    }
                },
                {
                    id: 'brake-service-template',
                    name: 'Brake Pad Replacement',
                    description: 'Complete brake pad replacement and inspection',
                    category: 'maintenance',
                    icon: 'speed',
                    price: '$150.00',
                    data: {
                        name: 'Brake Pad Replacement',
                        code: 'BRK-PAD-' + Date.now().toString().slice(-3),
                        description: 'Complete brake pad replacement and inspection',
                        category: 'maintenance',
                        unitOfMeasure: 'service',
                        standardCost: '85.00',
                        listPrice: '150.00',
                        operations: [
                            { code: 'REMOVE-WHEEL', description: 'Remove wheel and tire' },
                            { code: 'INSPECT-BRAKE', description: 'Inspect brake system' },
                            { code: 'REPLACE-PADS', description: 'Replace brake pads' },
                            { code: 'TEST-BRAKES', description: 'Test brake functionality' }
                        ]
                    }
                }
            ],
            maintenance: [
                {
                    id: 'tire-rotation-template',
                    name: 'Tire Rotation Service',
                    description: 'Complete tire rotation and inspection',
                    category: 'maintenance',
                    icon: 'tire_repair',
                    price: '$35.00',
                    data: {
                        name: 'Tire Rotation Service',
                        code: 'TIRE-ROT-' + Date.now().toString().slice(-3),
                        description: 'Complete tire rotation and inspection',
                        category: 'maintenance',
                        unitOfMeasure: 'service',
                        standardCost: '20.00',
                        listPrice: '35.00'
                    }
                },
                {
                    id: 'air-filter-template',
                    name: 'Air Filter Replacement',
                    description: 'Engine air filter replacement service',
                    category: 'maintenance',
                    icon: 'air',
                    price: '$25.00',
                    data: {
                        name: 'Air Filter Replacement',
                        code: 'AIR-FLT-' + Date.now().toString().slice(-3),
                        description: 'Engine air filter replacement service',
                        category: 'maintenance',
                        unitOfMeasure: 'service',
                        standardCost: '15.00',
                        listPrice: '25.00'
                    }
                }
            ],
            diagnostics: [
                {
                    id: 'engine-diagnostic-template',
                    name: 'Engine Diagnostics',
                    description: 'Comprehensive engine diagnostic service',
                    category: 'diagnostics',
                    icon: 'computer',
                    price: '$180.00',
                    data: {
                        name: 'Engine Diagnostics',
                        code: 'DIAG-ENG-' + Date.now().toString().slice(-3),
                        description: 'Comprehensive engine diagnostic service',
                        category: 'diagnostics',
                        unitOfMeasure: 'service',
                        standardCost: '120.00',
                        listPrice: '180.00'
                    }
                },
                {
                    id: 'obd-scan-template',
                    name: 'OBD System Scan',
                    description: 'On-board diagnostics system scan',
                    category: 'diagnostics',
                    icon: 'scanner',
                    price: '$75.00',
                    data: {
                        name: 'OBD System Scan',
                        code: 'OBD-SCAN-' + Date.now().toString().slice(-3),
                        description: 'On-board diagnostics system scan',
                        category: 'diagnostics',
                        unitOfMeasure: 'service',
                        standardCost: '45.00',
                        listPrice: '75.00'
                    }
                }
            ],
            fleet: [
                {
                    id: 'fleet-inspection-template',
                    name: 'Fleet Vehicle Inspection',
                    description: 'Multi-point inspection for fleet vehicles',
                    category: 'inspection',
                    icon: 'assignment_turned_in',
                    price: '$140.00',
                    data: {
                        name: 'Fleet Vehicle Inspection',
                        code: 'FLT-INSP-' + Date.now().toString().slice(-3),
                        description: 'Multi-point inspection for fleet vehicles',
                        category: 'inspection',
                        unitOfMeasure: 'service',
                        standardCost: '90.00',
                        listPrice: '140.00'
                    }
                },
                {
                    id: 'fleet-maintenance-template',
                    name: 'Fleet Maintenance Package',
                    description: 'Comprehensive maintenance package for fleet vehicles',
                    category: 'maintenance',
                    icon: 'local_shipping',
                    price: '$250.00',
                    data: {
                        name: 'Fleet Maintenance Package',
                        code: 'FLT-MAINT-' + Date.now().toString().slice(-3),
                        description: 'Comprehensive maintenance package for fleet vehicles',
                        category: 'maintenance',
                        unitOfMeasure: 'service',
                        standardCost: '180.00',
                        listPrice: '250.00'
                    }
                }
            ]
        };
    }

    initializeTemplatesPanel() {
        const templatesBtn = document.getElementById('templates-btn');
        const templatesPanel = document.getElementById('templates-panel');
        const closePanelBtn = document.getElementById('close-templates-panel');
        const overlay = document.getElementById('templates-panel-overlay');

        if (templatesBtn) {
            templatesBtn.addEventListener('click', () => {
                this.showTemplatesPanel();
            });
        }

        if (closePanelBtn) {
            closePanelBtn.addEventListener('click', () => {
                this.hideTemplatesPanel();
            });
        }

        if (overlay) {
            overlay.addEventListener('click', () => {
                this.hideTemplatesPanel();
            });
        }

        // Initialize category switching
        this.initializeTemplateCategorySwitch();

        // Initialize templates drag and drop
        this.initializeTemplateDragDrop();

        // Render initial templates
        this.renderTemplates('automotive');
    }

    showTemplatesPanel() {
        const panel = document.getElementById('templates-panel');
        if (panel) {
            panel.classList.add('active');
            this.showModernNotification('Templates panel opened', 'info');
        }
    }

    hideTemplatesPanel() {
        const panel = document.getElementById('templates-panel');
        if (panel) {
            panel.classList.remove('active');
        }
    }

    initializeTemplateCategorySwitch() {
        const categories = document.querySelectorAll('.template-category');
        categories.forEach(category => {
            category.addEventListener('click', () => {
                // Remove active class from all categories
                categories.forEach(cat => cat.classList.remove('active'));
                // Add active class to clicked category
                category.classList.add('active');
                // Render templates for selected category
                const categoryType = category.dataset.category;
                this.renderTemplates(categoryType);
            });
        });
    }

    renderTemplates(category) {
        const templatesGrid = document.getElementById('templates-grid');
        if (!templatesGrid) return;

        const templates = this.serviceTemplates[category] || [];

        templatesGrid.innerHTML = '';

        templates.forEach(template => {
            const templateElement = this.createTemplateElement(template);
            templatesGrid.appendChild(templateElement);
        });
    }

    createTemplateElement(template) {
        const element = document.createElement('div');
        element.className = 'template-item';
        element.draggable = true;
        element.dataset.templateId = template.id;

        element.innerHTML = `
            <div class="template-header">
                <div class="template-icon">
                    <i class="material-icons">${template.icon}</i>
                </div>
                <h4 class="template-title">${template.name}</h4>
            </div>
            <p class="template-description">${template.description}</p>
            <div class="template-meta">
                <span class="template-category-badge">${template.category}</span>
                <span class="template-price">${template.price}</span>
            </div>
        `;

        // Add drag and drop functionality
        this.makeTemplateDraggable(element, template);

        // Add click functionality
        element.addEventListener('click', () => {
            this.useTemplate(template);
        });

        return element;
    }

    makeTemplateDraggable(element, template) {
        element.addEventListener('dragstart', (e) => {
            this.handleTemplateDragStart(e, template);
        });

        element.addEventListener('dragend', (e) => {
            this.handleTemplateDragEnd(e);
        });
    }

    handleTemplateDragStart(e, template) {
        this.dragState.isDragging = true;
        this.dragState.draggedElement = e.target;
        this.dragState.draggedData = template;
        this.dragState.dragType = 'template';

        e.dataTransfer.setData('text/plain', JSON.stringify({
            type: 'template',
            id: template.id,
            data: template
        }));

        e.dataTransfer.effectAllowed = 'copy';
        e.target.classList.add('dragging');

        // Show drop zones for templates
        this.showTemplateDropZones();

        console.log('Started dragging template:', template.name);
    }

    handleTemplateDragEnd(e) {
        this.dragState.isDragging = false;
        e.target.classList.remove('dragging');
        this.hideTemplateDropZones();
    }

    showTemplateDropZones() {
        const servicesContainer = document.getElementById('services-container');
        if (servicesContainer) {
            servicesContainer.classList.add('template-drop-zone');
            this.makeDropZone(servicesContainer, 'template-create', (dragData) => {
                this.createServiceFromTemplate(dragData.data);
            });
        }
    }

    hideTemplateDropZones() {
        const servicesContainer = document.getElementById('services-container');
        if (servicesContainer) {
            servicesContainer.classList.remove('template-drop-zone', 'drag-over');
        }
    }

    useTemplate(template) {
        this.createServiceFromTemplate(template);
        this.hideTemplatesPanel();
    }

    createServiceFromTemplate(template) {
        console.log('Creating service from template:', template.name);

        // Pre-fill the form with template data
        this.clearForm();
        this.prefillFormFromTemplate(template);

        // Open the service dialog
        if (this.dialog) {
            this.dialog.open();
        }

        this.showModernNotification(`Template "${template.name}" loaded`, 'success');
    }

    prefillFormFromTemplate(template) {
        const data = template.data;

        // Fill basic service information
        const nameField = document.getElementById('service-name');
        const codeField = document.getElementById('service-code');
        const descField = document.getElementById('service-description');
        const categoryField = document.getElementById('service-category');
        const uomField = document.getElementById('unit-of-measure');
        const costField = document.getElementById('standard-cost');
        const priceField = document.getElementById('list-price');

        if (nameField) nameField.value = data.name;
        if (codeField) codeField.value = data.code;
        if (descField) descField.value = data.description;
        if (categoryField) categoryField.value = data.category;
        if (uomField) uomField.value = data.unitOfMeasure;
        if (costField) costField.value = data.standardCost;
        if (priceField) priceField.value = data.listPrice;

        // Fill operations if they exist
        if (data.operations && data.operations.length > 0) {
            this.currentOperations = data.operations.map((op, index) => ({
                id: index + 1,
                code: op.code,
                description: op.description
            }));
            this.renderOperationTable();
        }
    }

    initializeTemplateDragDrop() {
        // Initialize drag and drop zones for templates
        this.initializeServicesContainerDropZone();
    }

    initializeServicesContainerDropZone() {
        const servicesContainer = document.getElementById('services-container');
        if (!servicesContainer) return;

        servicesContainer.addEventListener('dragover', (e) => {
            if (this.dragState.dragType === 'template') {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
                servicesContainer.classList.add('drag-over');
            }
        });

        servicesContainer.addEventListener('dragleave', (e) => {
            if (!servicesContainer.contains(e.relatedTarget)) {
                servicesContainer.classList.remove('drag-over');
            }
        });

        servicesContainer.addEventListener('drop', (e) => {
            if (this.dragState.dragType === 'template') {
                e.preventDefault();
                servicesContainer.classList.remove('drag-over');

                const dragData = JSON.parse(e.dataTransfer.getData('text/plain'));
                if (dragData.type === 'template') {
                    this.createServiceFromTemplate(dragData.data);
                }
            }
        });
    }

    // ========================================
    // DRAG AND DROP FUNCTIONALITY
    // ========================================

    initializeDragAndDrop() {
        console.log('Initializing drag and drop functionality');

        // Initialize different drag and drop contexts
        this.initializeServiceDragDrop();
        this.initializeKanbanDragDrop();
        this.initializeOperationDragDrop();
        this.initializeFileDragDrop();
        this.initializeBulkDragDrop();

        // Store drag state
        this.dragState = {
            isDragging: false,
            draggedElement: null,
            draggedData: null,
            dropZones: [],
            dragType: null
        };
    }

    initializeServiceDragDrop() {
        // Enable drag and drop for service cards in grid view
        this.enableServiceCardDrag();

        // Enable drag and drop for list items
        this.enableServiceListDrag();

        // Enable drag and drop for table rows
        this.enableServiceTableDrag();
    }

    enableServiceCardDrag() {
        // This will be called when rendering grid items
        // Implementation in renderGridItem method
    }

    enableServiceListDrag() {
        // This will be called when rendering list items
        // Implementation in renderListItem method
    }

    enableServiceTableDrag() {
        // This will be called when rendering table rows
        // Implementation in renderTableView method
    }

    initializeKanbanDragDrop() {
        // Enable drag and drop between kanban columns
        const kanbanColumns = document.querySelectorAll('.kanban-column');

        kanbanColumns.forEach(column => {
            this.makeDropZone(column, 'kanban-status-change');
        });
    }

    initializeOperationDragDrop() {
        // Enable drag and drop for operations in the operations table
        const operationsTable = document.getElementById('operations-table-body');
        if (operationsTable) {
            this.enableOperationReordering(operationsTable);
        }
    }

    initializeFileDragDrop() {
        // Enable file drag and drop for import functionality
        this.createFileDropZone();
    }

    initializeBulkDragDrop() {
        // Enable bulk drag and drop operations
        this.createBulkDropZones();
    }

    // ========================================
    // SERVICE DRAG AND DROP IMPLEMENTATION
    // ========================================

    makeServiceDraggable(element, service) {
        element.draggable = true;
        element.classList.add('draggable-service');

        element.addEventListener('dragstart', (e) => {
            this.handleServiceDragStart(e, service);
        });

        element.addEventListener('dragend', (e) => {
            this.handleServiceDragEnd(e);
        });
    }

    handleServiceDragStart(e, service) {
        this.dragState.isDragging = true;
        this.dragState.draggedElement = e.target;
        this.dragState.draggedData = service;
        this.dragState.dragType = 'service';

        // Set drag data
        e.dataTransfer.setData('text/plain', JSON.stringify({
            type: 'service',
            id: service.id,
            data: service
        }));

        e.dataTransfer.effectAllowed = 'move';

        // Add visual feedback
        e.target.classList.add('dragging');

        // Show drop zones
        this.showDropZones('service');

        // Create drag preview
        this.createDragPreview(e, service);

        console.log('Started dragging service:', service.name);
    }

    handleServiceDragEnd(e) {
        this.dragState.isDragging = false;
        this.dragState.draggedElement = null;
        this.dragState.draggedData = null;
        this.dragState.dragType = null;

        // Remove visual feedback
        e.target.classList.remove('dragging');

        // Hide drop zones
        this.hideDropZones();

        // Remove drag preview
        this.removeDragPreview();

        console.log('Ended dragging service');
    }

    createDragPreview(e, service) {
        const preview = document.createElement('div');
        preview.id = 'drag-preview';
        preview.className = 'drag-preview';
        preview.innerHTML = `
            <div class="drag-preview-content">
                <i class="material-icons">drag_indicator</i>
                <span class="drag-preview-title">${service.name}</span>
                <span class="drag-preview-subtitle">${service.code}</span>
            </div>
        `;

        document.body.appendChild(preview);

        // Position the preview
        const rect = e.target.getBoundingClientRect();
        preview.style.left = rect.left + 'px';
        preview.style.top = rect.top + 'px';
    }

    removeDragPreview() {
        const preview = document.getElementById('drag-preview');
        if (preview) {
            preview.remove();
        }
    }

    // ========================================
    // DROP ZONE MANAGEMENT
    // ========================================

    makeDropZone(element, dropType, callback) {
        element.classList.add('drop-zone');
        element.dataset.dropType = dropType;

        element.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            element.classList.add('drag-over');
        });

        element.addEventListener('dragleave', (e) => {
            if (!element.contains(e.relatedTarget)) {
                element.classList.remove('drag-over');
            }
        });

        element.addEventListener('drop', (e) => {
            e.preventDefault();
            element.classList.remove('drag-over');

            const dragData = JSON.parse(e.dataTransfer.getData('text/plain'));
            this.handleDrop(dragData, dropType, element, callback);
        });
    }

    handleDrop(dragData, dropType, dropElement, callback) {
        console.log('Drop detected:', dropType, dragData);

        switch (dropType) {
            case 'kanban-status-change':
                this.handleKanbanStatusDrop(dragData, dropElement);
                break;
            case 'bulk-action':
                this.handleBulkActionDrop(dragData, dropElement);
                break;
            case 'file-import':
                this.handleFileImportDrop(dragData, dropElement);
                break;
            case 'operation-reorder':
                this.handleOperationReorderDrop(dragData, dropElement);
                break;
            default:
                if (callback) {
                    callback(dragData, dropElement);
                }
        }
    }

    showDropZones(dragType) {
        const dropZones = document.querySelectorAll('.drop-zone');
        dropZones.forEach(zone => {
            if (this.isValidDropZone(zone, dragType)) {
                zone.classList.add('drop-zone-active');
            }
        });

        // Show specific drop zones based on drag type
        if (dragType === 'service') {
            this.showServiceDropZones();
        }
    }

    hideDropZones() {
        const dropZones = document.querySelectorAll('.drop-zone');
        dropZones.forEach(zone => {
            zone.classList.remove('drop-zone-active', 'drag-over');
        });
    }

    isValidDropZone(zone, dragType) {
        const zoneType = zone.dataset.dropType;

        // Define valid combinations
        const validCombinations = {
            'service': ['kanban-status-change', 'bulk-action'],
            'operation': ['operation-reorder'],
            'file': ['file-import']
        };

        return validCombinations[dragType]?.includes(zoneType);
    }

    showServiceDropZones() {
        // Show kanban columns as drop zones
        const kanbanColumns = document.querySelectorAll('.kanban-column');
        kanbanColumns.forEach(column => {
            column.classList.add('service-drop-zone');
        });

        // Show bulk action areas
        this.createTemporaryBulkDropZones();
    }

    createTemporaryBulkDropZones() {
        // Create temporary drop zones for bulk actions
        const bulkZone = document.createElement('div');
        bulkZone.id = 'temp-bulk-drop-zone';
        bulkZone.className = 'temp-drop-zone bulk-drop-zone';
        bulkZone.innerHTML = `
            <div class="drop-zone-content">
                <i class="material-icons">checklist</i>
                <span>Drop here for bulk actions</span>
            </div>
        `;

        this.makeDropZone(bulkZone, 'bulk-action');
        document.body.appendChild(bulkZone);

        // Position it
        bulkZone.style.position = 'fixed';
        bulkZone.style.top = '20px';
        bulkZone.style.right = '20px';
        bulkZone.style.zIndex = '10000';
    }

    // ========================================
    // KANBAN DRAG AND DROP
    // ========================================

    handleKanbanStatusDrop(dragData, dropElement) {
        if (dragData.type !== 'service') return;

        const service = this.services.find(s => s.id === dragData.id);
        if (!service) return;

        const newStatus = dropElement.dataset.status;
        const oldStatus = service.status;

        if (newStatus === oldStatus) return;

        // Update service status
        service.status = newStatus;

        // Add audit trail
        service.auditTrail.push({
            action: 'status_changed',
            user: 'current-user@example.com',
            timestamp: new Date(),
            details: `Status changed from ${oldStatus} to ${newStatus} via drag and drop`
        });

        // Re-render views
        this.renderCurrentView();

        // Show success notification
        this.showModernNotification(
            `${service.name} moved to ${newStatus}`,
            'success'
        );

        console.log(`Service ${service.name} status changed to ${newStatus}`);
    }

    // ========================================
    // OPERATION DRAG AND DROP
    // ========================================

    enableOperationReordering(tableBody) {
        this.makeDropZone(tableBody, 'operation-reorder');

        // Make operation rows draggable
        const updateOperationRows = () => {
            const rows = tableBody.querySelectorAll('tr');
            rows.forEach((row, index) => {
                this.makeOperationRowDraggable(row, index);
            });
        };

        // Update when operations change
        const observer = new MutationObserver(updateOperationRows);
        observer.observe(tableBody, { childList: true });

        updateOperationRows();
    }

    makeOperationRowDraggable(row, index) {
        row.draggable = true;
        row.classList.add('draggable-operation');
        row.dataset.operationIndex = index;

        row.addEventListener('dragstart', (e) => {
            this.handleOperationDragStart(e, index);
        });

        row.addEventListener('dragend', (e) => {
            this.handleOperationDragEnd(e);
        });
    }

    handleOperationDragStart(e, index) {
        this.dragState.isDragging = true;
        this.dragState.draggedElement = e.target;
        this.dragState.draggedData = { index, operation: this.currentOperations[index] };
        this.dragState.dragType = 'operation';

        e.dataTransfer.setData('text/plain', JSON.stringify({
            type: 'operation',
            index: index,
            operation: this.currentOperations[index]
        }));

        e.target.classList.add('dragging');
    }

    handleOperationDragEnd(e) {
        this.dragState.isDragging = false;
        e.target.classList.remove('dragging');
    }

    handleOperationReorderDrop(dragData, dropElement) {
        if (dragData.type !== 'operation') return;

        const draggedIndex = dragData.index;
        const targetRow = event.target.closest('tr');

        if (!targetRow) return;

        const targetIndex = parseInt(targetRow.dataset.operationIndex);

        if (draggedIndex === targetIndex) return;

        // Reorder operations
        const draggedOperation = this.currentOperations.splice(draggedIndex, 1)[0];
        this.currentOperations.splice(targetIndex, 0, draggedOperation);

        // Re-render operations table
        this.renderOperationTable();

        this.showModernNotification('Operation order updated', 'success');
    }

    // ========================================
    // FILE DRAG AND DROP
    // ========================================

    createFileDropZone() {
        // Create a global file drop zone
        const fileDropZone = document.createElement('div');
        fileDropZone.id = 'file-drop-zone';
        fileDropZone.className = 'file-drop-zone hidden';
        fileDropZone.innerHTML = `
            <div class="file-drop-content">
                <i class="material-icons">cloud_upload</i>
                <h3>Drop files to import</h3>
                <p>Supported formats: CSV, JSON, Excel</p>
            </div>
        `;

        document.body.appendChild(fileDropZone);

        // Global drag events
        document.addEventListener('dragenter', (e) => {
            if (this.hasFiles(e)) {
                e.preventDefault();
                fileDropZone.classList.remove('hidden');
            }
        });

        document.addEventListener('dragleave', (e) => {
            if (!document.body.contains(e.relatedTarget)) {
                fileDropZone.classList.add('hidden');
            }
        });

        document.addEventListener('dragover', (e) => {
            if (this.hasFiles(e)) {
                e.preventDefault();
            }
        });

        document.addEventListener('drop', (e) => {
            if (this.hasFiles(e)) {
                e.preventDefault();
                fileDropZone.classList.add('hidden');
                this.handleFilesDrop(e.dataTransfer.files);
            }
        });
    }

    hasFiles(e) {
        return e.dataTransfer.types.includes('Files');
    }

    handleFilesDrop(files) {
        console.log('Files dropped:', files);

        Array.from(files).forEach(file => {
            console.log('Processing file:', file.name, file.type);

            if (file.type === 'application/json' || file.name.endsWith('.json')) {
                this.handleJSONImport(file);
            } else if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
                this.handleCSVImport(file);
            } else if (file.type.includes('sheet') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
                this.handleExcelImport(file);
            } else {
                this.showModernNotification(`Unsupported file type: ${file.name}`, 'error');
            }
        });
    }

    handleJSONImport(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                this.importServicesFromData(data, 'JSON');
            } catch (error) {
                this.showModernNotification('Invalid JSON file format', 'error');
            }
        };
        reader.readAsText(file);
    }

    handleCSVImport(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const csv = e.target.result;
                const data = this.parseCSV(csv);
                this.importServicesFromData(data, 'CSV');
            } catch (error) {
                this.showModernNotification('Invalid CSV file format', 'error');
            }
        };
        reader.readAsText(file);
    }

    handleExcelImport(file) {
        this.showModernNotification('Excel import will be available soon', 'info');
    }

    parseCSV(csv) {
        const lines = csv.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
                const values = lines[i].split(',').map(v => v.trim());
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = values[index] || '';
                });
                data.push(row);
            }
        }

        return data;
    }

    importServicesFromData(data, format) {
        let imported = 0;
        let errors = 0;

        data.forEach(item => {
            try {
                const service = this.createServiceFromImportData(item);
                if (service) {
                    this.services.push(service);
                    imported++;
                }
            } catch (error) {
                console.error('Error importing service:', error);
                errors++;
            }
        });

        this.renderServices();
        this.updateDashboardStats();

        if (imported > 0) {
            this.showModernNotification(
                `Successfully imported ${imported} service${imported !== 1 ? 's' : ''} from ${format}`,
                'success'
            );
        }

        if (errors > 0) {
            this.showModernNotification(
                `${errors} service${errors !== 1 ? 's' : ''} failed to import`,
                'warning'
            );
        }
    }

    createServiceFromImportData(data) {
        // Map common field names
        const fieldMap = {
            'name': ['name', 'serviceName', 'service_name', 'title'],
            'code': ['code', 'serviceCode', 'service_code', 'id'],
            'description': ['description', 'desc', 'details'],
            'category': ['category', 'type', 'serviceType'],
            'price': ['price', 'cost', 'amount', 'listPrice'],
            'status': ['status', 'state', 'active']
        };

        const service = {
            id: Math.max(0, ...this.services.map(s => s.id)) + 1,
            name: this.findFieldValue(data, fieldMap.name) || 'Imported Service',
            code: this.findFieldValue(data, fieldMap.code) || `IMP-${Date.now()}`,
            description: this.findFieldValue(data, fieldMap.description) || '',
            category: this.findFieldValue(data, fieldMap.category) || 'general',
            status: this.findFieldValue(data, fieldMap.status) || 'active',
            unitOfMeasure: 'service',
            standardCost: parseFloat(this.findFieldValue(data, fieldMap.price)) || 0,
            listPrice: parseFloat(this.findFieldValue(data, fieldMap.price)) || 0,
            multiLingual: {
                en: {
                    name: this.findFieldValue(data, fieldMap.name) || 'Imported Service',
                    description: this.findFieldValue(data, fieldMap.description) || ''
                }
            },
            pricing: {
                [this.currentContext.company]: {
                    cost: parseFloat(this.findFieldValue(data, fieldMap.price)) || 0,
                    price: parseFloat(this.findFieldValue(data, fieldMap.price)) || 0,
                    currency: this.currentContext.currency
                }
            },
            auditTrail: [{
                action: 'imported',
                user: 'system',
                timestamp: new Date(),
                details: 'Service imported via drag and drop'
            }]
        };

        return service;
    }

    findFieldValue(data, possibleFields) {
        for (const field of possibleFields) {
            if (data[field] !== undefined && data[field] !== null && data[field] !== '') {
                return data[field];
            }
        }
        return null;
    }

    // ========================================
    // QUICK SERVICE TYPES FUNCTIONALITY
    // ========================================

    initializeQuickServiceTypes() {
        console.log('Initializing Quick Service Types functionality');

        // Initialize click handlers
        this.initializeQuickTypeClickHandlers();

        // Initialize drag and drop for quick types
        this.initializeQuickTypeDragDrop();

        // Initialize form drop zones
        this.initializeFormDropZones();
    }

    initializeQuickTypeClickHandlers() {
        const warrantyBtn = document.getElementById('warranty-claim-btn');
        const mandatoryBtn = document.getElementById('mandatory-claim-btn');

        if (warrantyBtn) {
            warrantyBtn.addEventListener('click', () => {
                this.applyWarrantyClaimTemplate();
            });
        }

        if (mandatoryBtn) {
            mandatoryBtn.addEventListener('click', () => {
                this.applyMandatoryClaimTemplate();
            });
        }
    }

    initializeQuickTypeDragDrop() {
        const warrantyBtn = document.getElementById('warranty-claim-btn');
        const mandatoryBtn = document.getElementById('mandatory-claim-btn');

        if (warrantyBtn) {
            this.makeQuickTypeDraggable(warrantyBtn, 'warranty');
        }

        if (mandatoryBtn) {
            this.makeQuickTypeDraggable(mandatoryBtn, 'mandatory');
        }
    }

    makeQuickTypeDraggable(element, type) {
        element.addEventListener('dragstart', (e) => {
            this.handleQuickTypeDragStart(e, type);
        });

        element.addEventListener('dragend', (e) => {
            this.handleQuickTypeDragEnd(e);
        });
    }

    handleQuickTypeDragStart(e, type) {
        console.log('=== DRAG START ===');
        console.log('Drag type:', type);

        this.dragState.isDragging = true;
        this.dragState.draggedElement = e.target;
        this.dragState.draggedData = { type: type };
        this.dragState.dragType = 'quick-service-type';

        const dragData = {
            type: 'quick-service-type',
            serviceType: type
        };

        console.log('Setting drag data:', dragData);
        e.dataTransfer.setData('text/plain', JSON.stringify(dragData));
        e.dataTransfer.effectAllowed = 'copy';
        e.target.classList.add('dragging');

        // Show form drop zones
        this.showFormDropZones(type);

        console.log('Started dragging quick service type:', type);
        console.log('Drag state:', this.dragState);
    }

    handleQuickTypeDragEnd(e) {
        this.dragState.isDragging = false;
        e.target.classList.remove('dragging');
        this.hideFormDropZones();
    }

    initializeFormDropZones() {
        const serviceForm = document.getElementById('service-form');
        if (!serviceForm) return;

        // Make the entire form a drop zone
        serviceForm.addEventListener('dragover', (e) => {
            if (this.dragState.dragType === 'quick-service-type') {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
                this.highlightFormDropZone(e, true);
            }
        });

        serviceForm.addEventListener('dragleave', (e) => {
            if (this.dragState.dragType === 'quick-service-type') {
                this.highlightFormDropZone(e, false);
            }
        });

        serviceForm.addEventListener('drop', (e) => {
            if (this.dragState.dragType === 'quick-service-type') {
                e.preventDefault();
                this.highlightFormDropZone(e, false);

                console.log('Drop event triggered!');
                console.log('DataTransfer data:', e.dataTransfer.getData('text/plain'));

                try {
                    const dragData = JSON.parse(e.dataTransfer.getData('text/plain'));
                    console.log('Parsed drag data:', dragData);

                    if (dragData.type === 'quick-service-type') {
                        console.log('Applying quick service type:', dragData.serviceType);
                        this.applyQuickServiceType(dragData.serviceType);
                    }
                } catch (error) {
                    console.error('Error parsing drag data:', error);
                    // Fallback: use the draggedData from dragState
                    if (this.dragState.draggedData && this.dragState.draggedData.type) {
                        console.log('Using fallback dragState data:', this.dragState.draggedData);
                        this.applyQuickServiceType(this.dragState.draggedData.type);
                    }
                }
            }
        });
    }

    showFormDropZones(type) {
        const serviceForm = document.getElementById('service-form');
        const instructions = document.getElementById('drag-drop-instructions');

        if (serviceForm) {
            serviceForm.classList.add('form-drop-zone', 'show-hint');
            if (type === 'warranty') {
                serviceForm.classList.add('warranty-drop');
            } else if (type === 'mandatory') {
                serviceForm.classList.add('mandatory-drop');
            }
        }

        if (instructions) {
            instructions.classList.add('highlight');
        }
    }

    hideFormDropZones() {
        const serviceForm = document.getElementById('service-form');
        const instructions = document.getElementById('drag-drop-instructions');

        if (serviceForm) {
            serviceForm.classList.remove('form-drop-zone', 'warranty-drop', 'mandatory-drop', 'drag-over', 'show-hint');
        }

        if (instructions) {
            instructions.classList.remove('highlight');
        }
    }

    highlightFormDropZone(e, highlight) {
        const serviceForm = document.getElementById('service-form');
        if (serviceForm) {
            if (highlight) {
                serviceForm.classList.add('drag-over');
            } else {
                serviceForm.classList.remove('drag-over');
            }
        }
    }

    applyQuickServiceType(type) {
        console.log(`=== APPLYING QUICK SERVICE TYPE: ${type} ===`);

        if (type === 'warranty') {
            console.log('Calling applyWarrantyClaimTemplate...');
            this.applyWarrantyClaimTemplate();
        } else if (type === 'mandatory') {
            console.log('Calling applyMandatoryClaimTemplate...');
            this.applyMandatoryClaimTemplate();
        } else {
            console.error('Unknown service type:', type);
        }
    }

    applyWarrantyClaimTemplate() {
        console.log('Applying Warranty Claim template');

        // Generate unique code
        const timestamp = Date.now().toString().slice(-4);

        // Fill form fields
        this.fillFormField('service-code', `WARRANTY-${timestamp}`);
        this.fillFormField('service-name', 'Warranty Claim Service');
        this.fillFormField('service-description', 'Comprehensive warranty claim processing service for covered vehicle components and systems. Includes claim validation, parts verification, labor assessment, and documentation processing.');

        // Set category to repair (most appropriate for warranty claims)
        this.setSelectValue('service-category', 'repair');

        // Set unit of measure
        this.setSelectValue('unit-of-measure', 'service');

        // Set pricing
        this.fillFormField('standard-cost', '0.00');
        this.fillFormField('list-price', '0.00');

        // Set GL Account and Tax Code
        this.fillFormField('gl-account', '4000-WARRANTY');
        this.fillFormField('tax-code', 'WARRANTY-EXEMPT');

        // Check warranty checkbox
        this.setCheckboxValue('is-warranty', true);

        // Set other relevant checkboxes
        this.setCheckboxValue('is-active', true);
        this.setCheckboxValue('is-consider-for-demand', false);

        // Set service due information
        this.fillFormField('service-due-days', '365');
        this.fillFormField('service-due-reading', '12000');

        // Add warranty-specific operations
        this.currentOperations = [
            { id: 1, code: 'CLAIM-VALIDATE', description: 'Validate warranty claim eligibility' },
            { id: 2, code: 'PARTS-VERIFY', description: 'Verify covered parts and components' },
            { id: 3, code: 'LABOR-ASSESS', description: 'Assess labor requirements and coverage' },
            { id: 4, code: 'DOC-PROCESS', description: 'Process warranty documentation' },
            { id: 5, code: 'CLAIM-APPROVE', description: 'Approve or deny warranty claim' }
        ];

        this.renderOperationTable();

        // Show detailed success notification
        this.showModernNotification('✅ Warranty Claim template applied! Warranty checkbox checked, operations added, and form auto-filled.', 'success');

        // Add visual feedback
        this.addQuickFillAnimation();
    }

    applyMandatoryClaimTemplate() {
        console.log('Applying Mandatory Claim template');

        // Generate unique code
        const timestamp = Date.now().toString().slice(-4);

        // Fill form fields
        this.fillFormField('service-code', `MANDATORY-${timestamp}`);
        this.fillFormField('service-name', 'Mandatory Service Claim');
        this.fillFormField('service-description', 'Essential mandatory service required for vehicle safety, compliance, and regulatory requirements. Critical service that must be performed according to manufacturer specifications.');

        // Set category to maintenance (most appropriate for mandatory services)
        this.setSelectValue('service-category', 'maintenance');

        // Set unit of measure
        this.setSelectValue('unit-of-measure', 'service');

        // Set pricing
        this.fillFormField('standard-cost', '150.00');
        this.fillFormField('list-price', '225.00');

        // Set GL Account and Tax Code
        this.fillFormField('gl-account', '4000-MANDATORY');
        this.fillFormField('tax-code', 'SRV-STD');

        // Check mandatory checkbox
        this.setCheckboxValue('is-mandatory', true);

        // Set other relevant checkboxes
        this.setCheckboxValue('is-active', true);
        this.setCheckboxValue('is-consider-for-demand', true);

        // Set service due information (more frequent for mandatory services)
        this.fillFormField('service-due-days', '90');
        this.fillFormField('service-due-reading', '5000');

        // Add mandatory-specific operations
        this.currentOperations = [
            { id: 1, code: 'COMPLIANCE-CHECK', description: 'Verify regulatory compliance requirements' },
            { id: 2, code: 'SAFETY-INSPECT', description: 'Perform mandatory safety inspection' },
            { id: 3, code: 'SYSTEM-TEST', description: 'Test critical vehicle systems' },
            { id: 4, code: 'CERT-ISSUE', description: 'Issue compliance certification' },
            { id: 5, code: 'RECORD-UPDATE', description: 'Update mandatory service records' }
        ];

        this.renderOperationTable();

        // Show detailed success notification
        this.showModernNotification('✅ Mandatory Claim template applied! Mandatory checkbox checked, operations added, and form auto-filled.', 'success');

        // Add visual feedback
        this.addQuickFillAnimation();
    }

    fillFormField(fieldId, value) {
        console.log(`=== FILLING FIELD ${fieldId} with value: ${value} ===`);

        const field = document.getElementById(fieldId);
        if (field) {
            console.log('Field element found:', field);

            // Check if it's an MDC text field
            const mdcTextField = field.closest('.mdc-text-field');
            if (mdcTextField) {
                // Use the new MDC field value setter
                this.setMDCFieldValue(fieldId, value);
            } else {
                // Handle regular fields and clean form inputs
                field.value = value;

                // Trigger floating label update for clean form inputs
                if (field.classList.contains('clean-form-input')) {
                    const label = field.nextElementSibling;
                    if (label && label.classList.contains('clean-form-label')) {
                        if (value && value.trim() !== '') {
                            label.classList.add('label-float');
                            console.log(`✅ Floating label activated for ${fieldId}`);
                        } else {
                            label.classList.remove('label-float');
                            console.log(`✅ Floating label reset for ${fieldId}`);
                        }
                    }
                }

                // Trigger events to ensure proper handling
                const inputEvent = new Event('input', { bubbles: true });
                const changeEvent = new Event('change', { bubbles: true });

                field.dispatchEvent(inputEvent);
                field.dispatchEvent(changeEvent);
            }

            console.log(`✅ Field ${fieldId} filled successfully with: ${value}`);

            // Verify the field value
            setTimeout(() => {
                console.log(`Verification: ${fieldId} value is now:`, field.value);
                // Also trigger global floating label update
                if (window.updateFloatingLabels) {
                    window.updateFloatingLabels();
                }
            }, 100);

        } else {
            console.error(`❌ Field with ID ${fieldId} not found`);
            console.log('Available form fields:', document.querySelectorAll('input, textarea, select'));
        }
    }

    setSelectValue(selectId, value) {
        const select = document.getElementById(selectId);
        if (select) {
            select.value = value;
            // Trigger change event for MDC select
            const changeEvent = new Event('change', { bubbles: true });
            select.dispatchEvent(changeEvent);
        }
    }

    setCheckboxValue(checkboxId, checked) {
        console.log(`=== SETTING CHECKBOX ${checkboxId} to ${checked} ===`);

        const checkbox = document.getElementById(checkboxId);
        if (checkbox) {
            console.log('Checkbox element found:', checkbox);

            // Set the checkbox value
            checkbox.checked = checked;

            // Handle Material Design checkbox visual update
            const mdcCheckbox = checkbox.closest('.mdc-checkbox');
            if (mdcCheckbox) {
                console.log('MDC checkbox container found:', mdcCheckbox);

                if (checked) {
                    mdcCheckbox.classList.add('mdc-checkbox--checked');
                    mdcCheckbox.setAttribute('aria-checked', 'true');
                } else {
                    mdcCheckbox.classList.remove('mdc-checkbox--checked');
                    mdcCheckbox.setAttribute('aria-checked', 'false');
                }

                // Force visual update by manipulating the background element
                const background = mdcCheckbox.querySelector('.mdc-checkbox__background');
                if (background) {
                    if (checked) {
                        background.style.borderColor = 'var(--primary-color)';
                        background.style.backgroundColor = 'var(--primary-color)';
                    } else {
                        background.style.borderColor = '';
                        background.style.backgroundColor = '';
                    }
                }
            }

            // Trigger multiple events to ensure proper handling
            const changeEvent = new Event('change', { bubbles: true });
            const clickEvent = new Event('click', { bubbles: true });
            const inputEvent = new Event('input', { bubbles: true });

            checkbox.dispatchEvent(changeEvent);
            checkbox.dispatchEvent(clickEvent);
            checkbox.dispatchEvent(inputEvent);

            console.log(`✅ Checkbox ${checkboxId} set to ${checked} successfully`);

            // Verify the checkbox state
            setTimeout(() => {
                console.log(`Verification: ${checkboxId} checked state is now:`, checkbox.checked);
            }, 100);

        } else {
            console.error(`❌ Checkbox with ID ${checkboxId} not found`);
            console.log('Available checkboxes:', document.querySelectorAll('input[type="checkbox"]'));
        }
    }

    addQuickFillAnimation() {
        // Add animation to form fields that were filled
        const formFields = document.querySelectorAll('.form-field');
        formFields.forEach((field, index) => {
            setTimeout(() => {
                field.classList.add('quick-filled');
                setTimeout(() => {
                    field.classList.remove('quick-filled');
                }, 1000);
            }, index * 100);
        });
    }

    // ========================================
    // JOB TEMPLATE CREATION FUNCTIONALITY
    // ========================================

    initializeJobTemplates() {
        console.log('Initializing Job Template functionality');

        // Initialize job template dialog
        this.jobTemplateDialog = null;
        this.currentTemplate = {
            tasks: [],
            skills: [],
            bomItems: [],
            tools: [],
            sops: [],
            safetyInstructions: []
        };

        // Initialize event handlers
        this.initializeJobTemplateHandlers();

        // Initialize MDC components for job template dialog
        this.initializeJobTemplateMDC();

        // Create sample templates if none exist
        this.createSampleJobTemplates();
    }

    initializeJobTemplateHandlers() {
        // Templates button handler (connect existing Templates button to job template dialog)
        const templatesBtn = document.getElementById('templates-btn');
        if (templatesBtn) {
            console.log('Templates button found, adding event listener');
            templatesBtn.addEventListener('click', (e) => {
                console.log('Templates button clicked!');
                e.preventDefault();
                e.stopPropagation();
                this.openJobTemplateDialog();
            });
        } else {
            console.error('Templates button not found!');
        }

        // Add handlers for each section
        this.initializeTaskHandlers();
        this.initializeSkillHandlers();
        this.initializeBOMHandlers();
        this.initializeToolHandlers();
        this.initializeSOPHandlers();
        this.initializeSafetyHandlers();

        // Save template handler
        const saveTemplateBtn = document.getElementById('save-template-btn');
        if (saveTemplateBtn) {
            saveTemplateBtn.addEventListener('click', () => {
                this.saveJobTemplate();
            });
        }

        // Cancel button handler
        this.initializeCancelHandler();
    }

    initializeCancelHandler() {
        console.log('Initializing cancel handlers for job template dialog');

        // Handle cancel button clicks with more specific targeting
        document.addEventListener('click', (e) => {
            // Check if clicked element or its parent has the cancel action
            const cancelButton = e.target.closest('[data-mdc-dialog-action="cancel"]');
            if (cancelButton) {
                // Check if this cancel button is in the job template dialog
                const jobDialog = cancelButton.closest('#job-template-dialog');
                if (jobDialog) {
                    console.log('Cancel button clicked in job template dialog');
                    e.preventDefault();
                    e.stopPropagation();
                    this.closeJobTemplateDialog();
                }
            }
        });

        // Handle ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const dialog = document.getElementById('job-template-dialog');
                if (dialog && (dialog.style.display === 'flex' || dialog.classList.contains('mdc-dialog--open'))) {
                    console.log('ESC key pressed, closing job template dialog');
                    this.closeJobTemplateDialog();
                }
            }
        });

        // Handle backdrop click
        setTimeout(() => {
            const dialog = document.getElementById('job-template-dialog');
            if (dialog) {
                dialog.addEventListener('click', (e) => {
                    // Only close if clicking the backdrop (dialog itself, not its children)
                    if (e.target === dialog || e.target.classList.contains('mdc-dialog__scrim')) {
                        console.log('Backdrop clicked, closing job template dialog');
                        this.closeJobTemplateDialog();
                    }
                });
            }
        }, 1000);
    }

    closeJobTemplateDialog() {
        console.log('Closing Job Template dialog');

        if (this.jobTemplateDialog) {
            this.jobTemplateDialog.close();
        } else {
            const dialog = document.getElementById('job-template-dialog');
            if (dialog) {
                dialog.style.display = 'none';
                dialog.classList.remove('mdc-dialog--open');
            }
        }

        // Clear form data
        this.clearJobTemplateForm();

        // Reset editing state
        this.resetEditingState();

        console.log('Job Template dialog closed');
    }

    initializeJobTemplateMDC() {
        // Initialize MDC components when dialog is opened
        setTimeout(() => {
            const jobTemplateDialog = document.getElementById('job-template-dialog');
            if (jobTemplateDialog && window.mdc) {
                try {
                    this.jobTemplateDialog = new mdc.dialog.MDCDialog(jobTemplateDialog);

                    // Initialize text fields
                    const textFields = jobTemplateDialog.querySelectorAll('.mdc-text-field');
                    textFields.forEach(textField => {
                        new mdc.textField.MDCTextField(textField);
                    });

                    // Initialize selects
                    const selects = jobTemplateDialog.querySelectorAll('.mdc-select');
                    selects.forEach(select => {
                        new mdc.select.MDCSelect(select);
                    });

                    console.log('Job Template MDC components initialized');
                } catch (error) {
                    console.error('Error initializing Job Template MDC components:', error);
                }
            }
        }, 1000);
    }

    openJobTemplateDialog() {
        console.log('=== OPENING JOB TEMPLATE DIALOG ===');

        // Only reset template data if not editing
        if (!this.isEditingBundle) {
            this.currentTemplate = {
                id: null, // Clear ID for new template
                tasks: [],
                skills: [],
                bomItems: [],
                tools: [],
                sops: [],
                safetyInstructions: []
            };

            // Clear form
            this.clearJobTemplateForm();
        } else {
            console.log('Editing mode - keeping existing template data');
        }

        // Initialize all MDC text fields in the dialog BEFORE opening
        this.initializeDialogMDCTextFields();

        // Populate service types dropdown
        this.populateServiceTypes();

        // Open dialog
        const dialog = document.getElementById('job-template-dialog');
        console.log('Job template dialog element:', dialog);

        if (this.jobTemplateDialog) {
            console.log('Using MDC dialog to open');
            this.jobTemplateDialog.open();
        } else {
            console.log('Using fallback method to open dialog');
            if (dialog) {
                dialog.style.display = 'flex';
                dialog.classList.add('mdc-dialog--open');
                console.log('Dialog opened with fallback method');

                // Force visibility
                dialog.style.zIndex = '9999';
                dialog.style.position = 'fixed';
                dialog.style.top = '0';
                dialog.style.left = '0';
                dialog.style.width = '100vw';
                dialog.style.height = '100vh';
                dialog.style.backgroundColor = 'rgba(0,0,0,0.5)';

                console.log('✅ Dialog should now be visible!');
            } else {
                console.error('Job template dialog element not found!');
                alert('❌ Error: Job template dialog not found in HTML!');
            }
        }

        // Add sample data to form AFTER dialog is open
        setTimeout(() => {
            this.addSampleFormData();
        }, 500);

        // Show empty state for all containers
        this.showEmptyStates();

        // Add direct cancel button handler when dialog opens
        setTimeout(() => {
            this.attachDirectCancelHandler();
            this.attachAllButtonHandlers();
            this.initializeDragAndDrop();
        }, 500);
    }

    attachDirectCancelHandler() {
        console.log('Attaching direct cancel handler');

        // Find the cancel button specifically in the job template dialog
        const dialog = document.getElementById('job-template-dialog');
        if (dialog) {
            const cancelButton = dialog.querySelector('[data-mdc-dialog-action="cancel"]');
            console.log('Cancel button found:', cancelButton);

            if (cancelButton) {
                // Remove any existing listeners and add a new one
                const newCancelButton = cancelButton.cloneNode(true);
                cancelButton.parentNode.replaceChild(newCancelButton, cancelButton);

                newCancelButton.addEventListener('click', (e) => {
                    console.log('🎯 DIRECT CANCEL BUTTON CLICKED!');
                    e.preventDefault();
                    e.stopPropagation();
                    this.closeJobTemplateDialog();
                });

                console.log('✅ Direct cancel handler attached');
            } else {
                console.error('❌ Cancel button not found in dialog');
            }
        }
    }

    attachAllButtonHandlers() {
        console.log('🔧 Attaching all button handlers for job template dialog');

        // Tasks buttons
        const addTaskBtn = document.getElementById('add-task-btn');
        const addPredefinedTaskBtn = document.getElementById('add-predefined-task-btn');

        if (addTaskBtn) {
            addTaskBtn.onclick = () => this.addTask();
            console.log('✅ Add Task button handler attached');
        }

        if (addPredefinedTaskBtn) {
            addPredefinedTaskBtn.onclick = () => this.showPredefinedTasksDialog();
            console.log('✅ Add Predefined Task button handler attached');
        }

        // Skills buttons
        const addSkillBtn = document.getElementById('add-skill-btn');
        const addPredefinedSkillBtn = document.getElementById('add-predefined-skill-btn');

        if (addSkillBtn) {
            addSkillBtn.onclick = () => this.addSkill();
            console.log('✅ Add Skill button handler attached');
        }

        if (addPredefinedSkillBtn) {
            addPredefinedSkillBtn.onclick = () => this.showPredefinedSkillsDialog();
            console.log('✅ Add Predefined Skill button handler attached');
        }

        // BOM buttons
        const addBOMBtn = document.getElementById('add-bom-item-btn');
        const addPredefinedBOMBtn = document.getElementById('add-predefined-bom-btn');

        if (addBOMBtn) {
            addBOMBtn.onclick = () => this.addBOMItem();
            console.log('✅ Add BOM button handler attached');
        }

        if (addPredefinedBOMBtn) {
            addPredefinedBOMBtn.onclick = () => this.showPredefinedBOMDialog();
            console.log('✅ Add Predefined BOM button handler attached');
        }

        // Tools buttons
        const addToolBtn = document.getElementById('add-tool-btn');
        const addPredefinedToolBtn = document.getElementById('add-predefined-tool-btn');

        if (addToolBtn) {
            addToolBtn.onclick = () => this.addTool();
            console.log('✅ Add Tool button handler attached');
        }

        if (addPredefinedToolBtn) {
            addPredefinedToolBtn.onclick = () => this.showPredefinedToolsDialog();
            console.log('✅ Add Predefined Tool button handler attached');
        }

        // SOPs buttons
        const addSOPBtn = document.getElementById('add-sop-btn');
        const addPredefinedSOPBtn = document.getElementById('add-predefined-sop-btn');

        if (addSOPBtn) {
            addSOPBtn.onclick = () => this.addSOP();
            console.log('✅ Add SOP button handler attached');
        }

        if (addPredefinedSOPBtn) {
            addPredefinedSOPBtn.onclick = () => this.showPredefinedSOPsDialog();
            console.log('✅ Add Predefined SOP button handler attached');
        }

        // Safety buttons
        const addSafetyBtn = document.getElementById('add-safety-btn');
        const addPredefinedSafetyBtn = document.getElementById('add-predefined-safety-btn');

        if (addSafetyBtn) {
            addSafetyBtn.onclick = () => this.addSafetyInstruction();
            console.log('✅ Add Safety button handler attached');
        }

        if (addPredefinedSafetyBtn) {
            addPredefinedSafetyBtn.onclick = () => this.showPredefinedSafetyDialog();
            console.log('✅ Add Predefined Safety button handler attached');
        }

        // Save button
        const saveTemplateBtn = document.getElementById('save-template-btn');
        if (saveTemplateBtn) {
            saveTemplateBtn.onclick = () => this.saveJobTemplate();
            console.log('✅ Save Template button handler attached');
        }

        console.log('🎯 All button handlers attached successfully!');
    }

    // ========================================
    // DRAG AND DROP FUNCTIONALITY
    // ========================================

    initializeDragAndDrop() {
        console.log('🎯 Initializing drag and drop functionality');

        // Show the floating action button
        const fab = document.getElementById('predefined-fab');
        if (fab) {
            fab.style.display = 'flex';
            fab.onclick = () => this.togglePredefinedPanel();
        }

        // Initialize panel close button
        const closeBtn = document.getElementById('predefined-panel-close');
        if (closeBtn) {
            closeBtn.onclick = () => this.closePredefinedPanel();
        }

        // Initialize tab switching
        const tabs = document.querySelectorAll('.predefined-tab');
        tabs.forEach(tab => {
            tab.onclick = () => this.switchPredefinedTab(tab.dataset.tab);
        });

        // Initialize drop zones
        this.initializeDropZones();

        // Load initial tab content
        this.switchPredefinedTab('tasks');

        console.log('✅ Drag and drop initialized');
    }

    togglePredefinedPanel() {
        const panel = document.getElementById('predefined-items-panel');
        const fab = document.getElementById('predefined-fab');

        if (panel.style.display === 'none' || !panel.style.display) {
            panel.style.display = 'block';
            fab.classList.add('active');
            fab.querySelector('i').textContent = 'close';
        } else {
            this.closePredefinedPanel();
        }
    }

    closePredefinedPanel() {
        const panel = document.getElementById('predefined-items-panel');
        const fab = document.getElementById('predefined-fab');

        panel.style.display = 'none';
        fab.classList.remove('active');
        fab.querySelector('i').textContent = 'library_add';
    }

    switchPredefinedTab(tabName) {
        // Update active tab
        const tabs = document.querySelectorAll('.predefined-tab');
        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        // Load content for the selected tab
        this.loadPredefinedContent(tabName);
    }

    loadPredefinedContent(type) {
        const content = document.getElementById('predefined-panel-content');
        let items = [];
        let iconMap = {
            tasks: 'task_alt',
            skills: 'school',
            bom: 'inventory',
            tools: 'build',
            sops: 'description',
            safety: 'security'
        };

        switch (type) {
            case 'tasks':
                items = this.getPredefinedTasks();
                break;
            case 'skills':
                items = this.getPredefinedSkills();
                break;
            case 'bom':
                items = this.getPredefinedBOMItems();
                break;
            case 'tools':
                items = this.getPredefinedTools();
                break;
            case 'sops':
                items = this.getPredefinedSOPs();
                break;
            case 'safety':
                items = this.getPredefinedSafetyInstructions();
                break;
        }

        content.innerHTML = items.map((item, index) =>
            this.createDraggableItemHTML(item, type, index, iconMap[type])
        ).join('');

        // Make items draggable
        this.makeDraggable(type);
    }

    createDraggableItemHTML(item, type, index, icon) {
        let metaInfo = '';
        let categoryClass = '';

        switch (type) {
            case 'tasks':
                metaInfo = `<span class="draggable-item-hours">${item.estimatedHours}h</span>`;
                categoryClass = item.category || 'General';
                break;
            case 'skills':
                metaInfo = `<span class="draggable-item-category">${item.level}</span>`;
                categoryClass = item.type || 'Technical';
                break;
            case 'bom':
                metaInfo = `<span class="draggable-item-cost">$${item.unitCost}</span>`;
                categoryClass = item.category || 'Parts';
                break;
            case 'tools':
                metaInfo = `<span class="draggable-item-category">${item.category}</span>`;
                categoryClass = item.required ? 'Required' : 'Optional';
                break;
            case 'sops':
                metaInfo = `<span class="draggable-item-category">${item.steps.length} steps</span>`;
                categoryClass = item.category || 'Procedure';
                break;
            case 'safety':
                metaInfo = `<span class="draggable-item-category">${item.priority}</span>`;
                categoryClass = item.category || 'Safety';
                break;
        }

        return `
            <div class="draggable-item" draggable="true" data-type="${type}" data-index="${index}">
                <div class="draggable-item-header">
                    <div class="draggable-item-icon">
                        <i class="material-icons">${icon}</i>
                    </div>
                    <div class="draggable-item-title">${item.name || item.title}</div>
                    <div class="draggable-item-category">${categoryClass}</div>
                </div>
                ${item.description ? `<div class="draggable-item-description">${item.description}</div>` : ''}
                <div class="draggable-item-meta">
                    <span>Drag to add</span>
                    ${metaInfo}
                </div>
            </div>
        `;
    }

    makeDraggable(type) {
        const draggableItems = document.querySelectorAll('.draggable-item');

        draggableItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                console.log('🎯 Drag started:', item.dataset.type, item.dataset.index);

                item.classList.add('dragging');

                // Store drag data
                e.dataTransfer.setData('text/plain', JSON.stringify({
                    type: item.dataset.type,
                    index: parseInt(item.dataset.index)
                }));

                e.dataTransfer.effectAllowed = 'copy';

                // Create drag helper
                this.createDragHelper(e, item);
            });

            item.addEventListener('dragend', (e) => {
                item.classList.remove('dragging');
                this.removeDragHelper();
            });
        });
    }

    initializeDropZones() {
        const dropZones = document.querySelectorAll('.drop-zone');

        dropZones.forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
                zone.classList.add('drag-over');
            });

            zone.addEventListener('dragleave', (e) => {
                // Only remove if leaving the zone completely
                if (!zone.contains(e.relatedTarget)) {
                    zone.classList.remove('drag-over');
                }
            });

            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('drag-over');

                try {
                    const dragData = JSON.parse(e.dataTransfer.getData('text/plain'));
                    const dropType = zone.dataset.dropType;

                    console.log('🎯 Drop event:', dragData, 'into', dropType);

                    if (dragData.type === dropType) {
                        this.handleDrop(dragData.type, dragData.index);
                    } else {
                        this.showModernNotification(`Cannot drop ${dragData.type} into ${dropType} section`, 'error');
                    }
                } catch (error) {
                    console.error('Drop error:', error);
                    this.showModernNotification('Drop failed', 'error');
                }
            });
        });
    }

    createDragHelper(e, item) {
        const helper = document.createElement('div');
        helper.className = 'drag-helper';
        helper.textContent = `Adding ${item.querySelector('.draggable-item-title').textContent}`;
        helper.id = 'drag-helper';

        document.body.appendChild(helper);

        // Update helper position on mouse move
        document.addEventListener('dragover', this.updateDragHelper);
    }

    updateDragHelper = (e) => {
        const helper = document.getElementById('drag-helper');
        if (helper) {
            helper.style.left = e.clientX + 'px';
            helper.style.top = e.clientY + 'px';
        }
    }

    removeDragHelper() {
        const helper = document.getElementById('drag-helper');
        if (helper) {
            helper.remove();
        }
        document.removeEventListener('dragover', this.updateDragHelper);
    }

    handleDrop(type, index) {
        console.log('🎯 Handling drop:', type, index);

        switch (type) {
            case 'tasks':
                this.addPredefinedTask(index);
                break;
            case 'skills':
                this.addPredefinedSkill(index);
                break;
            case 'bom':
                this.addPredefinedBOMItem(index);
                break;
            case 'tools':
                this.addPredefinedTool(index);
                break;
            case 'sops':
                this.addPredefinedSOP(index);
                break;
            case 'safety':
                this.addPredefinedSafety(index);
                break;
        }
    }

    clearJobTemplateForm() {
        // Clear all form fields
        const form = document.getElementById('job-template-form');
        if (form) {
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.value = '';
            });
        }
    }

    populateServiceTypes() {
        const serviceTypeList = document.getElementById('service-type-list');
        if (serviceTypeList) {
            serviceTypeList.innerHTML = '';

            // Add service types from current data
            this.services.forEach(service => {
                const listItem = document.createElement('li');
                listItem.className = 'mdc-list-item';
                listItem.setAttribute('data-value', service.code);
                listItem.innerHTML = `<span class="mdc-list-item__text">${service.name}</span>`;
                serviceTypeList.appendChild(listItem);
            });
        }
    }

    addSampleFormData() {
        // Add sample template information
        setTimeout(() => {
            this.setMDCFieldValue('template-code', 'TPL-' + Date.now().toString().slice(-6));
            this.setMDCFieldValue('template-name', 'Comprehensive Vehicle Service Package');
            this.setMDCFieldValue('template-description', 'Complete automotive service package including engine maintenance, brake service, and safety inspection with all required tools, parts, and procedures.');

            console.log('✅ Sample form data added with floating labels updated');
        }, 1000);
    }

    setMDCFieldValue(fieldId, value) {
        const field = document.getElementById(fieldId);
        if (!field) {
            console.error(`Field ${fieldId} not found`);
            return;
        }

        // Set the input value
        field.value = value;

        // Find the MDC text field container
        const mdcTextField = field.closest('.mdc-text-field');
        if (mdcTextField) {
            // Initialize MDC text field if not already done
            if (!mdcTextField.MDCTextField) {
                try {
                    mdcTextField.MDCTextField = new mdc.textField.MDCTextField(mdcTextField);
                    console.log(`Initialized MDC text field for ${fieldId}`);
                } catch (error) {
                    console.error(`Error initializing MDC text field for ${fieldId}:`, error);
                }
            }

            // Set the value through MDC
            if (mdcTextField.MDCTextField) {
                mdcTextField.MDCTextField.value = value;
                console.log(`Set MDC value for ${fieldId}: ${value}`);
            }

            // Force floating label state
            if (value && value.trim() !== '') {
                mdcTextField.classList.add('mdc-text-field--label-floating');
                const floatingLabel = mdcTextField.querySelector('.mdc-floating-label');
                if (floatingLabel) {
                    floatingLabel.classList.add('mdc-floating-label--float-above');
                }
            }
        }

        // Trigger events
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.dispatchEvent(new Event('change', { bubbles: true }));

        console.log(`✅ Successfully set value for ${fieldId}: ${value}`);
    }

    initializeDialogMDCTextFields() {
        // Initialize all MDC text fields in the dialog
        const dialog = document.getElementById('job-template-dialog');
        if (dialog) {
            const textFields = dialog.querySelectorAll('.mdc-text-field');
            textFields.forEach(textField => {
                if (!textField.MDCTextField) {
                    try {
                        textField.MDCTextField = new mdc.textField.MDCTextField(textField);
                        console.log('Initialized MDC text field:', textField);
                    } catch (error) {
                        console.error('Error initializing MDC text field:', error);
                    }
                }
            });
            console.log(`✅ Initialized ${textFields.length} MDC text fields in dialog`);
        }
    }

    updateAllMDCTextFields() {
        // Update all MDC text fields to ensure floating labels work correctly
        document.querySelectorAll('.mdc-text-field').forEach(textField => {
            if (textField.MDCTextField) {
                const input = textField.querySelector('.mdc-text-field__input');
                if (input && input.value) {
                    textField.MDCTextField.value = input.value;
                    console.log(`Updated MDC text field: ${input.id} with value: ${input.value}`);
                }
            }
        });
    }

    initializeMDCTextFieldsForAutoFill() {
        // Set up periodic checking for MDC text fields
        setInterval(() => {
            document.querySelectorAll('.mdc-text-field__input').forEach(input => {
                if (input.value && input.value.trim() !== '') {
                    const textField = input.closest('.mdc-text-field');
                    if (textField && textField.MDCTextField) {
                        // Ensure the floating label is active
                        textField.MDCTextField.value = input.value;
                        textField.classList.add('mdc-text-field--label-floating');
                    }
                }
            });
        }, 300);

        console.log('MDC text fields auto-fill detection initialized');
    }

    initializeSaveButton() {
        const saveBtn = document.getElementById('save-template-btn');
        if (saveBtn) {
            // Remove any existing event listeners first
            const newSaveBtn = saveBtn.cloneNode(true);
            saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);

            // Add single event listener
            newSaveBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Save Template button clicked');
                this.saveJobTemplate();
            });
            console.log('✅ Save Template button initialized');
        } else {
            console.error('❌ Save Template button not found');
        }

        // Also connect the Create Template button in the templates section
        const createTemplateBtn = document.getElementById('create-template-btn');
        if (createTemplateBtn) {
            // Remove any existing event listeners first
            const newCreateBtn = createTemplateBtn.cloneNode(true);
            createTemplateBtn.parentNode.replaceChild(newCreateBtn, createTemplateBtn);

            // Add single event listener
            newCreateBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Create Template button clicked');
                this.openJobTemplateDialog();
            });
            console.log('✅ Create Template button initialized');
        }
    }

    showEmptyStates() {
        const containers = [
            { id: 'tasks-container', text: 'No tasks added yet. Click "Add Task" to get started.' },
            { id: 'skills-container', text: 'No skills defined yet. Click "Add Skill" to specify requirements.' },
            { id: 'bom-container', text: 'No parts/materials added yet. Click "Add Part/Material" to build BOM.' },
            { id: 'tools-container', text: 'No tools specified yet. Click "Add Tool" to define requirements.' },
            { id: 'sops-container', text: 'No SOPs created yet. Click "Add SOP" to define procedures.' },
            { id: 'safety-container', text: 'No safety instructions added yet. Click "Add Safety Instruction" to define safety protocols.' }
        ];

        containers.forEach(container => {
            const element = document.getElementById(container.id);
            if (element) {
                element.innerHTML = `<div class="container-empty">${container.text}</div>`;
            }
        });
    }

    // ========================================
    // TASK MANAGEMENT
    // ========================================

    initializeTaskHandlers() {
        const addTaskBtn = document.getElementById('add-task-btn');
        if (addTaskBtn) {
            addTaskBtn.addEventListener('click', () => {
                this.addTask();
            });
        }

        const addPredefinedTaskBtn = document.getElementById('add-predefined-task-btn');
        if (addPredefinedTaskBtn) {
            addPredefinedTaskBtn.addEventListener('click', () => {
                this.showPredefinedTasksDialog();
            });
        }
    }

    addTask() {
        this.showTaskInputModal();
    }

    showTaskInputModal() {
        const modalHTML = `
            <div class="input-modal-overlay" id="task-input-modal">
                <div class="input-modal" style="max-width: 900px;">
                    <div class="input-modal-header">
                        <h3 class="input-modal-title">
                            <i class="material-icons">rocket_launch</i>
                            Add Task - Quick & Easy
                        </h3>
                        <p class="input-modal-subtitle">Choose from predefined tasks or create a custom one</p>
                    </div>
                    <div class="input-modal-body">
                        <!-- Quick Add Section -->
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 12px; margin-bottom: 25px; color: white;">
                            <h4 style="margin: 0 0 15px 0; display: flex; align-items: center;">
                                <i class="material-icons" style="margin-right: 8px;">flash_on</i>
                                One-Click Quick Add
                            </h4>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 12px;">
                                <button class="quick-task-btn" onclick="app.addQuickTask('Engine Oil Change', 1.5, 'Engine', 'Replace engine oil and filter')">
                                    <i class="material-icons">build_circle</i>
                                    <div>
                                        <strong>Engine Oil Change</strong>
                                        <small>1.5 hours • Engine</small>
                                    </div>
                                </button>
                                <button class="quick-task-btn" onclick="app.addQuickTask('Brake Inspection', 1.0, 'Brakes', 'Inspect brake pads and rotors')">
                                    <i class="material-icons">search</i>
                                    <div>
                                        <strong>Brake Inspection</strong>
                                        <small>1.0 hour • Brakes</small>
                                    </div>
                                </button>
                                <button class="quick-task-btn" onclick="app.addQuickTask('Tire Rotation', 0.5, 'Maintenance', 'Rotate tires for even wear')">
                                    <i class="material-icons">cached</i>
                                    <div>
                                        <strong>Tire Rotation</strong>
                                        <small>0.5 hours • Maintenance</small>
                                    </div>
                                </button>
                                <button class="quick-task-btn" onclick="app.addQuickTask('Battery Test', 0.5, 'Electrical', 'Test battery voltage and load')">
                                    <i class="material-icons">battery_charging_full</i>
                                    <div>
                                        <strong>Battery Test</strong>
                                        <small>0.5 hours • Electrical</small>
                                    </div>
                                </button>
                                <button class="quick-task-btn" onclick="app.addQuickTask('Air Filter Replace', 0.5, 'Engine', 'Replace engine air filter')">
                                    <i class="material-icons">air</i>
                                    <div>
                                        <strong>Air Filter Replace</strong>
                                        <small>0.5 hours • Engine</small>
                                    </div>
                                </button>
                                <button class="quick-task-btn" onclick="app.addQuickTask('Coolant Check', 0.5, 'Engine', 'Check coolant level and condition')">
                                    <i class="material-icons">thermostat</i>
                                    <div>
                                        <strong>Coolant Check</strong>
                                        <small>0.5 hours • Engine</small>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <!-- Custom Task Section -->
                        <div style="border-top: 2px solid #e9ecef; padding-top: 30px; margin-top: 30px;">
                            <div style="text-align: center; margin-bottom: 40px;">
                                <h3 style="margin: 0 0 8px 0; color: #333; font-size: 20px; font-weight: 600;">✏️ Create Custom Task</h3>
                                <p style="margin: 0; color: #666; font-size: 14px;">Design your own task with specific requirements</p>
                            </div>

                            <div class="clean-form-container">
                                <div class="clean-form-row">
                                    <div class="clean-form-field">
                                        <input type="text" class="clean-form-input" id="task-name-input" placeholder=" " required>
                                        <label class="clean-form-label">Task Name *</label>
                                    </div>
                                </div>

                                <div class="clean-form-row clean-form-row-split">
                                    <div class="clean-form-field">
                                        <input type="number" class="clean-form-input" id="task-hours-input" value="1.0" step="0.5" min="0.1" placeholder=" " required>
                                        <label class="clean-form-label">Estimated Hours *</label>
                                    </div>

                                    <div class="clean-form-field">
                                        <select class="clean-form-input clean-form-select" id="task-category-input">
                                            <option value="">Select Category</option>
                                            <option value="Engine">Engine</option>
                                            <option value="Brakes">Brakes</option>
                                            <option value="Electrical">Electrical</option>
                                            <option value="Transmission">Transmission</option>
                                            <option value="Suspension">Suspension</option>
                                            <option value="HVAC">HVAC</option>
                                            <option value="Inspection">Inspection</option>
                                            <option value="Maintenance">Maintenance</option>
                                        </select>
                                        <label class="clean-form-label">Category</label>
                                    </div>
                                </div>

                                <div class="clean-form-row">
                                    <div class="clean-form-field">
                                        <textarea class="clean-form-input clean-form-textarea" id="task-description-input" placeholder=" " rows="3"></textarea>
                                        <label class="clean-form-label">Description (Optional)</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; margin: 25px -25px -25px -25px; border-radius: 0 0 12px 12px;">
                        <div style="display: flex; gap: 15px; justify-content: center; align-items: center;">
                            <button class="premium-modal-btn premium-modal-btn-secondary" onclick="app.closeInputModal('task-input-modal')">
                                <i class="material-icons">close</i>
                                <span>Cancel</span>
                            </button>
                            <button class="premium-modal-btn premium-modal-btn-primary" onclick="app.saveTaskFromModal()">
                                <i class="material-icons">add_task</i>
                                <span>Create Task</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove any existing modals first
        const existingModal = document.getElementById('task-input-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal and append to body with proper positioning
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Get the modal and apply aggressive styling
        const modal = document.getElementById('task-input-modal');
        if (modal) {
            // Force the modal to appear on top with maximum z-index
            modal.style.cssText = `
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                background: rgba(0, 0, 0, 0.8) !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                z-index: 2147483647 !important;
                opacity: 1 !important;
            `;

            // Style the inner modal
            const innerModal = modal.querySelector('.input-modal');
            if (innerModal) {
                innerModal.style.cssText = `
                    background: white !important;
                    border-radius: 12px !important;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5) !important;
                    max-width: 900px !important;
                    width: 95% !important;
                    max-height: 85vh !important;
                    overflow-y: auto !important;
                    position: relative !important;
                    z-index: 2147483648 !important;
                    transform: scale(1) !important;
                `;
            }
        }

        // Add click-outside-to-close functionality
        setTimeout(() => {
            const overlay = document.getElementById('task-input-modal');
            if (overlay) {
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) {
                        this.closeInputModal('task-input-modal');
                    }
                });
            }

            // Focus on the first input
            document.getElementById('task-name-input').focus();

            // Trigger floating label check for any pre-filled values
            if (window.updateFloatingLabels) {
                setTimeout(() => {
                    window.updateFloatingLabels();
                    console.log('Floating labels updated for task modal');
                }, 200);
            }
        }, 100);
    }

    addQuickTask(name, hours, category, description) {
        const task = {
            id: Date.now(),
            name: name,
            estimatedHours: hours,
            category: category,
            description: description,
            subtasks: []
        };

        this.currentTemplate.tasks.push(task);
        this.renderTasks();
        this.updateTotalHours();
        this.closeInputModal('task-input-modal');

        // Trigger floating label updates after adding task
        if (window.updateFloatingLabels) {
            setTimeout(() => {
                window.updateFloatingLabels();
                console.log('Floating labels updated after adding quick task');
            }, 100);
        }

        this.showModernNotification(`✅ Quick added: ${name}`, 'success');
    }

    saveTaskFromModal() {
        const taskName = document.getElementById('task-name-input').value.trim();
        const estimatedHours = parseFloat(document.getElementById('task-hours-input').value) || 1.0;
        const category = document.getElementById('task-category-input').value;
        const description = document.getElementById('task-description-input').value.trim();

        if (!taskName) {
            document.getElementById('task-name-input').classList.add('error');
            return;
        }

        const task = {
            id: Date.now(),
            name: taskName,
            estimatedHours: estimatedHours,
            category: category || 'General',
            description: description,
            subtasks: []
        };

        this.currentTemplate.tasks.push(task);
        this.renderTasks();
        this.updateTotalHours();
        this.closeInputModal('task-input-modal');
        this.showModernNotification(`Task "${taskName}" added successfully!`, 'success');
    }

    closeInputModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            // Animate out
            modal.style.opacity = '0';
            const innerModal = modal.querySelector('.input-modal');
            if (innerModal) {
                innerModal.style.transform = 'scale(0.9)';
            }

            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    }

    addTaskFromPredefined() {
        const predefinedTasks = this.getPredefinedTasks();

        // Create selection dialog
        let options = predefinedTasks.map((task, index) =>
            `${index + 1}. ${task.name} (${task.category}) - ${task.estimatedHours}h\n   ${task.description}`
        ).join('\n\n');

        const selection = prompt(`Select a predefined task:\n\n${options}\n\nEnter the number (1-${predefinedTasks.length}):`);
        const index = parseInt(selection) - 1;

        if (index >= 0 && index < predefinedTasks.length) {
            const selectedTask = predefinedTasks[index];
            const task = {
                id: Date.now(),
                name: selectedTask.name,
                estimatedHours: selectedTask.estimatedHours,
                category: selectedTask.category,
                description: selectedTask.description,
                subtasks: []
            };

            this.currentTemplate.tasks.push(task);
            this.renderTasks();
            this.updateTotalHours();
            this.showModernNotification(`Added predefined task: ${selectedTask.name}`, 'success');
        }
    }

    showPredefinedTasksDialog() {
        const predefinedTasks = this.getPredefinedTasks();

        // Create a more user-friendly selection dialog
        let dialogHTML = `
            <div style="max-height: 400px; overflow-y: auto; padding: 10px;">
                <h3>Select Predefined Tasks</h3>
                <div style="display: grid; gap: 10px;">
        `;

        predefinedTasks.forEach((task, index) => {
            dialogHTML += `
                <div style="border: 1px solid #ddd; padding: 10px; border-radius: 5px; cursor: pointer;"
                     onclick="window.app.addPredefinedTask(${index})">
                    <strong>${task.name}</strong> (${task.category}) - ${task.estimatedHours}h
                    <br><small style="color: #666;">${task.description}</small>
                </div>
            `;
        });

        dialogHTML += `
                </div>
                <br>
                <button onclick="this.parentElement.parentElement.remove()"
                        style="padding: 8px 16px; background: #f44336; color: white; border: none; border-radius: 4px;">
                    Close
                </button>
            </div>
        `;

        // Create and show dialog
        const dialogDiv = document.createElement('div');
        dialogDiv.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: white; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10000; max-width: 600px; width: 90%;
        `;
        dialogDiv.innerHTML = dialogHTML;
        document.body.appendChild(dialogDiv);
    }

    addPredefinedTask(index) {
        const predefinedTasks = this.getPredefinedTasks();
        const selectedTask = predefinedTasks[index];

        if (selectedTask) {
            const task = {
                id: Date.now(),
                name: selectedTask.name,
                estimatedHours: selectedTask.estimatedHours,
                category: selectedTask.category,
                description: selectedTask.description,
                subtasks: []
            };

            this.currentTemplate.tasks.push(task);
            this.renderTasks();
            this.updateTotalHours();
            this.showModernNotification(`Added predefined task: ${selectedTask.name}`, 'success');

            // Close dialog
            const dialogs = document.querySelectorAll('div[style*="position: fixed"]');
            dialogs.forEach(dialog => {
                if (dialog.textContent.includes('Select Predefined Tasks')) {
                    dialog.remove();
                }
            });
        }
    }

    renderTasks() {
        const container = document.getElementById('tasks-container');
        if (!container) return;

        if (this.currentTemplate.tasks.length === 0) {
            container.innerHTML = `
                <div class="drop-zone-content">
                    <i class="material-icons drop-zone-icon">task_alt</i>
                    <div class="drop-zone-text">Drop tasks here</div>
                    <div class="drop-zone-hint">Drag predefined tasks from the panel or click "Add Task"</div>
                </div>
            `;
            return;
        }

        container.innerHTML = '';
        this.currentTemplate.tasks.forEach((task, index) => {
            const taskElement = this.createTaskElement(task, index);
            container.appendChild(taskElement);
        });
    }

    createTaskElement(task, index) {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task-item';
        taskDiv.innerHTML = `
            <div class="task-header">
                <div class="task-info">
                    <div class="task-number">${index + 1}</div>
                    <div class="task-details">
                        <h4 class="task-name">${task.name}</h4>
                        <p class="task-duration">${task.estimatedHours} hours</p>
                    </div>
                </div>
                <div class="task-actions">
                    <button type="button" onclick="app.addSubtask(${task.id})" title="Add Subtask">
                        <i class="material-icons">add</i>
                    </button>
                    <button type="button" onclick="app.editTask(${task.id})" title="Edit Task">
                        <i class="material-icons">edit</i>
                    </button>
                    <button type="button" onclick="app.deleteTask(${task.id})" title="Delete Task">
                        <i class="material-icons">delete</i>
                    </button>
                </div>
            </div>
            <div class="subtasks-container" id="subtasks-${task.id}">
                ${task.subtasks.map(subtask => `
                    <div class="subtask-item">
                        <div class="subtask-bullet"></div>
                        <span class="subtask-text">${subtask}</span>
                    </div>
                `).join('')}
            </div>
        `;
        return taskDiv;
    }

    addSubtask(taskId) {
        const subtaskName = prompt('Enter subtask description:');
        if (subtaskName) {
            const task = this.currentTemplate.tasks.find(t => t.id === taskId);
            if (task) {
                task.subtasks.push(subtaskName);
                this.renderTasks();
            }
        }
    }

    editTask(taskId) {
        const task = this.currentTemplate.tasks.find(t => t.id === taskId);
        if (task) {
            const newName = prompt('Enter new task name:', task.name);
            if (newName) {
                const newHours = prompt('Enter new estimated hours:', task.estimatedHours);
                task.name = newName;
                task.estimatedHours = parseFloat(newHours) || task.estimatedHours;
                this.renderTasks();
                this.updateTotalHours();
            }
        }
    }

    deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.currentTemplate.tasks = this.currentTemplate.tasks.filter(t => t.id !== taskId);
            this.renderTasks();
            this.updateTotalHours();
        }
    }

    updateTotalHours() {
        const totalHours = this.currentTemplate.tasks.reduce((sum, task) => sum + task.estimatedHours, 0);
        const totalHoursField = document.getElementById('total-hours');
        if (totalHoursField) {
            totalHoursField.value = totalHours.toFixed(1);
        }
    }

    addSampleTasks() {
        const sampleTasks = [
            {
                id: Date.now() + 1,
                name: 'Engine Oil Change',
                category: 'Engine',
                description: 'Replace engine oil and filter',
                estimatedHours: 0.5,
                subtasks: ['Drain old oil', 'Replace oil filter', 'Add new oil', 'Check oil level']
            },
            {
                id: Date.now() + 2,
                name: 'Brake Pad Replacement',
                category: 'Brakes',
                description: 'Replace front brake pads',
                estimatedHours: 2.0,
                subtasks: ['Remove wheels', 'Remove brake calipers', 'Replace brake pads', 'Reassemble components']
            },
            {
                id: Date.now() + 3,
                name: 'Multi-Point Inspection',
                category: 'Inspection',
                description: 'Comprehensive vehicle inspection',
                estimatedHours: 1.0,
                subtasks: ['Check fluid levels', 'Inspect belts and hoses', 'Test battery', 'Document findings']
            }
        ];

        this.currentTemplate.tasks.push(...sampleTasks);
        this.renderTasks();
        this.updateTotalHours();
        this.showModernNotification('Sample tasks added successfully!', 'success');
    }

    // ========================================
    // SKILLS MANAGEMENT
    // ========================================

    initializeSkillHandlers() {
        const addSkillBtn = document.getElementById('add-skill-btn');
        if (addSkillBtn) {
            addSkillBtn.addEventListener('click', () => {
                this.addSkill();
            });
        }

        const addPredefinedSkillBtn = document.getElementById('add-predefined-skill-btn');
        if (addPredefinedSkillBtn) {
            addPredefinedSkillBtn.addEventListener('click', () => {
                this.showPredefinedSkillsDialog();
            });
        }
    }

    addSkill() {
        this.showSkillInputModal();
    }

    showSkillInputModal() {
        const modalHTML = `
            <div class="input-modal-overlay" id="skill-input-modal">
                <div class="input-modal">
                    <div class="input-modal-header">
                        <h3 class="input-modal-title">
                            <i class="material-icons">school</i>
                            Add New Skill/Certification
                        </h3>
                        <p class="input-modal-subtitle">Define a required skill or certification for this service package</p>
                    </div>
                    <div class="input-modal-body">
                        <div class="input-form-group">
                            <label class="input-form-label">Skill/Certification Name *</label>
                            <input type="text" class="input-form-field" id="skill-name-input" placeholder="Enter skill or certification name" required>
                        </div>
                        <div class="input-form-row">
                            <div class="input-form-group">
                                <label class="input-form-label">Required Level *</label>
                                <select class="input-form-select" id="skill-level-input" required>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate" selected>Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                    <option value="Expert">Expert</option>
                                </select>
                            </div>
                            <div class="input-form-group">
                                <label class="input-form-label">Skill Type</label>
                                <select class="input-form-select" id="skill-type-input">
                                    <option value="Technical">Technical</option>
                                    <option value="Certification">Certification</option>
                                    <option value="Safety">Safety</option>
                                    <option value="Operational">Operational</option>
                                </select>
                            </div>
                        </div>
                        <div class="input-form-checkbox">
                            <input type="checkbox" id="skill-required-input" checked>
                            <label for="skill-required-input">This skill is mandatory for the service</label>
                        </div>
                    </div>
                    <div class="input-modal-footer">
                        <button class="modal-btn modal-btn-secondary" onclick="app.closeInputModal('skill-input-modal')">Cancel</button>
                        <button class="modal-btn modal-btn-primary" onclick="app.saveSkillFromModal()">Add Skill</button>
                    </div>
                </div>
            </div>
        `;

        // Remove any existing modals first
        const existingModal = document.getElementById('skill-input-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal and append to body with proper positioning
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Get the modal and apply aggressive styling
        const modal = document.getElementById('skill-input-modal');
        if (modal) {
            // Force the modal to appear on top with maximum z-index
            modal.style.cssText = `
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                background: rgba(0, 0, 0, 0.8) !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                z-index: 2147483647 !important;
                opacity: 1 !important;
            `;

            // Style the inner modal
            const innerModal = modal.querySelector('.input-modal');
            if (innerModal) {
                innerModal.style.cssText = `
                    background: white !important;
                    border-radius: 12px !important;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5) !important;
                    max-width: 800px !important;
                    width: 95% !important;
                    max-height: 85vh !important;
                    overflow-y: auto !important;
                    position: relative !important;
                    z-index: 2147483648 !important;
                    transform: scale(1) !important;
                `;
            }
        }

        // Add click-outside-to-close functionality
        setTimeout(() => {
            const overlay = document.getElementById('skill-input-modal');
            if (overlay) {
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) {
                        this.closeInputModal('skill-input-modal');
                    }
                });
            }

            document.getElementById('skill-name-input').focus();
        }, 100);
    }

    saveSkillFromModal() {
        const skillName = document.getElementById('skill-name-input').value.trim();
        const skillLevel = document.getElementById('skill-level-input').value;
        const skillType = document.getElementById('skill-type-input').value;
        const isRequired = document.getElementById('skill-required-input').checked;

        if (!skillName) {
            document.getElementById('skill-name-input').classList.add('error');
            return;
        }

        const skill = {
            id: Date.now(),
            name: skillName,
            level: skillLevel,
            type: skillType,
            required: isRequired
        };

        this.currentTemplate.skills.push(skill);
        this.renderSkills();
        this.closeInputModal('skill-input-modal');
        this.showModernNotification(`Skill "${skillName}" added successfully!`, 'success');
    }

    addSkillFromPredefined() {
        const predefinedSkills = this.getPredefinedSkills();

        // Create selection dialog
        let options = predefinedSkills.map((skill, index) =>
            `${index + 1}. ${skill.name} (${skill.type}) - ${skill.level} ${skill.mandatory ? '[MANDATORY]' : '[OPTIONAL]'}`
        ).join('\n');

        const selection = prompt(`Select a predefined skill:\n\n${options}\n\nEnter the number (1-${predefinedSkills.length}):`);
        const index = parseInt(selection) - 1;

        if (index >= 0 && index < predefinedSkills.length) {
            const selectedSkill = predefinedSkills[index];
            const skill = {
                id: Date.now(),
                name: selectedSkill.name,
                level: selectedSkill.level,
                type: selectedSkill.type,
                required: selectedSkill.mandatory
            };

            this.currentTemplate.skills.push(skill);
            this.renderSkills();
            this.showModernNotification(`Added predefined skill: ${selectedSkill.name}`, 'success');
        }
    }

    showPredefinedSkillsDialog() {
        const predefinedSkills = this.getPredefinedSkills();

        let dialogHTML = `
            <div style="max-height: 400px; overflow-y: auto; padding: 10px;">
                <h3>Select Predefined Skills & Certifications</h3>
                <div style="display: grid; gap: 10px;">
        `;

        predefinedSkills.forEach((skill, index) => {
            dialogHTML += `
                <div style="border: 1px solid #ddd; padding: 10px; border-radius: 5px; cursor: pointer;"
                     onclick="window.app.addPredefinedSkill(${index})">
                    <strong>${skill.name}</strong> (${skill.type}) - ${skill.level}
                    <br><small style="color: ${skill.mandatory ? '#d32f2f' : '#666'};">
                        ${skill.mandatory ? 'MANDATORY' : 'OPTIONAL'}
                    </small>
                </div>
            `;
        });

        dialogHTML += `
                </div>
                <br>
                <button onclick="this.parentElement.parentElement.remove()"
                        style="padding: 8px 16px; background: #f44336; color: white; border: none; border-radius: 4px;">
                    Close
                </button>
            </div>
        `;

        const dialogDiv = document.createElement('div');
        dialogDiv.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: white; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10000; max-width: 600px; width: 90%;
        `;
        dialogDiv.innerHTML = dialogHTML;
        document.body.appendChild(dialogDiv);
    }

    addPredefinedSkill(index) {
        const predefinedSkills = this.getPredefinedSkills();
        const selectedSkill = predefinedSkills[index];

        if (selectedSkill) {
            const skill = {
                id: Date.now(),
                name: selectedSkill.name,
                level: selectedSkill.level,
                type: selectedSkill.type,
                required: selectedSkill.mandatory
            };

            this.currentTemplate.skills.push(skill);
            this.renderSkills();
            this.showModernNotification(`Added predefined skill: ${selectedSkill.name}`, 'success');

            // Close dialog
            const dialogs = document.querySelectorAll('div[style*="position: fixed"]');
            dialogs.forEach(dialog => {
                if (dialog.textContent.includes('Select Predefined Skills')) {
                    dialog.remove();
                }
            });
        }
    }

    renderSkills() {
        const container = document.getElementById('skills-container');
        if (!container) return;

        if (this.currentTemplate.skills.length === 0) {
            container.innerHTML = '<div class="container-empty">No skills defined yet. Click "Add Skill" to specify requirements.</div>';
            return;
        }

        container.innerHTML = '';
        this.currentTemplate.skills.forEach(skill => {
            const skillElement = this.createSkillElement(skill);
            container.appendChild(skillElement);
        });
    }

    createSkillElement(skill) {
        const skillDiv = document.createElement('div');
        skillDiv.className = 'skill-item';
        skillDiv.innerHTML = `
            <div class="skill-icon">
                <i class="material-icons">school</i>
            </div>
            <div class="skill-details">
                <h4 class="skill-name">${skill.name}</h4>
                <p class="skill-level">Level: ${skill.level}</p>
            </div>
            ${skill.required ? '<span class="skill-required">Required</span>' : ''}
            <div class="task-actions">
                <button type="button" onclick="app.deleteSkill(${skill.id})" title="Delete Skill">
                    <i class="material-icons">delete</i>
                </button>
            </div>
        `;
        return skillDiv;
    }

    deleteSkill(skillId) {
        if (confirm('Are you sure you want to delete this skill requirement?')) {
            this.currentTemplate.skills = this.currentTemplate.skills.filter(s => s.id !== skillId);
            this.renderSkills();
        }
    }

    // ========================================
    // BOM MANAGEMENT
    // ========================================

    initializeBOMHandlers() {
        const addBOMBtn = document.getElementById('add-bom-item-btn');
        if (addBOMBtn) {
            addBOMBtn.addEventListener('click', () => {
                this.addBOMItem();
            });
        }

        const addPredefinedBOMBtn = document.getElementById('add-predefined-bom-btn');
        if (addPredefinedBOMBtn) {
            addPredefinedBOMBtn.addEventListener('click', () => {
                this.showPredefinedBOMDialog();
            });
        }
    }

    addBOMItem() {
        this.showBOMInputModal();
    }

    showBOMInputModal() {
        const modalHTML = `
            <div class="input-modal-overlay" id="bom-input-modal">
                <div class="input-modal">
                    <div class="input-modal-header">
                        <h3 class="input-modal-title">
                            <i class="material-icons">inventory</i>
                            Add BOM Item
                        </h3>
                        <p class="input-modal-subtitle">Add a part or material to the Bill of Materials</p>
                    </div>
                    <div class="input-modal-body">
                        <div class="input-form-row">
                            <div class="input-form-group">
                                <label class="input-form-label">Part Number *</label>
                                <input type="text" class="input-form-field" id="bom-part-number-input" placeholder="Enter part number" required>
                            </div>
                            <div class="input-form-group">
                                <label class="input-form-label">Category</label>
                                <select class="input-form-select" id="bom-category-input">
                                    <option value="Engine">Engine</option>
                                    <option value="Brakes">Brakes</option>
                                    <option value="Transmission">Transmission</option>
                                    <option value="Electrical">Electrical</option>
                                    <option value="Suspension">Suspension</option>
                                    <option value="HVAC">HVAC</option>
                                    <option value="Consumables">Consumables</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div class="input-form-group">
                            <label class="input-form-label">Description *</label>
                            <input type="text" class="input-form-field" id="bom-description-input" placeholder="Enter part description" required>
                        </div>
                        <div class="input-form-row-3">
                            <div class="input-form-group">
                                <label class="input-form-label">Quantity *</label>
                                <input type="number" class="input-form-field" id="bom-quantity-input" placeholder="1" min="0" step="0.1" value="1" required>
                            </div>
                            <div class="input-form-group">
                                <label class="input-form-label">Unit</label>
                                <select class="input-form-select" id="bom-unit-input">
                                    <option value="each">Each</option>
                                    <option value="set">Set</option>
                                    <option value="kit">Kit</option>
                                    <option value="quart">Quart</option>
                                    <option value="gallon">Gallon</option>
                                    <option value="bottle">Bottle</option>
                                    <option value="pack">Pack</option>
                                    <option value="tube">Tube</option>
                                </select>
                            </div>
                            <div class="input-form-group">
                                <label class="input-form-label">Unit Cost ($)</label>
                                <input type="number" class="input-form-field" id="bom-cost-input" placeholder="0.00" min="0" step="0.01" value="0">
                            </div>
                        </div>
                    </div>
                    <div class="input-modal-footer">
                        <button class="modal-btn modal-btn-secondary" onclick="app.closeInputModal('bom-input-modal')">Cancel</button>
                        <button class="modal-btn modal-btn-primary" onclick="app.saveBOMFromModal()">Add BOM Item</button>
                    </div>
                </div>
            </div>
        `;

        // Remove any existing modals first
        const existingModal = document.getElementById('bom-input-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal and append to body with proper positioning
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Get the modal and apply aggressive styling
        const modal = document.getElementById('bom-input-modal');
        if (modal) {
            // Force the modal to appear on top with maximum z-index
            modal.style.cssText = `
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                background: rgba(0, 0, 0, 0.8) !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                z-index: 2147483647 !important;
                opacity: 1 !important;
            `;

            // Style the inner modal
            const innerModal = modal.querySelector('.input-modal');
            if (innerModal) {
                innerModal.style.cssText = `
                    background: white !important;
                    border-radius: 12px !important;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5) !important;
                    max-width: 500px !important;
                    width: 90% !important;
                    max-height: 80vh !important;
                    overflow-y: auto !important;
                    position: relative !important;
                    z-index: 2147483648 !important;
                    transform: scale(1) !important;
                `;
            }
        }

        // Add click-outside-to-close functionality
        setTimeout(() => {
            const overlay = document.getElementById('bom-input-modal');
            if (overlay) {
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) {
                        this.closeInputModal('bom-input-modal');
                    }
                });
            }

            document.getElementById('bom-part-number-input').focus();
        }, 100);
    }

    saveBOMFromModal() {
        const partNumber = document.getElementById('bom-part-number-input').value.trim();
        const description = document.getElementById('bom-description-input').value.trim();
        const category = document.getElementById('bom-category-input').value;
        const quantity = parseFloat(document.getElementById('bom-quantity-input').value) || 1;
        const unit = document.getElementById('bom-unit-input').value;
        const cost = parseFloat(document.getElementById('bom-cost-input').value) || 0;

        if (!partNumber || !description) {
            if (!partNumber) document.getElementById('bom-part-number-input').classList.add('error');
            if (!description) document.getElementById('bom-description-input').classList.add('error');
            return;
        }

        const bomItem = {
            id: Date.now(),
            partNumber: partNumber,
            description: description,
            category: category,
            quantity: quantity,
            unit: unit,
            cost: cost
        };

        this.currentTemplate.bomItems.push(bomItem);
        this.renderBOMItems();
        this.closeInputModal('bom-input-modal');
        this.showModernNotification(`BOM item "${partNumber}" added successfully!`, 'success');
    }

    showPredefinedBOMDialog() {
        const predefinedBOM = this.getPredefinedBOMItems();

        let dialogHTML = `
            <div style="max-height: 400px; overflow-y: auto; padding: 10px;">
                <h3>Select Predefined BOM Items</h3>
                <div style="display: grid; gap: 10px;">
        `;

        predefinedBOM.forEach((item, index) => {
            dialogHTML += `
                <div style="border: 1px solid #ddd; padding: 10px; border-radius: 5px; cursor: pointer;"
                     onclick="window.app.addPredefinedBOMItem(${index})">
                    <strong>${item.partNumber}</strong> - ${item.description}
                    <br><small style="color: #666;">
                        Category: ${item.category} | Unit Cost: $${item.unitCost} per ${item.unit}
                    </small>
                </div>
            `;
        });

        dialogHTML += `
                </div>
                <br>
                <button onclick="this.parentElement.parentElement.remove()"
                        style="padding: 8px 16px; background: #f44336; color: white; border: none; border-radius: 4px;">
                    Close
                </button>
            </div>
        `;

        const dialogDiv = document.createElement('div');
        dialogDiv.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: white; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10000; max-width: 600px; width: 90%;
        `;
        dialogDiv.innerHTML = dialogHTML;
        document.body.appendChild(dialogDiv);
    }

    addPredefinedBOMItem(index) {
        const predefinedBOM = this.getPredefinedBOMItems();
        const selectedItem = predefinedBOM[index];

        if (selectedItem) {
            const quantity = prompt('Enter quantity needed:', '1') || '1';

            const bomItem = {
                id: Date.now(),
                partNumber: selectedItem.partNumber,
                description: selectedItem.description,
                category: selectedItem.category,
                quantity: parseFloat(quantity),
                unit: selectedItem.unit,
                cost: selectedItem.unitCost
            };

            this.currentTemplate.bomItems.push(bomItem);
            this.renderBOMItems();
            this.showModernNotification(`Added BOM item: ${selectedItem.partNumber}`, 'success');

            // Close dialog
            const dialogs = document.querySelectorAll('div[style*="position: fixed"]');
            dialogs.forEach(dialog => {
                if (dialog.textContent.includes('Select Predefined BOM')) {
                    dialog.remove();
                }
            });
        }
    }

    renderBOMItems() {
        const container = document.getElementById('bom-container');
        if (!container) return;

        if (this.currentTemplate.bomItems.length === 0) {
            container.innerHTML = '<div class="container-empty">No parts/materials added yet. Click "Add Part/Material" to build BOM.</div>';
            return;
        }

        container.innerHTML = '';
        this.currentTemplate.bomItems.forEach(item => {
            const bomElement = this.createBOMElement(item);
            container.appendChild(bomElement);
        });
    }

    createBOMElement(item) {
        const bomDiv = document.createElement('div');
        bomDiv.className = 'bom-item';
        bomDiv.innerHTML = `
            <div class="bom-icon">
                <i class="material-icons">inventory_2</i>
            </div>
            <div class="bom-details">
                <h4 class="bom-part-number">${item.partNumber}</h4>
                <p class="bom-description">${item.description}</p>
            </div>
            <div class="bom-quantity">${item.quantity}</div>
            <div class="bom-unit">${item.unit}</div>
            <div class="bom-cost">$${item.cost.toFixed(2)}</div>
            <div class="task-actions">
                <button type="button" onclick="app.deleteBOMItem(${item.id})" title="Delete Item">
                    <i class="material-icons">delete</i>
                </button>
            </div>
        `;
        return bomDiv;
    }

    deleteBOMItem(itemId) {
        if (confirm('Are you sure you want to delete this BOM item?')) {
            this.currentTemplate.bomItems = this.currentTemplate.bomItems.filter(item => item.id !== itemId);
            this.renderBOMItems();
        }
    }

    // ========================================
    // TOOLS MANAGEMENT
    // ========================================

    initializeToolHandlers() {
        const addToolBtn = document.getElementById('add-tool-btn');
        if (addToolBtn) {
            addToolBtn.addEventListener('click', () => {
                this.addTool();
            });
        }

        const addPredefinedToolBtn = document.getElementById('add-predefined-tool-btn');
        if (addPredefinedToolBtn) {
            addPredefinedToolBtn.addEventListener('click', () => {
                this.showPredefinedToolsDialog();
            });
        }
    }

    addTool() {
        const toolName = prompt('Enter tool/equipment name:');
        if (toolName) {
            const specification = prompt('Enter tool specification/model:') || '';
            const isRequired = confirm('Is this tool mandatory for the job?');

            const tool = {
                id: Date.now(),
                name: toolName,
                specification: specification,
                required: isRequired
            };

            this.currentTemplate.tools.push(tool);
            this.renderTools();
        }
    }

    showPredefinedToolsDialog() {
        const predefinedTools = this.getPredefinedTools();

        let dialogHTML = `
            <div style="max-height: 400px; overflow-y: auto; padding: 10px;">
                <h3>Select Predefined Tools & Equipment</h3>
                <div style="display: grid; gap: 10px;">
        `;

        predefinedTools.forEach((tool, index) => {
            dialogHTML += `
                <div style="border: 1px solid #ddd; padding: 10px; border-radius: 5px; cursor: pointer;"
                     onclick="window.app.addPredefinedTool(${index})">
                    <strong>${tool.name}</strong> (${tool.category})
                    <br><small style="color: #666;">
                        ${tool.specifications} ${tool.required ? '- REQUIRED' : '- OPTIONAL'}
                    </small>
                </div>
            `;
        });

        dialogHTML += `
                </div>
                <br>
                <button onclick="this.parentElement.parentElement.remove()"
                        style="padding: 8px 16px; background: #f44336; color: white; border: none; border-radius: 4px;">
                    Close
                </button>
            </div>
        `;

        const dialogDiv = document.createElement('div');
        dialogDiv.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: white; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10000; max-width: 600px; width: 90%;
        `;
        dialogDiv.innerHTML = dialogHTML;
        document.body.appendChild(dialogDiv);
    }

    addPredefinedTool(index) {
        const predefinedTools = this.getPredefinedTools();
        const selectedTool = predefinedTools[index];

        if (selectedTool) {
            const tool = {
                id: Date.now(),
                name: selectedTool.name,
                specification: selectedTool.specifications,
                category: selectedTool.category,
                required: selectedTool.required
            };

            this.currentTemplate.tools.push(tool);
            this.renderTools();
            this.showModernNotification(`Added tool: ${selectedTool.name}`, 'success');

            // Close dialog
            const dialogs = document.querySelectorAll('div[style*="position: fixed"]');
            dialogs.forEach(dialog => {
                if (dialog.textContent.includes('Select Predefined Tools')) {
                    dialog.remove();
                }
            });
        }
    }

    renderTools() {
        const container = document.getElementById('tools-container');
        if (!container) return;

        if (this.currentTemplate.tools.length === 0) {
            container.innerHTML = '<div class="container-empty">No tools specified yet. Click "Add Tool" to define requirements.</div>';
            return;
        }

        container.innerHTML = '';
        this.currentTemplate.tools.forEach(tool => {
            const toolElement = this.createToolElement(tool);
            container.appendChild(toolElement);
        });
    }

    createToolElement(tool) {
        const toolDiv = document.createElement('div');
        toolDiv.className = 'tool-item';
        toolDiv.innerHTML = `
            <div class="tool-icon">
                <i class="material-icons">construction</i>
            </div>
            <div class="tool-details">
                <h4 class="tool-name">${tool.name}</h4>
                <p class="tool-specification">${tool.specification}</p>
            </div>
            ${tool.required ? '<span class="tool-required">Required</span>' : ''}
            <div class="task-actions">
                <button type="button" onclick="app.deleteTool(${tool.id})" title="Delete Tool">
                    <i class="material-icons">delete</i>
                </button>
            </div>
        `;
        return toolDiv;
    }

    deleteTool(toolId) {
        if (confirm('Are you sure you want to delete this tool requirement?')) {
            this.currentTemplate.tools = this.currentTemplate.tools.filter(t => t.id !== toolId);
            this.renderTools();
        }
    }

    // ========================================
    // SOP MANAGEMENT
    // ========================================

    initializeSOPHandlers() {
        const addSOPBtn = document.getElementById('add-sop-btn');
        if (addSOPBtn) {
            addSOPBtn.addEventListener('click', () => {
                this.addSOP();
            });
        }

        const addPredefinedSOPBtn = document.getElementById('add-predefined-sop-btn');
        if (addPredefinedSOPBtn) {
            addPredefinedSOPBtn.addEventListener('click', () => {
                this.showPredefinedSOPsDialog();
            });
        }
    }

    addSOP() {
        const sopTitle = prompt('Enter SOP title:');
        if (sopTitle) {
            const steps = [];
            let stepCount = 1;

            while (true) {
                const step = prompt(`Enter step ${stepCount} (or click Cancel to finish):`);
                if (!step) break;
                steps.push(step);
                stepCount++;
            }

            if (steps.length > 0) {
                const sop = {
                    id: Date.now(),
                    title: sopTitle,
                    steps: steps
                };

                this.currentTemplate.sops.push(sop);
                this.renderSOPs();
            }
        }
    }

    showPredefinedSOPsDialog() {
        const predefinedSOPs = this.getPredefinedSOPs();

        let dialogHTML = `
            <div style="max-height: 400px; overflow-y: auto; padding: 10px;">
                <h3>Select Predefined Standard Operating Procedures</h3>
                <div style="display: grid; gap: 10px;">
        `;

        predefinedSOPs.forEach((sop, index) => {
            dialogHTML += `
                <div style="border: 1px solid #ddd; padding: 10px; border-radius: 5px; cursor: pointer;"
                     onclick="window.app.addPredefinedSOP(${index})">
                    <strong>${sop.title}</strong> (${sop.category})
                    <br><small style="color: #666;">
                        ${sop.steps.length} steps included
                    </small>
                </div>
            `;
        });

        dialogHTML += `
                </div>
                <br>
                <button onclick="this.parentElement.parentElement.remove()"
                        style="padding: 8px 16px; background: #f44336; color: white; border: none; border-radius: 4px;">
                    Close
                </button>
            </div>
        `;

        const dialogDiv = document.createElement('div');
        dialogDiv.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: white; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10000; max-width: 600px; width: 90%;
        `;
        dialogDiv.innerHTML = dialogHTML;
        document.body.appendChild(dialogDiv);
    }

    addPredefinedSOP(index) {
        const predefinedSOPs = this.getPredefinedSOPs();
        const selectedSOP = predefinedSOPs[index];

        if (selectedSOP) {
            const sop = {
                id: Date.now(),
                title: selectedSOP.title,
                category: selectedSOP.category,
                steps: [...selectedSOP.steps]
            };

            this.currentTemplate.sops.push(sop);
            this.renderSOPs();
            this.showModernNotification(`Added SOP: ${selectedSOP.title}`, 'success');

            // Close dialog
            const dialogs = document.querySelectorAll('div[style*="position: fixed"]');
            dialogs.forEach(dialog => {
                if (dialog.textContent.includes('Select Predefined Standard')) {
                    dialog.remove();
                }
            });
        }
    }

    renderSOPs() {
        const container = document.getElementById('sops-container');
        if (!container) return;

        if (this.currentTemplate.sops.length === 0) {
            container.innerHTML = '<div class="container-empty">No SOPs created yet. Click "Add SOP" to define procedures.</div>';
            return;
        }

        container.innerHTML = '';
        this.currentTemplate.sops.forEach(sop => {
            const sopElement = this.createSOPElement(sop);
            container.appendChild(sopElement);
        });
    }

    createSOPElement(sop) {
        const sopDiv = document.createElement('div');
        sopDiv.className = 'sop-item';
        sopDiv.innerHTML = `
            <div class="sop-header">
                <div class="sop-icon">
                    <i class="material-icons">description</i>
                </div>
                <h4 class="sop-title">${sop.title}</h4>
                <div class="task-actions">
                    <button type="button" onclick="app.deleteSOP(${sop.id})" title="Delete SOP">
                        <i class="material-icons">delete</i>
                    </button>
                </div>
            </div>
            <div class="sop-content">
                <ol class="sop-steps">
                    ${sop.steps.map((step, index) => `
                        <li class="sop-step">
                            <div class="step-number">${index + 1}</div>
                            <div class="step-text">${step}</div>
                        </li>
                    `).join('')}
                </ol>
            </div>
        `;
        return sopDiv;
    }

    deleteSOP(sopId) {
        if (confirm('Are you sure you want to delete this SOP?')) {
            this.currentTemplate.sops = this.currentTemplate.sops.filter(sop => sop.id !== sopId);
            this.renderSOPs();
        }
    }

    // ========================================
    // SAVE TEMPLATE
    // ========================================

    saveJobTemplate() {
        console.log('🎯 SAVING JOB TEMPLATE...');

        // Prevent multiple saves
        if (this.isSaving) {
            console.log('Save already in progress, ignoring...');
            return;
        }
        this.isSaving = true;

        // Get form data
        const templateCode = document.getElementById('template-code')?.value || '';
        const templateName = document.getElementById('template-name')?.value || '';
        const templateDescription = document.getElementById('template-description')?.value || '';
        const totalHours = document.getElementById('total-hours')?.value || '0';

        console.log('Form data:', { templateCode, templateName, templateDescription, totalHours });

        // Validate required fields
        if (!templateCode || !templateName) {
            alert('Please fill in the required fields (Template Code and Name).');
            this.isSaving = false;
            return;
        }

        // Validate that we have some content
        const hasContent = this.currentTemplate.tasks.length > 0 ||
                          this.currentTemplate.skills.length > 0 ||
                          this.currentTemplate.bomItems.length > 0 ||
                          this.currentTemplate.tools.length > 0 ||
                          this.currentTemplate.sops.length > 0 ||
                          this.currentTemplate.safetyInstructions.length > 0;

        if (!hasContent) {
            const addSampleData = confirm('No content has been added to this template. Would you like to add sample data automatically?');
            if (addSampleData) {
                this.addSampleTasks();
                this.addSampleSkills();
                this.addSampleBOM();
                this.addSampleTools();
                this.addSampleSOPs();
                this.addSampleSafety();
            }
        }

        // Create template object
        const template = {
            id: Date.now(),
            code: templateCode,
            name: templateName,
            description: templateDescription,
            totalHours: parseFloat(totalHours) || 0,
            tasks: [...this.currentTemplate.tasks],
            skills: [...this.currentTemplate.skills],
            bomItems: [...this.currentTemplate.bomItems],
            tools: [...this.currentTemplate.tools],
            sops: [...this.currentTemplate.sops],
            safetyInstructions: [...this.currentTemplate.safetyInstructions],
            createdDate: new Date().toISOString(),
            createdBy: 'current-user@example.com',
            status: 'active'
        };

        // Save as Job Template (check for duplicates)
        const existingTemplates = JSON.parse(localStorage.getItem('jobTemplates') || '[]');

        // If editing existing template, update it instead of adding new one
        if (this.currentTemplate.id) {
            const existingIndex = existingTemplates.findIndex(t => t.id === this.currentTemplate.id);
            if (existingIndex !== -1) {
                existingTemplates[existingIndex] = template;
                console.log('Updated existing template');
            } else {
                existingTemplates.push(template);
                console.log('Added new template (edit mode but not found)');
            }
        } else {
            // Check if template with same code already exists
            const existingTemplate = existingTemplates.find(t => t.code === template.code);
            if (existingTemplate) {
                // Update existing template instead of creating duplicate
                const existingIndex = existingTemplates.findIndex(t => t.code === template.code);
                existingTemplates[existingIndex] = template;
                console.log('Updated existing template with same code');
            } else {
                existingTemplates.push(template);
                console.log('Added new template');
            }
        }

        localStorage.setItem('jobTemplates', JSON.stringify(existingTemplates));

        // Handle Service Bundle creation/update
        const existingBundles = JSON.parse(localStorage.getItem('serviceBundles') || '[]');

        if (this.isEditingBundle && this.editingBundleId) {
            // Update existing bundle
            const bundleIndex = existingBundles.findIndex(b => b.id === this.editingBundleId);
            if (bundleIndex !== -1) {
                const existingBundle = existingBundles[bundleIndex];
                existingBundles[bundleIndex] = {
                    ...existingBundle,
                    name: templateName,
                    description: templateDescription,
                    totalHours: parseFloat(totalHours) || 0,
                    estimatedCost: this.calculateBundleCost(template),
                    template: template,
                    updatedDate: new Date().toISOString(),
                    updatedBy: 'current-user@example.com'
                };
                console.log('Updated existing service bundle');
            }
        } else {
            // Create new Service Bundle
            const serviceBundle = {
                id: Date.now() + 1,
                code: templateCode + '-BUNDLE',
                name: templateName + ' Bundle',
                description: templateDescription,
                type: 'service-package',
                category: 'automotive',
                totalHours: parseFloat(totalHours) || 0,
                estimatedCost: this.calculateBundleCost(template),
                template: template,
                status: 'active',
                createdDate: new Date().toISOString(),
                createdBy: 'current-user@example.com'
            };

            // Check if bundle with same code already exists
            const existingBundle = existingBundles.find(b => b.code === serviceBundle.code);
            if (existingBundle) {
                // Update existing bundle instead of creating duplicate
                const existingIndex = existingBundles.findIndex(b => b.code === serviceBundle.code);
                existingBundles[existingIndex] = serviceBundle;
                console.log('Updated existing service bundle with same code');
            } else {
                existingBundles.push(serviceBundle);
                console.log('Added new service bundle');
            }
        }

        localStorage.setItem('serviceBundles', JSON.stringify(existingBundles));

        // Show success message
        const actionText = this.isEditingBundle ? 'updated' : 'created';
        this.showModernNotification(`✅ Service Package "${templateName}" ${actionText} successfully!`, 'success');

        // Close dialog
        this.closeJobTemplateDialog();

        // Navigate to service bundles section and refresh view
        this.navigateToSection('bundles');

        console.log('✅ Job Template and Service Bundle saved:', { template });

        // Reset editing state and saving flag
        this.resetEditingState();
        this.isSaving = false;
    }

    renderSavedTemplates() {
        console.log('🎯 Rendering saved templates...');

        const templatesGrid = document.getElementById('saved-templates-grid');
        const emptyState = document.getElementById('templates-empty-state');

        if (!templatesGrid) {
            console.error('Templates grid not found');
            return;
        }

        // Get saved templates from localStorage
        const savedTemplates = JSON.parse(localStorage.getItem('jobTemplates') || '[]');
        console.log('Found saved templates:', savedTemplates);

        if (savedTemplates.length === 0) {
            // Show empty state
            templatesGrid.style.display = 'none';
            if (emptyState) {
                emptyState.style.display = 'block';
            }
            return;
        }

        // Hide empty state and show grid
        if (emptyState) {
            emptyState.style.display = 'none';
        }
        templatesGrid.style.display = 'grid';

        // Clear existing content
        templatesGrid.innerHTML = '';

        // Render each template
        savedTemplates.forEach(template => {
            const templateCard = this.createTemplateCard(template);
            templatesGrid.appendChild(templateCard);
        });

        console.log(`✅ Rendered ${savedTemplates.length} templates`);
    }

    createTemplateCard(template) {
        const card = document.createElement('div');
        card.className = 'service-card';
        card.setAttribute('data-template-id', template.id);

        const totalItems = (template.tasks?.length || 0) +
                          (template.skills?.length || 0) +
                          (template.bomItems?.length || 0) +
                          (template.tools?.length || 0) +
                          (template.sops?.length || 0) +
                          (template.safetyInstructions?.length || 0);

        card.innerHTML = `
            <div class="service-card__header">
                <div class="service-header-content">
                    <h3 class="service-card__title">${template.name}</h3>
                    <span class="service-code">${template.code}</span>
                </div>
                <div class="service-pricing">
                    <span class="price">$${this.calculateBundleCost(template).toFixed(2)}</span>
                </div>
            </div>
            <div class="service-card__content">
                <div class="service-card__status ${template.status}">${template.status.toUpperCase()}</div>
                <p class="service-card__description">${template.description || 'No description provided'}</p>

                <div class="service-metadata">
                    <div class="metadata-item">
                        <span class="label">Total Hours:</span>
                        <span class="value">${template.totalHours || 0} hours</span>
                    </div>
                    <div class="metadata-item">
                        <span class="label">Components:</span>
                        <span class="value">${totalItems} items</span>
                    </div>
                    <div class="metadata-item">
                        <span class="label">Tasks:</span>
                        <span class="value">${template.tasks?.length || 0}</span>
                    </div>
                    <div class="metadata-item">
                        <span class="label">Skills:</span>
                        <span class="value">${template.skills?.length || 0}</span>
                    </div>
                    <div class="metadata-item">
                        <span class="label">BOM Items:</span>
                        <span class="value">${template.bomItems?.length || 0}</span>
                    </div>
                    <div class="metadata-item">
                        <span class="label">Tools:</span>
                        <span class="value">${template.tools?.length || 0}</span>
                    </div>
                    <div class="metadata-item">
                        <span class="label">SOPs:</span>
                        <span class="value">${template.sops?.length || 0}</span>
                    </div>
                    <div class="metadata-item">
                        <span class="label">Safety:</span>
                        <span class="value">${template.safetyInstructions?.length || 0}</span>
                    </div>
                    <div class="metadata-item">
                        <span class="label">Created:</span>
                        <span class="value">${new Date(template.createdDate).toLocaleDateString()}</span>
                    </div>
                </div>

                <div class="service-card__actions">
                    <button class="mdc-button mdc-button--outlined" onclick="app.viewTemplate(${template.id})">
                        <span class="mdc-button__ripple"></span>
                        <i class="material-icons mdc-button__icon">visibility</i>
                        <span class="mdc-button__label">View</span>
                    </button>
                    <button class="mdc-button mdc-button--outlined" onclick="app.editTemplate(${template.id})">
                        <span class="mdc-button__ripple"></span>
                        <i class="material-icons mdc-button__icon">edit</i>
                        <span class="mdc-button__label">Edit</span>
                    </button>
                    <button class="mdc-button mdc-button--outlined" onclick="app.cloneTemplate(${template.id})">
                        <span class="mdc-button__ripple"></span>
                        <i class="material-icons mdc-button__icon">content_copy</i>
                        <span class="mdc-button__label">Clone</span>
                    </button>
                    <button class="mdc-button mdc-button--outlined" onclick="app.deleteTemplate(${template.id})">
                        <span class="mdc-button__ripple"></span>
                        <i class="material-icons mdc-button__icon">delete</i>
                        <span class="mdc-button__label">Delete</span>
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    viewTemplate(templateId) {
        console.log('Viewing template:', templateId);
        const templates = JSON.parse(localStorage.getItem('jobTemplates') || '[]');
        const template = templates.find(t => t.id === templateId);

        if (template) {
            // Create a detailed view modal
            this.showTemplateDetailsModal(template);
        } else {
            this.showSnackbar('Template not found');
        }
    }

    editTemplate(templateId) {
        console.log('Editing template:', templateId);
        const templates = JSON.parse(localStorage.getItem('jobTemplates') || '[]');
        const template = templates.find(t => t.id === templateId);

        if (template) {
            // Load template data into the dialog and open it
            this.loadTemplateForEditing(template);
            this.openJobTemplateDialog();
        } else {
            this.showSnackbar('Template not found');
        }
    }

    cloneTemplate(templateId) {
        console.log('Cloning template:', templateId);
        const templates = JSON.parse(localStorage.getItem('jobTemplates') || '[]');
        const template = templates.find(t => t.id === templateId);

        if (template) {
            // Create a copy with new ID and modified name
            const clonedTemplate = {
                ...template,
                id: Date.now(),
                code: template.code + '-COPY',
                name: template.name + ' (Copy)',
                createdDate: new Date().toISOString(),
                createdBy: 'current-user@example.com'
            };

            // Save the cloned template
            templates.push(clonedTemplate);
            localStorage.setItem('jobTemplates', JSON.stringify(templates));

            // Refresh the view
            this.renderSavedTemplates();
            this.showModernNotification(`Template "${template.name}" cloned successfully!`, 'success');
        } else {
            this.showSnackbar('Template not found');
        }
    }

    deleteTemplate(templateId) {
        console.log('Deleting template:', templateId);
        const templates = JSON.parse(localStorage.getItem('jobTemplates') || '[]');
        const template = templates.find(t => t.id === templateId);

        if (template) {
            if (confirm(`Are you sure you want to delete the template "${template.name}"? This action cannot be undone.`)) {
                // Remove template from array
                const updatedTemplates = templates.filter(t => t.id !== templateId);
                localStorage.setItem('jobTemplates', JSON.stringify(updatedTemplates));

                // Also remove associated service bundle if exists
                const bundles = JSON.parse(localStorage.getItem('serviceBundles') || '[]');
                const updatedBundles = bundles.filter(b => b.template?.id !== templateId);
                localStorage.setItem('serviceBundles', JSON.stringify(updatedBundles));

                // Refresh the view
                this.renderSavedTemplates();
                this.showModernNotification(`Template "${template.name}" deleted successfully!`, 'success');
            }
        } else {
            this.showSnackbar('Template not found');
        }
    }

    showTemplateDetailsModal(template) {
        // Create a detailed view modal for the template
        const modal = document.createElement('div');
        modal.className = 'input-modal-overlay';
        modal.innerHTML = `
            <div class="input-modal" style="max-width: 800px;">
                <div class="input-modal-header">
                    <h2 class="input-modal-title">
                        <i class="material-icons">dashboard_customize</i>
                        Template Details: ${template.name}
                    </h2>
                    <p class="input-modal-subtitle">Code: ${template.code} | Status: ${template.status}</p>
                </div>
                <div class="input-modal-body">
                    <div class="template-details-content">
                        <div class="detail-section">
                            <h4>Description</h4>
                            <p>${template.description || 'No description provided'}</p>
                        </div>

                        <div class="detail-section">
                            <h4>Tasks (${template.tasks?.length || 0})</h4>
                            ${template.tasks?.length ? template.tasks.map(task => `
                                <div class="detail-item">
                                    <strong>${task.name}</strong> - ${task.hours} hours
                                    <br><small>${task.description}</small>
                                </div>
                            `).join('') : '<p>No tasks defined</p>'}
                        </div>

                        <div class="detail-section">
                            <h4>Skills Required (${template.skills?.length || 0})</h4>
                            ${template.skills?.length ? template.skills.map(skill => `
                                <div class="detail-item">
                                    <strong>${skill.name}</strong> - Level: ${skill.level}
                                    ${skill.certification ? '<br><small>Certification Required</small>' : ''}
                                </div>
                            `).join('') : '<p>No skills defined</p>'}
                        </div>

                        <div class="detail-section">
                            <h4>BOM Items (${template.bomItems?.length || 0})</h4>
                            ${template.bomItems?.length ? template.bomItems.map(item => `
                                <div class="detail-item">
                                    <strong>${item.name}</strong> - Qty: ${item.quantity} | $${item.cost}
                                    <br><small>${item.description}</small>
                                </div>
                            `).join('') : '<p>No BOM items defined</p>'}
                        </div>

                        <div class="detail-section">
                            <h4>Tools Required (${template.tools?.length || 0})</h4>
                            ${template.tools?.length ? template.tools.map(tool => `
                                <div class="detail-item">
                                    <strong>${tool.name}</strong> - ${tool.type}
                                    <br><small>${tool.description}</small>
                                </div>
                            `).join('') : '<p>No tools defined</p>'}
                        </div>

                        <div class="detail-section">
                            <h4>SOPs (${template.sops?.length || 0})</h4>
                            ${template.sops?.length ? template.sops.map((sop, index) => `
                                <div class="detail-item">
                                    <strong>Step ${index + 1}:</strong> ${sop}
                                </div>
                            `).join('') : '<p>No SOPs defined</p>'}
                        </div>

                        <div class="detail-section">
                            <h4>Safety Instructions (${template.safetyInstructions?.length || 0})</h4>
                            ${template.safetyInstructions?.length ? template.safetyInstructions.map((safety, index) => `
                                <div class="detail-item">
                                    <strong>Safety ${index + 1}:</strong> ${safety}
                                </div>
                            `).join('') : '<p>No safety instructions defined</p>'}
                        </div>
                    </div>
                </div>
                <div class="input-modal-footer">
                    <button class="modal-btn modal-btn-secondary" onclick="this.closest('.input-modal-overlay').remove()">Close</button>
                    <button class="modal-btn modal-btn-primary" onclick="app.editTemplate(${template.id}); this.closest('.input-modal-overlay').remove();">Edit Template</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    loadTemplateForEditing(template) {
        // Load template data into the current template object for editing
        this.currentTemplate = {
            id: template.id,
            tasks: [...(template.tasks || [])],
            skills: [...(template.skills || [])],
            bomItems: [...(template.bomItems || [])],
            tools: [...(template.tools || [])],
            sops: [...(template.sops || [])],
            safetyInstructions: [...(template.safetyInstructions || [])]
        };

        // Pre-fill form fields when dialog opens
        setTimeout(() => {
            this.setMDCFieldValue('template-code', template.code);
            this.setMDCFieldValue('template-name', template.name);
            this.setMDCFieldValue('template-description', template.description || '');

            // Update all sections with existing data
            this.updateTasksContainer();
            this.updateSkillsContainer();
            this.updateBOMContainer();
            this.updateToolsContainer();
            this.updateSOPsContainer();
            this.updateSafetyContainer();
        }, 500);

        console.log('Template loaded for editing:', template);
    }

    calculateBundleCost(template) {
        let totalCost = 0;

        // Calculate BOM costs
        template.bomItems.forEach(item => {
            totalCost += (item.cost || 0) * (item.quantity || 1);
        });

        // Add labor cost (estimated at $75/hour)
        totalCost += template.totalHours * 75;

        return totalCost;
    }

    // Utility function to clear all templates (for testing)
    clearAllTemplates() {
        if (confirm('Are you sure you want to clear all templates? This action cannot be undone.')) {
            localStorage.removeItem('jobTemplates');
            localStorage.removeItem('serviceBundles');
            this.renderSavedTemplates();
            this.showModernNotification('All templates cleared successfully!', 'success');
            console.log('All templates cleared');
        }
    }

    // Sample data functions for auto-population
    addSampleSkills() {
        const sampleSkills = [
            { id: Date.now() + 1, name: 'ASE A1 - Engine Repair', level: 'Expert', type: 'Certification', required: true },
            { id: Date.now() + 2, name: 'ASE A5 - Brakes', level: 'Expert', type: 'Certification', required: true },
            { id: Date.now() + 3, name: 'OSHA Safety Compliance', level: 'Expert', type: 'Safety', required: true }
        ];
        this.currentTemplate.skills.push(...sampleSkills);
        this.renderSkills();
    }

    addSampleBOM() {
        const sampleBOM = [
            { id: Date.now() + 1, partNumber: 'ENG-001', description: 'Engine Oil Filter', category: 'Engine', quantity: 1, unit: 'each', cost: 12.50 },
            { id: Date.now() + 2, partNumber: 'ENG-002', description: 'Synthetic Motor Oil 5W-30', category: 'Engine', quantity: 5, unit: 'quart', cost: 8.99 },
            { id: Date.now() + 3, partNumber: 'BRK-001', description: 'Brake Pad Set - Front', category: 'Brakes', quantity: 1, unit: 'set', cost: 65.00 }
        ];
        this.currentTemplate.bomItems.push(...sampleBOM);
        this.renderBOMItems();
    }

    addSampleTools() {
        const sampleTools = [
            { id: Date.now() + 1, name: 'Socket Set - Metric', specification: '8mm-32mm, 1/2" drive', category: 'Hand Tools', required: true },
            { id: Date.now() + 2, name: 'Torque Wrench', specification: '10-150 ft-lbs, 1/2" drive', category: 'Hand Tools', required: true },
            { id: Date.now() + 3, name: 'Floor Jack', specification: '3-ton capacity, hydraulic', category: 'Lifting Equipment', required: true }
        ];
        this.currentTemplate.tools.push(...sampleTools);
        this.renderTools();
    }

    addSampleSOPs() {
        const sampleSOPs = [
            {
                id: Date.now() + 1,
                title: 'Vehicle Lift Safety Procedure',
                category: 'Safety',
                steps: ['Inspect lift for damage', 'Position vehicle properly', 'Engage safety locks', 'Never exceed weight capacity']
            },
            {
                id: Date.now() + 2,
                title: 'Engine Oil Change Procedure',
                category: 'Maintenance',
                steps: ['Warm engine to operating temperature', 'Position drain pan', 'Remove drain plug', 'Replace oil filter', 'Add new oil']
            }
        ];
        this.currentTemplate.sops.push(...sampleSOPs);
        this.renderSOPs();
    }

    addSampleSafety() {
        const sampleSafety = [
            {
                id: Date.now() + 1,
                title: 'Personal Protective Equipment (PPE)',
                priority: 'high',
                category: 'General Safety',
                warning: 'PPE is mandatory for all service operations',
                checklist: ['Wear safety glasses at all times', 'Use nitrile gloves when handling fluids', 'Wear steel-toed safety boots']
            },
            {
                id: Date.now() + 2,
                title: 'Lifting and Jack Safety',
                priority: 'high',
                category: 'Equipment Safety',
                warning: 'Improper lifting can cause serious injury',
                checklist: ['Never work under vehicle supported only by jack', 'Always use jack stands', 'Use proper lift points']
            }
        ];
        this.currentTemplate.safetyInstructions.push(...sampleSafety);
        this.renderSafetyInstructions();
    }

    // ========================================
    // SAFETY INSTRUCTIONS MANAGEMENT
    // ========================================

    initializeSafetyHandlers() {
        const addSafetyBtn = document.getElementById('add-safety-btn');
        if (addSafetyBtn) {
            addSafetyBtn.addEventListener('click', () => {
                this.addSafetyInstruction();
            });
        }

        const addPredefinedSafetyBtn = document.getElementById('add-predefined-safety-btn');
        if (addPredefinedSafetyBtn) {
            addPredefinedSafetyBtn.addEventListener('click', () => {
                this.showPredefinedSafetyDialog();
            });
        }
    }

    addSafetyInstruction() {
        const safetyTitle = prompt('Enter safety instruction title:');
        if (safetyTitle) {
            const priority = prompt('Enter priority level (High/Medium/Low):') || 'High';
            const warningText = prompt('Enter warning/caution text (optional):') || '';

            const checklist = [];
            let checkCount = 1;

            while (true) {
                const checkItem = prompt(`Enter safety checklist item ${checkCount} (or click Cancel to finish):`);
                if (!checkItem) break;
                checklist.push(checkItem);
                checkCount++;
            }

            if (checklist.length > 0) {
                const safetyInstruction = {
                    id: Date.now(),
                    title: safetyTitle,
                    priority: priority.toLowerCase(),
                    warning: warningText,
                    checklist: checklist
                };

                this.currentTemplate.safetyInstructions.push(safetyInstruction);
                this.renderSafetyInstructions();
            }
        }
    }

    showPredefinedSafetyDialog() {
        const predefinedSafety = this.getPredefinedSafetyInstructions();

        let dialogHTML = `
            <div style="max-height: 400px; overflow-y: auto; padding: 10px;">
                <h3>Select Predefined Safety Instructions</h3>
                <div style="display: grid; gap: 10px;">
        `;

        predefinedSafety.forEach((safety, index) => {
            const priorityColor = safety.priority === 'High' ? '#d32f2f' : safety.priority === 'Medium' ? '#f57c00' : '#388e3c';
            dialogHTML += `
                <div style="border: 1px solid #ddd; padding: 10px; border-radius: 5px; cursor: pointer;"
                     onclick="window.app.addPredefinedSafety(${index})">
                    <strong>${safety.title}</strong> (${safety.category})
                    <br><small style="color: ${priorityColor};">
                        Priority: ${safety.priority} | ${safety.instructions.length} instructions
                    </small>
                </div>
            `;
        });

        dialogHTML += `
                </div>
                <br>
                <button onclick="this.parentElement.parentElement.remove()"
                        style="padding: 8px 16px; background: #f44336; color: white; border: none; border-radius: 4px;">
                    Close
                </button>
            </div>
        `;

        const dialogDiv = document.createElement('div');
        dialogDiv.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: white; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10000; max-width: 600px; width: 90%;
        `;
        dialogDiv.innerHTML = dialogHTML;
        document.body.appendChild(dialogDiv);
    }

    getPredefinedSafetyInstructions() {
        const predefinedSafety = [
            {
                title: 'Personal Protective Equipment (PPE)',
                priority: 'high',
                category: 'General Safety',
                description: 'PPE is mandatory for all service operations',
                instructions: ['Wear safety glasses at all times', 'Use nitrile gloves when handling fluids', 'Wear steel-toed safety boots']
            },
            {
                title: 'Lifting and Jack Safety',
                priority: 'high',
                category: 'Equipment Safety',
                description: 'Improper lifting can cause serious injury',
                instructions: ['Never work under vehicle supported only by jack', 'Always use jack stands', 'Use proper lift points']
            },
            {
                title: 'Electrical Safety',
                priority: 'medium',
                category: 'Electrical Safety',
                description: 'Electrical safety when working on vehicle systems',
                instructions: ['Disconnect battery before electrical work', 'Use insulated tools', 'Check for live circuits']
            },
            {
                title: 'Chemical Handling',
                priority: 'high',
                category: 'Chemical Safety',
                description: 'Safe handling of automotive fluids and chemicals',
                instructions: ['Read all MSDS sheets', 'Use proper ventilation', 'Dispose of waste properly']
            },
            {
                title: 'Tool Safety',
                priority: 'medium',
                category: 'Tool Safety',
                description: 'Proper use and maintenance of tools',
                instructions: ['Inspect tools before use', 'Use tools for intended purpose', 'Keep tools clean and maintained']
            }
        ];

        return predefinedSafety;
    }

    addPredefinedSafety(index) {
        const predefinedSafety = this.getPredefinedSafetyInstructions();
        const selectedSafety = predefinedSafety[index];

        if (selectedSafety) {
            const safety = {
                id: Date.now(),
                title: selectedSafety.title,
                priority: selectedSafety.priority.toLowerCase(),
                category: selectedSafety.category,
                warning: selectedSafety.description,
                checklist: [...selectedSafety.instructions]
            };

            this.currentTemplate.safetyInstructions.push(safety);
            this.renderSafetyInstructions();
            this.showModernNotification(`Added safety instruction: ${selectedSafety.title}`, 'success');

            // Close dialog
            const dialogs = document.querySelectorAll('div[style*="position: fixed"]');
            dialogs.forEach(dialog => {
                if (dialog.textContent.includes('Select Predefined Safety')) {
                    dialog.remove();
                }
            });
        }
    }

    renderSafetyInstructions() {
        const container = document.getElementById('safety-container');
        if (!container) return;

        if (this.currentTemplate.safetyInstructions.length === 0) {
            container.innerHTML = '<div class="container-empty">No safety instructions added yet. Click "Add Safety Instruction" to define safety protocols.</div>';
            return;
        }

        container.innerHTML = '';
        this.currentTemplate.safetyInstructions.forEach(safety => {
            const safetyElement = this.createSafetyElement(safety);
            container.appendChild(safetyElement);
        });
    }

    createSafetyElement(safety) {
        const safetyDiv = document.createElement('div');
        safetyDiv.className = 'safety-item';
        safetyDiv.innerHTML = `
            <div class="safety-header">
                <div class="safety-icon">
                    <i class="material-icons">security</i>
                </div>
                <h4 class="safety-title">${safety.title}</h4>
                <span class="safety-priority ${safety.priority}">${safety.priority.toUpperCase()}</span>
                <div class="task-actions">
                    <button type="button" onclick="app.deleteSafetyInstruction(${safety.id})" title="Delete Safety Instruction">
                        <i class="material-icons">delete</i>
                    </button>
                </div>
            </div>
            <div class="safety-content">
                <ul class="safety-checklist">
                    ${safety.checklist.map(item => `
                        <li class="safety-check-item">
                            <div class="safety-checkbox">
                                <i class="material-icons">check_box_outline_blank</i>
                            </div>
                            <div class="safety-check-text">${item}</div>
                        </li>
                    `).join('')}
                </ul>
                ${safety.warning ? `
                    <div class="safety-warning">
                        <i class="material-icons">warning</i>
                        <div class="safety-warning-text">${safety.warning}</div>
                    </div>
                ` : ''}
            </div>
        `;
        return safetyDiv;
    }

    deleteSafetyInstruction(safetyId) {
        if (confirm('Are you sure you want to delete this safety instruction?')) {
            this.currentTemplate.safetyInstructions = this.currentTemplate.safetyInstructions.filter(safety => safety.id !== safetyId);
            this.renderSafetyInstructions();
        }
    }

    // ========================================
    // SAMPLE TEMPLATES
    // ========================================

    createSampleJobTemplates() {
        // Check if sample templates already exist
        const existingTemplates = JSON.parse(localStorage.getItem('jobTemplates') || '[]');
        if (existingTemplates.length > 0) return;

        const sampleTemplates = [
            {
                id: 1,
                code: 'ENGINE-OVERHAUL',
                name: 'Complete Engine Overhaul',
                description: 'Comprehensive engine overhaul service including disassembly, inspection, parts replacement, and reassembly.',
                totalHours: 24.0,
                tasks: [
                    {
                        id: 1,
                        name: 'Engine Removal',
                        estimatedHours: 4.0,
                        subtasks: ['Drain fluids', 'Disconnect electrical connections', 'Remove engine mounts', 'Lift engine from bay']
                    },
                    {
                        id: 2,
                        name: 'Disassembly & Inspection',
                        estimatedHours: 8.0,
                        subtasks: ['Remove cylinder head', 'Extract pistons', 'Inspect cylinder walls', 'Check crankshaft condition']
                    },
                    {
                        id: 3,
                        name: 'Parts Replacement',
                        estimatedHours: 6.0,
                        subtasks: ['Replace piston rings', 'Install new gaskets', 'Replace timing components', 'Install new seals']
                    },
                    {
                        id: 4,
                        name: 'Reassembly & Installation',
                        estimatedHours: 6.0,
                        subtasks: ['Reassemble engine block', 'Install cylinder head', 'Mount engine in bay', 'Connect all systems']
                    }
                ],
                skills: [
                    { id: 1, name: 'ASE Engine Repair Certification', level: 'Advanced', required: true },
                    { id: 2, name: 'Hydraulic Lift Operation', level: 'Intermediate', required: true },
                    { id: 3, name: 'Torque Specifications Knowledge', level: 'Expert', required: true }
                ],
                bomItems: [
                    { id: 1, partNumber: 'PR-001', description: 'Piston Ring Set', quantity: 1, unit: 'set', cost: 125.00 },
                    { id: 2, partNumber: 'GK-002', description: 'Complete Gasket Kit', quantity: 1, unit: 'set', cost: 89.50 },
                    { id: 3, partNumber: 'TC-003', description: 'Timing Chain Kit', quantity: 1, unit: 'set', cost: 156.75 },
                    { id: 4, partNumber: 'OIL-004', description: 'Engine Oil (5W-30)', quantity: 6, unit: 'liters', cost: 8.50 }
                ],
                tools: [
                    { id: 1, name: 'Engine Hoist', specification: '2-ton capacity', required: true },
                    { id: 2, name: 'Torque Wrench Set', specification: '10-200 Nm range', required: true },
                    { id: 3, name: 'Cylinder Bore Gauge', specification: 'Digital micrometer', required: true },
                    { id: 4, name: 'Compression Tester', specification: 'Professional grade', required: false }
                ],
                sops: [
                    {
                        id: 1,
                        title: 'Engine Removal Safety Procedure',
                        steps: [
                            'Ensure vehicle is on level ground and properly secured',
                            'Disconnect battery negative terminal',
                            'Drain all engine fluids into appropriate containers',
                            'Support engine with hoist before removing mounts',
                            'Follow manufacturer lifting points specification'
                        ]
                    },
                    {
                        id: 2,
                        title: 'Torque Sequence Protocol',
                        steps: [
                            'Clean all bolt threads and surfaces',
                            'Apply specified thread locker if required',
                            'Tighten bolts in manufacturer specified sequence',
                            'Use calibrated torque wrench for final tightening',
                            'Verify torque values after 30 minutes'
                        ]
                    }
                ],
                safetyInstructions: [
                    {
                        id: 1,
                        title: 'Engine Hoist Safety Protocol',
                        priority: 'high',
                        warning: 'DANGER: Engine weighs over 300kg. Improper lifting can cause serious injury or death.',
                        checklist: [
                            'Verify hoist capacity rating exceeds engine weight',
                            'Inspect all lifting chains and hooks for damage',
                            'Ensure vehicle is on level ground and properly secured',
                            'Clear all personnel from lifting area',
                            'Test hoist operation before attaching to engine'
                        ]
                    },
                    {
                        id: 2,
                        title: 'Chemical Safety Requirements',
                        priority: 'medium',
                        warning: 'Engine fluids contain hazardous chemicals. Use proper PPE.',
                        checklist: [
                            'Wear safety glasses and chemical-resistant gloves',
                            'Ensure adequate ventilation in work area',
                            'Have spill cleanup materials readily available',
                            'Dispose of fluids according to environmental regulations',
                            'Keep MSDS sheets accessible for all chemicals used'
                        ]
                    }
                ],
                createdDate: new Date().toISOString()
            },
            {
                id: 2,
                code: 'BRAKE-SERVICE',
                name: 'Complete Brake System Service',
                description: 'Comprehensive brake system inspection, pad/rotor replacement, and fluid service.',
                totalHours: 3.5,
                tasks: [
                    {
                        id: 1,
                        name: 'Brake Inspection',
                        estimatedHours: 0.5,
                        subtasks: ['Check brake fluid level', 'Inspect brake lines', 'Measure pad thickness', 'Check rotor condition']
                    },
                    {
                        id: 2,
                        name: 'Pad & Rotor Replacement',
                        estimatedHours: 2.0,
                        subtasks: ['Remove wheels', 'Replace brake pads', 'Machine or replace rotors', 'Lubricate slide pins']
                    },
                    {
                        id: 3,
                        name: 'System Testing',
                        estimatedHours: 1.0,
                        subtasks: ['Bleed brake system', 'Test pedal feel', 'Road test vehicle', 'Final inspection']
                    }
                ],
                skills: [
                    { id: 1, name: 'Brake System Certification', level: 'Intermediate', required: true },
                    { id: 2, name: 'Hydraulic Systems Knowledge', level: 'Intermediate', required: true }
                ],
                bomItems: [
                    { id: 1, partNumber: 'BP-001', description: 'Brake Pad Set (Front)', quantity: 1, unit: 'set', cost: 45.00 },
                    { id: 2, partNumber: 'BP-002', description: 'Brake Pad Set (Rear)', quantity: 1, unit: 'set', cost: 35.00 },
                    { id: 3, partNumber: 'BF-003', description: 'Brake Fluid (DOT 3)', quantity: 1, unit: 'liter', cost: 12.00 }
                ],
                tools: [
                    { id: 1, name: 'Brake Bleeder Kit', specification: 'Vacuum type', required: true },
                    { id: 2, name: 'Brake Caliper Tool Set', specification: 'Universal kit', required: true },
                    { id: 3, name: 'Rotor Micrometer', specification: 'Digital', required: false }
                ],
                sops: [
                    {
                        id: 1,
                        title: 'Brake Fluid Handling',
                        steps: [
                            'Use only specified brake fluid type',
                            'Keep brake fluid container sealed',
                            'Avoid contamination with other fluids',
                            'Dispose of old fluid according to regulations'
                        ]
                    }
                ],
                safetyInstructions: [
                    {
                        id: 1,
                        title: 'Brake System Safety Protocol',
                        priority: 'high',
                        warning: 'CRITICAL: Brake system failure can result in accidents. Follow all safety procedures.',
                        checklist: [
                            'Test brake pedal before and after service',
                            'Ensure vehicle is properly supported on jack stands',
                            'Never work under vehicle supported only by jack',
                            'Verify brake fluid level before road test',
                            'Perform complete brake system test before releasing vehicle'
                        ]
                    },
                    {
                        id: 2,
                        title: 'Brake Fluid Handling Safety',
                        priority: 'medium',
                        warning: 'Brake fluid is corrosive and can damage paint and skin.',
                        checklist: [
                            'Wear nitrile gloves when handling brake fluid',
                            'Protect painted surfaces from brake fluid spills',
                            'Use only specified DOT-rated brake fluid',
                            'Keep brake fluid containers sealed to prevent contamination',
                            'Wash hands thoroughly after handling brake fluid'
                        ]
                    }
                ],
                createdDate: new Date().toISOString()
            }
        ];

        // Save sample templates
        localStorage.setItem('jobTemplates', JSON.stringify(sampleTemplates));
        console.log('Sample job templates created');
    }

    // ========================================
    // PREDEFINED LISTS FOR TEMPLATES
    // ========================================

    getPredefinedTasks() {
        return [
            // Engine & Powertrain
            { name: 'Engine Oil Change', category: 'Engine', estimatedHours: 0.5, description: 'Replace engine oil and filter' },
            { name: 'Engine Diagnostic', category: 'Engine', estimatedHours: 1.0, description: 'Comprehensive engine diagnostic scan' },
            { name: 'Timing Belt Replacement', category: 'Engine', estimatedHours: 4.0, description: 'Replace timing belt and tensioners' },
            { name: 'Spark Plug Replacement', category: 'Engine', estimatedHours: 1.5, description: 'Replace spark plugs and inspect ignition system' },
            { name: 'Coolant System Flush', category: 'Engine', estimatedHours: 1.0, description: 'Flush and refill cooling system' },

            // Brake System
            { name: 'Brake Pad Replacement', category: 'Brakes', estimatedHours: 2.0, description: 'Replace front/rear brake pads' },
            { name: 'Brake Fluid Change', category: 'Brakes', estimatedHours: 0.5, description: 'Replace brake fluid and bleed system' },
            { name: 'Brake Rotor Resurfacing', category: 'Brakes', estimatedHours: 1.5, description: 'Machine brake rotors to specification' },
            { name: 'Brake Caliper Service', category: 'Brakes', estimatedHours: 2.5, description: 'Service or replace brake calipers' },

            // Suspension & Steering
            { name: 'Wheel Alignment', category: 'Suspension', estimatedHours: 1.0, description: 'Adjust wheel alignment to specifications' },
            { name: 'Shock Absorber Replacement', category: 'Suspension', estimatedHours: 3.0, description: 'Replace shock absorbers' },
            { name: 'Tire Rotation', category: 'Tires', estimatedHours: 0.5, description: 'Rotate tires according to pattern' },
            { name: 'Tire Replacement', category: 'Tires', estimatedHours: 1.0, description: 'Mount and balance new tires' },

            // Electrical
            { name: 'Battery Test & Replace', category: 'Electrical', estimatedHours: 0.5, description: 'Test battery and replace if needed' },
            { name: 'Alternator Test', category: 'Electrical', estimatedHours: 1.0, description: 'Test charging system and alternator' },
            { name: 'Starter Motor Service', category: 'Electrical', estimatedHours: 2.0, description: 'Test and service starter motor' },

            // Transmission
            { name: 'Transmission Fluid Change', category: 'Transmission', estimatedHours: 1.0, description: 'Replace transmission fluid and filter' },
            { name: 'Transmission Diagnostic', category: 'Transmission', estimatedHours: 1.5, description: 'Diagnostic scan of transmission system' },

            // HVAC
            { name: 'A/C System Service', category: 'HVAC', estimatedHours: 1.5, description: 'Service air conditioning system' },
            { name: 'Cabin Air Filter Replacement', category: 'HVAC', estimatedHours: 0.25, description: 'Replace cabin air filter' },

            // General Maintenance
            { name: 'Multi-Point Inspection', category: 'Inspection', estimatedHours: 1.0, description: 'Comprehensive vehicle inspection' },
            { name: 'Fluid Level Check', category: 'Maintenance', estimatedHours: 0.25, description: 'Check all fluid levels' },
            { name: 'Belt & Hose Inspection', category: 'Maintenance', estimatedHours: 0.5, description: 'Inspect belts and hoses for wear' }
        ];
    }

    getPredefinedSkills() {
        return [
            // Certifications
            { name: 'ASE A1 - Engine Repair', level: 'Expert', type: 'Certification', mandatory: true },
            { name: 'ASE A2 - Automatic Transmission', level: 'Expert', type: 'Certification', mandatory: true },
            { name: 'ASE A3 - Manual Drive Train', level: 'Advanced', type: 'Certification', mandatory: false },
            { name: 'ASE A4 - Suspension & Steering', level: 'Expert', type: 'Certification', mandatory: true },
            { name: 'ASE A5 - Brakes', level: 'Expert', type: 'Certification', mandatory: true },
            { name: 'ASE A6 - Electrical/Electronic Systems', level: 'Advanced', type: 'Certification', mandatory: true },
            { name: 'ASE A7 - Heating & Air Conditioning', level: 'Advanced', type: 'Certification', mandatory: false },
            { name: 'ASE A8 - Engine Performance', level: 'Expert', type: 'Certification', mandatory: true },

            // Technical Skills
            { name: 'Hydraulic Systems', level: 'Advanced', type: 'Technical', mandatory: true },
            { name: 'Pneumatic Systems', level: 'Intermediate', type: 'Technical', mandatory: false },
            { name: 'Welding & Fabrication', level: 'Intermediate', type: 'Technical', mandatory: false },
            { name: 'Diagnostic Equipment Operation', level: 'Advanced', type: 'Technical', mandatory: true },
            { name: 'Computer Systems Diagnostic', level: 'Advanced', type: 'Technical', mandatory: true },
            { name: 'Torque Specifications', level: 'Expert', type: 'Technical', mandatory: true },

            // Safety Skills
            { name: 'OSHA Safety Compliance', level: 'Expert', type: 'Safety', mandatory: true },
            { name: 'Hazardous Materials Handling', level: 'Advanced', type: 'Safety', mandatory: true },
            { name: 'Lift Operation Certification', level: 'Advanced', type: 'Safety', mandatory: true },
            { name: 'Fire Safety & Prevention', level: 'Intermediate', type: 'Safety', mandatory: true }
        ];
    }

    getPredefinedBOMItems() {
        return [
            // Engine Components
            { partNumber: 'ENG-001', description: 'Engine Oil Filter', category: 'Engine', unitCost: 12.50, unit: 'each' },
            { partNumber: 'ENG-002', description: 'Synthetic Motor Oil 5W-30', category: 'Engine', unitCost: 8.99, unit: 'quart' },
            { partNumber: 'ENG-003', description: 'Spark Plug Set', category: 'Engine', unitCost: 45.00, unit: 'set' },
            { partNumber: 'ENG-004', description: 'Air Filter', category: 'Engine', unitCost: 18.75, unit: 'each' },
            { partNumber: 'ENG-005', description: 'Timing Belt Kit', category: 'Engine', unitCost: 125.00, unit: 'kit' },
            { partNumber: 'ENG-006', description: 'Coolant/Antifreeze', category: 'Engine', unitCost: 15.99, unit: 'gallon' },

            // Brake Components
            { partNumber: 'BRK-001', description: 'Brake Pad Set - Front', category: 'Brakes', unitCost: 65.00, unit: 'set' },
            { partNumber: 'BRK-002', description: 'Brake Pad Set - Rear', category: 'Brakes', unitCost: 55.00, unit: 'set' },
            { partNumber: 'BRK-003', description: 'Brake Fluid DOT 3', category: 'Brakes', unitCost: 8.50, unit: 'bottle' },
            { partNumber: 'BRK-004', description: 'Brake Rotor - Front', category: 'Brakes', unitCost: 85.00, unit: 'each' },
            { partNumber: 'BRK-005', description: 'Brake Rotor - Rear', category: 'Brakes', unitCost: 75.00, unit: 'each' },

            // Transmission Components
            { partNumber: 'TRN-001', description: 'Transmission Fluid ATF', category: 'Transmission', unitCost: 12.99, unit: 'quart' },
            { partNumber: 'TRN-002', description: 'Transmission Filter Kit', category: 'Transmission', unitCost: 35.00, unit: 'kit' },

            // Electrical Components
            { partNumber: 'ELC-001', description: 'Battery 12V Group 24', category: 'Electrical', unitCost: 125.00, unit: 'each' },
            { partNumber: 'ELC-002', description: 'Alternator Belt', category: 'Electrical', unitCost: 25.00, unit: 'each' },

            // Suspension Components
            { partNumber: 'SUS-001', description: 'Shock Absorber - Front', category: 'Suspension', unitCost: 95.00, unit: 'each' },
            { partNumber: 'SUS-002', description: 'Shock Absorber - Rear', category: 'Suspension', unitCost: 85.00, unit: 'each' },

            // HVAC Components
            { partNumber: 'HVC-001', description: 'Cabin Air Filter', category: 'HVAC', unitCost: 22.50, unit: 'each' },
            { partNumber: 'HVC-002', description: 'A/C Refrigerant R134a', category: 'HVAC', unitCost: 45.00, unit: 'can' },

            // Consumables
            { partNumber: 'CON-001', description: 'Shop Rags', category: 'Consumables', unitCost: 15.00, unit: 'pack' },
            { partNumber: 'CON-002', description: 'Degreaser Spray', category: 'Consumables', unitCost: 8.99, unit: 'bottle' },
            { partNumber: 'CON-003', description: 'Thread Locker Blue', category: 'Consumables', unitCost: 12.50, unit: 'bottle' },
            { partNumber: 'CON-004', description: 'Gasket Sealer', category: 'Consumables', unitCost: 9.99, unit: 'tube' }
        ];
    }

    getPredefinedTools() {
        return [
            // Hand Tools
            { name: 'Socket Set - Metric', specifications: '8mm-32mm, 1/2" drive', required: true, category: 'Hand Tools' },
            { name: 'Socket Set - SAE', specifications: '5/16"-1.25", 1/2" drive', required: true, category: 'Hand Tools' },
            { name: 'Torque Wrench', specifications: '10-150 ft-lbs, 1/2" drive', required: true, category: 'Hand Tools' },
            { name: 'Combination Wrench Set', specifications: 'Metric & SAE, 8mm-32mm', required: true, category: 'Hand Tools' },
            { name: 'Screwdriver Set', specifications: 'Phillips & Flathead, various sizes', required: true, category: 'Hand Tools' },
            { name: 'Pliers Set', specifications: 'Needle nose, standard, wire cutters', required: true, category: 'Hand Tools' },

            // Power Tools
            { name: 'Impact Wrench', specifications: '1/2" drive, pneumatic', required: true, category: 'Power Tools' },
            { name: 'Air Ratchet', specifications: '3/8" drive, pneumatic', required: false, category: 'Power Tools' },
            { name: 'Drill/Driver Set', specifications: 'Cordless, with bits', required: false, category: 'Power Tools' },

            // Specialized Tools
            { name: 'Engine Hoist', specifications: '2-ton capacity, hydraulic', required: true, category: 'Lifting Equipment' },
            { name: 'Floor Jack', specifications: '3-ton capacity, hydraulic', required: true, category: 'Lifting Equipment' },
            { name: 'Jack Stands', specifications: '3-ton capacity, pair', required: true, category: 'Lifting Equipment' },
            { name: 'Brake Bleeder Kit', specifications: 'Vacuum type with gauges', required: true, category: 'Brake Tools' },
            { name: 'Brake Caliper Tool', specifications: 'Piston compression tool', required: true, category: 'Brake Tools' },

            // Diagnostic Equipment
            { name: 'OBD-II Scanner', specifications: 'Professional grade, live data', required: true, category: 'Diagnostic' },
            { name: 'Multimeter', specifications: 'Digital, automotive rated', required: true, category: 'Diagnostic' },
            { name: 'Compression Tester', specifications: 'Gasoline engine, gauge set', required: false, category: 'Diagnostic' },
            { name: 'Fuel Pressure Tester', specifications: 'Universal kit with adapters', required: false, category: 'Diagnostic' },

            // Measuring Tools
            { name: 'Feeler Gauge Set', specifications: 'Metric & SAE, 0.05-1.0mm', required: true, category: 'Measuring' },
            { name: 'Micrometer Set', specifications: '0-25mm, 25-50mm, 50-75mm', required: false, category: 'Measuring' },
            { name: 'Dial Indicator', specifications: '0.01mm resolution with base', required: false, category: 'Measuring' }
        ];
    }

    getPredefinedSOPs() {
        return [
            {
                title: 'Vehicle Lift Safety Procedure',
                category: 'Safety',
                steps: [
                    'Inspect lift for damage or wear before use',
                    'Position vehicle properly on lift points',
                    'Ensure all doors and hood are closed',
                    'Raise vehicle slowly and check stability',
                    'Engage safety locks before working under vehicle',
                    'Never exceed lift weight capacity',
                    'Lower vehicle slowly and ensure area is clear'
                ]
            },
            {
                title: 'Engine Oil Change Procedure',
                category: 'Maintenance',
                steps: [
                    'Warm engine to operating temperature',
                    'Position drain pan under oil drain plug',
                    'Remove drain plug and allow oil to drain completely',
                    'Remove and replace oil filter',
                    'Clean drain plug and install with new gasket',
                    'Add new oil per manufacturer specifications',
                    'Check oil level and top off if needed',
                    'Reset oil life monitor if equipped',
                    'Dispose of waste oil and filter properly'
                ]
            },
            {
                title: 'Brake System Service Procedure',
                category: 'Brakes',
                steps: [
                    'Inspect brake fluid level and condition',
                    'Remove wheels and inspect brake components',
                    'Check brake pad thickness and rotor condition',
                    'Compress caliper piston using proper tool',
                    'Install new brake pads with anti-squeal compound',
                    'Reinstall caliper and torque bolts to specification',
                    'Pump brake pedal to seat pads',
                    'Check brake fluid level and top off',
                    'Test brake operation before road test'
                ]
            },
            {
                title: 'Diagnostic Scan Procedure',
                category: 'Diagnostic',
                steps: [
                    'Connect OBD-II scanner to diagnostic port',
                    'Turn ignition to ON position (engine off)',
                    'Follow scanner prompts to establish communication',
                    'Retrieve and record all diagnostic trouble codes',
                    'Clear codes and perform drive cycle if required',
                    'Monitor live data for abnormal readings',
                    'Document findings in service record',
                    'Recommend additional testing if needed'
                ]
            },
            {
                title: 'Torque Specification Protocol',
                category: 'Technical',
                steps: [
                    'Identify correct torque specification for fastener',
                    'Clean threads and apply thread locker if specified',
                    'Use calibrated torque wrench appropriate for range',
                    'Tighten in specified sequence (if applicable)',
                    'Apply torque in stages for critical fasteners',
                    'Verify final torque reading',
                    'Mark or document completion',
                    'Re-torque after specified interval if required'
                ]
            }
        ];
    }

    getPredefinedSafetyInstructions() {
        return [
            {
                title: 'Personal Protective Equipment (PPE)',
                priority: 'High',
                category: 'General Safety',
                instructions: [
                    'Wear safety glasses at all times in work area',
                    'Use nitrile gloves when handling fluids or chemicals',
                    'Wear steel-toed safety boots',
                    'Use hearing protection when using power tools',
                    'Wear long pants and closed-toe shoes only'
                ]
            },
            {
                title: 'Lifting and Jack Safety',
                priority: 'High',
                category: 'Equipment Safety',
                instructions: [
                    'Never work under vehicle supported only by jack',
                    'Always use jack stands rated for vehicle weight',
                    'Position jack stands on solid, level ground',
                    'Use proper lift points specified by manufacturer',
                    'Inspect lifting equipment before each use',
                    'Never exceed weight capacity of equipment'
                ]
            },
            {
                title: 'Chemical and Fluid Safety',
                priority: 'High',
                category: 'Hazardous Materials',
                instructions: [
                    'Read and understand Safety Data Sheets (SDS)',
                    'Use proper ventilation when working with chemicals',
                    'Store chemicals in approved containers only',
                    'Dispose of waste fluids according to regulations',
                    'Keep spill cleanup materials readily available',
                    'Wash hands thoroughly after handling chemicals'
                ]
            },
            {
                title: 'Electrical System Safety',
                priority: 'Medium',
                category: 'Electrical Safety',
                instructions: [
                    'Disconnect battery before electrical work',
                    'Use insulated tools when working on electrical systems',
                    'Check for proper grounding before testing',
                    'Never work on electrical systems with wet hands',
                    'Use appropriate test equipment rated for automotive use'
                ]
            },
            {
                title: 'Fire Prevention and Response',
                priority: 'High',
                category: 'Fire Safety',
                instructions: [
                    'Know location of fire extinguishers and exits',
                    'Keep work area clean and free of combustible materials',
                    'Use proper containers for flammable liquids',
                    'Never smoke or use open flames in work area',
                    'Report any fire hazards immediately',
                    'In case of fire: evacuate, alert others, call emergency services'
                ]
            },
            {
                title: 'Tool and Equipment Safety',
                priority: 'Medium',
                category: 'Tool Safety',
                instructions: [
                    'Inspect tools before each use',
                    'Use tools only for their intended purpose',
                    'Keep cutting tools sharp and properly maintained',
                    'Store tools properly when not in use',
                    'Report damaged tools immediately',
                    'Follow manufacturer operating procedures'
                ]
            }
        ];
    }

    // ========================================
    // TEMPLATES BUTTON TEST
    // ========================================

    testTemplatesButton() {
        console.log('=== TESTING TEMPLATES BUTTON ===');

        const templatesBtn = document.getElementById('templates-btn');
        console.log('Templates button element:', templatesBtn);

        if (templatesBtn) {
            console.log('Templates button found! Adding direct click handler for testing...');

            // Remove any existing event listeners and add a fresh one
            const newBtn = templatesBtn.cloneNode(true);
            templatesBtn.parentNode.replaceChild(newBtn, templatesBtn);

            newBtn.addEventListener('click', (e) => {
                console.log('🎯 TEMPLATES BUTTON CLICKED - DIRECT HANDLER!');
                e.preventDefault();
                e.stopPropagation();
                this.openJobTemplateDialog();
            });

            console.log('✅ Direct click handler added to Templates button');
        } else {
            console.error('❌ Templates button not found!');

            // List all buttons to debug
            const allButtons = document.querySelectorAll('button');
            console.log('All buttons found:', allButtons);
            allButtons.forEach((btn, index) => {
                console.log(`Button ${index}:`, btn.id, btn.textContent.trim());
            });
        }


    }



    // ========================================
    // SERVICE BUNDLES INITIALIZATION
    // ========================================

    initializeServiceBundles() {
        console.log('=== INITIALIZING SERVICE BUNDLES ===');

        // Wait a bit for DOM to be ready
        setTimeout(() => {
            // Create Bundle button handler
            const createBundleBtn = document.getElementById('create-bundle-btn');
            console.log('Create Bundle button element:', createBundleBtn);

            if (createBundleBtn) {
                console.log('✅ Create Bundle button found, adding event listener');

                // Remove any existing event listeners and add a fresh one
                const newBtn = createBundleBtn.cloneNode(true);
                createBundleBtn.parentNode.replaceChild(newBtn, createBundleBtn);

                newBtn.addEventListener('click', (e) => {
                    console.log('🎯 CREATE BUNDLE BUTTON CLICKED!');
                    e.preventDefault();
                    e.stopPropagation();

                    // Open the comprehensive Job Template dialog
                    this.openJobTemplateDialog();
                });

                console.log('✅ Create Bundle button handler added');
            } else {
                console.error('❌ Create Bundle button not found!');

                // List all buttons to debug
                const allButtons = document.querySelectorAll('button');
                console.log('All buttons found:', allButtons.length);
                allButtons.forEach((btn, index) => {
                    if (btn.id) {
                        console.log(`Button ${index}: ID="${btn.id}" Text="${btn.textContent.trim()}"`);
                    }
                });
            }
        }, 1000);

        // Initialize bundles data and render
        this.initializeBundlesData();
        this.renderServiceBundles();

        console.log('=== SERVICE BUNDLES INITIALIZATION COMPLETE ===');
    }

    initializeBundlesData() {
        // Initialize sample bundles if none exist
        if (!localStorage.getItem('serviceBundles')) {
            const sampleBundles = [
                {
                    id: 1,
                    name: 'Complete Vehicle Maintenance Package',
                    description: 'Comprehensive maintenance package including oil change, brake service, and tire care',
                    price: 350,
                    currency: 'USD',
                    serviceIds: [1, 2, 4],
                    totalHours: 8.5,
                    createdDate: new Date().toISOString(),
                    status: 'active'
                },
                {
                    id: 2,
                    name: 'Fleet Inspection & Diagnostics Bundle',
                    description: 'Complete diagnostic and inspection package for fleet vehicles',
                    price: 320,
                    currency: 'USD',
                    serviceIds: [3, 5],
                    totalHours: 6.0,
                    createdDate: new Date().toISOString(),
                    status: 'active'
                },
                {
                    id: 3,
                    name: 'Premium Service Package',
                    description: 'All-inclusive premium service package for complete vehicle care',
                    price: 500,
                    currency: 'USD',
                    serviceIds: [1, 2, 3, 4, 5],
                    totalHours: 15.0,
                    createdDate: new Date().toISOString(),
                    status: 'active'
                }
            ];

            localStorage.setItem('serviceBundles', JSON.stringify(sampleBundles));
            console.log('Sample service bundles created');
        }
    }

    renderServiceBundles() {
        const bundlesGrid = document.getElementById('bundles-grid');
        if (!bundlesGrid) {
            console.error('Bundles grid not found');
            return;
        }

        // Get bundles from localStorage
        const bundles = JSON.parse(localStorage.getItem('serviceBundles') || '[]');

        bundlesGrid.innerHTML = '';

        if (bundles.length === 0) {
            bundlesGrid.innerHTML = `
                <div class="empty-state">
                    <i class="material-icons">inventory_2</i>
                    <h3>No Service Bundles</h3>
                    <p>Create your first service bundle to get started</p>
                    <button class="mdc-button mdc-button--raised" onclick="document.getElementById('create-bundle-btn').click()">
                        <span class="mdc-button__ripple"></span>
                        <i class="material-icons mdc-button__icon">add_box</i>
                        <span class="mdc-button__label">Create Bundle</span>
                    </button>
                </div>
            `;
            return;
        }

        bundles.forEach(bundle => {
            const bundleCard = this.createBundleCard(bundle);
            bundlesGrid.appendChild(bundleCard);
        });
    }

    createBundleCard(bundle) {
        const card = document.createElement('div');
        card.className = 'service-card';
        card.setAttribute('data-bundle-id', bundle.id);

        // Calculate total components if template exists
        const totalItems = bundle.template ?
            (bundle.template.tasks?.length || 0) +
            (bundle.template.skills?.length || 0) +
            (bundle.template.bomItems?.length || 0) +
            (bundle.template.tools?.length || 0) +
            (bundle.template.sops?.length || 0) +
            (bundle.template.safetyInstructions?.length || 0) : 0;

        card.innerHTML = `
            <div class="service-card__header">
                <div class="service-header-content">
                    <h3 class="service-card__title">${bundle.name}</h3>
                    <span class="service-code">${bundle.code || 'N/A'}</span>
                </div>
                <div class="service-pricing">
                    <span class="price">${bundle.currency || 'USD'} ${bundle.estimatedCost?.toFixed(2) || bundle.price}</span>
                </div>
            </div>
            <div class="service-card__content">
                <div class="service-card__status ${bundle.status}">${bundle.status.toUpperCase()}</div>
                <p class="service-card__description">${bundle.description || 'No description provided'}</p>

                <div class="service-metadata">
                    <div class="metadata-item">
                        <span class="label">Total Hours:</span>
                        <span class="value">${bundle.totalHours || 0} hours</span>
                    </div>
                    <div class="metadata-item">
                        <span class="label">Type:</span>
                        <span class="value">${bundle.type || 'service-package'}</span>
                    </div>
                    <div class="metadata-item">
                        <span class="label">Category:</span>
                        <span class="value">${bundle.category || 'automotive'}</span>
                    </div>
                    ${totalItems > 0 ? `
                    <div class="metadata-item">
                        <span class="label">Components:</span>
                        <span class="value">${totalItems} items</span>
                    </div>
                    ` : ''}
                    <div class="metadata-item">
                        <span class="label">Created:</span>
                        <span class="value">${new Date(bundle.createdDate).toLocaleDateString()}</span>
                    </div>
                </div>

                <div class="service-card__actions">
                    <button class="mdc-button mdc-button--outlined" onclick="app.viewBundle(${bundle.id})">
                        <span class="mdc-button__ripple"></span>
                        <i class="material-icons mdc-button__icon">visibility</i>
                        <span class="mdc-button__label">View</span>
                    </button>
                    <button class="mdc-button mdc-button--outlined" onclick="app.editBundle(${bundle.id})">
                        <span class="mdc-button__ripple"></span>
                        <i class="material-icons mdc-button__icon">edit</i>
                        <span class="mdc-button__label">Edit</span>
                    </button>
                    <button class="mdc-button mdc-button--outlined" onclick="app.cloneBundle(${bundle.id})">
                        <span class="mdc-button__ripple"></span>
                        <i class="material-icons mdc-button__icon">content_copy</i>
                        <span class="mdc-button__label">Clone</span>
                    </button>
                    <button class="mdc-button mdc-button--outlined" onclick="app.deleteBundle(${bundle.id})">
                        <span class="mdc-button__ripple"></span>
                        <i class="material-icons mdc-button__icon">delete</i>
                        <span class="mdc-button__label">Delete</span>
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    // Bundle management methods
    viewBundle(bundleId) {
        console.log('Viewing bundle:', bundleId);
        const bundles = JSON.parse(localStorage.getItem('serviceBundles') || '[]');
        const bundle = bundles.find(b => b.id === bundleId);

        if (bundle) {
            // Create a detailed view modal for the bundle
            this.showBundleDetailsModal(bundle);
        } else {
            this.showSnackbar('Bundle not found');
        }
    }

    showBundleDetailsModal(bundle) {
        // Create a detailed view modal for the bundle
        const modal = document.createElement('div');
        modal.className = 'input-modal-overlay';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        modal.innerHTML = `
            <div class="input-modal" style="max-width: 800px; max-height: 90vh; overflow-y: auto; background: white; border-radius: 8px; box-shadow: 0 8px 32px rgba(0,0,0,0.3);">
                <div class="input-modal-header" style="padding: 24px; border-bottom: 1px solid #e0e0e0;">
                    <h2 class="input-modal-title" style="margin: 0; display: flex; align-items: center; gap: 8px; color: #1976d2;">
                        <i class="material-icons">inventory_2</i>
                        Bundle Details: ${bundle.name}
                    </h2>
                    <p class="input-modal-subtitle" style="margin: 8px 0 0 0; color: #666;">Code: ${bundle.code || 'N/A'} | Status: ${bundle.status || 'active'}</p>
                </div>
                <div class="input-modal-body" style="padding: 24px;">
                    <div class="template-details-content">
                        <div class="detail-section" style="margin-bottom: 24px;">
                            <h4 style="margin: 0 0 12px 0; color: #333; border-bottom: 2px solid #1976d2; padding-bottom: 8px;">Description</h4>
                            <p style="margin: 0; line-height: 1.5; color: #555;">${bundle.description || 'No description provided'}</p>
                        </div>

                        <div class="detail-section" style="margin-bottom: 24px;">
                            <h4 style="margin: 0 0 12px 0; color: #333; border-bottom: 2px solid #1976d2; padding-bottom: 8px;">Bundle Information</h4>
                            <div class="detail-item" style="margin-bottom: 8px; display: flex; justify-content: space-between;">
                                <strong>Type:</strong> <span>${bundle.type || 'service-package'}</span>
                            </div>
                            <div class="detail-item" style="margin-bottom: 8px; display: flex; justify-content: space-between;">
                                <strong>Category:</strong> <span>${bundle.category || 'automotive'}</span>
                            </div>
                            <div class="detail-item" style="margin-bottom: 8px; display: flex; justify-content: space-between;">
                                <strong>Total Hours:</strong> <span>${bundle.totalHours || 0} hours</span>
                            </div>
                            <div class="detail-item" style="margin-bottom: 8px; display: flex; justify-content: space-between;">
                                <strong>Estimated Cost:</strong> <span>$${bundle.estimatedCost?.toFixed(2) || bundle.price || '0.00'}</span>
                            </div>
                        </div>

                        ${bundle.template ? `
                        <div class="detail-section" style="margin-bottom: 24px;">
                            <h4 style="margin: 0 0 12px 0; color: #333; border-bottom: 2px solid #1976d2; padding-bottom: 8px;">Template Components</h4>
                            <div class="detail-item" style="margin-bottom: 8px; display: flex; justify-content: space-between;">
                                <strong>Tasks:</strong> <span>${bundle.template.tasks?.length || 0}</span>
                            </div>
                            <div class="detail-item" style="margin-bottom: 8px; display: flex; justify-content: space-between;">
                                <strong>Skills:</strong> <span>${bundle.template.skills?.length || 0}</span>
                            </div>
                            <div class="detail-item" style="margin-bottom: 8px; display: flex; justify-content: space-between;">
                                <strong>BOM Items:</strong> <span>${bundle.template.bomItems?.length || 0}</span>
                            </div>
                            <div class="detail-item" style="margin-bottom: 8px; display: flex; justify-content: space-between;">
                                <strong>Tools:</strong> <span>${bundle.template.tools?.length || 0}</span>
                            </div>
                            <div class="detail-item" style="margin-bottom: 8px; display: flex; justify-content: space-between;">
                                <strong>SOPs:</strong> <span>${bundle.template.sops?.length || 0}</span>
                            </div>
                            <div class="detail-item" style="margin-bottom: 8px; display: flex; justify-content: space-between;">
                                <strong>Safety Instructions:</strong> <span>${bundle.template.safetyInstructions?.length || 0}</span>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>
                <div class="input-modal-footer" style="padding: 16px 24px; border-top: 1px solid #e0e0e0; display: flex; gap: 12px; justify-content: flex-end;">
                    <button class="modal-btn modal-btn-secondary" onclick="this.closest('.input-modal-overlay').remove()" style="padding: 8px 16px; border: 1px solid #ccc; background: white; border-radius: 4px; cursor: pointer;">Close</button>
                    <button class="modal-btn modal-btn-primary" onclick="app.editBundle(${bundle.id}); this.closest('.input-modal-overlay').remove();" style="padding: 8px 16px; background: #1976d2; color: white; border: none; border-radius: 4px; cursor: pointer;">Edit Bundle</button>
                </div>
            </div>
        `;

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        document.body.appendChild(modal);
    }

    editBundle(bundleId) {
        console.log('Editing bundle:', bundleId);
        const bundles = JSON.parse(localStorage.getItem('serviceBundles') || '[]');
        const bundle = bundles.find(b => b.id === bundleId);

        if (!bundle) {
            this.showSnackbar('Bundle not found');
            return;
        }

        // Set editing mode
        this.editingBundleId = bundleId;
        this.isEditingBundle = true;

        // Open the job template dialog
        this.openJobTemplateDialog();

        // Pre-fill the form with bundle data
        setTimeout(() => {
            this.prefillBundleForm(bundle);
        }, 1500);
    }

    prefillBundleForm(bundle) {
        try {
            console.log('Pre-filling bundle form with data:', bundle);

            // Basic Information
            const templateNameInput = document.getElementById('template-name');
            const templateDescInput = document.getElementById('template-description');
            const templateTypeSelect = document.getElementById('template-type');
            const templateCategorySelect = document.getElementById('template-category');

            if (templateNameInput) {
                templateNameInput.value = bundle.name || '';
                console.log('Set template name:', bundle.name);
            }
            if (templateDescInput) {
                templateDescInput.value = bundle.description || '';
                console.log('Set template description:', bundle.description);
            }

            // Set template type
            if (templateTypeSelect) {
                templateTypeSelect.value = bundle.type || 'service-package';
                console.log('Set template type:', bundle.type);
            }

            // Set template category
            if (templateCategorySelect) {
                templateCategorySelect.value = bundle.category || 'automotive';
                console.log('Set template category:', bundle.category);
            }

            // Pre-fill template data if available - use correct property names
            if (bundle.template) {
                console.log('Loading template data:', bundle.template);

                // Load data into currentTemplate object
                this.currentTemplate = {
                    id: bundle.id,
                    tasks: [...(bundle.template.tasks || [])],
                    skills: [...(bundle.template.skills || [])],
                    bomItems: [...(bundle.template.bomItems || [])],
                    tools: [...(bundle.template.tools || [])],
                    sops: [...(bundle.template.sops || [])],
                    safetyInstructions: [...(bundle.template.safetyInstructions || [])]
                };

                console.log('Current template loaded:', this.currentTemplate);

                // Render all sections
                this.renderTasks();
                this.renderSkills();
                this.renderBOMItems();
                this.renderTools();
                this.renderSOPs();
                this.renderSafetyInstructions();

                // Update containers
                this.updateTasksContainer();
                this.updateSkillsContainer();
                this.updateBOMContainer();
                this.updateToolsContainer();
                this.updateSOPsContainer();
                this.updateSafetyContainer();
            } else {
                console.log('No template data found in bundle');
            }

            // Update dialog title
            const dialogTitle = document.querySelector('#job-template-dialog .dialog-title');
            if (dialogTitle) {
                dialogTitle.textContent = 'Edit Service Bundle';
            }

            // Update create button text
            const createBtn = document.getElementById('create-template-btn');
            if (createBtn) {
                createBtn.innerHTML = `
                    <span class="mdc-button__ripple"></span>
                    <i class="material-icons mdc-button__icon">save</i>
                    <span class="mdc-button__label">Update Bundle</span>
                `;
            }

            console.log('Bundle form pre-filled successfully');
        } catch (error) {
            console.error('Error pre-filling bundle form:', error);
            this.showSnackbar('Error loading bundle data');
        }
    }

    resetEditingState() {
        this.isEditingBundle = false;
        this.editingBundleId = null;

        // Reset dialog title and button text
        setTimeout(() => {
            const dialogTitle = document.querySelector('#job-template-dialog .dialog-title');
            if (dialogTitle) {
                dialogTitle.textContent = 'Create Job Template';
            }

            const createBtn = document.getElementById('create-template-btn');
            if (createBtn) {
                createBtn.innerHTML = `
                    <span class="mdc-button__ripple"></span>
                    <i class="material-icons mdc-button__icon">save</i>
                    <span class="mdc-button__label">Create Template</span>
                `;
            }
        }, 100);
    }

    cloneBundle(bundleId) {
        console.log('Cloning bundle:', bundleId);
        const bundles = JSON.parse(localStorage.getItem('serviceBundles') || '[]');
        const bundle = bundles.find(b => b.id === bundleId);

        if (bundle) {
            // Create a copy with new ID and modified name
            const clonedBundle = {
                ...bundle,
                id: Date.now(),
                code: (bundle.code || 'BUNDLE') + '-COPY',
                name: bundle.name + ' (Copy)',
                createdDate: new Date().toISOString(),
                createdBy: 'current-user@example.com'
            };

            // Save the cloned bundle
            bundles.push(clonedBundle);
            localStorage.setItem('serviceBundles', JSON.stringify(bundles));

            // Refresh the view
            this.renderServiceBundles();
            this.showModernNotification(`Bundle "${bundle.name}" cloned successfully!`, 'success');
        } else {
            this.showSnackbar('Bundle not found');
        }
    }

    deleteBundle(bundleId) {
        if (confirm('Are you sure you want to delete this bundle?')) {
            const bundles = JSON.parse(localStorage.getItem('serviceBundles') || '[]');
            const updatedBundles = bundles.filter(bundle => bundle.id !== bundleId);
            localStorage.setItem('serviceBundles', JSON.stringify(updatedBundles));
            this.renderServiceBundles();
            this.showSnackbar('Bundle deleted successfully');
        }
    }

    // ========================================
    // SERVICE CATALOG MANAGEMENT
    // ========================================

    initializeServiceCatalogs() {
        console.log('Initializing Service Catalogs functionality');

        // Create sample catalogs if none exist
        this.createSampleCatalogs();

        // Initialize event handlers
        this.initializeCatalogHandlers();

        // Render catalogs immediately if we're on the catalogs section
        if (this.currentSection === 'catalogs') {
            this.renderServiceCatalogs();
        }

        // Also render with a delay to ensure DOM is ready
        setTimeout(() => {
            this.renderServiceCatalogs();
        }, 1000);
    }

    initializeCatalogHandlers() {
        // Create Catalog button handler with delay to ensure DOM is ready
        setTimeout(() => {
            const createCatalogBtn = document.getElementById('add-catalog-btn');
            if (createCatalogBtn) {
                console.log('✅ Create Catalog button found, adding event listener');
                createCatalogBtn.addEventListener('click', (e) => {
                    console.log('Create Catalog button clicked');
                    e.preventDefault();
                    e.stopPropagation();
                    this.openCreateCatalogDialog();
                });
            } else {
                console.error('❌ Create Catalog button not found');
            }
        }, 500);
    }

    createSampleCatalogs() {
        // Always create fresh sample catalogs for demo purposes
        localStorage.removeItem('serviceCatalogs'); // Remove this line in production

        const existingCatalogs = JSON.parse(localStorage.getItem('serviceCatalogs') || '[]');

        if (existingCatalogs.length === 0) {
            const sampleCatalogs = [
                {
                    id: 1,
                    name: 'AutoPro Complete Service Catalog',
                    description: 'Comprehensive automotive service catalog for passenger vehicles and light trucks with full maintenance coverage',
                    brand: 'autopro',
                    company: 'AutoPro Services Inc.',
                    visibility: 'public',
                    serviceIds: [1, 2, 3, 4, 5],
                    bundleIds: [1, 2],
                    category: 'automotive',
                    status: 'active',
                    createdDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
                    createdBy: 'system@autopro.com',
                    tags: ['automotive', 'passenger-vehicles', 'maintenance', 'comprehensive'],
                    pricing: {
                        currency: 'USD',
                        totalValue: 1850.00
                    }
                },
                {
                    id: 2,
                    name: 'FleetMaster Commercial Catalog',
                    description: 'Specialized services for fleet vehicles and commercial asset management with enterprise-grade solutions',
                    brand: 'fleetmaster',
                    company: 'FleetMaster Solutions',
                    visibility: 'public',
                    serviceIds: [1, 3, 4, 5],
                    bundleIds: [2, 3],
                    category: 'fleet-management',
                    status: 'active',
                    createdDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
                    createdBy: 'system@fleetmaster.com',
                    tags: ['fleet', 'commercial', 'asset-management', 'enterprise'],
                    pricing: {
                        currency: 'USD',
                        totalValue: 2750.00
                    }
                },
                {
                    id: 3,
                    name: 'VehicleCare Basic Catalog',
                    description: 'Essential maintenance services for everyday vehicle care with affordable pricing for individual customers',
                    brand: 'vehiclecare',
                    company: 'VehicleCare Express',
                    visibility: 'public',
                    serviceIds: [1, 2, 4],
                    bundleIds: [1],
                    category: 'basic-maintenance',
                    status: 'active',
                    createdDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
                    createdBy: 'system@vehiclecare.com',
                    tags: ['basic', 'maintenance', 'everyday', 'affordable'],
                    pricing: {
                        currency: 'USD',
                        totalValue: 950.00
                    }
                },
                {
                    id: 4,
                    name: 'TechAuto Premium Diagnostics',
                    description: 'Advanced diagnostic and technical services for modern vehicles with cutting-edge technology',
                    brand: 'techauto',
                    company: 'TechAuto Systems',
                    visibility: 'public',
                    serviceIds: [3, 5],
                    bundleIds: [],
                    category: 'specialized',
                    status: 'active',
                    createdDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
                    createdBy: 'system@techauto.com',
                    tags: ['diagnostics', 'technology', 'premium', 'advanced'],
                    pricing: {
                        currency: 'USD',
                        totalValue: 1200.00
                    }
                },
                {
                    id: 5,
                    name: 'ServiceMax Enterprise Solutions',
                    description: 'Complete enterprise service catalog for large organizations with multi-location support',
                    brand: 'servicemax',
                    company: 'ServiceMax Corporation',
                    visibility: 'restricted',
                    serviceIds: [1, 2, 3, 4, 5],
                    bundleIds: [1, 2, 3],
                    category: 'commercial',
                    status: 'active',
                    createdDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
                    createdBy: 'system@servicemax.com',
                    tags: ['enterprise', 'commercial', 'multi-location', 'complete'],
                    pricing: {
                        currency: 'USD',
                        totalValue: 3500.00
                    }
                },
                {
                    id: 6,
                    name: 'QuickFix Express Services',
                    description: 'Fast and efficient automotive services for quick turnaround and emergency repairs',
                    brand: 'quickfix',
                    company: 'QuickFix Automotive',
                    visibility: 'public',
                    serviceIds: [2, 4],
                    bundleIds: [],
                    category: 'automotive',
                    status: 'draft',
                    createdDate: new Date().toISOString(),
                    createdBy: 'system@quickfix.com',
                    tags: ['quick', 'express', 'emergency', 'fast-turnaround'],
                    pricing: {
                        currency: 'USD',
                        totalValue: 650.00
                    }
                }
            ];

            localStorage.setItem('serviceCatalogs', JSON.stringify(sampleCatalogs));
            console.log('Sample service catalogs created');
        }
    }

    renderServiceCatalogs() {
        console.log('Rendering service catalogs...');

        const catalogsGrid = document.querySelector('.catalogs-grid');
        if (!catalogsGrid) {
            console.error('Catalogs grid not found');
            return;
        }

        // Get catalogs from localStorage
        const catalogs = JSON.parse(localStorage.getItem('serviceCatalogs') || '[]');

        // Clear existing content
        catalogsGrid.innerHTML = '';

        if (catalogs.length === 0) {
            catalogsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="material-icons">library_books</i>
                    <h3>No Service Catalogs</h3>
                    <p>Create your first service catalog to get started</p>
                    <button class="mdc-button mdc-button--raised" onclick="app.openCreateCatalogDialog()">
                        <span class="mdc-button__ripple"></span>
                        <i class="material-icons mdc-button__icon">add</i>
                        <span class="mdc-button__label">Create Catalog</span>
                    </button>
                </div>
            `;
            return;
        }

        catalogs.forEach(catalog => {
            const catalogCard = this.createCatalogCard(catalog);
            catalogsGrid.appendChild(catalogCard);
        });
    }

    createCatalogCard(catalog) {
        const card = document.createElement('div');
        card.className = 'mdc-card service-card'; // Use same class as service types
        card.setAttribute('data-catalog-id', catalog.id);

        // Calculate total services and bundles
        const totalServices = catalog.serviceIds?.length || 0;
        const totalBundles = catalog.bundleIds?.length || 0;
        const totalItems = totalServices + totalBundles;

        card.innerHTML = `
            <div class="mdc-card__primary-action">
                <div class="service-header">
                    <div class="service-title">
                        <h3 class="mdc-typography--headline6">${catalog.name}</h3>
                        <span class="service-code">${catalog.company || 'N/A'}</span>
                    </div>
                    <div class="service-status ${catalog.status || 'active'}">${(catalog.status || 'active').toUpperCase()}</div>
                </div>
                <div class="service-content">
                    <p class="service-description">${catalog.description}</p>
                    <div class="service-metadata">
                        <div class="metadata-item">
                            <span class="label">Brand:</span>
                            <span class="value">${catalog.brand || 'N/A'}</span>
                        </div>
                        <div class="metadata-item">
                            <span class="label">Category:</span>
                            <span class="value">${catalog.category}</span>
                        </div>
                        <div class="metadata-item">
                            <span class="label">Services:</span>
                            <span class="value">${totalServices}</span>
                        </div>
                        <div class="metadata-item">
                            <span class="label">Bundles:</span>
                            <span class="value">${totalBundles}</span>
                        </div>
                        <div class="metadata-item">
                            <span class="label">Visibility:</span>
                            <span class="value">${catalog.visibility}</span>
                        </div>
                        <div class="metadata-item">
                            <span class="label">Total Value:</span>
                            <span class="value">${catalog.pricing?.currency || 'USD'} ${catalog.pricing?.totalValue?.toFixed(2) || '0.00'}</span>
                        </div>
                        <div class="metadata-item">
                            <span class="label">Created:</span>
                            <span class="value">${new Date(catalog.createdDate).toLocaleDateString()}</span>
                        </div>
                        <div class="metadata-item">
                            <span class="label">Total Items:</span>
                            <span class="value">${totalItems}</span>
                        </div>
                    </div>
                </div>
                <div class="service-actions">
                    <button class="action-btn view-btn" onclick="app.viewCatalog(${catalog.id})" title="View Catalog">
                        <i class="material-icons">visibility</i>
                        <span>View</span>
                    </button>
                    <button class="action-btn edit-btn" onclick="app.editCatalog(${catalog.id})" title="Edit Catalog">
                        <i class="material-icons">edit</i>
                        <span>Edit</span>
                    </button>
                    <button class="action-btn clone-btn" onclick="app.cloneCatalog(${catalog.id})" title="Clone Catalog">
                        <i class="material-icons">content_copy</i>
                        <span>Clone</span>
                    </button>
                    <button class="action-btn delete-btn" onclick="app.deleteCatalog(${catalog.id})" title="Delete Catalog">
                        <i class="material-icons">delete</i>
                        <span>Delete</span>
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    // Catalog CRUD Operations
    openCreateCatalogDialog() {
        console.log('Opening create catalog dialog');
        this.isEditingCatalog = false;
        this.editingCatalogId = null;
        this.showCatalogDialog();
    }

    viewCatalog(catalogId) {
        console.log('Viewing catalog:', catalogId);
        const catalogs = JSON.parse(localStorage.getItem('serviceCatalogs') || '[]');
        const catalog = catalogs.find(c => c.id === catalogId);

        if (catalog) {
            this.showCatalogDetailsModal(catalog);
        } else {
            this.showSnackbar('Catalog not found');
        }
    }

    editCatalog(catalogId) {
        console.log('Editing catalog:', catalogId);
        const catalogs = JSON.parse(localStorage.getItem('serviceCatalogs') || '[]');
        const catalog = catalogs.find(c => c.id === catalogId);

        if (catalog) {
            this.isEditingCatalog = true;
            this.editingCatalogId = catalogId;
            this.showCatalogDialog(catalog);
        } else {
            this.showSnackbar('Catalog not found');
        }
    }

    cloneCatalog(catalogId) {
        console.log('Cloning catalog:', catalogId);
        const catalogs = JSON.parse(localStorage.getItem('serviceCatalogs') || '[]');
        const catalog = catalogs.find(c => c.id === catalogId);

        if (catalog) {
            const clonedCatalog = {
                ...catalog,
                id: Date.now(),
                name: catalog.name + ' (Copy)',
                createdDate: new Date().toISOString(),
                createdBy: 'current-user@example.com'
            };

            catalogs.push(clonedCatalog);
            localStorage.setItem('serviceCatalogs', JSON.stringify(catalogs));
            this.renderServiceCatalogs();
            this.showModernNotification(`Catalog "${catalog.name}" cloned successfully!`, 'success');
        } else {
            this.showSnackbar('Catalog not found');
        }
    }

    deleteCatalog(catalogId) {
        console.log('Deleting catalog:', catalogId);
        const catalogs = JSON.parse(localStorage.getItem('serviceCatalogs') || '[]');
        const catalog = catalogs.find(c => c.id === catalogId);

        if (catalog) {
            if (confirm(`Are you sure you want to delete the catalog "${catalog.name}"? This action cannot be undone.`)) {
                const updatedCatalogs = catalogs.filter(c => c.id !== catalogId);
                localStorage.setItem('serviceCatalogs', JSON.stringify(updatedCatalogs));
                this.renderServiceCatalogs();
                this.showModernNotification(`Catalog "${catalog.name}" deleted successfully!`, 'success');
            }
        } else {
            this.showSnackbar('Catalog not found');
        }
    }

    showCatalogDialog(catalog = null) {
        const isEditing = catalog !== null;
        const dialogTitle = isEditing ? 'Edit Service Catalog' : 'Create Service Catalog';
        const buttonText = isEditing ? 'Update Catalog' : 'Create Catalog';

        const modal = document.createElement('div');
        modal.className = 'input-modal-overlay';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        modal.innerHTML = `
            <div class="input-modal" style="max-width: 600px; max-height: 90vh; overflow-y: auto; background: white; border-radius: 8px; box-shadow: 0 8px 32px rgba(0,0,0,0.3);">
                <div class="input-modal-header" style="padding: 24px; border-bottom: 1px solid #e0e0e0;">
                    <h2 class="input-modal-title" style="margin: 0; display: flex; align-items: center; gap: 8px; color: #1976d2;">
                        <i class="material-icons">library_books</i>
                        ${dialogTitle}
                    </h2>
                </div>
                <div class="input-modal-body" style="padding: 24px;">
                    <form id="catalog-form">
                        <div class="form-group" style="margin-bottom: 16px;">
                            <label for="catalog-name" style="display: block; margin-bottom: 8px; font-weight: 500;">Catalog Name *</label>
                            <input type="text" id="catalog-name" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px;" value="${catalog?.name || ''}" placeholder="Enter catalog name">
                        </div>

                        <div class="form-group" style="margin-bottom: 16px;">
                            <label for="catalog-description" style="display: block; margin-bottom: 8px; font-weight: 500;">Description *</label>
                            <textarea id="catalog-description" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; min-height: 80px;" placeholder="Enter catalog description">${catalog?.description || ''}</textarea>
                        </div>

                        <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                            <div class="form-group">
                                <label for="catalog-company" style="display: block; margin-bottom: 8px; font-weight: 500;">Company *</label>
                                <select id="catalog-company" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px;">
                                    <option value="">Select company</option>
                                    <option value="AutoPro Services Inc." ${catalog?.company === 'AutoPro Services Inc.' ? 'selected' : ''}>AutoPro Services Inc.</option>
                                    <option value="FleetMaster Solutions" ${catalog?.company === 'FleetMaster Solutions' ? 'selected' : ''}>FleetMaster Solutions</option>
                                    <option value="VehicleCare Express" ${catalog?.company === 'VehicleCare Express' ? 'selected' : ''}>VehicleCare Express</option>
                                    <option value="TechAuto Systems" ${catalog?.company === 'TechAuto Systems' ? 'selected' : ''}>TechAuto Systems</option>
                                    <option value="ServiceMax Corporation" ${catalog?.company === 'ServiceMax Corporation' ? 'selected' : ''}>ServiceMax Corporation</option>
                                    <option value="QuickFix Automotive" ${catalog?.company === 'QuickFix Automotive' ? 'selected' : ''}>QuickFix Automotive</option>
                                    <option value="other">Other (Custom)</option>
                                </select>
                                <input type="text" id="catalog-company-custom" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; margin-top: 8px; display: none;" placeholder="Enter custom company name">
                            </div>
                            <div class="form-group">
                                <label for="catalog-brand" style="display: block; margin-bottom: 8px; font-weight: 500;">Brand</label>
                                <select id="catalog-brand" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px;">
                                    <option value="">Select brand</option>
                                    <option value="autopro" ${catalog?.brand === 'autopro' ? 'selected' : ''}>AutoPro</option>
                                    <option value="fleetmaster" ${catalog?.brand === 'fleetmaster' ? 'selected' : ''}>FleetMaster</option>
                                    <option value="vehiclecare" ${catalog?.brand === 'vehiclecare' ? 'selected' : ''}>VehicleCare</option>
                                    <option value="techauto" ${catalog?.brand === 'techauto' ? 'selected' : ''}>TechAuto</option>
                                    <option value="servicemax" ${catalog?.brand === 'servicemax' ? 'selected' : ''}>ServiceMax</option>
                                    <option value="quickfix" ${catalog?.brand === 'quickfix' ? 'selected' : ''}>QuickFix</option>
                                    <option value="other">Other (Custom)</option>
                                </select>
                                <input type="text" id="catalog-brand-custom" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; margin-top: 8px; display: none;" placeholder="Enter custom brand name">
                            </div>
                        </div>

                        <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                            <div class="form-group">
                                <label for="catalog-category" style="display: block; margin-bottom: 8px; font-weight: 500;">Category *</label>
                                <select id="catalog-category" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px;">
                                    <option value="">Select category</option>
                                    <option value="automotive" ${catalog?.category === 'automotive' ? 'selected' : ''}>Automotive</option>
                                    <option value="fleet-management" ${catalog?.category === 'fleet-management' ? 'selected' : ''}>Fleet Management</option>
                                    <option value="basic-maintenance" ${catalog?.category === 'basic-maintenance' ? 'selected' : ''}>Basic Maintenance</option>
                                    <option value="commercial" ${catalog?.category === 'commercial' ? 'selected' : ''}>Commercial</option>
                                    <option value="specialized" ${catalog?.category === 'specialized' ? 'selected' : ''}>Specialized</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="catalog-visibility" style="display: block; margin-bottom: 8px; font-weight: 500;">Visibility *</label>
                                <select id="catalog-visibility" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px;">
                                    <option value="public" ${catalog?.visibility === 'public' ? 'selected' : ''}>Public</option>
                                    <option value="private" ${catalog?.visibility === 'private' ? 'selected' : ''}>Private</option>
                                    <option value="restricted" ${catalog?.visibility === 'restricted' ? 'selected' : ''}>Restricted</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                            <div class="form-group">
                                <label for="catalog-currency" style="display: block; margin-bottom: 8px; font-weight: 500;">Currency</label>
                                <select id="catalog-currency" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px;">
                                    <option value="USD" ${catalog?.pricing?.currency === 'USD' ? 'selected' : ''}>USD</option>
                                    <option value="EUR" ${catalog?.pricing?.currency === 'EUR' ? 'selected' : ''}>EUR</option>
                                    <option value="GBP" ${catalog?.pricing?.currency === 'GBP' ? 'selected' : ''}>GBP</option>
                                    <option value="CAD" ${catalog?.pricing?.currency === 'CAD' ? 'selected' : ''}>CAD</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="catalog-status" style="display: block; margin-bottom: 8px; font-weight: 500;">Status</label>
                                <select id="catalog-status" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px;">
                                    <option value="active" ${catalog?.status === 'active' ? 'selected' : ''}>Active</option>
                                    <option value="inactive" ${catalog?.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                                    <option value="draft" ${catalog?.status === 'draft' ? 'selected' : ''}>Draft</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group" style="margin-bottom: 16px;">
                            <label for="catalog-tags" style="display: block; margin-bottom: 8px; font-weight: 500;">Tags</label>
                            <input type="text" id="catalog-tags" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px;" value="${catalog?.tags?.join(', ') || ''}" placeholder="Enter tags separated by commas">
                            <small style="color: #666; font-size: 12px;">Separate multiple tags with commas</small>
                        </div>
                    </form>
                </div>
                <div class="input-modal-footer" style="padding: 16px 24px; border-top: 1px solid #e0e0e0; display: flex; gap: 12px; justify-content: flex-end;">
                    <button type="button" class="modal-btn modal-btn-secondary" onclick="this.closest('.input-modal-overlay').remove()" style="padding: 8px 16px; border: 1px solid #ccc; background: white; border-radius: 4px; cursor: pointer;">Cancel</button>
                    <button type="button" class="modal-btn modal-btn-primary" onclick="app.saveCatalog(); this.closest('.input-modal-overlay').remove();" style="padding: 8px 16px; background: #1976d2; color: white; border: none; border-radius: 4px; cursor: pointer;">${buttonText}</button>
                </div>
            </div>
        `;

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        document.body.appendChild(modal);

        // Add event handlers for custom company/brand inputs
        setTimeout(() => {
            const companySelect = document.getElementById('catalog-company');
            const companyCustom = document.getElementById('catalog-company-custom');
            const brandSelect = document.getElementById('catalog-brand');
            const brandCustom = document.getElementById('catalog-brand-custom');

            if (companySelect && companyCustom) {
                companySelect.addEventListener('change', (e) => {
                    if (e.target.value === 'other') {
                        companyCustom.style.display = 'block';
                        companyCustom.required = true;
                    } else {
                        companyCustom.style.display = 'none';
                        companyCustom.required = false;
                        companyCustom.value = '';
                    }
                });

                // Set initial state for editing
                if (catalog?.company && !['AutoPro Services Inc.', 'FleetMaster Solutions', 'VehicleCare Express', 'TechAuto Systems', 'ServiceMax Corporation', 'QuickFix Automotive'].includes(catalog.company)) {
                    companySelect.value = 'other';
                    companyCustom.style.display = 'block';
                    companyCustom.value = catalog.company;
                    companyCustom.required = true;
                }
            }

            if (brandSelect && brandCustom) {
                brandSelect.addEventListener('change', (e) => {
                    if (e.target.value === 'other') {
                        brandCustom.style.display = 'block';
                    } else {
                        brandCustom.style.display = 'none';
                        brandCustom.value = '';
                    }
                });

                // Set initial state for editing
                if (catalog?.brand && !['autopro', 'fleetmaster', 'vehiclecare', 'techauto', 'servicemax', 'quickfix'].includes(catalog.brand)) {
                    brandSelect.value = 'other';
                    brandCustom.style.display = 'block';
                    brandCustom.value = catalog.brand;
                }
            }
        }, 100);
    }

    saveCatalog() {
        console.log('Saving catalog...');

        // Get form values
        const name = document.getElementById('catalog-name').value.trim();
        const description = document.getElementById('catalog-description').value.trim();

        // Handle company selection (dropdown or custom)
        const companySelect = document.getElementById('catalog-company').value.trim();
        const companyCustom = document.getElementById('catalog-company-custom').value.trim();
        const company = companySelect === 'other' ? companyCustom : companySelect;

        // Handle brand selection (dropdown or custom)
        const brandSelect = document.getElementById('catalog-brand').value.trim();
        const brandCustom = document.getElementById('catalog-brand-custom').value.trim();
        const brand = brandSelect === 'other' ? brandCustom : brandSelect;

        const category = document.getElementById('catalog-category').value;
        const visibility = document.getElementById('catalog-visibility').value;
        const currency = document.getElementById('catalog-currency').value;
        const status = document.getElementById('catalog-status').value;
        const tagsInput = document.getElementById('catalog-tags').value.trim();

        // Validate required fields
        if (!name || !description || !company || !category || !visibility) {
            this.showSnackbar('Please fill in all required fields');
            return;
        }

        // Process tags
        const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

        // Get existing catalogs
        const catalogs = JSON.parse(localStorage.getItem('serviceCatalogs') || '[]');

        if (this.isEditingCatalog && this.editingCatalogId) {
            // Update existing catalog
            const catalogIndex = catalogs.findIndex(c => c.id === this.editingCatalogId);
            if (catalogIndex !== -1) {
                catalogs[catalogIndex] = {
                    ...catalogs[catalogIndex],
                    name,
                    description,
                    company,
                    brand,
                    category,
                    visibility,
                    status,
                    tags,
                    pricing: {
                        ...catalogs[catalogIndex].pricing,
                        currency
                    },
                    updatedDate: new Date().toISOString(),
                    updatedBy: 'current-user@example.com'
                };
                this.showModernNotification(`Catalog "${name}" updated successfully!`, 'success');
            }
        } else {
            // Create new catalog
            const newCatalog = {
                id: Date.now(),
                name,
                description,
                company,
                brand,
                category,
                visibility,
                status,
                tags,
                serviceIds: [],
                bundleIds: [],
                pricing: {
                    currency,
                    totalValue: 0.00
                },
                createdDate: new Date().toISOString(),
                createdBy: 'current-user@example.com'
            };

            catalogs.push(newCatalog);
            this.showModernNotification(`Catalog "${name}" created successfully!`, 'success');
        }

        // Save to localStorage
        localStorage.setItem('serviceCatalogs', JSON.stringify(catalogs));

        // Reset editing state
        this.isEditingCatalog = false;
        this.editingCatalogId = null;

        // Refresh the view
        this.renderServiceCatalogs();
    }

    showCatalogDetailsModal(catalog) {
        const modal = document.createElement('div');
        modal.className = 'input-modal-overlay';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        const totalServices = catalog.serviceIds?.length || 0;
        const totalBundles = catalog.bundleIds?.length || 0;

        modal.innerHTML = `
            <div class="input-modal" style="max-width: 800px; max-height: 90vh; overflow-y: auto; background: white; border-radius: 8px; box-shadow: 0 8px 32px rgba(0,0,0,0.3);">
                <div class="input-modal-header" style="padding: 24px; border-bottom: 1px solid #e0e0e0;">
                    <h2 class="input-modal-title" style="margin: 0; display: flex; align-items: center; gap: 8px; color: #1976d2;">
                        <i class="material-icons">library_books</i>
                        Catalog Details: ${catalog.name}
                    </h2>
                    <p class="input-modal-subtitle" style="margin: 8px 0 0 0; color: #666;">Company: ${catalog.company} | Status: ${catalog.status.toUpperCase()}</p>
                </div>
                <div class="input-modal-body" style="padding: 24px;">
                    <div class="catalog-details-content">
                        <div class="detail-section" style="margin-bottom: 24px;">
                            <h4 style="margin: 0 0 12px 0; color: #333; border-bottom: 2px solid #1976d2; padding-bottom: 8px;">Description</h4>
                            <p style="margin: 0; line-height: 1.5; color: #555;">${catalog.description}</p>
                        </div>

                        <div class="detail-section" style="margin-bottom: 24px;">
                            <h4 style="margin: 0 0 12px 0; color: #333; border-bottom: 2px solid #1976d2; padding-bottom: 8px;">Catalog Information</h4>
                            <div class="detail-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                                <div class="detail-item" style="margin-bottom: 8px;">
                                    <strong>Company:</strong> <span>${catalog.company}</span>
                                </div>
                                <div class="detail-item" style="margin-bottom: 8px;">
                                    <strong>Brand:</strong> <span>${catalog.brand || 'N/A'}</span>
                                </div>
                                <div class="detail-item" style="margin-bottom: 8px;">
                                    <strong>Category:</strong> <span>${catalog.category}</span>
                                </div>
                                <div class="detail-item" style="margin-bottom: 8px;">
                                    <strong>Visibility:</strong> <span>${catalog.visibility}</span>
                                </div>
                                <div class="detail-item" style="margin-bottom: 8px;">
                                    <strong>Currency:</strong> <span>${catalog.pricing?.currency || 'USD'}</span>
                                </div>
                                <div class="detail-item" style="margin-bottom: 8px;">
                                    <strong>Total Value:</strong> <span>${catalog.pricing?.currency || 'USD'} ${catalog.pricing?.totalValue?.toFixed(2) || '0.00'}</span>
                                </div>
                            </div>
                        </div>

                        <div class="detail-section" style="margin-bottom: 24px;">
                            <h4 style="margin: 0 0 12px 0; color: #333; border-bottom: 2px solid #1976d2; padding-bottom: 8px;">Content Summary</h4>
                            <div class="detail-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                                <div class="detail-item" style="margin-bottom: 8px;">
                                    <strong>Services:</strong> <span>${totalServices}</span>
                                </div>
                                <div class="detail-item" style="margin-bottom: 8px;">
                                    <strong>Bundles:</strong> <span>${totalBundles}</span>
                                </div>
                                <div class="detail-item" style="margin-bottom: 8px;">
                                    <strong>Total Items:</strong> <span>${totalServices + totalBundles}</span>
                                </div>
                                <div class="detail-item" style="margin-bottom: 8px;">
                                    <strong>Created:</strong> <span>${new Date(catalog.createdDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        ${catalog.tags && catalog.tags.length > 0 ? `
                        <div class="detail-section" style="margin-bottom: 24px;">
                            <h4 style="margin: 0 0 12px 0; color: #333; border-bottom: 2px solid #1976d2; padding-bottom: 8px;">Tags</h4>
                            <div class="tags-container" style="display: flex; flex-wrap: wrap; gap: 8px;">
                                ${catalog.tags.map(tag => `<span style="background: #e3f2fd; color: #1976d2; padding: 4px 8px; border-radius: 12px; font-size: 12px;">${tag}</span>`).join('')}
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>
                <div class="input-modal-footer" style="padding: 16px 24px; border-top: 1px solid #e0e0e0; display: flex; gap: 12px; justify-content: flex-end;">
                    <button class="modal-btn modal-btn-secondary" onclick="this.closest('.input-modal-overlay').remove()" style="padding: 8px 16px; border: 1px solid #ccc; background: white; border-radius: 4px; cursor: pointer;">Close</button>
                    <button class="modal-btn modal-btn-primary" onclick="app.editCatalog(${catalog.id}); this.closest('.input-modal-overlay').remove();" style="padding: 8px 16px; background: #1976d2; color: white; border: none; border-radius: 4px; cursor: pointer;">Edit Catalog</button>
                </div>
            </div>
        `;

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        document.body.appendChild(modal);
    }

    // ========================================
    // GLOBAL TEST FUNCTIONS
    // ========================================

    testAllButtons() {
        console.log('=== TESTING ALL BUTTONS ===');

        // Test Templates button
        const templatesBtn = document.getElementById('templates-btn');
        console.log('Templates button:', templatesBtn);

        // Test Service Packages button
        const servicePackagesBtn = document.getElementById('service-packages-btn');
        console.log('Service Packages button:', servicePackagesBtn);

        // Test Service Packages menu
        const servicePackagesMenu = document.getElementById('service-packages-menu');
        console.log('Service Packages menu:', servicePackagesMenu);

        // List all buttons
        const allButtons = document.querySelectorAll('button');
        console.log('Total buttons found:', allButtons.length);

        allButtons.forEach((btn, index) => {
            if (btn.id) {
                console.log(`Button ${index}: ID="${btn.id}" Text="${btn.textContent.trim()}"`);
            }
        });

        // Test if we can manually trigger the dialog
        console.log('Testing manual dialog open...');
        this.openJobTemplateDialog();
    }

    // Test Create Bundle button specifically
    testCreateBundleButton() {
        console.log('=== TESTING CREATE BUNDLE BUTTON ===');

        // First navigate to bundles section
        this.navigateToSection('bundles');

        setTimeout(() => {
            const createBundleBtn = document.getElementById('create-bundle-btn');
            console.log('Create Bundle button:', createBundleBtn);

            if (createBundleBtn) {
                console.log('✅ Create Bundle button found');
                createBundleBtn.click();
            } else {
                console.error('❌ Create Bundle button not found');

                // Check if we're on the right section
                const bundlesSection = document.getElementById('bundles-section');
                console.log('Bundles section:', bundlesSection);
                console.log('Bundles section active:', bundlesSection?.classList.contains('active'));
            }
        }, 500);
    }

    // ========================================
    // BULK DRAG AND DROP
    // ========================================

    handleBulkActionDrop(dragData, dropElement) {
        if (dragData.type !== 'service') return;

        // Show bulk actions menu for the dropped service
        this.showBulkActionsForService(dragData.id);

        // Remove temporary drop zone
        const tempZone = document.getElementById('temp-bulk-drop-zone');
        if (tempZone) {
            tempZone.remove();
        }
    }

    showBulkActionsForService(serviceId) {
        // Select the service
        const checkbox = document.querySelector(`input[data-service-id="${serviceId}"]`);
        if (checkbox) {
            checkbox.checked = true;
        }

        // Show bulk actions menu
        this.showBulkActionsMenu();

        this.showModernNotification(
            'Service selected for bulk actions',
            'info'
        );
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new EnterpriseServiceTypeApp();

    // Add direct event listeners for view buttons as backup
    setTimeout(() => {
        const viewButtons = document.querySelectorAll('.view-btn');

        viewButtons.forEach((btn) => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const view = this.dataset.view;

                // Update active button
                viewButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                // Hide all view contents by removing active class
                const viewContents = document.querySelectorAll('.view-content');
                viewContents.forEach(content => {
                    content.classList.remove('active');
                });

                // Show target view by adding active class
                let targetView;
                switch(view) {
                    case 'grid':
                        targetView = document.getElementById('services-grid');
                        break;
                    case 'list':
                        targetView = document.getElementById('services-list');
                        break;
                    case 'table':
                        targetView = document.getElementById('services-table-container');
                        break;
                    case 'kanban':
                        targetView = document.getElementById('services-kanban');
                        break;
                }

                if (targetView) {
                    targetView.classList.add('active');

                    // Trigger app render if available
                    if (window.app && window.app.renderCurrentView) {
                        window.app.currentView = view;
                        window.app.renderCurrentView();
                    }
                }
            });
        });
    }, 1000);
});

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    try {
        window.app = new EnterpriseServiceTypeApp();
        console.log('App initialized successfully:', window.app);
        console.log('Services data:', window.app.services);

        // Add immediate Create Bundle button handler
        setTimeout(() => {
            const createBundleBtn = document.getElementById('create-bundle-btn');
            if (createBundleBtn) {
                console.log('🎯 Adding immediate Create Bundle handler');
                createBundleBtn.addEventListener('click', function(e) {
                    console.log('🎯 CREATE BUNDLE CLICKED - IMMEDIATE HANDLER!');
                    e.preventDefault();
                    e.stopPropagation();
                    if (window.app && window.app.openJobTemplateDialog) {
                        window.app.openJobTemplateDialog();
                    }
                });
            }
        }, 2000);

    } catch (error) {
        console.error('Error initializing app:', error);
    }
});

// Global test functions for debugging
window.testCreateBundle = function() {
    if (window.app) {
        window.app.testCreateBundleButton();
    } else {
        console.error('App not initialized yet');
    }
};

// Global function to manually navigate to bundles
window.gotoBundles = function() {
    if (window.app) {
        window.app.navigateToSection('bundles');
    } else {
        console.error('App not initialized yet');
    }
};

// Global function to manually open dialog
window.openDialog = function() {
    if (window.app) {
        window.app.openJobTemplateDialog();
    } else {
        console.error('App not initialized yet');
    }
};

// Global test functions for debugging
window.testButtons = function() {
    if (window.app) {
        window.app.testAllButtons();
    } else {
        console.error('App not initialized yet');
    }
};

// Global function to manually open dialog
window.openDialog = function() {
    if (window.app) {
        window.app.openJobTemplateDialog();
    } else {
        console.error('App not initialized yet');
    }
};

// Global function to test Service Packages specifically
window.testServicePackages = function() {
    console.log('=== TESTING SERVICE PACKAGES MANUALLY ===');

    // Test Service Packages button
    const servicePackagesBtn = document.getElementById('service-packages-btn');
    console.log('Service Packages button:', servicePackagesBtn);

    if (servicePackagesBtn) {
        console.log('✅ Service Packages button found');
        servicePackagesBtn.click();
    } else {
        console.error('❌ Service Packages button not found');
    }

    // Test Service Packages menu
    const servicePackagesMenu = document.getElementById('service-packages-menu');
    console.log('Service Packages menu:', servicePackagesMenu);

    if (servicePackagesMenu) {
        console.log('✅ Service Packages menu found');
        servicePackagesMenu.click();
    } else {
        console.error('❌ Service Packages menu not found');
    }
};

// Global function to test cancel button
window.testCancel = function() {
    console.log('=== TESTING CANCEL BUTTON ===');

    const dialog = document.getElementById('job-template-dialog');
    console.log('Dialog element:', dialog);
    console.log('Dialog visible:', dialog ? dialog.style.display : 'not found');

    if (dialog) {
        const cancelButton = dialog.querySelector('[data-mdc-dialog-action="cancel"]');
        console.log('Cancel button:', cancelButton);
        console.log('Cancel button text:', cancelButton ? cancelButton.textContent : 'not found');

        if (cancelButton) {
            console.log('✅ Cancel button found, clicking it...');
            cancelButton.click();
        } else {
            console.error('❌ Cancel button not found');

            // List all buttons in dialog
            const allButtons = dialog.querySelectorAll('button');
            console.log('All buttons in dialog:', allButtons.length);
            allButtons.forEach((btn, index) => {
                console.log(`Button ${index}:`, btn.textContent.trim(), btn.getAttribute('data-mdc-dialog-action'));
            });
        }
    } else {
        console.error('❌ Dialog not found');
    }
};

// Global function to manually close dialog
window.closeDialog = function() {
    if (window.app) {
        window.app.closeJobTemplateDialog();
    } else {
        console.error('App not initialized yet');
    }
};

// Add setupFloatingLabels method to the prototype
EnterpriseServiceTypeApp.prototype.setupFloatingLabels = function() {
    console.log('Setting up floating labels...');

    // Function to check if input has value and update label
    const updateFloatingLabel = (input) => {
        if (!input) return;

        const label = input.nextElementSibling;
        if (label && label.classList.contains('clean-form-label')) {
            // Check multiple ways to detect if input has value
            const hasValue = input.value && input.value.trim() !== '' && input.value !== input.placeholder;

            if (hasValue) {
                label.classList.add('label-float');
                console.log(`Label floated for: ${input.id || input.name || 'unnamed input'} with value: ${input.value}`);
            } else {
                label.classList.remove('label-float');
                console.log(`Label reset for: ${input.id || input.name || 'unnamed input'}`);
            }
        }
    };

    // Check all inputs function
    const checkAllInputs = () => {
        console.log('Checking all inputs for floating labels...');

        // Handle clean form inputs
        document.querySelectorAll('.clean-form-input').forEach(input => {
            updateFloatingLabel(input);
        });

        // Handle MDC text field inputs
        document.querySelectorAll('.mdc-text-field__input').forEach(input => {
            const textField = input.closest('.mdc-text-field');
            if (textField && textField.MDCTextField && input.value) {
                textField.MDCTextField.value = input.value;
                console.log(`Updated MDC floating label for: ${input.id} with value: ${input.value}`);
            }
        });
    };

    // Add event listeners to all form inputs
    document.addEventListener('input', (e) => {
        if (e.target.classList.contains('clean-form-input')) {
            console.log('Input event detected:', e.target.id);
            setTimeout(() => updateFloatingLabel(e.target), 10);
        } else if (e.target.classList.contains('mdc-text-field__input')) {
            console.log('MDC Input event detected:', e.target.id);
            const textField = e.target.closest('.mdc-text-field');
            if (textField && textField.MDCTextField) {
                setTimeout(() => {
                    textField.MDCTextField.value = e.target.value;
                }, 10);
            }
        }
    });

    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('clean-form-input')) {
            console.log('Change event detected:', e.target.id);
            setTimeout(() => updateFloatingLabel(e.target), 10);
        } else if (e.target.classList.contains('mdc-text-field__input')) {
            console.log('MDC Change event detected:', e.target.id);
            const textField = e.target.closest('.mdc-text-field');
            if (textField && textField.MDCTextField) {
                setTimeout(() => {
                    textField.MDCTextField.value = e.target.value;
                }, 10);
            }
        }
    });

    // Store original methods
    this.originalInputValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
    this.originalSelectValue = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    this.originalTextareaValue = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value');

    // Run check when DOM is ready
    setTimeout(checkAllInputs, 100);

    // Periodic check for auto-filled values (more frequent)
    this.labelCheckInterval = setInterval(checkAllInputs, 200);

    // Add mutation observer to detect when inputs get values programmatically
    const observer = new MutationObserver((mutations) => {
        let shouldCheck = false;
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                // Check if new form elements were added
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        if (node.classList && node.classList.contains('clean-form-input')) {
                            shouldCheck = true;
                        } else if (node.querySelectorAll) {
                            const inputs = node.querySelectorAll('.clean-form-input');
                            if (inputs.length > 0) {
                                shouldCheck = true;
                            }
                        }
                    }
                });
            }
        });

        if (shouldCheck) {
            setTimeout(checkAllInputs, 100);
        }
    });

    // Observe the entire document for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Store the update function globally for manual triggering
    window.updateFloatingLabels = checkAllInputs;

    console.log('Floating labels functionality initialized with enhanced detection');
};
