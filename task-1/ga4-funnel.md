# GA4 Funnel Exploration — Booking Funnel

## Funnel type

**Closed funnel**, not open. A closed funnel requires users to complete each step in order to count toward the next — which is exactly what "step-level drop-off" needs. An open funnel would let someone show up at Step 3 without ever completing Step 1, which isn't a meaningful reading of this particular funnel.

## Step configuration

| Step | Event | Condition | Why |
|---|---|---|---|
| 1 | `page_view` | none | Baseline traffic |
| 2 | `book_appointment_click` | none | Event name is already specific — no filter needed |
| 3 | `booking_started` | none | Already specific to this one moment |
| 4 | `booking_step_completed` | `step_number = 1` | Same event as steps 5–6, isolated by parameter |
| 5 | `booking_step_completed` | `step_number = 2` | — |
| 6 | `booking_step_completed` | `step_number = 3` | — |
| 7 | `booking_completed` | none | Terminal event |

Steps 4–6 are where this actually requires care: in the GA4 Explore step editor, each of those three steps needs the `step_number` condition added individually. GA4's UI supports this natively — a funnel step is "an event, optionally scoped by a parameter" — so this isn't a workaround, it's the intended way to model a repeated-structure funnel.

## Example output and how to read it

```
Landing Page               1000
Book Appointment Click      650    (-35%)
Booking Started             600    (-8%)
Step 1                      520    (-13%)
Step 2                      430    (-17%)
Step 3                      370    (-14%)
Booking Completed           310    (-16%)
```

(Illustrative numbers.) The biggest *relative* drop is usually Landing Page → Click, and that's normal — most visitors are browsing, not all of them intend to book today. The number that actually matters is the drop *inside* the form itself, after someone has already shown intent — here, Step 1 → Step 2 (-17%) is the one worth investigating first, not the biggest number on the chart.

## Reading drop-off by stage

- **Click → Started**: should be small. A meaningful drop here is a technical bug (the form failed to render), not a UX issue — nothing about clicking a button and then seeing nothing should be a "choice" a user is making.
- **Started → Step 1**: friction in the clinic/specialty picker — too many options, unclear specialty names.
- **Step 1 → Step 2**: typically the highest-friction step in any lead form — contact details, phone number formatting, hesitation about sharing personal info this early.
- **Step 3 → Completed**: should be small, since clicking "Confirm" isn't optional. A drop here maps directly to `booking_failed` — check its `error_type` breakdown before assuming it's a UX problem; it's more likely a bug.
