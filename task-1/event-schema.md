# Event Schema

This document contains the GTM event schema for Task 1.

## Overview

Each event pushed to the `dataLayer` follows a consistent naming convention and parameter structure so it can be picked up by GTM triggers and forwarded to GA4 without extra mapping work.

## Naming Convention

- Event names are lowercase, snake_case (e.g. `booking_started`)
- Parameters are also snake_case

## Events (draft list)

| Event Name | Trigger | Key Parameters |
|---|---|---|
| `page_view` | On every page load | `page_path`, `page_title` |
| `service_selected` | User selects a service on the landing page | `service_name`, `service_price` |
| `booking_started` | User opens the booking form | `service_name` |
| `booking_submitted` | User submits the booking form | `service_name`, `booking_id` |
| `booking_confirmed` | Confirmation screen is shown | `booking_id` |

This table will be filled in with final parameter names once the landing page (Task 2) is built, so the event schema matches the real DOM structure.
