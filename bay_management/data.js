// Mock data for Bay Management System

// Bay data - Updated to match reference image format
const baysData = [
    { id: 1, number: 'A1', status: 'available', customer: null, shipment: null, description: 'Service bay A1', type: 'Outside Branch', isActive: true },
    { id: 2, number: 'Bay 01', status: 'occupied', customer: 'Viraj Javeri', shipment: '#1652AVER1761', description: 'Service bay 01', type: 'Working', isActive: true },
    { id: 3, number: 'Bay 02', status: 'occupied', customer: 'Ramoliya Krunal', shipment: '#1652AVER1761', description: 'Service bay 02', type: 'Working', isActive: true },
    { id: 4, number: 'Bay 03', status: 'occupied', customer: 'Mahesh Savani', shipment: '#1652AVER1761', description: 'Service bay 03 - Safety Rail', type: 'Working', isActive: true },
    { id: 5, number: 'Bay 04', status: 'occupied', customer: 'Vidhyut Mava', shipment: '#1652AVER1761', description: 'Service bay 04', type: 'Working', isActive: true },
    { id: 6, number: 'Bay 05', status: 'occupied', customer: 'Kavy Ramoliya', shipment: '#1652AVER1761', description: 'Service bay 05', type: 'Working', isActive: true },
    { id: 7, number: 'Bay 06', status: 'occupied', customer: 'Nirma Chapani', shipment: '#1652AVER1761', description: 'Service bay 06', type: 'Working', isActive: true },
    { id: 8, number: 'Bay 07', status: 'occupied', customer: 'Avanti Daruwala', shipment: '#1652AVER1761', description: 'Service bay 07', type: 'Working', isActive: true },
    { id: 9, number: 'Bay 08', status: 'occupied', customer: 'Ravi Patel', shipment: '#1652AVER1761', description: 'Service bay 08', type: 'Working', isActive: true },
    { id: 10, number: 'Bay 09', status: 'occupied', customer: 'Priya Shah', shipment: '#1652AVER1761', description: 'Service bay 09', type: 'Working', isActive: true },
    { id: 11, number: 'A01', status: 'occupied', customer: 'Amit Kumar', shipment: '#1652AVER1761', description: 'Service bay A01', type: 'Working', isActive: true },
    { id: 12, number: 'A02', status: 'available', customer: null, shipment: null, description: 'Service bay A02', type: 'Outside Branch', isActive: true },
    { id: 13, number: 'A03', status: 'occupied', customer: 'Sneha Gupta', shipment: '#1652AVER1761', description: 'Service bay A03', type: 'Working', isActive: true },
    { id: 14, number: 'A04', status: 'maintenance', customer: null, shipment: null, description: 'Service bay A04', type: 'Maintenance', isActive: false },
    { id: 15, number: 'A05', status: 'occupied', customer: 'Rohit Singh', shipment: '#1652AVER1761', description: 'Service bay A05', type: 'Working', isActive: true },
    { id: 16, number: 'A06', status: 'available', customer: null, shipment: null, description: 'Service bay A06', type: 'Outside Branch', isActive: true },
    { id: 17, number: 'B01', status: 'occupied', customer: 'Deepak Sharma', shipment: '#1652AVER1761', description: 'Service bay B01', type: 'Working', isActive: true },
    { id: 18, number: 'B02', status: 'available', customer: null, shipment: null, description: 'Service bay B02', type: 'Outside Branch', isActive: true },
    { id: 19, number: 'B03', status: 'occupied', customer: 'Anita Verma', shipment: '#1652AVER1761', description: 'Service bay B03', type: 'Working', isActive: true },
    { id: 20, number: 'B04', status: 'available', customer: null, shipment: null, description: 'Service bay B04', type: 'Outside Branch', isActive: true },
    { id: 21, number: 'B05', status: 'occupied', customer: 'Rajesh Kumar', shipment: '#1652AVER1761', description: 'Service bay B05', type: 'Working', isActive: true },
    { id: 22, number: 'B06', status: 'maintenance', customer: null, shipment: null, description: 'Service bay B06', type: 'Maintenance', isActive: false },
    { id: 23, number: 'C01', status: 'occupied', customer: 'Sunita Patel', shipment: '#1652AVER1761', description: 'Service bay C01', type: 'Working', isActive: true },
    { id: 24, number: 'C02', status: 'available', customer: null, shipment: null, description: 'Service bay C02', type: 'Outside Branch', isActive: true }
];

// Shipments data
const shipmentsData = [
    {
        id: 1,
        customer: 'Viraj Javeri',
        customerPhone: '9090909090',
        order: '#1652AVER1761',
        courier: 'Fedex',
        courierTracking: '7163485949927161',
        confirmation: 'Order',
        address: 'Address',
        status: 'Customer Rejected',
        statusColor: 'rejected',
        time: '4 hours ago',
        bay: 'A01',
        tag: 'Online'
    },
    {
        id: 2,
        customer: 'Ramoliya Krunal',
        customerPhone: '9090909090',
        order: '#1652AVER1761',
        courier: 'Amazon',
        courierTracking: '7163485949927161',
        confirmation: 'Order',
        address: 'Address',
        status: 'Invalid Address',
        statusColor: 'rejected',
        time: '4 hours ago',
        bay: 'A03',
        tag: 'Delayed'
    },
    {
        id: 3,
        customer: 'Mahesh Savani',
        customerPhone: '9090909090',
        order: '#1652AVER1761',
        courier: 'bewakoof',
        courierTracking: '7163485949927161',
        confirmation: 'Order',
        address: 'Address',
        status: 'Cash Not Ready',
        statusColor: 'pending',
        time: '4 hours ago',
        bay: 'A05',
        tag: 'Early'
    },
    {
        id: 4,
        customer: 'Vidhyut Mava',
        customerPhone: '9090909090',
        order: '#1652AVER1761',
        courier: 'Shopify',
        courierTracking: '7163485949927161',
        confirmation: 'Order',
        address: 'Address',
        status: 'Delivered',
        statusColor: 'delivered',
        time: '4 hours ago',
        bay: 'B01',
        tag: 'Delayed'
    },
    {
        id: 5,
        customer: 'Kavy Ramoliya',
        customerPhone: '9090909090',
        order: '#1652AVER1761',
        courier: 'Amazon',
        courierTracking: '7163485949927161',
        confirmation: 'Order',
        address: 'Address',
        status: 'In Transit',
        statusColor: 'transit',
        time: '4 hours ago',
        bay: 'B03',
        tag: 'Online'
    },
    {
        id: 6,
        customer: 'Nirma Chapani',
        customerPhone: '9090909090',
        order: '#1652AVER1761',
        courier: 'bewakoof',
        courierTracking: '7163485949927161',
        confirmation: 'Order',
        address: 'Address',
        status: 'RTO In Transit',
        statusColor: 'transit',
        time: '4 hours ago',
        bay: 'B05',
        tag: 'Early'
    },
    {
        id: 7,
        customer: 'Avanti Daruwala',
        customerPhone: '9090909090',
        order: '#1652AVER1761',
        courier: 'Shopify',
        courierTracking: '7163485949927161',
        confirmation: 'Order',
        address: 'Address',
        status: 'Delivered',
        statusColor: 'delivered',
        time: '4 hours ago',
        bay: 'C01',
        tag: 'Delayed'
    }
];

// Customers data
const customersData = [
    {
        id: 1,
        name: 'Viraj Javeri',
        phone: '9090909090',
        email: 'viraj@example.com',
        address: '123 Main Street, Mumbai, Maharashtra',
        totalOrders: 15,
        status: 'Active'
    },
    {
        id: 2,
        name: 'Ramoliya Krunal',
        phone: '9090909090',
        email: 'krunal@example.com',
        address: '456 Park Avenue, Delhi, Delhi',
        totalOrders: 8,
        status: 'Active'
    },
    {
        id: 3,
        name: 'Mahesh Savani',
        phone: '9090909090',
        email: 'mahesh@example.com',
        address: '789 Garden Road, Bangalore, Karnataka',
        totalOrders: 22,
        status: 'VIP'
    },
    {
        id: 4,
        name: 'Vidhyut Mava',
        phone: '9090909090',
        email: 'vidhyut@example.com',
        address: '321 Lake View, Chennai, Tamil Nadu',
        totalOrders: 5,
        status: 'New'
    },
    {
        id: 5,
        name: 'Kavy Ramoliya',
        phone: '9090909090',
        email: 'kavy@example.com',
        address: '654 Hill Station, Pune, Maharashtra',
        totalOrders: 12,
        status: 'Active'
    }
];

// Recent activities data
const activitiesData = [
    {
        id: 1,
        type: 'shipment',
        icon: 'fas fa-shipping-fast',
        title: 'New shipment arrived',
        description: 'Shipment #1652AVER1761 for Viraj Javeri has arrived at Bay A01',
        time: '2 minutes ago'
    },
    {
        id: 2,
        type: 'bay',
        icon: 'fas fa-warehouse',
        title: 'Bay allocated',
        description: 'Bay B03 has been allocated to Kavy Ramoliya',
        time: '15 minutes ago'
    },
    {
        id: 3,
        type: 'delivery',
        icon: 'fas fa-check-circle',
        title: 'Delivery completed',
        description: 'Shipment for Avanti Daruwala has been delivered successfully',
        time: '1 hour ago'
    },
    {
        id: 4,
        type: 'customer',
        icon: 'fas fa-user-plus',
        title: 'New customer registered',
        description: 'Ravi Patel has been added to the customer database',
        time: '2 hours ago'
    },
    {
        id: 5,
        type: 'maintenance',
        icon: 'fas fa-tools',
        title: 'Bay maintenance',
        description: 'Bay A04 is scheduled for maintenance',
        time: '3 hours ago'
    }
];

// Statistics data
const statisticsData = {
    totalBays: 24,
    occupiedBays: 18,
    availableBays: 6,
    pendingShipments: 12,
    deliveredToday: 8,
    totalCustomers: 156,
    revenueToday: 45000
};

// Courier options
const courierOptions = ['Fedex', 'Amazon', 'Shopify', 'bewakoof', 'DHL', 'Blue Dart', 'DTDC'];

// Status options
const statusOptions = [
    { value: 'delivered', label: 'Delivered', color: 'delivered' },
    { value: 'transit', label: 'In Transit', color: 'transit' },
    { value: 'pending', label: 'Pending', color: 'pending' },
    { value: 'rejected', label: 'Rejected', color: 'rejected' },
    { value: 'rto', label: 'RTO', color: 'transit' }
];

// Export data for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        baysData,
        shipmentsData,
        customersData,
        activitiesData,
        statisticsData,
        courierOptions,
        statusOptions
    };
}
