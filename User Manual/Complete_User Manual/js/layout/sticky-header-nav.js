// Sticky Header and Navigation JavaScript for ERP User Manual

document.addEventListener('DOMContentLoaded', function() {
    // Wrap header and nav in a sticky wrapper
    const header = document.querySelector('header');
    const mainNav = document.querySelector('.main-nav');
    
    if (header && mainNav) {
        // Create wrapper element
        const stickyWrapper = document.createElement('div');
        stickyWrapper.className = 'sticky-header-wrapper';
        
        // Insert wrapper before header
        header.parentNode.insertBefore(stickyWrapper, header);
        
        // Move header and nav into wrapper
        stickyWrapper.appendChild(header);
        stickyWrapper.appendChild(mainNav);
        
        // Optional: Hide header on scroll down, show on scroll up
        let lastScrollTop = 0;
        const scrollThreshold = 10; // Minimum scroll amount to trigger hide/show
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Determine scroll direction
            if (Math.abs(scrollTop - lastScrollTop) > scrollThreshold) {
                if (scrollTop > lastScrollTop && scrollTop > 60) {
                    // Scrolling down
                    stickyWrapper.classList.add('hide-on-scroll');
                } else {
                    // Scrolling up
                    stickyWrapper.classList.remove('hide-on-scroll');
                }
                lastScrollTop = scrollTop;
            }
        });
    }
});
