export type Post = {
  id: number;
  authorId: string | null;
  content: string | null;
  createdAt: Date;
  updatedAt: Date | null;
};
