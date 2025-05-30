/**
 * Data Service
 *
 * This file simulates a backend service by providing data and operations
 * that would normally be handled by API calls to a server.
 */

// Store data in localStorage with these keys
const STORAGE_KEYS = {
    PARTIES: 'aftermarket_parties',
    USER_PREFERENCES: 'aftermarket_user_preferences',
    USER_PROFILE: 'aftermarket_user_profile',
    INVOICES: 'aftermarket_invoices',
    PAYMENTS: 'aftermarket_payments',
    DOCUMENTS: 'aftermarket_documents',
    NOTIFICATIONS: 'aftermarket_notifications',
    MESSAGES: 'aftermarket_messages',
    LANGUAGE: 'aftermarket_language',
    // Customer 360 View data
    CUSTOMER_EQUIPMENT: 'aftermarket_customer_equipment',
    WARRANTY_RECORDS: 'aftermarket_warranty_records',
    SERVICE_HISTORY: 'aftermarket_service_history',
    COMMUNICATION_LOGS: 'aftermarket_communication_logs',
    CONTACT_MANAGEMENT: 'aftermarket_contact_management',
    COMPLIANCE_DATA: 'aftermarket_compliance_data',
    CUSTOMER_PREFERENCES: 'aftermarket_customer_preferences'
};

// Default user profile
const DEFAULT_USER_PROFILE = {
    id: 'user1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, Apt 4B',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'United States',
    role: 'Administrator',
    company: {
        name: 'Acme Corporation',
        position: 'IT Manager',
        department: 'Information Technology',
        address: '456 Business Ave',
        city: 'New York',
        state: 'NY',
        zip: '10002',
        country: 'United States',
        phone: '+1 (555) 987-6543',
        website: 'www.acmecorp.com'
    },
    preferences: {
        language: 'en',
        theme: 'light',
        notifications: {
            email: true,
            sms: false,
            app: true
        },
        dashboardLayout: [
            'recent_activity',
            'quick_actions',
            'statistics',
            'announcements'
        ]
    },
    security: {
        twoFactorEnabled: false,
        lastPasswordChange: '2023-01-15',
        lastLogin: '2023-07-10T14:30:00'
    }
};

// Default party data
const DEFAULT_PARTIES = [
    {
        id: 'P001',
        partyType: 'Customer',
        name: 'Acme Corporation',
        accountNumber: 'ACC-789456',
        contactPerson: 'John Smith',
        email: 'john@acme.com',
        phone: '555-1234',
        mobile: '555-1235',
        address: '123 Main St, Suite 100, New York, NY 10001',
        city: 'New York',
        country: 'USA',
        isActive: true,
        company: 'TechCorp',
        branch: 'East Branch',
        region: 'Northeast',
        tenantId: 'tenant1',
        entityId: 'entity1',
        createdAt: '2023-01-10T10:30:00',
        updatedAt: '2023-06-15T14:45:00'
    },
    {
        id: 'P002',
        partyType: 'Vendor',
        name: 'Global Supplies Inc',
        accountNumber: 'ACCT-4521-7890',
        contactPerson: 'Jane Doe',
        email: 'jane@globalsupplies.com',
        phone: '555-5678',
        mobile: '555-5679',
        address: '456 Oak Ave, Floor 3, Chicago, IL 60601',
        city: 'Chicago',
        country: 'USA',
        isActive: true,
        company: 'TechCorp',
        branch: 'Midwest Branch',
        region: 'Central',
        tenantId: 'tenant1',
        entityId: 'entity1',
        createdAt: '2023-02-05T09:15:00',
        updatedAt: '2023-06-20T11:30:00'
    },
    {
        id: 'P003',
        partyType: 'Manufacturer',
        name: 'Tech Manufacturing Ltd',
        accountNumber: 'A-85647321',
        contactPerson: 'Robert Johnson',
        email: 'robert@techmanufacturing.com',
        phone: '555-9012',
        mobile: '555-9013',
        address: '789 Pine Rd, Building B, Los Angeles, CA 90210',
        city: 'Los Angeles',
        country: 'USA',
        isActive: true,
        company: 'GlobalTech',
        branch: 'West Branch',
        region: 'West',
        tenantId: 'tenant2',
        entityId: 'entity6',
        createdAt: '2023-01-20T13:45:00',
        updatedAt: '2023-07-01T16:20:00'
    },
    {
        id: 'P004',
        partyType: 'Transporter',
        name: 'Fast Logistics',
        accountNumber: '3698521470',
        contactPerson: 'Sarah Williams',
        email: 'sarah@fastlogistics.com',
        phone: '555-3456',
        mobile: '555-3457',
        address: '321 Elm Blvd, Warehouse 5, Miami, FL 33101',
        city: 'Miami',
        country: 'USA',
        isActive: false,
        company: 'TechCorp',
        branch: 'East Branch',
        region: 'Southeast',
        tenantId: 'tenant1',
        entityId: 'entity1',
        createdAt: '2023-03-15T10:00:00',
        updatedAt: '2023-06-28T09:10:00'
    },
    {
        id: 'P005',
        partyType: 'Insurance',
        name: 'Secure Insurance Co',
        accountNumber: 'AC-147-258-369',
        contactPerson: 'Michael Brown',
        email: 'michael@secureinsurance.com',
        phone: '555-7890',
        mobile: '555-7891',
        address: '654 Birch Ln, Tower A, Boston, MA 02101',
        city: 'Boston',
        country: 'USA',
        isActive: true,
        company: 'TechCorp',
        branch: 'East Branch',
        region: 'Northeast',
        tenantId: 'tenant1',
        entityId: 'entity1',
        createdAt: '2023-02-10T14:30:00',
        updatedAt: '2023-07-05T11:45:00'
    },
    {
        id: 'P006',
        partyType: 'Customer',
        name: 'Beta Industries',
        accountNumber: 'ACNT-9876543',
        contactPerson: 'Emily Davis',
        email: 'emily@betaindustries.com',
        phone: '555-2345',
        mobile: '555-2346',
        address: '987 Cedar St, Office 200, Dallas, TX 75201',
        city: 'Dallas',
        country: 'USA',
        isActive: true,
        company: 'GlobalTech',
        branch: 'South Branch',
        region: 'South',
        tenantId: 'tenant2',
        entityId: 'entity6',
        createdAt: '2023-01-25T11:20:00',
        updatedAt: '2023-06-10T15:30:00'
    },
    {
        id: 'P007',
        partyType: 'Prospect',
        name: 'Future Client LLC',
        accountNumber: '741-852-9630',
        contactPerson: 'David Wilson',
        email: 'david@futureclient.com',
        phone: '555-6789',
        mobile: '555-6790',
        address: '753 Maple Ave, Unit 15, Seattle, WA 98101',
        city: 'Seattle',
        country: 'USA',
        isActive: true,
        company: 'GlobalTech',
        branch: 'West Branch',
        region: 'Northwest',
        tenantId: 'tenant2',
        entityId: 'entity6',
        createdAt: '2023-04-05T09:45:00',
        updatedAt: '2023-07-02T10:15:00'
    },
    {
        id: 'P008',
        partyType: 'Contractor',
        name: 'Build Right Construction',
        accountNumber: 'PA-654321',
        contactPerson: 'Thomas Anderson',
        email: 'thomas@buildright.com',
        phone: '555-0123',
        mobile: '555-0124',
        address: '159 Walnut Rd, Shop 7, Denver, CO 80202',
        city: 'Denver',
        country: 'USA',
        isActive: false,
        company: 'TechCorp',
        branch: 'Midwest Branch',
        region: 'Central',
        tenantId: 'tenant1',
        entityId: 'entity1',
        createdAt: '2023-03-20T13:10:00',
        updatedAt: '2023-06-25T14:40:00'
    }
];

// Default notifications
const DEFAULT_NOTIFICATIONS = [
    {
        id: 'n1',
        type: 'info',
        title: 'System Update',
        message: 'The system will be updated on July 15, 2023 from 2:00 AM to 4:00 AM UTC.',
        date: '2023-07-10T09:30:00',
        read: false
    },
    {
        id: 'n2',
        type: 'success',
        title: 'Payment Received',
        message: 'Payment of $1,250.00 has been received from Acme Corporation.',
        date: '2023-07-09T14:45:00',
        read: false
    },
    {
        id: 'n3',
        type: 'warning',
        title: 'Invoice Due',
        message: 'Invoice #INV-2023-056 for $3,500.00 is due in 3 days.',
        date: '2023-07-08T11:20:00',
        read: true
    },
    {
        id: 'n4',
        type: 'error',
        title: 'Failed Login Attempt',
        message: 'There was a failed login attempt to your account from an unknown device.',
        date: '2023-07-07T16:15:00',
        read: true
    },
    {
        id: 'n5',
        type: 'info',
        title: 'New Feature Available',
        message: 'Check out the new advanced search feature in the Party Grid.',
        date: '2023-07-06T10:00:00',
        read: true
    }
];

// Default messages
const DEFAULT_MESSAGES = [
    {
        id: 'm1',
        sender: {
            id: 'support1',
            name: 'Support Team',
            avatar: null
        },
        subject: 'Welcome to the Portal',
        message: 'Welcome to the Aftermarket Software Portal! We\'re here to help you get started. Let us know if you have any questions.',
        date: '2023-07-10T09:00:00',
        read: false
    },
    {
        id: 'm2',
        sender: {
            id: 'system',
            name: 'System Notification',
            avatar: null
        },
        subject: 'Account Security',
        message: 'We recommend enabling two-factor authentication for enhanced account security. You can do this in your profile settings.',
        date: '2023-07-09T15:30:00',
        read: false
    },
    {
        id: 'm3',
        sender: {
            id: 'billing',
            name: 'Billing Department',
            avatar: null
        },
        subject: 'Invoice Generated',
        message: 'Your monthly invoice has been generated. You can view and download it from the Invoices section.',
        date: '2023-07-08T11:45:00',
        read: true
    }
];

// Default invoices
const DEFAULT_INVOICES = [
    {
        id: 'INV-2023-001',
        customer: 'Acme Corporation',
        amount: 1250.00,
        status: 'Paid',
        issueDate: '2023-06-01',
        dueDate: '2023-06-15',
        paidDate: '2023-06-10'
    },
    {
        id: 'INV-2023-002',
        customer: 'Beta Industries',
        amount: 3500.00,
        status: 'Pending',
        issueDate: '2023-06-15',
        dueDate: '2023-06-30',
        paidDate: null
    },
    {
        id: 'INV-2023-003',
        customer: 'Global Supplies Inc',
        amount: 750.00,
        status: 'Overdue',
        issueDate: '2023-06-01',
        dueDate: '2023-06-15',
        paidDate: null
    }
];

// Default payments
const DEFAULT_PAYMENTS = [
    {
        id: 'PAY-2023-001',
        invoiceId: 'INV-2023-001',
        customer: 'Acme Corporation',
        amount: 1250.00,
        method: 'Credit Card',
        date: '2023-06-10',
        status: 'Completed'
    },
    {
        id: 'PAY-2023-002',
        invoiceId: 'INV-2023-002',
        customer: 'Beta Industries',
        amount: 1000.00,
        method: 'Bank Transfer',
        date: '2023-06-20',
        status: 'Completed'
    }
];

// Default documents
const DEFAULT_DOCUMENTS = [
    {
        id: 'DOC-2023-001',
        name: 'User Manual.pdf',
        type: 'PDF',
        size: '2.5 MB',
        uploadDate: '2023-05-15',
        category: 'Manual'
    },
    {
        id: 'DOC-2023-002',
        name: 'Invoice Template.xlsx',
        type: 'Excel',
        size: '1.2 MB',
        uploadDate: '2023-06-01',
        category: 'Template'
    },
    {
        id: 'DOC-2023-003',
        name: 'Contract Agreement.docx',
        type: 'Word',
        size: '3.1 MB',
        uploadDate: '2023-06-10',
        category: 'Legal'
    }
];

// Default customer equipment data
const DEFAULT_CUSTOMER_EQUIPMENT = [
    {
        id: 'EQ-001',
        customerId: 'P001',
        equipmentType: 'Excavator',
        manufacturer: 'Komatsu',
        model: 'PC200-8',
        serialNumber: 'KMT-EX-2023-001',
        purchaseDate: '2023-01-15',
        warrantyStartDate: '2023-01-15',
        warrantyEndDate: '2024-01-15',
        status: 'Active',
        location: 'New York Construction Site',
        operatingHours: 1250,
        lastServiceDate: '2023-11-15',
        nextServiceDue: '2024-02-15'
    },
    {
        id: 'EQ-002',
        customerId: 'P006',
        equipmentType: 'Bulldozer',
        manufacturer: 'Caterpillar',
        model: 'D6T',
        serialNumber: 'CAT-BD-2022-045',
        purchaseDate: '2022-08-20',
        warrantyStartDate: '2022-08-20',
        warrantyEndDate: '2023-08-20',
        status: 'Active',
        location: 'Dallas Industrial Park',
        operatingHours: 2100,
        lastServiceDate: '2023-10-30',
        nextServiceDue: '2024-01-30'
    }
];

// Default warranty records
const DEFAULT_WARRANTY_RECORDS = [
    {
        id: 'WR-001',
        equipmentId: 'EQ-001',
        customerId: 'P001',
        warrantyType: 'Manufacturer',
        startDate: '2023-01-15',
        endDate: '2024-01-15',
        coverage: 'Full Coverage',
        terms: 'Parts and Labor included',
        status: 'Active',
        claimsCount: 0,
        lastClaimDate: null
    },
    {
        id: 'WR-002',
        equipmentId: 'EQ-002',
        customerId: 'P006',
        warrantyType: 'Extended',
        startDate: '2023-08-20',
        endDate: '2025-08-20',
        coverage: 'Parts Only',
        terms: 'Labor charges apply',
        status: 'Active',
        claimsCount: 1,
        lastClaimDate: '2023-09-15'
    }
];

// Default service history
const DEFAULT_SERVICE_HISTORY = [
    {
        id: 'SH-001',
        equipmentId: 'EQ-001',
        customerId: 'P001',
        serviceDate: '2023-11-15',
        serviceType: 'Preventive Maintenance',
        technician: 'John Service Tech',
        description: 'Oil change, filter replacement, general inspection',
        partsUsed: ['Oil Filter OF-123', 'Engine Oil EO-456'],
        laborHours: 3.5,
        cost: 450.00,
        status: 'Completed',
        nextServiceDue: '2024-02-15',
        priority: 'Normal',
        location: 'Customer Site',
        workOrderNumber: 'WO-2023-1115'
    },
    {
        id: 'SH-002',
        equipmentId: 'EQ-002',
        customerId: 'P006',
        serviceDate: '2023-10-30',
        serviceType: 'Repair',
        technician: 'Mike Repair Specialist',
        description: 'Hydraulic pump replacement',
        partsUsed: ['Hydraulic Pump HP-789'],
        laborHours: 8.0,
        cost: 2100.00,
        status: 'Completed',
        nextServiceDue: '2024-01-30',
        priority: 'High',
        location: 'Service Center',
        workOrderNumber: 'WO-2023-1030'
    },
    {
        id: 'SH-003',
        equipmentId: 'EQ-001',
        customerId: 'P001',
        serviceDate: '2023-12-20',
        serviceType: 'Inspection',
        technician: 'Sarah Quality Inspector',
        description: 'Annual safety inspection and certification',
        partsUsed: [],
        laborHours: 2.0,
        cost: 200.00,
        status: 'Completed',
        nextServiceDue: '2024-12-20',
        priority: 'Normal',
        location: 'Customer Site',
        workOrderNumber: 'WO-2023-1220'
    },
    {
        id: 'SH-004',
        equipmentId: 'EQ-003',
        customerId: 'P002',
        serviceDate: '2024-01-10',
        serviceType: 'Emergency',
        technician: 'Tom Emergency Tech',
        description: 'Engine failure - complete engine rebuild',
        partsUsed: ['Engine Block EB-456', 'Piston Set PS-789', 'Gasket Kit GK-123'],
        laborHours: 24.0,
        cost: 8500.00,
        status: 'In Progress',
        nextServiceDue: '2024-07-10',
        priority: 'Critical',
        location: 'Service Center',
        workOrderNumber: 'WO-2024-0110'
    },
    {
        id: 'SH-005',
        equipmentId: 'EQ-004',
        customerId: 'P003',
        serviceDate: '2024-01-25',
        serviceType: 'Preventive Maintenance',
        technician: 'Lisa Maintenance Tech',
        description: 'Scheduled 500-hour maintenance service',
        partsUsed: ['Air Filter AF-321', 'Fuel Filter FF-654'],
        laborHours: 4.0,
        cost: 350.00,
        status: 'Scheduled',
        nextServiceDue: '2024-04-25',
        priority: 'Normal',
        location: 'Customer Site',
        workOrderNumber: 'WO-2024-0125'
    },
    {
        id: 'SH-006',
        equipmentId: 'EQ-005',
        customerId: 'P004',
        serviceDate: '2023-09-15',
        serviceType: 'Repair',
        technician: 'David Hydraulic Specialist',
        description: 'Hydraulic cylinder seal replacement',
        partsUsed: ['Hydraulic Seal Kit HSK-987'],
        laborHours: 6.0,
        cost: 750.00,
        status: 'Completed',
        nextServiceDue: '2024-03-15',
        priority: 'Normal',
        location: 'Customer Site',
        workOrderNumber: 'WO-2023-0915'
    },
    {
        id: 'SH-007',
        equipmentId: 'EQ-006',
        customerId: 'P005',
        serviceDate: '2024-02-05',
        serviceType: 'Preventive Maintenance',
        technician: 'Jennifer PM Specialist',
        description: 'Quarterly preventive maintenance check',
        partsUsed: ['Grease Pack GP-111', 'Belt Set BS-222'],
        laborHours: 3.0,
        cost: 275.00,
        status: 'Scheduled',
        nextServiceDue: '2024-05-05',
        priority: 'Normal',
        location: 'Customer Site',
        workOrderNumber: 'WO-2024-0205'
    },
    {
        id: 'SH-008',
        equipmentId: 'EQ-007',
        customerId: 'P007',
        serviceDate: '2023-08-20',
        serviceType: 'Inspection',
        technician: 'Robert Safety Inspector',
        description: 'Safety compliance inspection',
        partsUsed: [],
        laborHours: 1.5,
        cost: 150.00,
        status: 'Completed',
        nextServiceDue: '2024-08-20',
        priority: 'Normal',
        location: 'Customer Site',
        workOrderNumber: 'WO-2023-0820'
    }
];

// Default communication logs
const DEFAULT_COMMUNICATION_LOGS = [
    {
        id: 'CL-001',
        customerId: 'P001',
        type: 'Phone Call',
        direction: 'Inbound',
        subject: 'Service Inquiry',
        description: 'Customer called about upcoming maintenance schedule',
        contactPerson: 'John Smith',
        timestamp: '2023-12-01T10:30:00Z',
        duration: '15 minutes',
        outcome: 'Scheduled maintenance appointment',
        followUpRequired: false
    },
    {
        id: 'CL-002',
        customerId: 'P006',
        type: 'Email',
        direction: 'Outbound',
        subject: 'Warranty Claim Update',
        description: 'Sent warranty claim approval notification',
        contactPerson: 'Emily Davis',
        timestamp: '2023-11-28T14:15:00Z',
        duration: null,
        outcome: 'Customer acknowledged receipt',
        followUpRequired: false
    },
    {
        id: 'CL-003',
        customerId: 'P001',
        type: 'WhatsApp',
        direction: 'Inbound',
        subject: 'Parts Availability',
        description: 'Customer inquired about spare parts availability',
        contactPerson: 'John Smith',
        timestamp: '2023-12-02T16:45:00Z',
        duration: null,
        outcome: 'Provided parts catalog link',
        followUpRequired: true
    }
];

// Default contact management data
const DEFAULT_CONTACT_MANAGEMENT = [
    {
        id: 'CM-001',
        customerId: 'P001',
        contactType: 'Primary',
        name: 'John Smith',
        title: 'Operations Manager',
        email: 'john@acme.com',
        phone: '555-1234',
        mobile: '555-1235',
        role: 'Decision Maker',
        department: 'Operations',
        preferredContact: 'Email',
        isActive: true
    },
    {
        id: 'CM-002',
        customerId: 'P001',
        contactType: 'Technical',
        name: 'Mike Johnson',
        title: 'Maintenance Supervisor',
        email: 'mike@acme.com',
        phone: '555-1236',
        mobile: '555-1237',
        role: 'Technical Contact',
        department: 'Maintenance',
        preferredContact: 'Phone',
        isActive: true
    },
    {
        id: 'CM-003',
        customerId: 'P006',
        contactType: 'Primary',
        name: 'Emily Davis',
        title: 'Procurement Manager',
        email: 'emily@betaindustries.com',
        phone: '555-2345',
        mobile: '555-2346',
        role: 'Purchaser',
        department: 'Procurement',
        preferredContact: 'Email',
        isActive: true
    }
];

// Initialize data in localStorage if it doesn't exist
function initializeData() {
    // Initialize parties
    if (!localStorage.getItem(STORAGE_KEYS.PARTIES)) {
        localStorage.setItem(STORAGE_KEYS.PARTIES, JSON.stringify(DEFAULT_PARTIES));
    }

    // Initialize user profile
    if (!localStorage.getItem(STORAGE_KEYS.USER_PROFILE)) {
        localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(DEFAULT_USER_PROFILE));
    }

    // Initialize notifications
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(DEFAULT_NOTIFICATIONS));
    }

    // Initialize messages
    if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
        localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(DEFAULT_MESSAGES));
    }

    // Initialize invoices
    if (!localStorage.getItem(STORAGE_KEYS.INVOICES)) {
        localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(DEFAULT_INVOICES));
    }

    // Initialize payments
    if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
        localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(DEFAULT_PAYMENTS));
    }

    // Initialize documents
    if (!localStorage.getItem(STORAGE_KEYS.DOCUMENTS)) {
        localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(DEFAULT_DOCUMENTS));
    }

    // Initialize Customer 360 View data
    if (!localStorage.getItem(STORAGE_KEYS.CUSTOMER_EQUIPMENT)) {
        localStorage.setItem(STORAGE_KEYS.CUSTOMER_EQUIPMENT, JSON.stringify(DEFAULT_CUSTOMER_EQUIPMENT));
    }

    if (!localStorage.getItem(STORAGE_KEYS.WARRANTY_RECORDS)) {
        localStorage.setItem(STORAGE_KEYS.WARRANTY_RECORDS, JSON.stringify(DEFAULT_WARRANTY_RECORDS));
    }

    if (!localStorage.getItem(STORAGE_KEYS.SERVICE_HISTORY)) {
        localStorage.setItem(STORAGE_KEYS.SERVICE_HISTORY, JSON.stringify(DEFAULT_SERVICE_HISTORY));
    }

    if (!localStorage.getItem(STORAGE_KEYS.COMMUNICATION_LOGS)) {
        localStorage.setItem(STORAGE_KEYS.COMMUNICATION_LOGS, JSON.stringify(DEFAULT_COMMUNICATION_LOGS));
    }

    if (!localStorage.getItem(STORAGE_KEYS.CONTACT_MANAGEMENT)) {
        localStorage.setItem(STORAGE_KEYS.CONTACT_MANAGEMENT, JSON.stringify(DEFAULT_CONTACT_MANAGEMENT));
    }

    if (!localStorage.getItem(STORAGE_KEYS.COMPLIANCE_DATA)) {
        localStorage.setItem(STORAGE_KEYS.COMPLIANCE_DATA, JSON.stringify({}));
    }

    if (!localStorage.getItem(STORAGE_KEYS.CUSTOMER_PREFERENCES)) {
        localStorage.setItem(STORAGE_KEYS.CUSTOMER_PREFERENCES, JSON.stringify({}));
    }

    // Initialize language preference
    if (!localStorage.getItem(STORAGE_KEYS.LANGUAGE)) {
        localStorage.setItem(STORAGE_KEYS.LANGUAGE, 'en');
    }
}

// Data service object with methods for data operations
const DataService = {
    // Initialize all data
    initialize: function() {
        initializeData();
    },

    // Party methods
    getParties: function() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.PARTIES)) || [];
    },

    getPartyById: function(id) {
        const parties = this.getParties();
        return parties.find(party => party.id === id) || null;
    },

    saveParty: function(party) {
        const parties = this.getParties();
        const index = parties.findIndex(p => p.id === party.id);

        if (index !== -1) {
            // Update existing party
            parties[index] = { ...parties[index], ...party, updatedAt: new Date().toISOString() };
        } else {
            // Add new party
            const newParty = {
                ...party,
                id: party.id || `P${String(parties.length + 1).padStart(3, '0')}`,
                accountNumber: party.accountNumber || this.generateAccountNumber(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            parties.push(newParty);
        }

        localStorage.setItem(STORAGE_KEYS.PARTIES, JSON.stringify(parties));
        return index !== -1 ? parties[index] : parties[parties.length - 1];
    },

    // Generate random account number
    generateAccountNumber: function() {
        const formats = [
            // Format: ACC-XXXXXX (6 digits)
            () => `ACC-${String(Math.floor(Math.random() * 900000) + 100000)}`,

            // Format: ACCT-XXXX-XXXX (4-4 digits)
            () => `ACCT-${String(Math.floor(Math.random() * 9000) + 1000)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,

            // Format: A-XXXXXXXX (8 digits)
            () => `A-${String(Math.floor(Math.random() * 90000000) + 10000000)}`,

            // Format: XXXXXXXXXX (10 digits)
            () => String(Math.floor(Math.random() * 9000000000) + 1000000000),

            // Format: AC-XXX-XXX-XXX (3-3-3 digits)
            () => `AC-${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 900) + 100)}`,

            // Format: ACNT-XXXXXXX (7 digits)
            () => `ACNT-${String(Math.floor(Math.random() * 9000000) + 1000000)}`,

            // Format: XXX-XXX-XXXX (3-3-4 digits)
            () => `${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,

            // Format: PA-XXXXXX (Party Account - 6 digits)
            () => `PA-${String(Math.floor(Math.random() * 900000) + 100000)}`
        ];

        // Randomly select one of the formats
        const selectedFormat = formats[Math.floor(Math.random() * formats.length)];
        return selectedFormat();
    },

    saveParties: function(parties) {
        localStorage.setItem(STORAGE_KEYS.PARTIES, JSON.stringify(parties));
        return parties;
    },

    deleteParty: function(id) {
        const parties = this.getParties();
        const filteredParties = parties.filter(party => party.id !== id);
        localStorage.setItem(STORAGE_KEYS.PARTIES, JSON.stringify(filteredParties));
        return filteredParties.length < parties.length;
    },

    // User profile methods
    getUserProfile: function() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_PROFILE)) || DEFAULT_USER_PROFILE;
    },

    saveUserProfile: function(profile) {
        const currentProfile = this.getUserProfile();
        const updatedProfile = { ...currentProfile, ...profile };
        localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updatedProfile));
        return updatedProfile;
    },

    // Notification methods
    getNotifications: function() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) || [];
    },

    getUnreadNotificationsCount: function() {
        const notifications = this.getNotifications();
        return notifications.filter(notification => !notification.read).length;
    },

    markNotificationAsRead: function(id) {
        const notifications = this.getNotifications();
        const updatedNotifications = notifications.map(notification =>
            notification.id === id ? { ...notification, read: true } : notification
        );
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updatedNotifications));
        return updatedNotifications;
    },

    // Message methods
    getMessages: function() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES)) || [];
    },

    getUnreadMessagesCount: function() {
        const messages = this.getMessages();
        return messages.filter(message => !message.read).length;
    },

    markMessageAsRead: function(id) {
        const messages = this.getMessages();
        const updatedMessages = messages.map(message =>
            message.id === id ? { ...message, read: true } : message
        );
        localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(updatedMessages));
        return updatedMessages;
    },

    // Invoice methods
    getInvoices: function() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.INVOICES)) || [];
    },

    // Payment methods
    getPayments: function() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.PAYMENTS)) || [];
    },

    // Document methods
    getDocuments: function() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.DOCUMENTS)) || [];
    },

    // Language preference
    getLanguagePreference: function() {
        return localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'en';
    },

    saveLanguagePreference: function(language) {
        localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
        return language;
    },

    // Customer Equipment methods
    getCustomerEquipment: function(customerId = null) {
        const equipment = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMER_EQUIPMENT)) || [];
        return customerId ? equipment.filter(eq => eq.customerId === customerId) : equipment;
    },

    addCustomerEquipment: function(equipment) {
        const allEquipment = this.getCustomerEquipment();
        equipment.id = equipment.id || 'EQ-' + (allEquipment.length + 1).toString().padStart(3, '0');
        allEquipment.push(equipment);
        localStorage.setItem(STORAGE_KEYS.CUSTOMER_EQUIPMENT, JSON.stringify(allEquipment));
        return equipment;
    },

    updateCustomerEquipment: function(equipmentId, updates) {
        const allEquipment = this.getCustomerEquipment();
        const index = allEquipment.findIndex(eq => eq.id === equipmentId);
        if (index !== -1) {
            allEquipment[index] = { ...allEquipment[index], ...updates };
            localStorage.setItem(STORAGE_KEYS.CUSTOMER_EQUIPMENT, JSON.stringify(allEquipment));
            return allEquipment[index];
        }
        return null;
    },

    // Warranty Records methods
    getWarrantyRecords: function(customerId = null, equipmentId = null) {
        const warranties = JSON.parse(localStorage.getItem(STORAGE_KEYS.WARRANTY_RECORDS)) || [];
        let filtered = warranties;
        if (customerId) filtered = filtered.filter(w => w.customerId === customerId);
        if (equipmentId) filtered = filtered.filter(w => w.equipmentId === equipmentId);
        return filtered;
    },

    addWarrantyRecord: function(warranty) {
        const allWarranties = this.getWarrantyRecords();
        warranty.id = warranty.id || 'WR-' + (allWarranties.length + 1).toString().padStart(3, '0');
        allWarranties.push(warranty);
        localStorage.setItem(STORAGE_KEYS.WARRANTY_RECORDS, JSON.stringify(allWarranties));
        return warranty;
    },

    validateWarranty: function(equipmentId, serviceDate = new Date()) {
        const warranties = this.getWarrantyRecords(null, equipmentId);
        const activeWarranties = warranties.filter(w => {
            const startDate = new Date(w.startDate);
            const endDate = new Date(w.endDate);
            const checkDate = new Date(serviceDate);
            return checkDate >= startDate && checkDate <= endDate && w.status === 'Active';
        });
        return activeWarranties.length > 0 ? activeWarranties[0] : null;
    },

    // Service History methods
    getServiceHistory: function(customerId = null, equipmentId = null) {
        const services = JSON.parse(localStorage.getItem(STORAGE_KEYS.SERVICE_HISTORY)) || [];
        let filtered = services;
        if (customerId) filtered = filtered.filter(s => s.customerId === customerId);
        if (equipmentId) filtered = filtered.filter(s => s.equipmentId === equipmentId);
        return filtered.sort((a, b) => new Date(b.serviceDate) - new Date(a.serviceDate));
    },

    addServiceRecord: function(service) {
        const allServices = this.getServiceHistory();
        service.id = service.id || 'SH-' + (allServices.length + 1).toString().padStart(3, '0');
        service.createdDate = service.createdDate || new Date().toISOString();
        service.updatedDate = new Date().toISOString();
        allServices.push(service);
        localStorage.setItem(STORAGE_KEYS.SERVICE_HISTORY, JSON.stringify(allServices));
        return service;
    },

    updateServiceRecord: function(serviceId, updates) {
        const allServices = this.getServiceHistory();
        const index = allServices.findIndex(s => s.id === serviceId);
        if (index !== -1) {
            allServices[index] = { ...allServices[index], ...updates, updatedDate: new Date().toISOString() };
            localStorage.setItem(STORAGE_KEYS.SERVICE_HISTORY, JSON.stringify(allServices));
            return allServices[index];
        }
        return null;
    },

    deleteServiceRecord: function(serviceId) {
        const allServices = this.getServiceHistory();
        const filteredServices = allServices.filter(s => s.id !== serviceId);
        localStorage.setItem(STORAGE_KEYS.SERVICE_HISTORY, JSON.stringify(filteredServices));
        return filteredServices.length < allServices.length;
    },

    getServiceRecordById: function(serviceId) {
        const allServices = this.getServiceHistory();
        return allServices.find(s => s.id === serviceId) || null;
    },

    getServicesByTechnician: function(technician) {
        const allServices = this.getServiceHistory();
        return allServices.filter(s => s.technician.toLowerCase().includes(technician.toLowerCase()));
    },

    getServicesByDateRange: function(startDate, endDate) {
        const allServices = this.getServiceHistory();
        return allServices.filter(s => {
            const serviceDate = new Date(s.serviceDate);
            return serviceDate >= new Date(startDate) && serviceDate <= new Date(endDate);
        });
    },

    getServiceStatistics: function() {
        const allServices = this.getServiceHistory();
        return {
            total: allServices.length,
            completed: allServices.filter(s => s.status === 'Completed').length,
            inProgress: allServices.filter(s => s.status === 'In Progress').length,
            scheduled: allServices.filter(s => s.status === 'Scheduled').length,
            cancelled: allServices.filter(s => s.status === 'Cancelled').length,
            totalCost: allServices.reduce((sum, s) => sum + (s.cost || 0), 0),
            totalHours: allServices.reduce((sum, s) => sum + (s.laborHours || 0), 0),
            averageCost: allServices.length > 0 ? allServices.reduce((sum, s) => sum + (s.cost || 0), 0) / allServices.length : 0,
            averageHours: allServices.length > 0 ? allServices.reduce((sum, s) => sum + (s.laborHours || 0), 0) / allServices.length : 0
        };
    },

    // Communication Logs methods
    getCommunicationLogs: function(customerId = null) {
        const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMUNICATION_LOGS)) || [];
        const filtered = customerId ? logs.filter(log => log.customerId === customerId) : logs;
        return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    },

    addCommunicationLog: function(log) {
        const allLogs = this.getCommunicationLogs();
        log.id = log.id || 'CL-' + (allLogs.length + 1).toString().padStart(3, '0');
        log.timestamp = log.timestamp || new Date().toISOString();
        allLogs.push(log);
        localStorage.setItem(STORAGE_KEYS.COMMUNICATION_LOGS, JSON.stringify(allLogs));
        return log;
    },

    // Contact Management methods
    getCustomerContacts: function(customerId) {
        const contacts = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTACT_MANAGEMENT)) || [];
        return contacts.filter(contact => contact.customerId === customerId && contact.isActive);
    },

    addCustomerContact: function(contact) {
        const allContacts = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTACT_MANAGEMENT)) || [];
        contact.id = contact.id || 'CM-' + (allContacts.length + 1).toString().padStart(3, '0');
        contact.isActive = contact.isActive !== undefined ? contact.isActive : true;
        allContacts.push(contact);
        localStorage.setItem(STORAGE_KEYS.CONTACT_MANAGEMENT, JSON.stringify(allContacts));
        return contact;
    },

    updateCustomerContact: function(contactId, updates) {
        const allContacts = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTACT_MANAGEMENT)) || [];
        const index = allContacts.findIndex(contact => contact.id === contactId);
        if (index !== -1) {
            allContacts[index] = { ...allContacts[index], ...updates };
            localStorage.setItem(STORAGE_KEYS.CONTACT_MANAGEMENT, JSON.stringify(allContacts));
            return allContacts[index];
        }
        return null;
    },

    // Customer 360 View - Unified data retrieval
    getCustomer360View: function(customerId) {
        const customer = this.getParties().find(p => p.id === customerId);
        if (!customer) return null;

        return {
            customer: customer,
            equipment: this.getCustomerEquipment(customerId),
            warranties: this.getWarrantyRecords(customerId),
            serviceHistory: this.getServiceHistory(customerId),
            communicationLogs: this.getCommunicationLogs(customerId),
            contacts: this.getCustomerContacts(customerId),
            invoices: this.getInvoices().filter(inv => inv.customer === customer.name),
            payments: this.getPayments().filter(pay => pay.customer === customer.name)
        };
    },

    // GDPR/CCPA Compliance methods
    getComplianceData: function(customerId) {
        const complianceData = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMPLIANCE_DATA)) || {};
        return complianceData[customerId] || {
            consentGiven: false,
            consentDate: null,
            dataRetentionExpiry: null,
            privacyPreferences: {},
            dataProcessingLog: []
        };
    },

    updateComplianceData: function(customerId, data) {
        const allComplianceData = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMPLIANCE_DATA)) || {};
        allComplianceData[customerId] = { ...allComplianceData[customerId], ...data };
        localStorage.setItem(STORAGE_KEYS.COMPLIANCE_DATA, JSON.stringify(allComplianceData));
        return allComplianceData[customerId];
    },

    // Data deletion for GDPR compliance
    deleteCustomerData: function(customerId) {
        // Remove from all data stores
        const parties = this.getParties().filter(p => p.id !== customerId);
        localStorage.setItem(STORAGE_KEYS.PARTIES, JSON.stringify(parties));

        const equipment = this.getCustomerEquipment().filter(eq => eq.customerId !== customerId);
        localStorage.setItem(STORAGE_KEYS.CUSTOMER_EQUIPMENT, JSON.stringify(equipment));

        const warranties = this.getWarrantyRecords().filter(w => w.customerId !== customerId);
        localStorage.setItem(STORAGE_KEYS.WARRANTY_RECORDS, JSON.stringify(warranties));

        const services = this.getServiceHistory().filter(s => s.customerId !== customerId);
        localStorage.setItem(STORAGE_KEYS.SERVICE_HISTORY, JSON.stringify(services));

        const logs = this.getCommunicationLogs().filter(log => log.customerId !== customerId);
        localStorage.setItem(STORAGE_KEYS.COMMUNICATION_LOGS, JSON.stringify(logs));

        const contacts = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTACT_MANAGEMENT)) || [];
        const filteredContacts = contacts.filter(contact => contact.customerId !== customerId);
        localStorage.setItem(STORAGE_KEYS.CONTACT_MANAGEMENT, JSON.stringify(filteredContacts));

        // Remove compliance data
        const complianceData = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMPLIANCE_DATA)) || {};
        delete complianceData[customerId];
        localStorage.setItem(STORAGE_KEYS.COMPLIANCE_DATA, JSON.stringify(complianceData));

        return true;
    }
};

// Initialize data when the script loads
DataService.initialize();
