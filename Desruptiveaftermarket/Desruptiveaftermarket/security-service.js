/**
 * Security Service
 * 
 * This file provides security-related functionality including:
 * - Authentication
 * - Authorization (Role-Based Access Control)
 * - Multi-Factor Authentication
 * - Data Encryption
 * - Compliance Features
 * - Security Audit Logging
 */

// Storage keys for security-related data
const SECURITY_STORAGE_KEYS = {
    CURRENT_USER: 'aftermarket_current_user',
    USERS: 'aftermarket_users',
    ROLES: 'aftermarket_roles',
    PERMISSIONS: 'aftermarket_permissions',
    AUDIT_LOGS: 'aftermarket_audit_logs',
    MFA_SETTINGS: 'aftermarket_mfa_settings',
    ENCRYPTION_KEYS: 'aftermarket_encryption_keys',
    SESSION_TOKEN: 'aftermarket_session_token',
    COMPLIANCE_SETTINGS: 'aftermarket_compliance_settings'
};

// Default roles and permissions
const DEFAULT_ROLES = {
    ADMIN: 'admin',
    MANAGER: 'manager',
    USER: 'user',
    GUEST: 'guest'
};

// Default permissions for each role
const DEFAULT_PERMISSIONS = {
    [DEFAULT_ROLES.ADMIN]: {
        canViewAllData: true,
        canEditAllData: true,
        canDeleteData: true,
        canManageUsers: true,
        canManageRoles: true,
        canAccessAuditLogs: true,
        canAccessSecuritySettings: true,
        canExportData: true,
        canImportData: true,
        canManageComplianceSettings: true
    },
    [DEFAULT_ROLES.MANAGER]: {
        canViewAllData: true,
        canEditAllData: false,
        canDeleteData: false,
        canManageUsers: false,
        canManageRoles: false,
        canAccessAuditLogs: true,
        canAccessSecuritySettings: false,
        canExportData: true,
        canImportData: true,
        canManageComplianceSettings: false
    },
    [DEFAULT_ROLES.USER]: {
        canViewAllData: false,
        canEditAllData: false,
        canDeleteData: false,
        canManageUsers: false,
        canManageRoles: false,
        canAccessAuditLogs: false,
        canAccessSecuritySettings: false,
        canExportData: false,
        canImportData: false,
        canManageComplianceSettings: false
    },
    [DEFAULT_ROLES.GUEST]: {
        canViewAllData: false,
        canEditAllData: false,
        canDeleteData: false,
        canManageUsers: false,
        canManageRoles: false,
        canAccessAuditLogs: false,
        canAccessSecuritySettings: false,
        canExportData: false,
        canImportData: false,
        canManageComplianceSettings: false
    }
};

// Default users
const DEFAULT_USERS = [
    {
        id: 'user1',
        username: 'admin',
        passwordHash: 'hashed_password_123', // In a real app, this would be properly hashed
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        role: DEFAULT_ROLES.ADMIN,
        isActive: true,
        mfaEnabled: true,
        mfaMethod: 'app', // 'app', 'sms', 'email'
        mfaSecret: 'ABCDEFGHIJKLMNOP', // In a real app, this would be securely stored
        lastLogin: '2023-07-10T14:30:00',
        failedLoginAttempts: 0,
        accountLocked: false,
        passwordLastChanged: '2023-01-15',
        passwordExpiryDays: 90,
        consentGiven: true,
        consentTimestamp: '2023-01-01T10:00:00',
        dataRetentionPeriod: 365, // days
        accessRestrictions: {
            ipWhitelist: ['192.168.1.1'],
            timeRestrictions: {
                enabled: false,
                startTime: '09:00',
                endTime: '17:00',
                workDays: [1, 2, 3, 4, 5] // Monday to Friday
            }
        }
    },
    {
        id: 'user2',
        username: 'manager',
        passwordHash: 'hashed_password_456',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        role: DEFAULT_ROLES.MANAGER,
        isActive: true,
        mfaEnabled: true,
        mfaMethod: 'sms',
        mfaSecret: 'QRSTUVWXYZ123456',
        lastLogin: '2023-07-09T10:15:00',
        failedLoginAttempts: 0,
        accountLocked: false,
        passwordLastChanged: '2023-02-20',
        passwordExpiryDays: 90,
        consentGiven: true,
        consentTimestamp: '2023-01-02T11:30:00',
        dataRetentionPeriod: 365,
        accessRestrictions: {
            ipWhitelist: [],
            timeRestrictions: {
                enabled: false,
                startTime: '09:00',
                endTime: '17:00',
                workDays: [1, 2, 3, 4, 5]
            }
        }
    },
    {
        id: 'user3',
        username: 'user',
        passwordHash: 'hashed_password_789',
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob.johnson@example.com',
        role: DEFAULT_ROLES.USER,
        isActive: true,
        mfaEnabled: false,
        mfaMethod: null,
        mfaSecret: null,
        lastLogin: '2023-07-08T16:45:00',
        failedLoginAttempts: 0,
        accountLocked: false,
        passwordLastChanged: '2023-03-10',
        passwordExpiryDays: 90,
        consentGiven: true,
        consentTimestamp: '2023-01-03T14:20:00',
        dataRetentionPeriod: 365,
        accessRestrictions: {
            ipWhitelist: [],
            timeRestrictions: {
                enabled: false,
                startTime: '09:00',
                endTime: '17:00',
                workDays: [1, 2, 3, 4, 5]
            }
        }
    }
];

// Default compliance settings
const DEFAULT_COMPLIANCE_SETTINGS = {
    gdpr: {
        enabled: true,
        dataRetentionPeriod: 365, // days
        dataSubjectRights: {
            accessEnabled: true,
            rectificationEnabled: true,
            erasureEnabled: true,
            restrictionEnabled: true,
            portabilityEnabled: true,
            objectEnabled: true
        },
        consentManagement: {
            required: true,
            expiry: 365, // days
            renewalReminder: 30 // days before expiry
        },
        dataBreachNotification: {
            enabled: true,
            notifyWithin: 72 // hours
        }
    },
    ccpa: {
        enabled: true,
        doNotSellPersonalInfo: true,
        consumerRights: {
            accessEnabled: true,
            deletionEnabled: true,
            optOutEnabled: true
        },
        privacyPolicyLastUpdated: '2023-01-01'
    },
    hipaa: {
        enabled: false
    },
    pci: {
        enabled: false
    }
};

// Initialize security data in localStorage if it doesn't exist
function initializeSecurityData() {
    // Initialize roles
    if (!localStorage.getItem(SECURITY_STORAGE_KEYS.ROLES)) {
        localStorage.setItem(SECURITY_STORAGE_KEYS.ROLES, JSON.stringify(DEFAULT_ROLES));
    }
    
    // Initialize permissions
    if (!localStorage.getItem(SECURITY_STORAGE_KEYS.PERMISSIONS)) {
        localStorage.setItem(SECURITY_STORAGE_KEYS.PERMISSIONS, JSON.stringify(DEFAULT_PERMISSIONS));
    }
    
    // Initialize users
    if (!localStorage.getItem(SECURITY_STORAGE_KEYS.USERS)) {
        localStorage.setItem(SECURITY_STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    }
    
    // Initialize audit logs
    if (!localStorage.getItem(SECURITY_STORAGE_KEYS.AUDIT_LOGS)) {
        localStorage.setItem(SECURITY_STORAGE_KEYS.AUDIT_LOGS, JSON.stringify([]));
    }
    
    // Initialize compliance settings
    if (!localStorage.getItem(SECURITY_STORAGE_KEYS.COMPLIANCE_SETTINGS)) {
        localStorage.setItem(SECURITY_STORAGE_KEYS.COMPLIANCE_SETTINGS, JSON.stringify(DEFAULT_COMPLIANCE_SETTINGS));
    }
    
    // Generate encryption key if it doesn't exist
    if (!localStorage.getItem(SECURITY_STORAGE_KEYS.ENCRYPTION_KEYS)) {
        const encryptionKey = generateEncryptionKey();
        localStorage.setItem(SECURITY_STORAGE_KEYS.ENCRYPTION_KEYS, JSON.stringify({
            dataEncryptionKey: encryptionKey,
            keyCreatedAt: new Date().toISOString(),
            keyRotationPeriod: 90 // days
        }));
    }
}

// Generate a random encryption key
function generateEncryptionKey() {
    // In a real application, this would use a secure method to generate a key
    // For this demo, we'll create a random string
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < 32; i++) {
        key += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return key;
}

// Security Service object with methods for security operations
const SecurityService = {
    // Initialize security data
    initialize: function() {
        initializeSecurityData();
    },
    
    // Authentication methods
    login: function(username, password, mfaCode = null) {
        const users = JSON.parse(localStorage.getItem(SECURITY_STORAGE_KEYS.USERS)) || [];
        const user = users.find(u => u.username === username);
        
        if (!user) {
            this.logAuditEvent('LOGIN_FAILED', { username, reason: 'User not found' });
            return { success: false, message: 'Invalid username or password' };
        }
        
        if (!user.isActive) {
            this.logAuditEvent('LOGIN_FAILED', { username, reason: 'Account inactive' });
            return { success: false, message: 'Account is inactive' };
        }
        
        if (user.accountLocked) {
            this.logAuditEvent('LOGIN_FAILED', { username, reason: 'Account locked' });
            return { success: false, message: 'Account is locked. Please contact an administrator.' };
        }
        
        // In a real application, we would properly verify the password hash
        // For this demo, we'll just compare the stored hash
        if (user.passwordHash !== `hashed_password_${password}`) {
            // Increment failed login attempts
            user.failedLoginAttempts += 1;
            
            // Lock account after 5 failed attempts
            if (user.failedLoginAttempts >= 5) {
                user.accountLocked = true;
                this.logAuditEvent('ACCOUNT_LOCKED', { username, reason: 'Too many failed login attempts' });
            }
            
            // Update user in storage
            this.updateUser(user);
            
            this.logAuditEvent('LOGIN_FAILED', { username, reason: 'Invalid password' });
            return { success: false, message: 'Invalid username or password' };
        }
        
        // Check if MFA is required
        if (user.mfaEnabled) {
            if (!mfaCode) {
                return { 
                    success: false, 
                    requireMfa: true, 
                    mfaMethod: user.mfaMethod,
                    message: 'MFA code required' 
                };
            }
            
            // Verify MFA code
            if (!this.verifyMfaCode(user, mfaCode)) {
                this.logAuditEvent('LOGIN_FAILED', { username, reason: 'Invalid MFA code' });
                return { success: false, message: 'Invalid MFA code' };
            }
        }
        
        // Reset failed login attempts
        user.failedLoginAttempts = 0;
        user.lastLogin = new Date().toISOString();
        
        // Update user in storage
        this.updateUser(user);
        
        // Create session token
        const sessionToken = this.generateSessionToken(user);
        localStorage.setItem(SECURITY_STORAGE_KEYS.SESSION_TOKEN, sessionToken);
        localStorage.setItem(SECURITY_STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        
        this.logAuditEvent('LOGIN_SUCCESS', { username });
        
        return { 
            success: true, 
            user: {
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        };
    },
    
    logout: function() {
        const currentUser = this.getCurrentUser();
        if (currentUser) {
            this.logAuditEvent('LOGOUT', { username: currentUser.username });
        }
        
        localStorage.removeItem(SECURITY_STORAGE_KEYS.SESSION_TOKEN);
        localStorage.removeItem(SECURITY_STORAGE_KEYS.CURRENT_USER);
        
        return { success: true };
    },
    
    isLoggedIn: function() {
        const sessionToken = localStorage.getItem(SECURITY_STORAGE_KEYS.SESSION_TOKEN);
        return !!sessionToken && this.validateSessionToken(sessionToken);
    },
    
    getCurrentUser: function() {
        if (!this.isLoggedIn()) {
            return null;
        }
        
        return JSON.parse(localStorage.getItem(SECURITY_STORAGE_KEYS.CURRENT_USER));
    },
    
    // MFA methods
    verifyMfaCode: function(user, code) {
        // In a real application, this would properly verify the MFA code
        // For this demo, we'll accept any 6-digit code
        return /^\d{6}$/.test(code);
    },
    
    enableMfa: function(userId, method) {
        const user = this.getUserById(userId);
        if (!user) {
            return { success: false, message: 'User not found' };
        }
        
        user.mfaEnabled = true;
        user.mfaMethod = method;
        user.mfaSecret = this.generateMfaSecret();
        
        this.updateUser(user);
        this.logAuditEvent('MFA_ENABLED', { username: user.username, method });
        
        return { 
            success: true, 
            secret: user.mfaSecret,
            qrCode: this.generateMfaQrCode(user)
        };
    },
    
    disableMfa: function(userId) {
        const user = this.getUserById(userId);
        if (!user) {
            return { success: false, message: 'User not found' };
        }
        
        user.mfaEnabled = false;
        user.mfaMethod = null;
        user.mfaSecret = null;
        
        this.updateUser(user);
        this.logAuditEvent('MFA_DISABLED', { username: user.username });
        
        return { success: true };
    },
    
    generateMfaSecret: function() {
        // In a real application, this would generate a proper MFA secret
        // For this demo, we'll create a random string
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        let secret = '';
        for (let i = 0; i < 16; i++) {
            secret += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return secret;
    },
    
    generateMfaQrCode: function(user) {
        // In a real application, this would generate a QR code for the MFA app
        // For this demo, we'll return a placeholder
        return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/AftermarketSoftware:${user.username}?secret=${user.mfaSecret}&issuer=AftermarketSoftware`;
    },
    
    // Session management
    generateSessionToken: function(user) {
        // In a real application, this would generate a secure JWT or similar token
        // For this demo, we'll create a simple token with expiry
        const token = {
            userId: user.id,
            username: user.username,
            role: user.role,
            issuedAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString() // 8 hours
        };
        
        return btoa(JSON.stringify(token));
    },
    
    validateSessionToken: function(token) {
        try {
            const decodedToken = JSON.parse(atob(token));
            const now = new Date();
            const expiresAt = new Date(decodedToken.expiresAt);
            
            // Check if token is expired
            if (now > expiresAt) {
                return false;
            }
            
            // Check if user still exists and is active
            const user = this.getUserById(decodedToken.userId);
            if (!user || !user.isActive || user.accountLocked) {
                return false;
            }
            
            return true;
        } catch (error) {
            return false;
        }
    },
    
    // User management
    getUsers: function() {
        return JSON.parse(localStorage.getItem(SECURITY_STORAGE_KEYS.USERS)) || [];
    },
    
    getUserById: function(userId) {
        const users = this.getUsers();
        return users.find(user => user.id === userId);
    },
    
    updateUser: function(updatedUser) {
        const users = this.getUsers();
        const index = users.findIndex(user => user.id === updatedUser.id);
        
        if (index !== -1) {
            users[index] = updatedUser;
            localStorage.setItem(SECURITY_STORAGE_KEYS.USERS, JSON.stringify(users));
            return true;
        }
        
        return false;
    },
    
    createUser: function(newUser) {
        const users = this.getUsers();
        
        // Check if username already exists
        if (users.some(user => user.username === newUser.username)) {
            return { success: false, message: 'Username already exists' };
        }
        
        // Generate user ID
        newUser.id = `user${users.length + 1}`;
        
        // Set default values
        newUser.isActive = true;
        newUser.failedLoginAttempts = 0;
        newUser.accountLocked = false;
        newUser.passwordLastChanged = new Date().toISOString();
        
        users.push(newUser);
        localStorage.setItem(SECURITY_STORAGE_KEYS.USERS, JSON.stringify(users));
        
        this.logAuditEvent('USER_CREATED', { 
            username: newUser.username,
            createdBy: this.getCurrentUser()?.username || 'system'
        });
        
        return { success: true, userId: newUser.id };
    },
    
    // Role-based access control
    getRoles: function() {
        return JSON.parse(localStorage.getItem(SECURITY_STORAGE_KEYS.ROLES)) || DEFAULT_ROLES;
    },
    
    getPermissions: function(role) {
        const permissions = JSON.parse(localStorage.getItem(SECURITY_STORAGE_KEYS.PERMISSIONS)) || DEFAULT_PERMISSIONS;
        return permissions[role] || {};
    },
    
    hasPermission: function(permission) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) {
            return false;
        }
        
        const userPermissions = this.getPermissions(currentUser.role);
        return userPermissions[permission] === true;
    },
    
    // Data encryption
    encryptData: function(data) {
        // In a real application, this would use proper encryption
        // For this demo, we'll use a simple Base64 encoding
        return btoa(JSON.stringify(data));
    },
    
    decryptData: function(encryptedData) {
        // In a real application, this would use proper decryption
        // For this demo, we'll use Base64 decoding
        try {
            return JSON.parse(atob(encryptedData));
        } catch (error) {
            return null;
        }
    },
    
    // Audit logging
    logAuditEvent: function(eventType, eventData) {
        const auditLogs = JSON.parse(localStorage.getItem(SECURITY_STORAGE_KEYS.AUDIT_LOGS)) || [];
        
        const auditEvent = {
            id: `event${auditLogs.length + 1}`,
            timestamp: new Date().toISOString(),
            eventType,
            eventData,
            userId: this.getCurrentUser()?.id || null,
            username: this.getCurrentUser()?.username || null,
            ipAddress: '127.0.0.1', // In a real app, this would be the actual IP
            userAgent: navigator.userAgent
        };
        
        auditLogs.push(auditEvent);
        
        // Keep only the last 1000 audit logs to prevent localStorage from getting too large
        if (auditLogs.length > 1000) {
            auditLogs.shift();
        }
        
        localStorage.setItem(SECURITY_STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs));
        
        return auditEvent;
    },
    
    getAuditLogs: function(filters = {}) {
        let auditLogs = JSON.parse(localStorage.getItem(SECURITY_STORAGE_KEYS.AUDIT_LOGS)) || [];
        
        // Apply filters
        if (filters.userId) {
            auditLogs = auditLogs.filter(log => log.userId === filters.userId);
        }
        
        if (filters.eventType) {
            auditLogs = auditLogs.filter(log => log.eventType === filters.eventType);
        }
        
        if (filters.startDate) {
            const startDate = new Date(filters.startDate);
            auditLogs = auditLogs.filter(log => new Date(log.timestamp) >= startDate);
        }
        
        if (filters.endDate) {
            const endDate = new Date(filters.endDate);
            auditLogs = auditLogs.filter(log => new Date(log.timestamp) <= endDate);
        }
        
        // Sort by timestamp (newest first)
        auditLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        return auditLogs;
    },
    
    // Compliance features
    getComplianceSettings: function() {
        return JSON.parse(localStorage.getItem(SECURITY_STORAGE_KEYS.COMPLIANCE_SETTINGS)) || DEFAULT_COMPLIANCE_SETTINGS;
    },
    
    updateComplianceSettings: function(settings) {
        localStorage.setItem(SECURITY_STORAGE_KEYS.COMPLIANCE_SETTINGS, JSON.stringify(settings));
        this.logAuditEvent('COMPLIANCE_SETTINGS_UPDATED', { 
            updatedBy: this.getCurrentUser()?.username || 'system'
        });
        return true;
    },
    
    handleDataSubjectRequest: function(requestType, userId, requestData = {}) {
        const user = this.getUserById(userId);
        if (!user) {
            return { success: false, message: 'User not found' };
        }
        
        this.logAuditEvent('DATA_SUBJECT_REQUEST', { 
            requestType,
            userId,
            requestData
        });
        
        switch (requestType) {
            case 'ACCESS':
                // Return all user data
                return { 
                    success: true, 
                    data: {
                        user: {
                            id: user.id,
                            username: user.username,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                            role: user.role,
                            lastLogin: user.lastLogin,
                            consentGiven: user.consentGiven,
                            consentTimestamp: user.consentTimestamp
                        }
                    }
                };
                
            case 'RECTIFICATION':
                // Update user data
                if (requestData.firstName) user.firstName = requestData.firstName;
                if (requestData.lastName) user.lastName = requestData.lastName;
                if (requestData.email) user.email = requestData.email;
                
                this.updateUser(user);
                return { success: true };
                
            case 'ERASURE':
                // In a real app, this would anonymize or delete the user's data
                user.isActive = false;
                user.firstName = '[DELETED]';
                user.lastName = '[DELETED]';
                user.email = `deleted-${user.id}@example.com`;
                
                this.updateUser(user);
                return { success: true };
                
            case 'RESTRICTION':
                // Restrict processing
                user.isActive = false;
                this.updateUser(user);
                return { success: true };
                
            case 'PORTABILITY':
                // Return user data in portable format (JSON)
                return { 
                    success: true, 
                    data: JSON.stringify(user),
                    format: 'json'
                };
                
            case 'OBJECT':
                // Handle objection to processing
                user.consentGiven = false;
                user.consentTimestamp = new Date().toISOString();
                this.updateUser(user);
                return { success: true };
                
            default:
                return { success: false, message: 'Invalid request type' };
        }
    }
};

// Initialize security service
SecurityService.initialize();

// Export the SecurityService
window.SecurityService = SecurityService;
