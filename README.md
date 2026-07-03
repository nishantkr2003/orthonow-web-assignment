# Namoza Developer Assignment

Developer assignment submission for Namoza — client: OrthoNow, a chain of 9 orthopaedic clinics across Bengaluru, Hyderabad, and Chennai. Three deliverables: a GTM event schema, a consultation landing page, and a CRM integration design.

## Candidate

- Name: Nishant Kumar

## Assignment Overview

| Task | Description | Status |
|---|---|---|
| Task 1 | GTM event schema, booking funnel drop-off tracking, Google Ads conversion recommendation | Complete — see `task-1/` |
| Task 2 | Single-file consultation landing page with a `consultation_form_submitted` dataLayer push | Complete — see `task-2/index.html`. Live at [nishantkr2003.github.io/orthonow-web-assignment/task-2/index.html](https://nishantkr2003.github.io/orthonow-web-assignment/task-2/index.html), scores 100/100/100/100 on the official PageSpeed Insights Mobile test |
| Task 3 | HubSpot/WhatsApp/Google Ads integration design (written, 300–400 words) | Complete — see `task-3/integration-design.md` |

## Repository Structure

```
namoza-developer-assignment/
│
├── README.md
├── .gitignore
├── LICENSE
│
├── docs/                       # Short overview of each task
│   ├── task-1.md
│   ├── task-2.md
│   └── task-3.md
│
├── task-1/                     # GTM event schema
│   ├── README.md
│   ├── event-schema.md         # Event Name / Trigger Type / Key Parameters / GA4 Report
│   ├── booking-funnel.md       # Which event fires at each booking step, and why
│   ├── datalayer-json.md       # Actual dataLayer.push() JSON for every booking step
│   ├── ga4-funnel.md           # GA4 Funnel Exploration configuration
│   └── google-ads-conversion.md
│
├── task-2/
│   └── index.html              # THE SUBMISSION — single self-contained file, no external assets
│
├── task-3/
│   └── integration-design.md   # Written answer, 300–400 words
│
└── screenshots/                 # PageSpeed + browser console screenshots for the Loom/submission
    └── pagespeed-mobile-100.png
```

## Tech Stack

- HTML5, CSS3, Vanilla JavaScript — no frameworks, no build tools
- Google Tag Manager, Google Analytics 4, Google Ads (design only — no live account exists for this exercise)

## How to Run

**Task 2 (the graded submission)** is one file with everything inline — open `task-2/index.html` directly in a browser, no server required.

```
task-2/index.html
```

To check the dataLayer push live: open the browser console, fill in the form, submit, then run `window.dataLayer` — the `consultation_form_submitted` event should be the last entry.

**Task 1 and Task 3** are Markdown, readable directly on GitHub.

## Folder Explanation

- **task-1/** — the full GTM/GA4 event schema, funnel design, and Google Ads recommendation
- **task-2/index.html** — the actual graded landing page: single file, 2-field form, one trust element, one CTA
- **task-3/** — the CRM integration design, answered directly against the brief's three questions

