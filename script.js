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


    // --- MEDICION DE CONTACTOS (llamadas y WhatsApp) ---
    // Registra que canal usa el cliente y desde que boton, para saber cual
    // convierte mejor en cada pagina.
    const CONVERSIONES_ADS = {
        whatsapp: 'AW-17761381105/OAKlCOms6McbEPHVpJVC',
        llamada: null // Pendiente: crear la accion de conversion de llamadas en Google Ads
    };

    const ubicacionDelBoton = (link) => {
        if (link.closest('.mobile-sticky-footer')) return 'barra_movil';
        if (link.closest('.header')) return 'cabecera';
        if (link.closest('.hero')) return 'hero';
        if (link.closest('footer')) return 'pie';
        if (link.closest('.desktop-whatsapp')) return 'boton_flotante';
        return 'contenido';
    };

    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="tel:"], a[href*="wa.me"]');
        if (!link || typeof gtag !== 'function') return;

        const canal = link.getAttribute('href').startsWith('tel:') ? 'llamada' : 'whatsapp';

        // Evento para Google Analytics: canal, boton y pagina de origen
        gtag('event', 'contacto', {
            canal: canal,
            ubicacion_boton: ubicacionDelBoton(link),
            pagina: window.location.pathname
        });

        // Conversion para Google Ads, cuando esta configurada
        const sendTo = CONVERSIONES_ADS[canal];
        if (sendTo) {
            gtag('event', 'conversion', { send_to: sendTo });
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

    // --- CONSENTIMIENTO DE COOKIES ---
    // El estado por defecto (denied) se declara en el <head> de cada pagina,
    // antes de gtag, para que nada se rastree hasta que el visitante decida.
    const CONSENT_KEY = 'cs24_consent';
    const banner = document.getElementById('cookie-banner');

    const readConsent = () => {
        try {
            return localStorage.getItem(CONSENT_KEY);
        } catch (e) {
            return null; // modo privado o almacenamiento bloqueado
        }
    };

    // Microsoft Clarity (mapas de calor y grabacion de sesiones).
    // Solo se carga si el visitante acepta, y cuando el navegador esta ocioso,
    // para no competir con el renderizado de la pagina.
    const CLARITY_ID = 'xtpl092spp';
    let clarityPedido = false;

    const cargarClarity = () => {
        if (clarityPedido || !CLARITY_ID) return;
        clarityPedido = true;
        const inyectar = () => {
            (function (c, l, a, r, i, t, y) {
                c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
                t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
                y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
            })(window, document, 'clarity', 'script', CLARITY_ID);
        };
        if ('requestIdleCallback' in window) {
            requestIdleCallback(inyectar, { timeout: 3000 });
        } else {
            setTimeout(inyectar, 1500);
        }
    };

    const applyConsent = (granted) => {
        if (granted) cargarClarity();
        if (typeof gtag !== 'function') return;
        const value = granted ? 'granted' : 'denied';
        gtag('consent', 'update', {
            analytics_storage: value,
            ad_storage: value,
            ad_user_data: value,
            ad_personalization: value
        });
    };

    const saveConsent = (granted) => {
        try {
            localStorage.setItem(CONSENT_KEY, granted ? 'granted' : 'denied');
        } catch (e) {
            // Sin almacenamiento no se persiste: se vuelve a preguntar en la proxima visita.
        }
        applyConsent(granted);
        if (banner) banner.classList.remove('is-visible');
    };

    if (banner) {
        const saved = readConsent();
        if (saved === 'granted') {
            applyConsent(true);
        } else if (saved !== 'denied') {
            // Sin decision previa: mostrar el aviso sin competir con el LCP.
            setTimeout(() => banner.classList.add('is-visible'), 900);
        }

        const acceptBtn = banner.querySelector('[data-cookie-accept]');
        const rejectBtn = banner.querySelector('[data-cookie-reject]');
        if (acceptBtn) acceptBtn.addEventListener('click', () => saveConsent(true));
        if (rejectBtn) rejectBtn.addEventListener('click', () => saveConsent(false));
    }

    document.querySelectorAll('[data-cookie-settings]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            if (banner) {
                banner.classList.add('is-visible');
                banner.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        });
    });

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