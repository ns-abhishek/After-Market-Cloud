/**
 * Validation Service
 * 
 * This file provides data validation functionality to ensure data integrity
 * and accuracy throughout the application.
 */

// Validation rules for different entity types
const VALIDATION_RULES = {
    // Party validation rules
    party: {
        id: {
            required: false,
            type: 'string',
            pattern: /^P\d{3,}$/,
            message: 'Party ID must start with P followed by at least 3 digits'
        },
        partyType: {
            required: true,
            type: 'string',
            enum: ['Customer', 'Supplier', 'Vendor', 'Manufacturer', 'Distributor', 'Contractor'],
            message: 'Party type must be one of the allowed values'
        },
        name: {
            required: true,
            type: 'string',
            minLength: 2,
            maxLength: 100,
            message: 'Name must be between 2 and 100 characters'
        },
        contactPerson: {
            required: false,
            type: 'string',
            maxLength: 100,
            message: 'Contact person name must not exceed 100 characters'
        },
        email: {
            required: false,
            type: 'string',
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: 'Email must be a valid email address'
        },
        phone: {
            required: false,
            type: 'string',
            pattern: /^[+]?[\d\s()-]{7,20}$/,
            message: 'Phone must be a valid phone number'
        },
        address: {
            required: false,
            type: 'string',
            maxLength: 200,
            message: 'Address must not exceed 200 characters'
        },
        city: {
            required: false,
            type: 'string',
            maxLength: 100,
            message: 'City must not exceed 100 characters'
        },
        country: {
            required: false,
            type: 'string',
            maxLength: 100,
            message: 'Country must not exceed 100 characters'
        },
        isActive: {
            required: false,
            type: 'boolean',
            message: 'isActive must be a boolean value'
        }
    },
    
    // Document validation rules
    document: {
        id: {
            required: false,
            type: 'string',
            pattern: /^DOC\d{3,}$/,
            message: 'Document ID must start with DOC followed by at least 3 digits'
        },
        name: {
            required: true,
            type: 'string',
            minLength: 1,
            maxLength: 255,
            message: 'Document name must be between 1 and 255 characters'
        },
        type: {
            required: true,
            type: 'string',
            enum: ['PDF', 'Word', 'Excel', 'PowerPoint', 'Image', 'Text', 'Other'],
            message: 'Document type must be one of the allowed values'
        },
        size: {
            required: true,
            type: 'string',
            message: 'Document size is required'
        },
        category: {
            required: false,
            type: 'string',
            enum: ['Contract', 'Invoice', 'Manual', 'Report', 'Template', 'Legal', 'Other'],
            message: 'Document category must be one of the allowed values'
        },
        version: {
            required: false,
            type: 'string',
            message: 'Document version must be a string'
        },
        status: {
            required: false,
            type: 'string',
            enum: ['Draft', 'Active', 'Archived', 'Expired'],
            message: 'Document status must be one of the allowed values'
        }
    },
    
    // Contract validation rules
    contract: {
        id: {
            required: false,
            type: 'string',
            pattern: /^C\d{3,}$/,
            message: 'Contract ID must start with C followed by at least 3 digits'
        },
        title: {
            required: true,
            type: 'string',
            minLength: 2,
            maxLength: 200,
            message: 'Contract title must be between 2 and 200 characters'
        },
        partyId: {
            required: true,
            type: 'string',
            message: 'Party ID is required'
        },
        startDate: {
            required: true,
            type: 'date',
            message: 'Start date is required and must be a valid date'
        },
        endDate: {
            required: true,
            type: 'date',
            message: 'End date is required and must be a valid date'
        },
        value: {
            required: false,
            type: 'number',
            min: 0,
            message: 'Contract value must be a positive number'
        },
        status: {
            required: true,
            type: 'string',
            enum: ['Draft', 'Active', 'Expired', 'Terminated', 'Renewed'],
            message: 'Contract status must be one of the allowed values'
        }
    }
};

// Validation Service
const ValidationService = {
    // Validate an entity against its validation rules
    validate: function(entity, entityType) {
        const rules = VALIDATION_RULES[entityType];
        
        if (!rules) {
            console.warn(`No validation rules defined for entity type: ${entityType}`);
            return { valid: true, errors: {} };
        }
        
        const errors = {};
        let valid = true;
        
        // Check each field against its rules
        Object.keys(rules).forEach(field => {
            const fieldRules = rules[field];
            const value = entity[field];
            
            // Check required rule
            if (fieldRules.required && (value === undefined || value === null || value === '')) {
                errors[field] = fieldRules.message || `${field} is required`;
                valid = false;
                return;
            }
            
            // Skip further validation if value is not provided and not required
            if ((value === undefined || value === null || value === '') && !fieldRules.required) {
                return;
            }
            
            // Check type rule
            if (fieldRules.type) {
                let typeValid = true;
                
                switch (fieldRules.type) {
                    case 'string':
                        typeValid = typeof value === 'string';
                        break;
                    case 'number':
                        typeValid = typeof value === 'number' && !isNaN(value);
                        break;
                    case 'boolean':
                        typeValid = typeof value === 'boolean';
                        break;
                    case 'date':
                        typeValid = value instanceof Date || (typeof value === 'string' && !isNaN(Date.parse(value)));
                        break;
                    case 'array':
                        typeValid = Array.isArray(value);
                        break;
                    case 'object':
                        typeValid = typeof value === 'object' && value !== null && !Array.isArray(value);
                        break;
                }
                
                if (!typeValid) {
                    errors[field] = fieldRules.message || `${field} must be a ${fieldRules.type}`;
                    valid = false;
                    return;
                }
            }
            
            // Check min/max for numbers
            if (fieldRules.type === 'number') {
                if (fieldRules.min !== undefined && value < fieldRules.min) {
                    errors[field] = fieldRules.message || `${field} must be at least ${fieldRules.min}`;
                    valid = false;
                    return;
                }
                
                if (fieldRules.max !== undefined && value > fieldRules.max) {
                    errors[field] = fieldRules.message || `${field} must be at most ${fieldRules.max}`;
                    valid = false;
                    return;
                }
            }
            
            // Check minLength/maxLength for strings
            if (fieldRules.type === 'string') {
                if (fieldRules.minLength !== undefined && value.length < fieldRules.minLength) {
                    errors[field] = fieldRules.message || `${field} must be at least ${fieldRules.minLength} characters`;
                    valid = false;
                    return;
                }
                
                if (fieldRules.maxLength !== undefined && value.length > fieldRules.maxLength) {
                    errors[field] = fieldRules.message || `${field} must be at most ${fieldRules.maxLength} characters`;
                    valid = false;
                    return;
                }
            }
            
            // Check pattern for strings
            if (fieldRules.type === 'string' && fieldRules.pattern) {
                if (!fieldRules.pattern.test(value)) {
                    errors[field] = fieldRules.message || `${field} has an invalid format`;
                    valid = false;
                    return;
                }
            }
            
            // Check enum values
            if (fieldRules.enum && !fieldRules.enum.includes(value)) {
                errors[field] = fieldRules.message || `${field} must be one of: ${fieldRules.enum.join(', ')}`;
                valid = false;
                return;
            }
        });
        
        return { valid, errors };
    },
    
    // Validate a specific field of an entity
    validateField: function(entity, entityType, field) {
        const rules = VALIDATION_RULES[entityType];
        
        if (!rules || !rules[field]) {
            return { valid: true, error: null };
        }
        
        const fieldRules = rules[field];
        const value = entity[field];
        
        // Create a temporary object with just the field to validate
        const tempEntity = { [field]: value };
        
        // Use the full validation function but only check the specified field
        const result = this.validate(tempEntity, entityType);
        
        return { 
            valid: !result.errors[field], 
            error: result.errors[field] || null 
        };
    },
    
    // Get validation rules for an entity type
    getValidationRules: function(entityType) {
        return VALIDATION_RULES[entityType] || null;
    },
    
    // Add custom validation rule
    addValidationRule: function(entityType, field, rule) {
        if (!VALIDATION_RULES[entityType]) {
            VALIDATION_RULES[entityType] = {};
        }
        
        VALIDATION_RULES[entityType][field] = { ...VALIDATION_RULES[entityType][field], ...rule };
    }
};

// Export the validation service
window.ValidationService = ValidationService;
