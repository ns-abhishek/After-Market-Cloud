// Campaign Management System
class CampaignManager {
    constructor() {
        this.campaigns = this.loadCampaigns();
        this.currentEditId = null;
        this.selectedFailCodes = []; // Array to store multiple fail codes
        this.selectedAssets = []; // Array to store selected assets
        this.selectedOperations = []; // Array to store multiple operations
        this.selectedParts = []; // Array to store multiple parts
        this.selectedLabor = []; // Array to store multiple labor charges
        this.selectedRegions = []; // Array to store selected regions
        this.selectedStates = []; // Array to store selected states
        this.addedCustomers = []; // Array to store added customers
        this.selectedCausingParts = []; // Array to store selected causing parts
        this.selectedAttachments = []; // Array to store selected attachments
        this.failCodeDatabase = this.initializeFailCodeDatabase();
        this.assetDatabase = this.initializeAssetDatabase();
        this.operationDatabase = this.initializeOperationDatabase();
        this.partsDatabase = this.initializePartsDatabase();
        this.laborDatabase = this.initializeLaborDatabase();
        this.regionDatabase = this.initializeRegionDatabase();
        this.causingPartsDatabase = this.initializeCausingPartsDatabase();
        this.currentPage = 1;
        this.pageSize = 6; // Show 6 campaigns per page
        this.filteredAssets = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeTabs();
        this.renderCampaigns();
        console.log('Campaign Manager initialized');
    }

    // Initialize fail code database
    initializeFailCodeDatabase() {
        return [
            { code: 'FC001', description: 'Engine overheating due to coolant leak', category: 'mechanical' },
            { code: 'FC002', description: 'Brake system failure - worn brake pads', category: 'mechanical' },
            { code: 'FC003', description: 'Electrical short circuit in main harness', category: 'electrical' },
            { code: 'FC004', description: 'Hydraulic pump pressure loss', category: 'hydraulic' },
            { code: 'FC005', description: 'Software error in control module', category: 'software' },
            { code: 'FC006', description: 'Transmission fluid leak', category: 'mechanical' },
            { code: 'FC007', description: 'Battery charging system malfunction', category: 'electrical' },
            { code: 'FC008', description: 'Air compressor failure', category: 'pneumatic' },
            { code: 'FC009', description: 'Structural crack in main frame', category: 'structural' },
            { code: 'FC010', description: 'Fuel injection system clogged', category: 'mechanical' },
            { code: 'FC011', description: 'Alternator bearing failure', category: 'electrical' },
            { code: 'FC012', description: 'Hydraulic cylinder seal leak', category: 'hydraulic' },
            { code: 'FC013', description: 'ECU communication error', category: 'software' },
            { code: 'FC014', description: 'Clutch disc worn beyond limits', category: 'mechanical' },
            { code: 'FC015', description: 'Wiring harness corrosion', category: 'electrical' },
            { code: 'FC016', description: 'Pneumatic valve stuck open', category: 'pneumatic' },
            { code: 'FC017', description: 'Welding joint failure', category: 'structural' },
            { code: 'FC018', description: 'Oil filter bypass valve stuck', category: 'mechanical' },
            { code: 'FC019', description: 'Sensor calibration drift', category: 'electrical' },
            { code: 'FC020', description: 'Firmware update required', category: 'software' },
            { code: 'FC021', description: 'Bearing race pitting', category: 'mechanical' },
            { code: 'FC022', description: 'Ground connection loose', category: 'electrical' },
            { code: 'FC023', description: 'Hydraulic filter contamination', category: 'hydraulic' },
            { code: 'FC024', description: 'Air line blockage', category: 'pneumatic' },
            { code: 'FC025', description: 'Mounting bracket fatigue crack', category: 'structural' }
        ];
    }

    // Initialize asset database
    initializeAssetDatabase() {
        return [
            { id: 1, brand: 'Caterpillar', assetType: 'Excavator', model: '320D', serialNumber: 'CAT001234', workOrderNumber: 'WO-2024-001' },
            { id: 2, brand: 'Caterpillar', assetType: 'Bulldozer', model: 'D6T', serialNumber: 'CAT001235', workOrderNumber: 'WO-2024-002' },
            { id: 3, brand: 'Komatsu', assetType: 'Excavator', model: 'PC200', serialNumber: 'KOM001236', workOrderNumber: 'WO-2024-003' },
            { id: 4, brand: 'Komatsu', assetType: 'Loader', model: 'WA380', serialNumber: 'KOM001237', workOrderNumber: 'WO-2024-004' },
            { id: 5, brand: 'John Deere', assetType: 'Tractor', model: '8R 370', serialNumber: 'JD001238', workOrderNumber: 'WO-2024-005' },
            { id: 6, brand: 'John Deere', assetType: 'Harvester', model: '1270G', serialNumber: 'JD001239', workOrderNumber: 'WO-2024-006' },
            { id: 7, brand: 'Volvo', assetType: 'Excavator', model: 'EC220E', serialNumber: 'VOL001240', workOrderNumber: 'WO-2024-007' },
            { id: 8, brand: 'Volvo', assetType: 'Truck', model: 'FH16', serialNumber: 'VOL001241', workOrderNumber: 'WO-2024-008' },
            { id: 9, brand: 'Liebherr', assetType: 'Crane', model: 'LTM 1100', serialNumber: 'LIE001242', workOrderNumber: 'WO-2024-009' },
            { id: 10, brand: 'Liebherr', assetType: 'Excavator', model: 'R 926', serialNumber: 'LIE001243', workOrderNumber: 'WO-2024-010' },
            { id: 11, brand: 'Hitachi', assetType: 'Excavator', model: 'ZX200', serialNumber: 'HIT001244', workOrderNumber: 'WO-2024-011' },
            { id: 12, brand: 'Hitachi', assetType: 'Dump Truck', model: 'EH3500', serialNumber: 'HIT001245', workOrderNumber: 'WO-2024-012' },
            { id: 13, brand: 'Case', assetType: 'Backhoe', model: '580N', serialNumber: 'CAS001246', workOrderNumber: 'WO-2024-013' },
            { id: 14, brand: 'Case', assetType: 'Skid Steer', model: 'SR175', serialNumber: 'CAS001247', workOrderNumber: 'WO-2024-014' },
            { id: 15, brand: 'Bobcat', assetType: 'Skid Steer', model: 'S650', serialNumber: 'BOB001248', workOrderNumber: 'WO-2024-015' },
            { id: 16, brand: 'Bobcat', assetType: 'Compact Excavator', model: 'E35', serialNumber: 'BOB001249', workOrderNumber: 'WO-2024-016' },
            { id: 17, brand: 'Hyundai', assetType: 'Excavator', model: 'HX220L', serialNumber: 'HYU001250', workOrderNumber: 'WO-2024-017' },
            { id: 18, brand: 'Hyundai', assetType: 'Wheel Loader', model: 'HL955', serialNumber: 'HYU001251', workOrderNumber: 'WO-2024-018' },
            { id: 19, brand: 'Doosan', assetType: 'Excavator', model: 'DX225LC', serialNumber: 'DOO001252', workOrderNumber: 'WO-2024-019' },
            { id: 20, brand: 'Doosan', assetType: 'Forklift', model: 'D30S', serialNumber: 'DOO001253', workOrderNumber: 'WO-2024-020' },
            { id: 21, brand: 'Caterpillar', assetType: 'Grader', model: '140M', serialNumber: 'CAT001254', workOrderNumber: 'WO-2024-021' },
            { id: 22, brand: 'Komatsu', assetType: 'Bulldozer', model: 'D65PX', serialNumber: 'KOM001255', workOrderNumber: 'WO-2024-022' },
            { id: 23, brand: 'John Deere', assetType: 'Combine', model: 'S780', serialNumber: 'JD001256', workOrderNumber: 'WO-2024-023' },
            { id: 24, brand: 'Volvo', assetType: 'Articulated Hauler', model: 'A40G', serialNumber: 'VOL001257', workOrderNumber: 'WO-2024-024' },
            { id: 25, brand: 'Liebherr', assetType: 'Wheel Loader', model: 'L566', serialNumber: 'LIE001258', workOrderNumber: 'WO-2024-025' }
        ];
    }

    // Initialize operation database
    initializeOperationDatabase() {
        return [
            { code: 'OP001', description: 'Engine oil change and filter replacement', time: 2.0 },
            { code: 'OP002', description: 'Brake system inspection and adjustment', time: 1.5 },
            { code: 'OP003', description: 'Hydraulic fluid level check and top-up', time: 0.5 },
            { code: 'OP004', description: 'Transmission service and fluid change', time: 3.0 },
            { code: 'OP005', description: 'Air filter replacement', time: 0.5 },
            { code: 'OP006', description: 'Fuel filter replacement', time: 1.0 },
            { code: 'OP007', description: 'Battery terminal cleaning and testing', time: 0.5 },
            { code: 'OP008', description: 'Tire pressure check and adjustment', time: 0.5 },
            { code: 'OP009', description: 'Coolant system flush and refill', time: 2.5 },
            { code: 'OP010', description: 'Electrical system diagnostic scan', time: 1.0 },
            { code: 'OP011', description: 'Hydraulic hose inspection and replacement', time: 2.0 },
            { code: 'OP012', description: 'Grease all lubrication points', time: 1.0 },
            { code: 'OP013', description: 'Track tension adjustment', time: 1.5 },
            { code: 'OP014', description: 'Cab air filter replacement', time: 0.5 },
            { code: 'OP015', description: 'Undercarriage cleaning and inspection', time: 2.0 },
            { code: 'OP016', description: 'Hydraulic cylinder seal replacement', time: 4.0 },
            { code: 'OP017', description: 'Engine belt inspection and replacement', time: 1.5 },
            { code: 'OP018', description: 'Radiator cleaning and pressure test', time: 2.0 },
            { code: 'OP019', description: 'Starter motor testing and service', time: 2.5 },
            { code: 'OP020', description: 'Alternator testing and replacement', time: 3.0 },
            { code: 'OP021', description: 'Fuel injection system cleaning', time: 3.5 },
            { code: 'OP022', description: 'Turbocharger inspection and service', time: 4.0 },
            { code: 'OP023', description: 'Exhaust system inspection and repair', time: 2.5 },
            { code: 'OP024', description: 'Differential oil change', time: 1.5 },
            { code: 'OP025', description: 'Final drive service', time: 2.0 },
            { code: 'OP026', description: 'Swing motor service', time: 3.0 },
            { code: 'OP027', description: 'Boom cylinder rebuild', time: 6.0 },
            { code: 'OP028', description: 'Bucket cylinder service', time: 4.0 },
            { code: 'OP029', description: 'Main hydraulic pump service', time: 8.0 },
            { code: 'OP030', description: 'Control valve calibration', time: 2.0 }
        ];
    }

    // Initialize parts database
    initializePartsDatabase() {
        return [
            { prefix: 'ENG', partNumber: 'ENG001', description: 'Engine Oil Filter - Heavy Duty' },
            { prefix: 'ENG', partNumber: 'ENG002', description: 'Engine Air Filter - Primary' },
            { prefix: 'ENG', partNumber: 'ENG003', description: 'Engine Fuel Filter - Water Separator' },
            { prefix: 'ENG', partNumber: 'ENG004', description: 'Engine Coolant Thermostat' },
            { prefix: 'ENG', partNumber: 'ENG005', description: 'Engine Belt - Serpentine Drive' },
            { prefix: 'HYD', partNumber: 'HYD001', description: 'Hydraulic Oil Filter - Return' },
            { prefix: 'HYD', partNumber: 'HYD002', description: 'Hydraulic Hose - High Pressure' },
            { prefix: 'HYD', partNumber: 'HYD003', description: 'Hydraulic Cylinder Seal Kit' },
            { prefix: 'HYD', partNumber: 'HYD004', description: 'Hydraulic Pump - Main' },
            { prefix: 'HYD', partNumber: 'HYD005', description: 'Hydraulic Valve - Control Block' },
            { prefix: 'TRK', partNumber: 'TRK001', description: 'Track Chain - Master Pin' },
            { prefix: 'TRK', partNumber: 'TRK002', description: 'Track Pad - Rubber' },
            { prefix: 'TRK', partNumber: 'TRK003', description: 'Track Sprocket - Drive' },
            { prefix: 'TRK', partNumber: 'TRK004', description: 'Track Idler - Front' },
            { prefix: 'TRK', partNumber: 'TRK005', description: 'Track Roller - Bottom' },
            { prefix: 'BRK', partNumber: 'BRK001', description: 'Brake Pad Set - Front' },
            { prefix: 'BRK', partNumber: 'BRK002', description: 'Brake Disc - Ventilated' },
            { prefix: 'BRK', partNumber: 'BRK003', description: 'Brake Caliper - Rebuilt' },
            { prefix: 'BRK', partNumber: 'BRK004', description: 'Brake Fluid - DOT 4' },
            { prefix: 'BRK', partNumber: 'BRK005', description: 'Brake Line - Steel Braided' },
            { prefix: 'ELE', partNumber: 'ELE001', description: 'Electrical Harness - Main' },
            { prefix: 'ELE', partNumber: 'ELE002', description: 'Battery - Heavy Duty 12V' },
            { prefix: 'ELE', partNumber: 'ELE003', description: 'Alternator - 24V 100A' },
            { prefix: 'ELE', partNumber: 'ELE004', description: 'Starter Motor - Rebuilt' },
            { prefix: 'ELE', partNumber: 'ELE005', description: 'ECU - Engine Control Unit' },
            { prefix: 'CAB', partNumber: 'CAB001', description: 'Cabin Air Filter' },
            { prefix: 'CAB', partNumber: 'CAB002', description: 'Seat Cushion - Operator' },
            { prefix: 'CAB', partNumber: 'CAB003', description: 'Window Glass - Side' },
            { prefix: 'CAB', partNumber: 'CAB004', description: 'Door Handle - External' },
            { prefix: 'CAB', partNumber: 'CAB005', description: 'Mirror Assembly - Right' }
        ];
    }

    // Initialize labor database
    initializeLaborDatabase() {
        return [
            { code: 'LAB001', description: 'Engine diagnostic and troubleshooting', rate: 85.00 },
            { code: 'LAB002', description: 'Hydraulic system repair and maintenance', rate: 90.00 },
            { code: 'LAB003', description: 'Electrical system diagnosis and repair', rate: 95.00 },
            { code: 'LAB004', description: 'Transmission service and repair', rate: 100.00 },
            { code: 'LAB005', description: 'Brake system inspection and service', rate: 75.00 },
            { code: 'LAB006', description: 'Cooling system maintenance', rate: 70.00 },
            { code: 'LAB007', description: 'Fuel system cleaning and repair', rate: 80.00 },
            { code: 'LAB008', description: 'Track and undercarriage service', rate: 85.00 },
            { code: 'LAB009', description: 'Cab and operator controls service', rate: 65.00 },
            { code: 'LAB010', description: 'Preventive maintenance inspection', rate: 60.00 },
            { code: 'LAB011', description: 'Welding and fabrication services', rate: 110.00 },
            { code: 'LAB012', description: 'Pneumatic system repair', rate: 85.00 },
            { code: 'LAB013', description: 'Turbocharger service and repair', rate: 120.00 },
            { code: 'LAB014', description: 'Final drive and differential service', rate: 95.00 },
            { code: 'LAB015', description: 'Starter and alternator service', rate: 90.00 },
            { code: 'LAB016', description: 'Air conditioning system service', rate: 85.00 },
            { code: 'LAB017', description: 'Hydraulic cylinder rebuild', rate: 105.00 },
            { code: 'LAB018', description: 'Engine overhaul and rebuild', rate: 130.00 },
            { code: 'LAB019', description: 'Transmission overhaul', rate: 125.00 },
            { code: 'LAB020', description: 'General mechanical repair', rate: 75.00 },
            { code: 'LAB021', description: 'Software programming and calibration', rate: 100.00 },
            { code: 'LAB022', description: 'Safety system inspection', rate: 70.00 },
            { code: 'LAB023', description: 'Attachment installation and setup', rate: 80.00 },
            { code: 'LAB024', description: 'Machine delivery and setup', rate: 65.00 },
            { code: 'LAB025', description: 'Emergency field service', rate: 150.00 }
        ];
    }

    // Initialize region database
    initializeRegionDatabase() {
        return {
            canada: {
                name: 'Canada',
                states: ['Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Manitoba', 'Saskatchewan', 'Nova Scotia', 'New Brunswick', 'Newfoundland and Labrador', 'Prince Edward Island', 'Northwest Territories', 'Nunavut', 'Yukon']
            },
            east: {
                name: 'East',
                states: ['New York', 'Pennsylvania', 'New Jersey', 'Connecticut', 'Massachusetts', 'Rhode Island', 'Vermont', 'New Hampshire', 'Maine']
            },
            mexico: {
                name: 'Mexico',
                states: ['Jalisco', 'Nuevo León', 'Estado de México', 'Ciudad de México', 'Veracruz', 'Puebla', 'Guanajuato', 'Chihuahua', 'Sonora', 'Coahuila']
            },
            north: {
                name: 'North',
                states: ['Minnesota', 'Wisconsin', 'Michigan', 'North Dakota', 'South Dakota', 'Iowa', 'Illinois', 'Indiana', 'Ohio']
            },
            others: {
                name: 'Others',
                states: ['Alaska', 'Hawaii', 'Puerto Rico', 'Virgin Islands', 'Guam', 'American Samoa']
            },
            south: {
                name: 'South',
                states: ['Texas', 'Florida', 'Georgia', 'North Carolina', 'Virginia', 'Tennessee', 'Louisiana', 'South Carolina', 'Alabama', 'Mississippi', 'Arkansas', 'Kentucky', 'West Virginia', 'Oklahoma']
            },
            us: {
                name: 'US',
                states: ['California', 'New York', 'Texas', 'Florida', 'Illinois', 'Pennsylvania', 'Ohio', 'Georgia', 'North Carolina', 'Michigan']
            },
            west: {
                name: 'West',
                states: ['California', 'Nevada', 'Oregon', 'Washington', 'Arizona', 'Utah', 'Colorado', 'New Mexico', 'Wyoming', 'Montana', 'Idaho']
            }
        };
    }

    // Initialize causing parts database
    initializeCausingPartsDatabase() {
        return [
            { prefix: 'ENG', partNumber: 'ENG001', description: 'Engine Block Assembly' },
            { prefix: 'ENG', partNumber: 'ENG002', description: 'Cylinder Head' },
            { prefix: 'ENG', partNumber: 'ENG003', description: 'Piston Assembly' },
            { prefix: 'ENG', partNumber: 'ENG004', description: 'Crankshaft' },
            { prefix: 'ENG', partNumber: 'ENG005', description: 'Camshaft' },
            { prefix: 'HYD', partNumber: 'HYD001', description: 'Hydraulic Pump' },
            { prefix: 'HYD', partNumber: 'HYD002', description: 'Hydraulic Cylinder' },
            { prefix: 'HYD', partNumber: 'HYD003', description: 'Hydraulic Filter' },
            { prefix: 'HYD', partNumber: 'HYD004', description: 'Hydraulic Hose Assembly' },
            { prefix: 'HYD', partNumber: 'HYD005', description: 'Hydraulic Valve' },
            { prefix: 'TRN', partNumber: 'TRN001', description: 'Transmission Assembly' },
            { prefix: 'TRN', partNumber: 'TRN002', description: 'Torque Converter' },
            { prefix: 'TRN', partNumber: 'TRN003', description: 'Transmission Filter' },
            { prefix: 'TRN', partNumber: 'TRN004', description: 'Gear Set' },
            { prefix: 'TRN', partNumber: 'TRN005', description: 'Clutch Pack' },
            { prefix: 'ELE', partNumber: 'ELE001', description: 'Alternator' },
            { prefix: 'ELE', partNumber: 'ELE002', description: 'Starter Motor' },
            { prefix: 'ELE', partNumber: 'ELE003', description: 'ECU Module' },
            { prefix: 'ELE', partNumber: 'ELE004', description: 'Wiring Harness' },
            { prefix: 'ELE', partNumber: 'ELE005', description: 'Battery' },
            { prefix: 'BRK', partNumber: 'BRK001', description: 'Brake Pad Set' },
            { prefix: 'BRK', partNumber: 'BRK002', description: 'Brake Disc' },
            { prefix: 'BRK', partNumber: 'BRK003', description: 'Brake Caliper' },
            { prefix: 'BRK', partNumber: 'BRK004', description: 'Brake Master Cylinder' },
            { prefix: 'BRK', partNumber: 'BRK005', description: 'Brake Fluid Reservoir' },
            { prefix: 'COL', partNumber: 'COL001', description: 'Radiator' },
            { prefix: 'COL', partNumber: 'COL002', description: 'Water Pump' },
            { prefix: 'COL', partNumber: 'COL003', description: 'Thermostat' },
            { prefix: 'COL', partNumber: 'COL004', description: 'Cooling Fan' },
            { prefix: 'COL', partNumber: 'COL005', description: 'Coolant Hose' },
            { prefix: 'FUL', partNumber: 'FUL001', description: 'Fuel Pump' },
            { prefix: 'FUL', partNumber: 'FUL002', description: 'Fuel Filter' },
            { prefix: 'FUL', partNumber: 'FUL003', description: 'Fuel Injector' },
            { prefix: 'FUL', partNumber: 'FUL004', description: 'Fuel Tank' },
            { prefix: 'FUL', partNumber: 'FUL005', description: 'Fuel Line Assembly' }
        ];
    }

    // Bind all event listeners
    bindEvents() {
        // Add campaign buttons
        const addBtn = document.getElementById('addCampaignBtn');
        const addFirstBtn = document.getElementById('addFirstCampaignBtn');

        if (addBtn) {
            addBtn.addEventListener('click', () => this.openAddModal());
        }

        if (addFirstBtn) {
            addFirstBtn.addEventListener('click', () => this.openAddModal());
        }

        // Modal close buttons
        document.getElementById('closeModal').addEventListener('click', () => this.closeModal());
        document.getElementById('closeViewModal').addEventListener('click', () => this.closeViewModal());
        document.getElementById('closeDeleteModal').addEventListener('click', () => this.closeDeleteModal());
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeModal());
        document.getElementById('closeViewBtn').addEventListener('click', () => this.closeViewModal());
        document.getElementById('cancelDeleteBtn').addEventListener('click', () => this.closeDeleteModal());
        document.getElementById('copyFromViewBtn').addEventListener('click', () => this.copyFromView());

        // Save and delete buttons
        document.getElementById('saveBtn').addEventListener('click', () => this.saveCampaign());
        document.getElementById('confirmDeleteBtn').addEventListener('click', () => this.confirmDelete());

        // Form submission
        document.getElementById('campaignForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCampaign();
        });

        // Close modal when clicking outside
        document.getElementById('campaignModal').addEventListener('click', (e) => {
            if (e.target.id === 'campaignModal') {
                this.closeModal();
            }
        });

        document.getElementById('viewModal').addEventListener('click', (e) => {
            if (e.target.id === 'viewModal') {
                this.closeViewModal();
            }
        });

        document.getElementById('deleteModal').addEventListener('click', (e) => {
            if (e.target.id === 'deleteModal') {
                this.closeDeleteModal();
            }
        });

        // Labor cost calculation - removed as we now use new labor structure

        // Fail code functionality
        const addFailCodeBtn = document.getElementById('addFailCodeBtn');
        const clearFailCodeBtn = document.getElementById('clearFailCodeBtn');

        if (addFailCodeBtn) {
            addFailCodeBtn.addEventListener('click', () => this.addFailCode());
        }

        if (clearFailCodeBtn) {
            clearFailCodeBtn.addEventListener('click', () => this.clearFailCodeForm());
        }

        // Asset functionality
        const searchAssetsBtn = document.getElementById('searchAssetsBtn');
        const clearFiltersBtn = document.getElementById('clearFiltersBtn');
        const selectAllAssetsBtn = document.getElementById('selectAllAssetsBtn');
        const addSelectedAssetsBtn = document.getElementById('addSelectedAssetsBtn');
        const selectAllCheckbox = document.getElementById('selectAllCheckbox');
        const prevPageBtn = document.getElementById('prevPageBtn');
        const nextPageBtn = document.getElementById('nextPageBtn');
        const pageSizeSelect = document.getElementById('pageSizeSelect');

        if (searchAssetsBtn) {
            searchAssetsBtn.addEventListener('click', () => this.searchAssets());
        }

        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => this.clearAssetFilters());
        }

        if (selectAllAssetsBtn) {
            selectAllAssetsBtn.addEventListener('click', () => this.selectAllAssets());
        }

        if (addSelectedAssetsBtn) {
            addSelectedAssetsBtn.addEventListener('click', () => this.addSelectedAssets());
        }

        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', (e) => this.toggleSelectAll(e.target.checked));
        }

        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', () => this.previousPage());
        }

        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', () => this.nextPage());
        }

        if (pageSizeSelect) {
            pageSizeSelect.addEventListener('change', (e) => this.changePageSize(parseInt(e.target.value)));
        }

        // Operation functionality
        const addOperationBtn = document.getElementById('addOperationBtn');
        const clearOperationBtn = document.getElementById('clearOperationBtn');

        if (addOperationBtn) {
            addOperationBtn.addEventListener('click', () => this.addOperation());
        }

        if (clearOperationBtn) {
            clearOperationBtn.addEventListener('click', () => this.clearOperationForm());
        }

        // Parts functionality
        const addPartBtn = document.getElementById('addPartBtn');
        const clearPartBtn = document.getElementById('clearPartBtn');

        if (addPartBtn) {
            addPartBtn.addEventListener('click', () => this.addPart());
        }

        if (clearPartBtn) {
            clearPartBtn.addEventListener('click', () => this.clearPartForm());
        }

        // Add real-time validation for discount and manufacturing contribution percentages
        const discountPercentField = document.getElementById('partDiscountPercent');
        const manufacturingContributionField = document.getElementById('partManufacturingContribution');

        if (discountPercentField) {
            discountPercentField.addEventListener('input', (e) => this.validatePercentageField(e.target, 'Discount %'));
            discountPercentField.addEventListener('blur', (e) => this.validatePercentageField(e.target, 'Discount %'));
        }

        if (manufacturingContributionField) {
            manufacturingContributionField.addEventListener('input', (e) => this.validatePercentageField(e.target, 'Manufacturing Contribution %'));
            manufacturingContributionField.addEventListener('blur', (e) => this.validatePercentageField(e.target, 'Manufacturing Contribution %'));
        }

        // Labor functionality
        const addLaborBtn = document.getElementById('addLaborBtn');
        const clearLaborBtn = document.getElementById('clearLaborBtn');

        if (addLaborBtn) {
            addLaborBtn.addEventListener('click', () => this.addLabor());
        }

        if (clearLaborBtn) {
            clearLaborBtn.addEventListener('click', () => this.clearLaborForm());
        }

        // Add real-time validation for labor discount and manufacturing contribution percentages
        const laborDiscountPercentField = document.getElementById('laborDiscountPercent');
        const laborManufacturingContributionField = document.getElementById('laborManufacturingContribution');

        if (laborDiscountPercentField) {
            laborDiscountPercentField.addEventListener('input', (e) => this.validatePercentageFieldWithClear(e.target, 'Labor Discount %'));
            laborDiscountPercentField.addEventListener('blur', (e) => this.validatePercentageFieldWithClear(e.target, 'Labor Discount %'));
        }

        if (laborManufacturingContributionField) {
            laborManufacturingContributionField.addEventListener('input', (e) => this.validatePercentageFieldWithClear(e.target, 'Labor Manufacturing Contribution %'));
            laborManufacturingContributionField.addEventListener('blur', (e) => this.validatePercentageFieldWithClear(e.target, 'Labor Manufacturing Contribution %'));
        }

            // Customer region functionality
        const selectAllRegionsCheckbox = document.getElementById('selectAllRegions');
        const okCustomerBtn = document.getElementById('okCustomerBtn');
        const clearCustomerBtn = document.getElementById('clearCustomerBtn');
        const regionSearchInput = document.getElementById('regionSearch');
        const statesSearchInput = document.getElementById('statesSearch');

        if (selectAllRegionsCheckbox) {
            selectAllRegionsCheckbox.addEventListener('change', (e) => this.toggleSelectAllRegions(e.target.checked));
        }

        if (okCustomerBtn) {
            okCustomerBtn.addEventListener('click', () => this.filterAndAddCustomers());
        }

        if (clearCustomerBtn) {
            clearCustomerBtn.addEventListener('click', () => this.clearCustomerSelection());
        }

        if (regionSearchInput) {
            regionSearchInput.addEventListener('input', (e) => this.filterRegions(e.target.value));
        }

        if (statesSearchInput) {
            statesSearchInput.addEventListener('input', (e) => this.filterStates(e.target.value));
        }

        // Causing parts functionality
        const addCausingPartBtn = document.getElementById('addCausingPartBtn');
        const clearCausingPartBtn = document.getElementById('clearCausingPartBtn');

        if (addCausingPartBtn) {
            addCausingPartBtn.addEventListener('click', () => this.addCausingPart());
        }

        if (clearCausingPartBtn) {
            clearCausingPartBtn.addEventListener('click', () => this.clearCausingPartForm());
        }

        // Initialize global keyboard navigation
        this.initializeGlobalKeyboardNavigation();

        // Attachments functionality
        const addAttachmentBtn = document.getElementById('addAttachmentBtn');
        const clearAttachmentBtn = document.getElementById('clearAttachmentBtn');
        const deleteSelectedAttachments = document.getElementById('deleteSelectedAttachments');
        const selectAllAttachments = document.getElementById('selectAllAttachments');

        if (addAttachmentBtn) {
            addAttachmentBtn.addEventListener('click', () => this.addAttachment());
        }

        if (clearAttachmentBtn) {
            clearAttachmentBtn.addEventListener('click', () => this.clearAttachmentForm());
        }

        if (deleteSelectedAttachments) {
            deleteSelectedAttachments.addEventListener('click', () => this.deleteSelectedAttachments());
        }

        if (selectAllAttachments) {
            selectAllAttachments.addEventListener('click', () => this.toggleSelectAllAttachments());
        }
    }

    // Initialize fail code search functionality
    initializeFailCodeSearch() {
        const searchInput = document.getElementById('failCodeSearch');
        const dropdown = document.getElementById('failCodeDropdown');
        const descriptionField = document.getElementById('failCodeDescription');
        const categoryField = document.getElementById('failCodeCategory');

        // Check if elements exist
        if (!searchInput || !dropdown || !descriptionField || !categoryField) {
            console.warn('Fail code elements not found, skipping initialization');
            return;
        }

        // Check if already initialized
        if (searchInput.hasAttribute('data-initialized')) {
            return;
        }
        searchInput.setAttribute('data-initialized', 'true');

        let currentHighlightIndex = -1;

        // Search input event
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            currentHighlightIndex = -1;

            if (query.length === 0) {
                dropdown.style.display = 'none';
                descriptionField.value = '';
                categoryField.value = '';
                return;
            }

            const filteredCodes = this.failCodeDatabase.filter(item =>
                item.code.toLowerCase().includes(query.toLowerCase()) ||
                item.description.toLowerCase().includes(query.toLowerCase())
            );

            if (filteredCodes.length > 0) {
                this.showFailCodeDropdown(filteredCodes, dropdown);
            } else {
                // Show "Not Available" message when no matches found
                dropdown.innerHTML = `
                    <div class="search-dropdown-item no-results">
                        "${query}" is not available
                    </div>
                `;
                dropdown.style.display = 'block';
            }
        });

        // Keyboard navigation
        searchInput.addEventListener('keydown', (e) => {
            const items = dropdown.querySelectorAll('.search-dropdown-item');

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                currentHighlightIndex = Math.min(currentHighlightIndex + 1, items.length - 1);
                this.updateHighlight(items, currentHighlightIndex);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                currentHighlightIndex = Math.max(currentHighlightIndex - 1, -1);
                this.updateHighlight(items, currentHighlightIndex);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (currentHighlightIndex >= 0 && items[currentHighlightIndex]) {
                    items[currentHighlightIndex].click();
                }
            } else if (e.key === 'Escape') {
                dropdown.style.display = 'none';
                currentHighlightIndex = -1;
            }
        });

        // Hide dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.style.display = 'none';
                currentHighlightIndex = -1;
            }
        });
    }

    // Initialize tab functionality
    initializeTabs() {
        const tabItems = document.querySelectorAll('.tab-item');
        const tabPanels = document.querySelectorAll('.tab-panel');

        tabItems.forEach(item => {
            item.addEventListener('click', () => {
                const targetTab = item.getAttribute('data-tab');

                // Remove active class from all tabs and panels
                tabItems.forEach(tab => tab.classList.remove('active'));
                tabPanels.forEach(panel => panel.classList.remove('active'));

                // Add active class to clicked tab and corresponding panel
                item.classList.add('active');
                document.getElementById(`${targetTab}-panel`).classList.add('active');
            });
        });
    }

    // Calculate labor cost - removed as we now use new labor structure

    // Show fail code dropdown
    showFailCodeDropdown(filteredCodes, dropdown) {
        dropdown.innerHTML = filteredCodes.map(item => `
            <div class="search-dropdown-item" data-code="${item.code}" data-description="${item.description}" data-category="${item.category}">
                <div class="fail-code-item-code">${item.code}</div>
                <div class="fail-code-item-description">${item.description}</div>
            </div>
        `).join('');

        // Add click events to dropdown items
        dropdown.querySelectorAll('.search-dropdown-item').forEach(item => {
            item.addEventListener('click', () => {
                this.selectFailCode(item.dataset.code, item.dataset.description, item.dataset.category);
            });
        });

        dropdown.style.display = 'block';
    }

    // Update highlight for keyboard navigation
    updateHighlight(items, highlightIndex) {
        items.forEach((item, index) => {
            if (index === highlightIndex) {
                item.classList.add('highlighted');
            } else {
                item.classList.remove('highlighted');
            }
        });
    }

    // Select fail code from dropdown
    selectFailCode(code, description, category) {
        document.getElementById('failCodeSearch').value = code;
        document.getElementById('failCodeDescription').value = description;
        document.getElementById('failCodeCategory').value = category;
        document.getElementById('failCodeDropdown').style.display = 'none';
    }

    // Add fail code to the list
    addFailCode() {
        const code = document.getElementById('failCodeSearch').value.trim();
        const description = document.getElementById('failCodeDescription').value.trim();
        const category = document.getElementById('failCodeCategory').value;

        if (!code) {
            alert('Please select a fail code.');
            return;
        }

        // Validate fail code exists in database
        if (!this.validateFailCodeExists(code)) {
            return;
        }

        if (!description) {
            alert('Please ensure the fail code has a description.');
            return;
        }

        // Check if fail code already exists
        if (this.selectedFailCodes.find(fc => fc.code === code)) {
            alert('This fail code has already been added.');
            return;
        }

        // Add to selected fail codes
        const failCodeData = {
            id: Date.now(),
            code,
            description,
            category: category || 'other'
        };

        this.selectedFailCodes.push(failCodeData);
        this.renderFailCodesList();
        this.clearFailCodeForm();
    }

    // Validate fail code exists in database
    validateFailCodeExists(code) {
        const codeExists = this.failCodeDatabase.some(fc =>
            fc.code.toLowerCase() === code.toLowerCase()
        );
        if (!codeExists) {
            alert(`Fail Code "${code}" is not available in the database. Please select a valid fail code from the search dropdown.`);
            return false;
        }
        return true;
    }

    // Clear fail code form
    clearFailCodeForm() {
        document.getElementById('failCodeSearch').value = '';
        document.getElementById('failCodeDescription').value = '';
        document.getElementById('failCodeCategory').value = '';
        document.getElementById('failCodeDropdown').style.display = 'none';
    }

    // Render fail codes list
    renderFailCodesList() {
        const listContainer = document.getElementById('failCodesList');
        const countElement = document.getElementById('failCodesCount');

        if (!listContainer) {
            console.error('Fail codes list container not found');
            return;
        }

        // Update count
        if (countElement) {
            countElement.textContent = `(${this.selectedFailCodes.length})`;
        }

        if (this.selectedFailCodes.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-fail-codes" id="emptyFailCodes">
                    <i class="material-icons">error_outline</i>
                    <p>No fail codes added yet. Use the form above to add fail codes.</p>
                </div>
            `;
            this.updateFailCodesMultipleActions();
            return;
        }

        listContainer.innerHTML = this.selectedFailCodes.map(failCode => `
            <div class="fail-code-item fade-in">
                <label class="checkbox-label item-checkbox">
                    <input type="checkbox" class="fail-code-checkbox" data-fail-code-id="${failCode.id}">
                    <span class="checkbox-custom"></span>
                </label>
                <div class="fail-code-info">
                    <div class="fail-code-info-header">
                        <span class="fail-code-info-code">${failCode.code}</span>
                        <span class="fail-code-info-category">${failCode.category}</span>
                    </div>
                    <div class="fail-code-info-description">${failCode.description}</div>
                </div>
                <button class="fail-code-remove" data-fail-code-id="${failCode.id}" title="Remove fail code">
                    <i class="material-icons">delete</i>
                </button>
            </div>
        `).join('');

        this.updateFailCodesMultipleActions();

        // Add event listeners to remove buttons
        listContainer.querySelectorAll('.fail-code-remove').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const failCodeId = parseInt(button.getAttribute('data-fail-code-id'));
                this.removeFailCode(failCodeId);
            });
        });
    }

    // Remove fail code from list
    removeFailCode(id) {
        this.selectedFailCodes = this.selectedFailCodes.filter(fc => fc.id !== id);
        this.renderFailCodesList();
    }

    // Operation Management Methods
    initializeOperationSearch() {
        this.initializeOperationCodeSearch();
        this.initializeOperationDescriptionSearch();
    }

    // Initialize operation code search
    initializeOperationCodeSearch() {
        const searchInput = document.getElementById('operationCodeSearch');
        const dropdown = document.getElementById('operationCodeDropdown');
        const timeField = document.getElementById('operationTime');

        // Check if elements exist
        if (!searchInput || !dropdown || !timeField) {
            console.warn('Operation code search elements not found, skipping initialization');
            return;
        }

        // Check if already initialized
        if (searchInput.hasAttribute('data-initialized')) {
            return;
        }
        searchInput.setAttribute('data-initialized', 'true');

        let currentHighlightIndex = -1;

        // Search input event
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            currentHighlightIndex = -1;

            if (query.length === 0) {
                dropdown.style.display = 'none';
                this.clearOperationFields();
                return;
            }

            const filteredOperations = this.operationDatabase.filter(item =>
                item.code.toLowerCase().includes(query.toLowerCase())
            );

            if (filteredOperations.length > 0) {
                this.showOperationDropdown(filteredOperations, dropdown, 'code');
            } else {
                // Show "Not Available" message when no matches found
                dropdown.innerHTML = `
                    <div class="search-dropdown-item no-results">
                        "${query}" is not available
                    </div>
                `;
                dropdown.style.display = 'block';
            }
        });

        // Keyboard navigation
        searchInput.addEventListener('keydown', (e) => {
            const items = dropdown.querySelectorAll('.search-dropdown-item');

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                currentHighlightIndex = Math.min(currentHighlightIndex + 1, items.length - 1);
                this.updateHighlight(items, currentHighlightIndex);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                currentHighlightIndex = Math.max(currentHighlightIndex - 1, -1);
                this.updateHighlight(items, currentHighlightIndex);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (currentHighlightIndex >= 0 && items[currentHighlightIndex]) {
                    items[currentHighlightIndex].click();
                }
            } else if (e.key === 'Escape') {
                dropdown.style.display = 'none';
                currentHighlightIndex = -1;
            }
        });

        // Hide dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.style.display = 'none';
                currentHighlightIndex = -1;
            }
        });
    }

    // Initialize operation description search
    initializeOperationDescriptionSearch() {
        const searchInput = document.getElementById('operationDescriptionSearch');
        const dropdown = document.getElementById('operationDescriptionDropdown');
        const timeField = document.getElementById('operationTime');

        // Check if elements exist
        if (!searchInput || !dropdown || !timeField) {
            console.warn('Operation description search elements not found, skipping initialization');
            return;
        }

        // Check if already initialized
        if (searchInput.hasAttribute('data-initialized')) {
            return;
        }
        searchInput.setAttribute('data-initialized', 'true');

        let currentHighlightIndex = -1;

        // Search input event
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            currentHighlightIndex = -1;

            if (query.length === 0) {
                dropdown.style.display = 'none';
                this.clearOperationFields();
                return;
            }

            const filteredOperations = this.operationDatabase.filter(item =>
                item.description.toLowerCase().includes(query.toLowerCase())
            );

            if (filteredOperations.length > 0) {
                this.showOperationDropdown(filteredOperations, dropdown, 'description');
            } else {
                // Show "Not Available" message when no matches found
                dropdown.innerHTML = `
                    <div class="search-dropdown-item no-results">
                        "${query}" is not available
                    </div>
                `;
                dropdown.style.display = 'block';
            }
        });

        // Keyboard navigation
        searchInput.addEventListener('keydown', (e) => {
            const items = dropdown.querySelectorAll('.search-dropdown-item');

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                currentHighlightIndex = Math.min(currentHighlightIndex + 1, items.length - 1);
                this.updateHighlight(items, currentHighlightIndex);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                currentHighlightIndex = Math.max(currentHighlightIndex - 1, -1);
                this.updateHighlight(items, currentHighlightIndex);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (currentHighlightIndex >= 0 && items[currentHighlightIndex]) {
                    items[currentHighlightIndex].click();
                }
            } else if (e.key === 'Escape') {
                dropdown.style.display = 'none';
                currentHighlightIndex = -1;
            }
        });

        // Hide dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.style.display = 'none';
                currentHighlightIndex = -1;
            }
        });
    }

    // Clear operation fields
    clearOperationFields() {
        const timeField = document.getElementById('operationTime');
        if (timeField) {
            timeField.value = '';
        }
    }

    // Update highlight for keyboard navigation
    updateHighlight(items, highlightIndex) {
        items.forEach((item, index) => {
            if (index === highlightIndex) {
                item.classList.add('highlighted');
            } else {
                item.classList.remove('highlighted');
            }
        });
    }

    // Show operation dropdown
    showOperationDropdown(filteredOperations, dropdown, searchType) {
        dropdown.innerHTML = filteredOperations.map(item => `
            <div class="search-dropdown-item" data-code="${item.code}" data-description="${item.description}" data-time="${item.time}">
                <div class="operation-item-code">${item.code}</div>
                <div class="operation-item-description">${item.description}</div>
                <div class="operation-item-time">${item.time} hours</div>
            </div>
        `).join('');

        // Add click events to dropdown items
        dropdown.querySelectorAll('.search-dropdown-item').forEach(item => {
            item.addEventListener('click', () => {
                this.selectOperation(item.dataset.code, item.dataset.description, parseFloat(item.dataset.time), searchType);
            });
        });

        dropdown.style.display = 'block';
    }

    // Select operation from dropdown
    selectOperation(code, description, time, searchType) {
        // Fill the operation code field
        document.getElementById('operationCodeSearch').value = code;

        // Fill the operation description field
        document.getElementById('operationDescriptionSearch').value = description;

        // Fill the operation time field
        document.getElementById('operationTime').value = time;

        // Hide both dropdowns
        document.getElementById('operationCodeDropdown').style.display = 'none';
        document.getElementById('operationDescriptionDropdown').style.display = 'none';
    }

    // Add operation to the list
    addOperation() {
        const code = document.getElementById('operationCodeSearch').value.trim();
        const description = document.getElementById('operationDescriptionSearch').value.trim();
        const time = parseFloat(document.getElementById('operationTime').value) || 0;
        const qty = parseInt(document.getElementById('operationQty').value) || 0;
        const isMandatory = document.getElementById('isMandatory').checked;

        if (!code) {
            alert('Please select an operation code.');
            return;
        }

        // Validate operation code exists in database
        if (!this.validateOperationCodeExists(code)) {
            return;
        }

        if (!description) {
            alert('Please ensure the operation has a description.');
            return;
        }

        // Validate operation description exists in database
        if (!this.validateOperationDescriptionExists(description)) {
            return;
        }

        if (qty <= 0) {
            alert('Please enter a valid quantity (greater than 0).');
            return;
        }

        // Check if operation already exists
        if (this.selectedOperations.find(op => op.code === code)) {
            alert('This operation has already been added.');
            return;
        }

        // Add to selected operations
        const operationData = {
            id: Date.now(),
            code,
            description,
            time,
            qty,
            isMandatory
        };

        this.selectedOperations.push(operationData);
        this.renderOperationsList();
        this.clearOperationForm();
    }

    // Validate operation code exists in database
    validateOperationCodeExists(code) {
        const codeExists = this.operationDatabase.some(op =>
            op.code.toLowerCase() === code.toLowerCase()
        );
        if (!codeExists) {
            alert(`Operation Code "${code}" is not available in the database. Please select a valid operation code from the search dropdown.`);
            return false;
        }
        return true;
    }

    // Validate operation description exists in database
    validateOperationDescriptionExists(description) {
        const descriptionExists = this.operationDatabase.some(op =>
            op.description.toLowerCase() === description.toLowerCase()
        );
        if (!descriptionExists) {
            alert(`Operation Description "${description}" is not available in the database. Please select a valid operation description from the search dropdown.`);
            return false;
        }
        return true;
    }

    // Clear operation form
    clearOperationForm() {
        document.getElementById('operationCodeSearch').value = '';
        document.getElementById('operationDescriptionSearch').value = '';
        document.getElementById('operationTime').value = '';
        document.getElementById('operationQty').value = '';
        document.getElementById('isMandatory').checked = false;
        document.getElementById('operationCodeDropdown').style.display = 'none';
        document.getElementById('operationDescriptionDropdown').style.display = 'none';
    }

    // Render operations list
    renderOperationsList() {
        const listContainer = document.getElementById('operationsList');

        if (!listContainer) {
            console.error('Operations list container not found');
            return;
        }

        if (this.selectedOperations.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-operations" id="emptyOperations">
                    <i class="material-icons">settings</i>
                    <p>No operations added yet. Use the form above to add operations.</p>
                </div>
            `;
            return;
        }

        listContainer.innerHTML = this.selectedOperations.map(operation => `
            <div class="operation-item fade-in">
                <div class="operation-info">
                    <div class="operation-info-header">
                        <span class="operation-info-code">${operation.code}</span>
                        <span class="operation-info-time">${operation.time} hrs</span>
                        <span class="operation-info-qty">Qty: ${operation.qty}</span>
                        ${operation.isMandatory ? '<span class="operation-mandatory-badge">Mandatory</span>' : ''}
                    </div>
                    <div class="operation-info-description">${operation.description}</div>
                </div>
                <div class="operation-actions">
                    <button class="operation-edit" data-operation-id="${operation.id}" title="Edit operation">
                        <i class="material-icons">edit</i>
                    </button>
                    <button class="operation-remove" data-operation-id="${operation.id}" title="Remove operation">
                        <i class="material-icons">delete</i>
                    </button>
                </div>
            </div>
        `).join('');

        // Add event listeners to edit and remove buttons
        listContainer.querySelectorAll('.operation-edit').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const operationId = parseInt(button.getAttribute('data-operation-id'));
                this.editOperation(operationId);
            });
        });

        listContainer.querySelectorAll('.operation-remove').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const operationId = parseInt(button.getAttribute('data-operation-id'));
                this.removeOperation(operationId);
            });
        });
    }

    // Edit operation
    editOperation(id) {
        const operation = this.selectedOperations.find(op => op.id === id);
        if (!operation) return;

        // Populate the form with operation data
        document.getElementById('operationCodeSearch').value = operation.code;
        document.getElementById('operationDescriptionSearch').value = operation.description;
        document.getElementById('operationTime').value = operation.time;
        document.getElementById('operationQty').value = operation.qty;
        document.getElementById('isMandatory').checked = operation.isMandatory;

        // Remove the operation from the list (it will be re-added when user clicks Add)
        this.removeOperation(id);

        // Scroll to the form
        document.getElementById('operationCodeSearch').scrollIntoView({ behavior: 'smooth', block: 'center' });
        document.getElementById('operationCodeSearch').focus();
    }

    // Remove operation from list
    removeOperation(id) {
        this.selectedOperations = this.selectedOperations.filter(op => op.id !== id);
        this.renderOperationsList();
    }

    // Parts Management Methods
    initializePartsSearch() {
        this.initializePartPrefixSearch();
        this.initializePartNumberSearch();
        this.initializePartDescriptionSearch();
    }

    // Initialize part prefix search
    initializePartPrefixSearch() {
        const searchInput = document.getElementById('partPrefixSearch');
        const dropdown = document.getElementById('partPrefixDropdown');

        if (!searchInput || !dropdown) {
            console.warn('Part prefix search elements not found, skipping initialization');
            return;
        }

        if (searchInput.hasAttribute('data-initialized')) {
            return;
        }
        searchInput.setAttribute('data-initialized', 'true');

        let currentHighlightIndex = -1;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            currentHighlightIndex = -1;

            if (query.length === 0) {
                dropdown.style.display = 'none';
                return;
            }

            const filteredParts = this.partsDatabase.filter(item =>
                item.prefix.toLowerCase().includes(query.toLowerCase())
            );

            if (filteredParts.length > 0) {
                this.showPartsDropdown(filteredParts, dropdown, 'prefix');
            } else {
                // Show "Not Available" message when no matches found
                dropdown.innerHTML = `
                    <div class="search-dropdown-item no-results">
                        "${query}" is not available
                    </div>
                `;
                dropdown.style.display = 'block';
            }
        });

        this.addPartsKeyboardNavigation(searchInput, dropdown);
        this.addPartsClickOutside(searchInput, dropdown);
    }

    // Initialize part number search
    initializePartNumberSearch() {
        const searchInput = document.getElementById('partNumberSearch');
        const dropdown = document.getElementById('partNumberDropdown');

        if (!searchInput || !dropdown) {
            console.warn('Part number search elements not found, skipping initialization');
            return;
        }

        if (searchInput.hasAttribute('data-initialized')) {
            return;
        }
        searchInput.setAttribute('data-initialized', 'true');

        let currentHighlightIndex = -1;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            currentHighlightIndex = -1;

            if (query.length === 0) {
                dropdown.style.display = 'none';
                return;
            }

            const filteredParts = this.partsDatabase.filter(item =>
                item.partNumber.toLowerCase().includes(query.toLowerCase())
            );

            if (filteredParts.length > 0) {
                this.showPartsDropdown(filteredParts, dropdown, 'partNumber');
            } else {
                // Show "Not Available" message when no matches found
                dropdown.innerHTML = `
                    <div class="search-dropdown-item no-results">
                        "${query}" is not available
                    </div>
                `;
                dropdown.style.display = 'block';
            }
        });

        this.addPartsKeyboardNavigation(searchInput, dropdown);
        this.addPartsClickOutside(searchInput, dropdown);
    }

    // Initialize part description search
    initializePartDescriptionSearch() {
        const searchInput = document.getElementById('partDescriptionSearch');
        const dropdown = document.getElementById('partDescriptionDropdown');

        if (!searchInput || !dropdown) {
            console.warn('Part description search elements not found, skipping initialization');
            return;
        }

        if (searchInput.hasAttribute('data-initialized')) {
            return;
        }
        searchInput.setAttribute('data-initialized', 'true');

        let currentHighlightIndex = -1;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            currentHighlightIndex = -1;

            if (query.length === 0) {
                dropdown.style.display = 'none';
                return;
            }

            const filteredParts = this.partsDatabase.filter(item =>
                item.description.toLowerCase().includes(query.toLowerCase())
            );

            if (filteredParts.length > 0) {
                this.showPartsDropdown(filteredParts, dropdown, 'description');
            } else {
                // Show "Not Available" message when no matches found
                dropdown.innerHTML = `
                    <div class="search-dropdown-item no-results">
                        "${query}" is not available
                    </div>
                `;
                dropdown.style.display = 'block';
            }
        });

        this.addPartsKeyboardNavigation(searchInput, dropdown);
        this.addPartsClickOutside(searchInput, dropdown);
    }

    // Parts helper methods
    addPartsKeyboardNavigation(searchInput, dropdown) {
        // Keyboard navigation implementation would go here
        // For now, just basic functionality
    }

    addPartsClickOutside(searchInput, dropdown) {
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });
    }

    // Show parts dropdown
    showPartsDropdown(filteredParts, dropdown, searchType) {
        dropdown.innerHTML = filteredParts.map(item => `
            <div class="search-dropdown-item" data-prefix="${item.prefix}" data-partnumber="${item.partNumber}" data-description="${item.description}">
                <div class="part-item-prefix">${item.prefix}</div>
                <div class="part-item-number">${item.partNumber}</div>
                <div class="part-item-description">${item.description}</div>
            </div>
        `).join('');

        dropdown.querySelectorAll('.search-dropdown-item').forEach(item => {
            item.addEventListener('click', () => {
                this.selectPart(item.dataset.prefix, item.dataset.partnumber, item.dataset.description);
            });
        });

        dropdown.style.display = 'block';
    }

    // Select part from dropdown
    selectPart(prefix, partNumber, description) {
        document.getElementById('partPrefixSearch').value = prefix;
        document.getElementById('partNumberSearch').value = partNumber;
        document.getElementById('partDescriptionSearch').value = description;

        // Hide all dropdowns
        document.getElementById('partPrefixDropdown').style.display = 'none';
        document.getElementById('partNumberDropdown').style.display = 'none';
        document.getElementById('partDescriptionDropdown').style.display = 'none';
    }

    // Add part to the list
    addPart() {
        const prefix = document.getElementById('partPrefixSearch').value.trim();
        const partNumber = document.getElementById('partNumberSearch').value.trim();
        const description = document.getElementById('partDescriptionSearch').value.trim();
        const qty = parseInt(document.getElementById('partQty').value) || 0;
        const total = parseFloat(document.getElementById('partTotal').value) || 0;
        const discountPercent = parseFloat(document.getElementById('partDiscountPercent').value) || 0;
        const manufacturingContribution = parseFloat(document.getElementById('partManufacturingContribution').value) || 0;
        const isMandatory = document.getElementById('partIsMandatory').checked;

        // Validate search fields (not including Total field)
        if (!prefix || !partNumber || !description) {
            alert('Please fill in all search fields (Prefix, Part #, Description).');
            return;
        }

        // Validate search field values exist in database
        if (!this.validatePartSearchFields(prefix, partNumber, description)) {
            return;
        }

        if (qty <= 0) {
            alert('Please enter a valid quantity (greater than 0).');
            return;
        }

        if (total < 0) {
            alert('Please enter a valid total amount.');
            return;
        }

        // Validate discount percentage
        if (!this.validateDiscountPercent(discountPercent)) {
            return;
        }

        // Validate manufacturing contribution percentage
        if (!this.validateManufacturingContribution(manufacturingContribution)) {
            return;
        }

        // Check if part already exists
        if (this.selectedParts.find(part => part.partNumber === partNumber)) {
            alert('This part has already been added.');
            return;
        }

        const partData = {
            id: Date.now(),
            prefix,
            partNumber,
            description,
            qty,
            total,
            discountPercent,
            manufacturingContribution,
            isMandatory
        };

        this.selectedParts.push(partData);
        this.renderPartsList();
        this.clearPartForm();
    }

    // Clear part form
    clearPartForm() {
        document.getElementById('partPrefixSearch').value = '';
        document.getElementById('partNumberSearch').value = '';
        document.getElementById('partDescriptionSearch').value = '';
        document.getElementById('partQty').value = '';
        document.getElementById('partTotal').value = '';
        document.getElementById('partDiscountPercent').value = '';
        document.getElementById('partManufacturingContribution').value = '';
        document.getElementById('partIsMandatory').checked = false;

        // Hide all dropdowns
        document.getElementById('partPrefixDropdown').style.display = 'none';
        document.getElementById('partNumberDropdown').style.display = 'none';
        document.getElementById('partDescriptionDropdown').style.display = 'none';
    }

    // Render parts list
    renderPartsList() {
        const listContainer = document.getElementById('partsList');

        if (!listContainer) {
            console.error('Parts list container not found');
            return;
        }

        if (this.selectedParts.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-parts" id="emptyParts">
                    <i class="material-icons">build</i>
                    <p>No parts added yet. Use the form above to add parts.</p>
                </div>
            `;
            return;
        }

        listContainer.innerHTML = this.selectedParts.map(part => `
            <div class="part-item fade-in">
                <div class="part-info">
                    <div class="part-info-header">
                        <span class="part-info-prefix">${part.prefix}</span>
                        <span class="part-info-number">${part.partNumber}</span>
                        <span class="part-info-qty">Qty: ${part.qty}</span>
                        <span class="part-info-total">$${part.total.toFixed(2)}</span>
                        ${part.isMandatory ? '<span class="part-mandatory-badge">Mandatory</span>' : ''}
                    </div>
                    <div class="part-info-description">${part.description}</div>
                    <div class="part-info-details">
                        <span class="part-discount">Discount: ${part.discountPercent}%</span>
                        <span class="part-contribution">Mfg Contribution: ${part.manufacturingContribution}%</span>
                    </div>
                </div>
                <div class="part-actions">
                    <button class="part-edit" data-part-id="${part.id}" title="Edit part">
                        <i class="material-icons">edit</i>
                    </button>
                    <button class="part-remove" data-part-id="${part.id}" title="Remove part">
                        <i class="material-icons">delete</i>
                    </button>
                </div>
            </div>
        `).join('');

        // Add event listeners to edit and remove buttons
        listContainer.querySelectorAll('.part-edit').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const partId = parseInt(button.getAttribute('data-part-id'));
                this.editPart(partId);
            });
        });

        listContainer.querySelectorAll('.part-remove').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const partId = parseInt(button.getAttribute('data-part-id'));
                this.removePart(partId);
            });
        });
    }

    // Edit part
    editPart(id) {
        const part = this.selectedParts.find(p => p.id === id);
        if (!part) return;

        // Populate the form with part data
        document.getElementById('partPrefixSearch').value = part.prefix;
        document.getElementById('partNumberSearch').value = part.partNumber;
        document.getElementById('partDescriptionSearch').value = part.description;
        document.getElementById('partQty').value = part.qty;
        document.getElementById('partTotal').value = part.total;
        document.getElementById('partDiscountPercent').value = part.discountPercent;
        document.getElementById('partManufacturingContribution').value = part.manufacturingContribution;
        document.getElementById('partIsMandatory').checked = part.isMandatory;

        // Remove the part from the list (it will be re-added when user clicks Add)
        this.removePart(id);

        // Scroll to the form
        document.getElementById('partPrefixSearch').scrollIntoView({ behavior: 'smooth', block: 'center' });
        document.getElementById('partPrefixSearch').focus();
    }

    // Remove part from list
    removePart(id) {
        this.selectedParts = this.selectedParts.filter(part => part.id !== id);
        this.renderPartsList();
    }

    // Validate part search fields
    validatePartSearchFields(prefix, partNumber, description) {
        // Check if prefix exists in database
        const prefixExists = this.partsDatabase.some(part =>
            part.prefix.toLowerCase() === prefix.toLowerCase()
        );
        if (!prefixExists) {
            alert(`Prefix "${prefix}" is not available in the database. Please select a valid prefix from the search dropdown.`);
            return false;
        }

        // Check if part number exists in database
        const partNumberExists = this.partsDatabase.some(part =>
            part.partNumber.toLowerCase() === partNumber.toLowerCase()
        );
        if (!partNumberExists) {
            alert(`Part Number "${partNumber}" is not available in the database. Please select a valid part number from the search dropdown.`);
            return false;
        }

        // Check if description exists in database
        const descriptionExists = this.partsDatabase.some(part =>
            part.description.toLowerCase() === description.toLowerCase()
        );
        if (!descriptionExists) {
            alert(`Description "${description}" is not available in the database. Please select a valid description from the search dropdown.`);
            return false;
        }

        return true;
    }

    // Validate discount percentage
    validateDiscountPercent(discountPercent) {
        if (isNaN(discountPercent) || discountPercent < 0 || discountPercent > 100) {
            alert('Discount % must be a valid number between 0 and 100.');
            return false;
        }
        return true;
    }

    // Validate manufacturing contribution percentage
    validateManufacturingContribution(manufacturingContribution) {
        if (isNaN(manufacturingContribution) || manufacturingContribution < 0 || manufacturingContribution > 100) {
            alert('Manufacturing Contribution % must be a valid number between 0 and 100.');
            return false;
        }
        return true;
    }

    // Real-time percentage field validation
    validatePercentageField(field, fieldName) {
        const value = parseFloat(field.value);

        // Remove any existing error styling
        field.classList.remove('error');

        // Clear any existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        if (field.value.trim() !== '' && (isNaN(value) || value < 0 || value > 100)) {
            // Add error styling
            field.classList.add('error');

            // Add error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = `${fieldName} must be a number between 0 and 100`;
            field.parentNode.appendChild(errorMessage);

            return false;
        }

        return true;
    }

    // Labor Management Methods
    initializeLaborSearch() {
        this.initializeLaborCodeSearch();
        this.initializeLaborDescriptionSearch();
    }

    // Initialize labor code search
    initializeLaborCodeSearch() {
        const searchInput = document.getElementById('laborCodeSearch');
        const dropdown = document.getElementById('laborCodeDropdown');

        if (!searchInput || !dropdown) {
            console.warn('Labor code search elements not found, skipping initialization');
            return;
        }

        if (searchInput.hasAttribute('data-initialized')) {
            return;
        }
        searchInput.setAttribute('data-initialized', 'true');

        let currentHighlightIndex = -1;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            currentHighlightIndex = -1;

            if (query.length === 0) {
                dropdown.style.display = 'none';
                this.clearLaborFields();
                return;
            }

            const filteredLabor = this.laborDatabase.filter(item =>
                item.code.toLowerCase().includes(query.toLowerCase())
            );

            if (filteredLabor.length > 0) {
                this.showLaborDropdown(filteredLabor, dropdown, 'code');
            } else {
                dropdown.innerHTML = `
                    <div class="search-dropdown-item no-results">
                        "${query}" is not available
                    </div>
                `;
                dropdown.style.display = 'block';
            }
        });

        this.addLaborKeyboardNavigation(searchInput, dropdown);
        this.addLaborClickOutside(searchInput, dropdown);
    }

    // Initialize labor description search
    initializeLaborDescriptionSearch() {
        const searchInput = document.getElementById('laborDescriptionSearch');
        const dropdown = document.getElementById('laborDescriptionDropdown');

        if (!searchInput || !dropdown) {
            console.warn('Labor description search elements not found, skipping initialization');
            return;
        }

        if (searchInput.hasAttribute('data-initialized')) {
            return;
        }
        searchInput.setAttribute('data-initialized', 'true');

        let currentHighlightIndex = -1;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            currentHighlightIndex = -1;

            if (query.length === 0) {
                dropdown.style.display = 'none';
                return;
            }

            const filteredLabor = this.laborDatabase.filter(item =>
                item.description.toLowerCase().includes(query.toLowerCase())
            );

            if (filteredLabor.length > 0) {
                this.showLaborDropdown(filteredLabor, dropdown, 'description');
            } else {
                dropdown.innerHTML = `
                    <div class="search-dropdown-item no-results">
                        "${query}" is not available
                    </div>
                `;
                dropdown.style.display = 'block';
            }
        });

        this.addLaborKeyboardNavigation(searchInput, dropdown);
        this.addLaborClickOutside(searchInput, dropdown);
    }

    // Labor helper methods
    addLaborKeyboardNavigation(searchInput, dropdown) {
        // Keyboard navigation implementation would go here
        // For now, just basic functionality
    }

    addLaborClickOutside(searchInput, dropdown) {
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });
    }

    // Show labor dropdown
    showLaborDropdown(filteredLabor, dropdown, searchType) {
        dropdown.innerHTML = filteredLabor.map(item => `
            <div class="search-dropdown-item" data-code="${item.code}" data-description="${item.description}" data-rate="${item.rate}">
                <div class="labor-item-code">${item.code}</div>
                <div class="labor-item-description">${item.description}</div>
                <div class="labor-item-rate">Rate: $${item.rate.toFixed(2)}</div>
            </div>
        `).join('');

        dropdown.querySelectorAll('.search-dropdown-item').forEach(item => {
            item.addEventListener('click', () => {
                this.selectLabor(item.dataset.code, item.dataset.description, parseFloat(item.dataset.rate));
            });
        });

        dropdown.style.display = 'block';
    }

    // Select labor from dropdown
    selectLabor(code, description, rate) {
        document.getElementById('laborCodeSearch').value = code;
        document.getElementById('laborDescriptionSearch').value = description;
        document.getElementById('laborRate').value = rate.toFixed(2);
        document.getElementById('laborCodeDropdown').style.display = 'none';
        document.getElementById('laborDescriptionDropdown').style.display = 'none';
    }

    // Clear labor fields
    clearLaborFields() {
        document.getElementById('laborDescriptionSearch').value = '';
        document.getElementById('laborRate').value = '';
    }

    // Add labor to the list
    addLabor() {
        const code = document.getElementById('laborCodeSearch').value.trim();
        const description = document.getElementById('laborDescriptionSearch').value.trim();
        const rate = parseFloat(document.getElementById('laborRate').value) || 0;
        const qty = parseInt(document.getElementById('laborQty').value) || 0;
        const discountPercent = parseFloat(document.getElementById('laborDiscountPercent').value) || 0;
        const manufacturingContribution = parseFloat(document.getElementById('laborManufacturingContribution').value) || 0;
        const isMandatory = document.getElementById('laborIsMandatory').checked;

        // Validate search fields
        if (!code || !description) {
            alert('Please fill in all search fields (Labor Code, Description).');
            return;
        }

        // Validate search field values exist in database
        if (!this.validateLaborSearchFields(code, description)) {
            return;
        }

        if (qty <= 0) {
            alert('Please enter a valid quantity (greater than 0).');
            return;
        }

        if (rate <= 0) {
            alert('Please ensure the labor has a valid rate.');
            return;
        }

        // Validate discount percentage with clear on failure
        if (!this.validatePercentageFieldWithClear(document.getElementById('laborDiscountPercent'), 'Labor Discount %')) {
            return;
        }

        // Validate manufacturing contribution percentage with clear on failure
        if (!this.validatePercentageFieldWithClear(document.getElementById('laborManufacturingContribution'), 'Labor Manufacturing Contribution %')) {
            return;
        }

        // Check if labor already exists
        if (this.selectedLabor.find(labor => labor.code === code)) {
            alert('This labor code has already been added.');
            return;
        }

        const laborData = {
            id: Date.now(),
            code,
            description,
            rate,
            qty,
            discountPercent,
            manufacturingContribution,
            isMandatory
        };

        this.selectedLabor.push(laborData);
        this.renderLaborList();
        this.clearLaborForm();
    }

    // Validate labor search fields
    validateLaborSearchFields(code, description) {
        // Check if code exists in database
        const codeExists = this.laborDatabase.some(labor =>
            labor.code.toLowerCase() === code.toLowerCase()
        );
        if (!codeExists) {
            alert(`Labor Code "${code}" is not available in the database. Please select a valid labor code from the search dropdown.`);
            return false;
        }

        // Check if description exists in database
        const descriptionExists = this.laborDatabase.some(labor =>
            labor.description.toLowerCase() === description.toLowerCase()
        );
        if (!descriptionExists) {
            alert(`Labor Description "${description}" is not available in the database. Please select a valid description from the search dropdown.`);
            return false;
        }

        return true;
    }

    // Validate percentage field with clear on failure
    validatePercentageFieldWithClear(field, fieldName) {
        const value = parseFloat(field.value);

        // Remove any existing error styling
        field.classList.remove('error');

        // Clear any existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        if (field.value.trim() !== '' && (isNaN(value) || value < 0 || value > 100)) {
            // Add error styling
            field.classList.add('error');

            // Add error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = `${fieldName} must be a number between 0 and 100`;
            field.parentNode.appendChild(errorMessage);

            // Clear the field value
            field.value = '';

            return false;
        }

        return true;
    }

    // Clear labor form
    clearLaborForm() {
        document.getElementById('laborCodeSearch').value = '';
        document.getElementById('laborDescriptionSearch').value = '';
        document.getElementById('laborRate').value = '';
        document.getElementById('laborQty').value = '';
        document.getElementById('laborDiscountPercent').value = '';
        document.getElementById('laborManufacturingContribution').value = '';
        document.getElementById('laborIsMandatory').checked = false;

        // Hide all dropdowns
        document.getElementById('laborCodeDropdown').style.display = 'none';
        document.getElementById('laborDescriptionDropdown').style.display = 'none';

        // Clear any error styling and messages
        const errorFields = document.querySelectorAll('#laborDiscountPercent.error, #laborManufacturingContribution.error');
        errorFields.forEach(field => {
            field.classList.remove('error');
            const errorMessage = field.parentNode.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        });
    }

    // Render labor list
    renderLaborList() {
        const listContainer = document.getElementById('laborList');

        if (!listContainer) {
            console.error('Labor list container not found');
            return;
        }

        if (this.selectedLabor.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-labor" id="emptyLabor">
                    <i class="material-icons">work</i>
                    <p>No labor charges added yet. Use the form above to add labor charges.</p>
                </div>
            `;
            return;
        }

        listContainer.innerHTML = this.selectedLabor.map(labor => `
            <div class="labor-item fade-in">
                <div class="labor-info">
                    <div class="labor-info-header">
                        <span class="labor-info-code">${labor.code}</span>
                        <span class="labor-info-qty">Qty: ${labor.qty}</span>
                        <span class="labor-info-rate">Rate: $${labor.rate.toFixed(2)}</span>
                        ${labor.isMandatory ? '<span class="labor-mandatory-badge">Mandatory</span>' : ''}
                    </div>
                    <div class="labor-info-description">${labor.description}</div>
                    <div class="labor-info-details">
                        <span class="labor-discount">Discount: ${labor.discountPercent}%</span>
                        <span class="labor-contribution">Mfg Contribution: ${labor.manufacturingContribution}%</span>
                    </div>
                </div>
                <div class="labor-actions">
                    <button class="labor-edit" data-labor-id="${labor.id}" title="Edit labor">
                        <i class="material-icons">edit</i>
                    </button>
                    <button class="labor-remove" data-labor-id="${labor.id}" title="Remove labor">
                        <i class="material-icons">delete</i>
                    </button>
                </div>
            </div>
        `).join('');

        // Add event listeners to edit and remove buttons
        listContainer.querySelectorAll('.labor-edit').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const laborId = parseInt(button.getAttribute('data-labor-id'));
                this.editLabor(laborId);
            });
        });

        listContainer.querySelectorAll('.labor-remove').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const laborId = parseInt(button.getAttribute('data-labor-id'));
                this.removeLabor(laborId);
            });
        });
    }

    // Edit labor
    editLabor(id) {
        const labor = this.selectedLabor.find(l => l.id === id);
        if (!labor) return;

        // Populate the form with labor data
        document.getElementById('laborCodeSearch').value = labor.code;
        document.getElementById('laborDescriptionSearch').value = labor.description;
        document.getElementById('laborRate').value = labor.rate;
        document.getElementById('laborQty').value = labor.qty;
        document.getElementById('laborDiscountPercent').value = labor.discountPercent;
        document.getElementById('laborManufacturingContribution').value = labor.manufacturingContribution;
        document.getElementById('laborIsMandatory').checked = labor.isMandatory;

        // Remove the labor from the list (it will be re-added when user clicks Add)
        this.removeLabor(id);

        // Scroll to the form
        document.getElementById('laborCodeSearch').scrollIntoView({ behavior: 'smooth', block: 'center' });
        document.getElementById('laborCodeSearch').focus();
    }

    // Remove labor from list
    removeLabor(id) {
        this.selectedLabor = this.selectedLabor.filter(labor => labor.id !== id);
        this.renderLaborList();
    }

    // Asset Management Methods
    initializeAssetFilters() {
        const brandFilter = document.getElementById('brandFilter');
        const assetTypeFilter = document.getElementById('assetTypeFilter');
        const modelFilter = document.getElementById('modelFilter');

        if (!brandFilter || !assetTypeFilter || !modelFilter) {
            console.warn('Asset filter elements not found, skipping initialization');
            return;
        }

        // Initialize filter dropdowns
        this.setupFilterDropdown('brandFilter', 'brandDropdown', 'brand');
        this.setupFilterDropdown('assetTypeFilter', 'assetTypeDropdown', 'assetType');
        this.setupFilterDropdown('modelFilter', 'modelDropdown', 'model');

        // Initialize with search state visible and table hidden
        this.filteredAssets = [...this.assetDatabase];
        this.hideAssetsTable();
    }

    setupFilterDropdown(inputId, dropdownId, field) {
        const input = document.getElementById(inputId);
        const dropdown = document.getElementById(dropdownId);

        if (!input || !dropdown) return;

        // Get unique values for this field
        const uniqueValues = [...new Set(this.assetDatabase.map(asset => asset[field]))].sort();

        input.addEventListener('input', (e) => {
            const query = e.target.value.trim().toLowerCase();

            if (query.length === 0) {
                dropdown.style.display = 'none';
                return;
            }

            const filtered = uniqueValues.filter(value =>
                value.toLowerCase().includes(query)
            );

            if (filtered.length > 0) {
                dropdown.innerHTML = filtered.map(value => `
                    <div class="filter-dropdown-item" data-value="${value}">
                        ${value}
                    </div>
                `).join('');

                dropdown.querySelectorAll('.filter-dropdown-item').forEach(item => {
                    item.addEventListener('click', () => {
                        input.value = item.dataset.value;
                        dropdown.style.display = 'none';
                    });
                });

                dropdown.style.display = 'block';
            } else {
                // Show "Not Available" message when no matches found
                dropdown.innerHTML = `
                    <div class="filter-dropdown-item no-results">
                        "${query}" is not available
                    </div>
                `;
                dropdown.style.display = 'block';
            }
        });

        // Hide dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!input.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });
    }

    searchAssets() {
        const brandFilter = document.getElementById('brandFilter').value.trim();
        const assetTypeFilter = document.getElementById('assetTypeFilter').value.trim();
        const modelFilter = document.getElementById('modelFilter').value.trim();

        this.filteredAssets = this.assetDatabase.filter(asset => {
            const matchesBrand = !brandFilter || asset.brand.toLowerCase().includes(brandFilter.toLowerCase());
            const matchesType = !assetTypeFilter || asset.assetType.toLowerCase().includes(assetTypeFilter.toLowerCase());
            const matchesModel = !modelFilter || asset.model.toLowerCase().includes(modelFilter.toLowerCase());

            return matchesBrand && matchesType && matchesModel;
        });

        this.currentPage = 1;

        // Show the assets table and hide the initial search state
        this.showAssetsTable();
        this.renderAssetsTable();
    }

    showAssetsTable() {
        const initialSearchState = document.getElementById('initialSearchState');
        const assetsTableSection = document.getElementById('assetsTableSection');

        if (initialSearchState) {
            initialSearchState.style.display = 'none';
        }
        if (assetsTableSection) {
            assetsTableSection.style.display = 'block';
        }
    }

    hideAssetsTable() {
        const initialSearchState = document.getElementById('initialSearchState');
        const assetsTableSection = document.getElementById('assetsTableSection');

        if (initialSearchState) {
            initialSearchState.style.display = 'flex';
        }
        if (assetsTableSection) {
            assetsTableSection.style.display = 'none';
        }
    }

    clearAssetFilters() {
        document.getElementById('brandFilter').value = '';
        document.getElementById('assetTypeFilter').value = '';
        document.getElementById('modelFilter').value = '';

        // Hide all dropdowns
        document.getElementById('brandDropdown').style.display = 'none';
        document.getElementById('assetTypeDropdown').style.display = 'none';
        document.getElementById('modelDropdown').style.display = 'none';

        // Hide the assets table and show the initial search state
        this.hideAssetsTable();

        this.filteredAssets = [...this.assetDatabase];
        this.currentPage = 1;
    }

    renderAssetsTable() {
        const tbody = document.getElementById('assetsTableBody');
        const emptyState = document.getElementById('emptyAssets');
        const assetCount = document.getElementById('assetCount');
        const tableWrapper = document.querySelector('.assets-table-wrapper');

        if (!tbody) return;

        // Calculate pagination
        const totalAssets = this.filteredAssets.length;
        const totalPages = Math.ceil(totalAssets / this.pageSize);
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = Math.min(startIndex + this.pageSize, totalAssets);
        const currentPageAssets = this.filteredAssets.slice(startIndex, endIndex);

        // Update asset count
        if (assetCount) {
            assetCount.textContent = `${totalAssets} assets found`;
        }

        // Update statistics in left panel
        const totalAssetsCount = document.getElementById('totalAssetsCount');
        const filteredAssetsCount = document.getElementById('filteredAssetsCount');

        if (totalAssetsCount) {
            totalAssetsCount.textContent = this.assetDatabase.length;
        }
        if (filteredAssetsCount) {
            filteredAssetsCount.textContent = totalAssets;
        }

        // Update pagination info
        document.getElementById('currentPage').textContent = this.currentPage;
        document.getElementById('totalPages').textContent = totalPages;
        document.getElementById('totalAssets').textContent = totalAssets;

        // Update pagination buttons
        document.getElementById('prevPageBtn').disabled = this.currentPage <= 1;
        document.getElementById('nextPageBtn').disabled = this.currentPage >= totalPages;

        if (totalAssets === 0) {
            tableWrapper.style.display = 'none';
            emptyState.style.display = 'flex';
            return;
        }

        tableWrapper.style.display = 'block';
        emptyState.style.display = 'none';

        tbody.innerHTML = currentPageAssets.map(asset => `
            <tr class="asset-row" data-asset-id="${asset.id}">
                <td>
                    <label class="checkbox-label">
                        <input type="checkbox" class="asset-checkbox" data-asset-id="${asset.id}">
                        <span class="checkbox-custom"></span>
                    </label>
                </td>
                <td>${asset.brand}</td>
                <td>${asset.assetType}</td>
                <td>${asset.model}</td>
                <td>${asset.serialNumber}</td>
                <td>${asset.workOrderNumber}</td>
                <td>
                    <div class="asset-actions">
                        <button class="asset-action-btn edit" onclick="campaignManager.editAsset(${asset.id})" title="Edit Asset">
                            <i class="material-icons">edit</i>
                        </button>
                        <button class="asset-action-btn delete" onclick="campaignManager.deleteAsset(${asset.id})" title="Delete Asset">
                            <i class="material-icons">delete</i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Add event listeners to checkboxes
        tbody.querySelectorAll('.asset-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateSelectAllState());
        });

        this.updateSelectAllState();
    }

    updateSelectAllState() {
        const selectAllCheckbox = document.getElementById('selectAllCheckbox');
        const assetCheckboxes = document.querySelectorAll('.asset-checkbox');

        if (!selectAllCheckbox || assetCheckboxes.length === 0) return;

        const checkedCount = Array.from(assetCheckboxes).filter(cb => cb.checked).length;

        selectAllCheckbox.checked = checkedCount === assetCheckboxes.length;
        selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < assetCheckboxes.length;
    }

    toggleSelectAll(checked) {
        const assetCheckboxes = document.querySelectorAll('.asset-checkbox');
        assetCheckboxes.forEach(checkbox => {
            checkbox.checked = checked;
        });
    }

    selectAllAssets() {
        const assetCheckboxes = document.querySelectorAll('.asset-checkbox');
        assetCheckboxes.forEach(checkbox => {
            checkbox.checked = true;
        });
        this.updateSelectAllState();
    }

    addSelectedAssets() {
        const selectedCheckboxes = document.querySelectorAll('.asset-checkbox:checked');
        const selectedAssetIds = Array.from(selectedCheckboxes).map(cb => parseInt(cb.dataset.assetId));

        selectedAssetIds.forEach(assetId => {
            const asset = this.assetDatabase.find(a => a.id === assetId);
            if (asset && !this.selectedAssets.find(sa => sa.id === assetId)) {
                this.selectedAssets.push({...asset});
            }
        });

        this.renderSelectedAssets();

        // Uncheck all checkboxes after adding
        selectedCheckboxes.forEach(cb => cb.checked = false);
        this.updateSelectAllState();
    }

    renderSelectedAssets() {
        const container = document.getElementById('selectedAssetsList');
        const selectedCountDisplay = document.getElementById('selectedCountDisplay');
        const selectedAssetsCount = document.getElementById('selectedAssetsCount');

        if (!container) return;

        // Update counters
        if (selectedCountDisplay) {
            selectedCountDisplay.textContent = this.selectedAssets.length;
        }
        if (selectedAssetsCount) {
            selectedAssetsCount.textContent = this.selectedAssets.length;
        }

        if (this.selectedAssets.length === 0) {
            container.innerHTML = `
                <div class="empty-selected-assets" id="emptySelectedAssets">
                    <i class="material-icons">inventory</i>
                    <p>No assets selected for this campaign yet.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.selectedAssets.map(asset => `
            <div class="selected-asset-item fade-in">
                <div class="selected-asset-info">
                    <div class="selected-asset-header">
                        <span class="selected-asset-brand">${asset.brand}</span>
                        <span class="selected-asset-type">${asset.assetType}</span>
                    </div>
                    <div class="selected-asset-details">
                        Model: ${asset.model} | Serial: ${asset.serialNumber} | WO: ${asset.workOrderNumber}
                    </div>
                </div>
                <button class="selected-asset-remove" data-asset-id="${asset.id}" title="Remove asset">
                    <i class="material-icons">delete</i>
                </button>
            </div>
        `).join('');

        // Add event listeners to remove buttons
        container.querySelectorAll('.selected-asset-remove').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const assetId = parseInt(button.getAttribute('data-asset-id'));
                this.removeSelectedAsset(assetId);
            });
        });
    }

    removeSelectedAsset(id) {
        this.selectedAssets = this.selectedAssets.filter(asset => asset.id !== id);
        this.renderSelectedAssets();
    }

    clearSelectedAssets() {
        if (this.selectedAssets.length === 0) {
            return;
        }

        if (confirm('Are you sure you want to clear all selected assets?')) {
            this.selectedAssets = [];
            this.renderSelectedAssets();
        }
    }

    editAsset(id) {
        // Placeholder for edit functionality
        console.log('Edit asset:', id);
        alert('Edit asset functionality would be implemented here');
    }

    deleteAsset(id) {
        // Placeholder for delete functionality
        console.log('Delete asset:', id);
        if (confirm('Are you sure you want to delete this asset?')) {
            alert('Delete asset functionality would be implemented here');
        }
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.renderAssetsTable();
        }
    }

    nextPage() {
        const totalPages = Math.ceil(this.filteredAssets.length / this.pageSize);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.renderAssetsTable();
        }
    }

    changePageSize(newSize) {
        this.pageSize = newSize;
        this.currentPage = 1;
        this.renderAssetsTable();
    }

    // Load campaigns from localStorage
    loadCampaigns() {
        const stored = localStorage.getItem('campaigns');
        if (stored) {
            return JSON.parse(stored);
        }

        // Return sample data
        return [
            {
                id: 1,
                code: 'CAMP001',
                name: 'Summer Sale 2024',
                isActive: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                code: 'CAMP002',
                name: 'Black Friday Special',
                isActive: false,
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                code: 'CAMP003',
                name: 'New Year Promotion',
                isActive: true,
                createdAt: new Date().toISOString()
            }
        ];
    }

    // Save campaigns to localStorage
    saveCampaigns() {
        localStorage.setItem('campaigns', JSON.stringify(this.campaigns));
    }

    // Render campaigns as beautiful cards with pagination
    renderCampaigns() {
        const campaignsGrid = document.getElementById('campaignsGrid');
        const emptyState = document.getElementById('emptyState');
        const paginationContainer = document.getElementById('campaignsPagination');

        // Update statistics
        this.updateCampaignStats();

        if (this.campaigns.length === 0) {
            if (campaignsGrid) campaignsGrid.innerHTML = '';
            if (emptyState) emptyState.style.display = 'block';
            if (paginationContainer) paginationContainer.style.display = 'none';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';

        // Calculate pagination
        const totalCampaigns = this.campaigns.length;
        const totalPages = Math.ceil(totalCampaigns / this.pageSize);
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = Math.min(startIndex + this.pageSize, totalCampaigns);
        const currentPageCampaigns = this.campaigns.slice(startIndex, endIndex);

        // Render current page campaigns
        if (campaignsGrid) {
            campaignsGrid.innerHTML = currentPageCampaigns.map(campaign => `
                <div class="campaign-card" data-campaign-id="${campaign.id}">
                    <div class="campaign-card-header">
                        <div class="campaign-card-info">
                            <h3>${campaign.name}</h3>
                            <div class="campaign-code">${campaign.code}</div>
                        </div>
                        <div class="campaign-status ${campaign.isActive ? 'active' : 'inactive'}">
                            ${campaign.isActive ? 'Active' : 'Inactive'}
                        </div>
                    </div>

                    <div class="campaign-card-details">
                        <div class="campaign-detail-item">
                            <i class="material-icons">date_range</i>
                            <span>Created: ${this.formatDate(campaign.createdAt || new Date())}</span>
                        </div>
                        <div class="campaign-detail-item">
                            <i class="material-icons">schedule</i>
                            <span>Start: ${campaign.startDate ? this.formatDate(campaign.startDate) : 'Not set'}</span>
                        </div>
                        <div class="campaign-detail-item">
                            <i class="material-icons">event</i>
                            <span>End: ${campaign.endDate ? this.formatDate(campaign.endDate) : 'Not set'}</span>
                        </div>
                        <div class="campaign-detail-item">
                            <i class="material-icons">category</i>
                            <span>Type: ${this.getCampaignType(campaign)}</span>
                        </div>
                    </div>

                    <div class="campaign-card-actions">
                        <button class="campaign-action-btn view" onclick="window.campaignManager.openViewModal(${campaign.id})" title="View Campaign">
                            <i class="material-icons">visibility</i>
                        </button>
                        <button class="campaign-action-btn copy" onclick="window.campaignManager.copyCampaign(${campaign.id})" title="Copy Campaign">
                            <i class="material-icons">content_copy</i>
                        </button>
                        <button class="campaign-action-btn edit" onclick="window.campaignManager.openEditModal(${campaign.id})" title="Edit Campaign">
                            <i class="material-icons">edit</i>
                        </button>
                        <button class="campaign-action-btn delete" onclick="window.campaignManager.openDeleteModal(${campaign.id})" title="Delete Campaign">
                            <i class="material-icons">delete</i>
                        </button>
                    </div>
                </div>
            `).join('');
        }

        // Show/hide pagination based on total campaigns
        if (totalCampaigns > this.pageSize) {
            if (paginationContainer) paginationContainer.style.display = 'flex';
            this.renderPagination(totalPages, startIndex + 1, endIndex, totalCampaigns);
        } else {
            if (paginationContainer) paginationContainer.style.display = 'none';
        }
    }

    // Update campaign statistics
    updateCampaignStats() {
        const totalCount = this.campaigns.length;
        const activeCount = this.campaigns.filter(c => c.isActive).length;
        const inactiveCount = this.campaigns.filter(c => !c.isActive).length;
        const recentCount = this.campaigns.filter(c => {
            const createdDate = new Date(c.createdAt || new Date());
            const daysDiff = (new Date() - createdDate) / (1000 * 60 * 60 * 24);
            return daysDiff <= 7;
        }).length;

        // Update stat cards
        const totalElement = document.getElementById('totalCampaignsCount');
        const activeElement = document.getElementById('activeCampaignsCount');
        const inactiveElement = document.getElementById('inactiveCampaignsCount');
        const recentElement = document.getElementById('recentCampaignsCount');

        if (totalElement) totalElement.textContent = totalCount;
        if (activeElement) activeElement.textContent = activeCount;
        if (inactiveElement) inactiveElement.textContent = inactiveCount;
        if (recentElement) recentElement.textContent = recentCount;
    }

    // Get campaign type for display
    getCampaignType(campaign) {
        if (campaign.isVehicleRecall) return 'Vehicle Recall';
        if (campaign.isEquipmentRecall) return 'Equipment Recall';
        if (campaign.isManufacturer) return 'Manufacturer Campaign';
        return 'General Campaign';
    }

    // Render pagination controls
    renderPagination(totalPages, startItem, endItem, totalItems) {
        const paginationInfo = document.getElementById('paginationInfo');
        const pageNumbers = document.getElementById('pageNumbers');
        const prevBtn = document.getElementById('prevPageBtn');
        const nextBtn = document.getElementById('nextPageBtn');

        // Update pagination info
        if (paginationInfo) {
            paginationInfo.textContent = `Showing ${startItem}-${endItem} of ${totalItems} campaigns`;
        }

        // Update prev/next buttons
        if (prevBtn) {
            prevBtn.disabled = this.currentPage === 1;
        }
        if (nextBtn) {
            nextBtn.disabled = this.currentPage === totalPages;
        }

        // Generate page numbers
        if (pageNumbers) {
            const pageNumbersHtml = this.generatePageNumbers(totalPages);
            pageNumbers.innerHTML = pageNumbersHtml;
        }
    }

    // Generate page numbers with ellipsis
    generatePageNumbers(totalPages) {
        const current = this.currentPage;
        const pages = [];

        if (totalPages <= 7) {
            // Show all pages if 7 or fewer
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            if (current > 4) {
                pages.push('...');
            }

            // Show pages around current page
            const start = Math.max(2, current - 1);
            const end = Math.min(totalPages - 1, current + 1);

            for (let i = start; i <= end; i++) {
                if (!pages.includes(i)) {
                    pages.push(i);
                }
            }

            if (current < totalPages - 3) {
                pages.push('...');
            }

            // Always show last page
            if (!pages.includes(totalPages)) {
                pages.push(totalPages);
            }
        }

        return pages.map(page => {
            if (page === '...') {
                return '<span class="pagination-ellipsis">...</span>';
            }

            const isActive = page === current ? 'active' : '';
            return `<button class="pagination-btn ${isActive}" onclick="window.campaignManager.goToPage(${page})">${page}</button>`;
        }).join('');
    }

    // Navigation functions
    goToPage(page) {
        const totalPages = Math.ceil(this.campaigns.length / this.pageSize);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderCampaigns();
        }
    }

    goToPreviousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.renderCampaigns();
        }
    }

    goToNextPage() {
        const totalPages = Math.ceil(this.campaigns.length / this.pageSize);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.renderCampaigns();
        }
    }

    // Open add campaign modal
    openAddModal() {
        this.currentEditId = null;
        document.getElementById('modalTitle').textContent = 'Add New Campaign';
        document.getElementById('saveBtn').textContent = 'Save';
        this.resetForm();
        this.showModal();
    }

    // Open edit campaign modal
    openEditModal(id) {
        const campaign = this.campaigns.find(c => c.id === id);
        if (!campaign) return;

        this.currentEditId = id;
        document.getElementById('modalTitle').textContent = 'Edit Campaign';
        document.getElementById('saveBtn').textContent = 'Update';

        // Populate Basic Info
        document.getElementById('campaignCode').value = campaign.code || '';
        document.getElementById('campaignName').value = campaign.name || '';
        document.getElementById('isActive').checked = campaign.isActive || false;
        document.getElementById('isManufacturer').checked = campaign.isManufacturer || false;
        document.getElementById('isVehicleRecall').checked = campaign.isVehicleRecall || false;
        document.getElementById('isEquipmentRecall').checked = campaign.isEquipmentRecall || false;
        document.getElementById('startDate').value = campaign.startDate || '';
        document.getElementById('endDate').value = campaign.endDate || '';
        document.getElementById('remarks').value = campaign.remarks || '';

        // Populate Fail Code Details (multiple fail codes)
        this.selectedFailCodes = campaign.failCodes ? [...campaign.failCodes] : [];
        this.renderFailCodesList();
        this.clearFailCodeForm();

        // Populate Asset Details (multiple assets)
        this.selectedAssets = campaign.selectedAssets ? [...campaign.selectedAssets] : [];
        this.renderSelectedAssets();

        // Populate Operation Details (multiple operations)
        this.selectedOperations = campaign.selectedOperations ? [...campaign.selectedOperations] : [];
        this.renderOperationsList();
        this.clearOperationForm();

        // Populate Parts Details (multiple parts)
        this.selectedParts = campaign.selectedParts ? [...campaign.selectedParts] : [];
        this.renderPartsList();
        this.clearPartForm();

        // Populate Labor Details (multiple labor)
        this.selectedLabor = campaign.selectedLabor ? [...campaign.selectedLabor] : [];
        this.renderLaborList();
        this.clearLaborForm();

        // Populate Legacy Asset Details (for backward compatibility)
        const assetIdField = document.getElementById('assetId');
        const assetNameField = document.getElementById('assetName');
        const assetLocationField = document.getElementById('assetLocation');
        const assetDescriptionField = document.getElementById('assetDescription');

        if (assetIdField) assetIdField.value = campaign.assetId || '';
        if (assetNameField) assetNameField.value = campaign.assetName || '';
        if (assetLocationField) assetLocationField.value = campaign.assetLocation || '';
        if (assetDescriptionField) assetDescriptionField.value = campaign.assetDescription || '';

        // Populate Legacy Operation Details (for backward compatibility)
        const operationCodeField = document.getElementById('operationCode');
        const operationTypeField = document.getElementById('operationType');
        const operationDescriptionField = document.getElementById('operationDescription');
        const estimatedHoursField = document.getElementById('estimatedHours');
        const priorityField = document.getElementById('priority');

        if (operationCodeField) operationCodeField.value = campaign.operationCode || '';
        if (operationTypeField) operationTypeField.value = campaign.operationType || '';
        if (operationDescriptionField) operationDescriptionField.value = campaign.operationDescription || '';
        if (estimatedHoursField) estimatedHoursField.value = campaign.estimatedHours || '';
        if (priorityField) priorityField.value = campaign.priority || '';

        // Populate Legacy Parts Details (for backward compatibility)
        const partNumberField = document.getElementById('partNumber');
        const partNameField = document.getElementById('partName');
        const quantityField = document.getElementById('quantity');
        const unitCostField = document.getElementById('unitCost');
        const supplierField = document.getElementById('supplier');
        const partDescriptionField = document.getElementById('partDescription');

        if (partNumberField) partNumberField.value = campaign.partNumber || '';
        if (partNameField) partNameField.value = campaign.partName || '';
        if (quantityField) quantityField.value = campaign.quantity || '';
        if (unitCostField) unitCostField.value = campaign.unitCost || '';
        if (supplierField) supplierField.value = campaign.supplier || '';
        if (partDescriptionField) partDescriptionField.value = campaign.partDescription || '';

        // Populate Customer Details - use new system if available
        this.addedCustomers = campaign.addedCustomers || [];
        this.selectedRegions = campaign.selectedRegions || [];
        this.selectedStates = campaign.selectedStates || [];
        this.renderAddedCustomers();

        // Legacy customer fields (if they exist)
        const customerNameField = document.getElementById('customerName');
        const customerEmailField = document.getElementById('customerEmail');
        const customerPhoneField = document.getElementById('customerPhone');
        const customerCompanyField = document.getElementById('customerCompany');
        const customerAddressField = document.getElementById('customerAddress');

        if (customerNameField) customerNameField.value = campaign.customerName || '';
        if (customerEmailField) customerEmailField.value = campaign.customerEmail || '';
        if (customerPhoneField) customerPhoneField.value = campaign.customerPhone || '';
        if (customerCompanyField) customerCompanyField.value = campaign.customerCompany || '';
        if (customerAddressField) customerAddressField.value = campaign.customerAddress || '';

        // Populate Causing Parts - use new system if available
        this.selectedCausingParts = campaign.selectedCausingParts || [];
        this.renderCausingPartsList();

        // Legacy causing parts fields (if they exist)
        const causingPartNumberField = document.getElementById('causingPartNumber');
        const causingPartNameField = document.getElementById('causingPartName');
        const failureReasonField = document.getElementById('failureReason');
        const failureDateField = document.getElementById('failureDate');
        const replacementRequiredField = document.getElementById('replacementRequired');

        if (causingPartNumberField) causingPartNumberField.value = campaign.causingPartNumber || '';
        if (causingPartNameField) causingPartNameField.value = campaign.causingPartName || '';
        if (failureReasonField) failureReasonField.value = campaign.failureReason || '';
        if (failureDateField) failureDateField.value = campaign.failureDate || '';
        if (replacementRequiredField) replacementRequiredField.value = campaign.replacementRequired || '';

        // Populate Attachments
        document.getElementById('attachmentDescription').value = campaign.attachmentDescription || '';

        this.showModal();
    }

    // Open view campaign modal
    openViewModal(id) {
        const campaign = this.campaigns.find(c => c.id === id);
        if (!campaign) return;

        this.currentViewId = id;
        this.populateViewModal(campaign);
        this.initializeViewTabs();
        this.showViewModal();
    }

    // Open delete confirmation modal
    openDeleteModal(id) {
        this.currentEditId = id;
        this.showDeleteModal();
    }

    // Copy campaign functionality
    copyCampaign(id) {
        const campaign = this.campaigns.find(c => c.id === id);
        if (!campaign) return;

        // Generate new campaign code
        const newCode = this.generateUniqueCampaignCode(campaign.code);

        // Copy campaign data and populate form
        this.currentEditId = null;
        document.getElementById('modalTitle').textContent = 'Copy Campaign';
        document.getElementById('saveBtn').textContent = 'Save Copy';

        this.populateFormWithCampaign({...campaign, code: newCode});
        this.showModal();
    }

    // Copy from view modal
    copyFromView() {
        if (this.currentViewId) {
            this.closeViewModal();
            this.copyCampaign(this.currentViewId);
        }
    }

    // Show modal
    showModal() {
        document.getElementById('campaignModal').classList.add('active');
        document.body.style.overflow = 'hidden';

        // Initialize fail code, asset, operation, parts, labor, and customer functionality when modal is shown
        setTimeout(() => {
            this.initializeFailCodeSearch();
            this.renderFailCodesList();
            this.initializeAssetFilters();
            this.renderSelectedAssets();
            this.initializeOperationSearch();
            this.renderOperationsList();
            this.initializePartsSearch();
            this.renderPartsList();
            this.initializeLaborSearch();
            this.renderLaborList();
            this.initializeCustomerFunctionality();
            this.renderCustomerStates();
            this.renderAddedCustomers();
            this.initializeCausingPartsSearch();
            this.renderCausingPartsList();
            this.renderAttachmentsList();
            this.initializeMultipleDeleteFunctionality();
        }, 100);
    }

    // Close modal
    closeModal() {
        document.getElementById('campaignModal').classList.remove('active');
        document.body.style.overflow = 'auto';
        this.resetForm();
    }

    // Show view modal
    showViewModal() {
        document.getElementById('viewModal').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close view modal
    closeViewModal() {
        document.getElementById('viewModal').classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Show delete modal
    showDeleteModal() {
        document.getElementById('deleteModal').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close delete modal
    closeDeleteModal() {
        document.getElementById('deleteModal').classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Save campaign
    saveCampaign() {
        // Basic Info
        const code = document.getElementById('campaignCode').value.trim();
        const name = document.getElementById('campaignName').value.trim();
        const isActive = document.getElementById('isActive').checked;
        const isManufacturer = document.getElementById('isManufacturer').checked;
        const isVehicleRecall = document.getElementById('isVehicleRecall').checked;
        const isEquipmentRecall = document.getElementById('isEquipmentRecall').checked;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const remarks = document.getElementById('remarks').value.trim();

        // Validation
        if (!code || !name) {
            alert('Please fill in Campaign Code and Campaign Name.');
            return;
        }

        // Check for duplicate code
        const existingCampaign = this.campaigns.find(c =>
            c.code.toLowerCase() === code.toLowerCase() && c.id !== this.currentEditId
        );

        if (existingCampaign) {
            alert('Campaign code already exists. Please use a different code.');
            return;
        }

        // Collect all form data
        const campaignData = {
            // Basic Info
            code,
            name,
            isActive,
            isManufacturer,
            isVehicleRecall,
            isEquipmentRecall,
            startDate,
            endDate,
            remarks,

            // Fail Code Details (multiple fail codes)
            failCodes: [...this.selectedFailCodes],

            // Asset Details (multiple assets)
            selectedAssets: [...this.selectedAssets],

            // Operation Details (multiple operations)
            selectedOperations: [...this.selectedOperations],

            // Parts Details (multiple parts)
            selectedParts: [...this.selectedParts],

            // Labor Details (multiple labor)
            selectedLabor: [...this.selectedLabor],

            // Legacy Asset Details (for backward compatibility)
            assetId: this.getFieldValue('assetId'),
            assetName: this.getFieldValue('assetName'),
            assetLocation: this.getFieldValue('assetLocation'),
            assetDescription: this.getFieldValue('assetDescription'),

            // Legacy Operation Details (for backward compatibility)
            operationCode: this.getFieldValue('operationCode'),
            operationType: this.getFieldValue('operationType'),
            operationDescription: this.getFieldValue('operationDescription'),
            estimatedHours: parseFloat(this.getFieldValue('estimatedHours')) || 0,
            priority: this.getFieldValue('priority'),

            // Legacy Parts Details (for backward compatibility)
            partNumber: this.getFieldValue('partNumber'),
            partName: this.getFieldValue('partName'),
            quantity: parseInt(this.getFieldValue('quantity')) || 0,
            unitCost: parseFloat(this.getFieldValue('unitCost')) || 0,
            supplier: this.getFieldValue('supplier'),
            partDescription: this.getFieldValue('partDescription'),

            // Customer Details (using new customer system)
            addedCustomers: this.addedCustomers || [],
            selectedRegions: this.selectedRegions || [],
            selectedStates: this.selectedStates || [],

            // Legacy Customer Details (for backward compatibility)
            customerName: this.getFieldValue('customerName'),
            customerEmail: this.getFieldValue('customerEmail'),
            customerPhone: this.getFieldValue('customerPhone'),
            customerCompany: this.getFieldValue('customerCompany'),
            customerAddress: this.getFieldValue('customerAddress'),

            // Causing Parts (using new causing parts system)
            selectedCausingParts: this.selectedCausingParts || [],

            // Legacy Causing Parts (for backward compatibility)
            causingPartNumber: this.getFieldValue('causingPartNumber'),
            causingPartName: this.getFieldValue('causingPartName'),
            failureReason: this.getFieldValue('failureReason'),
            failureDate: this.getFieldValue('failureDate'),
            replacementRequired: this.getFieldValue('replacementRequired'),

            // Attachments (using new attachments system)
            selectedAttachments: this.selectedAttachments || [],

            // Legacy Attachments (for backward compatibility)
            attachmentDescription: document.getElementById('attachmentDescription').value.trim()
        };

        if (this.currentEditId) {
            // Edit existing campaign
            const campaignIndex = this.campaigns.findIndex(c => c.id === this.currentEditId);
            if (campaignIndex !== -1) {
                this.campaigns[campaignIndex] = {
                    ...this.campaigns[campaignIndex],
                    ...campaignData,
                    updatedAt: new Date().toISOString()
                };
            }
        } else {
            // Add new campaign
            const newCampaign = {
                id: Date.now(),
                ...campaignData,
                createdAt: new Date().toISOString()
            };
            this.campaigns.push(newCampaign);
        }

        this.saveCampaigns();
        this.renderCampaigns();
        this.closeModal();
    }

    // Confirm delete
    confirmDelete() {
        if (this.currentEditId) {
            this.campaigns = this.campaigns.filter(c => c.id !== this.currentEditId);
            this.saveCampaigns();
            this.renderCampaigns();
        }
        this.closeDeleteModal();
    }

    // Reset form
    resetForm() {
        document.getElementById('campaignForm').reset();

        // Reset checkboxes to default values
        document.getElementById('isActive').checked = true;
        document.getElementById('isManufacturer').checked = false;
        document.getElementById('isVehicleRecall').checked = false;
        document.getElementById('isEquipmentRecall').checked = false;

        // Reset fail codes
        this.selectedFailCodes = [];
        this.renderFailCodesList();
        this.clearFailCodeForm();

        // Reset selected assets
        this.selectedAssets = [];
        this.renderSelectedAssets();

        // Reset selected operations
        this.selectedOperations = [];
        this.renderOperationsList();
        this.clearOperationForm();

        // Reset selected labor
        this.selectedLabor = [];
        this.renderLaborList();
        this.clearLaborForm();

        // Reset selected parts
        this.selectedParts = [];
        this.renderPartsList();
        this.clearPartForm();

        // Reset customer data
        this.selectedRegions = [];
        this.selectedStates = [];
        this.addedCustomers = [];
        if (typeof this.clearCustomerSelection === 'function') {
            this.clearCustomerSelection();
        }

        // Reset causing parts data
        this.selectedCausingParts = [];
        if (typeof this.clearCausingPartForm === 'function') {
            this.clearCausingPartForm();
        }
        if (typeof this.renderCausingPartsList === 'function') {
            this.renderCausingPartsList();
        }

        // Reset attachments data
        this.selectedAttachments = [];
        if (typeof this.clearAttachmentForm === 'function') {
            this.clearAttachmentForm();
        }
        if (typeof this.renderAttachmentsList === 'function') {
            this.renderAttachmentsList();
        }

        // Reset to first tab (fail-code since basic info is now always visible)
        document.querySelectorAll('.tab-item').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
        const firstTab = document.querySelector('.tab-item[data-tab="fail-code"]');
        const firstPanel = document.getElementById('fail-code-panel');
        if (firstTab) firstTab.classList.add('active');
        if (firstPanel) firstPanel.classList.add('active');

        this.currentEditId = null;
    }

    // Search campaigns
    searchCampaigns(query) {
        return this.campaigns.filter(campaign =>
            campaign.code.toLowerCase().includes(query.toLowerCase()) ||
            campaign.name.toLowerCase().includes(query.toLowerCase())
        );
    }

    // Export campaigns
    exportCampaigns() {
        const dataStr = JSON.stringify(this.campaigns, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'campaigns.json';
        link.click();
        URL.revokeObjectURL(url);
    }

    // Generate unique campaign code
    generateUniqueCampaignCode(originalCode) {
        let counter = 1;
        let newCode = `${originalCode}_COPY`;

        while (this.campaigns.find(c => c.code === newCode)) {
            newCode = `${originalCode}_COPY_${counter}`;
            counter++;
        }

        return newCode;
    }

    // Populate form with campaign data (for copy functionality)
    populateFormWithCampaign(campaign) {
        // Populate Basic Info
        document.getElementById('campaignCode').value = campaign.code || '';
        document.getElementById('campaignName').value = campaign.name || '';
        document.getElementById('isActive').checked = campaign.isActive || false;
        document.getElementById('isManufacturer').checked = campaign.isManufacturer || false;
        document.getElementById('isVehicleRecall').checked = campaign.isVehicleRecall || false;
        document.getElementById('isEquipmentRecall').checked = campaign.isEquipmentRecall || false;
        document.getElementById('startDate').value = campaign.startDate || '';
        document.getElementById('endDate').value = campaign.endDate || '';
        document.getElementById('remarks').value = campaign.remarks || '';

        // Populate all other fields (same as openEditModal)
        this.selectedFailCodes = campaign.failCodes ? [...campaign.failCodes] : [];
        this.renderFailCodesList();
        this.clearFailCodeForm();

        this.selectedAssets = campaign.selectedAssets ? [...campaign.selectedAssets] : [];
        this.renderSelectedAssets();

        this.selectedOperations = campaign.selectedOperations ? [...campaign.selectedOperations] : [];
        this.renderOperationsList();
        this.clearOperationForm();

        this.selectedParts = campaign.selectedParts ? [...campaign.selectedParts] : [];
        this.renderPartsList();
        this.clearPartForm();

        this.selectedLabor = campaign.selectedLabor ? [...campaign.selectedLabor] : [];
        this.renderLaborList();
        this.clearLaborForm();

        // Legacy fields with null checks
        const assetIdField = document.getElementById('assetId');
        const assetNameField = document.getElementById('assetName');
        const assetLocationField = document.getElementById('assetLocation');
        const assetDescriptionField = document.getElementById('assetDescription');
        const operationCodeField = document.getElementById('operationCode');
        const operationTypeField = document.getElementById('operationType');
        const operationDescriptionField = document.getElementById('operationDescription');
        const estimatedHoursField = document.getElementById('estimatedHours');
        const priorityField = document.getElementById('priority');
        const partNumberField = document.getElementById('partNumber');
        const partNameField = document.getElementById('partName');
        const quantityField = document.getElementById('quantity');
        const unitCostField = document.getElementById('unitCost');
        const supplierField = document.getElementById('supplier');
        const partDescriptionField = document.getElementById('partDescription');

        if (assetIdField) assetIdField.value = campaign.assetId || '';
        if (assetNameField) assetNameField.value = campaign.assetName || '';
        if (assetLocationField) assetLocationField.value = campaign.assetLocation || '';
        if (assetDescriptionField) assetDescriptionField.value = campaign.assetDescription || '';
        if (operationCodeField) operationCodeField.value = campaign.operationCode || '';
        if (operationTypeField) operationTypeField.value = campaign.operationType || '';
        if (operationDescriptionField) operationDescriptionField.value = campaign.operationDescription || '';
        if (estimatedHoursField) estimatedHoursField.value = campaign.estimatedHours || '';
        if (priorityField) priorityField.value = campaign.priority || '';
        if (partNumberField) partNumberField.value = campaign.partNumber || '';
        if (partNameField) partNameField.value = campaign.partName || '';
        if (quantityField) quantityField.value = campaign.quantity || '';
        if (unitCostField) unitCostField.value = campaign.unitCost || '';
        if (supplierField) supplierField.value = campaign.supplier || '';
        if (partDescriptionField) partDescriptionField.value = campaign.partDescription || '';
        // Customer Details - use new system if available
        this.addedCustomers = campaign.addedCustomers || [];
        this.selectedRegions = campaign.selectedRegions || [];
        this.selectedStates = campaign.selectedStates || [];
        this.renderAddedCustomers();

        // Legacy customer fields (if they exist)
        const customerNameField = document.getElementById('customerName');
        const customerEmailField = document.getElementById('customerEmail');
        const customerPhoneField = document.getElementById('customerPhone');
        const customerCompanyField = document.getElementById('customerCompany');
        const customerAddressField = document.getElementById('customerAddress');

        if (customerNameField) customerNameField.value = campaign.customerName || '';
        if (customerEmailField) customerEmailField.value = campaign.customerEmail || '';
        if (customerPhoneField) customerPhoneField.value = campaign.customerPhone || '';
        if (customerCompanyField) customerCompanyField.value = campaign.customerCompany || '';
        if (customerAddressField) customerAddressField.value = campaign.customerAddress || '';

        // Causing Parts - use new system if available
        this.selectedCausingParts = campaign.selectedCausingParts || [];
        this.renderCausingPartsList();

        // Legacy causing parts fields (if they exist)
        const causingPartNumberField = document.getElementById('causingPartNumber');
        const causingPartNameField = document.getElementById('causingPartName');
        const failureReasonField = document.getElementById('failureReason');
        const failureDateField = document.getElementById('failureDate');
        const replacementRequiredField = document.getElementById('replacementRequired');

        if (causingPartNumberField) causingPartNumberField.value = campaign.causingPartNumber || '';
        if (causingPartNameField) causingPartNameField.value = campaign.causingPartName || '';
        if (failureReasonField) failureReasonField.value = campaign.failureReason || '';
        if (failureDateField) failureDateField.value = campaign.failureDate || '';
        if (replacementRequiredField) replacementRequiredField.value = campaign.replacementRequired || '';

        // Attachments - use new system if available
        this.selectedAttachments = campaign.selectedAttachments || [];
        this.renderAttachmentsList();

        // Legacy attachment field (if it exists)
        const attachmentDescriptionField = document.getElementById('attachmentDescription');
        if (attachmentDescriptionField) {
            attachmentDescriptionField.value = campaign.attachmentDescription || '';
        }
    }

    // Initialize view tabs
    initializeViewTabs() {
        const viewTabItems = document.querySelectorAll('#viewModal .tab-item');
        const viewTabPanels = document.querySelectorAll('#viewModal .tab-panel');

        viewTabItems.forEach(item => {
            item.addEventListener('click', () => {
                const targetTab = item.getAttribute('data-tab');

                // Remove active class from all view tabs and panels
                viewTabItems.forEach(tab => tab.classList.remove('active'));
                viewTabPanels.forEach(panel => panel.classList.remove('active'));

                // Add active class to clicked tab and corresponding panel
                item.classList.add('active');
                document.getElementById(`${targetTab}-panel`).classList.add('active');
            });
        });
    }

    // Populate view modal with campaign data
    populateViewModal(campaign) {
        // Basic Info
        document.getElementById('viewBasicContent').innerHTML = this.createViewContent([
            { label: 'Campaign Code', value: campaign.code },
            { label: 'Campaign Name', value: campaign.name },
            { label: 'Is Active', value: campaign.isActive, type: 'checkbox' },
            { label: 'Is Manufacturer', value: campaign.isManufacturer, type: 'checkbox' },
            { label: 'Is Vehicle Recall', value: campaign.isVehicleRecall, type: 'checkbox' },
            { label: 'Is Equipment Recall', value: campaign.isEquipmentRecall, type: 'checkbox' },
            { label: 'Start Date', value: campaign.startDate, type: 'date' },
            { label: 'End Date', value: campaign.endDate, type: 'date' },
            { label: 'Remarks', value: campaign.remarks, type: 'textarea' }
        ]);

        // Fail Code Details
        document.getElementById('viewFailCodeContent').innerHTML = this.createFailCodeViewContent(campaign.failCodes || []);

        // Asset Details
        document.getElementById('viewAssetContent').innerHTML = this.createAssetViewContent(campaign.selectedAssets || [], campaign);

        // Operation Details
        document.getElementById('viewOperationContent').innerHTML = this.createOperationViewContent(campaign.selectedOperations || [], campaign);

        // Parts Details
        document.getElementById('viewPartsContent').innerHTML = this.createViewContent([
            { label: 'Part Number', value: campaign.partNumber },
            { label: 'Part Name', value: campaign.partName },
            { label: 'Quantity', value: campaign.quantity },
            { label: 'Unit Cost', value: campaign.unitCost, type: 'currency' },
            { label: 'Supplier', value: campaign.supplier },
            { label: 'Part Description', value: campaign.partDescription, type: 'textarea' }
        ]);

        // Labor Charges
        document.getElementById('viewLaborContent').innerHTML = this.createLaborViewContent(campaign.selectedLabor || [], campaign);

        // Customer Details
        document.getElementById('viewCustomerContent').innerHTML = this.createViewContent([
            { label: 'Customer Name', value: campaign.customerName },
            { label: 'Customer Email', value: campaign.customerEmail },
            { label: 'Customer Phone', value: campaign.customerPhone },
            { label: 'Company', value: campaign.customerCompany },
            { label: 'Customer Address', value: campaign.customerAddress, type: 'textarea' }
        ]);

        // Causing Parts
        document.getElementById('viewCausingPartsContent').innerHTML = this.createViewContent([
            { label: 'Causing Part Number', value: campaign.causingPartNumber },
            { label: 'Causing Part Name', value: campaign.causingPartName },
            { label: 'Failure Reason', value: campaign.failureReason, type: 'textarea' },
            { label: 'Failure Date', value: campaign.failureDate, type: 'date' },
            { label: 'Replacement Required', value: campaign.replacementRequired }
        ]);

        // Attachments
        document.getElementById('viewAttachmentsContent').innerHTML = this.createAttachmentsViewContent(campaign.selectedAttachments || [], campaign);
    }

    // Create view content HTML
    createViewContent(fields) {
        return fields.map(field => {
            let displayValue = field.value || '';

            if (field.type === 'checkbox') {
                const checked = field.value ? 'checked' : 'unchecked';
                const icon = field.value ? '✓' : '';
                displayValue = `<div class="view-checkbox">
                    <span class="view-checkbox-icon ${checked}">${icon}</span>
                    <span>${field.value ? 'Yes' : 'No'}</span>
                </div>`;
            } else if (field.type === 'currency' && displayValue) {
                displayValue = `$${parseFloat(displayValue).toFixed(2)}`;
            } else if (field.type === 'date' && displayValue) {
                displayValue = new Date(displayValue).toLocaleDateString();
            } else if (!displayValue) {
                displayValue = '<span class="empty">Not specified</span>';
            }

            return `
                <div class="view-field">
                    <div class="view-label">${field.label}:</div>
                    <div class="view-value ${!field.value ? 'empty' : ''}">${displayValue}</div>
                </div>
            `;
        }).join('');
    }

    // Create fail code view content HTML
    createFailCodeViewContent(failCodes) {
        if (!failCodes || failCodes.length === 0) {
            return `
                <div class="view-field">
                    <div class="view-label">Fail Codes:</div>
                    <div class="view-value empty">No fail codes specified</div>
                </div>
            `;
        }

        return `
            <div class="view-field">
                <div class="view-label">Fail Codes (${failCodes.length}):</div>
                <div class="view-value">
                    <div class="view-fail-codes-list">
                        ${failCodes.map(failCode => `
                            <div class="view-fail-code-item">
                                <div class="view-fail-code-header">
                                    <span class="view-fail-code-code">${failCode.code}</span>
                                    <span class="view-fail-code-category">${failCode.category}</span>
                                </div>
                                <div class="view-fail-code-description">${failCode.description}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    // Create asset view content HTML
    createAssetViewContent(selectedAssets, campaign) {
        let content = '';

        // Show selected assets if any
        if (selectedAssets && selectedAssets.length > 0) {
            content += `
                <div class="view-field">
                    <div class="view-label">Selected Assets (${selectedAssets.length}):</div>
                    <div class="view-value">
                        <div class="view-assets-list">
                            ${selectedAssets.map(asset => `
                                <div class="view-asset-item">
                                    <div class="view-asset-header">
                                        <span class="view-asset-brand">${asset.brand}</span>
                                        <span class="view-asset-type">${asset.assetType}</span>
                                    </div>
                                    <div class="view-asset-details">
                                        Model: ${asset.model} | Serial: ${asset.serialNumber} | WO: ${asset.workOrderNumber}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        }

        // Show legacy asset details if available (for backward compatibility)
        if (campaign.assetId || campaign.assetName || campaign.assetLocation || campaign.assetDescription) {
            content += `
                <div class="view-field">
                    <div class="view-label">Legacy Asset Details:</div>
                    <div class="view-value">
                        ${this.createViewContent([
                            { label: 'Asset ID', value: campaign.assetId },
                            { label: 'Asset Name', value: campaign.assetName },
                            { label: 'Asset Location', value: campaign.assetLocation },
                            { label: 'Asset Description', value: campaign.assetDescription, type: 'textarea' }
                        ])}
                    </div>
                </div>
            `;
        }

        // If no assets at all
        if ((!selectedAssets || selectedAssets.length === 0) &&
            !campaign.assetId && !campaign.assetName && !campaign.assetLocation && !campaign.assetDescription) {
            content = `
                <div class="view-field">
                    <div class="view-label">Assets:</div>
                    <div class="view-value empty">No assets specified</div>
                </div>
            `;
        }

        return content;
    }

    // Create operation view content HTML
    createOperationViewContent(selectedOperations, campaign) {
        let content = '';

        // Show selected operations if any
        if (selectedOperations && selectedOperations.length > 0) {
            content += `
                <div class="view-field">
                    <div class="view-label">Selected Operations (${selectedOperations.length}):</div>
                    <div class="view-value">
                        <div class="view-operations-list">
                            ${selectedOperations.map(operation => `
                                <div class="view-operation-item">
                                    <div class="view-operation-header">
                                        <span class="view-operation-code">${operation.code}</span>
                                        <span class="view-operation-time">${operation.time} hrs</span>
                                        <span class="view-operation-qty">Qty: ${operation.qty}</span>
                                        ${operation.isMandatory ? '<span class="view-operation-mandatory">Mandatory</span>' : ''}
                                    </div>
                                    <div class="view-operation-description">${operation.description}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        }

        // Show legacy operation details if available (for backward compatibility)
        if (campaign.operationCode || campaign.operationType || campaign.operationDescription || campaign.estimatedHours || campaign.priority) {
            content += `
                <div class="view-field">
                    <div class="view-label">Legacy Operation Details:</div>
                    <div class="view-value">
                        ${this.createViewContent([
                            { label: 'Operation Code', value: campaign.operationCode },
                            { label: 'Operation Type', value: campaign.operationType },
                            { label: 'Operation Description', value: campaign.operationDescription, type: 'textarea' },
                            { label: 'Estimated Hours', value: campaign.estimatedHours },
                            { label: 'Priority', value: campaign.priority }
                        ])}
                    </div>
                </div>
            `;
        }

        // If no operations at all
        if ((!selectedOperations || selectedOperations.length === 0) &&
            !campaign.operationCode && !campaign.operationType && !campaign.operationDescription && !campaign.estimatedHours && !campaign.priority) {
            content = `
                <div class="view-field">
                    <div class="view-label">Operations:</div>
                    <div class="view-value empty">No operations specified</div>
                </div>
            `;
        }

        return content;
    }

    // Create attachments view content HTML
    createAttachmentsViewContent(selectedAttachments, campaign) {
        let content = '';

        // Show selected attachments if any
        if (selectedAttachments && selectedAttachments.length > 0) {
            content += `
                <div class="view-field">
                    <div class="view-label">Attachments (${selectedAttachments.length}):</div>
                    <div class="view-value">
                        <div class="view-attachments-list">
                            ${selectedAttachments.map(attachment => `
                                <div class="view-attachment-item">
                                    <div class="view-attachment-header">
                                        <div class="view-attachment-icon ${this.getFileExtension(attachment.filename)}">
                                            <i class="material-icons">${this.getFileIcon(attachment.filename)}</i>
                                        </div>
                                        <div class="view-attachment-info">
                                            <div class="view-attachment-filename">${attachment.filename}</div>
                                            <div class="view-attachment-size">${this.formatFileSize(attachment.size)}</div>
                                        </div>
                                        <div class="view-attachment-date">${this.formatDate(attachment.dateAdded)}</div>
                                    </div>
                                    <div class="view-attachment-description">${attachment.description}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        }

        // Show legacy attachment description if available (for backward compatibility)
        if (campaign.attachmentDescription) {
            content += `
                <div class="view-field">
                    <div class="view-label">Legacy Attachment Description:</div>
                    <div class="view-value">
                        <div class="view-attachment-legacy">${campaign.attachmentDescription}</div>
                    </div>
                </div>
            `;
        }

        // If no attachments at all
        if ((!selectedAttachments || selectedAttachments.length === 0) && !campaign.attachmentDescription) {
            content = `
                <div class="view-field">
                    <div class="view-label">Attachments:</div>
                    <div class="view-value empty">No attachments specified</div>
                </div>
            `;
        }

        return content;
    }

    // Create labor view content HTML
    createLaborViewContent(selectedLabor, campaign) {
        let content = '';

        // Show selected labor if any
        if (selectedLabor && selectedLabor.length > 0) {
            content += `
                <div class="view-field">
                    <div class="view-label">Selected Labor Charges (${selectedLabor.length}):</div>
                    <div class="view-value">
                        <div class="view-labor-list">
                            ${selectedLabor.map(labor => `
                                <div class="view-labor-item">
                                    <div class="view-labor-header">
                                        <span class="view-labor-code">${labor.code}</span>
                                        <span class="view-labor-rate">Rate: $${labor.rate.toFixed(2)}</span>
                                        <span class="view-labor-qty">Qty: ${labor.qty}</span>
                                        ${labor.isMandatory ? '<span class="view-labor-mandatory">Mandatory</span>' : ''}
                                    </div>
                                    <div class="view-labor-description">${labor.description}</div>
                                    <div class="view-labor-details">
                                        <span class="view-labor-discount">Discount: ${labor.discountPercent}%</span>
                                        <span class="view-labor-contribution">Mfg Contribution: ${labor.manufacturingContribution}%</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        }

        // Show legacy labor details if available (for backward compatibility)
        if (campaign.laborType || campaign.hourlyRate || campaign.laborHours || campaign.totalLaborCost || campaign.laborDescription) {
            content += `
                <div class="view-field">
                    <div class="view-label">Legacy Labor Details:</div>
                    <div class="view-value">
                        ${this.createViewContent([
                            { label: 'Labor Type', value: campaign.laborType },
                            { label: 'Hourly Rate', value: campaign.hourlyRate, type: 'currency' },
                            { label: 'Labor Hours', value: campaign.laborHours },
                            { label: 'Total Labor Cost', value: campaign.totalLaborCost, type: 'currency' },
                            { label: 'Labor Description', value: campaign.laborDescription, type: 'textarea' }
                        ])}
                    </div>
                </div>
            `;
        }

        // If no labor at all
        if ((!selectedLabor || selectedLabor.length === 0) &&
            !campaign.laborType && !campaign.hourlyRate && !campaign.laborHours && !campaign.totalLaborCost && !campaign.laborDescription) {
            content = `
                <div class="view-field">
                    <div class="view-label">Labor Charges:</div>
                    <div class="view-value empty">No labor charges specified</div>
                </div>
            `;
        }

        return content;
    }

    // Helper method to safely get field values
    getFieldValue(fieldId) {
        const field = document.getElementById(fieldId);
        return field ? field.value.trim() : '';
    }

    // Customer functionality
    initializeCustomerFunctionality() {
        // Initialize region checkboxes
        const regionCheckboxes = document.querySelectorAll('#regionList input[type="checkbox"]:not(#selectAllRegions)');

        regionCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => this.handleRegionSelection());
        });

        // Initialize customer database
        this.customerDatabase = this.initializeCustomerDatabase();
        this.addedCustomers = [];
    }

    // Initialize customer database
    initializeCustomerDatabase() {
        return [
            { id: 1, name: 'John Smith', email: 'john.smith@example.com', region: 'east', state: 'New York' },
            { id: 2, name: 'Sarah Johnson', email: 'sarah.j@example.com', region: 'west', state: 'California' },
            { id: 3, name: 'Mike Wilson', email: 'mike.w@example.com', region: 'canada', state: 'Ontario' },
            { id: 4, name: 'Emily Davis', email: 'emily.d@example.com', region: 'south', state: 'Texas' },
            { id: 5, name: 'David Brown', email: 'david.b@example.com', region: 'north', state: 'Minnesota' },
            { id: 6, name: 'Lisa Garcia', email: 'lisa.g@example.com', region: 'mexico', state: 'Jalisco' },
            { id: 7, name: 'Robert Taylor', email: 'robert.t@example.com', region: 'us', state: 'Florida' },
            { id: 8, name: 'Jennifer Martinez', email: 'jennifer.m@example.com', region: 'east', state: 'Pennsylvania' },
            { id: 9, name: 'Christopher Lee', email: 'chris.l@example.com', region: 'west', state: 'Nevada' },
            { id: 10, name: 'Amanda White', email: 'amanda.w@example.com', region: 'canada', state: 'British Columbia' }
        ];
    }

    // Handle region selection
    handleRegionSelection() {
        const regionCheckboxes = document.querySelectorAll('#regionList input[type="checkbox"]:not(#selectAllRegions)');
        this.selectedRegions = [];

        regionCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                this.selectedRegions.push(checkbox.value);
            }
        });

        // Update select all checkbox
        const selectAllCheckbox = document.getElementById('selectAllRegions');
        if (selectAllCheckbox) {
            selectAllCheckbox.checked = this.selectedRegions.length === regionCheckboxes.length;
        }

        // Auto-select all states from selected regions
        this.autoSelectStatesFromRegions();

        // Render states list
        this.renderCustomerStates();
    }

    // Auto-select states from selected regions
    autoSelectStatesFromRegions() {
        this.selectedStates = [];
        this.selectedRegions.forEach(regionKey => {
            if (this.regionDatabase[regionKey]) {
                this.regionDatabase[regionKey].states.forEach(state => {
                    if (!this.selectedStates.includes(state)) {
                        this.selectedStates.push(state);
                    }
                });
            }
        });
    }

    // Toggle select all regions
    toggleSelectAllRegions(checked) {
        const regionCheckboxes = document.querySelectorAll('#regionList input[type="checkbox"]:not(#selectAllRegions)');

        regionCheckboxes.forEach(checkbox => {
            checkbox.checked = checked;
        });

        this.handleRegionSelection();
    }

    // Render customer states
    renderCustomerStates() {
        const statesList = document.getElementById('statesList');
        if (!statesList) return;

        if (this.selectedRegions.length === 0) {
            statesList.innerHTML = `
                <div class="empty-states">
                    <i class="material-icons">location_on</i>
                    <p>Select a region to view available states</p>
                </div>
            `;
            return;
        }

        // Get all unique states from selected regions
        const availableStates = new Set();
        this.selectedRegions.forEach(regionKey => {
            if (this.regionDatabase[regionKey]) {
                this.regionDatabase[regionKey].states.forEach(state => {
                    availableStates.add(state);
                });
            }
        });

        const statesArray = Array.from(availableStates).sort();

        // Create states list with Select All option
        let statesHTML = `
            <div class="states-item" data-state="all">
                <label class="checkbox-label">
                    <input type="checkbox" id="selectAllStates" ${this.selectedStates.length === statesArray.length ? 'checked' : ''}>
                    <span class="checkbox-custom"></span>
                    <span class="checkbox-text">Select All</span>
                </label>
            </div>
        `;

        statesHTML += statesArray.map(state => `
            <div class="states-item">
                <label class="checkbox-label">
                    <input type="checkbox" value="${state}" ${this.selectedStates.includes(state) ? 'checked' : ''}>
                    <span class="checkbox-custom"></span>
                    <span class="checkbox-text">${state}</span>
                </label>
            </div>
        `).join('');

        statesList.innerHTML = statesHTML;

        // Add event listener to Select All States checkbox
        const selectAllStatesCheckbox = document.getElementById('selectAllStates');
        if (selectAllStatesCheckbox) {
            selectAllStatesCheckbox.addEventListener('change', (e) => {
                this.toggleSelectAllStates(e.target.checked, statesArray);
            });
        }

        // Add event listeners to individual state checkboxes
        statesList.querySelectorAll('input[type="checkbox"]:not(#selectAllStates)').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    if (!this.selectedStates.includes(e.target.value)) {
                        this.selectedStates.push(e.target.value);
                    }
                } else {
                    this.selectedStates = this.selectedStates.filter(state => state !== e.target.value);
                }
                this.updateSelectAllStatesCheckbox(statesArray);
            });
        });
    }

    // Toggle select all states
    toggleSelectAllStates(checked, availableStates) {
        if (checked) {
            this.selectedStates = [...availableStates];
        } else {
            this.selectedStates = [];
        }

        // Update individual state checkboxes
        const stateCheckboxes = document.querySelectorAll('#statesList input[type="checkbox"]:not(#selectAllStates)');
        stateCheckboxes.forEach(checkbox => {
            checkbox.checked = checked;
        });
    }

    // Update select all states checkbox
    updateSelectAllStatesCheckbox(availableStates) {
        const selectAllStatesCheckbox = document.getElementById('selectAllStates');
        if (selectAllStatesCheckbox) {
            selectAllStatesCheckbox.checked = this.selectedStates.length === availableStates.length;
        }
    }

    // Filter and add customers
    filterAndAddCustomers() {
        if (this.selectedRegions.length === 0 && this.selectedStates.length === 0) {
            alert('Please select at least one region or state to filter customers.');
            return;
        }

        // Filter customers based on selected regions and states
        const filteredCustomers = this.customerDatabase.filter(customer => {
            const regionMatch = this.selectedRegions.length === 0 || this.selectedRegions.includes(customer.region);
            const stateMatch = this.selectedStates.length === 0 || this.selectedStates.includes(customer.state);
            return regionMatch && stateMatch;
        });

        // Add filtered customers to the added customers list (avoid duplicates)
        filteredCustomers.forEach(customer => {
            if (!this.addedCustomers.find(c => c.id === customer.id)) {
                this.addedCustomers.push({...customer});
            }
        });

        this.renderAddedCustomers();

        // Show success message
        const button = document.getElementById('okCustomerBtn');
        const originalText = button.innerHTML;
        button.innerHTML = '<span>Added!</span>';
        button.disabled = true;

        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 1500);
    }

    // Clear customer selection
    clearCustomerSelection() {
        // Clear all region checkboxes
        const regionCheckboxes = document.querySelectorAll('#regionList input[type="checkbox"]');
        regionCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

        // Clear selected arrays
        this.selectedRegions = [];
        this.selectedStates = [];

        // Reset UI
        this.handleRegionSelection();
        this.renderAddedCustomers();
    }

    // Render added customers
    renderAddedCustomers() {
        const container = document.getElementById('addedCustomersContainer');
        const countElement = document.getElementById('customerCount');

        if (!container || !countElement) return;

        // Update count
        countElement.textContent = `(${this.addedCustomers.length})`;

        if (this.addedCustomers.length === 0) {
            container.innerHTML = `
                <div class="empty-customers">
                    <i class="material-icons">person_add</i>
                    <p>No customers added yet. Select regions and states above, then click OK to add customers.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="customer-cards-grid">
                ${this.addedCustomers.map(customer => `
                    <div class="customer-card" data-customer-id="${customer.id}">
                        <div class="customer-card-header">
                            <h4 class="customer-card-title">${customer.name}</h4>
                            <div class="customer-card-actions">
                                <button class="customer-card-btn edit" onclick="campaignManager.editCustomer(${customer.id})" title="Edit Customer">
                                    <i class="material-icons">edit</i>
                                </button>
                                <button class="customer-card-btn delete" onclick="campaignManager.deleteCustomer(${customer.id})" title="Delete Customer">
                                    <i class="material-icons">delete</i>
                                </button>
                            </div>
                        </div>
                        <div class="customer-card-content">
                            <div class="customer-card-field">
                                <span class="customer-card-label">Email:</span>
                                <span class="customer-card-value">${customer.email}</span>
                            </div>
                            <div class="customer-card-field">
                                <span class="customer-card-label">Region:</span>
                                <span class="customer-card-value">${this.regionDatabase[customer.region]?.name || customer.region}</span>
                            </div>
                            <div class="customer-card-field">
                                <span class="customer-card-label">State:</span>
                                <span class="customer-card-value">${customer.state}</span>
                            </div>
                            <div class="customer-card-tags">
                                <span class="customer-card-tag">${this.regionDatabase[customer.region]?.name || customer.region}</span>
                                <span class="customer-card-tag state">${customer.state}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Edit customer
    editCustomer(customerId) {
        const customer = this.addedCustomers.find(c => c.id === customerId);
        if (!customer) return;

        const customerCard = document.querySelector(`[data-customer-id="${customerId}"]`);
        if (!customerCard) return;

        // Store original values
        const originalName = customer.name;
        const originalEmail = customer.email;

        // Add edit mode class
        customerCard.classList.add('edit-mode');

        // Replace card content with edit form
        const cardContent = customerCard.querySelector('.customer-card-content');
        cardContent.innerHTML = `
            <div class="customer-card-edit-field">
                <label>Name:</label>
                <input type="text" class="customer-card-edit-input" id="editName_${customerId}" value="${customer.name}">
            </div>
            <div class="customer-card-edit-field">
                <label>Email:</label>
                <input type="email" class="customer-card-edit-input" id="editEmail_${customerId}" value="${customer.email}">
            </div>
            <div class="customer-card-edit-actions">
                <button class="customer-card-edit-btn save" onclick="campaignManager.saveCustomerEdit(${customerId})">
                    <i class="material-icons">check</i>
                    <span>Save</span>
                </button>
                <button class="customer-card-edit-btn cancel" onclick="campaignManager.cancelCustomerEdit(${customerId}, '${originalName}', '${originalEmail}')">
                    <i class="material-icons">close</i>
                    <span>Cancel</span>
                </button>
            </div>
        `;

        // Hide action buttons
        const actionButtons = customerCard.querySelector('.customer-card-actions');
        actionButtons.style.display = 'none';

        // Focus on name input
        document.getElementById(`editName_${customerId}`).focus();
    }

    // Save customer edit
    saveCustomerEdit(customerId) {
        const customer = this.addedCustomers.find(c => c.id === customerId);
        if (!customer) return;

        const nameInput = document.getElementById(`editName_${customerId}`);
        const emailInput = document.getElementById(`editEmail_${customerId}`);

        if (!nameInput || !emailInput) return;

        const newName = nameInput.value.trim();
        const newEmail = emailInput.value.trim();

        // Validate inputs
        if (!newName) {
            alert('Customer name is required');
            nameInput.focus();
            return;
        }

        if (!newEmail) {
            alert('Customer email is required');
            emailInput.focus();
            return;
        }

        // Update customer data
        customer.name = newName;
        customer.email = newEmail;

        // Re-render the customer card
        this.renderAddedCustomers();
    }

    // Cancel customer edit
    cancelCustomerEdit(customerId, originalName, originalEmail) {
        // Re-render the customer card to restore original state
        this.renderAddedCustomers();
    }

    // Delete customer
    deleteCustomer(customerId) {
        if (confirm('Are you sure you want to remove this customer?')) {
            this.addedCustomers = this.addedCustomers.filter(c => c.id !== customerId);
            this.renderAddedCustomers();
        }
    }

    // Filter regions based on search
    filterRegions(searchTerm) {
        const regionItems = document.querySelectorAll('#regionList .region-item:not([data-region="all"])');

        regionItems.forEach(item => {
            const text = item.querySelector('.checkbox-text').textContent.toLowerCase();
            if (text.includes(searchTerm.toLowerCase())) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // Filter states based on search
    filterStates(searchTerm) {
        const stateItems = document.querySelectorAll('#statesList .states-item:not([data-state="all"])');

        stateItems.forEach(item => {
            const text = item.querySelector('.checkbox-text').textContent.toLowerCase();
            if (text.includes(searchTerm.toLowerCase())) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // Causing Parts functionality
    initializeCausingPartsSearch() {
        // Initialize search inputs
        this.initializeCausingPartPrefixSearch();
        this.initializeCausingPartNumberSearch();
        this.initializeCausingPartDescriptionSearch();
    }

    // Initialize causing part prefix search
    initializeCausingPartPrefixSearch() {
        const searchInput = document.getElementById('causingPartPrefixSearch');
        const dropdown = document.getElementById('causingPartPrefixDropdown');

        if (!searchInput || !dropdown) return;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query.length === 0) {
                dropdown.style.display = 'none';
                return;
            }

            const filteredPrefixes = [...new Set(this.causingPartsDatabase
                .filter(part => part.prefix.toLowerCase().includes(query.toLowerCase()))
                .map(part => part.prefix))];

            if (filteredPrefixes.length > 0) {
                dropdown.innerHTML = filteredPrefixes.map(prefix => `
                    <div class="search-dropdown-item" onclick="campaignManager.selectCausingPartPrefix('${prefix}')">
                        <div class="prefix-item">${prefix}</div>
                    </div>
                `).join('');
                dropdown.style.display = 'block';
            } else {
                dropdown.innerHTML = '<div class="search-dropdown-item no-results">No prefixes found</div>';
                dropdown.style.display = 'block';
            }
        });

        // Hide dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });
    }

    // Initialize causing part number search
    initializeCausingPartNumberSearch() {
        const searchInput = document.getElementById('causingPartNumberSearch');
        const dropdown = document.getElementById('causingPartNumberDropdown');

        if (!searchInput || !dropdown) return;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query.length === 0) {
                dropdown.style.display = 'none';
                return;
            }

            const filteredParts = this.causingPartsDatabase
                .filter(part => part.partNumber.toLowerCase().includes(query.toLowerCase()));

            if (filteredParts.length > 0) {
                dropdown.innerHTML = filteredParts.map(part => `
                    <div class="search-dropdown-item" onclick="campaignManager.selectCausingPartNumber('${part.partNumber}', '${part.prefix}', '${part.description}')">
                        <div class="part-number-item">
                            <div class="part-number">${part.partNumber}</div>
                            <div class="part-description">${part.description}</div>
                        </div>
                    </div>
                `).join('');
                dropdown.style.display = 'block';
            } else {
                dropdown.innerHTML = '<div class="search-dropdown-item no-results">No part numbers found</div>';
                dropdown.style.display = 'block';
            }
        });

        // Hide dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });
    }

    // Initialize causing part description search
    initializeCausingPartDescriptionSearch() {
        const searchInput = document.getElementById('causingPartDescriptionSearch');
        const dropdown = document.getElementById('causingPartDescriptionDropdown');

        if (!searchInput || !dropdown) return;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query.length === 0) {
                dropdown.style.display = 'none';
                return;
            }

            const filteredParts = this.causingPartsDatabase
                .filter(part => part.description.toLowerCase().includes(query.toLowerCase()));

            if (filteredParts.length > 0) {
                dropdown.innerHTML = filteredParts.map(part => `
                    <div class="search-dropdown-item" onclick="campaignManager.selectCausingPartDescription('${part.description}', '${part.prefix}', '${part.partNumber}')">
                        <div class="description-item">
                            <div class="description">${part.description}</div>
                            <div class="part-info">${part.prefix} - ${part.partNumber}</div>
                        </div>
                    </div>
                `).join('');
                dropdown.style.display = 'block';
            } else {
                dropdown.innerHTML = '<div class="search-dropdown-item no-results">No descriptions found</div>';
                dropdown.style.display = 'block';
            }
        });

        // Hide dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });
    }

    // Select causing part prefix
    selectCausingPartPrefix(prefix) {
        document.getElementById('causingPartPrefixSearch').value = prefix;
        document.getElementById('causingPartPrefixDropdown').style.display = 'none';

        // Auto-fill related fields if exact match found
        const matchingParts = this.causingPartsDatabase.filter(part => part.prefix === prefix);
        if (matchingParts.length === 1) {
            document.getElementById('causingPartNumberSearch').value = matchingParts[0].partNumber;
            document.getElementById('causingPartDescriptionSearch').value = matchingParts[0].description;
        }
    }

    // Select causing part number
    selectCausingPartNumber(partNumber, prefix, description) {
        document.getElementById('causingPartNumberSearch').value = partNumber;
        document.getElementById('causingPartPrefixSearch').value = prefix;
        document.getElementById('causingPartDescriptionSearch').value = description;
        document.getElementById('causingPartNumberDropdown').style.display = 'none';
    }

    // Select causing part description
    selectCausingPartDescription(description, prefix, partNumber) {
        document.getElementById('causingPartDescriptionSearch').value = description;
        document.getElementById('causingPartPrefixSearch').value = prefix;
        document.getElementById('causingPartNumberSearch').value = partNumber;
        document.getElementById('causingPartDescriptionDropdown').style.display = 'none';
    }

    // Add causing part
    addCausingPart() {
        const prefix = document.getElementById('causingPartPrefixSearch').value.trim();
        const partNumber = document.getElementById('causingPartNumberSearch').value.trim();
        const description = document.getElementById('causingPartDescriptionSearch').value.trim();

        // Validation
        if (!prefix || !partNumber || !description) {
            alert('Please fill in Part Prefix, Part Number, and Description fields.');
            return;
        }

        // Check if part already exists
        const existingPart = this.selectedCausingParts.find(part =>
            part.prefix === prefix && part.partNumber === partNumber
        );

        if (existingPart) {
            alert('This causing part has already been added.');
            return;
        }

        // Create new causing part object
        const newCausingPart = {
            id: Date.now(),
            prefix: prefix,
            partNumber: partNumber,
            description: description
        };

        // Add to selected causing parts
        this.selectedCausingParts.push(newCausingPart);

        // Clear form and render list
        this.clearCausingPartForm();
        this.renderCausingPartsList();

        // Show success message
        const button = document.getElementById('addCausingPartBtn');
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="material-icons">check</i><span>Added!</span>';
        button.disabled = true;

        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 1500);
    }

    // Clear causing part form
    clearCausingPartForm() {
        document.getElementById('causingPartPrefixSearch').value = '';
        document.getElementById('causingPartNumberSearch').value = '';
        document.getElementById('causingPartDescriptionSearch').value = '';

        // Hide all dropdowns
        document.getElementById('causingPartPrefixDropdown').style.display = 'none';
        document.getElementById('causingPartNumberDropdown').style.display = 'none';
        document.getElementById('causingPartDescriptionDropdown').style.display = 'none';
    }

    // Render causing parts list
    renderCausingPartsList() {
        const container = document.getElementById('causingPartsList');
        const countElement = document.getElementById('causingPartsCount');

        if (!container || !countElement) return;

        // Update count
        countElement.textContent = `(${this.selectedCausingParts.length})`;

        if (this.selectedCausingParts.length === 0) {
            container.innerHTML = `
                <div class="empty-causing-parts">
                    <i class="material-icons">warning</i>
                    <p>No causing parts added yet. Use the form above to add causing parts.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.selectedCausingParts.map(part => `
            <div class="causing-part-item" data-part-id="${part.id}">
                <div class="causing-part-header">
                    <label class="checkbox-label item-checkbox">
                        <input type="checkbox" class="causing-part-checkbox" data-part-id="${part.id}">
                        <span class="checkbox-custom"></span>
                    </label>
                    <h4 class="causing-part-title">${part.prefix} - ${part.partNumber}</h4>
                    <div class="causing-part-actions">
                        <button class="causing-part-btn edit" onclick="campaignManager.editCausingPart(${part.id})" title="Edit Causing Part">
                            <i class="material-icons">edit</i>
                        </button>
                        <button class="causing-part-btn delete" onclick="campaignManager.deleteCausingPart(${part.id})" title="Delete Causing Part">
                            <i class="material-icons">delete</i>
                        </button>
                    </div>
                </div>
                <div class="causing-part-content">
                    <div class="causing-part-field">
                        <span class="causing-part-label">Description</span>
                        <span class="causing-part-value">${part.description}</span>
                    </div>
                </div>
                <div class="causing-part-tags">
                    <span class="causing-part-tag">${part.prefix}</span>
                </div>
            </div>
        `).join('');

        // Show/hide multiple delete actions
        this.updateCausingPartsMultipleActions();
    }

    // Edit causing part
    editCausingPart(partId) {
        const part = this.selectedCausingParts.find(p => p.id === partId);
        if (!part) return;

        // Fill form with part data
        document.getElementById('causingPartPrefixSearch').value = part.prefix;
        document.getElementById('causingPartNumberSearch').value = part.partNumber;
        document.getElementById('causingPartDescriptionSearch').value = part.description;

        // Remove the part from the list (will be re-added when form is submitted)
        this.selectedCausingParts = this.selectedCausingParts.filter(p => p.id !== partId);
        this.renderCausingPartsList();

        // Scroll to form
        document.querySelector('.causing-parts-form').scrollIntoView({ behavior: 'smooth' });
    }

    // Delete causing part
    deleteCausingPart(partId) {
        if (confirm('Are you sure you want to remove this causing part?')) {
            this.selectedCausingParts = this.selectedCausingParts.filter(p => p.id !== partId);
            this.renderCausingPartsList();
        }
    }

    // Update causing parts multiple actions visibility
    updateCausingPartsMultipleActions() {
        const actionsContainer = document.getElementById('causingPartsMultipleActions');
        if (actionsContainer) {
            actionsContainer.style.display = this.selectedCausingParts.length > 0 ? 'flex' : 'none';
        }
    }

    // Update fail codes multiple actions visibility
    updateFailCodesMultipleActions() {
        const actionsContainer = document.getElementById('failCodeMultipleActions');
        if (actionsContainer) {
            actionsContainer.style.display = this.selectedFailCodes.length > 0 ? 'flex' : 'none';
        }
    }

    // Update operations multiple actions visibility
    updateOperationsMultipleActions() {
        const actionsContainer = document.getElementById('operationMultipleActions');
        if (actionsContainer) {
            actionsContainer.style.display = this.selectedOperations.length > 0 ? 'flex' : 'none';
        }
    }

    // Update parts multiple actions visibility
    updatePartsMultipleActions() {
        const actionsContainer = document.getElementById('partsMultipleActions');
        if (actionsContainer) {
            actionsContainer.style.display = this.selectedParts.length > 0 ? 'flex' : 'none';
        }
    }

    // Update labor multiple actions visibility
    updateLaborMultipleActions() {
        const actionsContainer = document.getElementById('laborMultipleActions');
        if (actionsContainer) {
            actionsContainer.style.display = this.selectedLabor.length > 0 ? 'flex' : 'none';
        }
    }

    // Multiple delete functionality for all tabs
    initializeMultipleDeleteFunctionality() {
        // Causing Parts multiple delete
        const deleteSelectedCausingParts = document.getElementById('deleteSelectedCausingParts');
        const selectAllCausingParts = document.getElementById('selectAllCausingParts');

        if (deleteSelectedCausingParts) {
            deleteSelectedCausingParts.addEventListener('click', () => this.deleteSelectedCausingParts());
        }

        if (selectAllCausingParts) {
            selectAllCausingParts.addEventListener('click', () => this.selectAllCausingParts());
        }

        // Fail Codes multiple delete
        const deleteSelectedFailCodes = document.getElementById('deleteSelectedFailCodes');
        const selectAllFailCodes = document.getElementById('selectAllFailCodes');

        if (deleteSelectedFailCodes) {
            deleteSelectedFailCodes.addEventListener('click', () => this.deleteSelectedFailCodes());
        }

        if (selectAllFailCodes) {
            selectAllFailCodes.addEventListener('click', () => this.selectAllFailCodes());
        }

        // Operations multiple delete
        const deleteSelectedOperations = document.getElementById('deleteSelectedOperations');
        const selectAllOperations = document.getElementById('selectAllOperations');

        if (deleteSelectedOperations) {
            deleteSelectedOperations.addEventListener('click', () => this.deleteSelectedOperations());
        }

        if (selectAllOperations) {
            selectAllOperations.addEventListener('click', () => this.selectAllOperations());
        }

        // Parts multiple delete
        const deleteSelectedParts = document.getElementById('deleteSelectedParts');
        const selectAllParts = document.getElementById('selectAllParts');

        if (deleteSelectedParts) {
            deleteSelectedParts.addEventListener('click', () => this.deleteSelectedParts());
        }

        if (selectAllParts) {
            selectAllParts.addEventListener('click', () => this.selectAllParts());
        }

        // Labor multiple delete
        const deleteSelectedLabor = document.getElementById('deleteSelectedLabor');
        const selectAllLabor = document.getElementById('selectAllLabor');

        if (deleteSelectedLabor) {
            deleteSelectedLabor.addEventListener('click', () => this.deleteSelectedLabor());
        }

        if (selectAllLabor) {
            selectAllLabor.addEventListener('click', () => this.selectAllLabor());
        }
    }

    // Causing Parts multiple delete methods
    deleteSelectedCausingParts() {
        const selectedCheckboxes = document.querySelectorAll('.causing-part-checkbox:checked');
        if (selectedCheckboxes.length === 0) {
            alert('Please select causing parts to delete.');
            return;
        }

        if (confirm(`Are you sure you want to delete ${selectedCheckboxes.length} selected causing part(s)?`)) {
            const selectedIds = Array.from(selectedCheckboxes).map(cb => parseInt(cb.dataset.partId));
            this.selectedCausingParts = this.selectedCausingParts.filter(part => !selectedIds.includes(part.id));
            this.renderCausingPartsList();
        }
    }

    selectAllCausingParts() {
        const checkboxes = document.querySelectorAll('.causing-part-checkbox');
        const allChecked = Array.from(checkboxes).every(cb => cb.checked);

        checkboxes.forEach(cb => {
            cb.checked = !allChecked;
        });
    }

    // Fail Codes multiple delete methods
    deleteSelectedFailCodes() {
        const selectedCheckboxes = document.querySelectorAll('.fail-code-checkbox:checked');
        if (selectedCheckboxes.length === 0) {
            alert('Please select fail codes to delete.');
            return;
        }

        if (confirm(`Are you sure you want to delete ${selectedCheckboxes.length} selected fail code(s)?`)) {
            const selectedIds = Array.from(selectedCheckboxes).map(cb => parseInt(cb.dataset.failCodeId));
            this.selectedFailCodes = this.selectedFailCodes.filter(fc => !selectedIds.includes(fc.id));
            this.renderFailCodesList();
        }
    }

    selectAllFailCodes() {
        const checkboxes = document.querySelectorAll('.fail-code-checkbox');
        const allChecked = Array.from(checkboxes).every(cb => cb.checked);

        checkboxes.forEach(cb => {
            cb.checked = !allChecked;
        });
    }

    // Operations multiple delete methods
    deleteSelectedOperations() {
        const selectedCheckboxes = document.querySelectorAll('.operation-checkbox:checked');
        if (selectedCheckboxes.length === 0) {
            alert('Please select operations to delete.');
            return;
        }

        if (confirm(`Are you sure you want to delete ${selectedCheckboxes.length} selected operation(s)?`)) {
            const selectedIds = Array.from(selectedCheckboxes).map(cb => parseInt(cb.dataset.operationId));
            this.selectedOperations = this.selectedOperations.filter(op => !selectedIds.includes(op.id));
            this.renderOperationsList();
        }
    }

    selectAllOperations() {
        const checkboxes = document.querySelectorAll('.operation-checkbox');
        const allChecked = Array.from(checkboxes).every(cb => cb.checked);

        checkboxes.forEach(cb => {
            cb.checked = !allChecked;
        });
    }

    // Parts multiple delete methods
    deleteSelectedParts() {
        const selectedCheckboxes = document.querySelectorAll('.part-checkbox:checked');
        if (selectedCheckboxes.length === 0) {
            alert('Please select parts to delete.');
            return;
        }

        if (confirm(`Are you sure you want to delete ${selectedCheckboxes.length} selected part(s)?`)) {
            const selectedIds = Array.from(selectedCheckboxes).map(cb => parseInt(cb.dataset.partId));
            this.selectedParts = this.selectedParts.filter(part => !selectedIds.includes(part.id));
            this.renderPartsList();
        }
    }

    selectAllParts() {
        const checkboxes = document.querySelectorAll('.part-checkbox');
        const allChecked = Array.from(checkboxes).every(cb => cb.checked);

        checkboxes.forEach(cb => {
            cb.checked = !allChecked;
        });
    }

    // Labor multiple delete methods
    deleteSelectedLabor() {
        const selectedCheckboxes = document.querySelectorAll('.labor-checkbox:checked');
        if (selectedCheckboxes.length === 0) {
            alert('Please select labor charges to delete.');
            return;
        }

        if (confirm(`Are you sure you want to delete ${selectedCheckboxes.length} selected labor charge(s)?`)) {
            const selectedIds = Array.from(selectedCheckboxes).map(cb => parseInt(cb.dataset.laborId));
            this.selectedLabor = this.selectedLabor.filter(labor => !selectedIds.includes(labor.id));
            this.renderLaborList();
        }
    }

    selectAllLabor() {
        const checkboxes = document.querySelectorAll('.labor-checkbox');
        const allChecked = Array.from(checkboxes).every(cb => cb.checked);

        checkboxes.forEach(cb => {
            cb.checked = !allChecked;
        });
    }

    // Global keyboard navigation functionality
    initializeGlobalKeyboardNavigation() {
        // Initialize keyboard navigation for all form elements
        this.setupTabOrder();
        this.setupEscapeHandling();
        this.setupEnterHandling();
        this.setupSpaceHandling();
        this.setupDropdownKeyboardNavigation();
        this.setupModalKeyboardNavigation();
    }

    // Setup tab order for all form elements
    setupTabOrder() {
        // Set tabindex for all form elements in logical order
        const formElements = [
            // Basic Info Tab
            'campaignCode', 'campaignName', 'isActive', 'isManufacturer',
            'isVehicleRecall', 'isEquipmentRecall', 'startDate', 'endDate', 'remarks',

            // Fail Code Tab
            'failCodeSearch', 'addFailCodeBtn', 'clearFailCodeBtn',

            // Asset Tab
            'brandFilter', 'assetTypeFilter', 'modelFilter', 'searchAssetsBtn',

            // Operation Tab
            'operationCodeSearch', 'operationQty', 'isMandatory', 'addOperationBtn', 'clearOperationBtn',

            // Parts Tab
            'partPrefixSearch', 'partNumberSearch', 'partDescriptionSearch',
            'partQty', 'partDiscountPercent', 'partManufacturingContribution',
            'partIsMandatory', 'addPartBtn', 'clearPartBtn',

            // Labor Tab
            'laborCodeSearch', 'laborDescriptionSearch', 'laborQty',
            'laborDiscountPercent', 'laborManufacturingContribution',
            'laborIsMandatory', 'addLaborBtn', 'clearLaborBtn',

            // Customer Tab
            'regionsSearchInput', 'statesSearchInput', 'addCustomersBtn',

            // Causing Parts Tab
            'causingPartPrefixSearch', 'causingPartNumberSearch', 'causingPartDescriptionSearch',
            'addCausingPartBtn', 'clearCausingPartBtn',

            // Attachment Tab
            'attachmentDescription'
        ];

        formElements.forEach((elementId, index) => {
            const element = document.getElementById(elementId);
            if (element) {
                element.setAttribute('tabindex', index + 1);
            }
        });

        // Set tabindex for buttons
        const buttons = ['saveBtn', 'cancelBtn', 'closeModal'];
        buttons.forEach((buttonId, index) => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.setAttribute('tabindex', formElements.length + index + 1);
            }
        });
    }

    // Setup escape key handling
    setupEscapeHandling() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close any open dropdowns
                this.closeAllDropdowns();

                // Close modals if open
                if (document.getElementById('campaignModal').classList.contains('active')) {
                    this.closeModal();
                    e.preventDefault();
                } else if (document.getElementById('viewModal').classList.contains('active')) {
                    this.closeViewModal();
                    e.preventDefault();
                } else if (document.getElementById('deleteModal').classList.contains('active')) {
                    this.closeDeleteModal();
                    e.preventDefault();
                }
            }
        });
    }

    // Setup enter key handling
    setupEnterHandling() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const activeElement = document.activeElement;

                // Handle dropdown item selection
                if (activeElement && activeElement.classList.contains('search-dropdown-item')) {
                    activeElement.click();
                    e.preventDefault();
                    return;
                }

                // Handle form submission
                if (activeElement && activeElement.tagName === 'INPUT' && activeElement.type !== 'submit') {
                    // Check if we're in a search field with dropdown
                    const dropdown = this.getAssociatedDropdown(activeElement);
                    if (dropdown && dropdown.style.display !== 'none') {
                        const firstItem = dropdown.querySelector('.search-dropdown-item');
                        if (firstItem) {
                            firstItem.click();
                            e.preventDefault();
                            return;
                        }
                    }

                    // Move to next form element or trigger add button
                    this.handleEnterInForm(activeElement);
                    e.preventDefault();
                }

                // Handle button activation
                if (activeElement && activeElement.tagName === 'BUTTON') {
                    activeElement.click();
                    e.preventDefault();
                }
            }
        });
    }

    // Setup space key handling
    setupSpaceHandling() {
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ' || e.key === 'Space') {
                const activeElement = document.activeElement;

                // Handle checkbox toggle
                if (activeElement && activeElement.type === 'checkbox') {
                    // Let default behavior handle checkbox toggle
                    return;
                }

                // Handle button activation
                if (activeElement && activeElement.tagName === 'BUTTON') {
                    activeElement.click();
                    e.preventDefault();
                }

                // Handle dropdown item selection
                if (activeElement && activeElement.classList.contains('search-dropdown-item')) {
                    activeElement.click();
                    e.preventDefault();
                }
            }
        });
    }

    // Setup dropdown keyboard navigation
    setupDropdownKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            const activeElement = document.activeElement;

            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                // Check if we're in a search input with an open dropdown
                const dropdown = this.getAssociatedDropdown(activeElement);
                if (dropdown && dropdown.style.display !== 'none') {
                    this.navigateDropdown(dropdown, e.key === 'ArrowDown' ? 'down' : 'up');
                    e.preventDefault();
                }
            }
        });
    }

    // Setup modal keyboard navigation
    setupModalKeyboardNavigation() {
        // Tab navigation within modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const modal = document.querySelector('.modal.active');
                if (modal) {
                    this.handleTabInModal(modal, e);
                }
            }
        });
    }

    // Helper methods for keyboard navigation
    closeAllDropdowns() {
        const dropdowns = document.querySelectorAll('.search-dropdown');
        dropdowns.forEach(dropdown => {
            dropdown.style.display = 'none';
        });
    }

    getAssociatedDropdown(input) {
        if (!input || !input.id) return null;

        const dropdownMappings = {
            'failCodeSearch': 'failCodeDropdown',
            'operationCodeSearch': 'operationCodeDropdown',
            'operationDescriptionSearch': 'operationDescriptionDropdown',
            'partPrefixSearch': 'partPrefixDropdown',
            'partNumberSearch': 'partNumberDropdown',
            'partDescriptionSearch': 'partDescriptionDropdown',
            'laborCodeSearch': 'laborCodeDropdown',
            'laborDescriptionSearch': 'laborDescriptionDropdown',
            'causingPartPrefixSearch': 'causingPartPrefixDropdown',
            'causingPartNumberSearch': 'causingPartNumberDropdown',
            'causingPartDescriptionSearch': 'causingPartDescriptionDropdown'
        };

        const dropdownId = dropdownMappings[input.id];
        return dropdownId ? document.getElementById(dropdownId) : null;
    }

    navigateDropdown(dropdown, direction) {
        const items = dropdown.querySelectorAll('.search-dropdown-item:not(.no-results)');
        if (items.length === 0) return;

        let currentIndex = -1;
        items.forEach((item, index) => {
            if (item.classList.contains('highlighted')) {
                currentIndex = index;
                item.classList.remove('highlighted');
            }
        });

        if (direction === 'down') {
            currentIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        } else {
            currentIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        }

        items[currentIndex].classList.add('highlighted');
        items[currentIndex].scrollIntoView({ block: 'nearest' });

        // Set focus to the highlighted item
        items[currentIndex].focus();
    }

    handleEnterInForm(input) {
        const currentTab = document.querySelector('.tab-panel.active');
        if (!currentTab) return;

        // Find the add button in the current tab
        const addButton = currentTab.querySelector('button[id*="add"], button[id*="Add"]');
        if (addButton && !addButton.disabled) {
            addButton.click();
            return;
        }

        // Move to next input field
        const inputs = currentTab.querySelectorAll('input, select, textarea, button');
        const currentIndex = Array.from(inputs).indexOf(input);
        if (currentIndex >= 0 && currentIndex < inputs.length - 1) {
            inputs[currentIndex + 1].focus();
        }
    }

    handleTabInModal(modal, e) {
        const focusableElements = modal.querySelectorAll(
            'input, select, textarea, button, [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            // Shift + Tab (backward)
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            // Tab (forward)
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }

    // Attachments Management Methods
    addAttachment() {
        const fileInput = document.getElementById('attachmentFiles');
        const descriptionInput = document.getElementById('attachmentDescription');

        const files = fileInput.files;
        const description = descriptionInput.value.trim();

        if (!files || files.length === 0) {
            alert('Please select at least one file to upload.');
            return;
        }

        if (!description) {
            alert('Please enter a description for the attachment(s).');
            return;
        }

        // Process each selected file
        Array.from(files).forEach(file => {
            // Validate file type
            if (!this.isValidFileType(file)) {
                alert(`File "${file.name}" is not a supported format. Please use PDF, DOC, DOCX, JPG, PNG, XLSX, or XLS files.`);
                return;
            }

            // Validate file size (max 10MB per file)
            if (file.size > 10 * 1024 * 1024) {
                alert(`File "${file.name}" is too large. Maximum file size is 10MB.`);
                return;
            }

            // Create attachment object
            const attachment = {
                id: Date.now() + Math.random(), // Unique ID
                filename: file.name,
                description: description,
                size: file.size,
                type: file.type,
                dateAdded: new Date().toISOString(),
                file: file // Store the actual file object
            };

            this.selectedAttachments.push(attachment);
        });

        this.renderAttachmentsList();
        this.clearAttachmentForm();
    }

    isValidFileType(file) {
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/jpg',
            'image/png',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];

        const allowedExtensions = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.xls', '.xlsx'];
        const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));

        return allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension);
    }

    clearAttachmentForm() {
        document.getElementById('attachmentFiles').value = '';
        document.getElementById('attachmentDescription').value = '';
    }

    renderAttachmentsList() {
        const listContainer = document.getElementById('attachmentsList');
        const countElement = document.getElementById('attachmentsCount');
        const multipleActions = document.getElementById('attachmentMultipleActions');

        if (!listContainer) {
            console.error('Attachments list container not found');
            return;
        }

        // Update count
        if (countElement) {
            countElement.textContent = `(${this.selectedAttachments.length})`;
        }

        if (this.selectedAttachments.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-attachments">
                    <i class="material-icons">attach_file</i>
                    <p>No attachments added yet. Use the form above to add attachments.</p>
                </div>
            `;
            if (multipleActions) {
                multipleActions.style.display = 'none';
            }
            return;
        }

        listContainer.innerHTML = this.selectedAttachments.map(attachment => `
            <div class="attachment-item" data-attachment-id="${attachment.id}">
                <div class="attachment-info">
                    <label class="checkbox-label attachment-checkbox">
                        <input type="checkbox" class="attachment-checkbox-input" data-attachment-id="${attachment.id}">
                        <span class="checkbox-custom"></span>
                    </label>

                    <div class="attachment-icon ${this.getFileExtension(attachment.filename)}">
                        <i class="material-icons">${this.getFileIcon(attachment.filename)}</i>
                    </div>

                    <div class="attachment-details">
                        <div class="attachment-filename">${attachment.filename}</div>
                        <div class="attachment-description">${attachment.description}</div>
                        <div class="attachment-edit-form">
                            <textarea class="attachment-edit-input" placeholder="Enter new description...">${attachment.description}</textarea>
                        </div>
                    </div>
                </div>

                <div class="attachment-meta">
                    <div class="attachment-size">${this.formatFileSize(attachment.size)}</div>
                    <div class="attachment-date">${this.formatDate(attachment.dateAdded)}</div>
                </div>

                <div class="attachment-actions">
                    <button class="btn btn-outline btn-icon edit-attachment" data-attachment-id="${attachment.id}" title="Edit description">
                        <i class="material-icons">edit</i>
                    </button>
                    <button class="btn btn-outline btn-icon save-attachment" data-attachment-id="${attachment.id}" title="Save changes" style="display: none;">
                        <i class="material-icons">save</i>
                    </button>
                    <button class="btn btn-outline btn-icon cancel-attachment" data-attachment-id="${attachment.id}" title="Cancel edit" style="display: none;">
                        <i class="material-icons">cancel</i>
                    </button>
                    <button class="btn btn-danger btn-icon delete-attachment" data-attachment-id="${attachment.id}" title="Delete attachment">
                        <i class="material-icons">delete</i>
                    </button>
                </div>
            </div>
        `).join('');

        this.updateAttachmentsMultipleActions();
        this.bindAttachmentEvents();
    }

    bindAttachmentEvents() {
        const listContainer = document.getElementById('attachmentsList');
        if (!listContainer) return;

        // Edit attachment events
        listContainer.querySelectorAll('.edit-attachment').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const attachmentId = button.getAttribute('data-attachment-id');
                this.editAttachment(attachmentId);
            });
        });

        // Save attachment events
        listContainer.querySelectorAll('.save-attachment').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const attachmentId = button.getAttribute('data-attachment-id');
                this.saveAttachment(attachmentId);
            });
        });

        // Cancel attachment events
        listContainer.querySelectorAll('.cancel-attachment').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const attachmentId = button.getAttribute('data-attachment-id');
                this.cancelAttachmentEdit(attachmentId);
            });
        });

        // Delete attachment events
        listContainer.querySelectorAll('.delete-attachment').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const attachmentId = button.getAttribute('data-attachment-id');
                this.deleteAttachment(attachmentId);
            });
        });

        // Checkbox events
        listContainer.querySelectorAll('.attachment-checkbox-input').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateAttachmentsMultipleActions();
            });
        });
    }

    editAttachment(attachmentId) {
        const attachmentItem = document.querySelector(`[data-attachment-id="${attachmentId}"]`);
        if (!attachmentItem) return;

        attachmentItem.classList.add('editing');

        const description = attachmentItem.querySelector('.attachment-description');
        const editForm = attachmentItem.querySelector('.attachment-edit-form');
        const editBtn = attachmentItem.querySelector('.edit-attachment');
        const saveBtn = attachmentItem.querySelector('.save-attachment');
        const cancelBtn = attachmentItem.querySelector('.cancel-attachment');

        description.style.display = 'none';
        editForm.classList.add('active');
        editBtn.style.display = 'none';
        saveBtn.style.display = 'flex';
        cancelBtn.style.display = 'flex';
    }

    saveAttachment(attachmentId) {
        const attachmentItem = document.querySelector(`[data-attachment-id="${attachmentId}"]`);
        if (!attachmentItem) return;

        const editInput = attachmentItem.querySelector('.attachment-edit-input');
        const newDescription = editInput.value.trim();

        if (!newDescription) {
            alert('Description cannot be empty.');
            return;
        }

        // Update the attachment in the array
        const attachment = this.selectedAttachments.find(a => a.id == attachmentId);
        if (attachment) {
            attachment.description = newDescription;
        }

        this.cancelAttachmentEdit(attachmentId);
        this.renderAttachmentsList();
    }

    cancelAttachmentEdit(attachmentId) {
        const attachmentItem = document.querySelector(`[data-attachment-id="${attachmentId}"]`);
        if (!attachmentItem) return;

        attachmentItem.classList.remove('editing');

        const description = attachmentItem.querySelector('.attachment-description');
        const editForm = attachmentItem.querySelector('.attachment-edit-form');
        const editBtn = attachmentItem.querySelector('.edit-attachment');
        const saveBtn = attachmentItem.querySelector('.save-attachment');
        const cancelBtn = attachmentItem.querySelector('.cancel-attachment');

        description.style.display = 'block';
        editForm.classList.remove('active');
        editBtn.style.display = 'flex';
        saveBtn.style.display = 'none';
        cancelBtn.style.display = 'none';
    }

    deleteAttachment(attachmentId) {
        if (confirm('Are you sure you want to delete this attachment?')) {
            this.selectedAttachments = this.selectedAttachments.filter(a => a.id != attachmentId);
            this.renderAttachmentsList();
        }
    }

    deleteSelectedAttachments() {
        const selectedCheckboxes = document.querySelectorAll('.attachment-checkbox-input:checked');
        if (selectedCheckboxes.length === 0) {
            alert('Please select attachments to delete.');
            return;
        }

        if (confirm(`Are you sure you want to delete ${selectedCheckboxes.length} selected attachment(s)?`)) {
            const selectedIds = Array.from(selectedCheckboxes).map(cb => cb.getAttribute('data-attachment-id'));
            this.selectedAttachments = this.selectedAttachments.filter(a => !selectedIds.includes(a.id.toString()));
            this.renderAttachmentsList();
        }
    }

    toggleSelectAllAttachments() {
        const checkboxes = document.querySelectorAll('.attachment-checkbox-input');
        const allChecked = Array.from(checkboxes).every(cb => cb.checked);

        checkboxes.forEach(cb => {
            cb.checked = !allChecked;
        });

        this.updateAttachmentsMultipleActions();
    }

    updateAttachmentsMultipleActions() {
        const multipleActions = document.getElementById('attachmentMultipleActions');
        const selectedCheckboxes = document.querySelectorAll('.attachment-checkbox-input:checked');

        if (multipleActions) {
            multipleActions.style.display = selectedCheckboxes.length > 0 ? 'flex' : 'none';
        }
    }

    getFileExtension(filename) {
        const extension = filename.toLowerCase().substring(filename.lastIndexOf('.') + 1);
        return ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'xlsx', 'xls'].includes(extension) ? extension : 'default';
    }

    getFileIcon(filename) {
        const extension = this.getFileExtension(filename);
        const iconMap = {
            pdf: 'picture_as_pdf',
            doc: 'description',
            docx: 'description',
            jpg: 'image',
            jpeg: 'image',
            png: 'image',
            xlsx: 'table_chart',
            xls: 'table_chart',
            default: 'insert_drive_file'
        };
        return iconMap[extension] || iconMap.default;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
}

// Global functions for campaign filtering and searching
function filterCampaigns(searchQuery) {
    if (!window.campaignManager) return;

    const campaignsGrid = document.getElementById('campaignsGrid');
    if (!campaignsGrid) return;

    const campaignCards = campaignsGrid.querySelectorAll('.campaign-card');

    campaignCards.forEach(card => {
        const campaignName = card.querySelector('h3').textContent.toLowerCase();
        const campaignCode = card.querySelector('.campaign-code').textContent.toLowerCase();

        if (campaignName.includes(searchQuery.toLowerCase()) ||
            campaignCode.includes(searchQuery.toLowerCase())) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function filterCampaignsByStatus(status) {
    if (!window.campaignManager) return;

    const campaignsGrid = document.getElementById('campaignsGrid');
    if (!campaignsGrid) return;

    const campaignCards = campaignsGrid.querySelectorAll('.campaign-card');

    campaignCards.forEach(card => {
        const statusElement = card.querySelector('.campaign-status');
        const cardStatus = statusElement.classList.contains('active') ? 'active' : 'inactive';

        if (status === 'all' || cardStatus === status) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.campaignManager = new CampaignManager();
});

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function generateCampaignCode() {
    const prefix = 'CAMP';
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}${timestamp}`;
}

// Initialize the campaign manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.campaignManager = new CampaignManager();

    // Set campaigns tab as active by default
    switchMainTab('campaigns');

    // Initialize analytics immediately for testing
    setTimeout(() => {
        console.log('Force initializing analytics for testing...');
        initializeAnalytics();
    }, 1000);
});

// Integrated Analytics Class for Campaign Management with Parts & Service Features
class IntegratedAnalytics {
    constructor(campaignManager) {
        this.campaignManager = campaignManager;
        this.campaigns = this.campaignManager.campaigns || [];
        this.analyticsData = this.generateAnalyticsData();
        this.charts = {};
        this.init();
    }

    init() {
        console.log('Starting analytics initialization...');
        console.log('Analytics data:', this.analyticsData);
        console.log('Parts service data:', this.analyticsData.partsServiceData);

        // Add visual indicator
        const analyticsPanel = document.getElementById('analytics-panel');
        if (analyticsPanel) {
            analyticsPanel.style.border = '3px solid green';
            analyticsPanel.style.backgroundColor = '#f0f8ff';
        }

        try {
            this.bindEvents();
            this.renderSummaryCards();
            this.renderPartsServiceSummaryCards();
            this.initializeCharts();
            this.renderPopularCampaigns();
            this.renderPopularPartsService();
            this.renderPerformanceTable();
            this.renderPartsServiceTable();
            this.renderFeedbackSection();
            console.log('Integrated Analytics with Parts & Service features initialized');

            // Show success message
            if (analyticsPanel) {
                const successMsg = document.createElement('div');
                successMsg.innerHTML = '<h3 style="color: green; text-align: center; padding: 20px;">✅ Analytics Loaded Successfully!</h3>';
                analyticsPanel.insertBefore(successMsg, analyticsPanel.firstChild);
            }
        } catch (error) {
            console.error('Error during analytics initialization:', error);

            // Show error message
            if (analyticsPanel) {
                const errorMsg = document.createElement('div');
                errorMsg.innerHTML = `<h3 style="color: red; text-align: center; padding: 20px;">❌ Analytics Error: ${error.message}</h3>`;
                analyticsPanel.insertBefore(errorMsg, analyticsPanel.firstChild);
            }
        }
    }

    // Generate analytics data based on existing campaigns
    generateAnalyticsData() {
        const data = {
            campaignTypes: [
                'Part-Specific Discounts', 'Service Package Deals', 'Bundled Offers',
                'Loyalty Program Rewards', 'Seasonal Maintenance Campaigns',
                'Recall/Service Bulletin Offers', 'Warranty Extension Promotions',
                'Accessory Sales Campaigns', 'Referral Programs'
            ],
            statusDistribution: { active: 0, inactive: 0, pending: 0 },
            usageTrends: this.generateUsageTrends(),
            customerFeedback: this.generateCustomerFeedback(),
            performanceMetrics: this.generatePerformanceMetrics(),
            partsServiceData: this.generatePartsServiceData()
        };

        // Calculate status distribution
        if (this.campaigns && this.campaigns.length > 0) {
            this.campaigns.forEach(campaign => {
                if (campaign.isActive) {
                    data.statusDistribution.active++;
                } else {
                    data.statusDistribution.inactive++;
                }
            });
        } else {
            // Default distribution for demo
            data.statusDistribution = { active: 4, inactive: 2, pending: 1 };
        }

        return data;
    }

    // Generate parts & service specific data
    generatePartsServiceData() {
        const partsServiceTypes = [
            'Brake Pads Discount', 'Oil Change Special', 'Tire & Alignment Bundle',
            'Battery Replacement Offer', 'AC Service Package', 'Transmission Service',
            'Engine Tune-up Special', 'Brake Service Package', 'Suspension Repair',
            'Electrical System Check'
        ];

        const campaignTypes = [
            'Part-Specific Discounts', 'Service Package Deals', 'Bundled Offers',
            'Loyalty Program Rewards', 'Seasonal Maintenance Campaigns',
            'Recall/Service Bulletin Offers', 'Warranty Extension Promotions',
            'Accessory Sales Campaigns', 'Referral Programs'
        ];

        const categories = ['Parts', 'Service', 'Bundled'];
        const data = [];

        // Generate sample parts & service campaigns
        for (let i = 0; i < 10; i++) {
            const category = categories[Math.floor(Math.random() * categories.length)];
            const offered = Math.floor(Math.random() * 500) + 100;
            const soldBooked = Math.floor(offered * (0.3 + Math.random() * 0.5)); // 30-80% redemption
            const redemptionRate = Math.round((soldBooked / offered) * 100);
            const attachmentRate = Math.floor(Math.random() * 60) + 20; // 20-80%

            data.push({
                id: i + 1,
                name: partsServiceTypes[i],
                type: campaignTypes[Math.floor(Math.random() * campaignTypes.length)],
                category: category,
                offered: offered,
                soldBooked: soldBooked,
                redemptionRate: redemptionRate,
                rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 to 5.0
                attachmentRate: attachmentRate,
                salesVolume: Math.floor(Math.random() * 10000) + 1000,
                isActive: Math.random() > 0.3
            });
        }

        return data;
    }

    // Generate mock usage trends data
    generateUsageTrends() {
        const trends = [];
        const today = new Date();

        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);

            trends.push({
                date: date.toISOString().split('T')[0],
                usage: Math.floor(Math.random() * 100) + 20,
                conversions: Math.floor(Math.random() * 50) + 10,
                engagement: Math.floor(Math.random() * 80) + 30,
                partsRedemption: Math.floor(Math.random() * 60) + 20,
                serviceBookings: Math.floor(Math.random() * 40) + 15
            });
        }

        return trends;
    }

    // Generate mock customer feedback with parts & service focus
    generateCustomerFeedback() {
        const feedbackTypes = ['positive', 'neutral', 'negative'];
        const partsComments = [
            'Great quality brake pads, much better than expected!',
            'Fast delivery on the oil filter, very satisfied.',
            'Battery installation was quick and professional.',
            'Parts were genuine and fit perfectly.',
            'Good value for money on the tire package.'
        ];

        const serviceComments = [
            'Excellent AC service, car is cooling perfectly now.',
            'Quick oil change service, in and out in 30 minutes.',
            'Thorough brake inspection and service.',
            'Professional transmission service, smooth shifting now.',
            'Great customer service during engine tune-up.'
        ];

        const feedback = [];

        if (!this.campaigns || this.campaigns.length === 0) {
            // Generate sample feedback for demo
            for (let i = 0; i < 20; i++) {
                const isPartsRelated = Math.random() > 0.5;
                feedback.push({
                    campaignId: i + 1,
                    campaignName: isPartsRelated ? `Parts Campaign ${i + 1}` : `Service Campaign ${i + 1}`,
                    category: isPartsRelated ? 'parts' : 'service',
                    rating: Math.floor(Math.random() * 5) + 1,
                    type: feedbackTypes[Math.floor(Math.random() * feedbackTypes.length)],
                    comment: isPartsRelated
                        ? partsComments[Math.floor(Math.random() * partsComments.length)]
                        : serviceComments[Math.floor(Math.random() * serviceComments.length)],
                    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
                    customerName: `Customer ${Math.floor(Math.random() * 1000)}`
                });
            }
        } else {
            this.campaigns.forEach(campaign => {
                const numFeedback = Math.floor(Math.random() * 5) + 1;
                for (let i = 0; i < numFeedback; i++) {
                    const isPartsRelated = Math.random() > 0.5;
                    feedback.push({
                        campaignId: campaign.id,
                        campaignName: campaign.name,
                        category: isPartsRelated ? 'parts' : 'service',
                        rating: Math.floor(Math.random() * 5) + 1,
                        type: feedbackTypes[Math.floor(Math.random() * feedbackTypes.length)],
                        comment: isPartsRelated
                            ? partsComments[Math.floor(Math.random() * partsComments.length)]
                            : serviceComments[Math.floor(Math.random() * serviceComments.length)],
                        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
                        customerName: `Customer ${Math.floor(Math.random() * 1000)}`
                    });
                }
            });
        }

        return feedback.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // Generate performance metrics for each campaign
    generatePerformanceMetrics() {
        const campaignTypes = [
            'Part-Specific Discounts', 'Service Package Deals', 'Bundled Offers',
            'Loyalty Program Rewards', 'Seasonal Maintenance Campaigns'
        ];

        if (!this.campaigns || this.campaigns.length === 0) {
            return [];
        }

        return this.campaigns.map(campaign => ({
            ...campaign,
            type: campaignTypes[Math.floor(Math.random() * campaignTypes.length)],
            usage: Math.floor(Math.random() * 1000) + 100,
            expired: Math.floor(Math.random() * 50) + 5,
            rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 to 5.0
            engagement: Math.floor(Math.random() * 40) + 60, // 60% to 100%
            conversion: Math.floor(Math.random() * 30) + 10, // 10% to 40%
            popularity: Math.floor(Math.random() * 100) + 1
        }));
    }

    // Bind event listeners
    bindEvents() {
        // Chart export buttons
        const exportPartsCampaignTypesChart = document.getElementById('exportPartsCampaignTypesChart');
        const exportPartsPerformanceChart = document.getElementById('exportPartsPerformanceChart');
        const exportServicePerformanceChart = document.getElementById('exportServicePerformanceChart');
        const exportRedemptionTrendsChart = document.getElementById('exportRedemptionTrendsChart');

        if (exportPartsCampaignTypesChart) {
            exportPartsCampaignTypesChart.addEventListener('click', () => {
                this.exportChart('analyticsPartsCampaignTypesChart');
            });
        }

        if (exportPartsPerformanceChart) {
            exportPartsPerformanceChart.addEventListener('click', () => {
                this.exportChart('analyticsPartsPerformanceChart');
            });
        }

        if (exportServicePerformanceChart) {
            exportServicePerformanceChart.addEventListener('click', () => {
                this.exportChart('analyticsServicePerformanceChart');
            });
        }

        if (exportRedemptionTrendsChart) {
            exportRedemptionTrendsChart.addEventListener('click', () => {
                this.exportChart('analyticsRedemptionTrendsChart');
            });
        }

        // Filter controls
        const partsServiceFilter = document.getElementById('analyticsPartsServiceFilter');
        const redemptionPeriod = document.getElementById('analyticsRedemptionPeriod');
        const popularPartsMetric = document.getElementById('analyticsPopularPartsMetric');
        const partsPerformanceSearch = document.getElementById('analyticsPartsPerformanceSearch');
        const feedbackFilter = document.getElementById('analyticsFeedbackFilter');
        const exportPartsServiceDataBtn = document.getElementById('exportPartsServiceDataBtn');

        if (partsServiceFilter) {
            partsServiceFilter.addEventListener('change', (e) => {
                this.filterPartsServiceData(e.target.value);
            });
        }

        if (redemptionPeriod) {
            redemptionPeriod.addEventListener('change', (e) => {
                this.updateRedemptionTrendsChart(parseInt(e.target.value));
            });
        }

        if (popularPartsMetric) {
            popularPartsMetric.addEventListener('change', (e) => {
                this.renderPopularPartsService(e.target.value);
            });
        }

        if (partsPerformanceSearch) {
            partsPerformanceSearch.addEventListener('input', (e) => {
                this.filterPartsServiceTable(e.target.value);
            });
        }

        if (feedbackFilter) {
            feedbackFilter.addEventListener('change', (e) => {
                this.renderFeedbackSection(e.target.value);
            });
        }

        if (exportPartsServiceDataBtn) {
            exportPartsServiceDataBtn.addEventListener('click', () => {
                this.exportPartsServiceData();
            });
        }
    }

    // Render summary cards
    renderSummaryCards() {
        const totalCampaigns = this.campaigns ? this.campaigns.length : 0;
        const activeCampaigns = this.campaigns ? this.campaigns.filter(c => c.isActive).length : 0;
        const performanceMetrics = this.analyticsData.performanceMetrics || [];
        const popularCampaigns = performanceMetrics.filter(c => c.popularity > 70).length;
        const avgEngagement = performanceMetrics.length > 0
            ? performanceMetrics.reduce((sum, c) => sum + c.engagement, 0) / performanceMetrics.length
            : 0;

        const totalElement = document.getElementById('analyticsTotalCampaigns');
        const activeElement = document.getElementById('analyticsActiveCampaigns');
        const popularElement = document.getElementById('analyticsPopularCampaigns');
        const engagementElement = document.getElementById('analyticsAvgEngagement');

        if (totalElement) totalElement.textContent = totalCampaigns;
        if (activeElement) activeElement.textContent = activeCampaigns;
        if (popularElement) popularElement.textContent = popularCampaigns;
        if (engagementElement) engagementElement.textContent = `${Math.round(avgEngagement)}%`;
    }

    // Render parts & service summary cards
    renderPartsServiceSummaryCards() {
        const partsServiceData = this.analyticsData.partsServiceData || [];
        const partsPromotions = partsServiceData.filter(item => item.category === 'Parts').length;
        const serviceCampaigns = partsServiceData.filter(item => item.category === 'Service').length;
        const avgRedemptionRate = partsServiceData.length > 0
            ? partsServiceData.reduce((sum, item) => sum + item.redemptionRate, 0) / partsServiceData.length
            : 0;
        const avgAttachmentRate = partsServiceData.length > 0
            ? partsServiceData.reduce((sum, item) => sum + item.attachmentRate, 0) / partsServiceData.length
            : 0;

        const partsElement = document.getElementById('analyticsPartsPromotions');
        const serviceElement = document.getElementById('analyticsServiceCampaigns');
        const redemptionElement = document.getElementById('analyticsRedemptionRate');
        const attachmentElement = document.getElementById('analyticsAttachmentRate');

        if (partsElement) partsElement.textContent = partsPromotions;
        if (serviceElement) serviceElement.textContent = serviceCampaigns;
        if (redemptionElement) redemptionElement.textContent = `${Math.round(avgRedemptionRate)}%`;
        if (attachmentElement) attachmentElement.textContent = `${Math.round(avgAttachmentRate)}%`;
    }

    // Initialize all charts
    initializeCharts() {
        try {
            console.log('Initializing analytics charts...');

            // Check if Chart.js is available
            if (typeof Chart === 'undefined') {
                console.error('Chart.js is not loaded!');
                return;
            }
            console.log('Chart.js is available:', Chart);

            this.initPartsCampaignTypesChart();
            this.initPartsPerformanceChart();
            this.initServicePerformanceChart();
            this.initRedemptionTrendsChart();
            this.initFeedbackPieChart();

            console.log('Analytics charts initialized successfully');
        } catch (error) {
            console.error('Error initializing analytics charts:', error);
        }
    }

    // Initialize parts campaign types chart
    initPartsCampaignTypesChart() {
        try {
            console.log('Initializing parts campaign types chart...');
            const canvas = document.getElementById('analyticsPartsCampaignTypesChart');
            if (!canvas) {
                console.error('Canvas not found: analyticsPartsCampaignTypesChart');
                return;
            }

            const ctx = canvas.getContext('2d');
            const typesCounts = {};

            // Count campaigns by type
            if (this.analyticsData.partsServiceData && this.analyticsData.partsServiceData.length > 0) {
                console.log('Using real parts service data for chart');
                this.analyticsData.partsServiceData.forEach(item => {
                    typesCounts[item.type] = (typesCounts[item.type] || 0) + 1;
                });
            } else {
                console.log('Using default data for chart');
                // Default data for demo
                const defaultTypes = ['Part-Specific Discounts', 'Service Package Deals', 'Bundled Offers'];
                defaultTypes.forEach((type) => {
                    typesCounts[type] = Math.floor(Math.random() * 5) + 1;
                });
            }

            console.log('Types counts for chart:', typesCounts);

            console.log('Creating chart with data:', {
                labels: Object.keys(typesCounts),
                data: Object.values(typesCounts)
            });

            this.charts.partsCampaignTypes = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: Object.keys(typesCounts),
                    datasets: [{
                        data: Object.values(typesCounts),
                        backgroundColor: [
                            '#667eea', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4',
                            '#feca57', '#ff9a9e', '#a8edea', '#d299c2', '#f093fb',
                            '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'
                        ],
                        borderWidth: 3,
                        borderColor: '#fff',
                        hoverBorderWidth: 5,
                        hoverBorderColor: '#fff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 20,
                                usePointStyle: true,
                                color: '#333333'
                            }
                        }
                    }
                }
            });

            console.log('Parts campaign types chart created successfully');
        } catch (error) {
            console.error('Error creating parts campaign types chart:', error);
        }
    }

    // Initialize parts performance chart
    initPartsPerformanceChart() {
        try {
            const canvas = document.getElementById('analyticsPartsPerformanceChart');
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            const partsData = this.analyticsData.partsServiceData.filter(item => item.category === 'Parts');

            this.charts.partsPerformance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: partsData.map(item => item.name.substring(0, 15) + '...'),
                    datasets: [
                        {
                            label: 'Offered',
                            data: partsData.map(item => item.offered),
                            backgroundColor: '#4ecdc4',
                            borderColor: '#44a08d',
                            borderWidth: 2,
                            borderRadius: 8,
                            borderSkipped: false
                        },
                        {
                            label: 'Sold',
                            data: partsData.map(item => item.soldBooked),
                            backgroundColor: '#667eea',
                            borderColor: '#764ba2',
                            borderWidth: 2,
                            borderRadius: 8,
                            borderSkipped: false
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: {
                                color: '#333333'
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                color: '#333333'
                            },
                            grid: {
                                color: '#e0e0e0'
                            }
                        },
                        x: {
                            ticks: {
                                color: '#333333',
                                maxRotation: 45
                            },
                            grid: {
                                color: '#e0e0e0'
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error creating parts performance chart:', error);
        }
    }

    // Initialize service performance chart
    initServicePerformanceChart() {
        try {
            const canvas = document.getElementById('analyticsServicePerformanceChart');
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            const serviceData = this.analyticsData.partsServiceData.filter(item => item.category === 'Service');

            this.charts.servicePerformance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: serviceData.map(item => item.name.substring(0, 15) + '...'),
                    datasets: [
                        {
                            label: 'Available Slots',
                            data: serviceData.map(item => item.offered),
                            backgroundColor: '#ff9a9e',
                            borderColor: '#ff6b6b',
                            borderWidth: 2,
                            borderRadius: 8,
                            borderSkipped: false
                        },
                        {
                            label: 'Booked',
                            data: serviceData.map(item => item.soldBooked),
                            backgroundColor: '#96ceb4',
                            borderColor: '#27ae60',
                            borderWidth: 2,
                            borderRadius: 8,
                            borderSkipped: false
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: {
                                color: '#333333'
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                color: '#333333'
                            },
                            grid: {
                                color: '#e0e0e0'
                            }
                        },
                        x: {
                            ticks: {
                                color: '#333333',
                                maxRotation: 45
                            },
                            grid: {
                                color: '#e0e0e0'
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error creating service performance chart:', error);
        }
    }

    // Initialize redemption trends chart
    initRedemptionTrendsChart() {
        try {
            const canvas = document.getElementById('analyticsRedemptionTrendsChart');
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            const trends = this.analyticsData.usageTrends.slice(-30);

            this.charts.redemptionTrends = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: trends.map(t => new Date(t.date).toLocaleDateString()),
                    datasets: [
                        {
                            label: 'Parts Redemption',
                            data: trends.map(t => t.partsRedemption),
                            borderColor: '#667eea',
                            backgroundColor: 'rgba(102, 126, 234, 0.1)',
                            tension: 0.4,
                            borderWidth: 3,
                            pointBackgroundColor: '#667eea',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2,
                            pointRadius: 6,
                            pointHoverRadius: 8
                        },
                        {
                            label: 'Service Bookings',
                            data: trends.map(t => t.serviceBookings),
                            borderColor: '#4ecdc4',
                            backgroundColor: 'rgba(78, 205, 196, 0.1)',
                            tension: 0.4,
                            borderWidth: 3,
                            pointBackgroundColor: '#4ecdc4',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2,
                            pointRadius: 6,
                            pointHoverRadius: 8
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                color: '#333333'
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                color: '#333333'
                            },
                            grid: {
                                color: '#e0e0e0'
                            }
                        },
                        x: {
                            ticks: {
                                maxTicksLimit: 10,
                                color: '#333333'
                            },
                            grid: {
                                color: '#e0e0e0'
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error creating redemption trends chart:', error);
        }
    }

    // Initialize feedback pie chart
    initFeedbackPieChart() {
        try {
            const canvas = document.getElementById('analyticsFeedbackPieChart');
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            const feedbackCounts = { positive: 0, neutral: 0, negative: 0 };

            if (this.analyticsData.customerFeedback && this.analyticsData.customerFeedback.length > 0) {
                this.analyticsData.customerFeedback.forEach(feedback => {
                    feedbackCounts[feedback.type]++;
                });
            } else {
                // Default data for demo
                feedbackCounts.positive = 15;
                feedbackCounts.neutral = 8;
                feedbackCounts.negative = 3;
            }

            this.charts.feedbackPie = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Positive', 'Neutral', 'Negative'],
                    datasets: [{
                        data: [feedbackCounts.positive, feedbackCounts.neutral, feedbackCounts.negative],
                        backgroundColor: ['#96ceb4', '#feca57', '#ff6b6b'],
                        borderWidth: 3,
                        borderColor: '#fff',
                        hoverBorderWidth: 5,
                        hoverBorderColor: '#fff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 20,
                                usePointStyle: true,
                                color: '#333333'
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error creating feedback pie chart:', error);
        }
    }

    // Render popular campaigns (existing method)
    renderPopularCampaigns(metric = 'engagement') {
        // Implementation would be similar to previous version
        console.log('Rendering popular campaigns...');
    }

    // Render popular parts & service promotions
    renderPopularPartsService(metric = 'sales') {
        const container = document.getElementById('analyticsPopularPartsGrid');

        if (!container) {
            console.error('Analytics popular parts container not found');
            return;
        }

        if (!this.analyticsData.partsServiceData || this.analyticsData.partsServiceData.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #666;">
                    <i class="material-icons" style="font-size: 3rem; margin-bottom: 1rem;">build</i>
                    <h3>No Parts & Service Data Available</h3>
                    <p>Create some parts and service campaigns to see analytics.</p>
                </div>
            `;
            return;
        }

        const sortedItems = [...this.analyticsData.partsServiceData]
            .sort((a, b) => {
                switch(metric) {
                    case 'redemption': return b.redemptionRate - a.redemptionRate;
                    case 'rating': return parseFloat(b.rating) - parseFloat(a.rating);
                    case 'attachment': return b.attachmentRate - a.attachmentRate;
                    default: return b.salesVolume - a.salesVolume;
                }
            })
            .slice(0, 6);

        container.innerHTML = sortedItems.map((item, index) => `
            <div class="analytics-popular-parts-card" onclick="integratedAnalytics.showPartsServiceDetails('${item.id}')">
                <div class="analytics-parts-card-header">
                    <div>
                        <div class="analytics-parts-title">${item.name}</div>
                        <div class="analytics-parts-type">${item.category}</div>
                    </div>
                    <div class="analytics-parts-rank">#${index + 1}</div>
                </div>
                <div class="analytics-parts-metrics">
                    <div class="analytics-parts-metric">
                        <div class="analytics-parts-metric-value">${item.soldBooked}</div>
                        <div class="analytics-parts-metric-label">Sold/Booked</div>
                    </div>
                    <div class="analytics-parts-metric">
                        <div class="analytics-parts-metric-value">${item.redemptionRate}%</div>
                        <div class="analytics-parts-metric-label">Redemption</div>
                    </div>
                    <div class="analytics-parts-metric">
                        <div class="analytics-parts-metric-value">${item.rating}</div>
                        <div class="analytics-parts-metric-label">Rating</div>
                    </div>
                    <div class="analytics-parts-metric">
                        <div class="analytics-parts-metric-value">${item.attachmentRate}%</div>
                        <div class="analytics-parts-metric-label">Attachment</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Render performance table (existing method)
    renderPerformanceTable() {
        // Implementation would be similar to previous version
        console.log('Rendering performance table...');
    }

    // Render parts & service performance table
    renderPartsServiceTable() {
        const tbody = document.getElementById('analyticsPartsServiceTableBody');

        if (!tbody) {
            console.error('Analytics parts service table body not found');
            return;
        }

        if (!this.analyticsData.partsServiceData || this.analyticsData.partsServiceData.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" style="text-align: center; padding: 2rem; color: #666;">
                        <i class="material-icons" style="font-size: 2rem; margin-bottom: 0.5rem;">table_chart</i><br>
                        No parts & service performance data available
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.analyticsData.partsServiceData.map(item => `
            <tr onclick="integratedAnalytics.showPartsServiceDetails('${item.id}')">
                <td>
                    <div style="font-weight: 600;">${item.name}</div>
                    <div style="font-size: 0.8rem; color: #666;">${item.type}</div>
                </td>
                <td>${item.type}</td>
                <td>
                    <span class="analytics-parts-status-badge ${item.category.toLowerCase()}">
                        ${item.category}
                    </span>
                </td>
                <td>${item.offered}</td>
                <td>${item.soldBooked}</td>
                <td>
                    <div class="analytics-redemption-indicator">
                        <span>${item.redemptionRate}%</span>
                        <div class="analytics-redemption-bar">
                            <div class="analytics-redemption-fill" style="width: ${item.redemptionRate}%"></div>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="analytics-rating-stars">
                        ${this.generateStars(parseFloat(item.rating))}
                        <span style="margin-left: 0.5rem; font-size: 0.9rem;">${item.rating}</span>
                    </div>
                </td>
                <td>
                    <div class="analytics-attachment-indicator">
                        <span>${item.attachmentRate}%</span>
                        <div class="analytics-attachment-icon ${this.getAttachmentLevel(item.attachmentRate)}">
                            <i class="material-icons" style="font-size: 12px;">link</i>
                        </div>
                    </div>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="event.stopPropagation(); integratedAnalytics.showPartsServiceDetails('${item.id}')">
                        <i class="material-icons">visibility</i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // Render feedback section
    renderFeedbackSection(filter = 'all') {
        const container = document.getElementById('analyticsFeedbackList');

        if (!container) {
            console.error('Analytics feedback list container not found');
            return;
        }

        if (!this.analyticsData.customerFeedback || this.analyticsData.customerFeedback.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #666;">
                    <i class="material-icons" style="font-size: 2rem; margin-bottom: 0.5rem;">feedback</i><br>
                    No customer feedback available
                </div>
            `;
            return;
        }

        let filteredFeedback = this.analyticsData.customerFeedback;

        if (filter !== 'all') {
            if (filter === 'parts' || filter === 'service') {
                filteredFeedback = filteredFeedback.filter(f => f.category === filter);
            } else {
                filteredFeedback = filteredFeedback.filter(f => f.type === filter);
            }
        }

        if (filteredFeedback.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #666;">
                    <i class="material-icons" style="font-size: 2rem; margin-bottom: 0.5rem;">filter_list</i><br>
                    No feedback matches the selected filter
                </div>
            `;
            return;
        }

        container.innerHTML = filteredFeedback.slice(0, 10).map(feedback => `
            <div class="analytics-parts-feedback-item">
                <div class="analytics-parts-feedback-header">
                    <div class="analytics-parts-feedback-campaign">${feedback.campaignName}</div>
                    <div class="analytics-parts-feedback-type ${feedback.category}">${feedback.category}</div>
                    <div class="analytics-parts-feedback-date">${new Date(feedback.date).toLocaleDateString()}</div>
                </div>
                <div class="analytics-parts-feedback-rating">
                    ${this.generateStars(feedback.rating)}
                </div>
                <div class="analytics-parts-feedback-comment">${feedback.comment}</div>
            </div>
        `).join('');
    }

    // Helper methods
    generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="material-icons">star</i>';
            } else if (i - 0.5 <= rating) {
                stars += '<i class="material-icons">star_half</i>';
            } else {
                stars += '<i class="material-icons empty">star_border</i>';
            }
        }
        return stars;
    }

    getAttachmentLevel(rate) {
        if (rate >= 70) return 'high';
        if (rate >= 40) return 'medium';
        return 'low';
    }

    // Show parts & service details (placeholder)
    showPartsServiceDetails(itemId) {
        const item = this.analyticsData.partsServiceData.find(i => i.id == itemId);
        if (item) {
            // Create a modal or detailed view instead of alert
            console.log('Parts/Service Details:', item);
            // You can implement a proper modal here if needed
        }
    }

    // Filter methods
    filterPartsServiceData(filter) {
        console.log('Filtering parts service data by:', filter);
        // Implementation for filtering data
    }

    filterPartsServiceTable(query) {
        const rows = document.querySelectorAll('#analyticsPartsServiceTableBody tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(query.toLowerCase()) ? '' : 'none';
        });
    }

    updateRedemptionTrendsChart(days) {
        if (!this.charts.redemptionTrends) return;

        const trends = this.analyticsData.usageTrends.slice(-days);
        this.charts.redemptionTrends.data.labels = trends.map(t => new Date(t.date).toLocaleDateString());
        this.charts.redemptionTrends.data.datasets[0].data = trends.map(t => t.partsRedemption);
        this.charts.redemptionTrends.data.datasets[1].data = trends.map(t => t.serviceBookings);
        this.charts.redemptionTrends.update();
    }

    // Export methods
    exportChart(chartId) {
        const canvas = document.getElementById(chartId);
        if (!canvas) return;

        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `${chartId}.png`;
        link.href = url;
        link.click();
    }

    exportPartsServiceData() {
        const headers = ['Campaign', 'Type', 'Category', 'Offered', 'Sold/Booked', 'Redemption Rate', 'Rating', 'Attachment Rate'];
        const rows = this.analyticsData.partsServiceData.map(item => [
            item.name,
            item.type,
            item.category,
            item.offered,
            item.soldBooked,
            `${item.redemptionRate}%`,
            item.rating,
            `${item.attachmentRate}%`
        ]);

        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'parts-service-performance.csv';
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    }
}

// Initialize analytics when analytics tab is clicked
function initializeAnalytics() {
    console.log('initializeAnalytics called');
    console.log('window.integratedAnalytics:', window.integratedAnalytics);
    console.log('window.campaignManager:', window.campaignManager);

    if (!window.integratedAnalytics && window.campaignManager) {
        console.log('Creating new IntegratedAnalytics instance...');
        window.integratedAnalytics = new IntegratedAnalytics(window.campaignManager);
        console.log('IntegratedAnalytics created:', window.integratedAnalytics);
    } else if (window.integratedAnalytics) {
        console.log('IntegratedAnalytics already exists, refreshing data...');
        // Refresh the analytics data
        window.integratedAnalytics.analyticsData = window.integratedAnalytics.generateAnalyticsData();
        window.integratedAnalytics.renderSummaryCards();
        window.integratedAnalytics.renderPartsServiceSummaryCards();
        window.integratedAnalytics.renderPopularPartsService();
        window.integratedAnalytics.renderPartsServiceTable();
        window.integratedAnalytics.renderFeedbackSection();
    } else {
        console.error('Campaign manager not available');
    }
}

// Main tab switching functionality
function switchMainTab(tabName) {
    console.log('Switching to tab:', tabName);

    // Hide all tab panels
    const panels = document.querySelectorAll('.main-tab-panel');
    panels.forEach(panel => panel.classList.remove('active'));

    // Remove active class from all tab items
    const tabs = document.querySelectorAll('.main-tab-item');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Show selected panel
    const selectedPanel = document.getElementById(`${tabName}-panel`);
    if (selectedPanel) {
        selectedPanel.classList.add('active');
        console.log('Panel activated:', selectedPanel.id);
    } else {
        console.error('Panel not found:', `${tabName}-panel`);
    }

    // Add active class to selected tab
    const selectedTab = document.querySelector(`[onclick="switchMainTab('${tabName}')"]`);
    if (selectedTab) {
        selectedTab.classList.add('active');
        console.log('Tab activated:', selectedTab);
    } else {
        console.error('Tab not found for:', tabName);
    }

    // Initialize analytics if analytics tab is selected
    if (tabName === 'analytics') {
        console.log('Initializing analytics...');
        setTimeout(() => {
            initializeAnalytics();
        }, 100);
    }
}

// Make switchMainTab function available globally
window.switchMainTab = switchMainTab;
