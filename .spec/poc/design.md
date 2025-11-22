# POC: Keycloak Integration - Design Document

## 1. Architecture Overview

This Proof of Concept (POC) demonstrates integrating Keycloak for authentication within an ElysiaJS backend, supported by a PostgreSQL database managed via Prisma ORM.

### System Components
1.  **ElysiaJS Application**: The core backend service running on port `5556`. It handles API requests, business logic, and communicates with the database and Keycloak.
2.  **Keycloak**: An external identity and access management service running in a Docker container on port `8080`. It is the single source of truth for user authentication, issuing and validating JSON Web Tokens (JWTs).
3.  **PostgreSQL**: A relational database running in a Docker container on port `5555`. It stores application-specific data, such as user profiles and posts, that is not related to authentication credentials.
4.  **Prisma**: The Object-Relational Mapper (ORM) used by the ElysiaJS application to interact with the PostgreSQL database in a type-safe manner.

### Authentication Flow
```
Client (e.g., API Tester)
 │
 │ 1. POST /auth/login { email, password }
 ▼
ElysiaJS Backend
 │ │
 │ │ 2. Send credentials to Keycloak Token Endpoint
 │ ▼
 │ Keycloak
 │ │ 3. Validate credentials, return JWT
 │ │
 │ │
 │ 4. Return JWT to Client
 ▼ │
Client │
 │ │
 │ 5. GET /posts (Authorization: Bearer <JWT>)
 │
 │
 ▼
ElysiaJS Backend (Auth Middleware)
   │
   │ 6. Validate JWT with Keycloak's Public Keys
   ▼
 Keycloak (JWKS URI)
   │ 7. Return Public Keys for validation
   │
   │
 ▼
ElysiaJS Backend
   │ 8. JWT is valid, process request
   │ 9. Use Prisma to fetch data from PostgreSQL
   ▼
PostgreSQL Database
```

## 2. Technical Design

### Technology Stack
- **Backend Framework**: ElysiaJS
- **Authentication**: Keycloak (via OpenID Connect protocol)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **API Documentation**: `elysia-swagger` (OpenAPI)
- **Logging**: `logestic`
- **Containerization**: Docker Compose

### Project Structure
The project will follow a modular structure to separate concerns.

```
/
├── src/
│   ├── index.ts              # Main entry point, server setup, middleware
│   ├── config/
│   │   └── env.ts            # Environment variable validation
│   ├── db/
│   │   ├── index.ts          # Export configured Prisma client instance
│   │   └── schema.prisma     # Prisma schema definition
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts # Route handlers for /auth/*
│   │   │   └── auth.service.ts    # Business logic for Keycloak communication
│   │   └── posts/
│   │       ├── posts.controller.ts # Route handlers for /posts/*
│   │       └── posts.service.ts    # Business logic for creating/reading posts
│   └── middleware/
│       └── auth.middleware.ts  # JWT validation middleware
├── .env                        # Local environment variables
├── .env.example                # Example environment variables
├── docker-compose.yml        # Docker services for Keycloak and PostgreSQL
├── package.json
└── tsconfig.json
```

## 3. Database Schema Design (Prisma)

The `schema.prisma` file will define the models for our application data stored in PostgreSQL. The `User` model will be linked to Keycloak users via the `keycloak_oid` field, which stores the unique subject (`sub`) claim from the JWT.

**File: `src/db/schema.prisma`**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String    @id @default(cuid())
  keycloak_oid String    @unique // Stores the 'sub' from Keycloak's JWT
  email        String    @unique
  firstname    String?
  lastname     String?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  posts Post[]
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  author   User   @relation(fields: [authorId], references: [id])
  authorId String
}
```

## 4. API Design

### 4.1. API Documentation
- **Endpoint**: `/api/docs`
- **Description**: An interactive OpenAPI (Swagger) UI will be available for exploring and testing the API endpoints. This will be generated automatically by `elysia-swagger`.

### 4.2. Authentication Endpoint
- **Route**: `POST /auth/login`
- **Description**: Authenticates a user against Keycloak using the password grant type.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "accessToken": "ey...",
    "refreshToken": "ey...",
    "expiresIn": 300
  }
  ```
- **Error Response (401 Unauthorized)**:
  ```json
  {
    "error": "Invalid credentials"
  }
  ```

### 4.3. Protected Endpoint
- **Route**: `POST /posts`
- **Description**: A protected endpoint to create a new post. It requires a valid JWT. The author of the post is identified from the `sub` claim in the token.
- **Headers**: `Authorization: Bearer <accessToken>`
- **Request Body**:
  ```json
  {
    "title": "My First Post",
    "content": "This is the content of the post."
  }
  ```
- **Success Response (201 Created)**: Returns the newly created post object from the database.
- **Error Response (401 Unauthorized)**: Returned if the token is missing, invalid, or expired.

## 5. Docker Compose Setup

A single `docker-compose.yml` file will manage the local development environment, including PostgreSQL and Keycloak.

**File: `docker-compose.yml`**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    container_name: poc_db_postgres
    restart: always
    environment:
      POSTGRES_USER: ${DB_USER:-user}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-password}
      POSTGRES_DB: ${DB_NAME:-poc_db}
    ports:
      - "${DB_PORT:-5555}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER:-user} -d ${DB_NAME:-poc_db}"]
      interval: 10s
      timeout: 5s
      retries: 5

  keycloak:
    image: quay.io/keycloak/keycloak:latest
    container_name: poc_db_keycloak
    command: start-dev
    environment:
      KEYCLOAK_ADMIN: ${KEYCLOAK_ADMIN_USER:-admin}
      KEYCLOAK_ADMIN_PASSWORD: ${KEYCLOAK_ADMIN_PASSWORD:-admin}
    ports:
      - "${KEYCLOAK_PORT:-8080}:8080"
    restart: always

volumes:
  postgres_data:
    driver: local
```
This setup allows for easy configuration using a `.env` file.

## 6. Implementation Plan

### 6.1. Project Initialization
- Initialize a new Bun/Node.js project.
- Install dependencies: `elysia`, `prisma`, `@prisma/client`, `logestic`, `elysia-swagger`, and development dependencies like `typescript`.

### 6.2. Server Setup (`src/index.ts`)
- Initialize an Elysia instance.
- Apply the `logestic` logger with `Logestic.preset("fancy")`.
- Integrate `elysia-swagger` to serve documentation on `/api/docs`.
- Configure the server to listen on port `5556`.

### 6.3. Prisma Setup
- Initialize Prisma with `prisma init`.
- Update `schema.prisma` with the `User` and `Post` models.
- Create and run the initial migration using `prisma migrate dev`.

### 6.4. Authentication Middleware (`src/middleware/auth.middleware.ts`)
- The middleware will be an Elysia plugin.
- It will extract the bearer token from the `Authorization` header.
- Use a library like `jose` to validate the token against Keycloak's JWKS (JSON Web Key Set) URI.
- On successful validation, it will fetch or create a user record in the local PostgreSQL database (linking `keycloak_oid`).
- The user's database ID and Keycloak `sub` will be attached to the request context for use in protected routes.
- If validation fails, it will throw a `401 Unauthorized` error.

### 6.5. Login Service (`src/modules/auth/auth.service.ts`)
- This service will contain a function to handle the login logic.
- It will construct a `x-www-form-urlencoded` request to Keycloak's token endpoint (`/realms/{realm-name}/protocol/openid-connect/token`).
- The payload will include `grant_type=password`, `client_id`, `username`, and `password`.
- It will use `fetch` to send the request and will handle parsing the token from the response.
