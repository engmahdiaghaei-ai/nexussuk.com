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

if (interestField && window.location) {
  const enquiryParameters = new URLSearchParams(window.location.search);
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
      window.NexusAnalytics?.track('email_copy', { email: button.dataset.email });
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
    window.NexusAnalytics?.track('generate_lead', { interest: selectedInterest });
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
    if (href.startsWith('mailto:')) window.NexusAnalytics?.track('email_click', { email: href.slice(7).split('?')[0] });
    if (link.dataset.track) window.NexusAnalytics?.track(link.dataset.track);
  });
});

const aiForm = document.getElementById('nexus-ai-form');
const aiInput = document.getElementById('nexus-ai-input');
const aiChat = document.getElementById('nexus-ai-chat');
const aiActions = document.getElementById('nexus-ai-actions');

function addAiMessage(text, type) {
  if (!aiChat) return;
  const message = document.createElement('div');
  message.className = `ai-message ai-message-${type}`;
  message.textContent = text;
  aiChat.appendChild(message);
  aiChat.scrollTop = aiChat.scrollHeight;
}

function localAiRecommendation(input) {
  const text = input.toLowerCase();
  if (/(nexus prepare|prepare product|invoice|receipt|document capture|bank statement|ocr)/.test(text)) {
    return { text: 'Nexus Prepare is our software for mobile document capture and cloud-based extraction and review. Explore the product page for the web application, a mobile prototype preview and launch plans. Nexus provides software, not outsourced accounting services.', interest: 'Nexus Prepare', contact: 'mahdi' };
  }
  if (/(insightcard|power bi visual|custom visual)/.test(text)) {
    return { text: 'Explore Nexus InsightCards, our Power BI custom visual. The product page includes showcase media and sample downloads.', interest: 'Nexus InsightCards', contact: 'mahdi' };
  }
  if (/(power bi|dashboard|report|fabric|sql|ssis|ssas|data|warehouse|etl|analytics|forecast)/.test(text)) {
    return { text: 'This sounds like a data and business intelligence requirement. Mahdi can help with Power BI, Microsoft Fabric, data engineering, modelling and enterprise or personal dashboards.', interest: 'Data & Business Intelligence', contact: 'mahdi' };
  }
  if (/(app|application|software|website|portal|cloud|automation|tool|system|integrat)/.test(text)) {
    return { text: 'This sounds like a custom software or automation requirement. Nexus can shape the product, choose the right architecture and build the solution around your workflow.', interest: 'Custom Software', contact: 'mahdi' };
  }
  return { text: 'Your requirement may combine several Nexus capabilities. The best next step is a short discovery conversation so we can understand the process, data and desired outcome.', interest: 'Another requirement', contact: 'company' };
}

async function getAiRecommendation(input) {
  const endpoint = window.NEXUS_CONFIG?.aiEndpoint;
  if (!endpoint) return localAiRecommendation(input);
  const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: input }) });
  if (!response.ok) throw new Error('AI endpoint unavailable');
  return response.json();
}

aiForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const input = aiInput?.value.trim();
  if (!input) return;
  addAiMessage(input, 'user');
  if (aiInput) aiInput.value = '';
  const button = aiForm.querySelector('button');
  if (button) button.disabled = true;
  try {
    const recommendation = await getAiRecommendation(input);
    addAiMessage(recommendation.text || recommendation.reply, 'assistant');
    if (interestField && recommendation.interest) interestField.value = recommendation.interest;
    const continueLink = aiActions?.querySelector('[data-interest]');
    if (continueLink && recommendation.interest) continueLink.dataset.interest = recommendation.interest;
    if (aiActions) aiActions.hidden = false;
    window.NexusAnalytics?.track('ai_recommendation', { interest: recommendation.interest || 'General enquiry', contact: recommendation.contact || 'company' });
  } catch {
    addAiMessage('I could not reach the assistant service right now. Please use the direct email or WhatsApp options below and we will help you personally.', 'assistant');
  } finally {
    if (button) button.disabled = false;
  }
});

const bookingLink = document.querySelector('[data-booking-link]');
if (bookingLink && window.NEXUS_CONFIG?.bookingUrl) {
  bookingLink.href = window.NEXUS_CONFIG.bookingUrl;
  bookingLink.target = '_blank'; bookingLink.rel = 'noopener';
}

document.querySelectorAll('[data-cookie-settings]').forEach((button) => button.addEventListener('click', () => {
  localStorage.removeItem('nexus-analytics-consent'); window.NexusAnalytics?.showBanner();
}));
