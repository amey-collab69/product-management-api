# Product Management System (React + json-server)

Learning project demonstrating full CRUD using **React + Axios + json-server**.

## Features
- Dashboard with totals
- Products list with **search by name** and **filter by category**
- Add product (POST)
- Edit product (PUT)
- Delete product (DELETE) with confirmation
- Product details page (GET by id)
- Toast notifications for success/error

## Tech
- React (Functional components)
- React Router
- Axios
- json-server

---

## Setup
### 1) Install dependencies (from this folder)
```bash
cd product-management-system
npm install
```

### 2) Run backend (json-server)
```bash
npm run start:api
```
Backend runs at: http://localhost:3001

### 3) Run frontend (Vite)
In a new terminal:
```bash
npm run dev
```
Frontend runs at: http://localhost:5173

> Note: Vite proxies `/api` to `http://localhost:3001`.

---

## Backend data
`db.json` contains initial sample products with fields:
- id
- name
- category
- price
- quantity
- description

CRUD endpoints provided by json-server:
- GET    `/products`
- GET    `/products/:id`
- POST   `/products`
- PUT    `/products/:id`
- DELETE `/products/:id`

---

## Folder structure
- `src/components` (Sidebar, ToastProvider, ConfirmDialog, buttons)
- `src/pages` (Dashboard, Products list, Add/Edit/Details)
- `src/services` (Axios instance + products API)
- `src/routes` (Layout + routing)
- `src/styles` (global + component styles)


