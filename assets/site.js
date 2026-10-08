const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');

menuButton?.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

navigation?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

window.addEventListener('scroll', () => {
  document.querySelector('.site-header')?.classList.toggle('scrolled', window.scrollY > 20);
});

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const contactForm = document.getElementById('contact-form');
const interestField = document.getElementById('contact-interest');
const formStatus = document.getElementById('form-status');

document.querySelectorAll('[data-interest]').forEach((link) => {
  link.addEventListener('click', () => {
    if (interestField) interestField.value = link.dataset.interest;
  });
});

document.querySelectorAll('.copy-email').forEach((button) => {
  button.addEventListener('click', async () => {
    const label = button.querySelector('span');
    try {
      await navigator.clipboard.writeText(button.dataset.email);
      if (label) label.textContent = 'Copied';
    } catch {
      if (label) label.textContent = button.dataset.email;
    }
    window.setTimeout(() => {
      if (label) label.textContent = 'Copy';
    }, 2200);
  });
});

contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const submitLabel = contactForm.querySelector('.submit-label');
  const originalLabel = submitLabel?.textContent;

  submitButton.disabled = true;
  if (submitLabel) submitLabel.textContent = 'Sending…';
  formStatus.className = 'form-status';
  formStatus.textContent = 'Sending your enquiry securely…';

  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { Accept: 'application/json' }
    });

    if (!response.ok) throw new Error('Submission failed');

    contactForm.reset();
    formStatus.className = 'form-status success';
    formStatus.textContent = 'Thank you. Your enquiry has been sent successfully. We will be in touch shortly.';
  } catch {
    formStatus.className = 'form-status error';
    formStatus.textContent = 'We could not send your enquiry. Please try again or copy Info@Nexussuk.com and email us directly.';
  } finally {
    submitButton.disabled = false;
    if (submitLabel) submitLabel.textContent = originalLabel;
  }
});
