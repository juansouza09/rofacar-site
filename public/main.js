const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');

if (menuButton && navigation) {
  menuButton.hidden = false;
  document.documentElement.classList.add('js');

  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
  };

  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    navigation.classList.toggle('is-open', !isOpen);
  });

  navigation.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuButton.focus();
    }
  });
}

const motionPreference = window.matchMedia?.('(prefers-reduced-motion: reduce)');
let revealObserver;

const updateMotion = () => {
  const reduced = motionPreference?.matches ?? false;

  revealObserver?.disconnect();
  if (reduced) {
    document.querySelectorAll('.reveal-ready').forEach(element => element.classList.remove('reveal-ready'));
  }
  if (!reduced && 'IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          revealObserver.unobserve(entry.target);
        }
      }
    }, { threshold: 0.12 });
    document.querySelectorAll('[data-reveal]:not(.is-revealed)').forEach(element => {
      // Prepare only offscreen content so visible text never disappears on load.
      if (element.getBoundingClientRect().top >= window.innerHeight) element.classList.add('reveal-ready');
      revealObserver.observe(element);
    });
  }
};

updateMotion();
motionPreference?.addEventListener('change', updateMotion);

const serviceVideos = document.querySelectorAll('.reel-player video');
serviceVideos.forEach(video => {
  video.addEventListener('play', () => {
    serviceVideos.forEach(other => {
      if (other !== video) other.pause();
    });
  });
});

const reviewTrack = document.querySelector('.review-track');
if (reviewTrack) {
  const arrows = reviewTrack.parentElement.querySelectorAll('[data-review-step]');
  const updateArrows = () => {
    const maxScroll = reviewTrack.scrollWidth - reviewTrack.clientWidth;
    arrows[0].setAttribute('aria-disabled', String(reviewTrack.scrollLeft <= 1));
    arrows[1].setAttribute('aria-disabled', String(reviewTrack.scrollLeft >= maxScroll - 1));
  };

  arrows.forEach(arrow => {
    arrow.hidden = false;
    arrow.addEventListener('click', () => {
      if (arrow.getAttribute('aria-disabled') === 'true') return;
      const [first, second] = reviewTrack.children;
      reviewTrack.scrollBy({
        left: (second.offsetLeft - first.offsetLeft) * Number(arrow.dataset.reviewStep),
        behavior: motionPreference?.matches ? 'instant' : 'smooth'
      });
    });
  });

  reviewTrack.addEventListener('scroll', updateArrows, { passive: true });
  window.addEventListener('resize', updateArrows);
  updateArrows();
}
