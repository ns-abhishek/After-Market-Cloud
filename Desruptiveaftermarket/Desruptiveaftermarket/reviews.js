/**
 * Product Reviews
 * 
 * This file provides functionality for displaying and submitting product reviews.
 */

// Sample reviews data (in a real application, this would come from a database)
const sampleReviews = {
    'P-10001': [
        {
            id: 'R001',
            productId: 'P-10001',
            userId: 'U123',
            userName: 'John D.',
            rating: 5,
            title: 'Excellent filter',
            comment: 'This air filter has significantly improved my car\'s performance. Easy to install and great quality.',
            date: '2023-05-15',
            helpful: 12,
            verified: true
        },
        {
            id: 'R002',
            productId: 'P-10001',
            userId: 'U456',
            userName: 'Sarah M.',
            rating: 4,
            title: 'Good quality',
            comment: 'Good quality filter, but a bit pricey compared to others. Still, it does the job well.',
            date: '2023-04-22',
            helpful: 5,
            verified: true
        },
        {
            id: 'R003',
            productId: 'P-10001',
            userId: 'U789',
            userName: 'Mike T.',
            rating: 5,
            title: 'Perfect fit',
            comment: 'Perfect fit for my Toyota Camry. Noticed better fuel efficiency after installation.',
            date: '2023-03-10',
            helpful: 8,
            verified: true
        }
    ],
    'P-10002': [
        {
            id: 'R004',
            productId: 'P-10002',
            userId: 'U234',
            userName: 'Emily R.',
            rating: 5,
            title: 'Great brake pads',
            comment: 'These brake pads are excellent. Smooth stopping power and no squeaking.',
            date: '2023-05-05',
            helpful: 10,
            verified: true
        },
        {
            id: 'R005',
            productId: 'P-10002',
            userId: 'U567',
            userName: 'David K.',
            rating: 3,
            title: 'Decent but noisy',
            comment: 'The brake pads work well but they started making noise after a few weeks.',
            date: '2023-04-18',
            helpful: 3,
            verified: true
        }
    ],
    'P-10003': [
        {
            id: 'R006',
            productId: 'P-10003',
            userId: 'U123',
            userName: 'John D.',
            rating: 5,
            title: 'Great oil filter',
            comment: 'This oil filter is excellent. Easy to install and does a great job.',
            date: '2023-05-20',
            helpful: 7,
            verified: true
        }
    ],
    'P-10004': [
        {
            id: 'R007',
            productId: 'P-10004',
            userId: 'U890',
            userName: 'Lisa P.',
            rating: 4,
            title: 'Good spark plugs',
            comment: 'These spark plugs have improved my car\'s performance. Easy to install.',
            date: '2023-05-12',
            helpful: 5,
            verified: true
        }
    ],
    'P-10005': [
        {
            id: 'R008',
            productId: 'P-10005',
            userId: 'U567',
            userName: 'David K.',
            rating: 5,
            title: 'Excellent alternator',
            comment: 'This alternator is excellent. Easy to install and works perfectly.',
            date: '2023-05-25',
            helpful: 3,
            verified: true
        }
    ]
};

// Reviews storage key
const REVIEWS_STORAGE_KEY = 'aftermarket_product_reviews';

// Initialize reviews data in localStorage if it doesn't exist
function initializeReviewsData() {
    if (!localStorage.getItem(REVIEWS_STORAGE_KEY)) {
        localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(sampleReviews));
    }
}

// Get reviews for a product
function getProductReviews(productId) {
    initializeReviewsData();
    
    const reviewsData = JSON.parse(localStorage.getItem(REVIEWS_STORAGE_KEY)) || {};
    return reviewsData[productId] || [];
}

// Get average rating for a product
function getProductAverageRating(productId) {
    const reviews = getProductReviews(productId);
    
    if (reviews.length === 0) {
        return 0;
    }
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
}

// Add a new review
function addProductReview(review) {
    initializeReviewsData();
    
    const reviewsData = JSON.parse(localStorage.getItem(REVIEWS_STORAGE_KEY)) || {};
    
    // Generate a review ID
    review.id = 'R' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    
    // Set date to current date
    review.date = new Date().toISOString().split('T')[0];
    
    // Initialize helpful count
    review.helpful = 0;
    
    // Add to reviews data
    if (!reviewsData[review.productId]) {
        reviewsData[review.productId] = [];
    }
    
    reviewsData[review.productId].push(review);
    
    // Save to localStorage
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviewsData));
    
    return review;
}

// Mark a review as helpful
function markReviewAsHelpful(reviewId, productId) {
    initializeReviewsData();
    
    const reviewsData = JSON.parse(localStorage.getItem(REVIEWS_STORAGE_KEY)) || {};
    
    if (reviewsData[productId]) {
        const review = reviewsData[productId].find(r => r.id === reviewId);
        
        if (review) {
            review.helpful += 1;
            localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviewsData));
            return review.helpful;
        }
    }
    
    return 0;
}

// Display reviews for a product
function displayProductReviews(productId, container) {
    const reviews = getProductReviews(productId);
    const averageRating = getProductAverageRating(productId);
    
    // Create reviews HTML
    let reviewsHTML = `
        <div class="reviews-header">
            <div class="reviews-summary">
                <div class="reviews-average">
                    <span class="reviews-average-rating">${averageRating.toFixed(1)}</span>
                    <div class="reviews-stars">
                        ${generateStarsHTML(averageRating)}
                    </div>
                </div>
                <div class="reviews-count">
                    Based on ${reviews.length} review${reviews.length !== 1 ? 's' : ''}
                </div>
            </div>
            <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" id="writeReviewBtn">
                Write a Review
            </button>
        </div>
    `;
    
    // Add review form (hidden by default)
    reviewsHTML += `
        <div class="review-form-container" id="reviewFormContainer" style="display: none;">
            <h3>Write a Review</h3>
            <form id="reviewForm">
                <input type="hidden" id="reviewProductId" value="${productId}">
                
                <div class="form-group">
                    <label for="reviewName">Your Name</label>
                    <input type="text" id="reviewName" class="form-control" required>
                </div>
                
                <div class="form-group">
                    <label for="reviewEmail">Your Email</label>
                    <input type="email" id="reviewEmail" class="form-control" required>
                </div>
                
                <div class="form-group">
                    <label>Rating</label>
                    <div class="rating-input">
                        <i class="material-icons rating-star" data-rating="1">star_border</i>
                        <i class="material-icons rating-star" data-rating="2">star_border</i>
                        <i class="material-icons rating-star" data-rating="3">star_border</i>
                        <i class="material-icons rating-star" data-rating="4">star_border</i>
                        <i class="material-icons rating-star" data-rating="5">star_border</i>
                        <input type="hidden" id="reviewRating" value="0" required>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="reviewTitle">Review Title</label>
                    <input type="text" id="reviewTitle" class="form-control" required>
                </div>
                
                <div class="form-group">
                    <label for="reviewComment">Your Review</label>
                    <textarea id="reviewComment" class="form-control" rows="5" required></textarea>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="mdl-button mdl-js-button mdl-button--raised" id="cancelReviewBtn">
                        Cancel
                    </button>
                    <button type="submit" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">
                        Submit Review
                    </button>
                </div>
            </form>
        </div>
    `;
    
    // Add reviews list
    if (reviews.length > 0) {
        reviewsHTML += `
            <div class="reviews-list">
                ${reviews.map(review => createReviewHTML(review)).join('')}
            </div>
        `;
    } else {
        reviewsHTML += `
            <div class="reviews-empty">
                <p>There are no reviews yet for this product. Be the first to write a review!</p>
            </div>
        `;
    }
    
    // Set container HTML
    container.innerHTML = reviewsHTML;
    
    // Add event listeners
    addReviewEventListeners(container);
}

// Generate stars HTML based on rating
function generateStarsHTML(rating) {
    let starsHTML = '';
    
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            // Full star
            starsHTML += '<i class="material-icons">star</i>';
        } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
            // Half star
            starsHTML += '<i class="material-icons">star_half</i>';
        } else {
            // Empty star
            starsHTML += '<i class="material-icons">star_border</i>';
        }
    }
    
    return starsHTML;
}

// Create HTML for a single review
function createReviewHTML(review) {
    const date = new Date(review.date);
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    return `
        <div class="review-item" data-review-id="${review.id}">
            <div class="review-header">
                <div class="review-rating">
                    ${generateStarsHTML(review.rating)}
                </div>
                <div class="review-title">${review.title}</div>
            </div>
            <div class="review-meta">
                <span class="review-author">
                    ${review.verified ? '<i class="material-icons verified-icon">verified</i>' : ''}
                    ${review.userName}
                </span>
                <span class="review-date">${formattedDate}</span>
            </div>
            <div class="review-content">${review.comment}</div>
            <div class="review-actions">
                <button class="review-helpful-btn" data-review-id="${review.id}" data-product-id="${review.productId}">
                    <i class="material-icons">thumb_up</i>
                    <span class="helpful-count">${review.helpful}</span> people found this helpful
                </button>
            </div>
        </div>
    `;
}

// Add event listeners for reviews
function addReviewEventListeners(container) {
    // Write review button
    const writeReviewBtn = container.querySelector('#writeReviewBtn');
    if (writeReviewBtn) {
        writeReviewBtn.addEventListener('click', function() {
            const formContainer = container.querySelector('#reviewFormContainer');
            if (formContainer) {
                formContainer.style.display = 'block';
                writeReviewBtn.style.display = 'none';
            }
        });
    }
    
    // Cancel review button
    const cancelReviewBtn = container.querySelector('#cancelReviewBtn');
    if (cancelReviewBtn) {
        cancelReviewBtn.addEventListener('click', function() {
            const formContainer = container.querySelector('#reviewFormContainer');
            if (formContainer) {
                formContainer.style.display = 'none';
                if (writeReviewBtn) {
                    writeReviewBtn.style.display = 'inline-flex';
                }
            }
        });
    }
    
    // Rating stars
    const ratingStars = container.querySelectorAll('.rating-star');
    ratingStars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.dataset.rating);
            const ratingInput = container.querySelector('#reviewRating');
            
            if (ratingInput) {
                ratingInput.value = rating;
            }
            
            // Update stars
            ratingStars.forEach(s => {
                const starRating = parseInt(s.dataset.rating);
                if (starRating <= rating) {
                    s.textContent = 'star';
                } else {
                    s.textContent = 'star_border';
                }
            });
        });
        
        star.addEventListener('mouseover', function() {
            const rating = parseInt(this.dataset.rating);
            
            // Update stars on hover
            ratingStars.forEach(s => {
                const starRating = parseInt(s.dataset.rating);
                if (starRating <= rating) {
                    s.textContent = 'star';
                } else {
                    s.textContent = 'star_border';
                }
            });
        });
        
        star.addEventListener('mouseout', function() {
            const ratingInput = container.querySelector('#reviewRating');
            const rating = parseInt(ratingInput.value);
            
            // Reset stars on mouseout
            ratingStars.forEach(s => {
                const starRating = parseInt(s.dataset.rating);
                if (starRating <= rating) {
                    s.textContent = 'star';
                } else {
                    s.textContent = 'star_border';
                }
            });
        });
    });
    
    // Review form
    const reviewForm = container.querySelector('#reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form values
            const productId = container.querySelector('#reviewProductId').value;
            const name = container.querySelector('#reviewName').value;
            const email = container.querySelector('#reviewEmail').value;
            const rating = parseInt(container.querySelector('#reviewRating').value);
            const title = container.querySelector('#reviewTitle').value;
            const comment = container.querySelector('#reviewComment').value;
            
            // Validate form
            if (!name || !email || !rating || rating < 1 || !title || !comment) {
                alert('Please fill in all fields and provide a rating.');
                return;
            }
            
            // Create review object
            const review = {
                productId,
                userId: 'U' + Math.floor(Math.random() * 1000000),
                userName: name,
                email,
                rating,
                title,
                comment,
                verified: false
            };
            
            // Add review
            addProductReview(review);
            
            // Reset form
            reviewForm.reset();
            
            // Hide form
            const formContainer = container.querySelector('#reviewFormContainer');
            if (formContainer) {
                formContainer.style.display = 'none';
                if (writeReviewBtn) {
                    writeReviewBtn.style.display = 'inline-flex';
                }
            }
            
            // Refresh reviews
            displayProductReviews(productId, container);
            
            // Show notification
            showNotification('Your review has been submitted. Thank you!');
        });
    }
    
    // Helpful buttons
    const helpfulButtons = container.querySelectorAll('.review-helpful-btn');
    helpfulButtons.forEach(button => {
        button.addEventListener('click', function() {
            const reviewId = this.dataset.reviewId;
            const productId = this.dataset.productId;
            
            // Mark as helpful
            const helpfulCount = markReviewAsHelpful(reviewId, productId);
            
            // Update count
            const countElement = this.querySelector('.helpful-count');
            if (countElement) {
                countElement.textContent = helpfulCount;
            }
            
            // Disable button
            this.disabled = true;
            
            // Show notification
            showNotification('Thank you for your feedback!');
        });
    });
}

// Show notification
function showNotification(message) {
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
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add notification to container
    notificationContainer.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}
