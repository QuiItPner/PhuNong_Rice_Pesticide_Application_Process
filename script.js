// Reveal Observer (Hiệu ứng xuất hiện mượt)
(function () {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.02, rootMargin: '0px 0px 100px 0px' });
  document.querySelectorAll('.reveal').forEach(function (el, i) {
    if (el.tagName === 'TR') { el.style.transitionDelay = (i % 8 * 0.06) + 's'; }
    io.observe(el);
  });
})();

// Sticky Header & Back to top
(function () {
  var btn = document.getElementById('backToTop');
  var header = document.getElementById('stickyHeader');
  function toggle() {
    var sy = window.pageYOffset;
    if (btn) btn.classList.toggle('show', sy > 400);
    if (header) header.classList.toggle('active', sy > 280);
  }
  window.addEventListener('scroll', toggle, { passive: true });
  toggle();
  if (btn) {
    btn.addEventListener('click', function () {
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  }
})();

// Product Lightbox
(function () {
  var overlay = document.getElementById('product-lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var closeBtn = document.getElementById('lightbox-close');

  if (!overlay || !lightboxImg || !closeBtn) return;

  document.querySelectorAll('.prod-img-stage img, .care-img').forEach(function (img) {
    img.style.cursor = 'pointer';
    img.addEventListener('click', function (e) {
      e.preventDefault();
      lightboxImg.src = img.src;
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  }

  closeBtn.addEventListener('click', closeLightbox);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeLightbox();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });
})();

// Top Loading Bar khi click Xem chi tiết / chuyển link
(function () {
  var bar = document.getElementById('topLoadingBar');
  if (!bar) return;
  var timer = null;

  function resetLoading() {
    if (timer) clearTimeout(timer);
    bar.classList.remove('active', 'finish');
    bar.style.width = '0%';
  }

  function startLoading() {
    resetLoading();
    void bar.offsetWidth; // Force reflow

    // Luôn kích hoạt thanh load mượt 96% phát sáng xanh neon liên tục
    bar.classList.add('active');

    // Tự động finish dọn dẹp sau 6s nếu không chuyển đi
    timer = setTimeout(function () {
      bar.classList.add('finish');
      timer = setTimeout(resetLoading, 400);
    }, 6000);
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href');
    if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
      startLoading();
    }
  });

  // Tự động dọn dẹp thanh load khi:
  // 1. Laptop mở tab mới khiến tab cũ mất focus (blur) hoặc bị ẩn (visibilitychange)
  // 2. Mobile/Desktop quay lại trang (pageshow/focus)
  window.addEventListener('pageshow', resetLoading);
  window.addEventListener('focus', resetLoading);
  window.addEventListener('blur', function () {
    setTimeout(resetLoading, 400);
  });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      setTimeout(resetLoading, 300);
    } else {
      resetLoading();
    }
  });
})();
