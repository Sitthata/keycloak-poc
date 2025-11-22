import { Elysia, t } from "elysia";
import { authService } from "./auth.service";

export const authController = new Elysia({ prefix: "/auth" }).post(
  "/login",
  async ({ body, set }) => {
    try {
      const data = await authService.login(body.email, body.password);
      return data;
    } catch (error: any) {
      set.status = 401;
      return { error: error.message };
    }
  },
  {
    body: t.Object({
      email: t.String(),
      password: t.String(),
    }),
    detail: {
      tags: ["Auth"],
      summary: "Login with email and password",
    },
  }
);
