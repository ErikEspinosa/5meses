document.addEventListener('DOMContentLoaded', () => {
    // Selects the carousel images container
    const carouselSlide = document.querySelector('.carousel-slide');

    // Array with the paths to your images.
    // IMPORTANT!: Make sure these paths match your image files.
    const carouselImages = [
        'images/image1.jpg',
        'images/image2.jpg',
        'images/image3.jpg',
        'images/image4.jpg',
        'images/image5.jpg',
        'images/image6.jpg',
        'images/image7.jpg',
        'images/image8.jpg',
        'images/image9.png',
        'images/image10.jpg',
        'images/image11.jpg',
        'images/image12.jpg',
        'images/image13.jpg',
        // You can add more image paths here
    ];

    let currentIndex = 0; // Index of the current image in the carousel
    let autoSlideInterval; // Variable to store the interval ID for automatic sliding
    const autoSlideDelay = 5000; // Delay for automatic slide change (5 seconds)

    // References to the main carousel navigation buttons
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    // References to the fullscreen overlay elements
    const fullscreenOverlay = document.getElementById('fullscreen-overlay');
    const fullscreenImg = document.querySelector('.fullscreen-img');
    const closeBtn = document.querySelector('.close-btn');
    const prevNavBtn = document.querySelector('.prev-nav-btn');
    const nextNavBtn = document.querySelector('.next-nav-btn');

    // Variables for swipe functionality
    let touchStartX = 0;
    let touchEndX = 0;
    const minSwipeDistance = 50; // Minimum distance in pixels for a swipe to be registered

    // --- Main Carousel Functions ---

    /**
     * Creates and adds images to the carousel, including clones for the infinite effect.
     */
    function createCarouselImages() {
        // Add real images to the carousel
        carouselImages.forEach((src, index) => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = `Image ${index + 1}`;
            img.dataset.index = index; // Stores the original image index
            img.loading = 'lazy'; // Enables native HTML lazy loading
            carouselSlide.appendChild(img);
        });

        // Clone the first and last images to create an "infinite" carousel
        // This allows for a smooth transition when going from the last to the first and vice versa
        const firstImgClone = carouselSlide.children[0].cloneNode(true);
        const lastImgClone = carouselSlide.children[carouselImages.length - 1].cloneNode(true);

        // Add the clone of the first image to the end
        carouselSlide.appendChild(firstImgClone);
        // Add the clone of the last image to the beginning
        carouselSlide.prepend(lastImgClone);

        // Adjust the initial position of the carousel so that the first real image is visible
        // (the first element is the clone of the last image)
        carouselSlide.style.transform = `translateX(-${100 * (currentIndex + 1)}%)`;
    }

    /**
     * Moves the carousel to the next or previous image.
     * Implements the logic for the infinite carousel effect.
     * @param {number} direction - 1 for next, -1 for previous.
     */
    function moveCarousel(direction) {
        // Enable transition for normal movement
        carouselSlide.style.transition = 'transform 0.6s ease-in-out';
        currentIndex += direction; // Update the index

        // Logic for the "jump" at the end or beginning for the infinite effect
        if (currentIndex >= carouselImages.length) {
            // If we reach the end, move to the clone of the first image
            carouselSlide.style.transform = `translateX(-${100 * (carouselImages.length + 1)}%)`;
            // After the transition, "jump" instantly to the first real image
            setTimeout(() => {
                carouselSlide.style.transition = 'none'; // Disable transition for the jump
                currentIndex = 0; // Reset the index
                carouselSlide.style.transform = `translateX(-${100 * (currentIndex + 1)}%)`;
            }, 600); // The time should match the CSS transition duration
        } else if (currentIndex < 0) {
            // If we reach the beginning, move to the clone of the last image
            carouselSlide.style.transform = `translateX(0%)`;
            // After the transition, "jump" instantly to the last real image
            setTimeout(() => {
                carouselSlide.style.transition = 'none'; // Disable transition for the jump
                currentIndex = carouselImages.length - 1; // Set the index to the last image
                carouselSlide.style.transform = `translateX(-${100 * (currentIndex + 1)}%)`;
            }, 600); // The time should match the CSS transition duration
        } else {
            // Normal movement between real images
            carouselSlide.style.transform = `translateX(-${100 * (currentIndex + 1)}%)`;
        }
    }

    // --- Automatic Slide Functions ---

    /**
     * Starts the automatic carousel sliding.
     */
    function startAutoSlide() {
        stopAutoSlide(); // Clear any existing interval first
        autoSlideInterval = setInterval(() => {
            moveCarousel(1); // Move to the next image
        }, autoSlideDelay);
    }

    /**
     * Stops the automatic carousel sliding.
     */
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // --- Fullscreen Overlay Functions ---

    /**
     * Opens the fullscreen overlay with the selected image.
     * @param {number} index - The index of the image to display.
     */
    function openFullscreen(index) {
        stopAutoSlide(); // Stop automatic sliding when fullscreen is active
        fullscreenImg.src = carouselImages[index]; // Set the image source
        fullscreenImg.dataset.currentIndex = index; // Store the current index in the overlay image
        fullscreenOverlay.classList.add('active'); // Show the overlay
        document.body.style.overflow = 'hidden'; // Prevent body scrolling
    }

    /**
     * Closes the fullscreen overlay.
     */
    function closeFullscreen() {
        fullscreenOverlay.classList.remove('active'); // Hide the overlay
        document.body.style.overflow = 'auto'; // Restore body scrolling
        startAutoSlide(); // Resume automatic sliding
    }

    /**
     * Navigates to the next or previous image within the fullscreen overlay.
     * @param {number} direction - 1 for next, -1 for previous.
     */
    function navigateFullscreen(direction) {
        let currentImageIndex = parseInt(fullscreenImg.dataset.currentIndex); // Get the current index
        let newIndex = currentImageIndex + direction; // Calculate the new index

        // Logic to wrap the index if it goes out of array bounds
        if (newIndex >= carouselImages.length) {
            newIndex = 0; // Go back to the first image
        } else if (newIndex < 0) {
            newIndex = carouselImages.length - 1; // Go back to the last image
        }
        openFullscreen(newIndex); // Open the new image in fullscreen
    }

    // --- Event Listeners ---

    // Events for the main carousel navigation buttons
    prevBtn.addEventListener('click', () => {
        stopAutoSlide();
        moveCarousel(-1);
        startAutoSlide(); // Restart auto-slide after manual interaction
    });
    nextBtn.addEventListener('click', () => {
        stopAutoSlide();
        moveCarousel(1);
        startAutoSlide(); // Restart auto-slide after manual interaction
    });

    // Delegated event to open the overlay when clicking any carousel image
    carouselSlide.addEventListener('click', (e) => {
        // Check if the clicked element is an image
        if (e.target.tagName === 'IMG') {
            const index = parseInt(e.target.dataset.index); // Get the index of the clicked image
            openFullscreen(index); // Open the image in fullscreen
        }
    });

    // Event to close the overlay when clicking the close button
    closeBtn.addEventListener('click', closeFullscreen);

    // Events for navigation buttons within the overlay
    prevNavBtn.addEventListener('click', () => navigateFullscreen(-1));
    nextNavBtn.addEventListener('click', () => navigateFullscreen(1));

    // Event to close the overlay with the ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && fullscreenOverlay.classList.contains('active')) {
            closeFullscreen();
        }
    });

    // --- Touch/Swipe Events for Carousel ---
    carouselSlide.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        stopAutoSlide(); // Stop auto-slide on touch start
    });

    carouselSlide.addEventListener('touchmove', (e) => {
        touchEndX = e.touches[0].clientX;
        // Optional: Prevent default to stop page scrolling if you want purely horizontal swipe
        // e.preventDefault();
    });

    carouselSlide.addEventListener('touchend', () => {
        const swipeDistance = touchEndX - touchStartX;

        if (swipeDistance > minSwipeDistance) {
            // Swiped right (previous image)
            moveCarousel(-1);
        } else if (swipeDistance < -minSwipeDistance) {
            // Swiped left (next image)
            moveCarousel(1);
        }
        // Reset touch positions
        touchStartX = 0;
        touchEndX = 0;
        startAutoSlide(); // Restart auto-slide after swipe
    });

    // Initialize carousel and start automatic sliding when the DOM is fully loaded
    createCarouselImages();
    startAutoSlide();
});
