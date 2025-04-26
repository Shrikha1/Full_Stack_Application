# Full Stack Application with Vue.js, Node.js, and Salesforce Integration

A production-ready full-stack web application with Vue.js 3 frontend, Node.js/Express backend, and Salesforce integration.

---

## 🚀 Live Demo

- **Frontend (Netlify):** [https://680c60fe649735669205fdd5--stellar-unicorn-be7810.netlify.app](https://680c60fe649735669205fdd5--stellar-unicorn-be7810.netlify.app)
- **Backend (Render):** [https://full-stack-application-zvvd.onrender.com](https://full-stack-application-zvvd.onrender.com)

---

## 🚀 Features

- User authentication with JWT
- Secure password hashing
- Salesforce integration for Account data
- Protected routes and API endpoints
- Responsive dashboard with pagination
- Unit tests for core functionality

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- Salesforce Developer Account
- Render Account (for backend deployment)
- Netlify Account (for frontend deployment)

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
| POST   | /api/auth/register               | Register user                 |
| POST   | /api/auth/login                  | Login and get JWT             |
| GET    | /api/auth/session                | Check session (JWT/cookie)    |
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