const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        match: [
            /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
            'Please provide a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 8,
        select: false
    },
    firstName: {
        type: String,
        required: [true, 'Please provide your first name']
    },
    lastName: {
        type: String,
        required: [true, 'Please provide your last name']
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password reset token
UserSchema.methods.getResetPasswordToken = function() {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    return resetToken;
};

// Check if account is locked
UserSchema.methods.isLocked = function() {
    // Check for a future lockUntil timestamp
    return this.lockUntil && this.lockUntil > Date.now();
};

// Increment login attempts
UserSchema.methods.incrementLoginAttempts = async function() {
    // If we have a previous lock that has expired, reset the count
    if (this.lockUntil && this.lockUntil < Date.now()) {
        this.loginAttempts = 1;
        this.lockUntil = null;
    } else {
        // Otherwise increment login attempts
        this.loginAttempts += 1;
    }

    // Lock the account if we've reached max attempts (3)
    if (this.loginAttempts >= 3 && !this.isLocked()) {
        // Lock for 5 minutes
        this.lockUntil = Date.now() + 5 * 60 * 1000;
    }

    return this.save();
};

// Reset login attempts
UserSchema.methods.resetLoginAttempts = function() {
    this.loginAttempts = 0;
    this.lockUntil = null;
    return this.save();
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
