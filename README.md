# Trading Simulator – Frontend

A React-based frontend for a stock trading simulator that allows users to explore trending stocks, manage a virtual portfolio, and track profit and loss in real time. The application focuses on clean UI, predictable state management, and seamless integration with a backend API.

---

##  Features

* **Trending Stocks Dashboard**

  * Fetches and displays trending stocks from the backend
  * Handles partial or failed API responses gracefully

* **Portfolio Management**

  * View all owned stocks in a sortable, filterable table
  * See key metrics such as invested amount, current value, and profit/loss
  * Delete holdings with confirmation modals

* **Stock Details**

  * View individual stock information, including logos and metadata
  * Derived calculations for gains/losses based on real-world live prices

* **Authentication-aware UI**

  * Frontend reacts to authentication state
  * Protected routes for user-specific pages such as Portfolio

* **Resilient UI & UX**

  * Loading and error states for all async operations
  * Defensive rendering against incomplete backend responses

---

## 🛠️ Tech Stack

* **React**
* **TypeScript**
* **Axios**
* **Jest (Basic)**
* **HTML/CSS**

---

## 🎯 Design & Engineering Focus

* Clear separation between UI components and data-fetching logic
* Predictable state updates using React hooks and context
* Defensive programming to handle unreliable external data
* Readable, maintainable code over premature optimisation
