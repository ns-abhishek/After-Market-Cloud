// Mock user database
const users = [
    {
        id: 1,
        username: 'user1',
        email: 'user1@example.com',
        password: 'Password@123', // Updated to meet requirements
        phone: '+91 XXXXXXX123',
        mfaMethods: {
            sms: true,
            email: true,
            authenticator: true,
            mpin: true,
            faceid: true,
            fingerprint: true
        },
        mpin: '1234',
        authenticatorSecret: 'ABCDEFGHIJKLMNOP' // This would be a secret key for authenticator apps
    },
    {
        id: 2,
        username: 'user2',
        email: 'user2@example.com',
        password: 'Secure#456', // Updated to meet requirements
        phone: '+91 XXXXXXX456',
        mfaMethods: {
            sms: true,
            email: true,
            authenticator: false,
            mpin: true,
            faceid: true,
            fingerprint: false
        },
        mpin: '5678'
    },
    {
        id: 3,
        username: 'admin',
        email: 'admin@example.com',
        password: 'Admin$789', // Updated to meet requirements
        phone: '+91 XXXXXXX789',
        mfaMethods: {
            sms: true,
            email: true,
            authenticator: true,
            mpin: true,
            faceid: true,
            fingerprint: true
        },
        mpin: '9999',
        authenticatorSecret: 'QRSTUVWXYZ123456'
    }
];

// Function to generate a random OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store generated OTPs (in a real app, this would be in a secure database)
const otpStore = {
    sms: {},
    email: {}
};
