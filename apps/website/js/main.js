/**
 * Meadowlark Ranch - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initHeader();
    initMobileNav();
    initFAQ();
    initScrollAnimations();
    initHeroEntranceAnimation();
    initHeroSlider();
    initLightbox();
    initBackToTop();
});

/**
 * Fancy hero entrance animation
 */
function initHeroEntranceAnimation() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const heroBg = hero.querySelector('.hero__bg');
    const heroContent = hero.querySelector('.hero__content');
    const heroLabel = hero.querySelector('.hero__label');
    const heroTitle = hero.querySelector('.hero__title');
    const heroSubtitle = hero.querySelector('.hero__subtitle');
    const heroGallery = hero.querySelector('.hero__gallery');
    const heroBtn = hero.querySelector('.btn');
    
    // Add entrance class to hero for initial state
    hero.classList.add('hero--loading');
    
    // Sequence the animations
    setTimeout(function() {
        hero.classList.remove('hero--loading');
        hero.classList.add('hero--loaded');
        
        // Animate background with Ken Burns effect
        if (heroBg) {
            heroBg.classList.add('hero__bg--animate');
        }
        
        // Stagger content animations
        if (heroLabel) {
            setTimeout(function() { heroLabel.classList.add('animate-in'); }, 300);
        }
        if (heroTitle) {
            setTimeout(function() { heroTitle.classList.add('animate-in'); }, 500);
        }
        if (heroSubtitle) {
            setTimeout(function() { heroSubtitle.classList.add('animate-in'); }, 700);
        }
        if (heroGallery) {
            setTimeout(function() { heroGallery.classList.add('animate-in'); }, 900);
        }
        if (heroBtn) {
            setTimeout(function() { heroBtn.classList.add('animate-in'); }, 1100);
        }
    }, 100);
}

/**
 * Header scroll behavior
 */
function initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

/**
 * Mobile navigation toggle
 */
function initMobileNav() {
    const toggle = document.querySelector('.nav__toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const body = document.body;
    
    if (!toggle || !mobileNav) return;
    
    toggle.addEventListener('click', function() {
        toggle.classList.toggle('active');
        mobileNav.classList.toggle('active');
        body.classList.toggle('nav-open');
    });
    
    // Handle dropdown toggles in mobile nav
    const dropdownToggles = mobileNav.querySelectorAll('.mobile-nav__link[data-dropdown]');
    dropdownToggles.forEach(function(toggleBtn) {
        toggleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const parent = this.parentElement;
            parent.classList.toggle('active');
        });
    });
    
    // Close mobile nav when clicking a link
    const mobileLinks = mobileNav.querySelectorAll('.mobile-nav__dropdown-link');
    mobileLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            toggle.classList.remove('active');
            mobileNav.classList.remove('active');
            body.classList.remove('nav-open');
        });
    });
}

/**
 * FAQ accordion functionality
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(function(item) {
        const question = item.querySelector('.faq-item__question');
        
        question.addEventListener('click', function() {
            // Close other items
            faqItems.forEach(function(otherItem) {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

/**
 * Enhanced scroll-triggered animations
 */
function initScrollAnimations() {
    // Elements with data-animate attribute
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    // Also animate common elements automatically
    const autoAnimateSelectors = [
        '.section-label',
        '.about__title',
        '.about__text',
        '.story__label',
        '.story__title',
        '.story__text',
        '.cowboy__title',
        '.cowboy__text',
        '.services__label',
        '.services__title',
        '.service-card',
        '.mission__title',
        '.mission__text',
        '.faq__label',
        '.faq__title',
        '.faq-item',
        '.cta__title',
        '.cta__text',
        '.content-section__title',
        '.content-section__text',
        '.page-header__title',
        '.page-header__subtitle'
    ];
    
    const autoAnimateElements = document.querySelectorAll(autoAnimateSelectors.join(', '));
    const allElements = [...animatedElements, ...autoAnimateElements];
    
    if (!allElements.length) return;
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const el = entry.target;
                const animationType = el.dataset.animate || 'fadeInUp';
                const delay = el.dataset.delay || 0;
                
                setTimeout(function() {
                    el.classList.add('animate-' + animationType);
                    el.classList.add('animated');
                }, delay);
                
                observer.unobserve(el);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    });
    
    // Add staggered delays to grouped elements
    const staggerGroups = document.querySelectorAll('.services__grid, .faq__list, .footer__grid');
    staggerGroups.forEach(function(group) {
        const children = group.children;
        Array.from(children).forEach(function(child, index) {
            child.dataset.delay = index * 100;
        });
    });
    
    allElements.forEach(function(el) {
        if (!el.classList.contains('animated')) {
            el.classList.add('animate-ready');
            observer.observe(el);
        }
    });
}

/**
 * Hero slider - clicking thumbnails changes hero background
 * The thumbnail image itself becomes the full hero background
 */
function initHeroSlider() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const heroBg = hero.querySelector('.hero__bg');
    const galleryItems = hero.querySelectorAll('.hero__gallery-item');
    
    if (!heroBg || galleryItems.length === 0) return;
    
    // Store the original hero background
    const originalBg = heroBg.src;
    let currentIndex = -1; // -1 means original background
    let autoSlideInterval;
    
    // Set first item as active initially
    galleryItems[0].classList.add('active');
    
    function changeSlide(index, isAuto) {
        // Remove active class from all items
        galleryItems.forEach(function(i) {
            i.classList.remove('active');
        });
        
        // Add active class to target item
        if (index >= 0 && index < galleryItems.length) {
            galleryItems[index].classList.add('active');
        }
        
        // Get the thumbnail image source to use as hero background
        let newImageSrc;
        if (index >= 0 && galleryItems[index]) {
            const thumbImg = galleryItems[index].querySelector('img');
            if (thumbImg) {
                newImageSrc = thumbImg.src;
            }
        }
        
        if (!newImageSrc) {
            newImageSrc = originalBg;
        }
        
        // Smooth crossfade transition
        heroBg.style.transition = 'opacity 0.5s ease';
        heroBg.style.opacity = '0';
        
        setTimeout(function() {
            heroBg.src = newImageSrc;
            heroBg.style.opacity = '1';
        }, 500);
        
        currentIndex = index;
    }
    
    // Click handlers for thumbnails
    galleryItems.forEach(function(item, index) {
        item.style.cursor = 'pointer';
        
        item.addEventListener('click', function() {
            // Reset auto-slide timer when user clicks
            clearInterval(autoSlideInterval);
            changeSlide(index, false);
            startAutoSlide();
        });
    });
    
    // Auto-rotate function
    function startAutoSlide() {
        autoSlideInterval = setInterval(function() {
            let nextIndex = currentIndex + 1;
            if (nextIndex >= galleryItems.length) {
                nextIndex = 0;
            }
            changeSlide(nextIndex, true);
        }, 6000);
    }
    
    // Start auto-slide
    currentIndex = 0;
    startAutoSlide();
}

/**
 * Lightbox for story images
 */
function initLightbox() {
    // Create lightbox element
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox__overlay"></div>
        <div class="lightbox__content">
            <button class="lightbox__close" aria-label="Close lightbox">&times;</button>
            <img class="lightbox__image" src="" alt="">
        </div>
    `;
    document.body.appendChild(lightbox);
    
    const lightboxOverlay = lightbox.querySelector('.lightbox__overlay');
    const lightboxClose = lightbox.querySelector('.lightbox__close');
    const lightboxImage = lightbox.querySelector('.lightbox__image');
    
    // Find all story images that should be clickable
    const storyImages = document.querySelectorAll('.story__image img, .lightbox-trigger');
    
    storyImages.forEach(function(img) {
        img.style.cursor = 'pointer';
        
        img.addEventListener('click', function() {
            lightboxImage.src = this.src;
            lightboxImage.alt = this.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    lightboxOverlay.addEventListener('click', closeLightbox);
    lightboxClose.addEventListener('click', closeLightbox);
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

/**
 * Smooth scroll for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

/**
 * Form validation (basic)
 */
function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(function(field) {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });
        
        // Email validation
        const emailField = form.querySelector('input[type="email"]');
        if (emailField && emailField.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
                isValid = false;
                emailField.classList.add('error');
            }
        }
        
        if (isValid) {
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'form-success';
            successMessage.innerHTML = '<p>Thank you for your message! We will get back to you soon.</p>';
            form.innerHTML = '';
            form.appendChild(successMessage);
        }
    });
}

// Initialize contact form if on contact page
if (document.querySelector('.contact-form')) {
    initContactForm();
}


/**
 * Parallax scrolling effect for images
 */
function initParallax() {
    const parallaxImages = document.querySelectorAll('.page-header__bg--parallax, .parallax-image');
    
    if (parallaxImages.length === 0) return;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        
        parallaxImages.forEach(function(img) {
            const parent = img.closest('.page-header--parallax, .parallax-image-section');
            if (!parent) return;
            
            const rect = parent.getBoundingClientRect();
            const parentTop = rect.top + scrolled;
            const parentHeight = parent.offsetHeight;
            
            // Only apply parallax when element is in view
            if (rect.bottom > 0 && rect.top < window.innerHeight) {
                const speed = 0.3;
                const yPos = (scrolled - parentTop) * speed;
                img.style.transform = 'translateY(' + yPos + 'px)';
            }
        });
    }
    
    // Throttle scroll events for performance
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Initial call
    updateParallax();
}

// Initialize parallax on page load
document.addEventListener('DOMContentLoaded', function() {
    initParallax();
});


/**
 * Back to Top Button
 */
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (!backToTopBtn) return;
    
    // Show/hide button based on scroll position
    function toggleBackToTop() {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }
    
    // Initial check
    toggleBackToTop();
    
    // Listen for scroll events
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    
    // Smooth scroll to top on click
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
