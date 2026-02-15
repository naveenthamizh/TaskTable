# 🗂️ Task Management Dashboard

A modern **Task Management Dashboard** , built with **React**, **TypeScript**, and **Vite**.  
The application supports **sorting**, **pagination**, and **local state management** using **Context API**.

**Deployment Link**: https://task-table-33li.vercel.app/

---

## ✨ Features

### 🧩 Core Features

- View tasks in a **tabular format**
- Create, edit, and delete tasks
- Task fields:
  - Title
  - Description
  - Status (Pending / In Progress / Completed)
  - Created Date
  - Due Date

### 📊 Task Overview

- Dashboard showing task counts by status
- Status badges with contextual colors

### 📄 Pagination

- Client-side pagination
- Configurable rows per page (default: 10)

### 🔃 Sorting

- Sort tasks by:
  - **Created Date**
  - **Due Date**
- Supports ascending & descending order

### 🎨 UI & UX

- Clean, minimal, SaaS-style UI
- Responsive layout
- Accessible pagination controls

---

## 🛠️ Tech Stack

- **React**
- **TypeScript**
- **Vite**
- **Context API + Reducer**
- **Day.js**
- **CSS Modules**

---

## 📁 Project Structure

```text
src/
├── common/
│   ├── components/        # Reusable UI components
│   ├── context/           # Context & reducer logic
│   ├── hooks/             # Custom hooks
│   └── icons/             # icons
│   ├── styles/            # commonly used variables for styling
│
├── features/
│   └── taskboard/
│       ├── components/    # TaskBoard-specific components
│       ├── index.tsx      # Taskboard entry
│
├── App.tsx
├── main.tsx
└── index.css
```
