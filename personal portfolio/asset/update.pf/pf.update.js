// Carousel Functionality
let currentSlide = 0;
let carouselInterval;
const slides = document.querySelectorAll('.carousel-slide');
const indicators = document.querySelectorAll('.indicator');
const track = document.querySelector('.carousel-track');
const totalSlides = slides.length;

function updateCarousel() {
  if (!track) return;
  
  // Update slide positions
  slides.forEach((slide, index) => {
    slide.classList.remove('active');
    if (index === currentSlide) {
      slide.classList.add('active');
    }
  });
  
  // Update indicators
  indicators.forEach((indicator, index) => {
    indicator.classList.remove('active');
    if (index === currentSlide) {
      indicator.classList.add('active');
    }
  });
  
  // Move track with smooth animation
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  track.style.transition = 'transform 0.5s cubic-bezier(0.645, 0.045, 0.355, 1)';
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateCarousel();
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  updateCarousel();
}

function goToSlide(slideIndex) {
  if (slideIndex >= 0 && slideIndex < totalSlides) {
    currentSlide = slideIndex;
    updateCarousel();
  }
}

// Auto-advance carousel
function startAutoCarousel() {
  if (carouselInterval) clearInterval(carouselInterval);
  carouselInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
}

function stopAutoCarousel() {
  if (carouselInterval) clearInterval(carouselInterval);
}

// Project Modal Functions
function openProjectModal(projectId) {
  const modal = document.getElementById(`${projectId}Modal`);
  if (modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    stopAutoCarousel(); // Stop carousel when modal opens
  }
}

function closeProjectModal() {
  const modals = document.querySelectorAll('.project-modal');
  modals.forEach(modal => {
    modal.style.display = 'none';
  });
  document.body.style.overflow = 'auto';
  startAutoCarousel(); // Restart carousel when modal closes
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize carousel
  if (slides.length > 0) {
    updateCarousel();
    startAutoCarousel();
    
    // Pause on hover
    const carousel = document.querySelector('.featured-carousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', stopAutoCarousel);
      carousel.addEventListener('mouseleave', startAutoCarousel);
    }
    
    // Add click event to indicators
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => goToSlide(index));
    });
    
    // Add click event to navigation buttons
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        prevSlide();
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        nextSlide();
      });
    }
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (carousel) {
      carousel.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      
      carousel.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      }, { passive: true });
    }
    
    function handleSwipe() {
      const swipeThreshold = 50; // Minimum swipe distance in pixels
      const swipeDistance = touchEndX - touchStartX;
      
      if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
          prevSlide(); // Swipe right
        } else {
          nextSlide(); // Swipe left
        }
      }
    }
  }
  
  // Initialize project modals
  const modalCloseButtons = document.querySelectorAll('.modal-close');
  modalCloseButtons.forEach(button => {
    button.addEventListener('click', closeProjectModal);
  });
  
  // Close modal when clicking outside
  const modals = document.querySelectorAll('.project-modal');
  modals.forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeProjectModal();
      }
    });
  });
  
  // Add event listeners to case study buttons (already in HTML onclick)
  // These are already handled by the onclick attribute in HTML
  
  // Initialize AOS (if you have it)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1000,
      once: false,
      offset: 100
    });
  }
});

// Keyboard navigation for carousel and modals
document.addEventListener('keydown', function(e) {
  // Carousel navigation
  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    prevSlide();
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    nextSlide();
  }
  
  // Close modal with Escape key
  if (e.key === 'Escape') {
    const modals = document.querySelectorAll('.project-modal');
    const anyModalOpen = Array.from(modals).some(modal => modal.style.display === 'block');
    if (anyModalOpen) {
      closeProjectModal();
    }
  }
});

// Reset carousel when window resizes
window.addEventListener('resize', function() {
  updateCarousel();
});

// Prevent carousel from breaking on fast clicks
let isAnimating = false;
let animationDelay = 500;

function safeNextSlide() {
  if (!isAnimating) {
    isAnimating = true;
    nextSlide();
    setTimeout(() => {
      isAnimating = false;
    }, animationDelay);
  }
}

function safePrevSlide() {
  if (!isAnimating) {
    isAnimating = true;
    prevSlide();
    setTimeout(() => {
      isAnimating = false;
    }, animationDelay);
  }
}

// Update the navigation button event listeners to use safe functions
document.addEventListener('DOMContentLoaded', function() {
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      safePrevSlide();
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      safeNextSlide();
    });
  }
});