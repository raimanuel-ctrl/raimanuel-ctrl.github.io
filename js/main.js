/* ==========================================================================
   Raimundo Sánchez Mosqueira - Interactive Portal Logic
   Features: Smooth Slider, Language Switcher, Code Copier, CV Print
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Language Initialization
  let currentLang = localStorage.getItem('lang') || 'es';
  applyLanguage(currentLang);

  const langBtn = document.getElementById('langToggle');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      currentLang = currentLang === 'es' ? 'en' : 'es';
      localStorage.setItem('lang', currentLang);
      applyLanguage(currentLang);
    });
  }

  // 2. Interactive Code Slider Logic ("Que se deslicen cosas")
  initInteractiveSlider();

  // 3. Code Snippet Copy Buttons
  document.querySelectorAll('.btn-copy-code').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const codeElement = document.getElementById(targetId);
      if (codeElement) {
        navigator.clipboard.writeText(codeElement.innerText).then(() => {
          const dict = translations[currentLang] || translations.es;
          const origHtml = btn.innerHTML;
          btn.innerHTML = `<i class="fa-solid fa-check"></i> ${dict.copied_msg || '¡Copiado!'}`;
          btn.style.backgroundColor = '#16a34a';
          showToast(dict.copied_msg || 'Código copiado al portapapeles');

          setTimeout(() => {
            btn.innerHTML = origHtml;
            btn.style.backgroundColor = '';
          }, 2200);
        });
      }
    });
  });

  // 4. Print CV Buttons
  document.querySelectorAll('.trigger-print-cv').forEach(btn => {
    btn.addEventListener('click', () => {
      window.print();
    });
  });

  // 5. Active Nav Highlight on Scroll
  initScrollSpy();
});

/* --------------------------------------------------------------------------
   Interactive Slider Functionality
   -------------------------------------------------------------------------- */
let currentSlideIndex = 0;
const totalSlides = 6;

function initInteractiveSlider() {
  const track = document.getElementById('sliderTrack');
  const pillBtns = document.querySelectorAll('.slide-pill-btn');
  const prevBtn = document.getElementById('prevSlide');
  const nextBtn = document.getElementById('nextSlide');
  const dotsContainer = document.getElementById('sliderDots');

  if (!track) return;

  // Generate dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('div');
      dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  // Pill buttons click
  pillBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      goToSlide(idx);
    });
  });

  // Next / Prev clicks
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const target = (currentSlideIndex - 1 + totalSlides) % totalSlides;
      goToSlide(target);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const target = (currentSlideIndex + 1) % totalSlides;
      goToSlide(target);
    });
  }

  // Swipe support for touch devices
  let touchStartX = 0;
  let touchEndX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
      // Swiped left -> next
      goToSlide((currentSlideIndex + 1) % totalSlides);
    }
    if (touchEndX > touchStartX + 50) {
      // Swiped right -> prev
      goToSlide((currentSlideIndex - 1 + totalSlides) % totalSlides);
    }
  }
}

function goToSlide(index) {
  const track = document.getElementById('sliderTrack');
  const pillBtns = document.querySelectorAll('.slide-pill-btn');
  const dots = document.querySelectorAll('.slider-dot');

  currentSlideIndex = index;

  // Slide track: each slide is 16.6666% width
  const offset = index * 16.6666;
  track.style.transform = `translateX(-${offset}%)`;

  // Update pills
  pillBtns.forEach((btn, idx) => {
    if (idx === index) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update dots
  dots.forEach((dot, idx) => {
    if (idx === index) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

/* --------------------------------------------------------------------------
   Language Functionality
   -------------------------------------------------------------------------- */
function applyLanguage(lang) {
  const dict = translations[lang] || translations.es;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  const langBtn = document.getElementById('langToggle');
  if (langBtn) {
    langBtn.innerHTML = `<i class="fa-solid fa-globe"></i> ${lang === 'es' ? 'EN' : 'ES'}`;
  }

  document.documentElement.setAttribute('lang', lang);
}

/* --------------------------------------------------------------------------
   Toast Notification Helper
   -------------------------------------------------------------------------- */
function showToast(message) {
  let toast = document.getElementById('toastNotice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #38bdf8;"></i> ${message}`;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

/* --------------------------------------------------------------------------
   ScrollSpy for Navigation
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-item-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 160;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}
