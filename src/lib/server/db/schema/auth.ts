import { sqliteTable as table, text, integer } from 'drizzle-orm/sqlite-core';

export const user = table('user', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const session = table('session', {
	id: text('id').primaryKey(),
	userId: text('user_id').notNull().references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export type ISession = typeof session.$inferSelect;

export type IUser = typeof user.$inferSelect;