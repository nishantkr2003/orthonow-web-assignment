# CRM Integration Design

This document contains the CRM integration design for Task 3.

## Goal

Send booking submissions from the landing page (Task 2) into a CRM system so leads are captured automatically.

## Plan

- Booking form submits data to a CRM endpoint (e.g. via webhook or API call)
- Map form fields to CRM lead fields (name, phone, service selected, preferred time)
- Handle success and failure states on the form so the user gets feedback either way

Full field mapping and sequence diagram will be added here once the CRM platform is confirmed.
