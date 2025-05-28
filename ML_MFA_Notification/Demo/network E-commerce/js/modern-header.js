// Modern Header Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const header = document.querySelector('.modern-header');
    const helpButton = document.getElementById('help-button');
    const backToCartButton = document.getElementById('back-to-cart-button');
    const userProfileButton = document.getElementById('user-profile-button');
    const progressBar = document.querySelector('.progress-bar');
    const checkoutSteps = document.querySelectorAll('.checkout-step');

    // Initialize header
    initHeader();

    // Event listeners
    window.addEventListener('scroll', handleHeaderScroll);
    if (helpButton) helpButton.addEventListener('click', showHelpModal);
    if (backToCartButton) backToCartButton.addEventListener('click', goToCart);
    if (userProfileButton) userProfileButton.addEventListener('click', showUserProfile);

    // Functions
    function initHeader() {
        // Update cart count
        updateCartCount();

        // Set active step
        updateCheckoutProgress();

        // Sync order summary
        syncOrderSummary();

        // Add animation classes
        setTimeout(() => {
            header.classList.add('initialized');
        }, 100);
    }

    // Sync mini order summary with main order summary
    function syncOrderSummary() {
        // Get values from main order summary
        const subtotal = document.getElementById('summary-subtotal');
        const shipping = document.getElementById('summary-shipping');
        const tax = document.getElementById('summary-tax');
        const total = document.getElementById('summary-total');

        // Update mini order summary
        if (subtotal) document.getElementById('mini-subtotal').textContent = subtotal.textContent;
        if (shipping) document.getElementById('mini-shipping').textContent = shipping.textContent;
        if (tax) document.getElementById('mini-tax').textContent = tax.textContent;
        if (total) document.getElementById('mini-total').textContent = total.textContent;
    }

    function handleHeaderScroll() {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    function updateCartCount() {
        // Get cart count from localStorage or session
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const cartCount = document.querySelectorAll('.cart-count');

        // Update all cart count elements
        cartCount.forEach(count => {
            count.textContent = cartItems.length;

            // Hide badge if cart is empty
            if (cartItems.length === 0) {
                count.style.display = 'none';
            } else {
                count.style.display = 'flex';
            }
        });
    }

    function updateCheckoutProgress() {
        // Get current step from URL or localStorage
        const currentStep = localStorage.getItem('checkoutStep') || 3; // Default to payment step

        // Calculate progress percentage
        const progressPercentage = ((currentStep - 1) / (checkoutSteps.length - 1)) * 100;

        // Update progress bar
        if (progressBar) {
            progressBar.style.width = `${progressPercentage}%`;
        }

        // Update step classes
        checkoutSteps.forEach((step, index) => {
            const stepNumber = index + 1;

            if (stepNumber < currentStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (stepNumber === parseInt(currentStep)) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
    }

    function showHelpModal() {
        // Create and show help modal
        const helpModal = document.createElement('div');
        helpModal.className = 'help-modal';
        helpModal.innerHTML = `
            <div class="help-modal-content">
                <div class="help-modal-header">
                    <h3>Need Help?</h3>
                    <button class="close-help-modal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="help-modal-body">
                    <div class="help-section">
                        <h4>Payment Issues</h4>
                        <p>If you're having trouble with your payment, please check that your card details are entered correctly.</p>
                    </div>
                    <div class="help-section">
                        <h4>Contact Support</h4>
                        <p>Our support team is available 24/7 to assist you.</p>
                        <p>Email: support@shopeasy.com</p>
                        <p>Phone: 1-800-SHOP-EASY</p>
                    </div>
                    <div class="help-section">
                        <h4>FAQ</h4>
                        <ul>
                            <li>How long does shipping take?</li>
                            <li>Can I change my payment method?</li>
                            <li>Is my payment information secure?</li>
                        </ul>
                    </div>
                </div>
                <div class="help-modal-footer">
                    <button class="contact-support-btn">Contact Support</button>
                </div>
            </div>
        `;

        document.body.appendChild(helpModal);

        // Add event listeners
        const closeButton = helpModal.querySelector('.close-help-modal');
        const contactButton = helpModal.querySelector('.contact-support-btn');

        closeButton.addEventListener('click', () => {
            helpModal.classList.add('closing');
            setTimeout(() => {
                document.body.removeChild(helpModal);
            }, 300);
        });

        contactButton.addEventListener('click', () => {
            // Implement contact support functionality
            alert('Connecting to support...');
        });

        // Animation
        setTimeout(() => {
            helpModal.classList.add('active');
        }, 10);
    }

    function goToCart() {
        // Navigate to cart page
        window.location.href = 'cart.html';
    }

    function showUserProfile() {
        // Show user profile dropdown or modal
        alert('User profile functionality coming soon!');
    }
});
