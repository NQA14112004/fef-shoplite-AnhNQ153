/* ============================================================
   home.js — Home / product-list page controller.
   Features: fetch + render grid, loading/error states,
   search (debounced) + category filter + sort, "load more"
   pagination, and event delegation for card actions.
   ============================================================ */
(function () {
  "use strict";

  const { API, UI, Cart } = window;

  // ---- DOM references -------------------------------------------------
  const grid = document.getElementById("product-grid");
  const stateBox = document.getElementById("grid-state");
  const searchInput = document.getElementById("search-input");
  const categorySelect = document.getElementById("category-select");
  const sortSelect = document.getElementById("sort-select");
  const loadMoreBtn = document.getElementById("load-more");
  const resultCount = document.getElementById("result-count");

  const PAGE_SIZE = 8;

  // ---- View state -----------------------------------------------------
  const state = {
    all: [],          // every product fetched from the API
    visibleCount: PAGE_SIZE,
    search: "",
    category: "all",
    sort: "default",
  };

  // ---- Rendering helpers ---------------------------------------------
  function showSkeletons(n = PAGE_SIZE) {
    stateBox.hidden = true;
    grid.innerHTML = Array.from({ length: n })
      .map(
        () => `
        <div class="sl-skeleton">
          <div class="sl-skel-box sl-skel-media"></div>
          <div class="sl-skel-box sl-skel-line short"></div>
          <div class="sl-skel-box sl-skel-line title"></div>
          <div class="sl-skel-box sl-skel-line"></div>
          <div class="sl-skel-box sl-skel-line" style="width:60%"></div>
        </div>`
      )
      .join("");
  }

  function showState(icon, message, withRetry = false) {
    grid.innerHTML = "";
    loadMoreBtn.hidden = true;
    resultCount.textContent = "";
    stateBox.hidden = false;
    stateBox.innerHTML = `
      <i class="bi ${icon}"></i>
      <p>${UI.escapeHtml(message)}</p>
      ${withRetry ? '<button class="btn btn-primary mt-2" id="retry-btn">Try again</button>' : ""}
    `;
    if (withRetry) {
      document.getElementById("retry-btn").addEventListener("click", init);
    }
  }

  function cardTemplate(p) {
    return `
      <article class="sl-card" data-id="${p.id}">
        <div class="sl-card__media">
          <img src="${UI.escapeHtml(p.image)}" alt="${UI.escapeHtml(p.title)}" loading="lazy">
        </div>
        <div class="sl-card__body">
          <span class="sl-card__cat">${UI.escapeHtml(p.category)}</span>
          <h3 class="sl-card__title">${UI.escapeHtml(p.title)}</h3>
          <div class="sl-card__rating" title="${p.rating ? p.rating.rate : 0} / 5">
            ${UI.renderStars(p.rating && p.rating.rate)}
            <span class="count">(${p.rating ? p.rating.count : 0})</span>
          </div>
          <div class="sl-card__price">${UI.formatPrice(p.price)}</div>
          <div class="sl-card__actions">
            <a class="btn btn-outline-secondary btn-sm" href="product.html?id=${p.id}">
              <i class="bi bi-eye"></i> Details
            </a>
            <button class="btn btn-primary btn-sm" data-action="add" data-id="${p.id}">
              <i class="bi bi-cart-plus"></i> Add
            </button>
          </div>
        </div>
      </article>`;
  }

  /** Apply search + filter + sort to the master list. */
  function getProcessed() {
    let list = state.all.slice();

    if (state.category !== "all") {
      list = list.filter((p) => p.category === state.category);
    }
    if (state.search) {
      const q = state.search.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q));
    }
    switch (state.sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        list.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }
    return list;
  }

  function render() {
    const processed = getProcessed();

    if (processed.length === 0) {
      showState("bi-search", "No products match your search.");
      return;
    }

    stateBox.hidden = true;
    const slice = processed.slice(0, state.visibleCount);
    grid.innerHTML = slice.map(cardTemplate).join("");

    resultCount.textContent = `Showing ${slice.length} of ${processed.length} products`;
    loadMoreBtn.hidden = slice.length >= processed.length;
  }

  // ---- Event handlers -------------------------------------------------
  function resetPaging() {
    state.visibleCount = PAGE_SIZE;
  }

  const onSearch = UI.debounce((value) => {
    state.search = value.trim();
    resetPaging();
    render();
  }, 350);

  // Event DELEGATION: a single listener on the grid handles every
  // dynamically-rendered "Add to cart" button.
  function onGridClick(e) {
    const btn = e.target.closest('[data-action="add"]');
    if (!btn) return;
    const id = Number(btn.dataset.id);
    const product = state.all.find((p) => p.id === id);
    if (!product) return;
    Cart.addToCart(product, 1);
    UI.showToast(`Added “${product.title.slice(0, 28)}…” to cart`, "success");
  }

  async function populateCategories() {
    try {
      const cats = await API.getCategories();
      categorySelect.insertAdjacentHTML(
        "beforeend",
        cats
          .map((c) => `<option value="${UI.escapeHtml(c)}">${UI.escapeHtml(c)}</option>`)
          .join("")
      );
    } catch {
      // Non-fatal — the page still works without the filter populated.
    }
  }

  // ---- Init -----------------------------------------------------------
  async function init() {
    showSkeletons();
    try {
      state.all = await API.getProducts();
      render();
    } catch (err) {
      showState("bi-wifi-off", err.message || "Failed to load products.", true);
    }
  }

  function bindEvents() {
    grid.addEventListener("click", onGridClick);
    searchInput.addEventListener("input", (e) => onSearch(e.target.value));
    categorySelect.addEventListener("change", (e) => {
      state.category = e.target.value;
      resetPaging();
      render();
    });
    sortSelect.addEventListener("change", (e) => {
      state.sort = e.target.value;
      resetPaging();
      render();
    });
    loadMoreBtn.addEventListener("click", () => {
      state.visibleCount += PAGE_SIZE;
      render();
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    bindEvents();
    populateCategories();
    init();
  });
})();
