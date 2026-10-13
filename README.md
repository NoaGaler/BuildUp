# BuildUp
### Home Renovation & Design Community Platform

A full-stack web application connecting homeowners with renovation and interior design professionals through project discovery, professional profiles, reviews, and job opportunities.

**Tech Stack:** React · Vite · Node.js · Express · MySQL

[Live Demo](https://build-up-ra99.vercel.app/) · [GitHub Repository](https://github.com/NoaGaler/BuildUp)

---

## Overview

BuildUp is a web platform designed to connect homeowners with renovation and interior design professionals. Users can explore projects, discover professionals, read reviews, and browse job opportunities.

The application follows a client-server architecture, with a React frontend communicating with a Node.js and Express backend connected to a MySQL relational database.

## Core Features

### Project Discovery & Management
- Browse renovation and design projects.
- Filter projects by category, search text, and professional.
- Create, update, and delete projects through dedicated API endpoints.
- View project details and associated images.
- Manage project comments and personal favorites.

### Professional Profiles & Reviews
- Browse professional profiles, categories, and specialties.
- View detailed professional information.
- Retrieve reviews and ratings for individual professionals.
- Submit, edit, and delete professional reviews.

### Jobs & Opportunities
- Browse open renovation job listings.
- View individual job details.
- Create, update, and delete job listings through the API.

### Authentication & User Roles
- Two-step registration flow.
- Password hashing using `bcrypt`.
- JWT-based authentication.
- Bearer token verification through dedicated authentication middleware.
- Authentication-state synchronization when the application loads or reloads.
- Role-aware workflows for homeowners and professionals.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, Vite, React Router v6 |
| State Management | React Context API |
| HTTP Client | Axios |
| Backend | Node.js, Express 5 |
| Database | MySQL, `mysql2/promise` |
| Authentication | JSON Web Tokens (JWT), `bcrypt` |
| File Uploads | Multer |
| Database Access | Connection pooling, parameterized SQL queries |
| Configuration | Environment variables with `dotenv` |

## Application Architecture

### Frontend

The frontend is built with React and Vite, with React Router v6 handling navigation and the Context API managing shared application state.

Dedicated context modules organize state for:
- Authentication
- Projects
- Jobs
- Professional profiles
- Favorites
- Comments
- Categories

An Axios-based API service centralizes HTTP communication and attaches the JWT to request headers.

### Backend

The backend runs on Node.js and Express and exposes REST API endpoints organized by application domain.

The server includes dedicated routes for authentication, projects, jobs, professional profiles, reviews, comments, favorites, and categories.

Request handling is supported by authentication and validation middleware, while database operations use a MySQL connection pool.

### Database

BuildUp uses MySQL with `mysql2/promise` for asynchronous database access and connection pooling.

Parameterized SQL queries are used for database operations, helping reduce the risk of SQL injection from untrusted query values.

## Authentication Flow

The registration process consists of two stages:

1. **Registration — Step 1:** Checks email availability, validates registration input, and hashes the password using `bcrypt`.
2. **Registration — Step 2:** Completes the user's profile information and assigns a role.

After login, the server returns a JWT and role information. The frontend attaches the token to API requests, and authentication middleware verifies Bearer tokens using the configured JWT secret.

The `GET /api/auth/check-auth` endpoint supports authentication-state synchronization when the application loads or reloads.

## API Overview

| Endpoint | Main Capabilities |
|---|---|
| `/api/auth` | Registration, login, authentication-state checks |
| `/api/projects` | Project listing, filtering, retrieval, creation, updates, deletion |
| `/api/jobs` | Job listing, retrieval, creation, updates, deletion |
| `/api/profiles` | Professional directory, profile retrieval, profile updates |
| `/api/reviews` | Professional reviews and ratings |
| `/api/comments` | Project comments |
| `/api/favorites` | User-specific project favorites |
| `/api/categories` | Project and job categories |

Protected operations use authentication middleware, and dedicated validation modules handle input for relevant application operations.

## Security & Input Validation

- **Password hashing:** Passwords are hashed using `bcrypt` during registration.
- **JWT verification:** Authentication middleware verifies Bearer tokens.
- **Input validation:** Dedicated validation modules cover authentication, projects, jobs, profiles, reviews, comments, and favorites.
- **Parameterized SQL queries:** Database queries use parameterized inputs to help reduce SQL injection risk.
- **Environment-based configuration:** Configuration values, including the JWT secret, are read from environment variables.
- **File uploads:** Multer handles image uploads, and Express serves uploaded files through the `/uploads` route.

## Project Structure

The project separates the frontend and backend, with dedicated modules for state management, API communication, routing, validation, and database access.

```text
BuildUp/
├── client/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── services/
│       ├── App.jsx
│       └── main.jsx
│
└── server/
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── uploads/
    └── server.js
```

## Author

**Noa Galer**

[GitHub](https://github.com/NoaGaler) · [LinkedIn](https://www.linkedin.com/in/noa-galer)

---

*BuildUp — connecting renovation projects, professionals, and ideas.*
