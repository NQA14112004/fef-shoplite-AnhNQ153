/* ============================================================
   product.js — Product-detail page controller.
   Reads ?id= from the query string, fetches that one product,
   and renders it. Handles loading, error, and "not found".
   ============================================================ */
(function () {
  "use strict";

  const { API, UI, Cart } = window;

  const container = document.getElementById("detail");
  const stateBox = document.getElementById("detail-state");

  /** Read the product id from the URL (?id=5). */
  function getIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
  }

  function showState(icon, message, withHome = true) {
    container.hidden = true;
    stateBox.hidden = false;
    stateBox.innerHTML = `
      <i class="bi ${icon}"></i>
      <p>${UI.escapeHtml(message)}</p>
      ${withHome ? '<a class="btn btn-primary mt-2" href="index.html">Back to shop</a>' : ""}
    `;
  }

  function showSkeleton() {
    stateBox.hidden = true;
    container.hidden = false;
    container.innerHTML = `
      <div class="sl-skeleton sl-detail__media"><div class="sl-skel-box" style="width:60%;height:60%"></div></div>
      <div>
        <div class="sl-skel-box sl-skel-line short"></div>
        <div class="sl-skel-box sl-skel-line title" style="width:80%"></div>
        <div class="sl-skel-box sl-skel-line"></div>
        <div class="sl-skel-box sl-skel-line"></div>
        <div class="sl-skel-box sl-skel-line" style="width:50%"></div>
      </div>`;
  }

  function render(p) {
    document.title = `${p.title} · ShopLite`;
    stateBox.hidden = true;
    container.hidden = false;
    container.innerHTML = `
      <div class="sl-detail__media">
        <img src="${UI.escapeHtml(p.image)}" alt="${UI.escapeHtml(p.title)}">
      </div>
      <div>
        <span class="sl-card__cat">${UI.escapeHtml(p.category)}</span>
        <h1 class="h3 mt-1">${UI.escapeHtml(p.title)}</h1>
        <div class="sl-card__rating mb-2" title="${p.rating ? p.rating.rate : 0} / 5">
          ${UI.renderStars(p.rating && p.rating.rate)}
          <span class="count">${p.rating ? p.rating.rate : 0} (${p.rating ? p.rating.count : 0} reviews)</span>
        </div>
        <p class="sl-detail__price">${UI.formatPrice(p.price)}</p>
        <p class="text-muted">${UI.escapeHtml(p.description)}</p>
        <div class="d-flex align-items-center gap-2 mt-3">
          <div class="sl-qty" aria-label="Quantity selector">
            <button type="button" data-qty="-1" aria-label="Decrease">−</button>
            <span id="qty-value">1</span>
            <button type="button" data-qty="1" aria-label="Increase">+</button>
          </div>
          <button class="btn btn-primary btn-lg" id="add-btn">
            <i class="bi bi-cart-plus"></i> Add to cart
          </button>
        </div>
      </div>`;

    // Local quantity selector (scoped to this page).
    let qty = 1;
    const qtyValue = container.querySelector("#qty-value");
    container.querySelector(".sl-qty").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-qty]");
      if (!btn) return;
      qty = Math.max(1, qty + Number(btn.dataset.qty));
      qtyValue.textContent = qty;
    });

    container.querySelector("#add-btn").addEventListener("click", () => {
      Cart.addToCart(p, qty);
      UI.showToast(`Added ${qty} × “${p.title.slice(0, 24)}…” to cart`, "success");
    });
  }

  async function init() {
    const id = getIdFromUrl();
    if (!id) {
      showState("bi-question-circle", "No product specified.");
      return;
    }
    showSkeleton();
    try {
      const product = await API.getProduct(id);
      // Fake Store API returns null/empty for unknown ids.
      if (!product || !product.id) {
        showState("bi-box-seam", `Product #${UI.escapeHtml(id)} was not found.`);
        return;
      }
      render(product);
    } catch (err) {
      showState("bi-wifi-off", err.message || "Failed to load this product.");
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
