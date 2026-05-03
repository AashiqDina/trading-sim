# Trading Simulator - Frontend

A React-based frontend for a stock trading simulator that allows users to explore trending stocks, manage a virtual portfolio and track profit and loss in real time.

The project focuses on clean architecture, strong data handling, and a wide test coverage across API and state logic.

---

## Features

### Trending Stocks Dashboard
- Fetches and displays trending stocks from the backend  
- Handles partial or failed API responses gracefully  

### Portfolio Management
- View owned stocks in a sortable and filterable table  
- Track:
  - Total invested  
  - Current value  
  - Profit / loss  
- Delete holdings with confirmation modals  

### Stock Details
- View detailed company information  
- Display stock logos and metadata  
- Calculate gains/losses dynamically  

### Authentication-aware UI
- Reacts to login state  
- Protected routes for portfolio and user-specific data  

### Resilient UX
- Loading states for all async operations  
- Defensive rendering against incomplete or failed API responses  
- Centralised error handling using custom `ApiError`

---

## Tech Stack

- **React**
- **TypeScript**
- **Axios / Fetch API**
- **Jest**
- **React Testing Library**
- **HTML / CSS**

---

## Testing & Code Quality

This project places a strong emphasis on reliability and defensive programming.

### Test Coverage

- Statements: 87.26%
- Branches: 77.83%
- Functions: 83.23%
- Lines: 88.91%

## Architecture & Design Decisions

- Clear separation between:
  - Data-fetching (API layer)  
  - UI components  
  - Hooks (state orchestration)  
- Emphasis on:
  - Predictable state management  
  - Readable and maintainable code  
  - Defensive programming against unreliable APIs  
- Caching strategies used for:
  - Stock names  
  - Stock images  
  to reduce redundant API calls  

---

## Key Learning Outcomes

- Designing and testing robust API layers  
- Handling async errors consistently across an application  
- Writing meaningful unit tests
- Structuring scalable React applications  

---

## Challenges & Decisions
Handling unreliable API responses => implemented defensive error handling with ApiError
Reducing redundant stock requests => introduced caching (~20% reduction)
Avoiding excessive re-renders => optimised React state usage

---

## Live Demo

https://aashiqdina.github.io/trading-sim/
