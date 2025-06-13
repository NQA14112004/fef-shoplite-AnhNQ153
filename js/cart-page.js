/* ============================================================
   cart-page.js — Cart page controller.
   Renders cart items, supports +/- quantity and remove via
   EVENT DELEGATION (one listener on the list), keeps the total
   in sync, and shows an empty-cart state. Persistence lives in
   the shared Cart module (cart.js).
   ============================================================ */
(function () {
  "use strict";

  const { UI, Cart } = window;

  const listEl = document.getElementById("cart-list");
  const emptyEl = document.getElementById("cart-empty");
  const summaryEl = document.getElementById("cart-summary");
  const totalEl = document.getElementById("cart-total");
  const subtotalEl = document.getElementById("cart-subtotal");
  const clearBtn = document.getElementById("clear-cart");
  const checkoutBtn = document.getElementById("checkout-btn");

  const SHIPPING_FLAT = 0; // free shipping in this demo

  function itemTemplate(item) {
    return `
      <li class="sl-cart-item" data-id="${item.id}">
        <img class="sl-cart-item__img" src="${UI.escapeHtml(item.image)}" alt="${UI.escapeHtml(item.title)}">
        <div class="sl-cart-item__info">
          <div class="sl-cart-item__title">${UI.escapeHtml(item.title)}</div>
          <div class="text-muted small">${UI.formatPrice(item.price)} each</div>
        </div>
        <div class="sl-qty" aria-label="Quantity">
          <button type="button" data-action="dec" aria-label="Decrease quantity">−</button>
          <span>${item.qty}</span>
          <button type="button" data-action="inc" aria-label="Increase quantity">+</button>
        </div>
        <div class="fw-bold" style="min-width:90px;text-align:right">
          ${UI.formatPrice(item.price * item.qty)}
        </div>
        <button class="btn btn-sm btn-outline-danger" data-action="remove" aria-label="Remove item">
          <i class="bi bi-trash"></i>
        </button>
      </li>`;
  }

  function render() {
    const items = Cart.getCart();

    if (items.length === 0) {
      listEl.innerHTML = "";
      summaryEl.hidden = true;
      emptyEl.hidden = false;
      return;
    }

    emptyEl.hidden = true;
    summaryEl.hidden = false;
    listEl.innerHTML = items.map(itemTemplate).join("");

    const subtotal = Cart.getTotal();
    subtotalEl.textContent = UI.formatPrice(subtotal);
    totalEl.textContent = UI.formatPrice(subtotal + SHIPPING_FLAT);
  }

  // Single delegated handler for inc / dec / remove on every row.
  function onListClick(e) {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const row = btn.closest("[data-id]");
    if (!row) return;
    const id = Number(row.dataset.id);

    switch (btn.dataset.action) {
      case "inc":
        Cart.changeQty(id, 1);
        break;
      case "dec":
        Cart.changeQty(id, -1);
        break;
      case "remove":
        Cart.removeItem(id);
        UI.showToast("Item removed", "info");
        break;
      default:
        return;
    }
    render();
  }

  function bindEvents() {
    listEl.addEventListener("click", onListClick);

    clearBtn.addEventListener("click", () => {
      if (Cart.getCount() === 0) return;
      Cart.clear();
      render();
      UI.showToast("Cart emptied", "info");
    });

    checkoutBtn.addEventListener("click", () => {
      UI.showToast("Checkout is a demo — order placed! 🎉", "success");
      Cart.clear();
      render();
    });

    // React to changes coming from other tabs.
    window.addEventListener("storage", (e) => {
      if (e.key === "shoplite_cart") render();
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    bindEvents();
    render();
  });
})();
