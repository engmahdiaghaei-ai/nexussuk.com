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
const enquirySource = ['power_bi_consulting', 'nexus_prepare'].includes(requestedSource) ? requestedSource : 'other';

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
    if (href.startsWith('mailto:')) window.NexusAnalytics?.track('email_click', { email: href.slice(7).split('?')[0] });
    if (link.dataset.track) window.NexusAnalytics?.track(link.dataset.track);
  });
});

const aiForm = document.getElementById('nexus-ai-form');
const aiInput = document.getElementById('nexus-ai-input');
const aiChat = document.getElementById('nexus-ai-chat');
const aiActions = document.getElementById('nexus-ai-actions');
const aiResultLink = document.getElementById('nexus-ai-result');
const serviceRoutes = {
  prepare: ['nexus-prepare.html', 'Explore Nexus Prepare', 'Nexus Prepare', 'See the document capture, extraction and review workflow, plan details and workspace sign-in. For an existing account, tell us what step is blocked without sharing documents or login details.'],
  cards: ['nexus-insightcards.html', 'Explore InsightCards', 'Nexus InsightCards', 'See the Power BI custom visual in use, watch the product videos or download the showcase report and visual package for evaluation.'],
  fabric: ['microsoft-fabric-data.html', 'Explore Microsoft Fabric services', 'Microsoft Fabric', 'Start with your data sources, refresh requirements and reporting needs. The Fabric page explains how Nexus approaches migration, pipelines and semantic models.'],
  dashboard: ['dashboard-studio.html#industry-lab', 'Try the dashboard examples', 'Data & Business Intelligence', 'Start with the decision you need to make and the KPI that supports it. Explore the industry examples, or ask Mahdi to review your data sources and reporting needs.'],
  performance: ['power-bi-report-performance-guide.html', 'Read the Power BI performance guide', 'Data & Business Intelligence', 'Start by recording the slow interaction in Power BI Performance Analyzer. The guide shows how to separate query time from visual rendering and verify the result.'],
  software: ['custom-software.html', 'Explore software development', 'Custom Software', 'Nexus can scope a website, mobile or personal app, customer portal or business automation around your users and workflow. Tell us who will use it and what they need to do.'],
  automation: ['custom-software.html#ai-automation', 'Explore AI assistants and automation', 'Custom Software', 'Start with one bounded task, approved information sources and a hand-off to a person when the assistant is uncertain. Nexus can scope that workflow with you.'],
  support: ['#contact-form', 'Contact Nexus support', 'Another requirement', 'Use the enquiry form or WhatsApp to contact Nexus directly. Include the product name, what you expected and where you got stuck. This is not a live staffed chat.'],
  general: ['all-pages.html', 'Browse all Nexus pages', 'Another requirement', 'I could not match that to one service confidently. Try naming the product or explaining the task you want to complete, or contact Nexus directly.']
};

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
  const rules = [
    ['prepare', /\b(?:nexus prepare|invoice\w*|receipt\w*|document capture|ocr)\b/],
    ['cards', /\b(?:insightcards?|power bi visual|custom visual|pbiviz|pbix)\b/],
    ['support', /\b(?:support|speak to|human|log\s?in|password)\b/],
    ['automation', /\b(?:ai agent|ai assistant|chatbot|chat bot|personal assistant|knowledge base)\b/],
    ['performance', /\b(?:slow|performance|optimis\w*|optimiz\w*)\b.*\b(?:power bi|report|dax)\b|\b(?:power bi|report|dax)\b.*\b(?:slow|performance|optimis\w*|optimiz\w*)\b/],
    ['fabric', /\b(?:microsoft fabric|lakehouse|fabric|warehouse|etl|ssis|ssas)\b/],
    ['dashboard', /\b(?:power bi|dashboard\w*|reporting|analytics|sql|kpis?)\b/],
    ['software', /\b(?:apps?|applications?|software|websites?|portal|cloud|automation|integrations?)\b/]
  ];
  const route = rules.find(([, pattern]) => pattern.test(text))?.[0] || 'general';
  return { route, details: serviceRoutes[route][3] };
}

async function getAiRecommendation(input) {
  const local = localAiRecommendation(input);
  const endpoint = window.NEXUS_CONFIG?.aiEndpoint;
  if (!endpoint) return local;
  try {
    const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: input }), signal: AbortSignal.timeout(6000) });
    if (!response.ok) return local;
    const result = await response.json();
    const details = result.text || result.reply;
    const route = typeof result.route === 'string' && Object.hasOwn(serviceRoutes, result.route) ? result.route : local.route;
    return typeof details === 'string' && details.trim() ? { route, details: details.slice(0, 1000) } : local;
  } catch {
    return local;
  }
}

document.querySelectorAll('[data-ai-topic]').forEach((button) => {
  button.addEventListener('click', () => {
    if (!aiInput || !aiForm || aiForm.querySelector('button')?.disabled) return;
    aiInput.value = button.dataset.aiTopic;
    aiForm.requestSubmit();
  });
});

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
    const [href, label, interest] = serviceRoutes[recommendation.route];
    addAiMessage(recommendation.details, 'assistant');
    if (aiResultLink) {
      aiResultLink.href = href;
      aiResultLink.textContent = `${label} ↗`;
    }
    if (interestField) interestField.value = interest;
    const continueLink = aiActions?.querySelector('[data-interest]');
    if (continueLink) continueLink.dataset.interest = interest;
    if (aiActions) aiActions.hidden = false;
    window.NexusAnalytics?.track('ai_recommendation', { route: recommendation.route });
  } catch {
    addAiMessage('I could not reach the assistant service right now. Please use the direct email or WhatsApp options below and we will help you personally.', 'assistant');
  } finally {
    if (button) button.disabled = false;
  }
});

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
  localStorage.removeItem('nexus-analytics-consent'); window.NexusAnalytics?.showBanner();
}));
