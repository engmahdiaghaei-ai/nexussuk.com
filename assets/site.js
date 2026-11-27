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

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('visible'));
}

window.addEventListener('scroll', () => {
  document.querySelector('.site-header')?.classList.toggle('scrolled', window.scrollY > 20);
});

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const contactForm = document.getElementById('contact-form');
const interestField = document.getElementById('contact-interest');
const formStatus = document.getElementById('form-status');
const enquiryParameters = new URLSearchParams(window.location.search);
const requestedSource = enquiryParameters.get('enquiry_source');
const enquirySource = ['power_bi_consulting', 'nexus_prepare', 'bi_plugins'].includes(requestedSource) ? requestedSource : 'other';

if (interestField && window.location) {
  const requestedInterest = enquiryParameters.get('interest');
  if ([...interestField.options].some((option) => option.value === requestedInterest)) {
    interestField.value = requestedInterest;
  }
  const requestedPlan = enquiryParameters.get('plan');
  const requestedBilling = enquiryParameters.get('billing');
  if (contactForm && ['capture', 'team', 'scale'].includes(requestedPlan)) {
    const planField = contactForm.querySelector('[name="requested_plan"]');
    const billingField = contactForm.querySelector('[name="billing_period"]');
    if (planField) planField.value = requestedPlan;
    if (billingField && ['monthly', 'annual'].includes(requestedBilling)) billingField.value = requestedBilling;
    const messageField = contactForm.querySelector('[name="message"]');
    if (messageField && !messageField.value) messageField.value = `I would like to discuss the Nexus Prepare ${requestedPlan} plan${requestedBilling ? ` (${requestedBilling} billing)` : ''}.`;
  }
}

document.querySelectorAll('[data-interest]').forEach((link) => {
  if (!interestField && link.href) {
    const destination = new URL(link.href, window.location.href);
    if (destination.origin === window.location.origin && destination.pathname.endsWith('/index.html')) {
      destination.searchParams.set('interest', link.dataset.interest);
      link.href = destination.href;
    }
  }
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
      window.NexusAnalytics?.track('email_copy');
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
  const selectedInterest = interestField?.value || 'General enquiry';

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
    window.NexusAnalytics?.track('generate_lead', { interest: selectedInterest, enquiry_source: enquirySource });
  } catch {
    formStatus.className = 'form-status error';
    formStatus.textContent = 'We could not send your enquiry. Please try again or copy Info@Nexussuk.com and email us directly.';
  } finally {
    submitButton.disabled = false;
    if (submitLabel) submitLabel.textContent = originalLabel;
  }
});

document.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    const href = link.href || '';
    if (href.includes('github.com')) window.NexusAnalytics?.track('github_click');
    if (href.includes('linkedin.com')) window.NexusAnalytics?.track('linkedin_click');
    if (href.includes('wa.me')) window.NexusAnalytics?.track('whatsapp_click');
    if (href.startsWith('mailto:')) window.NexusAnalytics?.track('email_click');
    if (link.dataset.track) window.NexusAnalytics?.track(link.dataset.track);
  });
});

document.querySelectorAll('video[data-analytics-video]').forEach((video) => {
  const detail = { video_id: video.dataset.analyticsVideo };
  video.addEventListener('playing', () => window.NexusAnalytics?.track('prepare_video_start', detail), { once: true });
  video.addEventListener('ended', () => window.NexusAnalytics?.track('prepare_video_complete', detail), { once: true });
});

import('./assistant.js?v=1').catch((error) => console.warn('Nexus Assistant could not load.', error));

const bookingLink = document.querySelector('[data-booking-link]');
const industryLab = document.getElementById('industry-lab');
const industrySelector = industryLab?.querySelector('select');
const industryScenarios = {
  manufacturing: { metric: 'Orders on time', actual: 184, total: 200, target: 95, decision: 'Segment late orders by production line and check whether downtime is concentrated on one shift.' },
  retail: { metric: 'Orders dispatched on time', actual: 455, total: 500, target: 94, decision: 'Compare delays by stock location and carrier before committing to a new delivery promise.' },
  subscription: { metric: 'Accounts retained', actual: 228, total: 240, target: 97, decision: 'Compare retention by onboarding cohort before changing how new accounts are supported.' }
};

industrySelector?.addEventListener('change', () => {
  const scenario = industryScenarios[industrySelector.value];
  if (!scenario) return;
  const rate = scenario.actual / scenario.total * 100;
  industryLab.querySelector('[data-lab-label]').textContent = scenario.metric;
  industryLab.querySelector('[data-lab-rate]').textContent = `${rate.toFixed(1)}%`;
  industryLab.querySelector('[data-lab-target]').textContent = `${scenario.target}%`;
  industryLab.querySelector('[data-lab-count]').textContent = `${scenario.actual} / ${scenario.total}`;
  industryLab.querySelector('[data-lab-meter]').value = rate;
  industryLab.querySelector('[data-lab-decision]').textContent = scenario.decision;
});

if (bookingLink && window.NEXUS_CONFIG?.bookingUrl) {
  bookingLink.href = window.NEXUS_CONFIG.bookingUrl;
  bookingLink.target = '_blank'; bookingLink.rel = 'noopener';
}

document.querySelectorAll('[data-cookie-settings]').forEach((button) => button.addEventListener('click', () => {
  window.NexusAnalytics?.showBanner(true);
}));
