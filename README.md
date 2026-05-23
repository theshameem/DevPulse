# DevPulse

A modern issue tracking and management system built with TypeScript and Express.js. DevPulse enables teams to efficiently report, track, and manage bugs and feature requests with role-based access control.

**Live URL**: https://github.com/theshameem/DevPulse

---

## Features

- **User Authentication**: Secure signup and login with JWT tokens
- **Role-Based Access Control**: Support for contributor and maintainer roles
- **Issue Management**: Create, read, update, and delete issues
- **Issue Types**: Support for bug reports and feature requests
- **Issue Status Tracking**: Track issues through open, in-progress, and resolved states
- **User Authorization**: Fine-grained access control for issue updates and deletions
- **Secure Password Handling**: Encrypted passwords using bcryptjs

---

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js v5.2.1
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Encryption**: bcryptjs
- **Environment Management**: dotenv
- **Development**: tsx (TypeScript executor)

---

## Setup Steps

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (local or remote instance)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/theshameem/DevPulse.git
   cd DevPulse
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory and add:

   ```
   PORT=5000
   CONNECTIONSTRING=postgresql://username:password@localhost:5432/devpulse
   JWT_SECRET=your_jwt_secret_key
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```
   The server will start on the configured port (default: 5000)

---

## API Endpoint List

### Authentication Endpoints

| Method | Endpoint           | Description             | Auth Required |
| ------ | ------------------ | ----------------------- | ------------- |
| POST   | `/api/auth/signup` | Register a new user     | No            |
| POST   | `/api/auth/login`  | Login and get JWT token | No            |

### Issue Endpoints

| Method | Endpoint          | Description          | Auth Required |
| ------ | ----------------- | -------------------- | ------------- |
| POST   | `/api/issues`     | Create a new issue   | Yes           |
| GET    | `/api/issues`     | Get all issues       | No            |
| GET    | `/api/issues/:id` | Get a specific issue | No            |
| PATCH  | `/api/issues/:id` | Update an issue      | Yes\*         |
| DELETE | `/api/issues/:id` | Delete an issue      | Yes\*         |

\*Author or maintainer only

### Request/Response Examples

#### Signup

```json
POST /api/auth/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "contributor"
}
```

#### Login

```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Create Issue

```json
POST /api/issues
Authorization: Bearer <token>
{
  "title": "Login button not working",
  "description": "The login button on the homepage is unresponsive",
  "type": "bug"
}
```

#### Update Issue

```json
PATCH /api/issues/:id
Authorization: Bearer <token>
{
  "status": "in_progress",
  "title": "Updated title"
}
```

---

## Database Schema Summary

### Users Table

| Column     | Type        | Constraints                                           | Description                |
| ---------- | ----------- | ----------------------------------------------------- | -------------------------- |
| id         | SERIAL      | PRIMARY KEY                                           | Unique user identifier     |
| name       | VARCHAR(20) | -                                                     | User's full name           |
| email      | VARCHAR(20) | UNIQUE, NOT NULL                                      | User's email address       |
| password   | TEXT        | NOT NULL                                              | Encrypted password         |
| role       | VARCHAR(20) | CHECK (contributor/maintainer), DEFAULT 'contributor' | User role                  |
| created_at | TIMESTAMP   | DEFAULT NOW()                                         | Account creation timestamp |
| updated_at | TIMESTAMP   | DEFAULT NOW()                                         | Last update timestamp      |

### Issues Table

| Column      | Type         | Constraints                                       | Description                           |
| ----------- | ------------ | ------------------------------------------------- | ------------------------------------- |
| id          | SERIAL       | PRIMARY KEY                                       | Unique issue identifier               |
| title       | VARCHAR(100) | NOT NULL                                          | Issue title                           |
| description | TEXT         | -                                                 | Detailed issue description            |
| type        | VARCHAR(20)  | CHECK (bug/feature_request), NOT NULL             | Issue type                            |
| status      | VARCHAR(20)  | CHECK (open/in_progress/resolved), DEFAULT 'open' | Current issue status                  |
| reporter_id | INT          | REFERENCES users(id) ON DELETE CASCADE            | ID of the user who reported the issue |
| created_at  | TIMESTAMP    | DEFAULT NOW()                                     | Issue creation timestamp              |
| updated_at  | TIMESTAMP    | DEFAULT NOW()                                     | Last update timestamp                 |

---

## Project Structure

```
DevPulse/
├── src/
│   ├── app.ts                 # Express app configuration
│   ├── server.ts              # Server entry point
│   ├── config/                # Configuration files
│   ├── db/                    # Database initialization
│   ├── middleware/            # Custom middleware
│   │   ├── auth.ts           # Authentication middleware
│   │   ├── issue-delete-access.ts
│   │   └── issue-update-access.ts
│   ├── modules/              # Feature modules
│   │   ├── auth/             # Authentication module
│   │   └── issue/            # Issue management module
│   ├── types/                # TypeScript type definitions
│   └── utility/              # Helper functions
├── package.json
├── tsconfig.json
└── README.md
```

---

## Scripts

- `npm run dev` - Start development server with auto-reload using tsx watch
- `npm test` - Run tests (not yet configured)

---

## Security

- Passwords are hashed using bcryptjs before storage
- JWT tokens are used for stateless authentication
- Role-based access control is implemented for sensitive operations
- Environment variables are used for sensitive configuration

---

## Repository

https://github.com/theshameem/DevPulse
