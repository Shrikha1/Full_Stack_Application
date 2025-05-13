# Full Stack Salesforce Auth & Dashboard Application

A modern, production-ready web application for secure user authentication and Salesforce account data integration. Built for assignment and real-world deployment, this project demonstrates robust auth, professional frontend/backend separation, and enterprise API integration.

---

## 📌 1. Project Overview
A full-stack web app that allows users to register, verify their email, log in, and securely access Salesforce account data via a beautiful dashboard. Features include:
- User authentication (JWT, email verification)
- Secure access to Salesforce data (accounts, pagination)
- Responsive dashboard and robust error handling

---

## ⚙️ 2. Tech Stack & Architectural Decisions
- **Frontend:** Vue.js 3, Pinia, TypeScript, Axios, Vite
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** PostgreSQL, Prisma ORM
- **Authentication:** JWT (stateless), bcrypt for password hashing
- **Salesforce Integration:** jsforce
- **Deployment:** Render (backend), Netlify (frontend)

**Architecture:**
- `backend/src/` contains controllers (auth, salesforce), middleware (JWT, error, CORS), and Prisma models
- `frontend/src/` contains views (auth, dashboard), router, Pinia store, and API service
- All secrets and config are managed via `.env` files (never committed)
- Passwords are always hashed; JWT tokens are signed and verified securely
- CORS and helmet middleware protect backend endpoints

---

## 💻 3. Setup Instructions

### Backend
```bash
cd backend
npm install
cp .env.example .env    # Edit with your DB, JWT, Salesforce details
npm run dev             # or npm run build && npm start
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env    # Set VITE_API_BASE_URL to backend URL
npm run dev             # or npm run build && npm preview
```

### Environment Variables
- See `.env.example` in both backend and frontend for all required keys
- PostgreSQL must be running and accessible from backend
- Salesforce Connected App credentials required for integration

---

## 🚀 4. Deployment Details
- **Backend:** Deployed to Render (auto-deploy from GitHub)
- **Frontend:** Deployed to Netlify (auto-deploy from GitHub)
- `.env` files are managed per environment (dev/prod)
- [Live Demo](https://680c60fe649735669205fdd5--stellar-unicorn-be7810.netlify.app) | [API](https://full-stack-application-zvvd.onrender.com)

---

## 🧪 5. Testing the Application with cURL

### Register a User
```bash
curl -X POST https://full-stack-application-zvvd.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"Test123!"}'
```

### Login and Retrieve JWT
```bash
curl -X POST https://full-stack-application-zvvd.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"Test123!"}'
```

### Access Dashboard (Authenticated Route)
```bash
curl -X GET https://full-stack-application-zvvd.onrender.com/api/salesforce/accounts \
  -H "Authorization: Bearer <PASTE_YOUR_JWT_TOKEN_HERE>"
```

### Attempt Unauthorized Access
```bash
curl -X GET https://full-stack-application-zvvd.onrender.com/api/salesforce/accounts
# Response: {"message":"No token provided"}
```

### Fetch Salesforce Account Data
```bash
curl -X GET https://full-stack-application-zvvd.onrender.com/api/salesforce/accounts \
  -H "Authorization: Bearer <PASTE_YOUR_JWT_TOKEN_HERE>"
```

---

## 🧭 6. Frontend Navigation
- `/login` — User login page
- `/register` — Registration page
- `/verify-email/:token` — Email verification route
- `/dashboard` — Protected dashboard (requires JWT)
- `/verified-success` — Shown after successful email verification

**On login:**
- Success: JWT is stored, user is routed to `/dashboard`
- Failure: Error message shown, no token stored
- Session persists via localStorage (auto-login on refresh)
- Unauthorized users are redirected to `/login`

---

## 🧱 7. System Design Insights
- **JWT** chosen for stateless, scalable authentication
- Backend is stateless (no sessions on server), ideal for cloud deployment
- Passwords are never stored in plaintext (bcrypt)
- All API routes are protected by middleware
- Pagination is used for large Salesforce data sets
- `.env` files and CORS protect secrets and endpoints

---

## 🌟 8. Bonus Features
- Pagination for Salesforce account data
- TypeScript throughout (frontend & backend)
- Modern, accessible UI (responsive, keyboard-friendly)
- Email verification & resend functionality
- SPA routing with Netlify `_redirects` for deep links

---

## 🧩 9. Challenges Faced
- Handling Salesforce OAuth and API rate limits in dev
- Debugging CORS and secure cookie/session flows
- TypeScript type mismatches in Prisma and API contracts
- Managing state when JWT expires or user is unverified

---

## 📁 10. Folder Structure (Backend Example)
```
backend/
├── src/
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   └── salesforce.controller.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   └── error.middleware.ts
│   ├── utils/
│   │   └── email.ts
│   ├── lib/
│   │   └── prisma.ts
│   └── index.ts
├── prisma/
│   └── schema.prisma
├── .env.example
├── package.json
└── ...
```

---

## 🔒 Security Considerations
- Passwords are always hashed (bcrypt)
- JWT secret is never exposed
- All API endpoints are protected by auth middleware
- Environment variables are used for all secrets
- CORS and helmet used for HTTP security

---

## 📈 Next Steps
- Expand tests (unit/integration)
- Add Salesforce OAuth flow for per-user data
- Improve error reporting and monitoring
- Enhance UI/UX for accessibility

---

For any questions, please contact the project maintainer.

## 🚀 Features

- User authentication with JWT
- Secure password hashing
- Salesforce integration with user verification
- Protected routes and API endpoints
- Responsive dashboard with pagination
- Unit tests for core functionality

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- Salesforce Developer Account
- Render Account (for backend deployment)
- Netlify Account (for frontend deployment)

## 📝 Salesforce Configuration

1. Create a Salesforce Connected App and get:
   - Client ID
   - Client Secret
   - Username
   - Password
   - Security Token

2. Update your `.env` file with Salesforce credentials:
   ```env
   SALESFORCE_CLIENT_ID=your_client_id
   SALESFORCE_CLIENT_SECRET=your_client_secret
   SALESFORCE_USERNAME=your_sf_username
   SALESFORCE_PASSWORD=your_sf_password
   SALESFORCE_TOKEN=your_sf_token
   ```

## 🛠️ Tech Stack

- **Frontend**: Vue.js 3, Pinia, Axios, Vite
- **Backend**: Node.js, Express.js, Sequelize
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Salesforce Integration**: jsforce
- **Deployment**: Render (backend), Netlify (frontend)

---

## 🚀 Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Update the `.env` file with your configuration, for example:
   ```env
   PORT=3000
   DATABASE_URL=postgres://user:password@localhost:5432/dbname
   JWT_SECRET=your_jwt_secret
   SALESFORCE_CLIENT_ID=your_sf_client_id
   SALESFORCE_CLIENT_SECRET=your_sf_client_secret
   SALESFORCE_USERNAME=your_sf_username
   SALESFORCE_PASSWORD=your_sf_password
   SALESFORCE_TOKEN=your_sf_token
   CORS_ORIGIN=https://680c60fe649735669205fdd5--stellar-unicorn-be7810.netlify.app
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Update the `.env` file with your configuration:
   ```env
   VITE_API_BASE_URL=https://full-stack-application-zvvd.onrender.com
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🌐 Environment Variables

### Backend `.env.example`
```
PORT=3000
DATABASE_URL=postgres://user:password@localhost:5432/dbname
JWT_SECRET=your_jwt_secret
SALESFORCE_CLIENT_ID=your_sf_client_id
SALESFORCE_CLIENT_SECRET=your_sf_client_secret
SALESFORCE_USERNAME=your_sf_username
SALESFORCE_PASSWORD=your_sf_password
SALESFORCE_TOKEN=your_sf_token
CORS_ORIGIN=https://680c60fe649735669205fdd5--stellar-unicorn-be7810.netlify.app
```

### Frontend `.env.example`
```
VITE_API_BASE_URL=https://full-stack-application-zvvd.onrender.com
```

---

## 🔑 Key API Endpoints

| Method | Endpoint                        | Description                   |
|--------|----------------------------------|-------------------------------|
| POST   | /api/auth/register               | Register with Salesforce credentials |
| POST   | /api/auth/login                  | Login with Salesforce verification |
| POST   | /api/auth/logout                 | Logout user                   |
| GET    | /api/salesforce/accounts         | Get Salesforce Accounts       |
| GET    | /api/salesforce/accounts/:id     | Get Account by ID             |
| GET    | /api/user/profile                | Get current user profile      |

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

---

## 🏗️ High-Level Design Considerations

- See original documentation for architecture, security, performance, scalability, and integration notes.

---

## ✅ Manual QA Checklist

- [ ] Register, login, and dashboard access
- [ ] Session persists after browser refresh
- [ ] Protected routes redirect unauthenticated users
- [ ] Error handling: invalid login, expired session, Salesforce errors
- [ ] Logout works and session is cleared

---

## 🚀 Deployment

- **Backend:** Deployed on Render, auto-deploy from GitHub
- **Frontend:** Deployed on Netlify, auto-deploy from GitHub

---

## 📈 Next Steps

- Set up CI/CD for backend (GitHub Actions)
- Expand backend and frontend tests
- Review security and CORS settings
- Finalize documentation and .env.example files

## 🔒 Security Considerations

- All passwords are hashed using bcrypt
- JWT tokens are stored securely
- API routes are protected with authentication middleware
- Environment variables are used for sensitive data
- CORS is properly configured
- Input validation is implemented

## 📝 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request