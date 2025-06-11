/* ============================================================
   api.js — single source of truth for all network calls.
   Exposed as the global `window.API`.
   Every call uses async/await, checks res.ok, and wraps the
   request in try/catch so callers get a clean Error to display.
   ============================================================ */
(function () {
  "use strict";

  const BASE_URL = "https://fakestoreapi.com";

  /**
   * Low-level fetch helper.
   * @param {string} path - endpoint path, e.g. "/products"
   * @returns {Promise<any>} parsed JSON
   * @throws {Error} on network failure or non-2xx response
   */
  async function request(path) {
    try {
      const res = await fetch(`${BASE_URL}${path}`);
      if (!res.ok) {
        throw new Error(`Request failed (${res.status} ${res.statusText})`);
      }
      return await res.json();
    } catch (err) {
      // Re-throw with a user-friendly, predictable message.
      if (err instanceof TypeError) {
        throw new Error("Network error — please check your connection.");
      }
      throw err;
    }
  }

  const API = {
    /** GET /products → all products */
    getProducts() {
      return request("/products");
    },
    /** GET /products/{id} → one product */
    getProduct(id) {
      return request(`/products/${encodeURIComponent(id)}`);
    },
    /** GET /products/categories → array of category names */
    getCategories() {
      return request("/products/categories");
    },
    /** GET /products/category/{name} → products in a category */
    getProductsByCategory(name) {
      return request(`/products/category/${encodeURIComponent(name)}`);
    },
  };

  window.API = API;
})();
