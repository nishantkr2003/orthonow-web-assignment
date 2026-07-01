// OrthoNow landing page
// This file loads with `defer`, so the DOM is already fully parsed by the
// time any of this runs - no DOMContentLoaded listener is needed.

// GTM initializes window.dataLayer itself, but this line is a safe,
// defensive fallback in case the GTM snippet loads after this script.
window.dataLayer = window.dataLayer || [];

(function () {
  'use strict';

  /* ==========================================================================
     DOM References

     Only elements used by more than one section live here. Anything used
     by a single feature is queried locally inside that feature's own
     function, right where it's needed.
     ========================================================================== */

  const header = select('.site-header');
  const bookingModal = select('#booking-modal');
  const bookingForm = select('#booking-form');

  let lastFocusedElement = null;

  /* ==========================================================================
     Utility Functions
     ========================================================================== */

  function select(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function selectAll(selector, scope) {
    return Array.from((scope || document).querySelectorAll(selector));
  }

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function pushAnalyticsEvent(eventName, eventData) {
    window.dataLayer.push(
      Object.assign({ event: eventName }, eventData || {})
    );
  }

  // Figures out which part of the page a booking/call/whatsapp click came
  // from, since that's genuinely useful analytics context (button_location)
  // even though the buttons themselves don't carry a data attribute for it.
  function getButtonLocation(trigger) {
    if (!trigger) return 'unknown';
    if (trigger.closest('.site-header')) return 'header';
    if (trigger.closest('.hero')) return 'hero';
    if (trigger.closest('.service-card')) return 'services';
    if (trigger.closest('.clinic-card')) return 'locations';
    if (trigger.closest('.booking-cta')) return 'booking_cta';
    if (trigger.closest('.contact')) return 'contact';
    return 'unknown';
  }

  // No debounce()/throttle() helper here on purpose - every scroll-driven
  // feature below (sticky header, back to top, active nav, fade-ins) uses
  // IntersectionObserver instead of a raw scroll listener, so there's no
  // scroll-position math left that would actually need one.

  /* ==========================================================================
     Navigation
     ========================================================================== */

  function initMobileNav() {
    const toggle = select('.nav-toggle');
    const navList = select('#primary-nav-list');
    if (!toggle || !navList) return;

    toggle.addEventListener('click', function () {
      const isOpen = navList.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    navList.addEventListener('click', function (event) {
      if (event.target.tagName === 'A') {
        closeMobileNav();
      }
    });

    document.addEventListener('click', function (event) {
      const isOpen = navList.classList.contains('is-open');
      const clickedInside = navList.contains(event.target) || toggle.contains(event.target);
      if (isOpen && !clickedInside) {
        closeMobileNav();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && navList.classList.contains('is-open')) {
        closeMobileNav();
        toggle.focus();
      }
    });
  }

  function closeMobileNav() {
    const toggle = select('.nav-toggle');
    const navList = select('#primary-nav-list');
    if (!toggle || !navList) return;

    navList.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  /* ==========================================================================
     Theme Toggle

     The initial theme is already set by the inline script in <head>,
     before this file even runs - that has to happen before first paint,
     which is too early for a deferred script. This just wires up the
     button and keeps localStorage in sync with future clicks.
     ========================================================================== */

  function initThemeToggle() {
    const toggle = select('[data-theme-toggle]');
    if (!toggle) return;

    updateToggleState(toggle);

    toggle.addEventListener('click', function () {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      setTheme(isDark ? 'light' : 'dark');
      updateToggleState(toggle);
    });
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      // Storage unavailable (private browsing, etc.) - the theme still
      // applies for this session, it just won't be remembered next time.
    }
  }

  function updateToggleState(toggle) {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    toggle.setAttribute('aria-pressed', String(isDark));
  }

  /* ==========================================================================
     Sticky Header
     ========================================================================== */

  function initStickyHeader() {
    const heroSection = select('.hero');
    if (!header || !heroSection) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        header.classList.toggle('is-scrolled', !entry.isIntersecting);
      });
    });

    observer.observe(heroSection);
  }

  /* ==========================================================================
     Smooth Scroll
     ========================================================================== */

  function initSmoothScroll() {
    const anchorLinks = selectAll('a[href^="#"]');
    if (!anchorLinks.length) return;

    anchorLinks.forEach(function (link) {
      link.addEventListener('click', function (event) {
        const targetId = link.getAttribute('href').slice(1);
        const target = targetId ? select('#' + targetId) : null;
        if (!target) return;

        event.preventDefault();

        const headerHeight = header ? header.offsetHeight : 0;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

        window.scrollTo({
          top: targetTop,
          behavior: prefersReducedMotion() ? 'auto' : 'smooth'
        });

        closeMobileNav();
      });
    });
  }

  /* ==========================================================================
     Active Navigation
     ========================================================================== */

  function initActiveNavHighlight() {
    const sections = selectAll('main > section');
    const navLinks = selectAll('.primary-nav-list a');
    if (!sections.length || !navLinks.length) return;

    const linkForSection = new Map();

    sections.forEach(function (section) {
      const headingId = section.getAttribute('aria-labelledby');
      const matchingLink = navLinks.find(function (link) {
        return link.getAttribute('href') === '#' + headingId;
      });
      if (matchingLink) {
        linkForSection.set(section, matchingLink);
      }
    });

    if (!linkForSection.size) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const activeLink = linkForSection.get(entry.target);
          if (!activeLink) return;
          navLinks.forEach(function (link) {
            link.classList.remove('is-active');
          });
          activeLink.classList.add('is-active');
        });
      },
      { rootMargin: '-40% 0px -50% 0px' }
    );

    linkForSection.forEach(function (_, section) {
      observer.observe(section);
    });
  }

  /* ==========================================================================
     FAQ

     <details>/<summary> already provides keyboard support and the
     open/closed state to screen readers natively - nothing extra needed
     for either. The only real behaviour to add is closing every other
     item when one opens.
     ========================================================================== */

  function initFaqAccordion() {
    const faqItems = selectAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(function (item) {
      item.addEventListener('toggle', function () {
        if (!item.open) return;
        faqItems.forEach(function (otherItem) {
          if (otherItem !== item) {
            otherItem.open = false;
          }
        });
      });
    });
  }

  /* ==========================================================================
     Booking Modal
     ========================================================================== */

  function initBookingModalTriggers() {
    document.addEventListener('click', function (event) {
      const opener = event.target.closest('[data-open-booking]');
      if (opener) {
        event.preventDefault();
        openBookingModal(opener);
        return;
      }

      const closer = event.target.closest('[data-close-booking]');
      if (closer && bookingModal) {
        bookingModal.close();
      }
    });
  }

  function initBookingModalBackdropClose() {
    if (!bookingModal) return;

    bookingModal.addEventListener('click', function (event) {
      if (event.target === bookingModal) {
        bookingModal.close();
      }
    });

    bookingModal.addEventListener('close', function () {
      if (lastFocusedElement) {
        lastFocusedElement.focus();
      }
    });
  }

  function openBookingModal(trigger) {
    if (!bookingModal) return;

    lastFocusedElement = trigger || document.activeElement;
    resetBookingSteps();

    const clinicSelect = select('#clinic-select');
    if (clinicSelect && trigger && trigger.dataset.clinicId) {
      clinicSelect.value = trigger.dataset.clinicId;
    }

    const specialtySelect = select('#specialty-select');
    if (specialtySelect && trigger && trigger.dataset.specialty) {
      specialtySelect.value = trigger.dataset.specialty;
    }

    if (typeof bookingModal.showModal === 'function') {
      bookingModal.showModal();
    } else {
      // Fallback for a browser without <dialog> support - the form is
      // still usable, just not modal.
      bookingModal.setAttribute('open', '');
    }

    pushAnalyticsEvent('book_appointment_click', {
      button_location: getButtonLocation(trigger),
      link_destination: 'booking_form'
    });

    pushAnalyticsEvent('booking_started', {});
  }

  function resetBookingSteps() {
    if (!bookingForm || !bookingModal) return;

    selectAll('.form-step', bookingForm).forEach(function (step, index) {
      step.hidden = index !== 0;
    });

    selectAll('input, select', bookingForm).forEach(clearFieldError);

    bookingForm.reset();
    bookingForm.hidden = false;

    const successEl = select('.booking-success', bookingModal);
    if (successEl) successEl.hidden = true;

    const submitError = select('.booking-submit-error', bookingModal);
    if (submitError) submitError.remove();
  }

  /* ==========================================================================
     Form Validation
     ========================================================================== */

  const STEP_NAMES = {
    1: 'clinic_specialty',
    2: 'patient_details',
    3: 'review_confirmation'
  };

  function initBookingForm() {
    if (!bookingForm) return;

    selectAll('[data-step-next]', bookingForm).forEach(function (button) {
      button.addEventListener('click', function () {
        goToNextStep(button);
      });
    });

    selectAll('[data-step-back]', bookingForm).forEach(function (button) {
      button.addEventListener('click', function () {
        goToPreviousStep(button);
      });
    });

    bookingForm.addEventListener('submit', function (event) {
      event.preventDefault();
      submitBooking();
    });
  }

  function goToNextStep(button) {
    const currentStep = button.closest('.form-step');
    if (!currentStep || !validateStep(currentStep)) return;

    const stepNumber = Number(currentStep.dataset.step);
    const nextStep = select('.form-step[data-step="' + (stepNumber + 1) + '"]');
    if (!nextStep) return;

    if (nextStep.dataset.step === '3') {
      fillBookingSummary();
    }

    currentStep.hidden = true;
    nextStep.hidden = false;
    moveFocusToStep(nextStep);

    pushAnalyticsEvent('booking_step_completed', {
      step_number: stepNumber,
      step_name: STEP_NAMES[stepNumber],
      clinic_id: select('#clinic-select').value,
      specialty: select('#specialty-select').value
    });
  }

  function goToPreviousStep(button) {
    // Going back isn't tracked - there's no event for it in the schema,
    // and no business reason to add one just for this.
    const currentStep = button.closest('.form-step');
    if (!currentStep) return;

    const stepNumber = Number(currentStep.dataset.step);
    const previousStep = select('.form-step[data-step="' + (stepNumber - 1) + '"]');
    if (!previousStep) return;

    currentStep.hidden = true;
    previousStep.hidden = false;
    moveFocusToStep(previousStep);
  }

  function moveFocusToStep(step) {
    const heading = select('h3', step);
    if (!heading) return;
    heading.setAttribute('tabindex', '-1');
    heading.focus();
  }

  function fillBookingSummary() {
    const clinicSelect = select('#clinic-select');
    const specialtySelect = select('#specialty-select');

    setSummaryValue('clinic', clinicSelect.selectedOptions[0] && clinicSelect.selectedOptions[0].textContent);
    setSummaryValue('specialty', specialtySelect.selectedOptions[0] && specialtySelect.selectedOptions[0].textContent);
    setSummaryValue('name', select('#patient-name').value);
    setSummaryValue('date', select('#preferred-date').value);
  }

  function setSummaryValue(key, value) {
    const el = select('[data-summary="' + key + '"]');
    if (el) el.textContent = value || '—';
  }

  function validateStep(step) {
    const fields = selectAll('input[required], select[required]', step);
    let isValid = true;

    fields.forEach(function (field) {
      if (!validateField(field)) isValid = false;
    });

    return isValid;
  }

  function validateField(field) {
    clearFieldError(field);

    if (!field.value.trim()) {
      showFieldError(field, 'This field is required.');
      return false;
    }

    if (field.type === 'tel' && !isValidPhoneNumber(field.value)) {
      showFieldError(field, 'Enter a valid phone number.');
      return false;
    }

    return true;
  }

  function isValidPhoneNumber(value) {
    const digitsOnly = value.replace(/\D/g, '');
    return digitsOnly.length >= 10;
  }

  // Only the phone field has an error container already wired up in the
  // HTML. This creates one on the fly for any other required field, so
  // every field gets a real, visible, accessible error message instead of
  // just an aria-invalid flag with no readable text next to it.
  function ensureFieldErrorElement(field) {
    const existingId = field.getAttribute('aria-describedby');
    if (existingId) {
      const existing = select('#' + existingId);
      if (existing) return existing;
    }

    const errorEl = document.createElement('p');
    errorEl.className = 'form-error';
    errorEl.id = field.id + '-error';
    errorEl.setAttribute('role', 'alert');
    field.insertAdjacentElement('afterend', errorEl);
    field.setAttribute('aria-describedby', errorEl.id);
    return errorEl;
  }

  function showFieldError(field, message) {
    field.setAttribute('aria-invalid', 'true');
    const errorEl = ensureFieldErrorElement(field);
    errorEl.textContent = message;

    pushAnalyticsEvent('booking_failed', {
      step_number: Number(field.closest('.form-step').dataset.step),
      error_type: 'validation_error',
      validation_field: field.name
    });
  }

  function clearFieldError(field) {
    field.removeAttribute('aria-invalid');
    const errorId = field.getAttribute('aria-describedby');
    if (!errorId) return;
    const errorEl = select('#' + errorId);
    if (errorEl) errorEl.textContent = '';
  }

  function submitBooking() {
    const step3 = select('.form-step[data-step="3"]', bookingForm);
    if (step3 && !validateStep(step3)) return;

    pushAnalyticsEvent('booking_step_completed', {
      step_number: 3,
      step_name: STEP_NAMES[3],
      clinic_id: select('#clinic-select').value,
      specialty: select('#specialty-select').value
    });

    const submitButton = select('button[type="submit"]', bookingForm);
    if (submitButton) submitButton.disabled = true;

    simulateBookingRequest()
      .then(function () {
        pushAnalyticsEvent('booking_completed', {
          clinic_id: select('#clinic-select').value,
          specialty: select('#specialty-select').value
        });
        showBookingSuccess();
      })
      .catch(function () {
        // Not reachable by the simulation below, which always succeeds -
        // this stays in place so a real API call can drop in later
        // without needing a new failure path built at that point.
        pushAnalyticsEvent('booking_failed', {
          step_number: 3,
          error_type: 'server_error'
        });
        showBookingError();
      })
      .finally(function () {
        if (submitButton) submitButton.disabled = false;
      });
  }

  // No backend exists yet. This simulates a successful booking request so
  // the full success flow can be built and tested now, and can be swapped
  // for a real fetch() call later without changing anything that calls it.
  function simulateBookingRequest() {
    return new Promise(function (resolve) {
      setTimeout(resolve, 600);
    });
  }

  function showBookingSuccess() {
    if (!bookingModal || !bookingForm) return;

    bookingForm.hidden = true;

    let successEl = select('.booking-success', bookingModal);
    if (!successEl) {
      successEl = document.createElement('div');
      successEl.className = 'booking-success';
      successEl.setAttribute('role', 'status');
      successEl.setAttribute('tabindex', '-1');
      successEl.innerHTML =
        '<h3>Appointment Requested</h3>' +
        '<p>Thanks - a member of our team will confirm your appointment shortly.</p>';
      bookingModal.appendChild(successEl);
    }

    successEl.hidden = false;
    successEl.focus();
  }

  function showBookingError() {
    if (!bookingModal) return;

    let errorEl = select('.booking-submit-error', bookingModal);
    if (!errorEl) {
      errorEl = document.createElement('p');
      errorEl.className = 'booking-submit-error form-error';
      errorEl.setAttribute('role', 'alert');
      const step3 = select('.form-step[data-step="3"]', bookingModal);
      if (step3) step3.appendChild(errorEl);
    }

    errorEl.textContent = 'Something went wrong. Please try again or call us directly.';
  }

  /* ==========================================================================
     Call & WhatsApp Tracking
     ========================================================================== */

  function initContactTracking() {
    document.addEventListener('click', function (event) {
      const link = event.target.closest('a[href^="tel:"], a[href*="wa.me"]');
      if (!link) return;

      const isWhatsApp = link.href.indexOf('wa.me') !== -1;

      pushAnalyticsEvent(isWhatsApp ? 'whatsapp_click' : 'call_click', {
        button_location: getButtonLocation(link),
        link_destination: link.href
      });
    });
  }

  /* ==========================================================================
     Back To Top
     ========================================================================== */

  function initBackToTop() {
    const trigger = select('.why-choose-us');
    if (!trigger) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'back-to-top';
    button.setAttribute('aria-label', 'Back to top');
    button.hidden = true;
    button.textContent = '↑';
    document.body.appendChild(button);

    button.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth'
      });
    });

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        const scrolledPast = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        button.hidden = !scrolledPast;
      });
    });

    observer.observe(trigger);
  }

  /* ==========================================================================
     Scroll Animations
     ========================================================================== */

  function initScrollAnimations() {
    const animatedSections = selectAll('main > section');
    if (!animatedSections.length) return;

    if (prefersReducedMotion()) {
      animatedSections.forEach(function (section) {
        section.classList.add('is-visible');
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    animatedSections.forEach(function (section) {
      observer.observe(section);
    });
  }

  /* ==========================================================================
     Initialization
     ========================================================================== */

  initMobileNav();
  initThemeToggle();
  initStickyHeader();
  initSmoothScroll();
  initActiveNavHighlight();
  initFaqAccordion();
  initBookingModalTriggers();
  initBookingModalBackdropClose();
  initBookingForm();
  initContactTracking();
  initBackToTop();
  initScrollAnimations();
})();
