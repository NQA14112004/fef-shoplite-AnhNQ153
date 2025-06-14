/* ============================================================
   product.js — Product detail page.
   1. Read the product id from the URL (product.html?id=5).
   2. Fetch that one product from the API.
   3. Show a loading spinner, then the product, or an error.
   ============================================================ */
(function () {
  "use strict";

  const { API, UI, Cart } = window;

  const container = document.getElementById("detail");
  const stateBox = document.getElementById("detail-state");

  // Read ?id= from the address bar.
  function getId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
  }

  function showLoading() {
    container.hidden = true;
    stateBox.hidden = false;
    stateBox.innerHTML =
      '<div class="spinner-border text-primary" role="status"></div>' +
      '<p class="mt-2">Loading…</p>';
  }

  function showMessage(icon, message) {
    container.hidden = true;
    stateBox.hidden = false;
    stateBox.innerHTML =
      '<i class="bi ' + icon + '"></i>' +
      "<p>" + UI.escapeHtml(message) + "</p>" +
      '<a class="btn btn-primary mt-2" href="index.html">Back to shop</a>';
  }

  // Show the product and wire up the quantity + add-to-cart buttons.
  function render(product) {
    document.title = product.title + " · ShopLite";
    stateBox.hidden = true;
    container.hidden = false;

    container.innerHTML =
      '<div class="sl-detail__media">' +
        '<img src="' + UI.escapeHtml(product.image) + '" alt="' + UI.escapeHtml(product.title) + '">' +
      "</div>" +
      "<div>" +
        '<span class="sl-card__cat">' + UI.escapeHtml(product.category) + "</span>" +
        '<h1 class="h4 mt-1">' + UI.escapeHtml(product.title) + "</h1>" +
        '<div class="sl-card__rating mb-2">★ ' +
          (product.rating ? product.rating.rate : 0) +
          " (" + (product.rating ? product.rating.count : 0) + " reviews)</div>" +
        '<p class="sl-detail__price">' + UI.formatPrice(product.price) + "</p>" +
        '<p class="text-muted">' + UI.escapeHtml(product.description) + "</p>" +
        '<div class="d-flex align-items-center gap-2 mt-3">' +
          '<div class="sl-qty">' +
            '<button type="button" id="qty-dec" aria-label="Decrease">−</button>' +
            '<span id="qty-value">1</span>' +
            '<button type="button" id="qty-inc" aria-label="Increase">+</button>' +
          "</div>" +
          '<button class="btn btn-primary btn-lg" id="add-btn">Add to cart</button>' +
        "</div>" +
        '<p class="text-success mt-2" id="added-msg" hidden>Added to cart ✓</p>' +
      "</div>";

    // The quantity the user wants to add.
    let qty = 1;
    const qtyValue = document.getElementById("qty-value");

    document.getElementById("qty-inc").addEventListener("click", function () {
      qty += 1;
      qtyValue.textContent = qty;
    });
    document.getElementById("qty-dec").addEventListener("click", function () {
      if (qty > 1) qty -= 1;
      qtyValue.textContent = qty;
    });

    document.getElementById("add-btn").addEventListener("click", function () {
      Cart.addToCart(product, qty);
      document.getElementById("added-msg").hidden = false;
    });
  }

  async function init() {
    const id = getId();
    if (!id) {
      showMessage("bi-question-circle", "No product was selected.");
      return;
    }
    showLoading();
    try {
      const product = await API.getProduct(id);
      if (!product || !product.id) {
        showMessage("bi-box-seam", "Product #" + id + " was not found.");
        return;
      }
      render(product);
    } catch (error) {
      showMessage("bi-wifi-off", error.message || "Could not load this product.");
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
