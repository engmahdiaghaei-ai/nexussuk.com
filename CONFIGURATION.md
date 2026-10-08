# Nexus website configuration

## Analytics and booking

Edit `assets/config.js` and enter only the IDs you want to use:

```js
window.NEXUS_CONFIG = {
  cloudflareAnalyticsToken: "YOUR_TOKEN",
  ga4MeasurementId: "G-XXXXXXXXXX",
  clarityProjectId: "YOUR_CLARITY_ID",
  bookingUrl: "https://your-booking-page.example"
};
```

- Cloudflare Web Analytics loads when its token is present.
- GA4 and Microsoft Clarity load only after the visitor accepts analytics.
- If `bookingUrl` is empty, the discovery-call link remains on the enquiry form.
- Conversion events include lead submissions, product, GitHub, LinkedIn, WhatsApp, discovery-call and email-copy interactions.

## Formspree auto-response

The enquiry form already posts to `https://formspree.io/f/mqpepwbk` and includes the visitor email, subject, source, interest and preferred next step.

In the Formspree dashboard:

1. Open the form and confirm the destination inbox.
2. Enable an autoresponse/workflow using the submitted `email` field.
3. Write a short acknowledgement and expected response time.
4. Test with an address outside the company domain.
5. Confirm spam filtering and notification delivery.

## Google Business Profile preparation

Before creating or completing the profile, prepare:

- Exact legal business name and public trading name.
- Companies House number and registered office details.
- Whether customers visit the address or Nexus operates as a service-area business.
- Primary and secondary business categories.
- Public opening/contact hours.
- Service areas actually covered.
- Logo, social card and founder/team photographs.
- A concise business description matching the website.
- Evidence required by Google for verification.

Keep the website, Companies House record and Google profile details consistent. Do not publish a residential address unless it is appropriate and intended for customer visits.

## Deployment

Upload all HTML files and the complete `assets` folder. GitHub Pages preserves the folder structure; the browser needs it for CSS, JavaScript and images.
