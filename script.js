document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('year').textContent = new Date().getFullYear();
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const header = document.querySelector('.header');
    const menuCloseBtn = document.querySelector('.menu-close-btn');

    // --- MENÚ MÓVIL Y DESKTOP ---
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    function toggleMenu() {
        if (!navMenu) return;
        navMenu.classList.toggle('active');
        const isExpanded = navMenu.classList.contains('active');
        if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
        overlay.classList.toggle('active', isExpanded);
        if (isExpanded) {
            document.documentElement.classList.add('no-scroll');
            document.body.classList.add('no-scroll');
        } else {
            document.documentElement.classList.remove('no-scroll');
            document.body.classList.remove('no-scroll');
        }
    }

    function closeMenu() {
        if (!navMenu) return;
        navMenu.classList.remove('active');
        if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
        overlay.classList.remove('active');
        document.documentElement.classList.remove('no-scroll');
        document.body.classList.remove('no-scroll');
    }

    overlay.addEventListener('click', closeMenu);

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) closeMenu();
        });
    }

    if (menuCloseBtn) {
        menuCloseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeMenu();
        });
    }

    if (navMenu) {
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    // --- SCROLL HEADER ---
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    if (header) {
        const handleScroll = debounce(() => {
            if (window.scrollY > 50) {
                header.style.backgroundColor = 'rgba(18, 18, 18, 0.98)';
            } else {
                header.style.backgroundColor = 'rgba(18, 18, 18, 0.95)';
            }
        }, 50);
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    // --- FAQ ACCORDION ---
    const faqQuestions = document.querySelectorAll('.faq-question');
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const item = question.parentElement;
                const answer = item.querySelector('.faq-answer');
                const isExpanded = question.getAttribute('aria-expanded') === 'true';

                document.querySelectorAll('.faq-item').forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        const otherQuestion = otherItem.querySelector('.faq-question');
                        if (otherAnswer) otherAnswer.style.maxHeight = null;
                        if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
                    }
                });

                item.classList.toggle('active');
                question.setAttribute('aria-expanded', !isExpanded);
                if (item.classList.contains('active')) {
                    answer.style.maxHeight = answer.scrollHeight + "px";
                } else {
                    answer.style.maxHeight = null;
                }
            });
        });
    }


    // --- TRACKING AVANZADO DE WHATSAPP (Google Ads) ---
    // Detecta Clics en cualquier botón de WhatsApp
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href*="wa.me"]');

        if (link) {
            if (typeof gtag === 'function') {
                gtag('event', 'conversion', {
                    'send_to': 'AW-17761381105/OAKlCOms6McbEPHVpJVC'
                });
            }
        }
    });

    // --- LAZY LOADING IMAGES ---
    if ('IntersectionObserver' in window) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src') || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, { rootMargin: '50px' });
        images.forEach(img => imageObserver.observe(img));
    }

    // --- SCROLL REVEAL (ANIMACIÓN DE ENTRADA) ---
    const revealElements = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });
        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('active'));
    }

    // --- LAZY LOAD ELFSIGHT REVIEWS ---
    const reviewsContainer = document.getElementById('reviews-container');
    if (reviewsContainer && 'IntersectionObserver' in window) {
        const elfsightObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                const script = document.createElement('script');
                script.src = 'https://elfsightcdn.com/platform.js';
                script.async = true;
                document.head.appendChild(script);
                elfsightObserver.disconnect();
            }
        }, { rootMargin: '200px' });
        elfsightObserver.observe(reviewsContainer);
    }

    // --- PERFORMANCE MONITORING ---
    if (window.PerformanceObserver) {
        try {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > 3000) {
                        console.warn('Slow operation detected:', entry.name, entry.duration);
                    }
                }
            });
            observer.observe({ entryTypes: ['measure', 'navigation', 'resource'] });
        } catch (e) {
            // Graceful fallback
        }
    }

});