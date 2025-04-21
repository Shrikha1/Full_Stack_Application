# Full Stack Application Backend

## Overview
This is the backend for a production-grade full-stack application featuring:
- Node.js (Express)
- PostgreSQL (via Sequelize)
- JWT authentication (access & refresh tokens, session via httpOnly cookies)
- Salesforce integration (jsforce, OAuth2/token)
- TypeScript for type safety
- Security best practices (helmet, CORS, rate limiting)

---

## Setup Instructions

### 1. Clone the repository
```sh
git clone <your-repo-url>
cd backend
```

### 2. Install dependencies
```sh
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your credentials:
```sh
cp .env.example .env
```

**Key variables:**
- `DATABASE_URL` (Postgres connection string)
- `JWT_SECRET`, `JWT_REFRESH_SECRET` (generate strong secrets)
- Salesforce credentials (`SF_CLIENT_ID`, `SF_CLIENT_SECRET`, etc.)
- `CORS_ORIGIN` (your frontend URL)

### 4. Database Migration
(If using Sequelize migrations)
```sh
npm run migrate
```

### 5. Start the server
```sh
npm run dev
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login, sets refresh token cookie
- `POST /api/auth/refresh-token` — Get new access token using refresh token cookie
- `POST /api/auth/logout` — Logout, clears refresh token cookie

### Salesforce
- `GET /api/salesforce/accounts?page=1&pageSize=10` — Paginated accounts (protected)
- `GET /api/salesforce/accounts/:id` — Get account by Id (protected)

---

## Salesforce Setup Guide
- Create a Salesforce Connected App for OAuth2/token access.
- Get your client ID, secret, username, password, and security token from Salesforce.
- Fill these in your `.env` file.

---

## Environment Variables Reference
See `.env.example` for all required variables.

---

## Deployment (Heroku Example)
- Ensure `Procfile` exists with: `web: npm run start`
- Set all environment variables in Heroku dashboard or via CLI.
- Use Postgres add-on or external DB.

---

## Architecture Overview
- **Controllers**: HTTP request/response only
- **Services**: Business logic (DB, Salesforce)
- **Middleware**: Auth, validation, error handling, logging
- **Models**: Sequelize models
- **Config**: Centralized env/config
- **Utils**: Logging, helpers

---

## Security & Best Practices
- All passwords are hashed with bcrypt
- JWT secrets are never checked into version control
- All sensitive data is kept out of logs and responses
- Helmet, CORS, and rate limiting are enabled

---

## Known Limitations / Challenges
- Salesforce API rate limits may apply
- No email verification on registration (can be added)
- No account lockout for repeated failed logins (can be added)
- Refresh token blacklisting/revocation not implemented (can be added)

---

## Contributing
- Use conventional commits
- Run linter and tests before PRs

---

## License
MIT
