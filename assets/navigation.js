const pageMenu = document.querySelector('.page-menu');
const mainNavigation = document.querySelector('.main-nav');
const navigationButton = document.querySelector('.menu-toggle');

function closePageMenu() {
  if (pageMenu) pageMenu.open = false;
}

document.addEventListener('click', (event) => {
  if (pageMenu && !pageMenu.contains(event.target)) closePageMenu();
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (pageMenu?.open) {
    closePageMenu();
    pageMenu.querySelector('summary').focus();
  } else if (mainNavigation?.classList.contains('open')) {
    mainNavigation.classList.remove('open');
    navigationButton?.setAttribute('aria-expanded', 'false');
    navigationButton?.focus();
  }
});

mainNavigation?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closePageMenu);
});

document.querySelectorAll('[data-gallery-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    const category = button.dataset.galleryFilter;
    document.querySelectorAll('[data-gallery-filter]').forEach((control) => {
      control.setAttribute('aria-pressed', String(control === button));
    });
    const cards = [...document.querySelectorAll('[data-gallery-category]')];
    cards.forEach((card) => {
      card.hidden = category !== 'all' && card.dataset.galleryCategory !== category;
      if (card.hidden) card.querySelectorAll('video').forEach((video) => video.pause());
    });
    const status = document.querySelector('[data-gallery-status]');
    if (status) status.textContent = `${cards.filter((card) => !card.hidden).length} showcase items shown`;
  });
});
