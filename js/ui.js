/* ============================================================
   ui.js — shared UI helpers exposed as window.UI
   - formatPrice / escapeHtml
   - toast notifications
   - debounce
   - star rating renderer
   ============================================================ */
(function () {
  "use strict";

  /** Format a number as USD. */
  function formatPrice(value) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(value) || 0);
  }

  /** Escape user/API text before injecting into innerHTML. */
  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }

  /** Limit how often a function runs (used for the search box). */
  function debounce(fn, delay = 300) {
    let timer = null;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  /** Render a star-rating string from a 0–5 rate. */
  function renderStars(rate) {
    const full = Math.round(Number(rate) || 0);
    let stars = "";
    for (let i = 1; i <= 5; i++) {
      stars += i <= full ? "★" : "☆";
    }
    return stars;
  }

  /** Lazily create (once) and return the toast container. */
  function getToastContainer() {
    let el = document.querySelector(".sl-toast-container");
    if (!el) {
      el = document.createElement("div");
      el.className = "sl-toast-container";
      el.setAttribute("aria-live", "polite");
      el.setAttribute("aria-atomic", "true");
      document.body.appendChild(el);
    }
    return el;
  }

  /**
   * Show a transient toast.
   * @param {string} message
   * @param {"success"|"error"|"info"} type
   */
  function showToast(message, type = "info") {
    const container = getToastContainer();
    const toast = document.createElement("div");
    toast.className = `sl-toast ${type}`;
    toast.setAttribute("role", "status");

    const icons = { success: "bi-check-circle", error: "bi-exclamation-triangle", info: "bi-info-circle" };
    toast.innerHTML = `<i class="bi ${icons[type] || icons.info}"></i><span>${escapeHtml(message)}</span>`;
    container.appendChild(toast);

    // trigger the CSS enter transition on the next frame
    requestAnimationFrame(() => toast.classList.add("show"));

    setTimeout(() => {
      toast.classList.remove("show");
      toast.addEventListener("transitionend", () => toast.remove(), { once: true });
    }, 2600);
  }

  window.UI = { formatPrice, escapeHtml, debounce, renderStars, showToast };
})();
