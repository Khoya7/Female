document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('subscription-form');
  const input = document.getElementById('email-input');
  const msg = document.getElementById('subscription-message');

  if (form && input && msg) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      msg.style.display = 'none';
      const email = input.value.trim();

      if (!/^\S+@\S+\.\S+$/.test(email)) {
        msg.textContent = 'Please enter a valid email address.';
        msg.style.display = 'block';
        msg.style.color = '#ff6b6b';
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      if (btn) btn.disabled = true;
      try {
        const res = await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        if (res.ok && data.ok) {
          msg.textContent = 'Subscribed — check your inbox.';
          msg.style.color = '#4ade80';
          form.reset();
        } else {
          msg.textContent = data.error || 'Subscription failed. Try again later.';
          msg.style.color = '#ff6b6b';
        }
      } catch (err) {
        msg.textContent = 'Network error. Try again later.';
        msg.style.color = '#ff6b6b';
      } finally {
        if (btn) btn.disabled = false;
        msg.style.display = 'block';
      }
    });
  }

  // Lazy-load images that use data-src
  const lazyImages = document.querySelectorAll('img[data-src]');
  if ('loading' in HTMLImageElement.prototype) {
    lazyImages.forEach(img => img.src = img.dataset.src);
  } else if (lazyImages.length) {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });
    lazyImages.forEach(img => io.observe(img));
  }
});