const preparePlans = {
  capture: { monthly: 2700, annual: 26100 },
  team: { monthly: 5288, annual: 51525 },
  scale: { monthly: 10463, annual: 102375 }
};

const prepareCurrency = new Intl.NumberFormat('en-GB', {
  style: 'currency', currency: 'GBP', minimumFractionDigits: 2, maximumFractionDigits: 2
});

function setPrepareBilling(billing) {
  if (!['monthly', 'annual'].includes(billing)) return;
  const isAnnual = billing === 'annual';
  document.querySelectorAll('[data-billing]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.billing === billing));
  });
  document.querySelectorAll('[data-plan]').forEach((card) => {
    const plan = preparePlans[card.dataset.plan];
    if (!plan) return;
    card.querySelector('[data-plan-price]').textContent = prepareCurrency.format(isAnnual ? plan.annual / 1200 : plan.monthly / 100);
    card.querySelector('[data-plan-total]').textContent = isAnnual ? `${prepareCurrency.format(plan.annual / 100)} billed annually` : 'Billed monthly';
    const enquiry = card.querySelector('[data-plan-enquiry]');
    const destination = new URL(enquiry.href, window.location.href);
    destination.searchParams.set('billing', billing);
    enquiry.href = destination.href;
  });
  const note = document.getElementById('billing-note');
  if (note) note.textContent = isAnnual
    ? 'Annual subscription, billed upfront. Monthly equivalents are rounded; the exact annual total is shown on each plan. GBP. VAT where applicable.'
    : 'Monthly subscription, billed monthly. GBP. Prices exclude VAT where applicable.';
  const benchmark = document.querySelector('[data-benchmark-label]');
  if (benchmark) benchmark.textContent = isAnnual
    ? 'Annual reference totals: £290.00 / £572.50 / £1,137.50.'
    : 'Monthly reference prices: £30.00 / £58.75 / £116.25.';
}

document.querySelectorAll('[data-billing]').forEach((button) => {
  button.addEventListener('click', () => setPrepareBilling(button.dataset.billing));
});
