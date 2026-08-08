# 🌌 NeonForge — Futuristic Cyberpunk Gaming Setup Store & Configurator

NeonForge is a premium, state-of-the-art landing page and interactive 2D build simulator designed for elite gamers to design, customize, and purchase their ultimate cyberpunk battlestations.

---

## 🛠️ Framework Choice & Rationale

This project is built using a modern **Laravel 9** + **React** + **Vite** stack.

### 1. Backend: Laravel 9
* **Why Laravel?** Laravel provides a secure, robust foundation for web applications. It simplifies session management (for cart persistence), environment-specific routing, and asset loading.
* **Database & API Ready**: Ready to scale with Eloquent ORM and API routing for handling setups customization logs and user orders.

### 2. Frontend: React
* **Why React?** The "Battlestation Architect" is a highly reactive interactive layout builder. React's virtual DOM, declarative state management, and component lifecycle hooks make managing dynamic options (Desk Size, Screen Types, LED Colorways, PC Tiers, Key Switches) clean and performant.

### 3. Bundler: Vite
* **Why Vite?** Provides near-instantaneous Hot Module Replacement (HMR) during development and generates highly optimized, split production bundles.

### 4. Styling: Tailwind CSS & Custom CSS
* Tailwind utility styling is combined with a dedicated vanilla CSS layout system (`app.css`) to enforce uniform product dimensions and resolve complex viewport responsiveness.

---

## 📁 Repository Structure

Below are the primary files powering NeonForge:

```bash
├── app/                       # Laravel Application Core (Controllers, Models, Middleware)
├── config/                    # Global Configuration settings
├── public/                    # Compiled assets & static files
│   └── images/                # Static asset storage
├── resources/
│   ├── css/
│   │   └── app.css            # Custom CSS system (desk layouts, image uniformity, glows)
│   ├── js/
│   │   ├── app.jsx            # React Entrypoint mounting the layout
│   │   └── components/
│   │       ├── NeonForge.jsx  # Core UI & Configurator state logic
│   │       ├── CursorGrid.jsx # Interactive cursor-following grid backdrop
│   │       └── TargetCursor.jsx # Cyberpunk targeting custom cursor
│   └── views/
│       └── welcome.blade.php  # Main Blade layout serving the SPA entrypoint
├── routes/
│   └── web.php                # Web routes serving the main index page
├── vite.config.js             # Asset bundler configuration for React + Vite
└── package.json               # Frontend dependencies & scripts
```

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have **PHP 8.x**, **Composer**, and **Node.js** installed.

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/Malaika46/responsive-ui.git
cd responsive-ui

# Install backend dependencies
composer install

# Install frontend dependencies
npm install
```

### 3. Environment Setup
```bash
cp .env.example .env
php artisan key:generate
```

### 4. Run Development Servers
```bash
# Start backend server
php artisan serve

# Start frontend bundler (Vite)
npm run dev
```
Open [http://localhost:8000](http://localhost:8000) or [http://127.0.0.1:8000](http://127.0.0.1:8000) in your browser.
