import { db } from "../../db";

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
};
