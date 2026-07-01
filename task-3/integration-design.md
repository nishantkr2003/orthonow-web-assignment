# Task 3 — CRM Integration Design

**Scenario:** patient submits the consultation form → HubSpot contact created/updated → WhatsApp confirmation within 2 minutes (via Karix) → Google Ads conversion fires.

## Architecture

The form posts to a single lightweight serverless function (Cloud Function/Lambda), not directly to HubSpot from the browser. That function does three things in sequence: looks up the contact in HubSpot by **phone number** via the Contacts Search API, creates or updates it (Name, Phone, Clinic Preference, Source = "Google Ads - Consultation Landing Page", Lead Status = "New Enquiry"), then calls Karix's WhatsApp API to send the confirmation. The browser fires the Google Ads conversion (`consultation_form_submitted`) client-side immediately on submit — it doesn't wait on the backend chain, since Ads attribution only needs the click, not the CRM outcome.

I'd use a **direct API call**, not a native HubSpot embed and not Zapier/Make. A native embed can't give the phone-based dedup logic below, and doesn't touch WhatsApp or Ads at all on its own. Zapier/Make adds a third-party relay step with its own latency and rate limits sitting directly inside a hard 2-minute SLA — acceptable for a low-stakes internal workflow, not for a patient-facing confirmation.

**The trap:** HubSpot's default deduplication key is **email**, not phone. This form never collects email, so relying on native form-submission dedup would create a duplicate contact on every repeat visit. The integration layer has to do its own phone-based search-then-create/update explicitly. If two patients submit with the same phone number but different names (a shared family phone is common in Indian healthcare lead gen), my setup treats it as one contact, updates the name field, and flags it for manual review rather than silently overwriting or duplicating.

**Biggest failure point:** the synchronous chain from form submit to WhatsApp send. If HubSpot's API is slow, it eats into the 2-minute budget before WhatsApp even gets called. Fallback: the function writes to a durable queue and returns success to the user immediately; a worker processes HubSpot and WhatsApp asynchronously with retries and backoff.

**Monitoring the SLA:** track "time from submit to WhatsApp sent" per lead, alert if any single lead exceeds ~90 seconds (buffer before the 2-minute breach), and route failed sends to a dead-letter queue with a human alert — Karix rate limits, template approval issues, and malformed Indian phone numbers (missing +91) are the likely real-world causes.
