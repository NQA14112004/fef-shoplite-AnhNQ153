# ShopLite — Mini E-Commerce (FEF Long Assignment)

A multi-page shopping website built with **semantic HTML5, hand-written CSS (Flexbox + Grid), Bootstrap 5, and vanilla JavaScript**. Product data is fetched live from the [Fake Store API](https://fakestoreapi.com/) — nothing is hard-coded. The cart is saved in `localStorage` so it survives moving between pages.

> Assignment code: **FEF-LA-01** · No backend · No JS framework. Target: **Good tier (7–8)**.

---

## 🔗 Live demo

> Deploy with GitHub Pages / Netlify / Vercel and paste the link here:
>

---

## 🖼️ Screenshots

> Add screenshots after deploying (drop images into `assets/` and reference them):
>
> | Home | Product detail | Cart | Register |
> |---|---|---|---|
> | `assets/screenshot-home.png` | `assets/screenshot-product.png` | `assets/screenshot-cart.png` | `assets/screenshot-register.png` |

---

## ▶️ Run locally

No build step is required. Because the pages use `fetch()`, serve them over **http://** (not the `file://` protocol) to avoid CORS issues.

**Option A — VS Code Live Server**
1. Open the folder in VS Code.
2. Right-click `index.html` → **Open with Live Server**.

**Option B — Node**
```bash
npx serve .
# then open the printed http://localhost address
```

---

## 🗂️ Project structure

```
fef-shoplite-AnhNQ153/
├── index.html          # Home / product list
├── product.html        # Product detail (?id=)
├── cart.html           # Cart
├── register.html       # Register / Contact form
├── css/
│   └── style.css       # Hand-written Flexbox/Grid + theme
├── js/
│   ├── api.js          # Shared fetch functions (window.API)
│   ├── ui.js           # Helpers: formatPrice, escapeHtml (window.UI)
│   ├── cart.js         # Cart logic + localStorage (window.Cart)
│   ├── home.js         # Home page
│   ├── product.js      # Detail page
│   ├── cart-page.js    # Cart page
│   └── register.js     # Form validation
├── assets/             # images / screenshots
└── README.md
```

### How the code fits together
- Each JS file is wrapped in an IIFE and exposes one object: `API`, `UI`, or `Cart`.
- Script load order on each page: `api.js → ui.js → cart.js → <page>.js`.
- All network calls go through `api.js`, which checks `res.ok` and uses `try/catch`.
- `cart.js` is the only file that touches the `shoplite_cart` localStorage key.

---

## ✅ Completed features

### Pass tier (foundation)
- [x] All **4 pages** linked through a shared navbar + footer.
- [x] **Semantic HTML** (`header / nav / main / section / article / aside / footer`).
- [x] Home page **fetches and renders** the product list with the DOM (no hard-coded products).
- [x] Detail page shows the **correct product by `id`** read from the query string.
- [x] Register form has **JavaScript validation** (required fields, valid email, etc.).
- [x] **Responsive** — no layout breakage on mobile; the navbar collapses.

### Good tier (intermediate)
- [x] **Full cart**: add / remove / change quantity, live total, saved in `localStorage` across pages.
- [x] **Search by name + filter by category**, updating the grid immediately.
- [x] **Loading (spinner) and error states** — never a blank screen, with a "Try again" button.
- [x] **Hand-written Flexbox/Grid** layout, responsive at mobile / tablet / desktop.

> Scope note: advanced "Excellent tier" extras (sorting, pagination, debounce, toast pop-ups, event delegation, cross-tab sync) were intentionally left out to keep the code simple and easy to explain.

---

## 🧪 How to test the key flows
1. **Home** loads → spinner shows → product grid renders.
2. Type in **search** and pick a **category** → the grid filters instantly.
3. Click **Add** on a card → the button shows "Added ✓" and the navbar count goes up.
4. Click **Details** → the detail page reads `?id=`; choose a quantity and add to cart.
5. Open **Cart** → change quantities (+/−), remove items, watch the total update; remove everything → empty-cart message.
6. **Register** → submit empty → per-field errors appear; fill it in correctly → success message.
7. Turn off the network and reload Home → a friendly **error message** with **Try again**.

---

## 🛠️ Tech
| Area | Choice |
|---|---|
| Markup | Semantic HTML5 |
| Styling | Hand-written CSS (Flexbox + Grid) + **Bootstrap 5** + Bootstrap Icons + Poppins |
| Logic | **Vanilla JavaScript**, `async/await` |
| Data | **Fake Store API** via **Fetch API** |
| Storage | `localStorage` |
