// Client-side behaviour for female.html — subscription + small UX improvements
(() => {
    'use strict';

    const showMessage = (el, text, opts = {}) => {
        if (!el) return;
        el.style.display = 'block';
        el.textContent = text;
        el.style.color = opts.color || '#d4af37';
        if (opts.timeout) {
            clearTimeout(el.__timeout);
            el.__timeout = setTimeout(() => { el.style.display = 'none'; }, opts.timeout);
        }
        if (opts.focus) el.focus();
    };

    const validateEmail = (value) => {
        // Simple, robust email check
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    };

    const initSubscription = () => {
        const form = document.getElementById('subscription-form');
        const messageDiv = document.getElementById('subscription-message');
        if (!form || !messageDiv) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const input = document.getElementById('email-input');
            const submitBtn = form.querySelector('button[type="submit"]');

            if (!input) return;

            const email = input.value.trim();
            if (!validateEmail(email)) {
                showMessage(messageDiv, 'Please enter a valid email address.', { color: '#ff6b6b', timeout: 4000, focus: true });
                return;
            }

            submitBtn.disabled = true;
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Subscribing...';

            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 10000);

            try {
                const res = await fetch('/api/subscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
                    signal: controller.signal
                });

                clearTimeout(timeout);

                if (!res.ok) {
                    const body = await res.json().catch(() => ({}));
                    const err = body.error || body.message || 'Subscription failed. Please try again.';
                    showMessage(messageDiv, err, { color: '#ff6b6b', timeout: 6000 });
                } else {
                    showMessage(messageDiv, '✓ Successfully subscribed! Check your email for updates.', { color: '#4caf50', timeout: 6000 });
                    input.value = '';
                }
            } catch (err) {
                const isAbort = err.name === 'AbortError';
                showMessage(messageDiv, isAbort ? 'Request timed out. Try again.' : 'Network error. Please try again.', { color: '#ff6b6b', timeout: 6000 });
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    };

    const initLazyImages = () => {
        // ensure modern lazy loading attribute
        document.querySelectorAll('img').forEach(img => {
            if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
        });

        // Progressive enhancement: swap data-src to src if present
        const lazyNodes = document.querySelectorAll('img[data-src]');
        if ('IntersectionObserver' in window && lazyNodes.length) {
            const io = new IntersectionObserver((entries, obs) => {
                entries.forEach(ent => {
                    if (ent.isIntersecting) {
                        const img = ent.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        obs.unobserve(img);
                    }
                });
            }, { rootMargin: '200px' });

            lazyNodes.forEach(img => io.observe(img));
        } else {
            // Fallback: load immediately
            lazyNodes.forEach(img => { img.src = img.dataset.src; img.removeAttribute('data-src'); });
        }
    };

    const initSmoothAnchors = () => {
        document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', (e) => {
                const target = document.querySelector(a.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    };

    document.addEventListener('DOMContentLoaded', () => {
        initLazyImages();
        initSubscription();
        initSmoothAnchors();
        // small visual ready flag
        document.documentElement.classList.add('js-ready');
    });
})();