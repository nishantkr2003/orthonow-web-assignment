# Namoza Developer Assignment

Developer assignment submission for Namoza — client: OrthoNow, a chain of 9 orthopaedic clinics across Bengaluru, Hyderabad, and Chennai. Three deliverables: a GTM event schema, a consultation landing page, and a CRM integration design.

## Candidate

- Name: Nishant Kumar

## Assignment Overview

| Task | Description | Status |
|---|---|---|
| Task 1 | GTM event schema, booking funnel drop-off tracking, Google Ads conversion recommendation | Complete — see `task-1/` |
| Task 2 | Single-file consultation landing page with a `consultation_form_submitted` dataLayer push | Complete — see `task-2/index.html`. PageSpeed screenshot still pending (needs a public URL to test against) |
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
│   ├── index.html              # THE SUBMISSION — single self-contained file, no external assets
│   ├── pagespeed/               # PageSpeed Insights screenshot goes here
│   └── extended-demo/           # A broader multi-page OrthoNow site built during exploration -
│       ├── index.html           # not the graded artifact, kept for reference
│       ├── css/style.css
│       ├── js/script.js
│       └── assets/
│
├── task-3/
│   └── integration-design.md   # Written answer, 300–400 words
│
└── screenshots/                 # PageSpeed + browser console screenshots for the Loom/submission
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
- **task-2/extended-demo/** — a larger, multi-section OrthoNow site (booking modal, dark theme, full page) built while exploring the problem before the exact brief was confirmed. Left in the repo as supporting work, not the submission.
- **task-3/** — the CRM integration design, answered directly against the brief's three questions

## Remaining Before Final Submission

- [ ] Host `task-2/index.html` somewhere public (GitHub Pages is fastest) and run PageSpeed Insights Mobile against it — target 90+, screenshot into `task-2/pagespeed/`
- [ ] Open the page in a real browser and confirm `consultation_form_submitted` fires in `window.dataLayer` on submit, not on load
- [ ] Record the Loom (max 8 min): GTM schema decisions (2 min) → live dataLayer demo in console (3 min) → integration architecture answer (3 min)
- [ ] Commit and push this repository, share access with himanshu@namoza.com
- [ ] Email the repo link + Loom link to naman@namoza.com — subject: "Developer Assignment - [Your Name]"
