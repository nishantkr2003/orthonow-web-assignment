# Booking Funnel — Drop-off Tracking

## The funnel

```
Landing Page Viewed
   ↓ page_view
Book Appointment Clicked
   ↓ book_appointment_click
Booking Form Opened
   ↓ booking_started
Step 1 Completed (clinic + specialty)
   ↓ booking_step_completed (step_number: 1)
Step 2 Completed (name/phone/date)
   ↓ booking_step_completed (step_number: 2)
Step 3 Completed (confirm clicked)
   ↓ booking_step_completed (step_number: 3)
   ↓
Backend responds
   ↓                              ↓
Success                        Failure
   ↓                              ↓
booking_completed              booking_failed
```

## What fires at each step, and why

- **`book_appointment_click`** — fires on the click itself, regardless of what happens next. Captures top-of-funnel intent separately from whether the form ever actually opened.
- **`booking_started`** — fires when the form has actually rendered, not on the click. This separates "clicked but the form failed to load" (a bug) from "form opened but the user left immediately" (a UX problem) — two different failure modes that would otherwise look identical.
- **`booking_step_completed`** — one event, reused for all three steps, differentiated by the `step_number` parameter. This is the one design decision worth explaining: it would be possible to create `booking_step1_completed`, `booking_step2_completed`, `booking_step3_completed` as three separate events instead, but that means three GTM triggers and three GA4 event configurations for what is structurally the same action. Using one event with a parameter is also the shape GA4's own Funnel Exploration expects — each step in an Exploration can be an event *plus a parameter condition*, so this isn't just a tidier GTM container, it maps directly onto how the funnel gets built in GA4 (see `ga4-funnel.md`).
- **`booking_completed`** — fires only after the backend confirms success, never on the "Confirm" click. If it fired on click instead, failed submissions would get counted as completed bookings, inflating the one metric that's supposed to represent real business outcomes.
- **`booking_failed`** — fires on either a client-side validation error or a backend error response, tagged with `error_type` so the two are distinguishable in reporting. Without this, a drop in Step 3 completions looks identical whether it's caused by a broken form field or a server outage — two completely different fixes.

## GTM trigger for each step

Every step above uses a **Custom Event trigger** in GTM, matching the `event` name in the payload the frontend pushes (see `datalayer-json.md` for the actual JSON). GTM is never given a CSS selector to watch — it only ever listens for a named event that the frontend explicitly pushes when that step is genuinely complete.

## The one real risk in this design

Because Steps 1–3 all share the `booking_step_completed` event name, whoever builds the GA4 Funnel Exploration has to remember to add the `step_number` condition on *each* of the three steps individually. Forgetting it on even one step doesn't throw an error — it just silently counts every step's traffic at that stage, producing a plausible-looking but wrong number. This is the one thing worth double-checking manually before trusting the funnel's output.
