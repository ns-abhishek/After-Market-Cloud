/**
 * MFA Method enum
 */
const MFAMethod = {
    SMS_OTP: 'SMS_OTP',
    EMAIL_OTP: 'EMAIL_OTP',
    AUTHENTICATOR_APP: 'AUTHENTICATOR_APP',
    FINGERPRINT: 'FINGERPRINT',
    MPIN: 'MPIN'
};

// Each user now has their own MFA configuration

/**
 * Mock users with different MFA configurations
 * In a real application, this would come from a database
 */
const mockUsers = [
    {
        id: '1',
        username: 'user1',
        password: 'Password@123',
        email: 'user1@example.com',
        phoneNumber: '+91 9876543210',
        hasAuthenticatorApp: true,
        hasFingerprintEnabled: true,
        hasMPINEnabled: true,
        mfaConfig: {
            totalFactors: 2, // Username/password + 1 additional factor
            methods: [MFAMethod.SMS_OTP]
        }
    },
    {
        id: '2',
        username: 'user2',
        password: 'Password@123',
        email: 'user2@example.com',
        phoneNumber: '+91 9876543211',
        hasAuthenticatorApp: true,
        hasFingerprintEnabled: true,
        hasMPINEnabled: true,
        mfaConfig: {
            totalFactors: 3, // Username/password + 2 additional factors
            methods: [MFAMethod.SMS_OTP, MFAMethod.FINGERPRINT]
        }
    },
    {
        id: '3',
        username: 'user3',
        password: 'Password@123',
        email: 'user3@example.com',
        phoneNumber: '+91 9876543212',
        hasAuthenticatorApp: true,
        hasFingerprintEnabled: true,
        hasMPINEnabled: true,
        mfaConfig: {
            totalFactors: 4, // Username/password + 3 additional factors
            methods: [MFAMethod.SMS_OTP, MFAMethod.AUTHENTICATOR_APP, MFAMethod.MPIN]
        }
    }
];

/**
 * Mock verification codes
 * In a real application, these would be generated and validated by the server
 */
const mockVerificationCodes = {
    SMS_OTP: '123456',
    EMAIL_OTP: '123456',
    AUTHENTICATOR_APP: '123456',
    MPIN: '1234'
};
