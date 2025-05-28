/**
 * Access Control System
 * 
 * This file implements the access control models:
 * - Role-Based Access Control (RBAC)
 * - Attribute-Based Access Control (ABAC)
 * - Access Control Lists (ACLs)
 */

// ===== RBAC Implementation =====

/**
 * Role-Based Access Control (RBAC) implementation
 * Permissions are assigned to roles, and users are assigned to roles
 */
class RBACManager {
    constructor() {
        // Initialize roles and their permissions
        this.roles = {};
        this.userRoles = {};
    }

    /**
     * Add a new role with specified permissions
     * @param {string} roleName - Name of the role
     * @param {Array<string>} permissions - Array of permission names
     */
    addRole(roleName, permissions = []) {
        this.roles[roleName] = permissions;
    }

    /**
     * Assign a role to a user
     * @param {string} userId - User identifier
     * @param {string} roleName - Name of the role to assign
     */
    assignRoleToUser(userId, roleName) {
        if (!this.roles[roleName]) {
            throw new Error(`Role ${roleName} does not exist`);
        }

        if (!this.userRoles[userId]) {
            this.userRoles[userId] = [];
        }

        // Check if user already has this role
        if (!this.userRoles[userId].includes(roleName)) {
            this.userRoles[userId].push(roleName);
        }
    }

    /**
     * Remove a role from a user
     * @param {string} userId - User identifier
     * @param {string} roleName - Name of the role to remove
     */
    removeRoleFromUser(userId, roleName) {
        if (this.userRoles[userId]) {
            this.userRoles[userId] = this.userRoles[userId].filter(role => role !== roleName);
        }
    }

    /**
     * Check if a user has a specific permission
     * @param {string} userId - User identifier
     * @param {string} permission - Permission to check
     * @returns {boolean} - True if user has the permission, false otherwise
     */
    hasPermission(userId, permission) {
        if (!this.userRoles[userId]) {
            return false;
        }

        // Check each of the user's roles for the permission
        return this.userRoles[userId].some(roleName => {
            const rolePermissions = this.roles[roleName] || [];
            return rolePermissions.includes(permission);
        });
    }

    /**
     * Get all permissions for a user
     * @param {string} userId - User identifier
     * @returns {Array<string>} - Array of permissions
     */
    getUserPermissions(userId) {
        if (!this.userRoles[userId]) {
            return [];
        }

        // Collect all permissions from all roles
        const permissions = new Set();
        this.userRoles[userId].forEach(roleName => {
            const rolePermissions = this.roles[roleName] || [];
            rolePermissions.forEach(permission => permissions.add(permission));
        });

        return Array.from(permissions);
    }
}

// ===== ABAC Implementation =====

/**
 * Attribute-Based Access Control (ABAC) implementation
 * Access decisions based on attributes of users, resources, and environment
 */
class ABACManager {
    constructor() {
        this.policies = [];
    }

    /**
     * Add a policy for attribute-based access control
     * @param {Function} policyFunction - Function that evaluates attributes and returns boolean
     * @param {string} description - Description of the policy
     */
    addPolicy(policyFunction, description) {
        this.policies.push({
            evaluate: policyFunction,
            description
        });
    }

    /**
     * Check if access is allowed based on attributes
     * @param {Object} userAttributes - User attributes (department, role, etc.)
     * @param {Object} resourceAttributes - Resource attributes (type, owner, etc.)
     * @param {Object} environmentAttributes - Environment attributes (time, location, etc.)
     * @returns {boolean} - True if access is allowed, false otherwise
     */
    isAccessAllowed(userAttributes, resourceAttributes, environmentAttributes) {
        // Access is allowed if any policy evaluates to true
        return this.policies.some(policy => 
            policy.evaluate(userAttributes, resourceAttributes, environmentAttributes)
        );
    }

    /**
     * Get all policies that allow access for the given attributes
     * @param {Object} userAttributes - User attributes
     * @param {Object} resourceAttributes - Resource attributes
     * @param {Object} environmentAttributes - Environment attributes
     * @returns {Array<Object>} - Array of matching policies
     */
    getMatchingPolicies(userAttributes, resourceAttributes, environmentAttributes) {
        return this.policies.filter(policy => 
            policy.evaluate(userAttributes, resourceAttributes, environmentAttributes)
        );
    }
}

// ===== ACL Implementation =====

/**
 * Access Control Lists (ACL) implementation
 * Permissions assigned directly to users for specific resources
 */
class ACLManager {
    constructor() {
        // Map of resource IDs to their ACLs
        this.resourceAcls = {};
    }

    /**
     * Grant permission to a user for a specific resource
     * @param {string} resourceId - Resource identifier
     * @param {string} userId - User identifier
     * @param {string} permission - Permission to grant (e.g., 'read', 'write', 'delete')
     */
    grantPermission(resourceId, userId, permission) {
        if (!this.resourceAcls[resourceId]) {
            this.resourceAcls[resourceId] = {};
        }
        
        if (!this.resourceAcls[resourceId][userId]) {
            this.resourceAcls[resourceId][userId] = [];
        }

        if (!this.resourceAcls[resourceId][userId].includes(permission)) {
            this.resourceAcls[resourceId][userId].push(permission);
        }
    }

    /**
     * Revoke permission from a user for a specific resource
     * @param {string} resourceId - Resource identifier
     * @param {string} userId - User identifier
     * @param {string} permission - Permission to revoke
     */
    revokePermission(resourceId, userId, permission) {
        if (this.resourceAcls[resourceId] && this.resourceAcls[resourceId][userId]) {
            this.resourceAcls[resourceId][userId] = 
                this.resourceAcls[resourceId][userId].filter(p => p !== permission);
        }
    }

    /**
     * Check if a user has a specific permission for a resource
     * @param {string} resourceId - Resource identifier
     * @param {string} userId - User identifier
     * @param {string} permission - Permission to check
     * @returns {boolean} - True if user has the permission, false otherwise
     */
    hasPermission(resourceId, userId, permission) {
        return !!(
            this.resourceAcls[resourceId] && 
            this.resourceAcls[resourceId][userId] && 
            this.resourceAcls[resourceId][userId].includes(permission)
        );
    }

    /**
     * Get all permissions a user has for a specific resource
     * @param {string} resourceId - Resource identifier
     * @param {string} userId - User identifier
     * @returns {Array<string>} - Array of permissions
     */
    getUserPermissions(resourceId, userId) {
        if (this.resourceAcls[resourceId] && this.resourceAcls[resourceId][userId]) {
            return [...this.resourceAcls[resourceId][userId]];
        }
        return [];
    }
}

// ===== Hybrid Access Control System =====

/**
 * Hybrid Access Control System
 * Combines RBAC, ABAC, and ACL for comprehensive access control
 */
class AccessControlSystem {
    constructor() {
        this.rbac = new RBACManager();
        this.abac = new ABACManager();
        this.acl = new ACLManager();
    }

    /**
     * Check if a user has permission to access a resource
     * @param {string} userId - User identifier
     * @param {string} resourceId - Resource identifier
     * @param {string} action - Action to perform (e.g., 'read', 'write')
     * @param {Object} context - Additional context (user attributes, resource attributes, environment)
     * @returns {boolean} - True if access is allowed, false otherwise
     */
    checkAccess(userId, resourceId, action, context = {}) {
        const { userAttributes = {}, resourceAttributes = {}, environmentAttributes = {} } = context;
        
        // Check ACL first (most specific)
        if (this.acl.hasPermission(resourceId, userId, action)) {
            return true;
        }
        
        // Check RBAC (role-based permissions)
        if (this.rbac.hasPermission(userId, `${resourceAttributes.type || 'resource'}_${action}`)) {
            // If RBAC allows, check if any ABAC policies restrict access
            const abacAllows = this.abac.isAccessAllowed(
                { ...userAttributes, userId },
                { ...resourceAttributes, resourceId },
                environmentAttributes
            );
            
            return abacAllows;
        }
        
        return false;
    }
}

// Export the access control classes
window.AccessControl = {
    RBAC: RBACManager,
    ABAC: ABACManager,
    ACL: ACLManager,
    System: AccessControlSystem
};
