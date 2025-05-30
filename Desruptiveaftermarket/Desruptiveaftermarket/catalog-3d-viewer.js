/**
 * Catalog 3D Viewer
 * 
 * This file provides 3D product visualization functionality for the digital catalog,
 * allowing users to view products in 3D and interact with them.
 */

// Global variables
let scene, camera, renderer, controls;
let currentModel = null;
let isModelLoading = false;
let viewer3DContainer;
let loadingIndicator;

// Initialize 3D viewer
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing 3D Viewer...');
    
    // Create 3D viewer container if it doesn't exist
    if (!document.getElementById('viewer3DContainer')) {
        viewer3DContainer = document.createElement('div');
        viewer3DContainer.id = 'viewer3DContainer';
        viewer3DContainer.className = 'viewer-3d-container';
        document.body.appendChild(viewer3DContainer);
        
        // Create loading indicator
        loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'viewer-loading-indicator';
        loadingIndicator.innerHTML = `
            <div class="spinner"></div>
            <p>Loading 3D model...</p>
        `;
        viewer3DContainer.appendChild(loadingIndicator);
        
        // Create close button
        const closeButton = document.createElement('button');
        closeButton.className = 'viewer-close-btn';
        closeButton.innerHTML = '<i class="material-icons">close</i>';
        closeButton.addEventListener('click', close3DViewer);
        viewer3DContainer.appendChild(closeButton);
        
        // Create view controls
        const viewControls = document.createElement('div');
        viewControls.className = 'viewer-controls';
        viewControls.innerHTML = `
            <button class="viewer-control-btn" id="resetViewBtn" title="Reset View">
                <i class="material-icons">restart_alt</i>
            </button>
            <button class="viewer-control-btn" id="zoomInBtn" title="Zoom In">
                <i class="material-icons">add</i>
            </button>
            <button class="viewer-control-btn" id="zoomOutBtn" title="Zoom Out">
                <i class="material-icons">remove</i>
            </button>
            <button class="viewer-control-btn" id="rotateBtn" title="Auto Rotate">
                <i class="material-icons">sync</i>
            </button>
        `;
        viewer3DContainer.appendChild(viewControls);
        
        // Add event listeners to view controls
        document.getElementById('resetViewBtn').addEventListener('click', resetView);
        document.getElementById('zoomInBtn').addEventListener('click', zoomIn);
        document.getElementById('zoomOutBtn').addEventListener('click', zoomOut);
        document.getElementById('rotateBtn').addEventListener('click', toggleAutoRotate);
    } else {
        viewer3DContainer = document.getElementById('viewer3DContainer');
        loadingIndicator = viewer3DContainer.querySelector('.viewer-loading-indicator');
    }
    
    // Add 3D view buttons to product detail
    addViewButtonsToProductDetail();
});

// Add 3D view buttons to product detail
function addViewButtonsToProductDetail() {
    // Listen for product detail modal opening
    const productModal = document.getElementById('productModal');
    if (productModal) {
        // Use MutationObserver to detect when the modal content changes
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Check if the product detail is being shown
                    const productDetailGallery = productModal.querySelector('.product-detail-gallery');
                    if (productDetailGallery && !productDetailGallery.querySelector('.view-3d-btn')) {
                        // Add 3D view button
                        const view3DBtn = document.createElement('button');
                        view3DBtn.className = 'view-3d-btn';
                        view3DBtn.innerHTML = `
                            <i class="material-icons">view_in_ar</i>
                            <span>View in 3D</span>
                        `;
                        view3DBtn.addEventListener('click', function() {
                            const productId = getProductIdFromModal();
                            if (productId) {
                                show3DViewer(productId);
                            }
                        });
                        productDetailGallery.appendChild(view3DBtn);
                        
                        // Add AR view button
                        const viewARBtn = document.createElement('button');
                        viewARBtn.className = 'view-ar-btn';
                        viewARBtn.innerHTML = `
                            <i class="material-icons">360</i>
                            <span>View in AR</span>
                        `;
                        viewARBtn.addEventListener('click', function() {
                            const productId = getProductIdFromModal();
                            if (productId) {
                                showARViewer(productId);
                            }
                        });
                        productDetailGallery.appendChild(viewARBtn);
                    }
                }
            });
        });
        
        // Start observing the modal
        observer.observe(productModal, { childList: true, subtree: true });
    }
}

// Get product ID from modal
function getProductIdFromModal() {
    // This would need to be adapted based on how the product ID is stored in the modal
    // For now, we'll just return a sample product ID
    return 'P-10001';
}

// Show 3D viewer
function show3DViewer(productId) {
    console.log(`Showing 3D viewer for product ${productId}`);
    
    // Show the viewer container
    viewer3DContainer.classList.add('active');
    document.body.classList.add('no-scroll');
    
    // Show loading indicator
    loadingIndicator.classList.add('active');
    
    // Initialize Three.js scene if not already initialized
    if (!scene) {
        initThreeJS();
    }
    
    // Load 3D model
    loadModel(productId);
}

// Show AR viewer
function showARViewer(productId) {
    console.log(`Showing AR viewer for product ${productId}`);
    
    // Check if WebXR is supported
    if ('xr' in navigator) {
        navigator.xr.isSessionSupported('immersive-ar').then(supported => {
            if (supported) {
                // AR is supported, launch AR experience
                launchARExperience(productId);
            } else {
                // AR is not supported
                showNotification('AR is not supported on this device.', 'error');
            }
        });
    } else {
        // WebXR is not supported
        showNotification('AR is not supported on this browser.', 'error');
    }
}

// Launch AR experience
function launchARExperience(productId) {
    // This would typically use the WebXR API to launch an AR session
    // For now, we'll just show a notification
    showNotification('AR experience would launch here.', 'info');
}

// Initialize Three.js
function initThreeJS() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f9fa);
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    viewer3DContainer.appendChild(renderer.domElement);
    
    // Create controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2;
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Start animation loop
    animate();
}

// Load 3D model
function loadModel(productId) {
    // Clear previous model
    if (currentModel) {
        scene.remove(currentModel);
        currentModel = null;
    }
    
    isModelLoading = true;
    
    // In a real application, you would load the model based on the product ID
    // For this example, we'll create a simple geometry
    setTimeout(() => {
        // Create a sample model (cube)
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x3f51b5,
            roughness: 0.7,
            metalness: 0.2
        });
        currentModel = new THREE.Mesh(geometry, material);
        scene.add(currentModel);
        
        // Position camera to see the model
        camera.position.set(0, 0, 5);
        controls.update();
        
        // Hide loading indicator
        loadingIndicator.classList.remove('active');
        isModelLoading = false;
    }, 1000); // Simulate loading delay
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Update controls
    controls.update();
    
    // Render scene
    renderer.render(scene, camera);
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Close 3D viewer
function close3DViewer() {
    viewer3DContainer.classList.remove('active');
    document.body.classList.remove('no-scroll');
}

// Reset view
function resetView() {
    camera.position.set(0, 0, 5);
    controls.reset();
}

// Zoom in
function zoomIn() {
    camera.position.z -= 0.5;
}

// Zoom out
function zoomOut() {
    camera.position.z += 0.5;
}

// Toggle auto rotate
function toggleAutoRotate() {
    controls.autoRotate = !controls.autoRotate;
    document.getElementById('rotateBtn').classList.toggle('active');
}

// Show notification
function showNotification(message, type) {
    // Check if notification container exists
    let notificationContainer = document.querySelector('.notification-container');
    
    if (!notificationContainer) {
        // Create notification container
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="material-icons">${type === 'error' ? 'error' : type === 'info' ? 'info' : 'check_circle'}</i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="material-icons">close</i>
        </button>
    `;
    
    // Add close button event listener
    notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Add notification to container
    notificationContainer.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}
