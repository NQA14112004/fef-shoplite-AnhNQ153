/* ============================================================
   cart-page.js — Cart page.
   Shows the items saved in the cart, lets the user change the
   quantity or remove items, and keeps the total up to date.
   The cart itself is stored by the shared Cart module (cart.js).
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

  // Build the HTML for one cart row.
  function rowHTML(item) {
    return (
      '<li class="sl-cart-item">' +
        '<img class="sl-cart-item__img" src="' + UI.escapeHtml(item.image) + '" alt="' + UI.escapeHtml(item.title) + '">' +
        '<div class="sl-cart-item__info">' +
          '<div class="sl-cart-item__title">' + UI.escapeHtml(item.title) + "</div>" +
          '<div class="text-muted small">' + UI.formatPrice(item.price) + " each</div>" +
        "</div>" +
        '<div class="sl-qty">' +
          '<button type="button" class="js-dec" aria-label="Decrease">−</button>' +
          "<span>" + item.qty + "</span>" +
          '<button type="button" class="js-inc" aria-label="Increase">+</button>' +
        "</div>" +
        '<div class="fw-bold" style="min-width:90px;text-align:right">' +
          UI.formatPrice(item.price * item.qty) +
        "</div>" +
        '<button class="btn btn-sm btn-outline-danger js-remove" aria-label="Remove"><i class="bi bi-trash"></i></button>' +
      "</li>"
    );
  }

  // Draw the cart. If it is empty, show the empty message instead.
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
    listEl.innerHTML = items.map(rowHTML).join("");

    const total = Cart.getTotal();
    subtotalEl.textContent = UI.formatPrice(total);
    totalEl.textContent = UI.formatPrice(total);

    // Attach +/- and remove handlers to each row.
    const rows = listEl.querySelectorAll(".sl-cart-item");
    rows.forEach(function (row, index) {
      const id = items[index].id;
      row.querySelector(".js-inc").addEventListener("click", function () {
        Cart.changeQty(id, 1);
        render();
      });
      row.querySelector(".js-dec").addEventListener("click", function () {
        Cart.changeQty(id, -1);
        render();
      });
      row.querySelector(".js-remove").addEventListener("click", function () {
        Cart.removeItem(id);
        render();
      });
    });
  }

  clearBtn.addEventListener("click", function () {
    Cart.clear();
    render();
  });

  checkoutBtn.addEventListener("click", function () {
    alert("This is a demo store — your order has been placed!");
    Cart.clear();
    render();
  });

  document.addEventListener("DOMContentLoaded", render);
})();
