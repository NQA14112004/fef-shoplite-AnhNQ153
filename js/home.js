/* ============================================================
   home.js — Home page (product list).
   Steps:
   1. Fetch every product from the API.
   2. Show a loading spinner while waiting, an error if it fails.
   3. Render the products as cards in the DOM.
   4. Let the user search by name and filter by category.
   ============================================================ */
(function () {
  "use strict";

  const { API, UI, Cart } = window;

  // Grab the elements we need from the page.
  const grid = document.getElementById("product-grid");
  const stateBox = document.getElementById("grid-state");
  const searchInput = document.getElementById("search-input");
  const categorySelect = document.getElementById("category-select");
  const resultCount = document.getElementById("result-count");

  // All products fetched from the API, plus the current filters.
  let allProducts = [];
  let search = "";
  let category = "all";

  // Show a Bootstrap spinner while the products load.
  function showLoading() {
    grid.innerHTML = "";
    resultCount.textContent = "";
    stateBox.hidden = false;
    stateBox.innerHTML =
      '<div class="spinner-border text-primary" role="status"></div>' +
      "<p class=\"mt-2\">Loading products…</p>";
  }

  // Show an error message with a button to try again.
  function showError(message) {
    grid.innerHTML = "";
    stateBox.hidden = false;
    stateBox.innerHTML =
      '<i class="bi bi-wifi-off"></i>' +
      "<p>" + UI.escapeHtml(message) + "</p>" +
      '<button class="btn btn-primary mt-2" id="retry-btn">Try again</button>';
    document.getElementById("retry-btn").addEventListener("click", init);
  }

  // Build the HTML for one product card.
  function cardHTML(p) {
    return (
      '<article class="sl-card">' +
        '<div class="sl-card__media">' +
          '<img src="' + UI.escapeHtml(p.image) + '" alt="' + UI.escapeHtml(p.title) + '" loading="lazy">' +
        "</div>" +
        '<div class="sl-card__body">' +
          '<span class="sl-card__cat">' + UI.escapeHtml(p.category) + "</span>" +
          '<h3 class="sl-card__title">' + UI.escapeHtml(p.title) + "</h3>" +
          '<div class="sl-card__rating">★ ' + (p.rating ? p.rating.rate : 0) + "</div>" +
          '<div class="sl-card__price">' + UI.formatPrice(p.price) + "</div>" +
          '<div class="sl-card__actions">' +
            '<a class="btn btn-outline-secondary btn-sm" href="product.html?id=' + p.id + '">Details</a>' +
            '<button class="btn btn-primary btn-sm js-add" data-id="' + p.id + '">Add</button>' +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  // Keep only the products that match the search box and category.
  function getFiltered() {
    return allProducts.filter(function (p) {
      const matchCategory = category === "all" || p.category === category;
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }

  // Draw the current list of products on the page.
  function render() {
    const list = getFiltered();

    if (list.length === 0) {
      grid.innerHTML = "";
      resultCount.textContent = "";
      stateBox.hidden = false;
      stateBox.innerHTML = '<i class="bi bi-search"></i><p>No products match your search.</p>';
      return;
    }

    stateBox.hidden = true;
    grid.innerHTML = list.map(cardHTML).join("");
    resultCount.textContent = list.length + " products";

    // Attach a click handler to each "Add" button.
    grid.querySelectorAll(".js-add").forEach(function (button) {
      button.addEventListener("click", function () {
        const id = Number(button.dataset.id);
        const product = allProducts.find(function (p) { return p.id === id; });
        if (!product) return;
        Cart.addToCart(product, 1);
        // Simple feedback: briefly change the button text.
        button.textContent = "Added ✓";
        setTimeout(function () { button.textContent = "Add"; }, 1000);
      });
    });
  }

  // Fill the category dropdown from the API.
  async function loadCategories() {
    try {
      const categories = await API.getCategories();
      categories.forEach(function (name) {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        categorySelect.appendChild(option);
      });
    } catch {
      // If categories fail to load the page still works.
    }
  }

  // Fetch the products and render them.
  async function init() {
    showLoading();
    try {
      allProducts = await API.getProducts();
      render();
    } catch (error) {
      showError(error.message || "Could not load products.");
    }
  }

  // Wire up the search box and category dropdown.
  searchInput.addEventListener("input", function (e) {
    search = e.target.value.trim();
    render();
  });
  categorySelect.addEventListener("change", function (e) {
    category = e.target.value;
    render();
  });

  document.addEventListener("DOMContentLoaded", function () {
    loadCategories();
    init();
  });
})();
