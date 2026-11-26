const routes = {
  prepare: ['nexus-prepare.html', 'Explore Nexus Prepare', 'Capture invoices and receipts on mobile, then review the extracted fields and original document in the web workspace. You can ask me about plans or accounting integrations.'],
  pricing: ['nexus-prepare.html#pricing', 'See Nexus Prepare plans', 'Compare the published plans and what each includes. Check Plan & billing in the app for the final amount and terms.'],
  integrations: ['accounting-integrations.html', 'Check accounting integrations', 'The publishing or export route depends on your accounting platform and workspace setup. Check the integrations page or tell the Nexus team which platform you use.'],
  cards: ['nexus-insightcards.html', 'See InsightCards demos and downloads', 'Nexus InsightCards is a custom Power BI visual. The product page includes videos, a showcase report and a visual package for evaluation.'],
  fabric: ['microsoft-fabric-data.html', 'Explore Microsoft Fabric services', 'Start with your data sources, refresh requirements and reporting needs. Nexus can help scope pipelines, data models and migrations.'],
  dashboards: ['dashboard-studio.html#industry-lab', 'Try dashboard examples', 'Start with the decision you need to make and the KPI that supports it. The Dashboard Studio includes interactive manufacturing, retail and subscription examples using sample data.'],
  consulting: ['power-bi-consulting.html', 'Explore Power BI consulting', 'Nexus can help design, build or improve your Power BI reporting. Tell the team who uses the reports, which data sources you have and which decisions the reports should support.'],
  performance: ['power-bi-report-performance-guide.html', 'Read the Power BI performance guide', 'Start by recording the slow interaction in Power BI Performance Analyzer. The guide shows how to distinguish query time from visual rendering.'],
  software: ['custom-software.html', 'Explore software development', 'Nexus can scope a website, mobile app, portal or automation around your users and workflow. Start with who will use it and the job they need to complete.'],
  automation: ['custom-software.html#ai-automation', 'Explore AI assistants and automation', 'Start with one task, approved information sources and a handoff to a person when the assistant is uncertain. Nexus can scope that workflow with you.'],
  support: ['index.html#contact-form', 'Open the enquiry form', 'You can send an enquiry or message Mahdi on WhatsApp. If you need product help, mention which product and what step you are on, without sharing account details here.'],
  unknown: ['all-pages.html', 'Browse all Nexus pages', 'I’m not sure which service fits yet. Try naming the product or describing the task, for example “speed up a Power BI report” or “capture invoices”.']
};

export function recommend(question, previousTopic = '') {
  const text = question.toLowerCase();
  const patterns = [
    ['support', /\b(?:human|whatsapp|speak to|talk to|contact|log\s?in|sign\s?in|password)\b/],
    ['integrations', /\b(?:sage|xero|quickbooks|accounting integrations?|publish to|export to)\b/],
    ['cards', /\b(?:insightcards?|custom visuals?|pbiviz)\b/],
    ['automation', /\b(?:ai agents?|ai assistants?|chat\s?bots?|personal assistant|knowledge base)\b/],
    ['performance', /\b(?:slow|speed up|performance|optimi[sz]\w*)\b.*\b(?:power bi|reports?|dashboards?|dax)\b|\b(?:power bi|reports?|dashboards?|dax)\b.*\b(?:slow|speed up|performance|optimi[sz]\w*)\b/],
    ['fabric', /\b(?:fabric|lakehouse|warehouse|etl|ssis|ssas)\b/],
    ['prepare', /\b(?:nexus prepare|invoices?|receipts?|document capture|ocr)\b/],
    ['dashboards', /\b(?:dashboards?|kpis?)\b/],
    ['consulting', /\b(?:power bi|consulting|consultancy|bi strategy|reporting|analytics|sql)\b/],
    ['software', /\b(?:apps?|applications?|software|websites?|portals?|automation)\b/]
  ];
  const topic = patterns.find(([, pattern]) => pattern.test(text))?.[0];
  if (/\b(?:pricing|prices?|plans?|billing|costs?|how much)\b/.test(text) && topic !== 'support') {
    if (topic === 'prepare' || (!topic && ['prepare', 'pricing', 'integrations'].includes(previousTopic))) {
      return { topic: 'pricing' };
    }
    return { topic: 'support', text: 'For a custom project, tell Nexus what you need so the team can discuss a quote. If you mean the document capture product, ask for “Nexus Prepare pricing”.' };
  }
  return { topic: topic || 'unknown' };
}

function mountAssistant() {
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = new URL('./assistant.css?v=1', import.meta.url);
  const widget = document.createElement('div');
  widget.className = 'nexus-assistant';
  widget.hidden = true;
  const chatIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 11.5a8 8 0 0 1-8 8H5l.9-3A8 8 0 1 1 20.5 11.5Z"/><path d="M8.5 11.5h.01m4 0h.01m4 0h.01" stroke-width="2.8"/></svg>';
  const closeIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>';
  widget.innerHTML = `
    <button class="nexus-assistant-launcher" type="button" aria-label="Open Nexus Assistant" aria-expanded="false" aria-controls="nexus-assistant-panel">${chatIcon}${closeIcon}</button>
    <section class="nexus-assistant-panel" id="nexus-assistant-panel" aria-labelledby="nexus-assistant-title" hidden>
      <header class="nexus-assistant-header">
        <span class="nexus-assistant-mark">${chatIcon}</span>
        <div><h2 id="nexus-assistant-title">Nexus Assistant</h2><p>Automated site guide</p></div>
        <button class="nexus-assistant-close" type="button" aria-label="Close Nexus Assistant">${closeIcon}</button>
      </header>
      <div class="nexus-assistant-body" tabindex="0" aria-label="Conversation and suggested questions">
        <div class="nexus-assistant-messages" role="log" aria-label="Conversation">
          <div class="nexus-assistant-message">Hi! I can help you find the right Nexus service, explore a product or get in touch. What are you working on?</div>
        </div>
        <div class="nexus-assistant-topics" role="group" aria-label="Suggested questions">
          <button type="button" data-question="Show me dashboard examples">Dashboard examples</button>
          <button type="button" data-question="How does Nexus Prepare work?">Nexus Prepare</button>
          <button type="button" data-question="Tell me about InsightCards">InsightCards</button>
          <button type="button" data-question="I want to talk to the team">Talk to Nexus</button>
        </div>
      </div>
      <form class="nexus-assistant-form" aria-label="Chat message">
        <label class="nexus-assistant-label" for="nexus-assistant-input">Your question</label>
        <input id="nexus-assistant-input" type="text" maxlength="600" autocomplete="off" enterkeyhint="send" placeholder="Type your question…" aria-describedby="nexus-assistant-note">
        <button class="nexus-assistant-send" type="submit" aria-label="Send message"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 11 16-7-7 16-2-7-7-2Zm7 2 9-9"/></svg></button>
      </form>
      <p class="nexus-assistant-note" id="nexus-assistant-note">Not live chat. Please don’t share sensitive information.</p>
    </section>`;

  const panel = widget.querySelector('.nexus-assistant-panel');
  const launcher = widget.querySelector('.nexus-assistant-launcher');
  const close = widget.querySelector('.nexus-assistant-close');
  const body = widget.querySelector('.nexus-assistant-body');
  const messages = widget.querySelector('.nexus-assistant-messages');
  const topics = widget.querySelector('.nexus-assistant-topics');
  const form = widget.querySelector('form');
  const input = widget.querySelector('input');
  let previousTopic = location.pathname.endsWith('/nexus-prepare.html') ? 'prepare' : '';

  function setOpen(open) {
    panel.hidden = !open;
    launcher.setAttribute('aria-expanded', String(open));
    launcher.setAttribute('aria-label', `${open ? 'Close' : 'Open'} Nexus Assistant`);
    (open ? close : launcher).focus({ preventScroll: true });
  }

  function message(text, fromVisitor = false) {
    const bubble = document.createElement('div');
    bubble.className = fromVisitor ? 'nexus-assistant-message nexus-assistant-visitor' : 'nexus-assistant-message';
    bubble.textContent = text;
    return bubble;
  }

  function action(href, label) {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = label;
    if (link.hostname === 'wa.me') {
      link.rel = 'noopener';
      link.target = '_blank';
      link.addEventListener('click', () => window.NexusAnalytics?.track('ai_whatsapp_click'));
    }
    link.addEventListener('click', () => {
      setOpen(false);
      if (link.getAttribute('href') === '#contact-form') {
        document.querySelector('#contact-form input:not([type="hidden"])')?.focus({ preventScroll: true });
      }
    });
    return link;
  }

  function ask(question) {
    if (!question) return;
    const recommendation = recommend(question, previousTopic);
    const { topic } = recommendation;
    if (topic !== 'unknown') previousTopic = topic;
    const [href, label, text] = routes[topic];
    const contact = document.getElementById('contact-form') ? '#contact-form' : routes.support[0];
    const reply = message(recommendation.text || text);
    const links = document.createElement('div');
    links.className = 'nexus-assistant-actions';
    if (topic === 'support') {
      links.append(action(contact, label), action('https://wa.me/447345172404', 'WhatsApp Mahdi'));
    } else {
      links.append(action(href, label), action(contact, 'Contact Nexus'));
    }
    reply.append(links);
    topics.hidden = true;
    messages.append(message(question, true), reply);
    body.scrollTop = body.scrollHeight;
    window.NexusAnalytics?.track('ai_recommendation', { route: topic });
  }

  launcher.addEventListener('click', () => setOpen(panel.hidden));
  close.addEventListener('click', () => setOpen(false));
  widget.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) setOpen(false);
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const question = input.value.trim();
    input.value = '';
    input.focus();
    ask(question);
  });
  topics.addEventListener('click', (event) => {
    const topic = event.target.closest('[data-question]');
    if (!topic) return;
    body.focus({ preventScroll: true });
    ask(topic.dataset.question);
  });
  function openFromHash() {
    if (location.hash === '#nexus-ai' && !widget.hidden) setOpen(true);
  }
  let cookieBanner;
  function positionAboveBanner() {
    const inset = cookieBanner ? Math.ceil(innerHeight - cookieBanner.getBoundingClientRect().top) : 0;
    widget.style.setProperty('--chat-cookie-inset', `${Math.max(0, inset)}px`);
  }
  const bannerSize = new ResizeObserver(positionAboveBanner);
  function watchBanner() {
    const currentBanner = document.getElementById('cookie-banner');
    if (cookieBanner === currentBanner) return;
    bannerSize.disconnect();
    cookieBanner = currentBanner;
    if (cookieBanner) bannerSize.observe(cookieBanner);
    positionAboveBanner();
  }
  stylesheet.addEventListener('load', () => {
    widget.hidden = false;
    watchBanner();
    new MutationObserver(watchBanner).observe(document.body, { childList: true });
    window.addEventListener('resize', positionAboveBanner);
    openFromHash();
  });
  window.addEventListener('hashchange', openFromHash);
  document.body.append(widget);
  document.head.append(stylesheet);
}

if (typeof document !== 'undefined') mountAssistant();
