# GTM Event Schema — OrthoNow

Covers every interaction listed in the brief: the 3-step booking form, Call Now buttons, the WhatsApp widget, the gated Patient Guide download, the 9 clinic location pages, and blog scroll depth.

## Naming convention

- Event and parameter names are `snake_case`.
- Event names follow `<object>_<what happened>` — e.g. `booking_step_completed`, not `step_completed_booking`.
- No event name encodes a specific clinic, specialty, or campaign — those are always parameters (`clinic_id`, `specialty`), never baked into the event name. This is what lets the schema scale from 9 clinics to more without adding new events.

## Schema

| Event Name | Trigger Type | Key Parameters | GA4 Report / Audience |
|---|---|---|---|
| `page_view` | Page View (GA4 auto-collected; `page_type` added via GA4 Config tag "Fields to Set") | `page_type`, `page_title`, `page_path` | Landing Page report; base audience for all segmentation by page type |
| `call_click` | Custom Event (frontend `dataLayer.push()` on click — see note below) | `button_location`, `link_destination`, `page_type` | Conversion report (secondary); "high-intent phone lead" audience for remarketing/lookalikes |
| `whatsapp_click` | Custom Event (frontend push) | `button_location`, `link_destination`, `page_type` | Conversion report (secondary); same audience use as `call_click`, weaker signal |
| `guide_lead_submitted` | Custom Event, fires on successful submission of the name+phone gate form (not on click) | `page_type`, `page_path`, `button_location` | Conversion report (secondary); "warm content lead" audience |
| `guide_download` | Link Click (static PDF, stable URL — no frontend logic needed) | `page_type`, `link_destination`, `button_location` | Content report; engagement only, not a conversion |
| `book_appointment_click` | Custom Event (frontend push) | `button_location`, `link_destination`, `page_type` | Funnel Exploration entry step; Landing Page report for CTA placement |
| `booking_started` | Custom Event, fires when the booking form actually renders | `page_type`, `page_path` | Funnel Exploration — isolates "opened the form" from "clicked but nothing loaded" |
| `booking_step_completed` | Custom Event, fires per step advance, differentiated by `step_number` | `step_number`, `step_name`, `clinic_id` | Funnel Exploration steps 1–3 (via `step_number` condition); Engagement report for drop-off |
| `booking_completed` | Custom Event, fires only after backend confirms success | `clinic_id`, `specialty` | Conversion report (primary key event); Google Ads primary conversion — see `google-ads-conversion.md` |
| `booking_failed` | Custom Event, fires on validation or server error | `step_number`, `error_type`, `validation_field` | Technical Exploration filtered by `error_type` — not a business report |
| `content_scroll` | GTM native Scroll Depth Trigger (25/50/75/90%) — **not a manual dataLayer push** | `page_type`, `page_path`, `scroll_depth` | Engagement report; "read [topic]" audience for condition-specific retargeting |

Every event above meets the minimum-3-parameter requirement; `page_type`/`page_title`/`page_path` are set once on the GA4 Configuration tag and attach to every event automatically, so they don't need re-declaring per tag.

## Why some events use Custom Event and one uses Link Click

`call_click`, `whatsapp_click`, `book_appointment_click`, and the booking-form events all use a **Custom Event trigger**, matching a `dataLayer.push()` fired by the frontend. GTM cannot reliably detect these from CSS selectors alone — button markup changes over time, and a CSS-selector-based Click Trigger breaks silently the moment a class name changes.

`guide_download` is the one exception: it's a static PDF link with a stable URL, so a Link Click trigger filtered on that URL is actually more durable here than requiring a frontend code change for something this simple.

## Who writes the dataLayer push

**The frontend developer writes every `dataLayer.push()`. GTM only listens for the event names already agreed in this schema — it does not detect multi-step form behaviour on its own.**

To brief a frontend dev on Step 2 specifically: they add one line inside whatever function already runs when the user clicks "Next" on the name/phone/date step —

```js
window.dataLayer.push({
  event: 'booking_step_completed',
  step_number: 2,
  step_name: 'patient_details',
  clinic_id: clinicId // carried forward from step 1, not re-selected
});
```

That's the entire ask: fire this exact object, with this exact event name, at the moment the user successfully advances past step 2 — not on page load, not on a failed validation attempt. GTM's job starts after that push happens; it never runs the validation or decides when step 2 is "done." If a developer says GTM handles this automatically, they haven't built a funnel tracking setup before — GTM has no visibility into form state unless the page tells it.
