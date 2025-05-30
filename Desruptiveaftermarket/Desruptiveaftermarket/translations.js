// Multi-language support for the Party Portal
const translations = {
    // English (default)
    'en': {
        // Navigation and header
        'aftermarket_software': 'Aftermarket Software',
        'dashboard': 'Dashboard',
        'party': 'Party',
        'employees': 'Employees',
        'customers': 'Customers',
        'parts': 'Parts',
        'settings': 'Settings',
        'help': 'Help',
        'logout': 'Logout',
        'welcome': 'Welcome',

        // Search and filters
        'search_placeholder': 'Search across all columns...',
        'voice_search': 'Voice Search',
        'advanced_search': 'Advanced Search',
        'quick_filters': 'Quick Filters',
        'clear_all': 'Clear All',
        'party_type': 'Party Type',
        'status': 'Status',
        'city': 'City',
        'all_party_types': 'All Party Types',
        'active': 'Active',
        'inactive': 'Inactive',

        // Party types
        'customer': 'Customer',
        'prospect': 'Prospect',
        'outside_agency': 'Outside Agency',
        'manufacturer': 'Manufacturer',
        'clearing_agent': 'Clearing Agent',
        'transporter': 'Transporter',
        'insurance': 'Insurance',
        'financier': 'Financier',
        'user': 'User',
        'vendor': 'Vendor',
        'contractor': 'Contractor',

        // Grid headers
        'party_list': 'Party List',
        'view': 'VIEW',
        'party_id': 'Party ID',
        'name': 'Name',
        'contact_person': 'Contact Person',
        'email': 'Email',
        'phone': 'Phone',
        'address': 'Address',
        'country': 'Country',
        'is_active': 'Is Active?',

        // Actions
        'delete_selected': 'Delete Selected',
        'export_data': 'Export Data',
        'refresh_grid': 'Refresh Grid',
        'edit': 'Edit',
        'save': 'Save',
        'cancel': 'Cancel',
        'close': 'Close',

        // Advanced search
        'search': 'Search',
        'clear': 'Clear',
        'equal': 'Equal',
        'contains': 'Contains',
        'starts_with': 'Starts With',
        'logical_operator': 'Logical Operator',
        'and_operator': 'AND (All conditions must match)',
        'or_operator': 'OR (Any condition can match)',

        // Notifications
        'no_data_found': 'No party data found. Try changing your filters.',
        'all_filters_cleared': 'All filters cleared',
        'grid_refreshed': 'Grid refreshed with latest data.',
        'items_selected': 'items selected',
        'listening': 'Listening...',
        'found_matching': 'Found {count} matching parties.',

        // Modal
        'party_details': 'Party Details',
        'edit_party': 'Edit Party',

        // Self-service
        'profile': 'Profile',
        'notifications': 'Notifications',
        'messages': 'Messages',
        'invoices': 'Invoices',
        'payments': 'Payments',
        'documents': 'Documents',
        'support': 'Support',

        // Help and support
        'help_center': 'Help Center',
        'faqs': 'FAQs',
        'contact_support': 'Contact Support',
        'training': 'Training',
        'user_guides': 'User Guides',
        'video_tutorials': 'Video Tutorials',
        'getting_started': 'Getting Started',

        // Dashboard
        'my_dashboard': 'My Dashboard',
        'customize_dashboard': 'Customize Dashboard',
        'recent_activity': 'Recent Activity',
        'quick_actions': 'Quick Actions',
        'statistics': 'Statistics',
        'announcements': 'Announcements',

        // Customer 360 View
        'customer_360_view': 'Customer 360 View',
        'equipment_overview': 'Equipment Overview',
        'warranty_tracker': 'Warranty Tracker',
        'service_history': 'Service History',
        'communication_logs': 'Communication Logs',
        'contact_management': 'Contact Management',
        'equipment_management': 'Equipment Management',
        'view_details': 'View Details',
        'view_options': 'View Options',
        'customer_360': 'Customer 360',

        // Equipment
        'equipment': 'Equipment',
        'manufacturer': 'Manufacturer',
        'model': 'Model',
        'serial_number': 'Serial Number',
        'operating_hours': 'Operating Hours',
        'location': 'Location',
        'purchase_date': 'Purchase Date',
        'last_service': 'Last Service',
        'next_service_due': 'Next Service Due',
        'equipment_type': 'Equipment Type',
        'add_equipment': 'Add Equipment',
        'schedule_service': 'Schedule Service',

        // Warranty
        'warranty': 'Warranty',
        'warranty_status': 'Warranty Status',
        'warranty_type': 'Warranty Type',
        'warranty_coverage': 'Warranty Coverage',
        'warranty_terms': 'Warranty Terms',
        'warranty_start': 'Warranty Start',
        'warranty_end': 'Warranty End',
        'warranty_active': 'Active',
        'warranty_expired': 'Expired',
        'warranty_expiring': 'Expiring Soon',
        'warranty_claims': 'Warranty Claims',
        'create_claim': 'Create Claim',
        'no_active_warranty': 'No Active Warranty',
        'warranty_expires_in': 'Warranty expires in {days} days',
        'warranty_valid_until': 'Warranty valid until {date}',

        // Service
        'service_type': 'Service Type',
        'technician': 'Technician',
        'service_date': 'Service Date',
        'service_cost': 'Service Cost',
        'parts_used': 'Parts Used',
        'labor_hours': 'Labor Hours',
        'service_description': 'Service Description',
        'preventive_maintenance': 'Preventive Maintenance',
        'repair': 'Repair',
        'inspection': 'Inspection',

        // Communication
        'communication_type': 'Communication Type',
        'phone_call': 'Phone Call',
        'email': 'Email',
        'whatsapp': 'WhatsApp',
        'sms': 'SMS',
        'in_person': 'In Person',
        'direction': 'Direction',
        'inbound': 'Inbound',
        'outbound': 'Outbound',
        'subject': 'Subject',
        'description': 'Description',
        'outcome': 'Outcome',
        'follow_up_required': 'Follow-up Required',
        'duration': 'Duration',
        'timestamp': 'Timestamp',

        // Contact Management
        'contact_type': 'Contact Type',
        'primary_contact': 'Primary Contact',
        'technical_contact': 'Technical Contact',
        'billing_contact': 'Billing Contact',
        'title': 'Title',
        'department': 'Department',
        'role': 'Role',
        'preferred_contact': 'Preferred Contact Method',
        'mobile': 'Mobile',
        'decision_maker': 'Decision Maker',
        'purchaser': 'Purchaser',
        'approver': 'Approver',
        'technical_contact_role': 'Technical Contact',

        // GDPR/Compliance
        'gdpr_compliance': 'GDPR Compliance',
        'data_consent': 'Data Consent',
        'privacy_preferences': 'Privacy Preferences',
        'data_retention': 'Data Retention',
        'data_deletion': 'Data Deletion',
        'consent_given': 'Consent Given',
        'consent_date': 'Consent Date',
        'data_processing_log': 'Data Processing Log',
        'right_to_be_forgotten': 'Right to be Forgotten',
        'data_portability': 'Data Portability',
        'data_rectification': 'Data Rectification'
    },

    // Spanish
    'es': {
        // Navigation and header
        'aftermarket_software': 'Software de Posventa',
        'dashboard': 'Panel de Control',
        'party': 'Entidad',
        'employees': 'Empleados',
        'customers': 'Clientes',
        'parts': 'Piezas',
        'settings': 'Configuración',
        'help': 'Ayuda',
        'logout': 'Cerrar Sesión',
        'welcome': 'Bienvenido',

        // Search and filters
        'search_placeholder': 'Buscar en todas las columnas...',
        'voice_search': 'Búsqueda por Voz',
        'advanced_search': 'Búsqueda Avanzada',
        'quick_filters': 'Filtros Rápidos',
        'clear_all': 'Borrar Todo',
        'party_type': 'Tipo de Entidad',
        'status': 'Estado',
        'city': 'Ciudad',
        'all_party_types': 'Todos los Tipos',
        'active': 'Activo',
        'inactive': 'Inactivo',

        // Party types
        'customer': 'Cliente',
        'prospect': 'Prospecto',
        'outside_agency': 'Agencia Externa',
        'manufacturer': 'Fabricante',
        'clearing_agent': 'Agente de Aduanas',
        'transporter': 'Transportista',
        'insurance': 'Seguro',
        'financier': 'Financiero',
        'user': 'Usuario',
        'vendor': 'Proveedor',
        'contractor': 'Contratista',

        // Grid headers
        'party_list': 'Lista de Entidades',
        'view': 'VER',
        'party_id': 'ID de Entidad',
        'name': 'Nombre',
        'contact_person': 'Persona de Contacto',
        'email': 'Correo Electrónico',
        'phone': 'Teléfono',
        'address': 'Dirección',
        'country': 'País',
        'is_active': '¿Está Activo?',

        // Actions
        'delete_selected': 'Eliminar Seleccionados',
        'export_data': 'Exportar Datos',
        'refresh_grid': 'Actualizar Tabla',
        'edit': 'Editar',
        'save': 'Guardar',
        'cancel': 'Cancelar',
        'close': 'Cerrar',

        // Advanced search
        'search': 'Buscar',
        'clear': 'Limpiar',
        'equal': 'Igual',
        'contains': 'Contiene',
        'starts_with': 'Comienza Con',
        'logical_operator': 'Operador Lógico',
        'and_operator': 'Y (Todas las condiciones deben coincidir)',
        'or_operator': 'O (Cualquier condición puede coincidir)',

        // Notifications
        'no_data_found': 'No se encontraron datos. Intente cambiar sus filtros.',
        'all_filters_cleared': 'Todos los filtros borrados',
        'grid_refreshed': 'Tabla actualizada con los datos más recientes.',
        'items_selected': 'elementos seleccionados',
        'listening': 'Escuchando...',
        'found_matching': 'Se encontraron {count} entidades coincidentes.',

        // Modal
        'party_details': 'Detalles de la Entidad',
        'edit_party': 'Editar Entidad',

        // Self-service
        'profile': 'Perfil',
        'notifications': 'Notificaciones',
        'messages': 'Mensajes',
        'invoices': 'Facturas',
        'payments': 'Pagos',
        'documents': 'Documentos',
        'support': 'Soporte',

        // Help and support
        'help_center': 'Centro de Ayuda',
        'faqs': 'Preguntas Frecuentes',
        'contact_support': 'Contactar Soporte',
        'training': 'Capacitación',
        'user_guides': 'Guías de Usuario',
        'video_tutorials': 'Tutoriales en Video',
        'getting_started': 'Primeros Pasos',

        // Dashboard
        'my_dashboard': 'Mi Panel',
        'customize_dashboard': 'Personalizar Panel',
        'recent_activity': 'Actividad Reciente',
        'quick_actions': 'Acciones Rápidas',
        'statistics': 'Estadísticas',
        'announcements': 'Anuncios'
    },

    // French
    'fr': {
        // Navigation and header
        'aftermarket_software': 'Logiciel Après-Vente',
        'dashboard': 'Tableau de Bord',
        'party': 'Entité',
        'employees': 'Employés',
        'customers': 'Clients',
        'parts': 'Pièces',
        'settings': 'Paramètres',
        'help': 'Aide',
        'logout': 'Déconnexion',
        'welcome': 'Bienvenue',

        // Search and filters
        'search_placeholder': 'Rechercher dans toutes les colonnes...',
        'voice_search': 'Recherche Vocale',
        'advanced_search': 'Recherche Avancée',
        'quick_filters': 'Filtres Rapides',
        'clear_all': 'Tout Effacer',
        'party_type': 'Type d\'Entité',
        'status': 'Statut',
        'city': 'Ville',
        'all_party_types': 'Tous les Types',
        'active': 'Actif',
        'inactive': 'Inactif',

        // Party types
        'customer': 'Client',
        'prospect': 'Prospect',
        'outside_agency': 'Agence Externe',
        'manufacturer': 'Fabricant',
        'clearing_agent': 'Agent de Dédouanement',
        'transporter': 'Transporteur',
        'insurance': 'Assurance',
        'financier': 'Financier',
        'user': 'Utilisateur',
        'vendor': 'Fournisseur',
        'contractor': 'Entrepreneur',

        // Grid headers
        'party_list': 'Liste des Entités',
        'view': 'VOIR',
        'party_id': 'ID d\'Entité',
        'name': 'Nom',
        'contact_person': 'Personne à Contacter',
        'email': 'Email',
        'phone': 'Téléphone',
        'address': 'Adresse',
        'country': 'Pays',
        'is_active': 'Est Actif?',

        // Actions
        'delete_selected': 'Supprimer la Sélection',
        'export_data': 'Exporter les Données',
        'refresh_grid': 'Actualiser la Grille',
        'edit': 'Modifier',
        'save': 'Enregistrer',
        'cancel': 'Annuler',
        'close': 'Fermer',

        // Advanced search
        'search': 'Rechercher',
        'clear': 'Effacer',
        'equal': 'Égal',
        'contains': 'Contient',
        'starts_with': 'Commence Par',
        'logical_operator': 'Opérateur Logique',
        'and_operator': 'ET (Toutes les conditions doivent correspondre)',
        'or_operator': 'OU (N\'importe quelle condition peut correspondre)',

        // Notifications
        'no_data_found': 'Aucune donnée trouvée. Essayez de modifier vos filtres.',
        'all_filters_cleared': 'Tous les filtres effacés',
        'grid_refreshed': 'Grille actualisée avec les dernières données.',
        'items_selected': 'éléments sélectionnés',
        'listening': 'Écoute...',
        'found_matching': 'Trouvé {count} entités correspondantes.',

        // Modal
        'party_details': 'Détails de l\'Entité',
        'edit_party': 'Modifier l\'Entité',

        // Self-service
        'profile': 'Profil',
        'notifications': 'Notifications',
        'messages': 'Messages',
        'invoices': 'Factures',
        'payments': 'Paiements',
        'documents': 'Documents',
        'support': 'Support',

        // Help and support
        'help_center': 'Centre d\'Aide',
        'faqs': 'FAQ',
        'contact_support': 'Contacter le Support',
        'training': 'Formation',
        'user_guides': 'Guides Utilisateur',
        'video_tutorials': 'Tutoriels Vidéo',
        'getting_started': 'Premiers Pas',

        // Dashboard
        'my_dashboard': 'Mon Tableau de Bord',
        'customize_dashboard': 'Personnaliser le Tableau de Bord',
        'recent_activity': 'Activité Récente',
        'quick_actions': 'Actions Rapides',
        'statistics': 'Statistiques',
        'announcements': 'Annonces'
    }
};

// Function to get translation
function getTranslation(key, lang = 'en') {
    // If the language doesn't exist, fall back to English
    if (!translations[lang]) {
        lang = 'en';
    }

    // If the key doesn't exist in the selected language, fall back to English
    return translations[lang][key] || translations['en'][key] || key;
}

// Function to translate the entire UI
function translateUI(lang = 'en') {
    // Store the selected language in local storage
    localStorage.setItem('preferredLanguage', lang);

    // Get all elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');

    // Translate each element
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');

        // If the element has a placeholder attribute, translate the placeholder
        if (element.hasAttribute('placeholder')) {
            element.setAttribute('placeholder', getTranslation(key, lang));
        }
        // Otherwise, translate the text content
        else {
            element.textContent = getTranslation(key, lang);
        }
    });

    // Update the language selector
    const languageSelector = document.getElementById('languageSelector');
    if (languageSelector) {
        languageSelector.value = lang;
    }
}
