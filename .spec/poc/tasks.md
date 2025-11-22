# POC: Keycloak Integration - Implementation Tasks

This document breaks down the implementation of the Keycloak POC into specific, actionable tasks.

---

## 1. Project Foundation & Environment

- [ ] 1.1. Initialize a new Bun project: `bun init`
- [ ] 1.2. Install required dependencies:
  ```bash
  bun add elysia @elysiajs/swagger logestic prisma @prisma/client jose
  ```
- [ ] 1.3. Install development dependencies:
  ```bash
  bun add -d typescript @types/bun
  ```
- [ ] 1.4. Create the project directory structure as defined in `design.md`.
- [ ] 1.5. Create the `docker-compose.yml` file with services for `postgres` and `keycloak`.
- [ ] 1.6. Create an `.env.example` file to document all required environment variables.
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
- [ ] 1.7. Create a local `.env` file and populate it with the correct values.
- [ ] 1.8. Add `.env` and `node_modules/` to the `.gitignore` file.

---

## 2. Database & Prisma Setup

- [ ] 2.1. Run `docker-compose up -d` and verify that the `postgres` container starts successfully.
- [ ] 2.2. Initialize Prisma: `bunx prisma init --datasource-provider postgresql`
- [ ] 2.3. Update the `src/db/schema.prisma` file with the `User` and `Post` models from the design document.
- [ ] 2.4. Run the initial database migration to create the tables: `bunx prisma migrate dev --name init`
- [ ] 2.5. Create `src/db/index.ts` to export a global instance of the Prisma client.
  ```typescript
  // src/db/index.ts
  import { PrismaClient } from '@prisma/client'
  export const db = new PrismaClient()
  ```

---

## 3. Keycloak Configuration

- [ ] 3.1. Run `docker-compose up -d` and verify the `keycloak` container starts.
- [ ] 3.2. Access the Keycloak Admin Console at `http://localhost:8080` and log in with the admin credentials.
- [ ] 3.3. **Create a new Realm**:
    - [ ] Name it `murasaki-poc` (or as defined in `.env`).
- [ ] 3.4. **Create a new Client**:
    - [ ] Within the new realm, create a client with Client ID `elysia-backend`.
    - [ ] Set "Client authentication" to `On`.
    - [ ] Ensure "Standard flow" and "Direct access grants" are enabled.
    - [ ] In the "Credentials" tab, copy the "Client secret" and add it to your `.env` file.
- [ ] 3.5. **Create a Test User**:
    - [ ] In the "Users" section, create a new user.
    - [ ] Set a username (e.g., `testuser`).
    - [ ] In the "Credentials" tab, set a password for the user and mark it as non-temporary.

---

## 4. Elysia Application Core

- [ ] 4.1. Create the main entrypoint file `src/index.ts`.
- [ ] 4.2. Initialize the Elysia server instance.
- [ ] 4.3. Add the `logestic` plugin using the "fancy" preset.
- [ ] 4.4. Add the `@elysiajs/swagger` plugin to expose API docs at `/api/docs`.
- [ ] 4.5. Implement a basic `GET /health` endpoint for health checks.
- [ ] 4.6. Configure the app to listen on the port specified in the `.env` file (default `5556`).
- [ ] 4.7. Add a `dev` script to `package.json` to run the server: `"dev": "bun --watch src/index.ts"`

---

## 5. Authentication Module Implementation

- [ ] 5.1. Create the authentication service file `src/modules/auth/auth.service.ts`.
- [ ] 5.2. Implement the `login` function in the service. This function should:
    - [ ] Accept `email` and `password`.
    - [ ] Make a `POST` request to the Keycloak token endpoint using `fetch`.
    - [ ] Use `application/x-www-form-urlencoded` as the content type.
    - [ ] Send `grant_type`, `client_id`, `client_secret`, `username`, and `password`.
    - [ ] Return the token data on success or throw an error on failure.
- [ ] 5.3. Create the authentication controller `src/modules/auth/auth.controller.ts`.
- [ ] 5.4. Define the `POST /auth/login` route in the controller.
- [ ] 5.5. Add input validation for the request body (`email`, `password`).
- [ ] 5.6. Connect the controller route to the `login` function in the service.
- [ ] 5.7. Add the auth controller to `src/index.ts`.

---

## 6. Auth Middleware Implementation

- [ ] 6.1. Create the middleware file `src/middleware/auth.middleware.ts`.
- [ ] 6.2. Implement an Elysia plugin that provides a `protect` function.
- [ ] 6.3. Inside `protect`, add a `beforeHandle` hook to:
    - [ ] Extract the bearer token from the `Authorization` header. Throw `401` if missing.
    - [ ] Use the `jose` library to verify the token's signature and claims.
        - Fetch the JWKS (JSON Web Key Set) from `${KEYCLOAK_ISSUER_URL}/.well-known/openid-configuration`.
        - Use `jose.createRemoteJWKSet` for key validation.
        - Use `jose.jwtVerify` to validate the token.
    - [ ] On successful validation, decode the token payload.
    - [ ] Use the `sub` claim from the token to find or create a user in the local database via Prisma (`db.user.upsert`).
    - [ ] Attach the user's database record (or at least the `id`) to the Elysia context (e.g., `context.user`).
    - [ ] Throw `401` if token validation fails.

---

## 7. Posts Module Implementation

- [ ] 7.1. Create the posts service `src/modules/posts/posts.service.ts`.
- [ ] 7.2. Implement a `createPost` function that accepts `title`, `content`, and `authorId`. It should use Prisma to create a new `Post` record.
- [ ] 7.3. Create the posts controller `src/modules/posts/posts.controller.ts`.
- [ ] 7.4. Define the `POST /posts` route in the controller.
- [ ] 7.5. Apply the `auth.middleware.ts` to this route to protect it.
- [ ] 7.6. In the handler, retrieve the `user` object from the context.
- [ ] 7.7. Call the `createPost` service function, passing in the request body and the `user.id` as the `authorId`.
- [ ] 7.8. Add the posts controller to `src/index.ts`.

---

## 8. Manual Testing & Validation

- [ ] 8.1. **System Startup**: Run `docker-compose up` and `bun run dev`. Verify all services start without errors.
- [ ] 8.2. **Health Check**: Access `http://localhost:5556/health` and expect a `200 OK` response.
- [ ] 8.3. **API Docs**: Access `http://localhost:5556/api/docs` and verify the Swagger UI loads with the defined endpoints.
- [ ] 8.4. **Login Failure**: Use an API client to test `POST /auth/login` with incorrect credentials. Expect a `401 Unauthorized` response.
- [ ] 8.5. **Login Success**: Test `POST /auth/login` with the correct test user credentials. Expect a `200 OK` response with tokens.
- [ ] 8.6. **Protected Route (No Token)**: Test `POST /posts` without an `Authorization` header. Expect `401 Unauthorized`.
- [ ] 8.7. **Protected Route (Invalid Token)**: Test `POST /posts` with a malformed or expired token. Expect `401 Unauthorized`.
- [ ] 8.8. **Protected Route (Success)**: Test `POST /posts` with a valid bearer token from the login step. Expect a `201 Created` response with the post data.
- [ ] 8.9. **Database Verification**: Connect to the PostgreSQL database and verify that a `User` record was created/updated and that the new `Post` record was created and correctly associated with that user.

---

## 9. Documentation

- [ ] 9.1. Create a `README.md` file at the root of the POC directory.
- [ ] 9.2. Add a "Getting Started" section explaining how to set up the `.env` file and run `docker-compose up`.
- [ ] 9.3. Add the step-by-step guide for configuring the Keycloak realm, client, and user.
- [ ] 9.4. Document the command to run the application (`bun run dev`).
- [ ] 9.5. List the main API endpoints and how to test them.
