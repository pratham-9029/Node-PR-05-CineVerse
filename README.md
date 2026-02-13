<p align="center">
  <img src="https://img.shields.io/badge/node.js-v18+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/express-v5-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/mongodb-v7+-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/EJS-Templating-B4CA65?style=for-the-badge&logo=ejs&logoColor=black" alt="EJS" />
  <img src="https://img.shields.io/badge/license-ISC-blue?style=for-the-badge" alt="License" />
</p>

<h1 align="center">🎬 CineVerse</h1>

<p align="center">
  <strong>A futuristic, glassmorphism-powered movie management platform.</strong><br/>
  Curate, organize, and experience your film collection like never before.
</p>

<p align="center">
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-feature-roadmap">Roadmap</a> •
  <a href="#-live-demonstration">Demo</a> •
  <a href="#-under-the-hood">Architecture</a> •
  <a href="#-api-reference">API</a>
</p>

---

## ⚡ Quick Start

```bash
# 1 — Clone & enter
git clone https://github.com/your-username/CineVerse.git
cd CineVerse

# 2 — Install dependencies
npm install

# 3 — Configure environment
cp .env.example .env
# → Fill in PORT and MONGODB_URL

# 4 — Launch dev server
npm run dev

# Server starts at → http://127.0.0.1:3000
```

> **Time to first page: ~30 seconds.** You only need Node.js ≥ 18 and a running MongoDB instance.

---

## 🗺️ Feature Roadmap

Track what's been shipped and what's on the horizon.

### Completed Milestones

- [x] **Secure User Authentication** — Registration & login with bcrypt hashing (12 salt rounds), RFC 5322 email validation, and strict password complexity enforcement
- [x] **Interactive Movie Dashboard** — Responsive card grid with poster images, ratings, genre tags, and real-time collection statistics
- [x] **Glassmorphism UI / Futuristic Noir Design** — Custom design system with `backdrop-filter` glass cards, neon accent palette (Cyan · Violet · Magenta), ambient glow animations, and noise-texture overlays
- [x] **Full CRUD Operations** — Create, read, update, and delete movies with image poster upload support via Multer
- [x] **Drag & Drop Reordering** — Native HTML5 drag-and-drop to rearrange movie cards; order persisted to the database in real-time
- [x] **Client-Side Search & Filter** — Instant search by title, genre, or description with dynamic genre filter chips
- [x] **AJAX-First Architecture** — Dual-mode controllers that serve JSON for `fetch` requests and HTML for traditional navigation
- [x] **Image Upload Pipeline** — Multer middleware with timestamped filenames and automatic cleanup on delete/update
- [x] **Responsive Mobile Navigation** — Hamburger menu with accessible `aria` attributes and smooth transitions
- [x] **Modern Typography Stack** — Outfit (display), Space Grotesk (body), and JetBrains Mono (code/badges) via Google Fonts
- [x] **Toast Notification System** — Non-blocking success/error notifications with auto-dismiss
- [x] **Delete Confirmation Modal** — Accessible modal dialog preventing accidental deletions

### Planned

- [ ] JWT/session-based route protection (auth middleware)
- [ ] User-specific movie collections (multi-tenancy)
- [ ] Movie search powered by a third-party API (e.g., TMDB)
- [ ] Dark/light theme toggle
- [ ] Pagination or infinite scroll for large collections

---

## 🎬 Live Demonstration

A walkthrough of the core user interaction flow — from guest to power user.

### 1 · Landing Page (Guest)

A visitor arrives at `/admin` and is greeted by the **Hero Section** — a cinematic headline with gradient text, a glowing badge, and two CTAs: _Browse Collection_ and _Add Movie_. Below, three **Feature Cards** (glassmorphism) highlight Smart Cataloging, Drag & Drop Sorting, and Instant Updates.

### 2 · Account Creation

Clicking **Sign Up** in the navigation bar takes the guest to `/auth/sign-up`.

| Field    | Validation Rules                                                                |
| -------- | ------------------------------------------------------------------------------- |
| Name     | Required · 2–50 characters                                                      |
| Email    | Required · RFC 5322 format · unique (case-insensitive)                          |
| Password | Required · 8+ chars · 1 uppercase · 1 lowercase · 1 digit · 1 special character |

On success, the server responds with `201 Created` and the user's profile payload. Duplicate emails return `409 Conflict`.

### 3 · Login

From `/auth/login`, the user submits their credentials. The server explicitly selects the hashed password (`select: false` by default), compares it via `bcrypt.compare()`, and updates the `lastLogin` timestamp on success.

### 4 · Adding a Movie

Navigating to `/movies/add-movies` presents a **glass-morphism form** with fields for:

| Field  | Type   | Description                          |
| ------ | ------ | ------------------------------------ |
| Title  | `text` | Movie name                           |
| About  | `text` | Short synopsis                       |
| Genre  | `text` | Genre tag (e.g., Sci-Fi)             |
| Rating | `text` | Rating out of 5                      |
| Image  | `file` | Poster upload (stored in `/uploads`) |

The form supports both traditional `POST` submission (redirect) and AJAX submission (JSON response).

### 5 · Browsing & Managing the Collection

At `/movies/view-movies`, the user sees:

- **Stats Bar** — Total movies, unique genres, and average rating computed in real-time
- **Search Box** — Filters cards instantly by title, genre, or description
- **Genre Chips** — One-click genre filters dynamically generated from the collection
- **Movie Cards** — Each card shows a poster, rating badge, genre label, synopsis, and Edit / Delete actions
- **Drag & Drop** — Grab any card's drag handle to reorder; the new `position` values are persisted via a `PUT /movies/reorder` call

### 6 · Editing & Deleting

- **Edit**: Opens a pre-populated form at `/movies/edit-movie/:id`. If a new image is uploaded, the old file is deleted from disk automatically.
- **Delete**: Triggers a **confirmation modal**. On confirm, the movie document and its poster file are removed.

---

## 🔧 Under the Hood

### Project Architecture

CineVerse follows the **MVC (Model–View–Controller)** pattern with Express 5 and EJS templating.

```
CineVerse/
├── config/                     # ⚙️  Application configuration
│   ├── database.js             #     MongoDB connection via Mongoose
│   └── dotenv.js               #     Centralized env variable export
│
├── controller/                 # 🎮  Business logic layer
│   ├── admin.controller.js     #     Home page & admin view renderers
│   ├── auth.controller.js      #     Register & login (JSON API)
│   └── movie.controller.js     #     Movie CRUD + reorder (dual-mode)
│
├── middleware/                  # 🛡️  Request pipeline middleware
│   └── imageUploads.js         #     Multer disk storage (→ /uploads)
│
├── models/                     # 📦  Mongoose schema definitions
│   ├── movieModel.js           #     Movie: title, about, genre, rating, image, position
│   └── userModel.js            #     User: name, email, password (hashed), role, lastLogin
│
├── routers/                    # 🛤️  Express route definitions
│   ├── index.js                #     Central router (mounts sub-routers)
│   ├── admin.route.js          #     /admin/*
│   ├── auth.route.js           #     /auth/*
│   └── movie.route.js          #     /movies/*
│
├── views/                      # 🖼️  EJS templates
│   ├── index.ejs               #     Landing / hero page
│   ├── pages/
│   │   ├── add-movie.ejs       #     Add movie form
│   │   ├── edit-movie.ejs      #     Edit movie form (pre-populated)
│   │   ├── login.ejs           #     Login page
│   │   ├── sign-up.ejs         #     Registration page
│   │   └── view-movie.ejs      #     Browse collection (grid + search + drag & drop)
│   └── partials/
│       ├── header.ejs          #     Navbar, toast container, delete modal
│       └── footer.ejs          #     Footer & shared scripts
│
├── public/                     # 🌐  Static assets
│   └── styles.css              #     Complete design system (~1,740 lines)
│
├── uploads/                    # 📁  User-uploaded movie posters (gitignored)
├── .env.example                #     Environment variable template
├── index.js                    #     Application entry point
└── package.json                #     Dependencies & scripts
```

### Backend Logic Breakdown

| Layer                  | Responsibility                                                                                                                                                                                                                                                                            |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Entry** (`index.js`) | Bootstraps Express 5, registers middleware (`body-parser`, `express.json`, `express.static`), mounts the central router, and starts the HTTP server.                                                                                                                                      |
| **Config**             | `dotenv.js` loads `.env` into a typed `envConfig` object. `database.js` opens a Mongoose connection on import (auto-invoked).                                                                                                                                                             |
| **Router**             | `routers/index.js` composes three sub-routers under `/admin`, `/movies`, and `/auth`. Each sub-router maps HTTP verbs to controller methods.                                                                                                                                              |
| **Controller**         | Controllers are plain objects with handler functions. `movie.controller.js` uses **content negotiation** (`Accept: application/json`) to serve JSON or redirect — enabling both AJAX and form-based workflows from the same endpoint.                                                     |
| **Model**              | `userModel.js` features a `pre('save')` hook for automatic bcrypt hashing, a `comparePassword()` instance method, and field-level validation with custom error messages. `movieModel.js` is intentionally lean, storing only essential metadata + a `position` field for custom ordering. |
| **Middleware**         | `imageUploads.js` configures Multer with `diskStorage`, storing files in `/uploads` with `Date.now()-originalname` naming to prevent collisions.                                                                                                                                          |

### Design System Highlights

| Token            | Value                                                             |
| ---------------- | ----------------------------------------------------------------- |
| Background       | `#06060e` (deep noir)                                             |
| Accent Cyan      | `#00f0ff`                                                         |
| Accent Violet    | `#8b5cf6`                                                         |
| Accent Magenta   | `#ff006e`                                                         |
| Glass Background | `rgba(255, 255, 255, 0.04)` + `backdrop-filter: blur(16px)`       |
| Display Font     | **Outfit** (800 for headings)                                     |
| Body Font        | **Space Grotesk** (400–600)                                       |
| Mono Font        | **JetBrains Mono** (badges, labels)                               |
| Corner Radius    | `8px` / `14px` / `20px` / `28px`                                  |
| Transitions      | `0.2s` fast · `0.4s` smooth · `0.5s` bounce (custom cubic-bezier) |

---



### Available Scripts

| Script          | Command       | Description                               |
| --------------- | ------------- | ----------------------------------------- |
| **Development** | `npm run dev` | Start with Nodemon (auto-restart on save) |
| **Production**  | `npm start`   | Start with plain `node index.js`          |

---

## 🧰 Tech Stack

| Category       | Technology                                           |
| -------------- | ---------------------------------------------------- |
| **Runtime**    | Node.js (ES Modules)                                 |
| **Framework**  | Express 5                                            |
| **Templating** | EJS                                                  |
| **Database**   | MongoDB + Mongoose 9                                 |
| **Auth**       | bcryptjs (password hashing)                          |
| **Uploads**    | Multer (disk storage)                                |
| **Styling**    | Vanilla CSS (custom design system, ~1,740 lines)     |
| **Fonts**      | Google Fonts (Outfit, Space Grotesk, JetBrains Mono) |
| **Dev Tools**  | Nodemon, dotenv                                      |

---

<p align="center">
  <sub>Built with ☕ and 🎬 by <strong>Pratham</strong></sub>
</p>
