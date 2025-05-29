// Help Content Structure
const helpContent = {
    // Main sections
    "getting-started": {
        title: "Getting Started",
        content: `
            <h2>Getting Started with OMS</h2>
            <p>Welcome to the Order Management System (OMS). This guide will help you understand the basics of using the system effectively.</p>
            
            <h3>What is OMS?</h3>
            <p>OMS is a comprehensive solution designed to streamline your order processing workflow. It allows you to manage orders, track inventory, handle customer information, and generate reports.</p>
            
            <h3>Key Features</h3>
            <ul>
                <li>Order creation and management</li>
                <li>Inventory tracking</li>
                <li>Customer management</li>
                <li>Analytics and reporting</li>
                <li>User access control</li>
            </ul>
            
            <h3>Quick Start Guide</h3>
            <p>To get started with OMS:</p>
            <ol>
                <li>Log in to your account</li>
                <li>Navigate to the Orders dashboard</li>
                <li>Create your first order by clicking the "New Order" button</li>
                <li>Fill in the required information and submit</li>
            </ol>
            
            <div class="help-callout">
                <h4>Need a guided tour?</h4>
                <p>Click the "Start Walkthrough" button below to get a step-by-step tour of the main features.</p>
                <button id="start-walkthrough" class="help-button">Start Walkthrough</button>
            </div>
        `,
        sections: ["system-requirements", "user-roles", "navigation"]
    },
    
    "system-requirements": {
        title: "System Requirements",
        content: `
            <h2>System Requirements</h2>
            <p>To ensure optimal performance of the Order Management System, please make sure your system meets the following requirements:</p>
            
            <h3>Supported Browsers</h3>
            <ul>
                <li>Google Chrome (version 70 or later)</li>
                <li>Mozilla Firefox (version 65 or later)</li>
                <li>Microsoft Edge (version 80 or later)</li>
                <li>Safari (version 13 or later)</li>
            </ul>
            
            <h3>Hardware Requirements</h3>
            <ul>
                <li>Processor: 2 GHz dual-core processor or better</li>
                <li>RAM: 4 GB minimum</li>
                <li>Display resolution: 1280 x 720 or higher</li>
                <li>Internet connection: Broadband (1 Mbps or faster)</li>
            </ul>
            
            <h3>Mobile Devices</h3>
            <p>OMS is responsive and works on tablets and smartphones, but for the best experience, we recommend using a desktop or laptop computer.</p>
        `,
        parent: "getting-started"
    },
    
    "user-roles": {
        title: "User Roles and Permissions",
        content: `
            <h2>User Roles and Permissions</h2>
            <p>OMS provides different access levels based on user roles. Understanding these roles will help you navigate the system according to your responsibilities.</p>
            
            <h3>Administrator</h3>
            <p>Administrators have full access to all features and settings in the system. They can:</p>
            <ul>
                <li>Manage user accounts and permissions</li>
                <li>Configure system settings</li>
                <li>Access all orders, products, and customer data</li>
                <li>Generate and export all reports</li>
                <li>Perform system maintenance</li>
            </ul>
            
            <h3>Manager</h3>
            <p>Managers have access to most features but cannot modify system settings. They can:</p>
            <ul>
                <li>View and manage all orders</li>
                <li>Manage inventory and products</li>
                <li>Access customer information</li>
                <li>Generate reports</li>
            </ul>
            
            <h3>Order Processor</h3>
            <p>Order processors focus on handling orders. They can:</p>
            <ul>
                <li>Create and update orders</li>
                <li>View product information</li>
                <li>View basic customer details</li>
                <li>Generate order-related reports</li>
            </ul>
            
            <h3>Viewer</h3>
            <p>Viewers have read-only access to the system. They can:</p>
            <ul>
                <li>View orders and their status</li>
                <li>View product information</li>
                <li>View basic reports</li>
            </ul>
            
            <div class="help-note">
                <p><strong>Note:</strong> If you need additional permissions, please contact your system administrator.</p>
            </div>
        `,
        parent: "getting-started"
    },
    
    "navigation": {
        title: "Navigating the Interface",
        content: `
            <h2>Navigating the Interface</h2>
            <p>Understanding the OMS interface will help you work efficiently. Here's a breakdown of the main components:</p>
            
            <h3>Header Bar</h3>
            <p>Located at the top of the screen, the header contains:</p>
            <ul>
                <li><strong>Logo:</strong> Click to return to the dashboard</li>
                <li><strong>Search Bar:</strong> Search for orders, products, or customers</li>
                <li><strong>Notifications:</strong> View system notifications</li>
                <li><strong>User Profile:</strong> Access your account settings</li>
                <li><strong>Help Button:</strong> Open this help center</li>
            </ul>
            
            <h3>Sidebar Navigation</h3>
            <p>The sidebar on the left provides access to the main sections:</p>
            <ul>
                <li><strong>Orders:</strong> Manage all orders</li>
                <li><strong>Products:</strong> View and update your inventory</li>
                <li><strong>Customers:</strong> Manage customer information</li>
                <li><strong>Analytics:</strong> View reports and statistics</li>
                <li><strong>Settings:</strong> Configure system preferences</li>
            </ul>
            
            <h3>Main Content Area</h3>
            <p>The central area displays the content of the selected section. This is where you'll perform most of your tasks.</p>
            
            <h3>Action Buttons</h3>
            <p>Each section has specific action buttons that allow you to perform tasks like creating new orders, exporting data, or filtering results.</p>
            
            <div class="help-tip">
                <p><strong>Tip:</strong> Hover over any button or icon to see a tooltip explaining its function.</p>
            </div>
        `,
        parent: "getting-started"
    },
    
    "managing-orders": {
        title: "Managing Orders",
        content: `
            <h2>Managing Orders</h2>
            <p>The Orders section is the core of the OMS. Here you can create, view, edit, and process orders.</p>
            
            <h3>Orders Dashboard</h3>
            <p>The Orders Dashboard provides an overview of all orders in the system. You can:</p>
            <ul>
                <li>View order status at a glance</li>
                <li>Sort orders by various criteria</li>
                <li>Filter orders by status, date, or customer</li>
                <li>Export order data</li>
            </ul>
            
            <h3>Creating a New Order</h3>
            <p>To create a new order:</p>
            <ol>
                <li>Click the "New Order" button in the Orders Dashboard</li>
                <li>Select a customer or create a new one</li>
                <li>Add products to the order</li>
                <li>Set quantities and apply any discounts</li>
                <li>Review the order details</li>
                <li>Click "Submit Order"</li>
            </ol>
            
            <h3>Order Status</h3>
            <p>Orders can have the following statuses:</p>
            <ul>
                <li><strong>Pending:</strong> Order has been created but not processed</li>
                <li><strong>Processing:</strong> Order is being prepared</li>
                <li><strong>Shipped:</strong> Order has been sent to the customer</li>
                <li><strong>Delivered:</strong> Order has been received by the customer</li>
                <li><strong>Cancelled:</strong> Order has been cancelled</li>
                <li><strong>Returned:</strong> Order has been returned by the customer</li>
            </ul>
            
            <h3>Order Actions</h3>
            <p>For each order, you can:</p>
            <ul>
                <li><strong>View:</strong> See all order details</li>
                <li><strong>Edit:</strong> Modify order information</li>
                <li><strong>Delete:</strong> Remove the order from the system</li>
                <li><strong>Update Status:</strong> Change the order's current status</li>
                <li><strong>Print:</strong> Generate a printable order summary</li>
                <li><strong>Email:</strong> Send order details to the customer</li>
            </ul>
            
            <div class="help-video">
                <h4>Video Tutorial: Creating and Managing Orders</h4>
                <p>Watch this video for a detailed walkthrough of the order management process.</p>
                <div class="video-placeholder">
                    <i class="fas fa-play-circle"></i>
                    <span>Video Tutorial: Creating and Managing Orders</span>
                </div>
            </div>
        `,
        sections: ["order-creation", "order-processing", "order-fulfillment"]
    },
    
    // More sections would be added here...
    
    // Contextual help for specific pages
    "contextual": {
        "orders-dashboard": {
            title: "Orders Dashboard Help",
            content: `
                <h3>Orders Dashboard</h3>
                <p>This is your central hub for managing all orders in the system.</p>
                
                <h4>Quick Tips:</h4>
                <ul>
                    <li>Use the "New Order" button to create a new order</li>
                    <li>Click on any order row to view its details</li>
                    <li>Use the filter button to narrow down the orders displayed</li>
                    <li>Export your orders to CSV for external processing</li>
                    <li>The status badges indicate the current state of each order</li>
                </ul>
                
                <h4>Common Tasks:</h4>
                <ul>
                    <li><a href="#" class="help-link" data-topic="order-creation">Creating a new order</a></li>
                    <li><a href="#" class="help-link" data-topic="order-processing">Processing pending orders</a></li>
                    <li><a href="#" class="help-link" data-topic="order-fulfillment">Fulfilling and shipping orders</a></li>
                </ul>
                
                <div class="help-faq">
                    <h4>Frequently Asked Questions:</h4>
                    <div class="faq-item">
                        <div class="faq-question">How do I change an order's status?</div>
                        <div class="faq-answer">Click on the "View" button for the order, then use the "Update Status" dropdown in the order details page.</div>
                    </div>
                    <div class="faq-item">
                        <div class="faq-question">Can I delete an order?</div>
                        <div class="faq-answer">Yes, you can delete an order by clicking the trash icon. However, this action cannot be undone, so use it with caution.</div>
                    </div>
                </div>
            `
        }
    },
    
    // Walkthrough steps
    "walkthrough": {
        "welcome": {
            title: "Welcome to OMS",
            content: `
                <p>Welcome to the Order Management System! This quick tour will guide you through the main features of the application.</p>
                <p>Click "Next" to continue or "Skip" to exit the tour at any time.</p>
            `
        },
        "orders-dashboard": {
            title: "Orders Dashboard",
            content: `
                <p>This is the Orders Dashboard, where you can view and manage all your orders.</p>
                <p>The table shows key information about each order, including its status, customer, and total amount.</p>
                <p>Use the action buttons on the right to view, edit, or delete orders.</p>
            `
        },
        "new-order": {
            title: "Creating Orders",
            content: `
                <p>To create a new order, click the "New Order" button in the top right corner of the dashboard.</p>
                <p>This will open the order creation form where you can select products, specify quantities, and add customer information.</p>
            `
        },
        "sidebar-navigation": {
            title: "Navigation",
            content: `
                <p>Use the sidebar on the left to navigate between different sections of the application.</p>
                <p>You can access Products, Customers, Analytics, and Settings from here.</p>
            `
        },
        "help-features": {
            title: "Getting Help",
            content: `
                <p>If you need help at any time, click the question mark icon in the top right corner to open the Help Center.</p>
                <p>You can also use the "Page Help" button in the sidebar to get contextual help for the current page.</p>
                <p>Hover over any element to see a tooltip with a brief explanation of its function.</p>
            `
        }
    }
};

// Export the help content for use in script.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { helpContent };
}
