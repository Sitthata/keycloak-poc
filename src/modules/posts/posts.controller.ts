import { Elysia, t } from "elysia";
import { authMiddleware } from "../../middleware/auth.middleware";
import { postsService } from "./posts.service";

export const postsController = new Elysia({ prefix: "/posts" })
  .use(authMiddleware)
  .post(
    "/",
    async ({ body, user, set }: any) => {
      try {
        const post = await postsService.createPost(
          body.title,
          body.content,
          user.id
        );
        set.status = 201;
        return post;
      } catch (error: any) {
        set.status = 500;
        return { error: error.message };
      }
    },
    {
      body: t.Object({
        title: t.String(),
        content: t.Optional(t.String()),
      }),
      detail: {
        tags: ["Posts"],
        summary: "Create a new post",
        security: [{ BearerAuth: [] }],
      },
    }
  );
