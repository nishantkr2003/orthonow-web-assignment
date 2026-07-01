# Namoza Developer Assignment

Developer assignment submission for Namoza, covering analytics event tracking design, a healthcare landing page, and a CRM integration design.

## Candidate

- Name: Nishant Kumar

## Project Overview

This repository holds three related pieces of work built around a healthcare booking flow:

1. A Google Tag Manager / GA4 event schema for tracking the booking funnel
2. A responsive healthcare landing page with a booking form, optimized for performance
3. A design for integrating booking form submissions with a CRM

## Assignment Overview

| Task | Description |
|---|---|
| Task 1 | Google Tag Manager event schema and GA4 funnel design |
| Task 2 | Healthcare landing page (HTML/CSS/JS) with PageSpeed optimization |
| Task 3 | CRM integration design for booking form submissions |

## Repository Structure

```
namoza-developer-assignment/
│
├── README.md
├── .gitignore
├── LICENSE
│
├── docs/                  # Short overview of each task
│   ├── task-1.md
│   ├── task-2.md
│   └── task-3.md
│
├── task-1/                # GTM event schema
│   ├── README.md
│   ├── event-schema.md
│   ├── booking-funnel.md
│   ├── datalayer-json.md
│   ├── ga4-funnel.md
│   └── assets/
│
├── task-2/                # Healthcare landing page
│   ├── index.html
│   ├── css/style.css
│   ├── js/script.js
│   ├── assets/
│   └── pagespeed/         # PageSpeed reports/screenshots
│
├── task-3/                # CRM integration design
│   └── integration-design.md
│
└── screenshots/           # General screenshots for the submission
```

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Google Tag Manager
- Google Analytics 4
- Markdown (for documentation)

No frameworks or build tools are used — everything is plain HTML/CSS/JS by design.

## How to Run

Task 2 is a static site, so no build step is required.

1. Clone the repository
2. Open `task-2/index.html` directly in a browser, or serve it locally, for example:
   ```bash
   npx serve task-2
   ```

The documentation in `task-1/` and `task-3/` is plain Markdown and can be read directly on GitHub.

## Folder Explanation

- **docs/** — one short overview file per task, linking out to the full details
- **task-1/** — all GTM/GA4 event tracking documentation
- **task-2/** — the actual landing page code (HTML, CSS, JS) and PageSpeed results
- **task-3/** — write-up of how the booking form connects to a CRM
- **screenshots/** — supporting screenshots referenced across the docs

## Future Development Plan

- [ ] Finalize GTM event schema
- [ ] Design booking funnel in detail
- [ ] Add sample dataLayer JSON for every event
- [ ] Build out the landing page markup and styling
- [ ] Wire up the booking form with JavaScript
- [ ] Optimize the landing page for mobile performance
- [ ] Capture PageSpeed Insights screenshot
- [ ] Write the CRM integration design
- [ ] Record a Loom walkthrough of the submission
