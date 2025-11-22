import { db } from "../../db";
import type { User } from "@prisma/client";

export const postsService = {
  async createPost(
    title: string,
    content: string | undefined,
    authorId: string
  ) {
    return db.post.create({
      data: {
        title,
        content,
        authorId,
      },
    });
  },

  async getPosts(user: User) {
    return db.post.findMany({
      where: {
        authorId: user.id,
      },
    });
  }
};
