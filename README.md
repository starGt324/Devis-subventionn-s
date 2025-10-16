
# AH Digital — Devis Subventionnés

Welcome to **AH Digital**, a web application designed to simplify the management of subsidized quote requests for renewable energy solutions (photovoltaic panels & heat pumps) in Suisse romande. This README will guide you through the app, its purpose, core functionalities, and how to set up the project locally.

---

## 🌟 Purpose & Overview

AH Digital allows **clients** and **service providers** to interact efficiently:

- **Clients** can:
  - Submit quote requests for photovoltaic or heat pump projects
  - Track the status of their requests
  - Compare received quotes from multiple providers
  - Download comparison reports and access project resources via QR codes

- **Service Providers** can:
  - View available requests matching their expertise
  - Submit quotes for client requests
  - Track performance stats and manage subscriptions
  - Receive notifications for new requests or updates

The app is multi-tenant, with role-based access for **Clients**, **Providers**, and admin features.

---

## ⚡ Core Functionalities

### Client Side
- **Dashboard:** View requests, quotes received, and notifications
- **Request Form:** Multi-step form to submit new quote requests
- **Quote Comparison:** View detailed breakdowns of all received quotes
- **PDF & QR Export:** Download comparison reports or generate QR codes for project videos
- **Account Management:** Profile and settings (coming soon)

### Provider Side
- **Dashboard:** View available requests and manage your quotes
- **My Quotes:** Track all submitted quotes
- **Performance Stats:** Track performance metrics and completed requests
- **Subscription Management:** Manage subscriptions (payments & plans)
- **Notifications:** Get alerted when new requests are available

---

## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS, Zustand, i18next
- **Backend:** NestJS, Mongoose, PostgreSQL
- **Authentication:** [Clerk](https://clerk.com/) for user auth and role management
- **Deployment:** Render / Vercel (Frontend & Backend)

---

## 📝 Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/your-org/ah-digital.git
cd ah-digital
````

### 2. Install dependencies

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 3. Setup environment variables

Create a `.env` file in both **frontend** and **backend** with the following variables:

#### Backend `.env`

```env
PORT=5000
MONGO_URI=<Your MongoDB URI>
JWT_SECRET=<Your JWT Secret>
CLERK_API_KEY=<Your Clerk API Key>
CLERK_API_VERSION=v1
FRONTEND_URL=http://localhost:3000
```

#### Frontend `.env`

```env
VITE_CLERK_PUBLISHABLE_KEY=<Your Clerk Publishable Key>
VITE_BACKEND_URL=http://localhost:5000
```

### 4. Get Clerk Keys

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Copy your **Publishable Key** (frontend) and **API Key** (backend)
4. Add these keys to your respective `.env` files

### 5. Run the app locally

```bash
# Backend
cd backend
npm run start:dev

# Frontend
cd ../frontend
npm run dev
```

The frontend should be available at `http://localhost:8080`.

The backend should be available at `http://localhost:3000`.

---

## 🧩 Folder Structure

```
ah-digital/
├─ frontend/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ pages/
│  │  ├─ store/
│  │  └─ App.tsx
├─ backend/
│  ├─ src/
│  │  ├─ modules/
│  │  ├─ common/
│  │  └─ main.ts
├─ README.md
└─ package.json
```

---

## 🔑 Environment Variables

This app requires a few environment variables to work correctly. Below is a breakdown of each variable, its purpose, and how to obtain it.

### Frontend

| Variable | Description | How to Get |
|----------|-------------|------------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Public key for Clerk authentication | Go to [Clerk Dashboard](https://dashboard.clerk.com/) → Applications → Copy Publishable Key |
| `VITE_BACKEND_URL` | URL to your backend API | Usually `http://localhost:3000` for local dev or your deployed backend URL |

### Backend

| Variable | Description | How to Get |
|----------|-------------|------------|
| `PORT` | Port where the backend runs | Choose any open port (default 3000) |
| `CLERK_SECRET_KEY` | Private API key for Clerk | Clerk Dashboard → Applications → API Keys → Copy Secret Key |
| `FRONTEND_URL` | Frontend URL for redirects / callbacks | Local dev: `http://localhost:8080` or deployed frontend URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Service key for Supabase backend operations | Supabase Dashboard → API → Service Role Key |
| `SUPABASE_URL`|https://YOUR_ORGANIZATION_ID.supabase.co|
| `DATABASE_URL`| Click on "connect" button on the navbar of your supabase workspace and copy the connection pooling one (tho this one wont be necessary cuz SUPABASE_SERVICE_ROLE_KEY will take care of it all)|

### Notes

1. **Never commit `.env` files** containing secrets to GitHub or any public repo.
2. For local development, create a `.env` file in the root of `frontend` and `backend` with the appropriate variables.
3. If using Supabase, make sure the anon key is for **client-side** usage only, and the service role key is for **server-side** operations.



---

## 🎯 Next Steps & Notes

* Implement **account management** for clients and providers
* Integrate **payment gateways** for provider subscriptions
* Add **analytics dashboards** for super admins
* Ensure role-based access control (RBAC) works consistently across modules

---

## 🧑‍💻 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit changes (`git commit -m "Add my feature"`)
4. Push to branch (`git push origin feature/my-feature`)
5. Create a Pull Request

---

## 📞 Contact

For questions or assistance, reach out to **Iman Ik** (Project Lead).

---
