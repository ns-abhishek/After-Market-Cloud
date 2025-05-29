/**
 * Enhanced Animations JavaScript for ERP User Manual
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize enhanced animations
    initializeScrollAnimations();
    initializeIntersectionObserver();
    setupReducedMotion();
});

/**
 * Initialize smooth scrolling for horizontal sections
 */
function initializeScrollAnimations() {
    // Get all horizontal scrollable containers
    const scrollContainers = document.querySelectorAll('.featured-cards, .updates-container');

    scrollContainers.forEach(container => {
        // Add scroll indicators and event listeners
        setupHorizontalScroll(container);
    });
}

/**
 * Setup horizontal scrolling with mouse wheel and touch
 */
function setupHorizontalScroll(container) {
    // Add scroll indicator
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    scrollIndicator.innerHTML = '<i class="fas fa-chevron-right"></i>';
    container.parentNode.appendChild(scrollIndicator);

    // Hide scroll indicator after 5 seconds
    setTimeout(() => {
        scrollIndicator.classList.add('fade-out');
    }, 5000);

    // Mouse wheel horizontal scrolling
    container.addEventListener('wheel', function(e) {
        if (e.deltaY !== 0) {
            e.preventDefault();
            container.scrollLeft += e.deltaY;

            // Show scroll indicator briefly
            scrollIndicator.classList.remove('fade-out');
            setTimeout(() => {
                scrollIndicator.classList.add('fade-out');
            }, 1500);
        }
    }, { passive: false });

    // Check if scrolling is needed
    updateScrollIndicator(container, scrollIndicator);

    // Update scroll indicator on resize
    window.addEventListener('resize', () => {
        updateScrollIndicator(container, scrollIndicator);
    });

    // Update scroll indicator on scroll
    container.addEventListener('scroll', () => {
        updateScrollIndicator(container, scrollIndicator);
    });
}

/**
 * Update scroll indicator visibility based on scroll position
 */
function updateScrollIndicator(container, indicator) {
    // Check if scrolling is possible
    const canScroll = container.scrollWidth > container.clientWidth;

    // Check if we're at the end of scrolling
    const isAtEnd = Math.abs(container.scrollWidth - container.clientWidth - container.scrollLeft) < 10;

    if (!canScroll || isAtEnd) {
        indicator.classList.add('hidden');
    } else {
        indicator.classList.remove('hidden');
    }
}

/**
 * Initialize Intersection Observer for scroll-based animations
 */
function initializeIntersectionObserver() {
    // Check if Intersection Observer is supported
    if (!('IntersectionObserver' in window)) {
        // If not supported, add animation classes immediately
        document.querySelectorAll('.featured-card, .update-card, .step-card, .roadmap-item')
            .forEach(el => el.classList.add('animate-in'));
        return;
    }

    // Create observer for animation elements
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animation class when element comes into view
                entry.target.classList.add('animate-in');
                entry.target.classList.add('visible');
                // Stop observing after animation is triggered
                animationObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null, // viewport
        threshold: 0.1, // trigger when 10% of the element is visible
        rootMargin: '0px 0px -50px 0px' // trigger slightly before element comes into view
    });

    // Add animate-in class to all elements that should be animated
    document.querySelectorAll('.featured-card, .update-card, .step-card, .roadmap-item')
        .forEach(el => {
            el.classList.add('animate-in');
            animationObserver.observe(el);
        });

    // Create observer for section titles
    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animation class when title comes into view
                entry.target.classList.add('title-animate');
                entry.target.classList.add('visible');
                // Stop observing after animation is triggered
                titleObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.5,
        rootMargin: '0px'
    });

    // Add title-animate class to all section titles and observe them
    document.querySelectorAll('.section-title')
        .forEach(el => {
            el.classList.add('title-animate');
            titleObserver.observe(el);
        });
}

/**
 * Setup reduced motion preferences
 */
function setupReducedMotion() {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        // Add class to body to disable animations via CSS
        document.body.classList.add('reduced-motion');
    }

    // Listen for changes to the prefers-reduced-motion media query
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', e => {
        if (e.matches) {
            document.body.classList.add('reduced-motion');
        } else {
            document.body.classList.remove('reduced-motion');
        }
    });
}

/**
 * Add CSS for scroll indicator
 */
function addScrollIndicatorStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .scroll-indicator {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            background-color: var(--primary-color);
            color: var(--light-text);
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0.7;
            transition: opacity 0.3s ease, transform 0.3s ease;
            cursor: pointer;
            z-index: 10;
        }

        .scroll-indicator:hover {
            opacity: 1;
            transform: translateY(-50%) scale(1.1);
        }

        .scroll-indicator.fade-out {
            opacity: 0;
        }

        .scroll-indicator.hidden {
            display: none;
        }

        .animate-in {
            animation: fadeInUp 0.6s ease-out backwards;
        }

        .title-animate {
            animation: fadeIn 0.5s ease-out;
        }

        .reduced-motion .animate-in,
        .reduced-motion .title-animate {
            animation: none !important;
        }
    `;
    document.head.appendChild(style);
}

// Add scroll indicator styles
addScrollIndicatorStyles();
