/**
 * Action Buttons Redesign
 * JavaScript for enhanced button interactions
 */
document.addEventListener('DOMContentLoaded', function() {
    // Add ripple effect to all action buttons
    initRippleEffect();
    
    // Add hover animations to action buttons
    initHoverAnimations();
    
    // Add click animations to action buttons
    initClickAnimations();
});

/**
 * Initialize ripple effect for action buttons
 */
function initRippleEffect() {
    const buttons = document.querySelectorAll('.action-btn, .card-action-btn, .admin-page-actions .admin-button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add CSS for ripple effect if not already in the CSS file
    if (!document.querySelector('style#ripple-effect-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-effect-styles';
        style.textContent = `
            .ripple-effect {
                position: absolute;
                background: rgba(255, 255, 255, 0.4);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            }
            
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Initialize hover animations for action buttons
 */
function initHoverAnimations() {
    const buttons = document.querySelectorAll('.action-btn, .card-action-btn, .admin-page-actions .admin-button');
    
    buttons.forEach(button => {
        // Add subtle icon rotation on hover
        button.addEventListener('mouseenter', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transition = 'transform 0.3s ease';
                icon.style.transform = 'scale(1.2)';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
        });
    });
}

/**
 * Initialize click animations for action buttons
 */
function initClickAnimations() {
    const buttons = document.querySelectorAll('.action-btn, .card-action-btn, .admin-page-actions .admin-button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Add a quick pulse animation on click
            this.style.animation = 'pulse 0.3s ease';
            
            // Remove the animation after it completes
            setTimeout(() => {
                this.style.animation = '';
            }, 300);
        });
    });
    
    // Add CSS for pulse animation if not already in the CSS file
    if (!document.querySelector('style#pulse-animation-styles')) {
        const style = document.createElement('style');
        style.id = 'pulse-animation-styles';
        style.textContent = `
            @keyframes pulse {
                0% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(0.95);
                }
                100% {
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);
    }
}
