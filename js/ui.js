/* ============================================================
   ui.js — small shared helpers exposed as window.UI
   Kept intentionally simple:
   - formatPrice: show a number as US dollars
   - escapeHtml: make API text safe before putting it in HTML
   ============================================================ */
(function () {
  "use strict";

  // Turn 19.9 into "$19.90".
  function formatPrice(value) {
    return "$" + (Number(value) || 0).toFixed(2);
  }

  // Convert characters like < > & into safe text so product
  // titles/descriptions can't break the page layout.
  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }

  window.UI = { formatPrice, escapeHtml };
})();
