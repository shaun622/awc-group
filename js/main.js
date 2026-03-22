// ===== AWC GROUP - Main JS =====

document.addEventListener('DOMContentLoaded', () => {

    // ===== NAV SCROLL EFFECT =====
    const nav = document.getElementById('nav');

    const handleNavScroll = () => {
        if (window.scrollY > 40) {
            nav.classList.add('nav--scrolled');
        } else {
            nav.classList.remove('nav--scrolled');
        }
    };

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    // ===== MOBILE MENU =====
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close on any link/button click inside menu
        mobileMenu.querySelectorAll('a, .mobile-menu__cta-btn').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

    }

    // ===== SERVICE TAB SWITCHER =====
    const tabs = document.querySelectorAll('.services__tab');
    const panels = document.querySelectorAll('.services__panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;

            // Update tabs
            tabs.forEach(t => t.classList.remove('services__tab--active'));
            tab.classList.add('services__tab--active');

            // Update panels
            panels.forEach(p => {
                p.classList.remove('services__panel--active');
                if (p.dataset.panel === target) {
                    p.classList.add('services__panel--active');
                }
            });
        });
    });

    // ===== HERO CARD CLICK -> TAB SWITCH =====
    const heroCards = document.querySelectorAll('.hero__card');
    heroCards.forEach(card => {
        card.addEventListener('click', () => {
            const service = card.dataset.service;
            const targetTab = document.querySelector(`.services__tab[data-tab="${service}"]`);
            if (targetTab) {
                targetTab.click();
                document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ===== INTERSECTION OBSERVER (Entrance Animations) =====
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up, .fade-in, .scale-in, .stagger-children').forEach(el => {
        observer.observe(el);
    });

    // ===== BUTTON RIPPLE EFFECT =====
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            btn.style.setProperty('--x', x + '%');
            btn.style.setProperty('--y', y + '%');
        });
    });

    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = 80; // nav height
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ===== FORM HANDLING =====
    const quoteForm = document.getElementById('quoteForm');
    if (quoteForm) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const btn = quoteForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;

            btn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18" class="spin">
                    <circle cx="12" cy="12" r="10" stroke-dasharray="31.4" stroke-dashoffset="10" stroke-linecap="round"/>
                </svg>
                Sending...
            `;
            btn.disabled = true;

            // Simulate send (replace with actual API call)
            setTimeout(() => {
                btn.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                        <path d="M20 6L9 17L4 12"/>
                    </svg>
                    Quote Request Sent!
                `;
                btn.style.background = '#16a34a';

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    btn.style.background = '';
                    quoteForm.reset();
                }, 3000);
            }, 1500);
        });
    }

    // ===== FAQ ACCORDION =====
    document.querySelectorAll('.svc-faq__question').forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const isActive = item.classList.contains('active');

            // Close all
            document.querySelectorAll('.svc-faq__item').forEach(i => i.classList.remove('active'));

            // Open clicked (if it wasn't already open)
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // ===== ADD SPIN ANIMATION =====
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        .spin {
            animation: spin 1s linear infinite;
        }
    `;
    document.head.appendChild(style);

});
