/* ============================================================
   register.js — Register / Contact form validation.
   Validation is done in JavaScript (not just HTML attributes):
   per-field error messages, live re-validation, blocked submit
   on error, and a success message when everything is valid.
   ============================================================ */
(function () {
  "use strict";

  const { UI } = window;

  const form = document.getElementById("register-form");
  const successBox = document.getElementById("form-success");

  // Validation rules keyed by the field's `name`.
  const rules = {
    fullName: (v) =>
      v.trim().length >= 2 ? "" : "Please enter your full name (at least 2 characters).",
    email: (v) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Please enter a valid email address.",
    password: (v) =>
      v.length >= 6 ? "" : "Password must be at least 6 characters.",
    phone: (v) =>
      /^[0-9+\-\s()]{8,15}$/.test(v.trim())
        ? ""
        : "Please enter a valid phone number (8–15 digits).",
    country: (v) => (v ? "" : "Please choose a country."),
    terms: (checked) => (checked ? "" : "You must agree to the terms."),
  };

  /** Read a field's value (checkbox → boolean, else string). */
  function getValue(field) {
    return field.type === "checkbox" ? field.checked : field.value;
  }

  /** Show or clear the error for one field; returns true if valid. */
  function validateField(field) {
    const rule = rules[field.name];
    if (!rule) return true;

    const message = rule(getValue(field));
    const errorEl = form.querySelector(`[data-error-for="${field.name}"]`);
    const isValid = message === "";

    if (errorEl) errorEl.textContent = message;
    field.classList.toggle("is-invalid", !isValid);
    field.classList.toggle("is-valid", isValid);
    return isValid;
  }

  function validateAll() {
    let allValid = true;
    Object.keys(rules).forEach((name) => {
      const field = form.elements[name];
      if (field && !validateField(field)) allValid = false;
    });
    return allValid;
  }

  function onSubmit(e) {
    e.preventDefault();
    successBox.hidden = true;

    if (!validateAll()) {
      UI.showToast("Please fix the highlighted fields.", "error");
      // Move focus to the first invalid field for accessibility.
      const firstInvalid = form.querySelector(".is-invalid");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const name = form.elements.fullName.value.trim();
    successBox.hidden = false;
    successBox.textContent = `Thanks, ${name}! Your account has been created.`;
    UI.showToast("Registration successful 🎉", "success");
    form.reset();
    // Clear the valid/invalid styling after a successful reset.
    form.querySelectorAll(".is-valid, .is-invalid").forEach((el) =>
      el.classList.remove("is-valid", "is-invalid")
    );
  }

  function bindEvents() {
    form.addEventListener("submit", onSubmit);

    // Live validation: re-check a field as the user edits it.
    form.addEventListener("input", (e) => {
      if (rules[e.target.name]) validateField(e.target);
    });
    form.addEventListener("change", (e) => {
      if (rules[e.target.name]) validateField(e.target);
    });
  }

  document.addEventListener("DOMContentLoaded", bindEvents);
})();
