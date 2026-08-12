#  StoreApp - Modern E-Commerce Web Application

A fast, responsive, and feature-rich e-commerce store frontend built with **React**, **Vite**, and **Tailwind CSS**. This application features a dynamic product catalog, interactive search/category filtering, and a real-time shopping cart system powered by REST API integration.

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green)

---

 **Live Demo:** [https://store-app-lake-delta.vercel.app](https://store-app-lake-delta.vercel.app)

---

##  Features

-  **Dynamic Product Catalog:** Fetches and displays live product data dynamically via REST API integration.
-  **Real-Time Search & Filtering:** Filter products instantly by category or search terms.
-  **Interactive Cart System:** Seamlessly add products, update item quantities, and view real-time subtotal calculations.
-  **Fully Responsive Layout:** Optimized for mobile, tablet, and desktop screens using modern CSS utility classes.
-  **High Performance:** Instant hot module replacement (HMR) and optimized production builds powered by Vite.

---

##  Tech Stack

- **Frontend Library:** React 18
- **Build Tool:** Vite
- **Styling & UI:** Tailwind CSS, PostCSS, Autoprefixer
- **Icons:** Lucide React
- **State Management:** React Hooks (`useState`, `useEffect`)
- **API Handling:** Fetch API / REST API Integration

---

##  What I Learned

Building this project helped me put core frontend software engineering concepts into practice:

- React Component Structure: Learned how to break down a complete user interface into clean, modular, and reusable components instead of writing everything in a single bloated file.
- State Management & Hooks: Practiced using `useState` to manage interactive features like cart items and quantity updates, alongside `useEffect` to fetch live data when components mount.
- Responsive Styling with Tailwind CSS: Got practical experience applying utility-first styling to build layouts that automatically adapt across mobile, tablet, and desktop screens.
- Working with Asynchronous APIs: Gained hands-on experience handling async JavaScript requests, setting up loading states, and gracefully managing error states when rendering dynamic API data.

---

##  Project Structure

```text
store-app/
├── public/              # Static public assets
├── src/
│   ├── assets/          # Image files & brand assets
│   ├── components/      # Reusable React UI components
│   ├── App.jsx          # Main application structure & state logic
│   ├── index.css        # Tailwind directive configuration
│   └── main.jsx         # Application entry point
├── index.html           # HTML container template
├── tailwind.config.js   # Tailwind CSS setup & theme configurations
├── postcss.config.js    # PostCSS plugin settings
└── package.json         # Project metadata and dependencies


