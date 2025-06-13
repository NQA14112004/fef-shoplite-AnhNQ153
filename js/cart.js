/* ============================================================
   cart.js — cart state + localStorage persistence.
   Exposed as window.Cart. Loaded on EVERY page so the navbar
   badge stays in sync (including across browser tabs via the
   native `storage` event).

   localStorage key: "shoplite_cart"
   value shape: Array<{ id, title, price, image, qty }>
   ============================================================ */
(function () {
  "use strict";

  const STORAGE_KEY = "shoplite_cart";

  /** Read + parse the cart, tolerating corrupt/empty storage. */
  function getCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  /** Persist the cart and refresh the badge. */
  function saveCart(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    updateBadge();
  }

  /** Add a product (or bump its quantity if already present). */
  function addToCart(product, qty = 1) {
    const items = getCart();
    const existing = items.find((it) => it.id === product.id);
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        qty,
      });
    }
    saveCart(items);
    return items;
  }

  /** Set an exact quantity; quantities ≤ 0 remove the item. */
  function setQty(id, qty) {
    let items = getCart();
    if (qty <= 0) {
      items = items.filter((it) => it.id !== id);
    } else {
      const item = items.find((it) => it.id === id);
      if (item) item.qty = qty;
    }
    saveCart(items);
    return items;
  }

  /** Increment/decrement helper used by the +/- buttons. */
  function changeQty(id, delta) {
    const item = getCart().find((it) => it.id === id);
    if (!item) return getCart();
    return setQty(id, item.qty + delta);
  }

  /** Remove one product entirely. */
  function removeItem(id) {
    const items = getCart().filter((it) => it.id !== id);
    saveCart(items);
    return items;
  }

  /** Empty the whole cart. */
  function clear() {
    saveCart([]);
  }

  /** Total number of units (sum of quantities). */
  function getCount() {
    return getCart().reduce((sum, it) => sum + it.qty, 0);
  }

  /** Total price across all items. */
  function getTotal() {
    return getCart().reduce((sum, it) => sum + it.price * it.qty, 0);
  }

  /** Update every cart badge currently on the page. */
  function updateBadge() {
    const count = getCount();
    document.querySelectorAll("[data-cart-badge]").forEach((badge) => {
      badge.textContent = count;
      badge.classList.toggle("show", count > 0);
      if (count > 0) {
        badge.classList.remove("bump");
        // force reflow so the animation can replay
        void badge.offsetWidth;
        badge.classList.add("bump");
      }
    });
  }

  // Keep the badge in sync when another tab changes the cart.
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY) updateBadge();
  });

  // Initialise the badge as soon as the DOM is ready.
  document.addEventListener("DOMContentLoaded", updateBadge);

  window.Cart = {
    getCart,
    addToCart,
    setQty,
    changeQty,
    removeItem,
    clear,
    getCount,
    getTotal,
    updateBadge,
  };
})();
