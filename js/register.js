/* ============================================================
   register.js — Register / Contact form validation.
   We check each field with JavaScript (not just HTML), show an
   error message under any invalid field, stop the form from
   submitting if there are errors, and show a success message
   when everything is valid.
   ============================================================ */
(function () {
  "use strict";

  const form = document.getElementById("register-form");
  const successBox = document.getElementById("form-success");

  // Check one field. Return an error message, or "" if it is OK.
  function getError(name, value) {
    if (name === "fullName") {
      return value.trim().length >= 2 ? "" : "Please enter your full name.";
    }
    if (name === "email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(value.trim()) ? "" : "Please enter a valid email address.";
    }
    if (name === "password") {
      return value.length >= 6 ? "" : "Password must be at least 6 characters.";
    }
    if (name === "phone") {
      const phonePattern = /^[0-9+\-\s()]{8,15}$/;
      return phonePattern.test(value.trim()) ? "" : "Please enter a valid phone number.";
    }
    if (name === "country") {
      return value ? "" : "Please choose a country.";
    }
    if (name === "terms") {
      return value ? "" : "You must agree to the terms.";
    }
    return "";
  }

  // Validate one field and show/clear its error message.
  // Returns true when the field is valid.
  function validateField(field) {
    const value = field.type === "checkbox" ? field.checked : field.value;
    const message = getError(field.name, value);
    const errorEl = form.querySelector('[data-error-for="' + field.name + '"]');

    if (errorEl) errorEl.textContent = message;
    field.classList.toggle("is-invalid", message !== "");
    field.classList.toggle("is-valid", message === "");
    return message === "";
  }

  // Validate every field. Returns true only if all are valid.
  function validateForm() {
    const names = ["fullName", "email", "password", "phone", "country", "terms"];
    let valid = true;
    names.forEach(function (name) {
      const field = form.elements[name];
      if (field && !validateField(field)) valid = false;
    });
    return valid;
  }

  // When the form is submitted.
  form.addEventListener("submit", function (e) {
    e.preventDefault(); // stop the page from reloading
    successBox.hidden = true;

    if (!validateForm()) {
      const firstInvalid = form.querySelector(".is-invalid");
      if (firstInvalid) firstInvalid.focus();
      return; // do not submit while there are errors
    }

    const name = form.elements.fullName.value.trim();
    successBox.hidden = false;
    successBox.textContent = "Thanks, " + name + "! Your account has been created.";
    form.reset();
    // Remove the green/red styling after resetting.
    form.querySelectorAll(".is-valid, .is-invalid").forEach(function (el) {
      el.classList.remove("is-valid", "is-invalid");
    });
  });

  // Re-check a field as soon as the user changes it.
  form.addEventListener("input", function (e) {
    validateField(e.target);
  });
  form.addEventListener("change", function (e) {
    validateField(e.target);
  });
})();
