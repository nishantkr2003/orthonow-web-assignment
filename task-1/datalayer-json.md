# dataLayer JSON — Booking Form Steps

Actual payloads, not pseudocode. These are pushed by the frontend at the exact moment described — never on page load, never on a click that doesn't actually complete the action.

## Step 1 — Clinic & specialty selected, user clicks "Next"

```json
{
  "event": "booking_step_completed",
  "step_number": 1,
  "step_name": "clinic_specialty",
  "clinic_id": "blr_indiranagar",
  "specialty": "orthopaedic_knee"
}
```

## Step 2 — Name, phone, preferred date filled, user clicks "Next"

```json
{
  "event": "booking_step_completed",
  "step_number": 2,
  "step_name": "patient_details",
  "clinic_id": "blr_indiranagar",
  "specialty": "orthopaedic_knee"
}
```

Note what's deliberately absent: no name, phone, or date value. This step collects PII on the form, but the event only records that the step was passed — never what was typed into it. `clinic_id`/`specialty` are carried forward from Step 1, not re-collected, so this event is self-contained and analyzable in GA4 without needing to join back to the Step 1 event.

## Step 3 — Review screen, user clicks "Confirm Booking"

```json
{
  "event": "booking_step_completed",
  "step_number": 3,
  "step_name": "review_confirmation",
  "clinic_id": "blr_indiranagar",
  "specialty": "orthopaedic_knee"
}
```

This fires the moment the user clicks "Confirm" — it triggers the API call, it does not mean the booking succeeded yet.

## Booking confirmed — backend returns success

```json
{
  "event": "booking_completed",
  "clinic_id": "blr_indiranagar",
  "specialty": "orthopaedic_knee"
}
```

## Booking failed — validation error (client-side, before the API call)

```json
{
  "event": "booking_failed",
  "step_number": 2,
  "error_type": "validation_error",
  "validation_field": "phone_number"
}
```

## Booking failed — server error (after the API call)

```json
{
  "event": "booking_failed",
  "step_number": 3,
  "error_type": "server_error"
}
```

## Where each event actually gets fired from

| Event | Fires inside |
|---|---|
| `booking_step_completed` (step 1/2/3) | The "Next"/"Confirm" button's click handler, after that step's own validation passes |
| `booking_completed` | The `.then()` of the booking API call, after a success response |
| `booking_failed` (validation) | The field validation function, before the API is ever called |
| `booking_failed` (server error) | The `.catch()` of the booking API call |

All of this is frontend code. GTM's only job is a Custom Event trigger matching each `event` name above — it never generates these pushes itself.
