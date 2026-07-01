# Google Ads Conversion Recommendation

## Recommendation: import `booking_completed` as the Primary conversion

Not `call_click`, not `whatsapp_click`, not `guide_lead_submitted` — those stay in GA4 as Secondary/Observation-only signals, described below.

## Why this one over the others

**It's the only event tied to a confirmed backend outcome, not a UI interaction.** `booking_completed` fires only after the appointment booking system returns a success response — never on a button click, never on a form submission attempt. That makes it the most reliable signal available: it can't be triggered by an accidental tap, a partially filled form, or a failed request, and it directly represents the actual business goal — a booked appointment — not an action that might lead to one.

**Call and WhatsApp clicks are real signals, but they're unconfirmed intent, not outcomes.** GA4 has no way to see whether a phone call was answered or led to a booking, or whether a WhatsApp message was ever sent after the click. Importing either as the Primary conversion risks Google Ads' Smart Bidding optimizing toward "people who tap phone numbers" rather than "people who become patients" — a subtly different, lower-quality audience that would look fine on a clicks dashboard while actual bookings stagnate.

**The Patient Guide download is a content-engagement action, not a booking signal**, and importing it into Ads bidding would be the worst version of this mistake — it's an even lower-commitment action than a phone click, and Smart Bidding would end up optimizing toward people who like downloading PDFs.

## What Smart Bidding actually does with the wrong signal

Google Ads trusts whatever conversion action it's told to optimize toward — it has no independent way to know a click is worth less than a completed booking unless the account structure tells it so. Importing the wrong one doesn't just produce bad reporting; it actively steers real ad spend toward the wrong audience, and the algorithm compounds the mistake over time by learning from its own biased signal.

## Staged plan for the other signals

- `call_click` / `whatsapp_click` — mark as Secondary conversions in Google Ads, imported as **Observation Only** at first (visible in reporting, not used for bidding) until enough volume exists to confirm they aren't dominated by accidental taps. Promote to bidding-eligible only after that's checked.
- `guide_lead_submitted` — stays in GA4 reporting only. It's genuinely useful for measuring content-marketing performance, but there's no reporting value gained by pushing it into Ads, and real risk if someone later flips it to count toward bidding without understanding what it actually represents.
