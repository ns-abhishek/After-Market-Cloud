// Sidebar Data - Menu Items for Bookmarking System
// This file contains all menu items extracted from the dashboard dropdowns

window.SidebarData = {
    // All available menu items organized by category
    menuItems: {
        helpdesk: {
            name: 'HELPDESK',
            icon: 'fas fa-headset',
            categories: {
                transaction: {
                    name: 'Transaction',
                    items: [
                        { id: 'ticket', name: 'Ticket', icon: 'fas fa-ticket-alt', href: '#ticket' },
                        { id: 'customer-feedback', name: 'Customer Feedback', icon: 'fas fa-comment-dots', href: '#customer-feedback' },
                        { id: 'knowledge-base', name: 'Knowledge Base', icon: 'fas fa-book', href: '#knowledge-base' },
                        { id: 'ticket-verification-queue', name: 'Ticket Verification Queue', icon: 'fas fa-clipboard-check', href: '#ticket-verification-queue' }
                    ]
                },
                reports: {
                    name: 'Reports',
                    items: [
                        { id: 'ageing-analysis', name: 'Ageing Analysis', icon: 'fas fa-chart-line', href: '#ageing-analysis' },
                        { id: 'customer-feedback-reports', name: 'Customer Feedback Reports', icon: 'fas fa-chart-bar', href: '#customer-feedback-reports' },
                        { id: 'average-resolution-time', name: 'Average Resolution Time', icon: 'fas fa-clock', href: '#average-resolution-time' },
                        { id: 'average-response-time', name: 'Average Response Time', icon: 'fas fa-stopwatch', href: '#average-response-time' },
                        { id: 'call-log', name: 'Call Log', icon: 'fas fa-phone-alt', href: '#call-log' },
                        { id: 'ticket-bi', name: 'Ticket BI', icon: 'fas fa-analytics', href: '#ticket-bi' },
                        { id: 'call-summary', name: 'Call Summary', icon: 'fas fa-file-alt', href: '#call-summary' },
                        { id: 'case-summary', name: 'Case Summary', icon: 'fas fa-folder-open', href: '#case-summary' },
                        { id: 'sla-report', name: 'SLA Report', icon: 'fas fa-handshake', href: '#sla-report' },
                        { id: 'ticket-history', name: 'Ticket History', icon: 'fas fa-history', href: '#ticket-history' }
                    ]
                }
            }
        },
        parts: {
            name: 'PARTS',
            icon: 'fas fa-cogs',
            categories: {
                'annual-order': {
                    name: 'Annual Order-Purchase Contract',
                    items: [
                        { id: 'request-for-quotation', name: 'Request For Quotation', icon: 'fas fa-file-invoice', href: '#request-for-quotation' },
                        { id: 'supplier-quotation', name: 'Supplier Quotation', icon: 'fas fa-file-contract', href: '#supplier-quotation' },
                        { id: 'customer-warranty-claim', name: 'Customer Warranty Claim', icon: 'fas fa-shield-alt', href: '#customer-warranty-claim' }
                    ]
                },
                'stock-receive': {
                    name: 'Stock Receive',
                    items: [
                        { id: 'purchase-order', name: 'Purchase Order', icon: 'fas fa-shopping-cart', href: '#purchase-order' },
                        { id: 'purchase-invoice', name: 'Purchase Invoice', icon: 'fas fa-receipt', href: '#purchase-invoice' },
                        { id: 'purchase-grn', name: 'Purchase GRN', icon: 'fas fa-clipboard-check', href: '#purchase-grn' },
                        { id: 'gdr-settlement', name: 'GDR Settlement', icon: 'fas fa-handshake', href: '#gdr-settlement' }
                    ]
                },
                'order-processing': {
                    name: 'Order Processing',
                    items: [
                        { id: 'stock-transfer-request', name: 'Stock Transfer Request', icon: 'fas fa-exchange-alt', href: '#stock-transfer-request' },
                        { id: 'parts-quotation', name: 'Parts Quotation', icon: 'fas fa-quote-left', href: '#parts-quotation' },
                        { id: 'parts-order', name: 'Parts Order', icon: 'fas fa-clipboard-list', href: '#parts-order' },
                        { id: 'pick-list-confirmation', name: 'Pick List Confirmation', icon: 'fas fa-list-check', href: '#pick-list-confirmation' }
                    ]
                },
                sales: {
                    name: 'Sales',
                    items: [
                        { id: 'counter-sales', name: 'Counter Sales', icon: 'fas fa-cash-register', href: '#counter-sales' },
                        { id: 'sales-invoice', name: 'Sales Invoice', icon: 'fas fa-file-invoice-dollar', href: '#sales-invoice' },
                        { id: 'sales-invoice-return', name: 'Sales Invoice Return', icon: 'fas fa-undo', href: '#sales-invoice-return' }
                    ]
                }
            }
        },
        service: {
            name: 'SERVICE',
            icon: 'fas fa-tools',
            categories: {
                'work-order': {
                    name: 'Work Order Process',
                    items: [
                        { id: 'service-quotation', name: 'Service Quotation', icon: 'fas fa-quote-left', href: '#service-quotation' },
                        { id: 'work-order', name: 'Work Order', icon: 'fas fa-clipboard-list', href: '#work-order' },
                        { id: 'service-invoice', name: 'Service Invoice', icon: 'fas fa-file-invoice', href: '#service-invoice' },
                        { id: 'internal-invoice', name: 'Internal Invoice', icon: 'fas fa-file-invoice-dollar', href: '#internal-invoice' },
                        { id: 'gate-pass', name: 'Gate Pass', icon: 'fas fa-id-card', href: '#gate-pass' }
                    ]
                },
                'claim-process': {
                    name: 'Claim Process',
                    items: [
                        { id: 'mandatory-claim', name: 'Mandatory Claim', icon: 'fas fa-clipboard-check', href: '#mandatory-claim' },
                        { id: 'warranty-claim', name: 'Warranty Claim', icon: 'fas fa-shield-alt', href: '#warranty-claim' },
                        { id: 'warranty-claim-approval', name: 'Warranty Claim Approval', icon: 'fas fa-shield-check', href: '#warranty-claim-approval' }
                    ]
                }
            }
        },
        tams: {
            name: 'TAMS',
            icon: 'fas fa-tachometer-alt',
            categories: {
                transactions: {
                    name: 'Transactions',
                    items: [
                        { id: 'tams-dashboard', name: 'TAMS Dashboard', icon: 'fas fa-tachometer-alt', href: '#tams-dashboard' },
                        { id: 'production-dashboard', name: 'Production Dashboard', icon: 'fas fa-industry', href: '#production-dashboard' },
                        { id: 'manager-dashboard', name: 'Manager Dashboard', icon: 'fas fa-user-tie', href: '#manager-dashboard' }
                    ]
                }
            }
        },
        'bay-scheduler': {
            name: 'BAY SCHEDULER',
            icon: 'fas fa-calendar-week',
            categories: {
                scheduler: {
                    name: 'Bay Scheduler',
                    items: [
                        { id: 'scheduler-dashboard', name: 'Scheduler Dashboard', icon: 'fas fa-tachometer-alt', href: '#scheduler-dashboard' },
                        { id: 'bay-schedule-view', name: 'Bay Schedule View', icon: 'fas fa-calendar-week', href: '#bay-schedule-view' }
                    ]
                }
            }
        },
        core: {
            name: 'CORE',
            icon: 'fas fa-database',
            categories: {
                administration: {
                    name: 'Administration',
                    items: [
                        { id: 'company-calendar', name: 'Company Calendar', icon: 'fas fa-calendar', href: '#company-calendar' },
                        { id: 'role', name: 'Role', icon: 'fas fa-user-tag', href: '#role' },
                        { id: 'roster', name: 'Roster', icon: 'fas fa-users', href: '#roster' }
                    ]
                },
                financial: {
                    name: 'Financial',
                    items: [
                        { id: 'bank', name: 'Bank', icon: 'fas fa-university', href: '#bank' },
                        { id: 'currency', name: 'Currency', icon: 'fas fa-coins', href: '#currency' },
                        { id: 'tax', name: 'Tax', icon: 'fas fa-percentage', href: '#tax' }
                    ]
                }
            }
        },
        dashboard: {
            name: 'DASHBOARD',
            icon: 'fas fa-chart-pie',
            categories: {
                service: {
                    name: 'Service',
                    items: [
                        { id: 'ticket-summary', name: 'Ticket Summary', icon: 'fas fa-ticket-alt', href: '#ticket-summary' },
                        { id: 'quotation-summary', name: 'Quotation Summary', icon: 'fas fa-quote-left', href: '#quotation-summary' },
                        { id: 'work-order-summary', name: 'Work Order Summary', icon: 'fas fa-clipboard-list', href: '#work-order-summary' },
                        { id: 'warranty-summary', name: 'Warranty Summary', icon: 'fas fa-shield-alt', href: '#warranty-summary' }
                    ]
                },
                tams: {
                    name: 'TAMS',
                    items: [
                        { id: 'tams-summary', name: 'TAMS Summary', icon: 'fas fa-chart-pie', href: '#tams-summary' },
                        { id: 'tams-deviation', name: 'TAMS Deviation', icon: 'fas fa-exclamation-triangle', href: '#tams-deviation' }
                    ]
                }
            }
        },
        'kpi-reports': {
            name: 'KPI REPORTS',
            icon: 'fas fa-chart-line',
            categories: {
                kpi: {
                    name: 'KPI',
                    items: [
                        { id: 'ticket-kpi', name: 'Ticket', icon: 'fas fa-ticket-alt', href: '#ticket' },
                        { id: 'quotation-kpi', name: 'Quotation', icon: 'fas fa-quote-left', href: '#quotation' },
                        { id: 'work-order-kpi', name: 'Work Order', icon: 'fas fa-clipboard-list', href: '#work-order' }
                    ]
                }
            }
        },
        more: {
            name: 'MORE',
            icon: 'fas fa-ellipsis-h',
            categories: {
                additional: {
                    name: 'Additional Services',
                    items: [
                        { id: 'contract-management', name: 'Contract Management', icon: 'fas fa-file-contract', href: '#contract-management' },
                        { id: 'digital-catalogue', name: 'Digital Catalogue', icon: 'fas fa-book-open', href: '#digital-catalogue' },
                        { id: 'reman', name: 'Reman', icon: 'fas fa-recycle', href: '#reman' },
                        { id: 'special-tools', name: 'Special Tools', icon: 'fas fa-tools', href: '#special-tools' },
                        { id: 'order-management', name: 'Order Management', icon: 'fas fa-clipboard-list', href: '#order-management' },
                        { id: 'field-service', name: 'Field Service', icon: 'fas fa-user-cog', href: '#field-service' },
                        { id: 'warranty', name: 'Warranty', icon: 'fas fa-shield-alt', href: '#warranty' },
                        { id: 'sales', name: 'Sales', icon: 'fas fa-chart-line', href: '#sales' }
                    ]
                }
            }
        }
    },

    // Default bookmarks for new users
    defaultBookmarks: [
        'ticket',
        'work-order',
        'parts-order',
        'service-quotation',
        'purchase-order',
        'tams-dashboard',
        'ticket-summary',
        'work-order-summary'
    ],

    // Quick access items (commonly used across all users)
    quickAccessItems: [
        'ticket',
        'work-order',
        'service-quotation',
        'parts-quotation',
        'purchase-order',
        'tams-dashboard'
    ]
};
