# Task 1 — Google Tag Manager Event Schema

This folder contains the event tracking design for the booking flow, built for Google Tag Manager (GTM) and Google Analytics 4 (GA4).

## Contents

- [event-schema.md](./event-schema.md) — the complete event schema table (Event Name, Trigger Type, Key Parameters, GA4 Report/Audience), plus the naming convention and the "who writes the dataLayer push" answer
- [booking-funnel.md](./booking-funnel.md) — which event fires at each booking step, which GTM trigger fires it, and why
- [datalayer-json.md](./datalayer-json.md) — the actual `dataLayer.push()` JSON for every booking form step, not pseudocode
- [ga4-funnel.md](./ga4-funnel.md) — the GA4 Funnel Exploration configuration (steps, parameter conditions, closed funnel type) and how to read the drop-off
- [google-ads-conversion.md](./google-ads-conversion.md) — the one conversion recommended for Google Ads import, and why that one over the others

## Goal

Track every interaction OrthoNow's site needs tracked before paid campaigns go live: the 3-step booking form, Call Now buttons, the WhatsApp widget, the gated Patient Guide download, the 9 clinic location pages, and blog scroll depth — in a schema that scales past 9 clinics without adding new events.
