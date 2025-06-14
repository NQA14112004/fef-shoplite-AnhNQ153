/* ============================================================
   cart.js — cart logic + localStorage. Exposed as window.Cart.
   Loaded on every page so the navbar count is correct.

   localStorage key: "shoplite_cart"
   value: an array of items, each { id, title, price, image, qty }
   ============================================================ */
(function () {
  "use strict";

  const STORAGE_KEY = "shoplite_cart";

  // Read the cart from localStorage (returns [] if empty/broken).
  function getCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
  }

  // Save the cart and refresh the navbar count.
  function saveCart(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    updateBadge();
  }

  // Add a product. If it is already in the cart, raise its quantity.
  function addToCart(product, qty) {
    const amount = qty || 1;
    const items = getCart();
    const existing = items.find((item) => item.id === product.id);
    if (existing) {
      existing.qty += amount;
    } else {
      items.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        qty: amount,
      });
    }
    saveCart(items);
  }

  // Change quantity by +1 or -1. If it reaches 0, remove the item.
  function changeQty(id, delta) {
    const items = getCart();
    const item = items.find((it) => it.id === id);
    if (!item) return;
    item.qty += delta;
    const next = item.qty <= 0 ? items.filter((it) => it.id !== id) : items;
    saveCart(next);
  }

  // Remove one product completely.
  function removeItem(id) {
    saveCart(getCart().filter((it) => it.id !== id));
  }

  // Empty the whole cart.
  function clear() {
    saveCart([]);
  }

  // Total number of items (sum of quantities) — used for the badge.
  function getCount() {
    return getCart().reduce((sum, it) => sum + it.qty, 0);
  }

  // Total price of everything in the cart.
  function getTotal() {
    return getCart().reduce((sum, it) => sum + it.price * it.qty, 0);
  }

  // Show the current count on the navbar cart badge.
  function updateBadge() {
    const count = getCount();
    const badge = document.querySelector("[data-cart-badge]");
    if (!badge) return;
    badge.textContent = count;
    badge.classList.toggle("show", count > 0);
  }

  // Set the badge as soon as the page is ready.
  document.addEventListener("DOMContentLoaded", updateBadge);

  window.Cart = {
    getCart,
    addToCart,
    changeQty,
    removeItem,
    clear,
    getCount,
    getTotal,
    updateBadge,
  };
})();
