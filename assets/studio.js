document.querySelectorAll('[data-dashboard]').forEach((dashboard) => {
  const selector = dashboard.querySelector('[data-demo-period]');
  const periods = {
    quarter: { revenue: 1284600, orders: 8426, margin: 34.8 },
    month: { revenue: 481600, orders: 3058, margin: 35.2 }
  };
  selector?.addEventListener('change', () => {
    const period = periods[selector.value];
    dashboard.querySelector('[data-demo-revenue]').textContent = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(period.revenue);
    dashboard.querySelector('[data-demo-orders]').textContent = new Intl.NumberFormat('en-GB').format(period.orders);
    dashboard.querySelector('[data-demo-margin]').textContent = `${period.margin}%`;
  });
});
