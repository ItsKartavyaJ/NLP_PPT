class PresentationController {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 16;
        this.slides = document.querySelectorAll('.slide');
        this.slideCounter = document.getElementById('slideCounter');
        this.progressFill = document.getElementById('progressFill');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.menuToggle = document.getElementById('menuToggle');
        this.slideMenu = document.getElementById('slideMenu');
        this.closeMenu = document.getElementById('closeMenu');
        this.slideMenuItems = document.querySelectorAll('.slide-menu-item');
        
        this.init();
    }
    
    init() {
        // Initialize the presentation
        this.updateSlide();
        this.setupEventListeners();
        this.updateMenuActiveState();
    }
    
    setupEventListeners() {
        // Navigation buttons - ensure they're working
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.previousSlide();
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.nextSlide();
            });
        }
        
        // Menu toggle
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMenu();
            });
        }
        
        if (this.closeMenu) {
            this.closeMenu.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeMenuPanel();
            });
        }
        
        // Slide menu items - fix the navigation
        this.slideMenuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const slideNumber = parseInt(e.target.getAttribute('data-slide'));
                if (!isNaN(slideNumber)) {
                    this.goToSlide(slideNumber);
                    this.closeMenuPanel();
                }
            });
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyNavigation(e));
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.slideMenu && !this.slideMenu.contains(e.target) && 
                this.menuToggle && !this.menuToggle.contains(e.target)) {
                this.closeMenuPanel();
            }
        });
        
        // Prevent default behavior on slide menu clicks
        if (this.slideMenu) {
            this.slideMenu.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }
    
    updateSlide() {
        // Hide all slides
        this.slides.forEach((slide, index) => {
            slide.classList.remove('active');
        });
        
        // Show current slide with animation
        const currentSlideElement = document.getElementById(`slide${this.currentSlide}`);
        if (currentSlideElement) {
            // Small delay for smooth transition
            setTimeout(() => {
                currentSlideElement.classList.add('active');
            }, 50);
        }
        
        // Update counter and progress
        this.updateCounter();
        this.updateProgress();
        this.updateNavigationButtons();
        this.updateMenuActiveState();
        
        // Announce slide change for screen readers
        this.announceSlideChange();
    }
    
    updateCounter() {
        if (this.slideCounter) {
            this.slideCounter.textContent = `Slide ${this.currentSlide} of ${this.totalSlides}`;
        }
    }
    
    updateProgress() {
        if (this.progressFill) {
            const progressPercentage = (this.currentSlide / this.totalSlides) * 100;
            this.progressFill.style.width = `${progressPercentage}%`;
        }
    }
    
    updateNavigationButtons() {
        // Update previous button
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentSlide === 1;
            this.prevBtn.style.opacity = this.currentSlide === 1 ? '0.5' : '1';
        }
        
        // Update next button
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentSlide === this.totalSlides;
            this.nextBtn.style.opacity = this.currentSlide === this.totalSlides ? '0.5' : '1';
        }
    }
    
    updateMenuActiveState() {
        this.slideMenuItems.forEach(item => {
            const slideNumber = parseInt(item.getAttribute('data-slide'));
            if (slideNumber === this.currentSlide) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides) {
            this.currentSlide++;
            this.updateSlide();
        }
    }
    
    previousSlide() {
        if (this.currentSlide > 1) {
            this.currentSlide--;
            this.updateSlide();
        }
    }
    
    goToSlide(slideNumber) {
        if (slideNumber >= 1 && slideNumber <= this.totalSlides) {
            this.currentSlide = slideNumber;
            this.updateSlide();
        }
    }
    
    toggleMenu() {
        if (this.slideMenu) {
            this.slideMenu.classList.toggle('hidden');
            this.updateMenuToggleButton();
        }
    }
    
    closeMenuPanel() {
        if (this.slideMenu) {
            this.slideMenu.classList.add('hidden');
            this.updateMenuToggleButton();
        }
    }
    
    updateMenuToggleButton() {
        if (!this.menuToggle || !this.slideMenu) return;
        
        const isMenuOpen = !this.slideMenu.classList.contains('hidden');
        const spans = this.menuToggle.querySelectorAll('span');
        
        if (isMenuOpen) {
            // Transform to X
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            // Transform back to hamburger
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }
    
    handleKeyNavigation(e) {
        // Prevent navigation when menu is open or user is typing in an input
        if (!this.slideMenu || !this.slideMenu.classList.contains('hidden') || 
            e.target.tagName === 'INPUT' || 
            e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        switch(e.key) {
            case 'ArrowRight':
            case ' ':
            case 'PageDown':
                e.preventDefault();
                this.nextSlide();
                break;
                
            case 'ArrowLeft':
            case 'PageUp':
                e.preventDefault();
                this.previousSlide();
                break;
                
            case 'Home':
                e.preventDefault();
                this.goToSlide(1);
                break;
                
            case 'End':
                e.preventDefault();
                this.goToSlide(this.totalSlides);
                break;
                
            case 'Escape':
                e.preventDefault();
                this.closeMenuPanel();
                break;
        }
    }
    
    announceSlideChange() {
        // Create or update aria-live region for screen reader announcements
        let announcer = document.getElementById('slide-announcer');
        if (!announcer) {
            announcer = document.createElement('div');
            announcer.id = 'slide-announcer';
            announcer.setAttribute('aria-live', 'polite');
            announcer.setAttribute('aria-atomic', 'true');
            announcer.style.position = 'absolute';
            announcer.style.left = '-10000px';
            announcer.style.width = '1px';
            announcer.style.height = '1px';
            announcer.style.overflow = 'hidden';
            document.body.appendChild(announcer);
        }
        
        const currentSlideElement = document.getElementById(`slide${this.currentSlide}`);
        const slideTitle = currentSlideElement?.querySelector('h1')?.textContent || `Slide ${this.currentSlide}`;
        announcer.textContent = `${slideTitle}, slide ${this.currentSlide} of ${this.totalSlides}`;
    }
    
    // Public methods for external access
    getCurrentSlide() {
        return this.currentSlide;
    }
    
    getTotalSlides() {
        return this.totalSlides;
    }
}

// Additional utility functions for enhanced user experience
class PresentationEnhancements {
    constructor(controller) {
        this.controller = controller;
        this.init();
    }
    
    init() {
        this.setupSwipeGestures();
        this.setupFullscreenToggle();
        this.setupAutoHideControls();
    }
    
    setupSwipeGestures() {
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        });
        
        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            this.handleSwipe();
        });
        
        const handleSwipe = () => {
            const swipeThreshold = 50;
            const swipeDistanceX = Math.abs(touchEndX - touchStartX);
            const swipeDistanceY = Math.abs(touchEndY - touchStartY);
            
            // Only handle horizontal swipes and ignore if menu is open
            const slideMenu = document.getElementById('slideMenu');
            if (swipeDistanceX > swipeDistanceY && 
                swipeDistanceX > swipeThreshold && 
                slideMenu && slideMenu.classList.contains('hidden')) {
                
                if (touchEndX < touchStartX) {
                    // Swipe left - next slide
                    this.controller.nextSlide();
                } else {
                    // Swipe right - previous slide
                    this.controller.previousSlide();
                }
            }
        };
        
        this.handleSwipe = handleSwipe;
    }
    
    setupFullscreenToggle() {
        // Add fullscreen toggle (F key)
        document.addEventListener('keydown', (e) => {
            if ((e.key === 'f' || e.key === 'F') && !e.ctrlKey && !e.altKey && !e.metaKey) {
                // Check if not typing in input
                if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    this.toggleFullscreen();
                }
            }
        });
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    setupAutoHideControls() {
        let hideTimeout;
        const controls = document.querySelector('.nav-controls');
        const slideCounter = document.querySelector('.slide-counter');
        const menuToggle = document.querySelector('.menu-toggle');
        
        if (!controls || !slideCounter || !menuToggle) return;
        
        const showControls = () => {
            controls.style.opacity = '1';
            slideCounter.style.opacity = '1';
            menuToggle.style.opacity = '1';
            clearTimeout(hideTimeout);
            
            // Auto-hide after 3 seconds of inactivity
            hideTimeout = setTimeout(() => {
                controls.style.opacity = '0.7';
                slideCounter.style.opacity = '0.7';
                menuToggle.style.opacity = '0.7';
            }, 3000);
        };
        
        // Show controls on mouse movement or touch
        document.addEventListener('mousemove', showControls);
        document.addEventListener('touchstart', showControls);
        document.addEventListener('keydown', showControls);
        
        // Initialize with visible controls
        showControls();
    }
}

// Initialize the presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for all elements to be ready
    setTimeout(() => {
        // Initialize the main presentation controller
        const presentationController = new PresentationController();
        
        // Initialize enhancements
        const enhancements = new PresentationEnhancements(presentationController);
        
        // Make controller available globally for debugging
        window.presentationController = presentationController;
        
        // Add some additional polish
        setupImageLoading();
        setupSmoothScrolling();
        
        // Display loading complete message
        console.log('Indian Language NLP Presentation loaded successfully!');
        console.log('Navigation:');
        console.log('- Click Next/Previous buttons or use arrow keys');
        console.log('- Use hamburger menu to jump to specific slides');
        console.log('- Keyboard shortcuts: Space, Page Down/Up, Home, End, F (fullscreen), Escape');
    }, 100);
});

function setupImageLoading() {
    // Add a subtle loading animation for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (!img.complete) {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
            
            img.addEventListener('load', () => {
                img.style.opacity = '1';
            });
            
            // Fallback in case image fails to load
            img.addEventListener('error', () => {
                img.style.opacity = '0.8';
                console.log('Image failed to load:', img.src);
            });
        }
    });
}

function setupSmoothScrolling() {
    // Smooth scrolling for any internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Prevent text selection during presentation (optional)
document.addEventListener('selectstart', (e) => {
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
    }
});

// Handle focus management for accessibility
document.addEventListener('focusin', (e) => {
    // Ensure focused elements are visible and properly styled
    if (e.target.classList.contains('nav-btn') || 
        e.target.classList.contains('slide-menu-item') ||
        e.target.classList.contains('menu-toggle')) {
        e.target.style.outline = '2px solid var(--color-primary)';
        e.target.style.outlineOffset = '2px';
    }
});

document.addEventListener('focusout', (e) => {
    // Remove custom focus styles
    if (e.target.classList.contains('nav-btn') || 
        e.target.classList.contains('slide-menu-item') ||
        e.target.classList.contains('menu-toggle')) {
        e.target.style.outline = '';
        e.target.style.outlineOffset = '';
    }
});