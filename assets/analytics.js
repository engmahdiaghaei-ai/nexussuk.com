(function () {
  const config = window.NEXUS_CONFIG || {};
  const consentKey = "nexus-analytics-consent";
  let analyticsLoaded = false;
  function addScript(src, attributes = {}) {
    const script = document.createElement("script"); script.src = src; script.async = true;
    Object.entries(attributes).forEach(([key, value]) => script.setAttribute(key, value));
    document.head.appendChild(script);
  }
  function loadCloudflare() {
    if (!config.cloudflareAnalyticsToken || document.querySelector("[data-cf-beacon]")) return;
    addScript("https://static.cloudflareinsights.com/beacon.min.js", { defer: "", "data-cf-beacon": JSON.stringify({ token: config.cloudflareAnalyticsToken }) });
  }
  function loadConsentAnalytics() {
    if (analyticsLoaded) return; analyticsLoaded = true;
    if (config.ga4MeasurementId) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date()); window.gtag("config", config.ga4MeasurementId, { anonymize_ip: true });
      addScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(config.ga4MeasurementId)}`);
    }
    if (config.clarityProjectId) {
      window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments); };
      addScript(`https://www.clarity.ms/tag/${encodeURIComponent(config.clarityProjectId)}`);
    }
  }
  function track(name, details = {}) {
    if (typeof window.gtag === "function") window.gtag("event", name, details);
    if (typeof window.clarity === "function") window.clarity("event", name);
  }
  function saveConsent(value) {
    localStorage.setItem(consentKey, value); document.getElementById("cookie-banner")?.remove();
    if (value === "accepted") loadConsentAnalytics();
  }
  function showBanner() {
    if (localStorage.getItem(consentKey) || document.getElementById("cookie-banner")) return;
    const banner = document.createElement("aside"); banner.id = "cookie-banner"; banner.className = "cookie-banner"; banner.setAttribute("aria-label", "Cookie preferences");
    banner.innerHTML = `<div><strong>Your privacy matters</strong><p>We use optional analytics to understand site usage and improve our services. Essential site features work without them.</p></div><div class="cookie-actions"><button class="button button-small" data-consent="accepted">Accept analytics</button><button class="cookie-decline" data-consent="declined">Decline</button><a href="cookies.html">Cookie policy</a></div>`;
    document.body.appendChild(banner);
    banner.querySelectorAll("[data-consent]").forEach((button) => button.addEventListener("click", () => saveConsent(button.dataset.consent)));
  }
  loadCloudflare(); if (localStorage.getItem(consentKey) === "accepted") loadConsentAnalytics();
  window.addEventListener("DOMContentLoaded", showBanner); window.NexusAnalytics = { track, saveConsent, showBanner };
})();
