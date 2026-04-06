document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. Custom Cursor Logic
       ========================================= */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    if (cursorDot && cursorOutline) {
        // Follow mouse
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;

            // Interactive hover states
            const interactive = e.target.closest('a, button, input, textarea, .slider-handle, select');
            if (interactive) {
                cursorOutline.classList.add('expand-cursor');
                cursorDot.classList.add('expand-cursor');
            } else {
                cursorOutline.classList.remove('expand-cursor');
                cursorDot.classList.remove('expand-cursor');
            }
        });

        // Smooth outline trailing
        const animateCursor = () => {
            let diffX = mouseX - outlineX;
            let diffY = mouseY - outlineY;

            outlineX += diffX * 0.2;
            outlineY += diffY * 0.2;

            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;

            requestAnimationFrame(animateCursor);
        };
        animateCursor();
    }

    /* =========================================
       2. Scroll Progress & Sticky Nav
       ========================================= */
    const progressBar = document.querySelector('.scroll-progress');
    const navbar = document.querySelector('.glass-nav');

    window.addEventListener('scroll', () => {
        // Progress Bar
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        if (progressBar) progressBar.style.width = `${progress}%`;

        // Sticky Nav Appearance
        if (navbar) {
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    /* =========================================
       3. Magnetic Button Effect
       ========================================= */
    const magnets = document.querySelectorAll('.magnetic');

    magnets.forEach((magnet) => {
        magnet.addEventListener('mousemove', (e) => {
            const rect = magnet.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Move item slightly towards mouse
            magnet.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        magnet.addEventListener('mouseleave', () => {
            // Reset to origin
            magnet.style.transform = `translate(0px, 0px)`;
        });
    });

    /* =========================================
       4. Intersection Observers (Reveals & Counters)
       ========================================= */
    const revealElements = document.querySelectorAll('.fade-in-up, .fade-in-section');
    const counters = document.querySelectorAll('.counter');
    let observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const countUp = (element) => {
        const target = +element.getAttribute('data-target');
        const duration = 2000; // ms
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.innerText = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.innerText = target;
            }
        };
        updateCounter();
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                
                // If it's a stats item, trigger counter
                if (entry.target.classList.contains('stat-item') || entry.target.querySelector('.counter')) {
                    const counterEl = entry.target.querySelector('.counter') || (entry.target.classList.contains('counter') ? entry.target : null);
                    if (counterEl && !counterEl.classList.contains('counted')) {
                        counterEl.classList.add('counted');
                        countUp(counterEl);
                    }
                }
                
                // Unobserve for one-time animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => sectionObserver.observe(el));
    
    // Check counters that might not be wrapped
    counters.forEach(c => {
        if(!c.closest('.fade-in-up, .fade-in-section')) {
            sectionObserver.observe(c);
        }
    });

    /* =========================================
       5. Parallax Hero Effect
       ========================================= */
    const parallaxBg = document.querySelector('.parallax');
    window.addEventListener('scroll', () => {
        if (parallaxBg) {
            const scrollPos = window.scrollY;
            // Move background slightly down as user scrolls down
            if (scrollPos < window.innerHeight) {
                parallaxBg.style.transform = `translateY(${scrollPos * 0.3}px)`;
            }
        }
    });

    /* =========================================
       6. Before & After Slider
       ========================================= */
    const sliderInput = document.querySelector('.slider-input');
    const imageBefore = document.querySelector('.image-before');
    const sliderLine = document.querySelector('.slider-handle');

    if (sliderInput && imageBefore && sliderLine) {
        sliderInput.addEventListener('input', (e) => {
            const sliderVal = e.target.value;
            // Update the clip-path of the before image filter wrapper
            imageBefore.style.clipPath = `inset(0 ${100 - sliderVal}% 0 0)`;
            imageBefore.style.webkitClipPath = `inset(0 ${100 - sliderVal}% 0 0)`;
            // Update slider handle position
            sliderLine.style.left = `${sliderVal}%`;
        });
    }

    /* =========================================
       7. Smooth Scroll Anchor Links
       ========================================= */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

});
