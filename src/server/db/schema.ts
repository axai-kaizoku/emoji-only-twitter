// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator(
  (name) => `emoji-only-twitter_${name}`,
);

export const posts = createTable(
  "post",
  {
    id: serial("id").primaryKey(),
    content: varchar("content", { length: 256 }),
    authorId: varchar("author_id").default("user_2hvKCYaX6lWqR6l8M2oMfQCy1ym"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.authorId),
  }),
);

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}));

export const users = createTable("user", {
  id: varchar("userId", { length: 256 }),
  username: varchar("username", { length: 64 }),
  email: varchar("email", { length: 100 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));
