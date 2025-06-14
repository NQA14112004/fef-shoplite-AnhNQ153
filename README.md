# ShopLite — Mini E-Commerce (FEF Long Assignment)

A multi-page shopping website built with **semantic HTML5, hand-written CSS (Flexbox + Grid), Bootstrap 5, and vanilla JavaScript**. Product data is fetched live from the [Fake Store API](https://fakestoreapi.com/) — nothing is hard-coded. The cart is persisted in `localStorage` and stays in sync across pages and browser tabs.

> Assignment code: **FEF-LA-01** · No backend · No JS framework.

---

## 🔗 Live demo

> Deploy with GitHub Pages / Netlify / Vercel and paste the link here:
>
> **Demo:** `https://<your-deploy-url>`

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

**Option B — Python (any OS with Python 3)**
```bash
cd fef-shoplite-AnhNQ153
python -m http.server 5500
# then open http://localhost:5500
```

**Option C — Node**
```bash
npx serve .
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
│   ├── api.js          # Shared fetch layer (window.API)
│   ├── ui.js           # Helpers: toast, debounce, format, escape (window.UI)
│   ├── cart.js         # Cart logic + localStorage + badge (window.Cart)
│   ├── home.js         # Home page controller
│   ├── product.js      # Detail page controller
│   ├── cart-page.js    # Cart page controller
│   └── register.js     # Form validation
├── assets/             # images / screenshots
└── README.md
```

### Architecture notes
- **No globals leak:** every file is an IIFE that exposes a single namespace (`API`, `UI`, `Cart`).
- **Script order matters:** `api.js → ui.js → cart.js → <page>.js`.
- **One fetch layer:** all network calls go through `api.js`, which checks `res.ok` and uses `try/catch`.
- **Cart is the single source of truth:** `cart.js` owns the `shoplite_cart` localStorage key; pages only call its methods.

---

## ✅ Completed features (by rubric tier)

### Pass tier (foundation)
- [x] All **4 pages** linked through a shared navbar + footer.
- [x] **Semantic HTML** (`header/nav/main/section/article/aside/footer`), minimal `div` soup.
- [x] Home page **fetches and renders** the product list with the DOM (no hard-coded products).
- [x] Detail page shows the **correct product by `id`** from the query string.
- [x] Register form has **JavaScript validation** (required fields, valid email, etc.).
- [x] **Responsive** — no layout breakage on mobile; navbar collapses.

### Good tier (intermediate)
- [x] **Full cart**: add / remove / change quantity, live total, persisted in `localStorage` across pages.
- [x] **Search + filter by category**, updating the grid immediately.
- [x] Proper **loading (skeleton) and error states** — never a blank screen.
- [x] **Hand-written Flexbox/Grid**, smooth across mobile / tablet / desktop breakpoints.

### Excellent tier (advanced)
- [x] **Event delegation** — a single listener on the grid and on the cart list handles all dynamic items.
- [x] **Sorting** (price ↑/↓, name A→Z / Z→A) combined with search + filter simultaneously.
- [x] **Cart count badge** on the navbar, synced across pages and across tabs (`storage` event).
- [x] **"Load more" pagination** for the product list.
- [x] **Polish**: skeleton loaders, **toast** notifications, **debounce** on the search box.
- [x] **Clean code**: reusable modules/functions, no duplication, consistent naming, this README.

---

## 🧪 How to test the key flows
1. **Home** loads → skeletons appear → product grid renders.
2. Type in **search** (debounced), pick a **category**, change **sort** → grid updates instantly; combine all three.
3. Click **Load more** → 8 more products appear.
4. Click **Add** on a card → toast shows, navbar badge bumps.
5. Open a product via **Details** → detail page reads `?id=`; pick a quantity and add to cart.
6. Open **Cart** → adjust quantities (+/−), remove items, watch the total update; **Empty cart** shows the empty state.
7. Open a second tab on **Cart** → change the cart in tab 1 → badge/total update in tab 2.
8. **Register** → submit empty → per-field errors; fill correctly → success message + toast.
9. Disconnect the network and reload Home → friendly **error state** with a **Try again** button.

---

## 🛠️ Tech
| Area | Choice |
|---|---|
| Markup | Semantic HTML5 |
| Styling | Hand-written CSS (Flexbox + Grid) + **Bootstrap 5** + Bootstrap Icons + Poppins |
| Logic | **Vanilla JavaScript** (ES2020), `async/await` |
| Data | **Fake Store API** via **Fetch API** |
| Persistence | `localStorage` |

---

## 📋 Git history
Work was committed incrementally (skeleton → styling → fetch → detail → cart → validation → advanced features → docs) rather than as a single "final" commit.
