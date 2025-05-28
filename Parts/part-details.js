$(document).ready(function () {
    // Get part ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const partId = urlParams.get('id');

    // Image Gallery Variables - Initialize at top level
    let currentImages = [];
    let currentImageIndex = 0;
    let currentZoom = 1;
    let currentRotation = 0;

    // Sample detailed part data
    const partDetails = {
        '0000052': {
            id: '0000052',
            prefix: 'OEM',
            description: 'TWINE GUIDE',
            category: 'Accessory (Outside)',
            partType: 'Core',
            partFunctionGroup: 'Electrical',
            uom: 'Each',
            isComponent: true,
            isActive: true,
            aliasPartNumber: 'ALT-0000052',
            aliasPartPrefix: 'ALT',
            weight: '2.5 kg',
            exciseTariffCode: 'ETA3',
            partsDisposition: 'Inspection',
            movement: 'Fast',
            salvagePartNumber: 'SAL-0000052',
            salvagePartPrefix: 'SAL',
            dimension: '15cm x 10cm x 5cm',
            supersessionDetails: 'Replaced by OEM-0000053',
            isHazardous: false,
            isPartOfKit: false,
            isKitPart: false,
            isLocal: false,
            currentStock: 150,
            lastPrice: 100.00,
            lastUpdated: '01-Nov-2023',
            suppliers: 2,
            stockDetails: [
                {
                    id: 'stock_001',
                    branchName: 'Branch 11',
                    binLocation: 'Bin',
                    warehouse: '177N-177N',
                    availableStock: 0.00,
                    binStock: 0.00,
                    totalStock: 0.00,
                    serialNumber: 0,
                    damagedQuantity: 2.00,
                    firstDemandDate: '15-Jan-2024',
                    lastDemandDate: '28-Jan-2024',
                    firstIssuedDate: '10-Jan-2024',
                    lastIssuedDate: '25-Jan-2024',
                    lastStockCheckDate: '01-Feb-2024'
                },
                {
                    id: 'stock_002',
                    branchName: 'Branch 11',
                    binLocation: 'No bin',
                    warehouse: '177N-NB21',
                    availableStock: 0.00,
                    binStock: 0.00,
                    totalStock: 0.00,
                    serialNumber: 0,
                    damagedQuantity: 0.00,
                    firstDemandDate: '20-Jan-2024',
                    lastDemandDate: '30-Jan-2024',
                    firstIssuedDate: '18-Jan-2024',
                    lastIssuedDate: '29-Jan-2024',
                    lastStockCheckDate: '02-Feb-2024'
                },
                {
                    id: 'stock_003',
                    branchName: 'Branch 12',
                    binLocation: 'Bin A1',
                    warehouse: '178N-A1B2',
                    availableStock: 15.00,
                    binStock: 15.00,
                    totalStock: 15.00,
                    serialNumber: 3,
                    damagedQuantity: 1.00,
                    firstDemandDate: '05-Jan-2024',
                    lastDemandDate: '02-Feb-2024',
                    firstIssuedDate: '08-Jan-2024',
                    lastIssuedDate: '01-Feb-2024',
                    lastStockCheckDate: '03-Feb-2024'
                },
                {
                    id: 'stock_004',
                    branchName: 'Branch 13',
                    binLocation: 'Bin C3',
                    warehouse: '179N-C3D4',
                    availableStock: 25.00,
                    binStock: 25.00,
                    totalStock: 25.00,
                    serialNumber: 8,
                    damagedQuantity: 0.00,
                    firstDemandDate: '12-Jan-2024',
                    lastDemandDate: '31-Jan-2024',
                    firstIssuedDate: '15-Jan-2024',
                    lastIssuedDate: '30-Jan-2024',
                    lastStockCheckDate: '04-Feb-2024'
                }
            ],
            priceDetails: [
                {
                    id: 'price_001',
                    listPrice: 100.00,
                    costPrice: 95.00,
                    effectiveFrom: '01-Nov-2023',
                    customerWarranty: 'Standard Warranty',
                    buyingCurrency: 'USD',
                    customerType: 'Retail',
                    priceType: 'Standard',
                    discountPercent: 5.0,
                    validUntil: '31-Dec-2024',
                    modifiedBy: 'admin',
                    modifiedDate: '01-Nov-2023'
                },
                {
                    id: 'price_002',
                    listPrice: 95.00,
                    costPrice: 90.00,
                    effectiveFrom: '15-Oct-2023',
                    customerWarranty: 'Extended Warranty',
                    buyingCurrency: 'EUR',
                    customerType: 'Wholesale',
                    priceType: 'Bulk',
                    discountPercent: 10.0,
                    validUntil: '30-Jun-2024',
                    modifiedBy: 'manager',
                    modifiedDate: '15-Oct-2023'
                },
                {
                    id: 'price_003',
                    listPrice: 110.00,
                    costPrice: 105.00,
                    effectiveFrom: '01-Sep-2023',
                    customerWarranty: 'Premium Warranty',
                    buyingCurrency: 'CAD',
                    customerType: 'Premium',
                    priceType: 'Premium',
                    discountPercent: 0.0,
                    validUntil: '31-Mar-2024',
                    modifiedBy: 'supervisor',
                    modifiedDate: '01-Sep-2023'
                },
                {
                    id: 'price_004',
                    listPrice: 85.00,
                    costPrice: 80.00,
                    effectiveFrom: '01-Aug-2023',
                    customerWarranty: 'Basic Warranty',
                    buyingCurrency: 'USD',
                    customerType: 'Government',
                    priceType: 'Contract',
                    discountPercent: 15.0,
                    validUntil: '31-Jul-2024',
                    modifiedBy: 'admin',
                    modifiedDate: '01-Aug-2023'
                },
                {
                    id: 'price_005',
                    listPrice: 120.00,
                    costPrice: 115.00,
                    effectiveFrom: '15-Jul-2023',
                    customerWarranty: 'Express Warranty',
                    buyingCurrency: 'GBP',
                    customerType: 'Express',
                    priceType: 'Rush',
                    discountPercent: 0.0,
                    validUntil: '15-Jan-2024',
                    modifiedBy: 'sales_manager',
                    modifiedDate: '15-Jul-2023'
                }
            ],

            manufacturerDetails: [
                {
                    id: 'mfg_001',
                    manufacturer: 'Cummins Inc.',
                    prefix: 'OEM',
                    manufacturerPart: '0000052',
                    buyingCurrency: 'CAD',
                    stdPackQty: 100,
                    rushOrderYSO: 'Yes',
                    partnerNetPrice: 95.00,
                    lastInvoiceDate: '15-Oct-2023',
                    effectiveFrom: '01-Oct-2023',
                    manufacturerWarrantyDays: 365,
                    isWarrantyIntimation: true,
                    firstGRNDate: '05-Oct-2023',
                    lastGRNDate: '10-Oct-2023',
                    replenishmentOrderYTA: 'Yes',
                    stockOrderYEA: 'No',
                    contactPerson: 'John Smith',
                    contactEmail: 'john.smith@cummins.com',
                    contactPhone: '+1-555-0123',
                    leadTime: '14 days',
                    minimumOrderQty: 50,
                    status: 'Active'
                },
                {
                    id: 'mfg_002',
                    manufacturer: 'Caterpillar Inc.',
                    prefix: 'CAT',
                    manufacturerPart: 'CAT-52001',
                    buyingCurrency: 'USD',
                    stdPackQty: 75,
                    rushOrderYSO: 'No',
                    partnerNetPrice: 98.50,
                    lastInvoiceDate: '20-Sep-2023',
                    effectiveFrom: '15-Sep-2023',
                    manufacturerWarrantyDays: 180,
                    isWarrantyIntimation: false,
                    firstGRNDate: '18-Sep-2023',
                    lastGRNDate: '25-Sep-2023',
                    replenishmentOrderYTA: 'No',
                    stockOrderYEA: 'Yes',
                    contactPerson: 'Sarah Johnson',
                    contactEmail: 'sarah.johnson@cat.com',
                    contactPhone: '+1-555-0456',
                    leadTime: '21 days',
                    minimumOrderQty: 25,
                    status: 'Active'
                },
                {
                    id: 'mfg_003',
                    manufacturer: 'Volvo Group',
                    prefix: 'VOL',
                    manufacturerPart: 'VOL-TG052',
                    buyingCurrency: 'EUR',
                    stdPackQty: 60,
                    rushOrderYSO: 'Yes',
                    partnerNetPrice: 102.75,
                    lastInvoiceDate: '05-Aug-2023',
                    effectiveFrom: '01-Aug-2023',
                    manufacturerWarrantyDays: 730,
                    isWarrantyIntimation: true,
                    firstGRNDate: '03-Aug-2023',
                    lastGRNDate: '08-Aug-2023',
                    replenishmentOrderYTA: 'Yes',
                    stockOrderYEA: 'No',
                    contactPerson: 'Erik Andersson',
                    contactEmail: 'erik.andersson@volvo.com',
                    contactPhone: '+46-31-123456',
                    leadTime: '28 days',
                    minimumOrderQty: 30,
                    status: 'Active'
                },
                {
                    id: 'mfg_004',
                    manufacturer: 'Detroit Diesel',
                    prefix: 'DD',
                    manufacturerPart: 'DD-052TG',
                    buyingCurrency: 'USD',
                    stdPackQty: 80,
                    rushOrderYSO: 'No',
                    partnerNetPrice: 89.25,
                    lastInvoiceDate: '12-Jul-2023',
                    effectiveFrom: '10-Jul-2023',
                    manufacturerWarrantyDays: 365,
                    isWarrantyIntimation: false,
                    firstGRNDate: '14-Jul-2023',
                    lastGRNDate: '18-Jul-2023',
                    replenishmentOrderYTA: 'No',
                    stockOrderYEA: 'Yes',
                    contactPerson: 'Michael Brown',
                    contactEmail: 'michael.brown@detroitdiesel.com',
                    contactPhone: '+1-555-0789',
                    leadTime: '10 days',
                    minimumOrderQty: 40,
                    status: 'Inactive'
                }
            ],
            competitorPriceDetails: [
                {
                    id: 'comp_001',
                    competitorName: 'AutoZone Parts',
                    netRate: 90.00,
                    costPrice: 85.00,
                    effectiveFrom: '01-Sep-2023',
                    remarks: 'Special discount applied for bulk orders',
                    modifiedBy: 'admin',
                    modifiedDate: '10-Sep-2023',
                    currency: 'USD',
                    availability: 'In Stock',
                    leadTime: '3-5 days',
                    minimumOrderQty: 10,
                    contactInfo: 'sales@autozone.com',
                    lastUpdated: '15-Sep-2023'
                },
                {
                    id: 'comp_002',
                    competitorName: 'NAPA Auto Parts',
                    netRate: 92.00,
                    costPrice: 88.00,
                    effectiveFrom: '01-Oct-2023',
                    remarks: 'Standard pricing with warranty',
                    modifiedBy: 'user1',
                    modifiedDate: '05-Oct-2023',
                    currency: 'USD',
                    availability: 'Limited Stock',
                    leadTime: '7-10 days',
                    minimumOrderQty: 5,
                    contactInfo: 'orders@napaparts.com',
                    lastUpdated: '08-Oct-2023'
                },
                {
                    id: 'comp_003',
                    competitorName: 'O\'Reilly Auto Parts',
                    netRate: 87.50,
                    costPrice: 82.00,
                    effectiveFrom: '15-Aug-2023',
                    remarks: 'Competitive pricing with fast shipping',
                    modifiedBy: 'manager',
                    modifiedDate: '20-Aug-2023',
                    currency: 'USD',
                    availability: 'In Stock',
                    leadTime: '2-4 days',
                    minimumOrderQty: 1,
                    contactInfo: 'support@oreillyauto.com',
                    lastUpdated: '25-Aug-2023'
                },
                {
                    id: 'comp_004',
                    competitorName: 'Advance Auto Parts',
                    netRate: 94.75,
                    costPrice: 90.25,
                    effectiveFrom: '01-Jul-2023',
                    remarks: 'Premium quality with extended warranty',
                    modifiedBy: 'supervisor',
                    modifiedDate: '05-Jul-2023',
                    currency: 'USD',
                    availability: 'In Stock',
                    leadTime: '1-3 days',
                    minimumOrderQty: 2,
                    contactInfo: 'business@advanceautoparts.com',
                    lastUpdated: '10-Jul-2023'
                },
                {
                    id: 'comp_005',
                    competitorName: 'Parts Authority',
                    netRate: 96.00,
                    costPrice: 91.50,
                    effectiveFrom: '15-Jun-2023',
                    remarks: 'OEM quality replacement parts',
                    modifiedBy: 'admin',
                    modifiedDate: '20-Jun-2023',
                    currency: 'USD',
                    availability: 'Back Order',
                    leadTime: '14-21 days',
                    minimumOrderQty: 25,
                    contactInfo: 'wholesale@partsauthority.com',
                    lastUpdated: '25-Jun-2023'
                },
                {
                    id: 'comp_006',
                    competitorName: 'Euro Car Parts',
                    netRate: 78.50,
                    costPrice: 74.00,
                    effectiveFrom: '01-May-2023',
                    remarks: 'European supplier with competitive rates',
                    modifiedBy: 'procurement',
                    modifiedDate: '05-May-2023',
                    currency: 'EUR',
                    availability: 'In Stock',
                    leadTime: '5-7 days',
                    minimumOrderQty: 15,
                    contactInfo: 'orders@eurocarparts.com',
                    lastUpdated: '10-May-2023'
                }
            ],
            assetDetails: [
                {
                    id: 'asset_001',
                    brand: 'Cummins',
                    assetType: 'Bus',
                    model: 'Model X35',
                    fromVin: '1HGCM82633A004352',
                    toVin: '1HGCM82633A004400',
                    yearRange: '2020-2023',
                    engineType: 'ISX15',
                    fuelType: 'Diesel',
                    compatibility: 'Direct Fit',
                    notes: 'Compatible with all X35 models',
                    status: 'Active'
                },
                {
                    id: 'asset_002',
                    brand: 'Volvo',
                    assetType: 'Truck',
                    model: 'FH16',
                    fromVin: 'YV2AG20A1BB567890',
                    toVin: 'YV2AG20A1BB567900',
                    yearRange: '2019-2022',
                    engineType: 'D16K',
                    fuelType: 'Diesel',
                    compatibility: 'Direct Fit',
                    notes: 'European specification trucks',
                    status: 'Active'
                },
                {
                    id: 'asset_003',
                    brand: 'Freightliner',
                    assetType: 'Truck',
                    model: 'Cascadia',
                    fromVin: '1FUJGHDV8DLBX1001',
                    toVin: '1FUJGHDV8DLBX1100',
                    yearRange: '2021-2024',
                    engineType: 'DD15',
                    fuelType: 'Diesel',
                    compatibility: 'Direct Fit',
                    notes: 'North American specification',
                    status: 'Active'
                },
                {
                    id: 'asset_004',
                    brand: 'Peterbilt',
                    assetType: 'Truck',
                    model: '579',
                    fromVin: '1XPWD40X1ED215001',
                    toVin: '1XPWD40X1ED215200',
                    yearRange: '2018-2023',
                    engineType: 'MX-13',
                    fuelType: 'Diesel',
                    compatibility: 'Requires Adapter',
                    notes: 'Adapter kit required for installation',
                    status: 'Active'
                },
                {
                    id: 'asset_005',
                    brand: 'Kenworth',
                    assetType: 'Truck',
                    model: 'T680',
                    fromVin: '1XKWD40X5JJ123001',
                    toVin: '1XKWD40X5JJ123150',
                    yearRange: '2020-2024',
                    engineType: 'PACCAR MX-11',
                    fuelType: 'Diesel',
                    compatibility: 'Direct Fit',
                    notes: 'Latest generation T680 models',
                    status: 'Active'
                },
                {
                    id: 'asset_006',
                    brand: 'Mack',
                    assetType: 'Truck',
                    model: 'Anthem',
                    fromVin: '1M1AW07Y5KM001001',
                    toVin: '1M1AW07Y5KM001075',
                    yearRange: '2019-2023',
                    engineType: 'MP8',
                    fuelType: 'Diesel',
                    compatibility: 'Direct Fit',
                    notes: 'Mack proprietary engine systems',
                    status: 'Active'
                },
                {
                    id: 'asset_007',
                    brand: 'International',
                    assetType: 'Bus',
                    model: 'IC Bus CE',
                    fromVin: '1HVBBABN8KH001001',
                    toVin: '1HVBBABN8KH001050',
                    yearRange: '2021-2024',
                    engineType: 'MaxxForce 7',
                    fuelType: 'Diesel',
                    compatibility: 'Direct Fit',
                    notes: 'School bus applications',
                    status: 'Active'
                },
                {
                    id: 'asset_008',
                    brand: 'Blue Bird',
                    assetType: 'Bus',
                    model: 'Vision',
                    fromVin: '1BAANC1A8KF001001',
                    toVin: '1BAANC1A8KF001025',
                    yearRange: '2020-2023',
                    engineType: 'Cummins L9',
                    fuelType: 'CNG',
                    compatibility: 'Special Order',
                    notes: 'CNG fuel system compatibility',
                    status: 'Limited'
                }
            ],
            images: [
                {
                    id: 'front',
                    title: 'Front View',
                    url: 'Images/image1.png',
                    thumbnail: 'Images/image1.png',
                    category: 'front',
                    description: 'Front view of the part',
                    size: '1920x1080',
                    format: 'JPG',
                    fileSize: '2.3 MB',
                    uploadDate: '01-Dec-2023'
                },
                {
                    id: 'back',
                    title: 'Back View',
                    url: 'Images/image2.png',
                    thumbnail: 'Images/image2.png',
                    category: 'back',
                    description: 'Back view of the part',
                    size: '1920x1080',
                    format: 'JPG',
                    fileSize: '1.8 MB',
                    uploadDate: '01-Dec-2023'
                },
                {
                    id: 'side',
                    title: 'Side View',
                    url: 'Images/image3.png',
                    thumbnail: 'Images/image3.png',
                    category: 'side',
                    description: 'Side view of the part',
                    size: '1920x1080',
                    format: 'JPG',
                    fileSize: '2.1 MB',
                    uploadDate: '01-Dec-2023'
                },
                {
                    id: 'detail',
                    title: 'Detail View',
                    url: 'Images/image4.png',
                    thumbnail: 'Images/image4.png',
                    category: 'detail',
                    description: 'Detailed close-up view',
                    size: '1920x1080',
                    format: 'JPG',
                    fileSize: '3.2 MB',
                    uploadDate: '01-Dec-2023'
                },
                {
                    id: 'technical',
                    title: 'Technical Drawing',
                    url: 'Images/image1.png',
                    thumbnail: 'Images/image1.png',
                    category: 'technical',
                    description: 'Technical specifications drawing',
                    size: '1920x1080',
                    format: 'PDF',
                    fileSize: '1.5 MB',
                    uploadDate: '01-Dec-2023'
                },
                {
                    id: 'packaging',
                    title: 'Packaging',
                    url: 'Images/image1.png',
                    thumbnail: 'Images/image1.png',
                    category: 'packaging',
                    description: 'Part packaging view',
                    size: '1920x1080',
                    format: 'JPG',
                    fileSize: '1.9 MB',
                    uploadDate: '01-Dec-2023'
                }
            ],
            attachments: [
                {
                    id: 'file_001',
                    fileName: 'twine-guide-manual.pdf',
                    fileDescription: 'Installation and Maintenance Manual',
                    fileType: 'PDF',
                    fileSize: '2.5 MB',
                    uploadedBy: 'admin',
                    uploadDate: '01-Dec-2023 04:59 AM',
                    category: 'Manual',
                    downloadCount: 45,
                    lastAccessed: '15-Dec-2023',
                    tags: ['manual', 'installation', 'maintenance'],
                    isPublic: true,
                    version: '1.2'
                },
                {
                    id: 'file_002',
                    fileName: 'twine-guide-specifications.xlsx',
                    fileDescription: 'Technical Specifications Sheet',
                    fileType: 'Excel',
                    fileSize: '1.8 MB',
                    uploadedBy: 'engineer',
                    uploadDate: '28-Nov-2023 02:30 PM',
                    category: 'Specification',
                    downloadCount: 23,
                    lastAccessed: '12-Dec-2023',
                    tags: ['specifications', 'technical', 'dimensions'],
                    isPublic: false,
                    version: '2.1'
                },
                {
                    id: 'file_003',
                    fileName: 'twine-guide-warranty.pdf',
                    fileDescription: 'Warranty Information and Terms',
                    fileType: 'PDF',
                    fileSize: '850 KB',
                    uploadedBy: 'support',
                    uploadDate: '25-Nov-2023 10:15 AM',
                    category: 'Warranty',
                    downloadCount: 67,
                    lastAccessed: '18-Dec-2023',
                    tags: ['warranty', 'terms', 'conditions'],
                    isPublic: true,
                    version: '1.0'
                },
                {
                    id: 'file_004',
                    fileName: 'twine-guide-installation-video.mp4',
                    fileDescription: 'Step-by-step Installation Video',
                    fileType: 'Video',
                    fileSize: '45.2 MB',
                    uploadedBy: 'training',
                    uploadDate: '20-Nov-2023 03:45 PM',
                    category: 'Training',
                    downloadCount: 89,
                    lastAccessed: '19-Dec-2023',
                    tags: ['video', 'installation', 'tutorial'],
                    isPublic: true,
                    version: '1.0'
                },
                {
                    id: 'file_005',
                    fileName: 'twine-guide-cad-drawing.dwg',
                    fileDescription: 'CAD Drawing File',
                    fileType: 'CAD',
                    fileSize: '3.7 MB',
                    uploadedBy: 'designer',
                    uploadDate: '15-Nov-2023 11:20 AM',
                    category: 'Design',
                    downloadCount: 12,
                    lastAccessed: '10-Dec-2023',
                    tags: ['cad', 'drawing', 'design'],
                    isPublic: false,
                    version: '3.0'
                },
                {
                    id: 'file_006',
                    fileName: 'twine-guide-safety-datasheet.pdf',
                    fileDescription: 'Material Safety Data Sheet',
                    fileType: 'PDF',
                    fileSize: '1.2 MB',
                    uploadedBy: 'safety',
                    uploadDate: '10-Nov-2023 09:00 AM',
                    category: 'Safety',
                    downloadCount: 34,
                    lastAccessed: '16-Dec-2023',
                    tags: ['safety', 'msds', 'material'],
                    isPublic: true,
                    version: '1.1'
                },
                {
                    id: 'file_007',
                    fileName: 'twine-guide-quality-certificate.pdf',
                    fileDescription: 'Quality Assurance Certificate',
                    fileType: 'PDF',
                    fileSize: '950 KB',
                    uploadedBy: 'quality',
                    uploadDate: '05-Nov-2023 01:30 PM',
                    category: 'Certificate',
                    downloadCount: 56,
                    lastAccessed: '17-Dec-2023',
                    tags: ['quality', 'certificate', 'assurance'],
                    isPublic: true,
                    version: '1.0'
                },
                {
                    id: 'file_008',
                    fileName: 'twine-guide-compatibility-chart.png',
                    fileDescription: 'Vehicle Compatibility Chart',
                    fileType: 'Image',
                    fileSize: '2.1 MB',
                    uploadedBy: 'technical',
                    uploadDate: '01-Nov-2023 08:45 AM',
                    category: 'Reference',
                    downloadCount: 78,
                    lastAccessed: '20-Dec-2023',
                    tags: ['compatibility', 'chart', 'vehicles'],
                    isPublic: true,
                    version: '2.0'
                }
            ],
            recentActivity: [
                {
                    type: 'edit',
                    title: 'Part updated',
                    time: '2 hours ago',
                    icon: 'edit',
                    color: 'primary'
                },
                {
                    type: 'stock',
                    title: 'Stock added',
                    time: '1 day ago',
                    icon: 'add',
                    color: 'success'
                },
                {
                    type: 'price',
                    title: 'Price updated',
                    time: '3 days ago',
                    icon: 'attach_money',
                    color: 'warning'
                }
            ]
        }
    };

    // Initialize the page
    init();

    function init() {
        if (partId && partDetails[partId]) {
            loadPartDetails(partDetails[partId]);
        } else {
            showError('Part not found');
        }

        bindEvents();
        initializeTooltips();
    }

    function loadPartDetails(part) {
        // Update page title
        document.title = `Part ${part.id} - ${part.description}`;

        // Update header information
        $('.part-number').text(`${part.prefix}-${part.id}`);
        $('.part-description').text(part.description);
        $('.part-status-badge').text(part.isActive ? 'Active' : 'Inactive')
            .removeClass('status-active status-inactive')
            .addClass(part.isActive ? 'status-active' : 'status-inactive');

        // Update meta information
        updateMetaInfo(part);

        // Initialize image gallery
        initializeImageGallery(part.images);

        // Update overview tab
        updateOverviewTab(part);

        // Update all tabs using uniform structure
        updateStockTab(part);
        updatePricingTab(part);
        updateManufacturerTab(part);
        updateAssetsTab(part);
        updateCompetitorTab(part);
        updateFilesTab(part);

        // Add fade-in animation
        $('.detail-card').addClass('fade-in-up');
    }

    function updateMetaInfo(part) {
        // Update modern meta cards
        $('#metaPrefix').text(part.prefix);
        $('#metaCategory').text(part.category);
        $('#metaFunction').text(part.partFunctionGroup);
        $('#metaUOM').text(part.uom);

        // Update quick stats
        $('#quickStock').text(`${part.currentStock}`);
        $('#quickPrice').text(`$${part.lastPrice.toFixed(2)}`);
        $('#quickMovement').text(part.movement);
        $('#quickStatus').text(part.isActive ? 'Active' : 'Inactive');
    }

    function updateOverviewTab(part) {
        // Update Part Information fields dynamically
        updatePartInformation(part);

        // Update quick stats
        const statItems = $('#overview .stat-item');
        statItems.eq(0).find('.stat-value').text(`${part.currentStock} units`);
        statItems.eq(1).find('.stat-value').text(`$${part.lastPrice.toFixed(2)}`);
        statItems.eq(2).find('.stat-value').text(part.lastUpdated);
        statItems.eq(3).find('.stat-value').text(`${part.suppliers} active`);

        // Update recent activity
        updateRecentActivity(part.recentActivity);
    }

    function updatePartInformation(part) {
        // Update all Part Information fields using data from partDetails with ultra-compact layout

        // Primary Information
        $('label:contains("Part Number")').siblings('.info-value-ultra-compact').text(`${part.id}`);
        $('label:contains("Description")').siblings('.info-value-ultra-compact').text(part.description);
        $('label:contains("Category")').siblings('.info-value-ultra-compact').text(part.category);
        $('label:contains("Type")').siblings('.info-value-ultra-compact').text(part.partType);

        // Classification
        $('label:contains("Component?")').siblings('.info-value-ultra-compact').html(
            `<span class="badge ${part.isComponent ? 'bg-success' : 'bg-secondary'}">${part.isComponent ? 'Yes' : 'No'}</span>`
        );
        $('label:contains("Active?")').siblings('.info-value-ultra-compact').html(
            `<span class="badge ${part.isActive ? 'bg-success' : 'bg-secondary'}">${part.isActive ? 'Yes' : 'No'}</span>`
        );
        $('label:contains("Movement")').siblings('.info-value-ultra-compact').text(part.movement);

        // Physical Properties
        $('label:contains("UOM")').siblings('.info-value-ultra-compact').text(part.uom);
        $('label:contains("Weight")').siblings('.info-value-ultra-compact').text(part.weight);
        $('label:contains("Function Group")').siblings('.info-value-ultra-compact').text(part.partFunctionGroup);

        // Status Flags
        $('label:contains("Hazardous?")').siblings('.info-value-ultra-compact').html(
            `<span class="badge ${part.isHazardous ? 'bg-warning' : 'bg-secondary'}">${part.isHazardous ? 'Yes' : 'No'}</span>`
        );
        $('label:contains("Local?")').siblings('.info-value-ultra-compact').html(
            `<span class="badge ${part.isLocal ? 'bg-success' : 'bg-secondary'}">${part.isLocal ? 'Yes' : 'No'}</span>`
        );
        $('label:contains("Kit Part?")').siblings('.info-value-ultra-compact').html(
            `<span class="badge ${part.isPartOfKit ? 'bg-success' : 'bg-secondary'}">${part.isPartOfKit ? 'Yes' : 'No'}</span>`
        );

        // Additional Information (in collapsible section)
        $('label:contains("Prefix")').siblings('.info-value-ultra-compact').text(part.prefix);
        $('label:contains("Alias Number")').siblings('.info-value-ultra-compact').text(part.aliasPartNumber);
        $('label:contains("Alias Prefix")').siblings('.info-value-ultra-compact').text(part.aliasPartPrefix);
        $('label:contains("Salvage Number")').siblings('.info-value-ultra-compact').text(part.salvagePartNumber);
        $('label:contains("Salvage Prefix")').siblings('.info-value-ultra-compact').text(part.salvagePartPrefix);
        $('label:contains("Tariff Code")').siblings('.info-value-ultra-compact').text(part.exciseTariffCode);
        $('label:contains("Disposition")').siblings('.info-value-ultra-compact').text(part.partsDisposition);
        $('label:contains("Dimension")').siblings('.info-value-ultra-compact').text(part.dimension);
        $('label:contains("Supersession")').siblings('.info-value-ultra-compact').text(part.supersessionDetails);
    }

    function updateRecentActivity(activities) {
        const activityContainer = $('.activity-item').parent();
        activityContainer.empty();

        activities.forEach(activity => {
            const activityItem = $(`
                <div class="activity-item">
                    <div class="activity-icon bg-${activity.color}">
                        <i class="material-icons">${activity.icon}</i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-title">${activity.title}</div>
                        <div class="activity-time">${activity.time}</div>
                    </div>
                </div>
            `);
            activityContainer.append(activityItem);
        });
    }

    // Update Stock Tab using Uniform Structure
    function updateStockTab(part) {
        updateTabWithUniformStructure('stock', part, 'stockDetails', updateStockSummary);
    }

    // Update Pricing Tab using Uniform Structure
    function updatePricingTab(part) {
        updateTabWithUniformStructure('pricing', part, 'priceDetails', updatePricingSummary);
    }

    // Update Manufacturer Tab using Uniform Structure
    function updateManufacturerTab(part) {
        updateTabWithUniformStructure('manufacturer', part, 'manufacturerDetails', updateManufacturerSummary);
    }

    // Update Assets Tab using Uniform Structure
    function updateAssetsTab(part) {
        updateTabWithUniformStructure('assets', part, 'assetDetails', updateAssetsSummary);
    }

    // Update Competitor Tab using Uniform Structure
    function updateCompetitorTab(part) {
        updateTabWithUniformStructure('competitor', part, 'competitorDetails', updateCompetitorSummary);
    }

    // Update Files Tab using Uniform Structure
    function updateFilesTab(part) {
        updateTabWithUniformStructure('files', part, 'fileDetails', updateFilesSummary);
    }

    // Summary update functions for each tab
    function updateStockSummary(stockDetails) {
        if (!stockDetails || !Array.isArray(stockDetails)) return;

        const totalLocations = stockDetails.length;
        const totalStock = stockDetails.reduce((sum, stock) => sum + (stock.totalStock || 0), 0);
        const availableStock = stockDetails.reduce((sum, stock) => sum + (stock.availableStock || 0), 0);
        const lowStockCount = stockDetails.filter(stock => (stock.availableStock || 0) < 10).length;

        $('#totalLocationsValue').text(totalLocations);
        $('#totalStockValue').text(totalStock.toFixed(2));
        $('#availableStockValue').text(availableStock.toFixed(2));
        $('#lowStockValue').text(lowStockCount);
    }

    function updatePricingSummary(priceDetails) {
        if (!priceDetails || !Array.isArray(priceDetails)) return;

        const totalPrices = priceDetails.length;
        const currentPrice = priceDetails.find(p => p.effectiveFrom) || priceDetails[0];
        const pendingPrices = priceDetails.filter(p => new Date(p.effectiveFrom) > new Date()).length;
        const currencies = [...new Set(priceDetails.map(p => p.buyingCurrency))].length;

        $('#totalPricesValue').text(totalPrices);
        $('#currentPriceValue').text(currentPrice ? `$${(currentPrice.listPrice || 0).toFixed(2)}` : '$0.00');
        $('#pendingPricesValue').text(pendingPrices);
        $('#currenciesCount').text(currencies);
    }

    function updateManufacturerSummary(manufacturerDetails) {
        if (!manufacturerDetails || !Array.isArray(manufacturerDetails)) return;

        const totalManufacturers = manufacturerDetails.length;
        const activeManufacturers = manufacturerDetails.filter(m => m.isActive !== false).length;
        const pendingOrders = manufacturerDetails.filter(m => m.pendingOrders > 0).length;
        const totalParts = manufacturerDetails.reduce((sum, m) => sum + (m.totalParts || 1), 0);

        $('#totalManufacturersValue').text(totalManufacturers);
        $('#activeManufacturersValue').text(activeManufacturers);
        $('#pendingOrdersValue').text(pendingOrders);
        $('#totalPartsValue').text(totalParts);
    }

    function updateAssetsSummary(assetDetails) {
        if (!assetDetails || !Array.isArray(assetDetails)) return;

        const totalAssets = assetDetails.length;
        const activeBrands = [...new Set(assetDetails.map(a => a.brand))].length;
        const assetTypes = [...new Set(assetDetails.map(a => a.assetType))].length;
        const models = [...new Set(assetDetails.map(a => a.model))].length;

        $('#totalAssetsValue').text(totalAssets);
        $('#activeBrandsValue').text(activeBrands);
        $('#assetTypesValue').text(assetTypes);
        $('#modelsCount').text(models);
    }

    function updateCompetitorSummary(competitorDetails) {
        if (!competitorDetails || !Array.isArray(competitorDetails)) return;

        const totalCompetitors = competitorDetails.length;
        const bestPrice = Math.min(...competitorDetails.map(c => c.netRate || Infinity));
        const recentUpdates = competitorDetails.filter(c => {
            const updateDate = new Date(c.effectiveFrom);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return updateDate > thirtyDaysAgo;
        }).length;
        const avgPrice = competitorDetails.reduce((sum, c) => sum + (c.netRate || 0), 0) / competitorDetails.length;

        $('#totalCompetitorsValue').text(totalCompetitors);
        $('#bestPriceValue').text(bestPrice === Infinity ? '$0.00' : `$${bestPrice.toFixed(2)}`);
        $('#recentUpdatesValue').text(recentUpdates);
        $('#avgPriceValue').text(`$${(avgPrice || 0).toFixed(2)}`);
    }

    function updateFilesSummary(fileDetails) {
        if (!fileDetails || !Array.isArray(fileDetails)) return;

        const totalFiles = fileDetails.length;
        const imagesCount = fileDetails.filter(f => f.fileType && f.fileType.startsWith('image')).length;
        const documentsCount = fileDetails.filter(f => f.fileType && !f.fileType.startsWith('image')).length;
        const totalSize = fileDetails.reduce((sum, f) => sum + (f.fileSize || 0), 0);

        $('#totalFilesValue').text(totalFiles);
        $('#imagesCountValue').text(imagesCount);
        $('#documentsCountValue').text(documentsCount);
        $('#totalSizeValue').text(formatFileSize(totalSize));
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function bindEvents() {
        // Tab switching with smooth transitions
        $('button[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
            const target = $(e.target.getAttribute('data-bs-target'));
            target.find('.detail-card').addClass('fade-in-up');
        });

        // Print functionality
        $('.btn:contains("Print")').click(function () {
            window.print();
        });

        // Edit part button
        $('.btn:contains("Edit Part")').click(function () {
            editPart(partId);
        });

        // Dropdown actions
        $('.dropdown-item:contains("Duplicate")').click(function () {
            duplicatePart(partId);
        });

        $('.dropdown-item:contains("Archive")').click(function () {
            archivePart(partId);
        });

        $('.dropdown-item:contains("Delete")').click(function () {
            deletePart(partId);
        });
    }

    function initializeTooltips() {
        $('[data-bs-toggle="tooltip"]').tooltip();
    }

    function showError(message) {
        $('.main-content').html(`
            <div class="text-center py-5">
                <i class="material-icons" style="font-size: 4rem; color: #dc3545;">error</i>
                <h3 class="mt-3 text-danger">${message}</h3>
                <p class="text-muted">The requested part could not be found.</p>
                <a href="index.html" class="btn btn-primary">
                    <i class="material-icons me-2">arrow_back</i>Back to Parts List
                </a>
            </div>
        `);
    }

    // Action functions (to be implemented)
    window.editPart = function (partId) {
        console.log('Edit part:', partId);
        // Implementation would go here
    };

    window.editStockEntry = function (stockId) {
        console.log('Edit stock entry:', stockId);
        showNotification(`Edit stock entry: ${stockId}`, 'info');
        // Implementation would go here - could open a modal or navigate to edit page
    };

    window.deleteStockEntry = function (stockId) {
        if (confirm('Are you sure you want to delete this stock entry? This action cannot be undone.')) {
            console.log('Delete stock entry:', stockId);
            showNotification(`Stock entry ${stockId} deleted successfully`, 'success');
            // Implementation would go here
        }
    };

    window.duplicatePart = function (partId) {
        console.log('Duplicate part:', partId);
        // Implementation would go here
    };

    window.archivePart = function (partId) {
        if (confirm('Are you sure you want to archive this part?')) {
            console.log('Archive part:', partId);
            // Implementation would go here
        }
    };

    window.deletePart = function (partId) {
        if (confirm('Are you sure you want to delete this part? This action cannot be undone.')) {
            console.log('Delete part:', partId);
            // Implementation would go here
        }
    };

    window.editStock = function (warehouse) {
        console.log('Edit stock for warehouse:', warehouse);
        // Implementation would go here
    };

    window.editPrice = function (effectiveDate) {
        console.log('Edit price for date:', effectiveDate);
        // Implementation would go here
    };

    window.editManufacturer = function (manufacturer) {
        console.log('Edit manufacturer:', manufacturer);
        // Implementation would go here
    };

    window.editAsset = function (brand) {
        console.log('Edit asset for brand:', brand);
        // Implementation would go here
    };

    window.downloadAttachment = function (fileName) {
        console.log('Download attachment:', fileName);
        // Implementation would go here
    };

    window.deleteAttachment = function (fileName) {
        if (confirm('Are you sure you want to delete this attachment?')) {
            console.log('Delete attachment:', fileName);
            // Implementation would go here
        }
    };

    // Generate All Stock Views Function
    function generateAllStockViews(stock, stockId, stockBadgeClass, damagedBadgeClass, gridContainer, listContainer, cardsContainer, tilesContainer, compactContainer) {
        // Grid View
        const gridItem = $(`
            <div class="stock-grid-item" data-stock-id="${stockId}">
                <div class="selection-checkbox">
                    <input class="form-check-input stock-checkbox" type="checkbox" value="${stockId}">
                </div>
                <div class="stock-grid-header">
                    <h6 class="stock-grid-title">
                        <i class="material-icons location-icon">location_on</i>
                        ${stock.branchName || 'Unknown Branch'}
                    </h6>
                </div>
                <div class="stock-grid-body">
                    <div class="stock-grid-field">
                        <span class="stock-grid-label">Warehouse</span>
                        <span class="stock-grid-value">${stock.warehouse || '-'}</span>
                    </div>
                    <div class="stock-grid-field">
                        <span class="stock-grid-label">Bin Location</span>
                        <span class="stock-grid-value">${stock.binLocation || '-'}</span>
                    </div>
                    <div class="stock-grid-field">
                        <span class="stock-grid-label">Available Stock</span>
                        <span class="stock-grid-value">
                            <span class="badge ${stockBadgeClass}">${(stock.availableStock || 0).toFixed(2)}</span>
                        </span>
                    </div>
                    <div class="stock-grid-field">
                        <span class="stock-grid-label">Total Stock</span>
                        <span class="stock-grid-value">${(stock.totalStock || 0).toFixed(2)}</span>
                    </div>
                </div>
                <div class="stock-grid-footer">
                    <small class="text-muted">Serial: ${stock.serialNumber || '-'}</small>
                    <div class="stock-grid-actions">
                        <button class="btn btn-sm btn-outline-primary" onclick="editStockEntry('${stockId}')" title="Edit">
                            <i class="material-icons">edit</i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteStockEntry('${stockId}')" title="Delete">
                            <i class="material-icons">delete</i>
                        </button>
                    </div>
                </div>
            </div>
        `);
        gridContainer.append(gridItem);

        // List View
        const listItem = $(`
            <div class="stock-list-item" data-stock-id="${stockId}">
                <div class="form-check me-3">
                    <input class="form-check-input stock-checkbox" type="checkbox" value="${stockId}">
                </div>
                <div class="stock-list-content">
                    <div class="stock-list-field">
                        <span class="stock-list-label">Branch & Location</span>
                        <span class="stock-list-value">${stock.branchName || '-'} - ${stock.warehouse || '-'}</span>
                    </div>
                    <div class="stock-list-field">
                        <span class="stock-list-label">Bin Location</span>
                        <span class="stock-list-value">${stock.binLocation || '-'}</span>
                    </div>
                    <div class="stock-list-field">
                        <span class="stock-list-label">Stock Status</span>
                        <span class="stock-list-value">
                            <span class="badge ${stockBadgeClass}">${(stock.availableStock || 0).toFixed(2)} Available</span>
                        </span>
                    </div>
                    <div class="stock-list-actions">
                        <button class="btn btn-sm btn-outline-primary" onclick="editStockEntry('${stockId}')" title="Edit">
                            <i class="material-icons">edit</i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteStockEntry('${stockId}')" title="Delete">
                            <i class="material-icons">delete</i>
                        </button>
                    </div>
                </div>
            </div>
        `);
        listContainer.append(listItem);

        // Bootstrap Cards View
        const cardItem = $(`
            <div class="stock-bootstrap-card" data-stock-id="${stockId}">
                <div class="card-header">
                    <h6 class="card-title">
                        <i class="material-icons warehouse-icon">warehouse</i>
                        ${stock.branchName || 'Unknown Branch'}
                    </h6>
                    <div class="form-check">
                        <input class="form-check-input stock-checkbox" type="checkbox" value="${stockId}">
                    </div>
                </div>
                <div class="card-body">
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">Warehouse</span>
                            <span class="info-value">${stock.warehouse || '-'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Bin Location</span>
                            <span class="info-value">${stock.binLocation || '-'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Serial Number</span>
                            <span class="info-value">${stock.serialNumber || '-'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Last Check</span>
                            <span class="info-value">${stock.lastStockCheckDate || '-'}</span>
                        </div>
                    </div>
                    <div class="stock-metrics">
                        <div class="metric-item">
                            <span class="metric-value">${(stock.availableStock || 0).toFixed(0)}</span>
                            <span class="metric-label">Available</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-value">${(stock.totalStock || 0).toFixed(0)}</span>
                            <span class="metric-label">Total</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-value">${(stock.damagedQuantity || 0).toFixed(0)}</span>
                            <span class="metric-label">Damaged</span>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <small class="text-muted">Updated: ${stock.lastStockCheckDate || 'Never'}</small>
                    <div>
                        <button class="btn btn-sm btn-outline-primary me-1" onclick="editStockEntry('${stockId}')" title="Edit">
                            <i class="material-icons">edit</i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteStockEntry('${stockId}')" title="Delete">
                            <i class="material-icons">delete</i>
                        </button>
                    </div>
                </div>
            </div>
        `);
        cardsContainer.append(cardItem);

        // Tiles View
        const tileItem = $(`
            <div class="stock-tile-item" data-stock-id="${stockId}">
                <div class="selection-checkbox">
                    <input class="form-check-input stock-checkbox" type="checkbox" value="${stockId}">
                </div>
                <div class="stock-tile-header">
                    <h6 class="stock-tile-title">${stock.branchName || 'Unknown Branch'}</h6>
                    <p class="stock-tile-subtitle">${stock.warehouse || '-'}</p>
                </div>
                <div class="stock-tile-content">
                    <div class="stock-tile-row">
                        <span class="stock-tile-label">Bin:</span>
                        <span class="stock-tile-value">${stock.binLocation || '-'}</span>
                    </div>
                    <div class="stock-tile-row">
                        <span class="stock-tile-label">Available:</span>
                        <span class="stock-tile-value">${(stock.availableStock || 0).toFixed(2)}</span>
                    </div>
                    <div class="stock-tile-row">
                        <span class="stock-tile-label">Total:</span>
                        <span class="stock-tile-value">${(stock.totalStock || 0).toFixed(2)}</span>
                    </div>
                </div>
                <div class="stock-tile-actions">
                    <button class="btn btn-xs btn-outline-primary me-1" onclick="editStockEntry('${stockId}')" title="Edit">
                        <i class="material-icons" style="font-size: 14px;">edit</i>
                    </button>
                    <button class="btn btn-xs btn-outline-danger" onclick="deleteStockEntry('${stockId}')" title="Delete">
                        <i class="material-icons" style="font-size: 14px;">delete</i>
                    </button>
                </div>
            </div>
        `);
        tilesContainer.append(tileItem);

        // Compact View
        const compactItem = $(`
            <div class="stock-compact-item" data-stock-id="${stockId}">
                <div class="form-check me-2">
                    <input class="form-check-input stock-checkbox" type="checkbox" value="${stockId}">
                </div>
                <div class="stock-compact-content">
                    <div class="stock-compact-field">
                        <span class="stock-compact-label">Branch</span>
                        <span class="stock-compact-value">${stock.branchName || '-'}</span>
                    </div>
                    <div class="stock-compact-field">
                        <span class="stock-compact-label">Warehouse</span>
                        <span class="stock-compact-value">${stock.warehouse || '-'}</span>
                    </div>
                    <div class="stock-compact-field">
                        <span class="stock-compact-label">Available</span>
                        <span class="stock-compact-value">${(stock.availableStock || 0).toFixed(2)}</span>
                    </div>
                    <div class="stock-compact-field">
                        <span class="stock-compact-label">Total</span>
                        <span class="stock-compact-value">${(stock.totalStock || 0).toFixed(2)}</span>
                    </div>
                    <div class="stock-compact-field">
                        <span class="stock-compact-label">Damaged</span>
                        <span class="stock-compact-value">${(stock.damagedQuantity || 0).toFixed(2)}</span>
                    </div>
                </div>
                <div class="stock-compact-actions">
                    <button class="btn btn-xs btn-outline-primary" onclick="editStockEntry('${stockId}')" title="Edit">
                        <i class="material-icons" style="font-size: 12px;">edit</i>
                    </button>
                    <button class="btn btn-xs btn-outline-danger" onclick="deleteStockEntry('${stockId}')" title="Delete">
                        <i class="material-icons" style="font-size: 12px;">delete</i>
                    </button>
                </div>
            </div>
        `);
        compactContainer.append(compactItem);
    }

    // Stock Summary Update Function
    function updateStockSummary(stockData) {
        try {
            let totalStock = 0;
            let availableStock = 0;
            let damagedStock = 0;
            let locationsCount = stockData.length;

            stockData.forEach(stock => {
                totalStock += parseFloat(stock.totalStock || 0);
                availableStock += parseFloat(stock.availableStock || 0);
                damagedStock += parseFloat(stock.damagedQuantity || 0);
            });

            $('#totalStockValue').text(totalStock.toFixed(0));
            $('#availableStockValue').text(availableStock.toFixed(0));
            $('#damagedStockValue').text(damagedStock.toFixed(0));
            $('#locationsCount').text(locationsCount);
        } catch (error) {
            console.error('Error updating stock summary:', error);
        }
    }

    // Stock Selection Management
    function initializeStockSelection() {
        // Select All functionality
        $('#selectAllStock').off('change').on('change', function() {
            const isChecked = $(this).is(':checked');
            $('.stock-checkbox').prop('checked', isChecked);
            updateSelectionControls();
        });

        // Individual checkbox functionality
        $(document).off('change', '.stock-checkbox').on('change', '.stock-checkbox', function() {
            updateSelectionControls();

            // Update select all checkbox
            const totalCheckboxes = $('.stock-checkbox').length;
            const checkedCheckboxes = $('.stock-checkbox:checked').length;

            $('#selectAllStock').prop('indeterminate', checkedCheckboxes > 0 && checkedCheckboxes < totalCheckboxes);
            $('#selectAllStock').prop('checked', checkedCheckboxes === totalCheckboxes);
        });
    }

    function updateSelectionControls() {
        const selectedCount = $('.stock-checkbox:checked').length;
        const selectionControls = $('#stockSelectionControls');
        const deleteButton = $('#deleteStockEntry');

        if (selectedCount > 0) {
            selectionControls.show();
            deleteButton.show();
            $('#selectedStockCount').text(selectedCount);
        } else {
            selectionControls.hide();
            deleteButton.hide();
        }
    }

    // Clear Selection
    window.clearStockSelection = function() {
        $('.stock-checkbox').prop('checked', false);
        $('#selectAllStock').prop('checked', false).prop('indeterminate', false);
        updateSelectionControls();
    };

    // Delete Selected Stock Entries
    window.deleteSelectedStock = function() {
        const selectedIds = $('.stock-checkbox:checked').map(function() {
            return $(this).val();
        }).get();

        if (selectedIds.length === 0) {
            showNotification('No stock entries selected', 'warning');
            return;
        }

        const confirmMessage = `Are you sure you want to delete ${selectedIds.length} stock ${selectedIds.length === 1 ? 'entry' : 'entries'}? This action cannot be undone.`;

        if (confirm(confirmMessage)) {
            console.log('Delete selected stock entries:', selectedIds);
            showNotification(`${selectedIds.length} stock ${selectedIds.length === 1 ? 'entry' : 'entries'} deleted successfully`, 'success');

            // Remove from UI
            selectedIds.forEach(id => {
                $(`[data-stock-id="${id}"]`).fadeOut(300, function() {
                    $(this).remove();
                });
            });

            clearStockSelection();
            // Implementation would go here to delete from backend
        }
    };

    // Initialize delete button functionality
    $(document).ready(function() {
        $('#deleteStockEntry').off('click').on('click', function() {
            deleteSelectedStock();
        });
    });

    // Image Gallery Functions
    function initializeImageGallery(images) {
        try {
            currentImages = images || [];
            if (images && images.length > 0) {
                // Load the first image as the main image initially
                loadMainImage(images[0]);
                // Setup all thumbnails from partDetails
                setupThumbnails(images);
                // Setup click events for thumbnail selection
                setupImageGalleryEvents();
            } else {
                // Show placeholder if no images
                showImagePlaceholder();
            }
        } catch (error) {
            console.error('Error initializing image gallery:', error);
            showImagePlaceholder();
        }
    }

    function loadMainImage(image) {
        try {
            if (!image || !image.url) {
                console.warn('Invalid image data provided to loadMainImage');
                return;
            }

            const mainImage = $('#mainPartImage');
            if (mainImage.length === 0) {
                console.warn('Main image element not found');
                return;
            }

            // Set the main image URL and title
            mainImage.attr('src', image.url);
            mainImage.attr('alt', image.title || 'Part Image');
            mainImage.attr('title', image.title || 'Part Image');

            // Ensure increased height
            mainImage.css('height', '350px');

            // Update current image index
            currentImageIndex = currentImages.findIndex(img => img.id === image.id);

            // Add loading state and error handling
            mainImage.off('load error').on('load', function () {
                $(this).addClass('loaded');
            }).on('error', function () {
                console.warn('Failed to load image:', image.url);
                // Set fallback image
                $(this).attr('src', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=');
            });

            // Update image info display
            updateImageInfo(image);
        } catch (error) {
            console.error('Error loading main image:', error);
        }
    }

    function updateImageInfo(image) {
        // Update any image info displays
        const imageInfo = {
            title: image.title,
            description: image.description,
            size: image.size,
            format: image.format,
            fileSize: image.fileSize,
            uploadDate: image.uploadDate
        };

        // Store current image info for other functions to use
        window.currentImageInfo = imageInfo;
    }

    function setupThumbnails(images) {
        const thumbnailContainer = $('.thumbnails-ultra-compact');
        thumbnailContainer.empty();

        // Add loading state
        thumbnailContainer.addClass('loading');
        thumbnailContainer.html(`
            <div class="thumbnails-loading">
                <i class="material-icons">refresh</i>
                <span>Loading images...</span>
            </div>
        `);

        // Simulate loading delay and then populate thumbnails
        setTimeout(() => {
            thumbnailContainer.removeClass('loading');
            thumbnailContainer.empty();

            // Create thumbnail for each image in partDetails
            images.forEach((image, index) => {
                const thumbnailItem = $(`
                    <div class="thumbnail-item-ultra-compact ${index === 0 ? 'active' : ''}"
                         data-view="${image.title}"
                         data-image="${image.url}"
                         data-index="${index}"
                         title="${image.title} - ${image.description}">
                        <img src="${image.thumbnail}" alt="${image.title}" loading="lazy">
                    </div>
                `);

                // Add animation delay for staggered effect
                thumbnailItem.css('animation-delay', `${index * 0.1}s`);
                thumbnailContainer.append(thumbnailItem);
            });
        }, 500);
    }

    function showImagePlaceholder() {
        const mainImage = $('#mainPartImage');
        const thumbnailContainer = $('.thumbnails-ultra-compact');

        // Set placeholder for main image
        mainImage.attr('src', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlcyBBdmFpbGFibGU8L3RleHQ+PC9zdmc+');
        mainImage.attr('alt', 'No images available');

        // Show placeholder in thumbnails
        thumbnailContainer.html(`
            <div class="no-images-placeholder">
                <i class="material-icons">image_not_supported</i>
                <span>No images</span>
            </div>
        `);
    }

    function setupImageGalleryEvents() {
        // Thumbnail click events for ultra-compact layout
        $(document).on('click', '.thumbnail-item-ultra-compact', function () {
            try {
                const index = parseInt($(this).data('index'));

                if (isNaN(index) || !currentImages || index >= currentImages.length) {
                    console.warn('Invalid thumbnail index or no images available');
                    return;
                }

                const image = currentImages[index];
                if (!image) {
                    console.warn('Image not found at index:', index);
                    return;
                }

                // Remove active class from all thumbnails
                $('.thumbnail-item-ultra-compact').removeClass('active');
                // Add active class to clicked thumbnail
                $(this).addClass('active');

                // Load the selected image as main image
                loadMainImage(image);

                // Update current image index
                currentImageIndex = index;

                // Add visual feedback
                $(this).addClass('clicked');
                setTimeout(() => {
                    $(this).removeClass('clicked');
                }, 200);
            } catch (error) {
                console.error('Error handling thumbnail click:', error);
            }
        });

        // View toggle buttons
        $(document).on('click', '.view-btn', function () {
            $('.view-btn').removeClass('active');
            $(this).addClass('active');

            const viewType = $(this).data('view');
            handleViewChange(viewType);
        });

        // Image upload events
        setupImageUploadEvents();

        // Keyboard navigation
        setupKeyboardNavigation();
    }

    function setupKeyboardNavigation() {
        $(document).on('keydown', function (e) {
            // Only handle keyboard navigation when image gallery is visible
            if ($('.part-images-ultra-compact').is(':visible') && currentImages.length > 0) {
                switch (e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        navigateImage(-1);
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        navigateImage(1);
                        break;
                    case 'Escape':
                        e.preventDefault();
                        // Close any open modals
                        $('.modal').modal('hide');
                        break;
                }
            }
        });
    }

    function navigateImage(direction) {
        try {
            if (!currentImages || currentImages.length === 0) {
                console.warn('No images available for navigation');
                return;
            }

            const newIndex = (currentImageIndex + direction + currentImages.length) % currentImages.length;
            const newImage = currentImages[newIndex];

            if (!newImage) {
                console.warn('Image not found at index:', newIndex);
                return;
            }

            // Update active thumbnail
            $('.thumbnail-item-ultra-compact').removeClass('active');
            $(`.thumbnail-item-ultra-compact[data-index="${newIndex}"]`).addClass('active');

            // Load new main image
            loadMainImage(newImage);
            currentImageIndex = newIndex;
        } catch (error) {
            console.error('Error navigating images:', error);
        }
    }

    // Compare View Variables
    let compareZoom1 = 1;
    let compareZoom2 = 1;
    let syncZoomEnabled = false;

    function handleViewChange(viewType) {
        // Hide all views first
        $('.main-image-ultra-compact').hide();
        $('.thumbnails-ultra-compact').hide();
        $('#compareViewer').hide();

        switch (viewType) {
            case 'single':
                $('.main-image-ultra-compact').show();
                $('.thumbnails-ultra-compact').show();
                break;
            case 'compare':
                showCompareView();
                break;
        }
    }

    function showCompareView() {
        const compareViewer = $('#compareViewer');
        compareViewer.show().addClass('active');

        // Initialize compare view if not already done
        if (!compareViewer.hasClass('initialized')) {
            initializeCompareView();
            compareViewer.addClass('initialized');
        }
    }

    function initializeCompareView() {
        // Populate image selectors with available images
        populateImageSelectors();

        // Set default images if available
        if (currentImages && currentImages.length >= 2) {
            // Set first two images as default
            changeCompareImage(1, 0);
            changeCompareImage(2, 1);
        } else if (currentImages && currentImages.length === 1) {
            // Set same image for both if only one available
            changeCompareImage(1, 0);
            changeCompareImage(2, 0);
        }

        // Initialize empty states
        updateCompareImageContainer(1);
        updateCompareImageContainer(2);
    }

    function populateImageSelectors() {
        const select1 = $('#imageSelect1');
        const select2 = $('#imageSelect2');

        // Clear existing options
        select1.empty().append('<option value="">Select Image 1</option>');
        select2.empty().append('<option value="">Select Image 2</option>');

        // Add options for each available image
        if (currentImages && currentImages.length > 0) {
            currentImages.forEach((image, index) => {
                const option = `<option value="${index}">${image.title} (${image.category})</option>`;
                select1.append(option);
                select2.append(option);
            });
        }
    }

    function changeCompareImage(slot, imageIndex) {
        if (!currentImages || imageIndex === '' || imageIndex < 0 || imageIndex >= currentImages.length) {
            // Clear the image
            $(`#compareImage${slot}`).attr('src', '').hide();
            $(`#compareSlot${slot} .compare-image-container`).addClass('empty');
            return;
        }

        const image = currentImages[imageIndex];
        const imageElement = $(`#compareImage${slot}`);

        // Update the image
        imageElement.attr('src', image.url);
        imageElement.attr('alt', image.title);
        imageElement.show();

        // Remove empty state
        $(`#compareSlot${slot} .compare-image-container`).removeClass('empty');

        // Update selector
        $(`#imageSelect${slot}`).val(imageIndex);

        // Reset zoom for this image
        if (slot === 1) {
            compareZoom1 = 1;
        } else {
            compareZoom2 = 1;
        }
        updateCompareImageZoom(slot);
        updateZoomDisplay();
    }

    function updateCompareImageContainer(slot) {
        const container = $(`#compareSlot${slot} .compare-image-container`);
        const image = $(`#compareImage${slot}`);

        if (!image.attr('src')) {
            container.addClass('empty');
        } else {
            container.removeClass('empty');
        }
    }

    function zoomCompareImage(slot, direction) {
        const zoomFactor = 1.2;
        let currentZoom = slot === 1 ? compareZoom1 : compareZoom2;

        if (direction === 'in') {
            currentZoom = Math.min(currentZoom * zoomFactor, 5);
        } else {
            currentZoom = Math.max(currentZoom / zoomFactor, 0.5);
        }

        if (slot === 1) {
            compareZoom1 = currentZoom;
        } else {
            compareZoom2 = currentZoom;
        }

        // If sync is enabled, apply same zoom to both images
        if (syncZoomEnabled) {
            compareZoom1 = compareZoom2 = currentZoom;
            updateCompareImageZoom(1);
            updateCompareImageZoom(2);
        } else {
            updateCompareImageZoom(slot);
        }

        updateZoomDisplay();
    }

    function updateCompareImageZoom(slot) {
        const zoom = slot === 1 ? compareZoom1 : compareZoom2;
        $(`#compareImage${slot}`).css('transform', `scale(${zoom})`);
    }

    function updateZoomDisplay() {
        const displayZoom = syncZoomEnabled ?
            Math.round(compareZoom1 * 100) :
            `${Math.round(compareZoom1 * 100)}% / ${Math.round(compareZoom2 * 100)}%`;
        $('#zoomLevel').text(displayZoom + (syncZoomEnabled ? '%' : ''));
    }

    // Global compare functions
    window.changeCompareImage = function (slot) {
        const selectedIndex = parseInt($(`#imageSelect${slot}`).val());
        changeCompareImage(slot, selectedIndex);
    };

    window.syncZoom = function () {
        syncZoomEnabled = !syncZoomEnabled;
        $('#syncStatus').text(syncZoomEnabled ? 'Enabled' : 'Disabled');

        if (syncZoomEnabled) {
            // Sync both images to the average zoom level
            const avgZoom = (compareZoom1 + compareZoom2) / 2;
            compareZoom1 = compareZoom2 = avgZoom;
            updateCompareImageZoom(1);
            updateCompareImageZoom(2);
        }

        updateZoomDisplay();

        // Update button appearance
        const syncButton = $('.compare-controls button[onclick="syncZoom()"]');
        if (syncZoomEnabled) {
            syncButton.removeClass('btn-outline-primary').addClass('btn-primary');
        } else {
            syncButton.removeClass('btn-primary').addClass('btn-outline-primary');
        }
    };

    window.resetCompare = function () {
        compareZoom1 = compareZoom2 = 1;
        syncZoomEnabled = false;

        updateCompareImageZoom(1);
        updateCompareImageZoom(2);
        updateZoomDisplay();

        $('#syncStatus').text('Disabled');
        $('.compare-controls button[onclick="syncZoom()"]')
            .removeClass('btn-primary').addClass('btn-outline-primary');
    };

    window.zoomCompareImage = function (slot, direction) {
        zoomCompareImage(slot, direction);
    };

    function setupImageUploadEvents() {
        // File input change event
        $('#imageUpload').on('change', function (e) {
            handleFileSelection(e.target.files);
        });

        // Drag and drop events
        const uploadZone = $('#uploadZone');

        uploadZone.on('dragover', function (e) {
            e.preventDefault();
            $(this).addClass('dragover');
        });

        uploadZone.on('dragleave', function (e) {
            e.preventDefault();
            $(this).removeClass('dragover');
        });

        uploadZone.on('drop', function (e) {
            e.preventDefault();
            $(this).removeClass('dragover');
            handleFileSelection(e.originalEvent.dataTransfer.files);
        });

        // Upload button click
        $('#uploadButton').on('click', function () {
            uploadImages();
        });
    }

    function handleFileSelection(files) {
        const previewContainer = $('#previewImages');
        const uploadPreview = $('#uploadPreview');

        previewContainer.empty();

        if (files.length > 0) {
            uploadPreview.show();

            Array.from(files).forEach((file, index) => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        const previewItem = $(`
                            <div class="preview-item" data-index="${index}">
                                <img src="${e.target.result}" alt="Preview">
                                <button class="preview-remove" onclick="removePreviewImage(${index})">
                                    <i class="material-icons">close</i>
                                </button>
                            </div>
                        `);
                        previewContainer.append(previewItem);
                    };
                    reader.readAsDataURL(file);
                }
            });
        } else {
            uploadPreview.hide();
        }
    }

    function uploadImages() {
        // Implementation for uploading images
        console.log('Uploading images...');
        // This would handle the actual upload process

        // Close modal after upload
        $('#uploadImageModal').modal('hide');

        // Show success message
        showNotification('Images uploaded successfully!', 'success');
    }

    // Global image functions
    window.toggleImageView = function () {
        // Toggle between grid and list view
        console.log('Toggle image view');
    };

    window.zoomImage = function () {
        const mainImage = $('#mainPartImage');
        const zoomedImage = $('#zoomedImage');

        zoomedImage.attr('src', mainImage.attr('src'));
        $('#imageZoomModal').modal('show');

        // Reset zoom and rotation
        currentZoom = 1;
        currentRotation = 0;
        updateZoomedImage();
    };

    window.downloadImage = function () {
        const mainImage = $('#mainPartImage');
        const link = document.createElement('a');
        link.href = mainImage.attr('src');
        link.download = 'part-image.jpg';
        link.click();
    };

    window.shareImage = function () {
        if (navigator.share) {
            navigator.share({
                title: 'Part Image',
                url: $('#mainPartImage').attr('src')
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText($('#mainPartImage').attr('src'));
            showNotification('Image URL copied to clipboard!', 'info');
        }
    };

    window.zoomIn = function () {
        currentZoom = Math.min(currentZoom * 1.2, 5);
        updateZoomedImage();
    };

    window.zoomOut = function () {
        currentZoom = Math.max(currentZoom / 1.2, 0.5);
        updateZoomedImage();
    };

    window.resetZoom = function () {
        currentZoom = 1;
        currentRotation = 0;
        updateZoomedImage();
    };

    window.rotateImage = function () {
        currentRotation = (currentRotation + 90) % 360;
        updateZoomedImage();
    };

    function updateZoomedImage() {
        const zoomedImage = $('#zoomedImage');
        zoomedImage.css({
            'transform': `scale(${currentZoom}) rotate(${currentRotation}deg)`,
            'transition': 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)'
        });
    }

    window.removePreviewImage = function (index) {
        $(`.preview-item[data-index="${index}"]`).remove();

        // Check if any previews remain
        if ($('.preview-item').length === 0) {
            $('#uploadPreview').hide();
        }
    };

    function showNotification(message, type = 'info') {
        // Simple notification system
        const notification = $(`
            <div class="alert alert-${type} alert-dismissible fade show position-fixed"
                 style="top: 80px; right: 20px; z-index: 9999; min-width: 300px;">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `);

        $('body').append(notification);

        // Auto-dismiss after 3 seconds
        setTimeout(() => {
            notification.alert('close');
        }, 3000);
    }


    function findPartId(partNumber, prefix) {
        for (const key in partDetails) {
            if (partDetails[key].id === partNumber && partDetails[key].prefix === prefix) {
                return key;
            }
        }
        return null; // Return null if no matching part is found
    }

    function populateFields($card, partData) {
        $card.find('.info-value-ultra-compact').each(function () {
            const field = $(this).data('field');
            if (field && partData[field] !== undefined) {
                if ($(this).hasClass('badge-value')) {
                    // Handle boolean fields with badges
                    const badgeText = partData[field] ? 'Yes' : 'No';
                    const badgeClass = partData[field] ? 'bg-success' : 'bg-secondary';
                    $(this).find('.badge').text(badgeText).removeClass('bg-success bg-secondary').addClass(badgeClass);
                } else {
                    // Handle text fields
                    $(this).text(partData[field]);
                }
            }
        });
    }

    $('.detail-card-ultra-compact').each(function () {
        const $card = $(this);
        const partNumber = $card.find('.info-value-ultra-compact[data-field="id"]').text();
        const prefix = $card.find('.info-value-ultra-compact[data-field="prefix"]').text();
        const partId = findPartId(partNumber, prefix);
        if (partId && partDetails[partId]) {
            populateFields($card, partDetails[partId]);
        } else {
            console.warn('No part found for Part Number:', partNumber, 'and Prefix:', prefix);
        }
    });
    $('.btn-edit').on('click', function () {
        const $card = $(this).closest('.detail-card-ultra-compact');
        const partNumber = $card.find('.info-value-ultra-compact[data-field="id"]').text();
        const prefix = $card.find('.info-value-ultra-compact[data-field="prefix"]').text();
        const partId = findPartId(partNumber, prefix);

        if (!partId || !partDetails[partId]) {
            console.error('Part not found for Part Number:', partNumber, 'and Prefix:', prefix);
            return;
        }

        const partData = partDetails[partId];

        // Hide Edit button, show Save and Cancel buttons
        $(this).hide();
        $card.find('.btn-save, .btn-cancel').show();

        // Convert fields to inputs, except for Part Number (id) and Part Prefix (prefix)
        $card.find('.info-value-ultra-compact').each(function () {
            const $this = $(this);
            const field = $this.data('field');
            if (field && field !== 'id' && field !== 'prefix') { // Skip id and prefix
                if ($this.hasClass('badge-value')) {
                    // Boolean fields: replace with select dropdown
                    const currentValue = partData[field] ? 'Yes' : 'No';
                    $this.html(`
                        <select class="form-select" data-original="${currentValue}">
                            <option value="Yes" ${currentValue === 'Yes' ? 'selected' : ''}>Yes</option>
                            <option value="No" ${currentValue === 'No' ? 'selected' : ''}>No</option>
                        </select>
                    `);
                } else {
                    // Text fields: replace with input
                    const currentValue = $this.text();
                    $this.html(`<input type="text" value="${currentValue}" data-original="${currentValue}" />`);
                }
            }
        });
    });
    // Click handler for Save button
    $('.btn-save').on('click', function () {
        const $card = $(this).closest('.detail-card-ultra-compact');
        const partNumber = $card.find('.info-value-ultra-compact[data-field="id"]').text(); // Always text, as id is not editable
        const prefix = $card.find('.info-value-ultra-compact[data-field="prefix"]').text(); // Always text, as prefix is not editable
        const partId = findPartId(partNumber, prefix);

        if (!partId || !partDetails[partId]) {
            console.error('Part not found for Part Number:', partNumber, 'and Prefix:', prefix);
            return;
        }

        const partData = partDetails[partId];

        // Update partDetails with new values, skipping id and prefix
        $card.find('.info-value-ultra-compact').each(function () {
            const $this = $(this);
            const field = $this.data('field');
            if (field && field !== 'id' && field !== 'prefix') { // Skip id and prefix
                if ($this.hasClass('badge-value')) {
                    // Boolean fields
                    const newValue = $this.find('select').val() === 'Yes';
                    partData[field] = newValue;
                    const badgeText = newValue ? 'Yes' : 'No';
                    const badgeClass = newValue ? 'bg-success' : 'bg-secondary';
                    $this.html(`<span class="badge ${badgeClass}">${badgeText}</span>`);
                } else if ($this.find('input').length) { // Only process fields with inputs
                    // Text fields
                    const newValue = $this.find('input').val();
                    partData[field] = newValue;
                    $this.text(newValue);
                }
            }
        });

        // Show Edit button, hide Save and Cancel buttons
        $card.find('.btn-edit').show();
        $card.find('.btn-save, .btn-cancel').hide();

        // Log updated partDetails for debugging (in a real app, save to backend)
        console.log('Updated partDetails for Part ID:', partId, partData);
    });

    // Click handler for Cancel button
    $('.btn-cancel').on('click', function () {
        const $card = $(this).closest('.detail-card-ultra-compact');
        const partNumber = $card.find('.info-value-ultra-compact[data-field="id"]').text(); // Always text, as id is not editable
        const prefix = $card.find('.info-value-ultra-compact[data-field="prefix"]').text(); // Always text, as prefix is not editable
        const partId = findPartId(partNumber, prefix);

        if (!partId || !partDetails[partId]) {
            console.error('Part not found for Part Number:', partNumber, 'and Prefix:', prefix);
            return;
        }

        const partData = partDetails[partId];

        // Revert to original values, skipping id and prefix
        $card.find('.info-value-ultra-compact').each(function () {
            const $this = $(this);
            const field = $this.data('field');
            if (field && field !== 'id' && field !== 'prefix') { // Skip id and prefix
                if ($this.hasClass('badge-value')) {
                    // Boolean fields
                    const originalValue = $this.find('select').data('original');
                    const badgeText = originalValue;
                    const badgeClass = originalValue === 'Yes' ? 'bg-success' : 'bg-secondary';
                    $this.html(`<span class="badge ${badgeClass}">${badgeText}</span>`);
                } else if ($this.find('input').length) { // Only process fields with inputs
                    // Text fields
                    const originalValue = $this.find('input').data('original');
                    $this.text(originalValue);
                }
            }
        });

        // Show Edit button, hide Save and Cancel buttons
        $card.find('.btn-edit').show();
        $card.find('.btn-save, .btn-cancel').hide();
    });

    // Update Pricing Tab with Uniform Structure
    function updatePricingTab(part) {
        try {
            // Clear all view containers
            const containers = {
                table: $('#pricingDetailsTableBody'),
                grid: $('#pricingGridView'),
                list: $('#pricingListView'),
                cards: $('#pricingCardsView'),
                tiles: $('#pricingTilesView'),
                compact: $('#pricingCompactView')
            };

            Object.values(containers).forEach(container => container.empty());

            // Check if data exists
            if (!part.priceDetails || !Array.isArray(part.priceDetails)) {
                console.warn('No pricing details available for this part');
                showEmptyState(containers, 'pricing', 'No pricing information available');
                return;
            }

            // Update summary cards
            updatePricingSummary(part.priceDetails);

            // Populate all views
            part.priceDetails.forEach((pricing, index) => {
                generatePricingViews(pricing, index, containers);
            });

            // Initialize view switching and selection
            initializeViewSwitching('pricing');
            initializeSelection('pricing');

        } catch (error) {
            console.error('Error updating pricing tab:', error);
            showErrorState('pricing', 'Error loading pricing information');
        }
    }

    function updatePricingSummary(priceDetails) {
        const totalPrices = priceDetails.length;
        const currentPrice = priceDetails.length > 0 ? priceDetails[0].listPrice : 0;
        const pendingPrices = priceDetails.filter(p => new Date(p.validUntil) > new Date()).length;
        const currencies = [...new Set(priceDetails.map(p => p.buyingCurrency))].length;

        $('#totalPricesValue').text(totalPrices);
        $('#currentPriceValue').text(`$${currentPrice.toFixed(2)}`);
        $('#pendingPricesValue').text(pendingPrices);
        $('#currenciesCount').text(currencies);
    }

    function generatePricingViews(pricing, index, containers) {
        const pricingId = pricing.id || `pricing_${index}`;

        // Table View
        const tableRow = $(`
            <tr data-pricing-id="${pricingId}">
                <td>
                    <div class="form-check">
                        <input class="form-check-input pricing-checkbox" type="checkbox" value="${pricingId}">
                    </div>
                </td>
                <td><strong>$${(pricing.listPrice || 0).toFixed(2)}</strong></td>
                <td>$${(pricing.costPrice || 0).toFixed(2)}</td>
                <td>${pricing.effectiveFrom || '-'}</td>
                <td>${pricing.customerWarranty || '-'}</td>
                <td>${pricing.buyingCurrency || '-'}</td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-outline-primary" onclick="editPricing('${pricingId}')" title="Edit">
                            <i class="material-icons">edit</i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deletePricing('${pricingId}')" title="Delete">
                            <i class="material-icons">delete</i>
                        </button>
                    </div>
                </td>
            </tr>
        `);
        containers.table.append(tableRow);

        // Grid View
        const gridItem = $(`
            <div class="pricing-grid-item" data-pricing-id="${pricingId}">
                <div class="pricing-card">
                    <div class="pricing-card-header">
                        <div class="form-check">
                            <input class="form-check-input pricing-checkbox" type="checkbox" value="${pricingId}">
                        </div>
                        <div class="pricing-type-badge ${pricing.priceType.toLowerCase()}">${pricing.priceType}</div>
                        <div class="pricing-currency">${pricing.buyingCurrency}</div>
                    </div>
                    <div class="pricing-card-body">
                        <div class="pricing-main">
                            <div class="list-price">
                                <span class="price-label">List Price</span>
                                <span class="price-value">$${pricing.listPrice.toFixed(2)}</span>
                            </div>
                            <div class="cost-price">
                                <span class="price-label">Cost Price</span>
                                <span class="price-value">$${pricing.costPrice.toFixed(2)}</span>
                            </div>
                        </div>
                        <div class="pricing-details">
                            <div class="detail-item">
                                <i class="material-icons">person</i>
                                <span>${pricing.customerType}</span>
                            </div>
                            <div class="detail-item">
                                <i class="material-icons">calendar_today</i>
                                <span>${pricing.effectiveFrom}</span>
                            </div>
                            <div class="detail-item">
                                <i class="material-icons">security</i>
                                <span>${pricing.customerWarranty}</span>
                            </div>
                        </div>
                    </div>
                    <div class="pricing-card-footer">
                        <button class="btn btn-sm btn-outline-primary" onclick="editPricing('${pricingId}')">
                            <i class="material-icons">edit</i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deletePricing('${pricingId}')">
                            <i class="material-icons">delete</i>
                        </button>
                    </div>
                </div>
            </div>
        `);
        containers.grid.append(gridItem);

        // Generate other views (list, cards, tiles, compact)
        generateUniformViews('pricing', pricing, pricingId, containers);
    }

    // Universal Helper Functions for All Tabs
    function showEmptyState(containers, tabType, message) {
        const emptyStateHtml = `
            <div class="empty-state-container">
                <div class="empty-state-content">
                    <i class="material-icons empty-state-icon">info</i>
                    <h6 class="empty-state-title">${message}</h6>
                    <p class="empty-state-text">No data available to display</p>
                </div>
            </div>
        `;

        Object.values(containers).forEach(container => {
            if (container.is('tbody')) {
                const colCount = container.closest('table').find('thead th').length || 6;
                container.append(`
                    <tr>
                        <td colspan="${colCount}" class="text-center text-muted py-4">
                            <i class="material-icons me-2">info</i>${message}
                        </td>
                    </tr>
                `);
            } else {
                container.html(emptyStateHtml);
            }
        });
    }

    function showErrorState(tabType, message) {
        const errorStateHtml = `
            <div class="error-state-container">
                <div class="error-state-content">
                    <i class="material-icons error-state-icon">error</i>
                    <h6 class="error-state-title">${message}</h6>
                    <p class="error-state-text">Please try refreshing the page</p>
                </div>
            </div>
        `;

        $(`#${tabType}GridView, #${tabType}ListView, #${tabType}CardsView, #${tabType}TilesView, #${tabType}CompactView`).html(errorStateHtml);

        const tableBody = $(`#${tabType}DetailsTableBody`);
        if (tableBody.length) {
            const colCount = tableBody.closest('table').find('thead th').length || 6;
            tableBody.html(`
                <tr>
                    <td colspan="${colCount}" class="text-center text-danger py-4">
                        <i class="material-icons me-2">error</i>${message}
                    </td>
                </tr>
            `);
        }
    }

    function initializeViewSwitching(tabType) {
        $(`.${tabType}-view .view-btn`).off('click').on('click', function() {
            const view = $(this).data('view');
            $(`.${tabType}-view .view-btn`).removeClass('active');
            $(this).addClass('active');
            $(`.${tabType}-view`).hide();
            $(`.${tabType}-${view}-view`).show();
        });
    }

    function initializeSelection(tabType) {
        // Select all checkbox
        $(`#selectAll${tabType.charAt(0).toUpperCase() + tabType.slice(1)}`).off('change').on('change', function() {
            const isChecked = $(this).is(':checked');
            $(`.${tabType}-checkbox`).prop('checked', isChecked);
            updateSelectionControls(tabType);
        });

        // Individual checkboxes
        $(document).off('change', `.${tabType}-checkbox`).on('change', `.${tabType}-checkbox`, function() {
            updateSelectionControls(tabType);
        });
    }

    function updateSelectionControls(tabType) {
        const selectedCount = $(`.${tabType}-checkbox:checked`).length;
        const totalCount = $(`.${tabType}-checkbox`).length;

        $(`#selected${tabType.charAt(0).toUpperCase() + tabType.slice(1)}Count`).text(selectedCount);

        if (selectedCount > 0) {
            $(`#${tabType}SelectionControls`).show();
            $(`#delete${tabType.charAt(0).toUpperCase() + tabType.slice(1)}Entry`).show();
        } else {
            $(`#${tabType}SelectionControls`).hide();
            $(`#delete${tabType.charAt(0).toUpperCase() + tabType.slice(1)}Entry`).hide();
        }

        // Update select all checkbox state
        const selectAllCheckbox = $(`#selectAll${tabType.charAt(0).toUpperCase() + tabType.slice(1)}`);
        if (selectedCount === 0) {
            selectAllCheckbox.prop('indeterminate', false).prop('checked', false);
        } else if (selectedCount === totalCount) {
            selectAllCheckbox.prop('indeterminate', false).prop('checked', true);
        } else {
            selectAllCheckbox.prop('indeterminate', true);
        }
    }

    function generateUniformViews(tabType, data, dataId, containers) {
        // List View
        const listItem = createListView(tabType, data, dataId);
        containers.list.append(listItem);

        // Bootstrap Cards View
        const cardItem = createBootstrapCardView(tabType, data, dataId);
        containers.cards.append(cardItem);

        // Tiles View
        const tileItem = createTileView(tabType, data, dataId);
        containers.tiles.append(tileItem);

        // Compact View
        const compactItem = createCompactView(tabType, data, dataId);
        containers.compact.append(compactItem);
    }

    // Update Manufacturer Tab with Uniform Structure
    function updateManufacturerTab(part) {
        try {
            // Clear all view containers
            const containers = {
                table: $('#manufacturerDetailsTableBody'),
                grid: $('#manufacturerGridView'),
                list: $('#manufacturerListView'),
                cards: $('#manufacturerCardsView'),
                tiles: $('#manufacturerTilesView'),
                compact: $('#manufacturerCompactView')
            };

            Object.values(containers).forEach(container => container.empty());

            // Check if data exists
            if (!part.manufacturerDetails || !Array.isArray(part.manufacturerDetails)) {
                console.warn('No manufacturer details available for this part');
                showEmptyState(containers, 'manufacturer', 'No manufacturer information available');
                return;
            }

            // Update summary cards
            updateManufacturerSummary(part.manufacturerDetails);

            // Populate all views
            part.manufacturerDetails.forEach((manufacturer, index) => {
                generateManufacturerViews(manufacturer, index, containers);
            });

            // Initialize view switching and selection
            initializeViewSwitching('manufacturer');
            initializeSelection('manufacturer');

        } catch (error) {
            console.error('Error updating manufacturer tab:', error);
            showErrorState('manufacturer', 'Error loading manufacturer information');
        }
    }

    function updateManufacturerSummary(manufacturerDetails) {
        const totalManufacturers = manufacturerDetails.length;
        const activeManufacturers = manufacturerDetails.filter(m => m.status === 'Active').length;
        const pendingOrders = manufacturerDetails.filter(m => m.rushOrderYSO === 'Yes').length;
        const totalParts = manufacturerDetails.reduce((sum, m) => sum + m.stdPackQty, 0);

        $('#totalManufacturersValue').text(totalManufacturers);
        $('#activeManufacturersValue').text(activeManufacturers);
        $('#pendingOrdersValue').text(pendingOrders);
        $('#totalPartsValue').text(totalParts);
    }

    function generateManufacturerViews(manufacturer, index, containers) {
        const manufacturerId = manufacturer.id || `manufacturer_${index}`;
        const statusClass = manufacturer.status === 'Active' ? 'status-active' : 'status-inactive';

        // Table View
        const tableRow = $(`
            <tr data-manufacturer-id="${manufacturerId}">
                <td>
                    <div class="form-check">
                        <input class="form-check-input manufacturer-checkbox" type="checkbox" value="${manufacturerId}">
                    </div>
                </td>
                <td>${manufacturer.manufacturer || '-'}</td>
                <td>${manufacturer.prefix || '-'}</td>
                <td>${manufacturer.manufacturerPart || '-'}</td>
                <td>${manufacturer.buyingCurrency || '-'}</td>
                <td>${manufacturer.stdPackQty || '-'}</td>
                <td>$${(manufacturer.partnerNetPrice || 0).toFixed(2)}</td>
                <td>${manufacturer.lastInvoiceDate || '-'}</td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-outline-primary" onclick="editManufacturer('${manufacturerId}')" title="Edit">
                            <i class="material-icons">edit</i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteManufacturer('${manufacturerId}')" title="Delete">
                            <i class="material-icons">delete</i>
                        </button>
                    </div>
                </td>
            </tr>
        `);
        containers.table.append(tableRow);

        // Grid View
        const gridItem = $(`
            <div class="manufacturer-grid-item" data-manufacturer-id="${manufacturerId}">
                <div class="manufacturer-card">
                    <div class="manufacturer-card-header">
                        <div class="form-check">
                            <input class="form-check-input manufacturer-checkbox" type="checkbox" value="${manufacturerId}">
                        </div>
                        <div class="manufacturer-name">${manufacturer.manufacturer}</div>
                        <div class="manufacturer-status ${statusClass}">${manufacturer.status}</div>
                    </div>
                    <div class="manufacturer-card-body">
                        <div class="manufacturer-main">
                            <div class="manufacturer-part">
                                <span class="label">Part Number</span>
                                <span class="value">${manufacturer.prefix}-${manufacturer.manufacturerPart}</span>
                            </div>
                            <div class="net-price">
                                <span class="label">Net Price</span>
                                <span class="value">$${manufacturer.partnerNetPrice.toFixed(2)} ${manufacturer.buyingCurrency}</span>
                            </div>
                        </div>
                        <div class="manufacturer-details">
                            <div class="detail-item">
                                <i class="material-icons">inventory</i>
                                <span>Pack Qty: ${manufacturer.stdPackQty}</span>
                            </div>
                            <div class="detail-item">
                                <i class="material-icons">schedule</i>
                                <span>Lead Time: ${manufacturer.leadTime}</span>
                            </div>
                            <div class="detail-item">
                                <i class="material-icons">contact_phone</i>
                                <span>${manufacturer.contactPerson}</span>
                            </div>
                        </div>
                    </div>
                    <div class="manufacturer-card-footer">
                        <button class="btn btn-sm btn-outline-primary" onclick="editManufacturer('${manufacturerId}')">
                            <i class="material-icons">edit</i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteManufacturer('${manufacturerId}')">
                            <i class="material-icons">delete</i>
                        </button>
                    </div>
                </div>
            </div>
        `);
        containers.grid.append(gridItem);

        // Generate other views (list, cards, tiles, compact)
        generateUniformViews('manufacturer', manufacturer, manufacturerId, containers);
    }

    // View Creation Functions
    function createListView(tabType, data, dataId) {
        const fields = getFieldsForTabType(tabType, data);
        return $(`
            <div class="${tabType}-list-item" data-${tabType}-id="${dataId}">
                <div class="form-check me-3">
                    <input class="form-check-input ${tabType}-checkbox" type="checkbox" value="${dataId}">
                </div>
                <div class="${tabType}-list-content">
                    ${fields.map(field => `
                        <div class="${tabType}-list-field">
                            <span class="${tabType}-list-label">${field.label}</span>
                            <span class="${tabType}-list-value">${field.value}</span>
                        </div>
                    `).join('')}
                    <div class="${tabType}-list-actions">
                        <button class="btn btn-sm btn-outline-primary" onclick="edit${tabType.charAt(0).toUpperCase() + tabType.slice(1)}('${dataId}')" title="Edit">
                            <i class="material-icons">edit</i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="delete${tabType.charAt(0).toUpperCase() + tabType.slice(1)}('${dataId}')" title="Delete">
                            <i class="material-icons">delete</i>
                        </button>
                    </div>
                </div>
            </div>
        `);
    }

    function createBootstrapCardView(tabType, data, dataId) {
        const fields = getFieldsForTabType(tabType, data);
        const title = getTitleForTabType(tabType, data);

        return $(`
            <div class="${tabType}-bootstrap-card" data-${tabType}-id="${dataId}">
                <div class="card">
                    <div class="card-header">
                        <h6 class="card-title">
                            <i class="material-icons">${getIconForTabType(tabType)}</i>
                            ${title}
                        </h6>
                        <div class="form-check">
                            <input class="form-check-input ${tabType}-checkbox" type="checkbox" value="${dataId}">
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="info-grid">
                            ${fields.slice(0, 4).map(field => `
                                <div class="info-item">
                                    <span class="info-label">${field.label}</span>
                                    <span class="info-value">${field.value}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-sm btn-outline-primary" onclick="edit${tabType.charAt(0).toUpperCase() + tabType.slice(1)}('${dataId}')">
                            <i class="material-icons">edit</i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="delete${tabType.charAt(0).toUpperCase() + tabType.slice(1)}('${dataId}')">
                            <i class="material-icons">delete</i>
                        </button>
                    </div>
                </div>
            </div>
        `);
    }

    function createTileView(tabType, data, dataId) {
        const title = getTitleForTabType(tabType, data);
        const subtitle = getSubtitleForTabType(tabType, data);

        return $(`
            <div class="${tabType}-tile-item" data-${tabType}-id="${dataId}">
                <div class="tile-card">
                    <div class="tile-header">
                        <div class="form-check">
                            <input class="form-check-input ${tabType}-checkbox" type="checkbox" value="${dataId}">
                        </div>
                        <div class="tile-icon">
                            <i class="material-icons">${getIconForTabType(tabType)}</i>
                        </div>
                    </div>
                    <div class="tile-body">
                        <h6 class="tile-title">${title}</h6>
                        <p class="tile-subtitle">${subtitle}</p>
                    </div>
                    <div class="tile-footer">
                        <button class="btn btn-sm btn-outline-primary" onclick="edit${tabType.charAt(0).toUpperCase() + tabType.slice(1)}('${dataId}')">
                            <i class="material-icons">edit</i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="delete${tabType.charAt(0).toUpperCase() + tabType.slice(1)}('${dataId}')">
                            <i class="material-icons">delete</i>
                        </button>
                    </div>
                </div>
            </div>
        `);
    }

    function createCompactView(tabType, data, dataId) {
        const title = getTitleForTabType(tabType, data);
        const subtitle = getSubtitleForTabType(tabType, data);

        return $(`
            <div class="${tabType}-compact-item" data-${tabType}-id="${dataId}">
                <div class="form-check">
                    <input class="form-check-input ${tabType}-checkbox" type="checkbox" value="${dataId}">
                </div>
                <div class="compact-content">
                    <span class="compact-title">${title}</span>
                    <span class="compact-subtitle">${subtitle}</span>
                </div>
                <div class="compact-actions">
                    <button class="btn btn-sm btn-outline-primary" onclick="edit${tabType.charAt(0).toUpperCase() + tabType.slice(1)}('${dataId}')">
                        <i class="material-icons">edit</i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="delete${tabType.charAt(0).toUpperCase() + tabType.slice(1)}('${dataId}')">
                        <i class="material-icons">delete</i>
                    </button>
                </div>
            </div>
        `);
    }

    // Helper Functions for View Creation
    function getFieldsForTabType(tabType, data) {
        switch (tabType) {
            case 'pricing':
                return [
                    { label: 'List Price', value: `$${(data.listPrice || 0).toFixed(2)}` },
                    { label: 'Cost Price', value: `$${(data.costPrice || 0).toFixed(2)}` },
                    { label: 'Customer Type', value: data.customerType || '-' },
                    { label: 'Currency', value: data.buyingCurrency || '-' },
                    { label: 'Effective From', value: data.effectiveFrom || '-' },
                    { label: 'Valid Until', value: data.validUntil || '-' }
                ];
            case 'manufacturer':
                return [
                    { label: 'Manufacturer', value: data.manufacturer || '-' },
                    { label: 'Part Number', value: `${data.prefix || ''}-${data.manufacturerPart || ''}` },
                    { label: 'Net Price', value: `$${(data.partnerNetPrice || 0).toFixed(2)}` },
                    { label: 'Currency', value: data.buyingCurrency || '-' },
                    { label: 'Pack Qty', value: data.stdPackQty || '-' },
                    { label: 'Lead Time', value: data.leadTime || '-' }
                ];
            case 'assets':
                return [
                    { label: 'Brand', value: data.brand || '-' },
                    { label: 'Model', value: data.model || '-' },
                    { label: 'Asset Type', value: data.assetType || '-' },
                    { label: 'Engine Type', value: data.engineType || '-' },
                    { label: 'Year Range', value: data.yearRange || '-' },
                    { label: 'Compatibility', value: data.compatibility || '-' }
                ];
            case 'competitor':
                return [
                    { label: 'Competitor', value: data.competitorName || '-' },
                    { label: 'Net Rate', value: `$${(data.netRate || 0).toFixed(2)}` },
                    { label: 'Cost Price', value: `$${(data.costPrice || 0).toFixed(2)}` },
                    { label: 'Availability', value: data.availability || '-' },
                    { label: 'Lead Time', value: data.leadTime || '-' },
                    { label: 'Min Qty', value: data.minimumOrderQty || '-' }
                ];
            case 'files':
                return [
                    { label: 'File Name', value: data.fileName || '-' },
                    { label: 'File Type', value: data.fileType || '-' },
                    { label: 'File Size', value: data.fileSize || '-' },
                    { label: 'Uploaded By', value: data.uploadedBy || '-' },
                    { label: 'Upload Date', value: data.uploadDate || '-' },
                    { label: 'Downloads', value: data.downloadCount || '0' }
                ];
            default:
                return [];
        }
    }

    function getTitleForTabType(tabType, data) {
        switch (tabType) {
            case 'pricing':
                return `${data.priceType || 'Standard'} - ${data.buyingCurrency || 'USD'}`;
            case 'manufacturer':
                return data.manufacturer || 'Unknown Manufacturer';
            case 'assets':
                return `${data.brand || 'Unknown'} ${data.model || 'Model'}`;
            case 'competitor':
                return data.competitorName || 'Unknown Competitor';
            case 'files':
                return data.fileName || 'Unknown File';
            default:
                return 'Unknown';
        }
    }

    function getSubtitleForTabType(tabType, data) {
        switch (tabType) {
            case 'pricing':
                return `$${(data.listPrice || 0).toFixed(2)} - ${data.customerType || 'Standard'}`;
            case 'manufacturer':
                return `${data.prefix || ''}-${data.manufacturerPart || ''} | $${(data.partnerNetPrice || 0).toFixed(2)}`;
            case 'assets':
                return `${data.assetType || 'Unknown'} | ${data.yearRange || 'Unknown Year'}`;
            case 'competitor':
                return `$${(data.netRate || 0).toFixed(2)} | ${data.availability || 'Unknown'}`;
            case 'files':
                return `${data.fileType || 'Unknown'} | ${data.fileSize || 'Unknown Size'}`;
            default:
                return '';
        }
    }

    function getIconForTabType(tabType) {
        switch (tabType) {
            case 'pricing':
                return 'attach_money';
            case 'manufacturer':
                return 'business';
            case 'assets':
                return 'directions_car';
            case 'competitor':
                return 'trending_up';
            case 'files':
                return 'attach_file';
            default:
                return 'info';
        }
    }

    // Update Assets Tab with Uniform Structure
    function updateAssetsTab(part) {
        try {
            // Clear all view containers
            const containers = {
                table: $('#assetsDetailsTableBody'),
                grid: $('#assetsGridView'),
                list: $('#assetsListView'),
                cards: $('#assetsCardsView'),
                tiles: $('#assetsTilesView'),
                compact: $('#assetsCompactView')
            };

            Object.values(containers).forEach(container => container.empty());

            // Check if data exists
            if (!part.assetDetails || !Array.isArray(part.assetDetails)) {
                console.warn('No asset details available for this part');
                showEmptyState(containers, 'assets', 'No asset information available');
                return;
            }

            // Update summary cards
            updateAssetsSummary(part.assetDetails);

            // Populate all views
            part.assetDetails.forEach((asset, index) => {
                generateAssetsViews(asset, index, containers);
            });

            // Initialize view switching and selection
            initializeViewSwitching('assets');
            initializeSelection('assets');

        } catch (error) {
            console.error('Error updating assets tab:', error);
            showErrorState('assets', 'Error loading asset information');
        }
    }

    function updateAssetsSummary(assetDetails) {
        const totalAssets = assetDetails.length;
        const activeBrands = [...new Set(assetDetails.map(a => a.brand))].length;
        const assetTypes = [...new Set(assetDetails.map(a => a.assetType))].length;
        const modelsCount = [...new Set(assetDetails.map(a => a.model))].length;

        $('#totalAssetsValue').text(totalAssets);
        $('#activeBrandsValue').text(activeBrands);
        $('#assetTypesValue').text(assetTypes);
        $('#modelsCount').text(modelsCount);
    }

    function generateAssetsViews(asset, index, containers) {
        const assetId = asset.id || `asset_${index}`;
        const compatibilityClass = asset.compatibility === 'Direct Fit' ? 'compatibility-direct' :
                                 asset.compatibility === 'Requires Adapter' ? 'compatibility-adapter' : 'compatibility-special';

        // Table View
        const tableRow = $(`
            <tr data-asset-id="${assetId}">
                <td>
                    <div class="form-check">
                        <input class="form-check-input assets-checkbox" type="checkbox" value="${assetId}">
                    </div>
                </td>
                <td>${asset.brand || '-'}</td>
                <td>${asset.assetType || '-'}</td>
                <td>${asset.model || '-'}</td>
                <td>${asset.fromVin || '-'}</td>
                <td>${asset.toVin || '-'}</td>
                <td>
                    <span class="compatibility-badge ${compatibilityClass}">${asset.compatibility || '-'}</span>
                </td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-outline-primary" onclick="editAsset('${assetId}')" title="Edit">
                            <i class="material-icons">edit</i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteAsset('${assetId}')" title="Delete">
                            <i class="material-icons">delete</i>
                        </button>
                    </div>
                </td>
            </tr>
        `);
        containers.table.append(tableRow);

        // Grid View
        const gridItem = $(`
            <div class="assets-grid-item" data-asset-id="${assetId}">
                <div class="assets-card">
                    <div class="assets-card-header">
                        <div class="form-check">
                            <input class="form-check-input assets-checkbox" type="checkbox" value="${assetId}">
                        </div>
                        <div class="asset-brand">${asset.brand}</div>
                        <div class="asset-type">${asset.assetType}</div>
                    </div>
                    <div class="assets-card-body">
                        <div class="asset-main">
                            <div class="asset-model">
                                <span class="label">Model</span>
                                <span class="value">${asset.model}</span>
                            </div>
                            <div class="asset-year">
                                <span class="label">Year Range</span>
                                <span class="value">${asset.yearRange}</span>
                            </div>
                        </div>
                        <div class="asset-details">
                            <div class="detail-item">
                                <i class="material-icons">build</i>
                                <span>${asset.engineType}</span>
                            </div>
                            <div class="detail-item">
                                <i class="material-icons">local_gas_station</i>
                                <span>${asset.fuelType}</span>
                            </div>
                            <div class="detail-item compatibility ${compatibilityClass}">
                                <i class="material-icons">check_circle</i>
                                <span>${asset.compatibility}</span>
                            </div>
                        </div>
                        <div class="asset-vin">
                            <div class="vin-range">
                                <span class="label">VIN Range</span>
                                <span class="value">${asset.fromVin} - ${asset.toVin}</span>
                            </div>
                        </div>
                    </div>
                    <div class="assets-card-footer">
                        <button class="btn btn-sm btn-outline-primary" onclick="editAsset('${assetId}')">
                            <i class="material-icons">edit</i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteAsset('${assetId}')">
                            <i class="material-icons">delete</i>
                        </button>
                    </div>
                </div>
            </div>
        `);
        containers.grid.append(gridItem);

        // Generate other views (list, cards, tiles, compact)
        generateUniformViews('assets', asset, assetId, containers);
    }

    // Update Competitor Price Details Tab with Uniform Structure
    function updateCompetitorPriceDetailsTab(part) {
        try {
            // Clear all view containers
            const containers = {
                table: $('#competitorDetailsTableBody'),
                grid: $('#competitorGridView'),
                list: $('#competitorListView'),
                cards: $('#competitorCardsView'),
                tiles: $('#competitorTilesView'),
                compact: $('#competitorCompactView')
            };

            Object.values(containers).forEach(container => container.empty());

            // Check if data exists
            if (!part.competitorPriceDetails || !Array.isArray(part.competitorPriceDetails)) {
                console.warn('No competitor price details available for this part');
                showEmptyState(containers, 'competitor', 'No competitor price information available');
                return;
            }

            // Update summary cards
            updateCompetitorSummary(part.competitorPriceDetails);

            // Populate all views
            part.competitorPriceDetails.forEach((competitor, index) => {
                generateCompetitorViews(competitor, index, containers);
            });

            // Initialize view switching and selection
            initializeViewSwitching('competitor');
            initializeSelection('competitor');

        } catch (error) {
            console.error('Error updating competitor price details tab:', error);
            showErrorState('competitor', 'Error loading competitor price information');
        }
    }

    function updateCompetitorSummary(competitorDetails) {
        const totalCompetitors = competitorDetails.length;
        const bestPrice = Math.min(...competitorDetails.map(c => c.netRate));
        const recentUpdates = competitorDetails.filter(c => {
            const updateDate = new Date(c.lastUpdated);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return updateDate > thirtyDaysAgo;
        }).length;
        const avgPrice = competitorDetails.reduce((sum, c) => sum + c.netRate, 0) / totalCompetitors;

        $('#totalCompetitorsValue').text(totalCompetitors);
        $('#bestPriceValue').text(`$${bestPrice.toFixed(2)}`);
        $('#recentUpdatesValue').text(recentUpdates);
        $('#avgPriceValue').text(`$${avgPrice.toFixed(2)}`);
    }

    function generateCompetitorViews(competitor, index, containers) {
        const competitorId = competitor.id || `competitor_${index}`;
        const availabilityClass = competitor.availability === 'In Stock' ? 'availability-in-stock' :
                                competitor.availability === 'Limited Stock' ? 'availability-limited' : 'availability-out-stock';

        // Table View
        const tableRow = $(`
            <tr data-competitor-id="${competitorId}">
                <td>
                    <div class="form-check">
                        <input class="form-check-input competitor-checkbox" type="checkbox" value="${competitorId}">
                    </div>
                </td>
                <td>${competitor.competitorName || '-'}</td>
                <td>$${(competitor.netRate || 0).toFixed(2)}</td>
                <td>$${(competitor.costPrice || 0).toFixed(2)}</td>
                <td>${competitor.effectiveFrom || '-'}</td>
                <td>${competitor.remarks || '-'}</td>
                <td>${competitor.modifiedBy || '-'}</td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-outline-primary" onclick="editCompetitor('${competitorId}')" title="Edit">
                            <i class="material-icons">edit</i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteCompetitor('${competitorId}')" title="Delete">
                            <i class="material-icons">delete</i>
                        </button>
                    </div>
                </td>
            </tr>
        `);
        containers.table.append(tableRow);

        // Grid View
        const gridItem = $(`
            <div class="competitor-grid-item" data-competitor-id="${competitorId}">
                <div class="competitor-card">
                    <div class="competitor-card-header">
                        <div class="form-check">
                            <input class="form-check-input competitor-checkbox" type="checkbox" value="${competitorId}">
                        </div>
                        <div class="competitor-name">${competitor.competitorName}</div>
                        <div class="competitor-availability ${availabilityClass}">${competitor.availability}</div>
                    </div>
                    <div class="competitor-card-body">
                        <div class="competitor-main">
                            <div class="net-rate">
                                <span class="price-label">Net Rate</span>
                                <span class="price-value">$${competitor.netRate.toFixed(2)}</span>
                            </div>
                            <div class="cost-price">
                                <span class="price-label">Cost Price</span>
                                <span class="price-value">$${competitor.costPrice.toFixed(2)}</span>
                            </div>
                        </div>
                        <div class="competitor-details">
                            <div class="detail-item">
                                <i class="material-icons">schedule</i>
                                <span>Lead Time: ${competitor.leadTime}</span>
                            </div>
                            <div class="detail-item">
                                <i class="material-icons">inventory</i>
                                <span>Min Qty: ${competitor.minimumOrderQty}</span>
                            </div>
                            <div class="detail-item">
                                <i class="material-icons">calendar_today</i>
                                <span>Effective: ${competitor.effectiveFrom}</span>
                            </div>
                        </div>
                        <div class="competitor-remarks">
                            <span class="remarks-text">${competitor.remarks}</span>
                        </div>
                    </div>
                    <div class="competitor-card-footer">
                        <button class="btn btn-sm btn-outline-primary" onclick="editCompetitor('${competitorId}')">
                            <i class="material-icons">edit</i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteCompetitor('${competitorId}')">
                            <i class="material-icons">delete</i>
                        </button>
                    </div>
                </div>
            </div>
        `);
        containers.grid.append(gridItem);

        // Generate other views (list, cards, tiles, compact)
        generateUniformViews('competitor', competitor, competitorId, containers);
    }

    // Update Attachments Tab with Uniform Structure
    function updateAttachmentsTab(part) {
        try {
            // Clear all view containers
            const containers = {
                table: $('#filesDetailsTableBody'),
                grid: $('#filesGridView'),
                list: $('#filesListView'),
                cards: $('#filesCardsView'),
                tiles: $('#filesTilesView'),
                compact: $('#filesCompactView')
            };

            Object.values(containers).forEach(container => container.empty());

            // Check if data exists
            if (!part.attachments || !Array.isArray(part.attachments)) {
                console.warn('No attachments available for this part');
                showEmptyState(containers, 'files', 'No file attachments available');
                return;
            }

            // Update summary cards
            updateFilesSummary(part.attachments);

            // Populate all views
            part.attachments.forEach((file, index) => {
                generateFilesViews(file, index, containers);
            });

            // Initialize view switching and selection
            initializeViewSwitching('files');
            initializeSelection('files');

        } catch (error) {
            console.error('Error updating attachments tab:', error);
            showErrorState('files', 'Error loading file attachments');
        }
    }

    function updateFilesSummary(attachments) {
        const totalFiles = attachments.length;
        const imagesCount = attachments.filter(f => f.fileType === 'Image' || f.fileType === 'PDF').length;
        const documentsCount = attachments.filter(f => f.fileType === 'PDF' || f.fileType === 'Excel' || f.fileType === 'CAD').length;
        const totalSize = attachments.reduce((sum, f) => {
            const sizeValue = parseFloat(f.fileSize.replace(/[^\d.]/g, ''));
            const unit = f.fileSize.includes('MB') ? 1 : f.fileSize.includes('KB') ? 0.001 : 1;
            return sum + (sizeValue * unit);
        }, 0);

        $('#totalFilesValue').text(totalFiles);
        $('#imagesCountValue').text(imagesCount);
        $('#documentsCountValue').text(documentsCount);
        $('#totalSizeValue').text(`${totalSize.toFixed(1)} MB`);
    }

    function generateFilesViews(file, index, containers) {
        const fileId = file.id || `file_${index}`;
        const fileTypeClass = file.fileType.toLowerCase().replace(/\s+/g, '-');
        const publicClass = file.isPublic ? 'file-public' : 'file-private';

        // Table View
        const tableRow = $(`
            <tr data-file-id="${fileId}">
                <td>
                    <div class="form-check">
                        <input class="form-check-input files-checkbox" type="checkbox" value="${fileId}">
                    </div>
                </td>
                <td>
                    <div class="file-info">
                        <i class="material-icons file-icon">${getFileIcon(file.fileType)}</i>
                        <span>${file.fileName || '-'}</span>
                    </div>
                </td>
                <td><span class="badge bg-secondary">${file.fileType || '-'}</span></td>
                <td>${file.fileSize || '-'}</td>
                <td>${file.uploadedBy || '-'}</td>
                <td>${file.uploadDate || '-'}</td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-outline-primary" onclick="downloadFile('${fileId}')" title="Download">
                            <i class="material-icons">download</i>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary" onclick="previewFile('${fileId}')" title="Preview">
                            <i class="material-icons">visibility</i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteFile('${fileId}')" title="Delete">
                            <i class="material-icons">delete</i>
                        </button>
                    </div>
                </td>
            </tr>
        `);
        containers.table.append(tableRow);

        // Grid View
        const gridItem = $(`
            <div class="files-grid-item" data-file-id="${fileId}">
                <div class="files-card">
                    <div class="files-card-header">
                        <div class="form-check">
                            <input class="form-check-input files-checkbox" type="checkbox" value="${fileId}">
                        </div>
                        <div class="file-type-icon ${fileTypeClass}">
                            <i class="material-icons">${getFileIcon(file.fileType)}</i>
                        </div>
                        <div class="file-privacy ${publicClass}">
                            <i class="material-icons">${file.isPublic ? 'public' : 'lock'}</i>
                        </div>
                    </div>
                    <div class="files-card-body">
                        <div class="file-main">
                            <div class="file-name" title="${file.fileName}">${file.fileName}</div>
                            <div class="file-description">${file.fileDescription}</div>
                        </div>
                        <div class="file-details">
                            <div class="detail-item">
                                <i class="material-icons">storage</i>
                                <span>${file.fileSize}</span>
                            </div>
                            <div class="detail-item">
                                <i class="material-icons">person</i>
                                <span>${file.uploadedBy}</span>
                            </div>
                            <div class="detail-item">
                                <i class="material-icons">calendar_today</i>
                                <span>${file.uploadDate.split(' ')[0]}</span>
                            </div>
                        </div>
                        <div class="file-stats">
                            <div class="stat-item">
                                <span class="stat-label">Downloads:</span>
                                <span class="stat-value">${file.downloadCount}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Version:</span>
                                <span class="stat-value">${file.version}</span>
                            </div>
                        </div>
                    </div>
                    <div class="files-card-footer">
                        <button class="btn btn-sm btn-outline-primary" onclick="downloadFile('${fileId}')">
                            <i class="material-icons">download</i>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary" onclick="previewFile('${fileId}')">
                            <i class="material-icons">visibility</i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteFile('${fileId}')">
                            <i class="material-icons">delete</i>
                        </button>
                    </div>
                </div>
            </div>
        `);
        containers.grid.append(gridItem);

        // Generate other views (list, cards, tiles, compact)
        generateUniformViews('files', file, fileId, containers);
    }

    // Helper function to get file icon based on file type
    function getFileIcon(fileType) {
        switch (fileType.toLowerCase()) {
            case 'pdf': return 'picture_as_pdf';
            case 'excel': return 'table_chart';
            case 'image': return 'image';
            case 'video': return 'videocam';
            case 'cad': return 'architecture';
            default: return 'description';
        }
    }

    // Placeholder functions for file operations
    window.downloadFile = function(fileId) {
        console.log('Downloading file:', fileId);
        showNotification('Download started!', 'success');
    };

    window.previewFile = function(fileId) {
        console.log('Previewing file:', fileId);
        showNotification('Preview functionality coming soon!', 'info');
    };

    window.deleteFile = function(fileId) {
        console.log('Deleting file:', fileId);
        showNotification('File deleted!', 'warning');
    };

    // Placeholder functions for other operations
    window.editPricing = function(pricingId) {
        console.log('Editing pricing:', pricingId);
        showNotification('Edit pricing functionality coming soon!', 'info');
    };

    window.deletePricing = function(pricingId) {
        console.log('Deleting pricing:', pricingId);
        showNotification('Pricing deleted!', 'warning');
    };

    window.editManufacturer = function(manufacturerId) {
        console.log('Editing manufacturer:', manufacturerId);
        showNotification('Edit manufacturer functionality coming soon!', 'info');
    };

    window.deleteManufacturer = function(manufacturerId) {
        console.log('Deleting manufacturer:', manufacturerId);
        showNotification('Manufacturer deleted!', 'warning');
    };

    window.editAsset = function(assetId) {
        console.log('Editing asset:', assetId);
        showNotification('Edit asset functionality coming soon!', 'info');
    };

    window.deleteAsset = function(assetId) {
        console.log('Deleting asset:', assetId);
        showNotification('Asset deleted!', 'warning');
    };

    window.editCompetitor = function(competitorId) {
        console.log('Editing competitor:', competitorId);
        showNotification('Edit competitor functionality coming soon!', 'info');
    };

    window.deleteCompetitor = function(competitorId) {
        console.log('Deleting competitor:', competitorId);
        showNotification('Competitor deleted!', 'warning');
    };

    // Export functionality
    window.exportData = function () {
        console.log('Exporting part data...');
        showNotification('Export functionality coming soon!', 'info');
    };
});
