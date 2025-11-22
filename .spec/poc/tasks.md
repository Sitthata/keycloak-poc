# POC: Keycloak Integration - Implementation Tasks

This document breaks down the implementation of the Keycloak POC into specific, actionable tasks.

---

## 1. Project Foundation & Environment

- [x] 1.1. Initialize a new Bun project: `bun init`
- [x] 1.2. Install required dependencies:
  ```bash
  bun add elysia @elysiajs/swagger logestic prisma @prisma/client jose
  ```
- [ ] 1.3. Install development dependencies:
  ```bash
  bun add -d typescript @types/bun
  ```
- [x] 1.4. Create the project directory structure as defined in `design.md`.
- [x] 1.5. Create the `docker-compose.yml` file with services for `postgres` and `keycloak`.
- [x] 1.6. Create an `.env.example` file to document all required environment variables.

  ```env
  # Application
  PORT=5556

  # Database (PostgreSQL)
  DB_HOST=localhost
  DB_PORT=5555
  DB_USER=user
  DB_PASSWORD=password
  DB_NAME=poc_db
  DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public"

  # Keycloak Admin
  KEYCLOAK_PORT=8080
  KEYCLOAK_ADMIN_USER=admin
  KEYCLOAK_ADMIN_PASSWORD=admin

  # Keycloak Client for Elysia
  KEYCLOAK_REALM=murasaki-poc
  KEYCLOAK_CLIENT_ID=elysia-backend
  KEYCLOAK_CLIENT_SECRET= # Get this from Keycloak UI
  KEYCLOAK_ISSUER_URL=http://localhost:8080/realms/${KEYCLOAK_REALM}
  ```

- [x] 1.7. Create a local `.env` file and populate it with the correct values.
- [x] 1.8. Add `.env` and `node_modules/` to the `.gitignore` file.

---

## 2. Database & Prisma Setup

- [x] 2.1. Run `docker-compose up -d` and verify that the `postgres` container starts successfully.
- [x] 2.2. Initialize Prisma: `bunx prisma init --datasource-provider postgresql`
- [x] 2.3. Update the `src/db/schema.prisma` file with the `User` and `Post` models from the design document.
- [x] 2.4. Run the initial database migration to create the tables: `bunx prisma migrate dev --name init`
- [x] 2.5. Create `src/db/index.ts` to export a global instance of the Prisma client.
  ```typescript
  // src/db/index.ts
  import { PrismaClient } from "@prisma/client";
  export const db = new PrismaClient();
  ```

---

## 3. Keycloak Configuration

- [x] 3.1. Run `docker-compose up -d` and verify the `keycloak` container starts.
- [x] 3.2. Access the Keycloak Admin Console at `http://localhost:8080` and log in with the admin credentials.
- [x] 3.3. **Create a new Realm**:
  - [x] Name it `murasaki-poc` (or as defined in `.env`).
- [x] 3.4. **Create a new Client**:
  - [x] Within the new realm, create a client with Client ID `elysia-backend`.
  - [x] Set "Client authentication" to `On`.
  - [x] Ensure "Standard flow" and "Direct access grants" are enabled.
  - [x] In the "Credentials" tab, copy the "Client secret" and add it to your `.env` file.
- [x] 3.5. **Create a Test User**:
  - [x] In the "Users" section, create a new user.
  - [x] Set a username (e.g., `testuser`).
  - [ ] In the "Credentials" tab, set a password for the user and mark it as non-temporary.

---

## 4. Elysia Application Core

- [x] 4.1. Create the main entrypoint file `src/index.ts`.
- [x] 4.2. Initialize the Elysia server instance.
- [x] 4.3. Add the `logestic` plugin using the "fancy" preset.
- [x] 4.4. Add the `@elysiajs/swagger` plugin to expose API docs at `/api/docs`.
- [x] 4.5. Implement a basic `GET /health` endpoint for health checks.
- [x] 4.6. Configure the app to listen on the port specified in the `.env` file (default `5556`).
- [x] 4.7. Add a `dev` script to `package.json` to run the server: `"dev": "bun --watch src/index.ts"`

---

## 5. Authentication Module Implementation

- [x] 5.1. Create the authentication service file `src/modules/auth/auth.service.ts`.
- [x] 5.2. Implement the `login` function in the service. This function should:
  - [x] Accept `email` and `password`.
  - [x] Make a `POST` request to the Keycloak token endpoint using `fetch`.
  - [x] Use `application/x-www-form-urlencoded` as the content type.
  - [x] Send `grant_type`, `client_id`, `client_secret`, `username`, and `password`.
  - [x] Return the token data on success or throw an error on failure.
- [x] 5.3. Create the authentication controller `src/modules/auth/auth.controller.ts`.
- [x] 5.4. Define the `POST /auth/login` route in the controller.
- [x] 5.5. Add input validation for the request body (`email`, `password`).
- [x] 5.6. Connect the controller route to the `login` function in the service.
- [x] 5.7. Add the auth controller to `src/index.ts`.

---

## 6. Auth Middleware Implementation

- [x] 6.1. Create the middleware file `src/middleware/auth.middleware.ts`.
- [x] 6.2. Implement an Elysia plugin that provides a `protect` function.
- [x] 6.3. Inside `protect`, add a `beforeHandle` hook to:
  - [x] Extract the bearer token from the `Authorization` header. Throw `401` if missing.
  - [x] Use the `jose` library to verify the token's signature and claims.
    - Fetch the JWKS (JSON Web Key Set) from `${KEYCLOAK_ISSUER_URL}/.well-known/openid-configuration`.
    - Use `jose.createRemoteJWKSet` for key validation.
    - Use `jose.jwtVerify` to validate the token.
  - [x] On successful validation, decode the token payload.
  - [x] Use the `sub` claim from the token to find or create a user in the local database via Prisma (`db.user.upsert`).
  - [x] Attach the user's database record (or at least the `id`) to the Elysia context (e.g., `context.user`).
  - [x] Throw `401` if token validation fails.

---

## 7. Posts Module Implementation

- [x] 7.1. Create the posts service `src/modules/posts/posts.service.ts`.
- [x] 7.2. Implement a `createPost` function that accepts `title`, `content`, and `authorId`. It should use Prisma to create a new `Post` record.
- [x] 7.3. Create the posts controller `src/modules/posts/posts.controller.ts`.
- [x] 7.4. Define the `POST /posts` route in the controller.
- [x] 7.5. Apply the `auth.middleware.ts` to this route to protect it.
- [x] 7.6. In the handler, retrieve the `user` object from the context.
- [x] 7.7. Call the `createPost` service function, passing in the request body and the `user.id` as the `authorId`.
- [x] 7.8. Add the posts controller to `src/index.ts`.

---

## 8. Manual Testing & Validation

- [x] 8.1. **System Startup**: Run `docker-compose up` and `bun run dev`. Verify all services start without errors.
- [x] 8.2. **Health Check**: Access `http://localhost:5556/health` and expect a `200 OK` response.
- [x] 8.3. **API Docs**: Access `http://localhost:5556/docs` and verify the Swagger UI loads with the defined endpoints.
- [x] 8.4. **Login Failure**: Use an API client to test `POST /auth/login` with incorrect credentials. Expect a `401 Unauthorized` response.
- [x] 8.5. **Login Success**: Test `POST /auth/login` with the correct test user credentials. Expect a `200 OK` response with tokens.
- [x] 8.6. **Protected Route (No Token)**: Test `POST /posts` without an `Authorization` header. Expect `401 Unauthorized`.
- [x] 8.7. **Protected Route (Invalid Token)**: Test `POST /posts` with a malformed or expired token. Expect `401 Unauthorized`.
- [x] 8.8. **Protected Route (Success)**: Test `POST /posts` with a valid bearer token from the login step. Expect a `201 Created` response with the post data.
- [x] 8.9. **Database Verification**: Connect to the PostgreSQL database and verify that a `User` record was created/updated and that the new `Post` record was created and correctly associated with that user.

---

## 9. Documentation

- [x] 9.1. Create a `README.md` file at the root of the POC directory.
- [x] 9.2. Add a "Getting Started" section explaining how to set up the `.env` file and run `docker-compose up`.
- [x] 9.3. Add the step-by-step guide for configuring the Keycloak realm, client, and user.
- [x] 9.4. Document the command to run the application (`bun run dev`).
- [x] 9.5. List the main API endpoints and how to test them.
