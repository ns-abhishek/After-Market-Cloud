// Sample Data for Invoice Management System

// Customer Invoice Sample Data
const customerInvoiceData = [
    {
        id: 'CI0001',
        customerName: 'John Doe',
        paymentMode: 'card',
        date: '2024-01-15',
        workOrder: 'WO0001',
        workOrderDate: '2024-01-10',
        serial: 'SN00000001',
        model: 'Model-A1',
        draftAmount: 1125.00,
        taxAmount: 112.50,
        invoiceAmount: 1237.50,
        sapStatus: 'completed'
    },
    {
        id: 'CI0002',
        customerName: 'Jane Smith',
        paymentMode: 'bank',
        date: '2024-01-16',
        workOrder: 'WO0002',
        workOrderDate: '2024-01-11',
        serial: 'SN00000002',
        model: 'Model-B2',
        draftAmount: 850.00,
        taxAmount: 85.00,
        invoiceAmount: 935.00,
        sapStatus: 'pending'
    },
    {
        id: 'CI0003',
        customerName: 'Bob Johnson',
        paymentMode: 'cash',
        date: '2024-01-17',
        workOrder: 'WO0003',
        workOrderDate: '2024-01-12',
        serial: 'SN00000003',
        model: 'Model-C3',
        draftAmount: 2250.00,
        taxAmount: 225.00,
        invoiceAmount: 2475.00,
        sapStatus: 'active'
    },
    {
        id: 'CI0004',
        customerName: 'Alice Brown',
        paymentMode: 'check',
        date: '2024-01-18',
        workOrder: 'WO0004',
        workOrderDate: '2024-01-13',
        serial: 'SN00000004',
        model: 'Model-D4',
        draftAmount: 1680.00,
        taxAmount: 168.00,
        invoiceAmount: 1848.00,
        sapStatus: 'completed'
    },
    {
        id: 'CI0005',
        customerName: 'Charlie Wilson',
        paymentMode: 'card',
        date: '2024-01-19',
        workOrder: 'WO0005',
        workOrderDate: '2024-01-14',
        serial: 'SN00000005',
        model: 'Model-E5',
        draftAmount: 3200.00,
        taxAmount: 320.00,
        invoiceAmount: 3520.00,
        sapStatus: 'pending'
    }
];

// Service Invoice Return Sample Data
const serviceReturnData = [
    {
        id: 'SRV0001',
        customerInvoice: 'CI0001',
        returnDate: '2024-01-20',
        isFullReturn: true,
        serial: 'SN00000001',
        model: 'Model-A1',
        customerName: 'John Doe',
        generatedThrough: 'manual',
        creditAmount: 1237.50
    },
    {
        id: 'SRV0002',
        customerInvoice: 'CI0002',
        returnDate: '2024-01-21',
        isFullReturn: false,
        serial: 'SN00000002',
        model: 'Model-B2',
        customerName: 'Jane Smith',
        generatedThrough: 'automatic',
        creditAmount: 467.50
    },
    {
        id: 'SRV0003',
        customerInvoice: 'CI0003',
        returnDate: '2024-01-22',
        isFullReturn: false,
        serial: 'SN00000003',
        model: 'Model-C3',
        customerName: 'Bob Johnson',
        generatedThrough: 'system',
        creditAmount: 825.00
    },
    {
        id: 'SRV0004',
        customerInvoice: 'CI0004',
        returnDate: '2024-01-23',
        isFullReturn: true,
        serial: 'SN00000004',
        model: 'Model-D4',
        customerName: 'Alice Brown',
        generatedThrough: 'manual',
        creditAmount: 1848.00
    }
];

// Internal Invoice Sample Data
const internalInvoiceData = [
    {
        id: 'II0001',
        customerAccount: 'ACC001',
        customerName: 'Internal Dept A',
        date: '2024-01-15',
        workOrder: 'WO0101',
        workOrderDate: '2024-01-10',
        serial: 'SN10000001',
        model: 'Internal-A1',
        sapStatus: 'completed',
        invoiceAmount: 5500.00,
        branch: 'satisfaction'
    },
    {
        id: 'II0002',
        customerAccount: 'ACC002',
        customerName: 'Internal Dept B',
        date: '2024-01-16',
        workOrder: 'WO0102',
        workOrderDate: '2024-01-11',
        serial: 'SN10000002',
        model: 'Internal-B2',
        sapStatus: 'pending',
        invoiceAmount: 3200.00,
        branch: 'rework'
    },
    {
        id: 'II0003',
        customerAccount: 'ACC003',
        customerName: 'Internal Dept C',
        date: '2024-01-17',
        workOrder: 'WO0103',
        workOrderDate: '2024-01-12',
        serial: 'SN10000003',
        model: 'Internal-C3',
        sapStatus: 'active',
        invoiceAmount: 7800.00,
        branch: 'main'
    },
    {
        id: 'II0004',
        customerAccount: 'ACC004',
        customerName: 'Internal Dept D',
        date: '2024-01-18',
        workOrder: 'WO0104',
        workOrderDate: '2024-01-13',
        serial: 'SN10000004',
        model: 'Internal-D4',
        sapStatus: 'completed',
        invoiceAmount: 4100.00,
        branch: 'satisfaction'
    }
];

// Internal Invoice Return Sample Data
const internalReturnData = [
    {
        id: 'IR0001',
        returnDate: '2024-01-20',
        internalInvoice: 'II0001',
        isFullReturn: true,
        customerName: 'Internal Dept A',
        serial: 'SN10000001',
        model: 'Internal-A1'
    },
    {
        id: 'IR0002',
        returnDate: '2024-01-21',
        internalInvoice: 'II0002',
        isFullReturn: false,
        customerName: 'Internal Dept B',
        serial: 'SN10000002',
        model: 'Internal-B2'
    },
    {
        id: 'IR0003',
        returnDate: '2024-01-22',
        internalInvoice: 'II0003',
        isFullReturn: false,
        customerName: 'Internal Dept C',
        serial: 'SN10000003',
        model: 'Internal-C3'
    }
];

// Dashboard Statistics Data
const dashboardStats = {
    totalInvoices: 248,
    totalRevenue: 125430,
    pendingReturns: 35,
    completionRate: 92,
    monthlyData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        revenue: [28500, 32100, 29800, 35030, 31200, 38500],
        invoices: [45, 52, 48, 58, 51, 62]
    },
    statusDistribution: {
        completed: 124,
        pending: 35,
        active: 67,
        cancelled: 22
    },
    paymentMethods: {
        card: 45,
        bank: 30,
        cash: 15,
        check: 10
    }
};

// Recent Activity Data
const recentActivity = [
    {
        type: 'invoice',
        icon: 'fas fa-file-invoice',
        title: 'New customer invoice created',
        description: 'Invoice CI0248 for John Doe - $1,250.00',
        time: '2 minutes ago',
        color: 'primary'
    },
    {
        type: 'payment',
        icon: 'fas fa-credit-card',
        title: 'Payment received',
        description: 'Payment for Invoice CI0247 - $850.00',
        time: '15 minutes ago',
        color: 'success'
    },
    {
        type: 'return',
        icon: 'fas fa-undo-alt',
        title: 'Service return processed',
        description: 'Return SRV001 for Model-A123 completed',
        time: '1 hour ago',
        color: 'warning'
    },
    {
        type: 'email',
        icon: 'fas fa-envelope',
        title: 'Invoice email sent',
        description: 'Invoice CI0246 sent to jane.smith@email.com',
        time: '2 hours ago',
        color: 'info'
    },
    {
        type: 'update',
        icon: 'fas fa-edit',
        title: 'Invoice updated',
        description: 'Invoice CI0245 status changed to completed',
        time: '3 hours ago',
        color: 'secondary'
    }
];

// Export sample data
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        customerInvoiceData,
        serviceReturnData,
        internalInvoiceData,
        internalReturnData,
        dashboardStats,
        recentActivity
    };
}

// Make data available globally for browser use
if (typeof window !== 'undefined') {
    window.sampleData = {
        customerInvoiceData,
        serviceReturnData,
        internalInvoiceData,
        internalReturnData,
        dashboardStats,
        recentActivity
    };
}

// Utility functions for data manipulation
function generateRandomInvoiceData(count = 50, type = 'customer') {
    const data = [];
    const customers = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson', 'Diana Prince', 'Bruce Wayne', 'Clark Kent'];
    const paymentModes = ['cash', 'card', 'bank', 'check'];
    const statuses = ['active', 'pending', 'completed', 'cancelled'];
    const branches = ['satisfaction', 'rework', 'main'];
    const generatedThrough = ['manual', 'automatic', 'system'];

    for (let i = 1; i <= count; i++) {
        const baseAmount = Math.floor(Math.random() * 5000) + 500;
        const taxAmount = baseAmount * 0.1;
        const totalAmount = baseAmount + taxAmount;

        let record = {
            id: `${type.toUpperCase().substring(0, 2)}${String(i).padStart(4, '0')}`,
            customerName: customers[Math.floor(Math.random() * customers.length)],
            date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
            serial: `SN${String(i).padStart(8, '0')}`,
            model: `Model-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${i}`
        };

        switch (type) {
            case 'customer':
                record = {
                    ...record,
                    paymentMode: paymentModes[Math.floor(Math.random() * paymentModes.length)],
                    workOrder: `WO${String(i).padStart(4, '0')}`,
                    workOrderDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
                    draftAmount: baseAmount,
                    taxAmount: taxAmount,
                    invoiceAmount: totalAmount,
                    sapStatus: statuses[Math.floor(Math.random() * statuses.length)]
                };
                break;

            case 'service-return':
                record = {
                    ...record,
                    customerInvoice: `CI${String(Math.floor(Math.random() * 100) + 1).padStart(4, '0')}`,
                    returnDate: record.date,
                    isFullReturn: Math.random() > 0.6,
                    generatedThrough: generatedThrough[Math.floor(Math.random() * generatedThrough.length)],
                    creditAmount: Math.floor(Math.random() * 2000) + 200
                };
                delete record.date;
                break;

            case 'internal':
                record = {
                    ...record,
                    customerAccount: `ACC${String(i).padStart(3, '0')}`,
                    workOrder: `WO${String(i).padStart(4, '0')}`,
                    workOrderDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
                    sapStatus: statuses[Math.floor(Math.random() * statuses.length)],
                    invoiceAmount: totalAmount,
                    branch: branches[Math.floor(Math.random() * branches.length)]
                };
                break;

            case 'internal-return':
                record = {
                    ...record,
                    returnDate: record.date,
                    internalInvoice: `II${String(Math.floor(Math.random() * 100) + 1).padStart(4, '0')}`,
                    isFullReturn: Math.random() > 0.5
                };
                delete record.date;
                break;
        }

        data.push(record);
    }

    return data;
}

// Data validation functions
function validateInvoiceData(data, type) {
    const requiredFields = {
        customer: ['id', 'customerName', 'paymentMode', 'date', 'invoiceAmount'],
        'service-return': ['id', 'customerInvoice', 'returnDate', 'serial', 'model'],
        internal: ['id', 'customerAccount', 'customerName', 'date', 'invoiceAmount'],
        'internal-return': ['id', 'returnDate', 'internalInvoice', 'serial', 'model']
    };

    const fields = requiredFields[type] || [];

    return data.every(record => {
        return fields.every(field => record.hasOwnProperty(field) && record[field] !== null && record[field] !== '');
    });
}

// Data export functions
function exportToCSV(data, filename) {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Make utility functions available globally
if (typeof window !== 'undefined') {
    window.dataUtils = {
        generateRandomInvoiceData,
        validateInvoiceData,
        exportToCSV
    };
}
