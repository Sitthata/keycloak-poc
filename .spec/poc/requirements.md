# POC: Keycloak Integration with Elysia Backend

## Overview

This document outlines the requirements for a Proof of Concept (POC) to integrate Keycloak as the authentication provider for the Murasaki-edu Elysia backend. The goal is to establish a robust authentication pattern that can replace the current mock authentication system used by the Next.js frontend. This POC will serve as a technical blueprint for future authentication-related development.

## Functional Requirements

### FR-1: Keycloak Local Environment
- The system SHALL provide a clear, step-by-step guide for running Keycloak locally using Docker.
- The guide SHALL detail the process of creating a new realm and a client specifically for the Elysia application.
- The guide SHALL include instructions for creating a test user with credentials and adding custom attributes if necessary.

### FR-2: Login Endpoint
- The system SHALL expose a `POST /auth/login` endpoint in the Elysia backend.
- This endpoint MUST accept a JSON body containing `email` and `password` fields.

### FR-3: Keycloak Authentication Flow
- Upon receiving credentials at `/auth/login`, the Elysia backend SHALL communicate with the local Keycloak instance to authenticate the user.
- On successful authentication, the backend SHALL retrieve an access token, refresh token, and user information (such as OID/subject) from Keycloak.

### FR-4: Token Response
- A successful call to the `/auth/login` endpoint SHALL return a `200 OK` response.
- The response body MUST contain at least the `accessToken`, aligning with the future API contract expected by the frontend.

### FR-5: Protected Endpoint
- The system SHALL implement a protected test endpoint, `POST /posts`, to simulate creating a user-specific resource.
- Access to this endpoint MUST require a valid JWT access token issued by Keycloak.

### FR-6: Token Validation Middleware
- The system SHALL implement middleware within Elysia to protect specified routes.
- This middleware MUST inspect the `Authorization: Bearer <token>` header, validate the JWT's signature against Keycloak's public keys (via JWKS URI), and verify its claims (e.g., expiration, issuer).

## Scope

### In Scope
- A `docker-compose.yml` file to run Keycloak locally.
- A comprehensive guide on configuring a Keycloak realm, client, and test user for the project.
- Creation of a new `/auth/login` endpoint in the Elysia backend.
- Business logic to connect to Keycloak's OpenID Connect (OIDC) token endpoint for password grant exchange.
- Creation of a protected `POST /posts` endpoint for testing authenticated requests.
- Implementation of a reusable JWT validation middleware in Elysia.
- A `README.md` or similar guide detailing the entire setup and testing process.

### Out of Scope
- Frontend (Next.js) integration with the new Elysia endpoints.
- User registration or "Sign Up" flows.
- Password reset or "Forgot Password" functionality.
- Social login providers (e.g., Google, Microsoft).
- Advanced Role-Based Access Control (RBAC) beyond simple authentication.
- Token refresh mechanisms.
- Production deployment or hardening of Keycloak.

## User Stories

### US-1: Developer Setup
**As a** developer,
**I want** a simple command and a clear guide to set up a local Keycloak instance,
**so that** I can run the complete authentication stack on my machine for development and testing.

**Acceptance Criteria:**
- Given I have Docker installed,
- When I run a single command (e.g., `docker-compose up`),
- Then a Keycloak instance should start and be accessible.
- And I can follow a markdown guide to configure a realm, a client for Elysia, and a test user.

### US-2: User Authentication
**As a** user (represented by an API client like Insomnia or cURL),
**I want to** send my email and password to the `POST /auth/login` endpoint,
**so that** I can receive a JWT access token to authenticate myself for subsequent requests.

**Acceptance Criteria:**
- Given Keycloak and the Elysia backend are running,
- And a test user exists in Keycloak,
- When I send a POST request to `/auth/login` with correct credentials,
- Then I should receive a `200 OK` response containing an `accessToken`.
- When I send the same request with incorrect credentials,
- Then I should receive a `401 Unauthorized` response.

### US-3: Accessing Protected Resources
**As an** authenticated user (represented by an API client),
**I want to** use my JWT access token to make requests to protected endpoints,
**so that** I can access or create resources that are only available to logged-in users.

**Acceptance Criteria:**
- Given I have a valid access token from the login endpoint,
- When I make a `POST` request to `/posts` with an `Authorization: Bearer <token>` header,
- Then I should receive a `201 Created` or `200 OK` response.
- When I make the same request without a token, or with an invalid/expired token,
- Then I should receive a `401 Unauthorized` response.

## Non-Functional Requirements

### NFR-1: Security
- The Elysia backend MUST validate the signature of incoming JWTs using Keycloak's public keys to prevent token forgery.
- Client secrets and other sensitive configuration values MUST be managed through environment variables and not hardcoded.

### NFR-2: Documentation
- The entire process, from setup to testing, MUST be clearly documented in a `README.md` file within the POC directory. The documentation should be clear enough for any developer on the team to follow.

### NFR-3: Reusability
- The token validation logic should be implemented as a reusable middleware or plugin within Elysia to easily protect future endpoints.

## Success Criteria

- [ ] A developer can start the Keycloak service locally using a single command.
- [ ] A developer can follow the provided guide to configure a Keycloak realm, client, and a test user successfully.
- [ ] A `POST` request to `/auth/login` with valid credentials returns a `200 OK` response with a JWT access token.
- [ ] A `POST` request to `/auth/login` with invalid credentials returns a `401 Unauthorized` error.
- [ ] A request to the protected `POST /posts` endpoint without a token returns a `401 Unauthorized` error.
- [ ] A request to `POST /posts` with an invalid or expired token returns a `401 Unauthorized` error.
- [ ] A request to `POST /posts` with a valid `Authorization: Bearer <token>` header returns a successful (`200` or `201`) response.
- [ ] The implementation includes clear documentation covering setup, configuration, and testing steps.
