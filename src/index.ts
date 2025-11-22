import { Elysia } from "elysia";
import { openapi } from "@elysiajs/openapi";
import { cors } from "@elysiajs/cors";
import { Logestic } from "logestic";

const port = process.env.PORT || 5556;

import { authController } from "./modules/auth/auth.controller";

import { postsController } from "./modules/posts/posts.controller";

const app = new Elysia()
  .use(cors())
  .use(Logestic.preset("fancy"))
  .use(
    openapi({
      path: "/docs",
      documentation: {
        info: {
          title: "Keycloak POC API",
          version: "1.0.0",
        },
        components: {
          securitySchemes: {
            BearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
      },
    })
  )
  .use(authController)
  .use(postsController)
  .get("/health", () => ({ status: "ok" }))
  .listen(port);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

console.log(`Access API docs at http://localhost:${app.server?.port}/docs`);

export type App = typeof app;
