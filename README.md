# Keycloak POC with ElysiaJS

This Proof of Concept (POC) demonstrates a robust authentication system using **Keycloak** as the Identity Provider (IdP) and **ElysiaJS** as the backend framework. It features JWT validation, role-based access control (RBAC), and local user synchronization with **PostgreSQL** and **Prisma**.

## 📚 Documentation

- **[Technical Guide](docs/GUIDE.md)**: Deep dive into the authentication flow, middleware internals, and frontend integration.
- **[API Documentation](http://localhost:5556/docs)**: Swagger UI for exploring the API (available when running).

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) (v1.0+)
- [Docker](https://www.docker.com/) & Docker Compose

### 1. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env
```

_Note: The default values in `.env.example` work out-of-the-box with the provided Docker configuration._

### 2. Start Infrastructure

Start PostgreSQL and Keycloak containers:

```bash
docker-compose up -d
```

### 3. Configure Keycloak

1.  Access the Admin Console at [http://localhost:8080](http://localhost:8080) (User: `admin`, Pass: `admin`).
2.  Create a new Realm named `murasaki-poc`.
3.  Create a Client `elysia-backend` with:
    - **Client authentication**: On
    - **Standard flow**: On
    - **Direct access grants**: On
4.  Copy the **Client Secret** from the Credentials tab and update `KEYCLOAK_CLIENT_SECRET` in your `.env` file.
5.  Create a test user in the realm.

### 4. Initialize Database

Install dependencies and run migrations:

```bash
bun install
bunx prisma migrate dev --name init
```

### 5. Run the Server

Start the development server:

```bash
bun dev
```

The server will start at `http://localhost:5556`.

## 🧪 Testing

### Health Check

```bash
curl http://localhost:5556/health
```

### Login (Get Token)

```bash
curl -X POST http://localhost:5556/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "testuser@example.com", "password": "yourpassword"}'
```

### Create Post (Protected)

```bash
curl -X POST http://localhost:5556/posts \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title": "My First Post", "content": "Hello World"}'
```
