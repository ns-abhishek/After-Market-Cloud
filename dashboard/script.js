document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle elements
    const themeToggle = document.querySelector("#theme-toggle");
    const themeIcon = document.querySelector("#theme-icon");
    const html = document.documentElement;

    // Language selector elements
    const languageSelector = document.querySelector(".language-selector");
    const languageToggle = document.querySelector("#language-toggle");
    const languageMenu = document.querySelector("#language-menu");
    const currentLanguageSpan = document.querySelector("#current-language");
    const languageOptions = document.querySelectorAll(".language-option");

    // Menu elements - Enhanced selection
    const menuItems = document.querySelectorAll(".menu-item");
    const menuButtons = document.querySelectorAll(".menu-button");

    // Fallback: Also try to find buttons with data-dropdown attribute
    const allDropdownButtons = document.querySelectorAll("button[data-dropdown]");
    console.log('Menu items found:', menuItems.length);
    console.log('Menu buttons found:', menuButtons.length);
    console.log('All dropdown buttons found:', allDropdownButtons.length);

    // User profile elements
    const userProfile = document.querySelector(".user-profile");
    const profileToggle = document.querySelector("#profile-toggle");

    // Search elements
    const searchInput = document.querySelector(".search-input");

    // Quick action buttons
    const quickActionBtns = document.querySelectorAll(".quick-action-btn");

    // Card action buttons
    const cardActionBtns = document.querySelectorAll(".card-action-btn");

    // Task checkboxes
    const taskCheckboxes = document.querySelectorAll(".task-checkbox");

    // Icon buttons
    const iconButtons = document.querySelectorAll(".icon-button");

    // Translation data (inherited from login page)
    const translations = {
        en: {
            'brand-name': 'HCLSoftware',
            'tagline': 'Admin Dashboard',
            'dashboard': 'Dashboard',
            'users': 'Users',
            'inventory': 'Inventory',
            'finance': 'Finance',
            'overview': 'Overview',
            'analytics': 'Analytics',
            'reports': 'Reports',
            'user-management': 'User Management',
            'roles': 'Roles & Permissions',
            'activity': 'Activity Log',
            'products': 'Products',
            'stock': 'Stock Management',
            'suppliers': 'Suppliers',
            'invoices': 'Invoices',
            'payments': 'Payments',
            'budget': 'Budget',
            'search-placeholder': 'Search...',
            'profile': 'Profile',
            'settings': 'Settings',
            'logout': 'Logout',
            'welcome-back': 'Welcome back, Admin!',
            'dashboard-subtitle': "Here's what's happening with your business today.",
            'add-user': 'Add User',
            'add-product': 'Add Product',
            'generate-report': 'Generate Report',
            'total-users': 'Total Users',
            'total-orders': 'Total Orders',
            'revenue': 'Revenue',
            'sales-overview': 'Sales Overview',
            'user-activity': 'User Activity',
            'recent-activity': 'Recent Activity',
            'view-all': 'View All',
            'pending-tasks': 'Pending Tasks',
            'add-task': 'Add Task',
            'top-products': 'Top Products',
            'system-status': 'System Status',
            'helpdesk': 'HELPDESK',
            'parts': 'PARTS',
            'service': 'SERVICE',
            'tams': 'TAMS',
            'bay-scheduler': 'BAY SCHEDULER',
            'core': 'CORE',
            'dashboard': 'DASHBOARD',
            'kpi-reports': 'KPI REPORTS',
            'more': 'MORE',
            'contract-management': 'CONTRACT MANAGEMENT',
            'digital-catalogue': 'DIGITAL CATALOGUE',
            'reman': 'REMAN',
            'special-tools': 'SPECIAL TOOLS',
            'order-management': 'ORDER MANAGEMENT',
            'field-service': 'FIELD SERVICE',
            'warranty': 'WARRANTY',
            'sales': 'SALES',
            'main-dashboard': 'Main Dashboard',
            'analytics-dashboard': 'Analytics Dashboard',
            'executive-dashboard': 'Executive Dashboard',
            'performance': 'Performance',
            'tickets': 'Tickets',
            'knowledge-base': 'Knowledge Base',
            'support': 'Support',
            'parts-catalog': 'Parts Catalog',
            'suppliers': 'Suppliers',
            'service-orders': 'Service Orders',
            'technicians': 'Technicians',
            'schedules': 'Schedules',
            'asset-management': 'Asset Management',
            'maintenance': 'Maintenance',
            'tracking': 'Tracking',
            'bay-management': 'Bay Management',
            'scheduling': 'Scheduling',
            'resources': 'Resources',
            'core-management': 'Core Management',
            'exchange': 'Exchange',
            'bookmarks': 'Bookmarks',
            'add-bookmark': 'Add Bookmark',
            'manage-bookmarks': 'Manage Bookmarks',
            'search-menu-items': 'Search menu items...',
            'frequently-used': 'Frequently Used',
            'quick-access': 'Quick Access'
        },
        es: {
            'brand-name': 'HCLSoftware',
            'tagline': 'Panel de Administración',
            'dashboard': 'Panel',
            'users': 'Usuarios',
            'inventory': 'Inventario',
            'finance': 'Finanzas',
            'overview': 'Resumen',
            'analytics': 'Análisis',
            'reports': 'Reportes',
            'user-management': 'Gestión de Usuarios',
            'roles': 'Roles y Permisos',
            'activity': 'Registro de Actividad',
            'products': 'Productos',
            'stock': 'Gestión de Stock',
            'suppliers': 'Proveedores',
            'invoices': 'Facturas',
            'payments': 'Pagos',
            'budget': 'Presupuesto',
            'search-placeholder': 'Buscar...',
            'profile': 'Perfil',
            'settings': 'Configuración',
            'logout': 'Cerrar Sesión',
            'welcome-back': '¡Bienvenido de vuelta, Admin!',
            'dashboard-subtitle': 'Esto es lo que está pasando con tu negocio hoy.',
            'add-user': 'Agregar Usuario',
            'add-product': 'Agregar Producto',
            'generate-report': 'Generar Reporte',
            'total-users': 'Total de Usuarios',
            'total-orders': 'Total de Pedidos',
            'revenue': 'Ingresos',
            'sales-overview': 'Resumen de Ventas',
            'user-activity': 'Actividad de Usuarios',
            'recent-activity': 'Actividad Reciente',
            'view-all': 'Ver Todo',
            'pending-tasks': 'Tareas Pendientes',
            'add-task': 'Agregar Tarea',
            'top-products': 'Productos Principales',
            'system-status': 'Estado del Sistema',
            'frequently-used': 'Frecuentemente Usado',
            'quick-access': 'Acceso Rápido'
        },
        fr: {
            'brand-name': 'HCLSoftware',
            'tagline': 'Tableau de Bord Admin',
            'dashboard': 'Tableau de Bord',
            'users': 'Utilisateurs',
            'inventory': 'Inventaire',
            'finance': 'Finance',
            'overview': 'Aperçu',
            'analytics': 'Analyses',
            'reports': 'Rapports',
            'user-management': 'Gestion des Utilisateurs',
            'roles': 'Rôles et Permissions',
            'activity': 'Journal d\'Activité',
            'products': 'Produits',
            'stock': 'Gestion des Stocks',
            'suppliers': 'Fournisseurs',
            'invoices': 'Factures',
            'payments': 'Paiements',
            'budget': 'Budget',
            'search-placeholder': 'Rechercher...',
            'profile': 'Profil',
            'settings': 'Paramètres',
            'logout': 'Déconnexion',
            'welcome-back': 'Bon retour, Admin!',
            'dashboard-subtitle': 'Voici ce qui se passe avec votre entreprise aujourd\'hui.',
            'add-user': 'Ajouter Utilisateur',
            'add-product': 'Ajouter Produit',
            'generate-report': 'Générer Rapport',
            'total-users': 'Total Utilisateurs',
            'total-orders': 'Total Commandes',
            'revenue': 'Revenus',
            'sales-overview': 'Aperçu des Ventes',
            'user-activity': 'Activité Utilisateurs',
            'recent-activity': 'Activité Récente',
            'view-all': 'Voir Tout',
            'pending-tasks': 'Tâches En Attente',
            'add-task': 'Ajouter Tâche',
            'top-products': 'Produits Populaires',
            'system-status': 'État du Système',
            'frequently-used': 'Fréquemment Utilisé',
            'quick-access': 'Accès Rapide'
        },
        de: {
            'brand-name': 'HCLSoftware',
            'tagline': 'Admin Dashboard',
            'dashboard': 'Dashboard',
            'users': 'Benutzer',
            'inventory': 'Inventar',
            'finance': 'Finanzen',
            'overview': 'Übersicht',
            'analytics': 'Analysen',
            'reports': 'Berichte',
            'user-management': 'Benutzerverwaltung',
            'roles': 'Rollen und Berechtigungen',
            'activity': 'Aktivitätsprotokoll',
            'products': 'Produkte',
            'stock': 'Lagerverwaltung',
            'suppliers': 'Lieferanten',
            'invoices': 'Rechnungen',
            'payments': 'Zahlungen',
            'budget': 'Budget',
            'search-placeholder': 'Suchen...',
            'profile': 'Profil',
            'settings': 'Einstellungen',
            'logout': 'Abmelden',
            'welcome-back': 'Willkommen zurück, Admin!',
            'dashboard-subtitle': 'Das passiert heute in Ihrem Unternehmen.',
            'add-user': 'Benutzer Hinzufügen',
            'add-product': 'Produkt Hinzufügen',
            'generate-report': 'Bericht Erstellen',
            'total-users': 'Gesamte Benutzer',
            'total-orders': 'Gesamte Bestellungen',
            'revenue': 'Umsatz',
            'sales-overview': 'Verkaufsübersicht',
            'user-activity': 'Benutzeraktivität',
            'recent-activity': 'Letzte Aktivität',
            'view-all': 'Alle Anzeigen',
            'pending-tasks': 'Ausstehende Aufgaben',
            'add-task': 'Aufgabe Hinzufügen',
            'top-products': 'Top Produkte',
            'system-status': 'Systemstatus',
            'frequently-used': 'Häufig Verwendet',
            'quick-access': 'Schnellzugriff'
        },
        zh: {
            'brand-name': 'HCLSoftware',
            'tagline': '管理仪表板',
            'dashboard': '仪表板',
            'users': '用户',
            'inventory': '库存',
            'finance': '财务',
            'overview': '概览',
            'analytics': '分析',
            'reports': '报告',
            'user-management': '用户管理',
            'roles': '角色和权限',
            'activity': '活动日志',
            'products': '产品',
            'stock': '库存管理',
            'suppliers': '供应商',
            'invoices': '发票',
            'payments': '付款',
            'budget': '预算',
            'search-placeholder': '搜索...',
            'profile': '个人资料',
            'settings': '设置',
            'logout': '登出',
            'welcome-back': '欢迎回来，管理员！',
            'dashboard-subtitle': '这是您的企业今天发生的情况。',
            'add-user': '添加用户',
            'add-product': '添加产品',
            'generate-report': '生成报告',
            'total-users': '总用户数',
            'total-orders': '总订单数',
            'revenue': '收入',
            'sales-overview': '销售概览',
            'user-activity': '用户活动',
            'recent-activity': '最近活动',
            'view-all': '查看全部',
            'pending-tasks': '待处理任务',
            'add-task': '添加任务',
            'top-products': '热门产品',
            'system-status': '系统状态',
            'frequently-used': '常用',
            'quick-access': '快速访问'
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

    // Enhanced dropdown functionality with better error handling
    console.log('=== INITIALIZING DROPDOWNS ===');

    function initializeDropdownSystem() {
        // Get all dropdown buttons
        const allDropdownButtons = document.querySelectorAll('button[data-dropdown]');
        console.log(`Found ${allDropdownButtons.length} dropdown buttons`);

        if (allDropdownButtons.length === 0) {
            console.warn('No dropdown buttons found! Retrying in 500ms...');
            setTimeout(initializeDropdownSystem, 500);
            return;
        }

        // Expected menu items
        const expectedMenus = ['helpdesk', 'parts', 'service', 'tams', 'bay-scheduler', 'core', 'dashboard', 'kpi-reports', 'reports', 'more'];
        const foundMenus = Array.from(allDropdownButtons).map(btn => btn.getAttribute('data-dropdown'));

        console.log('Expected menus:', expectedMenus);
        console.log('Found menus:', foundMenus);

        const missingMenus = expectedMenus.filter(menu => !foundMenus.includes(menu));
        if (missingMenus.length > 0) {
            console.warn('Missing menu buttons:', missingMenus);
        }

        allDropdownButtons.forEach((button, index) => {
            const dropdownName = button.getAttribute('data-dropdown');
            console.log(`Setting up button ${index}: ${dropdownName}`);

            // Ensure the button has proper structure
            const menuItem = button.closest('.menu-item');
            const dropdownMenu = menuItem ? menuItem.querySelector('.dropdown-menu') : null;

            if (!menuItem) {
                console.error(`No menu-item found for ${dropdownName}`);
                return;
            }

            if (!dropdownMenu) {
                console.error(`No dropdown-menu found for ${dropdownName}`);
                return;
            }

            // Remove existing event listeners
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);

            // Add click event listener with improved logic
            newButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                console.log(`CLICKED: ${dropdownName}`);

                const currentMenuItem = this.closest('.menu-item');
                const isCurrentlyActive = currentMenuItem.classList.contains('active');

                // Close ALL dropdowns first
                document.querySelectorAll('.menu-item.active').forEach(item => {
                    item.classList.remove('active');
                    const menu = item.querySelector('.dropdown-menu');
                    if (menu) {
                        menu.style.pointerEvents = 'none';
                    }
                });

                // If it wasn't active, open it
                if (!isCurrentlyActive) {
                    currentMenuItem.classList.add('active');
                    const currentDropdownMenu = currentMenuItem.querySelector('.dropdown-menu');
                    if (currentDropdownMenu) {
                        currentDropdownMenu.style.pointerEvents = 'auto';
                    }
                    console.log(`OPENED: ${dropdownName}`);
                } else {
                    console.log(`CLOSED: ${dropdownName}`);
                }
            });

            console.log(`Event listener added for: ${dropdownName}`);
        });

        console.log('=== DROPDOWN SETUP COMPLETE ===');
    }

    // Initialize with multiple attempts to ensure DOM is ready
    setTimeout(initializeDropdownSystem, 100);
    setTimeout(initializeDropdownSystem, 500);
    setTimeout(initializeDropdownSystem, 1000);

    // Force refresh function for menu system
    window.refreshMenuSystem = function() {
        console.log('=== FORCE REFRESHING MENU SYSTEM ===');

        // Remove all existing event listeners by cloning and replacing buttons
        const allDropdownButtons = document.querySelectorAll('button[data-dropdown]');
        allDropdownButtons.forEach(button => {
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
        });

        // Reinitialize the dropdown system
        setTimeout(initializeDropdownSystem, 100);

        console.log('Menu system refreshed');
    };

    // Function to test specific menu
    window.testMenu = function(menuName) {
        console.log(`=== TESTING ${menuName.toUpperCase()} MENU ===`);
        const button = document.querySelector(`button[data-dropdown="${menuName}"]`);
        if (button) {
            console.log(`Found button for ${menuName}, clicking...`);
            button.click();
            setTimeout(() => {
                const menuItem = button.closest('.menu-item');
                const isActive = menuItem ? menuItem.classList.contains('active') : false;
                console.log(`${menuName} menu is ${isActive ? 'OPEN' : 'CLOSED'}`);
            }, 100);
        } else {
            console.error(`Button not found for ${menuName}`);
        }
    };

    // Dropdown verification function
    function verifyDropdowns() {
        console.log('Verifying dropdown functionality...');
        const allMenuButtons = document.querySelectorAll('.menu-button[data-dropdown]');
        console.log(`Found ${allMenuButtons.length} dropdown buttons for verification`);

        allMenuButtons.forEach(button => {
            const dropdownName = button.getAttribute('data-dropdown');
            const menuItem = button.closest('.menu-item');
            const dropdownMenu = menuItem ? menuItem.querySelector('.dropdown-menu') : null;

            console.log(`${dropdownName}: ${dropdownMenu ? 'OK' : 'MISSING MENU'}`);
        });
    }

    // Verify dropdowns after initialization
    setTimeout(verifyDropdowns, 1500);

    // Test function to verify dropdown functionality
    function testDropdowns() {
        console.log('=== DROPDOWN TEST ===');
        const testDropdowns = ['bay-scheduler', 'dashboard', 'kpi-reports', 'more'];

        testDropdowns.forEach(dropdownName => {
            const button = document.querySelector(`button[data-dropdown="${dropdownName}"]`);
            const menuItem = button ? button.closest('.menu-item') : null;
            const dropdownMenu = menuItem ? menuItem.querySelector('.dropdown-menu') : null;

            console.log(`${dropdownName}:`, {
                button: !!button,
                menuItem: !!menuItem,
                dropdownMenu: !!dropdownMenu,
                hasMultiColumn: dropdownMenu ? dropdownMenu.classList.contains('multi-column') : false,
                dropdownId: dropdownMenu ? dropdownMenu.id : 'no-id',
                isActive: menuItem ? menuItem.classList.contains('active') : false
            });

            // Special check for all four dropdowns
            if (['bay-scheduler', 'dashboard', 'kpi-reports', 'more'].includes(dropdownName)) {
                console.log(`${dropdownName.toUpperCase()} dropdown details:`, {
                    buttonExists: !!button,
                    buttonDataDropdown: button ? button.getAttribute('data-dropdown') : null,
                    menuItemExists: !!menuItem,
                    dropdownMenuExists: !!dropdownMenu,
                    dropdownMenuId: dropdownMenu ? dropdownMenu.id : null,
                    dropdownMenuClasses: dropdownMenu ? dropdownMenu.className : null,
                    hasMultiColumnClass: dropdownMenu ? dropdownMenu.classList.contains('multi-column') : false
                });
            }
        });
    }

    // Run test after a delay
    setTimeout(testDropdowns, 200);

    // Enhanced test functions for debugging
    window.testDropdown = function(dropdownName) {
        console.log(`Manual test for: ${dropdownName}`);
        const button = document.querySelector(`button[data-dropdown="${dropdownName}"]`);
        if (button) {
            console.log(`Button found for ${dropdownName}, attempting click...`);
            button.click();

            // Check if dropdown opened
            setTimeout(() => {
                const menuItem = button.closest('.menu-item');
                const isActive = menuItem ? menuItem.classList.contains('active') : false;
                console.log(`${dropdownName} active state: ${isActive}`);
            }, 100);
        } else {
            console.error(`Button not found for: ${dropdownName}`);
        }
    };

    // Manual function to open a specific dropdown
    window.openDropdown = function(dropdownName) {
        console.log(`Manually opening: ${dropdownName}`);
        const button = document.querySelector(`button[data-dropdown="${dropdownName}"]`);
        if (button) {
            const menuItem = button.closest('.menu-item');
            if (menuItem) {
                // Close all others first
                document.querySelectorAll('.menu-item.active').forEach(item => {
                    item.classList.remove('active');
                    console.log(`Closed: ${item.querySelector('button')?.getAttribute('data-dropdown')}`);
                });
                // Open this one
                menuItem.classList.add('active');
                console.log(`Manually opened: ${dropdownName}`);

                // Verify it's open
                const dropdownMenu = menuItem.querySelector('.dropdown-menu');
                if (dropdownMenu) {
                    console.log(`Dropdown menu visibility: ${getComputedStyle(dropdownMenu).visibility}`);
                    console.log(`Dropdown menu opacity: ${getComputedStyle(dropdownMenu).opacity}`);
                }
            }
        } else {
            console.error(`Button not found for: ${dropdownName}`);
        }
    };

    // Debug function to check all dropdowns
    window.debugDropdowns = function() {
        console.log('=== DROPDOWN DEBUG INFO ===');
        const dropdowns = ['helpdesk', 'parts', 'service', 'tams', 'bay-scheduler', 'core', 'dashboard', 'kpi-reports', 'reports', 'more'];

        dropdowns.forEach(name => {
            const button = document.querySelector(`button[data-dropdown="${name}"]`);
            const menuItem = button ? button.closest('.menu-item') : null;
            const dropdownMenu = menuItem ? menuItem.querySelector('.dropdown-menu') : null;

            console.log(`${name}:`, {
                hasButton: !!button,
                hasMenuItem: !!menuItem,
                hasDropdownMenu: !!dropdownMenu,
                isActive: menuItem ? menuItem.classList.contains('active') : false
            });
        });
    };

    // Specific function to test all main menu dropdowns
    window.testAllMainDropdowns = function() {
        console.log('=== TESTING ALL MAIN MENU DROPDOWNS ===');
        const dropdownsToTest = ['core', 'dashboard', 'kpi-reports', 'reports', 'more'];

        dropdownsToTest.forEach(dropdownName => {
            console.log(`\n--- Testing ${dropdownName.toUpperCase()} ---`);
            const button = document.querySelector(`button[data-dropdown="${dropdownName}"]`);
            const menuItem = button ? button.closest('.menu-item') : null;
            const dropdownMenu = menuItem ? menuItem.querySelector('.dropdown-menu') : null;

            console.log(`${dropdownName} Button:`, button);
            console.log(`${dropdownName} Menu Item:`, menuItem);
            console.log(`${dropdownName} Dropdown Menu:`, dropdownMenu);

            if (button && menuItem && dropdownMenu) {
                console.log(`All elements found for ${dropdownName}, testing functionality...`);

                // Test click functionality
                console.log(`Testing click on ${dropdownName}...`);
                button.click();

                setTimeout(() => {
                    const isActive = menuItem.classList.contains('active');
                    console.log(`${dropdownName} is active after click:`, isActive);

                    if (isActive) {
                        console.log(`✅ ${dropdownName} dropdown opened successfully!`);

                        // Close it after testing
                        setTimeout(() => {
                            menuItem.classList.remove('active');
                            console.log(`${dropdownName} dropdown closed.`);
                        }, 1000);
                    } else {
                        console.log(`❌ ${dropdownName} dropdown failed to open.`);
                    }
                }, 100);
            } else {
                console.error(`❌ Missing elements for ${dropdownName} dropdown`);
            }
        });
    };

    // Legacy function for backward compatibility
    window.testMoreDropdown = function() {
        console.log('=== TESTING MORE DROPDOWN (Legacy) ===');
        window.testAllFourDropdowns();
    };

    // User profile dropdown
    if (profileToggle) {
        profileToggle.addEventListener('click', (e) => {
            e.preventDefault();
            userProfile.classList.toggle('active');
        });
    }

    // Notification dropdown functionality
    const notificationDropdown = document.querySelector('.notification-dropdown');
    const notificationToggle = document.getElementById('notification-toggle');
    const notificationMenu = document.getElementById('notification-menu');
    const markAllReadBtn = document.getElementById('mark-all-read');

    if (notificationToggle && notificationMenu) {
        notificationToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Close other dropdowns
            if (languageSelector) languageSelector.classList.remove('active');
            if (userProfile) userProfile.classList.remove('active');

            // Toggle notification dropdown
            notificationDropdown.classList.toggle('active');
            notificationToggle.classList.toggle('active');
        });

        // Mark all as read functionality
        if (markAllReadBtn) {
            markAllReadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const unreadItems = notificationMenu.querySelectorAll('.notification-item.unread');
                unreadItems.forEach(item => {
                    item.classList.remove('unread');
                });

                // Update badge count
                const badge = document.querySelector('.notification-badge');
                if (badge) {
                    badge.textContent = '0';
                    badge.style.display = 'none';
                }

                showNotification('All notifications marked as read', 'success');
            });
        }

        // Individual notification click handling
        const notificationItems = notificationMenu.querySelectorAll('.notification-item');
        notificationItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();

                // Mark as read if unread
                if (item.classList.contains('unread')) {
                    item.classList.remove('unread');

                    // Update badge count
                    const badge = document.querySelector('.notification-badge');
                    if (badge) {
                        let count = parseInt(badge.textContent) || 0;
                        count = Math.max(0, count - 1);
                        badge.textContent = count.toString();
                        if (count === 0) {
                            badge.style.display = 'none';
                        }
                    }
                }

                // Close dropdown
                notificationDropdown.classList.remove('active');
                notificationToggle.classList.remove('active');

                // Show notification action
                const title = item.querySelector('.notification-title').textContent;
                showNotification(`Opened: ${title}`, 'info');
            });
        });
    }

    // Enhanced click outside functionality with better dropdown handling
    document.addEventListener('click', (e) => {
        // Handle notification dropdown
        if (notificationDropdown && !notificationDropdown.contains(e.target)) {
            notificationDropdown.classList.remove('active');
            if (notificationToggle) notificationToggle.classList.remove('active');
        }

        // Handle language selector
        if (languageSelector && !languageSelector.contains(e.target)) {
            languageSelector.classList.remove('active');
        }

        // Handle user profile dropdown
        if (userProfile && !userProfile.contains(e.target)) {
            userProfile.classList.remove('active');
        }

        // Handle menu dropdowns - improved logic
        let clickedInsideAnyMenu = false;
        menuItems.forEach(item => {
            if (item.contains(e.target)) {
                clickedInsideAnyMenu = true;
            }
        });

        // If click was outside all menus, close all dropdowns
        if (!clickedInsideAnyMenu) {
            menuItems.forEach(item => {
                if (item.classList.contains('active')) {
                    item.classList.remove('active');
                    const menu = item.querySelector('.dropdown-menu');
                    if (menu) {
                        menu.style.pointerEvents = 'none';
                    }
                    console.log(`Closed dropdown: ${item.querySelector('button')?.getAttribute('data-dropdown')}`);
                }
            });
        }
    });

    // Initialize search functionality
    if (searchInput) {
        initializeSearch();
    }

    // Quick action button handlers
    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-action');
            handleQuickAction(action);
        });
    });

    function handleQuickAction(action) {
        switch(action) {
            case 'new-user':
                console.log('Opening new user form...');
                showNotification('New user form opened', 'info');
                break;
            case 'new-product':
                console.log('Opening new product form...');
                showNotification('New product form opened', 'info');
                break;
            case 'generate-report':
                console.log('Generating report...');
                showNotification('Report generation started', 'success');
                break;
            default:
                console.log('Unknown action:', action);
        }
    }

    // Handle page navigation
    function handlePageNavigation(page) {
        console.log('Navigating to page:', page);
        showNotification(`Loading ${page.replace('-', ' ')} module...`, 'info');

        // Here you would implement actual page navigation
        // For now, we'll just show a notification
        setTimeout(() => {
            showNotification(`${page.replace('-', ' ')} module loaded`, 'success');
        }, 1500);
    }

    // Card action button handlers
    cardActionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from siblings
            const siblings = btn.parentElement.querySelectorAll('.card-action-btn');
            siblings.forEach(sibling => sibling.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');

            const period = btn.getAttribute('data-period');
            if (period) {
                updateChartData(period);
            }
        });
    });

    function updateChartData(period) {
        console.log('Updating chart data for period:', period);
        // Implement chart data update logic
        showNotification(`Chart updated for ${period}`, 'info');
    }

    // Task checkbox handlers
    taskCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const taskContent = checkbox.nextElementSibling;
            if (checkbox.checked) {
                taskContent.classList.add('completed');
                showNotification('Task completed!', 'success');
            } else {
                taskContent.classList.remove('completed');
                showNotification('Task marked as incomplete', 'info');
            }
        });
    });

    // Icon button handlers
    iconButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.getAttribute('data-action');
            handleIconButtonAction(action);
        });
    });

    function handleIconButtonAction(action) {
        switch(action) {
            case 'dashboard-settings':
                console.log('Opening User Dashboard Settings...');
                showNotification('User Dashboard Settings opened', 'info');
                break;
            case 'load-unload-dashboard':
                console.log('Opening Load/Unload User Dashboard...');
                showNotification('Load/Unload User Dashboard opened', 'info');
                break;
            case 'kpi-reports':
                console.log('Opening KPI Reports...');
                showNotification('KPI Reports opened', 'info');
                break;
            case 'month-end-process':
                console.log('Opening Month End Process...');
                showNotification('Month End Process opened', 'info');
                break;
            case 'user-manual':
                console.log('Opening User Manual...');
                showNotification('User Manual opened', 'info');
                break;
            case 'release-notes':
                console.log('Opening Release Note Information...');
                showNotification('Release Note Information opened', 'info');
                break;
            case 'home':
                console.log('Navigating to Home...');
                showNotification('Navigating to Home', 'success');
                break;
            default:
                console.log('Unknown icon action:', action);
        }
    }

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add notification styles if not already present
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: var(--card-background);
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    padding: 1rem;
                    box-shadow: 0 4px 16px var(--shadow-medium);
                    z-index: 70000;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    min-width: 300px;
                    transform: translateX(100%);
                    transition: transform 0.3s ease;
                }
                .notification.show {
                    transform: translateX(0);
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    flex: 1;
                }
                .notification-success {
                    border-left: 4px solid var(--success-color);
                }
                .notification-error {
                    border-left: 4px solid var(--error-color);
                }
                .notification-warning {
                    border-left: 4px solid var(--warning-color);
                }
                .notification-info {
                    border-left: 4px solid var(--info-color);
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: var(--text-hint);
                    cursor: pointer;
                    padding: 0.25rem;
                    border-radius: 4px;
                    transition: all 0.3s ease;
                }
                .notification-close:hover {
                    background: var(--background-secondary);
                    color: var(--text-primary);
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Auto-hide after 5 seconds
        setTimeout(() => {
            hideNotification(notification);
        }, 5000);

        // Close button handler
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            hideNotification(notification);
        });
    }

    function hideNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentElement) {
                notification.parentElement.removeChild(notification);
            }
        }, 300);
    }

    function getNotificationIcon(type) {
        switch(type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            case 'info': return 'fa-info-circle';
            default: return 'fa-info-circle';
        }
    }

    // Animate elements on page load
    function animateElements() {
        const cards = document.querySelectorAll('.stat-card, .chart-card, .activity-card, .tasks-card, .performance-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('slide-up');
            }, index * 100);
        });
    }

    // Real-time data simulation
    function simulateRealTimeData() {
        // Simulate updating stats
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            const currentValue = parseInt(stat.textContent.replace(/[^0-9]/g, ''));
            if (currentValue && Math.random() > 0.7) {
                const change = Math.floor(Math.random() * 10) - 5;
                const newValue = Math.max(0, currentValue + change);

                if (stat.textContent.includes('$')) {
                    stat.textContent = `$${newValue.toLocaleString()}`;
                } else {
                    stat.textContent = newValue.toLocaleString();
                }
            }
        });
    }

    // Logout functionality
    function handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            // Clear any stored data
            localStorage.removeItem('userSession');

            // Show logout message
            showNotification('Logging out...', 'info');

            // Redirect to login page after a short delay
            setTimeout(() => {
                window.location.href = '../Login Page/index.html';
            }, 1500);
        }
    }

    // Add logout event listener
    document.addEventListener('click', (e) => {
        if (e.target.closest('.logout')) {
            e.preventDefault();
            handleLogout();
        }
    });

    // Enhanced keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.focus();
                searchInput.select(); // Select all text for easy replacement
            }
        }

        // Escape to close dropdowns - improved
        if (e.key === 'Escape') {
            // Close notification dropdown
            if (notificationDropdown) {
                notificationDropdown.classList.remove('active');
                if (notificationToggle) notificationToggle.classList.remove('active');
            }

            // Close language selector
            if (languageSelector) {
                languageSelector.classList.remove('active');
            }

            // Close user profile dropdown
            if (userProfile) {
                userProfile.classList.remove('active');
            }

            // Close all menu dropdowns
            menuItems.forEach(item => {
                if (item.classList.contains('active')) {
                    item.classList.remove('active');
                    const menu = item.querySelector('.dropdown-menu');
                    if (menu) {
                        menu.style.pointerEvents = 'none';
                    }
                    console.log(`Closed dropdown via Escape: ${item.querySelector('button')?.getAttribute('data-dropdown')}`);
                }
            });
        }
    });

    // Optimize dropdown layouts by reordering categories based on item count
    function optimizeDropdownLayouts() {
        const dropdowns = document.querySelectorAll('.dropdown-menu.multi-column');

        dropdowns.forEach(dropdown => {
            const columns = dropdown.querySelector('.dropdown-columns');
            if (!columns) return;

            const columnElements = Array.from(columns.children);

            // Separate reports column from others
            const reportsColumn = columnElements.find(col =>
                col.querySelector('.dropdown-category-header')?.textContent.trim().toUpperCase() === 'REPORTS'
            );

            const otherColumns = columnElements.filter(col =>
                col.querySelector('.dropdown-category-header')?.textContent.trim().toUpperCase() !== 'REPORTS'
            );

            // Sort other columns by item count (ascending - fewer items first)
            otherColumns.sort((a, b) => {
                const aItems = a.querySelectorAll('.dropdown-item').length;
                const bItems = b.querySelectorAll('.dropdown-item').length;
                return aItems - bItems;
            });

            // Clear and rebuild columns
            columns.innerHTML = '';

            // Add sorted columns
            otherColumns.forEach(col => columns.appendChild(col));

            // Add reports column last if it exists
            if (reportsColumn) {
                columns.appendChild(reportsColumn);
            }
        });
    }

    // Function to ensure dropdown scrolling works
    function ensureDropdownScrolling() {
        const dropdownMenus = [
            '#parts-menu',
            '#service-menu',
            '#tams-menu',
            '#core-menu',
            '#more-menu',
            '#kpi-reports-menu'
        ];

        dropdownMenus.forEach(menuId => {
            const menu = document.querySelector(menuId);
            if (menu) {
                menu.style.maxHeight = 'calc(100vh - 130px)';
                menu.style.overflowY = 'auto';
                menu.style.overflowX = 'hidden';
                console.log(`Applied scrolling to ${menuId}`);
            }
        });
    }

    // Initialize everything
    initializeTheme();
    initializeLanguage();
    animateElements();
    optimizeDropdownLayouts();
    ensureDropdownScrolling();

    // Apply scrolling after a short delay to ensure DOM is ready
    setTimeout(ensureDropdownScrolling, 500);

    // Start real-time data simulation
    setInterval(simulateRealTimeData, 30000); // Update every 30 seconds

    // Welcome message
    setTimeout(() => {
        showNotification('Welcome to your dashboard!', 'success');
    }, 1000);

    // Initialize sidebar functionality
    initializeSidebars();

    // Initialize mega menu tabs
    initializeMegaMenuTabs();

    // Initialize search system
    initializeSearch();

    // Final menu system verification
    setTimeout(() => {
        console.log('=== FINAL MENU SYSTEM VERIFICATION ===');
        const expectedMenus = ['helpdesk', 'parts', 'service', 'tams', 'bay-scheduler', 'core', 'dashboard', 'kpi-reports', 'reports', 'more'];
        let allWorking = true;

        expectedMenus.forEach(menuName => {
            const button = document.querySelector(`button[data-dropdown="${menuName}"]`);
            const menuItem = button ? button.closest('.menu-item') : null;
            const dropdownMenu = menuItem ? menuItem.querySelector('.dropdown-menu') : null;

            if (!button || !menuItem || !dropdownMenu) {
                console.error(`❌ ${menuName.toUpperCase()} menu is not working properly`);
                allWorking = false;
            } else {
                console.log(`✅ ${menuName.toUpperCase()} menu is working`);
            }
        });

        if (allWorking) {
            console.log('🎉 All menu systems are working properly!');
        } else {
            console.warn('⚠️ Some menu systems need attention');
        }
    }, 2000);
});

// Mega Menu Tab System
function initializeMegaMenuTabs() {
    console.log('Initializing mega menu tabs...');

    // Handle tab clicks
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('mega-menu-tab')) {
            e.preventDefault();
            e.stopPropagation();

            const clickedTab = e.target;
            const tabContainer = clickedTab.closest('.mega-menu-tabs');
            const contentContainer = clickedTab.closest('.mega-menu-content');
            const targetTab = clickedTab.getAttribute('data-tab');

            if (!tabContainer || !contentContainer || !targetTab) return;

            // Remove active class from all tabs in this menu
            tabContainer.querySelectorAll('.mega-menu-tab').forEach(tab => {
                tab.classList.remove('active');
            });

            // Add active class to clicked tab
            clickedTab.classList.add('active');

            // Hide all tab content in this menu
            contentContainer.querySelectorAll('.mega-menu-tab-content').forEach(content => {
                content.classList.remove('active');
            });

            // Show target tab content
            const targetContent = contentContainer.querySelector(`#${targetTab}-content`);
            if (targetContent) {
                targetContent.classList.add('active');
            }

            console.log(`Switched to tab: ${targetTab}`);
        }
    });

    // Handle mega menu search
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('mega-menu-search-input')) {
            const searchTerm = e.target.value.toLowerCase();
            const megaMenu = e.target.closest('.dropdown-menu');

            if (!megaMenu) return;

            const cards = megaMenu.querySelectorAll('.mega-card');

            cards.forEach(card => {
                const title = card.querySelector('h4').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();

                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }
    });

    console.log('Mega menu tabs initialized');
}

// Sidebar Management System
function initializeSidebars() {
    console.log('Initializing sidebar system...');

    // Sidebar elements
    const sidebarLeft = document.getElementById('sidebar-left');
    const sidebarRight = document.getElementById('sidebar-right');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const mainContent = document.getElementById('main-content');



    // Toggle buttons
    const toggleLeft = document.getElementById('sidebar-toggle-left');
    const toggleRight = document.getElementById('sidebar-toggle-right');

    // Close buttons
    const closeLeft = document.getElementById('sidebar-left-close');
    const closeRight = document.getElementById('sidebar-right-close');

    // Bookmark management
    const bookmarkModal = document.getElementById('bookmark-modal');
    const bookmarkModalClose = document.getElementById('bookmark-modal-close');
    const manageBookmarksBtn = document.getElementById('manage-bookmarks');
    const manageBookmarksRightBtn = document.getElementById('manage-bookmarks-right');
    const addBookmarkBtn = document.getElementById('add-bookmark-btn');
    const addBookmarkRightBtn = document.getElementById('add-bookmark-btn-right');

    // Initialize bookmark system
    const bookmarkSystem = new BookmarkSystem();

    // Sidebar state management
    let leftSidebarOpen = false;
    let rightSidebarOpen = false;

    // Touch/swipe detection
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    // Functions
    function openLeftSidebar() {
        // Close right sidebar if it's open
        if (rightSidebarOpen) {
            closeRightSidebar();
        }

        leftSidebarOpen = true;
        sidebarLeft.classList.add('open');
        sidebarOverlay.classList.add('active');
        bookmarkSystem.populateSidebar('left');
    }

    function closeLeftSidebar() {
        leftSidebarOpen = false;
        sidebarLeft.classList.remove('open');
        if (!rightSidebarOpen) {
            sidebarOverlay.classList.remove('active');
        }
    }

    function openRightSidebar() {
        // Close left sidebar if it's open
        if (leftSidebarOpen) {
            closeLeftSidebar();
        }

        rightSidebarOpen = true;
        sidebarRight.classList.add('open');
        sidebarOverlay.classList.add('active');
        bookmarkSystem.populateSidebar('right');
    }

    function closeRightSidebar() {
        rightSidebarOpen = false;
        sidebarRight.classList.remove('open');
        if (!leftSidebarOpen) {
            sidebarOverlay.classList.remove('active');
        }
    }

    // Event listeners
    if (toggleLeft) {
        toggleLeft.addEventListener('click', openLeftSidebar);
    }

    if (toggleRight) {
        toggleRight.addEventListener('click', openRightSidebar);
    }

    if (closeLeft) {
        closeLeft.addEventListener('click', closeLeftSidebar);
    }

    if (closeRight) {
        closeRight.addEventListener('click', closeRightSidebar);
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', () => {
            closeLeftSidebar();
            closeRightSidebar();
        });
    }

    // Bookmark management modal
    if (manageBookmarksBtn) {
        manageBookmarksBtn.addEventListener('click', () => {
            bookmarkSystem.openManageModal();
        });
    }

    if (manageBookmarksRightBtn) {
        manageBookmarksRightBtn.addEventListener('click', () => {
            bookmarkSystem.openManageModal();
        });
    }

    if (addBookmarkBtn) {
        addBookmarkBtn.addEventListener('click', () => {
            bookmarkSystem.openManageModal();
        });
    }

    if (addBookmarkRightBtn) {
        addBookmarkRightBtn.addEventListener('click', () => {
            bookmarkSystem.openManageModal();
        });
    }

    if (bookmarkModalClose) {
        bookmarkModalClose.addEventListener('click', () => {
            bookmarkSystem.closeManageModal();
        });
    }

    if (bookmarkModal) {
        bookmarkModal.addEventListener('click', (e) => {
            if (e.target === bookmarkModal) {
                bookmarkSystem.closeManageModal();
            }
        });
    }

    // Touch/swipe detection for mobile
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    });

    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });

    function handleSwipe() {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        const minSwipeDistance = 50;

        // Only handle horizontal swipes
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0 && touchStartX < 50) {
                // Swipe right from left edge
                openLeftSidebar();
            } else if (deltaX < 0 && touchStartX > window.innerWidth - 50) {
                // Swipe left from right edge
                openRightSidebar();
            }
        }
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case '[':
                    e.preventDefault();
                    if (leftSidebarOpen) {
                        closeLeftSidebar();
                    } else {
                        openLeftSidebar();
                    }
                    break;
                case ']':
                    e.preventDefault();
                    if (rightSidebarOpen) {
                        closeRightSidebar();
                    } else {
                        openRightSidebar();
                    }
                    break;
            }
        }

        // Escape key to close sidebars
        if (e.key === 'Escape') {
            if (leftSidebarOpen || rightSidebarOpen) {
                closeLeftSidebar();
                closeRightSidebar();
            }
        }
    });

    console.log('Sidebar system initialized');
}

// Comprehensive Search System
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const searchContainer = searchInput.closest('.search-container');
    let searchResults = null;
    let currentSearchTerm = '';
    let selectedIndex = -1;
    let searchData = [];
    let recentSearches = JSON.parse(localStorage.getItem('dashboard-recent-searches') || '[]');

    // Build comprehensive search index using DOM-based approach (consistent with bookmark system)
    function buildSearchIndex() {
        const searchItems = [];
        const seenItems = new Set(); // Track unique items to avoid duplicates

        // 1. INDEX MAIN MENU BAR ITEMS
        const menuButtons = document.querySelectorAll('.menu-button[data-dropdown]');
        menuButtons.forEach(button => {
            const menuName = button.querySelector('span').textContent.trim();
            const dropdownId = button.getAttribute('data-dropdown');

            // Add main menu item
            const mainMenuId = `main-menu-${dropdownId}`;
            if (!seenItems.has(mainMenuId)) {
                seenItems.add(mainMenuId);
                searchItems.push({
                    id: mainMenuId,
                    name: menuName,
                    type: 'main-menu',
                    icon: 'fas fa-folder',
                    href: `#${dropdownId}`,
                    category: 'Main Menu',
                    path: menuName,
                    searchText: menuName.toLowerCase(),
                    element: button
                });
            }
        });

        // 2. INDEX ALL MENU ITEMS FROM DOM (using same logic as bookmark system)
        const dropdownMenus = document.querySelectorAll('.dropdown-menu[id$="-menu"]');

        dropdownMenus.forEach(dropdown => {
            const menuId = dropdown.id.replace('-menu', '');
            const menuButton = document.querySelector(`button[data-dropdown="${menuId}"]`);
            const menuName = menuButton ? menuButton.querySelector('span').textContent.trim() : menuId.toUpperCase();

            // Find all mega-cards in this dropdown
            const megaCards = dropdown.querySelectorAll('.mega-card');

            megaCards.forEach(card => {
                const href = card.getAttribute('href');
                const titleElement = card.querySelector('h4');
                const descElement = card.querySelector('p');
                const iconElement = card.querySelector('i');

                if (href && titleElement) {
                    const itemId = href.replace('#', '');
                    const itemName = titleElement.textContent.trim();
                    const itemDescription = descElement ? descElement.textContent.trim() : '';
                    const itemIcon = iconElement ? iconElement.className : 'fas fa-circle';

                    // Try to determine category from tab structure
                    let categoryName = 'General';
                    const tabContent = card.closest('.mega-menu-tab-content');
                    if (tabContent) {
                        const tabId = tabContent.id.replace('-content', '');
                        const tabButton = dropdown.querySelector(`[data-tab="${tabId}"]`);
                        if (tabButton) {
                            categoryName = tabButton.textContent.trim();
                        }
                    }

                    // Create unique key to avoid duplicates
                    const uniqueKey = `${menuId}-${itemId}`;

                    if (!seenItems.has(uniqueKey)) {
                        seenItems.add(uniqueKey);
                        searchItems.push({
                            id: uniqueKey,
                            name: itemName,
                            type: 'menu-item',
                            icon: itemIcon,
                            href: href,
                            category: `${menuName} > ${categoryName}`,
                            path: `${menuName} > ${categoryName} > ${itemName}`,
                            searchText: `${menuName} ${categoryName} ${itemName} ${itemDescription}`.toLowerCase(),
                            menuName: menuName,
                            categoryName: categoryName,
                            description: itemDescription,
                            element: card
                        });
                    }
                }
            });
        });

        // 3. INDEX ADDITIONAL MENU ITEMS (like icon buttons in menu bar)
        const iconButtons = document.querySelectorAll('.menu-icon-buttons .icon-button');
        iconButtons.forEach(button => {
            const title = button.getAttribute('title') || button.getAttribute('aria-label');
            if (title) {
                const iconId = `icon-${title.toLowerCase().replace(/\s+/g, '-')}`;
                if (!seenItems.has(iconId)) {
                    seenItems.add(iconId);
                    searchItems.push({
                        id: iconId,
                        name: title,
                        type: 'icon-button',
                        icon: button.querySelector('i').className,
                        href: '#',
                        category: 'Menu Actions',
                        path: `Menu Actions > ${title}`,
                        searchText: `menu actions ${title}`.toLowerCase(),
                        element: button
                    });
                }
            }
        });

        console.log(`Search index built with ${searchItems.length} unique items from DOM:`, {
            'Main Menu Items': searchItems.filter(item => item.type === 'main-menu').length,
            'Menu Items': searchItems.filter(item => item.type === 'menu-item').length,
            'Icon Buttons': searchItems.filter(item => item.type === 'icon-button').length
        });

        return searchItems;
    }

    // Initialize search data
    searchData = buildSearchIndex();

    // Enhanced search filters
    const searchFilters = [
        { id: 'all', name: 'All', icon: 'fas fa-globe' },
        { id: 'main-menu', name: 'Menus', icon: 'fas fa-bars' },
        { id: 'menu-item', name: 'Items', icon: 'fas fa-list' },
        { id: 'sidebar-item', name: 'Bookmarks', icon: 'fas fa-bookmark' },
        { id: 'icon-button', name: 'Actions', icon: 'fas fa-bolt' }
    ];
    let activeFilter = 'all';

    // Create enhanced search results dropdown
    function createSearchDropdown() {
        if (searchResults) return searchResults;

        searchResults = document.createElement('div');
        searchResults.className = 'search-results-dropdown';
        searchResults.innerHTML = `
            <div class="search-results-header">
                <div class="search-results-title">
                    Search Results
                    <span class="search-results-count">0</span>
                </div>
                <button class="search-clear-btn" title="Clear search">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="search-filters">
                ${searchFilters.map(filter => `
                    <button class="search-filter-btn ${filter.id === 'all' ? 'active' : ''}"
                            data-filter="${filter.id}">
                        <i class="${filter.icon}"></i>
                        ${filter.name}
                    </button>
                `).join('')}
            </div>
            <div class="search-results-content">
                <div class="search-results-list"></div>
            </div>
        `;

        // Position dropdown
        searchContainer.style.position = 'relative';
        searchContainer.appendChild(searchResults);

        // Add clear button functionality
        const clearBtn = searchResults.querySelector('.search-clear-btn');
        clearBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            clearSearch();
        });

        // Add filter button functionality
        const filterBtns = searchResults.querySelectorAll('.search-filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filterId = btn.getAttribute('data-filter');
                setActiveFilter(filterId);

                // Re-render results with new filter
                if (currentSearchTerm) {
                    const results = performSearch(currentSearchTerm);
                    renderSearchResults(results);
                }
            });
        });

        return searchResults;
    }

    // Set active filter
    function setActiveFilter(filterId) {
        activeFilter = filterId;

        // Update filter button states
        if (searchResults) {
            const filterBtns = searchResults.querySelectorAll('.search-filter-btn');
            filterBtns.forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-filter') === filterId);
            });
        }
    }

    // Enhanced search with filtering
    function performSearch(query) {
        if (!query || query.length < 1) return [];

        const normalizedQuery = query.toLowerCase().trim();
        let filteredData = searchData;

        // Apply filter if not 'all'
        if (activeFilter !== 'all') {
            filteredData = searchData.filter(item => item.type === activeFilter);
        }

        const results = [];

        filteredData.forEach(item => {
            let score = 0;
            const searchText = item.searchText;
            const name = item.name.toLowerCase();

            // Exact match (highest priority)
            if (name === normalizedQuery) {
                score = 1000;
            }
            // Starts with query
            else if (name.startsWith(normalizedQuery)) {
                score = 900;
            }
            // Contains query as whole word
            else if (name.includes(` ${normalizedQuery} `) || name.includes(` ${normalizedQuery}`) || name.includes(`${normalizedQuery} `)) {
                score = 800;
            }
            // Contains query
            else if (name.includes(normalizedQuery)) {
                score = 700;
            }
            // Search text contains query
            else if (searchText.includes(normalizedQuery)) {
                score = 600;
            }
            // Fuzzy match (check if all characters of query exist in order)
            else if (fuzzyMatch(normalizedQuery, name)) {
                score = 500;
            }

            if (score > 0) {
                results.push({ ...item, score });
            }
        });

        // Sort by score (descending) and then by name
        return results.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return a.name.localeCompare(b.name);
        }).slice(0, 50); // Increased limit to 50 results
    }

    // Simple fuzzy matching
    function fuzzyMatch(query, text) {
        let queryIndex = 0;
        for (let i = 0; i < text.length && queryIndex < query.length; i++) {
            if (text[i] === query[queryIndex]) {
                queryIndex++;
            }
        }
        return queryIndex === query.length;
    }

    // Get display label for item type
    function getItemTypeLabel(type) {
        switch (type) {
            case 'main-menu': return 'Menu';
            case 'menu-item': return 'Item';
            case 'sidebar-item': return 'Bookmark';
            case 'icon-button': return 'Action';
            default: return 'Item';
        }
    }

    // Highlight matching text
    function highlightMatch(text, query) {
        if (!query) return text;

        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    // Enhanced render search results with count
    function renderSearchResults(results) {
        const dropdown = createSearchDropdown();
        const resultsList = dropdown.querySelector('.search-results-list');
        const resultsCount = dropdown.querySelector('.search-results-count');

        // Update results count
        if (resultsCount) {
            resultsCount.textContent = results.length;
        }

        if (results.length === 0) {
            resultsList.innerHTML = `
                <div class="search-no-results">
                    <i class="fas fa-search"></i>
                    <span>No results found for "${currentSearchTerm}"</span>
                    ${recentSearches.length > 0 ? '<div class="search-recent-title">Recent Searches:</div>' : ''}
                    ${renderRecentSearches()}
                </div>
            `;
        } else {
            resultsList.innerHTML = results.map((item, index) => `
                <div class="search-result-item ${index === selectedIndex ? 'selected' : ''}"
                     data-index="${index}"
                     data-href="${item.href}"
                     data-id="${item.id}">
                    <div class="search-result-icon">
                        <i class="${item.icon}"></i>
                    </div>
                    <div class="search-result-content">
                        <div class="search-result-name">
                            ${highlightMatch(item.name, currentSearchTerm)}
                        </div>
                        <div class="search-result-path">
                            ${item.category}
                        </div>
                    </div>
                    <div class="search-result-type">
                        ${getItemTypeLabel(item.type)}
                    </div>
                </div>
            `).join('');
        }

        // Add click handlers
        const resultItems = resultsList.querySelectorAll('.search-result-item');
        resultItems.forEach((item, index) => {
            item.addEventListener('click', () => selectSearchResult(index));
            item.addEventListener('mouseenter', () => setSelectedIndex(index));
        });

        showSearchDropdown();
    }

    // Render recent searches
    function renderRecentSearches() {
        if (recentSearches.length === 0) return '';

        return recentSearches.slice(0, 5).map(search => `
            <div class="search-recent-item" data-search="${search}">
                <i class="fas fa-history"></i>
                <span>${search}</span>
            </div>
        `).join('');
    }

    // Show search dropdown
    function showSearchDropdown() {
        if (searchResults) {
            searchResults.style.display = 'block';
            searchResults.classList.add('active');
        }
    }

    // Hide search dropdown
    function hideSearchDropdown() {
        if (searchResults) {
            console.log('Hiding search dropdown');
            searchResults.classList.remove('active');
            // Use a small delay to allow CSS transition, then hide completely
            setTimeout(() => {
                if (searchResults && !searchResults.classList.contains('active')) {
                    searchResults.style.display = 'none';
                }
            }, 300);
        }
        selectedIndex = -1;
    }

    // Clear search
    function clearSearch() {
        console.log('Clearing search and closing dropdown');
        searchInput.value = '';
        currentSearchTerm = '';
        selectedIndex = -1;
        hideSearchDropdown();
        searchInput.focus();
    }

    // Set selected index
    function setSelectedIndex(index) {
        selectedIndex = index;
        updateSelectedItem();
    }

    // Update selected item visual state
    function updateSelectedItem() {
        if (!searchResults) return;

        const items = searchResults.querySelectorAll('.search-result-item');
        items.forEach((item, index) => {
            item.classList.toggle('selected', index === selectedIndex);
        });
    }

    // Select search result
    function selectSearchResult(index) {
        const results = performSearch(currentSearchTerm);
        if (index >= 0 && index < results.length) {
            const selectedItem = results[index];

            // Add to recent searches
            addToRecentSearches(currentSearchTerm);

            // Navigate to item
            navigateToItem(selectedItem);

            // Clear search
            clearSearch();
        }
    }

    // Navigate to selected item
    function navigateToItem(item) {
        console.log('Navigating to:', item);

        // Show notification
        showNotification(`Opening ${item.name}...`, 'info');

        // Handle different types of navigation
        switch (item.type) {
            case 'main-menu':
                // Open the main menu dropdown
                if (item.element) {
                    item.element.click();
                    setTimeout(() => {
                        showNotification(`${item.name} menu opened`, 'success');
                    }, 300);
                }
                break;

            case 'menu-item':
                // For menu items, first open the parent dropdown, then highlight the item
                const menuButton = document.querySelector(`[data-dropdown="${item.id.split('-')[0]}"]`);
                if (menuButton) {
                    // Open the dropdown first
                    menuButton.click();

                    // Wait for dropdown to open, then highlight the item
                    setTimeout(() => {
                        if (item.element) {
                            // Scroll to the item and highlight it
                            item.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            item.element.style.backgroundColor = 'var(--accent-color)';
                            item.element.style.color = 'white';

                            // Remove highlight after 2 seconds
                            setTimeout(() => {
                                item.element.style.backgroundColor = '';
                                item.element.style.color = '';
                            }, 2000);
                        }
                        showNotification(`Found ${item.name} in ${item.menuName}`, 'success');
                    }, 300);
                }
                break;

            case 'sidebar-item':
                // Handle sidebar bookmark items
                if (window.bookmarkSystem) {
                    window.bookmarkSystem.trackUsage(item.id.replace('sidebar-', ''));
                }
                setTimeout(() => {
                    showNotification(`${item.name} bookmark accessed`, 'success');
                }, 500);
                break;

            case 'icon-button':
                // Handle icon button clicks
                if (item.element) {
                    item.element.click();
                    setTimeout(() => {
                        showNotification(`${item.name} activated`, 'success');
                    }, 300);
                }
                break;

            default:
                // Generic navigation
                setTimeout(() => {
                    showNotification(`${item.name} opened successfully`, 'success');
                }, 1000);
                break;
        }
    }

    // Add to recent searches
    function addToRecentSearches(term) {
        if (!term || term.length < 2) return;

        // Remove if already exists
        recentSearches = recentSearches.filter(search => search !== term);

        // Add to beginning
        recentSearches.unshift(term);

        // Keep only last 10
        recentSearches = recentSearches.slice(0, 10);

        // Save to localStorage
        localStorage.setItem('dashboard-recent-searches', JSON.stringify(recentSearches));
    }

    // Search input event handlers
    searchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value.trim();

        if (currentSearchTerm.length === 0) {
            hideSearchDropdown();
            return;
        }

        const results = performSearch(currentSearchTerm);
        renderSearchResults(results);
        selectedIndex = -1;
    });

    // Keyboard navigation
    searchInput.addEventListener('keydown', (e) => {
        if (!searchResults || !searchResults.classList.contains('active')) return;

        const results = performSearch(currentSearchTerm);

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                selectedIndex = Math.min(selectedIndex + 1, results.length - 1);
                updateSelectedItem();
                break;

            case 'ArrowUp':
                e.preventDefault();
                selectedIndex = Math.max(selectedIndex - 1, -1);
                updateSelectedItem();
                break;

            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0) {
                    selectSearchResult(selectedIndex);
                } else if (results.length > 0) {
                    selectSearchResult(0);
                }
                break;

            case 'Escape':
                e.preventDefault();
                clearSearch();
                break;
        }
    });

    // Focus and blur handlers
    searchInput.addEventListener('focus', () => {
        if (currentSearchTerm) {
            showSearchDropdown();
        }
    });

    // Click outside to close
    document.addEventListener('click', (e) => {
        // Don't close if clicking on the clear button (it handles its own closing)
        if (e.target.closest('.search-clear-btn')) {
            return;
        }

        if (!searchContainer.contains(e.target)) {
            hideSearchDropdown();
        }
    });

    // Handle recent search clicks
    document.addEventListener('click', (e) => {
        const recentItem = e.target.closest('.search-recent-item');
        if (recentItem) {
            const searchTerm = recentItem.getAttribute('data-search');
            searchInput.value = searchTerm;
            currentSearchTerm = searchTerm;
            const results = performSearch(currentSearchTerm);
            renderSearchResults(results);
        }
    });

    console.log('Search system initialized with', searchData.length, 'searchable items');
}



// Bookmark Management System
class BookmarkSystem {
    constructor() {
        this.bookmarks = this.loadBookmarks();
        this.usageStats = this.loadUsageStats();
        this.maxBookmarks = 5; // Maximum number of bookmarks allowed
        this.pendingChanges = false; // Track if there are unsaved changes
        this.initializeDefaultBookmarks();
    }

    // Load bookmarks from localStorage
    loadBookmarks() {
        const saved = localStorage.getItem('dashboard-bookmarks');
        return saved ? JSON.parse(saved) : [];
    }

    // Save bookmarks to localStorage
    saveBookmarks() {
        localStorage.setItem('dashboard-bookmarks', JSON.stringify(this.bookmarks));
    }

    // Load usage statistics
    loadUsageStats() {
        const saved = localStorage.getItem('dashboard-usage-stats');
        return saved ? JSON.parse(saved) : {};
    }

    // Save usage statistics
    saveUsageStats() {
        localStorage.setItem('dashboard-usage-stats', JSON.stringify(this.usageStats));
    }

    // Initialize default bookmarks if none exist
    initializeDefaultBookmarks() {
        if (this.bookmarks.length === 0) {
            // Use a few common items from the DOM as defaults
            const defaultItems = ['helpdesk-ticket', 'parts-purchase-order', 'service-work-order', 'tams-tams-dashboard'];

            defaultItems.forEach(itemId => {
                const item = this.findMenuItem(itemId);
                if (item) {
                    this.bookmarks.push({
                        id: item.id,
                        name: item.name,
                        icon: item.icon,
                        href: item.href,
                        category: this.getItemCategory(item.id),
                        dateAdded: new Date().toISOString()
                    });
                }
            });

            if (this.bookmarks.length > 0) {
                this.saveBookmarks();
            }
        }
    }

    // Find a menu item by ID using DOM-based index
    findMenuItem(itemId) {
        const menuItemsIndex = this.buildMenuItemsIndex();

        for (const [menuKey, menuData] of Object.entries(menuItemsIndex)) {
            for (const [categoryKey, categoryData] of Object.entries(menuData.categories)) {
                const item = categoryData.items.find(item => item.uniqueId === itemId || item.id === itemId);
                if (item) {
                    return {
                        id: item.uniqueId,
                        name: item.name,
                        icon: item.icon,
                        href: item.href,
                        menuName: item.menuName,
                        categoryName: item.categoryName,
                        description: item.description
                    };
                }
            }
        }
        return null;
    }

    // Get category for an item
    getItemCategory(itemId) {
        const item = this.findMenuItem(itemId);
        return item ? `${item.menuName} > ${item.categoryName}` : 'Unknown';
    }

    // Track menu item usage
    trackUsage(itemId) {
        if (!this.usageStats[itemId]) {
            this.usageStats[itemId] = {
                count: 0,
                lastUsed: null
            };
        }
        this.usageStats[itemId].count++;
        this.usageStats[itemId].lastUsed = new Date().toISOString();
        this.saveUsageStats();
    }

    // Get frequently used items
    getFrequentlyUsed(limit = 6) {
        const sortedItems = Object.entries(this.usageStats)
            .sort(([,a], [,b]) => b.count - a.count)
            .slice(0, limit)
            .map(([itemId]) => {
                const item = this.findMenuItem(itemId);
                return item ? {
                    id: item.id,
                    name: item.name,
                    icon: item.icon,
                    href: item.href,
                    category: this.getItemCategory(item.id),
                    usage: this.usageStats[itemId]
                } : null;
            })
            .filter(item => item !== null);

        // If not enough frequently used items, fill with common items from bookmarks
        if (sortedItems.length < limit) {
            const commonItems = ['helpdesk-ticket', 'parts-purchase-order', 'service-work-order', 'tams-tams-dashboard', 'dashboard-ticket-summary', 'core-company-calendar']
                .filter(itemId => !sortedItems.find(item => item.id === itemId))
                .slice(0, limit - sortedItems.length)
                .map(itemId => {
                    const item = this.findMenuItem(itemId);
                    return item ? {
                        id: item.id,
                        name: item.name,
                        icon: item.icon,
                        href: item.href,
                        category: this.getItemCategory(item.id)
                    } : null;
                })
                .filter(item => item !== null);

            sortedItems.push(...commonItems);
        }

        return sortedItems;
    }

    // Add bookmark
    addBookmark(itemId) {
        if (this.bookmarks.find(b => b.id === itemId)) {
            return { success: false, reason: 'already_bookmarked' }; // Already bookmarked
        }

        // Check bookmark limit
        if (this.bookmarks.length >= this.maxBookmarks) {
            this.showBookmarkLimitWarning();
            return { success: false, reason: 'limit_exceeded' };
        }

        const item = this.findMenuItem(itemId);
        if (!item) return { success: false, reason: 'item_not_found' };

        this.bookmarks.push({
            id: itemId,
            name: item.name,
            icon: item.icon,
            href: item.href,
            category: this.getItemCategory(itemId),
            dateAdded: new Date().toISOString()
        });

        this.pendingChanges = true;
        this.updateBookmarkControls();
        this.refreshSidebars();
        return { success: true };
    }

    // Remove bookmark
    removeBookmark(itemId) {
        const index = this.bookmarks.findIndex(b => b.id === itemId);
        if (index === -1) return false;

        this.bookmarks.splice(index, 1);
        this.pendingChanges = true;
        this.updateBookmarkControls();
        this.refreshSidebars();
        return true;
    }

    // Check if item is bookmarked
    isBookmarked(itemId) {
        return this.bookmarks.some(b => b.id === itemId);
    }

    // Show bookmark limit warning
    showBookmarkLimitWarning() {
        const warning = document.getElementById('bookmark-limit-warning');
        if (warning) {
            warning.style.display = 'flex';
            setTimeout(() => {
                warning.style.display = 'none';
            }, 3000);
        }
    }

    // Deselect all bookmarks
    deselectAllBookmarks() {
        if (this.bookmarks.length === 0) return;

        this.bookmarks = [];
        this.pendingChanges = true;
        this.updateBookmarkControls();
        this.refreshSidebars();

        // Update modal UI
        const modal = document.getElementById('bookmark-modal');
        if (modal && modal.classList.contains('active')) {
            this.populateManageModal();
        }

        this.showNotification('All bookmarks deselected', 'info');
    }

    // Save bookmarks with user feedback
    saveBookmarksWithFeedback() {
        localStorage.setItem('dashboard-bookmarks', JSON.stringify(this.bookmarks));
        this.pendingChanges = false;
        this.updateBookmarkControls();
        this.showNotification('Bookmarks saved successfully!', 'success');
    }

    // Save bookmarks to localStorage (existing method)
    saveBookmarks() {
        localStorage.setItem('dashboard-bookmarks', JSON.stringify(this.bookmarks));
    }

    // Update bookmark controls UI
    updateBookmarkControls() {
        const countElement = document.getElementById('current-bookmark-count');
        const warningElement = document.getElementById('bookmark-limit-warning');
        const saveBtn = document.getElementById('save-bookmarks-btn');
        const deselectBtn = document.getElementById('deselect-all-btn');

        if (countElement) {
            countElement.textContent = this.bookmarks.length;
        }

        if (saveBtn) {
            saveBtn.disabled = !this.pendingChanges;
        }

        if (deselectBtn) {
            deselectBtn.disabled = this.bookmarks.length === 0;
        }

        // Show/hide warning based on bookmark count
        if (warningElement && this.bookmarks.length >= this.maxBookmarks) {
            warningElement.style.display = 'flex';
        } else if (warningElement) {
            warningElement.style.display = 'none';
        }
    }

    // Show notification to user
    showNotification(message, type = 'info') {
        // Create notification element if it doesn't exist
        let notification = document.getElementById('bookmark-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'bookmark-notification';
            notification.className = 'bookmark-notification';
            document.body.appendChild(notification);
        }

        notification.className = `bookmark-notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;

        notification.style.display = 'flex';
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.style.display = 'none';
            }, 300);
        }, 3000);
    }

    // Populate sidebar with bookmarks
    populateSidebar(side) {
        const bookmarkList = document.getElementById(`bookmark-list${side === 'right' ? '-right' : ''}`);
        const quickAccessList = document.getElementById(`quick-access-list${side === 'right' ? '-right' : ''}`);

        if (bookmarkList) {
            this.renderBookmarkList(bookmarkList);
        }

        if (quickAccessList) {
            this.renderQuickAccessList(quickAccessList);
        }
    }

    // Render bookmark list
    renderBookmarkList(container) {
        container.innerHTML = '';

        if (this.bookmarks.length === 0) {
            container.innerHTML = `
                <div class="bookmark-empty">
                    <p>No bookmarks yet. Click "Add Bookmark" to get started!</p>
                </div>
            `;
            return;
        }

        this.bookmarks.forEach(bookmark => {
            const item = this.createBookmarkElement(bookmark, true);
            container.appendChild(item);
        });
    }

    // Render quick access list
    renderQuickAccessList(container) {
        container.innerHTML = '';
        const frequentlyUsed = this.getFrequentlyUsed();

        frequentlyUsed.forEach(item => {
            const element = this.createBookmarkElement(item, false);
            container.appendChild(element);
        });
    }

    // Create bookmark element
    createBookmarkElement(item, showRemove = false) {
        const element = document.createElement('div');
        element.className = showRemove ? 'bookmark-item' : 'quick-access-item';

        element.innerHTML = `
            <i class="${item.icon}"></i>
            <div class="${showRemove ? 'bookmark-item-content' : 'quick-access-item-content'}">
                <div class="${showRemove ? 'bookmark-item-name' : 'quick-access-item-name'}">${item.name}</div>
                <div class="${showRemove ? 'bookmark-item-category' : 'quick-access-item-category'}">${item.category}</div>
            </div>
            ${showRemove ? `<button class="bookmark-remove" data-id="${item.id}"><i class="fas fa-times"></i></button>` : ''}
        `;

        // Add click handler
        element.addEventListener('click', (e) => {
            if (e.target.closest('.bookmark-remove')) {
                this.removeBookmark(item.id);
                return;
            }

            this.trackUsage(item.id);
            // Navigate to the item (you can customize this based on your routing)
            console.log(`Navigating to: ${item.href}`);

            // Close sidebars after navigation
            document.querySelectorAll('.sidebar.open').forEach(sidebar => {
                sidebar.classList.remove('open');
            });
            document.getElementById('sidebar-overlay').classList.remove('active');
        });

        return element;
    }

    // Refresh both sidebars
    refreshSidebars() {
        this.populateSidebar('left');
        this.populateSidebar('right');
    }

    // Open manage bookmarks modal
    openManageModal() {
        const modal = document.getElementById('bookmark-modal');
        if (modal) {
            modal.classList.add('active');
            this.populateManageModal();
            this.initializeModalControls();
            this.updateBookmarkControls();
        }
    }

    // Initialize modal controls
    initializeModalControls() {
        const deselectAllBtn = document.getElementById('deselect-all-btn');
        const saveBtn = document.getElementById('save-bookmarks-btn');

        // Remove existing event listeners to prevent duplicates
        if (deselectAllBtn) {
            deselectAllBtn.replaceWith(deselectAllBtn.cloneNode(true));
            const newDeselectBtn = document.getElementById('deselect-all-btn');
            newDeselectBtn.addEventListener('click', () => {
                this.deselectAllBookmarks();
            });
        }

        if (saveBtn) {
            saveBtn.replaceWith(saveBtn.cloneNode(true));
            const newSaveBtn = document.getElementById('save-bookmarks-btn');
            newSaveBtn.addEventListener('click', () => {
                this.saveBookmarksWithFeedback();
            });
        }
    }

    // Close manage bookmarks modal
    closeManageModal() {
        const modal = document.getElementById('bookmark-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    // Build comprehensive menu items index from actual DOM
    buildMenuItemsIndex() {
        const menuItems = new Map(); // Use Map to avoid duplicates

        // Get all dropdown menus
        const dropdownMenus = document.querySelectorAll('.dropdown-menu[id$="-menu"]');

        dropdownMenus.forEach(dropdown => {
            const menuId = dropdown.id.replace('-menu', '');
            const menuButton = document.querySelector(`button[data-dropdown="${menuId}"]`);
            const menuName = menuButton ? menuButton.querySelector('span').textContent.trim() : menuId.toUpperCase();

            // Get menu icon from button or use default
            let menuIcon = 'fas fa-folder';
            if (menuButton) {
                const iconElement = menuButton.querySelector('i');
                if (iconElement) {
                    menuIcon = iconElement.className;
                }
            }

            // Find all mega-cards in this dropdown
            const megaCards = dropdown.querySelectorAll('.mega-card');

            megaCards.forEach(card => {
                const href = card.getAttribute('href');
                const titleElement = card.querySelector('h4');
                const descElement = card.querySelector('p');
                const iconElement = card.querySelector('i');

                if (href && titleElement) {
                    const itemId = href.replace('#', '');
                    const itemName = titleElement.textContent.trim();
                    const itemDescription = descElement ? descElement.textContent.trim() : '';
                    const itemIcon = iconElement ? iconElement.className : 'fas fa-circle';

                    // Try to determine category from tab structure
                    let categoryName = 'General';
                    const tabContent = card.closest('.mega-menu-tab-content');
                    if (tabContent) {
                        const tabId = tabContent.id.replace('-content', '');
                        const tabButton = dropdown.querySelector(`[data-tab="${tabId}"]`);
                        if (tabButton) {
                            categoryName = tabButton.textContent.trim();
                        }
                    }

                    // Create unique key to avoid duplicates
                    const uniqueKey = `${menuId}-${itemId}`;

                    if (!menuItems.has(uniqueKey)) {
                        menuItems.set(uniqueKey, {
                            id: itemId,
                            uniqueId: uniqueKey,
                            name: itemName,
                            description: itemDescription,
                            icon: itemIcon,
                            href: href,
                            menuId: menuId,
                            menuName: menuName,
                            menuIcon: menuIcon,
                            categoryName: categoryName,
                            path: `${menuName} > ${categoryName} > ${itemName}`,
                            searchText: `${menuName} ${categoryName} ${itemName} ${itemDescription}`.toLowerCase()
                        });
                    }
                }
            });
        });

        // Convert Map to grouped structure for display
        const groupedItems = {};
        menuItems.forEach(item => {
            if (!groupedItems[item.menuId]) {
                groupedItems[item.menuId] = {
                    name: item.menuName,
                    icon: item.menuIcon,
                    categories: {}
                };
            }

            if (!groupedItems[item.menuId].categories[item.categoryName]) {
                groupedItems[item.menuId].categories[item.categoryName] = {
                    name: item.categoryName,
                    items: []
                };
            }

            groupedItems[item.menuId].categories[item.categoryName].items.push(item);
        });

        console.log(`Built menu index with ${menuItems.size} unique items across ${Object.keys(groupedItems).length} menus`);
        return groupedItems;
    }

    // Populate manage bookmarks modal
    populateManageModal() {
        const categoriesContainer = document.getElementById('bookmark-categories');
        const searchInput = document.getElementById('bookmark-search');

        if (!categoriesContainer) return;

        // Set up comprehensive search functionality
        if (searchInput) {
            this.initializeBookmarkSearch(searchInput, categoriesContainer);
        }

        // Clear and populate categories
        categoriesContainer.innerHTML = '';

        // Build fresh index from actual DOM
        const menuItemsIndex = this.buildMenuItemsIndex();

        Object.entries(menuItemsIndex).forEach(([menuKey, menuData]) => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'bookmark-category';
            categoryDiv.setAttribute('data-menu', menuKey);

            const headerDiv = document.createElement('div');
            headerDiv.className = 'bookmark-category-header';
            headerDiv.innerHTML = `<i class="${menuData.icon}"></i> ${menuData.name}`;

            const itemsDiv = document.createElement('div');
            itemsDiv.className = 'bookmark-category-items';

            // Add all items from all categories in this menu
            Object.entries(menuData.categories).forEach(([categoryKey, categoryData]) => {
                categoryData.items.forEach(item => {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'bookmark-category-item';
                    itemDiv.setAttribute('data-item-id', item.uniqueId);
                    itemDiv.setAttribute('data-search-text', item.searchText);

                    if (this.isBookmarked(item.uniqueId)) {
                        itemDiv.classList.add('bookmarked');
                    }

                    itemDiv.innerHTML = `
                        <div class="bookmark-category-item-icon">
                            <i class="${item.icon}"></i>
                        </div>
                        <div class="bookmark-category-item-content">
                            <div class="bookmark-category-item-name">${item.name}</div>
                            <div class="bookmark-category-item-category">${item.path}</div>
                        </div>
                        <div class="bookmark-toggle ${this.isBookmarked(item.uniqueId) ? 'active' : ''}" data-item-id="${item.uniqueId}">
                            <i class="fas fa-check"></i>
                        </div>
                    `;

                    // Add click handler for toggle
                    const toggle = itemDiv.querySelector('.bookmark-toggle');
                    toggle.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.toggleBookmark(item.uniqueId);
                        this.updateModalItemState(item.uniqueId);
                    });

                    // Add click handler for item
                    itemDiv.addEventListener('click', () => {
                        this.toggleBookmark(item.uniqueId);
                        this.updateModalItemState(item.uniqueId);
                    });

                    itemsDiv.appendChild(itemDiv);
                });
            });

            categoryDiv.appendChild(headerDiv);
            categoryDiv.appendChild(itemsDiv);
            categoriesContainer.appendChild(categoryDiv);
        });
    }

    // Toggle bookmark status
    toggleBookmark(itemId) {
        if (this.isBookmarked(itemId)) {
            this.removeBookmark(itemId);
        } else {
            const result = this.addBookmark(itemId);
            if (!result.success && result.reason === 'limit_exceeded') {
                this.showNotification(`Cannot add more than ${this.maxBookmarks} bookmarks`, 'error');
                return false;
            }
        }
        return true;
    }

    // Update modal item state
    updateModalItemState(itemId) {
        const itemDiv = document.querySelector(`[data-item-id="${itemId}"]`);
        const toggle = itemDiv?.querySelector('.bookmark-toggle');

        if (itemDiv && toggle) {
            const isBookmarked = this.isBookmarked(itemId);

            if (isBookmarked) {
                itemDiv.classList.add('bookmarked');
                toggle.classList.add('active');
            } else {
                itemDiv.classList.remove('bookmarked');
                toggle.classList.remove('active');
            }
        }
    }

    // Initialize comprehensive bookmark search system
    initializeBookmarkSearch(searchInput, categoriesContainer) {
        let bookmarkSearchData = [];
        let currentBookmarkSearchTerm = '';
        let bookmarkSearchResults = null;
        let selectedBookmarkIndex = -1;
        let recentBookmarkSearches = JSON.parse(localStorage.getItem('bookmark-recent-searches') || '[]');

        // Build comprehensive bookmark search index using DOM-based approach
        const buildBookmarkSearchIndex = () => {
            const searchItems = [];
            const seenItems = new Set(); // Track unique items to avoid duplicates

            // Use the same DOM-based indexing as the main bookmark system
            const menuItemsIndex = this.buildMenuItemsIndex();

            // Convert the grouped structure to a flat array for search
            Object.entries(menuItemsIndex).forEach(([menuKey, menuData]) => {
                Object.entries(menuData.categories).forEach(([categoryKey, categoryData]) => {
                    categoryData.items.forEach(item => {
                        // Use uniqueId to avoid duplicates
                        if (!seenItems.has(item.uniqueId)) {
                            seenItems.add(item.uniqueId);

                            searchItems.push({
                                id: item.uniqueId,
                                name: item.name,
                                type: 'menu-item',
                                icon: item.icon,
                                href: item.href,
                                category: item.path,
                                path: item.path,
                                searchText: item.searchText,
                                menuName: item.menuName,
                                categoryName: item.categoryName,
                                description: item.description,
                                isBookmarked: this.isBookmarked(item.uniqueId)
                            });
                        }
                    });
                });
            });

            console.log(`Bookmark search index built with ${searchItems.length} unique items from DOM`);
            return searchItems;
        };

        // Initialize search data
        bookmarkSearchData = buildBookmarkSearchIndex();

        // Create search results dropdown for bookmark modal
        const createBookmarkSearchDropdown = () => {
            // Check if dropdown already exists in the DOM to prevent duplicates
            const existingDropdown = document.querySelector('.bookmark-search-results-dropdown');
            if (existingDropdown) {
                bookmarkSearchResults = existingDropdown;
                return bookmarkSearchResults;
            }

            if (bookmarkSearchResults) return bookmarkSearchResults;

            bookmarkSearchResults = document.createElement('div');
            bookmarkSearchResults.className = 'bookmark-search-results-dropdown';
            bookmarkSearchResults.innerHTML = `
                <div class="bookmark-search-results-header">
                    <span class="bookmark-search-results-title">Available Menu Items</span>
                    <button class="bookmark-search-clear-btn" title="Clear search">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="bookmark-search-results-content">
                    <div class="bookmark-search-results-list"></div>
                </div>
            `;

            // Position dropdown - append to modal body instead of search container
            const modalBody = document.querySelector('.bookmark-modal-body');
            if (modalBody) {
                modalBody.appendChild(bookmarkSearchResults);
            }

            // Add clear button functionality
            const clearBtn = bookmarkSearchResults.querySelector('.bookmark-search-clear-btn');
            clearBtn.addEventListener('click', clearBookmarkSearch);

            return bookmarkSearchResults;
        };

        // Perform comprehensive bookmark search
        const performBookmarkSearch = (query) => {
            if (!query || query.length < 1) return [];

            const normalizedQuery = query.toLowerCase().trim();
            const results = [];

            bookmarkSearchData.forEach(item => {
                let score = 0;
                const searchText = item.searchText;
                const name = item.name.toLowerCase();

                // Exact match (highest priority)
                if (name === normalizedQuery) {
                    score = 1000;
                }
                // Starts with query
                else if (name.startsWith(normalizedQuery)) {
                    score = 900;
                }
                // Contains query as whole word
                else if (name.includes(` ${normalizedQuery} `) || name.includes(` ${normalizedQuery}`) || name.includes(`${normalizedQuery} `)) {
                    score = 800;
                }
                // Contains query
                else if (name.includes(normalizedQuery)) {
                    score = 700;
                }
                // Search text contains query
                else if (searchText.includes(normalizedQuery)) {
                    score = 600;
                }
                // Fuzzy match
                else if (fuzzyMatchBookmark(normalizedQuery, name)) {
                    score = 500;
                }

                if (score > 0) {
                    results.push({ ...item, score });
                }
            });

            return results.sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                return a.name.localeCompare(b.name);
            }).slice(0, 15); // Show more results for bookmark search
        };

        // Simple fuzzy matching for bookmarks
        const fuzzyMatchBookmark = (query, text) => {
            let queryIndex = 0;
            for (let i = 0; i < text.length && queryIndex < query.length; i++) {
                if (text[i] === query[queryIndex]) {
                    queryIndex++;
                }
            }
            return queryIndex === query.length;
        };

        // Highlight matching text in bookmark search
        const highlightBookmarkMatch = (text, query) => {
            if (!query) return text;

            const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
            return text.replace(regex, '<mark>$1</mark>');
        };

        // Render bookmark search results
        const renderBookmarkSearchResults = (results) => {
            const dropdown = createBookmarkSearchDropdown();
            const resultsList = dropdown.querySelector('.bookmark-search-results-list');

            if (results.length === 0) {
                resultsList.innerHTML = `
                    <div class="bookmark-search-no-results">
                        <i class="fas fa-search"></i>
                        <span>No items found for "${currentBookmarkSearchTerm}"</span>
                        ${recentBookmarkSearches.length > 0 ? '<div class="bookmark-search-recent-title">Recent Searches:</div>' : ''}
                        ${renderRecentBookmarkSearches()}
                    </div>
                `;
            } else {
                resultsList.innerHTML = results.map((item, index) => `
                    <div class="bookmark-search-result-item ${index === selectedBookmarkIndex ? 'selected' : ''}"
                         data-index="${index}"
                         data-item-id="${item.id}">
                        <div class="bookmark-search-result-icon">
                            <i class="${item.icon}"></i>
                        </div>
                        <div class="bookmark-search-result-content">
                            <div class="bookmark-search-result-name">
                                ${highlightBookmarkMatch(item.name, currentBookmarkSearchTerm)}
                            </div>
                            <div class="bookmark-search-result-path">
                                ${item.category}
                            </div>
                        </div>
                        <div class="bookmark-search-result-actions">
                            <button class="bookmark-toggle-btn ${item.isBookmarked ? 'active' : ''}"
                                    data-item-id="${item.id}"
                                    title="${item.isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}">
                                <i class="fas fa-check"></i>
                            </button>
                        </div>
                    </div>
                `).join('');
            }

            // Add click handlers
            const resultItems = resultsList.querySelectorAll('.bookmark-search-result-item');
            resultItems.forEach((item, index) => {
                item.addEventListener('click', (e) => {
                    if (e.target.closest('.bookmark-toggle-btn')) {
                        e.stopPropagation();
                        const itemId = e.target.closest('.bookmark-toggle-btn').getAttribute('data-item-id');
                        const result = results[index];

                        // Handle bookmark toggle for all menu items uniformly
                        if (result.isBookmarked) {
                            this.removeBookmark(itemId);
                        } else {
                            // Check bookmark limit before adding
                            if (this.bookmarks.length >= this.maxBookmarks) {
                                this.showNotification(`Cannot add more than ${this.maxBookmarks} bookmarks`, 'error');
                                return;
                            }

                            // Create a bookmark-compatible item
                            const bookmarkItem = {
                                id: itemId,
                                name: result.name,
                                icon: result.icon,
                                href: result.href,
                                category: result.category,
                                dateAdded: new Date().toISOString()
                            };
                            this.bookmarks.push(bookmarkItem);
                            this.pendingChanges = true;
                            this.updateBookmarkControls();
                            this.refreshSidebars();
                        }

                        // Refresh search results to update bookmark status
                        bookmarkSearchData = buildBookmarkSearchIndex(); // Rebuild index
                        const newResults = performBookmarkSearch(currentBookmarkSearchTerm);
                        renderBookmarkSearchResults(newResults);
                        return;
                    }
                    setSelectedBookmarkIndex(index);
                });
                item.addEventListener('mouseenter', () => setSelectedBookmarkIndex(index));
            });

            showBookmarkSearchDropdown();
        };

        // Render recent bookmark searches
        const renderRecentBookmarkSearches = () => {
            if (recentBookmarkSearches.length === 0) return '';

            return recentBookmarkSearches.slice(0, 5).map(search => `
                <div class="bookmark-search-recent-item" data-search="${search}">
                    <i class="fas fa-history"></i>
                    <span>${search}</span>
                </div>
            `).join('');
        };

        // Show bookmark search dropdown
        const showBookmarkSearchDropdown = () => {
            if (bookmarkSearchResults) {
                bookmarkSearchResults.style.display = 'block';
                setTimeout(() => {
                    bookmarkSearchResults.classList.add('active');
                }, 10);
                // Hide the regular categories when showing search results
                categoriesContainer.style.display = 'none';
            }
        };

        // Hide bookmark search dropdown
        const hideBookmarkSearchDropdown = () => {
            if (bookmarkSearchResults) {
                bookmarkSearchResults.classList.remove('active');
                setTimeout(() => {
                    bookmarkSearchResults.style.display = 'none';
                }, 300);
                // Show the regular categories when hiding search results
                categoriesContainer.style.display = 'flex';
            }
            selectedBookmarkIndex = -1;
        };

        // Clear bookmark search
        const clearBookmarkSearch = () => {
            searchInput.value = '';
            currentBookmarkSearchTerm = '';
            hideBookmarkSearchDropdown();
            searchInput.focus();
        };

        // Set selected bookmark index
        const setSelectedBookmarkIndex = (index) => {
            selectedBookmarkIndex = index;
            updateSelectedBookmarkItem();
        };

        // Update selected bookmark item visual state
        const updateSelectedBookmarkItem = () => {
            if (!bookmarkSearchResults) return;

            const items = bookmarkSearchResults.querySelectorAll('.bookmark-search-result-item');
            items.forEach((item, index) => {
                item.classList.toggle('selected', index === selectedBookmarkIndex);
            });
        };

        // Add to recent bookmark searches
        const addToRecentBookmarkSearches = (term) => {
            if (!term || term.length < 2) return;

            recentBookmarkSearches = recentBookmarkSearches.filter(search => search !== term);
            recentBookmarkSearches.unshift(term);
            recentBookmarkSearches = recentBookmarkSearches.slice(0, 10);
            localStorage.setItem('bookmark-recent-searches', JSON.stringify(recentBookmarkSearches));
        };

        // Search input event handlers
        searchInput.addEventListener('input', (e) => {
            currentBookmarkSearchTerm = e.target.value.trim();

            if (currentBookmarkSearchTerm.length === 0) {
                hideBookmarkSearchDropdown();
                return;
            }

            const results = performBookmarkSearch(currentBookmarkSearchTerm);
            renderBookmarkSearchResults(results);
            selectedBookmarkIndex = -1;
        });

        // Keyboard navigation for bookmark search
        searchInput.addEventListener('keydown', (e) => {
            if (!bookmarkSearchResults || !bookmarkSearchResults.classList.contains('active')) return;

            const results = performBookmarkSearch(currentBookmarkSearchTerm);

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    selectedBookmarkIndex = Math.min(selectedBookmarkIndex + 1, results.length - 1);
                    updateSelectedBookmarkItem();
                    break;

                case 'ArrowUp':
                    e.preventDefault();
                    selectedBookmarkIndex = Math.max(selectedBookmarkIndex - 1, -1);
                    updateSelectedBookmarkItem();
                    break;

                case 'Enter':
                    e.preventDefault();
                    if (selectedBookmarkIndex >= 0 && results[selectedBookmarkIndex]) {
                        const result = results[selectedBookmarkIndex];

                        // Handle bookmark toggle for all menu items uniformly
                        if (result.isBookmarked) {
                            this.removeBookmark(result.id);
                        } else {
                            // Check bookmark limit before adding
                            if (this.bookmarks.length >= this.maxBookmarks) {
                                this.showNotification(`Cannot add more than ${this.maxBookmarks} bookmarks`, 'error');
                                return;
                            }

                            // Create a bookmark-compatible item
                            const bookmarkItem = {
                                id: result.id,
                                name: result.name,
                                icon: result.icon,
                                href: result.href,
                                category: result.category,
                                dateAdded: new Date().toISOString()
                            };
                            this.bookmarks.push(bookmarkItem);
                            this.pendingChanges = true;
                            this.updateBookmarkControls();
                            this.refreshSidebars();
                        }

                        addToRecentBookmarkSearches(currentBookmarkSearchTerm);
                        // Refresh search results
                        bookmarkSearchData = buildBookmarkSearchIndex();
                        const newResults = performBookmarkSearch(currentBookmarkSearchTerm);
                        renderBookmarkSearchResults(newResults);
                    }
                    break;

                case 'Escape':
                    e.preventDefault();
                    clearBookmarkSearch();
                    break;
            }
        });

        // Handle recent bookmark search clicks
        document.addEventListener('click', (e) => {
            const recentItem = e.target.closest('.bookmark-search-recent-item');
            if (recentItem) {
                const searchTerm = recentItem.getAttribute('data-search');
                searchInput.value = searchTerm;
                currentBookmarkSearchTerm = searchTerm;
                const results = performBookmarkSearch(currentBookmarkSearchTerm);
                renderBookmarkSearchResults(results);
            }
        });

        console.log('Comprehensive bookmark search system initialized');
    }

    // Legacy filter function (kept for compatibility)
    filterModalItems(searchTerm) {
        // This function is now replaced by the comprehensive search system
        // but kept for any legacy calls
        const searchInput = document.getElementById('bookmark-search');
        if (searchInput) {
            searchInput.value = searchTerm;
            searchInput.dispatchEvent(new Event('input'));
        }
    }
}
