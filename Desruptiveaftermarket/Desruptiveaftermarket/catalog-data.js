/**
 * Catalog Data Service
 * 
 * This file provides data and operations for the digital catalog,
 * including product data, categories, and related functionality.
 */

// Store data in localStorage with these keys
const CATALOG_STORAGE_KEYS = {
    PRODUCTS: 'aftermarket_catalog_products',
    CATEGORIES: 'aftermarket_catalog_categories',
    MANUFACTURERS: 'aftermarket_catalog_manufacturers',
    USER_PREFERENCES: 'aftermarket_catalog_preferences',
    RECENTLY_VIEWED: 'aftermarket_catalog_recently_viewed',
    CART: 'aftermarket_catalog_cart'
};

// Default product data
const DEFAULT_PRODUCTS = [
    {
        id: 'P-10001',
        name: 'Air Filter',
        description: 'High-quality air filter for optimal engine performance and fuel efficiency. Designed to trap harmful contaminants and prevent them from entering your engine. Compatible with most popular vehicle makes and models.',
        category: 'Filters',
        manufacturer: 'FilterCorp',
        price: '$24.99',
        stock: '156',
        reorderLevel: '50',
        location: 'Aisle A-12',
        status: 'In Stock',
        image: 'https://via.placeholder.com/800x600?text=Air+Filter',
        images: [
            'https://via.placeholder.com/800x600?text=Air+Filter+1',
            'https://via.placeholder.com/800x600?text=Air+Filter+2',
            'https://via.placeholder.com/800x600?text=Air+Filter+3'
        ],
        specifications: {
            'Dimensions': '10" x 8" x 1"',
            'Material': 'Synthetic',
            'Filtration Rating': '99.5%',
            'Replacement Interval': '15,000 miles',
            'Warranty': '1 year'
        },
        compatibleVehicles: [
            'Toyota Camry (2018-2023)',
            'Honda Accord (2017-2023)',
            'Ford F-150 (2015-2022)',
            'Chevrolet Silverado (2016-2022)'
        ],
        dateAdded: '2023-01-15',
        lastUpdated: '2023-06-10',
        tags: ['bestseller', 'featured'],
        rating: 4.7,
        reviewCount: 128,
        company: 'TechCorp',
        branch: 'East Branch',
        region: 'Northeast',
        tenantId: 'tenant1',
        entityId: 'entity1'
    },
    {
        id: 'P-10002',
        name: 'Brake Pad Set',
        description: 'Premium brake pads for reliable stopping power and reduced noise. Engineered with advanced friction materials for optimal performance in all driving conditions. Includes hardware kit for complete installation.',
        category: 'Brakes',
        manufacturer: 'BrakeMasters',
        price: '$89.95',
        stock: '78',
        reorderLevel: '30',
        location: 'Aisle B-05',
        status: 'In Stock',
        image: 'https://via.placeholder.com/800x600?text=Brake+Pad+Set',
        images: [
            'https://via.placeholder.com/800x600?text=Brake+Pad+Set+1',
            'https://via.placeholder.com/800x600?text=Brake+Pad+Set+2',
            'https://via.placeholder.com/800x600?text=Brake+Pad+Set+3'
        ],
        specifications: {
            'Position': 'Front',
            'Material': 'Ceramic',
            'Pad Life': '40,000-60,000 miles',
            'Noise Level': 'Low',
            'Dust Level': 'Low',
            'Warranty': '2 years'
        },
        compatibleVehicles: [
            'BMW 3 Series (2015-2023)',
            'Audi A4 (2016-2023)',
            'Mercedes C-Class (2015-2022)',
            'Lexus ES (2017-2023)'
        ],
        dateAdded: '2023-02-20',
        lastUpdated: '2023-06-15',
        tags: ['bestseller'],
        rating: 4.5,
        reviewCount: 92,
        company: 'TechCorp',
        branch: 'Midwest Branch',
        region: 'Central',
        tenantId: 'tenant1',
        entityId: 'entity1'
    },
    {
        id: 'P-10003',
        name: 'Oil Filter',
        description: 'Advanced oil filter that removes harmful contaminants for engine longevity. Features a high-capacity design for extended service intervals and superior filtration efficiency. Easy to install with standard tools.',
        category: 'Filters',
        manufacturer: 'FilterCorp',
        price: '$12.50',
        stock: '210',
        reorderLevel: '75',
        location: 'Aisle A-14',
        status: 'In Stock',
        image: 'https://via.placeholder.com/800x600?text=Oil+Filter',
        images: [
            'https://via.placeholder.com/800x600?text=Oil+Filter+1',
            'https://via.placeholder.com/800x600?text=Oil+Filter+2',
            'https://via.placeholder.com/800x600?text=Oil+Filter+3'
        ],
        specifications: {
            'Thread Size': '3/4-16 in',
            'Anti-Drainback Valve': 'Yes',
            'Bypass Valve': 'Yes',
            'Filter Media': 'Synthetic blend',
            'Capacity': '15 quarts',
            'Warranty': '1 year'
        },
        compatibleVehicles: [
            'Toyota Corolla (2015-2023)',
            'Honda Civic (2016-2023)',
            'Ford Focus (2015-2020)',
            'Chevrolet Cruze (2016-2019)'
        ],
        dateAdded: '2023-03-10',
        lastUpdated: '2023-06-20',
        tags: ['sale'],
        rating: 4.8,
        reviewCount: 156,
        company: 'GlobalTech',
        branch: 'West Branch',
        region: 'West',
        tenantId: 'tenant2',
        entityId: 'entity6'
    },
    {
        id: 'P-10004',
        name: 'Spark Plug Set',
        description: 'High-performance spark plugs for improved ignition and fuel efficiency. Precision-engineered with iridium center electrode for superior conductivity and longer service life. Set of 4 plugs.',
        category: 'Ignition',
        manufacturer: 'SparkTech',
        price: '$45.75',
        stock: '92',
        reorderLevel: '40',
        location: 'Aisle C-03',
        status: 'In Stock',
        image: 'https://via.placeholder.com/800x600?text=Spark+Plug+Set',
        images: [
            'https://via.placeholder.com/800x600?text=Spark+Plug+Set+1',
            'https://via.placeholder.com/800x600?text=Spark+Plug+Set+2',
            'https://via.placeholder.com/800x600?text=Spark+Plug+Set+3'
        ],
        specifications: {
            'Material': 'Iridium',
            'Gap': '0.044"',
            'Thread Size': '14mm',
            'Heat Range': 'Medium',
            'Quantity': '4',
            'Warranty': '2 years'
        },
        compatibleVehicles: [
            'Subaru Outback (2017-2023)',
            'Mazda CX-5 (2017-2023)',
            'Volkswagen Golf (2015-2022)',
            'Hyundai Sonata (2018-2023)'
        ],
        dateAdded: '2023-04-05',
        lastUpdated: '2023-06-25',
        tags: ['new', 'featured'],
        rating: 4.6,
        reviewCount: 78,
        company: 'GlobalTech',
        branch: 'West Branch',
        region: 'West',
        tenantId: 'tenant2',
        entityId: 'entity6'
    },
    {
        id: 'P-10005',
        name: 'Alternator',
        description: 'Reliable alternator that ensures consistent electrical power for your vehicle. Built with premium components for durability and optimal performance. Includes mounting hardware and installation instructions.',
        category: 'Electrical',
        manufacturer: 'ElectroParts',
        price: '$175.00',
        stock: '25',
        reorderLevel: '15',
        location: 'Aisle D-08',
        status: 'In Stock',
        image: 'https://via.placeholder.com/800x600?text=Alternator',
        images: [
            'https://via.placeholder.com/800x600?text=Alternator+1',
            'https://via.placeholder.com/800x600?text=Alternator+2',
            'https://via.placeholder.com/800x600?text=Alternator+3'
        ],
        specifications: {
            'Output': '120 Amp',
            'Voltage': '12V',
            'Pulley Type': 'Serpentine',
            'Mounting Type': 'Direct Fit',
            'Warranty': '3 years'
        },
        compatibleVehicles: [
            'Jeep Wrangler (2015-2022)',
            'Dodge Ram 1500 (2016-2022)',
            'Chevrolet Tahoe (2015-2021)',
            'Ford Explorer (2017-2023)'
        ],
        dateAdded: '2023-05-12',
        lastUpdated: '2023-06-30',
        tags: ['featured'],
        rating: 4.4,
        reviewCount: 45,
        company: 'AutoTech',
        branch: 'South Branch',
        region: 'Southeast',
        tenantId: 'tenant3',
        entityId: 'entity8'
    },
    {
        id: 'P-10006',
        name: 'Engine Oil (5W-30)',
        description: 'Synthetic blend engine oil that provides superior protection against wear, deposits, and oil breakdown. Formulated for modern engines with enhanced fuel economy benefits.',
        category: 'Fluids',
        manufacturer: 'LubeTech',
        price: '$32.99',
        stock: '180',
        reorderLevel: '60',
        location: 'Aisle E-02',
        status: 'In Stock',
        image: 'https://via.placeholder.com/800x600?text=Engine+Oil',
        images: [
            'https://via.placeholder.com/800x600?text=Engine+Oil+1',
            'https://via.placeholder.com/800x600?text=Engine+Oil+2',
            'https://via.placeholder.com/800x600?text=Engine+Oil+3'
        ],
        specifications: {
            'Type': 'Synthetic Blend',
            'Viscosity': '5W-30',
            'Capacity': '5 quarts',
            'API Classification': 'SN Plus',
            'ILSAC': 'GF-6'
        },
        compatibleVehicles: [
            'Most modern gasoline engines',
            'Light-duty diesel engines',
            'Turbocharged engines'
        ],
        dateAdded: '2023-05-20',
        lastUpdated: '2023-07-05',
        tags: ['bestseller', 'sale'],
        rating: 4.9,
        reviewCount: 210,
        company: 'AutoTech',
        branch: 'South Branch',
        region: 'Southeast',
        tenantId: 'tenant3',
        entityId: 'entity8'
    }
];

// Default categories
const DEFAULT_CATEGORIES = [
    { id: 'filters', name: 'Filters', count: 2 },
    { id: 'brakes', name: 'Brakes', count: 1 },
    { id: 'ignition', name: 'Ignition', count: 1 },
    { id: 'electrical', name: 'Electrical', count: 1 },
    { id: 'fluids', name: 'Fluids', count: 1 },
    { id: 'engine', name: 'Engine', count: 0 },
    { id: 'suspension', name: 'Suspension', count: 0 },
    { id: 'exhaust', name: 'Exhaust', count: 0 },
    { id: 'cooling', name: 'Cooling', count: 0 },
    { id: 'accessories', name: 'Accessories', count: 0 }
];

// Default manufacturers
const DEFAULT_MANUFACTURERS = [
    { id: 'filtercorp', name: 'FilterCorp', count: 2 },
    { id: 'brakemasters', name: 'BrakeMasters', count: 1 },
    { id: 'sparktech', name: 'SparkTech', count: 1 },
    { id: 'electroparts', name: 'ElectroParts', count: 1 },
    { id: 'lubetech', name: 'LubeTech', count: 1 }
];

// Initialize data in localStorage if it doesn't exist
function initializeCatalogData() {
    // Check if products exist in localStorage
    if (!localStorage.getItem(CATALOG_STORAGE_KEYS.PRODUCTS)) {
        localStorage.setItem(CATALOG_STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
    }
    
    // Check if categories exist in localStorage
    if (!localStorage.getItem(CATALOG_STORAGE_KEYS.CATEGORIES)) {
        localStorage.setItem(CATALOG_STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
    }
    
    // Check if manufacturers exist in localStorage
    if (!localStorage.getItem(CATALOG_STORAGE_KEYS.MANUFACTURERS)) {
        localStorage.setItem(CATALOG_STORAGE_KEYS.MANUFACTURERS, JSON.stringify(DEFAULT_MANUFACTURERS));
    }
    
    // Initialize empty cart if it doesn't exist
    if (!localStorage.getItem(CATALOG_STORAGE_KEYS.CART)) {
        localStorage.setItem(CATALOG_STORAGE_KEYS.CART, JSON.stringify([]));
    }
    
    // Initialize empty recently viewed if it doesn't exist
    if (!localStorage.getItem(CATALOG_STORAGE_KEYS.RECENTLY_VIEWED)) {
        localStorage.setItem(CATALOG_STORAGE_KEYS.RECENTLY_VIEWED, JSON.stringify([]));
    }
    
    console.log('Catalog data initialized');
}

// Catalog data service object
const CatalogData = {
    // Initialize catalog data
    initialize: function() {
        initializeCatalogData();
    },
    
    // Get all products
    getProducts: function() {
        return JSON.parse(localStorage.getItem(CATALOG_STORAGE_KEYS.PRODUCTS)) || DEFAULT_PRODUCTS;
    },
    
    // Get product by ID
    getProductById: function(id) {
        const products = this.getProducts();
        return products.find(product => product.id === id) || null;
    },
    
    // Get products by category
    getProductsByCategory: function(category) {
        const products = this.getProducts();
        return products.filter(product => product.category.toLowerCase() === category.toLowerCase());
    },
    
    // Get products by manufacturer
    getProductsByManufacturer: function(manufacturer) {
        const products = this.getProducts();
        return products.filter(product => product.manufacturer.toLowerCase() === manufacturer.toLowerCase());
    },
    
    // Get all categories
    getCategories: function() {
        return JSON.parse(localStorage.getItem(CATALOG_STORAGE_KEYS.CATEGORIES)) || DEFAULT_CATEGORIES;
    },
    
    // Get all manufacturers
    getManufacturers: function() {
        return JSON.parse(localStorage.getItem(CATALOG_STORAGE_KEYS.MANUFACTURERS)) || DEFAULT_MANUFACTURERS;
    },
    
    // Add product to recently viewed
    addToRecentlyViewed: function(productId) {
        const recentlyViewed = JSON.parse(localStorage.getItem(CATALOG_STORAGE_KEYS.RECENTLY_VIEWED)) || [];
        
        // Remove product if it already exists in recently viewed
        const index = recentlyViewed.indexOf(productId);
        if (index !== -1) {
            recentlyViewed.splice(index, 1);
        }
        
        // Add product to beginning of array
        recentlyViewed.unshift(productId);
        
        // Limit to 10 items
        if (recentlyViewed.length > 10) {
            recentlyViewed.pop();
        }
        
        // Save to localStorage
        localStorage.setItem(CATALOG_STORAGE_KEYS.RECENTLY_VIEWED, JSON.stringify(recentlyViewed));
    },
    
    // Get recently viewed products
    getRecentlyViewedProducts: function() {
        const recentlyViewed = JSON.parse(localStorage.getItem(CATALOG_STORAGE_KEYS.RECENTLY_VIEWED)) || [];
        const products = this.getProducts();
        
        return recentlyViewed.map(id => products.find(product => product.id === id)).filter(Boolean);
    },
    
    // Add product to cart
    addToCart: function(productId, quantity = 1) {
        const cart = JSON.parse(localStorage.getItem(CATALOG_STORAGE_KEYS.CART)) || [];
        
        // Check if product already exists in cart
        const existingItem = cart.find(item => item.productId === productId);
        
        if (existingItem) {
            // Update quantity
            existingItem.quantity += quantity;
        } else {
            // Add new item
            cart.push({
                productId,
                quantity,
                dateAdded: new Date().toISOString()
            });
        }
        
        // Save to localStorage
        localStorage.setItem(CATALOG_STORAGE_KEYS.CART, JSON.stringify(cart));
    },
    
    // Get cart items
    getCartItems: function() {
        const cart = JSON.parse(localStorage.getItem(CATALOG_STORAGE_KEYS.CART)) || [];
        const products = this.getProducts();
        
        return cart.map(item => {
            const product = products.find(p => p.id === item.productId);
            return product ? { ...item, product } : null;
        }).filter(Boolean);
    },
    
    // Remove item from cart
    removeFromCart: function(productId) {
        let cart = JSON.parse(localStorage.getItem(CATALOG_STORAGE_KEYS.CART)) || [];
        
        // Filter out the item
        cart = cart.filter(item => item.productId !== productId);
        
        // Save to localStorage
        localStorage.setItem(CATALOG_STORAGE_KEYS.CART, JSON.stringify(cart));
    },
    
    // Update cart item quantity
    updateCartItemQuantity: function(productId, quantity) {
        const cart = JSON.parse(localStorage.getItem(CATALOG_STORAGE_KEYS.CART)) || [];
        
        // Find the item
        const item = cart.find(item => item.productId === productId);
        
        if (item) {
            // Update quantity
            item.quantity = quantity;
            
            // Remove item if quantity is 0
            if (quantity <= 0) {
                this.removeFromCart(productId);
                return;
            }
            
            // Save to localStorage
            localStorage.setItem(CATALOG_STORAGE_KEYS.CART, JSON.stringify(cart));
        }
    },
    
    // Clear cart
    clearCart: function() {
        localStorage.setItem(CATALOG_STORAGE_KEYS.CART, JSON.stringify([]));
    }
};

// Initialize catalog data when the script loads
document.addEventListener('DOMContentLoaded', function() {
    CatalogData.initialize();
});
